import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { parseCustomDate, formatDateAsDDMMYYYY } from '../../utils/dateUtils';

// Individual slide component
const ProjectSlide = ({ project, isActive }) => {
  // Extract the ID from the project
  const projectId = project.id || project.slug || project.number;
  
  // Get summary text with increased character limit
  const summaryText = project.metadata?.summary || project.metadata?.description ||
    (project.rawContent && project.rawContent.substring(0, 450) + '...');

  return (
    <div 
      className={`project-slide absolute inset-0 transition-opacity duration-700 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      <div className="flex flex-col md:flex-row h-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        {/* Image Section */}
        <div className="md:w-1/2 relative">
          {project.metadata?.image ? (
            <div className="h-72 md:h-full flex items-center justify-center bg-gray-50">
              <img
                src={project.metadata.image}
                alt={project.title || project.metadata?.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-72 md:h-full bg-gradient-to-r from-primary/10 to-accent/30 flex items-center justify-center">
              <svg className="w-24 h-24 text-primary/50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Tags overlay */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
            {project.metadata?.tag && 
              project.metadata.tag.split(',').map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-primary border border-primary/20 shadow-sm"
                >
                  {tag.trim()}
                </span>
              ))
            }
          </div>
        </div>
        
        {/* Content Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="mb-2">
            {project.metadata?.date && (
              <p className="text-sm text-primary font-medium mb-1">
                {formatDateAsDDMMYYYY(parseCustomDate(project.metadata.date))}
              </p>
            )}
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-dark">
              {project.title || project.metadata?.title}
            </h3>
          </div>

          <div className="prose prose-sm text-text-light mb-6 overflow-y-auto max-h-[300px] md:max-h-[250px] custom-scrollbar">
            <p>{summaryText}</p>
          </div>

          <div className="mt-auto">
            <Link
              to={`/projects/${projectId}`}
              className="button-primary inline-flex items-center group"
            >
              View Project Details
              <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = ({ projects, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  
  // Get sorted projects
  const getSortedProjects = useCallback(() => {
    // Make sure projects is an array before mapping over it
    const projectsArray = Array.isArray(projects) ? projects : [];
    
    // Sort projects by date (newest first) and filter featured only
    return [...projectsArray]
      .filter(project => project.metadata?.featured === 'yes')
      .sort((a, b) => {
        const dateA = a.metadata?.date ? parseCustomDate(a.metadata.date) : new Date(0);
        const dateB = b.metadata?.date ? parseCustomDate(b.metadata.date) : new Date(0);
        return dateB - dateA;
      })
      .slice(0, 6); // Limit to 6 featured projects
  }, [projects]);
  
  const sortedProjects = getSortedProjects();
  
  // Handle auto-rotation
  useEffect(() => {
    if (loading || sortedProjects.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex(current => (current + 1) % sortedProjects.length);
    }, 6000); // Change slide every 6 seconds
    
    return () => clearInterval(interval);
  }, [loading, sortedProjects.length, isPaused]);
  
  // Navigation controls
  const goToSlide = (index) => {
    setActiveIndex(index);
    // Temporarily pause auto-rotation when manually navigating
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };
  
  const goToPrevSlide = () => {
    const newIndex = activeIndex === 0 ? sortedProjects.length - 1 : activeIndex - 1;
    goToSlide(newIndex);
  };
  
  const goToNextSlide = () => {
    const newIndex = (activeIndex + 1) % sortedProjects.length;
    goToSlide(newIndex);
  };
  
  // Touch events for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go next
        goToNextSlide();
      } else {
        // Swipe right, go previous
        goToPrevSlide();
      }
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="subtitle mb-4">My Work</span>
            <h2 className="title mb-4">Featured Projects</h2>
            <p className="description mx-auto text-center max-w-2xl">Explore the projects I've been working on</p>
          </div>
          
          {/* Loading skeleton for slideshow */}
          <div className="relative h-[600px] bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 bg-gray-200 h-72 md:h-full"></div>
              <div className="md:w-1/2 p-8">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-40 mt-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-light relative" id="projects">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mb-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <span className="subtitle mb-4">My Work</span>
          <h2 className="title mb-4">Featured <span>Projects</span></h2>
          <p className="description mx-auto text-center max-w-2xl">Explore the creative solutions and innovative projects I've been working on</p>
        </div>

        {sortedProjects.length === 0 ? (
          <div className="text-center text-gray-500 bg-white border border-gray-200 rounded-xl p-12 shadow-sm max-w-2xl mx-auto">
            <div className="bg-light p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-dark">No projects available yet</h3>
            <p className="text-text-light max-w-md mx-auto">I'm currently working on some exciting new projects. Check back soon for updates on my latest work!</p>
          </div>
        ) : (
          <>
            {/* Slideshow container with touch events */}
            <div 
              className="relative h-[600px] mx-auto max-w-5xl rounded-xl overflow-hidden shadow-xl" 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides */}
              {sortedProjects.map((project, index) => (
                <ProjectSlide 
                  key={project.id || project.slug || index} 
                  project={project} 
                  isActive={index === activeIndex} 
                />
              ))}
              
              {/* Navigation arrows */}
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 text-primary p-2 rounded-full hover:bg-white hover:text-secondary transition-colors shadow-md"
                onClick={goToPrevSlide}
                aria-label="Previous project"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 text-primary p-2 rounded-full hover:bg-white hover:text-secondary transition-colors shadow-md"
                onClick={goToNextSlide}
                aria-label="Next project"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              {/* Indicator dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {sortedProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeIndex 
                        ? 'bg-primary w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* View all projects button */}
            <div className="mt-12 text-center">
              <Link
                to="/projects"
                className="button-secondary group"
              >
                View All Projects
                <svg className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </section>
  );
};

export default Projects;