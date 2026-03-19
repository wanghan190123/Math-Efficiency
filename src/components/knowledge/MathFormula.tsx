import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathFormulaProps {
  formula: string
  displayMode?: boolean
  size?: 'small' | 'normal' | 'large'
  className?: string
}

const MathFormula: React.FC<MathFormulaProps> = ({ 
  formula, 
  displayMode = true,
  size = 'normal',
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const sizeStyles = {
    small: { fontSize: '1.1em' },
    normal: { fontSize: '1.5em' },
    large: { fontSize: '2em' },
  }

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
          strict: false,
        })
      } catch (error) {
        console.error('KaTeX render error:', error)
        if (containerRef.current) {
          containerRef.current.textContent = formula
        }
      }
    }
  }, [formula, displayMode])

  return (
    <div 
      ref={containerRef} 
      className={`math-formula ${className}`}
      style={{
        ...sizeStyles[size],
        color: 'var(--color-text-formula)',
      }}
    />
  )
}

export default MathFormula
