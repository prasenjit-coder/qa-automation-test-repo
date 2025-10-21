import winston from 'winston';

// Logger setup
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'tests/logs/tests.log' })
  ]
});

// Generate unique repository name
export function generateRepoName(prefix = 'test-repo') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
}

// Sleep function
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Deep equal comparison
export function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Cleanup test repositories
export async function cleanupTestRepos(api, username, prefix = 'test-') {
  try {
    const repos = await api.listRepositories(username);
    const testRepos = repos.filter(repo => repo.name.startsWith(prefix));
    
    logger.info(`Found ${testRepos.length} test repositories to cleanup`);
    
    for (const repo of testRepos) {
      try {
        await api.deleteRepository(username, repo.name);
        logger.info(`Deleted: ${repo.name}`);
      } catch (error) {
        logger.warn(`Failed to delete ${repo.name}: ${error.message}`);
      }
    }
  } catch (error) {
    logger.error(`Cleanup failed: ${error.message}`);
  }
}
