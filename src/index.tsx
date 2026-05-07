import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import './index.css';

console.log('LASU 360 App Initializing...');

const mountApp = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error("Could not find root element '#root'");
        return;
    }

    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log('LASU 360 App Mounted Successfully');
    } catch (error) {
        console.error('Failed to mount LASU 360 App:', error);
        rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
            <h1>Initialization Error</h1>
            <p>The app failed to load. Please refresh or contact support.</p>
            <pre>${error}</pre>
        </div>`;
    }
};

mountApp();

/*
// Register Service Worker for PWA (Mobile App behavior)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW error', err));
  });
}
*/
