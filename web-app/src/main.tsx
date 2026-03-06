import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'

import L from 'leaflet'

// Use copies in public/ so marker icons work in production (e.g. Netlify).
// Imported assets can get wrong paths after bundling; public URLs are stable.
const base = import.meta.env.BASE_URL
L.Icon.Default.mergeOptions({
  iconUrl: `${base}marker-icon.png`,
  iconRetinaUrl: `${base}marker-icon-2x.png`,
  shadowUrl: `${base}marker-shadow.png`,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
