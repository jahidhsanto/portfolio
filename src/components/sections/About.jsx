import React from 'react';

// YouTube Video Component
const YouTubeVideo = ({ videoId, title = "YouTube video player" }) => {
  if (!videoId) return null;
  return (
    <div className="video-container">
      <div className="relative w-full pb-[56.25%]">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const About = ({ content, loading }) => {
  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3 animate-pulse">
              <div className="bg-gray-200 h-80 w-full rounded-lg"></div>
            </div>
            <div className="lg:w-2/3 animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!content) {
    return (
      <section className="py-8" id="about">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 text-center">About content is not available. Please check the content directory.</p>
        </div>
      </section>
    );
  }

  // Extract metadata from content
  const { metadata } = content;
  
  // Set up defaults and extract values
  const title = metadata?.title || 'About Me';
  const image = metadata?.image;
  const skills = metadata?.skills || [];
  const skillsArray = typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : Array.isArray(skills) ? skills : [];
  const hasYouTubeVideo = Boolean(metadata?.youtubeId);

  return (
    <section className="py-8" id="about">
      <div className="container mx-auto px-4">
        {/* Hero Media Section - Only Profile Image */}
        {image && (
          <div className="mb-12 text-center">
            <img
              src={image}
              alt={metadata?.name || 'Profile'}
              className="rounded-lg shadow-lg w-full max-w-md mx-auto h-[450px] object-cover border border-gray-200"
            />
          </div>
        )}

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Main Text */}
          <div className="lg:col-span-2">
            {!content.content.includes('<h1>About Me</h1>') && (
              <h2 className="text-4xl font-bold mb-6 text-gray-900">{title}</h2>
            )}
            {(content.content) ? (
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            ) : (
              <p className="text-gray-600">No content available for the About section.</p>
            )}
          </div>

          {/* Right Column: Skills, Education, Contact */}
          <div className="lg:col-span-1 space-y-8">
            {/* Skills */}
            {skillsArray.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skillsArray.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education with YouTube Video */}
            {hasYouTubeVideo && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Education</h3>
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-800">
                    {metadata?.youtubeTitle || 'Masters Graduation Video'}
                  </h4>
                  <YouTubeVideo
                    videoId={metadata.youtubeId}
                    title={metadata?.youtubeTitle || 'Masters Graduation Video'}
                  />
                </div>
              </div>
            )}

            {/* Contact Information */}
            {(metadata?.email || metadata?.phone || metadata?.location || metadata?.languages) && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h3>
                <ul className="space-y-3 text-gray-700">
                  {metadata?.email && (
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${metadata.email}`} className="hover:text-blue-600 transition-colors">
                        {metadata.email}
                      </a>
                    </li>
                  )}
                  {metadata?.phone && (
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${metadata.phone}`} className="hover:text-blue-600 transition-colors">
                        {metadata.phone}
                      </a>
                    </li>
                  )}
                  {metadata?.location && (
                    <li className="flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{metadata.location}</span>
                    </li>
                  )}
                  {metadata?.languages && (
                    <li className="flex items-center">
    <svg
      className="h-6 w-6 mr-2"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Letter A (English) */}
      <text x="12" y="44" fontSize="36" fontWeight="bold" fill="#4A5568" fontFamily="Arial, sans-serif">
        A
      </text>
      {/* Letter অ (Bangla) */}
      <text x="32" y="44" fontSize="36" fontWeight="bold" fill="#2B6CB0" fontFamily="Bangla, sans-serif">
        অ
      </text>
    </svg>
                      <span>{metadata.languages}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;