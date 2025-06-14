import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Page Not Found | Md. Jahid Hassan</title>
        <meta name="description" content="The page you are looking for doesn't exist or has been moved." />
      </Helmet>
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;