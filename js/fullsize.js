import {
    prods,
    sourceURL,
    fallbackImage,
    fileext,
    generateShareURL,
    shareToast,
    utcToLocalDate,
    disableNext,
    formatDate,
    getStoredOrURLParam
} from './utils.js';

let datepicker;

const getImageName = (yyyy, mm, dd, product, ext) =>
    `${yyyy}${mm}${dd}_${product}${ext}`;
const getImageURL = (base, year, month, name) =>
    `${base}${year}${month}/${name}`;

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const backToGridButton = document.getElementById('backToGridButton');
    const imageContainer = document.getElementById('fullsizeImageContainer');

    const now = new Date();
    const year = getStoredOrURLParam('year', String(now.getUTCFullYear()));
    const month = getStoredOrURLParam('month', String(now.getUTCMonth() + 1).padStart(2, '0'));
    const day = getStoredOrURLParam('day', String(now.getUTCDate()).padStart(2, '0'));
    const thumb = getStoredOrURLParam('thumb', 'default-thumb');


    let activeDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));

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
                activeDate = new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ));
                updateFullSizeImages();
                const { yyyy, mm, dd } = formatDate(activeDate);
                sessionStorage.setItem('year', yyyy);
                sessionStorage.setItem('month', mm);
                sessionStorage.setItem('day', dd);
            }
        }
    });

    //updateFullSizeImages();
    document.querySelector('#fullsizecal').value = activeDate.toISOString().split('T')[0];
    datepicker.selectDate(utcToLocalDate(activeDate), true);

    function updateFullSizeImages() {
        const { yyyy, mm, dd } = formatDate(activeDate);

        disableNext(nextButton, activeDate);
        imageContainer.innerHTML = '';
    
        prods.forEach(product => {
            const imageName = getImageName(yyyy, mm, dd, product, fileext);
            const imageURL = getImageURL(sourceURL, yyyy, mm, imageName);
            console.log('Looking for image URL: ', imageURL)
    
            // Wrapper div for each image (with anchor ID)
            const wrapper = document.createElement('div');
            wrapper.className = 'fullsize-image-wrapper';
            wrapper.id = product; // ← enables #anchor scrolling
    
            // Image element
            const img = document.createElement('img');
            img.alt = `${product} image`;
            img.className = 'fullsizeImage';
    
            // Link around image
            const link = document.createElement('a');
            link.href = imageURL;
            link.target = '_blank';
            link.appendChild(img);
    
            wrapper.appendChild(link);
            imageContainer.appendChild(wrapper);
    
            // Load image with fallback
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = imageURL;
            };
            tempImg.onerror = () => {
                img.src = fallbackImage;
                link.href = fallbackImage;
            };
            tempImg.src = imageURL;
        });
    }

    function changeDate(days) {
        activeDate.setUTCDate(activeDate.getUTCDate() + days);
        const { yyyy, mm, dd } = formatDate(activeDate);
        sessionStorage.setItem('year', yyyy);
        sessionStorage.setItem('month', mm);
        sessionStorage.setItem('day', dd);
        disableNext(nextButton, activeDate);
        document.querySelector('#fullsizecal').value = activeDate.toISOString().split('T')[0];
        datepicker.selectDate(utcToLocalDate(activeDate), true);
        updateFullSizeImages();
    }

    prevButton.addEventListener('click', () => changeDate(-1));
    nextButton.addEventListener('click', () => changeDate(1));

    backToGridButton.addEventListener('click', () => {
        const { yyyy, mm, dd } = formatDate(activeDate);
        window.location.href = `index.html?year=${yyyy}&month=${mm}&day=${dd}&thumb=${encodeURIComponent(thumb)}`;
    });

    document.getElementById('copyLinkButton').addEventListener('click', () => {
        const thumb = sessionStorage.getItem('thumb') || 'default-thumb';
        const shareURL = generateShareURL(activeDate, thumb);
    
        navigator.clipboard.writeText(shareURL)
            .then(() => shareToast('✅ Link copied to clipboard'))
            .catch(err => console.error('Failed to copy link: ', err));
    });

});
function waitForAnchorAndScroll(anchorId, retries = 20) {
    if (retries <= 0) return;
    const el = document.getElementById(anchorId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        requestAnimationFrame(() => waitForAnchorAndScroll(anchorId, retries - 1));
    }
}

const anchor = window.location.hash?.substring(1);
if (anchor) {
    waitForAnchorAndScroll(anchor);
}