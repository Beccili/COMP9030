<?php
/**
 * Reports API endpoints
 * Handles artwork reports and cultural safety flags
 */

require_once 'config.php';

// Data file for reports
define('REPORTS_FILE', DATA_DIR . 'reports.json');

// Initialize reports file if it doesn't exist
if (!file_exists(REPORTS_FILE)) {
    file_put_contents(REPORTS_FILE, json_encode([], JSON_PRETTY_PRINT));
}

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        getReports();
        break;
    
    case 'POST':
        createReport($input);
        break;
    
    case 'PUT':
        if (isset($_GET['id'])) {
            updateReport($_GET['id'], $input);
        } else {
            sendError('Report ID required for update');
        }
        break;
    
    default:
        sendError('Method not allowed', 405);
}

function getReports() {
    // Admin-only endpoint
    $sessionId = $_GET['session_id'] ?? '';
    if (!empty($sessionId)) {
        $session = validateAdminSession($sessionId);
        if (!$session) {
            sendError('Admin access required');
        }
    }
    
    $reports = loadJsonFile(REPORTS_FILE);
    
    // Filter by status if provided
    $status = $_GET['status'] ?? '';
    if (!empty($status) && $status !== 'all') {
        $reports = array_filter($reports, function($report) use ($status) {
            return $report['status'] === $status;
        });
    }
    
    sendResponse(true, 'Reports retrieved', array_values($reports));
}

function createReport($input) {
    // Public endpoint - anyone can submit a report
    
    // Validate required fields
    if (!isset($input['artwork_id']) || empty($input['artwork_id'])) {
        sendError('Artwork ID is required');
    }
    
    if (!isset($input['reason']) || empty(trim($input['reason']))) {
        sendError('Reason is required');
    }
    
    // Create new report
    $report = [
        'id' => generateId('r'),
        'artwork' => $input['artwork_id'],
        'artwork_title' => $input['artwork_title'] ?? '',
        'reason' => trim($input['reason']),
        'detail' => trim($input['details'] ?? ''),
        'email' => trim($input['email'] ?? ''),
        'created' => date('Y-m-d H:i:s'),
        'status' => 'open'
    ];
    
    $reports = loadJsonFile(REPORTS_FILE);
    $reports[] = $report;
    saveJsonFile(REPORTS_FILE, $reports);
    
    sendResponse(true, 'Report submitted successfully', $report);
}

function updateReport($id, $input) {
    // Admin-only endpoint
    $sessionId = $_GET['session_id'] ?? '';
    if (empty($sessionId)) {
        sendError('Authentication required');
    }
    
    $session = validateAdminSession($sessionId);
    if (!$session) {
        sendError('Admin access required');
    }
    
    $reports = loadJsonFile(REPORTS_FILE);
    $reportIndex = -1;
    
    for ($i = 0; $i < count($reports); $i++) {
        if ($reports[$i]['id'] === $id) {
            $reportIndex = $i;
            break;
        }
    }
    
    if ($reportIndex === -1) {
        sendError('Report not found', 404);
    }
    
    $report = $reports[$reportIndex];
    
    // Update status and decision
    if (isset($input['status'])) {
        $report['status'] = $input['status'];
        $report['reviewed_at'] = date('Y-m-d H:i:s');
        $report['reviewed_by'] = $session['user_id'];
    }
    
    if (isset($input['decision'])) {
        $report['decision'] = $input['decision'];
    }
    
    if (isset($input['note'])) {
        $report['note'] = $input['note'];
    }
    
    $reports[$reportIndex] = $report;
    saveJsonFile(REPORTS_FILE, $reports);
    
    sendResponse(true, 'Report updated successfully', $report);
}

function validateAdminSession($sessionId) {
    $sessions = loadJsonFile(SESSIONS_FILE);
    
    foreach ($sessions as $session) {
        if ($session['id'] === $sessionId) {
            if (strtotime($session['expires_at']) < time()) {
                return false;
            }
            if ($session['role'] !== 'admin') {
                return false;
            }
            return $session;
        }
    }
    
    return false;
}
?>
<!-- 
#-# START COMMENT BLOCK #-#
AI Tool used: Claude Sonnet (Anthropic) via Cursor
AI-Acknowledgement.md line: 371
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
-->
