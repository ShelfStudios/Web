import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sitemap: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="page-route px-6 py-20 max-w-4xl mx-auto">
      <div className="transition-fade">
        <h1 className="text-4xl font-serif italic text-white mb-4">Sitemap</h1>
        <p className="text-gray-400">Quick links to the site pages:</p>
        <ul className="mt-4 text-gray-300">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/terms">Terms</Link></li>
        </ul>
        <div className="mt-8">
          <Link to="/" className="text-accent">← Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
