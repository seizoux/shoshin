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
        // Create line containers
        const firstLineContainer = document.createElement('div');
        firstLineContainer.className = 'flex justify-center items-center flex-wrap mb-4 gap-2'; // Flex container for the first line
    
        const secondLineContainer = document.createElement('div');
        secondLineContainer.className = 'flex justify-center items-center flex-wrap gap-2'; // Flex container for the second line
    
        for (let i = 0; i < 9; i++) {
            // Create the main container div for each placeholder and its description
            const mainContainerDiv = document.createElement('div');
            mainContainerDiv.className = 'flex flex-col items-center justify-center mb-4'; // Margin bottom for spacing
    
            // Create the wrapper div for the image with specified classes
            const wrapperDiv = document.createElement('div');
            // Adjusted classes for a wider appearance
            wrapperDiv.className = 'bg-transparent input-glow-dark p-2 flex justify-center items-center w-48 h-24 border-2 border-dashed border-gray-300 rounded-lg';
    
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
            const descriptionText = document.createElement('span');
            descriptionText.textContent = placeholderTexts[i]; // Get text from array
            descriptionText.className = 'text-center mt-2 text-black dark:text-white font-bold';
            mainContainerDiv.appendChild(descriptionText);
    
            // Append the main container div to the appropriate line container
            if (i < 5) {
                firstLineContainer.appendChild(mainContainerDiv);
            } else {
                secondLineContainer.appendChild(mainContainerDiv);
            }
        }
    
        // Create a new flex container for both line containers
        const flexContainer = document.createElement('div');
        flexContainer.className = 'flex flex-col gap-2'; // Flex column with gap

        // Append line containers to the new flex container
        flexContainer.appendChild(firstLineContainer);
        flexContainer.appendChild(secondLineContainer);

        // Append the new flex container to the placeholders container
        placeholdersContainer.appendChild(flexContainer);
        updateStepTip(0);
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
                // Assuming the first 5 placeholders are in the firstLineContainer and the rest in the secondLineContainer
                const lineContainerIndex = currentStep < 5 ? 0 : 1; // 0 for firstLineContainer, 1 for secondLineContainer
                const lineContainer = placeholdersContainer.children[0].children[lineContainerIndex]; // Access the new flex container, then the correct line container
        
                // Calculate the index of the mainContainerDiv within the selected line container
                const mainContainerDivIndex = currentStep < 5 ? currentStep : currentStep - 5;
                const wrapperDiv = lineContainer.children[mainContainerDivIndex];
        
                const img = wrapperDiv.getElementsByTagName('img')[0];
                img.src = URL.createObjectURL(file); // Replace placeholder with uploaded file image

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
        
        const proxyUrlParts = [112, 114, 111, 120, 121];
        const proxyUrl = `https://${p[0]}/${proxyUrlParts.map(c => String.fromCharCode(c)).join('')}`;
    
        showLoadingAnimation();
    
        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });
    
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
                body: formData,
            }, 600000)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    placeholdersContainer.textContent = data.error || 'Error loading image.';
                    return reject(data.error);
                }
                placeholdersContainer.textContent = '';
                           
                const imageAndButtonsContainer = document.createElement('div');
                imageAndButtonsContainer.className = 'flex flex-col justify-center items-center gap-4';
                
                const imgContainer = document.createElement('div');
                imgContainer.className = 'flex flex-row justify-center items-center';
                const img = document.createElement('img');
                img.src = `${data.image}`;
                img.className = 'w-full p-2 md:p-0 md:w-1/2 h-auto';
                img.style = 'object-fit: contain;';
    
                imgContainer.appendChild(img);
                imageAndButtonsContainer.appendChild(imgContainer);
                
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'flex flex-row justify-center items-center gap-4';
                
                const downloadButtonUrl = `${proxyUrl}?url=${encodeURIComponent(data.image)}`;
    
                const downloadButton = document.createElement('a');
                downloadButton.href = downloadButtonUrl;
                downloadButton.setAttribute('download', `shoshin_download_${data.name}.png`);
                downloadButton.className = "inline-flex items-center justify-center p-2 cursor-pointer rounded-md bg-white text-black hover:bg-black hover:text-white input-glow w-full";
                downloadButton.innerText = 'Download';
                buttonsContainer.appendChild(downloadButton);
    
                downloadButton.onclick = (e) => {
                    e.preventDefault();
                    fetch(downloadButtonUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = `shoshin_download_${data.name}.png`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(err => console.error('Error during download:', err));
                };
    
                const copyButton = document.createElement('a');
                copyButton.href = '#';
                copyButton.className = "inline-flex items-center justify-center p-2 cursor-pointer rounded-md bg-white text-black hover:bg-black hover:text-white input-glow w-full";
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

function applyMarkdown(text, isNested = false) {
    if (!text || typeof text !== 'string' || !text.trim()) {
        // Base case: if text is empty or not a string, return a simple text node or empty container
        return isNested ? document.createTextNode(text || '') : document.createElement("div");
    }

    let container = isNested ? document.createDocumentFragment() : document.createElement("div");
    if (!isNested) container.className = "text-black dark:text-white";

    const segments = text.split(/(?<!https?:)\/\//); // Split by '//' to handle new lines

    const headerSizeClasses = {
        1: "text-3xl font-bold",
        2: "text-lg font-bold",
        3: "text-md font-bold",
    };

    segments.forEach((segment, index) => {
        let formattedSegment = document.createDocumentFragment();

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
                matchSpan.appendChild(document.createTextNode(match[2]));
            } else if (match[3]) { // Italic
                matchSpan.className = "italic";
                matchSpan.appendChild(document.createTextNode(match[4]));
            } else if (match[5]) { // Underline
                matchSpan.className = "underline underline-offset-2";
                matchSpan.appendChild(document.createTextNode(match[6]));
            } else if (match[7]) { // Code
                matchSpan.className = "bg-gray-600 text-white p-1 rounded-md";
                matchSpan.textContent = match[8];
            } else if (match[9]) { // Links
                matchSpan = document.createElement("a");
                matchSpan.className = "text-blue-500 hover:text-blue-600";
                matchSpan.href = match[11];
                matchSpan.appendChild(document.createTextNode(match[10]));
                matchSpan.target = "_blank";
            } else if (match[12]) { // Headers
                let headerLevel = match[12].length;
                matchSpan = document.createElement(`h${headerLevel}`);
                matchSpan.className = headerSizeClasses[headerLevel] || "font-bold";
                matchSpan.appendChild(document.createTextNode(match[13].trim()));
            } else if (match[14]) { // Spoiler
                matchSpan.className = "bg-black text-transparent hover:text-white cursor-pointer";
                matchSpan.appendChild(document.createTextNode(match[15]));
                matchSpan.onclick = function() {
                    this.classList.toggle("text-transparent");
                    this.classList.toggle("hover:text-white");
                };
            } else if (match[16]) { // Blockquote
                matchSpan = document.createElement("blockquote");
                matchSpan.className = "pl-4 border-l-4 border-gray-500 italic";
                matchSpan.appendChild(document.createTextNode(match[17]));
            }
            formattedSegment.appendChild(matchSpan);
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < segment.length) {
            formattedSegment.appendChild(document.createTextNode(segment.slice(lastIndex)));
        }

        container.appendChild(formattedSegment);

        if (!isNested && index < segments.length - 1) {
            container.appendChild(document.createElement("br"));
        }
    });

    return container;
}

async function fetchPatrons() {
    try {
        const response = await fetch('/patrons');
        const data = await response.json();

        // Create a map for tier titles
        const tierMap = new Map();
        data.included.forEach(item => {
            if (item.type === 'tier') {
                tierMap.set(item.id, item.attributes.title);
            }
        });

        // Get containers for each tier
        const legacyContainer = document.getElementById('legacy');
        const tier1Container = document.getElementById('tier-1');
        const tier2Container = document.getElementById('tier-2');
        const tier3Container = document.getElementById('tier-3');
        
        const currentSel = document.getElementById('currentSel');

        // Clear existing content
        legacyContainer.innerHTML = '';
        tier1Container.innerHTML = '';
        tier2Container.innerHTML = '';
        tier3Container.innerHTML = '';

        // Display patrons
        data.data.forEach(patron => {
            const user = data.included.find(inc => inc.id === patron.relationships.user.data.id && inc.type === 'user');
            const tierIds = patron.relationships.currently_entitled_tiers.data.map(tier => tier.id);
            const tierTitles = tierIds.map(tierId => tierMap.get(tierId));

            const patronElement = document.createElement('div');
            patronElement.className = 'patron flex items-center space-x-4 p-4';

            const profileImage = document.createElement('img');
            profileImage.src = user.attributes.image_url || 'default-image.png';
            profileImage.alt = `${user.attributes.full_name}'s profile picture`;
            profileImage.className = 'w-6 h-auto rounded-full';

            var tier_colors = {
                "Legacy": "text-white",
                "Tier 1": "text-yellow-500",
                "Tier 2": "text-blue-500",
                "Tier 3": "text-red-500"
            }

            const patronName = document.createElement('span');
            patronName.classList.add('font-normal', 'text-md', 'md:text-lg', 'ml-2', tier_colors[tierTitles[0] || 'Legacy']);
            patronName.innerText = user.attributes.full_name || 'Anonymous';

            patronElement.appendChild(profileImage);
            patronElement.appendChild(patronName);

            if (tierTitles.includes('Tier 1')) {
                currentSel.textContent = 'Tier 1';
                tier1Container.appendChild(patronElement);
            } else if (tierTitles.includes('Tier 2')) {
                currentSel.textContent = 'Tier 2';
                tier2Container.appendChild(patronElement);
            } else if (tierTitles.includes('Tier 3')) {
                currentSel.textContent = 'Tier 3';
                tier3Container.appendChild(patronElement);
            } else {
                currentSel.textContent = "Legacy"
                legacyContainer.appendChild(patronElement);
            }
        });

    } catch (error) {
        console.error('Error fetching patrons:', error);
    }
}

// Function to handle menu clicks
function handleMenuClick(event, tabId, displayName) {
    event.preventDefault();

    // Remove active class from all menu items
    document.querySelectorAll('#patreon-tab ul li a').forEach(menuItem => {
        menuItem.classList.remove('bg-red-500/75');
    });

    // Add active class to the clicked menu item
    event.target.classList.add('bg-red-500/75');

    // Hide all content divs
    const contentDivs = document.querySelectorAll('#patreon-tab .w-4\\/5 > div.grid');
    contentDivs.forEach(div => {
        div.classList.add('hidden');
    });


    // Show the selected content div
    const selectedDiv = document.getElementById(tabId);
    selectedDiv.classList.remove('hidden');

    // Update the header text
    const header = document.getElementById('currentSel');
    header.textContent = displayName;

    // Check if the selected div is empty and show placeholder if needed
    const patrons = selectedDiv.querySelectorAll('.patron');
    if (patrons.length === 0) {
        let placeholder = selectedDiv.querySelector('.placeholder');
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'placeholder text-center text-gray-500 dark:text-gray-300 mt-4';
            placeholder.textContent = 'No patrons to display.';
            selectedDiv.appendChild(placeholder);
        }
        placeholder.classList.remove('hidden');
    } else {
        const placeholder = selectedDiv.querySelector('.placeholder');
        if (placeholder) {
            placeholder.classList.add('hidden');
        }
        patrons.forEach(patron => {
            patron.classList.remove('hidden');
        });
    }
}

// Add event listeners to menu items
document.getElementById('menu-legacy').addEventListener('click', (event) => handleMenuClick(event, 'legacy', 'Legacy Patreon'));
document.getElementById('menu-tier-1').addEventListener('click', (event) => handleMenuClick(event, 'tier-1', 'Tier 1 Patreon'));
document.getElementById('menu-tier-2').addEventListener('click', (event) => handleMenuClick(event, 'tier-2', 'Tier 2 Patreon'));
document.getElementById('menu-tier-3').addEventListener('click', (event) => handleMenuClick(event, 'tier-3', 'Tier 3 Patreon'));


function runMarkdownConversion() {
    const paragraphd = document.querySelector('#discord-tab p');
    if (paragraphd) {
        let content = paragraphd.textContent;
        let d_markdownContent = applyMarkdown(content);
        paragraphd.innerHTML = '';
        paragraphd.appendChild(d_markdownContent);
    }

    const paragraphb = document.querySelector('#business-tab p');
    if (paragraphb) {
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
    fetchPatrons();
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide all tabs

            var tabs = {
                'news': 'news-tab',
                'patreon': 'patreon-tab',
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
            } else if (buttonName === 'patreon') {
                document.getElementById('patreon-tab').classList.remove('hidden');
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
    const tooltipUid = document.getElementById('tooltip');

    // Show tooltip for uidInput on focus or mouseenter
    uidInput.addEventListener('focus', () => {
        tooltipUid.classList.remove('opacity-0', 'invisible');
        tooltipUid.classList.add('opacity-100');
    });
    uidInput.addEventListener('mouseenter', () => {
        tooltipUid.classList.remove('opacity-0', 'invisible');
        tooltipUid.classList.add('opacity-100');
    });

    // Hide tooltip for uidInput on blur or mouseleave
    uidInput.addEventListener('blur', () => {
        tooltipUid.classList.add('opacity-0', 'invisible');
        tooltipUid.classList.remove('opacity-100');
    });
    uidInput.addEventListener('mouseleave', () => {
        tooltipUid.classList.add('opacity-0', 'invisible');
        tooltipUid.classList.remove('opacity-100');
    });

    // Assuming fileUpload and its tooltip have similar behavior
    const fileUpload = document.getElementById('fileDiv');
    const tooltipFile = document.getElementById('tooltipFile');
    let isHoveringOverTooltip = false; // Track if the mouse is over the tooltip

    console.log(`Tooltip visibility: ${tooltipFile.classList.contains('opacity-100')}`);

    // Show tooltip for fileUpload on focus or mouseenter
    fileUpload.addEventListener('focus', () => {
        tooltipFile.classList.remove('opacity-0', 'invisible');
        tooltipFile.classList.add('opacity-100');
        console.log(`Tooltip visibility: ${tooltipFile.classList.contains('opacity-100')}`);
    });
    fileUpload.addEventListener('mouseenter', () => {
        tooltipFile.classList.remove('opacity-0', 'invisible');
        tooltipFile.classList.add('opacity-100');
        console.log(`Tooltip visibility: ${tooltipFile.classList.contains('opacity-100')}`);
    });

    // Hide tooltip for fileUpload on blur or mouseleave, checking if not hovering over tooltip
    fileUpload.addEventListener('blur', () => {
        if (!isHoveringOverTooltip) {
            tooltipFile.classList.add('opacity-0', 'invisible');
            tooltipFile.classList.remove('opacity-100');
        }
        console.log(`Tooltip visibility: ${tooltipFile.classList.contains('opacity-100')}`);
    });
    fileUpload.addEventListener('mouseleave', () => {
        setTimeout(() => { // Delay to check if mouse moved to the tooltip
            if (!isHoveringOverTooltip) {
                tooltipFile.classList.add('opacity-0', 'invisible');
                tooltipFile.classList.remove('opacity-100');
                console.log(`Tooltip visibility: ${tooltipFile.classList.contains('opacity-100')}`);
            }
        }, 100); // Short delay to allow for mouse to possibly enter tooltip before hiding
    });

    // Event listeners for the tooltip to manage hover state
    tooltipFile.addEventListener('mouseenter', () => {
        isHoveringOverTooltip = true;
    });
    tooltipFile.addEventListener('mouseleave', () => {
        isHoveringOverTooltip = false;
        tooltipFile.classList.add('opacity-0', 'invisible');
        tooltipFile.classList.remove('opacity-100');
    });
});