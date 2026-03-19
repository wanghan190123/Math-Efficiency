import React from 'react'
import { Minus, Square, X, ArrowLeft } from 'lucide-react'

interface TitleBarProps {
  showBackButton?: boolean
  onBackClick?: () => void
}

const TitleBar: React.FC<TitleBarProps> = ({ showBackButton = false, onBackClick }) => {
  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow()
  }

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow()
  }

  const handleClose = () => {
    window.electronAPI?.closeWindow()
  }

  return (
    <div className="title-bar">
      <div className="title-bar__left">
        {showBackButton && (
          <button 
            className="title-bar__back-btn" 
            onClick={onBackClick}
            title="返回菜单"
          >
            <ArrowLeft size={18} />
            <span>返回</span>
          </button>
        )}
      </div>
      <div className="title-bar__title">
        <span style={{ fontSize: '16px' }}>📐</span>
        <span>Math-Efficiency</span>
      </div>
      <div className="title-bar__controls">
        <button className="title-bar__btn" onClick={handleMinimize} title="最小化">
          <Minus size={14} />
        </button>
        <button className="title-bar__btn" onClick={handleMaximize} title="最大化">
          <Square size={12} />
        </button>
        <button className="title-bar__btn title-bar__btn--close" onClick={handleClose} title="关闭">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default TitleBar