// Ensure the required elements are present
// let activeDate = new Date(Date.UTC(2024, 9, 13, 0, 10, 0)); 
let activeDate = new Date(); // Default to today's date --> new Date();
console.log('Active Date: ',activeDate.toISOString());
let datepicker;
const goButton = document.getElementById('goButton');
const thumbSelect = document.getElementById('thumb');
const imageGrid = document.getElementById('imageGrid');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const todayButton = document.getElementById('todayButton');
const incrementSelect = document.getElementById('increment');

// Set the base URL for images
const sourceURL = 'https://environmentanalytics.com/PlymouthNC/WebPerusal/'; 
const fileext = '.jpg';
const getThumbImageName = (year, month, day, thumb, fileext) =>
    `thumbnail_tbs_${year}${month}${day}_${thumb}${fileext}`;
const getThumbnailURL = (sourceURL, year, month, imageName) =>
    `${sourceURL}${year}${month}/${imageName}`;
const fallbackImage = `./images/noimage.png`;

// Initialize Air Datepicker
document.addEventListener('DOMContentLoaded', function () {
    console.log('inside datepicker init: ',activeDate.toISOString());
    datepicker = new AirDatepicker('#cal', {
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
        defaultDate: utcToLocalDate(activeDate),
        onSelect({ date }) {
            if (date) {
                // Convert back from local date to UTC midnight
                activeDate = new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ));
                updateImages();
            }
        }
    });

    // Set default date to activeDate (default is Today)
    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];

    // Disable Next button if activeDate is Today
    disableNext();

    // Load images on page load
    updateImages(); 

    // Update calendar
    datepicker.selectDate(utcToLocalDate(activeDate), true);
});

// Function to check if an image exists by making a request
function imageExists(url, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
}

// Function to update images based on selected date
function updateImages() {
    const thumb = thumbSelect.value;
    imageGrid.innerHTML = ''; // Clears existing images

    const startDate = activeDate;
    const imagePromises = [];

    for (let i = 0; i < 36; i++) {
        // Get date as strings for URL construction
        const date = new Date(startDate);
        date.setDate(startDate.getDate() - (35 - i)); 

        // console.log(date.toISOString()); 
        const year = String(date.getUTCFullYear());
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        // Thumbnail URL construction
        const thumbImageName = getThumbImageName(year, month, day, thumb, fileext);
        const thumbnailURL = getThumbnailURL(sourceURL, year, month, thumbImageName);

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
        link.href = `fullsize.html?thumb=${thumb}&year=${year}&month=${month}&day=${day}`;
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

    /*// Wait for all images to load before enabling or disabling buttons
    Promise.all(imagePromises).then(() => {
        // You can perform additional logic here if needed
    });*/
}

function changeDate(days) {
    var newDate = new Date(activeDate);
    newDate.setDate(activeDate.getDate() + days);
    activeDate = newDate;
    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];
    updateImages();

    // Check if activeDate is in the future, disable Next button
    disableNext();
    
    // Update calendar
    datepicker.selectDate(utcToLocalDate(activeDate), true);
}

// Set date to today using datepicker
function setToday() {
    activeDate = new Date();
    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];
    datepicker.selectDate(utcToLocalDate(activeDate), true);
    nextButton.disabled = true;
    updateImages();
}

function disableNext() {
    const today = new Date(); 
    todayStr = today.toISOString().slice(0, 10);
    activeDateStr = activeDate.toISOString().slice(0, 10);

    nextButton.disabled = activeDateStr >= todayStr;
}

function utcToLocalDate(utcDate) {
    return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate()
    );
}

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

thumbSelect.addEventListener('change', () => {
    updateImages(); // Refresh images when thumbnail selection changes
});