import asyncio
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageColor
import io
import os
import base64
import pytesseract
from quart import jsonify
import settings as _WebSettings
import aioboto3
import tempfile
import settings
import logging
import random
import string
from quart import Quart
import re

log = logging.getLogger("hypercorn")
log.setLevel(logging.INFO)

resonator_names = _WebSettings.RESONATORS

executor = ThreadPoolExecutor()

def crop_image(image, crop_area):
    return image.crop(crop_area)

font_path = './static/fonts/H7GBKHeavy.TTF'
font_size = 20
font = ImageFont.truetype(font_path, font_size)

def generate_random_string(length=16):
    characters = string.ascii_letters + string.digits  # Includes uppercase, lowercase letters, and digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

def apply_vignette(image, blur_radius_factor=0.2, enhance_factor=0.4):
    width, height = image.size
    vignette = Image.new('L', (width, height), 0)
    for x in range(width):
        for y in range(height):
            # Make the distance calculation more aggressive
            distance = ((x - width / 2) ** 2 + (y - height / 2) ** 2) ** 0.75
            max_distance = ((width / 2) ** 2 + (height / 2) ** 2) ** 0.75
            vignette.putpixel((x, y), int(255 * (1 - distance / max_distance)))

    blur_radius = width * blur_radius_factor  # Adjust blur radius factor
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    enhancer = ImageEnhance.Brightness(vignette)
    vignette = enhancer.enhance(enhance_factor)  # Adjust enhance factor
    image = Image.composite(image, Image.new('RGB', image.size, 'black'), vignette)
    return image

async def extract_text_from_image(image, roi, debug_label="", psm="6", mob=False):
    if mob == True:
        pil_image = image.crop(roi)
        text = pytesseract.image_to_string(pil_image, config=f'--psm {psm}', lang='eng')
        return text.strip()
    
    pil_image = image.crop(roi)
    pil_image = ImageOps.grayscale(pil_image)
    debug_image_path = f'./debug_{debug_label}.png'
    pil_image.save(debug_image_path)
    config = f'--psm 6'
    text = pytesseract.image_to_string(pil_image, config=config, lang='eng')
    return text.strip()

def crop_to_circle(image, roi):
    cropped_image = image.crop(roi)
    mask = Image.new('L', cropped_image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, cropped_image.size[0], cropped_image.size[1]), fill=255)
    cropped_image.putalpha(mask)
    circular_cropped_image = Image.new('RGBA', cropped_image.size, (0, 0, 0, 0))
    circular_cropped_image.paste(cropped_image, (0, 0), mask=mask)
    return circular_cropped_image

def draw_text_with_outline(draw, text, position, font, text_color, outline_color = None):
    x, y = position
    if outline_color:
        draw.text((x-1, y-1), text, font=font, fill=outline_color)
        draw.text((x+1, y-1), text, font=font, fill=outline_color)
        draw.text((x-1, y+1), text, font=font, fill=outline_color)
        draw.text((x+1, y+1), text, font=font, fill=outline_color)
        draw.text(position, text, font=font, fill=text_color)
    else:
        draw.text(position, text, font=font, fill=text_color)

async def draw_text_with_shadow(image, text, position, font, text_color, shadow_color, offset=(5, 5), text_opacity=255):
    x, y = position
    shadow_x_offset, shadow_y_offset = offset

    # Convert text_color and shadow_color to RGBA tuples
    text_color_rgba = ImageColor.getrgb(text_color) + (text_opacity,)
    shadow_color_rgba = ImageColor.getrgb(shadow_color) + (255,)

    # Create a new image for text with alpha channel
    text_layer = Image.new('RGBA', image.size, (255, 255, 255, 0))
    text_draw = ImageDraw.Draw(text_layer)

    # Draw shadow
    text_draw.text((x + shadow_x_offset, y + shadow_y_offset), text, font=font, fill=shadow_color_rgba)

    # Draw text
    text_draw.text(position, text, font=font, fill=text_color_rgba)

    # Combine text layer with the main image
    combined = Image.alpha_composite(image.convert('RGBA'), text_layer)
    image.paste(combined, (0, 0), combined)

font_path = './static/fonts/H7GBKHeavy.TTF'
font_size = 60  # Increase the font size for better visibility
fontName = ImageFont.truetype(font_path, font_size)
fontLvl = ImageFont.truetype(font_path, 65)
fontSponsor1st = ImageFont.truetype(font_path, 50)
fontSponsor2nd = ImageFont.truetype(font_path, 27)

async def process_images(files, app: Quart, is_mobile: bool = False):
    log.info("[PROCESSING] Processing images: IS_MOBILE: %s", is_mobile)
    loop = asyncio.get_event_loop()

    # Process stats ROIs
    stats_rois = [
        (240, 388, 783, 435),
        (240, 434, 779, 484),
        (240, 484, 780, 532),
        (240, 531, 778, 580),
        (240, 580, 781, 627),
        (240, 627, 780, 675)
    ] if is_mobile == False else [
        (237, 331, 741, 372),
        (241, 375, 741, 419),
        (239, 421, 739, 462),
        (239, 467, 743, 510),
        (240, 512, 745, 553),
        (240, 556, 738, 598)
    ]

    # Define the ROIs for the skill icons and passives
    skill_rois = [
        (515, 1108, 695, 1404),
        (821, 920, 1018, 1217),
        (1192, 845, 1373, 1092),
        (1553, 923, 1742, 1217),
        (1864, 1111, 2048, 1357)
    ] if is_mobile == False else [
        (599, 836, 738, 1045),
        (832, 694, 972, 907),
        (1105, 626, 1245, 811),
        (1380, 693, 1516, 907),
        (1614, 831, 1747, 1014)
    ]

    passive_rois = [
        [(566, 816, 659, 912), (566, 525, 659, 613)],
        [(875, 636, 967, 726), (877, 337, 967, 427)],
        [(1236, 547, 1334, 647), (1240, 250, 1329, 341)],
        [(1607, 636, 1697, 726), (1608, 338, 1697, 427)],
        [(1916, 816, 2008, 912), (1916, 525, 2008, 613)]
    ] if is_mobile == False else [
        [(640, 611, 706, 676), (642, 389, 706, 452)],
        [(872, 473, 939, 539), (874, 249, 937, 315)],
        [(1144, 407, 1212, 477), (1146, 184, 1214, 251)],
        [(1421, 474, 1485, 539), (1420, 250, 1485, 316)],
        [(1648, 611, 1714, 676), (1648, 389, 1714, 452)]
    ]

    # Define the ROIs for the chain icons
    chains_rois = [
        (1648, 148, 1721, 217),
        (1876, 367, 1950, 440),
        (1954, 677, 2032, 747),
        (1866, 978, 1953, 1051),
        (1642, 1199, 1731, 1276),
        (1334, 1285, 1425, 1357)
    ] if is_mobile == False else [
        (1441, 106, 1511, 167),
        (1609, 275, 1677, 337),
        (1677, 504, 1734, 563),
        (1614, 732, 1675, 792),
        (1445, 901, 1505, 955),
        (1217, 962, 1275, 1019)
    ]

    fi_crop_roi = (200, 150, 600, 400) if is_mobile == False else (200, 74, 580, 330)
    name_roi = (135, 5, 384, 62) if is_mobile == False else (127, 38, 363, 88)
    yellow_roi = (139, 53, 290, 102) if is_mobile == False else (134, 87, 260, 132)
    level_roi = (43, 164, 220, 204) if is_mobile == False else (36, 185, 191, 227)

    # Load images
    images = await loop.run_in_executor(executor, lambda: [Image.open(io.BytesIO(files[file].read())) for file in files])

    # Perform OCR
    first_image = await loop.run_in_executor(executor, crop_image, images[0], fi_crop_roi)
    name_text = await extract_text_from_image(first_image, name_roi, "name", "6")
    yellow_text = await extract_text_from_image(first_image, yellow_roi, "yellow_text")
    level_text = await extract_text_from_image(first_image, level_roi, "level", "7")
    if "Lv." not in level_text:
        level_text = await extract_text_from_image(first_image, level_roi, "level", "7", True)

    name_text = re.sub("[^a-zA-Z]", "", name_text)

    byte_arr = io.BytesIO()
    first_image.save(byte_arr, format='PNG')  # Use appropriate format like 'JPEG'

    # Encode the byte array to base64
    encoded_image = base64.b64encode(byte_arr.getvalue())

    # Convert the base64 byte array to a string
    encoded_string = encoded_image.decode('utf-8')

    s = [name_text, yellow_text, level_text]

    if name_text not in resonator_names:
        name_text = await extract_text_from_image(first_image, (109, 10, 278, 54), "name", "6")
        if name_text not in resonator_names:
            log.info(f"[ERROR] Text extraction failed, params extracted: {s}")
            return jsonify({"error": "Resonator name not found. Are you sure you uploaded the correct images?", "first_image": encoded_string, "extracted": [name_text, yellow_text, level_text]})

    # Load resonator image
    resonator_image_path = f'./static/3dicons/{name_text.lower()}3d.png'
    if not os.path.exists(resonator_image_path):
        return jsonify({"error": f"3D icon for {name_text} not found."})
    
    # Create final image
    canvas_width = 2500
    canvas_height = int(canvas_width * 8 / 25)
    final_image = await loop.run_in_executor(executor, Image.new, 'RGB', (canvas_width, canvas_height), (255, 255, 255))

    resonator_image = await loop.run_in_executor(executor, Image.open, resonator_image_path)

    # Draw the name text on the resonator image
    draw = ImageDraw.Draw(resonator_image)
    text_position = (30, 30)  # Top-left position with a margin
    lvl_position = (30, 120)  # Top-left position with a margin

    await draw_text_with_shadow(resonator_image, name_text, text_position, fontName, text_color="white", shadow_color="black", offset=(5, 5))
    await draw_text_with_shadow(resonator_image, level_text.replace('/', ''), lvl_position, fontLvl, text_color="white", shadow_color="black", offset=(5, 5))
    await draw_text_with_shadow(resonator_image, "/ 90", (240, 120), fontLvl, text_color="gray", shadow_color="black", offset=(5, 5), text_opacity=150)

    # Resize resonator image
    aspect_ratio_resonator = resonator_image.width / resonator_image.height
    new_resonator_width = int(canvas_height * aspect_ratio_resonator)
    resized_resonator_image = await loop.run_in_executor(executor, resonator_image.resize, (new_resonator_width, canvas_height), Image.LANCZOS)

    # Crop images

    sc_roi = (225, 159, 225 + 570, 159 + 1016) if is_mobile == False else (234, 104, 758, 895)

    second_image = await loop.run_in_executor(executor, crop_image, images[1], sc_roi)
    first_original_cropped = await loop.run_in_executor(executor, crop_image, images[0], (510, 7, 2190, 140))

    # Resize and paste resonator and second image
    aspect_ratio_resonator = resonator_image.width / resonator_image.height
    new_resonator_width = int(canvas_height * aspect_ratio_resonator)
    resized_resonator_image = await loop.run_in_executor(executor, resonator_image.resize, (new_resonator_width, canvas_height), Image.LANCZOS)
    aspect_ratio_second = second_image.width / second_image.height
    new_second_width = int(canvas_height * aspect_ratio_second)
    resized_second_image = await loop.run_in_executor(executor, second_image.resize, (new_second_width, canvas_height), Image.LANCZOS)
    final_image.paste(resized_resonator_image, (0, 0))
    final_image.paste(resized_second_image, (new_resonator_width, 0))

    # Calculate remaining width and height for the banner image
    remaining_width = canvas_width - new_resonator_width - new_second_width
    remaining_height = canvas_height // 2

    # Resize and paste first banner image instead of the cropped image
    banner_image = await loop.run_in_executor(executor, Image.open, './static/bannerdefault.png')
    aspect_ratio_banner = banner_image.width / banner_image.height
    new_banner_width = remaining_width
    new_banner_height = remaining_height
    resized_banner_image = await loop.run_in_executor(executor, banner_image.resize, (new_banner_width, new_banner_height), Image.LANCZOS)
    y_position = 0
    x_position = new_resonator_width + new_second_width
    final_image.paste(resized_banner_image, (x_position, y_position))

    stat_images = await asyncio.gather(*[loop.run_in_executor(executor, crop_image, images[0], roi) for roi in stats_rois])
    column_width = new_banner_width // 2
    column_height = new_banner_height // 3
    x_margin = 20
    y_margin = 10

    for i, stat_img in enumerate(stat_images):
        resized_stat_img = await loop.run_in_executor(executor, stat_img.resize, (int(column_width * 0.9), int(column_height * 0.4)), Image.LANCZOS)
        col_x_position = x_position + (i % 2) * (column_width + x_margin) + (column_width - resized_stat_img.width) // 2
        row_y_position = y_position + y_margin + (i // 2) * (column_height + y_margin) + (column_height - resized_stat_img.height) // 2
        final_image.paste(resized_stat_img, (col_x_position, row_y_position))

    # Adjust the y_position for the next section
    y_position = canvas_height // 2

    # Paste images 3, 4, 5, 6, and 7 in a single row
    images_3_to_7 = await asyncio.gather(*[loop.run_in_executor(executor, crop_image, images[i], (1868, 185, 1868 + 587, 185 + 461) if is_mobile == False else (1688, 121, 2212, 538)) for i in range(2, 7)])
    total_width_3_to_7 = sum(img.width for img in images_3_to_7)
    scaling_factor = remaining_width / total_width_3_to_7
    x_offset = x_position
    max_img_height = 0

    for i, img in enumerate(images_3_to_7):
        new_width = canvas_width - x_offset if i == len(images_3_to_7) - 1 else int(img.width * scaling_factor)
        new_height = int(img.height * scaling_factor)
        resized_img = await loop.run_in_executor(executor, img.resize, (new_width, new_height), Image.LANCZOS)
        final_image.paste(resized_img, (x_offset, y_position))
        x_offset += new_width
        max_img_height = max(max_img_height, new_height)

    # Load and resize banner image
    banner_image = await loop.run_in_executor(executor, Image.open, './static/bannerdefault.png')
    remaining_height_for_banner = canvas_height - y_position - max_img_height
    resized_banner_image = await loop.run_in_executor(executor, banner_image.resize, (remaining_width, remaining_height_for_banner), Image.LANCZOS)
    final_image.paste(resized_banner_image, (x_position, y_position + max_img_height))

    max_skill_icon_width = int(remaining_width * 0.1)
    max_skill_icon_height = int(remaining_height_for_banner * 0.8)
    space_between_icons = 30
    skill_icon_x = x_position + 20

    for roi in skill_rois:
        skill_icon = await loop.run_in_executor(executor, crop_image, images[7], roi)
        scaling_factor = min(max_skill_icon_width / skill_icon.width, max_skill_icon_height / skill_icon.height)
        skill_icon_width = int(skill_icon.width * scaling_factor)
        skill_icon_height = int(skill_icon.height * scaling_factor)
        resized_skill_icon = await loop.run_in_executor(executor, skill_icon.resize, (skill_icon_width, skill_icon_height), Image.LANCZOS)
        skill_icon_y = y_position + max_img_height + (remaining_height_for_banner - skill_icon_height) // 2
        final_image.paste(resized_skill_icon, (skill_icon_x, skill_icon_y))
        skill_icon_x += skill_icon_width + space_between_icons

    # Draw a white vertical line as a divider
    divider_width = 5
    divider_height = int(remaining_height_for_banner * 0.8)
    divider_x = skill_icon_x + space_between_icons // 2
    divider_y = y_position + max_img_height + (remaining_height_for_banner - divider_height) // 2
    draw = ImageDraw.Draw(final_image)
    draw.line([(divider_x, divider_y), (divider_x, divider_y + divider_height)], fill="white", width=divider_width)

    # Update the x position for the next set of icons
    skill_icon_x = divider_x + space_between_icons

    # Process passive ROIs and place them accordingly
    max_circular_icon_width = int(remaining_width * 0.05)
    max_circular_icon_height = int(remaining_height_for_banner * 0.4)
    space_between_circular_icons = 1

    for passive_roi_pair in passive_rois:
        for i, roi in enumerate(passive_roi_pair):
            circular_icon = await loop.run_in_executor(executor, crop_to_circle, images[7], roi)
            scaling_factor = min(max_circular_icon_width / circular_icon.width, max_circular_icon_height / circular_icon.height)
            circular_icon_width = int(circular_icon.width * scaling_factor)
            circular_icon_height = int(circular_icon.height * scaling_factor)
            resized_circular_icon = await loop.run_in_executor(executor, circular_icon.resize, (circular_icon_width, circular_icon_height), Image.LANCZOS)
            circular_icon_y = y_position + max_img_height + (remaining_height_for_banner // 2 - circular_icon_height) // 2 - space_between_circular_icons // 2
            if i == 0:
                circular_icon_y += remaining_height_for_banner // 2 + space_between_circular_icons
            final_image.paste(resized_circular_icon, (skill_icon_x, circular_icon_y), mask=resized_circular_icon)
        skill_icon_x += circular_icon_width + space_between_icons

    # Draw a white vertical line as a divider
    divider_width = 5
    divider_height = int(remaining_height_for_banner * 0.8)
    divider_x = skill_icon_x + space_between_icons // 2
    divider_y = y_position + max_img_height + (remaining_height_for_banner - divider_height) // 2
    draw.line([(divider_x, divider_y), (divider_x, divider_y + divider_height)], fill="white", width=divider_width)

    max_chain_icon_width = (canvas_width - divider_x - space_between_icons) // 3
    max_chain_icon_height = int(remaining_height_for_banner * 0.4)
    space_between_icons = 10
    space_between_rows = 10
    chain_icon_x = divider_x + space_between_icons // 2

    max_circular_icon_width = int(max_chain_icon_width * 0.9)
    max_circular_icon_height = int(max_chain_icon_height * 0.9)

    for idx, roi in enumerate(chains_rois):
        circular_icon = await loop.run_in_executor(executor, crop_to_circle, images[8], roi)
        scaling_factor = min(max_circular_icon_width / circular_icon.width, max_circular_icon_height / circular_icon.height)
        circular_icon_width = int(circular_icon.width * scaling_factor)
        circular_icon_height = int(circular_icon.height * scaling_factor)
        resized_circular_icon = await loop.run_in_executor(executor, circular_icon.resize, (circular_icon_width, circular_icon_height), Image.LANCZOS)
        row = idx // 3
        col = idx % 3
        circular_icon_y = y_position + max_img_height + (remaining_height_for_banner - max_chain_icon_height) // 2 + row * (max_chain_icon_height + space_between_rows) - 30
        circular_icon_x = divider_x + col * (max_chain_icon_width + space_between_icons)
        circular_icon_x += (max_chain_icon_width - circular_icon_width) // 2
        final_image.paste(resized_circular_icon, (circular_icon_x, circular_icon_y), mask=resized_circular_icon)

    # Assuming final_image is your final canvas and canvas_height is its height
    canvas_width, canvas_height = final_image.size

    # Load the Shoshin logo image
    logo = Image.open('./static/shoshinlogo.png')
    logo_width, logo_height = logo.size

    # Resize the logo to 1/3 of its original size
    new_logo_size = (logo_width // 3, logo_height // 3)
    logo = logo.resize(new_logo_size, Image.LANCZOS)
    logo_width, logo_height = logo.size

    # Calculate the position for the logo to be at the bottom left corner with a 20-pixel margin
    logo_position = (20, canvas_height - logo_height - 20)  # Adjust padding as needed

    # Paste the logo image onto the canvas
    final_image.paste(logo, logo_position, logo)  # Assuming the logo has an alpha channel for transparency

    final_image = apply_vignette(final_image, blur_radius_factor=0.1, enhance_factor=2.6)
    in_memory_file = io.BytesIO()
    final_image.save(in_memory_file, format="PNG")
    final_image_base64 = base64.b64encode(in_memory_file.getvalue()).decode('utf-8')
    
    # Decode the base64 data to bytes
    file_data = base64.b64decode(final_image_base64)

    # Write the file data to a temporary file
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(file_data)
        temp_file_path = temp_file.name

    _s3 = aioboto3.Session(
        aws_access_key_id=settings.CF_ACCESS_KEY,
        aws_secret_access_key=settings.CF_SECRET_KEY,
    )
    
    _file_url = None
    name_ = generate_random_string()
    file_name = f"{name_}.png"

    async with _s3.client('s3', endpoint_url='https://980a51450a94985d4207be762678dac1.r2.cloudflarestorage.com', region_name='auto') as s3:
        _verify_ex = await app.session.get(f"https://cdn.shoshin.moe/{file_name}")
        if not _verify_ex.status == 200:
            try:
                await s3.upload_file(
                    Filename=temp_file_path,
                    Bucket="shoshin",
                    Key=name_,
                    ExtraArgs={
                        'ContentType': "image/png",  # Set the content type
                        'ContentDisposition': 'inline',  # Set the content disposition,
                        'ACL': 'public-read'
                    },
                )

                # Generate a presigned URL for the uploaded file
                _file_url = "https://cdn.shoshin.moe/" + name_
            except Exception as e:
                log.info(f'Exception in R2: {e}')
        else:
            _file_url = f"https://cdn.shoshin.moe/{name_}"

    byte_arr = io.BytesIO()
    first_image.save(byte_arr, format='PNG')  # Use appropriate format like 'JPEG'

    # Encode the byte array to base64
    encoded_image = base64.b64encode(byte_arr.getvalue())

    # Convert the base64 byte array to a string
    encoded_string = encoded_image.decode('utf-8')

    return {"image": _file_url, "name": name_text, "level": level_text, "yellow_text": yellow_text, "first_image": encoded_string}  # Return the base64 encoded image data