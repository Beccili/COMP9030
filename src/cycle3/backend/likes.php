<?php
/**
 * Likes API endpoints
 * Handles artwork likes/unlikes
 */

require_once 'config.php';

// Define likes file
define('LIKES_FILE', __DIR__ . '/data/likes.json');

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        getLikes();
        break;
    
    case 'POST':
        addLike($input);
        break;
    
    case 'DELETE':
        removeLike();
        break;
    
    default:
        sendError('Method not allowed', 405);
}

/**
 * Get likes for a user or check if user liked specific artwork
 */
function getLikes() {
    $sessionId = $_GET['session_id'] ?? '';
    
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    $session = validateSession($sessionId);
    if (!$session) {
        sendError('Invalid session');
    }
    
    $likes = loadJsonFile(LIKES_FILE);
    $userId = $session['user_id'];
    
    // Check if checking for specific artwork
    if (isset($_GET['artwork_id'])) {
        $artworkId = $_GET['artwork_id'];
        $liked = false;
        
        foreach ($likes as $like) {
            if ($like['user_id'] === $userId && $like['artwork_id'] === $artworkId) {
                $liked = true;
                break;
            }
        }
        
        sendResponse(true, 'Like status retrieved', ['liked' => $liked]);
    } else {
        // Get all likes for user
        $userLikes = array_filter($likes, function($like) use ($userId) {
            return $like['user_id'] === $userId;
        });
        
        sendResponse(true, 'User likes retrieved', array_values($userLikes));
    }
}

/**
 * Add a like
 */
function addLike($input) {
    $sessionId = $_GET['session_id'] ?? '';
    
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    $session = validateSession($sessionId);
    if (!$session) {
        sendError('Invalid session');
    }
    
    if (!isset($input['artwork_id']) || empty($input['artwork_id'])) {
        sendError('Artwork ID required');
    }
    
    $likes = loadJsonFile(LIKES_FILE);
    $userId = $session['user_id'];
    $artworkId = $input['artwork_id'];
    
    // Check if already liked
    foreach ($likes as $like) {
        if ($like['user_id'] === $userId && $like['artwork_id'] === $artworkId) {
            sendResponse(true, 'Already liked', ['liked' => true]);
            return;
        }
    }
    
    // Add new like
    $newLike = [
        'id' => generateId('like'),
        'user_id' => $userId,
        'artwork_id' => $artworkId,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $likes[] = $newLike;
    saveJsonFile(LIKES_FILE, $likes);
    
    sendResponse(true, 'Artwork liked successfully', ['liked' => true]);
}

/**
 * Remove a like
 */
function removeLike() {
    $sessionId = $_GET['session_id'] ?? '';
    $artworkId = $_GET['artwork_id'] ?? '';
    
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    if (empty($artworkId)) {
        sendError('Artwork ID required');
    }
    
    $session = validateSession($sessionId);
    if (!$session) {
        sendError('Invalid session');
    }
    
    $likes = loadJsonFile(LIKES_FILE);
    $userId = $session['user_id'];
    
    // Remove the like
    $likes = array_filter($likes, function($like) use ($userId, $artworkId) {
        return !($like['user_id'] === $userId && $like['artwork_id'] === $artworkId);
    });
    
    saveJsonFile(LIKES_FILE, array_values($likes));
    
    sendResponse(true, 'Like removed successfully', ['liked' => false]);
}

/**
 * Validate session
 */
function validateSession($sessionId) {
    $sessions = loadJsonFile(SESSIONS_FILE);
    
    foreach ($sessions as $session) {
        if ($session['id'] === $sessionId) {
            if (strtotime($session['expires_at']) < time()) {
                return false;
            }
            return $session;
        }
    }
    
    return false;
}
?>
