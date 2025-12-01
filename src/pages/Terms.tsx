import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <div className="page-route px-6 py-20 max-w-4xl mx-auto">
      <div className="transition-fade">
        <h1 className="text-4xl font-serif italic text-white mb-4">Terms</h1>
        <p className="text-gray-400">This is the Terms page for ShelfStudios. Add your site terms and conditions here.</p>
        <div className="mt-8">
          <Link to="/" className="text-accent">← Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
