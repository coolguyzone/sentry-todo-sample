import './instrument'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong (check Sentry).</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
