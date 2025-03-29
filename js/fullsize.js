document.addEventListener('DOMContentLoaded', () => {
    const imageElement = document.getElementById('fullsizeImage');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const dateDisplay = document.getElementById('dateDisplay');
    const backToGridButton = document.getElementById('backToGridButton');
    
    // Get the image parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const day = urlParams.get('day');
    const product = urlParams.get('product');
    
    // Construct the image name and URL
    const imageName = `${product}_${year}${month}${day}.png`;
    const baseURL = '.'; // Update this path as needed
    const imageURL = `${baseURL}/images/${imageName}`;
    const fallbackImage = `${baseURL}/images/noimage.png`;

    // Function to check if an image exists
    function imageExists(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }

    // Check if image exists and set the source
    imageExists(imageURL, (exists) => {
        imageElement.src = exists ? imageURL : fallbackImage;
    });
    
    // Display the date
    dateDisplay.textContent = `${year}-${month}-${day}`;

    // Helper function to get the date from parameters
    function getDateFromParams() {
        return new Date(`${year}-${month}-${day}`);
    }
    
    // Helper function to get the date from URL parameters
    function getDateFromParams(year, month, day) {
        return new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone issues
    }
    
    // Helper function to format date as YYYYMMDD
    function formatDate(date) {
        return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`;
    }
    
    // Get the current image date and set up previous/next navigation
    const currentDate = getDateFromParams(year, month, day);
    
    prevButton.addEventListener('click', () => {
        const prevDate = new Date(currentDate);
        prevDate.setUTCDate(currentDate.getUTCDate() - 1);
        const prevImageName = `${product}_${formatDate(prevDate)}.png`;
        window.location.href = `fullsize.html?year=${prevDate.getUTCFullYear()}&month=${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}&day=${String(prevDate.getUTCDate()).padStart(2, '0')}&product=${encodeURIComponent(product)}`;
    });
    
    nextButton.addEventListener('click', () => {
        const nextDate = new Date(currentDate);
        nextDate.setUTCDate(currentDate.getUTCDate() + 1);
        const nextImageName = `${product}_${formatDate(nextDate)}.png`;
        window.location.href = `fullsize.html?year=${nextDate.getUTCFullYear()}&month=${String(nextDate.getUTCMonth() + 1).padStart(2, '0')}&day=${String(nextDate.getUTCDate()).padStart(2, '0')}&product=${encodeURIComponent(product)}`;
    });

    // Handle the back to grid button click
    backToGridButton.addEventListener('click', () => {
        window.location.href = `index.html?product=${product}&year=${year}&month=${month}&day=${day}`;
    });
});
