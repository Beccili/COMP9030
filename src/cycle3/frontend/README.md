# Indigenous Art Atlas - Frontend Integration

This directory contains the updated frontend files that connect to the backend API for the Indigenous Art Atlas project.

## Files Overview

### Core Pages

- `search.html` - Main search page with filtering and sorting capabilities
- `search.js` - JavaScript for search functionality, connects to backend API
- `detail.html` - Artwork detail page with image carousel and related artworks
- `detail.js` - JavaScript for detail page functionality, connects to backend API
- `test.html` - Test page to verify backend integration

## Features Implemented

### 1. Backend Integration

- All artwork data is now stored in the backend (`../backend/data/artworks.json`)
- Frontend fetches data via REST API calls to `../backend/artworks.php`
- Real-time data loading with loading indicators and error handling

### 2. Search Functionality

- **Keyword Search**: Search by title, artist name, or description
- **Filter by Art Type**: Portrait, Painting, Installation, etc.
- **Filter by Period**: Ancient, Contemporary
- **Filter by Region**: NSW, VIC, QLD, SA, WA, NT, TAS, ACT
- **Real-time filtering**: Results update as you type (with debouncing)

### 3. Sorting Functionality

- **Primary Sort Options**:
  - Newest (by submission date)
  - Title A-Z
  - Artist A-Z
  - Relevance (newest first for now)
- **Secondary Sort Options**:
  - Artist A-Z
  - Region
  - Date Added
- **Combined Sorting**: Primary sort with fallback to secondary sort

### 4. Detail Page Features

- **Dynamic Content Loading**: Fetches artwork details from backend
- **Image Carousel**: Displays multiple images with navigation
- **Related Artworks**: Shows artworks by same artist, type, or region
- **Cultural Context**: Displays cultural information when available
- **Responsive Design**: Works on desktop and mobile devices

### 5. Error Handling

- Loading indicators during API calls
- Error messages for failed requests
- Graceful fallbacks for missing data
- User-friendly error messages

## API Endpoints Used

### GET /artworks.php

- **Purpose**: Fetch all approved artworks
- **Parameters**:
  - `search` (optional): Search term for title/artist/description
  - `artType` (optional): Filter by art type
  - `region` (optional): Filter by region
  - `period` (optional): Filter by period
- **Response**: JSON array of artwork objects

### GET /artworks.php?id={id}

- **Purpose**: Fetch specific artwork by ID
- **Parameters**: `id` (required): Artwork ID
- **Response**: Single artwork object

## Data Structure

Artworks are stored with the following structure:

```json
{
  "id": "unique-artwork-id",
  "title": "Artwork Title",
  "description": "Detailed description...",
  "artist": "Artist Name",
  "artType": "Portrait|Painting|Installation|...",
  "period": "Ancient|Contemporary",
  "region": "NSW|VIC|QLD|SA|WA|NT|TAS|ACT",
  "sensitive": false,
  "address": null,
  "status": "approved|pending|rejected",
  "submitted_by": "user-id",
  "submitted_at": "2025-09-10 10:00:00",
  "reviewed_at": "2025-09-10 11:00:00",
  "reviewed_by": "admin-user-id",
  "images": ["assets/img/art01.png", "assets/img/art02.png"],
  "coords": { "lat": -26.9, "lng": 133.1 },
  "location_sensitivity": "general|exact|region",
  "dateAdded": "2025-09-10",
  "submitter": "submission-source",
  "culturalContext": "Cultural significance information..."
}
```

## Usage Instructions

### 1. Setup

1. Ensure the backend is running (PHP server with `../backend/` directory)
2. Place these frontend files in `src/cycle3/frontend/`
3. Open `test.html` in a browser to verify backend connection

### 2. Search Page

1. Open `search.html` in a browser
2. Use the search input to find artworks by keywords
3. Use dropdown filters to narrow results by type, period, or region
4. Use sort options to organize results
5. Click on any artwork card to view details

### 3. Detail Page

1. Navigate from search results or use direct URL: `detail.html?id=artwork-id`
2. View high-resolution images with carousel navigation
3. Read detailed artwork information and cultural context
4. Explore related artworks at the bottom of the page
5. Use action buttons to share or report artworks

### 4. Testing

1. Open `test.html` to verify all functionality
2. Test backend connection, data fetching, and search capabilities
3. Use navigation buttons to test page transitions

## Technical Notes

### Path Handling

- Frontend files use relative paths to access backend API (`../backend/`)
- Image paths are adjusted to work from the frontend directory
- CSS and assets reference the original cycle2 directory

### Browser Compatibility

- Uses modern JavaScript features (async/await, fetch API)
- Graceful degradation for older browsers
- Responsive design works on all screen sizes

### Performance

- Debounced search input (300ms delay)
- Lazy loading for images
- Efficient filtering and sorting algorithms
- Only approved artworks are displayed to users

## Future Enhancements

1. **Advanced Search**: Implement relevance scoring for search results
2. **Pagination**: Add pagination for large result sets
3. **Caching**: Implement client-side caching for better performance
4. **Offline Support**: Add service worker for offline functionality
5. **Accessibility**: Enhanced ARIA labels and keyboard navigation
