<?php
/**
 * Authentication API endpoints
 * Handles user login, logout, and session management
 */

require_once 'config.php';

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'login':
                    handleLogin($input);
                    break;
                case 'logout':
                    handleLogout();
                    break;
                case 'register':
                    handleRegister($input);
                    break;
                default:
                    sendError('Invalid action');
            }
        } else {
            sendError('Action required');
        }
        break;
    
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'verify') {
            verifySession();
        } else {
            sendError('Invalid request');
        }
        break;
    
    default:
        sendError('Method not allowed', 405);
}

function handleLogin($input) {
    // Validate input
    if (!isset($input['username']) || !isset($input['password'])) {
        sendError('Username/email and password required');
    }
    
    $usernameOrEmail = trim($input['username']);
    $password = $input['password'];
    
    if (empty($usernameOrEmail) || empty($password)) {
        sendError('Username/email and password cannot be empty');
    }
    
    // Load users
    $users = loadJsonFile(USERS_FILE);
    
    // Find user by username OR email
    $user = null;
    foreach ($users as $u) {
        if ($u['username'] === $usernameOrEmail || $u['email'] === $usernameOrEmail) {
            $user = $u;
            break;
        }
    }
    
    if (!$user || !password_verify($password, $user['password'])) {
        sendError('Invalid username/email or password');
    }
    
    if ($user['status'] !== 'approved') {
        sendError('Account pending approval');
    }
    
    // Create session
    $sessionId = generateId('sess');
    $sessions = loadJsonFile(SESSIONS_FILE);
    
    // Remove old sessions for this user
    $sessions = array_filter($sessions, function($s) use ($user) {
        return $s['user_id'] !== $user['id'];
    });
    
    // Add new session
    $sessions[] = [
        'id' => $sessionId,
        'user_id' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role'],
        'created_at' => date('Y-m-d H:i:s'),
        'expires_at' => date('Y-m-d H:i:s', time() + 3600 * 24) // 24 hour
    ];
    
    saveJsonFile(SESSIONS_FILE, $sessions);
    
    // Return user info (without password)
    unset($user['password']);
    sendResponse(true, 'Login successful', [
        'user' => $user,
        'session_id' => $sessionId
    ]);
}

function handleLogout() {
    $sessionId = $_GET['session_id'] ?? '';
    
    if (empty($sessionId)) {
        sendError('Session ID required');
    }
    
    $sessions = loadJsonFile(SESSIONS_FILE);
    $sessions = array_filter($sessions, function($s) use ($sessionId) {
        return $s['id'] !== $sessionId;
    });
    
    saveJsonFile(SESSIONS_FILE, array_values($sessions));
    sendResponse(true, 'Logout successful');
}

function handleRegister($input) {
    // Validate required fields
    $required = ['name', 'email', 'password', 'role'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            sendError("Field '$field' is required");
        }
    }
    
    $name = trim($input['name']);
    $email = trim($input['email']);
    $password = $input['password'];
    $role = $input['role'];
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError('Invalid email format');
    }
    
    // Validate role
    if (!in_array($role, ['user', 'artist'])) {
        sendError('Invalid role');
    }
    
    // Generate username from email
    $username = explode('@', $email)[0];
    
    // Load existing users
    $users = loadJsonFile(USERS_FILE);
    
    // Check if email or username already exists
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            sendError('Email already registered');
        }
        if ($user['username'] === $username) {
            // If username exists, append number
            $counter = 1;
            $newUsername = $username . $counter;
            while (true) {
                $exists = false;
                foreach ($users as $u) {
                    if ($u['username'] === $newUsername) {
                        $exists = true;
                        break;
                    }
                }
                if (!$exists) {
                    $username = $newUsername;
                    break;
                }
                $counter++;
                $newUsername = $username . $counter;
            }
        }
    }
    
    // Create new user
    $newUser = [
        'id' => generateId('u'),
        'username' => $username,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'email' => $email,
        'name' => $name,
        'role' => $role,
        'status' => 'pending', // Requires admin approval
        'region' => $input['region'] ?? '',
        'nation' => $input['nation'] ?? '',
        'bio' => $input['bio'] ?? '',
        'imageUrl' => $input['imageUrl'] ?? '',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $users[] = $newUser;
    saveJsonFile(USERS_FILE, $users);
    
    // Return user info (without password)
    unset($newUser['password']);
    sendResponse(true, 'Registration successful. Account pending approval.', [
        'user' => $newUser
    ]);
}

function verifySession() {
    $sessionId = $_GET['session_id'] ?? '';
    
    if (empty($sessionId)) {
        sendError('Session ID required');
    }
    
    $sessions = loadJsonFile(SESSIONS_FILE);
    
    foreach ($sessions as $session) {
        if ($session['id'] === $sessionId) {
            // Check if session expired
            if (strtotime($session['expires_at']) < time()) {
                sendError('Session expired');
            }
            
            // Get user info
            $users = loadJsonFile(USERS_FILE);
            foreach ($users as $user) {
                if ($user['id'] === $session['user_id']) {
                    unset($user['password']);
                    sendResponse(true, 'Session valid', [
                        'user' => $user,
                        'session' => $session
                    ]);
                }
            }
        }
    }
    
    sendError('Invalid session');
}
?>
