import { useState, useCallback, useRef, useEffect } from 'react'

interface GestureState {
  isDragging: boolean
  startX: number
  startY: number
  deltaX: number
  deltaY: number
  velocity: number
}

interface UseGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onDrag?: (deltaX: number, deltaY: number) => void
  threshold?: number
}

export const useGesture = (options: UseGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onDrag,
    threshold = 50,
  } = options

  const [state, setState] = useState<GestureState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
  })

  const lastTouchRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const initialDistanceRef = useRef<number>(0)

  const getTouchDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setState({
      isDragging: true,
      startX: clientX,
      startY: clientY,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
    })
    lastTouchRef.current = { x: clientX, y: clientY, time: Date.now() }
  }, [])

  const handleMove = useCallback(
    (clientX: number, clientY: number, touches?: TouchList) => {
      if (!state.isDragging) return

      const deltaX = clientX - state.startX
      const deltaY = clientY - state.startY
      const now = Date.now()
      const dt = now - (lastTouchRef.current?.time || now)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const velocity = dt > 0 ? distance / dt : 0

      setState((prev) => ({
        ...prev,
        deltaX,
        deltaY,
        velocity,
      }))

      // 双指缩放
      if (touches && touches.length === 2 && onPinch) {
        const currentDistance = getTouchDistance(touches)
        if (initialDistanceRef.current > 0) {
          const scale = currentDistance / initialDistanceRef.current
          onPinch(scale)
        }
      }

      // 拖动回调
      onDrag?.(deltaX, deltaY)

      lastTouchRef.current = { x: clientX, y: clientY, time: now }
    },
    [state.isDragging, state.startX, state.startY, onPinch, onDrag]
  )

  const handleEnd = useCallback(() => {
    const { deltaX, deltaY, velocity } = state

    // 判断滑动方向
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // 水平滑动
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      } else {
        // 垂直滑动
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }

    setState({
      isDragging: false,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
    })

    initialDistanceRef.current = 0
  }, [state, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  // 触摸事件处理
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
      
      if (e.touches.length === 2) {
        initialDistanceRef.current = getTouchDistance(e.touches)
      }
    },
    [handleStart]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY, e.touches)
    },
    [handleMove]
  )

  const onTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // 鼠标事件处理
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX, e.clientY)
    },
    [handleStart]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    },
    [handleMove]
  )

  const onMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const onMouseLeave = useCallback(() => {
    if (state.isDragging) {
      handleEnd()
    }
  }, [state.isDragging, handleEnd])

  return {
    ...state,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  }
}

export default useGesture
