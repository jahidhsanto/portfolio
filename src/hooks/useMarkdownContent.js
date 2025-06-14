// src/hooks/useMarkdownContent.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to fetch and process markdown content
 * @param {string} contentType - The type of content (hero, about, projects, blog)
 * @param {string|null} slug - Specific content slug (for individual project or blog post)
 * @returns {Object} - { content, allContent, loading, error, fetchContent, setContent }
 */
export default function useMarkdownContent(contentType, slug = null) {
  const [content, setContent] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (type = contentType, itemSlug = slug) => {
    if (!type) {
      setError(new Error('Content type is required'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let url;
      if (itemSlug) {
        // Fetch specific content item
        url = `/api/content/${type}/${itemSlug}.json`;
        
        console.log(`Fetching specific content: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }
        
        const data = await response.json();
        setContent(data);
      } else {
        // Fetch all content of a type
        url = `/api/content/${type}.json`;
        
        console.log(`Fetching all content of type ${type}: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }
        
        const data = await response.json();
        setAllContent(data);
        
        // Optionally set the first item as current content
        if (data.length > 0) {
          setContent(data[0]);
        } else {
          setContent(null);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${contentType} content:`, err);
      setError(err);
      setLoading(false);
    }
  }, [contentType, slug]);

  // Fetch content when component mounts or dependencies change
  useEffect(() => {
    fetchContent();
    
    // Cleanup function to handle component unmounting
    return () => {
      // Nothing specific to clean up here
    };
  }, [contentType, slug, fetchContent]);

  // Function to set a specific content item from the allContent array
  const setContentById = useCallback((id) => {
    const item = allContent.find(item => item.id === id);
    if (item) {
      setContent(item);
      return true;
    }
    return false;
  }, [allContent]);

  // Return the hook API
  return { 
    content, 
    allContent,  
    loading, 
    error, 
    fetchContent,
    setContent: setContentById
  };
}