import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useMarkdownContent from '../hooks/useMarkdownContent';
import { formatDateAsDDMMYYYY, parseCustomDate } from '../utils/dateUtils';

const ExperienceCard = ({ post }) => {
  const points = (post.metadata?.summary || post.metadata?.description || '')
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'));

  return (
    <div className="flex flex-col md:flex-row items-start bg-white rounded-xl shadow-sm border mb-6 p-4">
      {/* Left: Organization Logo */}
      {post.metadata?.image && (
        <div className="w-full md:w-24 h-24 md:mr-4 mb-4 md:mb-0 flex-shrink-0">
          <img
            src={post.metadata.image}
            alt={`${post.metadata.company} logo`}
            className="w-full h-full object-contain rounded-md border"
            loading="lazy"
          />
        </div>
      )}

      {/* Right: Content Section */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900">
          {post.metadata.title || post.title}
        </h3>

        {post.metadata?.company && (
          <p className="text-sm font-medium text-gray-700 mb-1">
            {post.metadata.company}
          </p>
        )}

        {post.metadata?.date && (
          <p className="text-xs text-gray-500 mb-2">
            {formatDateAsDDMMYYYY(parseCustomDate(post.metadata.date))}
          </p>
        )}

        {/* Tags */}
        {post.metadata?.tag && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.metadata.tag.split(',').map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Bullet Summary */}
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {points.length > 0 ? (
            points.map((point, idx) => (
              <li key={idx}>{point.replace(/^[-•]\s*/, '')}</li>
            ))
          ) : (
            <li>No description provided</li>
          )}
        </ul>
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
    
    // Use the return value to avoid ESLint error
    document.body.style.display = '';
    
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

const ExperiencePage = () => {
  const { allContent: blogPosts, loading } = useMarkdownContent('experiences');

  const sortedPosts = Array.isArray(blogPosts)
    ? [...blogPosts].sort((a, b) => {
        const dateA = a.metadata?.date ? parseCustomDate(a.metadata.date) : new Date(0);
        const dateB = b.metadata?.date ? parseCustomDate(b.metadata.date) : new Date(0);
        return dateB - dateA;
      })
    : [];

  return (
    <BgWrapper>
      <div className="container mx-auto px-4 py-12 pt-28">
        <Helmet>
          <title>Experience | Md. Jahid Hassan</title>
          <meta name="description" content="Browse my professional experiences and insights." />
          <meta name="keywords" content="experience, work, projects, portfolio, Md. Jahid Hassan" />
        </Helmet>

        <div className="text-center mb-8">
          <h2 className="title mb-4">My <span>Experience</span></h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Explore my professional journey, projects, and experiences.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading experiences...</div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No experience posts available yet</h3>
            <p>Please check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPosts.map(post => (
              <ExperienceCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </BgWrapper>
  );
};

export default ExperiencePage;