import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isQuestionnaire =
  import.meta.env.DEV && path === '/questionnaire'

async function boot() {
  let Page: ComponentType = App
  if (isQuestionnaire) {
    const mod = await import('./pages/GuideQuestionnaire.tsx')
    Page = mod.GuideQuestionnaire
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
}

void boot()
