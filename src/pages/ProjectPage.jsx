// src/pages/ProjectPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/common/Loader';
import useMarkdownContent from '../hooks/useMarkdownContent';

const ProjectPage = () => {
  const { id } = useParams(); // This is now the project slug from the URL
  const navigate = useNavigate();
  const [projectTags, setProjectTags] = useState([]);
  const [isValidProject, setIsValidProject] = useState(null);

  // Fetch the specific project using the id/slug from the URL
  const { 
    content: project, 
    loading: projectLoading, 
    error: projectError 
  } = useMarkdownContent('projects', id);

  // Fetch all projects to verify that the current project exists in the projects list
  const { 
    allContent: allProjects, 
    loading: allProjectsLoading 
  } = useMarkdownContent('projects');

  // Comprehensive validation function
  const validateProject = useCallback(() => {
    // If still loading, don't make a determination yet
    if (projectLoading || allProjectsLoading) {
      return null;
    }

    // Check if project exists and is in the projects list
    if (!project) {
      console.log('No project found');
      return false;
    }

    // Ensure all projects are loaded and an array
    const projectIds = Array.isArray(allProjects) ? allProjects.map(p => p.id) : [];
    
    // Check if the current project ID is in the list of project IDs
    const isValidProject = projectIds.includes(id);
    
    console.log('Project Validation checks:', {
      projectExists: !!project,
      projectInList: isValidProject,
      projectIds,
      currentId: id
    });

    return isValidProject;
  }, [project, allProjects, id, projectLoading, allProjectsLoading]);

  // Effect to validate project and handle navigation
  useEffect(() => {
    const valid = validateProject();
    
    // Set validation state
    if (valid !== null) {
      setIsValidProject(valid);
    }
  }, [validateProject]);

  // Navigation effect
  useEffect(() => {
    // Only navigate if we've completed loading and determined project is invalid
    if (isValidProject === false && !projectLoading && !allProjectsLoading) {
      console.log('Navigating to not-found page');
      navigate('/not-found');
    }
  }, [isValidProject, projectLoading, allProjectsLoading, navigate]);

  // Process tags
  useEffect(() => {
    if (project && project.metadata?.tag) {
      const tags = project.metadata.tag.split(',').map(tag => tag.trim());
      setProjectTags(tags);
    } else {
      setProjectTags([]);
    }
  }, [project]);

  // Loading state
  if (projectLoading || allProjectsLoading || isValidProject === null) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20">
        <section className="container mx-auto px-4 py-12">
          <Helmet>
            <title>Loading Project | Md. Jahid Hassan</title>
            <meta name="description" content="Loading project details..." />
          </Helmet>
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" color="gray" />
          </div>
        </section>
      </div>
    );
  }

  // Error or invalid project state
  if (projectError || !project || isValidProject === false) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20">
        <section className="container mx-auto px-4 py-12">
          <Helmet>
            <title>Project Not Found | Md. Jahid Hassan</title>
            <meta name="description" content="The requested project could not be found." />
          </Helmet>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the project you're looking for.</p>
            <Link to="/projects" className="text-gray-900 hover:underline">
              ← Back to Projects
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <section className="container mx-auto px-4 py-12">
        <Helmet>
          <title>{`${project.metadata.title || 'Project'} | Md. Jahid Hassan`}</title>
          <meta
            name="description"
            content={project.metadata?.summary || (project.content && project.content.substring(0, 160)) || 'View this project on Md. Jahid Hassan\'s Portfolio Website.'}
          />
          <meta
            name="keywords"
            content={`project, portfolio, ${projectTags.join(', ')}`}
          />
          <meta name="author" content="Md. Jahid Hassan" />
          {/* Open Graph Tags */}
          <meta property="og:title" content={project.metadata.title} />
          <meta
            property="og:description"
            content={project.metadata?.summary || (project.content && project.content.substring(0, 160)) || 'View this project on Md. Jahid Hassan\'s Portfolio Website.'}
          />
          <meta property="og:image" content={project.metadata?.image || 'https://digindominic.me/default-image.jpg'} />
          <meta property="og:url" content={`https://digindominic.me/projects/${id}`} />
          <meta property="og:type" content="article" />
          {/* Structured Data */}
          <script type="application/ld+json">{`
            {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": "${project.metadata.title}",
              "description": "${project.metadata?.summary || ''}",
              "image": "${project.metadata?.image || 'https://digindominic.me/default-image.jpg'}",
              "author": {
                "@type": "Person",
                "name": "Md. Jahid Hassan"
              },
              "keywords": "${projectTags.join(', ')}",
              "url": "https://digindominic.me/projects/${id}"
            }
          `}</script>
        </Helmet>

        <Link to="/projects" className="inline-flex items-center text-gray-900 hover:underline mb-12">
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
          Back to Projects
        </Link>

        <article className="card max-w-4xl mx-auto">
          {project.metadata?.image && (
            <figure className="mb-8 -mx-6 -mt-8 overflow-hidden rounded-t-lg">
              <img
                src={project.metadata.image}
                alt={project.metadata.title}
                className="w-full h-auto object-contain object-center"
                loading="lazy"
              />
            </figure>
          )}
          <header>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{project.metadata.title}</h1>
          </header>
          
          {/* Custom Tags */}
          {projectTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {projectTags.map((tag, index) => (
                <Link 
                  key={index}
                  to={`/projects?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* Project Links */}
          {project.metadata && (project.metadata.demo || project.metadata.github || project.metadata.video) && (
            <div className="flex flex-wrap gap-4 mb-8">
              {project.metadata.demo && (
                <a
                  href={project.metadata.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                      Live Demo
                    </span>
                </a>
              )}
              {project.metadata.github && (
                <a
                  href={project.metadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                      View Code
                    </span>
                </a>
              )}
              {project.metadata.video && (
                <a
                  href={project.metadata.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                      Short Video
                      </span>
                </a>
              )}
            </div>
          )}
          <section
            className="text-gray-700 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </article>
      </section>
    </div>
  );
};

export default ProjectPage;