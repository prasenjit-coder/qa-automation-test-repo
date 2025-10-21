# Contributing to GitHub Automation Framework

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, Playwright version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List examples** of how it would be used

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure all tests pass**
   ```bash
   npm test
   ```
6. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**

## 📝 Coding Standards

### JavaScript Style Guide

- Use **ESM** (ES Modules) syntax
- Use **const** and **let**, avoid **var**
- Use **async/await** instead of callbacks
- Add **JSDoc comments** for functions
- Follow **consistent naming conventions**:
  - Classes: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.js`

### Test Writing Guidelines

```javascript
// Good test structure
test('test_descriptive_name - Clear description of what is tested', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  
  // Act
  await loginPage.login(username, password);
  
  // Assert
  await loginPage.verifyLoginSuccess();
});
```

**Test Naming Convention:**
- Use descriptive names: `test_feature_scenario`
- Include test purpose in description
- Group related tests in `test.describe()` blocks

### Page Object Model

When adding new page objects:

```javascript
import { BasePage } from './base.page.js';

export class NewPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors
    this.selectors = {
      element: '#selector',
      button: 'button[type="submit"]'
    };
  }
  
  // Define page methods
  async performAction() {
    await this.click(this.selectors.button);
  }
}
```

## 🧪 Testing Your Changes

Before submitting a PR:

1. **Run all tests:**
   ```bash
   npm test
   ```

2. **Run linting** (if configured):
   ```bash
   npm run lint
   ```

3. **Test in multiple browsers:**
   ```bash
   npm run test:chromium
   npm run test:firefox
   npm run test:webkit
   ```

4. **Verify no regressions:**
   - All existing tests should pass
   - New tests should be added for new features

## 📦 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(auth): add two-factor authentication support

fix(api): handle rate limit errors correctly

docs: update installation instructions

test(ui): add tests for file upload functionality
```

## 🏗️ Project Structure

When adding new files, follow this structure:

```
tests/
├── pages/          # Page Object Model classes
├── api/            # API client modules
├── utils/          # Utility functions
├── fixtures/       # Test fixtures (if needed)
└── *.spec.js       # Test specification files
```

## 🔍 Code Review Process

1. **Automated checks** must pass (CI/CD)
2. **At least one reviewer** approval required
3. **All comments** should be addressed
4. **Tests** must be included for new features
5. **Documentation** must be updated if needed

## 📚 Documentation

When adding features, update:

- **README.md** - If it affects setup or usage
- **QUICK_START.md** - If it affects getting started
- **Code comments** - Add JSDoc for new functions
- **Test descriptions** - Clear test purposes

## 🐛 Debugging Tests

### Common Issues

**Tests failing locally:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

**Need to see what's happening:**
```bash
# Run in headed mode
npm run test:headed

# Debug specific test
npx playwright test --debug test_authentication.spec.js
```

**Inspect test results:**
```bash
# View HTML report
npm run test:report

# Check logs
cat tests/logs/tests.log
```

## 🎨 Adding New Test Cases

1. **Identify the test category** (Auth, UI, API, Cross-platform)
2. **Create test in appropriate file**
3. **Follow existing patterns**
4. **Add cleanup** in `afterEach` if creating resources
5. **Log test execution** using logger
6. **Update README** test coverage section

Example:

```javascript
test('test_new_feature - Description', async ({ page }) => {
  logger.info('Test: New Feature');
  
  // Setup
  const repoName = generateRepoName();
  
  try {
    // Test logic
    
    logger.info('✓ Test passed');
  } finally {
    // Cleanup
    await cleanup(repoName);
  }
});
```

## 🔐 Security Considerations

- **Never commit credentials**
- **Use environment variables** for sensitive data
- **Review `.gitignore`** before committing
- **Sanitize logs** - don't log sensitive information
- **Validate inputs** in helper functions

## 📋 Checklist Before Submitting PR

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] Commit messages follow convention
- [ ] Documentation updated
- [ ] No sensitive data in code
- [ ] Screenshots added (if UI changes)
- [ ] Reviewer assigned

## 💬 Getting Help

- **Questions?** Open an issue with label `question`
- **Discussion?** Use GitHub Discussions
- **Found a bug?** Open an issue with label `bug`

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
