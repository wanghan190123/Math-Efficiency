import React from 'react'
import { useAppStore } from '@/store'
import { Moon, Sun } from 'lucide-react'

const StatusBar: React.FC = () => {
  const { isDarkMode, setDarkMode, currentKnowledgeId } = useAppStore()

  return (
    <footer className="status-bar">
      <div className="status-bar__item">
        <span>📐 Math-Efficiency v1.0.0</span>
      </div>
      
      <div className="status-bar__item">
        {currentKnowledgeId && <span>当前: {currentKnowledgeId}</span>}
      </div>
      
      <div className="status-bar__item">
        <button
          onClick={() => setDarkMode(!isDarkMode)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          <span style={{ fontSize: 'var(--text-xs)' }}>
            {isDarkMode ? '日间模式' : '夜间模式'}
          </span>
        </button>
      </div>
    </footer>
  )
}

export default StatusBar
