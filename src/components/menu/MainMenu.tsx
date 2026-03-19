import React from 'react';
import './MainMenu.css';

interface MainMenuProps {
  onNavigate: (view: 'knowledge' | 'graph' | 'formulas' | 'calculator') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  return (
    <div className="main-menu">
      {/* 装饰性背景 */}
      <div className="menu-bg-pattern"></div>
      
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

        {/* 知识图谱 */}
        <div className="menu-card graph-card" onClick={() => onNavigate('graph')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="12" cy="18" r="3" />
              <path d="M8.5 7.5L10.5 16M15.5 7.5L13.5 16M7 8.5L15.5 8.5" />
            </svg>
          </div>
          <div className="card-content">
            <h3>知识图谱</h3>
            <p>知识关联，学习路径</p>
            <span className="card-tag developing">开发中</span>
          </div>
          <div className="card-arrow disabled">
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
            <span className="card-tag developing">开发中</span>
          </div>
          <div className="card-arrow disabled">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 计算器 */}
        <div className="menu-card calculator-card" onClick={() => onNavigate('calculator')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h8" />
            </svg>
          </div>
          <div className="card-content">
            <h3>数学计算器</h3>
            <p>求导积分，可视化计算</p>
            <span className="card-tag available">已上线</span>
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
