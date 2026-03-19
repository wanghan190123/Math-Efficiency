import React from 'react'
import { knowledgeModules } from '@/data/knowledge'

const WelcomeView: React.FC = () => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-8)',
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: 'var(--space-6)',
      }}>
        📚
      </div>
      
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-4xl)',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-4)',
      }}>
        欢迎使用 Math-Efficiency
      </h2>
      
      <p style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--color-text-secondary)',
        maxWidth: '600px',
        lineHeight: 'var(--leading-relaxed)',
        marginBottom: 'var(--space-8)',
      }}>
        一款面向自主学习的高数可视化学习应用，通过五维度的学习资源，让抽象的数学概念变得直观易懂。
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 'var(--space-4)',
        maxWidth: '800px',
      }}>
        {knowledgeModules.map((module) => (
          <div
            key={module.id}
            style={{
              background: 'var(--color-bg-card)',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
              {module.icon}
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-display)',
            }}>
              {module.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'var(--space-8)',
        padding: 'var(--space-4)',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)',
        }}>
          👈 从左侧选择一个知识模块开始学习
        </p>
      </div>
    </div>
  )
}

export default WelcomeView
