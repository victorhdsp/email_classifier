import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './app/components/shared/Toast/provider';

import App from './app/index';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
