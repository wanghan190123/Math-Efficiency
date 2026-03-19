import React from 'react'
import { Application } from '@/types'
import { FlaskConical, Lightbulb } from 'lucide-react'

interface ApplicationPanelProps {
  applications: Application[]
}

const ApplicationPanel: React.FC<ApplicationPanelProps> = ({ applications }) => {
  return (
    <div style={{ height: '100%' }}>
      <div className="timeline">
        {applications.map((app) => (
          <div key={app.id} className="timeline__item">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
            }}>
              {app.type === 'real' ? (
                <Lightbulb size={18} style={{ color: 'var(--color-accent)' }} />
              ) : (
                <FlaskConical size={18} style={{ color: 'var(--color-info)' }} />
              )}
              <span style={{
                fontSize: 'var(--text-xs)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: app.type === 'real' ? 'var(--color-accent)' : 'var(--color-info)',
                color: 'white',
              }}>
                {app.type === 'real' ? '现实应用' : '研究应用'}
              </span>
            </div>
            <h4 className="timeline__title">{app.title}</h4>
            <p className="timeline__content">{app.description}</p>
            {app.scenario && (
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-2)',
                fontStyle: 'italic',
              }}>
                💡 {app.scenario}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApplicationPanel
