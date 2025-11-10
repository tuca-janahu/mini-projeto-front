import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
  const { setupWorker } = await import('msw/browser')
  const { handlers } = await import('./mocks/handlers')
  const worker = setupWorker(...handlers)
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
  })
  console.info('[MSW] ativo (dev)')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
