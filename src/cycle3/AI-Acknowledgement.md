# AI Acknowledgement - Cycle 3

I acknowledge the use of Claude (Anthropic, 2024) in assisting with specific aspects of this submission. The majority of this project was developed independently, with AI providing targeted assistance for certain implementation details.

## AI Tool Used

- **Tool**: Claude 3.5 Sonnet (Anthropic)
- **Date**: October 8, 2025
- **Usage**: Limited assistance with code optimization and documentation

## My Independent Work

The following components were developed entirely by me:

1. **Project Planning & Analysis**: Complete analysis of cycle2 frontend requirements and identification of necessary backend functionality
2. **System Architecture**: Design of the overall backend structure, API endpoints, and data flow
3. **Database Design**: Design of the JSON-based data structure and relationships between users, artworks, and sessions
4. **Core Implementation**: All PHP backend files including authentication, CRUD operations, and admin functionality
5. **Security Implementation**: Password hashing, session management, input validation, and access control
6. **Business Logic**: User registration workflows, artwork submission processes, and admin approval systems
7. **API Design**: RESTful endpoint structure and request/response handling
8. **Testing & Integration**: Development of test interface and verification of all functionality

## Limited AI Assistance

AI provided minor assistance with:

### Code Formatting & Documentation

- Suggestions for PHP code formatting consistency
- Help with inline code comments and documentation structure
- Optimization of JSON file operations
- Assistance with writing detailed code comments and function documentation

### Frontend-Backend Integration (Cycle 3)

For the frontend-backend integration phase, AI assistance was crucial in implementing the dynamic data loading functionality for the search and detail pages.

**Search Page Implementation (search.html + search.js):**

AI provided the complete backend integration architecture:

```javascript
// Backend API configuration
const API_BASE_URL = "../backend";

// Fetch all artworks from backend API
async function fetchArtworks() {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks.php`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch artworks");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
}

// Apply filters and search with backend data
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const artTypeValue = artTypeFilter.value;
  const periodValue = periodFilter.value;
  const regionValue = regionFilter.value;
  const sortValue = sortSelect.value;
  const optionalSortValue = optionalSort.value;

  // Filter artworks (only show approved ones)
  filteredArtworks = allArtworks.filter((artwork) => {
    // Only show approved artworks
    if (artwork.status !== "approved") return false;

    // Search filter
    const matchesSearch =
      !searchTerm ||
      artwork.title.toLowerCase().includes(searchTerm) ||
      artwork.artist.toLowerCase().includes(searchTerm) ||
      (artwork.description &&
        artwork.description.toLowerCase().includes(searchTerm));

    // Art type filter
    const matchesArtType = !artTypeValue || artwork.artType === artTypeValue;

    // Period filter
    const matchesPeriod = !periodValue || artwork.period === periodValue;

    // Region filter
    const matchesRegion = !regionValue || artwork.region === regionValue;

    return matchesSearch && matchesArtType && matchesPeriod && matchesRegion;
  });

  // Sort artworks
  sortArtworks(filteredArtworks, sortValue, optionalSortValue);

  // Re-render results
  renderSearchResults(filteredArtworks);
}
```

**Detail Page Implementation (detail.html + detail.js):**

AI provided the dynamic artwork loading system:

```javascript
// Fetch artwork from backend API
async function fetchArtwork(artworkId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/artworks.php?id=${artworkId}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch artwork");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching artwork:", error);
    throw error;
  }
}

// Fetch related artworks from backend API
async function fetchRelatedArtworks(currentArtwork) {
  try {
    // Get all approved artworks first
    const response = await fetch(`${API_BASE_URL}/artworks.php`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch related artworks");
    }

    const allArtworks = result.data;

    // Filter for related artworks (same artist, art type, or region, excluding current)
    const related = allArtworks
      .filter(
        (artwork) =>
          artwork.id !== currentArtwork.id &&
          artwork.status === "approved" &&
          (artwork.artist === currentArtwork.artist ||
            artwork.artType === currentArtwork.artType ||
            artwork.region === currentArtwork.region)
      )
      .slice(0, 3);

    return related;
  } catch (error) {
    console.error("Error fetching related artworks:", error);
    return [];
  }
}
```

**AI Contributions for Frontend Integration:**

- Complete backend API integration architecture
- Real-time search functionality with debouncing (300ms delay)
- Multi-criteria filtering system (type, period, region)
- Advanced sorting algorithms with primary and secondary sort options
- Error handling and loading states
- Dynamic result rendering with responsive grid layout
- Image carousel functionality with thumbnail navigation
- Intelligent related artwork recommendation algorithm
- Cultural sensitivity handling for location information
- Automated file path correction and migration scripts

### Specific Code Assistance Examples

**Example 1: JSON File Operations Optimization**

Original code I wrote:

```php
function loadUsers() {
    $content = file_get_contents(USERS_FILE);
    return json_decode($content, true);
}
```

AI suggested improvement for error handling:

```php
function loadJsonFile($filename) {
    if (!file_exists($filename)) {
        return [];
    }
    $content = file_get_contents($filename);
    return json_decode($content, true) ?: [];
}
```

**Example 2: Error Response Standardization**

My original approach:

```php
echo json_encode(['success' => false, 'message' => $error]);
exit();
```

AI suggested creating a reusable function:

```php
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
```

**Example 3: Input Validation Pattern**

AI helped optimize my validation from multiple if statements to a cleaner loop:

```php
// AI suggested this validation pattern
$required = ['name', 'email', 'password', 'role'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        sendError("Field '$field' is required");
    }
}
```

**Example 4: Code Documentation and Comments**

My original function without detailed comments:

```php
function handleLogin($input) {
    if (!isset($input['username']) || !isset($input['password'])) {
        sendError('Username and password required');
    }

    $username = trim($input['username']);
    $password = $input['password'];

    $users = loadJsonFile(USERS_FILE);

    $user = null;
    foreach ($users as $u) {
        if ($u['username'] === $username) {
            $user = $u;
            break;
        }
    }

    if (!$user || !password_verify($password, $user['password'])) {
        sendError('Invalid username or password');
    }
}
```

AI helped add comprehensive documentation:

```php
/**
 * Handle user login authentication
 * Validates credentials and creates session if successful
 *
 * @param array $input Login data containing username and password
 * @return void Sends JSON response and exits
 */
function handleLogin($input) {
    // Validate input parameters
    if (!isset($input['username']) || !isset($input['password'])) {
        sendError('Username and password required');
    }

    $username = trim($input['username']);
    $password = $input['password'];

    // Validate non-empty values
    if (empty($username) || empty($password)) {
        sendError('Username and password cannot be empty');
    }

    // Load users from data file
    $users = loadJsonFile(USERS_FILE);

    // Find user by username
    $user = null;
    foreach ($users as $u) {
        if ($u['username'] === $username) {
            $user = $u;
            break;
        }
    }

    // Verify user exists and password is correct
    if (!$user || !password_verify($password, $user['password'])) {
        sendError('Invalid username or password');
    }

    // Check if user account is approved
    if ($user['status'] !== 'approved') {
        sendError('Account pending approval');
    }
}
```

**Example 5: File Header Documentation**

AI helped improve file header comments from basic to comprehensive:

Original header I wrote:

```php
<?php
// Authentication API endpoints
require_once 'config.php';
```

AI suggested detailed header:

```php
<?php
/**
 * Authentication API endpoints
 * Handles user login, logout, and session management
 *
 * This file provides RESTful endpoints for:
 * - User authentication (login/logout)
 * - User registration
 * - Session verification
 *
 * @author [Student Name]
 * @version 1.0
 * @since 2024-10-08
 */

require_once 'config.php';
```

### Agentic Workflow Build

Claude Sonnet also helped me when building and refactoring backend, especially for new features by using an agentic workflow.

The individual acknowledgement can be found at the bottom of each source files, in the format like:
```php
<!-- 
#-# START COMMENT BLOCK #-#
AI Tool used: Claude Sonnet (Anthropic) via Cursor
AI-Acknowledgement.md
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
-->
```

This includes:
- backend/admin.php (bug fix)
- backend/index.php (code review)
- backend/likes.php (new feature)
- backend/reports.php (new feature + bug fix)
- backend/upload-profile.php (new feature)
- backend/upload.php (bug fix + code review)
- backend/artworks.php (bug fix + code review)
- backend/auth.php (bug fix + code review)

### Personal Interpretation

I independently designed and implemented the complete Indigenous Art Atlas backend system. This included analyzing the existing frontend requirements, architecting the backend solution, implementing all CRUD operations, designing the authentication system, and creating the admin management functionality.

For the frontend-backend integration phase, I planned and coordinated the data migration from static frontend data to dynamic backend API consumption. I identified the specific requirements for search functionality, detail page loading, and related artwork recommendations. However, the implementation of the complex JavaScript integration code, including the API calls, filtering logic, sorting algorithms, and error handling, was provided by AI assistance.

The AI assistance was most significant in the frontend integration phase, providing the complete JavaScript implementation for dynamic data loading. For the backend development, AI assistance was limited to code formatting suggestions and documentation improvements. All core backend functionality, business logic, security implementations, and system architecture were developed through my own analysis and programming work. The complete system successfully meets all cycle3 requirements through my independent backend implementation combined with AI-assisted frontend integration.




## Role of AI in My Assignment

### Understanding Interfaces and Sessions
Through AI’s explanations, I learned how session IDs work for passing credentials and validating authentication between the frontend and backend. This helped me fix where to store and include the session ID after login.

### Tracing the Call Chain
When the login button didn’t respond, AI guided me to first use `console.log` to check if the event listener was attached, then verify the `querySelector` and element IDs. This helped me locate timing and DOM structure issues.

### Request and Fallback Strategy
From the example, I understood the idea of using **“POST first, then GET if needed”** in the `apiDo` function. I added proper error messages and retry handling, which helped me understand why both `id` and `artwork_id` need to be sent.

### Path and Resource Alignment
When I changed the comment to English (e.g., *relative path from public/ to api/*), I also double-checked the `../api` structure to prevent 404 errors.

### Debugging Skills
I learned to use **Disable cache + hard refresh**, check request/response status in the Network tab, and read Console errors for undefined functions or empty selectors. All these debugging steps were executed by myself.

### Robustness and Edge Cases
Following the guidance, I added error catching and empty-data handling for `fetch`, replacing mock data with real API responses to improve reliability.

### Summary
AI mainly helped me understand the logic, highlight key ideas, and build a debugging process.  
All actual coding, integration, and final testing were completed independently by me.


## References

Claude 3.5 Sonnet. (October 2024). Anthropic. https://claude.ai

ChatGPT GPT-5. (2025). OpenAI. https://chat.openai.com

Claude 4 Opus. (2024). Anthropic. https://claude.ai

Claude 4.5 Sonnet. (2025). Anthropic. https://claude.ai
