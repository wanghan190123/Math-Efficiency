import React, { useState, useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './ContentPopup.css'

const renderKatex = (latex: string, displayMode = false): string => {
  if (!latex) return ''
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      trust: true,
      strict: false
    })
  } catch (e) {
    console.warn('KaTeX render error:', e)
    return latex
  }
}

const KatexFormula: React.FC<{ latex: string; displayMode?: boolean }> = ({ latex, displayMode = false }) => {
  const html = useMemo(() => renderKatex(latex, displayMode), [latex, displayMode])
  return <span className={displayMode ? 'katex-display' : ''} dangerouslySetInnerHTML={{ __html: html }} />
}

export interface FormulaItem {
  id: string
  name: string
  latex: string
  description: string
  category: string
  tags: string[]
  example?: string
}

export interface ConceptItem {
  id: string
  name: string
  category: string
  definition: string
  plainTranslation?: string
  whyNeedIt?: string
  formula?: string
  example?: string
}

export type ContentType = 'formula' | 'concept'

interface ContentPopupProps {
  visible: boolean
  type: ContentType
  data: FormulaItem | ConceptItem | null
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: () => void
}

const ContentPopup: React.FC<ContentPopupProps> = ({
  visible,
  type,
  data,
  isFavorite,
  onClose,
  onToggleFavorite
}) => {
  if (!visible || !data) return null

  const isFormula = type === 'formula'

  return (
    <div className="content-popup-overlay" onClick={onClose}>
      <div className="content-popup" onClick={e => e.stopPropagation()}>
        <div className="cp-header">
          <div className="cp-type-badge">
            {isFormula ? '📐 公式' : '📖 概念'}
          </div>
          <h3 className="cp-title">{data.name}</h3>
          <div className="cp-actions">
            <button
              className={`cp-favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
              title={isFavorite ? '取消收藏' : '收藏'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
            <button className="cp-close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        
        <div className="cp-content">
          {isFormula ? (
            <>
              <div className="cp-section">
                <div className="cp-section-label">公式</div>
                <div className="cp-formula-display">
                  <KatexFormula latex={(data as FormulaItem).latex} displayMode />
                </div>
              </div>
              
              <div className="cp-section">
                <div className="cp-section-label">说明</div>
                <div className="cp-section-content">{(data as FormulaItem).description}</div>
              </div>
              
              {(data as FormulaItem).example && (
                <div className="cp-section">
                  <div className="cp-section-label">示例</div>
                  <div className="cp-section-content example">{(data as FormulaItem).example}</div>
                </div>
              )}
              
              <div className="cp-tags">
                {(data as FormulaItem).tags.map((tag, idx) => (
                  <span key={idx} className="cp-tag">{tag}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="cp-section">
                <div className="cp-section-label">数学定义</div>
                <div className="cp-section-content definition">{(data as ConceptItem).definition}</div>
              </div>
              
              {(data as ConceptItem).plainTranslation && (
                <div className="cp-section">
                  <div className="cp-section-label">白话翻译</div>
                  <div className="cp-section-content plain">{(data as ConceptItem).plainTranslation}</div>
                </div>
              )}
              
              {(data as ConceptItem).whyNeedIt && (
                <div className="cp-section">
                  <div className="cp-section-label">为什么需要它</div>
                  <div className="cp-section-content why">{(data as ConceptItem).whyNeedIt}</div>
                </div>
              )}
              
              {(data as ConceptItem).formula && (
                <div className="cp-section">
                  <div className="cp-section-label">公式</div>
                  <div className="cp-formula-display">
                    <KatexFormula latex={(data as ConceptItem).formula!} displayMode />
                  </div>
                </div>
              )}
              
              {(data as ConceptItem).example && (
                <div className="cp-section">
                  <div className="cp-section-label">示例</div>
                  <div className="cp-section-content example">{(data as ConceptItem).example}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentPopup
