import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/shared/components/views/Entrypoint'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
