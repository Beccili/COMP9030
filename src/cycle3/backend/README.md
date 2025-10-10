# Indigenous Art Atlas Backend

A simple PHP backend for the Indigenous Art Atlas project, implementing basic CRUD operations with JSON file storage.

## Features

- User authentication (login/logout/register)
- Admin authentication and management
- Artwork submission and management
- Simple JSON file-based data persistence
- RESTful API endpoints
- Basic error handling and input sanitization

## Setup

1. Place the `backend` folder in your web server directory
2. Ensure PHP is installed and configured
3. Make sure the web server has write permissions to the `backend/data/` directory
4. Access `test.html` to test the API endpoints

## API Endpoints

### Authentication (`auth.php`)

- `POST /auth?action=login` - User login
- `POST /auth?action=logout` - User logout
- `POST /auth?action=register` - User registration
- `GET /auth?action=verify` - Verify session

### Artworks (`artworks.php`)

- `GET /artworks` - Get all approved artworks (with optional filters)
- `GET /artworks?id={id}` - Get specific artwork
- `POST /artworks` - Submit new artwork (requires authentication)
- `PUT /artworks?id={id}` - Update artwork (admin or owner)
- `DELETE /artworks?id={id}` - Delete artwork (admin only)

### Admin (`admin.php`)

- `GET /admin?action=users` - Get all users (admin only)
- `GET /admin?action=pending_artworks` - Get pending artworks (admin only)
- `GET /admin?action=stats` - Get system statistics (admin only)
- `POST /admin?action=approve_user` - Approve user account (admin only)
- `POST /admin?action=approve_artwork` - Approve artwork (admin only)
- `POST /admin?action=reject_artwork` - Reject artwork (admin only)

## Default Test Accounts

### Regular User

- Username: `testuser`
- Password: `password123`

### Administrator

- Username: `admin`
- Password: `admin123`

## Data Storage

Data is stored in JSON files in the `data/` directory:

- `users.json` - User accounts
- `artworks.json` - Artwork submissions
- `sessions.json` - Active user sessions

## Usage Example

```javascript
// Login
const loginResponse = await fetch("auth.php?action=login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "testuser",
    password: "password123",
  }),
});

const loginData = await loginResponse.json();
const sessionId = loginData.data.session_id;

// Submit artwork
const artworkResponse = await fetch(`artworks.php?session_id=${sessionId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "My Artwork",
    artist: "Artist Name",
    artType: "Painting",
    period: "Contemporary",
    region: "NSW",
    description: "A beautiful artwork",
  }),
});
```

## Security Notes

This is a minimal implementation for educational purposes. In a production environment, you would need:

- HTTPS encryption
- More robust session management
- File upload handling for images
- Input validation and sanitization
- Rate limiting
- Proper database instead of JSON files
- Environment-based configuration

## Testing

Open `test.html` in your browser to test all API endpoints interactively.
