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
    
    // 处理代码块 ```...```
    result = result.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="code-block"><code>${code.trim()}</code></pre>`
    })
    
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
    
    // 处理表格 - 改进的正则
    const tableRegex = /^\|(.+)\|\s*\n\|([-:\s|]+)\|\s*\n((?:\|.+\|\s*\n?)+)/gm
    result = result.replace(tableRegex, (match, header, separator, body) => {
      const headers = header.split('|').map((h: string) => h.trim()).filter((h: string) => h)
      const rows = body.trim().split('\n').map((row: string) => 
        row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell)
      )
      
      let table = '<div class="table-container"><table class="markdown-table"><thead><tr>'
      headers.forEach((h: string) => {
        table += `<th>${h}</th>`
      })
      table += '</tr></thead><tbody>'
      rows.forEach((row: string[]) => {
        table += '<tr>'
        row.forEach((cell: string) => {
          table += `<td>${cell}</td>`
        })
        table += '</tr>'
      })
      table += '</tbody></table></div>'
      return table
    })
    
    // 处理分隔线 ---
    result = result.replace(/^---$/gm, '<hr class="divider"/>')
    
    // 处理标题格式 **emoji 标题**
    result = result.replace(/^\*\*([🎯📐🎭🧩⚠️🔬🎓🚀🌟💡🏃📐📚🎮📌🔑🎯✨]+ .+?)\*\*/gm, '<h3 class="section-title">$1</h3>')
    
    // 处理普通加粗（非标题）
    result = result.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
    
    // 处理无序列表
    result = result.replace(/^- (.+)$/gm, '<li class="list-item">$1</li>')
    result = result.replace(/(<li class="list-item">.*<\/li>\s*\n?)+/g, (match) => {
      return `<ul class="bullet-list">${match}</ul>`
    })
    
    // 处理有序列表
    result = result.replace(/^\d+\. (.+)$/gm, '<li class="ordered-item">$1</li>')
    result = result.replace(/(<li class="ordered-item">.*<\/li>\s*\n?)+/g, (match) => {
      return `<ol class="numbered-list">${match}</ol>`
    })
    
    // 处理缩进列表项（用于方法步骤中的子项）
    result = result.replace(/^  - (.+)$/gm, '<li class="sub-list-item">$1</li>')
    
    // 处理段落（双换行）
    result = result.replace(/\n\n/g, '</p><p>')
    
    // 处理单换行
    result = result.replace(/\n/g, '<br/>')
    
    // 包裹在p标签中
    result = `<p>${result}</p>`
    
    // 清理空的p标签和嵌套问题
    result = result.replace(/<p>\s*<\/p>/g, '')
    result = result.replace(/<p>\s*<(div|table|hr|h3|ul|ol|pre)/g, '<$1')
    result = result.replace(/<\/(div|table|hr|h3|ul|ol|pre)>\s*<\/p>/g, '</$1>')
    
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
