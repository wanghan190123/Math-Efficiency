import { app, BrowserWindow, ipcMain, dialog, shell, clipboard, nativeImage } from 'electron'
import { desktopCapturer } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let mainWindow: BrowserWindow | null = null

const QUESTIONS_DIR = path.join(app.getPath('userData'), 'questions')
const CONFIG_FILE = path.join(app.getPath('userData'), 'ai-config.json')

interface AIConfig {
  doubaoPath?: string
}

function loadConfig(): AIConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Failed to load config:', error)
  }
  return {}
}

function saveConfig(config: AIConfig) {
  try {
    const configDir = path.dirname(CONFIG_FILE)
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
    console.log('[AI] Config saved successfully to:', CONFIG_FILE)
  } catch (error) {
    console.error('Failed to save config:', error)
  }
}

function ensureQuestionsDir() {
  if (!fs.existsSync(QUESTIONS_DIR)) {
    fs.mkdirSync(QUESTIONS_DIR, { recursive: true })
  }
}

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

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5174')
    mainWindow.webContents.openDevTools()
  } else {
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

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize()
})

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.on('window-close', () => {
  mainWindow?.close()
})

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

ipcMain.handle('get-questions-dir', () => {
  ensureQuestionsDir()
  return QUESTIONS_DIR
})

ipcMain.handle('read-questions', async () => {
  ensureQuestionsDir()
  
  const questions: any[] = []
  
  try {
    const files = fs.readdirSync(QUESTIONS_DIR)
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(QUESTIONS_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        try {
          const data = JSON.parse(content)
          if (Array.isArray(data)) {
            questions.push(...data)
          } else if (data.questions && Array.isArray(data.questions)) {
            questions.push(...data.questions)
          }
        } catch (parseError) {
          console.warn(`Failed to parse ${file}:`, parseError)
        }
      }
    }
    
    return { success: true, questions }
  } catch (error) {
    console.error('Failed to read questions:', error)
    return { success: false, questions: [], error: String(error) }
  }
})

ipcMain.handle('open-questions-folder', async () => {
  ensureQuestionsDir()
  await shell.openPath(QUESTIONS_DIR)
  return { success: true }
})

ipcMain.handle('import-questions', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: '导入题库文件',
    filters: [{ name: 'JSON 文件', extensions: ['json'] }],
    properties: ['multiSelections']
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    ensureQuestionsDir()
    
    let imported = 0
    for (const srcPath of result.filePaths) {
      const fileName = path.basename(srcPath)
      const destPath = path.join(QUESTIONS_DIR, fileName)
      
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath)
        imported++
      }
    }
    
    return { success: true, imported }
  }
  
  return { success: false, imported: 0 }
})

ipcMain.handle('capture-screen', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    })
    
    if (sources.length > 0) {
      const thumbnail = sources[0].thumbnail
      const dataUrl = thumbnail.toDataURL()
      return { success: true, dataUrl }
    }
    
    return { success: false, error: 'No screen source found' }
  } catch (error) {
    console.error('Capture screen failed:', error)
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('get-doubao-path', async () => {
  const config = loadConfig()
  console.log('[AI] getDoubaoPath called, config:', config)
  console.log('[AI] Config file path:', CONFIG_FILE)
  return { success: true, path: config.doubaoPath || '' }
})

ipcMain.handle('select-doubao-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: '选择豆包电脑版',
    filters: [{ name: '可执行文件', extensions: ['exe'] }],
    properties: ['openFile']
  })
  
  console.log('[AI] Dialog result:', result)
  
  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0]
    const config = loadConfig()
    config.doubaoPath = selectedPath
    saveConfig(config)
    console.log('[AI] Saved config:', config)
    console.log('[AI] Config file saved to:', CONFIG_FILE)
    return { success: true, path: selectedPath }
  }
  
  return { success: false }
})

ipcMain.handle('send-to-doubao', async (_, question: string, imageDataUrl?: string) => {
  try {
    const config = loadConfig()
    console.log('[AI] sendToDoubao called, config:', config)
    console.log('[AI] doubaoPath:', config.doubaoPath)
    
    if (!config.doubaoPath) {
      console.log('[AI] Error: doubaoPath is empty')
      return { success: false, error: '请先设置豆包电脑版路径' }
    }
    
    if (!fs.existsSync(config.doubaoPath)) {
      console.log('[AI] Error: doubaoPath does not exist:', config.doubaoPath)
      return { success: false, error: '豆包路径无效，请重新设置' }
    }
    
    if (imageDataUrl) {
      const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')
      const image = nativeImage.createFromBuffer(imageBuffer)
      clipboard.writeImage(image)
    } else {
      clipboard.writeText(question)
    }
    
    const scriptPath = path.join(__dirname, '../scripts/keyboard.ps1')
    
    await execAsync(`"${config.doubaoPath}"`)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const { spawn } = require('child_process')
    const pasteProcess = spawn('powershell', [
      '-ExecutionPolicy', 'Bypass',
      '-File', scriptPath,
      '-Action', 'paste'
    ])
    
    await new Promise(resolve => {
      pasteProcess.on('close', resolve)
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const enterProcess = spawn('powershell', [
      '-ExecutionPolicy', 'Bypass', 
      '-File', scriptPath,
      '-Action', 'enter'
    ])
    
    await new Promise(resolve => {
      enterProcess.on('close', resolve)
    })
    
    return { 
      success: true, 
      response: '问题已发送到豆包！\n\n请查看豆包窗口获取AI回复。\n\n提示：您可以截图豆包的回复区域来保存答案。'
    }
  } catch (error) {
    console.error('Send to Doubao failed:', error)
    return { success: false, error: String(error) }
  }
})
