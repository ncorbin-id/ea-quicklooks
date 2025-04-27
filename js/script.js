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

let activeDate;
let datepicker;

const goButton = document.getElementById('goButton');
const thumbSelect = document.getElementById('thumb');
const imageGrid = document.getElementById('imageGrid');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const todayButton = document.getElementById('todayButton');
const incrementSelect = document.getElementById('increment');

const getThumbImageName = (year, month, day, thumb, ext) =>
    `thumbnail_tbs_${year}${month}${day}_${thumb}${ext}`;
const getThumbnailURL = (sourceURL, year, month, name) =>
    `${sourceURL}${year}${month}/${name}`;

// Initialize from session or URL
const now = new Date();
const year = getStoredOrURLParam('year', String(now.getUTCFullYear()));
const month = getStoredOrURLParam('month', String(now.getUTCMonth() + 1).padStart(2, '0'));
const day = getStoredOrURLParam('day', String(now.getUTCDate()).padStart(2, '0'));
const storedThumb = getStoredOrURLParam('thumb', thumbSelect.value);
thumbSelect.value = storedThumb;
sessionStorage.setItem('thumb', storedThumb);


activeDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));

// Initialize Datepicker
document.addEventListener('DOMContentLoaded', () => {
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
                activeDate = new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ));
                updateImages();
                sessionStorage.setItem('year', formatDate(activeDate).yyyy);
                sessionStorage.setItem('month', formatDate(activeDate).mm);
                sessionStorage.setItem('day', formatDate(activeDate).dd);
            }
        }
    });

    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];
    disableNext(nextButton, activeDate);
    updateImages();
    datepicker.selectDate(utcToLocalDate(activeDate), true);
});

function updateImages() {
    const thumb = thumbSelect.value;
    imageGrid.innerHTML = '';

    const { yyyy, mm, dd } = formatDate(activeDate);
    const startDate = activeDate;

    for (let i = 0; i < 36; i++) {
        const date = new Date(startDate);
        date.setUTCDate(startDate.getUTCDate() - (35 - i));

        const y = String(date.getUTCFullYear());
        const m = String(date.getUTCMonth() + 1).padStart(2, '0');
        const d = String(date.getUTCDate()).padStart(2, '0');

        const thumbName = getThumbImageName(y, m, d, thumb, fileext);
        const thumbURL = getThumbnailURL(sourceURL, y, m, thumbName);
        const anchor = thumb.includes('03km') ? 'CL61_TBS_03km' : 'CL61_TBS_15km';

        const img = document.createElement('img');
        img.alt = `Thumbnail ${i}`;

        // Set error handler for fallback if initial loading fails
        img.onerror = function () {
            this.onerror = null; // Prevent infinite fallback loop
            this.src = fallbackImage;
        };

        const link = document.createElement('a');
        link.href = `fullsize.html?thumb=${thumb}&year=${y}&month=${m}&day=${d}#${anchor}`;
        link.appendChild(img);

        const item = document.createElement('div');
        item.className = 'grid-item';
        item.appendChild(link);
        imageGrid.appendChild(item);

        img.src = thumbURL;
    }

    disableNext(nextButton, activeDate);
}

function changeDate(days) {
    activeDate.setUTCDate(activeDate.getUTCDate() + days);
    document.querySelector('#cal').value = activeDate.toISOString().split('T')[0];
    datepicker.selectDate(utcToLocalDate(activeDate), true);
    updateImages();

    const { yyyy, mm, dd } = formatDate(activeDate);
    sessionStorage.setItem('year', yyyy);
    sessionStorage.setItem('month', mm);
    sessionStorage.setItem('day', dd);
}

function setToday() {
    activeDate = new Date();
    activeDate.setUTCHours(0, 0, 0, 0);
    changeDate(0);
}

todayButton.addEventListener('click', setToday);
prevButton.addEventListener('click', () => changeDate(-parseInt(incrementSelect.value, 10)));
nextButton.addEventListener('click', () => changeDate(parseInt(incrementSelect.value, 10)));
thumbSelect.addEventListener('change', () => {
    sessionStorage.setItem('thumb', thumbSelect.value);
    updateImages();
});

document.getElementById('copyLinkButton').addEventListener('click', () => {
    const thumb = sessionStorage.getItem('thumb');
    const shareURL = generateShareURL(activeDate, thumb);

    navigator.clipboard.writeText(shareURL)
        .then(() => shareToast('✅ Link copied to clipboard'))
        .catch(err => console.error('Failed to copy link: ', err));
});