// src/components/common/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button component that can be rendered as a button or a link
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {string} [props.href] - If provided, button renders as a link to this URL
 * @param {string} [props.to] - If provided, button renders as a React Router Link
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  to,
  children,
  className = '',
  ...props
}) => {
  // Base classes for all button variants
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
  
  // Classes for different variants
  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    text: 'text-gray-900 hover:text-gray-700 hover:underline'
  };
  
  // Classes for different sizes
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].join(' ');
  
  // If href is provided, render as an anchor tag
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // If to is provided, render as a React Router Link
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  // Otherwise, render as a button
  return (
    <button
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;