// src/utils/markdownUtils.js
import matter from 'gray-matter';
import { marked } from 'marked';

export function parseMarkdownContent(markdownString) {
  // Parse frontmatter and content
  const { data, content } = matter(markdownString);
  
  // Process markdown to HTML if needed
  const htmlContent = marked.parse(content);
  
  return {
    metadata: data,
    content: htmlContent,
    rawContent: content
  };
}