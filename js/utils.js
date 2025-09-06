// Product list
// IMPORTANT: If you change the product list, you must also 
// update the product labels and tooltip labels arrays accordingly.
// 
// Create any new product bundles in the prodBundles object.
export const prods = [
    'CL61_TBS_03km', 'CL61_TBS_15km',
    'MRR1', 'purpAir1',
    'CL61_LDR_03km', 'CL61_LDR_15km',
    'CL61_SnC_03km', 'CL61_SnC_15km',
    'LFTE_TBS_03km', 'LFTE_TBS_15km',
    'LFTN_TBS_03km', 'LFTN_TBS_15km',
    'LFTW_TBS_03km', 'LFTW_TBS_15km',
    'SunScout_diag', 'SunScout_met5'
];

export const prodLabels = [
    'Backscatter Up (3 km)',
    'Backscatter Up (15 km)',
    'MRR',
    'PurpleAir',
    'LDR Up (3 km)',
    'LDR Up (15 km)',
    'Layer and Cloud (3 km)',
    'Layer and Cloud (15 km)',
    'Backscatter East (3 km)',
    'Backscatter East (15 km)',
    'Backscatter North (3 km)',
    'Backscatter North (15 km)',
    'Backscatter West (3 km)',
    'Backscatter West (15 km)',
    'SunScout Diagnostics',
    'SunScout Meteorology'
];

export const tooltipLabels = [
    'Upward-Pointing Backscatter (0 - 3 km)',
    'Upward-Pointing Backscatter (0 - 15 km)',
    'Micro Rain Radar',
    'PurpleAir Air Quality Monitor',
    'Upward-Pointing LDR (0 - 3 km)',
    'Upward-Pointing LDR (0 - 15 km)',
    'Layer and Cloud Detection (0 - 3 km)',
    'Layer and Cloud Detection (0 - 15 km)',
    'East-Pointing Backscatter (0 - 3 km)',
    'East-Pointing Backscatter (0 - 15 km)',
    'North-Pointing Backscatter (0 - 3 km)',
    'North-Pointing Backscatter (0 - 15 km)',
    'West-Pointing Backscatter (0 - 3 km)',
    'West-Pointing Backscatter (0 -15 km)',
    'SunScout Diagnostics',
    'SunScout Meteorology'
];

// default products
export const defaultprods = [
    'CL61_TBS_03km', 'CL61_TBS_15km', 'MRR1', 'purpAir1', 'SunScout_met5'
];

// Product bundles
export const prodBundles = {
    'Default Products': [...defaultprods],
    'All 3 km Products': ['CL61_TBS_03km', 
                          'CL61_LDR_03km', 
                          'CL61_SnC_03km', 
                          'LFTE_TBS_03km', 
                          'LFTN_TBS_03km', 
                          'LFTW_TBS_03km'],
    'All 15 km Products': ['CL61_TBS_15km', 
                          'CL61_LDR_15km', 
                          'CL61_SnC_15km', 
                          'LFTE_TBS_15km', 
                          'LFTN_TBS_15km', 
                          'LFTW_TBS_15km'],
}

// Image locations
export const sourceURL = 'https://environmentanalytics.com/PlymouthNC/WebPerusal/';
export const fallbackImage = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/images/noimage.png`;
export const fallbackImageFS = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/images/noimage_fullsize.png`;
export const fileext = '.png';

export function utcToLocalDate(utcDate) {
    return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate()
    );
}

// Disable Next button if activeDate = Today
export function disableNext(button, activeDate) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const activeStr = activeDate.toISOString().split('T')[0];
    button.disabled = activeStr >= todayStr;
}

// Format date as string
export function formatDate(date) {
    const yyyy = String(date.getUTCFullYear());
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return { yyyy, mm, dd };
}

// Get image parameters from URL or sessionStorage
export function getStoredOrURLParam(name, fallback) {
    const params = new URLSearchParams(window.location.search);
    if (params.has(name)) {
        const value = params.get(name);
        sessionStorage.setItem(name, value);
        return value;
    } else if (sessionStorage.getItem(name)) {
        return sessionStorage.getItem(name);
    } else {
        return fallback;
    }
}

// Create share URL
export function generateShareURL(activeDate, thumb) {
    const { yyyy, mm, dd } = formatDate(activeDate);
    const encodedThumb = encodeURIComponent(thumb || 'default-thumb');
    return `${window.location.origin}${window.location.pathname}?year=${yyyy}&month=${mm}&day=${dd}&thumb=${encodedThumb}`;
}

// Copied to clipboard toast
export function shareToast(message = 'Link copied to clipboard!') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

export function attachSidebarToggleHandler() {
    const sidebar = document.getElementById('sidebarControlsContainer');
    const toggleBtn = document.getElementById('toggleBtn');
    const root = document.documentElement;
    if (!sidebar || !toggleBtn) return;

    toggleBtn.onclick = function() {
        const isClosed = sidebar.classList.contains('close');
        const openWidth = getComputedStyle(root).getPropertyValue('--sidebar-width-open').trim();
        const closedWidth = getComputedStyle(root).getPropertyValue('--sidebar-width-closed').trim();

        if (isClosed) {
            sidebar.classList.remove('close');
            root.style.setProperty('--sidebar-width', openWidth);
            toggleBtn.innerHTML = '«';
        } else {
            sidebar.classList.add('close');
            root.style.setProperty('--sidebar-width', closedWidth);
            toggleBtn.innerHTML = '»';
        }
    };
}

export function getThumbImageName(year, month, day, thumb, ext) {
    if (thumb === 'ghi') {
        return `thumbnail_ghi_${year}${month}${day}${ext}`;
    } else if (thumb === 'tbs_03km') {
        return `thumbnail_tbs_${year}${month}${day}_03km${ext}`;
    } else if (thumb === 'tbs_15km') {
        return `thumbnail_tbs_${year}${month}${day}_15km${ext}`;
    } else if (thumb === 'temp') {
        return `thumbnail_temp_${year}${month}${day}${ext}`;
    }
    return '';
}

export function getThumbnailURL(sourceURL, year, month, name) {
    return `${sourceURL}${year}${month}/${name}`;
}

export function getAnchor(thumb) {
    if (thumb === 'tbs_03km') {
        return 'CL61_TBS_03km';
    } else if (thumb === 'tbs_15km') {
        return 'CL61_TBS_15km';
    } else if (thumb === 'ghi') {
        return 'SunScout_met5';
    }
    else if (thumb === 'temp') {
        return 'SunScout_met5';
    }
    return '';
}