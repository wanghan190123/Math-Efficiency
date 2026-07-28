import React, { useState, useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './ConceptTheorem.css'

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

const isMathExpression = (text: string): boolean => {
  const mathPattern = /[a-zA-Z]+\s*[=<>≤≥≠≈]|\([^)]*\)|\[[^\]]*\]|\{[^}]*\}|[∑∏∫∂∇√]|_[$_0-9i-jknmrxy]|\^[$_0-9i-jknmrxyTta-f]|\\[a-zA-Z]+/
  return mathPattern.test(text) || containsMathUnicode(text)
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
    /[\(\[][^\)\]]*[∈⊂⊃⊆⊇∪∩∅∀∃⇒⇔→←↔][^\)\]]*[\)\]]/g,
    /[\(\[][^\)\]]*[\+\-\×÷\·][^\)\]]*[\)\]]/g,
    /[\(\[][^\)\]]*[≤≥≠≈≡][^\)\]]*[\)\]]/g,
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

interface Concept {
  id: string
  name: string
  category: string
  definition: string
  plainTranslation: string
  whyNeedIt: string
  example?: string
  formula?: string
}

const chapters = [
  {
    id: 'chapter1',
    name: '第一章 极限与连续',
    concepts: [
      {
        id: 'neighborhood',
        name: '邻域',
        category: '基础概念',
        definition: '设 a 为实数，δ > 0。称开区间 (a - δ, a + δ) 为点 a 的 δ 邻域，记作 U(a, δ)，即 U(a, δ) = {x | |x - a| < δ}。',
        plainTranslation: '邻域就像以某个点为中心的一个"朋友圈"。比如你说"在小明家附近"，这个"附近"就是一个邻域——以小明家为圆心、一定距离为半径的圆形区域。数学上用"距离小于某个正数"来精确描述这个"附近"。',
        whyNeedIt: '邻域是研究函数局部性质的基础工具。当我们说"当x靠近a点时，函数f(x)会怎样"，这个"靠近"的范围就是邻域。没有邻域概念，我们就没法精确描述"在某个点附近"这种无限接近的过程。',
        formula: 'U(a, \\delta) = \\{x \\mid |x - a| < \\delta\\}',
        example: 'U(2, 0.5) = {x | |x - 2| < 0.5} = (1.5, 2.5)，这就是点2的0.5邻域。'
      },
      {
        id: 'deleted-neighborhood',
        name: '去心邻域',
        category: '基础概念',
        definition: '设 a 为实数，δ > 0。称集合 {x | 0 < |x - a| < δ} 为点 a 的 δ 去心邻域，记作 U°(a, δ)。即邻域去掉中心点后的区域。',
        plainTranslation: '去心邻域就是"不包括中心点"的邻域。就像你说"在小明家附近，但不包括小明家"。这在研究极限时很重要，因为极限只关心"越来越近"的过程，不关心"到达"那个点——即使函数在那个点没有定义，也不影响极限的存在。',
        whyNeedIt: '去心邻域是极限定义的核心组成部分。函数极限的ε-δ定义要求函数在去心邻域内有定义，因为我们关心的是x"趋向于"a时的行为，而不是在a点的值。很多函数在某点没有定义，但我们仍然可以讨论它趋向于该点时的极限。',
        formula: 'U^\\circ(a, \\delta) = \\{x \\mid 0 < |x - a| < \\delta\\}',
        example: 'U°(2, 0.5) = {x | 0 < |x - 2| < 0.5} = (1.5, 2) ∪ (2, 2.5)，这是点2的去心邻域，不包括x=2本身。'
      },
      {
        id: 'limit-sequence',
        name: '数列极限',
        category: '极限',
        definition: '设 {xₙ} 为数列，A 为常数。若对于任意给定的 ε > 0，总存在正整数 N，使得当 n > N 时，恒有 |xₙ - A| < ε，则称数列 {xₙ} 收敛于 A，记作 lim(xₙ) = A 或 xₙ → A (n→∞)。',
        plainTranslation: '想象你在追赶一个目标。当你离目标还有一段距离时，你每走一步都会更近一些。数列极限就是"不管你要求多接近，我总能找到一个时刻，从这之后我一直满足你的要求"。就像你和朋友约定"无论你说什么时候见面，我都保证在那之后5分钟内到达"，但这里说的是"无论你要求多近的距离，我都能找到从哪一步开始一直保持那么近"。',
        whyNeedIt: '极限是整个微积分的基石。没有极限，就没有连续、没有导数、没有积分。数列极限帮助我们理解"无限趋近"这个看似矛盾的概念：永远达不到却又越来越近。它让我们能用有限的语言描述无限的过程，这是数学的一大飞跃。',
        formula: '\\lim_{n \\to \\infty} x_n = A',
        example: '数列 xₙ = 1 + 1/n，极限为 1。无论 ε 多小，我们都能找到 N：当 n > N 时，|1 + 1/n - 1| = 1/n < ε。'
      },
      {
        id: 'sequence-uniqueness',
        name: '收敛数列的唯一性',
        category: '数列极限性质',
        definition: '若数列 {xₙ} 收敛，则它的极限唯一。',
        plainTranslation: '这就像一座山的最高峰——你可能从不同路线上山，但到达的"最高点"只有一个。数列极限也是这样：无论你从哪个方向（用哪种方式）接近，趋向的目标只能是唯一的一个数。不可能既趋向于3又趋向于5，那样就不叫"极限"了。',
        whyNeedIt: '极限唯一性是极限理论的基础。它保证了当我们说"数列的极限"时，这个值是唯一确定的，不会出现歧义。这让数学讨论有了明确的意义，也为后续证明收敛数列的其他性质奠定了基础。',
        example: '数列 xₙ = (-1)ⁿ/n 收敛于 0。虽然各项正负交替，但无论 n 多大，最终都趋向于唯一的极限 0。'
      },
      {
        id: 'sequence-boundedness',
        name: '收敛数列的有界性',
        category: '数列极限性质',
        definition: '若数列 {xₙ} 收敛，则它必定有界。即存在 M > 0，使得对所有正整数 n，恒有 |xₙ| ≤ M。',
        plainTranslation: '收敛的数列一定不会"无限飞出去"。就像一个气球，如果你一直吹，它会越飞越高（无界）；但如果它会稳定下来停留在某个高度附近，那它肯定被限制在一个范围内。有界性就是"被圈住"的意思——所有的项都落在某个确定的区间内。',
        whyNeedIt: '有界性是收敛的必要条件：收敛必定有界，有界不一定收敛。这个性质帮助我们判断数列是否可能收敛——如果一个数列无界，它肯定不收敛。它也是证明其他定理的重要工具。',
        example: '数列 xₙ = sin(n) 是有界的（|sin(n)| ≤ 1），但它不收敛（振荡）。这说明有界只是收敛的必要条件，不是充分条件。'
      },
      {
        id: 'sequence-sign-preserving',
        name: '收敛数列的保号性',
        category: '数列极限性质',
        definition: '若 lim(xₙ) = A > 0，则存在正整数 N，当 n > N 时，xₙ > 0。反之，若 lim(xₙ) = A < 0，则存在 N，当 n > N 时，xₙ < 0。',
        plainTranslation: '保号性说的是"极限是正的，那么从某一项开始数列也是正的"。就像你种一颗苹果树，虽然刚开始可能只是一棵小苗，但如果你知道它最终会长成大树（极限为正），那么从某个时候开始它肯定是一棵正增长的树，不会突然变成负的。',
        whyNeedIt: '保号性在证明中非常有用。它帮助我们确定数列项的符号性质，特别是在证明不等式和方程根的存在性时。这个性质让极限的符号能够"传递"到数列的项上。',
        example: '若 lim(xₙ) = 2 > 0，则存在 N，当 n > N 时，xₙ > 0。比如数列 xₙ = 2 + 1/n，从第一项开始就是正的。'
      },
      {
        id: 'limit-function',
        name: '函数极限',
        category: '极限',
        definition: '设函数 f(x) 在点 x₀ 的某一去心邻域内有定义，A 为常数。若对于任意给定的 ε > 0，总存在 δ > 0，使得当 0 < |x - x₀| < δ 时，恒有 |f(x) - A| < ε，则称 A 为函数 f(x) 当 x 趋向于 x₀ 时的极限，记作 lim(x→x₀) f(x) = A。',
        plainTranslation: '函数极限说的是：当我靠近某个点时，函数值会越来越接近某个数。就像你看一座山：当你离山脚越来越近时，山看起来越来越高（函数值变大），但山的高度有个极限值。关键在于"靠近"这个过程本身，而不是你最终有没有到达那个点——即使你永远到不了，也能说极限是多少。',
        whyNeedIt: '函数极限让我们能研究函数在"边界"处的行为。即使函数在某个点没有定义，我们也可以讨论它"将要"有什么值。这对于理解连续性、导数、微分等概念至关重要。比如导数本质上就是函数极限：y对x的变化率在x趋向某个值时的极限。',
        formula: '\\lim_{x \\to x_0} f(x) = A',
        example: 'lim(x→0) sin(x)/x = 1。这个极限说明：当x越来越接近0时，sin(x)/x的值越来越接近1。'
      },
      {
        id: 'function-limit-uniqueness',
        name: '函数极限的唯一性',
        category: '函数极限性质',
        definition: '若 lim(x→x₀) f(x) 存在，则此极限唯一。',
        plainTranslation: '和数列极限一样，函数在趋近于某一点时，只能有一个极限值。就像无论你从左边还是右边看同一座山，山的"可见高度"应该是同一个值。如果左边看是100米，右边看是200米，那就不是真正的"极限"了。',
        whyNeedIt: '极限唯一性保证了函数极限定义的良好性。当我们讨论 lim(x→x₀) f(x) 时，这个值必须是唯一的，否则数学讨论就会出现混乱。这个性质是整个极限理论的基础。',
        example: 'lim(x→0) x² = 0。无论从左边还是右边趋近，函数值都趋向于 0，极限唯一。'
      },
      {
        id: 'function-local-boundedness',
        name: '函数极限的局部有界性',
        category: '函数极限性质',
        definition: '若 lim(x→x₀) f(x) = A 存在，则存在常数 M > 0 和 δ > 0，使得当 0 < |x - x₀| < δ 时，|f(x)| ≤ M。',
        plainTranslation: '局部有界性说的是：如果函数在某点有极限，那么在该点附近，函数值肯定被"控制住"了，不会无限大。就像你站在一座山的一个位置观察，即使山可能很高，但在你视野范围内（邻域内），你能看到的高度是有限的。',
        whyNeedIt: '这个性质告诉我们：有极限的函数在极限点附近一定是有界的。它帮助我们在处理极限问题时对函数值进行估计，是证明其他极限性质的重要工具。',
        example: 'lim(x→2) x² = 4，所以在 x=2 的某个去心邻域内，比如 (1.5, 2.5)，函数值不会超过 6.25（实际上 |x²| ≤ 6.25）。'
      },
      {
        id: 'limit-arithmetic',
        name: '极限的四则运算',
        category: '极限计算',
        definition: '若 lim f(x) = A，lim g(x) B 存在，则：\n(1) lim [f(x) ± g(x)] = A ± B\n(2) lim [f(x) · g(x)] = A · B\n(3) lim [f(x) / g(x)] = A / B (B ≠ 0)',
        plainTranslation: '极限的四则运算就是告诉我们：如何计算"和的极限"、"差的极限"、"积的极限"、"商的极限"。答案很简单：就是"极限的和"、"极限的差"、"极限的积"、"极限的商"。但要注意，这个法则成立的前提是两个函数的极限都存在。',
        whyNeedIt: '这个性质让极限计算变得简单高效。如果没有这个法则，我们每次求极限都要用定义证明。有了它，我们只需要知道简单函数的极限，就能计算出复杂函数的极限。这是微积分计算的基石。',
        formula: '\\lim[f(x) \\pm g(x)] = A \\pm B, \\quad \\lim[f(x) \\cdot g(x)] = A \\cdot B, \\quad \\lim\\frac{f(x)}{g(x)} = \\frac{A}{B}',
        example: 'lim(x→2) (x² + 3x) = lim x² + lim 3x = 4 + 6 = 10。'
      },
      {
        id: 'limit-composite',
        name: '复合函数的极限',
        category: '极限计算',
        definition: '若 lim(u→a) f(u) = A，且在 a 的某去心邻域内 g(x) ≠ a，则 lim(x→x₀) f(g(x)) = A。',
        plainTranslation: '复合函数的极限说的是一个"传递"关系：如果你知道里面的函数 g(x) 趋向于 a，外面的函数 f(u) 在 u 趋向于 a 时的极限是 A，那么整个复合函数 f(g(x)) 的极限就是 A。就像接力赛跑：一棒跑向交接点，二棒从交接点跑向终点。',
        whyNeedIt: '复合函数极限让我们能够处理"函数套函数"的情况。这是计算复杂函数极限的关键技巧，让我们在求极限时可以灵活地进行变量替换，把复杂问题转化为简单问题。',
        example: '求 lim(x→0) sin(x²)。令 u = x²，则 x→0 时 u→0，sin(u)→1，所以极限为 1。'
      },
      {
        id: 'important-limit-1',
        name: '重要极限一',
        category: '极限计算',
        definition: 'lim(x→0) sin(x)/x = 1',
        plainTranslation: '这是一个神奇的极限：当 x 趋向于 0 时，sin(x)/x 的值趋向于 1。它之所以重要，是因为它连接了三角函数和极限。从几何上看，这是因为当角度非常小时，弧和弦几乎一样长。',
        whyNeedIt: '这个极限是推导三角函数导数的基础。没有它，我们就无法求出 sin(x) 和 cos(x) 的导数，进而整个微分学都会受到影响。它还帮助我们理解"小角度近似"的概念。',
        formula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
        example: 'lim(x→0) sin(3x)/(3x) = 1，因此 lim(x→0) sin(3x)/x = 3。'
      },
      {
        id: 'important-limit-2',
        name: '重要极限二',
        category: '极限计算',
        definition: 'lim(x→∞) (1 + 1/x)^x = e，其中 e 是自然常数，约等于 2.71828。',
        plainTranslation: '这个极限描述了一个"复利"现象的极限。想象你有一块钱，每天利息100%，但利息是按复利计算的——每天结束时的本金会作为第二天利息的基础。如果利息结算次数趋向无穷多，最终的极限就是 e。它代表了"无限次增长"的极限值。',
        whyNeedIt: '自然常数 e 是数学中最重要的常数之一。这个极限在复利计算、概率论（正态分布）、微分方程等领域都有广泛应用。e^x 的导数还是它自己，这个性质也来源于此。',
        formula: '\\lim_{x \\to \\infty} (1 + \\frac{1}{x})^x = e',
        example: 'lim(x→∞) (1 + 2/x)^(x/2) = e。'
      },
      {
        id: 'infinite-limit',
        name: '无穷小与无穷大',
        category: '极限',
        definition: '无穷小是指当 x → x₀（或 x → ∞）时，函数值趋于 0 的变量。无穷大是指当 x → x₀（或 x → ∞）时，函数值无限增大的变量。记作：若 f(x) → 0，则 f(x) 是无穷小；若 |f(x)| → ∞，则 f(x) 是无穷大。',
        plainTranslation: '无穷小就像你手里的一把沙子，当你把手松开时，沙子不断往下掉，沙子的量趋向于0但永远不是0。无穷大则像你不断往气球里吹气，气球越来越大（数值无限增长），但永远吹不爆（没有上限）。它们描述的是两种极端的"趋向"状态。',
        whyNeedIt: '无穷小是微分和积分的基础。导数本质上是两个无穷小的比值的极限。无穷大帮助我们理解函数图像的"走向"，比如渐近线。它们是分析函数行为的重要工具，让我们能处理"无限"这个概念。',
        example: '当 x → 0 时，x²、sin(x)、tan(x) 都是无穷小。当 x → ∞ 时，x²、e^x、ln(x) 都是无穷大。'
      },
      {
        id: 'infinite-comparison',
        name: '无穷小的比较',
        category: '极限',
        definition: '设 α(x) 和 β(x) 都是无穷小。\n(1) 若 lim α/β = 0，称 α 是 β 的高阶无穷小\n(2) 若 lim α/β = ∞，称 α 是 β 的低阶无穷小\n(3) 若 lim α/β = c ≠ 0，称 α 与 β 是同阶无穷小\n(4) 若 lim α/β = 1，称 α 与 β 是等价无穷小，记作 α ~ β',
        plainTranslation: '无穷小比较说的是：两个都"趋向于0"的东西，它们趋向于0的速度有快慢之分。就像两个人跑向终点，速度快的"阶"更高。x² 比 x 更快趋向于0，所以 x² 是 x 的高阶无穷小。如果两个无穷小趋向于0的速度"差不多"，就是同阶；如果完全一样快，就是等价。',
        whyNeedIt: '无穷小比较让我们能精确描述不同无穷小"趋向于0的快慢"。这在误差分析、数值计算中很重要。微分就是用低阶无穷小近似复杂函数，等价无穷小替换是求极限的重要技巧。',
        example: '当 x → 0 时，x² 是 x 的高阶无穷小（lim x²/x = 0）。x 和 sin x 是等价无穷小（lim x/sin x = 1）。'
      },
      {
        id: 'continuity',
        name: '函数的连续性',
        category: '连续',
        definition: '设函数 f(x) 在点 x₀ 的某一邻域内有定义，若 lim(x→x₀) f(x) = f(x₀)，则称函数 f(x) 在点 x₀ 处连续。若函数在某区间内每一点都连续，则称该函数在该区间上连续。',
        plainTranslation: '连续就是"不断线"。想象你画一条曲线：如果笔不用抬起来就能画完，那就是连续的。数学上，连续意味着：当x变化很小的时候，f(x)的变化也很小。没有突然的跳跃，没有断裂。比如温度随时间变化就是连续的——温度不会从20度突然跳到25度，中间一定有个过程。',
        whyNeedIt: '连续性是微积分的核心前提。导数要求函数连续（否则切线不存在），积分要求函数在区间上连续（否则无法求面积）。很多重要定理（如介值定理、零点定理）都建立在连续性的基础上。实际应用中，连续函数更符合自然规律。',
        formula: '\\lim_{x \\to x_0} f(x) = f(x_0)',
        example: 'f(x) = x² 在 x = 2 处连续，因为 lim(x→2) x² = 4 = f(2)。几何上，抛物线 y = x² 是没有断裂的连续曲线。'
      },
      {
        id: 'continuous-function-operations',
        name: '连续函数的运算',
        category: '连续',
        definition: '若 f(x) 和 g(x) 都在 x₀ 处连续，则：\n(1) f(x) ± g(x) 在 x₀ 处连续\n(2) f(x) · g(x) 在 x₀ 处连续\n(3) f(x)/g(x) 在 x₀ 处连续（g(x₀) ≠ 0）',
        plainTranslation: '连续函数的运算性质告诉我们：连续函数进行加减乘除（分母不为零）运算后，结果还是连续函数。这就像"好基因会遗传"——连续性这个"好性质"在运算中不会丢失。这让判断复杂函数的连续性变得简单。',
        whyNeedIt: '这个性质大大简化了连续性的判断。我们不需要用定义去验证每一个复杂函数，只需要知道基本初等函数是连续的，再利用这个性质，就能知道由它们运算得到的函数也是连续的。',
        example: '已知 f(x) = x，g(x) = sin x 都连续，则 f(x)·g(x) = x·sin x 也连续。'
      },
      {
        id: 'elementary-function-continuity',
        name: '初等函数的连续性',
        category: '连续',
        definition: '基本初等函数（幂函数、指数函数、对数函数、三角函数、反三角函数）在其定义域内都是连续的。由基本初等函数经过有限次四则运算和复合运算得到的函数（初等函数）在其定义域内也是连续的。',
        plainTranslation: '初等函数连续性定理告诉我们：我们在高中大学学的所有"正规"函数（多项式、指数、对数、三角等）都是连续的。这个"大礼包"性质让我们不需要逐点验证连续性，直接就能说"这个函数在其定义域内是连续的"。就像我们知道所有哺乳动物都是温血动物，就不需要逐个测量体温。',
        whyNeedIt: '这是微分学的理论基础。既然初等函数在定义域内都连续，我们就可以放心地对其进行求导、积分等操作。这个性质让微积分能够广泛应用到各种函数上，大大简化了理论推导和实际计算。',
        example: 'f(x) = x³ + e^x + ln(x) 是初等函数，所以在它的定义域 (0, +∞) 内连续。'
      },
      {
        id: 'intermediate-value',
        name: '介值定理',
        category: '连续',
        definition: '设函数 f(x) 在闭区间 [a, b] 上连续，且 f(a) ≠ f(b)。若 C 是介于 f(a) 和 f(b) 之间的任意实数，则至少存在一点 ξ ∈ (a, b)，使得 f(ξ) = C。',
        plainTranslation: '介值定理其实说的是一个很朴素的道理：如果你从山脚走到山顶，海拔一定经过中间的每一个高度——你不可能"跳"过某个高度。它告诉我们：连续函数在两个值之间一定取到过中间所有的值。就像温度从10度升到30度，一定经过20度、25度等所有中间值。',
        whyNeedIt: '介值定理是很多重要证明的基础。它可以用来证明方程根的存在（比如证明 x³ + x - 1 = 0 一定有实根），是分析学中的核心工具。它虽然简单，但作用巨大——告诉我们在连续的前提下，"中间值一定被取到"。',
        example: '设 f(x) = x² - 2，在 [1, 2] 上连续，f(1) = -1，f(2) = 2，所以 f(x) = 0 在 (1, 2) 内一定有解。实际上 x = √2 ≈ 1.414 就是这个解。'
      },
      {
        id: 'zero-point-theorem',
        name: '零点定理',
        category: '连续',
        definition: '设函数 f(x) 在闭区间 [a, b] 上连续，且 f(a) · f(b) < 0，则至少存在一点 ξ ∈ (a, b)，使得 f(ξ) = 0。',
        plainTranslation: '零点定理是介值定理的特例：如果你从负数走到正数（或者从正数走到负数），中间一定经过零。这就像你开车从北京出发到广州，里程表一定会经过0公里（出发时）——但更准确地说，如果你从家出发时距离公司的距离是-5公里（负数表示还没到），到公司时是10公里，中间一定有一个点距离是0。',
        whyNeedIt: '零点定理是证明方程根存在的强大工具。当我们知道一个连续函数在两点的符号相反时，我们就能断定在它们之间至少有一个根。这是数值方法（如二分法）求方程近似解的理论基础。',
        example: 'f(x) = x³ - x - 1，在 [1, 2] 上连续，f(1) = -1 < 0，f(2) = 5 > 0，所以方程 x³ - x - 1 = 0 在 (1, 2) 内有解。'
      },
      {
        id: 'max-value-theorem',
        name: '最大值定理',
        category: '连续',
        definition: '设函数 f(x) 在闭区间 [a, b] 上连续，则 f(x) 在 [a, b] 上一定能取得最大值和最小值。即存在 ξ₁, ξ₂ ∈ [a, b]，使得 f(ξ₁) ≤ f(x) ≤ f(ξ₂) 对所有 x ∈ [a, b] 成立。',
        plainTranslation: '最大值定理说的是：在闭区间上的连续函数，一定有最高点和最低点。就像你在一个有限的时间段内观察温度变化，温度一定会有一个最高值和一个最低值——它不会无限上升或下降。这个定理保证了"极值"的存在性，是微分学的重要基础。',
        whyNeedIt: '没有最大值定理，很多重要结论都不成立。它保证了连续函数在闭区间上"有界"且"能取到界"。这是求最优化问题的理论前提——如果最大值都不存在，还谈什么求最大值？很多经济学、物理学中的最优化问题都依赖于这个定理。',
        example: 'f(x) = x² 在 [0, 1] 上连续，最小值在 x = 0 处为 0，最大值在 x = 1 处为 1。'
      },
      {
        id: 'boundedness-theorem',
        name: '有界性定理',
        category: '连续',
        definition: '设函数 f(x) 在闭区间 [a, b] 上连续，则 f(x) 在 [a, b] 上有界。即存在 M > 0，使得 |f(x)| ≤ M 对所有 x ∈ [a, b] 成立。',
        plainTranslation: '有界性定理说的是：在有限区间上的连续函数，函数值不会"飞向无穷"。就像你在有限的时间和空间内观察一个连续变化的物理量，它一定被限制在某个范围内。这是对"连续变化"的一种约束保证。',
        whyNeedIt: '有界性是积分存在的重要条件。如果函数无界，就可能无法求积分（有反例）。这个定理保证了在闭区间上连续的函数一定可以积分，这是黎曼积分理论的基本前提。',
        example: 'f(x) = sin(x) 在 [-100, 100] 上连续，所以 |sin(x)| ≤ 1，有界。'
      },
      {
        id: 'heine-theorem',
        name: '海涅定理（归结原则）',
        category: '极限',
        definition: 'lim(x→x₀) f(x) = A 的充分必要条件是：对于任意收敛于 x₀ 的数列 {xₙ}（xₙ ≠ x₀），都有 lim(n→∞) f(xₙ) = A。',
        plainTranslation: '海涅定理是连接"函数极限"和"数列极限"的桥梁！它告诉我们：函数极限存在 ⇔ 所有趋向于该点的数列对应的函数值都趋向于同一个数。这意味着我们可以用数列来研究函数极限，反过来也可以用函数极限来研究数列极限。',
        whyNeedIt: '海涅定理是证明极限性质的重要工具。在理论证明中，经常需要把函数极限问题转化为数列极限问题来处理。它也是判断函数极限不存在的利器：只要找到两个收敛于 x₀ 的数列，但对应的函数值极限不同，就能说明函数极限不存在。',
        example: '证明 lim(x→0) sin(1/x) 不存在。取数列 xₙ = 1/(2nπ)，则 sin(1/xₙ) = sin(2nπ) = 0；取 xₙ\' = 1/((2n+1)π)，则 sin(1/xₙ\') = sin((2n+1)π) = 0... 实际上需要取 xₙ = 2/(nπ)，sin(1/xₙ) = sin(nπ/2)，随 n 变化极限不同。'
      },
      {
        id: 'squeeze-theorem',
        name: '夹逼准则',
        category: '极限',
        definition: '若在 x₀ 的某去心邻域内有 g(x) ≤ f(x) ≤ h(x)，且 lim(x→x₀) g(x) = lim(x→x₀) h(x) = A，则 lim(x→x₀) f(x) = A。',
        plainTranslation: '夹逼准则就是"三明治定理"——如果函数被两个极限相同的函数夹在中间，那么它的极限也一定是这个值。就像两边都是 1，中间不管怎么折腾，极限也是 1。这是计算复杂极限的利器！',
        whyNeedIt: '夹逼准则让我们能计算那些"夹在中间"的函数的极限。很多重要极限（如重要极限一 lim(x→0) sin(x)/x）都是用夹逼准则证明的。它也是证明不等式的重要工具。',
        example: '证明 lim(x→0) x²·sin(1/x) = 0。因为 -x² ≤ x²·sin(1/x) ≤ x²，且 lim(x→0) -x² = lim(x→0) x² = 0，所以极限为 0。'
      },
      {
        id: 'stolz-theorem',
        name: 'Stolz定理',
        category: '极限计算',
        definition: '若数列 {xₙ} 和 {yₙ} 满足：yₙ 严格递增，yₙ → ∞，且 lim(x→∞) (xₙ₊₁ - xₙ)/(yₙ₊₁ - yₙ) = L，则 lim(n→∞) xₙ/yₙ = L。',
        plainTranslation: 'Stolz定理是"洛必达法则的离散版本"！它把求两个趋于无穷大的数列之比的极限，转化为求它们"差值"之比的极限。这在处理复杂的数列极限时非常有用。',
        whyNeedIt: 'Stolz定理让我们能处理"∞/∞"型的数列极限。很多用常规方法难以解决的数列极限问题，用Stolz定理可以迎刃而解。它是数列极限计算的重要工具。',
        example: '求 lim(n→∞) (1+2+...+n)/n²。因为 yₙ = n² 严格递增且 → ∞，所以 (xₙ₊₁ - xₙ)/(yₙ₊₁ - yₙ) = (n+1)/( (n+1)² - n² ) = (n+1)/(2n+1) → 1/2，所以极限为 1/2。'
      },
      {
        id: 'sequence-preserve-inequality',
        name: '数列极限的保不等式性',
        category: '数列极限性质',
        definition: '若 lim aₙ = a, lim bₙ = b，且存在正整数 N，当 n > N 时有 aₙ ≤ bₙ，则 a ≤ b。',
        plainTranslation: '如果两个数列从某项开始，一个始终不超过另一个，那么它们的极限也保持这个不等关系。注意极限不能保持严格不等号：aₙ < bₙ 只能推出 a ≤ b，不能推出 a < b。',
        whyNeedIt: '保不等式性是极限理论中比较大小的基础工具。它说明极限运算保持了大小关系的"方向"，但严格不等可能变成非严格。这在证明极限的序关系时不可或缺。',
        formula: '\\lim a_n \\leq \\lim b_n'
      },
      {
        id: 'subsequence-theorem',
        name: '子数列定理',
        category: '数列极限性质',
        definition: '若数列 {xₙ} 收敛于 a，则其任何子数列也收敛于 a。若数列有两个子数列收敛于不同极限，则原数列发散。',
        plainTranslation: '就像一家人的血统——不管你挑出哪个成员来检验，都应该有相同的"基因"。如果一个数列真的收敛，随便取一个子列（比如只取偶数项、只取奇数项），都应该收敛到同一个值。反过来说，如果你发现奇数项趋向3、偶数项趋向5，那整个数列就发散了。',
        whyNeedIt: '子数列定理是判断数列发散的有力工具：找到两个子数列趋向不同值即可证明发散。也说明收敛数列的"一致性"——任何局部都反映整体趋势。',
        formula: '\\lim_{n\\to\\infty} x_n = a \\Rightarrow \\lim_{k\\to\\infty} x_{n_k} = a'
      },
      {
        id: 'function-limit-preserve-sign',
        name: '函数极限的局部保号性',
        category: '函数极限',
        definition: '若 lim f(x) = A > 0（x→x₀），则存在δ>0，使得在去心邻域 U°(x₀,δ) 内 f(x) > 0。更一般地，若 A > B，则在某去心邻域内 f(x) > B。',
        plainTranslation: '如果函数的极限是正数，那么在极限点"附近"函数值也一定是正的。就像你月薪1万，那附近几个月的工资都不太可能是负数。注意"附近"意味着只保证局部为正，不保证全部。',
        whyNeedIt: '局部保号性是极限理论中联系"整体趋势"与"局部行为"的桥梁。它常用于证明不等式、判断函数在某邻域内的符号。',
        formula: '\\lim_{x\\to x_0} f(x) = A > 0 \\Rightarrow \\exists \\delta > 0, \\forall x \\in U^\\circ(x_0,\\delta): f(x) > 0'
      },
      {
        id: 'heine-converse',
        name: '函数极限与数列极限的关系（海涅定理的逆用）',
        category: '极限',
        definition: '若对任何 xₙ → x₀（xₙ ≠ x₀），都有 f(xₙ) → A，则 lim f(x) = A（x→x₀）。即若函数沿任何趋近路径的极限都等于A，则函数极限存在且等于A。',
        plainTranslation: '海涅定理告诉我们：函数极限可以用数列极限来"翻译"。正用：函数极限存在→任何数列极限都相同；逆用：如果所有路径都走向同一个地方，那函数极限就存在。这是把函数极限转化为数列极限来证明的重要方法。',
        whyNeedIt: '海涅定理是沟通函数极限和数列极限的桥梁。逆用可以证明函数极限存在；正用常用来证明极限不存在——找两个数列趋向不同值即可。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter2',
    name: '第二章 导数与微分',
    concepts: [
      {
        id: 'derivative',
        name: '导数',
        category: '基本概念',
        definition: '设函数 y = f(x) 在点 x₀ 的某一邻域内有定义，若极限 lim(Δx→0) [f(x₀+Δx) - f(x₀)] / Δx 存在，则称此极限为函数 f(x) 在点 x₀ 处的导数，记作 f\'(x₀) 或 dy/dx。',
        plainTranslation: '导数描述的是"变化率"——当你稍微动一点，函数值会变多少。就像汽车的速度表：某一时刻的速度就是位置对时间的导数。它告诉我们函数在某一点的"敏感程度"：如果导数大，说明函数对这个点的变化非常敏感；导数小，说明变化很慢。',
        whyNeedIt: '导数是解决实际问题的利器。物理中求速度和加速度，经济学中求边际成本，生物学中求增长率，都离不开导数。它让我们能精确描述"变化"这个无处不在的现象。导数还帮助我们找到函数的极值点（最大值、最小值），优化问题离不开它。',
        formula: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}",
        example: 'f(x) = x² 的导数是 f\'(x) = 2x。在 x = 3 处，f\'(3) = 6，意味着当 x 变化一点点时，x² 的变化大约是 6 倍的那个"一点点"。'
      },
      {
        id: 'derivative-geometric-meaning',
        name: '导数的几何意义',
        category: '基本概念',
        definition: '函数 y = f(x) 在点 (x₀, f(x₀)) 处的导数 f\'(x₀)，等于曲线在该点处切线的斜率。切线方程为：y - f(x₀) = f\'(x₀)(x - x₀)。',
        plainTranslation: '导数的几何意义就是"切线斜率"。想象你站在一条弯曲的山路上，在某一点处如果你能修一条路让汽车刚好滑上去而不翻车，这条路就是切线。导数就告诉了我们这条切线的倾斜程度——导数越大，切线越陡；导数越小，切线越平缓。',
        whyNeedIt: '导数的几何意义让抽象的"变化率"变得可视化。通过切线，我们可以用几何直观理解导数的含义。这在工程设计（如斜坡设计）、物理学（如力的分解）中有广泛应用。它也是后续学习微分方程、曲线绘制的重要基础。',
        formula: "y - f(x_0) = f'(x_0)(x - x_0)",
        example: '对于 f(x) = x²，在 x₀ = 1 处，f\'(1) = 2，所以切线方程是 y - 1 = 2(x - 1)，即 y = 2x - 1。'
      },
      {
        id: 'derivability-continuity',
        name: '可导与连续的关系',
        category: '基本概念',
        definition: '若函数 f(x) 在点 x₀ 处可导，则 f(x) 必在 x₀ 处连续。反之，连续不一定可导。',
        plainTranslation: '可导必定连续——如果你能求导数（变化率），那函数一定是连续的（没有断裂）。但连续不一定可导——函数连续不代表它光滑，可能有"尖角"。就像一条山路可能是连续的（有路连通），但有些地方是急转弯（导数不存在）。',
        whyNeedIt: '这个关系帮助我们判断函数的可导性。当我们要对一个函数求导时，首先检查它是否连续；如果不连续，就直接判定不可导。这节省了很多不必要的计算。在实际应用中，连续但不可导的情况（如股票价格的随机波动）也很有研究价值。',
        example: 'f(x) = |x| 在 x = 0 处连续，但不可导。因为左右导数不相等：f\'₊(0) = 1，f\'₋(0) = -1。几何上，x = 0 处有一个"尖角"。'
      },
      {
        id: 'differential',
        name: '微分',
        category: '微分',
        definition: '设函数 y = f(x) 在点 x 处的增量 Δy = f(x + Δx) - f(x) 可表示为 Δy = A·Δx + o(Δx)，其中 A 与 Δx 无关，则称函数在点 x 处可微，并称 A·Δx 为函数在点 x 处的微分，记作 dy = A·Δx = f\'(x)dx。',
        plainTranslation: '微分就是"线性近似"——当变化很小时，函数的变化量可以近似看成"导数乘以变化量"。就像你测量一块很小的土地，可以用长乘以宽来近似面积（这就是微分），虽然实际上会有误差，但这个误差很小很小（o(Δx)）。',
        whyNeedIt: '微分让我们能用简单的线性运算近似复杂的非线性问题。这是数值计算的基础：求复杂函数的近似值、误差估计、线性化建模等都离不开微分。它连接了理论和实际，是工程计算的重要工具。',
        formula: 'dy = f\'(x)dx',
        example: '对于 f(x) = x²，在 x = 1 处，df = 2x·dx = 2dx。当 dx = 0.01 时，dy ≈ 2 × 0.01 = 0.02。实际增量 Δy = (1.01)² - 1² = 0.0201，误差仅为 0.0001。'
      },
      {
        id: 'derivative-rules',
        name: '导数的四则运算',
        category: '求导法则',
        definition: '若 u(x) 和 v(x) 均可导，则：\n(1) (u ± v)\' = u\' ± v\'\n(2) (u·v)\' = u\'v + uv\'\n(3) (u/v)\' = (u\'v - uv\')/v² (v ≠ 0)',
        plainTranslation: '导数的四则运算就是告诉我们：如何求"和的导数"、"差的导数"、"积的导数"、"商的导数"。答案同样简单：就是"导数的和"、"导数的差"、"导数的积"、"导数的商"（注意积和商需要额外处理）。这让我们能把复杂函数拆分成简单函数来求导。',
        whyNeedIt: '这个法则让我们能把复杂函数的导数拆成简单函数的导数来计算。没有它，我们就只能用定义求导，那样会非常麻烦。这个法则是求导计算的基石，大大简化了导数的计算。',
        formula: "(u \\pm v)' = u' \\pm v', \\quad (u \\cdot v)' = u'v + uv', \\quad (\\frac{u}{v})' = \\frac{u'v - uv'}{v^2}",
        example: 'f(x) = x³ + 2x² - 5x + 3，则 f\'(x) = 3x² + 4x - 5。'
      },
      {
        id: 'chain-rule',
        name: '复合函数求导法则',
        category: '求导法则',
        definition: '若 y = f(u)，u = g(x)，且 g(x) 在 x 处可导，f(u) 在对应 u 处可导，则复合函数 y = f(g(x)) 在 x 处可导，且 dy/dx = f\'(u)·g\'(x)。简言之：链式法则——"外层导数乘以内层导数"。',
        plainTranslation: '复合函数求导就是"层层剥笋"——从外到内，每一层都要求导然后相乘。就像一个传递系统：电机转动带动皮带，皮带带动齿轮——总转速是各个环节转速的乘积。复合函数求导就是把所有环节的导数乘起来。',
        whyNeedIt: '复合函数求导法则让我们能处理"函数套函数"的复杂情况。这是求导计算中最重要，最常用的法则之一。掌握了它，我们就能求任何初等函数的导数。它也是理解反向传播算法（深度学习的基础）的关键。',
        formula: "\\frac{dy}{dx} = f'(u) \\cdot g'(x)",
        example: '求 y = sin(x²) 的导数。令 u = x²，则 y = sin u，dy/du = cos u，du/dx = 2x，所以 dy/dx = cos(x²) · 2x = 2x·cos(x²)。'
      },
      {
        id: 'inverse-function-derivative',
        name: '反函数求导法则',
        category: '求导法则',
        definition: '若函数 x = f⁻¹(y) 是函数 y = f(x) 的反函数，且 f\'(x) ≠ 0，则反函数的导数为：(f⁻¹)\'(y) = 1 / f\'(x)，其中 x 和 y 的关系为 y = f(x)。',
        plainTranslation: '反函数求导法则告诉我们：求反函数的导数，只需要把原函数导数取倒数。就像你和朋友互相传球，你传球的力度和他的回球力度的乘积是1（如果完美反弹）。这个法则让我们能从已知函数的导数推出其反函数的导数。',
        whyNeedIt: '反函数求导法则让我们能求指数函数、对数函数，反三角函数等反函数的导数。这是求导工具箱中的重要一环。没有它，很多复杂函数的导数就无法求出。',
        formula: "(f^{-1})'(y) = \\frac{1}{f'(x)}",
        example: '求 y = arcsin(x) 的导数。因为 x = sin(y)，dx/dy = cos(y)，所以 dy/dx = 1/cos(y) = 1/√(1 - sin²(y)) = 1/√(1 - x²)。'
      },
      {
        id: 'implicit-derivation',
        name: '隐函数求导',
        category: '求导法则',
        definition: '由方程 F(x, y) = 0 确定的隐函数 y = f(x)，若 F 在点 (x₀, y₀) 的某邻域内连续且有连续偏导数，且 F(x₀, y₀) = 0，Fᵧ(x₀, y₀) ≠ 0，则隐函数存在且可导，其导数为 dy/dx = -Fₓ/Fᵧ。',
        plainTranslation: '隐函数求导是处理"没有显式解"的方程的利器。有些函数关系不好写成 y = f(x) 的形式，比如 x² + y² = 1（圆）。但我们仍然可以求导——对两边同时求导，然后把 dy/dx 解出来。这就像从"约束条件"中"挤出"变化率。',
        whyNeedIt: '隐函数求导让我们能处理那些无法显式表达或不易显式表达的函数关系。这是数学分析中的重要工具，在几何、物理、经济学中都有广泛应用。比如求曲线的切线、讨论约束条件下的优化等。',
        formula: "\\frac{dy}{dx} = -\\frac{F_x}{F_y}",
        example: '对于 x² + y² = 1，两边对 x 求导：2x + 2y·dy/dx = 0，解得 dy/dx = -x/y。'
      },
      {
        id: 'parametric-derivation',
        name: '参数方程求导',
        category: '求导法则',
        definition: '设参数方程 x = φ(t)，y = ψ(t)，且 φ(t) 可导，ψ(t) 可导，φ\'(t) ≠ 0，则由参数方程确定的函数的导数为 dy/dx = ψ\'(t) / φ\'(t)。',
        plainTranslation: '参数方程求导说的是：当 x 和 y 都通过第三个变量 t 来表达时，如何求 dy/dx。答案是 y 对 t 的导数除以 x 对 t 的导数。这就像两个人跑步：如果你知道某时刻两人的速度，直接用速度比就能知道谁跑得更快。',
        whyNeedIt: '参数方程能表达很多普通函数无法表达的曲线（如椭圆、摆线）。参数方程求导让我们能研究这些曲线的切线、单调性等性质。在物理中，参数方程常用来描述物体的运动轨迹，这个法则就是求瞬时速度的基础。',
        formula: "\\frac{dy}{dx} = \\frac{\\psi'(t)}{\\phi'(t)}",
        example: '对于参数方程 x = t²，y = t³，求 dy/dx = (3t²)/(2t) = 3t/2。'
      },
      {
        id: 'higher-derivative',
        name: '高阶导数',
        category: '导数性质',
        definition: '函数 y = f(x) 的导数 f\'(x) 仍是 x 的函数，若 f\'(x) 仍可导，则称其导数为 f(x) 的二阶导数，记作 f\'\'(x) 或 d²y/dx²。类似地，可定义三阶、四阶乃至 n 阶导数，统称高阶导数。',
        plainTranslation: '高阶导数就是"导数的导数"。一阶导数是速度，二阶导数就是加速度——速度的变化率。三阶导数是加速度的变化率......每一阶都代表前一阶的"变化趋势"。这让我们能更深入地研究函数的性质。',
        whyNeedIt: '高阶导数在物理学中至关重要：位置的一阶导是速度，二阶导是加速度，三阶导是加加速度（在航天中很重要）。在数学中，高阶导数用于泰勒展开、判断极值、研究曲线性质等。它是深入分析函数行为的必备工具。',
        formula: "f''(x) = \\frac{d^2y}{dx^2} = \\frac{d}{dx}(\\frac{dy}{dx})",
        example: 'f(x) = x³，则 f\'(x) = 3x²，f\'\'(x) = 6x，f\'\'\'(x) = 6，f⁽⁴⁾(x) = 0。'
      },
      {
        id: 'differential-mean-value',
        name: '罗尔定理',
        category: '微分中值定理',
        definition: '若函数 f(x) 满足：(1) 在闭区间 [a, b] 上连续；(2) 在开区间 (a, b) 内可导；(3) f(a) = f(b)，则在 (a, b) 内至少存在一点 ξ，使得 f\'(ξ) = 0。',
        plainTranslation: '罗尔定理说的是：如果连续函数在区间两端值相等，并且在中间光滑可导，那么中间一定有一个"平坦点"（导数为零）。就像你从相同高度出发走一段路回到原高度，中间一定会有一个最高点或最低点，那里的坡度是平的。',
        whyNeedIt: '罗尔定理是微分中值定理家族的"祖先"。它是证明拉格朗日中值定理的基础，也是证明其他重要定理的关键工具。在实际应用中，它帮助我们找到函数的极值点。',
        example: 'f(x) = x² - 4x + 3 在 [0, 4] 上，f(0) = 3，f(4) = 3，满足 f(a) = f(b)。在 (0, 4) 内，f\'(x) = 2x - 4 = 0 时 x = 2，即 ξ = 2。'
      },
      {
        id: 'lagrange-mean-value',
        name: '拉格朗日中值定理',
        category: '微分中值定理',
        definition: '若函数 f(x) 满足：(1) 在闭区间 [a, b] 上连续；(2) 在开区间 (a, b) 内可导，则在 (a, b) 内至少存在一点 ξ，使得 f(b) - f(a) = f\'(ξ)(b - a)。',
        plainTranslation: '拉格朗日中值定理说的是：如果你从 A 点走到 B 点，中间一定有一个时刻，你的瞬时速度等于平均速度。这就像你开车从北京到上海，虽然有时快有时慢，但一定有一个时刻的速度正好等于全程的平均速度。这是微分学的核心定理之一。',
        whyNeedIt: '这个定理是微分学的基石，被称为"微分学核心定理"。它连接了函数在区间上的整体变化和导数（局部变化率）。所有利用导数研究函数整体性质的证明都离不开它。它也是证明不等式、研究函数单调性的基础。',
        formula: "f(b) - f(a) = f'(\\xi)(b - a)",
        example: 'f(x) = x² 在 [1, 3] 上，f(3) - f(1) = 9 - 1 = 8，平均变化率 = 8/2 = 4。f\'(x) = 2x，令 2ξ = 4，得 ξ = 2，确实在 (1, 3) 内。'
      },
      {
        id: 'cauchy-mean-value',
        name: '柯西中值定理',
        category: '微分中值定理',
        definition: '若函数 f(x) 和 g(x) 满足：(1) 在闭区间 [a, b] 上连续；(2) 在开区间 (a, b) 内可导；(3) g\'(x) ≠ 0，则在 (a, b) 内至少存在一点 ξ，使得 [f(b) - f(a)] / [g(b) - g(a)] = f\'(ξ) / g\'(ξ)。',
        plainTranslation: '柯西中值定理是拉格朗日定理的"双函数版本"。它说的是：如果两条曲线的参数化满足条件，那么它们在某点的切线斜率之比等于端点连线的斜率之比。这是参数方程形式的中值定理，也是洛必达法则的理论基础。',
        whyNeedIt: '柯西中值定理是洛必达法则的理论基础，也是处理参数曲线的基本工具。在证明微分学中的很多重要结论时，它都发挥着关键作用。',
        formula: "\\frac{f(b) - f(a)}{g(b) - g(a)} = \\frac{f'(\\xi)}{g'(\\xi)}",
        example: 'f(x) = x²，g(x) = x³ 在 [1, 2] 上，应用柯西中值定理可找到合适的 ξ。'
      },
      {
        id: 'lhospital-rule',
        name: '洛必达法则',
        category: '求导法则',
        definition: '若 lim(x→a) f(x) = 0，lim(x→a) g(x) = 0（或均为 ∞），且 lim(x→a) f\'(x)/g\'(x) 存在（或为 ∞），则 lim(x→a) f(x)/g(x) = lim(x→a) f\'(x)/g\'(x)。',
        plainTranslation: '洛必达法则是计算"0/0"或"∞/∞"型极限的神器。当你遇到分子分母都趋向于0或无穷大的分数时，直接求导往往能得到答案。它的原理是：用切线近似代替曲线，在"趋于0"这个极端情况下，切线的比值就等于原函数的比值。',
        whyNeedIt: '洛必达法则是求极限的最强大工具之一。它把复杂的极限问题转化为求导问题，大大简化了计算。在处理含有三角函数、指数函数、对数函数的极限时特别有效。是每个学习微积分的人必须掌握的技术。',
        formula: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}",
        example: 'lim(x→0) sin(x)/x = lim(x→0) cos(x)/0 = 1。注意：洛必达需要分子分母都趋向于0或∞，且求导后极限要存在。'
      },
      {
        id: 'fermat-lemma',
        name: '费马引理',
        category: '微分中值定理',
        definition: '若函数 f(x) 在点 x₀ 的某邻域内有定义，且在 x₀ 处可导，若 x₀ 是 f(x) 的极值点（极大值或极小值），则必有 f\'(x₀) = 0。',
        plainTranslation: '费马引理说：如果某点是函数的极值点（局部最高点或最低点），并且函数在该点可导，那么导数一定为零！就像山坡上的最高点，山坡一定是平的（导数为零）。注意：如果极值点处导数不存在，那就是不可导的情况。',
        whyNeedIt: '费马引理是微分中值定理家族的"起点"！它告诉我们：可导的极值点一定是驻点。这是寻找极值的第一步——先找导数为零的点。虽然驻点不一定是极值点，但极值点一定是驻点（前提是可导）。',
        example: 'f(x) = x² 在 x = 0 处取得极小值，f\'(0) = 0。f(x) = |x| 在 x = 0 处取得极小值，但 f\'(0) 不存在（不可导），这是例外情况。'
      },
      {
        id: 'extreme-value',
        name: '函数的极值',
        category: '导数应用',
        definition: '设函数 f(x) 在点 x₀ 的某一邻域内有定义，若对该邻域内任意 x（x ≠ x₀），恒有 f(x) < f(x₀)，则称 f(x₀) 为极大值，x₀ 为极大值点；若恒有 f(x) > f(x₀)，则称 f(x₀) 为极小值，x₀ 为极小值点。',
        plainTranslation: '极值就是函数的"山峰"和"山谷"——局部最高点和最低点。就像你爬山时经过的一些小山顶，虽然不是珠穆朗玛峰，但也是局部的最高点。极值点就是这些山峰山谷所在的横坐标。',
        whyNeedIt: '极值是优化问题的核心。在经济学中求最大利润、在物理学中求最小能量、在工程设计中求最优参数，都离不开极值概念。极值理论让我们能系统地找到函数的最高点和最低点。',
        example: 'f(x) = x³ - 3x，f\'(x) = 3x² - 3 = 0 得 x = ±1。f\'\'(x) = 6x，f\'\'(-1) = -6 < 0，所以 x = -1 是极大值点；f\'\'(1) = 6 > 0，x = 1 是极小值点。'
      },
      {
        id: 'critical-point',
        name: '驻点与极值点',
        category: '导数应用',
        definition: '若 f\'(x₀) = 0 或 f\'(x₀) 不存在，则称 x₀ 为 f(x) 的驻点（或临界点）。极值点必为驻点，但驻点不一定是极值点。',
        plainTranslation: '驻点就是导数为零或导数不存在的点——可能是"平坦"的地方。极值点（山峰山谷）一定是驻点，但驻点不一定是极值点——有些平坦的地方只是"高原"，不是山峰。比如 x³ 在 x = 0 处导数为零，但不是极值点，只是一个"鞍点"。',
        whyNeedIt: '驻点是寻找极值的第一道关卡。我们只需要检查驻点，就能找到所有可能的极值点。这大大缩小了搜索范围，是求极值的标准流程：先找驻点，再判断是否是真正的极值点。',
        example: 'f(x) = x³，f\'(0) = 0，所以 x = 0 是驻点。但 f(x) 在 x = 0 处不是极大值也不是极小值——它只是从向下变为向上。'
      },
      {
        id: 'monotonicity',
        name: '函数的单调性',
        category: '导数应用',
        definition: '设函数 f(x) 在区间 I 上可导，若在 I 上 f\'(x) > 0，则 f(x) 在 I 上单调递增；若 f\'(x) < 0，则 f(x) 在 I 上单调递减。',
        plainTranslation: '导数的正负直接决定了函数的增减：导数大于零，函数上升；导数小于零，函数下降。这就像看汽车的仪表盘： positive speed = 前进，negative speed = 后退。导数就是函数增减的"速度表"。',
        whyNeedIt: '单调性是函数的基本性质。利用导数判断单调性是研究函数行为的首选方法。它帮助我们了解函数何时上升、何时下降，这在分析经济模型、物理过程、预测趋势等方面都有重要应用。',
        example: 'f(x) = x²，f\'(x) = 2x。当 x < 0 时 f\'(x) < 0，函数递减；当 x > 0 时 f\'(x) > 0，函数递增。'
      },
      {
        id: 'concavity',
        name: '函数的凹凸性',
        category: '导数应用',
        definition: '设函数 f(x) 在区间 I 上二阶可导，若 f\'\'(x) > 0，则 f(x) 在 I 上是凹的；若 f\'\'(x) < 0，则 f(x) 在 I 上是凸的。',
        plainTranslation: '凹凸性描述的是曲线的"弯曲方向"。想象一只碗：口朝上是凹（向下凸），口朝下是凸（向上凹）。二阶导数就是判断弯曲方向的工具——二阶导数为正，曲线向下凹陷（像笑脸）；二阶导数为负，曲线向上凸起（像皱眉）。',
        whyNeedIt: '凹凸性在优化经济学中很重要（利润的最大化、成本的最小化），在几何中用于曲线分类，在数值分析中用于不等式证明。它让我们能更精确地描绘函数图像的形态。',
        example: 'f(x) = x²，f\'\'(x) = 2 > 0，所以在整个实数域上是凹的（向下凹陷）。'
      },
      {
        id: 'asymptote',
        name: '渐近线',
        category: '导数应用',
        definition: '若曲线上的点沿某方向无限远离原点时，与某直线的距离趋于零，则称该直线为曲线的渐近线。垂直渐近线：lim(x→a⁺/a⁻) f(x) = ±∞；斜/水平渐近线：lim(x→±∞) [f(x) - (kx + b)] = 0。',
        plainTranslation: '渐近线就是曲线"永远接近但永远达不到"的直线。就像你和地平线：你永远走不到地平线，但它一直是你前进的方向。数学上，当 x 趋向某个值或无穷大时，曲线和直线之间的距离趋于零，这就是渐近线。',
        whyNeedIt: '渐近线帮助我们了解函数在"极端情况"下的行为。即使函数图像无法完整画出，我们也能通过渐近线知道它的"走向"。在物理学（如行星轨道）、工程学（如信号分析）中，渐近线都是重要概念。',
        example: 'f(x) = 1/x 有两条渐近线：x = 0（垂直渐近线）和 y = 0（水平渐近线）。'
      },
      {
        id: 'curve-sketching',
        name: '函数图像的描绘',
        category: '导数应用',
        definition: '通过研究函数的定义域、奇偶性、单调性、凹凸性、极值、拐点、渐近线等性质，可以较准确地描绘函数图像。',
        plainTranslation: '函数图像描绘就是综合运用导数的所有知识来"画"出函数的肖像。通过一阶导数知道它是上升还是下降，通过二阶导数知道它是凹还是凸，通过极值点知道山峰山谷，通过拐点知道弯曲方向的变化，通过渐近线知道"尽头"在哪里。',
        whyNeedIt: '图像描绘是检验和综合运用导数知识的最佳方式。它让我们能把抽象的数学公式转化为直观的图形。在工程设计，数据可视化、科学实验中，绘制函数图像都是基本技能。',
        example: '描绘 f(x) = x³ - 3x：定义域 R，奇函数；f\'(x) = 3(x²-1)，驻点 x = ±1；f\'\'(x) = 6x，拐点 x = 0。'
      },
      {
        id: 'max-min-application',
        name: '最大值与最小值',
        category: '导数应用',
        definition: '若函数 f(x) 在闭区间 [a, b] 上连续，则 f(x) 必在 [a, b] 上取得最大值和最小值。最大值（最小值）点要么是区间端点，要么是内部极值点。',
        plainTranslation: '在闭区间上，连续函数一定有最高点和最低点。它们要么在区间端点（ Endpoint），要么在中间的极值点。就像爬山：最高峰一定是某个山峰的顶点，或者在山脚。所以找最值只需要比较所有极值点和端点。',
        whyNeedIt: '最值问题是优化问题的核心。在经济学中求最大利润、在工程中求最小成本、在物理学中求基态能量，都需要求最值。这个方法把复杂的优化问题转化为求导问题和端点比较问题。',
        example: '求 f(x) = x² - 4x + 3 在 [0, 4] 上的最大值和最小值。极值点 x = 2，f(2) = -1；端点 f(0) = 3，f(4) = 3。所以最大值 3，最小值 -1。'
      },
      {
        id: 'arc-differential',
        name: '弧微分',
        category: '微分应用',
        definition: '设曲线 y=f(x) 可导，弧长微分 ds = √(1 + [f\'(x)]²) dx。参数形式：ds = √([x\'(t)]² + [y\'(t)]²) dt。',
        plainTranslation: '弧微分就是一小段曲线的"近似长度"。想象你沿着弯路走一小步，这一步的长度不是简单的水平距离或垂直距离，而是两者合成后的斜线长度。就像走楼梯时，实际走过的距离是水平距离和垂直高度构成的直角三角形的斜边。',
        whyNeedIt: '弧微分是计算曲线弧长的基础，也是定义曲率的前提。在物理中，弧微分用于描述质点沿曲线运动的位移。',
        formula: 'ds = \\sqrt{1 + [f^{\\prime}(x)]^2}\\, dx'
      },
      {
        id: 'curvature',
        name: '曲率',
        category: '微分应用',
        definition: '曲线 y=f(x) 在点 (x, f(x)) 处的曲率 K = |y\'\'| / (1 + y\'²)^(3/2)。曲率半径 R = 1/K。参数形式：K = |x\'y\'\' - y\'x\'\'| / (x\'² + y\'²)^(3/2)。',
        plainTranslation: '曲率衡量曲线"弯曲程度"——弯得越厉害，曲率越大。直线曲率为0（完全不弯），圆的曲率等于半径的倒数（半径越小弯得越厉害）。想象开车：方向盘打得越猛，曲率越大。曲率半径就是"如果用圆弧来拟合这段曲线，那个圆的半径"。',
        whyNeedIt: '曲率在工程中有广泛应用：铁路弯道设计必须限制曲率以确保安全，透镜的曲率决定焦距，道路的曲率影响行车速度。',
        formula: 'K = \\frac{|y^{\\prime\\prime}|}{(1 + y^{\\prime 2})^{3/2}}, \\quad R = \\frac{1}{K}'
      },
      {
        id: 'curvature-center-circle',
        name: '曲率中心与曲率圆',
        category: '微分应用',
        definition: '曲率中心是曲率圆的圆心。设曲线 y=f(x)，则曲率中心坐标为 (x - y\'(1+y\'²)/y\'\', y + (1+y\'²)/y\'\')。曲率圆与曲线在该点有相同的切线和曲率。',
        plainTranslation: '曲率圆就像在曲线某一点"最贴身"的圆——它和曲线在这点相切，而且弯曲程度完全一样。就像给你身体某个部位量身定做一个圆弧，既贴合又弯曲度匹配。曲率中心就是那个圆的圆心。',
        whyNeedIt: '曲率圆提供了曲线在某点的"最佳圆弧近似"，在数控加工、齿轮设计等领域有重要应用。渐屈线和渐伸线都基于曲率中心。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter3',
    name: '第三章 不定积分',
    concepts: [
      {
        id: 'indefinite-integral',
        name: '不定积分',
        category: '基本概念',
        definition: '若 F\'(x) = f(x)，则称 F(x) 为 f(x) 的一个原函数。f(x) 的全体原函数称为不定积分，记作 ∫f(x)dx = F(x) + C，其中 C 为任意常数。',
        plainTranslation: '不定积分是"求导的逆运算"——已知变化率，求原来的量。就像知道速度求路程：速度是导数，路程是原函数。不定积分会得到一族函数（因为常数导数为0，所以加上任何常数都不影响），用 +C 表示所有可能的原函数。',
        whyNeedIt: '不定积分是积分学的核心概念。它让我们能从导数反推原函数，是求定积分、微分方程求解的基础。在物理中，求速度的积分得到位移；在经济学中，求边际成本的积分得到总成本。',
        formula: '\\int f(x)dx = F(x) + C',
        example: '因为 (x³)\' = 3x²，所以 ∫3x²dx = x³ + C。'
      },
      {
        id: 'indefinite-integral-properties',
        name: '不定积分的性质',
        category: '基本概念',
        definition: '(1) ∫[f(x) ± g(x)]dx = ∫f(x)dx ± ∫g(x)dx\n(2) ∫k·f(x)dx = k·∫f(x)dx (k 为常数)\n(3) d/dx[∫f(x)dx] = f(x)\n(4) ∫F\'(x)dx = F(x) + C',
        plainTranslation: '不定积分的性质告诉我们：积分运算和求导运算是"互逆"的，积分运算对加法和数乘保持线性。这些性质让我们能把复杂函数的积分拆分成简单函数的积分来计算。',
        whyNeedIt: '这些性质是不定积分计算的基础。它们让我们能把复杂积分拆成简单积分，大大简化计算。掌握这些性质，就掌握了积分计算的"四则运算"。',
        example: '∫(x² + 2x + 1)dx = ∫x²dx + 2∫xdx + ∫dx = x³/3 + x² + x + C。'
      },
      {
        id: 'basic-integration-formulas',
        name: '基本积分公式',
        category: '基本公式',
        definition: '由基本导数公式可得相应的积分公式，如：\n∫xⁿdx = xⁿ⁺¹/(n+1) + C (n≠-1)\n∫1/x dx = ln|x| + C\n∫eˣdx = eˣ + C\n∫aˣdx = aˣ/ln a + C\n∫sinx dx = -cosx + C\n∫cosx dx = sinx + C\n∫dx/(1+x²) = arctanx + C\n∫dx/√(1-x²) = arcsinx + C',
        plainTranslation: '基本积分公式就是"积分表"——从导数公式倒推出来的积分结果。它们是积分计算的基础工具，就像乘法口诀表一样，需要牢记。掌握了这些公式，加上积分技巧，就能计算大部分积分。',
        whyNeedIt: '基本积分公式是所有积分计算的基础。就像学加法要背加法表，学积分也要背积分公式。这是计算不定积分的起点。',
        formula: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
        example: '∫x⁵dx = x⁶/6 + C。'
      },
      {
        id: 'integration-by-parts',
        name: '分部积分法',
        category: '积分技巧',
        definition: '若 u = u(x)，v = v(x) 均可导，则 ∫u·dv = u·v - ∫v·du。其思想是将难积分的乘积转化为易积分的形式。',
        plainTranslation: '分部积分是"积分版的乘法分配律的逆运算"。它把两个函数相乘的积分问题，转化为一个积分减去另一个积分。关键在于选择 u：通常选择"容易求导、积分困难"的函数作为 u。口诀：反三角、对数、幂函数、三角、指数（前者优先选 u）。',
        whyNeedIt: '分部积分能解决很多直接积分无法解决的问题。它是处理"函数相乘"类型积分的核心技巧，在求 ∫x·eˣ、∫lnx、∫arcsinx 等类型的积分时必不可少。',
        formula: '\\int u dv = uv - \\int v du',
        example: '∫x·eˣdx。令 u = x，dv = eˣdx，则 du = dx，v = eˣ。原式 = x·eˣ - ∫eˣdx = x·eˣ - eˣ + C。'
      },
      {
        id: 'integration-by-substitution',
        name: '换元积分法',
        category: '积分技巧',
        definition: '(1) 第一类换元（凑微分）：∫f(g(x))·g\'(x)dx = ∫f(u)du，令 u = g(x)\n(2) 第二类换元：令 x = φ(t)，将难积分转化为易积分',
        plainTranslation: '换元积分就是"变量替换"——通过更换变量把复杂积分变简单。第一类换元是"凑"的形式，假装某个导数已经存在；第二类换元是直接令 x = φ(t)，把关于 x 的积分转化为关于 t 的积分。',
        whyNeedIt: '换元积分是解决复杂积分的利器。它能把"看起来没法积分"的式子转化为可以积分的形式。这是积分计算中最重要的技巧之一。',
        formula: '\\int f(g(x))g\'(x)dx = \\int f(u)du',
        example: '∫2x·cos(x²)dx。令 u = x²，du = 2xdx，原式 = ∫cos(u)du = sin(u) + C = sin(x²) + C。'
      },
      {
        id: 'rational-integration',
        name: '有理函数积分',
        category: '积分技巧',
        definition: '有理函数 R(x) = P(x)/Q(x)，其中 P、Q 为多项式。若 degP ≥ degQ，则化为多项式 + 真分式；若 degP < degQ，则将分式分解为部分分式后积分。',
        plainTranslation: '有理函数积分就是处理"多项式除多项式"的积分。核心思想是：把复杂的分式分解成简单的分式，然后逐个积分。分解方法包括：因式分解、分母配方、待定系数法等。',
        whyNeedIt: '有理函数积分是积分计算的基础训练。虽然实际中直接遇到有理函数积分不多，但很多复杂积分通过换元可以转化为有理函数积分。掌握它能锻炼积分技巧。',
        example: '∫(x+1)/(x²-1)dx = ∫(x+1)/[(x-1)(x+1)]dx = ∫1/(x-1)dx = ln|x-1| + C。'
      },
      {
        id: 'trigonometric-integration',
        name: '三角函数积分',
        category: '积分技巧',
        definition: '三角函数积分的常见技巧包括：(1) ∫sinⁿx·cosᵐxdx：根据奇偶性选择换元；(2) ∫tanⁿx·secᵐxdx：转化为 sec；(3) 常用恒等变形：sin²x = (1-cos2x)/2，cos²x = (1+cos2x)/2，sinx·cosx = sin2x/2',
        plainTranslation: '三角函数积分需要根据指数的奇偶性选择合适的方法。遇到 sin 和 cos 的乘积时，如果指数有奇数，就拆出一个来和另一个配对；如果都是偶数，就用降幂公式。',
        whyNeedIt: '三角函数积分在物理（如波动、振动）、工程（如信号处理）中很重要。很多复杂问题的解会涉及到三角函数积分。',
        example: '∫sin³x·cos²xdx = ∫sin²x·cos²x·sinxdx = ∫(1-cos²x)·cos²x·sinxdx。令 u = cosx，du = -sinxdx，即可求解。'
      },
      {
        id: 'irrational-integration',
        name: '无理函数积分',
        category: '积分技巧',
        definition: '无理函数积分常用换元：(1) √(ax+b)：令 t = √(ax+b)；(2) √(ax²+bx+c)：可配方后三角换元；(3) 三角换元：√(a²-x²) 令 x = a·sinθ；√(a²+x²) 令 x = a·tanθ；√(x²-a²) 令 x = a·secθ',
        plainTranslation: '无理函数积分就是处理"带根号"的积分。关键在于选择合适的换元把根号去掉。常见策略：设根号为新变量 t，或者用三角换元把根号变成三角函数。',
        whyNeedIt: '无理函数积分在几何、物理中很常见。例如求椭圆弧长、旋转体体积等都会遇到无理函数积分。',
        example: '∫√(1-x²)dx。令 x = sinθ，dx = cosθdθ，√(1-x²) = cosθ，原式 = ∫cos²θdθ = ∫(1+cos2θ)/2 dθ。'
      },
      {
        id: 'reciprocal-substitution',
        name: '倒代换法',
        category: '积分技巧',
        definition: '令 t = 1/x，则 dx = -1/t² dt。适用于被积函数中分母含高次幂的情形，可将复杂分式化简。',
        plainTranslation: '倒代换就像"反过来想"——当分母里的x次数太高、太复杂时，让 t = 1/x 就能把高次幂变成低次幂，化繁为简。就像你嫌分母太大，就让整个分数"倒过来看"，反而容易处理了。',
        whyNeedIt: '倒代换是处理分母含高次幂不定积分的有效技巧，常与其他方法配合使用。当直接换元和分部积分都不好使时，倒代换可能柳暗花明。',
        formula: 't = \\frac{1}{x}, \\quad dx = -\\frac{1}{t^2}dt'
      },
      {
        id: 'trigonometric-substitution',
        name: '三角代换',
        category: '积分技巧',
        definition: '对于含 √(a²-x²) 的积分令 x=asin t；含 √(a²+x²) 的令 x=atan t；含 √(x²-a²) 的令 x=a/cos t。利用三角恒等式消去根号。',
        plainTranslation: '三角代换是用三角函数的"魔法"把根号变没。√(a²-x²) 让你联想到 sin²t+cos²t=1 吗？令x=asint，根号就变成了a|cost|，根号消失了！三种根号对应三种三角代换，记住这个对应关系就掌握了核心技巧。',
        whyNeedIt: '三角代换是处理含根式积分的标准方法，特别是√(a²±x²)和√(x²-a²)类型。它是考研积分题的高频考点。',
        formula: '\\sqrt{a^2-x^2} \\to x=a\\sin t; \\quad \\sqrt{a^2+x^2} \\to x=a\\tan t; \\quad \\sqrt{x^2-a^2} \\to x=a\\sec t'
      },
      {
        id: 'integral-recurrence',
        name: '定积分的递推公式',
        category: '积分技巧',
        definition: '形如 Iₙ = ∫₀^(π/2) sinⁿx dx 的积分有递推公式：Iₙ = (n-1)/n · Iₙ₋₂，其中 I₀ = π/2，I₁ = 1。类似地，∫₀^(π/2) cosⁿx dx 也有相同的递推关系。',
        plainTranslation: 'Wallis积分递推就像多米诺骨牌——知道前两个就能推后面的。I₀=π/2，I₁=1，然后每一步都是"Iₙ = (n-1)/n × Iₙ₋₂"，一直递推下去。n为偶数时最终推到I₀，n为奇数时推到I₁。',
        whyNeedIt: '递推公式是计算高次三角函数定积分的利器，也是推导Wallis公式的基础。在概率论和数理统计中也常出现此类积分。',
        formula: 'I_n = \\int_0^{\\pi/2} \\sin^n x\\,dx = \\frac{n-1}{n} I_{n-2}'
      }
    ] as Concept[]
  },
  {
    id: 'chapter4',
    name: '第四章 定积分',
    concepts: [
      {
        id: 'definite-integral',
        name: '定积分',
        category: '基本概念',
        definition: '设函数 f(x) 在 [a, b] 上有定义，将区间 [a, b] 分成 n 份，取每个小区间上任一点作和式，当 n→∞ 且最大区间长度→0 时，若和式极限存在，则称此极限为 f(x) 在 [a, b] 上的定积分，记作 ∫ₐᵇ f(x)dx。',
        plainTranslation: '定积分就是"无限求和"——把区间分成无数个微小部分，每部分取一个函数值，乘以该部分宽度，然后全部加起来。当分得越来越细时，这个和就趋向一个确定的值。它可以用来求曲线下的面积、变速运动的路程等。',
        whyNeedIt: '定积分是精确计算"累积量"的核心工具。求曲线下的面积、物体的位移、概率分布的总概率等，都离不开定积分。它是连接理论和实际的桥梁。',
        formula: '\\int_a^b f(x)dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(\\xi_i) \\Delta x_i',
        example: '∫₀¹ x²dx = [x³/3]₀¹ = 1/3。这正是曲线 y = x² 在 [0,1] 下方的面积。'
      },
      {
        id: 'riemann-sum',
        name: '黎曼和与黎曼积分',
        category: '基本概念',
        definition: '将区间 [a, b] 分成 n 个小区间 Δxᵢ，取每个小区间内的一点 ξᵢ，作和式 Sₙ = Σf(ξᵢ)Δxᵢ，称为黎曼和。当所有 Δxᵢ → 0 时，若黎曼和趋于同一常数 I，则称 f 在 [a, b] 上黎曼可积，I 称为黎曼积分。',
        plainTranslation: '黎曼积分就是用"有限近似"逼近"无限精确"的方法！把区间切成很多小段，每段取一个代表值乘以段长，加起来得到近似值。当切得越来越细时，如果这个近似值越来越接近一个固定值，那就是黎曼可积！这个固定值就是积分值。',
        whyNeedIt: '黎曼积分是现代积分理论的基础。它让"积分"有了严格的数学定义，解决了之前积分概念模糊的问题。在这个框架下，我们可以讨论哪些函数可积、哪些不可积，这是理论发展的基石。',
        example: '计算 ∫₀¹ x²dx。用等分：Δx = 1/n，取右端点 ξᵢ = i/n，则 Sₙ = Σ(i/n)²·(1/n) = (1/n³)Σi² = (1/n³)·n(n+1)(2n+1)/6 → 1/3。'
      },
      {
        id: 'darboux-upper-lower',
        name: '达布上、下和',
        category: '基本概念',
        definition: '设划分 P = {a = x₀ < x₁ < ... < xₙ = b}，在每个小区间 [xᵢ₋₁, xᵢ] 上记 Mᵢ = sup f(x)，mᵢ = inf f(x)，则达布上和 S = ΣMᵢΔxᵢ，达布下和 s = ΣmᵢΔxᵢ。f 可积的充要条件是：lim(P→0) (S - s) = 0。',
        plainTranslation: '达布和是判断函数是否可积的"试金石"！上和取每个区间最大的函数值，下和取最小的。如果上下和的差距随着划分越分越细而趋近于0，那函数就是可积的。这个条件比"有限个间断点"更一般。',
        whyNeedIt: '达布和理论让我们能精确判断哪些函数可积。它给出了可积的充要条件，是实变函数论的基础。虽然实际中常用"有限个间断点"来判断，但达布和理论更深刻。',
        example: 'f(x) 在 [0,1] 上有定义，上和 S = ΣMᵢΔxᵢ，下和 s = ΣmᵢΔxᵢ。当划分加细时，S 递减，s 递增。若 S → I，s → I，则 f 可积，积分值就是 I。'
      },
      {
        id: 'definite-integral-existence',
        name: '定积分的存在条件',
        category: '基本概念',
        definition: '若函数 f(x) 在闭区间 [a, b] 上连续，则定积分一定存在（可积）。若 f(x) 在 [a, b] 上有界且只有有限个间断点，则 f(x) 也可积。',
        plainTranslation: '定积分存在是有条件的。简单说：连续函数一定可积；有界且只有有限个间断点的函数也可积。这个条件保证了定积分定义的良好性，让我们能放心计算各种实际问题的积分。',
        whyNeedIt: '知道什么函数可积很重要。它保证了我们的计算是有意义的。在实际应用中遇到的函数大多满足这些条件，所以定积分有广泛的应用。',
        example: 'f(x) = 1/x 在 [0,1] 上不可积，因为 x=0 是无穷间断点。'
      },
      {
        id: 'definite-integral-properties',
        name: '定积分的性质',
        category: '基本概念',
        definition: '(1) 线性性：∫ₐᵇ [αf(x) + βg(x)]dx = α∫ₐᵇ f(x)dx + β∫ₐᵇ g(x)dx\n(2) 区间可加：∫ₐᵇ f(x)dx = ∫ₐᶜ f(x)dx + ∫ᶜᵇ f(x)dx\n(3) 区间相等：∫ₐᵃ f(x)dx = 0，∫ₐᵇ f(x)dx = -∫ᵇₐ f(x)dx\n(4) 比较定理：若 f(x) ≥ g(x)，则 ∫ₐᵇ f(x)dx ≥ ∫ₐᵇ g(x)dx',
        plainTranslation: '定积分的性质告诉我们：积分对加法和数乘是线性的；积分区间可以拆分；交换上下限要变号；如果函数大，积分也大。这些性质是定积分计算和应用的基础。',
        whyNeedIt: '这些性质让我们能灵活处理定积分问题。通过拆分区间、比较大小、利用对称性等技巧，可以大大简化定积分的计算。',
        example: '∫₀² (x² + 2x)dx = ∫₀² x²dx + 2∫₀² xdx = [x³/3]₀² + [x²]₀² = 8/3 + 4 = 20/3。'
      },
      {
        id: 'fundamental-theorem-calculus',
        name: '微积分基本定理',
        category: '基本定理',
        definition: '设函数 f(x) 在 [a, b] 上连续，则函数 Φ(x) = ∫ₐˣ f(t)dt 在 [a, b] 上可导，且 Φ\'(x) = f(x)。这建立了定积分与不定积分的联系。',
        plainTranslation: '微积分基本定理是数学史上最重要的定理之一！它说：积分后再求导等于原函数。用Φ(x) = ∫ₐˣ f(t)dt 定义的"积分函数"，它的导数就是 f(x) 本身。这个定理把微分和积分这两个看似相反的运算完美统一起来了。',
        whyNeedIt: '这个定理是整个微积分学的基石！它不仅建立了定积分和不定积分的联系，还提供了计算定积分的简便方法——牛顿-莱布尼茨公式。它让复杂的积分计算变得简单。',
        formula: '\\frac{d}{dx} \\int_a^x f(t)dt = f(x)',
        example: '设 F(x) = ∫₀ˣ sin(t)dt，则 F\'(x) = sin(x)。'
      },
      {
        id: 'newton-leibniz-formula',
        name: '牛顿-莱布尼茨公式',
        category: '基本定理',
        definition: '若 F(x) 是 f(x) 的一个原函数，则 ∫ₐᵇ f(x)dx = F(b) - F(a)。这就是著名的牛顿-莱布尼茨公式，简称 N-L 公式。',
        plainTranslation: '牛顿-莱布尼茨公式是"定积分计算的神器"！它说：定积分的值等于原函数在上下限的差。就像计算从 a 到 b 的"累积量"，只需要找到原函数，然后算差值就行。这大大简化了定积分的计算。',
        whyNeedIt: '这个公式是计算定积分的核心方法！它把复杂的定积分计算转化为简单的原函数求值问题。如果没有这个公式，定积分的计算会非常麻烦。',
        formula: '\\int_a^b f(x)dx = F(b) - F(a)',
        example: '∫₀¹ x²dx = [x³/3]₀¹ = 1/3 - 0 = 1/3。'
      },
      {
        id: 'definite-integration-by-parts',
        name: '定积分的分部积分',
        category: '计算方法',
        definition: '定积分的分部积分公式：∫ₐᵇ u·dv = [u·v]ₐᵇ - ∫ₐᵇ v·du。与不定积分的区别在于最后要代入上下限计算。',
        plainTranslation: '定积分的分部积分和不定积分类似，但最后多了一个步骤：把上下限代入相乘的项。其他步骤完全一样。',
        whyNeedIt: '定积分的分部积分让我们能处理被积函数是乘积形式的积分。在物理和工程中的很多问题都需要用到。',
        formula: '\\int_a^b u dv = [uv]_a^b - \\int_a^b v du',
        example: '∫₀¹ x·eˣdx = [x·eˣ]₀¹ - ∫₀¹ eˣdx = e - (e-1) = 1。'
      },
      {
        id: 'definite-integration-by-substitution',
        name: '定积分的换元积分',
        category: '计算方法',
        definition: '定积分换元时，积分上下限也要相应变换：∫ₐᵇ f(x)dx = ∫ₐᵇ f(φ(t))·φ\'(t)dt，其中 x = φ(t)，当 x = a 时 t = α，当 x = b 时 t = β。',
        plainTranslation: '定积分换元时，上下限必须跟着变！这是和不定积分换元的重要区别。记住：换元后要重新计算上下限对应的值。',
        whyNeedIt: '定积分的换元积分大大简化了计算。通过合适的换元，可以把复杂的定积分转化为简单的形式，而且避免了不定积分最后还要回代原函数的麻烦。',
        example: '∫₀⁴ √(2x+1)dx。令 u = 2x+1，x = (u-1)/2，dx = du/2。x=0 时 u=1，x=4 时 u=9。原式 = ∫₁⁹ √u · (1/2)du = (1/2)·[2u^(3/2)/3]₁⁹ = (1/3)(27-1) = 26/3。'
      },
      {
        id: 'integral-mean-value',
        name: '积分中值定理',
        category: '基本定理',
        definition: '若 f(x) 在 [a, b] 上连续，则存在 ξ ∈ [a, b]，使得 ∫ₐᵇ f(x)dx = f(ξ)(b-a)。f(ξ) 称为函数在 [a, b] 上的平均值。',
        plainTranslation: '积分中值定理说的是：在连续函数图像下方，一定有一条水平直线，它和 x 轴之间的矩形面积等于曲线下的面积。这条水平直线的高度就是函数在区间上的"平均值"。就像平均速度 = 总位移 / 总时间，平均值 = 总面积 / 宽度。',
        whyNeedIt: '积分中值定理是证明很多重要结论的基础工具。它让我们能用简单的"平均值"来估计复杂的积分，也用于证明其他定理。',
        formula: '\\frac{1}{b-a} \\int_a^b f(x)dx = f(\\xi)',
        example: 'f(x) = x² 在 [0, 2] 上，∫₀² x²dx = 8/3，平均值 = (8/3)/2 = 4/3。确实存在 ξ = √(4/3) ≈ 1.155 满足 f(ξ) = 4/3。'
      },
      {
        id: 'second-mean-value-theorem',
        name: '积分第二中值定理',
        category: '基本定理',
        definition: '设 f(x) 在 [a, b] 上可积：\n(1) 若 g(x) 单调递减且 g(x) ≥ 0，则存在 ξ ∈ [a, b]，使得 ∫ₐᵇ f(x)g(x)dx = g(a)∫ₐᵇ f(x)dx\n(2) 若 g(x) 单调递增且 g(x) ≥ 0，则存在 η ∈ [a, b]，使得 ∫ₐᵇ f(x)g(x)dx = g(b)∫ₐᵇ f(x)dx',
        plainTranslation: '积分第二中值定理是第一中值定理的推广！它处理的是"一个可积函数乘以一个单调函数"的情况。通过这个定理，我们可以把"复杂积分"简化为"简单积分乘以一个值"。它是证明很多重要结论的工具。',
        whyNeedIt: '积分第二中值定理在证明定理和处理特定类型的积分时很有用。它让我们能把复杂积分估计成简单形式，是分析学中的重要工具。',
        example: '设 f(x) = 1 在 [0,1] 上，g(x) = x 递减且非负，则 ∫₀¹ x·dx = x·1|₀¹ = 1/2 = g(0)·∫₀¹ 1dx = 0... 实际上用公式(2)：g(1)·∫₀¹ 1dx = 1·1 = 1，不对。用公式(1)：g(0)·∫₀¹ 1dx = 0，也不对... 需要更精确的例子。'
      },
      {
        id: 'wallis-formula',
        name: 'Wallis公式',
        category: '特殊积分',
        definition: 'Wallis公式：∫₀^(π/2) sinⁿx dx = ∫₀^(π/2) cosⁿx dx = \n(1) 若 n 为偶数：= (n-1)!!/n!! · π/2\n(2) 若 n 为奇数：= (n-1)!!/n!!\n其中 (n)!! 表示双阶乘。',
        plainTranslation: 'Wallis公式是计算三角函数高次幂积分的"神器"！它把含 n 次方的正弦或余弦在 [0, π/2] 上的积分，简洁地表达为双阶乘的形式。这个公式在概率论（正态分布的积分）、物理（波动问题）中都很有用。',
        whyNeedIt: 'Wallis公式让我们能快速计算复杂的三角函数积分。它也是连接阶乘和π的重要公式，在数学史上有重要意义。掌握它，很多看起来复杂的积分可以瞬间得到答案。',
        example: '∫₀^(π/2) sin²x dx = (1!!/2!!)·π/2 = (1/2)·π/2 = π/4。∫₀^(π/2) sin³x dx = 2!!/3!! = 2/3。'
      },
      {
        id: 'area-under-curve',
        name: '平面图形面积',
        category: '积分应用',
        definition: '(1) 由 y = f(x)、x = a、x = b 围成的曲边梯形面积：S = ∫ₐᵇ |f(x)|dx\n(2) 由 y = f(x)、y = g(x)、x = a、x = b 围成的图形面积：S = ∫ₐᵇ |f(x) - g(x)|dx',
        plainTranslation: '求曲线下的面积是定积分最经典的应用。"曲边梯形"的面积 = 函数的积分。如果两条曲线之间，则面积 = 上方函数积分减去下方函数积分。注意要取绝对值，因为面积不能为负。',
        whyNeedIt: '平面图形面积计算是积分最直观的应用。无论是工程设计中的材料用量，还是物理中的电场分布，都需要计算面积。',
        example: '求 y = x² 和 y = √x 围成的面积。两曲线交点：x² = √x → x = 0 或 x = 1。面积 = ∫₀¹ (√x - x²)dx = [2x^(3/2)/3 - x³/3]₀¹ = 2/3 - 1/3 = 1/3。'
      },
      {
        id: 'volume-by-slicing',
        name: '旋转体体积',
        category: '积分应用',
        definition: '(1) 绕 x 轴旋转：V = π∫ₐᵇ [f(x)]²dx\n(2) 绕 y 轴旋转：V = 2π∫ₐᵇ x·f(x)dx（古尔金第二定理）',
        plainTranslation: '旋转体就是一条曲线绕坐标轴旋转形成的立体。绕 x 轴旋转：每个截面是圆，面积 = π·[f(x)]²；绕 y 轴旋转：每个截面是圆环。这让我们能用积分求各种奇怪形状的体积。',
        whyNeedIt: '旋转体体积在工程中非常重要。比如求水桶、烟囱、旋转零件的容积，都需要计算旋转体体积。这是积分在工程应用中的典型例子。',
        example: 'y = x² 在 [0,1] 绕 x 轴旋转得到的旋转体体积 V = π∫₀¹ x⁴dx = π/5。'
      },
      {
        id: 'arc-length',
        name: '曲线弧长',
        category: '积分应用',
        definition: '若曲线 y = f(x) 在 [a, b] 上有连续导数，则弧长 s = ∫ₐᵇ √(1 + [f\'(x)]²)dx。若曲线由参数方程 x = φ(t)，y = ψ(t) 给出，则 s = ∫ₐᵇ √([φ\'(t)]² + [ψ\'(t)]²)dt。',
        plainTranslation: '曲线弧长就是用积分把"弯曲"的线段"拉直"来量长度。把曲线分成无数小段，每小段近似直线，用勾股定理求长度，然后加起来得到总弧长。',
        whyNeedIt: '弧长计算在测量、道路设计、管道铺设等实际问题中很重要。比如计算一条弯曲河流的长度、卫星轨道的周长等，都需要用到弧长积分。',
        example: '求 y = (2/3)x^(3/2) 从 x=0 到 x=3 的弧长。y\' = √x，弧长 = ∫₀³ √(1+x)dx = [2/3(x+1)^(3/2)]₀³ = 2/3(4^(3/2) - 1) = 2/3(8-1) = 14/3。'
      },
      {
        id: 'physics-applications',
        name: '物理应用',
        category: '积分应用',
        definition: '定积分在物理学中有广泛应用：(1) 变力做功：W = ∫ₐᵇ F(x)dx；(2) 液体压力：P = ρg∫ₐᵇ h(x)·w(x)dx；(3) 质心/形心：x̄ = ∫ₐᵇ x·f(x)dx / ∫ₐᵇ f(x)dx',
        plainTranslation: '积分是解决物理问题的神器！变力做功、液体压力、质心位置......这些"变化着"的物理量，都需要用积分来计算。核心思想：把整体分解成无数微小部分，每部分用近似公式，然后加起来。',
        whyNeedIt: '积分在物理中的应用极其广泛。几乎所有涉及"连续变化"的物理量都需要用积分处理。它是理论物理和工程计算的基础工具。',
        example: '把水从容器中抽出做功：W = ρg∫₀ᴴ h·A(h)dh，其中 h 是深度，A(h) 是横截面积。'
      },
      {
        id: 'improper-integral',
        name: '广义积分',
        category: '特殊类型',
        definition: '(1) 无穷限广义积分：∫ₐ^∞ f(x)dx = lim(b→∞) ∫ₐᵇ f(x)dx\n(2) 瑕积分：若 f(x) 在 x = c 处无界，则 ∫ₐᵇ f(x)dx = lim(ε→0⁺) ∫ₐᶜ⁻ᵋ f(x)dx + lim(ε→0⁺) ∫ᶜ⁺ᵋᵇ f(x)dx',
        plainTranslation: '广义积分处理两种"极端"情况：一是积分区间无穷（到无穷大）；二是函数无界（某点趋向无穷）。它们的定义都是"极限"——看积分值是否趋向于一个有限数。如果极限存在，则广义积分收敛；否则发散。',
        whyNeedIt: '广义积分在概率论（如正态分布的积分）、物理（如引力势能）等问题中很重要。很多实际问题的解需要计算到无穷的积分。',
        example: '∫₁^∞ 1/x²dx = lim(b→∞)[-1/x]₁ᵇ = lim(b→∞)(1 - 1/b) = 1，收敛。∫₁^∞ 1/x dx = lim(b→∞)[ln x]₁ᵇ = ∞，发散。'
      },
      {
        id: 'gamma-function',
        name: 'Γ函数',
        category: '特殊类型',
        definition: 'Γ(n) = ∫₀^∞ xⁿ⁻¹·e⁻ˣdx (n > 0)。性质：Γ(n+1) = n·Γ(n)，当 n 为正整数时 Γ(n+1) = n!。',
        plainTranslation: 'Γ函数是阶乘的推广。普通的阶乘只对正整数有定义，Γ函数把它推广到了实数甚至复数。它的定义是一个积分，通过这个积分可以计算任意正数的"阶乘"。',
        whyNeedIt: 'Γ函数在概率论（如 gamma 分布）、数学物理、组合数学中都很重要。它是连接连续和离散数学的桥梁。',
        example: 'Γ(5) = 4! = 24；Γ(3.5) = Γ(2.5+1) = 2.5·Γ(2.5) = 2.5·1.5·Γ(1.5) = ...。'
      },
      {
        id: 'integral-odd-even',
        name: '奇偶函数的定积分简化',
        category: '定积分性质',
        definition: '若 f(x) 在 [-a,a] 上连续，则：f为奇函数时 ∫₋ₐᵃ f(x)dx = 0；f为偶函数时 ∫₋ₐᵃ f(x)dx = 2∫₀ᵃ f(x)dx。',
        plainTranslation: '奇函数关于原点对称，正负面积抵消，积分为0；偶函数关于y轴对称，右边面积等于左边，所以积分是右边一半的两倍。这是"对称性简化计算"的典型例子，省时省力。',
        whyNeedIt: '奇偶性是简化对称区间上定积分计算的最常用技巧。考研中经常出现对称区间上的积分，利用奇偶性可立即得出结果或大幅简化。',
        formula: 'f\\text{奇}: \\int_{-a}^a f(x)dx = 0; \\quad f\\text{偶}: \\int_{-a}^a f(x)dx = 2\\int_0^a f(x)dx'
      },
      {
        id: 'integral-periodic',
        name: '周期函数的定积分简化',
        category: '定积分性质',
        definition: '若 f(x) 以 T 为周期且在 [0,T] 上可积，则对任意 a，∫ₐ^(a+T) f(x)dx = ∫₀ᵀ f(x)dx，即周期函数在一个周期上的积分与起点无关。',
        plainTranslation: '周期函数就像旋转木马——不管你从哪个位置开始坐，转完整一圈看到的风景都一样。所以积分值只和走了几个完整周期有关，和起点无关。',
        whyNeedIt: '周期函数的积分性质是简化长区间积分的重要工具。结合周期性可以将复杂区间的积分化为若干个周期积分之和。',
        formula: '\\int_a^{a+T} f(x)dx = \\int_0^T f(x)dx'
      },
      {
        id: 'integral-interval-additivity',
        name: '定积分的区间可加性',
        category: '定积分性质',
        definition: '若 f(x) 在 [a,b] 上可积，c 为任意实数，则 ∫ₐᵇ f(x)dx = ∫ₐᶜ f(x)dx + ∫꜀ᵇ f(x)dx。此性质可推广到有限个分点。',
        plainTranslation: '区间可加性就是说"分段积分再相加等于整体积分"。就像量一段路的长度，可以分成几段量再相加，结果一样。这在处理分段函数和含绝对值的积分时特别有用。',
        whyNeedIt: '区间可加性是定积分最基本也最常用的性质之一。它让我们能灵活地拆分和合并积分区间，是处理分段函数积分的理论基础。',
        formula: '\\int_a^b f(x)dx = \\int_a^c f(x)dx + \\int_c^b f(x)dx'
      }
    ] as Concept[]
  },
  {
    id: 'chapter5',
    name: '第五章 泰勒公式与级数',
    concepts: [
      {
        id: 'taylor-formula',
        name: '泰勒公式',
        category: '泰勒公式',
        definition: '若函数 f(x) 在点 x₀ 处有 n 阶导数，则 f(x) = f(x₀) + f\'(x₀)(x-x₀) + f\'\'(x₀)/2!(x-x₀)² + ... + f⁽ⁿ⁾(x₀)/n!(x-x₀)ⁿ + Rₙ(x)，其中 Rₙ(x) = o((x-x₀)ⁿ) 为余项。',
        plainTranslation: '泰勒公式就像把函数"拆解"成一系列多项式的叠加。它告诉我们：任何足够光滑的函数，都可以用一个多项式来近似。这个多项式由函数在某一点的各阶导数决定，导数越高，近似越精确。简单说：就是把函数写成"起点值 + 一次项 + 二次项 + 三次项 + ..."的形式。',
        whyNeedIt: '泰勒公式是近似计算的基石。它把复杂的函数（三角函数、指数函数、对数函数）转化为简单的多项式，让我们能轻松计算近似值。计算机计算 sin、cos、e^x 等函数，内部就用的泰勒展开。它也是理解微积分、级数理论的钥匙。',
        formula: 'f(x) = f(x_0) + f\'(x_0)(x-x_0) + \\frac{f\'\'(x_0)}{2!}(x-x_0)^2 + ... + \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n + R_n(x)',
        example: 'e^x 在 x=0 处的泰勒展开：e^x = 1 + x + x²/2! + x³/3! + ...'
      },
      {
        id: 'maclaurin-formula',
        name: '麦克劳林公式',
        category: '泰勒公式',
        definition: '当 x₀ = 0 时的泰勒公式称为麦克劳林公式：f(x) = f(0) + f\'(0)x + f\'\'(0)/2!x² + ... + f⁽ⁿ⁾(0)/n!xⁿ + o(xⁿ)。',
        plainTranslation: '麦克劳林公式是泰勒公式的"简化版"——在 0 点展开。因为 0 是我们最熟悉的点，计算各阶导数也最方便，所以这是最常用的泰勒公式形式。很多函数的麦克劳林展开都需要牢记。',
        whyNeedIt: '麦克劳林公式是最常用的近似公式。在 0 点展开让计算变得简单，很多重要函数的展开式都是麦克劳林形式。它是工程计算、物理学的基础工具。',
        formula: 'f(x) = f(0) + f\'(0)x + \\frac{f\'\'(0)}{2!}x^2 + ... + \\frac{f^{(n)}(0)}{n!}x^n + o(x^n)',
        example: 'sin x = x - x³/3! + x⁵/5! - ...'
      },
      {
        id: 'taylor-remainder-lagrange',
        name: '泰勒余项（拉格朗日型）',
        category: '泰勒公式',
        definition: '若 f(x) 在包含 x₀ 的区间内有 n+1 阶导数，则余项可表示为 Rₙ(x) = f⁽ⁿ⁺¹⁾(ξ)/(n+1)! · (x-x₀)ⁿ⁺¹，其中 ξ 介于 x₀ 与 x 之间。',
        plainTranslation: '泰勒展开再多项式后面还有一个"尾巴"，这就是余项。拉格朗日型余项告诉我们：用 n 次多项式近似真实函数，误差正好是下一个导数在某个中间点的值乘以 (x-x₀)ⁿ⁺¹/(n+1)!。这让我们能精确估计近似误差。',
        whyNeedIt: '余项让我们能控制近似精度。通过估计余项大小，我们可以知道需要展开到第几项才能达到想要的精度。这在实际计算中至关重要——我们不能盲目展开，必须知道误差范围。',
        formula: 'R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} \\cdot (x-x_0)^{n+1}',
        example: '用 e^x ≈ 1 + x + x²/2 近似，误差 = e^ξ · x³/3!，其中 ξ 在 0 和 x 之间。'
      },
      {
        id: 'common-maclaurin-expansions',
        name: '常见函数的麦克劳林展开',
        category: '泰勒公式',
        definition: '重要函数的麦克劳林展开式：\ne^x = 1 + x + x²/2! + x³/3! + ...\nsin x = x - x³/3! + x⁵/5! - ...\ncos x = 1 - x²/2! + x⁴/4! - ...\nln(1+x) = x - x²/2 + x³/3 - ... (|x|<1)\n(1+x)^α = 1 + αx + α(α-1)/2! x² + ...',
        plainTranslation: '这些麦克劳林展开式是数学中的"明星公式"，需要牢记。它们把看似复杂的函数展开成简单的多项式。每个展开式都有自己独特的"模式"：e^x 是阶乘的倒数，sin 和 cos 是奇偶交替，ln 是交错正负。',
        whyNeedIt: '这些展开式是所有近似计算的基础。工程计算、物理学、信号处理等领域都会用到。记住它们，很多复杂问题就能迎刃而解。',
        formula: 'e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}, \\quad \\sin x = \\sum_{n=0}^\\infty (-1)^n \\frac{x^{2n+1}}{(2n+1)!}',
        example: 'e ≈ 2.71828... = 1 + 1 + 1/2 + 1/6 + 1/24 + ...'
      },
      {
        id: 'taylor-approximation',
        name: '泰勒近似与误差估计',
        category: '泰勒公式',
        definition: '泰勒近似的误差可通过余项公式估计：|Rₙ(x)| ≤ M|x-x₀|ⁿ⁺¹/(n+1)!，其中 M = max|f⁽ⁿ⁺¹(ξ)| 在区间 |ξ-x₀| ≤ |x-x₀| 上。',
        plainTranslation: '泰勒展开不是展开越多项越好——而是需要根据精度要求选择合适的项数。误差估计告诉我们：当你用 n 次多项式近似时，误差不会超过某个值。这样我们就能事先确定需要计算到第几项。',
        whyNeedIt: '误差估计让近似计算变得可控。在实际应用中，我们不可能无限展开，必须在精度和计算量之间权衡。余项公式给了我们这个判断标准。',
        example: '用 sin x ≈ x - x³/6 计算 sin 0.1，误差 ≤ max|cos ξ|·|x|⁵/5! ≤ 1·10⁻⁵/120 ≈ 8.3×10⁻⁸'
      },
      {
        id: 'power-series',
        name: '幂级数',
        category: '级数',
        definition: '形如 Σₙ₌₀^∞ aₙ(x-x₀)ⁿ 的级数称为幂级数。幂级数在其收敛区间内可以逐项求导、逐项积分，且和函数等于原函数。',
        plainTranslation: '幂级数就是"无穷多项式"——把泰勒公式中的多项式无限延伸。如果无限延伸后还能收敛，那它就能精确等于原函数。这就是"级数"的本质——用无穷多项式逼近一个函数。',
        whyNeedIt: '幂级数是连接代数和分析的桥梁。很多函数可以表示成幂级数，这让微分、积分、求解微分方程变得简单。幂级数在物理、工程中有广泛应用。',
        formula: '\\sum_{n=0}^\\infty a_n(x-x_0)^n',
        example: 'e^x = Σ xⁿ/n!，这是幂级数的典型例子。'
      },
      {
        id: 'radius-convergence',
        name: '幂级数的收敛半径',
        category: '级数',
        definition: '幂级数 Σaₙ(x-x₀)ⁿ 的收敛半径 R = lim|aₙ/aₙ₊₁|（比值判别法），或 R⁻¹ = limsup|aₙ|^(1/n)（根值判别法）。收敛区间为 (x₀-R, x₀+R)，需单独讨论端点。',
        plainTranslation: '幂级数不是处处收敛的——它有个"收敛半径"。在半径范围内，级数收敛；出了这个范围，级数就发散了。收敛半径就像级数的"势力范围"——在这个范围内，级数是有效的。',
        whyNeedIt: '知道收敛半径才知道幂级数在哪些点有意义。这是使用幂级数的前提。如果在某个点超出收敛半径，级数就失效了。',
        formula: 'R = \\lim_{n \\to \\infty} \\left|\\frac{a_n}{a_{n+1}}\\right|',
        example: 'e^x = Σxⁿ/n!，因为 aₙ = 1/n!，所以 R = lim n!/(n+1)! = ∞，e^x 在整个实数轴上都收敛。'
      },
      {
        id: 'termwise-operations',
        name: '幂级数的运算性质',
        category: '级数',
        definition: '幂级数在收敛区间内可以：\n(1) 逐项求导：d/dx Σaₙ(x-x₀)ⁿ = Σn·aₙ(x-x₀)ⁿ⁻¹\n(2) 逐项积分：∫Σaₙ(x-x₀)ⁿdx = Σaₙ/(n+1) (x-x₀)ⁿ⁺¹ + C\n(3) 线性运算：αΣaₙxⁿ + βΣbₙxⁿ = Σ(αaₙ+βbₙ)xⁿ',
        plainTranslation: '幂级数有一个神奇的性质：在收敛区间内，你可以像对普通多项式一样进行求导和积分，而且求导/积分后的级数仍然收敛，和函数就是原和函数的导数/积分。这让微分和积分变得非常简单。',
        whyNeedIt: '这个性质让复杂函数的微分积分变得简单。我们可以把函数展开成幂级数，然后逐项求导/积分，最后再加起来。这是求解很多数学物理方程的基础方法。',
        example: '因为 1/(1-x) = Σxⁿ (|x|<1)，两边积分得 -ln(1-x) = Σxⁿ⁺¹/(n+1)，即 ln(1-x) = -Σxⁿ⁺¹/(n+1)。'
      },
      {
        id: 'taylor-series',
        name: '泰勒级数',
        category: '级数',
        definition: '若函数 f(x) 在 x₀ 的某邻域内任意阶可导，且 lim(n→∞)Rₙ(x) = 0，则 f(x) = Σf⁽ⁿ⁾(x₀)/n! · (x-x₀)ⁿ，称为 f(x) 在 x₀ 处的泰勒级数。',
        plainTranslation: '泰勒级数就是泰勒公式的"无限版本"——把多项式无限延伸下去。当余项趋向于 0 时，这个无穷级数就精确等于原函数。不是所有函数都能展开成泰勒级数，只有"足够好"的函数才可以。',
        whyNeedIt: '泰勒级数让函数和级数建立了联系。很多函数（如 e^x, sin x）可以写成简洁的级数形式，这让计算、理论分析都变得简单。级数展开是数学物理中的核心技术。',
        formula: 'f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n',
        example: 'sin x 在 x=0 处的泰勒级数：sin x = x - x³/3! + x⁵/5! - ...，在整个实数域上都收敛到 sin x。'
      },
      {
        id: 'convergence-domain',
        name: '函数展开成幂级数的条件',
        category: '级数',
        definition: '函数 f(x) 能在 x₀ 邻域内展开成幂级数的充分必要条件是：f(x) 在该邻域内任意阶可导，且余项 lim(n→∞)Rₙ(x) = 0。常见可展开函数：e^x, sin x, cos x, ln(1+x), (1+x)^α。',
        plainTranslation: '不是所有函数都能写成幂级数。要能展开，需要两个条件：一是无限次可导（函数足够光滑），二是余项趋于0（展开式真的收敛到原函数）。大多数初等函数都满足这些条件，所以它们都可以展开。',
        whyNeedIt: '知道哪些函数可以展开成幂级数很重要。这样我们就知道哪些函数可以用级数方法处理，哪些不能用。这是使用级数解决实际问题的前提。',
        example: 'f(x) = e^(-1/x²) 在 x=0 处各阶导数都为 0，但它本身不为 0，所以不能展开成泰勒级数（这是"光滑但非解析"的例子）。'
      },
      {
        id: 'binomial-series',
        name: '二项式展开式',
        category: '级数',
        definition: '(1+x)^α = 1 + αx + α(α-1)/2! x² + α(α-1)(α-2)/3! x³ + ... = ΣC(α,n)xⁿ，其中 C(α,n) = α(α-1)...(α-n+1)/n!。当 α 为正整数时，退化为二项式定理。',
        plainTranslation: '二项式展开式把 (1+x)^α 展开成无穷级数。即使 α 不是整数，这个展开式仍然有意义！它把整数次幂推广到了任意次幂。特别地，当 α = -1 时，得到著名的几何级数。',
        whyNeedIt: '二项式展开式在概率论（伯努利分布）、物理（量子力学）、数学（分析学）中都有重要应用。它是把初等代数和无穷级数连接起来的重要公式。',
        formula: '(1+x)^\\alpha = \\sum_{n=0}^\\infty \\binom{\\alpha}{n} x^n',
        example: '(1+x)^(-1) = 1 - x + x² - x³ + ... = Σ(-1)ⁿxⁿ（几何级数）'
      },
      {
        id: 'applications-taylor',
        name: '泰勒公式的应用',
        category: '应用',
        definition: '泰勒公式的主要应用包括：(1) 函数近似计算；(2) 求极限（用展开式替代复杂函数）；(3) 证明不等式；(4) 求解微分方程；(5) 数值分析（龙格-库塔法等）。',
        plainTranslation: '泰勒公式是数学中的"瑞士军刀"——用途极其广泛。计算器算 sin、cos、e^x 用的是它；证明复杂不等式用的是它；数值计算用的也是它。可以说，现代科学计算离不开泰勒公式。',
        whyNeedIt: '泰勒公式是应用数学的核心工具。无论是工程设计、科学研究还是数据分析，都需要用到近似计算。掌握泰勒公式，就掌握了解决实际问题的钥匙。',
        example: '计算 e^0.1：e^0.1 ≈ 1 + 0.1 + 0.1²/2 + 0.1³/6 + 0.1⁴/24 ≈ 1.1051708，误差仅约 10⁻⁷。'
      },
      {
        id: 'taylor-approximation-error',
        name: '近似计算与误差估计',
        category: '泰勒公式',
        definition: '利用泰勒展开的有限项近似计算函数值，误差由余项控制。拉格朗日余项：|Rₙ(x)| = |f⁽ⁿ⁺¹⁾(ξ)|/(n+1)! · |x-x₀|ⁿ⁺¹ ≤ M/(n+1)! · |x-x₀|ⁿ⁺¹，其中 M 为 |f⁽ⁿ⁺¹⁾| 在区间上的上界。',
        plainTranslation: '泰勒近似的精度取决于你截取了多少项——项数越多越精确，但计算量也越大。误差估计告诉我们"最多差多少"，就像网购时的"预计送达时间"——实际可能更早，但不会更晚。拉格朗日余项给出了误差的上界。',
        whyNeedIt: '误差估计是近似计算的灵魂。没有误差估计的近似是不可信的。在工程计算中，我们需要知道近似值的精度是否满足要求。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter6',
    name: '第六章 微分方程',
    concepts: [
      {
        id: 'differential-equation-basics',
        name: '微分方程的基本概念',
        category: '基本概念',
        definition: '含有未知函数及其导数的方程称为微分方程。未知函数是一元函数的称为常微分方程，未知函数是多元函数的称为偏微分方程。微分方程的阶数是未知函数导数的最高阶数。',
        plainTranslation: '微分方程就是"带有导数的方程"——方程里不仅有未知函数，还有它的导数。就像你描述一个变化规律：变化率与当前状态有什么关系。生活中到处都是微分方程：人口增长、放射性衰变、物体冷却...都是微分方程。',
        whyNeedIt: '微分方程是描述动态系统的核心工具。物理中的运动方程、经济中的增长模型、生物中的种群动力学，都用微分方程。它让我们能预测系统的未来行为。',
        example: 'y\' = y 是一个微分方程。它的解是 y = Ce^x（C 为任意常数）。'
      },
      {
        id: 'separable-equation',
        name: '可分离变量微分方程',
        category: '一阶微分方程',
        definition: '形如 dy/dx = f(x)g(y) 的微分方程称为可分离变量方程。可化为：dy/g(y) = f(x)dx，两边积分求解。',
        plainTranslation: '可分离变量方程就是能把 x 和 y "分开"的方程。左边只含 y，右边只含 x。然后两边分别积分就能求解。',
        whyNeedIt: '可分离变量方程是一阶微分方程中最简单也最常见的形式。很多实际问题的模型都是可分离的。掌握它就能解决很多问题。',
        formula: '\\frac{dy}{dx} = f(x)g(y) \\Rightarrow \\frac{dy}{g(y)} = f(x)dx',
        example: 'dy/dx = xy，可分离为 dy/y = x dx，两边积分得 ln|y| = x²/2 + C，即 y = Ce^(x²/2)。'
      },
      {
        id: 'homogeneous-equation',
        name: '齐次方程',
        category: '一阶微分方程',
        definition: '形如 dy/dx = f(y/x) 的微分方程称为齐次方程。可通过变量替换 u = y/x 转化为可分离变量方程：u + x du/dx = f(u)。',
        plainTranslation: '齐次方程的特点是：右边只与 y/x 的比值有关。通过设 u = y/x，把方程转化为 u 的方程。几何上，这种方程的解曲线有"相似性"——过原点的直线都是对称轴。',
        whyNeedIt: '齐次方程是处理"比例关系"问题的利器。在经济学（规模效应）、物理学（相似原理）中很常见。',
        formula: '\\frac{dy}{dx} = f\\left(\\frac{y}{x}\\right), \\quad u = \\frac{y}{x}',
        example: 'dy/dx = (x² + y²)/(xy) = 1/(y/x) + y/x = 1/u + u。设 u = y/x，得 u + xdu/dx = 1/u + u，即 xdu/dx = 1/u，可分离求解。'
      },
      {
        id: 'first-order-linear',
        name: '一阶线性微分方程',
        category: '一阶微分方程',
        definition: '形如 dy/dx + P(x)y = Q(x) 的方程称为一阶线性微分方程。其解为：y = e^(-∫Pdx)[∫Q(x)e^(∫Pdx)dx + C]。',
        plainTranslation: '一阶线性方程是"线性"（次数为1）的方程。解法是使用积分因子 e^∫Pdx，作用是把左边"凑成"导数的形式。这是一种标准解法，必须掌握。',
        whyNeedIt: '一阶线性方程是电路分析、控制系统等工程问题的基础模型。很多物理系统的一阶近似都是线性的。',
        formula: 'y = e^{-\\int P(x)dx} \\left( \\int Q(x)e^{\\int P(x)dx}dx + C \\right)',
        example: 'dy/dx + y = e^x，积分因子 μ = e^∫1dx = e^x。方程变为 (ye^x)\' = e^{2x}，积分得 ye^x = e^{2x}/2 + C，所以 y = e^x/2 + Ce^{-x}。'
      },
      {
        id: 'exact-equation',
        name: '全微分方程',
        category: '一阶微分方程',
        definition: '若微分方程 P(x, y)dx + Q(x, y)dy = 0 满足 ∂P/∂y = ∂Q/∂x，则称其为全微分方程。其解为：∫Pdx + ∫(Q - ∂/∂y∫Pdx)dy = C。',
        plainTranslation: '全微分方程的特点是：左边正好是某个二元函数的全微分。就像物理中的"势能"——知道势能函数就能求力。全微分方程可以通过"凑全微分"来求解。',
        whyNeedIt: '全微分方程在物理（保守力场）、热力学（势函数）中很重要。判断是否为全微分方程、求解势函数都是基本技能。',
        formula: 'P(x,y)dx + Q(x,y)dy = dU(x,y)',
        example: '(2xy + 1)dx + (x² - y)dy = 0，验证：∂P/∂y = 2x，∂Q/∂x = 2x，是全微分。原函数 U = ∫(2xy+1)dx = x²y + x + φ(y)，∂U/∂y = x² + φ\'(y) = x² - y，所以 φ\'(y) = -y，φ(y) = -y²/2，C = x²y + x - y²/2 = 0。'
      },
      {
        id: 'bernoulli-equation',
        name: '伯努利方程',
        category: '一阶微分方程',
        definition: '形如 dy/dx + P(x)y = Q(x)y^n（n ≠ 0, 1）的方程称为伯努利方程。通过变量替换 z = y^(1-n) 可转化为线性方程。',
        plainTranslation: '伯努利方程是"非线性"的线性方程推广。通过换元 z = y^(1-n)，就能把非线性方程转化为线性方程。这是一个很巧妙技巧！',
        whyNeedIt: '伯努利方程在人口增长模型（n 为负）、流行病模型（n 为分数）中出现。换元法是处理非线性问题的常用技巧。',
        formula: 'z = y^{1-n}, \\quad \\frac{dz}{dx} + (1-n)P(x)z = (1-n)Q(x)',
        example: 'dy/dx + y = xy³，即 dy/dx + y = x y³，n=3。设 z = y^{-2}，则 dz/dx - 2y = -2x，化为线性方程求解。'
      },
      {
        id: 'higher-order-linear',
        name: '高阶线性微分方程',
        category: '高阶微分方程',
        definition: '形如 y\'\' + p(x)y\' + q(x)y = f(x) 的方程称为二阶常系数线性微分方程。若 f(x) = 0，则称为齐次方程；否则称为非齐次方程。',
        plainTranslation: '高阶线性微分方程是"线性"且"高阶"的方程。"线性"意味着导数次数都是1，没有乘积或复合；"齐次"意味着右边为 0，"非齐次"意味着右边不为 0。这是微分方程中最重要的一类！',
        whyNeedIt: '高阶线性微分方程在物理（振动、波动）、工程（控制系统）中极其重要。机械振动、电路分析、弹性系统等都用这类方程描述。',
        formula: 'y\'\' + p(x)y\' + q(x)y = f(x)',
        example: 'y\'\' - 3y\' + 2y = 0 是齐次方程；y\'\' - 3y\' + 2y = e^x 是非齐次方程。'
      },
      {
        id: 'constant-coeff-homogeneous',
        name: '二阶常系数齐次线性微分方程',
        category: '高阶微分方程',
        definition: '设 y\'\' + py\' + qy = 0，特征方程为 r² + pr + q = 0。\n(1) 若 r₁ ≠ r₂ 为两个不同实根，则通解 y = C₁e^(r₁x) + C₂e^(r₂x)\n(2) 若 r₁ = r₂ 为重实根，则通解 y = (C₁ + C₂x)e^(r₁x)\n(3) 若 r = α ± βi 为共轭复根，则通解 y = e^(αx)(C₁cosβx + C₂sinβx)',
        plainTranslation: '求解二阶常系数齐次线性微分方程，关键在于解特征方程。特征方程的根决定解的形式：\n- 两个不同实根 → 两个指数函数的和\n- 重根 → 指数函数乘 x\n- 共轭复根 → 指数函数乘正弦余弦（振荡！）\n这就是"特征根"分析法！',
        whyNeedIt: '这是求解所有常系数线性微分方程的基础。掌握它就能解大部分工程中遇到的微分方程。机械振动、电路分析都离不开它。',
        formula: 'r^2 + pr + q = 0',
        example: 'y\'\' - 3y\' + 2y = 0，特征方程 r² - 3r + 2 = 0，(r-1)(r-2)=0，r₁=1，r₂=2，通解 y = C₁e^x + C₂e^{2x}。'
      },
      {
        id: 'constant-coeff-nonhomogeneous',
        name: '二阶常系数非齐次线性微分方程',
        category: '高阶微分方程',
        definition: '非齐次方程 y\'\' + py\' + qy = f(x) 的通解 = 齐次方程通解 + 非齐次方程特解。常用待定系数法求特解：\n(1) 若 f(x) = Pₙ(x)e^(λx)，则设特解 y* = e^(λx)Qₙ(x)x^k（λ 是特征根时 k=1，否则 k=0）\n(2) 若 f(x) = e^(αx)[Pₘ(x)cosβx + Qₙ(x)sinβx]，则设 y* = e^(αx)[Rₖ(x)cosβx + Sₖ(x)sinβx]x^k（k=1 当 α±βi 是特征根）',
        plainTranslation: '非齐次方程的通解 = 齐次方程通解 + 非齐次方程特解。求特解的待定系数法就是"猜"一个解的形式，然后把系数确定出来。关键是看右边 f(x) 的形式来"猜"：\n- 多项式 × 指数 → 类似形式\n- 指数 × 三角 → 指数 × (三角类似形式)\n这是求解非齐次方程的核心方法！',
        whyNeedIt: '非齐次方程描述有"外力"或"驱动"的系统。有阻尼的振动、有电源的电路等都需要解非齐次方程。这是工程应用的核心。',
        example: 'y\'\' - 3y\' + 2y = 2x + 1。齐次解 y₁ = C₁e^x + C₂e^{2x}。设特解 y* = Ax + B，代入得 -3A + 2(Ax + B) = 2x + 1，即 2Ax + (2B - 3A) = 2x + 1，解得 A=1，B=2，特解 y* = x + 2，通解 y = C₁e^x + C₂e^{2x} + x + 2。'
      },
      {
        id: 'euler-equation',
        name: '欧拉方程',
        category: '高阶微分方程',
        definition: '形如 x²y\'\' + pxy\' + qy = f(x) 的方程称为欧拉方程（可推广）。可通过变量替换 x = e^t 转化为常系数线性微分方程。',
        plainTranslation: '欧拉方程的特点是系数"自相似"——x 的次数与导数阶数对应。通过换元 x = e^t，把"幂函数"形式的方程转化为"指数函数"形式的常系数方程。这是一种重要的化简技巧！',
        whyNeedIt: '欧拉方程在求解某些特殊区域的边值问题（如球坐标、柱坐标中的分离变量）中会出现。这是数学物理方法中的重要工具。',
        formula: 'x^2 y\'\' + p x y\' + q y = f(x)',
        example: 'x²y\'\' - 2xy\' + 2y = 0。令 x = e^t，设 u(t) = y(e^t)，则 dy/dx = (1/x)du/dt，d²y/dx² = (1/x²)(d²u/dt² - du/dt)，代入化简求解。'
      },
      {
        id: 'reducible-higher-order',
        name: '可降阶的高阶微分方程',
        category: '高阶微分方程',
        definition: '形如 y^(n) = f(x) 的方程，可通过 n 次积分求解。形如 y\'\' = f(x, y\') 的方程，令 p = y\'，则 p\' = f(x, p)，降为一阶方程。形如 y\'\' = f(y, y\') 的方程，令 p = y\'，则 p·dp/dy = f(y, p)，降为一阶方程。',
        plainTranslation: '可降阶的高阶方程就是"能降为一阶"的方程。核心口诀："缺谁降谁"——缺 y 就令 p = y\'，缺 x 就令 p = y\' 并注意 y\'\' = p·dp/dy。通过换元，把高阶问题转化为低阶问题！',
        whyNeedIt: '很多实际问题的微分方程是高阶的，但降阶法让我们能把复杂的高阶方程拆成多个简单的一阶方程来求解。这是求解高阶方程的基础技巧。',
        formula: "y'' = f(x, y') \\to \\text{令} p = y', \\text{则} p' = f(x, p)",
        example: 'y\'\' = x + 1，两边积分得 y\' = x²/2 + x + C₁，再积分得 y = x³/6 + x²/2 + C₁x + C₂。'
      },
      {
        id: 'variation-of-constants',
        name: '常数变易法',
        category: '解法',
        definition: '对于非齐次线性微分方程 y\'\' + p(x)y\' + q(x)y = f(x)，若对应的齐次方程通解为 y = C₁y₁(x) + C₂y₂(x)，则设非齐次方程的解为 y = u₁(x)y₁(x) + u₂(x)y₂(x)，通过求解 u₁\'、u₂\' 的方程组确定 u₁、u₂。',
        plainTranslation: '常数变易法的思想是"把常数变成函数"！齐次方程的解是 C₁y₁ + C₂y₂，非齐次方程的解则是 u₁y₁ + u₂y₂。这里的 u₁、u₂ 不是常数，而是待定函数。通过让导数满足特定条件来确定它们。',
        whyNeedIt: '当待定系数法失效时（比如 f(x) 不是多项式×指数或多项式×三角的组合），常数变易法是最后的"万能解法"。它适用于任何非齐次线性方程。',
        formula: "y = u_1 y_1 + u_2 y_2, \\text{其中} u_1' = \\frac{-y_2 f}{y_1 y_2' - y_1' y_2}, u_2' = \\frac{y_1 f}{y_1 y_2' - y_1' y_2}",
        example: 'y\'\' + y = sec x。对应齐次方程 y\'\' + y = 0 的解为 y₁ = cos x, y₂ = sin x。设 y = u₁cos x + u₂sin x，解得 u₁\' = -sin x·sec x = -tan x，u₂\' = cos x·sec x = 1，故 u₁ = ln|cos x| + C₁，u₂ = x + C₂，通解 y = cos x·ln|cos x| + x·sin x。'
      },
      {
        id: 'reduction-order',
        name: '降阶法',
        category: '高阶微分方程',
        definition: '对于高阶线性微分方程，若已知一个特解，可通过设 y = u(x)·y₁(x) 降阶。对于二阶方程 y\'\' + p(x)y\' + q(x)y = 0，若已知 y₁，则设 y = u·y₁，代入化简后令 z = u\' 可降为一阶方程。',
        plainTranslation: '降阶法就是"利用已知的解来找更多的解"。如果你已经知道一个特解 y₁，就可以设 y = u·y₁，把方程"降一阶"来求解。这是一种重要的求解技巧！',
        whyNeedIt: '降阶法让我们能利用已知解来求更多解。对于某些无法直接用特征根法求解的方程，降阶法是重要工具。',
        example: '已知 y₁ = x 是 y\'\' - (x²)y\' + (2x)y = 0 的解，设 y = ux，代入化简可得关于 z = u\' 的一阶方程。'
      },
      {
        id: 'system-differential-equations',
        name: '微分方程组',
        category: '微分方程组',
        definition: '由多个微分方程联立构成的系统称为微分方程组。常系数线性微分方程组可用矩阵方法求解：X\' = AX + F，其中 X = (x₁, x₂, ..., xₙ)ᵀ，A 为系数矩阵。',
        plainTranslation: '微分方程组就是"多个方程一起求解"。比如生态系统中的捕食者-猎物模型、经济系统中的多部门模型等，都需要用方程组来描述。矩阵方法是解线性方程组的利器！',
        whyNeedIt: '微分方程组在控制理论、电路分析、生态模型、经济模型中广泛应用。很多实际问题涉及多个相互作用的变量，需要用方程组来描述。',
        formula: '\\frac{dX}{dt} = AX + F',
        example: 'dx/dt = x + y，dy/dt = 2x - y。写成矩阵形式 X\' = [[1,1],[2,-1]]X，可求特征根、解方程组。'
      },
      {
        id: 'application-de',
        name: '微分方程的应用',
        category: '应用',
        definition: '微分方程在物理（Newton第二定律、电磁场）、生物（种群动力学）、化学（反应动力学）、经济（增长模型）、工程（控制系统）等领域有广泛应用。',
        plainTranslation: '微分方程是描述"变化规律"的数学语言。物理中的运动定律是微分方程——加速度是位置对时间的二阶导数；人口增长是微分方程——增长率与当前人口成正比。可以说，现代科学离不开微分方程！',
        whyNeedIt: '微分方程是连接数学理论和实际应用的桥梁。掌握微分方程，就能用数学工具预测和控制真实世界的动态系统。这是工程技术人员必须掌握的核心技能。',
        example: '放射性衰变：dN/dt = -kN，解得 N = N₀e^(-kt)。半衰期 T = ln2/k。'
      },
      {
        id: 'series-solution',
        name: '微分方程的级数解法',
        category: '解法',
        definition: '对于难以用初等函数求解的微分方程，可在某点附近展开为幂级数求解。设 y = Σaₙ(x-x₀)ⁿ，代入方程比较系数得到递推公式，求出系数得到级数解。',
        plainTranslation: '级数解法就是"把解写成无穷多项式"。当不能用特征根、积分因子等方法求解时，可以尝试把解假设成幂级数的形式，代入方程来确定系数。这是一种"万能"方法！',
        whyNeedIt: '很多特殊函数（贝塞尔函数、勒让德函数）都是用级数解法得到的。在数学物理中，这些特殊函数有重要应用。级数解法是求解非常规微分方程的基本方法。',
        example: 'y\'\' + y = 0，设 y = Σaₙxⁿ，代入得 aₙ = -aₙ₋₂，可得周期解 y = C₀(1 - x²/2! + x⁴/4! - ...) + C₁(x - x³/3! + x⁵/5! - ...)。'
      },
      {
        id: 'difference-equation',
        name: '差分方程',
        category: '差分方程',
        definition: '差分方程是含有离散变量差分的方程。一阶差分 Δyₓ = yₓ₊₁ - yₓ，二阶差分 Δ²yₓ = Δ(Δyₓ)。一阶常系数线性差分方程 yₓ₊₁ + ayₓ = f(x) 的通解 = 齐次通解 + 非齐次特解。',
        plainTranslation: '差分方程就是微分方程的"离散版"——微分方程研究连续变化，差分方程研究离散变化。银行存款的复利计算、人口按年增长模型，都是差分方程的例子。解法和微分方程很类似：先解齐次，再找特解。',
        whyNeedIt: '差分方程是数三考研的必考内容。在经济管理中，很多模型（如蛛网模型、乘数-加速模型）都用差分方程描述。它也是数值计算中递推算法的理论基础。',
        formula: 'y_{x+1} + ay_x = f(x), \\quad \\text{齐次通解} = C(-a)^x'
      }
    ] as Concept[]
  },
  {
    id: 'chapter7',
    name: '第七章 无穷级数',
    concepts: [
      {
        id: 'series-basics',
        name: '常数项级数的概念',
        category: '基本概念',
        definition: '设数列 {uₙ}，则表达式 u₁ + u₂ + ... + uₙ + ... 称为无穷级数，记作 Σₙ₌₁^∞ uₙ。部分和 Sₙ = u₁ + u₂ + ... + uₙ。若 lim(n→∞) Sₙ = S 存在，则级数收敛，和为 S；否则发散。',
        plainTranslation: '无穷级数就是"无限个数相加"。虽然听起来不可能（无限多个数加起来怎么会是有限的？），但实际上很多无穷级数加起来确实是一个有限的数！关键看它是否"收敛"。比如 0.999... = 1 就是用级数 0.9 + 0.09 + 0.009 + ... = 1 证明的。',
        whyNeedIt: '级数是表示函数、研究函数性质的重要工具。在物理中，周期运动可以用傅里叶级数分解；在概率中，很多分布用级数展开；在工程中，信号处理离不开级数。级数是连接离散和连续的桥梁。',
        formula: '\\sum_{n=1}^\\infty u_n = \\lim_{n \\to \\infty} S_n',
        example: '等比级数 1 + 1/2 + 1/4 + ... = 1/(1-1/2) = 2 收敛；而级数 1 + 1/2 + 1/3 + ... 发散（调和级数）。'
      },
      {
        id: 'convergence-tests',
        name: '正项级数的收敛判别',
        category: '收敛判别',
        definition: '正项级数 Σuₙ (uₙ ≥ 0) 收敛的判别方法：\n(1) 比较判别：若 uₙ ≤ vₙ，且 Σvₙ 收敛，则 Σuₙ 收敛\n(2) 比值判别：若 lim(uₙ₊₁/uₙ) = ρ，则 ρ < 1 收敛，ρ > 1 发散\n(3) 根值判别：若 lim(uₙ)^(1/n) = ρ，则 ρ < 1 收敛，ρ > 1 发散\n(4) 积分判别：若 f(x) 递减且正，Σuₙ 与 ∫₁^∞ f(x)dx 同敛散',
        plainTranslation: '正项级数因为每一项都非负，加起来只会越来越多或保持不变。判断它是否收敛，就是看它能不能"控制住"不无限增长。比较判别是"找参照物"；比值判别是"看增长速度"；根值判别是"看 n 次方的增长"。',
        whyNeedIt: '正项级数收敛判别是级数理论的核心。很多复杂级数的收敛性都需要用这些判别法来判断。掌握它们，就掌握了判断级数收敛性的基本工具。',
        formula: '\\lim_{n \\to \\infty} \\frac{u_{n+1}}{u_n} = \\rho',
        example: 'Σ n!/n^n 用比值判别：ρ = lim (n+1)!/((n+1)^(n+1)) · (n^n)/n! = lim (n^n)/((n+1)^n) = lim (1/(1+1/n)^n) = 1/e < 1，收敛。'
      },
      {
        id: 'alternating-series',
        name: '交错级数',
        category: '收敛判别',
        definition: '交错级数是指各项正负交替的级数：Σ(-1)ⁿ⁻¹uₙ 或 Σ(-1)ⁿuₙ，其中 uₙ > 0。莱布尼茨判别法：若 uₙ 单调递减且 lim(n→∞)uₙ = 0，则交错级数收敛。',
        plainTranslation: '交错级数就是"正负交替"的级数。虽然各项符号交替，但只要正项递减到 0，级数就能收敛！就像一个左右摆动的钟摆，虽然来回摆动，但幅度越来越小，最终会停下来。',
        whyNeedIt: '交错级数在傅里叶级数、物理中的振动分析中很重要。莱布尼茨判别法是一个简单有效的判别工具。',
        formula: '\\sum_{n=1}^\\infty (-1)^{n-1} u_n',
        example: '交错调和级数 1 - 1/2 + 1/3 - 1/4 + ... 收敛（交错级数），其和为 ln 2。'
      },
      {
        id: 'absolute-convergence',
        name: '绝对收敛与条件收敛',
        category: '收敛判别',
        definition: '若 Σ|uₙ| 收敛，则称 Σuₙ 绝对收敛；若 Σ|uₙ| 发散而 Σuₙ 收敛，则称 Σuₙ 条件收敛。绝对收敛的级数必定收敛；条件收敛的级数仅条件收敛。',
        plainTranslation: '绝对收敛就是"不管符号怎么加都收敛"——把所有项都变成正的，结果还是收敛的。条件收敛则是"正负抵消才收敛"——如果只看绝对值就发散了。比如 1 - 1/2 + 1/3 - 1/4 + ... 是条件收敛，但 1 - 1/2² + 1/3² - ... 是绝对收敛。',
        whyNeedIt: '区分绝对收敛和条件收敛很重要。绝对收敛的级数可以任意重排和、乘积，性质很好；条件收敛的级数没有这些良好性质。在级数运算中，这个区别很关键。',
        example: 'Σ(-1)ⁿ⁻¹/n 条件收敛（调和级数发散）；Σ(-1)ⁿ⁻¹/n² 绝对收敛（p级数，p>1）。'
      },
      {
        id: 'power-series-convergence',
        name: '幂级数的收敛性',
        category: '收敛判别',
        definition: '幂级数 Σaₙxⁿ 的收敛半径 R = lim|aₙ/aₙ₊₁|。收敛区间：\n(1) 若 R > 0，则在 (|x| < R) 内收敛，(|x| > R) 外发散\n(2) 端点 x = ±R 需单独判断\n(3) 幂级数在收敛区间内绝对收敛',
        plainTranslation: '幂级数的收敛性由收敛半径 R 决定。简单说：幂级数就像一个"势力范围"，在这个范围内（|x| < R）它乘乘有于个收敛点，一出这个范围就发散了。关键是求对收敛半径。',
        whyNeedIt: '知道幂级数的收敛区间才能正确使用它。如果在某个点超出收敛范围，级数就失效了。这是使用幂级数的前提。',
        formula: 'R = \\lim_{n \\to \\infty} \\left|\\frac{a_n}{a_{n+1}}\\right|',
        example: 'Σx^n/n 的收敛半径 R = lim n/(n+1) = 1，收敛区间 (-1, 1)，在 x=-1 条件收敛，x=1 发散。'
      },
      {
        id: 'fourier-series',
        name: '傅里叶级数',
        category: '函数展开',
        definition: '周期为 2l 的函数 f(x) 的傅里叶级数：f(x) ~ a₀/2 + Σ[aₙcos(nπx/l) + bₙsin(nπx/l)]，其中 aₙ = (1/l)∫₋ₗˡ f(x)cos(nπx/l)dx，bₙ = (1/l)∫₋ₗˡ f(x)sin(nπx/l)dx。',
        plainTranslation: '傅里叶级数说：任何周期函数都可以分解成一系列正弦和余弦的叠加！就像把一首曲子分解成不同频率的音符。每个正弦/余弦分量叫"谐波"，它们决定了音色的不同。傅里叶变换是现代信号处理的基石。',
        whyNeedIt: '傅里里叶级数是物理和工程中最重要的工具之一。信号处理、图像压缩、音频分析、量子力学、热传导等都离不开它。它把时域和频域连接起来。',
        formula: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty (a_n \\cos \\frac{n\\pi x}{l} + b_n \\sin \\frac{n\\pi x}{l})',
        example: '方波展开成傅里叶级数：f(x) = 4/π (sin x + sin 3x/3 + sin 5x/5 + ...)。'
      },
      {
        id: 'dirichlet-theorem',
        name: '狄利克雷收敛定理',
        category: '函数展开',
        definition: '若周期函数 f(x) 在一个周期内：(1) 连续或只有有限个第一类间断点；(2) 只有有限个极值点，则傅里叶级数在连续点收敛于 f(x)，在间断点收敛于左右极限的均值。',
        plainTranslation: '狄利克雷收敛定理告诉我们：大多数实际遇到的周期函数都能展开成傅里叶级数！它给了傅里叶级数收敛的充分条件。简单说：只要函数不太"糟糕"（没有无限多间断点、没有无限多极值点），就能展开。',
        whyNeedIt: '这个定理是傅里叶级数的理论基础。它保证了在大多数情况下，傅里叶级数确实能表示原函数。这让傅里叶方法在实际应用中有了理论保障。',
        example: '方波函数有有限个间断点，满足狄利克雷条件，所以在连续点收敛到原函数值，在间断点收敛到左右极限的平均值。'
      },
      {
        id: 'abel-theorem',
        name: '阿贝尔定理',
        category: '幂级数',
        definition: '若幂级数 Σaₙ(x-x₀)ⁿ 在 x = x₁ 处收敛，则对所有满足 |x-x₀| < |x₁-x₀| 的 x 都绝对收敛。若在 x = x₂ 处发散，则对所有满足 |x-x₀| > |x₂-x₀| 的 x 都发散。',
        plainTranslation: '阿贝尔定理告诉我们：幂级数的收敛域是一个以 x₀ 为中心的区间！从收敛点往里都是收敛的，从发散点往外都是发散的。这让幂级数的收敛域必定是一个区间（可能缺几个点）。',
        whyNeedIt: '阿贝尔定理是研究幂级数收敛域的核心工具。它让我们能通过"探测"边界点来确定整个收敛区间。这是求收敛半径的基础。',
        formula: '\\text{收敛半径} R = \\lim \\left|\\frac{a_n}{a_{n+1}}\\right| \\text{或} R = \\lim \\frac{1}{|a_n|^{1/n}}',
        example: 'Σxⁿ 的收敛半径 R = 1，因为在 x = 1 处发散，在 x = -1 处条件收敛，所以收敛域是 (-1, 1]。'
      },
      {
        id: 'series-calculus',
        name: '级数的运算性质',
        category: '运算性质',
        definition: '收敛级数的运算：\n(1) 加减：Σaₙ ± Σbₙ = Σ(aₙ ± bₙ)\n(2) 数乘：k·Σaₙ = Σk·aₙ\n(3) 乘法（绝对收敛）：(Σaₙ)(Σbₙ) = Σcₙ，其中 cₙ = Σₖ₌₀ⁿ aₖbₙ₋ₖ',
        plainTranslation: '收敛级数可以像有限和一样进行运算！可以加减、数乘，还可以乘法（如果是绝对收敛的话）。这让级数的使用变得很灵活。',
        whyNeedIt: '这些运算性质让级数使用更方便。特别是在证明定理、进行计算时，这些性质经常用到。注意：乘法要求绝对收敛，否则可能出问题。',
        example: 'e^x · e^y = (Σx^n/n!) · (Σy^n/n!) = Σ(x+y)^n/n! = e^(x+y)'
      },
      {
        id: 'comparison-limit-test',
        name: '比较判别法的极限形式',
        category: '级数判别',
        definition: '设 ∑aₙ 和 ∑bₙ 都是正项级数，若 lim(aₙ/bₙ) = c（0 < c < +∞），则两级数同敛同散。若 c=0 且 ∑bₙ 收敛，则 ∑aₙ 收敛；若 c=+∞ 且 ∑bₙ 发散，则 ∑aₙ 发散。',
        plainTranslation: '极限形式是"比较判别法2.0版"——不用找不等式，只需看两个级数通项的"比值极限"。如果极限是一个正的有限数，那它俩"命运相同"（同敛同散）。这比原始的比较判别法好用得多，因为找不等式往往很困难。',
        whyNeedIt: '极限形式是比较判别法最常用的版本，考研中几乎必考。选好参考级数（通常是p级数），算一下极限就能判别收敛性。',
        formula: '\\lim \\frac{a_n}{b_n} = c \\in (0,+\\infty) \\Rightarrow \\sum a_n \\text{与} \\sum b_n \\text{同敛散}'
      },
      {
        id: 'ratio-test',
        name: '比值判别法（达朗贝尔判别法）',
        category: '级数判别',
        definition: '对正项级数 ∑aₙ，若 lim(aₙ₊₁/aₙ) = ρ，则：ρ < 1 时级数收敛；ρ > 1 时级数发散；ρ = 1 时判别法失效。',
        plainTranslation: '比值判别法就是看"后一项是前一项的几倍"。如果倍数小于1，说明项在"加速缩小"，级数收敛；如果倍数大于1，说明项在"膨胀"，级数发散；恰好等于1时"不好说"，需要换别的方法。就像判断投资回报——回报率低于1说明在亏钱（收敛到0），高于1说明在赚钱（发散增长）。',
        whyNeedIt: '比值判别法是判别含阶乘、指数等"项间有明确比值关系"的级数的首选方法，操作简便，结论明确。',
        formula: '\\lim \\frac{a_{n+1}}{a_n} = \\rho: \\quad \\rho < 1 \\text{收敛}, \\quad \\rho > 1 \\text{发散}'
      },
      {
        id: 'root-test',
        name: '根值判别法（柯西判别法）',
        category: '级数判别',
        definition: '对正项级数 ∑aₙ，若 lim ⁿ√aₙ = ρ，则：ρ < 1 时级数收敛；ρ > 1 时级数发散；ρ = 1 时判别法失效。',
        plainTranslation: '根值判别法和比值判别法类似，只是看的是"第n项开n次方"的极限。当通项含有n次幂时（如aₙ = (n/(n+1))^n²），根值法往往比比值法更方便。同样，ρ=1时失效。',
        whyNeedIt: '根值判别法是比值判别法的"兄弟"，特别适合通项含n次幂的级数。在某些比值法失效的情况下，根值法仍能给出结论。',
        formula: '\\lim \\sqrt[n]{a_n} = \\rho: \\quad \\rho < 1 \\text{收敛}, \\quad \\rho > 1 \\text{发散}'
      },
      {
        id: 'integral-test',
        name: '积分判别法',
        category: '级数判别',
        definition: '设 f(x) 在 [1,+∞) 上非负递减，则级数 ∑f(n) 与积分 ∫₁^∞ f(x)dx 同敛散。',
        plainTranslation: '积分判别法把级数和积分联系起来了——如果函数的积分收敛，对应的级数也收敛；积分发散，级数也发散。就像用"连续版本的求和"来判断"离散版本的求和"是否有限。p级数的收敛性就是用积分判别法证明的。',
        whyNeedIt: '积分判别法是判断通项可表示为递减函数的级数敛散性的有力工具。它提供了级数与积分之间的深层联系。',
        formula: '\\sum_{n=1}^{\\infty} f(n) \\text{与} \\int_1^{\\infty} f(x)dx \\text{同敛散}'
      },
      {
        id: 'uniform-convergence',
        name: '函数项级数的一致收敛',
        category: '级数理论',
        definition: '若对任意 ε>0，存在与 x 无关的 N，使得当 n>N 时，对所有 x∈I 有 |S(x)-Sₙ(x)|<ε，则称 ∑uₙ(x) 在 I 上一致收敛于 S(x)。Weierstrass判别法（M判别法）：若 |uₙ(x)| ≤ Mₙ 且 ∑Mₙ 收敛，则 ∑uₙ(x) 一致收敛。',
        plainTranslation: '一致收敛就是"整体地、均匀地逼近"——不仅每个点都收敛，而且收敛的"速度"在各处都差不多。普通收敛可能有的点快有的点慢，但一致收敛要求"齐步走"。M判别法提供了检验一致收敛的简便方法：给每项套上绝对值上界，如果上界级数收敛，就一致收敛。',
        whyNeedIt: '一致收敛保证了极限函数的连续性、可积性和可微性能从级数项"传递"到和函数，是级数理论的核心概念。没有一致收敛，逐项求导/积分可能不合法。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter8',
    name: '第八章 多元函数微分学',
    concepts: [
      {
        id: 'multivariable-basics',
        name: '多元函数的概念',
        category: '基本概念',
        definition: '设 D 是平面上的点集，若对 D 中每一点 (x, y)，按照某个法则 f，有唯一确定的实数 z 与之对应，则称 f 是定义在 D 上的二元函数，记作 z = f(x, y)，(x, y) ∈ D。D 称为定义域。',
        plainTranslation: '多元函数就是"多变量"的函数——输入不再是一个数，而是一组数（坐标）。就像天气不仅取决于时间，还取决于地点、海拔等。现实世界的问题大多涉及多个变量，所以多元函数比一元函数更接近实际。',
        whyNeedIt: '现实问题很少只依赖一个变量。经济受多个因素影响，物理量受多个条件制约。多元函数让我们能处理这些问题。它是一切科学计算的基础。',
        formula: 'z = f(x, y), \\quad (x, y) \\in D',
        example: 'z = x² + y² 是一个二元函数，它的定义域是整个平面 R²，值域是 [0, +∞)。'
      },
      {
        id: 'point-classification',
        name: '点的分类（内点、外点、边界点、聚点）',
        category: '基本概念',
        definition: '设 D 是平面点集，P₀ 是平面上的点：\n(1) 内点：存在邻域 U(P₀) ⊂ D\n(2) 外点：存在邻域 U(P₀) 与 D 无交集\n(3) 边界点：任意邻域内既有 D 中的点又有 D 外的点\n(4) 聚点：任意邻域内总有 D 中无限多个点（可属于 D 也可不属于 D）',
        plainTranslation: '点集里的点也分"身份"！内点是完全在集合里面的点；外点是完全在集合外面的点；边界点是"脚踏两条船"的点；聚点是在集合附近"聚集"很多点的位置。这些概念帮助我们精确描述点集的结构。',
        whyNeedIt: '这些概念是理解多元函数定义域、连续性、可微性的基础。区域的内点都是"内部"，边界点构成"边界"，聚点是"极限点"。很多定理（如最值定理）需要在闭区域上讨论，这就需要理解这些点的概念。',
        example: 'D = {(x,y) | x² + y² < 1}（单位圆内部）：内点：所有满足 x²+y² < 1 的点；边界点：满足 x²+y² = 1 的点（单位圆周）；聚点：边界点及所有内点。'
      },
      {
        id: 'open-closed-set',
        name: '开集与闭集',
        category: '基本概念',
        definition: '若点集 D 的所有点都是内点，则 D 称为开集；若 D 包含其所有边界点，则 D 称为闭集。若 D 可以表示为有限个互不相交的开区域的并，则 D 称为区域。',
        plainTranslation: '开集就是"没有边界"的集合——每个点都是内部点；闭集就是"包含边界"的集合。单位圆内部是开集（没有边界），单位圆内部+边界（闭圆盘）是闭集。区域就是连通的开集。',
        whyNeedIt: '开集和闭集是分析学的基础概念。很多重要定理（如最大值定理）的成立需要函数在闭区域上连续。理解开集和闭集，才能正确表述和证明这些定理。',
        example: 'D₁ = {(x,y) | x² + y² < 1} 是开集（不是闭集）；D₂ = {(x,y) | x² + y² ≤ 1} 是闭集（不是开集）；D₃ = {(x,y) | 0 < x < 1, 0 < y < 1} 是区域（开集且连通）。'
      },
      {
        id: 'multivariable-limit',
        name: '多元函数的极限',
        category: '基本概念',
        definition: '设函数 f(x, y) 在点 (x₀, y₀) 的某去心邻域内有定义。若存在常数 A，对于任意 ε > 0，总存在 δ > 0，使得当 0 < √((x-x₀)² + (y-y₀)²) < δ 时，|f(x, y) - A| < ε 成立，则称 A 为函数 f(x, y) 当 (x, y) 趋向于 (x₀, y₀) 时的极限。',
        plainTranslation: '多元函数的极限和一元类似，但更复杂——因为 (x, y) 可以从任意方向、任意路径趋向 (x₀, y₀)！只有从所有方向都趋向同一个值时，极限才存在。这比一元函数严格得多。',
        whyNeedIt: '多元函数的极限是研究多元函数连续性、可微性的基础。只有理解多元极限，才能理解多元函数的性质。',
        formula: '\\lim_{(x,y) \\to (x_0,y_0)} f(x,y) = A',
        example: 'lim(x,y→0) (x²+y²)/(x+y) 不存在，因为沿不同路径趋向0时极限不同；但 lim(x,y→0) (x²y)/(x²+y²) = 0（可证）。'
      },
      {
        id: 'multivariable-continuity',
        name: '多元函数的连续性',
        category: '基本概念',
        definition: '设函数 f(x, y) 在点 (x₀, y₀) 的某邻域内有定义，若 lim(x,y→x₀,y₀) f(x, y) = f(x₀, y₀)，则称 f(x, y) 在点 (x₀, y₀) 连续。若函数在区域 D 内每点都连续，则称在 D 上连续。',
        plainTranslation: '多元函数连续就是：当输入变化很小时，输出也变化很小。没有突然的跳跃。和一元函数一样，连续函数有很好性质：在闭区域上必有最大最小值。',
        whyNeedIt: '连续性是多元函数可微性的前提。在实际应用中，连续函数更符合自然规律。连续性理论让我们能在多元函数上使用微分工具。',
        example: 'f(x,y) = x² + y² 在 R² 上连续。'
      },
      {
        id: 'partial-derivative',
        name: '偏导数',
        category: '偏导数',
        definition: '设 z = f(x, y)，若极限 lim(Δx→0) [f(x₀+Δx, y₀) - f(x₀, y₀)]/Δx 存在，则称此极限为 f 在 (x₀, y₀) 对 x 的偏导数，记作 fₓ(x₀, y₀) 或 ∂f/∂x。对 y 的偏导数类似。',
        plainTranslation: '偏导数就是"只让一个变量变化，其他变量固定"时的导数。就像在山上：只往北走（x方向）的坡度是 x 偏导，只往东走（y方向）的坡度是 y 偏导。偏导数告诉我们函数在各个"方向"上的变化率。',
        whyNeedIt: '偏导数是多元函数微分学的基础。它让我们能用一阶导数的工具研究多元函数。在物理、经济、工程中，偏导数用于研究多因素影响的问题。',
        formula: "f_x(x_0, y_0) = \\frac{\\partial f}{\\partial x}\\bigg|_{(x_0,y_0)} = \\lim_{\\Delta x \\to 0} \\frac{f(x_0+\\Delta x, y_0) - f(x_0, y_0)}{\\Delta x}",
        example: 'f(x,y) = x²y + y³，则 fₓ = 2xy，fᵧ = x² + 3y²。'
      },
      {
        id: 'total-differential',
        name: '全微分',
        category: '微分',
        definition: '设 z = f(x, y) 在点 (x, y) 的某邻域内有定义，若函数的全增量 Δz = f(x+Δx, y+Δy) - f(x, y) 可表示为 Δz = A·Δx + B·Δy + o(ρ)，其中 ρ = √(Δx² + Δy²)，则称函数在点 (x, y) 可微，并称 dz = A·dx + B·dy 为全微分。',
        plainTranslation: '全微分是一元函数微分的推广。它说的是：当 (x, y) 变化时，函数值的变化可以近似成"A 乘 x 的变化 + B 乘 y 的变化"。A 和 B 就是偏导数。全微分让我们能用线性近似处理多元函数。',
        whyNeedIt: '全微分是多元函数近似计算的基础。在实际应用中，我们经常需要估计多个变量同时变化时函数值的变化。全微分给出了这个估计的精确公式。',
        formula: 'dz = f_x dx + f_y dy',
        example: 'z = x²y，在 (1,2) 处，dz = 2xy·dx + x²·dy = 4dx + dy。当 dx=0.01, dy=0.02 时，dz ≈ 4×0.01 + 0.02 = 0.06。'
      },
      {
        id: 'chain-rule-multivariable',
        name: '多元复合函数求导',
        category: '求导法则',
        definition: '若 z = f(u, v)，u = u(x, y)，v = v(x, y)，则：\n∂z/∂x = ∂z/∂u · ∂u/∂x + ∂z/∂v · ∂v/∂x\n∂z/∂y = ∂z/∂u · ∂u/∂y + ∂z/∂v · ∂v/∂y\n简言之：链式法则——"路径求导要相加"。',
        plainTranslation: '多元复合函数求导就是"层层剥笋"加"路径相加"。如果 z 依赖 u 和 v，而 u 和 v 又依赖 x 和 y，那么 z 对 x 的变化率 = 所有从 x 到 z 的路径的变化率之和。每条路径就是偏导数的乘积。',
        whyNeedIt: '复合函数求导是多元微分计算的核心技巧。它让我们能处理复杂的多元函数关系。在物理（复合场）、经济（复合函数模型）中应用广泛。',
        formula: '\\frac{\\partial z}{\\partial x} = \\frac{\\partial z}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial z}{\\partial v}\\frac{\\partial v}{\\partial x}',
        example: 'z = u² + v³，u = x + y，v = xy，则 zₓ = 2u·1 + 3v²·y = 2(x+y) + 3x²y²·y。'
      },
      {
        id: 'implicit-derivation-multivariable',
        name: '隐函数求导',
        category: '求导法则',
        definition: '若方程 F(x, y, z) = 0 确定 z = f(x, y)，且 F₃ ≠ 0，则：\n∂z/∂x = -Fₓ/F₤，∂z/∂y = -Fᵧ/F₤，\n其中 Fₓ = ∂F/∂x，Fᵧ = ∂F/∂y，F₤ = ∂F/∂z。',
        plainTranslation: '多元隐函数求导和一元类似，但要分别对每个自变量求偏导。关键是用偏导数公式，直接求解即可。',
        whyNeedIt: '隐函数求导让我们能处理那些"不方便显式表达"的多元函数关系。这是数学分析中的重要工具。',
        formula: '\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}',
        example: 'x² + y² + z² = 1 确定 z = √(1-x²-y²)，则 ∂z/∂x = -x/z，∂z/∂y = -y/z。'
      },
      {
        id: 'directional-derivative',
        name: '方向导数',
        category: '导数概念',
        definition: '设函数 f(x, y) 在点 P₀(x₀, y₀) 的某邻域内有定义，方向单位向量 l = (cos α, cos β)，则 f 在 P₀ 沿方向 l 的方向导数为 ∂f/∂l = lim(t→0⁺) [f(x₀+tcosα, y₀+tcosβ) - f(x₀, y₀)]/t。',
        plainTranslation: '方向导数是"沿某个特定方向"的导数。它告诉我们：从某一点出发，往某个方向走时，函数值的变化率是多少。偏导数只是方向导数的特例（沿坐标轴方向）。',
        whyNeedIt: '方向导数让我们能研究函数在任意方向上的变化。这在梯度研究、优化问题、物理中的场论中都很重要。',
        formula: '\\frac{\\partial f}{\\partial l} = f_x \\cos \\alpha + f_y \\cos \\beta',
        example: 'f(x,y) = x² + y²，在 (1,1) 处沿方向 l = (1/√2, 1/√2) 的方向导数 = 2×1×1/√2 + 2×1×1/√2 = 4/√2 = 2√2。'
      },
      {
        id: 'gradient',
        name: '梯度',
        category: '导数概念',
        definition: '设函数 f(x, y) 在点 (x, y) 处可微，则梯度为 grad f = (fₓ, fᵧ)，它是一个向量。梯度方向是函数值增长最快的方向，梯度模是最大方向导数值。',
        plainTranslation: '梯度就是"最陡上升方向"！就像山顶的每一点，梯度指向山坡最陡的方向。梯度的大小（模）就是沿这个方向爬升的坡度。沿着梯度相反方向，就是最速下降方向——这是优化算法的基础。',
        whyNeedIt: '梯度是多元函数微分学中最重要的概念之一。在优化问题（梯度下降法）、物理（势场）、机器学习（神经网络训练）中，梯度都至关重要。',
        formula: '\\nabla f = (\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y})',
        example: 'f(x,y) = x² + y²，梯度 grad f = (2x, 2y)。在点 (1,1) 处，梯度方向是 (1,1)，即 45° 方向，梯度模为 2√2。'
      },
      {
        id: 'extrema-multivariable',
        name: '多元函数的极值',
        category: '极值问题',
        definition: '设 f(x, y) 在点 (x₀, y₀) 的某邻域内有定义，若对邻域内任意点 (x, y) 都有 f(x, y) ≤ f(x₀, y₀)（或 ≥），则称 (x₀, y₀) 为极大值点（或极小值点）。必要条件：若在极值点偏导数存在，则 fₓ = fᵧ = 0。',
        plainTranslation: '多元函数的极值就是"山峰"和"山谷"。必要条件是偏导数都为 0（和一元函数类似）。但多元函数更复杂——导数都为 0 不一定是极值点，还可能是"鞍点"（一边高一边低）。',
        whyNeedIt: '多元函数极值在优化问题中核心。经济中的最优化、工程中的设计优化、机器学习中的参数优化，都离不开极值理论。',
        formula: 'f_x(x_0, y_0) = 0, \\quad f_y(x_0, y_0) = 0',
        example: 'f(x,y) = x² + y²，在 (0,0) 处有极小值 f(0,0) = 0。f(x,y) = x² - y²，在 (0,0) 处导数为 0，但不是极值（是鞍点）。'
      },
      {
        id: 'hessian-matrix',
        name: '海森矩阵与极值判别',
        category: '极值问题',
        definition: '海森矩阵 H = [[fₓₓ, fₓᵧ], [fᵧₓ, fᵧᵧ]]。设 fₓ = fᵧ = 0：\n(1) 若 det(H) > 0 且 fₓₓ > 0，则极小值\n(2) 若 det(H) > 0 且 fₓₓ < 0，则极大值\n(3) 若 det(H) < 0，则不是极值（鞍点）\n(4) 若 det(H) = 0，需进一步分析',
        plainTranslation: '海森矩阵是"二阶偏导数矩阵"，它告诉我们函数的"弯曲程度"。通过分析海森矩阵，我们可以判断驻点是极大值、极小值还是鞍点。这就像用二阶导数判断一元函数的极值。',
        whyNeedIt: '海森矩阵是判断多元函数极值的核心工具。在优化理论中，海森矩阵决定了目标函数的几何性质，是判断收敛性的关键。',
        formula: 'H = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}',
        example: 'f(x,y) = x² + y²，在 (0,0) 处，H = [[2,0],[0,2]]，det(H) = 4 > 0，fₓₓ = 2 > 0，所以是极小值点。'
      },
      {
        id: 'lagrange-multiplier',
        name: '条件极值与拉格朗日乘数法',
        category: '极值问题',
        definition: '求函数 f(x, y, z) 在约束条件 g(x, y, z) = 0 下的极值，构造拉格朗日函数 L = f + λg，解方程组：∂L/∂x = 0，∂L/∂y = 0，∂L/∂z = 0，∂L/∂λ = 0。',
        plainTranslation: '条件极值就是在"有约束"的情况下求极值。比如：给定预算（约束），如何最大化利润（目标）？拉格朗日乘数法的思想是：把约束"融合"进目标函数，用一个参数 λ 来平衡。',
        whyNeedIt: '条件极值在实际中非常常见。资源分配、工程设计、经济建模等都是约束优化问题。拉格朗日乘数法是解决这类问题的标准方法。',
        formula: 'L(x,y,z,\\lambda) = f(x,y,z) + \\lambda g(x,y,z)',
        example: '求表面积为 a² 而体积最大的长方体。设长宽高为 x,y,z，约束 xyz = V，g = xyz - V = 0。用拉格朗日乘数法可解得 x=y=z = a/√3。'
      },
      {
        id: 'implicit-function-theorem',
        name: '隐函数存在定理',
        category: '隐函数',
        definition: '设 F(x,y) 在 P₀(x₀,y₀) 的某邻域内有连续偏导数，且 F(x₀,y₀)=0，Fᵧ(x₀,y₀)≠0，则方程 F(x,y)=0 在 P₀ 邻域内唯一确定一个隐函数 y=f(x)，满足 y₀=f(x₀)，且 f\'(x) = -Fₓ/Fᵧ。推广到 F(x₁,...,xₙ)=0 的情况。',
        plainTranslation: '隐函数存在定理告诉我们：在什么条件下，一个方程可以"解出"某个变量来。就像你有一个约束方程F(x,y)=0，只要偏导数Fᵧ不为零，就能在局部把y表示成x的函数。条件Fᵧ≠0就像"y方向上有变化"——如果y方向上没变化，自然无法用x决定y。',
        whyNeedIt: '隐函数存在定理是多元微分学的理论基础，它保证了隐函数求导公式的合法性。在实际计算中，直接验证Fᵧ≠0是使用隐函数求导的前提。',
        formula: 'F(x,y)=0, F_y \\neq 0 \\Rightarrow \\frac{dy}{dx} = -\\frac{F_x}{F_y}'
      }
    ] as Concept[]
  },
  {
    id: 'chapter9',
    name: '第九章 多元函数积分学',
    concepts: [
      {
        id: 'double-integral',
        name: '二重积分的概念',
        category: '基本概念',
        definition: '设 f(x, y) 是有界闭区域 D 上的函数，将 D 任意分成 n 个小区域，任取 (ξᵢ, ηᵢ) ∈ Δσᵢ，作和式 Σf(ξᵢ, ηᵢ)Δσᵢ。当最大区域直径 λ→0 时，若和式极限存在，则称此极限为 f(x, y) 在 D 上的二重积分，记作 ∬₊ f(x, y)dσ。',
        plainTranslation: '二重积分就是"在平面上求体积"——把二维区域上的函数值累加。想象一块曲面和它在 xy 平面的投影，二重积分就是这部分"曲顶柱体"的体积。当 f(x,y) = 1 时，二重积分就是区域 D 的面积。',
        whyNeedIt: '二重积分是计算平面区域上"总量"的核心工具。求不规则平面图形的面积、计算平面薄片的质量、研究概率分布等，都离不开二重积分。',
        formula: '\\iint_D f(x,y) d\\sigma = \\lim_{\\lambda \\to 0} \\sum_{i=1}^n f(\\xi_i, \\eta_i) \\Delta \\sigma_i',
        example: '∬₊ xydσ，其中 D 是 [0,1]×[0,1]，结果为 1/4。'
      },
      {
        id: 'double-integral-properties',
        name: '二重积分的性质',
        category: '基本概念',
        definition: '二重积分的性质：\n(1) 线性性：∬(αf + βg)dσ = α∬f dσ + β∬g dσ\n(2) 可加性：区域可拆分\n(3) 比较定理：若 f ≤ g，则 ∬f dσ ≤ ∬g dσ\n(4) 中值定理：若 f 连续，则存在 (ξ, η) ∈ D，使 ∬f dσ = f(ξ, η)·|D|',
        plainTranslation: '二重积分的性质和定积分类似。它是线性的（可以分配）、可加的（可以拆分区域）、保序的（大函数的积分更大）。这些性质让我们能灵活计算二重积分。',
        whyNeedIt: '这些性质是二重积分计算和应用的基础。它们让复杂的积分计算变得简单，也用于证明各种结论。',
        example: '∬₊ (x + 2y) dσ = ∬₊ x dσ + 2∬₊ y dσ。'
      },
      {
        id: 'double-integral-x-y',
        name: '直角坐标系下二重积分的计算',
        category: '计算方法',
        definition: '在直角坐标系下，若 D = {(x, y) | a ≤ x ≤ b, y₁(x) ≤ y ≤ y₂(x)}，则 ∬₊ f(x, y)dσ = ∫ₐᵇ dx ∫ᵧ₁(x)ᵧ₂(x) f(x, y) dy。若 D = {(x, y) | c ≤ y ≤ d, x₁(y) ≤ x ≤ x₂(y)}，则先对 x 积分。',
        plainTranslation: '二重积分的计算核心是"化二重为一重"——把二维的积分区域投影到 x 轴（或 y 轴），变成两次一重积分。关键是画对区域：先确定 x 范围，再确定 y 范围，然后"先 y 后 x"（或反之）计算。',
        whyNeedIt: '这是计算二重积分的基本方法。掌握了它，大多数二重积分都能计算。关键是要能正确画出积分区域并确定上下限。',
        formula: '\\iint_D f(x,y) d\\sigma = \\int_a^b dx \\int_{y_1(x)}^{y_2(x)} f(x,y) dy',
        example: 'D 由 y=x, y=x² 围成，∬₊ x dσ = ∫₀¹ dx ∫ₓ²ˣ x dy = ∫₀¹ x(x - x²) dx = 1/6。'
      },
      {
        id: 'double-integral-polar',
        name: '极坐标系下二重积分的计算',
        category: '计算方法',
        definition: '在极坐标系下，dσ = r dr dθ。若 D = {(r, θ) | α ≤ θ ≤ β, r₁(θ) ≤ r ≤ r₂(θ)}，则 ∬₊ f(r cosθ, r sinθ) r dr dθ = ∫ₐᵇ dθ ∫ᵣ₁(θ)ᵣ₂(θ) f(r cosθ, r sinθ) r dr。',
        plainTranslation: '极坐标积分是处理"圆形"或"扇形"区域的利器。关键变换：x = r cosθ, y = r sinθ, dσ = r dr dθ。多出来的 r 来自极坐标的面积元素。它能让很多在直角坐标下很难算的积分变得简单。',
        whyNeedIt: '圆形、扇形、圆环等区域用极坐标更方便。在物理（天体力学、波动）、工程（旋转体）中的很多问题，用极坐标处理更自然。',
        formula: '\\iint_D f(x,y) d\\sigma = \\int_\\alpha^\\beta d\\theta \\int_{r_1(\\theta)}^{r_2(\\theta)} f(r\\cos\\theta, r\\sin\\theta) r dr',
        example: 'D 是单位圆 x² + y² ≤ 1，∬₊ dσ = ∫₀²π dθ ∫₀¹ r dr = π。'
      },
      {
        id: 'triple-integral',
        name: '三重积分',
        category: '基本概念',
        definition: '三重积分是二重积分的推广。设 f(x, y, z) 在空间有界闭区域 Ω 上有定义，将 Ω 分成 n 份，任取点作和式，当最大直径 λ→0 时，极限存在则为三重积分：∭Ω f(x, y, z) dV。',
        plainTranslation: '三重积分就是"在三维空间求积分"。可以把它理解为求立体的"质量"——如果 f(x,y,z) 是密度，那么三重积分就是整个立体的总质量。当 f=1 时，三重积分就是体积。',
        whyNeedIt: '三重积分在物理（求立体质量、重心、转动惯量）、工程（体积计算）中有广泛应用。它是描述三维空间中"总量"的核心工具。',
        formula: '\\iiint_\\Omega f(x,y,z) dV',
        example: 'Ω 是单位立方体 [0,1]³，∭Ω x dV = 1/2。'
      },
      {
        id: 'cylindrical-coordinates',
        name: '柱面坐标系下三重积分',
        category: '计算方法',
        definition: '柱面坐标 (r, θ, z)：x = r cosθ, y = r sinθ, z = z，体积元素 dV = r dr dθ dz。若 Ω 由曲面 S 围成，则 ∭Ω f dV = ∫∫₊ f(r cosθ, r sinθ, z) r dr dθ dz。',
        plainTranslation: '柱面坐标本质是"极坐标 + z"。当区域在某个方向（通常是 z 轴）具有对称性时，用柱面坐标可以大大简化计算。比如圆柱、圆锥、旋转抛物面等。',
        whyNeedIt: '柱面坐标让很多三维积分计算变得简单。特别是涉及旋转体的问题，用柱面坐标处理非常方便。',
        formula: 'x = r\\cos\\theta, y = r\\sin\\theta, z = z, dV = r dr d\\theta dz',
        example: 'Ω 是圆柱体 x² + y² ≤ R², 0 ≤ z ≤ H，则 ∭Ω z dV = ∫₀²π dθ ∫₀ᴴ r dr ∫₀ᴴ z dz = πR²H²/2。'
      },
      {
        id: 'spherical-coordinates',
        name: '球面坐标系下三重积分',
        category: '计算方法',
        definition: '球面坐标 (ρ, φ, θ)：x = ρ sinφ cosθ, y = ρ sinφ sinθ, z = ρ cosφ，其中 ρ ≥ 0, 0 ≤ φ ≤ π, 0 ≤ θ ≤ 2π。体积元素 dV = ρ² sinφ dρ dφ dθ。',
        plainTranslation: '球面坐标用三个数描述空间一点：ρ 是到原点的距离，φ 是与 z 轴的夹角（从 0 到 π），θ 是 xy 平面上的方位角。适合处理球形、球壳、锥形等区域。',
        whyNeedIt: '球面坐标在处理球对称问题时有独特优势。天体物理（万有引力）、电磁学（球对称场）、概率论（多元正态分布）等都需要球面坐标。',
        formula: 'x = \\rho \\sin\\phi \\cos\\theta, y = \\rho \\sin\\phi \\sin\\theta, z = \\rho \\cos\\phi, dV = \\rho^2 \\sin\\phi d\\rho d\\phi d\\theta',
        example: 'Ω 是半径为 R 的球，∭Ω dV = ∫₀²π dθ ∫₀^π sinφ dφ ∫₀ᴿ ρ² dρ = 4/3 πR³。'
      },
      {
        id: 'line-integral-type1',
        name: '第一类曲线积分（对弧长的曲线积分）',
        category: '曲线积分',
        definition: '设 L 为平面上的光滑曲线弧，f(x, y) 在 L 上有定义，则 ∫ₗ f(x, y) ds = lim(λ→0) Σf(ξᵢ, ηᵢ)Δsᵢ。物理意义：求曲线形物体的质量（线密度为 f）。',
        plainTranslation: '第一类曲线积分是"在曲线上求积分"。想象一根曲线形状的金属丝，f(x,y) 是线上各点的密度，第一类曲线积分就是求金属丝的总质量。ds 是弧长微分，所以叫"对弧长"的积分。',
        whyNeedIt: '第一类曲线积分在物理（求曲线形物体的质量、重心）、几何中广泛应用。它让我们能处理"弯曲物体"上的积分问题。',
        formula: '\\int_L f(x,y) ds',
        example: 'L 是圆 x² + y² = R²，∫ₗ 1 ds = 圆周长 = 2πR。'
      },
      {
        id: 'line-integral-type2',
        name: '第二类曲线积分（对坐标的曲线积分）',
        category: '曲线积分',
        definition: '设 L 为有向光滑曲线弧，P(x, y), Q(x, y) 在 L 上有定义，则 ∫ₗ P dx + Q dy = lim(λ→0) Σ[P(ξᵢ, ηᵢ)Δxᵢ + Q(ξᵢ, ηᵢ)Δyᵢ]。物理意义：变力沿曲线做功。',
        plainTranslation: '第二类曲线积分是"在有向曲线上求积分"。想象一个变力沿曲线推动物体，力随位置变化，第二类曲线积分就是求这个变力做的功。因为方向重要，所以叫"对坐标"的积分。',
        whyNeedIt: '第二类曲线积分在物理（变力做功、电磁通量）中极其重要。它是研究向量场的重要工具。',
        formula: '\\int_L P(x,y) dx + Q(x,y) dy',
        example: 'L 从 (0,0) 到 (1,1) 沿 y=x，F = (x, y)，则 W = ∫ x dx + y dy = ∫₀¹ 2x dx = 1。'
      },
      {
        id: 'green-theorem',
        name: '格林公式',
        category: '基本定理',
        definition: '设闭区域 D 由分段光滑曲线 L 围成，L 取正向，P(x, y), Q(x, y) 在 D 上有连续偏导数，则 ∮ₗ P dx + Q dy = ∬₊ (∂Q/∂x - ∂P/∂y) dσ。',
        plainTranslation: '格林公式是微积分中最重要的定理之一！它把"曲线积分"和"二重积分"联系起来——沿闭合曲线的积分，等于曲线内部区域的二重积分。它的本质是"积分与路径无关"的定理。',
        whyNeedIt: '格林公式是二维"微积分基本定理"。它让曲线积分的计算变得更简单，也用于证明很多重要结论（如复变函数中的柯西积分定理）。',
        formula: '\\oint_L P dx + Q dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) d\\sigma',
        example: 'L 是圆 x² + y² = R²（正向），取 P = -y, Q = x，则 ∂Q/∂x - ∂P/∂y = 1 - (-1) = 2，所以 ∮ₗ -y dx + x dy = 2∬₊ dσ = 2πR²。'
      },
      {
        id: 'surface-integral-type1',
        name: '第一类曲面积分',
        category: '曲面积分',
        definition: '设 Σ 为光滑曲面，f(x, y, z) 在 Σ 上有定义，则 ∬Σ f(x, y, z) dS = lim(λ→0) Σf(ξᵢ, ηᵢ, ζᵢ)ΔSᵢ。物理意义：求曲面形物体的质量（当面密度为 f）。',
        plainTranslation: '第一类曲面积分是"在曲面上求积分"。就像第一类曲线积分的二维推广：求曲面形状薄壳的总质量。这里 dS 是曲面面积元素。',
        whyNeedIt: '第一类曲面积分在物理（求曲面壳质量、重心）、工程中有应用。它让我们能处理曲面分布的物理量。',
        formula: '\\iint_\\Sigma f(x,y,z) dS',
        example: 'Σ 是平面 z = 1，x² + y² ≤ 1，∬Σ 1 dS = 圆面积 = π。'
      },
      {
        id: 'surface-integral-type2',
        name: '第二类曲面积分',
        category: '曲面积分',
        definition: '设 Σ 为有向光滑曲面，f(x, y, z) 在 Σ 上有定义，则通过指定侧的第二类曲面积分为 ∬Σ f dxy（或其他坐标对）。物理意义：求流体通过曲面的流量。',
        plainTranslation: '第二类曲面积分是"有向曲面积分"，考虑曲面的方向。就像第二类曲线积分的推广：求流体通过曲面的流量、电通量等。',
        whyNeedIt: '第二类曲面积分在物理（高斯定理、电磁学）中极其重要。它是研究向量场通过曲面的通量的核心工具。',
        formula: '\\iint_\\Sigma P dydz + Q dzdx + R dxdy',
        example: 'Σ 是球面 x² + y² + z² = R²（外侧），∬Σ z dxy = 4/3 πR³（因为体积积分为 4/3 πR³）。'
      },
      {
        id: 'stokes-theorem',
        name: '斯托克斯公式',
        category: '基本定理',
        definition: '设 Σ 为分段光滑的有向曲面，L 为 Σ 的边界曲线（取向与 Σ 侧符合右手定则），P, Q, R 在 Σ 上有连续偏导数，则 ∮ₗ P dx + Q dy + R dz = ∬Σ (∂R/∂y - ∂Q/∂z) dydz + (∂P/∂z - ∂R/∂x) dzdx + (∂Q/∂x - ∂P/∂y) dxdy。',
        plainTranslation: '斯托克斯公式是格林公式的三维推广！它把"曲面积分"和"曲线积分"联系起来：沿闭合曲线的积分，等于曲面上的旋度积分。这个定理是向量分析中的核心定理。',
        whyNeedIt: '斯托克斯公式是三维向量分析的基本定理。它在电磁学、流体力学中都有重要应用，是理解旋度定理的钥匙。',
        formula: '\\oint_L \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_\\Sigma (\\nabla \\times \\mathbf{F}) \\cdot \\mathbf{n} dS',
        example: '简化形式：当 z 轴的平面区域，L 是其边界，Σ 是该平面区域，则 ∮ₗ P dx + Q dy = ∬Σ (∂Q/∂x - ∂P/∂y) dσ，即格林公式。'
      },
      {
        id: 'gauss-theorem',
        name: '高斯公式（散度定理）',
        category: '基本定理',
        definition: '设空间闭区域 Ω 由分片光滑的闭合曲面 Σ 围成，P, Q, R 在 Ω 上有连续偏导数，则 ∮Σ P dydz + Q dzdx + R dxdy = ∭Ω (∂P/∂x + ∂Q/∂y + ∂R/∂z) dV。',
        plainTranslation: '高斯公式是斯托克斯公式的进一步推广！它把"通过闭合曲面的通量"和"体内的源强度（散度）"联系起来。简单说：流出曲面的总量，等于体内所有"源"产生的总量。',
        whyNeedIt: '高斯公式是三维积分学的"巅峰定理"。在电磁学（高斯定理）、流体力学（连续方程）中极其重要。它让复杂的三维积分计算变得简单。',
        formula: '\\oint_\\Sigma \\mathbf{F} \\cdot \\mathbf{n} dS = \\iiint_\\Omega (\\nabla \\cdot \\mathbf{F}) dV',
        example: 'Σ 是球面 x² + y² + z² = R² 外侧，F = (x, y, z)，div F = 3，∮Σ F·n dS = 3·(4/3 πR³) = 4πR³。'
      },
      {
        id: 'divergence',
        name: '散度',
        category: '向量场',
        definition: '向量场 F = (P, Q, R) 的散度为 div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z。散度是向量场"源头强度"的度量：散度 > 0 表示该点有"源"，散度 < 0 表示该点有"汇"，散度 = 0 表示无源场。',
        plainTranslation: '散度描述的是空间中某一点是"Source"还是"Sink"——就像水流：有的地方水从地下冒出来（源，div > 0），有的地方水渗入地下（汇，div < 0），有的地方水只是流过（无源，div = 0）。散度就是量化这个"冒出"或"渗入"的强度。',
        whyNeedIt: '散度是描述向量场性质的基本工具。在电磁学中，电场的散度与电荷密度有关；在流体力学中，流场的散度与流体的可压缩性有关。高斯公式本质上就是散度定理。',
        formula: '\\nabla \\cdot \\mathbf{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}',
        example: 'F = (x, y, z)，div F = 1 + 1 + 1 = 3 > 0，说明该向量场处处有源。'
      },
      {
        id: 'curl',
        name: '旋度',
        category: '向量场',
        definition: '向量场 F = (P, Q, R) 的旋度为 curl F = (∂R/∂y - ∂Q/∂z, ∂P/∂z - ∂R/∂x, ∂Q/∂x - ∂P/∂y)。旋度是向量场"旋转强度"的度量：旋度不为零表示该点存在"旋涡"，旋度为零表示无旋场（保守场）。',
        plainTranslation: '旋度描述的是空间中某一点"旋转"的强度。想象一条河流：有的地方水流会形成漩涡（旋度 ≠ 0），有的地方水流平直没有漩涡（旋度 = 0）。旋度向量垂直于旋转平面，方向由右手定则确定——手指沿旋转方向，拇指指向旋度方向。',
        whyNeedIt: '旋度是描述向量场"旋转性质"的核心工具。在电磁学中，磁场的旋度与电流密度有关（安培环路定理）；在流体力学中，旋度决定了涡旋的形成和发展。斯托克斯公式本质上是旋度定理。',
        formula: '\\nabla \\times \\mathbf{F} = \\left|\\begin{matrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{matrix}\\right|',
        example: 'F = (-y, x, 0)（平面旋涡），curl F = (0, 0, 2)，旋度指向 z 轴方向，表示逆时针旋转。'
      },
      {
        id: 'flux',
        name: '通量',
        category: '向量场',
        definition: '向量场 F 通过有向曲面 Σ 的通量为 Φ = ∬Σ F·n dS，其中 n 是 Σ 的单位法向量。通量表示单位时间内通过曲面的"流量"。',
        plainTranslation: '通量就是"穿过"多少。就像你站在门口，单位时间内有多少风通过你的身体——这就是风对你的"通量"。在电场中，通过某面积的电场线条数就是电通量；在流体力学中，单位时间流过截面的流体体积就是流量。',
        whyNeedIt: '通量是描述向量场通过曲面多少的基本概念。在电磁学中，高斯定理用通量表述；在流体力学中，通过截面的流量是核心概念。它是理解很多物理定律的基础。',
        formula: '\\Phi = \\iint_\\Sigma \\mathbf{F} \\cdot \\mathbf{n} dS',
        example: 'F = (0, 0, 1)（向上匀强电场），Σ 是 z = 1 平面，法向量 n = (0, 0, 1)，通量 Φ = ∬Σ 1·dS = Σ 的面积。'
      },
      {
        id: 'circulation',
        name: '环流量',
        category: '向量场',
        definition: '向量场 F 沿闭合曲线 L 的环流量为 Γ = ∮L F·dr，其中 dr 是曲线切向量的微分。环流量表示单位时间内沿曲线"环流"的量。',
        plainTranslation: '环流量就是"绕圈"流动的量。想象一条河流：你站在河中画一个圆圈，单位时间内有多少水"绕"着你流过去——这就是环流量。旋涡的环流量越大，旋转越强烈。',
        whyNeedIt: '环流量是描述向量场"环流程度"的基本概念。在磁场中，沿闭合回路的环流量与通过回路的电流有关（安培定理）。它是理解旋度物理意义的重要工具。',
        formula: '\\Gamma = \\oint_L \\mathbf{F} \\cdot d\\mathbf{r}',
        example: 'F = (-y, x, 0)（旋涡场），L 是圆 x² + y² = R²，逆时针方向，环流量 Γ = ∮L -y dx + x dy = 2πR²。'
      },
      {
        id: 'conservative-field',
        name: '保守场与势函数',
        category: '向量场',
        definition: '若向量场 F 满足 curl F = 0，则称 F 为保守场（或无旋场）。保守场一定有势函数 u，使得 F = ∇u。保守场的重要性质：沿任意闭合曲线的环量为零（∮L F·dr = 0），积分与路径无关。',
        plainTranslation: '保守场就是"没有漩涡"的场——就像重力场：你从A走到B，重力做的功只跟起点和终点有关，跟走哪条路无关（因为没有旋涡干扰）。有势函数 u：F 正好是 u 的梯度——就像从山坡上下来，u 是高度，F 是坡度（梯度的反方向）。',
        whyNeedIt: '保守场在物理中极其重要。重力场、电场都是保守场。在保守场中，能量守恒——你绕一圈回来，做的功是零。这在分析力学、电磁学中都核心。知道是保守场后，计算可以大大简化。',
        formula: '\\mathbf{F} = \\nabla u, \\quad \\oint_L \\mathbf{F} \\cdot d\\mathbf{r} = 0',
        example: 'F = (2x, 2y, 2z) = ∇(x² + y² + z²)，是保守场，势函数 u = x² + y² + z²。'
      },
      {
        id: 'potential-function',
        name: '势函数的求法',
        category: '向量场',
        definition: '求保守场 F = (P, Q, R) 的势函数：(1) 验证 curl F = 0；(2) 从 P 对 x 积分：u = ∫P dx + φ(y, z)；(3) 用 ∂u/∂y = Q、∂u/∂z = R 确定 φ 函数。',
        plainTranslation: '求势函数就像"反向爬坡"：已知坡度（梯度），求高度。方法是：从某个分量积分（比如 u = ∫P dx），然后用其他分量来确定"常数"（实际上是 y, z 的函数）。最后得到的 u 就是势函数。',
        whyNeedIt: '势函数在物理中很重要。知道势函数后，向量场的积分计算可以简化——直接从势函数算起点终点的差值。在电场中，势函数就是电势。',
        example: 'F = (2xy, x² + 2z, 2y)，验证 curl F = 0，是保守场。从 u = ∫2xy dx = x²y + φ(y,z)，∂u/∂y = x² + φ_y = x² + 2z，所以 φ_y = 2z，φ = 2yz + C(z)，∂u/∂z = 2y + C\'(z) = 2y，所以 C\'(z) = 0，势函数 u = x²y + 2yz + C。'
      },
      {
        id: 'integral-independent-path',
        name: '曲线积分与路径无关的条件',
        category: '向量场',
        definition: '设向量场 F = (P, Q, R) 在单连通区域 G 内有定义，则以下等价：(1) F 是保守场（curl F = 0）；(2) 沿 G 内任意闭合曲线的环量为零；(3) 在 G 内积分与路径无关，只与起点终点有关。',
        plainTranslation: '这个定理告诉我们：在没有"洞"的区域里，积分与路径无关 ↔ 没有旋度 ↔ 闭合曲线的环量为零。简单说：只要区域里没有旋涡，你走哪条路到达终点都是一样的——就像在平坦的地面上走。',
        whyNeedIt: '这个定理大大简化了曲线积分的计算。当知道积分与路径无关时，我们可以选择最简单的路径计算。在物理中，这意味着能量只与位置有关，与过程无关（保守力）。',
        example: 'F = (2x, 2y) 在 R² 上，curl F = 0，与路径无关。∫(0,0)→(1,1) F·dr = ∫(0,0)→(1,0) + ∫(1,0)→(1,1) = 0 + 2 = 2，也可直接用势函数：u = x² + y²，得 1² + 1² - 0 = 2。'
      },
      {
        id: 'two-curve-integral-relation',
        name: '两类曲线积分的关系',
        category: '曲线积分',
        definition: '设曲线 L 的参数方程为 x = x(t), y = y(t), t ∈ [α, β]，则第一类曲线积分 ∫ₗ f(x,y)ds 与第二类曲线积分 ∫ₗ Pdx + Qdy 的关系为：∫ₗ f(x,y)ds = ∫ₐᵇ f(x(t),y(t))√(x\'² + y\'²) dt。',
        plainTranslation: '两类曲线积分可以通过参数化相互转化！第一类（对弧长）更基础，它不依赖方向；第二类（对坐标）依赖方向，但可以直接计算功等物理量。两者通过曲线的参数化联系起来。',
        whyNeedIt: '这个关系让我们能在两种积分形式中灵活选择。有时候用第一类更简单，有时候用第二类更方便。理解它们的关系对于解决实际问题很重要。',
        formula: '\\int_L f ds = \\int_\\alpha^\\beta f(x(t),y(t)) \\sqrt{x\'^2 + y\'^2} dt',
        example: 'L: x = cos t, y = sin t, t ∈ [0, π]。计算 ∫ₗ y ds = ∫₀^π sin t·√((-sin t)² + (cos t)²) dt = ∫₀^π sin t dt = 2。'
      },
      {
        id: 'space-curve-integral',
        name: '空间曲线积分',
        category: '曲线积分',
        definition: '设空间曲线 L 由参数方程 x = x(t), y = y(t), z = z(t), t ∈ [α, β] 给出。第一类空间曲线积分 ∫ₗ f(x,y,z)ds = ∫ₐᵇ f(x(t),y(t),z(t))√(x\'² + y\'² + z\'²) dt。第二类空间曲线积分 ∫ₗ Pdx + Qdy + Rdz = ∫ₐᵇ (Px\' + Qy\' + Rz\') dt。',
        plainTranslation: '空间曲线积分就是二维曲线积分在三维的推广！第一类求曲面形物体的质量，第二类求变力在空间中做的功。计算方法也是把曲线参数化，然后转化为定积分。',
        whyNeedIt: '空间曲线积分在物理（立体空间的力做功、磁场线积分）、工程（空间管道流量）中都有应用。它是向量分析在三维空间中的重要工具。',
        formula: '\\int_L f ds = \\int_\\alpha^\\beta f(x(t),y(t),z(t)) \\sqrt{x\'^2 + y\'^2 + z\'^2} dt',
        example: 'L: x = t, y = t², z = t³, t ∈ [0, 1]。计算 ∫ₗ (x + y + z) ds = ∫₀¹ (t + t² + t³)√(1 + 4t² + 9t⁴) dt。'
      },
      {
        id: 'multiple-integral-symmetry',
        name: '对称性在重积分中的应用',
        category: '积分技巧',
        definition: '若积分区域关于 x 轴对称且 f(x,-y)=-f(x,y)（关于y奇函数），则 ∬ f(x,y)dσ = 0；若 f(x,-y)=f(x,y)（关于y偶函数），则 ∬ f(x,y)dσ = 2∬_{D₁} f(x,y)dσ，其中D₁为D的上半部分。同理可推广到关于y轴对称和三维情况。',
        plainTranslation: '和定积分类似，重积分也可以用对称性简化。积分区域关于某轴对称时，如果被积函数关于该轴是"奇"的，积分直接为0；如果是"偶"的，积分等于一半区域积分的两倍。这是考研计算重积分的"速杀"技巧。',
        whyNeedIt: '对称性简化是考研重积分题最常见的速算技巧，可以大幅减少计算量。很多题目通过观察对称性就能直接得出部分结果。',
        formula: 'D\\text{关于}x\\text{轴对称}: f(x,-y)=-f(x,y) \\Rightarrow \\iint_D f\\,d\\sigma = 0'
      },
      {
        id: 'cyclic-symmetry',
        name: '轮换对称性',
        category: '积分技巧',
        definition: '若积分区域 D 关于 y=x 对称，则 ∬_D f(x,y)dσ = ∬_D f(y,x)dσ。特别地，∬_D f(x)dσ = ∬_D f(y)dσ。',
        plainTranslation: '轮换对称性就是"交换x和y的位置，积分值不变"。当积分区域关于直线y=x对称时（比如三角形 {(0,0),(1,0),(0,1)}），交换x和y不会改变区域。这个性质常用于简化含 x²+y² 或 x+y 的积分。',
        whyNeedIt: '轮换对称性是考研中的高频考点，经常用于将∬(x²)dσ化为1/2∬(x²+y²)dσ，从而简化计算。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter10',
    name: '第十章 概率论的基本概念',
    concepts: [
      {
        id: 'random-experiment',
        name: '随机试验',
        category: '基本概念',
        definition: '随机试验是指满足以下三个条件的试验：(1) 可以在相同条件下重复进行；(2) 所有可能结果事先已知，且不止一个；(3) 每次试验前不能确定会出现哪个结果。记作 E。',
        plainTranslation: '想象你在赌场掷骰子——这就是典型的随机试验。你可以一直掷（可重复），知道结果一定是1到6点之一（结果已知），但每次掷出去之前你永远不知道会是几点（结果不确定）。天气预报、彩票开奖、产品质量检测，本质上都是随机试验。',
        whyNeedIt: '如果没有随机试验这个概念，概率论就无从谈起。它划定了概率论的研究边界——那些"不确定但可重复"的现象。就像物理学需要先定义"实验"一样，概率论需要先定义"随机试验"。',
        example: '掷一枚均匀硬币（E₁）、掷一枚骰子（E₂）、从一批产品中随机抽取一件（E₃）都是随机试验。'
      },
      {
        id: 'sample-space',
        name: '样本空间',
        category: '基本概念',
        definition: '随机试验 E 的所有可能结果组成的集合称为样本空间，记作 Ω 或 S。样本空间中的每个元素称为样本点，记作 ω。',
        plainTranslation: '样本空间就是一张"所有可能结果的清单"。掷一枚骰子，清单上写着{1点, 2点, 3点, 4点, 5点, 6点}；掷两枚骰子，清单变成{(1,1), (1,2), ..., (6,6)}共36种组合。样本空间是概率世界的"地图"——一切讨论都在这张地图上进行。',
        whyNeedIt: '没有样本空间，概率计算就失去了"舞台"。所有事件都是样本空间的子集，所有概率都在样本空间上定义。确定样本空间是解决任何概率问题的第一步，就像画地图是导航的第一步。',
        example: '掷两枚骰子的样本空间 Ω = {(i,j) | i,j = 1,2,3,4,5,6}，共有36个样本点。'
      },
      {
        id: 'random-event',
        name: '随机事件',
        category: '基本概念',
        definition: '随机试验 E 的样本空间 Ω 的子集称为随机事件，简称事件。事件发生当且仅当子集中的某个样本点出现。必然事件 Ω（样本空间本身）和不可能事件 ∅（空集）是两种特殊事件。',
        plainTranslation: '随机事件就是"我们关心的某种结果"。掷骰子时，"掷出偶数点"是我们关心的事件，它包含{2, 4, 6}三种结果。只要掷出2、4或6，这个事件就"发生"了。事件就像一个"篮子"，里面装着我们认可的所有结果。',
        whyNeedIt: '概率论研究的不是单个结果，而是"事件"。我们问的不是"掷出6点的概率是多少"，而是"掷出偶数点的概率是多少"。事件让我们能把多个结果打包在一起研究，这是概率计算的核心。',
        example: '掷骰子：A = "掷出偶数点" = {2, 4, 6}，B = "掷出大于4的点" = {5, 6}。'
      },
      {
        id: 'event-relations',
        name: '事件的关系',
        category: '事件运算',
        definition: '设 A, B 为两个事件：\n(1) 包含：A ⊂ B 表示 A 发生必导致 B 发生\n(2) 相等：A = B 表示 A ⊂ B 且 B ⊂ A\n(3) 和事件：A ∪ B 表示 A 或 B 至少一个发生\n(4) 积事件：A ∩ B 表示 A 和 B 同时发生\n(5) 差事件：A - B 表示 A 发生而 B 不发生\n(6) 互不相容：A ∩ B = ∅，A 和 B 不能同时发生\n(7) 对立事件：Ā = Ω - A，A 不发生的事件',
        plainTranslation: '事件的关系其实就是集合的关系！想象两个圆圈：A∪B是两个圆覆盖的总面积（至少一个发生），A∩B是两圆重叠部分（同时发生），A-B是A独有的月牙形（A发生但B不发生）。互不相容就是两圆不重叠，对立就是A和它的补集把整个样本空间切成两半。',
        whyNeedIt: '没有这些关系，我们无法描述复杂事件。比如"掷出偶数点或大于4的点"怎么表达？就是A∪B。"掷出偶数点且大于4的点"呢？就是A∩B={6}。这些关系让我们能把复杂问题拆解成简单问题。',
        formula: 'A \\cup B, \\quad A \\cap B, \\quad A - B, \\quad \\bar{A}',
        example: '掷骰子：A = {2,4,6}，B = {5,6}。A∪B = {2,4,5,6}，A∩B = {6}，A-B = {2,4}，Ā = {1,3,5}。'
      },
      {
        id: 'event-operations',
        name: '事件的运算律',
        category: '事件运算',
        definition: '事件的运算满足以下规律：\n(1) 交换律：A∪B = B∪A，A∩B = B∩A\n(2) 结合律：(A∪B)∪C = A∪(B∪C)\n(3) 分配律：A∩(B∪C) = (A∩B)∪(A∩C)\n(4) 对偶律（德摩根律）：A∪B = Ā∩B̄，A∩B = Ā∪B̄',
        plainTranslation: '德摩根律是最重要的运算律，记住口诀："和的对立等于对立的积，积的对立等于对立的和"。比如"不(及格或优秀)"等于"不及格且不优秀"。这就像把"或"变成"且"，同时把每个事件都取反。',
        whyNeedIt: '运算律是简化复杂事件的利器。有时候直接算P(A∪B)很麻烦，但算P(Ā∩B̄)可能很简单。德摩根律让我们能在"求和"和"求积"之间灵活切换，选择更简单的计算路径。',
        formula: '\\overline{A \\cup B} = \\bar{A} \\cap \\bar{B}, \\quad \\overline{A \\cap B} = \\bar{A} \\cup \\bar{B}',
        example: '掷骰子：A = {1,2,3}，B = {2,4,6}。验证德摩根律：A∪B = {1,2,3,4,6}，其对立 = {5}；Ā∩B̄ = {4,5,6}∩{1,3,5} = {5}。'
      },
      {
        id: 'frequency',
        name: '频率',
        category: '概率定义',
        definition: '在相同条件下进行 n 次试验，事件 A 发生的次数 nₐ 称为 A 发生的频数。比值 fₙ(A) = nₐ/n 称为 A 发生的频率。当 n 很大时，频率会在某个常数附近摆动，呈现稳定性。',
        plainTranslation: '频率就是"实际发生的比例"。你掷100次硬币，正面朝上53次，那正面朝上的频率就是53%。掷1000次可能变成498次，频率变成49.8%。你会发现，掷的次数越多，频率越稳定，最终会围绕0.5这个数字小幅波动。',
        whyNeedIt: '频率是概率的"实验版"。它告诉我们概率不是数学家凭空想出来的，而是可以通过大量实验观测到的客观规律。没有频率稳定性，概率就失去了现实基础。',
        formula: 'f_n(A) = \\frac{n_A}{n}',
        example: '掷硬币1000次，正面朝上498次，频率 f₁₀₀₀(正面) = 0.498，接近理论概率0.5。'
      },
      {
        id: 'probability-definition',
        name: '概率的公理化定义',
        category: '概率定义',
        definition: '设 Ω 为样本空间，F 为事件域，P 为定义在 F 上的实值函数，若满足：\n(1) 非负性：对任意 A ∈ F，P(A) ≥ 0\n(2) 规范性：P(Ω) = 1\n(3) 可列可加性：若 A₁, A₂, ... 互不相容，则 P(∪Aᵢ) = ΣP(Aᵢ)\n则称 P 为概率测度，P(A) 为事件 A 的概率。',
        plainTranslation: '概率必须遵守三条"宪法"：第一，概率不能是负数；第二，整个样本空间的概率必须是1（总有一件事会发生）；第三，如果几个事件互不重叠，它们"或"的概率等于各自概率相加。这三条看似简单，却能推导出概率论的所有定理。',
        whyNeedIt: '在柯尔莫哥洛夫提出公理化定义之前，概率的定义一直有争议。公理化定义让概率论从"经验总结"变成"严密数学"，是概率论发展史上的里程碑。',
        example: '掷骰子：P({1}) = P({2}) = ... = P({6}) = 1/6，满足 P(Ω) = ΣP({i}) = 1。'
      },
      {
        id: 'probability-properties',
        name: '概率的性质',
        category: '概率性质',
        definition: '由概率公理可推导：(1) P(∅) = 0；(2) P(Ā) = 1 - P(A)；(3) 若 A ⊂ B，则 P(A) ≤ P(B)；(4) P(A∪B) = P(A) + P(B) - P(A∩B)；(5) P(A₁∪A₂∪...∪Aₙ) ≤ ΣP(Aᵢ)（次可加性）',
        plainTranslation: '最常用的是加法公式：P(A∪B) = P(A) + P(B) - P(A∩B)。为什么要减去P(A∩B)？因为A和B重叠的部分被加了两次，需要减掉一次。就像两个圆的面积，不能简单相加，要减去重叠部分。',
        whyNeedIt: '这些性质是概率计算的"基本功"。加法公式几乎每道题都会用到。对立事件公式P(Ā) = 1 - P(A)也很常用——有时候直接算A很难，算"非A"却很简单。',
        formula: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
        example: 'A = "及格"概率0.6，B = "优秀"概率0.2。因为B⊂A，所以P(及格∪优秀) = P(及格) = 0.6。'
      },
      {
        id: 'classical-probability',
        name: '古典概型',
        category: '概率模型',
        definition: '若试验满足：(1) 样本空间只有有限个样本点；(2) 每个样本点出现的可能性相等，则称为古典概型。事件 A 的概率 P(A) = A 包含的样本点数 / Ω 的样本点总数 = |A| / |Ω|。',
        plainTranslation: '古典概型就是"抓阄"问题：袋子里有若干个阄，每个阄被抽中的机会相等。计算概率就是"数数"——有利情况数除以总情况数。比如从52张牌中抽一张，抽到红桃的概率 = 13张红桃 ÷ 52张牌 = 1/4。',
        whyNeedIt: '古典概型是最古老也最直观的概率模型，起源于赌博问题。它让我们能用简单的"数数"方法计算概率，是学习概率论的入门。',
        formula: 'P(A) = \\frac{|A|}{|\\Omega|}',
        example: '从52张牌中抽一张，抽到红桃的概率 = 13/52 = 1/4。'
      },
      {
        id: 'geometric-probability',
        name: '几何概型',
        category: '概率模型',
        definition: '若样本空间 Ω 是一个可度量的几何区域（长度、面积、体积），且每个点被取到的可能性相等，则事件 A 的概率 P(A) = A 的度量 / Ω 的度量。',
        plainTranslation: '几何概型是古典概型的"无限版"。想象你往一个正方形里随机撒一粒沙子，沙子落在某个区域的概率等于该区域面积除以总面积。比如往[0,10]的线段上随机投点，落在[3,7]内的概率 = 4/10 = 0.4。',
        whyNeedIt: '当样本空间有无限多个点时，"数数"的方法失效了。几何概型用"度量比"替代"个数比"，解决了连续型概率的计算问题。',
        formula: 'P(A) = \\frac{\\mu(A)}{\\mu(\\Omega)}',
        example: '在[0,10]区间内随机取一点，取到[3,7]内的概率 = (7-3)/(10-0) = 0.4。'
      },
      {
        id: 'conditional-probability',
        name: '条件概率',
        category: '条件概率',
        definition: '设 A, B 为两个事件，且 P(A) > 0，则在 A 发生的条件下 B 发生的条件概率定义为 P(B|A) = P(A∩B) / P(A)。',
        plainTranslation: '条件概率就是"已知新信息后，更新后的概率"。比如某天早上天气预报说降水概率30%，但中午你看到乌云密布，这时降水概率可能更新到80%。条件概率让概率有了"动态更新"的能力。',
        whyNeedIt: '现实生活中，我们总是在不断获得新信息。条件概率让我们能利用新信息更新判断，是贝叶斯统计、机器学习、医疗诊断的核心工具。',
        formula: 'P(B|A) = \\frac{P(A \\cap B)}{P(A)}',
        example: '班级60人，男生30人，戴眼镜的15人，男生中戴眼镜的10人。P(戴眼镜|男生) = 10/30 = 1/3。'
      },
      {
        id: 'multiplication-rule',
        name: '乘法公式',
        category: '条件概率',
        definition: '由条件概率定义可得乘法公式：P(A∩B) = P(A)·P(B|A) = P(B)·P(A|B)。推广到 n 个事件：P(A₁∩A₂∩...∩Aₙ) = P(A₁)·P(A₂|A₁)·P(A₃|A₁∩A₂)·...·P(Aₙ|A₁∩...∩Aₙ₋₁)。',
        plainTranslation: '乘法公式就是"分步计算同时发生的概率"。比如袋里有3红2白球，无放回取2球都是红球的概率 = 第一个红球的概率(3/5) × 第二个红球的概率(已知第一个是红球后，2/4) = 3/10。就像接力赛，每一棒都要在前一棒完成的基础上进行。',
        whyNeedIt: '很多问题涉及"连续发生"的事件，比如无放回抽样、多阶段决策。乘法公式让我们能把复杂问题分解成一步步来，每一步的条件概率往往更容易计算。',
        formula: 'P(A_1 \\cap A_2 \\cap \\cdots \\cap A_n) = P(A_1) \\cdot P(A_2|A_1) \\cdot P(A_3|A_1 \\cap A_2) \\cdots',
        example: '袋中有3红2白球，无放回取2球都是红球的概率 = P(第一个红)×P(第二个红|第一个红) = 3/5 × 2/4 = 3/10。'
      },
      {
        id: 'total-probability',
        name: '全概率公式',
        category: '条件概率',
        definition: '设 B₁, B₂, ..., Bₙ 是样本空间 Ω 的一个划分（两两互不相容且并集为 Ω），且 P(Bᵢ) > 0，则对任意事件 A 有 P(A) = Σᵢ P(Bᵢ)·P(A|Bᵢ)。',
        plainTranslation: '全概率公式就是"分情况讨论"的数学版。假设你要计算产品次品率，产品来自甲乙两厂：甲厂占60%、次品率2%，乙厂占40%、次品率3%。总次品率 = 0.6×0.02 + 0.4×0.03 = 2.4%。把各种情况的贡献加起来就是总概率。',
        whyNeedIt: '很多复杂问题可以按"原因"或"来源"分解成几种情况。全概率公式让我们能分而治之，把复杂问题拆成简单问题的加权平均。',
        formula: 'P(A) = \\sum_{i=1}^n P(B_i) \\cdot P(A|B_i)',
        example: '甲乙两厂生产零件，甲厂占60%，次品率2%；乙厂占40%，次品率3%。任取一件是次品的概率 = 0.6×0.02 + 0.4×0.03 = 0.024。'
      },
      {
        id: 'bayes-formula',
        name: '贝叶斯公式',
        category: '条件概率',
        definition: '设 B₁, B₂, ..., Bₙ 是 Ω 的一个划分，P(Bᵢ) > 0，且 P(A) > 0，则 P(Bᵢ|A) = P(Bᵢ)·P(A|Bᵢ) / Σⱼ P(Bⱼ)·P(A|Bⱼ)。即 P(Bᵢ|A) = P(Bᵢ)·P(A|Bᵢ) / P(A)。',
        plainTranslation: '贝叶斯公式是"逆概率"公式：已知结果发生了，反推各种原因的可能性。比如某人检验结果阳性，他真正患病的概率是多少？假设发病率1%，检验准确率99%，那么阳性者真正患病的概率只有约16.7%——因为健康人基数大，假阳性的数量远超真阳性。',
        whyNeedIt: '贝叶斯公式是统计推断的基石。医疗诊断、垃圾邮件过滤、机器学习中的分类算法，本质上都在用贝叶斯公式。它让我们能根据观测结果反推原因的概率。',
        formula: 'P(B_i|A) = \\frac{P(B_i) \\cdot P(A|B_i)}{\\sum_{j=1}^n P(B_j) \\cdot P(A|B_j)}',
        example: '某病发病率1%，检验阳性概率：有病99%，无病5%。已知检验阳性，真正患病的概率 = 0.01×0.99 / (0.01×0.99 + 0.99×0.05) ≈ 16.7%。'
      },
      {
        id: 'independence',
        name: '事件的独立性',
        category: '独立性',
        definition: '若事件 A 和 B 满足 P(A∩B) = P(A)·P(B)，则称 A 与 B 相互独立。独立性等价于 P(B|A) = P(B) 或 P(A|B) = P(A)，即一个事件的发生不影响另一个事件的概率。',
        plainTranslation: '独立性就是"互不影响"。掷两枚骰子，第一枚的结果不会影响第二枚的结果，这两个事件独立。数学上，独立事件的"积概率"等于各自概率的乘积。注意：独立和互不相容是两回事！互不相容是"不能同时发生"，独立是"互不影响"。',
        whyNeedIt: '独立性是概率论中最重要的简化假设。当事件独立时，概率计算大大简化——积概率变成乘积，和概率变成求和。很多模型（如独立重复试验）都依赖独立性假设。',
        formula: 'P(A \\cap B) = P(A) \\cdot P(B)',
        example: '掷两枚骰子，A = "第一枚是6"，B = "第二枚是偶数"。P(A∩B) = 1/6 × 1/2 = 1/12 = P(A)·P(B)，所以 A 和 B 独立。'
      },
      {
        id: 'independence-properties',
        name: '独立性的性质',
        category: '独立性',
        definition: '(1) 若 A 与 B 独立，则 A 与 B̄、Ā 与 B、Ā 与 B̄ 也独立；(2) 若 P(A) = 0 或 P(A) = 1，则 A 与任意事件独立；(3) 独立性不具有传递性；(4) 三事件两两独立不一定相互独立。',
        plainTranslation: '独立性有些反直觉的性质：A和B独立，那么A和"非B"也独立——这符合直觉，因为"互不影响"是双向的。但更反直觉的是：A和B独立、B和C独立，不能推出A和C独立！独立性没有传递性。',
        whyNeedIt: '理解这些性质可以避免在独立性判断上犯错。特别是"两两独立≠相互独立"，这是考试常考点，也是实际应用中容易混淆的地方。',
        example: '三事件两两独立但不相互独立的例子：Ω = {1,2,3,4}，P({i}) = 1/4，A = {1,2}，B = {1,3}，C = {1,4}。P(A∩B) = P({1}) = 1/4 = P(A)P(B)，两两独立。但 P(A∩B∩C) = 1/4 ≠ P(A)P(B)P(C) = 1/8。'
      },
      {
        id: 'bernoulli-trial',
        name: '伯努利试验',
        category: '独立试验',
        definition: '伯努利试验是指只有两种可能结果的试验：成功（A）或失败（Ā）。若 P(A) = p，则 P(Ā) = 1 - p。n 次独立伯努利试验称为 n 重伯努利试验。',
        plainTranslation: '伯努利试验就是"非此即彼"的试验：要么成功要么失败，没有第三种可能。掷硬币是典型的伯努利试验（正面=成功，反面=失败）。射击要么命中要么没命中，产品质量检验要么合格要么不合格，都是伯努利试验。',
        whyNeedIt: '伯努利试验是最简单的概率模型，却是很多复杂模型的基础。二项分布（n次试验成功k次的概率）、几何分布（第一次成功需要的试验次数）都来源于伯努利试验。',
        example: '射击命中率为 p = 0.8，每次射击是伯努利试验。独立射击10次，是10重伯努利试验。'
      },
      {
        id: 'independence-of-multiple-events',
        name: '多个事件的独立性',
        category: '独立性',
        definition: 'n 个事件 A₁, A₂, ..., Aₙ 相互独立，当且仅当对任意 k (2 ≤ k ≤ n) 和任意 1 ≤ i₁ < i₂ < ... < iₖ ≤ n，有 P(A_{i₁} ∩ A_{i₂} ∩ ... ∩ A_{iₖ}) = P(A_{i₁})·P(A_{i₂})·...·P(A_{iₖ})。',
        plainTranslation: '多个事件相互独立比两两独立要求更严格：任意子集的事件都要独立！比如三个事件A、B、C相互独立，不仅要求A和B独立、B和C独立、A和C独立，还要求A∩B和C独立、A∩C和B独立、B∩C和A独立，以及A∩B∩C的概率等于三者乘积。',
        whyNeedIt: '多个事件的相互独立是很多概率模型的前提。比如n重伯努利试验要求n次试验相互独立，这样才能用乘法公式计算任意结果序列的概率。',
        formula: 'P(A_1 \\cap A_2 \\cap \\cdots \\cap A_n) = \\prod_{i=1}^n P(A_i)',
        example: '掷n枚硬币，每枚硬币正面向上的事件相互独立，所以全部正面的概率 = (1/2)ⁿ。'
      },
      {
        id: 'permutation-combination',
        name: '排列与组合',
        category: '古典概型',
        definition: '从n个不同元素中取m个的排列数 Aₙᵐ = n!/(n-m)!；组合数 Cₙᵐ = n!/[m!(n-m)!]。排列考虑顺序，组合不考虑顺序。排列与组合的关系：Aₙᵐ = Cₙᵐ × m!。',
        plainTranslation: '排列和组合是计数的基础工具。排列是"排队"——谁站前面谁站后面有区别；组合是"选拔"——选出的人组成一组，不关心顺序。比如从10人中选3人排队有A₁₀³=720种，而选3人组队只有C₁₀³=120种。',
        whyNeedIt: '排列组合是古典概型计算概率的基础。很多概率题的第一步就是"数清楚"有利事件和样本空间的大小，排列组合提供了计数的方法论。',
        formula: 'A_n^m = \\frac{n!}{(n-m)!}, \\quad C_n^m = \\frac{n!}{m!(n-m)!}'
      },
      {
        id: 'addition-multiplication-principle',
        name: '加法原理与乘法原理',
        category: '古典概型',
        definition: '加法原理：完成一件事有k类方法，各类分别有n₁,n₂,...,nₖ种，则完成该事共有n₁+n₂+...+nₖ种方法。乘法原理：完成一件事需k个步骤，各步分别有n₁,n₂,...,nₖ种方法，则完成该事共有n₁×n₂×...×nₖ种方法。',
        plainTranslation: '加法原理是"分类"——完成任务的几条路互不重叠，总数相加；乘法原理是"分步"——任务分成几步完成，每步的选择数相乘。就像去食堂吃饭：有3个窗口各4道菜（加法原理，共12道菜可选），或者先选主食3种再选菜4种（乘法原理，共12种搭配）。',
        whyNeedIt: '加法原理和乘法原理是排列组合的理论基础，也是分析复杂计数问题的思维框架。正确区分"分类"和"分步"是解题的关键。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter11',
    name: '第十一章 随机变量及其分布',
    concepts: [
      {
        id: 'random-variable',
        name: '随机变量',
        category: '基本概念',
        definition: '设 Ω 为样本空间，若对每个 ω ∈ Ω，都有唯一的实数 X(ω) 与之对应，则称 X 为随机变量。随机变量是样本空间到实数集的映射。',
        plainTranslation: '随机变量就是给每个结果贴上数字标签。掷骰子，结果是"1点""2点"...，我们用X表示点数，那么X=1、X=2就是具体的数值。这样就把"掷骰子"这个事件变成了可以计算的数字，就能用数学工具来研究了。',
        whyNeedIt: '没有随机变量，概率论只能讨论"事件"，无法用函数、微积分等数学工具。随机变量是概率论从"定性描述"跨越到"定量计算"的关键桥梁。',
        example: '掷两枚骰子，X = 两枚骰子点数之和。X 的可能取值是 2, 3, 4, ..., 12。'
      },
      {
        id: 'discrete-random-variable',
        name: '离散型随机变量',
        category: '随机变量类型',
        definition: '若随机变量 X 的所有可能取值为有限个或可列无限个，则称 X 为离散型随机变量。离散型随机变量的概率分布可用分布律描述。',
        plainTranslation: '离散型随机变量就是"取值可以数清楚"的变量。掷骰子的点数是离散型（1,2,3,4,5,6共6个值），一天内接到电话的次数也是离散型（0,1,2,3,...可以无限数下去）。关键特征是：能把所有可能取值列出来。',
        whyNeedIt: '离散型随机变量是最基础的随机变量类型。计数问题（如产品次品数、电话呼叫数）都需要用离散型随机变量建模。',
        example: 'X = 某路口一天内发生的事故数，取值为 0, 1, 2, 3, ...（可列无限个）。'
      },
      {
        id: 'distribution-law',
        name: '分布律',
        category: '离散型分布',
        definition: '离散型随机变量 X 的分布律是指 X 的所有可能取值 x₁, x₂, ... 及其对应的概率 p₁, p₂, ... 的对应关系。记作 P(X = xₖ) = pₖ，满足：(1) pₖ ≥ 0；(2) Σpₖ = 1。',
        plainTranslation: '分布律就是一张"取值-概率对照表"。比如掷骰子，表上写着：1点对应1/6，2点对应1/6，...，6点对应1/6。这张表完整描述了离散型随机变量的概率分布，是计算一切概率的基础。',
        whyNeedIt: '没有分布律，离散型随机变量就只是一个"取值列表"，不知道每个取值有多大概率。分布律给出了完整的概率信息，让我们能计算任何事件的概率。',
        formula: 'P(X = x_k) = p_k, \\quad \\sum_k p_k = 1',
        example: '掷一枚骰子，X 为点数。分布律为 P(X=k) = 1/6，k = 1,2,3,4,5,6。'
      },
      {
        id: 'bernoulli-distribution',
        name: '0-1分布（伯努利分布）',
        category: '离散型分布',
        definition: '若 X 只取 0 和 1 两个值，且 P(X=1) = p，P(X=0) = 1-p，则称 X 服从参数为 p 的 0-1分布或伯努利分布，记作 X ~ B(1, p)。',
        plainTranslation: '0-1分布是最简单的分布——只有两种结局：成功（记为1）或失败（记为0）。一次抛硬币、一次射击、一次产品检验，结果都服从0-1分布。它是所有复杂分布的"原子"。',
        whyNeedIt: '0-1分布虽然简单，却是构建复杂分布的基石。二项分布就是n次0-1分布结果的叠加。',
        formula: 'P(X=k) = p^k (1-p)^{1-k}, \\quad k = 0, 1',
        example: '掷硬币，X=1表示正面，X=0表示反面。X ~ B(1, 0.5)。'
      },
      {
        id: 'binomial-distribution',
        name: '二项分布',
        category: '离散型分布',
        definition: '若 X 表示 n 重伯努利试验中成功的次数，则 X 服从参数为 n, p 的二项分布，记作 X ~ B(n, p)。分布律为 P(X=k) = C(n,k)·pᵏ·(1-p)ⁿ⁻ᵏ，k = 0, 1, ..., n。',
        plainTranslation: '二项分布描述"n次独立试验中成功k次"的概率。比如掷10次硬币，正面朝上恰好5次的概率是多少？公式里的C(n,k)表示"k次成功分布在n次试验中有多少种排列方式"，p^k是k次成功的概率，(1-p)^(n-k)是n-k次失败的概率。',
        whyNeedIt: '二项分布是最重要的离散分布之一。产品质量抽检（n件产品中有多少件次品）、民意调查（n人中有多少人支持）都可以用二项分布建模。',
        formula: 'P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad k = 0, 1, \\ldots, n',
        example: '射击命中率 p = 0.8，独立射击10次。命中次数 X ~ B(10, 0.8)。P(X = 8) = C(10,8)×0.8⁸×0.2² ≈ 0.302。'
      },
      {
        id: 'poisson-distribution',
        name: '泊松分布',
        category: '离散型分布',
        definition: '若随机变量 X 的分布律为 P(X=k) = λᵏ·e⁻λ / k!，k = 0, 1, 2, ...，其中 λ > 0，则称 X 服从参数为 λ 的泊松分布，记作 X ~ P(λ) 或 X ~ π(λ)。',
        plainTranslation: '泊松分布描述"单位时间/空间内稀有事件发生次数"的分布。比如一小时内到达银行的顾客数、一页书上印刷错误的个数、一平方米内细菌的数量。参数λ是平均发生次数，比如平均每小时5位顾客到达。',
        whyNeedIt: '泊松分布在排队论（银行柜台、电话客服）、可靠性分析（设备故障次数）、保险精算（理赔次数）等领域有广泛应用。它还是二项分布的极限形式。',
        formula: 'P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}, \\quad k = 0, 1, 2, \\ldots',
        example: '某商店平均每小时有5位顾客到达，则一小时内到达 k 位的概率 P(X=k) = 5ᵏ·e⁻⁵ / k!。'
      },
      {
        id: 'poisson-theorem',
        name: '泊松定理',
        category: '离散型分布',
        definition: '设 λ > 0 为常数，n 为正整数。若 npₙ → λ（当 n → ∞），则对任意非负整数 k，有 lim(n→∞) C(n,k)·pₙᵏ·(1-pₙ)ⁿ⁻ᵏ = λᵏ·e⁻λ / k!。',
        plainTranslation: '泊松定理说：当试验次数n很大、成功概率p很小（使得np适中）时，二项分布可以用泊松分布近似。比如某疾病发病率0.001，检查1000人，发病人数近似服从P(1)而不是B(1000, 0.001)——后者计算量太大。',
        whyNeedIt: '泊松定理是简化二项分布计算的利器。当n很大时，计算C(n,k)非常麻烦，用泊松分布近似就简单多了——只需要查e^(-λ)和λ^k/k!。',
        formula: '\\binom{n}{k} p^k (1-p)^{n-k} \\approx \\frac{(np)^k e^{-np}}{k!}, \\quad \\text{当 } n \\text{ 大, } p \\text{ 小}',
        example: '某产品次品率0.01，取100件。次品数的精确分布是 B(100, 0.01)，近似为 P(1)。P(X=0) ≈ e⁻¹ ≈ 0.368。'
      },
      {
        id: 'geometric-distribution',
        name: '几何分布',
        category: '离散型分布',
        definition: '在独立伯努利试验序列中，X 表示首次成功所需的试验次数，则 X 服从参数为 p 的几何分布。分布律为 P(X=k) = (1-p)ᵏ⁻¹·p，k = 1, 2, 3, ...。',
        plainTranslation: '几何分布描述"第一次成功需要尝试几次"。比如投篮命中率0.3，第一次命中需要投几次？可能第1次就中（概率0.3），可能第2次才中（先失败再成功，概率0.7×0.3=0.21），可能第3次才中（概率0.7²×0.3=0.147）...',
        whyNeedIt: '几何分布有独特的"无记忆性"：已经失败了m次，再成功需要的次数分布与从头开始一样。这在可靠性分析（设备首次故障时间）中有重要应用。',
        formula: 'P(X=k) = (1-p)^{k-1} p, \\quad k = 1, 2, 3, \\ldots',
        example: '投篮命中率0.3，首次命中所需次数 X 服从几何分布。P(X=3) = 0.7² × 0.3 = 0.147。'
      },
      {
        id: 'hypergeometric-distribution',
        name: '超几何分布',
        category: '离散型分布',
        definition: '设 N 个物品中有 M 个次品，从中无放回抽取 n 个，X 为抽到的次品数，则 X 服从超几何分布。分布律为 P(X=k) = C(M,k)·C(N-M,n-k) / C(N,n)，k = max(0, n+M-N), ..., min(M, n)。',
        plainTranslation: '超几何分布是"无放回抽样"的分布。比如100件产品中有10件次品，无放回抽取5件，抽到k件次品的概率。与二项分布的区别：二项分布是有放回抽样（每次概率不变），超几何分布是无放回抽样（每次概率会变）。',
        whyNeedIt: '超几何分布是最符合实际抽样场景的分布——现实中抽样通常是不放回的。当N很大、n相对较小时，超几何分布接近二项分布。',
        formula: 'P(X=k) = \\frac{\\binom{M}{k} \\binom{N-M}{n-k}}{\\binom{N}{n}}',
        example: '100件产品中有10件次品，无放回抽取5件。次品数 X 服从超几何分布。P(X=0) = C(90,5)/C(100,5) ≈ 0.584。'
      },
      {
        id: 'continuous-random-variable',
        name: '连续型随机变量',
        category: '随机变量类型',
        definition: '若存在非负可积函数 f(x)，使得对任意实数 x，有 P(X ≤ x) = ∫₋∞ˣ f(t)dt，则称 X 为连续型随机变量，f(x) 称为 X 的概率密度函数。',
        plainTranslation: '连续型随机变量的取值是连续的，不能一一列举。比如身高、体重、时间、温度等。一个关键特点：连续型随机变量取任何一个特定值的概率都是0！比如"身高恰好等于170.000cm"的概率是0，但"身高在169.5cm到170.5cm之间"的概率可以计算。',
        whyNeedIt: '连续型随机变量是描述测量值、时间等连续量的基础工具。大部分物理量都是连续型的，所以连续型分布在科学和工程中应用最广泛。',
        example: 'X 表示某人的身高，是连续型随机变量。P(X = 175.0) = 0（单点概率为0），但 P(170 ≤ X ≤ 180) 可以通过积分计算。'
      },
      {
        id: 'probability-density-function',
        name: '概率密度函数',
        category: '连续型分布',
        definition: '连续型随机变量 X 的概率密度函数 f(x) 满足：(1) f(x) ≥ 0；(2) ∫₋∞⁺∞ f(x)dx = 1；(3) P(a ≤ X ≤ b) = ∫ₐᵇ f(x)dx。注意：f(x) 不是概率，而是概率的"密度"。',
        plainTranslation: '概率密度函数是连续型随机变量的"分布形状"。重要提醒：f(x)的值不是概率！它可以是大于1的数。只有曲线下的面积才是概率。就像物理中的密度：密度本身不是质量，密度乘以体积才是质量。概率密度乘以区间长度才是概率。',
        whyNeedIt: '概率密度函数完整描述了连续型随机变量的分布。知道密度函数，就可以通过积分计算任意区间内的概率。',
        formula: 'P(a \\le X \\le b) = \\int_a^b f(x) dx',
        example: 'f(x) = 2x (0 ≤ x ≤ 1)。验证：∫₀¹ 2x dx = 1。P(0.5 ≤ X ≤ 1) = ∫₀.₅¹ 2x dx = 1 - 0.25 = 0.75。'
      },
      {
        id: 'distribution-function',
        name: '分布函数',
        category: '基本概念',
        definition: '随机变量 X 的分布函数定义为 F(x) = P(X ≤ x)，x ∈ R。对于离散型，F(x) = Σ_{xₖ ≤ x} pₖ；对于连续型，F(x) = ∫₋∞ˣ f(t)dt。分布函数是右连续、单调不减的，且 lim(x→-∞) F(x) = 0，lim(x→+∞) F(x) = 1。',
        plainTranslation: '分布函数是"累计概率"——随机变量不超过某个值的概率。对于离散型，它是阶梯状的（每到一个取值点就跳一下）；对于连续型，它是光滑曲线（密度函数的积分）。分布函数统一了离散型和连续型的描述方式。',
        whyNeedIt: '分布函数是描述随机变量的统一语言，对离散型和连续型都适用。知道分布函数，就可以计算任意事件的概率：P(a < X ≤ b) = F(b) - F(a)。',
        formula: 'F(x) = P(X \\le x)',
        example: '掷骰子，X 为点数。F(3) = P(X ≤ 3) = P(X=1) + P(X=2) + P(X=3) = 1/2。'
      },
      {
        id: 'uniform-distribution',
        name: '均匀分布',
        category: '连续型分布',
        definition: '若 X 的概率密度函数为 f(x) = 1/(b-a)，a ≤ x ≤ b，则称 X 在 [a, b] 上服从均匀分布，记作 X ~ U(a, b)。分布函数为 F(x) = (x-a)/(b-a)，a ≤ x ≤ b。',
        plainTranslation: '均匀分布就是"等可能分布"——在区间[a,b]内取每个值的可能性相同。比如在[0,10]上随机取一个数，取到任何位置的概率密度都是1/10。这是最简单的连续型分布，也是计算机生成随机数的基础。',
        whyNeedIt: '均匀分布是随机模拟的基石。计算机生成其他分布的随机数，通常先生成[0,1]上的均匀随机数，再通过变换得到目标分布。',
        formula: 'f(x) = \\frac{1}{b-a}, \\quad a \\le x \\le b',
        example: 'X ~ U(0, 10)。P(X ≤ 3) = 3/10 = 0.3。P(2 ≤ X ≤ 5) = (5-2)/(10-0) = 0.3。'
      },
      {
        id: 'exponential-distribution',
        name: '指数分布',
        category: '连续型分布',
        definition: '若 X 的概率密度函数为 f(x) = λe⁻λˣ，x ≥ 0，其中 λ > 0，则称 X 服从参数为 λ 的指数分布，记作 X ~ E(λ) 或 X ~ Exp(λ)。分布函数为 F(x) = 1 - e⁻λˣ，x ≥ 0。',
        plainTranslation: '指数分布描述"等待时间"或"寿命"的分布。比如顾客到达银行的等待时间、灯泡的使用寿命、放射性原子衰变的时间。参数λ是"速率"——λ越大，事件发生越快，平均等待时间1/λ越短。',
        whyNeedIt: '指数分布在可靠性工程（设备寿命）、排队论（等待时间）、生存分析（存活时间）中有核心应用。它有独特的"无记忆性"。',
        formula: 'f(x) = \\lambda e^{-\\lambda x}, \\quad x \\ge 0',
        example: '某设备寿命 X ~ E(0.1)（单位：年）。平均寿命 1/λ = 10年。P(X > 5) = e⁻⁰·⁵ ≈ 0.607。'
      },
      {
        id: 'exponential-memoryless',
        name: '指数分布的无记忆性',
        category: '连续型分布',
        definition: '若 X ~ E(λ)，则对任意 s, t > 0，有 P(X > s + t | X > s) = P(X > t)。这意味着：已知已经存活了 s 时间，再存活 t 时间的概率与从头开始存活 t 时间相同。',
        plainTranslation: '无记忆性是指数分布的独特性质：它"不记得"自己已经活了多久。比如一个服从指数分布的灯泡，不管已经用了多久，从现在开始还能用的寿命分布与新灯泡完全一样！这是唯一具有无记忆性的连续型分布。',
        whyNeedIt: '无记忆性让指数分布在建模"无老化"系统时非常方便。但实际系统通常有老化，所以指数分布只是近似模型。',
        formula: 'P(X > s + t | X > s) = P(X > t)',
        example: '设备寿命 X ~ E(λ)。已知已工作5年，再工作3年的概率 = 从新开始工作3年的概率。'
      },
      {
        id: 'normal-distribution',
        name: '正态分布',
        category: '连续型分布',
        definition: '若 X 的概率密度函数为 f(x) = (1/√(2πσ²))·e^(-(x-μ)²/(2σ²))，x ∈ R，其中 μ 为均值，σ² 为方差，则称 X 服从参数为 μ, σ² 的正态分布，记作 X ~ N(μ, σ²)。',
        plainTranslation: '正态分布就是著名的"钟形曲线"——中间高两边低，关于均值μ对称。很多自然现象都近似服从正态分布：身高、体重、考试成绩、测量误差...中心极限定理告诉我们：大量独立随机因素叠加的结果趋于正态分布。',
        whyNeedIt: '正态分布是统计学中最重要的分布，没有之一。它是统计推断的理论基础，也是描述自然现象最常用的模型。',
        formula: 'f(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
        example: '身高 X ~ N(170, 10²)（单位cm）。大多数人身高在170附近，越高或越矮的人越少。'
      },
      {
        id: 'standard-normal-distribution',
        name: '标准正态分布',
        category: '连续型分布',
        definition: '当 μ = 0, σ² = 1 时的正态分布称为标准正态分布，记作 X ~ N(0, 1)。其密度函数为 φ(x) = (1/√(2π))·e^(-x²/2)，分布函数为 Φ(x) = ∫₋∞ˣ φ(t)dt。',
        plainTranslation: '标准正态分布是"最简单"的正态分布——均值是0，标准差是1。它的曲线关于原点对称。任何正态分布都可以通过标准化变成标准正态分布，然后查表计算概率。',
        whyNeedIt: '标准正态分布表是计算正态概率的工具。通过标准化变换，任何正态分布的概率计算都可以转化为查标准正态分布表，避免了复杂的积分计算。',
        formula: '\\Phi(x) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^x e^{-t^2/2} dt',
        example: 'X ~ N(μ, σ²)，则 Z = (X - μ)/σ ~ N(0, 1)。P(|X - μ| < σ) = P(|Z| < 1) ≈ 0.6826。'
      },
      {
        id: 'normal-standardization',
        name: '正态分布的标准化',
        category: '连续型分布',
        definition: '若 X ~ N(μ, σ²)，则 Z = (X - μ)/σ ~ N(0, 1)。由此，P(a ≤ X ≤ b) = P((a-μ)/σ ≤ Z ≤ (b-μ)/σ) = Φ((b-μ)/σ) - Φ((a-μ)/σ)。',
        plainTranslation: '标准化就是把"一般正态分布"变成"标准正态分布"的方法：先减去均值μ，再除以标准差σ。比如X ~ N(100, 15²)，要算P(X > 115)，就变成P(Z > 1)，查表得约0.1587。',
        whyNeedIt: '标准化是计算正态分布概率的标准方法。没有标准化，每次都要计算复杂的积分；有了标准化，只需查表即可。',
        formula: 'Z = \\frac{X - \\mu}{\\sigma} \\sim N(0,1)',
        example: 'X ~ N(100, 15²)。P(X > 115) = P(Z > 1) = 1 - Φ(1) ≈ 1 - 0.8413 = 0.1587。'
      },
      {
        id: 'normal-3sigma-rule',
        name: '正态分布的3σ法则',
        category: '连续型分布',
        definition: '若 X ~ N(μ, σ²)，则：\n(1) P(μ - σ ≤ X ≤ μ + σ) ≈ 0.6826\n(2) P(μ - 2σ ≤ X ≤ μ + 2σ) ≈ 0.9544\n(3) P(μ - 3σ ≤ X ≤ μ + 3σ) ≈ 0.9974\n即大约68%的值在1σ内，95%在2σ内，99.7%在3σ内。',
        plainTranslation: '3σ法则是正态分布的"经验法则"：约68%的数据在均值±1个标准差内，约95%在±2个标准差内，约99.7%在±3个标准差内。比如考试成绩均值75、标准差10，那么几乎所有人（99.7%）的成绩在45-105分之间。',
        whyNeedIt: '3σ法则在实践中非常重要。质量控制中的"3σ控制限"、异常值检测（超出±3σ的视为异常）、正态性检验等都基于此法则。',
        formula: 'P(\\mu - 3\\sigma < X < \\mu + 3\\sigma) \\approx 0.9974',
        example: '考试成绩 X ~ N(75, 10²)。约68%的学生成绩在65-85分，约95%在55-95分，几乎全部在45-105分。'
      },
      {
        id: 'random-variable-function',
        name: '随机变量函数的分布',
        category: '函数分布',
        definition: '设 X 是随机变量，g 是连续函数，则 Y = g(X) 也是一个随机变量。求 Y 的分布：(1) 分布函数法：F_Y(y) = P(Y ≤ y) = P(g(X) ≤ y)；(2) 公式法（连续型）：若 g 单调可导，则 f_Y(y) = f_X(g⁻¹(y))·|d(g⁻¹(y))/dy|。',
        plainTranslation: '随机变量的函数还是随机变量！比如X服从均匀分布，Y=X²也是一个随机变量，需要求它的分布。方法有两种：一是"分布函数法"，先求分布函数再求导；二是"公式法"，直接用公式转换密度函数。',
        whyNeedIt: '很多统计量都是随机变量的函数，比如样本均值、样本方差。知道如何求随机变量函数的分布，才能进行统计推断。',
        formula: 'f_Y(y) = f_X(g^{-1}(y)) \\cdot \\left| \\frac{d g^{-1}(y)}{dy} \\right|',
        example: 'X ~ U(0, 1)，求 Y = X² 的分布。Y 的取值范围是 (0, 1)，f_Y(y) = f_X(√y)·|1/(2√y)| = 1/(2√y)。'
      },
      {
        id: 'linear-transform-distribution',
        name: '线性变换的分布',
        category: '函数分布',
        definition: '若 X 的分布函数为 F_X(x)，密度函数为 f_X(x)，则 Y = aX + b（a ≠ 0）的分布：F_Y(y) = F_X((y-b)/a)，f_Y(y) = (1/|a|)·f_X((y-b)/a)。特别地，若 X ~ N(μ, σ²)，则 aX + b ~ N(aμ + b, a²σ²)。',
        plainTranslation: '线性变换是最简单的函数变换。乘以a会拉伸/压缩分布（方差变为a²倍），加上b会平移分布（均值增加b）。正态分布有个好性质：线性变换后还是正态分布！比如X ~ N(0,1)，则2X+3 ~ N(3,4)。',
        whyNeedIt: '线性变换是理解随机变量变换的基础。特别是正态分布的线性变换性质，在统计推断中非常重要——样本均值的分布就用到这个性质。',
        formula: 'Y = aX + b \\Rightarrow f_Y(y) = \\frac{1}{|a|} f_X\\left(\\frac{y-b}{a}\\right)',
        example: 'X ~ N(0, 1)，则 Y = 2X + 3 ~ N(3, 4)。均值平移3，方差变为2² = 4。'
      },
      {
        id: 'negative-binomial',
        name: '负二项分布（帕斯卡分布）',
        category: '离散分布',
        definition: '在独立重复的伯努利试验中，直到第r次成功为止所需的试验次数X服从负二项分布：P(X=k) = Cᵏ⁻¹ᵣ₋₁ pʳ(1-p)ᵏ⁻ʳ，k=r,r+1,...。当r=1时退化为几何分布。',
        plainTranslation: '负二项分布是几何分布的"升级版"——几何分布等第一次成功，负二项分布等第r次成功。比如抛硬币，几何分布问"第几次才出现正面"，负二项分布问"第几次才出现第3个正面"。r=1时就回到了几何分布。',
        whyNeedIt: '负二项分布在等待多次成功的问题中有应用，也是数理统计中负二项回归模型的基础。考研中以概念辨析题形式出现。',
        formula: 'P(X=k) = C_{k-1}^{r-1} p^r (1-p)^{k-r}, \\quad k = r, r+1, \\ldots'
      }
    ] as Concept[]
  },
  {
    id: 'chapter12',
    name: '第十二章 多维随机变量及其分布',
    concepts: [
      {
        id: 'multidimensional-random-variable',
        name: '多维随机变量',
        category: '基本概念',
        definition: '设 X₁, X₂, ..., Xₙ 是定义在同一样本空间 Ω 上的 n 个随机变量，则称 (X₁, X₂, ..., Xₙ) 为 n 维随机变量或 n 维随机向量。二维随机变量记作 (X, Y)。',
        plainTranslation: '多维随机变量就是"把多个随机变量打包在一起研究"。比如研究一个人，我们同时关心身高X、体重Y、血压Z，这三个量都是随机的，而且相互关联——高个子通常更重。用(X, Y, Z)这个三维随机变量，可以研究它们的联合规律。',
        whyNeedIt: '现实世界的问题往往涉及多个相互关联的变量。单独研究身高或体重是不够的，因为身高和体重有相关性。多维随机变量让我们能研究变量之间的"联合行为"和"相互关系"。',
        example: '研究某地区居民的健康状况，X = 身高，Y = 体重，Z = 血压。(X, Y, Z) 是三维随机变量。'
      },
      {
        id: 'joint-distribution-function',
        name: '联合分布函数',
        category: '基本概念',
        definition: '设 (X, Y) 是二维随机变量，对于任意实数 x, y，二元函数 F(x, y) = P(X ≤ x, Y ≤ y) 称为 (X, Y) 的联合分布函数，或简称分布函数。',
        plainTranslation: '联合分布函数是"双变量版的分布函数"——它告诉我们"X不超过x且Y不超过y"这个事件发生的概率。想象在平面上画一个以(x,y)为右上角、向左下方无限延伸的矩形，F(x,y)就是随机点落在这个矩形内的概率。',
        whyNeedIt: '联合分布函数完整描述了两个变量的联合概率分布。知道它，就可以计算任何与(X, Y)相关的事件概率，比如P(X > a, Y > b)、P(X + Y < c)等。',
        formula: 'F(x, y) = P(X \\le x, Y \\le y)',
        example: '(X, Y) 表示靶心射击的落点坐标。F(1, 1) = P(X ≤ 1, Y ≤ 1) 表示落在左下象限的概率。'
      },
      {
        id: 'joint-distribution-function-properties',
        name: '联合分布函数的性质',
        category: '基本概念',
        definition: '联合分布函数 F(x, y) 具有以下性质：(1) 对每个变量单调不减；(2) 右连续；(3) lim(x→-∞) F(x, y) = 0，lim(y→-∞) F(x, y) = 0，lim(x,y→+∞) F(x, y) = 1；(4) 对任意 x₁ < x₂, y₁ < y₂，有 F(x₂, y₂) - F(x₁, y₂) - F(x₂, y₁) + F(x₁, y₁) ≥ 0。',
        plainTranslation: '联合分布函数的性质与一维类似，但多了"矩形不等式"这个条件。矩形不等式保证了概率的非负性：随机点落在任意矩形区域内的概率必须非负。如果这个条件不满足，函数就不是联合分布函数。',
        whyNeedIt: '这些性质是判断一个函数是否为联合分布函数的准则。特别是性质(4)，它是二维情形特有的，保证概率计算的合理性。',
        formula: 'P(x_1 < X \\le x_2, y_1 < Y \\le y_2) = F(x_2, y_2) - F(x_1, y_2) - F(x_2, y_1) + F(x_1, y_1)',
        example: '验证 F(x, y) = 1 - e^{-x} - e^{-y} + e^{-(x+y)} (x,y > 0) 是联合分布函数：满足单调性、边界条件，且矩形概率非负。'
      },
      {
        id: 'discrete-joint-distribution',
        name: '二维离散型随机变量',
        category: '离散型分布',
        definition: '若二维随机变量 (X, Y) 的所有可能取值是有限对或可列无限对，则称 (X, Y) 为二维离散型随机变量。其联合分布律为 P(X = xᵢ, Y = yⱼ) = pᵢⱼ，满足 pᵢⱼ ≥ 0 且 ΣᵢΣⱼ pᵢⱼ = 1。',
        plainTranslation: '二维离散型就是"取值对可以一一列举"的情况。比如掷两枚骰子，(X, Y) = (第一枚点数, 第二枚点数)，共有36种可能组合：(1,1), (1,2), ..., (6,6)。联合分布律就是一张"概率表格"，行是X的取值，列是Y的取值，每个格子里填概率。',
        whyNeedIt: '二维离散型是最简单的多维随机变量，便于理解和计算。很多实际问题（如问卷调查的多个选项）都可以用二维离散型建模。',
        formula: 'P(X = x_i, Y = y_j) = p_{ij}, \\quad \\sum_i \\sum_j p_{ij} = 1',
        example: '袋中有2红3白球，无放回取2球。X = 第一球颜色（红=1，白=0），Y = 第二球颜色。联合分布律：P(0,0)=3/10，P(0,1)=3/10，P(1,0)=3/10，P(1,1)=1/10。'
      },
      {
        id: 'continuous-joint-distribution',
        name: '二维连续型随机变量',
        category: '连续型分布',
        definition: '若存在非负可积函数 f(x, y)，使得对任意 x, y 有 F(x, y) = ∫₋∞ˣ∫₋∞ʸ f(u, v)dudv，则称 (X, Y) 为二维连续型随机变量，f(x, y) 称为联合概率密度函数。',
        plainTranslation: '二维连续型就是"取值连续"的情况。联合密度函数 f(x, y) 描述了概率在二维平面上的"密度分布"。概率等于密度函数在对应区域上的积分——就是曲面下的体积。',
        whyNeedIt: '二维连续型随机变量是描述两个连续量联合分布的工具。比如身高和体重、长度和宽度等。',
        formula: 'P((X, Y) \\in D) = \\iint_D f(x, y) dx dy',
        example: 'f(x, y) = 6e^{-2x-3y} (x,y > 0)。验证：∫₀^∞∫₀^∞ 6e^{-2x-3y}dxdy = 1。P(X < 1, Y < 1) = ∫₀¹∫₀¹ 6e^{-2x-3y}dxdy = (1-e^{-2})(1-e^{-3})。'
      },
      {
        id: 'joint-pdf-properties',
        name: '联合概率密度的性质',
        category: '连续型分布',
        definition: '联合概率密度函数 f(x, y) 满足：(1) f(x, y) ≥ 0；(2) ∫₋∞^+∞∫₋∞^+∞ f(x, y)dxdy = 1；(3) 在 f(x, y) 连续点处，∂²F/∂x∂y = f(x, y)；(4) P((X,Y) ∈ D) = ∬_D f(x, y)dxdy。',
        plainTranslation: '联合密度函数的性质与一维类似：非负、积分为1。关键点是：概率等于密度函数在区域上的二重积分。单点概率为0，但落在某区域的概率可以通过积分计算。',
        whyNeedIt: '这些性质是判断联合密度函数的准则，也是计算概率的基础。',
        formula: '\\int_{-\\infty}^{+\\infty} \\int_{-\\infty}^{+\\infty} f(x, y) dx dy = 1',
        example: 'f(x, y) = 2 (0 < x < y < 1)。验证：∫₀¹∫ₓ¹ 2 dy dx = ∫₀¹ 2(1-x)dx = 1。'
      },
      {
        id: 'marginal-distribution',
        name: '边缘分布',
        category: '边缘分布',
        definition: '设 (X, Y) 是二维随机变量，其联合分布函数为 F(x, y)。X 的边缘分布函数定义为 F_X(x) = lim(y→+∞) F(x, y) = P(X ≤ x)；Y 的边缘分布函数定义为 F_Y(y) = lim(x→+∞) F(x, y) = P(Y ≤ y)。',
        plainTranslation: '边缘分布就是"只看一个变量，忽略另一个"得到的分布。比如全班有语文和数学成绩的联合分布表，只看语文成绩的分布（把数学成绩列求和），就是语文成绩的边缘分布。"边缘"这个名字来源于：在联合分布表中，边缘分布写在表格的边缘。',
        whyNeedIt: '边缘分布让我们能单独研究多维随机变量中的某一个分量。它把"联合信息"简化为"单变量信息"。',
        formula: 'F_X(x) = F(x, +\\infty), \\quad F_Y(y) = F(+\\infty, y)',
        example: '掷两枚骰子，(X, Y) = (第一枚点数, 第二枚点数)。X 的边缘分布是 P(X=k) = 1/6，与 Y 无关。'
      },
      {
        id: 'marginal-pmf',
        name: '离散型的边缘分布律',
        category: '边缘分布',
        definition: '若 (X, Y) 是二维离散型随机变量，联合分布律为 pᵢⱼ，则 X 的边缘分布律为 pᵢ· = Σⱼ pᵢⱼ，Y 的边缘分布律为 p·ⱼ = Σᵢ pᵢⱼ。',
        plainTranslation: '离散型的边缘分布律就是"把联合概率表按行或列求和"。X 的边缘分布律是把每行的概率加起来，Y 的边缘分布律是把每列的概率加起来。',
        whyNeedIt: '从联合分布求边缘分布是最基本的计算之一。它让我们能从"整体"看到"局部"。',
        formula: 'P(X = x_i) = \\sum_j p_{ij}, \\quad P(Y = y_j) = \\sum_i p_{ij}',
        example: '联合分布律表：p₁₁=0.1, p₁₂=0.2, p₂₁=0.3, p₂₂=0.4。P(X=x₁) = 0.1+0.2 = 0.3，P(Y=y₁) = 0.1+0.3 = 0.4。'
      },
      {
        id: 'marginal-pdf',
        name: '连续型的边缘密度',
        category: '边缘分布',
        definition: '若 (X, Y) 是二维连续型随机变量，联合密度为 f(x, y)，则 X 的边缘密度为 f_X(x) = ∫₋∞^+∞ f(x, y)dy，Y 的边缘密度为 f_Y(y) = ∫₋∞^+∞ f(x, y)dx。',
        plainTranslation: '连续型的边缘密度就是"把联合密度对另一个变量积分"。X 的边缘密度是把 y 积掉，Y 的边缘密度是把 x 积掉。这叫"积分掉"或"边缘化"。',
        whyNeedIt: '从联合密度求边缘密度是连续型多维随机变量的基本计算。它让我们能单独研究每个变量。',
        formula: 'f_X(x) = \\int_{-\\infty}^{+\\infty} f(x, y) dy, \\quad f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x, y) dx',
        example: 'f(x, y) = 6e^{-2x-3y} (x,y > 0)。f_X(x) = ∫₀^∞ 6e^{-2x-3y}dy = 2e^{-2x} (x > 0)，即 X ~ E(2)。'
      },
      {
        id: 'conditional-distribution',
        name: '条件分布',
        category: '条件分布',
        definition: '设 (X, Y) 是二维随机变量。在 Y = y 条件下 X 的条件分布函数定义为 F_{X|Y}(x|y) = P(X ≤ x | Y = y)。对于离散型，条件分布律为 P(X = xᵢ | Y = yⱼ) = pᵢⱼ / p·ⱼ；对于连续型，条件密度为 f_{X|Y}(x|y) = f(x, y) / f_Y(y)。',
        plainTranslation: '条件分布就是"已知一个变量的值，另一个变量的分布"。比如已知某人身高180cm，其体重的分布就是条件分布。它描述了变量之间的依赖关系。',
        whyNeedIt: '条件分布是研究变量间关系的重要工具。它告诉我们：当知道一个变量的信息后，另一个变量的分布如何变化。',
        formula: 'P(X = x_i | Y = y_j) = \\frac{p_{ij}}{p_{\\cdot j}}, \\quad f_{X|Y}(x|y) = \\frac{f(x, y)}{f_Y(y)}',
        example: '袋中有2红3白球，无放回取2球。P(Y=1|X=1) = P(X=1,Y=1)/P(X=1) = (1/10)/(4/10) = 1/4。已知第一球是红球，第二球也是红球的概率是1/4。'
      },
      {
        id: 'conditional-pdf',
        name: '条件概率密度',
        category: '条件分布',
        definition: '设 (X, Y) 是二维连续型随机变量，联合密度为 f(x, y)，Y 的边缘密度为 f_Y(y)。在 Y = y 条件下 X 的条件概率密度定义为 f_{X|Y}(x|y) = f(x, y) / f_Y(y)（其中 f_Y(y) > 0）。',
        plainTranslation: '条件概率密度是连续型条件分布的核心。它等于联合密度除以边缘密度。直观理解：在 Y = y 这个"切片"上，X 的密度分布。',
        whyNeedIt: '条件概率密度是研究连续型变量间关系的基础。很多统计方法（如回归分析）都基于条件分布。',
        formula: 'f_{X|Y}(x|y) = \\frac{f(x, y)}{f_Y(y)}',
        example: 'f(x, y) = 2 (0 < x < y < 1)。f_Y(y) = ∫₀ʸ 2dx = 2y。f_{X|Y}(x|y) = 2/(2y) = 1/y (0 < x < y)。给定 Y=y，X 在 (0, y) 上均匀分布。'
      },
      {
        id: 'independence-of-random-variables',
        name: '随机变量的独立性',
        category: '独立性',
        definition: '设 (X, Y) 是二维随机变量，若对任意 x, y 有 F(x, y) = F_X(x)·F_Y(y)，则称 X 与 Y 相互独立。等价条件：离散型 pᵢⱼ = pᵢ· × p·ⱼ；连续型 f(x, y) = f_X(x)·f_Y(y)。',
        plainTranslation: '随机变量的独立性就是"互不影响"：知道 X 的值不会改变 Y 的分布，反之亦然。数学上，联合分布等于边缘分布的乘积。独立意味着条件分布等于无条件分布。',
        whyNeedIt: '独立性是概率论最重要的概念之一。独立随机变量的处理大大简化，很多定理和方法都假设独立性。',
        formula: 'F(x, y) = F_X(x) \\cdot F_Y(y)',
        example: '掷两枚骰子，X = 第一枚点数，Y = 第二枚点数。X 和 Y 独立，因为 P(X=i, Y=j) = 1/36 = (1/6)×(1/6) = P(X=i)×P(Y=j)。'
      },
      {
        id: 'independence-criteria',
        name: '独立性的判定',
        category: '独立性',
        definition: '判定 X 与 Y 独立的方法：(1) 定义法：验证 F(x, y) = F_X(x)·F_Y(y)；(2) 离散型：验证 pᵢⱼ = pᵢ· × p·ⱼ 对所有 i, j 成立；(3) 连续型：验证 f(x, y) = f_X(x)·f_Y(y) 对所有 x, y 成立；(4) 因子分解：若联合密度/分布律可分解为 g(x)·h(y) 的形式，且定义域是矩形区域，则独立。',
        plainTranslation: '独立性判定的关键是"可分离性"：联合分布能否分解成只含 x 和只含 y 的两个函数的乘积。如果联合密度的定义域不是矩形（如三角形区域），则通常不独立。',
        whyNeedIt: '掌握独立性判定方法，可以快速判断两个随机变量是否独立，从而简化后续计算。',
        formula: 'f(x, y) = g(x) \\cdot h(y) \\Rightarrow X, Y \\text{ 独立}',
        example: 'f(x, y) = 6e^{-2x-3y} (x,y > 0) = (2e^{-2x})×(3e^{-3y})，可分离，X 与 Y 独立。f(x, y) = 2 (0 < x < y < 1)，定义域是三角形，X 与 Y 不独立。'
      },
      {
        id: 'independence-properties',
        name: '独立随机变量的性质',
        category: '独立性',
        definition: '若 X 与 Y 独立，则：(1) 对任意函数 g, h，g(X) 与 h(Y) 独立；(2) F_{X|Y}(x|y) = F_X(x)，条件分布等于无条件分布；(3) P(X ∈ A, Y ∈ B) = P(X ∈ A)·P(Y ∈ B)；(4) X 的函数与 Y 的函数独立。',
        plainTranslation: '独立性的性质告诉我们：独立变量的函数也独立。这是非常有用的结论。比如 X 和 Y 独立，则 X² 和 Y² 也独立，sin(X) 和 cos(Y) 也独立。',
        whyNeedIt: '这些性质在证明和计算中非常有用。它们让独立性的好处"传递"到函数上。',
        formula: 'X, Y \\text{ 独立} \\Rightarrow g(X), h(Y) \\text{ 独立}',
        example: 'X, Y 独立，则 X + Y 与 X - Y 不一定独立（因为都含 X）。但 X 和 Y 独立时，X² 和 Y² 独立。'
      },
      {
        id: 'two-dimensional-uniform-distribution',
        name: '二维均匀分布',
        category: '常用分布',
        definition: '设 D 是平面上的有界区域，面积为 S。若 (X, Y) 的联合密度为 f(x, y) = 1/S（当 (x, y) ∈ D），f(x, y) = 0（当 (x, y) ∉ D），则称 (X, Y) 在 D 上服从均匀分布。',
        plainTranslation: '二维均匀分布就是"在区域内等可能取点"。比如在单位正方形内随机取一点，每点被取到的概率密度相等。概率等于面积比：P((X,Y) ∈ A) = A的面积 / D的面积。',
        whyNeedIt: '二维均匀分布是几何概型的推广。它在随机模拟、蒙特卡洛方法中有重要应用。',
        formula: 'f(x, y) = \\frac{1}{S}, \\quad (x, y) \\in D',
        example: '(X, Y) 在单位圆 D = {(x,y): x² + y² < 1} 上均匀分布。P(X² + Y² < 1/4) = π(1/2)² / π(1)² = 1/4。'
      },
      {
        id: 'two-dimensional-normal-distribution',
        name: '二维正态分布',
        category: '常用分布',
        definition: '若 (X, Y) 的联合密度为 f(x, y) = (1/(2πσ₁σ₂√(1-ρ²))) × exp{-1/(2(1-ρ²))[(x-μ₁)²/σ₁² - 2ρ(x-μ₁)(y-μ₂)/(σ₁σ₂) + (y-μ₂)²/σ₂²]}，则称 (X, Y) 服从参数为 μ₁, μ₂, σ₁², σ₂², ρ 的二维正态分布，记作 (X, Y) ~ N(μ₁, μ₂, σ₁², σ₂², ρ)。',
        plainTranslation: '二维正态分布是"钟形曲面"——在中心最高，向四周降低。参数 μ₁, μ₂ 是两个变量的均值，σ₁², σ₂² 是方差，ρ 是相关系数（描述两个变量的线性相关程度）。',
        whyNeedIt: '二维正态分布是最重要的多维分布。很多实际数据（如身高体重）近似服从二维正态分布。它是多元统计分析的基础。',
        formula: '(X, Y) \\sim N(\\mu_1, \\mu_2, \\sigma_1^2, \\sigma_2^2, \\rho)',
        example: '身高 X ~ N(170, 10²)，体重 Y ~ N(65, 5²)，相关系数 ρ = 0.7。(X, Y) 可用二维正态分布建模。'
      },
      {
        id: 'bivariate-normal-properties',
        name: '二维正态分布的性质',
        category: '常用分布',
        definition: '若 (X, Y) ~ N(μ₁, μ₂, σ₁², σ₂², ρ)，则：(1) X ~ N(μ₁, σ₁²)，Y ~ N(μ₂, σ₂²)；(2) X 与 Y 独立 ⟺ ρ = 0；(3) 条件分布 X|Y=y ~ N(μ₁ + ρσ₁/σ₂(y-μ₂), σ₁²(1-ρ²))；(4) aX + bY ~ N(aμ₁ + bμ₂, a²σ₁² + b²σ₂² + 2abρσ₁σ₂)。',
        plainTranslation: '二维正态分布有很好的性质：边缘分布是正态的，条件分布也是正态的，线性组合还是正态的。特别重要的是：独立 ⟺ 不相关（ρ = 0），这在一维情形不成立。',
        whyNeedIt: '这些性质让二维正态分布成为理论研究和实际应用中最方便的多维分布。',
        formula: 'X, Y \\text{ 独立} \\Leftrightarrow \\rho = 0',
        example: '(X, Y) ~ N(0, 0, 1, 1, 0.5)。X ~ N(0, 1)，Y ~ N(0, 1)。X + Y ~ N(0, 2 + 2×0.5) = N(0, 3)。'
      },
      {
        id: 'sum-of-random-variables',
        name: '随机变量之和的分布',
        category: '函数分布',
        definition: '设 (X, Y) 是二维随机变量，Z = X + Y。若 X 与 Y 独立，则：(1) 离散型：P(Z = z) = Σₓ P(X = x)·P(Y = z - x)；(2) 连续型：f_Z(z) = ∫ f_X(x)·f_Y(z - x)dx。这个积分称为卷积公式。',
        plainTranslation: '随机变量之和的分布用"卷积"来计算。直观理解：Z = z 可以有很多种方式——X 取 x，Y 取 z-x。把所有可能的方式加起来（离散）或积起来（连续），就是 Z 的分布。',
        whyNeedIt: '求和分布是概率计算的基本问题。很多统计量（如样本均值）都是随机变量的和，需要知道它们的分布。',
        formula: 'f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z - x) dx',
        example: 'X, Y 独立且都 ~ E(λ)。Z = X + Y 的密度 f_Z(z) = λ²ze^{-λz}，即 Z ~ Γ(2, λ)（伽马分布）。'
      },
      {
        id: 'convolution-formula',
        name: '卷积公式',
        category: '函数分布',
        definition: '设 X, Y 独立，密度分别为 f_X, f_Y，则 Z = X + Y 的密度为 f_Z(z) = ∫₋∞^+∞ f_X(x)·f_Y(z - x)dx = ∫₋∞^+∞ f_X(z - y)·f_Y(y)dy。这个公式称为卷积公式，记作 f_Z = f_X * f_Y。',
        plainTranslation: '卷积公式是求独立随机变量之和分布的标准方法。它把"求和"问题转化为"积分"问题。名字来源于信号处理中的卷积运算。',
        whyNeedIt: '卷积公式是概率论中最常用的公式之一。它让我们能从单个变量的分布求出和的分布。',
        formula: 'f_Z(z) = (f_X * f_Y)(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z - x) dx',
        example: 'X ~ U(0,1)，Y ~ U(0,1) 独立。Z = X + Y 的密度：当 0 < z < 1 时 f_Z(z) = z；当 1 < z < 2 时 f_Z(z) = 2 - z。'
      },
      {
        id: 'max-min-distribution',
        name: '最大值与最小值的分布',
        category: '函数分布',
        definition: '设 X₁, X₂, ..., Xₙ 相互独立，分布函数分别为 F₁, F₂, ..., Fₙ。则：M = max(X₁, ..., Xₙ) 的分布函数为 F_M(x) = F₁(x)·F₂(x)·...·Fₙ(x)；N = min(X₁, ..., Xₙ) 的分布函数为 F_N(x) = 1 - (1 - F₁(x))·(1 - F₂(x))·...·(1 - Fₙ(x))。',
        plainTranslation: '最大值的分布函数 = 各分布函数的乘积（因为最大值 ≤ x 要求每个都 ≤ x）。最小值的分布函数 = 1 减去各"大于 x"概率的乘积（因为最小值 > x 要求每个都 > x）。',
        whyNeedIt: '最大值和最小值分布在实际中很重要。比如系统的寿命取决于最短寿命的元件（串联），或最长寿命的元件（并联）。',
        formula: 'F_{\\max}(x) = \\prod_{i=1}^n F_i(x), \\quad F_{\\min}(x) = 1 - \\prod_{i=1}^n (1 - F_i(x))',
        example: '三个独立元件寿命都 ~ E(λ)。系统寿命（并联，取最大）的分布函数 F(x) = (1 - e^{-λx})³。'
      },
      {
        id: 'quotient-distribution',
        name: '商的分布',
        category: '函数分布',
        definition: '设 (X, Y) 是二维连续型随机变量，联合密度为 f(x, y)，则 Z = X/Y 的密度为 f_Z(z) = ∫₋∞^+∞ |y|·f(zy, y)dy。若 X, Y 独立，则 f_Z(z) = ∫₋∞^+∞ |y|·f_X(zy)·f_Y(y)dy。',
        plainTranslation: '商的分布公式看起来复杂，但思路是变量替换：令 Z = X/Y，W = Y，求出 (Z, W) 的联合密度，再对 W 积分得到 Z 的边缘密度。',
        whyNeedIt: '商的分布在统计中有重要应用。比如 t 分布、F 分布都可以通过商的分布来定义。',
        formula: 'f_Z(z) = \\int_{-\\infty}^{+\\infty} |y| f(zy, y) dy',
        example: 'X, Y 独立且都 ~ N(0, 1)，则 Z = X/Y 服从柯西分布，密度 f_Z(z) = 1/(π(1+z²))。'
      },
      {
        id: 'transformation-method',
        name: '变量变换法',
        category: '函数分布',
        definition: '设 (X, Y) 有联合密度 f_{X,Y}(x, y)，变换 u = g₁(x, y)，v = g₂(x, y) 有唯一反变换 x = h₁(u, v)，y = h₂(u, v)。则 (U, V) 的联合密度为 f_{U,V}(u, v) = f_{X,Y}(h₁(u, v), h₂(u, v))·|J|，其中 J = ∂(x,y)/∂(u,v) 是雅可比行列式。',
        plainTranslation: '变量变换法是求多维随机变量函数分布的一般方法。关键是求反变换和雅可比行列式。雅可比行列式反映了变换的"缩放比例"。',
        whyNeedIt: '变量变换法是处理多维随机变量函数分布的统一框架。最大值、最小值、和、商等都可以用这个方法推导。',
        formula: 'f_{U,V}(u, v) = f_{X,Y}(x, y) \\cdot |J|, \\quad J = \\frac{\\partial(x, y)}{\\partial(u, v)}',
        example: '(X, Y) 的联合密度 f(x, y)，令 U = X + Y，V = X - Y。反变换 x = (U+V)/2，y = (U-V)/2。|J| = 1/2。f_{U,V}(u, v) = f((u+v)/2, (u-v)/2) × 1/2。'
      },
      {
        id: 'n-dimensional-random-variable',
        name: 'n维随机变量',
        category: '推广',
        definition: '设 X₁, X₂, ..., Xₙ 是定义在同一样本空间上的 n 个随机变量，则 X = (X₁, X₂, ..., Xₙ) 称为 n 维随机变量或 n 维随机向量。其联合分布函数为 F(x₁, x₂, ..., xₙ) = P(X₁ ≤ x₁, X₂ ≤ x₂, ..., Xₙ ≤ xₙ)。',
        plainTranslation: 'n 维随机变量是二维的自然推广。从"两个变量的联合行为"推广到"n 个变量的联合行为"。比如研究一个人的身高、体重、血压、心率等多个指标。',
        whyNeedIt: '实际问题往往涉及多个变量。n 维随机变量提供了研究多元数据的数学框架。',
        formula: 'F(x_1, x_2, \\ldots, x_n) = P(X_1 \\le x_1, X_2 \\le x_2, \\ldots, X_n \\le x_n)',
        example: '研究某班级学生的语文、数学、英语成绩，(X₁, X₂, X₃) 是三维随机变量。'
      },
      {
        id: 'n-dimensional-independence',
        name: 'n个随机变量的独立性',
        category: '推广',
        definition: 'n 个随机变量 X₁, X₂, ..., Xₙ 相互独立，当且仅当其联合分布函数等于各边缘分布函数的乘积：F(x₁, ..., xₙ) = F_{X₁}(x₁)·F_{X₂}(x₂)·...·F_{Xₙ}(xₙ)。等价地，联合密度/分布律等于各边缘密度/分布律的乘积。',
        plainTranslation: 'n 个变量相互独立意味着：知道任何一部分变量的值，不会影响其他变量的分布。数学上，联合分布"分解"成各边缘分布的乘积。',
        whyNeedIt: 'n 维独立性是多元统计分析的基础假设。独立时，联合分布的计算大大简化。',
        formula: 'F(x_1, \\ldots, x_n) = \\prod_{i=1}^n F_{X_i}(x_i)',
        example: 'n 次独立伯努利试验的结果 X₁, X₂, ..., Xₙ 相互独立。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter13',
    name: '第十三章 随机变量的数字特征',
    concepts: [
      {
        id: 'mathematical-expectation',
        name: '数学期望',
        category: '数学期望',
        definition: '设离散型随机变量 X 的分布律为 P(X = xₖ) = pₖ。若级数 Σ|xₖ|·pₖ 收敛，则称 E(X) = Σxₖ·pₖ 为 X 的数学期望或均值。设连续型随机变量 X 的密度为 f(x)。若积分 ∫|x|·f(x)dx 收敛，则称 E(X) = ∫₋∞^+∞ x·f(x)dx 为 X 的数学期望。',
        plainTranslation: '数学期望就是"长期平均值"。掷骰子，期望是3.5——虽然永远掷不出3.5点，但掷一万次、十万次，平均点数会越来越接近3.5。期望不是"最可能的值"，而是"大量重复试验后的平均值"。',
        whyNeedIt: '期望是描述随机变量"中心位置"的核心指标。它告诉我们：如果大量重复试验，平均结果会是多少。',
        formula: 'E(X) = \\sum_k x_k p_k \\quad \\text{或} \\quad E(X) = \\int_{-\\infty}^{+\\infty} x f(x) dx',
        example: '掷骰子，X 为点数。E(X) = 1×(1/6) + 2×(1/6) + ... + 6×(1/6) = 3.5。'
      },
      {
        id: 'expectation-properties',
        name: '数学期望的性质',
        category: '数学期望',
        definition: '数学期望具有以下性质：(1) E(c) = c（常数的期望是它本身）；(2) E(cX) = cE(X)（线性性）；(3) E(X + Y) = E(X) + E(Y)（可加性）；(4) 若 X, Y 独立，则 E(XY) = E(X)·E(Y)；(5) E(g(X)) = Σg(xₖ)·pₖ 或 ∫g(x)·f(x)dx。',
        plainTranslation: '期望的性质让计算变得简单：期望是线性的，和的期望等于期望的和（不需要独立）。但积的期望等于期望的积需要独立性。这些性质是计算复杂随机变量期望的基础。',
        whyNeedIt: '这些性质大大简化了期望的计算。特别是性质(3)，让我们能分解复杂问题。',
        formula: 'E(aX + bY) = aE(X) + bE(Y)',
        example: 'X ~ B(n, p)。E(X) = E(X₁ + X₂ + ... + Xₙ) = np，其中 Xᵢ 是第 i 次伯努利试验的结果。'
      },
      {
        id: 'expectation-of-function',
        name: '随机变量函数的期望',
        category: '数学期望',
        definition: '设 Y = g(X) 是随机变量 X 的函数。则 E(Y) = E(g(X)) 可直接计算：离散型 E(g(X)) = Σg(xₖ)·pₖ；连续型 E(g(X)) = ∫g(x)·f(x)dx。不需要先求 Y 的分布。',
        plainTranslation: '这个定理非常重要：求函数的期望不需要先求函数的分布！直接用 X 的分布对函数 g(x) 求期望即可。这大大简化了计算。',
        whyNeedIt: '这是概率论中最重要的定理之一。它避免了求随机变量函数分布的复杂过程。',
        formula: 'E(g(X)) = \\sum_k g(x_k) p_k \\quad \\text{或} \\quad E(g(X)) = \\int g(x) f(x) dx',
        example: 'X ~ U(0, 1)，求 E(X²)。直接计算：E(X²) = ∫₀¹ x²·1 dx = 1/3。不需要先求 Y = X² 的分布。'
      },
      {
        id: 'variance',
        name: '方差',
        category: '方差',
        definition: '设 X 是随机变量，若 E(X) 存在，则称 D(X) = Var(X) = E[(X - E(X))²] 为 X 的方差。方差的算术平方根 σ = √D(X) 称为标准差。',
        plainTranslation: '方差描述"数据有多分散"。方差大，说明取值分散、波动大；方差小，说明取值集中、波动小。比如两个班级平均分都是75分，A班方差大（成绩两极分化），B班方差小（成绩比较平均）。',
        whyNeedIt: '期望只告诉我们"中心在哪"，方差告诉我们"数据有多分散"。期望和方差一起，才能完整描述随机变量的分布特征。',
        formula: 'D(X) = E[(X - E(X))^2] = E(X^2) - [E(X)]^2',
        example: '掷骰子，E(X) = 3.5，E(X²) = (1² + 2² + ... + 6²)/6 = 91/6。D(X) = 91/6 - 3.5² = 35/12 ≈ 2.92。'
      },
      {
        id: 'variance-formula',
        name: '方差的计算公式',
        category: '方差',
        definition: '方差有几种等价形式：(1) D(X) = E[(X - E(X))²]（定义式）；(2) D(X) = E(X²) - [E(X)]²（计算式）；(3) D(X) = E(X²) - μ²，其中 μ = E(X)。',
        plainTranslation: '实际计算方差时，常用公式 D(X) = E(X²) - [E(X)]²。这个公式只需要计算 E(X) 和 E(X²)，比直接用定义式更方便。',
        whyNeedIt: '这个公式是计算方差的标准方法。它把方差转化为期望的计算问题。',
        formula: 'D(X) = E(X^2) - [E(X)]^2',
        example: 'X ~ U(a, b)。E(X) = (a+b)/2，E(X²) = (a² + ab + b²)/3。D(X) = (b-a)²/12。'
      },
      {
        id: 'variance-properties',
        name: '方差的性质',
        category: '方差',
        definition: '方差具有以下性质：(1) D(X) ≥ 0；(2) D(c) = 0（常数方差为0）；(3) D(cX) = c²D(X)；(4) D(X + c) = D(X)（平移不变）；(5) D(X ± Y) = D(X) + D(Y) ± 2Cov(X, Y)；(6) 若 X, Y 独立，则 D(X + Y) = D(X) + D(Y)。',
        plainTranslation: '方差的性质与期望不同：方差不是线性的！D(aX) = a²D(X)，不是 aD(X)。和的方差只有在独立时才等于方差的和。这个区别很重要。',
        whyNeedIt: '这些性质是计算复杂随机变量方差的基础。特别是性质(6)，独立随机变量的方差可加。',
        formula: 'D(aX + b) = a^2 D(X), \\quad D(X + Y) = D(X) + D(Y) + 2Cov(X, Y)',
        example: 'X ~ B(n, p)。X = X₁ + ... + Xₙ，Xᵢ 独立。D(X) = n·D(X₁) = np(1-p)。'
      },
      {
        id: 'standard-deviation',
        name: '标准差',
        category: '方差',
        definition: '标准差是方差的算术平方根：σ = √D(X)。标准差与随机变量 X 具有相同的量纲，而方差的量纲是 X²。',
        plainTranslation: '标准差是方差的"平方根版本"。它和原变量单位相同，更直观。比如身高单位是 cm，方差单位是 cm²，标准差单位是 cm。',
        whyNeedIt: '标准差比方差更直观，因为它与原变量单位一致。在数据分析中，常用"均值 ± 标准差"来描述数据分布。',
        formula: '\\sigma = \\sqrt{D(X)}',
        example: '身高 X ~ N(170, 10²)。方差 = 100 cm²，标准差 = 10 cm。我们说"平均身高170cm，标准差10cm"。'
      },
      {
        id: 'common-distribution-expectation-variance',
        name: '常用分布的期望与方差',
        category: '常用分布',
        definition: '常用分布的期望与方差：(1) 0-1分布 B(1, p)：E = p，D = p(1-p)；(2) 二项分布 B(n, p)：E = np，D = np(1-p)；(3) 泊松分布 P(λ)：E = λ，D = λ；(4) 均匀分布 U(a, b)：E = (a+b)/2，D = (b-a)²/12；(5) 指数分布 E(λ)：E = 1/λ，D = 1/λ²；(6) 正态分布 N(μ, σ²)：E = μ，D = σ²。',
        plainTranslation: '这些公式需要熟记！它们是概率计算的基础。注意泊松分布的期望等于方差，正态分布的参数 μ 和 σ² 就是期望和方差。',
        whyNeedIt: '记住这些公式可以快速计算，不需要每次都用定义推导。',
        formula: 'B(n,p): E=np, D=np(1-p); \\quad P(\\lambda): E=\\lambda, D=\\lambda; \\quad N(\\mu,\\sigma^2): E=\\mu, D=\\sigma^2',
        example: 'X ~ B(100, 0.3)。E(X) = 30，D(X) = 21。X ~ P(5)。E(X) = 5，D(X) = 5。'
      },
      {
        id: 'covariance',
        name: '协方差',
        category: '协方差与相关系数',
        definition: '设 X, Y 是两个随机变量，若 E(X), E(Y) 存在，则称 Cov(X, Y) = E[(X - E(X))(Y - E(Y))] 为 X 与 Y 的协方差。等价公式：Cov(X, Y) = E(XY) - E(X)E(Y)。',
        plainTranslation: '协方差描述两个变量"是否同向变化"。协方差为正：X大时Y也大，X小时Y也小（正相关）；协方差为负：X大时Y小（负相关）；协方差接近0：没有明显的线性关系。比如身高和体重的协方差为正——高个子通常更重。',
        whyNeedIt: '协方差是描述两个变量线性关系的核心指标。它是相关系数的基础，也是方差的推广（Cov(X, X) = D(X)）。',
        formula: 'Cov(X, Y) = E(XY) - E(X)E(Y)',
        example: 'X, Y 独立时，E(XY) = E(X)E(Y)，所以 Cov(X, Y) = 0。独立变量的协方差为0。'
      },
      {
        id: 'covariance-properties',
        name: '协方差的性质',
        category: '协方差与相关系数',
        definition: '协方差具有以下性质：(1) Cov(X, X) = D(X)；(2) Cov(X, Y) = Cov(Y, X)（对称性）；(3) Cov(aX, bY) = ab·Cov(X, Y)；(4) Cov(X₁ + X₂, Y) = Cov(X₁, Y) + Cov(X₂, Y)；(5) |Cov(X, Y)| ≤ √D(X)·√D(Y)（柯西-施瓦茨不等式）。',
        plainTranslation: '协方差是"双线性"的：对每个变量都是线性的。它把方差推广到两个变量的情况：Cov(X, X) = D(X)。',
        whyNeedIt: '这些性质是计算协方差的基础。特别是性质(4)，让我们能分解复杂问题。',
        formula: 'Cov(X_1 + X_2, Y) = Cov(X_1, Y) + Cov(X_2, Y)',
        example: 'D(X + Y) = D(X) + D(Y) + 2Cov(X, Y)。这个公式把方差和协方差联系起来。'
      },
      {
        id: 'correlation-coefficient',
        name: '相关系数',
        category: '协方差与相关系数',
        definition: '设 D(X) > 0，D(Y) > 0，则称 ρ_{XY} = Cov(X, Y) / [√D(X)·√D(Y)] 为 X 与 Y 的相关系数。相关系数是标准化后的协方差。',
        plainTranslation: '相关系数是"标准化"的协方差，取值在[-1, 1]之间。ρ = 1表示完全正相关（Y = aX + b，a > 0）；ρ = -1表示完全负相关；ρ = 0表示不相关。|ρ|越接近1，线性关系越强。比如身高和体重的相关系数约0.7，表示较强的正相关。',
        whyNeedIt: '协方差的值受量纲影响，难以比较不同变量对的相关程度。相关系数消除了量纲影响，取值范围固定，便于比较。',
        formula: '\\rho_{XY} = \\frac{Cov(X, Y)}{\\sqrt{D(X)} \\sqrt{D(Y)}} \\in [-1, 1]',
        example: '身高 X 和体重 Y 的相关系数 ρ = 0.7，表示较强的正相关。'
      },
      {
        id: 'correlation-properties',
        name: '相关系数的性质',
        category: '协方差与相关系数',
        definition: '相关系数具有以下性质：(1) |ρ| ≤ 1；(2) |ρ| = 1 当且仅当存在常数 a, b 使 P(Y = aX + b) = 1；(3) ρ = 0 表示 X 与 Y 不相关；(4) ρ 与量纲无关；(5) X 与 Y 独立 ⟹ ρ = 0，但 ρ = 0 不一定独立。',
        plainTranslation: '相关系数的性质：绝对值不超过1；等于±1表示完全线性相关；等于0表示不相关（无线性关系，但可能有非线性关系）。独立一定不相关，但不相关不一定独立。',
        whyNeedIt: '理解这些性质可以正确解读相关系数。特别要注意：不相关 ≠ 独立。',
        formula: '|\\rho| \\le 1, \\quad \\rho = \\pm 1 \\Leftrightarrow Y = aX + b',
        example: 'X ~ U(-1, 1)，Y = X²。Cov(X, Y) = 0（不相关），但 X 和 Y 不独立（Y 完全由 X 决定）。'
      },
      {
        id: 'independence-vs-uncorrelated',
        name: '独立与不相关的关系',
        category: '协方差与相关系数',
        definition: '若 X 与 Y 独立，则 Cov(X, Y) = 0，即 X 与 Y 不相关。但反之不成立：不相关不一定独立。只有对于二维正态分布，独立 ⟺ 不相关。',
        plainTranslation: '这是一个重要结论：独立比不相关更强。独立意味着完全没有关系，不相关只是没有线性关系。可能存在非线性关系使得不相关但非独立。',
        whyNeedIt: '理解独立与不相关的区别是概率论的重要知识点。考试中经常考察这个概念。',
        formula: 'X, Y \\text{ 独立} \\Rightarrow \\rho = 0, \\quad \\text{但} \\rho = 0 \\not\\Rightarrow X, Y \\text{ 独立}',
        example: 'X ~ U(-1, 1)，Y = X²。E(X) = 0，E(XY) = E(X³) = 0，Cov(X, Y) = 0。但不独立，因为 Y 完全由 X 决定。'
      },
      {
        id: 'moment',
        name: '矩',
        category: '矩',
        definition: '设 X 是随机变量，k 是正整数。若 E(Xᵏ) 存在，则称 E(Xᵏ) 为 X 的 k 阶原点矩，简称 k 阶矩。若 E[(X - E(X))ᵏ] 存在，则称 E[(X - E(X))ᵏ] 为 X 的 k 阶中心矩。',
        plainTranslation: '矩是期望和方差的推广。一阶原点矩是期望，二阶中心矩是方差。矩描述了分布的各个特征：位置、离散程度、偏斜程度、峰度等。',
        whyNeedIt: '矩是描述分布特征的统一框架。高阶矩可以描述分布的偏度和峰度等特征。',
        formula: '\\mu_k = E(X^k) \\text{（k阶原点矩）}, \\quad \\nu_k = E[(X - E(X))^k] \\text{（k阶中心矩）}',
        example: 'X ~ N(μ, σ²)。一阶原点矩 = μ，二阶中心矩 = σ²，三阶中心矩 = 0（对称），四阶中心矩 = 3σ⁴。'
      },
      {
        id: 'mixed-moment',
        name: '混合矩',
        category: '矩',
        definition: '设 X, Y 是随机变量，k, l 是正整数。若 E(XᵏYˡ) 存在，则称 E(XᵏYˡ) 为 X 和 Y 的 k+l 阶混合原点矩。若 E[(X - E(X))ᵏ(Y - E(Y))ˡ] 存在，则称其为 k+l 阶混合中心矩。',
        plainTranslation: '混合矩是矩在多维情形的推广。协方差 Cov(X, Y) = E[(X-μ_X)(Y-μ_Y)] 就是二阶混合中心矩。',
        whyNeedIt: '混合矩描述多个变量之间的联合特征。协方差是最常用的混合矩。',
        formula: 'Cov(X, Y) = E[(X - E(X))(Y - E(Y))] \\text{（二阶混合中心矩）}',
        example: '二维随机变量 (X, Y) 的二阶混合中心矩就是协方差。'
      },
      {
        id: 'covariance-matrix',
        name: '协方差矩阵',
        category: '矩',
        definition: '设 X = (X₁, X₂, ..., Xₙ)ᵀ 是 n 维随机向量。协方差矩阵 Σ 是 n×n 矩阵，其元素 Σᵢⱼ = Cov(Xᵢ, Xⱼ)。对角线元素 Σᵢᵢ = D(Xᵢ) 是方差，非对角线元素是协方差。',
        plainTranslation: '协方差矩阵把所有方差和协方差组织成一个矩阵。对角线上是各变量的方差，非对角线上是两两协方差。它是多维数据分析的核心工具。',
        whyNeedIt: '协方差矩阵是多元统计分析的基础。主成分分析、因子分析等方法都基于协方差矩阵。',
        formula: '\\Sigma = \\begin{pmatrix} D(X_1) & Cov(X_1, X_2) & \\cdots \\\\ Cov(X_2, X_1) & D(X_2) & \\cdots \\\\ \\vdots & \\vdots & \\ddots \\end{pmatrix}',
        example: '(X₁, X₂) 的协方差矩阵 = [[D(X₁), Cov(X₁,X₂)], [Cov(X₂,X₁), D(X₂)]]。'
      },
      {
        id: 'covariance-matrix-properties',
        name: '协方差矩阵的性质',
        category: '矩',
        definition: '协方差矩阵 Σ 具有以下性质：(1) Σ 是对称矩阵；(2) Σ 是半正定矩阵；(3) 若 X₁, ..., Xₙ 相互独立，则 Σ 是对角矩阵；(4) 对于线性变换 Y = AX + b，Σ_Y = AΣ_XAᵀ。',
        plainTranslation: '协方差矩阵是对称半正定的。这个性质很重要：半正定保证了协方差矩阵的"合理性"。独立变量的协方差矩阵是对角的（只有方差，没有协方差）。',
        whyNeedIt: '这些性质在多元统计推断中非常重要。特别是线性变换的性质，让我们能推导变换后变量的协方差结构。',
        formula: 'Y = AX + b \\Rightarrow \\Sigma_Y = A \\Sigma_X A^T',
        example: 'X 的协方差矩阵 Σ，Y = 2X。Σ_Y = 4Σ（每个元素乘以4）。'
      },
      {
        id: 'chebyshev-inequality',
        name: '切比雪夫不等式',
        category: '不等式',
        definition: '设随机变量 X 的期望为 μ，方差为 σ²。则对于任意 ε > 0，有 P(|X - μ| ≥ ε) ≤ σ²/ε²。等价地，P(|X - μ| < ε) ≥ 1 - σ²/ε²。',
        plainTranslation: '切比雪夫不等式给出了"偏离均值的概率上界"：偏离越远，概率越小。虽然这个界通常很松，但它不需要知道具体分布，只用期望和方差。',
        whyNeedIt: '切比雪夫不等式是概率论中最重要的不等式之一。它是大数定律证明的基础，也是理解方差意义的工具。',
        formula: 'P(|X - \\mu| \\ge \\varepsilon) \\le \\frac{\\sigma^2}{\\varepsilon^2}',
        example: 'X 的方差 σ² = 4。P(|X - μ| ≥ 6) ≤ 4/36 = 1/9。不管 X 是什么分布，偏离均值超过6的概率不超过1/9。'
      },
      {
        id: 'markov-inequality',
        name: '马尔可夫不等式',
        category: '不等式',
        definition: '设 X 是非负随机变量，则对于任意 a > 0，有 P(X ≥ a) ≤ E(X)/a。',
        plainTranslation: '马尔可夫不等式是切比雪夫不等式的基础。它说：非负随机变量取大值的概率有上界。期望越大，取大值的概率越大；阈值 a 越大，超过阈值的概率越小。',
        whyNeedIt: '马尔可夫不等式是概率论中最基本的不等式之一。它只需要期望，不需要方差，适用于任何非负随机变量。',
        formula: 'P(X \\ge a) \\le \\frac{E(X)}{a}',
        example: 'X 是非负随机变量，E(X) = 2。P(X ≥ 10) ≤ 2/10 = 0.2。'
      },
      {
        id: 'jensen-inequality',
        name: '琴生不等式',
        category: '不等式',
        definition: '设 f 是凸函数，X 是随机变量。则 E(f(X)) ≥ f(E(X))。若 f 是凹函数，则 E(f(X)) ≤ f(E(X))。',
        plainTranslation: '琴生不等式描述了期望和函数的关系：对于凸函数，函数的期望 ≥ 期望的函数。直观理解：凸函数"向上弯"，所以平均值处的函数值小于函数值的平均。',
        whyNeedIt: '琴生不等式在概率论、统计学、信息论中有广泛应用。它是证明很多重要结论的工具。',
        formula: 'f \\text{ 凸} \\Rightarrow E(f(X)) \\ge f(E(X))',
        example: 'f(x) = x² 是凸函数。E(X²) ≥ [E(X)]²，即 E(X²) - [E(X)]² = D(X) ≥ 0。这证明了方差非负。'
      },
      {
        id: 'cauchy-schwarz-inequality',
        name: '柯西-施瓦茨不等式',
        category: '不等式',
        definition: '对于任意随机变量 X, Y，有 |E(XY)|² ≤ E(X²)·E(Y²)。等号成立当且仅当存在常数 a, b 使得 P(aX + bY = 0) = 1。',
        plainTranslation: '柯西-施瓦茨不等式给出了乘积期望的上界。它说明：两个随机变量的乘积期望不超过各自平方期望乘积的平方根。这是协方差上界的来源。',
        whyNeedIt: '柯西-施瓦茨不等式是概率论中最重要不等式之一。它证明了相关系数的绝对值不超过1。',
        formula: '|E(XY)| \\le \\sqrt{E(X^2) \\cdot E(Y^2)}',
        example: '令 X\' = X - E(X)，Y\' = Y - E(Y)。|Cov(X, Y)| ≤ √D(X)·√D(Y)，即 |ρ| ≤ 1。'
      },
      {
        id: 'conditional-expectation',
        name: '条件期望',
        category: '条件期望',
        definition: '设 (X, Y) 是二维随机变量。在 Y = y 条件下 X 的条件期望定义为 E(X|Y = y) = Σxᵢ·P(X = xᵢ|Y = y)（离散型）或 E(X|Y = y) = ∫x·f_{X|Y}(x|y)dx（连续型）。',
        plainTranslation: '条件期望就是"已知 Y = y 时 X 的期望"。它是一个关于 y 的函数，描述了 X 的期望如何随 Y 变化。比如已知身高求体重的期望。',
        whyNeedIt: '条件期望是回归分析的基础。最小二乘回归就是用条件期望来预测。',
        formula: 'E(X|Y = y) = \\int x \\cdot f_{X|Y}(x|y) dx',
        example: '(X, Y) ~ 二维正态。E(X|Y = y) = μ_X + ρ(σ_X/σ_Y)(y - μ_Y)。这是线性回归的公式。'
      },
      {
        id: 'conditional-expectation-properties',
        name: '条件期望的性质',
        category: '条件期望',
        definition: '条件期望具有以下性质：(1) E(E(X|Y)) = E(X)（全期望公式）；(2) E(g(Y)|Y) = g(Y)；(3) E(X·g(Y)|Y) = g(Y)·E(X|Y)；(4) 若 X, Y 独立，则 E(X|Y) = E(X)。',
        plainTranslation: '条件期望最重要的性质是全期望公式：条件期望的期望等于无条件期望。这就像"分情况讨论"的数学表达：各种情况的加权平均等于总体平均。',
        whyNeedIt: '全期望公式是计算复杂期望的有力工具。它让我们能"分层次"计算期望。',
        formula: 'E(E(X|Y)) = E(X)',
        example: '工厂产量 X 取决于机器状态 Y。E(X) = E(E(X|Y)) = P(Y=好)·E(X|Y=好) + P(Y=坏)·E(X|Y=坏)。'
      },
      {
        id: 'law-of-total-expectation',
        name: '全期望公式',
        category: '条件期望',
        definition: '设 X, Y 是随机变量，E(X) 存在。则 E(X) = E(E(X|Y))。离散形式：E(X) = Σᵢ P(Y = yᵢ)·E(X|Y = yᵢ)。连续形式：E(X) = ∫ E(X|Y = y)·f_Y(y)dy。',
        plainTranslation: '全期望公式是"分情况求期望"的数学表达。把 Y 的各种情况作为条件，分别求条件期望，再加权平均，就得到无条件期望。这是"分而治之"的思想。',
        whyNeedIt: '全期望公式是概率论中最重要的公式之一。它大大简化了很多期望的计算。',
        formula: 'E(X) = E(E(X|Y)) = \\sum_i P(Y = y_i) \\cdot E(X|Y = y_i)',
        example: '商店顾客数 N ~ P(λ)，每位顾客购买金额 Xᵢ ~ E(μ)。总销售额 S = ΣXᵢ。E(S) = E(E(S|N)) = E(N·E(X)) = λ/μ。'
      },
      {
        id: 'conditional-variance',
        name: '条件方差',
        category: '条件期望',
        definition: '在 Y = y 条件下 X 的条件方差定义为 D(X|Y = y) = E[(X - E(X|Y = y))²|Y = y] = E(X²|Y = y) - [E(X|Y = y)]²。',
        plainTranslation: '条件方差描述"已知 Y = y 时 X 的波动程度"。它是条件分布的方差，衡量在固定 Y 时 X 的不确定性。',
        whyNeedIt: '条件方差在统计推断中有重要应用。它描述了预测的不确定性。',
        formula: 'D(X|Y = y) = E(X^2|Y = y) - [E(X|Y = y)]^2',
        example: '(X, Y) ~ 二维正态。D(X|Y = y) = σ_X²(1 - ρ²)。已知 Y 时，X 的方差减小了。'
      },
      {
        id: 'law-of-total-variance',
        name: '全方差公式',
        category: '条件期望',
        definition: '设 X, Y 是随机变量，则 D(X) = E(D(X|Y)) + D(E(X|Y))。即总方差 = 条件方差的期望 + 条件期望的方差。',
        plainTranslation: '全方差公式把总方差分解成两部分：一部分是"条件内的平均波动"（E(D(X|Y))），另一部分是"条件间的波动"（D(E(X|Y))）。这就像把总变异分解为组内变异和组间变异。',
        whyNeedIt: '全方差公式是方差分析（ANOVA）的理论基础。它让我们理解方差的来源。',
        formula: 'D(X) = E(D(X|Y)) + D(E(X|Y))',
        example: '学生成绩 X，班级 Y。总方差 = 班级内方差的平均 + 班级平均分的方差。前者是班级内部差异，后者是班级间差异。'
      },
      {
        id: 'correlation-coefficient-interpretation',
        name: '相关系数的解释',
        category: '协方差与相关系数',
        definition: '相关系数 ρ 的解释：ρ > 0 表示正相关（X 大 Y 也大）；ρ < 0 表示负相关（X 大 Y 小）；|ρ| 接近 1 表示强相关；|ρ| 接近 0 表示弱相关。一般：|ρ| < 0.3 弱相关，0.3 ≤ |ρ| < 0.7 中等相关，|ρ| ≥ 0.7 强相关。',
        plainTranslation: '相关系数衡量线性关系的强度。正相关是一个增另一个也增，负相关是一个增另一个减。但注意：相关系数只衡量线性关系，非线性关系可能被忽略。',
        whyNeedIt: '正确解释相关系数是数据分析的基本技能。它帮助我们理解变量之间的关系。',
        example: '身高和体重的相关系数约 0.7，强正相关。学习时间和成绩的相关系数约 0.5，中等正相关。'
      },
      {
        id: 'skewness',
        name: '偏度',
        category: '高阶矩',
        definition: '偏度是三阶标准化中心矩：γ₁ = E[(X - μ)³] / σ³ = ν₃ / σ³。偏度描述分布的不对称程度：γ₁ > 0 右偏（正偏），γ₁ < 0 左偏（负偏），γ₁ = 0 对称。',
        plainTranslation: '偏度描述分布"歪向哪边"。右偏意味着右边有长尾（大值少但很大），左偏意味着左边有长尾（小值少但很小）。正态分布偏度为0，是对称的。',
        whyNeedIt: '偏度是描述分布形状的重要指标。它补充了期望和方差，让我们更全面地了解分布。',
        formula: '\\gamma_1 = \\frac{E[(X - \\mu)^3]}{\\sigma^3}',
        example: '收入分布通常是右偏的：大多数人收入中等，少数人收入很高，形成右边的长尾。'
      },
      {
        id: 'kurtosis',
        name: '峰度',
        category: '高阶矩',
        definition: '峰度是四阶标准化中心矩减3：γ₂ = E[(X - μ)⁴] / σ⁴ - 3 = ν₄ / σ⁴ - 3。峰度描述分布的"尖峭程度"：γ₂ > 0 比正态更尖（厚尾），γ₂ < 0 比正态更平（薄尾），γ₂ = 0 与正态相同。',
        plainTranslation: '峰度描述分布"有多尖"。高峰度意味着分布中心很尖、尾部很厚（极端值多）。低峰度意味着分布平坦。正态分布的峰度为0（作为基准）。',
        whyNeedIt: '峰度是风险评估的重要指标。高峰度意味着极端事件（大涨大跌）更可能发生。',
        formula: '\\gamma_2 = \\frac{E[(X - \\mu)^4]}{\\sigma^4} - 3',
        example: '股票收益率通常有正峰度：大多数时候波动小，但偶尔有极端涨跌。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter14',
    name: '第十四章 大数定律及中心极限定理',
    concepts: [
      {
        id: 'convergence-in-probability',
        name: '依概率收敛',
        category: '收敛性',
        definition: '设 {Xₙ} 是随机变量序列，X 是随机变量。若对于任意 ε > 0，有 lim(n→∞) P(|Xₙ - X| < ε) = 1，则称 {Xₙ} 依概率收敛于 X，记作 Xₙ →ₚ X。',
        plainTranslation: '依概率收敛说的是：当n越来越大时，Xₙ与X的差距小于任意小正数ε的概率趋向于1。比如掷硬币n次，正面频率fₙ依概率收敛于0.5——无论你要求多接近（ε多小），只要n足够大，|fₙ - 0.5| < ε的概率就接近1。',
        whyNeedIt: '依概率收敛是大数定律的理论基础。它描述了随机变量序列"大概率稳定趋近"某个值的现象。',
        formula: 'X_n \\xrightarrow{P} X \\Leftrightarrow \\forall \\varepsilon > 0: \\lim_{n \\to \\infty} P(|X_n - X| < \\varepsilon) = 1',
        example: '掷硬币 n 次，正面频率 fₙ 依概率收敛于 0.5。无论你要求多接近（ε多小），只要 n 足够大，|fₙ - 0.5| < ε 的概率就接近 1。'
      },
      {
        id: 'almost-sure-convergence',
        name: '几乎必然收敛',
        category: '收敛性',
        definition: '设 {Xₙ} 是随机变量序列，X 是随机变量。若 P(lim(n→∞) Xₙ = X) = 1，即 Xₙ 收敛于 X 的概率为 1，则称 {Xₙ} 几乎必然收敛于 X，记作 Xₙ →ₐ.s. X。',
        plainTranslation: '几乎必然收敛比依概率收敛更强：它要求 Xₙ 收敛于 X 这件事"几乎一定发生"（概率为1）。形象地说，"几乎必然"意味着"不收敛的那些情况加起来的概率为0"。',
        whyNeedIt: '几乎必然收敛是概率论中最强的收敛形式之一。强大数定律就是几乎必然收敛的形式，比弱大数定律更强。',
        formula: 'X_n \\xrightarrow{a.s.} X \\Leftrightarrow P(\\lim_{n \\to \\infty} X_n = X) = 1',
        example: '强大数定律：掷硬币 n 次，正面频率 fₙ 几乎必然收敛于 0.5。这意味着"频率不收敛于0.5"的概率为0。'
      },
      {
        id: 'convergence-in-distribution',
        name: '依分布收敛',
        category: '收敛性',
        definition: '设 {Xₙ} 是随机变量序列，分布函数为 {Fₙ(x)}，X 的分布函数为 F(x)。若在 F(x) 的所有连续点 x 处，有 lim(n→∞) Fₙ(x) = F(x)，则称 {Xₙ} 依分布收敛于 X，记作 Xₙ →ₗ X。',
        plainTranslation: '依分布收敛是最弱的收敛形式：它只要求分布函数收敛，不要求随机变量本身收敛。这意味着 Xₙ 的"行为模式"越来越像 X。',
        whyNeedIt: '依分布收敛是中心极限定理的基础。它描述了随机变量序列的分布如何趋近某个极限分布。',
        formula: 'X_n \\xrightarrow{L} X \\Leftrightarrow F_n(x) \\to F(x) \\text{ 在 } F \\text{ 连续点}',
        example: '中心极限定理：标准化后的样本均值依分布收敛于标准正态分布。'
      },
      {
        id: 'convergence-relationships',
        name: '收敛性的关系',
        category: '收敛性',
        definition: '三种收敛的关系：(1) 几乎必然收敛 ⟹ 依概率收敛 ⟹ 依分布收敛；(2) 反之不成立。即：Xₙ →ₐ.s. X ⟹ Xₙ →ₚ X ⟹ Xₙ →ₗ X。',
        plainTranslation: '收敛性有强弱之分：几乎必然收敛最强，依概率收敛次之，依分布收敛最弱。强收敛一定推出弱收敛，但弱收敛推不出强收敛。',
        whyNeedIt: '理解收敛性的关系有助于选择合适的收敛形式。不同定理使用不同的收敛，对应不同的结论强度。',
        formula: 'a.s. \\Rightarrow P \\Rightarrow L',
        example: '强大数定律（几乎必然收敛）比弱大数定律（依概率收敛）结论更强，但条件也更强。'
      },
      {
        id: 'weak-law-of-large-numbers',
        name: '弱大数定律',
        category: '大数定律',
        definition: '设 X₁, X₂, ... 是独立同分布的随机变量序列，E(Xᵢ) = μ 存在。则样本均值 X̄ₙ = (X₁ + ... + Xₙ)/n 依概率收敛于 μ，即 ∀ε > 0: lim(n→∞) P(|X̄ₙ - μ| < ε) = 1。',
        plainTranslation: '弱大数定律说的是：样本均值会"大概率接近"总体均值。比如测量某物体长度n次，当n很大时，平均测量值大概率接近真实长度。样本量越大，样本均值落在总体均值附近的概率越大。',
        whyNeedIt: '弱大数定律是统计学的基础。它保证了用样本均值估计总体均值的合理性——样本量越大，估计越准确。',
        formula: '\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\mu',
        example: '测量某物体长度 n 次，测量值 X₁, ..., Xₙ 独立同分布。弱大数定律保证：当 n 很大时，平均测量值大概率接近真实长度。'
      },
      {
        id: 'chebyshev-weak-law',
        name: '切比雪夫大数定律',
        category: '大数定律',
        definition: '设 X₁, X₂, ... 是两两不相关的随机变量序列，E(Xᵢ) = μᵢ，D(Xᵢ) ≤ C（方差一致有界）。则 (X₁ + ... + Xₙ)/n - (μ₁ + ... + μₙ)/n 依概率收敛于 0。',
        plainTranslation: '切比雪夫大数定律是弱大数定律的一种形式，它只需要两两不相关和方差有界，不需要同分布。条件更宽松，应用更广泛。',
        whyNeedIt: '切比雪夫大数定律是证明弱大数定律的重要工具。它展示了切比雪夫不等式的应用。',
        formula: '\\frac{1}{n}\\sum_{i=1}^n X_i - \\frac{1}{n}\\sum_{i=1}^n \\mu_i \\xrightarrow{P} 0',
        example: '不同测量工具测量同一物体，测量值方差有界但不一定同分布。切比雪夫大数定律保证平均测量值仍然收敛。'
      },
      {
        id: 'khinchin-weak-law',
        name: '辛钦大数定律',
        category: '大数定律',
        definition: '设 X₁, X₂, ... 是独立同分布的随机变量序列，E(Xᵢ) = μ 存在（方差可以不存在）。则样本均值 X̄ₙ 依概率收敛于 μ。',
        plainTranslation: '辛钦大数定律是弱大数定律的另一种形式。它只要求期望存在，不要求方差存在，条件比切比雪夫大数定律更宽松。',
        whyNeedIt: '辛钦大数定律说明：只要期望存在，样本均值就会收敛。这扩大了大数定律的适用范围。',
        formula: '\\bar{X}_n \\xrightarrow{P} \\mu \\text{（仅需 } E(X) \\text{ 存在）}',
        example: '某些重尾分布（如柯西分布）方差不存在，但如果期望存在，辛钦大数定律仍然适用。'
      },
      {
        id: 'strong-law-of-large-numbers',
        name: '强大数定律',
        category: '大数定律',
        definition: '设 X₁, X₂, ... 是独立同分布的随机变量序列，E(Xᵢ) = μ 存在。则样本均值 X̄ₙ 几乎必然收敛于 μ，即 P(lim(n→∞) X̄ₙ = μ) = 1。',
        plainTranslation: '强大数定律比弱大数定律更强：它说样本均值"几乎一定"收敛于总体均值，而不是"大概率"收敛。这意味着"不收敛"的概率为0。',
        whyNeedIt: '强大数定律是大数定律的最强形式。它为频率解释概率提供了更坚实的理论基础。',
        formula: 'P(\\lim_{n \\to \\infty} \\bar{X}_n = \\mu) = 1',
        example: '掷硬币无数次，正面频率"几乎一定"等于 0.5。虽然理论上可能出现频率不等于0.5的情况，但这种情况发生的概率为0。'
      },
      {
        id: 'bernoulli-law-of-large-numbers',
        name: '伯努利大数定律',
        category: '大数定律',
        definition: '设 nₐ 为 n 次独立伯努利试验中成功的次数，p 为每次试验成功的概率。则 nₐ/n 依概率收敛于 p，即 ∀ε > 0: lim(n→∞) P(|nₐ/n - p| < ε) = 1。',
        plainTranslation: '伯努利大数定律是大数定律最早的形式，由伯努利在1713年证明。它说：频率收敛于概率。这是"概率的频率解释"的数学基础。',
        whyNeedIt: '伯努利大数定律是概率论发展史上的里程碑。它首次严格证明了"频率稳定于概率"这一直观认识。',
        formula: '\\frac{n_A}{n} \\xrightarrow{P} p',
        example: '掷硬币 n 次，正面出现的频率 nₐ/n 依概率收敛于 0.5。这解释了为什么大量掷硬币后，正面频率接近一半。'
      },
      {
        id: 'central-limit-theorem',
        name: '中心极限定理',
        category: '中心极限定理',
        definition: '设 X₁, X₂, ... 是独立同分布的随机变量序列，E(Xᵢ) = μ，D(Xᵢ) = σ² > 0。则标准化随机变量 Zₙ = √n(X̄ₙ - μ)/σ 依分布收敛于标准正态分布 N(0, 1)。即 lim(n→∞) P(Zₙ ≤ z) = Φ(z)。',
        plainTranslation: '中心极限定理是概率论最重要的定理：大量独立随机变量的和（或均值）经过标准化后近似服从正态分布，无论原来是什么分布！比如掷骰子n次，点数之和近似正态分布，虽然每次掷骰子服从均匀分布。这解释了为什么正态分布如此普遍。',
        whyNeedIt: '中心极限定理是统计推断的理论基础。它让我们能用正态分布来近似各种统计量的分布，大大简化了计算。没有它，我们无法进行区间估计和假设检验。',
        formula: '\\sqrt{n}\\frac{\\bar{X}_n - \\mu}{\\sigma} \\xrightarrow{L} N(0, 1)',
        example: '掷骰子 n 次，点数之和 Sₙ。无论 n 多大，(Sₙ - 3.5n)/(√n × √(35/12)) 近似服从 N(0, 1)。'
      },
      {
        id: 'lindeberg-levy-clt',
        name: '林德伯格-莱维定理',
        category: '中心极限定理',
        definition: '设 X₁, X₂, ... 是独立同分布的随机变量序列，E(Xᵢ) = μ，D(Xᵢ) = σ² > 0。则 √n(X̄ₙ - μ)/σ 依分布收敛于 N(0, 1)。这是中心极限定理的经典形式。',
        plainTranslation: '林德伯格-莱维定理是中心极限定理最常用的形式，要求独立同分布且方差有限。它是最早被严格证明的中心极限定理形式。',
        whyNeedIt: '这是应用最广泛的中心极限定理形式。大多数实际问题都满足独立同分布条件。',
        formula: '\\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{L} N(0, 1)',
        example: '测量某量 n 次，测量误差独立同分布。n 很大时，总误差近似正态分布。'
      },
      {
        id: 'lyapunov-clt',
        name: '李雅普诺夫定理',
        category: '中心极限定理',
        definition: '设 X₁, X₂, ... 是相互独立的随机变量序列，E(Xᵢ) = μᵢ，D(Xᵢ) = σᵢ²。若存在 δ > 0 使得 lim(n→∞) ΣᵢE|Xᵢ - μᵢ|^(2+δ) / (Σᵢσᵢ²)^((2+δ)/2) = 0（李雅普诺夫条件），则 Σᵢ(Xᵢ - μᵢ)/√(Σᵢσᵢ²) 依分布收敛于 N(0, 1)。',
        plainTranslation: '李雅普诺夫定理是中心极限定理的推广形式，不要求同分布。只要各随机变量的"高阶矩"相对于方差足够小，和就近似正态分布。',
        whyNeedIt: '李雅普诺夫定理放宽了同分布条件，扩大了中心极限定理的适用范围。',
        formula: '\\frac{\\sum_{i=1}^n (X_i - \\mu_i)}{\\sqrt{\\sum_{i=1}^n \\sigma_i^2}} \\xrightarrow{L} N(0, 1)',
        example: '多个不同来源的误差叠加，每个误差分布不同。李雅普诺夫定理保证总误差近似正态分布。'
      },
      {
        id: 'lindeberg-clt',
        name: '林德伯格定理',
        category: '中心极限定理',
        definition: '设 X₁, X₂, ... 是相互独立的随机变量序列。若满足林德伯格条件：∀ε > 0，lim(n→∞) ΣᵢE[(Xᵢ - μᵢ)²·I(|Xᵢ - μᵢ| > εsₙ)] / sₙ² = 0，其中 sₙ² = Σᵢσᵢ²，则 Σᵢ(Xᵢ - μᵢ)/sₙ 依分布收敛于 N(0, 1)。',
        plainTranslation: '林德伯格定理是中心极限定理最一般的形式。林德伯格条件要求：每个随机变量相对于总和来说"不太大"，即没有单个变量主导整个和。',
        whyNeedIt: '林德伯格定理是独立随机变量中心极限定理的最一般形式，其他形式都是它的特例。',
        formula: '\\text{林德伯格条件：单个变量对总和的贡献"均匀小"}',
        example: '保险公司的总赔付额：每个保单的赔付是独立的随机变量。如果单个保单不会造成巨额赔付（林德伯格条件），总赔付近似正态分布。'
      },
      {
        id: 'de-moivre-laplace-theorem',
        name: '棣莫弗-拉普拉斯定理',
        category: '中心极限定理',
        definition: '设 Yₙ ~ B(n, p)，则当 n → ∞ 时，(Yₙ - np)/√(np(1-p)) 依分布收敛于 N(0, 1)。即二项分布经标准化后收敛于标准正态分布。',
        plainTranslation: '棣莫弗-拉普拉斯定理是中心极限定理最早的形式，专门针对二项分布。它说：当 n 很大时，二项分布可以用正态分布近似。',
        whyNeedIt: '这个定理是历史上第一个中心极限定理，为正态分布在统计学中的核心地位奠定了基础。',
        formula: '\\frac{Y_n - np}{\\sqrt{np(1-p)}} \\xrightarrow{L} N(0, 1)',
        example: '掷硬币 100 次，正面次数 Y₁₀₀ ~ B(100, 0.5)。P(Y₁₀₀ ≤ 60) ≈ Φ((60.5 - 50)/√25) ≈ Φ(2.1) ≈ 0.982。'
      },
      {
        id: 'normal-approximation-binomial',
        name: '二项分布的正态近似',
        category: '中心极限定理应用',
        definition: '当 n 较大且 p 不太接近 0 或 1 时，二项分布 B(n, p) 可用正态分布 N(np, np(1-p)) 近似。通常要求 np ≥ 5 且 n(1-p) ≥ 5。为提高精度，常用连续性修正：P(Yₙ ≤ k) ≈ Φ((k + 0.5 - np)/√(np(1-p)))。',
        plainTranslation: '二项分布的正态近似是棣莫弗-拉普拉斯定理的实际应用。当 n 大、p 适中时，用正态分布近似二项分布计算概率很方便。',
        whyNeedIt: '二项分布的概率计算在 n 大时很麻烦，正态近似提供了简便的计算方法。',
        formula: 'P(Y_n \\le k) \\approx \\Phi\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right)',
        example: '某产品次品率 2%，抽检 200 件。次品数 Y ~ B(200, 0.02)。P(Y ≤ 3) ≈ Φ((3.5 - 4)/√3.92) ≈ Φ(-0.25) ≈ 0.401。'
      },
      {
        id: 'continuity-correction',
        name: '连续性修正',
        category: '中心极限定理应用',
        definition: '用连续分布（正态）近似离散分布（二项）时，为提高精度进行的修正。对于整数 k：P(Y = k) ≈ Φ((k + 0.5 - μ)/σ) - Φ((k - 0.5 - μ)/σ)；P(Y ≤ k) ≈ Φ((k + 0.5 - μ)/σ)。',
        plainTranslation: '连续性修正是"填补离散点之间的空隙"。因为正态分布是连续的，二项分布是离散的，直接近似会有误差。加减 0.5 相当于把离散点"扩展"成小区间。',
        whyNeedIt: '连续性修正显著提高了正态近似的精度，特别是在概率值较小或 n 不太大时。',
        formula: 'P(Y = k) \\approx \\Phi\\left(\\frac{k + 0.5 - \\mu}{\\sigma}\\right) - \\Phi\\left(\\frac{k - 0.5 - \\mu}{\\sigma}\\right)',
        example: 'Y ~ B(20, 0.5)。精确值 P(Y = 10) = C(20,10)×0.5²⁰ ≈ 0.176。正态近似（无修正）：≈ 0。有修正：≈ Φ(0.22) - Φ(-0.22) ≈ 0.174。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter15',
    name: '第十五章 样本及抽样分布',
    concepts: [
      {
        id: 'population-and-sample',
        name: '总体与样本',
        category: '基本概念',
        definition: '总体是研究对象的全体，样本是从总体中抽取的若干个体的集合。总体分布 F 称为理论分布，样本是总体的"缩影"，用于推断总体。',
        plainTranslation: '总体就是"所有研究对象"，样本就是"抽出来研究的那部分"。比如研究全国成年男性身高，总体是全中国所有成年男性（几亿人），样本是随机抽取的1000人。我们无法测量所有人，但可以通过样本推断总体。',
        whyNeedIt: '总体与样本是统计学的基本概念。因为总体通常太大或难以完全观测，我们需要通过样本推断总体——这就是统计学的核心任务。',
        example: '研究某工厂产品合格率。总体是该工厂所有产品（可能几万件），样本是随机抽取的100件产品。'
      },
      {
        id: 'sample',
        name: '样本',
        category: '基本概念',
        definition: '从总体 X 中随机抽取的 n 个个体 X₁, X₂, ..., Xₙ 称为样本，n 称为样本容量。样本是随机变量，其观测值 x₁, x₂, ..., xₙ 称为样本值。',
        plainTranslation: '样本是"从总体中抽出来的代表"。在抽样之前，样本是随机变量（不知道会抽到什么）；抽样之后，样本值是具体的数值。',
        whyNeedIt: '样本是统计推断的基础数据。我们通过样本的统计量来推断总体的参数。',
        example: '从某班级随机抽取10名学生，他们的成绩 X₁, ..., X₁₀ 是样本。观测值可能是 (85, 72, 90, ..., 78)。'
      },
      {
        id: 'simple-random-sample',
        name: '简单随机样本',
        category: '基本概念',
        definition: '若样本 X₁, X₂, ..., Xₙ 满足：(1) X₁, ..., Xₙ 相互独立；(2) 每个 Xᵢ 与总体 X 同分布，则称其为简单随机样本，简称样本。',
        plainTranslation: '简单随机样本是最理想的样本：每个个体独立抽取，每个个体都有同等机会被抽中，每个个体都能代表总体。这是"公平抽样"的数学定义。',
        whyNeedIt: '简单随机样本是统计推断的标准假设。大多数统计方法都假设样本是简单随机样本。',
        formula: 'X_1, X_2, \\ldots, X_n \\text{ i.i.d.} \\sim F',
        example: '从一副牌中有放回地抽取 n 张牌，每次抽取独立且每张牌被抽到的概率相同，这是简单随机样本。'
      },
      {
        id: 'statistic',
        name: '统计量',
        category: '基本概念',
        definition: '设 X₁, X₂, ..., Xₙ 是来自总体 X 的样本。若 T = T(X₁, ..., Xₙ) 是样本的函数，且不含未知参数，则称 T 为统计量。统计量是随机变量。',
        plainTranslation: '统计量是"用样本算出来的数"。它只依赖样本，不依赖未知参数。比如样本均值、样本方差都是统计量。',
        whyNeedIt: '统计量是统计推断的工具。我们用统计量来估计参数、检验假设。',
        formula: 'T = T(X_1, X_2, \\ldots, X_n)',
        example: '样本均值 X̄ = (X₁ + ... + Xₙ)/n 是统计量。如果总体均值 μ 未知，X̄ - μ 不是统计量（含未知参数）。'
      },
      {
        id: 'sample-mean',
        name: '样本均值',
        category: '常用统计量',
        definition: '样本均值定义为 X̄ = (X₁ + X₂ + ... + Xₙ)/n = (1/n)ΣᵢXᵢ。样本均值是总体均值的无偏估计。',
        plainTranslation: '样本均值就是"样本的平均数"。它是最常用的统计量，用来估计总体均值。',
        whyNeedIt: '样本均值是点估计的核心。它简单、直观、无偏，是最常用的估计量。',
        formula: '\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i',
        example: '样本观测值 (85, 72, 90, 88, 65)，样本均值 X̄ = (85+72+90+88+65)/5 = 80。'
      },
      {
        id: 'sample-variance',
        name: '样本方差',
        category: '常用统计量',
        definition: '样本方差定义为 S² = (1/(n-1))Σᵢ(Xᵢ - X̄)²。分母用 n-1 而不是 n，是为了保证无偏性。',
        plainTranslation: '样本方差是"样本的波动程度"。注意分母是 n-1 不是 n，这叫"自由度修正"，保证样本方差是总体方差的无偏估计。',
        whyNeedIt: '样本方差是估计总体方差的标准方法。n-1 的修正使它成为无偏估计。',
        formula: 'S^2 = \\frac{1}{n-1}\\sum_{i=1}^n (X_i - \\bar{X})^2',
        example: '样本观测值 (85, 72, 90, 88, 65)，X̄ = 80。S² = ((5)² + (-8)² + (10)² + (8)² + (-15)²)/4 = 121.5。'
      },
      {
        id: 'sample-standard-deviation',
        name: '样本标准差',
        category: '常用统计量',
        definition: '样本标准差定义为 S = √S² = √[(1/(n-1))Σᵢ(Xᵢ - X̄)²]。样本标准差与样本具有相同的量纲。',
        plainTranslation: '样本标准差是样本方差的平方根。它和原数据单位相同，比方差更直观。',
        whyNeedIt: '样本标准差是描述数据分散程度的常用指标，与均值一起描述数据分布。',
        formula: 'S = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^n (X_i - \\bar{X})^2}',
        example: '样本方差 S² = 121.5，样本标准差 S = √121.5 ≈ 11.02。'
      },
      {
        id: 'sample-moments',
        name: '样本矩',
        category: '常用统计量',
        definition: '样本 k 阶原点矩：Aₖ = (1/n)ΣᵢXᵢᵏ。样本 k 阶中心矩：Bₖ = (1/n)Σᵢ(Xᵢ - X̄)ᵏ。样本一阶原点矩是样本均值，样本二阶中心矩（乘以 n/(n-1)）是样本方差。',
        plainTranslation: '样本矩是总体矩的"样本版本"。用样本矩估计总体矩，是矩估计法的基础。',
        whyNeedIt: '样本矩是矩估计法的基础。通过样本矩可以估计总体矩，进而估计总体参数。',
        formula: 'A_k = \\frac{1}{n}\\sum_{i=1}^n X_i^k, \\quad B_k = \\frac{1}{n}\\sum_{i=1}^n (X_i - \\bar{X})^k',
        example: '样本 (1, 2, 3, 4, 5)。一阶原点矩 A₁ = 3（均值），二阶中心矩 B₂ = 2（方差的有偏估计）。'
      },
      {
        id: 'sampling-distribution',
        name: '抽样分布',
        category: '抽样分布',
        definition: '统计量的分布称为抽样分布。抽样分布描述了统计量作为随机变量的概率分布规律。',
        plainTranslation: '抽样分布是"统计量的分布"。因为样本是随机的，所以统计量也是随机的。抽样分布告诉我们统计量取各种值的概率。',
        whyNeedIt: '抽样分布是统计推断的理论基础。知道统计量的分布，才能进行区间估计和假设检验。',
        example: '样本均值 X̄ 的分布就是抽样分布。如果总体 ~ N(μ, σ²)，则 X̄ ~ N(μ, σ²/n)。'
      },
      {
        id: 'distribution-of-sample-mean',
        name: '样本均值的分布',
        category: '抽样分布',
        definition: '设 X₁, ..., Xₙ 是来自总体 X 的样本，E(X) = μ，D(X) = σ²。则：(1) E(X̄) = μ，D(X̄) = σ²/n；(2) 若总体 ~ N(μ, σ²)，则 X̄ ~ N(μ, σ²/n)；(3) 若 n 很大，由中心极限定理，X̄ 近似 ~ N(μ, σ²/n)。',
        plainTranslation: '样本均值的分布是抽样分布的核心。关键结论：样本均值的期望等于总体均值，方差是总体方差的 1/n。样本量越大，样本均值越稳定。',
        whyNeedIt: '样本均值分布是统计推断的基础。它让我们能计算样本均值的概率，进行区间估计和假设检验。',
        formula: 'E(\\bar{X}) = \\mu, \\quad D(\\bar{X}) = \\frac{\\sigma^2}{n}',
        example: '总体 ~ N(100, 15²)，样本量 n = 25。X̄ ~ N(100, 15²/25) = N(100, 9)。P(X̄ > 103) = P(Z > 1) ≈ 0.1587。'
      },
      {
        id: 'chi-square-distribution',
        name: 'χ²分布（卡方分布）',
        category: '三大分布',
        definition: '设 X₁, X₂, ..., Xₙ 独立同分布且都 ~ N(0, 1)，则 χ² = X₁² + X₂² + ... + Xₙ² 服从自由度为 n 的 χ² 分布，记作 χ² ~ χ²(n)。其密度函数为 f(x) = x^(n/2-1)·e^(-x/2) / (2^(n/2)·Γ(n/2))，x > 0。',
        plainTranslation: 'χ² 分布是"标准正态变量平方和"的分布。自由度 n 是独立变量个数。χ² 分布只取正值，右偏，随着自由度增加趋向正态分布。',
        whyNeedIt: 'χ² 分布是统计推断的三大分布之一。它用于方差检验、拟合优度检验、列联表检验等。',
        formula: '\\chi^2 = \\sum_{i=1}^n X_i^2 \\sim \\chi^2(n)',
        example: 'X₁, X₂, X₃ 独立且都 ~ N(0, 1)。X₁² + X₂² + X₃² ~ χ²(3)。'
      },
      {
        id: 'chi-square-properties',
        name: 'χ²分布的性质',
        category: '三大分布',
        definition: 'χ² 分布的性质：(1) E(χ²(n)) = n，D(χ²(n)) = 2n；(2) 可加性：若 X ~ χ²(n₁)，Y ~ χ²(n₂) 独立，则 X + Y ~ χ²(n₁ + n₂)；(3) 若 X ~ N(μ, σ²)，则 nS²/σ² ~ χ²(n-1)；(4) χ²(n) 当 n 很大时近似 N(n, 2n)。',
        plainTranslation: 'χ² 分布的期望等于自由度，方差等于自由度的两倍。可加性很重要：独立 χ² 变量的和还是 χ² 分布。',
        whyNeedIt: '这些性质在推导其他分布和进行统计推断时非常重要。',
        formula: 'E(\\chi^2(n)) = n, \\quad D(\\chi^2(n)) = 2n',
        example: 'χ²(10) 的期望是 10，方差是 20。两个独立的 χ²(5) 和 χ²(3) 相加得 χ²(8)。'
      },
      {
        id: 't-distribution',
        name: 't分布',
        category: '三大分布',
        definition: '设 X ~ N(0, 1)，Y ~ χ²(n) 独立，则 T = X/√(Y/n) 服从自由度为 n 的 t 分布，记作 T ~ t(n)。其密度函数关于 0 对称，形状类似正态分布但尾部更厚。',
        plainTranslation: 't 分布是"正态变量除以卡方变量平方根"的分布。它比正态分布有更厚的尾巴，自由度越小越厚。当 n → ∞ 时，t 分布趋向标准正态分布。',
        whyNeedIt: 't 分布是小样本推断的核心。当总体方差未知时，用 t 分布进行均值推断。',
        formula: 'T = \\frac{X}{\\sqrt{Y/n}} \\sim t(n)',
        example: '样本来自正态总体，方差未知。样本均值标准化后服从 t 分布，不是正态分布。'
      },
      {
        id: 't-distribution-properties',
        name: 't分布的性质',
        category: '三大分布',
        definition: 't 分布的性质：(1) 关于 0 对称；(2) E(T) = 0（n > 1），D(T) = n/(n-2)（n > 2）；(3) t(1) 是柯西分布；(4) 当 n → ∞ 时，t(n) → N(0, 1)；(5) 若 X̄ 和 S² 是正态总体样本的均值和方差，则 √n(X̄ - μ)/S ~ t(n-1)。',
        plainTranslation: 't 分布对称、均值为 0。自由度越大，越接近正态分布。实际应用中，n > 30 时通常用正态分布近似。',
        whyNeedIt: '这些性质是 t 检验的理论基础。特别是性质(5)，是单样本 t 检验的核心。',
        formula: '\\sqrt{n}\\frac{\\bar{X} - \\mu}{S} \\sim t(n-1)',
        example: '样本量 n = 10，总体正态。√10(X̄ - μ)/S ~ t(9)。查 t 分布表可得临界值。'
      },
      {
        id: 'f-distribution',
        name: 'F分布',
        category: '三大分布',
        definition: '设 X ~ χ²(n₁)，Y ~ χ²(n₂) 独立，则 F = (X/n₁)/(Y/n₂) 服从自由度为 (n₁, n₂) 的 F 分布，记作 F ~ F(n₁, n₂)。n₁ 称为第一自由度，n₂ 称为第二自由度。',
        plainTranslation: 'F 分布是"两个卡方变量（各除以自由度）的比值"的分布。它只取正值，右偏。用于比较两个方差。',
        whyNeedIt: 'F 分布是方差分析、回归分析的核心。它用于检验方差是否相等、回归模型是否显著。',
        formula: 'F = \\frac{X/n_1}{Y/n_2} \\sim F(n_1, n_2)',
        example: '两个正态总体，样本方差 S₁² 和 S₂²。S₁²/σ₁² 除以 S₂²/σ₂² 服从 F 分布。'
      },
      {
        id: 'f-distribution-properties',
        name: 'F分布的性质',
        category: '三大分布',
        definition: 'F 分布的性质：(1) F > 0；(2) 若 F ~ F(n₁, n₂)，则 1/F ~ F(n₂, n₁)；(3) 若 T ~ t(n)，则 T² ~ F(1, n)；(4) F(n₁, n₂) 的上 α 分位数 F_α(n₁, n₂) 与 F_{1-α}(n₁, n₂) 满足：F_{1-α}(n₁, n₂) = 1/F_α(n₂, n₁)。',
        plainTranslation: 'F 分布的一个重要性质是"倒数关系"：F 的倒数是另一个 F 分布（自由度互换）。这让我们能从上分位数求下分位数。',
        whyNeedIt: '这些性质在查表和计算时非常重要。特别是性质(4)，让我们能从 F 分布表获得双侧检验的临界值。',
        formula: 'F \\sim F(n_1, n_2) \\Rightarrow \\frac{1}{F} \\sim F(n_2, n_1)',
        example: 'F ~ F(5, 10)。若 F₀.₀₅(5, 10) = 3.33，则 F₀.₉₅(5, 10) = 1/F₀.₀₅(10, 5) = 1/4.74 ≈ 0.21。'
      },
      {
        id: 'sample-variance-distribution',
        name: '样本方差的分布',
        category: '抽样分布',
        definition: '设 X₁, ..., Xₙ 是来自 N(μ, σ²) 的样本，S² 是样本方差。则：(1) (n-1)S²/σ² ~ χ²(n-1)；(2) X̄ 与 S² 独立；(3) X̄ 和 S² 分别是 μ 和 σ² 的无偏估计。',
        plainTranslation: '样本方差的分布是方差推断的基础。关键结论：样本方差乘以 (n-1)/σ² 服从 χ² 分布，自由度是 n-1。',
        whyNeedIt: '这个结论是方差区间估计和假设检验的理论基础。',
        formula: '\\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)',
        example: '样本量 n = 10，总体方差 σ² = 4。9S²/4 ~ χ²(9)。'
      },
      {
        id: 'two-sample-statistics',
        name: '两样本统计量',
        category: '抽样分布',
        definition: '设 X₁, ..., Xₙ₁ 来自 N(μ₁, σ₁²)，Y₁, ..., Yₙ₂ 来自 N(μ₂, σ₂²)，两样本独立。则：(1) X̄ - Ȳ ~ N(μ₁ - μ₂, σ₁²/n₁ + σ₂²/n₂)；(2) 若 σ₁² = σ₂² = σ²，则 Sₚ² = ((n₁-1)S₁² + (n₂-1)S₂²)/(n₁+n₂-2) 是合并方差估计。',
        plainTranslation: '两样本统计量是比较两个总体的基础。样本均值差的分布用于比较两个均值，合并方差用于方差相等时的推断。',
        whyNeedIt: '两样本推断（比较两个总体）是统计学的重要内容。',
        formula: '\\bar{X} - \\bar{Y} \\sim N\\left(\\mu_1 - \\mu_2, \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}\\right)',
        example: '两组学生成绩，第一组 X̄ = 80，n₁ = 30；第二组 Ȳ = 75，n₂ = 25。X̄ - Ȳ 的标准误 = √(σ₁²/30 + σ₂²/25)。'
      },
      {
        id: 'two-sample-t-statistic',
        name: '两样本t统计量',
        category: '抽样分布',
        definition: '设两样本来自正态总体，方差相等（σ₁² = σ₂² = σ²）。则 t = (X̄ - Ȳ - (μ₁ - μ₂))/(Sₚ·√(1/n₁ + 1/n₂)) ~ t(n₁ + n₂ - 2)，其中 Sₚ² = ((n₁-1)S₁² + (n₂-1)S₂²)/(n₁+n₂-2)。',
        plainTranslation: '两样本 t 统计量是比较两个正态总体均值的标准工具。当方差相等但未知时，用合并方差估计 σ²，得到 t 分布。',
        whyNeedIt: '两样本 t 检验是比较两组均值差异的标准方法。',
        formula: 't = \\frac{\\bar{X} - \\bar{Y} - (\\mu_1 - \\mu_2)}{S_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}} \\sim t(n_1 + n_2 - 2)',
        example: '两组学生成绩，n₁ = n₂ = 20，X̄ = 82，Ȳ = 78，S₁² = 16，S₂² = 25。Sₚ² = (19×16 + 19×25)/38 = 20.5。t = (82-78)/√(20.5/10) ≈ 2.79。'
      },
      {
        id: 'order-statistics',
        name: '次序统计量',
        category: '其他统计量',
        definition: '将样本 X₁, ..., Xₙ 从小到大排列，得到 X₍₁₎ ≤ X₍₂₎ ≤ ... ≤ X₍ₙ₎，称 X₍ₖ₎ 为第 k 个次序统计量。X₍₁₎ 是最小值，X₍ₙ₎ 是最大值。',
        plainTranslation: '次序统计量就是"排好序的样本"。最小值、最大值、中位数都是次序统计量。它们对异常值敏感，常用于非参数统计。',
        whyNeedIt: '次序统计量是非参数统计的基础。中位数、极差、分位数都基于次序统计量。',
        formula: 'X_{(1)} \\le X_{(2)} \\le \\cdots \\le X_{(n)}',
        example: '样本 (3, 1, 4, 1, 5) 的次序统计量是 X₍₁₎ = 1, X₍₂₎ = 1, X₍₃₎ = 3, X₍₄₎ = 4, X₍₅₎ = 5。'
      },
      {
        id: 'sample-median',
        name: '样本中位数',
        category: '其他统计量',
        definition: '样本中位数定义为：若 n 为奇数，中位数 = X₍₍ₙ₊₁₎/₂₎；若 n 为偶数，中位数 = (X₍ₙ/₂₎ + X₍ₙ/₂₊₁₎)/2。中位数是位置统计量。',
        plainTranslation: '样本中位数是"样本中间的值"。它把样本分成两半，一半比它小，一半比它大。中位数对异常值不敏感，比均值更稳健。',
        whyNeedIt: '中位数是稳健的位置估计量。当数据有异常值或分布偏斜时，中位数比均值更能代表"中心"。',
        example: '样本 (1, 3, 5, 7, 9) 中位数 = 5。样本 (1, 3, 5, 7) 中位数 = (3+5)/2 = 4。'
      },
      {
        id: 'sample-quantile',
        name: '样本分位数',
        category: '其他统计量',
        definition: '样本 p 分位数 Qₚ 是满足：约 p×100% 的样本值小于 Qₚ，约 (1-p)×100% 的样本值大于 Qₚ。常用的有四分位数（p = 0.25, 0.5, 0.75）。',
        plainTranslation: '样本分位数是"把样本分成若干份的分界点"。四分位数把样本分成四份，百分位数把样本分成100份。',
        whyNeedIt: '分位数描述了数据的分布形态。箱线图就是用分位数来展示数据分布。',
        example: '样本 (1, 2, 3, 4, 5, 6, 7, 8)。Q₀.₂₅ ≈ 2.5，Q₀.₅ = 4.5，Q₀.₇₅ ≈ 6.5。'
      },
      {
        id: 'empirical-distribution-function',
        name: '经验分布函数',
        category: '其他统计量',
        definition: '经验分布函数定义为 Fₙ(x) = (1/n)·#{Xᵢ ≤ x}，即样本中小于等于 x 的比例。它是总体分布函数的估计。',
        plainTranslation: '经验分布函数是"用样本估计分布函数"。在每个样本点处跳跃 1/n，形成阶梯函数。样本量越大，越接近真实分布函数。',
        whyNeedIt: '经验分布函数是非参数统计的基础。格里文科定理保证了它收敛于真实分布函数。',
        formula: 'F_n(x) = \\frac{1}{n}\\sum_{i=1}^n I(X_i \\le x)',
        example: '样本 (1, 2, 2, 3)。Fₙ(1.5) = 1/4，Fₙ(2) = 3/4，Fₙ(2.5) = 3/4，Fₙ(3) = 1。'
      },
      {
        id: 'glivenko-theorem',
        name: '格里文科定理',
        category: '其他统计量',
        definition: '设 F(x) 是总体分布函数，Fₙ(x) 是经验分布函数。则 P(sup_x|Fₙ(x) - F(x)| → 0) = 1，即经验分布函数几乎必然一致收敛于总体分布函数。',
        plainTranslation: '格里文科定理说：当样本量趋向无穷时，经验分布函数会"几乎必然一致收敛"于真实分布函数。这保证了用样本估计分布的合理性。',
        whyNeedIt: '格里文科定理是非参数统计的理论基础。它保证了经验分布函数是总体分布函数的一致估计。',
        formula: 'P\\left(\\sup_x |F_n(x) - F(x)| \\to 0\\right) = 1',
        example: '无论总体是什么分布，只要样本量足够大，经验分布函数就会非常接近真实分布函数。'
      },
      {
        id: 'normal-sampling-theorem',
        name: '正态总体的抽样分布基本定理',
        category: '抽样分布',
        definition: '设 X₁,...,Xₙ 为 N(μ,σ²) 的简单随机样本，则：(1) X̄ ~ N(μ, σ²/n)；(2) (n-1)S²/σ² ~ χ²(n-1)；(3) X̄ 与 S² 独立；(4) (X̄-μ)/(S/√n) ~ t(n-1)。',
        plainTranslation: '这是正态总体抽样分布的"四大金刚"——样本均值服从正态（方差缩小n倍）、样本方差的标准化服从χ²分布、样本均值与样本方差独立（这个"独立"非常关键！）、t统计量服从t分布。这四条是参数估计和假设检验的理论基础。',
        whyNeedIt: '正态总体的抽样分布定理是整个数理统计推断的理论基石。没有这四条结论，后续的区间估计和假设检验都无法建立。它们是考研概率统计的必考内容。',
        formula: '\\bar{X} \\sim N(\\mu, \\frac{\\sigma^2}{n}), \\quad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1), \\quad \\bar{X} \\perp S^2'
      },
      {
        id: 'two-sample-sampling-dist',
        name: '双正态总体的抽样分布',
        category: '抽样分布',
        definition: '设 X₁,...,Xₙ₁ ~ N(μ₁,σ₁²)，Y₁,...,Yₙ₂ ~ N(μ₂,σ₂²) 相互独立，则：(1) (X̄-Ȳ) ~ N(μ₁-μ₂, σ₁²/n₁+σ₂²/n₂)；(2) 当σ₁=σ₂=σ时，S_w² = [(n₁-1)S₁²+(n₂-1)S₂²]/(n₁+n₂-2)且 (X̄-Ȳ-(μ₁-μ₂))/(S_w√(1/n₁+1/n₂)) ~ t(n₁+n₂-2)；(3) S₁²/S₂² ~ F(n₁-1,n₂-1)（当σ₁=σ₂时）。',
        plainTranslation: '双总体就是从两个正态总体各抽一批样本，研究它们之间的关系。均值差也服从正态，方差比服从F分布。当两总体方差相等时，用合并方差S_w构造t统计量——这是两样本t检验的理论依据。',
        whyNeedIt: '双总体抽样分布是比较两个总体参数（均值差、方差比）的理论基础，是双样本假设检验的出发点。',
        formula: '\\frac{\\bar{X}-\\bar{Y}-(\\mu_1-\\mu_2)}{S_w\\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}} \\sim t(n_1+n_2-2)'
      }
    ] as Concept[]
  },
  {
    id: 'chapter16',
    name: '第十六章 参数估计',
    concepts: [
      {
        id: 'parameter-estimation',
        name: '参数估计',
        category: '基本概念',
        definition: '设总体 X 的分布函数 F(x; θ) 形式已知，但参数 θ 未知。根据样本 X₁, ..., Xₙ 来估计 θ 的问题称为参数估计。参数估计分为点估计和区间估计。',
        plainTranslation: '参数估计就是"用样本猜总体参数"。比如想知道全国成年男性的平均身高μ，我们随机抽取1000人测量，用这1000人的平均身高来估计μ。这就是参数估计。',
        whyNeedIt: '参数估计是统计推断的核心任务之一。总体参数通常未知，我们需要通过样本数据来估计它们。',
        example: '估计某工厂产品的次品率 p。抽取 n 件产品，用样本次品率估计 p。'
      },
      {
        id: 'point-estimation',
        name: '点估计',
        category: '点估计',
        definition: '点估计是构造一个统计量 θ̂ = θ̂(X₁, ..., Xₙ) 作为参数 θ 的估计值。θ̂ 称为 θ 的点估计量，其观测值称为点估计值。',
        plainTranslation: '点估计就是"用一个数来估计参数"。比如用样本均值估计总体均值，用样本方差估计总体方差。点估计给出一个具体的数值，但不知道这个估计有多准确。',
        whyNeedIt: '点估计提供了参数的具体估计值，是最直观的估计方法。但点估计没有告诉我们估计的精度，需要配合区间估计使用。',
        formula: '\\hat{\\theta} = \\hat{\\theta}(X_1, X_2, \\ldots, X_n)',
        example: '用样本均值 X̄ 估计总体均值 μ，X̄ 就是 μ 的点估计量。'
      },
      {
        id: 'moment-estimation',
        name: '矩估计法',
        category: '点估计方法',
        definition: '矩估计法是用样本矩估计总体矩的方法。设总体有 k 个未知参数 θ₁, ..., θₖ，令前 k 阶样本矩等于前 k 阶总体矩，解方程组得到参数的矩估计。',
        plainTranslation: '矩估计法的思想很简单：样本矩应该接近总体矩。比如用样本均值（一阶样本矩）估计总体均值（一阶总体矩），用样本二阶矩估计总体二阶矩。这是最古老的估计方法。',
        whyNeedIt: '矩估计法简单直观，计算方便。它是皮尔逊在1894年提出的，是历史上第一个系统的参数估计方法。',
        formula: 'A_k = \\frac{1}{n}\\sum_{i=1}^n X_i^k \\approx E(X^k) = \\mu_k(\\theta_1, \\ldots, \\theta_k)',
        example: '总体 X ~ N(μ, σ²)。用样本均值估计 μ，用样本二阶中心矩估计 σ²。'
      },
      {
        id: 'maximum-likelihood-estimation',
        name: '极大似然估计法',
        category: '点估计方法',
        definition: '设总体 X 的概率函数为 f(x; θ)。样本 X₁, ..., Xₙ 的似然函数为 L(θ) = ∏ᵢf(Xᵢ; θ)。使 L(θ) 达到最大的 θ̂ 称为 θ 的极大似然估计（MLE）。',
        plainTranslation: '极大似然估计的思想是：已经发生的样本，应该是最可能发生的。所以选择让样本出现概率最大的参数值作为估计。比如掷硬币10次出现7次正面，我们猜测硬币正面概率是0.7，因为这组结果在p=0.7时概率最大。',
        whyNeedIt: '极大似然估计是统计学中最重要、应用最广泛的估计方法。它有很好的大样本性质：一致性、渐近正态性、渐近有效性。',
        formula: '\\hat{\\theta}_{MLE} = \\arg\\max_\\theta L(\\theta) = \\arg\\max_\\theta \\prod_{i=1}^n f(X_i; \\theta)',
        example: 'X ~ B(1, p)，样本 x₁, ..., xₙ。似然函数 L(p) = p^Σxᵢ(1-p)^(n-Σxᵢ)。MLE: p̂ = X̄。'
      },
      {
        id: 'likelihood-function',
        name: '似然函数',
        category: '点估计方法',
        definition: '似然函数是样本观测值出现的概率（或概率密度），看作参数的函数。对于离散型，L(θ) = P(X₁=x₁, ..., Xₙ=xₙ; θ)；对于连续型，L(θ) = ∏ᵢf(xᵢ; θ)。',
        plainTranslation: '似然函数是"样本出现的概率"，但把它看作参数θ的函数。不同的θ，样本出现的概率不同。似然函数告诉我们：在给定样本下，哪些θ值更"可能"。',
        whyNeedIt: '似然函数是极大似然估计的核心。通过最大化似然函数，找到最可能产生观测样本的参数值。',
        formula: 'L(\\theta) = \\prod_{i=1}^n f(X_i; \\theta)',
        example: 'X ~ P(λ)，样本 (2, 3, 1)。L(λ) = (λ²e^{-λ}/2!) × (λ³e^{-λ}/3!) × (λ¹e^{-λ}/1!) = λ⁶e^{-3λ}/12。'
      },
      {
        id: 'log-likelihood-function',
        name: '对数似然函数',
        category: '点估计方法',
        definition: '对数似然函数是似然函数的对数：ℓ(θ) = ln L(θ)。由于对数函数单调递增，最大化 L(θ) 等价于最大化 ℓ(θ)。对数似然函数将乘法变为加法，简化计算。',
        plainTranslation: '对数似然函数是似然函数取对数。为什么要取对数？因为似然函数是很多项的乘积，取对数后变成求和，求导更方便。而且对数不改变最大值的位置。',
        whyNeedIt: '对数似然函数简化了极大似然估计的计算。实际计算中几乎总是用对数似然函数。',
        formula: '\\ell(\\theta) = \\ln L(\\theta) = \\sum_{i=1}^n \\ln f(X_i; \\theta)',
        example: 'X ~ P(λ)。L(λ) = λ^{ΣXᵢ}e^{-nλ}/∏Xᵢ!。ℓ(λ) = ΣXᵢln λ - nλ - ln(∏Xᵢ!)。'
      },
      {
        id: 'unbiasedness',
        name: '无偏性',
        category: '估计量的评价',
        definition: '若估计量 θ̂ 满足 E(θ̂) = θ，则称 θ̂ 是 θ 的无偏估计量。无偏性意味着估计量的期望等于真实参数值。',
        plainTranslation: '无偏性是说：估计量虽然每次估计都有误差，但大量估计的平均值正好等于真实值。比如样本方差S²是总体方差σ²的无偏估计，但样本二阶中心矩不是无偏的（它低估了σ²）。',
        whyNeedIt: '无偏性是评价估计量的基本标准。无偏估计没有系统偏差，长期平均来说是准确的。',
        formula: 'E(\\hat{\\theta}) = \\theta',
        example: '样本均值 X̄ 是总体均值 μ 的无偏估计：E(X̄) = μ。样本方差 S² 是总体方差 σ² 的无偏估计。'
      },
      {
        id: 'bias',
        name: '偏差',
        category: '估计量的评价',
        definition: '估计量 θ̂ 的偏差定义为 Bias(θ̂) = E(θ̂) - θ。偏差衡量估计量的系统性误差。无偏估计的偏差为0。',
        plainTranslation: '偏差是"估计量的期望与真实值的差距"。偏差为正说明系统性地高估，偏差为负说明系统性地低估。无偏估计的偏差为0。',
        whyNeedIt: '偏差是评价估计量准确性的重要指标。有些估计量虽然有偏，但偏差很小，可能比无偏估计更好。',
        formula: 'Bias(\\hat{\\theta}) = E(\\hat{\\theta}) - \\theta',
        example: '样本二阶中心矩 B₂ = (1/n)Σ(Xᵢ - X̄)² 的偏差 = -σ²/n。它系统性地低估了方差。'
      },
      {
        id: 'efficiency',
        name: '有效性',
        category: '估计量的评价',
        definition: '设 θ̂₁ 和 θ̂₂ 都是 θ 的无偏估计量。若 D(θ̂₁) < D(θ̂₂)，则称 θ̂₁ 比 θ̂₂ 有效。在所有无偏估计中，方差最小的估计量称为最小方差无偏估计（MVUE）。',
        plainTranslation: '有效性比较的是"谁的波动更小"。两个估计量都是无偏的，但方差小的更好——估计更稳定、更精确。比如样本均值比样本中位数更有效（对正态总体）。',
        whyNeedIt: '有效性是评价估计量优劣的重要标准。在无偏估计中，我们希望找到方差最小的估计量。',
        formula: 'D(\\hat{\\theta}_1) < D(\\hat{\\theta}_2) \\Rightarrow \\hat{\\theta}_1 \\text{ 更有效}',
        example: '正态总体 N(μ, σ²)，样本均值 X̄ 和样本中位数都是 μ 的无偏估计。但 D(X̄) = σ²/n，D(中位数) ≈ 1.57σ²/n。X̄ 更有效。'
      },
      {
        id: 'consistency',
        name: '一致性（相合性）',
        category: '估计量的评价',
        definition: '若估计量 θ̂ₙ 依概率收敛于 θ，即 ∀ε > 0: lim(n→∞) P(|θ̂ₙ - θ| < ε) = 1，则称 θ̂ₙ 是 θ 的一致估计量（相合估计量）。',
        plainTranslation: '一致性是说：当样本量趋于无穷时，估计量会收敛到真实参数值。这是大样本性质——样本量越大，估计越准确。比如样本均值是总体均值的一致估计。',
        whyNeedIt: '一致性是估计量的基本要求。如果一个估计量在样本量很大时还不收敛到真实值，这个估计量就是不可接受的。',
        formula: '\\hat{\\theta}_n \\xrightarrow{P} \\theta',
        example: '样本均值 X̄ 是总体均值 μ 的一致估计（由大数定律保证）。样本方差 S² 是总体方差 σ² 的一致估计。'
      },
      {
        id: 'mean-squared-error',
        name: '均方误差（MSE）',
        category: '估计量的评价',
        definition: '估计量 θ̂ 的均方误差定义为 MSE(θ̂) = E[(θ̂ - θ)²] = D(θ̂) + [Bias(θ̂)]²。MSE 同时考虑了方差和偏差。',
        plainTranslation: '均方误差是"估计误差平方的期望"，它综合了方差和偏差。MSE = 方差 + 偏差²。一个好的估计量应该MSE小——既无偏（偏差小），又稳定（方差小）。',
        whyNeedIt: 'MSE是评价估计量的综合指标。有时候有偏估计的MSE比无偏估计更小，这时有偏估计反而更好。',
        formula: 'MSE(\\hat{\\theta}) = E[(\\hat{\\theta} - \\theta)^2] = D(\\hat{\\theta}) + [Bias(\\hat{\\theta})]^2',
        example: '估计正态总体方差。S² 无偏，MSE(S²) = 2σ⁴/(n-1)。B₂ = (n-1)S²/n 有偏，但 n ≥ 2 时 MSE(B₂) = (2n-1)σ⁴/n² < MSE(S²)。'
      },
      {
        id: 'interval-estimation',
        name: '区间估计',
        category: '区间估计',
        definition: '区间估计是构造两个统计量 θ̂₁ 和 θ̂₂（θ̂₁ < θ̂₂），用区间 [θ̂₁, θ̂₂] 来估计参数 θ。区间估计不仅给出估计值，还给出估计的精度。',
        plainTranslation: '区间估计不是给出一个数，而是给出一个范围。比如"全国成年男性平均身高在168cm到172cm之间，置信度95%"。区间估计告诉我们估计有多可靠、多精确。',
        whyNeedIt: '点估计只给出一个数值，没有精度信息。区间估计给出了估计的范围和可靠性，信息更完整。',
        formula: '[\\hat{\\theta}_1, \\hat{\\theta}_2]',
        example: '估计某班级平均成绩。点估计：78分。区间估计：[75, 81]分，置信度95%。'
      },
      {
        id: 'confidence-interval',
        name: '置信区间',
        category: '区间估计',
        definition: '设 θ 是总体的未知参数。若统计量 θ̂₁ 和 θ̂₂ 满足 P(θ̂₁ ≤ θ ≤ θ̂₂) = 1 - α，则称 [θ̂₁, θ̂₂] 为 θ 的置信水平 1-α 的置信区间。1-α 称为置信水平或置信度。',
        plainTranslation: '置信区间是"有置信度的区间估计"。95%置信区间的意思是：如果重复抽样很多次，构造很多个置信区间，大约95%的区间会包含真实参数值。不是说真实值有95%概率落在区间内！',
        whyNeedIt: '置信区间是统计推断的核心工具。它给出了参数估计的范围和可靠性，比点估计信息更丰富。',
        formula: 'P(\\hat{\\theta}_1 \\le \\theta \\le \\hat{\\theta}_2) = 1 - \\alpha',
        example: '正态总体 N(μ, σ²)，σ 已知。μ 的95%置信区间：[X̄ - 1.96σ/√n, X̄ + 1.96σ/√n]。'
      },
      {
        id: 'confidence-level',
        name: '置信水平',
        category: '区间估计',
        definition: '置信水平 1-α 是置信区间包含真实参数的概率。常用的置信水平有 0.90、0.95、0.99，对应的 α 为 0.10、0.05、0.01。',
        plainTranslation: '置信水平是"区间包含真实值的概率"。95%置信水平意味着：如果重复抽样100次，构造100个置信区间，大约有95个区间会包含真实参数值。',
        whyNeedIt: '置信水平量化了区间估计的可靠性。置信水平越高，区间越宽；置信水平越低，区间越窄。',
        example: '95%置信区间：α = 0.05，z_{α/2} = z_{0.025} = 1.96。99%置信区间：α = 0.01，z_{0.005} = 2.576。'
      },
      {
        id: 'ci-for-mean-known-variance',
        name: '均值置信区间（方差已知）',
        category: '正态总体参数估计',
        definition: '设 X₁, ..., Xₙ 来自 N(μ, σ²)，σ² 已知。则 μ 的 1-α 置信区间为 [X̄ - z_{α/2}·σ/√n, X̄ + z_{α/2}·σ/√n]。',
        plainTranslation: '当总体方差σ²已知时，用正态分布构造均值的置信区间。区间宽度是 2z_{α/2}σ/√n，与σ成正比，与√n成反比。σ越大（数据越分散），区间越宽；n越大（样本越多），区间越窄。',
        whyNeedIt: '这是最基本的置信区间公式。实际中方差通常未知，这个公式主要用于理论分析。',
        formula: '[\\bar{X} - z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}, \\bar{X} + z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}]',
        example: 'X ~ N(μ, 4)，n = 25，X̄ = 50。μ 的95%置信区间：[50 - 1.96×2/5, 50 + 1.96×2/5] = [49.22, 50.78]。'
      },
      {
        id: 'ci-for-mean-unknown-variance',
        name: '均值置信区间（方差未知）',
        category: '正态总体参数估计',
        definition: '设 X₁, ..., Xₙ 来自 N(μ, σ²)，σ² 未知。则 μ 的 1-α 置信区间为 [X̄ - t_{α/2}(n-1)·S/√n, X̄ + t_{α/2}(n-1)·S/√n]。',
        plainTranslation: '当总体方差未知时，用样本标准差S代替σ，用t分布代替正态分布。t分布比正态分布有更厚的尾巴，所以置信区间更宽——这是用S代替σ带来的不确定性。',
        whyNeedIt: '这是实际中最常用的置信区间公式，因为总体方差通常未知。',
        formula: '[\\bar{X} - t_{\\alpha/2}(n-1) \\cdot \\frac{S}{\\sqrt{n}}, \\bar{X} + t_{\\alpha/2}(n-1) \\cdot \\frac{S}{\\sqrt{n}}]',
        example: 'X ~ N(μ, σ²)，n = 16，X̄ = 50，S = 4。μ 的95%置信区间：t_{0.025}(15) = 2.131。[50 - 2.131, 50 + 2.131] = [47.87, 52.13]。'
      },
      {
        id: 'ci-for-variance',
        name: '方差的置信区间',
        category: '正态总体参数估计',
        definition: '设 X₁, ..., Xₙ 来自 N(μ, σ²)。则 σ² 的 1-α 置信区间为 [(n-1)S²/χ²_{α/2}(n-1), (n-1)S²/χ²_{1-α/2}(n-1)]。',
        plainTranslation: '方差的置信区间用χ²分布构造。因为(n-1)S²/σ² ~ χ²(n-1)。注意这个区间不是对称的——方差置信区间通常左短右长。',
        whyNeedIt: '方差置信区间在质量控制、金融风险评估中有重要应用。',
        formula: '\\left[\\frac{(n-1)S^2}{\\chi^2_{\\alpha/2}(n-1)}, \\frac{(n-1)S^2}{\\chi^2_{1-\\alpha/2}(n-1)}\\right]',
        example: 'n = 16，S² = 4。σ² 的95%置信区间：χ²_{0.025}(15) = 27.5，χ²_{0.975}(15) = 6.26。[15×4/27.5, 15×4/6.26] = [2.18, 9.58]。'
      },
      {
        id: 'ci-for-proportion',
        name: '比例的置信区间',
        category: '其他参数估计',
        definition: '设 X ~ B(n, p)，样本比例 p̂ = X/n。当 n 较大时，p 的 1-α 近似置信区间为 [p̂ - z_{α/2}·√(p̂(1-p̂)/n), p̂ + z_{α/2}·√(p̂(1-p̂)/n)]。',
        plainTranslation: '比例的置信区间用于估计总体中具有某特征的比例。比如估计产品次品率、民意调查支持率等。用正态近似构造，要求样本量足够大（np̂ ≥ 5 且 n(1-p̂) ≥ 5）。',
        whyNeedIt: '比例估计在实际中非常常见，如选举民调、产品质量检验、医学研究等。',
        formula: '[\\hat{p} - z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}, \\hat{p} + z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}]',
        example: '调查1000人，600人支持某政策。p̂ = 0.6。p 的95%置信区间：[0.6 - 1.96×√(0.24/1000), 0.6 + 1.96×√(0.24/1000)] ≈ [0.57, 0.63]。'
      },
      {
        id: 'pooled-variance',
        name: '合并方差',
        category: '两样本估计',
        definition: '设两样本来自正态总体，方差相等。合并方差 Sₚ² = ((n₁-1)S₁² + (n₂-1)S₂²)/(n₁+n₂-2) 是公共方差 σ² 的无偏估计。',
        plainTranslation: '合并方差是"把两组样本的方差信息合并起来"估计公共方差。它比单独用任何一组的方差都更精确，因为用了更多数据。',
        whyNeedIt: '合并方差是两样本t检验的基础。当两个总体方差相等时，用合并方差估计公共方差，提高估计精度。',
        formula: 'S_p^2 = \\frac{(n_1-1)S_1^2 + (n_2-1)S_2^2}{n_1 + n_2 - 2}',
        example: 'n₁ = 10, S₁² = 4；n₂ = 15, S₂² = 6。Sₚ² = (9×4 + 14×6)/23 = 5.22。'
      },
      {
        id: 'ci-for-mean-difference',
        name: '均值差的置信区间',
        category: '两样本估计',
        definition: '设两样本来自正态总体，方差相等。μ₁ - μ₂ 的 1-α 置信区间为 [X̄ - Ȳ - t_{α/2}·Sₚ·√(1/n₁+1/n₂), X̄ - Ȳ + t_{α/2}·Sₚ·√(1/n₁+1/n₂)]。',
        plainTranslation: '均值差的置信区间用于比较两个总体的均值。比如比较两种教学方法的效果、两种药物疗效的差异。如果置信区间包含0，说明没有显著差异。',
        whyNeedIt: '比较两个总体均值是实际中常见的问题。均值差的置信区间不仅给出差异大小，还给出差异的精度。',
        formula: '[\\bar{X} - \\bar{Y} - t_{\\alpha/2} S_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}, \\bar{X} - \\bar{Y} + t_{\\alpha/2} S_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}]',
        example: '两组学生成绩：n₁ = n₂ = 20，X̄ = 82，Ȳ = 78，Sₚ = 4.5。均值差的95%置信区间：[4 - 2.024×4.5×√0.1, 4 + 2.024×4.5×√0.1] ≈ [1.11, 6.89]。'
      },
      {
        id: 'pivot-quantity',
        name: '枢轴量',
        category: '区间估计',
        definition: '枢轴量是样本和参数的函数 G(X₁, ..., Xₙ; θ)，其分布不依赖于参数 θ。枢轴量是构造置信区间的重要工具。',
        plainTranslation: '枢轴量就像一个"桥梁"——它既包含样本又包含参数，但它的分布却与参数无关。比如 (X̄ - μ)/(σ/√n) 是一个枢轴量，它服从标准正态分布，与 μ 无关。有了枢轴量，就能构造置信区间。',
        whyNeedIt: '枢轴量法是构造置信区间的一般方法。找到合适的枢轴量，就能从其分布推导出参数的置信区间。',
        formula: 'G(X_1, \\ldots, X_n; \\theta) \\text{ 的分布不依赖于 } \\theta',
        example: 'X ~ N(μ, σ²)，σ 已知。(X̄ - μ)/(σ/√n) ~ N(0,1) 是枢轴量。由此可构造 μ 的置信区间。'
      },
      {
        id: 'fisher-information',
        name: 'Fisher信息量',
        category: '估计量的评价',
        definition: 'Fisher信息量定义为 I(θ) = E[(∂/∂θ)ln f(X;θ)]² = -E[∂²/∂θ² ln f(X;θ)]。它衡量样本中包含的关于参数 θ 的信息量。',
        plainTranslation: 'Fisher信息量告诉我们：一个观测值能提供多少关于参数的信息。信息量大，说明参数估计更精确；信息量小，说明估计更困难。比如正态分布 N(μ, σ²) 关于 μ 的Fisher信息量是 1/σ²——方差越小，信息量越大，估计越精确。',
        whyNeedIt: 'Fisher信息量是理论统计的核心概念。它给出了无偏估计量方差的下界（Cramer-Rao下界），刻画了参数估计的极限精度。',
        formula: 'I(\\theta) = E\\left[\\left(\\frac{\\partial}{\\partial\\theta}\\ln f(X;\\theta)\\right)^2\\right] = -E\\left[\\frac{\\partial^2}{\\partial\\theta^2}\\ln f(X;\\theta)\\right]',
        example: 'X ~ N(μ, σ²)，σ² 已知。I(μ) = n/σ²。样本量越大、方差越小，信息量越大。'
      },
      {
        id: 'cramer-rao-inequality',
        name: 'Cramer-Rao不等式',
        category: '估计量的评价',
        definition: '设 θ̂ 是 θ 的无偏估计量，I(θ) 是Fisher信息量。则 D(θ̂) ≥ 1/I(θ)。这个下界称为Cramer-Rao下界（CRLB）。',
        plainTranslation: 'Cramer-Rao不等式告诉我们：无偏估计量的方差不可能无限小，有一个理论下界。这个下界就像"测不准原理"——信息量有限的情况下，估计精度有极限。达到下界的估计量称为有效估计。',
        whyNeedIt: 'Cramer-Rao不等式给出了无偏估计量方差的理论下界。它帮助我们判断一个估计量是否"最优"——如果方差等于下界，就是最优无偏估计。',
        formula: 'D(\\hat{\\theta}) \\ge \\frac{1}{I(\\theta)} = \\frac{1}{n \\cdot E\\left[\\left(\\frac{\\partial}{\\partial\\theta}\\ln f(X;\\theta)\\right)^2\\right]}',
        example: 'X ~ N(μ, σ²)。X̄ 的方差 = σ²/n，CRLB = σ²/n。X̄ 达到下界，是有效估计。'
      },
      {
        id: 'efficient-estimator',
        name: '有效估计量',
        category: '估计量的评价',
        definition: '若无偏估计量 θ̂ 的方差达到Cramer-Rao下界，即 D(θ̂) = 1/I(θ)，则称 θ̂ 为 θ 的有效估计量。有效估计量是最小方差无偏估计。',
        plainTranslation: '有效估计量是"最精确的无偏估计"——它的方差已经达到理论极限，不可能再小了。就像百米赛跑的世界纪录，有效估计量达到了估计精度的"世界纪录"。',
        whyNeedIt: '有效估计量是最优的无偏估计。如果一个估计量是有效的，我们就知道它不可能被超越了。',
        formula: 'D(\\hat{\\theta}) = \\frac{1}{I(\\theta)}',
        example: '正态总体 N(μ, σ²)，σ² 已知。样本均值 X̄ 是 μ 的有效估计，因为 D(X̄) = σ²/n = 1/I(μ)。'
      },
      {
        id: 'asymptotic-normality',
        name: '渐近正态性',
        category: '大样本性质',
        definition: '若估计量 θ̂ₙ 满足 √n(θ̂ₙ - θ) 依分布收敛于 N(0, σ²)，则称 θ̂ₙ 具有渐近正态性。极大似然估计通常具有渐近正态性。',
        plainTranslation: '渐近正态性是说：当样本量足够大时，估计量的分布近似正态分布。这就像中心极限定理——大量独立信息的累积，最终呈现正态形态。有了渐近正态性，就能构造大样本置信区间和假设检验。',
        whyNeedIt: '渐近正态性是大样本推断的理论基础。它让我们在小样本精确分布未知时，仍能用正态近似进行推断。',
        formula: '\\sqrt{n}(\\hat{\\theta}_n - \\theta) \\xrightarrow{d} N(0, \\sigma^2)',
        example: 'MLE θ̂ₙ 通常满足：√n(θ̂ₙ - θ) → N(0, 1/I(θ))。'
      },
      {
        id: 'asymptotic-efficiency',
        name: '渐近有效性',
        category: '大样本性质',
        definition: '若估计量 θ̂ₙ 满足 √n(θ̂ₙ - θ) → N(0, 1/I(θ))，即渐近方差达到Cramer-Rao下界，则称 θ̂ₙ 具有渐近有效性。极大似然估计是渐近有效的。',
        plainTranslation: '渐近有效性是说：当样本量很大时，估计量的方差接近理论下界。极大似然估计在样本量足够大时，效率是最高的——这就是为什么MLE如此重要。',
        whyNeedIt: '渐近有效性是评价大样本估计量的重要标准。MLE具有渐近有效性，这是它成为最常用估计方法的原因之一。',
        formula: '\\sqrt{n}(\\hat{\\theta}_n - \\theta) \\xrightarrow{d} N\\left(0, \\frac{1}{I(\\theta)}\\right)',
        example: '泊松分布 P(λ) 的 MLE 是 X̄。√n(X̄ - λ) → N(0, λ)，渐近方差 = λ = 1/I(λ)，达到下界。'
      },
      {
        id: 'sufficient-statistic',
        name: '充分统计量',
        category: '点估计方法',
        definition: '统计量 T = T(X₁, ..., Xₙ) 称为参数 θ 的充分统计量，如果在给定 T 的条件下，样本的分布不依赖于 θ。即样本关于 θ 的全部信息都包含在 T 中。',
        plainTranslation: '充分统计量是"包含了样本所有关于参数信息的统计量"。有了充分统计量，就不需要保存原始数据了——充分统计量已经提取了所有有用信息。比如正态总体的样本均值和样本方差就是 (μ, σ²) 的充分统计量。',
        whyNeedIt: '充分统计量是数据压缩的理论基础。它告诉我们哪些统计量是"信息完备"的，可以用来简化问题。',
        formula: 'f(X_1, \\ldots, X_n | T = t) \\text{ 不依赖于 } \\theta',
        example: 'X ~ B(n, p)。T = ΣXᵢ 是 p 的充分统计量。知道总和就够了，不需要知道每个观测值。'
      },
      {
        id: 'factorization-theorem',
        name: '因子分解定理',
        category: '点估计方法',
        definition: '统计量 T 是 θ 的充分统计量，当且仅当样本的联合概率函数可分解为 f(x₁, ..., xₙ; θ) = g(T(x₁, ..., xₙ); θ) · h(x₁, ..., xₙ)，其中 h 不依赖于 θ。',
        plainTranslation: '因子分解定理给出了判断充分统计量的"操作方法"：把联合概率函数拆成两部分的乘积，一部分只通过统计量依赖于参数，另一部分完全不含参数。如果能这样拆分，这个统计量就是充分的。',
        whyNeedIt: '因子分解定理是判断充分统计量的实用工具。它把抽象的定义转化为可操作的分解过程。',
        formula: 'f(x_1, \\ldots, x_n; \\theta) = g(T(x_1, \\ldots, x_n); \\theta) \\cdot h(x_1, \\ldots, x_n)',
        example: 'X ~ N(μ, 1)。f(x) = (2π)^{-n/2} exp(-Σ(xᵢ-μ)²/2) = exp(-n(X̄-μ)²/2) · exp(-Σ(xᵢ-X̄)²/2)。X̄ 是充分统计量。'
      },
      {
        id: 'rao-blackwell-theorem',
        name: 'Rao-Blackwell定理',
        category: '点估计方法',
        definition: '设 T 是 θ 的充分统计量，θ̃ 是 θ 的任一估计量。定义 θ̂ = E(θ̃|T)，则 θ̂ 也是 θ 的估计量，且 E[(θ̂ - θ)²] ≤ E[(θ̃ - θ)²]。',
        plainTranslation: 'Rao-Blackwell定理告诉我们：给定一个估计量，用充分统计量对它做"条件期望"改进，会得到一个更好的估计量（均方误差更小）。这就像"提炼"——从粗糙的估计中提取精华。',
        whyNeedIt: 'Rao-Blackwell定理是改进估计量的重要方法。它告诉我们如何利用充分统计量得到更好的估计。',
        formula: '\\hat{\\theta} = E(\\tilde{\\theta}|T), \\quad MSE(\\hat{\\theta}) \\le MSE(\\tilde{\\theta})',
        example: '估计泊松分布 P(λ) 的概率 P(X=0)=e^{-λ}。初始估计：用第一个观测是否为0。Rao-Blackwell改进：用 ΣXᵢ 的条件期望。'
      },
      {
        id: 'lehmann-scheffe-theorem',
        name: 'Lehmann-Scheffé定理',
        category: '点估计方法',
        definition: '设 T 是 θ 的完备充分统计量，φ(T) 是 T 的函数且是 θ 的无偏估计。则 φ(T) 是 θ 的唯一最小方差无偏估计（UMVUE）。',
        plainTranslation: 'Lehmann-Scheffé定理给出了找最优无偏估计的方法：找到完备充分统计量，再找基于它的无偏估计函数，这就是UMVUE——所有无偏估计中最好的。',
        whyNeedIt: 'Lehmann-Scheffé定理是寻找最优无偏估计的理论工具。它告诉我们UMVUE存在且唯一。',
        formula: '\\hat{\\theta}_{UMVUE} = \\phi(T), \\text{ 其中 } T \\text{ 是完备充分统计量}',
        example: '正态总体 N(μ, σ²)。X̄ 是 μ 的UMVUE，S² 是 σ² 的UMVUE。'
      },
      {
        id: 'completeness',
        name: '完备性',
        category: '点估计方法',
        definition: '统计量 T 称为完备的，如果对任意函数 g，E[g(T)] = 0 对所有 θ 成立蕴含 g(T) = 0 几乎必然成立。完备性保证了基于 T 的无偏估计唯一。',
        plainTranslation: '完备性是"没有多余信息"的数学表达。如果一个统计量是完备的，那么不存在非零函数 g 使得 g(T) 的期望恒为零。完备性保证了无偏估计的唯一性。',
        whyNeedIt: '完备性是Lehmann-Scheffé定理的关键条件。完备充分统计量保证了UMVUE的唯一性。',
        formula: 'E[g(T)] = 0 \\forall \\theta \\Rightarrow g(T) = 0 \\text{ a.s.}',
        example: '指数分布 Exp(λ)，T = ΣXᵢ 是完备充分统计量。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter17',
    name: '第十七章 假设检验',
    concepts: [
      {
        id: 'hypothesis-testing',
        name: '假设检验',
        category: '基本概念',
        definition: '假设检验是对总体参数提出假设，然后根据样本信息判断假设是否成立的过程。假设检验是统计推断的另一核心方法。',
        plainTranslation: '假设检验就是"用样本数据来验证某个猜想"。比如厂家声称产品次品率不超过1%，我们抽样检验，判断这个声称是否可信。假设检验给出的是"接受"或"拒绝"的结论。',
        whyNeedIt: '假设检验是科学决策的重要工具。它让我们能用数据来验证假设，而不是凭主观判断。',
        example: '厂家声称灯泡平均寿命1000小时。随机抽取100个灯泡测试，判断这个声称是否可信。'
      },
      {
        id: 'null-hypothesis',
        name: '原假设（零假设）',
        category: '基本概念',
        definition: '原假设 H₀ 是待检验的假设，通常表示"没有差异"、"没有效果"或"符合标准"。原假设通常包含等号。',
        plainTranslation: '原假设是"默认为真的假设"，通常代表"没有变化"、"没有效果"或"符合标准"。比如"硬币是均匀的"、"药物无效"、"产品合格率≥95%"。我们默认接受原假设，除非有足够证据推翻它。',
        whyNeedIt: '原假设是假设检验的起点。假设检验的逻辑是：假设H₀为真，看样本是否提供足够证据拒绝H₀。',
        formula: 'H_0: \\theta = \\theta_0 \\text{ 或 } H_0: \\theta \\ge \\theta_0 \\text{ 或 } H_0: \\theta \\le \\theta_0',
        example: '检验硬币是否均匀。H₀: p = 0.5（硬币均匀）。检验药物是否有效。H₀: μ₁ = μ₂（两组无差异）。'
      },
      {
        id: 'alternative-hypothesis',
        name: '备择假设',
        category: '基本概念',
        definition: '备择假设 H₁ 或 Hₐ 是与原假设对立的假设，通常表示"有差异"、"有效果"或"不符合标准"。当拒绝原假设时，接受备择假设。',
        plainTranslation: '备择假设是"我们想证明的假设"，代表"有变化"、"有效果"或"不符合标准"。比如"硬币不均匀"、"药物有效"、"产品合格率<95%"。只有当样本提供足够证据时，我们才接受备择假设。',
        whyNeedIt: '备择假设定义了我们想证明的内容。假设检验的目标就是判断是否有足够证据支持备择假设。',
        formula: 'H_1: \\theta \\neq \\theta_0 \\text{（双侧）} \\text{ 或 } H_1: \\theta > \\theta_0 \\text{（右侧）} \\text{ 或 } H_1: \\theta < \\theta_0 \\text{（左侧）}',
        example: '检验硬币是否均匀。H₁: p ≠ 0.5（硬币不均匀）。检验药物是否有效。H₁: μ₁ ≠ μ₂（两组有差异）。'
      },
      {
        id: 'test-statistic',
        name: '检验统计量',
        category: '基本概念',
        definition: '检验统计量是根据样本计算的统计量，用于判断是否拒绝原假设。检验统计量的分布在原假设成立时已知。',
        plainTranslation: '检验统计量是"用来做判断的量"。比如检验均值时，用(X̄ - μ₀)/(S/√n)作为检验统计量。如果这个值太大或太小，就拒绝原假设。',
        whyNeedIt: '检验统计量把样本信息压缩成一个数值，用于做出接受或拒绝的决策。',
        formula: 'T = T(X_1, \\ldots, X_n)',
        example: '检验均值。检验统计量 t = (X̄ - μ₀)/(S/√n) ~ t(n-1)（在H₀下）。'
      },
      {
        id: 'rejection-region',
        name: '拒绝域',
        category: '基本概念',
        definition: '拒绝域是检验统计量取值的集合，当检验统计量落入该区域时拒绝原假设。拒绝域由显著性水平 α 确定。',
        plainTranslation: '拒绝域是"拒绝原假设的区域"。比如双侧检验，拒绝域在两端：检验统计量太大或太小时拒绝。拒绝域的大小由显著性水平α决定——α越小，拒绝域越小，越难拒绝原假设。',
        whyNeedIt: '拒绝域定义了什么时候拒绝原假设。它是假设检验决策的量化标准。',
        formula: 'W = \\{T: |T| > c\\} \\text{（双侧）}',
        example: '双侧t检验，α = 0.05，n = 20。拒绝域：|t| > t_{0.025}(19) = 2.093。'
      },
      {
        id: 'significance-level',
        name: '显著性水平',
        category: '基本概念',
        definition: '显著性水平 α 是犯第一类错误（弃真）的最大允许概率。常用的显著性水平有 0.10、0.05、0.01。',
        plainTranslation: '显著性水平是"允许犯错的概率上限"。α = 0.05 意味着：当原假设为真时，我们允许最多5%的概率错误地拒绝它。α越小，检验越严格，越难拒绝原假设。',
        whyNeedIt: '显著性水平控制了第一类错误的概率。它是假设检验中最重要的参数，需要在检验前设定。',
        formula: 'P(\\text{拒绝 } H_0 | H_0 \\text{ 为真}) \\le \\alpha',
        example: 'α = 0.05：最多5%概率在H₀为真时拒绝H₀。α = 0.01：最多1%概率犯错，检验更严格。'
      },
      {
        id: 'type-i-error',
        name: '第一类错误（弃真）',
        category: '两类错误',
        definition: '第一类错误是原假设为真时拒绝原假设的错误，也称为"弃真"错误。犯第一类错误的概率不超过显著性水平 α。',
        plainTranslation: '第一类错误是"冤枉好人"——原假设是对的，但我们拒绝了它。比如药物其实无效，但我们得出"药物有效"的结论。显著性水平α就是控制这类错误的概率上限。',
        whyNeedIt: '第一类错误是假设检验中最需要控制的错误。在医学、法律等领域，第一类错误的代价可能很高。',
        formula: 'P(\\text{第一类错误}) = P(\\text{拒绝 } H_0 | H_0 \\text{ 为真}) \\le \\alpha',
        example: '法庭审判：H₀ = 被告无罪。第一类错误 = 判决有罪但实际无罪（冤案）。'
      },
      {
        id: 'type-ii-error',
        name: '第二类错误（取伪）',
        category: '两类错误',
        definition: '第二类错误是原假设为假时接受原假设的错误，也称为"取伪"错误。犯第二类错误的概率记为 β。',
        plainTranslation: '第二类错误是"放走坏人"——原假设是错的，但我们接受了它。比如药物其实有效，但我们得出"药物无效"的结论。β越小，检验越能发现真实差异。',
        whyNeedIt: '第二类错误反映了检验的"灵敏度"。β越小，检验越能检测到真实的差异。',
        formula: 'P(\\text{第二类错误}) = P(\\text{接受 } H_0 | H_0 \\text{ 为假}) = \\beta',
        example: '法庭审判：H₀ = 被告无罪。第二类错误 = 判决无罪但实际有罪（漏判）。'
      },
      {
        id: 'power-of-test',
        name: '检验功效',
        category: '两类错误',
        definition: '检验功效是原假设为假时正确拒绝原假设的概率，即功效 = 1 - β。功效反映了检验发现真实差异的能力。',
        plainTranslation: '检验功效是"发现真实差异的能力"。功效 = 0.8 意味着：如果真实差异存在，我们有80%的概率能检测到它。功效越高，检验越灵敏。',
        whyNeedIt: '功效是评价检验好坏的重要指标。在实验设计时，需要确保有足够的功效检测到有意义的差异。',
        formula: '\\text{功效} = 1 - \\beta = P(\\text{拒绝 } H_0 | H_0 \\text{ 为假})',
        example: '检验药物效果。真实差异存在时，功效 = 0.8 意味着80%概率能检测到药物有效。'
      },
      {
        id: 'p-value',
        name: 'p值',
        category: '基本概念',
        definition: 'p值是在原假设为真的条件下，检验统计量取当前值或更极端值的概率。p值越小，拒绝原假设的证据越强。',
        plainTranslation: 'p值是"样本或更极端情况出现的概率"。p值小，说明在原假设下，当前样本是"小概率事件"，不太可能发生，所以拒绝原假设。p < α 时拒绝H₀。',
        whyNeedIt: 'p值是现代统计报告的标准。它比简单的"接受/拒绝"结论信息更丰富，告诉我们要拒绝H₀需要多大的显著性水平。',
        formula: 'p = P(|T| \\ge |t_{obs}| | H_0)',
        example: '检验均值，t_obs = 2.5，n = 20。p值 = P(|t| ≥ 2.5 | df=19) ≈ 0.021。若 α = 0.05，p < α，拒绝H₀。'
      },
      {
        id: 'one-sided-test',
        name: '单侧检验',
        category: '检验类型',
        definition: '单侧检验是备择假设为单侧的检验：H₁: θ > θ₀（右侧检验）或 H₁: θ < θ₀（左侧检验）。拒绝域在分布的一侧。',
        plainTranslation: '单侧检验只关心一个方向的差异。比如检验"新药是否比旧药好"（右侧检验），不关心新药是否比旧药差。单侧检验比双侧检验更容易检测到差异。',
        whyNeedIt: '当只关心一个方向的差异时，用单侧检验。单侧检验的功效比双侧检验高。',
        formula: 'H_1: \\theta > \\theta_0 \\text{（右侧）} \\Rightarrow W = \\{T > c\\}',
        example: '检验新药是否比安慰剂有效。H₀: μ = μ₀，H₁: μ > μ₀（右侧检验）。'
      },
      {
        id: 'two-sided-test',
        name: '双侧检验',
        category: '检验类型',
        definition: '双侧检验是备择假设为双侧的检验：H₁: θ ≠ θ₀。拒绝域在分布的两侧。',
        plainTranslation: '双侧检验关心两个方向的差异。比如检验"硬币是否均匀"，既关心正面概率大于0.5，也关心小于0.5。双侧检验更保守，更常用。',
        whyNeedIt: '当不确定差异方向时，用双侧检验。双侧检验是默认选择，除非有明确理由用单侧检验。',
        formula: 'H_1: \\theta \\neq \\theta_0 \\Rightarrow W = \\{|T| > c\\}',
        example: '检验某方法是否改变了平均值。H₀: μ = μ₀，H₁: μ ≠ μ₀（双侧检验）。'
      },
      {
        id: 'z-test',
        name: 'Z检验',
        category: '常用检验方法',
        definition: 'Z检验用于检验正态总体均值（方差已知）或大样本情况。检验统计量 Z = (X̄ - μ₀)/(σ/√n) ~ N(0, 1)（在H₀下）。',
        plainTranslation: 'Z检验用于方差已知或大样本情况。检验统计量服从标准正态分布。实际中方差通常未知，Z检验主要用于大样本近似。',
        whyNeedIt: 'Z检验是最基本的假设检验方法。在大样本情况下，很多检验统计量近似服从正态分布，可以用Z检验。',
        formula: 'Z = \\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim N(0, 1)',
        example: 'n = 100，σ = 10，X̄ = 52，μ₀ = 50。Z = (52-50)/(10/10) = 2。p值 = P(|Z| ≥ 2) ≈ 0.046。'
      },
      {
        id: 't-test',
        name: 't检验',
        category: '常用检验方法',
        definition: 't检验用于检验正态总体均值（方差未知）。检验统计量 t = (X̄ - μ₀)/(S/√n) ~ t(n-1)（在H₀下）。',
        plainTranslation: 't检验是最常用的均值检验方法，适用于方差未知的小样本情况。检验统计量服从t分布，比正态分布有更厚的尾部，反映了用S代替σ的不确定性。',
        whyNeedIt: 't检验是实际中最常用的均值检验方法，因为总体方差通常未知。',
        formula: 't = \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}} \\sim t(n-1)',
        example: 'n = 16，X̄ = 52，S = 10，μ₀ = 50。t = (52-50)/(10/4) = 0.8。p值 = P(|t| ≥ 0.8 | df=15) ≈ 0.44。'
      },
      {
        id: 'one-sample-t-test',
        name: '单样本t检验',
        category: '常用检验方法',
        definition: '单样本t检验用于检验单个正态总体均值是否等于某值。H₀: μ = μ₀，检验统计量 t = (X̄ - μ₀)/(S/√n) ~ t(n-1)。',
        plainTranslation: '单样本t检验用于"检验样本是否来自某个已知均值的总体"。比如检验某班级平均分是否等于全校平均分。',
        whyNeedIt: '单样本t检验是比较样本均值与标准值的基本方法。',
        formula: 't = \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}}',
        example: '全校平均分75分。某班16人，X̄ = 78，S = 8。检验该班平均分是否显著高于全校。t = (78-75)/(8/4) = 1.5，p ≈ 0.15（单侧），不显著。'
      },
      {
        id: 'two-sample-t-test',
        name: '两样本t检验',
        category: '常用检验方法',
        definition: '两样本t检验用于比较两个正态总体均值。H₀: μ₁ = μ₂，检验统计量 t = (X̄ - Ȳ)/(Sₚ·√(1/n₁ + 1/n₂)) ~ t(n₁ + n₂ - 2)。',
        plainTranslation: '两样本t检验用于"比较两组数据的均值是否有差异"。比如比较两种教学方法的效果、两种药物的疗效。',
        whyNeedIt: '两样本t检验是比较两组均值的标准方法，在医学、教育、社会科学等领域应用广泛。',
        formula: 't = \\frac{\\bar{X} - \\bar{Y}}{S_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}',
        example: '两组各20人，X̄ = 82，Ȳ = 78，Sₚ = 8。检验两组是否有差异。t = 4/(8×√0.1) ≈ 1.58，p ≈ 0.12，不显著。'
      },
      {
        id: 'paired-t-test',
        name: '配对t检验',
        category: '常用检验方法',
        definition: '配对t检验用于配对样本均值差的检验。设差值 Dᵢ = Xᵢ - Yᵢ，检验 H₀: μ_D = 0。检验统计量 t = D̄/(S_D/√n) ~ t(n-1)。',
        plainTranslation: '配对t检验用于"同一组对象前后对比"或"配对比较"。比如同一批学生期中和期末成绩对比、同一批病人治疗前后的指标对比。',
        whyNeedIt: '配对设计可以消除个体差异的影响，提高检验功效。配对t检验比两独立样本t检验更灵敏。',
        formula: 't = \\frac{\\bar{D}}{S_D/\\sqrt{n}}',
        example: '10名学生期中、期末成绩差值：D̄ = 5，S_D = 8。检验是否有进步。t = 5/(8/√10) ≈ 1.98，p ≈ 0.039（单侧），显著。'
      },
      {
        id: 'chi-square-test-for-variance',
        name: '方差检验（χ²检验）',
        category: '常用检验方法',
        definition: '方差检验用于检验正态总体方差是否等于某值。H₀: σ² = σ₀²，检验统计量 χ² = (n-1)S²/σ₀² ~ χ²(n-1)。',
        plainTranslation: '方差检验用于"检验数据的波动程度是否符合标准"。比如检验产品质量的稳定性、测量仪器的精度。',
        whyNeedIt: '方差检验在质量控制中有重要应用。方差反映了数据的稳定性，是重要的质量指标。',
        formula: '\\chi^2 = \\frac{(n-1)S^2}{\\sigma_0^2}',
        example: '标准差要求 ≤ 5。样本 n = 20，S = 6。检验是否超标。H₀: σ² ≤ 25。χ² = 19×36/25 = 27.36，p ≈ 0.12，不显著。'
      },
      {
        id: 'chi-square-goodness-of-fit-test',
        name: '拟合优度检验',
        category: 'χ²检验',
        definition: '拟合优度检验用于检验样本是否来自某个理论分布。检验统计量 χ² = Σ(Oᵢ - Eᵢ)²/Eᵢ ~ χ²(k-1-r)，其中 Oᵢ 是观测频数，Eᵢ 是期望频数，r 是估计的参数个数。',
        plainTranslation: '拟合优度检验用于"检验数据是否符合某个分布"。比如检验骰子是否均匀（各面概率相等）、检验数据是否服从正态分布。',
        whyNeedIt: '拟合优度检验是检验分布假设的基本方法。在建模前，需要验证数据是否符合模型假设。',
        formula: '\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}',
        example: '掷骰子120次，各面出现次数：18, 22, 19, 21, 20, 20。检验是否均匀。Eᵢ = 20。χ² = Σ(观测-期望)²/期望 = 0.5，p ≈ 0.99，不拒绝均匀假设。'
      },
      {
        id: 'chi-square-test-of-independence',
        name: '独立性检验',
        category: 'χ²检验',
        definition: '独立性检验用于检验两个分类变量是否独立。检验统计量 χ² = ΣΣ(Oᵢⱼ - Eᵢⱼ)²/Eᵢⱼ ~ χ²((r-1)(c-1))，其中 Eᵢⱼ = nᵢ· × n·ⱼ/n。',
        plainTranslation: '独立性检验用于"检验两个分类变量是否有关联"。比如检验"性别"和"是否吸烟"是否有关联、检验"教育程度"和"收入水平"是否有关联。',
        whyNeedIt: '独立性检验是分析分类变量关系的标准方法，在社会科学、医学研究等领域应用广泛。',
        formula: '\\chi^2 = \\sum_{i=1}^r \\sum_{j=1}^c \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}',
        example: '调查100人：男性吸烟20/不吸烟30，女性吸烟15/不吸烟35。检验性别与吸烟是否相关。χ² ≈ 0.79，p ≈ 0.37，不显著。'
      },
      {
        id: 'f-test-for-equality-of-variances',
        name: '方差齐性检验（F检验）',
        category: '常用检验方法',
        definition: '方差齐性检验用于检验两个正态总体方差是否相等。H₀: σ₁² = σ₂²，检验统计量 F = S₁²/S₂² ~ F(n₁-1, n₂-1)。',
        plainTranslation: '方差齐性检验用于"检验两组数据的波动程度是否相同"。这是两样本t检验的前提条件——如果方差不齐，需要用校正的t检验。',
        whyNeedIt: '方差齐性检验是两样本t检验的前置检验。如果方差不齐，需要用Welch校正t检验。',
        formula: 'F = \\frac{S_1^2}{S_2^2} \\sim F(n_1-1, n_2-1)',
        example: 'n₁ = n₂ = 20，S₁² = 16，S₂² = 25。检验方差是否相等。F = 16/25 = 0.64，p ≈ 0.40，方差齐。'
      },
      {
        id: 'likelihood-ratio-test',
        name: '似然比检验',
        category: '检验方法',
        definition: '似然比检验是比较原假设和备择假设下似然函数的比值。检验统计量 λ = L(θ̂₀)/L(θ̂)，其中 θ̂₀ 是 H₀ 下的 MLE，θ̂ 是无约束 MLE。-2ln λ 近似服从 χ² 分布。',
        plainTranslation: '似然比检验的思想是：如果 H₀ 为真，那么在 H₀ 约束下估计的似然函数值，应该和不受约束时差不多。如果两者差距很大，说明 H₀ 不太可能是真的。',
        whyNeedIt: '似然比检验是一种通用的假设检验方法，适用于各种复杂的假设检验问题。它有很好的大样本性质。',
        formula: '\\lambda = \\frac{L(\\hat{\\theta}_0)}{L(\\hat{\\theta})}, \\quad -2\\ln\\lambda \\xrightarrow{d} \\chi^2(r)',
        example: '检验 H₀: μ = μ₀。λ = L(μ₀)/L(X̄)。-2ln λ = n(X̄-μ₀)²/σ² ~ χ²(1)。'
      },
      {
        id: 'wald-test',
        name: 'Wald检验',
        category: '检验方法',
        definition: 'Wald检验利用参数估计的渐近正态性进行检验。检验统计量 W = (θ̂ - θ₀)²/Var(θ̂) 近似服从 χ²(1)。',
        plainTranslation: 'Wald检验的思想很简单：如果估计值 θ̂ 离假设值 θ₀ 很远（相对于标准误来说），就拒绝原假设。它只用到无约束估计，不需要计算约束估计。',
        whyNeedIt: 'Wald检验计算简单，只需要参数的点估计和标准误。在复杂模型中，Wald检验比似然比检验更容易实现。',
        formula: 'W = \\frac{(\\hat{\\theta} - \\theta_0)^2}{Var(\\hat{\\theta})} \\xrightarrow{d} \\chi^2(1)',
        example: '检验 H₀: β = 0。β̂ = 2，SE = 0.5。W = (2-0)²/0.25 = 16，p < 0.001，拒绝 H₀。'
      },
      {
        id: 'score-test',
        name: 'Score检验（Rao检验）',
        category: '检验方法',
        definition: 'Score检验利用得分函数在原假设下的值进行检验。检验统计量 S = U(θ₀)²/I(θ₀) 近似服从 χ²(1)，其中 U(θ) = ∂ln L/∂θ 是得分函数。',
        plainTranslation: 'Score检验的思想是：如果 H₀ 为真，那么得分函数（似然函数的导数）在 θ₀ 处应该接近零。如果得分函数值很大，说明 θ₀ 不是最大似然估计，H₀ 不太可能为真。',
        whyNeedIt: 'Score检验只需要计算原假设下的估计，不需要无约束估计。在某些情况下比Wald检验和似然比检验更方便。',
        formula: 'S = \\frac{U(\\theta_0)^2}{I(\\theta_0)} \\xrightarrow{d} \\chi^2(1), \\quad U(\\theta) = \\frac{\\partial \\ln L}{\\partial \\theta}',
        example: '检验 H₀: p = 0.5。n = 100，ΣXᵢ = 60。U(0.5) = (60-50)/0.25 = 40，I(0.5) = 100/0.25 = 400。S = 1600/400 = 4，p ≈ 0.046。'
      },
      {
        id: 'proportion-test',
        name: '比例检验',
        category: '常用检验方法',
        definition: '比例检验用于检验总体比例是否等于某值。H₀: p = p₀。检验统计量 Z = (p̂ - p₀)/√(p₀(1-p₀)/n) 近似服从 N(0,1)（大样本）。',
        plainTranslation: '比例检验用于"检验比例是否等于某个值"。比如检验产品次品率是否超过5%、检验民意调查支持率是否等于50%。',
        whyNeedIt: '比例检验在实际中非常常见，如质量控制、市场调研、医学研究等。',
        formula: 'Z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}} \\xrightarrow{d} N(0,1)',
        example: '检验次品率是否超过5%。抽检200件，次品15件。p̂ = 0.075。Z = (0.075-0.05)/√(0.05×0.95/200) ≈ 1.62，p ≈ 0.053（单侧），不显著。'
      },
      {
        id: 'two-proportion-test',
        name: '两比例检验',
        category: '常用检验方法',
        definition: '两比例检验用于比较两个总体比例。H₀: p₁ = p₂。检验统计量 Z = (p̂₁ - p̂₂)/√(p̂(1-p̂)(1/n₁ + 1/n₂))，其中 p̂ = (X₁ + X₂)/(n₁ + n₂) 是合并比例。',
        plainTranslation: '两比例检验用于"比较两组的比例是否有差异"。比如比较两种药物的治愈率、比较两个地区的支持率。',
        whyNeedIt: '两比例检验是比较两组比例的标准方法，在A/B测试、医学研究等领域应用广泛。',
        formula: 'Z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})(\\frac{1}{n_1} + \\frac{1}{n_2})}}',
        example: 'A组100人治愈60人，B组100人治愈50人。p̂ = 0.55。Z = (0.6-0.5)/√(0.55×0.45×0.02) ≈ 1.42，p ≈ 0.16，不显著。'
      },
      {
        id: 'nonparametric-test',
        name: '非参数检验',
        category: '非参数检验',
        definition: '非参数检验是不依赖于总体分布形式的假设检验方法。当数据不满足正态性假设或样本量很小时，非参数检验是有力的替代方案。',
        plainTranslation: '非参数检验是"不假设数据分布"的检验方法。它不要求数据服从正态分布，而是基于数据的秩（排名）进行分析。虽然功效略低，但适用范围更广。',
        whyNeedIt: '非参数检验在数据不满足正态假设、样本量小、或数据为顺序数据时是重要工具。',
        example: '比较两组数据的中心位置。如果数据严重偏态或有异常值，用Mann-Whitney U检验代替t检验。'
      },
      {
        id: 'sign-test',
        name: '符号检验',
        category: '非参数检验',
        definition: '符号检验用于检验配对样本的中位数差是否为零。只考虑差值的符号（正或负），忽略大小。在 H₀ 下，正负号的数量应接近相等。',
        plainTranslation: '符号检验是最简单的非参数检验。它只看差值是正还是负，不看差值多大。比如比较治疗前后的指标，只看"变好"和"变差"的人数是否相当。',
        whyNeedIt: '符号检验简单稳健，对异常值不敏感。适用于顺序数据或差值分布未知的情况。',
        formula: 'S^+ \\sim B(n, 0.5), \\text{ 其中 } S^+ \\text{ 是正差值的个数}',
        example: '10名患者治疗前后比较，8人好转，2人恶化。S⁺ = 8。P(S⁺ ≥ 8 | n=10, p=0.5) ≈ 0.055，边缘显著。'
      },
      {
        id: 'wilcoxon-signed-rank-test',
        name: '符号秩检验',
        category: '非参数检验',
        definition: '符号秩检验是符号检验的改进，既考虑差值的符号，又考虑差值的大小（通过秩）。检验统计量 W⁺ 是正差值秩的和。',
        plainTranslation: '符号秩检验比符号检验更灵敏——它不仅看差值是正还是负，还看差值的大小（通过排名）。差值越大，权重越高。这是配对t检验的非参数替代。',
        whyNeedIt: '符号秩检验是配对样本最常用的非参数检验，比符号检验功效更高。',
        formula: 'W^+ = \\sum_{i: d_i > 0} R_i, \\text{ 其中 } R_i \\text{ 是 } |d_i| \\text{ 的秩}',
        example: '10对数据差值：-2, 1, 3, -1, 4, 2, 5, -3, 6, 2。正差值秩和 W⁺ = 1+3+5+4+7+9+4 = 33。'
      },
      {
        id: 'mann-whitney-u-test',
        name: 'Mann-Whitney U检验',
        category: '非参数检验',
        definition: 'Mann-Whitney U检验用于比较两个独立样本的分布位置。将两组数据合并排序，计算每组的秩和。U 统计量衡量一组数据"大于"另一组的程度。',
        plainTranslation: 'Mann-Whitney U检验是两独立样本t检验的非参数替代。它把两组数据混在一起排序，看一组的值是否系统性地比另一组大。比如检验男性收入是否高于女性。',
        whyNeedIt: 'Mann-Whitney U检验是最常用的两样本非参数检验，适用于数据不满足正态假设的情况。',
        formula: 'U_1 = n_1 n_2 + \\frac{n_1(n_1+1)}{2} - R_1, \\text{ 其中 } R_1 \\text{ 是第一组的秩和}',
        example: 'A组：3, 5, 7；B组：2, 4, 6。合并排序后秩：A组秩 2, 4, 6；B组秩 1, 3, 5。R₁ = 12，U₁ = 3×3 + 6 - 12 = 3。'
      },
      {
        id: 'kruskal-wallis-test',
        name: 'Kruskal-Wallis检验',
        category: '非参数检验',
        definition: 'Kruskal-Wallis检验是单因素方差分析的非参数替代。检验多组独立样本是否来自同一分布。检验统计量 H = (12/N(N+1))·Σ(nᵢR̄ᵢ²) - 3(N+1) 近似服从 χ²(k-1)。',
        plainTranslation: 'Kruskal-Wallis检验是方差分析的非参数版本。它把所有组的数据混在一起排序，比较各组的平均秩是否相等。如果某组的平均秩明显高，说明这组值偏大。',
        whyNeedIt: 'Kruskal-Wallis检验是比较三组或更多组的标准非参数方法，适用于数据不满足正态假设的情况。',
        formula: 'H = \\frac{12}{N(N+1)}\\sum_{i=1}^k n_i \\bar{R}_i^2 - 3(N+1) \\xrightarrow{d} \\chi^2(k-1)',
        example: '三组数据各5个。合并排序后，三组平均秩分别为 4, 8, 12。H = (12/15×16)×(5×16+5×64+5×144) - 48 = 10.5，p < 0.01。'
      },
      {
        id: 'normality-test',
        name: '正态性检验',
        category: '假设检验应用',
        definition: '正态性检验用于检验数据是否来自正态分布。常用方法包括Shapiro-Wilk检验、Kolmogorov-Smirnov检验、Anderson-Darling检验等。',
        plainTranslation: '正态性检验用于"检验数据是否服从正态分布"。很多统计方法（如t检验、方差分析）都假设数据正态，所以需要先做正态性检验。',
        whyNeedIt: '正态性检验是验证参数检验假设条件的重要步骤。如果数据不正态，可能需要用非参数方法或数据变换。',
        formula: 'W = \\frac{(\\sum a_i X_{(i)})^2}{\\sum (X_i - \\bar{X})^2} \\text{ (Shapiro-Wilk)}',
        example: '样本量 n = 30，Shapiro-Wilk检验 W = 0.95，p = 0.18 > 0.05，不拒绝正态假设。'
      },
      {
        id: 'multiple-testing',
        name: '多重检验问题',
        category: '假设检验应用',
        definition: '当同时进行多个假设检验时，犯第一类错误的概率会累积增大。需要进行多重检验校正，如Bonferroni校正、FDR控制等。',
        plainTranslation: '多重检验问题是"做很多次检验时，总有一次会犯错"。比如做20次检验，每次α=0.05，至少犯一次错的概率高达64%。所以需要调整显著性水平或p值。',
        whyNeedIt: '多重检验校正在基因组学、医学研究等领域非常重要，避免假阳性结果泛滥。',
        formula: 'P(\\text{至少一次犯错}) = 1 - (1-\\alpha)^m \\ge m\\alpha - \\binom{m}{2}\\alpha^2',
        example: '做10次检验，Bonferroni校正：调整后 α = 0.05/10 = 0.005。只有p < 0.005 才算显著。'
      },
      {
        id: 'bonferroni-correction',
        name: 'Bonferroni校正',
        category: '假设检验应用',
        definition: 'Bonferroni校正是最简单的多重检验校正方法：将显著性水平除以检验次数，即 α_adj = α/m。这保证了整体犯第一类错误的概率不超过 α。',
        plainTranslation: 'Bonferroni校正的方法很简单：把显著性门槛提高。做m次检验，就把α除以m。比如做10次检验，原来α=0.05，校正后α=0.005。这样保证总体犯错概率不超过5%。',
        whyNeedIt: 'Bonferroni校正简单直观，是最常用的多重检验校正方法。但它比较保守，可能漏掉真实效应。',
        formula: '\\alpha_{adj} = \\frac{\\alpha}{m}',
        example: '比较5种药物与对照组。做5次检验，Bonferroni校正后 α = 0.05/5 = 0.01。'
      },
      {
        id: 'fdr-control',
        name: 'FDR控制（错误发现率）',
        category: '假设检验应用',
        definition: '错误发现率（FDR）是拒绝的原假设中实际为真的比例的期望。Benjamini-Hochberg方法控制 FDR ≤ q，比Bonferroni校正更宽松，检验功效更高。',
        plainTranslation: 'FDR控制是"允许一定比例的假阳性"。Bonferroni太严格，FDR允许在所有发现的结果中，有一定比例是假阳性。比如FDR=0.1，意味着发现的10个显著结果中，平均有1个是假阳性。',
        whyNeedIt: 'FDR控制在探索性研究、基因组学等领域广泛使用，在控制假阳性的同时保持较高的检验功效。',
        formula: 'FDR = E\\left[\\frac{V}{R}\\right], \\text{ 其中 } V \\text{ 是假阳性数，} R \\text{ 是拒绝数}',
        example: '1000个基因检验，发现100个显著。FDR=0.1 意味着约10个是假阳性，90个是真阳性。'
      },
      {
        id: 'oc-power-function',
        name: 'OC函数与功效函数',
        category: '假设检验',
        definition: 'OC函数（操作特征函数）：β(θ) = P{接受H₀ | θ}，即在不同参数值下接受H₀的概率。功效函数：1-β(θ) = P{拒绝H₀ | θ}。当θ∈H₁时，1-β(θ)就是检验功效。',
        plainTranslation: 'OC函数描述的是"检验在各个参数值下有多大可能接受H₀"。当H₀为真时OC值应接近1-α，当H₁为真时OC值应接近0（即功效接近1）。好的检验应该让OC函数在H₀区域高、在H₁区域低，形成"断崖式"下降。',
        whyNeedIt: 'OC函数和功效函数是评价检验"鉴别力"的量化工具。在样本量设计中，常需要指定功效水平来反推样本量。',
        formula: '\\beta(\\theta) = P\\{\\text{接受}H_0|\\theta\\}, \\quad \\text{功效} = 1 - \\beta(\\theta), \\theta \\in H_1'
      },
      {
        id: 'test-ci-duality',
        name: '假设检验与区间估计的对偶性',
        category: '假设检验',
        definition: 'μ的1-α置信区间 = {μ₀ : 在α水平下不拒绝H₀: μ=μ₀}。反之，在H₀: μ=μ₀的α水平检验中，接受域恰好对应μ的1-α置信区间。',
        plainTranslation: '假设检验和区间估计是一枚硬币的两面。置信区间就是"所有不被拒绝的μ₀值组成的集合"——你把每个μ₀都检验一遍，接受的就是置信区间里的值。所以知道了一个就能推出另一个。',
        whyNeedIt: '对偶性让我们可以在检验和估计之间自由切换，提供了两种等价的统计推断方式。理解对偶性可以加深对统计推断本质的理解。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter18',
    name: '第十八章 方差分析及回归分析',
    concepts: [
      {
        id: 'anova',
        name: '方差分析（ANOVA）',
        category: '方差分析基础',
        definition: '方差分析是用于比较多个总体均值是否相等的方法。基本思想是将总变异分解为组间变异和组内变异，通过比较判断各组均值是否有显著差异。',
        plainTranslation: '方差分析用于"比较三组或更多组的均值是否有差异"。比如比较三种教学方法的效果、比较四种药物的疗效。方差分析是t检验的推广——t检验只能比较两组，方差分析可以比较多组。',
        whyNeedIt: '方差分析是比较多个组均值的标准方法。如果用多次t检验，会增加犯第一类错误的概率，方差分析避免了这个问题。',
        example: '比较三种教学方法对学生成绩的影响。随机分配学生到三组，用方差分析检验三组平均分是否有显著差异。'
      },
      {
        id: 'one-way-anova',
        name: '单因素方差分析',
        category: '方差分析类型',
        definition: '单因素方差分析研究一个因素对试验指标的影响。设有 k 个水平，每个水平 nᵢ 个观测。总变异 SST = SSA + SSE，其中 SSA 是组间平方和，SSE 是组内平方和。',
        plainTranslation: '单因素方差分析研究"一个因素"的影响。比如研究"教学方法"对学生成绩的影响，教学方法有3种（3个水平）。总变异 = 组间变异（方法差异造成） + 组内变异（随机误差）。',
        whyNeedIt: '单因素方差分析是最基本的方差分析，用于研究单个因素的影响。',
        formula: 'SST = SSA + SSE, \\quad F = \\frac{MSA}{MSE} = \\frac{SSA/(k-1)}{SSE/(N-k)}',
        example: '三种教学方法，每组10人。组间平方和SSA = 150，组内平方和SSE = 270。F = (150/2)/(270/27) = 7.5，p < 0.01，三组有显著差异。'
      },
      {
        id: 'anova-assumptions',
        name: '方差分析的假设条件',
        category: '方差分析基础',
        definition: '方差分析的基本假设：(1) 正态性：各组数据来自正态总体；(2) 方差齐性：各组总体方差相等；(3) 独立性：各观测值相互独立。',
        plainTranslation: '方差分析有三个前提条件：数据要正态分布、各组方差要相等、数据要独立。如果不满足，需要用非参数方法或做数据变换。',
        whyNeedIt: '方差分析的结果只有在假设条件满足时才可靠。实际应用中需要检验这些假设。',
        formula: 'X_{ij} \\sim N(\\mu_i, \\sigma^2), \\quad \\text{各组独立}',
        example: '检验方差齐性：用Levene检验或Bartlett检验。检验正态性：用Shapiro-Wilk检验或Q-Q图。'
      },
      {
        id: 'sum-of-squares-total',
        name: '总平方和（SST）',
        category: '平方和分解',
        definition: '总平方和 SST = ΣᵢΣⱼ(Xᵢⱼ - X̄)²，反映所有观测值与总均值的偏离程度。SST = SSA + SSE。',
        plainTranslation: '总平方和是"所有数据与总均值的偏离程度"。它反映了数据的总变异，可以分解为组间变异和组内变异两部分。',
        whyNeedIt: '总平方和是方差分析的起点。分解总平方和，可以了解变异的来源。',
        formula: 'SST = \\sum_{i=1}^k \\sum_{j=1}^{n_i} (X_{ij} - \\bar{X})^2',
        example: '30个数据，总均值75。SST = Σ(每个数据-75)² = 420。'
      },
      {
        id: 'sum-of-squares-between',
        name: '组间平方和（SSA）',
        category: '平方和分解',
        definition: '组间平方和 SSA = Σᵢnᵢ(X̄ᵢ - X̄)²，反映各组均值与总均值的偏离程度，反映因素效应。',
        plainTranslation: '组间平方和是"各组均值之间的差异"。它反映了因素造成的变异——如果各组均值差异大，组间平方和就大。',
        whyNeedIt: '组间平方和反映了因素效应的大小。SSA越大，说明各组差异越大，因素效应越明显。',
        formula: 'SSA = \\sum_{i=1}^k n_i (\\bar{X}_i - \\bar{X})^2',
        example: '三组均值：70, 75, 80，各10人，总均值75。SSA = 10×[(70-75)² + (75-75)² + (80-75)²] = 500。'
      },
      {
        id: 'sum-of-squares-within',
        name: '组内平方和（SSE）',
        category: '平方和分解',
        definition: '组内平方和 SSE = ΣᵢΣⱼ(Xᵢⱼ - X̄ᵢ)²，反映各组内部观测值与组均值的偏离程度，反映随机误差。',
        plainTranslation: '组内平方和是"各组内部的变异"。它反映了随机误差——即使没有因素效应，各组内部也会有差异。',
        whyNeedIt: '组内平方和反映了随机误差的大小。SSE越大，说明数据越分散，随机误差越大。',
        formula: 'SSE = \\sum_{i=1}^k \\sum_{j=1}^{n_i} (X_{ij} - \\bar{X}_i)^2',
        example: '第一组数据：68, 70, 72，均值70。组内平方和 = (68-70)² + (70-70)² + (72-70)² = 8。'
      },
      {
        id: 'mean-square',
        name: '均方（MS）',
        category: '平方和分解',
        definition: '均方是平方和除以自由度。组间均方 MSA = SSA/(k-1)，组内均方 MSE = SSE/(N-k)。',
        plainTranslation: '均方是"平均的平方和"。为什么要除以自由度？因为平方和会随数据量和组数变化，除以自由度后可以公平比较。',
        whyNeedIt: '均方用于构造F统计量。MSA反映组间变异，MSE反映组内变异（误差），F = MSA/MSE。',
        formula: 'MSA = \\frac{SSA}{k-1}, \\quad MSE = \\frac{SSE}{N-k}',
        example: 'SSA = 150，k = 3。MSA = 150/2 = 75。SSE = 270，N = 30。MSE = 270/27 = 10。'
      },
      {
        id: 'f-test-in-anova',
        name: '方差分析中的F检验',
        category: '方差分析基础',
        definition: '在方差分析中，检验 H₀: μ₁ = μ₂ = ... = μₖ 用 F 统计量：F = MSA/MSE ~ F(k-1, N-k)。当 F > F_{α}(k-1, N-k) 时拒绝 H₀。',
        plainTranslation: 'F检验比较组间变异和组内变异。如果组间变异远大于组内变异（F值大），说明各组均值差异显著。F值越大，p值越小，越拒绝原假设。',
        whyNeedIt: 'F检验是方差分析的核心。它告诉我们各组均值是否有显著差异。',
        formula: 'F = \\frac{MSA}{MSE} \\sim F(k-1, N-k)',
        example: 'MSA = 75，MSE = 10。F = 75/10 = 7.5。F_{0.05}(2, 27) = 3.35。F > 临界值，拒绝H₀。'
      },
      {
        id: 'two-way-anova',
        name: '双因素方差分析',
        category: '方差分析类型',
        definition: '双因素方差分析研究两个因素对试验指标的影响。总变异分解为：SST = SSA + SSB + SSAB + SSE，其中SSA是因素A的效应，SSB是因素B的效应，SSAB是交互效应。',
        plainTranslation: '双因素方差分析研究"两个因素"的影响。比如研究"教学方法"和"学习时间"对学生成绩的影响，还考虑它们的交互作用（某些方法可能只对长时间学习有效）。',
        whyNeedIt: '双因素方差分析可以同时研究两个因素及其交互作用，比做两次单因素分析更高效、更准确。',
        formula: 'SST = SSA + SSB + SSAB + SSE',
        example: '研究教学方法（3种）和学习时间（2种）对成绩的影响。需要检验：教学方法效应、学习时间效应、交互效应。'
      },
      {
        id: 'interaction-effect',
        name: '交互效应',
        category: '方差分析类型',
        definition: '交互效应是指一个因素的效应依赖于另一个因素的水平。SSAB 反映交互效应的大小。',
        plainTranslation: '交互效应是"一个因素的效果取决于另一个因素"。比如教学方法A对短时间学习者效果好，方法B对长时间学习者效果好——这就是交互效应。',
        whyNeedIt: '交互效应揭示了因素之间的复杂关系。如果存在显著交互效应，不能单独解释各因素的主效应。',
        formula: 'SSAB = \\text{交互平方和}',
        example: '药物A对男性效果好，药物B对女性效果好——性别和药物类型有交互效应。'
      },
      {
        id: 'linear-regression',
        name: '线性回归',
        category: '回归分析基础',
        definition: '线性回归研究因变量 Y 与自变量 X 之间的线性关系。一元线性回归模型：Y = β₀ + β₁X + ε，其中 ε ~ N(0, σ²)。',
        plainTranslation: '线性回归用"直线"来描述两个变量的关系。比如用身高预测体重、用学习时间预测成绩。回归分析找到一条"最佳拟合直线"，使预测误差最小。',
        whyNeedIt: '线性回归是最基本的预测模型。它简单、直观、可解释性强，是数据分析的基础工具。',
        formula: 'Y = \\beta_0 + \\beta_1 X + \\epsilon',
        example: '用学习时间X预测成绩Y。回归方程：Y = 50 + 3X。学习10小时，预测成绩 = 50 + 3×10 = 80分。'
      },
      {
        id: 'least-squares-method',
        name: '最小二乘法',
        category: '回归分析基础',
        definition: '最小二乘法通过最小化残差平方和来估计回归系数。残差平方和 Q = Σ(yᵢ - ŷᵢ)² = Σ(yᵢ - β₀ - β₁xᵢ)²。使 Q 最小的 β₀, β₁ 称为最小二乘估计。',
        plainTranslation: '最小二乘法找一条"让预测误差平方和最小"的直线。为什么用平方？因为平方可以消除正负抵消，而且数学上容易处理。',
        whyNeedIt: '最小二乘法是估计回归系数的标准方法。它有很好的统计性质：无偏性、一致性、高斯-马尔可夫定理保证的BLUE性质。',
        formula: '\\min_{\\beta_0, \\beta_1} \\sum_{i=1}^n (y_i - \\beta_0 - \\beta_1 x_i)^2',
        example: '数据点：(1,2), (2,4), (3,5)。最小二乘直线：ŷ = 1 + 1.5x。残差平方和 = (2-2.5)² + (4-4)² + (5-5.5)² = 0.5。'
      },
      {
        id: 'regression-coefficient',
        name: '回归系数',
        category: '回归分析基础',
        definition: '回归系数 β₁ 表示 X 每增加一个单位，Y 平均变化的量。β₀ 是截距，表示 X = 0 时 Y 的期望值。',
        plainTranslation: '回归系数β₁是"斜率"，表示X增加1单位，Y变化多少。比如回归方程"体重 = -100 + 0.9×身高"，β₁ = 0.9表示身高每增加1cm，体重平均增加0.9kg。',
        whyNeedIt: '回归系数是回归分析的核心结果。它量化了自变量对因变量的影响程度和方向。',
        formula: '\\hat{\\beta}_1 = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sum(x_i - \\bar{x})^2}',
        example: '学习时间与成绩的回归：成绩 = 50 + 3×时间。β₁ = 3 表示每多学1小时，成绩平均提高3分。'
      },
      {
        id: 'residual',
        name: '残差',
        category: '回归分析基础',
        definition: '残差 eᵢ = yᵢ - ŷᵢ 是观测值与预测值之差。残差反映了模型未能解释的变异。',
        plainTranslation: '残差是"预测误差"——实际值减去预测值。残差小，说明预测准确；残差大，说明预测偏差大。分析残差可以检验模型假设是否满足。',
        whyNeedIt: '残差分析是检验回归模型假设的重要方法。通过残差图可以判断线性假设、正态假设、方差齐性假设是否满足。',
        formula: 'e_i = y_i - \\hat{y}_i',
        example: '实际成绩85分，预测成绩80分。残差 = 85 - 80 = 5分。'
      },
      {
        id: 'coefficient-of-determination',
        name: '决定系数（R²）',
        category: '回归分析基础',
        definition: '决定系数 R² = SSR/SST = 1 - SSE/SST，表示回归模型解释的变异占总变异的比例。R² ∈ [0, 1]，R² 越接近 1，模型拟合越好。',
        plainTranslation: '决定系数R²表示"模型解释了多少变异"。R² = 0.8 表示模型解释了80%的变异，还有20%无法解释。R²越高，模型拟合越好。',
        whyNeedIt: 'R²是评价回归模型拟合优度的标准指标。但要注意：R²高不一定模型好，可能存在过拟合。',
        formula: 'R^2 = \\frac{SSR}{SST} = 1 - \\frac{SSE}{SST}',
        example: 'SST = 100，SSE = 20。R² = 1 - 20/100 = 0.8。模型解释了80%的变异。'
      },
      {
        id: 'adjusted-r-squared',
        name: '调整决定系数',
        category: '回归分析基础',
        definition: '调整决定系数 R²_adj = 1 - (1-R²)(n-1)/(n-p-1)，其中 p 是自变量个数。调整决定系数对增加自变量有惩罚，避免过拟合。',
        plainTranslation: '调整R²是"惩罚了的自变量数量后的R²"。增加自变量总会提高R²，但调整R²可能会降低——如果增加的自变量没有实质贡献。',
        whyNeedIt: '调整R²是比较不同模型的标准。在多元回归中，应该看调整R²而不是R²。',
        formula: 'R^2_{adj} = 1 - \\frac{(1-R^2)(n-1)}{n-p-1}',
        example: 'n = 100，p = 5，R² = 0.85。调整R² = 1 - 0.15×99/94 ≈ 0.842。'
      },
      {
        id: 'correlation-coefficient-regression',
        name: '相关系数与回归',
        category: '回归分析基础',
        definition: '在一元线性回归中，相关系数 r 与回归系数 β̂₁ 的关系：β̂₁ = r·(S_y/S_x)。决定系数 R² = r²。',
        plainTranslation: '相关系数和回归系数有密切关系。相关系数衡量线性关系的强度，回归系数衡量线性关系的斜率。R² = r²，说明相关系数的平方就是决定系数。',
        whyNeedIt: '这个关系连接了相关分析和回归分析。相关分析描述关系强度，回归分析描述关系形式。',
        formula: '\\hat{\\beta}_1 = r \\cdot \\frac{S_y}{S_x}, \\quad R^2 = r^2',
        example: '身高和体重的相关系数 r = 0.8。R² = 0.64，回归模型解释了64%的变异。'
      },
      {
        id: 'hypothesis-test-for-regression',
        name: '回归系数的假设检验',
        category: '回归推断',
        definition: '检验回归系数是否显著：H₀: β₁ = 0。检验统计量 t = β̂₁/SE(β̂₁) ~ t(n-2)。若 |t| > t_{α/2}(n-2)，拒绝 H₀。',
        plainTranslation: '回归系数检验回答"X对Y是否有显著影响"。如果β₁显著不为0，说明X确实影响Y；如果β₁不显著，说明X对Y没有线性影响。',
        whyNeedIt: '回归系数检验是回归分析的核心推断。只有系数显著，才能说X对Y有影响。',
        formula: 't = \\frac{\\hat{\\beta}_1}{SE(\\hat{\\beta}_1)} \\sim t(n-2)',
        example: 'β̂₁ = 3，SE(β̂₁) = 1，n = 30。t = 3/1 = 3，p < 0.01，系数显著。'
      },
      {
        id: 'confidence-interval-for-regression',
        name: '回归系数的置信区间',
        category: '回归推断',
        definition: '回归系数 β₁ 的 1-α 置信区间：[β̂₁ - t_{α/2}(n-2)·SE(β̂₁), β̂₁ + t_{α/2}(n-2)·SE(β̂₁)]。',
        plainTranslation: '回归系数置信区间给出系数的估计范围。如果置信区间不包含0，说明系数显著；如果包含0，说明不显著。',
        whyNeedIt: '置信区间比假设检验信息更丰富，既给出显著性判断，又给出系数的大致范围。',
        formula: '[\\hat{\\beta}_1 - t_{\\alpha/2}(n-2) \\cdot SE(\\hat{\\beta}_1), \\hat{\\beta}_1 + t_{\\alpha/2}(n-2) \\cdot SE(\\hat{\\beta}_1)]',
        example: 'β̂₁ = 3，SE = 1，n = 30。95%置信区间：[3 - 2.048×1, 3 + 2.048×1] = [0.95, 5.05]。'
      },
      {
        id: 'prediction-interval',
        name: '预测区间',
        category: '回归推断',
        definition: '对于给定的 x₀，Y 的预测值 ŷ₀ = β̂₀ + β̂₁x₀。Y 的 1-α 预测区间比置信区间更宽，因为它包含个体变异。',
        plainTranslation: '预测区间是"对新观测值的预测范围"。比如已知某人身高180cm，预测其体重的范围。预测区间比均值的置信区间更宽，因为个体差异比均值差异大。',
        whyNeedIt: '预测区间是回归模型实际应用的核心。它给出了预测的不确定性范围。',
        formula: '[\\hat{y}_0 - t_{\\alpha/2} \\cdot s \\cdot \\sqrt{1 + \\frac{1}{n} + \\frac{(x_0-\\bar{x})^2}{\\sum(x_i-\\bar{x})^2}}, \\hat{y}_0 + t_{\\alpha/2} \\cdot s \\cdot \\sqrt{\\cdots}]',
        example: '身高180cm，预测体重。预测值70kg，预测区间[62, 78]kg（95%置信）。'
      },
      {
        id: 'multiple-linear-regression',
        name: '多元线性回归',
        category: '多元回归',
        definition: '多元线性回归研究因变量 Y 与多个自变量 X₁, X₂, ..., Xₚ 的线性关系。模型：Y = β₀ + β₁X₁ + ... + βₚXₚ + ε。',
        plainTranslation: '多元回归用"多个变量"来预测Y。比如用身高、年龄、性别预测体重。多元回归可以控制其他变量，研究每个变量的"净效应"。',
        whyNeedIt: '实际问题通常受多个因素影响。多元回归可以同时考虑多个因素，提高预测精度。',
        formula: 'Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + \\cdots + \\beta_p X_p + \\epsilon',
        example: '预测房价：价格 = 50 + 0.5×面积 + 10×卧室数 - 5×房龄。'
      },
      {
        id: 'multicollinearity',
        name: '多重共线性',
        category: '多元回归',
        definition: '多重共线性是指自变量之间存在高度相关关系。多重共线性会导致回归系数估计不稳定，标准误增大。',
        plainTranslation: '多重共线性是"自变量之间太相关"。比如用"身高"和"腿长"预测体重，这两个变量高度相关，模型无法区分它们各自的贡献。',
        whyNeedIt: '多重共线性是多元回归的常见问题。需要检测和处理，否则回归结果不可靠。',
        formula: 'VIF = \\frac{1}{1-R_j^2} > 10 \\Rightarrow \\text{严重共线性}',
        example: '身高和腿长的相关系数0.95。用它们预测体重，系数估计不稳定。'
      },
      {
        id: 'model-selection',
        name: '模型选择',
        category: '多元回归',
        definition: '模型选择是从多个候选模型中选择最优模型的方法。常用准则：调整R²、AIC、BIC、逐步回归等。',
        plainTranslation: '模型选择是"选择最好的变量组合"。不是变量越多越好——变量太多会过拟合，变量太少会欠拟合。需要在简洁性和拟合度之间平衡。',
        whyNeedIt: '模型选择是建立回归模型的关键步骤。好的模型应该简洁、可解释、预测准确。',
        formula: 'AIC = n\\ln(SSE/n) + 2p, \\quad BIC = n\\ln(SSE/n) + p\\ln(n)',
        example: '比较两个模型：模型1（3个变量）R²=0.85，模型2（5个变量）R²=0.86。调整R²或AIC可能选择模型1。'
      },
      {
        id: 'multiple-comparison',
        name: '多重比较',
        category: '方差分析进阶',
        definition: '当方差分析拒绝原假设后，需要进行多重比较确定哪些组之间有差异。常用方法：LSD法、Tukey法、Bonferroni法、Scheffé法等。',
        plainTranslation: '多重比较是"方差分析后的精细比较"。方差分析只告诉我们"有差异"，多重比较告诉我们"谁和谁有差异"。比如比较四种教学方法，方差分析发现至少有一种方法不同，多重比较找出具体哪几种方法有差异。',
        whyNeedIt: '多重比较是方差分析的后续步骤。它解决了"哪些组之间有差异"的问题，同时控制整体犯第一类错误的概率。',
        formula: '\\text{Tukey HSD}: q_{\\alpha}(k, N-k)\\sqrt{MSE/n}',
        example: '三组均值比较，方差分析显著。Tukey检验发现：组1和组2差异显著，组2和组3差异显著，组1和组3无显著差异。'
      },
      {
        id: 'lsd-method',
        name: 'LSD法（最小显著差法）',
        category: '方差分析进阶',
        definition: 'LSD法是最简单的多重比较方法。若 |X̄ᵢ - X̄ⱼ| > t_{α/2}(N-k)·√(MSE·(1/nᵢ + 1/nⱼ))，则认为组 i 和组 j 有显著差异。',
        plainTranslation: 'LSD法就是"多次t检验"——对每对组做一次t检验。简单直接，但会累积第一类错误——比较次数越多，假阳性概率越高。',
        whyNeedIt: 'LSD法计算简单，但只适用于比较次数很少的情况。比较次数多时，需要用更保守的方法。',
        formula: '|\\bar{X}_i - \\bar{X}_j| > t_{\\alpha/2}(N-k)\\sqrt{MSE(\\frac{1}{n_i} + \\frac{1}{n_j})}',
        example: '三组比较，MSE = 10，n = 10。t_{0.025}(27) = 2.052。LSD = 2.052×√(10×0.2) = 2.90。组间差值 > 2.90 才显著。'
      },
      {
        id: 'tukey-method',
        name: 'Tukey法',
        category: '方差分析进阶',
        definition: 'Tukey法用学生化极差分布控制整体错误率。临界值 = q_α(k, N-k)·√(MSE/n)，其中 q_α 是学生化极差的上分位数。',
        plainTranslation: 'Tukey法是"最常用的多重比较方法"。它控制"所有两两比较中至少犯一次错的概率"，比LSD更保守，但比Bonferroni更宽松。',
        whyNeedIt: 'Tukey法是平衡功效和错误控制的最佳选择，适用于所有两两比较的情况。',
        formula: 'HSD = q_{\\alpha}(k, N-k)\\sqrt{MSE/n}',
        example: '三组各10人，MSE = 10。q_{0.05}(3, 27) = 3.51。HSD = 3.51×√(10/10) = 3.51。组间差值 > 3.51 才显著。'
      },
      {
        id: 'anova-table',
        name: '方差分析表',
        category: '方差分析基础',
        definition: '方差分析表是汇总方差分析结果的表格，包含变异来源、平方和、自由度、均方、F值、p值等信息。',
        plainTranslation: '方差分析表是"方差分析的结果汇总"。它清晰地展示了变异的分解：总变异来自哪里？组间变异多大？组内变异多大？F值多少？是否显著？',
        whyNeedIt: '方差分析表是报告方差分析结果的标准格式，让读者一目了然地看到分析结果。',
        formula: '\\text{来源} | \\text{平方和} | \\text{自由度} | \\text{均方} | F | p',
        example: '来源：组间、组内、总计。SSA=150, SSE=270, SST=420。df：2, 27, 29。MS：75, 10。F=7.5, p<0.01。'
      },
      {
        id: 'residual-analysis',
        name: '残差分析',
        category: '回归诊断',
        definition: '残差分析是通过分析残差来检验回归模型假设的方法。主要检验：线性假设、正态性假设、方差齐性假设、独立性假设。',
        plainTranslation: '残差分析是"检查模型是否靠谱"。残差是模型没解释的部分，如果残差有规律，说明模型有问题。比如残差呈漏斗形，说明方差不齐；残差有曲线趋势，说明线性假设不成立。',
        whyNeedIt: '残差分析是验证回归模型假设的核心方法。只有假设满足，回归结果才可靠。',
        formula: 'e_i = y_i - \\hat{y}_i',
        example: '残差图：横轴是预测值，纵轴是残差。理想情况：残差随机散布在0附近。异常情况：残差有趋势或漏斗形。'
      },
      {
        id: 'normal-probability-plot',
        name: '正态概率图（Q-Q图）',
        category: '回归诊断',
        definition: '正态概率图用于检验残差是否服从正态分布。将残差分位数与正态分布分位数对比，若点大致在一条直线上，则正态假设成立。',
        plainTranslation: '正态概率图是"看残差是否正态"的图形方法。把残差排序，画在图上。如果点大致在一条直线上，说明残差正态；如果严重弯曲，说明残差不正态。',
        whyNeedIt: '正态概率图是检验正态假设的标准图形方法，比正态性检验更直观。',
        formula: '\\text{Q-Q图：残差分位数 vs 正态分位数}',
        example: '30个残差的Q-Q图。点大致在直线上，正态假设成立。如果呈S形，说明残差有厚尾。'
      },
      {
        id: 'heteroscedasticity',
        name: '异方差性',
        category: '回归诊断',
        definition: '异方差性是指残差的方差不是常数，即 Var(εᵢ) 不是常数。异方差会导致OLS估计不再是最优的，标准误估计有偏。',
        plainTranslation: '异方差是"不同x值处，残差的波动不同"。比如预测收入：低收入人群收入波动小，高收入人群收入波动大——这就是异方差。',
        whyNeedIt: '异方差是回归分析中常见的问题。需要检测并处理，否则假设检验和置信区间不可靠。',
        formula: 'Var(\\epsilon_i) = \\sigma_i^2 \\neq \\text{常数}',
        example: '残差图呈漏斗形：预测值小时残差波动小，预测值大时残差波动大。这是异方差的典型特征。'
      },
      {
        id: 'weighted-least-squares',
        name: '加权最小二乘法',
        category: '回归诊断',
        definition: '加权最小二乘法（WLS）用于处理异方差。给每个观测赋予权重 wᵢ = 1/σᵢ²，使方差大的观测权重小，方差小的观测权重大。',
        plainTranslation: '加权最小二乘是"给不同数据不同权重"的回归方法。方差大的数据不可靠，给它小权重；方差小的数据可靠，给它大权重。这样可以得到更精确的估计。',
        whyNeedIt: '加权最小二乘是处理异方差的标准方法。当异方差结构已知时，WLS比OLS更有效。',
        formula: '\\min \\sum w_i(y_i - \\beta_0 - \\beta_1 x_i)^2, \\quad w_i = 1/\\sigma_i^2',
        example: '收入数据：低收入方差小，高收入方差大。用WLS，给低收入数据更大权重。'
      },
      {
        id: 'influential-point',
        name: '影响点',
        category: '回归诊断',
        definition: '影响点是对回归结果有重大影响的观测点。常用诊断量：杠杆值、Cook距离、DFBETAS等。影响点可能是异常值，也可能是真实但极端的观测。',
        plainTranslation: '影响点是"一个点改变整个回归结果"的点。删掉这个点，回归线可能完全改变。比如数据集中有一个极端的富人，删掉他后，收入-消费关系的斜率可能完全不同。',
        whyNeedIt: '影响点分析帮助识别对结果有重大影响的观测。需要判断是数据错误还是真实现象，决定如何处理。',
        formula: 'Cook\\ D_i = \\frac{e_i^2}{p \\cdot MSE}\\left(\\frac{h_{ii}}{(1-h_{ii})^2}\\right)',
        example: 'Cook距离 > 1 或 > 4/n 的点可能是影响点。需要仔细检查这些点。'
      },
      {
        id: 'leverage',
        name: '杠杆值',
        category: '回归诊断',
        definition: '杠杆值 hᵢᵢ 是帽子矩阵 H 的对角元素，衡量第 i 个观测在确定其预测值时的"影响力"。杠杆值高意味着该观测点的 x 值远离数据中心。',
        plainTranslation: '杠杆值衡量"一个点在x方向上有多极端"。x值离平均值越远，杠杆值越高。高杠杆点就像杠杆的支点，可以"撬动"回归线。',
        whyNeedIt: '杠杆值帮助识别在x方向上极端的观测点。高杠杆点可能是影响点，需要特别关注。',
        formula: 'h_{ii} = \\frac{1}{n} + \\frac{(x_i - \\bar{x})^2}{\\sum(x_j - \\bar{x})^2}',
        example: '杠杆值范围 [1/n, 1]。hᵢᵢ > 2(p+1)/n 的点可能是高杠杆点。'
      },
      {
        id: 'outlier-detection',
        name: '异常值检测',
        category: '回归诊断',
        definition: '异常值是与其他观测明显不同的数据点。在回归中，常用学生化残差或标准化残差检测异常值。|学生化残差| > 2 或 3 的点可能是异常值。',
        plainTranslation: '异常值是"格格不入的点"——它的y值与预测值相差很大。比如身高180cm的人体重只有40kg，这就是异常值。',
        whyNeedIt: '异常值可能是数据错误，也可能是真实但极端的现象。需要识别并决定如何处理。',
        formula: 'r_i = \\frac{e_i}{s\\sqrt{1-h_{ii}}} \\text{（学生化残差）}',
        example: '学生化残差 > 2 或 < -2 的点可能是异常值。需要检查是否为数据录入错误。'
      },
      {
        id: 'polynomial-regression',
        name: '多项式回归',
        category: '回归扩展',
        definition: '多项式回归是用 x 的多项式函数拟合 Y：Y = β₀ + β₁X + β₂X² + ... + βₖXᵏ + ε。多项式回归可以拟合非线性关系。',
        plainTranslation: '多项式回归用"曲线"拟合数据。当直线拟合不好时，可以用二次、三次多项式。比如身高和年龄的关系，儿童期快速增长，成年后稳定，用二次函数拟合更合适。',
        whyNeedIt: '多项式回归是处理非线性关系的简单方法。但要注意不要过度拟合——多项式次数太高会追逐噪声。',
        formula: 'Y = \\beta_0 + \\beta_1 X + \\beta_2 X^2 + \\cdots + \\beta_k X^k + \\epsilon',
        example: '产量与施肥量的关系：产量 = 10 + 5×施肥 - 0.1×施肥²。二次项为负，说明施肥过多反而减产。'
      },
      {
        id: 'interaction-term',
        name: '交互项',
        category: '回归扩展',
        definition: '交互项是两个自变量的乘积，用于建模一个自变量的效应依赖于另一个自变量的情况。模型：Y = β₀ + β₁X₁ + β₂X₂ + β₃X₁X₂ + ε。',
        plainTranslation: '交互项捕捉"一个变量的效果取决于另一个变量"。比如药物剂量对疗效的影响，可能因年龄而异——年轻人剂量增加效果好，老年人剂量增加效果不明显。这就是交互效应。',
        whyNeedIt: '交互项让模型更灵活，可以捕捉变量间的复杂关系。但解释时要小心——有交互项时，主效应的含义会改变。',
        formula: 'Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + \\beta_3 X_1 X_2 + \\epsilon',
        example: '预测工资：工资 = β₀ + β₁×教育 + β₂×性别 + β₃×教育×性别。交互项显著说明教育回报因性别而异。'
      },
      {
        id: 'dummy-variable',
        name: '虚拟变量',
        category: '回归扩展',
        definition: '虚拟变量是用0和1编码的分类变量。对于有 k 个水平的分类变量，需要 k-1 个虚拟变量。虚拟变量的系数表示相对于参照水平的差异。',
        plainTranslation: '虚拟变量把分类变量变成数字，让回归模型能处理。比如性别：男=0，女=1。虚拟变量的系数表示"女性比男性高/低多少"。',
        whyNeedIt: '虚拟变量让回归模型能处理分类变量，大大扩展了回归的应用范围。',
        formula: 'X_i = \\begin{cases} 1 & \\text{如果属于第} i \\text{类} \\\\ 0 & \\text{否则} \\end{cases}',
        example: '预测工资：工资 = β₀ + β₁×教育 + β₂×女性。β₂ 表示女性比男性平均工资差异。'
      },
      {
        id: 'transformed-regression',
        name: '变换回归',
        category: '回归扩展',
        definition: '变换回归是对 Y 或 X 做变换后再回归。常用变换：对数变换、平方根变换、倒数变换等。变换可以处理非线性关系、异方差、偏态分布等问题。',
        plainTranslation: '变换回归是"先把数据变一变，再回归"。比如收入数据右偏，取对数后接近正态；收入和消费的关系可能是乘法关系，取对数后变成加法关系。',
        whyNeedIt: '变换是处理非线性、异方差、偏态的常用方法。但变换后的系数解释需要小心。',
        formula: '\\ln Y = \\beta_0 + \\beta_1 X + \\epsilon \\text{（对数线性模型）}',
        example: '收入-消费关系：ln(消费) = β₀ + β₁×ln(收入)。β₁ 是弹性：收入增加1%，消费增加β₁%。'
      },
      {
        id: 'general-linear-model',
        name: '一般线性模型',
        category: '回归扩展',
        definition: '一般线性模型（GLM）是线性回归、方差分析、协方差分析的统一框架。模型：Y = Xβ + ε，其中 X 是设计矩阵，β 是参数向量。',
        plainTranslation: '一般线性模型是"回归和方差分析的统一框架"。回归分析、方差分析、协方差分析都可以写成矩阵形式 Y = Xβ + ε。这个统一框架让理论更清晰，计算更统一。',
        whyNeedIt: 'GLM是统计建模的核心框架。理解GLM，就能理解回归、方差分析、协方差分析的内在联系。',
        formula: 'Y = X\\beta + \\epsilon, \\quad \\epsilon \\sim N(0, \\sigma^2 I)',
        example: '单因素方差分析可以写成：Yᵢⱼ = μ + αᵢ + εᵢⱼ，这是GLM的特例。'
      },
      {
        id: 'ancova',
        name: '协方差分析（ANCOVA）',
        category: '方差分析进阶',
        definition: '协方差分析是方差分析和回归分析的结合，用于比较各组均值的同时控制协变量的影响。模型：Yᵢⱼ = μ + αᵢ + β(xᵢⱼ - x̄) + εᵢⱼ。',
        plainTranslation: '协方差分析是"控制其他变量后的方差分析"。比如比较三种教学方法的效果，同时控制学生的入学成绩。这样可以排除入学成绩的影响，更准确地比较教学方法。',
        whyNeedIt: 'ANCOVA可以提高检验功效，消除协变量的干扰，得到更准确的组间比较。',
        formula: 'Y_{ij} = \\mu + \\alpha_i + \\beta(x_{ij} - \\bar{x}) + \\epsilon_{ij}',
        example: '比较三种教学方法，控制入学成绩。ANCOVA发现：排除入学成绩影响后，方法A显著优于其他方法。'
      },
      {
        id: 'effect-size',
        name: '效应量',
        category: '统计推断',
        definition: '效应量衡量效应的实际大小，独立于样本量。常用效应量：Cohen\'s d（均值差/标准差）、η²（方差解释比例）、相关系数 r 等。',
        plainTranslation: '效应量是"效应有多大"，和"是否显著"不同。p值只告诉我们要不要拒绝原假设，效应量告诉我们效应的实际意义。比如减肥药让体重平均减少0.1kg，虽然统计显著，但效应量太小，实际意义不大。',
        whyNeedIt: '效应量补充了p值的不足，告诉我们效应的实际意义。在报告统计结果时，应该同时报告效应量。',
        formula: 'd = \\frac{\\bar{X}_1 - \\bar{X}_2}{s}, \\quad \\eta^2 = \\frac{SSA}{SST}',
        example: '两组均值差5分，合并标准差10分。Cohen\'s d = 0.5，中等效应。η² = 0.06，解释了6%的变异。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter19',
    name: '第十九章 Bootstrap方法',
    concepts: [
      {
        id: 'bootstrap-method',
        name: 'Bootstrap方法',
        category: '基本概念',
        definition: 'Bootstrap方法是一种基于重抽样的统计推断方法，由Bradley Efron于1979年提出。基本思想是用样本代替总体，通过有放回抽样产生大量"伪样本"，来估计统计量的分布。',
        plainTranslation: 'Bootstrap就像"自己给自己做实验"——我们只有一个样本，但想知道统计量的分布怎么办？那就把这个样本当作"总体"，从中有放回地反复抽样，生成很多"新样本"，用这些新样本模拟统计量的分布。比如想知道样本均值的分布，就从原始样本中重抽样1000次，计算1000个均值，这1000个均值的分布就是Bootstrap分布。',
        whyNeedIt: 'Bootstrap方法不需要对总体分布做假设，适用于复杂统计量的推断，是现代统计学的重要工具。',
        formula: '\\hat{F}_n \\approx F, \\quad \\hat{\\theta}^*_1, \\ldots, \\hat{\\theta}^*_B \\sim \\text{Bootstrap分布}',
        example: '样本 (3, 5, 7, 9, 11)。Bootstrap抽样可能得到 (5, 5, 9, 3, 11)、(7, 3, 7, 9, 5) 等新样本。'
      },
      {
        id: 'resampling',
        name: '重抽样',
        category: '基本概念',
        definition: '重抽样是指从原始样本中有放回地抽取与原样本等大的新样本。每个观测被抽中的概率相等，都是 1/n，允许同一观测被多次抽中。',
        plainTranslation: '重抽样是Bootstrap的核心操作。想象一个袋子里有5个球（原始样本），每次摸一个球记录后放回，重复5次。这样可能摸到同一个球多次，也可能有些球一次都没摸到。每次重抽样得到一个"新样本"。',
        whyNeedIt: '重抽样是Bootstrap方法的基础操作。通过大量重抽样，模拟从总体中抽样的过程。',
        formula: 'P(X_i \\text{ 被抽中}) = \\frac{1}{n}, \\quad \\text{有放回抽样}',
        example: '原始样本 (1, 2, 3)。重抽样可能得到 (2, 2, 3)、(1, 1, 1)、(3, 2, 1) 等。'
      },
      {
        id: 'bootstrap-sample',
        name: 'Bootstrap样本',
        category: '基本概念',
        definition: 'Bootstrap样本是通过重抽样得到的新样本。每个Bootstrap样本与原始样本大小相同，但某些观测可能出现多次，某些观测可能不出现。',
        plainTranslation: 'Bootstrap样本是"重抽样产生的新样本"。比如原始样本是10个人的身高，Bootstrap样本也是10个身高值，但可能某人的身高出现2次，另一人的身高没出现。Bootstrap样本是原始样本的"变体"。',
        whyNeedIt: 'Bootstrap样本是模拟统计量分布的基本单位。每个Bootstrap样本计算一个统计量，大量统计量形成Bootstrap分布。',
        formula: 'X^*_1, X^*_2, \\ldots, X^*_n \\text{ 独立同分布，来自 } \\hat{F}_n',
        example: '原始样本 (2, 4, 6, 8, 10)。Bootstrap样本1: (4, 4, 8, 2, 10)；Bootstrap样本2: (6, 2, 6, 8, 2)。'
      },
      {
        id: 'bootstrap-distribution',
        name: 'Bootstrap分布',
        category: 'Bootstrap推断',
        definition: 'Bootstrap分布是统计量在所有可能的Bootstrap样本上的分布。用 B 个Bootstrap样本计算的统计量 θ̂*₁, ..., θ̂*_B 来近似统计量的真实分布。',
        plainTranslation: 'Bootstrap分布是"统计量在重抽样样本上的分布"。比如我们想知道样本均值的分布，就生成1000个Bootstrap样本，计算1000个均值，这1000个均值的直方图就是Bootstrap分布。它近似于真实的抽样分布。',
        whyNeedIt: 'Bootstrap分布是Bootstrap推断的基础。通过Bootstrap分布，我们可以估计统计量的标准误、置信区间等。',
        formula: '\\hat{\\theta}^*_1, \\ldots, \\hat{\\theta}^*_B \\xrightarrow{B \\to \\infty} \\text{统计量的抽样分布}',
        example: '原始样本均值 = 6。1000个Bootstrap样本的均值：5.8, 6.2, 5.5, 6.8, ... 这些均值的分布就是Bootstrap分布。'
      },
      {
        id: 'bootstrap-standard-error',
        name: 'Bootstrap标准误',
        category: 'Bootstrap推断',
        definition: 'Bootstrap标准误是Bootstrap分布的标准差，用来估计统计量的标准误：SE_boot = √(1/(B-1)·Σ(θ̂*_i - θ̂*̄)²)。',
        plainTranslation: 'Bootstrap标准误是"用Bootstrap方法估计的标准误"。传统方法需要知道统计量的理论公式，但复杂统计量往往没有公式。Bootstrap方法很简单：重抽样很多次，计算统计量的标准差，这就是标准误的估计。',
        whyNeedIt: 'Bootstrap标准误适用于任何统计量，不需要推导复杂的公式，是估计标准误的通用方法。',
        formula: 'SE_{boot} = \\sqrt{\\frac{1}{B-1}\\sum_{i=1}^B(\\hat{\\theta}^*_i - \\bar{\\theta}^*)^2}',
        example: '1000个Bootstrap样本均值的标准差 = 0.5。Bootstrap标准误估计为0.5。'
      },
      {
        id: 'bootstrap-confidence-interval',
        name: 'Bootstrap置信区间',
        category: 'Bootstrap推断',
        definition: 'Bootstrap置信区间是用Bootstrap分布构造的置信区间。常用方法：百分位数法、BC法（偏差校正）、BCa法（偏差校正和加速）等。',
        plainTranslation: 'Bootstrap置信区间是"用Bootstrap分布构造的置信区间"。最简单的方法是百分位数法：把Bootstrap分布的第2.5%和第97.5%分位数作为95%置信区间的上下界。比如1000个Bootstrap均值，排序后第25个和第975个就是置信区间。',
        whyNeedIt: 'Bootstrap置信区间不需要假设统计量的分布形式，适用于复杂统计量的区间估计。',
        formula: '[\\hat{\\theta}^*_{(\\alpha/2)}, \\hat{\\theta}^*_{(1-\\alpha/2)}] \\text{（百分位数法）}',
        example: '1000个Bootstrap均值排序，第25个 = 5.2，第975个 = 6.8。95%置信区间：[5.2, 6.8]。'
      },
      {
        id: 'percentile-method',
        name: '百分位数法',
        category: '置信区间方法',
        definition: '百分位数法是最简单的Bootstrap置信区间方法。将Bootstrap统计量排序，取第 α/2 和第 1-α/2 分位数作为置信区间的上下界。',
        plainTranslation: '百分位数法就像"切两头取中间"。把Bootstrap统计量从小到大排列，切掉最小的2.5%和最大的2.5%，剩下的就是95%置信区间。简单直观，但当Bootstrap分布有偏时可能不准确。',
        whyNeedIt: '百分位数法简单直观，是最常用的Bootstrap置信区间方法。但对有偏分布需要校正。',
        formula: 'CI = [\\hat{\\theta}^*_{(\\alpha/2 \\cdot B)}, \\hat{\\theta}^*_{((1-\\alpha/2) \\cdot B)}]',
        example: 'B = 1000，α = 0.05。取第25个和第975个Bootstrap统计量作为置信区间边界。'
      },
      {
        id: 'bc-method',
        name: 'BC法（偏差校正）',
        category: '置信区间方法',
        definition: 'BC法（Bias-Corrected）对百分位数法进行偏差校正。通过估计Bootstrap分布的偏差，调整分位数的位置。',
        plainTranslation: 'BC法是"校正了偏差的百分位数法"。如果Bootstrap分布的中位数不等于原始统计量，说明有偏差。BC法根据偏差大小调整分位数的位置，使置信区间更准确。',
        whyNeedIt: 'BC法校正了Bootstrap分布的偏差，比简单的百分位数法更准确。',
        formula: 'z_0 = \\Phi^{-1}(\\frac{\\#\\{\\hat{\\theta}^*_i < \\hat{\\theta}\\}}{B}), \\quad \\alpha_{BC} = \\Phi(2z_0 + z_{\\alpha})',
        example: 'Bootstrap分布中位数 < 原始统计量，说明有负偏差。BC法会调整分位数位置进行校正。'
      },
      {
        id: 'bca-method',
        name: 'BCa法',
        category: '置信区间方法',
        definition: 'BCa法（Bias-Corrected and Accelerated）是BC法的改进，同时校正偏差和"加速"效应。加速因子 a 反映统计量方差对参数的依赖性。',
        plainTranslation: 'BCa法是"最准确的Bootstrap置信区间方法"。它不仅校正偏差，还校正"方差随参数变化"的影响。比如估计方差时，方差大的参数对应的估计方差也大，这就是"加速"效应。BCa法考虑了这种效应。',
        whyNeedIt: 'BCa法是理论上最优的Bootstrap置信区间方法，适用于各种复杂情况。',
        formula: '\\alpha_1 = \\Phi(z_0 + \\frac{z_0 + z_{\\alpha/2}}{1 - a(z_0 + z_{\\alpha/2})}), \\quad \\alpha_2 = \\Phi(z_0 + \\frac{z_0 + z_{1-\\alpha/2}}{1 - a(z_0 + z_{1-\\alpha/2})})',
        example: 'BCa法需要估计加速因子 a，通常用Jackknife方法估计。'
      },
      {
        id: 'jackknife',
        name: 'Jackknife方法',
        category: '相关方法',
        definition: 'Jackknife方法是另一种重抽样方法：每次删除一个观测，用剩余 n-1 个观测计算统计量。得到 n 个Jackknife统计量，用于估计偏差和标准误。',
        plainTranslation: 'Jackknife是"留一法"——每次去掉一个数据点，用剩下的数据计算统计量。比如10个数据，去掉第1个算一个统计量，去掉第2个算一个统计量...共得到10个统计量。Jackknife比Bootstrap计算量小，但灵活性不如Bootstrap。',
        whyNeedIt: 'Jackknife方法用于估计偏差和标准误，也是估计BCa法加速因子的标准方法。',
        formula: '\\hat{\\theta}_{(i)} = \\text{去掉第} i \\text{个观测后的统计量}',
        example: '样本 (2, 4, 6, 8, 10)。Jackknife样本：(4,6,8,10), (2,6,8,10), (2,4,8,10), (2,4,6,10), (2,4,6,8)。'
      },
      {
        id: 'jackknife-estimate-of-bias',
        name: 'Jackknife偏差估计',
        category: '相关方法',
        definition: 'Jackknife偏差估计：Bias = (n-1)(θ̄_jack - θ̂)，其中 θ̄_jack 是 n 个Jackknife统计量的均值，θ̂ 是原始统计量。',
        plainTranslation: 'Jackknife偏差估计是"用留一法估计偏差"。如果去掉任何一个观测对统计量影响不大，说明偏差小；如果去掉某个观测后统计量变化很大，说明偏差可能大。Jackknife偏差估计量化了这种偏差。',
        whyNeedIt: 'Jackknife偏差估计是估计统计量偏差的标准方法，计算量比Bootstrap小。',
        formula: '\\widehat{Bias}_{jack} = (n-1)(\\bar{\\theta}_{jack} - \\hat{\\theta})',
        example: '原始均值 = 6，5个Jackknife均值：5.5, 5.75, 6, 6.25, 6.5。Jackknife均值 = 6。偏差 = 4×(6-6) = 0。'
      },
      {
        id: 'jackknife-estimate-of-variance',
        name: 'Jackknife方差估计',
        category: '相关方法',
        definition: 'Jackknife方差估计：Var = (n-1)/n·Σ(θ̂_(i) - θ̄_jack)²。这是估计统计量方差的标准方法。',
        plainTranslation: 'Jackknife方差估计是"用留一法估计方差"。n个Jackknife统计量的波动程度反映了统计量的方差。波动大，说明统计量不稳定，方差大。',
        whyNeedIt: 'Jackknife方差估计是估计统计量方差的标准方法，适用于没有理论公式的复杂统计量。',
        formula: '\\widehat{Var}_{jack} = \\frac{n-1}{n}\\sum_{i=1}^n(\\hat{\\theta}_{(i)} - \\bar{\\theta}_{jack})^2',
        example: '5个Jackknife均值：5.5, 5.75, 6, 6.25, 6.5。方差估计 = 4/5 × 0.25 = 0.2。'
      },
      {
        id: 'bootstrap-hypothesis-test',
        name: 'Bootstrap假设检验',
        category: 'Bootstrap推断',
        definition: 'Bootstrap假设检验用Bootstrap方法计算检验统计量的分布和p值。常用方法：在原假设下重抽样，计算检验统计量超过观测值的比例作为p值。',
        plainTranslation: 'Bootstrap假设检验是"用Bootstrap方法做假设检验"。传统方法需要知道检验统计量的理论分布，Bootstrap方法通过重抽样模拟这个分布。比如检验均值是否等于某值，就在原假设下重抽样，看观测统计量在Bootstrap分布中的位置。',
        whyNeedIt: 'Bootstrap假设检验适用于复杂检验统计量，不需要推导理论分布。',
        formula: 'p = \\frac{\\#\\{|T^*_i| \\ge |T_{obs}|\\}}{B}',
        example: '观测t值 = 2.1。1000次Bootstrap重抽样，|t| ≥ 2.1 的有45次。p值 ≈ 0.045。'
      },
      {
        id: 'parametric-bootstrap',
        name: '参数Bootstrap',
        category: 'Bootstrap类型',
        definition: '参数Bootstrap假设总体服从某个参数分布（如正态分布），用样本估计参数，然后从估计的分布中抽样，而不是从原始样本中重抽样。',
        plainTranslation: '参数Bootstrap是"假设分布形式后的Bootstrap"。比如假设数据服从正态分布，用样本均值和方差估计参数，然后从这个正态分布中抽样。参数Bootstrap比非参数Bootstrap更精确，但依赖于分布假设的正确性。',
        whyNeedIt: '参数Bootstrap在分布假设正确时比非参数Bootstrap更有效，适用于小样本情况。',
        formula: 'X^*_1, \\ldots, X^*_n \\sim F(\\hat{\\theta}), \\text{ 其中 } \\hat{\\theta} \\text{ 是参数估计}',
        example: '假设数据服从 N(μ, σ²)，用 X̄ 和 S 估计参数。Bootstrap样本从 N(X̄, S²) 中抽取。'
      },
      {
        id: 'nonparametric-bootstrap',
        name: '非参数Bootstrap',
        category: 'Bootstrap类型',
        definition: '非参数Bootstrap是最常用的Bootstrap方法，直接从原始样本中有放回重抽样，不假设总体分布形式。',
        plainTranslation: '非参数Bootstrap是"不假设分布的Bootstrap"——直接把原始样本当作总体，从中重抽样。这是最灵活的方法，适用于任何分布，但需要样本量足够大。',
        whyNeedIt: '非参数Bootstrap不需要分布假设，是最通用的Bootstrap方法。',
        formula: 'X^*_1, \\ldots, X^*_n \\overset{iid}{\\sim} \\hat{F}_n, \\text{ 经验分布函数}',
        example: '原始样本 (3, 5, 7, 9, 11)。非参数Bootstrap直接从中重抽样，不假设任何分布。'
      },
      {
        id: 'bootstrap-for-regression',
        name: '回归的Bootstrap',
        category: 'Bootstrap应用',
        definition: '回归的Bootstrap有两种方法：(1) 对残差重抽样（残差Bootstrap）；(2) 对观测对 (xᵢ, yᵢ) 重抽样（配对Bootstrap）。',
        plainTranslation: '回归的Bootstrap是"用Bootstrap方法分析回归"。残差Bootstrap保持x不变，对残差重抽样后重新构造y；配对Bootstrap把(x, y)当作整体重抽样。配对Bootstrap更稳健，残差Bootstrap在模型正确时更有效。',
        whyNeedIt: '回归的Bootstrap用于估计回归系数的标准误和置信区间，特别是当经典假设不满足时。',
        formula: '\\text{残差Bootstrap}: y^*_i = \\hat{y}_i + e^*_i, \\quad \\text{配对Bootstrap}: (x^*_i, y^*_i) \\text{ 重抽样}',
        example: '回归系数β̂ = 2.5，Bootstrap标准误 = 0.3。95%置信区间：[1.9, 3.1]。'
      },
      {
        id: 'bootstrap-number-of-replications',
        name: 'Bootstrap重复次数',
        category: '实践问题',
        definition: 'Bootstrap重复次数 B 是重抽样的次数。B 越大，Bootstrap估计越精确，但计算时间越长。通常 B = 1000 用于标准误估计，B = 10000 用于置信区间。',
        plainTranslation: 'Bootstrap重复次数是"重抽样多少次"。次数太少，Bootstrap分布不稳定；次数太多，计算时间太长。经验法则：估计标准误用1000次，估计置信区间用10000次。',
        whyNeedIt: '选择合适的Bootstrap重复次数是平衡精度和计算效率的关键。',
        formula: 'B = 1000 \\sim 10000 \\text{ 通常足够}',
        example: 'B = 1000：Bootstrap标准误稳定到小数点后一位。B = 10000：置信区间边界稳定。'
      },
      {
        id: 'bootstrap-consistency',
        name: 'Bootstrap一致性',
        category: '理论基础',
        definition: 'Bootstrap一致性是指当样本量 n 和重复次数 B 都趋向无穷时，Bootstrap分布收敛于统计量的真实抽样分布。',
        plainTranslation: 'Bootstrap一致性是"Bootstrap方法的理论保证"。它告诉我们：只要样本量足够大、重抽样次数足够多，Bootstrap分布就会非常接近真实分布。但有些统计量（如样本最大值）Bootstrap不一致，需要特别处理。',
        whyNeedIt: 'Bootstrap一致性是Bootstrap方法的理论基础，告诉我们什么时候Bootstrap方法可靠。',
        formula: '\\sup_t |P^*(\\hat{\\theta}^* \\le t) - P(\\hat{\\theta} \\le t)| \\xrightarrow{P} 0',
        example: '样本均值、样本方差等统计量，Bootstrap一致。样本最大值，Bootstrap不一致。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter20',
    name: '第二十章 随机过程及其统计描述',
    concepts: [
      {
        id: 'stochastic-process',
        name: '随机过程',
        category: '基本概念',
        definition: '随机过程是一族随机变量 {X(t), t ∈ T}，其中 t 是参数（通常表示时间），T 是参数集。对于每个固定的 t，X(t) 是一个随机变量；对于每个固定的样本点 ω，X(t, ω) 是一个样本函数（轨道）。',
        plainTranslation: '随机过程是"随时间变化的随机变量"。想象你在观察股票价格——每个时刻的价格都是随机的，但不同时刻的价格又有关联。随机过程就是描述这种"随时间演变的随机现象"。比如一天的气温变化、股票价格走势、排队人数变化，都是随机过程。',
        whyNeedIt: '随机过程是描述动态随机现象的数学模型，在金融、工程、生物等领域有广泛应用。',
        formula: '\\{X(t), t \\in T\\}, \\quad T \\text{ 是参数集（通常为时间）}',
        example: '股票价格过程 {S(t), t ≥ 0}：每个时刻 t，S(t) 是一个随机变量，表示该时刻的股价。'
      },
      {
        id: 'state-space',
        name: '状态空间',
        category: '基本概念',
        definition: '状态空间 S 是随机过程 X(t) 所有可能取值的集合。状态空间可以是离散的（如 {0, 1, 2, ...}）或连续的（如 ℝ）。',
        plainTranslation: '状态空间是"随机过程能取哪些值"。比如抛硬币序列的状态空间是 {正面, 反面}；股票价格的状态空间是 (0, +∞)；排队人数的状态空间是 {0, 1, 2, 3, ...}。',
        whyNeedIt: '状态空间定义了随机过程的取值范围，是描述随机过程的基本要素。',
        formula: 'S = \\{x : X(t) = x \\text{ 可能发生}\\}',
        example: '泊松过程 N(t) 的状态空间是 {0, 1, 2, ...}（非负整数）。布朗运动 B(t) 的状态空间是 ℝ（实数）。'
      },
      {
        id: 'parameter-set',
        name: '参数集',
        category: '基本概念',
        definition: '参数集 T 是随机过程的参数取值范围。常见的参数集：T = {0, 1, 2, ...}（离散时间）、T = [0, +∞)（连续时间）。',
        plainTranslation: '参数集是"时间参数的取值范围"。离散时间过程的参数集是整数集 {0, 1, 2, ...}，比如每天的股价；连续时间过程的参数集是 [0, +∞)，比如连续观察的股价。',
        whyNeedIt: '参数集定义了随机过程的时间范围，区分了离散时间和连续时间过程。',
        formula: 'T = \\{0, 1, 2, \\ldots\\} \\text{（离散）} \\text{ 或 } T = [0, +\\infty) \\text{（连续）}',
        example: '随机游走：T = {0, 1, 2, ...}（离散时间）。布朗运动：T = [0, +∞)（连续时间）。'
      },
      {
        id: 'sample-path',
        name: '样本轨道（样本函数）',
        category: '基本概念',
        definition: '样本轨道是随机过程的一次实现，即固定样本点 ω 后得到的函数 t ↦ X(t, ω)。每条样本轨道是参数 t 的确定性函数。',
        plainTranslation: '样本轨道是"随机过程的一次具体实现"。比如股票价格过程，今天实际走出的那条曲线就是一条样本轨道；明天走出的曲线是另一条样本轨道。随机过程就像"所有可能轨道的集合"，每次实验得到其中一条轨道。',
        whyNeedIt: '样本轨道是理解随机过程的直观方式。观察样本轨道可以了解过程的特性。',
        formula: 't \\mapsto X(t, \\omega), \\quad \\omega \\text{ 固定}',
        example: '抛硬币10次的结果序列 (正, 反, 正, 正, 反, 反, 正, 反, 正, 正) 是一条样本轨道。'
      },
      {
        id: 'finite-dimensional-distribution',
        name: '有限维分布',
        category: '统计描述',
        definition: '随机过程的有限维分布是指任意有限个时刻 t₁, ..., tₙ 的联合分布 F(x₁, ..., xₙ; t₁, ..., tₙ) = P(X(t₁) ≤ x₁, ..., X(tₙ) ≤ xₙ)。Kolmogorov定理保证了有限维分布族唯一确定一个随机过程。',
        plainTranslation: '有限维分布是"任意几个时刻的联合分布"。比如股票价格过程，我们可以问：今天、明天、后天的价格联合分布是什么？这就是三维分布。有限维分布完整地描述了随机过程的概率结构。',
        whyNeedIt: '有限维分布是描述随机过程概率结构的基本方法。Kolmogorov定理保证了这种描述的完备性。',
        formula: 'F(x_1, \\ldots, x_n; t_1, \\ldots, t_n) = P(X(t_1) \\le x_1, \\ldots, X(t_n) \\le x_n)',
        example: '布朗运动的有限维分布是多元正态分布，由均值函数和协方差函数确定。'
      },
      {
        id: 'mean-function',
        name: '均值函数',
        category: '统计描述',
        definition: '均值函数 μ(t) = E[X(t)] 是随机过程在每个时刻 t 的期望值。均值函数描述了过程的平均趋势。',
        plainTranslation: '均值函数是"每个时刻的平均值"。比如气温过程，均值函数描述了一天中气温的平均变化规律——早晨低、中午高、傍晚低。均值函数是随机过程的"中心线"。',
        whyNeedIt: '均值函数描述了随机过程的平均行为，是最基本的统计特征。',
        formula: '\\mu(t) = E[X(t)]',
        example: '气温过程 X(t)，t 表示一天中的时刻。μ(t) 可能是 μ(t) = 15 + 10sin(πt/12)，描述日变化。'
      },
      {
        id: 'variance-function',
        name: '方差函数',
        category: '统计描述',
        definition: '方差函数 σ²(t) = Var[X(t)] = E[(X(t) - μ(t))²] 是随机过程在每个时刻 t 的方差。方差函数描述了过程在各时刻的波动程度。',
        plainTranslation: '方差函数是"每个时刻的波动大小"。比如股票价格，方差函数可能随时间增大——越往后价格越不确定，波动越大。方差函数描述了随机过程的"不确定性程度"。',
        whyNeedIt: '方差函数描述了随机过程在各时刻的波动程度，是重要的统计特征。',
        formula: '\\sigma^2(t) = Var[X(t)] = E[(X(t) - \\mu(t))^2]',
        example: '布朗运动 B(t) 的方差函数 σ²(t) = t，方差随时间线性增长。'
      },
      {
        id: 'covariance-function',
        name: '协方差函数',
        category: '统计描述',
        definition: '协方差函数 C(s, t) = Cov[X(s), X(t)] = E[(X(s) - μ(s))(X(t) - μ(t))] 描述随机过程在两个不同时刻 s 和 t 的线性相关程度。',
        plainTranslation: '协方差函数是"两个时刻之间的相关性"。协方差大，说明两个时刻的值倾向于同增同减；协方差小，说明两个时刻的值关联弱；协方差为负，说明一个增大时另一个倾向于减小。',
        whyNeedIt: '协方差函数是描述随机过程时间相关性的核心工具，决定了过程的时间结构。',
        formula: 'C(s, t) = Cov[X(s), X(t)] = E[(X(s) - \\mu(s))(X(t) - \\mu(t))]',
        example: '布朗运动的协方差函数 C(s, t) = min(s, t)。'
      },
      {
        id: 'correlation-function',
        name: '相关函数',
        category: '统计描述',
        definition: '相关函数 ρ(s, t) = C(s, t) / √(σ²(s)·σ²(t)) 是标准化的协方差函数，取值在 [-1, 1] 之间。',
        plainTranslation: '相关函数是"标准化后的协方差"。它消除了量纲的影响，取值在 -1 到 1 之间。相关函数 = 1 表示完全正相关，= -1 表示完全负相关，= 0 表示不相关。',
        whyNeedIt: '相关函数便于比较不同随机过程的时间相关性结构。',
        formula: '\\rho(s, t) = \\frac{C(s, t)}{\\sqrt{\\sigma^2(s) \\cdot \\sigma^2(t)}}',
        example: '平稳过程的相关函数只依赖于时间差：ρ(s, t) = ρ(t - s)。'
      },
      {
        id: 'independent-increment',
        name: '独立增量',
        category: '过程性质',
        definition: '随机过程 {X(t)} 称为独立增量过程，如果对任意 t₁ < t₂ < ... < tₙ，增量 X(t₂) - X(t₁), X(t₃) - X(t₂), ..., X(tₙ) - X(tₙ₋₁) 相互独立。',
        plainTranslation: '独立增量过程是"各时段的变化量相互独立"。比如泊松过程，第一个小时内到达的人数和第二个小时内到达的人数相互独立——前面发生了什么，不影响后面会发生什么。',
        whyNeedIt: '独立增量性质简化了随机过程的分析，是泊松过程、布朗运动等重要过程的核心性质。',
        formula: 'X(t_2) - X(t_1), X(t_3) - X(t_2), \\ldots \\text{ 相互独立}',
        example: '泊松过程 N(t) 是独立增量过程：各时段到达人数独立。'
      },
      {
        id: 'stationary-increment',
        name: '平稳增量',
        category: '过程性质',
        definition: '随机过程 {X(t)} 称为平稳增量过程，如果增量 X(t + h) - X(t) 的分布只依赖于时间差 h，不依赖于起始时刻 t。',
        plainTranslation: '平稳增量过程是"相同时间长度的变化规律相同"。比如泊松过程，一小时内到达人数的分布，不管是8点到9点还是14点到15点，都是一样的——只取决于时间长度，不取决于从什么时候开始。',
        whyNeedIt: '平稳增量性质意味着过程的统计规律不随时间平移而改变，简化了分析。',
        formula: 'X(t+h) - X(t) \\stackrel{d}{=} X(h) - X(0), \\quad \\forall t, h \\ge 0',
        example: '布朗运动 B(t) 是平稳增量过程：B(t+h) - B(t) ~ N(0, h)，只依赖于 h。'
      },
      {
        id: 'poisson-process',
        name: '泊松过程',
        category: '重要随机过程',
        definition: '泊松过程 {N(t), t ≥ 0} 是计数过程，满足：(1) N(0) = 0；(2) 独立增量；(3) N(t) ~ Poi(λt)。参数 λ 称为强度（到达率）。',
        plainTranslation: '泊松过程描述"随机到达事件"。比如顾客到店、电话接入、放射性衰变。关键特征：事件独立发生，单位时间内平均发生 λ 次，t 时间内发生次数服从泊松分布 Poi(λt)。',
        whyNeedIt: '泊松过程是最基本的计数过程，在排队论、可靠性理论、金融等领域有广泛应用。',
        formula: 'N(t) \\sim Poi(\\lambda t), \\quad P(N(t) = k) = \\frac{(\\lambda t)^k e^{-\\lambda t}}{k!}',
        example: '顾客到达率 λ = 5人/小时。1小时内到达人数 ~ Poi(5)，平均5人。'
      },
      {
        id: 'interarrival-time',
        name: '到达间隔时间',
        category: '泊松过程',
        definition: '泊松过程中，相邻两次事件发生的时间间隔称为到达间隔时间。到达间隔时间独立同分布，服从指数分布 Exp(λ)。',
        plainTranslation: '到达间隔时间是"两次事件之间的等待时间"。比如顾客到达，第一个顾客和第二个顾客之间的等待时间。泊松过程的到达间隔时间服从指数分布——可能很短，也可能很长，但平均是 1/λ。',
        whyNeedIt: '到达间隔时间是泊松过程的另一种描述方式，等价于计数过程描述。',
        formula: 'T_i \\sim Exp(\\lambda), \\quad E[T_i] = \\frac{1}{\\lambda}',
        example: '顾客到达率 λ = 5人/小时。到达间隔时间 ~ Exp(5)，平均间隔 12 分钟。'
      },
      {
        id: 'exponential-distribution-memoryless',
        name: '指数分布的无记忆性',
        category: '泊松过程',
        definition: '指数分布具有无记忆性：P(T > s + t | T > s) = P(T > t)。即已知已经等待了时间 s，再等待时间 t 的概率与从头开始等待 t 的概率相同。',
        plainTranslation: '无记忆性是指数分布的独特性质：已经等了多久，不影响还需要等多久。比如等公交车，已经等了10分钟，还需要等的概率分布和刚来时一样——"过去的等待白等了"。只有指数分布有这个性质。',
        whyNeedIt: '无记忆性是泊松过程的核心性质，使得泊松过程的分析大大简化。',
        formula: 'P(T > s + t | T > s) = P(T > t) = e^{-\\lambda t}',
        example: '灯泡寿命服从 Exp(λ)。已使用1000小时后，再使用1000小时的概率 = 新灯泡使用1000小时的概率。'
      },
      {
        id: 'compound-poisson-process',
        name: '复合泊松过程',
        category: '泊松过程推广',
        definition: '复合泊松过程 X(t) = Σᵢ₌₁^{N(t)} Yᵢ，其中 N(t) 是泊松过程，Yᵢ 是独立同分布的随机变量（跳跃大小）。X(t) 表示到时刻 t 为止的累积量。',
        plainTranslation: '复合泊松过程是"每次事件带来随机大小的跳跃"。比如保险公司理赔：理赔次数是泊松过程，每次理赔金额是随机变量，累积理赔金额就是复合泊松过程。',
        whyNeedIt: '复合泊松过程在保险、金融等领域有重要应用，描述带随机跳跃大小的累积过程。',
        formula: 'X(t) = \\sum_{i=1}^{N(t)} Y_i, \\quad E[X(t)] = \\lambda t \\cdot E[Y]',
        example: '保险公司每小时平均收到 λ = 2 次理赔，每次平均 1000 元。E[X(24)] = 2×24×1000 = 48000 元。'
      },
      {
        id: 'brownian-motion',
        name: '布朗运动（维纳过程）',
        category: '重要随机过程',
        definition: '布朗运动 {B(t), t ≥ 0} 满足：(1) B(0) = 0；(2) 独立增量；(3) 平稳增量；(4) B(t) - B(s) ~ N(0, t-s)；(5) 样本轨道连续。',
        plainTranslation: '布朗运动描述"连续的随机游走"。比如花粉在水中的运动、股票价格的波动。关键特征：每个时刻的位置服从正态分布，增量独立且平稳，轨道连续但处处不可导——变化极其不规则。',
        whyNeedIt: '布朗运动是随机分析的基础，在金融数学（期权定价）、物理（粒子运动）等领域有核心地位。',
        formula: 'B(t) \\sim N(0, t), \\quad B(t) - B(s) \\sim N(0, t-s)',
        example: '股票价格模型：S(t) = S(0)exp(μt + σB(t))，其中 B(t) 是布朗运动。'
      },
      {
        id: 'brownian-motion-properties',
        name: '布朗运动的性质',
        category: '重要随机过程',
        definition: '布朗运动的重要性质：(1) 标度律：c^{-1/2}B(ct) 也是布朗运动；(2) 时间逆转：B(t) 和 tB(1/t) 同分布；(3) 反射原理：P(max_{s≤t} B(s) > a) = 2P(B(t) > a)。',
        plainTranslation: '布朗运动有优美的数学性质。标度律：时间加速4倍，波动只增大2倍（平方根关系）。反射原理：布朗运动触及某高度后，超过该高度的概率是原来的2倍——就像被镜子反射一样。',
        whyNeedIt: '这些性质是布朗运动理论的核心，用于计算各种概率和期望。',
        formula: 'B(ct) \\stackrel{d}{=} \\sqrt{c} B(t), \\quad \\text{标度律}',
        example: 'B(4) 的标准差是 B(1) 的2倍，不是4倍。'
      },
      {
        id: 'geometric-brownian-motion',
        name: '几何布朗运动',
        category: '布朗运动应用',
        definition: '几何布朗运动 S(t) = S(0)exp((μ - σ²/2)t + σB(t))，其中 μ 是漂移率，σ 是波动率。S(t) 始终为正，常用于资产价格建模。',
        plainTranslation: '几何布朗运动是"指数形式的布朗运动"。普通布朗运动可能取负值，但股价不能为负。几何布朗运动通过取指数保证恒为正，是Black-Scholes期权定价模型的基础。',
        whyNeedIt: '几何布朗运动是金融数学中资产价格的标准模型，用于期权定价和风险管理。',
        formula: 'S(t) = S(0) \\exp\\left((\\mu - \\frac{\\sigma^2}{2})t + \\sigma B(t)\\right)',
        example: '股价 S(0) = 100，μ = 0.1，σ = 0.2。一年后期望股价 = 100×e^{0.1} ≈ 110.5。'
      },
      {
        id: 'random-walk',
        name: '随机游走',
        category: '重要随机过程',
        definition: '随机游走 Sₙ = X₁ + X₂ + ... + Xₙ，其中 Xᵢ 是独立同分布的随机变量。最简单的情况：Xᵢ 取 +1 或 -1，概率各 1/2。',
        plainTranslation: '随机游走是"随机步伐的累积"。想象一个醉汉走路：每一步随机向左或向右，n 步后的位置就是随机游走。股票日涨跌的累积、粒子在晶体中的运动，都可以用随机游走建模。',
        whyNeedIt: '随机游走是布朗运动的离散版本，是理解随机过程的基础模型。',
        formula: 'S_n = \\sum_{i=1}^n X_i, \\quad X_i \\in \\{-1, +1\\}',
        example: '抛硬币，正面走一步，反面退一步。100次后位置 S₁₀₀ ~ N(0, 100)，标准差10步。'
      },
      {
        id: 'counting-process',
        name: '计数过程',
        category: '过程类型',
        definition: '计数过程 {N(t), t ≥ 0} 记录到时刻 t 为止发生的事件总数。满足：(1) N(t) ≥ 0；(2) N(t) 是整数；(3) s < t 时 N(s) ≤ N(t)；(4) N(t) - N(s) 表示 (s, t] 内发生的事件数。',
        plainTranslation: '计数过程是"数发生了多少次事件"。比如到店顾客数、电话呼叫数、机器故障数。N(t) 只增不减，每次事件发生时跳1。',
        whyNeedIt: '计数过程是描述离散事件发生的基本模型，泊松过程是最重要的计数过程。',
        formula: 'N(t) = \\text{到时刻} t \\text{的事件总数}',
        example: '顾客到达过程：N(10) = 15 表示前10分钟有15位顾客到达。'
      },
      {
        id: 'renewal-process',
        name: '更新过程',
        category: '过程类型',
        definition: '更新过程是计数过程的推广，到达间隔时间独立同分布，但不一定服从指数分布。设到达间隔时间为 T₁, T₂, ...，则 N(t) = max{n: T₁ + ... + Tₙ ≤ t}。',
        plainTranslation: '更新过程是"泊松过程的推广"。泊松过程的到达间隔时间必须是指数分布，更新过程允许任意分布。比如机器维修：每次维修后的运行时间可能是任意分布，这就是更新过程。',
        whyNeedIt: '更新过程是更一般的计数过程模型，适用于到达间隔时间不服从指数分布的情况。',
        formula: 'N(t) = \\max\\{n : \\sum_{i=1}^n T_i \\le t\\}',
        example: '机器运行时间服从 Gamma 分布。N(t) 是 t 时间内的故障次数。'
      },
      {
        id: 'markov-process',
        name: '马尔可夫过程',
        category: '过程性质',
        definition: '马尔可夫过程满足"无后效性"：给定当前状态，未来与过去独立。即 P(X(tₙ₊₁) ∈ A | X(t₁), ..., X(tₙ)) = P(X(tₙ₊₁) ∈ A | X(tₙ))。',
        plainTranslation: '马尔可夫过程是"只有当前状态重要"的过程。预测未来，只需要知道现在，不需要知道过去是怎么到达现在的。比如下棋：当前棋局决定了后续可能的发展，不需要知道之前是怎么下到这个局面的。',
        whyNeedIt: '马尔可夫性质大大简化了随机过程的分析，是许多重要过程的核心性质。',
        formula: 'P(X(t_{n+1}) | X(t_1), \\ldots, X(t_n)) = P(X(t_{n+1}) | X(t_n))',
        example: '泊松过程是马尔可夫过程：已知当前到达人数，未来到达人数与过去无关。'
      },
      {
        id: 'gaussian-process',
        name: '高斯过程',
        category: '重要随机过程',
        definition: '高斯过程是任意有限维分布都是多元正态分布的随机过程。高斯过程完全由均值函数 μ(t) 和协方差函数 C(s, t) 确定。',
        plainTranslation: '高斯过程是"所有有限维分布都是正态分布"的过程。就像正态分布是统计学中最重要的一维分布，高斯过程是随机过程中最重要的过程之一。机器学习中的高斯过程回归就是基于此。',
        whyNeedIt: '高斯过程在机器学习（高斯过程回归）、时空统计等领域有重要应用。',
        formula: '(X(t_1), \\ldots, X(t_n)) \\sim N(\\boldsymbol{\\mu}, \\boldsymbol{\\Sigma})',
        example: '布朗运动是高斯过程：μ(t) = 0，C(s, t) = min(s, t)。'
      },
      {
        id: 'kolmogorov-theorem',
        name: 'Kolmogorov存在定理',
        category: '理论基础',
        definition: 'Kolmogorov存在定理：给定满足相容性条件的有限维分布族，存在一个随机过程以这些分布为有限维分布。相容性条件保证不同维数的分布之间不矛盾。',
        plainTranslation: 'Kolmogorov存在定理是"随机过程的存在性保证"。它告诉我们：只要有限维分布满足一些合理的相容性条件，就一定存在一个随机过程具有这些分布。这是随机过程理论的基石。',
        whyNeedIt: 'Kolmogorov定理是随机过程理论的基础，保证了有限维分布描述方法的完备性。',
        formula: '\\text{相容性：边缘分布与高维分布一致}',
        example: '给定均值函数和协方差函数，Kolmogorov定理保证存在高斯过程具有这些特征。'
      },
      {
        id: 'filtration',
        name: '域流（信息流）',
        category: '理论基础',
        definition: '域流 {Fₜ, t ≥ 0} 是一族递增的 σ-代数，表示随时间累积的信息。Fₜ 包含到时刻 t 为止的所有信息。随机过程 X(t) 称为适应的，如果 X(t) 对 Fₜ 可测。',
        plainTranslation: '域流是"随时间累积的信息"。Fₜ 表示"到时刻 t 我们知道了什么"。比如股票交易，Fₜ 包含了到时刻 t 为止的所有价格信息。域流是现代概率论和金融数学的核心概念。',
        whyNeedIt: '域流是现代随机过程理论的基础，用于精确定义"信息"和"基于信息的决策"。',
        formula: '\\mathcal{F}_s \\subseteq \\mathcal{F}_t, \\quad s < t',
        example: '股票市场：Fₜ 包含到时刻 t 为止的所有交易信息。基于 Fₜ 的决策只能用时刻 t 已知的信息。'
      },
      {
        id: 'martingale',
        name: '鞅',
        category: '重要随机过程',
        definition: '鞅 {X(t), Fₜ} 满足：(1) X(t) 对 Fₜ 适应；(2) E[|X(t)|] < ∞；(3) E[X(t) | Fₛ] = X(s) 对 s < t。鞅表示"公平赌博"：给定当前信息，未来期望等于当前值。',
        plainTranslation: '鞅是"公平赌博的数学模型"。如果你在赌场赌博，每次下注后的期望财富等于当前财富，这就是鞅。鞅理论告诉我们：在公平赌博中，没有任何策略能让你稳赚——这是"没有免费午餐"的数学表达。',
        whyNeedIt: '鞅是现代概率论和金融数学的核心概念，用于资产定价、风险理论等。',
        formula: 'E[X(t) | \\mathcal{F}_s] = X(s), \\quad s < t',
        example: '布朗运动 B(t) 是鞅：E[B(t) | Fₛ] = B(s)。公平赌博的财富过程是鞅。'
      },
      {
        id: 'stopping-time',
        name: '停时',
        category: '理论基础',
        definition: '停时 τ 是一个随机变量，取值在 [0, +∞]，满足 {τ ≤ t} ∈ Fₜ 对所有 t。停时表示一个"不依赖未来信息的停止规则"。',
        plainTranslation: '停时是"只依赖当前和过去信息的停止时刻"。比如"股价第一次达到100元的时刻"是停时——只要看当前价格就知道是否停止。但"股价达到最高点的时刻"不是停时——需要知道未来的价格。',
        whyNeedIt: '停时是分析随机过程的重要工具，用于定义"最优停止问题"和"首达时间"。',
        formula: '\\{\\tau \\le t\\} \\in \\mathcal{F}_t, \\quad \\forall t',
        example: '布朗运动首次到达 a 的时刻 τ_a = inf{t : B(t) = a} 是停时。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter21',
    name: '第二十一章 马尔科夫链',
    concepts: [
      {
        id: 'markov-chain',
        name: '马尔科夫链',
        category: '基本概念',
        definition: '马尔科夫链是状态空间 S 上的随机过程 {Xₙ, n ≥ 0}，满足马尔科夫性质：P(Xₙ₊₁ = j | X₀, X₁, ..., Xₙ) = P(Xₙ₊₁ = j | Xₙ)。即下一状态只依赖于当前状态，与过去状态无关。',
        plainTranslation: '马尔科夫链是"只有当前状态重要"的离散随机过程。想象一个棋盘上的棋子，它下一步走到哪里只取决于当前在哪个格子，不取决于之前是怎么走来的。天气变化、股票涨跌、网页浏览，都可以用马尔科夫链建模。',
        whyNeedIt: '马尔科夫链是应用最广泛的随机过程之一，在排队论、库存管理、金融、生物等领域有重要应用。',
        formula: 'P(X_{n+1} = j | X_n = i, X_{n-1}, \\ldots, X_0) = P(X_{n+1} = j | X_n = i)',
        example: '天气模型：今天晴天，明天晴天的概率是0.7，雨天的概率是0.3。今天的天气只影响明天的天气。'
      },
      {
        id: 'transition-probability',
        name: '转移概率',
        category: '基本概念',
        definition: '转移概率 pᵢⱼ = P(Xₙ₊₁ = j | Xₙ = i) 表示从状态 i 转移到状态 j 的概率。转移概率满足：pᵢⱼ ≥ 0 且 Σⱼ pᵢⱼ = 1。',
        plainTranslation: '转移概率是"从一个状态跳到另一个状态的概率"。比如从"晴天"状态跳到"雨天"状态的概率是0.3。转移概率完整描述了马尔科夫链的动态行为。',
        whyNeedIt: '转移概率是马尔科夫链的核心参数，决定了过程的演化规律。',
        formula: 'p_{ij} = P(X_{n+1} = j | X_n = i), \\quad \\sum_j p_{ij} = 1',
        example: '天气转移：p_{晴,晴} = 0.7，p_{晴,雨} = 0.3，p_{雨,晴} = 0.4，p_{雨,雨} = 0.6。'
      },
      {
        id: 'transition-matrix',
        name: '转移矩阵',
        category: '基本概念',
        definition: '转移矩阵 P = (pᵢⱼ) 是由所有转移概率组成的矩阵。每行是一个概率分布，行和为1。转移矩阵完整描述了马尔科夫链的一步转移规律。',
        plainTranslation: '转移矩阵是"所有转移概率排成的表格"。每一行代表当前状态，每一列代表下一状态。比如天气的转移矩阵是一个2×2矩阵，第一行是"晴天"的转移概率，第二行是"雨天"的转移概率。',
        whyNeedIt: '转移矩阵是马尔科夫链的数学表示，便于计算和分析。',
        formula: 'P = (p_{ij})_{i,j \\in S}, \\quad \\sum_j p_{ij} = 1',
        example: '天气转移矩阵 P = [[0.7, 0.3], [0.4, 0.6]]。第一行：晴天→晴天0.7，晴天→雨天0.3。'
      },
      {
        id: 'n-step-transition-probability',
        name: 'n步转移概率',
        category: '转移概率',
        definition: 'n步转移概率 pᵢⱼ⁽ⁿ⁾ = P(Xₙ = j | X₀ = i) 表示从状态 i 出发，经过 n 步到达状态 j 的概率。Chapman-Kolmogorov方程：pᵢⱼ⁽ⁿ⁺ᵐ⁾ = Σₖ pᵢₖ⁽ⁿ⁾pₖⱼ⁽ᵐ⁾。',
        plainTranslation: 'n步转移概率是"经过n步从状态i到状态j的概率"。比如今天晴天，3天后晴天的概率是多少？这就是3步转移概率。Chapman-Kolmogorov方程告诉我们：n步转移概率可以通过中间状态分解。',
        whyNeedIt: 'n步转移概率描述了过程的长期行为，是分析马尔科夫链的关键工具。',
        formula: 'p_{ij}^{(n)} = P(X_n = j | X_0 = i), \\quad P^{(n)} = P^n',
        example: '转移矩阵P的n次幂就是n步转移矩阵。P²的(i,j)元素是从i出发2步到达j的概率。'
      },
      {
        id: 'chapman-kolmogorov-equation',
        name: 'Chapman-Kolmogorov方程',
        category: '转移概率',
        definition: 'Chapman-Kolmogorov方程：pᵢⱼ⁽ⁿ⁺ᵐ⁾ = Σₖ pᵢₖ⁽ⁿ⁾pₖⱼ⁽ᵐ⁾。即n+m步转移概率可以通过n步和m步转移概率的卷积得到。矩阵形式：P⁽ⁿ⁺ᵐ⁾ = P⁽ⁿ⁾P⁽ᵐ⁾。',
        plainTranslation: 'Chapman-Kolmogorov方程是"转移概率的分解公式"。从i到j经过n+m步，可以分解为：先经过n步到某个中间状态k，再从k经过m步到j，对所有中间状态求和。这就像"分段计算"。',
        whyNeedIt: 'Chapman-Kolmogorov方程是计算n步转移概率的基础，保证了P⁽ⁿ⁾ = Pⁿ。',
        formula: 'p_{ij}^{(n+m)} = \\sum_k p_{ik}^{(n)} p_{kj}^{(m)}, \\quad P^{(n)} = P^n',
        example: 'P² = P×P。P²的第(i,j)元素 = Σₖ pᵢₖpₖⱼ，即两步转移概率。'
      },
      {
        id: 'initial-distribution',
        name: '初始分布',
        category: '基本概念',
        definition: '初始分布 π⁽⁰⁾ = (πᵢ⁽⁰⁾) 是马尔科夫链在时刻0处于各状态的概率分布。πᵢ⁽⁰⁾ = P(X₀ = i)。',
        plainTranslation: '初始分布是"开始时在哪个状态的概率"。比如天气模型，初始分布可能是"第一天晴天的概率0.6，雨天的概率0.4"。初始分布决定了过程的起点。',
        whyNeedIt: '初始分布是马尔科夫链的起始条件，结合转移矩阵可以计算任意时刻的分布。',
        formula: '\\pi^{(0)} = (\\pi_i^{(0)}), \\quad \\pi_i^{(0)} = P(X_0 = i)',
        example: '天气模型初始分布：π⁽⁰⁾ = [0.6, 0.4]，第一天晴天概率0.6。'
      },
      {
        id: 'distribution-at-time-n',
        name: '时刻n的分布',
        category: '基本概念',
        definition: '时刻n的状态分布 π⁽ⁿ⁾ = (πⱼ⁽ⁿ⁾)，其中 πⱼ⁽ⁿ⁾ = P(Xₙ = j)。计算公式：π⁽ⁿ⁾ = π⁽⁰⁾Pⁿ。',
        plainTranslation: '时刻n的分布是"第n步时在各个状态的概率"。通过初始分布和转移矩阵可以计算：π⁽ⁿ⁾ = π⁽⁰⁾Pⁿ。比如初始晴天概率0.6，转移矩阵P，n天后晴天概率是多少？',
        whyNeedIt: '时刻n的分布描述了过程随时间的演化，是马尔科夫链分析的基本问题。',
        formula: '\\pi^{(n)} = \\pi^{(0)} P^n',
        example: 'π⁽⁰⁾ = [0.6, 0.4]，P = [[0.7,0.3],[0.4,0.6]]。π⁽¹⁾ = [0.6,0.4]×P = [0.58, 0.42]。'
      },
      {
        id: 'communicating-class',
        name: '相通类',
        category: '状态分类',
        definition: '状态 i 和 j 相通（记作 i ↔ j），如果 i 可达 j 且 j 可达 i。相通关系是等价关系，将状态空间划分为若干相通类。',
        plainTranslation: '相通类是"可以互相到达的状态组成的集合"。比如天气模型中，晴天和雨天相通——从晴天可以到雨天，从雨天也可以到晴天。但如果有一个"吸收状态"（一旦进入就出不来的状态），它就自成一个类。',
        whyNeedIt: '相通类的划分帮助理解马尔科夫链的结构，不同类之间的状态不会互相转移。',
        formula: 'i \\leftrightarrow j \\Leftrightarrow i \\to j \\text{ 且 } j \\to i',
        example: '赌徒破产问题：状态0和状态N是吸收状态（自成一类），中间状态1,2,...,N-1相通。'
      },
      {
        id: 'irreducible-chain',
        name: '不可约链',
        category: '状态分类',
        definition: '马尔科夫链称为不可约的，如果所有状态都相通，即任意两个状态之间都可以互相到达。等价地，只有一个相通类。',
        plainTranslation: '不可约链是"所有状态都能互相到达"的马尔科夫链。比如天气模型，晴天和雨天可以互相转移，是不可约链。不可约链的结构简单，分析起来更方便。',
        whyNeedIt: '不可约性是马尔科夫链的重要性质，保证了极限分布的存在性和唯一性。',
        formula: '\\forall i, j \\in S: i \\leftrightarrow j',
        example: '天气模型（晴天↔雨天）是不可约链。赌徒破产问题（有吸收状态）不是不可约链。'
      },
      {
        id: 'periodicity',
        name: '周期性',
        category: '状态分类',
        definition: '状态 i 的周期 d(i) 是所有能使 pᵢᵢ⁽ⁿ⁾ > 0 的 n 的最大公约数。若 d(i) = 1，称状态 i 非周期。若所有状态非周期，称链非周期。',
        plainTranslation: '周期性是"回到同一状态的步数规律"。比如一个状态只能在第2、4、6...步回到，周期就是2。非周期状态可以在任意步数回到。周期性影响极限分布的性质。',
        whyNeedIt: '非周期性是极限分布收敛的必要条件之一。',
        formula: 'd(i) = \\gcd\\{n \\ge 1 : p_{ii}^{(n)} > 0\\}',
        example: '状态转移：1→2→1→2→... 周期为2。状态转移：1→2→3→1，周期为3。自环状态（pᵢᵢ > 0）非周期。'
      },
      {
        id: 'recurrent-state',
        name: '常返状态',
        category: '状态分类',
        definition: '状态 i 称为常返的，如果从 i 出发，以概率1回到 i。即 fᵢᵢ = P(某时刻回到i | X₀ = i) = 1。否则称为暂态。',
        plainTranslation: '常返状态是"一定会回来的状态"。从常返状态出发，迟早会回到这个状态。比如天气模型中的晴天和雨天都是常返状态——晴天之后迟早还会晴天。',
        whyNeedIt: '常返性决定了状态的长期行为：常返状态会被无限次访问，暂态状态只会被有限次访问。',
        formula: 'f_{ii} = P(\\exists n > 0: X_n = i | X_0 = i) = 1',
        example: '随机游走：一维对称随机游走所有状态常返；三维对称随机游走所有状态暂态。'
      },
      {
        id: 'transient-state',
        name: '暂态',
        category: '状态分类',
        definition: '状态 i 称为暂态，如果从 i 出发，有正概率永远不回到 i。即 fᵢᵢ < 1。暂态只会被有限次访问。',
        plainTranslation: '暂态是"可能永远不回来的状态"。从暂态出发，有一定概率再也回不到这个状态。比如赌徒破产问题中，中间状态1,2,...,N-1是暂态——最终会被吸收到0或N。',
        whyNeedIt: '暂态在长期运行后不会被访问，理解暂态有助于分析过程的极限行为。',
        formula: 'f_{ii} < 1 \\Leftrightarrow \\text{暂态}',
        example: '赌徒破产问题：状态1,2,...,N-1是暂态，最终会离开不再回来。'
      },
      {
        id: 'positive-recurrent',
        name: '正常返',
        category: '状态分类',
        definition: '常返状态 i 称为正常返的，如果平均返回时间 μᵢ = E[返回i的时间 | X₀ = i] < ∞。若 μᵢ = ∞，称为零常返。',
        plainTranslation: '正常返是"平均来说，有限时间内会回来"的状态。零常返是"虽然一定会回来，但平均返回时间无限长"的状态。对于有限状态空间，所有常返状态都是正常返。',
        whyNeedIt: '正常返性是平稳分布存在的关键条件。零常返状态没有平稳分布。',
        formula: '\\mu_i = E[T_i | X_0 = i] < \\infty \\Rightarrow \\text{正常返}',
        example: '一维对称随机游走：所有状态常返但零常返（平均返回时间无限）。有限状态不可约链：所有状态正常返。'
      },
      {
        id: 'stationary-distribution',
        name: '平稳分布',
        category: '极限理论',
        definition: '平稳分布 π 是满足 π = πP 的概率分布。若初始分布是平稳分布，则任意时刻的分布都是 π。平稳分布描述了过程的长期稳定状态。',
        plainTranslation: '平稳分布是"不随时间变化的分布"。如果马尔科夫链从平稳分布开始，那么每一步的分布都保持不变。平稳分布就像"平衡态"——系统达到稳定后的状态分布。',
        whyNeedIt: '平稳分布是马尔科夫链最重要的特征，描述了过程的长期行为。',
        formula: '\\pi = \\pi P, \\quad \\sum_i \\pi_i = 1',
        example: '天气模型平稳分布：解方程组 π = πP，得 π = [4/7, 3/7]。长期来看，晴天概率4/7。'
      },
      {
        id: 'existence-of-stationary-distribution',
        name: '平稳分布的存在性',
        category: '极限理论',
        definition: '有限状态不可约马尔科夫链一定存在平稳分布，且平稳分布唯一。平稳分布 πᵢ = 1/μᵢ，其中 μᵢ 是状态 i 的平均返回时间。',
        plainTranslation: '平稳分布存在性定理告诉我们：只要马尔科夫链是有限状态且不可约的，就一定有唯一的平稳分布。这个分布可以通过解方程组 π = πP 得到。',
        whyNeedIt: '这个定理保证了平稳分布的存在性和唯一性，是马尔科夫链理论的核心结果。',
        formula: '\\pi_i = \\frac{1}{\\mu_i}, \\quad \\mu_i = E[T_i | X_0 = i]',
        example: '不可约有限链：解 π = πP，π₁ + π₂ + ... = 1，得唯一平稳分布。'
      },
      {
        id: 'convergence-to-stationary-distribution',
        name: '收敛到平稳分布',
        category: '极限理论',
        definition: '若马尔科夫链是不可约、非周期、正常返的，则对任意初始分布，lim(n→∞) P(Xₙ = j) = πⱼ，其中 π 是唯一的平稳分布。',
        plainTranslation: '收敛定理告诉我们：只要马尔科夫链满足一定条件（不可约、非周期、正常返），无论从哪个状态开始，经过足够长的时间后，状态分布都会收敛到平稳分布。这就像"忘记初始条件"——长期行为只由转移矩阵决定。',
        whyNeedIt: '收敛定理是马尔科夫链最重要的极限定理，保证了长期行为的可预测性。',
        formula: '\\lim_{n \\to \\infty} P(X_n = j | X_0 = i) = \\pi_j, \\quad \\forall i, j',
        example: '天气模型：无论第一天是晴天还是雨天，长期来看晴天概率都是4/7。'
      },
      {
        id: 'ergodic-theorem-for-markov-chains',
        name: '马尔科夫链的遍历定理',
        category: '极限理论',
        definition: '若马尔科夫链是不可约、正常返的，则对任意函数 f，时间平均几乎必然收敛于空间平均：(1/n)Σₖ₌₁ⁿ f(Xₖ) → Σᵢ πᵢf(i) a.s.',
        plainTranslation: '遍历定理是"时间平均等于空间平均"。长期观察一条样本轨道的平均值，等于平稳分布下的期望值。比如长期观察天气，晴天的比例会趋近于平稳分布中晴天的概率。',
        whyNeedIt: '遍历定理是统计推断的基础——可以用一条样本轨道的观测来估计平稳分布的性质。',
        formula: '\\frac{1}{n}\\sum_{k=1}^n f(X_k) \\xrightarrow{a.s.} \\sum_i \\pi_i f(i)',
        example: '长期观察天气，晴天比例 → 4/7（平稳分布中晴天概率）。'
      },
      {
        id: 'absorbing-state',
        name: '吸收状态',
        category: '特殊状态',
        definition: '状态 i 称为吸收状态，如果 pᵢᵢ = 1。一旦进入吸收状态，就永远停留在该状态。',
        plainTranslation: '吸收状态是"一旦进入就出不来的状态"。比如赌徒破产问题中的"破产"状态（钱为0）和"获胜"状态（钱为N），一旦到达就永远停留。吸收状态就像"陷阱"。',
        whyNeedIt: '吸收状态在可靠性分析、博弈论等领域有重要应用，描述了"终态"。',
        formula: 'p_{ii} = 1 \\Rightarrow \\text{吸收状态}',
        example: '赌徒破产：状态0和状态N是吸收状态。一旦破产或获胜，游戏结束。'
      },
      {
        id: 'absorption-probability',
        name: '吸收概率',
        category: '特殊状态',
        definition: '吸收概率是从某个状态出发，最终被某个吸收状态吸收的概率。对于赌徒破产问题，从状态 i 出发被状态 0 吸收的概率。',
        plainTranslation: '吸收概率是"最终落入某个吸收状态的概率"。比如赌徒从100元开始赌博，最终破产的概率是多少？这就是吸收概率。吸收概率可以通过解线性方程组计算。',
        whyNeedIt: '吸收概率描述了过程的最终结局，在博弈论、可靠性分析中有重要应用。',
        formula: 'u_i = \\text{从状态} i \\text{出发被吸收的概率}',
        example: '赌徒破产：从i元出发，破产概率 u_i = 1 - i/N（公平赌博）。'
      },
      {
        id: 'expected-time-to-absorption',
        name: '平均吸收时间',
        category: '特殊状态',
        definition: '平均吸收时间是从某个状态出发，最终被吸收状态吸收的平均步数。',
        plainTranslation: '平均吸收时间是"平均多少步后会被吸收"。比如赌徒从100元开始赌博，平均玩多少局后破产或获胜？平均吸收时间也可以通过解线性方程组计算。',
        whyNeedIt: '平均吸收时间描述了过程持续的时间长度，在可靠性分析中对应"平均寿命"。',
        formula: 't_i = E[\\text{被吸收的时间} | X_0 = i]',
        example: '赌徒破产：从i元出发，平均游戏局数 t_i = i(N-i)（公平赌博）。'
      },
      {
        id: 'birth-death-process',
        name: '生灭过程',
        category: '重要模型',
        definition: '生灭过程是状态空间为 {0, 1, 2, ...} 的马尔科夫链，只能转移到相邻状态：从状态 i 只能转移到 i-1、i 或 i+1。',
        plainTranslation: '生灭过程是"只能增减一个单位"的马尔科夫链。比如人口数量、排队人数、细菌数量，每次只能增加或减少一个。生灭过程结构简单，易于分析。',
        whyNeedIt: '生灭过程是排队论、人口模型、生物种群模型的基础。',
        formula: 'p_{i,i+1} = \\lambda_i, \\quad p_{i,i-1} = \\mu_i, \\quad p_{i,i} = 1 - \\lambda_i - \\mu_i',
        example: 'M/M/1排队：到达率λ，服务率μ。状态n表示系统中有n个顾客。'
      },
      {
        id: 'random-walk-markov-chain',
        name: '随机游走（马尔科夫链视角）',
        category: '重要模型',
        definition: '随机游走是状态空间为整数的马尔科夫链，每步以概率 p 向右移动（+1），以概率 q = 1-p 向左移动（-1）。',
        plainTranslation: '随机游走是最经典的马尔科夫链之一。想象一个醉汉在直线上行走，每步随机向左或向右。对称随机游走（p = 0.5）所有状态常返但零常返；有偏随机游走（p ≠ 0.5）所有状态暂态。',
        whyNeedIt: '随机游走是理解马尔科夫链的入门模型，在物理、金融等领域有广泛应用。',
        formula: 'p_{i,i+1} = p, \\quad p_{i,i-1} = q = 1-p',
        example: '对称随机游走（p = 0.5）：所有状态常返。有偏随机游走（p > 0.5）：向右漂移，所有状态暂态。'
      },
      {
        id: 'hidden-markov-model',
        name: '隐马尔科夫模型（HMM）',
        category: '应用模型',
        definition: '隐马尔科夫模型有两个随机过程：隐藏的状态序列 {Xₙ} 是马尔科夫链，观测序列 {Yₙ} 依赖于隐藏状态。Yₙ 的分布只依赖于 Xₙ。',
        plainTranslation: '隐马尔科夫模型是"状态看不见，只能看观测"的模型。比如语音识别：发音的音素（状态）是马尔科夫链，但我们只能听到声音（观测）。HMM的核心问题是：从观测推断隐藏状态。',
        whyNeedIt: 'HMM在语音识别、自然语言处理、生物信息学等领域有广泛应用。',
        formula: 'P(Y_n | X_n, X_{n-1}, \\ldots) = P(Y_n | X_n)',
        example: '语音识别：隐藏状态是音素，观测是声学特征。用HMM从声音推断音素序列。'
      },
      {
        id: 'viterbi-algorithm',
        name: 'Viterbi算法',
        category: '应用模型',
        definition: 'Viterbi算法是HMM中求解最可能状态序列的动态规划算法。给定观测序列，找出使联合概率最大的状态序列。',
        plainTranslation: 'Viterbi算法是"找最可能的状态路径"的算法。比如语音识别，给定听到的声音序列，找出最可能的音素序列。Viterbi算法用动态规划高效地解决了这个问题。',
        whyNeedIt: 'Viterbi算法是HMM解码问题的标准解法，在语音识别等领域是核心算法。',
        formula: '\\hat{X} = \\arg\\max_{X_1, \\ldots, X_n} P(X_1, \\ldots, X_n, Y_1, \\ldots, Y_n)',
        example: '语音识别：给定声音序列，Viterbi算法找出最可能的音素序列。'
      },
      {
        id: 'forward-backward-algorithm',
        name: '前向-后向算法',
        category: '应用模型',
        definition: '前向-后向算法是HMM中计算边缘概率的算法。前向变量 αₙ(i) = P(Y₁,...,Yₙ, Xₙ=i)，后向变量 βₙ(i) = P(Yₙ₊₁,...,Y_N | Xₙ=i)。',
        plainTranslation: '前向-后向算法是"计算每个时刻各状态概率"的算法。前向算法从前往后算，后向算法从后往前算，两者结合得到每个时刻各状态的后验概率。',
        whyNeedIt: '前向-后向算法是HMM学习问题的核心，用于估计模型参数。',
        formula: 'P(X_n = i | Y_1, \\ldots, Y_N) = \\frac{\\alpha_n(i) \\beta_n(i)}{\\sum_j \\alpha_n(j) \\beta_n(j)}',
        example: '语音识别：计算每个时刻各音素的后验概率。'
      },
      {
        id: 'markov-chain-monte-carlo',
        name: '马尔科夫链蒙特卡洛（MCMC）',
        category: '应用模型',
        definition: 'MCMC是用马尔科夫链进行抽样的方法。构造一个以目标分布为平稳分布的马尔科夫链，运行足够长时间后，链的状态近似服从目标分布。',
        plainTranslation: 'MCMC是"用马尔科夫链来抽样"的方法。想从一个复杂分布抽样，直接抽很难，但可以构造一个马尔科夫链，它的平稳分布就是目标分布。运行这个链，得到的状态序列就是目标分布的样本。',
        whyNeedIt: 'MCMC是贝叶斯统计、机器学习中最重要的抽样方法，解决了高维积分的难题。',
        formula: '\\text{构造} P \\text{ 使得 } \\pi \\text{ 是平稳分布}',
        example: 'Metropolis-Hastings算法、Gibbs采样都是MCMC方法。'
      },
      {
        id: 'metropolis-hastings-algorithm',
        name: 'Metropolis-Hastings算法',
        category: '应用模型',
        definition: 'Metropolis-Hastings算法是MCMC的通用框架。从提议分布 q(x\'|x) 提出新状态，以接受概率 α = min(1, π(x\')q(x|x\') / (π(x)q(x\'|x))) 接受。',
        plainTranslation: 'Metropolis-Hastings算法是"提议-接受"的抽样方法。每步先提议一个新状态，然后按一定概率决定接受还是拒绝。接受概率的设计保证了平稳分布是目标分布。',
        whyNeedIt: 'Metropolis-Hastings算法是最通用的MCMC方法，适用于任意目标分布。',
        formula: '\\alpha = \\min\\left(1, \\frac{\\pi(x\')q(x|x\')}{\\pi(x)q(x\'|x)}\\right)',
        example: '目标分布 π(x) ∝ exp(-x²/2)。提议 q(x\'|x) = N(x, 1)。接受概率保证收敛到 π。'
      },
      {
        id: 'gibbs-sampling',
        name: 'Gibbs采样',
        category: '应用模型',
        definition: 'Gibbs采样是多变量分布的MCMC方法。每次只更新一个变量，从该变量在给定其他变量条件下的条件分布中抽样。',
        plainTranslation: 'Gibbs采样是"逐个变量更新"的MCMC方法。比如二元分布(x,y)，先固定y更新x，再固定x更新y，循环进行。条件分布通常比联合分布简单，所以Gibbs采样很实用。',
        whyNeedIt: 'Gibbs采样是多变量贝叶斯推断的标准方法，条件分布容易抽样时特别有效。',
        formula: 'x_i^{(t+1)} \\sim P(x_i | x_1^{(t+1)}, \\ldots, x_{i-1}^{(t+1)}, x_{i+1}^{(t)}, \\ldots, x_n^{(t)})',
        example: '二元正态分布：交替从条件分布 N(μ₁+ρ(x₂-μ₂), 1-ρ²) 和 N(μ₂+ρ(x₁-μ₁), 1-ρ²) 抽样。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter22',
    name: '第二十二章 平稳随机过程',
    concepts: [
      {
        id: 'strictly-stationary-process',
        name: '严平稳过程',
        category: '基本概念',
        definition: '随机过程 {X(t)} 称为严平稳的，如果对任意 n、任意 t₁, ..., tₙ 和任意 h，(X(t₁), ..., X(tₙ)) 与 (X(t₁+h), ..., X(tₙ+h)) 同分布。即有限维分布不随时间平移而改变。',
        plainTranslation: '严平稳过程是"统计特性完全不随时间变化"的过程。今天观测到的数据分布，和明天、后天观测到的完全一样。就像一个永远不变的"电影场景"——无论何时暂停，画面特征都相同。',
        whyNeedIt: '严平稳性是随机过程理论中的核心概念，保证了过程的统计规律不随时间改变。',
        formula: '(X(t_1), \\ldots, X(t_n)) \\stackrel{d}{=} (X(t_1+h), \\ldots, X(t_n+h))',
        example: '独立同分布序列 {Xₙ} 是严平稳过程。平稳的马尔科夫链（从平稳分布出发）是严平稳过程。'
      },
      {
        id: 'wide-sense-stationary-process',
        name: '宽平稳过程（弱平稳过程）',
        category: '基本概念',
        definition: '随机过程 {X(t)} 称为宽平稳的，如果：(1) E[X(t)] = μ（常数）；(2) E[X(t)X(t+τ)] 只依赖于 τ。即均值恒定，协方差函数只依赖于时间差。',
        plainTranslation: '宽平稳过程是"一阶二阶矩不随时间变化"的过程。比严平稳要求低——只要求均值和协方差结构不变，不要求整个分布不变。实际中更容易验证和应用。',
        whyNeedIt: '宽平稳性是实际应用中最常用的平稳性概念，只涉及一阶二阶矩，便于检验和应用。',
        formula: 'E[X(t)] = \\mu, \\quad R(\\tau) = E[X(t)X(t+\\tau)]',
        example: '白噪声过程是宽平稳的。ARMA过程（满足一定条件）是宽平稳的。'
      },
      {
        id: 'autocorrelation-function',
        name: '自相关函数',
        category: '统计特征',
        definition: '自相关函数 R(τ) = E[X(t)X(t+τ)] 描述随机过程在相隔时间 τ 的两个时刻的相关性。对于平稳过程，自相关函数只依赖于时间差 τ。',
        plainTranslation: '自相关函数是"自己和自己延迟后的相关性"。比如气温过程，今天的气温和明天的气温相关系数是多少？这就是自相关函数。自相关函数揭示了过程的时间结构。',
        whyNeedIt: '自相关函数是平稳过程最重要的统计特征，描述了过程的时间相关性结构。',
        formula: 'R(\\tau) = E[X(t)X(t+\\tau)]',
        example: 'AR(1)过程 Xₙ = φXₙ₋₁ + εₙ 的自相关函数 R(k) = φ^|k|σ²/(1-φ²)。'
      },
      {
        id: 'autocovariance-function',
        name: '自协方差函数',
        category: '统计特征',
        definition: '自协方差函数 C(τ) = Cov[X(t), X(t+τ)] = E[(X(t)-μ)(X(t+τ)-μ)]。自协方差函数和自相关函数的关系：C(τ) = R(τ) - μ²。',
        plainTranslation: '自协方差函数是"去掉均值后的自相关"。当均值为零时，自协方差函数等于自相关函数。自协方差函数更直接地反映了波动之间的相关性。',
        whyNeedIt: '自协方差函数是平稳过程分析的基本工具，用于描述过程的二阶结构。',
        formula: 'C(\\tau) = E[(X(t) - \\mu)(X(t+\\tau) - \\mu)]',
        example: '平稳过程的自协方差函数 C(0) = Var[X(t)]，C(∞) = 0（对于混合过程）。'
      },
      {
        id: 'power-spectral-density',
        name: '功率谱密度',
        category: '频域分析',
        definition: '功率谱密度 S(ω) 是自协方差函数的傅里叶变换：S(ω) = ∫₋∞^∞ C(τ)e^{-iωτ}dτ。功率谱密度描述了过程的功率在不同频率上的分布。',
        plainTranslation: '功率谱密度是"把时间序列分解成不同频率成分"的工具。就像棱镜把白光分解成彩虹，功率谱密度把随机过程分解成不同频率的正弦波。高频成分变化快，低频成分变化慢。',
        whyNeedIt: '功率谱密度是频域分析的核心工具，在信号处理、通信、地震学等领域有重要应用。',
        formula: 'S(\\omega) = \\int_{-\\infty}^{\\infty} C(\\tau) e^{-i\\omega\\tau} d\\tau',
        example: '白噪声的功率谱密度是常数（所有频率功率相等）。低通滤波后的信号功率谱集中在低频。'
      },
      {
        id: 'wiener-khinchin-theorem',
        name: 'Wiener-Khinchin定理',
        category: '频域分析',
        definition: 'Wiener-Khinchin定理：平稳过程的自协方差函数和功率谱密度互为傅里叶变换对。C(τ) = (1/2π)∫₋∞^∞ S(ω)e^{iωτ}dω。',
        plainTranslation: 'Wiener-Khinchin定理建立了时域和频域的桥梁：自协方差函数（时域）和功率谱密度（频域）可以通过傅里叶变换互相转换。这就像"同一事物的两个视角"——时域看相关性，频域看频率成分。',
        whyNeedIt: 'Wiener-Khinchin定理是平稳过程理论的核心结果，连接了时域分析和频域分析。',
        formula: 'S(\\omega) = \\mathcal{F}[C(\\tau)], \\quad C(\\tau) = \\mathcal{F}^{-1}[S(\\omega)]',
        example: '已知自协方差函数 C(τ) = σ²e^{-α|τ|}，功率谱密度 S(ω) = 2σ²α/(α² + ω²)。'
      },
      {
        id: 'white-noise',
        name: '白噪声',
        category: '重要模型',
        definition: '白噪声是均值为零、自协方差函数为 C(τ) = σ²δ(τ) 的平稳过程。即不同时刻不相关，功率谱密度为常数。',
        plainTranslation: '白噪声是"完全随机、没有记忆"的过程。每个时刻的值都是独立的随机变量，过去的信息对未来没有任何预测价值。白噪声的功率谱是平的——所有频率功率相等，就像白光包含所有颜色。',
        whyNeedIt: '白噪声是最基本的平稳过程，是构建更复杂模型（如ARMA）的基础。',
        formula: 'C(\\tau) = \\sigma^2 \\delta(\\tau), \\quad S(\\omega) = \\sigma^2',
        example: '独立同分布的 N(0, σ²) 序列是高斯白噪声。股票日收益率常被建模为白噪声。'
      },
      {
        id: 'gaussian-white-noise',
        name: '高斯白噪声',
        category: '重要模型',
        definition: '高斯白噪声是服从正态分布的白噪声过程。{Xₙ} 独立同分布，Xₙ ~ N(0, σ²)。',
        plainTranslation: '高斯白噪声是"正态分布的白噪声"。每个时刻的值都独立地服从正态分布。高斯白噪声是最常用的随机干扰模型，在通信、控制、金融等领域广泛应用。',
        whyNeedIt: '高斯白噪声是理论分析和实际应用中最常用的噪声模型。',
        formula: 'X_n \\overset{iid}{\\sim} N(0, \\sigma^2)',
        example: '测量误差常建模为高斯白噪声：εₙ ~ N(0, σ²)，各次测量误差独立。'
      },
      {
        id: 'autoregressive-process',
        name: '自回归过程（AR过程）',
        category: '时间序列模型',
        definition: 'AR(p)过程定义为 Xₙ = φ₁Xₙ₋₁ + φ₂Xₙ₋₂ + ... + φₚXₙ₋ₚ + εₙ，其中 εₙ 是白噪声。当前值是过去值的线性组合加噪声。',
        plainTranslation: 'AR过程是"用过去的值预测现在的值"。比如今天的气温 = 0.7×昨天气温 + 随机扰动。AR过程有"记忆"——过去的信息影响现在，但影响随时间衰减。',
        whyNeedIt: 'AR过程是最基本的时间序列模型，在预测、信号处理等领域有广泛应用。',
        formula: 'X_n = \\phi_1 X_{n-1} + \\cdots + \\phi_p X_{n-p} + \\epsilon_n',
        example: 'AR(1)：Xₙ = 0.7Xₙ₋₁ + εₙ。自相关函数指数衰减：ρ(k) = 0.7^|k|。'
      },
      {
        id: 'moving-average-process',
        name: '移动平均过程（MA过程）',
        category: '时间序列模型',
        definition: 'MA(q)过程定义为 Xₙ = εₙ + θ₁εₙ₋₁ + ... + θ_qεₙ₋_q，其中 εₙ 是白噪声。当前值是当前和过去噪声的线性组合。',
        plainTranslation: 'MA过程是"用过去的噪声影响现在"。比如今天的气温 = 今天的随机扰动 + 0.5×昨天的随机扰动。MA过程的记忆有限——只记住最近q个噪声。',
        whyNeedIt: 'MA过程是时间序列分析的基本模型，与AR过程组合形成ARMA模型。',
        formula: 'X_n = \\epsilon_n + \\theta_1 \\epsilon_{n-1} + \\cdots + \\theta_q \\epsilon_{n-q}',
        example: 'MA(1)：Xₙ = εₙ + 0.5εₙ₋₁。自相关函数只在k=0,1非零：ρ(1) = 0.5/(1+0.5²)。'
      },
      {
        id: 'arma-process',
        name: 'ARMA过程',
        category: '时间序列模型',
        definition: 'ARMA(p,q)过程是AR(p)和MA(q)的组合：Xₙ = φ₁Xₙ₋₁ + ... + φₚXₙ₋ₚ + εₙ + θ₁εₙ₋₁ + ... + θ_qεₙ₋_q。',
        plainTranslation: 'ARMA过程是"AR和MA的结合"。既有自回归部分（过去的值影响现在），又有移动平均部分（过去的噪声影响现在）。ARMA模型比单独的AR或MA更灵活，能拟合更复杂的时间序列。',
        whyNeedIt: 'ARMA模型是时间序列分析的核心模型，广泛应用于经济、金融、气象等领域。',
        formula: 'X_n = \\sum_{i=1}^p \\phi_i X_{n-i} + \\epsilon_n + \\sum_{j=1}^q \\theta_j \\epsilon_{n-j}',
        example: 'ARMA(1,1)：Xₙ = 0.7Xₙ₋₁ + εₙ + 0.5εₙ₋₁。结合了AR和MA的特性。'
      },
      {
        id: 'stationarity-condition-for-ar',
        name: 'AR过程的平稳性条件',
        category: '时间序列模型',
        definition: 'AR(p)过程平稳的条件是特征方程 1 - φ₁z - φ₂z² - ... - φₚzᵖ = 0 的根都在单位圆外。对于AR(1)，平稳条件是 |φ₁| < 1。',
        plainTranslation: 'AR过程平稳条件是"特征根在单位圆外"。对于AR(1)，|φ| < 1 意味着过去的影响会逐渐衰减，过程稳定。如果 |φ| ≥ 1，过去的影响不衰减甚至放大，过程发散。',
        whyNeedIt: '平稳性条件保证了AR过程的稳定性，是模型有效的前提。',
        formula: '|\\phi_1| < 1 \\text{（AR(1)）}, \\quad \\text{特征根都在单位圆外（AR(p)）}',
        example: 'AR(1)：φ = 0.7，平稳。φ = 1.2，不平稳（发散）。φ = 1，单位根（随机游走，不平稳）。'
      },
      {
        id: 'unit-root',
        name: '单位根',
        category: '时间序列模型',
        definition: '当AR过程特征方程有根在单位圆上时，称为单位根过程。最常见的是AR(1)中 φ = 1，即随机游走 Xₙ = Xₙ₋₁ + εₙ。',
        plainTranslation: '单位根是"平稳和不平稳的边界"。有单位根的过程不平稳，方差会无限增大。比如随机游走 Xₙ = Xₙ₋₁ + εₙ，n步后的方差 = nσ²，越来越大。单位根检验是判断时间序列是否平稳的重要方法。',
        whyNeedIt: '单位根检验是时间序列分析的关键步骤，决定了后续建模方法的选择。',
        formula: 'X_n = X_{n-1} + \\epsilon_n \\text{（随机游走，单位根过程）}',
        example: '股票价格通常是单位根过程（随机游走），而股票收益率通常是平稳过程。'
      },
      {
        id: 'ergodic-theorem',
        name: '遍历定理',
        category: '理论基础',
        definition: '对于平稳遍历过程，时间平均几乎必然收敛于期望：lim(T→∞) (1/T)∫₀^T X(t)dt = E[X(t)] a.s.。即可以用一条样本轨道的时间平均来估计期望。',
        plainTranslation: '遍历定理是"时间平均等于空间平均"。长期观测一个样本，计算时间平均，会收敛到期望值。比如长期观测气温，计算平均值，会收敛到气温的期望。这让我们可以用一条样本轨道估计统计特征。',
        whyNeedIt: '遍历定理是平稳过程统计推断的理论基础，保证了时间平均的有效性。',
        formula: '\\lim_{T \\to \\infty} \\frac{1}{T} \\int_0^T X(t) dt = E[X(t)] \\quad a.s.',
        example: '长期观测平稳信号，时间平均收敛到均值。可以用来估计均值。'
      },
      {
        id: 'ergodicity',
        name: '遍历性',
        category: '理论基础',
        definition: '平稳过程称为遍历的，如果时间平均等于期望（空间平均）。遍历性保证了可以用一条样本轨道估计统计特征。',
        plainTranslation: '遍历性是"一条样本轨道代表整个过程"的性质。如果过程遍历，那么长期观测一条样本轨道，就能了解过程的全部统计特性。不遍历的过程可能需要多条样本轨道才能估计统计特征。',
        whyNeedIt: '遍历性是平稳过程统计推断的前提条件，保证了估计的一致性。',
        formula: '\\text{遍历} \\Leftrightarrow \\text{时间平均} = \\text{空间平均}',
        example: '独立同分布序列是遍历的。周期过程（如 X(t) = sin(t+θ)）不是遍历的。'
      },
      {
        id: 'spectral-representation',
        name: '谱表示',
        category: '频域分析',
        definition: '平稳过程的谱表示：X(t) = ∫₋∞^∞ e^{iωt}dZ(ω)，其中 Z(ω) 是正交增量过程。平稳过程可以表示为不同频率正弦波的叠加。',
        plainTranslation: '谱表示是"把平稳过程分解成正弦波"的数学表达。任何平稳过程都可以写成无穷多个不同频率正弦波的叠加，每个频率的"振幅"由谱测度决定。这是傅里叶分析在随机过程中的推广。',
        whyNeedIt: '谱表示是平稳过程理论的核心结果，揭示了平稳过程的频域结构。',
        formula: 'X(t) = \\int_{-\\infty}^{\\infty} e^{i\\omega t} dZ(\\omega)',
        example: '平稳高斯过程的谱表示中，Z(ω) 是复高斯过程。'
      },
      {
        id: 'linear-filter',
        name: '线性滤波',
        category: '应用',
        definition: '线性滤波是将输入过程 X(t) 通过线性系统得到输出 Y(t)：Y(t) = ∫h(s)X(t-s)ds，其中 h(s) 是滤波器的脉冲响应。平稳过程通过线性滤波器后仍是平稳过程。',
        plainTranslation: '线性滤波是"对信号做线性变换"。比如低通滤波器只保留低频成分，高通滤波器只保留高频成分。输入是平稳过程，输出也是平稳过程，但功率谱会改变。',
        whyNeedIt: '线性滤波是信号处理的核心技术，用于去噪、特征提取、信号分离等。',
        formula: 'Y(t) = \\int h(s) X(t-s) ds, \\quad S_Y(\\omega) = |H(\\omega)|^2 S_X(\\omega)',
        example: '移动平均滤波：Yₙ = (Xₙ + Xₙ₋₁ + Xₙ₋₂)/3。平滑信号，去除高频噪声。'
      },
      {
        id: 'cross-correlation-function',
        name: '互相关函数',
        category: '多变量过程',
        definition: '两个平稳过程 X(t) 和 Y(t) 的互相关函数 R_{XY}(τ) = E[X(t)Y(t+τ)]。互相关函数描述两个过程之间的相关性结构。',
        plainTranslation: '互相关函数是"两个过程之间的相关性"。比如今天的气温和明天的用电量，互相关函数告诉我们它们之间有什么关系、谁先谁后。互相关函数在信号检测、系统辨识中有重要应用。',
        whyNeedIt: '互相关函数是分析两个随机过程关系的重要工具，在系统辨识、信号处理中应用广泛。',
        formula: 'R_{XY}(\\tau) = E[X(t)Y(t+\\tau)]',
        example: '输入X(t)和输出Y(t)的互相关函数可以辨识系统的脉冲响应。'
      },
      {
        id: 'cross-spectral-density',
        name: '互谱密度',
        category: '多变量过程',
        definition: '互谱密度 S_{XY}(ω) 是互相关函数的傅里叶变换：S_{XY}(ω) = ∫₋∞^∞ R_{XY}(τ)e^{-iωτ}dτ。互谱密度描述两个过程在不同频率上的相关性。',
        plainTranslation: '互谱密度是"两个过程在频域的相关性"。它告诉我们两个过程在各个频率上的关系：哪些频率上相关强，哪些频率上相关弱。互谱密度是频域分析两个过程关系的核心工具。',
        whyNeedIt: '互谱密度是分析两个平稳过程频域关系的核心工具，在信号处理、系统辨识中应用广泛。',
        formula: 'S_{XY}(\\omega) = \\int_{-\\infty}^{\\infty} R_{XY}(\\tau) e^{-i\\omega\\tau} d\\tau',
        example: '输入输出信号的互谱密度可以估计系统的传递函数。'
      },
      {
        id: 'coherence-function',
        name: '相干函数',
        category: '多变量过程',
        definition: '相干函数 γ²_{XY}(ω) = |S_{XY}(ω)|² / (S_X(ω)S_Y(ω)) 是标准化的互谱密度，取值在 [0, 1] 之间，衡量两个过程在各频率上的线性相关程度。',
        plainTranslation: '相干函数是"两个过程在各频率上的相关系数"。相干函数 = 1 表示该频率上完全线性相关，= 0 表示不相关。相干函数消除了功率的影响，便于比较不同频率的相关性。',
        whyNeedIt: '相干函数是衡量两个信号频率相关性的标准工具，在信号分析、系统辨识中广泛应用。',
        formula: '\\gamma^2_{XY}(\\omega) = \\frac{|S_{XY}(\\omega)|^2}{S_X(\\omega) S_Y(\\omega)}',
        example: '脑电信号分析：不同脑区的相干函数反映大脑功能连接。'
      },
      {
        id: 'wold-decomposition',
        name: 'Wold分解定理',
        category: '理论基础',
        definition: 'Wold分解定理：任意平稳过程 X(t) 可以分解为 X(t) = Y(t) + Z(t)，其中 Y(t) 是确定性部分，Z(t) 是纯非确定性部分（可表示为MA(∞)过程）。',
        plainTranslation: 'Wold分解是"把平稳过程拆成可预测和不可预测两部分"。确定性部分可以完全预测，非确定性部分只能用过去的噪声表示。这个定理告诉我们：任何平稳过程都可以用ARMA模型近似。',
        whyNeedIt: 'Wold分解是时间序列理论的基础，证明了ARMA模型的普适性。',
        formula: 'X(t) = Y(t) + Z(t), \\quad Z(t) = \\sum_{j=0}^{\\infty} \\psi_j \\epsilon_{t-j}',
        example: '平稳过程的Wold分解保证了可以用ARMA模型建模。'
      },
      {
        id: 'karhunen-loeve-expansion',
        name: 'Karhunen-Loève展开',
        category: '理论基础',
        definition: 'Karhunen-Loève展开将随机过程表示为正交函数的级数：X(t) = Σₙ √λₙφₙ(t)Zₙ，其中 φₙ 是特征函数，λₙ 是特征值，Zₙ 是不相关的随机变量。',
        plainTranslation: 'Karhunen-Loève展开是"用最优正交基展开随机过程"。就像傅里叶级数展开确定性函数，K-L展开用协方差函数的特征函数展开随机过程。这是"主成分分析"在随机过程中的推广。',
        whyNeedIt: 'K-L展开是随机过程分析的重要工具，在信号处理、模式识别中有重要应用。',
        formula: 'X(t) = \\sum_{n=1}^{\\infty} \\sqrt{\\lambda_n} \\phi_n(t) Z_n',
        example: '布朗运动的K-L展开：特征函数 φₙ(t) = √2 sin((n-1/2)πt)，特征值 λₙ = 1/((n-1/2)²π²)。'
      },
      {
        id: 'sample-autocorrelation',
        name: '样本自相关函数',
        category: '统计推断',
        definition: '样本自相关函数 r̂(k) = Σₙ₌₁^{N-k}(Xₙ - X̄)(Xₙ₊ₖ - X̄) / Σₙ₌₁^N(Xₙ - X̄)² 是自相关函数的估计量。',
        plainTranslation: '样本自相关函数是"用数据估计的自相关函数"。给定时间序列数据，计算不同滞后期的相关系数，画出自相关图。自相关图可以帮助识别时间序列模型类型（AR、MA还是ARMA）。',
        whyNeedIt: '样本自相关函数是时间序列分析的基本工具，用于模型识别和诊断。',
        formula: '\\hat{r}(k) = \\frac{\\sum_{n=1}^{N-k}(X_n - \\bar{X})(X_{n+k} - \\bar{X})}{\\sum_{n=1}^N(X_n - \\bar{X})^2}',
        example: 'AR(1)过程的样本自相关图呈指数衰减。MA(1)过程的样本自相关图在k=1后截尾。'
      },
      {
        id: 'periodogram',
        name: '周期图',
        category: '统计推断',
        definition: '周期图是功率谱密度的非参数估计：I(ω) = (1/n)|Σₜ₌₁^n Xₜe^{-iωt}|²。周期图是样本的傅里叶变换的模平方。',
        plainTranslation: '周期图是"直接从数据估计功率谱"的方法。把数据做傅里叶变换，取模平方，就是周期图。周期图可以直接显示数据中有哪些频率成分，但方差大，需要平滑处理。',
        whyNeedIt: '周期图是谱估计的基础方法，可以揭示数据的周期性和频率结构。',
        formula: 'I(\\omega) = \\frac{1}{n}\\left|\\sum_{t=1}^n X_t e^{-i\\omega t}\\right|^2',
        example: '分析气温数据，周期图在频率 ω = 2π/365 处有峰值，显示年周期。'
      },
      {
        id: 'spectral-estimation',
        name: '谱估计',
        category: '统计推断',
        definition: '谱估计是从数据估计功率谱密度的方法。主要方法：周期图法、平滑周期图法（Welch法）、参数方法（AR谱估计）等。',
        plainTranslation: '谱估计是"从数据推断功率谱"的技术。周期图法简单但方差大；Welch法把数据分段平均，降低方差；AR谱估计假设数据是AR过程，估计参数后计算功率谱。不同方法各有优缺点。',
        whyNeedIt: '谱估计是信号处理的核心技术，用于分析信号的频率成分。',
        formula: '\\hat{S}(\\omega) = \\text{谱估计方法}',
        example: 'Welch法：数据分段→每段加窗→计算周期图→平均。比原始周期图方差小。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter-23',
    name: '第二十三章 行列式',
    concepts: [
      {
        id: 'determinant-definition',
        name: '行列式的定义',
        category: '基本概念',
        definition: 'n阶行列式是n×n方阵的一个标量值，定义为所有不同行不同列元素乘积的代数和：det(A) = Σ_{σ∈S_n} sgn(σ) ∏_{i=1}^n a_{i,σ(i)}，其中 S_n 是n阶置换群，sgn(σ) 是置换的符号。',
        plainTranslation: '行列式是"方阵的一个数字"，它把一个方形表格压缩成一个数。这个数的计算方式是：从每行选一个元素，每列也只能选一个，把选出的n个数相乘，再根据"排列的逆序数"决定正负号，最后把所有可能的选法加起来。行列式告诉我们这个矩阵"把空间拉伸或压缩了多少倍"。',
        whyNeedIt: '行列式是线性代数的核心概念，它刻画了线性变换对体积的缩放因子，是判断矩阵可逆性、求解线性方程组、计算特征值的基础。',
        formula: '|A| = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^{n} a_{i,\\sigma(i)}',
        example: '2阶行列式：|a b; c d| = ad - bc。比如 |2 1; 3 4| = 2×4 - 1×3 = 5。'
      },
      {
        id: 'determinant-geometric-meaning',
        name: '行列式的几何意义',
        category: '几何解释',
        definition: '行列式的绝对值等于由矩阵的行（或列）向量张成的平行多面体的体积。行列式的符号表示线性变换的方向：正号表示保持定向，负号表示反转定向。',
        plainTranslation: '行列式的几何意义是"体积的缩放倍数"。把矩阵看成线性变换，行列式的绝对值就是变换后单位正方体变成的新形体的体积。行列式为2，意味着面积放大2倍；行列式为0，意味着图形被"压扁"成一条线或一个点。',
        whyNeedIt: '几何意义帮助直观理解行列式，解释了为什么行列式为0时矩阵不可逆（体积被压缩为0，无法恢复）。',
        formula: '|A| \\text{的绝对值} = \\text{平行多面体体积}',
        example: '矩阵 [2 0; 0 3] 的行列式 = 6，表示单位正方形被拉伸成2×3的矩形，面积放大6倍。'
      },
      {
        id: 'determinant-properties',
        name: '行列式的性质',
        category: '基本性质',
        definition: '行列式的主要性质包括：(1) det(A^T) = det(A)；(2) det(AB) = det(A)det(B)；(3) det(A^{-1}) = 1/det(A)；(4) 交换两行（列），行列式变号；(5) 某行（列）乘以k，行列式乘以k；(6) 两行（列）成比例，行列式为0。',
        plainTranslation: '行列式的性质是"计算和化简的利器"。转置不改变行列式；乘积的行列式等于行列式的乘积；交换两行要变号；一行乘以k，整个行列式乘以k；两行相同或成比例，行列式直接为0。这些性质让行列式计算变得简单。',
        whyNeedIt: '行列式的性质是计算行列式和证明相关定理的基础，大大简化了行列式的计算过程。',
        formula: '|AB| = |A| \\cdot |B|, \\quad |A^T| = |A|',
        example: '若 det(A) = 3，det(B) = 2，则 det(AB) = 6，det(A²) = 9，det(A^{-1}) = 1/3。'
      },
      {
        id: 'cofactor-expansion',
        name: '余子式展开',
        category: '计算方法',
        definition: '行列式按第i行展开：det(A) = Σ_{j=1}^n a_{ij}C_{ij}，其中 C_{ij} = (-1)^{i+j}M_{ij} 是代数余子式，M_{ij} 是去掉第i行第j列后的子行列式。也可以按列展开。',
        plainTranslation: '余子式展开是"把大行列式拆成小行列式"的方法。选一行，每个元素乘以它的"余子式"（去掉该行该列后剩下的小行列式），再加起来。就像剥洋葱，一层层把n阶行列式降成n-1阶，直到变成2阶或1阶直接算出。',
        whyNeedIt: '余子式展开是计算行列式的基本方法，特别适合含有大量零元素的行列式。',
        formula: '|A| = \\sum_{j=1}^{n} a_{ij} C_{ij} = \\sum_{j=1}^{n} a_{ij} (-1)^{i+j} M_{ij}',
        example: '3阶行列式按第一行展开：|a b c; d e f; g h i| = a|e f; h i| - b|d f; g i| + c|d e; g h|。'
      },
      {
        id: 'cofactor',
        name: '代数余子式',
        category: '基本概念',
        definition: '元素 a_{ij} 的代数余子式 C_{ij} = (-1)^{i+j}M_{ij}，其中 M_{ij} 是余子式，即去掉第i行第j列后得到的(n-1)阶子行列式。',
        plainTranslation: '代数余子式是"去掉一行一列后的小行列式，再乘以正负号"。正负号由位置决定：像棋盘黑白格一样交替，左上角是正。代数余子式是行列式展开的"积木块"。',
        whyNeedIt: '代数余子式是行列式展开和伴随矩阵定义的基础，在求逆矩阵和克拉默法则中有重要应用。',
        formula: 'C_{ij} = (-1)^{i+j} M_{ij}',
        example: '矩阵 [1 2 3; 4 5 6; 7 8 9] 中，a_{11}=1的代数余子式 C_{11} = +|5 6; 8 9| = 45-48 = -3。'
      },
      {
        id: 'triangular-determinant',
        name: '三角行列式',
        category: '特殊形式',
        definition: '上三角行列式和下三角行列式的值都等于主对角线元素的乘积：det(A) = ∏_{i=1}^n a_{ii}。对角行列式是其特例。',
        plainTranslation: '三角行列式是"最简单的行列式"——直接把主对角线上的数乘起来就行。上三角是左下角全为0，下三角是右上角全为0。这给了我们计算行列式的策略：先用行变换化成三角矩阵，再算对角线乘积。',
        whyNeedIt: '三角行列式的简单性质是高效计算行列式的基础，高斯消元法就是利用这一性质。',
        formula: '\\begin{vmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ 0 & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\ddots & \\ddots & \\vdots \\\\ 0 & \\cdots & 0 & a_{nn} \\end{vmatrix} = \\prod_{i=1}^{n} a_{ii}',
        example: '上三角行列式 |2 3 5; 0 4 6; 0 0 1| = 2×4×1 = 8。'
      },
      {
        id: 'cramer-rule',
        name: '克拉默法则',
        category: '应用',
        definition: '对于n元线性方程组 Ax = b，若 det(A) ≠ 0，则唯一解为 x_j = det(A_j)/det(A)，其中 A_j 是将A的第j列换成b得到的矩阵。',
        plainTranslation: '克拉默法则是"用行列式解线性方程组"的方法。每个未知数的解是一个分数：分母是系数矩阵的行列式，分子是把常数项替换该未知数系数列后的行列式。虽然理论上漂亮，但实际计算量大，主要用于理论推导。',
        whyNeedIt: '克拉默法则给出了线性方程组解的显式公式，在理论分析和低维情形下有重要价值。',
        formula: 'x_j = \\frac{|A_j|}{|A|}, \\quad j = 1, 2, \\ldots, n',
        example: '方程组 {2x + y = 5; x + 3y = 6}：det(A) = 5，det(A₁) = 9，det(A₂) = 7，所以 x = 9/5，y = 7/5。'
      },
      {
        id: 'vandermonde-determinant',
        name: '范德蒙德行列式',
        category: '特殊行列式',
        definition: '范德蒙德行列式 V_n = ∏_{1≤i<j≤n}(x_j - x_i)，其矩阵形式为 V = (x_i^{j-1})_{n×n}，即第i行第j列元素为 x_i^{j-1}。',
        plainTranslation: '范德蒙德行列式是"多项式插值的产物"。它的值是所有"大下标减小下标"的乘积。这个行列式告诉我们：如果x₁, x₂, ..., xₙ互不相同，范德蒙德行列式不为零，这意味着插值问题有唯一解。',
        whyNeedIt: '范德蒙德行列式在多项式插值、数值分析中有重要应用，是判断插值问题唯一性的关键。',
        formula: 'V_n = \\begin{vmatrix} 1 & x_1 & x_1^2 & \\cdots & x_1^{n-1} \\\\ 1 & x_2 & x_2^2 & \\cdots & x_2^{n-1} \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 1 & x_n & x_n^2 & \\cdots & x_n^{n-1} \\end{vmatrix} = \\prod_{1 \\leq i < j \\leq n} (x_j - x_i)',
        example: '3阶范德蒙德：|1 1 1; 1 2 4; 1 3 9| = (2-1)(3-1)(3-2) = 1×2×1 = 2。'
      },
      {
        id: 'adjugate-matrix',
        name: '伴随矩阵',
        category: '相关概念',
        definition: '矩阵A的伴随矩阵 adj(A) 是代数余子式矩阵的转置：adj(A) = (C_{ij})^T，其中 C_{ij} 是 a_{ij} 的代数余子式。',
        plainTranslation: '伴随矩阵是"代数余子式重新排列后的矩阵"。把每个位置换成它的代数余子式，然后转置（行列互换）。伴随矩阵有一个神奇性质：A × adj(A) = det(A) × I，这给出了求逆矩阵的公式。',
        whyNeedIt: '伴随矩阵是求逆矩阵的重要工具，逆矩阵公式 A^{-1} = adj(A)/det(A) 的基础。',
        formula: 'A^{-1} = \\frac{1}{|A|} \\text{adj}(A), \\quad A \\cdot \\text{adj}(A) = |A| \\cdot I',
        example: '矩阵 [1 2; 3 4] 的伴随矩阵是 [4 -2; -3 1]，逆矩阵 = (1/-2)[4 -2; -3 1] = [-2 1; 1.5 -0.5]。'
      },
      {
        id: 'determinant-and-invertibility',
        name: '行列式与可逆性',
        category: '重要关系',
        definition: '方阵A可逆的充要条件是 det(A) ≠ 0。行列式为零的矩阵称为奇异矩阵，不可逆。',
        plainTranslation: '行列式是"判断矩阵能否求逆的试金石"。行列式非零，矩阵可逆；行列式为零，矩阵不可逆。几何上说，行列式为零意味着线性变换把空间"压扁"了，信息丢失了，无法恢复。',
        whyNeedIt: '行列式提供了判断矩阵可逆性的简单方法，是线性代数理论的核心联系之一。',
        formula: 'A \\text{ 可逆} \\Leftrightarrow |A| \\neq 0',
        example: '矩阵 [1 2; 2 4] 的行列式 = 4-4 = 0，不可逆。因为第二行是第一行的2倍，两行"平行"。'
      },
      {
        id: 'determinant-and-rank',
        name: '行列式与秩',
        category: '重要关系',
        definition: '矩阵A的秩等于A中非零子式的最高阶数。若 det(A) = 0，则 rank(A) < n。r阶子式是选取r行r列后形成的r阶方阵的行列式。',
        plainTranslation: '行列式和秩的关系是"子式定秩"。矩阵的秩等于最大的"非零子式"的阶数。如果所有3阶子式都是0，但存在非零的2阶子式，秩就是2。行列式为零说明秩不满，非零子式的最大阶数就是秩。',
        whyNeedIt: '行列式提供了计算矩阵秩的方法，揭示了秩与行列式之间的深刻联系。',
        formula: '\\text{rank}(A) = \\max\\{r : \\text{存在} r \\text{阶非零子式}\\}',
        example: '矩阵 [1 2 3; 2 4 6; 1 1 1]：3阶行列式 = 0，但存在非零2阶子式（如|1 2; 1 1| = -1），所以秩 = 2。'
      },
      {
        id: 'determinant-of-product',
        name: '乘积的行列式',
        category: '基本性质',
        definition: '两个n阶方阵乘积的行列式等于各自行列式的乘积：det(AB) = det(A)·det(B)。这个性质可以推广到多个矩阵的乘积。',
        plainTranslation: '乘积的行列式是"行列式的乘积"。两个矩阵相乘后求行列式，等于先分别求行列式再相乘。几何意义：连续做两次线性变换，总体积变化等于各次变化的乘积。',
        whyNeedIt: '这个性质是行列式理论的核心，在证明矩阵可逆性、计算复杂矩阵的行列式中有重要应用。',
        formula: '|AB| = |A| \\cdot |B|',
        example: '若 det(A) = 2，det(B) = 3，则 det(AB) = 6，det(A²) = 4，det(A^{10}) = 1024。'
      },
      {
        id: 'determinant-of-transpose',
        name: '转置的行列式',
        category: '基本性质',
        definition: '矩阵转置后行列式不变：det(A^T) = det(A)。这是因为行列式定义中行和列的地位是对称的。',
        plainTranslation: '转置不改变行列式的值。把矩阵"横过来"，行列式还是原来那个数。这意味着行列式的所有"行性质"对"列"同样适用，比如可以按列展开、列变换的规则和行变换一样。',
        whyNeedIt: '这个性质大大简化了行列式的计算和理论分析，使行列式对行和列具有对称性。',
        formula: '|A^T| = |A|',
        example: '矩阵 [1 2; 3 4] 和它的转置 [1 3; 2 4] 行列式都是 -2。'
      },
      {
        id: 'determinant-of-inverse',
        name: '逆矩阵的行列式',
        category: '基本性质',
        definition: '若A可逆，则 det(A^{-1}) = 1/det(A)。这可由 det(A)·det(A^{-1}) = det(I) = 1 推出。',
        plainTranslation: '逆矩阵的行列式是"原矩阵行列式的倒数"。如果A的行列式是3，那A^{-1}的行列式就是1/3。几何意义：如果A把体积放大3倍，那A^{-1}就把体积缩小到1/3。',
        whyNeedIt: '这个性质在计算逆矩阵的行列式和分析线性变换的逆变换时很有用。',
        formula: '|A^{-1}| = \\frac{1}{|A|}',
        example: '若 det(A) = 5，则 det(A^{-1}) = 1/5，det(A^{-2}) = 1/25。'
      },
      {
        id: 'row-column-operations',
        name: '行列式的行列变换',
        category: '计算方法',
        definition: '行列式的变换规则：(1) 交换两行（列），行列式变号；(2) 某行（列）乘以k，行列式乘以k；(3) 某行（列）加上另一行（列）的k倍，行列式不变。',
        plainTranslation: '行列变换是"化简行列式的技巧"。交换两行要变号；一行乘以k，整个行列式乘以k；一行加上另一行的倍数，行列式不变。利用第三条规则，可以把行列式化成三角形式，直接算对角线乘积。',
        whyNeedIt: '行列变换是计算高阶行列式的主要方法，比直接展开更高效。',
        formula: '\\begin{aligned} &\\text{交换} r_i \\leftrightarrow r_j: \\det \\to -\\det \\\\ &\\text{倍乘} r_i \\times k: \\det \\to k \\det \\\\ &\\text{倍加} r_i + kr_j: \\det \\text{不变} \\end{aligned}',
        example: '计算 |1 2 3; 4 5 6; 7 8 9|：r₂ - 4r₁，r₃ - 7r₁ 得 |1 2 3; 0 -3 -6; 0 -6 -12| = |1 2 3; 0 -3 -6; 0 0 0| = 0。'
      },
      {
        id: 'block-determinant',
        name: '分块行列式',
        category: '高级方法',
        definition: '对于分块矩阵，若A可逆，则 |A B; C D| = det(A)·det(D - CA^{-1}B)。特殊地，若C = 0或B = 0，则 |A B; 0 D| = det(A)·det(D)。',
        plainTranslation: '分块行列式是"把大矩阵切成小块来算"。如果左下角或右上角是零块，行列式就等于对角块行列式的乘积。这类似于三角矩阵的行列式等于对角线乘积的推广。',
        whyNeedIt: '分块行列式简化了大矩阵行列式的计算，在理论推导和实际计算中都有重要应用。',
        formula: '\\begin{vmatrix} A & B \\\\ 0 & D \\end{vmatrix} = |A| \\cdot |D|',
        example: '|A 0; C D| = det(A)·det(D)，就像 |a 0; c d| = ad 一样。'
      },
      {
        id: 'determinant-and-eigenvalue',
        name: '行列式与特征值',
        category: '重要关系',
        definition: '矩阵A的行列式等于所有特征值的乘积：det(A) = λ₁·λ₂·...·λₙ。特征值是特征方程 det(A - λI) = 0 的根。',
        plainTranslation: '行列式和特征值的关系是"乘积关系"。行列式等于所有特征值乘起来。如果特征值是2, 3, 5，行列式就是30。几何意义：每个特征值是一个方向的"拉伸倍数"，乘起来就是总体积变化。',
        whyNeedIt: '这个关系揭示了行列式与特征值的深刻联系，是特征值理论的重要组成部分。',
        formula: '|A| = \\prod_{i=1}^{n} \\lambda_i',
        example: '矩阵 [2 0; 0 3] 的特征值是2和3，行列式 = 6 = 2×3。'
      },
      {
        id: 'determinant-and-trace',
        name: '行列式与迹',
        category: '重要关系',
        definition: '矩阵的迹（对角线元素之和）等于特征值之和：tr(A) = λ₁ + λ₂ + ... + λₙ。行列式是特征值之积，迹是特征值之和。',
        plainTranslation: '迹和行列式是"特征值的和与积"。迹是所有特征值加起来，行列式是所有特征值乘起来。两个数一起，给出了特征值的重要信息。比如特征值是2和3，迹=5，行列式=6。',
        whyNeedIt: '迹和行列式提供了特征值的基本信息，在不需要求出全部特征值时很有用。',
        formula: '\\text{tr}(A) = \\sum_{i=1}^{n} \\lambda_i, \\quad |A| = \\prod_{i=1}^{n} \\lambda_i',
        example: '2×2矩阵的特征多项式 λ² - tr(A)λ + det(A) = 0，用迹和行列式直接写出特征方程。'
      },
      {
        id: 'determinant-expansion-theorem',
        name: '行列式展开定理',
        category: '理论基础',
        definition: '行列式按某行（列）展开等于该行（列）元素与对应代数余子式乘积之和。异行（列）展开等于零：Σ_{j=1}^n a_{ij}C_{kj} = 0 (i ≠ k)。',
        plainTranslation: '展开定理说的是"按自己行展开得行列式，按别人行展开得零"。这就像"各人自扫门前雪"——每个元素只对自己的代数余子式有贡献，对别人的代数余子式"贡献抵消"。',
        whyNeedIt: '展开定理是行列式计算和伴随矩阵性质的理论基础。',
        formula: '\\sum_{j=1}^{n} a_{ij} C_{kj} = \\begin{cases} |A|, & i = k \\\\ 0, & i \\neq k \\end{cases}',
        example: '对于 [1 2; 3 4]，a₁₁C₂₁ + a₁₂C₂₂ = 1×(-4) + 2×3 = 2 ≠ det = -2，因为这是异行展开。'
      },
      {
        id: 'laplace-expansion',
        name: '拉普拉斯展开',
        category: '计算方法',
        definition: '拉普拉斯展开是余子式展开的推广，可以按多行（列）同时展开。选定k行后，行列式等于所有k阶子式与对应余子式乘积之和。',
        plainTranslation: '拉普拉斯展开是"一次展开多行"的方法。比如按前两行展开，把这两行的所有2阶子式乘以对应的余子式，再加起来。这在某些特殊结构的行列式计算中很有效。',
        whyNeedIt: '拉普拉斯展开提供了更灵活的行列式计算方法，适合处理有特殊结构的行列式。',
        formula: '|A| = \\sum_{1 \\leq j_1 < \\cdots < j_k \\leq n} M_{i_1\\cdots i_k, j_1\\cdots j_k} \\cdot C_{i_1\\cdots i_k, j_1\\cdots j_k}',
        example: '对于分块对角矩阵，拉普拉斯展开直接给出 det = det(A₁)·det(A₂)。'
      },
      {
        id: 'determinant-inequality',
        name: '行列式不等式',
        category: '理论结果',
        definition: 'Hadamard不等式：对于矩阵A = (a₁, a₂, ..., aₙ)，|det(A)| ≤ ∏_{i=1}^n ||aᵢ||，即行列式的绝对值不超过各列（行）向量长度的乘积。等号成立当且仅当各列正交。',
        plainTranslation: 'Hadamard不等式说"行列式最大不过各列长度的乘积"。几何意义：平行多面体的体积最大不超过各边长的乘积，当各边相互垂直时达到最大。这就像矩形面积最大是长×宽，斜的平行四边形面积更小。',
        whyNeedIt: 'Hadamard不等式在数值分析和矩阵理论中有重要应用，给出了行列式的上界估计。',
        formula: '|A| \\text{的绝对值} \\leq \\prod_{i=1}^{n} \\|a_i\\| \\quad \\text{(Hadamard不等式)}',
        example: '矩阵 [3 0; 0 4] 各列正交，|det| = 12 = 3×4，达到上界。[3 1; 1 4] 的 |det| = 11 < √10×√17 ≈ 13。'
      },
      {
        id: 'determinant-derivative',
        name: '行列式的导数',
        category: '微积分关系',
        definition: '若矩阵A的元素是参数t的函数，则 d/dt det(A) = det(A) · tr(A^{-1} dA/dt)。对于单元素 a_{ij} 的偏导：∂det(A)/∂a_{ij} = C_{ij}（代数余子式）。',
        plainTranslation: '行列式对参数的导数是"行列式乘以逆矩阵导数的迹"。对单个元素的偏导更简单：等于该元素的代数余子式。这在优化问题中很有用，比如最大似然估计中求导。',
        whyNeedIt: '行列式的导数在优化、统计估计、机器学习中有重要应用。',
        formula: '\\frac{d}{dt} |A| = |A| \\cdot \\text{tr}(A^{-1} \\frac{dA}{dt})',
        example: '对于 A = [t 0; 0 1]，det(A) = t，d/dt det(A) = 1 = det(A)·tr(A^{-1}dA/dt) = t·(1/t) = 1。'
      },
      {
        id: 'determinant-application-volume',
        name: '行列式应用：体积计算',
        category: '应用',
        definition: '由向量v₁, v₂, ..., vₙ张成的平行多面体的体积等于由这些向量组成的矩阵的行列式的绝对值：V = |det(v₁, v₂, ..., vₙ)|。',
        plainTranslation: '行列式直接给出平行多面体的体积。在二维，两个向量张成的平行四边形面积 = 行列式绝对值；在三维，三个向量张成的平行六面体体积 = 行列式绝对值。这是行列式几何意义的具体应用。',
        whyNeedIt: '行列式提供了计算多维体积的统一方法，在几何、物理、工程中有广泛应用。',
        formula: 'V = |(v_1, v_2, \\ldots, v_n)|',
        example: '向量 (1,0,0), (0,2,0), (0,0,3) 张成的长方体体积 = |det| = |1×2×3| = 6。'
      },
      {
        id: 'determinant-application-change-of-variables',
        name: '行列式应用：变量替换',
        category: '应用',
        definition: '在多重积分的变量替换中，雅可比行列式 |∂(x,y,z)/∂(u,v,w)| 给出了体积元素的变换因子：dx dy dz = |J| du dv dw。',
        plainTranslation: '变量替换中的雅可比行列式是"坐标变换的缩放因子"。换坐标时，面积或体积会变化，变化倍数就是雅可比行列式的绝对值。极坐标中 dx dy = r dr dθ，那个r就是雅可比行列式。',
        whyNeedIt: '雅可比行列式是多重积分变量替换的核心，在概率论（随机变量变换）、物理学中有重要应用。',
        formula: 'dV_x = \\left| \\frac{\\partial(x_1, \\ldots, x_n)}{\\partial(u_1, \\ldots, u_n)} \\right| dV_u',
        example: '极坐标变换 x = r cos θ, y = r sin θ，雅可比行列式 = r，所以 dx dy = r dr dθ。'
      },
      {
        id: 'determinant-application-linear-system',
        name: '行列式应用：线性方程组',
        category: '应用',
        definition: '线性方程组 Ax = b 有唯一解当且仅当 det(A) ≠ 0。齐次方程组 Ax = 0 有非零解当且仅当 det(A) = 0。',
        plainTranslation: '行列式判断线性方程组有没有唯一解。系数矩阵行列式非零，有唯一解；行列式为零，要么无解要么无穷多解。齐次方程组（右边全零）有非零解的条件是行列式为零。',
        whyNeedIt: '行列式给出了判断线性方程组解的存在性和唯一性的简单方法。',
        formula: 'Ax = b \\text{ 有唯一解} \\Leftrightarrow |A| \\neq 0',
        example: '方程组 {x + y = 1; 2x + 2y = 3} 的系数矩阵行列式 = 0，无解（矛盾方程）。'
      },
      {
        id: 'special-determinant-patterns',
        name: '特殊行列式模式',
        category: '计算技巧',
        definition: '常见特殊行列式：(1) 对角行列式 = 对角线乘积；(2) 数量矩阵 kI 的行列式 = kⁿ；(3) 正交矩阵的行列式 = ±1；(4) 反对称奇数阶行列式 = 0。',
        plainTranslation: '特殊行列式有"速算技巧"。对角矩阵直接乘对角线；数量矩阵kI的行列式是k的n次方；正交矩阵保持体积不变，行列式是±1；奇数阶反对称矩阵行列式必为0。',
        whyNeedIt: '掌握特殊行列式的性质可以快速判断和计算，简化问题。',
        formula: '|kI_n| = k^n, \\quad |Q| = \\pm 1 \\text{（正交矩阵）}',
        example: '正交矩阵 [cos θ -sin θ; sin θ cos θ] 的行列式 = cos²θ + sin²θ = 1，表示旋转不改变面积。'
      },
      {
        id: 'determinant-recurrence',
        name: '行列式递推法',
        category: '计算技巧',
        definition: '对于具有规律结构的n阶行列式 D_n，可以通过展开找到 D_n 与 D_{n-1}, D_{n-2} 等的递推关系，然后求解递推关系得到通项公式。',
        plainTranslation: '递推法是"找规律算行列式"。把n阶行列式展开，发现它和n-1阶、n-2阶有固定关系。比如 D_n = aD_{n-1} + bD_{n-2}，解这个递推方程就能得到D_n的公式。',
        whyNeedIt: '递推法适合处理有规律结构的高阶行列式，如三对角行列式。',
        formula: 'D_n = a D_{n-1} + b D_{n-2} \\Rightarrow D_n = c_1 r_1^n + c_2 r_2^n',
        example: '三对角行列式 D_n = |a 1 0...; 1 a 1...; ...| 满足 D_n = aD_{n-1} - D_{n-2}。'
      },
      {
        id: 'determinant-factorization',
        name: '行列式因式分解法',
        category: '计算技巧',
        definition: '对于元素是多项式的行列式，可以利用行列式的性质，通过观察因式来分解。若某变量取特定值时行列式为零，则该因子是行列式的因式。',
        plainTranslation: '因式分解法是"猜因子算行列式"。如果让某个变量等于某值时行列式变成零，说明这个值对应的因子是行列式的因式。比如x=a时行列式为零，那(x-a)就是因子。凑够所有因子，再定系数。',
        whyNeedIt: '因式分解法适合处理元素是多项式的行列式，可以避免复杂的展开计算。',
        formula: '\\text{若} D(x_0) = 0, \\text{则} (x - x_0) \\text{是} D \\text{的因式}',
        example: '行列式 |x a a; a x a; a a x|，当x=a时为零，所以(x-a)是因子。实际值 = (x-a)²(x+2a)。'
      },
      {
        id: 'determinant-multiplication',
        name: '行列式的乘法法则',
        category: '行列式性质',
        definition: '对任意n阶方阵A、B，有 |AB| = |A|·|B|。推广：|A^k| = |A|^k，|A^{-1}| = 1/|A|（A可逆时），|kA| = k^n|A|。',
        plainTranslation: '矩阵乘法的行列式等于各自行列式相乘，就像"整体的效应等于各部分效应的乘积"。注意|kA| = k^n|A|，不是k|A|！因为kA意味着每行都乘k，共n行，每行提出一个k，所以提了n个k出来。',
        whyNeedIt: '乘法法则是行列式理论中最常用的性质之一，在证明题和计算题中频繁出现。特别是|A^k|=|A|^k和|A^{-1}|=1/|A|更是基本结论。',
        formula: '|AB| = |A| \\cdot |B|, \\quad |A^k| = |A|^k, \\quad |A^{-1}| = \\frac{1}{|A|}'
      },
      {
        id: 'determinant-additivity',
        name: '行列式的加法（单行/列可加性）',
        category: '行列式性质',
        definition: '若行列式的某一行（列）各元素都是两个数之和，则该行列式可拆成两个行列式之和，其余行（列）不变。如 |a₁+b₁, a₂+b₂; c₁, c₂| = |a₁,a₂;c₁,c₂| + |b₁,b₂;c₁,c₂|。',
        plainTranslation: '单行可加性就像"逐行拆分"——只有一行可以拆，其他行保持不变。这是"局部运算"的体现：行列式对每一行是线性的。但注意不能同时拆两行！',
        whyNeedIt: '单行/列可加性是行列式线性性的体现，也是化简复杂行列式的重要技巧。结合提取公因子，可以实现行列式的灵活变形。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter-24',
    name: '第二十四章 矩阵',
    concepts: [
      {
        id: 'matrix-definition',
        name: '矩阵的定义',
        category: '基本概念',
        definition: '矩阵是由 m×n 个数按一定顺序排成的 m 行 n 列的矩形数表，记作 A = (a_{ij})_{m×n} 或 A_{m×n}。矩阵表示线性变换、存储数据、描述线性方程组等。',
        plainTranslation: '矩阵是"排成矩形的数表"。就像一个表格，有m行n列，每个位置放一个数。矩阵是线性代数的"主角"，用来表示线性变换、存储数据、描述方程组。矩阵不是单个数，而是一个"整体"。',
        whyNeedIt: '矩阵是线性代数的基本对象，是研究线性方程组、线性变换、向量空间的核心工具。',
        formula: 'A = \\begin{pmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{pmatrix}',
        example: '矩阵 A = [1 2 3; 4 5 6] 是一个2×3矩阵，第1行是(1,2,3)，第2行是(4,5,6)。'
      },
      {
        id: 'matrix-element',
        name: '矩阵的元素',
        category: '基本概念',
        definition: '矩阵 A = (a_{ij})_{m×n} 的第 i 行第 j 列的数 a_{ij} 称为矩阵的元素（或元）。i 称为行标，j 称为列标。',
        plainTranslation: '矩阵元素就是"表格里每个格子里的数"。a_{ij} 表示第i行第j列的那个数。行标在前，列标在后，就像坐标一样定位每个元素。',
        whyNeedIt: '矩阵元素是矩阵的基本组成单位，矩阵运算本质上是元素之间的运算。',
        formula: 'a_{ij} \\text{ 表示第 } i \\text{ 行第 } j \\text{ 列的元素}',
        example: '矩阵 A = [1 2; 3 4] 中，a_{11}=1, a_{12}=2, a_{21}=3, a_{22}=4。'
      },
      {
        id: 'square-matrix',
        name: '方阵',
        category: '特殊矩阵',
        definition: '行数和列数相等的矩阵称为方阵，即 n×n 矩阵称为 n 阶方阵。方阵有主对角线和副对角线，可以计算行列式和特征值。',
        plainTranslation: '方阵是"正方形的矩阵"，行数等于列数。只有方阵才有行列式、特征值、逆矩阵这些概念。方阵就像"完整"的矩阵，有"主对角线"从左上到右下。',
        whyNeedIt: '方阵是线性代数研究的核心对象，行列式、特征值、逆矩阵等概念只对方阵有定义。',
        formula: 'A_{n \\times n} \\text{ 是 } n \\text{ 阶方阵}',
        example: '矩阵 [1 2; 3 4] 是2阶方阵，[1 2 3; 4 5 6; 7 8 9] 是3阶方阵。'
      },
      {
        id: 'zero-matrix',
        name: '零矩阵',
        category: '特殊矩阵',
        definition: '所有元素都为零的矩阵称为零矩阵，记作 O 或 0_{m×n}。零矩阵在矩阵加法中是单位元：A + O = A。',
        plainTranslation: '零矩阵是"全零的矩阵"，每个元素都是0。零矩阵在矩阵加法中就像数字0在加法中一样：任何矩阵加零矩阵等于它自己。',
        whyNeedIt: '零矩阵是矩阵加法的单位元，在矩阵运算中起基础作用。',
        formula: 'O = \\begin{pmatrix} 0 & 0 & \\cdots & 0 \\\\ 0 & 0 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 0 \\end{pmatrix}',
        example: 'O_{2×3} = [0 0 0; 0 0 0]，A + O = A 对任意同型矩阵 A 成立。'
      },
      {
        id: 'identity-matrix',
        name: '单位矩阵',
        category: '特殊矩阵',
        definition: '主对角线元素全为1，其余元素全为0的方阵称为单位矩阵，记作 I 或 E。单位矩阵在矩阵乘法中是单位元：IA = AI = A。',
        plainTranslation: '单位矩阵是"对角线全是1，其他全是0"的方阵。它就像数字1在乘法中一样：任何矩阵乘以单位矩阵等于它自己。单位矩阵是矩阵乘法的"中立者"。',
        whyNeedIt: '单位矩阵是矩阵乘法的单位元，是定义逆矩阵的基础。',
        formula: 'I_n = \\begin{pmatrix} 1 & 0 & \\cdots & 0 \\\\ 0 & 1 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & 1 \\end{pmatrix}',
        example: 'I_3 = [1 0 0; 0 1 0; 0 0 1]，对于任意3阶方阵A，有 AI = IA = A。'
      },
      {
        id: 'diagonal-matrix',
        name: '对角矩阵',
        category: '特殊矩阵',
        definition: '除主对角线外所有元素都为零的方阵称为对角矩阵，记作 diag(d₁, d₂, ..., dₙ)。对角矩阵的运算简单：对角矩阵相乘等于对角元素对应相乘。',
        plainTranslation: '对角矩阵是"只有对角线有数，其他位置全是0"的方阵。对角矩阵运算特别简单：相乘就是对角元素相乘，求逆就是对角元素取倒数（如果非零）。',
        whyNeedIt: '对角矩阵运算简单，在矩阵分解和简化计算中有重要应用。',
        formula: '\\text{diag}(d_1, d_2, \\ldots, d_n) = \\begin{pmatrix} d_1 & 0 & \\cdots & 0 \\\\ 0 & d_2 & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & d_n \\end{pmatrix}',
        example: 'diag(2, 3, 4) = [2 0 0; 0 3 0; 0 0 4]，其逆矩阵 = diag(1/2, 1/3, 1/4)。'
      },
      {
        id: 'scalar-matrix',
        name: '数量矩阵',
        category: '特殊矩阵',
        definition: '主对角线元素都相等且非零，其余元素为零的方阵称为数量矩阵，即 kI。数量矩阵与任何同阶方阵相乘可交换：kI · A = A · kI = kA。',
        plainTranslation: '数量矩阵是"对角线全是同一个数k"的方阵，等于k乘以单位矩阵。数量矩阵和任何矩阵相乘都等于把那个矩阵"放大k倍"，而且可以交换顺序。',
        whyNeedIt: '数量矩阵是矩阵与标量的桥梁，具有特殊的可交换性质。',
        formula: 'kI = \\begin{pmatrix} k & 0 & \\cdots & 0 \\\\ 0 & k & \\cdots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\cdots & k \\end{pmatrix}',
        example: '3I = [3 0 0; 0 3 0; 0 0 3]，对于任意3阶方阵A，有 3I·A = A·3I = 3A。'
      },
      {
        id: 'triangular-matrix',
        name: '三角矩阵',
        category: '特殊矩阵',
        definition: '上三角矩阵：主对角线以下的元素全为零；下三角矩阵：主对角线以上的元素全为零。三角矩阵的行列式等于对角线元素乘积。',
        plainTranslation: '三角矩阵是"一半是零"的方阵。上三角是左下角全零，下三角是右上角全零。三角矩阵特别好算：行列式直接乘对角线，求逆也很简单。',
        whyNeedIt: '三角矩阵在解线性方程组（回代法）、矩阵分解（LU分解）中有重要应用。',
        formula: '\\text{上三角: } \\begin{pmatrix} a_{11} & a_{12} & a_{13} \\\\ 0 & a_{22} & a_{23} \\\\ 0 & 0 & a_{33} \\end{pmatrix}, \\quad \\text{下三角: } \\begin{pmatrix} a_{11} & 0 & 0 \\\\ a_{21} & a_{22} & 0 \\\\ a_{31} & a_{32} & a_{33} \\end{pmatrix}',
        example: '上三角矩阵 [2 1 3; 0 4 5; 0 0 6] 的行列式 = 2×4×6 = 48。'
      },
      {
        id: 'symmetric-matrix',
        name: '对称矩阵',
        category: '特殊矩阵',
        definition: '满足 A^T = A 的方阵称为对称矩阵，即 a_{ij} = a_{ji}。对称矩阵的特征值都是实数，可以正交对角化。',
        plainTranslation: '对称矩阵是"关于主对角线对称"的方阵，沿对角线折叠，两边元素相同。对称矩阵有很多好性质：特征值都是实数，可以找到正交的特征向量。',
        whyNeedIt: '对称矩阵在二次型、优化问题、物理应用中有重要地位，总能正交对角化。',
        formula: 'A^T = A \\Leftrightarrow a_{ij} = a_{ji}',
        example: '矩阵 [1 2 3; 2 4 5; 3 5 6] 是对称矩阵，因为关于主对角线对称。'
      },
      {
        id: 'skew-symmetric-matrix',
        name: '反对称矩阵',
        category: '特殊矩阵',
        definition: '满足 A^T = -A 的方阵称为反对称矩阵，即 a_{ij} = -a_{ji}，主对角线元素全为零。奇数阶反对称矩阵的行列式为零。',
        plainTranslation: '反对称矩阵是"关于主对角线反对称"的方阵，沿对角线折叠，两边元素相反。主对角线必须全是0。奇数阶反对称矩阵的行列式一定是0。',
        whyNeedIt: '反对称矩阵在李代数、物理中的角速度表示等有应用。',
        formula: 'A^T = -A \\Leftrightarrow a_{ij} = -a_{ji}, \\quad a_{ii} = 0',
        example: '矩阵 [0 1 -2; -1 0 3; 2 -3 0] 是反对称矩阵。'
      },
      {
        id: 'orthogonal-matrix',
        name: '正交矩阵',
        category: '特殊矩阵',
        definition: '满足 A^T A = I 的方阵称为正交矩阵。正交矩阵的列向量（行向量）是标准正交的。正交矩阵保持向量长度和角度不变，行列式为 ±1。',
        plainTranslation: '正交矩阵是"列向量互相垂直且长度都是1"的方阵。正交矩阵代表旋转或反射变换，不改变向量的长度。正交矩阵的逆等于转置，非常好算。',
        whyNeedIt: '正交矩阵代表刚体运动（旋转、反射），在坐标变换、QR分解中有重要应用。',
        formula: 'A^T A = I \\Leftrightarrow A^{-1} = A^T, \\quad |A| = \\pm 1',
        example: '旋转矩阵 [cos θ -sin θ; sin θ cos θ] 是正交矩阵，表示逆时针旋转θ角。'
      },
      {
        id: 'positive-definite-matrix',
        name: '正定矩阵',
        category: '特殊矩阵',
        definition: '对称矩阵 A 称为正定的，如果对任意非零向量 x，有 x^T A x > 0。等价条件：所有特征值为正；所有顺序主子式为正；存在可逆矩阵 P 使 A = P^T P。',
        plainTranslation: '正定矩阵是"二次型恒正"的对称矩阵。对于正定矩阵，x^T A x 总是正数（x非零时）。正定矩阵就像"正数"在矩阵世界的推广，有唯一正平方根。',
        whyNeedIt: '正定矩阵在优化（海森矩阵正定保证极小值）、协方差矩阵、数值计算中有核心地位。',
        formula: 'A \\text{ 正定} \\Leftrightarrow \\forall x \\neq 0, x^T A x > 0 \\Leftrightarrow \\lambda_i > 0',
        example: '矩阵 [2 1; 1 2] 是正定的：x^T A x = 2x₁² + 2x₁x₂ + 2x₂² = (x₁+x₂)² + x₁² + x₂² > 0。'
      },
      {
        id: 'positive-semidefinite-matrix',
        name: '半正定矩阵',
        category: '特殊矩阵',
        definition: '对称矩阵 A 称为半正定的，如果对任意向量 x，有 x^T A x ≥ 0。等价条件：所有特征值非负。',
        plainTranslation: '半正定矩阵是"二次型非负"的对称矩阵。x^T A x 可以等于零（对某些非零x）。半正定矩阵就像"非负数"在矩阵世界的推广。',
        whyNeedIt: '半正定矩阵在协方差矩阵、核方法、优化中有重要应用。',
        formula: 'A \\text{ 半正定} \\Leftrightarrow \\forall x, x^T A x \\geq 0 \\Leftrightarrow \\lambda_i \\geq 0',
        example: '矩阵 [1 1; 1 1] 是半正定的：x^T A x = (x₁+x₂)² ≥ 0，当 x₁=-x₂ 时等于0。'
      },
      {
        id: 'singular-matrix',
        name: '奇异矩阵',
        category: '特殊矩阵',
        definition: '行列式为零的方阵称为奇异矩阵。奇异矩阵不可逆，其列向量线性相关，秩小于阶数。',
        plainTranslation: '奇异矩阵是"行列式为零"的方阵，不可逆。奇异矩阵的列向量"挤在一起"，有线性相关。奇异矩阵代表"把空间压扁"的线性变换。',
        whyNeedIt: '奇异矩阵是线性方程组有无穷多解或无解的关键，在数值计算中需要避免。',
        formula: 'A \\text{ 奇异} \\Leftrightarrow |A| = 0 \\Leftrightarrow A^{-1} \\text{ 不存在}',
        example: '矩阵 [1 2; 2 4] 是奇异的，因为第二行是第一行的2倍，行列式 = 0。'
      },
      {
        id: 'matrix-addition',
        name: '矩阵加法',
        category: '矩阵运算',
        definition: '两个同型矩阵 A = (a_{ij}) 和 B = (b_{ij}) 的加法定义为 A + B = (a_{ij} + b_{ij})，即对应元素相加。矩阵加法满足交换律和结合律。',
        plainTranslation: '矩阵加法是"对应位置元素相加"。两个矩阵必须形状相同才能相加。加法满足交换律（A+B=B+A）和结合律（(A+B)+C=A+(B+C)）。',
        whyNeedIt: '矩阵加法是矩阵运算的基础，在向量空间、线性组合中有重要应用。',
        formula: '(A + B)_{ij} = a_{ij} + b_{ij}',
        example: '[1 2; 3 4] + [5 6; 7 8] = [6 8; 10 12]。'
      },
      {
        id: 'matrix-scalar-multiplication',
        name: '矩阵数乘',
        category: '矩阵运算',
        definition: '标量 k 与矩阵 A = (a_{ij}) 的数乘定义为 kA = (k a_{ij})，即每个元素都乘以 k。数乘满足分配律和结合律。',
        plainTranslation: '矩阵数乘是"每个元素都乘以同一个数"。数乘改变矩阵的"大小"但不改变"方向"。数乘满足分配律：k(A+B)=kA+kB。',
        whyNeedIt: '数乘是向量空间的基本运算，在线性组合、缩放变换中有重要应用。',
        formula: '(kA)_{ij} = k \\cdot a_{ij}',
        example: '3 × [1 2; 3 4] = [3 6; 9 12]。'
      },
      {
        id: 'matrix-multiplication',
        name: '矩阵乘法',
        category: '矩阵运算',
        definition: '矩阵 A_{m×p} 和 B_{p×n} 的乘积 C = AB 是 m×n 矩阵，其中 c_{ij} = Σ_{k=1}^p a_{ik} b_{kj}。矩阵乘法满足结合律但不满足交换律。',
        plainTranslation: '矩阵乘法是"行乘列"的运算：C的第i行第j列元素 = A的第i行与B的第j列对应相乘再相加。矩阵乘法不满足交换律（AB≠BA），这是矩阵运算的关键特点。',
        whyNeedIt: '矩阵乘法是线性变换的复合运算，是线性代数的核心运算。',
        formula: '(AB)_{ij} = \\sum_{k=1}^{p} a_{ik} b_{kj}',
        example: '[1 2; 3 4] × [5 6; 7 8] = [1×5+2×7 1×6+2×8; 3×5+4×7 3×6+4×8] = [19 22; 43 50]。'
      },
      {
        id: 'matrix-multiplication-properties',
        name: '矩阵乘法的性质',
        category: '矩阵运算',
        definition: '矩阵乘法满足：(1) 结合律 (AB)C = A(BC)；(2) 分配律 A(B+C) = AB+AC；(3) 数乘结合律 k(AB) = (kA)B = A(kB)；(4) 一般不满足交换律 AB ≠ BA；(5) AB = 0 不一定有 A=0 或 B=0。',
        plainTranslation: '矩阵乘法"有结合律但没有交换律"。可以随意加括号，但不能换顺序。AB=0不意味着A或B是零矩阵，这是矩阵和数字的重要区别。',
        whyNeedIt: '理解矩阵乘法的性质是正确进行矩阵运算的基础。',
        formula: '(AB)C = A(BC), \\quad A(B+C) = AB + AC, \\quad AB \\neq BA \\text{（一般情况）}',
        example: '[1 0; 0 0] × [0 0; 0 1] = [0 0; 0 0]，但两个矩阵都不是零矩阵。'
      },
      {
        id: 'matrix-transpose',
        name: '矩阵转置',
        category: '矩阵运算',
        definition: '矩阵 A = (a_{ij})_{m×n} 的转置 A^T = (a_{ji})_{n×m} 是行列互换得到的矩阵。转置的性质：(A^T)^T = A，(A+B)^T = A^T + B^T，(AB)^T = B^T A^T。',
        plainTranslation: '矩阵转置是"行列互换"：把行变成列，列变成行。转置有一个重要性质：乘积的转置等于转置的反序相乘，即 (AB)^T = B^T A^T。',
        whyNeedIt: '转置在定义对称矩阵、内积、最小二乘法中有重要应用。',
        formula: '(A^T)_{ij} = a_{ji}, \\quad (AB)^T = B^T A^T',
        example: '[1 2 3; 4 5 6]^T = [1 4; 2 5; 3 6]，2×3矩阵转置后变成3×2矩阵。'
      },
      {
        id: 'conjugate-transpose',
        name: '共轭转置',
        category: '矩阵运算',
        definition: '复矩阵 A 的共轭转置 A^* = A̅^T，即先取共轭再转置。对于实矩阵，共轭转置等于转置。满足 (AB)^* = B^* A^*。',
        plainTranslation: '共轭转置是"先取共轭再转置"。对于实数矩阵，共轭转置就是普通转置。共轭转置在复矩阵中相当于转置在实矩阵中的地位。',
        whyNeedIt: '共轭转置是定义埃尔米特矩阵、酉矩阵的基础，在量子力学中有重要应用。',
        formula: 'A^* = \\overline{A}^T, \\quad (AB)^* = B^* A^*',
        example: '复矩阵 [1+i 2-i; 3 4i] 的共轭转置 = [1-i 3; 2+i -4i]。'
      },
      {
        id: 'matrix-inverse',
        name: '逆矩阵',
        category: '矩阵运算',
        definition: '对于方阵 A，若存在方阵 B 使得 AB = BA = I，则称 A 可逆，B 是 A 的逆矩阵，记作 A^{-1}。方阵可逆当且仅当行列式非零。',
        plainTranslation: '逆矩阵是"矩阵的倒数"。A乘以A的逆等于单位矩阵，就像数乘以倒数等于1。只有行列式非零的方阵才有逆矩阵。逆矩阵是解矩阵方程的关键。',
        whyNeedIt: '逆矩阵是解线性方程组、矩阵方程的核心工具，在数值计算中有重要应用。',
        formula: 'A A^{-1} = A^{-1} A = I, \\quad A^{-1} = \\frac{1}{|A|} \\text{adj}(A)',
        example: '[1 2; 3 4] 的逆矩阵 = (1/-2)[4 -2; -3 1] = [-2 1; 1.5 -0.5]。'
      },
      {
        id: 'inverse-properties',
        name: '逆矩阵的性质',
        category: '矩阵运算',
        definition: '逆矩阵的性质：(1) (A^{-1})^{-1} = A；(2) (A^T)^{-1} = (A^{-1})^T；(3) (AB)^{-1} = B^{-1} A^{-1}；(4) (kA)^{-1} = k^{-1} A^{-1} (k≠0)；(5) |A^{-1}| = 1/|A|。',
        plainTranslation: '逆矩阵的性质可以总结为"逆的逆是自己"、"转置的逆等于逆的转置"、"乘积的逆等于逆的反序相乘"。这些性质在矩阵运算中非常有用。',
        whyNeedIt: '掌握逆矩阵的性质是正确进行矩阵运算和化简的基础。',
        formula: '(AB)^{-1} = B^{-1} A^{-1}, \\quad (A^T)^{-1} = (A^{-1})^T',
        example: '若 A^{-1} = [2 1; 1 1]，则 A = (A^{-1})^{-1} = [1 -1; -1 2]。'
      },
      {
        id: 'matrix-rank',
        name: '矩阵的秩',
        category: '重要概念',
        definition: '矩阵 A 的秩 rank(A) 是其行向量组的最大线性无关向量个数（行秩），等于列向量组的最大线性无关向量个数（列秩）。秩也等于非零子式的最高阶数。',
        plainTranslation: '矩阵的秩是"真正独立的行（或列）的数目"。秩告诉我们矩阵"有多少干货"。秩为r意味着矩阵只有r行是独立的，其他行都可以用这r行表示出来。',
        whyNeedIt: '秩是判断线性方程组解的情况、矩阵等价性的核心概念。',
        formula: '\\text{rank}(A) = \\text{行秩} = \\text{列秩} = \\max\\{r : \\text{存在} r \\text{阶非零子式}\\}',
        example: '矩阵 [1 2 3; 2 4 6; 1 1 1] 的秩 = 2，因为第2行是第1行的2倍，只有2个独立行。'
      },
      {
        id: 'rank-properties',
        name: '秩的性质',
        category: '重要概念',
        definition: '秩的重要性质：(1) rank(A) ≤ min(m, n)；(2) rank(A) = rank(A^T)；(3) rank(AB) ≤ min(rank(A), rank(B))；(4) rank(A+B) ≤ rank(A) + rank(B)；(5) rank(A) + rank(B) - n ≤ rank(AB)。',
        plainTranslation: '秩的性质包括：秩不超过行数和列数的较小值；转置不改变秩；乘积的秩不超过各因子秩的最小值。这些性质在证明和计算中很有用。',
        whyNeedIt: '秩的性质是线性代数理论的重要组成部分，在矩阵分析中有广泛应用。',
        formula: '\\text{rank}(AB) \\leq \\min(\\text{rank}(A), \\text{rank}(B))',
        example: '若 A 是 3×4 矩阵，则 rank(A) ≤ 3。若 rank(A) = 2，rank(B) = 3，则 rank(AB) ≤ 2。'
      },
      {
        id: 'full-rank-matrix',
        name: '满秩矩阵',
        category: '重要概念',
        definition: '若矩阵 A 的秩等于其行数（行满秩）或列数（列满秩），则称 A 为满秩矩阵。对于方阵，满秩意味着可逆。',
        plainTranslation: '满秩矩阵是"秩达到最大值"的矩阵。行满秩是秩等于行数，列满秩是秩等于列数。方阵满秩就是可逆，行列式非零。',
        whyNeedIt: '满秩矩阵在解方程组、最小二乘法中有重要意义，保证解的唯一性。',
        formula: 'A_{m \\times n} \\text{ 行满秩} \\Leftrightarrow \\text{rank}(A) = m, \\quad \\text{列满秩} \\Leftrightarrow \\text{rank}(A) = n',
        example: '矩阵 [1 0 0; 0 1 0] 是行满秩的（秩=2=行数），但不是列满秩的（秩<3=列数）。'
      },
      {
        id: 'elementary-row-operations',
        name: '初等行变换',
        category: '初等变换',
        definition: '初等行变换包括三种：(1) 交换两行；(2) 用非零数乘某一行；(3) 某一行加上另一行的k倍。初等行变换不改变矩阵的行空间和秩。',
        plainTranslation: '初等行变换是"对矩阵的行做三种基本操作"：交换两行、一行乘以非零数、一行加上另一行的倍数。这些变换是高斯消元法的基础。',
        whyNeedIt: '初等行变换是化简矩阵、求解线性方程组、计算秩的基本工具。',
        formula: 'r_i \\leftrightarrow r_j, \\quad r_i \\times k, \\quad r_i + k r_j',
        example: '对矩阵 [1 2 3; 4 5 6] 做 r₂ - 4r₁ 得到 [1 2 3; 0 -3 -6]。'
      },
      {
        id: 'elementary-column-operations',
        name: '初等列变换',
        category: '初等变换',
        definition: '初等列变换与行变换类似，包括三种：(1) 交换两列；(2) 用非零数乘某一列；(3) 某一列加上另一列的k倍。',
        plainTranslation: '初等列变换是"对矩阵的列做三种基本操作"，与行变换完全类似。列变换不改变列空间。',
        whyNeedIt: '初等列变换在求等价标准形、简化矩阵表示中有应用。',
        formula: 'c_i \\leftrightarrow c_j, \\quad c_i \\times k, \\quad c_i + k c_j',
        example: '对矩阵 [1 2; 3 4] 做 c₂ - 2c₁ 得到 [1 0; 3 -2]。'
      },
      {
        id: 'elementary-matrix',
        name: '初等矩阵',
        category: '初等变换',
        definition: '对单位矩阵做一次初等变换得到的矩阵称为初等矩阵。初等矩阵都是可逆的，其逆矩阵也是初等矩阵。左乘初等矩阵相当于做相应的行变换。',
        plainTranslation: '初等矩阵是"对单位矩阵做一次初等变换"得到的矩阵。初等矩阵可以"记录"初等变换：左乘初等矩阵等于做相应的行变换，右乘等于做列变换。',
        whyNeedIt: '初等矩阵将初等变换与矩阵乘法联系起来，是证明矩阵可逆性等价条件的关键。',
        formula: 'E \\cdot A \\text{ 相当于对 } A \\text{ 做行变换}',
        example: 'E = [0 1; 1 0] 是交换单位矩阵两行得到的初等矩阵，EA 会交换 A 的两行。'
      },
      {
        id: 'row-echelon-form',
        name: '行阶梯形',
        category: '矩阵标准形',
        definition: '矩阵称为行阶梯形，如果：(1) 全零行在下方；(2) 每个非零行的首非零元（主元）位于上一行主元的右边；(3) 主元下方元素全为零。',
        plainTranslation: '行阶梯形是"像阶梯一样排列"的矩阵形式。每行的第一个非零元素（主元）比上一行更靠右，主元下面全是零。高斯消元法的目标就是把矩阵化成行阶梯形。',
        whyNeedIt: '行阶梯形是解线性方程组、求秩的基础形式，便于判断解的情况。',
        formula: '\\begin{pmatrix} \\boxed{a} & * & * & * \\\\ 0 & \\boxed{b} & * & * \\\\ 0 & 0 & 0 & \\boxed{c} \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}',
        example: '[1 2 3; 0 4 5; 0 0 0] 是行阶梯形，主元在(1,1)和(2,2)位置。'
      },
      {
        id: 'reduced-row-echelon-form',
        name: '行最简形',
        category: '矩阵标准形',
        definition: '行最简形是特殊的行阶梯形：(1) 主元都是1；(2) 主元所在列的其他元素都是0。每个矩阵的行最简形唯一。',
        plainTranslation: '行最简形是"最干净的阶梯形"：主元都是1，主元所在列其他位置全是0。行最简形是唯一的，可以直接读出方程组的解。',
        whyNeedIt: '行最简形可以唯一确定，便于直接读出线性方程组的解。',
        formula: '\\begin{pmatrix} 1 & 0 & * & 0 \\\\ 0 & 1 & * & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}',
        example: '[1 0 2; 0 1 3; 0 0 0] 是行最简形，可以直接读出解 x₁=2, x₂=3。'
      },
      {
        id: 'matrix-equivalence',
        name: '矩阵等价',
        category: '矩阵关系',
        definition: '若矩阵 A 可经初等变换化为 B，则称 A 与 B 等价。等价的充要条件是它们有相同的秩。等价标准形为 [I_r 0; 0 0]。',
        plainTranslation: '矩阵等价是"可以通过初等变换互相转化"的关系。等价的矩阵有相同的秩。任何矩阵都可以化成等价标准形：左上角是单位矩阵，其余是零。',
        whyNeedIt: '矩阵等价是矩阵分类的基础，等价标准形简化了矩阵的分析。',
        formula: 'A \\sim B \\Leftrightarrow \\text{rank}(A) = \\text{rank}(B)',
        example: '矩阵 [1 2; 2 4] 的等价标准形是 [1 0; 0 0]，秩为1。'
      },
      {
        id: 'augmented-matrix',
        name: '增广矩阵',
        category: '线性方程组',
        definition: '对于线性方程组 Ax = b，增广矩阵 [A|b] 是将系数矩阵 A 和常数向量 b 拼接成的矩阵。增广矩阵用于高斯消元法求解方程组。',
        plainTranslation: '增广矩阵是"把系数和常数拼在一起"的矩阵。左边是系数矩阵，右边是常数项。用增广矩阵做行变换，可以同时处理系数和常数，方便求解。',
        whyNeedIt: '增广矩阵是高斯消元法求解线性方程组的工具，便于判断解的存在性。',
        formula: '[A|b] = \\begin{pmatrix} a_{11} & \\cdots & a_{1n} & | & b_1 \\\\ \\vdots & \\ddots & \\vdots & | & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} & | & b_m \\end{pmatrix}',
        example: '方程组 {x + y = 3; 2x - y = 0} 的增广矩阵是 [1 1 | 3; 2 -1 | 0]。'
      },
      {
        id: 'coefficient-matrix',
        name: '系数矩阵',
        category: '线性方程组',
        definition: '线性方程组 Ax = b 中，矩阵 A 称为系数矩阵。系数矩阵的列数等于未知数个数，行数等于方程个数。',
        plainTranslation: '系数矩阵是"只包含未知数系数"的矩阵，不包括常数项。系数矩阵决定了解的结构：是否唯一、是否存在。',
        whyNeedIt: '系数矩阵是线性方程组的核心，其秩决定了解的性质。',
        formula: 'A = \\begin{pmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{pmatrix}',
        example: '方程组 {2x + 3y = 5; x - y = 1} 的系数矩阵是 [2 3; 1 -1]。'
      },
      {
        id: 'rank-and-solutions',
        name: '秩与解的关系',
        category: '线性方程组',
        definition: '对于线性方程组 Ax = b，设 rank(A) = r，rank([A|b]) = r\'。若 r < r\'，无解；若 r = r\' = n，唯一解；若 r = r\' < n，无穷多解（自由变量个数为 n-r）。',
        plainTranslation: '秩判断解的情况：系数矩阵秩 < 增广矩阵秩，无解；两者相等且等于未知数个数，唯一解；两者相等但小于未知数个数，无穷多解。',
        whyNeedIt: '秩与解的关系是判断线性方程组解的存在性和唯一性的核心定理。',
        formula: '\\text{rank}(A) \\neq \\text{rank}([A|b]) \\Rightarrow \\text{无解}',
        example: '方程组 {x + y = 1; 2x + 2y = 3}：rank(A) = 1，rank([A|b]) = 2，无解。'
      },
      {
        id: 'eigenvalue',
        name: '特征值',
        category: '特征理论',
        definition: '对于方阵 A，若存在非零向量 x 和标量 λ 使得 Ax = λx，则 λ 称为 A 的特征值，x 称为对应的特征向量。特征值是特征方程 |A - λI| = 0 的根。',
        plainTranslation: '特征值是"矩阵作用后方向不变只伸缩的倍数"。如果向量 x 被 A 作用后只是伸缩了 λ 倍（方向不变或反向），那 λ 就是特征值。特征值揭示矩阵的"内在性质"。',
        whyNeedIt: '特征值是矩阵的核心特征，在稳定性分析、振动问题、主成分分析中有重要应用。',
        formula: '|A - \\lambda I| = 0 \\text{（特征方程）}',
        example: '矩阵 [2 0; 0 3] 的特征值是 2 和 3，对应的特征向量是 (1,0) 和 (0,1)。'
      },
      {
        id: 'eigenvector',
        name: '特征向量',
        category: '特征理论',
        definition: '对于方阵 A 的特征值 λ，满足 Ax = λx 的非零向量 x 称为特征向量。特征向量构成的特征空间是 A - λI 的核空间。',
        plainTranslation: '特征向量是"被矩阵作用后只伸缩不旋转的向量"。特征向量经过矩阵变换后，方向保持不变（或反向），只是长度改变了。一个特征值可以有多个特征向量。',
        whyNeedIt: '特征向量给出了矩阵作用下的"不变方向"，在矩阵对角化中有核心地位。',
        formula: '(A - \\lambda I)x = 0 \\text{ 的非零解}',
        example: '矩阵 [4 1; 2 3] 的特征值 λ=5 对应的特征向量满足 [4-5 1; 2 3-5]x = 0，即 [-1 1; 2 -2]x = 0，特征向量是 (1,1)。'
      },
      {
        id: 'characteristic-polynomial',
        name: '特征多项式',
        category: '特征理论',
        definition: '方阵 A 的特征多项式定义为 p(λ) = |A - λI|。特征多项式是关于 λ 的 n 次多项式，其根就是特征值。',
        plainTranslation: '特征多项式是"用来求特征值的多项式"。把 |A - λI| 展开就得到特征多项式。令它等于零，解出来的 λ 就是特征值。',
        whyNeedIt: '特征多项式是计算特征值的基本工具，其系数与矩阵的迹和行列式有关。',
        formula: 'p(\\lambda) = |A - \\lambda I| = (-1)^n \\lambda^n + \\cdots + (-1)^n |A|',
        example: '矩阵 [a b; c d] 的特征多项式 = λ² - (a+d)λ + (ad-bc) = λ² - tr(A)λ + |A|。'
      },
      {
        id: 'eigenspace',
        name: '特征空间',
        category: '特征理论',
        definition: '对于特征值 λ，特征空间 E_λ = {x : Ax = λx} = Ker(A - λI)，即所有对应特征向量加上零向量构成的子空间。特征空间的维数称为几何重数。',
        plainTranslation: '特征空间是"同一特征值的所有特征向量加上零向量"组成的子空间。特征空间是一个向量空间，它的维数告诉我们这个特征值有多少"独立"的特征向量。',
        whyNeedIt: '特征空间是矩阵对角化的关键，几何重数决定了能否对角化。',
        formula: 'E_\\lambda = \\text{Ker}(A - \\lambda I)',
        example: '矩阵 [2 0 0; 0 2 0; 0 0 3] 的特征值2的特征空间是 {(x, y, 0)}，维数为2。'
      },
      {
        id: 'algebraic-multiplicity',
        name: '代数重数',
        category: '特征理论',
        definition: '特征值 λ 在特征多项式中作为根的重数称为代数重数。代数重数之和等于矩阵的阶数 n。',
        plainTranslation: '代数重数是"特征值在特征方程中出现的次数"。比如特征方程 (λ-2)²(λ-3)=0，特征值2的代数重数是2，特征值3的代数重数是1。',
        whyNeedIt: '代数重数与几何重数的关系决定了矩阵能否对角化。',
        formula: '\\sum_{i=1}^{k} m_i = n \\text{（所有代数重数之和）}',
        example: '矩阵 [2 1; 0 2] 的特征值2的代数重数是2（二重根）。'
      },
      {
        id: 'geometric-multiplicity',
        name: '几何重数',
        category: '特征理论',
        definition: '特征值 λ 的特征空间的维数称为几何重数。几何重数 ≤ 代数重数。矩阵可对角化当且仅当每个特征值的几何重数等于代数重数。',
        plainTranslation: '几何重数是"特征值对应的独立特征向量个数"。几何重数永远不超过代数重数。只有两者相等时，矩阵才能对角化。',
        whyNeedIt: '几何重数是判断矩阵能否对角化的关键指标。',
        formula: '1 \\leq \\text{几何重数} \\leq \\text{代数重数}',
        example: '矩阵 [2 1; 0 2] 的特征值2：代数重数=2，几何重数=1（只有一个独立特征向量），不能对角化。'
      },
      {
        id: 'matrix-diagonalization',
        name: '矩阵对角化',
        category: '特征理论',
        definition: '若存在可逆矩阵 P 使得 P^{-1}AP = Λ（对角矩阵），则称 A 可对角化。A 可对角化当且仅当 A 有 n 个线性无关的特征向量。',
        plainTranslation: '对角化是"把矩阵变成对角矩阵"的变换。如果能找到一组完整的特征向量，就能把矩阵对角化。对角化后的矩阵运算非常简单。',
        whyNeedIt: '对角化简化了矩阵运算，在求解矩阵幂、微分方程中有重要应用。',
        formula: 'P^{-1} A P = \\Lambda = \\text{diag}(\\lambda_1, \\lambda_2, \\ldots, \\lambda_n)',
        example: '矩阵 [4 1; 2 3] 可对角化：P = [1 1; 1 2]，P^{-1}AP = [5 0; 0 2]。'
      },
      {
        id: 'similar-matrix',
        name: '相似矩阵',
        category: '矩阵关系',
        definition: '若存在可逆矩阵 P 使得 B = P^{-1}AP，则称 A 与 B 相似。相似矩阵有相同的特征多项式、特征值、迹、行列式和秩。',
        plainTranslation: '相似矩阵是"同一线性变换在不同基下的表示"。相似矩阵本质上是"同一个东西"，只是坐标系不同。它们有相同的特征值、迹、行列式。',
        whyNeedIt: '相似关系是矩阵分类的重要工具，相似标准形简化了矩阵分析。',
        formula: 'B = P^{-1} A P \\Rightarrow \\text{特征值、迹、行列式相同}',
        example: '[4 1; 2 3] 与 [5 0; 0 2] 相似，它们有相同的特征值5和2。'
      },
      {
        id: 'jordan-form',
        name: 'Jordan标准形',
        category: '矩阵标准形',
        definition: '任何复方阵都相似于一个Jordan标准形，由Jordan块组成。Jordan块 J_k(λ) 是对角线为λ、上方次对角线为1的矩阵。Jordan标准形是矩阵相似的标准形。',
        plainTranslation: 'Jordan标准形是"矩阵的终极简化形式"。即使不能对角化，也能化成Jordan形。Jordan形是"几乎对角"的矩阵，对角线上是特征值，有些位置上方有1。',
        whyNeedIt: 'Jordan标准形是矩阵相似的标准形，在理论分析和微分方程求解中有重要应用。',
        formula: 'J = \\begin{pmatrix} J_{k_1}(\\lambda_1) & & \\\\ & \\ddots & \\\\ & & J_{k_m}(\\lambda_m) \\end{pmatrix}, \\quad J_k(\\lambda) = \\begin{pmatrix} \\lambda & 1 & & \\\\ & \\lambda & \\ddots & \\\\ & & \\ddots & 1 \\\\ & & & \\lambda \\end{pmatrix}',
        example: '矩阵 [2 1 0; 0 2 1; 0 0 2] 已经是Jordan标准形，是一个3阶Jordan块。'
      },
      {
        id: 'lu-decomposition',
        name: 'LU分解',
        category: '矩阵分解',
        definition: 'LU分解将矩阵 A 分解为下三角矩阵 L 和上三角矩阵 U 的乘积：A = LU。当 A 可逆且所有顺序主子式非零时，LU分解存在且唯一。',
        plainTranslation: 'LU分解是"把矩阵拆成下三角乘上三角"。就像把复杂问题分解成两步：先解下三角方程组（前代），再解上三角方程组（回代）。这是解方程组的高效方法。',
        whyNeedIt: 'LU分解是求解线性方程组的高效方法，在数值计算中广泛应用。',
        formula: 'A = LU = \\begin{pmatrix} l_{11} & 0 & 0 \\\\ l_{21} & l_{22} & 0 \\\\ l_{31} & l_{32} & l_{33} \\end{pmatrix} \\begin{pmatrix} u_{11} & u_{12} & u_{13} \\\\ 0 & u_{22} & u_{23} \\\\ 0 & 0 & u_{33} \\end{pmatrix}',
        example: '[2 1 1; 4 3 3; 8 7 9] = [1 0 0; 2 1 0; 4 3 1] × [2 1 1; 0 1 1; 0 0 2]。'
      },
      {
        id: 'qr-decomposition',
        name: 'QR分解',
        category: '矩阵分解',
        definition: 'QR分解将矩阵 A 分解为正交矩阵 Q 和上三角矩阵 R 的乘积：A = QR。任何实矩阵都可以进行QR分解。',
        plainTranslation: 'QR分解是"把矩阵拆成正交矩阵乘上三角矩阵"。正交矩阵代表旋转，上三角矩阵代表缩放。QR分解是最小二乘法、特征值计算的基础。',
        whyNeedIt: 'QR分解在最小二乘问题、特征值计算（QR算法）中有重要应用。',
        formula: 'A = QR, \\quad Q^T Q = I, \\quad R \\text{ 上三角}',
        example: '[1 1; 1 2] = [1/√2 1/√2; 1/√2 -1/√2] × [√2 3/√2; 0 1/√2]。'
      },
      {
        id: 'svd',
        name: '奇异值分解(SVD)',
        category: '矩阵分解',
        definition: '奇异值分解将任意矩阵 A_{m×n} 分解为 A = UΣV^T，其中 U 是 m×m 正交矩阵，Σ 是 m×n 对角矩阵（奇异值），V 是 n×n 正交矩阵。',
        plainTranslation: '奇异值分解是"矩阵的终极分解"。任何矩阵都能分解成：旋转 × 伸缩 × 旋转。奇异值就是伸缩的倍数。SVD是数据压缩、推荐系统、图像处理的核心工具。',
        whyNeedIt: 'SVD是矩阵分析最强大的工具，在数据压缩、降维、推荐系统中有广泛应用。',
        formula: 'A = U \\Sigma V^T, \\quad \\Sigma = \\text{diag}(\\sigma_1, \\sigma_2, \\ldots, \\sigma_r)',
        example: '图像压缩：保留前k个最大奇异值，可以压缩图像同时保持主要特征。'
      },
      {
        id: 'singular-value',
        name: '奇异值',
        category: '矩阵分解',
        definition: '矩阵 A 的奇异值是 A^T A（或 AA^T）的特征值的平方根。奇异值按从大到小排列：σ₁ ≥ σ₂ ≥ ... ≥ σᵣ > 0。奇异值的个数等于矩阵的秩。',
        plainTranslation: '奇异值是"矩阵作用强度的度量"。奇异值大，说明在那个方向上作用强；奇异值小，说明作用弱。奇异值衰减快，说明矩阵"低秩"，可以压缩。',
        whyNeedIt: '奇异值揭示了矩阵的本质结构，在低秩近似、噪声过滤中有重要应用。',
        formula: '\\sigma_i = \\sqrt{\\lambda_i(A^T A)}',
        example: '矩阵 A = [3 0; 0 -2] 的奇异值是 3 和 2。'
      },
      {
        id: 'cholesky-decomposition',
        name: 'Cholesky分解',
        category: '矩阵分解',
        definition: '对于正定矩阵 A，存在唯一的下三角矩阵 L 使得 A = LL^T。这就是Cholesky分解。L 的对角线元素都是正数。',
        plainTranslation: 'Cholesky分解是"正定矩阵的专属分解"。把正定矩阵分解成下三角乘其转置。Cholesky分解比LU分解更快更稳定，是正定矩阵的首选分解方法。',
        whyNeedIt: 'Cholesky分解在求解正定方程组、蒙特卡洛模拟中有重要应用。',
        formula: 'A = LL^T, \\quad A \\text{ 正定}',
        example: '[4 2; 2 5] = [2 0; 1 2] × [2 1; 0 2]。'
      },
      {
        id: 'spectral-decomposition',
        name: '谱分解',
        category: '矩阵分解',
        definition: '对于对称矩阵 A，存在正交矩阵 Q 和对角矩阵 Λ 使得 A = QΛQ^T = Σ λᵢ qᵢ qᵢ^T。这就是谱分解，也称特征值分解。',
        plainTranslation: '谱分解是"对称矩阵展开成特征向量外积的和"。对称矩阵可以写成：特征值 × 特征向量 × 特征向量转置，然后加起来。每个特征值和特征向量贡献一个"分量"。',
        whyNeedIt: '谱分解是对称矩阵的标准分解，在主成分分析、量子力学中有重要应用。',
        formula: 'A = \\sum_{i=1}^{n} \\lambda_i q_i q_i^T',
        example: '[3 1; 1 3] = 4×[1/√2; 1/√2][1/√2, 1/√2] + 2×[1/√2; -1/√2][1/√2, -1/√2]。'
      },
      {
        id: 'matrix-trace',
        name: '矩阵的迹',
        category: '矩阵函数',
        definition: '方阵 A 的迹是主对角线元素之和：tr(A) = Σᵢ aᵢᵢ。迹等于特征值之和。迹的性质：tr(A+B) = tr(A) + tr(B)，tr(AB) = tr(BA)。',
        plainTranslation: '迹是"对角线元素加起来"。迹有一个神奇性质：tr(AB) = tr(BA)，即乘积的迹与顺序无关。迹等于所有特征值加起来。',
        whyNeedIt: '迹是矩阵的重要不变量，在特征值理论、优化中有重要应用。',
        formula: '\\text{tr}(A) = \\sum_{i=1}^{n} a_{ii} = \\sum_{i=1}^{n} \\lambda_i',
        example: '矩阵 [1 2; 3 4] 的迹 = 1 + 4 = 5 = 特征值之和（特征值是 (5±√33)/2）。'
      },
      {
        id: 'matrix-norm',
        name: '矩阵范数',
        category: '矩阵函数',
        definition: '矩阵范数是矩阵"大小"的度量。常用范数：(1) Frobenius范数 ‖A‖_F = √(Σᵢⱼ aᵢⱼ²)；(2) 算子范数 ‖A‖₂ = σ₁（最大奇异值）；(3) 1-范数（列和最大值）；(4) ∞-范数（行和最大值）。',
        plainTranslation: '矩阵范数是"矩阵有多大的度量"。Frobenius范数把所有元素平方加起来开根号；算子范数是最大奇异值，代表矩阵的最大"放大倍数"。',
        whyNeedIt: '矩阵范数在数值分析、误差估计、收敛性分析中有重要应用。',
        formula: '\\|A\\|_F = \\sqrt{\\sum_{i,j} a_{ij}^2}, \\quad \\|A\\|_2 = \\sigma_1',
        example: '矩阵 [1 2; 3 4] 的Frobenius范数 = √(1+4+9+16) = √30。'
      },
      {
        id: 'frobenius-norm',
        name: 'Frobenius范数',
        category: '矩阵函数',
        definition: 'Frobenius范数定义为 ‖A‖_F = √(Σᵢⱼ |aᵢⱼ|²) = √(tr(A^T A))。它是矩阵所有元素平方和的平方根，也是奇异值的平方和的平方根。',
        plainTranslation: 'Frobenius范数是"把矩阵拉成向量后的长度"。把所有元素平方加起来开根号，就像计算向量的欧几里得长度。Frobenius范数便于计算，广泛用于机器学习。',
        whyNeedIt: 'Frobenius范数是矩阵最常用的范数，在矩阵逼近、正则化中有重要应用。',
        formula: '\\|A\\|_F = \\sqrt{\\text{tr}(A^T A)} = \\sqrt{\\sum_{i=1}^{r} \\sigma_i^2}',
        example: '矩阵 [1 2; 3 4] 的Frobenius范数 = √(1²+2²+3²+4²) = √30 ≈ 5.48。'
      },
      {
        id: 'block-matrix',
        name: '分块矩阵',
        category: '分块矩阵',
        definition: '分块矩阵是将矩阵按行和列分割成若干子矩阵（块）的形式。分块矩阵可以像普通矩阵一样进行运算，只要块的维度匹配。',
        plainTranslation: '分块矩阵是"把大矩阵切成小块"。每个块是一个小矩阵。分块后可以"整体运算"，简化大矩阵的处理。分块矩阵就像"矩阵的矩阵"。',
        whyNeedIt: '分块矩阵简化了大矩阵的分析和计算，在并行计算中有重要应用。',
        formula: 'A = \\begin{pmatrix} A_{11} & A_{12} \\\\ A_{21} & A_{22} \\end{pmatrix}',
        example: '矩阵 [1 2 3 4; 5 6 7 8; 9 10 11 12] 可分成 [A B; C D]，其中A=[1 2; 5 6]。'
      },
      {
        id: 'block-matrix-multiplication',
        name: '分块矩阵乘法',
        category: '分块矩阵',
        definition: '分块矩阵乘法与普通矩阵乘法规则相同，只要块的维度匹配：[A B; C D] × [E F; G H] = [AE+BG AF+BH; CE+DG CF+DH]。',
        plainTranslation: '分块乘法是"把块当元素来乘"。只要块的尺寸匹配，就可以像普通矩阵乘法一样计算。分块乘法让大矩阵运算变得清晰有序。',
        whyNeedIt: '分块乘法简化了大矩阵乘法的组织和计算，便于并行处理。',
        formula: '\\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix} \\begin{pmatrix} E & F \\\\ G & H \\end{pmatrix} = \\begin{pmatrix} AE+BG & AF+BH \\\\ CE+DG & CF+DH \\end{pmatrix}',
        example: '分块矩阵 [I A; 0 I] × [I -A; 0 I] = [I 0; 0 I] = I。'
      },
      {
        id: 'block-diagonal-matrix',
        name: '分块对角矩阵',
        category: '分块矩阵',
        definition: '分块对角矩阵是形如 diag(A₁, A₂, ..., Aₖ) 的矩阵，非零块只在主对角线上。分块对角矩阵的行列式等于各块行列式的乘积。',
        plainTranslation: '分块对角矩阵是"对角线上放小矩阵"的矩阵。运算时各块独立进行，就像多个小矩阵各自处理。分块对角矩阵简化了复杂系统的分析。',
        whyNeedIt: '分块对角矩阵在解耦系统、并行计算中有重要应用。',
        formula: '\\text{diag}(A_1, A_2, \\ldots, A_k) = \\begin{pmatrix} A_1 & & \\\\ & \\ddots & \\\\ & & A_k \\end{pmatrix}',
        example: '分块对角矩阵 [A 0; 0 B] 的逆 = [A^{-1} 0; 0 B^{-1}]。'
      },
      {
        id: 'matrix-power',
        name: '矩阵的幂',
        category: '矩阵运算',
        definition: '矩阵 A 的 k 次幂定义为 A^k = A · A · ... · A（k个A相乘）。对于可对角化矩阵 A = PΛP^{-1}，有 A^k = PΛ^k P^{-1}。',
        plainTranslation: '矩阵幂是"矩阵自己乘自己k次"。如果矩阵能对角化，幂运算就很简单：特征值取k次幂，特征向量不变。矩阵幂在马尔可夫链、递推关系中有重要应用。',
        whyNeedIt: '矩阵幂在马尔可夫链、线性递推、微分方程求解中有重要应用。',
        formula: 'A^k = P \\Lambda^k P^{-1}, \\quad \\Lambda^k = \\text{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k)',
        example: '矩阵 [2 0; 0 3]^{10} = [2^{10} 0; 0 3^{10}] = [1024 0; 0 59049]。'
      },
      {
        id: 'matrix-exponential',
        name: '矩阵指数',
        category: '矩阵函数',
        definition: '矩阵指数定义为 e^A = Σₖ₌₀^∞ A^k/k!。矩阵指数在解微分方程组中有重要应用：dx/dt = Ax 的解为 x(t) = e^{At} x(0)。',
        plainTranslation: '矩阵指数是"把指数函数推广到矩阵"。用泰勒级数定义：e^A = I + A + A²/2! + A³/3! + ...。矩阵指数是解线性微分方程组的核心工具。',
        whyNeedIt: '矩阵指数是解线性微分方程组的核心，在控制理论、量子力学中有重要应用。',
        formula: 'e^A = \\sum_{k=0}^{\\infty} \\frac{A^k}{k!}',
        example: '对于 A = [0 1; 0 0]，e^A = [1 1; 0 1]（因为 A² = 0）。'
      },
      {
        id: 'matrix-logarithm',
        name: '矩阵对数',
        category: '矩阵函数',
        definition: '对于可逆矩阵 A，若存在矩阵 B 使得 e^B = A，则称 B 为 A 的矩阵对数。矩阵对数不一定唯一。',
        plainTranslation: '矩阵对数是"矩阵指数的逆运算"。找到矩阵B使得e^B = A。矩阵对数在连续时间马尔可夫链、李群理论中有应用。',
        whyNeedIt: '矩阵对数在李群理论、连续时间马尔可夫链中有重要应用。',
        formula: 'e^B = A \\Rightarrow B = \\ln A',
        example: '对于旋转矩阵 R(θ) = [cos θ -sin θ; sin θ cos θ]，其对数是 [0 -θ; θ 0]。'
      },
      {
        id: 'matrix-square-root',
        name: '矩阵平方根',
        category: '矩阵函数',
        definition: '对于正定矩阵 A，存在唯一的正定矩阵 B 使得 B² = A，B 称为 A 的平方根，记作 A^{1/2}。B = Q√Λ Q^T，其中 A = QΛQ^T。',
        plainTranslation: '矩阵平方根是"自己乘自己等于原矩阵"的矩阵。正定矩阵有唯一的正定平方根。计算方法：对角化后，特征值开根号。',
        whyNeedIt: '矩阵平方根在协方差矩阵变换、信号处理中有重要应用。',
        formula: 'A^{1/2} = Q \\sqrt{\\Lambda} Q^T, \\quad (A^{1/2})^2 = A',
        example: '[4 0; 0 9]^{1/2} = [2 0; 0 3]。'
      },
      {
        id: 'adjugate-matrix-detail',
        name: '伴随矩阵（详细）',
        category: '相关概念',
        definition: '矩阵 A 的伴随矩阵 adj(A) 是代数余子式矩阵的转置。重要性质：A · adj(A) = adj(A) · A = |A| · I。逆矩阵公式：A^{-1} = adj(A) / |A|。',
        plainTranslation: '伴随矩阵是"代数余子式转置后"的矩阵。伴随矩阵有一个神奇性质：矩阵乘以伴随矩阵等于行列式乘以单位矩阵。这直接给出逆矩阵的公式。',
        whyNeedIt: '伴随矩阵是求逆矩阵的理论基础，在克拉默法则证明中有重要应用。',
        formula: 'A \\cdot \\text{adj}(A) = |A| \\cdot I',
        example: '对于 [a b; c d]，adj(A) = [d -b; -c a]。'
      },
      {
        id: 'matrix-equation-axb',
        name: '矩阵方程 AX=B',
        category: '矩阵方程',
        definition: '矩阵方程 AX = B 的解：若 A 可逆，则 X = A^{-1}B。求解方法是同时对 A 和 B 做行变换，把 A 化成 I，B 就变成 X。',
        plainTranslation: '矩阵方程AX=B的解法：A可逆时，X = A^{-1}B。注意顺序：A在左边，所以A^{-1}要左乘。实际计算用增广矩阵[A|B]做行变换。',
        whyNeedIt: '矩阵方程在求解多个线性方程组、线性变换复合中有重要应用。',
        formula: 'AX = B \\Rightarrow X = A^{-1} B \\text{（A可逆时）}',
        example: '解 [1 2; 3 4]X = [1 0; 0 1]：X = A^{-1} = [-2 1; 1.5 -0.5]。'
      },
      {
        id: 'matrix-equation-xab',
        name: '矩阵方程 XA=B',
        category: '矩阵方程',
        definition: '矩阵方程 XA = B 的解：若 A 可逆，则 X = BA^{-1}。注意与 AX = B 不同，这里 A^{-1} 要右乘。也可转置化为 A^T X^T = B^T 求解。',
        plainTranslation: '矩阵方程XA=B的解法：A可逆时，X = BA^{-1}。注意顺序：A在右边，所以A^{-1}要右乘。这与AX=B不同，顺序很重要！',
        whyNeedIt: '理解矩阵方程解的顺序是正确求解矩阵方程的关键。',
        formula: 'XA = B \\Rightarrow X = B A^{-1} \\text{（A可逆时）}',
        example: '解 X[1 2; 3 4] = [1 0; 0 1]：X = A^{-1} = [-2 1; 1.5 -0.5]。'
      },
      {
        id: 'linear-transformation',
        name: '线性变换',
        category: '应用',
        definition: '线性变换是满足 T(αu + βv) = αT(u) + βT(v) 的映射。任何线性变换都可以用矩阵表示：T(x) = Ax。矩阵的列就是基向量的像。',
        plainTranslation: '线性变换是"保持线性组合"的变换。伸缩、旋转、投影、反射都是线性变换。每个线性变换对应一个矩阵，矩阵的列就是原来基向量变换后的位置。',
        whyNeedIt: '线性变换是矩阵的几何本质，矩阵是线性变换的代数表示。',
        formula: 'T(\\alpha u + \\beta v) = \\alpha T(u) + \\beta T(v)',
        example: '旋转矩阵 [cos θ -sin θ; sin θ cos θ] 表示逆时针旋转θ角的线性变换。'
      },
      {
        id: 'rotation-matrix',
        name: '旋转矩阵',
        category: '应用',
        definition: '二维旋转矩阵 R(θ) = [cos θ -sin θ; sin θ cos θ] 表示逆时针旋转θ角。旋转矩阵是正交矩阵，行列式为1。',
        plainTranslation: '旋转矩阵是"让向量旋转但不改变长度"的矩阵。旋转矩阵是正交矩阵，行列式为1。旋转可以叠加：R(α)R(β) = R(α+β)。',
        whyNeedIt: '旋转矩阵在计算机图形学、机器人学、物理中有广泛应用。',
        formula: 'R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}',
        example: '旋转90°的矩阵 = [0 -1; 1 0]，向量(1,0)旋转后变成(0,1)。'
      },
      {
        id: 'projection-matrix',
        name: '投影矩阵',
        category: '应用',
        definition: '投影矩阵 P 将向量投影到某个子空间。投影矩阵满足 P² = P（幂等性）。向子空间 V 的投影矩阵为 P = U(U^T U)^{-1} U^T，其中 U 的列是 V 的基。',
        plainTranslation: '投影矩阵是"把向量投影到子空间"的矩阵。投影矩阵有一个特点：投影两次等于投影一次（P² = P）。投影矩阵在最小二乘法中是核心。',
        whyNeedIt: '投影矩阵在最小二乘法、主成分分析中有重要应用。',
        formula: 'P^2 = P, \\quad P = U(U^T U)^{-1} U^T',
        example: '向x轴投影的矩阵 = [1 0; 0 0]，向量(a,b)投影后变成(a,0)。'
      },
      {
        id: 'reflection-matrix',
        name: '反射矩阵',
        category: '应用',
        definition: '反射矩阵将向量关于某条直线或平面对称。二维关于过原点直线（倾角θ）的反射矩阵为 [cos 2θ sin 2θ; sin 2θ -cos 2θ]。反射矩阵是正交矩阵，行列式为-1。',
        plainTranslation: '反射矩阵是"镜像对称"的矩阵。反射矩阵是正交矩阵，但行列式为-1（改变方向）。反射两次等于不变。',
        whyNeedIt: '反射矩阵在几何变换、对称性分析中有重要应用。',
        formula: '\\text{关于x轴反射: } \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}',
        example: '关于x轴反射的矩阵 = [1 0; 0 -1]，向量(a,b)反射后变成(a,-b)。'
      },
      {
        id: 'shear-matrix',
        name: '剪切矩阵',
        category: '应用',
        definition: '剪切矩阵表示剪切变换。二维水平剪切矩阵为 [1 k; 0 1]，将点(x,y)变为(x+ky,y)。剪切变换保持面积不变，行列式为1。',
        plainTranslation: '剪切矩阵是"把正方形变成平行四边形"的变换。水平剪切让每一点水平移动，移动量与高度成正比。剪切不改变面积。',
        whyNeedIt: '剪切变换在图形变换、几何建模中有应用。',
        formula: '\\text{水平剪切: } \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}',
        example: '剪切矩阵 [1 1; 0 1] 把正方形变成平行四边形，点(1,1)变成(2,1)。'
      },
      {
        id: 'matrix-derivative',
        name: '矩阵的导数',
        category: '微积分',
        definition: '若矩阵 A(t) 的元素是 t 的函数，则 dA/dt = (da_{ij}/dt)。乘积的导数：d(AB)/dt = (dA/dt)B + A(dB/dt)。行列式的导数：d|A|/dt = |A|·tr(A^{-1} dA/dt)。',
        plainTranslation: '矩阵导数是"每个元素分别求导"。乘积的导数要用乘积法则。行列式的导数有一个漂亮公式：行列式乘以逆矩阵导数的迹。',
        whyNeedIt: '矩阵导数在优化、控制理论、机器学习中有重要应用。',
        formula: '\\frac{d(AB)}{dt} = \\frac{dA}{dt} B + A \\frac{dB}{dt}',
        example: '若 A(t) = [t 0; 0 t²]，则 dA/dt = [1 0; 0 2t]。'
      },
      {
        id: 'matrix-integral',
        name: '矩阵的积分',
        category: '微积分',
        definition: '矩阵 A(t) 的积分定义为逐元素积分：∫A(t)dt = (∫a_{ij}(t)dt)。矩阵积分在解微分方程组中有应用。',
        plainTranslation: '矩阵积分是"每个元素分别积分"。积分和求导是逆运算。矩阵积分在解微分方程组时有用。',
        whyNeedIt: '矩阵积分在解线性微分方程组中有重要应用。',
        formula: '\\int A(t) dt = \\left( \\int a_{ij}(t) dt \\right)',
        example: '∫[t 0; 0 t²]dt = [t²/2 0; 0 t³/3] + C。'
      },
      {
        id: 'kronecker-product',
        name: 'Kronecker积',
        category: '特殊运算',
        definition: '矩阵 A_{m×n} 和 B_{p×q} 的Kronecker积 A ⊗ B 是 mp×nq 矩阵，由 a_{ij}B 为块组成。性质：(A⊗B)(C⊗D) = (AC)⊗(BD)。',
        plainTranslation: 'Kronecker积是"把B放到A每个元素的位置上再乘以那个元素"。结果是一个大矩阵。Kronecker积在张量运算、量子力学中有重要应用。',
        whyNeedIt: 'Kronecker积在张量分析、量子力学、图像处理中有重要应用。',
        formula: 'A \\otimes B = \\begin{pmatrix} a_{11}B & \\cdots & a_{1n}B \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1}B & \\cdots & a_{mn}B \\end{pmatrix}',
        example: '[1 2] ⊗ [3 4] = [3 4 6 8]。'
      },
      {
        id: 'hadamard-product',
        name: 'Hadamard积',
        category: '特殊运算',
        definition: '两个同型矩阵 A 和 B 的Hadamard积（逐元素积）定义为 (A ∘ B)_{ij} = a_{ij} · b_{ij}。Hadamard积是对应元素相乘。',
        plainTranslation: 'Hadamard积是"对应元素相乘"，不是矩阵乘法。结果形状不变。Hadamard积在神经网络、图像处理中常用。',
        whyNeedIt: 'Hadamard积在神经网络、信号处理中有重要应用。',
        formula: '(A \\circ B)_{ij} = a_{ij} \\cdot b_{ij}',
        example: '[1 2; 3 4] ∘ [5 6; 7 8] = [5 12; 21 32]。'
      },
      {
        id: 'matrix-inequality',
        name: '矩阵不等式',
        category: '矩阵序',
        definition: '对于对称矩阵 A、B，定义 A ≥ B 表示 A - B 半正定。矩阵不等式满足：若 A ≥ B 且 B ≥ C，则 A ≥ C。若 A ≥ B，则 |A| ≥ |B|（对于正定矩阵）。',
        plainTranslation: '矩阵不等式是"半正定序"的比较。A ≥ B 意味着 A - B 是半正定的。矩阵不等式在优化、控制理论中有重要应用。',
        whyNeedIt: '矩阵不等式在半定规划、控制理论中有重要应用。',
        formula: 'A \\geq B \\Leftrightarrow A - B \\text{ 半正定}',
        example: '[3 0; 0 3] ≥ [1 0; 0 1]，因为 [2 0; 0 2] 是正定的。'
      },
      {
        id: 'condition-number',
        name: '条件数',
        category: '数值分析',
        definition: '矩阵 A 的条件数 cond(A) = ‖A‖ · ‖A^{-1}‖。条件数衡量矩阵求逆的数值稳定性。条件数越大，数值计算越不稳定。常用 cond₂(A) = σ₁/σᵣ。',
        plainTranslation: '条件数是"矩阵有多病态的度量"。条件数大，说明矩阵接近奇异，数值计算误差会被放大。条件数小，计算稳定。',
        whyNeedIt: '条件数是数值分析的核心概念，决定了线性方程组求解的稳定性。',
        formula: '\\text{cond}(A) = \\|A\\| \\cdot \\|A^{-1}\\| = \\frac{\\sigma_1}{\\sigma_r}',
        example: '矩阵 [1 1; 1 1.0001] 的条件数很大（约40000），求解方程组时误差会被放大。'
      },
      {
        id: 'pseudo-inverse',
        name: '伪逆矩阵',
        category: '广义逆',
        definition: '矩阵 A 的Moore-Penrose伪逆 A⁺ 满足：(1) AA⁺A = A；(2) A⁺AA⁺ = A⁺；(3) (AA⁺)^T = AA⁺；(4) (A⁺A)^T = A⁺A。对于 A = UΣV^T，A⁺ = VΣ⁺U^T。',
        plainTranslation: '伪逆是"逆矩阵的推广"。即使矩阵不可逆或不是方阵，也有伪逆。伪逆给出最小二乘解：x = A⁺b 是 Ax ≈ b 的最小范数最小二乘解。',
        whyNeedIt: '伪逆在最小二乘法、数据拟合、机器学习中有重要应用。',
        formula: 'A^+ = V \\Sigma^+ U^T, \\quad \\Sigma^+ = \\text{diag}(1/\\sigma_1, \\ldots, 1/\\sigma_r, 0, \\ldots, 0)',
        example: '矩阵 [1 1] 的伪逆 = [0.5; 0.5]，给出最小二乘解。'
      },
      {
        id: 'nilpotent-matrix',
        name: '幂零矩阵',
        category: '特殊矩阵',
        definition: '若存在正整数 k 使得 A^k = O，则称 A 为幂零矩阵。幂零矩阵的特征值全为零，是奇异矩阵。幂零矩阵的指数 e^A 是多项式。',
        plainTranslation: '幂零矩阵是"乘几次自己变成零"的矩阵。幂零矩阵的所有特征值都是0。幂零矩阵的指数很简单：e^A = I + A + A²/2! + ... + A^{k-1}/(k-1)!。',
        whyNeedIt: '幂零矩阵在Jordan标准形、李代数中有重要应用。',
        formula: 'A^k = O \\text{ 对某个 } k > 0',
        example: '矩阵 [0 1; 0 0] 是幂零的，因为 A² = 0。'
      },
      {
        id: 'idempotent-matrix',
        name: '幂等矩阵',
        category: '特殊矩阵',
        definition: '满足 A² = A 的矩阵称为幂等矩阵。投影矩阵是幂等矩阵。幂等矩阵的特征值只能是0或1。',
        plainTranslation: '幂等矩阵是"自己乘自己等于自己"的矩阵。幂等矩阵代表投影变换。幂等矩阵的特征值只能是0或1。',
        whyNeedIt: '幂等矩阵在投影、统计估计中有重要应用。',
        formula: 'A^2 = A',
        example: '投影矩阵 [1 0; 0 0] 是幂等的：[1 0; 0 0]² = [1 0; 0 0]。'
      },
      {
        id: 'involutory-matrix',
        name: '对合矩阵',
        category: '特殊矩阵',
        definition: '满足 A² = I 的矩阵称为对合矩阵。对合矩阵是自己的逆：A^{-1} = A。反射矩阵是对合矩阵。',
        plainTranslation: '对合矩阵是"自己乘自己等于单位矩阵"的矩阵。对合矩阵的逆就是自己。反射矩阵是对合矩阵的典型例子。',
        whyNeedIt: '对合矩阵在反射变换、对称性分析中有应用。',
        formula: 'A^2 = I \\Rightarrow A^{-1} = A',
        example: '反射矩阵 [1 0; 0 -1] 是对合的：[1 0; 0 -1]² = I。'
      },
      {
        id: 'normal-matrix',
        name: '正规矩阵',
        category: '特殊矩阵',
        definition: '满足 A^T A = A A^T 的矩阵称为正规矩阵。对称矩阵、反对称矩阵、正交矩阵都是正规矩阵。正规矩阵可以正交对角化。',
        plainTranslation: '正规矩阵是"与自己转置可交换"的矩阵。正规矩阵有一个重要性质：可以正交对角化。对称矩阵、正交矩阵都是正规矩阵。',
        whyNeedIt: '正规矩阵是可以正交对角化的矩阵类，在矩阵分析中有重要地位。',
        formula: 'A^T A = A A^T',
        example: '矩阵 [1 1; -1 1] 是正规矩阵，可以正交对角化。'
      },
      {
        id: 'hermitian-matrix',
        name: '埃尔米特矩阵',
        category: '特殊矩阵',
        definition: '满足 A^* = A 的复矩阵称为埃尔米特矩阵。埃尔米特矩阵的特征值都是实数，可以酉对角化。实对称矩阵是埃尔米特矩阵的特例。',
        plainTranslation: '埃尔米特矩阵是"共轭转置等于自己"的复矩阵。埃尔米特矩阵的特征值都是实数。实对称矩阵就是实数域上的埃尔米特矩阵。',
        whyNeedIt: '埃尔米特矩阵在量子力学（可观测量）、复分析中有重要应用。',
        formula: 'A^* = A \\Leftrightarrow a_{ij} = \\overline{a_{ji}}',
        example: '矩阵 [1 i; -i 2] 是埃尔米特矩阵，特征值是实数。'
      },
      {
        id: 'unitary-matrix',
        name: '酉矩阵',
        category: '特殊矩阵',
        definition: '满足 A^* A = I 的复矩阵称为酉矩阵。酉矩阵是复数域上的正交矩阵，保持向量长度不变。酉矩阵的特征值模为1。',
        plainTranslation: '酉矩阵是"复数域上的正交矩阵"。酉矩阵的共轭转置等于逆。酉矩阵代表复向量空间中的旋转，不改变向量长度。',
        whyNeedIt: '酉矩阵在量子力学、信号处理中有重要应用。',
        formula: 'A^* A = I \\Leftrightarrow A^{-1} = A^*',
        example: '矩阵 [1/√2 i/√2; i/√2 1/√2] 是酉矩阵。'
      },
      {
        id: 'matrix-equivalence',
        name: '矩阵等价',
        category: '矩阵关系',
        definition: '若存在可逆矩阵P、Q使得 PAQ = B，则称矩阵A与B等价。等价的充要条件是 r(A) = r(B)（同型矩阵）。初等变换不改变矩阵的等价类。',
        plainTranslation: '矩阵等价就是"通过初等变换能互相转化"。两个同型矩阵等价当且仅当它们的秩相同——就像两个人属于同一个"阶层"，只要地位（秩）一样就是等价的。初等行变换和列变换都是等价变换。',
        whyNeedIt: '矩阵等价是线性代数中三种重要关系（等价、相似、合同）中最基本的一种。理解等价是理解相似和合同的基础。',
        formula: 'A \\cong B \\Leftrightarrow r(A) = r(B) \\text{（同型矩阵）}'
      },
      {
        id: 'matrix-congruence',
        name: '矩阵合同',
        category: '矩阵关系',
        definition: '若存在可逆矩阵C使得 C^TAC = B，则称A与B合同。合同关系保持对称性和正定性。实对称矩阵合同的充要条件是正负惯性指数相同（惯性定理）。',
        plainTranslation: '合同变换就像"换一套坐标看同一个二次型"——坐标变了，矩阵跟着变，但二次型的本质特征（正负惯性指数）不变。合同与等价的区别在于：合同用的是C^TAC（转置），等价用的是PAQ（一般可逆）。',
        whyNeedIt: '矩阵合同是二次型理论的核心概念。化简二次型就是在找合同标准形，惯性定理保证了合同关系的本质不变量。',
        formula: 'C^TAC = B, \\quad C\\text{可逆} \\Rightarrow A \\text{与} B \\text{合同}'
      },
      {
        id: 'equivalence-similarity-congruence',
        name: '等价、相似、合同的关系',
        category: '矩阵关系',
        definition: '相似（P⁻¹AP=B）和合同（C^TAC=B）都是等价（PAQ=B）的特殊情形。相似必有等价，合同必有等价。实对称矩阵：正交相似等价于正交合同。一般情况下相似与合同互不蕴含。',
        plainTranslation: '三种关系是一个"递进"的关系：等价最宽松（只要求秩相同），相似较严格（要求特征值相同），合同另辟蹊径（要求正负惯性指数相同）。对于实对称矩阵，相似和合同在正交变换下统一了，因为正交矩阵Q满足Q^T=Q⁻¹。',
        whyNeedIt: '理清三种关系的区别和联系是考研线性代数的重点。选择题常考"相似必等价"等推理，实对称矩阵的"三位一体"是核心考点。',
        formula: '\\text{相似}(P^{-1}AP) \\Rightarrow \\text{等价}; \\quad \\text{合同}(C^TAC) \\Rightarrow \\text{等价}; \\quad \\text{实对称阵正交变换下：相似} \\Leftrightarrow \\text{合同}'
      },
      {
        id: 'adjugate-properties',
        name: '伴随矩阵的性质',
        category: '矩阵运算',
        definition: '伴随矩阵A*满足：(1) AA* = A*A = |A|E；(2) |A*| = |A|^{n-1}；(3) (A*)* = |A|^{n-2}A (n≥3)；(4) (AB)* = B*A*；(5) 若A可逆，则A* = |A|A⁻¹，(A*)⁻¹ = A/|A|。',
        plainTranslation: '伴随矩阵就像矩阵的"影子"——它和原矩阵的乘积总是|A|E，不管A可不可逆。可逆时A*直接等于|A|A⁻¹；不可逆时AA*=0（零矩阵），但A*本身不一定为零矩阵。',
        whyNeedIt: '伴随矩阵是考研线性代数的高频考点，常考性质推导和抽象矩阵运算。特别是|A*|=|A|^{n-1}和AA*=|A|E是最基本的结论。',
        formula: 'AA^* = A^*A = |A|E, \\quad |A^*| = |A|^{n-1}'
      },
      {
        id: 'elementary-matrix-transform',
        name: '初等矩阵与初等变换的对应',
        category: '矩阵运算',
        definition: '对A做一次初等行变换等价于左乘对应的初等矩阵；做一次初等列变换等价于右乘对应的初等矩阵。三种初等变换对应三种初等矩阵：交换两行、某行乘非零常数、某行的倍数加到另一行。初等矩阵都可逆，且逆矩阵仍为初等矩阵。',
        plainTranslation: '初等矩阵是初等变换的"矩阵化"——你做的每一步行变换，等价于在左边乘一个特殊的矩阵。就像"用代码来描述操作"——手动操作和矩阵乘法是一回事。这个对应关系是求逆矩阵和化简矩阵的理论基础。',
        whyNeedIt: '初等矩阵与初等变换的对应关系是矩阵理论的核心工具。它将"操作"转化为"乘法"，使得矩阵运算可以表达化简过程。',
        formula: 'E(i,j) \\cdot A \\Leftrightarrow \\text{交换}A\\text{的第}i,j\\text{行}'
      }
    ] as Concept[]
  },
  {
    id: 'chapter-25',
    name: '第二十五章 n维向量',
    concepts: [
      {
        id: 'n-vector-definition',
        name: 'n维向量的定义',
        category: '基本概念',
        definition: 'n维向量是由n个有序实数（或复数）组成的数组，记作 α = (a₁, a₂, ..., aₙ) 或 α = [a₁, a₂, ..., aₙ]ᵀ。向量可以看作特殊的矩阵：行向量是1×n矩阵，列向量是n×1矩阵。',
        plainTranslation: 'n维向量是"n个排好序的数"。就像一个有序列表，有n个位置，每个位置放一个数。向量可以横着写（行向量），也可以竖着写（列向量）。向量是线性代数的"原子"。',
        whyNeedIt: '向量是线性代数的基本对象，用于表示点的位置、力、速度、状态等多维信息。',
        formula: '\\vec{a} = (a_1, a_2, \\ldots, a_n) = \\begin{pmatrix} a_1 \\\\ a_2 \\\\ \\vdots \\\\ a_n \\end{pmatrix}',
        example: '向量 (1, 2, 3) 是三维向量，可以表示空间中点(1,2,3)的位置。'
      },
      {
        id: 'vector-component',
        name: '向量的分量',
        category: '基本概念',
        definition: '向量 α = (a₁, a₂, ..., aₙ) 中的每个数 aᵢ 称为向量的第i个分量。分量是向量在各个坐标方向上的"投影"。',
        plainTranslation: '向量的分量就是"向量里每个位置的数"。比如向量(3, 4, 5)，第1个分量是3，第2个分量是4，第3个分量是5。分量告诉我们向量在每个坐标方向上的"大小"。',
        whyNeedIt: '分量是向量的基本组成，向量运算本质上是分量之间的运算。',
        formula: '\\vec{a} = (a_1, a_2, \\ldots, a_n), \\quad a_i \\text{ 是第 } i \\text{ 个分量}',
        example: '向量 (2, -1, 3) 的第1分量是2，第2分量是-1，第3分量是3。'
      },
      {
        id: 'zero-vector',
        name: '零向量',
        category: '特殊向量',
        definition: '所有分量都为零的向量称为零向量，记作 0 或 0⃗。零向量是向量加法的单位元：α + 0 = α。',
        plainTranslation: '零向量是"所有分量都是0"的向量。零向量在向量加法中就像数字0一样：任何向量加零向量等于自己。零向量没有方向，长度为0。',
        whyNeedIt: '零向量是向量加法的单位元，在向量空间定义中必不可少。',
        formula: '\\vec{0} = (0, 0, \\ldots, 0)',
        example: '三维零向量 = (0, 0, 0)。向量 (1, 2, 3) + (0, 0, 0) = (1, 2, 3)。'
      },
      {
        id: 'unit-vector',
        name: '单位向量',
        category: '特殊向量',
        definition: '长度为1的向量称为单位向量。任何非零向量都可以单位化：ê = α/|α|。标准单位向量 eᵢ 是第i个分量为1，其余为0的向量。',
        plainTranslation: '单位向量是"长度为1"的向量。单位向量只表示方向，不表示大小。任何非零向量除以自己的长度，就变成同方向的单位向量。',
        whyNeedIt: '单位向量用于表示纯方向，在投影、正交化、坐标系中有重要应用。',
        formula: '\\vec{e} = \\frac{\\vec{a}}{|\\vec{a}|}, \\quad |\\vec{e}| = 1',
        example: '向量 (3, 4) 的单位向量 = (3/5, 4/5)，因为 |(3,4)| = 5。'
      },
      {
        id: 'standard-basis',
        name: '标准基向量',
        category: '基本概念',
        definition: 'n维空间的标准基向量是 e₁ = (1,0,...,0), e₂ = (0,1,0,...,0), ..., eₙ = (0,...,0,1)。任何向量都可以表示为标准基向量的线性组合。',
        plainTranslation: '标准基向量是"只有一个位置是1，其他都是0"的向量。它们是最基本的"方向单位"。任何向量都可以用标准基向量拼出来：比如(3,4,5) = 3e₁ + 4e₂ + 5e₃。',
        whyNeedIt: '标准基是最常用的坐标系，任何向量都可以用标准基表示。',
        formula: '\\vec{e}_1 = (1, 0, \\ldots, 0), \\quad \\vec{e}_2 = (0, 1, 0, \\ldots, 0), \\quad \\ldots',
        example: '三维标准基：e₁=(1,0,0), e₂=(0,1,0), e₃=(0,0,1)。向量(2,3,4) = 2e₁ + 3e₂ + 4e₃。'
      },
      {
        id: 'vector-addition',
        name: '向量加法',
        category: '向量运算',
        definition: '两个n维向量 α = (a₁, ..., aₙ) 和 β = (b₁, ..., bₙ) 的加法定义为 α + β = (a₁+b₁, ..., aₙ+bₙ)，即对应分量相加。',
        plainTranslation: '向量加法是"对应分量相加"。两个向量必须维数相同才能相加。几何上，向量加法是"首尾相接"：从α的终点出发走β，到达的位置就是α+β。',
        whyNeedIt: '向量加法是向量空间的基本运算，用于力的合成、位移叠加等。',
        formula: '(a_1, a_2, \\ldots, a_n) + (b_1, b_2, \\ldots, b_n) = (a_1+b_1, a_2+b_2, \\ldots, a_n+b_n)',
        example: '(1, 2, 3) + (4, 5, 6) = (5, 7, 9)。'
      },
      {
        id: 'vector-scalar-multiplication',
        name: '向量数乘',
        category: '向量运算',
        definition: '标量 k 与向量 α = (a₁, ..., aₙ) 的数乘定义为 kα = (ka₁, ..., kaₙ)，即每个分量都乘以k。',
        plainTranslation: '向量数乘是"每个分量都乘以同一个数"。正数k乘向量，长度变成k倍，方向不变；负数乘向量，方向相反。数乘改变向量的"大小"但不改变"方向"（除了反向）。',
        whyNeedIt: '数乘是向量空间的基本运算，用于缩放、反向、线性组合。',
        formula: 'k(a_1, a_2, \\ldots, a_n) = (ka_1, ka_2, \\ldots, ka_n)',
        example: '3 × (1, 2) = (3, 6)，-2 × (1, 2) = (-2, -4)。'
      },
      {
        id: 'vector-linear-combination',
        name: '向量的线性组合',
        category: '重要概念',
        definition: '向量 α₁, α₂, ..., αₘ 的线性组合是形如 k₁α₁ + k₂α₂ + ... + kₘαₘ 的表达式，其中 kᵢ 是标量。线性组合是向量加法和数乘的复合。',
        plainTranslation: '线性组合是"用几个向量造出新向量"。把每个向量乘以一个系数，然后加起来。线性组合是向量空间最核心的运算方式。',
        whyNeedIt: '线性组合是向量空间的核心概念，线性相关、基、线性变换都建立在它之上。',
        formula: 'k_1 \\vec{\\alpha}_1 + k_2 \\vec{\\alpha}_2 + \\cdots + k_m \\vec{\\alpha}_m',
        example: '向量 (1,0) 和 (0,1) 的线性组合 3(1,0) + 4(0,1) = (3,4)。'
      },
      {
        id: 'linear-dependence',
        name: '线性相关',
        category: '重要概念',
        definition: '向量组 α₁, α₂, ..., αₘ 称为线性相关，如果存在不全为零的标量 k₁, k₂, ..., kₘ 使得 k₁α₁ + k₂α₂ + ... + kₘαₘ = 0。等价于至少有一个向量可以表示为其他向量的线性组合。',
        plainTranslation: '线性相关是"向量之间有冗余"。一组向量线性相关，意味着至少有一个向量可以被其他向量"凑出来"。比如(1,2)和(2,4)线性相关，因为后者是前者的2倍。',
        whyNeedIt: '线性相关判断向量组是否有冗余，是判断基、维数的关键。',
        formula: 'k_1 \\vec{\\alpha}_1 + k_2 \\vec{\\alpha}_2 + \\cdots + k_m \\vec{\\alpha}_m = \\vec{0}, \\quad \\text{存在 } k_i \\neq 0',
        example: '(1, 2), (2, 4), (3, 5) 线性相关，因为 2(1,2) - 1(2,4) + 0(3,5) = (0,0)。'
      },
      {
        id: 'linear-independence',
        name: '线性无关',
        category: '重要概念',
        definition: '向量组 α₁, α₂, ..., αₚ 称为线性无关，如果 k₁α₁ + k₂α₂ + ... + kₚαₚ = 0 当且仅当所有 kᵢ = 0。线性无关意味着没有任何向量可以表示为其他向量的线性组合。',
        plainTranslation: '线性无关是"向量之间没有冗余"。一组向量线性无关，意味着每个向量都是"独立"的，不能被其他向量凑出来。线性无关的向量组是"精简"的。',
        whyNeedIt: '线性无关是定义基的前提，线性无关的向量组包含最多的独立信息。',
        formula: 'k_1 \\vec{\\alpha}_1 + \\cdots + k_p \\vec{\\alpha}_p = \\vec{0} \\Rightarrow k_1 = \\cdots = k_p = 0',
        example: '(1, 0) 和 (0, 1) 线性无关，因为要使 k₁(1,0) + k₂(0,1) = (0,0)，必须 k₁ = k₂ = 0。'
      },
      {
        id: 'vector-space',
        name: '向量空间',
        category: '空间结构',
        definition: '向量空间 V 是一个集合，定义了加法和数乘运算，满足八条公理：加法交换律、结合律、零元存在、负元存在、数乘结合律、数乘对向量加法分配律、数乘对数加法分配律、1·α = α。',
        plainTranslation: '向量空间是"可以做加法和数乘的地方"。向量空间里的元素可以相加，可以乘以数，而且满足一些基本规则。向量空间是线性代数的"舞台"。',
        whyNeedIt: '向量空间是线性代数的核心结构，统一了向量、矩阵、函数等多种对象的研究。',
        formula: 'V \\text{ 是向量空间} \\Leftrightarrow \\text{满足8条公理}',
        example: 'ℝⁿ（所有n维实向量）、所有m×n矩阵、所有多项式都是向量空间的例子。'
      },
      {
        id: 'subspace',
        name: '子空间',
        category: '空间结构',
        definition: '向量空间 V 的子集 W 称为子空间，如果 W 对加法和数乘封闭（即 W 中元素相加、数乘仍在 W 中），且包含零向量。',
        plainTranslation: '子空间是"向量空间里的小空间"。子空间本身也是一个向量空间，对加法和数乘封闭。比如三维空间中过原点的平面是子空间，不过原点的平面不是。',
        whyNeedIt: '子空间是研究向量空间结构的基本工具，零空间、列空间都是子空间。',
        formula: 'W \\subseteq V \\text{ 是子空间} \\Leftrightarrow \\vec{0} \\in W, \\quad \\vec{a}, \\vec{b} \\in W \\Rightarrow \\vec{a}+\\vec{b} \\in W, \\quad k\\vec{a} \\in W',
        example: '三维空间中，xy平面 {(x, y, 0)} 是子空间；平面 z=1 不是子空间（不含零向量）。'
      },
      {
        id: 'basis',
        name: '基',
        category: '空间结构',
        definition: '向量空间 V 的基是 V 中线性无关且张成 V 的向量组。基有两个等价定义：(1) 线性无关的生成集；(2) 极大线性无关组。基的个数称为维数。',
        plainTranslation: '基是"向量空间的坐标框架"。基是一组向量，它们线性无关（没有冗余），而且能张成整个空间（足够用）。有了基，空间中任何向量都可以用基的线性组合唯一表示。',
        whyNeedIt: '基是向量空间的"坐标系"，有了基才能用坐标表示向量，进行计算。',
        formula: '\\{\\vec{e}_1, \\ldots, \\vec{e}_n\\} \\text{ 是基} \\Leftrightarrow \\text{线性无关且张成 } V',
        example: '三维空间的标准基是 {e₁, e₂, e₃} = {(1,0,0), (0,1,0), (0,0,1)}。{(1,1), (1,-1)} 是二维空间的另一组基。'
      },
      {
        id: 'dimension',
        name: '维数',
        category: '空间结构',
        definition: '向量空间 V 的维数 dim(V) 是其基中向量的个数。维数是向量空间的"大小"，所有基的向量个数相同。维数等于极大线性无关组中向量的个数。',
        plainTranslation: '维数是"空间有多少个独立方向"。二维空间有2个独立方向，三维空间有3个独立方向。维数告诉我们需要几个坐标来描述空间中的点。',
        whyNeedIt: '维数是向量空间的基本不变量，决定了基的大小和解空间的结构。',
        formula: '\\dim(V) = \\text{基中向量个数} = \\text{极大线性无关组向量个数}',
        example: 'dim(ℝ²) = 2，dim(ℝ³) = 3，dim(所有2×3矩阵) = 6。'
      },
      {
        id: 'span',
        name: '张成空间',
        category: '空间结构',
        definition: '向量组 α₁, α₂, ..., αₘ 的张成空间 span(α₁, ..., αₘ) 是它们所有线性组合构成的集合。张成空间是包含这些向量的最小子空间。',
        plainTranslation: '张成空间是"用一组向量能造出的所有向量"。把向量乘以各种系数再加起来，得到的所有向量就是这个张成空间。张成空间是"这组向量能覆盖的范围"。',
        whyNeedIt: '张成空间描述向量组的"覆盖范围"，是定义基和维数的基础。',
        formula: '\\text{span}(\\vec{\\alpha}_1, \\ldots, \\vec{\\alpha}_m) = \\{k_1\\vec{\\alpha}_1 + \\cdots + k_m\\vec{\\alpha}_m : k_i \\in \\mathbb{R}\\}',
        example: '向量 (1,0) 和 (0,1) 张成整个二维空间；向量 (1,0) 和 (2,0) 只张成x轴。'
      },
      {
        id: 'coordinates',
        name: '向量的坐标',
        category: '基本概念',
        definition: '设 {e₁, e₂, ..., eₙ} 是向量空间的一组基，向量 α 可以唯一表示为 α = x₁e₁ + x₂e₂ + ... + xₙeₙ，则 (x₁, x₂, ..., xₙ) 称为 α 在该基下的坐标。',
        plainTranslation: '坐标是"向量在给定基下的表示"。选定一组基后，任何向量都可以用一组数（坐标）来表示。换一组基，同一个向量会有不同的坐标。',
        whyNeedIt: '坐标使抽象向量具体化，便于计算和比较。',
        formula: '\\vec{\\alpha} = x_1 \\vec{e}_1 + x_2 \\vec{e}_2 + \\cdots + x_n \\vec{e}_n \\Leftrightarrow (x_1, x_2, \\ldots, x_n) \\text{ 是坐标}',
        example: '向量 (3, 4) 在标准基下的坐标是 (3, 4)；在基 {(1,1), (1,-1)} 下，坐标是 (3.5, -0.5)。'
      },
      {
        id: 'inner-product',
        name: '内积',
        category: '内积空间',
        definition: 'n维向量的内积（点积）定义为 α·β = a₁b₁ + a₂b₂ + ... + aₙbₙ = αᵀβ。内积满足：正定性、对称性、线性性。内积是向量"夹角"和"长度"的基础。',
        plainTranslation: '内积是"对应分量相乘再相加"。内积是一个数，不是向量。内积可以计算向量长度、判断垂直（内积为0）、计算夹角。内积是向量几何的核心。',
        whyNeedIt: '内积定义了向量的长度和角度，是欧几里得几何的基础。',
        formula: '\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 + \\cdots + a_n b_n = \\vec{a}^T \\vec{b}',
        example: '(1, 2, 3)·(4, 5, 6) = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32。'
      },
      {
        id: 'vector-length',
        name: '向量的长度',
        category: '内积空间',
        definition: '向量 α = (a₁, ..., aₙ) 的长度（范数）定义为 |α| = √(α·α) = √(a₁² + a₂² + ... + aₙ²)。长度是向量的"大小"度量。',
        plainTranslation: '向量长度是"分量平方和开根号"。长度就是向量"有多长"。在二维，长度就是点到原点的距离。长度为1的向量叫单位向量。',
        whyNeedIt: '长度是向量的基本度量，在距离、单位化、正交化中有重要应用。',
        formula: '|\\vec{a}| = \\sqrt{a_1^2 + a_2^2 + \\cdots + a_n^2} = \\sqrt{\\vec{a} \\cdot \\vec{a}}',
        example: '向量 (3, 4) 的长度 = √(9+16) = √25 = 5。'
      },
      {
        id: 'vector-angle',
        name: '向量的夹角',
        category: '内积空间',
        definition: '两个非零向量 α 和 β 的夹角 θ 满足 cos θ = (α·β) / (|α||β|)。夹角范围是 [0, π]。',
        plainTranslation: '向量夹角通过内积计算：cos θ = 内积/(长度乘积)。夹角为90°时，内积为0，向量垂直。夹角为0°时，向量同向平行；180°时，反向平行。',
        whyNeedIt: '夹角描述向量的方向关系，在相似度计算、正交性判断中有重要应用。',
        formula: '\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}| \\cdot |\\vec{b}|}',
        example: '向量 (1,0) 和 (1,1) 的夹角：cos θ = 1/(1×√2) = 1/√2，所以 θ = 45°。'
      },
      {
        id: 'orthogonality',
        name: '向量的正交',
        category: '内积空间',
        definition: '两个向量 α 和 β 正交（垂直），如果它们的内积为零：α·β = 0。零向量与任何向量正交。',
        plainTranslation: '正交就是"垂直"。两个向量垂直，内积为零。正交是向量之间最"独立"的关系。正交向量组是"最干净"的向量组。',
        whyNeedIt: '正交是向量几何的核心概念，在基、投影、最小二乘法中有重要应用。',
        formula: '\\vec{a} \\perp \\vec{b} \\Leftrightarrow \\vec{a} \\cdot \\vec{b} = 0',
        example: '向量 (1, 0) 和 (0, 1) 正交，因为 1×0 + 0×1 = 0。向量 (1, 1) 和 (1, -1) 正交。'
      },
      {
        id: 'orthonormal-set',
        name: '正交单位向量组',
        category: '内积空间',
        definition: '向量组 {e₁, e₂, ..., eₙ} 称为正交单位向量组（标准正交组），如果 eᵢ·eⱼ = δᵢⱼ（i=j时为1，i≠j时为0）。正交单位向量组是"最好"的基。',
        plainTranslation: '正交单位向量组是"两两垂直且长度都是1"的向量组。这是最理想的基：坐标计算简单，内积就是坐标对应相乘。标准基就是正交单位向量组。',
        whyNeedIt: '正交单位向量组是最理想的基，简化了坐标计算和向量运算。',
        formula: '\\vec{e}_i \\cdot \\vec{e}_j = \\delta_{ij} = \\begin{cases} 1, & i = j \\\\ 0, & i \\neq j \\end{cases}',
        example: '标准基 {e₁, e₂, e₃} = {(1,0,0), (0,1,0), (0,0,1)} 是正交单位向量组。'
      },
      {
        id: 'gram-schmidt',
        name: 'Gram-Schmidt正交化',
        category: '正交化方法',
        definition: 'Gram-Schmidt正交化将线性无关向量组 {α₁, ..., αₙ} 转化为正交向量组 {β₁, ..., βₙ}：β₁ = α₁，βₖ = αₖ - Σᵢ₌₁ᵏ⁻¹ (αₖ·βᵢ)/(βᵢ·βᵢ) βᵢ。',
        plainTranslation: 'Gram-Schmidt正交化是"把斜的向量组变成垂直的"。方法：第一个向量不变；第二个向量减去在第一个向量方向的投影；第三个向量减去在前两个方向的投影...以此类推。',
        whyNeedIt: 'Gram-Schmidt正交化可以从任意基构造正交基，在QR分解中有重要应用。',
        formula: '\\vec{\\beta}_1 = \\vec{\\alpha}_1, \\quad \\vec{\\beta}_k = \\vec{\\alpha}_k - \\sum_{i=1}^{k-1} \\frac{\\vec{\\alpha}_k \\cdot \\vec{\\beta}_i}{\\vec{\\beta}_i \\cdot \\vec{\\beta}_i} \\vec{\\beta}_i',
        example: '向量组 {(1,1), (1,0)}：β₁ = (1,1)，β₂ = (1,0) - (1,0)·(1,1)/2 × (1,1) = (0.5, -0.5)。'
      },
      {
        id: 'orthogonal-complement',
        name: '正交补',
        category: '空间结构',
        definition: '子空间 W 的正交补 W⊥ = {v : v·w = 0, ∀w∈W}，即与 W 中所有向量都正交的向量集合。dim(W) + dim(W⊥) = dim(V)。',
        plainTranslation: '正交补是"与子空间垂直的所有向量"。如果W是一个平面，W⊥就是垂直于这个平面的直线。正交补与原空间"互补"，维数相加等于总维数。',
        whyNeedIt: '正交补在最小二乘法、解空间结构分析中有重要应用。',
        formula: 'W^{\\perp} = \\{\\vec{v} : \\vec{v} \\cdot \\vec{w} = 0, \\forall \\vec{w} \\in W\\}',
        example: '在三维空间中，xy平面 W = {(x,y,0)} 的正交补是 z轴 W⊥ = {(0,0,z)}。'
      },
      {
        id: 'projection',
        name: '向量的投影',
        category: '内积空间',
        definition: '向量 α 在非零向量 β 方向上的投影为 proj_β α = (α·β)/(β·β) β。投影是 α 在 β 方向上的"分量"。',
        plainTranslation: '投影是"向量在某个方向上的影子"。向量α在β方向的投影，就是把α"压"到β所在的直线上。投影长度 = α·β/|β|，投影向量 = (α·β/|β|²)β。',
        whyNeedIt: '投影是正交分解、最小二乘法、信号处理的核心工具。',
        formula: '\\text{proj}_{\\vec{b}} \\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{\\vec{b} \\cdot \\vec{b}} \\vec{b} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2} \\vec{b}',
        example: '(3, 4) 在 (1, 0) 方向的投影 = (3, 0)；在 (1, 1) 方向的投影 = (3.5, 3.5)。'
      },
      {
        id: 'cauchy-schwarz',
        name: 'Cauchy-Schwarz不等式',
        category: '重要定理',
        definition: '对于任意向量 α, β，有 |α·β| ≤ |α||β|。等号成立当且仅当 α 与 β 线性相关。',
        plainTranslation: 'Cauchy-Schwarz不等式说"内积的绝对值不超过长度乘积"。这保证了夹角余弦值在[-1,1]之间。这是向量空间最重要的不等式之一。',
        whyNeedIt: 'Cauchy-Schwarz不等式是证明许多其他不等式和定理的基础。',
        formula: '|\\vec{a} \\cdot \\vec{b}| \\leq |\\vec{a}| \\cdot |\\vec{b}|',
        example: '向量 (1, 2) 和 (3, 4)：|内积| = 11，长度乘积 = √5 × 5 = 5√5 ≈ 11.18，确实 11 < 11.18。'
      },
      {
        id: 'triangle-inequality-vector',
        name: '三角不等式',
        category: '重要定理',
        definition: '对于任意向量 α, β，有 |α + β| ≤ |α| + |β|。等号成立当且仅当 α 与 β 同向。',
        plainTranslation: '三角不等式说"两边之和大于等于第三边"。向量相加后的长度不超过各自长度之和。这和三角形两边之和大于第三边是一样的道理。',
        whyNeedIt: '三角不等式定义了向量范数的基本性质，在分析中有重要应用。',
        formula: '|\\vec{a} + \\vec{b}| \\leq |\\vec{a}| + |\\vec{b}|',
        example: '向量 (1, 0) 和 (0, 1)：|(1,0)+(0,1)| = |(1,1)| = √2 < 1 + 1 = 2。'
      },
      {
        id: 'vector-norm',
        name: '向量范数',
        category: '范数',
        definition: '向量范数是向量"大小"的度量。常用范数：(1) 2-范数 ‖α‖₂ = √(Σaᵢ²)；(2) 1-范数 ‖α‖₁ = Σ|aᵢ|；(3) ∞-范数 ‖α‖∞ = max|aᵢ|。',
        plainTranslation: '向量范数是"向量有多大的度量"。最常用的是2-范数（欧几里得长度），还有1-范数（分量绝对值之和）和∞-范数（最大分量绝对值）。不同范数有不同用途。',
        whyNeedIt: '向量范数在优化、机器学习、数值分析中有广泛应用。',
        formula: '\\|\\vec{a}\\|_2 = \\sqrt{\\sum a_i^2}, \\quad \\|\\vec{a}\\|_1 = \\sum |a_i|, \\quad \\|\\vec{a}\\|_\\infty = \\max |a_i|',
        example: '向量 (3, -4)：‖·‖₂ = 5，‖·‖₁ = 7，‖·‖∞ = 4。'
      },
      {
        id: 'distance-between-vectors',
        name: '向量间的距离',
        category: '内积空间',
        definition: '两个向量 α 和 β 之间的距离定义为 d(α, β) = |α - β| = √(Σ(aᵢ - bᵢ)²)。距离满足非负性、对称性、三角不等式。',
        plainTranslation: '向量间的距离是"差向量的长度"。两个向量相减，得到差向量，差向量的长度就是距离。距离衡量两个向量"差多远"。',
        whyNeedIt: '距离是度量空间的基础，在聚类、分类、相似度计算中有重要应用。',
        formula: 'd(\\vec{a}, \\vec{b}) = |\\vec{a} - \\vec{b}| = \\sqrt{\\sum_{i=1}^{n} (a_i - b_i)^2}',
        example: '(1, 2) 和 (4, 6) 的距离 = |(1-4, 2-6)| = |(-3, -4)| = 5。'
      },
      {
        id: 'cross-product-3d',
        name: '向量积（叉积）',
        category: '向量运算',
        definition: '三维向量 α = (a₁, a₂, a₃) 和 β = (b₁, b₂, b₃) 的向量积 α×β = (a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁)。向量积的结果是向量，垂直于α和β。',
        plainTranslation: '向量积（叉积）是"得到垂直向量的乘法"。两个三维向量的叉积是一个新向量，垂直于原来的两个向量。叉积的长度等于两个向量张成的平行四边形面积。',
        whyNeedIt: '向量积在物理（力矩、角动量）、计算机图形学中有重要应用。',
        formula: '\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}',
        example: '(1, 0, 0) × (0, 1, 0) = (0, 0, 1)。叉积方向用右手定则确定。'
      },
      {
        id: 'scalar-triple-product',
        name: '混合积',
        category: '向量运算',
        definition: '三个向量 α, β, γ 的混合积定义为 (α×β)·γ。混合积的绝对值等于三个向量张成的平行六面体的体积。',
        plainTranslation: '混合积是"叉积后再点积"。混合积是一个数，绝对值等于三个向量张成的平行六面体体积。混合积为零，说明三个向量共面。',
        whyNeedIt: '混合积判断三个向量是否共面，计算体积，在物理和几何中有应用。',
        formula: '(\\vec{a} \\times \\vec{b}) \\cdot \\vec{c} = \\begin{vmatrix} a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\\\ c_1 & c_2 & c_3 \\end{vmatrix}',
        example: '(1,0,0), (0,1,0), (0,0,1) 的混合积 = 1，体积 = 1（单位立方体）。'
      },
      {
        id: 'row-space',
        name: '行空间',
        category: '矩阵相关空间',
        definition: '矩阵 A 的行空间是 A 的行向量张成的子空间。行空间的维数等于矩阵的秩。行空间与 Aᵀ 的列空间相同。',
        plainTranslation: '行空间是"矩阵各行能张成的空间"。把矩阵的每一行看成一个向量，这些向量能张成的所有向量的集合就是行空间。行空间的维数就是秩。',
        whyNeedIt: '行空间在解方程组、矩阵分析中有重要应用。',
        formula: '\\text{行空间}(A) = \\text{span}(\\text{A的行向量})',
        example: '矩阵 [1 2; 2 4] 的行空间是 {(x, 2x)}，是一条直线，维数为1。'
      },
      {
        id: 'column-space',
        name: '列空间',
        category: '矩阵相关空间',
        definition: '矩阵 A 的列空间是 A 的列向量张成的子空间。列空间的维数等于矩阵的秩。列空间是线性变换 Ax 的像空间。',
        plainTranslation: '列空间是"矩阵各列能张成的空间"。把矩阵的每一列看成一个向量，这些向量能张成的所有向量的集合就是列空间。Ax = b 有解当且仅当 b 在列空间中。',
        whyNeedIt: '列空间是线性方程组解的存在性判断的关键，Ax = b 有解当且仅当 b 在列空间中。',
        formula: '\\text{列空间}(A) = \\text{span}(\\text{A的列向量}) = \\{A\\vec{x} : \\vec{x} \\in \\mathbb{R}^n\\}',
        example: '矩阵 [1 0; 0 1] 的列空间是整个二维空间。矩阵 [1 2; 2 4] 的列空间是 {(x, 2x)}。'
      },
      {
        id: 'null-space',
        name: '零空间（核空间）',
        category: '矩阵相关空间',
        definition: '矩阵 A 的零空间是 N(A) = {x : Ax = 0}，即齐次方程组的解空间。零空间的维数等于 n - rank(A)。',
        plainTranslation: '零空间是"被矩阵变成零的所有向量"。Ax = 0 的所有解构成的集合就是零空间。零空间告诉我们矩阵"丢失"了多少维信息。',
        whyNeedIt: '零空间是线性方程组解结构分析的核心，其维数等于自由变量个数。',
        formula: 'N(A) = \\{\\vec{x} : A\\vec{x} = \\vec{0}\\}, \\quad \\dim(N(A)) = n - \\text{rank}(A)',
        example: '矩阵 [1 2; 2 4] 的零空间是 {(−2t, t)}，维数为 2 - 1 = 1。'
      },
      {
        id: 'rank-nullity-theorem',
        name: '秩-零度定理',
        category: '重要定理',
        definition: '对于 m×n 矩阵 A，有 rank(A) + nullity(A) = n，其中 nullity(A) = dim(N(A)) 是零空间的维数。即列空间维数 + 零空间维数 = 列数。',
        plainTranslation: '秩-零度定理说"列空间维数加零空间维数等于列数"。矩阵的列有n个，其中rank(A)个是独立的，剩下n-rank(A)个"自由度"在零空间里。',
        whyNeedIt: '秩-零度定理是线性代数的基本定理，揭示了矩阵四个基本空间的关系。',
        formula: '\\text{rank}(A) + \\dim(N(A)) = n',
        example: '3×4 矩阵，若 rank(A) = 2，则零空间维数 = 4 - 2 = 2。'
      },
      {
        id: 'fundamental-subspaces',
        name: '四个基本子空间',
        category: '空间结构',
        definition: '矩阵 A 的四个基本子空间：(1) 列空间 C(A)；(2) 零空间 N(A)；(3) 行空间 C(Aᵀ)；(4) 左零空间 N(Aᵀ)。它们满足：C(A)⊥N(Aᵀ)，C(Aᵀ)⊥N(A)。',
        plainTranslation: '四个基本子空间是"矩阵的完整画像"。列空间和零空间在定义域，行空间和左零空间在值域。列空间与左零空间正交，行空间与零空间正交。',
        whyNeedIt: '四个基本子空间完整描述了线性变换的结构，是线性代数的核心框架。',
        formula: 'C(A) \\perp N(A^T), \\quad C(A^T) \\perp N(A)',
        example: '对于 A = [1 2; 2 4]：列空间 = {(x, 2x)}，零空间 = {(−2t, t)}，它们正交。'
      },
      {
        id: 'change-of-basis',
        name: '基变换',
        category: '坐标变换',
        definition: '设旧基 {e₁, ..., eₙ} 和新基 {f₁, ..., fₙ}，过渡矩阵 P 的列是新基在旧基下的坐标。向量在新基下的坐标 x\' 与旧坐标 x 的关系：x = Px\'。',
        plainTranslation: '基变换是"换一套坐标系"。过渡矩阵P把新坐标变成旧坐标。换基后，同一个向量有不同的坐标表示。过渡矩阵必须是可逆的。',
        whyNeedIt: '基变换在相似变换、对角化、主成分分析中有重要应用。',
        formula: '\\vec{x}_{\\text{旧}} = P \\vec{x}_{\\text{新}}, \\quad P = [\\vec{f}_1, \\ldots, \\vec{f}_n]',
        example: '旧基 {e₁, e₂}，新基 {e₁+e₂, e₁-e₂}，过渡矩阵 P = [1 1; 1 -1]。'
      },
      {
        id: 'transition-matrix',
        name: '过渡矩阵',
        category: '坐标变换',
        definition: '从旧基到新基的过渡矩阵 P 是新基向量在旧基下坐标排成的矩阵。P 的第 j 列是新基的第 j 个向量在旧基下的坐标。P 必须可逆。',
        plainTranslation: '过渡矩阵是"新基在旧基下的表示"。过渡矩阵的每一列是一个新基向量用旧基表示的坐标。过渡矩阵把新坐标转换成旧坐标。',
        whyNeedIt: '过渡矩阵是基变换的核心工具，在坐标转换中必不可少。',
        formula: 'P = [\\vec{f}_1, \\vec{f}_2, \\ldots, \\vec{f}_n], \\quad \\vec{x}_{\\text{旧}} = P \\vec{x}_{\\text{新}}',
        example: '从标准基到基 {(1,1), (1,-1)} 的过渡矩阵是 [1 1; 1 -1]。'
      },
      {
        id: 'vector-equality',
        name: '向量相等',
        category: '基本概念',
        definition: '两个n维向量 α = (a₁, ..., aₙ) 和 β = (b₁, ..., bₙ) 相等，当且仅当所有对应分量相等：aᵢ = bᵢ 对所有 i。',
        plainTranslation: '向量相等是"每个分量都相等"。两个向量相等，必须每个位置上的数都相同。向量相等是向量方程的基础。',
        whyNeedIt: '向量相等是向量方程和向量运算的基础。',
        formula: '\\vec{a} = \\vec{b} \\Leftrightarrow a_i = b_i, \\forall i',
        example: '(1, 2, 3) = (1, 2, 3)，但 (1, 2, 3) ≠ (1, 2, 4)。'
      },
      {
        id: 'vector-negation',
        name: '向量的负向量',
        category: '向量运算',
        definition: '向量 α = (a₁, ..., aₙ) 的负向量是 -α = (-a₁, ..., -aₙ)。负向量与原向量长度相等，方向相反。',
        plainTranslation: '负向量是"方向相反的向量"。每个分量取相反数。负向量加原向量等于零向量：α + (-α) = 0。',
        whyNeedIt: '负向量定义了向量减法：α - β = α + (-β)。',
        formula: '-\\vec{a} = (-a_1, -a_2, \\ldots, -a_n)',
        example: '(1, -2, 3) 的负向量是 (-1, 2, -3)。'
      },
      {
        id: 'vector-subtraction',
        name: '向量减法',
        category: '向量运算',
        definition: '向量减法定义为 α - β = α + (-β) = (a₁-b₁, ..., aₙ-bₙ)。几何上，α - β 是从 β 的终点指向 α 的终点的向量。',
        plainTranslation: '向量减法是"对应分量相减"，或"加上负向量"。几何意义：α - β 是从β指向α的向量。减法用于计算位移、距离。',
        whyNeedIt: '向量减法用于计算位移、距离、相对位置。',
        formula: '\\vec{a} - \\vec{b} = (a_1-b_1, a_2-b_2, \\ldots, a_n-b_n)',
        example: '(5, 7) - (2, 3) = (3, 4)。从点(2,3)到点(5,7)的位移向量是(3,4)。'
      },
      {
        id: 'parallelogram-law',
        name: '平行四边形法则',
        category: '重要定理',
        definition: '对于任意向量 α, β，有 |α + β|² + |α - β|² = 2(|α|² + |β|²)。这给出了向量长度与内积的关系。',
        plainTranslation: '平行四边形法则是"对角线平方和等于四边平方和"。向量加法和减法形成的平行四边形，两条对角线的平方和等于四条边的平方和。',
        whyNeedIt: '平行四边形法则是内积空间的特征性质，用于判断范数是否由内积诱导。',
        formula: '|\\vec{a} + \\vec{b}|^2 + |\\vec{a} - \\vec{b}|^2 = 2(|\\vec{a}|^2 + |\\vec{b}|^2)',
        example: '向量 (1,0) 和 (0,1)：|(1,1)|² + |(1,-1)|² = 2 + 2 = 4 = 2(1 + 1)。'
      },
      {
        id: 'polarization-identity',
        name: '极化恒等式',
        category: '重要定理',
        definition: '内积可以用范数表示：α·β = (|α + β|² - |α - β|²) / 4。极化恒等式建立了内积与范数的关系。',
        plainTranslation: '极化恒等式是"用长度算内积"。知道向量长度后，可以用这个公式反推内积。这证明了内积完全由范数决定。',
        whyNeedIt: '极化恒等式是内积空间理论的重要工具，建立了范数与内积的联系。',
        formula: '\\vec{a} \\cdot \\vec{b} = \\frac{1}{4}(|\\vec{a} + \\vec{b}|^2 - |\\vec{a} - \\vec{b}|^2)',
        example: '验证：(1,2)·(3,4) = 11，(|(4,6)|² - |(-2,-2)|²)/4 = (52 - 8)/4 = 11。'
      },
      {
        id: 'orthogonal-projection-subspace',
        name: '向子空间的正交投影',
        category: '投影',
        definition: '向量 α 向子空间 W 的正交投影是 W 中离 α 最近的向量。若 W 的正交基为 {e₁, ..., eₖ}，则 proj_W α = Σᵢ (α·eᵢ)eᵢ。',
        plainTranslation: '向子空间的正交投影是"把向量垂直地压到子空间上"。投影是子空间中离原向量最近的点。用正交基计算最简单：各分量投影之和。',
        whyNeedIt: '向子空间的正交投影在最小二乘法、数据压缩中有核心应用。',
        formula: '\\text{proj}_W \\vec{a} = \\sum_{i=1}^{k} (\\vec{a} \\cdot \\vec{e}_i) \\vec{e}_i',
        example: '向量 (1, 2, 3) 向 xy平面的投影 = (1, 2, 0)。'
      },
      {
        id: 'orthogonal-decomposition',
        name: '正交分解',
        category: '投影',
        definition: '任何向量 α 可以正交分解为 α = proj_W α + proj_{W⊥} α，即在子空间 W 上的投影与在正交补上的投影之和。',
        plainTranslation: '正交分解是"把向量拆成垂直的两部分"。一部分在子空间里，另一部分垂直于子空间。就像把力分解成平行和垂直于斜面的两个分量。',
        whyNeedIt: '正交分解是最小二乘法、傅里叶分析的基础。',
        formula: '\\vec{a} = \\text{proj}_W \\vec{a} + \\text{proj}_{W^{\\perp}} \\vec{a}',
        example: '向量 (1, 2, 3) = (1, 2, 0) + (0, 0, 3)，前者在xy平面，后者垂直于xy平面。'
      },
      {
        id: 'vector-application-physics',
        name: '向量应用：物理量',
        category: '应用',
        definition: '向量在物理中表示有大小和方向的量：力、速度、加速度、位移、电场强度、磁感应强度等。向量加法对应力的合成，点积对应做功，叉积对应力矩。',
        plainTranslation: '向量是物理学的"语言"。力、速度、加速度都是向量。向量加法用于力的合成，点积用于计算功（力×位移×cosθ），叉积用于计算力矩。',
        whyNeedIt: '向量是描述物理现象的基本工具，在力学、电磁学中有广泛应用。',
        formula: 'W = \\vec{F} \\cdot \\vec{s}, \\quad \\vec{\\tau} = \\vec{r} \\times \\vec{F}',
        example: '力 F = (3, 4) 作用在位移 s = (1, 0) 上，做功 W = 3×1 + 4×0 = 3。'
      },
      {
        id: 'vector-application-geometry',
        name: '向量应用：几何',
        category: '应用',
        definition: '向量在几何中用于表示点、直线、平面。向量方法可以简洁地表达几何关系：两向量垂直当且仅当点积为零，三点共线当且仅当向量线性相关。',
        plainTranslation: '向量是几何的"代数语言"。用向量可以描述点、线、面，计算距离、角度、面积。向量方法让几何问题变成代数计算。',
        whyNeedIt: '向量方法统一了几何和代数，使几何问题可以系统化求解。',
        formula: '\\text{点到直线距离} = \\frac{|\\vec{AP} \\times \\vec{v}|}{|\\vec{v}|}',
        example: '向量方法证明三角形中线交于一点：三条中线的向量和为零向量。'
      },
      {
        id: 'complex-vector',
        name: '复向量',
        category: '推广',
        definition: '复向量是分量为复数的向量。复向量的内积定义为 α·β = Σ aᵢ b̄ᵢ（注意第二向量取共轭）。复向量的长度 |α| = √(α·ᾱ)。',
        plainTranslation: '复向量是"分量可以是复数"的向量。复向量的内积要取共轭，这样才能保证长度是实数且非负。复向量在量子力学中是基本对象。',
        whyNeedIt: '复向量在量子力学、信号处理、复分析中有重要应用。',
        formula: '\\vec{a} \\cdot \\vec{b} = \\sum_{i=1}^{n} a_i \\overline{b_i}',
        example: '复向量 (1+i, 2-i) 和 (1-i, 2+i) 的内积 = (1+i)(1+i) + (2-i)(2-i) = 2i + 3+4i = 3+6i。'
      },
      {
        id: 'vector-space-isomorphism',
        name: '向量空间同构',
        category: '空间结构',
        definition: '两个向量空间 V 和 W 称为同构，如果存在双射 T: V → W 保持加法和数乘：T(α+β) = T(α)+T(β)，T(kα) = kT(α)。有限维向量空间同构当且仅当维数相等。',
        plainTranslation: '同构是"结构相同"的向量空间。同构的向量空间"长得一样"，只是元素的名字不同。所有n维实向量空间都和 ℝⁿ 同构。',
        whyNeedIt: '同构是向量空间分类的工具，简化了向量空间的研究。',
        formula: 'V \\cong W \\Leftrightarrow \\dim(V) = \\dim(W)',
        example: '所有2×2实矩阵构成的空间与 ℝ⁴ 同构，维数都是4。'
      },
      {
        id: 'schmidt-orthogonalization-detail',
        name: 'Schmidt正交化的具体步骤',
        category: '正交化',
        definition: '给定线性无关向量组 α₁,α₂,...,αₘ，Schmidt正交化步骤：β₁ = α₁；β₂ = α₂ - (α₂,β₁)/(β₁,β₁)·β₁；βₖ = αₖ - Σᵢ₌₁ᵏ⁻¹ (αₖ,βᵢ)/(βᵢ,βᵢ)·βᵢ。单位化：eₖ = βₖ/|βₖ|。',
        plainTranslation: 'Schmidt正交化就像"去重"——每添加一个新向量，就把它在已有方向上的"投影"减掉，只保留"新的方向"部分。先取α₁作为第一个方向；第二个向量α₂减去它在α₁方向上的投影，得到与α₁垂直的β₂；第三个向量减去它在β₁和β₂方向上的投影，得到与两者都垂直的β₃。以此类推。',
        whyNeedIt: 'Schmidt正交化是构造正交基的标准方法，在正交对角化、QR分解、最小二乘法中都有应用。考研中经常需要手动计算正交化结果。',
        formula: '\\beta_k = \\alpha_k - \\sum_{i=1}^{k-1} \\frac{(\\alpha_k, \\beta_i)}{(\\beta_i, \\beta_i)} \\beta_i'
      },
      {
        id: 'linear-dependence-criterion',
        name: '线性相关与线性无关的判别',
        category: '线性相关性',
        definition: '向量组 α₁,...,αₘ 线性相关 ⟺ 存在不全为零的k₁,...,kₘ 使 k₁α₁+...+kₘαₘ = 0 ⟺ r(α₁,...,αₘ) < m ⟺ 某个向量可由其余向量线性表示。线性无关的充要条件：k₁α₁+...+kₘαₘ = 0 ⇒ k₁=...=kₘ=0。',
        plainTranslation: '线性相关就像"团队里有冗余"——某个成员是其他人的"复制品"，去掉也不影响团队的"表达能力"。线性无关就是"人各有用"——每个人的贡献都是不可替代的。判断方法很简单：排成矩阵看秩，秩小于个数就相关，等于个数就无关。',
        whyNeedIt: '线性相关性是线性代数最核心的概念之一，是判断向量组是否"精简"、空间维数、方程组解的个数等问题的理论基础。',
        formula: '\\alpha_1,\\ldots,\\alpha_m \\text{线性相关} \\Leftrightarrow r(\\alpha_1,\\ldots,\\alpha_m) < m'
      },
      {
        id: 'maximal-independent-set',
        name: '极大线性无关组',
        category: '线性相关性',
        definition: '向量组T中的部分组 α₁,...,αᵣ 称为极大线性无关组，若(1) α₁,...,αᵣ 线性无关；(2) T中任一向量都可由 α₁,...,αᵣ 线性表示。极大线性无关组所含向量个数即为向量组的秩。',
        plainTranslation: '极大线性无关组就像"最小核心团队"——人数最少但能力最强，能代表整个团队。任何其他成员都能被核心团队"组合出来"。核心团队的人数就是"秩"——向量组实际能独立贡献的维数。',
        whyNeedIt: '极大线性无关组是理解向量组秩的直观方式，也是化简向量组、求秩、求基的标准方法。考研中常考极大无关组的求解。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter-26',
    name: '第二十六章 线性方程组',
    concepts: [
      {
        id: 'linear-equations-definition',
        name: '线性方程组的定义',
        category: '基本概念',
        definition: '线性方程组是由若干个线性方程联立组成的系统。一般形式为：a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ = b₁, ..., aₘ₁x₁ + aₘ₂x₂ + ... + aₘₙxₙ = bₘ。可用矩阵形式表示为 Ax = b。',
        plainTranslation: '线性方程组是"多个一次方程联立求解"。每个方程都是一次方程（变量只有一次方，没有乘除）。线性方程组是最基本的方程组，是线性代数的核心问题之一。',
        whyNeedIt: '线性方程组是科学计算的核心问题，在工程、物理、经济等领域有广泛应用。',
        formula: '\\begin{cases} a_{11}x_1 + a_{12}x_2 + \\cdots + a_{1n}x_n = b_1 \\\\ a_{21}x_1 + a_{22}x_2 + \\cdots + a_{2n}x_n = b_2 \\\\ \\cdots \\cdots \\\\ a_{m1}x_1 + a_{m2}x_2 + \\cdots + a_{mn}x_n = b_m \\end{cases}',
        example: '方程组 {2x + y = 5; x - y = 1} 是一个二元一次方程组，解为 x = 2, y = 1。'
      },
      {
        id: 'homogeneous-equations',
        name: '齐次线性方程组',
        category: '基本概念',
        definition: '齐次线性方程组是常数项全为零的线性方程组：Ax = 0。齐次方程组总有零解（平凡解），有非零解当且仅当 rank(A) < n。',
        plainTranslation: '齐次方程组是"右边全是0"的方程组。齐次方程组永远有零解（所有未知数都是0）。有非零解的条件是系数矩阵的秩小于未知数个数，即有"自由变量"。',
        whyNeedIt: '齐次方程组的解空间是矩阵的零空间，在特征值问题、微分方程中有重要应用。',
        formula: 'A\\vec{x} = \\vec{0}, \\quad \\text{有非零解} \\Leftrightarrow \\text{rank}(A) < n',
        example: '方程组 {x + y = 0; 2x + 2y = 0} 有非零解，如 x = 1, y = -1。'
      },
      {
        id: 'nonhomogeneous-equations',
        name: '非齐次线性方程组',
        category: '基本概念',
        definition: '非齐次线性方程组是常数项不全为零的线性方程组：Ax = b（b ≠ 0）。非齐次方程组的解结构：通解 = 特解 + 对应齐次方程组的通解。',
        plainTranslation: '非齐次方程组是"右边不全是0"的方程组。非齐次方程组可能无解、有唯一解或有无数解。解的结构是：一个特解加上齐次方程的通解。',
        whyNeedIt: '非齐次方程组是实际问题中最常见的形式，解的结构揭示了线性系统的本质。',
        formula: 'A\\vec{x} = \\vec{b}, \\quad \\vec{b} \\neq \\vec{0}',
        example: '方程组 {x + y = 3; x - y = 1} 是非齐次的，有唯一解 x = 2, y = 1。'
      },
      {
        id: 'solution-set',
        name: '解集',
        category: '基本概念',
        definition: '线性方程组的解集是所有满足方程组的解的集合。解集可以是空集（无解）、单点集（唯一解）或无限集（无穷多解）。',
        plainTranslation: '解集是"所有解放在一起的集合"。解集可能是空的（无解）、只有一个点（唯一解）、或者有无数个点（无穷多解）。解集的结构由系数矩阵和增广矩阵的秩决定。',
        whyNeedIt: '解集是方程组求解的目标，理解解集结构是线性代数的核心。',
        formula: '\\text{解集} = \\{\\vec{x} : A\\vec{x} = \\vec{b}\\}',
        example: '方程组 {x + y = 1} 的解集是 {(t, 1-t) : t ∈ ℝ}，是一条直线。'
      },
      {
        id: 'solution-existence-uniqueness',
        name: '解的存在性与唯一性',
        category: '基本定理',
        definition: '线性方程组 Ax = b 有解当且仅当 rank(A) = rank([A|b])。有唯一解当且仅当 rank(A) = rank([A|b]) = n。有无穷多解当且仅当 rank(A) = rank([A|b]) < n。',
        plainTranslation: '解的存在性和唯一性由秩决定：系数矩阵秩等于增广矩阵秩，有解；等于未知数个数，唯一解；小于未知数个数，无穷多解。这是判断解情况的"黄金法则"。',
        whyNeedIt: '这是线性方程组理论的核心定理，给出了判断解情况的充要条件。',
        formula: '\\text{rank}(A) = \\text{rank}([A|b]) \\Leftrightarrow \\text{有解}',
        example: '方程组 {x + y = 1; 2x + 2y = 3}：rank(A) = 1, rank([A|b]) = 2，无解。'
      },
      {
        id: 'gaussian-elimination',
        name: '高斯消元法',
        category: '求解方法',
        definition: '高斯消元法是通过初等行变换将增广矩阵化为行阶梯形，然后回代求解的方法。步骤包括：消元（化阶梯形）和回代（求未知数）。',
        plainTranslation: '高斯消元法是"消元求解的标准方法"。先把增广矩阵化成阶梯形（消元），然后从最后一个方程开始，一个一个求出未知数（回代）。这是解方程组最基本的方法。',
        whyNeedIt: '高斯消元法是求解线性方程组的基本算法，在数值计算中有重要地位。',
        formula: '[A|b] \\xrightarrow{\\text{行变换}} \\text{行阶梯形} \\xrightarrow{\\text{回代}} \\text{解}',
        example: '解 {x + y = 3; 2x - y = 0}：增广矩阵 [1 1 | 3; 2 -1 | 0] → [1 1 | 3; 0 -3 | -6] → x = 1, y = 2。'
      },
      {
        id: 'gauss-jordan-elimination',
        name: '高斯-约当消元法',
        category: '求解方法',
        definition: '高斯-约当消元法是将增广矩阵化为行最简形的方法。与高斯消元法不同，它继续消元直到主元上方元素也为零，可直接读出解。',
        plainTranslation: '高斯-约当消元法是"消元到底的方法"。不仅消去主元下方的元素，还消去上方的元素，直到每列只有一个主元。结果可以直接读出解，不需要回代。',
        whyNeedIt: '高斯-约当消元法便于求逆矩阵和判断解的结构。',
        formula: '[A|b] \\xrightarrow{\\text{行变换}} \\text{行最简形} \\Rightarrow \\text{直接读解}',
        example: '解 {x + y = 3; 2x - y = 0}：[1 1 | 3; 2 -1 | 0] → [1 0 | 1; 0 1 | 2]，直接读出 x = 1, y = 2。'
      },
      {
        id: 'back-substitution',
        name: '回代法',
        category: '求解方法',
        definition: '回代法是求解上三角方程组的方法：从最后一个方程开始，依次求出每个未知数的值，代入上一个方程继续求解。',
        plainTranslation: '回代法是"从下往上求"的方法。方程组化成上三角形式后，最后一个方程只有一个未知数，直接求出；然后代入倒数第二个方程，求出下一个未知数，以此类推。',
        whyNeedIt: '回代法是高斯消元法的核心步骤，在LU分解求解中有重要应用。',
        formula: 'x_n = b_n/a_{nn}, \\quad x_i = (b_i - \\sum_{j=i+1}^{n} a_{ij}x_j)/a_{ii}',
        example: '上三角方程组 {x + y = 3; 0 + 2y = 4}：先求 y = 2，再代入得 x = 1。'
      },
      {
        id: 'forward-substitution',
        name: '前代法',
        category: '求解方法',
        definition: '前代法是求解下三角方程组的方法：从第一个方程开始，依次求出每个未知数的值，代入下一个方程继续求解。',
        plainTranslation: '前代法是"从上往下求"的方法。方程组是下三角形式时，第一个方程只有一个未知数，直接求出；然后代入第二个方程，求出下一个未知数，以此类推。',
        whyNeedIt: '前代法在LU分解求解下三角方程组时有重要应用。',
        formula: 'x_1 = b_1/a_{11}, \\quad x_i = (b_i - \\sum_{j=1}^{i-1} a_{ij}x_j)/a_{ii}',
        example: '下三角方程组 {2x = 4; x + 3y = 7}：先求 x = 2，再代入得 y = (7-2)/3 = 5/3。'
      },
      {
        id: 'pivot-element',
        name: '主元',
        category: '消元概念',
        definition: '主元是消元过程中用于消去其他行元素的基准元素。选主元的方法包括：部分选主元（列主元）和全选主元，用于提高数值稳定性。',
        plainTranslation: '主元是"消元时的基准"。用主元所在行消去其他行的对应元素。选主元很重要：选绝对值大的元素当主元，可以减少计算误差。',
        whyNeedIt: '主元选择影响数值稳定性，选主元是数值线性代数的重要技术。',
        formula: '\\text{主元} = a_{kk}^{(k)}, \\quad \\text{选主元：} |a_{ik}^{(k)}| \\text{ 最大}',
        example: '消元时，选列中绝对值最大的元素作为主元，可以避免除以小数带来的误差放大。'
      },
      {
        id: 'pivot-selection',
        name: '选主元策略',
        category: '消元概念',
        definition: '选主元策略包括：(1) 部分选主元（列主元）：在当前列选绝对值最大的元素；(2) 全选主元：在剩余子矩阵中选绝对值最大的元素。选主元避免除以接近零的数。',
        plainTranslation: '选主元是"找最大的元素当基准"。部分选主元只在当前列找，全选主元在整个剩余矩阵找。选主元可以避免除以很小的数，减少计算误差。',
        whyNeedIt: '选主元策略是保证数值稳定性的关键技术，在实际计算中必不可少。',
        formula: '\\text{部分选主元：} \\max_{i \\geq k} |a_{ik}^{(k)}|',
        example: '矩阵 [0.001 1; 1 1] 消元时，应交换两行使主元为1，避免除以0.001。'
      },
      {
        id: 'free-variable',
        name: '自由变量',
        category: '解的结构',
        definition: '当 rank(A) < n 时，有 n - rank(A) 个自由变量。自由变量可以取任意值，其他变量（基本变量）由自由变量表示。',
        plainTranslation: '自由变量是"可以随便取值的变量"。当方程个数少于未知数个数时，有些变量没有约束，可以自由选择。自由变量的个数 = 未知数个数 - 秩。',
        whyNeedIt: '自由变量决定了解空间的维数，是理解无穷多解结构的关键。',
        formula: '\\text{自由变量个数} = n - \\text{rank}(A)',
        example: '方程组 {x + y + z = 1} 有2个自由变量，解为 (x, y, 1-x-y)，x 和 y 可自由取值。'
      },
      {
        id: 'basic-variable',
        name: '基本变量',
        category: '解的结构',
        definition: '基本变量（主元变量）是用自由变量表示的变量。每个主元对应一个基本变量，基本变量的值由自由变量的值唯一确定。',
        plainTranslation: '基本变量是"被约束的变量"。基本变量由方程决定，不能自由选择。基本变量的个数等于秩，也等于主元的个数。',
        whyNeedIt: '基本变量与自由变量的区分是理解解结构的基础。',
        formula: '\\text{基本变量个数} = \\text{rank}(A)',
        example: '方程组 {x + y + z = 1} 中，若选 z 为基本变量，则 z = 1 - x - y，由 x, y 决定。'
      },
      {
        id: 'general-solution',
        name: '通解',
        category: '解的结构',
        definition: '线性方程组的通解是包含所有解的表达式。对于非齐次方程组，通解 = 特解 + 齐次方程通解。通解用自由变量表示所有可能的解。',
        plainTranslation: '通解是"包含所有解的公式"。通解用自由变量表示，自由变量取不同值就得到不同的解。通解给出了方程组解的"全景图"。',
        whyNeedIt: '通解完整描述了解集，是求解的最终目标。',
        formula: '\\vec{x} = \\vec{x}_p + \\sum_{i=1}^{k} t_i \\vec{v}_i',
        example: '方程组 {x + y + z = 1} 的通解：(t, s, 1-t-s)，t, s 为任意实数。'
      },
      {
        id: 'particular-solution',
        name: '特解',
        category: '解的结构',
        definition: '特解是满足非齐次方程组 Ax = b 的任意一个解。特解不唯一，但任何特解都可以用来构造通解。',
        plainTranslation: '特解是"随便找一个满足方程的解"。特解不需要是最简的或特殊的，只要满足方程就行。通解 = 特解 + 齐次解。',
        whyNeedIt: '特解是构造非齐次方程组通解的基础。',
        formula: 'A\\vec{x}_p = \\vec{b}',
        example: '方程组 {x + y = 3} 的特解可以是 (1, 2)、(0, 3)、(3, 0) 等任意一个。'
      },
      {
        id: 'fundamental-solution-set',
        name: '基础解系',
        category: '解的结构',
        definition: '齐次方程组 Ax = 0 的基础解系是解空间的一组基。基础解系包含 n - rank(A) 个线性无关的解向量，它们的线性组合给出所有解。',
        plainTranslation: '基础解系是"解空间的基"。基础解系是一组线性无关的解，它们的线性组合可以表示所有解。基础解系的向量个数 = 自由变量个数。',
        whyNeedIt: '基础解系给出了齐次方程组解空间的完整描述。',
        formula: '\\text{基础解系} = \\{\\vec{v}_1, \\ldots, \\vec{v}_{n-r}\\}, \\quad \\text{通解} = \\sum t_i \\vec{v}_i',
        example: '方程组 {x + y + z = 0} 的基础解系：{(1, 0, -1), (0, 1, -1)}，通解 = t₁(1,0,-1) + t₂(0,1,-1)。'
      },
      {
        id: 'solution-space',
        name: '解空间',
        category: '解的结构',
        definition: '齐次方程组 Ax = 0 的解空间是所有解构成的子空间，维数为 n - rank(A)。解空间就是矩阵 A 的零空间（核空间）。',
        plainTranslation: '解空间是"所有解组成的向量空间"。齐次方程的解空间是一个子空间，可以相加、数乘。解空间的维数 = 自由变量个数。',
        whyNeedIt: '解空间的概念统一了齐次方程组解的几何描述。',
        formula: '\\text{解空间} = N(A) = \\{\\vec{x} : A\\vec{x} = \\vec{0}\\}',
        example: '方程组 {x + y = 0} 的解空间是 {(t, -t)}，是一条过原点的直线。'
      },
      {
        id: 'solution-structure-theorem',
        name: '解的结构定理',
        category: '基本定理',
        definition: '非齐次方程组 Ax = b 的通解结构：若 xₚ 是一个特解，xₕ 是对应齐次方程的通解，则 Ax = b 的通解为 x = xₚ + xₕ。',
        plainTranslation: '解的结构定理说"非齐次通解 = 特解 + 齐次通解"。找一个特解，加上齐次方程的所有解，就得到非齐次方程的所有解。',
        whyNeedIt: '解的结构定理是非齐次方程组求解的理论基础。',
        formula: '\\vec{x} = \\vec{x}_p + \\vec{x}_h, \\quad A\\vec{x}_p = \\vec{b}, \\quad A\\vec{x}_h = \\vec{0}',
        example: '方程组 {x + y = 3}：特解 (1, 2)，齐次通解 t(1, -1)，通解 (1+t, 2-t)。'
      },
      {
        id: 'cramers-rule-detail',
        name: '克拉默法则（详细）',
        category: '求解方法',
        definition: '对于n元线性方程组 Ax = b，若 |A| ≠ 0，则唯一解为 xⱼ = |Aⱼ|/|A|，其中 Aⱼ 是将 A 的第 j 列换成 b 得到的矩阵。',
        plainTranslation: '克拉默法则是"用行列式解方程组"。每个未知数的解是一个分数：分母是系数矩阵行列式，分子是把常数项替换该未知数系数列后的行列式。理论漂亮但计算量大。',
        whyNeedIt: '克拉默法则给出了线性方程组解的显式公式，在理论分析中有重要价值。',
        formula: 'x_j = \\frac{|A_j|}{|A|}, \\quad A_j = [a_1, \\ldots, a_{j-1}, \\vec{b}, a_{j+1}, \\ldots, a_n]',
        example: '方程组 {2x + y = 5; 3x + 2y = 8}：|A| = 1，|A₁| = 2，|A₂| = 1，解 x = 2, y = 1。'
      },
      {
        id: 'matrix-inversion-method',
        name: '矩阵求逆法',
        category: '求解方法',
        definition: '对于方阵 A，若 A 可逆，则方程组 Ax = b 的解为 x = A⁻¹b。求逆可以通过伴随矩阵法或初等变换法实现。',
        plainTranslation: '矩阵求逆法是"用逆矩阵解方程"。如果系数矩阵可逆，解就是逆矩阵乘以常数向量。求逆矩阵可以用伴随矩阵法或初等变换法。',
        whyNeedIt: '矩阵求逆法在理论分析和某些实际计算中有应用。',
        formula: '\\vec{x} = A^{-1}\\vec{b}',
        example: '方程组 {x + y = 3; x - y = 1}：A = [1 1; 1 -1]，A⁻¹ = [0.5 0.5; 0.5 -0.5]，x = A⁻¹(3,1) = (2, 1)。'
      },
      {
        id: 'lu-solve',
        name: 'LU分解求解',
        category: '求解方法',
        definition: '将系数矩阵 A 分解为 A = LU，然后分两步求解：先解 Ly = b（前代），再解 Ux = y（回代）。LU分解适合求解多个右端项的方程组。',
        plainTranslation: 'LU分解求解是"把方程组拆成两步"。先把矩阵分解成下三角乘上三角，然后先解下三角方程（前代），再解上三角方程（回代）。适合多次求解不同右端项。',
        whyNeedIt: 'LU分解是求解大规模线性方程组的高效方法，在数值计算中广泛应用。',
        formula: 'A = LU, \\quad L\\vec{y} = \\vec{b}, \\quad U\\vec{x} = \\vec{y}',
        example: '解 Ax = b₁, Ax = b₂, ..., 只需一次LU分解，然后对每个 bᵢ 做前代回代。'
      },
      {
        id: 'iterative-methods',
        name: '迭代法',
        category: '求解方法',
        definition: '迭代法是通过不断逼近来求解线性方程组的方法。常用方法包括：Jacobi迭代、Gauss-Seidel迭代、SOR（逐次超松弛）等。适合大型稀疏方程组。',
        plainTranslation: '迭代法是"一步步逼近解"。从一个初始猜测开始，不断修正，直到足够接近真解。迭代法适合大型稀疏方程组，存储需求小。',
        whyNeedIt: '迭代法是求解大型稀疏线性方程组的主要方法，在科学计算中不可或缺。',
        formula: '\\vec{x}^{(k+1)} = M\\vec{x}^{(k)} + \\vec{c}',
        example: 'Jacobi迭代：xᵢ⁽ᵏ⁺¹⁾ = (bᵢ - Σⱼ≠ᵢ aᵢⱼxⱼ⁽ᵏ⁾)/aᵢᵢ，每步用上一步的值更新。'
      },
      {
        id: 'jacobi-iteration',
        name: 'Jacobi迭代',
        category: '迭代方法',
        definition: 'Jacobi迭代：xᵢ⁽ᵏ⁺¹⁾ = (bᵢ - Σⱼ≠ᵢ aᵢⱼxⱼ⁽ᵏ⁾)/aᵢᵢ。每次迭代用上一步的所有值更新。收敛条件：系数矩阵严格对角占优或对称正定。',
        plainTranslation: 'Jacobi迭代是"同时更新所有变量"。每步用上一步的值计算新值，所有变量同时更新。优点是容易并行计算，缺点是收敛较慢。',
        whyNeedIt: 'Jacobi迭代是最简单的迭代法，适合并行计算。',
        formula: 'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j \\neq i} a_{ij}x_j^{(k)}\\right)',
        example: '方程 {4x + y = 1; x + 3y = 2}：Jacobi迭代 x⁽ᵏ⁺¹⁾ = (1-y⁽ᵏ⁾)/4, y⁽ᵏ⁺¹⁾ = (2-x⁽ᵏ⁾)/3。'
      },
      {
        id: 'gauss-seidel-iteration',
        name: 'Gauss-Seidel迭代',
        category: '迭代方法',
        definition: 'Gauss-Seidel迭代：xᵢ⁽ᵏ⁺¹⁾ = (bᵢ - Σⱼ<ᵢ aᵢⱼxⱼ⁽ᵏ⁺¹⁾ - Σⱼ>ᵢ aᵢⱼxⱼ⁽ᵏ⁾)/aᵢᵢ。用最新值更新，收敛比Jacobi快。',
        plainTranslation: 'Gauss-Seidel迭代是"用最新值更新"。算出新值马上用，不用等下一步。比Jacobi收敛快，但不易并行。',
        whyNeedIt: 'Gauss-Seidel迭代是常用的迭代法，收敛速度比Jacobi快。',
        formula: 'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j < i} a_{ij}x_j^{(k+1)} - \\sum_{j > i} a_{ij}x_j^{(k)}\\right)',
        example: '方程 {4x + y = 1; x + 3y = 2}：先算 x⁽ᵏ⁺¹⁾，再用新x算 y⁽ᵏ⁺¹⁾。'
      },
      {
        id: 'sor-method',
        name: 'SOR方法',
        category: '迭代方法',
        definition: 'SOR（逐次超松弛）是Gauss-Seidel的加速方法：xᵢ⁽ᵏ⁺¹⁾ = (1-ω)xᵢ⁽ᵏ⁾ + ω·Gauss-Seidel值。松弛因子 ω ∈ (0,2)，最优 ω 可显著加速收敛。',
        plainTranslation: 'SOR是"加速的Gauss-Seidel"。在Gauss-Seidel基础上加一个"松弛因子"，可以更快收敛。选好松弛因子是关键，通常在1到2之间。',
        whyNeedIt: 'SOR是Gauss-Seidel的重要改进，收敛速度可以显著提高。',
        formula: 'x_i^{(k+1)} = (1-\\omega)x_i^{(k)} + \\frac{\\omega}{a_{ii}}\\left(b_i - \\sum_{j < i} a_{ij}x_j^{(k+1)} - \\sum_{j > i} a_{ij}x_j^{(k)}\\right)',
        example: '当 ω = 1 时，SOR就是Gauss-Seidel；ω > 1 是超松弛，ω < 1 是低松弛。'
      },
      {
        id: 'convergence-condition',
        name: '迭代收敛条件',
        category: '迭代方法',
        definition: '迭代法收敛的充要条件是迭代矩阵的谱半径 ρ(M) < 1。充分条件包括：系数矩阵严格对角占优、对称正定等。',
        plainTranslation: '迭代收敛条件是"迭代矩阵特征值都小于1"。如果系数矩阵对角线元素占优（对角线绝对值大于同行其他元素绝对值之和），迭代一定收敛。',
        whyNeedIt: '收敛条件是判断迭代法是否可用的依据。',
        formula: '\\rho(M) < 1 \\Leftrightarrow \\text{收敛}',
        example: '矩阵 [4 1; 1 3] 严格对角占优，Jacobi和Gauss-Seidel都收敛。'
      },
      {
        id: 'condition-number-equations',
        name: '方程组的条件数',
        category: '数值分析',
        definition: '线性方程组的条件数 cond(A) = ‖A‖·‖A⁻¹‖ 衡量解对扰动的敏感程度。条件数大，方程组"病态"，小扰动会引起大误差。',
        plainTranslation: '条件数是"方程组有多敏感的度量"。条件数大，输入稍有误差，输出就差很远。条件数小的方程组"健康"，计算稳定。',
        whyNeedIt: '条件数是评估数值计算稳定性的核心指标。',
        formula: '\\text{cond}(A) = \\|A\\| \\cdot \\|A^{-1}\\|',
        example: 'Hilbert矩阵条件数很大，解方程组时误差会被放大很多倍。'
      },
      {
        id: 'ill-conditioned-system',
        name: '病态方程组',
        category: '数值分析',
        definition: '病态方程组是条件数很大的方程组。病态方程组对输入误差非常敏感，数值求解困难。典型例子是Hilbert矩阵对应的方程组。',
        plainTranslation: '病态方程组是"数值上不稳定"的方程组。系数稍有变化，解就剧烈变化。病态方程组很难用计算机精确求解，需要特殊方法。',
        whyNeedIt: '病态方程组是数值计算的难点，需要特殊处理。',
        formula: '\\text{cond}(A) \\gg 1 \\Rightarrow \\text{病态}',
        example: '方程组 {x + y = 2; x + 1.0001y = 2.0001} 是病态的，解对系数非常敏感。'
      },
      {
        id: 'residual',
        name: '残差',
        category: '数值分析',
        definition: '残差 r = b - Ax̂ 是近似解 x̂ 与精确解的偏差度量。残差小说明近似解"满足方程的程度好"，但残差小不一定代表误差小。',
        plainTranslation: '残差是"把近似解放回方程，看差多少"。残差 = 右边 - 系数矩阵×近似解。残差小表示近似解满足方程的程度好，但病态问题中残差小不代表误差小。',
        whyNeedIt: '残差是检验数值解质量的基本指标。',
        formula: '\\vec{r} = \\vec{b} - A\\hat{\\vec{x}}',
        example: '近似解 x̂ = (1.01, 0.99)，残差 r = b - Ax̂ = (0.01, -0.01)。'
      },
      {
        id: 'error-analysis',
        name: '误差分析',
        category: '数值分析',
        definition: '误差分析研究输入误差和舍入误差对解的影响。误差上界：‖Δx‖/‖x‖ ≤ cond(A)·(‖ΔA‖/‖A‖ + ‖Δb‖/‖b‖)。',
        plainTranslation: '误差分析是"研究误差如何传播"。解的相对误差不超过条件数乘以输入的相对误差。条件数大，误差会被放大很多。',
        whyNeedIt: '误差分析是数值计算的理论基础，指导算法选择。',
        formula: '\\frac{\\|\\Delta\\vec{x}\\|}{\\|\\vec{x}\\|} \\leq \\text{cond}(A) \\cdot \\left(\\frac{\\|\\Delta A\\|}{\\|A\\|} + \\frac{\\|\\Delta\\vec{b}\\|}{\\|\\vec{b}\\|}\\right)',
        example: '若 cond(A) = 10⁶，输入误差 10⁻⁸，解的误差可达 10⁻²。'
      },
      {
        id: 'overdetermined-system',
        name: '超定方程组',
        category: '特殊方程组',
        definition: '超定方程组是方程个数多于未知数个数的方程组（m > n）。超定方程组一般无精确解，用最小二乘法求近似解。',
        plainTranslation: '超定方程组是"方程太多，未知数太少"。方程个数比未知数多，一般找不到精确解。用最小二乘法找一个"最接近"的解。',
        whyNeedIt: '超定方程组在数据拟合、测量平差中有广泛应用。',
        formula: 'A_{m \\times n}\\vec{x} = \\vec{b}, \\quad m > n',
        example: '数据拟合：3个点拟合一条直线，得到超定方程组，用最小二乘法求解。'
      },
      {
        id: 'underdetermined-system',
        name: '欠定方程组',
        category: '特殊方程组',
        definition: '欠定方程组是方程个数少于未知数个数的方程组（m < n）。欠定方程组若有解，则有无穷多解。',
        plainTranslation: '欠定方程组是"方程太少，未知数太多"。方程个数比未知数少，约束不够，如果无矛盾就有无数解。',
        whyNeedIt: '欠定方程组在优化问题、信号处理中有重要应用。',
        formula: 'A_{m \\times n}\\vec{x} = \\vec{b}, \\quad m < n',
        example: '方程组 {x + y + z = 1} 是欠定的，解是三维空间中的一个平面。'
      },
      {
        id: 'least-squares-solution',
        name: '最小二乘解',
        category: '特殊方程组',
        definition: '超定方程组 Ax ≈ b 的最小二乘解是使 ‖Ax - b‖² 最小的解。正规方程：AᵀAx = Aᵀb。解为 x = (AᵀA)⁻¹Aᵀb（当 AᵀA 可逆时）。',
        plainTranslation: '最小二乘解是"让误差平方和最小的解"。超定方程组没有精确解时，找一个让残差平方和最小的解。最小二乘解在数据拟合中是标准方法。',
        whyNeedIt: '最小二乘法是数据拟合、参数估计的核心方法。',
        formula: '\\hat{\\vec{x}} = (A^T A)^{-1} A^T \\vec{b} = A^+ \\vec{b}',
        example: '拟合直线 y = ax + b：建立超定方程组，最小二乘解给出最佳 a, b。'
      },
      {
        id: 'normal-equations',
        name: '正规方程',
        category: '特殊方程组',
        definition: '正规方程 AᵀAx = Aᵀb 是最小二乘问题的等价形式。正规方程的解就是最小二乘解。正规方程的系数矩阵 AᵀA 是对称的。',
        plainTranslation: '正规方程是"最小二乘问题的方程形式"。把超定方程组转化成正规方程，解正规方程就得到最小二乘解。正规方程的矩阵是对称的，便于求解。',
        whyNeedIt: '正规方程是求解最小二乘问题的经典方法。',
        formula: 'A^T A \\vec{x} = A^T \\vec{b}',
        example: '超定方程组 Ax ≈ b 的正规方程：AᵀAx = Aᵀb。'
      },
      {
        id: 'qr-least-squares',
        name: 'QR分解求最小二乘',
        category: '特殊方程组',
        definition: '用QR分解求解最小二乘：A = QR，则 AᵀAx = Aᵀb 变为 RᵀRx = RᵀQᵀb，即 Rx = Qᵀb。QR分解比正规方程更稳定。',
        plainTranslation: 'QR分解求最小二乘是"更稳定的算法"。把A分解成正交矩阵乘上三角矩阵，然后解上三角方程。比正规方程数值稳定性好。',
        whyNeedIt: 'QR分解是求解最小二乘问题的推荐方法，数值稳定性好。',
        formula: 'A = QR, \\quad R\\vec{x} = Q^T\\vec{b}',
        example: '对 A 做QR分解，然后解 Rx = Qᵀb，得到最小二乘解。'
      },
      {
        id: 'svd-least-squares',
        name: 'SVD求最小二乘',
        category: '特殊方程组',
        definition: '用奇异值分解求解最小二乘：A = UΣVᵀ，则最小二乘解为 x = VΣ⁺Uᵀb = A⁺b。SVD方法最稳定，可以处理秩亏情况。',
        plainTranslation: 'SVD求最小二乘是"最稳定的方法"。用奇异值分解，即使矩阵不满秩也能求出最小范数解。SVD是最稳健的方法，但计算量大。',
        whyNeedIt: 'SVD是求解最小二乘问题最稳定的方法，可以处理病态和秩亏问题。',
        formula: '\\hat{\\vec{x}} = V\\Sigma^+ U^T \\vec{b} = A^+ \\vec{b}',
        example: '对 A 做SVD分解，x = VΣ⁺Uᵀb 给出最小范数最小二乘解。'
      },
      {
        id: 'sparse-systems',
        name: '稀疏方程组',
        category: '特殊方程组',
        definition: '稀疏方程组是系数矩阵大部分元素为零的方程组。稀疏方程组用特殊存储格式和算法（如稀疏LU、共轭梯度法）求解，避免存储和计算零元素。',
        plainTranslation: '稀疏方程组是"系数矩阵大部分是0"的方程组。稀疏矩阵不用存储所有元素，只存非零元素。求解时利用稀疏性，大大节省存储和计算。',
        whyNeedIt: '稀疏方程组在大规模科学计算中非常常见，需要专门的求解方法。',
        formula: 'A \\text{ 稀疏} \\Rightarrow \\text{大部分 } a_{ij} = 0',
        example: '有限元方法产生的方程组通常是稀疏的，每行只有少数非零元素。'
      },
      {
        id: 'conjugate-gradient',
        name: '共轭梯度法',
        category: '迭代方法',
        definition: '共轭梯度法是求解对称正定方程组 Ax = b 的高效迭代法。每步沿共轭方向搜索，理论上n步收敛。适合大型稀疏对称正定方程组。',
        plainTranslation: '共轭梯度法是"专攻对称正定矩阵的迭代法"。每一步选择一个与之前方向"共轭"的新方向，保证不重复搜索。理论上n步就到精确解，实际中很快收敛。',
        whyNeedIt: '共轭梯度法是求解大型稀疏对称正定方程组的首选方法。',
        formula: '\\vec{p}_0 = \\vec{r}_0 = \\vec{b} - A\\vec{x}_0, \\quad \\alpha_k = \\frac{\\vec{r}_k^T \\vec{r}_k}{\\vec{p}_k^T A \\vec{p}_k}',
        example: '求解大型稀疏对称正定方程组，共轭梯度法比直接法快很多。'
      },
      {
        id: 'preconditioning',
        name: '预处理',
        category: '迭代方法',
        definition: '预处理是改善方程组条件数的技术，用 M⁻¹Ax = M⁻¹b 代替原方程组。好的预处理器 M 使 M⁻¹A 条件数小，加速迭代收敛。',
        plainTranslation: '预处理是"改善方程组条件"的技术。找一个矩阵M，让新方程组 M⁻¹Ax = M⁻¹b 更容易求解。好的预处理可以大大加速迭代。',
        whyNeedIt: '预处理是提高迭代法效率的关键技术。',
        formula: 'M^{-1}A\\vec{x} = M^{-1}\\vec{b}',
        example: 'Jacobi预处理：M = diag(A)，简单但有效。'
      },
      {
        id: 'multigrid-method',
        name: '多重网格法',
        category: '迭代方法',
        definition: '多重网格法在粗细不同网格上迭代求解，消除不同频率的误差分量。是求解椭圆型偏微分方程离散化方程的最快方法。',
        plainTranslation: '多重网格法是"在粗细网格间切换求解"。细网格消除高频误差，粗网格消除低频误差。两种网格配合，收敛极快。',
        whyNeedIt: '多重网格法是求解偏微分方程离散化系统的最优方法之一。',
        formula: '\\text{粗网格修正} + \\text{细网格光滑}',
        example: '求解泊松方程，多重网格法比普通迭代快几个数量级。'
      },
      {
        id: 'consistent-inconsistent',
        name: '相容与不相容方程组',
        category: '基本概念',
        definition: '相容方程组是有解的方程组（rank(A) = rank([A|b])）；不相容方程组是无解的方程组（rank(A) < rank([A|b])）。不相容方程组只能求近似解。',
        plainTranslation: '相容是"有解"，不相容是"无解"。相容方程组至少有一个解；不相容方程组没有解，方程之间有矛盾。不相容时用最小二乘法求近似解。',
        whyNeedIt: '相容性判断是分析方程组的第一步。',
        formula: '\\text{相容} \\Leftrightarrow \\text{rank}(A) = \\text{rank}([A|b])',
        example: '{x + y = 1; x + y = 2} 不相容，因为两个方程矛盾。'
      },
      {
        id: 'equivalent-transformations',
        name: '方程组的等价变换',
        category: '求解方法',
        definition: '方程组的等价变换包括：(1) 交换两个方程；(2) 用非零数乘某个方程；(3) 一个方程加上另一个方程的倍数。等价变换不改变解集。',
        plainTranslation: '等价变换是"改变方程形式但不改变解"的操作。交换方程、乘以非零数、方程相加，这些操作不会丢失解也不会增加解。高斯消元就是等价变换。',
        whyNeedIt: '等价变换是消元法的理论基础。',
        formula: '\\text{等价变换} \\Leftrightarrow \\text{解集不变}',
        example: '{x + y = 3; 2x - y = 0} 与 {x + y = 3; -3y = -6} 等价，解相同。'
      },
      {
        id: 'parametric-solution',
        name: '参数解',
        category: '解的结构',
        definition: '当方程组有无穷多解时，用自由变量作为参数表示所有解。参数解形式：x = x₀ + t₁v₁ + ... + tₖvₖ，其中 tᵢ 是参数。',
        plainTranslation: '参数解是"用参数表示所有解"。自由变量当作参数，其他变量用参数表示。参数取不同值就得到不同解。',
        whyNeedIt: '参数解是表示无穷多解的标准形式。',
        formula: '\\vec{x} = \\vec{x}_0 + t_1\\vec{v}_1 + \\cdots + t_k\\vec{v}_k',
        example: '方程组 {x + y + z = 1} 的参数解：(t, s, 1-t-s)，t, s 为参数。'
      },
      {
        id: 'geometric-interpretation',
        name: '解的几何意义',
        category: '几何解释',
        definition: '线性方程组的解在几何上表示超平面的交集。唯一解是超平面交于一点；无穷多解是超平面交于一条线或更高维子空间；无解是超平面不相交。',
        plainTranslation: '解的几何意义是"平面的交点"。每个方程是一个平面，解就是所有平面的交点。交于一点是唯一解，交于一条线是无穷解，不相交是无解。',
        whyNeedIt: '几何直观帮助理解方程组解的结构。',
        formula: '\\text{解集} = \\bigcap_{i=1}^{m} \\{\\vec{x} : a_{i1}x_1 + \\cdots + a_{in}x_n = b_i\\}',
        example: '二维中两个方程是两条直线，解是交点；三维中三个方程是三个平面，解是交点或交线。'
      },
      {
        id: 'application-circuit',
        name: '应用：电路分析',
        category: '应用',
        definition: '电路分析中，基尔霍夫定律产生线性方程组。节点电压法和回路电流法将电路问题转化为线性方程组求解。',
        plainTranslation: '电路分析是"用方程组算电流电压"。基尔霍夫定律列出方程，解方程组得到各支路电流或节点电压。这是线性方程组最经典的应用之一。',
        whyNeedIt: '电路分析是线性方程组的重要应用领域。',
        formula: '\\sum I_{\\text{入}} = \\sum I_{\\text{出}}, \\quad \\sum V = 0',
        example: '简单电路：节点方程 {I₁ - I₂ - I₃ = 0; ...}，解得各支路电流。'
      },
      {
        id: 'application-structure',
        name: '应用：结构分析',
        category: '应用',
        definition: '结构力学中，平衡方程和变形协调方程构成线性方程组。矩阵位移法将结构问题转化为大型稀疏线性方程组。',
        plainTranslation: '结构分析是"用方程组算力和位移"。结构的平衡条件列出方程组，解方程组得到各节点的位移和内力。大型结构产生大型稀疏方程组。',
        whyNeedIt: '结构分析是线性方程组在工程中的重要应用。',
        formula: 'K\\vec{u} = \\vec{f}, \\quad K \\text{ 刚度矩阵}',
        example: '桁架结构：每个节点列平衡方程，解方程组得各杆内力。'
      },
      {
        id: 'application-economics',
        name: '应用：经济模型',
        category: '应用',
        definition: '经济学中，投入产出模型、一般均衡模型等都涉及线性方程组。Leontief投入产出模型是典型例子：x = Ax + d。',
        plainTranslation: '经济模型是"用方程组描述经济关系"。投入产出模型描述各部门之间的投入产出关系，解方程组得到各部门产出。线性方程组是经济数学的基础。',
        whyNeedIt: '线性方程组在经济学建模中有广泛应用。',
        formula: '(I - A)\\vec{x} = \\vec{d}',
        example: '投入产出模型：已知最终需求d，求各部门总产出x = (I-A)⁻¹d。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter-27',
    name: '第二十七章 特征值特征向量与相似矩阵',
    concepts: [
      {
        id: 'eigenvalue-definition',
        name: '特征值的定义',
        category: '基本概念',
        definition: '对于n阶方阵A，若存在非零向量x和标量λ使得 Ax = λx，则λ称为A的特征值。特征值是特征方程 |A - λI| = 0 的根。',
        plainTranslation: '特征值是"矩阵作用后只伸缩不旋转的倍数"。如果向量x被A作用后只是伸缩了λ倍（方向不变或反向），那λ就是特征值。特征值揭示矩阵的"内在性质"。',
        whyNeedIt: '特征值是矩阵的核心特征，在稳定性分析、振动问题、主成分分析中有重要应用。',
        formula: 'A\\vec{x} = \\lambda\\vec{x}, \\quad \\vec{x} \\neq \\vec{0}',
        example: '矩阵 [4 1; 2 3] 的特征值是 2 和 5，因为特征方程 (4-λ)(3-λ)-2 = λ²-7λ+10 = 0 的根是 2 和 5。'
      },
      {
        id: 'eigenvector-definition',
        name: '特征向量的定义',
        category: '基本概念',
        definition: '对于方阵A的特征值λ，满足 Ax = λx 的非零向量x称为对应于λ的特征向量。特征向量构成特征空间，是 A - λI 的核空间。',
        plainTranslation: '特征向量是"被矩阵作用后只伸缩不旋转的向量"。特征向量经过矩阵变换后，方向保持不变（或反向），只是长度改变了。一个特征值可以有多个特征向量。',
        whyNeedIt: '特征向量给出了矩阵作用下的"不变方向"，在矩阵对角化中有核心地位。',
        formula: '(A - \\lambda I)\\vec{x} = \\vec{0}, \\quad \\vec{x} \\neq \\vec{0}',
        example: '矩阵 [4 1; 2 3] 的特征值 λ=5 对应的特征向量满足 [4-5 1; 2 3-5]x = 0，即 [-1 1; 2 -2]x = 0，特征向量是 (1, 1)。'
      },
      {
        id: 'characteristic-polynomial-detail',
        name: '特征多项式',
        category: '基本概念',
        definition: '方阵A的特征多项式定义为 p(λ) = |A - λI|。特征多项式是关于λ的n次多项式，其根就是特征值。展开形式：p(λ) = (-1)ⁿλⁿ + c_{n-1}λ^{n-1} + ... + c₁λ + |A|。',
        plainTranslation: '特征多项式是"用来求特征值的多项式"。把 |A - λI| 展开就得到特征多项式。令它等于零，解出来的λ就是特征值。特征多项式的系数与矩阵的迹和行列式有关。',
        whyNeedIt: '特征多项式是计算特征值的基本工具，其系数与矩阵的不变量有关。',
        formula: 'p(\\lambda) = |A - \\lambda I| = (-1)^n\\lambda^n + c_{n-1}\\lambda^{n-1} + \\cdots + (-1)^n|A|',
        example: '矩阵 [a b; c d] 的特征多项式 = λ² - (a+d)λ + (ad-bc) = λ² - tr(A)λ + |A|。'
      },
      {
        id: 'characteristic-equation',
        name: '特征方程',
        category: '基本概念',
        definition: '特征方程是令特征多项式等于零得到的方程：|A - λI| = 0。特征方程的根就是矩阵的特征值。',
        plainTranslation: '特征方程是"求特征值的方程"。令特征多项式等于零，解这个方程就得到所有特征值。n阶矩阵的特征方程是n次方程，有n个根（可能有重根）。',
        whyNeedIt: '特征方程是求特征值的直接方法，适用于低阶矩阵。',
        formula: '|A - \\lambda I| = 0',
        example: '矩阵 [2 1; 1 2] 的特征方程：(2-λ)² - 1 = λ² - 4λ + 3 = 0，特征值 λ = 1, 3。'
      },
      {
        id: 'eigenspace-definition',
        name: '特征空间',
        category: '基本概念',
        definition: '对于特征值λ，特征空间 E_λ = {x : Ax = λx} = Ker(A - λI)，即所有对应特征向量加上零向量构成的子空间。特征空间的维数称为几何重数。',
        plainTranslation: '特征空间是"同一特征值的所有特征向量加上零向量"组成的子空间。特征空间是一个向量空间，它的维数告诉我们这个特征值有多少"独立"的特征向量。',
        whyNeedIt: '特征空间是矩阵对角化的关键，几何重数决定了能否对角化。',
        formula: 'E_\\lambda = \\text{Ker}(A - \\lambda I) = \\{\\vec{x} : (A - \\lambda I)\\vec{x} = \\vec{0}\\}',
        example: '矩阵 [2 0 0; 0 2 0; 0 0 3] 的特征值2的特征空间是 {(x, y, 0)}，维数为2。'
      },
      {
        id: 'algebraic-multiplicity-detail',
        name: '代数重数',
        category: '重数概念',
        definition: '特征值λ在特征多项式中作为根的重数称为代数重数。代数重数之和等于矩阵的阶数n。代数重数表示特征值"出现几次"。',
        plainTranslation: '代数重数是"特征值在特征方程中出现的次数"。比如特征方程 (λ-2)²(λ-3) = 0，特征值2的代数重数是2，特征值3的代数重数是1。所有代数重数加起来等于n。',
        whyNeedIt: '代数重数与几何重数的关系决定了矩阵能否对角化。',
        formula: '\\sum_{i=1}^{k} m_i = n, \\quad m_i = \\text{代数重数}',
        example: '矩阵 [2 1; 0 2] 的特征值2的代数重数是2（二重根）。'
      },
      {
        id: 'geometric-multiplicity-detail',
        name: '几何重数',
        category: '重数概念',
        definition: '特征值λ的特征空间的维数称为几何重数。几何重数等于 n - rank(A - λI)。几何重数永远不超过代数重数。',
        plainTranslation: '几何重数是"特征值对应的独立特征向量个数"。几何重数 = 特征空间的维数。几何重数永远不超过代数重数。只有两者相等时，矩阵才能对角化。',
        whyNeedIt: '几何重数是判断矩阵能否对角化的关键指标。',
        formula: '\\text{几何重数} = \\dim(E_\\lambda) = n - \\text{rank}(A - \\lambda I), \\quad 1 \\leq \\text{几何重数} \\leq \\text{代数重数}',
        example: '矩阵 [2 1; 0 2] 的特征值2：代数重数=2，几何重数=1（只有一个独立特征向量），不能对角化。'
      },
      {
        id: 'multiplicity-relationship',
        name: '重数关系',
        category: '重数概念',
        definition: '对于任意特征值λ，有 1 ≤ 几何重数 ≤ 代数重数。矩阵可对角化当且仅当每个特征值的几何重数等于代数重数。',
        plainTranslation: '重数关系是"几何重数永远不超过代数重数"。如果几何重数等于代数重数，说明有"足够多"的特征向量，可以构成基。只有所有特征值都满足这个条件，矩阵才能对角化。',
        whyNeedIt: '重数关系是判断矩阵能否对角化的核心判据。',
        formula: '1 \\leq \\text{几何重数} \\leq \\text{代数重数}',
        example: '可对角化：所有特征值的几何重数 = 代数重数。不可对角化：存在特征值的几何重数 < 代数重数。'
      },
      {
        id: 'eigenvalue-properties',
        name: '特征值的性质',
        category: '基本性质',
        definition: '特征值的重要性质：(1) 特征值之和等于迹：Σλᵢ = tr(A)；(2) 特征值之积等于行列式：∏λᵢ = |A|；(3) Aᵀ与A有相同特征值；(4) A⁻¹的特征值是1/λ；(5) Aᵏ的特征值是λᵏ。',
        plainTranslation: '特征值的性质包括：和等于迹，积等于行列式。转置不改变特征值。逆矩阵的特征值是原特征值的倒数。矩阵幂的特征值是特征值的幂。',
        whyNeedIt: '特征值的性质在理论分析和计算中有重要应用。',
        formula: '\\sum \\lambda_i = \\text{tr}(A), \\quad \\prod \\lambda_i = |A|',
        example: '矩阵 [1 2; 3 4]：迹 = 5 = 特征值之和，行列式 = -2 = 特征值之积。'
      },
      {
        id: 'eigenvector-properties',
        name: '特征向量的性质',
        category: '基本性质',
        definition: '特征向量的性质：(1) 特征向量的非零倍数也是特征向量；(2) 不同特征值对应的特征向量线性无关；(3) 特征向量可以标准化为单位向量；(4) 正交矩阵的特征向量可以选为正交的。',
        plainTranslation: '特征向量的性质包括：特征向量可以缩放，还是特征向量。不同特征值的特征向量一定线性无关。对称矩阵的特征向量可以选成正交的。',
        whyNeedIt: '特征向量的性质是构造特征向量组和进行对角化的基础。',
        formula: 'A\\vec{x} = \\lambda\\vec{x} \\Rightarrow A(k\\vec{x}) = \\lambda(k\\vec{x})',
        example: '若 (1, 1) 是特征向量，则 (2, 2), (3, 3) 等也是特征向量。'
      },
      {
        id: 'eigenvalue-trace-determinant',
        name: '特征值与迹和行列式',
        category: '基本性质',
        definition: '特征值与迹、行列式的关系：迹 = 特征值之和，行列式 = 特征值之积。这给出了特征值的两个基本约束。',
        plainTranslation: '迹和行列式是"特征值的基本信息"。迹是所有特征值加起来，行列式是所有特征值乘起来。两个数一起，给出了特征值的重要约束。',
        whyNeedIt: '迹和行列式提供了特征值的基本信息，在不需要求出全部特征值时很有用。',
        formula: '\\text{tr}(A) = \\lambda_1 + \\lambda_2 + \\cdots + \\lambda_n, \\quad |A| = \\lambda_1 \\cdot \\lambda_2 \\cdot \\cdots \\cdot \\lambda_n',
        example: '2×2矩阵的特征多项式 λ² - tr(A)λ + |A| = 0，用迹和行列式直接写出特征方程。'
      },
      {
        id: 'similar-matrix-definition',
        name: '相似矩阵的定义',
        category: '相似理论',
        definition: '若存在可逆矩阵P使得 B = P⁻¹AP，则称A与B相似，记作 A ~ B。相似矩阵代表同一线性变换在不同基下的表示。',
        plainTranslation: '相似矩阵是"同一线性变换在不同坐标系下的表示"。相似矩阵本质上是"同一个东西"，只是坐标系不同。它们有相同的特征值、迹、行列式。',
        whyNeedIt: '相似关系是矩阵分类的重要工具，相似标准形简化了矩阵分析。',
        formula: 'B = P^{-1}AP \\Leftrightarrow A \\sim B',
        example: '[4 1; 2 3] 与 [5 0; 0 2] 相似，它们有相同的特征值5和2。'
      },
      {
        id: 'similar-matrix-properties',
        name: '相似矩阵的性质',
        category: '相似理论',
        definition: '相似矩阵的性质：(1) 相似关系是等价关系（自反、对称、传递）；(2) 相似矩阵有相同的特征多项式、特征值、迹、行列式、秩；(3) 相似矩阵的幂仍相似。',
        plainTranslation: '相似矩阵有相同的"核心性质"：特征值、迹、行列式、秩都相同。相似矩阵的幂也相似：若 A ~ B，则 Aᵏ ~ Bᵏ。',
        whyNeedIt: '相似不变量是矩阵分类的基础，简化了矩阵分析。',
        formula: 'A \\sim B \\Rightarrow \\text{特征值、迹、行列式、秩相同}',
        example: '若 A ~ B，则 A² ~ B²，A⁻¹ ~ B⁻¹（如果可逆）。'
      },
      {
        id: 'similarity-invariants',
        name: '相似不变量',
        category: '相似理论',
        definition: '相似不变量是相似变换下保持不变的量。主要相似不变量包括：特征多项式、特征值、迹、行列式、秩、几何重数、代数重数。',
        plainTranslation: '相似不变量是"相似矩阵共有的量"。如果两个矩阵相似，它们的特征值、迹、行列式、秩都相同。相似不变量是判断两个矩阵是否相似的重要依据。',
        whyNeedIt: '相似不变量是矩阵分类和相似判断的基础。',
        formula: 'A \\sim B \\Rightarrow p_A(\\lambda) = p_B(\\lambda), \\text{tr}(A) = \\text{tr}(B), |A| = |B|',
        example: '若 A 和 B 有不同的特征值，则它们不相似。'
      },
      {
        id: 'diagonalization-definition',
        name: '矩阵对角化',
        category: '对角化',
        definition: '若存在可逆矩阵P使得 P⁻¹AP = Λ（对角矩阵），则称A可对角化。A可对角化当且仅当A有n个线性无关的特征向量。',
        plainTranslation: '对角化是"把矩阵变成对角矩阵"的变换。如果能找到一组完整的特征向量，就能把矩阵对角化。对角化后的矩阵运算非常简单：幂运算变成各元素分别取幂。',
        whyNeedIt: '对角化简化了矩阵运算，在求解矩阵幂、微分方程中有重要应用。',
        formula: 'P^{-1}AP = \\Lambda = \\text{diag}(\\lambda_1, \\lambda_2, \\ldots, \\lambda_n)',
        example: '矩阵 [4 1; 2 3] 可对角化：P = [1 1; 1 -1]，P⁻¹AP = [5 0; 0 2]。'
      },
      {
        id: 'diagonalization-condition',
        name: '对角化条件',
        category: '对角化',
        definition: '矩阵A可对角化的充要条件：(1) A有n个线性无关的特征向量；(2) 每个特征值的几何重数等于代数重数；(3) 特征多项式可分解且每个特征值都有足够的特征向量。',
        plainTranslation: '对角化条件是"有足够多的特征向量"。具体来说，每个特征值的几何重数必须等于代数重数。简单判断：n个不同特征值一定可对角化；有重根时需要检验几何重数。',
        whyNeedIt: '对角化条件是判断矩阵能否对角化的核心判据。',
        formula: 'A \\text{ 可对角化} \\Leftrightarrow \\text{几何重数} = \\text{代数重数（对所有特征值）}',
        example: '矩阵 [2 1; 0 2] 不可对角化，因为特征值2的几何重数(1) < 代数重数(2)。'
      },
      {
        id: 'diagonalization-steps',
        name: '对角化步骤',
        category: '对角化',
        definition: '对角化的步骤：(1) 求特征方程 |A - λI| = 0 的根，得特征值；(2) 对每个特征值λᵢ，解 (A - λᵢI)x = 0，得特征向量；(3) 将特征向量作为列构成P，特征值构成Λ。',
        plainTranslation: '对角化步骤是"求特征值→求特征向量→构造P和Λ"。先求特征值，再对每个特征值求特征向量，最后把特征向量排成矩阵P，特征值排成对角矩阵Λ。',
        whyNeedIt: '对角化步骤是实际进行对角化的操作指南。',
        formula: 'P = [\\vec{v}_1, \\vec{v}_2, \\ldots, \\vec{v}_n], \\quad \\Lambda = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)',
        example: '矩阵 [2 1; 1 2]：特征值1,3，特征向量(1,-1), (1,1)，P = [1 1; -1 1]，Λ = [1 0; 0 3]。'
      },
      {
        id: 'matrix-power-diagonalization',
        name: '矩阵幂与对角化',
        category: '对角化应用',
        definition: '若 A = PΛP⁻¹，则 Aᵏ = PΛᵏP⁻¹。对角化后，矩阵幂运算变得简单：Λᵏ = diag(λ₁ᵏ, λ₂ᵏ, ..., λₙᵏ)。',
        plainTranslation: '矩阵幂通过对角化变得简单。把A分解成 PΛP⁻¹，则 Aᵏ = PΛᵏP⁻¹。对角矩阵的幂就是对角元素分别取幂。这大大简化了矩阵幂的计算。',
        whyNeedIt: '对角化是计算矩阵幂的高效方法，在马尔可夫链、递推关系中有重要应用。',
        formula: 'A^k = P\\Lambda^k P^{-1}, \\quad \\Lambda^k = \\text{diag}(\\lambda_1^k, \\ldots, \\lambda_n^k)',
        example: '矩阵 [2 0; 0 3]^{10} = [2^{10} 0; 0 3^{10}] = [1024 0; 0 59049]。'
      },
      {
        id: 'matrix-exponential-diagonalization',
        name: '矩阵指数与对角化',
        category: '对角化应用',
        definition: '若 A = PΛP⁻¹，则 eᴬ = Pe^ΛP⁻¹，其中 e^Λ = diag(e^{λ₁}, e^{λ₂}, ..., e^{λₙ})。矩阵指数在解微分方程组中有重要应用。',
        plainTranslation: '矩阵指数通过对角化变得简单。把A分解成 PΛP⁻¹，则 eᴬ = Pe^ΛP⁻¹。对角矩阵的指数就是对角元素分别取指数。矩阵指数是解线性微分方程组的核心工具。',
        whyNeedIt: '矩阵指数是解线性微分方程组的核心，在控制理论、量子力学中有重要应用。',
        formula: 'e^A = Pe^\\Lambda P^{-1}, \\quad e^\\Lambda = \\text{diag}(e^{\\lambda_1}, \\ldots, e^{\\lambda_n})',
        example: '对于 A = [0 1; 0 0]，eᴬ = [1 1; 0 1]（因为 A² = 0，所以 eᴬ = I + A）。'
      },
      {
        id: 'symmetric-matrix-eigenvalue',
        name: '对称矩阵的特征值',
        category: '特殊矩阵',
        definition: '实对称矩阵的特征值都是实数。对称矩阵的特征向量可以选为正交的。对称矩阵一定可以正交对角化。',
        plainTranslation: '对称矩阵的特征值"都是实数"，不会有复数。对称矩阵的特征向量可以选成互相垂直的。这是对称矩阵最重要的性质，使得对称矩阵总是可以对角化。',
        whyNeedIt: '对称矩阵的特征值性质在二次型、优化、物理中有重要应用。',
        formula: 'A = A^T \\Rightarrow \\lambda_i \\in \\mathbb{R}',
        example: '对称矩阵 [1 2; 2 1] 的特征值是 3 和 -1，都是实数。'
      },
      {
        id: 'orthogonal-diagonalization',
        name: '正交对角化',
        category: '对角化',
        definition: '对于实对称矩阵A，存在正交矩阵Q使得 QᵀAQ = Λ（对角矩阵）。正交对角化是对角化的特殊形式，P是正交矩阵。',
        plainTranslation: '正交对角化是"用正交矩阵进行对角化"。对称矩阵总能正交对角化。正交矩阵的逆等于转置，所以 QᵀAQ = Λ。正交对角化在主成分分析中有重要应用。',
        whyNeedIt: '正交对角化是对称矩阵的标准分解，在主成分分析、二次型中有核心地位。',
        formula: 'Q^T A Q = \\Lambda, \\quad Q^T Q = I',
        example: '对称矩阵 [1 2; 2 1]：Q = [1/√2 1/√2; 1/√2 -1/√2]，QᵀAQ = [3 0; 0 -1]。'
      },
      {
        id: 'spectral-theorem',
        name: '谱分解定理',
        category: '重要定理',
        definition: '实对称矩阵A可以分解为 A = QΛQᵀ = Σᵢ λᵢqᵢqᵢᵀ，其中qᵢ是正交特征向量。这就是谱分解，也称特征值分解。',
        plainTranslation: '谱分解是"对称矩阵展开成特征向量外积的和"。对称矩阵可以写成：特征值 × 特征向量 × 特征向量转置，然后加起来。每个特征值和特征向量贡献一个"分量"。',
        whyNeedIt: '谱分解是对称矩阵的标准分解，在主成分分析、量子力学中有重要应用。',
        formula: 'A = \\sum_{i=1}^{n} \\lambda_i \\vec{q}_i \\vec{q}_i^T',
        example: '对称矩阵 [3 1; 1 3] = 4×[1/√2; 1/√2][1/√2, 1/√2] + 2×[1/√2; -1/√2][1/√2, -1/√2]。'
      },
      {
        id: 'positive-definite-eigenvalue',
        name: '正定矩阵的特征值',
        category: '特殊矩阵',
        definition: '对称矩阵A正定当且仅当所有特征值为正。半正定当且仅当所有特征值非负。特征值给出了正定性的等价刻画。',
        plainTranslation: '正定矩阵的特征值"都是正数"。半正定矩阵的特征值"都是非负数"。这是判断正定性的重要方法：算特征值，看符号。',
        whyNeedIt: '特征值给出了正定性的等价刻画，是判断正定性的重要方法。',
        formula: 'A \\text{ 正定} \\Leftrightarrow \\lambda_i > 0, \\forall i',
        example: '矩阵 [2 1; 1 2] 的特征值是 1 和 3，都是正数，所以正定。'
      },
      {
        id: 'jordan-form-detail',
        name: 'Jordan标准形',
        category: '标准形',
        definition: '任何复方阵都相似于Jordan标准形，由Jordan块组成。Jordan块 J_k(λ) 是对角线为λ、上方次对角线为1的矩阵。Jordan标准形是矩阵相似的标准形。',
        plainTranslation: 'Jordan标准形是"矩阵的终极简化形式"。即使不能对角化，也能化成Jordan形。Jordan形是"几乎对角"的矩阵，对角线上是特征值，有些位置上方有1。',
        whyNeedIt: 'Jordan标准形是矩阵相似的标准形，在理论分析和微分方程求解中有重要应用。',
        formula: 'J = \\begin{pmatrix} J_{k_1}(\\lambda_1) & & \\\\ & \\ddots & \\\\ & & J_{k_m}(\\lambda_m) \\end{pmatrix}, \\quad J_k(\\lambda) = \\begin{pmatrix} \\lambda & 1 & & \\\\ & \\lambda & \\ddots & \\\\ & & \\ddots & 1 \\\\ & & & \\lambda \\end{pmatrix}',
        example: '矩阵 [2 1 0; 0 2 1; 0 0 2] 已经是Jordan标准形，是一个3阶Jordan块。'
      },
      {
        id: 'jordan-block',
        name: 'Jordan块',
        category: '标准形',
        definition: 'Jordan块 J_k(λ) 是k阶方阵，对角线元素都是λ，上方次对角线元素都是1，其余为0。Jordan块是不可对角化的最简形式。',
        plainTranslation: 'Jordan块是"不能对角化的最简矩阵"。对角线上是同一个特征值，上方有一条1。Jordan块代表"有缺陷"的特征值，几何重数小于代数重数。',
        whyNeedIt: 'Jordan块是Jordan标准形的组成单元，理解Jordan块是理解Jordan标准形的基础。',
        formula: 'J_k(\\lambda) = \\begin{pmatrix} \\lambda & 1 & 0 & \\cdots & 0 \\\\ 0 & \\lambda & 1 & \\cdots & 0 \\\\ \\vdots & \\ddots & \\ddots & \\ddots & \\vdots \\\\ 0 & \\cdots & 0 & \\lambda & 1 \\\\ 0 & \\cdots & \\cdots & 0 & \\lambda \\end{pmatrix}',
        example: 'J₂(2) = [2 1; 0 2]，J₃(3) = [3 1 0; 0 3 1; 0 0 3]。'
      },
      {
        id: 'generalized-eigenvector',
        name: '广义特征向量',
        category: '推广概念',
        definition: '对于特征值λ，满足 (A - λI)ᵏx = 0 的非零向量x称为广义特征向量。当几何重数小于代数重数时，需要广义特征向量来构造Jordan基。',
        plainTranslation: '广义特征向量是"特征向量的推广"。普通特征向量满足 (A - λI)x = 0，广义特征向量满足 (A - λI)ᵏx = 0。广义特征向量用于构造Jordan标准形。',
        whyNeedIt: '广义特征向量是构造Jordan标准形的工具，当矩阵不能对角化时需要它。',
        formula: '(A - \\lambda I)^k \\vec{x} = \\vec{0}, \\quad \\vec{x} \\neq \\vec{0}',
        example: '对于 [2 1; 0 2]，特征向量是 (1, 0)，广义特征向量满足 (A-2I)²x = 0，如 (0, 1)。'
      },
      {
        id: 'cayley-hamilton-theorem',
        name: 'Cayley-Hamilton定理',
        category: '重要定理',
        definition: '方阵A满足自己的特征方程：p(A) = 0，其中p(λ)是A的特征多项式。这给出了矩阵的一个重要恒等式。',
        plainTranslation: 'Cayley-Hamilton定理说"矩阵满足自己的特征方程"。把特征多项式中的λ换成A，结果是零矩阵。这个定理可以用来简化矩阵多项式和求逆矩阵。',
        whyNeedIt: 'Cayley-Hamilton定理是矩阵理论的重要定理，在求逆、幂运算中有应用。',
        formula: 'p(A) = 0, \\quad p(\\lambda) = |A - \\lambda I|',
        example: '矩阵 [1 2; 3 4] 的特征多项式 λ²-5λ-2，所以 A²-5A-2I = 0。'
      },
      {
        id: 'minimal-polynomial',
        name: '最小多项式',
        category: '多项式理论',
        definition: '最小多项式是使 m(A) = 0 的次数最低的首一多项式。最小多项式整除特征多项式。矩阵可对角化当且仅当最小多项式无重根。',
        plainTranslation: '最小多项式是"让矩阵变成零矩阵的最低次多项式"。最小多项式是特征多项式的因式。最小多项式没有重根，矩阵就能对角化。',
        whyNeedIt: '最小多项式给出了矩阵的更精细刻画，是判断对角化的另一方法。',
        formula: 'm(A) = 0, \\quad m(\\lambda) | p(\\lambda)',
        example: '矩阵 [2 1; 0 2] 的特征多项式 (λ-2)²，最小多项式也是 (λ-2)²，有重根，不可对角化。'
      },
      {
        id: 'eigenvalue-bounds',
        name: '特征值的估计',
        category: '数值方法',
        definition: '特征值的估计方法：(1) Gershgorin圆盘定理：特征值在圆盘并集内；(2) 谱半径 ρ(A) = max|λᵢ| ≤ ‖A‖；(3) 对于对称矩阵，λ_max = max(xᵀAx/|x|²)。',
        plainTranslation: '特征值估计是"不求特征值也能知道范围"。Gershgorin圆盘定理说特征值在以对角线元素为圆心、行元素绝对值之和为半径的圆盘内。谱半径不超过矩阵范数。',
        whyNeedIt: '特征值估计在不需要精确特征值时很有用，在数值分析中有重要应用。',
        formula: '\\lambda \\in \\bigcup_{i=1}^{n} \\{z : |z - a_{ii}| \\leq \\sum_{j \\neq i} |a_{ij}|\\}',
        example: '矩阵 [4 1; 1 3] 的特征值在圆盘 |z-4|≤1 和 |z-3|≤1 的并集内，即 [3,5]∪[2,4]。'
      },
      {
        id: 'gershgorin-theorem',
        name: 'Gershgorin圆盘定理',
        category: '数值方法',
        definition: 'Gershgorin圆盘定理：矩阵A的特征值位于n个圆盘的并集中，第i个圆盘以 a_{ii} 为圆心，以 Σⱼ≠ᵢ |a_{ij}| 为半径。',
        plainTranslation: 'Gershgorin圆盘定理是"用对角线元素估计特征值位置"。每个对角线元素确定一个圆盘，特征值一定在这些圆盘的并集内。这是特征值定位的基本工具。',
        whyNeedIt: 'Gershgorin定理是特征值定位的基本工具，在数值分析中有重要应用。',
        formula: '\\lambda \\in \\bigcup_{i=1}^{n} D_i, \\quad D_i = \\{z : |z - a_{ii}| \\leq \\sum_{j \\neq i} |a_{ij}|\\}',
        example: '矩阵 [5 1 0; 1 3 1; 0 1 1]：圆盘 D₁={|z-5|≤1}, D₂={|z-3|≤2}, D₃={|z-1|≤1}。'
      },
      {
        id: 'power-method',
        name: '幂法',
        category: '数值方法',
        definition: '幂法是求矩阵按模最大特征值的方法：从初始向量x₀开始，迭代 x_{k+1} = Ax_k/|Ax_k|，收敛到最大特征值对应的特征向量。',
        plainTranslation: '幂法是"求最大特征值的迭代法"。从一个随机向量开始，不断乘以矩阵并归一化，最终收敛到最大特征值对应的特征向量。幂法简单高效，适合大规模矩阵。',
        whyNeedIt: '幂法是求最大特征值的标准方法，在PageRank等应用中有重要地位。',
        formula: '\\vec{x}_{k+1} = \\frac{A\\vec{x}_k}{\\|A\\vec{x}_k\\|}, \\quad \\lambda_1 \\approx \\vec{x}_k^T A \\vec{x}_k',
        example: '求矩阵 [4 1; 2 3] 的最大特征值：幂法迭代收敛到特征向量 (1, 1)，特征值 5。'
      },
      {
        id: 'inverse-power-method',
        name: '反幂法',
        category: '数值方法',
        definition: '反幂法是求矩阵按模最小特征值的方法：迭代 x_{k+1} = A⁻¹x_k/|A⁻¹x_k|，收敛到最小特征值对应的特征向量。实际计算中解线性方程组代替求逆。',
        plainTranslation: '反幂法是"求最小特征值的迭代法"。用矩阵的逆进行迭代，收敛到最小特征值对应的特征向量。反幂法常与位移结合，求指定特征值。',
        whyNeedIt: '反幂法是求最小特征值的标准方法，与位移结合可求任意特征值。',
        formula: '\\vec{x}_{k+1} = \\frac{A^{-1}\\vec{x}_k}{\\|A^{-1}\\vec{x}_k\\|}',
        example: '求矩阵 [4 1; 2 3] 的最小特征值：反幂法收敛到特征向量 (1, -1)，特征值 2。'
      },
      {
        id: 'qr-algorithm',
        name: 'QR算法',
        category: '数值方法',
        definition: 'QR算法是求所有特征值的标准方法：A₀ = A，迭代 A_k = Q_kR_k，A_{k+1} = R_kQ_k。A_k收敛到上三角（或拟上三角）矩阵，对角线元素即为特征值。',
        plainTranslation: 'QR算法是"求所有特征值的标准迭代法"。把矩阵QR分解，然后交换Q和R相乘，重复这个过程。矩阵逐渐变成上三角形式，对角线就是特征值。',
        whyNeedIt: 'QR算法是求矩阵全部特征值的标准方法，在数值计算中广泛应用。',
        formula: 'A_k = Q_k R_k, \\quad A_{k+1} = R_k Q_k',
        example: 'QR算法是Matlab eig函数的底层算法，是求特征值最可靠的方法。'
      },
      {
        id: 'deflation',
        name: '压缩法',
        category: '数值方法',
        definition: '压缩法是在求出一个特征值后，将矩阵降阶继续求其他特征值的方法。常用Hotelling压缩：A\' = A - λ₁v₁v₁ᵀ/|v₁|²。',
        plainTranslation: '压缩法是"求出一个特征值后降阶继续求"。把已求出的特征值"去掉"，剩下的矩阵特征值就是原矩阵的其他特征值。压缩法可以逐个求出所有特征值。',
        whyNeedIt: '压缩法配合幂法可以求出多个特征值。',
        formula: 'A\' = A - \\lambda_1 \\frac{\\vec{v}_1 \\vec{v}_1^T}{\\|\\vec{v}_1\\|^2}',
        example: '求出最大特征值后，用压缩法得到新矩阵，再用幂法求次大特征值。'
      },
      {
        id: 'rayleigh-quotient',
        name: 'Rayleigh商',
        category: '数值方法',
        definition: 'Rayleigh商定义为 R(x) = xᵀAx/xᵀx。对于对称矩阵，Rayleigh商在特征向量处取极值，极值就是特征值。Rayleigh商迭代是求特征值的高效方法。',
        plainTranslation: 'Rayleigh商是"向量对应的特征值估计"。对于给定向量x，Rayleigh商给出一个"最佳"的特征值估计。在特征向量处，Rayleigh商正好等于对应的特征值。',
        whyNeedIt: 'Rayleigh商是特征值估计和迭代加速的重要工具。',
        formula: 'R(\\vec{x}) = \\frac{\\vec{x}^T A \\vec{x}}{\\vec{x}^T \\vec{x}}',
        example: '对于对称矩阵 [2 1; 1 2] 和向量 (1, 1)，R = (1,1)·(3,3)/2 = 3，正好是特征值。'
      },
      {
        id: 'condition-number-eigenvalue',
        name: '特征值的条件数',
        category: '数值分析',
        definition: '特征值的条件数衡量特征值对矩阵扰动的敏感程度。对于单特征值λ，条件数与特征向量的夹角有关。重特征值的条件数可能很大。',
        plainTranslation: '特征值条件数是"特征值有多敏感的度量"。条件数大，矩阵稍有扰动，特征值就变化很大。重特征值（代数重数>1）的条件数通常很大，数值计算困难。',
        whyNeedIt: '特征值条件数是评估特征值计算稳定性的重要指标。',
        formula: '\\kappa(\\lambda) = \\frac{1}{|\\cos\\theta|}, \\quad \\theta = \\text{左右特征向量夹角}',
        example: '对称矩阵的特征值条件数为1，最稳定。非对称矩阵可能有病态特征值。'
      },
      {
        id: 'eigenvalue-application-vibration',
        name: '应用：振动分析',
        category: '应用',
        definition: '振动分析中，特征值对应振动频率，特征向量对应振型。无阻尼振动方程 Mẍ + Kx = 0 的特征值问题 Kφ = ω²Mφ 给出固有频率和振型。',
        plainTranslation: '振动分析是"特征值问题的经典应用"。特征值是振动频率的平方，特征向量是振动模式（振型）。每座桥梁、每栋建筑都有固有频率，设计时要避免共振。',
        whyNeedIt: '特征值在振动分析中有直接的物理意义，是结构动力学的核心。',
        formula: 'K\\vec{\\phi} = \\omega^2 M\\vec{\\phi}',
        example: '简支梁的振动：特征值给出各阶固有频率，特征向量给出对应的振型曲线。'
      },
      {
        id: 'eigenvalue-application-stability',
        name: '应用：稳定性分析',
        category: '应用',
        definition: '动力系统 ẋ = Ax 的稳定性由A的特征值决定：所有特征值实部为负则稳定；有正实部则不稳定；有零实部需进一步分析。',
        plainTranslation: '稳定性分析是"用特征值判断系统是否稳定"。如果所有特征值的实部都是负的，系统会回到平衡点；如果有正实部，系统会发散。这是控制理论的基础。',
        whyNeedIt: '特征值是判断动力系统稳定性的核心工具，在控制理论中有重要应用。',
        formula: '\\text{Re}(\\lambda_i) < 0, \\forall i \\Rightarrow \\text{稳定}',
        example: '系统 ẋ = -x, ẏ = -2y：特征值 -1, -2，都是负实数，系统稳定。'
      },
      {
        id: 'eigenvalue-application-pca',
        name: '应用：主成分分析',
        category: '应用',
        definition: '主成分分析(PCA)通过协方差矩阵的特征值分解实现。最大特征值对应的主成分解释最多方差，特征向量给出主方向。PCA是数据降维的标准方法。',
        plainTranslation: '主成分分析是"用特征值找数据的主要方向"。协方差矩阵的最大特征值对应的方向是数据变化最大的方向。PCA用特征值分解实现数据降维。',
        whyNeedIt: 'PCA是机器学习、数据科学中最常用的降维方法。',
        formula: '\\Sigma \\vec{v}_i = \\lambda_i \\vec{v}_i, \\quad \\lambda_1 \\geq \\lambda_2 \\geq \\cdots',
        example: '人脸识别：用PCA提取主要特征脸，实现降维和识别。'
      },
      {
        id: 'eigenvalue-application-quantum',
        name: '应用：量子力学',
        category: '应用',
        definition: '量子力学中，可观测量对应厄米特算符（矩阵），测量值是特征值，本征态是特征向量。薛定谔方程 Hψ = Eψ 是特征值问题。',
        plainTranslation: '量子力学是"特征值问题的物理应用"。可观测量（能量、动量等）对应厄米特矩阵，测量结果是特征值，量子态是特征向量。能量本征值问题是最基本的特征值问题。',
        whyNeedIt: '特征值在量子力学中有深刻的物理意义，是量子理论的基础。',
        formula: 'H\\psi = E\\psi, \\quad H \\text{ 哈密顿算符}',
        example: '氢原子能级：解薛定谔方程的特征值问题，得到离散能级 E_n = -13.6/n² eV。'
      },
      {
        id: 'eigenvalue-application-markov',
        name: '应用：马尔可夫链',
        category: '应用',
        definition: '马尔可夫链的平稳分布是转移矩阵特征值1对应的特征向量。特征值1的几何意义是状态分布不变。次大特征值决定收敛速度。',
        plainTranslation: '马尔可夫链是"特征值决定长期行为"。转移矩阵特征值1对应的特征向量就是平稳分布。次大特征值越接近1，收敛到平稳分布越慢。',
        whyNeedIt: '特征值分析是理解马尔可夫链长期行为的关键。',
        formula: 'P\\vec{\\pi} = \\vec{\\pi}, \\quad \\lambda_1 = 1',
        example: 'PageRank算法：网页排名是转移矩阵特征值1对应的特征向量。'
      },
      {
        id: 'eigenvalue-application-graph',
        name: '应用：图谱理论',
        category: '应用',
        definition: '图谱理论研究图的邻接矩阵和拉普拉斯矩阵的特征值和特征向量。谱聚类、图分割等算法基于特征值分解。',
        plainTranslation: '图谱理论是"用特征值研究图的结构"。图的邻接矩阵和拉普拉斯矩阵的特征值反映图的性质。谱聚类用拉普拉斯矩阵的特征向量进行聚类。',
        whyNeedIt: '特征值在图论和网络分析中有重要应用。',
        formula: 'L = D - A, \\quad L\\vec{v} = \\lambda\\vec{v}',
        example: '谱聚类：用拉普拉斯矩阵的前k个特征向量进行k-means聚类。'
      },
      {
        id: 'similarity-transform',
        name: '相似变换',
        category: '相似理论',
        definition: '相似变换 B = P⁻¹AP 是矩阵的坐标变换。相似变换保持特征值、迹、行列式等不变量。相似变换的目的是简化矩阵形式。',
        plainTranslation: '相似变换是"换坐标系"。把矩阵从一组基变换到另一组基，矩阵的形式变了，但本质性质不变。相似变换的目的是找到更简单的表示形式。',
        whyNeedIt: '相似变换是矩阵简化的基本工具，对角化、Jordan标准形都是相似变换。',
        formula: 'B = P^{-1}AP',
        example: '对角化是一种相似变换，把矩阵变成对角形式。'
      },
      {
        id: 'simultaneous-diagonalization',
        name: '同时对角化',
        category: '对角化',
        definition: '两个矩阵A和B可以同时对角化，当且仅当它们可交换（AB = BA）且都可对角化。同时对角化意味着它们有共同的特征向量。',
        plainTranslation: '同时对角化是"两个矩阵用同一个P对角化"。如果两个矩阵可交换（AB=BA），它们就有共同的特征向量，可以同时对角化。这在量子力学中有重要应用。',
        whyNeedIt: '同时对角化在量子力学（可观测量同时测量）中有重要应用。',
        formula: 'P^{-1}AP = \\Lambda_1, \\quad P^{-1}BP = \\Lambda_2 \\Leftrightarrow AB = BA',
        example: '单位矩阵I和任何矩阵A可交换，所以I和A可以同时对角化。'
      },
      {
        id: 'normal-matrix-diagonalization',
        name: '正规矩阵的对角化',
        category: '特殊矩阵',
        definition: '正规矩阵（满足 AᵀA = AAᵀ）可以酉对角化。正规矩阵包括对称矩阵、反对称矩阵、正交矩阵等。正规矩阵的特征向量可以选为正交的。',
        plainTranslation: '正规矩阵是"可以正交对角化的矩阵"。正规矩阵的特征向量可以选成互相垂直的。对称矩阵、正交矩阵都是正规矩阵，都可以正交对角化。',
        whyNeedIt: '正规矩阵的对角化性质在矩阵分析中有重要地位。',
        formula: 'A^T A = A A^T \\Rightarrow A = U\\Lambda U^T',
        example: '矩阵 [1 1; -1 1] 是正规矩阵，可以酉对角化。'
      },
      {
        id: 'hermitian-matrix-eigenvalue',
        name: '埃尔米特矩阵的特征值',
        category: '特殊矩阵',
        definition: '埃尔米特矩阵（A* = A）的特征值都是实数，特征向量可以选为正交的。埃尔米特矩阵可以酉对角化。实对称矩阵是埃尔米特矩阵的特例。',
        plainTranslation: '埃尔米特矩阵是"复数域上的对称矩阵"。埃尔米特矩阵的特征值都是实数，特征向量可以选成正交的。量子力学中的可观测量都是埃尔米特算符。',
        whyNeedIt: '埃尔米特矩阵在量子力学、复分析中有重要应用。',
        formula: 'A^* = A \\Rightarrow \\lambda_i \\in \\mathbb{R}',
        example: '矩阵 [1 i; -i 2] 是埃尔米特矩阵，特征值是实数。'
      },
      {
        id: 'unitary-matrix-eigenvalue',
        name: '酉矩阵的特征值',
        category: '特殊矩阵',
        definition: '酉矩阵（U*U = I）的特征值模为1，即 |λ| = 1。酉矩阵的特征向量可以选为正交的。酉矩阵代表复向量空间中的旋转。',
        plainTranslation: '酉矩阵是"复数域上的正交矩阵"。酉矩阵的特征值都在单位圆上（模为1）。酉矩阵代表复向量空间中的旋转，不改变向量长度。',
        whyNeedIt: '酉矩阵在量子力学、信号处理中有重要应用。',
        formula: 'U^* U = I \\Rightarrow |\\lambda| = 1',
        example: '矩阵 [cos θ -sin θ; sin θ cos θ] 是酉矩阵，特征值 e^{±iθ}，模为1。'
      },
      {
        id: 'real-schur-form',
        name: '实Schur分解',
        category: '标准形',
        definition: '实矩阵A可以分解为 A = QTQᵀ，其中Q是正交矩阵，T是拟上三角矩阵（对角线上是1×1或2×2块）。实Schur分解避免了复数运算。',
        plainTranslation: '实Schur分解是"实数域上的标准形"。把实矩阵分解成正交矩阵乘拟上三角矩阵。2×2块对应复共轭特征值对。实Schur分解是QR算法的基础。',
        whyNeedIt: '实Schur分解是实矩阵的标准分解，在数值计算中广泛应用。',
        formula: 'A = QTQ^T, \\quad T \\text{ 拟上三角}',
        example: '实矩阵 [0 -1; 1 0] 的实Schur形式是它本身，对应复特征值 ±i。'
      },
      {
        id: 'singular-value-vs-eigenvalue',
        name: '奇异值与特征值的关系',
        category: '关系',
        definition: '矩阵A的奇异值是 AᵀA（或AAᵀ）的特征值的平方根。奇异值总是非负实数，而特征值可能是复数。奇异值分解是特征值分解的推广。',
        plainTranslation: '奇异值是"AᵀA的特征值开根号"。奇异值总是非负的，而特征值可能是负数或复数。奇异值分解适用于任何矩阵，特征值分解只适用于方阵。',
        whyNeedIt: '理解奇异值与特征值的关系是理解两种分解的关键。',
        formula: '\\sigma_i = \\sqrt{\\lambda_i(A^T A)}',
        example: '矩阵 [3 0; 0 -4] 的特征值是 3 和 -4，奇异值是 3 和 4。'
      }
    ] as Concept[]
  },
  {
    id: 'chapter-28',
    name: '第二十八章 二次型与二次曲面',
    concepts: [
      {
        id: 'quadratic-form-definition',
        name: '二次型的定义',
        category: '基本概念',
        definition: '二次型是关于变量的二次齐次多项式。一般形式为 f(x₁, x₂, ..., xₙ) = Σᵢ₌₁ⁿ Σⱼ₌₁ⁿ aᵢⱼxᵢxⱼ，其中 aᵢⱼ = aⱼᵢ。二次型可以用矩阵表示为 f(x) = xᵀAx，其中A是对称矩阵。',
        plainTranslation: '二次型是"只有二次项的多项式"。没有一次项和常数项，只有x²、xy、y²这类二次项。二次型可以用矩阵表示，矩阵是对称的。二次型描述椭圆、双曲线等二次曲线。',
        whyNeedIt: '二次型是研究二次曲线、二次曲面的代数工具，在优化、物理中有重要应用。',
        formula: 'f(\\vec{x}) = \\vec{x}^T A \\vec{x} = \\sum_{i,j} a_{ij} x_i x_j',
        example: '二次型 f(x,y) = x² + 2xy + y² = [x y][1 1; 1 1][x; y]。'
      },
      {
        id: 'quadratic-form-matrix',
        name: '二次型的矩阵',
        category: '基本概念',
        definition: '二次型 f(x) = xᵀAx 对应的矩阵A称为二次型的矩阵。A是对称矩阵，对角线元素 aᵢᵢ 是 xᵢ² 的系数，非对角线元素 aᵢⱼ 是 xᵢxⱼ 系数的一半。',
        plainTranslation: '二次型的矩阵是"把二次型写成矩阵形式时的对称矩阵"。x²的系数放对角线，xy的系数平分放两边。矩阵是对称的，所以二次型的矩阵唯一确定。',
        whyNeedIt: '二次型的矩阵表示使代数运算变得简单，是研究二次型的核心工具。',
        formula: 'f(x_1, x_2) = a x_1^2 + 2b x_1 x_2 + c x_2^2 \\Leftrightarrow A = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}',
        example: 'f(x,y) = 3x² + 4xy + 2y² 的矩阵是 [3 2; 2 2]，注意xy系数4平分成两个2。'
      },
      {
        id: 'quadratic-form-rank',
        name: '二次型的秩',
        category: '基本概念',
        definition: '二次型的秩等于其矩阵A的秩。秩反映了二次型中"独立二次项"的个数。',
        plainTranslation: '二次型的秩是"矩阵的秩"。秩等于非零特征值的个数，反映了二次型有多少"有效"的二次项。秩为0的二次型恒为零。',
        whyNeedIt: '秩是二次型的重要不变量，决定了二次型的简化程度。',
        formula: '\\text{rank}(f) = \\text{rank}(A)',
        example: '二次型 f(x,y) = x² + 2xy + y² = (x+y)² 的矩阵 [1 1; 1 1] 秩为1。'
      },
      {
        id: 'standard-form-quadratic',
        name: '二次型的标准形',
        category: '标准形',
        definition: '二次型的标准形是只含平方项的形式：f = d₁y₁² + d₂y₂² + ... + dₙyₙ²。任何二次型都可以通过可逆线性变换化为标准形。标准形的系数就是矩阵的特征值。',
        plainTranslation: '标准形是"只有平方项，没有交叉项"的形式。通过坐标变换，可以把二次型化成标准形。标准形的系数就是特征值。标准形让二次型的性质一目了然。',
        whyNeedIt: '标准形是二次型的最简形式，便于分析二次型的性质。',
        formula: 'f = \\lambda_1 y_1^2 + \\lambda_2 y_2^2 + \\cdots + \\lambda_n y_n^2',
        example: 'f(x,y) = x² + 4xy + y² 通过变换化为标准形 3u² - v²（特征值3和-1）。'
      },
      {
        id: 'canonical-form-quadratic',
        name: '二次型的规范形',
        category: '标准形',
        definition: '二次型的规范形是系数为±1或0的标准形：f = z₁² + ... + zₚ² - zₚ₊₁² - ... - zᵣ²，其中p是正惯性指数，r是秩。规范形唯一确定。',
        plainTranslation: '规范形是"系数只有±1或0的标准形"。正系数的个数叫正惯性指数，负系数的个数叫负惯性指数。规范形是唯一的，完全刻画二次型的类型。',
        whyNeedIt: '规范形是二次型的唯一标准形式，惯性指数是重要的不变量。',
        formula: 'f = z_1^2 + \\cdots + z_p^2 - z_{p+1}^2 - \\cdots - z_r^2',
        example: 'f(x,y) = x² - y² 的规范形就是它本身，正惯性指数=1，负惯性指数=1。'
      },
      {
        id: 'inertia-law',
        name: '惯性定理',
        category: '重要定理',
        definition: '惯性定理：二次型经任何可逆线性变换化为规范形时，正惯性指数p和负惯性指数q保持不变。p + q = r（秩），p - q称为符号差。',
        plainTranslation: '惯性定理说"正负系数的个数不变"。无论用什么坐标变换，正平方项的个数和负平方项的个数都是固定的。这是二次型的内在性质。',
        whyNeedIt: '惯性定理是二次型理论的核心定理，保证了规范形的唯一性。',
        formula: 'p = \\text{正惯性指数}, \\quad q = \\text{负惯性指数}, \\quad p + q = r',
        example: 'f = x² + y² - z² 无论怎么变换，总有2个正项和1个负项。'
      },
      {
        id: 'positive-inertia-index',
        name: '正惯性指数',
        category: '惯性指数',
        definition: '正惯性指数p是二次型规范形中正平方项的个数，等于矩阵A的正特征值个数。',
        plainTranslation: '正惯性指数是"规范形中正系数的个数"。正惯性指数等于正特征值的个数。正惯性指数告诉我们二次型有多少"正方向"。',
        whyNeedIt: '正惯性指数是二次型的重要不变量，用于判断二次型的类型。',
        formula: 'p = \\text{正特征值个数}',
        example: '矩阵 [1 0; 0 -1] 的正惯性指数 = 1（一个正特征值）。'
      },
      {
        id: 'negative-inertia-index',
        name: '负惯性指数',
        category: '惯性指数',
        definition: '负惯性指数q是二次型规范形中负平方项的个数，等于矩阵A的负特征值个数。',
        plainTranslation: '负惯性指数是"规范形中负系数的个数"。负惯性指数等于负特征值的个数。负惯性指数告诉我们二次型有多少"负方向"。',
        whyNeedIt: '负惯性指数与正惯性指数一起完全刻画二次型的类型。',
        formula: 'q = \\text{负特征值个数}',
        example: '矩阵 [1 0; 0 -1] 的负惯性指数 = 1（一个负特征值）。'
      },
      {
        id: 'signature',
        name: '符号差',
        category: '惯性指数',
        definition: '符号差s = p - q，即正惯性指数减去负惯性指数。符号差是二次型的另一个不变量。',
        plainTranslation: '符号差是"正惯性指数减去负惯性指数"。符号差反映了二次型的"正负偏向"。符号差为正，正方向多；为负，负方向多。',
        whyNeedIt: '符号差是二次型的简化不变量，在某些应用中更方便。',
        formula: 's = p - q',
        example: 'f = x² + y² - z² 的符号差 = 2 - 1 = 1。'
      },
      {
        id: 'positive-definite-quadratic',
        name: '正定二次型',
        category: '定性分类',
        definition: '二次型 f(x) = xᵀAx 称为正定的，如果对所有非零向量x，有 f(x) > 0。等价于所有特征值为正，或正惯性指数等于n。',
        plainTranslation: '正定二次型是"对任何非零向量都是正数"的二次型。正定二次型的图像是开口向上的"碗"。正定二次型的矩阵所有特征值都是正的。',
        whyNeedIt: '正定二次型在优化（保证极小值）、协方差矩阵中有重要应用。',
        formula: 'f(\\vec{x}) > 0, \\forall \\vec{x} \\neq \\vec{0} \\Leftrightarrow \\lambda_i > 0',
        example: 'f(x,y) = x² + y² 是正定的，因为除原点外都是正数。'
      },
      {
        id: 'negative-definite-quadratic',
        name: '负定二次型',
        category: '定性分类',
        definition: '二次型 f(x) = xᵀAx 称为负定的，如果对所有非零向量x，有 f(x) < 0。等价于所有特征值为负，或负惯性指数等于n。',
        plainTranslation: '负定二次型是"对任何非零向量都是负数"的二次型。负定二次型的图像是开口向下的"倒碗"。负定二次型的矩阵所有特征值都是负的。',
        whyNeedIt: '负定二次型在优化中对应极大值。',
        formula: 'f(\\vec{x}) < 0, \\forall \\vec{x} \\neq \\vec{0} \\Leftrightarrow \\lambda_i < 0',
        example: 'f(x,y) = -x² - y² 是负定的，因为除原点外都是负数。'
      },
      {
        id: 'indefinite-quadratic',
        name: '不定二次型',
        category: '定性分类',
        definition: '二次型 f(x) = xᵀAx 称为不定的，如果存在x₁, x₂使得 f(x₁) > 0 且 f(x₂) < 0。等价于正负惯性指数都非零。',
        plainTranslation: '不定二次型是"既有正又有负"的二次型。不定二次型的图像是"马鞍面"。不定二次型的矩阵既有正特征值又有负特征值。',
        whyNeedIt: '不定二次型对应鞍点，在优化中需要特殊处理。',
        formula: '\\exists \\vec{x}_1, \\vec{x}_2: f(\\vec{x}_1) > 0, f(\\vec{x}_2) < 0',
        example: 'f(x,y) = x² - y² 是不定的，在(1,0)处为正，在(0,1)处为负。'
      },
      {
        id: 'positive-semidefinite-quadratic',
        name: '半正定二次型',
        category: '定性分类',
        definition: '二次型 f(x) = xᵀAx 称为半正定的，如果对所有向量x，有 f(x) ≥ 0。等价于所有特征值非负。',
        plainTranslation: '半正定二次型是"非负但不一定是正"的二次型。半正定二次型可以等于零（对某些非零向量）。半正定二次型的矩阵所有特征值都是非负的。',
        whyNeedIt: '半正定二次型在协方差矩阵、核方法中有重要应用。',
        formula: 'f(\\vec{x}) \\geq 0, \\forall \\vec{x} \\Leftrightarrow \\lambda_i \\geq 0',
        example: 'f(x,y) = x² 是半正定的，在y轴上等于零。'
      },
      {
        id: 'negative-semidefinite-quadratic',
        name: '半负定二次型',
        category: '定性分类',
        definition: '二次型 f(x) = xᵀAx 称为半负定的，如果对所有向量x，有 f(x) ≤ 0。等价于所有特征值非正。',
        plainTranslation: '半负定二次型是"非正但不一定是负"的二次型。半负定二次型可以等于零（对某些非零向量）。半负定二次型的矩阵所有特征值都是非正的。',
        whyNeedIt: '半负定二次型在优化分析中有应用。',
        formula: 'f(\\vec{x}) \\leq 0, \\forall \\vec{x} \\Leftrightarrow \\lambda_i \\leq 0',
        example: 'f(x,y) = -x² 是半负定的，在y轴上等于零。'
      },
      {
        id: 'orthogonal-transform-quadratic',
        name: '正交变换化简二次型',
        category: '化简方法',
        definition: '通过正交变换 x = Qy，二次型 f(x) = xᵀAx 化为标准形 f = λ₁y₁² + λ₂y₂² + ... + λₙyₙ²，其中λᵢ是A的特征值，Q的列是对应的正交特征向量。',
        plainTranslation: '正交变换是"用旋转把二次型化成标准形"。找到特征向量和特征值，用特征向量构造正交矩阵Q，变换后的二次型只有平方项，系数是特征值。',
        whyNeedIt: '正交变换保持向量长度，是化简二次型的标准方法。',
        formula: '\\vec{x} = Q\\vec{y}, \\quad f = \\lambda_1 y_1^2 + \\cdots + \\lambda_n y_n^2',
        example: 'f(x,y) = 5x² + 4xy + 2y² 通过正交变换化为 6y₁² + y₂²。'
      },
      {
        id: 'completing-square',
        name: '配方法化简二次型',
        category: '化简方法',
        definition: '配方法是通过对变量配方将二次型化为标准形的方法。先对x₁配方，再对x₂配方，以此类推。配方结果不唯一，但惯性指数不变。',
        plainTranslation: '配方法是"逐个变量配方"的化简方法。先消去x₁的交叉项，再消去x₂的交叉项，最后得到只有平方项的形式。配方简单直接，但结果依赖于配方顺序。',
        whyNeedIt: '配方法是化简二次型的基本方法，不需要求特征值。',
        formula: 'f = a(x_1 + \\frac{b}{a}x_2)^2 + (c - \\frac{b^2}{a})x_2^2',
        example: 'f(x,y) = x² + 2xy + y² = (x+y)²，配方后只有一项。'
      },
      {
        id: 'congruence-transform',
        name: '合同变换',
        category: '变换理论',
        definition: '矩阵A和B合同，如果存在可逆矩阵P使得 B = PᵀAP。合同变换保持二次型的秩和惯性指数。二次型的化简本质是找合同对角矩阵。',
        plainTranslation: '合同变换是"二次型坐标变换的矩阵形式"。两个矩阵合同，意味着它们表示同一个二次型，只是坐标系不同。合同变换保持惯性指数不变。',
        whyNeedIt: '合同关系是二次型分类的基础，合同标准形就是规范形。',
        formula: 'B = P^T A P, \\quad P \\text{ 可逆}',
        example: '矩阵 [1 0; 0 -1] 与 [2 0; 0 -3] 合同，惯性指数相同。'
      },
      {
        id: 'congruence-invariants',
        name: '合同不变量',
        category: '变换理论',
        definition: '合同变换下的不变量包括：秩、正惯性指数、负惯性指数、符号差。这些量完全决定二次型的类型。',
        plainTranslation: '合同不变量是"坐标变换下不变的量"。秩、正负惯性指数、符号差在合同变换下不变。两个二次型合同当且仅当它们的规范形相同。',
        whyNeedIt: '合同不变量是二次型分类的依据。',
        formula: 'A \\sim B \\Rightarrow \\text{rank, } p, q, s \\text{ 相同}',
        example: '秩为2、正惯性指数为1的二次型都是同一类（双曲型）。'
      },
      {
        id: 'quadric-curve-definition',
        name: '二次曲线的定义',
        category: '二次曲线',
        definition: '二次曲线是二次方程 Ax² + Bxy + Cy² + Dx + Ey + F = 0 的图形。二次曲线包括椭圆、双曲线、抛物线及退化情形。',
        plainTranslation: '二次曲线是"二次方程画出的曲线"。包括椭圆、双曲线、抛物线三种基本类型，还有退化情形（如两条直线）。二次曲线的形状由二次项系数决定。',
        whyNeedIt: '二次曲线是解析几何的核心内容，在物理、工程中有广泛应用。',
        formula: 'Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0',
        example: 'x² + y² = 1 是圆（椭圆的特例），x² - y² = 1 是双曲线。'
      },
      {
        id: 'quadric-curve-classification',
        name: '二次曲线的分类',
        category: '二次曲线',
        definition: '二次曲线按判别式 Δ = B² - 4AC 分类：Δ < 0 为椭圆型（含虚椭圆、点）；Δ = 0 为抛物型（含抛物线、两平行线）；Δ > 0 为双曲型（含双曲线、两相交直线）。',
        plainTranslation: '二次曲线分类看"判别式B²-4AC"。小于0是椭圆型（圆、椭圆、点）；等于0是抛物型（抛物线、两平行线）；大于0是双曲型（双曲线、两相交直线）。',
        whyNeedIt: '分类定理给出了判断二次曲线类型的简单方法。',
        formula: '\\Delta = B^2 - 4AC \\begin{cases} < 0 & \\text{椭圆型} \\\\ = 0 & \\text{抛物型} \\\\ > 0 & \\text{双曲型} \\end{cases}',
        example: 'x² + 2y² = 1：A=1, B=0, C=2，Δ = 0 - 8 = -8 < 0，椭圆型。'
      },
      {
        id: 'ellipse-equation',
        name: '椭圆方程',
        category: '二次曲线',
        definition: '标准椭圆方程：x²/a² + y²/b² = 1（a > b > 0）。椭圆的长轴长2a，短轴长2b，焦点在长轴上，焦距 c = √(a² - b²)。',
        plainTranslation: '椭圆是"到两焦点距离之和为常数的点的轨迹"。标准方程 x²/a² + y²/b² = 1，a是半长轴，b是半短轴。椭圆是"压扁的圆"。',
        whyNeedIt: '椭圆是最重要的二次曲线之一，在天体运动、光学中有重要应用。',
        formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1',
        example: 'x²/4 + y²/1 = 1 是长轴为4、短轴为2的椭圆。'
      },
      {
        id: 'hyperbola-equation',
        name: '双曲线方程',
        category: '二次曲线',
        definition: '标准双曲线方程：x²/a² - y²/b² = 1。双曲线有两支，渐近线为 y = ±(b/a)x。焦点在x轴上，焦距 c = √(a² + b²)。',
        plainTranslation: '双曲线是"到两焦点距离之差为常数的点的轨迹"。标准方程 x²/a² - y²/b² = 1，有两支，向渐近线无限延伸。双曲线是"开口的椭圆"。',
        whyNeedIt: '双曲线在导航、天体物理中有重要应用。',
        formula: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1',
        example: 'x²/4 - y²/1 = 1 是双曲线，渐近线 y = ±x/2。'
      },
      {
        id: 'parabola-equation',
        name: '抛物线方程',
        category: '二次曲线',
        definition: '标准抛物线方程：y² = 2px（开口向右）或 y = ax²（开口向上）。抛物线有一个焦点和一条准线，焦点到准线的距离为p。',
        plainTranslation: '抛物线是"到焦点和准线等距的点的轨迹"。标准方程 y² = 2px，焦点在(p/2, 0)，准线 x = -p/2。抛物线是"单支开口的曲线"。',
        whyNeedIt: '抛物线在抛体运动、天线设计中有重要应用。',
        formula: 'y^2 = 2px \\quad \\text{或} \\quad y = ax^2',
        example: 'y² = 4x 是抛物线，焦点在(1, 0)，准线 x = -1。'
      },
      {
        id: 'quadric-surface-definition',
        name: '二次曲面的定义',
        category: '二次曲面',
        definition: '二次曲面是三元二次方程的图形。一般形式：Ax² + By² + Cz² + Dxy + Eyz + Fzx + Gx + Hy + Iz + J = 0。',
        plainTranslation: '二次曲面是"三维空间中的二次图形"。包括椭球面、双曲面、抛物面等。二次曲面的形状由二次项系数决定。',
        whyNeedIt: '二次曲面是三维解析几何的核心内容，在物理、工程中有广泛应用。',
        formula: 'Ax^2 + By^2 + Cz^2 + Dxy + Eyz + Fzx + Gx + Hy + Iz + J = 0',
        example: 'x² + y² + z² = 1 是球面（椭球面的特例）。'
      },
      {
        id: 'ellipsoid',
        name: '椭球面',
        category: '二次曲面',
        definition: '椭球面标准方程：x²/a² + y²/b² + z²/c² = 1。椭球面是封闭曲面，三个半轴长分别为a, b, c。当a = b = c时为球面。',
        plainTranslation: '椭球面是"三维的椭圆"。标准方程 x²/a² + y²/b² + z²/c² = 1，像一个压扁或拉长的球。椭球面是封闭的，没有开口。',
        whyNeedIt: '椭球面在物理（等势面）、工程中有重要应用。',
        formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1',
        example: 'x²/4 + y²/1 + z²/1 = 1 是长轴为4的椭球面。'
      },
      {
        id: 'hyperboloid-one-sheet',
        name: '单叶双曲面',
        category: '二次曲面',
        definition: '单叶双曲面标准方程：x²/a² + y²/b² - z²/c² = 1。单叶双曲面是一张连通的曲面，形状像"冷却塔"。',
        plainTranslation: '单叶双曲面是"中间细两头粗的曲面"。标准方程 x²/a² + y²/b² - z²/c² = 1，像一个腰鼓或冷却塔。单叶双曲面是直纹面，可以由直线生成。',
        whyNeedIt: '单叶双曲面在建筑（冷却塔）、工程中有重要应用。',
        formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1',
        example: 'x² + y² - z² = 1 是单叶双曲面，可用直线生成。'
      },
      {
        id: 'hyperboloid-two-sheets',
        name: '双叶双曲面',
        category: '二次曲面',
        definition: '双叶双曲面标准方程：x²/a² + y²/b² - z²/c² = -1。双叶双曲面是两张分离的曲面，分别位于z轴正负方向。',
        plainTranslation: '双叶双曲面是"两片分离的曲面"。标准方程 x²/a² + y²/b² - z²/c² = -1，上下各一片，中间断开。双叶双曲面不是直纹面。',
        whyNeedIt: '双叶双曲面在物理（等势面）中有应用。',
        formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = -1',
        example: 'x² + y² - z² = -1 是双叶双曲面，上下两片。'
      },
      {
        id: 'elliptic-paraboloid',
        name: '椭圆抛物面',
        category: '二次曲面',
        definition: '椭圆抛物面标准方程：z = x²/a² + y²/b²。椭圆抛物面像"碗"的形状，开口向上。水平截面是椭圆。',
        plainTranslation: '椭圆抛物面是"碗形曲面"。标准方程 z = x²/a² + y²/b²，像一个碗。水平截面是椭圆，竖直截面是抛物线。卫星天线就是椭圆抛物面。',
        whyNeedIt: '椭圆抛物面在卫星天线、雷达中有重要应用。',
        formula: 'z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}',
        example: 'z = x² + y² 是旋转抛物面，水平截面是圆。'
      },
      {
        id: 'hyperbolic-paraboloid',
        name: '双曲抛物面',
        category: '二次曲面',
        definition: '双曲抛物面标准方程：z = x²/a² - y²/b²。双曲抛物面像"马鞍"的形状，也称马鞍面。',
        plainTranslation: '双曲抛物面是"马鞍形曲面"。标准方程 z = x²/a² - y²/b²，像马鞍。一个方向开口向上，另一个方向开口向下。双曲抛物面是直纹面。',
        whyNeedIt: '双曲抛物面在建筑（薄壳结构）中有重要应用。',
        formula: 'z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}',
        example: 'z = x² - y² 是双曲抛物面，两个方向开口相反。'
      },
      {
        id: 'cone',
        name: '锥面',
        category: '二次曲面',
        definition: '锥面标准方程：x²/a² + y²/b² - z²/c² = 0。锥面由过原点的直线（母线）组成，顶点在原点。',
        plainTranslation: '锥面是"由过顶点的直线组成的曲面"。标准方程 x²/a² + y²/b² - z²/c² = 0，像一个圆锥。锥面是退化二次曲面，介于单叶和双叶双曲面之间。',
        whyNeedIt: '锥面在光学（锥面镜）、几何中有重要应用。',
        formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 0',
        example: 'x² + y² - z² = 0 是圆锥面，顶点在原点。'
      },
      {
        id: 'cylinder',
        name: '柱面',
        category: '二次曲面',
        definition: '柱面是由平行于某方向的直线沿曲线移动形成的曲面。常见的有椭圆柱面、双曲柱面、抛物柱面。',
        plainTranslation: '柱面是"由平行直线组成的曲面"。把一条曲线沿着某个方向拉伸就得到柱面。椭圆柱面、双曲柱面、抛物柱面分别对应椭圆、双曲线、抛物线。',
        whyNeedIt: '柱面是退化二次曲面，在工程中有应用。',
        formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\text{（椭圆柱面）}',
        example: 'x² + y² = 1 是圆柱面，沿z轴无限延伸。'
      },
      {
        id: 'quadric-surface-classification',
        name: '二次曲面分类',
        category: '二次曲面',
        definition: '二次曲面按惯性指数分类：(p,q) = (3,0)椭球面；(2,1)单叶双曲面；(1,2)双叶双曲面；(2,0)椭圆抛物面；(1,1)双曲抛物面；(2,2)锥面等。',
        plainTranslation: '二次曲面分类看"惯性指数对(p,q)"。(3,0)是椭球面；(2,1)是单叶双曲面；(1,2)是双叶双曲面；(2,0)是椭圆抛物面；(1,1)是双曲抛物面。',
        whyNeedIt: '惯性指数分类给出了二次曲面的系统分类方法。',
        formula: '(p, q) \\text{ 决定曲面类型}',
        example: 'x² + y² + z² = 1 的惯性指数(3,0)，是椭球面。'
      },
      {
        id: 'ruled-surface',
        name: '直纹面',
        category: '曲面性质',
        definition: '直纹面是由直线（母线）移动形成的曲面。二次曲面中，单叶双曲面、双曲抛物面、锥面、柱面都是直纹面。',
        plainTranslation: '直纹面是"可以用直线生成的曲面"。单叶双曲面和双曲抛物面虽然弯曲，但确实可以由直线生成。这是它们的重要性质。',
        whyNeedIt: '直纹面性质在建筑结构中有重要应用。',
        formula: '\\text{直纹面：存在直线族 } \\vec{r}(u,v) = \\vec{a}(u) + v\\vec{b}(u)',
        example: '单叶双曲面 x² + y² - z² = 1 可以由两族直线生成。'
      },
      {
        id: 'principal-axis-transform',
        name: '主轴变换',
        category: '化简方法',
        definition: '主轴变换是通过坐标旋转消去二次型交叉项的方法。将二次型矩阵对角化，新坐标轴沿特征向量方向。',
        plainTranslation: '主轴变换是"把坐标轴转到特征向量方向"。通过旋转坐标系，使新坐标轴沿椭圆的长短轴方向，从而消去交叉项xy。',
        whyNeedIt: '主轴变换是化简二次曲线、二次曲面的标准方法。',
        formula: '\\vec{x} = Q\\vec{y}, \\quad Q \\text{ 的列是特征向量}',
        example: '椭圆 x² + xy + y² = 1 通过主轴变换化为标准形式。'
      },
      {
        id: 'center-of-quadric',
        name: '二次曲面的中心',
        category: '曲面性质',
        definition: '二次曲面的中心是使曲面关于它对称的点。中心型曲面（椭球面、双曲面）有唯一中心，非中心型（抛物面）无中心。',
        plainTranslation: '中心是"曲面的对称中心"。椭球面和双曲面有中心（原点），抛物面没有中心。有中心的曲面叫中心型曲面。',
        whyNeedIt: '中心是二次曲面的重要几何特征。',
        formula: '\\text{中心满足} \\nabla f = 0',
        example: '椭球面 x²/a² + y²/b² + z²/c² = 1 的中心是原点。'
      },
      {
        id: 'tangent-plane',
        name: '切平面',
        category: '曲面性质',
        definition: '二次曲面在点P的切平面是与曲面在该点相切的平面。切平面方程可通过将二次方程中的x²换成xx₀，x换成(x+x₀)/2得到。',
        plainTranslation: '切平面是"在曲面上某点与曲面相切的平面"。切平面在该点与曲面"刚好接触"，不穿过曲面。切平面的法向量就是曲面在该点的法向量。',
        whyNeedIt: '切平面是研究曲面局部性质的基础。',
        formula: 'f(x_0, y_0, z_0) + \\frac{\\partial f}{\\partial x}(x-x_0) + \\cdots = 0',
        example: '椭球面 x² + y² + z² = 1 在点(0,0,1)的切平面是 z = 1。'
      },
      {
        id: 'normal-line',
        name: '法线',
        category: '曲面性质',
        definition: '二次曲面在点P的法线是过P且垂直于切平面的直线。法线方向由梯度 ∇f 给出。',
        plainTranslation: '法线是"垂直于切平面的直线"。法线指向曲面的"外侧"（对于封闭曲面）。法线方向就是梯度方向。',
        whyNeedIt: '法线在光学反射、曲率计算中有重要应用。',
        formula: '\\vec{n} = \\nabla f = (\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z})',
        example: '椭球面 x² + y² + z² = 1 在点(0,0,1)的法线是z轴。'
      },
      {
        id: 'asymptotic-cone',
        name: '渐近锥面',
        category: '曲面性质',
        definition: '双曲面的渐近锥面是与双曲面无限接近的锥面。对于双曲面 x²/a² + y²/b² - z²/c² = ±1，渐近锥面是 x²/a² + y²/b² - z²/c² = 0。',
        plainTranslation: '渐近锥面是"双曲面的极限锥面"。双曲面无限延伸时，越来越接近它的渐近锥面。渐近锥面介于单叶和双叶双曲面之间。',
        whyNeedIt: '渐近锥面描述了双曲面的渐近行为。',
        formula: '\\text{双曲面} \\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = \\pm 1 \\text{ 的渐近锥面：} \\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 0',
        example: '单叶双曲面 x² + y² - z² = 1 的渐近锥面是 x² + y² - z² = 0。'
      },
      {
        id: 'application-optimization',
        name: '应用：优化问题',
        category: '应用',
        definition: '在多元函数优化中，海森矩阵（二阶导数矩阵）对应的二次型决定极值性质：正定对应极小值，负定对应极大值，不定对应鞍点。',
        plainTranslation: '优化问题中"二次型判断极值类型"。海森矩阵正定，局部极小；负定，局部极大；不定，鞍点。这是多元微积分的核心应用。',
        whyNeedIt: '二次型的定性判断是优化理论的基础。',
        formula: 'H \\text{ 正定} \\Rightarrow \\text{局部极小}',
        example: 'f(x,y) = x² + y² 在(0,0)处海森矩阵 [2 0; 0 2] 正定，是极小值点。'
      },
      {
        id: 'application-physics',
        name: '应用：物理中的势能',
        category: '应用',
        definition: '在物理中，势能函数在平衡点附近展开为二次型。势能极小（正定）对应稳定平衡，势能极大（负定）或不定对应不稳定平衡。',
        plainTranslation: '物理中"二次型判断平衡稳定性"。势能在平衡点附近是二次型。势能极小（碗底）是稳定平衡，势能极大（山顶）是不稳定平衡。',
        whyNeedIt: '二次型在物理稳定性分析中有重要应用。',
        formula: 'V \\approx \\frac{1}{2}\\vec{x}^T H \\vec{x}',
        example: '弹簧势能 V = (1/2)kx²，正定，对应稳定平衡。'
      },
      {
        id: 'application-statistics',
        name: '应用：统计学中的协方差',
        category: '应用',
        definition: '协方差矩阵是正定（或半正定）矩阵，对应的二次型 xᵀΣ⁻¹x 是马氏距离的平方。多元正态分布的等概率面是椭球面。',
        plainTranslation: '统计中"协方差矩阵定义二次型"。协方差矩阵正定，其逆矩阵定义马氏距离。多元正态分布的等高线是椭球，形状由协方差矩阵决定。',
        whyNeedIt: '二次型在多元统计分析中有核心地位。',
        formula: 'd_M^2 = (\\vec{x} - \\vec{\\mu})^T \\Sigma^{-1} (\\vec{x} - \\vec{\\mu})',
        example: '二元正态分布的等概率线是椭圆，主轴方向由协方差矩阵的特征向量决定。'
      }
    ] as Concept[]
  }
]

const ConceptTheorem: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id)
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const currentChapter = chapters.find(c => c.id === activeChapter)

  const allConcepts = chapters.flatMap(c => c.concepts)
  const filteredConcepts = searchQuery.trim()
    ? allConcepts.filter(c => 
        c.name.includes(searchQuery.trim()) ||
        c.category.includes(searchQuery.trim()) ||
        c.definition.includes(searchQuery.trim())
      )
    : currentChapter?.concepts || []

  return (
    <div className="concept-theorem">
      <div className="concept-sidebar">
        <div className="sidebar-header">
          <h2>章节导航</h2>
        </div>
        <div className="chapter-list">
          {chapters.map(chapter => (
            <button
              key={chapter.id}
              className={`chapter-item ${activeChapter === chapter.id ? 'active' : ''}`}
              onClick={() => {
                setActiveChapter(chapter.id)
                setExpandedConcept(null)
              }}
            >
              {chapter.name}
            </button>
          ))}
        </div>
      </div>

      <div className="concept-main">
        <div className="concept-search">
          <input
            type="text"
            placeholder="搜索概念名称、分类或定义..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <span className="search-count">
              找到 {filteredConcepts.length} 个结果
            </span>
          )}
        </div>
        <div className="concept-list">
          {filteredConcepts.map(concept => (
            <div
              key={concept.id}
              className={`concept-card ${expandedConcept === concept.id ? 'expanded' : ''}`}
            >
              <div
                className="concept-header"
                onClick={() => setExpandedConcept(expandedConcept === concept.id ? null : concept.id)}
              >
                <div className="concept-title">
                  <span className="concept-category">{concept.category}</span>
                  <h3>{concept.name}</h3>
                </div>
                <span className="expand-icon">{expandedConcept === concept.id ? '−' : '+'}</span>
              </div>

              {expandedConcept === concept.id && (
                <div className="concept-content">
                  {concept.formula && (
                    <div className="concept-formula">
                      <span className="formula-label">公式</span>
                      <div className="formula-display"><KatexFormula latex={concept.formula} displayMode={true} /></div>
                    </div>
                  )}

                  <div className="concept-section">
                    <h4>📐 数学定义</h4>
                    <p><TextWithLatex text={concept.definition} /></p>
                  </div>

                  <div className="concept-section">
                    <h4>💡 白话翻译</h4>
                    <p>{concept.plainTranslation}</p>
                  </div>

                  <div className="concept-section">
                    <h4>🎯 为什么需要它</h4>
                    <p>{concept.whyNeedIt}</p>
                  </div>

                  {concept.example && (
                    <div className="concept-section">
                      <h4>📝 示例</h4>
                      <p><TextWithLatex text={concept.example} /></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConceptTheorem
