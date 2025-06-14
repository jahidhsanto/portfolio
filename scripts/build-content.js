// scripts/build-content.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const glob = require('glob');

// Directory paths
const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_DIR = path.join(__dirname, '../public/api/content');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process a single markdown file and return processed content
function processMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: metadata, content } = matter(fileContent);
  
  // Get filename without extension to use as ID/slug
  const fileName = path.basename(filePath, '.md');
  const folderName = path.basename(path.dirname(filePath));
  
  return {
    id: fileName,
    type: folderName,
    metadata,
    content: marked.parse(content),
    rawContent: content
  };
}

// Process markdown files by content type
function processContentType(contentType) {
  const contentTypeDir = path.join(CONTENT_DIR, contentType);
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(contentTypeDir)) {
    console.log(`No ${contentType} directory found. Skipping...`);
    return;
  }
  
  // Find all markdown files in the content type directory
  const markdownFiles = glob.sync(`${contentTypeDir}/**/*.md`);
  
  // Process each file
  const processedContent = markdownFiles.map(file => processMarkdownFile(file));
  
  // Write to collection file (all items of this type)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${contentType}.json`),
    JSON.stringify(processedContent, null, 2),
    'utf8'
  );
  
  // Write individual files for each content item
  processedContent.forEach(item => {
    const itemDir = path.join(OUTPUT_DIR, contentType);
    
    if (!fs.existsSync(itemDir)) {
      fs.mkdirSync(itemDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(itemDir, `${item.id}.json`),
      JSON.stringify(item, null, 2),
      'utf8'
    );
  });
  
  console.log(`Processed ${processedContent.length} ${contentType} files`);
}

// Main function to process all content
function buildContent() {
  console.log('Building content...');
  
  // Get all content type directories
  const contentTypes = fs.readdirSync(CONTENT_DIR).filter(
    item => fs.statSync(path.join(CONTENT_DIR, item)).isDirectory()
  );
  
  // Process each content type
  contentTypes.forEach(contentType => processContentType(contentType));
  
  console.log('Content build complete!');
}

// Run the build
buildContent();