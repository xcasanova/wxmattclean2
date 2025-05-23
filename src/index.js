import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

Amplify.configure(awsconfig);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Use createRoot instead of render

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
