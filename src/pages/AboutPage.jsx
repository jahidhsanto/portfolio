import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import About from '../components/sections/About';
import useMarkdownContent from '../hooks/useMarkdownContent';

// Wrapper component to handle the background color
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

const AboutPage = () => {
  const { 
    content: aboutContent, 
    loading: aboutLoading,
    error
  } = useMarkdownContent('about');
  
  // Debug errors
  useEffect(() => {
    if (error) {
      console.error('Error loading about content:', error);
    }
  }, [error]);

  // Debug aboutContent
  useEffect(() => {
    if (aboutContent) {
      console.log('About content ready for rendering:', aboutContent);
    }
  }, [aboutContent]);

  return (
    <BgWrapper>
      <Helmet>
        <title>About Me | Md. Jahid Hassan</title>
        <meta name="description" content="Learn about Md. Jahid Hassan - my background, skills, and experience as a software engineer." />
      </Helmet>
      <div className="pt-28">
        <header className="container mx-auto px-4 text-center mb-1">
          <h1 className="title mb-4">About <span>Me</span></h1>
          <p className="max-w-2xl mx-auto text-gray-600 mb-1">Get to know more about my background and experience</p>
        </header>
        <About content={aboutContent} loading={aboutLoading} />
      </div>
    </BgWrapper>
  );
};

export default AboutPage;