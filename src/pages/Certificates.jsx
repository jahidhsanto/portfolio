import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useMarkdownContent from '../hooks/useMarkdownContent';
import { formatDateAsDDMMYYYY, parseCustomDate } from '../utils/dateUtils';

// CertificateCard stays the same as in your latest code

const CertificateCard = ({ post }) => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const formattedDate = formatDateAsDDMMYYYY(parseCustomDate(post.metadata.date));

  return (
    <>
      <div className="bg-white border p-4 rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-200">
        {post.metadata?.image && (
          <div className="relative w-full aspect-[4/3] cursor-pointer mb-4" onClick={() => setPreviewOpen(true)}>
            <img
              src={post.metadata.image}
              alt={`${post.metadata.title} certificate`}
              className="absolute inset-0 w-full h-full object-contain rounded-md border"
              loading="lazy"
            />
          </div>
        )}

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{post.metadata.title}</h3>
          <p className="text-sm text-gray-600">{post.metadata.issuer}</p>
          {post.metadata?.date && (
            <p className="text-xs text-gray-500 mb-2">{formattedDate}</p>
          )}

          {post.metadata?.link && (
            <a
              href={post.metadata.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition"
            >
              Verify Certificate
            </a>
          )}
        </div>
      </div>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={post.metadata.image}
            alt="Certificate Full Preview"
            className="max-h-[90vh] max-w-full rounded-lg shadow-lg border"
          />
        </div>
      )}
    </>
  );
};

const CertificatePage = () => {
  const { allContent: certificates, loading } = useMarkdownContent('certificate');

  const sortedCertificates = Array.isArray(certificates)
    ? [...certificates].sort((a, b) => {
        const dateA = parseCustomDate(a.metadata?.date);
        const dateB = parseCustomDate(b.metadata?.date);
        return dateB - dateA;
      })
    : [];

  // Group by category
  const groupedByCategory = sortedCertificates.reduce((acc, cert) => {
    const category = cert.metadata?.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(cert);
    return acc;
  }, {});

  return (
    <div className="bg-light min-h-screen">
      <div className="container mx-auto px-4 py-12 pt-28">
        <Helmet>
          <title>Certificates | Md. Jahid Hassan</title>
          <meta name="description" content="Browse my professional certifications." />
        </Helmet>

        <div className="text-center mb-8">
          <h2 className="title mb-4">My <span>Certificates</span></h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Here are the certifications I’ve earned in my career.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading certificates...</div>
        ) : sortedCertificates.length === 0 ? (
          <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No certificates available</h3>
            <p>Please check back later.</p>
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([category, certs]) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {certs.map(post => (
                  <CertificateCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificatePage;
