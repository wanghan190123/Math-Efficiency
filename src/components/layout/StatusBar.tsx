import React, { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/store'
import { Moon, Sun, Palette, ChevronDown, Check } from 'lucide-react'
import { ThemeType, ThemeInfo } from '@/types'

const themes: ThemeInfo[] = [
  { id: 'light', name: '日间模式', icon: '☀️', description: '羊皮纸古典风' },
  { id: 'dark', name: '夜间模式', icon: '🌙', description: '暗金典雅风' },
  { id: 'morandi', name: '莫兰迪', icon: '🎨', description: '柔和高级灰' },
  { id: 'cyberpunk', name: '赛博朋克', icon: '🌃', description: '霓虹科技风' },
  { id: 'blackboard', name: '黑板板书', icon: '📝', description: '复古教学风' },
]

const StatusBar: React.FC = () => {
  const { theme, setTheme, currentKnowledgeId } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentTheme = themes.find(t => t.id === theme) || themes[0]

  return (
    <footer className="status-bar">
      <div className="status-bar__item">
        <span>📐 Math-Efficiency v1.0.0</span>
      </div>
      
      <div className="status-bar__item">
        {currentKnowledgeId && <span>当前: {currentKnowledgeId}</span>}
      </div>
      
      <div className="status-bar__item" ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="theme-selector-btn"
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            fontSize: 'var(--text-xs)',
            transition: 'all 0.2s',
          }}
        >
          <span>{currentTheme.icon}</span>
          <span>{currentTheme.name}</span>
          <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        
        {isOpen && (
          <div
            className="theme-dropdown"
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: '4px',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)',
              minWidth: '160px',
              overflow: 'hidden',
              zIndex: 1000,
            }}
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  background: theme === t.id ? 'var(--color-accent)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme === t.id ? 'white' : 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  fontSize: 'var(--text-sm)',
                  transition: 'background 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (theme !== t.id) {
                    e.currentTarget.style.background = 'var(--color-bg-secondary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme !== t.id) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '1.1em' }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: '0.7em', opacity: 0.7 }}>{t.description}</div>
                </div>
                {theme === t.id && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}

export default StatusBar