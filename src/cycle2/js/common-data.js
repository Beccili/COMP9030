// Shared data for the Indigenous Art Atlas
// Region centroids for coordinate mapping - artwork data now comes from backend
// Expose under window.AppData for use by all pages

(function () {
  // Region centroids for location sensitivity handling (used by map)
  // Maps Australian state/territory codes to approximate geographic centers
  const regionCentroids = {
    NSW: { lat: -32.1656, lng: 147.0167 },
    VIC: { lat: -36.5986, lng: 144.678 },
    QLD: { lat: -22.1646, lng: 144.0647 },
    SA: { lat: -30.0002, lng: 136.2092 },
    WA: { lat: -25.2744, lng: 123.7751 },
    NT: { lat: -19.4914, lng: 132.551 },
    TAS: { lat: -42.0409, lng: 146.5925 },
    ACT: { lat: -35.3081, lng: 149.1244 },
  };

  window.AppData = {
    artEntries: [], // Artwork data loaded from backend via api.js
    regionCentroids,
  };
})();

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 24
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/

