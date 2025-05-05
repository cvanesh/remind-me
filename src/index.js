import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ActivityProvider } from './context/ActivityContext';
import { ThemeProvider } from './context/ThemeContext';
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

// Register service worker for PWA functionality
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
