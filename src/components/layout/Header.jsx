// src/components/layout/Header.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Educations', path: '/educations' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Certificate', path: '/certificates' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add scroll effect listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white/95 fixed w-full top-0 z-50 shadow-sm transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-8">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary relative">
            Md. Jahid Hassan
            <span className="absolute w-1.5 h-1.5 rounded-full bg-accent -bottom-0.5 -right-3"></span>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`font-medium relative py-2 transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'text-primary nav-link-active' 
                      : 'text-text hover:text-secondary'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Contact Button */}
          <Link to="/about" className="hidden md:block contact-btn">
            Contact Me
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-text focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-4 rounded-md transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-gray-100 text-primary font-medium' 
                      : 'text-text-light hover:bg-gray-100 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/about"
                className="contact-btn mt-2 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Me
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;