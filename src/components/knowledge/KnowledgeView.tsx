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

  // 绘制函数极限
  const drawFunctionLimit = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const xVal = getParam('x', 1)
    const delta = getParam('delta', 0.5)
    const epsilon = getParam('epsilon', 0.2)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 40
    
    // 示例函数: f(x) = sin(x)/x 在 x→0 时极限为1
    const f = (x: number) => Math.abs(x) < 0.001 ? 1 : Math.sin(x) / x
    const A = 1  // 极限值
    const x0 = 0 // 极限点
    
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
    
    // 绘制 ε 带 (水平带)
    ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'
    ctx.fillRect(0, centerY - (A + epsilon) * scale, width, 2 * epsilon * scale)
    
    // 绘制 δ 邻域 (垂直带)
    ctx.fillStyle = 'rgba(21, 101, 192, 0.15)'
    ctx.fillRect(centerX - delta * scale, 0, 2 * delta * scale, canvasHeight)
    
    // 绘制函数曲线
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    let started = false
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale
      if (Math.abs(x) < 0.05) continue // 跳过原点附近
      const y = f(x)
      const py = centerY - y * scale
      if (py > 0 && py < canvasHeight) {
        if (!started) {
          ctx.moveTo(px, py)
          started = true
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 绘制极限点 A
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(centerX, centerY - A * scale, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px serif'
    ctx.fillText('A=1', centerX + 12, centerY - A * scale + 4)
    
    // 绘制当前点 (x, f(x))
    const currentX = xVal
    const currentY = f(currentX)
    const px = centerX + currentX * scale
    const py = centerY - currentY * scale
    
    ctx.fillStyle = '#1565C0'
    ctx.beginPath()
    ctx.arc(px, py, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // 绘制虚线到坐标轴
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, centerY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(centerX, py)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`x = ${currentX.toFixed(3)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`ε = ${epsilon.toFixed(3)}`, 150, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`δ = ${delta.toFixed(3)}`, 280, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`f(x) = ${currentY.toFixed(4)}`, 410, canvasHeight + 30)
    ctx.fillStyle = '#5D4037'
    const inEpsilon = Math.abs(currentY - A) < epsilon
    ctx.fillText(`|f(x)-A| < ε: ${inEpsilon ? '✓' : '✗'}`, 550, canvasHeight + 30)
  }, [modelState.params])

  // 绘制无穷小比较
  const drawInfinitesimal = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const t = getParam('t', 0.5)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 80
    
    // 三种无穷小：x, x², x³
    const f1 = (x: number) => x      // 一阶
    const f2 = (x: number) => x * x  // 二阶
    const f3 = (x: number) => x * x * x // 三阶
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
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
    
    // 绘制三条曲线
    const colors = ['#C62828', '#1565C0', '#558B2F']
    const labels = ['y = x (一阶)', 'y = x² (二阶)', 'y = x³ (三阶)']
    
    colors.forEach((color, idx) => {
      const fn = [f1, f2, f3][idx]
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let px = centerX; px < width; px++) {
        const x = (px - centerX) / scale
        const y = fn(x)
        const py = centerY - y * scale
        if (py > 0 && py < canvasHeight) {
          if (px === centerX) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }
      }
      ctx.stroke()
    })
    
    // 绘制当前点
    const xVal = t
    const y1 = f1(xVal), y2 = f2(xVal), y3 = f3(xVal)
    const px = centerX + xVal * scale
    
    // 绘制垂直参考线
    ctx.strokeStyle = 'rgba(93, 64, 55, 0.5)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(px, 0)
    ctx.lineTo(px, canvasHeight)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 绘制三个点
    const points = [
      { y: y1, color: colors[0], label: 'x' },
      { y: y2, color: colors[1], label: 'x²' },
      { y: y3, color: colors[2], label: 'x³' }
    ]
    
    points.forEach(p => {
      const py = centerY - p.y * scale
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // 图例
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    labels.forEach((label, idx) => {
      ctx.fillStyle = colors[idx]
      ctx.fillRect(width - 160, 20 + idx * 25, 15, 15)
      ctx.fillStyle = '#3E2723'
      ctx.fillText(label, width - 140, 33 + idx * 25)
    })
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`x = ${xVal.toFixed(4)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`x² = ${y2.toFixed(6)}`, 150, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`x³ = ${y3.toFixed(8)}`, 300, canvasHeight + 30)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`x→0时，高阶无穷小趋零更快`, 450, canvasHeight + 30)
  }, [modelState.params])

  // 绘制连续性
  const drawContinuity = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const xVal = getParam('x', 0)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 40
    
    // 示例函数：分段函数展示连续与间断
    // f(x) = { x²+1, x>=0; x-1, x<0 } 在 x=0 处间断
    const f = (x: number) => x >= 0 ? x * x + 1 : x - 1
    
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
    
    // 绘制函数 - 左半部分
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = 0; px < centerX; px++) {
      const x = (px - centerX) / scale
      const y = f(x)
      const py = centerY - y * scale
      if (py > 0 && py < canvasHeight) {
        if (px === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 绘制函数 - 右半部分
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = centerX; px < width; px++) {
      const x = (px - centerX) / scale
      const y = f(x)
      const py = centerY - y * scale
      if (py > 0 && py < canvasHeight) {
        if (px === centerX) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 标记间断点
    const leftLimit = f(-0.001) // 左极限 ≈ -1
    const rightLimit = f(0.001) // 右极限 = 1
    const funcValue = f(0) // 函数值 = 1
    
    // 左极限点 (空心)
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY - leftLimit * scale, 8, 0, Math.PI * 2)
    ctx.stroke()
    
    // 右极限点 (实心)
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(centerX, centerY - rightLimit * scale, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // 标注
    ctx.fillStyle = '#1565C0'
    ctx.font = 'bold 12px serif'
    ctx.fillText('左极限 = -1', centerX - 100, centerY - leftLimit * scale + 5)
    ctx.fillStyle = '#C62828'
    ctx.fillText('右极限 = 1', centerX + 15, centerY - rightLimit * scale + 5)
    
    // 当前点
    const currentY = f(xVal)
    const px = centerX + xVal * scale
    const py = centerY - currentY * scale
    
    ctx.fillStyle = '#558B2F'
    ctx.beginPath()
    ctx.arc(px, py, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // 虚线到坐标轴
    ctx.strokeStyle = '#558B2F'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, centerY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(centerX, py)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`x = ${xVal.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`f(x) = ${currentY.toFixed(2)}`, 130, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`跳跃间断点: 左极限≠右极限`, 280, canvasHeight + 30)
  }, [modelState.params])

  // 绘制一阶微分方程
  const drawFirstOrderODE = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const C = getParam('C', 1)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 30
    
    // 示例：dy/dx = y 的通解 y = Ce^x
    const f = (x: number, c: number) => c * Math.exp(x)
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -15; i <= 15; i++) {
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
    
    // 绘制方向场 (斜率场)
    ctx.strokeStyle = 'rgba(93, 64, 55, 0.4)'
    ctx.lineWidth = 1
    for (let i = -12; i <= 12; i++) {
      for (let j = -8; j <= 8; j++) {
        const x = i * 0.5
        const y = j * 0.5
        const slope = y  // dy/dx = y
        const len = 0.15
        
        const px = centerX + x * scale
        const py = centerY - y * scale
        
        // 绘制短斜线
        const dx = len * scale / Math.sqrt(1 + slope * slope)
        const dy = slope * dx
        
        ctx.beginPath()
        ctx.moveTo(px - dx/2, py + dy/2)
        ctx.lineTo(px + dx/2, py - dy/2)
        ctx.stroke()
      }
    }
    
    // 绘制多条解曲线
    const cValues = [-2, -1, 0, 1, 2]
    const colors = ['#1565C0', '#7B1FA2', '#558B2F', '#C62828', '#FF6F00']
    
    cValues.forEach((c, idx) => {
      ctx.strokeStyle = c === C ? colors[3] : colors[idx]
      ctx.lineWidth = c === C ? 4 : 2
      ctx.beginPath()
      let started = false
      for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale
        const y = f(x, c)
        const py = centerY - y * scale
        if (py > -50 && py < canvasHeight + 50) {
          if (!started) {
            ctx.moveTo(px, py)
            started = true
          } else {
            ctx.lineTo(px, py)
          }
        }
      }
      ctx.stroke()
    })
    
    // 标注当前选中的C值
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText(`当前解: y = ${C.toFixed(1)}e^x`, 20, 30)
    
    // 图例
    ctx.font = 'bold 12px serif'
    cValues.forEach((c, idx) => {
      ctx.fillStyle = colors[idx]
      ctx.fillRect(width - 100, 15 + idx * 20, 12, 12)
      ctx.fillStyle = '#3E2723'
      ctx.fillText(`C = ${c}`, width - 82, 25 + idx * 20)
    })
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`dy/dx = y`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`常数 C = ${C.toFixed(2)}`, 150, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`通解: y = Ce^x`, 320, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`滑动C改变解曲线`, 480, canvasHeight + 30)
  }, [modelState.params])

  // 绘制二阶微分方程
  const drawSecondOrderODE = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const p = getParam('p', 0)
    const q = getParam('q', 1)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 25
    
    // 计算特征根
    const discriminant = p * p - 4 * q
    
    // 通解函数
    const getSolution = (x: number): number => {
      if (discriminant > 0) {
        // 不等实根
        const r1 = (-p + Math.sqrt(discriminant)) / 2
        const r2 = (-p - Math.sqrt(discriminant)) / 2
        return Math.exp(r1 * x) + Math.exp(r2 * x)
      } else if (discriminant === 0) {
        // 重根
        const r = -p / 2
        return (1 + x) * Math.exp(r * x)
      } else {
        // 共轭复根
        const alpha = -p / 2
        const beta = Math.sqrt(-discriminant) / 2
        return Math.exp(alpha * x) * Math.cos(beta * x)
      }
    }
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -15; i <= 15; i++) {
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
    
    // 绘制解曲线
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    let started = false
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale
      const y = getSolution(x)
      const py = centerY - y * scale
      if (py > -50 && py < canvasHeight + 50) {
        if (!started) {
          ctx.moveTo(px, py)
          started = true
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 判断特征根类型并显示
    let rootType = ''
    let rootInfo = ''
    if (discriminant > 0) {
      const r1 = (-p + Math.sqrt(discriminant)) / 2
      const r2 = (-p - Math.sqrt(discriminant)) / 2
      rootType = '不等实根'
      rootInfo = `r₁ = ${r1.toFixed(2)}, r₂ = ${r2.toFixed(2)}`
    } else if (discriminant === 0) {
      const r = -p / 2
      rootType = '重根'
      rootInfo = `r = ${r.toFixed(2)}`
    } else {
      const alpha = -p / 2
      const beta = Math.sqrt(-discriminant) / 2
      rootType = '共轭复根'
      rootInfo = `α ± iβ = ${alpha.toFixed(2)} ± ${beta.toFixed(2)}i`
    }
    
    // 显示特征根类型
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText(`特征方程: r² + ${p.toFixed(1)}r + ${q.toFixed(1)} = 0`, 20, 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`${rootType}: ${rootInfo}`, 20, 55)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`y'' + ${p.toFixed(1)}y' + ${q.toFixed(1)}y = 0`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`${rootType}`, 250, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`Δ = p² - 4q = ${discriminant.toFixed(2)}`, 380, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`调节p,q观察解的变化`, 550, canvasHeight + 30)
  }, [modelState.params])

  // 绘制求导法则
  const drawDerivativeRules = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 30
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -12; i <= 12; i++) {
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
    
    // 绘制多条函数曲线展示乘法法则
    // f(x) = x²
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale
      const y = x * x
      const py = centerY - y * scale
      if (py > 0 && py < canvasHeight) {
        if (px === 0 || centerY - ((px-1-centerX)/scale)**2 * scale < 0 || centerY - ((px-1-centerX)/scale)**2 * scale > canvasHeight) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // g(x) = e^x
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = centerX - 100; px < width; px++) {
      const x = (px - centerX) / scale
      const y = Math.exp(x)
      const py = centerY - y * scale
      if (py > -50 && py < canvasHeight + 50) {
        if (px === Math.floor(centerX - 100)) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // h(x) = x² × e^x (乘积)
    ctx.strokeStyle = '#558B2F'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = centerX - 50; px < width; px++) {
      const x = (px - centerX) / scale
      const y = x * x * Math.exp(x)
      const py = centerY - y * scale
      if (py > -50 && py < canvasHeight + 50) {
        if (px === Math.floor(centerX - 50)) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 图例
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    
    ctx.fillStyle = '#C62828'
    ctx.fillRect(20, 20, 15, 15)
    ctx.fillStyle = '#3E2723'
    ctx.fillText('f(x) = x²', 40, 33)
    
    ctx.fillStyle = '#1565C0'
    ctx.fillRect(20, 45, 15, 15)
    ctx.fillStyle = '#3E2723'
    ctx.fillText('g(x) = e^x', 40, 58)
    
    ctx.fillStyle = '#558B2F'
    ctx.fillRect(20, 70, 15, 15)
    ctx.fillStyle = '#3E2723'
    ctx.fillText('h(x) = x²·e^x', 40, 83)
    
    // 乘法法则公式
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px serif'
    ctx.fillText("(uv)' = u'v + uv'", width - 200, 35)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('乘积求导法则演示', 20, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`h'(x) = 2x·e^x + x²·e^x = e^x(x² + 2x)`, 200, canvasHeight + 30)
  }, [modelState.params])

  // 绘制隐函数与参数方程求导
  const drawImplicitParametric = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const t = getParam('t', Math.PI / 4)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 60
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -6; i <= 6; i++) {
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
    
    // 绘制单位圆 x = cos t, y = sin t
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, scale, 0, Math.PI * 2)
    ctx.stroke()
    
    // 当前点
    const px = centerX + Math.cos(t) * scale
    const py = centerY - Math.sin(t) * scale
    
    // 绘制切线
    // 参数方程求导：dy/dx = (dy/dt)/(dx/dt) = cos t / (-sin t) = -cot t
    const slope = -Math.cos(t) / Math.sin(t) // = -cot t
    const lineLen = 80
    
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(px - lineLen, py + slope * lineLen)
    ctx.lineTo(px + lineLen, py - slope * lineLen)
    ctx.stroke()
    
    // 绘制点
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
    
    // 标注
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 12px serif'
    ctx.fillText(`P(${Math.cos(t).toFixed(2)}, ${Math.sin(t).toFixed(2)})`, px + 12, py - 10)
    
    // 公式标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px serif'
    ctx.fillText('参数方程: x = cos t, y = sin t', 20, 30)
    ctx.fillText(`t = ${(t * 180 / Math.PI).toFixed(1)}°`, 20, 55)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText(`dy/dx = -cot t = ${slope.toFixed(3)}`, width - 200, 30)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('参数方程求导', 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`dx/dt = -sin t, dy/dt = cos t`, 180, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`切线斜率 = (dy/dt)/(dx/dt)`, 420, canvasHeight + 30)
  }, [modelState.params])

  // 绘制微分
  const drawDifferential = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const x0 = getParam('x0', 1)
    const dx = getParam('dx', 0.5)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 35
    
    // 示例函数 f(x) = x²
    const f = (x: number) => x * x
    
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
    
    // 绘制函数曲线
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale
      const y = f(x)
      const py = centerY - y * scale
      if (py > 0 && py < canvasHeight) {
        if (px === 0 || centerY - f((px-1-centerX)/scale) * scale < 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 计算点的坐标
    const px0 = centerX + x0 * scale
    const py0 = centerY - f(x0) * scale
    const px1 = centerX + (x0 + dx) * scale
    const py1 = centerY - f(x0 + dx) * scale
    
    // 绘制切线
    const slope = 2 * x0 // f'(x) = 2x
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(px0 - 60, py0 + slope * 60 * scale / scale)
    ctx.lineTo(px0 + 60, py0 - slope * 60 * scale / scale)
    ctx.stroke()
    
    // 计算 dy 和 Δy
    const dy = 2 * x0 * dx // 微分
    const delta_y = f(x0 + dx) - f(x0) // 实际增量
    
    // 绘制微分 dy（切线上的增量）
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(px1, py0 - dy * scale)
    ctx.lineTo(px1, py0)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 绘制实际增量 Δy
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(px0, py0)
    ctx.lineTo(px0, py1)
    ctx.stroke()
    
    // 绘制点
    ctx.fillStyle = '#5D4037'
    ctx.beginPath()
    ctx.arc(px0, py0, 8, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#1565C0'
    ctx.beginPath()
    ctx.arc(px1, py1, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // 标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 12px serif'
    ctx.fillText(`(${x0.toFixed(1)}, ${f(x0).toFixed(1)})`, px0 + 10, py0 - 10)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText(`dy = ${dy.toFixed(3)}`, px1 + 10, py0 - dy * scale / 2)
    
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`Δy = ${delta_y.toFixed(3)}`, px1 + 10, (py0 + py1) / 2)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`f(x) = x²`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`微分 dy = f'(x)dx = ${dy.toFixed(4)}`, 150, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`增量 Δy = ${delta_y.toFixed(4)}`, 380, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`误差 = ${(Math.abs(delta_y - dy)).toFixed(6)}`, 550, canvasHeight + 30)
  }, [modelState.params])

  // 绘制定积分定义（黎曼和逼近）
  const drawDefiniteIntegral = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 获取动态参数
    const n = Math.floor(getParam('n', 4))  // 分割数
    const a = getParam('a', 0)  // 积分下限
    const b = getParam('b', 2)  // 积分上限
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const padding = 50
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2
    
    // 坐标系原点（考虑积分下限a）
    const originX = padding - a * (graphWidth / (b - a + 1))
    const originY = canvasHeight - padding
    const scaleX = graphWidth / (b - a + 1)
    const scaleY = graphHeight / 6
    
    // 函数 f(x) = x²
    const f = (x: number) => x * x
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = padding + (graphWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvasHeight - padding)
      ctx.stroke()
    }
    for (let i = 0; i <= 6; i++) {
      const y = originY - scaleY * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }
    
    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, originY)
    ctx.lineTo(width - padding, originY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(originX, padding)
    ctx.lineTo(originX, canvasHeight - padding)
    ctx.stroke()
    
    // 箭头
    ctx.beginPath()
    ctx.moveTo(width - padding, originY)
    ctx.lineTo(width - padding - 10, originY - 5)
    ctx.lineTo(width - padding - 10, originY + 5)
    ctx.closePath()
    ctx.fillStyle = '#5D4037'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(originX, padding)
    ctx.lineTo(originX - 5, padding + 10)
    ctx.lineTo(originX + 5, padding + 10)
    ctx.closePath()
    ctx.fill()
    
    // 绘制刻度
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.textAlign = 'center'
    for (let x = Math.ceil(a); x <= Math.floor(b) + 1; x++) {
      const px = originX + x * scaleX
      if (px >= padding && px <= width - padding) {
        ctx.fillText(`${x}`, px, originY + 20)
      }
    }
    ctx.fillText('x', width - padding - 5, originY - 15)
    ctx.fillText('y', originX + 15, padding + 5)
    
    // 绘制函数曲线 y = x²
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    let firstPoint = true
    for (let px = padding; px <= width - padding; px++) {
      const x = (px - originX) / scaleX
      if (x >= a - 0.5 && x <= b + 0.5) {
        const y = f(x)
        const py = originY - y * scaleY
        if (py > padding - 20 && py < canvasHeight - padding + 20) {
          if (firstPoint) {
            ctx.moveTo(px, py)
            firstPoint = false
          } else {
            ctx.lineTo(px, py)
          }
        }
      }
    }
    ctx.stroke()
    
    // 计算黎曼和（使用中点法）
    const dx = (b - a) / n
    let riemannSum = 0
    
    // 绘制黎曼和矩形（填充）
    for (let i = 0; i < n; i++) {
      const xLeft = a + i * dx
      const xRight = xLeft + dx
      const xMid = (xLeft + xRight) / 2  // 中点法
      const yMid = f(xMid)
      riemannSum += yMid * dx
      
      // 矩形位置
      const pxLeft = originX + xLeft * scaleX
      const pxRight = originX + xRight * scaleX
      const pyTop = originY - yMid * scaleY
      
      // 填充矩形
      ctx.fillStyle = 'rgba(33, 150, 243, 0.4)'
      ctx.fillRect(pxLeft, pyTop, pxRight - pxLeft, originY - pyTop)
      
      // 矩形边框
      ctx.strokeStyle = '#1976D2'
      ctx.lineWidth = 1.5
      ctx.strokeRect(pxLeft, pyTop, pxRight - pxLeft, originY - pyTop)
    }
    
    // 绘制积分区域边界线
    ctx.strokeStyle = '#FF9800'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    const paX = originX + a * scaleX
    const pbX = originX + b * scaleX
    ctx.beginPath()
    ctx.moveTo(paX, originY)
    ctx.lineTo(paX, originY - f(a) * scaleY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(pbX, originY)
    ctx.lineTo(pbX, originY - f(b) * scaleY)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 计算精确积分值
    const exactValue = (b * b * b - a * a * a) / 3  // ∫x²dx = x³/3
    
    // 显示信息
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.textAlign = 'left'
    ctx.fillText('定积分的黎曼和逼近', 20, 35)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#1976D2'
    ctx.fillText(`分割数 n = ${n}`, 20, 60)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`区间 [${a.toFixed(1)}, ${b.toFixed(1)}]`, 20, 85)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText(`黎曼和 S = ${riemannSum.toFixed(4)}`, 200, 60)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`精确值 ∫ = ${exactValue.toFixed(4)}`, 200, 85)
    ctx.fillStyle = '#FF9800'
    ctx.fillText(`误差 = ${Math.abs(riemannSum - exactValue).toFixed(6)}`, 380, 60)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('∫ₐᵇ f(x)dx = lim Σ f(ξᵢ)Δx', 20, canvasHeight + 30)
    ctx.fillStyle = '#1976D2'
    ctx.fillText(`Δx = ${dx.toFixed(4)}`, 250, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('f(x) = x²', 380, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('n→∞时黎曼和→精确值', 480, canvasHeight + 30)
  }, [modelState.params])

  // 绘制不定积分
  const drawIndefiniteIntegral = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const C = getParam('C', 0)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 30
    
    // 原函数族 F(x) = x² + C
    const F = (x: number, c: number) => x * x + c
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -12; i <= 12; i++) {
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
    
    // 绘制多条原函数曲线（不同C值）
    const cValues = [-3, -1.5, 0, 1.5, 3]
    const colors = ['rgba(21, 101, 192, 0.3)', 'rgba(21, 101, 192, 0.5)', 'rgba(21, 101, 192, 0.4)', 'rgba(21, 101, 192, 0.5)', 'rgba(21, 101, 192, 0.3)']
    
    cValues.forEach((c, idx) => {
      ctx.strokeStyle = c === C ? '#C62828' : colors[idx]
      ctx.lineWidth = c === C ? 4 : 2
      ctx.beginPath()
      for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale
        const y = F(x, c)
        const py = centerY - y * scale
        if (py > -50 && py < canvasHeight + 50) {
          if (px === 0) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }
      }
      ctx.stroke()
    })
    
    // 显示公式
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('∫ 2x dx = x² + C', 20, 30)
    
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px serif'
    ctx.fillText(`当前: F(x) = x² + (${C.toFixed(1)})`, 20, 55)
    
    // 图例说明
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 12px serif'
    ctx.fillText('原函数族：一族平行的抛物线', width - 220, 30)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('不定积分 = 原函数族', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`C = ${C.toFixed(2)}`, 200, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('滑动C观察曲线平移', 350, canvasHeight + 30)
  }, [modelState.params])

  // 绘制换元积分法
  const drawSubstitution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const u = getParam('u', 1)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 30
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -12; i <= 12; i++) {
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
    
    // 示例：∫ 2x·cos(x²) dx
    // 设 u = x²，展示换元过程
    
    // 绘制原函数（x坐标）和变换后的u坐标的对应关系
    // 当 x = √u 时
    
    // 绘制 cos(u) 在 u 空间中的图像
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let pu = centerX; pu < width; pu++) {
      const uVal = (pu - centerX) / scale
      const y = Math.cos(uVal)
      const py = centerY - y * scale * 2
      if (py > 0 && py < canvasHeight) {
        if (pu === centerX) {
          ctx.moveTo(pu, py)
        } else {
          ctx.lineTo(pu, py)
        }
      }
    }
    ctx.stroke()
    
    // 绘制当前点
    const pu = centerX + u * scale
    const py = centerY - Math.cos(u) * scale * 2
    
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(pu, py, 10, 0, Math.PI * 2)
    ctx.fill()
    
    // 绘制对应的x值
    const xVal = Math.sqrt(u)
    const px = centerX + xVal * scale
    
    ctx.fillStyle = '#558B2F'
    ctx.beginPath()
    ctx.arc(px, py, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // 连线表示对应关系
    ctx.strokeStyle = 'rgba(93, 64, 55, 0.5)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(pu, py)
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.setLineDash([])
    
    // 公式标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('∫ 2x·cos(x²) dx 换元示例', 20, 30)
    
    ctx.fillStyle = '#1565C0'
    ctx.font = 'bold 13px serif'
    ctx.fillText('设 u = x²', 20, 55)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText(`u = ${u.toFixed(2)}`, pu + 15, py - 5)
    
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`x = √u = ${xVal.toFixed(2)}`, px + 10, py + 20)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('换元: u = x², du = 2x dx', 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('原积分 = ∫ cos(u) du = sin(u) + C', 280, canvasHeight + 30)
  }, [modelState.params])

  // 绘制分部积分法
  const drawIntegrationByParts = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 25
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -15; i <= 15; i++) {
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
    
    // 示例：∫ x·e^x dx
    // u = x, dv = e^x dx
    
    // 绘制被积函数 x·e^x
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = centerX - 50; px < width; px++) {
      const x = (px - centerX) / scale
      const y = x * Math.exp(x)
      const py = centerY - y * scale
      if (py > -50 && py < canvasHeight + 50) {
        if (px === Math.floor(centerX - 50)) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    
    // 绘制分部积分后的结果：xe^x - e^x
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    for (let px = centerX - 30; px < width; px++) {
      const x = (px - centerX) / scale
      const y = (x - 1) * Math.exp(x)
      const py = centerY - y * scale
      if (py > -50 && py < canvasHeight + 50) {
        if (px === Math.floor(centerX - 30)) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()
    ctx.setLineDash([])
    
    // 公式标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('∫ x·e^x dx 分部积分', 20, 30)
    
    ctx.font = 'bold 12px serif'
    ctx.fillText('设 u = x, dv = e^x dx', 20, 55)
    ctx.fillText('则 du = dx, v = e^x', 20, 75)
    
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px serif'
    ctx.fillText('∫ u dv = uv - ∫ v du', width - 200, 30)
    ctx.fillText('= x·e^x - ∫ e^x dx', width - 200, 55)
    ctx.fillText('= e^x(x - 1) + C', width - 200, 80)
    
    // 图例
    ctx.fillStyle = '#5D4037'
    ctx.fillRect(20, canvasHeight - 60, 15, 15)
    ctx.fillStyle = '#3E2723'
    ctx.fillText('被积函数 x·e^x', 40, canvasHeight - 48)
    
    ctx.strokeStyle = '#C62828'
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    ctx.moveTo(20, canvasHeight - 30)
    ctx.lineTo(35, canvasHeight - 30)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#3E2723'
    ctx.fillText('原函数 e^x(x-1)', 40, canvasHeight - 25)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('分部积分: 把难积的转化为易积的', 20, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText('"反对幂三指" 选择u', 320, canvasHeight + 30)
  }, [modelState.params])

  // 二重积分可视化
  // 3D投影辅助函数
  const project3D = (x: number, y: number, z: number, centerX: number, centerY: number, scale: number, angleX: number = -0.5, angleY: number = 0.5) => {
    // 等轴测投影
    const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
    const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
    return { px, py }
  }

  // 二重积分立体可视化 - 曲顶柱体
  const drawDoubleIntegral = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = getParam('n', 10)
    
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2 - 30
    const centerY = canvasHeight / 2 + 50
    const scale = 35
    
    const R = 2 // 积分区域半径
    
    // 绘制3D坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    // x轴
    const xEnd = project3D(3.5, 0, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('x', xEnd.px + 5, xEnd.py)
    
    // y轴
    const yEnd = project3D(0, 3.5, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    ctx.fillText('y', yEnd.px + 5, yEnd.py)
    
    // z轴
    const zEnd = project3D(0, 0, 5, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()
    ctx.fillText('z', zEnd.px + 5, zEnd.py + 5)
    
    // 绘制底面圆盘（xy平面）
    ctx.strokeStyle = '#8D6E63'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
      const x = R * Math.cos(theta)
      const y = R * Math.sin(theta)
      const { px, py } = project3D(x, y, 0, centerX, centerY, scale)
      if (theta === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
    
    // 填充底面
    ctx.fillStyle = 'rgba(141, 110, 99, 0.15)'
    ctx.beginPath()
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
      const x = R * Math.cos(theta)
      const y = R * Math.sin(theta)
      const { px, py } = project3D(x, y, 0, centerX, centerY, scale)
      if (theta === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
    
    // 绘制分割的小柱体
    const cellSize = (R * 2) / n
    const pillars: { x: number, y: number, h: number }[] = []
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = -R + i * cellSize + cellSize / 2
        const y = -R + j * cellSize + cellSize / 2
        
        // 检查是否在圆内
        if (x * x + y * y <= R * R) {
          const h = x * x + y * y // z = x² + y²
          pillars.push({ x, y, h })
        }
      }
    }
    
    // 按照从后到前的顺序绘制柱体（画家算法）
    pillars.sort((a, b) => (a.x + a.y) - (b.x + b.y))
    
    for (const pillar of pillars) {
      const { x, y, h } = pillar
      const half = cellSize * 0.4
      
      // 柱体四个角点
      const p1 = project3D(x - half, y - half, 0, centerX, centerY, scale)
      const p2 = project3D(x + half, y - half, 0, centerX, centerY, scale)
      const p3 = project3D(x + half, y + half, 0, centerX, centerY, scale)
      const p4 = project3D(x - half, y + half, 0, centerX, centerY, scale)
      const p5 = project3D(x - half, y - half, h, centerX, centerY, scale)
      const p6 = project3D(x + half, y - half, h, centerX, centerY, scale)
      const p7 = project3D(x + half, y + half, h, centerX, centerY, scale)
      const p8 = project3D(x - half, y + half, h, centerX, centerY, scale)
      
      // 根据高度着色
      const intensity = Math.min(1, h / 4)
      const baseColor = `rgba(212, 165, 116, ${0.5 + intensity * 0.4})`
      const sideColor = `rgba(180, 140, 90, ${0.4 + intensity * 0.4})`
      const topColor = `rgba(230, 200, 160, ${0.6 + intensity * 0.3})`
      
      // 绘制柱体侧面（右侧）
      ctx.fillStyle = sideColor
      ctx.beginPath()
      ctx.moveTo(p2.px, p2.py)
      ctx.lineTo(p3.px, p3.py)
      ctx.lineTo(p7.px, p7.py)
      ctx.lineTo(p6.px, p6.py)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(93, 64, 55, 0.4)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      
      // 绘制柱体侧面（前面）
      ctx.fillStyle = baseColor
      ctx.beginPath()
      ctx.moveTo(p3.px, p3.py)
      ctx.lineTo(p4.px, p4.py)
      ctx.lineTo(p8.px, p8.py)
      ctx.lineTo(p7.px, p7.py)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // 绘制柱体顶面
      ctx.fillStyle = topColor
      ctx.beginPath()
      ctx.moveTo(p5.px, p5.py)
      ctx.lineTo(p6.px, p6.py)
      ctx.lineTo(p7.px, p7.py)
      ctx.lineTo(p8.px, p8.py)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    
    // 绘制曲顶面轮廓线
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
      const x = R * Math.cos(theta)
      const y = R * Math.sin(theta)
      const z = x * x + y * y
      const { px, py } = project3D(x, y, z, centerX, centerY, scale)
      if (theta === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
    
    // 标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('曲顶柱体: 底面 D = {x²+y² ≤ 4}', 20, 25)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`曲面 z = x² + y²，分割 ${n}×${n}`, 20, 45)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('柱体高度 = 函数值', 20, 65)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('二重积分: 曲顶柱体体积', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('V = ∬_D f(x,y) dσ', 250, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`极坐标: ∫₀²π dθ ∫₀² r³ dr = 2π`, 420, canvasHeight + 30)
  }, [modelState.params])

  // 三重积分立体可视化 - 球体
  const drawTripleIntegral = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = getParam('n', 8)
    
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2 - 20
    const centerY = canvasHeight / 2 + 40
    const scale = 30
    const R = 2
    
    // 绘制3D坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    const xEnd = project3D(3.5, 0, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('x', xEnd.px + 5, xEnd.py)
    
    const yEnd = project3D(0, 3.5, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    ctx.fillText('y', yEnd.px + 5, yEnd.py)
    
    const zEnd = project3D(0, 0, 3.5, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()
    ctx.fillText('z', zEnd.px + 5, zEnd.py + 5)
    
    // 绘制球体切片（从底部到顶部）
    const slices: { z: number, r: number, alpha: number }[] = []
    for (let i = 0; i < n; i++) {
      const z = -R + (2 * R / n) * (i + 0.5)
      const r = Math.sqrt(R * R - z * z)
      slices.push({ z, r, alpha: 0.3 + (i / n) * 0.4 })
    }
    
    // 绘制下半球切片（从后到前）
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const slice = slices[i]
      const { px, py } = project3D(0, 0, slice.z, centerX, centerY, scale)
      
      // 绘制圆形切片
      ctx.fillStyle = `rgba(198, 40, 40, ${slice.alpha * 0.5})`
      ctx.strokeStyle = `rgba(198, 40, 40, ${slice.alpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(px, py, slice.r * scale * 0.85, slice.r * scale * 0.4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
    
    // 绘制赤道面（最大的切片）
    const equator = project3D(0, 0, 0, centerX, centerY, scale)
    ctx.fillStyle = 'rgba(212, 165, 116, 0.4)'
    ctx.strokeStyle = '#D4A574'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(equator.px, equator.py, R * scale * 0.85, R * scale * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // 绘制上半球切片
    for (let i = Math.floor(n / 2); i < n; i++) {
      const slice = slices[i]
      const { px, py } = project3D(0, 0, slice.z, centerX, centerY, scale)
      
      ctx.fillStyle = `rgba(21, 101, 192, ${slice.alpha * 0.5})`
      ctx.strokeStyle = `rgba(21, 101, 192, ${slice.alpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(px, py, slice.r * scale * 0.85, slice.r * scale * 0.4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
    
    // 绘制球体轮廓
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, R * scale * 0.85, R * scale * 0.6, 0, 0, Math.PI * 2)
    ctx.stroke()
    
    // 绘制经线
    ctx.strokeStyle = 'rgba(93, 64, 55, 0.4)'
    ctx.lineWidth = 1
    for (let angle = 0; angle < Math.PI; angle += Math.PI / 6) {
      ctx.beginPath()
      for (let phi = 0; phi <= Math.PI; phi += 0.1) {
        const x = R * Math.sin(phi) * Math.cos(angle)
        const y = R * Math.sin(phi) * Math.sin(angle)
        const z = R * Math.cos(phi)
        const { px, py } = project3D(x, y, z, centerX, centerY, scale)
        if (phi === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }
    
    // 绘制体积微元示意（一个小扇形区域）
    const theta0 = Math.PI / 4
    const phi0 = Math.PI / 3
    const dr = 0.4
    
    // 微元的各个点
    const points = [
      project3D(R * Math.sin(phi0) * Math.cos(theta0), R * Math.sin(phi0) * Math.sin(theta0), R * Math.cos(phi0), centerX, centerY, scale),
      project3D((R - dr) * Math.sin(phi0) * Math.cos(theta0), (R - dr) * Math.sin(phi0) * Math.sin(theta0), (R - dr) * Math.cos(phi0), centerX, centerY, scale),
    ]
    
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(points[0].px, points[0].py, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    ctx.font = 'bold 11px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('dV = r²sinφ dr dφ dθ', points[0].px - 50, points[0].py - 15)
    
    // 标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('球体: x² + y² + z² ≤ R²', 20, 25)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`切片层数: ${n}`, 20, 45)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('下半球/上半球用不同颜色', 20, 65)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('三重积分: 球体体积', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('V = ∫₀²π dθ ∫₀π sinφ dφ ∫₀R r² dr', 200, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('= 4πR³/3', 480, canvasHeight + 30)
  }, [modelState.params])

  // 第一型曲线积分可视化
  const drawLineIntegralType1 = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = getParam('n', 15)
    
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 50
    
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
    
    // 绘制曲线 L: 半圆弧
    const R = 2
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, R * scale, Math.PI, 0, false)
    ctx.stroke()
    
    // 绘制分割点
    ctx.fillStyle = '#C62828'
    for (let i = 0; i <= n; i++) {
      const t = Math.PI + (Math.PI * i / n)
      const x = centerX + R * scale * Math.cos(t)
      const y = centerY - R * scale * Math.sin(t)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 绘制函数值（以y值表示线密度）
    for (let i = 0; i < n; i++) {
      const t1 = Math.PI + (Math.PI * i / n)
      const t2 = Math.PI + (Math.PI * (i + 1) / n)
      const tm = (t1 + t2) / 2
      const y = R * Math.sin(tm)
      
      const x1 = centerX + R * scale * Math.cos(t1)
      const x2 = centerX + R * scale * Math.cos(t2)
      const y1 = centerY - R * scale * Math.sin(t1)
      const y2 = centerY - R * scale * Math.sin(t2)
      
      // 用颜色深浅表示函数值
      const intensity = y / R
      ctx.strokeStyle = `rgba(198, 40, 40, ${0.3 + intensity * 0.7})`
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    
    // 标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('曲线 L: 半圆弧 x² + y² = R², y ≥ 0', 20, 25)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`分段: ${n}`, 20, 45)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('第一型曲线积分: 曲线质量', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('颜色深浅 = 密度ρ = y', 280, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('ds = R·dθ', 480, canvasHeight + 30)
  }, [modelState.params])

  // 第二型曲线积分可视化
  const drawLineIntegralType2 = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = 40
    
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
    
    // 绘制向量场 F = (-y, x)
    ctx.strokeStyle = 'rgba(21, 101, 192, 0.4)'
    ctx.lineWidth = 1.5
    for (let i = -4; i <= 4; i++) {
      for (let j = -4; j <= 4; j++) {
        const x = centerX + i * scale
        const y = centerY - j * scale
        const Fx = -j * 10
        const Fy = i * 10
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Fx, y - Fy)
        ctx.stroke()
        // 箭头
        ctx.beginPath()
        ctx.moveTo(x + Fx, y - Fy)
        ctx.lineTo(x + Fx - 3, y - Fy + 3)
        ctx.moveTo(x + Fx, y - Fy)
        ctx.lineTo(x + Fx - 3, y - Fy - 3)
        ctx.stroke()
      }
    }
    
    // 绘制圆路径
    const R = 2
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, R * scale, 0, Math.PI * 2)
    ctx.stroke()
    
    // 绘制方向箭头
    ctx.fillStyle = '#C62828'
    const arrowAngle = Math.PI / 4
    const ax = centerX + R * scale * Math.cos(arrowAngle)
    const ay = centerY - R * scale * Math.sin(arrowAngle)
    ctx.beginPath()
    ctx.moveTo(ax + 10, ay - 10)
    ctx.lineTo(ax, ay)
    ctx.lineTo(ax - 10, ay - 10)
    ctx.fill()
    
    // 标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('向量场 F = (-y, x)', 20, 25)
    ctx.fillStyle = '#C62828'
    ctx.fillText('圆周 L (逆时针)', 20, 45)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('第二型曲线积分: 力沿曲线做功', 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('∮ F·dr = 2πR² (格林公式)', 320, canvasHeight + 30)
  }, [modelState.params])

  // 第一型曲面积分立体可视化
  const drawSurfaceIntegralType1 = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2 - 20
    const centerY = canvasHeight / 2 + 30
    const scale = 40
    const R = 2
    
    // 绘制3D坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    const xEnd = project3D(3, 0, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('x', xEnd.px + 5, xEnd.py)
    
    const yEnd = project3D(0, 3, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    ctx.fillText('y', yEnd.px + 5, yEnd.py)
    
    const zEnd = project3D(0, 0, 3, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()
    ctx.fillText('z', zEnd.px + 5, zEnd.py + 5)
    
    // 绘制球面网格片（用不同颜色显示面积微元）
    const nTheta = 12
    const nPhi = 8
    
    // 收集所有面片并按深度排序
    const patches: { theta: number, phi: number, dTheta: number, dPhi: number, depth: number, color: string }[] = []
    
    for (let i = 0; i < nTheta; i++) {
      for (let j = 0; j < nPhi; j++) {
        const theta = (i / nTheta) * Math.PI * 2
        const phi = (j / nPhi) * Math.PI
        const dTheta = (Math.PI * 2) / nTheta
        const dPhi = Math.PI / nPhi
        
        // 计算中心点深度用于排序
        const centerPhi = phi + dPhi / 2
        const centerTheta = theta + dTheta / 2
        const x = R * Math.sin(centerPhi) * Math.cos(centerTheta)
        const y = R * Math.sin(centerPhi) * Math.sin(centerTheta)
        const depth = x + y // 简化的深度
        
        // 根据phi值（纬度）着色，模拟密度分布
        const zPos = R * Math.cos(centerPhi)
        const intensity = Math.abs(zPos) / R
        const color = `rgba(${180 + intensity * 50}, ${120 + intensity * 40}, ${80 + intensity * 30}, ${0.4 + intensity * 0.3})`
        
        patches.push({ theta, phi, dTheta, dPhi, depth, color })
      }
    }
    
    // 按深度排序（从后到前绘制）
    patches.sort((a, b) => a.depth - b.depth)
    
    // 绘制面片
    for (const patch of patches) {
      const { theta, phi, dTheta, dPhi, color } = patch
      
      // 计算四个角点
      const p1 = project3D(
        R * Math.sin(phi) * Math.cos(theta),
        R * Math.sin(phi) * Math.sin(theta),
        R * Math.cos(phi),
        centerX, centerY, scale
      )
      const p2 = project3D(
        R * Math.sin(phi) * Math.cos(theta + dTheta),
        R * Math.sin(phi) * Math.sin(theta + dTheta),
        R * Math.cos(phi),
        centerX, centerY, scale
      )
      const p3 = project3D(
        R * Math.sin(phi + dPhi) * Math.cos(theta + dTheta),
        R * Math.sin(phi + dPhi) * Math.sin(theta + dTheta),
        R * Math.cos(phi + dPhi),
        centerX, centerY, scale
      )
      const p4 = project3D(
        R * Math.sin(phi + dPhi) * Math.cos(theta),
        R * Math.sin(phi + dPhi) * Math.sin(theta),
        R * Math.cos(phi + dPhi),
        centerX, centerY, scale
      )
      
      // 绘制面片
      ctx.fillStyle = color
      ctx.strokeStyle = 'rgba(93, 64, 55, 0.5)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(p1.px, p1.py)
      ctx.lineTo(p2.px, p2.py)
      ctx.lineTo(p3.px, p3.py)
      ctx.lineTo(p4.px, p4.py)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    
    // 高亮一个面积微元
    const highlightTheta = Math.PI / 4
    const highlightPhi = Math.PI / 3
    const hp1 = project3D(
      R * Math.sin(highlightPhi) * Math.cos(highlightTheta),
      R * Math.sin(highlightPhi) * Math.sin(highlightTheta),
      R * Math.cos(highlightPhi),
      centerX, centerY, scale
    )
    
    // 绘制高亮的面积微元
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)'
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(hp1.px, hp1.py, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // 标注面积微元
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 11px "Noto Serif SC", serif'
    ctx.fillText('dS = R²sinφ dφ dθ', hp1.px - 50, hp1.py - 20)
    
    // 绘制球面轮廓
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - R * 0.3 * scale, R * scale * 0.85, R * scale * 0.5, 0, 0, Math.PI * 2)
    ctx.stroke()
    
    // 标注
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('球面 Σ: x² + y² + z² = R²', 20, 25)
    ctx.fillStyle = '#C62828'
    ctx.fillText('颜色深浅 = 面密度 ρ(x,y,z)', 20, 45)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('黄色 = 面积微元 dS', 20, 65)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('第一型曲面积分: 曲面质量', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('M = ∬_Σ ρ dS', 250, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('球面积 = 4πR²', 420, canvasHeight + 30)
  }, [modelState.params])

  // 第二型曲面积分立体可视化
  const drawSurfaceIntegralType2 = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2 - 20
    const centerY = canvasHeight / 2 + 30
    const scale = 40
    const R = 2
    
    // 绘制3D坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    const xEnd = project3D(3, 0, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('x', xEnd.px + 5, xEnd.py)
    
    const yEnd = project3D(0, 3, 0, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    ctx.fillText('y', yEnd.px + 5, yEnd.py)
    
    const zEnd = project3D(0, 0, 3.5, centerX, centerY, scale)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()
    ctx.fillText('z', zEnd.px + 5, zEnd.py + 5)
    
    // 绘制球面（半透明）
    ctx.fillStyle = 'rgba(200, 180, 150, 0.15)'
    ctx.strokeStyle = '#8D6E63'
    ctx.lineWidth = 1
    
    // 绘制球面网格
    const nTheta = 16
    const nPhi = 10
    
    // 绘制经线
    for (let i = 0; i < nTheta; i++) {
      const theta = (i / nTheta) * Math.PI * 2
      ctx.beginPath()
      for (let j = 0; j <= nPhi; j++) {
        const phi = (j / nPhi) * Math.PI
        const x = R * Math.sin(phi) * Math.cos(theta)
        const y = R * Math.sin(phi) * Math.sin(theta)
        const z = R * Math.cos(phi)
        const p = project3D(x, y, z, centerX, centerY, scale)
        if (j === 0) ctx.moveTo(p.px, p.py)
        else ctx.lineTo(p.px, p.py)
      }
      ctx.stroke()
    }
    
    // 绘制纬线
    for (let j = 1; j < nPhi; j++) {
      const phi = (j / nPhi) * Math.PI
      ctx.beginPath()
      for (let i = 0; i <= nTheta; i++) {
        const theta = (i / nTheta) * Math.PI * 2
        const x = R * Math.sin(phi) * Math.cos(theta)
        const y = R * Math.sin(phi) * Math.sin(theta)
        const z = R * Math.cos(phi)
        const p = project3D(x, y, z, centerX, centerY, scale)
        if (i === 0) ctx.moveTo(p.px, p.py)
        else ctx.lineTo(p.px, p.py)
      }
      ctx.closePath()
      ctx.stroke()
    }
    
    // 绘制向量场 F = (x, y, z) 穿过球面
    // 向量场沿径向向外，与球面法向量同向
    const arrows: { x: number, y: number, z: number, depth: number }[] = []
    
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const theta = (i / 6) * Math.PI * 2
        const phi = Math.PI / 6 + (j / 4) * (Math.PI * 2 / 3)
        const x = R * Math.sin(phi) * Math.cos(theta)
        const y = R * Math.sin(phi) * Math.sin(theta)
        const z = R * Math.cos(phi)
        arrows.push({ x, y, z, depth: x + y })
      }
    }
    
    // 按深度排序
    arrows.sort((a, b) => a.depth - b.depth)
    
    // 绘制向量场箭头
    for (const arrow of arrows) {
      const { x, y, z } = arrow
      const p1 = project3D(x, y, z, centerX, centerY, scale)
      
      // 向量场 F = (x, y, z)，归一化后乘以长度
      const len = 0.6
      const Fx = x * len / R
      const Fy = y * len / R
      const Fz = z * len / R
      const p2 = project3D(x + Fx, y + Fy, z + Fz, centerX, centerY, scale)
      
      // 绘制向量（蓝色）
      ctx.strokeStyle = '#1565C0'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(p1.px, p1.py)
      ctx.lineTo(p2.px, p2.py)
      ctx.stroke()
      
      // 绘制箭头头部
      const angle = Math.atan2(p2.py - p1.py, p2.px - p1.px)
      ctx.fillStyle = '#1565C0'
      ctx.beginPath()
      ctx.moveTo(p2.px, p2.py)
      ctx.lineTo(p2.px - 8 * Math.cos(angle - 0.4), p2.py - 8 * Math.sin(angle - 0.4))
      ctx.lineTo(p2.px - 8 * Math.cos(angle + 0.4), p2.py - 8 * Math.sin(angle + 0.4))
      ctx.closePath()
      ctx.fill()
      
      // 在球面上绘制点
      ctx.fillStyle = '#C62828'
      ctx.beginPath()
      ctx.arc(p1.px, p1.py, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 高亮显示一个通量微元
    const highlightTheta = Math.PI / 3
    const highlightPhi = Math.PI / 2.5
    const hx = R * Math.sin(highlightPhi) * Math.cos(highlightTheta)
    const hy = R * Math.sin(highlightPhi) * Math.sin(highlightTheta)
    const hz = R * Math.cos(highlightPhi)
    const hp = project3D(hx, hy, hz, centerX, centerY, scale)
    
    // 绘制高亮区域
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)'
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(hp.px, hp.py, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // 标注
    ctx.font = 'bold 11px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('F·dS', hp.px - 15, hp.py - 22)
    
    // 绘制球面轮廓
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - R * 0.3 * scale, R * scale * 0.85, R * scale * 0.5, 0, 0, Math.PI * 2)
    ctx.stroke()
    
    // 标注外侧方向
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    const outerP = project3D(R * 1.3, 0, 0, centerX, centerY, scale)
    ctx.fillText('外侧 →', outerP.px, outerP.py)
    
    // 标题
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('向量场 F = (x, y, z) 穿过球面', 20, 25)
    ctx.fillStyle = '#C62828'
    ctx.fillText('红点 = 球面位置，蓝箭头 = 向量场', 20, 45)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('黄色 = 通量微元 F·dS', 20, 65)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('第二型曲面积分: 通量', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('div F = 3', 200, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('∯F·dS = 3 × (4πR³/3) = 4π', 300, canvasHeight + 30)
  }, [modelState.params])

  // 级数审敛法可视化
  const drawSeriesConvergence = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const scale = Math.min(width, height) / 3

    // 获取动态参数
    const maxN = Math.floor(getParam('n', 20))
    const r = getParam('r', 0.5)

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, centerY)
    ctx.lineTo(width - 20, centerY)
    ctx.moveTo(centerX, height - 30)
    ctx.lineTo(centerX, 30)
    ctx.stroke()

    // 绘制刻度
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    for (let i = 1; i <= 5; i++) {
      ctx.fillText(`${i}`, centerX + i * 40 - 3, centerY + 20)
      ctx.fillText(`-${i}`, centerX - i * 40 - 5, centerY + 20)
    }
    ctx.fillText('n', width - 25, centerY - 10)
    ctx.fillText('Sₙ', centerX + 10, 35)

    // 动态计算点间距
    const pointSpacing = Math.min(40, (width - 80) / (maxN + 2))

    // 绘制几何级数部分和
    const isConvergent = Math.abs(r) < 1
    const limit = isConvergent ? 1 / (1 - r) : null
    
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    let sum = 0
    for (let n = 0; n <= maxN; n++) {
      sum += Math.pow(r, n)
      const x = centerX + n * pointSpacing
      const y = centerY - sum * scale * 0.8
      
      if (n === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      
      // 绘制点，当前点更大
      ctx.fillStyle = n === maxN ? '#FF5722' : '#C62828'
      ctx.beginPath()
      ctx.arc(x, y, n === maxN ? 8 : 5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // 绘制收敛/发散线
    if (isConvergent && limit !== null) {
      ctx.strokeStyle = '#1565C0'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      const limitY = centerY - limit * scale * 0.8
      ctx.beginPath()
      ctx.moveTo(40, limitY)
      ctx.lineTo(width - 20, limitY)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#1565C0'
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.fillText(`S = ${limit.toFixed(2)} (极限)`, width - 140, limitY - 10)
    }

    // 绘制调和级数对比（发散）
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    let harmonicSum = 0
    const harmonicN = Math.min(maxN, 20)
    for (let n = 1; n <= harmonicN; n++) {
      harmonicSum += 1 / n
      const x = centerX + n * pointSpacing
      const y = centerY - harmonicSum * scale * 0.4
      
      if (n === 1) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      
      ctx.fillStyle = '#2E7D32'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // 动态信息显示
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`当前项数: n = ${maxN}`, 60, 50)
    ctx.fillText(`公比: r = ${r.toFixed(1)}`, 60, 75)
    ctx.fillText(`部分和: Sₙ = ${sum.toFixed(3)}`, 60, 100)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`● 几何级数 Σ(${r.toFixed(1)})ⁿ ${isConvergent ? '收敛' : '发散'}`, 60, height - 50)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('● 调和级数 Σ1/n 发散', 60, height - 30)
    
    ctx.fillStyle = '#5D4037'
    ctx.fillText('比值审敛法: lim|uₙ₊₁/uₙ| = ρ', 280, height - 50)
    ctx.fillText(`ρ = |r| = ${Math.abs(r).toFixed(1)} ${isConvergent ? '< 1 收敛' : '≥ 1 发散'}`, 280, height - 30)
  }, [modelState.params])

  // 幂级数可视化
  const drawPowerSeries = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const scale = Math.min(width, height) / 5

    // 获取动态参数
    const currentOrder = Math.floor(getParam('n', 5))

    // 辅助函数：阶乘
    const factorial = (n: number): number => {
      if (n <= 1) return 1
      let result = 1
      for (let i = 2; i <= n; i++) result *= i
      return result
    }

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(30, centerY)
    ctx.lineTo(width - 20, centerY)
    ctx.moveTo(centerX, height - 30)
    ctx.lineTo(centerX, 30)
    ctx.stroke()

    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('x', width - 25, centerY - 10)
    ctx.fillText('y', centerX + 10, 35)

    // 绘制真实函数 e^x
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = 30; px < width - 20; px++) {
      const x = (px - centerX) / scale
      const y = Math.exp(x)
      const py = centerY - y * scale * 0.3
      
      if (px === 30) {
        ctx.moveTo(px, Math.max(30, Math.min(height - 30, py)))
      } else {
        ctx.lineTo(px, Math.max(30, Math.min(height - 30, py)))
      }
    }
    ctx.stroke()

    // 绘制历史逼近（低阶，淡色）
    const historyColors = ['#FFCDD2', '#E1BEE7', '#C5CAE9', '#B2DFDB']
    for (let order = 1; order < currentOrder; order += 2) {
      const colorIdx = Math.floor(order / 2) % historyColors.length
      ctx.strokeStyle = historyColors[colorIdx]
      ctx.lineWidth = 1
      ctx.beginPath()
      
      for (let px = 30; px < width - 20; px++) {
        const x = (px - centerX) / scale
        let y = 0
        for (let n = 0; n <= order; n++) {
          y += Math.pow(x, n) / factorial(n)
        }
        const py = centerY - y * scale * 0.3
        
        if (px === 30) {
          ctx.moveTo(px, Math.max(30, Math.min(height - 30, py)))
        } else {
          ctx.lineTo(px, Math.max(30, Math.min(height - 30, py)))
        }
      }
      ctx.stroke()
    }

    // 绘制当前阶数的幂级数逼近（高亮）
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    for (let px = 30; px < width - 20; px++) {
      const x = (px - centerX) / scale
      let y = 0
      for (let n = 0; n <= currentOrder; n++) {
        y += Math.pow(x, n) / factorial(n)
      }
      const py = centerY - y * scale * 0.3
      
      if (px === 30) {
        ctx.moveTo(px, Math.max(30, Math.min(height - 30, py)))
      } else {
        ctx.lineTo(px, Math.max(30, Math.min(height - 30, py)))
      }
    }
    ctx.stroke()

    // 动态信息显示
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`eˣ 的泰勒展开`, 60, 50)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`当前阶数: n = ${currentOrder}`, 60, 75)
    
    // 显示泰勒展开式
    ctx.font = '14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    let expansion = 'eˣ ≈ '
    for (let n = 0; n <= Math.min(currentOrder, 4); n++) {
      expansion += n === 0 ? '1' : (n === 1 ? ' + x' : ` + x${n < 10 ? '⁰¹²³⁴⁵⁶⁷⁸⁹'[n] : `^${n}`}/${factorial(n)}`)
    }
    if (currentOrder > 4) expansion += ' + ...'
    ctx.fillText(expansion, 60, 100)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('—— eˣ 真实曲线', 60, height - 70)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`—— ${currentOrder}阶泰勒逼近`, 60, height - 50)
    ctx.fillStyle = '#888'
    ctx.fillText('---- 历史逼近（低阶）', 60, height - 30)
    
    ctx.fillStyle = '#5D4037'
    ctx.fillText('收敛半径 R = ∞', 300, height - 50)
    ctx.fillText('项数越多，逼近越精确', 300, height - 30)
  }, [modelState.params])

  // 傅里叶级数可视化
  const drawFourierSeries = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 获取动态参数
    const currentN = Math.floor(getParam('n', 3))
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = Math.min(width, canvasHeight) / 5

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(30, centerY)
    ctx.lineTo(width - 20, centerY)
    ctx.moveTo(centerX, 30)
    ctx.lineTo(centerX, canvasHeight - 10)
    ctx.stroke()

    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('x', width - 25, centerY - 10)
    ctx.fillText('y', centerX + 10, 35)
    ctx.fillText('-π', centerX - scale * Math.PI - 5, centerY + 20)
    ctx.fillText('π', centerX + scale * Math.PI - 5, centerY + 20)

    // 绘制方波（真实函数）
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    const period = 2 * Math.PI
    
    for (let px = 30; px < width - 20; px++) {
      const x = (px - centerX) / scale
      const normalizedX = ((x % period) + period) % period
      const y = normalizedX < Math.PI ? 1 : -1
      const py = centerY - y * scale * 0.8
      
      if (px === 30) {
        ctx.moveTo(px, py)
      } else {
        const prevX = ((px - 1 - centerX) / scale)
        const prevNormalizedX = ((prevX % period) + period) % period
        if ((prevNormalizedX < Math.PI) !== (normalizedX < Math.PI)) {
          // 在间断点处抬起笔
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()

    // 绘制历史逼近（淡色）
    for (let n = 1; n < currentN; n += 2) {
      ctx.strokeStyle = `rgba(229, 57, 53, ${0.1 + (n / currentN) * 0.3})`
      ctx.lineWidth = 1
      ctx.beginPath()
      
      for (let px = 30; px < width - 20; px++) {
        const x = (px - centerX) / scale
        let y = 0
        for (let k = 0; k < n; k++) {
          const term = 2 * k + 1
          y += Math.sin(term * x) / term
        }
        y *= 4 / Math.PI
        
        const py = centerY - y * scale * 0.8
        
        if (px === 30) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.stroke()
    }

    // 绘制当前傅里叶级数逼近（高亮）
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    for (let px = 30; px < width - 20; px++) {
      const x = (px - centerX) / scale
      // 方波傅里叶级数: 4/π * (sin x + sin 3x/3 + sin 5x/5 + ...)
      let y = 0
      for (let k = 0; k < currentN; k++) {
        const term = 2 * k + 1
        y += Math.sin(term * x) / term
      }
      y *= 4 / Math.PI
      
      const py = centerY - y * scale * 0.8
      
      if (px === 30) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.stroke()

    // 动态信息显示
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('方波的傅里叶级数逼近', 60, 50)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`当前谐波数: ${currentN} 项`, 60, 75)
    
    // 显示展开式
    ctx.font = '14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    let expansion = 'f(x) = 4/π ('
    for (let k = 0; k < Math.min(currentN, 3); k++) {
      const term = 2 * k + 1
      expansion += k === 0 ? `sin ${term}x/${term}` : ` + sin ${term}x/${term}`
    }
    if (currentN > 3) expansion += ' + ...'
    expansion += ')'
    ctx.fillText(expansion, 60, 100)

    // 吉布斯现象说明
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('—— 方波（原函数）', 60, canvasHeight - 90)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`—— ${currentN}项傅里叶逼近`, 60, canvasHeight - 70)
    ctx.fillStyle = '#888'
    ctx.fillText('---- 历史逼近（少项）', 60, canvasHeight - 50)
    
    ctx.fillStyle = '#FF9800'
    ctx.fillText('⚠️ 吉布斯现象：间断点约9%过冲', 280, canvasHeight - 70)
    ctx.fillStyle = '#5D4037'
    ctx.fillText('狄利克雷定理保证收敛', 280, canvasHeight - 50)
    ctx.fillText('间断点收敛于左右极限中点', 280, canvasHeight - 30)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('谐波数越多，逼近越精确', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('项数越多，计算越复杂', 250, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('实际应用中取适当项数即可', 450, canvasHeight + 30)
  }, [modelState.params])

  // 向量及其运算可视化
  const drawVectorOperations = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = Math.min(width, canvasHeight) / 5

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 绘制3D坐标轴（等轴测投影）
    const angleX = -0.5
    const angleY = 0.5

    const project3D = (x: number, y: number, z: number) => {
      const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
      const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
      return { px, py }
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    // X轴
    ctx.beginPath()
    const xStart = project3D(-3, 0, 0)
    const xEnd = project3D(3, 0, 0)
    ctx.moveTo(xStart.px, xStart.py)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('x', xEnd.px + 5, xEnd.py)

    // Y轴
    ctx.beginPath()
    const yStart = project3D(0, -3, 0)
    const yEnd = project3D(0, 3, 0)
    ctx.moveTo(yStart.px, yStart.py)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('y', yEnd.px + 5, yEnd.py)

    // Z轴
    ctx.beginPath()
    const zStart = project3D(0, 0, -3)
    const zEnd = project3D(0, 0, 3)
    ctx.moveTo(zStart.px, zStart.py)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#1565C0'
    ctx.fillText('z', zEnd.px + 5, zEnd.py - 5)

    // 向量 a = (2, 1, 1)
    const aEnd = project3D(2, 1, 1)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(aEnd.px, aEnd.py)
    ctx.stroke()
    
    // 向量 a 箭头
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(aEnd.px, aEnd.py, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('a⃗', aEnd.px + 8, aEnd.py - 5)

    // 向量 b = (1, 2, 1)
    const bEnd = project3D(1, 2, 1)
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(bEnd.px, bEnd.py)
    ctx.stroke()
    
    ctx.fillStyle = '#2E7D32'
    ctx.beginPath()
    ctx.arc(bEnd.px, bEnd.py, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('b⃗', bEnd.px + 8, bEnd.py - 5)

    // 绘制叉积 a × b
    const crossEnd = project3D(-1, 1, 3)
    ctx.strokeStyle = '#6A1B9A'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(crossEnd.px, crossEnd.py)
    ctx.stroke()
    ctx.setLineDash([])
    
    ctx.fillStyle = '#6A1B9A'
    ctx.beginPath()
    ctx.arc(crossEnd.px, crossEnd.py, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('a⃗×b⃗', crossEnd.px + 8, crossEnd.py - 5)

    // 绘制平行四边形（点积可视化）
    ctx.strokeStyle = '#FF8F00'
    ctx.lineWidth = 2
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(aEnd.px, aEnd.py)
    const abEnd = project3D(3, 3, 2)
    ctx.lineTo(abEnd.px, abEnd.py)
    ctx.lineTo(bEnd.px, bEnd.py)
    ctx.stroke()
    ctx.setLineDash([])

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText('a⃗ = (2, 1, 1)', 50, canvasHeight - 70)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('b⃗ = (1, 2, 1)', 50, canvasHeight - 50)
    ctx.fillStyle = '#6A1B9A'
    ctx.fillText('a⃗×b⃗ = (-1, 1, 3)', 50, canvasHeight - 30)
    
    ctx.fillStyle = '#5D4037'
    ctx.fillText('点积: a⃗·b⃗ = 2+2+1 = 5', 220, canvasHeight - 70)
    ctx.fillText('夹角: cosθ = 5/(√6·√6) = 5/6', 220, canvasHeight - 50)
    ctx.fillText('|a⃗×b⃗| = √11 (平行四边形面积)', 220, canvasHeight - 30)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('向量运算: 点积·叉积×', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('点积结果为标量', 220, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('叉积结果为向量', 380, canvasHeight + 30)
  }, [modelState.params])

  // 平面与直线可视化
  const drawPlaneAndLine = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = Math.min(width, canvasHeight) / 5

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 3D投影函数
    const angleX = -0.5
    const angleY = 0.5

    const project3D = (x: number, y: number, z: number) => {
      const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
      const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
      return { px, py }
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    // X轴
    ctx.beginPath()
    const xStart = project3D(-3, 0, 0)
    const xEnd = project3D(3, 0, 0)
    ctx.moveTo(xStart.px, xStart.py)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('x', xEnd.px + 5, xEnd.py)

    // Y轴
    ctx.beginPath()
    const yStart = project3D(0, -3, 0)
    const yEnd = project3D(0, 3, 0)
    ctx.moveTo(yStart.px, yStart.py)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('y', yEnd.px + 5, yEnd.py)

    // Z轴
    ctx.beginPath()
    const zStart = project3D(0, 0, -3)
    const zEnd = project3D(0, 0, 3)
    ctx.moveTo(zStart.px, zStart.py)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#1565C0'
    ctx.fillText('z', zEnd.px + 5, zEnd.py - 5)

    // 绘制平面 x + y + z = 2
    // 平面上的点：(2,0,0), (0,2,0), (0,0,2), (1,1,0), (1,0,1), (0,1,1)
    ctx.fillStyle = 'rgba(21, 101, 192, 0.2)'
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2
    
    const p1 = project3D(2, 0, 0)
    const p2 = project3D(0, 2, 0)
    const p3 = project3D(0, 0, 2)
    const p4 = project3D(2, 0, 0)
    
    ctx.beginPath()
    ctx.moveTo(p1.px, p1.py)
    ctx.lineTo(p2.px, p2.py)
    ctx.lineTo(p3.px, p3.py)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 法向量 n = (1, 1, 1)
    const nEnd = project3D(1.5, 1.5, 1.5)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(nEnd.px, nEnd.py)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(nEnd.px, nEnd.py, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('n⃗', nEnd.px + 8, nEnd.py - 5)

    // 绘制直线 (x-1)/1 = (y-1)/-1 = (z-1)/1
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 3
    ctx.beginPath()
    const l1 = project3D(0, 2, 0)
    const l2 = project3D(2, 0, 2)
    ctx.moveTo(l1.px, l1.py)
    ctx.lineTo(l2.px, l2.py)
    ctx.stroke()

    // 直线上的点
    const pointOnLine = project3D(1, 1, 1)
    ctx.fillStyle = '#2E7D32'
    ctx.beginPath()
    ctx.arc(pointOnLine.px, pointOnLine.py, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('P(1,1,1)', pointOnLine.px + 8, pointOnLine.py - 8)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#1565C0'
    ctx.fillText('平面: x + y + z = 2', 50, canvasHeight - 70)
    ctx.fillStyle = '#C62828'
    ctx.fillText('法向量: n⃗ = (1, 1, 1)', 50, canvasHeight - 50)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('直线: (x-1)/1 = (y-1)/-1 = (z-1)/1', 50, canvasHeight - 30)
    
    ctx.fillStyle = '#5D4037'
    ctx.fillText('点P到平面距离: |1+1+1-2|/√3 = 1/√3', 280, canvasHeight - 50)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('空间解析几何: 平面与直线', 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('平面法向量垂直于平面', 220, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('直线方向向量平行于直线', 420, canvasHeight + 30)
  }, [modelState.params])

  // 空间曲面可视化
  const drawSurfaces = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2 + 20
    const scale = Math.min(width, height) / 6

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 3D投影函数
    const angleX = -0.5
    const angleY = 0.5

    const project3D = (x: number, y: number, z: number) => {
      const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
      const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
      return { px, py }
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    
    // X轴
    ctx.beginPath()
    ctx.moveTo(project3D(-2.5, 0, 0).px, project3D(-2.5, 0, 0).py)
    ctx.lineTo(project3D(2.5, 0, 0).px, project3D(2.5, 0, 0).py)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.fillText('x', project3D(2.6, 0, 0).px, project3D(2.6, 0, 0).py)

    // Y轴
    ctx.beginPath()
    ctx.moveTo(project3D(0, -2.5, 0).px, project3D(0, -2.5, 0).py)
    ctx.lineTo(project3D(0, 2.5, 0).px, project3D(0, 2.5, 0).py)
    ctx.stroke()
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('y', project3D(0, 2.7, 0).px, project3D(0, 2.7, 0).py)

    // Z轴
    ctx.beginPath()
    ctx.moveTo(project3D(0, 0, -2).px, project3D(0, 0, -2).py)
    ctx.lineTo(project3D(0, 0, 2.5).px, project3D(0, 0, 2.5).py)
    ctx.stroke()
    ctx.fillStyle = '#1565C0'
    ctx.fillText('z', project3D(0, 0, 2.7).px, project3D(0, 0, 2.7).py)

    // 获取滑块参数
    const surfaceType = Math.floor(getParam('surfaceType', 0))
    const a = getParam('a', 2)
    const b = getParam('b', 1.5)
    const c = getParam('c', 1)

    // 曲面名称和颜色
    const surfaceNames = [
      '椭球面',
      '单叶双曲面',
      '双叶双曲面',
      '椭圆抛物面',
      '双曲抛物面(马鞍面)',
      '圆锥面',
      '圆柱面'
    ]
    const surfaceColors = [
      'rgba(21, 101, 192, 0.4)',
      'rgba(46, 125, 50, 0.4)',
      'rgba(198, 40, 40, 0.4)',
      'rgba(123, 31, 162, 0.4)',
      'rgba(255, 152, 0, 0.4)',
      'rgba(0, 151, 167, 0.4)',
      'rgba(233, 30, 99, 0.4)'
    ]
    const strokeColors = [
      '#1565C0',
      '#2E7D32',
      '#C62828',
      '#7B1FA2',
      '#FF9800',
      '#0097A7',
      '#E91E63'
    ]

    const points: { px: number; py: number; z: number; color: string }[] = []

    // 根据曲面类型生成点
    if (surfaceType === 0) {
      // 椭球面: x²/a² + y²/b² + z²/c² = 1
      for (let theta = 0; theta < Math.PI; theta += 0.12) {
        for (let phi = 0; phi < 2 * Math.PI; phi += 0.12) {
          const x = a * Math.sin(theta) * Math.cos(phi)
          const y = b * Math.sin(theta) * Math.sin(phi)
          const z = c * Math.cos(theta)
          const proj = project3D(x, y, z)
          points.push({ px: proj.px, py: proj.py, z, color: surfaceColors[0] })
        }
      }
    } else if (surfaceType === 1) {
      // 单叶双曲面: x²/a² + y²/b² - z²/c² = 1
      for (let v = -1.5; v <= 1.5; v += 0.1) {
        for (let u = 0; u < 2 * Math.PI; u += 0.15) {
          const x = a * Math.cosh(v) * Math.cos(u)
          const y = b * Math.cosh(v) * Math.sin(u)
          const z = c * Math.sinh(v)
          const proj = project3D(x, y, z)
          points.push({ px: proj.px, py: proj.py, z, color: surfaceColors[1] })
        }
      }
    } else if (surfaceType === 2) {
      // 双叶双曲面: x²/a² + y²/b² - z²/c² = -1
      for (let v = 0.3; v <= 1.5; v += 0.1) {
        for (let u = 0; u < 2 * Math.PI; u += 0.15) {
          // 上叶
          const x1 = a * Math.sinh(v) * Math.cos(u)
          const y1 = b * Math.sinh(v) * Math.sin(u)
          const z1 = c * Math.cosh(v)
          const proj1 = project3D(x1, y1, z1)
          points.push({ px: proj1.px, py: proj1.py, z: z1, color: surfaceColors[2] })
          // 下叶
          const z2 = -c * Math.cosh(v)
          const proj2 = project3D(x1, y1, z2)
          points.push({ px: proj2.px, py: proj2.py, z: z2, color: surfaceColors[2] })
        }
      }
    } else if (surfaceType === 3) {
      // 椭圆抛物面: x²/a² + y²/b² = z
      for (let u = 0; u < 2 * Math.PI; u += 0.15) {
        for (let r = 0; r <= 1.5; r += 0.1) {
          const x = r * a * Math.cos(u)
          const y = r * b * Math.sin(u)
          const z = r * r
          const proj = project3D(x, y, z)
          points.push({ px: proj.px, py: proj.py, z, color: surfaceColors[3] })
        }
      }
    } else if (surfaceType === 4) {
      // 双曲抛物面(马鞍面): x²/a² - y²/b² = z
      for (let u = -1.2; u <= 1.2; u += 0.08) {
        for (let v = -1.2; v <= 1.2; v += 0.08) {
          const x = u
          const y = v
          const z = (u * u) / (a * a) - (v * v) / (b * b)
          if (z > -2 && z < 2) {
            const proj = project3D(x, y, z)
            points.push({ px: proj.px, py: proj.py, z, color: surfaceColors[4] })
          }
        }
      }
    } else if (surfaceType === 5) {
      // 圆锥面: z² = x² + y²
      for (let v = -1.5; v <= 1.5; v += 0.1) {
        for (let u = 0; u < 2 * Math.PI; u += 0.15) {
          const r = Math.abs(v)
          const x = r * Math.cos(u)
          const y = r * Math.sin(u)
          const z = v
          const proj = project3D(x, y, z)
          points.push({ px: proj.px, py: proj.py, z, color: surfaceColors[5] })
        }
      }
    } else if (surfaceType === 6) {
      // 圆柱面: x² + y² = R²
      const R = a * 0.7
      for (let z = -1.5; z <= 1.5; z += 0.15) {
        for (let u = 0; u < 2 * Math.PI; u += 0.1) {
          const x = R * Math.cos(u)
          const y = R * Math.sin(u)
          const proj = project3D(x, y, z)
          points.push({ px: proj.px, py: proj.py, z, color: surfaceColors[6] })
        }
      }
    }

    // 按深度排序（画家算法）
    points.sort((p1, p2) => p1.z - p2.z)

    // 绘制曲面点
    points.forEach(p => {
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.px, p.py, 2.5, 0, Math.PI * 2)
      ctx.fill()
    })

    // 绘制特征截线
    ctx.lineWidth = 2
    ctx.strokeStyle = strokeColors[surfaceType]
    
    if (surfaceType === 0) {
      // 椭球面 - XY平面截线
      ctx.beginPath()
      for (let phi = 0; phi <= 2 * Math.PI; phi += 0.1) {
        const x = a * Math.cos(phi)
        const y = b * Math.sin(phi)
        const proj = project3D(x, y, 0)
        if (phi === 0) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.closePath()
      ctx.stroke()
    } else if (surfaceType === 1 || surfaceType === 2) {
      // 双曲面 - 腰部椭圆
      ctx.beginPath()
      for (let u = 0; u <= 2 * Math.PI; u += 0.1) {
        const x = a * Math.cos(u)
        const y = b * Math.sin(u)
        const proj = project3D(x, y, 0)
        if (u === 0) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.closePath()
      ctx.stroke()
    } else if (surfaceType === 3) {
      // 椭圆抛物面 - 顶点
      ctx.beginPath()
      ctx.arc(project3D(0, 0, 0).px, project3D(0, 0, 0).py, 4, 0, Math.PI * 2)
      ctx.fillStyle = strokeColors[surfaceType]
      ctx.fill()
    } else if (surfaceType === 4) {
      // 马鞍面 - 两直线（z=0截痕）
      ctx.beginPath()
      ctx.moveTo(project3D(-1.5, -1.5 * b / a, 0).px, project3D(-1.5, -1.5 * b / a, 0).py)
      ctx.lineTo(project3D(1.5, 1.5 * b / a, 0).px, project3D(1.5, 1.5 * b / a, 0).py)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(project3D(-1.5, 1.5 * b / a, 0).px, project3D(-1.5, 1.5 * b / a, 0).py)
      ctx.lineTo(project3D(1.5, -1.5 * b / a, 0).px, project3D(1.5, -1.5 * b / a, 0).py)
      ctx.stroke()
    } else if (surfaceType === 5) {
      // 圆锥面 - 顶点
      ctx.beginPath()
      ctx.arc(project3D(0, 0, 0).px, project3D(0, 0, 0).py, 4, 0, Math.PI * 2)
      ctx.fillStyle = strokeColors[surfaceType]
      ctx.fill()
    }

    // 图例和说明
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = strokeColors[surfaceType]
    ctx.fillText(surfaceNames[surfaceType], 20, height - 90)
    
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    
    // 曲面方程和说明
    const equations = [
      `方程: x²/${(a*a).toFixed(1)} + y²/${(b*b).toFixed(1)} + z²/${(c*c).toFixed(1)} = 1`,
      `方程: x²/${(a*a).toFixed(1)} + y²/${(b*b).toFixed(1)} - z²/${(c*c).toFixed(1)} = 1`,
      `方程: x²/${(a*a).toFixed(1)} + y²/${(b*b).toFixed(1)} - z²/${(c*c).toFixed(1)} = -1`,
      `方程: x²/${(a*a).toFixed(1)} + y²/${(b*b).toFixed(1)} = z`,
      `方程: x²/${(a*a).toFixed(1)} - y²/${(b*b).toFixed(1)} = z`,
      `方程: z² = x² + y²`,
      `方程: x² + y² = ${(a*a*0.49).toFixed(1)}`
    ]
    const descriptions = [
      '特征: 有界封闭曲面，三坐标面截得椭圆',
      '特征: 中间细、两头粗，像一个"沙漏"',
      '特征: 分上下两叶，中间有空隙',
      '特征: 像一个碗，开口向上，顶点在原点',
      '特征: 形如马鞍，z=0时截得两相交直线',
      '特征: 上下对称，过z轴的平面截得两直线',
      '特征: 母线平行z轴，无限延伸的圆筒'
    ]
    
    ctx.fillText(equations[surfaceType], 20, height - 70)
    ctx.fillText(descriptions[surfaceType], 20, height - 50)
    ctx.fillText(`参数: a=${a.toFixed(2)}, b=${b.toFixed(2)}, c=${c.toFixed(2)}`, 20, height - 30)
    
    // 截痕分析提示
    ctx.fillStyle = '#666'
    ctx.font = '11px "Noto Serif SC", serif'
    ctx.fillText('提示: 调节曲面类型滑块切换不同曲面', 280, height - 30)
  }, [modelState.params])

  // 多元函数基本概念可视化
  const drawMultivariableBasic = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2 + 20
    const scale = Math.min(width, canvasHeight) / 5

    // 获取动态参数
    const epsilon = getParam('epsilon', 0.5)
    const delta = getParam('delta', 0.3)

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 3D投影函数
    const angleX = -0.5
    const angleY = 0.5

    const project3D = (x: number, y: number, z: number) => {
      const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
      const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
      return { px, py }
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    
    // x轴
    const xStart = project3D(-2.5, 0, 0)
    const xEnd = project3D(2.5, 0, 0)
    ctx.beginPath()
    ctx.moveTo(xStart.px, xStart.py)
    ctx.lineTo(xEnd.px, xEnd.py)
    ctx.stroke()
    
    // y轴
    const yStart = project3D(0, -2.5, 0)
    const yEnd = project3D(0, 2.5, 0)
    ctx.beginPath()
    ctx.moveTo(yStart.px, yStart.py)
    ctx.lineTo(yEnd.px, yEnd.py)
    ctx.stroke()
    
    // z轴
    const zStart = project3D(0, 0, -0.5)
    const zEnd = project3D(0, 0, 2.5)
    ctx.beginPath()
    ctx.moveTo(zStart.px, zStart.py)
    ctx.lineTo(zEnd.px, zEnd.py)
    ctx.stroke()

    // 绘制函数曲面 z = x² + y²（抛物面）
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 1
    
    // 绘制等高线（圆形）
    for (let r = 0.5; r <= 2; r += 0.5) {
      ctx.beginPath()
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
        const x = r * Math.cos(angle)
        const y = r * Math.sin(angle)
        const z = r * r
        const p = project3D(x, y, z)
        if (angle === 0) {
          ctx.moveTo(p.px, p.py)
        } else {
          ctx.lineTo(p.px, p.py)
        }
      }
      ctx.stroke()
    }

    // 绘制径向线
    ctx.strokeStyle = '#42A5F5'
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      ctx.beginPath()
      for (let r = 0; r <= 2; r += 0.1) {
        const x = r * Math.cos(angle)
        const y = r * Math.sin(angle)
        const z = r * r
        const p = project3D(x, y, z)
        if (r === 0) {
          ctx.moveTo(p.px, p.py)
        } else {
          ctx.lineTo(p.px, p.py)
        }
      }
      ctx.stroke()
    }

    // 绘制δ邻域（在xy平面上的圆）
    ctx.strokeStyle = '#FF9800'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
      const x = delta * Math.cos(angle)
      const y = delta * Math.sin(angle)
      const p = project3D(x, y, 0)
      if (angle === 0) {
        ctx.moveTo(p.px, p.py)
      } else {
        ctx.lineTo(p.px, p.py)
      }
    }
    ctx.stroke()
    
    // 填充δ邻域
    ctx.fillStyle = 'rgba(255, 152, 0, 0.2)'
    ctx.beginPath()
    for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
      const x = delta * Math.cos(angle)
      const y = delta * Math.sin(angle)
      const p = project3D(x, y, 0)
      if (angle === 0) {
        ctx.moveTo(p.px, p.py)
      } else {
        ctx.lineTo(p.px, p.py)
      }
    }
    ctx.closePath()
    ctx.fill()

    // 绘制趋近路径演示
    ctx.strokeStyle = '#E53935'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    
    // 路径1：沿y=kx趋近
    ctx.beginPath()
    for (let t = delta; t >= 0; t -= 0.05) {
      const x = t
      const y = t // k=1
      const z = x*x + y*y
      const p = project3D(x, y, z)
      if (t === delta) {
        ctx.moveTo(p.px, p.py)
      } else {
        ctx.lineTo(p.px, p.py)
      }
    }
    ctx.stroke()

    // 路径2：沿y轴趋近
    ctx.strokeStyle = '#4CAF50'
    ctx.beginPath()
    for (let t = delta; t >= 0; t -= 0.05) {
      const x = 0
      const y = t
      const z = x*x + y*y
      const p = project3D(x, y, z)
      if (t === delta) {
        ctx.moveTo(p.px, p.py)
      } else {
        ctx.lineTo(p.px, p.py)
      }
    }
    ctx.stroke()
    
    // 路径3：螺旋趋近
    ctx.strokeStyle = '#9C27B0'
    ctx.beginPath()
    for (let angle = 0; angle <= Math.PI * 4; angle += 0.2) {
      const r = delta * (1 - angle / (Math.PI * 4))
      const x = r * Math.cos(angle)
      const y = r * Math.sin(angle)
      const z = x*x + y*y
      const p = project3D(x, y, z)
      if (angle === 0) {
        ctx.moveTo(p.px, p.py)
      } else {
        ctx.lineTo(p.px, p.py)
      }
    }
    ctx.stroke()
    
    ctx.setLineDash([])

    // 标记极限点
    const limitPoint = project3D(0, 0, 0)
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(limitPoint.px, limitPoint.py, 8, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('L', limitPoint.px, limitPoint.py + 4)

    // 标题和说明
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('多元函数极限的路径问题', width / 2, 35)

    // 动态信息显示
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#FF9800'
    ctx.fillText(`δ邻域半径: ${delta.toFixed(2)}`, 20, 60)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`ε精度要求: ${epsilon.toFixed(2)}`, 20, 85)
    
    // 图例
    ctx.font = '14px "Noto Serif SC", serif'
    ctx.fillStyle = '#E53935'
    ctx.fillText('● 路径 y = x', 20, canvasHeight - 80)
    ctx.fillStyle = '#4CAF50'
    ctx.fillText('● 路径 x = 0', 20, canvasHeight - 60)
    ctx.fillStyle = '#9C27B0'
    ctx.fillText('● 螺旋路径', 20, canvasHeight - 40)
    ctx.fillStyle = '#FF9800'
    ctx.fillText('● δ邻域范围', 140, canvasHeight - 80)
    
    ctx.fillStyle = '#1565C0'
    ctx.fillText('曲面 z = x² + y²', 140, canvasHeight - 60)
    
    ctx.fillStyle = '#C62828'
    ctx.textAlign = 'center'
    ctx.fillText(`极限存在：所有路径趋近同一点 L=0`, width / 2, canvasHeight - 20)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('多元函数极限: 所有路径趋于同一点', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('δ-ε定义验证极限', 280, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('连续性条件', 450, canvasHeight + 30)
  }, [modelState.params])

  // 偏导数与全微分可视化
  const drawPartialDerivative = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2 + 20
    const scale = Math.min(width, canvasHeight) / 6

    // 获取动态参数
    const x0 = getParam('x0', 1)
    const y0 = getParam('y0', 1)
    const z0 = x0 * x0 + y0 * y0 // z = x² + y²

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 3D投影函数
    const angleX = -0.5
    const angleY = 0.5

    const project3D = (x: number, y: number, z: number) => {
      const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
      const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
      return { px, py }
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    
    // X轴
    ctx.beginPath()
    ctx.moveTo(project3D(-2, 0, 0).px, project3D(-2, 0, 0).py)
    ctx.lineTo(project3D(2.5, 0, 0).px, project3D(2.5, 0, 0).py)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.fillText('x', project3D(2.6, 0, 0).px, project3D(2.6, 0, 0).py)

    // Y轴
    ctx.beginPath()
    ctx.moveTo(project3D(0, -2, 0).px, project3D(0, -2, 0).py)
    ctx.lineTo(project3D(0, 2.5, 0).px, project3D(0, 2.5, 0).py)
    ctx.stroke()
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('y', project3D(0, 2.7, 0).px, project3D(0, 2.7, 0).py)

    // Z轴
    ctx.beginPath()
    ctx.moveTo(project3D(0, 0, -0.5).px, project3D(0, 0, -0.5).py)
    ctx.lineTo(project3D(0, 0, 2.5).px, project3D(0, 0, 2.5).py)
    ctx.stroke()
    ctx.fillStyle = '#1565C0'
    ctx.fillText('z', project3D(0, 0, 2.7).px, project3D(0, 0, 2.7).py)

    // 绘制曲面 z = x² + y²（抛物面）
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 1.5
    
    for (let x = -1.5; x <= 1.5; x += 0.3) {
      ctx.beginPath()
      for (let y = -1.5; y <= 1.5; y += 0.1) {
        const z = x * x + y * y
        const proj = project3D(x, y, z * 0.3)
        if (y === -1.5) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.stroke()
    }
    
    for (let y = -1.5; y <= 1.5; y += 0.3) {
      ctx.beginPath()
      for (let x = -1.5; x <= 1.5; x += 0.1) {
        const z = x * x + y * y
        const proj = project3D(x, y, z * 0.3)
        if (x === -1.5) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.stroke()
    }

    // 绘制当前点 (x0, y0, z0)
    const pointP = project3D(x0, y0, z0 * 0.3)
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(pointP.px, pointP.py, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`P(${x0.toFixed(1)}, ${y0.toFixed(1)}, ${z0.toFixed(1)})`, pointP.px + 10, pointP.py - 5)

    // 计算偏导数 ∂z/∂x = 2x, ∂z/∂y = 2y
    const dzdx = 2 * x0
    const dzdy = 2 * y0

    // 绘制偏导数对应的切线
    // ∂z/∂x 方向：固定 y=y0，z = x² + y0²
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 4
    ctx.beginPath()
    const tx1 = project3D(x0 - 0.5, y0, (z0 - dzdx * 0.5) * 0.3)
    const tx2 = project3D(x0 + 0.5, y0, (z0 + dzdx * 0.5) * 0.3)
    ctx.moveTo(tx1.px, tx1.py)
    ctx.lineTo(tx2.px, tx2.py)
    ctx.stroke()

    // ∂z/∂y 方向：固定 x=x0，z = x0² + y²
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 4
    ctx.beginPath()
    const ty1 = project3D(x0, y0 - 0.5, (z0 - dzdy * 0.5) * 0.3)
    const ty2 = project3D(x0, y0 + 0.5, (z0 + dzdy * 0.5) * 0.3)
    ctx.moveTo(ty1.px, ty1.py)
    ctx.lineTo(ty2.px, ty2.py)
    ctx.stroke()

    // 绘制切平面
    // 切平面方程：z - z0 = 2x0(x-x0) + 2y0(y-y0)
    ctx.fillStyle = 'rgba(255, 152, 0, 0.3)'
    ctx.strokeStyle = '#FF8F00'
    ctx.lineWidth = 2
    
    const planeSize = 0.5
    const z00 = z0 - dzdx * planeSize - dzdy * planeSize
    const z10 = z0 + dzdx * planeSize - dzdy * planeSize
    const z11 = z0 + dzdx * planeSize + dzdy * planeSize
    const z01 = z0 - dzdx * planeSize + dzdy * planeSize
    
    const tp1 = project3D(x0 - planeSize, y0 - planeSize, z00 * 0.3)
    const tp2 = project3D(x0 + planeSize, y0 - planeSize, z10 * 0.3)
    const tp3 = project3D(x0 + planeSize, y0 + planeSize, z11 * 0.3)
    const tp4 = project3D(x0 - planeSize, y0 + planeSize, z01 * 0.3)
    
    ctx.beginPath()
    ctx.moveTo(tp1.px, tp1.py)
    ctx.lineTo(tp2.px, tp2.py)
    ctx.lineTo(tp3.px, tp3.py)
    ctx.lineTo(tp4.px, tp4.py)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 动态信息显示
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.textAlign = 'left'
    ctx.fillText('偏导数与切平面', 20, 50)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`∂z/∂x = 2x₀ = ${dzdx.toFixed(2)}`, 20, 80)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`∂z/∂y = 2y₀ = ${dzdy.toFixed(2)}`, 20, 105)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('曲面: z = x² + y²', 50, canvasHeight - 90)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`∂z/∂x = 2x = ${dzdx.toFixed(2)}`, 50, canvasHeight - 70)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`∂z/∂y = 2y = ${dzdy.toFixed(2)}`, 50, canvasHeight - 50)
    
    ctx.fillStyle = '#FF8F00'
    const tangentPlaneEq = `切平面: z = ${z0.toFixed(1)} + ${dzdx.toFixed(1)}(x-${x0.toFixed(1)}) + ${dzdy.toFixed(1)}(y-${y0.toFixed(1)})`
    ctx.fillText(tangentPlaneEq.length > 35 ? '切平面方程（见上方）' : tangentPlaneEq, 280, canvasHeight - 70)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`dz = ${dzdx.toFixed(1)}dx + ${dzdy.toFixed(1)}dy`, 280, canvasHeight - 50)
    ctx.fillText('全微分 = 线性主部', 280, canvasHeight - 30)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('偏导数: 固定其他变量对某一变量求导', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('切平面: 曲面的线性逼近', 300, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('全微分: dz = ∂z/∂x dx + ∂z/∂y dy', 500, canvasHeight + 30)
  }, [modelState.params])

  // 复合函数与隐函数求导可视化
  const drawCompositeImplicit = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 绘制变量关系图
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    
    // 绘制节点
    const nodes = [
      { name: 'z', x: centerX, y: 60, color: '#1565C0' },
      { name: 'u', x: centerX - 80, y: 140, color: '#C62828' },
      { name: 'v', x: centerX + 80, y: 140, color: '#C62828' },
      { name: 'x', x: centerX - 120, y: 220, color: '#2E7D32' },
      { name: 'y', x: centerX + 120, y: 220, color: '#2E7D32' },
    ]

    nodes.forEach(node => {
      ctx.fillStyle = node.color
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.name, node.x, node.y)
    })

    // 绘制连线
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    
    // z -> u
    ctx.beginPath()
    ctx.moveTo(nodes[0].x, nodes[0].y + 20)
    ctx.lineTo(nodes[1].x, nodes[1].y - 20)
    ctx.stroke()
    
    // z -> v
    ctx.beginPath()
    ctx.moveTo(nodes[0].x, nodes[0].y + 20)
    ctx.lineTo(nodes[2].x, nodes[2].y - 20)
    ctx.stroke()
    
    // u -> x
    ctx.beginPath()
    ctx.moveTo(nodes[1].x, nodes[1].y + 20)
    ctx.lineTo(nodes[3].x, nodes[3].y - 20)
    ctx.stroke()
    
    // u -> y
    ctx.beginPath()
    ctx.moveTo(nodes[1].x, nodes[1].y + 20)
    ctx.lineTo(nodes[4].x, nodes[4].y - 20)
    ctx.stroke()
    
    // v -> x
    ctx.beginPath()
    ctx.moveTo(nodes[2].x, nodes[2].y + 20)
    ctx.lineTo(nodes[3].x, nodes[3].y - 20)
    ctx.stroke()
    
    // v -> y
    ctx.beginPath()
    ctx.moveTo(nodes[2].x, nodes[2].y + 20)
    ctx.lineTo(nodes[4].x, nodes[4].y - 20)
    ctx.stroke()
    
    ctx.setLineDash([])

    // 标注偏导数
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('∂z/∂u', (nodes[0].x + nodes[1].x) / 2 - 15, (nodes[0].y + nodes[1].y) / 2)
    ctx.fillText('∂z/∂v', (nodes[0].x + nodes[2].x) / 2 + 15, (nodes[0].y + nodes[2].y) / 2)
    ctx.fillText('∂u/∂x', (nodes[1].x + nodes[3].x) / 2 - 15, (nodes[1].y + nodes[3].y) / 2)
    ctx.fillText('∂u/∂y', (nodes[1].x + nodes[4].x) / 2 + 5, (nodes[1].y + nodes[4].y) / 2)
    ctx.fillText('∂v/∂x', (nodes[2].x + nodes[3].x) / 2 - 15, (nodes[2].y + nodes[3].y) / 2)
    ctx.fillText('∂v/∂y', (nodes[2].x + nodes[4].x) / 2 + 5, (nodes[2].y + nodes[4].y) / 2)

    // 绘制公式
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#1565C0'
    ctx.textAlign = 'left'
    ctx.fillText('链式法则:', 50, canvasHeight - 100)
    ctx.fillStyle = '#5D4037'
    ctx.fillText('∂z/∂x = (∂z/∂u)(∂u/∂x) + (∂z/∂v)(∂v/∂x)', 50, canvasHeight - 75)
    ctx.fillText('∂z/∂y = (∂z/∂u)(∂u/∂y) + (∂z/∂v)(∂v/∂y)', 50, canvasHeight - 50)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText('隐函数求导: F(x,y,z)=0 → ∂z/∂x = -Fx/Fz', 50, canvasHeight - 25)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('复合函数链式法则: 分段相乘、分线相加', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('隐函数: 由方程确定的函数', 320, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('多元隐函数同理', 520, canvasHeight + 30)
  }, [modelState.params])

  // 方向导数与梯度可视化
  const drawDirectionalGradient = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2
    const scale = Math.min(width, canvasHeight) / 5

    // 获取动态参数 - 方向角
    const angle = getParam('angle', 0)

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 绘制等高线（同心圆表示 f = x² + y²）
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 1.5
    
    for (let r = 0.5; r <= 2.5; r += 0.5) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, r * scale, 0, Math.PI * 2)
      ctx.stroke()
      
      // 标注等值
      ctx.fillStyle = '#1565C0'
      ctx.font = '11px "Noto Serif SC", serif'
      ctx.fillText(`${r * r}`, centerX + r * scale + 5, centerY)
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 200, centerY)
    ctx.lineTo(centerX + 200, centerY)
    ctx.moveTo(centerX, centerY - 150)
    ctx.lineTo(centerX, centerY + 150)
    ctx.stroke()

    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('x', centerX + 205, centerY - 5)
    ctx.fillText('y', centerX + 5, centerY - 155)

    // 绘制点 P(1, 1)
    const px = centerX + 1 * scale
    const py = centerY - 1 * scale
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('P(1,1)', px + 10, py - 5)

    // 绘制梯度 ∇f = (2x, 2y) = (2, 2) 在 P 点
    const gradX = 2
    const gradY = 2
    const gradLen = Math.sqrt(gradX * gradX + gradY * gradY)
    
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px + gradX * scale * 0.4, py - gradY * scale * 0.4)
    ctx.stroke()

    // 梯度箭头
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(px + gradX * scale * 0.4, py - gradY * scale * 0.4, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('∇f = (2,2)', px + gradX * scale * 0.4 + 10, py - gradY * scale * 0.4)

    // 绘制方向 l（使用动态角度）
    // 梯度方向是45度（π/4），所以angle是相对于梯度方向的偏移
    const gradientAngle = Math.PI / 4 // 梯度方向（45度）
    const lAngle = gradientAngle + angle // 实际方向角
    const lx = Math.cos(lAngle)
    const ly = Math.sin(lAngle)
    
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px + lx * scale * 1.5, py - ly * scale * 1.5)
    ctx.stroke()
    ctx.setLineDash([])
    
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('l', px + lx * scale * 1.5 + 5, py - ly * scale * 1.5)

    // 计算方向导数
    // ∂f/∂l = ∇f · l⁰ = (2,2)·(cos lAngle, sin lAngle) = 2*cos lAngle + 2*sin lAngle
    const directionalDerivative = 2 * lx + 2 * ly
    const cosTheta = (gradX * lx + gradY * ly) / gradLen // cos(θ)，θ为梯度与l夹角

    // 动态信息显示
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.fillText('方向导数与梯度', 20, 50)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`方向角 θ = ${(angle * 180 / Math.PI).toFixed(1)}°`, 20, 80)
    ctx.fillStyle = '#FF9800'
    ctx.fillText(`方向导数 ∂f/∂l = ${directionalDerivative.toFixed(3)}`, 20, 105)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText('梯度 ∇f 指向增大最快方向', 50, canvasHeight - 90)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('方向导数 ∂f/∂l = ∇f · l⁰', 50, canvasHeight - 70)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('等值线 f = c（梯度垂直于等值线）', 50, canvasHeight - 50)
    
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`|∇f| = √8 ≈ 2.83（最大方向导数）`, 300, canvasHeight - 90)
    ctx.fillText(`cos θ = ${cosTheta.toFixed(3)}（θ为梯度与l夹角）`, 300, canvasHeight - 70)
    ctx.fillText(`∂f/∂l = |∇f|·cos θ = ${(gradLen * cosTheta).toFixed(3)}`, 300, canvasHeight - 50)
    
    // 说明当前状态
    ctx.fillStyle = '#FF9800'
    if (Math.abs(directionalDerivative - gradLen) < 0.1) {
      ctx.fillText('▶ 方向与梯度同向，方向导数最大', 300, canvasHeight - 30)
    } else if (Math.abs(directionalDerivative) < 0.1) {
      ctx.fillText('▶ 方向与梯度垂直，方向导数为零', 300, canvasHeight - 30)
    } else if (directionalDerivative < 0) {
      ctx.fillText('▶ 方向与梯度反向，方向导数最小（负）', 300, canvasHeight - 30)
    } else {
      ctx.fillText(`▶ 方向导数为正，但不是最大值`, 300, canvasHeight - 30)
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
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('方向导数: 函数沿某方向的变化率', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('梯度: 方向导数最大值的方向', 280, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('|∇f|: 最大变化率', 500, canvasHeight + 30)
  }, [modelState.params])

  // 行列式定义与性质可视化
  const drawDeterminantDefinition = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 获取动态参数
    const a11 = getParam('a11', 2)
    const a12 = getParam('a12', 1)
    const a21 = getParam('a21', 1)
    const a22 = getParam('a22', 2)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2 + 30
    const scale = 60
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * scale, 30)
      ctx.lineTo(centerX + i * scale, canvasHeight - 10)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(30, centerY + i * scale)
      ctx.lineTo(width - 30, centerY + i * scale)
      ctx.stroke()
    }
    
    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(30, centerY)
    ctx.lineTo(width - 30, centerY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(centerX, 30)
    ctx.lineTo(centerX, canvasHeight - 10)
    ctx.stroke()
    
    // 箭头
    ctx.beginPath()
    ctx.moveTo(width - 30, centerY)
    ctx.lineTo(width - 40, centerY - 5)
    ctx.lineTo(width - 40, centerY + 5)
    ctx.closePath()
    ctx.fillStyle = '#5D4037'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(centerX, 30)
    ctx.lineTo(centerX - 5, 40)
    ctx.lineTo(centerX + 5, 40)
    ctx.closePath()
    ctx.fill()
    
    // 刻度
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.textAlign = 'center'
    for (let i = -4; i <= 4; i++) {
      if (i !== 0) {
        ctx.fillText(`${i}`, centerX + i * scale, centerY + 20)
      }
    }
    ctx.fillText('x', width - 35, centerY - 15)
    ctx.fillText('y', centerX + 15, 35)
    
    // 原点O
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('O', centerX - 15, centerY + 15)
    
    // 绘制列向量 v1 = (a11, a21)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + a11 * scale, centerY - a21 * scale)
    ctx.stroke()
    
    // 向量箭头
    const v1Len = Math.sqrt(a11 * a11 + a21 * a21)
    const v1Angle = Math.atan2(-a21, a11)
    if (v1Len > 0.1) {
      ctx.fillStyle = '#C62828'
      ctx.beginPath()
      ctx.moveTo(centerX + a11 * scale, centerY - a21 * scale)
      ctx.lineTo(centerX + a11 * scale - 12 * Math.cos(v1Angle - 0.3), centerY - a21 * scale - 12 * Math.sin(v1Angle - 0.3))
      ctx.lineTo(centerX + a11 * scale - 12 * Math.cos(v1Angle + 0.3), centerY - a21 * scale - 12 * Math.sin(v1Angle + 0.3))
      ctx.closePath()
      ctx.fill()
    }
    
    // 绘制列向量 v2 = (a12, a22)
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + a12 * scale, centerY - a22 * scale)
    ctx.stroke()
    
    const v2Len = Math.sqrt(a12 * a12 + a22 * a22)
    const v2Angle = Math.atan2(-a22, a12)
    if (v2Len > 0.1) {
      ctx.fillStyle = '#2E7D32'
      ctx.beginPath()
      ctx.moveTo(centerX + a12 * scale, centerY - a22 * scale)
      ctx.lineTo(centerX + a12 * scale - 12 * Math.cos(v2Angle - 0.3), centerY - a22 * scale - 12 * Math.sin(v2Angle - 0.3))
      ctx.lineTo(centerX + a12 * scale - 12 * Math.cos(v2Angle + 0.3), centerY - a22 * scale - 12 * Math.sin(v2Angle + 0.3))
      ctx.closePath()
      ctx.fill()
    }
    
    // 绘制平行四边形（填充）
    const det = a11 * a22 - a12 * a21
    ctx.fillStyle = det >= 0 ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 152, 0, 0.3)'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + a11 * scale, centerY - a21 * scale)
    ctx.lineTo(centerX + a11 * scale + a12 * scale, centerY - a21 * scale - a22 * scale)
    ctx.lineTo(centerX + a12 * scale, centerY - a22 * scale)
    ctx.closePath()
    ctx.fill()
    
    ctx.strokeStyle = '#1976D2'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX + a11 * scale, centerY - a21 * scale)
    ctx.lineTo(centerX + a11 * scale + a12 * scale, centerY - a21 * scale - a22 * scale)
    ctx.lineTo(centerX + a12 * scale, centerY - a22 * scale)
    ctx.stroke()
    
    // 向量标签
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`v₁(${a11}, ${a21})`, centerX + a11 * scale + 15, centerY - a21 * scale - 10)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`v₂(${a12}, ${a22})`, centerX + a12 * scale + 15, centerY - a22 * scale + 5)
    
    // 显示信息
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.textAlign = 'left'
    ctx.fillText('行列式的几何意义：平行四边形面积', 20, 35)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`|A| = a₁₁a₂₂ - a₁₂a₂₁ = ${a11}×${a22} - ${a12}×${a21}`, 20, 60)
    ctx.fillStyle = det >= 0 ? '#1976D2' : '#FF9800'
    ctx.fillText(`|A| = ${det.toFixed(2)}`, 20, 85)
    
    // 状态说明
    ctx.fillStyle = '#C62828'
    if (Math.abs(det) < 0.01) {
      ctx.fillText('⚠ 行列式≈0：两向量共线，平行四边形退化为线段！', 250, 60)
    } else if (det > 0) {
      ctx.fillText('✓ |A| > 0：平行四边形面积为正，方向不变', 250, 60)
    } else {
      ctx.fillText('✓ |A| < 0：平行四边形面积为正，但方向翻转', 250, 60)
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
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('面积 = |行列式| = ' + Math.abs(det).toFixed(2), 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`v₁ = (${a11}, ${a21})`, 220, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`v₂ = (${a12}, ${a22})`, 350, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('调节滑块观察面积变化', 480, canvasHeight + 30)
  }, [modelState.params])

  // 行列式展开可视化
  const drawDeterminantExpansion = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 获取动态参数
    const a11 = getParam('a11', 1)
    const a12 = getParam('a12', 2)
    const a13 = getParam('a13', 3)
    const a21 = getParam('a21', 4)
    const a22 = getParam('a22', 5)
    const a23 = getParam('a23', 6)
    const a31 = getParam('a31', 7)
    const a32 = getParam('a32', 8)
    const a33 = getParam('a33', 9)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    // 绘制三阶行列式矩阵
    const matrixX = 60
    const matrixY = 80
    const cellW = 70
    const cellH = 50
    
    // 绘制竖线
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(matrixX, matrixY)
    ctx.lineTo(matrixX, matrixY + 3 * cellH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(matrixX + 3 * cellW, matrixY)
    ctx.lineTo(matrixX + 3 * cellW, matrixY + 3 * cellH)
    ctx.stroke()
    
    // 绘制矩阵元素
    ctx.font = 'bold 20px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const elements = [
      [a11, a12, a13],
      [a21, a22, a23],
      [a31, a32, a33]
    ]
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillText(`${elements[i][j]}`, matrixX + j * cellW + cellW / 2, matrixY + i * cellH + cellH / 2)
      }
    }
    
    // 计算行列式值
    const det = a11*a22*a33 + a12*a23*a31 + a13*a21*a32 - a13*a22*a31 - a12*a21*a33 - a11*a23*a32
    
    // 显示展开式
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('正项（主对角线方向）：', 320, 100)
    ctx.fillStyle = '#3E2723'
    ctx.fillText(`+a₁₁a₂₂a₃₃ = ${a11}×${a22}×${a33} = ${a11*a22*a33}`, 320, 125)
    ctx.fillText(`+a₁₂a₂₃a₃₁ = ${a12}×${a23}×${a31} = ${a12*a23*a31}`, 320, 150)
    ctx.fillText(`+a₁₃a₂₁a₃₂ = ${a13}×${a21}×${a32} = ${a13*a21*a32}`, 320, 175)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText('负项（副对角线方向）：', 320, 210)
    ctx.fillStyle = '#3E2723'
    ctx.fillText(`-a₁₃a₂₂a₃₁ = -${a13}×${a22}×${a31} = ${-a13*a22*a31}`, 320, 235)
    ctx.fillText(`-a₁₂a₂₁a₃₃ = -${a12}×${a21}×${a33} = ${-a12*a21*a33}`, 320, 260)
    ctx.fillText(`-a₁₁a₂₃a₃₂ = -${a11}×${a23}×${a32} = ${-a11*a23*a32}`, 320, 285)
    
    // 显示结果
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`|A| = ${det}`, matrixX + 3 * cellW + 30, matrixY + 1.5 * cellH)
    
    // 绘制沙路法则示意图
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.textAlign = 'left'
    ctx.fillText('沙路法则：将前两列复制到右侧', 60, 280)
    
    // 复制的两列
    const sandX = 60
    const sandY = 300
    const sandCellW = 35
    const sandCellH = 30
    
    // 绘制5列
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(sandX + i * sandCellW, sandY)
      ctx.lineTo(sandX + i * sandCellW, sandY + 3 * sandCellH)
      ctx.stroke()
    }
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath()
      ctx.moveTo(sandX, sandY + i * sandCellH)
      ctx.lineTo(sandX + 5 * sandCellW, sandY + i * sandCellH)
      ctx.stroke()
    }
    
    // 填充元素（前3列+复制的后2列）
    ctx.font = '14px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.textAlign = 'center'
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        const val = elements[i][j % 3]
        ctx.fillText(`${val}`, sandX + j * sandCellW + sandCellW / 2, sandY + i * sandCellH + sandCellH / 2)
      }
    }
    
    // 绘制主对角线方向的线（绿色）
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 2
    for (let start = 0; start < 3; start++) {
      ctx.beginPath()
      ctx.moveTo(sandX + start * sandCellW + sandCellW / 2, sandY + sandCellH / 2)
      ctx.lineTo(sandX + (start + 2) * sandCellW + sandCellW / 2, sandY + 2.5 * sandCellH)
      ctx.stroke()
    }
    
    // 绘制副对角线方向的线（红色）
    ctx.strokeStyle = '#C62828'
    for (let start = 0; start < 3; start++) {
      ctx.beginPath()
      ctx.moveTo(sandX + start * sandCellW + sandCellW / 2, sandY + 2.5 * sandCellH)
      ctx.lineTo(sandX + (start + 2) * sandCellW + sandCellW / 2, sandY + sandCellH / 2)
      ctx.stroke()
    }
    
    // 图例
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(300, sandY + 15)
    ctx.lineTo(330, sandY + 15)
    ctx.stroke()
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('正项（主对角线方向）', 340, sandY + 20)
    
    ctx.strokeStyle = '#C62828'
    ctx.beginPath()
    ctx.moveTo(300, sandY + 40)
    ctx.lineTo(330, sandY + 40)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.fillText('负项（副对角线方向）', 340, sandY + 45)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('三阶行列式：6个项的代数和', 20, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('正项：从左上到右下', 250, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('负项：从左下到右上', 420, canvasHeight + 30)
  }, [modelState.params])

  // 矩阵定义与运算可视化
  const drawMatrixDefinition = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 获取动态参数
    const a11 = getParam('a11', 1)
    const a12 = getParam('a12', 2)
    const a21 = getParam('a21', 3)
    const a22 = getParam('a22', 4)
    const b11 = getParam('b11', 1)
    const b12 = getParam('b12', 0)
    const b21 = getParam('b21', 0)
    const b22 = getParam('b22', 1)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    // 计算矩阵乘积
    const c11 = a11 * b11 + a12 * b21
    const c12 = a11 * b12 + a12 * b22
    const c21 = a21 * b11 + a22 * b21
    const c22 = a21 * b12 + a22 * b22
    
    // 绘制矩阵A
    const matrixAX = 40
    const matrixAY = 80
    const cellW = 50
    const cellH = 40
    
    // 矩阵A括号
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(matrixAX + 5, matrixAY)
    ctx.lineTo(matrixAX, matrixAY)
    ctx.lineTo(matrixAX, matrixAY + 2 * cellH)
    ctx.lineTo(matrixAX + 5, matrixAY + 2 * cellH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(matrixAX + 2 * cellW - 5, matrixAY)
    ctx.lineTo(matrixAX + 2 * cellW, matrixAY)
    ctx.lineTo(matrixAX + 2 * cellW, matrixAY + 2 * cellH)
    ctx.lineTo(matrixAX + 2 * cellW - 5, matrixAY + 2 * cellH)
    ctx.stroke()
    
    // 矩阵A元素
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${a11}`, matrixAX + cellW / 2, matrixAY + cellH / 2)
    ctx.fillText(`${a12}`, matrixAX + cellW + cellW / 2, matrixAY + cellH / 2)
    ctx.fillText(`${a21}`, matrixAX + cellW / 2, matrixAY + cellH + cellH / 2)
    ctx.fillText(`${a22}`, matrixAX + cellW + cellW / 2, matrixAY + cellH + cellH / 2)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('A', matrixAX + cellW, matrixAY - 20)
    
    // 乘号
    ctx.font = 'bold 24px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.fillText('×', matrixAX + 2 * cellW + 25, matrixAY + cellH)
    
    // 绘制矩阵B
    const matrixBX = matrixAX + 2 * cellW + 60
    
    // 矩阵B括号
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(matrixBX + 5, matrixAY)
    ctx.lineTo(matrixBX, matrixAY)
    ctx.lineTo(matrixBX, matrixAY + 2 * cellH)
    ctx.lineTo(matrixBX + 5, matrixAY + 2 * cellH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(matrixBX + 2 * cellW - 5, matrixAY)
    ctx.lineTo(matrixBX + 2 * cellW, matrixAY)
    ctx.lineTo(matrixBX + 2 * cellW, matrixAY + 2 * cellH)
    ctx.lineTo(matrixBX + 2 * cellW - 5, matrixAY + 2 * cellH)
    ctx.stroke()
    
    // 矩阵B元素
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`${b11}`, matrixBX + cellW / 2, matrixAY + cellH / 2)
    ctx.fillText(`${b12}`, matrixBX + cellW + cellW / 2, matrixAY + cellH / 2)
    ctx.fillText(`${b21}`, matrixBX + cellW / 2, matrixAY + cellH + cellH / 2)
    ctx.fillText(`${b22}`, matrixBX + cellW + cellW / 2, matrixAY + cellH + cellH / 2)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('B', matrixBX + cellW, matrixAY - 20)
    
    // 等号
    ctx.font = 'bold 24px "Noto Serif SC", serif'
    ctx.fillStyle = '#3E2723'
    ctx.fillText('=', matrixBX + 2 * cellW + 25, matrixAY + cellH)
    
    // 绘制结果矩阵AB
    const matrixCX = matrixBX + 2 * cellW + 60
    
    // 矩阵AB括号
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(matrixCX + 5, matrixAY)
    ctx.lineTo(matrixCX, matrixAY)
    ctx.lineTo(matrixCX, matrixAY + 2 * cellH)
    ctx.lineTo(matrixCX + 5, matrixAY + 2 * cellH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(matrixCX + 2 * cellW - 5, matrixAY)
    ctx.lineTo(matrixCX + 2 * cellW, matrixAY)
    ctx.lineTo(matrixCX + 2 * cellW, matrixAY + 2 * cellH)
    ctx.lineTo(matrixCX + 2 * cellW - 5, matrixAY + 2 * cellH)
    ctx.stroke()
    
    // 矩阵AB元素
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`${c11}`, matrixCX + cellW / 2, matrixAY + cellH / 2)
    ctx.fillText(`${c12}`, matrixCX + cellW + cellW / 2, matrixAY + cellH / 2)
    ctx.fillText(`${c21}`, matrixCX + cellW / 2, matrixAY + cellH + cellH / 2)
    ctx.fillText(`${c22}`, matrixCX + cellW + cellW / 2, matrixAY + cellH + cellH / 2)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('AB', matrixCX + cellW, matrixAY - 20)
    
    // 显示计算过程
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#3E2723'
    ctx.fillText('矩阵乘法公式：(AB)ᵢⱼ = Σ aᵢₖbₖⱼ', 40, 200)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText(`AB的第(1,1)元素 = A第1行·B第1列 = ${a11}×${b11} + ${a12}×${b21} = ${c11}`, 40, 230)
    ctx.fillText(`AB的第(1,2)元素 = A第1行·B第2列 = ${a11}×${b12} + ${a12}×${b22} = ${c12}`, 40, 255)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`AB的第(2,1)元素 = A第2行·B第1列 = ${a21}×${b11} + ${a22}×${b21} = ${c21}`, 40, 280)
    ctx.fillText(`AB的第(2,2)元素 = A第2行·B第2列 = ${a21}×${b12} + ${a22}×${b22} = ${c22}`, 40, 305)
    
    // 重要提示
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('⚠ 注意：AB ≠ BA（矩阵乘法不满足交换律）', 40, 340)
    
    // 单位矩阵提示
    ctx.fillStyle = '#1565C0'
    ctx.fillText('💡 单位矩阵 I：当B=I时，AB=A（乘了等于没乘）', 40, 370)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('口诀：左行右列点乘', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('A的第i行', 180, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('B的第j列', 270, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('→ AB的第(i,j)元素', 360, canvasHeight + 30)
  }, [modelState.params])

  // 逆矩阵可视化
  const drawMatrixInverse = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 获取动态参数
    const a = getParam('a', 3)
    const b = getParam('b', 1)
    const c = getParam('c', 2)
    const d = getParam('d', 1)
    
    // 清空画布
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    // 计算行列式
    const det = a * d - b * c
    
    // 绘制矩阵A
    const matrixX = 50
    const matrixY = 60
    const cellW = 50
    const cellH = 40
    
    // 矩阵A
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(matrixX + 5, matrixY)
    ctx.lineTo(matrixX, matrixY)
    ctx.lineTo(matrixX, matrixY + 2 * cellH)
    ctx.lineTo(matrixX + 5, matrixY + 2 * cellH)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(matrixX + 2 * cellW - 5, matrixY)
    ctx.lineTo(matrixX + 2 * cellW, matrixY)
    ctx.lineTo(matrixX + 2 * cellW, matrixY + 2 * cellH)
    ctx.lineTo(matrixX + 2 * cellW - 5, matrixY + 2 * cellH)
    ctx.stroke()
    
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${a}`, matrixX + cellW / 2, matrixY + cellH / 2)
    ctx.fillText(`${b}`, matrixX + cellW + cellW / 2, matrixY + cellH / 2)
    ctx.fillText(`${c}`, matrixX + cellW / 2, matrixY + cellH + cellH / 2)
    ctx.fillText(`${d}`, matrixX + cellW + cellW / 2, matrixY + cellH + cellH / 2)
    
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('A', matrixX + cellW, matrixY - 15)
    
    // 计算过程
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    
    // 步骤1：求行列式
    ctx.fillStyle = '#3E2723'
    ctx.fillText('Step 1: 计算行列式', matrixX, matrixY + 2 * cellH + 40)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`|A| = ad - bc = ${a}×${d} - ${b}×${c} = ${det}`, matrixX + 20, matrixY + 2 * cellH + 65)
    
    // 步骤2：判断可逆性
    ctx.fillStyle = '#3E2723'
    ctx.fillText('Step 2: 判断可逆性', matrixX, matrixY + 2 * cellH + 100)
    
    if (Math.abs(det) < 0.001) {
      ctx.fillStyle = '#C62828'
      ctx.fillText(`|A| = 0，矩阵A不可逆！`, matrixX + 20, matrixY + 2 * cellH + 125)
    } else {
      ctx.fillStyle = '#2E7D32'
      ctx.fillText(`|A| = ${det} ≠ 0，矩阵A可逆`, matrixX + 20, matrixY + 2 * cellH + 125)
      
      // 步骤3：求伴随矩阵
      ctx.fillStyle = '#3E2723'
      ctx.fillText('Step 3: 求伴随矩阵 A*（主对角线交换，副对角线变号）', matrixX, matrixY + 2 * cellH + 160)
      
      const adj11 = d
      const adj12 = -b
      const adj21 = -c
      const adj22 = a
      
      ctx.fillStyle = '#5D4037'
      ctx.fillText(`A* = `, matrixX + 20, matrixY + 2 * cellH + 185)
      
      // 绘制伴随矩阵
      const adjX = matrixX + 60
      const adjY = matrixY + 2 * cellH + 165
      ctx.strokeStyle = '#5D4037'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(adjX + 3, adjY)
      ctx.lineTo(adjX, adjY)
      ctx.lineTo(adjX, adjY + 40)
      ctx.lineTo(adjX + 3, adjY + 40)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(adjX + 70, adjY)
      ctx.lineTo(adjX + 73, adjY)
      ctx.lineTo(adjX + 73, adjY + 40)
      ctx.lineTo(adjX + 70, adjY + 40)
      ctx.stroke()
      
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.fillStyle = '#1565C0'
      ctx.fillText(`${adj11}`, adjX + 17, adjY + 20)
      ctx.fillText(`${adj12}`, adjX + 52, adjY + 20)
      ctx.fillText(`${adj21}`, adjX + 17, adjY + 35)
      ctx.fillText(`${adj22}`, adjX + 52, adjY + 35)
      
      // 步骤4：求逆矩阵
      ctx.fillStyle = '#3E2723'
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.fillText('Step 4: A⁻¹ = A* / |A|', matrixX, matrixY + 2 * cellH + 230)
      
      const inv11 = d / det
      const inv12 = -b / det
      const inv21 = -c / det
      const inv22 = a / det
      
      ctx.fillStyle = '#5D4037'
      ctx.fillText(`A⁻¹ = `, matrixX + 20, matrixY + 2 * cellH + 255)
      
      // 绘制逆矩阵
      const invX = matrixX + 70
      const invY = matrixY + 2 * cellH + 235
      ctx.strokeStyle = '#1565C0'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(invX + 3, invY)
      ctx.lineTo(invX, invY)
      ctx.lineTo(invX, invY + 40)
      ctx.lineTo(invX + 3, invY + 40)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(invX + 80, invY)
      ctx.lineTo(invX + 83, invY)
      ctx.lineTo(invX + 83, invY + 40)
      ctx.lineTo(invX + 80, invY + 40)
      ctx.stroke()
      
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.fillStyle = '#1565C0'
      ctx.fillText(`${inv11.toFixed(2)}`, invX + 20, invY + 20)
      ctx.fillText(`${inv12.toFixed(2)}`, invX + 55, invY + 20)
      ctx.fillText(`${inv21.toFixed(2)}`, invX + 20, invY + 35)
      ctx.fillText(`${inv22.toFixed(2)}`, invX + 55, invY + 35)
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
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('二阶矩阵求逆口诀：主对角交换，副对角变号，除以行列式', 20, canvasHeight + 30)
  }, [modelState.params])

  // 多元函数极值可视化
  const drawMultivariableExtremum = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    
    const centerX = width / 2
    const centerY = canvasHeight / 2 + 20
    const scale = Math.min(width, canvasHeight) / 6

    // 清除画布
    ctx.fillStyle = '#FDF5E6'
    ctx.fillRect(0, 0, width, height)

    // 3D投影函数
    const angleX = -0.5
    const angleY = 0.5

    const project3D = (x: number, y: number, z: number) => {
      const px = centerX + (x * Math.cos(angleY) - y * Math.sin(angleY)) * scale
      const py = centerY - (z + (x * Math.sin(angleY) + y * Math.cos(angleY)) * Math.sin(angleX)) * scale
      return { px, py }
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    
    ctx.beginPath()
    ctx.moveTo(project3D(-2, 0, 0).px, project3D(-2, 0, 0).py)
    ctx.lineTo(project3D(2.5, 0, 0).px, project3D(2.5, 0, 0).py)
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.fillText('x', project3D(2.6, 0, 0).px, project3D(2.6, 0, 0).py)

    ctx.beginPath()
    ctx.moveTo(project3D(0, -2, 0).px, project3D(0, -2, 0).py)
    ctx.lineTo(project3D(0, 2.5, 0).px, project3D(0, 2.5, 0).py)
    ctx.stroke()
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('y', project3D(0, 2.7, 0).px, project3D(0, 2.7, 0).py)

    ctx.beginPath()
    ctx.moveTo(project3D(0, 0, -0.5).px, project3D(0, 0, -0.5).py)
    ctx.lineTo(project3D(0, 0, 2.5).px, project3D(0, 0, 2.5).py)
    ctx.stroke()
    ctx.fillStyle = '#1565C0'
    ctx.fillText('z', project3D(0, 0, 2.7).px, project3D(0, 0, 2.7).py)

    // 绘制马鞍面 z = x² - y²
    ctx.strokeStyle = '#6A1B9A'
    ctx.lineWidth = 1.5
    
    for (let x = -1.5; x <= 1.5; x += 0.3) {
      ctx.beginPath()
      for (let y = -1.5; y <= 1.5; y += 0.1) {
        const z = x * x - y * y
        const proj = project3D(x, y, z * 0.3)
        if (y === -1.5) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.stroke()
    }
    
    for (let y = -1.5; y <= 1.5; y += 0.3) {
      ctx.beginPath()
      for (let x = -1.5; x <= 1.5; x += 0.1) {
        const z = x * x - y * y
        const proj = project3D(x, y, z * 0.3)
        if (x === -1.5) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.stroke()
    }

    // 绘制鞍点 (0, 0, 0)
    const saddle = project3D(0, 0, 0)
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(saddle.px, saddle.py, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText('鞍点(0,0,0)', saddle.px + 10, saddle.py - 5)

    // 绘制抛物面 z = x² + y²（极小值）
    ctx.strokeStyle = '#2E7D32'
    ctx.lineWidth = 1.5
    
    for (let x = -1; x <= 1; x += 0.25) {
      ctx.beginPath()
      for (let y = -1; y <= 1; y += 0.1) {
        const z = x * x + y * y
        const proj = project3D(x + 2.5, y, z * 0.3 + 1)
        if (y === -1) ctx.moveTo(proj.px, proj.py)
        else ctx.lineTo(proj.px, proj.py)
      }
      ctx.stroke()
    }

    // 极小值点
    const minPoint = project3D(2.5, 0, 1)
    ctx.fillStyle = '#2E7D32'
    ctx.beginPath()
    ctx.arc(minPoint.px, minPoint.py, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillText('极小值', minPoint.px + 8, minPoint.py - 5)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#6A1B9A'
    ctx.fillText('马鞍面 z = x² - y²', 50, canvasHeight - 70)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('抛物面 z = x² + y²', 50, canvasHeight - 50)
    ctx.fillStyle = '#5D4037'
    ctx.fillText('驻点: ∇f = 0 的点', 50, canvasHeight - 30)
    
    ctx.fillStyle = '#C62828'
    ctx.fillText('判别: Δ = AC - B²', 280, canvasHeight - 70)
    ctx.fillText('Δ > 0, A > 0 → 极小值', 280, canvasHeight - 50)
    ctx.fillText('Δ < 0 → 鞍点', 280, canvasHeight - 30)
    
    // 底部信息栏
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillStyle = '#5D4037'
    ctx.fillText('极值问题: 求函数的最大最小值', 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('驻点条件: ∇f = 0', 280, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText('判别法: Δ = AC - B²', 450, canvasHeight + 30)
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
    } else if (knowledge.id === 'function-limit') {
      drawFunctionLimit(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'infinitesimal') {
      drawInfinitesimal(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'continuity') {
      drawContinuity(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'first-order-ode') {
      drawFirstOrderODE(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'second-order-ode') {
      drawSecondOrderODE(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'derivative-rules') {
      drawDerivativeRules(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'implicit-parametric') {
      drawImplicitParametric(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'differential') {
      drawDifferential(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'definite-integral') {
      drawDefiniteIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'indefinite-integral') {
      drawIndefiniteIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'substitution') {
      drawSubstitution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'integration-by-parts') {
      drawIntegrationByParts(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'double-integral') {
      drawDoubleIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'triple-integral') {
      drawTripleIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'line-integral-type1') {
      drawLineIntegralType1(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'line-integral-type2') {
      drawLineIntegralType2(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'surface-integral-type1') {
      drawSurfaceIntegralType1(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'surface-integral-type2') {
      drawSurfaceIntegralType2(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'series-convergence') {
      drawSeriesConvergence(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'power-series') {
      drawPowerSeries(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'fourier-series') {
      drawFourierSeries(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'vector-operations') {
      drawVectorOperations(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'plane-and-line') {
      drawPlaneAndLine(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'surfaces') {
      drawSurfaces(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'determinant-definition') {
      drawDeterminantDefinition(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'determinant-expansion') {
      drawDeterminantExpansion(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'matrix-definition') {
      drawMatrixDefinition(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'matrix-inverse') {
      drawMatrixInverse(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'multivariable-basic') {
      drawMultivariableBasic(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'partial-derivative') {
      drawPartialDerivative(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'composite-implicit') {
      drawCompositeImplicit(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'directional-gradient') {
      drawDirectionalGradient(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'multivariable-extremum') {
      drawMultivariableExtremum(ctx, rect.width, rect.height)
    }
  }, [knowledge.id, drawSequenceLimit, drawDerivative, drawFunctionLimit, drawInfinitesimal, drawContinuity, drawFirstOrderODE, drawSecondOrderODE, drawDerivativeRules, drawImplicitParametric, drawDifferential, drawDefiniteIntegral, drawIndefiniteIntegral, drawSubstitution, drawIntegrationByParts, drawDoubleIntegral, drawTripleIntegral, drawLineIntegralType1, drawLineIntegralType2, drawSurfaceIntegralType1, drawSurfaceIntegralType2, drawSeriesConvergence, drawPowerSeries, drawFourierSeries, drawVectorOperations, drawPlaneAndLine, drawSurfaces, drawDeterminantDefinition, drawDeterminantExpansion, drawMatrixDefinition, drawMatrixInverse, drawMultivariableBasic, drawPartialDerivative, drawCompositeImplicit, drawDirectionalGradient, drawMultivariableExtremum])

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
    } else if (knowledge.id === 'function-limit') {
      drawFunctionLimit(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'infinitesimal') {
      drawInfinitesimal(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'continuity') {
      drawContinuity(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'first-order-ode') {
      drawFirstOrderODE(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'second-order-ode') {
      drawSecondOrderODE(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'derivative-rules') {
      drawDerivativeRules(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'implicit-parametric') {
      drawImplicitParametric(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'differential') {
      drawDifferential(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'definite-integral') {
      drawDefiniteIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'indefinite-integral') {
      drawIndefiniteIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'substitution') {
      drawSubstitution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'integration-by-parts') {
      drawIntegrationByParts(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'double-integral') {
      drawDoubleIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'triple-integral') {
      drawTripleIntegral(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'line-integral-type1') {
      drawLineIntegralType1(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'line-integral-type2') {
      drawLineIntegralType2(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'surface-integral-type1') {
      drawSurfaceIntegralType1(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'surface-integral-type2') {
      drawSurfaceIntegralType2(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'series-convergence') {
      drawSeriesConvergence(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'power-series') {
      drawPowerSeries(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'fourier-series') {
      drawFourierSeries(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'vector-operations') {
      drawVectorOperations(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'plane-and-line') {
      drawPlaneAndLine(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'surfaces') {
      drawSurfaces(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'determinant-definition') {
      drawDeterminantDefinition(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'determinant-expansion') {
      drawDeterminantExpansion(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'matrix-definition') {
      drawMatrixDefinition(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'matrix-inverse') {
      drawMatrixInverse(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'multivariable-basic') {
      drawMultivariableBasic(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'partial-derivative') {
      drawPartialDerivative(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'composite-implicit') {
      drawCompositeImplicit(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'directional-gradient') {
      drawDirectionalGradient(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'multivariable-extremum') {
      drawMultivariableExtremum(ctx, rect.width, rect.height)
    }
  }, [knowledge.id, drawSequenceLimit, drawDerivative, drawFunctionLimit, drawInfinitesimal, drawContinuity, drawFirstOrderODE, drawSecondOrderODE, drawDerivativeRules, drawImplicitParametric, drawDifferential, drawDefiniteIntegral, drawIndefiniteIntegral, drawSubstitution, drawIntegrationByParts, drawDoubleIntegral, drawTripleIntegral, drawLineIntegralType1, drawLineIntegralType2, drawSurfaceIntegralType1, drawSurfaceIntegralType2, drawSeriesConvergence, drawPowerSeries, drawFourierSeries, drawVectorOperations, drawPlaneAndLine, drawSurfaces, drawDeterminantDefinition, drawDeterminantExpansion, drawMatrixDefinition, drawMatrixInverse, drawMultivariableBasic, drawPartialDerivative, drawCompositeImplicit, drawDirectionalGradient, drawMultivariableExtremum, compareType])

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
          {activeTab === 'extension' && knowledge.dimensions.extension && (
            <div className="extension-content">
              <div className="extension-section">
                <h3>🔍 核心内涵</h3>
                <MathText text={knowledge.dimensions.extension.essence || ''} />
              </div>
              {knowledge.dimensions.extension.extension && (
                <div className="extension-section">
                  <h3>📚 拓广延伸</h3>
                  <MathText text={knowledge.dimensions.extension.extension} />
                </div>
              )}
              {knowledge.dimensions.extension.further && knowledge.dimensions.extension.further.length > 0 && (
                <div className="extension-section">
                  <h3>📖 深入探究</h3>
                  {knowledge.dimensions.extension.further.map((item) => (
                    <div key={item.id} className="further-item">
                      <h4 className="further-item__title">{item.title}</h4>
                      <MathText text={item.content} className="further-item__content" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 应用实例 */}
          {activeTab === 'application' && knowledge.dimensions.applications && (
            <div className="application-content">
              {(() => {
                try {
                  const apps = Array.isArray(knowledge.dimensions.applications) 
                    ? knowledge.dimensions.applications 
                    : ('items' in knowledge.dimensions.applications ? knowledge.dimensions.applications.items : []);
                  return apps.map((app, index) => (
                    <div key={app.id} className="application-card">
                      <div className="application-card__header">
                        <span className={`app-type-badge ${app.type || 'research'}`}>
                          {app.type === 'real' ? '🏠 现实应用' : app.type === 'example' ? '📝 示例练习' : '🔬 研究应用'}
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
                  ));
                } catch (e) {
                  return <div className="error-message">加载应用实例时出错</div>;
                }
              })()}
            </div>
          )}
          
          {/* 做题方法 */}
          {activeTab === 'method' && knowledge.dimensions.method && knowledge.dimensions.method.length > 0 && (
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
