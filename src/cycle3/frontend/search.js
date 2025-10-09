// Backend API configuration
const API_BASE_URL = "../backend";

// ===== GLOBAL VARIABLES =====
let allArtworks = [];
let filteredArtworks = [];

// ===== DOM ELEMENTS =====
const searchInput = document.getElementById("search-input");
const artTypeFilter = document.getElementById("art-type-filter");
const periodFilter = document.getElementById("period-filter");
const regionFilter = document.getElementById("region-filter");
const sortSelect = document.getElementById("sort-select");
const optionalSort = document.getElementById("optional-sort");
const searchBtn = document.querySelector(".search-btn");
const resultsGrid = document.getElementById("search-results-grid");
const resultsCount = document.getElementById("results-count");

// ===== UTILITY FUNCTIONS =====

// Show/hide loading indicator
function showLoading(show = true) {
  const loadingEl = document.getElementById("loading-indicator");
  const errorEl = document.getElementById("error-message");
  const filtersEl = document.querySelector(".search-filters-section");
  const resultsEl = document.querySelector(".search-results-section");

  if (show) {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    filtersEl.style.display = "none";
    resultsEl.style.display = "none";
  } else {
    loadingEl.style.display = "none";
    filtersEl.style.display = "block";
    resultsEl.style.display = "block";
  }
}

// Show error message
function showError(message) {
  const loadingEl = document.getElementById("loading-indicator");
  const errorEl = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  loadingEl.style.display = "none";
  errorEl.style.display = "block";
  errorText.textContent = message;
}

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== API FUNCTIONS =====

// Fetch all artworks from backend API
async function fetchArtworks() {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks.php`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch artworks");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
}

// ===== CARD RENDERING =====

// Render search results
function renderSearchResults(artworks) {
  resultsGrid.innerHTML = "";
  resultsCount.textContent = `${artworks.length} artwork${
    artworks.length === 1 ? "" : "s"
  } found`;

  if (artworks.length === 0) {
    resultsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); color: var(--muted);">
        <p style="font-size: var(--font-size-lg);">No artworks found matching your criteria.</p>
        <p style="font-size: var(--font-size-base); margin-top: var(--space-sm);">Try adjusting your search or filters.</p>
      </div>
    `;
    return;
  }

  artworks.forEach((artwork) => {
    const card = document.createElement("div");
    card.className = "artwork-card search-result-card";
    card.setAttribute("role", "listitem");

    // Get image path
    const imagePath =
      artwork.images &&
      artwork.images[0] &&
      artwork.images[0].startsWith("assets/")
        ? `./${artwork.images[0]}`
        : artwork.images && artwork.images[0]
        ? artwork.images[0]
        : "./assets/img/art01.png";

    // Get location notice
    const locationNotice = artwork.sensitive
      ? `${artwork.region} (General area)`
      : `${artwork.region} (General area)`;

    // Truncate description if too long
    const description =
      artwork.description && artwork.description.length > 150
        ? artwork.description.substring(0, 150) + "..."
        : artwork.description || "No description available";

    card.innerHTML = `
      <img 
        src="${imagePath}" 
        alt="${artwork.title} by ${artwork.artist}"
        class="artwork-image"
        loading="lazy"
        onerror="this.src='./assets/img/art01.png'"
      >
      <div class="artwork-content">
        <h3 class="artwork-title">${artwork.title}</h3>
        <p class="artwork-artist">by ${artwork.artist}</p>
        <p class="artwork-description">${description}</p>
        <div class="artwork-tags">
          <span class="artwork-tag">${artwork.artType}</span>
          <span class="artwork-tag">${artwork.period}</span>
          <span class="artwork-tag">${artwork.region}</span>
        </div>
        <div class="artwork-footer">
          <a href="detail.html?id=${artwork.id}" class="artwork-link">View Details</a>
          <span class="location-notice">${locationNotice}</span>
        </div>
      </div>
    `;

    // Add click handler to make the entire card clickable
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".artwork-link")) {
        window.location.href = `detail.html?id=${artwork.id}`;
      }
    });

    card.style.cursor = "pointer";
    resultsGrid.appendChild(card);
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
  const optionalSortValue = optionalSort.value;

  // Filter artworks (only show approved ones)
  filteredArtworks = allArtworks.filter((artwork) => {
    // Only show approved artworks
    if (artwork.status !== "approved") return false;

    // Search filter
    const matchesSearch =
      !searchTerm ||
      artwork.title.toLowerCase().includes(searchTerm) ||
      artwork.artist.toLowerCase().includes(searchTerm) ||
      (artwork.description &&
        artwork.description.toLowerCase().includes(searchTerm));

    // Art type filter
    const matchesArtType = !artTypeValue || artwork.artType === artTypeValue;

    // Period filter
    const matchesPeriod = !periodValue || artwork.period === periodValue;

    // Region filter
    const matchesRegion = !regionValue || artwork.region === regionValue;

    return matchesSearch && matchesArtType && matchesPeriod && matchesRegion;
  });

  // Sort artworks
  sortArtworks(filteredArtworks, sortValue, optionalSortValue);

  // Re-render results
  renderSearchResults(filteredArtworks);
}

// Sort artworks based on selected criteria
function sortArtworks(artworks, sortBy, secondarySort) {
  artworks.sort((a, b) => {
    let primaryComparison = 0;

    // Primary sort
    switch (sortBy) {
      case "newest":
        // Sort by submitted_at date (newest first)
        const dateA = new Date(a.submitted_at || a.dateAdded || "2020-01-01");
        const dateB = new Date(b.submitted_at || b.dateAdded || "2020-01-01");
        primaryComparison = dateB - dateA;
        break;
      case "title":
        primaryComparison = a.title.localeCompare(b.title);
        break;
      case "artist":
        primaryComparison = a.artist.localeCompare(b.artist);
        break;
      case "relevance":
        // For relevance, we could implement a relevance score based on search term
        // For now, default to newest
        const relDateA = new Date(
          a.submitted_at || a.dateAdded || "2020-01-01"
        );
        const relDateB = new Date(
          b.submitted_at || b.dateAdded || "2020-01-01"
        );
        primaryComparison = relDateB - relDateA;
        break;
      default:
        primaryComparison = 0;
    }

    // If primary sort is equal, use secondary sort
    if (primaryComparison === 0 && secondarySort) {
      switch (secondarySort) {
        case "artist":
          return a.artist.localeCompare(b.artist);
        case "region":
          return a.region.localeCompare(b.region);
        case "date-added":
          const secDateA = new Date(
            a.submitted_at || a.dateAdded || "2020-01-01"
          );
          const secDateB = new Date(
            b.submitted_at || b.dateAdded || "2020-01-01"
          );
          return secDateB - secDateA;
        default:
          return a.title.localeCompare(b.title);
      }
    }

    return primaryComparison || a.title.localeCompare(b.title);
  });
}

// ===== EVENT LISTENERS =====

// Debounced search handler
const debouncedApplyFilters = debounce(applyFilters, 300);

// ===== INITIALIZATION =====

// Initialize the search page when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  showLoading(true);

  try {
    // Fetch all artworks from backend
    allArtworks = await fetchArtworks();
    filteredArtworks = [...allArtworks];

    showLoading(false);

    // Initial render of all approved results
    applyFilters();

    // Set up event listeners
    if (searchInput) {
      searchInput.addEventListener("input", debouncedApplyFilters);
    }
    if (artTypeFilter) {
      artTypeFilter.addEventListener("change", applyFilters);
    }
    if (periodFilter) {
      periodFilter.addEventListener("change", applyFilters);
    }
    if (regionFilter) {
      regionFilter.addEventListener("change", applyFilters);
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", applyFilters);
    }
    if (optionalSort) {
      optionalSort.addEventListener("change", applyFilters);
    }
    if (searchBtn) {
      searchBtn.addEventListener("click", applyFilters);
    }

    // Handle deep link: ?artist=<name>&autoview=1
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const artistParam = urlParams.get("artist");
      const autoview = urlParams.get("autoview");

      if (artistParam && searchInput) {
        searchInput.value = artistParam;
        applyFilters();

        if (autoview === "1" || autoview === "true") {
          // Auto-open first result if autoview is requested
          const firstArtwork = filteredArtworks[0];
          if (firstArtwork) {
            window.location.href = `detail.html?id=${firstArtwork.id}`;
          }
        }
      }
    } catch (error) {
      console.warn("Error handling URL parameters:", error);
    }

    console.log("Search page initialized successfully");
    console.log(`Loaded ${allArtworks.length} artwork entries for search`);
  } catch (error) {
    console.error("Failed to load artworks:", error);
    showError(
      error.message || "Failed to load artworks. Please try again later."
    );
  }
});
