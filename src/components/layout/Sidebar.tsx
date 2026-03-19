import React from 'react'
import { useAppStore } from '@/store'
import { KnowledgeModule } from '@/types'
import { ChevronRight } from 'lucide-react'

interface SidebarProps {
  modules: KnowledgeModule[]
}

const Sidebar: React.FC<SidebarProps> = ({ modules }) => {
  const { currentModuleId, currentKnowledgeId, setModule, setKnowledge } = useAppStore()
  const [expandedModule, setExpandedModule] = React.useState<string | null>(currentModuleId)

  const handleModuleClick = (moduleId: string) => {
    setModule(moduleId)
    setExpandedModule(expandedModule === moduleId ? null : moduleId)
  }

  const handleKnowledgeClick = (knowledgeId: string) => {
    setKnowledge(knowledgeId)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">Math-Efficiency</div>
        <div className="sidebar__subtitle">可视化高数学习</div>
      </div>
      
      <div className="sidebar__content">
        <nav className="module-nav">
          {modules.map((module) => (
            <div key={module.id}>
              <div
                className={`module-nav__item ${currentModuleId === module.id ? 'module-nav__item--active' : ''}`}
                onClick={() => handleModuleClick(module.id)}
              >
                <div className="module-nav__title">
                  <span style={{ marginRight: '8px' }}>{module.icon}</span>
                  {module.name}
                </div>
                <div className="module-nav__count">
                  {module.knowledgePoints.length} 个知识点
                </div>
                {module.knowledgePoints.length > 0 && (
                  <ChevronRight
                    size={16}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: `translateY(-50%) rotate(${expandedModule === module.id ? 90 : 0}deg)`,
                      transition: 'transform 0.2s',
                    }}
                  />
                )}
              </div>
              
              {expandedModule === module.id && module.knowledgePoints.length > 0 && (
                <div className="knowledge-list">
                  {module.knowledgePoints.map((knowledge) => (
                    <div
                      key={knowledge.id}
                      className={`knowledge-list__item ${currentKnowledgeId === knowledge.id ? 'knowledge-list__item--active' : ''}`}
                      onClick={() => handleKnowledgeClick(knowledge.id)}
                    >
                      {knowledge.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
