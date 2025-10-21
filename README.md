# GitHub Full-Stack QA Automation Framework

A comprehensive **JavaScript-based QA automation framework** built with **Playwright** for testing GitHub's UI and REST API functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Reports](#reports)
- [CI/CD Integration](#cicd-integration)
- [Contributing](#contributing)

## 🎯 Overview

This automation framework provides comprehensive test coverage for GitHub's platform, including:
- **Authentication & Session Management**
- **Repository CRUD Operations** (UI & API)
- **File Operations** (create, edit, delete)
- **Cross-Browser Testing** (Chromium, Firefox, WebKit)
- **Performance Testing**
- **Responsive Design Testing**
- **API Data Consistency Validation**

## ✨ Features

- ✅ **Page Object Model (POM)** design pattern
- ✅ **Parallel test execution** support
- ✅ **Cross-browser testing** (Chromium, Firefox, WebKit)
- ✅ **Mobile viewport testing**
- ✅ **API testing** with axios
- ✅ **Comprehensive logging** with winston
- ✅ **Screenshot & video** capture on failures
- ✅ **Performance metrics** tracking
- ✅ **Data consistency** validation (UI ↔ API)
- ✅ **Network throttling** simulation
- ✅ **Accessibility testing** (keyboard navigation, ARIA)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | Browser automation & test runner |
| **JavaScript (ESM)** | Programming language |
| **Axios** | HTTP client for API testing |
| **Winston** | Logging framework |
| **Dotenv** | Environment variable management |
| **Node.js** | Runtime environment |

## 📁 Project Structure

```
github-automation-assessment/
├── tests/
│   ├── .auth/                          # Saved authentication states
│   │   └── user.json
│   ├── .env                            # Environment variables (gitignored)
│   ├── pages/                          # Page Object Model
│   │   ├── base.page.js               # Base page class
│   │   ├── login.page.js              # Login page objects
│   │   └── repository.page.js         # Repository page objects
│   ├── api/
│   │   └── github.api.js              # GitHub API client
│   ├── utils/
│   │   ├── helpers.js                 # Utility functions
│   │   └── testData.js                # Test data & configuration
│   ├── logs/
│   │   └── tests.log                  # Test execution logs
│   ├── test_authentication.spec.js    # Part 1: Authentication tests
│   ├── test_ui_operations.spec.js     # Part 2: UI operations tests
│   ├── test_api_operations.spec.js    # Part 3: API operations tests
│   └── test_cross_platform.spec.js    # Part 4: Cross-platform tests
├── playwright.config.js                # Playwright configuration
├── package.json                        # Dependencies & scripts
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **GitHub account** with:
  - Username
  - Password
  - Personal Access Token (with `repo`, `delete_repo` scopes)

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd github-automation-assessment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

1. **Create `.env` file:**
   ```bash
   cp .env.example tests/.env
   ```

2. **Configure environment variables in `tests/.env`:**
   ```env
   GITHUB_USERNAME=your_github_username
   GITHUB_PASSWORD=your_github_password
   GITHUB_TOKEN=your_personal_access_token
   BASE_URL=https://github.com
   API_BASE_URL=https://api.github.com
   TEST_REPO_PREFIX=test-automation-repo
   ```

3. **Generate GitHub Personal Access Token:**
   - Go to: `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)`
   - Click `Generate new token (classic)`
   - Select scopes: `repo`, `delete_repo`, `user`
   - Copy the token to `.env` file

## 🏃 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Specific Test Suites
```bash
# Part 1: Authentication tests
npm run test:auth

# Part 2: UI operations
npm run test:ui

# Part 3: API operations
npm run test:api

# Part 4: Cross-platform tests
npm run test:cross
```

### Run Tests in Specific Browser
```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox

# WebKit only
npm run test:webkit

# Mobile viewport
npm run test:mobile
```

### Debug Tests
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

## 📊 Test Coverage

### Part 1: Authentication & Session Management
- ✅ `test_github_login_flow` - Login flow validation
- ✅ `test_session_persistence` - Session state persistence
- ✅ `test_logout_flow` - Logout functionality
- ✅ `test_api_authentication` - API token validation
- ✅ `test_invalid_login` - Invalid credentials handling
- ✅ `test_api_rate_limiting` - Rate limit validation

### Part 2: Repository Operations (UI)
- ✅ `test_create_repository` - Create repo via UI
- ✅ `test_repository_settings` - Update repo settings
- ✅ `test_delete_repository` - Delete repo via UI
- ✅ `test_file_upload` - Create files via web editor
- ✅ `test_file_editing` - Edit files via web editor
- ✅ `test_multiple_files` - Multiple file operations
- ✅ `test_repository_readme` - README rendering

### Part 3: API Testing & Data Consistency
- ✅ `test_api_create_repository` - Create repo via API
- ✅ `test_api_update_repository` - Update repo via API
- ✅ `test_api_delete_repository` - Delete repo via API
- ✅ `test_ui_api_consistency` - UI ↔ API data validation
- ✅ `test_api_error_404` - 404 error handling
- ✅ `test_api_error_422` - 422 validation errors
- ✅ `test_api_file_operations` - File CRUD via API
- ✅ `test_api_ui_file_sync` - File sync between UI & API
- ✅ `test_api_list_repositories` - List repositories
- ✅ `test_concurrent_api_requests` - Concurrent operations

### Part 4: Cross-Platform & Performance
- ✅ **Cross-Browser:**
  - Chromium compatibility
  - Firefox compatibility
  - WebKit (Safari) compatibility
- ✅ **Responsive Design:**
  - iPhone viewport
  - iPad viewport
  - Desktop/Tablet/Mobile layouts
- ✅ **Performance:**
  - Page load time measurement
  - API response time measurement
  - Repository creation performance
  - Navigation performance
- ✅ **Network Conditions:**
  - Slow 3G simulation
  - Offline handling
- ✅ **Concurrent Sessions:**
  - Multiple browser sessions
  - Race condition testing
- ✅ **Visual Testing:**
  - Screenshot capture
  - Element screenshots
- ✅ **Accessibility:**
  - Keyboard navigation
  - ARIA labels validation

## 📈 Reports

After test execution, reports are available in:

- **HTML Report:** `playwright-report/index.html`
- **JSON Report:** `test-results/results.json`
- **Logs:** `tests/logs/tests.log`
- **Screenshots:** `screenshots/` (on failures)
- **Videos:** `test-results/` (on failures)

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run tests
        env:
          GITHUB_USERNAME: ${{ secrets.GITHUB_USERNAME }}
          GITHUB_PASSWORD: ${{ secrets.GITHUB_PASSWORD }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npm test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🔐 Security Best Practices

- ✅ Credentials stored in `.env` file (gitignored)
- ✅ Never commit `.env` to version control
- ✅ Use GitHub Personal Access Tokens (not passwords)
- ✅ Rotate tokens regularly
- ✅ Limit token scopes to minimum required

## 🧹 Cleanup

Test repositories are automatically cleaned up after each test. To manually clean up test repositories:

```javascript
import { GitHubAPI } from './tests/api/github.api.js';
import { cleanupTestRepos } from './tests/utils/helpers.js';

const api = new GitHubAPI(process.env.GITHUB_TOKEN);
await cleanupTestRepos(api, process.env.GITHUB_USERNAME);
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify credentials in `.env` file
   - Check GitHub token has required scopes
   - Ensure 2FA is properly configured

2. **Rate Limiting**
   - GitHub API has rate limits (5000 requests/hour for authenticated)
   - Check rate limit: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit`

3. **Timeout Errors**
   - Increase timeout in `playwright.config.js`
   - Check network connectivity
   - Verify GitHub service status

4. **Browser Launch Errors**
   - Reinstall Playwright browsers: `npx playwright install`
   - Check system dependencies: `npx playwright install-deps`

## 📝 Test Data Management

Test data is managed in `tests/utils/testData.js`:

- **Credentials:** Loaded from environment variables
- **URLs:** Configurable base URLs
- **Repository configs:** Templates for different repo types
- **Performance thresholds:** Customizable limits
- **Network conditions:** Predefined network profiles

## 🎨 Page Object Model

The framework uses POM for maintainability:

- **BasePage:** Common page actions (click, fill, navigate)
- **LoginPage:** Login/logout operations
- **RepositoryPage:** Repository CRUD, file operations

## 📊 Logging

Winston logger provides detailed logs:

- **Console:** Colorized, formatted output
- **File:** JSON logs in `tests/logs/tests.log`
- **Levels:** info, warn, error, debug

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this framework for your projects.

## 👥 Author

QA Automation Engineer

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Winston Logger](https://github.com/winstonjs/winston)
- [Axios Documentation](https://axios-http.com)

---

**Happy Testing! 🚀**
