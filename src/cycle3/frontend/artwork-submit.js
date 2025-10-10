/* artwork-submit.js — Submit artworks via backend API
 * Replaces the previous localStorage-only logic.
 * All comments are in English.
 */

import { artworksApi, session } from "./api.js";

const form = document.getElementById('artwork-form');
const note = document.getElementById('submit-note');
const sensitiveSel = document.getElementById('sensitive');
const addressInput = document.getElementById('address');
const addressNote = document.getElementById('address-note');
const artworkImagesInput = document.getElementById('artworkImages');

function updateAddressState() {
  const isSensitive = sensitiveSel.value === 'true';
  addressInput.disabled = isSensitive;
  addressNote.style.display = isSensitive ? 'block' : 'none';
  if (isSensitive) addressInput.value = '';
}
sensitiveSel.addEventListener('change', updateAddressState);
document.addEventListener('DOMContentLoaded', updateAddressState);

function setValidity(el, ok, msg){
  el.setCustomValidity(ok ? '' : msg);
  if (!ok) el.reportValidity();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sid = session.get();
  if (!sid) { note.style.display='block'; note.textContent='Please log in first.'; return; }

  const title = document.getElementById('title').value.trim();
  const artist = document.getElementById('artist').value.trim();
  const artType = document.getElementById('artType').value;
  const period = document.getElementById('period').value;
  const region = document.getElementById('region').value;
  const sensitive = sensitiveSel.value === 'true';
  const address = addressInput.value.trim();
  const desc = document.getElementById('desc').value.trim();
  const artworkImages = artworkImagesInput.files;

  if (!title){ setValidity(document.getElementById('title'), false, 'Please enter the title.'); return; }
  if (!artist){ setValidity(document.getElementById('artist'), false, 'Please enter the artist.'); return; }
  if (!artworkImages || artworkImages.length === 0){
    setValidity(artworkImagesInput, false, 'Please select at least one artwork image.');
    return;
  }
  setValidity(document.getElementById('title'), true, '');
  setValidity(document.getElementById('artist'), true, '');
  setValidity(artworkImagesInput, true, '');

  if (sensitive && address){
    setValidity(addressInput, false, 'Address cannot be provided when sensitive is true.');
    return;
  } else {
    setValidity(addressInput, true, '');
  }

  // NOTE: Real file upload is not implemented in the backend right now.
  // We submit textual fields only, as per README/test.html.
  const payload = {
    title, artist, artType, period, region,
    description: desc,
    sensitive,
    address: address || null
  };

  try {
    await artworksApi.create(sid, payload);
    note.style.display = 'block';
    note.textContent = 'Submitted! Your artwork is pending admin review.';
    form.reset();
    updateAddressState();
  } catch (err) {
    note.style.display = 'block';
    note.textContent = 'Submission failed: ' + (err.message || 'Unknown error');
  }
});
