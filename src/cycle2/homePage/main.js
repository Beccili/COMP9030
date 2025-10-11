// ===== Import API =====
import api from '../api.js';

// ===== SHARED DATA =====
let artEntries = (window.AppData && window.AppData.artEntries) || [];
const regionCentroids = (window.AppData && window.AppData.regionCentroids) || {};

// Load artworks from backend on initialization
async function loadArtworksFromBackend() {
  try {
    const artworks = await api.getArtworks({ status: 'approved' });
    
    // Convert backend artworks to frontend format for the map
    artEntries = artworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist || 'Unknown Artist',
      description: artwork.intro || '',
      period: artwork.period || 'modern',
      region: artwork.region || '',
      sensitive: artwork.sensitive || false,
      coords: artwork.coords || inferCoordsFromRegion(artwork.region),
      location_sensitivity: artwork.sensitive ? 'general' : 'exact',
      tags: artwork.tags || [],
      artType: artwork.type || 'Artwork',
      images: artwork.artworkImages && artwork.artworkImages.length > 0
        ? artwork.artworkImages.map(img => img.name || img)
        : ['assets/img/art01.png'] // Fallback image
    }));
    
    // Update showcase entries
    showcaseEntries = artEntries.slice(0, 5);
    
    // Reinitialize map and gallery if they exist
    if (map) {
      addMarkersToMap(artEntries);
      fitMapToMarkers();
    }
    if (artworkStrip) {
      renderArtworkStrip(showcaseEntries);
    }
  } catch (error) {
    console.error('Failed to load artworks from backend:', error);
    console.warn('Using default data from window.AppData');
  }
}

// Helper function to infer coordinates from region
function inferCoordsFromRegion(region) {
  return regionCentroids[region] || { lat: -25.2744, lng: 133.7751 }; // Default to Australia center
}

// ===== GLOBAL VARIABLES =====
let map;
let markers = [];
// Show only first 5 artworks for main page showcase
let showcaseEntries = artEntries.slice(0, 5);
let scrollZoomEnabled = false;

// ===== DOM ELEMENTS =====
const artworkStrip = document.getElementById("artwork-strip");
const zoomToggle = document.getElementById("zoom-toggle");
const zoomStatus = document.getElementById("zoom-status");

// ===== UTILITY FUNCTIONS =====

// Generate jittered coordinates for general location sensitivity
function generalizeCoords(entry) {
  if (entry.location_sensitivity === "exact") {
    return entry.coords;
  } else if (entry.location_sensitivity === "general") {
    // Add random offset within ~10-25km (roughly 0.15-0.25 degrees)
    const offsetRange = 0.2;
    const latOffset = (Math.random() - 0.5) * offsetRange;
    const lngOffset = (Math.random() - 0.5) * offsetRange;
    return {
      lat: entry.coords.lat + latOffset,
      lng: entry.coords.lng + lngOffset,
    };
  } else if (entry.location_sensitivity === "region") {
    return regionCentroids[entry.region] || entry.coords;
  }
  // 'hidden' case - return null to indicate no marker should be shown
  return null;
}

// (region inference and notices come from window.Utils)

// ===== MAP FUNCTIONS =====

// Initialize Leaflet map
function initializeMap() {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  // Add markers for all entries (map should show everything)
  addMarkersToMap(artEntries);

  // Fit map to show all markers
  fitMapToMarkers();
}

// Add markers to map
function addMarkersToMap(entries) {
  // Clear existing markers
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  entries.forEach((entry) => {
    const coords = generalizeCoords(entry);
    if (coords) {
      // Create different colored markers for sensitive artworks
      let marker;
      if (entry.sensitive) {
        // Orange marker for sensitive artworks - SVG icon matching default Leaflet proportions (25x41)
        const orangeSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
            <path d="M12.5 1 C6.148 1 1 6.148 1 12.5 c0 2.95 0.991 5.692 2.663 7.84L12.5 40 l8.837-19.66C23.009 18.192 24 15.45 24 12.5 24 6.148 18.852 1 12.5 1z" fill="#ff8c00" stroke="%23ffffff" stroke-width="2"/>
            <circle cx="12.5" cy="12" r="4" fill="%23ffffff"/>
          </svg>`;
        const orangeIcon = L.icon({
          iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(orangeSvg),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
        marker = L.marker([coords.lat, coords.lng], { icon: orangeIcon });
      } else {
        // Default blue marker for regular artworks
        marker = L.marker([coords.lat, coords.lng]);
      }

      // Create popup content with appropriate location display
      const locationDisplay = entry.sensitive ? window.Utils.getSensitiveLocationDisplay(entry) : window.Utils.getLocationNotice(entry);
      const popupContent = `
        <div class="map-popup">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; line-height: 1.2;">${entry.title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--muted);">by ${entry.artist}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: var(--muted); line-height: 1.4;">${entry.description.length > 100 ? entry.description.substring(0, 100) + '...' : entry.description}</p>
          <div style="margin: 8px 0; font-size: 11px;">
            <span style="display: inline-block; background: var(--elev-2); color: var(--muted); padding: 2px 6px; border-radius: 3px; margin-right: 4px;">${entry.artType}</span>
            <span style="display: inline-block; background: var(--elev-2); color: var(--muted); padding: 2px 6px; border-radius: 3px;">${entry.region}</span>
            ${entry.sensitive ? '<span style="display: inline-block; background: #ff8c00; color: white; padding: 2px 6px; border-radius: 3px; margin-left: 4px; font-size: 10px;">SENSITIVE</span>' : ''}
          </div>
          ${locationDisplay ? `<p style="margin: 4px 0 8px 0; font-size: 11px; font-style: italic; color: var(--muted);">Location: ${locationDisplay}</p>` : ""}
          <a href="${window.Utils.page('detail.html')}?id=${entry.id}" style="color: var(--link); text-decoration: none; font-weight: 500; font-size: 13px; display: inline-block; padding: 4px 8px; background: var(--elev-1); border-radius: 4px; border: 1px solid var(--accent);">View Details</a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(map);
      markers.push(marker);
    }
  });
}

// Fit map to show all markers
function fitMapToMarkers() {
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  } else {
    // Default view of Australia if no markers
    map.setView([-25.2744, 133.7751], 4);
  }
}

// Toggle scroll zoom
function toggleScrollZoom() {
  scrollZoomEnabled = !scrollZoomEnabled;
  if (scrollZoomEnabled) {
    map.scrollWheelZoom.enable();
    zoomStatus.textContent = "Scroll zoom: on";
  } else {
    map.scrollWheelZoom.disable();
    zoomStatus.textContent = "Scroll zoom: off";
  }
}

// ===== ARTWORK STRIP RENDERING =====

// Render artwork strip (small images only)
function renderArtworkStrip(entries) {
  if (!artworkStrip) return;

  artworkStrip.innerHTML = "";

  if (entries.length === 0) {
    artworkStrip.innerHTML = `
      <div style="text-align: center; padding: var(--space-lg); color: var(--muted); width: 100%;">
        <p style="font-size: var(--font-size-base);">No featured artworks available.</p>
      </div>
    `;
    return;
  }

  entries.forEach((entry) => {
    const stripItem = document.createElement("div");
    stripItem.className = "artwork-strip-item";
    stripItem.setAttribute("role", "listitem");
    stripItem.title = `${entry.title} by ${entry.artist}`;

    stripItem.innerHTML = `
      <img 
        src="${window.Utils.asset(entry.images[0])}" 
        alt="${entry.title} by ${entry.artist}"
        class="artwork-strip-image"
        loading="lazy"
        onerror="this.src='${window.Utils.asset('assets/img/art01.png')}'"
      >
    `;

    // Add click handler for navigation to detail page
    stripItem.addEventListener('click', () => {
      window.location.href = `${window.Utils.page('detail.html')}?id=${entry.id}`;
    });

    artworkStrip.appendChild(stripItem);
  });
}


// ===== INITIALIZATION =====

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Load data from backend first
  await loadArtworksFromBackend();
  
  // Initialize map
  initializeMap();

  // Initial render of artwork strip
  renderArtworkStrip(showcaseEntries);

  // Set up zoom toggle event listener
  if (zoomToggle) {
    zoomToggle.addEventListener("click", toggleScrollZoom);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Handle CTA buttons in hero
  const browseAtlasBtn = document.querySelector(".hero-actions .btn-primary");
  const submitArtworkBtn = document.querySelector(
    ".hero-actions .btn-secondary"
  );

  if (browseAtlasBtn) {
    browseAtlasBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const featuredSection = document.getElementById("featured");
      if (featuredSection) {
        featuredSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  if (submitArtworkBtn) {
    submitArtworkBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const submitNote = document.getElementById("submit-note");
      if (submitNote) {
        submitNote.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }

  // Handle map help link
  const mapHelpLink = document.querySelector(".map-help-link");
  if (mapHelpLink) {
    mapHelpLink.addEventListener("click", function (e) {
      e.preventDefault();
      const helpSection = document.getElementById("map-help-info");
      if (helpSection) {
        helpSection.classList.remove("visually-hidden");
        helpSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Hide again after 10 seconds
        setTimeout(() => {
          helpSection.classList.add("visually-hidden");
        }, 10000);
      }
    });
  }


});

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 20
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/
