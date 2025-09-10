// ===== CONTEMPORARY ABORIGINAL ARTISTS DATA =====
const artEntries = [
  {
    id: "vincent-namatjira-stand-strong",
    title: "Stand Strong for Who You Are",
    description:
      "This groundbreaking 2020 Archibald Prize-winning portrait depicts Aboriginal rugby star Adam Goodes (wearing red and black jersey) standing hand-in-hand with the artist himself. The painting celebrates Indigenous identity and resilience, with Goodes' athletic prowess interwoven with symbols of Aboriginal heritage. Namatjira became the first Aboriginal artist to win the prestigious Archibald Prize in nearly a century, making this work historically significant in recognizing Indigenous voices in Australian art.",
    artist: "Vincent Namatjira",
    artType: "Portrait",
    period: "Contemporary",
    region: "SA",
    coords: { lat: -26.9, lng: 133.1 }, // APY Lands, Indulkana Community
    location_sensitivity: "general",
    images: ["../assets/img/art01.png"],
    dateAdded: "2025-09-10",
    submitter: "art_historian",
  },
  {
    id: "kaylene-whiskey-tv",
    title: "Kaylene TV",
    description:
      "This vibrant 2017 work depicts two of Whiskey's beloved 'tough girl' icons - Cher (left) holding a microphone in silver fringe boots, and Dolly Parton (right) in pink overalls, fresh from skateboarding around the community store. The living room scene features an old TV displaying 'You're watching Kaylene TV!', suggesting this joyful gathering is broadcast through the artist's imaginary community television station. The painting brilliantly fuses pop culture icons with desert community life, decorated with local cultural symbols including Christmas trees, boomerangs, and native tobacco plants.",
    artist: "Kaylene Whiskey",
    artType: "Painting",
    period: "Contemporary",
    region: "SA",
    coords: { lat: -26.9, lng: 133.1 }, // APY Lands, Indulkana Community
    location_sensitivity: "general",
    images: ["../assets/img/art02.png"],
    dateAdded: "2025-09-09",
    submitter: "iwantja_arts",
  },
  {
    id: "tony-albert-sorry",
    title: "Sorry",
    description:
      "This powerful 2008 installation spells out 'SORRY' using large three-dimensional letters, each embedded with 99 collected vintage objects featuring Aboriginal imagery - figurines, commemorative plates, and promotional materials displaying stereotypical 'blackface' representations. These objects form a 'forest of faces' gazing at viewers, symbolizing historically distorted Aboriginal identities. Created in response to the Australian government's 2008 apology to the 'Stolen Generations', Albert recontextualizes these once-discriminatory memorabilia, transforming them into a monument that both commemorates the apology and questions whether real change has followed.",
    artist: "Tony Albert",
    artType: "Installation",
    period: "Contemporary",
    region: "QLD",
    coords: { lat: -27.4698, lng: 153.0251 }, // Brisbane
    location_sensitivity: "exact",
    images: ["../assets/img/art03.png"],
    dateAdded: "2025-09-08",
    submitter: "qagoma_curator",
  },
  {
    id: "megan-cope-death-song",
    title: "Untitled (Death Song)",
    description:
      "This 2020 sculptural sound installation transforms industrial mining waste into a playable musical instrument. Cope assembled rusted spiral drill bits, cut oil drums, metal frames, and rock core samples into a suspended ensemble that can be performed by musicians using bows and percussion. Inspired by the haunting call of the endangered Bush Stone-curlew, the installation mimics the bird's cry through these industrial remnants. When performed, the work creates an eerie soundscape of bird calls and wind, warning of environmental destruction and species endangerment caused by mining, while echoing the Quandamooka tradition of 'listening to Country'.",
    artist: "Megan Cope",
    artType: "Sound Installation",
    period: "Contemporary",
    region: "QLD",
    coords: { lat: -27.4, lng: 153.4 }, // Moreton Bay, Minjerribah (North Stradbroke Island)
    location_sensitivity: "general",
    images: ["../assets/img/art04.png"],
    dateAdded: "2025-09-07",
    submitter: "adelaide_biennial",
  },
  {
    id: "yhonnie-scarce-thunder-poison",
    title: "Thunder Raining Poison",
    description:
      "This monumental 2015 installation features a suspended 'nuclear cloud' composed of over 2000 hand-blown glass yams, hanging five meters high in cloud and raindrop formations. Each translucent glass yam, shaped after the desert plant that is traditional Aboriginal food, symbolizes lives affected by the 1950s Maralinga nuclear tests on Kokatha land. The title 'Thunder Raining Poison' refers to radioactive fallout that rained down after nuclear explosions, causing irreversible land contamination. Ironically, the intense heat from one Maralinga blast once melted nearby sand into glass, inspiring Scarce's choice of medium. The installation is both breathtakingly beautiful and chillingly haunting - a luminous chandelier-like structure that tells the heavy truth of nuclear colonialism.",
    artist: "Yhonnie Scarce",
    artType: "Glass Installation",
    period: "Contemporary",
    region: "SA",
    coords: { lat: -30.2, lng: 131.6 }, // Maralinga test site area
    location_sensitivity: "region",
    images: ["../assets/img/art05.png"],
    dateAdded: "2025-09-06",
    submitter: "national_gallery",
  },
  // Placeholder entries for the remaining 4 artworks to be provided
  {
    id: "placeholder-artwork-6",
    title: "Artwork Title 6 (To be updated)",
    description:
      "Detailed description will be provided for this contemporary Aboriginal artwork.",
    artist: "Artist Name 6",
    artType: "TBD",
    period: "Contemporary",
    region: "TBD",
    coords: { lat: -25.2744, lng: 133.7751 }, // Central Australia placeholder
    location_sensitivity: "general",
    images: ["/assets/images/placeholder-6.jpg"],
    dateAdded: "2025-09-05",
    submitter: "curator_placeholder",
  },
  {
    id: "placeholder-artwork-7",
    title: "Artwork Title 7 (To be updated)",
    description:
      "Detailed description will be provided for this contemporary Aboriginal artwork.",
    artist: "Artist Name 7",
    artType: "TBD",
    period: "Contemporary",
    region: "TBD",
    coords: { lat: -25.2744, lng: 133.7751 }, // Central Australia placeholder
    location_sensitivity: "general",
    images: ["/assets/images/placeholder-7.jpg"],
    dateAdded: "2025-09-04",
    submitter: "curator_placeholder",
  },
  {
    id: "placeholder-artwork-8",
    title: "Artwork Title 8 (To be updated)",
    description:
      "Detailed description will be provided for this contemporary Aboriginal artwork.",
    artist: "Artist Name 8",
    artType: "TBD",
    period: "Contemporary",
    region: "TBD",
    coords: { lat: -25.2744, lng: 133.7751 }, // Central Australia placeholder
    location_sensitivity: "general",
    images: ["/assets/images/placeholder-8.jpg"],
    dateAdded: "2025-09-03",
    submitter: "curator_placeholder",
  },
  {
    id: "placeholder-artwork-9",
    title: "Artwork Title 9 (To be updated)",
    description:
      "Detailed description will be provided for this contemporary Aboriginal artwork.",
    artist: "Artist Name 9",
    artType: "TBD",
    period: "Contemporary",
    region: "TBD",
    coords: { lat: -25.2744, lng: 133.7751 }, // Central Australia placeholder
    location_sensitivity: "general",
    images: ["/assets/images/placeholder-9.jpg"],
    dateAdded: "2025-09-02",
    submitter: "curator_placeholder",
  },
];

// Region centroids for location sensitivity handling
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

// ===== GLOBAL VARIABLES =====
let map;
let markers = [];
let filteredEntries = [...artEntries];
let searchTimeout;
let scrollZoomEnabled = false;

// ===== DOM ELEMENTS =====
const searchInput = document.getElementById("search-input");
const artTypeFilter = document.getElementById("art-type-filter");
const periodFilter = document.getElementById("period-filter");
const regionFilter = document.getElementById("region-filter");
const sortSelect = document.getElementById("sort-select");
const artworkGrid = document.getElementById("artwork-grid");
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

// Get location display text based on sensitivity
function getLocationNotice(entry) {
  switch (entry.location_sensitivity) {
    case "general":
      return "General area";
    case "region":
      return "Region only";
    case "hidden":
      return "Location hidden for cultural reasons";
    default:
      return "";
  }
}

// Debounce function for search
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(searchTimeout);
      func(...args);
    };
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(later, wait);
  };
}

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

  // Add markers for visible entries
  addMarkersToMap(filteredEntries);

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
      const marker = L.marker([coords.lat, coords.lng]);

      // Create popup content
      const locationNotice = getLocationNotice(entry);
      const popupContent = `
        <div class="map-popup">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${
            entry.title
          }</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: var(--muted);">by ${
            entry.artist
          }</p>
          ${
            locationNotice
              ? `<p style="margin: 0 0 8px 0; font-size: 12px; font-style: italic; color: var(--muted);">${locationNotice}</p>`
              : ""
          }
          <a href="#" style="color: var(--link); text-decoration: none; font-weight: 500;">View details</a>
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

// ===== CARD RENDERING =====

// Render artwork cards
function renderCards(entries) {
  artworkGrid.innerHTML = "";

  if (entries.length === 0) {
    artworkGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); color: var(--muted);">
        <p style="font-size: var(--font-size-lg);">No artworks found matching your criteria.</p>
        <p style="font-size: var(--font-size-base); margin-top: var(--space-sm);">Try adjusting your search or filters.</p>
      </div>
    `;
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "artwork-card";
    card.setAttribute("role", "listitem");

    const locationNotice = getLocationNotice(entry);

    card.innerHTML = `
      <img 
        src="${entry.images[0]}" 
        alt="${entry.title} by ${entry.artist}"
        class="artwork-image"
        loading="lazy"
        onerror="this.src='../assets/img/art01.png'"
      >
      <div class="artwork-content">
        <h3 class="artwork-title">${entry.title}</h3>
        <p class="artwork-artist">by ${entry.artist}</p>
        <p class="artwork-description">${entry.description}</p>
        <div class="artwork-tags">
          <span class="artwork-tag">${entry.artType}</span>
          <span class="artwork-tag">${entry.period}</span>
          <span class="artwork-tag">${entry.region}</span>
        </div>
        <div class="artwork-footer">
          <a href="#" class="artwork-link">View</a>
          ${
            locationNotice
              ? `<span class="location-notice">${locationNotice}</span>`
              : ""
          }
        </div>
      </div>
    `;

    artworkGrid.appendChild(card);
  });
}

// ===== FILTERING AND SORTING =====

// Apply filters and search
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const artTypeValue = artTypeFilter.value;
  const periodValue = periodFilter.value;
  const regionValue = regionFilter.value;
  const sortValue = sortSelect.value;

  // Filter entries
  filteredEntries = artEntries.filter((entry) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.artist.toLowerCase().includes(searchTerm) ||
      entry.description.toLowerCase().includes(searchTerm);

    // Art type filter
    const matchesArtType = !artTypeValue || entry.artType === artTypeValue;

    // Period filter
    const matchesPeriod = !periodValue || entry.period === periodValue;

    // Region filter
    const matchesRegion = !regionValue || entry.region === regionValue;

    return matchesSearch && matchesArtType && matchesPeriod && matchesRegion;
  });

  // Sort entries
  sortEntries(filteredEntries, sortValue);

  // Re-render cards and update map
  renderCards(filteredEntries);
  addMarkersToMap(filteredEntries);
  fitMapToMarkers();
}

// Sort entries based on selected criteria
function sortEntries(entries, sortBy) {
  switch (sortBy) {
    case "newest":
      entries.sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return dateB - dateA || a.title.localeCompare(b.title);
      });
      break;
    case "title":
      entries.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // Default to newest
      entries.sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return dateB - dateA || a.title.localeCompare(b.title);
      });
  }
}

// ===== EVENT LISTENERS =====

// Debounced search handler
const debouncedApplyFilters = debounce(applyFilters, 200);

// ===== INITIALIZATION =====

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize map
  initializeMap();

  // Initial render of cards
  renderCards(filteredEntries);

  // Set up event listeners
  searchInput.addEventListener("input", debouncedApplyFilters);
  artTypeFilter.addEventListener("change", applyFilters);
  periodFilter.addEventListener("change", applyFilters);
  regionFilter.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);
  zoomToggle.addEventListener("click", toggleScrollZoom);

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

  console.log("Indigenous Art Atlas initialized successfully");
  console.log(
    `Loaded ${artEntries.length} contemporary Aboriginal artwork entries (5 complete, 4 placeholders)`
  );
});
