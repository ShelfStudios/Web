
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './src/Layout';
import Home from './src/pages/Home';
import Privacy from './src/pages/Privacy';
import Terms from './src/pages/Terms';
import Sitemap from './src/pages/Sitemap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/sitemap" element={<Layout><Sitemap /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;