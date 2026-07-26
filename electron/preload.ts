import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  saveScreenshot: (dataUrl: string) => ipcRenderer.invoke('save-screenshot', dataUrl),

  platform: process.platform,

  getQuestionsDir: () => ipcRenderer.invoke('get-questions-dir'),
  readQuestions: () => ipcRenderer.invoke('read-questions'),
  openQuestionsFolder: () => ipcRenderer.invoke('open-questions-folder'),
  importQuestions: () => ipcRenderer.invoke('import-questions'),

  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  getDoubaoPath: () => ipcRenderer.invoke('get-doubao-path'),
  selectDoubaoPath: () => ipcRenderer.invoke('select-doubao-path'),
  sendToDoubao: (question: string, imageDataUrl?: string) => 
    ipcRenderer.invoke('send-to-doubao', question, imageDataUrl),
})

declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      saveScreenshot: (dataUrl: string) => Promise<{ success: boolean; path?: string }>
      platform: string
      getQuestionsDir: () => Promise<string>
      readQuestions: () => Promise<{ success: boolean; questions: any[]; error?: string }>
      openQuestionsFolder: () => Promise<{ success: boolean }>
      importQuestions: () => Promise<{ success: boolean; imported: number }>
      captureScreen: () => Promise<{ success: boolean; dataUrl?: string; error?: string }>
      getDoubaoPath: () => Promise<{ success: boolean; path?: string }>
      selectDoubaoPath: () => Promise<{ success: boolean; path?: string }>
      sendToDoubao: (question: string, imageDataUrl?: string) => 
        Promise<{ success: boolean; response?: string; error?: string }>
    }
  }
}
