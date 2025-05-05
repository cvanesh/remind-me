import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ActivityProvider } from './context/ActivityContext';
import { ThemeProvider } from './context/ThemeContext';

// Import the service worker registration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <ActivityProvider>
        <App />
      </ActivityProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Register the service worker for offline capabilities
serviceWorkerRegistration.register();
