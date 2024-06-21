let currentStep = 0;
const placeholdersContainer = document.getElementById('filePlaceholders');
// Declare a global array to store uploaded files
let uploadedFiles = [];

// Define an array of texts for each placeholder
const placeholderTexts = [
    "MAIN",
    "WEAPON",
    "MAIN ECHO",
    "2ND ECHO",
    "3RD ECHO",
    "4TH ECHO",
    "5TH ECHO",
    "SKILLS",
    "RS. CHAINS"
    // Add more descriptions as needed
];

const stepTips = [
    "Upload the main section of your resonator page (the first icon on the left column).",
    "Upload the weapon section (the second icon on the left column).",
    "Upload the Main Echo equipped on your Resonator (the top one on the echoes equipped, generally the first COST 4).",
    "Upload the 2nd Echo equipped on your Resonator.",
    "Upload the 3rd Echo equipped on your Resonator.",
    "Upload the 4th Echo equipped on your Resonator.",
    "Upload the 5th Echo equipped on your Resonator.",
    "Upload the Skills section of your Resonator (the 4th icon on the left column).",
    "Upload the Resonance Chains section of your resonator (the 5th icon on the left column)."
];

document.addEventListener('DOMContentLoaded', function() {
    const placeholdersContainer = document.getElementById('filePlaceholders');
    let currentStep = 0;

    // Function to update the #stepTip content with step number
    function updateStepTip(currentStep) {
        const stepTipElement = document.getElementById('stepTip');
        if (stepTipElement && stepTips[currentStep]) {
            // Format the tip with step number and custom text
            stepTipElement.innerHTML = `<p>TIP (Step ${currentStep + 1}): ${stepTips[currentStep]}</p>`;
            stepTipElement.className = 'text-center text-sm text-black dark:text-white'; // Tailwind CSS classes
        }
    }
    
    function initializePlaceholders() {
        for (let i = 0; i < 9; i++) {
            // Create the main container div for each placeholder and its description
            const mainContainerDiv = document.createElement('div');
            mainContainerDiv.className = 'flex flex-col items-center justify-center mb-4'; // Margin bottom for spacing between each set
    
            // Create the wrapper div for the image with specified classes
            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'bg-night-dark/50 dark:bg-off-white/50 input-glow-dark p-2 flex justify-center items-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg';
    
            // Create the img element
            const img = document.createElement('img');
            img.src = 'https://shoshin.moe/static/empty.png'; // Default placeholder image
            img.className = 'max-w-full max-h-full object-contain';
            img.alt = `Placeholder ${i + 1}`;
    
            // Append the img to the wrapper div
            wrapperDiv.appendChild(img);
    
            // Append the wrapper div to the main container div
            mainContainerDiv.appendChild(wrapperDiv);
    
            // Create and append the description text outside and below the image wrapper
            const descriptionText = document.createElement('span'); // or 'div' if you prefer
            descriptionText.textContent = placeholderTexts[i]; // Get text from array
            descriptionText.className = 'text-center mt-2 text-black dark:text-white font-bold'; // Tailwind CSS for styling
            mainContainerDiv.appendChild(descriptionText); // Append the text element outside and below the image wrapper
    
            // Append the main container div to the placeholders container
            placeholdersContainer.appendChild(mainContainerDiv);
            updateStepTip(0);
        }
    }

    function handleFileUpload(event) {
        const files = event.target.files;

        // Check if files are selected
        if (files.length === 0) {
            alert('Please select a file.');
            return;
        }

        // Check for the number of files exceeding the remaining placeholders
        if (files.length > 9 - currentStep) {
            alert(`You can only upload ${9 - currentStep} more file(s).`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check file type
            if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
                alert('Only PNG, JPG, and JPEG files are allowed.');
                continue; // Skip this file and continue with the next
            }

            // Check file size (20MB)
            if (file.size > 20 * 1024 * 1024) {
                alert('File size must be less than 20MB.');
                continue; // Skip this file and continue with the next
            }

            // File passes all checks, add it to the uploadedFiles array
            uploadedFiles.push(file);

            if (currentStep < 9) {
                const wrapperDiv = placeholdersContainer.children[currentStep];
                const img = wrapperDiv.getElementsByTagName('img')[0];
                img.src = URL.createObjectURL(file); // Replace placeholder with uploaded file image
                img.className = 'w-full h-full object-cover'; // Adjusted to fill the div, maintaining aspect ratio

                currentStep++;
                updateStepTip(currentStep);
                if (currentStep === 9) {
                    finalizeUpload();
                    break; // Exit the loop if all placeholders are filled
                }
            }
        }
    }

    function showLoadingAnimation() {
        placeholdersContainer.textContent = ''; // Clear existing content

        // Create loading animation using provided SVG
        const loadingHTML = `
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-black animate-spin dark:text-white fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span id="text-container-loading" class="sr-only text-black dark:text-white ml-2 sans-it font-bold">Hang tight, we're doing some magic...</span>
            </div>
        `;
    
        // Insert the loading animation HTML into the placeholdersContainer
        placeholdersContainer.innerHTML = loadingHTML;
        const textContainer = document.querySelector('#text-container-loading'); // Adjust the selector to your specific container
        if (textContainer) {
          let html = textContainer.innerHTML;
          // Wrap each period in a span with a class 'period'
          html = html.replace(/\./g, '<span class="period">.</span>');
          textContainer.innerHTML = html;
      
          const periods = textContainer.querySelectorAll('.period');
          let current = 0;
      
          const animatePeriods = () => {
            // Remove the 'bounce' class from all periods
            periods.forEach(period => period.classList.remove('bounce'));
      
            // Add the 'bounce' class to the current period
            periods[current].classList.add('bounce');
      
            // Move to the next period or loop back to the first
            current = (current + 1) % periods.length;
      
            // Set the next animation to start after the current one finishes
            setTimeout(animatePeriods, 500); // Match the duration of the CSS animation
          };
      
          animatePeriods(); // Start the animation
        }
    }

    function finalizeUpload() {
        const p = [115, 104, 111, 115, 104, 105, 110, 46, 109, 111, 101, 47, 97, 112, 105, 47, 103, 101, 110, 101, 114, 97, 116, 101, 95, 98, 117, 105, 108, 100].map(c => String.fromCharCode(c)).join('').split('/');
        const u = `https://${p[0]}/${p[1]}/${p[2]}`;
    
        showLoadingAnimation();
    
        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });
    
        // Step 3: Make the Request with Indirect Method Access
        new Promise((resolve, reject) => {
            const fetchWithTimeout = (url, options, timeout = 600000) => {
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
                    fetch(url, options).then(
                        response => {
                            clearTimeout(timer);
                            resolve(response);
                        },
                        err => {
                            clearTimeout(timer);
                            reject(err);
                        }
                    );
                });
            };
    
            fetchWithTimeout(u, {
                method: 'POST',
                body: formData, // Send the files as FormData
            }, 600000) // 10 minutes timeout
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    placeholdersContainer.textContent = data.error || 'Error loading image.';
                    return reject(data.error);
                }
                placeholdersContainer.textContent = ''; // Clear the container
                
                // Create a new div to hold the image and buttons with flex layout
                const imageAndButtonsContainer = document.createElement('div');
                imageAndButtonsContainer.className = 'flex flex-col justify-center items-center gap-4'; // Updated to flex-col and gap-4
                
                const imgContainer = document.createElement('div'); // Container for the image to apply flex properties
                imgContainer.className = 'flex flex-row justify-center items-center'; // Flex container for the image
                const img = document.createElement('img');
                img.src = `${data.image}`;
                img.className = 'w-1/2 h-auto';
                img.style = 'object-fit: contain;';
                imgContainer.appendChild(img); // Display the final image within the flex container
                imageAndButtonsContainer.appendChild(imgContainer); // Append the image container
                
                const buttonsContainer = document.createElement('div'); // Container for buttons
                buttonsContainer.className = 'flex flex-row justify-center items-center gap-4'; // Flex container for buttons
                                
                // Assuming 'data.image' contains the URL to the image you want to download
                const downloadButton = document.createElement('a');
                downloadButton.href = data.image; // URL to the file you want to download
                downloadButton.setAttribute('download', `shoshin_download_${data.name}.png`); // Suggests a filename. The extension should match the file type.
                downloadButton.className = "inline-flex items-center justify-center p-2 cursor-pointer rounded-md bg-off-white/50 hover:bg-night-dark dark:hover:bg-off-white text-black dark:text-white hover:text-white dark:hover:text-black input-glow w-full";
                downloadButton.innerText = 'Download';
                buttonsContainer.appendChild(downloadButton);

                // Adjusted "Copy URL" button code
                const copyButton = document.createElement('a');
                copyButton.href = '#';
                copyButton.className = "inline-flex items-center justify-center p-2 cursor-pointer rounded-md bg-off-white/50 hover:bg-night-dark dark:hover:bg-off-white text-black dark:text-white hover:text-white dark:hover:text-black input-glow w-full";
                copyButton.innerText = 'Copy URL';
                copyButton.onclick = (e) => {
                    e.preventDefault(); // Prevent the default anchor action
                    navigator.clipboard.writeText(img.src).then(() => {
                        copyButton.innerText = 'URL Copied!'; // Change button text to indicate success
                        setTimeout(() => {
                            copyButton.innerText = 'Copy URL'; // Revert back to original text after 2 seconds
                        }, 2000);
                    }).catch(err => {
                        console.error('Error copying URL:', err);
                    });
                };
                buttonsContainer.appendChild(copyButton); // Append the copy URL button within the flex container
                
                imageAndButtonsContainer.appendChild(buttonsContainer); // Append the buttons container to the main container
                
                placeholdersContainer.appendChild(imageAndButtonsContainer); // Append the new div to the main container
                
                resolve(data);
            })
            .catch(error => {
                console.error('Error:', error);
                placeholdersContainer.textContent = 'Error loading image.';
                reject(error);
            });
        });
    }

    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);

    initializePlaceholders();
});

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