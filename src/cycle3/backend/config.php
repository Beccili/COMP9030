<?php
/**
 * Configuration file for Indigenous Art Atlas Backend
 * Simple PHP backend with JSON file storage
 */

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON for API responses
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Data directory
define('DATA_DIR', __DIR__ . '/data/');

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Data files
define('USERS_FILE', DATA_DIR . 'users.json');
define('ARTWORKS_FILE', DATA_DIR . 'artworks.json');
define('SESSIONS_FILE', DATA_DIR . 'sessions.json');

// Initialize data files if they don't exist
function initializeDataFiles() {
    // Initialize users with test accounts
    if (!file_exists(USERS_FILE)) {
        $defaultUsers = [
            [
                'id' => 'u_testuser',
                'username' => 'testuser',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'email' => 'test@example.com',
                'name' => 'Test User',
                'role' => 'user',
                'status' => 'approved',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'u_admin',
                'username' => 'admin',
                'password' => password_hash('admin123', PASSWORD_DEFAULT),
                'email' => 'admin@example.com',
                'name' => 'System Administrator',
                'role' => 'admin',
                'status' => 'approved',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];
        file_put_contents(USERS_FILE, json_encode($defaultUsers, JSON_PRETTY_PRINT));
    }
    
    // Initialize empty artworks file
    if (!file_exists(ARTWORKS_FILE)) {
        file_put_contents(ARTWORKS_FILE, json_encode([], JSON_PRETTY_PRINT));
    }
    
    // Initialize empty sessions file
    if (!file_exists(SESSIONS_FILE)) {
        file_put_contents(SESSIONS_FILE, json_encode([], JSON_PRETTY_PRINT));
    }
}

// Utility functions
function loadJsonFile($filename) {
    if (!file_exists($filename)) {
        return [];
    }
    $content = file_get_contents($filename);
    return json_decode($content, true) ?: [];
}

function saveJsonFile($filename, $data) {
    return file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT)) !== false;
}

function generateId($prefix = 'id') {
    return $prefix . '_' . uniqid() . '_' . time();
}

function sendResponse($success, $message = '', $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit();
}

function sendError($message, $code = 400) {
    http_response_code($code);
    sendResponse(false, $message);
}

// Initialize data files
initializeDataFiles();
?>
