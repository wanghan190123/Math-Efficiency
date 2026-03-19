import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#F4E4BC',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  })

  // 开发环境
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5174')
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC 处理器

// 最小化窗口
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize()
})

// 最大化/还原窗口
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

// 关闭窗口
ipcMain.on('window-close', () => {
  mainWindow?.close()
})

// 保存截图
ipcMain.handle('save-screenshot', async (_, dataUrl: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    title: '保存截图',
    defaultPath: `math-efficiency-${Date.now()}.png`,
    filters: [{ name: 'PNG 图片', extensions: ['png'] }],
  })

  if (!result.canceled && result.filePath) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
    fs.writeFileSync(result.filePath, base64Data, 'base64')
    return { success: true, path: result.filePath }
  }
  return { success: false }
})
