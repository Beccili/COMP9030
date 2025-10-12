<?php
/**
 * File Upload Handler for Artwork Images
 * Handles image uploads and stores them in cycle2/assets/img
 */

require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Validate session
$sessionId = $_GET['session_id'] ?? '';
if (empty($sessionId)) {
    sendError('Authentication required');
}

$sessions = loadJsonFile(SESSIONS_FILE);
$validSession = false;
foreach ($sessions as $session) {
    if ($session['id'] === $sessionId && strtotime($session['expires_at']) >= time()) {
        $validSession = true;
        break;
    }
}

if (!$validSession) {
    sendError('Invalid or expired session');
}

// Check if files were uploaded
if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
    sendError('No images uploaded');
}

// Upload directory (relative to backend, points to frontend assets)
$uploadDir = __DIR__ . '/../../cycle2/assets/img/';

// Ensure upload directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Allowed image types
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

$uploadedFiles = [];
$errors = [];

// Handle multiple file uploads
$fileCount = count($_FILES['images']['name']);
for ($i = 0; $i < $fileCount; $i++) {
    $fileName = $_FILES['images']['name'][$i];
    $fileTmpName = $_FILES['images']['tmp_name'][$i];
    $fileSize = $_FILES['images']['size'][$i];
    $fileType = $_FILES['images']['type'][$i];
    $fileError = $_FILES['images']['error'][$i];
    
    // Check for upload errors
    if ($fileError !== UPLOAD_ERR_OK) {
        $errors[] = "Error uploading $fileName";
        continue;
    }
    
    // Validate file type
    if (!in_array($fileType, $allowedTypes)) {
        $errors[] = "$fileName is not a valid image type";
        continue;
    }
    
    // Validate file size
    if ($fileSize > $maxFileSize) {
        $errors[] = "$fileName exceeds maximum size (5MB)";
        continue;
    }
    
    // Generate unique filename
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $newFileName = 'artwork_' . uniqid() . '_' . time() . '.' . $fileExt;
    $targetPath = $uploadDir . $newFileName;
    
    // Move uploaded file
    if (move_uploaded_file($fileTmpName, $targetPath)) {
        $uploadedFiles[] = [
            'name' => $newFileName,
            'original_name' => $fileName,
            'size' => $fileSize,
            'type' => $fileType,
            'path' => 'assets/img/' . $newFileName
        ];
    } else {
        $errors[] = "Failed to move $fileName";
    }
}

// Return response
if (empty($uploadedFiles)) {
    sendError('No files were successfully uploaded: ' . implode(', ', $errors));
}

sendResponse(true, count($uploadedFiles) . ' file(s) uploaded successfully', [
    'files' => $uploadedFiles,
    'errors' => $errors
]);
?>
