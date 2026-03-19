import React from 'react'
import { useAppStore } from './store'
import { knowledgeModules } from './data/knowledge'
import TitleBar from './components/layout/TitleBar'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import StatusBar from './components/layout/StatusBar'
import MainMenu from './components/menu/MainMenu'
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
      // 如果没有选择模块，默认选择第一个
      if (!currentModule) {
        setCurrentModule(knowledgeModules[0].id)
      }
    } else if (view === 'graph' || view === 'formulas' || view === 'calculator') {
      // 这些功能还在开发中，暂时显示提示
      alert(`${view === 'graph' ? '知识图谱' : view === 'formulas' ? '公式手册' : '计算器'}功能开发中，敬请期待！`)
    }
  }

  // 返回菜单
  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  // 如果在菜单页面
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

  // 在知识点学习页面
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