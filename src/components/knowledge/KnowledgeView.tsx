import React, { useState, useEffect, useRef, useCallback } from 'react'
import { KnowledgePoint } from '@/types'
import { useAppStore } from '@/store'
import { Play, Pause, SkipForward, RotateCcw, SplitSquareHorizontal, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react'
import MathFormula from './MathFormula'
import MathText from './MathText'
import './KnowledgeView.css'

interface KnowledgeViewProps {
  knowledge: KnowledgePoint
}

const KnowledgeView: React.FC<KnowledgeViewProps> = ({ knowledge }) => {
  const { isPlaying, setPlaying, compareMode, toggleCompareMode, modelState, updateModelParams } = useAppStore()
  
  // 动画状态
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showFormula, setShowFormula] = useState(true)
  const [activeTab, setActiveTab] = useState<'explanation' | 'extension' | 'application' | 'method'>('explanation')
  const [compareType, setCompareType] = useState<'converge' | 'diverge'>('diverge')
  
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const compareCanvasRef = useRef<HTMLCanvasElement>(null)
  
  // 获取动画步骤
  const animations = knowledge.dimensions.model.animations
  const animationSteps = animations[0]?.steps || []
  
  // 获取滑块配置
  const sliders = knowledge.dimensions.model.config.sliders || []
  
  // 获取当前参数值
  const getParam = (id: string, defaultValue: number): number => {
    return modelState.params[id] ?? defaultValue
  }

  // 绘制数列极限主图
  const drawSequenceLimit = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, isCompare: boolean = false, compareType?: 'converge' | 'diverge') => {
    let n = getParam('n', 10)
    let epsilon = getParam('epsilon', 0.1)
    
    // 对比模式使用不同参数
    if (isCompare && compareType === 'diverge') {
      // 发散数列 (-1)^n
      n = Math.min(n, 50)
    }
    
    // 清空画布 - 留出底部信息栏空间
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    // 坐标系设置
    const padding = 50
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2
    const originX = padding
    const originY = canvasHeight - padding
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = originX + (graphWidth / 10) * i
      const y = originY - (graphHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }
    
    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX + graphWidth, originY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX, originY - graphHeight)
    ctx.stroke()
    
    // 箭头
    ctx.beginPath()
    ctx.moveTo(originX + graphWidth, originY)
    ctx.lineTo(originX + graphWidth - 10, originY - 5)
    ctx.lineTo(originX + graphWidth - 10, originY + 5)
    ctx.closePath()
    ctx.fillStyle = '#5D4037'
    ctx.fill()
    
    ctx.beginPath()
    ctx.moveTo(originX, originY - graphHeight)
    ctx.lineTo(originX - 5, originY - graphHeight + 10)
    ctx.lineTo(originX + 5, originY - graphHeight + 10)
    ctx.closePath()
    ctx.fill()
    
    // 坐标轴标签
    ctx.fillStyle = '#5D4037'
    ctx.font = '14px "Noto Serif SC", serif'
    ctx.fillText('n', originX + graphWidth - 10, originY + 25)
    ctx.fillText('xₙ', originX - 35, originY - graphHeight + 10)
    
    if (isCompare && compareType === 'diverge') {
      // 发散数列 (-1)^n
      ctx.fillStyle = '#C62828'
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.fillText('发散数列 xₙ = (-1)ⁿ', originX, 25)
      
      const scaleX = graphWidth / 50
      const scaleY = graphHeight / 4
      const limitY = originY - 2 * scaleY
      
      // 绘制点
      for (let i = 1; i <= Math.min(n, 50); i++) {
        const val = Math.pow(-1, i)
        const px = originX + i * scaleX
        const py = originY - (val + 2) * scaleY
        
        ctx.fillStyle = i % 2 === 0 ? '#C62828' : '#1565C0'
        ctx.beginPath()
        ctx.arc(px, py, 6, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // 底部信息栏
      ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
      ctx.fillRect(0, canvasHeight, width, infoBarHeight)
      ctx.strokeStyle = '#C4A77D'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight)
      ctx.lineTo(width, canvasHeight)
      ctx.stroke()
      
      ctx.fillStyle = '#3E2723'
      ctx.font = '13px "Noto Serif SC", serif'
      ctx.fillText(`n = ${n}`, 20, canvasHeight + 30)
      ctx.fillStyle = '#C62828'
      ctx.fillText('发散：无极限', 150, canvasHeight + 30)
      
    } else {
      // 收敛数列 1 + 1/n
      const scaleX = graphWidth / 100
      const scaleY = graphHeight / 2
      const limitY = originY - 1 * scaleY
      
      // 极限线 A=1
      ctx.strokeStyle = '#C62828'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(originX, limitY)
      ctx.lineTo(originX + graphWidth, limitY)
      ctx.stroke()
      ctx.setLineDash([])
      
      ctx.fillStyle = '#C62828'
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.fillText('A = 1 (极限)', originX + graphWidth - 90, limitY - 10)
      
      // ε 带
      ctx.fillStyle = 'rgba(21, 101, 192, 0.15)'
      ctx.fillRect(originX, limitY - epsilon * scaleY, graphWidth, epsilon * scaleY * 2)
      
      ctx.strokeStyle = '#1565C0'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(originX, limitY - epsilon * scaleY)
      ctx.lineTo(originX + graphWidth, limitY - epsilon * scaleY)
      ctx.moveTo(originX, limitY + epsilon * scaleY)
      ctx.lineTo(originX + graphWidth, limitY + epsilon * scaleY)
      ctx.stroke()
      ctx.setLineDash([])
      
      // 绘制数列点
      for (let i = 1; i <= n; i++) {
        const val = 1 + 1/i
        const px = originX + i * scaleX
        const py = originY - (val - 0) * scaleY
        
        const distToLimit = Math.abs(val - 1)
        ctx.fillStyle = distToLimit < epsilon ? '#558B2F' : '#D4A574'
        ctx.beginPath()
        ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // 当前点标注
      const currentVal = 1 + 1/n
      const px = originX + n * scaleX
      const py = originY - currentVal * scaleY
      
      ctx.fillStyle = '#C62828'
      ctx.beginPath()
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#3E2723'
      ctx.font = 'bold 13px "Noto Serif SC", serif'
      ctx.fillText(`(${n}, ${currentVal.toFixed(4)})`, px + 10, py - 10)
      
      // 计算N值
      const N = Math.ceil(1/epsilon)
      
      // N标记
      if (N <= 100) {
        const nPx = originX + N * scaleX
        ctx.strokeStyle = '#558B2F'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(nPx, originY)
        ctx.lineTo(nPx, originY - graphHeight)
        ctx.stroke()
        
        ctx.fillStyle = '#558B2F'
        ctx.font = 'bold 13px "Noto Serif SC", serif'
        ctx.fillText(`N=${N}`, nPx - 10, originY + 20)
      }
      
      // 底部信息栏
      ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
      ctx.fillRect(0, canvasHeight, width, infoBarHeight)
      ctx.strokeStyle = '#C4A77D'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight)
      ctx.lineTo(width, canvasHeight)
      ctx.stroke()
      
      // 横向排列信息
      ctx.fillStyle = '#3E2723'
      ctx.font = '13px "Noto Serif SC", serif'
      ctx.fillText(`n = ${n}`, 20, canvasHeight + 30)
      ctx.fillText(`xₙ = ${(1+1/n).toFixed(6)}`, 100, canvasHeight + 30)
      ctx.fillText(`ε = ${epsilon.toFixed(3)}`, 230, canvasHeight + 30)
      ctx.fillText(`N = ${N}`, 340, canvasHeight + 30)
      ctx.fillStyle = n >= N ? '#558B2F' : '#C62828'
      ctx.fillText(n >= N ? '✓ 满足条件' : `需 n ≥ ${N}`, 420, canvasHeight + 30)
    }
  }, [modelState.params])

  // 绘制导数几何意义
  const drawDerivative = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, isCompare: boolean = false) => {
    const x0 = getParam('x0', 1)
    const dx = getParam('dx', 1)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 35
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * scale, 0)
      ctx.lineTo(centerX + i * scale, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * scale)
      ctx.lineTo(width, centerY + i * scale)
      ctx.stroke()
    }
    
    // 坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, canvasHeight)
    ctx.stroke()
    
    // 绘制函数 y = x²
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale
      const y = x * x
      const py = centerY - y * scale
      if (py > 0 && py < canvasHeight) {
        if (px === 0 || (px > 0 && centerY - ((px-1-centerX)/scale)**2 * scale < 0)) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 计算点坐标
    const px = centerX + x0 * scale
    const py = centerY - x0 * x0 * scale
    const qx = centerX + (x0 + dx) * scale
    const qy = centerY - (x0 + dx) * (x0 + dx) * scale
    
    // 绘制割线
    const secantSlope = ((x0+dx)*(x0+dx) - x0*x0) / dx
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    ctx.moveTo(px - 100, py + secantSlope * 100)
    ctx.lineTo(qx + 50, qy - secantSlope * 50)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 绘制切线
    const tangentSlope = 2 * x0
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(px - 80, py + tangentSlope * 80)
    ctx.lineTo(px + 80, py - tangentSlope * 80)
    ctx.stroke()
    
    // 绘制点P
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(px, py, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(px, py, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // 绘制点Q
    if (dx > 0.01) {
      ctx.fillStyle = '#1565C0'
      ctx.beginPath()
      ctx.arc(qx, qy, 8, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#3E2723'
      ctx.font = 'bold 12px "Noto Serif SC", serif'
      ctx.fillText(`Q(${(x0+dx).toFixed(2)}, ${((x0+dx)*(x0+dx)).toFixed(2)})`, qx + 10, qy - 10)
    }
    
    // 标注P点
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`P(${x0.toFixed(1)}, ${(x0*x0).toFixed(2)})`, px + 15, py - 10)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    // 横向排列信息
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`切线斜率 f'(${x0.toFixed(1)}) = ${(2*x0).toFixed(4)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`割线斜率 = ${secantSlope.toFixed(4)}`, 250, canvasHeight + 30)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`Δx = ${dx.toFixed(4)}`, 450, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`差值 = ${Math.abs(secantSlope - 2*x0).toFixed(6)}`, 580, canvasHeight + 30)
  }, [modelState.params])

  // 主绘制函数
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    if (knowledge.id === 'sequence-limit') {
      drawSequenceLimit(ctx, rect.width, rect.height, false)
    } else if (knowledge.id === 'derivative-geometry') {
      drawDerivative(ctx, rect.width, rect.height, false)
    }
  }, [knowledge.id, drawSequenceLimit, drawDerivative])

  // 对比画布绘制
  const drawCompare = useCallback(() => {
    const canvas = compareCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    
    if (knowledge.id === 'sequence-limit') {
      drawSequenceLimit(ctx, rect.width, rect.height, true, compareType)
    } else if (knowledge.id === 'derivative-geometry') {
      drawDerivative(ctx, rect.width, rect.height, true)
    }
  }, [knowledge.id, drawSequenceLimit, drawDerivative, compareType])

  // 动画播放
  useEffect(() => {
    if (isPlaying && animationSteps.length > 0) {
      const stepInterval = 2000 / animationSpeed
      
      animationRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % animationSteps.length
          const step = animationSteps[next]
          if (step?.changes) {
            updateModelParams(step.changes)
          }
          return next
        })
      }, stepInterval)
    }
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isPlaying, animationSteps, animationSpeed, updateModelParams])

  // 步进
  const handleStepForward = () => {
    if (animationSteps.length === 0) return
    const next = (currentStep + 1) % animationSteps.length
    setCurrentStep(next)
    const step = animationSteps[next]
    if (step?.changes) {
      updateModelParams(step.changes)
    }
  }

  // 重置
  const handleReset = () => {
    setCurrentStep(0)
    setPlaying(false)
    sliders.forEach(s => {
      updateModelParams({ [s.id]: s.defaultValue })
    })
  }

  // 绘制
  useEffect(() => {
    draw()
  }, [draw])

  // 对比模式绘制
  useEffect(() => {
    if (compareMode) {
      // 延迟绘制对比画布
      setTimeout(() => drawCompare(), 100)
    }
  }, [compareMode, drawCompare])

  // 手势滑动控制
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (sliders.length === 0) return
    
    const slider = sliders[0]
    const delta = e.deltaY > 0 ? -slider.step : slider.step
    const newValue = Math.max(slider.min, Math.min(slider.max, getParam(slider.id, slider.defaultValue) + delta))
    updateModelParams({ [slider.id]: newValue })
  }

  return (
    <div className="knowledge-view">
      {/* 顶部核心公式 - 缩小 */}
      <div className="formula-header-compact">
        <div className="formula-left">
          <span className="formula-icon">📐</span>
          <h2>{knowledge.name}</h2>
          {showFormula && <MathFormula formula={knowledge.formula} size="small" />}
        </div>
        <button 
          className="toggle-formula-btn-small"
          onClick={() => setShowFormula(!showFormula)}
        >
          {showFormula ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* 主内容区 - 动态模型 */}
      <div className={`main-visualization ${compareMode ? 'compare-mode' : ''}`}>
        <div className="model-section">
          {/* 控制工具栏 */}
          <div className="control-toolbar">
            <div className="toolbar-left">
              <button 
                className={`control-btn ${isPlaying ? 'active' : ''}`}
                onClick={() => setPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? '暂停' : '播放'}
              </button>
              <button className="control-btn" onClick={handleStepForward}>
                <SkipForward size={16} />
                步进
              </button>
              <button className="control-btn" onClick={handleReset}>
                <RotateCcw size={16} />
                重置
              </button>
              <button 
                className={`control-btn ${compareMode ? 'active' : ''}`}
                onClick={toggleCompareMode}
              >
                <SplitSquareHorizontal size={16} />
                对比
              </button>
            </div>
            <div className="toolbar-right">
              {animationSteps.length > 0 && (
                <span className="step-counter">{currentStep + 1}/{animationSteps.length}</span>
              )}
            </div>
          </div>

          {/* 模型画布 */}
          <div className="canvas-container" onWheel={handleWheel}>
            <canvas ref={canvasRef} className="model-canvas" />
          </div>

          {/* 参数滑块区 */}
          <div className="sliders-panel">
            <div className="sliders-grid">
              {sliders.map((slider) => (
                <div key={slider.id} className="slider-item">
                  <label className="slider-label">{slider.label}</label>
                  <div className="slider-track">
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={getParam(slider.id, slider.defaultValue)}
                      onChange={(e) => updateModelParams({ [slider.id]: parseFloat(e.target.value) })}
                    />
                    <div className="slider-value">
                      {getParam(slider.id, slider.defaultValue).toFixed(slider.step < 1 ? 3 : 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 对比模式 - 第二个模型 */}
        {compareMode && (
          <div className="compare-section">
            <div className="compare-header">
              <span>🔄 对比视图</span>
              <select 
                className="compare-select"
                value={compareType}
                onChange={(e) => setCompareType(e.target.value as 'converge' | 'diverge')}
              >
                <option value="diverge">发散数列 (-1)ⁿ</option>
                <option value="converge">收敛数列 (对比参数)</option>
              </select>
            </div>
            <div className="compare-canvas">
              <canvas ref={compareCanvasRef} className="model-canvas" />
            </div>
          </div>
        )}
      </div>

      {/* 下方内容标签页 - 全宽 */}
      <div className="content-tabs-full">
        <div className="tabs-header">
          {[
            { key: 'explanation', label: '📖 讲解' },
            { key: 'extension', label: '💡 延伸' },
            { key: 'application', label: '🌟 应用' },
            { key: 'method', label: '📝 方法' },
          ].map((tab) => (
            <button 
              key={tab.key} 
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tabs-content-wide">
          {/* 讲解内容 */}
          {activeTab === 'explanation' && (
            <div className="explanation-content">
              <div className="definition-box">
                <MathText text={knowledge.dimensions.explanation.mainText} />
              </div>
            </div>
          )}
          
          {/* 延伸内容 */}
          {activeTab === 'extension' && (
            <div className="extension-content">
              <div className="extension-section">
                <h3>🔍 核心内涵</h3>
                <MathText text={knowledge.dimensions.extension.essence} />
              </div>
              <div className="extension-section">
                <h3>📚 拓广延伸</h3>
                <MathText text={knowledge.dimensions.extension.extension} />
              </div>
            </div>
          )}
          
          {/* 应用实例 */}
          {activeTab === 'application' && (
            <div className="application-content">
              {knowledge.dimensions.applications.map((app, index) => (
                <div key={app.id} className="application-card">
                  <div className="application-card__header">
                    <span className={`app-type-badge ${app.type}`}>
                      {app.type === 'real' ? '🏠 现实应用' : '🔬 研究应用'}
                    </span>
                    <span className="app-number">#{index + 1}</span>
                  </div>
                  <h4 className="application-card__title">{app.title}</h4>
                  <MathText text={app.description} className="application-card__content" />
                  {app.scenario && (
                    <div className="application-card__scenario">
                      <span>💡 场景演示：</span>
                      <p>{app.scenario}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* 做题方法 */}
          {activeTab === 'method' && (
            <div className="method-content">
              <div className="method-card-enhanced">
                <div className="method-header">
                  <h3>🎯 极简三步做题法</h3>
                  <div className="method-actions">
                    <button className="method-action-btn">⭐ 收藏</button>
                    <button className="method-action-btn">📥 导出</button>
                  </div>
                </div>
                {knowledge.dimensions.method.map((step) => (
                  <div key={step.number} className="method-step">
                    <div className="method-step__number">{step.number}</div>
                    <div className="method-step__content">
                      <div className="method-step__title">{step.title}</div>
                      <MathText text={step.description} className="method-step__desc" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeView
