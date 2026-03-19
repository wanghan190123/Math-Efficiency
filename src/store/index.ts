import { create } from 'zustand'
import { AppState, ModelState } from '@/types'

const initialModelState: ModelState = {
  params: {},
  currentStep: 0,
  totalSteps: 10,
  zoom: 1,
  rotation: { x: 0, y: 0, z: 0 },
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  currentModuleId: 'limits',
  currentKnowledgeId: 'sequence-limit',
  
  modelState: initialModelState,
  
  isDarkMode: false,
  isPlaying: false,
  isStepping: false,
  playbackSpeed: 1,
  
  compareMode: false,
  compareKnowledgeId: null,

  // Actions
  setModule: (moduleId) => set({ currentModuleId: moduleId, currentKnowledgeId: null }),
  
  setKnowledge: (knowledgeId) => set({ currentKnowledgeId: knowledgeId }),
  
  setDarkMode: (isDark) => {
    set({ isDarkMode: isDark })
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  },
  
  setPlaying: (isPlaying) => set({ isPlaying }),
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),
  
  setCompareKnowledge: (knowledgeId) => set({ compareKnowledgeId: knowledgeId }),
  
  updateModelParams: (params) => set((state) => ({
    modelState: {
      ...state.modelState,
      params: { ...state.modelState.params, ...params },
    },
  })),
}))

// 语音朗读状态
interface SpeechStore {
  isSpeaking: boolean
  currentIndex: number
  startSpeaking: () => void
  stopSpeaking: () => void
  setCurrentIndex: (index: number) => void
}

export const useSpeechStore = create<SpeechStore>((set) => ({
  isSpeaking: false,
  currentIndex: 0,
  startSpeaking: () => set({ isSpeaking: true }),
  stopSpeaking: () => set({ isSpeaking: false, currentIndex: 0 }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
}))
