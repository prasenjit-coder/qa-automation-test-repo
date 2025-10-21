import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const testData = {
  credentials: {
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD,
    token: process.env.GITHUB_TOKEN
  },
  urls: {
    base: process.env.BASE_URL || 'https://github.com',
    api: process.env.API_BASE_URL || 'https://api.github.com'
  },
  repositories: {
    prefix: process.env.TEST_REPO_PREFIX || 'test-automation-repo'
  },
  performance: {
    maxPageLoadTime: 5000,
    maxApiResponseTime: 3000
  },
  networkConditions: {
    slow3G: {
      offline: false,
      downloadThroughput: (500 * 1024) / 8,
      uploadThroughput: (500 * 1024) / 8,
      latency: 400
    },
    offline: {
      offline: true,
      downloadThroughput: 0,
      uploadThroughput: 0,
      latency: 0
    }
  }
};

export function validateTestData() {
  const required = ['username', 'password', 'token'];
  const missing = required.filter(key => !testData.credentials[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required credentials: ${missing.join(', ')}`);
  }
}
