declare module 'katex' {
  interface KatexOptions {
    displayMode?: boolean
    output?: string
    throwOnError?: boolean
    errorColor?: string
    trust?: boolean
    strict?: boolean | string
    macros?: Record<string, string>
  }
  
  function render(expression: string, element: HTMLElement, options?: KatexOptions): void
  function renderToString(expression: string, options?: KatexOptions): string
  
  export default { render, renderToString }
}

declare module 'react-katex' {
  import { ComponentType } from 'react'
  
  interface InlineMathProps {
    math: string
  }
  
  interface BlockMathProps {
    math: string
  }
  
  export const InlineMath: ComponentType<InlineMathProps>
  export const BlockMath: ComponentType<BlockMathProps>
}
