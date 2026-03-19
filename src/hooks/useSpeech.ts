import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechOptions {
  onHighlight?: (index: number) => void
  onEnd?: () => void
}

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const segmentsRef = useRef<string[]>([])

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeaking])

  const speak = useCallback((text: string) => {
    // 检查浏览器支持
    if (!('speechSynthesis' in window)) {
      console.warn('浏览器不支持语音合成')
      return
    }

    // 停止当前播放
    window.speechSynthesis.cancel()

    // 分段处理（按句号、问号、感叹号分割）
    segmentsRef.current = text
      .split(/[。！？\n]/)
      .filter(s => s.trim())
      .map(s => s.trim())

    setCurrentIndex(0)
    setIsSpeaking(true)

    const speakSegment = (index: number) => {
      if (index >= segmentsRef.current.length) {
        setIsSpeaking(false)
        setCurrentIndex(-1)
        options.onEnd?.()
        return
      }

      const utterance = new SpeechSynthesisUtterance(segmentsRef.current[index])
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onend = () => {
        const nextIndex = index + 1
        setCurrentIndex(nextIndex)
        options.onHighlight?.(nextIndex)
        speakSegment(nextIndex)
      }

      utterance.onerror = (event) => {
        console.error('语音合成错误:', event)
        setIsSpeaking(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    speakSegment(0)
  }, [options])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setCurrentIndex(-1)
  }, [])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setIsSpeaking(false)
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    setIsSpeaking(true)
  }, [])

  return {
    isSpeaking,
    currentIndex,
    totalSegments: segmentsRef.current.length,
    speak,
    stop,
    pause,
    resume,
  }
}

export default useSpeech
