import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Use createRoot instead of render

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
