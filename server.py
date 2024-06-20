# This file is the main file for the web server. It handles all the routes and the main server setup.
import aiohttp
from quart import Quart, request, session, render_template, jsonify
import settings as _WebSettings
import asyncpg
import datetime
import logging
import colorlog
from quartcord import DiscordOAuth2Session
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import io
import pytesseract
import base64
import os
import cv2
import numpy as np

class WebQuart(Quart):
    def __init__(self, name, static_folder):
        super().__init__(name, static_folder=static_folder)
        self.pool: asyncpg.Pool = None
        self.discord: DiscordOAuth2Session = None
        self.session: aiohttp.ClientSession = None

    async def get_pool(self) -> asyncpg.Pool:
        return self.pool
    
app = WebQuart(__name__, static_folder="./static")

app.secret_key = b"random bytes representing quart secret key"

log = logging.getLogger("hypercorn")
log.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(
    colorlog.ColoredFormatter(
        "[APP] %(log_color)s%(message)s",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "red,bg_white",
        },
    )
)

log.addHandler(handler)

app.config["DISCORD_CLIENT_ID"] = _WebSettings.DISCORD_CLIENT_ID  # Discord client ID.
app.config["DISCORD_CLIENT_SECRET"] = (
    _WebSettings.DISCORD_CLIENT_SECRET
)  # Discord client secret.
app.config["DISCORD_REDIRECT_URI"] = (
    _WebSettings.DISCORD_REDIRECT_URI
)  # URL to your callback endpoint.
app.config["DISCORD_BOT_TOKEN"] = _WebSettings.DISCORD_TOKEN

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

@app.before_serving
async def startup():
    app.pool = await asyncpg.create_pool(_WebSettings.DB)
    log.info(f"[DATABASE] Connected: {app.pool}")
    app.session = aiohttp.ClientSession()

@app.before_request
def make_session_permanent():
    session.permanent = True

resonator_names = _WebSettings.RESONATORS

def crop_image(image, crop_area):
    return image.crop(crop_area)

async def extract_text_from_image(image, roi, debug_label=""):
    pil_image = image.crop(roi)
    pil_image = ImageOps.grayscale(pil_image)
    debug_image_path = f'./debug_{debug_label}.png'
    pil_image.save(debug_image_path)
    config = '--psm 6'
    text = pytesseract.image_to_string(pil_image, config=config, lang='eng')
    return text.strip()

@app.route("/api/generate_build", methods=["POST"])
async def gen_build():
    files = await request.files
    images = [Image.open(io.BytesIO(files[file].read())) for file in files]

    # Perform OCR on the cropped first image for specific text areas
    first_image = crop_image(images[0], (200, 150, 600, 400))
    name_roi = (135, 5, 384, 62)
    yellow_text_roi = (139, 53, 290, 102)
    level_roi = (43, 164, 220, 204)
    
    name_text = await extract_text_from_image(first_image, name_roi, "name")
    yellow_text = await extract_text_from_image(first_image, yellow_text_roi, "yellow_text")
    level_text = await extract_text_from_image(first_image, level_roi, "level")
    
    if name_text not in resonator_names:
        return jsonify({
            "error": "Resonator name not found. Are you sure you uploaded the correct images?"
        })

    # Look for the corresponding 3D icon image
    resonator_image_path = f'./static/3dicons/{name_text.lower()}3d.png'
    if not os.path.exists(resonator_image_path):
        return jsonify({
            "error": f"3D icon for {name_text} not found."
        })
    
    resonator_image = Image.open(resonator_image_path)

    # Crop the second image
    second_image = crop_image(images[1], (225, 159, 225 + 570, 159 + 1016))

    # Crop the first original image with the specified ROIs
    first_original_cropped = crop_image(images[0], (510, 7, 2190, 140))

    # Define the canvas size with a 25:8 aspect ratio
    canvas_width = 2500
    canvas_height = int(canvas_width * 8 / 25)
    
    final_image = Image.new('RGB', (canvas_width, canvas_height), (255, 255, 255))
    
    # Resize the resonator image to the full height of the canvas
    aspect_ratio_resonator = resonator_image.width / resonator_image.height
    new_resonator_width = int(canvas_height * aspect_ratio_resonator)
    resized_resonator_image = resonator_image.resize((new_resonator_width, canvas_height), Image.LANCZOS)
    
    # Resize the second image to the full height of the canvas
    aspect_ratio_second = second_image.width / second_image.height
    new_second_width = int(canvas_height * aspect_ratio_second)
    resized_second_image = second_image.resize((new_second_width, canvas_height), Image.LANCZOS)
    
    # Paste the resized resonator image on the left side of the canvas
    final_image.paste(resized_resonator_image, (0, 0))
    
    # Paste the resized second image next to the resonator image
    final_image.paste(resized_second_image, (new_resonator_width, 0))
    
    # Calculate the space available for the first cropped image
    remaining_width = canvas_width - new_resonator_width - new_second_width
    remaining_height = canvas_height // 2  # Space left for the first cropped image

    # Resize the first original cropped image to fit the remaining width and calculated height
    aspect_ratio_first_cropped = first_original_cropped.width / first_original_cropped.height
    new_first_cropped_width = remaining_width
    new_first_cropped_height = remaining_height
    resized_first_cropped = first_original_cropped.resize((new_first_cropped_width, new_first_cropped_height), Image.LANCZOS)
    y_position = 0
    x_position = new_resonator_width + new_second_width

    # Paste the resized first cropped image at the calculated position
    final_image.paste(resized_first_cropped, (x_position, y_position))

    # Crop the stats areas and paste them in two columns on top of the last pasted image
    stats_rois = [
        (240, 388, 783, 435),
        (240, 434, 779, 484),
        (240, 484, 780, 532),
        (240, 531, 778, 580),
        (240, 580, 781, 627),
        (240, 627, 780, 675)
    ]
    stat_images = [crop_image(images[0], roi) for roi in stats_rois]
    column_width = new_first_cropped_width // 2
    column_height = new_first_cropped_height // 3
    x_margin = 20
    y_margin = 10  # Reduced margin to move the images up

    for i, stat_img in enumerate(stat_images):
        resized_stat_img = stat_img.resize((int(column_width * 0.9), int(column_height * 0.4)), Image.LANCZOS)
        col_x_position = x_position + (i % 2) * (column_width + x_margin) + (column_width - resized_stat_img.width) // 2
        row_y_position = y_position + y_margin + (i // 2) * (column_height + y_margin) + (column_height - resized_stat_img.height) // 2
        final_image.paste(resized_stat_img, (col_x_position, row_y_position))

    # Adjust the y_position for the next section
    y_position = canvas_height // 2

    # Paste images 3, 4, 5, 6, and 7 in a single row
    images_3_to_7 = [crop_image(images[i], (1868, 185, 1868 + 587, 185 + 461)) for i in range(2, 7)]
    
    # Calculate total width for images 3 to 7
    total_width_3_to_7 = sum(img.width for img in images_3_to_7)
    
    # Calculate scaling factor to fit the images within the remaining width
    scaling_factor = remaining_width / total_width_3_to_7
    
    # Resize and paste the images
    x_offset = x_position
    for img in images_3_to_7:
        new_width = int(img.width * scaling_factor)
        new_height = int(img.height * scaling_factor)
        resized_img = img.resize((new_width, new_height), Image.LANCZOS)
        final_image.paste(resized_img, (x_offset, y_position))
        x_offset += new_width

    # Save the final image in memory
    in_memory_file = io.BytesIO()
    final_image.save(in_memory_file, format="PNG")
    
    final_image_base64 = base64.b64encode(in_memory_file.getvalue()).decode('utf-8')
    
    return jsonify({
        "image": final_image_base64,
        "name": name_text,
        "level": level_text,
        "yellow_text": yellow_text
    })


@app.route("/privacy")
async def privacy():
    return await render_template("privacy.html")

@app.route("/wuwa/generate")
async def wuwagen():
    news_entry = await app.pool.fetch("SELECT * FROM news ORDER BY date DESC")
    return await render_template("wuwagen.html", news_entry=news_entry)


@app.route("/wuwa/news/publish", methods=["POST"])
async def wuwanews():
    data = await request.get_json()
    if not data:
        return {"status": "error", "message": "No data provided."}
    
    _must_have = [
        "title",
        "content",
        "author",
        "author_image_url",
        "footer",
        "date"
    ]

    if not all([x in data for x in _must_have]):
        return {"status": "error", "message": "Missing required fields: {}".format(", ".join([x for x in _must_have if x not in data]))}

    await app.pool.execute("INSERT INTO news (title, content, author, author_image_url, footer, date) VALUES ($1, $2, $3, $4, $5, $6)", data["title"], data["content"], data["author"], data["author_image_url"], data["footer"], datetime.datetime.utcfromtimestamp(data["date"]))

    return {"status": "success", "payload": data}

@app.route("/", methods=["GET"])
async def home():
    return "Hello"