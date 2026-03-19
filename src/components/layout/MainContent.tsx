import React from 'react'
import { useAppStore } from '@/store'
import { knowledgeModules, getCurrentKnowledge } from '@/data/knowledge'
import KnowledgeView from '@/components/knowledge/KnowledgeView'
import WelcomeView from '@/components/knowledge/WelcomeView'

const MainContent: React.FC = () => {
  const { currentModuleId, currentKnowledgeId } = useAppStore()
  
  const currentModule = knowledgeModules.find(m => m.id === currentModuleId)
  const currentKnowledge = getCurrentKnowledge(currentModuleId || '', currentKnowledgeId || '')

  return (
    <main className="main-content">
      <header className="main-content__header">
        <h1 className="main-content__title">
          {currentKnowledge ? currentKnowledge.name : 
           currentModule ? currentModule.name : '欢迎'}
        </h1>
        {currentKnowledge && (
          <div style={{ 
            marginTop: '8px', 
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
          }}>
            {currentModule?.name} · {currentKnowledge.formula}
          </div>
        )}
      </header>
      
      <div className="main-content__body">
        {currentKnowledge ? (
          <KnowledgeView knowledge={currentKnowledge} />
        ) : (
          <WelcomeView />
        )}
      </div>
    </main>
  )
}

export default MainContent
