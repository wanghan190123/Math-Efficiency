import React, { useState, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './FormulaBook.css';

// 数学公式渲染组件
const MathFormula: React.FC<{ latex: string; displayMode?: boolean }> = ({ latex, displayMode = false }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
        fleqn: false,
        strict: false,
      });
    } catch (e) {
      return `<span style="color: red;">公式解析错误</span>`;
    }
  }, [latex, displayMode]);

  return <span className="math-formula-wrapper" dangerouslySetInnerHTML={{ __html: html }} />;
};

// 公式数据结构
interface Formula {
  id: string;
  name: string;
  latex: string;
  description: string;
  category: string;
  tags: string[];
  example?: string;
}

// 公式分类
interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: { id: string; name: string }[];
}

// 公式数据
const FORMULAS: Formula[] = [
  // ===== 代数 =====
  {
    id: 'alg-1',
    name: '完全平方公式',
    latex: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2',
    description: '两数和（差）的平方，等于它们的平方和加上（减去）它们积的2倍',
    category: 'algebra',
    tags: ['平方', '展开', '基础'],
    example: '(x+3)² = x² + 6x + 9'
  },
  {
    id: 'alg-2',
    name: '平方差公式',
    latex: 'a^2 - b^2 = (a+b)(a-b)',
    description: '两数平方之差，等于这两数和与差的积',
    category: 'algebra',
    tags: ['平方', '因式分解', '基础'],
    example: 'x² - 9 = (x+3)(x-3)'
  },
  {
    id: 'alg-3',
    name: '立方和公式',
    latex: 'a^3 + b^3 = (a+b)(a^2 - ab + b^2)',
    description: '两数立方之和的因式分解',
    category: 'algebra',
    tags: ['立方', '因式分解'],
    example: 'x³ + 8 = (x+2)(x² - 2x + 4)'
  },
  {
    id: 'alg-4',
    name: '立方差公式',
    latex: 'a^3 - b^3 = (a-b)(a^2 + ab + b^2)',
    description: '两数立方之差的因式分解',
    category: 'algebra',
    tags: ['立方', '因式分解'],
    example: 'x³ - 1 = (x-1)(x² + x + 1)'
  },
  {
    id: 'alg-5',
    name: '二项式定理',
    latex: '(a+b)^n = \\sum_{k=0}^{n} C_n^k a^{n-k}b^k',
    description: '二项式展开的一般形式，C_n^k为二项式系数',
    category: 'algebra',
    tags: ['二项式', '组合', '高级'],
    example: '(x+1)³ = C₃⁰x³ + C₃¹x² + C₃²x + C₃¹ = x³ + 3x² + 3x + 1'
  },
  {
    id: 'alg-6',
    name: '一元二次方程求根公式',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    description: 'ax² + bx + c = 0 的求根公式，判别式 Δ = b² - 4ac',
    category: 'algebra',
    tags: ['方程', '二次', '基础'],
    example: 'x² - 5x + 6 = 0 → x = (5 ± 1)/2 → x₁=3, x₂=2'
  },
  
  // ===== 三角函数 =====
  {
    id: 'tri-1',
    name: '同角三角函数关系',
    latex: '\\sin^2\\alpha + \\cos^2\\alpha = 1',
    description: '正弦与余弦的平方和等于1，是最基本的三角恒等式',
    category: 'trigonometry',
    tags: ['基础', '恒等式'],
    example: '已知sinα=3/5，则cosα=±4/5'
  },
  {
    id: 'tri-2',
    name: '正切关系',
    latex: '\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}',
    description: '正切等于正弦除以余弦',
    category: 'trigonometry',
    tags: ['基础', '正切'],
    example: 'tan45° = sin45°/cos45° = 1'
  },
  {
    id: 'tri-3',
    name: '二倍角公式（正弦）',
    latex: '\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha',
    description: '正弦的二倍角公式',
    category: 'trigonometry',
    tags: ['倍角', '变换'],
    example: 'sin60° = 2sin30°cos30° = 2×(1/2)×(√3/2) = √3/2'
  },
  {
    id: 'tri-4',
    name: '二倍角公式（余弦）',
    latex: '\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = 2\\cos^2\\alpha - 1 = 1 - 2\\sin^2\\alpha',
    description: '余弦的二倍角公式，有三种等价形式',
    category: 'trigonometry',
    tags: ['倍角', '变换'],
    example: 'cos60° = 2cos²30° - 1 = 2×(3/4) - 1 = 1/2'
  },
  {
    id: 'tri-5',
    name: '二倍角公式（正切）',
    latex: '\\tan 2\\alpha = \\frac{2\\tan\\alpha}{1-\\tan^2\\alpha}',
    description: '正切的二倍角公式',
    category: 'trigonometry',
    tags: ['倍角', '正切'],
    example: 'tan90° 不存在（分母为0）'
  },
  {
    id: 'tri-6',
    name: '半角公式（正弦）',
    latex: '\\sin\\frac{\\alpha}{2} = \\pm\\sqrt{\\frac{1-\\cos\\alpha}{2}}',
    description: '正弦的半角公式，符号由α/2所在象限决定',
    category: 'trigonometry',
    tags: ['半角', '根式'],
    example: 'sin22.5° = √[(1-cos45°)/2] = √[(1-√2/2)/2]'
  },
  {
    id: 'tri-7',
    name: '半角公式（余弦）',
    latex: '\\cos\\frac{\\alpha}{2} = \\pm\\sqrt{\\frac{1+\\cos\\alpha}{2}}',
    description: '余弦的半角公式',
    category: 'trigonometry',
    tags: ['半角', '根式'],
    example: 'cos15° = √[(1+cos30°)/2] = √[(1+√3/2)/2]'
  },
  {
    id: 'tri-8',
    name: '和角公式（正弦）',
    latex: '\\sin(\\alpha+\\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta',
    description: '两角和的正弦公式',
    category: 'trigonometry',
    tags: ['和角', '基础'],
    example: 'sin75° = sin(45°+30°) = sin45°cos30° + cos45°sin30°'
  },
  {
    id: 'tri-9',
    name: '和角公式（余弦）',
    latex: '\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta',
    description: '两角和的余弦公式',
    category: 'trigonometry',
    tags: ['和角', '基础'],
    example: 'cos75° = cos(45°+30°) = cos45°cos30° - sin45°sin30°'
  },
  {
    id: 'tri-10',
    name: '正弦定理',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
    description: '三角形边长与对角正弦的比值相等，R为外接圆半径',
    category: 'trigonometry',
    tags: ['三角形', '定理', '重要'],
    example: '已知a=10, A=30°, B=45°, 求b: b = a×sinB/sinA'
  },
  {
    id: 'tri-11',
    name: '余弦定理',
    latex: 'a^2 = b^2 + c^2 - 2bc\\cos A',
    description: '三角形任意一边的平方等于其他两边平方和减去它们积的2倍与夹角余弦的乘积',
    category: 'trigonometry',
    tags: ['三角形', '定理', '重要'],
    example: '已知三边求角：cosA = (b²+c²-a²)/(2bc)'
  },
  
  // ===== 几何 =====
  {
    id: 'geo-1',
    name: '三角形面积',
    latex: 'S = \\frac{1}{2}ah = \\frac{1}{2}ab\\sin C = \\sqrt{p(p-a)(p-b)(p-c)}',
    description: '三角形面积公式：底×高÷2；两边及其夹角；海伦公式（p为半周长）',
    category: 'geometry',
    tags: ['三角形', '面积', '基础'],
    example: '三边为3,4,5的直角三角形，S=3×4/2=6'
  },
  {
    id: 'geo-2',
    name: '圆的面积与周长',
    latex: 'S = \\pi r^2, \\quad C = 2\\pi r',
    description: '圆的面积等于π乘半径的平方，周长等于2π乘半径',
    category: 'geometry',
    tags: ['圆', '面积', '周长'],
    example: 'r=3的圆，S=9π，C=6π'
  },
  {
    id: 'geo-3',
    name: '扇形面积与弧长',
    latex: 'S = \\frac{1}{2}r^2\\theta = \\frac{1}{2}rl, \\quad l = r\\theta',
    description: 'θ为圆心角（弧度），l为弧长',
    category: 'geometry',
    tags: ['扇形', '面积', '弧长'],
    example: 'r=4, θ=π/3的扇形，S=1/2×16×π/3=8π/3'
  },
  {
    id: 'geo-4',
    name: '球的体积与表面积',
    latex: 'V = \\frac{4}{3}\\pi r^3, \\quad S = 4\\pi r^2',
    description: '球的体积和表面积公式',
    category: 'geometry',
    tags: ['球', '体积', '表面积'],
    example: 'r=3的球，V=36π，S=36π'
  },
  {
    id: 'geo-5',
    name: '圆柱体积与表面积',
    latex: 'V = \\pi r^2 h, \\quad S = 2\\pi r^2 + 2\\pi rh',
    description: '圆柱的体积和表面积，h为高',
    category: 'geometry',
    tags: ['圆柱', '体积', '表面积'],
    example: 'r=2, h=5的圆柱，V=20π，S=28π'
  },
  {
    id: 'geo-6',
    name: '圆锥体积与侧面积',
    latex: 'V = \\frac{1}{3}\\pi r^2 h, \\quad S_{侧} = \\pi rl',
    description: '圆锥体积等于底面积乘高除以3，l为母线长',
    category: 'geometry',
    tags: ['圆锥', '体积', '侧面积'],
    example: 'r=3, h=4, l=5的圆锥，V=12π，S侧=15π'
  },
  {
    id: 'geo-7',
    name: '两点间距离公式',
    latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
    description: '平面直角坐标系中两点间的距离',
    category: 'geometry',
    tags: ['坐标', '距离', '解析几何'],
    example: 'A(1,2), B(4,6)的距离 = √[(4-1)²+(6-2)²] = 5'
  },
  {
    id: 'geo-8',
    name: '点到直线距离',
    latex: 'd = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2+B^2}}',
    description: '点(x₀,y₀)到直线Ax+By+C=0的距离',
    category: 'geometry',
    tags: ['坐标', '距离', '直线'],
    example: '点(1,1)到直线3x+4y-5=0的距离 = |3+4-5|/5 = 2/5'
  },
  
  // ===== 微积分 =====
  {
    id: 'calc-1',
    name: '导数定义',
    latex: "f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}",
    description: '函数在某点的导数是函数在该点切线的斜率',
    category: 'calculus',
    tags: ['导数', '定义', '极限'],
    example: "f(x)=x², f'(x)=2x"
  },
  {
    id: 'calc-2',
    name: '基本导数公式',
    latex: "(x^n)' = nx^{n-1}, \\quad (e^x)' = e^x, \\quad (\\ln x)' = \\frac{1}{x}",
    description: '幂函数、指数函数、对数函数的导数',
    category: 'calculus',
    tags: ['导数', '公式', '基础'],
    example: "(x³)' = 3x², (e^x)' = e^x"
  },
  {
    id: 'calc-3',
    name: '三角函数导数',
    latex: "(\\sin x)' = \\cos x, \\quad (\\cos x)' = -\\sin x, \\quad (\\tan x)' = \\sec^2 x",
    description: '正弦、余弦、正切函数的导数',
    category: 'calculus',
    tags: ['导数', '三角函数'],
    example: "(sin x)' = cos x"
  },
  {
    id: 'calc-4',
    name: '求导法则',
    latex: "[f(x)\\pm g(x)]' = f'(x)\\pm g'(x), \\quad [f(x)g(x)]' = f'g + fg'",
    description: '和差法则与乘积法则',
    category: 'calculus',
    tags: ['导数', '法则', '基础'],
    example: "(x²·sin x)' = 2x·sin x + x²·cos x"
  },
  {
    id: 'calc-5',
    name: '链式法则',
    latex: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
    description: '复合函数求导法则',
    category: 'calculus',
    tags: ['导数', '复合函数', '重要'],
    example: "(sin x²)' = cos x² · 2x"
  },
  {
    id: 'calc-6',
    name: '定积分定义',
    latex: '\\int_a^b f(x)dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i)\\Delta x',
    description: '定积分是曲线下的面积',
    category: 'calculus',
    tags: ['积分', '定义', '极限'],
    example: '∫₀¹ x dx = 1/2'
  },
  {
    id: 'calc-7',
    name: '牛顿-莱布尼茨公式',
    latex: '\\int_a^b f(x)dx = F(b) - F(a)',
    description: '定积分等于原函数在积分上下限之差',
    category: 'calculus',
    tags: ['积分', '定理', '重要'],
    example: '∫₀² x² dx = [x³/3]₀² = 8/3'
  },
  {
    id: 'calc-8',
    name: '基本积分公式',
    latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1}+C, \\quad \\int e^x dx = e^x + C, \\quad \\int \\frac{1}{x} dx = \\ln|x| + C',
    description: '幂函数、指数函数、倒数的不定积分',
    category: 'calculus',
    tags: ['积分', '公式', '基础'],
    example: '∫x² dx = x³/3 + C'
  },
  {
    id: 'calc-9',
    name: '三角函数积分',
    latex: '\\int \\sin x dx = -\\cos x + C, \\quad \\int \\cos x dx = \\sin x + C',
    description: '正弦、余弦的不定积分',
    category: 'calculus',
    tags: ['积分', '三角函数'],
    example: '∫sin x dx = -cos x + C'
  },
  {
    id: 'calc-10',
    name: '分部积分法',
    latex: '\\int u dv = uv - \\int v du',
    description: '分部积分公式，适用于乘积形式的积分',
    category: 'calculus',
    tags: ['积分', '方法', '重要'],
    example: '∫x·eˣ dx = x·eˣ - ∫eˣ dx = x·eˣ - eˣ + C'
  },
  
  // ===== 数列 =====
  {
    id: 'seq-1',
    name: '等差数列通项公式',
    latex: 'a_n = a_1 + (n-1)d',
    description: '首项为a₁，公差为d的等差数列第n项',
    category: 'sequence',
    tags: ['等差数列', '通项'],
    example: '首项2，公差3的数列第5项：a₅ = 2 + 4×3 = 14'
  },
  {
    id: 'seq-2',
    name: '等差数列求和公式',
    latex: 'S_n = \\frac{n(a_1 + a_n)}{2} = \\frac{n[2a_1 + (n-1)d]}{2}',
    description: '等差数列前n项和',
    category: 'sequence',
    tags: ['等差数列', '求和'],
    example: '1+2+...+100 = 100×(1+100)/2 = 5050'
  },
  {
    id: 'seq-3',
    name: '等比数列通项公式',
    latex: 'a_n = a_1 \\cdot q^{n-1}',
    description: '首项为a₁，公比为q的等比数列第n项',
    category: 'sequence',
    tags: ['等比数列', '通项'],
    example: '首项2，公比3的数列第4项：a₄ = 2×3³ = 54'
  },
  {
    id: 'seq-4',
    name: '等比数列求和公式',
    latex: 'S_n = \\frac{a_1(1-q^n)}{1-q} (q \\neq 1)',
    description: '等比数列前n项和',
    category: 'sequence',
    tags: ['等比数列', '求和'],
    example: '1+2+4+8 = (1-2⁴)/(1-2) = 15'
  },
  {
    id: 'seq-5',
    name: '无穷等比数列求和',
    latex: 'S = \\frac{a_1}{1-q} (|q| < 1)',
    description: '公比绝对值小于1时，无穷等比数列的和',
    category: 'sequence',
    tags: ['等比数列', '极限'],
    example: '1 + 1/2 + 1/4 + ... = 1/(1-1/2) = 2'
  },
  
  // ===== 概率统计 =====
  {
    id: 'prob-1',
    name: '排列数公式',
    latex: 'A_n^m = \\frac{n!}{(n-m)!} = n(n-1)\\cdots(n-m+1)',
    description: '从n个不同元素中取m个的排列数',
    category: 'probability',
    tags: ['排列', '组合'],
    example: 'A₅³ = 5×4×3 = 60'
  },
  {
    id: 'prob-2',
    name: '组合数公式',
    latex: 'C_n^m = \\frac{n!}{m!(n-m)!}',
    description: '从n个不同元素中取m个的组合数',
    category: 'probability',
    tags: ['组合', '基础'],
    example: 'C₅² = 5!/(2!×3!) = 10'
  },
  {
    id: 'prob-3',
    name: '二项分布',
    latex: 'P(X=k) = C_n^k p^k (1-p)^{n-k}',
    description: 'n次独立重复试验中事件A恰好发生k次的概率',
    category: 'probability',
    tags: ['分布', '概率'],
    example: '抛硬币3次恰好2次正面：C₃²(0.5)²(0.5)¹ = 3/8'
  },
  {
    id: 'prob-4',
    name: '期望公式',
    latex: 'E(X) = \\sum_{i=1}^{n} x_i p_i',
    description: '离散型随机变量的期望（均值）',
    category: 'probability',
    tags: ['期望', '统计'],
    example: '掷骰子期望：1×1/6 + 2×1/6 + ... + 6×1/6 = 3.5'
  },
  {
    id: 'prob-5',
    name: '方差公式',
    latex: 'D(X) = E(X^2) - [E(X)]^2 = \\sum_{i=1}^{n} (x_i - \\mu)^2 p_i',
    description: '衡量随机变量与其期望的偏离程度',
    category: 'probability',
    tags: ['方差', '统计'],
    example: '掷骰子方差：E(X²)-E(X)² = 91/6 - (7/2)² = 35/12'
  },
  
  // ===== 多元函数微分法 =====
  {
    id: 'md-1',
    name: '偏导数定义',
    latex: '\\frac{\\partial f}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x, y) - f(x,y)}{\\Delta x}',
    description: '固定其他变量，对一个变量求导',
    category: 'multivariable-diff',
    tags: ['偏导数', '基础'],
    example: 'f(x,y)=x²y → ∂f/∂x=2xy'
  },
  {
    id: 'md-2',
    name: '全微分',
    latex: 'dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy',
    description: '函数增量的线性主部',
    category: 'multivariable-diff',
    tags: ['全微分', '基础'],
    example: 'z=x²y → dz=2xydx+x²dy'
  },
  {
    id: 'md-3',
    name: '链式法则（全导数）',
    latex: '\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}',
    description: 'z=f(x,y), x=x(t), y=y(t) 的情况',
    category: 'multivariable-diff',
    tags: ['链式法则', '复合函数'],
    example: 'z=x²+y², x=t, y=t² → dz/dt=2t+2t³'
  },
  {
    id: 'md-4',
    name: '链式法则（偏导数）',
    latex: '\\frac{\\partial z}{\\partial x} = \\frac{\\partial z}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial z}{\\partial v}\\frac{\\partial v}{\\partial x}',
    description: 'z=f(u,v), u=u(x,y), v=v(x,y) 的情况',
    category: 'multivariable-diff',
    tags: ['链式法则', '复合函数'],
    example: '沿每个路径求导再相加'
  },
  {
    id: 'md-5',
    name: '隐函数求导公式',
    latex: '\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}, \\quad \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}',
    description: 'F(x,y,z)=0 确定的隐函数 z=z(x,y)',
    category: 'multivariable-diff',
    tags: ['隐函数', '求导'],
    example: 'x²+y²+z²=1 → ∂z/∂x=-x/z'
  },
  {
    id: 'md-6',
    name: '方向导数',
    latex: '\\frac{\\partial f}{\\partial l} = \\frac{\\partial f}{\\partial x}\\cos\\alpha + \\frac{\\partial f}{\\partial y}\\cos\\beta',
    description: '函数沿方向 l 的变化率，l⁰=(cosα,cosβ)',
    category: 'multivariable-diff',
    tags: ['方向导数', '梯度'],
    example: 'f=x²+y², 沿(1,0)方向在(1,1): ∂f/∂l=2'
  },
  {
    id: 'md-7',
    name: '梯度',
    latex: '\\nabla f = \\text{grad} f = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)',
    description: '梯度方向是函数增长最快的方向，模长等于最大方向导数',
    category: 'multivariable-diff',
    tags: ['梯度', '核心'],
    example: 'f=x²+y² → ∇f=(2x,2y)'
  },
  {
    id: 'md-8',
    name: '方向导数与梯度',
    latex: '\\frac{\\partial f}{\\partial l} = \\nabla f \\cdot \\vec{l^0} = |\\nabla f|\\cos\\theta',
    description: '方向导数是梯度在该方向的投影',
    category: 'multivariable-diff',
    tags: ['方向导数', '梯度'],
    example: 'θ=0时最大，θ=π/2时为零'
  },
  {
    id: 'md-9',
    name: '极值必要条件',
    latex: '\\nabla f = 0 \\quad \\text{即} \\quad \\frac{\\partial f}{\\partial x} = \\frac{\\partial f}{\\partial y} = 0',
    description: '极值点必是驻点（梯度为零的点）',
    category: 'multivariable-diff',
    tags: ['极值', '驻点'],
    example: 'f=x²+y² → 驻点(0,0)是极小值点'
  },
  {
    id: 'md-10',
    name: '极值充分条件',
    latex: '\\Delta = AC - B^2, \\quad A = f_{xx}, B = f_{xy}, C = f_{yy}',
    description: 'Δ>0且A>0极小，Δ>0且A<0极大，Δ<0鞍点',
    category: 'multivariable-diff',
    tags: ['极值', '判别'],
    example: 'f=x²-y²: A=2,C=-2,B=0 → Δ=-4<0鞍点'
  },
  {
    id: 'md-11',
    name: '拉格朗日乘数法',
    latex: 'L(x,y,\\lambda) = f(x,y) + \\lambda \\varphi(x,y)',
    description: '求条件极值：目标函数f，约束条件φ=0',
    category: 'multivariable-diff',
    tags: ['条件极值', '优化'],
    example: '求xy在x+y=1下的极值'
  },
  {
    id: 'md-12',
    name: '切平面方程',
    latex: 'z - z_0 = \\frac{\\partial f}{\\partial x}(x-x_0) + \\frac{\\partial f}{\\partial y}(y-y_0)',
    description: '曲面z=f(x,y)在点(x₀,y₀,z₀)处的切平面',
    category: 'multivariable-diff',
    tags: ['切平面', '几何'],
    example: 'f=x²+y²在(0,0,0): z=0'
  },
  {
    id: 'md-13',
    name: '法线方程',
    latex: '\\frac{x-x_0}{f_x} = \\frac{y-y_0}{f_y} = \\frac{z-z_0}{-1}',
    description: '曲面z=f(x,y)在点(x₀,y₀,z₀)处的法线',
    category: 'multivariable-diff',
    tags: ['法线', '几何'],
    example: '梯度方向即为法线方向'
  },
  {
    id: 'md-14',
    name: '二阶混合偏导相等条件',
    latex: '\\frac{\\partial^2 f}{\\partial x \\partial y} = \\frac{\\partial^2 f}{\\partial y \\partial x} \\text{（连续时成立）}',
    description: '若混合偏导数连续，则它们相等',
    category: 'multivariable-diff',
    tags: ['混合偏导', '重要'],
    example: '常见函数都满足此条件'
  },
  {
    id: 'md-15',
    name: '梯度下降算法',
    latex: '\\vec{x}_{new} = \\vec{x}_{old} - \\eta \\nabla f(\\vec{x}_{old})',
    description: '机器学习中的优化算法，η为学习率',
    category: 'multivariable-diff',
    tags: ['优化', '机器学习'],
    example: '沿负梯度方向迭代寻找最小值'
  },
  
  // ===== 向量代数 =====
  {
    id: 'vec-1',
    name: '向量模长',
    latex: '|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}',
    description: '向量在三维空间中的长度',
    category: 'vector',
    tags: ['基础', '模长'],
    example: 'a=(1,2,2) → |a|=√(1+4+4)=3'
  },
  {
    id: 'vec-2',
    name: '向量点积（数量积）',
    latex: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = a_x b_x + a_y b_y + a_z b_z',
    description: '两向量点积等于对应分量乘积之和，或等于模长乘积乘夹角余弦',
    category: 'vector',
    tags: ['点积', '基础'],
    example: 'a=(1,0), b=(0,1) → a·b=0（垂直）'
  },
  {
    id: 'vec-3',
    name: '向量叉积（向量积）',
    latex: '\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{vmatrix}',
    description: '叉积结果是一个向量，垂直于两向量所在平面，模长等于平行四边形面积',
    category: 'vector',
    tags: ['叉积', '高级'],
    example: 'a=(1,0,0), b=(0,1,0) → a×b=(0,0,1)'
  },
  {
    id: 'vec-4',
    name: '叉积模长',
    latex: '|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta',
    description: '叉积模长等于两向量张成的平行四边形面积',
    category: 'vector',
    tags: ['叉积', '面积'],
    example: '|a×b|=1×1×sin90°=1'
  },
  {
    id: 'vec-5',
    name: '向量夹角',
    latex: '\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}',
    description: '通过点积计算两向量的夹角',
    category: 'vector',
    tags: ['夹角', '点积'],
    example: 'a=(1,1), b=(1,0) → cosθ=1/√2, θ=45°'
  },
  {
    id: 'vec-6',
    name: '向量垂直条件',
    latex: '\\vec{a} \\perp \\vec{b} \\Leftrightarrow \\vec{a} \\cdot \\vec{b} = 0',
    description: '两向量点积为零则垂直',
    category: 'vector',
    tags: ['垂直', '判定'],
    example: 'a=(1,0,0), b=(0,1,0) → a·b=0（垂直）'
  },
  {
    id: 'vec-7',
    name: '向量平行条件',
    latex: '\\vec{a} \\parallel \\vec{b} \\Leftrightarrow \\vec{a} \\times \\vec{b} = \\vec{0}',
    description: '两向量叉积为零向量则平行',
    category: 'vector',
    tags: ['平行', '判定'],
    example: 'a=(1,2,3), b=(2,4,6) → a×b=0（平行）'
  },
  {
    id: 'vec-8',
    name: '混合积',
    latex: '[\\vec{a},\\vec{b},\\vec{c}] = (\\vec{a} \\times \\vec{b}) \\cdot \\vec{c} = \\begin{vmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{vmatrix}',
    description: '三向量混合积的绝对值等于平行六面体体积',
    category: 'vector',
    tags: ['混合积', '体积'],
    example: 'a=(1,0,0), b=(0,1,0), c=(0,0,1) → [a,b,c]=1'
  },
  {
    id: 'vec-9',
    name: '向量投影',
    latex: '\\text{proj}_{\\vec{b}}\\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\vec{b}',
    description: '向量a在向量b方向上的投影向量',
    category: 'vector',
    tags: ['投影', '应用'],
    example: 'a=(3,4), b=(1,0) → proj_b a = (3,0)'
  },
  {
    id: 'vec-10',
    name: '单位向量',
    latex: '\\vec{e}_a = \\frac{\\vec{a}}{|\\vec{a}|}',
    description: '与原向量同方向的单位向量（模长为1）',
    category: 'vector',
    tags: ['单位向量', '基础'],
    example: 'a=(3,4) → e_a=(3/5, 4/5)'
  },
  
  // ===== 空间解析几何 =====
  {
    id: 'ag-1',
    name: '平面一般方程',
    latex: 'Ax + By + Cz + D = 0',
    description: '平面的标准方程，法向量为n=(A,B,C)',
    category: 'analytic-geometry',
    tags: ['平面', '基础'],
    example: 'x+y+z-1=0 是过点(1,0,0),(0,1,0),(0,0,1)的平面'
  },
  {
    id: 'ag-2',
    name: '平面的点法式方程',
    latex: 'A(x-x_0) + B(y-y_0) + C(z-z_0) = 0',
    description: '过点P₀(x₀,y₀,z₀)，法向量n=(A,B,C)的平面',
    category: 'analytic-geometry',
    tags: ['平面', '点法式'],
    example: '过点(1,2,3)，法向量(1,1,1)的平面：x+y+z=6'
  },
  {
    id: 'ag-3',
    name: '直线对称式方程',
    latex: '\\frac{x-x_0}{m} = \\frac{y-y_0}{n} = \\frac{z-z_0}{p}',
    description: '过点P₀(x₀,y₀,z₀)，方向向量s=(m,n,p)的直线',
    category: 'analytic-geometry',
    tags: ['直线', '对称式'],
    example: '过原点沿x轴：(x-0)/1=(y-0)/0=(z-0)/0'
  },
  {
    id: 'ag-4',
    name: '直线参数方程',
    latex: '\\begin{cases} x = x_0 + mt \\\\ y = y_0 + nt \\\\ z = z_0 + pt \\end{cases}',
    description: '直线参数形式，t为参数',
    category: 'analytic-geometry',
    tags: ['直线', '参数式'],
    example: '过(1,2,3)，方向(1,1,1)：x=1+t, y=2+t, z=3+t'
  },
  {
    id: 'ag-5',
    name: '点到平面距离',
    latex: 'd = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
    description: '点P(x₀,y₀,z₀)到平面Ax+By+Cz+D=0的距离',
    category: 'analytic-geometry',
    tags: ['距离', '平面'],
    example: '原点到x+y+z=1的距离：|0+0+0-1|/√3=1/√3'
  },
  {
    id: 'ag-6',
    name: '点到直线距离',
    latex: 'd = \\frac{|\\vec{P_0P_1} \\times \\vec{s}|}{|\\vec{s}|}',
    description: '点P₁到过P₀方向为s的直线的距离',
    category: 'analytic-geometry',
    tags: ['距离', '直线'],
    example: '点(0,0,0)到直线过(1,0,0)方向(0,1,0)：d=1'
  },
  {
    id: 'ag-7',
    name: '两平面夹角',
    latex: '\\cos\\theta = \\frac{|A_1A_2 + B_1B_2 + C_1C_2|}{\\sqrt{A_1^2+B_1^2+C_1^2}\\sqrt{A_2^2+B_2^2+C_2^2}}',
    description: '两平面夹角等于其法向量夹角',
    category: 'analytic-geometry',
    tags: ['夹角', '平面'],
    example: 'x+y=0与x+z=0夹角：cosθ=1/2，θ=60°'
  },
  {
    id: 'ag-8',
    name: '两直线夹角',
    latex: '\\cos\\theta = \\frac{|m_1m_2 + n_1n_2 + p_1p_2|}{\\sqrt{m_1^2+n_1^2+p_1^2}\\sqrt{m_2^2+n_2^2+p_2^2}}',
    description: '两直线夹角等于其方向向量夹角',
    category: 'analytic-geometry',
    tags: ['夹角', '直线'],
    example: '方向(1,0,0)与(0,1,0)垂直，夹角90°'
  },
  {
    id: 'ag-9',
    name: '椭球面方程',
    latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1',
    description: '椭球面，三个半轴分别为a, b, c',
    category: 'analytic-geometry',
    tags: ['曲面', '椭球面'],
    example: 'a=b=c=R时为球面'
  },
  {
    id: 'ag-10',
    name: '椭圆抛物面',
    latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = z',
    description: '开口向上的碗形曲面，z≥0',
    category: 'analytic-geometry',
    tags: ['曲面', '抛物面'],
    example: 'a=b=1时：z=x²+y²（旋转抛物面）'
  },
  {
    id: 'ag-11',
    name: '双曲抛物面（马鞍面）',
    latex: '\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = z',
    description: '马鞍形曲面，沿不同方向凹凸相反',
    category: 'analytic-geometry',
    tags: ['曲面', '双曲面'],
    example: 'z=x²-y²是典型马鞍面'
  },
  {
    id: 'ag-12',
    name: '单叶双曲面',
    latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1',
    description: '单叶双曲面，连通曲面',
    category: 'analytic-geometry',
    tags: ['曲面', '双曲面'],
    example: '冷却塔的形状'
  },
  {
    id: 'ag-13',
    name: '双叶双曲面',
    latex: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = -1',
    description: '双叶双曲面，分为上下两叶',
    category: 'analytic-geometry',
    tags: ['曲面', '双曲面'],
    example: '上下两部分不相通'
  },
  {
    id: 'ag-14',
    name: '旋转曲面',
    latex: '绕z轴: 将 f(y,z)=0 中 y 换成 \\pm\\sqrt{x^2+y^2}',
    description: '平面曲线绕坐标轴旋转生成的曲面',
    category: 'analytic-geometry',
    tags: ['曲面', '旋转'],
    example: 'z=y² 绕z轴旋转：z=x²+y²'
  },
  {
    id: 'ag-15',
    name: '圆柱面',
    latex: 'x^2 + y^2 = R^2',
    description: '以z轴为中心轴的圆柱面',
    category: 'analytic-geometry',
    tags: ['曲面', '柱面'],
    example: '方程缺z变量，表示母线平行于z轴的柱面'
  },
  
  // ===== 导数表 =====
  // 基本初等函数导数
  {
    id: 'deriv-1',
    name: '常数函数导数',
    latex: "(C)' = 0",
    description: '常数的导数为零',
    category: 'derivatives',
    tags: ['基本', '常数'],
    example: "(5)' = 0"
  },
  {
    id: 'deriv-2',
    name: '幂函数导数',
    latex: "(x^n)' = nx^{n-1}",
    description: '幂函数的导数公式，n为任意实数',
    category: 'derivatives',
    tags: ['基本', '幂函数'],
    example: "(x³)' = 3x², (x^{-2})' = -2x^{-3}"
  },
  {
    id: 'deriv-3',
    name: '指数函数导数（以e为底）',
    latex: "(e^x)' = e^x",
    description: '以e为底的指数函数导数等于其本身',
    category: 'derivatives',
    tags: ['基本', '指数函数'],
    example: "(e^{2x})' = 2e^{2x}（复合函数）"
  },
  {
    id: 'deriv-4',
    name: '指数函数导数（一般底）',
    latex: "(a^x)' = a^x \\ln a \\quad (a>0, a\\neq 1)",
    description: '以a为底的指数函数导数',
    category: 'derivatives',
    tags: ['基本', '指数函数'],
    example: "(2^x)' = 2^x \\ln 2"
  },
  {
    id: 'deriv-5',
    name: '对数函数导数（自然对数）',
    latex: "(\\ln x)' = \\frac{1}{x} \\quad (x>0)",
    description: '自然对数函数的导数',
    category: 'derivatives',
    tags: ['基本', '对数函数'],
    example: "(\\ln(2x))' = \\frac{1}{2x} \\cdot 2 = \\frac{1}{x}"
  },
  {
    id: 'deriv-6',
    name: '对数函数导数（一般底）',
    latex: "(\\log_a x)' = \\frac{1}{x \\ln a} \\quad (a>0, a\\neq 1)",
    description: '以a为底的对数函数导数',
    category: 'derivatives',
    tags: ['基本', '对数函数'],
    example: "(\\log_2 x)' = \\frac{1}{x \\ln 2}"
  },
  // 三角函数导数
  {
    id: 'deriv-7',
    name: '正弦函数导数',
    latex: "(\\sin x)' = \\cos x",
    description: '正弦函数的导数为余弦函数',
    category: 'derivatives',
    tags: ['三角函数'],
    example: "(\\sin 2x)' = 2\\cos 2x"
  },
  {
    id: 'deriv-8',
    name: '余弦函数导数',
    latex: "(\\cos x)' = -\\sin x",
    description: '余弦函数的导数为负的正弦函数',
    category: 'derivatives',
    tags: ['三角函数'],
    example: "(\\cos 3x)' = -3\\sin 3x"
  },
  {
    id: 'deriv-9',
    name: '正切函数导数',
    latex: "(\\tan x)' = \\sec^2 x = \\frac{1}{\\cos^2 x}",
    description: '正切函数的导数为正割的平方',
    category: 'derivatives',
    tags: ['三角函数'],
    example: "(\\tan x)' = \\sec²x"
  },
  {
    id: 'deriv-10',
    name: '余切函数导数',
    latex: "(\\cot x)' = -\\csc^2 x = -\\frac{1}{\\sin^2 x}",
    description: '余切函数的导数为负的余割平方',
    category: 'derivatives',
    tags: ['三角函数'],
    example: "(\\cot x)' = -\\csc²x"
  },
  {
    id: 'deriv-11',
    name: '正割函数导数',
    latex: "(\\sec x)' = \\sec x \\tan x",
    description: '正割函数的导数',
    category: 'derivatives',
    tags: ['三角函数'],
    example: "(\\sec x)' = \\sec x \\tan x"
  },
  {
    id: 'deriv-12',
    name: '余割函数导数',
    latex: "(\\csc x)' = -\\csc x \\cot x",
    description: '余割函数的导数',
    category: 'derivatives',
    tags: ['三角函数'],
    example: "(\\csc x)' = -\\csc x \\cot x"
  },
  // 反三角函数导数
  {
    id: 'deriv-13',
    name: '反正弦函数导数',
    latex: "(\\arcsin x)' = \\frac{1}{\\sqrt{1-x^2}} \\quad (|x|<1)",
    description: '反正弦函数的导数',
    category: 'derivatives',
    tags: ['反三角函数'],
    example: "(\\arcsin x)' = \\frac{1}{\\sqrt{1-x²}}"
  },
  {
    id: 'deriv-14',
    name: '反余弦函数导数',
    latex: "(\\arccos x)' = -\\frac{1}{\\sqrt{1-x^2}} \\quad (|x|<1)",
    description: '反余弦函数的导数',
    category: 'derivatives',
    tags: ['反三角函数'],
    example: "(\\arccos x)' = -\\frac{1}{\\sqrt{1-x²}}"
  },
  {
    id: 'deriv-15',
    name: '反正切函数导数',
    latex: "(\\arctan x)' = \\frac{1}{1+x^2}",
    description: '反正切函数的导数',
    category: 'derivatives',
    tags: ['反三角函数'],
    example: "(\\arctan x)' = \\frac{1}{1+x²}"
  },
  {
    id: 'deriv-16',
    name: '反余切函数导数',
    latex: '(\\text{arccot}\\, x)\' = -\\frac{1}{1+x^2}',
    description: '反余切函数的导数',
    category: 'derivatives',
    tags: ['反三角函数'],
    example: '(\\text{arccot}\\, x)\' = -\\frac{1}{1+x²}'
  },
  {
    id: 'deriv-17',
    name: '反正割函数导数',
    latex: '(\\text{arcsec}\\, x)\' = \\frac{1}{|x|\\sqrt{x^2-1}} \\quad (|x|>1)',
    description: '反正割函数的导数',
    category: 'derivatives',
    tags: ['反三角函数'],
    example: '(\\text{arcsec}\\, x)\' = \\frac{1}{|x|\\sqrt{x²-1}}'
  },
  {
    id: 'deriv-18',
    name: '反余割函数导数',
    latex: '(\\text{arccsc}\\, x)\' = -\\frac{1}{|x|\\sqrt{x^2-1}} \\quad (|x|>1)',
    description: '反余割函数的导数',
    category: 'derivatives',
    tags: ['反三角函数'],
    example: '(\\text{arccsc}\\, x)\' = -\\frac{1}{|x|\\sqrt{x²-1}}'
  },
  // 双曲函数导数
  {
    id: 'deriv-19',
    name: '双曲正弦导数',
    latex: "(\\sinh x)' = \\cosh x",
    description: '双曲正弦函数的导数',
    category: 'derivatives',
    tags: ['双曲函数'],
    example: "\\sinh x = \\frac{e^x - e^{-x}}{2}"
  },
  {
    id: 'deriv-20',
    name: '双曲余弦导数',
    latex: "(\\cosh x)' = \\sinh x",
    description: '双曲余弦函数的导数',
    category: 'derivatives',
    tags: ['双曲函数'],
    example: "\\cosh x = \\frac{e^x + e^{-x}}{2}"
  },
  {
    id: 'deriv-21',
    name: '双曲正切导数',
    latex: "(\\tanh x)' = \\text{sech}^2\\, x = \\frac{1}{\\cosh^2 x}",
    description: '双曲正切函数的导数',
    category: 'derivatives',
    tags: ['双曲函数'],
    example: "\\tanh x = \\frac{\\sinh x}{\\cosh x}"
  },
  
  // ===== 积分表 =====
  // 基本积分
  {
    id: 'int-1',
    name: '常数积分',
    latex: '\\int a \\, dx = ax + C',
    description: '常数的积分',
    category: 'integrals',
    tags: ['基本'],
    example: '∫5 dx = 5x + C'
  },
  {
    id: 'int-2',
    name: '幂函数积分（n≠-1）',
    latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
    description: '幂函数的积分公式',
    category: 'integrals',
    tags: ['基本', '幂函数'],
    example: '∫x² dx = x³/3 + C'
  },
  {
    id: 'int-3',
    name: '倒数积分',
    latex: '\\int \\frac{1}{x} dx = \\ln|x| + C',
    description: '1/x的积分，注意绝对值',
    category: 'integrals',
    tags: ['基本', '对数'],
    example: '∫dx/x = ln|x| + C'
  },
  {
    id: 'int-4',
    name: '指数函数积分（以e为底）',
    latex: '\\int e^x dx = e^x + C',
    description: '以e为底的指数函数积分',
    category: 'integrals',
    tags: ['基本', '指数函数'],
    example: '∫e^{2x} dx = e^{2x}/2 + C'
  },
  {
    id: 'int-5',
    name: '指数函数积分（一般底）',
    latex: '\\int a^x dx = \\frac{a^x}{\\ln a} + C \\quad (a>0, a\\neq 1)',
    description: '以a为底的指数函数积分',
    category: 'integrals',
    tags: ['基本', '指数函数'],
    example: '∫2ˣ dx = 2ˣ/ln2 + C'
  },
  // 三角函数积分
  {
    id: 'int-6',
    name: '正弦函数积分',
    latex: '\\int \\sin x \\, dx = -\\cos x + C',
    description: '正弦函数的积分',
    category: 'integrals',
    tags: ['三角函数'],
    example: '∫sin 2x dx = -cos 2x/2 + C'
  },
  {
    id: 'int-7',
    name: '余弦函数积分',
    latex: '\\int \\cos x \\, dx = \\sin x + C',
    description: '余弦函数的积分',
    category: 'integrals',
    tags: ['三角函数'],
    example: '∫cos 3x dx = sin 3x/3 + C'
  },
  {
    id: 'int-8',
    name: '正切函数积分',
    latex: '\\int \\tan x \\, dx = -\\ln|\\cos x| + C',
    description: '正切函数的积分',
    category: 'integrals',
    tags: ['三角函数'],
    example: '∫tan x dx = -ln|cos x| + C'
  },
  {
    id: 'int-9',
    name: '余切函数积分',
    latex: '\\int \\cot x \\, dx = \\ln|\\sin x| + C',
    description: '余切函数的积分',
    category: 'integrals',
    tags: ['三角函数'],
    example: '∫cot x dx = ln|sin x| + C'
  },
  {
    id: 'int-10',
    name: '正割函数积分',
    latex: '\\int \\sec x \\, dx = \\ln|\\sec x + \\tan x| + C',
    description: '正割函数的积分',
    category: 'integrals',
    tags: ['三角函数'],
    example: '∫sec x dx = ln|sec x + tan x| + C'
  },
  {
    id: 'int-11',
    name: '余割函数积分',
    latex: '\\int \\csc x \\, dx = -\\ln|\\csc x + \\cot x| + C',
    description: '余割函数的积分',
    category: 'integrals',
    tags: ['三角函数'],
    example: '∫csc x dx = -ln|csc x + cot x| + C'
  },
  // 三角函数平方积分
  {
    id: 'int-12',
    name: '正弦平方积分',
    latex: '\\int \\sin^2 x \\, dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C',
    description: '使用倍角公式降次后积分',
    category: 'integrals',
    tags: ['三角函数', '平方'],
    example: 'sin²x = (1-cos2x)/2'
  },
  {
    id: 'int-13',
    name: '余弦平方积分',
    latex: '\\int \\cos^2 x \\, dx = \\frac{x}{2} + \\frac{\\sin 2x}{4} + C',
    description: '使用倍角公式降次后积分',
    category: 'integrals',
    tags: ['三角函数', '平方'],
    example: 'cos²x = (1+cos2x)/2'
  },
  {
    id: 'int-14',
    name: '正切平方积分',
    latex: '\\int \\tan^2 x \\, dx = \\tan x - x + C',
    description: '利用tan²x = sec²x - 1',
    category: 'integrals',
    tags: ['三角函数', '平方'],
    example: '∫tan²x dx = tan x - x + C'
  },
  {
    id: 'int-15',
    name: '正割平方积分',
    latex: '\\int \\sec^2 x \\, dx = \\tan x + C',
    description: '正割平方的积分',
    category: 'integrals',
    tags: ['三角函数', '平方'],
    example: '∫sec²x dx = tan x + C'
  },
  // 反三角函数积分
  {
    id: 'int-16',
    name: '反正弦型积分',
    latex: '\\int \\frac{1}{\\sqrt{a^2-x^2}} dx = \\arcsin \\frac{x}{a} + C',
    description: '形如1/√(a²-x²)的积分',
    category: 'integrals',
    tags: ['反三角函数'],
    example: '∫dx/√(4-x²) = arcsin(x/2) + C'
  },
  {
    id: 'int-17',
    name: '反正切型积分',
    latex: '\\int \\frac{1}{a^2+x^2} dx = \\frac{1}{a} \\arctan \\frac{x}{a} + C',
    description: '形如1/(a²+x²)的积分',
    category: 'integrals',
    tags: ['反三角函数'],
    example: '∫dx/(1+x²) = arctan x + C'
  },
  {
    id: 'int-18',
    name: '反双曲正弦型积分',
    latex: '\\int \\frac{1}{\\sqrt{x^2+a^2}} dx = \\ln(x+\\sqrt{x^2+a^2}) + C',
    description: '形如1/√(x²+a²)的积分',
    category: 'integrals',
    tags: ['反三角函数', '常用'],
    example: '∫dx/√(x²+1) = ln(x+√(x²+1)) + C'
  },
  {
    id: 'int-19',
    name: '反双曲余弦型积分',
    latex: '\\int \\frac{1}{\\sqrt{x^2-a^2}} dx = \\ln|x+\\sqrt{x^2-a^2}| + C \\quad (|x|>|a|)',
    description: '形如1/√(x²-a²)的积分',
    category: 'integrals',
    tags: ['反三角函数', '常用'],
    example: '∫dx/√(x²-1) = ln|x+√(x²-1)| + C'
  },
  // 常见函数积分
  {
    id: 'int-20',
    name: '含根号积分（x线性）',
    latex: '\\int \\frac{1}{\\sqrt{ax+b}} dx = \\frac{2}{a}\\sqrt{ax+b} + C',
    description: '分母为一次根式的积分',
    category: 'integrals',
    tags: ['根式', '常用'],
    example: '∫dx/√(2x+1) = √(2x+1) + C'
  },
  {
    id: 'int-21',
    name: '根号下一次式积分',
    latex: '\\int \\sqrt{ax+b} \\, dx = \\frac{2}{3a}(ax+b)^{3/2} + C',
    description: '√(ax+b)型积分',
    category: 'integrals',
    tags: ['根式', '常用'],
    example: '∫√(x+1) dx = 2/3(x+1)^(3/2) + C'
  },
  {
    id: 'int-22',
    name: '部分分式积分（线性因子）',
    latex: '\\int \\frac{1}{(x-a)(x-b)} dx = \\frac{1}{a-b}\\ln\\left|\\frac{x-a}{x-b}\\right| + C',
    description: '可化为部分分式的有理函数积分',
    category: 'integrals',
    tags: ['有理函数', '常用'],
    example: '∫dx/[(x-1)(x-2)] = ln|(x-1)/(x-2)| + C'
  },
  {
    id: 'int-23',
    name: '二次倒数积分',
    latex: '\\int \\frac{1}{x^2-a^2} dx = \\frac{1}{2a}\\ln\\left|\\frac{x-a}{x+a}\\right| + C',
    description: 'x²-a²的倒数积分',
    category: 'integrals',
    tags: ['有理函数', '常用'],
    example: '∫dx/(x²-1) = (1/2)ln|(x-1)/(x+1)| + C'
  },
  {
    id: 'int-24',
    name: '指数与三角乘积积分',
    latex: '\\int e^{ax}\\sin bx \\, dx = \\frac{e^{ax}(a\\sin bx - b\\cos bx)}{a^2+b^2} + C',
    description: '使用分部积分法，需要积分两次',
    category: 'integrals',
    tags: ['分部积分', '常用'],
    example: '∫eˣsin x dx = eˣ(sin x - cos x)/2 + C'
  },
  {
    id: 'int-25',
    name: '指数与余弦乘积积分',
    latex: '\\int e^{ax}\\cos bx \\, dx = \\frac{e^{ax}(a\\cos bx + b\\sin bx)}{a^2+b^2} + C',
    description: '使用分部积分法',
    category: 'integrals',
    tags: ['分部积分', '常用'],
    example: '∫eˣcos x dx = eˣ(sin x + cos x)/2 + C'
  },
  {
    id: 'int-26',
    name: 'ln x 积分',
    latex: '\\int \\ln x \\, dx = x\\ln x - x + C',
    description: '对数函数的积分，使用分部积分',
    category: 'integrals',
    tags: ['分部积分', '常用'],
    example: '∫ln x dx = x(ln x - 1) + C'
  },
  {
    id: 'int-27',
    name: 'arctan x 积分',
    latex: '\\int \\arctan x \\, dx = x\\arctan x - \\frac{1}{2}\\ln(1+x^2) + C',
    description: '反正切函数的积分',
    category: 'integrals',
    tags: ['分部积分', '常用'],
    example: '∫arctan x dx = x·arctan x - (1/2)ln(1+x²) + C'
  },
  {
    id: 'int-28',
    name: 'arcsin x 积分',
    latex: '\\int \\arcsin x \\, dx = x\\arcsin x + \\sqrt{1-x^2} + C',
    description: '反正弦函数的积分',
    category: 'integrals',
    tags: ['分部积分', '常用'],
    example: '∫arcsin x dx = x·arcsin x + √(1-x²) + C'
  },
  // 双曲函数积分
  {
    id: 'int-29',
    name: '双曲正弦积分',
    latex: '\\int \\sinh x \\, dx = \\cosh x + C',
    description: '双曲正弦函数的积分',
    category: 'integrals',
    tags: ['双曲函数'],
    example: '∫sinh x dx = cosh x + C'
  },
  {
    id: 'int-30',
    name: '双曲余弦积分',
    latex: '\\int \\cosh x \\, dx = \\sinh x + C',
    description: '双曲余弦函数的积分',
    category: 'integrals',
    tags: ['双曲函数'],
    example: '∫cosh x dx = sinh x + C'
  },
  
  // ===== 微分定理 =====
  // 罗尔定理
  {
    id: 'thm-1',
    name: '罗尔定理',
    latex: 'f(a)=f(b) \\Rightarrow \\exists \\xi \\in (a,b), f\'(\\xi)=0',
    description: '若f在[a,b]上连续，(a,b)内可导，且f(a)=f(b)，则存在ξ∈(a,b)使f\'(ξ)=0',
    category: 'theorems',
    tags: ['中值定理', '基础'],
    example: '验证f(x)=x²-2x在[0,2]上满足罗尔定理'
  },
  // 拉格朗日中值定理
  {
    id: 'thm-2',
    name: '拉格朗日中值定理',
    latex: '\\exists \\xi \\in (a,b): f\'(\\xi) = \\frac{f(b)-f(a)}{b-a}',
    description: '若f在[a,b]上连续，(a,b)内可导，则存在ξ∈(a,b)使f(b)-f(a)=f\'(ξ)(b-a)',
    category: 'theorems',
    tags: ['中值定理', '重要'],
    example: '证明：当x>0时，x/(1+x) < ln(1+x) < x'
  },
  // 柯西中值定理
  {
    id: 'thm-3',
    name: '柯西中值定理',
    latex: '\\frac{f(b)-f(a)}{g(b)-g(a)} = \\frac{f\'(\\xi)}{g\'(\\xi)}',
    description: '若f,g在[a,b]上连续，(a,b)内可导，且g\'(x)≠0，则存在ξ∈(a,b)使上式成立',
    category: 'theorems',
    tags: ['中值定理', '重要'],
    example: '设f(x)在[a,b]上连续，在(a,b)内可导，证明存在ξ使f\'(ξ)=(f(b)-f(a))/(b-a)'
  },
  // 泰勒公式
  {
    id: 'thm-4',
    name: '泰勒公式（带拉格朗日余项）',
    latex: 'f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k + \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-x_0)^{n+1}',
    description: 'f在x₀处的n阶泰勒展开，ξ介于x与x₀之间',
    category: 'theorems',
    tags: ['泰勒公式', '重要'],
    example: 'e^x = 1 + x + x²/2! + x³/3! + ... + R_n(x)'
  },
  // 麦克劳林公式
  {
    id: 'thm-5',
    name: '麦克劳林公式',
    latex: 'f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(0)}{k!}x^k + o(x^n)',
    description: '泰勒公式在x₀=0处的特例',
    category: 'theorems',
    tags: ['泰勒公式', '常用'],
    example: 'sin x = x - x³/3! + x⁵/5! - ...'
  },
  // 常用麦克劳林展开
  {
    id: 'thm-6',
    name: 'e^x的麦克劳林展开',
    latex: 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}',
    description: '指数函数的麦克劳林展开式',
    category: 'theorems',
    tags: ['泰勒公式', '常用'],
    example: 'e ≈ 1 + 1 + 1/2! + 1/3! + ... = 2.718...'
  },
  {
    id: 'thm-7',
    name: 'sin x的麦克劳林展开',
    latex: '\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}',
    description: '正弦函数的麦克劳林展开式',
    category: 'theorems',
    tags: ['泰勒公式', '常用'],
    example: 'sin(0.1) ≈ 0.1 - 0.001/6 ≈ 0.09983'
  },
  {
    id: 'thm-8',
    name: 'cos x的麦克劳林展开',
    latex: '\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}',
    description: '余弦函数的麦克劳林展开式',
    category: 'theorems',
    tags: ['泰勒公式', '常用'],
    example: 'cos(0.1) ≈ 1 - 0.01/2 ≈ 0.995'
  },
  {
    id: 'thm-9',
    name: 'ln(1+x)的麦克劳林展开',
    latex: '\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^n}{n} \\quad (|x|<1)',
    description: '对数函数的麦克劳林展开式，收敛域|x|<1',
    category: 'theorems',
    tags: ['泰勒公式', '常用'],
    example: 'ln(1.1) ≈ 0.1 - 0.01/2 + 0.001/3 ≈ 0.0953'
  },
  {
    id: 'thm-10',
    name: '(1+x)^α的麦克劳林展开',
    latex: '(1+x)^\\alpha = 1 + \\alpha x + \\frac{\\alpha(\\alpha-1)}{2!}x^2 + \\cdots \\quad (|x|<1)',
    description: '二项式定理的推广，收敛域|x|<1',
    category: 'theorems',
    tags: ['泰勒公式', '常用'],
    example: '√(1+x) = 1 + x/2 - x²/8 + x³/16 - ...'
  },
  // 洛必达法则
  {
    id: 'thm-11',
    name: '洛必达法则（0/0型）',
    latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
    description: '当lim f(x)=lim g(x)=0时，可用导数之比的极限代替',
    category: 'theorems',
    tags: ['极限', '重要'],
    example: 'lim(x→0) sin x / x = lim(x→0) cos x / 1 = 1'
  },
  {
    id: 'thm-12',
    name: '洛必达法则（∞/∞型）',
    latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
    description: '当lim f(x)=lim g(x)=∞时，同样适用',
    category: 'theorems',
    tags: ['极限', '重要'],
    example: 'lim(x→∞) ln x / x = lim(x→∞) 1/x / 1 = 0'
  },
  // 积分中值定理
  {
    id: 'thm-13',
    name: '积分中值定理',
    latex: '\\int_a^b f(x)dx = f(\\xi)(b-a), \\quad \\xi \\in [a,b]',
    description: 'f在[a,b]上连续，则存在ξ∈[a,b]使积分等于f(ξ)(b-a)',
    category: 'theorems',
    tags: ['积分', '重要'],
    example: '估计∫₀¹ e^(-x²) dx 的值在[1/e, 1]之间'
  },
  // 介值定理
  {
    id: 'thm-14',
    name: '介值定理',
    latex: 'f(a) < c < f(b) \\Rightarrow \\exists \\xi \\in (a,b): f(\\xi) = c',
    description: '连续函数在闭区间上可取到介于端点值之间的任何值',
    category: 'theorems',
    tags: ['连续性', '基础'],
    example: '证明方程x³-3x+1=0在(0,1)内有根'
  },
  // 最值定理
  {
    id: 'thm-15',
    name: '最值定理',
    latex: 'f \\in C[a,b] \\Rightarrow \\exists x_1, x_2: f(x_1) \\le f(x) \\le f(x_2)',
    description: '连续函数在闭区间上必有最大值和最小值',
    category: 'theorems',
    tags: ['连续性', '基础'],
    example: 'f(x)=x²在[-1,1]上，最小值f(0)=0，最大值f(±1)=1'
  },
  
  // ===== 无穷级数 =====
  // 级数基本概念
  {
    id: 'series-1',
    name: '级数收敛定义',
    latex: '\\sum_{n=1}^{\\infty} a_n \\text{收敛} \\Leftrightarrow \\lim_{n \\to \\infty} S_n \\text{存在}',
    description: '级数的部分和数列S_n收敛则级数收敛',
    category: 'series',
    tags: ['基础', '收敛'],
    example: '部分和 S_n = a₁ + a₂ + ... + aₙ'
  },
  {
    id: 'series-2',
    name: '级数收敛必要条件',
    latex: '\\sum a_n \\text{收敛} \\Rightarrow \\lim_{n \\to \\infty} a_n = 0',
    description: '级数收敛的必要条件是通项趋于零，但非充分条件',
    category: 'series',
    tags: ['基础', '收敛'],
    example: '∑1/n 发散（调和级数），但通项趋于0'
  },
  // 等比级数与p级数
  {
    id: 'series-3',
    name: '等比级数（几何级数）',
    latex: '\\sum_{n=0}^{\\infty} q^n = \\frac{1}{1-q} \\quad (|q|<1)',
    description: '公比绝对值小于1的等比级数收敛于1/(1-q)',
    category: 'series',
    tags: ['常用', '收敛'],
    example: '1 + 1/2 + 1/4 + 1/8 + ... = 2'
  },
  {
    id: 'series-4',
    name: 'p级数',
    latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^p} \\text{当} p>1 \\text{收敛，} p \\le 1 \\text{发散}',
    description: 'p级数的收敛性判断，p=1时为调和级数',
    category: 'series',
    tags: ['常用', '收敛'],
    example: '∑1/n² 收敛，∑1/√n 发散'
  },
  // 收敛判别法
  {
    id: 'series-5',
    name: '比值判别法（D\'Alembert）',
    latex: '\\lim_{n \\to \\infty} \\frac{a_{n+1}}{a_n} = \\rho, \\begin{cases} \\rho<1 & \\text{收敛} \\\\ \\rho>1 & \\text{发散} \\end{cases}',
    description: '适用于正项级数，ρ=1时无法判断',
    category: 'series',
    tags: ['判别法', '重要'],
    example: '∑n!/nⁿ，比值极限=0，收敛'
  },
  {
    id: 'series-6',
    name: '根值判别法（Cauchy）',
    latex: '\\lim_{n \\to \\infty} \\sqrt[n]{a_n} = \\rho, \\begin{cases} \\rho<1 & \\text{收敛} \\\\ \\rho>1 & \\text{发散} \\end{cases}',
    description: '适用于正项级数，特别适合通项含n次幂的情况',
    category: 'series',
    tags: ['判别法', '重要'],
    example: '∑(n/(n+1))ⁿ²，根值极限=1/e<1，收敛'
  },
  {
    id: 'series-7',
    name: '比较判别法',
    latex: '0 \\le a_n \\le b_n, \\sum b_n \\text{收敛} \\Rightarrow \\sum a_n \\text{收敛}',
    description: '较大的级数收敛则较小的级数也收敛',
    category: 'series',
    tags: ['判别法', '基础'],
    example: '∑1/(n²+1) < ∑1/n²，故收敛'
  },
  {
    id: 'series-8',
    name: '比较判别法的极限形式',
    latex: '\\lim_{n \\to \\infty} \\frac{a_n}{b_n} = c > 0 \\Rightarrow \\sum a_n, \\sum b_n \\text{同敛散}',
    description: '两正项级数通项同阶则同敛散',
    category: 'series',
    tags: ['判别法', '重要'],
    example: '∑1/(n²+n)与∑1/n²同敛散，收敛'
  },
  {
    id: 'series-9',
    name: '积分判别法',
    latex: 'f(x) \\text{单调递减} \\Rightarrow \\sum_{n=1}^{\\infty} f(n), \\int_1^{\\infty} f(x)dx \\text{同敛散}',
    description: '正项单调递减函数，级数与反常积分同敛散',
    category: 'series',
    tags: ['判别法', '重要'],
    example: '∫₁^∞ 1/x dx 发散，故∑1/n 发散'
  },
  {
    id: 'series-10',
    name: '莱布尼茨判别法',
    latex: 'a_n \\searrow 0 \\Rightarrow \\sum_{n=1}^{\\infty} (-1)^{n-1} a_n \\text{收敛}',
    description: '交错级数判别法：通项单调递减趋于零则收敛',
    category: 'series',
    tags: ['判别法', '交错级数'],
    example: '∑(-1)ⁿ⁻¹/n 收敛（莱布尼茨级数）'
  },
  // 绝对收敛与条件收敛
  {
    id: 'series-11',
    name: '绝对收敛',
    latex: '\\sum |a_n| \\text{收敛} \\Rightarrow \\sum a_n \\text{收敛}',
    description: '绝对收敛的级数一定收敛',
    category: 'series',
    tags: ['收敛性', '重要'],
    example: '∑(-1)ⁿ/n² 绝对收敛'
  },
  {
    id: 'series-12',
    name: '条件收敛',
    latex: '\\sum a_n \\text{收敛但} \\sum |a_n| \\text{发散}',
    description: '条件收敛：级数收敛但不绝对收敛',
    category: 'series',
    tags: ['收敛性', '重要'],
    example: '∑(-1)ⁿ⁻¹/n 条件收敛'
  },
  // 幂级数
  {
    id: 'series-13',
    name: '幂级数',
    latex: '\\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + \\cdots',
    description: '形如∑aₙxⁿ的级数称为幂级数',
    category: 'series',
    tags: ['幂级数', '基础'],
    example: '幂级数在收敛域内定义一个函数'
  },
  {
    id: 'series-14',
    name: '幂级数收敛半径',
    latex: 'R = \\lim_{n \\to \\infty} \\left| \\frac{a_n}{a_{n+1}} \\right| \\text{ 或 } R = \\lim_{n \\to \\infty} \\frac{1}{\\sqrt[n]{|a_n|}}',
    description: '幂级数在|x|<R内绝对收敛，|x|>R发散',
    category: 'series',
    tags: ['幂级数', '重要'],
    example: '∑xⁿ/n，R=lim n/(n+1)=1'
  },
  {
    id: 'series-15',
    name: '幂级数逐项求导',
    latex: '\\left( \\sum a_n x^n \\right)\' = \\sum n a_n x^{n-1}, \\quad R \\text{不变}',
    description: '幂级数在收敛域内可逐项求导，收敛半径不变',
    category: 'series',
    tags: ['幂级数', '运算'],
    example: '(1/(1-x))\' = ∑nxⁿ⁻¹ = 1/(1-x)²'
  },
  {
    id: 'series-16',
    name: '幂级数逐项积分',
    latex: '\\int \\left( \\sum a_n x^n \\right) dx = \\sum \\frac{a_n}{n+1} x^{n+1} + C',
    description: '幂级数在收敛域内可逐项积分',
    category: 'series',
    tags: ['幂级数', '运算'],
    example: '∫(1+x+x²+...)dx = x + x²/2 + x³/3 + ... = -ln(1-x)'
  },
  // 常用级数展开
  {
    id: 'series-17',
    name: 'arctan x的级数展开',
    latex: '\\arctan x = x - \\frac{x^3}{3} + \\frac{x^5}{5} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{2n+1} \\quad (|x| \\le 1)',
    description: '反正切函数的幂级数展开',
    category: 'series',
    tags: ['级数展开', '常用'],
    example: 'π/4 = arctan(1) = 1 - 1/3 + 1/5 - ...'
  },
  {
    id: 'series-18',
    name: 'arcsin x的级数展开',
    latex: '\\arcsin x = x + \\frac{x^3}{6} + \\frac{3x^5}{40} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{(2n)!}{4^n (n!)^2 (2n+1)} x^{2n+1}',
    description: '反正弦函数的幂级数展开，|x|≤1',
    category: 'series',
    tags: ['级数展开', '常用'],
    example: 'arcsin(1/2) = π/6 ≈ 0.5236'
  },

  // ===== 第一型曲线积分（对弧长的曲线积分）=====
  {
    id: 'line1-1',
    name: '第一型曲线积分定义',
    latex: '\\int_L f(x,y) \\, ds = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta s_i',
    description: '第一型曲线积分（对弧长的曲线积分），其中ds是弧长微元',
    category: 'line-integral',
    tags: ['第一型', '定义', '基础'],
    example: '几何意义：曲线L上f(x,y)的"质量"'
  },
  {
    id: 'line1-2',
    name: '第一型曲线积分参数形式',
    latex: '\\int_L f(x,y) \\, ds = \\int_{\\alpha}^{\\beta} f(x(t), y(t)) \\sqrt{x\'^2(t) + y\'^2(t)} \\, dt',
    description: '参数方程 x=x(t), y=y(t), α≤t≤β 时的计算公式',
    category: 'line-integral',
    tags: ['第一型', '参数', '计算'],
    example: '∫_L y ds, L: x=cost, y=sint, 0≤t≤π'
  },
  {
    id: 'line1-3',
    name: '第一型曲线积分直角坐标形式',
    latex: '\\int_L f(x,y) \\, ds = \\int_a^b f(x, y(x)) \\sqrt{1 + y\'^2(x)} \\, dx',
    description: '曲线表示为 y=y(x), a≤x≤b 时的计算公式',
    category: 'line-integral',
    tags: ['第一型', '直角坐标', '计算'],
    example: '∫_L x ds, L: y=x², 0≤x≤1'
  },
  {
    id: 'line1-4',
    name: '第一型曲线积分极坐标形式',
    latex: '\\int_L f(x,y) \\, ds = \\int_{\\alpha}^{\\beta} f(r\\cos\\theta, r\\sin\\theta) \\sqrt{r^2 + r\'^2} \\, d\\theta',
    description: '曲线用极坐标 r=r(θ), α≤θ≤β 表示时',
    category: 'line-integral',
    tags: ['第一型', '极坐标', '计算'],
    example: '∫_L xy ds, L: r=acosθ'
  },
  {
    id: 'line1-5',
    name: '空间曲线第一型积分',
    latex: '\\int_L f(x,y,z) \\, ds = \\int_{\\alpha}^{\\beta} f(x(t),y(t),z(t)) \\sqrt{x\'^2+y\'^2+z\'^2} \\, dt',
    description: '空间曲线 x=x(t), y=y(t), z=z(t) 的第一型曲线积分',
    category: 'line-integral',
    tags: ['第一型', '空间曲线', '三维'],
    example: '∫_L z ds, L: x=cost, y=sint, z=t, 0≤t≤2π'
  },
  {
    id: 'line1-6',
    name: '第一型曲线积分性质-线性',
    latex: '\\int_L [af(x,y) + bg(x,y)] \\, ds = a\\int_L f \\, ds + b\\int_L g \\, ds',
    description: '第一型曲线积分满足线性性质',
    category: 'line-integral',
    tags: ['第一型', '性质', '线性'],
    example: '可拆分复杂函数'
  },
  {
    id: 'line1-7',
    name: '第一型曲线积分性质-路径可加',
    latex: '\\int_{L_1+L_2} f \\, ds = \\int_{L_1} f \\, ds + \\int_{L_2} f \\, ds',
    description: '积分路径可以分段相加',
    category: 'line-integral',
    tags: ['第一型', '性质', '可加性'],
    example: '将复杂曲线分成简单段计算'
  },
  {
    id: 'line1-8',
    name: '第一型曲线积分对称性',
    latex: '若L关于x轴对称：\\int_L f(x,y)\\,ds = \\begin{cases} 0 & f(x,-y)=-f(x,y) \\\\ 2\\int_{L_1} f\\,ds & f(x,-y)=f(x,y) \\end{cases}',
    description: '利用对称性简化计算',
    category: 'line-integral',
    tags: ['第一型', '对称性', '技巧'],
    example: '奇偶函数对称简化'
  },

  // ===== 第二型曲线积分（对坐标的曲线积分）=====
  {
    id: 'line2-1',
    name: '第二型曲线积分定义',
    latex: '\\int_L P\\,dx + Q\\,dy = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} [P(\\xi_i,\\eta_i)\\Delta x_i + Q(\\xi_i,\\eta_i)\\Delta y_i]',
    description: '第二型曲线积分（对坐标的曲线积分），与方向有关',
    category: 'line-integral',
    tags: ['第二型', '定义', '基础'],
    example: '物理意义：变力沿曲线做功'
  },
  {
    id: 'line2-2',
    name: '第二型曲线积分参数形式',
    latex: '\\int_L P\\,dx + Q\\,dy = \\int_{\\alpha}^{\\beta} [P(x(t),y(t))x\'(t) + Q(x(t),y(t))y\'(t)]\\,dt',
    description: '参数方程计算，注意起点对应α，终点对应β',
    category: 'line-integral',
    tags: ['第二型', '参数', '计算'],
    example: '∫_L ydx + xdy, L: x=cost, y=sint'
  },
  {
    id: 'line2-3',
    name: '第二型曲线积分方向性',
    latex: '\\int_{-L} P\\,dx + Q\\,dy = -\\int_L P\\,dx + Q\\,dy',
    description: '第二型曲线积分与方向相反，反向积分变号',
    category: 'line-integral',
    tags: ['第二型', '方向', '性质'],
    example: '与第一型曲线积分的重要区别'
  },
  {
    id: 'line2-4',
    name: '格林公式',
    latex: '\\oint_L P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dx\\,dy',
    description: '闭曲线L（正向）围成区域D，连接曲线积分与二重积分',
    category: 'line-integral',
    tags: ['第二型', '格林公式', '核心'],
    example: '要求：L是D的正向边界，P,Q在D上有连续偏导'
  },
  {
    id: 'line2-5',
    name: '格林公式面积公式',
    latex: 'S = \\frac{1}{2}\\oint_L x\\,dy - y\\,dx = \\oint_L x\\,dy = -\\oint_L y\\,dx',
    description: '利用格林公式计算平面区域面积',
    category: 'line-integral',
    tags: ['第二型', '格林公式', '面积'],
    example: '椭圆面积：S=πab'
  },
  {
    id: 'line2-6',
    name: '曲线积分与路径无关条件',
    latex: '\\int_L P\\,dx + Q\\,dy 与路径无关 \\Leftrightarrow \\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}',
    description: '单连通区域内，曲线积分与路径无关的充要条件',
    category: 'line-integral',
    tags: ['第二型', '路径无关', '核心'],
    example: '此时存在势函数u使P=∂u/∂x, Q=∂u/∂y'
  },
  {
    id: 'line2-7',
    name: '势函数（原函数）求法',
    latex: 'u(x,y) = \\int_{x_0}^{x} P(x, y_0)\\,dx + \\int_{y_0}^{y} Q(x, y)\\,dy + C',
    description: '当曲线积分与路径无关时，求势函数u使du=Pdx+Qdy',
    category: 'line-integral',
    tags: ['第二型', '势函数', '计算'],
    example: '∫(2xy+x²)dx + (x²-2y)dy，u=x²y+x²/2-y²+C'
  },
  {
    id: 'line2-8',
    name: '空间第二型曲线积分',
    latex: '\\int_L P\\,dx + Q\\,dy + R\\,dz',
    description: '空间曲线的第二型曲线积分',
    category: 'line-integral',
    tags: ['第二型', '空间曲线', '三维'],
    example: '变力F=(P,Q,R)沿空间曲线做功'
  },
  {
    id: 'line2-9',
    name: '斯托克斯公式',
    latex: '\\oint_L P\\,dx + Q\\,dy + R\\,dz = \\iint_S \\begin{vmatrix} dy\\,dz & dz\\,dx & dx\\,dy \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix}',
    description: '空间闭曲线积分与曲面积分的关系，L是S的边界',
    category: 'line-integral',
    tags: ['第二型', '斯托克斯公式', '核心'],
    example: '用于计算空间曲线积分或证明积分与路径无关'
  },
  {
    id: 'line2-10',
    name: '斯托克斯公式向量形式',
    latex: '\\oint_L \\vec{F} \\cdot d\\vec{r} = \\iint_S (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}',
    description: '旋度形式：∇×F是F的旋度，dS是面积元向量',
    category: 'line-integral',
    tags: ['第二型', '斯托克斯公式', '向量'],
    example: '物理意义：环量等于旋度的通量'
  },

  // ===== 第一型曲面积分（对面积的曲面积分）=====
  {
    id: 'surface1-1',
    name: '第一型曲面积分定义',
    latex: '\\iint_S f(x,y,z) \\, dS = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i, \\zeta_i) \\Delta S_i',
    description: '第一型曲面积分（对面积的曲面积分），dS是面积微元',
    category: 'surface-integral',
    tags: ['第一型', '定义', '基础'],
    example: '物理意义：曲面S上分布的"质量"'
  },
  {
    id: 'surface1-2',
    name: '第一型曲面积分投影法（z=z(x,y)）',
    latex: '\\iint_S f(x,y,z) \\, dS = \\iint_{D_{xy}} f(x,y,z(x,y)) \\sqrt{1 + z_x^2 + z_y^2} \\, dx\\,dy',
    description: '曲面投影到xy平面，Dxy是投影区域',
    category: 'surface-integral',
    tags: ['第一型', '投影', '计算'],
    example: '∫∫_S z dS, S: z=xy, 0≤x,y≤1'
  },
  {
    id: 'surface1-3',
    name: '第一型曲面积分投影法（x=x(y,z)）',
    latex: '\\iint_S f(x,y,z) \\, dS = \\iint_{D_{yz}} f(x(y,z),y,z) \\sqrt{1 + x_y^2 + x_z^2} \\, dy\\,dz',
    description: '曲面投影到yz平面',
    category: 'surface-integral',
    tags: ['第一型', '投影', '计算'],
    example: '用于x可表示为y,z函数的曲面'
  },
  {
    id: 'surface1-4',
    name: '第一型曲面积分投影法（y=y(x,z)）',
    latex: '\\iint_S f(x,y,z) \\, dS = \\iint_{D_{xz}} f(x,y(x,z),z) \\sqrt{1 + y_x^2 + y_z^2} \\, dx\\,dz',
    description: '曲面投影到xz平面',
    category: 'surface-integral',
    tags: ['第一型', '投影', '计算'],
    example: '用于y可表示为x,z函数的曲面'
  },
  {
    id: 'surface1-5',
    name: '第一型曲面积分参数形式',
    latex: '\\iint_S f \\, dS = \\iint_{D} f(x(u,v),y(u,v),z(u,v)) \\sqrt{EG-F^2} \\, du\\,dv',
    description: '参数曲面：x=x(u,v), y=y(u,v), z=z(u,v), E=xu²+yu²+zu², F=xu xv+yu yv+zu zv, G=xv²+yv²+zv²',
    category: 'surface-integral',
    tags: ['第一型', '参数', '计算'],
    example: '球面、柱面等常用参数方程'
  },
  {
    id: 'surface1-6',
    name: '球面面积微元',
    latex: 'dS = R^2 \\sin\\varphi \\, d\\varphi \\, d\\theta',
    description: '球坐标下球面（半径R）的面积微元，φ为极角(0~π)，θ为方位角(0~2π)',
    category: 'surface-integral',
    tags: ['第一型', '球面', '特殊曲面'],
    example: '球面面积：∫∫dS = ∫₀²π∫₀ᴨ R²sinφ dφ dθ = 4πR²'
  },
  {
    id: 'surface1-7',
    name: '旋转曲面面积',
    latex: 'S = 2\\pi \\int_a^b y \\sqrt{1 + y\'^2} \\, dx',
    description: '曲线y=f(x)绕x轴旋转所得曲面的面积',
    category: 'surface-integral',
    tags: ['第一型', '旋转曲面', '应用'],
    example: '球面：y=√(R²-x²)，绕x轴旋转'
  },
  {
    id: 'surface1-8',
    name: '第一型曲面积分对称性',
    latex: '若S关于xy面对称：\\iint_S f\\,dS = \\begin{cases} 0 & f(x,y,-z)=-f(x,y,z) \\\\ 2\\iint_{S_1} f\\,dS & f(x,y,-z)=f(x,y,z) \\end{cases}',
    description: '利用对称性简化第一型曲面积分',
    category: 'surface-integral',
    tags: ['第一型', '对称性', '技巧'],
    example: '奇偶函数在对称曲面上的积分'
  },

  // ===== 第二型曲面积分（对坐标的曲面积分）=====
  {
    id: 'surface2-1',
    name: '第二型曲面积分定义',
    latex: '\\iint_S P\\,dy\\,dz + Q\\,dz\\,dx + R\\,dx\\,dy',
    description: '第二型曲面积分（对坐标的曲面积分），与曲面方向有关',
    category: 'surface-integral',
    tags: ['第二型', '定义', '基础'],
    example: '物理意义：流体穿过曲面的通量'
  },
  {
    id: 'surface2-2',
    name: '第二型曲面积分方向性',
    latex: '\\iint_{-S} P\\,dy\\,dz + Q\\,dz\\,dx + R\\,dx\\,dy = -\\iint_S P\\,dy\\,dz + Q\\,dz\\,dx + R\\,dx\\,dy',
    description: '曲面侧改变，积分值变号',
    category: 'surface-integral',
    tags: ['第二型', '方向', '性质'],
    example: '需指定曲面的侧（上侧/下侧，外侧/内侧）'
  },
  {
    id: 'surface2-3',
    name: '投影计算法（dx dy）',
    latex: '\\iint_S R(x,y,z)\\,dx\\,dy = \\pm \\iint_{D_{xy}} R(x,y,z(x,y))\\,dx\\,dy',
    description: '上侧取正，下侧取负；z=z(x,y)表示曲面',
    category: 'surface-integral',
    tags: ['第二型', '投影', '计算'],
    example: '∫∫_S z dxdy, S: z=√(1-x²-y²)上侧'
  },
  {
    id: 'surface2-4',
    name: '投影计算法（dy dz）',
    latex: '\\iint_S P(x,y,z)\\,dy\\,dz = \\pm \\iint_{D_{yz}} P(x(y,z),y,z)\\,dy\\,dz',
    description: '前侧取正，后侧取负；x=x(y,z)表示曲面',
    category: 'surface-integral',
    tags: ['第二型', '投影', '计算'],
    example: '需将曲面表示为x=x(y,z)形式'
  },
  {
    id: 'surface2-5',
    name: '投影计算法（dz dx）',
    latex: '\\iint_S Q(x,y,z)\\,dz\\,dx = \\pm \\iint_{D_{xz}} Q(x,y(x,z),z)\\,dz\\,dx',
    description: '右侧取正，左侧取负；y=y(x,z)表示曲面',
    category: 'surface-integral',
    tags: ['第二型', '投影', '计算'],
    example: '需将曲面表示为y=y(x,z)形式'
  },
  {
    id: 'surface2-6',
    name: '高斯公式',
    latex: '\\oiint_S P\\,dy\\,dz + Q\\,dz\\,dx + R\\,dx\\,dy = \\iiint_V \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}\\right) dx\\,dy\\,dz',
    description: '闭曲面S（外侧）围成区域V，连接曲面积分与三重积分',
    category: 'surface-integral',
    tags: ['第二型', '高斯公式', '核心'],
    example: '要求：S是V的外侧边界，P,Q,R有连续偏导'
  },
  {
    id: 'surface2-7',
    name: '高斯公式向量形式',
    latex: '\\oiint_S \\vec{F} \\cdot d\\vec{S} = \\iiint_V \\nabla \\cdot \\vec{F} \\, dV',
    description: '散度形式：∇·F是F的散度，dS=ndS是面积元向量',
    category: 'surface-integral',
    tags: ['第二型', '高斯公式', '向量'],
    example: '物理意义：通量等于散度的体积分'
  },
  {
    id: 'surface2-8',
    name: '两类曲面积分关系',
    latex: '\\iint_S P\\,dy\\,dz + Q\\,dz\\,dx + R\\,dx\\,dy = \\iint_S (P\\cos\\alpha + Q\\cos\\beta + R\\cos\\gamma)\\,dS',
    description: 'n=(cosα,cosβ,cosγ)是曲面法向量（单位向量）',
    category: 'surface-integral',
    tags: ['第二型', '两类关系', '转换'],
    example: '用于两类积分之间的转换'
  },
  {
    id: 'surface2-9',
    name: '曲面积分向量形式',
    latex: '\\iint_S \\vec{F} \\cdot d\\vec{S} = \\iint_S \\vec{F} \\cdot \\vec{n} \\, dS',
    description: 'F=(P,Q,R), n是单位法向量，dS是面积微元',
    category: 'surface-integral',
    tags: ['第二型', '向量', '形式'],
    example: '通量的向量表示'
  },
  {
    id: 'surface2-10',
    name: '封闭曲面外侧判定',
    latex: '\\text{外侧：法向量向外} \\quad \\text{内侧：法向量向内}',
    description: '高斯公式中封闭曲面取外侧为正方向',
    category: 'surface-integral',
    tags: ['第二型', '方向', '判定'],
    example: '球面外侧：法向量指向球外'
  },

  // ===== 二重积分 =====
  {
    id: 'double-1',
    name: '二重积分定义',
    latex: '\\iint_D f(x,y) \\, d\\sigma = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta\\sigma_i',
    description: '二重积分的黎曼和定义，dσ为面积微元',
    category: 'double-integral',
    tags: ['定义', '基础'],
    example: '几何意义：曲顶柱体体积'
  },
  {
    id: 'double-2',
    name: '二重积分直角坐标(X型区域)',
    latex: '\\iint_D f(x,y) \\, dxdy = \\int_a^b dx \\int_{\\varphi_1(x)}^{\\varphi_2(x)} f(x,y) \\, dy',
    description: 'X型区域：a≤x≤b, φ₁(x)≤y≤φ₂(x)，先对y积分',
    category: 'double-integral',
    tags: ['直角坐标', 'X型', '计算'],
    example: '∫∫_D xy dxdy, D: 0≤x≤1, 0≤y≤x'
  },
  {
    id: 'double-3',
    name: '二重积分直角坐标(Y型区域)',
    latex: '\\iint_D f(x,y) \\, dxdy = \\int_c^d dy \\int_{\\psi_1(y)}^{\\psi_2(y)} f(x,y) \\, dx',
    description: 'Y型区域：c≤y≤d, ψ₁(y)≤x≤ψ₂(y)，先对x积分',
    category: 'double-integral',
    tags: ['直角坐标', 'Y型', '计算'],
    example: '选择合适次序简化计算'
  },
  {
    id: 'double-4',
    name: '二重积分极坐标变换',
    latex: '\\iint_D f(x,y) \\, dxdy = \\iint_D f(r\\cos\\theta, r\\sin\\theta) \\, r \\, dr \\, d\\theta',
    description: '极坐标变换：x=rcosθ, y=rsinθ, 面积元素 dxdy = r dr dθ',
    category: 'double-integral',
    tags: ['极坐标', '变换', '核心'],
    example: '圆形、扇形区域优先使用极坐标'
  },
  {
    id: 'double-5',
    name: '极坐标典型区域',
    latex: '\\iint_D f \\, r\\,dr\\,d\\theta = \\int_{\\alpha}^{\\beta} d\\theta \\int_{r_1(\\theta)}^{r_2(\\theta)} f(r\\cos\\theta, r\\sin\\theta) \\, r \\, dr',
    description: '极坐标下：α≤θ≤β, r₁(θ)≤r≤r₂(θ)',
    category: 'double-integral',
    tags: ['极坐标', '计算'],
    example: '圆域D: 0≤θ≤2π, 0≤r≤R'
  },
  {
    id: 'double-6',
    name: '二重积分交换积分次序',
    latex: '\\int_a^b dx \\int_{\\varphi_1(x)}^{\\varphi_2(x)} f(x,y) \\, dy = \\int_c^d dy \\int_{\\psi_1(y)}^{\\psi_2(y)} f(x,y) \\, dx',
    description: '当一种次序难以积分时，交换次序可能简化',
    category: 'double-integral',
    tags: ['交换次序', '技巧'],
    example: '∫dx∫e^y² dy 难以计算，需交换次序'
  },
  {
    id: 'double-7',
    name: '二重积分对称性(关于x轴)',
    latex: 'D关于x轴对称：\\iint_D f\\,d\\sigma = \\begin{cases} 0 & f(x,-y)=-f(x,y) \\\\ 2\\iint_{D_1} f\\,d\\sigma & f(x,-y)=f(x,y) \\end{cases}',
    description: '利用对称性简化计算',
    category: 'double-integral',
    tags: ['对称性', '技巧'],
    example: '奇函数在对称区域积分为零'
  },
  {
    id: 'double-8',
    name: '二重积分对称性(关于y轴)',
    latex: 'D关于y轴对称：\\iint_D f\\,d\\sigma = \\begin{cases} 0 & f(-x,y)=-f(x,y) \\\\ 2\\iint_{D_1} f\\,d\\sigma & f(-x,y)=f(x,y) \\end{cases}',
    description: '利用y轴对称性',
    category: 'double-integral',
    tags: ['对称性', '技巧'],
    example: '偶函数在对称区域可简化'
  },
  {
    id: 'double-9',
    name: '二重积分对称性(关于原点)',
    latex: 'D关于原点对称：\\iint_D f\\,d\\sigma = \\begin{cases} 0 & f(-x,-y)=-f(x,y) \\\\ 2\\iint_{D_1} f\\,d\\sigma & f(-x,-y)=f(x,y) \\end{cases}',
    description: '原点对称性',
    category: 'double-integral',
    tags: ['对称性', '技巧'],
    example: '利用原点对称性'
  },
  {
    id: 'double-10',
    name: '二重积分变量代换',
    latex: '\\iint_D f(x,y)\\,dxdy = \\iint_{D\'} f(x(u,v),y(u,v)) \\left| \\frac{\\partial(x,y)}{\\partial(u,v)} \\right| du\\,dv',
    description: '雅可比行列式：|∂(x,y)/∂(u,v)| = |x_u y_v - x_v y_u|',
    category: 'double-integral',
    tags: ['变量代换', '雅可比', '高级'],
    example: '椭圆变换：x=arcosθ, y=brsinθ'
  },
  {
    id: 'double-11',
    name: '平面区域面积',
    latex: 'S_D = \\iint_D d\\sigma = \\iint_D dxdy',
    description: '二重积分求平面区域面积',
    category: 'double-integral',
    tags: ['面积', '应用'],
    example: '椭圆面积：∫∫dxdy = πab'
  },
  {
    id: 'double-12',
    name: '曲顶柱体体积',
    latex: 'V = \\iint_D |f(x,y)| \\, d\\sigma',
    description: '以z=f(x,y)为顶，D为底的柱体体积',
    category: 'double-integral',
    tags: ['体积', '应用'],
    example: '半球体积：V = ∫∫√(R²-x²-y²) dxdy'
  },
  {
    id: 'double-13',
    name: '平面薄片质量',
    latex: 'M = \\iint_D \\rho(x,y) \\, d\\sigma',
    description: '密度为ρ(x,y)的平面薄片质量',
    category: 'double-integral',
    tags: ['物理应用', '质量'],
    example: '均匀薄片：M = ρS'
  },
  {
    id: 'double-14',
    name: '平面薄片质心',
    latex: '\\bar{x} = \\frac{1}{M}\\iint_D x\\rho\\,d\\sigma, \\quad \\bar{y} = \\frac{1}{M}\\iint_D y\\rho\\,d\\sigma',
    description: '质心坐标公式，M为总质量',
    category: 'double-integral',
    tags: ['物理应用', '质心'],
    example: '均匀圆盘质心在圆心'
  },
  {
    id: 'double-15',
    name: '平面薄片转动惯量',
    latex: 'I_x = \\iint_D y^2\\rho\\,d\\sigma, \\quad I_y = \\iint_D x^2\\rho\\,d\\sigma, \\quad I_O = I_x + I_y',
    description: '关于x轴、y轴、原点的转动惯量',
    category: 'double-integral',
    tags: ['物理应用', '转动惯量'],
    example: '均匀圆盘：I_O = MR²/2'
  },

  // ===== 三重积分 =====
  {
    id: 'triple-1',
    name: '三重积分定义',
    latex: '\\iiint_V f(x,y,z) \\, dv = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i, \\zeta_i) \\Delta v_i',
    description: '三重积分的黎曼和定义，dv为体积微元',
    category: 'triple-integral',
    tags: ['定义', '基础'],
    example: '物理意义：密度为f的物体质量'
  },
  {
    id: 'triple-2',
    name: '三重积分投影法(先一后二)',
    latex: '\\iiint_V f(x,y,z)\\,dv = \\iint_{D_{xy}} dxdy \\int_{z_1(x,y)}^{z_2(x,y)} f(x,y,z)\\,dz',
    description: '先对z积分(从下曲面到上曲面)，再在投影区域Dxy上二重积分',
    category: 'triple-integral',
    tags: ['投影法', '先一后二', '计算'],
    example: '适用于上下曲面明确的区域'
  },
  {
    id: 'triple-3',
    name: '三重积分截面法(先二后一)',
    latex: '\\iiint_V f(x,y,z)\\,dv = \\int_a^b dz \\iint_{D_z} f(x,y,z)\\,dxdy',
    description: '先在截面Dz上二重积分，再对z积分',
    category: 'triple-integral',
    tags: ['截面法', '先二后一', '计算'],
    example: '适用于截面规则变化，f与x,y无关时更简便'
  },
  {
    id: 'triple-4',
    name: '三重积分柱坐标变换',
    latex: '\\iiint_V f\\,dv = \\iiint_V f(r\\cos\\theta, r\\sin\\theta, z) \\, r\\,dr\\,d\\theta\\,dz',
    description: '柱坐标：x=rcosθ, y=rsinθ, z=z，体积元素 dv = r dr dθ dz',
    category: 'triple-integral',
    tags: ['柱坐标', '变换', '核心'],
    example: '圆柱形、旋转体区域优先使用'
  },
  {
    id: 'triple-5',
    name: '柱坐标典型区域',
    latex: '\\int_{z_1}^{z_2} dz \\int_{\\alpha}^{\\beta} d\\theta \\int_{r_1(\\theta,z)}^{r_2(\\theta,z)} f \\, r \\, dr',
    description: '柱坐标下的积分次序',
    category: 'triple-integral',
    tags: ['柱坐标', '计算'],
    example: '圆柱体：0≤z≤H, 0≤θ≤2π, 0≤r≤R'
  },
  {
    id: 'triple-6',
    name: '三重积分球坐标变换',
    latex: '\\iiint_V f\\,dv = \\iiint_V f(r\\sin\\varphi\\cos\\theta, r\\sin\\varphi\\sin\\theta, r\\cos\\varphi) \\, r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta',
    description: '球坐标：x=rsinφcosθ, y=rsinφsinθ, z=rcosφ，dv=r²sinφ dr dφ dθ',
    category: 'triple-integral',
    tags: ['球坐标', '变换', '核心'],
    example: '球形区域优先使用'
  },
  {
    id: 'triple-7',
    name: '球坐标角度范围',
    latex: 'r \\ge 0, \\quad 0 \\le \\varphi \\le \\pi, \\quad 0 \\le \\theta \\le 2\\pi',
    description: 'φ为极角(与z轴夹角)，θ为方位角，r为半径',
    category: 'triple-integral',
    tags: ['球坐标', '角度'],
    example: '球心在原点的球体：0≤r≤R, 0≤φ≤π, 0≤θ≤2π'
  },
  {
    id: 'triple-8',
    name: '球坐标典型区域',
    latex: '\\int_{\\theta_1}^{\\theta_2} d\\theta \\int_{\\varphi_1}^{\\varphi_2} d\\varphi \\int_{r_1(\\varphi,\\theta)}^{r_2(\\varphi,\\theta)} f \\, r^2\\sin\\varphi \\, dr',
    description: '球坐标下的积分次序',
    category: 'triple-integral',
    tags: ['球坐标', '计算'],
    example: '球体体积：∫₀²πdθ∫₀ᴨdφ∫₀ᴿr²sinφ dr = 4πR³/3'
  },
  {
    id: 'triple-9',
    name: '三重积分对称性(关于xy面)',
    latex: 'V关于xy面对称：\\iiint_V f\\,dv = \\begin{cases} 0 & f(x,y,-z)=-f(x,y,z) \\\\ 2\\iiint_{V_1} f\\,dv & f(x,y,-z)=f(x,y,z) \\end{cases}',
    description: '利用xy面对称性',
    category: 'triple-integral',
    tags: ['对称性', '技巧'],
    example: '奇函数在对称区域积分为零'
  },
  {
    id: 'triple-10',
    name: '三重积分对称性(关于坐标面)',
    latex: '\\text{关于yz面：}f(-x,y,z)=\\pm f \\quad \\text{关于xz面：}f(x,-y,z)=\\pm f',
    description: '三个坐标面的对称性可综合使用',
    category: 'triple-integral',
    tags: ['对称性', '技巧'],
    example: '球体积分常用对称性简化'
  },
  {
    id: 'triple-11',
    name: '三重积分变量代换',
    latex: '\\iiint_V f\\,dxdydz = \\iiint_{V\'} f(x,y,z) \\left| \\frac{\\partial(x,y,z)}{\\partial(u,v,w)} \\right| du\\,dv\\,dw',
    description: '雅可比行列式：|∂(x,y,z)/∂(u,v,w)|',
    category: 'triple-integral',
    tags: ['变量代换', '雅可比', '高级'],
    example: '椭球变换：x=arsinφcosθ, y=brsinφsinθ, z=crsinφ'
  },
  {
    id: 'triple-12',
    name: '空间区域体积',
    latex: 'V = \\iiint_\\Omega dv = \\iiint_\\Omega dxdydz',
    description: '三重积分求空间区域体积',
    category: 'triple-integral',
    tags: ['体积', '应用'],
    example: '椭球体积：V = 4πabc/3'
  },
  {
    id: 'triple-13',
    name: '物体质量',
    latex: 'M = \\iiint_V \\rho(x,y,z) \\, dv',
    description: '密度为ρ(x,y,z)的物体质量',
    category: 'triple-integral',
    tags: ['物理应用', '质量'],
    example: '均匀物体：M = ρV'
  },
  {
    id: 'triple-14',
    name: '物体质心',
    latex: '\\bar{x} = \\frac{1}{M}\\iiint_V x\\rho\\,dv, \\quad \\bar{y} = \\frac{1}{M}\\iiint_V y\\rho\\,dv, \\quad \\bar{z} = \\frac{1}{M}\\iiint_V z\\rho\\,dv',
    description: '质心坐标公式',
    category: 'triple-integral',
    tags: ['物理应用', '质心'],
    example: '均匀球体质心在球心'
  },
  {
    id: 'triple-15',
    name: '物体转动惯量',
    latex: 'I_x = \\iiint_V (y^2+z^2)\\rho\\,dv, \\quad I_y = \\iiint_V (x^2+z^2)\\rho\\,dv, \\quad I_z = \\iiint_V (x^2+y^2)\\rho\\,dv',
    description: '关于坐标轴的转动惯量',
    category: 'triple-integral',
    tags: ['物理应用', '转动惯量'],
    example: '均匀球体关于直径：I = 2MR²/5'
  },
  {
    id: 'triple-16',
    name: '坐标系选择原则',
    latex: '\\text{圆柱形} \\to \\text{柱坐标} \\quad \\text{球形} \\to \\text{球坐标} \\quad \\text{长方体} \\to \\text{直角坐标}',
    description: '根据区域形状选择合适的坐标系',
    category: 'triple-integral',
    tags: ['坐标系', '技巧'],
    example: '选择合适的坐标系可大大简化计算'
  },

  // ===== 微分方程 =====
  // 一阶微分方程
  {
    id: 'ode-1',
    name: '可分离变量方程',
    latex: '\\frac{dy}{dx} = f(x)g(y) \\Rightarrow \\int \\frac{dy}{g(y)} = \\int f(x)dx',
    description: '将x和y分离后两边积分',
    category: 'differential-equations',
    tags: ['一阶', '基础', '分离变量'],
    example: 'y\' = xy → dy/y = xdx → ln|y| = x²/2 + C'
  },
  {
    id: 'ode-2',
    name: '齐次方程',
    latex: '\\frac{dy}{dx} = f(\\frac{y}{x}) \\xrightarrow{u=y/x} x\\frac{du}{dx} + u = f(u)',
    description: '令u=y/x化为可分离变量方程',
    category: 'differential-equations',
    tags: ['一阶', '齐次', '变量替换'],
    example: 'y\' = y/x + (y/x)² → u\' = u²/x'
  },
  {
    id: 'ode-3',
    name: '一阶线性微分方程',
    latex: '\\frac{dy}{dx} + P(x)y = Q(x) \\Rightarrow y = e^{-\\int Pdx}\\left(\\int Qe^{\\int Pdx}dx + C\\right)',
    description: '通解公式：常数变易法推导',
    category: 'differential-equations',
    tags: ['一阶', '线性', '通解公式'],
    example: 'y\' + y/x = sinx/x → y = (C - cosx)/x'
  },
  {
    id: 'ode-4',
    name: '伯努利方程',
    latex: '\\frac{dy}{dx} + P(x)y = Q(x)y^n \\xrightarrow{z=y^{1-n}} \\frac{dz}{dx} + (1-n)Pz = (1-n)Q',
    description: 'n≠0,1，令z=y^(1-n)化为一阶线性方程',
    category: 'differential-equations',
    tags: ['一阶', '伯努利', '变量替换'],
    example: 'y\' + y/x = y² → z=1/y → z\' - z/x = -1'
  },
  {
    id: 'ode-5',
    name: '全微分方程',
    latex: 'P(x,y)dx + Q(x,y)dy = 0, \\quad \\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}',
    description: '条件：∂P/∂y = ∂Q/∂x，存在u使du=Pdx+Qdy',
    category: 'differential-equations',
    tags: ['一阶', '全微分', '恰当方程'],
    example: '通解：u(x,y) = C，其中∂u/∂x=P, ∂u/∂y=Q'
  },
  {
    id: 'ode-6',
    name: '积分因子法',
    latex: '\\mu(x,y)[Pdx + Qdy] = 0 \\quad \\text{使} \\frac{\\partial(\\mu P)}{\\partial y} = \\frac{\\partial(\\mu Q)}{\\partial x}',
    description: '若∂P/∂y≠∂Q/∂x，找积分因子μ使其成为全微分方程',
    category: 'differential-equations',
    tags: ['一阶', '积分因子', '技巧'],
    example: '常用积分因子：μ=x^m·y^n 或 μ=e^(∫f(x)dx)'
  },

  // 二阶微分方程
  {
    id: 'ode-7',
    name: '二阶常系数齐次方程',
    latex: 'y\'\' + py\' + qy = 0, \\quad \\text{特征方程}: r^2 + pr + q = 0',
    description: '根据特征根情况写出通解',
    category: 'differential-equations',
    tags: ['二阶', '常系数', '齐次'],
    example: '特征根r₁,r₂ → y = C₁e^(r₁x) + C₂e^(r₂x)'
  },
  {
    id: 'ode-8',
    name: '二阶齐次方程通解（不等实根）',
    latex: 'r_1 \\neq r_2 \\Rightarrow y = C_1 e^{r_1 x} + C_2 e^{r_2 x}',
    description: '特征方程有两个不等实根时',
    category: 'differential-equations',
    tags: ['二阶', '特征根', '通解'],
    example: 'y\'\'-3y\'+2y=0 → r=1,2 → y=C₁e^x+C₂e^(2x)'
  },
  {
    id: 'ode-9',
    name: '二阶齐次方程通解（重根）',
    latex: 'r_1 = r_2 = r \\Rightarrow y = (C_1 + C_2 x) e^{rx}',
    description: '特征方程有两个相等实根时',
    category: 'differential-equations',
    tags: ['二阶', '重根', '通解'],
    example: 'y\'\'-2y\'+y=0 → r=1(重) → y=(C₁+C₂x)e^x'
  },
  {
    id: 'ode-10',
    name: '二阶齐次方程通解（共轭复根）',
    latex: 'r = \\alpha \\pm i\\beta \\Rightarrow y = e^{\\alpha x}(C_1 \\cos\\beta x + C_2 \\sin\\beta x)',
    description: '特征方程有两个共轭复根时',
    category: 'differential-equations',
    tags: ['二阶', '复根', '通解'],
    example: 'y\'\'+y=0 → r=±i → y=C₁cosx+C₂sinx'
  },
  {
    id: 'ode-11',
    name: '二阶非齐次方程通解结构',
    latex: 'y\'\' + py\' + qy = f(x) \\Rightarrow y = \\bar{y} + y^*',
    description: 'ȳ为对应齐次方程通解，y*为特解',
    category: 'differential-equations',
    tags: ['二阶', '非齐次', '通解结构'],
    example: '非齐次通解 = 齐次通解 + 特解'
  },
  {
    id: 'ode-12',
    name: '特解形式（指数型）',
    latex: 'f(x) = e^{\\lambda x}P_m(x) \\Rightarrow y^* = x^k e^{\\lambda x}Q_m(x)',
    description: 'k=λ作为特征根的重数（0,1,2），Q_m为m次多项式',
    category: 'differential-equations',
    tags: ['二阶', '特解', '指数型'],
    example: 'f(x)=e^x → λ=1，若1是单根则k=1'
  },
  {
    id: 'ode-13',
    name: '特解形式（三角型）',
    latex: 'f(x) = e^{\\alpha x}[P_m\\cos\\beta x + Q_n\\sin\\beta x] \\Rightarrow y^* = x^k e^{\\alpha x}[A\\cos\\beta x + B\\sin\\beta x]',
    description: 'k=0若α±iβ不是特征根，k=1若是特征根',
    category: 'differential-equations',
    tags: ['二阶', '特解', '三角型'],
    example: 'f(x)=sinx → 若±i是特征根则k=1'
  },
  {
    id: 'ode-14',
    name: '常数变易法',
    latex: 'y^* = C_1(x)y_1 + C_2(x)y_2',
    description: '用齐次通解的两个基解构造特解',
    category: 'differential-equations',
    tags: ['二阶', '特解', '常数变易'],
    example: 'C₁\'y₁ + C₂\'y₂ = 0, C₁\'y₁\' + C₂\'y₂\' = f(x)'
  },

  // 可降阶微分方程
  {
    id: 'ode-15',
    name: 'y\'\' = f(x)型',
    latex: 'y\'\' = f(x) \\Rightarrow y\' = \\int f(x)dx + C_1, \\quad y = \\iint f(x)dx dx + C_1x + C_2',
    description: '直接积分两次',
    category: 'differential-equations',
    tags: ['降阶', '直接积分', '基础'],
    example: 'y\'\' = x → y\' = x²/2 + C₁ → y = x³/6 + C₁x + C₂'
  },
  {
    id: 'ode-16',
    name: 'y\'\' = f(x, y\')型',
    latex: 'y\'\' = f(x, y\') \\xrightarrow{p=y\'} \\frac{dp}{dx} = f(x, p)',
    description: '缺y，令p=y\'降为一阶方程',
    category: 'differential-equations',
    tags: ['降阶', '缺y', '变量替换'],
    example: 'y\'\' = y\' + x → p\' = p + x（一阶线性）'
  },
  {
    id: 'ode-17',
    name: 'y\'\' = f(y, y\')型',
    latex: 'y\'\' = f(y, y\') \\xrightarrow{p=y\'} p\\frac{dp}{dy} = f(y, p)',
    description: '缺x，令p=y\'，y\'\'=p·dp/dy',
    category: 'differential-equations',
    tags: ['降阶', '缺x', '变量替换'],
    example: 'y\'\' = y → p·dp/dy = y → p² = y² + C'
  },

  // 高阶微分方程
  {
    id: 'ode-18',
    name: '高阶常系数齐次方程',
    latex: 'y^{(n)} + a_1 y^{(n-1)} + \\cdots + a_n y = 0',
    description: '特征方程有n个根，根据根的类型写出通解',
    category: 'differential-equations',
    tags: ['高阶', '常系数', '齐次'],
    example: '每个k重根r贡献：e^(rx)(C₁+C₂x+...+C_k·x^(k-1))'
  },
  {
    id: 'ode-19',
    name: '欧拉方程',
    latex: 'x^n y^{(n)} + a_1 x^{n-1} y^{(n-1)} + \\cdots + a_n y = f(x)',
    description: '令x=e^t化为常系数方程',
    category: 'differential-equations',
    tags: ['高阶', '欧拉方程', '变量替换'],
    example: 'x²y\'\'+xy\'-y=0 → 令x=e^t → D(D-1)y+Dy-y=0'
  },

  // 微分方程组
  {
    id: 'ode-20',
    name: '一阶线性微分方程组',
    latex: '\\frac{d\\mathbf{x}}{dt} = A\\mathbf{x} + \\mathbf{f}(t)',
    description: '矩阵形式的一阶线性方程组',
    category: 'differential-equations',
    tags: ['方程组', '矩阵', '高阶'],
    example: '通解由矩阵指数e^(At)给出'
  },

  // 应用模型
  {
    id: 'ode-21',
    name: '人口增长模型（Malthus）',
    latex: '\\frac{dN}{dt} = rN \\Rightarrow N(t) = N_0 e^{rt}',
    description: '指数增长，r为增长率',
    category: 'differential-equations',
    tags: ['应用', '人口模型', '增长'],
    example: '无资源限制的理想增长'
  },
  {
    id: 'ode-22',
    name: 'Logistic增长模型',
    latex: '\\frac{dN}{dt} = rN(1 - \\frac{N}{K}) \\Rightarrow N(t) = \\frac{K}{1 + (\\frac{K}{N_0} - 1)e^{-rt}}',
    description: 'K为环境容纳量，有增长上限',
    category: 'differential-equations',
    tags: ['应用', '人口模型', 'Logistic'],
    example: 'S型增长曲线'
  },
  {
    id: 'ode-23',
    name: '阻尼振动方程',
    latex: 'm\\frac{d^2x}{dt^2} + c\\frac{dx}{dt} + kx = 0',
    description: 'm质量，c阻尼系数，k弹性系数',
    category: 'differential-equations',
    tags: ['应用', '振动', '物理'],
    example: '欠阻尼、临界阻尼、过阻尼三种情况'
  },
  {
    id: 'ode-24',
    name: 'RLC电路方程',
    latex: 'L\\frac{d^2q}{dt^2} + R\\frac{dq}{dt} + \\frac{q}{C} = E(t)',
    description: 'L电感，R电阻，C电容，E电源电动势',
    category: 'differential-equations',
    tags: ['应用', '电路', '物理'],
    example: '与阻尼振动方程数学形式相同'
  },

  // ===== 极限与连续 =====
  // 数列极限
  {
    id: 'limit-1',
    name: '数列极限定义（ε-N语言）',
    latex: '\\lim_{n \\to \\infty} x_n = A \\Leftrightarrow \\forall \\varepsilon > 0, \\exists N, n > N \\Rightarrow |x_n - A| < \\varepsilon',
    description: '对于任意给定的正数ε，存在正整数N，当n>N时，|xₙ-A|<ε',
    category: 'limits',
    tags: ['数列极限', '定义', '基础'],
    example: '证明 lim(1/n) = 0：取 N = [1/ε]'
  },
  {
    id: 'limit-2',
    name: '函数极限定义（ε-δ语言）',
    latex: '\\lim_{x \\to x_0} f(x) = A \\Leftrightarrow \\forall \\varepsilon > 0, \\exists \\delta > 0, 0 < |x - x_0| < \\delta \\Rightarrow |f(x) - A| < \\varepsilon',
    description: '对于任意ε>0，存在δ>0，当0<|x-x₀|<δ时，|f(x)-A|<ε',
    category: 'limits',
    tags: ['函数极限', '定义', '基础'],
    example: '证明 lim(x→2)(3x-1) = 5：取 δ = ε/3'
  },
  {
    id: 'limit-3',
    name: '左极限与右极限',
    latex: '\\lim_{x \\to x_0^-} f(x) = A, \\quad \\lim_{x \\to x_0^+} f(x) = A',
    description: '极限存在的充要条件：左极限=右极限',
    category: 'limits',
    tags: ['函数极限', '左右极限', '判定'],
    example: 'lim(x→0)|x|/x 不存在，因为左极限=-1，右极限=1'
  },
  {
    id: 'limit-4',
    name: '无穷远处极限',
    latex: '\\lim_{x \\to +\\infty} f(x) = A \\Leftrightarrow \\forall \\varepsilon > 0, \\exists X, x > X \\Rightarrow |f(x) - A| < \\varepsilon',
    description: 'x趋向正无穷时函数的极限',
    category: 'limits',
    tags: ['函数极限', '无穷', '定义'],
    example: 'lim(x→+∞)(1/x) = 0'
  },

  // 极限运算法则
  {
    id: 'limit-5',
    name: '极限的四则运算',
    latex: '\\lim(f \\pm g) = \\lim f \\pm \\lim g, \\quad \\lim(f \\cdot g) = \\lim f \\cdot \\lim g, \\quad \\lim\\frac{f}{g} = \\frac{\\lim f}{\\lim g}(\\lim g \\neq 0)',
    description: '极限可分别进行加、减、乘、除运算（除法要求分母极限不为零）',
    category: 'limits',
    tags: ['运算法则', '四则运算', '基础'],
    example: 'lim(x→1)(x²+2x) = 1 + 2 = 3'
  },
  {
    id: 'limit-6',
    name: '复合函数极限',
    latex: '\\lim_{x \\to x_0} f[g(x)] = f[\\lim_{x \\to x_0} g(x)] \\quad (f连续)',
    description: '若f连续，则极限可交换',
    category: 'limits',
    tags: ['运算法则', '复合函数', '连续'],
    example: 'lim(x→0)sin(2x) = sin(0) = 0'
  },
  {
    id: 'limit-7',
    name: '夹逼定理（三明治定理）',
    latex: 'g(x) \\le f(x) \\le h(x), \\lim g = \\lim h = A \\Rightarrow \\lim f = A',
    description: '若g(x)≤f(x)≤h(x)，且g、h极限均为A，则f极限也为A',
    category: 'limits',
    tags: ['定理', '夹逼', '判定'],
    example: '证明 lim(x→0)x·sin(1/x) = 0：-|x| ≤ x·sin(1/x) ≤ |x|'
  },
  {
    id: 'limit-8',
    name: '单调有界原理',
    latex: '\\text{单调递增有上界} \\Rightarrow \\text{收敛}, \\quad \\text{单调递减有下界} \\Rightarrow \\text{收敛}',
    description: '单调有界数列必收敛',
    category: 'limits',
    tags: ['定理', '单调', '判定'],
    example: '证明 xₙ = (1+1/n)^n 收敛到 e'
  },

  // 两个重要极限
  {
    id: 'limit-9',
    name: '重要极限一',
    latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
    description: '正弦函数与自变量的比值极限，用于处理三角函数的极限',
    category: 'limits',
    tags: ['重要极限', '三角函数', '常用'],
    example: 'lim(x→0)sin(3x)/x = 3·lim(x→0)sin(3x)/(3x) = 3'
  },
  {
    id: 'limit-10',
    name: '重要极限二',
    latex: '\\lim_{x \\to 0} (1 + x)^{\\frac{1}{x}} = e, \\quad \\lim_{n \\to \\infty} (1 + \\frac{1}{n})^n = e',
    description: '1的无穷次方型极限，自然常数e的定义',
    category: 'limits',
    tags: ['重要极限', '指数', '常用'],
    example: 'lim(n→∞)(1+2/n)^n = lim(n→∞)[(1+2/n)^(n/2)]² = e²'
  },

  // 无穷小与无穷大
  {
    id: 'limit-11',
    name: '无穷小的定义',
    latex: '\\lim f(x) = 0 \\Leftrightarrow f(x) \\text{是无穷小}',
    description: '极限为零的变量称为无穷小',
    category: 'limits',
    tags: ['无穷小', '定义', '基础'],
    example: 'x→0时，x、sinx、tanx都是无穷小'
  },
  {
    id: 'limit-12',
    name: '无穷小的比较',
    latex: '\\lim\\frac{\\alpha}{\\beta} = \\begin{cases} 0 & \\text{高阶无穷小} \\\\ c \\neq 0 & \\text{同阶无穷小} \\\\ 1 & \\text{等价无穷小} \\end{cases}',
    description: '通过比较极限判断无穷小的阶',
    category: 'limits',
    tags: ['无穷小', '比较', '阶'],
    example: 'x→0时，sinx与x是等价无穷小'
  },
  {
    id: 'limit-13',
    name: '常用等价无穷小',
    latex: 'x \\to 0: \\sin x \\sim x, \\tan x \\sim x, \\ln(1+x) \\sim x, e^x - 1 \\sim x, 1-\\cos x \\sim \\frac{x^2}{2}',
    description: 'x→0时的常用等价无穷小替换',
    category: 'limits',
    tags: ['无穷小', '等价', '常用'],
    example: 'lim(x→0)sin(2x)/tan(3x) = lim(x→0)(2x)/(3x) = 2/3'
  },
  {
    id: 'limit-14',
    name: '无穷大',
    latex: '\\lim f(x) = \\infty \\Leftrightarrow \\forall M > 0, \\exists \\delta, 0 < |x-x_0| < \\delta \\Rightarrow |f(x)| > M',
    description: '极限为无穷的变量称为无穷大',
    category: 'limits',
    tags: ['无穷大', '定义', '基础'],
    example: 'lim(x→0)1/x² = +∞'
  },
  {
    id: 'limit-15',
    name: '无穷大与无穷小的关系',
    latex: 'f(x) \\to \\infty \\Leftrightarrow \\frac{1}{f(x)} \\to 0, \\quad f(x) \\to 0(f \\neq 0) \\Leftrightarrow \\frac{1}{f(x)} \\to \\infty',
    description: '无穷大的倒数是无穷小，非零无穷小的倒数是无穷大',
    category: 'limits',
    tags: ['无穷小', '无穷大', '关系'],
    example: 'lim(x→0)1/x = ∞，lim(x→∞)1/x = 0'
  },

  // 函数连续性
  {
    id: 'limit-16',
    name: '函数连续定义',
    latex: '\\lim_{x \\to x_0} f(x) = f(x_0) \\Leftrightarrow f(x_0^-) = f(x_0) = f(x_0^+)',
    description: '函数在某点连续：极限值等于函数值',
    category: 'limits',
    tags: ['连续', '定义', '基础'],
    example: '多项式函数在R上连续'
  },
  {
    id: 'limit-17',
    name: '连续的ε-δ定义',
    latex: '\\forall \\varepsilon > 0, \\exists \\delta > 0, |x - x_0| < \\delta \\Rightarrow |f(x) - f(x_0)| < \\varepsilon',
    description: '函数连续的严格定义',
    category: 'limits',
    tags: ['连续', '定义', '严格'],
    example: '与极限定义的区别：x=x₀时也满足'
  },
  {
    id: 'limit-18',
    name: '间断点类型',
    latex: '\\text{可去间断点: } f(x_0^-) = f(x_0^+) \\neq f(x_0); \\text{跳跃间断点: } f(x_0^-) \\neq f(x_0^+)',
    description: '第一类间断点：左右极限存在；第二类间断点：左右极限至少一个不存在',
    category: 'limits',
    tags: ['连续', '间断点', '分类'],
    example: 'y=|x|/x在x=0处为跳跃间断点'
  },
  {
    id: 'limit-19',
    name: '连续函数的性质',
    latex: '\\text{基本初等函数在其定义域内连续；初等函数在其定义区间内连续}',
    description: '初等函数的连续性定理',
    category: 'limits',
    tags: ['连续', '初等函数', '性质'],
    example: 'sinx、lnx、eˣ在其定义域内都连续'
  },
  {
    id: 'limit-20',
    name: '闭区间上连续函数的性质',
    latex: 'f \\in C[a,b] \\Rightarrow \\text{有界性定理、最值定理、介值定理、零点定理}',
    description: '闭区间连续函数的四条重要性质',
    category: 'limits',
    tags: ['连续', '闭区间', '定理'],
    example: 'f(1)·f(2)<0，则存在ξ∈(1,2)使f(ξ)=0'
  },
  {
    id: 'limit-21',
    name: '介值定理',
    latex: 'f \\in C[a,b], f(a) < C < f(b) \\Rightarrow \\exists \\xi \\in (a,b), f(\\xi) = C',
    description: '连续函数可以取到介于两端函数值之间的任何值',
    category: 'limits',
    tags: ['连续', '介值定理', '应用'],
    example: '证明方程有解：构造辅助函数应用介值定理'
  },
  {
    id: 'limit-22',
    name: '零点定理',
    latex: 'f \\in C[a,b], f(a) \\cdot f(b) < 0 \\Rightarrow \\exists \\xi \\in (a,b), f(\\xi) = 0',
    description: '闭区间连续函数在两端点值异号，则必有零点',
    category: 'limits',
    tags: ['连续', '零点定理', '应用'],
    example: '证明x³+x-1=0在(0,1)内有根'
  },

  // 极限计算技巧
  {
    id: 'limit-23',
    name: '洛必达法则（0/0型）',
    latex: '\\lim\\frac{f}{g} = \\lim\\frac{f\'}{g\'} \\quad (\\lim f = \\lim g = 0)',
    description: '分子分母都趋于0时，可对分子分母分别求导',
    category: 'limits',
    tags: ['计算方法', '洛必达', '不定式'],
    example: 'lim(x→0)(sinx-x)/x³ = lim(x→0)(cosx-1)/3x² = -1/6'
  },
  {
    id: 'limit-24',
    name: '洛必达法则（∞/∞型）',
    latex: '\\lim\\frac{f}{g} = \\lim\\frac{f\'}{g\'} \\quad (\\lim f = \\lim g = \\infty)',
    description: '分子分母都趋于无穷时，可对分子分母分别求导',
    category: 'limits',
    tags: ['计算方法', '洛必达', '不定式'],
    example: 'lim(x→+∞)(lnx)/x = lim(x→+∞)(1/x)/1 = 0'
  },
  {
    id: 'limit-25',
    name: '泰勒展开求极限',
    latex: 'f(x) = f(0) + f\'(0)x + \\frac{f\'\'(0)}{2!}x^2 + \\cdots',
    description: '用泰勒展开处理复杂极限，特别适用于高阶无穷小的比较',
    category: 'limits',
    tags: ['计算方法', '泰勒展开', '技巧'],
    example: 'sinx = x - x³/6 + o(x³)'
  },
  {
    id: 'limit-26',
    name: '抓大头方法',
    latex: '\\lim_{x \\to \\infty} \\frac{a_n x^n + \\cdots}{b_m x^m + \\cdots} = \\begin{cases} 0 & n < m \\\\ \\frac{a_n}{b_m} & n = m \\\\ \\infty & n > m \\end{cases}',
    description: '有理函数在无穷远处极限，取决于最高次项',
    category: 'limits',
    tags: ['计算方法', '有理函数', '技巧'],
    example: 'lim(x→∞)(3x²+x)/(2x²+1) = 3/2'
  },
  {
    id: 'limit-27',
    name: '有理化方法',
    latex: '\\frac{\\sqrt{a} - \\sqrt{b}}{c} \\cdot \\frac{\\sqrt{a} + \\sqrt{b}}{\\sqrt{a} + \\sqrt{b}} = \\frac{a-b}{c(\\sqrt{a} + \\sqrt{b})}',
    description: '分子或分母含有根式时，乘以共轭式进行有理化',
    category: 'limits',
    tags: ['计算方法', '有理化', '技巧'],
    example: 'lim(x→0)(√(1+x)-1)/x = lim(x→0)1/(√(1+x)+1) = 1/2'
  }
];

// 分类数据
const CATEGORIES: Category[] = [
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'favorites', name: '我的收藏', icon: '⭐' },
  { id: 'limits', name: '极限与连续', icon: '∞' },
  { id: 'algebra', name: '代数', icon: '📐' },
  { id: 'trigonometry', name: '三角函数', icon: '📊' },
  { id: 'geometry', name: '几何', icon: '📏' },
  { id: 'calculus', name: '微积分', icon: '∫' },
  { id: 'derivatives', name: '导数表', icon: '∂' },
  { id: 'integrals', name: '积分表', icon: '∬' },
  { id: 'theorems', name: '微分定理', icon: '📜' },
  { id: 'series', name: '无穷级数', icon: '∑' },
  { id: 'sequence', name: '数列', icon: '🔢' },
  { id: 'double-integral', name: '二重积分', icon: '∬' },
  { id: 'triple-integral', name: '三重积分', icon: '∭' },
  { id: 'line-integral', name: '曲线积分', icon: '〰' },
  { id: 'surface-integral', name: '曲面积分', icon: '🌐' },
  { id: 'differential-equations', name: '微分方程', icon: '📐' },
  { id: 'probability', name: '概率统计', icon: '🎲' },
  { id: 'vector', name: '向量代数', icon: '→' },
  { id: 'analytic-geometry', name: '空间解析几何', icon: '📐' },
  { id: 'multivariable-diff', name: '多元微分', icon: '∂²' }
];

const FormulaBook: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // 从localStorage加载收藏
    try {
      const saved = localStorage.getItem('formula-favorites');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('加载收藏失败:', e);
    }
    return new Set();
  });
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);

  // 保存收藏到localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('formula-favorites', JSON.stringify([...favorites]));
    } catch (e) {
      console.error('保存收藏失败:', e);
    }
  }, [favorites]);

  // 过滤公式
  const filteredFormulas = useMemo(() => {
    return FORMULAS.filter(formula => {
      // 收藏分类特殊处理
      if (activeCategory === 'favorites') {
        return favorites.has(formula.id);
      }
      const matchCategory = activeCategory === 'all' || formula.category === activeCategory;
      const matchSearch = !searchQuery || 
        formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formula.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        formula.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, favorites]);

  // 切换收藏
  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="formula-book">
      {/* 左侧分类导航 */}
      <div className="formula-book__sidebar">
        <div className="sidebar-header">
          <h2>公式分类</h2>
        </div>
        <div className="category-list">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
              <span className="category-count">
                {cat.id === 'all' ? FORMULAS.length : 
                 cat.id === 'favorites' ? favorites.size : 
                 FORMULAS.filter(f => f.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="formula-book__main">
        {/* 搜索栏 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索公式名称、标签或描述..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-count">{filteredFormulas.length} 个公式</span>
        </div>

        {/* 公式列表 */}
        <div className="formula-grid">
          {filteredFormulas.map(formula => (
            <div
              key={formula.id}
              className={`formula-card ${selectedFormula?.id === formula.id ? 'selected' : ''}`}
              onClick={() => setSelectedFormula(formula)}
            >
              <div className="formula-header">
                <h3 className="formula-name">{formula.name}</h3>
                <div className="formula-tags">
                  {formula.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <button
                  className={`favorite-btn ${favorites.has(formula.id) ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(formula.id); }}
                >
                  {favorites.has(formula.id) ? '★' : '☆'}
                </button>
              </div>
              <div className="formula-latex"><MathFormula latex={formula.latex} /></div>
            </div>
          ))}
        </div>

        {/* 公式详情面板 */}
        {selectedFormula && (
          <div className="formula-detail">
            <div className="detail-header">
              <h2>{selectedFormula.name}</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedFormula(null)}
              >
                ✕
              </button>
            </div>
            <div className="detail-latex"><MathFormula latex={selectedFormula.latex} /></div>
            <div className="detail-section">
              <h4>📖 说明</h4>
              <p>{selectedFormula.description}</p>
            </div>
            {selectedFormula.example && (
              <div className="detail-section">
                <h4>📝 示例</h4>
                <p className="example-text">{selectedFormula.example}</p>
              </div>
            )}
            <div className="detail-tags">
              {selectedFormula.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaBook;
