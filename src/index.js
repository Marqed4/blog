// Entry point: applies the saved theme, then mounts <App> inside the router.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.js';
import { BrowserRouter } from "react-router-dom";
import { applyTheme, loadTheme } from './theme.js';

// Apply the saved colors before React renders so there is no flash of the defaults.
applyTheme(loadTheme());

const root = ReactDOM.createRoot(document.getElementById('root'));
// StrictMode adds extra dev-time checks; BrowserRouter enables URL-based routing
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
