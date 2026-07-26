import React, { useState, useMemo, useCallback, useEffect } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { hiddenGemCategories } from '@/data/hiddenGems'
import './HiddenGems.css'

const FAVORITES_KEY = 'hidden-gems-favorites'

const loadFavorites = (): Set<string> => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set()
}

const saveFavorites = (fav: Set<string>) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...fav]))
}

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

const stripLatexDelimiters = (latex: string): string => {
  let s = latex.trim()
  // 先尝试剥离 $$...$$
  if (s.startsWith('$$') && s.endsWith('$$')) {
    return s.slice(2, -2).trim()
  }
  // 再尝试剥离 $...$
  if (s.startsWith('$') && s.endsWith('$') && s.length > 2) {
    return s.slice(1, -1).trim()
  }
  return s
}

const KatexFormula: React.FC<{ latex: string; displayMode?: boolean }> = ({ latex, displayMode = false }) => {
  const cleanLatex = useMemo(() => stripLatexDelimiters(latex), [latex])
  const html = useMemo(() => renderKatex(cleanLatex, displayMode), [cleanLatex, displayMode])
  return <span className={displayMode ? 'katex-display' : ''} dangerouslySetInnerHTML={{ __html: html }} />
}

const unicodeToLatexMap: Record<string, string> = {
  'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta', 'ε': '\\varepsilon',
  'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta', 'ι': '\\iota', 'κ': '\\kappa',
  'λ': '\\lambda', 'μ': '\\mu', 'ν': '\\nu', 'ξ': '\\xi', 'π': '\\pi',
  'ρ': '\\rho', 'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\varphi',
  'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega',
  'Α': 'A', 'Β': 'B', 'Γ': '\\Gamma', 'Δ': '\\Delta', 'Ε': 'E', 'Ζ': 'Z',
  'Η': 'H', 'Θ': '\\Theta', 'Ι': 'I', 'Κ': 'K', 'Λ': '\\Lambda', 'Μ': 'M',
  'Ν': 'N', 'Ξ': '\\Xi', 'Π': '\\Pi', 'Ρ': 'P', 'Σ': '\\Sigma', 'Τ': 'T',
  'Υ': '\\Upsilon', 'Φ': '\\Phi', 'Χ': 'X', 'Ψ': '\\Psi', 'Ω': '\\Omega',
  '∈': '\\in', '∉': '\\notin', '⊂': '\\subset', '⊃': '\\supset', '⊆': '\\subseteq',
  '⊇': '\\supseteq', '∪': '\\cup', '∩': '\\cap', '∅': '\\emptyset', '∀': '\\forall',
  '∃': '\\exists', '¬': '\\neg', '∧': '\\land', '∨': '\\lor', '⇒': '\\Rightarrow',
  '⇔': '\\Leftrightarrow', '→': '\\to', '←': '\\leftarrow', '↔': '\\leftrightarrow',
  '≤': '\\leq', '≥': '\\geq', '≠': '\\neq', '≈': '\\approx', '≡': '\\equiv',
  '±': '\\pm', '∓': '\\mp', '×': '\\times', '÷': '\\div', '⋅': '\\cdot',
  '∞': '\\infty', '∂': '\\partial', '∇': '\\nabla', '∫': '\\int', '∬': '\\iint',
  '∭': '\\iiint', '∮': '\\oint', '∑': '\\sum', '∏': '\\prod', '√': '\\sqrt',
  '∛': '\\sqrt[3]', '∜': '\\sqrt[4]',
  '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4', '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9', '₀': '_0',
  '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁰': '^0',
  'ⁿ': '^n', 'ᵀ': '^T', 'ᵗ': '^t', '⁻': '^-', 'ᵢ': '_i', 'ⱼ': '_j', 'ₖ': '_k', 'ₙ': '_n', 'ₘ': '_m',
  'ᵃ': '^a', 'ᵇ': '^b', 'ᶜ': '^c', 'ᵈ': '^d', 'ᵉ': '^e', 'ᶠ': '^f',
  'ᵣ': '_r', 'ₛ': '_s', 'ₓ': '_x', 'ᵧ': '_y',
  '′': "'", '″': "''", '‴': "'''",
  'ℕ': '\\mathbb{N}', 'ℤ': '\\mathbb{Z}', 'ℚ': '\\mathbb{Q}', 'ℝ': '\\mathbb{R}', 'ℂ': '\\mathbb{C}',
  '⊤': '\\top', '⊥': '\\perp', '∥': '\\parallel', '∠': '\\angle', '°': '^\\circ',
  '·': '\\cdot', '…': '\\ldots', '⋯': '\\cdots', '⋮': '\\vdots', '⋱': '\\ddots',
}

const mathUnicodeChars = new Set(Object.keys(unicodeToLatexMap))

const containsMathUnicode = (text: string): boolean => {
  for (const char of text) {
    if (mathUnicodeChars.has(char)) return true
  }
  return false
}

const convertUnicodeToLatex = (text: string): string => {
  let result = text
  for (const [unicode, latex] of Object.entries(unicodeToLatexMap)) {
    result = result.split(unicode).join(latex)
  }
  return result
}

const splitByMathSegments = (text: string): { text: string; isMath: boolean }[] => {
  const segments: { text: string; isMath: boolean }[] = []

  // 仅匹配明确含有Unicode数学符号的片段，避免误匹配普通文本
  const mathPatterns = [
    /\$\$[\s\S]*?\$\$/g,
    /\\[[\s\S]*?\\]/g,
    /\$[^$\n]+\$/g,
    /\\\([\s\S]*?\\\)/g,
    /[a-zA-Z][₁₂₃₄₅₆₇₈₉₀ᵢⱼₖₙₘₓᵧ]+/g,
    /[a-zA-Z][¹²³⁴⁵⁶⁷⁸⁹⁰ⁿᵀᵗᵃᵇᶜᵈᵉᶠ]+/g,
    /[α-ωΑ-Ω][₁₂₃₄₅₆₇₈₉₀ᵢⱼₖₙₘₓᵧ]*/g,
    /[∑∏∫∬∭∮√∛∜][^,，。；;。\s]*/g,
  ]

  let remaining = text

  while (remaining.length > 0) {
    let earliestMatch: { index: number; length: number } | null = null

    for (const pattern of mathPatterns) {
      const regex = new RegExp(pattern.source, pattern.flags)
      const match = regex.exec(remaining)
      if (match && (earliestMatch === null || match.index < earliestMatch.index)) {
        earliestMatch = { index: match.index, length: match[0].length }
      }
    }

    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        segments.push({ text: remaining.slice(0, earliestMatch.index), isMath: false })
      }
      segments.push({ text: remaining.slice(earliestMatch.index, earliestMatch.index + earliestMatch.length), isMath: true })
      remaining = remaining.slice(earliestMatch.index + earliestMatch.length)
    } else {
      if (remaining.length > 0) {
        segments.push({ text: remaining, isMath: false })
      }
      break
    }
  }

  return segments.length > 0 ? segments : [{ text, isMath: false }]
}

const renderTextWithLatex = (text: string): React.ReactNode[] => {
  if (!text) return []

  const parts: React.ReactNode[] = []
  let key = 0

  const latexPatterns = [
    { regex: /\$\$([\s\S]*?)\$\$/g, displayMode: true },
    { regex: /\\\[([\s\S]*?)\\\]/g, displayMode: true },
    { regex: /\$([^$\n]+?)\$/g, displayMode: false },
    { regex: /\\\(([\s\S]*?)\\\)/g, displayMode: false }
  ]

  const allMatches: { start: number; end: number; latex: string; displayMode: boolean }[] = []

  for (const { regex, displayMode } of latexPatterns) {
    let match
    const re = new RegExp(regex.source, regex.flags)
    while ((match = re.exec(text)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1].trim(),
        displayMode
      })
    }
  }

  allMatches.sort((a, b) => a.start - b.start)

  const filteredMatches = allMatches.filter((match, i) => {
    for (let j = 0; j < i; j++) {
      if (match.start >= allMatches[j].start && match.start < allMatches[j].end) {
        return false
      }
    }
    return true
  })

  let lastEnd = 0
  for (const match of filteredMatches) {
    if (match.start > lastEnd) {
      const plainText = text.slice(lastEnd, match.start)
      const segments = splitByMathSegments(plainText)
      for (const segment of segments) {
        if (segment.isMath) {
          const converted = convertUnicodeToLatex(segment.text)
          try {
            const html = katex.renderToString(converted, {
              throwOnError: false,
              displayMode: false,
              trust: true,
              strict: false
            })
            parts.push(<span key={key++} className="inline-formula" dangerouslySetInnerHTML={{ __html: html }} />)
          } catch {
            parts.push(<span key={key++}>{segment.text}</span>)
          }
        } else {
          parts.push(<span key={key++}>{segment.text}</span>)
        }
      }
    }
    parts.push(
      <span key={key++} className="inline-formula">
        <KatexFormula latex={match.latex} displayMode={match.displayMode} />
      </span>
    )
    lastEnd = match.end
  }

  if (lastEnd < text.length) {
    const plainText = text.slice(lastEnd)
    const segments = splitByMathSegments(plainText)
    for (const segment of segments) {
      if (segment.isMath) {
        const converted = convertUnicodeToLatex(segment.text)
        try {
          const html = katex.renderToString(converted, {
            throwOnError: false,
            displayMode: false,
            trust: true,
            strict: false
          })
          parts.push(<span key={key++} className="inline-formula" dangerouslySetInnerHTML={{ __html: html }} />)
        } catch {
          parts.push(<span key={key++}>{segment.text}</span>)
        }
      } else {
        parts.push(<span key={key++}>{segment.text}</span>)
      }
    }
  }

  return parts.length > 0 ? parts : [<span key={0}>{text}</span>]
}

const TextWithLatex: React.FC<{ text: string }> = ({ text }) => {
  const parts = useMemo(() => renderTextWithLatex(text), [text])
  return <>{parts}</>
}

// 类型标签配置
const typeConfig: Record<string, { label: string; color: string }> = {
  confusion: { label: '易混淆', color: '#9C27B0' },
  trap: { label: '陷阱', color: '#E64A19' },
  detail: { label: '细节', color: '#1565C0' },
  contrast: { label: '对比', color: '#00897B' },
}

// 严重程度配置
const severityConfig: Record<string, { label: string; color: string }> = {
  high: { label: '高频踩坑', color: '#C62828' },
  medium: { label: '需要注意', color: '#F57C00' },
  low: { label: '了解即可', color: '#2E7D32' },
}

type TypeFilter = 'all' | 'confusion' | 'trap' | 'detail' | 'contrast'
type SeverityFilter = 'all' | 'high' | 'medium' | 'low'

const HiddenGems: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(hiddenGemCategories[0].id)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveFavorites(next)
      return next
    })
  }, [])

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const currentCategory = hiddenGemCategories.find(c => c.id === activeCategory)

  const allItems = hiddenGemCategories.flatMap(c => c.items)

  const filteredItems = useMemo(() => {
    let items = searchQuery.trim()
      ? allItems
      : (currentCategory?.items || [])

    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.title.includes(searchQuery.trim()) ||
        item.question.includes(searchQuery.trim()) ||
        item.wrongAnswer.includes(searchQuery.trim()) ||
        item.correctAnswer.includes(searchQuery.trim()) ||
        item.explanation.includes(searchQuery.trim())
      )
    }

    if (typeFilter !== 'all') {
      items = items.filter(item => item.type === typeFilter)
    }

    if (severityFilter !== 'all') {
      items = items.filter(item => item.severity === severityFilter)
    }

    if (showFavoritesOnly) {
      items = items.filter(item => favorites.has(item.id))
    }

    return items
  }, [searchQuery, typeFilter, severityFilter, activeCategory, currentCategory, allItems, showFavoritesOnly, favorites])

  const totalItems = hiddenGemCategories.reduce((sum, cat) => sum + cat.items.length, 0)
  const totalFavorites = favorites.size

  return (
    <div className="hidden-gems">
      <div className="hidden-gems-sidebar">
        <div className="hidden-gems-sidebar-header">
          <h2>📖 沧海遗珠</h2>
        </div>
        <div className="hidden-gems-chapter-list">
          <button
            className={`hidden-gems-chapter-item hidden-gems-fav-entry ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => {
              setShowFavoritesOnly(!showFavoritesOnly)
              setExpandedItem(null)
            }}
          >
            <span className="hidden-gems-chapter-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <span className="hidden-gems-chapter-name">我的收藏</span>
            <span className="hidden-gems-chapter-count">{totalFavorites}</span>
          </button>
          <div className="hidden-gems-chapter-divider" />
          {hiddenGemCategories.map(category => (
            <button
              key={category.id}
              className={`hidden-gems-chapter-item ${activeCategory === category.id && !showFavoritesOnly ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(category.id)
                setShowFavoritesOnly(false)
                setExpandedItem(null)
              }}
            >
              <span className="hidden-gems-chapter-icon">{category.icon}</span>
              <span className="hidden-gems-chapter-name">{category.name}</span>
              <span className="hidden-gems-chapter-count">{category.items.length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden-gems-main">
        <div className="hidden-gems-toolbar">
          <div className="hidden-gems-search">
            <input
              type="text"
              placeholder="搜索易错点标题、问题、解释..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hidden-gems-search-input"
            />
            {searchQuery && (
              <span className="hidden-gems-search-count">
                找到 {filteredItems.length} 个结果
              </span>
            )}
          </div>

          <div className="hidden-gems-filters">
            <div className="hidden-gems-filter-group">
              <span className="hidden-gems-filter-label">类型：</span>
              <div className="hidden-gems-filter-tags">
                <button
                  className={`hidden-gems-filter-tag ${typeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('all')}
                >
                  全部
                </button>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <button
                    key={key}
                    className={`hidden-gems-filter-tag ${typeFilter === key ? 'active' : ''}`}
                    style={typeFilter === key ? { background: config.color, borderColor: config.color, color: '#fff' } : {}}
                    onClick={() => setTypeFilter(key as TypeFilter)}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden-gems-filter-group">
              <span className="hidden-gems-filter-label">严重程度：</span>
              <div className="hidden-gems-filter-tags">
                <button
                  className={`hidden-gems-filter-tag ${severityFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSeverityFilter('all')}
                >
                  全部
                </button>
                {Object.entries(severityConfig).map(([key, config]) => (
                  <button
                    key={key}
                    className={`hidden-gems-filter-tag ${severityFilter === key ? 'active' : ''}`}
                    style={severityFilter === key ? { background: config.color, borderColor: config.color, color: '#fff' } : {}}
                    onClick={() => setSeverityFilter(key as SeverityFilter)}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden-gems-list">
          {filteredItems.length === 0 ? (
            <div className="hidden-gems-empty">
              <span className="hidden-gems-empty-icon">🔍</span>
              <p>没有找到匹配的易错点</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const typeInfo = typeConfig[item.type]
              const severityInfo = severityConfig[item.severity]
              const isExpanded = expandedItem === item.id

              return (
                <div
                  key={item.id}
                  className={`hidden-gems-card ${isExpanded ? 'expanded' : ''} ${favorites.has(item.id) ? 'favorited' : ''}`}
                >
                  <div
                    className="hidden-gems-card-header"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  >
                    <div className="hidden-gems-card-title-row">
                      <h3 className="hidden-gems-card-title">{item.title}</h3>
                      <div className="hidden-gems-card-actions">
                        <button
                          className={`hidden-gems-fav-btn ${favorites.has(item.id) ? 'active' : ''}`}
                          onClick={(e) => toggleFavorite(item.id, e)}
                          title={favorites.has(item.id) ? '取消收藏' : '收藏'}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill={favorites.has(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                        <span
                          className="hidden-gems-type-badge"
                          style={{ background: typeInfo.color }}
                        >
                          {typeInfo.label}
                        </span>
                        <span
                          className="hidden-gems-severity-badge"
                          style={{ background: severityInfo.color }}
                        >
                          {severityInfo.label}
                        </span>
                      </div>
                    </div>
                    <div className="hidden-gems-card-question">
                      <TextWithLatex text={item.question} />
                    </div>
                    <span className="hidden-gems-expand-icon">{isExpanded ? '−' : '+'}</span>
                  </div>

                  {isExpanded && (
                    <div className="hidden-gems-card-content">
                      <div className="hidden-gems-section hidden-gems-wrong">
                        <div className="hidden-gems-section-header">
                          <span className="hidden-gems-section-icon">❌</span>
                          <h4>典型错误</h4>
                        </div>
                        <p><TextWithLatex text={item.wrongAnswer} /></p>
                      </div>

                      <div className="hidden-gems-section hidden-gems-correct">
                        <div className="hidden-gems-section-header">
                          <span className="hidden-gems-section-icon">✅</span>
                          <h4>正确理解</h4>
                        </div>
                        <p><TextWithLatex text={item.correctAnswer} /></p>
                      </div>

                      <div className="hidden-gems-section hidden-gems-explanation">
                        <div className="hidden-gems-section-header">
                          <span className="hidden-gems-section-icon">📖</span>
                          <h4>详细解释</h4>
                        </div>
                        <p><TextWithLatex text={item.explanation} /></p>
                      </div>

                      {item.formula && (
                        <div className="hidden-gems-section hidden-gems-formula">
                          <div className="hidden-gems-section-header">
                            <span className="hidden-gems-section-icon">📐</span>
                            <h4>公式</h4>
                          </div>
                          <div className="hidden-gems-formula-display">
                            <KatexFormula latex={item.formula} displayMode={true} />
                          </div>
                        </div>
                      )}

                      {item.example && (
                        <div className="hidden-gems-section hidden-gems-example">
                          <div className="hidden-gems-section-header">
                            <span className="hidden-gems-section-icon">📝</span>
                            <h4>举例</h4>
                          </div>
                          <p><TextWithLatex text={item.example} /></p>
                        </div>
                      )}

                      {item.examTip && (
                        <div className="hidden-gems-section hidden-gems-exam-tip">
                          <div className="hidden-gems-section-header">
                            <span className="hidden-gems-section-icon">💡</span>
                            <h4>考试提醒</h4>
                          </div>
                          <p><TextWithLatex text={item.examTip} /></p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default HiddenGems
