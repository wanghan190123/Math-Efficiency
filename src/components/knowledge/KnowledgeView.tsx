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

  // 概率统计辅助函数
  const normalPDF = (x: number, mu: number, sigma: number): number => {
    const z = (x - mu) / sigma
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z)
  }

  const normalCDF = (x: number, mu: number, sigma: number): number => {
    const z = (x - mu) / sigma
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911
    const sign = z < 0 ? -1 : 1
    const absZ = Math.abs(z)
    const t = 1 / (1 + p * absZ)
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ / 2)
    return 0.5 * (1 + sign * y)
  }

  const binomialPMF = (n: number, k: number, p: number): number => {
    if (k < 0 || k > n) return 0
    let c = 1
    for (let i = 0; i < k; i++) {
      c = c * (n - i) / (i + 1)
    }
    return c * Math.pow(p, k) * Math.pow(1 - p, n - k)
  }

  const poissonPMF = (lambda: number, k: number): number => {
    if (k < 0) return 0
    let factorial = 1
    for (let i = 2; i <= k; i++) factorial *= i
    return Math.pow(lambda, k) * Math.exp(-lambda) / factorial
  }

  const getDiscreteCDF = (x: number, points: number[]): number => {
    let count = 0
    for (const p of points) {
      if (p <= x) count++
    }
    return count / points.length
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

  // ==================== 第一章：随机事件和概率 ====================

  // 1. 随机试验与样本空间
  const drawRandomExperiment = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const nSample = getParam('n_sample', 6)
    const aSize = getParam('a_size', 2)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    const centerX = width / 2
    const centerY = canvasHeight / 2

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * 40, 0)
      ctx.lineTo(centerX + i * 40, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * 40)
      ctx.lineTo(width, centerY + i * 40)
      ctx.stroke()
    }

    // 绘制椭圆样本空间 Ω
    const rx = Math.min(width * 0.35, 200)
    const ry = Math.min(canvasHeight * 0.35, 140)

    // 事件A区域填充（先绘制，在椭圆内部）
    if (aSize > 0) {
      ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'
      ctx.beginPath()
      ctx.ellipse(centerX - 30, centerY - 10, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#C62828'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // 椭圆 Ω
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI * 2)
    ctx.stroke()

    // Ω 标签
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillText('Ω', centerX + rx - 10, centerY - ry + 25)

    // 绘制样本点
    const seed = 42
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453
      return x - Math.floor(x)
    }

    for (let i = 0; i < nSample; i++) {
      const angle = (i / nSample) * Math.PI * 2 + 0.3
      const rFactor = 0.3 + seededRandom(i) * 0.55
      const px = centerX + Math.cos(angle) * rx * rFactor
      const py = centerY + Math.sin(angle) * ry * rFactor

      const isInA = i < aSize
      ctx.fillStyle = isInA ? '#C62828' : '#5D4037'
      ctx.beginPath()
      ctx.arc(px, py, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`ω${i + 1}`, px, py)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
    }

    // 事件A标签
    if (aSize > 0) {
      ctx.fillStyle = '#C62828'
      ctx.font = 'bold 16px "Noto Serif SC", serif'
      ctx.fillText('A', centerX - 30 + rx * 0.55 + 10, centerY - 10 - ry * 0.55 + 15)
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

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`样本空间Ω有${nSample}个样本点，事件A包含${aSize}个`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`P(A) = ${aSize}/${nSample} = ${(aSize / nSample).toFixed(3)}`, 350, canvasHeight + 30)
  }, [modelState.params])

  // 2. 事件关系与运算
  const drawEventRelation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const aSize = getParam('a_size', 2)
    const bSize = getParam('b_size', 2)
    const overlap = getParam('overlap', 1)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    const centerX = width / 2
    const centerY = canvasHeight / 2

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * 40, 0)
      ctx.lineTo(centerX + i * 40, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * 40)
      ctx.lineTo(width, centerY + i * 40)
      ctx.stroke()
    }

    // 矩形区域表示 Ω
    const rectX = centerX - 160
    const rectY = centerY - 110
    const rectW = 320
    const rectH = 220
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(rectX, rectY, rectW, rectH)
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillText('Ω', rectX + rectW - 20, rectY + 20)

    const r = 80
    const dist = Math.max(20, 100 - overlap * 30)
    const ax = centerX - dist / 2
    const bx = centerX + dist / 2

    // A∪B 区域
    ctx.fillStyle = 'rgba(21, 101, 192, 0.12)'
    ctx.beginPath()
    ctx.arc(ax, centerY, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(bx, centerY, r, 0, Math.PI * 2)
    ctx.fill()

    // A-B 区域
    ctx.fillStyle = 'rgba(198, 40, 40, 0.25)'
    ctx.beginPath()
    ctx.arc(ax, centerY, r, 0, Math.PI * 2)
    ctx.fill()

    // B 区域覆盖（擦除A-B部分，留下交集颜色）
    ctx.fillStyle = 'rgba(21, 101, 192, 0.25)'
    ctx.beginPath()
    ctx.arc(bx, centerY, r, 0, Math.PI * 2)
    ctx.fill()

    // A∩B 区域（交集）
    ctx.fillStyle = 'rgba(85, 139, 47, 0.35)'
    ctx.save()
    ctx.beginPath()
    ctx.arc(ax, centerY, r, 0, Math.PI * 2)
    ctx.clip()
    ctx.beginPath()
    ctx.arc(bx, centerY, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 补集区域
    ctx.fillStyle = 'rgba(255, 193, 7, 0.1)'
    ctx.fillRect(rectX, rectY, rectW, rectH)
    ctx.save()
    ctx.beginPath()
    ctx.rect(rectX, rectY, rectW, rectH)
    ctx.clip()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(ax, centerY, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(bx, centerY, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()

    // 圆A轮廓
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(ax, centerY, r, 0, Math.PI * 2)
    ctx.stroke()

    // 圆B轮廓
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(bx, centerY, r, 0, Math.PI * 2)
    ctx.stroke()

    // 标签
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillText('A', ax - r + 15, centerY - r + 25)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('B', bx + r - 25, centerY - r + 25)

    // 区域标注
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText('A-B', ax - 30, centerY)
    ctx.fillStyle = '#558B2F'
    ctx.fillText('A∩B', centerX - 14, centerY)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('B-A', bx + 5, centerY)

    // 图例
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    const legendY = rectY + rectH + 15
    ctx.fillStyle = 'rgba(21, 101, 192, 0.4)'
    ctx.fillRect(centerX - 150, legendY, 14, 14)
    ctx.fillStyle = '#3E2723'
    ctx.fillText('A∪B', centerX - 132, legendY + 12)

    ctx.fillStyle = 'rgba(198, 40, 40, 0.4)'
    ctx.fillRect(centerX - 60, legendY, 14, 14)
    ctx.fillText('A-B', centerX - 42, legendY + 12)

    ctx.fillStyle = 'rgba(85, 139, 47, 0.5)'
    ctx.fillRect(centerX + 20, legendY, 14, 14)
    ctx.fillText('A∩B', centerX + 38, legendY + 12)

    ctx.fillStyle = 'rgba(255, 193, 7, 0.4)'
    ctx.fillRect(centerX + 100, legendY, 14, 14)
    ctx.fillText('补集', centerX + 118, legendY + 12)

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
    ctx.fillText(`|A|=${aSize}  |B|=${bSize}  |A∩B|=${overlap}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`|A∪B|=${aSize + bSize - overlap}`, 250, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`|A-B|=${aSize - overlap}`, 400, canvasHeight + 30)
  }, [modelState.params])

  // 3. 概率公理
  const drawProbabilityAxiom = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const pA = getParam('p_a', 0.3)
    const pB = getParam('p_b', 0.5)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath()
      ctx.moveTo(i * (width / 20), 0)
      ctx.lineTo(i * (width / 20), canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * (canvasHeight / 20))
      ctx.lineTo(width, i * (canvasHeight / 20))
      ctx.stroke()
    }

    const padding = 50
    const barMaxH = canvasHeight - padding * 3
    const barW = 60
    const gap = (width - padding * 2 - barW * 4) / 5
    const baseY = canvasHeight - padding

    // 公理1: P(A) ≥ 0
    const x1 = padding + gap
    ctx.fillStyle = 'rgba(198, 40, 40, 0.7)'
    ctx.fillRect(x1, baseY - pA * barMaxH, barW, pA * barMaxH)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.strokeRect(x1, baseY - pA * barMaxH, barW, pA * barMaxH)
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('P(A)', x1 + barW / 2, baseY + 20)
    ctx.fillText(pA.toFixed(2), x1 + barW / 2, baseY - pA * barMaxH - 10)
    ctx.fillStyle = '#558B2F'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillText('≥0 ✓', x1 + barW / 2, baseY + 38)

    // 公理1: P(B) ≥ 0
    const x2 = x1 + barW + gap
    ctx.fillStyle = 'rgba(21, 101, 192, 0.7)'
    ctx.fillRect(x2, baseY - pB * barMaxH, barW, pB * barMaxH)
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2
    ctx.strokeRect(x2, baseY - pB * barMaxH, barW, pB * barMaxH)
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('P(B)', x2 + barW / 2, baseY + 20)
    ctx.fillText(pB.toFixed(2), x2 + barW / 2, baseY - pB * barMaxH - 10)
    ctx.fillStyle = '#558B2F'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillText('≥0 ✓', x2 + barW / 2, baseY + 38)

    // P(Ω)=1
    const x3 = x2 + barW + gap
    ctx.fillStyle = 'rgba(85, 139, 47, 0.7)'
    ctx.fillRect(x3, baseY - 1 * barMaxH, barW, 1 * barMaxH)
    ctx.strokeStyle = '#558B2F'
    ctx.lineWidth = 2
    ctx.strokeRect(x3, baseY - 1 * barMaxH, barW, 1 * barMaxH)
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('P(Ω)', x3 + barW / 2, baseY + 20)
    ctx.fillText('1.00', x3 + barW / 2, baseY - 1 * barMaxH - 10)
    ctx.fillStyle = '#558B2F'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillText('=1 ✓', x3 + barW / 2, baseY + 38)

    // 可加性 P(A∪B)
    const pAB = Math.max(0, pA + pB - 1)  // P(A∩B) 的最小值假设
    const pAUB = pA + pB - pAB
    const x4 = x3 + barW + gap
    // 绘制 P(A) 部分
    ctx.fillStyle = 'rgba(198, 40, 40, 0.5)'
    ctx.fillRect(x4, baseY - pA * barMaxH, barW, pA * barMaxH)
    // 绘制 P(B) 部分（叠加上方）
    ctx.fillStyle = 'rgba(21, 101, 192, 0.5)'
    ctx.fillRect(x4, baseY - pAUB * barMaxH, barW, pAUB * barMaxH)
    // 交集部分
    ctx.fillStyle = 'rgba(85, 139, 47, 0.5)'
    ctx.fillRect(x4, baseY - pAB * barMaxH, barW, pAB * barMaxH)

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(x4, baseY - pAUB * barMaxH, barW, pAUB * barMaxH)
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('P(A∪B)', x4 + barW / 2, baseY + 20)
    ctx.fillText(pAUB.toFixed(2), x4 + barW / 2, baseY - pAUB * barMaxH - 10)

    // 公理标题
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText('概率公理验证', padding, 30)

    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`公理1: P(A)=${pA.toFixed(2)} ≥ 0 ✓`, padding, 55)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`公理1: P(B)=${pB.toFixed(2)} ≥ 0 ✓`, padding, 75)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`公理2: P(Ω) = 1 ✓`, padding, 95)
    ctx.fillStyle = '#5D4037'
    ctx.fillText(`公理3: P(A∪B) = P(A)+P(B)-P(A∩B)`, padding, 115)
    ctx.fillText(`       = ${pA.toFixed(2)}+${pB.toFixed(2)}-${pAB.toFixed(2)} = ${pAUB.toFixed(2)}`, padding, 135)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(A)=${pA.toFixed(2)}  P(B)=${pB.toFixed(2)}  P(A∩B)≥${pAB.toFixed(2)}  P(A∪B)=${pAUB.toFixed(2)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 4. 古典概型
  const drawClassicalProbability = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = getParam('n', 6)
    const k = getParam('k', 3)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    const centerX = width / 2
    const centerY = canvasHeight / 2

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * 40, 0)
      ctx.lineTo(centerX + i * 40, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * 40)
      ctx.lineTo(width, centerY + i * 40)
      ctx.stroke()
    }

    // 标题
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillText('古典概型：等可能概型', 20, 30)

    // 绘制样本点网格
    const cols = Math.ceil(Math.sqrt(n))
    const rows = Math.ceil(n / cols)
    const cellSize = Math.min(60, (width - 100) / cols, (canvasHeight - 120) / rows)
    const startX = centerX - (cols * cellSize) / 2
    const startY = centerY - (rows * cellSize) / 2

    for (let i = 0; i < n; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = startX + col * cellSize + cellSize / 2
      const y = startY + row * cellSize + cellSize / 2
      const isFavorable = i < k

      // 有利事件用红色圆形，其他用棕色
      ctx.fillStyle = isFavorable ? 'rgba(198, 40, 40, 0.8)' : 'rgba(93, 64, 55, 0.4)'
      ctx.beginPath()
      ctx.arc(x, y, cellSize * 0.35, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = isFavorable ? '#C62828' : '#5D4037'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 13px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`ω${i + 1}`, x, y)
    }

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    // 图例
    ctx.fillStyle = '#C62828'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.beginPath()
    ctx.arc(20, canvasHeight - 50, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#C62828'
    ctx.fillText('有利事件A', 35, canvasHeight - 45)

    ctx.fillStyle = 'rgba(93, 64, 55, 0.4)'
    ctx.beginPath()
    ctx.arc(20, canvasHeight - 25, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#5D4037'
    ctx.fillText('其他样本点', 35, canvasHeight - 20)

    // 公式
    const prob = k / n
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText(`P(A) = k/n = ${k}/${n} = ${prob.toFixed(4)}`, width - 280, canvasHeight - 40)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`样本点数 n=${n}，有利事件数 k=${k}，P(A)=${k}/${n}=${prob.toFixed(4)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 5. 几何概型
  const drawGeometricProbability = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const radius = getParam('radius', 0.5)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    // 绘制网格
    const padding = 40
    const graphSize = Math.min(width - padding * 2, canvasHeight - padding * 2 - 40)
    const startX = (width - graphSize) / 2
    const startY = 40

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(startX + (graphSize / 10) * i, startY)
      ctx.lineTo(startX + (graphSize / 10) * i, startY + graphSize)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(startX, startY + (graphSize / 10) * i)
      ctx.lineTo(startX + graphSize, startY + (graphSize / 10) * i)
      ctx.stroke()
    }

    // 坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, startY + graphSize)
    ctx.lineTo(startX + graphSize, startY + graphSize)
    ctx.stroke()

    // 箭头
    ctx.beginPath()
    ctx.moveTo(startX + graphSize, startY + graphSize)
    ctx.lineTo(startX + graphSize - 8, startY + graphSize - 4)
    ctx.lineTo(startX + graphSize - 8, startY + graphSize + 4)
    ctx.closePath()
    ctx.fillStyle = '#5D4037'
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX - 4, startY + 8)
    ctx.lineTo(startX + 4, startY + 8)
    ctx.closePath()
    ctx.fill()

    // 单位正方形
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, graphSize, graphSize)

    // 标签
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('0', startX - 15, startY + graphSize + 15)
    ctx.fillText('1', startX + graphSize - 5, startY + graphSize + 15)
    ctx.fillText('1', startX - 15, startY + 5)

    // 填充正方形区域（样本空间）
    ctx.fillStyle = 'rgba(21, 101, 192, 0.1)'
    ctx.fillRect(startX, startY, graphSize, graphSize)

    // 内切圆（事件A区域）
    const circleR = radius * graphSize
    const circleCX = startX + graphSize / 2
    const circleCY = startY + graphSize / 2

    ctx.fillStyle = 'rgba(198, 40, 40, 0.2)'
    ctx.beginPath()
    ctx.arc(circleCX, circleCY, circleR, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(circleCX, circleCY, circleR, 0, Math.PI * 2)
    ctx.stroke()

    // 半径标注
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(circleCX, circleCY)
    ctx.lineTo(circleCX + circleR, circleCY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`r=${radius.toFixed(2)}`, circleCX + circleR / 2 - 15, circleCY - 8)

    // 概率标注
    const circleArea = Math.PI * radius * radius
    const squareArea = 1
    const prob = circleArea / squareArea

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText('几何概型', 20, 25)
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(A) = S_圆 / S_方`, startX + graphSize + 15, startY + 20)
    ctx.fillText(`= π×${radius.toFixed(2)}² / 1`, startX + graphSize + 15, startY + 45)
    ctx.fillText(`= ${prob.toFixed(4)}`, startX + graphSize + 15, startY + 70)

    // 标签
    ctx.fillStyle = 'rgba(21, 101, 192, 0.6)'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('Ω', startX + 8, startY + 18)

    ctx.fillStyle = '#C62828'
    ctx.fillText('A', circleCX - 5, circleCY + 5)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`S_圆=π×${radius.toFixed(2)}²=${circleArea.toFixed(4)}  S_方=1  P(A)=${prob.toFixed(4)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 6. 条件概率
  const drawConditionalProbability = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const pA = getParam('p_a', 0.4)
    const pBGivenA = getParam('p_b_given_a', 0.6)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    const centerX = width / 2
    const centerY = canvasHeight / 2

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX + i * 40, 0)
      ctx.lineTo(centerX + i * 40, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, centerY + i * 40)
      ctx.lineTo(width, centerY + i * 40)
      ctx.stroke()
    }

    const pAB = pA * pBGivenA

    // 矩形Ω
    const rectX = centerX - 150
    const rectY = centerY - 100
    const rectW = 300
    const rectH = 200
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(rectX, rectY, rectW, rectH)
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 16px "Noto Serif SC", serif'
    ctx.fillText('Ω', rectX + rectW - 20, rectY + 20)

    // 圆A
    const rA = 80
    const ax = centerX - 25
    ctx.fillStyle = 'rgba(198, 40, 40, 0.2)'
    ctx.beginPath()
    ctx.arc(ax, centerY, rA, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(ax, centerY, rA, 0, Math.PI * 2)
    ctx.stroke()

    // 圆B
    const rB = 70
    const bx = centerX + 25
    ctx.fillStyle = 'rgba(21, 101, 192, 0.2)'
    ctx.beginPath()
    ctx.arc(bx, centerY, rB, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(bx, centerY, rB, 0, Math.PI * 2)
    ctx.stroke()

    // A∩B 突出显示
    ctx.fillStyle = 'rgba(85, 139, 47, 0.4)'
    ctx.save()
    ctx.beginPath()
    ctx.arc(ax, centerY, rA, 0, Math.PI * 2)
    ctx.clip()
    ctx.beginPath()
    ctx.arc(bx, centerY, rB, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 标签
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 18px "Noto Serif SC", serif'
    ctx.fillText('A', ax - rA + 10, centerY - rA + 22)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('B', bx + rB - 22, centerY - rB + 22)
    ctx.fillStyle = '#558B2F'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('A∩B', centerX - 14, centerY + 5)

    // 突出显示A区域边框
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 4
    ctx.setLineDash([6, 3])
    ctx.beginPath()
    ctx.arc(ax, centerY, rA + 5, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // 公式
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText('条件概率', 20, 25)
    ctx.font = '14px "Noto Serif SC", serif'
    ctx.fillText(`P(B|A) = P(A∩B) / P(A)`, 20, 50)
    ctx.fillText(`= ${pAB.toFixed(3)} / ${pA.toFixed(3)}`, 20, 72)
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText(`= ${pBGivenA.toFixed(3)}`, 20, 94)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(A)=${pA.toFixed(3)}  P(B|A)=${pBGivenA.toFixed(3)}  P(A∩B)=${pAB.toFixed(3)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 7. 贝叶斯公式
  const drawBayesFormula = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const pB1 = getParam('p_b1', 0.3)
    const pB2 = getParam('p_b2', 0.3)
    const pAGivenB1 = getParam('p_a_given_b1', 0.7)
    const pAGivenB2 = getParam('p_a_given_b2', 0.2)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(width / 2 + i * 40, 0)
      ctx.lineTo(width / 2 + i * 40, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight / 2 + i * 40)
      ctx.lineTo(width, canvasHeight / 2 + i * 40)
      ctx.stroke()
    }

    const pAB1 = pB1 * pAGivenB1
    const pAB2 = pB2 * pAGivenB2
    const pA = pAB1 + pAB2
    const pB1GivenA = pA > 0 ? pAB1 / pA : 0
    const pB2GivenA = pA > 0 ? pAB2 / pA : 0

    // 树形图
    const treeX = 80
    const treeMidX = width * 0.4
    const treeRightX = width * 0.7
    const _treeTopY = 80
    const treeMidY1 = canvasHeight * 0.3
    const treeMidY2 = canvasHeight * 0.7
    const treeBotY1 = canvasHeight * 0.15
    const treeBotY2 = canvasHeight * 0.45
    const treeBotY3 = canvasHeight * 0.55
    const treeBotY4 = canvasHeight * 0.85

    // 根节点
    ctx.fillStyle = '#5D4037'
    ctx.beginPath()
    ctx.arc(treeX, canvasHeight / 2, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 11px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Ω', treeX, canvasHeight / 2)

    // 第一层分叉 B1
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(treeX + 12, canvasHeight / 2)
    ctx.lineTo(treeMidX - 12, treeMidY1)
    ctx.stroke()

    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(treeMidX, treeMidY1, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('B₁', treeMidX, treeMidY1)

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`P(B₁)=${pB1.toFixed(2)}`, treeX + 20, canvasHeight / 2 - 30)

    // 第一层分叉 B2
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(treeX + 12, canvasHeight / 2)
    ctx.lineTo(treeMidX - 12, treeMidY2)
    ctx.stroke()

    ctx.fillStyle = '#1565C0'
    ctx.beginPath()
    ctx.arc(treeMidX, treeMidY2, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 11px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('B₂', treeMidX, treeMidY2)

    ctx.fillStyle = '#1565C0'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`P(B₂)=${pB2.toFixed(2)}`, treeX + 20, canvasHeight / 2 + 40)

    // 第二层分叉 A|B1
    ctx.strokeStyle = 'rgba(198, 40, 40, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(treeMidX + 12, treeMidY1)
    ctx.lineTo(treeRightX - 12, treeBotY1)
    ctx.stroke()

    ctx.fillStyle = '#558B2F'
    ctx.beginPath()
    ctx.arc(treeRightX, treeBotY1, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 9px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('A', treeRightX, treeBotY1)

    ctx.fillStyle = '#558B2F'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`P(A|B₁)=${pAGivenB1.toFixed(2)}`, treeMidX + 20, treeMidY1 - 20)

    // 第二层分叉 Ā|B1
    ctx.strokeStyle = 'rgba(198, 40, 40, 0.3)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(treeMidX + 12, treeMidY1)
    ctx.lineTo(treeRightX - 12, treeBotY2)
    ctx.stroke()

    ctx.fillStyle = '#999'
    ctx.beginPath()
    ctx.arc(treeRightX, treeBotY2, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 9px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Ā', treeRightX, treeBotY2)

    // 第二层分叉 A|B2
    ctx.strokeStyle = 'rgba(21, 101, 192, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(treeMidX + 12, treeMidY2)
    ctx.lineTo(treeRightX - 12, treeBotY3)
    ctx.stroke()

    ctx.fillStyle = '#558B2F'
    ctx.beginPath()
    ctx.arc(treeRightX, treeBotY3, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 9px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('A', treeRightX, treeBotY3)

    ctx.fillStyle = '#558B2F'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`P(A|B₂)=${pAGivenB2.toFixed(2)}`, treeMidX + 20, treeMidY2 + 25)

    // 第二层分叉 Ā|B2
    ctx.strokeStyle = 'rgba(21, 101, 192, 0.3)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(treeMidX + 12, treeMidY2)
    ctx.lineTo(treeRightX - 12, treeBotY4)
    ctx.stroke()

    ctx.fillStyle = '#999'
    ctx.beginPath()
    ctx.arc(treeRightX, treeBotY4, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 9px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Ā', treeRightX, treeBotY4)

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    // 贝叶斯公式结果
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    const resultX = treeRightX + 30
    ctx.fillText('贝叶斯公式:', resultX, 60)
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(A) = P(A|B₁)P(B₁) + P(A|B₂)P(B₂)`, resultX, 85)
    ctx.fillText(`     = ${pAGivenB1.toFixed(2)}×${pB1.toFixed(2)} + ${pAGivenB2.toFixed(2)}×${pB2.toFixed(2)} = ${pA.toFixed(4)}`, resultX, 108)

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`P(B₁|A) = ${pAB1.toFixed(4)}/${pA.toFixed(4)} = ${pB1GivenA.toFixed(4)}`, resultX, 138)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`P(B₂|A) = ${pAB2.toFixed(4)}/${pA.toFixed(4)} = ${pB2GivenA.toFixed(4)}`, resultX, 163)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(A)=${pA.toFixed(4)}  P(B₁|A)=${pB1GivenA.toFixed(4)}  P(B₂|A)=${pB2GivenA.toFixed(4)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 8. 独立性与Bernoulli试验
  const drawIndependenceBernoulli = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const p = getParam('p', 0.5)
    const n = getParam('n', 5)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -10; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(width / 2 + i * 40, 0)
      ctx.lineTo(width / 2 + i * 40, canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, canvasHeight / 2 + i * 40)
      ctx.lineTo(width, canvasHeight / 2 + i * 40)
      ctx.stroke()
    }

    // 标题：独立性
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText('独立性检验', 20, 25)
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(AB) = P(A)·P(B) 时，A与B独立`, 20, 48)
    ctx.fillText(`当 p=${p.toFixed(2)} 时，P(成功)=${p.toFixed(2)}，P(失败)=${(1 - p).toFixed(2)}`, 20, 68)

    // Bernoulli 试验结果
    const seqY = canvasHeight / 2 + 10
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText(`${n}次Bernoulli试验结果：`, 20, seqY - 30)

    const cellSize = Math.min(36, (width - 60) / n)
    const seqStartX = 20

    // 使用确定性伪随机
    const seededRand = (i: number) => {
      const x = Math.sin(17 * i + 31) * 43758.5453
      return x - Math.floor(x)
    }

    let successCount = 0
    for (let i = 0; i < n; i++) {
      const isSuccess = seededRand(i) < p
      if (isSuccess) successCount++
      const cx = seqStartX + i * (cellSize + 6) + cellSize / 2
      const cy = seqY + 10

      ctx.fillStyle = isSuccess ? '#558B2F' : '#C62828'
      ctx.fillRect(seqStartX + i * (cellSize + 6), seqY - 5, cellSize, cellSize)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(isSuccess ? 'S' : 'F', cx, cy)
    }

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    // 统计信息
    ctx.fillStyle = '#558B2F'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`成功次数: ${successCount}/${n}`, 20, seqY + 45)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`失败次数: ${n - successCount}/${n}`, 170, seqY + 45)

    // 概率计算
    const _pK = binomialPMF(n, successCount, p)
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(X=${successCount}) = C(${n},${successCount})×${p.toFixed(2)}^${successCount}×${(1 - p).toFixed(2)}^${n - successCount}`, 20, seqY + 70)

    // 独立性图示
    const indepY = 95
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('独立性：', 20, indepY)

    // 两个独立圆
    const r1 = 45
    const r2 = 45
    const ix1 = 180
    const ix2 = 280

    ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'
    ctx.beginPath()
    ctx.arc(ix1, indepY + 50, r1, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = 'rgba(21, 101, 192, 0.15)'
    ctx.beginPath()
    ctx.arc(ix2, indepY + 50, r2, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText('A', ix1 - 5, indepY + 55)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('B', ix2 - 5, indepY + 55)

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(A)=${p.toFixed(2)}`, ix1 - 35, indepY + 115)
    ctx.fillText(`P(B)=${p.toFixed(2)}`, ix2 - 35, indepY + 115)
    ctx.fillText(`P(AB)=${(p * p).toFixed(4)} = P(A)·P(B) ✓`, ix1 - 35, indepY + 135)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`p=${p.toFixed(2)}  n=${n}  成功${successCount}次  P(AB)=P(A)P(B) 独立`, 20, canvasHeight + 30)
  }, [modelState.params])

  // ==================== 第二章：一维随机变量及其分布 ====================

  // 9. 分布函数
  const drawDistributionFunction = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const a = getParam('s1', -1)
    const b = getParam('s2', 2)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

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
      const y = originY - (graphHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }

    // 坐标轴
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

    // 标签
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('x', originX + graphWidth - 10, originY + 25)
    ctx.fillText('F(x)', originX - 40, originY - graphHeight + 10)

    // 离散 CDF (阶梯函数) - 使用简单离散分布 P(X=k)=1/4, k=0,1,2,3
    const discretePoints = [0, 1, 2, 3]
    const scaleX = graphWidth / 8
    const scaleY = graphHeight

    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2.5

    // 绘制阶梯函数
    let prevF = 0
    for (let i = 0; i < discretePoints.length; i++) {
      const xi = discretePoints[i]
      const fi = (i + 1) / discretePoints.length
      const px = originX + (xi + 2) * scaleX
      const pyPrev = originY - prevF * scaleY
      const pyCur = originY - fi * scaleY

      // 水平段
      ctx.beginPath()
      ctx.moveTo(px, pyPrev)
      ctx.lineTo(px, pyCur)
      ctx.stroke()

      // 垂直段到下一段
      if (i < discretePoints.length - 1) {
        const nextPx = originX + (discretePoints[i + 1] + 2) * scaleX
        ctx.beginPath()
        ctx.moveTo(px, pyCur)
        ctx.lineTo(nextPx, pyCur)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.moveTo(px, pyCur)
        ctx.lineTo(px + scaleX * 2, pyCur)
        ctx.stroke()
      }

      // 点
      ctx.fillStyle = '#C62828'
      ctx.beginPath()
      ctx.arc(px, pyCur, 5, 0, Math.PI * 2)
      ctx.fill()

      prevF = fi
    }

    // 连续 CDF 曲线 (标准正态近似)
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) {
      const x = (px / graphWidth) * 8 - 4
      const fVal = normalCDF(x, 0, 1)
      const py = originY - fVal * scaleY
      if (px === 0) ctx.moveTo(originX + px, py)
      else ctx.lineTo(originX + px, py)
    }
    ctx.stroke()

    // 区间 [a,b] 标注：P(a<X≤b) = F(b) - F(a)
    const aClamped = Math.max(a, -3.5)
    const bClamped = Math.min(b, 3.5)
    const aPx = originX + ((aClamped + 4) / 8) * graphWidth
    const bPx = originX + ((bClamped + 4) / 8) * graphWidth
    const fADiscrete = getDiscreteCDF(aClamped, discretePoints)
    const fBDiscrete = getDiscreteCDF(bClamped, discretePoints)
    const fAContinuous = normalCDF(aClamped, 0, 1)
    const fBContinuous = normalCDF(bClamped, 0, 1)

    // 标注a和b的竖线
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(aPx, originY)
    ctx.lineTo(aPx, originY - graphHeight)
    ctx.stroke()
    ctx.strokeStyle = '#2E7D32'
    ctx.beginPath()
    ctx.moveTo(bPx, originY)
    ctx.lineTo(bPx, originY - graphHeight)
    ctx.stroke()
    ctx.setLineDash([])

    // 区间阴影
    ctx.fillStyle = 'rgba(198, 40, 40, 0.08)'
    ctx.fillRect(aPx, originY - graphHeight, bPx - aPx, graphHeight)

    // CDF值标注
    const discretePyB = originY - fBDiscrete * scaleY
    const discretePyA = originY - fADiscrete * scaleY
    ctx.fillStyle = '#2E7D32'
    ctx.beginPath()
    ctx.arc(bPx, discretePyB, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#C62828'
    ctx.beginPath()
    ctx.arc(aPx, discretePyA, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`a=${aClamped.toFixed(1)}`, aPx - 15, originY + 25)
    ctx.fillStyle = '#2E7D32'
    ctx.fillText(`b=${bClamped.toFixed(1)}`, bPx - 15, originY + 25)

    // 图例
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('— 离散CDF (阶梯)', width - 170, 25)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('— 连续CDF (光滑)', width - 170, 45)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(a<X≤b) = F(b)-F(a)  离散: ${(fBDiscrete - fADiscrete).toFixed(3)}  连续: ${(fBContinuous - fAContinuous).toFixed(3)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 10. 离散随机变量
  const drawDiscreteRV = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const p1 = getParam('s1', 0.4)
    const p2 = getParam('s2', 0.3)
    const nPoints = 4

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

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
      const y = originY - (graphHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }

    // 坐标轴
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

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('xₖ', originX + graphWidth - 10, originY + 25)
    ctx.fillText('P(X=xₖ)', originX - 60, originY - graphHeight + 10)

    // 生成概率分布律（使用p1, p2调整，剩余均分）
    const probs: number[] = []
    const p3 = Math.max(0.01, (1 - p1 - p2) / 2)
    const p4 = Math.max(0.01, (1 - p1 - p2) / 2)
    probs.push(p1, p2, p3, p4)
    const total = probs.reduce((a, b) => a + b, 0)
    // 归一化
    for (let i = 0; i < probs.length; i++) probs[i] /= total

    const barW = Math.min(40, graphWidth / (nPoints * 2))
    const gap = (graphWidth - barW * nPoints) / (nPoints + 1)

    // 标题
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText('概率分布律', 20, 25)

    for (let i = 0; i < nPoints; i++) {
      const x = originX + gap + i * (barW + gap)
      const barH = probs[i] * graphHeight
      const y = originY - barH

      // 柱状图
      ctx.fillStyle = 'rgba(198, 40, 40, 0.7)'
      ctx.fillRect(x, y, barW, barH)
      ctx.strokeStyle = '#C62828'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, barW, barH)

      // 顶部圆点
      ctx.fillStyle = '#C62828'
      ctx.beginPath()
      ctx.arc(x + barW / 2, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // x标签
      ctx.fillStyle = '#5D4037'
      ctx.font = '13px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${i}`, x + barW / 2, originY + 20)

      // 概率标签
      ctx.fillStyle = '#C62828'
      ctx.font = 'bold 11px "Noto Serif SC", serif'
      ctx.fillText(probs[i].toFixed(3), x + barW / 2, y - 10)
    }

    ctx.textAlign = 'left'

    // 分布律表
    const tableX = originX + graphWidth - 180
    const tableY = 45
    ctx.fillStyle = '#5D4037'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillText('X  | ' + Array.from({length: nPoints}, (_, i) => i).join('   | '), tableX, tableY)
    ctx.fillText('P  | ' + probs.map(p => p.toFixed(2)).join(' | '), tableX, tableY + 20)

    // 期望和方差
    const mean = probs.reduce((s, p, i) => s + i * p, 0)
    const variance = probs.reduce((s, p, i) => s + i * i * p, 0) - mean * mean

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`E(X) = ${mean.toFixed(3)}`, tableX, tableY + 48)
    ctx.fillText(`D(X) = ${variance.toFixed(3)}`, tableX, tableY + 68)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`n=${nPoints}  E(X)=${mean.toFixed(3)}  D(X)=${variance.toFixed(3)}  ΣP=${total.toFixed(4)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 11. 二项分布
  const drawBinomialDistribution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = getParam('sn', 10)
    const p = getParam('sp', 0.5)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    const padding = 50
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2 - 30
    const originX = padding
    const originY = canvasHeight - padding

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = originX + (graphWidth / 10) * i
      const y = originY - (graphHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }

    // 坐标轴
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

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('k', originX + graphWidth - 10, originY + 25)
    ctx.fillText('P(X=k)', originX - 55, originY - graphHeight + 10)

    // 计算二项分布 PMF
    const pmf: number[] = []
    let maxP = 0
    for (let k = 0; k <= n; k++) {
      const prob = binomialPMF(n, k, p)
      pmf.push(prob)
      if (prob > maxP) maxP = prob
    }

    const barW = Math.min(20, graphWidth / (n + 2))
    const gap = (graphWidth - barW * (n + 1)) / (n + 2)

    // 标题
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText(`二项分布 B(${n}, ${p.toFixed(2)})`, 20, 25)

    const mean = n * p
    const variance = n * p * (1 - p)

    for (let k = 0; k <= n; k++) {
      const x = originX + gap + k * (barW + gap)
      const barH = (pmf[k] / maxP) * graphHeight * 0.9
      const y = originY - barH

      // 均值附近高亮
      const isNearMean = Math.abs(k - mean) < 1.5
      ctx.fillStyle = isNearMean ? 'rgba(198, 40, 40, 0.8)' : 'rgba(21, 101, 192, 0.6)'
      ctx.fillRect(x, y, barW, barH)
      ctx.strokeStyle = isNearMean ? '#C62828' : '#1565C0'
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, barW, barH)

      // k标签（间隔显示）
      if (n <= 15 || k % 2 === 0 || k === n) {
        ctx.fillStyle = '#5D4037'
        ctx.font = '10px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${k}`, x + barW / 2, originY + 15)
      }
    }

    ctx.textAlign = 'left'

    // 期望线
    const meanPx = originX + gap + mean * (barW + gap) + barW / 2
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 3])
    ctx.beginPath()
    ctx.moveTo(meanPx, originY)
    ctx.lineTo(meanPx, originY - graphHeight)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText(`E(X)=np=${mean.toFixed(2)}`, meanPx + 5, originY - graphHeight + 20)

    // 参数
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`E(X) = np = ${mean.toFixed(2)}`, width - 200, 50)
    ctx.fillText(`D(X) = np(1-p) = ${variance.toFixed(2)}`, width - 200, 72)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`B(${n},${p.toFixed(2)})  E(X)=${mean.toFixed(2)}  D(X)=${variance.toFixed(2)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 12. 泊松分布
  const drawPoissonDistribution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const lambda = getParam('lambda', 3)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    const padding = 50
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2 - 30
    const originX = padding
    const originY = canvasHeight - padding

    // 绘制网格
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = originX + (graphWidth / 10) * i
      const y = originY - (graphHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }

    // 坐标轴
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

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('k', originX + graphWidth - 10, originY + 25)
    ctx.fillText('P(X=k)', originX - 55, originY - graphHeight + 10)

    // 泊松分布 PMF
    const maxK = Math.max(20, Math.ceil(lambda + 4 * Math.sqrt(lambda)))
    const pmf: number[] = []
    let maxP = 0
    for (let k = 0; k <= maxK; k++) {
      const prob = poissonPMF(lambda, k)
      pmf.push(prob)
      if (prob > maxP) maxP = prob
    }

    const barW = Math.min(18, graphWidth / (maxK + 2))
    const gap = Math.max(2, (graphWidth - barW * (maxK + 1)) / (maxK + 2))

    // 标题
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText(`泊松分布 P(λ=${lambda.toFixed(1)})`, 20, 25)

    for (let k = 0; k <= maxK; k++) {
      if (pmf[k] < 0.001) continue
      const x = originX + gap + k * (barW + gap)
      const barH = (pmf[k] / maxP) * graphHeight * 0.9
      const y = originY - barH

      const isNearLambda = Math.abs(k - lambda) < 1.5
      ctx.fillStyle = isNearLambda ? 'rgba(85, 139, 47, 0.8)' : 'rgba(21, 101, 192, 0.6)'
      ctx.fillRect(x, y, barW, barH)
      ctx.strokeStyle = isNearLambda ? '#558B2F' : '#1565C0'
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, barW, barH)

      // k标签
      if (maxK <= 15 || k % 3 === 0 || k === maxK) {
        ctx.fillStyle = '#5D4037'
        ctx.font = '9px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${k}`, x + barW / 2, originY + 14)
      }
    }

    ctx.textAlign = 'left'

    // λ 线
    const lambdaPx = originX + gap + lambda * (barW + gap)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 3])
    ctx.beginPath()
    ctx.moveTo(lambdaPx, originY)
    ctx.lineTo(lambdaPx, originY - graphHeight)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText(`λ=${lambda.toFixed(1)}`, lambdaPx + 5, originY - graphHeight + 20)

    // 参数
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`E(X) = λ = ${lambda.toFixed(2)}`, width - 180, 50)
    ctx.fillText(`D(X) = λ = ${lambda.toFixed(2)}`, width - 180, 72)
    ctx.fillStyle = '#558B2F'
    ctx.fillText('期望 = 方差', width - 180, 92)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(λ=${lambda.toFixed(1)})  E(X)=D(X)=λ=${lambda.toFixed(2)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 13. 连续随机变量
  const drawContinuousRV = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const a = getParam('sa', 0.5)
    const b = getParam('sb', 1.5)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

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
      const y = originY - (graphHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }

    // 坐标轴
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

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('x', originX + graphWidth - 10, originY + 25)
    ctx.fillText('f(x)', originX - 35, originY - graphHeight + 10)

    // 标题
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText('连续随机变量的PDF', 20, 25)

    // 绘制正态分布 PDF 作为示例
    const scaleX = graphWidth / 6
    const scaleY = graphHeight * 0.85

    // 阴影区域 (a到b的面积 = 概率)
    ctx.fillStyle = 'rgba(198, 40, 40, 0.2)'
    ctx.beginPath()
    ctx.moveTo(originX + (a + 3) * scaleX, originY)
    for (let px = Math.max(0, (a + 3) * scaleX); px <= Math.min(graphWidth, (b + 3) * scaleX); px++) {
      const x = px / scaleX - 3
      const y = normalPDF(x, 0, 1)
      ctx.lineTo(originX + px, originY - y * scaleY)
    }
    ctx.lineTo(originX + Math.min(graphWidth, (b + 3) * scaleX), originY)
    ctx.closePath()
    ctx.fill()

    // PDF 曲线
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) {
      const x = px / scaleX - 3
      const y = normalPDF(x, 0, 1)
      const py = originY - y * scaleY
      if (px === 0) ctx.moveTo(originX + px, py)
      else ctx.lineTo(originX + px, py)
    }
    ctx.stroke()

    // a和b标记线
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    const aPx = originX + (a + 3) * scaleX
    const bPx = originX + (b + 3) * scaleX
    ctx.beginPath()
    ctx.moveTo(aPx, originY)
    ctx.lineTo(aPx, originY - normalPDF(a, 0, 1) * scaleY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(bPx, originY)
    ctx.lineTo(bPx, originY - normalPDF(b, 0, 1) * scaleY)
    ctx.stroke()
    ctx.setLineDash([])

    // 标注
    ctx.fillStyle = '#C62828'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillText(`a=${a.toFixed(1)}`, aPx - 10, originY + 18)
    ctx.fillText(`b=${b.toFixed(1)}`, bPx - 10, originY + 18)

    // 面积标注
    const prob = normalCDF(b, 0, 1) - normalCDF(a, 0, 1)
    const midPx = originX + ((a + b) / 2 + 3) * scaleX
    const midPy = originY - normalPDF((a + b) / 2, 0, 1) * scaleY / 2
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText(`P=${prob.toFixed(4)}`, midPx, midPy)
    ctx.textAlign = 'left'

    // 公式
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(a≤X≤b) = ∫[a,b] f(x)dx`, width - 220, 50)
    ctx.fillText(`= ${prob.toFixed(4)}`, width - 220, 72)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`P(${a.toFixed(1)}≤X≤${b.toFixed(1)})=${prob.toFixed(4)}`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 14. 均匀分布与指数分布
  const drawUniformExponential = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const a = getParam('a', 0)
    const b = getParam('b', 3)
    const lambda = getParam('lambda', 1)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    const padding = 40
    const halfW = (width - padding * 3) / 2
    const graphHeight = canvasHeight - padding * 2 - 40
    const originXL = padding
    const originXR = padding * 2 + halfW
    const originY = canvasHeight - padding

    // 绘制网格（左半区）
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(originXL + (halfW / 5) * i, originY - graphHeight)
      ctx.lineTo(originXL + (halfW / 5) * i, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originXL, originY - (graphHeight / 5) * i)
      ctx.lineTo(originXL + halfW, originY - (graphHeight / 5) * i)
      ctx.stroke()
    }
    // 右半区
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(originXR + (halfW / 5) * i, originY - graphHeight)
      ctx.lineTo(originXR + (halfW / 5) * i, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originXR, originY - (graphHeight / 5) * i)
      ctx.lineTo(originXR + halfW, originY - (graphHeight / 5) * i)
      ctx.stroke()
    }

    // 坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(originXL, originY)
    ctx.lineTo(originXL + halfW, originY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(originXL, originY)
    ctx.lineTo(originXL, originY - graphHeight)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(originXR, originY)
    ctx.lineTo(originXR + halfW, originY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(originXR, originY)
    ctx.lineTo(originXR, originY - graphHeight)
    ctx.stroke()

    // 左半区：均匀分布 U(a,b)
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText(`均匀分布 U(${a},${b})`, originXL + halfW / 2, 25)

    const xRange = Math.max(b + 1, 6)
    const scaleLX = halfW / xRange
    const uniformH = 1 / (b - a)
    const scaleLY = graphHeight / (uniformH * 2.5)

    // 均匀分布填充
    ctx.fillStyle = 'rgba(198, 40, 40, 0.2)'
    ctx.fillRect(originXL + a * scaleLX, originY - uniformH * scaleLY, (b - a) * scaleLX, uniformH * scaleLY)

    // 均匀分布线
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originXL, originY)
    ctx.lineTo(originXL + a * scaleLX, originY)
    ctx.lineTo(originXL + a * scaleLX, originY - uniformH * scaleLY)
    ctx.lineTo(originXL + b * scaleLX, originY - uniformH * scaleLY)
    ctx.lineTo(originXL + b * scaleLX, originY)
    ctx.lineTo(originXL + halfW, originY)
    ctx.stroke()

    // 标注
    ctx.fillStyle = '#C62828'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText(`a=${a}`, originXL + a * scaleLX, originY + 18)
    ctx.fillText(`b=${b}`, originXL + b * scaleLX, originY + 18)
    ctx.fillText(`f=${uniformH.toFixed(3)}`, originXL + (a + b) / 2 * scaleLX, originY - uniformH * scaleLY - 10)

    // 右半区：指数分布 Exp(λ)
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText(`指数分布 Exp(${lambda.toFixed(1)})`, originXR + halfW / 2, 25)

    const expRange = Math.max(5 / lambda, 4)
    const scaleRX = halfW / expRange
    const scaleRY = graphHeight / (lambda * 1.5)

    // 指数分布填充
    ctx.fillStyle = 'rgba(21, 101, 192, 0.15)'
    ctx.beginPath()
    ctx.moveTo(originXR, originY)
    for (let px = 0; px <= halfW; px++) {
      const x = px / scaleRX
      const y = lambda * Math.exp(-lambda * x)
      ctx.lineTo(originXR + px, originY - y * scaleRY)
    }
    ctx.lineTo(originXR + halfW, originY)
    ctx.closePath()
    ctx.fill()

    // 指数分布线
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originXR, originY - lambda * scaleRY)
    for (let px = 0; px <= halfW; px++) {
      const x = px / scaleRX
      const y = lambda * Math.exp(-lambda * x)
      ctx.lineTo(originXR + px, originY - y * scaleRY)
    }
    ctx.stroke()

    // 标注
    ctx.fillStyle = '#1565C0'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillText(`λ=${lambda.toFixed(1)}`, originXR + 25, originY - lambda * scaleRY - 10)
    ctx.fillText(`f(0)=${lambda.toFixed(2)}`, originXR + 15, originY - lambda * scaleRY + 15)

    ctx.textAlign = 'left'

    // 参数对比
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText(`E(X)=${((a + b) / 2).toFixed(2)}`, originXL + 5, originY - graphHeight - 5)
    ctx.fillText(`D(X)=${((b - a) ** 2 / 12).toFixed(3)}`, originXL + 80, originY - graphHeight - 5)

    ctx.fillText(`E(X)=${(1 / lambda).toFixed(2)}`, originXR + 5, originY - graphHeight - 5)
    ctx.fillText(`D(X)=${(1 / (lambda * lambda)).toFixed(3)}`, originXR + 80, originY - graphHeight - 5)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`U(${a},${b}): E=${((a+b)/2).toFixed(2)} D=${((b-a)**2/12).toFixed(3)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`Exp(${lambda.toFixed(1)}): E=${(1/lambda).toFixed(2)} D=${(1/(lambda*lambda)).toFixed(3)}`, 340, canvasHeight + 30)
  }, [modelState.params])

  // 15. 正态分布
  const drawNormalDistribution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const mu = getParam('smu', 0)
    const sigma = getParam('ssigma', 1)

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

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
      const y = originY - (graphHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, originY - graphHeight)
      ctx.lineTo(x, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originX, y)
      ctx.lineTo(originX + graphWidth, y)
      ctx.stroke()
    }

    // 坐标轴
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

    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('x', originX + graphWidth - 10, originY + 25)
    ctx.fillText('f(x)', originX - 35, originY - graphHeight + 10)

    // 标题
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.fillText(`正态分布 N(${mu.toFixed(1)}, ${sigma.toFixed(2)}²)`, 20, 25)

    const xRange = 4 * sigma + Math.abs(mu)
    const scaleX = graphWidth / (2 * xRange)
    const centerX = originX + graphWidth / 2 + mu * scaleX
    const maxPDF = normalPDF(mu, mu, sigma)
    const scaleY = (graphHeight * 0.85) / maxPDF

    // 3σ阴影区域
    const regions = [
      { start: mu - sigma, end: mu + sigma, color: 'rgba(198, 40, 40, 0.2)', label: '68.27%' },
      { start: mu - 2 * sigma, end: mu + 2 * sigma, color: 'rgba(21, 101, 192, 0.1)', label: '95.45%' },
      { start: mu - 3 * sigma, end: mu + 3 * sigma, color: 'rgba(85, 139, 47, 0.08)', label: '99.73%' },
    ]

    // 从外到内绘制阴影
    for (let r = regions.length - 1; r >= 0; r--) {
      const region = regions[r]
      ctx.fillStyle = region.color
      ctx.beginPath()
      const startPx = centerX + (region.start - mu) * scaleX
      const endPx = centerX + (region.end - mu) * scaleX
      ctx.moveTo(startPx, originY)
      for (let px = startPx; px <= endPx; px++) {
        const x = mu + (px - centerX) / scaleX
        const y = normalPDF(x, mu, sigma)
        ctx.lineTo(px, originY - y * scaleY)
      }
      ctx.lineTo(endPx, originY)
      ctx.closePath()
      ctx.fill()
    }

    // PDF 曲线
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let px = originX; px <= originX + graphWidth; px++) {
      const x = mu + (px - centerX) / scaleX
      const y = normalPDF(x, mu, sigma)
      const py = originY - y * scaleY
      if (px === originX) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // μ 线
    const muPx = centerX
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 3])
    ctx.beginPath()
    ctx.moveTo(muPx, originY)
    ctx.lineTo(muPx, originY - maxPDF * scaleY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText(`μ=${mu.toFixed(1)}`, muPx + 5, originY - maxPDF * scaleY - 8)

    // σ 标记
    for (let i = 1; i <= 3; i++) {
      const sPx1 = centerX - i * sigma * scaleX
      const sPx2 = centerX + i * sigma * scaleX
      ctx.strokeStyle = i === 1 ? '#C62828' : i === 2 ? '#1565C0' : '#558B2F'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(sPx1, originY)
      ctx.lineTo(sPx1, originY - graphHeight * 0.3)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(sPx2, originY)
      ctx.lineTo(sPx2, originY - graphHeight * 0.3)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.font = '10px "Noto Serif SC", serif'
      ctx.fillStyle = ctx.strokeStyle
      ctx.textAlign = 'center'
      ctx.fillText(`${i}σ`, sPx1, originY + 15)
      ctx.fillText(`${i}σ`, sPx2, originY + 15)
    }

    ctx.textAlign = 'left'

    // 概率标注
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.fillStyle = '#C62828'
    ctx.fillText(`P(μ-σ,μ+σ) = 68.27%`, width - 180, 50)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`P(μ-2σ,μ+2σ) = 95.45%`, width - 180, 70)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`P(μ-3σ,μ+3σ) = 99.73%`, width - 180, 90)

    // 参数
    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`E(X) = μ = ${mu.toFixed(2)}`, width - 180, 120)
    ctx.fillText(`D(X) = σ² = ${(sigma * sigma).toFixed(2)}`, width - 180, 142)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`N(${mu.toFixed(1)},${(sigma*sigma).toFixed(2)})  μ=${mu.toFixed(2)}  σ=${sigma.toFixed(2)}  3σ原则: 99.73%`, 20, canvasHeight + 30)
  }, [modelState.params])

  // 16. 随机变量函数的分布
  const drawRVFunction = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gtype = Math.floor(getParam('sg', 0))

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    const padding = 40
    const halfW = (width - padding * 3) / 2
    const graphHeight = canvasHeight - padding * 2 - 50
    const originXL = padding
    const originXR = padding * 2 + halfW
    const originY = canvasHeight - padding

    // 绘制网格（左半区）
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(originXL + (halfW / 5) * i, originY - graphHeight)
      ctx.lineTo(originXL + (halfW / 5) * i, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originXL, originY - (graphHeight / 5) * i)
      ctx.lineTo(originXL + halfW, originY - (graphHeight / 5) * i)
      ctx.stroke()
    }
    // 右半区
    for (let i = 0; i <= 5; i++) {
      ctx.beginPath()
      ctx.moveTo(originXR + (halfW / 5) * i, originY - graphHeight)
      ctx.lineTo(originXR + (halfW / 5) * i, originY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(originXR, originY - (graphHeight / 5) * i)
      ctx.lineTo(originXR + halfW, originY - (graphHeight / 5) * i)
      ctx.stroke()
    }

    // 坐标轴
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(originXL, originY)
    ctx.lineTo(originXL + halfW, originY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(originXL, originY)
    ctx.lineTo(originXL, originY - graphHeight)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(originXR, originY)
    ctx.lineTo(originXR + halfW, originY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(originXR, originY)
    ctx.lineTo(originXR, originY - graphHeight)
    ctx.stroke()

    // 变换后分布：0: Y=X², 1: Y=2X, 2: Y=eˣ
    const transformLabels = ['Y = X²', 'Y = 2X', 'Y = eˣ']
    const transformLabel = transformLabels[gtype] || transformLabels[0]

    // X~U(0,1)的PDF在[0,1]上恒为1
    const xPDF = (x: number) => (x >= 0 && x <= 1) ? 1 : 0

    // 变换后Y的PDF
    const yPDF = (y: number) => {
      if (gtype === 0) { // Y=X², h(y)=sqrt(y), h'(y)=1/(2*sqrt(y))
        return (y > 0 && y <= 1) ? 1 / (2 * Math.sqrt(y)) : 0
      } else if (gtype === 1) { // Y=2X, h(y)=y/2, h'(y)=1/2
        return (y >= 0 && y <= 2) ? 0.5 : 0
      } else { // Y=eˣ, h(y)=ln(y), h'(y)=1/y
        return (y >= 1 && y <= Math.E) ? 1 / y : 0
      }
    }

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.fillText(transformLabel, originXR + halfW / 2, 25)

    // 左侧：X~U(0,1)的PDF填充
    const scaleY = graphHeight * 0.85
    ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'
    const uLeft = originXL + (0 / 4) * halfW
    const uRight = originXL + (1 / 4) * halfW
    ctx.fillRect(uLeft, originY - scaleY, uRight - uLeft, scaleY)

    // 绘制X的PDF
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originXL, originY)
    ctx.lineTo(uLeft, originY)
    ctx.lineTo(uLeft, originY - scaleY)
    ctx.lineTo(uRight, originY - scaleY)
    ctx.lineTo(uRight, originY)
    ctx.lineTo(originXL + halfW, originY)
    ctx.stroke()

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('X ~ U(0, 1)', originXL + halfW / 2, 25)

    // 右侧：Y的PDF
    let yMax = 0
    const yRange = gtype === 0 ? 1 : gtype === 1 ? 2 : Math.E
    const yStart = gtype === 2 ? 1 : 0
    for (let y = yStart; y <= yRange; y += 0.01) {
      yMax = Math.max(yMax, yPDF(y))
    }
    const newScaleY = (graphHeight * 0.85) / Math.max(yMax, 0.01)
    const newScaleX = halfW / (yRange - yStart + 0.5)

    // 变换后 PDF 填充
    ctx.fillStyle = 'rgba(21, 101, 192, 0.15)'
    ctx.beginPath()
    ctx.moveTo(originXR + 0.25 * halfW, originY)
    for (let px = 0; px <= halfW; px++) {
      const y = yStart + (px / halfW) * (yRange - yStart + 0.5) - 0.25
      const pdf = yPDF(y)
      ctx.lineTo(originXR + px, originY - pdf * newScaleY)
    }
    ctx.lineTo(originXR + halfW, originY)
    ctx.closePath()
    ctx.fill()

    // 变换后 PDF 曲线
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 3
    ctx.beginPath()
    let started = false
    for (let px = 0; px <= halfW; px++) {
      const y = yStart + (px / halfW) * (yRange - yStart + 0.5) - 0.25
      const pdf = yPDF(y)
      const py = originY - pdf * newScaleY
      if (!started) { ctx.moveTo(originXR + px, py); started = true }
      else ctx.lineTo(originXR + px, py)
    }
    ctx.stroke()

    // 中间变换箭头
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 3
    const arrowX1 = originXL + halfW + 10
    const arrowX2 = originXR - 10
    const arrowY = originY - graphHeight / 2
    ctx.beginPath()
    ctx.moveTo(arrowX1, arrowY)
    ctx.lineTo(arrowX2, arrowY)
    ctx.stroke()
    // 箭头头
    ctx.beginPath()
    ctx.moveTo(arrowX2, arrowY)
    ctx.lineTo(arrowX2 - 10, arrowY - 6)
    ctx.lineTo(arrowX2 - 10, arrowY + 6)
    ctx.closePath()
    ctx.fillStyle = '#5D4037'
    ctx.fill()

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText(transformLabel, (arrowX1 + arrowX2) / 2, arrowY - 12)

    // 参数
    ctx.textAlign = 'left'
    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText(`E(X)=0.5`, originXL + 5, originY - graphHeight - 5)
    ctx.fillText(`D(X)=1/12`, originXL + 80, originY - graphHeight - 5)

    const eY = gtype === 0 ? '1/3' : gtype === 1 ? '1' : 'e-1'
    const dY = gtype === 0 ? '4/45' : gtype === 1 ? '1/3' : 'e²-2e-1'
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`E(Y)=${eY}`, originXR + 5, originY - graphHeight - 5)
    ctx.fillText(`D(Y)=${dY}`, originXR + 100, originY - graphHeight - 5)

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
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`${transformLabel}  X~U(0,1) → Y的PDF  f_Y(y)=f_X(h(y))|h'(y)|`, 20, canvasHeight + 30)
  }, [modelState.params])

  // ========== 第三章：二维随机变量及其分布 ==========

  // 1. 二维联合分布热力图
  const drawJointDistribution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rho = getParam('rho', 0.5)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const plotSize = Math.min(width - padding * 2, canvasHeight - padding * 2 - 30)
    const plotX = (width - plotSize) / 2
    const plotY = 40

    const bvnPdf = (x: number, y: number) => {
      const denom = 2 * Math.PI * Math.sqrt(1 - rho * rho)
      const expArg = -1 / (2 * (1 - rho * rho)) * (x * x - 2 * rho * x * y + y * y)
      return (1 / denom) * Math.exp(expArg)
    }

    const maxDensity = bvnPdf(0, 0)
    const range = 3

    const resolution = 2
    for (let px = 0; px < plotSize; px += resolution) {
      for (let py = 0; py < plotSize; py += resolution) {
        const x = -range + (2 * range * px) / plotSize
        const y = range - (2 * range * py) / plotSize
        const density = bvnPdf(x, y)
        const intensity = Math.pow(density / maxDensity, 0.4)
        const r = Math.round(93 + (21 - 93) * intensity)
        const g = Math.round(64 + (101 - 64) * intensity)
        const b = Math.round(55 + (192 - 55) * intensity)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(plotX + px, plotY + py, resolution, resolution)
      }
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(plotX, plotY, plotSize, plotSize)

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('x', plotX + plotSize / 2, plotY + plotSize + 20)
    ctx.save()
    ctx.translate(plotX - 20, plotY + plotSize / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('y', 0, 0)
    ctx.restore()

    ctx.font = '12px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    for (let v = -2; v <= 2; v++) {
      const xp = plotX + ((v + range) / (2 * range)) * plotSize
      const yp = plotY + ((range - v) / (2 * range)) * plotSize
      ctx.fillStyle = '#5D4037'
      ctx.fillText(v.toString(), xp, plotY + plotSize + 15)
      ctx.textAlign = 'right'
      ctx.fillText(v.toString(), plotX - 5, yp + 4)
      ctx.textAlign = 'center'
    }

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('二维联合正态分布热力图', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`ρ = ${rho.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`f(x,y) = exp{-1/(2(1-ρ²))[x²-2ρxy+y²]} / (2π√(1-ρ²))`, 120, canvasHeight + 30)
  }, [modelState.params])

  // 2. 二维离散联合分布律
  const drawTwoDimDiscrete = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const m = Math.round(getParam('m', 3))
    const n = Math.round(getParam('n', 3))
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const probs: number[][] = []
    let S = 0
    for (let i = 0; i < m; i++) {
      probs[i] = []
      for (let j = 0; j < n; j++) {
        probs[i][j] = (i + 1) * (j + 1)
        S += probs[i][j]
      }
    }
    let maxP = 0
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        probs[i][j] /= S
        if (probs[i][j] > maxP) maxP = probs[i][j]
      }
    }

    const padding = 70
    const cellW = Math.min(80, (width - padding * 2) / (n + 1))
    const cellH = Math.min(60, (canvasHeight - padding * 2 - 30) / (m + 1))
    const startX = (width - cellW * (n + 1)) / 2
    const startY = 40

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('Y\\X', startX + cellW / 2, startY + cellH / 2 + 4)
    for (let j = 0; j < n; j++) {
      ctx.fillText(`x${j + 1}`, startX + (j + 1) * cellW + cellW / 2, startY + cellH / 2 + 4)
    }

    for (let i = 0; i < m; i++) {
      const rowY = startY + (i + 1) * cellH
      ctx.fillStyle = '#5D4037'
      ctx.font = 'bold 13px "Noto Serif SC", serif'
      ctx.fillText(`y${i + 1}`, startX + cellW / 2, rowY + cellH / 2 + 4)

      for (let j = 0; j < n; j++) {
        const cx = startX + (j + 1) * cellW
        const p = probs[i][j]
        const intensity = p / maxP
        const r = Math.round(244 - (244 - 21) * intensity)
        const g = Math.round(228 - (228 - 101) * intensity)
        const b = Math.round(188 - (188 - 192) * intensity)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(cx, rowY, cellW, cellH)
        ctx.strokeStyle = '#C4A77D'
        ctx.lineWidth = 1
        ctx.strokeRect(cx, rowY, cellW, cellH)
        ctx.fillStyle = intensity > 0.5 ? '#FFFFFF' : '#3E2723'
        ctx.font = '12px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.fillText(p.toFixed(3), cx + cellW / 2, rowY + cellH / 2 + 4)
      }
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, cellW * (n + 1), cellH * (m + 1))
    ctx.beginPath()
    ctx.moveTo(startX + cellW, startY)
    ctx.lineTo(startX + cellW, startY + cellH * (m + 1))
    ctx.moveTo(startX, startY + cellH)
    ctx.lineTo(startX + cellW * (n + 1), startY + cellH)
    ctx.stroke()

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('二维离散联合分布律', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`m = ${m}, n = ${n}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('颜色深浅表示概率大小', 150, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText('∑p(i,j) = 1', 350, canvasHeight + 30)
  }, [modelState.params])

  // 3. 二维连续联合PDF等高线图
  const drawTwoDimContinuous = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rho = getParam('rho', 0)
    const sigma_x = getParam('sigma_x', 1)
    const sigma_y = getParam('sigma_y', 1)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const plotSize = Math.min(width - padding * 2, canvasHeight - padding * 2 - 30)
    const plotX = (width - plotSize) / 2
    const plotY = 45
    const range = 3.5

    const toPixelX = (x: number) => plotX + ((x + range) / (2 * range)) * plotSize
    const toPixelY = (y: number) => plotY + ((range - y) / (2 * range)) * plotSize

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let v = -3; v <= 3; v++) {
      const px = toPixelX(v)
      const py = toPixelY(v)
      ctx.beginPath(); ctx.moveTo(px, plotY); ctx.lineTo(px, plotY + plotSize); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(plotX, py); ctx.lineTo(plotX + plotSize, py); ctx.stroke()
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(plotX, toPixelY(0)); ctx.lineTo(plotX + plotSize, toPixelY(0)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(toPixelX(0), plotY); ctx.lineTo(toPixelX(0), plotY + plotSize); ctx.stroke()

    const contourLevels = [0.5, 1.0, 1.5, 2.0, 2.5]
    const colors = ['#C62828', '#E53935', '#FF7043', '#FFA726', '#FFD54F']

    contourLevels.forEach((c, idx) => {
      ctx.strokeStyle = colors[idx]
      ctx.lineWidth = 2 - idx * 0.2
      ctx.beginPath()
      let started = false
      for (let theta = 0; theta <= Math.PI * 2 + 0.01; theta += 0.02) {
        const cosT = Math.cos(theta)
        const sinT = Math.sin(theta)
        const a11 = 1 / (sigma_x * sigma_x)
        const a12 = -rho / (sigma_x * sigma_y)
        const a22 = 1 / (sigma_y * sigma_y)
        const denom = a11 * cosT * cosT + 2 * a12 * cosT * sinT + a22 * sinT * sinT
        if (denom <= 0) continue
        const r = c / Math.sqrt(denom)
        const x = r * cosT
        const y = r * sinT
        const px = toPixelX(x)
        const py = toPixelY(y)
        if (!started) { ctx.moveTo(px, py); started = true }
        else { ctx.lineTo(px, py) }
      }
      ctx.stroke()
    })

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('x', plotX + plotSize + 15, toPixelY(0) + 4)
    ctx.fillText('y', toPixelX(0), plotY - 10)

    ctx.font = '12px "Noto Serif SC", serif'
    for (let v = -3; v <= 3; v++) {
      if (v === 0) continue
      ctx.fillText(v.toString(), toPixelX(v), toPixelY(0) + 15)
      ctx.textAlign = 'right'
      ctx.fillText(v.toString(), toPixelX(0) - 5, toPixelY(v) + 4)
      ctx.textAlign = 'center'
    }

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('二维连续联合PDF等高线图', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`ρ = ${rho.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillText(`σ_x = ${sigma_x.toFixed(2)}`, 100, canvasHeight + 30)
    ctx.fillText(`σ_y = ${sigma_y.toFixed(2)}`, 200, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('等高线为椭圆', 310, canvasHeight + 30)
  }, [modelState.params])

  // 4. 边缘分布
  const drawMarginalDistribution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rho = getParam('rho', 0.5)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const margin = 50
    const topMargin = 80
    const rightMargin = 80
    const plotW = width - margin - rightMargin
    const plotH = canvasHeight - topMargin - margin
    const plotX = margin
    const plotY = topMargin
    const range = 3

    const bvnPdf = (x: number, y: number) => {
      const denom = 2 * Math.PI * Math.sqrt(1 - rho * rho)
      const expArg = -1 / (2 * (1 - rho * rho)) * (x * x - 2 * rho * x * y + y * y)
      return (1 / denom) * Math.exp(expArg)
    }
    const maxDensity = bvnPdf(0, 0)

    const resolution = 3
    for (let px = 0; px < plotW; px += resolution) {
      for (let py = 0; py < plotH; py += resolution) {
        const x = -range + (2 * range * px) / plotW
        const y = range - (2 * range * py) / plotH
        const density = bvnPdf(x, y)
        const intensity = Math.pow(density / maxDensity, 0.4)
        const r = Math.round(93 + (21 - 93) * intensity)
        const g = Math.round(64 + (101 - 64) * intensity)
        const b = Math.round(55 + (192 - 55) * intensity)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(plotX + px, plotY + py, resolution, resolution)
      }
    }
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(plotX, plotY, plotW, plotH)

    const topH = topMargin - 20
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let px = 0; px <= plotW; px++) {
      const x = -range + (2 * range * px) / plotW
      const fx = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-x * x / 2)
      const barH = (fx / 0.4) * topH
      const drawX = plotX + px
      const drawY = plotY - barH
      if (px === 0) ctx.moveTo(drawX, drawY)
      else ctx.lineTo(drawX, drawY)
    }
    ctx.stroke()
    ctx.fillStyle = '#C62828'
    ctx.font = '11px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillText('f_X(x)', plotX + 5, plotY - topH + 5)

    const rightW = rightMargin - 20
    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let py = 0; py <= plotH; py++) {
      const y = range - (2 * range * py) / plotH
      const fy = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-y * y / 2)
      const barW = (fy / 0.4) * rightW
      const drawX = plotX + plotW + barW
      const drawY = plotY + py
      if (py === 0) ctx.moveTo(drawX, drawY)
      else ctx.lineTo(drawX, drawY)
    }
    ctx.stroke()
    ctx.fillStyle = '#1565C0'
    ctx.font = '11px "Noto Serif SC", serif'
    ctx.fillText('f_Y(y)', plotX + plotW + 5, plotY + 15)

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('边缘分布', width / 2, 20)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`ρ = ${rho.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText('X边缘: N(0,1)', 110, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('Y边缘: N(0,1)', 250, canvasHeight + 30)
  }, [modelState.params])

  // 5. 条件分布
  const drawConditionalDistribution = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const y_condition = getParam('y_condition', 0)
    const rho = getParam('rho', 0.5)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const plotSize = Math.min(width - padding * 2, canvasHeight - padding * 2 - 30)
    const plotX = (width - plotSize) / 2
    const plotY = 45
    const range = 3.5

    const toPixelX = (x: number) => plotX + ((x + range) / (2 * range)) * plotSize
    const toPixelY = (y: number) => plotY + ((range - y) / (2 * range)) * plotSize

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let v = -3; v <= 3; v++) {
      const px = toPixelX(v)
      const py = toPixelY(v)
      ctx.beginPath(); ctx.moveTo(px, plotY); ctx.lineTo(px, plotY + plotSize); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(plotX, py); ctx.lineTo(plotX + plotSize, py); ctx.stroke()
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(plotX, toPixelY(0)); ctx.lineTo(plotX + plotSize, toPixelY(0)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(toPixelX(0), plotY); ctx.lineTo(toPixelX(0), plotY + plotSize); ctx.stroke()

    const contourLevels = [0.5, 1.0, 1.5, 2.0, 2.5]
    const colors = ['#E53935', '#FF7043', '#FFA726', '#FFD54F', '#FFF176']
    contourLevels.forEach((c, idx) => {
      ctx.strokeStyle = colors[idx]
      ctx.lineWidth = 1.5
      ctx.beginPath()
      let started = false
      for (let theta = 0; theta <= Math.PI * 2 + 0.01; theta += 0.02) {
        const cosT = Math.cos(theta)
        const sinT = Math.sin(theta)
        const a11 = 1, a12 = -rho, a22 = 1
        const denom = a11 * cosT * cosT + 2 * a12 * cosT * sinT + a22 * sinT * sinT
        if (denom <= 0) continue
        const r = c / Math.sqrt(denom)
        const x = r * cosT
        const y = r * sinT
        const px = toPixelX(x)
        const py = toPixelY(y)
        if (!started) { ctx.moveTo(px, py); started = true }
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    })

    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    const ycPy = toPixelY(y_condition)
    ctx.beginPath()
    ctx.moveTo(plotX, ycPy)
    ctx.lineTo(plotX + plotSize, ycPy)
    ctx.stroke()
    ctx.setLineDash([])

    const condMu = rho * y_condition
    const condSigma = Math.sqrt(1 - rho * rho)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    let maxFx = 0
    for (let x = -range; x <= range; x += 0.01) {
      const fx = (1 / (condSigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - condMu) ** 2) / (2 * condSigma * condSigma))
      if (fx > maxFx) maxFx = fx
    }
    const scaleF = plotSize / (2 * range) * 0.4
    let started = false
    for (let x = -range; x <= range; x += 0.02) {
      const fx = (1 / (condSigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - condMu) ** 2) / (2 * condSigma * condSigma))
      const px = toPixelX(x)
      const py = ycPy - fx * scaleF / maxFx * 80
      if (!started) { ctx.moveTo(px, py); started = true }
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillText(`X|Y=${y_condition.toFixed(1)} ~ N(${condMu.toFixed(2)}, ${(condSigma * condSigma).toFixed(2)})`, plotX + 5, ycPy - 90)

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('x', plotX + plotSize + 15, toPixelY(0) + 4)
    ctx.fillText('y', toPixelX(0), plotY - 10)

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('条件分布', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`Y = ${y_condition.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillText(`ρ = ${rho.toFixed(2)}`, 130, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`条件均值 = ρy = ${condMu.toFixed(2)}`, 230, canvasHeight + 30)
    ctx.fillText(`条件方差 = 1-ρ² = ${(condSigma * condSigma).toFixed(2)}`, 420, canvasHeight + 30)
  }, [modelState.params])

  // 6. 随机变量独立性
  const drawRVIndependence = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rho = getParam('rho', 0)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const halfW = width / 2
    const padding = 50
    const plotSize = Math.min(halfW - padding * 2, canvasHeight - padding * 2 - 30)
    const range = 3

    const drawHeatmap = (offsetX: number, rhoVal: number, title: string) => {
      const plotX = offsetX + (halfW - plotSize) / 2
      const plotY = 55

      const bvnPdf = (x: number, y: number) => {
        const denom = 2 * Math.PI * Math.sqrt(Math.max(1e-10, 1 - rhoVal * rhoVal))
        const expArg = -1 / (2 * Math.max(1e-10, 1 - rhoVal * rhoVal)) * (x * x - 2 * rhoVal * x * y + y * y)
        return (1 / denom) * Math.exp(expArg)
      }
      const maxD = bvnPdf(0, 0)

      const resolution = 3
      for (let px = 0; px < plotSize; px += resolution) {
        for (let py = 0; py < plotSize; py += resolution) {
          const x = -range + (2 * range * px) / plotSize
          const y = range - (2 * range * py) / plotSize
          const density = bvnPdf(x, y)
          const intensity = Math.pow(density / maxD, 0.4)
          const r = Math.round(93 + (21 - 93) * intensity)
          const g = Math.round(64 + (101 - 64) * intensity)
          const b = Math.round(55 + (192 - 55) * intensity)
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(plotX + px, plotY + py, resolution, resolution)
        }
      }
      ctx.strokeStyle = '#5D4037'
      ctx.lineWidth = 2
      ctx.strokeRect(plotX, plotY, plotSize, plotSize)

      const contourLevels = [1.0, 2.0]
      contourLevels.forEach(c => {
        ctx.strokeStyle = 'rgba(198, 40, 40, 0.6)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        let started = false
        for (let theta = 0; theta <= Math.PI * 2 + 0.01; theta += 0.02) {
          const cosT = Math.cos(theta)
          const sinT = Math.sin(theta)
          const a11 = 1, a12 = -rhoVal, a22 = 1
          const denom = a11 * cosT * cosT + 2 * a12 * cosT * sinT + a22 * sinT * sinT
          if (denom <= 0) continue
          const r = c / Math.sqrt(denom)
          const x = r * cosT
          const y = r * sinT
          const px = plotX + ((x + range) / (2 * range)) * plotSize
          const py = plotY + ((range - y) / (2 * range)) * plotSize
          if (!started) { ctx.moveTo(px, py); started = true }
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      })

      ctx.fillStyle = '#3E2723'
      ctx.font = 'bold 13px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.fillText(title, plotX + plotSize / 2, plotY + plotSize + 20)
      ctx.font = '12px "Noto Serif SC", serif'
      ctx.fillStyle = Math.abs(rhoVal) < 0.01 ? '#558B2F' : '#C62828'
      ctx.fillText(Math.abs(rhoVal) < 0.01 ? '独立 (圆对称)' : '不独立 (椭圆倾斜)', plotX + plotSize / 2, plotY + plotSize + 38)
    }

    drawHeatmap(0, 0, 'ρ = 0')
    drawHeatmap(halfW, rho, `ρ = ${rho.toFixed(2)}`)

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('随机变量独立性对比', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`ρ = ${rho.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = Math.abs(rho) < 0.01 ? '#558B2F' : '#C62828'
    ctx.fillText(Math.abs(rho) < 0.01 ? 'X与Y独立 ⟺ f(x,y)=f_X(x)f_Y(y)' : 'X与Y不独立 ⟺ f(x,y)≠f_X(x)f_Y(y)', 130, canvasHeight + 30)
  }, [modelState.params])

  // 7. 二维随机变量函数的分布
  const drawTwoDimFunction = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const a = getParam('a', 1)
    const b = getParam('b', 1)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2 - 20
    const originX = padding
    const originY = canvasHeight - padding

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
      const x = originX + (graphWidth / 10) * (i + 5)
      ctx.beginPath(); ctx.moveTo(x, originY - graphHeight); ctx.lineTo(x, originY); ctx.stroke()
      const y = originY - (graphHeight / 10) * (i + 5)
      ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + graphWidth, y); ctx.stroke()
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY - graphHeight); ctx.stroke()

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

    const sigmaZ = Math.sqrt(a * a + b * b)
    const zRange = Math.max(4, 3 * sigmaZ)

    const normalPdf = (z: number, mu: number, sigma: number) => {
      return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((z - mu) ** 2) / (2 * sigma * sigma))
    }
    const maxF = normalPdf(0, 0, sigmaZ)
    const scaleY = (graphHeight * 0.8) / maxF

    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 3
    ctx.beginPath()
    let started = false
    for (let px = 0; px <= graphWidth; px++) {
      const z = -zRange + (2 * zRange * px) / graphWidth
      const fz = normalPdf(z, 0, sigmaZ)
      const drawX = originX + px
      const drawY = originY - fz * scaleY
      if (!started) { ctx.moveTo(drawX, drawY); started = true }
      else ctx.lineTo(drawX, drawY)
    }
    ctx.stroke()

    ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    for (let px = 0; px <= graphWidth; px++) {
      const z = -zRange + (2 * zRange * px) / graphWidth
      const fz = normalPdf(z, 0, sigmaZ)
      ctx.lineTo(originX + px, originY - fz * scaleY)
    }
    ctx.lineTo(originX + graphWidth, originY)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    started = false
    const refMaxF = normalPdf(0, 0, 1)
    const refScaleY = (graphHeight * 0.8) / refMaxF
    for (let px = 0; px <= graphWidth; px++) {
      const z = -zRange + (2 * zRange * px) / graphWidth
      const fz = normalPdf(z, 0, 1)
      const drawX = originX + px
      const drawY = originY - fz * refScaleY
      if (drawY < originY - graphHeight) continue
      if (!started) { ctx.moveTo(drawX, drawY); started = true }
      else ctx.lineTo(drawX, drawY)
    }
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Z = ${a.toFixed(1)}X + ${b.toFixed(1)}Y ~ N(0, ${(sigmaZ * sigmaZ).toFixed(2)})`, originX + 10, originY - graphHeight + 20)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('N(0,1) 参考', originX + 10, originY - graphHeight + 40)

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('z', originX + graphWidth - 10, originY + 20)
    ctx.fillText('f(z)', originX - 35, originY - graphHeight + 10)

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('Z = aX + bY 的分布', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`a = ${a.toFixed(2)}, b = ${b.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`Z ~ N(0, a²+b² = ${(sigmaZ * sigmaZ).toFixed(2)}), σ_Z = ${sigmaZ.toFixed(2)}`, 200, canvasHeight + 30)
  }, [modelState.params])

  // ========== 第四章：数字特征 ==========

  // 8. 期望
  const drawExpectation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const p = getParam('p', 0.5)
    const n = Math.round(getParam('n', 10))
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2 - 20
    const originX = padding
    const originY = canvasHeight - padding

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = originX + (graphWidth / 10) * i
      ctx.beginPath(); ctx.moveTo(x, originY - graphHeight); ctx.lineTo(x, originY); ctx.stroke()
    }
    for (let i = 0; i <= 5; i++) {
      const y = originY - (graphHeight / 5) * i
      ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + graphWidth, y); ctx.stroke()
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY - graphHeight); ctx.stroke()

    const binom = (k: number) => {
      let logC = 0
      for (let i = 1; i <= k; i++) logC += Math.log(n - i + 1) - Math.log(i)
      return Math.exp(logC + k * Math.log(p) + (n - k) * Math.log(1 - p))
    }

    let maxProb = 0
    for (let k = 0; k <= n; k++) {
      const prob = binom(k)
      if (prob > maxProb) maxProb = prob
    }

    const barWidth = Math.min(30, graphWidth / (n + 2))
    const scaleX = graphWidth / (n + 1)
    const scaleY = (graphHeight * 0.85) / maxProb
    const EX = n * p

    for (let k = 0; k <= n; k++) {
      const prob = binom(k)
      const barX = originX + k * scaleX + (scaleX - barWidth) / 2
      const barH = prob * scaleY
      const intensity = prob / maxProb
      const r = Math.round(21 + (198 - 21) * (1 - intensity))
      const g = Math.round(101 + (40 - 101) * (1 - intensity))
      const b = Math.round(192 + (40 - 192) * (1 - intensity))
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(barX, originY - barH, barWidth, barH)
      ctx.strokeStyle = '#5D4037'
      ctx.lineWidth = 1
      ctx.strokeRect(barX, originY - barH, barWidth, barH)

      if (n <= 15 || k % Math.ceil(n / 10) === 0) {
        ctx.fillStyle = '#5D4037'
        ctx.font = '11px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.fillText(k.toString(), barX + barWidth / 2, originY + 15)
      }
    }

    const exPx = originX + EX * scaleX
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    ctx.moveTo(exPx, originY)
    ctx.lineTo(exPx, originY - graphHeight)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText(`E(X) = ${EX.toFixed(1)}`, exPx, originY - graphHeight - 5)

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('k', originX + graphWidth - 10, originY + 25)
    ctx.fillText('P(X=k)', originX - 40, originY - graphHeight + 10)

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('二项分布的期望', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`B(n=${n}, p=${p.toFixed(2)})`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`E(X) = np = ${EX.toFixed(2)}`, 180, canvasHeight + 30)
  }, [modelState.params])

  // 9. 方差
  const drawVariance = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const mu = getParam('mu', 0)
    const sigma = getParam('sigma', 1)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2 - 20
    const originX = padding
    const originY = canvasHeight - padding

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
      const x = originX + (graphWidth / 10) * (i + 5)
      ctx.beginPath(); ctx.moveTo(x, originY - graphHeight); ctx.lineTo(x, originY); ctx.stroke()
      const y = originY - (graphHeight / 10) * (i + 5)
      ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + graphWidth, y); ctx.stroke()
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY - graphHeight); ctx.stroke()

    const xRange = mu + 4 * sigma
    const xMin = mu - 4 * sigma
    const scaleX = graphWidth / (xRange - xMin)
    const toPixelX = (x: number) => originX + (x - xMin) * scaleX

    const normalPdf = (x: number, m: number, s: number) => {
      return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - m) ** 2) / (2 * s * s))
    }

    const maxF = normalPdf(mu, mu, sigma)
    const scaleY = (graphHeight * 0.85) / maxF

    const sigmas = [0.5, 1.0, 1.5, 2.0, sigma]
    const sigColors = ['#90A4AE', '#78909C', '#607D8B', '#546E7A', '#C62828']
    sigmas.forEach((s, idx) => {
      ctx.strokeStyle = sigColors[idx]
      ctx.lineWidth = idx === sigmas.length - 1 ? 3 : 1.5
      if (idx === sigmas.length - 1) ctx.setLineDash([])
      else ctx.setLineDash([4, 4])
      ctx.beginPath()
      let started = false
      for (let px = 0; px <= graphWidth; px++) {
        const x = xMin + (xRange - xMin) * px / graphWidth
        const fx = normalPdf(x, mu, s)
        const drawX = originX + px
        const drawY = originY - fx * scaleY
        if (!started) { ctx.moveTo(drawX, drawY); started = true }
        else ctx.lineTo(drawX, drawY)
      }
      ctx.stroke()
      ctx.setLineDash([])
    })

    ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    for (let px = 0; px <= graphWidth; px++) {
      const x = xMin + (xRange - xMin) * px / graphWidth
      const fx = normalPdf(x, mu, sigma)
      ctx.lineTo(originX + px, originY - fx * scaleY)
    }
    ctx.lineTo(originX + graphWidth, originY)
    ctx.closePath()
    ctx.fill()

    const exPx = toPixelX(mu)
    ctx.strokeStyle = '#C62828'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.beginPath(); ctx.moveTo(exPx, originY); ctx.lineTo(exPx, originY - graphHeight); ctx.stroke()
    ctx.setLineDash([])

    ctx.strokeStyle = '#1565C0'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    const s1Px = toPixelX(mu - sigma)
    const s2Px = toPixelX(mu + sigma)
    ctx.beginPath(); ctx.moveTo(s1Px, originY); ctx.lineTo(s1Px, originY - graphHeight); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(s2Px, originY); ctx.lineTo(s2Px, originY - graphHeight); ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = 'rgba(21, 101, 192, 0.1)'
    ctx.fillRect(s1Px, originY - graphHeight, s2Px - s1Px, graphHeight)

    ctx.fillStyle = '#C62828'
    ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText(`E(X) = ${mu.toFixed(1)}`, exPx, originY - graphHeight - 5)
    ctx.fillStyle = '#1565C0'
    ctx.fillText('μ-σ', s1Px, originY + 15)
    ctx.fillText('μ+σ', s2Px, originY + 15)

    ctx.fillStyle = '#3E2723'
    ctx.font = '12px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    sigmas.forEach((s, idx) => {
      ctx.fillStyle = sigColors[idx]
      ctx.fillText(`σ = ${s.toFixed(1)}`, originX + graphWidth - 80, originY - graphHeight + 15 + idx * 18)
    })

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('方差与分散程度', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`μ = ${mu.toFixed(2)}, σ = ${sigma.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'
    ctx.fillText(`D(X) = σ² = ${(sigma * sigma).toFixed(2)}`, 200, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`σ(X) = ${sigma.toFixed(2)}`, 380, canvasHeight + 30)
  }, [modelState.params])

  // 10. 协方差与相关系数
  const drawCovarianceCorrelation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rho = getParam('rho', 0.6)
    const n = Math.round(getParam('n', 100))
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const padding = 60
    const plotSize = Math.min(width - padding * 2, canvasHeight - padding * 2 - 20)
    const plotX = (width - plotSize) / 2
    const plotY = 45
    const range = 3

    const toPixelX = (x: number) => plotX + ((x + range) / (2 * range)) * plotSize
    const toPixelY = (y: number) => plotY + ((range - y) / (2 * range)) * plotSize

    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let v = -3; v <= 3; v++) {
      const px = toPixelX(v)
      const py = toPixelY(v)
      ctx.beginPath(); ctx.moveTo(px, plotY); ctx.lineTo(px, plotY + plotSize); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(plotX, py); ctx.lineTo(plotX + plotSize, py); ctx.stroke()
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(plotX, toPixelY(0)); ctx.lineTo(plotX + plotSize, toPixelY(0)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(toPixelX(0), plotY); ctx.lineTo(toPixelX(0), plotY + plotSize); ctx.stroke()

    const points: [number, number][] = []
    let seed = 42
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const u1 = rand()
      const u2 = rand()
      const z0 = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1))) * Math.cos(2 * Math.PI * u2)
      const z1 = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1))) * Math.sin(2 * Math.PI * u2)
      const x = z0
      const y = rho * z0 + Math.sqrt(1 - rho * rho) * z1
      points.push([x, y])
    }

    points.forEach(([x, y]) => {
      if (Math.abs(x) > range || Math.abs(y) > range) return
      const px = toPixelX(x)
      const py = toPixelY(y)
      ctx.fillStyle = 'rgba(21, 101, 192, 0.5)'
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0
    const N = points.length
    points.forEach(([x, y]) => { sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x; sumY2 += y * y })
    const sampleRho = (N * sumXY - sumX * sumY) / Math.sqrt(Math.max(1e-10, (N * sumX2 - sumX * sumX) * (N * sumY2 - sumY * sumY)))

    ctx.fillStyle = '#5D4037'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('X', plotX + plotSize + 15, toPixelY(0) + 4)
    ctx.fillText('Y', toPixelX(0), plotY - 10)

    ctx.fillStyle = rho > 0 ? '#558B2F' : rho < 0 ? '#C62828' : '#5D4037'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    const label = rho > 0.3 ? '正相关' : rho < -0.3 ? '负相关' : '弱相关/不相关'
    ctx.fillText(`ρ = ${rho.toFixed(2)} (${label})`, plotX + 10, plotY + plotSize + 20)

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('相关系数散点图', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`ρ = ${rho.toFixed(2)}, n = ${n}`, 20, canvasHeight + 30)
    ctx.fillText(`样本相关系数 r = ${sampleRho.toFixed(3)}`, 200, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`Cov(X,Y) = ρ = ${rho.toFixed(2)}`, 430, canvasHeight + 30)
  }, [modelState.params])

  // 11. 矩与协方差矩阵
  const drawMomentCovMatrix = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rho = getParam('rho', 0.5)
    const sigma_x = getParam('sigma_x', 1)
    const sigma_y = getParam('sigma_y', 1)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const covXX = sigma_x * sigma_x
    const covXY = rho * sigma_x * sigma_y
    const covYY = sigma_y * sigma_y
    const cov = covXY
    const maxVal = Math.max(covXX, covYY, Math.abs(cov))

    const matrixX = width * 0.1
    const matrixY = 80
    const cellSize = 80

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('协方差矩阵 Σ', matrixX + cellSize + 10, 55)

    const vals = [[covXX, cov], [cov, covYY]]

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const cx = matrixX + j * cellSize
        const cy = matrixY + i * cellSize
        const val = vals[i][j]
        const intensity = Math.abs(val) / maxVal

        const r = Math.round(244 - (244 - 21) * intensity)
        const g = Math.round(228 - (228 - 101) * intensity)
        const b = Math.round(188 - (188 - 192) * intensity)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(cx, cy, cellSize, cellSize)
        ctx.strokeStyle = '#5D4037'
        ctx.lineWidth = 2
        ctx.strokeRect(cx, cy, cellSize, cellSize)

        ctx.fillStyle = intensity > 0.5 ? '#FFFFFF' : '#3E2723'
        ctx.font = 'bold 14px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.fillText(val.toFixed(2), cx + cellSize / 2, cy + cellSize / 2 + 5)
      }
    }

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(matrixX - 10, matrixY - 5)
    ctx.lineTo(matrixX - 18, matrixY - 5)
    ctx.lineTo(matrixX - 18, matrixY + cellSize * 2 + 5)
    ctx.lineTo(matrixX - 10, matrixY + cellSize * 2 + 5)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(matrixX + cellSize * 2 + 10, matrixY - 5)
    ctx.lineTo(matrixX + cellSize * 2 + 18, matrixY - 5)
    ctx.lineTo(matrixX + cellSize * 2 + 18, matrixY + cellSize * 2 + 5)
    ctx.lineTo(matrixX + cellSize * 2 + 10, matrixY + cellSize * 2 + 5)
    ctx.stroke()

    const infoX = matrixX + cellSize * 2 + 60
    const det = covXX * covYY - cov * cov
    const trace = covXX + covYY
    const eigen1 = (trace + Math.sqrt(Math.max(0, trace * trace - 4 * det))) / 2
    const eigen2 = (trace - Math.sqrt(Math.max(0, trace * trace - 4 * det))) / 2

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 14px "Noto Serif SC", serif'
    ctx.textAlign = 'left'
    ctx.fillText('矩阵性质', infoX, 70)
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`det(Σ) = ${det.toFixed(3)}`, infoX, 95)
    ctx.fillText(`tr(Σ) = ${trace.toFixed(3)}`, infoX, 115)
    ctx.fillText(`λ₁ = ${eigen1.toFixed(3)}`, infoX, 135)
    ctx.fillText(`λ₂ = ${eigen2.toFixed(3)}`, infoX, 155)
    ctx.fillStyle = det > 0 ? '#558B2F' : '#C62828'
    ctx.fillText(det > 0 ? '正定矩阵 ✓' : '非正定 ✗', infoX, 180)

    const barX = infoX
    const barY = 200
    const barW = 200
    const barH = 20
    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText('元素大小热力图', barX, barY)
    const gradient = ctx.createLinearGradient(barX, 0, barX + barW, 0)
    gradient.addColorStop(0, 'rgb(244,228,188)')
    gradient.addColorStop(1, 'rgb(21,101,192)')
    ctx.fillStyle = gradient
    ctx.fillRect(barX, barY + 10, barW, barH)
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY + 10, barW, barH)
    ctx.fillStyle = '#5D4037'
    ctx.font = '11px "Noto Serif SC", serif'
    ctx.fillText('0', barX, barY + barH + 25)
    ctx.textAlign = 'right'
    ctx.fillText(maxVal.toFixed(2), barX + barW, barY + barH + 25)
    ctx.textAlign = 'left'

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('协方差矩阵', width / 2, 25)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`ρ=${rho.toFixed(2)} σ_x=${sigma_x.toFixed(2)} σ_y=${sigma_y.toFixed(2)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'
    ctx.fillText(`|Σ| = ${(1 - rho * rho) * sigma_x * sigma_x * sigma_y * sigma_y > 0 ? '正定' : '非正定'}`, 350, canvasHeight + 30)
  }, [modelState.params])

  // 12. 常见分布数字特征汇总
  const drawDistributionFeaturesSummary = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dist_type = Math.round(getParam('dist_type', 0))
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight

    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)

    const dists = [
      { name: '二项分布 B(n,p)', params: 'n≥1, 0<p<1', ex: 'np', dx: 'np(1-p)' },
      { name: '泊松分布 P(λ)', params: 'λ>0', ex: 'λ', dx: 'λ' },
      { name: '均匀分布 U(a,b)', params: 'a<b', ex: '(a+b)/2', dx: '(b-a)²/12' },
      { name: '指数分布 Exp(λ)', params: 'λ>0', ex: '1/λ', dx: '1/λ²' },
      { name: '正态分布 N(μ,σ²)', params: 'μ∈R, σ>0', ex: 'μ', dx: 'σ²' },
    ]

    const startX = 40
    const startY = 50
    const colWidths = [180, 120, 100, 100]
    const rowHeight = 45
    const headerHeight = 40
    const totalW = colWidths.reduce((a, b) => a + b, 0)
    const headers = ['分布', '参数', 'E(X)', 'D(X)']

    ctx.fillStyle = 'rgba(93, 64, 55, 0.15)'
    ctx.fillRect(startX, startY, totalW, headerHeight)
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, totalW, headerHeight)
    let cx = startX
    headers.forEach((h, idx) => {
      ctx.fillStyle = '#3E2723'
      ctx.font = 'bold 14px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.fillText(h, cx + colWidths[idx] / 2, startY + headerHeight / 2 + 5)
      cx += colWidths[idx]
    })

    dists.forEach((dist, row) => {
      const ry = startY + headerHeight + row * rowHeight
      const isSelected = row === dist_type

      if (isSelected) {
        ctx.fillStyle = 'rgba(21, 101, 192, 0.15)'
        ctx.fillRect(startX, ry, totalW, rowHeight)
      }

      ctx.strokeStyle = '#C4A77D'
      ctx.lineWidth = 1
      ctx.strokeRect(startX, ry, totalW, rowHeight)

      cx = startX
      const cells = [dist.name, dist.params, dist.ex, dist.dx]
      cells.forEach((cell, idx) => {
        ctx.fillStyle = isSelected ? '#1565C0' : '#3E2723'
        ctx.font = isSelected ? 'bold 13px "Noto Serif SC", serif' : '13px "Noto Serif SC", serif'
        ctx.textAlign = 'center'
        ctx.fillText(cell, cx + colWidths[idx] / 2, ry + rowHeight / 2 + 5)
        cx += colWidths[idx]
      })

      if (isSelected) {
        ctx.fillStyle = '#1565C0'
        ctx.beginPath()
        ctx.arc(startX - 12, ry + rowHeight / 2, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.strokeRect(startX, startY, totalW, headerHeight + dists.length * rowHeight)

    const graphX = startX + totalW + 40
    const graphY = startY
    const graphW = width - graphX - 30
    const graphH = headerHeight + dists.length * rowHeight

    if (graphW > 100) {
      ctx.strokeStyle = '#5D4037'
      ctx.lineWidth = 2
      ctx.strokeRect(graphX, graphY, graphW, graphH)

      const padG = 10
      const drawAreaW = graphW - padG * 2
      const drawAreaH = graphH - padG * 2 - 20

      if (dist_type === 0) {
        const bn = 10, bp = 0.5
        let maxP = 0
        const binom = (k: number) => {
          let logC = 0
          for (let i = 1; i <= k; i++) logC += Math.log(bn - i + 1) - Math.log(i)
          return Math.exp(logC + k * Math.log(bp) + (bn - k) * Math.log(1 - bp))
        }
        for (let k = 0; k <= bn; k++) { const p = binom(k); if (p > maxP) maxP = p }
        const barW = drawAreaW / (bn + 1) * 0.8
        const scaleX = drawAreaW / (bn + 1)
        const scaleY = drawAreaH / maxP
        for (let k = 0; k <= bn; k++) {
          const prob = binom(k)
          ctx.fillStyle = 'rgba(198, 40, 40, 0.6)'
          ctx.fillRect(graphX + padG + k * scaleX, graphY + padG + 20 + drawAreaH - prob * scaleY, barW, prob * scaleY)
        }
      } else if (dist_type === 1) {
        const lambda = 3
        const maxK = 15
        const poisVals: number[] = []
        let maxP = 0
        for (let k = 0; k <= maxK; k++) {
          let logFact = 0
          for (let i = 1; i <= k; i++) logFact += Math.log(i)
          const p = Math.exp(k * Math.log(lambda) - lambda - logFact)
          poisVals.push(p)
          if (p > maxP) maxP = p
        }
        const scaleX = drawAreaW / (maxK + 1)
        const barW = scaleX * 0.8
        const scaleY = drawAreaH / maxP
        for (let k = 0; k <= maxK; k++) {
          ctx.fillStyle = 'rgba(198, 40, 40, 0.6)'
          ctx.fillRect(graphX + padG + k * scaleX, graphY + padG + 20 + drawAreaH - poisVals[k] * scaleY, barW, poisVals[k] * scaleY)
        }
      } else if (dist_type === 2) {
        const scaleY = drawAreaH / 1.2
        ctx.fillStyle = 'rgba(198, 40, 40, 0.6)'
        ctx.fillRect(graphX + padG, graphY + padG + 20 + drawAreaH - 1 * scaleY, drawAreaW, 1 * scaleY)
      } else if (dist_type === 3) {
        const scaleY = drawAreaH / 1.1
        ctx.strokeStyle = '#C62828'
        ctx.lineWidth = 2
        ctx.beginPath()
        let s = false
        for (let px = 0; px <= drawAreaW; px++) {
          const x = 5 * px / drawAreaW
          const fx = Math.exp(-x)
          const drawX = graphX + padG + px
          const drawY = graphY + padG + 20 + drawAreaH - fx * scaleY
          if (!s) { ctx.moveTo(drawX, drawY); s = true }
          else ctx.lineTo(drawX, drawY)
        }
        ctx.stroke()
      } else if (dist_type === 4) {
        const scaleY = drawAreaH / 0.45
        ctx.strokeStyle = '#C62828'
        ctx.lineWidth = 2
        ctx.beginPath()
        let s = false
        for (let px = 0; px <= drawAreaW; px++) {
          const x = -4 + 8 * px / drawAreaW
          const fx = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-x * x / 2)
          const drawX = graphX + padG + px
          const drawY = graphY + padG + 20 + drawAreaH - fx * scaleY
          if (!s) { ctx.moveTo(drawX, drawY); s = true }
          else ctx.lineTo(drawX, drawY)
        }
        ctx.stroke()
      }

      ctx.fillStyle = '#3E2723'
      ctx.font = 'bold 12px "Noto Serif SC", serif'
      ctx.textAlign = 'center'
      ctx.fillText(dists[dist_type].name + ' PDF', graphX + graphW / 2, graphY + 15)
    }

    ctx.fillStyle = '#3E2723'
    ctx.font = 'bold 15px "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('常见分布的数字特征', width / 2, 30)

    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'
    ctx.fillRect(0, canvasHeight, width, infoBarHeight)
    ctx.strokeStyle = '#C4A77D'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight)
    ctx.lineTo(width, canvasHeight)
    ctx.stroke()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5D4037'
    ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText(`当前: ${dists[dist_type].name}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'
    ctx.fillText(`E(X) = ${dists[dist_type].ex}, D(X) = ${dists[dist_type].dx}`, 220, canvasHeight + 30)
  }, [modelState.params])

  // ==================== 第五章：大数定律与中心极限定理 ====================

  const drawChebyshevInequality = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const k = getParam('k', 2)
    ctx.fillStyle = '#F4E4BC'
    ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50
    const canvasHeight = height - infoBarHeight
    const padding = 50
    const graphWidth = width - padding * 2
    const graphHeight = canvasHeight - padding * 2
    const originX = padding
    const originY = canvasHeight - padding
    const normalPDF = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)
    const maxPDF = normalPDF(0)
    const scaleX = graphWidth / 8
    const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 16; i++) { const x = originX + (graphWidth / 16) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(padding, originY); ctx.lineTo(width - padding, originY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth / 2, canvasHeight - padding); ctx.lineTo(originX + graphWidth / 2, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(width - padding, originY); ctx.lineTo(width - padding - 10, originY - 5); ctx.lineTo(width - padding - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth / 2, padding); ctx.lineTo(originX + graphWidth / 2 - 5, padding + 10); ctx.lineTo(originX + graphWidth / 2 + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'
    ctx.fillText('x', width - padding + 5, originY + 5); ctx.fillText('f(x)', originX + graphWidth / 2 + 8, padding + 15)
    const centerX = originX + graphWidth / 2
    for (let i = -4; i <= 4; i++) { const px = centerX + i * scaleX; ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(`${i}`, px - 5, originY + 18) }
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = (px - graphWidth / 2) / scaleX; const y = normalPDF(x); const canvasX = originX + px; const canvasY = originY - y * scaleY; if (px === 0) ctx.moveTo(canvasX, canvasY); else ctx.lineTo(canvasX, canvasY) }
    ctx.stroke()
    ctx.fillStyle = 'rgba(198, 40, 40, 0.15)'; ctx.beginPath()
    let startedLeft = false
    for (let px = 0; px <= graphWidth; px++) { const x = (px - graphWidth / 2) / scaleX; if (x < -k) { const y = normalPDF(x); if (!startedLeft) { ctx.moveTo(originX + px, originY); startedLeft = true } ctx.lineTo(originX + px, originY - y * scaleY) } }
    ctx.lineTo(centerX - k * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); let startedRight = false
    for (let px = 0; px <= graphWidth; px++) { const x = (px - graphWidth / 2) / scaleX; if (x > k) { const y = normalPDF(x); if (!startedRight) { ctx.moveTo(originX + px, originY); startedRight = true } ctx.lineTo(originX + px, originY - y * scaleY) } }
    ctx.lineTo(originX + graphWidth, originY); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4])
    ctx.beginPath(); ctx.moveTo(centerX - k * scaleX, originY); ctx.lineTo(centerX - k * scaleX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(centerX + k * scaleX, originY); ctx.lineTo(centerX + k * scaleX, padding); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`μ-${k}σ`, centerX - k * scaleX - 20, originY + 30); ctx.fillText(`μ+${k}σ`, centerX + k * scaleX - 20, originY + 30)
    const chebyshevBound = 1 / (k * k)
    const normalCDF = (t: number) => { const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429; const p = 0.3275911; const sign = t < 0 ? -1 : 1; const ax = Math.abs(t) / Math.sqrt(2); const t2 = 1 / (1 + p * ax); const y = 1 - (((((a5 * t2 + a4) * t2) + a3) * t2 + a2) * t2 + a1) * t2 * Math.exp(-ax * ax); return 0.5 * (1 + sign * y) }
    const actualProb = 1 - (normalCDF(k) - normalCDF(-k))
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'
    ctx.fillText(`切比雪夫: P(|X-μ|≥${k}σ) ≤ 1/k² = ${chebyshevBound.toFixed(4)}`, originX, padding - 5)
    ctx.fillStyle = '#1565C0'; ctx.fillText(`正态实际: ${actualProb.toFixed(4)}`, originX + 280, padding - 5)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`k = ${k.toFixed(1)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'; ctx.fillText(`切比雪夫: ≤ ${chebyshevBound.toFixed(4)}`, 120, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'; ctx.fillText(`实际值: ${actualProb.toFixed(4)}`, 300, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'; ctx.fillText(`差距: ${(chebyshevBound - actualProb).toFixed(4)}`, 460, canvasHeight + 30)
  }, [modelState.params])

  const drawLawLargeNumbers = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 100))
    const p = getParam('p', 0.5)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50
    const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const scaleX = graphWidth / n; const scaleY = graphHeight / 1.2
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 6; i++) { const y = originY - (graphHeight / 6) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX, padding); ctx.lineTo(originX - 5, padding + 10); ctx.lineTo(originX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('n', originX + graphWidth - 10, originY + 25); ctx.fillText('X̄ₙ', originX - 35, padding + 5)
    for (let v = 0; v <= 1; v += 0.2) { ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(v.toFixed(1), originX - 35, originY - v * scaleY + 4) }
    const pLineY = originY - p * scaleY
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(originX, pLineY); ctx.lineTo(originX + graphWidth, pLineY); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`p = ${p.toFixed(2)}`, originX + graphWidth - 70, pLineY - 10)
    let rng = 42; const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff }
    let sum = 0; const freqs: number[] = []
    for (let i = 1; i <= n; i++) { sum += rand() < p ? 1 : 0; freqs.push(sum / i) }
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2; ctx.beginPath()
    for (let i = 0; i < freqs.length; i++) { const px = originX + (i + 1) * scaleX; const py = originY - freqs[i] * scaleY; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py) }
    ctx.stroke()
    const lastFreq = freqs[freqs.length - 1]; const lastPx = originX + n * scaleX; const lastPy = originY - lastFreq * scaleY
    ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(lastPx, lastPy, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`(${n}, ${lastFreq.toFixed(4)})`, lastPx - 80, lastPy - 12)
    ctx.fillStyle = 'rgba(21, 101, 192, 0.1)'; ctx.fillRect(originX, pLineY - 0.05 * scaleY, graphWidth, 0.1 * scaleY)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`大数定律: X̄ₙ → p (n→∞)`, originX, padding - 10)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#C62828'; ctx.fillText(`p = ${p.toFixed(2)}`, 120, canvasHeight + 30); ctx.fillStyle = '#1565C0'; ctx.fillText(`频率 = ${lastFreq.toFixed(4)}`, 230, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'; ctx.fillText(`偏差 = ${Math.abs(lastFreq - p).toFixed(4)}`, 420, canvasHeight + 30)
  }, [modelState.params])

  const drawCentralLimitTheorem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 30)); const distType = Math.floor(getParam('dist_type', 0))
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50
    const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const xMin = -4, xMax = 4; const scaleX = graphWidth / (xMax - xMin)
    const normalPDF = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); const maxPDF = normalPDF(0); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke()
    const yAxisX = originX + (-xMin) * scaleX; ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX, canvasHeight - padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX - 5, padding + 10); ctx.lineTo(yAxisX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('z', originX + graphWidth + 5, originY + 5)
    for (let v = -4; v <= 4; v++) { ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(`${v}`, originX + (v - xMin) * scaleX - 5, originY + 18) }
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = normalPDF(x); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    let rng = 42; const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff }
    const numSim = 5000; const binCount = 60; const bins = new Array(binCount).fill(0); const binWidth = (xMax - xMin) / binCount
    let mu = 0, sigma2 = 1
    if (distType === 0) { mu = 0.5; sigma2 = 1 / 12 } else if (distType === 1) { mu = 1; sigma2 = 1 } else { mu = 0.5; sigma2 = 0.25 }
    for (let s = 0; s < numSim; s++) { let sumX = 0; for (let i = 0; i < n; i++) { if (distType === 0) sumX += rand(); else if (distType === 1) sumX += -Math.log(1 - rand() + 1e-10); else sumX += (rand() < 0.5 ? 1 : 0) } const z = (sumX - n * mu) / (Math.sqrt(n * sigma2)); const binIdx = Math.floor((z - xMin) / binWidth); if (binIdx >= 0 && binIdx < binCount) bins[binIdx]++ }
    ctx.fillStyle = 'rgba(21, 101, 192, 0.35)'; ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 1
    for (let i = 0; i < binCount; i++) { if (bins[i] > 0) { const normalizedH = bins[i] / (numSim * binWidth); const px = originX + i * binWidth * scaleX; const barW = binWidth * scaleX; const barH = normalizedH * scaleY; ctx.fillRect(px, originY - barH, barW, barH); ctx.strokeRect(px, originY - barH, barW, barH) } }
    const distNames = ['均匀分布 U(0,1)', '指数分布 Exp(1)', '伯努利分布 B(1,0.5)']
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`中心极限定理: (ΣXᵢ-nμ)/√(nσ²) → N(0,1)`, originX, padding - 20)
    ctx.fillStyle = '#1565C0'; ctx.fillText(`原始分布: ${distNames[distType]}`, originX, padding - 5); ctx.fillStyle = '#C62828'; ctx.fillText(`N(0,1) 标准正态`, originX + 250, padding - 5)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30); ctx.fillStyle = '#1565C0'; ctx.fillText(`原始分布: ${distNames[distType]}`, 100, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText('红色: N(0,1)', 330, canvasHeight + 30)
  }, [modelState.params])

  // ==================== 第六章：数理统计基本概念 ====================

  const drawPopulationSample = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const mu = getParam('mu', 0); const sigma = getParam('sigma', 1); const sampleSize = Math.floor(getParam('sample_size', 20))
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50
    const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const normalPDF = (x: number) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI)); const maxPDF = normalPDF(mu)
    const xMin = mu - 4 * sigma, xMax = mu + 4 * sigma; const scaleX = graphWidth / (xMax - xMin); const scaleY = graphHeight / (maxPDF * 1.4)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX, padding); ctx.lineTo(originX - 5, padding + 10); ctx.lineTo(originX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('x', originX + graphWidth + 5, originY + 5); ctx.fillText('f(x)', originX - 35, padding + 5)
    for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v++) { ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(`${v}`, originX + (v - xMin) * scaleX - 5, originY + 18) }
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = normalPDF(x); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    let rng = 42; const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff }
    const boxMuller = () => { const u1 = rand(), u2 = rand(); return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2) }
    let sampleSum = 0
    for (let i = 0; i < sampleSize; i++) { const x = mu + sigma * boxMuller(); sampleSum += x; const px = originX + (x - xMin) * scaleX; ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(px, originY - 5 + (rand() - 0.5) * 15, 4, 0, Math.PI * 2); ctx.fill() }
    const sampleMean = sampleSum / sampleSize; const meanPx = originX + (sampleMean - xMin) * scaleX
    ctx.strokeStyle = '#558B2F'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath(); ctx.moveTo(meanPx, originY); ctx.lineTo(meanPx, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#558B2F'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`X̄ = ${sampleMean.toFixed(3)}`, meanPx + 5, padding + 20)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`总体 N(${mu.toFixed(1)}, ${sigma.toFixed(1)}²) 与样本`, originX, padding - 10)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`μ = ${mu.toFixed(1)}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`σ = ${sigma.toFixed(1)}`, 120, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'; ctx.fillText(`样本量 = ${sampleSize}`, 230, canvasHeight + 30); ctx.fillText(`X̄ = ${sampleMean.toFixed(3)}`, 370, canvasHeight + 30)
  }, [modelState.params])

  const drawSamplingDistributions = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 20))
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50
    const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const gamma = (x: number): number => { if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x)); let r = 1, y = x; while (y > 1.5) { y -= 1; r *= y } if (Math.abs(y - 1) < 1e-10) return r; if (Math.abs(y - 0.5) < 1e-10) return r * Math.sqrt(Math.PI); const g = 7; const coef = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; y -= 1; let s = coef[0]; for (let i = 1; i < g + 2; i++) s += coef[i] / (y + i); const t = y + g + 0.5; return r * Math.sqrt(2 * Math.PI) * Math.pow(t, y + 0.5) * Math.exp(-t) * s }
    const chi2PDF = (x: number, df: number) => { if (x <= 0) return 0; const halfDf = df / 2; return Math.pow(x, halfDf - 1) * Math.exp(-x / 2) / (Math.pow(2, halfDf) * gamma(halfDf)) }
    const xMax = Math.max(n + 4 * Math.sqrt(2 * n), 10); const scaleX = graphWidth / xMax
    let maxPDF = 0; for (let x = 0.01; x < xMax; x += 0.1) maxPDF = Math.max(maxPDF, chi2PDF(x, n)); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX, padding); ctx.lineTo(originX - 5, padding + 10); ctx.lineTo(originX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('x', originX + graphWidth + 5, originY + 5); ctx.fillText('f(x)', originX - 35, padding + 5)
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath(); let started = false
    for (let px = 0; px <= graphWidth; px++) { const x = px / scaleX; const y = chi2PDF(x, n); if (y > 0.0001) { if (!started) { ctx.moveTo(originX + px, originY - y * scaleY); started = true } else ctx.lineTo(originX + px, originY - y * scaleY) } }
    ctx.stroke()
    const eX = originX + n * scaleX; ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(eX, originY); ctx.lineTo(eX, originY - chi2PDF(n, n) * scaleY - 10); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`E = ${n}`, eX - 15, originY + 30); ctx.fillText(`D = ${2 * n}`, eX + 25, originY + 30)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`χ²(${n}) 分布`, originX, padding - 10)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`自由度 n = ${n}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`E(X) = ${n}`, 170, canvasHeight + 30); ctx.fillText(`D(X) = ${2 * n}`, 280, canvasHeight + 30)
  }, [modelState.params])

  const drawNormalSamplingTheorem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 20)); const sigma = getParam('sigma', 1)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2
    const mu = 0; const normalPDF = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI))
    const subWidth = graphWidth / 3 - 10; const subHeight = canvasHeight - padding * 2
    const drawSubPlot = (startX: number, title: string, drawContent: (c: CanvasRenderingContext2D, ox: number, oy: number, gw: number, gh: number) => void) => {
      const ox = startX; const oy = canvasHeight - padding; const gw = subWidth; const gh = subHeight
      ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) { const x = ox + (gw / 5) * i; ctx.beginPath(); ctx.moveTo(x, oy - gh); ctx.lineTo(x, oy); ctx.stroke() }
      for (let i = 0; i <= 5; i++) { const y = oy - (gh / 5) * i; ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + gw, y); ctx.stroke() }
      ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ox + gw / 2, oy); ctx.lineTo(ox + gw / 2, oy - gh); ctx.stroke()
      ctx.fillStyle = '#3E2723'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText(title, ox + 5, oy - gh - 5); drawContent(ctx, ox, oy, gw, gh)
    }
    drawSubPlot(padding, `X̄ ~ N(μ, σ²/n)`, (c, ox, oy, gw, gh) => {
      const sigXbar = sigma / Math.sqrt(n); const maxP = normalPDF(mu, mu, sigXbar); const sY = gh / (maxP * 1.3); const xRange = 4 * sigXbar; const sX = gw / (2 * xRange)
      c.strokeStyle = '#1565C0'; c.lineWidth = 2; c.beginPath()
      for (let px = 0; px <= gw; px++) { const x = -xRange + px / sX; const y = normalPDF(x, mu, sigXbar); if (px === 0) c.moveTo(ox + px, oy - y * sY); else c.lineTo(ox + px, oy - y * sY) }
      c.stroke(); c.fillStyle = '#1565C0'; c.font = '11px "Noto Serif SC", serif'; c.fillText(`σ/√n = ${sigXbar.toFixed(3)}`, ox + 5, oy - 15)
    })
    drawSubPlot(padding + subWidth + 20, `(n-1)S²/σ² ~ χ²(${n - 1})`, (c, ox, oy, gw, gh) => {
      const df = n - 1; const gamma = (x: number): number => { if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x)); let r = 1, y = x; while (y > 1.5) { y -= 1; r *= y } if (Math.abs(y - 1) < 1e-10) return r; if (Math.abs(y - 0.5) < 1e-10) return r * Math.sqrt(Math.PI); const g = 7; const coef = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; y -= 1; let s = coef[0]; for (let i = 1; i < g + 2; i++) s += coef[i] / (y + i); const t = y + g + 0.5; return r * Math.sqrt(2 * Math.PI) * Math.pow(t, y + 0.5) * Math.exp(-t) * s }
      const chi2PDF = (x: number) => { if (x <= 0) return 0; const halfDf = df / 2; return Math.pow(x, halfDf - 1) * Math.exp(-x / 2) / (Math.pow(2, halfDf) * gamma(halfDf)) }
      const xM = df + 3 * Math.sqrt(2 * df); const sX = gw / xM; let maxP = 0; for (let x = 0.01; x < xM; x += 0.1) maxP = Math.max(maxP, chi2PDF(x)); const sY = gh / (maxP * 1.3)
      c.strokeStyle = '#2E7D32'; c.lineWidth = 2; c.beginPath(); let st = false
      for (let px = 0; px <= gw; px++) { const x = px / sX; const y = chi2PDF(x); if (y > 0.0001) { if (!st) { c.moveTo(ox + px, oy - y * sY); st = true } else c.lineTo(ox + px, oy - y * sY) } }
      c.stroke(); c.fillStyle = '#2E7D32'; c.font = '11px "Noto Serif SC", serif'; c.fillText(`df = ${df}`, ox + 5, oy - 15)
    })
    drawSubPlot(padding + (subWidth + 20) * 2, `X̄ 与 S² 独立`, (c, ox, oy, gw, gh) => {
      let rng2 = 42; const rand2 = () => { rng2 = (rng2 * 1103515245 + 12345) & 0x7fffffff; return rng2 / 0x7fffffff }
      const bm = () => { const u1 = rand2(), u2 = rand2(); return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2) }
      const sigXbar = sigma / Math.sqrt(n); const centerX = ox + gw / 2; const centerY = oy - gh / 2
      for (let i = 0; i < 200; i++) { const xbar = mu + sigXbar * bm(); let chi2Val = 0; for (let j = 0; j < n - 1; j++) { const z = bm(); chi2Val += z * z } const s2 = chi2Val * sigma * sigma / (n - 1); const px = centerX + (xbar - mu) / (3 * sigXbar) * (gw / 2); const py = centerY - (s2 - sigma * sigma) / (3 * sigma * sigma) * (gh / 2); if (px > ox && px < ox + gw && py > oy - gh && py < oy) { c.fillStyle = 'rgba(106, 27, 154, 0.4)'; c.beginPath(); c.arc(px, py, 2.5, 0, Math.PI * 2); c.fill() } }
      c.fillStyle = '#6A1B9A'; c.font = '11px "Noto Serif SC", serif'; c.fillText('散点无相关性', ox + 5, oy - 15); c.fillText('→ 相互独立', ox + 5, oy - 3)
    })
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}, σ = ${sigma.toFixed(1)}`, 20, canvasHeight + 30)
    ctx.fillStyle = '#1565C0'; ctx.fillText(`X̄~N(μ,σ²/n)`, 180, canvasHeight + 30); ctx.fillStyle = '#2E7D32'; ctx.fillText(`(n-1)S²/σ²~χ²(${n - 1})`, 320, canvasHeight + 30); ctx.fillStyle = '#6A1B9A'; ctx.fillText('X̄⊥S²', 500, canvasHeight + 30)
  }, [modelState.params])

  const drawOrderStatistics = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 5)); const k = Math.min(Math.floor(getParam('k', 1)), n)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const originX = padding
    let rng = 42; const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff }
    const samples: number[] = []; for (let i = 0; i < n; i++) samples.push(rand()); samples.sort((a, b) => a - b)
    const xMin = -0.1, xMax = 1.1; const scaleX = graphWidth / (xMax - xMin)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    const axisY = canvasHeight / 2; ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, axisY); ctx.lineTo(originX + graphWidth, axisY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, axisY); ctx.lineTo(originX + graphWidth - 10, axisY - 5); ctx.lineTo(originX + graphWidth - 10, axisY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    for (let v = 0; v <= 1; v += 0.1) { const px = originX + (v - xMin) * scaleX; ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, axisY - 5); ctx.lineTo(px, axisY + 5); ctx.stroke(); if (v === 0 || v === 0.5 || v === 1) { ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(v.toFixed(1), px - 10, axisY + 25) } }
    for (let i = 0; i < n; i++) { const px = originX + (samples[i] - xMin) * scaleX; const isKth = (i === k - 1); ctx.fillStyle = isKth ? '#C62828' : '#1565C0'; ctx.beginPath(); ctx.arc(px, axisY, isKth ? 8 : 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = isKth ? '#C62828' : '#5D4037'; ctx.font = isKth ? 'bold 12px "Noto Serif SC", serif' : '11px "Noto Serif SC", serif'; ctx.fillText(`X₍${i + 1}₎`, px - 10, axisY - (isKth ? 20 : 15)); ctx.fillText(`${samples[i].toFixed(3)}`, px - 15, axisY + (isKth ? 35 : 30)) }
    const kthPx = originX + (samples[k - 1] - xMin) * scaleX; ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath(); ctx.moveTo(kthPx, axisY - 40); ctx.lineTo(kthPx, axisY + 40); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`顺序统计量: X₍₁₎ ≤ X₍₂₎ ≤ ... ≤ X₍${n}₎`, originX, padding)
    ctx.fillStyle = '#C62828'; ctx.fillText(`第${k}个顺序统计量 X₍${k}₎ = ${samples[k - 1].toFixed(3)}`, originX, padding + 20)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`k = ${k}`, 100, canvasHeight + 30); ctx.fillText(`X₍${k}₎ = ${samples[k - 1].toFixed(3)}`, 180, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'; ctx.fillText(`E[X₍${k}₎] = k/(n+1) = ${(k / (n + 1)).toFixed(3)}`, 350, canvasHeight + 30)
  }, [modelState.params])

  // ==================== 第七章：参数估计 ====================

  const drawMomentEstimation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 20)); ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const theta = 2; const xMin = -0.3, xMax = 3; const scaleX = graphWidth / (xMax - xMin); const maxPDF = 1 / theta; const scaleY = graphHeight / (maxPDF * 2)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 6; i++) { const y = originY - (graphHeight / 6) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX, padding); ctx.lineTo(originX - 5, padding + 10); ctx.lineTo(originX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('x', originX + graphWidth + 5, originY + 5); ctx.fillText('f(x)', originX - 35, padding + 5)
    for (let v = 0; v <= 3; v++) { ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(`${v}`, originX + (v - xMin) * scaleX - 5, originY + 18) }
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5
    const uStartPx = originX + (0 - xMin) * scaleX; const uEndPx = originX + (theta - xMin) * scaleX
    ctx.beginPath(); ctx.moveTo(uStartPx, originY - maxPDF * scaleY); ctx.lineTo(uEndPx, originY - maxPDF * scaleY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(uStartPx, originY); ctx.lineTo(uStartPx, originY - maxPDF * scaleY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(uEndPx, originY); ctx.lineTo(uEndPx, originY - maxPDF * scaleY); ctx.stroke()
    let rng = 42; const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff }
    let sampleSum = 0
    for (let i = 0; i < n; i++) { const x = theta * rand(); sampleSum += x; const px = originX + (x - xMin) * scaleX; ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(px, originY - 5 + (rand() - 0.5) * 10, 3, 0, Math.PI * 2); ctx.fill() }
    const sampleMean = sampleSum / n; const thetaHat = 2 * sampleMean
    const meanPx = originX + (sampleMean - xMin) * scaleX; ctx.strokeStyle = '#558B2F'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath(); ctx.moveTo(meanPx, originY); ctx.lineTo(meanPx, originY - maxPDF * scaleY - 20); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#558B2F'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText(`X̄=${sampleMean.toFixed(3)}`, meanPx + 5, originY - maxPDF * scaleY - 25)
    const thetaHatPx = originX + (thetaHat - xMin) * scaleX; ctx.strokeStyle = '#6A1B9A'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath(); ctx.moveTo(thetaHatPx, originY); ctx.lineTo(thetaHatPx, originY - maxPDF * scaleY - 40); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#6A1B9A'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`θ̂=2X̄=${thetaHat.toFixed(3)}`, thetaHatPx + 5, originY - maxPDF * scaleY - 45)
    ctx.fillStyle = '#1565C0'; ctx.fillText(`θ=${theta}`, originX + (theta - xMin) * scaleX - 30, originY - maxPDF * scaleY + 20)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`矩估计: E[X]=θ/2 → 用X̄替换E[X] → θ̂=2X̄`, originX, padding - 5)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30); ctx.fillStyle = '#558B2F'; ctx.fillText(`X̄ = ${sampleMean.toFixed(3)}`, 100, canvasHeight + 30)
    ctx.fillStyle = '#6A1B9A'; ctx.fillText(`θ̂ = ${thetaHat.toFixed(3)}`, 240, canvasHeight + 30); ctx.fillStyle = '#1565C0'; ctx.fillText(`θ = ${theta}`, 380, canvasHeight + 30)
  }, [modelState.params])

  const drawMaximumLikelihood = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const theta = getParam('theta', 0.5); const n = Math.floor(getParam('n', 10))
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    let rng = 42; const rand = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return rng / 0x7fffffff }
    let sumX = 0; for (let i = 0; i < n; i++) { sumX += rand() < theta ? 1 : 0 }
    const likelihood = (t: number) => { if (t <= 0 || t >= 1) return 0; return Math.pow(t, sumX) * Math.pow(1 - t, n - sumX) }
    let maxL = 0; for (let t = 0.01; t < 1; t += 0.01) maxL = Math.max(maxL, likelihood(t)); const scaleY = graphHeight / (maxL * 1.2); const scaleX = graphWidth
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 6; i++) { const y = originY - (graphHeight / 6) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX, padding); ctx.lineTo(originX - 5, padding + 10); ctx.lineTo(originX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('θ', originX + graphWidth + 5, originY + 5); ctx.fillText('L(θ)', originX - 35, padding + 5)
    for (let v = 0; v <= 1; v += 0.2) { ctx.fillStyle = '#5D4037'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(v.toFixed(1), originX + v * scaleX - 10, originY + 18) }
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const t = px / scaleX; const y = likelihood(t); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    const mle = sumX / n; const mlePx = originX + mle * scaleX; const mlePy = originY - likelihood(mle) * scaleY
    ctx.fillStyle = '#C62828'; ctx.beginPath(); ctx.arc(mlePx, mlePy, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`MLE: θ̂ = X̄ = ${mle.toFixed(3)}`, mlePx + 10, mlePy - 10)
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath(); ctx.moveTo(mlePx, originY); ctx.lineTo(mlePx, mlePy); ctx.stroke(); ctx.setLineDash([])
    const trueThetaPx = originX + theta * scaleX; ctx.strokeStyle = '#558B2F'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(trueThetaPx, originY); ctx.lineTo(trueThetaPx, originY - likelihood(theta) * scaleY); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#558B2F'; ctx.font = '12px "Noto Serif SC", serif'; ctx.fillText(`θ=${theta.toFixed(2)}`, trueThetaPx + 5, originY + 18)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`极大似然估计: L(θ) = θ^${sumX}(1-θ)^${n - sumX}`, originX, padding - 10)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`Σxᵢ = ${sumX}`, 100, canvasHeight + 30); ctx.fillText(`θ̂ = ${mle.toFixed(3)}`, 220, canvasHeight + 30)
    ctx.fillStyle = '#558B2F'; ctx.fillText(`θ = ${theta.toFixed(2)}`, 350, canvasHeight + 30)
  }, [modelState.params])

  const drawEstimatorCriteria = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 20)); ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const mu = 0; const sigma1 = 1 / Math.sqrt(n); const sigma2 = 0.6 / Math.sqrt(n)
    const normalPDF = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI))
    const xRange = 4 * sigma1; const scaleX = graphWidth / (2 * xRange); const maxPDF = normalPDF(mu, mu, sigma2); const scaleY = graphHeight / (maxPDF * 1.2)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); const yAxisX = originX + graphWidth / 2; ctx.beginPath(); ctx.moveTo(yAxisX, originY); ctx.lineTo(yAxisX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + graphWidth, originY); ctx.lineTo(originX + graphWidth - 10, originY - 5); ctx.lineTo(originX + graphWidth - 10, originY + 5); ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX - 5, padding + 10); ctx.lineTo(yAxisX + 5, padding + 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText('θ̂', originX + graphWidth + 5, originY + 5)
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = -xRange + px / scaleX; const y = normalPDF(x, mu, sigma1); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    ctx.strokeStyle = '#2E7D32'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = -xRange + px / scaleX; const y = normalPDF(x, mu, sigma2); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 3]); ctx.beginPath(); ctx.moveTo(yAxisX, originY); ctx.lineTo(yAxisX, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText(`θ̂₁: σ = ${sigma1.toFixed(3)}`, originX, padding - 30)
    ctx.fillStyle = '#2E7D32'; ctx.fillText(`θ̂₂: σ = ${sigma2.toFixed(3)} (更有效)`, originX, padding - 12)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText('无偏性: E[θ̂] = θ', originX + 250, padding - 30); ctx.fillText('有效性: D[θ̂₂] < D[θ̂₁] → θ̂₂更有效', originX + 250, padding - 12)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`D[θ̂₁] = ${(sigma1 * sigma1).toFixed(4)}`, 100, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'; ctx.fillText(`D[θ̂₂] = ${(sigma2 * sigma2).toFixed(4)}`, 280, canvasHeight + 30); ctx.fillStyle = '#558B2F'; ctx.fillText('θ̂₂更有效', 440, canvasHeight + 30)
  }, [modelState.params])

  const drawIntervalEstimation = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const confidence = getParam('confidence', 0.95); const n = Math.floor(getParam('n', 25))
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const mu = 0, sigma = 1, sigmaXbar = sigma / Math.sqrt(n), alpha = 1 - confidence
    const normalPDF = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)
    const normalCDF = (x: number) => { const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429; const p = 0.3275911; const sign = x < 0 ? -1 : 1; const ax = Math.abs(x) / Math.sqrt(2); const t = 1 / (1 + p * ax); const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax); return 0.5 * (1 + sign * y) }
    const invNormalCDF = (p: number) => { let lo = -5, hi = 5; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (normalCDF(mid) < p) lo = mid; else hi = mid } return (lo + hi) / 2 }
    const zAlpha2 = -invNormalCDF(alpha / 2); const xMin = -4, xMax = 4; const scaleX = graphWidth / (xMax - xMin); const maxPDF = normalPDF(0); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); const yAxisX = originX + (-xMin) * scaleX; ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX, canvasHeight - padding); ctx.stroke()
    ctx.fillStyle = 'rgba(21, 101, 192, 0.2)'; ctx.beginPath(); ctx.moveTo(originX + (-zAlpha2 - xMin) * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x >= -zAlpha2 && x <= zAlpha2) ctx.lineTo(originX + px, originY - normalPDF(x) * scaleY) }
    ctx.lineTo(originX + (zAlpha2 - xMin) * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = normalPDF(x); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    const leftX = originX + (-zAlpha2 - xMin) * scaleX; const rightX = originX + (zAlpha2 - xMin) * scaleX
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(leftX, originY); ctx.lineTo(leftX, padding); ctx.stroke(); ctx.beginPath(); ctx.moveTo(rightX, originY); ctx.lineTo(rightX, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`-z_α/2 = ${(-zAlpha2).toFixed(3)}`, leftX - 50, padding + 20); ctx.fillText(`z_α/2 = ${zAlpha2.toFixed(3)}`, rightX - 20, padding + 20)
    const thetaL = mu - zAlpha2 * sigmaXbar; const thetaU = mu + zAlpha2 * sigmaXbar
    ctx.fillStyle = '#2E7D32'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`置信区间: [${thetaL.toFixed(3)}, ${thetaU.toFixed(3)}]`, originX, padding - 20); ctx.fillText(`置信水平: ${(confidence * 100).toFixed(1)}%`, originX, padding - 5)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`1-α = ${(confidence * 100).toFixed(1)}%`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`z_α/2 = ${zAlpha2.toFixed(3)}`, 150, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'; ctx.fillText(`[${thetaL.toFixed(3)}, ${thetaU.toFixed(3)}]`, 310, canvasHeight + 30)
  }, [modelState.params])

  // ==================== 第八章：假设检验 ====================

  const drawHypothesisTestingBasics = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const alpha = getParam('alpha', 0.05); const mu0 = getParam('mu0', 0)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const normalPDF = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)
    const normalCDF = (x: number) => { const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429; const p = 0.3275911; const sign = x < 0 ? -1 : 1; const ax = Math.abs(x) / Math.sqrt(2); const t = 1 / (1 + p * ax); const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax); return 0.5 * (1 + sign * y) }
    const invNormalCDF = (p: number) => { let lo = -5, hi = 5; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (normalCDF(mid) < p) lo = mid; else hi = mid } return (lo + hi) / 2 }
    const zAlpha2 = -invNormalCDF(alpha / 2); const xMin = mu0 - 4, xMax = mu0 + 4; const scaleX = graphWidth / (xMax - xMin); const maxPDF = normalPDF(0); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); const yAxisX = originX + (mu0 - xMin) * scaleX; ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX, canvasHeight - padding); ctx.stroke()
    const acceptLeft = mu0 - zAlpha2; const acceptRight = mu0 + zAlpha2
    ctx.fillStyle = 'rgba(46, 125, 50, 0.2)'; ctx.beginPath(); ctx.moveTo(originX + (acceptLeft - xMin) * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x >= acceptLeft && x <= acceptRight) ctx.lineTo(originX + px, originY - normalPDF(x - mu0) * scaleY) }
    ctx.lineTo(originX + (acceptRight - xMin) * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.fillStyle = 'rgba(198, 40, 40, 0.3)'; ctx.beginPath(); ctx.moveTo(originX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x <= acceptLeft) ctx.lineTo(originX + px, originY - normalPDF(x - mu0) * scaleY) }
    ctx.lineTo(originX + (acceptLeft - xMin) * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX + (acceptRight - xMin) * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x >= acceptRight) ctx.lineTo(originX + px, originY - normalPDF(x - mu0) * scaleY) }
    ctx.lineTo(originX + graphWidth, originY); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = normalPDF(x - mu0); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    const critLeftPx = originX + (acceptLeft - xMin) * scaleX; const critRightPx = originX + (acceptRight - xMin) * scaleX
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(critLeftPx, originY); ctx.lineTo(critLeftPx, padding); ctx.stroke(); ctx.beginPath(); ctx.moveTo(critRightPx, originY); ctx.lineTo(critRightPx, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText(`${(mu0 - zAlpha2).toFixed(2)}`, critLeftPx - 20, originY + 25); ctx.fillText(`${(mu0 + zAlpha2).toFixed(2)}`, critRightPx - 10, originY + 25)
    ctx.fillText('拒绝域', critLeftPx - 50, originY - graphHeight / 2); ctx.fillText('拒绝域', critRightPx + 10, originY - graphHeight / 2)
    ctx.fillStyle = '#2E7D32'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText('接受域', (critLeftPx + critRightPx) / 2 - 20, originY - graphHeight / 3)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`假设检验: H₀: μ = ${mu0} vs H₁: μ ≠ ${mu0}`, originX, padding - 10)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`α = ${alpha.toFixed(3)}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`z_α/2 = ${zAlpha2.toFixed(3)}`, 120, canvasHeight + 30)
    ctx.fillStyle = '#2E7D32'; ctx.fillText(`接受域: [${(mu0 - zAlpha2).toFixed(3)}, ${(mu0 + zAlpha2).toFixed(3)}]`, 280, canvasHeight + 30)
  }, [modelState.params])

  const drawMeanTesting = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 20)); const sigma = getParam('sigma', 1); const alpha = getParam('alpha', 0.05)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const mu0 = 0; const normalCDF = (x: number) => { const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429; const p = 0.3275911; const sign = x < 0 ? -1 : 1; const ax = Math.abs(x) / Math.sqrt(2); const t = 1 / (1 + p * ax); const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax); return 0.5 * (1 + sign * y) }
    const invNormalCDF = (p: number) => { let lo = -5, hi = 5; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (normalCDF(mid) < p) lo = mid; else hi = mid } return (lo + hi) / 2 }
    const zAlpha2 = -invNormalCDF(alpha / 2); const critXbar = zAlpha2 * sigma / Math.sqrt(n); const sigXbar = sigma / Math.sqrt(n)
    const pdfXbar = (x: number) => Math.exp(-((x - mu0) ** 2) / (2 * sigXbar * sigXbar)) / (sigXbar * Math.sqrt(2 * Math.PI))
    const xMin = mu0 - 4 * sigXbar, xMax = mu0 + 4 * sigXbar; const scaleX = graphWidth / (xMax - xMin); const maxPDF = pdfXbar(mu0); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); const yAxisX = originX + (mu0 - xMin) * scaleX; ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX, canvasHeight - padding); ctx.stroke()
    ctx.fillStyle = 'rgba(198, 40, 40, 0.25)'; ctx.beginPath(); ctx.moveTo(originX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x <= mu0 - critXbar) ctx.lineTo(originX + px, originY - pdfXbar(x) * scaleY) }
    ctx.lineTo(originX + (mu0 - critXbar - xMin) * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX + (mu0 + critXbar - xMin) * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x >= mu0 + critXbar) ctx.lineTo(originX + px, originY - pdfXbar(x) * scaleY) }
    ctx.lineTo(originX + graphWidth, originY); ctx.closePath(); ctx.fill()
    ctx.fillStyle = 'rgba(46, 125, 50, 0.15)'; ctx.beginPath(); ctx.moveTo(originX + (mu0 - critXbar - xMin) * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x >= mu0 - critXbar && x <= mu0 + critXbar) ctx.lineTo(originX + px, originY - pdfXbar(x) * scaleY) }
    ctx.lineTo(originX + (mu0 + critXbar - xMin) * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = pdfXbar(x); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    const critLPx = originX + (mu0 - critXbar - xMin) * scaleX; const critRPx = originX + (mu0 + critXbar - xMin) * scaleX
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(critLPx, originY); ctx.lineTo(critLPx, padding); ctx.stroke(); ctx.beginPath(); ctx.moveTo(critRPx, originY); ctx.lineTo(critRPx, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText(`${(mu0 - critXbar).toFixed(3)}`, critLPx - 30, originY + 25); ctx.fillText(`${(mu0 + critXbar).toFixed(3)}`, critRPx - 10, originY + 25)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`Z检验: Z = √n(X̄-μ₀)/σ, H₀: μ = ${mu0}`, originX, padding - 15); ctx.fillText(`拒绝域: |Z| > z_α/2 = ${zAlpha2.toFixed(3)}`, originX, padding - 2)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}`, 20, canvasHeight + 30); ctx.fillText(`σ = ${sigma.toFixed(1)}`, 100, canvasHeight + 30)
    ctx.fillStyle = '#C62828'; ctx.fillText(`α = ${alpha.toFixed(3)}`, 200, canvasHeight + 30); ctx.fillText(`z_α/2 = ${zAlpha2.toFixed(3)}`, 320, canvasHeight + 30)
  }, [modelState.params])

  const drawVarianceTesting = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n = Math.floor(getParam('n', 20)); const sigma0Sq = getParam('sigma0_sq', 1); const alpha = getParam('alpha', 0.05)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const df = n - 1
    const gamma = (x: number): number => { if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x)); let r = 1, y = x; while (y > 1.5) { y -= 1; r *= y } if (Math.abs(y - 1) < 1e-10) return r; if (Math.abs(y - 0.5) < 1e-10) return r * Math.sqrt(Math.PI); const g = 7; const coef = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; y -= 1; let s = coef[0]; for (let i = 1; i < g + 2; i++) s += coef[i] / (y + i); const t = y + g + 0.5; return r * Math.sqrt(2 * Math.PI) * Math.pow(t, y + 0.5) * Math.exp(-t) * s }
    const chi2PDF = (x: number) => { if (x <= 0) return 0; const halfDf = df / 2; return Math.pow(x, halfDf - 1) * Math.exp(-x / 2) / (Math.pow(2, halfDf) * gamma(halfDf)) }
    const chi2CDF = (x: number) => { if (x <= 0) return 0; const step = 0.05; let sum = 0; for (let t = 0; t < x; t += step) sum += chi2PDF(t + step / 2) * step; return Math.min(sum, 1) }
    const chi2InvCDF = (p: number) => { let lo = 0, hi = df + 10 * Math.sqrt(2 * df); for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (chi2CDF(mid) < p) lo = mid; else hi = mid } return (lo + hi) / 2 }
    const chi2Alpha2 = chi2InvCDF(alpha / 2); const chi2OneMinusAlpha2 = chi2InvCDF(1 - alpha / 2)
    const xMax = Math.max(chi2OneMinusAlpha2 + 5, df + 4 * Math.sqrt(2 * df)); const scaleX = graphWidth / xMax
    let maxPDF = 0; for (let x = 0.01; x < xMax; x += 0.1) maxPDF = Math.max(maxPDF, chi2PDF(x)); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, padding); ctx.stroke()
    ctx.fillStyle = 'rgba(198, 40, 40, 0.3)'; ctx.beginPath(); ctx.moveTo(originX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = px / scaleX; if (x <= chi2Alpha2) ctx.lineTo(originX + px, originY - chi2PDF(x) * scaleY) }
    ctx.lineTo(originX + chi2Alpha2 * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX + chi2OneMinusAlpha2 * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = px / scaleX; if (x >= chi2OneMinusAlpha2) ctx.lineTo(originX + px, originY - chi2PDF(x) * scaleY) }
    ctx.lineTo(originX + graphWidth, originY); ctx.closePath(); ctx.fill()
    ctx.fillStyle = 'rgba(46, 125, 50, 0.15)'; ctx.beginPath(); ctx.moveTo(originX + chi2Alpha2 * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = px / scaleX; if (x >= chi2Alpha2 && x <= chi2OneMinusAlpha2) ctx.lineTo(originX + px, originY - chi2PDF(x) * scaleY) }
    ctx.lineTo(originX + chi2OneMinusAlpha2 * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath(); let started = false
    for (let px = 0; px <= graphWidth; px++) { const x = px / scaleX; const y = chi2PDF(x); if (y > 0.0001) { if (!started) { ctx.moveTo(originX + px, originY - y * scaleY); started = true } else ctx.lineTo(originX + px, originY - y * scaleY) } }
    ctx.stroke()
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4])
    ctx.beginPath(); ctx.moveTo(originX + chi2Alpha2 * scaleX, originY); ctx.lineTo(originX + chi2Alpha2 * scaleX, padding); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX + chi2OneMinusAlpha2 * scaleX, originY); ctx.lineTo(originX + chi2OneMinusAlpha2 * scaleX, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 12px "Noto Serif SC", serif'
    ctx.fillText(`χ²_{α/2}=${chi2Alpha2.toFixed(2)}`, originX + chi2Alpha2 * scaleX - 55, originY + 25); ctx.fillText(`χ²_{1-α/2}=${chi2OneMinusAlpha2.toFixed(2)}`, originX + chi2OneMinusAlpha2 * scaleX - 40, originY + 25)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`χ²检验: (n-1)S²/σ₀² ~ χ²(${df})`, originX, padding - 15); ctx.fillText(`H₀: σ² = ${sigma0Sq.toFixed(1)}`, originX, padding - 2)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n = ${n}, df = ${df}`, 20, canvasHeight + 30); ctx.fillStyle = '#C62828'; ctx.fillText(`α = ${alpha.toFixed(3)}`, 170, canvasHeight + 30); ctx.fillText(`σ₀² = ${sigma0Sq.toFixed(1)}`, 300, canvasHeight + 30)
  }, [modelState.params])

  const drawTwoSampleTesting = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const n1 = Math.floor(getParam('n1', 15)); const n2 = Math.floor(getParam('n2', 15)); const alpha = getParam('alpha', 0.05)
    ctx.fillStyle = '#F4E4BC'; ctx.fillRect(0, 0, width, height)
    const infoBarHeight = 50; const canvasHeight = height - infoBarHeight; const padding = 50; const graphWidth = width - padding * 2; const graphHeight = canvasHeight - padding * 2; const originX = padding; const originY = canvasHeight - padding
    const mu1 = -1, mu2 = 1, sigma = 1
    const normalPDF = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI))
    const normalCDF = (x: number) => { const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429; const p = 0.3275911; const sign = x < 0 ? -1 : 1; const ax = Math.abs(x) / Math.sqrt(2); const t = 1 / (1 + p * ax); const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax); return 0.5 * (1 + sign * y) }
    const invNormalCDF = (p: number) => { let lo = -5, hi = 5; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (normalCDF(mid) < p) lo = mid; else hi = mid } return (lo + hi) / 2 }
    const zAlpha2 = -invNormalCDF(alpha / 2); const sigmaDiff = sigma * Math.sqrt(1 / n1 + 1 / n2); const muDiff = mu1 - mu2
    const xMin = muDiff - 4 * sigmaDiff, xMax = muDiff + 4 * sigmaDiff; const scaleX = graphWidth / (xMax - xMin); const maxPDF = normalPDF(muDiff, muDiff, sigmaDiff); const scaleY = graphHeight / (maxPDF * 1.3)
    ctx.strokeStyle = 'rgba(196, 167, 125, 0.3)'; ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) { const x = originX + (graphWidth / 10) * i; ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvasHeight - padding); ctx.stroke() }
    for (let i = 0; i <= 10; i++) { const y = originY - (graphHeight / 10) * i; ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke() }
    ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + graphWidth, originY); ctx.stroke(); const yAxisX = originX + (0 - xMin) * scaleX; ctx.beginPath(); ctx.moveTo(yAxisX, padding); ctx.lineTo(yAxisX, canvasHeight - padding); ctx.stroke()
    const sigUnderH0 = sigmaDiff; const pdfH0 = (x: number) => normalPDF(x, 0, sigUnderH0)
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = normalPDF(x, muDiff, sigmaDiff); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke()
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.beginPath()
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; const y = pdfH0(x); if (px === 0) ctx.moveTo(originX + px, originY - y * scaleY); else ctx.lineTo(originX + px, originY - y * scaleY) }
    ctx.stroke(); ctx.setLineDash([])
    const critVal = zAlpha2 * sigUnderH0; ctx.fillStyle = 'rgba(198, 40, 40, 0.2)'; ctx.beginPath(); ctx.moveTo(originX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x <= -critVal) ctx.lineTo(originX + px, originY - pdfH0(x) * scaleY) }
    ctx.lineTo(originX + (-critVal - xMin) * scaleX, originY); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.moveTo(originX + (critVal - xMin) * scaleX, originY)
    for (let px = 0; px <= graphWidth; px++) { const x = xMin + px / scaleX; if (x >= critVal) ctx.lineTo(originX + px, originY - pdfH0(x) * scaleY) }
    ctx.lineTo(originX + graphWidth, originY); ctx.closePath(); ctx.fill()
    const critLPx = originX + (-critVal - xMin) * scaleX; const critRPx = originX + (critVal - xMin) * scaleX
    ctx.strokeStyle = '#C62828'; ctx.lineWidth = 2; ctx.setLineDash([8, 4]); ctx.beginPath(); ctx.moveTo(critLPx, originY); ctx.lineTo(critLPx, padding); ctx.stroke(); ctx.beginPath(); ctx.moveTo(critRPx, originY); ctx.lineTo(critRPx, padding); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#C62828'; ctx.font = 'bold 12px "Noto Serif SC", serif'; ctx.fillText('H₀下分布', originX + graphWidth - 100, padding + 15)
    ctx.fillStyle = '#1565C0'; ctx.fillText('真实分布', originX + graphWidth - 100, padding + 30)
    ctx.fillStyle = '#3E2723'; ctx.font = 'bold 13px "Noto Serif SC", serif'; ctx.fillText(`两样本均值差检验: H₀: μ₁ = μ₂`, originX, padding - 15); ctx.fillText(`Z = (X̄₁-X̄₂)/σ√(1/n₁+1/n₂)`, originX, padding - 2)
    ctx.fillStyle = 'rgba(250, 240, 215, 0.98)'; ctx.fillRect(0, canvasHeight, width, infoBarHeight); ctx.strokeStyle = '#C4A77D'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, canvasHeight); ctx.lineTo(width, canvasHeight); ctx.stroke()
    ctx.fillStyle = '#5D4037'; ctx.font = '13px "Noto Serif SC", serif'; ctx.fillText(`n₁ = ${n1}`, 20, canvasHeight + 30); ctx.fillText(`n₂ = ${n2}`, 100, canvasHeight + 30)
    ctx.fillStyle = '#C62828'; ctx.fillText(`α = ${alpha.toFixed(3)}`, 200, canvasHeight + 30); ctx.fillText(`z_α/2 = ${zAlpha2.toFixed(3)}`, 320, canvasHeight + 30)
  }, [modelState.params])

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
    } else if (knowledge.id === 'random-experiment') {
      drawRandomExperiment(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'event-relation') {
      drawEventRelation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'probability-axiom') {
      drawProbabilityAxiom(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'classical-probability') {
      drawClassicalProbability(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'geometric-probability') {
      drawGeometricProbability(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'conditional-probability') {
      drawConditionalProbability(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'bayes-formula') {
      drawBayesFormula(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'independence-bernoulli') {
      drawIndependenceBernoulli(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'distribution-function') {
      drawDistributionFunction(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'discrete-rv') {
      drawDiscreteRV(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'binomial-distribution') {
      drawBinomialDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'poisson-distribution') {
      drawPoissonDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'continuous-rv') {
      drawContinuousRV(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'uniform-exponential') {
      drawUniformExponential(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'normal-distribution') {
      drawNormalDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'rv-function') {
      drawRVFunction(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'joint-distribution') {
      drawJointDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-dim-discrete') {
      drawTwoDimDiscrete(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-dim-continuous') {
      drawTwoDimContinuous(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'marginal-distribution') {
      drawMarginalDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'conditional-distribution') {
      drawConditionalDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'rv-independence') {
      drawRVIndependence(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-dim-function') {
      drawTwoDimFunction(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'expectation') {
      drawExpectation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'variance') {
      drawVariance(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'covariance-correlation') {
      drawCovarianceCorrelation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'moment-cov-matrix') {
      drawMomentCovMatrix(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'distribution-features-summary') {
      drawDistributionFeaturesSummary(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'chebyshev-inequality') {
      drawChebyshevInequality(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'law-large-numbers') {
      drawLawLargeNumbers(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'central-limit-theorem') {
      drawCentralLimitTheorem(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'population-sample') {
      drawPopulationSample(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'sampling-distributions') {
      drawSamplingDistributions(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'normal-sampling-theorem') {
      drawNormalSamplingTheorem(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'order-statistics') {
      drawOrderStatistics(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'moment-estimation') {
      drawMomentEstimation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'maximum-likelihood') {
      drawMaximumLikelihood(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'estimator-criteria') {
      drawEstimatorCriteria(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'interval-estimation') {
      drawIntervalEstimation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'hypothesis-testing-basics') {
      drawHypothesisTestingBasics(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'mean-testing') {
      drawMeanTesting(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'variance-testing') {
      drawVarianceTesting(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-sample-testing') {
      drawTwoSampleTesting(ctx, rect.width, rect.height)
    }
  }, [knowledge.id, drawSequenceLimit, drawDerivative, drawFunctionLimit, drawInfinitesimal, drawContinuity, drawFirstOrderODE, drawSecondOrderODE, drawDerivativeRules, drawImplicitParametric, drawDifferential, drawDefiniteIntegral, drawIndefiniteIntegral, drawSubstitution, drawIntegrationByParts, drawDoubleIntegral, drawTripleIntegral, drawLineIntegralType1, drawLineIntegralType2, drawSurfaceIntegralType1, drawSurfaceIntegralType2, drawSeriesConvergence, drawPowerSeries, drawFourierSeries, drawVectorOperations, drawPlaneAndLine, drawSurfaces, drawDeterminantDefinition, drawDeterminantExpansion, drawMatrixDefinition, drawMatrixInverse, drawMultivariableBasic, drawPartialDerivative, drawCompositeImplicit, drawDirectionalGradient, drawMultivariableExtremum, drawRandomExperiment, drawEventRelation, drawProbabilityAxiom, drawClassicalProbability, drawGeometricProbability, drawConditionalProbability, drawBayesFormula, drawIndependenceBernoulli, drawDistributionFunction, drawDiscreteRV, drawBinomialDistribution, drawPoissonDistribution, drawContinuousRV, drawUniformExponential, drawNormalDistribution, drawRVFunction, drawJointDistribution, drawTwoDimDiscrete, drawTwoDimContinuous, drawMarginalDistribution, drawConditionalDistribution, drawRVIndependence, drawTwoDimFunction, drawExpectation, drawVariance, drawCovarianceCorrelation, drawMomentCovMatrix, drawDistributionFeaturesSummary, drawChebyshevInequality, drawLawLargeNumbers, drawCentralLimitTheorem, drawPopulationSample, drawSamplingDistributions, drawNormalSamplingTheorem, drawOrderStatistics, drawMomentEstimation, drawMaximumLikelihood, drawEstimatorCriteria, drawIntervalEstimation, drawHypothesisTestingBasics, drawMeanTesting, drawVarianceTesting, drawTwoSampleTesting])

  // 对比画布绘制>绘制
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
    } else if (knowledge.id === 'random-experiment') {
      drawRandomExperiment(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'event-relation') {
      drawEventRelation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'probability-axiom') {
      drawProbabilityAxiom(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'classical-probability') {
      drawClassicalProbability(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'geometric-probability') {
      drawGeometricProbability(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'conditional-probability') {
      drawConditionalProbability(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'bayes-formula') {
      drawBayesFormula(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'independence-bernoulli') {
      drawIndependenceBernoulli(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'distribution-function') {
      drawDistributionFunction(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'discrete-rv') {
      drawDiscreteRV(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'binomial-distribution') {
      drawBinomialDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'poisson-distribution') {
      drawPoissonDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'continuous-rv') {
      drawContinuousRV(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'uniform-exponential') {
      drawUniformExponential(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'normal-distribution') {
      drawNormalDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'rv-function') {
      drawRVFunction(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'joint-distribution') {
      drawJointDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-dim-discrete') {
      drawTwoDimDiscrete(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-dim-continuous') {
      drawTwoDimContinuous(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'marginal-distribution') {
      drawMarginalDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'conditional-distribution') {
      drawConditionalDistribution(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'rv-independence') {
      drawRVIndependence(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-dim-function') {
      drawTwoDimFunction(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'expectation') {
      drawExpectation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'variance') {
      drawVariance(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'covariance-correlation') {
      drawCovarianceCorrelation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'moment-cov-matrix') {
      drawMomentCovMatrix(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'distribution-features-summary') {
      drawDistributionFeaturesSummary(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'chebyshev-inequality') {
      drawChebyshevInequality(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'law-large-numbers') {
      drawLawLargeNumbers(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'central-limit-theorem') {
      drawCentralLimitTheorem(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'population-sample') {
      drawPopulationSample(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'sampling-distributions') {
      drawSamplingDistributions(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'normal-sampling-theorem') {
      drawNormalSamplingTheorem(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'order-statistics') {
      drawOrderStatistics(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'moment-estimation') {
      drawMomentEstimation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'maximum-likelihood') {
      drawMaximumLikelihood(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'estimator-criteria') {
      drawEstimatorCriteria(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'interval-estimation') {
      drawIntervalEstimation(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'hypothesis-testing-basics') {
      drawHypothesisTestingBasics(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'mean-testing') {
      drawMeanTesting(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'variance-testing') {
      drawVarianceTesting(ctx, rect.width, rect.height)
    } else if (knowledge.id === 'two-sample-testing') {
      drawTwoSampleTesting(ctx, rect.width, rect.height)
    }
  }, [knowledge.id, drawSequenceLimit, drawDerivative, drawFunctionLimit, drawInfinitesimal, drawContinuity, drawFirstOrderODE, drawSecondOrderODE, drawDerivativeRules, drawImplicitParametric, drawDifferential, drawDefiniteIntegral, drawIndefiniteIntegral, drawSubstitution, drawIntegrationByParts, drawDoubleIntegral, drawTripleIntegral, drawLineIntegralType1, drawLineIntegralType2, drawSurfaceIntegralType1, drawSurfaceIntegralType2, drawSeriesConvergence, drawPowerSeries, drawFourierSeries, drawVectorOperations, drawPlaneAndLine, drawSurfaces, drawDeterminantDefinition, drawDeterminantExpansion, drawMatrixDefinition, drawMatrixInverse, drawMultivariableBasic, drawPartialDerivative, drawCompositeImplicit, drawDirectionalGradient, drawMultivariableExtremum, drawRandomExperiment, drawEventRelation, drawProbabilityAxiom, drawClassicalProbability, drawGeometricProbability, drawConditionalProbability, drawBayesFormula, drawIndependenceBernoulli, drawDistributionFunction, drawDiscreteRV, drawBinomialDistribution, drawPoissonDistribution, drawContinuousRV, drawUniformExponential, drawNormalDistribution, drawRVFunction, drawJointDistribution, drawTwoDimDiscrete, drawTwoDimContinuous, drawMarginalDistribution, drawConditionalDistribution, drawRVIndependence, drawTwoDimFunction, drawExpectation, drawVariance, drawCovarianceCorrelation, drawMomentCovMatrix, drawDistributionFeaturesSummary, drawChebyshevInequality, drawLawLargeNumbers, drawCentralLimitTheorem, drawPopulationSample, drawSamplingDistributions, drawNormalSamplingTheorem, drawOrderStatistics, drawMomentEstimation, drawMaximumLikelihood, drawEstimatorCriteria, drawIntervalEstimation, drawHypothesisTestingBasics, drawMeanTesting, drawVarianceTesting, drawTwoSampleTesting, compareType])

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
