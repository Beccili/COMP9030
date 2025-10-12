// Import API module
import api from './api.js';

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
  document.getElementById('artwork-age').textContent = artwork.ageCondition || `Created ${new Date(artwork.dateAdded).getFullYear()}`;
  
  // Show artist info only if available
  const artistInfoItem = document.getElementById('artist-info-item');
  if (artwork.artistInfo && artwork.artistInfo.trim()) {
    document.getElementById('artist-info').textContent = artwork.artistInfo;
    artistInfoItem.style.display = 'flex';
  } else {
    artistInfoItem.style.display = 'none';
  }
  
  document.getElementById('artist-name').textContent = artwork.artist;

  let locationText;
  if (artwork.sensitive) {
    locationText = window.Utils.getSensitiveLocationDisplay(artwork) || artwork.region;
  } else {
    const locationNotice = window.Utils.getLocationNotice(artwork);
    if (locationNotice) {
      locationText = `${artwork.region} (${locationNotice})`;
    } else if (artwork.address) {
      locationText = `${artwork.region} (${artwork.address})`;
    } else {
      locationText = artwork.region;
    }
  }
  
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

function renderRelatedArtworksFromList(artwork, allArtworks) {
  const relatedContainer = document.getElementById('related-artworks');
  
  // Find related artworks from the provided list
  const relatedArtworks = allArtworks
    .filter(a => 
      a.id !== artwork.id && (
        a.artist === artwork.artist ||
        a.artType === artwork.artType ||
        a.region === artwork.region
      )
    )
    .slice(0, 3);
  
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

async function submitReport(event) {
  event.preventDefault();
  
  const reportData = {
    artwork_id: currentArtwork ? currentArtwork.id : 'unknown',
    artwork_title: currentArtwork ? currentArtwork.title : 'unknown',
    reason: document.getElementById('report-reason').value,
    details: document.getElementById('report-details').value,
    email: document.getElementById('report-email').value || ''
  };
  
  try {
    await api.submitReport(reportData);
    closeReportForm();
    showNotification(
      'success',
      'Report Submitted',
      'Thank you for your report. We will review this artwork and take appropriate action if necessary.'
    );
  } catch (error) {
    console.error('Failed to submit report:', error);
    showNotification(
      'error',
      'Submission Failed',
      error.message || 'Failed to submit report. Please try again.'
    );
  }
}

// Notification popup function
function showNotification(type, title, message) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;animation:fadeIn 0.2s ease';
  
  const popup = document.createElement('div');
  popup.style.cssText = 'background:var(--elev-1);padding:var(--space-xl);border-radius:var(--border-radius-lg);max-width:500px;width:90%;box-shadow:0 20px 50px rgba(0,0,0,0.5);animation:slideUp 0.3s ease;text-align:center';
  
  const icon = type === 'success' ? '✅' : '❌';
  const titleColor = type === 'success' ? '#8dc891' : '#e06c75';
  
  popup.innerHTML = `
    <div style="font-size:48px;margin-bottom:16px">${icon}</div>
    <h3 style="font-size:24px;font-weight:600;margin-bottom:12px;color:${titleColor}">${title}</h3>
    <p style="color:var(--muted);margin-bottom:20px">${message}</p>
    <button class="btn btn-primary" onclick="this.closest('div[style*=fixed]').remove()">OK</button>
  `;
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 5000);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;
  if (!document.querySelector('style[data-notification-styles]')) {
    style.setAttribute('data-notification-styles', 'true');
    document.head.appendChild(style);
  }
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

// ===== DATA LOADING =====

async function loadArtworkById(artworkId) {
  try {
    const artwork = await api.getArtwork(artworkId);
    
    // Convert to detail page format
    return {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist || 'Unknown Artist',
      artistInfo: artwork.artistInfo || '', // Empty string if not available
      description: artwork.intro || '',
      artType: artwork.type || 'Artwork',
      period: artwork.period || 'modern',
      region: artwork.region || '',
      sensitive: artwork.sensitive || false,
      address: artwork.address || '', // Pass through address
      coords: artwork.coords,
      location_sensitivity: artwork.sensitive ? 'general' : 'exact',
      images: artwork.artworkImages && artwork.artworkImages.length > 0
        ? artwork.artworkImages.map(img => img.name || img)
        : ['assets/img/art01.png'],
      dateAdded: artwork.submitted || artwork.date || '',
      submitter: artwork.submitter || ''
    };
  } catch (error) {
    console.error('Failed to load artwork:', error);
    throw error;
  }
}

async function loadAllArtworks() {
  try {
    const artworks = await api.getArtworks({ status: 'approved' });
    return artworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist || 'Unknown Artist',
      description: artwork.intro || '',
      artType: artwork.type || 'Artwork',
      period: artwork.period || 'modern',
      region: artwork.region || '',
      images: artwork.artworkImages && artwork.artworkImages.length > 0
        ? artwork.artworkImages.map(img => img.name || img)
        : ['assets/img/art01.png']
    }));
  } catch (error) {
    console.error('Failed to load artworks for related items:', error);
    return [];
  }
}

// ===== LIKE FUNCTIONALITY =====

let isLiked = false;

async function updateLikeButton() {
  const likeBtn = document.getElementById('like-btn');
  if (!likeBtn) return;
  
  try {
    const result = await api.checkLike(currentArtwork.id);
    isLiked = result.liked;
    
    if (isLiked) {
      likeBtn.textContent = 'Unlike 💔';
      likeBtn.classList.add('liked');
    } else {
      likeBtn.textContent = 'Like ❤';
      likeBtn.classList.remove('liked');
    }
  } catch (error) {
    console.error('Failed to check like status:', error);
  }
}

window.toggleLike = async function() {
  const sessionId = localStorage.getItem('atlas_session_id');
  
  if (!sessionId) {
    alert('Please log in to like artworks');
    return;
  }
  
  const likeBtn = document.getElementById('like-btn');
  likeBtn.disabled = true;
  
  try {
    if (isLiked) {
      await api.unlikeArtwork(currentArtwork.id);
      isLiked = false;
      likeBtn.textContent = 'Like ❤';
      likeBtn.classList.remove('liked');
    } else {
      await api.likeArtwork(currentArtwork.id);
      isLiked = true;
      likeBtn.textContent = 'Unlike 💔';
      likeBtn.classList.add('liked');
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
    alert('Failed to update like status: ' + (error.message || 'Unknown error'));
  } finally {
    likeBtn.disabled = false;
  }
};

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', async function () {
  const artworkId = getArtworkIdFromURL();
  if (!artworkId) {
    window.location.href = window.Utils.page('search.html');
    return;
  }
  
  try {
    // Load the specific artwork from backend
    currentArtwork = await loadArtworkById(artworkId);
    
    // Populate the page
    populateArtworkDetails(currentArtwork);
    
    // Update like button status
    await updateLikeButton();
    
    // Load all artworks for related items
    const allArtworks = await loadAllArtworks();
    renderRelatedArtworksFromList(currentArtwork, allArtworks);
  } catch (error) {
    document.getElementById('artwork-title').textContent = 'Artwork Not Found';
    document.getElementById('artwork-description').textContent = 'The requested artwork could not be found or failed to load from server.';
    return;
  }
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

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 16
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/

