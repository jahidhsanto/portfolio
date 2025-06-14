import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import * as brandIcons from '@fortawesome/free-brands-svg-icons';
import useMarkdownContent from '../../hooks/useMarkdownContent';

// Define skill categories
const DEFAULT_SKILL_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps' },
  { id: 'datascience', label: 'Data Science' },
  { id: 'tools', label: 'Tools & IDEs' }
];

// Skill Tag Component - Shows tooltip on hover
const SkillTag = ({ skill }) => {
  // Get the appropriate icon
  const getIcon = (iconName) => {
    // Try to find in brand icons first (fa-brands)
    if (brandIcons[iconName]) {
      return brandIcons[iconName];
    }
    // Then try in solid icons (fa-solid)
    if (solidIcons[iconName]) {
      return solidIcons[iconName];
    }
    // Default to code icon if not found
    return solidIcons.faCode;
  };

  // Calculate level description based on skill level
  const getLevelDescription = (level) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Proficient";
    if (level >= 50) return "Intermediate";
    return "Beginner";
  };

  const icon = getIcon(skill.icon);

  return (
    <div className="group relative px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
      {/* Static visible content */}
      <div className="flex items-center">
        <div className="text-primary text-lg">
          <FontAwesomeIcon icon={icon} />
        </div>
        <span className="ml-2 font-medium text-sm">{skill.name}</span>
      </div>
      
      {/* Tooltip that appears on hover */}
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 text-sm">
          <div className="flex items-center mb-2">
            <div className="text-primary text-lg">
              <FontAwesomeIcon icon={icon} />
            </div>
            <span className="ml-2 font-semibold">{skill.name}</span>
          </div>
          
          <div className="mb-2 flex justify-between">
            <span className="text-gray-600 text-xs">{skill.experience}</span>
            <span className="text-primary text-xs font-medium">{getLevelDescription(skill.level)}</span>
          </div>
          
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {skill.categories && skill.categories.map(category => (
              <span 
                key={category} 
                className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
          
          {/* Arrow pointing down */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

const Toolkit = () => {
  // Fetch skills data from markdown content
  const { content: toolkitContent, loading } = useMarkdownContent('toolkit', 'skills');
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState('all');
  
  // State for skills and categories
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_SKILL_CATEGORIES);

  // When content loads, extract the skills data
  useEffect(() => {
    if (toolkitContent && toolkitContent.metadata && toolkitContent.metadata.skills) {
      setSkills(toolkitContent.metadata.skills);
      
      // Extract unique categories from the skills
      if (toolkitContent.metadata.skills.length > 0) {
        const uniqueCategories = new Set(['all']);
        
        toolkitContent.metadata.skills.forEach(skill => {
          if (skill.categories && Array.isArray(skill.categories)) {
            skill.categories.forEach(cat => uniqueCategories.add(cat));
          }
        });
        
        // Convert to array of category objects
        const categoryArray = Array.from(uniqueCategories).map(cat => {
          if (cat === 'all') {
            return { id: 'all', label: 'All' };
          }
          // Capitalize first letter for label
          return { 
            id: cat, 
            label: cat.charAt(0).toUpperCase() + cat.slice(1) 
          };
        });
        
        setCategories(categoryArray);
      }
    }
  }, [toolkitContent]);
  
  // Filter skills based on active category
  const filteredSkills = skills.filter(skill => {
    return activeCategory === 'all' || 
      (skill.categories && skill.categories.includes(activeCategory));
  });

  // Group skills by categories for better organization (when showing all)
  const groupedSkills = () => {
    if (activeCategory !== 'all') {
      return { 'Filtered Skills': filteredSkills };
    }
    
    const groups = {};
    categories.forEach(category => {
      if (category.id !== 'all') {
        const categorySkills = skills.filter(skill => 
          skill.categories && skill.categories.includes(category.id)
        );
        if (categorySkills.length > 0) {
          groups[category.label] = categorySkills;
        }
      }
    });
    return groups;
  };

  if (loading) {
    return (
      <section className="section-alt py-16" id="toolkit">
        <div className="container mx-auto px-4 relative">
          <div className="section-header text-center mb-12 relative z-10">
            <span className="subtitle mb-3">My Expertise</span>
            <h2 className="title mb-4">Tech <span>Toolkit</span></h2>
            <p className="description mx-auto">Loading skills...</p>
          </div>
          <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="px-3 py-2 bg-gray-100 rounded-lg h-10"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-alt py-16" id="toolkit">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full -ml-40 -mb-40"></div>
        
        <div className="section-header text-center mb-12 relative z-10">
          <span className="subtitle mb-3">{toolkitContent?.metadata?.subtitle || 'My Expertise'}</span>
          <h2 className="title mb-4">Tech <span>Toolkit</span></h2>
          <p className="description mx-auto">
            {toolkitContent?.metadata?.description || 
             'The technologies and tools I use to build powerful, scalable, and efficient applications'}
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          {/* Category selector - horizontal scrollable on mobile */}
          <div className="flex overflow-x-auto pb-2 max-w-full">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => {
                const count = category.id === 'all' 
                  ? skills.length 
                  : skills.filter(skill => skill.categories && skill.categories.includes(category.id)).length;
                  
                return (
                  <button
                    key={category.id}
                    className={`category-btn whitespace-nowrap ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label}
                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full inline-flex items-center justify-center ${
                      activeCategory === category.id 
                        ? 'bg-white text-primary' 
                        : 'bg-gray-100 text-text-light'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Skills List - Grouped by category when showing all */}
        {Object.entries(groupedSkills()).map(([groupTitle, skills]) => (
          <div key={groupTitle} className="mb-8">
            {/* Only show group title if there are multiple groups */}
            {Object.keys(groupedSkills()).length > 1 && (
              <h3 className="text-lg font-medium text-gray-700 mb-3 border-b border-gray-200 pb-2">
                {groupTitle}
              </h3>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {skills.map(skill => (
                <SkillTag 
                  key={skill.name} 
                  skill={skill}
                />
              ))}
            </div>
          </div>
        ))}
        
        {filteredSkills.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="bg-light p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={solidIcons.faTools} className="text-primary/60 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-dark">No skills match your criteria</h3>
            <p className="text-text-light max-w-md mx-auto">
              Try selecting a different category or adjusting your search term.
            </p>
          </div>
        )}
        
        {toolkitContent && toolkitContent.content && (
          <div className="mt-16 prose max-w-none mx-auto">
            <div dangerouslySetInnerHTML={{ __html: toolkitContent.content }} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Toolkit;