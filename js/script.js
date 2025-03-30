// Ensure the required elements are present
let activeDate = new Date(); // Default to today's date
const goButton = document.getElementById('goButton');
const productSelect = document.getElementById('product');
const imageGrid = document.getElementById('imageGrid');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const todayButton = document.getElementById('todayButton');
const incrementSelect = document.getElementById('increment');

// Set the base URL for images
const sourceURL = 'https://environmentanalytics.com/PlymouthNC/WebPerusal/'; 
const thumbnailBaseURL = (product) => `${sourceURL}/images/thumbnail_${product}_`;
// const fallbackImage = `${sourceURL}/images/noimage.png`;
const fallbackImage = `./images/noimage.png`;

// Initialize Air Datepicker
document.addEventListener('DOMContentLoaded', function () {
    const datepicker = new AirDatepicker('#cal', {
        locale: {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            today: 'Today',
            clear: 'Clear',
            dateFormat: 'yyyy-MM-dd',
            timeFormat: 'hh:mm aa',
            firstDay: 0
        },
        autoClose: true,
        defaultDate: activeDate,
        onSelect({ date }) {
            activeDate = date; // Update activeDate when the user picks a date
            updateImages(); // Refresh images after selecting a date
        }
    });

    // Set default date to activeDate (default is Today)
    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];

    // Disable Next button if activeDate is Today
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    activeDate.setHours(0, 0, 0, 0); // Normalize to midnight
    nextButton.disabled = activeDate >= today;

    // Load images on page load
    updateImages(); 
});

// Function to get the selected date as a string
function getDateString() {
    const year = activeDate.getFullYear();
    const month = String(activeDate.getMonth() + 1).padStart(2, '0');
    const day = String(activeDate.getDate()).padStart(2, '0');
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
    const activeDateString = getDateString();
    const product = productSelect.value;
    const baseThumbnailURL = thumbnailBaseURL(product);
    imageGrid.innerHTML = ''; // Clears existing images

    const startDate = new Date(activeDate);
    // let lastImageExists = false;
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

        // Set error handler for fallback if initial loading fails
        img.onerror = function () {
            this.onerror = null; // Prevent infinite fallback loop
            this.src = fallbackImage;
        };

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

function changeDate(days) {
    var newDate = new Date(activeDate);
    newDate.setDate(newDate.getDate() + days);

    const today = new Date(); 
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    newDate.setHours(0, 0, 0, 0); // Normalize to midnight

    // Disable Next button if newDate is today or beyond
    nextButton.disabled = newDate >= today;

    // Update activeDate and datepicker if valid
    if (newDate <= today) {
        activeDate = newDate;
        document.querySelector('#cal').value = newDate.toISOString().split('T')[0];
        updateImages();
    }
}

// Set date to today using datepicker
function setToday() {
    activeDate = new Date();
    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];
    console.log(activeDate.toISOString().split('T')[0]);
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