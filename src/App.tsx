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
const QuestionBank = lazy(() => import('./components/questions/QuestionBank'))
const HiddenGems = lazy(() => import('./components/hiddenGems/HiddenGems'))

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

// 检测是否为 Capacitor 移动端
const isNative = () => {
  try {
    return (window as any).Capacitor?.isNativePlatform?.() ?? false
  } catch {
    return false
  }
}

const App: React.FC = () => {
  const { theme, currentModuleId, setModule } = useAppStore()
  const [currentView, setCurrentView] = React.useState<ViewType>('menu')
  const viewRef = React.useRef<ViewType>(currentView)

  // 保持 ref 同步
  React.useEffect(() => {
    viewRef.current = currentView
  }, [currentView])

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Android 返回键：在非菜单页面时返回上一级，菜单页面不拦截（退出应用）
  React.useEffect(() => {
    if (!isNative()) return

    let App: any

    ;(async () => {
      try {
        const mod = await import('@capacitor/app')
        App = mod.App
        App.addListener('backButton', () => {
          if (viewRef.current !== 'menu') {
            setCurrentView('menu')
          } else {
            // 在主菜单页面，不拦截，让系统默认行为（退出应用）
          }
        })
      } catch (e) {
        // Capacitor 不可用时忽略
      }
    })()

    return () => {
      if (App) {
        App.removeAllListeners('backButton')
      }
    }
  }, [])

  // 从菜单导航到其他页面
  const handleNavigate = (view: ViewType) => {
    if (view === 'hidden-gems') {
      setCurrentView('hidden-gems')
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
    } else if (view === 'question-bank') {
      setCurrentView('question-bank')
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
        height: '100dvh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
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
        height: '100dvh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
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
        height: '100dvh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
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
        height: '100dvh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Suspense fallback={<Loading />}>
          <ConceptTheorem />
        </Suspense>
        <StatusBar />
      </div>
    )
  }

  // 沧海遗珠页面
  if (currentView === 'hidden-gems') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Suspense fallback={<Loading />}>
          <HiddenGems />
        </Suspense>
        <StatusBar />
      </div>
    )
  }

  // 题库页面
  if (currentView === 'question-bank') {
    return (
      <div className="app-container" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
        <Suspense fallback={<Loading />}>
          <QuestionBank />
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
      height: '100dvh',
      background: 'var(--color-bg-primary)',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <TitleBar showBackButton={true} onBackClick={handleBackToMenu} />
      <div className="knowledge-layout" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar modules={knowledgeModules} />
        <MainContent />
      </div>
      <StatusBar />
    </div>
  )
}

export default App
