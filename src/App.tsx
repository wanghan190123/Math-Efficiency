import React from 'react'
import { useAppStore } from './store'
import { knowledgeModules } from './data/knowledge'
import TitleBar from './components/layout/TitleBar'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import StatusBar from './components/layout/StatusBar'
import './styles/components.css'

const App: React.FC = () => {
  const { isDarkMode } = useAppStore()

  React.useEffect(() => {
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--color-bg-primary)',
    }}>
      <TitleBar />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar modules={knowledgeModules} />
        <MainContent />
      </div>
      <StatusBar />
    </div>
  )
}

export default App
