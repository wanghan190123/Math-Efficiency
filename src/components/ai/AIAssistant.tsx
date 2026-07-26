import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Settings, Camera, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import './AIAssistant.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

interface APIConfig {
  provider: string
  apiKey: string
  apiUrl?: string
  model: string
}

interface ProviderInfo {
  id: string
  name: string
  logo: string
  description: string
  defaultModel: string
  models: string[]
  defaultApiUrl: string
}

const PROVIDERS: ProviderInfo[] = [
  {
    id: 'doubao',
    name: '豆包',
    logo: '🥟',
    description: '字节跳动旗下AI助手',
    defaultModel: 'doubao-3.5',
    models: ['doubao-3.5', 'doubao-pro'],
    defaultApiUrl: 'https://api.doubao.com/v1/chat/completions'
  },
  {
    id: 'baidu',
    name: '文心一言',
    logo: '💬',
    description: '百度旗下AI大模型',
    defaultModel: 'ERNIE-4.0',
    models: ['ERNIE-4.0', 'ERNIE-3.5', 'ERNIE-3.0'],
    defaultApiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-4.0'
  },
  {
    id: 'xunfei',
    name: '讯飞星火',
    logo: '🔥',
    description: '科大讯飞AI大模型',
    defaultModel: 'spark-4.0',
    models: ['spark-4.0', 'spark-3.5', 'spark-3.0'],
    defaultApiUrl: 'https://spark-api.xf-yun.com/v1/chat/completions'
  },
  {
    id: 'alibaba',
    name: '通义千问',
    logo: '🐲',
    description: '阿里云AI大模型',
    defaultModel: 'qwen-max',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
    defaultApiUrl: 'https://dashscope.aliyuncs.com/api/text/chat'
  },
  {
    id: 'tencent',
    name: '腾讯混元',
    logo: '🐧',
    description: '腾讯AI大模型',
    defaultModel: 'hunyuan',
    models: ['hunyuan', 'hunyuan-lite'],
    defaultApiUrl: 'https://api.tencent.com/v1/chat/completions'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🤖',
    description: 'OpenAI GPT系列',
    defaultModel: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'],
    defaultApiUrl: 'https://api.openai.com/v1/chat/completions'
  }
]

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)
  const [config, setConfig] = useState<APIConfig>({
    provider: '',
    apiKey: '',
    apiUrl: '',
    model: ''
  })
  const [showProviderDropdown, setShowProviderDropdown] = useState(false)
  const [apiError, setApiError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadConfig()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConfig = () => {
    try {
      const saved = localStorage.getItem('ai-assistant-config')
      if (saved) {
        const savedConfig = JSON.parse(saved)
        setConfig(savedConfig)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const saveConfig = () => {
    try {
      localStorage.setItem('ai-assistant-config', JSON.stringify(config))
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }

  const handleOpen = async () => {
    setIsOpen(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleClose = () => {
    setIsOpen(false)
    setInputText('')
    setScreenshot(null)
  }

  const handleTakeScreenshot = async () => {
    setIsLoading(true)
    try {
      if (window.electronAPI?.captureScreen) {
        const result = await window.electronAPI.captureScreen()
        if (result.success && result.dataUrl) {
          setScreenshot(result.dataUrl)
        }
      }
    } catch (error) {
      console.error('Screenshot failed:', error)
    }
    setIsLoading(false)
  }

  const handleSend = async () => {
    if (!inputText.trim() && !screenshot) return

    if (!config.apiKey || !config.provider) {
      setApiError('请先配置API密钥和选择模型提供商')
      return
    }

    setApiError('')

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      image: screenshot || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setScreenshot(null)
    setIsLoading(true)

    try {
      const response = await callAPI(userMessage.content)
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response || '暂无响应'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `发生错误: ${String(error)}`
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const callAPI = async (content: string): Promise<string> => {
    const provider = PROVIDERS.find(p => p.id === config.provider)
    if (!provider) throw new Error('未知的模型提供商')

    let url = config.apiUrl || provider.defaultApiUrl
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    switch (config.provider) {
      case 'doubao':
        headers['Authorization'] = `Bearer ${config.apiKey}`
        break
      case 'baidu':
        url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${config.model.toLowerCase().replace('-', '')}?access_token=${config.apiKey}`
        break
      case 'xunfei':
        headers['Authorization'] = `Bearer ${config.apiKey}`
        break
      case 'alibaba':
        headers['Authorization'] = `Bearer ${config.apiKey}`
        break
      case 'tencent':
        headers['Authorization'] = `Bearer ${config.apiKey}`
        break
      case 'openai':
        headers['Authorization'] = `Bearer ${config.apiKey}`
        break
      default:
        headers['Authorization'] = `Bearer ${config.apiKey}`
    }

    const body = JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content }],
      max_tokens: 2000,
      temperature: 0.7
    })

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'API请求失败')
    }

    switch (config.provider) {
      case 'baidu':
        return data.result || data.response
      case 'xunfei':
        return data.choices?.[0]?.message?.content || data.result
      case 'alibaba':
        return data.output?.text || data.result
      case 'tencent':
        return data.choices?.[0]?.message?.content || data.response
      case 'doubao':
      case 'openai':
      default:
        return data.choices?.[0]?.message?.content || data.response
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleProviderChange = (providerId: string) => {
    const provider = PROVIDERS.find(p => p.id === providerId)
    if (provider) {
      setConfig(prev => ({
        ...prev,
        provider: providerId,
        model: provider.defaultModel,
        apiUrl: provider.defaultApiUrl
      }))
    }
    setShowProviderDropdown(false)
    saveConfig()
  }

  const handleConfigChange = (key: keyof APIConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
    saveConfig()
  }

  const handleCopyResponse = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentProvider = PROVIDERS.find(p => p.id === config.provider)

  return (
    <>
      <button 
        className="ai-assistant-fab"
        onClick={handleOpen}
        title="AI解读助手"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="ai-assistant-panel">
          <div className="ai-assistant-header">
            <h3>AI解读助手</h3>
            <div className="ai-assistant-header-actions">
              <button 
                className="ai-assistant-icon-btn"
                onClick={() => setShowSettings(!showSettings)}
                title="设置"
              >
                <Settings size={18} />
              </button>
              <button 
                className="ai-assistant-icon-btn"
                onClick={handleClose}
                title="关闭"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="ai-assistant-settings">
              <h4 className="ai-assistant-settings-title">API配置</h4>
              
              <div className="ai-assistant-setting-item">
                <label>模型提供商</label>
                <div className="ai-assistant-select-wrapper">
                  <button 
                    className="ai-assistant-select-trigger"
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                  >
                    {currentProvider ? (
                      <span>
                        <span className="provider-logo">{currentProvider.logo}</span>
                        <span>{currentProvider.name}</span>
                      </span>
                    ) : (
                      <span className="placeholder">请选择提供商</span>
                    )}
                    {showProviderDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {showProviderDropdown && (
                    <div className="ai-assistant-select-dropdown">
                      {PROVIDERS.map(provider => (
                        <button
                          key={provider.id}
                          className={`ai-assistant-select-option ${config.provider === provider.id ? 'selected' : ''}`}
                          onClick={() => handleProviderChange(provider.id)}
                        >
                          <span className="provider-logo">{provider.logo}</span>
                          <div className="provider-info">
                            <span className="provider-name">{provider.name}</span>
                            <span className="provider-desc">{provider.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {currentProvider && (
                <>
                  <div className="ai-assistant-setting-item">
                    <label>选择模型</label>
                    <select 
                      value={config.model}
                      onChange={(e) => handleConfigChange('model', e.target.value)}
                      className="ai-assistant-select"
                    >
                      {currentProvider.models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  <div className="ai-assistant-setting-item">
                    <label>API Key</label>
                    <input 
                      type="password" 
                      value={config.apiKey}
                      onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                      placeholder="请输入API密钥"
                      className="ai-assistant-input"
                    />
                  </div>

                  <div className="ai-assistant-setting-item">
                    <label>API地址（可选）</label>
                    <input 
                      type="text" 
                      value={config.apiUrl}
                      onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                      placeholder={currentProvider.defaultApiUrl}
                      className="ai-assistant-input"
                    />
                  </div>
                </>
              )}

              {apiError && (
                <div className="ai-assistant-error">{apiError}</div>
              )}

              {currentProvider && config.apiKey && (
                <div className="ai-assistant-config-status">
                  ✅ 配置已保存
                </div>
              )}
            </div>
          )}

          <div className="ai-assistant-messages">
            {messages.length === 0 && (
              <div className="ai-assistant-welcome">
                <MessageCircle size={48} strokeWidth={1} />
                <p>欢迎使用AI解读助手</p>
                <p className="ai-assistant-welcome-hint">
                  输入问题后发送，AI将为您解答
                </p>
                {!config.apiKey && (
                  <button 
                    className="ai-assistant-config-btn"
                    onClick={() => setShowSettings(true)}
                  >
                    点击配置API密钥
                  </button>
                )}
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`ai-assistant-message ai-assistant-message--${msg.role}`}
              >
                {msg.image && (
                  <div className="ai-assistant-message-image">
                    <img src={msg.image} alt="截图" />
                  </div>
                )}
                <div className="ai-assistant-message-content">
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <button 
                    className="ai-assistant-copy-btn"
                    onClick={() => handleCopyResponse(msg.content)}
                    title="复制"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="ai-assistant-message ai-assistant-message--assistant">
                <Loader2 className="ai-assistant-loading" size={20} />
                <span>正在思考...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {screenshot && (
            <div className="ai-assistant-screenshot-preview">
              <img src={screenshot} alt="截图预览" />
              <button 
                className="ai-assistant-remove-screenshot"
                onClick={() => setScreenshot(null)}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="ai-assistant-input-area">
            <button 
              className="ai-assistant-screenshot-btn"
              onClick={handleTakeScreenshot}
              title="截图"
              disabled={isLoading}
            >
              <Camera size={18} />
            </button>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题..."
              rows={2}
              disabled={isLoading}
            />
            <button 
              className="ai-assistant-send-btn"
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !screenshot)}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant
