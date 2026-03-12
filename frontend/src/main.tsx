// main.tsx - Retirez l'extension .tsx de l'import
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Supprimez le .tsx
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);