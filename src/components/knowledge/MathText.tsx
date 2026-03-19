import React, { useMemo } from 'react'
import katex from 'katex'

interface MathTextProps {
  text: string
  className?: string
}

// 解析并渲染包含 LaTeX 公式的文本
const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    let result = text
    
    // 处理块级公式 $$...$$
    result = result.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false,
          trust: true,
        })
        return `<div class="formula-block">${rendered}</div>`
      } catch {
        return `<div class="formula-block error">${formula}</div>`
      }
    })
    
    // 处理行内公式 $...$
    result = result.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      try {
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false,
          trust: true,
        })
        return `<span class="formula-inline">${rendered}</span>`
      } catch {
        return `<span class="formula-inline error">${formula}</span>`
      }
    })
    
    // 处理 Markdown 加粗
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // 处理换行
    result = result.replace(/\n\n/g, '</p><p>')
    result = result.replace(/\n/g, '<br/>')
    
    return result
  }, [text])

  return (
    <div 
      className={`math-text ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}

export default MathText
