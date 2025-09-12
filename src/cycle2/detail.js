// Shared entries
const artEntries = (window.AppData && window.AppData.artEntries) || [];

// ===== GLOBAL VARIABLES =====
let currentArtwork = null;
let currentImageIndex = 0;

// ===== UTILITY FUNCTIONS =====

// Get artwork ID from URL parameters
function getArtworkIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// ===== IMAGE CAROUSEL FUNCTIONS =====

// Update main image
function updateMainImage(imageIndex) {
  if (!currentArtwork || !currentArtwork.images[imageIndex]) return;
  const mainImage = document.getElementById('main-image');
  mainImage.src = window.Utils.asset(currentArtwork.images[imageIndex]);
  mainImage.alt = `${currentArtwork.title} by ${currentArtwork.artist} - Image ${imageIndex + 1}`;
  currentImageIndex = imageIndex;
  updateThumbnailSelection();
}

// Update thumbnail selection visual state
function updateThumbnailSelection() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach((thumb, index) => {
    if (index === currentImageIndex) {
      thumb.classList.add('thumbnail-active');
    } else {
      thumb.classList.remove('thumbnail-active');
    }
  });
}

// Navigate to previous image
function previousImage() {
  if (!currentArtwork || currentArtwork.images.length <= 1) return;
  currentImageIndex = (currentImageIndex - 1 + currentArtwork.images.length) % currentArtwork.images.length;
  updateMainImage(currentImageIndex);
}

// Navigate to next image
function nextImage() {
  if (!currentArtwork || currentArtwork.images.length <= 1) return;
  currentImageIndex = (currentImageIndex + 1) % currentArtwork.images.length;
  updateMainImage(currentImageIndex);
}

// Create thumbnail elements
function createThumbnails() {
  const thumbnailsContainer = document.getElementById('carousel-thumbnails');
  thumbnailsContainer.innerHTML = '';
  if (!currentArtwork || currentArtwork.images.length <= 1) {
    thumbnailsContainer.style.display = 'none';
    return;
  }
  thumbnailsContainer.style.display = 'flex';
  currentArtwork.images.forEach((imageSrc, index) => {
    const thumbnail = document.createElement('img');
    thumbnail.src = window.Utils.asset(imageSrc);
    thumbnail.alt = `${currentArtwork.title} thumbnail ${index + 1}`;
    thumbnail.className = 'thumbnail';
    thumbnail.onclick = () => updateMainImage(index);
    if (index === currentImageIndex) thumbnail.classList.add('thumbnail-active');
    thumbnailsContainer.appendChild(thumbnail);
  });
}

// ===== CONTENT POPULATION =====

// Populate artwork details
function populateArtworkDetails(artwork) {
  document.title = `${artwork.title} — Indigenous Art Atlas`;
  document.getElementById('breadcrumb-title').textContent = artwork.title;
  document.getElementById('artwork-title').textContent = artwork.title;
  document.getElementById('artwork-artist').textContent = `by ${artwork.artist}`;
  document.getElementById('artwork-description').textContent = artwork.description;
  document.getElementById('artwork-type').textContent = artwork.artType;
  document.getElementById('artwork-age').textContent = artwork.ageCondition || `Created ${new Date(artwork.dateAdded).getFullYear()}, Condition details not available`;
  document.getElementById('artist-info').textContent = artwork.artistInfo || 'Artist information not available';
  document.getElementById('artist-name').textContent = artwork.artist;

  const locationText = artwork.sensitive
    ? window.Utils.getSensitiveLocationDisplay(artwork)
    : `${artwork.region} (${window.Utils.getLocationNotice(artwork)})`;
  document.getElementById('artwork-location').textContent = locationText;
  document.getElementById('artwork-period').textContent = artwork.period;

  document.getElementById('cultural-description').innerHTML = `<p>${artwork.culturalContext || 'Cultural context information will be provided with community consultation.'}</p>`;

  updateMainImage(0);
  createThumbnails();
}

// ===== RELATED ARTWORKS =====

function getRelatedArtworks(currentArtwork) {
  return artEntries
    .filter(artwork =>
      artwork.id !== currentArtwork.id && (
        artwork.artist === currentArtwork.artist ||
        artwork.artType === currentArtwork.artType ||
        artwork.region === currentArtwork.region
      )
    )
    .slice(0, 3);
}

function renderRelatedArtworks(artwork) {
  const relatedContainer = document.getElementById('related-artworks');
  const relatedArtworks = getRelatedArtworks(artwork);
  if (relatedArtworks.length === 0) {
    relatedContainer.innerHTML = '<p style="text-align: center; color: var(--muted);">No related artworks found.</p>';
    return;
  }
  relatedContainer.innerHTML = '';
  relatedArtworks.forEach(related => {
    const card = document.createElement('div');
    card.className = 'related-card';
    card.innerHTML = `
      <img src="${window.Utils.asset(related.images[0])}" alt="${related.title} by ${related.artist}" class="related-image">
      <div class="related-content">
        <h3 class="related-title">${related.title}</h3>
        <p class="related-artist">by ${related.artist}</p>
        <div class="related-tags">
          <span class="related-tag">${related.artType}</span>
          <span class="related-tag">${related.region}</span>
        </div>
      </div>
    `;
    card.onclick = () => {
      window.location.href = `${window.Utils.page('detail.html')}?id=${related.id}`;
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
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Unable to share. Please copy the URL manually.');
    });
  }
}

// Report modal controls
function showReportForm() {
  const modal = document.getElementById('report-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('select, input, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

function closeReportForm() {
  const modal = document.getElementById('report-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    const form = document.getElementById('report-form');
    if (form) form.reset();
  }
}

function submitReport(event) {
  event.preventDefault();
  const reportData = {
    artworkId: currentArtwork ? currentArtwork.id : 'unknown',
    artworkTitle: currentArtwork ? currentArtwork.title : 'unknown',
    reason: document.getElementById('report-reason').value,
    details: document.getElementById('report-details').value,
    email: document.getElementById('report-email').value || 'anonymous',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
  console.log('Report submitted:', reportData);
  alert('Thank you for your report. We will review this artwork and take appropriate action if necessary.');
  closeReportForm();
}

// Close modal when clicking on overlay
document.addEventListener('click', function (event) {
  if (event.target.id === 'report-modal') closeReportForm();
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('report-modal');
    if (modal && modal.style.display === 'flex') closeReportForm();
  }
});

// Make functions globally available
window.shareArtwork = shareArtwork;
window.showReportForm = showReportForm;
window.closeReportForm = closeReportForm;
window.submitReport = submitReport;

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function () {
  const artworkId = getArtworkIdFromURL();
  if (!artworkId) {
    window.location.href = window.Utils.page('search.html');
    return;
  }
  currentArtwork = artEntries.find(artwork => artwork.id === artworkId);
  if (!currentArtwork) {
    document.getElementById('artwork-title').textContent = 'Artwork Not Found';
    document.getElementById('artwork-description').textContent = 'The requested artwork could not be found. Please check the URL or return to search.';
    return;
  }
  populateArtworkDetails(currentArtwork);
  renderRelatedArtworks(currentArtwork);
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (prevBtn) prevBtn.onclick = previousImage;
  if (nextBtn) nextBtn.onclick = nextImage;
  if (!currentArtwork.images || currentArtwork.images.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousImage();
    else if (e.key === 'ArrowRight') nextImage();
  });
  console.log('Detail page initialized successfully');
  console.log('Loaded artwork:', currentArtwork.title, 'by', currentArtwork.artist);
});

