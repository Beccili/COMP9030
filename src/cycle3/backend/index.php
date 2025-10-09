<?php
/**
 * Main API router for Indigenous Art Atlas Backend
 * Routes requests to appropriate endpoints
 */

require_once 'config.php';

// Get the request path
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Remove 'backend' from path if present
if (in_array('backend', $pathParts)) {
    $backendIndex = array_search('backend', $pathParts);
    $pathParts = array_slice($pathParts, $backendIndex + 1);
}

// Route to appropriate endpoint
if (empty($pathParts) || $pathParts[0] === '' || $pathParts[0] === 'index.php') {
    // API documentation/status
    sendResponse(true, 'Indigenous Art Atlas API v1.0', [
        'endpoints' => [
            '/auth' => 'Authentication (login, logout, register)',
            '/artworks' => 'Artwork management (CRUD)',
            '/admin' => 'Admin operations (user/artwork approval)',
        ],
        'version' => '1.0',
        'status' => 'active'
    ]);
} else {
    $endpoint = $pathParts[0];
    
    switch ($endpoint) {
        case 'auth':
            require_once 'auth.php';
            break;
        
        case 'artworks':
            require_once 'artworks.php';
            break;
        
        case 'admin':
            require_once 'admin.php';
            break;
        
        default:
            sendError('Endpoint not found', 404);
    }
}
?>
