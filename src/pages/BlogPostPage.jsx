// src/pages/BlogPostPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/common/Loader';
import useMarkdownContent from '../hooks/useMarkdownContent';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postTags, setPostTags] = useState([]);
  const [isValidPost, setIsValidPost] = useState(null);

  // Fetch the specific blog post using the slug/id from the URL
  const { 
    content: post, 
    loading: postLoading, 
    error: postError 
  } = useMarkdownContent('blog', id);

  // Fetch all blog posts to check if the current post exists in the blog list
  const { 
    allContent: blogPosts, 
    loading: blogPostsLoading 
  } = useMarkdownContent('blog');

  // Comprehensive validation function
  const validatePost = useCallback(() => {
    // If still loading, don't make a determination yet
    if (postLoading || blogPostsLoading) {
      return null;
    }

    // Check if post exists and is in the blog posts list
    if (!post) {
      console.log('No post found');
      return false;
    }

    // Ensure blog posts are loaded and an array
    const blogPostIds = Array.isArray(blogPosts) ? blogPosts.map(p => p.id) : [];
    
    // Check if the current post ID is in the list of blog post IDs
    const isValidBlogPost = blogPostIds.includes(id);
    
    console.log('Validation checks:', {
      postExists: !!post,
      postInList: isValidBlogPost,
      blogPostIds,
      currentId: id
    });

    return isValidBlogPost;
  }, [post, blogPosts, id, postLoading, blogPostsLoading]);

  // Effect to validate post and handle navigation
  useEffect(() => {
    const valid = validatePost();
    
    // Set validation state
    if (valid !== null) {
      setIsValidPost(valid);
    }
  }, [validatePost]);

  // Navigation effect
  useEffect(() => {
    // Only navigate if we've completed loading and determined post is invalid
    if (isValidPost === false && !postLoading && !blogPostsLoading) {
      console.log('Navigating to not-found page');
      navigate('/not-found');
    }
  }, [isValidPost, postLoading, blogPostsLoading, navigate]);

  // Process tags
  useEffect(() => {
    if (post && post.metadata?.tag) {
      const tags = post.metadata.tag.split(',').map(tag => tag.trim());
      setPostTags(tags);
    } else {
      setPostTags([]);
    }
  }, [post]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
  if (postLoading || blogPostsLoading || isValidPost === null) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20">
        <section className="container mx-auto px-4 py-16">
          <Helmet>
            <title>Loading Blog Post | Md. Jahid Hassan</title>
            <meta name="description" content="Loading blog post details..." />
          </Helmet>
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" color="gray" />
          </div>
        </section>
      </div>
    );
  }

  // Error or invalid post state
  if (postError || !post || isValidPost === false) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20">
        <section className="container mx-auto px-4 py-16">
          <Helmet>
            <title>Blog Post Not Found | Md. Jahid Hassan</title>
            <meta name="description" content="The requested blog post could not be found." />
          </Helmet>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the blog post you're looking for.</p>
            <Link to="/blog" className="text-gray-900 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Render post content
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <section className="container mx-auto px-4 py-12">
        <Helmet>
          <title>{`${post.metadata.title || 'Blog Post'} | Md. Jahid Hassan`}</title>
          <meta
            name="description"
            content={
              post.metadata?.summary ||
              post.content.substring(0, 160) ||
              'Read this blog post on Md. Jahid Hassan\'s Portfolio Website.'
            }
          />
          <meta
            name="keywords"
            content={`blog, article, ${postTags.join(', ')}`}
          />
          <meta name="author" content="Md. Jahid Hassan" />
          {/* Open Graph and Structured Data tags remain the same */}
        </Helmet>

        <Link to="/blog" className="inline-flex items-center text-gray-900 hover:underline mb-8">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {post.metadata?.image && (
            <figure className="w-full">
              <img
                src={post.metadata.image}
                alt={post.metadata.title}
                className="w-full object-cover object-center"
                loading="lazy"
              />
            </figure>
          )}
          <div className="p-6 md:p-8">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.metadata.title}</h1>
              <div className="flex flex-wrap items-center text-gray-600 mb-2">
                <time className="mr-4" dateTime={post.metadata.date}>
                  {formatDate(post.metadata.date)}
                </time>
                {post.metadata.author && (
                  <span className="flex items-center">
                    <span className="mx-2">•</span>
                    By{' '}
                    <span className="text-blue-600 ml-1">
                      {post.metadata.author}
                    </span>
                  </span>
                )}
              </div>
            </header>
            
            {/* Custom Tags */}
            {postTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {postTags.map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            
            <section
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </section>
    </div>
  );
};

export default BlogPostPage;