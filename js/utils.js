// Product list
export const prods = [
    'CL61_TBS_03km', 'CL61_TBS_15km',
    'MRR1',
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

export const defaultprods = [
    'CL61_TBS_03km', 'CL61_TBS_15km', 'MRR1', 'SunScout_met5'
];

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