import React, { Suspense, lazy } from 'react'
import { useAppStore } from './store'
import { knowledgeModules } from './data/knowledge'
import TitleBar from './components/layout/TitleBar'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import StatusBar from './components/layout/StatusBar'
import MainMenu from './components/menu/MainMenu'
import './styles/components.css'

// 懒加载大组件
const FormulaBook = lazy(() => import('./components/formulas/FormulaBook'))
const FormulaDerivation = lazy(() => import('./components/derivation/FormulaDerivation'))
const ConceptTheorem = lazy(() => import('./components/concepts/ConceptTheorem'))

// 加载中组件
const Loading: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '18px',
    color: '#666'
  }}>
    加载中...
  </div>
)

export type ViewType = 'menu' | 'knowledge' | 'concepts' | 'formulas' | 'derivation' | 'hidden-gems' | 'question-bank'

const App: React.FC = () => {
  const { theme, currentModuleId, setModule } = useAppStore()
  const [currentView, setCurrentView] = React.useState<ViewType>('menu')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // 从菜单导航到其他页面
  const handleNavigate = (view: ViewType) => {
    if (view === 'hidden-gems' || view === 'question-bank') {
      alert('该功能正在开发中，敬请期待！')
      return
    }
    if (view === 'knowledge') {
      setCurrentView('knowledge')
      if (!currentModuleId) {
        setModule(knowledgeModules[0].id)
      }
    } else if (view === 'formulas') {
      setCurrentView('formulas')
    } else if (view === 'derivation') {
      setCurrentView('derivation')
    } else if (view === 'concepts') {
      setCurrentView('concepts')
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

  // 公式手册页面
  if (currentView === 'formulas') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-primary)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Suspense fallback={<Loading />}>
          <FormulaBook />
        </Suspense>
        <StatusBar />
      </div>
    )
  }

  // 公式推导页面
  if (currentView === 'derivation') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-primary)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Suspense fallback={<Loading />}>
          <FormulaDerivation />
        </Suspense>
        <StatusBar />
      </div>
    )
  }

  // 概念定理页面
  if (currentView === 'concepts') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-primary)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Suspense fallback={<Loading />}>
          <ConceptTheorem />
        </Suspense>
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
