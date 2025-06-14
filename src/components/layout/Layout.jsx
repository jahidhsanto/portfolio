// src/components/layout/Layout.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Helmet>
        <link rel="icon" href="https://raw.githubusercontent.com/digin1/web-images/refs/heads/main/favicon.ico" />
        {/* You can also add these for better cross-platform support */}
        <link rel="apple-touch-icon" href="https://raw.githubusercontent.com/digin1/web-images/refs/heads/main/apple-touch-icon.png" />
        <link rel="shortcut icon" href="https://raw.githubusercontent.com/digin1/web-images/refs/heads/main/favicon.ico" />
      </Helmet>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;