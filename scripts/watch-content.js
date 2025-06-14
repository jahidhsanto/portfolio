const chokidar = require('chokidar');
const path = require('path');
const { execSync } = require('child_process');

// Directory to watch
const CONTENT_DIR = path.join(__dirname, '../content');

// Debounce function to prevent multiple rebuilds
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to rebuild content
const rebuildContent = debounce(() => {
  console.log('Content changed. Rebuilding...');
  try {
    execSync('npm run build:content', { stdio: 'inherit' });
    console.log('Content rebuild completed successfully.');
  } catch (error) {
    console.error('Error rebuilding content:', error);
  }
}, 500);

// Initialize watcher
const watcher = chokidar.watch(CONTENT_DIR, {
  persistent: true,
  ignoreInitial: true,
  // Ignore some system files and temporary files
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  }
});

// Add event listeners
watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    rebuildContent();
  })
  .on('change', path => {
    console.log(`File ${path} has been changed`);
    rebuildContent();
  })
  .on('unlink', path => {
    console.log(`File ${path} has been removed`);
    rebuildContent();
  })
  .on('error', error => {
    console.error(`Watcher error: ${error}`);
  });

console.log(`Watching content directory: ${CONTENT_DIR}`);