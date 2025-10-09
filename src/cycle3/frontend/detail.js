// Backend API configuration
const API_BASE_URL = "../backend";

// ===== GLOBAL VARIABLES =====
let currentArtwork = null;
let currentImageIndex = 0;
let relatedArtworks = [];

// ===== UTILITY FUNCTIONS =====

// Get artwork ID from URL parameters
function getArtworkIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Show/hide loading indicator
function showLoading(show = true) {
  const loadingEl = document.getElementById("loading-indicator");
  const errorEl = document.getElementById("error-message");
  const detailEl = document.getElementById("detail-section");
  const culturalEl = document.getElementById("cultural-section");
  const relatedEl = document.getElementById("related-section");

  if (show) {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    detailEl.style.display = "none";
    culturalEl.style.display = "none";
    relatedEl.style.display = "none";
  } else {
    loadingEl.style.display = "none";
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

// Show artwork content
function showArtworkContent() {
  const detailEl = document.getElementById("detail-section");
  const culturalEl = document.getElementById("cultural-section");
  const relatedEl = document.getElementById("related-section");

  detailEl.style.display = "block";
  culturalEl.style.display = "block";
  relatedEl.style.display = "block";
}

// ===== API FUNCTIONS =====

// Fetch artwork from backend API
async function fetchArtwork(artworkId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/artworks.php?id=${artworkId}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch artwork");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching artwork:", error);
    throw error;
  }
}

// Fetch related artworks from backend API
async function fetchRelatedArtworks(currentArtwork) {
  try {
    // Get all approved artworks first
    const response = await fetch(`${API_BASE_URL}/artworks.php`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch related artworks");
    }

    const allArtworks = result.data;

    // Filter for related artworks (same artist, art type, or region, excluding current)
    const related = allArtworks
      .filter(
        (artwork) =>
          artwork.id !== currentArtwork.id &&
          artwork.status === "approved" &&
          (artwork.artist === currentArtwork.artist ||
            artwork.artType === currentArtwork.artType ||
            artwork.region === currentArtwork.region)
      )
      .slice(0, 3);

    return related;
  } catch (error) {
    console.error("Error fetching related artworks:", error);
    return [];
  }
}

// ===== IMAGE CAROUSEL FUNCTIONS =====

// Update main image
function updateMainImage(imageIndex) {
  if (
    !currentArtwork ||
    !currentArtwork.images ||
    !currentArtwork.images[imageIndex]
  )
    return;

  const mainImage = document.getElementById("main-image");
  const imagePath = currentArtwork.images[imageIndex].startsWith("assets/")
    ? `./${currentArtwork.images[imageIndex]}`
    : currentArtwork.images[imageIndex];

  mainImage.src = imagePath;
  mainImage.alt = `${currentArtwork.title} by ${
    currentArtwork.artist
  } - Image ${imageIndex + 1}`;
  currentImageIndex = imageIndex;
  updateThumbnailSelection();
}

// Update thumbnail selection visual state
function updateThumbnailSelection() {
  const thumbnails = document.querySelectorAll(".thumbnail");
  thumbnails.forEach((thumb, index) => {
    if (index === currentImageIndex) {
      thumb.classList.add("thumbnail-active");
    } else {
      thumb.classList.remove("thumbnail-active");
    }
  });
}

// Navigate to previous image
function previousImage() {
  if (
    !currentArtwork ||
    !currentArtwork.images ||
    currentArtwork.images.length <= 1
  )
    return;
  currentImageIndex =
    (currentImageIndex - 1 + currentArtwork.images.length) %
    currentArtwork.images.length;
  updateMainImage(currentImageIndex);
}

// Navigate to next image
function nextImage() {
  if (
    !currentArtwork ||
    !currentArtwork.images ||
    currentArtwork.images.length <= 1
  )
    return;
  currentImageIndex = (currentImageIndex + 1) % currentArtwork.images.length;
  updateMainImage(currentImageIndex);
}

// Create thumbnail elements
function createThumbnails() {
  const thumbnailsContainer = document.getElementById("carousel-thumbnails");
  thumbnailsContainer.innerHTML = "";

  if (
    !currentArtwork ||
    !currentArtwork.images ||
    currentArtwork.images.length <= 1
  ) {
    thumbnailsContainer.style.display = "none";
    return;
  }

  thumbnailsContainer.style.display = "flex";

  currentArtwork.images.forEach((imageSrc, index) => {
    const thumbnail = document.createElement("img");
    const imagePath = imageSrc.startsWith("assets/")
      ? `./${imageSrc}`
      : imageSrc;

    thumbnail.src = imagePath;
    thumbnail.alt = `${currentArtwork.title} thumbnail ${index + 1}`;
    thumbnail.className = "thumbnail";
    thumbnail.onclick = () => updateMainImage(index);

    if (index === currentImageIndex)
      thumbnail.classList.add("thumbnail-active");
    thumbnailsContainer.appendChild(thumbnail);
  });
}

// ===== CONTENT POPULATION =====

// Populate artwork details
function populateArtworkDetails(artwork) {
  document.title = `${artwork.title} — Indigenous Art Atlas`;
  document.getElementById("breadcrumb-title").textContent = artwork.title;
  document.getElementById("artwork-title").textContent = artwork.title;
  document.getElementById(
    "artwork-artist"
  ).textContent = `by ${artwork.artist}`;
  document.getElementById("artwork-description").textContent =
    artwork.description;
  document.getElementById("artwork-type").textContent = artwork.artType;

  // Handle age/condition information
  const ageInfo = artwork.dateAdded
    ? `Created ${new Date(
        artwork.dateAdded
      ).getFullYear()}, Condition details not available`
    : "Age and condition information not available";
  document.getElementById("artwork-age").textContent = ageInfo;

  document.getElementById("artist-info").textContent =
    "Indigenous artist information";
  document.getElementById("artist-name").textContent = artwork.artist;

  // Handle location information with sensitivity
  const locationText = artwork.sensitive
    ? `${artwork.region} (General area)`
    : `${artwork.region} (General area)`;
  document.getElementById("artwork-location").textContent = locationText;
  document.getElementById("artwork-period").textContent = artwork.period;

  // Handle cultural context
  const culturalContext =
    artwork.culturalContext ||
    "Cultural context information will be provided with community consultation.";
  document.getElementById(
    "cultural-description"
  ).innerHTML = `<p>${culturalContext}</p>`;

  // Update images
  if (artwork.images && artwork.images.length > 0) {
    updateMainImage(0);
    createThumbnails();
  }
}

// ===== RELATED ARTWORKS =====

function renderRelatedArtworks(artworks) {
  const relatedContainer = document.getElementById("related-artworks");

  if (artworks.length === 0) {
    relatedContainer.innerHTML =
      '<p style="text-align: center; color: var(--muted);">No related artworks found.</p>';
    return;
  }

  relatedContainer.innerHTML = "";

  artworks.forEach((artwork) => {
    const card = document.createElement("div");
    card.className = "related-card";

    const imagePath =
      artwork.images &&
      artwork.images[0] &&
      artwork.images[0].startsWith("assets/")
        ? `./${artwork.images[0]}`
        : artwork.images && artwork.images[0]
        ? artwork.images[0]
        : "./assets/img/art01.png";

    card.innerHTML = `
      <img src="${imagePath}" alt="${artwork.title} by ${artwork.artist}" class="related-image">
      <div class="related-content">
        <h3 class="related-title">${artwork.title}</h3>
        <p class="related-artist">by ${artwork.artist}</p>
        <div class="related-tags">
          <span class="related-tag">${artwork.artType}</span>
          <span class="related-tag">${artwork.region}</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `detail.html?id=${artwork.id}`;
    };

    relatedContainer.appendChild(card);
  });
}

// ===== UTILITY FUNCTIONS FOR SHARING =====

function shareArtwork() {
  if (!currentArtwork) return;

  if (navigator.share) {
    navigator.share({
      title: `${currentArtwork.title} by ${currentArtwork.artist}`,
      text: `Check out this Indigenous artwork: ${currentArtwork.title}`,
      url: window.location.href,
    });
  } else {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(() => {
        alert("Unable to share. Please copy the URL manually.");
      });
  }
}

// Report modal controls
function showReportForm() {
  const modal = document.getElementById("report-modal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("select, input, textarea");
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

function closeReportForm() {
  const modal = document.getElementById("report-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
    const form = document.getElementById("report-form");
    if (form) form.reset();
  }
}

function submitReport(event) {
  event.preventDefault();
  const reportData = {
    artworkId: currentArtwork ? currentArtwork.id : "unknown",
    artworkTitle: currentArtwork ? currentArtwork.title : "unknown",
    reason: document.getElementById("report-reason").value,
    details: document.getElementById("report-details").value,
    email: document.getElementById("report-email").value || "anonymous",
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  console.log("Report submitted:", reportData);
  alert(
    "Thank you for your report. We will review this artwork and take appropriate action if necessary."
  );
  closeReportForm();
}

// ===== EVENT LISTENERS =====

// Close modal when clicking on overlay
document.addEventListener("click", function (event) {
  if (event.target.id === "report-modal") closeReportForm();
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modal = document.getElementById("report-modal");
    if (modal && modal.style.display === "flex") closeReportForm();
  }
});

// Make functions globally available
window.shareArtwork = shareArtwork;
window.showReportForm = showReportForm;
window.closeReportForm = closeReportForm;
window.submitReport = submitReport;

// ===== INITIALIZATION =====

document.addEventListener("DOMContentLoaded", async function () {
  const artworkId = getArtworkIdFromURL();

  if (!artworkId) {
    showError(
      "No artwork ID provided. Please select an artwork from the search page."
    );
    return;
  }

  showLoading(true);

  try {
    // Fetch artwork details
    currentArtwork = await fetchArtwork(artworkId);

    if (!currentArtwork) {
      throw new Error("Artwork not found");
    }

    // Populate artwork details
    populateArtworkDetails(currentArtwork);
    showArtworkContent();

    // Fetch and render related artworks
    relatedArtworks = await fetchRelatedArtworks(currentArtwork);
    renderRelatedArtworks(relatedArtworks);

    // Set up carousel controls
    const prevBtn = document.querySelector(".carousel-prev");
    const nextBtn = document.querySelector(".carousel-next");

    if (prevBtn) prevBtn.onclick = previousImage;
    if (nextBtn) nextBtn.onclick = nextImage;

    // Hide carousel buttons if only one image
    if (!currentArtwork.images || currentArtwork.images.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
    }

    // Set up keyboard navigation
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") previousImage();
      else if (e.key === "ArrowRight") nextImage();
    });

    showLoading(false);

    console.log("Detail page initialized successfully");
    console.log(
      "Loaded artwork:",
      currentArtwork.title,
      "by",
      currentArtwork.artist
    );
  } catch (error) {
    console.error("Failed to load artwork:", error);
    showError(
      error.message || "Failed to load artwork details. Please try again later."
    );
  }
});
