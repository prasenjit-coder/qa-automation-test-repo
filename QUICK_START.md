# 🚀 Quick Start Guide

Get started with GitHub Automation Testing in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
npx playwright install
```

## Step 2: Configure Credentials

1. Copy the example environment file:
```bash
cp .env.example tests/.env
```

2. Edit `tests/.env` and add your GitHub credentials:
```env
GITHUB_USERNAME=your_username
GITHUB_PASSWORD=your_password
GITHUB_TOKEN=ghp_your_token_here
```

### How to Get a GitHub Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Automation Testing"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `delete_repo` (Delete repositories)
   - ✅ `user` (Read user profile data)
5. Click "Generate token"
6. Copy the token to your `.env` file

## Step 3: Run Your First Test

```bash
# Run all tests
npm test

# Run authentication tests only
npm run test:auth

# Run in headed mode (see browser)
npm run test:headed
```

## Step 4: View Results

After tests complete:

```bash
# Open HTML report
npm run test:report

# Check logs
cat tests/logs/tests.log
```

## 📝 Test Execution Order

Tests are organized in 4 parts:

1. **Part 1: Authentication** (`test_authentication.spec.js`)
   - Login/logout flows
   - Session management
   - API authentication

2. **Part 2: UI Operations** (`test_ui_operations.spec.js`)
   - Create repositories
   - File operations
   - Repository settings

3. **Part 3: API Operations** (`test_api_operations.spec.js`)
   - API CRUD operations
   - Data consistency
   - Error handling

4. **Part 4: Cross-Platform** (`test_cross_platform.spec.js`)
   - Multi-browser testing
   - Performance metrics
   - Responsive design

## 🎯 Common Commands

```bash
# Run specific test file
npx playwright test test_authentication.spec.js

# Run tests in specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug a failing test
npm run test:debug

# Run tests in mobile viewport
npm run test:mobile
```

## ⚠️ Important Notes

1. **Test Repositories**: Tests create temporary repositories with prefix `test-automation-repo-*`
   - These are automatically cleaned up after each test
   - Don't panic if you see them in your GitHub account

2. **Rate Limits**: 
   - GitHub API allows 5000 requests/hour for authenticated users
   - Tests are designed to stay well below this limit

3. **Security**:
   - Never commit `.env` file to git
   - The `.gitignore` file already excludes it
   - Rotate your token regularly

## 🐛 Troubleshooting

### "Missing required environment variables"
→ Check that `tests/.env` exists and contains all required values

### "Failed to authenticate"
→ Verify your username/password are correct and 2FA is configured properly

### "Invalid token"
→ Generate a new GitHub token with correct scopes

### Tests timeout
→ Check your internet connection and GitHub service status

## 📊 Expected Output

Successful test run should show:

```
Running 30 tests using 1 worker

✓ test_github_login_flow (5s)
✓ test_session_persistence (3s)
✓ test_api_authentication (2s)
...

30 passed (2m)
```

## 🎓 Next Steps

1. ✅ Run all tests successfully
2. 📖 Read the full [README.md](./README.md)
3. 🔧 Customize test data in `tests/utils/testData.js`
4. 📝 Add your own test cases
5. 🚀 Integrate with CI/CD

## 💡 Tips

- Use `--headed` to watch tests execute in browser
- Use `--debug` to step through tests
- Check `playwright-report` for detailed HTML reports
- Review `tests/logs/tests.log` for execution logs

---

Happy Testing! 🎉
