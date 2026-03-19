/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}

interface Window {
  electronAPI?: {
    minimizeWindow: () => void
    maximizeWindow: () => void
    closeWindow: () => void
    saveScreenshot: (dataUrl: string) => Promise<{ success: boolean; path?: string }>
    platform: string
  }
}
