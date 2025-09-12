// Shared entries from common data
const artEntries = (window.AppData && window.AppData.artEntries) || [];

// ===== GLOBAL VARIABLES =====
let filteredEntries = [...artEntries];

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

// ===== CARD RENDERING =====

// Render search results
function renderSearchResults(entries) {
  resultsGrid.innerHTML = "";
  resultsCount.textContent = `${entries.length} artwork${entries.length === 1 ? '' : 's'} found`;

  if (entries.length === 0) {
    resultsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); color: var(--muted);">
        <p style="font-size: var(--font-size-lg);">No artworks found matching your criteria.</p>
        <p style="font-size: var(--font-size-base); margin-top: var(--space-sm);">Try adjusting your search or filters.</p>
      </div>
    `;
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "artwork-card search-result-card";
    card.setAttribute("role", "listitem");

    const locationNotice = window.Utils.getLocationNotice(entry);

    card.innerHTML = `
      <img 
        src="${window.Utils.asset(entry.images[0])}" 
        alt="${entry.title} by ${entry.artist}"
        class="artwork-image"
        loading="lazy"
        onerror="this.src='${window.Utils.asset('assets/img/art01.png')}'"
      >
      <div class="artwork-content">
        <h3 class="artwork-title">${entry.title}</h3>
        <p class="artwork-artist">by ${entry.artist}</p>
        <p class="artwork-description">${entry.description.length > 150 ? entry.description.substring(0, 150) + '...' : entry.description}</p>
        <div class="artwork-tags">
          <span class="artwork-tag">${entry.artType}</span>
          <span class="artwork-tag">${entry.period}</span>
          <span class="artwork-tag">${entry.region}</span>
        </div>
        <div class="artwork-footer">
          <a href="${window.Utils.page('detail.html')}?id=${entry.id}" class="artwork-link">View Details</a>
          ${
            locationNotice
              ? `<span class="location-notice">${locationNotice}</span>`
              : ""
          }
        </div>
      </div>
    `;

    // Add click handler to make the entire card clickable
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.artwork-link')) {
        window.location.href = `${window.Utils.page('detail.html')}?id=${entry.id}`;
      }
    });

    card.style.cursor = 'pointer';
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
  sortEntries(filteredEntries, sortValue, optionalSortValue);

  // Re-render results
  renderSearchResults(filteredEntries);
}

// Sort entries based on selected criteria
function sortEntries(entries, sortBy, secondarySort) {
  entries.sort((a, b) => {
    let primaryComparison = 0;
    
    // Primary sort
    switch (sortBy) {
      case "newest":
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        primaryComparison = dateB - dateA;
        break;
      case "title":
        primaryComparison = a.title.localeCompare(b.title);
        break;
      case "relevance":
        // For relevance, we could implement a relevance score based on search term
        // For now, default to newest
        const relDateA = new Date(a.dateAdded);
        const relDateB = new Date(b.dateAdded);
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
          const secDateA = new Date(a.dateAdded);
          const secDateB = new Date(b.dateAdded);
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
const debouncedApplyFilters = window.Utils.debounce(applyFilters, 300);

// ===== INITIALIZATION =====

// Initialize the search page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initial render of all results
  renderSearchResults(filteredEntries);

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

  console.log("Search page initialized successfully");
  console.log(`Loaded ${artEntries.length} artwork entries for search`);
});
