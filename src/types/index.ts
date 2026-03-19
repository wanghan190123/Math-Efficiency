/* ============================================
   类型定义
   ============================================ */

// 知识模块
export interface KnowledgeModule {
  id: string
  name: string
  icon: string
  description: string
  knowledgePoints: KnowledgePoint[]
}

// 知识点
export interface KnowledgePoint {
  id: string
  moduleId: string
  name: string
  formula: string
  coreSentence: string // 一句话核心

  // 五维内容
  dimensions: {
    // 1. 动态模型
    model: {
      type: '2d' | '3d'
      config: ModelConfig
      animations: Animation[]
    }
    // 2. 生动讲解
    explanation: {
      mainText: string
      highlights: TextHighlight[]
    }
    // 3. 内涵延伸
    extension: {
      essence: string
      extension: string
    }
    // 4. 应用实例
    applications: Application[]
    // 5. 做题方法
    method: MethodStep[]
  }
}

// 模型配置
export interface ModelConfig {
  // 2D 模型配置
  functions?: MathFunction[]
  points?: PointConfig[]
  sliders?: SliderConfig[]
  // 3D 模型配置
  objects3D?: Object3DConfig[]
}

export interface MathFunction {
  id: string
  expression: string
  color: string
  visible: boolean
}

export interface PointConfig {
  id: string
  x: number | string // 可以是数值或变量名
  y: number | string
  draggable?: boolean
  color?: string
  label?: string
}

export interface SliderConfig {
  id: string
  name: string
  min: number
  max: number
  step: number
  defaultValue: number
  label: string
}

export interface Object3DConfig {
  id: string
  type: 'surface' | 'curve' | 'point' | 'vector'
  expression?: string
  params?: Record<string, number>
}

// 动画配置
export interface Animation {
  id: string
  name: string
  type: 'auto' | 'step' | 'gesture'
  duration?: number
  steps?: AnimationStep[]
}

export interface AnimationStep {
  id: string
  description: string
  changes: Record<string, number>
}

// 文本高亮
export interface TextHighlight {
  start: number
  end: number
  type: 'formula' | 'emphasis' | 'definition'
}

// 应用实例
export interface Application {
  id: string
  type: 'real' | 'research'
  title: string
  description: string
  scenario?: string
  modelConfig?: Partial<ModelConfig>
}

// 做题方法步骤
export interface MethodStep {
  number: number
  title: string
  description: string
}

// 应用状态
export interface AppState {
  // 当前选中的模块和知识点
  currentModuleId: string | null
  currentKnowledgeId: string | null
  
  // 模型状态
  modelState: ModelState
  
  // UI 状态
  isDarkMode: boolean
  isPlaying: boolean
  isStepping: boolean
  playbackSpeed: number
  
  // 对比模式
  compareMode: boolean
  compareKnowledgeId: string | null
  
  // 操作
  setModule: (moduleId: string) => void
  setKnowledge: (knowledgeId: string) => void
  setDarkMode: (isDark: boolean) => void
  setPlaying: (isPlaying: boolean) => void
  setPlaybackSpeed: (speed: number) => void
  toggleCompareMode: () => void
  setCompareKnowledge: (knowledgeId: string | null) => void
  updateModelParams: (params: Record<string, number>) => void
}

export interface ModelState {
  // 当前模型参数
  params: Record<string, number>
  // 当前动画步骤
  currentStep: number
  // 总步骤数
  totalSteps: number
  // 缩放
  zoom: number
  // 旋转（3D）
  rotation: { x: number; y: number; z: number }
}

// 语音状态
export interface SpeechState {
  isSpeaking: boolean
  currentIndex: number
  textSegments: string[]
}

// 窗口控制
export interface WindowControls {
  minimize: () => void
  maximize: () => void
  close: () => void
}
