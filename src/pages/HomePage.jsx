// src/pages/HomePage.jsx
import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Projects from '../components/sections/Projects';
import Toolkit from '../components/sections/Toolkit';
import useMarkdownContent from '../hooks/useMarkdownContent';

const HomePage = () => {
  // Fetch hero content using the local markdown files
  const { 
    content: heroContent, 
    loading: heroLoading,
    error: heroError 
  } = useMarkdownContent('hero');
  
  // Fetch projects content
  const { 
    allContent: projects, 
    loading: projectsLoading,
    error: projectsError
  } = useMarkdownContent('projects');
  
  // Fetch about content
  const { 
    content: aboutContent, 
    loading: aboutLoading,
    error: aboutError 
  } = useMarkdownContent('about');
  
  // Fetch contact info
  const { 
    content: contactContent, 
    loading: contactLoading,
    error: contactError 
  } = useMarkdownContent('contact');

  // Debug information  
  console.log('Homepage loaded');
  console.log('Hero content:', heroContent);
  console.log('Hero loading:', heroLoading);
  console.log('Hero error:', heroError);
  
  console.log('Projects:', projects);
  console.log('Projects loading:', projectsLoading);
  console.log('Projects error:', projectsError);
  
  console.log('About content:', aboutContent);
  console.log('About loading:', aboutLoading);
  console.log('About error:', aboutError);
  
  console.log('Contact content:', contactContent);
  console.log('Contact loading:', contactLoading);
  console.log('Contact error:', contactError);

  return (
    <>
      <Helmet>
        <title>Md. Jahid Hassan | Software Engineer</title>
        <meta name="description" content="Md. Jahid Hassan - Software Engineer, Research Toolsmith, and Data Workflow Architect" />
      </Helmet>
      <Hero content={heroContent} loading={heroLoading} />
      <Projects projects={projects} loading={projectsLoading} />
      <Toolkit />
    </>
  );
};

export default HomePage;