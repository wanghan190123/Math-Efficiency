import React from 'react'
import { MethodStep } from '@/types'
import { Download, Bookmark } from 'lucide-react'

interface MethodPanelProps {
  method: MethodStep[]
}

const MethodPanel: React.FC<MethodPanelProps> = ({ method }) => {
  return (
    <div style={{ height: '100%' }}>
      <div className="method-card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          paddingBottom: 'var(--space-3)',
          borderBottom: '2px solid var(--color-border)',
        }}>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            极简三步做题法
          </h4>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="control-btn" style={{ padding: 'var(--space-1) var(--space-2)' }}>
              <Bookmark size={14} />
              收藏
            </button>
            <button className="control-btn" style={{ padding: 'var(--space-1) var(--space-2)' }}>
              <Download size={14} />
              导出图片
            </button>
          </div>
        </div>

        {method.map((step) => (
          <div key={step.number} className="method-card__step">
            <div className="method-card__number">{step.number}</div>
            <div className="method-card__text">
              <strong style={{ color: 'var(--color-primary)' }}>{step.title}</strong>
              <p style={{ margin: 'var(--space-1) 0 0 0', color: 'var(--color-text-secondary)' }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'var(--space-4)',
        padding: 'var(--space-3)',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          margin: 0,
        }}>
          💡 提示：点击"导出图片"可将做题方法保存为图片，方便复习和分享
        </p>
      </div>
    </div>
  )
}

export default MethodPanel
