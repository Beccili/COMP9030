<?php
/**
 * Public Profile Picture Upload Handler
 * Allows unauthenticated uploads for user registration
 * NOTE: This is for educational purposes. Production should have rate limiting.
 */

require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Check if file was uploaded
if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
    sendError('No profile image uploaded or upload error occurred');
}

$file = $_FILES['profile_image'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];
$fileType = $file['type'];

// Upload directory (relative to backend, points to frontend assets)
$uploadDir = __DIR__ . '/../../cycle2/assets/img/';

// Ensure upload directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Allowed image types
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$maxFileSize = 2 * 1024 * 1024; // 2MB for profiles (smaller than artworks)

// Validate file type
if (!in_array($fileType, $allowedTypes)) {
    sendError('Invalid image type. Allowed: JPG, PNG, GIF, WebP');
}

// Validate file size
if ($fileSize > $maxFileSize) {
    sendError('File too large. Maximum size: 2MB');
}

// Generate unique filename for profile
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$newFileName = 'profile_' . uniqid() . '_' . time() . '.' . $fileExt;
$targetPath = $uploadDir . $newFileName;

// Move uploaded file
if (move_uploaded_file($fileTmpName, $targetPath)) {
    sendResponse(true, 'Profile picture uploaded successfully', [
        'filename' => $newFileName,
        'path' => 'assets/img/' . $newFileName,
        'size' => $fileSize,
        'type' => $fileType
    ]);
} else {
    sendError('Failed to save profile picture');
}
?>
