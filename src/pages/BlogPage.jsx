import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import useMarkdownContent from '../hooks/useMarkdownContent';
import { formatDateAsDDMMYYYY, parseCustomDate } from '../utils/dateUtils';

const BlogPostCard = ({ post }) => {
  const postSlug = post.id;
  
  return (
    <div className="blog-card flex flex-col md:flex-row items-stretch bg-white rounded-xl overflow-hidden shadow-md mb-8">
      {/* Image Section - Always on the left */}
      {post.metadata?.image && (
        <div className="md:w-1/2 relative">
          <div className="h-64 md:h-auto flex items-center justify-center bg-gray-50 overflow-hidden">
            <img 
              src={post.metadata.image} 
              alt={post.metadata.title || post.title} 
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105" 
              loading="lazy"
            />
          </div>
        </div>
      )}
      
      {/* Content Section */}
      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-gray-700 transition-colors">
            {post.metadata.title || post.title}
          </h3>
          
          {/* Tags */}
          {post.metadata?.tag && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.metadata.tag.split(',').map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 border border-blue-200"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          
          {/* Date */}
          {post.metadata?.date && (
            <p className="text-sm text-gray-500 mb-3">
              {formatDateAsDDMMYYYY(parseCustomDate(post.metadata.date))}
            </p>
          )}
          
          {/* Summary */}
          <p className="text-gray-600 mb-4 line-clamp-4">
            {post.metadata?.summary || post.metadata?.description || 
              (post.rawContent && post.rawContent.substring(0, 250) + '...')}
          </p>
        </div>
        
        {/* Read More Link */}
        <Link 
          to={`/blog/${postSlug}`} 
          className="inline-flex items-center text-primary font-medium hover:text-secondary group mt-4"
        >
          Read More
          <svg 
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

// Wrapper component to handle the background color (kept from previous version)
const BgWrapper = ({ children }) => {
  useEffect(() => {
    // Add our bg-light class ensuring we don't duplicate it
    if (!document.body.classList.contains('bg-light')) {
      document.body.classList.add('bg-light');
    }
    
    // Force a repaint to ensure styles take effect
    document.body.style.display = 'none';
    // Use the return value to avoid ESLint error
    const reflow = document.body.offsetHeight;
    document.body.style.display = '';
    
    // Prevent unused variable warning
    console.log('Background applied', reflow);
    
    // Clean up function
    return () => {
      // Only remove our class, preserve others
      document.body.classList.remove('bg-light');
    };
  }, []);
  
  return (
    <div className="bg-light min-h-screen">
      {children}
    </div>
  );
};

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [allTags, setAllTags] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [pageTitle, setPageTitle] = useState('Blog | Md. Jahid Hassan');
  
  const { allContent: blogPosts, loading: blogPostsLoading } = useMarkdownContent('blog');
  
  // Update title when the active tag changes
  useEffect(() => {
    if (activeTag) {
      setPageTitle(`${activeTag} Blog Posts | Md. Jahid Hassan`);
    } else {
      setPageTitle('Blog | Md. Jahid Hassan');
    }
  }, [activeTag]);
  
  useEffect(() => {
    if (Array.isArray(blogPosts) && blogPosts.length > 0) {
      // Extract all unique tags from blog posts
      const tags = new Set();
      blogPosts.forEach(post => {
        if (post.metadata?.tag) {
          const postTags = post.metadata.tag.split(',').map(tag => tag.trim());
          postTags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags).sort());
      
      // Filter blog posts by tag
      if (activeTag) {
        const filtered = blogPosts.filter(post => {
          if (!post.metadata?.tag) return false;
          const postTags = post.metadata.tag.split(',').map(tag => tag.trim());
          return postTags.includes(activeTag);
        });
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts(blogPosts);
      }
    } else {
      setFilteredPosts([]);
    }
  }, [blogPosts, activeTag]);

  const handleTagClick = (tag) => {
    // If clicking the active tag, clear the filter
    if (tag === activeTag) {
      setActiveTag('');
      setSearchParams({});
    } else {
      setActiveTag(tag);
      setSearchParams({ tag });
    }
  };

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = a.metadata?.date ? parseCustomDate(a.metadata.date) : new Date(0);
    const dateB = b.metadata?.date ? parseCustomDate(b.metadata.date) : new Date(0);
    return dateB - dateA;
  });

  const renderContent = () => {
    if (blogPostsLoading) {
      return (
        <div className="container mx-auto px-4 py-12 pt-28">
          <Helmet>
            <title>Loading Blog | Md. Jahid Hassan</title>
            <meta name="description" content="Browse my blog posts" />
          </Helmet>
          <div className="text-center mb-12">
            <h2 className="title mb-4">My <span>Blog</span></h2>
            <p className="max-w-2xl mx-auto text-gray-600">Explore my thoughts and experiences</p>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="md:w-1/2 bg-gray-200 h-64 md:h-80"></div>
                <div className="md:w-1/2 p-8 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3 mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-12 pt-28">
        <Helmet>
          <title>{pageTitle}</title>
          <meta
            name="description"
            content={activeTag 
              ? `Explore ${activeTag} blog posts by Md. Jahid Hassan.` 
              : 'Explore the latest blog posts on various topics from Md. Jahid Hassan.'}
          />
          <meta
            name="keywords"
            content={`blog, articles, ${activeTag || ''}, portfolio, Md. Jahid Hassan`}
          />
          {/* Open Graph Tags */}
          <meta property="og:title" content={pageTitle} />
          <meta
            property="og:description"
            content={activeTag 
              ? `Explore ${activeTag} blog posts by Md. Jahid Hassan.` 
              : 'Explore the latest blog posts on various topics from Md. Jahid Hassan.'}
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://digindominic.me/blog${activeTag ? `?tag=${activeTag}` : ''}`} />
          <meta
            property="og:image"
            content="https://i.imgur.com/qOGpTfu.jpeg"
          />
        </Helmet>
        <div className="text-center mb-8">
          <h2 className="title mb-4">My <span>Blog</span></h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6">Explore my thoughts, insights, and experiences</p>
          
          {/* Tags filter section */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeTag === tag 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {activeTag && (
                <button
                  onClick={() => handleTagClick(activeTag)}
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>
        
        {sortedPosts.length === 0 ? (
          <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-lg p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            {activeTag ? (
              <>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No blog posts found with tag: {activeTag}</h3>
                <p>Try selecting a different tag or clear the filter.</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No blog posts available yet</h3>
                <p>Check back soon for new content!</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {sortedPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Wrap the entire component with our background wrapper
  return (
    <BgWrapper>
      {renderContent()}
    </BgWrapper>
  );
};

export default BlogPage;