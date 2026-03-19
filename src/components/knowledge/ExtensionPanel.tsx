import React from 'react'

interface ExtensionPanelProps {
  extension: {
    essence: string
    extension: string
  }
}

const ExtensionPanel: React.FC<ExtensionPanelProps> = ({ extension }) => {
  return (
    <div style={{
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
    }}>
      {/* 内涵 */}
      <div className="dimension-panel">
        <div className="dimension-panel__header">
          <span className="dimension-panel__icon">💡</span>
          <span className="dimension-panel__title">内涵挖掘</span>
        </div>
        <div className="dimension-panel__content">
          <p style={{
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-primary)',
          }}>
            {extension.essence}
          </p>
        </div>
      </div>

      {/* 延伸 */}
      <div className="dimension-panel">
        <div className="dimension-panel__header">
          <span className="dimension-panel__icon">🔗</span>
          <span className="dimension-panel__title">拓广延伸</span>
        </div>
        <div className="dimension-panel__content">
          <p style={{
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--color-text-primary)',
          }}>
            {extension.extension}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExtensionPanel
