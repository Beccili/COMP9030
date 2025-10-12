<?php
/**
 * Artworks API endpoints
 * Handles CRUD operations for artworks
 */

require_once 'config.php';

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getArtwork($_GET['id']);
        } else {
            getArtworks();
        }
        break;
    
    case 'POST':
        createArtwork($input);
        break;
    
    case 'PUT':
        if (isset($_GET['id'])) {
            updateArtwork($_GET['id'], $input);
        } else {
            sendError('Artwork ID required for update');
        }
        break;
    
    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteArtwork($_GET['id']);
        } else {
            sendError('Artwork ID required for deletion');
        }
        break;
    
    default:
        sendError('Method not allowed', 405);
}

function getArtworks() {
    $artworks = loadJsonFile(ARTWORKS_FILE);
    
    // Filter parameters
    $search = $_GET['search'] ?? '';
    $artType = $_GET['artType'] ?? '';
    $region = $_GET['region'] ?? '';
    $period = $_GET['period'] ?? '';
    // Only filter by status if not explicitly requesting all (empty string means all)
    $status = isset($_GET['status']) ? $_GET['status'] : 'approved'; // Default to approved only
    
    // Apply filters
    if (!empty($search)) {
        $artworks = array_filter($artworks, function($artwork) use ($search) {
            $searchLower = strtolower($search);
            return strpos(strtolower($artwork['title']), $searchLower) !== false ||
                   strpos(strtolower($artwork['artist']), $searchLower) !== false ||
                   strpos(strtolower($artwork['description'] ?? ''), $searchLower) !== false;
        });
    }
    
    if (!empty($artType)) {
        $artworks = array_filter($artworks, function($artwork) use ($artType) {
            return $artwork['artType'] === $artType;
        });
    }
    
    if (!empty($region)) {
        $artworks = array_filter($artworks, function($artwork) use ($region) {
            return $artwork['region'] === $region;
        });
    }
    
    if (!empty($period)) {
        $artworks = array_filter($artworks, function($artwork) use ($period) {
            return $artwork['period'] === $period;
        });
    }
    
    // Filter by status unless 'all' is requested
    if (!empty($status) && $status !== 'all') {
        $artworks = array_filter($artworks, function($artwork) use ($status) {
            return $artwork['status'] === $status;
        });
    }
    
    sendResponse(true, 'Artworks retrieved', array_values($artworks));
}

function getArtwork($id) {
    $artworks = loadJsonFile(ARTWORKS_FILE);
    $users = loadJsonFile(USERS_FILE);
    
    foreach ($artworks as $artwork) {
        if ($artwork['id'] === $id) {
            // Enrich with artist information
            $artwork = enrichArtworkWithArtistInfo($artwork, $users);
            sendResponse(true, 'Artwork found', $artwork);
        }
    }
    
    sendError('Artwork not found', 404);
}

function enrichArtworkWithArtistInfo($artwork, $users) {
    // Find the artist/submitter user
    $submitterId = $artwork['submitted_by'] ?? '';
    $artistInfo = '';
    
    if ($submitterId) {
        foreach ($users as $user) {
            if ($user['id'] === $submitterId) {
                $artistInfo = $user['bio'] ?? '';
                break;
            }
        }
    }
    
    // Add artistInfo to artwork
    $artwork['artistInfo'] = $artistInfo;
    return $artwork;
}

function createArtwork($input) {
    // Validate session (only approved artists can submit)
    $sessionId = $_GET['session_id'] ?? '';
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    $session = validateSession($sessionId);
    if (!$session) {
        sendError('Invalid session');
    }
    
    // Get user info
    $users = loadJsonFile(USERS_FILE);
    $user = null;
    foreach ($users as $u) {
        if ($u['id'] === $session['user_id']) {
            $user = $u;
            break;
        }
    }
    
    if (!$user || ($user['role'] !== 'artist' && $user['role'] !== 'admin')) {
        sendError('Only approved artists can submit artworks');
    }
    
    if ($user['status'] !== 'approved') {
        sendError('Account must be approved to submit artworks');
    }
    
    // Validate required fields
    $required = ['title', 'artist', 'artType', 'period', 'region'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            sendError("Field '$field' is required");
        }
    }
    
    // Validate sensitive field
    $sensitive = isset($input['sensitive']) ? (bool)$input['sensitive'] : false;
    if ($sensitive && !empty($input['address'])) {
        sendError('Address cannot be provided when artwork is marked as sensitive');
    }
    
    // Validate and extract coordinates
    $coords = null;
    if (!$sensitive && isset($input['coords']) && is_array($input['coords'])) {
        $lat = floatval($input['coords']['lat'] ?? null);
        $lng = floatval($input['coords']['lng'] ?? null);
        if ($lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180 && $lat != 0 && $lng != 0) {
            $coords = ['lat' => $lat, 'lng' => $lng];
        }
    }
    
    if ($sensitive && isset($input['coords']) && !empty($input['coords'])) {
        sendError('Coordinates cannot be provided when artwork is marked as sensitive');
    }
    
    // Create new artwork
    $artwork = [
        'id' => generateId('art'),
        'title' => trim($input['title']),
        'artist' => trim($input['artist']),
        'artType' => $input['artType'],
        'period' => $input['period'],
        'region' => $input['region'],
        'sensitive' => $sensitive,
        'address' => $sensitive ? null : (trim($input['address'] ?? '') ?: null),
        'coords' => $coords,
        'description' => trim($input['description'] ?? ''),
        'status' => 'pending', // Requires admin approval
        'submitted_by' => $user['id'],
        'submitted_at' => date('Y-m-d H:i:s'),
        'images' => [] // In a real app, would handle file uploads
    ];
    
    // Handle image files (simplified - in real app would process uploads)
    if (isset($input['images']) && is_array($input['images'])) {
        $artwork['images'] = $input['images'];
    }
    
    $artworks = loadJsonFile(ARTWORKS_FILE);
    $artworks[] = $artwork;
    saveJsonFile(ARTWORKS_FILE, $artworks);
    
    sendResponse(true, 'Artwork submitted successfully. Pending admin approval.', $artwork);
}

function updateArtwork($id, $input) {
    // Validate session (admin only for approval, or original submitter)
    $sessionId = $_GET['session_id'] ?? '';
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    $session = validateSession($sessionId);
    if (!$session) {
        sendError('Invalid session');
    }
    
    $artworks = loadJsonFile(ARTWORKS_FILE);
    $artworkIndex = -1;
    
    for ($i = 0; $i < count($artworks); $i++) {
        if ($artworks[$i]['id'] === $id) {
            $artworkIndex = $i;
            break;
        }
    }
    
    if ($artworkIndex === -1) {
        sendError('Artwork not found', 404);
    }
    
    $artwork = $artworks[$artworkIndex];
    
    // Check permissions
    $users = loadJsonFile(USERS_FILE);
    $user = null;
    foreach ($users as $u) {
        if ($u['id'] === $session['user_id']) {
            $user = $u;
            break;
        }
    }
    
    $isAdmin = $user && $user['role'] === 'admin';
    $isOwner = $user && $artwork['submitted_by'] === $user['id'];
    
    if (!$isAdmin && !$isOwner) {
        sendError('Permission denied');
    }
    
    // When owner edits (not admin), reset status to pending for re-review
    if ($isOwner && !$isAdmin) {
        $artwork['status'] = 'pending';
        $artwork['updated_at'] = date('Y-m-d H:i:s');
        // Clear review metadata since it needs re-review
        unset($artwork['reviewed_at']);
        unset($artwork['reviewed_by']);
    }
    
    // Update artwork status (admin only)
    if (isset($input['status']) && $isAdmin) {
        $artwork['status'] = $input['status'];
        $artwork['reviewed_at'] = date('Y-m-d H:i:s');
        $artwork['reviewed_by'] = $user['id'];
    }
    
    // Allow updating other fields if owner or admin
    $updateableFields = ['title', 'artist', 'artType', 'period', 'region', 'sensitive', 'address', 'description'];
    foreach ($updateableFields as $field) {
        if (isset($input[$field])) {
            $artwork[$field] = $input[$field];
        }
    }
    
    // Handle coordinates update
    if (isset($input['coords'])) {
        if ($artwork['sensitive']) {
            $artwork['coords'] = null;
        } elseif (is_array($input['coords'])) {
            $lat = floatval($input['coords']['lat'] ?? null);
            $lng = floatval($input['coords']['lng'] ?? null);
            if ($lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180 && $lat != 0 && $lng != 0) {
                $artwork['coords'] = ['lat' => $lat, 'lng' => $lng];
            }
        }
    }
    
    // Clear coords if artwork becomes sensitive
    if (isset($input['sensitive']) && $input['sensitive']) {
        $artwork['coords'] = null;
    }
    
    $artworks[$artworkIndex] = $artwork;
    saveJsonFile(ARTWORKS_FILE, $artworks);
    
    sendResponse(true, 'Artwork updated successfully', $artwork);
}

function deleteArtwork($id) {
    // Validate session
    $sessionId = $_GET['session_id'] ?? '';
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    $session = validateSession($sessionId);
    if (!$session) {
        sendError('Invalid session');
    }
    
    $users = loadJsonFile(USERS_FILE);
    $user = null;
    foreach ($users as $u) {
        if ($u['id'] === $session['user_id']) {
            $user = $u;
            break;
        }
    }
    
    $artworks = loadJsonFile(ARTWORKS_FILE);
    $artworkToDelete = null;
    foreach ($artworks as $artwork) {
        if ($artwork['id'] === $id) {
            $artworkToDelete = $artwork;
            break;
        }
    }
    
    if (!$artworkToDelete) {
        sendError('Artwork not found', 404);
    }
    
    $isAdmin = $user && $user['role'] === 'admin';
    $isOwner = $user && $artworkToDelete['submitted_by'] === $user['id'];
    
    // Admin can delete anything, owners can delete their own artworks
    if (!$isAdmin && !$isOwner) {
        sendError('Permission denied');
    }
    
    $artworks = array_filter($artworks, function($artwork) use ($id) {
        return $artwork['id'] !== $id;
    });
    
    saveJsonFile(ARTWORKS_FILE, array_values($artworks));
    sendResponse(true, 'Artwork deleted successfully');
}

function validateSession($sessionId) {
    $sessions = loadJsonFile(SESSIONS_FILE);
    
    foreach ($sessions as $session) {
        if ($session['id'] === $sessionId) {
            // Check if session expired
            if (strtotime($session['expires_at']) < time()) {
                return false;
            }
            return $session;
        }
    }
    
    return false;
}
?>
