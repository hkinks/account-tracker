import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your root App component

// Assuming you have an element with the ID 'root' in your index.html
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Initial render: Render an element to the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to enable Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept();
}