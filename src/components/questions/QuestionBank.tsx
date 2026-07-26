import React, { useState, useMemo, useCallback } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './QuestionBank.css'
import { Question, QuestionType } from '@/types/question'
import { sampleQuestions } from '@/data/questions'
import ContentPopup, { ContentType } from '@/components/common/ContentPopup'
import { FORMULAS } from '@/data/formulas'
import { CONCEPTS } from '@/data/concepts'

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

const convertUnicodeToLatex = (text: string): string => {
  let result = text
  for (const [unicode, latex] of Object.entries(unicodeToLatexMap)) {
    result = result.split(unicode).join(latex)
  }
  return result
}

const splitByMathSegments = (text: string): { text: string; isMath: boolean }[] => {
  const segments: { text: string; isMath: boolean }[] = []
  
  const mathPatterns = [
    /\$\$[\s\S]*?\$\$/g,
    /\\[[\s\S]*?\\]/g,
    /\$[^$\n]+\$/g,
    /\\\([\s\S]*?\\\)/g,
    /[a-zA-Z]+\s*\([^)]*\)/g,
    /\|[^|]+\|/g,
    /[a-zA-Z]\s*[=<>≤≥≠≈]\s*[^,，。；;]+/g,
    /[∑∏∫][^,，。；;]*/g,
    /[\d]+\s*[\+\-\×÷]\s*[\d]+/g,
    /[a-zA-Z][₁₂₃₄₅₆₇₈₉₀ᵢⱼₖₙₘₓᵧ]+/g,
    /[a-zA-Z][¹²³⁴⁵⁶⁷⁸⁹⁰ⁿᵀᵗᵃᵇᶜᵈᵉᶠ]+/g,
    /[α-ωΑ-Ω][₁₂₃₄₅₆₇₈₉₀ᵢⱼₖₙₘₓᵧ]*/g,
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

type FilterMode = 'year' | 'chapter' | 'knowledge' | 'method' | 'favorites'
type QuestionStatus = 'unDone' | 'correct' | 'wrong'

const FAVORITES_KEY = 'math-efficiency-favorites'
const SHOW_FAVORITES_KEY = 'math-efficiency-show-favorites'
const STATUS_KEY = 'math-efficiency-question-status'

const QuestionBank: React.FC = () => {
  const [questions] = useState<Question[]>(sampleQuestions)
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set())
  const [expandedAnalysis, setExpandedAnalysis] = useState<Set<string>>(new Set())
  const [searchText, setSearchText] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('year')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SHOW_FAVORITES_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [questionStatus, setQuestionStatus] = useState<Record<string, QuestionStatus>>(() => {
    try {
      const saved = localStorage.getItem(STATUS_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | null>(null)
  
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupType, setPopupType] = useState<ContentType>('formula')
  const [popupData, setPopupData] = useState<any>(null)
  const [formulaFavorites, setFormulaFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('math-efficiency-formula-favorites')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [conceptFavorites, setConceptFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('math-efficiency-concept-favorites')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  
  const openFormulaPopup = useCallback((formulaName: string) => {
    const formula = FORMULAS.find(f => f.name === formulaName || f.id === formulaName)
    if (formula) {
      setPopupType('formula')
      setPopupData(formula)
      setPopupVisible(true)
    }
  }, [])
  
  const openConceptPopup = useCallback((conceptName: string) => {
    const concept = CONCEPTS.find(c => c.name === conceptName || c.id === conceptName)
    if (concept) {
      setPopupType('concept')
      setPopupData(concept)
      setPopupVisible(true)
    }
  }, [])
  
  const closePopup = useCallback(() => {
    setPopupVisible(false)
    setPopupData(null)
  }, [])
  
  const togglePopupFavorite = useCallback(() => {
    if (!popupData) return
    if (popupType === 'formula') {
      setFormulaFavorites(prev => {
        const newSet = new Set(prev)
        if (newSet.has(popupData.id)) {
          newSet.delete(popupData.id)
        } else {
          newSet.add(popupData.id)
        }
        localStorage.setItem('math-efficiency-formula-favorites', JSON.stringify(Array.from(newSet)))
        return newSet
      })
    } else {
      setConceptFavorites(prev => {
        const newSet = new Set(prev)
        if (newSet.has(popupData.id)) {
          newSet.delete(popupData.id)
        } else {
          newSet.add(popupData.id)
        }
        localStorage.setItem('math-efficiency-concept-favorites', JSON.stringify(Array.from(newSet)))
        return newSet
      })
    }
  }, [popupData, popupType])
  
  const toggleShowFavorites = useCallback(() => {
    setShowOnlyFavorites(prev => {
      const newValue = !prev
      localStorage.setItem(SHOW_FAVORITES_KEY, String(newValue))
      return newValue
    })
  }, [])
  
  const toggleFavorite = useCallback((questionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }, [])
  
  const setQuestionStatusHandler = useCallback((questionId: string, status: QuestionStatus, e: React.MouseEvent) => {
    e.stopPropagation()
    setQuestionStatus(prev => {
      const newStatus = { ...prev }
      if (newStatus[questionId] === status) {
        delete newStatus[questionId]
      } else {
        newStatus[questionId] = status
      }
      localStorage.setItem(STATUS_KEY, JSON.stringify(newStatus))
      return newStatus
    })
  }, [])
  
  const getFilteredQuestions = useCallback((additionalFilters?: {
    year?: number
    chapter?: string
    knowledgePoint?: string
    method?: string
  }) => {
    let result = questions
    
    if (showOnlyFavorites) {
      result = result.filter(q => favorites.has(q.id))
    }
    
    if (statusFilter) {
      result = result.filter(q => {
        const currentStatus = questionStatus[q.id] || 'unDone'
        return currentStatus === statusFilter
      })
    }
    
    if (additionalFilters) {
      if (additionalFilters.year !== undefined) {
        result = result.filter(q => q.year === additionalFilters.year)
      }
      if (additionalFilters.chapter) {
        result = result.filter(q => q.chapter === additionalFilters.chapter)
      }
      if (additionalFilters.knowledgePoint) {
        result = result.filter(q => q.knowledgePoints.includes(additionalFilters.knowledgePoint))
      }
      if (additionalFilters.method) {
        result = result.filter(q => q.methods.includes(additionalFilters.method))
      }
    }
    
    return result
  }, [questions, showOnlyFavorites, favorites, statusFilter, questionStatus])
  
  const getFilteredCount = useCallback((filterType: string, filterValue: string | number) => {
    let filtered = questions.filter(q => {
      if (statusFilter) {
        const currentStatus = questionStatus[q.id] || 'unDone'
        if (currentStatus !== statusFilter) return false
      }
      if (showOnlyFavorites && !favorites.has(q.id)) return false
      return true
    })
    
    if (filterType === 'year') {
      return filtered.filter(q => q.year === filterValue).length
    } else if (filterType === 'chapter') {
      return filtered.filter(q => q.chapter === filterValue).length
    } else if (filterType === 'knowledge') {
      return filtered.filter(q => q.knowledgePoints.includes(filterValue as string)).length
    } else if (filterType === 'method') {
      return filtered.filter(q => q.methods.includes(filterValue as string)).length
    }
    return 0
  }, [questions, statusFilter, showOnlyFavorites, favorites, questionStatus])
  
  const filteredYears = useMemo(() => {
    const yearSet = new Set<number>()
    questions.forEach(q => {
      if (statusFilter) {
        const currentStatus = questionStatus[q.id] || 'unDone'
        if (currentStatus !== statusFilter) return
      }
      if (showOnlyFavorites && !favorites.has(q.id)) return
      yearSet.add(q.year)
    })
    return Array.from(yearSet).sort((a, b) => b - a)
  }, [questions, statusFilter, showOnlyFavorites, favorites, questionStatus])
  
  const filteredChapters = useMemo(() => {
    const chapterSet = new Set<string>()
    questions.forEach(q => {
      if (statusFilter) {
        const currentStatus = questionStatus[q.id] || 'unDone'
        if (currentStatus !== statusFilter) return
      }
      if (showOnlyFavorites && !favorites.has(q.id)) return
      chapterSet.add(q.chapter)
    })
    return Array.from(chapterSet).sort()
  }, [questions, statusFilter, showOnlyFavorites, favorites, questionStatus])
  
  const filteredKnowledgePoints = useMemo(() => {
    const kpSet = new Set<string>()
    questions.forEach(q => {
      if (statusFilter) {
        const currentStatus = questionStatus[q.id] || 'unDone'
        if (currentStatus !== statusFilter) return
      }
      if (showOnlyFavorites && !favorites.has(q.id)) return
      q.knowledgePoints.forEach(kp => kpSet.add(kp))
    })
    return Array.from(kpSet).sort()
  }, [questions, statusFilter, showOnlyFavorites, favorites, questionStatus])
  
  const filteredMethods = useMemo(() => {
    const methodSet = new Set<string>()
    questions.forEach(q => {
      if (statusFilter) {
        const currentStatus = questionStatus[q.id] || 'unDone'
        if (currentStatus !== statusFilter) return
      }
      if (showOnlyFavorites && !favorites.has(q.id)) return
      q.methods.forEach(m => methodSet.add(m))
    })
    return Array.from(methodSet).sort()
  }, [questions, statusFilter, showOnlyFavorites, favorites, questionStatus])
  
  const displayQuestions = useMemo(() => {
    let result = questions
    
    if (filterMode === 'favorites') {
      result = result.filter(q => favorites.has(q.id))
    } else if (filterMode === 'year' && selectedYear !== null) {
      result = result.filter(q => q.year === selectedYear)
    } else if (filterMode !== 'year' && filterMode !== 'favorites' && selectedFilter) {
      if (filterMode === 'chapter') {
        result = result.filter(q => q.chapter === selectedFilter)
      } else if (filterMode === 'knowledge') {
        result = result.filter(q => q.knowledgePoints.includes(selectedFilter))
      } else if (filterMode === 'method') {
        result = result.filter(q => q.methods.includes(selectedFilter))
      }
    } else if (filterMode !== 'year' && filterMode !== 'favorites' && !selectedFilter) {
      return []
    } else if (filterMode === 'year' && selectedYear === null) {
      return []
    }
    
    if (showOnlyFavorites && filterMode !== 'favorites') {
      result = result.filter(q => favorites.has(q.id))
    }
    
    if (statusFilter) {
      result = result.filter(q => {
        const currentStatus = questionStatus[q.id] || 'unDone'
        return currentStatus === statusFilter
      })
    }
    
    if (searchText.trim()) {
      const search = searchText.toLowerCase()
      result = result.filter(q =>
        q.content.toLowerCase().includes(search) ||
        q.answer.toLowerCase().includes(search) ||
        q.knowledgePoints.some(kp => kp.toLowerCase().includes(search))
      )
    }
    
    return result.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return a.number - b.number
    })
  }, [questions, selectedFilter, filterMode, searchText, selectedYear, favorites, showOnlyFavorites, questionStatus, statusFilter])
  
  const toggleAnswer = useCallback((questionId: string) => {
    setExpandedAnswers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
        setExpandedAnalysis(prev2 => {
          const newSet2 = new Set(prev2)
          newSet2.delete(questionId)
          return newSet2
        })
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }, [])
  
  const toggleAnalysis = useCallback((questionId: string) => {
    setExpandedAnalysis(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }, [])
  
  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year)
    setExpandedAnswers(new Set())
    setExpandedAnalysis(new Set())
  }, [])
  
  const handleFilterModeChange = useCallback((mode: FilterMode) => {
    setFilterMode(mode)
    setSelectedYear(null)
    setSelectedFilter(null)
    setExpandedAnswers(new Set())
    setExpandedAnalysis(new Set())
  }, [])
  
  const getQuestionTypeLabel = (type: QuestionType): string => {
    switch (type) {
      case 'choice': return '选择'
      case 'fill': return '填空'
      case 'answer': return '解答'
    }
  }
  
  const getQuestionTypeIcon = (type: QuestionType): string => {
    switch (type) {
      case 'choice': return '○'
      case 'fill': return '□'
      case 'answer': return '☆'
    }
  }
  
  const filterOptions = useMemo(() => {
    switch (filterMode) {
      case 'year':
        return filteredYears.map(y => ({ value: y.toString(), label: `${y}年` }))
      case 'chapter':
        return filteredChapters.map(c => ({ value: c, label: c }))
      case 'knowledge':
        return filteredKnowledgePoints.map(kp => ({ value: kp, label: kp }))
      case 'method':
        return filteredMethods.map(m => ({ value: m, label: m }))
      default:
        return []
    }
  }, [filterMode, filteredYears, filteredChapters, filteredKnowledgePoints, filteredMethods])
  
  const renderQuestionCard = (q: Question) => {
    const currentStatus = questionStatus[q.id] || 'unDone'
    
    return (
      <div key={q.id} className="qb-question-card">
        <div className="qb-card-header-row">
          <div className="qb-card-title">
            <span className="qb-card-number">第{q.number}题</span>
            <span className="qb-card-type">{getQuestionTypeIcon(q.type)} {getQuestionTypeLabel(q.type)}</span>
            {q.knowledgePoints.slice(0, 2).map((kp, idx) => (
              <span 
                key={idx} 
                className="qb-mini-tag clickable"
                onClick={(e) => {
                  e.stopPropagation()
                  openConceptPopup(kp)
                }}
                title="点击查看概念"
              >
                {kp}
              </span>
            ))}
          </div>
          <div className="qb-card-actions-right">
            <div className="qb-status-btns">
              <button
                className={`qb-status-btn correct ${currentStatus === 'correct' ? 'active' : ''}`}
                onClick={(e) => setQuestionStatusHandler(q.id, 'correct', e)}
                title="做对"
              >
                ✓
              </button>
              <button
                className={`qb-status-btn wrong ${currentStatus === 'wrong' ? 'active' : ''}`}
                onClick={(e) => setQuestionStatusHandler(q.id, 'wrong', e)}
                title="做错"
              >
                ✗
              </button>
              <button
                className={`qb-status-btn undone ${currentStatus === 'unDone' ? 'active' : ''}`}
                onClick={(e) => setQuestionStatusHandler(q.id, 'unDone', e)}
                title="未做"
              >
                ○
              </button>
            </div>
            <button 
              className={`qb-favorite-btn ${favorites.has(q.id) ? 'active' : ''}`}
              onClick={(e) => toggleFavorite(q.id, e)}
              title={favorites.has(q.id) ? '取消收藏' : '收藏'}
            >
              {favorites.has(q.id) ? '★' : '☆'}
            </button>
          </div>
        </div>
      
      <div className="qb-card-content">
        <TextWithLatex text={q.content} />
      </div>
      
      {q.options && (
        <div className="qb-card-options">
          {q.options.map((opt, idx) => (
            <div key={idx} className="qb-card-option">
              <TextWithLatex text={opt} />
            </div>
          ))}
        </div>
      )}
      
      <div className="qb-card-actions">
        <button 
          className={`qb-action-btn ${expandedAnswers.has(q.id) ? 'active' : ''}`}
          onClick={() => toggleAnswer(q.id)}
        >
          {expandedAnswers.has(q.id) ? '收起答案' : '查看答案'}
        </button>
      </div>
      
      {expandedAnswers.has(q.id) && (
        <div className="qb-answer-section">
          <div className="qb-answer-row">
            <span className="qb-answer-label">答案：</span>
            <span className="qb-answer-text"><TextWithLatex text={q.answer} /></span>
          </div>
          
          <div className="qb-analysis-toggle">
            <button
              className={`qb-action-btn secondary ${expandedAnalysis.has(q.id) ? 'active' : ''}`}
              onClick={() => toggleAnalysis(q.id)}
            >
              {expandedAnalysis.has(q.id) ? '收起解析' : '展开解析'}
            </button>
          </div>
          
          {expandedAnalysis.has(q.id) && (
            <div className="qb-analysis-section">
              <div className="qb-analysis-content">
                <TextWithLatex text={q.analysis} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    )
  }
  
  return (
    <div className="question-bank">
      <div className="qb-sidebar">
        <div className="qb-sidebar-header">
          <h2>📚 题库</h2>
        </div>
        
        <div className="qb-search">
          <input
            type="text"
            placeholder="搜索题目..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="qb-search-input"
          />
        </div>
        
        <div className="qb-filter-tabs">
          <button
            className={`qb-filter-tab ${filterMode === 'year' ? 'active' : ''}`}
            onClick={() => handleFilterModeChange('year')}
          >
            年份
          </button>
          <button
            className={`qb-filter-tab ${filterMode === 'chapter' ? 'active' : ''}`}
            onClick={() => handleFilterModeChange('chapter')}
          >
            章节
          </button>
          <button
            className={`qb-filter-tab ${filterMode === 'knowledge' ? 'active' : ''}`}
            onClick={() => handleFilterModeChange('knowledge')}
          >
            知识点
          </button>
          <button
            className={`qb-filter-tab ${filterMode === 'method' ? 'active' : ''}`}
            onClick={() => handleFilterModeChange('method')}
          >
            方法
          </button>
          <button
            className={`qb-filter-tab favorite ${filterMode === 'favorites' ? 'active' : ''}`}
            onClick={() => handleFilterModeChange('favorites')}
          >
            ★ 收藏夹
          </button>
        </div>
        
        <div className="qb-favorites-toggle">
          <button
            className={`qb-toggle-favorite-btn ${showOnlyFavorites ? 'active' : ''}`}
            onClick={toggleShowFavorites}
          >
            <span className="qb-toggle-icon">{showOnlyFavorites ? '★' : '☆'}</span>
            <span>只看收藏</span>
            {favorites.size > 0 && (
              <span className="qb-favorites-badge">{favorites.size}</span>
            )}
          </button>
        </div>
        
        <div className="qb-status-filter">
          <div className="qb-status-filter-label">状态筛选</div>
          <div className="qb-status-filter-btns">
            <button
              className={`qb-status-filter-btn ${statusFilter === null ? 'active' : ''}`}
              onClick={() => setStatusFilter(null)}
            >
              全部
            </button>
            <button
              className={`qb-status-filter-btn correct ${statusFilter === 'correct' ? 'active' : ''}`}
              onClick={() => setStatusFilter('correct')}
            >
              ✓ 做对
            </button>
            <button
              className={`qb-status-filter-btn wrong ${statusFilter === 'wrong' ? 'active' : ''}`}
              onClick={() => setStatusFilter('wrong')}
            >
              ✗ 做错
            </button>
            <button
              className={`qb-status-filter-btn undone ${statusFilter === 'unDone' ? 'active' : ''}`}
              onClick={() => setStatusFilter('unDone')}
            >
              ○ 未做
            </button>
          </div>
        </div>
        
        {filterMode === 'favorites' ? (
          <div className="qb-favorites-info">
            <div className="qb-favorites-stats">
              <div className="qb-favorites-stat">
                <span className="qb-favorites-stat-icon">★</span>
                <span className="qb-favorites-stat-label">已收藏</span>
                <span className="qb-favorites-stat-count">{favorites.size}题</span>
              </div>
            </div>
            {favorites.size === 0 && (
              <div className="qb-favorites-empty">
                <p>暂无收藏题目</p>
                <p className="qb-favorites-hint">点击题目右上角的☆收藏题目</p>
              </div>
            )}
          </div>
        ) : filterMode === 'year' ? (
          <div className="qb-year-list">
            {filteredYears.map(year => (
              <div
                key={year}
                className={`qb-year-item ${selectedYear === year ? 'active' : ''}`}
                onClick={() => handleYearSelect(year)}
              >
                <span className="qb-year-label">{year}年</span>
                <span className="qb-year-count">
                  {getFilteredCount('year', year)}题
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="qb-filter-list">
            <div
              className={`qb-filter-item ${!selectedFilter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(null)}
            >
              <span className="qb-filter-label">全部</span>
            </div>
            {(filterMode === 'chapter' ? filteredChapters :
              filterMode === 'knowledge' ? filteredKnowledgePoints :
              filteredMethods).length === 0 ? (
              <div className="qb-filter-empty">
                <div className="qb-filter-empty-icon">🔍</div>
                <div className="qb-filter-empty-text">当前筛选条件下无匹配项</div>
                <div className="qb-filter-empty-hint">请调整状态筛选或收藏筛选</div>
              </div>
            ) : (
              (filterMode === 'chapter' ? filteredChapters :
                filterMode === 'knowledge' ? filteredKnowledgePoints :
                filteredMethods).map(opt => (
                <div
                  key={opt}
                  className={`qb-filter-item ${selectedFilter === opt ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(opt)}
                >
                  <span className="qb-filter-label">{opt}</span>
                  <span className="qb-filter-count">
                    {getFilteredCount(filterMode, opt)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <div className="qb-main">
        {displayQuestions.length > 0 ? (
          <div className="qb-questions-view">
            <div className="qb-view-header">
              <h2>
                {filterMode === 'favorites' ? '★ 收藏夹' :
                 showOnlyFavorites ? `★ ${selectedYear}年题目` :
                 filterMode === 'year' ? `${selectedYear}年题目` :
                 selectedFilter ? selectedFilter : '全部题目'}
              </h2>
              <span className="qb-view-count">共 {displayQuestions.length} 题</span>
            </div>
            
            <div className="qb-questions-list">
              {displayQuestions.map(q => renderQuestionCard(q))}
            </div>
          </div>
        ) : (
          <div className="qb-empty-state">
            <div className="qb-empty-icon">
              {filterMode === 'favorites' ? '☆' : showOnlyFavorites ? '☆' : '📝'}
            </div>
            <div className="qb-empty-text">
              {filterMode === 'favorites' ? '暂无收藏题目' :
               showOnlyFavorites ? '当前筛选条件下无收藏题目' :
               filterMode === 'year' ? '请从左侧选择年份' : '请从左侧选择分类'}
            </div>
            <div className="qb-empty-hint">
              {filterMode === 'favorites' ? '点击题目右上角的☆收藏题目' :
               showOnlyFavorites ? '取消"只看收藏"或收藏更多题目' : '点击左侧选项查看对应题目'}
            </div>
          </div>
        )}
      </div>
      
      <ContentPopup
        visible={popupVisible}
        type={popupType}
        data={popupData}
        isFavorite={popupType === 'formula' 
          ? formulaFavorites.has(popupData?.id) 
          : conceptFavorites.has(popupData?.id)}
        onClose={closePopup}
        onToggleFavorite={togglePopupFavorite}
      />
    </div>
  )
}

export default QuestionBank
