// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/jahidhsanto', icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/jahidhsanto', icon: 'linkedin' },
    { name: 'Twitter', url: 'https://x.com/jahidhsanto', icon: 'twitter' },
  ];
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <div className="mb-8 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Portfolio
            </Link>
            <p className="text-gray-500 mt-2 text-sm">
              © {currentYear} Md. Jahid Hassan. All rights reserved.
            </p>
          </div>
          
          {/* Social links */}
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label={link.name}
              >
                {/* Simple icons for now, replace with proper react-icons later */}
                <span className="sr-only">{link.name}</span>
                <svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  {link.icon === 'github' && (
                    <path 
                      fillRule="evenodd" 
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                      clipRule="evenodd" 
                    />
                  )}
                  {link.icon === 'linkedin' && (
                    <path 
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" 
                    />
                  )}
                  {link.icon === 'twitter' && (
                    <path 
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
                    />
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-center md:text-left">
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link></li>
              <li><Link to="/projects" className="text-gray-500 hover:text-gray-900">Projects</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Technologies</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-500">React</span></li>
              <li><span className="text-gray-500">Tailwind CSS</span></li>
              <li><span className="text-gray-500">JavaScript</span></li>
              <li><span className="text-gray-500">GitHub API</span></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-gray-900 font-semibold mb-4">About This Site</h3>
            <p className="text-gray-500">
              This portfolio website is built with React and uses GitHub Issues as a CMS.
              Content is dynamically fetched from GitHub repository issues with specific labels.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;