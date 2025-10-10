// Shared utility functions for the Indigenous Art Atlas
// Expose under window.Utils for use by all pages

(function () {
  function getBasePath() {
    // If current page lives in /homePage/, assets and pages are one level up
    return window.location.pathname.includes('/homePage/') ? '..' : '.';
  }

  function cleanPath(p) {
    return (p || '').replace(/^\/+/, '');
  }

  function asset(relPath) {
    const base = getBasePath();
    return `${base}/${cleanPath(relPath)}`;
  }

  function page(relPath) {
    const base = getBasePath();
    return `${base}/${cleanPath(relPath)}`;
  }

  // Debounce helper (no external state)
  function debounce(func, wait) {
    let timeout;
    return function debounced(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Infer region from coordinates for TBD entries
  function inferRegionFromCoords(coords) {
    const { lat, lng } = coords || {};
    if (typeof lat !== 'number' || typeof lng !== 'number') return 'Central Australia';
    if (lat > -29 && lng > 138 && lng < 154) return 'QLD';
    if (lat > -37 && lng > 140 && lng < 150) return 'NSW';
    if (lat > -39 && lng > 140 && lng < 150) return 'VIC';
    if (lat > -39 && lng > 129 && lng < 141) return 'SA';
    if (lat > -35 && lng > 112 && lng < 129) return 'WA';
    if (lat > -26 && lng > 129 && lng < 139) return 'NT';
    if (lat > -44 && lng > 144 && lng < 149) return 'TAS';
    if (lat > -36 && lng > 148 && lng < 150) return 'ACT';
    return 'Central Australia';
  }

  // Get location display text based on sensitivity
  function getLocationNotice(entry) {
    if (!entry) return '';
    if (entry.sensitive) {
      const region = entry.region === 'TBD' ? inferRegionFromCoords(entry.coords) : entry.region;
      return `${region} only (Cultural sensitivity)`;
    }
    switch (entry.location_sensitivity) {
      case 'general':
        return 'General area';
      case 'region':
        return 'Region only';
      case 'hidden':
        return 'Location hidden for cultural reasons';
      default:
        return '';
    }
  }

  // Get display location for sensitive artworks
  function getSensitiveLocationDisplay(entry) {
    if (!entry) return '';
    if (entry.sensitive) {
      return entry.region === 'TBD' ? inferRegionFromCoords(entry.coords) : entry.region;
    }
    return `${entry.region} (${getLocationNotice(entry)})`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  window.Utils = {
    getBasePath,
    asset,
    page,
    debounce,
    inferRegionFromCoords,
    getLocationNotice,
    getSensitiveLocationDisplay,
    formatDate,
  };
})();

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 25
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/

