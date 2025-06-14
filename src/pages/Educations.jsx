import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useMarkdownContent from '../hooks/useMarkdownContent';
import { formatDateAsMonthYear, parseCustomDate } from '../utils/dateUtils';

const EducationCard = ({ post }) => {
  const {
    title,
    date,               // Start date (required)
    endDate,            // Optional end date
    institution,
    department,
    result,
    image,
  } = post.metadata || {};

  const start = date ? formatDateAsMonthYear(parseCustomDate(date)) : '';
  const end = endDate ? formatDateAsMonthYear(parseCustomDate(endDate)) : 'Present';

  return (
    <div className="flex bg-white rounded-xl shadow-sm border p-6 mb-6 items-center space-x-6 hover:shadow-lg transition-shadow duration-200">
      {/* Left: Institution Logo */}
      {post.metadata?.image && (
        <div className="w-20 h-20 flex-shrink-0">
          <a 
            href={post.metadata?.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={image}
              alt={`${institution} logo`}
              className="w-full h-full object-contain border rounded-lg p-1"
              loading="lazy"
            />
          </a>
        </div>
      )}

      {/* Right: Info */}
      <div className="flex flex-col space-y-1 text-sm text-gray-800">
        {/* Dates */}
        {(start || end) && (
          <p className="text-xs text-gray-500">{start} - {end}</p>
        )}

        {/* Degree Title */}
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}

        {/* Institution Name */}
        {institution && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Institution:</span> {institution}
          </p>
        )}

        {/* Department */}
        {department && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Department:</span> {department}
          </p>
        )}

        {/* Result */}
        {result && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Result:</span> {result}
          </p>
        )}
      </div>
    </div>
  );
};

const EducationPage = () => {
  const { allContent: educationPosts, loading } = useMarkdownContent('education');

  useEffect(() => {
    document.body.classList.add('bg-light');
    return () => document.body.classList.remove('bg-light');
  }, []);

  const sortedPosts = [...educationPosts].sort((a, b) => {
    const dateA = a.metadata?.date ? parseCustomDate(a.metadata.date) : new Date(0);
    const dateB = b.metadata?.date ? parseCustomDate(b.metadata.date) : new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="bg-light min-h-screen">
      <div className="container mx-auto px-4 py-12 pt-28">
        <Helmet>
          <title>Education | Md. Jahid Hassan</title>
          <meta name="description" content="Explore the educational background of Md. Jahid Hassan." />
        </Helmet>

        <div className="text-center mb-8">
          <h2 className="title mb-4">My <span>Education</span></h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6">
            A brief overview of my academic background and achievements.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading education data...</div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No education records found</h3>
            <p>Education details will be updated soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPosts.map((post, index) => (
              <EducationCard key={index} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;
