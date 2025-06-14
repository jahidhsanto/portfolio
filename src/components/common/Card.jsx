// src/components/common/Card.jsx
import React from 'react';

/**
 * Card component for displaying content in a card layout
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} [props.header] - Optional card header
 * @param {React.ReactNode} [props.footer] - Optional card footer
 * @param {boolean} [props.hover=false] - Whether to show hover effects
 * @param {string} [props.className] - Additional CSS classes
 */
const Card = ({
  children,
  header,
  footer,
  hover = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200';
  const hoverClasses = hover ? 'transition-transform hover:-translate-y-1 hover:shadow-md' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {header && <div className="border-b border-gray-200 p-4">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="border-t border-gray-200 p-4">{footer}</div>}
    </div>
  );
};

export default Card;