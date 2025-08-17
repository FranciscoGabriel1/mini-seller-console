import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ServiceProvider } from "./app/contexts/ServiceProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServiceProvider>
      <App />
    </ServiceProvider>
  </StrictMode>
)
