// Ensure the required elements are present
const yearSelect = document.getElementById('year');
const monthSelect = document.getElementById('month');
const daySelect = document.getElementById('day');
const goButton = document.getElementById('goButton');
const productSelect = document.getElementById('product');
const imageGrid = document.getElementById('imageGrid');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const todayButton = document.getElementById('todayButton');
const incrementSelect = document.getElementById('increment');

// Set the base URL for images
const sourceURL = '.'; // Update this path as needed
const thumbnailBaseURL = (product) => `${sourceURL}/images/thumbnail_${product}_`;
const fallbackImage = `${sourceURL}/images/noimage.png`;

// Populate date dropdowns
function populateDateDropdowns() {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Populate years
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Populate months
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = String(month).padStart(2, '0');
        option.textContent = month;
        monthSelect.appendChild(option);
    }

    // Populate days
    for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = String(day).padStart(2, '0');
        option.textContent = day;
        daySelect.appendChild(option);
    }

    // Set default date
    setInitialDateTime();
}

// Function to get the selected date as a string
function getDateString() {
    const year = yearSelect.value;
    const month = monthSelect.value;
    const day = daySelect.value;
    return `${year}${month}${day}`;
}

// Function to check if an image exists by making a request
function imageExists(url, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
}

// Function to update images based on selected date
function updateImages() {
    const selectedDateString = getDateString();
    const product = productSelect.value;
    const baseThumbnailURL = thumbnailBaseURL(product);
    imageGrid.innerHTML = '';

    const startDate = new Date(yearSelect.value, monthSelect.value - 1, daySelect.value);
    let lastImageExists = false;
    
    const imagePromises = [];

    for (let i = 0; i < 36; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() - (35 - i)); // Adjust logic

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const imageName = `${year}${month}${day}.png`;
        const thumbnailURL = `${baseThumbnailURL}${imageName}`;

        // Create image element
        const img = document.createElement('img');
        img.alt = `Thumbnail ${i}`;
        img.onerror = () => { img.src = fallbackImage; };

        // Create grid item
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        // Create link
        const link = document.createElement('a');
        link.href = `fullsize.html?product=${product}&year=${year}&month=${month}&day=${day}`;
        link.appendChild(img);

        gridItem.appendChild(link);
        imageGrid.appendChild(gridItem);

        const imagePromise = new Promise((resolve) => {
            imageExists(thumbnailURL, (exists) => {
                img.src = exists ? thumbnailURL : fallbackImage;
                if (i === 35) {
                    lastImageExists = exists;
                    checkNextButton(lastImageExists);
                }
                resolve();
            });
        });

        imagePromises.push(imagePromise);
    }

    // Wait for all images to load before enabling or disabling buttons
    Promise.all(imagePromises).then(() => {
        // You can perform additional logic here if needed
    });
}

// Function to check if the Next button should be enabled or disabled
function checkNextButton(lastImageExists) {
    nextButton.disabled = !lastImageExists;
}

// Function to change the date
function changeDate(days) {
    const currentDate = new Date(Date.UTC(yearSelect.value, monthSelect.value - 1, daySelect.value));
    currentDate.setUTCDate(currentDate.getUTCDate() + days);

    // Ensure the date is valid after change
    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const newDay = String(currentDate.getDate()).padStart(2, '0');

    // Update dropdown values
    yearSelect.value = newYear;
    monthSelect.value = newMonth;
    daySelect.value = newDay;

    updateImages();
}

// Function to set the initial date
function setInitialDateTime() {
    // Create the initial date in UTC to avoid time zone issues
    const initialDate = new Date(Date.UTC(2024, 6, 18)); // Month is 0-based (6 = July)
    
    yearSelect.value = initialDate.getUTCFullYear();
    monthSelect.value = String(initialDate.getUTCMonth() + 1).padStart(2, '0'); // Add 1 since months are 0-based
    daySelect.value = String(initialDate.getUTCDate()).padStart(2, '0');

    updateImages();
}

// Function to set date to today
function setToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    // Update dropdown values
    yearSelect.value = year;
    monthSelect.value = month;
    daySelect.value = day;

    updateImages();
}

// Event listeners
goButton.addEventListener('click', () => {
    updateImages();
});

todayButton.addEventListener('click', () => {
    setToday();
});

prevButton.addEventListener('click', () => {
    const increment = parseInt(incrementSelect.value, 10);
    changeDate(-increment); // Move back by the selected increment
});

nextButton.addEventListener('click', () => {
    const increment = parseInt(incrementSelect.value, 10);
    changeDate(increment); // Move forward by the selected increment
});

// Populate dropdowns on page load
populateDateDropdowns();
