import React from 'react'

interface ExplanationPanelProps {
  explanation: {
    mainText: string
    highlights: { start: number; end: number; type: string }[]
  }
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  // 简单的文本分段显示
  const paragraphs = explanation.mainText.split('\n\n')

  return (
    <div className="dimension-panel">
      <div className="dimension-panel__header">
        <span className="dimension-panel__icon">📖</span>
        <span className="dimension-panel__title">生动讲解</span>
      </div>
      <div className="dimension-panel__content">
        {paragraphs.map((para, index) => (
          <p
            key={index}
            style={{
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)',
              textIndent: '2em',
            }}
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}

export default ExplanationPanel
