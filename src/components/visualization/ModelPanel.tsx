import React, { useRef, useEffect, useCallback } from 'react'
import { ModelConfig } from '@/types'
import { useAppStore } from '@/store'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface ModelPanelProps {
  config: ModelConfig
}

const ModelPanel: React.FC<ModelPanelProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { modelState, updateModelParams } = useAppStore()
  
  // 获取当前参数值
  const getParam = (id: string, defaultValue: number): number => {
    return modelState.params[id] ?? defaultValue
  }

  // 绘制数学图形
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 清空画布
    ctx.fillStyle = 'var(--color-bg-primary)'
    ctx.fillRect(0, 0, width, height)
    
    // 坐标系设置
    const centerX = width / 2
    const centerY = height / 2
    const scale = 50 * modelState.zoom
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let x = 0; x < width; x += scale) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += scale) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    // 绘制坐标轴
    ctx.strokeStyle = 'var(--color-border-dark)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()
    
    // 绘制函数
    if (config.functions) {
      config.functions.forEach((func) => {
        if (!func.visible) return
        
        ctx.strokeStyle = func.color
        ctx.lineWidth = 3
        ctx.beginPath()
        
        for (let px = 0; px < width; px++) {
          const x = (px - centerX) / scale
          let y: number
          
          // 简单的函数解析
          if (func.expression.includes('x^2')) {
            y = x * x
          } else if (func.expression.includes('1/x')) {
            y = x !== 0 ? 1 + 1/x : 0
          } else if (func.expression === 'x') {
            y = x
          } else {
            y = x
          }
          
          const py = centerY - y * scale
          
          if (px === 0) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }
        
        ctx.stroke()
      })
    }
    
    // 绘制极限演示点
    if (config.sliders) {
      const n = getParam('n', 10)
      const epsilon = getParam('epsilon', 0.1)
      const x0 = getParam('x0', 1)
      const dx = getParam('dx', 1)
      
      // 根据知识点类型绘制
      if (config.sliders.some(s => s.id === 'n')) {
        // 数列极限演示
        const xn = 1 + 1/n
        const pointX = centerX + n * scale / 10
        const pointY = centerY - xn * scale
        
        // 绘制极限线 A=1
        ctx.strokeStyle = 'var(--color-primary)'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(0, centerY - scale)
        ctx.lineTo(width, centerY - scale)
        ctx.stroke()
        ctx.setLineDash([])
        
        // 绘制ε区间
        ctx.fillStyle = 'rgba(212, 165, 116, 0.2)'
        ctx.fillRect(0, centerY - (1 + epsilon) * scale, width, epsilon * 2 * scale)
        
        // 绘制当前点
        ctx.fillStyle = '#C62828'
        ctx.beginPath()
        ctx.arc(pointX, pointY, 8, 0, Math.PI * 2)
        ctx.fill()
        
        // 标注
        ctx.fillStyle = 'var(--color-text-primary)'
        ctx.font = '14px var(--font-body)'
        ctx.fillText(`n = ${n.toFixed(0)}`, pointX + 12, pointY - 5)
        ctx.fillText(`xₙ = ${xn.toFixed(4)}`, pointX + 12, pointY + 15)
        ctx.fillText('A = 1', width - 50, centerY - scale - 10)
        ctx.fillText(`ε = ${epsilon.toFixed(2)}`, width - 60, centerY - (1 + epsilon) * scale - 5)
      }
      
      if (config.sliders.some(s => s.id === 'dx')) {
        // 导数几何意义演示
        const px = centerX + x0 * scale
        const py = centerY - x0 * x0 * scale
        const qx = centerX + (x0 + dx) * scale
        const qy = centerY - (x0 + dx) * (x0 + dx) * scale
        
        // 绘制切线
        const slope = 2 * x0 // 导数
        ctx.strokeStyle = '#C62828'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(px - 100, py + slope * 100)
        ctx.lineTo(px + 100, py - slope * 100)
        ctx.stroke()
        
        // 绘制割线
        ctx.strokeStyle = '#1565C0'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(qx, qy)
        ctx.stroke()
        ctx.setLineDash([])
        
        // 绘制点P和Q
        ctx.fillStyle = '#C62828'
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#1565C0'
        ctx.beginPath()
        ctx.arc(qx, qy, 8, 0, Math.PI * 2)
        ctx.fill()
        
        // 标注
        ctx.fillStyle = 'var(--color-text-primary)'
        ctx.font = '14px var(--font-body)'
        ctx.fillText(`P(${x0.toFixed(1)}, ${(x0*x0).toFixed(2)})`, px + 12, py - 5)
        ctx.fillText(`Q(${(x0+dx).toFixed(2)}, ${((x0+dx)*(x0+dx)).toFixed(2)})`, qx + 12, qy - 5)
        
        // 斜率信息
        const secantSlope = ((x0+dx)*(x0+dx) - x0*x0) / dx
        ctx.fillText(`切线斜率 f'(${x0.toFixed(1)}) = ${(2*x0).toFixed(2)}`, 20, 30)
        ctx.fillText(`割线斜率 = ${secantSlope.toFixed(4)}`, 20, 50)
        ctx.fillText(`Δx = ${dx.toFixed(3)}`, 20, 70)
      }
    }
  }, [config, modelState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    draw(ctx, rect.width, rect.height)
  }, [draw])

  const handleZoomIn = () => {
    updateModelParams({ zoom: Math.min(modelState.zoom * 1.2, 3) })
  }

  const handleZoomOut = () => {
    updateModelParams({ zoom: Math.max(modelState.zoom / 1.2, 0.5) })
  }

  const handleReset = () => {
    updateModelParams({ zoom: 1 })
  }

  return (
    <div className="dimension-panel">
      <div className="dimension-panel__header">
        <span className="dimension-panel__icon">📊</span>
        <span className="dimension-panel__title">动态模型</span>
      </div>
      <div className="dimension-panel__content" style={{ padding: 'var(--space-2)' }}>
        <div className="model-container">
          <canvas
            ref={canvasRef}
            className="model-container__canvas"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* 控制面板 */}
          <div style={{
            position: 'absolute',
            top: 'var(--space-2)',
            right: 'var(--space-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
          }}>
            <button
              className="control-btn"
              onClick={handleZoomIn}
              style={{ padding: 'var(--space-1)' }}
            >
              <ZoomIn size={16} />
            </button>
            <button
              className="control-btn"
              onClick={handleZoomOut}
              style={{ padding: 'var(--space-1)' }}
            >
              <ZoomOut size={16} />
            </button>
            <button
              className="control-btn"
              onClick={handleReset}
              style={{ padding: 'var(--space-1)' }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
          
          {/* 滑块控制 */}
          <div className="model-container__controls">
            {config.sliders?.map((slider) => (
              <div key={slider.id} className="slider-control">
                <label className="slider-control__label">{slider.label}</label>
                <input
                  type="range"
                  className="slider-control__input"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={getParam(slider.id, slider.defaultValue)}
                  onChange={(e) => updateModelParams({ [slider.id]: parseFloat(e.target.value) })}
                />
                <span className="slider-control__value">
                  {getParam(slider.id, slider.defaultValue).toFixed(slider.step < 1 ? 2 : 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelPanel
