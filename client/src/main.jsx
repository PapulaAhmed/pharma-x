import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure App is imported correctly
// import './index.css'; // Ensure this is pointing to the right file




const root = ReactDOM.createRoot(document.getElementById('root')); // 'root' should match the id in your index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
