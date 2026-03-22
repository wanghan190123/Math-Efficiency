import React, { useState, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './FormulaDerivation.css';

// 数学公式渲染组件
const MathFormula: React.FC<{ latex: string; displayMode?: boolean }> = ({ latex, displayMode = false }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
      });
    } catch (e) {
      return `<span style="color: red;">公式解析错误</span>`;
    }
  }, [latex, displayMode]);

  return <span className="math-formula-wrapper" dangerouslySetInnerHTML={{ __html: html }} />;
};

// 推导步骤
interface DerivationStep {
  id: string;
  title: string;
  latex: string;
  explanation: string;
}

// 公式推导项
interface DerivationItem {
  id: string;
  title: string;
  description: string;
  finalFormula: string;
  steps: DerivationStep[];
  applications: string[];
}

// 微分方程公式推导数据
const DIFFERENTIAL_EQUATIONS_DERIVATIONS: DerivationItem[] = [
  {
    id: 'separable',
    title: '可分离变量微分方程',
    description: '形如 dy/dx = f(x)g(y) 的方程，通过分离变量求解',
    finalFormula: '\\int \\frac{dy}{g(y)} = \\int f(x)dx + C',
    steps: [
      {
        id: 's1',
        title: '原方程形式',
        latex: '\\frac{dy}{dx} = f(x) \\cdot g(y)',
        explanation: '等式右边可以分解为只含x的函数和只含y的函数的乘积'
      },
      {
        id: 's2',
        title: '分离变量',
        latex: '\\frac{dy}{g(y)} = f(x)dx',
        explanation: '将含y的部分移到左边，含x的部分移到右边（假设 g(y) ≠ 0）'
      },
      {
        id: 's3',
        title: '两边积分',
        latex: '\\int \\frac{dy}{g(y)} = \\int f(x)dx + C',
        explanation: '对两边同时积分，注意右边的常数可以合并为一个任意常数C'
      },
      {
        id: 's4',
        title: '求出通解',
        latex: 'G(y) = F(x) + C',
        explanation: '其中 G(y) 是 1/g(y) 的原函数，F(x) 是 f(x) 的原函数'
      }
    ],
    applications: [
      'dy/dx = xy → y = Ce^(x²/2)',
      'dy/dx = e^(x+y) → e^(-y) = -e^x + C',
      '人口增长模型 dP/dt = kP'
    ]
  },
  {
    id: 'first-order-linear',
    title: '一阶线性微分方程通解公式',
    description: '形如 dy/dx + P(x)y = Q(x) 的方程，使用常数变易法求解',
    finalFormula: 'y = e^{-\\int P(x)dx}\\left[\\int Q(x)e^{\\int P(x)dx}dx + C\\right]',
    steps: [
      {
        id: 'l1',
        title: '标准形式',
        latex: '\\frac{dy}{dx} + P(x)y = Q(x)',
        explanation: '一阶线性微分方程的标准形式，P(x)和Q(x)是已知的连续函数'
      },
      {
        id: 'l2',
        title: '先解齐次方程',
        latex: '\\frac{dy}{dx} + P(x)y = 0',
        explanation: '先忽略右边的Q(x)，求解对应的齐次方程'
      },
      {
        id: 'l3',
        title: '分离变量求解',
        latex: '\\frac{dy}{y} = -P(x)dx',
        explanation: '这是可分离变量的方程，两边分别积分'
      },
      {
        id: 'l4',
        title: '齐次方程通解',
        latex: 'y = Ce^{-\\int P(x)dx}',
        explanation: '积分后得到齐次方程的通解，其中C是任意常数'
      },
      {
        id: 'l5',
        title: '常数变易法',
        latex: '设 C = C(x)，即 y = C(x)e^{-\\int P(x)dx}',
        explanation: '将常数C换成函数C(x)，这是常数变易法的核心思想'
      },
      {
        id: 'l6',
        title: '代入原方程',
        latex: "C'(x)e^{-\\int P(x)dx} = Q(x)",
        explanation: '对y求导后代入原方程，化简后得到C\'(x)的表达式'
      },
      {
        id: 'l7',
        title: '求出C(x)',
        latex: 'C(x) = \\int Q(x)e^{\\int P(x)dx}dx + C',
        explanation: '对C\'(x)积分得到C(x)'
      },
      {
        id: 'l8',
        title: '通解公式',
        latex: 'y = e^{-\\int P(x)dx}\\left[\\int Q(x)e^{\\int P(x)dx}dx + C\\right]',
        explanation: '将C(x)代回，得到一阶线性微分方程的通解公式'
      }
    ],
    applications: [
      'dy/dx + 2y = e^x → y = (1/3)e^x + Ce^(-2x)',
      'dy/dx - y/x = x² → y = x³ + Cx',
      'RL电路电流方程'
    ]
  },
  {
    id: 'second-order-homogeneous',
    title: '二阶常系数齐次线性微分方程',
    description: '形如 y\'\' + py\' + qy = 0 的方程，使用特征方程法求解',
    finalFormula: 'y = C_1 e^{r_1 x} + C_2 e^{r_2 x}（相异实根）',
    steps: [
      {
        id: 'h1',
        title: '方程形式',
        latex: "y'' + py' + qy = 0",
        explanation: 'p和q是常数，这是二阶常系数齐次线性微分方程'
      },
      {
        id: 'h2',
        title: '试探解',
        latex: '设 y = e^{rx}（r为待定常数）',
        explanation: '由于指数函数求导后仍为指数函数，设y = e^(rx)为试探解'
      },
      {
        id: 'h3',
        title: '代入方程',
        latex: "r^2 e^{rx} + pr \\cdot e^{rx} + q \\cdot e^{rx} = 0",
        explanation: "y' = re^(rx), y'' = r²e^(rx)，代入原方程"
      },
      {
        id: 'h4',
        title: '特征方程',
        latex: 'r^2 + pr + q = 0',
        explanation: '提取公因子e^(rx)（不为零），得到特征方程'
      },
      {
        id: 'h5',
        title: '判别式分析',
        latex: '\\Delta = p^2 - 4q',
        explanation: '根据判别式的符号，特征根有三种情况'
      },
      {
        id: 'h6',
        title: '情况一：相异实根 (Δ>0)',
        latex: 'y = C_1 e^{r_1 x} + C_2 e^{r_2 x}',
        explanation: '两个不同的实根r₁和r₂，通解为两个线性无关解的线性组合'
      },
      {
        id: 'h7',
        title: '情况二：相等实根 (Δ=0)',
        latex: 'y = (C_1 + C_2 x) e^{rx}',
        explanation: '重根r，需要找到另一个线性无关解，通解为(C₁ + C₂x)e^(rx)'
      },
      {
        id: 'h8',
        title: '情况三：共轭复根 (Δ<0)',
        latex: 'y = e^{\\alpha x}(C_1 \\cos\\beta x + C_2 \\sin\\beta x)',
        explanation: '复根 r = α ± βi，利用欧拉公式得到实数形式的通解'
      }
    ],
    applications: [
      "y'' - 3y' + 2y = 0 → y = C₁e^x + C₂e^(2x)",
      "y'' - 4y' + 4y = 0 → y = (C₁ + C₂x)e^(2x)",
      "y'' + 4y = 0 → y = C₁cos(2x) + C₂sin(2x)",
      '弹簧振子运动方程'
    ]
  },
  {
    id: 'second-order-nonhomogeneous',
    title: '二阶常系数非齐次线性微分方程',
    description: '形如 y\'\' + py\' + qy = f(x) 的方程，使用叠加原理求解',
    finalFormula: 'y = y_h + y_p（通解 = 齐次通解 + 特解）',
    steps: [
      {
        id: 'n1',
        title: '方程形式',
        latex: "y'' + py' + qy = f(x)",
        explanation: 'f(x) ≠ 0，是非齐次方程'
      },
      {
        id: 'n2',
        title: '解的结构定理',
        latex: 'y = y_h + y_p',
        explanation: '通解 = 对应齐次方程的通解 + 非齐次方程的一个特解'
      },
      {
        id: 'n3',
        title: '求齐次通解',
        latex: 'y_h = C_1 y_1 + C_2 y_2',
        explanation: '用特征方程法求出齐次方程的通解'
      },
      {
        id: 'n4',
        title: '待定系数法求特解（f(x)=P_m(x)e^{λx}型）',
        latex: '设 y_p = x^k Q_m(x) e^{\\lambda x}',
        explanation: 'k是λ作为特征根的重数（不是特征根k=0，单根k=1，重根k=2）'
      },
      {
        id: 'n5',
        title: '待定系数法求特解（f(x)=e^{λx}[P_l(x)cosβx + P_n(x)sinβx]型）',
        latex: '设 y_p = x^k e^{\\lambda x}[R_m^{(1)}(x)\\cos\\beta x + R_m^{(2)}(x)\\sin\\beta x]',
        explanation: 'k是λ+βi是否为特征根（不是k=0，是则k=1），m=max(l,n)'
      },
      {
        id: 'n6',
        title: '叠加原理',
        latex: 'f(x) = f_1(x) + f_2(x) \\Rightarrow y_p = y_{p1} + y_{p2}',
        explanation: '如果f(x)是多个函数之和，可以分别求特解再相加'
      }
    ],
    applications: [
      "y'' + y = e^x → y = C₁cosx + C₂sinx + e^x/2",
      "y'' - 2y' + y = xe^x → y = (C₁ + C₂x)e^x + x³e^x/6",
      "y'' + y = sinx → y = C₁cosx + C₂sinx - xcosx/2"
    ]
  },
  {
    id: 'euler-method',
    title: '可降阶的高阶微分方程',
    description: '几种特殊类型的高阶方程，通过变量代换降低阶数',
    finalFormula: '设 p = y\'，将 y\'\' = p(dp/dy) 代入',
    steps: [
      {
        id: 'e1',
        title: '类型一：y^(n) = f(x)',
        latex: '连续积分n次',
        explanation: '直接积分n次，每次积分产生一个任意常数'
      },
      {
        id: 'e2',
        title: '类型二：y\'\' = f(x, y\')',
        latex: "设 p = y'，则 y'' = p'",
        explanation: '不含y的方程，设p=y\'可降为一阶方程dp/dx = f(x,p)'
      },
      {
        id: 'e3',
        title: '类型三：y\'\' = f(y, y\')',
        latex: "设 p = y'，则 y'' = p\\frac{dp}{dy}",
        explanation: '不含x的方程，将y看作自变量，p=dy/dx则d²y/dx² = p(dp/dy)'
      },
      {
        id: 'e4',
        title: '降阶后的方程',
        latex: 'p\\frac{dp}{dy} = f(y, p)',
        explanation: '这是关于p和y的一阶方程，解出p后再积分求y'
      }
    ],
    applications: [
      "y''' = e^x → y = e^x + C₁x² + C₂x + C₃",
      "y'' = xy' → y = C₁e^(x²/2) + C₂",
      "yy'' - (y')² = 0 → y = C₁e^(C₂x)"
    ]
  }
];

// 章节数据
const CHAPTERS = [
  { id: 'differential-equations', name: '微分方程', icon: '📐' },
];

// 获取对应章节的推导内容
const getDerivationsByChapter = (chapterId: string): DerivationItem[] => {
  if (chapterId === 'differential-equations') {
    return DIFFERENTIAL_EQUATIONS_DERIVATIONS;
  }
  return [];
};

const FormulaDerivation: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('differential-equations');
  const [expandedDerivation, setExpandedDerivation] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const derivations = getDerivationsByChapter(activeChapter);

  const toggleDerivation = (id: string) => {
    setExpandedDerivation(expandedDerivation === id ? null : id);
    setExpandedSteps(new Set());
  };

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="derivation-container">
      {/* 左侧章节列表 */}
      <div className="derivation-sidebar">
        <div className="sidebar-header">
          <h3>公式推导</h3>
        </div>
        <div className="chapter-list">
          {CHAPTERS.map(chapter => (
            <div
              key={chapter.id}
              className={`chapter-item ${activeChapter === chapter.id ? 'active' : ''}`}
              onClick={() => {
                setActiveChapter(chapter.id);
                setExpandedDerivation(null);
              }}
            >
              <span className="chapter-icon">{chapter.icon}</span>
              <span className="chapter-name">{chapter.name}</span>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <p>更多章节开发中...</p>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="derivation-content">
        <div className="content-header">
          <h2>{CHAPTERS.find(c => c.id === activeChapter)?.name} - 公式推导</h2>
          <p className="header-desc">点击展开查看详细推导过程</p>
        </div>

        <div className="derivation-list">
          {derivations.map(item => (
            <div key={item.id} className="derivation-card">
              <div 
                className="derivation-header"
                onClick={() => toggleDerivation(item.id)}
              >
                <div className="header-left">
                  <span className={`expand-icon ${expandedDerivation === item.id ? 'expanded' : ''}`}>
                    ▶
                  </span>
                  <h3>{item.title}</h3>
                </div>
                <div className="final-formula-preview">
                  <MathFormula latex={item.finalFormula} />
                </div>
              </div>

              {expandedDerivation === item.id && (
                <div className="derivation-body">
                  <p className="derivation-desc">{item.description}</p>

                  <div className="steps-container">
                    <h4>推导过程：</h4>
                    {item.steps.map((step, index) => (
                      <div key={step.id} className="step-item">
                        <div 
                          className="step-header"
                          onClick={() => toggleStep(step.id)}
                        >
                          <span className="step-number">{index + 1}</span>
                          <span className="step-title">{step.title}</span>
                          <span className={`step-toggle ${expandedSteps.has(step.id) ? 'expanded' : ''}`}>
                            ▼
                          </span>
                        </div>
                        
                        {expandedSteps.has(step.id) && (
                          <div className="step-content">
                            <div className="step-formula">
                              <MathFormula latex={step.latex} displayMode />
                            </div>
                            <p className="step-explanation">{step.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="final-result">
                    <h4>最终公式：</h4>
                    <div className="final-formula">
                      <MathFormula latex={item.finalFormula} displayMode />
                    </div>
                  </div>

                  <div className="applications">
                    <h4>应用示例：</h4>
                    <ul>
                      {item.applications.map((app, index) => (
                        <li key={index}>
                          <MathFormula latex={app} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormulaDerivation;
