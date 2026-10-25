import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Google Maps Quota Defense Listener for Demo Key
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};
const origError = console.error;
console.error = (...args: unknown[]) => {
  const msg = args.map((a) => String(a)).join(' ');
  // Ignore harmless Firestore offline fallback notification when Secure Token API is unprovisioned
  if (
    msg.includes('token-service-api-has-not-been-used') ||
    msg.includes('securetoken.googleapis.com') ||
    (msg.includes('@firebase/firestore') && msg.includes('Could not reach Cloud Firestore backend'))
  ) {
    return;
  }
  origError.apply(console, args);
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

import { ErrorBoundary } from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);


