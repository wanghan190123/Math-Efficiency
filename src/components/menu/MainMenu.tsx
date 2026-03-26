import React, { useState } from 'react';
import './MainMenu.css';

interface ResourceLink {
  id: string;
  name: string;
  url: string;
  description: string;
}

const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: 'songhao',
    name: '宋浩老师主页',
    url: 'https://space.bilibili.com/66607740?spm_id_from=333.337.0.0',
    description: 'B站高等数学教学视频'
  },
  {
    id: 'geogebra',
    name: 'GeoGebra网页版',
    url: 'https://www.geogebra.org/calculator',
    description: '在线数学图形计算器'
  }
];

interface MainMenuProps {
  onNavigate: (view: 'knowledge' | 'concepts' | 'formulas' | 'derivation' | 'hidden-gems' | 'question-bank') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const [showResources, setShowResources] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="main-menu">
      {/* 装饰性背景 */}
      <div className="menu-bg-pattern"></div>
      
      {/* 资源链接按钮 */}
      <div className="resource-link-btn" onClick={() => setShowResources(!showResources)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span>资源链接</span>
      </div>

      {/* 资源链接弹窗 */}
      {showResources && (
        <div className="resource-popup">
          <div className="resource-popup-header">
            <h3>资源链接</h3>
            <button className="close-popup" onClick={() => setShowResources(false)}>✕</button>
          </div>
          <div className="resource-list">
            {RESOURCE_LINKS.map(resource => (
              <div key={resource.id} className="resource-item">
                <div className="resource-info">
                  <span className="resource-name">{resource.name}</span>
                  <span className="resource-desc">{resource.description}</span>
                </div>
                <button 
                  className={`copy-btn ${copiedId === resource.id ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(resource.url, resource.id)}
                >
                  {copiedId === resource.id ? '已复制' : '复制链接'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 标题区域 */}
      <div className="menu-header">
        <div className="menu-title-wrapper">
          <div className="menu-title-decoration left"></div>
          <h1 className="menu-title">Math Efficiency</h1>
          <div className="menu-title-decoration right"></div>
        </div>
        <p className="menu-subtitle">高等数学学习助手</p>
        <p className="menu-description">让抽象概念变得可视、可感、可理解</p>
      </div>

      {/* 功能卡片区域 */}
      <div className="menu-cards">
        {/* 知识点学习 */}
        <div className="menu-card knowledge-card" onClick={() => onNavigate('knowledge')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="card-content">
            <h3>知识点学习</h3>
            <p>五维展示，动态演示</p>
            <span className="card-tag available">已上线</span>
          </div>
          <div className="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 概念定理 */}
        <div className="menu-card graph-card" onClick={() => onNavigate('concepts')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="card-content">
            <h3>概念定理</h3>
            <p>严格定义+白话解释</p>
            <span className="card-tag available">已上线</span>
          </div>
          <div className="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 公式手册 */}
        <div className="menu-card formula-card" onClick={() => onNavigate('formulas')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 7h6m-6 4h6m-6 4h4m-7 6h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>公式手册</h3>
            <p>常用公式，快速查阅</p>
            <span className="card-tag available">已上线</span>
          </div>
          <div className="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 公式推导 */}
        <div className="menu-card derivation-card" onClick={() => onNavigate('derivation')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
              <path d="M17 14v6M14 17h6" />
            </svg>
          </div>
          <div className="card-content">
            <h3>公式推导</h3>
            <p>公式由来，推导过程</p>
            <span className="card-tag developing">开发中</span>
          </div>
          <div className="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 沧海遗珠 */}
        <div className="menu-card hidden-gems-card" onClick={() => onNavigate('hidden-gems')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>沧海遗珠</h3>
            <p>容易被忽略的知识点</p>
            <span className="card-tag pending">待开发</span>
          </div>
          <div className="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 题库 */}
        <div className="menu-card question-bank-card" onClick={() => onNavigate('question-bank')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="card-content">
            <h3>题库</h3>
            <p>海量题目，专项训练</p>
            <span className="card-tag pending">待开发</span>
          </div>
          <div className="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="menu-footer">
        <div className="footer-quote">
          <span className="quote-mark">"</span>
          数学是人类智慧的皇冠
          <span className="quote-mark">"</span>
        </div>
        <div className="footer-info">
          <span>版本 1.0.0</span>
          <span className="divider">|</span>
          <span>面向大学生的高效学习工具</span>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
