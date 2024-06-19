let currentStep = 1;
const stepsDescription = [
    "Step 1: Upload your first file",
    "Step 2: Now, upload your second file",
    "Step 3: Time for the third file",
    "Step 4: Almost there, upload the fourth file",
    "Step 5: Last one, upload the final file"
];

// Initialize an array to store the uploaded files
let uploadedFiles = [];

function makeBackendRequest() {
    return new Promise((resolve, reject) => {
        // Show loading indicator
        document.getElementById('loadingIndicator').classList.remove('hidden');

        // Create a FormData object to hold the files
        let formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
        });

        // Use fetch API to send the files to the backend
        fetch('https://zoux.com/wuwa/api/v1/generate', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide loading indicator
            document.getElementById('loadingIndicator').classList.add('hidden');
            resolve(data);
        })
        .catch(error => {
            // Hide loading indicator
            document.getElementById('loadingIndicator').classList.add('hidden');
            reject(error);
        });
    });
}

function formatHumanReadableDate(dateString) {
    // Create a Date object from the input string
    var date = new Date(dateString);

    // Define options for date and time formatting
    var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    // Format the date and time
    var formattedDate = date.toLocaleDateString('en-US', dateOptions);
    var formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    // Combine and return the formatted date and time
    return `${formattedDate} at ${formattedTime}`;
}

function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; // Get the uploaded file

    if (file) {
        // Add the file to the uploadedFiles array
        uploadedFiles.push(file);
        console.log(`File uploaded for step ${currentStep}: ${file.name}`);
    }

    if (currentStep < 5) {
        currentStep++;
        document.getElementById('uploadDescription').innerText = stepsDescription[currentStep - 1];
    } else {
        // All files uploaded, make a request to the backend
        console.log("All files uploaded, making a request to the backend...");
        makeBackendRequest()
        .then(data => {
            console.log(data);
            // Handle successful response
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initially position the indicator above the "News" button
    const initialButton = document.querySelector('.menu-btn');
    positionIndicatorAboveButton(initialButton);

    document.querySelectorAll('.menu-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Move the indicator above the clicked button
            positionIndicatorAboveButton(button);
        });
    });

    function positionIndicatorAboveButton(button) {
        const indicator = document.getElementById('selectionIndicator');
        const buttonRect = button.getBoundingClientRect();
        const containerRect = button.parentNode.getBoundingClientRect();
    
        // Calculate the new positions
        const adjustmentRight = 17; // Adjust this value as needed
        const newLeft = buttonRect.left - containerRect.left + (buttonRect.width / 2) - (indicator.offsetWidth / 2) + adjustmentRight;
        const newTop = buttonRect.top - containerRect.top - indicator.offsetHeight - 1; // 1px above the button
    
        // Start moving animation
        indicator.src = "https://shoshin.moe/static/emojis/moving.png";
    
        // Apply the new position with transition
        requestAnimationFrame(() => {
            indicator.style.left = `${newLeft}px`;
            indicator.style.top = `${newTop}px`;
        });
    
        // Wait for the transition to complete before switching back to selected.gif
        setTimeout(() => {
            indicator.src = "https://shoshin.moe/static/emojis/selected.gif";
        }, 500); // Match this duration with your CSS transition time
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const linkContainers = document.querySelectorAll('.link-container');

    linkContainers.forEach(container => {
        const fullText = container.textContent.trim();
        let socialPlatform;

        // Improved extraction logic
        // Check if the text matches known social platform names directly
        if (fullText.includes('GitHub')) {
            socialPlatform = 'GitHub';
        } else if (fullText.includes('Discord')) {
            socialPlatform = 'Discord';
        } else {
            // Fallback to using regex match for markdown link format
            const socialPlatformMatch = fullText.match(/\[(.*?)\]/);
            if (socialPlatformMatch) {
                socialPlatform = socialPlatformMatch[1];
            } else {
                // Assume the entire text content is the social platform name
                socialPlatform = fullText;
            }
        }

        console.log(`Extracted Social Platform: ${socialPlatform}`); // Debugging log

        // Use the extracted or assumed name to determine the image URL
        const imageUrl = getImageUrlForSocial(socialPlatform);

        // Create an img element and set its source
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = socialPlatform;

        // Apply Tailwind CSS classes
        img.classList.add('w-6', 'h-auto', 'mr-2');

        // Insert the img before the container's first child (the text node)
        container.insertBefore(img, container.firstChild);
    });
});

// Example function to determine the image URL based on the social platform
// You'll need to implement this based on your actual logic and image URLs
function getImageUrlForSocial(socialPlatform) {
    console.log(socialPlatform)
    const imageMap = {
        'Discord': 'https://shoshin.moe/static/discord.png',
        'Github': 'https://shoshin.moe/static/github.png',
        // Add more mappings as needed
    };
    return imageMap[socialPlatform] || 'path/to/default.png'; // Fallback image
}

function applyMarkdown(text) {
    let span = document.createElement("div");
    span.className = "text-black dark:text-white";

    const segments = text.split(/(?<!https?:)\/\//); // Split by '//' to handle new lines

    // Mapping of header levels to Tailwind CSS font size classes
    const headerSizeClasses = {
        1: "text-3xl font-bold",
        2: "text-lg font-bold",
        3: "text-md font-bold",
    };

    segments.forEach((segment, index) => {
        let formattedSegment = document.createDocumentFragment();

        // Adjusted regex to separately capture header symbols and text
        let regex = /(\*\*(.*?)\*\*(?!\*))|(\*(?!\*)(.*?)\*)|(__(.*?)__)|(`(.*?)`)|(\[(.*?)\]\((.*?)\))|(#{1,3})\s(.*?)$|(\|\|(.*?)\|\|)|(\>\s(.*?))/gm;
        let match;
        let lastIndex = 0;

        while ((match = regex.exec(segment)) !== null) {
            if (match.index > lastIndex) {
                formattedSegment.appendChild(document.createTextNode(segment.slice(lastIndex, match.index)));
            }
        
            let matchSpan = document.createElement("span");
            if (match[1]) { // Bold
                matchSpan.className = "font-bold";
                matchSpan.textContent = match[2];
            } else if (match[3]) { // Italic
                matchSpan.className = "italic";
                matchSpan.textContent = match[4];
            } else if (match[5]) { // Underline
                matchSpan.className = "underline underline-offset-2";
                matchSpan.textContent = match[6];
            } else if (match[7]) { // Code
                matchSpan.className = "bg-gray-600 text-white p-1 rounded-md";
                matchSpan.textContent = match[8];
            } else if (match[9]) { // Links
                matchSpan = document.createElement("a");
                matchSpan.className = "text-blue-500 hover:text-blue-600";
                matchSpan.href = match[11];
                matchSpan.textContent = match[10];
                matchSpan.target = "_blank";
            } else if (match[12]) { // Headers, adjusted group numbers for header symbols and text
                let headerLevel = match[12].length;
                matchSpan.className = headerSizeClasses[headerLevel] || "font-bold";
                matchSpan.textContent = match[13].trim(); // Use the separate group for header text
            } else if (match[14]) { // Spoiler
                matchSpan.className = "bg-black text-transparent hover:text-white cursor-pointer";
                matchSpan.textContent = match[15];
                matchSpan.onclick = function() { this.classList.toggle("text-transparent"); this.classList.toggle("hover:text-white"); };
            } else if (match[16]) { // Blockquote
                matchSpan = document.createElement("blockquote");
                matchSpan.className = "pl-4 border-l-4 border-gray-500 italic";
                matchSpan.textContent = match[17];
            }
            formattedSegment.appendChild(matchSpan);
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < segment.length) {
            formattedSegment.appendChild(document.createTextNode(segment.slice(lastIndex)));
        }

        span.appendChild(formattedSegment);

        if (index < segments.length - 1) {
            span.appendChild(document.createElement("br"));
        }
    });

    return span;
}

function runMarkdownConversion() {
    const paragraph = document.querySelector('#overview-tab p');
    if (paragraph) {
        let content = paragraph.textContent;
        let markdownContent = applyMarkdown(content);
        paragraph.innerHTML = '';
        paragraph.appendChild(markdownContent);
    }

    const paragraphd = document.querySelector('#discord-tab p');
    if (paragraph) {
        let content = paragraphd.textContent;
        let d_markdownContent = applyMarkdown(content);
        paragraphd.innerHTML = '';
        paragraphd.appendChild(d_markdownContent);
    }

    const paragraphb = document.querySelector('#business-tab p');
    if (paragraph) {
        let content = paragraphb.textContent;
        let b_markdownContent = applyMarkdown(content);
        paragraphb.innerHTML = '';
        paragraphb.appendChild(b_markdownContent);
    }

    document.querySelectorAll('.news-content-u').forEach(element => {
        let content = element.textContent;
        let markdownContent = applyMarkdown(content);
        element.innerHTML = '';
        element.appendChild(markdownContent);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runMarkdownConversion);
} else {
    // DOMContentLoaded has already fired
    runMarkdownConversion();
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide all tabs

            var tabs = {
                'news': 'news-tab',
                'overview': 'overview-tab',
                'discord': 'discord-tab',
                'business': 'business-tab',
            };

            for (const [key, value] of Object.entries(tabs)) {
                document.getElementById(value).classList.add('hidden');
            }
            
            // Show the corresponding tab
            const buttonName = this.textContent.trim().toLowerCase();
            if (buttonName === 'news') {
                document.getElementById('news-tab').classList.remove('hidden');
            } else if (buttonName === 'overview') {
                document.getElementById('overview-tab').classList.remove('hidden');
            } else if (buttonName === 'discord') {
                document.getElementById('discord-tab').classList.remove('hidden');
            } else if (buttonName === 'business') {
                document.getElementById('business-tab').classList.remove('hidden');
            }
            // Add conditions for other buttons/tabs as needed
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const uidInput = document.getElementById('uidInput');
    const tooltip = document.getElementById('tooltip');

    // Show tooltip on focus or mouseenter
    uidInput.addEventListener('focus', () => {
        tooltip.classList.remove('opacity-0', 'invisible');
        tooltip.classList.add('opacity-100');
    });
    uidInput.addEventListener('mouseenter', () => {
        tooltip.classList.remove('opacity-0', 'invisible');
        tooltip.classList.add('opacity-100');
    });

    // Hide tooltip on blur or mouseleave
    uidInput.addEventListener('blur', () => {
        tooltip.classList.add('opacity-0', 'invisible');
        tooltip.classList.remove('opacity-100');
    });
    uidInput.addEventListener('mouseleave', () => {
        tooltip.classList.add('opacity-0', 'invisible');
        tooltip.classList.remove('opacity-100');
    });
});