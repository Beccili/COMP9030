<?php
/**
 * Admin API endpoints
 * Handles admin-only operations like user and artwork management
 */

require_once 'config.php';

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Validate admin session for all requests
$sessionId = $_GET['session_id'] ?? '';
if (empty($sessionId)) {
    sendError('Authentication required');
}

$session = validateAdminSession($sessionId);
if (!$session) {
    sendError('Admin access required');
}

switch ($method) {
    case 'GET':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'users':
                    getUsers();
                    break;
                case 'pending_artworks':
                    getPendingArtworks();
                    break;
                case 'stats':
                    getStats();
                    break;
                default:
                    sendError('Invalid action');
            }
        } else {
            sendError('Action required');
        }
        break;
    
    case 'POST':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'approve_user':
                    approveUser($input);
                    break;
                case 'approve_artwork':
                    approveArtwork($input);
                    break;
                case 'reject_artwork':
                    rejectArtwork($input);
                    break;
                case 'update_user':
                    updateUser($input);
                    break;
                case 'set_user_status':
                    setUserStatus($input);
                    break;
                default:
                    sendError('Invalid action');
            }
        } else {
            sendError('Action required');
        }
        break;
    
    default:
        sendError('Method not allowed', 405);
}

function getUsers() {
    $users = loadJsonFile(USERS_FILE);
    
    // Remove passwords from response
    $users = array_map(function($user) {
        unset($user['password']);
        return $user;
    }, $users);
    
    sendResponse(true, 'Users retrieved', $users);
}

function getPendingArtworks() {
    $artworks = loadJsonFile(ARTWORKS_FILE);
    
    // Filter pending artworks
    $pendingArtworks = array_filter($artworks, function($artwork) {
        return $artwork['status'] === 'pending';
    });
    
    sendResponse(true, 'Pending artworks retrieved', array_values($pendingArtworks));
}

function getStats() {
    $users = loadJsonFile(USERS_FILE);
    $artworks = loadJsonFile(ARTWORKS_FILE);
    
    $stats = [
        'total_users' => count($users),
        'pending_users' => count(array_filter($users, function($u) { return $u['status'] === 'pending'; })),
        'approved_users' => count(array_filter($users, function($u) { return $u['status'] === 'approved'; })),
        'total_artworks' => count($artworks),
        'pending_artworks' => count(array_filter($artworks, function($a) { return $a['status'] === 'pending'; })),
        'approved_artworks' => count(array_filter($artworks, function($a) { return $a['status'] === 'approved'; })),
        'rejected_artworks' => count(array_filter($artworks, function($a) { return $a['status'] === 'rejected'; }))
    ];
    
    sendResponse(true, 'Statistics retrieved', $stats);
}

function approveUser($input) {
    if (!isset($input['user_id'])) {
        sendError('User ID required');
    }
    
    $users = loadJsonFile(USERS_FILE);
    
    for ($i = 0; $i < count($users); $i++) {
        if ($users[$i]['id'] === $input['user_id']) {
            $users[$i]['status'] = 'approved';
            $users[$i]['approved_at'] = date('Y-m-d H:i:s');
            saveJsonFile(USERS_FILE, $users);
            
            unset($users[$i]['password']);
            sendResponse(true, 'User approved successfully', $users[$i]);
        }
    }
    
    sendError('User not found', 404);
}

function approveArtwork($input) {
    if (!isset($input['artwork_id'])) {
        sendError('Artwork ID required');
    }
    
    $artworks = loadJsonFile(ARTWORKS_FILE);
    
    for ($i = 0; $i < count($artworks); $i++) {
        if ($artworks[$i]['id'] === $input['artwork_id']) {
            $artworks[$i]['status'] = 'approved';
            $artworks[$i]['approved_at'] = date('Y-m-d H:i:s');
            saveJsonFile(ARTWORKS_FILE, $artworks);
            
            sendResponse(true, 'Artwork approved successfully', $artworks[$i]);
        }
    }
    
    sendError('Artwork not found', 404);
}

function rejectArtwork($input) {
    if (!isset($input['artwork_id'])) {
        sendError('Artwork ID required');
    }
    
    $reason = $input['reason'] ?? 'No reason provided';
    
    $artworks = loadJsonFile(ARTWORKS_FILE);
    
    for ($i = 0; $i < count($artworks); $i++) {
        if ($artworks[$i]['id'] === $input['artwork_id']) {
            $artworks[$i]['status'] = 'rejected';
            $artworks[$i]['rejected_at'] = date('Y-m-d H:i:s');
            $artworks[$i]['rejection_reason'] = $reason;
            saveJsonFile(ARTWORKS_FILE, $artworks);
            
            sendResponse(true, 'Artwork rejected successfully', $artworks[$i]);
        }
    }
    
    sendError('Artwork not found', 404);
}

function updateUser($input) {
    if (!isset($input['user_id'])) {
        sendError('User ID required');
    }
    
    $users = loadJsonFile(USERS_FILE);
    
    for ($i = 0; $i < count($users); $i++) {
        if ($users[$i]['id'] === $input['user_id']) {
            // Update allowed fields
            $allowedFields = ['name', 'email', 'role', 'region', 'nation', 'bio', 'imageUrl', 'phone', 'dob', 'gender'];
            
            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    $users[$i][$field] = $input[$field];
                }
            }
            
            $users[$i]['updated_at'] = date('Y-m-d H:i:s');
            saveJsonFile(USERS_FILE, $users);
            
            unset($users[$i]['password']);
            sendResponse(true, 'User updated successfully', $users[$i]);
        }
    }
    
    sendError('User not found', 404);
}

function setUserStatus($input) {
    if (!isset($input['user_id'])) {
        sendError('User ID required');
    }
    
    if (!isset($input['status'])) {
        sendError('Status required');
    }
    
    $validStatuses = ['approved', 'pending', 'inactive'];
    if (!in_array($input['status'], $validStatuses)) {
        sendError('Invalid status. Must be one of: approved, pending, inactive');
    }
    
    $users = loadJsonFile(USERS_FILE);
    
    for ($i = 0; $i < count($users); $i++) {
        if ($users[$i]['id'] === $input['user_id']) {
            $users[$i]['status'] = $input['status'];
            $users[$i]['status_updated_at'] = date('Y-m-d H:i:s');
            saveJsonFile(USERS_FILE, $users);
            
            unset($users[$i]['password']);
            sendResponse(true, 'User status updated successfully', $users[$i]);
        }
    }
    
    sendError('User not found', 404);
}

function validateAdminSession($sessionId) {
    $sessions = loadJsonFile(SESSIONS_FILE);
    
    foreach ($sessions as $session) {
        if ($session['id'] === $sessionId) {
            // Check if session expired
            if (strtotime($session['expires_at']) < time()) {
                return false;
            }
            
            // Check if user is admin
            if ($session['role'] !== 'admin') {
                return false;
            }
            
            return $session;
        }
    }
    
    return false;
}
?>
