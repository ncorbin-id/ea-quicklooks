let datepicker;
// Construct the image name and URL
const sourceURL = 'https://environmentanalytics.com/PlymouthNC/WebPerusal/';
const fallbackImage = './images/noimage.png';
const fileext = '.jpg';
//const imageName = `${yyyy}${mm}/${yyyy}${mm}${dd}_${product}${fileext}`;
//const imageURL = `${sourceURL}${imageName}`;
const getImageName = (yyyy, mm, dd, product, fileext) =>
    `${yyyy}${mm}${dd}_${product}${fileext}`;
const getImageURL = (sourceURL, year, month, imageName) =>
    `${sourceURL}${year}${month}/${imageName}`;

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const backToGridButton = document.getElementById('backToGridButton');
    const imageContainer = document.getElementById('fullsizeImageContainer');

    // Get the image parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    let year = parseInt(urlParams.get('year'));
    let month = parseInt(urlParams.get('month'));
    let day = parseInt(urlParams.get('day'));
    const thumb = urlParams.get('thumb');

    let activeDate = new Date(Date.UTC(year, month - 1, day));
    console.log("Page load: ", activeDate.toISOString());

    // Available products
    const prods = [
        'CL61_TBS_03km', 'CL61_TBS_15km',
        'CL61_LDR_03km', 'CL61_LDR_15km',
        'CL61_SnC_03km', 'CL61_SnC_15km',
        'LFTE_TBS_03km', 'LFTE_TBS_15km',
        'LFTN_TBS_03km', 'LFTN_TBS_15km',
        'LFTW_TBS_03km', 'LFTW_TBS_15km',
        'SunScout_diag', 'SunScout_met5' 
    ];

    //// Initialize Air Datepicker
    datepicker = new AirDatepicker('#fullsizecal', {
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
                updateFullSizeImages();
            }
        }
    });

    // Disable Next button if activeDate is Today
    disableNext();

    // Load images on page load
    updateFullSizeImages();

    // Update calendar
    document.querySelector('#fullsizecal').value = activeDate.toISOString().split('T')[0];
    datepicker.selectDate(utcToLocalDate(activeDate), true);

    function updateFullSizeImages() {
        // Set calendar input value
        document.querySelector('#fullsizecal').value = activeDate.toISOString().split('T')[0];

        // Check if Next button needs to be disabled
        disableNext();

        // Clear current images
        imageContainer.innerHTML = '';

        const { yyyy, mm, dd } = formatDate(activeDate);

        prods.forEach(product => {
            const imageName = getImageName(yyyy, mm, dd, product, fileext);
            const imageURL = getImageURL(sourceURL, yyyy, mm, imageName); // <== fixed here
        
            // Create container
            const imagePackage = document.createElement('div');
            imagePackage.id = product;
            imagePackage.className = 'fullsize-image-package';
        
            // Preload image first
            const tempImg = new Image();
            tempImg.onload = () => {
                const img = document.createElement('img');
                img.src = imageURL;
                img.alt = `${product} image`;
                img.className = 'fullsizeImage';

                const link = document.createElement('a');
                link.href = imageURL;
                link.target = '_blank';
                link.appendChild(img);

                const imagePackage = document.createElement('div');
                imagePackage.id = product;
                imagePackage.className = 'fullsize-image-package';
                imagePackage.appendChild(link);

                imageContainer.appendChild(imagePackage);
            };

            tempImg.onerror = () => {
                const img = document.createElement('img');
                img.src = fallbackImage;
                img.alt = `${product} image`;
                img.className = 'fullsizeImage';

                const link = document.createElement('a');
                link.href = fallbackImage;
                link.target = '_blank';
                link.appendChild(img);

                const imagePackage = document.createElement('div');
                imagePackage.id = product;
                imagePackage.className = 'fullsize-image-package';
                imagePackage.appendChild(link);

                imageContainer.appendChild(imagePackage);
            };

            tempImg.src = imageURL;
        });
        
        console.log("After updateFullSizeImages: ", activeDate.toISOString());
    }

    function formatDate(date) {
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(date.getUTCDate()).padStart(2, '0');
        console.log("After formatDate: ", activeDate.toISOString());
        return { yyyy, mm, dd };
    }

    function changeDate(days) {
        var newDate = new Date(activeDate);
        newDate.setDate(activeDate.getDate() + days);
        activeDate = newDate;
        console.log(activeDate.toISOString());
    
        // Check if activeDate is in the future, disable Next button
        disableNext();
        
        // Update calendar
        document.querySelector('#fullsizecal').value = activeDate.toISOString().split('T')[0];
        console.log("Change Date: ", activeDate.toISOString());
        datepicker.selectDate(utcToLocalDate(activeDate), true);

        updateFullSizeImages();
        updateURL();
    }

    function utcToLocalDate(utcDate) {
        return new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate()
        );
    }

    function disableNext() {
        const today = new Date(); 
        todayStr = today.toISOString().slice(0, 10);
        activeDateStr = activeDate.toISOString().slice(0, 10);
    
        nextButton.disabled = activeDateStr >= todayStr;
    }

    prevButton.addEventListener('click', () => {
        const increment = 1;
        changeDate(-increment);
    });
    
    nextButton.addEventListener('click', () => {
        const increment = 1;
        changeDate(increment);
    });

    function updateURL() {
        const { yyyy, mm, dd } = formatDate(activeDate);
        const newParams = `year=${yyyy}&month=${mm}&day=${dd}&thumb=${encodeURIComponent(thumb)}`;
        window.history.replaceState(null, '', `fullsize.html?${newParams}`);
    }

    backToGridButton.addEventListener('click', () => {
        const { yyyy, mm, dd } = formatDate(activeDate);
        window.location.href = `index.html?year=${yyyy}&month=${mm}&day=${dd}`;
    });

});