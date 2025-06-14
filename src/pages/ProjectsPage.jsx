import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
// Removed date-fns import since we're using a custom formatter
import useMarkdownContent from '../hooks/useMarkdownContent';
import { parseCustomDate } from '../utils/dateUtils';

// Custom date formatting function
const formatDateAsMonthDayYear = (date) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const ProjectCard = ({ project }) => {
  const projectSlug = project.id;
  const { title = project.title, image, summary, description, date, tag } = project.metadata || {};
  const dateString = date ? formatDateAsMonthDayYear(parseCustomDate(date)) : '';
  let category = '';
  if (tag) {
    const tagsArray = tag.split(',').map((t) => t.trim());
    category = tagsArray[0];
  }
  const excerpt = summary || description || (project.rawContent ? project.rawContent.substring(0, 150) + '...' : '');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover object-center"
        />
      )}
      <div className="p-5">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{dateString}</span>
          {category && <span>{category}</span>}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {excerpt}
        </p>
        <Link
          to={`/projects/${projectSlug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
};

const BgWrapper = ({ children }) => {
  useEffect(() => {
    if (!document.body.classList.contains('bg-light')) {
      document.body.classList.add('bg-light');
    }
    document.body.style.display = 'none';
    const reflow = document.body.offsetHeight;
    document.body.style.display = '';
    console.log('Background applied', reflow);
    return () => {
      document.body.classList.remove('bg-light');
    };
  }, []);
  return <div className="bg-light min-h-screen">{children}</div>;
};

const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [allTags, setAllTags] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [pageTitle, setPageTitle] = useState('Projects | Md. Jahid Hassan');

  const { allContent: projects, loading: projectsLoading } = useMarkdownContent('projects');

  useEffect(() => {
    if (activeTag) {
      setPageTitle(`${activeTag} Projects | Md. Jahid Hassan`);
    } else {
      setPageTitle('Projects | Md. Jahid Hassan');
    }
  }, [activeTag]);

  useEffect(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      const tagsSet = new Set();
      projects.forEach((proj) => {
        if (proj.metadata?.tag) {
          proj.metadata.tag.split(',').map((t) => t.trim()).forEach((t) => tagsSet.add(t));
        }
      });
      setAllTags(Array.from(tagsSet).sort());
      if (activeTag) {
        const filtered = projects.filter((proj) => {
          if (!proj.metadata?.tag) return false;
          const projTags = proj.metadata.tag.split(',').map((t) => t.trim());
          return projTags.includes(activeTag);
        });
        setFilteredProjects(filtered);
      } else {
        setFilteredProjects(projects);
      }
    } else {
      setFilteredProjects([]);
    }
  }, [projects, activeTag]);

  const handleTagClick = (tag) => {
    if (tag === activeTag) {
      setActiveTag('');
      setSearchParams({});
    } else {
      setActiveTag(tag);
      setSearchParams({ tag });
    }
  };

  const renderContent = () => {
    if (projectsLoading) {
      return (
        <div className="container mx-auto px-4 py-12 pt-28">
          <Helmet>
            <title>Loading Projects | Md. Jahid Hassan</title>
            <meta name="description" content="Browse my portfolio of projects and development work" />
          </Helmet>
          <div className="text-center mb-12">
            <h2 className="title mb-4">My <span>Projects</span></h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Explore the projects I've been working on
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const sorted = [...filteredProjects].sort((a, b) => {
      const dateA = a.metadata?.date ? parseCustomDate(a.metadata.date) : new Date(0);
      const dateB = b.metadata?.date ? parseCustomDate(b.metadata.date) : new Date(0);
      return dateB - dateA;
    });

    return (
      <div className="container mx-auto px-4 py-12 pt-28">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={
            activeTag
              ? `Explore my ${activeTag} projects and portfolio work`
              : 'Browse my portfolio of projects, applications, and development work'
          } />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={
            activeTag
              ? `Explore my ${activeTag} projects and portfolio work`
              : 'Browse my portfolio of projects, applications, and development work'
          } />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`https://digindominic.me/projects${activeTag ? `?tag=${activeTag}` : ''}`} />
          <meta property="og:image" content="https://i.imgur.com/qOGpTfu.jpeg" />
        </Helmet>
        <div className="text-center mb-8">
          <h2 className="title mb-4">My <span>Projects</span></h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6">
            Explore the projects I've been working on
          </p>
          {allTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTagClick(t)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${activeTag === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {t}
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
        {sorted.length === 0 ? (
          <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-lg p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            {activeTag ? (
              <>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  No projects found with tag: {activeTag}
                </h3>
                <p>Try selecting a different tag or clear the filter.</p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  No projects available yet
                </h3>
                <p>Check back soon for updates on my latest work!</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sorted.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return <BgWrapper>{renderContent()}</BgWrapper>;
};

export default ProjectsPage;
