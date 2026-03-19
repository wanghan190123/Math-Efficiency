import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),

  // 截图保存
  saveScreenshot: (dataUrl: string) => ipcRenderer.invoke('save-screenshot', dataUrl),

  // 平台信息
  platform: process.platform,
})

// 类型定义
declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => void
      maximizeWindow: () => void
      closeWindow: () => void
      saveScreenshot: (dataUrl: string) => Promise<{ success: boolean; path?: string }>
      platform: string
    }
  }
}
