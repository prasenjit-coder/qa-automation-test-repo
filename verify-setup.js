#!/usr/bin/env node

/**
 * Setup Verification Script
 * 
 * This script verifies that the project is properly configured
 * before running tests.
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

console.log('🔍 GitHub Automation Framework - Setup Verification');
console.log('=' .repeat(60));
console.log('');

let hasErrors = false;

// Check 1: Node.js version
console.log('1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 16) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (requires v16 or higher)`);
  hasErrors = true;
}
console.log('');

// Check 2: Dependencies
console.log('2️⃣  Checking dependencies...');
const packageJsonPath = './package.json';
const nodeModulesPath = './node_modules';

if (fs.existsSync(packageJsonPath)) {
  console.log('   ✅ package.json found');
} else {
  console.log('   ❌ package.json not found');
  hasErrors = true;
}

if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules found');
} else {
  console.log('   ❌ node_modules not found. Run: npm install');
  hasErrors = true;
}
console.log('');

// Check 3: Environment file
console.log('3️⃣  Checking environment configuration...');
const envPath = './tests/.env';
const envExamplePath = './.env.example';

if (fs.existsSync(envExamplePath)) {
  console.log('   ✅ .env.example found');
} else {
  console.log('   ⚠️  .env.example not found');
}

if (fs.existsSync(envPath)) {
  console.log('   ✅ tests/.env found');
  
  // Load and verify credentials
  dotenv.config({ path: envPath });
  
  const requiredVars = [
    'GITHUB_USERNAME',
    'GITHUB_PASSWORD',
    'GITHUB_TOKEN'
  ];
  
  let missingVars = [];
  requiredVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName] === `your_${varName.toLowerCase()}`) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('   ✅ All required credentials configured');
  } else {
    console.log(`   ❌ Missing or placeholder values: ${missingVars.join(', ')}`);
    console.log('      Please edit tests/.env with your actual credentials');
    hasErrors = true;
  }
} else {
  console.log('   ❌ tests/.env not found');
  console.log('      Run: cp .env.example tests/.env');
  hasErrors = true;
}
console.log('');

// Check 4: Required directories
console.log('4️⃣  Checking directory structure...');
const requiredDirs = [
  'tests',
  'tests/pages',
  'tests/api',
  'tests/utils',
  'tests/logs',
  'tests/.auth'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ not found`);
    hasErrors = true;
  }
});
console.log('');

// Check 5: Test files
console.log('5️⃣  Checking test files...');
const testFiles = [
  'tests/test_authentication.spec.js',
  'tests/test_ui_operations.spec.js',
  'tests/test_api_operations.spec.js',
  'tests/test_cross_platform.spec.js'
];

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} not found`);
    hasErrors = true;
  }
});
console.log('');

// Check 6: Page objects
console.log('6️⃣  Checking Page Object Model...');
const pomFiles = [
  'tests/pages/base.page.js',
  'tests/pages/login.page.js',
  'tests/pages/repository.page.js'
];

pomFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} not found`);
    hasErrors = true;
  }
});
console.log('');

// Check 7: API & Utils
console.log('7️⃣  Checking API client and utilities...');
const utilFiles = [
  'tests/api/github.api.js',
  'tests/utils/helpers.js',
  'tests/utils/testData.js'
];

utilFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} not found`);
    hasErrors = true;
  }
});
console.log('');

// Check 8: Configuration files
console.log('8️⃣  Checking configuration files...');
const configFiles = [
  'playwright.config.js',
  '.gitignore'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} not found`);
    hasErrors = true;
  }
});
console.log('');

// Summary
console.log('=' .repeat(60));
if (hasErrors) {
  console.log('❌ Setup verification FAILED');
  console.log('');
  console.log('Please fix the errors above before running tests.');
  console.log('');
  console.log('Quick fixes:');
  console.log('  • Run: npm install');
  console.log('  • Run: npx playwright install');
  console.log('  • Copy: cp .env.example tests/.env');
  console.log('  • Edit tests/.env with your GitHub credentials');
  console.log('');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Setup is complete.');
  console.log('');
  console.log('You can now run tests:');
  console.log('  • npm test              (run all tests)');
  console.log('  • npm run test:auth     (authentication tests)');
  console.log('  • npm run test:ui       (UI operations tests)');
  console.log('  • npm run test:api      (API operations tests)');
  console.log('  • npm run test:cross    (cross-platform tests)');
  console.log('  • npm run test:headed   (see browser)');
  console.log('');
  console.log('Happy testing! 🎉');
  console.log('');
}
