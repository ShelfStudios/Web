import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// In development React.StrictMode intentionally mounts components twice
// which can cause animations and effects to run twice. Disable StrictMode
// during development to avoid double-play while keeping it enabled in production.
if (import.meta.env && import.meta.env.DEV) {
  root.render(<App />);
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}