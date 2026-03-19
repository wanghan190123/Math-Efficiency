import React from 'react'
import { useAppStore } from './store'
import { knowledgeModules } from './data/knowledge'
import TitleBar from './components/layout/TitleBar'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import StatusBar from './components/layout/StatusBar'
import MainMenu from './components/menu/MainMenu'
import Calculator from './components/calculator/Calculator'
import './styles/components.css'

export type ViewType = 'menu' | 'knowledge' | 'graph' | 'formulas' | 'calculator'

const App: React.FC = () => {
  const { isDarkMode, currentModule, setCurrentModule } = useAppStore()
  const [currentView, setCurrentView] = React.useState<ViewType>('menu')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // 从菜单导航到其他页面
  const handleNavigate = (view: ViewType) => {
    if (view === 'knowledge') {
      setCurrentView('knowledge')
      if (!currentModule) {
        setCurrentModule(knowledgeModules[0].id)
      }
    } else if (view === 'calculator') {
      setCurrentView('calculator')
    } else if (view === 'graph' || view === 'formulas') {
      alert(`${view === 'graph' ? '知识图谱' : '公式手册'}功能开发中，敬请期待！`)
    }
  }

  // 返回菜单
  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  // 菜单页面
  if (currentView === 'menu') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-primary)',
      }}>
        <TitleBar showBackButton={false} />
        <MainMenu onNavigate={handleNavigate} />
        <StatusBar />
      </div>
    )
  }

  // 计算器页面
  if (currentView === 'calculator') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-primary)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Calculator />
        <StatusBar />
      </div>
    )
  }

  // 知识点学习页面
  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--color-bg-primary)',
    }}>
      <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar modules={knowledgeModules} />
        <MainContent />
      </div>
      <StatusBar />
    </div>
  )
}

export default App
