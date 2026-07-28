import React, { useState, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './FormulaDerivation.css';

// 预处理 LaTeX 公式
const preprocessLatex = (latex: string): string => {
  let processed = latex;
  
  // 移除多余的空白字符，但保留单个空格
  processed = processed.replace(/\s+/g, ' ').trim();
  
  return processed;
};

// 数学公式渲染组件
const MathFormula: React.FC<{ latex: string; displayMode?: boolean }> = ({ latex, displayMode = false }) => {
  const html = useMemo(() => {
    try {
      const processedLatex = preprocessLatex(latex);
      return katex.renderToString(processedLatex, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch (e) {
      console.error('KaTeX error:', e, 'for latex:', latex);
      return `<span style="color: #c00; background: #fee; padding: 2px 4px; border-radius: 3px;">[公式错误: ${latex.substring(0, 30)}...]</span>`;
    }
  }, [latex, displayMode]);

  return <span className="math-formula-wrapper" dangerouslySetInnerHTML={{ __html: html }} />;
};

// 辅助函数：渲染块级公式
const MathFormulaBlock: React.FC<{ latex: string }> = ({ latex }) => {
  const html = useMemo(() => {
    try {
      const processedLatex = preprocessLatex(latex);
      return katex.renderToString(processedLatex, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch (e) {
      console.error('KaTeX block error:', e, 'for latex:', latex);
      return `<div style="color: #c00; background: #fee; padding: 10px; border: 1px solid #c00; border-radius: 4px;">[公式错误]<br><code>${latex.substring(0, 100)}...</code></div>`;
    }
  }, [latex]);

  return <div className="math-formula-block" dangerouslySetInnerHTML={{ __html: html }} />;
};

// 推导内容项
interface DerivationItem {
  id: string;
  title: string;
  introduction: string;
  derivation: string;
  conclusion: string;
  applications: string[];
}

// ============================================
// 高等数学上册 公式推导
// ============================================

// 函数与极限公式推导数据
const LIMITS_DERIVATIONS: DerivationItem[] = [
  {
    id: 'lim-sinx-over-x',
    title: '重要极限 lim(sin x / x) = 1 的推导',
    introduction: '这是微积分的第一个重要极限，其推导使用了单位圆和面积比较的几何方法。',
    derivation: `**问题设置**

证明 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$。

---

**几何方法（面积比较）**

在单位圆中，设圆心角为 $x$（$0 < x < \\frac{\\pi}{2}$），比较三个面积：

1. 三角形 $\\triangle OAB$ 面积：$S_1 = \\frac{1}{2} \\sin x$
2. 扇形 $OAB$ 面积：$S_2 = \\frac{1}{2} x$
3. 三角形 $\\triangle OAC$ 面积（$C$ 在切线上）：$S_3 = \\frac{1}{2} \\tan x$

由几何关系：$S_1 < S_2 < S_3$，即：

$$\\frac{1}{2}\\sin x < \\frac{1}{2}x < \\frac{1}{2}\\tan x$$

---

**夹逼**

除以 $\\frac{1}{2}\\sin x$：

$$1 < \\frac{x}{\\sin x} < \\frac{1}{\\cos x}$$

取倒数（注意不等号方向改变）：

$$\\cos x < \\frac{\\sin x}{x} < 1$$

当 $x \\to 0$ 时，$\\cos x \\to 1$，由夹逼定理：

$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$`,
    conclusion: '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$，几何方法：单位圆中三角形面积 < 扇形面积 < 大三角形面积，夹逼得证',
    applications: [
      '$\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 3\\lim_{x \\to 0} \\frac{\\sin 3x}{3x} = 3$',
      '$\\lim_{x \\to 0} \\frac{\\tan x}{x} = \\lim \\frac{\\sin x}{x} \\cdot \\frac{1}{\\cos x} = 1$',
      '等价无穷小的基础：$\\sin x \\sim x$（$x \\to 0$）'
    ]
  },
  {
    id: 'lim-e-series',
    title: '重要极限 lim(1+1/x)^x = e 的推导',
    introduction: '第二个重要极限是自然对数底e的定义基础，通过单调有界准则证明。',
    derivation: `**问题设置**

证明 $\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e$。

---

**第一步：证明数列单调递增**

设 $x_n = \\left(1 + \\frac{1}{n}\\right)^n$，利用均值不等式（$n$ 个正数的几何平均 $\\leq$ 算术平均）：

取 $n+1$ 个数：一个 $1$，$n$ 个 $\\left(1 + \\frac{1}{n}\\right)$：

$$\\sqrt[n+1]{1 \\cdot \\left(1+\\frac{1}{n}\\right)^n} \\leq \\frac{1 + n\\left(1+\\frac{1}{n}\\right)}{n+1} = 1 + \\frac{1}{n+1}$$

两边 $(n+1)$ 次方：

$$\\left(1+\\frac{1}{n}\\right)^n \\leq \\left(1+\\frac{1}{n+1}\\right)^{n+1}$$

即 $x_n \\leq x_{n+1}$，数列递增。

---

**第二步：证明有上界**

取 $n+1$ 个数：一个 $1$，$n$ 个 $\\left(1 - \\frac{1}{n}\\right)$，类似用均值不等式可得：

$$\\left(1+\\frac{1}{n}\\right)^n < \\left(1-\\frac{1}{n+1}\\right)^{-(n+1)}$$

进一步可证 $x_n < 3$（利用二项式展开，$x_n < 1 + 1 + \\frac{1}{2!} + \\cdots + \\frac{1}{n!} < 3$）。

---

**第三步：应用单调有界准则**

递增 + 有上界 → 极限存在，记为 $e \\approx 2.71828...$`,
    conclusion: '$\\lim_{n \\to \\infty}(1+\\frac{1}{n})^n = e$，单调递增+有上界=极限存在',
    applications: [
      '$\\lim_{x \\to \\infty}(1+\\frac{2}{x})^x = \\lim(1+\\frac{2}{x})^{x/2 \\cdot 2} = e^2$',
      '$1^{\\infty}$ 型极限的通用公式：$\\lim u^v = e^{\\lim v(u-1)}$',
      '连续化：$\\lim_{x \\to 0}(1+x)^{1/x} = e$'
    ]
  },
  {
    id: 'lim-equivalent-infinitesimal',
    title: '常见等价无穷小的推导',
    introduction: '等价无穷小替换是求极限的核心技巧，所有常见等价无穷小都可以从Taylor展开或重要极限推导。',
    derivation: `**核心等价无穷小（$x \\to 0$）**

$$\\sin x \\sim x, \\quad \\tan x \\sim x, \\quad \\arcsin x \\sim x, \\quad \\arctan x \\sim x$$
$$\\ln(1+x) \\sim x, \\quad e^x - 1 \\sim x, \\quad 1 - \\cos x \\sim \\frac{x^2}{2}, \\quad (1+x)^\\alpha - 1 \\sim \\alpha x$$

---

**推导 $\\sin x \\sim x$**

直接由重要极限 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ 得到。

---

**推导 $\\ln(1+x) \\sim x$**

$$\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = \\lim_{x \\to 0} \\ln(1+x)^{1/x} = \\ln e = 1$$

---

**推导 $e^x - 1 \\sim x$**

令 $t = e^x - 1$，则 $x = \\ln(1+t)$，$t \\to 0$：

$$\\lim_{x \\to 0} \\frac{e^x - 1}{x} = \\lim_{t \\to 0} \\frac{t}{\\ln(1+t)} = 1$$

---

**推导 $1 - \\cos x \\sim \\frac{x^2}{2}$**

$$1 - \\cos x = 2\\sin^2\\frac{x}{2} \\sim 2 \\cdot \\left(\\frac{x}{2}\\right)^2 = \\frac{x^2}{2}$$

---

**推导 $(1+x)^\\alpha - 1 \\sim \\alpha x$**

$$\\lim_{x \\to 0} \\frac{(1+x)^\\alpha - 1}{x} = \\alpha \\cdot 1^{\\alpha - 1} = \\alpha$$

最后一个等号用了导数定义或二项式展开。`,
    conclusion: '核心等价无穷小8组需背熟，只能替换乘除因子，不能替换加减项',
    applications: [
      '$\\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^3}$：不能用等价替换（加减！），要用Taylor展开得 $\\frac{1}{2}$',
      '$\\lim_{x \\to 0} \\frac{e^x - 1}{\\sin x} = \\lim \\frac{x}{x} = 1$（乘除可用等价替换）',
      '高阶等价：$\\sin x - x \\sim -\\frac{x^3}{6}$，$\\tan x - x \\sim \\frac{x^3}{3}$'
    ]
  },
];

// 导数与微分公式推导数据
const DERIVATIVE_DERIVATIONS: DerivationItem[] = [
  {
    id: 'deriv-chain-rule',
    title: '链式法则的推导',
    introduction: '链式法则是求导最核心的法则，其严格证明需要处理中间项为零的特殊情况。',
    derivation: `**定理陈述**

设 $y = f(u)$ 可导，$u = g(x)$ 可导，则复合函数 $y = f(g(x))$ 可导，且：

$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} = f'(g(x)) \\cdot g'(x)$$

---

**直觉推导**

$$\\frac{\\Delta y}{\\Delta x} = \\frac{\\Delta y}{\\Delta u} \\cdot \\frac{\\Delta u}{\\Delta x}$$

当 $\\Delta x \\to 0$ 时 $\\Delta u \\to 0$（$g$ 连续），取极限即得。

---

**严格证明（处理 $\\Delta u = 0$ 的情况）**

定义 $\\alpha = \\frac{\\Delta y}{\\Delta u} - f'(u_0)$（当 $\\Delta u \\neq 0$），$\\alpha = 0$（当 $\\Delta u = 0$）。

则 $\\Delta y = f'(u_0) \\Delta u + \\alpha \\Delta u$（$\\Delta u = 0$ 时也对）。

除以 $\\Delta x$：

$$\\frac{\\Delta y}{\\Delta x} = f'(u_0) \\frac{\\Delta u}{\\Delta x} + \\alpha \\frac{\\Delta u}{\\Delta x}$$

当 $\\Delta x \\to 0$ 时：$\\alpha \\to 0$（$\\Delta u \\to 0$），$\\frac{\\Delta u}{\\Delta x} \\to g'(x_0)$，所以：

$$\\frac{dy}{dx} = f'(u_0) g'(x_0) + 0 = f'(g(x_0)) g'(x_0)$$`,
    conclusion: '$\\frac{dy}{dx} = f\'(g(x)) \\cdot g\'(x)$，多层复合逐层链式相乘',
    applications: [
      '$\\frac{d}{dx} e^{\\sin x} = e^{\\sin x} \\cdot \\cos x$',
      '$\\frac{d}{dx} \\ln(1+x^2) = \\frac{2x}{1+x^2}$',
      '三层复合：$\\frac{d}{dx} \\sin(e^{x^2}) = \\cos(e^{x^2}) \\cdot e^{x^2} \\cdot 2x$'
    ]
  },
  {
    id: 'deriv-implicit',
    title: '隐函数求导法的推导',
    introduction: '隐函数求导法通过对方程两边同时求导，利用链式法则处理y关于x的依赖关系。',
    derivation: `**问题设置**

设 $F(x, y) = 0$ 确定了隐函数 $y = y(x)$，求 $\\frac{dy}{dx}$。

---

**推导过程**

将 $y = y(x)$ 代入方程，得恒等式：

$$F(x, y(x)) \\equiv 0$$

两边对 $x$ 求导（注意 $y$ 是 $x$ 的函数，使用链式法则）：

$$\\frac{\\partial F}{\\partial x} + \\frac{\\partial F}{\\partial y} \\cdot \\frac{dy}{dx} = 0$$

当 $F_y \\neq 0$ 时解出：

$$\\frac{dy}{dx} = -\\frac{F_x}{F_y}$$

---

**例：$x^2 + y^2 = R^2$**

$F = x^2 + y^2 - R^2$，$F_x = 2x$，$F_y = 2y$，所以 $\\frac{dy}{dx} = -\\frac{x}{y}$。

也可以直接对方程两边求导：$2x + 2y \\cdot y' = 0$，得 $y' = -\\frac{x}{y}$。两种方法等价。`,
    conclusion: '$\\frac{dy}{dx} = -\\frac{F_x}{F_y}$，对方程两边求导，$y$ 视为 $x$ 的函数用链式法则',
    applications: [
      '$x^3 + y^3 = 6xy$：$3x^2 + 3y^2 y\' = 6y + 6xy\'$，$y\' = \\frac{6y - 3x^2}{3y^2 - 6x}$',
      '$e^y + xy = e$：$e^y y\' + y + xy\' = 0$，$y\' = -\\frac{y}{e^y + x}$',
      '注意：$F_x$ 中 $y$ 是独立变量，但两边直接求导时 $y$ 是 $x$ 的函数'
    ]
  },
  {
    id: 'deriv-parametric',
    title: '参数方程求导公式的推导',
    introduction: '参数方程的求导公式来自链式法则的反向应用，二阶导数需要特别注意是对x而非对t求导。',
    derivation: `**一阶导数**

设 $x = \\varphi(t)$，$y = \\psi(t)$，$\\varphi'(t) \\neq 0$。

由链式法则：

$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{\\psi'(t)}{\\varphi'(t)}$$

---

**二阶导数（关键推导）**

$$\\frac{d^2y}{dx^2} = \\frac{d}{dx}\\left(\\frac{dy}{dx}\\right) = \\frac{d}{dx}\\left(\\frac{\\psi'(t)}{\\varphi'(t)}\\right)$$

注意是对 $x$ 求导，不是对 $t$！利用 $\\frac{d}{dx} = \\frac{1}{dx/dt} \\cdot \\frac{d}{dt}$：

$$\\frac{d^2y}{dx^2} = \\frac{d}{dt}\\left(\\frac{\\psi'(t)}{\\varphi'(t)}\\right) \\cdot \\frac{dt}{dx} = \\frac{\\psi''(t)\\varphi'(t) - \\psi'(t)\\varphi''(t)}{[\\varphi'(t)]^2} \\cdot \\frac{1}{\\varphi'(t)}$$

最终得：

$$\\frac{d^2y}{dx^2} = \\frac{\\psi''\\varphi' - \\psi'\\varphi''}{[\\varphi']^3}$$

---

**常见错误**

直接对 $\\frac{\\psi'}{\\varphi'}$ 关于 $t$ 求导，忘记除以 $\\frac{dx}{dt}$。`,
    conclusion: '$\\frac{dy}{dx} = \\frac{\\psi\'}{\\varphi\'}$，$\\frac{d^2y}{dx^2} = \\frac{\\psi\'\'\\varphi\' - \\psi\'\\varphi\'\'}{[\\varphi\']^3}$，二阶导数别忘了除以 $\\varphi\'$',
    applications: [
      '$x = t^2, y = t^3$：$y\' = \\frac{3t^2}{2t} = \\frac{3t}{2}$，$y\'\' = \\frac{3}{4t}$',
      '摆线 $x = a(t-\\sin t), y = a(1-\\cos t)$ 的曲率计算',
      '错误示范：$\\frac{d}{dt}(\\frac{3t}{2}) = \\frac{3}{2}$ ← 这是 $y\'\'$ 关于 $t$ 的，不是关于 $x$ 的'
    ]
  },
];

// 微分中值定理与导数应用公式推导数据
const MEAN_VALUE_DERIVATIONS: DerivationItem[] = [
  {
    id: 'mvt-rolle-theorem',
    title: '罗尔定理的证明',
    introduction: '罗尔定理是中值定理的基础，其证明利用了闭区间上连续函数的最值定理和费马引理。',
    derivation: `**定理条件与结论**

若 $f(x)$ 满足：①在 $[a,b]$ 上连续 ②在 $(a,b)$ 内可导 ③$f(a) = f(b)$，则 $\\exists \\xi \\in (a,b)$ 使 $f'(\\xi) = 0$。

---

**证明过程**

**第一步**：由闭区间上连续函数的最值定理，$f(x)$ 在 $[a,b]$ 上必有最大值 $M$ 和最小值 $m$。

**第二步**：若 $M = m$，则 $f(x)$ 为常数，$f'(\\xi) = 0$ 对所有 $\\xi$ 成立。

**第三步**：若 $M > m$，则 $M$ 和 $m$ 至少有一个不等于 $f(a) = f(b)$。不妨设 $M \\neq f(a)$，则最大值点 $\\xi \\in (a,b)$。

**第四步**：由费马引理（极值点导数为零），$f'(\\xi) = 0$。

---

**费马引理的证明**

设 $f(\\xi)$ 是极大值，则 $\\frac{f(\\xi+h) - f(\\xi)}{h} \\leq 0$（$h > 0$），$\\geq 0$（$h < 0$）。

所以 $f'_+(\\xi) \\leq 0$，$f'_-(\\xi) \\geq 0$。可导时 $f'_+ = f'_-$，故 $f'(\\xi) = 0$。`,
    conclusion: '三个条件缺一不可：连续+可导+端点等值，由最值定理+费马引理得证',
    applications: [
      '证明方程根的存在性：构造函数使端点值相等，用罗尔定理',
      '$f(x) = (x-a)(x-b)g(x)$ → $f(a) = f(b) = 0$ → $\\exists \\xi: f\'(\\xi) = 0$',
      '证明 $\\exists \\xi \\in (a,b): f\'(\\xi) + f(\\xi) = 0$：令 $F = e^x f(x)$，用罗尔定理'
    ]
  },
  {
    id: 'mvt-lagrange-theorem',
    title: '拉格朗日中值定理的证明',
    introduction: '拉格朗日中值定理通过构造辅助函数归结为罗尔定理，是微分学最重要的定理。',
    derivation: `**定理陈述**

若 $f(x)$ 在 $[a,b]$ 上连续、$(a,b)$ 内可导，则 $\\exists \\xi \\in (a,b)$：

$$f(b) - f(a) = f'(\\xi)(b - a)$$

---

**构造辅助函数**

目标是凑出罗尔定理的条件 $F(a) = F(b)$。

拉格朗日定理的结论等价于 $f'(\\xi)(b-a) - (f(b)-f(a)) = 0$。

这启发我们构造：

$$F(x) = f(x) - \\frac{f(b) - f(a)}{b - a}(x - a)$$

验证：$F(a) = f(a)$，$F(b) = f(b) - (f(b) - f(a)) = f(a)$。

所以 $F(a) = F(b)$！

---

**应用罗尔定理**

$F(x)$ 在 $[a,b]$ 连续、$(a,b)$ 可导、$F(a) = F(b)$，由罗尔定理：

$$\\exists \\xi \\in (a,b): F'(\\xi) = 0$$

即：

$$f'(\\xi) - \\frac{f(b) - f(a)}{b - a} = 0$$

整理即得 $f(b) - f(a) = f'(\\xi)(b - a)$。`,
    conclusion: '$f(b) - f(a) = f\'(\\xi)(b-a)$，构造辅助函数 $F(x) = f(x) - \\frac{f(b)-f(a)}{b-a}(x-a)$ 归结为罗尔定理',
    applications: [
      '证明 $|\\sin b - \\sin a| \\leq |b - a|$：$|\\cos\\xi| \\leq 1$',
      '证明 $\\frac{b - a}{b} < \\ln\\frac{b}{a} < \\frac{b-a}{a}$（$b > a > 0$）',
      '有限增量公式：$f(x+h) - f(x) = f\'(x+\\theta h) \\cdot h$（$0 < \\theta < 1$）'
    ]
  },
  {
    id: 'mvt-taylor-formula',
    title: 'Taylor公式的推导',
    introduction: 'Taylor公式是拉格朗日中值定理的高阶推广，将函数用多项式逼近并给出误差估计。',
    derivation: `**从拉格朗日中值定理到Taylor公式**

拉格朗日中值定理给出了一阶逼近：

$$f(x) = f(x_0) + f'(\\xi)(x - x_0)$$

Taylor公式是高阶推广：用 $n$ 次多项式逼近，余项用 $n+1$ 阶导数表示。

---

**Taylor公式的推导（Lagrange余项）**

设 $f(x)$ 在 $x_0$ 附近有 $n+1$ 阶导数，令余项 $R_n(x) = f(x) - \\sum_{k=0}^n \\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k$。

对 $R_n(x)$ 和 $(x-x_0)^{n+1}$ 在 $[x_0, x]$ 上应用柯西中值定理 $n+1$ 次：

第一次：$\\frac{R_n(x)}{(x-x_0)^{n+1}} = \\frac{R_n(x) - R_n(x_0)}{(x-x_0)^{n+1} - 0} = \\frac{R_n'(\\xi_1)}{(n+1)(\\xi_1-x_0)^n}$

（注意 $R_n(x_0) = 0$，$(x_0-x_0)^{n+1} = 0$）

继续在 $[x_0, \\xi_1]$ 上用柯西中值定理，重复 $n+1$ 次后：

$$R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x - x_0)^{n+1}$$

其中 $\\xi$ 介于 $x_0$ 和 $x$ 之间。`,
    conclusion: '$f(x) = \\sum_{k=0}^n \\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k + \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-x_0)^{n+1}$，对余项反复用柯西中值定理',
    applications: [
      '$e^x$ 在 $x_0=0$ 展开：$e^x = 1 + x + \\frac{x^2}{2} + \\cdots + \\frac{x^n}{n!} + \\frac{e^\\xi}{(n+1)!}x^{n+1}$',
      '$\\sin x = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\cdots$',
      '用Taylor展开求极限：$\\lim_{x\\to 0}\\frac{\\tan x - \\sin x}{x^3} = \\frac{(x + x^3/3) - (x - x^3/6)}{x^3} = \\frac{1}{2}$'
    ]
  },
  {
    id: 'mvt-lopital-rule',
    title: "洛必达法则的推导",
    introduction: '洛必达法则将0/0或∞/∞型极限转化为导数之比的极限，其理论基础是柯西中值定理。',
    derivation: `**定理陈述（0/0型）**

设 $\\lim f(x) = \\lim g(x) = 0$，$g'(x) \\neq 0$，若 $\\lim \\frac{f'(x)}{g'(x)}$ 存在（或为 $\\infty$），则：

$$\\lim \\frac{f(x)}{g(x)} = \\lim \\frac{f'(x)}{g'(x)}$$

---

**推导过程**

补充定义 $f(a) = g(a) = 0$（使函数在 $a$ 点连续），在 $[a, x]$ 上对 $f$ 和 $g$ 应用柯西中值定理：

$$\\frac{f(x)}{g(x)} = \\frac{f(x) - f(a)}{g(x) - g(a)} = \\frac{f'(\\xi)}{g'(\\xi)}$$

其中 $\\xi$ 介于 $a$ 和 $x$ 之间。

当 $x \\to a$ 时 $\\xi \\to a$，所以：

$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{\\xi \\to a} \\frac{f'(\\xi)}{g'(\\xi)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$

---

**注意事项**

1. 必须验证是0/0或∞/∞型
2. $\\lim f'/g'$ 不存在时不能断言原极限不存在
3. 可多次使用，但每次都要验证条件`,
    conclusion: '$\\lim \\frac{f}{g} = \\lim \\frac{f\'}{g\'}$（0/0或∞/∞型），理论依据：柯西中值定理',
    applications: [
      '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = \\lim \\frac{\\cos x}{1} = 1$',
      '$\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2} = \\lim \\frac{e^x - 1}{2x} = \\lim \\frac{e^x}{2} = \\frac{1}{2}$（用了两次）',
      '$\\lim_{x \\to \\infty} \\frac{x + \\sin x}{x}$：洛必达得 $1 + \\cos x$ 不存在，但原极限 $= 1$（洛必达失效！）'
    ]
  },
];

// 不定积分公式推导数据
const INDEFINITE_INTEGRAL_DERIVATIONS: DerivationItem[] = [
  {
    id: 'indef-substitution',
    title: '换元积分法的推导',
    introduction: '换元积分法是求积分最基本的方法，其理论基础是复合函数求导的链式法则的逆运算。',
    derivation: `**第一换元法（凑微分）的推导**

设 $\\int f(u)\\,du = F(u) + C$，令 $u = g(x)$，则：

$$\\int f(g(x))g'(x)\\,dx = F(g(x)) + C$$

**推导**：对右边 $F(g(x))$ 求导，由链式法则：

$$[F(g(x))]' = F'(g(x)) \\cdot g'(x) = f(g(x)) \\cdot g'(x)$$

正好等于被积函数！所以积分正确。

---

**第二换元法的推导**

设 $x = \\varphi(t)$ 有连续导数且 $\\varphi'(t) \\neq 0$，则：

$$\\int f(x)\\,dx = \\int f(\\varphi(t))\\varphi'(t)\\,dt$$

**推导**：对右边积分结果 $G(t) + C$ 求导（关于 $x$）：

$$\\frac{d}{dx}[G(t)] = G'(t) \\cdot \\frac{dt}{dx} = f(\\varphi(t))\\varphi'(t) \\cdot \\frac{1}{\\varphi'(t)} = f(x)$$

验证了公式的正确性。最后用 $t = \\varphi^{-1}(x)$ 回代。`,
    conclusion: '凑微分：$\\int f(g(x))g\'(x)dx = \\int f(u)du$；第二换元：$x=\\varphi(t)$，$dx=\\varphi\'(t)dt$',
    applications: [
      '$\\int \\sin(2x) \\cdot 2\\,dx = -\\cos(2x) + C$（凑微分 $u = 2x$）',
      '$\\int \\sqrt{1-x^2}\\,dx$：令 $x = \\sin t$，$dx = \\cos t\\,dt$（第二换元）',
      '$\\int \\frac{dx}{\\sqrt{x}+1}$：令 $t = \\sqrt{x}$，$dx = 2t\\,dt$（简单根式代换）'
    ]
  },
  {
    id: 'indef-parts',
    title: '分部积分公式的推导',
    introduction: '分部积分公式来自乘积求导法则的逆运算，是处理乘积型积分的核心工具。',
    derivation: `**推导过程**

从乘积的求导公式出发：

$$(uv)' = u'v + uv'$$

两边积分：

$$uv = \\int u'v\\,dx + \\int uv'\\,dx$$

移项即得：

$$\\int uv'\\,dx = uv - \\int u'v\\,dx$$

或写成微分形式：

$$\\int u\\,dv = uv - \\int v\\,du$$

---

**选取原则**

选择 $u$ 使得 $du$ 比 $u$ 简单（如 $\\ln x \\to 1/x$，$\\arctan x \\to 1/(1+x^2)$），选择 $dv$ 使得 $v$ 容易求（如 $e^x dx \\to e^x$，$\\sin x dx \\to -\\cos x$）。

口诀"反对幂指三"：反三角、对数优先当 $u$。`,
    conclusion: '$\\int u\\,dv = uv - \\int v\\,du$，选 $u$ 的口诀：反 > 对 > 幂 > 指 > 三',
    applications: [
      '$\\int x e^x dx = xe^x - e^x + C$（$u=x, dv=e^x dx$）',
      '$\\int \\ln x\\,dx = x\\ln x - x + C$（$u=\\ln x, dv=dx$）',
      '$\\int e^x \\sin x\\,dx$：两次分部后解方程，得 $\\frac{e^x(\\sin x - \\cos x)}{2} + C$'
    ]
  },
];

// 定积分公式推导数据
const DEFINITE_INTEGRAL_DERIVATIONS: DerivationItem[] = [
  {
    id: 'def-newton-leibniz',
    title: '牛顿-莱布尼茨公式的推导',
    introduction: '牛顿-莱布尼茨公式建立了定积分与不定积分的桥梁，是微积分基本定理。',
    derivation: `**微积分基本定理（第一基本定理）**

设 $f(x)$ 在 $[a,b]$ 上连续，定义变上限积分 $\\Phi(x) = \\int_a^x f(t)\\,dt$，则：

$$\\Phi'(x) = f(x)$$

**证明**：

$$\\Phi'(x) = \\lim_{h \\to 0} \\frac{\\int_a^{x+h} f(t)\\,dt - \\int_a^x f(t)\\,dt}{h} = \\lim_{h \\to 0} \\frac{1}{h}\\int_x^{x+h} f(t)\\,dt$$

由积分中值定理，$\\int_x^{x+h} f(t)\\,dt = f(\\xi) \\cdot h$（$\\xi$ 介于 $x$ 和 $x+h$ 之间）。

当 $h \\to 0$ 时 $\\xi \\to x$，由 $f$ 的连续性 $f(\\xi) \\to f(x)$，所以 $\\Phi'(x) = f(x)$。

---

**牛顿-莱布尼茨公式（第二基本定理）**

设 $F(x)$ 是 $f(x)$ 的一个原函数，则：

$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$

**证明**：

$\\Phi(x) = \\int_a^x f(t)\\,dt$ 是 $f$ 的一个原函数，所以 $\\Phi(x) = F(x) + C$。

由 $\\Phi(a) = 0$ 得 $C = -F(a)$，所以 $\\Phi(x) = F(x) - F(a)$。

令 $x = b$：$\\int_a^b f(t)\\,dt = \\Phi(b) = F(b) - F(a)$。`,
    conclusion: '$\\int_a^b f(x)\\,dx = F(b) - F(a)$，先证变上限积分求导=被积函数，再由原函数关系得公式',
    applications: [
      '$\\int_0^1 x^2\\,dx = \\frac{x^3}{3}\\big|_0^1 = \\frac{1}{3}$',
      '$\\int_0^{\\pi} \\sin x\\,dx = -\\cos x\\big|_0^{\\pi} = 2$',
      '变上限积分求导：$\\frac{d}{dx}\\int_a^{g(x)}f(t)\\,dt = f(g(x)) \\cdot g\'(x)$'
    ]
  },
  {
    id: 'def-substitution',
    title: '定积分换元公式的推导',
    introduction: '定积分换元公式的关键在于同时更换积分限，无需回代原变量。',
    derivation: `**定理陈述**

设 $f(x)$ 在 $[a,b]$ 上连续，$x = \\varphi(t)$ 在 $[\\alpha, \\beta]$ 上有连续导数，$\\varphi(\\alpha) = a$，$\\varphi(\\beta) = b$，则：

$$\\int_a^b f(x)\\,dx = \\int_\\alpha^\\beta f(\\varphi(t))\\varphi'(t)\\,dt$$

---

**推导过程**

设 $F(x)$ 是 $f(x)$ 的原函数。

左端 $= F(b) - F(a) = F(\\varphi(\\beta)) - F(\\varphi(\\alpha))$。

右端：$f(\\varphi(t))\\varphi'(t)$ 的原函数是 $F(\\varphi(t))$（由链式法则验证）：

$$[F(\\varphi(t))]' = F'(\\varphi(t)) \\cdot \\varphi'(t) = f(\\varphi(t)) \\cdot \\varphi'(t)$$

所以右端 $= F(\\varphi(\\beta)) - F(\\varphi(\\alpha))$。

两端相等，证毕。

---

**与不定积分换元的区别**

定积分换元后直接在新变量下算出数值，不需要回代。这是定积分换元的优势。`,
    conclusion: '$\\int_a^b f(x)\\,dx = \\int_\\alpha^\\beta f(\\varphi(t))\\varphi\'(t)\\,dt$，换元必须换限，算完不需要回代',
    applications: [
      '$\\int_0^1 \\sqrt{1-x^2}\\,dx$：令 $x = \\sin t$，$x=0 \\to t=0$，$x=1 \\to t=\\frac{\\pi}{2}$，$= \\int_0^{\\pi/2} \\cos^2 t\\,dt = \\frac{\\pi}{4}$',
      '$\\int_0^4 \\sqrt{x}\\,dx$：令 $t = \\sqrt{x}$，$x=0 \\to t=0$，$x=4 \\to t=2$',
      '奇函数在对称区间上积分为0：$\\int_{-a}^a f(x)\\,dx = 0$'
    ]
  },
  {
    id: 'def-wallis',
    title: 'Wallis公式的推导',
    introduction: 'Wallis公式通过分部积分建立递推关系，最终得到三角函数幂积分的闭式表达。',
    derivation: `**问题设置**

设 $I_n = \\int_0^{\\pi/2} \\sin^n x\\,dx$，推导Wallis公式。

---

**递推关系的推导**

当 $n \\geq 2$ 时，用分部积分：

$$I_n = \\int_0^{\\pi/2} \\sin^n x\\,dx = \\int_0^{\\pi/2} \\sin^{n-1} x \\cdot \\sin x\\,dx$$

令 $u = \\sin^{n-1} x$，$dv = \\sin x\\,dx$，则 $du = (n-1)\\sin^{n-2} x \\cos x\\,dx$，$v = -\\cos x$：

$$I_n = [-\\sin^{n-1} x \\cos x]_0^{\\pi/2} + (n-1)\\int_0^{\\pi/2} \\sin^{n-2} x \\cos^2 x\\,dx$$

第一项为零，$\\cos^2 x = 1 - \\sin^2 x$：

$$I_n = (n-1)\\int_0^{\\pi/2} \\sin^{n-2} x\\,dx - (n-1)\\int_0^{\\pi/2} \\sin^n x\\,dx = (n-1)I_{n-2} - (n-1)I_n$$

解出：

$$I_n = \\frac{n-1}{n} I_{n-2}$$

---

**初始值与结果**

$I_0 = \\frac{\\pi}{2}$，$I_1 = 1$。

递推得：

$$I_n = \\begin{cases} \\frac{(n-1)!!}{n!!} \\cdot \\frac{\\pi}{2} & n \\text{ 偶} \\\\ \\frac{(n-1)!!}{n!!} & n \\text{ 奇} \\end{cases}$$

其中 $n!! = n(n-2)(n-4)\\cdots$ 是双阶乘。`,
    conclusion: '$I_n = \\frac{n-1}{n}I_{n-2}$，$I_0 = \\frac{\\pi}{2}$，$I_1 = 1$，递推得闭式',
    applications: [
      '$I_4 = \\frac{3}{4} \\cdot \\frac{1}{2} \\cdot \\frac{\\pi}{2} = \\frac{3\\pi}{16}$',
      '$\\int_0^{\\pi/2} \\cos^n x\\,dx = I_n$（与 $\\sin^n$ 相同）',
      'Stirling公式的一个应用：$\\lim_{n \\to \\infty} \\frac{(2n)!!}{(2n-1)!!} \\cdot \\frac{1}{\\sqrt{n}} = \\sqrt{\\pi}$'
    ]
  },
];

// 向量代数与空间解析几何公式推导数据
const VECTOR_GEOMETRY_DERIVATIONS: DerivationItem[] = [
  {
    id: 'vec-cross-product',
    title: '向量叉积的坐标公式推导',
    introduction: '叉积是三维空间最重要的向量运算之一，其坐标公式可以通过行列式优雅地表示。',
    derivation: `**叉积的定义**

两个向量 $\\mathbf{a} = (a_1, a_2, a_3)$ 和 $\\mathbf{b} = (b_1, b_2, b_3)$ 的叉积定义为：

$$\\mathbf{a} \\times \\mathbf{b} = |\\mathbf{a}||\\mathbf{b}|\\sin\\theta \\cdot \\mathbf{n}$$

其中 $\\theta$ 是两向量的夹角，$\\mathbf{n}$ 是由右手法则确定的单位法向量。

---

**坐标公式的推导**

利用分配律和基本单位向量的叉积关系：$\\mathbf{i} \\times \\mathbf{j} = \\mathbf{k}$，$\\mathbf{j} \\times \\mathbf{k} = \\mathbf{i}$，$\\mathbf{k} \\times \\mathbf{i} = \\mathbf{j}$，以及反交换律 $\\mathbf{a} \\times \\mathbf{b} = -(\\mathbf{b} \\times \\mathbf{a})$，展开：

$$\\mathbf{a} \\times \\mathbf{b} = (a_1\\mathbf{i} + a_2\\mathbf{j} + a_3\\mathbf{k}) \\times (b_1\\mathbf{i} + b_2\\mathbf{j} + b_3\\mathbf{k})$$

展开后同类项合并，叉积为零的项消去：

$$= (a_2b_3 - a_3b_2)\\mathbf{i} + (a_3b_1 - a_1b_3)\\mathbf{j} + (a_1b_2 - a_2b_1)\\mathbf{k}$$

这恰好可以用三阶行列式表示：

$$\\mathbf{a} \\times \\mathbf{b} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}$$

按第一行展开即得上述坐标公式。`,
    conclusion: '$\\mathbf{a} \\times \\mathbf{b} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix} = (a_2b_3-a_3b_2)\\mathbf{i} + (a_3b_1-a_1b_3)\\mathbf{j} + (a_1b_2-a_2b_1)\\mathbf{k}$',
    applications: [
      '求同时垂直于两向量的法向量',
      '计算平行四边形面积：$S = |\\mathbf{a} \\times \\mathbf{b}|$',
      '计算平行六面体体积（混合积）：$V = |(\\mathbf{a} \\times \\mathbf{b}) \\cdot \\mathbf{c}|$'
    ]
  },
  {
    id: 'vec-point-to-plane',
    title: '点到平面距离公式推导',
    introduction: '点到平面的距离公式是空间解析几何的核心公式之一，推导过程体现了向量投影的思想。',
    derivation: `**问题设置**

设平面方程为 $Ax + By + Cz + D = 0$，平面外一点 $P_0(x_0, y_0, z_0)$。平面的法向量 $\\mathbf{n} = (A, B, C)$。

---

**推导思路**

在平面上任取一点 $P_1(x_1, y_1, z_1)$，则向量 $\\overrightarrow{P_1P_0}$ 在法向量 $\\mathbf{n}$ 方向上的投影长度就是点到平面的距离。

---

**投影计算**

$$d = |\\text{proj}_{\\mathbf{n}} \\overrightarrow{P_1P_0}| = \\frac{|\\overrightarrow{P_1P_0} \\cdot \\mathbf{n}|}{|\\mathbf{n}|}$$

代入坐标：

$$\\overrightarrow{P_1P_0} \\cdot \\mathbf{n} = A(x_0 - x_1) + B(y_0 - y_1) + C(z_0 - z_1)$$

因为 $P_1$ 在平面上，满足 $Ax_1 + By_1 + Cz_1 + D = 0$，即 $Ax_1 + By_1 + Cz_1 = -D$。

所以：

$$\\overrightarrow{P_1P_0} \\cdot \\mathbf{n} = Ax_0 + By_0 + Cz_0 + D$$

因此距离为：

$$d = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$`,
    conclusion: '$d = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$',
    applications: [
      '求点 $(1,2,3)$ 到平面 $2x - y + 2z + 1 = 0$ 的距离：$d = \\frac{|2-2+6+1|}{3} = \\frac{7}{3}$',
      '判断点在平面的哪一侧（看分子符号）',
      '两平行平面的距离：化为法线式后取绝对差'
    ]
  },
  {
    id: 'vec-rotation-surface',
    title: '旋转曲面方程的推导',
    introduction: '旋转曲面方程的推导体现了"坐标替换"的思想，是空间曲面部分的核心内容。',
    derivation: `**问题设置**

坐标面 $yOz$ 上的曲线 $C: f(y, z) = 0$ 绕 $z$ 轴旋转，求旋转曲面的方程。

---

**推导过程**

设曲线上任一点 $M_0(0, y_0, z_0)$，绕 $z$ 轴旋转后到达点 $M(x, y, z)$。

旋转过程中，点 $M_0$ 的 $z$ 坐标不变，而到 $z$ 轴的距离也不变：

$$z = z_0, \\quad \\sqrt{x^2 + y^2} = |y_0|$$

即 $y_0 = \\pm\\sqrt{x^2 + y^2}$。

将 $y_0 = \\pm\\sqrt{x^2 + y^2}$ 和 $z_0 = z$ 代入 $f(y_0, z_0) = 0$：

$$f(\\pm\\sqrt{x^2 + y^2}, z) = 0$$

这就是旋转曲面的方程。

---

**推广法则**

绕哪个轴旋转，那个坐标不变，另一个坐标用两变量平方和的根号替换：

- 绕 $z$ 轴：$f(\\pm\\sqrt{x^2+y^2}, z) = 0$
- 绕 $y$ 轴：$f(y, \\pm\\sqrt{x^2+z^2}) = 0$
- 绕 $x$ 轴：$f(\\pm\\sqrt{y^2+z^2}, x) = 0$`,
    conclusion: '绕 $z$ 轴旋转：$f(\\pm\\sqrt{x^2+y^2}, z) = 0$；法则：绕谁转谁不变，另一变量用 $\\sqrt{\\cdot^2+\\cdot^2}$ 替换',
    applications: [
      '$y^2 = 2z$ 绕 $z$ 轴旋转：$x^2 + y^2 = 2z$（旋转抛物面）',
      '$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ 绕 $x$ 轴旋转：$\\frac{x^2}{a^2} + \\frac{y^2+z^2}{b^2} = 1$',
      '$z = x^2$ 绕 $z$ 轴旋转：$z = x^2 + y^2$'
    ]
  },
];

// 多元函数微分法公式推导数据
const MULTIVARIABLE_DIFFERENTIAL_DERIVATIONS: DerivationItem[] = [
  {
    id: 'multi-chain-rule',
    title: '多元复合函数链式法则推导',
    introduction: '多元链式法则是一元链式法则的自然推广，但需要处理多条路径的叠加。',
    derivation: `**问题设置**

设 $z = f(u, v)$，$u = \\varphi(x, y)$，$v = \\psi(x, y)$，求 $\\frac{\\partial z}{\\partial x}$ 和 $\\frac{\\partial z}{\\partial y}$。

---

**全微分出发**

由 $z = f(u, v)$ 可微，全微分为：

$$dz = \\frac{\\partial f}{\\partial u}du + \\frac{\\partial f}{\\partial v}dv$$

又由 $u = \\varphi(x,y)$，$v = \\psi(x,y)$ 可微：

$$du = \\frac{\\partial u}{\\partial x}dx + \\frac{\\partial u}{\\partial y}dy, \\quad dv = \\frac{\\partial v}{\\partial x}dx + \\frac{\\partial v}{\\partial y}dy$$

代入得：

$$dz = \\left(\\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial x}\\right)dx + \\left(\\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial y} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial y}\\right)dy$$

---

**比较系数**

另一方面 $dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy$，比较 $dx$ 和 $dy$ 的系数：

$$\\frac{\\partial z}{\\partial x} = \\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial x}$$

$$\\frac{\\partial z}{\\partial y} = \\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial y} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial y}$$

这就是多元链式法则。每条路径贡献一项，所有路径相加。`,
    conclusion: '$\\frac{\\partial z}{\\partial x} = \\frac{\\partial f}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial f}{\\partial v}\\frac{\\partial v}{\\partial x}$，画变量依赖图（树形图），每条路径贡献一项',
    applications: [
      '$z = e^u \\sin v$，$u = xy$，$v = x+y$：$\\frac{\\partial z}{\\partial x} = e^u \\sin v \\cdot y + e^u \\cos v \\cdot 1$',
      '$z = f(x^2 + y^2)$：令 $u = x^2+y^2$，$\\frac{\\partial z}{\\partial x} = 2x f\'(u)$',
      '树形图法：从 $z$ 到 $x$ 的每条路径贡献一项乘积'
    ]
  },
  {
    id: 'multi-implicit-derivative',
    title: '隐函数求导公式推导',
    introduction: '隐函数求导公式将偏导数的计算归结为偏导数的商，是隐函数理论的核心结果。',
    derivation: `**问题设置**

设 $F(x, y, z) = 0$ 确定了隐函数 $z = z(x, y)$，且 $F_z \\neq 0$，求 $\\frac{\\partial z}{\\partial x}$ 和 $\\frac{\\partial z}{\\partial y}$。

---

**推导过程**

将 $z = z(x, y)$ 代入 $F(x, y, z) = 0$，得恒等式：

$$F(x, y, z(x, y)) \\equiv 0$$

两边对 $x$ 求偏导（注意 $z$ 是 $x, y$ 的函数）：

$$\\frac{\\partial F}{\\partial x} + \\frac{\\partial F}{\\partial z} \\cdot \\frac{\\partial z}{\\partial x} = 0$$

解出：

$$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}$$

同理，对 $y$ 求偏导得：

$$\\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}$$

---

**关键要点**

这里 $F_x = \\frac{\\partial F}{\\partial x}$ 是把 $y, z$ 当独立变量对 $x$ 求偏导，不是把 $z$ 当 $x$ 的函数。这是最易混淆的地方。`,
    conclusion: '$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}$，$\\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}$（条件 $F_z \\neq 0$）',
    applications: [
      '$x^2 + y^2 + z^2 = 1$：$F_x = 2x$，$F_z = 2z$，$\\frac{\\partial z}{\\partial x} = -\\frac{x}{z}$',
      '$e^z = xyz$：$\\frac{\\partial z}{\\partial x} = -\\frac{yz}{e^z - xy} = \\frac{yz}{xy - e^z}$',
      '注意 $F_x$ 中 $z$ 是独立变量，不是 $x$ 的函数'
    ]
  },
  {
    id: 'multi-directional-derivative',
    title: '方向导数与梯度关系推导',
    introduction: '方向导数是梯度的投影，这个关系的推导体现了方向导数的本质——函数在某方向上的变化率。',
    derivation: `**方向导数的定义**

函数 $f(x, y, z)$ 在点 $P_0$ 沿方向 $\\mathbf{l}$ 的方向导数：

$$\\frac{\\partial f}{\\partial l} = \\lim_{h \\to 0^+} \\frac{f(P_0 + h\\mathbf{l}_0) - f(P_0)}{h}$$

其中 $\\mathbf{l}_0 = (\\cos\\alpha, \\cos\\beta, \\cos\\gamma)$ 是方向单位向量。

---

**推导过程**

设 $f$ 在 $P_0$ 处可微，则：

$$f(P_0 + h\\mathbf{l}_0) - f(P_0) = f_x \\cdot h\\cos\\alpha + f_y \\cdot h\\cos\\beta + f_z \\cdot h\\cos\\gamma + o(h)$$

两边除以 $h$，取极限：

$$\\frac{\\partial f}{\\partial l} = f_x\\cos\\alpha + f_y\\cos\\beta + f_z\\cos\\gamma = \\nabla f \\cdot \\mathbf{l}_0$$

---

**梯度方向取最大值**

由 $\\frac{\\partial f}{\\partial l} = |\\nabla f|\\cos\\theta$（$\\theta$ 为梯度与方向的夹角），当 $\\theta = 0$ 时取最大值 $|\\nabla f|$。

所以梯度的方向就是函数增长最快的方向，梯度的模就是最大方向导数值。`,
    conclusion: '$\\frac{\\partial f}{\\partial l} = \\nabla f \\cdot \\mathbf{l}_0 = |\\nabla f|\\cos\\theta$，梯度方向 = 增长最快方向，$|\\nabla f|$ = 最大方向导数',
    applications: [
      '$f(x,y) = x^2 + y^2$ 在 $(1,1)$ 沿 $45°$ 方向：$\\nabla f = (2,2)$，$\\frac{\\partial f}{\\partial l} = (2,2) \\cdot (\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}) = 2\\sqrt{2}$',
      '最大方向导数 $= |\\nabla f| = 2\\sqrt{2}$，沿梯度 $(1,1)$ 方向',
      '方向导数为 0 的方向与梯度垂直（等值线的切线方向）'
    ]
  },
  {
    id: 'multi-extremum-condition',
    title: '多元极值充分条件推导',
    introduction: '二元函数极值的充分条件通过Taylor展开推导，是多元微分最实用的结果之一。',
    derivation: `**问题设置**

设 $f(x,y)$ 在 $(x_0, y_0)$ 处有驻点（$f_x = f_y = 0$），记 $A = f_{xx}$，$B = f_{xy}$，$C = f_{yy}$，推导极值的判别条件。

---

**Taylor展开**

在驻点处二阶Taylor展开（一阶项为零）：

$$\\Delta z = f(x_0+h, y_0+k) - f(x_0, y_0) = \\frac{1}{2}(Ah^2 + 2Bhk + Ck^2) + o(h^2+k^2)$$

$\\Delta z$ 的符号由二次型 $Q = Ah^2 + 2Bhk + Ck^2$ 决定。

---

**二次型正定性分析**

将 $Q$ 配方：

$$Q = A\\left(h + \\frac{B}{A}k\\right)^2 + \\frac{AC - B^2}{A}k^2$$

当 $\\Delta = AC - B^2 > 0$ 时：
- 若 $A > 0$：$Q > 0$，$\\Delta z > 0$，极小值
- 若 $A < 0$：$Q < 0$，$\\Delta z < 0$，极大值

当 $\\Delta = AC - B^2 < 0$ 时：$Q$ 可正可负，鞍点。

当 $\\Delta = 0$ 时：无法判定。`,
    conclusion: '$\\Delta = AC - B^2$：$\\Delta > 0$ 且 $A > 0$ → 极小；$\\Delta > 0$ 且 $A < 0$ → 极大；$\\Delta < 0$ → 鞍点',
    applications: [
      '$f = x^3 + y^3 - 3xy$：驻点 $(0,0)$ 处 $\\Delta = 0 \\cdot 0 - 9 = -9 < 0$，鞍点',
      '驻点 $(1,1)$ 处 $\\Delta = 6 \\cdot 6 - 9 = 27 > 0$，$A = 6 > 0$，极小值',
      '$\\Delta = 0$ 时需要用更高阶展开或定义判断'
    ]
  },
  {
    id: 'multi-lagrange-multiplier',
    title: '拉格朗日乘数法推导',
    introduction: '拉格朗日乘数法将条件极值转化为无条件极值，其推导揭示了约束条件的本质。',
    derivation: `**问题设置**

求 $f(x, y)$ 在约束 $g(x, y) = 0$ 下的极值。

---

**几何直觉**

在极值点 $(x_0, y_0)$ 处，$f$ 的等值线 $f = c$ 与约束曲线 $g = 0$ 相切。相切意味着两曲线在该点有相同的切线方向，即法向量平行：

$$\\nabla f \\parallel \\nabla g$$

---

**代数推导**

设曲线 $g(x,y) = 0$ 的参数方程为 $x = x(t)$，$y = y(t)$。在极值点处：

$$\\frac{d}{dt}f(x(t), y(t)) = f_x x'(t) + f_y y'(t) = 0$$

又 $g(x(t), y(t)) = 0$，求导得 $g_x x'(t) + g_y y'(t) = 0$。

两式联立，说明向量 $(f_x, f_y)$ 和 $(g_x, g_y)$ 都与切向量 $(x'(t), y'(t))$ 垂直，因此两者平行：

$$\\nabla f = \\lambda \\nabla g$$

即 $f_x = \\lambda g_x$，$f_y = \\lambda g_y$，连同 $g = 0$ 三个方程解三个未知数 $x, y, \\lambda$。`,
    conclusion: '构造 $L = f + \\lambda g$，令 $L_x = L_y = L_\\lambda = 0$，解驻点',
    applications: [
      '$f = x^2 + y^2$ 约束 $x + y = 1$：$L = x^2+y^2+\\lambda(x+y-1)$，解得 $x=y=\\frac{1}{2}$',
      '两个约束条件则引入两个乘数：$L = f + \\lambda_1 g_1 + \\lambda_2 g_2$',
      '几何意义：极值点处 $\\nabla f \\parallel \\nabla g$'
    ]
  },
];

// 多元函数积分学公式推导数据
const MULTIVARIABLE_INTEGRAL_DERIVATIONS: DerivationItem[] = [
  {
    id: 'multi-green-formula',
    title: '格林公式推导',
    introduction: '格林公式建立了平面区域上的二重积分与边界曲线上的曲线积分的联系，是多元积分学的核心定理。',
    derivation: `**定理陈述**

设闭区域 $D$ 由分段光滑的闭曲线 $L$ 围成，$P(x,y)$ 和 $Q(x,y)$ 在 $D$ 上有连续的一阶偏导数，则：

$$\\oint_L P\\,dx + Q\\,dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) d\\sigma$$

其中 $L$ 取正方向（逆时针）。

---

**推导思路**

分别证明两个等式：

$$\\oint_L P\\,dx = -\\iint_D \\frac{\\partial P}{\\partial y}\\,d\\sigma, \\quad \\oint_L Q\\,dy = \\iint_D \\frac{\\partial Q}{\\partial x}\\,d\\sigma$$

先证第一个。设 $D$ 可表示为 $a \\leq x \\leq b$，$\\varphi_1(x) \\leq y \\leq \\varphi_2(x)$。

---

**证明 $\\oint_L P\\,dx = -\\iint_D \\frac{\\partial P}{\\partial y}\\,d\\sigma$**

右边：

$$-\\iint_D \\frac{\\partial P}{\\partial y}\\,d\\sigma = -\\int_a^b dx \\int_{\\varphi_1(x)}^{\\varphi_2(x)} \\frac{\\partial P}{\\partial y}\\,dy = -\\int_a^b [P(x, \\varphi_2(x)) - P(x, \\varphi_1(x))]\\,dx$$

左边沿边界 $L$ 分四段积分，上下边界的 $dx$ 方向相反（上边从左到右，下边从右到左），左右边界的 $dx = 0$：

$$\\oint_L P\\,dx = \\int_a^b P(x, \\varphi_1(x))\\,dx - \\int_a^b P(x, \\varphi_2(x))\\,dx$$

两式比较即得。同理可证第二个等式，两式相加即得格林公式。`,
    conclusion: '$\\oint_L P\\,dx + Q\\,dy = \\iint_D (Q_x - P_y)\\,d\\sigma$，将闭曲线积分转化为区域上的二重积分',
    applications: [
      '求闭曲线围成区域的面积：$S = \\frac{1}{2}\\oint_L x\\,dy - y\\,dx$',
      '计算曲线积分时，若 $Q_x - P_y$ 简单，用格林公式化为二重积分',
      '判断积分与路径无关：$Q_x = P_y$ 在单连通域内'
    ]
  },
  {
    id: 'multi-gauss-formula',
    title: '高斯公式推导',
    introduction: '高斯公式（散度定理）将封闭曲面上的曲面积分与内部区域上的三重积分联系起来。',
    derivation: `**定理陈述**

设空间闭区域 $\\Omega$ 由分片光滑的闭曲面 $\\Sigma$ 围成，$P, Q, R$ 在 $\\Omega$ 上有连续的一阶偏导数，则：

$$\\oiint_\\Sigma P\\,dydz + Q\\,dzdx + R\\,dxdy = \\iiint_\\Omega \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}\\right) dV$$

$\\Sigma$ 取外侧。

---

**推导思路**

与格林公式类似，分别证明三个等式。以 $\\oiint_\\Sigma R\\,dxdy = \\iiint_\\Omega \\frac{\\partial R}{\\partial z} dV$ 为例。

---

**证明 $R$ 部分**

设 $\\Omega$ 可表示为 $z_1(x,y) \\leq z \\leq z_2(x,y)$，$(x,y) \\in D_{xy}$。

右边：

$$\\iiint_\\Omega \\frac{\\partial R}{\\partial z} dV = \\iint_{D_{xy}} dxdy \\int_{z_1}^{z_2} \\frac{\\partial R}{\\partial z} dz = \\iint_{D_{xy}} [R(x,y,z_2) - R(x,y,z_1)]\\,dxdy$$

左边沿曲面积分，上曲面 $\\Sigma_2$（外侧法向朝上，$dxdy > 0$）和下曲面 $\\Sigma_1$（外侧法向朝下，$dxdy < 0$），侧面的 $dxdy = 0$：

$$\\oiint_\\Sigma R\\,dxdy = \\iint_{D_{xy}} R(x,y,z_2)\\,dxdy - \\iint_{D_{xy}} R(x,y,z_1)\\,dxdy$$

两式相等。同理证明 $P$ 和 $Q$ 部分，相加即得。`,
    conclusion: '$\\oiint_\\Sigma \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_\\Omega \\nabla \\cdot \\mathbf{F}\\,dV$，散度定理将面积分转化为体积分',
    applications: [
      '$\\oiint_\\Sigma x\\,dydz + y\\,dzdx + z\\,dxdy$（$\\Sigma$ 为球面外侧）$= \\iiint_\\Omega 3\\,dV = 3 \\cdot \\frac{4}{3}\\pi R^3 = 4\\pi R^3$',
      '计算封闭曲面上的第二型曲面积分时优先考虑高斯公式',
      '有奇点时用挖洞法：在奇点附近挖去小球后在剩余区域用高斯公式'
    ]
  },
  {
    id: 'multi-polar-transform',
    title: '二重积分极坐标变换推导',
    introduction: '极坐标变换是计算圆形区域上二重积分的关键工具，变换公式中的 $r$ 因子来自Jacobian行列式。',
    derivation: `**变换公式**

极坐标变换 $x = r\\cos\\theta$，$y = r\\sin\\theta$：

$$\\iint_D f(x,y)\\,dxdy = \\iint_{D'} f(r\\cos\\theta, r\\sin\\theta) \\cdot r\\,drd\\theta$$

---

**推导过程**

由变量替换的一般理论，面积元素变换公式为：

$$dxdy = |J|\\,drd\\theta$$

其中 $J$ 是Jacobian行列式：

$$J = \\frac{\\partial(x,y)}{\\partial(r,\\theta)} = \\begin{vmatrix} \\frac{\\partial x}{\\partial r} & \\frac{\\partial x}{\\partial \\theta} \\\\ \\frac{\\partial y}{\\partial r} & \\frac{\\partial y}{\\partial \\theta} \\end{vmatrix} = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix}$$

展开行列式：

$$J = r\\cos^2\\theta + r\\sin^2\\theta = r$$

所以 $dxdy = r\\,drd\\theta$，注意 $r \\geq 0$。

---

**直观理解**

极坐标下的面积微元是小扇形环的面积：$d\\sigma \\approx r\\,d\\theta \\cdot dr = r\\,drd\\theta$。$r$ 因子反映了离原点越远，同一角度范围覆盖的弧长越长。`,
    conclusion: '$dxdy = r\\,drd\\theta$，极坐标变换后不要遗漏 $r$ 因子',
    applications: [
      '$\\iint_{x^2+y^2 \\leq R^2} e^{x^2+y^2} d\\sigma = \\int_0^{2\\pi} d\\theta \\int_0^R e^{r^2} \\cdot r\\,dr = \\pi(e^{R^2}-1)$',
      '圆域、环形域、扇形域上的积分优先用极坐标',
      '被积函数含 $x^2+y^2$ 时极坐标能大大简化'
    ]
  },
  {
    id: 'multi-cylindrical-spherical',
    title: '柱坐标与球坐标变换推导',
    introduction: '柱坐标和球坐标是极坐标向三维的推广，Jacobian行列式给出了体积元素的变换因子。',
    derivation: `**柱坐标变换**

$x = r\\cos\\theta$，$y = r\\sin\\theta$，$z = z$，Jacobian：

$$J = \\frac{\\partial(x,y,z)}{\\partial(r,\\theta,z)} = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta & 0 \\\\ \\sin\\theta & r\\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{vmatrix} = r$$

体积元素：$dV = r\\,drd\\theta dz$

---

**球坐标变换**

$x = r\\sin\\varphi\\cos\\theta$，$y = r\\sin\\varphi\\sin\\theta$，$z = r\\cos\\varphi$，其中 $r \\geq 0$，$0 \\leq \\varphi \\leq \\pi$，$0 \\leq \\theta \\leq 2\\pi$。

Jacobian：

$$J = \\frac{\\partial(x,y,z)}{\\partial(r,\\varphi,\\theta)} = r^2\\sin\\varphi$$

体积元素：$dV = r^2\\sin\\varphi\\,drd\\varphi d\\theta$

---

**推导球坐标Jacobian**

按第一行展开三阶行列式，经过计算得：

$$J = r^2\\sin\\varphi$$

直观理解：$r^2$ 来自径向放大的面积效应（二维的 $r$ 变成 $r^2$），$\\sin\\varphi$ 反映纬度方向上纬线圈的缩小（极点处纬线圈退化为点）。`,
    conclusion: '柱坐标 $dV = r\\,drd\\theta dz$；球坐标 $dV = r^2\\sin\\varphi\\,drd\\varphi d\\theta$',
    applications: [
      '球体体积：$\\int_0^{2\\pi}d\\theta\\int_0^\\pi d\\varphi\\int_0^R r^2\\sin\\varphi\\,dr = 2\\pi \\cdot 2 \\cdot \\frac{R^3}{3} = \\frac{4\\pi R^3}{3}$',
      '含 $x^2+y^2$ 的圆柱形区域用柱坐标',
      '含 $x^2+y^2+z^2$ 的球形区域用球坐标'
    ]
  },
  {
    id: 'multi-stokes-formula',
    title: '斯托克斯公式推导思路',
    introduction: '斯托克斯公式是格林公式在空间曲面上的推广，建立了曲面积分与边界曲线积分的联系。',
    derivation: `**定理陈述**

设光滑曲面 $\\Sigma$ 的边界为曲线 $\\Gamma$，则：

$$\\oint_\\Gamma P\\,dx + Q\\,dy + R\\,dz = \\iint_\\Sigma \\left(\\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}\\right) dydz + \\left(\\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}\\right) dzdx + \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dxdy$$

用旋度表示更简洁：

$$\\oint_\\Gamma \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_\\Sigma (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$$

---

**推导思路**

与格林公式类似，但需要处理空间曲面。关键步骤：

1. 设曲面可参数化为 $\\mathbf{r} = \\mathbf{r}(u, v)$
2. 将曲面积分用参数表示
3. 利用格林公式在参数平面上完成转化
4. 回到空间坐标即得斯托克斯公式

---

**旋度的几何意义**

$\\nabla \\times \\mathbf{F}$ 在某方向的分量 = 该方向上单位面积环量的极限。斯托克斯公式说明：沿边界的环量 = 旋度在曲面上的通量。`,
    conclusion: '$\\oint_\\Gamma \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_\\Sigma (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$，格林公式的三维推广',
    applications: [
      '空间曲线积分化为曲面积分计算',
      '旋度为零（$\\nabla \\times \\mathbf{F} = 0$）⇒ 积分与路径无关（单连通域）',
      '与高斯公式的关系：高斯处理封闭曲面，斯托克斯处理非封闭曲面与边界'
    ]
  },
];

// 无穷级数公式推导数据
const SERIES_DERIVATIONS: DerivationItem[] = [
  {
    id: 'series-p-test',
    title: 'p级数敛散性的证明',
    introduction: 'p级数 $\\sum \\frac{1}{n^p}$ 的敛散性是级数理论的基石，其证明使用了积分判别法。',
    derivation: `**问题设置**

判定 $\\sum_{n=1}^{\\infty} \\frac{1}{n^p}$ 的敛散性（$p > 0$）。

---

**积分判别法**

设 $f(x) = \\frac{1}{x^p}$ 是正项递减函数，由积分判别法，$\\sum f(n)$ 与 $\\int_1^{\\infty} f(x)dx$ 同敛散。

---

**计算反常积分**

$$\\int_1^{+\\infty} \\frac{dx}{x^p} = \\lim_{b \\to +\\infty} \\int_1^b x^{-p}\\,dx$$

当 $p \\neq 1$ 时：

$$= \\lim_{b \\to +\\infty} \\frac{x^{1-p}}{1-p}\\bigg|_1^b = \\lim_{b \\to +\\infty} \\frac{b^{1-p} - 1}{1-p}$$

- 若 $p > 1$：$1-p < 0$，$b^{1-p} \\to 0$，积分 $= \\frac{1}{p-1}$（收敛）
- 若 $0 < p < 1$：$1-p > 0$，$b^{1-p} \\to +\\infty$（发散）

当 $p = 1$ 时（调和级数）：

$$\\int_1^{+\\infty} \\frac{dx}{x} = \\ln b \\big|_1^{\\infty} = +\\infty \\text{ （发散）}$$

综上：$p > 1$ 收敛，$p \\leq 1$ 发散。`,
    conclusion: '$\\sum \\frac{1}{n^p}$：$p > 1$ 收敛，$p \\leq 1$ 发散。$p = 1$ 为调和级数',
    applications: [
      '比较判别法的标准尺：$\\sum \\frac{1}{n^{1.5}}$ 收敛（$p=1.5>1$）',
      '调和级数发散的直观理解：$\\frac{1}{2} + \\frac{1}{3}+\\frac{1}{4} > \\frac{1}{2}$，可分出无穷个大于$\\frac{1}{2}$的组',
      '$\\sum \\frac{1}{n \\ln n}$ 发散（比调和级数慢但仍然发散）'
    ]
  },
  {
    id: 'series-ratio-test',
    title: '比值审敛法的推导',
    introduction: '比值审敛法通过与已知敛散的几何级数比较来判断级数的敛散性。',
    derivation: `**定理陈述**

设 $\\sum a_n$（$a_n > 0$），若 $\\lim \\frac{a_{n+1}}{a_n} = \\rho$，则 $\\rho < 1$ 收敛，$\\rho > 1$ 发散。

---

**推导过程（$\\rho < 1$ 的情形）**

设 $\\rho < 1$，取 $q$ 使得 $\\rho < q < 1$。

由极限定义，存在 $N$，当 $n > N$ 时：

$$\\frac{a_{n+1}}{a_n} < q$$

即 $a_{n+1} < q \\cdot a_n$。递推得：

$$a_{N+1} < q \\cdot a_N, \\quad a_{N+2} < q \\cdot a_{N+1} < q^2 a_N, \\quad \\ldots, \\quad a_{N+k} < q^k a_N$$

所以：

$$\\sum_{k=1}^{\\infty} a_{N+k} < a_N \\sum_{k=1}^{\\infty} q^k = \\frac{a_N q}{1-q}$$

右边是收敛的几何级数，由比较判别法，$\\sum a_{N+k}$ 收敛，加上前 $N$ 项不影响，故 $\\sum a_n$ 收敛。

---

**$\\rho > 1$ 的情形**

当 $n$ 足够大时 $\\frac{a_{n+1}}{a_n} > 1$，即 $a_{n+1} > a_n$，通项不趋于零，故发散。`,
    conclusion: '$\\lim \\frac{a_{n+1}}{a_n} = \\rho$：$\\rho < 1$ 收敛，$\\rho > 1$ 发散，$\\rho = 1$ 失效',
    applications: [
      '$\\sum \\frac{n!}{n^n}$：$\\frac{a_{n+1}}{a_n} = \\frac{(n+1)!}{(n+1)^{n+1}} \\cdot \\frac{n^n}{n!} = \\frac{1}{(1+1/n)^n} \\to \\frac{1}{e} < 1$，收敛',
      '$\\rho = 1$ 时需换方法：如 $\\sum \\frac{1}{n}$ 和 $\\sum \\frac{1}{n^2}$ 都有 $\\rho = 1$，但前者发散后者收敛',
      '含阶乘、指数的级数优先用比值法'
    ]
  },
  {
    id: 'series-power-radius',
    title: '幂级数收敛半径公式的推导',
    introduction: '幂级数收敛半径公式来自比值审敛法（或根值审敛法）的直接应用。',
    derivation: `**问题设置**

设幂级数 $\\sum_{n=0}^{\\infty} a_n x^n$，求收敛半径 $R$。

---

**用比值审敛法推导**

对级数通项取相邻项之比的绝对值：

$$\\lim_{n\\to\\infty} \\left|\\frac{a_{n+1} x^{n+1}}{a_n x^n}\\right| = \\lim_{n\\to\\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| \\cdot |x|$$

设 $\\lim |\\frac{a_{n+1}}{a_n}| = L$，则上式 $= L|x|$。

由比值审敛法，当 $L|x| < 1$ 即 $|x| < \\frac{1}{L}$ 时级数收敛。

所以收敛半径 $R = \\frac{1}{L} = \\frac{1}{\\lim |a_{n+1}/a_n|}$。

---

**特殊情况**

- $L = 0$：$R = +\\infty$（级数对一切 $x$ 收敛）
- $L = +\\infty$：$R = 0$（级数仅在 $x = 0$ 收敛）

---

**根值法版本**

类似地，用根值审敛法：$\\lim \\sqrt[n]{|a_n x^n|} = \\lim \\sqrt[n]{|a_n|} \\cdot |x|$，得 $R = \\frac{1}{\\lim \\sqrt[n]{|a_n|}}$。`,
    conclusion: '$R = \\frac{1}{\\lim |a_{n+1}/a_n|} = \\frac{1}{\\lim \\sqrt[n]{|a_n|}}$，端点需单独判断',
    applications: [
      '$\\sum \\frac{x^n}{n}$：$R = 1/\\lim(1/(n+1))/(1/n) = 1$',
      '$\\sum \\frac{x^n}{n!}$：$R = 1/\\lim(1/(n+1)!)/(1/n!) = 1/\\lim 1/(n+1) = +\\infty$',
      '端点 $x = \\pm R$ 必须单独用数项级数审敛法判断'
    ]
  },
  {
    id: 'series-taylor-maclaurin',
    title: 'Taylor级数展开的推导',
    introduction: 'Taylor级数将函数展开为幂级数，是函数逼近和级数求和的理论基础。',
    derivation: `**Taylor公式回顾**

设 $f(x)$ 在 $x_0$ 处有任意阶导数，Taylor公式为：

$$f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k + R_n(x)$$

---

**Taylor级数**

若余项 $R_n(x) \\to 0$（$n \\to \\infty$），则函数可展开为Taylor级数：

$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n$$

---

**常用展开式的推导（以 $e^x$ 为例）**

$f(x) = e^x$，$f^{(n)}(0) = 1$（所有阶导数在0处值都为1），代入：

$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$$

收敛域 $(-\\infty, +\\infty)$（因为 $R = 1/\\lim 1/(n+1) = +\\infty$）。

---

**间接展开法**

利用已知展开式和逐项求导/积分得到新的展开式。例如：

$\\frac{1}{1+x} = \\sum(-1)^n x^n$（$|x|<1$），逐项积分得：

$$\\ln(1+x) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}x^n}{n} \\text{ （}|x| \\leq 1\\text{）}$$`,
    conclusion: '$f(x) = \\sum \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n$（余项趋于零时），常用六个基本展开式需背熟',
    applications: [
      '$\\sin x = \\sum \\frac{(-1)^n x^{2n+1}}{(2n+1)!}$，$\\cos x = \\sum \\frac{(-1)^n x^{2n}}{(2n)!}$',
      '$\\frac{1}{1-x} = \\sum x^n$（$|x|<1$），逐项求导得 $\\frac{1}{(1-x)^2} = \\sum nx^{n-1}$',
      '间接展开：$e^{-x^2} = \\sum \\frac{(-1)^n x^{2n}}{n!}$（令 $t = -x^2$ 代入 $e^t$ 的展开式）'
    ]
  },
  {
    id: 'series-fourier-coefficients',
    title: '傅里叶系数公式的推导',
    introduction: '傅里叶系数公式利用三角函数系的正交性推导，是傅里叶级数的理论基础。',
    derivation: `**三角函数系的正交性**

函数系 $\\{1, \\cos nx, \\sin nx\\}$ 在 $[-\\pi, \\pi]$ 上正交：

$$\\int_{-\\pi}^{\\pi} \\cos mx \\cos nx\\,dx = \\begin{cases} 0 & m \\neq n \\\\ \\pi & m = n \\neq 0 \\\\ 2\\pi & m = n = 0 \\end{cases}$$

$$\\int_{-\\pi}^{\\pi} \\sin mx \\sin nx\\,dx = \\begin{cases} 0 & m \\neq n \\\\ \\pi & m = n \\end{cases}$$

$$\\int_{-\\pi}^{\\pi} \\cos mx \\sin nx\\,dx = 0 \\text{ （对所有 } m, n\\text{）}$$

---

**推导 $a_n$**

设 $f(x) = \\frac{a_0}{2} + \\sum(a_n \\cos nx + b_n \\sin nx)$，两边乘 $\\cos kx$ 并在 $[-\\pi, \\pi]$ 上积分：

$$\\int_{-\\pi}^{\\pi} f(x)\\cos kx\\,dx = a_k \\int_{-\\pi}^{\\pi} \\cos^2 kx\\,dx = a_k \\cdot \\pi$$

所以 $a_k = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\cos kx\\,dx$（$k \\geq 1$）。

---

**推导 $a_0$**

两边在 $[-\\pi, \\pi]$ 上积分，三角函数积分全为零：

$$\\int_{-\\pi}^{\\pi} f(x)\\,dx = \\frac{a_0}{2} \\cdot 2\\pi = a_0 \\pi$$

所以 $a_0 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\,dx$。$a_0/2$ 的写法使公式统一。

---

**推导 $b_n$**

类似地，乘 $\\sin kx$ 并积分得 $b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin nx\\,dx$。`,
    conclusion: '$a_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\cos nx\\,dx$，$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin nx\\,dx$，$a_0 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\,dx$',
    applications: [
      '$f(x) = x$（奇函数）：$a_n = 0$，$b_n = \\frac{2(-1)^{n+1}}{n}$，展开为 $2\\sum \\frac{(-1)^{n+1}}{n}\\sin nx$',
      '奇函数只有 $b_n$（正弦级数），偶函数只有 $a_n$（余弦级数）',
      '帕塞瓦尔等式：$\\frac{a_0^2}{2}+\\sum(a_n^2+b_n^2) = \\frac{1}{\\pi}\\int f^2 dx$'
    ]
  },
];

// 微分方程公式推导数据
const DIFFERENTIAL_EQUATIONS_DERIVATIONS: DerivationItem[] = [
  {
    id: 'separable',
    title: '可分离变量微分方程',
    introduction: '这是最基础的一类微分方程，掌握它是学习更复杂方程的起点。',
    derivation: `**问题引入**

当我们遇到方程 $\\frac{dy}{dx} = f(x) \\cdot g(y)$ 时，会发现一个有趣的特点：等式右边可以分解成两个"独立"的部分——一个只和 $x$ 有关，另一个只和 $y$ 有关。

这给了我们一个自然的想法：能不能把含 $x$ 的放一边，含 $y$ 的放另一边？

---

**核心思想：分离变量**

关键步骤是"分离变量"。直觉上，我们希望把所有 $y$ 移到左边，所有 $x$ 移到右边：

$$\\frac{dy}{g(y)} = f(x)dx$$

这个操作的数学依据是什么？其实可以把 $\\frac{dy}{dx}$ 看作一个整体，两边同乘 $\\frac{dx}{g(y)}$ 即可。当然，这里有个前提条件：$g(y) \\neq 0$。

---

**积分求解**

分离后，两边都是"纯"的微分形式了，可以直接积分：

$$\\int \\frac{dy}{g(y)} = \\int f(x)dx + C$$

注意右边要加常数 $C$。为什么左边不加？因为两个任意常数可以合并成一个。

设 $G(y)$ 是 $\\frac{1}{g(y)}$ 的原函数，$F(x)$ 是 $f(x)$ 的原函数，则通解为：

$$G(y) = F(x) + C$$

有时可以解出 $y$ 的显式表达式，有时只能保持隐式形式。`,
    conclusion: '$\\int \\frac{dy}{g(y)} = \\int f(x)dx + C$',
    applications: [
      '$\\frac{dy}{dx} = xy$ → 分离得 $\\frac{dy}{y} = x dx$ → $\\ln|y| = \\frac{x^2}{2} + C$ → $y = Ce^{x^2/2}$',
      '$\\frac{dy}{dx} = e^{x+y}$ → 分离得 $e^{-y}dy = e^x dx$ → $-e^{-y} = e^x + C$',
      '人口增长模型 $\\frac{dP}{dt} = kP$ 的解是指数增长 $P = P_0 e^{kt}$'
    ]
  },
  {
    id: 'first-order-linear',
    title: '一阶线性微分方程通解公式',
    introduction: '常数变易法是求解非齐次线性方程的经典技巧，体现了"从特殊到一般"的数学思想。',
    derivation: `**方程的标准形式**

一阶线性微分方程的标准形式为：

$$\\frac{dy}{dx} + P(x)y = Q(x)$$

其中 $P(x)$ 和 $Q(x)$ 是已知的连续函数。如果 $Q(x) = 0$，称为**齐次**方程；否则称为**非齐次**方程。

---

**第一步：先解决简单情况**

先考虑齐次方程 $\\frac{dy}{dx} + P(x)y = 0$。

这恰好是可分离变量的方程！分离后得到：

$$\\frac{dy}{y} = -P(x)dx$$

积分得 $\\ln|y| = -\\int P(x)dx + C$，即：

$$y = Ce^{-\\int P(x)dx}$$

这就是齐次方程的通解。

---

**第二步：常数变易法的思想**

现在回到非齐次方程。我们已经有齐次方程的解 $y = Ce^{-\\int P(x)dx}$。

**关键洞察**：齐次方程的解 $y$ 乘以任意常数 $C$ 仍然是解，因为方程是线性的。那么，如果把"常数" $C$ 换成"函数" $C(x)$，会发生什么？

设 $y = C(x)e^{-\\int P(x)dx}$，代入原方程看看。

---

**第三步：代入求导**

对 $y$ 求导：

$$y' = C'(x)e^{-\\int P(x)dx} + C(x) \\cdot (-P(x))e^{-\\int P(x)dx}$$

代入原方程 $y' + P(x)y = Q(x)$：

$$C'(x)e^{-\\int P(x)dx} - P(x)C(x)e^{-\\int P(x)dx} + P(x) \\cdot C(x)e^{-\\int P(x)dx} = Q(x)$$

神奇的事情发生了！$-P(x)$ 和 $+P(x)$ 正好抵消：

$$C'(x)e^{-\\int P(x)dx} = Q(x)$$

---

**第四步：解出通解**

分离 $C'(x)$：

$$C'(x) = Q(x)e^{\\int P(x)dx}$$

积分得：

$$C(x) = \\int Q(x)e^{\\int P(x)dx}dx + C$$

代回 $y$ 的表达式，得到**通解公式**：

$$y = e^{-\\int P(x)dx}\\left[\\int Q(x)e^{\\int P(x)dx}dx + C\\right]$$

这个公式看起来复杂，但它的结构很清晰：$e^{-\\int P(x)dx}$ 是积分因子，括号内是特解加常数。`,
    conclusion: '$y = e^{-\\int P(x)dx}\\left[\\int Q(x)e^{\\int P(x)dx}dx + C\\right]$',
    applications: [
      "$y' + 2y = e^x$：$P(x)=2$, $Q(x)=e^x$，代入得 $y = \\frac{1}{3}e^x + Ce^{-2x}$",
      "$y' - \\frac{y}{x} = x^2$：$P(x)=-\\frac{1}{x}$, $Q(x)=x^2$，代入得 $y = x^3 + Cx$",
      'RL电路中电流方程 $L\\frac{di}{dt} + Ri = E$ 可直接应用此公式'
    ]
  },
  {
    id: 'second-order-homogeneous',
    title: '二阶常系数齐次线性微分方程',
    introduction: '为什么指数函数是这类方程的"标准解"？这源于指数函数的独特性质：求导后"还是自己"。',
    derivation: `**方程与直觉**

考虑方程 $y'' + py' + qy = 0$，其中 $p$、$q$ 是常数。

我们的直觉是：什么样的函数，求二阶导、求一阶导之后，还能凑出原来的函数？

**答案**：指数函数 $e^{rx}$！

因为 $(e^{rx})' = re^{rx}$，$(e^{rx})'' = r^2e^{rx}$，都是 $e^{rx}$ 乘以某个常数。

---

**试探解与特征方程**

设 $y = e^{rx}$（$r$ 待定），代入方程：

$$r^2e^{rx} + pr \\cdot e^{rx} + q \\cdot e^{rx} = 0$$

提取公因子 $e^{rx}$（它永远不为零）：

$$(r^2 + pr + q)e^{rx} = 0$$

要使上式成立，必须有：

$$r^2 + pr + q = 0$$

这就是**特征方程**！求微分方程的解，转化成了求代数方程的根。

---

**三种情况的讨论**

设判别式 $\\Delta = p^2 - 4q$，特征根 $r_{1,2} = \\frac{-p \\pm \\sqrt{\\Delta}}{2}$。

**情况一：$\\Delta > 0$（两个相异实根）**

两个实根 $r_1 \\neq r_2$，对应两个线性无关的解 $e^{r_1x}$ 和 $e^{r_2x}$。通解为：

$$y = C_1 e^{r_1x} + C_2 e^{r_2x}$$

**情况二：$\\Delta = 0$（重根）**

只有一个根 $r = -\\frac{p}{2}$，我们只找到一个解 $e^{rx}$。另一个线性无关的解从哪里来？

可以验证 $xe^{rx}$ 也是解（用降阶法或直接代入验证）。通解为：

$$y = (C_1 + C_2x)e^{rx}$$

**情况三：$\\Delta < 0$（共轭复根）**

设 $r = \\alpha \\pm \\beta i$，形式上解是 $e^{(\\alpha \\pm \\beta i)x}$。但这不是实函数！

利用欧拉公式 $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$：

$$e^{(\\alpha \\pm \\beta i)x} = e^{\\alpha x}(\\cos\\beta x \\pm i\\sin\\beta x)$$

取实部和虚部的线性组合，得到实数形式的通解：

$$y = e^{\\alpha x}(C_1\\cos\\beta x + C_2\\sin\\beta x)$$`,
    conclusion: '根据特征根：$y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$ 或 $(C_1 + C_2x)e^{rx}$ 或 $e^{\\alpha x}(C_1\\cos\\beta x + C_2\\sin\\beta x)$',
    applications: [
      "$y'' - 3y' + 2y = 0$：特征方程 $r^2-3r+2=0$，根 $r=1,2$，通解 $y = C_1e^x + C_2e^{2x}$",
      "$y'' - 4y' + 4y = 0$：特征方程 $(r-2)^2=0$，重根 $r=2$，通解 $y = (C_1 + C_2x)e^{2x}$",
      "$y'' + 4y = 0$：特征方程 $r^2+4=0$，复根 $r=\\pm 2i$，通解 $y = C_1\\cos 2x + C_2\\sin 2x$",
      '弹簧振子方程 $m\\ddot{x} + kx = 0$ 描述简谐运动，频率 $\\omega = \\sqrt{k/m}$'
    ]
  },
  {
    id: 'second-order-nonhomogeneous',
    title: '二阶常系数非齐次线性微分方程',
    introduction: '非齐次方程的解 = 齐次通解 + 非齐次特解。关键是找特解，待定系数法是最实用的技巧。',
    derivation: `**解的结构**

对于方程 $y'' + py' + qy = f(x)$（$f(x) \\neq 0$），有一个重要的结构定理：

$$y_{通解} = y_{齐次通解} + y_{特解}$$

这告诉我们：先求齐次方程的通解（上节已解决），再找一个特解，问题就完成了。

---

**待定系数法的思想**

特解长什么样？取决于 $f(x)$ 的形式。

**核心观察**：如果 $f(x)$ 是多项式、指数函数、正弦余弦的乘积，那么特解也应该是类似的形式，只是系数待定。

---

**类型一：$f(x) = P_m(x)e^{\\lambda x}$**

$f(x)$ 是多项式乘以指数函数。设特解形式：

$$y_p = x^k Q_m(x)e^{\\lambda x}$$

其中 $Q_m(x)$ 是与 $P_m(x)$ 同次的多项式（系数待定），$k$ 的取值：

- $\\lambda$ 不是特征根：$k = 0$
- $\\lambda$ 是单特征根：$k = 1$  
- $\\lambda$ 是重特征根：$k = 2$

把 $y_p$ 代入方程，比较系数确定 $Q_m(x)$ 的各系数。

---

**类型二：$f(x) = e^{\\lambda x}[P_l(x)\\cos\\beta x + P_n(x)\\sin\\beta x]$**

设特解形式：

$$y_p = x^k e^{\\lambda x}[R_m^{(1)}(x)\\cos\\beta x + R_m^{(2)}(x)\\sin\\beta x]$$

其中 $m = \\max(l, n)$，$k$ 的取值：

- $\\lambda + \\beta i$ 不是特征根：$k = 0$
- $\\lambda + \\beta i$ 是特征根：$k = 1$

---

**为什么 $x^k$ 因子？**

直观理解：当 $\\lambda$ 是特征根时，$e^{\\lambda x}$ 已经是齐次解的一部分，需要乘 $x$ 才能找到新的线性无关解。

就像重根情况下，我们从 $e^{rx}$ 到 $xe^{rx}$，现在从 $e^{\\lambda x}P(x)$ 到 $xe^{\\lambda x}P(x)$。`,
    conclusion: '$y = y_h + y_p$（齐次通解 + 待定系数法求特解）',
    applications: [
      "$y'' + y = e^x$：$e^x$ 不是齐次解，设 $y_p = Ae^x$，代入得 $A = \\frac{1}{2}$",
      "$y'' - 2y' + y = xe^x$：$e^x$ 是重根对应的解，设 $y_p = x^2(Ax+B)e^x$，比较系数",
      "$y'' + y = \\sin x$：$i$ 是特征根，设 $y_p = x(A\\cos x + B\\sin x)$",
      '强迫振动方程的稳态解可以用此方法求得'
    ]
  },
  {
    id: 'reducible',
    title: '可降阶的高阶微分方程',
    introduction: '有些高阶方程可以通过变量代换降低阶数，化繁为简。',
    derivation: `**类型一：$y^{(n)} = f(x)$ —— 直接积分**

这是最简单的情况，右边只有 $x$。直接积分 $n$ 次：

$$y = \\underbrace{\\int \\int \\cdots \\int}_{n次} f(x) (dx)^n + C_1 x^{n-1} + C_2 x^{n-2} + \\cdots + C_n$$

每次积分产生一个任意常数，最终有 $n$ 个独立常数。

---

**类型二：$y'' = f(x, y')$ —— 缺 $y$ 型**

方程中不显含 $y$。令 $p = y'$，则 $y'' = p'$，方程降为一阶：

$$\\frac{dp}{dx} = f(x, p)$$

解出 $p = p(x, C_1)$ 后，再积分：

$$y = \\int p(x, C_1) dx + C_2$$

---

**类型三：$y'' = f(y, y')$ —— 缺 $x$ 型**

方程中不显含 $x$。这时把 $y$ 看作自变量更方便。

令 $p = y' = \\frac{dy}{dx}$，利用链式法则：

$$y'' = \\frac{dp}{dx} = \\frac{dp}{dy} \\cdot \\frac{dy}{dx} = p\\frac{dp}{dy}$$

方程变为关于 $p$ 和 $y$ 的一阶方程：

$$p\\frac{dp}{dy} = f(y, p)$$

解出 $p = p(y, C_1)$，再由 $\\frac{dy}{dx} = p(y)$ 分离变量求解。

---

**为什么这样代换有效？**

关键在于识别方程中"缺少"的变量：
- 缺 $y$：用 $p = y'$ 把问题从 $(x, y)$ 转到 $(x, p)$
- 缺 $x$：用 $p = y'$ 把问题从 $(x, y)$ 转到 $(y, p)$

选择合适的自变量，让方程变得更简单。`,
    conclusion: "设 $p = y'$，根据方程特点选择合适的自变量进行降阶",
    applications: [
      "$y''' = e^x$：积分三次得 $y = e^x + C_1x^2 + C_2x + C_3$",
      "$y'' = xy'$：设 $p=y'$，得 $\\frac{dp}{p} = xdx$，$p = C_1e^{x^2/2}$，$y = C_1\\int e^{x^2/2}dx + C_2$",
      "$yy'' - (y')^2 = 0$：设 $p=y'$，得 $yp\\frac{dp}{dy} - p^2 = 0$，解得 $y = C_1e^{C_2x}$"
    ]
  },
  {
    id: 'euler-equation',
    title: '欧拉方程',
    introduction: '变系数方程一般很难求解，但欧拉方程有特殊结构，可以通过巧妙的变量代换化为常系数方程。',
    derivation: `**方程形式**

欧拉方程的标准形式：

$$x^n y^{(n)} + a_1 x^{n-1} y^{(n-1)} + \\cdots + a_{n-1} xy' + a_n y = f(x)$$

特点是每一项都是 $x$ 的幂次乘以 $y$ 的某阶导数，且两者指数之和恰好等于 $n$。

---

**关键代换：$x = e^t$（或 $t = \\ln x$）**

为什么选择这个代换？看一个简单例子：

对于一阶欧拉方程 $xy' + y = 0$，如果令 $x = e^t$，那么：

$$\\frac{dy}{dx} = \\frac{dy}{dt} \\cdot \\frac{dt}{dx} = \\frac{dy}{dt} \\cdot \\frac{1}{x} = \\frac{1}{x}\\frac{dy}{dt}$$

于是 $x\\frac{dy}{dx} = \\frac{dy}{dt}$，"变系数" $x$ 消失了！

---

**一般情况的推导**

设 $x = e^t$，记 $D = \\frac{d}{dt}$，$\\theta = x\\frac{d}{dx}$，则：

$$\\theta = x\\frac{d}{dx} = x \\cdot \\frac{dt}{dx} \\cdot \\frac{d}{dt} = x \\cdot \\frac{1}{x} \\cdot D = D$$

类似地：

$$x^2\\frac{d^2}{dx^2} = \\theta(\\theta - 1) = D(D-1)$$

$$x^3\\frac{d^3}{dx^3} = \\theta(\\theta-1)(\\theta-2) = D(D-1)(D-2)$$

一般地，$x^k \\frac{d^k}{dx^k} = D(D-1)(D-2)\\cdots(D-k+1)$

---

**化为常系数方程**

代入这些关系，欧拉方程变成了关于 $t$ 的常系数线性方程！

以二阶为例，原方程 $x^2y'' + axy' + by = f(x)$ 变为：

$$D(D-1)y + aDy + by = f(e^t)$$

即 $(D^2 + (a-1)D + b)y = f(e^t)$

这是常系数线性方程，用特征方程法求解，最后回代 $t = \\ln x$。`,
    conclusion: '$x = e^t$ 代换，$x\\frac{d}{dx} = \\frac{d}{dt}$，化为常系数方程',
    applications: [
      "$x^2y'' + xy' - y = 0$：令 $x=e^t$，得 $D(D-1)y + Dy - y = 0$，即 $y'' - y = 0$，解 $y = C_1e^t + C_2e^{-t} = C_1x + \\frac{C_2}{x}$",
      "$x^2y'' + 3xy' + y = 0$：特征方程 $r(r-1) + 3r + 1 = 0$，即 $(r+1)^2 = 0$，通解 $y = (C_1 + C_2\\ln x) \\cdot \\frac{1}{x}$",
      '球坐标系下的拉普拉斯方程径向部分是欧拉方程'
    ]
  },
  {
    id: 'bernoulli',
    title: '伯努利方程',
    introduction: '非线性方程一般很难求解，但伯努利方程有特殊的非线性结构，可以通过变量代换线性化。',
    derivation: `**方程形式**

伯努利方程：

$$\\frac{dy}{dx} + P(x)y = Q(x)y^n \\quad (n \\neq 0, 1)$$

当 $n = 0$ 时是线性方程，$n = 1$ 时是可分离变量方程，所以只讨论 $n \\neq 0, 1$。

方程右边的 $y^n$ 项使其成为非线性方程，但我们有办法把它"变"成线性方程。

---

**关键洞察：为什么 $z = y^{1-n}$ 有效？**

两边除以 $y^n$：

$$y^{-n}\\frac{dy}{dx} + P(x)y^{1-n} = Q(x)$$

观察 $y^{1-n}$，设 $z = y^{1-n}$，那么：

$$\\frac{dz}{dx} = (1-n)y^{-n}\\frac{dy}{dx}$$

即 $y^{-n}\\frac{dy}{dx} = \\frac{1}{1-n}\\frac{dz}{dx}$

这正是我们需要的！

---

**代入整理**

将 $z = y^{1-n}$ 和 $y^{-n}\\frac{dy}{dx} = \\frac{1}{1-n}\\frac{dz}{dx}$ 代入：

$$\\frac{1}{1-n}\\frac{dz}{dx} + P(x)z = Q(x)$$

整理得：

$$\\frac{dz}{dx} + (1-n)P(x)z = (1-n)Q(x)$$

这是关于 $z$ 的**一阶线性方程**！可以用通解公式求解。

---

**求解步骤总结**

1. 识别伯努利方程，确定 $P(x)$、$Q(x)$ 和 $n$
2. 作代换 $z = y^{1-n}$
3. 得到关于 $z$ 的线性方程：$z' + (1-n)P(x)z = (1-n)Q(x)$
4. 用一阶线性方程通解公式求 $z$
5. 回代 $y = z^{\\frac{1}{1-n}}$`,
    conclusion: '$z = y^{1-n}$，化为 $\\frac{dz}{dx} + (1-n)P(x)z = (1-n)Q(x)$',
    applications: [
      "$y' + y = xy^2$：$n=2$，设 $z = y^{-1}$，得 $z' - z = -x$，解得 $z = \\frac{1}{2}(x+1) + Ce^x$，故 $y = \\frac{1}{\\frac{1}{2}(x+1) + Ce^x}$",
      "$y' + \\frac{y}{x} = y^2\\ln x$：$n=2$，设 $z = y^{-1}$，得 $z' - \\frac{z}{x} = -\\ln x$",
      "$y' = \\frac{x}{y}(x^2 + y^2)$：可化为伯努利方程求解"
    ]
  },
  {
    id: 'homogeneous',
    title: '齐次微分方程',
    introduction: '当方程右边可以写成 $\\frac{y}{x}$ 的函数时，通过令 $u = \\frac{y}{x}$ 可以化为可分离变量方程。',
    derivation: `**方程形式与识别**

齐次微分方程的两种等价形式：

$$\\frac{dy}{dx} = f\\left(\\frac{y}{x}\\right)$$

或更一般的形式：

$$\\frac{dy}{dx} = \\varphi(x, y)，其中 \\varphi(\\lambda x, \\lambda y) = \\varphi(x, y)$$

后者称为**零次齐次函数**——把 $x$ 和 $y$ 同时放大 $\\lambda$ 倍，函数值不变。

**识别技巧**：方程中 $x$ 和 $y$ 的"总次数"相同。例如 $\\frac{x+y}{x-y}$，分子分母都是一次。

---

**变量代换的思想**

既然方程只依赖 $\\frac{y}{x}$ 这个比值，为什么不直接设 $u = \\frac{y}{x}$？

令 $u = \\frac{y}{x}$，即 $y = ux$，求导：

$$\\frac{dy}{dx} = u + x\\frac{du}{dx}$$

代入原方程 $\\frac{dy}{dx} = f(u)$：

$$u + x\\frac{du}{dx} = f(u)$$

---

**化为可分离变量**

移项得：

$$x\\frac{du}{dx} = f(u) - u$$

分离变量：

$$\\frac{du}{f(u) - u} = \\frac{dx}{x}$$

这是可分离变量的方程！

积分得：

$$\\int \\frac{du}{f(u) - u} = \\ln|x| + C$$

求出 $u = u(x)$ 后，回代 $y = ux$ 得到原方程的解。

---

**典型例题分析**

**例**：$\\frac{dy}{dx} = \\frac{x + y}{x - y}$

检验：$\\frac{x+y}{x-y}$ 是零次齐次函数（分子分母同次）。

设 $u = \\frac{y}{x}$，则 $y = ux$，$\\frac{dy}{dx} = u + x\\frac{du}{dx}$。

代入：$u + x\\frac{du}{dx} = \\frac{1 + u}{1 - u}$

整理：$x\\frac{du}{dx} = \\frac{1 + u}{1 - u} - u = \\frac{1 + u^2}{1 - u}$

分离：$\\frac{1-u}{1+u^2}du = \\frac{dx}{x}$

积分：$\\int \\frac{1-u}{1+u^2}du = \\ln|x| + C$

左边拆成 $\\int \\frac{1}{1+u^2}du - \\int \\frac{u}{1+u^2}du = \\arctan u - \\frac{1}{2}\\ln(1+u^2)$

回代 $u = \\frac{y}{x}$，得到隐式通解。`,
    conclusion: '$u = \\frac{y}{x}$，化为 $\\frac{du}{f(u)-u} = \\frac{dx}{x}$',
    applications: [
      "$\\frac{dy}{dx} = \\frac{y}{x}$：设 $u = \\frac{y}{x}$，得 $u + x\\frac{du}{dx} = u$，即 $\\frac{du}{dx} = 0$，解 $y = Cx$",
      "$\\frac{dy}{dx} = \\frac{x^2 + y^2}{xy}$：设 $u = \\frac{y}{x}$，化简后积分",
      "$\\frac{dy}{dx} = \\tan\\frac{y}{x} + \\frac{y}{x}$：设 $u = \\frac{y}{x}$，得 $x\\frac{du}{dx} = \\tan u$"
    ]
  }
];

// 第一章 随机事件和概率 推导
const PROBABILITY_EVENTS_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-addition-formula',
    title: '概率加法公式',
    introduction: '加法公式是概率运算的基础，从公理出发推导任意两事件并的概率公式。',
    derivation: `**出发点：概率的可加性公理**

概率公理给出：若 $A$ 与 $B$ 互斥（$AB = \\emptyset$），则 $P(A \\cup B) = P(A) + P(B)$。

但一般情况下，$A$ 和 $B$ 不一定互斥。如何处理？

---

**核心思想：分解为互斥事件**

将 $A \\cup B$ 分解为互斥的三部分：$A \\cup B = (A - B) \\cup (AB) \\cup (B - A)$

即 $A \\cup B = A\\bar{B} \\cup AB \\cup \\bar{A}B$

另一方面：$A = A\\bar{B} \\cup AB$（互斥分解），$B = \\bar{A}B \\cup AB$（互斥分解）

所以：
- $P(A) = P(A\\bar{B}) + P(AB)$，即 $P(A\\bar{B}) = P(A) - P(AB)$
- $P(B) = P(\\bar{A}B) + P(AB)$，即 $P(\\bar{A}B) = P(B) - P(AB)$

---

**推导**

$$P(A \\cup B) = P(A\\bar{B}) + P(AB) + P(\\bar{A}B)$$

代入上面的等式：

$$= [P(A) - P(AB)] + P(AB) + [P(B) - P(AB)]$$

$$= P(A) + P(B) - P(AB)$$

---

**推广到三事件**

$$P(A \\cup B \\cup C) = P(A) + P(B) + P(C) - P(AB) - P(AC) - P(BC) + P(ABC)$$

这就是容斥原理的$n=3$情形。`,
    conclusion: '$P(A \\cup B) = P(A) + P(B) - P(AB)$',
    applications: [
      '甲乙两人射击，甲命中率0.6，乙命中率0.7，两人同时命中的概率0.4，则至少一人命中：$P = 0.6 + 0.7 - 0.4 = 0.9$',
      '推广：$P(\\bar{A}) = 1 - P(A)$（取$B = \\Omega$时的特例）'
    ]
  },
  {
    id: 'prob-bayes-derivation',
    title: '贝叶斯公式',
    introduction: '从全概率公式出发，推导贝叶斯公式的核心思想——"由果溯因"。',
    derivation: `**问题引入**

已知结果 $A$ 发生了，问"原因"$B_k$ 导致此结果的概率有多大？这就是"由果溯因"。

---

**准备：全概率公式**

设 $B_1, B_2, \\ldots, B_n$ 为完备事件组，则：

$$P(A) = \\sum_{i=1}^{n} P(B_i) P(A|B_i)$$

---

**推导贝叶斯公式**

由条件概率定义：

$$P(B_k|A) = \\frac{P(B_k A)}{P(A)}$$

由乘法公式：$P(B_k A) = P(B_k) P(A|B_k)$

由全概率公式：$P(A) = \\sum_{i=1}^{n} P(B_i) P(A|B_i)$

代入得：

$$P(B_k|A) = \\frac{P(B_k) P(A|B_k)}{\\sum_{i=1}^{n} P(B_i) P(A|B_i)}$$

---

**直观理解**

- 分子 $P(B_k) P(A|B_k)$：原因 $B_k$ 导致结果 $A$ 的概率
- 分母 $\\sum P(B_i) P(A|B_i)$：所有原因导致 $A$ 的总概率
- 比值：原因 $B_k$ 的"贡献份额"

即后验概率 $=$ 先验概率 $\\times$ 似然度 $/$ 归一化常数`,
    conclusion: '$P(B_k|A) = \\frac{P(B_k)P(A|B_k)}{\\sum_i P(B_i)P(A|B_i)}$',
    applications: [
      '疾病诊断：发病率0.1%，检测准确率99%，则检测阳性时真患病概率 = $\\frac{0.001 \\times 0.99}{0.001 \\times 0.99 + 0.999 \\times 0.01} \\approx 9%$——假阳性率极高！',
      '垃圾邮件过滤：先验概率为邮件中垃圾邮件比例，似然度为关键词在垃圾邮件中出现的频率'
    ]
  },
  {
    id: 'prob-independence-equivalent',
    title: '事件独立的等价条件',
    introduction: '从独立性定义出发，推导独立性的各种等价表述，揭示独立性的本质。',
    derivation: `**独立性定义**

$A$ 与 $B$ 独立 $\\Leftrightarrow$ $P(AB) = P(A)P(B)$

这是最根本的等价条件。由此出发，推导其他等价形式。

---

**等价条件一：条件概率等于无条件概率**

若 $P(B) > 0$：

$$P(A|B) = \\frac{P(AB)}{P(B)} = \\frac{P(A)P(B)}{P(B)} = P(A)$$

即：$B$ 的发生不影响 $A$ 的概率。这是独立性最直观的含义。

---

**等价条件二：$A$ 与 $\\bar{B}$ 独立**

$$P(A\\bar{B}) = P(A) - P(AB) = P(A) - P(A)P(B) = P(A)[1 - P(B)] = P(A)P(\\bar{B})$$

即：$A$ 与 $B$ 独立 $\\Rightarrow$ $A$ 与 $\\bar{B}$ 也独立。

---

**等价条件三：$\\bar{A}$ 与 $\\bar{B}$ 独立**

由等价条件二，$A$ 与 $B$ 独立 $\\Rightarrow$ $A$ 与 $\\bar{B}$ 独立 $\\Rightarrow$ $\\bar{A}$ 与 $\\bar{B}$ 独立。

所以独立性的"四个等价"：$AB$独立 $\\Leftrightarrow$ $A\\bar{B}$独立 $\\Leftrightarrow$ $\\bar{A}B$独立 $\\Leftrightarrow$ $\\bar{A}\\bar{B}$独立。`,
    conclusion: '$P(AB) = P(A)P(B) \\Leftrightarrow P(A|B) = P(A) \\Leftrightarrow P(A\\bar{B}) = P(A)P(\\bar{B})$',
    applications: [
      '独立性的等价条件在证明题中经常使用',
      '四个等价：$AB$独立、$A\\bar{B}$独立、$\\bar{A}B$独立、$\\bar{A}\\bar{B}$独立'
    ]
  }
];

// 第二章 一维随机变量及其分布 推导
const ONE_DIM_RV_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-cdf-properties-derivation',
    title: '分布函数性质的推导',
    introduction: '从分布函数的定义出发，推导其单调不减、有界、右连续等基本性质。',
    derivation: `**分布函数定义**

$$F(x) = P\\{X \\leq x\\}, \\quad -\\infty < x < +\\infty$$

---

**性质一：单调不减**

若 $x_1 < x_2$，则 $\\{X \\leq x_1\\} \\subset \\{X \\leq x_2\\}$

由概率的单调性：

$$F(x_1) = P\\{X \\leq x_1\\} \\leq P\\{X \\leq x_2\\} = F(x_2)$$

---

**性质二：边界值**

$$F(-\\infty) = \\lim_{x \\to -\\infty} P\\{X \\leq x\\} = P(\\emptyset) = 0$$

$$F(+\\infty) = \\lim_{x \\to +\\infty} P\\{X \\leq x\\} = P(\\Omega) = 1$$

直观理解：$x \\to -\\infty$时，"$X$不超过$-\\infty$"是不可能事件；$x \\to +\\infty$时，"$X$不超过$+\\infty$"是必然事件。

---

**性质三：右连续**

对任意 $x_0$，要证 $\\lim_{x \\to x_0^+} F(x) = F(x_0)$。

设 $x_n \\downarrow x_0$，则 $\\{X \\leq x_0\\} = \\bigcap_{n=1}^{\\infty} \\{X \\leq x_n\\}$（递减事件列的交）

由概率的连续性：

$$F(x_0) = P\\{X \\leq x_0\\} = P\\left(\\bigcap_{n=1}^{\\infty} \\{X \\leq x_n\\}\\right) = \\lim_{n \\to \\infty} P\\{X \\leq x_n\\} = \\lim_{n \\to \\infty} F(x_n)$$

---

**由分布函数求概率**

$$P\\{X > a\\} = 1 - F(a)$$

$$P\\{X = a\\} = F(a) - F(a-0) = F(a) - \\lim_{x \\to a^-}F(x)$$

$$P\\{a < X \\leq b\\} = F(b) - F(a)$$

$$P\\{a \\leq X \\leq b\\} = F(b) - F(a-) = F(b) - F(a) + P\\{X=a\\}$$`,
    conclusion: '$F(x)$单调不减、$F(-\\infty)=0, F(+\\infty)=1$、右连续，且$P\\{a<X\\leq b\\}=F(b)-F(a)$',
    applications: [
      '已知$F(x)$，求$P\\{1 < X \\leq 3\\} = F(3) - F(1)$',
      '离散型：$P\\{X=a\\} = F(a) - F(a-0)$即分布函数在$a$处的跳跃高度'
    ]
  },
  {
    id: 'prob-normal-standardization',
    title: '正态分布的标准化',
    introduction: '推导一般正态分布如何通过线性变换化为标准正态分布，这是正态分布计算的基础。',
    derivation: `**问题**

设 $X \\sim N(\\mu, \\sigma^2)$，如何求 $P\\{a < X < b\\}$？

直接积分需要每次计算 $\\frac{1}{\\sqrt{2\\pi}\\sigma}\\int_a^b e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}dx$，极其不便。

能否转化为标准正态 $N(0,1)$ 的查表问题？

---

**推导**

令 $Z = \\frac{X - \\mu}{\\sigma}$，求 $Z$ 的分布。

$F_Z(z) = P\\{Z \\leq z\\} = P\\left\\{\\frac{X-\\mu}{\\sigma} \\leq z\\right\\} = P\\{X \\leq \\mu + \\sigma z\\} = F_X(\\mu + \\sigma z)$

求导：

$$f_Z(z) = \\frac{d}{dz}F_X(\\mu + \\sigma z) = f_X(\\mu + \\sigma z) \\cdot \\sigma$$

$$= \\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{(\\sigma z)^2}{2\\sigma^2}} \\cdot \\sigma = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{z^2}{2}}$$

这正是 $N(0,1)$ 的密度函数！

---

**结论**

$$X \\sim N(\\mu, \\sigma^2) \\Rightarrow Z = \\frac{X-\\mu}{\\sigma} \\sim N(0,1)$$

因此：

$$P\\{a < X < b\\} = P\\left\\{\\frac{a-\\mu}{\\sigma} < Z < \\frac{b-\\mu}{\\sigma}\\right\\} = \\Phi\\left(\\frac{b-\\mu}{\\sigma}\\right) - \\Phi\\left(\\frac{a-\\mu}{\\sigma}\\right)$$

只需查标准正态分布表！`,
    conclusion: '$\\frac{X-\\mu}{\\sigma} \\sim N(0,1)$，$P\\{a<X<b\\} = \\Phi(\\frac{b-\\mu}{\\sigma}) - \\Phi(\\frac{a-\\mu}{\\sigma})$',
    applications: [
      '$X \\sim N(3,4)$，求$P\\{1 < X < 7\\} = \\Phi(\\frac{7-3}{2}) - \\Phi(\\frac{1-3}{2}) = \\Phi(2) - \\Phi(-1) = \\Phi(2) + \\Phi(1) - 1$',
      '$3\\sigma$法则：$P\\{|X-\\mu|<3\\sigma\\} = 2\\Phi(3)-1 \\approx 0.9974$'
    ]
  },
  {
    id: 'prob-rv-function-density',
    title: '随机变量函数的密度（单调情形）',
    introduction: '推导Y=g(X)的密度函数公式，是求随机变量函数分布的核心方法。',
    derivation: `**问题**

设 $X$ 有密度 $f_X(x)$，$Y = g(X)$，其中 $g$ 单调可导且 $g^{\\prime} \\neq 0$，求 $f_Y(y)$。

---

**方法：分布函数法**

步骤一：求 $F_Y(y) = P\\{Y \\leq y\\}$

步骤二：$f_Y(y) = F_Y^{\\prime}(y)$

---

**推导**

设 $g$ 单调递增（$g^{\\prime} > 0$），则 $g$ 有反函数 $h = g^{-1}$。

$$F_Y(y) = P\\{Y \\leq y\\} = P\\{g(X) \\leq y\\} = P\\{X \\leq h(y)\\} = F_X(h(y))$$

求导（链式法则）：

$$f_Y(y) = f_X(h(y)) \\cdot h^{\\prime}(y)$$

---

**若 $g$ 单调递减（$g^{\\prime} < 0$）**

$$F_Y(y) = P\\{g(X) \\leq y\\} = P\\{X \\geq h(y)\\} = 1 - F_X(h(y))$$

求导：

$$f_Y(y) = -f_X(h(y)) \\cdot h^{\\prime}(y) = f_X(h(y)) \\cdot |h^{\\prime}(y)|$$

---

**统一公式**

$$f_Y(y) = f_X(h(y)) |h^{\\prime}(y)|, \\quad y \\in (\\alpha, \\beta)$$

其中 $h = g^{-1}$，$\\alpha = \\min(g(-\\infty), g(+\\infty))$，$\\beta = \\max(g(-\\infty), g(+\\infty))$。`,
    conclusion: '$f_Y(y) = f_X(h(y))|h^{\\prime}(y)|$，其中$h = g^{-1}$，注意取绝对值',
    applications: [
      '$Y = aX + b$（$a>0$）：$h(y) = (y-b)/a$，$h^{\\prime} = 1/a$，$f_Y(y) = \\frac{1}{a}f_X(\\frac{y-b}{a})$',
      '$Y = X^2$（非单调！需分段处理）：$f_Y(y) = \\frac{1}{2\\sqrt{y}}[f_X(\\sqrt{y}) + f_X(-\\sqrt{y})]$，$y > 0$'
    ]
  }
];

// 第三章 二维随机变量及其分布 推导
const TWO_DIM_RV_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-joint-to-marginal-derivation',
    title: '联合密度到边缘密度',
    introduction: '推导如何从联合概率密度求边缘概率密度，理解"积分消元"的本质。',
    derivation: `**问题**

已知联合密度 $f(x,y)$，求 $X$ 的边缘密度 $f_X(x)$。

---

**推导（连续型）**

$$F_X(x) = P\\{X \\leq x\\} = P\\{X \\leq x, Y < +\\infty\\} = \\int_{-\\infty}^{x} \\int_{-\\infty}^{+\\infty} f(s,t)\\,dt\\,ds$$

对 $x$ 求导：

$$f_X(x) = \\int_{-\\infty}^{+\\infty} f(x,y)\\,dy$$

同理：$f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x,y)\\,dx$

---

**离散型类比**

$$P\\{X = x_i\\} = \\sum_j P\\{X = x_i, Y = y_j\\}$$

即对 $Y$ 的所有取值求和"消去"了 $Y$。

---

**关键洞察**

- 积分/求和的本质是"消去"另一个变量
- 边缘分布不唯一确定联合分布（信息损失）
- 除非独立：$f(x,y) = f_X(x) f_Y(y)$`,
    conclusion: '$f_X(x) = \\int_{-\\infty}^{+\\infty} f(x,y)\\,dy$，"对$y$积分消去$y$"',
    applications: [
      '单位圆上的均匀分布：$f(x,y)=1/\\pi$（$x^2+y^2\\leq 1$），则$f_X(x) = \\int_{-\\sqrt{1-x^2}}^{\\sqrt{1-x^2}} \\frac{1}{\\pi}dy = \\frac{2\\sqrt{1-x^2}}{\\pi}$'
    ]
  },
  {
    id: 'prob-convolution-formula',
    title: '卷积公式（独立随机变量之和的分布）',
    introduction: '推导两个独立连续随机变量之和的密度函数——卷积公式。',
    derivation: `**问题**

设 $X, Y$ 独立，密度分别为 $f_X, f_Y$，求 $Z = X + Y$ 的密度 $f_Z$。

---

**推导（分布函数法）**

$$F_Z(z) = P\\{Z \\leq z\\} = P\\{X + Y \\leq z\\} = \\iint_{x+y \\leq z} f_X(x) f_Y(y)\\,dx\\,dy$$

先对 $y$ 积分：

$$= \\int_{-\\infty}^{+\\infty} f_X(x) \\left[\\int_{-\\infty}^{z-x} f_Y(y)\\,dy\\right] dx = \\int_{-\\infty}^{+\\infty} f_X(x) F_Y(z-x)\\,dx$$

对 $z$ 求导：

$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z-x)\\,dx$$

这就是**卷积公式**！

---

**对称性**

交换积分顺序可得另一种形式：

$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(z-y) f_Y(y)\\,dy$$

---

**直观理解**

卷积就是"遍历所有使$x+y=z$的组合"——对每个$x$，$y$必须等于$z-x$，将$X$取$x$和$Y$取$z-x$的概率密度相乘，再对所有可能的$x$积分。`,
    conclusion: '$f_{X+Y}(z) = \\int_{-\\infty}^{+\\infty} f_X(x)f_Y(z-x)\\,dx$',
    applications: [
      '两个独立$N(0,1)$之和：$f_Z(z) = \\int \\frac{1}{2\\pi}e^{-x^2/2}e^{-(z-x)^2/2}dx = \\frac{1}{\\sqrt{4\\pi}}e^{-z^2/4}$，即$Z \\sim N(0,2)$',
      '两个独立$U(0,1)$之和服从三角分布'
    ]
  },
  {
    id: 'prob-max-min-distribution',
    title: '最大值与最小值的分布',
    introduction: '推导独立随机变量的最大值和最小值的分布函数。',
    derivation: `**问题**

设 $X_1, \\ldots, X_n$ 独立，分布函数分别为 $F_1, \\ldots, F_n$，求 $M = \\max(X_1,\\ldots,X_n)$ 和 $N = \\min(X_1,\\ldots,X_n)$ 的分布。

---

**最大值的分布**

$$F_M(z) = P\\{M \\leq z\\} = P\\{X_1 \\leq z, X_2 \\leq z, \\ldots, X_n \\leq z\\}$$

由独立性：

$$= P\\{X_1 \\leq z\\} \\cdot P\\{X_2 \\leq z\\} \\cdots P\\{X_n \\leq z\\} = \\prod_{i=1}^{n} F_i(z)$$

**同分布情形**：$F_M(z) = [F(z)]^n$

---

**最小值的分布**

$$F_N(z) = P\\{N \\leq z\\} = 1 - P\\{N > z\\} = 1 - P\\{X_1 > z, \\ldots, X_n > z\\}$$

由独立性：

$$= 1 - \\prod_{i=1}^{n} P\\{X_i > z\\} = 1 - \\prod_{i=1}^{n} [1 - F_i(z)]$$

**同分布情形**：$F_N(z) = 1 - [1-F(z)]^n$

---

**记忆口诀**

- max的CDF = 各CDF之积（"都满足才算满足"）
- min的CDF = 1减各互补CDF之积（"都不满足才不满足"）`,
    conclusion: '$F_{\\max}(z) = \\prod F_i(z)$，$F_{\\min}(z) = 1 - \\prod[1-F_i(z)]$',
    applications: [
      '并联系统寿命=各元件寿命的max，串联系统寿命=min',
      '10个独立$U(0,1)$的max：$F_M(z) = z^{10}$，$f_M(z) = 10z^9$'
    ]
  }
];

// 第四章 随机变量的数字特征 推导
const NUMERICAL_CHARACTERISTICS_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-variance-formula-derivation',
    title: '方差计算公式 $D(X) = E(X^2) - [E(X)]^2$',
    introduction: '从方差定义出发，推导最常用的方差计算公式。',
    derivation: `**方差定义**

$$D(X) = E[(X - EX)^2]$$

---

**展开推导**

$$D(X) = E[(X - EX)^2] = E[X^2 - 2X \\cdot EX + (EX)^2]$$

由期望的线性性（注意 $EX$ 是常数）：

$$= E(X^2) - 2E(X \\cdot EX) + E[(EX)^2]$$

$$= E(X^2) - 2(EX)(EX) + (EX)^2$$

$$= E(X^2) - 2(EX)^2 + (EX)^2$$

$$= E(X^2) - (EX)^2$$

---

**为什么这个公式重要？**

1. 避免了先求 $(X-EX)$ 再求平方的期望，直接用 $E(X^2)$ 和 $(EX)^2$ 即可
2. $E(X^2)$ 可用 $E[g(X)]$ 公式计算：$E(X^2) = \\sum x_i^2 p_i$ 或 $\\int x^2 f(x)dx$
3. 这个公式揭示了方差 = "二阶矩" - "一阶矩的平方"`,
    conclusion: '$D(X) = E(X^2) - [E(X)]^2$，方差 = 二阶原点矩 - 一阶原点矩的平方',
    applications: [
      '$X \\sim B(n,p)$：$E(X)=np$，$E(X^2)=n(n-1)p^2+np$，故$D(X)=np(1-p)$',
      '$X \\sim U(a,b)$：$E(X)=(a+b)/2$，$E(X^2)=(a^2+ab+b^2)/3$，故$D(X)=(b-a)^2/12$'
    ]
  },
  {
    id: 'prob-cov-derivation',
    title: '协方差的等价形式',
    introduction: '推导协方差的两种等价计算形式，理解为什么$Cov(X,Y) = E(XY) - E(X)E(Y)$最常用。',
    derivation: `**协方差定义**

$$Cov(X,Y) = E[(X - EX)(Y - EY)]$$

---

**展开推导**

$$Cov(X,Y) = E[(X - EX)(Y - EY)]$$

$$= E[XY - X \\cdot EY - EX \\cdot Y + EX \\cdot EY]$$

由期望的线性性（$EX$、$EY$ 是常数）：

$$= E(XY) - EY \\cdot E(X) - EX \\cdot E(Y) + EX \\cdot EY$$

$$= E(XY) - E(X)E(Y)$$

---

**为什么这个形式更实用？**

1. 只需计算 $E(XY)$ 和 $E(X)E(Y)$，不需要先中心化
2. 中心化变量 $X - EX$ 的分布往往更复杂
3. 判断不相关只需验证 $E(XY) = E(X)E(Y)$

---

**推论：独立蕴含不相关**

若 $X, Y$ 独立，则 $E(XY) = E(X)E(Y)$

所以 $Cov(X,Y) = 0$，即 $X, Y$ 不相关。

但反之不成立（除非$(X,Y)$服从二维正态分布）！`,
    conclusion: '$Cov(X,Y) = E(XY) - E(X)E(Y)$，独立$\\Rightarrow$不相关，反之不真',
    applications: [
      '验证$X$与$X^2$是否相关：$Cov(X,X^2) = E(X^3) - E(X)E(X^2)$',
      '若$X \\sim U(-1,1)$，则$E(X)=0$，$E(X^3)=0$，故$Cov(X,X^2)=0$，但不独立'
    ]
  },
  {
    id: 'prob-var-sum-derivation',
    title: '方差和差公式',
    introduction: '推导$D(X \\pm Y)$的展开式，理解为什么和与差的方差公式中协方差前的符号。',
    derivation: `**推导**

$$D(X + Y) = E[(X+Y)^2] - [E(X+Y)]^2$$

由期望线性性：$E(X+Y) = EX + EY$

$$= E[X^2 + 2XY + Y^2] - (EX+EY)^2$$

$$= E(X^2) + 2E(XY) + E(Y^2) - (EX)^2 - 2(EX)(EY) - (EY)^2$$

重新组合：

$$= [E(X^2) - (EX)^2] + [E(Y^2) - (EY)^2] + 2[E(XY) - (EX)(EY)]$$

$$= D(X) + D(Y) + 2Cov(X,Y)$$

---

**差的情况**

$$D(X - Y) = D(X) + D(Y) - 2Cov(X,Y)$$

注意协方差前面的负号！

---

**统一公式**

$$D(X \\pm Y) = D(X) + D(Y) \\pm 2Cov(X,Y)$$

---

**特殊情况**

当 $X, Y$ 独立时，$Cov(X,Y) = 0$：

$$D(X \\pm Y) = D(X) + D(Y)$$

注意：独立时和与差的方差**相同**！`,
    conclusion: '$D(X \\pm Y) = D(X) + D(Y) \\pm 2Cov(X,Y)$，独立时$D(X \\pm Y) = D(X) + D(Y)$',
    applications: [
      '$D(2X-3Y) = 4D(X) + 9D(Y) - 12Cov(X,Y)$',
      '独立时$D(3X+2Y) = 9D(X) + 4D(Y)$'
    ]
  },
  {
    id: 'prob-chebyshev-derivation',
    title: '切比雪夫不等式',
    introduction: '从马尔可夫不等式出发推导切比雪夫不等式，这是仅需期望和方差就能估计概率的工具。',
    derivation: `**马尔可夫不等式**

对非负随机变量 $Y \\geq 0$ 和 $a > 0$：

$$E(Y) = \\int_0^{+\\infty} y \\cdot f(y)dy \\geq \\int_a^{+\\infty} y \\cdot f(y)dy \\geq a \\int_a^{+\\infty} f(y)dy = a \\cdot P\\{Y \\geq a\\}$$

所以 $P\\{Y \\geq a\\} \\leq \\frac{E(Y)}{a}$

---

**推导切比雪夫不等式**

令 $Y = (X - EX)^2$（非负），$a = \\varepsilon^2$（$\\varepsilon > 0$）

由马尔可夫不等式：

$$P\\{(X-EX)^2 \\geq \\varepsilon^2\\} \\leq \\frac{E[(X-EX)^2]}{\\varepsilon^2}$$

即：

$$P\\{|X - EX| \\geq \\varepsilon\\} \\leq \\frac{D(X)}{\\varepsilon^2}$$

---

**等价形式**

$$P\\{|X - EX| < \\varepsilon\\} \\geq 1 - \\frac{D(X)}{\\varepsilon^2}$$

取 $\\varepsilon = k\\sigma$（$k$倍标准差）：

$$P\\{|X - EX| < k\\sigma\\} \\geq 1 - \\frac{1}{k^2}$$

例如 $k=3$ 时，$P\\{|X-EX|<3\\sigma\\} \\geq 8/9 \\approx 0.889$（比$3\\sigma$法则弱）。`,
    conclusion: '$P\\{|X-EX| \\geq \\varepsilon\\} \\leq D(X)/\\varepsilon^2$，不需要知道分布，只需期望和方差',
    applications: [
      '估计概率：$X$的$EX=5, D(X)=4$，则$P\\{|X-5|\\geq 6\\} \\leq 4/36 = 1/9$',
      '证明大数定律的关键步骤'
    ]
  }
];

// 第五章 大数定律与中心极限定理 推导
const LLN_CLT_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-chebyshev-lln',
    title: '切比雪夫大数定律',
    introduction: '利用切比雪夫不等式证明样本均值依概率收敛于总体均值。',
    derivation: `**条件**

$X_1, X_2, \\ldots$ 相互独立，$E(X_i) = \\mu_i$，$D(X_i) \\leq C$（方差一致有界）。

---

**目标**

证明 $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\frac{1}{n}\\sum_{i=1}^n \\mu_i$（依概率收敛）

特别地，若$\\mu_i = \\mu$（同均值），则$\\bar{X}_n \\xrightarrow{P} \\mu$。

---

**推导**

$$E(\\bar{X}_n) = \\frac{1}{n}\\sum_{i=1}^n \\mu_i, \\quad D(\\bar{X}_n) = \\frac{1}{n^2}\\sum_{i=1}^n D(X_i) \\leq \\frac{C}{n}$$

由切比雪夫不等式，对任意 $\\varepsilon > 0$：

$$P\\{|\\bar{X}_n - E(\\bar{X}_n)| \\geq \\varepsilon\\} \\leq \\frac{D(\\bar{X}_n)}{\\varepsilon^2} \\leq \\frac{C}{n\\varepsilon^2}$$

当 $n \\to \\infty$ 时，$\\frac{C}{n\\varepsilon^2} \\to 0$，故：

$$\\lim_{n \\to \\infty} P\\{|\\bar{X}_n - E(\\bar{X}_n)| \\geq \\varepsilon\\} = 0$$

---

**关键洞察**

- $D(\\bar{X}_n) \\leq C/n$ 是核心——样本均值的方差以$1/n$速度趋向0
- 切比雪夫不等式将"方差小"转化为"概率集中"`,
    conclusion: '独立、方差有界 $\\Rightarrow$ $\\bar{X}_n$ 依概率收敛于其期望',
    applications: [
      '辛钦大数定律：独立同分布、方差有限$\\Rightarrow$ $\\bar{X}_n \\xrightarrow{P} \\mu$',
      '伯努利大数定律：频率依概率收敛于概率'
    ]
  },
  {
    id: 'prob-clt-derivation',
    title: '独立同分布中心极限定理（Lindeberg-Lévy）',
    introduction: '证明独立同分布随机变量之和的标准化量依分布收敛于标准正态分布。',
    derivation: `**条件**

$X_1, X_2, \\ldots$ 独立同分布，$E(X_i) = \\mu$，$D(X_i) = \\sigma^2 > 0$。

---

**结论**

$$\\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0,1)$$

等价地：$\\sum_{i=1}^n X_i \\overset{\\text{近似}}{\\sim} N(n\\mu, n\\sigma^2)$

---

**证明思路（特征函数法）**

设 $\\varphi(t) = E(e^{itX_1})$ 为特征函数。

标准化量 $Z_n = \\frac{\\sum X_i - n\\mu}{\\sqrt{n}\\sigma}$ 的特征函数：

$$\\varphi_{Z_n}(t) = \\left[\\varphi\\left(\\frac{t}{\\sqrt{n}\\sigma}\\right) e^{-i\\mu t/(\\sqrt{n}\\sigma)}\\right]^n$$

将 $\\varphi$ 在0处泰勒展开：$\\varphi(u) = 1 + i\\mu u - \\frac{\\sigma^2 + \\mu^2}{2}u^2 + o(u^2)$

代入 $u = \\frac{t}{\\sqrt{n}\\sigma}$ 并取对数，可得：

$$\\ln\\varphi_{Z_n}(t) \\to -\\frac{t^2}{2} \\quad (n \\to \\infty)$$

而 $e^{-t^2/2}$ 正是 $N(0,1)$ 的特征函数。由特征函数的连续性定理，$Z_n \\xrightarrow{d} N(0,1)$。

---

**应用**

对任意 $a < b$，当 $n$ 跳够大时：

$$P\\left\\{a < \\frac{\\sum X_i - n\\mu}{\\sqrt{n}\\sigma} < b\\right\\} \\approx \\Phi(b) - \\Phi(a)$$`,
    conclusion: '独立同分布$\\Rightarrow$ $\\frac{\\sum X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0,1)$',
    applications: [
      '100个独立$U(0,1)$之和近似$N(50, 100/12)$',
      '棣莫弗-拉普拉斯定理是CLT在$B(n,p)$下的特例'
    ]
  }
];

// 第六章 数理统计基本概念 推导
const SAMPLING_DISTRIBUTION_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-sample-mean-normal',
    title: '正态总体样本均值的分布',
    introduction: '推导正态总体下样本均值的精确分布，是抽样分布理论的基础。',
    derivation: `**条件**

$X_1, X_2, \\ldots, X_n \\sim N(\\mu, \\sigma^2)$，独立同分布。

---

**推导**

由正态分布的线性组合性质：

$$\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i$$

是$X_1, \\ldots, X_n$的线性组合。

独立正态变量的线性组合仍为正态：

$$\\sum_{i=1}^n X_i \\sim N(n\\mu, n\\sigma^2)$$

乘以 $1/n$：

$$\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

---

**标准化**

$$\\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\sim N(0, 1)$$

---

**关键洞察**

- $\\bar{X}$ 与 $X$ 同均值$\\mu$，但方差缩小$n$倍
- $n$越大，$\\bar{X}$越集中在$\\mu$附近（大数定律的精确化）
- 这个结论是$Z$检验和置信区间的理论基础`,
    conclusion: '$\\bar{X} \\sim N(\\mu, \\sigma^2/n)$，方差缩小$n$倍',
    applications: [
      '$\\sigma=2, n=16$：$\\bar{X} \\sim N(\\mu, 1/4)$，$P\\{|\\bar{X}-\\mu|<0.5\\} = 2\\Phi(1)-1 \\approx 0.6827$',
      '样本量确定：要使$D(\\bar{X}) \\leq 0.01$，需$\\sigma^2/n \\leq 0.01$，即$n \\geq 100\\sigma^2$'
    ]
  },
  {
    id: 'prob-chi-square-sample-var',
    title: '正态总体样本方差的分布',
    introduction: '推导$(n-1)S^2/\\sigma^2 \\sim \\chi^2(n-1)$以及$\\bar{X}$与$S^2$的独立性。',
    derivation: `**条件**

$X_1, \\ldots, X_n \\sim N(\\mu, \\sigma^2)$，$\\bar{X} = \\frac{1}{n}\\sum X_i$，$S^2 = \\frac{1}{n-1}\\sum(X_i - \\bar{X})^2$。

---

**核心分解**

$$\\sum_{i=1}^n (X_i - \\mu)^2 = \\sum_{i=1}^n (X_i - \\bar{X})^2 + n(\\bar{X} - \\mu)^2$$

两边除以 $\\sigma^2$：

$$\\frac{\\sum(X_i - \\mu)^2}{\\sigma^2} = \\frac{(n-1)S^2}{\\sigma^2} + \\frac{n(\\bar{X}-\\mu)^2}{\\sigma^2}$$

---

**分析各项**

左边：$\\sum \\left(\\frac{X_i-\\mu}{\\sigma}\\right)^2 \\sim \\chi^2(n)$

右边第二项：$\\left(\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}}\\right)^2 \\sim \\chi^2(1)$

---

**利用$\\chi^2$的可加性和$\\bar{X}$与$S^2$的独立性**

若$\\bar{X}$与$S^2$独立（此结论可由正态分布的性质证明），则：

$\\chi^2(n) = \\frac{(n-1)S^2}{\\sigma^2} + \\chi^2(1)$

由$\\chi^2$分布的可加性：

$$\\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)$$

---

**自由度为$n-1$的原因**

虽然有$n$个偏差$(X_i - \\bar{X})$，但它们满足约束$\\sum(X_i - \\bar{X}) = 0$，只有$n-1$个可以自由变化。`,
    conclusion: '$\\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)$，$\\bar{X} \\perp S^2$，自由度$n-1$',
    applications: [
      '$n=10$时，$P\\{S^2 > 1.887\\sigma^2\\} = P\\{\\chi^2(9) > 16.92\\} = 0.05$',
      '这是$\\chi^2$检验和$F$检验的理论基础'
    ]
  },
  {
    id: 'prob-t-statistic-derivation',
    title: 't统计量的分布',
    introduction: '推导$T = (\\bar{X}-\\mu)/(S/\\sqrt{n}) \\sim t(n-1)$，$\\sigma$未知时的核心统计量。',
    derivation: `**构造**

$$T = \\frac{\\bar{X} - \\mu}{S/\\sqrt{n}} = \\frac{(\\bar{X}-\\mu)/(\\sigma/\\sqrt{n})}{\\sqrt{(n-1)S^2/\\sigma^2 / (n-1)}}$$

---

**分析分子和分母**

分子：$Z = \\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} \\sim N(0,1)$

分母中的$V = \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)$

且$Z$与$V$独立（因为$\\bar{X} \\perp S^2$）。

---

**t分布的定义**

$$T = \\frac{Z}{\\sqrt{V/(n-1)}} \\sim t(n-1)$$

这正是t分布的定义：标准正态除以$\\chi^2$标准化量的平方根，且两者独立。

---

**为什么需要t分布？**

当$\\sigma$未知时，用$S$代替$\\sigma$，统计量不再是标准正态，而是t分布。t分布比$N(0,1)$尾部更厚（自由度越小越厚），反映了用$S$估计$\\sigma$带来的额外不确定性。`,
    conclusion: '$T = \\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} \\sim t(n-1)$，$\\sigma$未知时用$S$代替',
    applications: [
      '单样本t检验：$H_0: \\mu = \\mu_0$，拒绝域$|T| > t_{\\alpha/2}(n-1)$',
      '$n>45$时$t(n-1) \\approx N(0,1)$，可用$z_{\\alpha/2}$近似代替'
    ]
  }
];

// 第七章 参数估计 推导
const PARAMETER_ESTIMATION_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-mle-derivation',
    title: '极大似然估计的求解过程',
    introduction: '以具体例子展示极大似然估计的完整求解步骤，包括似然函数、对数似然、求导求极值。',
    derivation: `**极大似然估计的思想**

已知样本 $x_1, x_2, \\ldots, x_n$，寻找使"出现这组样本的概率最大"的参数值 $\\hat{\\theta}$。

---

**一般步骤**

1. 写出似然函数：$L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$
2. 取对数：$\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$
3. 对$\\theta$求导令其为零：$\\frac{d \\ln L}{d\\theta} = 0$
4. 解方程得$\\hat{\\theta}_{MLE}$

---

**例：正态分布$N(\\mu, \\sigma^2)$的MLE**

$$\\ln L(\\mu, \\sigma^2) = -\\frac{n}{2}\\ln(2\\pi) - \\frac{n}{2}\\ln\\sigma^2 - \\frac{1}{2\\sigma^2}\\sum_{i=1}^n(x_i-\\mu)^2$$

对$\\mu$求偏导：

$$\\frac{\\partial \\ln L}{\\partial \\mu} = \\frac{1}{\\sigma^2}\\sum_{i=1}^n(x_i - \\mu) = 0$$

解得：$\\hat{\\mu}_{MLE} = \\bar{x}$

对$\\sigma^2$求偏导：

$$\\frac{\\partial \\ln L}{\\partial \\sigma^2} = -\\frac{n}{2\\sigma^2} + \\frac{1}{2\\sigma^4}\\sum_{i=1}^n(x_i - \\mu)^2 = 0$$

解得：$\\hat{\\sigma}^2_{MLE} = \\frac{1}{n}\\sum_{i=1}^n(x_i - \\bar{x})^2$

---

**注意**

$\\hat{\\sigma}^2_{MLE}$是有偏的！$E(\\hat{\\sigma}^2_{MLE}) = \\frac{n-1}{n}\\sigma^2 \\neq \\sigma^2$。无偏估计需要除以$n-1$。`,
    conclusion: '$\\hat{\\mu}_{MLE} = \\bar{X}$，$\\hat{\\sigma}^2_{MLE} = \\frac{1}{n}\\sum(X_i-\\bar{X})^2$（有偏）',
    applications: [
      '$B(n,p)$的MLE：$\\hat{p} = \\bar{x}/n$',
      '$P(\\lambda)$的MLE：$\\hat{\\lambda} = \\bar{x}$',
      '$U(0,\\theta)$的MLE：$\\hat{\\theta} = X_{(n)}$（最大次序统计量，注意此例中求导法不适用）'
    ]
  },
  {
    id: 'prob-unbiased-variance',
    title: '样本方差除以$n-1$的无偏性证明',
    introduction: '证明$E(S^2) = \\sigma^2$，解释为什么分母是$n-1$而不是$n$。',
    derivation: `**定义**

$$S^2 = \\frac{1}{n-1}\\sum_{i=1}^n(X_i - \\bar{X})^2$$

---

**目标**

证明 $E(S^2) = \\sigma^2$

---

**推导**

$$\\sum_{i=1}^n(X_i - \\bar{X})^2 = \\sum_{i=1}^n[(X_i - \\mu) - (\\bar{X} - \\mu)]^2$$

$$= \\sum_{i=1}^n(X_i - \\mu)^2 - 2(\\bar{X}-\\mu)\\sum_{i=1}^n(X_i - \\mu) + n(\\bar{X}-\\mu)^2$$

$$= \\sum_{i=1}^n(X_i - \\mu)^2 - n(\\bar{X}-\\mu)^2$$

取期望：

$$E\\left[\\sum(X_i-\\bar{X})^2\\right] = \\sum E[(X_i-\\mu)^2] - nE[(\\bar{X}-\\mu)^2]$$

$$= n\\sigma^2 - n \\cdot \\frac{\\sigma^2}{n} = n\\sigma^2 - \\sigma^2 = (n-1)\\sigma^2$$

所以：

$$E(S^2) = E\\left[\\frac{1}{n-1}\\sum(X_i-\\bar{X})^2\\right] = \\frac{(n-1)\\sigma^2}{n-1} = \\sigma^2$$

---

**直观理解**

用$\\bar{X}$代替$\\mu$会"损失一个自由度"。因为$\\sum(X_i - \\bar{X}) = 0$这个约束使得$n$个偏差只有$n-1$个可以自由变化，所以分母必须是$n-1$才能保证无偏。`,
    conclusion: '$E(S^2) = \\sigma^2$，分母$n-1$保证无偏性',
    applications: [
      '若分母为$n$，则$E\\left[\\frac{1}{n}\\sum(X_i-\\bar{X})^2\\right] = \\frac{n-1}{n}\\sigma^2$，偏小',
      '自由度概念：$n$个约束中用了1个估计$\\mu$，剩余$n-1$个自由度'
    ]
  },
  {
    id: 'prob-ci-mean-derivation',
    title: '正态总体均值置信区间的推导',
    introduction: '分别推导$\\sigma$已知和$\\sigma$未知时，正态总体均值$\\mu$的置信区间。',
    derivation: `**情形一：$\\sigma$已知**

枢轴量：$Z = \\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} \\sim N(0,1)$

对置信水平$1-\\alpha$：

$$P\\left\\{-z_{\\alpha/2} < \\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} < z_{\\alpha/2}\\right\\} = 1-\\alpha$$

解不等式（将$\\mu$解出）：

$$P\\left\\{\\bar{X} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} < \\mu < \\bar{X} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\right\\} = 1-\\alpha$$

置信区间：$\\mu \\in \\left(\\bar{X} \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\right)$

---

**情形二：$\\sigma$未知**

枢轴量：$T = \\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} \\sim t(n-1)$

$$P\\left\\{-t_{\\alpha/2}(n-1) < \\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} < t_{\\alpha/2}(n-1)\\right\\} = 1-\\alpha$$

置信区间：$\\mu \\in \\left(\\bar{X} \\pm t_{\\alpha/2}(n-1)\\frac{S}{\\sqrt{n}}\\right)$

---

**关键区别**

- $\\sigma$已知：用$z_{\\alpha/2}$，区间更窄（信息更多）
- $\\sigma$未知：用$t_{\\alpha/2}(n-1) > z_{\\alpha/2}$，区间更宽（不确定性更大）
- $n \\to \\infty$时$t_{\\alpha/2}(n-1) \\to z_{\\alpha/2}$，两者趋于一致`,
    conclusion: '$\\sigma$已知：$\\bar{X} \\pm z_{\\alpha/2}\\sigma/\\sqrt{n}$；$\\sigma$未知：$\\bar{X} \\pm t_{\\alpha/2}(n-1)S/\\sqrt{n}$',
    applications: [
      '$\\sigma$已知，$n=25, \\bar{x}=5, \\sigma=2, \\alpha=0.05$：$CI = 5 \\pm 1.96 \\times 2/5 = (4.216, 5.784)$',
      '区间长度$L = 2t_{\\alpha/2}S/\\sqrt{n}$，要使$L \\leq l$需$n \\geq (2t_{\\alpha/2}S/l)^2$'
    ]
  }
];

// 第八章 假设检验 推导
const HYPOTHESIS_TESTING_DERIVATIONS: DerivationItem[] = [
  {
    id: 'prob-z-test-derivation',
    title: 'Z检验的推导（$\\sigma$已知检验$\\mu$）',
    introduction: '从假设检验的基本原理出发，推导Z检验的拒绝域。',
    derivation: `**假设**

$H_0: \\mu = \\mu_0$ vs $H_1: \\mu \\neq \\mu_0$

已知 $X_1, \\ldots, X_n \\sim N(\\mu, \\sigma^2)$，$\\sigma$ 已知。

---

**构造检验统计量**

在$H_0$下，$\\mu = \\mu_0$，枢轴量：

$$Z = \\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim N(0,1)$$

---

**确定拒绝域**

给定显著性水平$\\alpha$，我们需要找临界值$c$使得：

$$P\\{|Z| > c | H_0\\} = \\alpha$$

由$N(0,1)$的对称性：

$$P\\{Z > c\\} = \\alpha/2 \\Rightarrow c = z_{\\alpha/2}$$

拒绝域：$W = \\{Z : |Z| > z_{\\alpha/2}\\}$

---

**判断准则**

$$|Z| = \\left|\\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}}\\right| > z_{\\alpha/2} \\Rightarrow \\text{拒绝}H_0$$

---

**直观理解**

如果$\\bar{X}$与$\\mu_0$的偏离程度（以$\\sigma/\\sqrt{n}$为单位衡量）超过了$z_{\\alpha/2}$，说明样本观测值与原假设"矛盾太大"，在$\\alpha$水平下拒绝$H_0$。`,
    conclusion: '$|Z| > z_{\\alpha/2}$时拒绝$H_0$，其中$Z = \\frac{\\bar{X}-\\mu_0}{\\sigma/\\sqrt{n}}$',
    applications: [
      '$H_0: \\mu=5, \\sigma=2, n=16, \\bar{x}=6, \\alpha=0.05$：$Z=2 > 1.96$，拒绝$H_0$',
      '单侧检验：$H_1: \\mu > \\mu_0$时，拒绝域$Z > z_{\\alpha}$'
    ]
  },
  {
    id: 'prob-t-test-derivation',
    title: 't检验的推导（$\\sigma$未知检验$\\mu$）',
    introduction: '当总体方差未知时，用样本标准差代替，推导t检验统计量和拒绝域。',
    derivation: `**假设**

$H_0: \\mu = \\mu_0$ vs $H_1: \\mu \\neq \\mu_0$

$\\sigma$未知，需用$S$代替。

---

**构造检验统计量**

在$H_0$下：

$$T = \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}} \\sim t(n-1)$$

这里用$S$代替了$Z$检验中的$\\sigma$。由于$S$也是随机变量，增加了不确定性，所以$t$分布比$N(0,1)$尾部更厚。

---

**确定拒绝域**

$$P\\{|T| > t_{\\alpha/2}(n-1) | H_0\\} = \\alpha$$

拒绝域：$|T| > t_{\\alpha/2}(n-1)$

---

**与Z检验的区别**

1. 统计量：$S$代替$\\sigma$
2. 分布：$t(n-1)$代替$N(0,1)$
3. 临界值：$t_{\\alpha/2}(n-1) > z_{\\alpha/2}$（更难拒绝$H_0$）
4. 当$n$大时（$n > 45$），$t_{\\alpha/2}(n-1) \\approx z_{\\alpha/2}$

---

**单样本t检验的计算**

$$T = \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}}$$

计算步骤：
1. 算$\\bar{x}$和$s$
2. 计算$t = (\\bar{x} - \\mu_0)/(s/\\sqrt{n})$
3. 与$t_{\\alpha/2}(n-1)$比较`,
    conclusion: '$|T| > t_{\\alpha/2}(n-1)$时拒绝$H_0$，$T = \\frac{\\bar{X}-\\mu_0}{S/\\sqrt{n}}$',
    applications: [
      '$H_0: \\mu=100, n=9, \\bar{x}=98, s=3, \\alpha=0.05$：$T=-2, t_{0.025}(8)=2.306$，不拒绝',
      '配对t检验：$d_i = X_i - Y_i$，$T = \\bar{d}/(S_d/\\sqrt{n}) \\sim t(n-1)$'
    ]
  },
  {
    id: 'prob-error-relation-derivation',
    title: '两类错误的关系',
    introduction: '分析第一类错误（弃真）和第二类错误（取伪）之间的此消彼长关系。',
    derivation: `**定义**

- 第一类错误（弃真）：$\\alpha = P\\{\\text{拒绝}H_0 | H_0\\text{真}\\}$
- 第二类错误（取伪）：$\\beta = P\\{\\text{接受}H_0 | H_1\\text{真}\\}$

---

**此消彼长的推导**

以$Z$检验为例：$H_0: \\mu = \\mu_0$ vs $H_1: \\mu > \\mu_0$

拒绝域：$Z = \\frac{\\bar{X}-\\mu_0}{\\sigma/\\sqrt{n}} > z_{\\alpha}$

即 $\\bar{X} > \\mu_0 + z_{\\alpha}\\sigma/\\sqrt{n}$

---

**当$\\mu = \\mu_1 > \\mu_0$时（$H_1$为真）**

$$\\beta(\\mu_1) = P\\{\\bar{X} \\leq \\mu_0 + z_{\\alpha}\\sigma/\\sqrt{n} | \\mu = \\mu_1\\}$$

此时$\\bar{X} \\sim N(\\mu_1, \\sigma^2/n)$，标准化：

$$\\beta(\\mu_1) = P\\left\\{Z \\leq \\frac{\\mu_0 - \\mu_1}{\\sigma/\\sqrt{n}} + z_{\\alpha}\\right\\} = \\Phi\\left(z_{\\alpha} - \\frac{\\mu_1 - \\mu_0}{\\sigma/\\sqrt{n}}\\right)$$

---

**分析**

- $\\alpha \\downarrow \\Rightarrow z_{\\alpha} \\uparrow \\Rightarrow \\beta \\uparrow$（临界值右移，更难拒绝，取伪概率增大）
- $n \\uparrow \\Rightarrow \\frac{\\mu_1-\\mu_0}{\\sigma/\\sqrt{n}} \\uparrow \\Rightarrow \\beta \\downarrow$（增大样本量可同时减小两类错误）

---

**功效**

$1 - \\beta = 1 - \\Phi(z_{\\alpha} - \\delta\\sqrt{n})$，其中$\\delta = (\\mu_1 - \\mu_0)/\\sigma$为效应量。

要使功效$\\geq 0.8$，需要$\\sqrt{n} \\geq (z_{\\alpha} + z_{0.2})/\\delta$。`,
    conclusion: '固定$n$时$\\alpha$和$\\beta$此消彼长，增大$n$可同时减小两者',
    applications: [
      '$\\alpha=0.05, \\delta=0.5$时需$n \\geq (1.645+0.842)^2/0.25 \\approx 25$才能达到0.8功效',
      '功效分析（Power Analysis）是实验设计中确定样本量的核心工具'
    ]
  }
];

// ============================================
// 线性代数 公式推导
// ============================================

// 行列式公式推导数据
const DETERMINANT_DERIVATIONS: DerivationItem[] = [
  {
    id: 'det-expand-formula',
    title: '行列式按行（列）展开公式的推导',
    introduction: '行列式按行（列）展开是降阶计算行列式的核心方法，其理论基础是行列式的线性性和反对称性。',
    derivation: `**定理陈述**

$n$ 阶行列式 $|A|$ 可按第 $i$ 行展开：

$$|A| = \\sum_{j=1}^{n} a_{ij} A_{ij}$$

其中 $A_{ij} = (-1)^{i+j} M_{ij}$ 是代数余子式，$M_{ij}$ 是余子式（删去第 $i$ 行第 $j$ 列后的 $n-1$ 阶行列式）。

---

**推导思路**

**第一步：提取单元素行**

设行列式的第 $i$ 行只有一个非零元素 $a_{ij}$，其余为0。将第 $i$ 行依次与第 $i-1, i-2, \\ldots, 1$ 行交换（共 $i-1$ 次），再对列做类似交换（共 $j-1$ 次），使 $a_{ij}$ 移到左上角。

每次行交换变号，每次列交换变号，共变号 $(i-1)+(j-1) = i+j-2$ 次，即乘以 $(-1)^{i+j-2} = (-1)^{i+j}$。

此时行列式 $= (-1)^{i+j} a_{ij} \\cdot M_{ij}$。

---

**第二步：一般行的展开**

将第 $i$ 行拆分为 $n$ 个只含一个非零元素的行之和（由行列式的行线性性）：

$$(a_{i1}, 0, \\ldots, 0) + (0, a_{i2}, 0, \\ldots, 0) + \\cdots + (0, \\ldots, 0, a_{in})$$

每个贡献 $a_{ij} A_{ij}$，求和即得 $|A| = \\sum_{j=1}^{n} a_{ij} A_{ij}$。

---

**第三步：异行代数余子式之和为零**

第 $i$ 行元素与第 $k$ 行（$k \\neq i$）的代数余子式乘积之和为零：

$$\\sum_{j=1}^{n} a_{ij} A_{kj} = 0 \\quad (k \\neq i)$$

因为这就等于把第 $k$ 行换成第 $i$ 行后的行列式，而两行相同，行列式为零。`,
    conclusion: '$|A| = \\sum_j a_{ij} A_{ij}$（按行展开），异行代数余子式之和为零',
    applications: [
      '三阶行列式按第一行展开：$|A| = a_{11}A_{11} + a_{12}A_{12} + a_{13}A_{13}$',
      '范德蒙行列式 $V_n = \\prod_{1 \\leq i < j \\leq n}(x_j - x_i)$ 可按最后一列展开递推证明',
      '伴随矩阵法求逆：$A^{-1} = \\frac{1}{|A|} A^*$，其中 $A^* = (A_{ij})^T$'
    ]
  },
  {
    id: 'det-vandermonde',
    title: '范德蒙行列式的推导',
    introduction: '范德蒙行列式是线性代数中最重要的特殊行列式之一，其结果可由数学归纳法和展开定理推导。',
    derivation: `**定义**

$$V_n = \\begin{vmatrix} 1 & 1 & \\cdots & 1 \\\\ x_1 & x_2 & \\cdots & x_n \\\\ x_1^2 & x_2^2 & \\cdots & x_n^2 \\\\ \\vdots & \\vdots & & \\vdots \\\\ x_1^{n-1} & x_2^{n-1} & \\cdots & x_n^{n-1} \\end{vmatrix} = \\prod_{1 \\leq i < j \\leq n} (x_j - x_i)$$

---

**数学归纳法证明**

**基础**：$n=2$ 时，$V_2 = \\begin{vmatrix} 1 & 1 \\\\ x_1 & x_2 \\end{vmatrix} = x_2 - x_1$，成立。

**归纳**：假设 $V_{n-1}$ 成立，对 $V_n$ 从第 $n$ 行开始，每行减去上一行的 $x_1$ 倍（消去第一列的 $x_1^k$）：

$$V_n = \\begin{vmatrix} 1 & 1 & \\cdots & 1 \\\\ 0 & x_2 - x_1 & \\cdots & x_n - x_1 \\\\ 0 & x_2(x_2-x_1) & \\cdots & x_n(x_n-x_1) \\\\ \\vdots & \\vdots & & \\vdots \\\\ 0 & x_2^{n-2}(x_2-x_1) & \\cdots & x_n^{n-2}(x_n-x_1) \\end{vmatrix}$$

按第一列展开，只有 $1 \\cdot A_{11}$ 不为零：

$$V_n = \\begin{vmatrix} x_2-x_1 & \\cdots & x_n-x_1 \\\\ x_2(x_2-x_1) & \\cdots & x_n(x_n-x_1) \\\\ \\vdots & & \\vdots \\\\ x_2^{n-2}(x_2-x_1) & \\cdots & x_n^{n-2}(x_n-x_1) \\end{vmatrix}$$

从第1列到第 $n-1$ 列分别提取公因子 $(x_j - x_1)$：

$$V_n = \\prod_{j=2}^{n}(x_j - x_1) \\cdot \\begin{vmatrix} 1 & \\cdots & 1 \\\\ x_2 & \\cdots & x_n \\\\ \\vdots & & \\vdots \\\\ x_2^{n-2} & \\cdots & x_n^{n-2} \\end{vmatrix}$$

后面就是 $n-1$ 阶范德蒙行列式，由归纳假设得证。`,
    conclusion: '$V_n = \\prod_{1 \\leq i < j \\leq n}(x_j - x_i)$，数学归纳法+展开定理',
    applications: [
      '范德蒙行列式为零当且仅当 $x_1, \\ldots, x_n$ 中有两个相等',
      '求 $\\sum_{k=0}^{n} x_i^k y_k$ 的线性无关性：归结为范德蒙行列式非零',
      'Lagrange插值的基函数：$l_j(x) = \\prod_{i \\neq j} \\frac{x - x_i}{x_j - x_i}$'
    ]
  },
  {
    id: 'det-product-rule',
    title: '行列式乘法公式的推导',
    introduction: '|AB| = |A||B| 是行列式最重要的运算性质之一，其证明可利用分块矩阵和展开定理。',
    derivation: `**定理**

设 $A, B$ 为 $n$ 阶方阵，则 $|AB| = |A| \\cdot |B|$。

---

**证明思路（利用初等变换）**

**第一步**：对初等矩阵验证

- 交换两行（$E_{ij}$）：$|E_{ij}B| = -|B| = |E_{ij}| \\cdot |B|$ ✓
- 某行乘 $k$（$E_i(k)$）：$|E_i(k)B| = k|B| = |E_i(k)| \\cdot |B|$ ✓
- 某行加另一行的 $k$ 倍（$E_{ij}(k)$）：$|E_{ij}(k)B| = |B| = |E_{ij}(k)| \\cdot |B|$ ✓（因为 $|E_{ij}(k)| = 1$）

---

**第二步**：一般情况

若 $|A| \\neq 0$，则 $A$ 可分解为初等矩阵之积：$A = E_1 E_2 \\cdots E_s$。

$$|AB| = |E_1 E_2 \\cdots E_s B| = |E_1| \\cdot |E_2 \\cdots E_s B| = \\cdots = |E_1| |E_2| \\cdots |E_s| |B| = |A| \\cdot |B|$$

若 $|A| = 0$，则 $A$ 不可逆，$AB$ 也不可逆（$r(AB) \\leq r(A) < n$），所以 $|AB| = 0 = |A| \\cdot |B|$。`,
    conclusion: '$|AB| = |A| \\cdot |B|$，初等矩阵验证+分解推广',
    applications: [
      '$|A^k| = |A|^k$，$|A^{-1}| = |A|^{-1}$',
      '$|A^T A| = |A|^2$（实矩阵），正交阵 $|Q| = \\pm 1$',
      '注意：$|A + B| \\neq |A| + |B|$（这是最常见的错误之一）'
    ]
  },
];

// 矩阵公式推导数据
const MATRIX_DERIVATIONS: DerivationItem[] = [
  {
    id: 'mat-inverse-formula',
    title: '伴随矩阵求逆公式的推导',
    introduction: '逆矩阵的伴随矩阵公式 $A^{-1} = \\frac{1}{|A|}A^*$ 是求逆的基本公式，其证明关键是 $AA^* = |A|I$。',
    derivation: `**定理**

若 $|A| \\neq 0$，则 $A$ 可逆，且 $A^{-1} = \\frac{1}{|A|}A^*$，其中 $A^* = (A_{ij})^T$（代数余子式矩阵的转置）。

---

**核心等式 $AA^* = |A|I$ 的证明**

设 $A = (a_{ij})$，$A^*$ 的第 $j$ 行第 $i$ 列为 $A_{ij}$。

$AA^*$ 的第 $i$ 行第 $j$ 列元素为：

$$(AA^*)_{ij} = \\sum_{k=1}^{n} a_{ik} A_{jk}$$

当 $i = j$ 时，由展开定理：$\\sum_{k=1}^{n} a_{ik} A_{ik} = |A|$。

当 $i \\neq j$ 时，这是第 $i$ 行元素与第 $j$ 行代数余子式的乘积之和，等于把第 $j$ 行换成第 $i$ 行后的行列式——两行相同，行列式为零。

所以 $AA^* = |A|I$。

---

**推导求逆公式**

$AA^* = |A|I$，当 $|A| \\neq 0$ 时两边乘以 $\\frac{1}{|A|}$：

$$A \\cdot \\frac{A^*}{|A|} = I$$

由逆矩阵的唯一性：$A^{-1} = \\frac{1}{|A|}A^*$。

---

**同时验证**

$$A^* A = |A|I$$

同理可证（按列展开），所以 $A^* A = |A|I = AA^*$。`,
    conclusion: '$A^{-1} = \\frac{1}{|A|}A^*$，核心：$AA^* = |A|I$（展开定理+异行代数余子式为零）',
    applications: [
      '二阶矩阵：$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，$A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$',
      '$A^*$ 的性质：$|A^*| = |A|^{n-1}$，$(A^*)^{-1} = (A^{-1})^*$',
      '$A^* = |A|A^{-1}$（可逆时），这是处理伴随矩阵问题的万能公式'
    ]
  },
  {
    id: 'mat-rank-inequality',
    title: '秩的重要不等式的推导',
    introduction: '矩阵秩的不等式是线性代数考试的高频考点，核心是Sylvester不等式及其推论。',
    derivation: `**Sylvester不等式**

$$r(A) + r(B) - n \\leq r(AB) \\leq \\min\\{r(A), r(B)\\}$$

其中 $A$ 为 $m \\times n$，$B$ 为 $n \\times p$。

---

**右侧不等式的证明**

$AB$ 的列是 $A$ 的列的线性组合，所以 $AB$ 的列空间包含于 $A$ 的列空间：

$$r(AB) = \\dim(\\text{Col}(AB)) \\leq \\dim(\\text{Col}(A)) = r(A)$$

同理 $r(AB) \\leq r(B)$（$AB$ 的行是 $B$ 的行的线性组合）。

---

**左侧不等式的证明（秩-零度定理）**

设 $r(A) = r$，将 $A$ 分解为 $A = P \\begin{pmatrix} I_r & 0 \\\\ 0 & 0 \\end{pmatrix} Q$（等价标准形）。

$AB = P \\begin{pmatrix} I_r & 0 \\\\ 0 & 0 \\end{pmatrix} QB$，记 $QB = \\begin{pmatrix} B_1 \\\\ B_2 \\end{pmatrix}$（$B_1$ 为 $r \\times p$），则：

$$AB = P \\begin{pmatrix} B_1 \\\\ 0 \\end{pmatrix}$$

所以 $r(AB) = r(B_1)$。

$B_1$ 有 $r$ 行，$r(B_1) \\geq r(B) - (n - r) = r(A) + r(B) - n$。

---

**重要推论**

若 $AB = 0$，则 $r(A) + r(B) \\leq n$。

这是因为 $r(AB) = 0 \\geq r(A) + r(B) - n$，移项即得。`,
    conclusion: '$r(A)+r(B)-n \\leq r(AB) \\leq \\min\\{r(A),r(B)\\}$，$AB=0$时$r(A)+r(B) \\leq n$',
    applications: [
      '$A$ 为 $m \\times n$，$r(A) = n$（列满秩），则 $r(AB) = r(B)$',
      '$AB = 0$ 且 $A$ 为 $m \\times n$，$B$ 为 $n \\times s$，则 $r(A) + r(B) \\leq n$',
      '$r(A - I) + r(A) \\geq n$（令 $B = A - I$ 则 $A + (I - A) = I$，用秩不等式）'
    ]
  },
  {
    id: 'mat-elementary-transform',
    title: '初等矩阵与等价标准形的推导',
    introduction: '初等矩阵建立了矩阵运算与行列式、秩之间的桥梁，等价标准形是矩阵分类的核心工具。',
    derivation: `**三种初等矩阵及其行列式**

1. 交换第 $i, j$ 行：$E(i,j)$，$|E(i,j)| = -1$
2. 第 $i$ 行乘 $k$（$k \\neq 0$）：$E(i(k))$，$|E(i(k))| = k$
3. 第 $j$ 行的 $k$ 倍加到第 $i$ 行：$E(i,j(k))$，$|E(i,j(k))| = 1$

---

**等价标准形的推导**

**定理**：任意 $m \\times n$ 矩阵 $A$，$r(A) = r$，则存在可逆矩阵 $P, Q$ 使得：

$$PAQ = \\begin{pmatrix} I_r & 0 \\\\ 0 & 0 \\end{pmatrix}$$

**证明过程**：

1. 用行变换将 $A$ 化为行阶梯形，存在可逆 $P_1$ 使 $P_1 A$ 为行阶梯形
2. 用列变换继续化简，存在可逆 $Q_1$ 使 $P_1 A Q_1$ 为标准形
3. 行变换对应左乘初等矩阵，列变换对应右乘初等矩阵
4. 可逆矩阵是初等矩阵之积，故 $P = P_1$，$Q = Q_1$ 可逆

---

**推论：矩阵等价的充要条件**

$$A \\cong B \\iff r(A) = r(B) \\iff \\text{存在可逆}P,Q\\text{使}PAQ = B$$

这是同型矩阵等价分类的完整刻画。`,
    conclusion: '任意矩阵可经初等变换化为等价标准形，等价 $\\iff$ 同型同秩',
    applications: [
      '求逆矩阵：$(A|I) \\xrightarrow{\\text{行变换}} (I|A^{-1})$',
      '求秩：行变换化阶梯形，非零行数即为秩',
      '解方程组：增广矩阵行变换化简，判断解的存在性'
    ]
  },
];

// 线性方程组公式推导数据
const LINEAR_EQUATIONS_DERIVATIONS: DerivationItem[] = [
  {
    id: 'eqn-kronecker-capelli',
    title: 'Kronecker-Capelli定理的推导',
    introduction: '线性方程组有解的充要条件是系数矩阵的秩等于增广矩阵的秩，这是线性方程组理论的基石。',
    derivation: `**定理**

线性方程组 $Ax = b$ 有解的充要条件是 $r(A) = r(\\bar{A})$，其中 $\\bar{A} = (A|b)$ 是增广矩阵。

---

**必要性**

若 $Ax = b$ 有解 $x_0$，则 $Ax_0 = b$。

$b$ 是 $A$ 的列向量的线性组合，因此 $b$ 属于 $A$ 的列空间。

$\\bar{A}$ 的列空间 $= A$ 的列空间（因为 $b$ 已经在其中），所以 $r(\\bar{A}) = r(A)$。

---

**充分性**

若 $r(\\bar{A}) = r(A) = r$，则 $\\bar{A}$ 的列空间与 $A$ 的列空间维度相同。

而 $A$ 的列空间包含于 $\\bar{A}$ 的列空间（$\\bar{A}$ 比 $A$ 多了一列），维度相同则必相等。

因此 $b$ 属于 $A$ 的列空间，即 $Ax = b$ 有解。

---

**解的个数**

- $r(A) = r(\\bar{A}) = n$（$n$ 为未知数个数）：唯一解
- $r(A) = r(\\bar{A}) < n$：无穷多解，自由变量 $= n - r$
- $r(A) < r(\\bar{A})$：无解`,
    conclusion: '$Ax = b$ 有解 $\\iff r(A) = r(\\bar{A})$，$r=n$唯一解，$r<n$无穷解',
    applications: [
      '$\\begin{cases} x_1 + x_2 = 1 \\\\ 2x_1 + 2x_2 = 2 \\end{cases}$：$r(A) = r(\\bar{A}) = 1 < 2$，无穷多解',
      '$\\begin{cases} x_1 + x_2 = 1 \\\\ x_1 + x_2 = 2 \\end{cases}$：$r(A) = 1, r(\\bar{A}) = 2$，无解',
      '齐次方程组 $Ax = 0$ 一定有解（零解），$r(A) < n$ 时有非零解'
    ]
  },
  {
    id: 'eqn-solution-structure',
    title: '齐次方程组基础解系存在性的证明',
    introduction: '当$r(A) < n$时齐次方程组必有基础解系，且基础解系含$n-r$个向量，这是解空间结构的核心定理。',
    derivation: `**定理**

设 $A$ 为 $m \\times n$ 矩阵，$r(A) = r < n$，则 $Ax = 0$ 的解空间 $V$ 的维数 $= n - r$，即基础解系含 $n - r$ 个向量。

---

**证明**

**第一步：构造 $n - r$ 个自由变量**

将 $A$ 经行变换化为行最简形，设前 $r$ 列为主元列，后 $n - r$ 列为自由变量列。

---

**第二步：构造基础解系**

令自由变量 $x_{r+1}, \\ldots, x_n$ 分别取：

$$\\eta_1: (x_{r+1}, \\ldots, x_n) = (1, 0, \\ldots, 0)$$
$$\\eta_2: (x_{r+1}, \\ldots, x_n) = (0, 1, \\ldots, 0)$$
$$\\vdots$$
$$\\eta_{n-r}: (x_{r+1}, \\ldots, x_n) = (0, 0, \\ldots, 1)$$

回代求出主元变量的值，得到 $n - r$ 个解向量 $\\eta_1, \\ldots, \\eta_{n-r}$。

---

**第三步：证明线性无关**

这 $n - r$ 个解向量后 $n - r$ 个分量构成单位阵，因此线性无关。

---

**第四步：证明生成解空间**

对任意解 $\\eta$，设其自由变量值为 $(c_1, \\ldots, c_{n-r})$，则：

$$\\eta = c_1 \\eta_1 + c_2 \\eta_2 + \\cdots + c_{n-r} \\eta_{n-r}$$

因为自由变量值相同，由主元变量被自由变量唯一确定，所以 $\\eta$ 等于这个线性组合。

---

**非齐次方程组的解结构**

$Ax = b$ 的通解 $= \\eta^*$（特解）$+ k_1\\eta_1 + \\cdots + k_{n-r}\\eta_{n-r}$（导出组的基础解系）。`,
    conclusion: '$\\dim V = n - r(A)$，基础解系含 $n - r$ 个线性无关解向量',
    applications: [
      '$A$ 为 $3 \\times 4$，$r(A) = 2$：基础解系含 $4 - 2 = 2$ 个向量',
      '两解之差是导出组的解：$\\eta_1 - \\eta_2$ 满足 $A(\\eta_1 - \\eta_2) = b - b = 0$',
      '$A_{m \\times n}$，$r(A) = n$（列满秩）：$Ax = 0$ 只有零解'
    ]
  },
  {
    id: 'eqn-cramer-rule',
    title: 'Cramer法则的推导',
    introduction: 'Cramer法则用行列式给出线性方程组的显式解，其证明利用了行列式展开和代数余子式的性质。',
    derivation: `**定理**

设 $A$ 为 $n$ 阶可逆矩阵，$Ax = b$ 的第 $j$ 个分量为：

$$x_j = \\frac{D_j}{D}$$

其中 $D = |A|$，$D_j$ 是将 $A$ 的第 $j$ 列替换为 $b$ 后的行列式。

---

**推导**

$$x_j = \\frac{1}{|A|} \\sum_{i=1}^{n} b_i A_{ij}$$

这是因为 $x = A^{-1}b = \\frac{1}{|A|}A^* b$，所以：

$$x_j = \\frac{1}{|A|} \\sum_{i=1}^{n} A_{ji}^* b_i = \\frac{1}{|A|} \\sum_{i=1}^{n} b_i A_{ij}$$

而 $\\sum_{i=1}^{n} b_i A_{ij}$ 正是将 $D_j$ 按第 $j$ 列展开的结果。

---

**局限性**

Cramer法则理论上优美，但计算量极大（$n$ 阶需要算 $n+1$ 个行列式），实际计算用高斯消元法。考研中主要用于理论推导和低阶（$n \\leq 3$）计算。`,
    conclusion: '$x_j = D_j / D$，$D_j$ 为第 $j$ 列换成 $b$ 的行列式，理论意义大于计算价值',
    applications: [
      '二阶：$x_1 = \\frac{b_1 a_{22} - b_2 a_{12}}{a_{11}a_{22} - a_{12}a_{21}}$',
      '证明：若 $|A| \\neq 0$，则 $Ax = b$ 有唯一解（Cramer法则给出显式解）',
      '齐次方程组 $|A| \\neq 0$ 时只有零解：$D_j = 0$（第 $j$ 列换成零列）'
    ]
  },
];

// 特征值与特征向量公式推导数据
const EIGENVALUE_DERIVATIONS: DerivationItem[] = [
  {
    id: 'eig-characteristic-polynomial',
    title: '特征值与特征多项式的推导',
    introduction: '特征值的定义从 $Ax = \\lambda x$ 出发，导出特征方程 $|\\lambda I - A| = 0$，这是特征值理论的起点。',
    derivation: `**定义与推导**

$\\lambda$ 是 $A$ 的特征值，$x \\neq 0$ 是对应特征向量，当且仅当：

$$Ax = \\lambda x$$

移项：

$$Ax - \\lambda x = 0$$
$$(A - \\lambda I)x = 0$$

这是一个齐次线性方程组，有非零解的充要条件是系数矩阵的行列式为零：

$$|A - \\lambda I| = 0$$

通常写成 $|\\lambda I - A| = 0$（首项系数为正），称为**特征方程**。

---

**特征多项式**

$$f(\\lambda) = |\\lambda I - A| = \\lambda^n - (\\text{tr}A)\\lambda^{n-1} + \\cdots + (-1)^n|A|$$

其中 $\\text{tr}A = \\sum_{i=1}^n a_{ii}$ 是迹，$|A|$ 是行列式。

**两个基本关系**：

1. $\\sum_{i=1}^n \\lambda_i = \\text{tr}A$（迹等于特征值之和）
2. $\\prod_{i=1}^n \\lambda_i = |A|$（行列式等于特征值之积）

这两个关系由多项式根与系数的关系（Vieta公式）直接得到。`,
    conclusion: '特征方程 $|\\lambda I - A| = 0$，$\\sum \\lambda_i = \\text{tr}A$，$\\prod \\lambda_i = |A|$',
    applications: [
      '验证特征值：$A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$，$\\text{tr} = 2$，$|A| = -3$，特征值 $3, -1$，验证：$3+(-1)=2$✓，$3 \\times (-1)=-3$✓',
      '判断矩阵是否可逆：$|A| \\neq 0 \\iff 0$ 不是特征值',
      '反问题：已知部分特征值，利用迹和行列式求其余特征值'
    ]
  },
  {
    id: 'eig-similar-diagonalization',
    title: '矩阵可对角化条件的推导',
    introduction: '矩阵可对角化的充要条件是它有$n$个线性无关的特征向量，不同特征值对应的特征向量线性无关是关键。',
    derivation: `**定理1：不同特征值的特征向量线性无关**

设 $\\lambda_1, \\ldots, \\lambda_k$ 是 $A$ 的互不相同的特征值，$\\alpha_1, \\ldots, \\alpha_k$ 是对应的特征向量，则 $\\alpha_1, \\ldots, \\alpha_k$ 线性无关。

**证明**（数学归纳法）：

$k=1$ 时显然（$\\alpha_1 \\neq 0$）。

设 $k-1$ 个时成立。若 $c_1\\alpha_1 + \\cdots + c_k\\alpha_k = 0$，两边乘以 $A$：

$$c_1\\lambda_1\\alpha_1 + \\cdots + c_k\\lambda_k\\alpha_k = 0$$

又用 $\\lambda_k$ 乘第一个等式：

$$c_1\\lambda_k\\alpha_1 + \\cdots + c_k\\lambda_k\\alpha_k = 0$$

两式相减：

$$c_1(\\lambda_1 - \\lambda_k)\\alpha_1 + \\cdots + c_{k-1}(\\lambda_{k-1} - \\lambda_k)\\alpha_{k-1} = 0$$

由归纳假设 $\\alpha_1, \\ldots, \\alpha_{k-1}$ 线性无关，且 $\\lambda_i \\neq \\lambda_k$，所以 $c_1 = \\cdots = c_{k-1} = 0$，从而 $c_k = 0$。

---

**定理2：可对角化的充要条件**

$A$ 可对角化 $\\iff$ $A$ 有 $n$ 个线性无关的特征向量 $\\iff$ 每个 $k_i$ 重特征值有 $k_i$ 个线性无关的特征向量。

**证明**：

充分性：$n$ 个线性无关特征向量组成可逆矩阵 $P$，则 $P^{-1}AP = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$。

必要性：$P^{-1}AP = \\Lambda$ 意味着 $AP = P\\Lambda$，$P$ 的列就是 $n$ 个线性无关特征向量。

对于重特征值 $\\lambda_i$（$k_i$ 重），线性无关特征向量数 $= n - r(\\lambda_i I - A)$，必须 $= k_i$。`,
    conclusion: '可对角化 $\\iff$ $k_i$重特征值有$k_i$个线性无关特征向量 $\\iff$ $n - r(\\lambda_i I - A) = k_i$',
    applications: [
      '实对称矩阵一定可对角化（不同特征值特征向量正交，重特征值也有足够特征向量）',
      '$A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$：$\\lambda = 1$（二重），$r(A - I) = 1 \\neq 0$，不可对角化',
      '判断：$\\lambda = 2$（三重），$r(2I - A) = 1$，则 $3 - 1 = 2 < 3$，不可对角化'
    ]
  },
  {
    id: 'eig-cayley-hamilton',
    title: 'Cayley-Hamilton定理的推导',
    introduction: 'Cayley-Hamilton定理指出矩阵满足自身的特征方程，是矩阵理论中最深刻的定理之一。',
    derivation: `**定理**

设 $A$ 的特征多项式为 $f(\\lambda) = |\\lambda I - A|$，则 $f(A) = 0$（零矩阵）。

---

**证明（利用伴随矩阵）**

设 $f(\\lambda) = |\\lambda I - A| = \\lambda^n + c_{n-1}\\lambda^{n-1} + \\cdots + c_1 \\lambda + c_0$。

由伴随矩阵公式，$(\\lambda I - A)(\\lambda I - A)^* = |\\lambda I - A| \\cdot I = f(\\lambda) I$。

$(\\lambda I - A)^*$ 的每个元素是 $\\lambda I - A$ 的 $n-1$ 阶子式，关于 $\\lambda$ 至多是 $n-1$ 次多项式。

设 $(\\lambda I - A)^* = B_{n-1}\\lambda^{n-1} + \\cdots + B_1 \\lambda + B_0$，其中 $B_k$ 为 $n$ 阶常矩阵。

展开 $(\\lambda I - A)(\\lambda I - A)^* = f(\\lambda)I$：

$$(\\lambda I - A)(B_{n-1}\\lambda^{n-1} + \\cdots + B_0) = (\\lambda^n + c_{n-1}\\lambda^{n-1} + \\cdots + c_0)I$$

比较 $\\lambda^k$ 的系数，得到 $n+1$ 个矩阵等式。从 $\\lambda^n$ 到 $\\lambda^0$ 依次乘以 $A^n, A^{n-1}, \\ldots, A^0 = I$ 后相加，所有中间项恰好抵消，剩下：

$$f(A) = A^n + c_{n-1}A^{n-1} + \\cdots + c_1 A + c_0 I = 0$$

---

**重要应用**

由 $f(A) = 0$，$A^n = -c_{n-1}A^{n-1} - \\cdots - c_0 I$，可将 $A$ 的高次幂降为低次幂的线性组合。`,
    conclusion: '$f(A) = 0$，矩阵满足自身特征方程，可用来降幂求 $A^k$',
    applications: [
      '$A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$f(\\lambda) = (\\lambda-1)^2$，$A^2 - 2A + I = 0$，$A^2 = 2A - I$',
      '求 $A^{100}$：由Cayley-Hamilton将 $A^{100}$ 表示为 $A$ 和 $I$ 的线性组合',
      '求逆：$f(A) = 0 \\Rightarrow A(-c_{n-1}A^{n-2} - \\cdots - c_1 I) = c_0 I$，$A^{-1} = -\\frac{1}{c_0}(c_{n-1}A^{n-2} + \\cdots + c_1 I)$'
    ]
  },
  {
    id: 'eig-real-symmetric',
    title: '实对称矩阵正交对角化的推导',
    introduction: '实对称矩阵的特征值都是实数，不同特征值的特征向量正交，必可正交对角化——这是最实用的对角化定理。',
    derivation: `**定理1：实对称矩阵的特征值为实数**

设 $A$ 为实对称矩阵，$A\\alpha = \\lambda \\alpha$（$\\alpha \\neq 0$）。

取共轭转置：$\\bar{\\alpha}^T A = \\bar{\\lambda} \\bar{\\alpha}^T$（$A^T = A$，$A$ 为实矩阵）。

右乘 $\\alpha$：$\\bar{\\alpha}^T A \\alpha = \\bar{\\lambda} \\bar{\\alpha}^T \\alpha$。

又 $\\bar{\\alpha}^T A \\alpha = \\bar{\\alpha}^T \\lambda \\alpha = \\lambda \\bar{\\alpha}^T \\alpha$。

所以 $(\\lambda - \\bar{\\lambda})\\bar{\\alpha}^T \\alpha = 0$。$\\bar{\\alpha}^T \\alpha = \\sum |\\alpha_i|^2 > 0$，故 $\\lambda = \\bar{\\lambda}$，$\\lambda$ 为实数。

---

**定理2：不同特征值的特征向量正交**

设 $A\\alpha_1 = \\lambda_1 \\alpha_1$，$A\\alpha_2 = \\lambda_2 \\alpha_2$，$\\lambda_1 \\neq \\lambda_2$。

$\\alpha_2^T A \\alpha_1 = \\lambda_1 \\alpha_2^T \\alpha_1$。

又 $\\alpha_2^T A \\alpha_1 = (A\\alpha_2)^T \\alpha_1 = \\lambda_2 \\alpha_2^T \\alpha_1$（$A^T = A$）。

所以 $(\\lambda_1 - \\lambda_2)\\alpha_2^T \\alpha_1 = 0$，$\\lambda_1 \\neq \\lambda_2$，故 $\\alpha_2^T \\alpha_1 = 0$，即 $\\alpha_1 \\perp \\alpha_2$。

---

**定理3：实对称矩阵可正交对角化**

对重特征值用归纳法：将 $\\alpha_1$ 单位化为 $e_1$，扩充为 $\\mathbb{R}^n$ 的标准正交基，构造正交矩阵 $Q_1 = (e_1, \\ldots, e_n)$，则：

$$Q_1^T A Q_1 = \\begin{pmatrix} \\lambda_1 & * \\\\ 0 & A_1 \\end{pmatrix}$$

$A_1$ 仍是实对称矩阵，对 $A_1$ 归纳即得。`,
    conclusion: '实对称矩阵：特征值全实数，不同特征值特征向量正交，必可正交对角化 $Q^TAQ = \\Lambda$',
    applications: [
      '正交对角化步骤：求特征值→求特征向量→Schmidt正交化→单位化→组成正交矩阵 $Q$',
      '二次型标准化：$f = x^TAx$，令 $x = Qy$，$f = y^TQ^TAQy = \\lambda_1 y_1^2 + \\cdots + \\lambda_n y_n^2$',
      '正定判定：$A$ 正定 $\\iff$ 所有特征值 $> 0$（实对称矩阵）'
    ]
  },
];

// 二次型公式推导数据
const QUADRATIC_FORM_DERIVATIONS: DerivationItem[] = [
  {
    id: 'quad-standardization',
    title: '二次型标准化方法的推导',
    introduction: '二次型通过可逆线性替换化为标准形是核心问题，正交变换法和配方法是两种主要方法。',
    derivation: `**问题**

设二次型 $f(x_1, \\ldots, x_n) = x^T A x$（$A$ 为实对称矩阵），求可逆线性替换 $x = Cy$，使 $f = d_1 y_1^2 + \\cdots + d_n y_n^2$。

---

**方法一：正交变换法**

1. 求 $A$ 的特征值 $\\lambda_1, \\ldots, \\lambda_n$ 和对应特征向量
2. 对特征向量进行Schmidt正交化和单位化，组成正交矩阵 $Q$
3. 令 $x = Qy$，则 $f = \\lambda_1 y_1^2 + \\cdots + \\lambda_n y_n^2$

**原理**：$Q^T A Q = \\text{diag}(\\lambda_1, \\ldots, \\lambda_n)$（实对称矩阵正交对角化）。

---

**方法二：配方法**

以 $f = 2x_1^2 + 5x_2^2 + 5x_3^2 + 4x_1x_2 - 4x_1x_3 - 8x_2x_3$ 为例：

**第一步**：对含 $x_1$ 的项配方

$$f = 2\\left(x_1 + x_2 - x_3\\right)^2 + 3x_2^2 + 3x_3^2 - 4x_2x_3$$

**第二步**：对含 $x_2$ 的项配方

$$= 2\\left(x_1 + x_2 - x_3\\right)^2 + 3\\left(x_2 - \\frac{2}{3}x_3\\right)^2 + \\frac{5}{3}x_3^2$$

令 $y_1 = x_1 + x_2 - x_3$，$y_2 = x_2 - \\frac{2}{3}x_3$，$y_3 = x_3$。

则 $f = 2y_1^2 + 3y_2^2 + \\frac{5}{3}y_3^2$。

---

**两种方法的区别**

- 正交变换法：保持向量长度（$||x|| = ||y||$），标准形系数唯一（特征值）
- 配方法：变换不唯一，标准形系数不唯一，但正负惯性指数唯一`,
    conclusion: '正交变换法系数为特征值（唯一），配方法系数不唯一但惯性指数唯一',
    applications: [
      '惯性定理：无论哪种可逆替换，正惯性指数 $p$ 和负惯性指数 $q$ 是唯一的',
      '合同标准形：$A \\simeq \\text{diag}(1,\\ldots,1,-1,\\ldots,-1,0,\\ldots,0)$（$p$个1，$q$个-1）',
      '正定 $\\iff p = n$（规范形为 $I$），负定 $\\iff q = n$'
    ]
  },
  {
    id: 'quad-positive-definite',
    title: '正定矩阵判定定理的推导',
    introduction: '正定矩阵有多个等价判定条件，从定义到特征值、顺序主子式，构成完整的判定体系。',
    derivation: `**定义**

$A$ 正定：对任意 $x \\neq 0$，$x^TAx > 0$。

---

**等价条件的推导**

**条件1（定义）**：$x^TAx > 0$ 对所有 $x \\neq 0$。

**条件2（特征值）**：$A$ 的所有特征值 $> 0$。

**推导**：$A$ 实对称可正交对角化。令 $x = Qy$，$x^TAx = \\lambda_1 y_1^2 + \\cdots + \\lambda_n y_n^2$。对所有 $y \\neq 0$ 此式 $> 0$，当且仅当所有 $\\lambda_i > 0$。

---

**条件3（顺序主子式）**：所有顺序主子式 $> 0$。

$$\\Delta_1 = a_{11} > 0, \\quad \\Delta_2 = \\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} > 0, \\quad \\ldots, \\quad \\Delta_n = |A| > 0$$

**推导思路**：用归纳法。$n=1$ 时 $\\Delta_1 = a_{11} > 0$ 显然。

归纳假设 $n-1$ 阶成立。$A$ 正定时，其 $n-1$ 阶顺序主子阵也正定（取 $x_n = 0$ 即可），由归纳假设其所有顺序主子式 $> 0$，加上 $|A| = \\prod \\lambda_i > 0$。

反过来，所有 $\\Delta_k > 0$ 可推出 $A$ 正定（对角化后利用Sylvester惯性律）。

---

**条件4（合同于 $I$）**：存在可逆 $C$，使 $C^TAC = I$。

**推导**：$A$ 正定 $\\iff$ 惯性指数 $p = n$ $\\iff$ 规范形为 $I$ $\\iff$ $A \\simeq I$。`,
    conclusion: '正定 $\\iff$ 全部特征值$>0$ $\\iff$ 全部顺序主子式$>0$ $\\iff$ 合同于$I$ $\\iff$ $A = R^TR$（$R$可逆）',
    applications: [
      '$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$：$\\Delta_1 = 2 > 0$，$\\Delta_2 = 3 > 0$，正定',
      '$A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$：$\\Delta_2 = 1 - 4 = -3 < 0$，不正定',
      '半正定：$x^TAx \\geq 0$ $\\iff$ 特征值 $\\geq 0$ $\\iff$ 顺序主子式 $\\geq 0$（注意：后者不是充要的！）'
    ]
  },
  {
    id: 'quad-inertia-theorem',
    title: '惯性定理的证明',
    introduction: '惯性定理指出二次型的正负惯性指数在可逆线性替换下不变，是二次型分类的理论基础。',
    derivation: `**定理**

设实二次型 $f = x^TAx$ 经过两个可逆线性替换分别化为：

$$f = y_1^2 + \\cdots + y_p^2 - y_{p+1}^2 - \\cdots - y_r^2$$
$$f = z_1^2 + \\cdots + z_q^2 - z_{q+1}^2 - \\cdots - z_r^2$$

则 $p = q$（正惯性指数唯一）。

---

**反证法证明**

假设 $p > q$。

设 $x = C_1 y = C_2 z$，其中 $y$ 和 $z$ 是不同替换下的变量。

考虑方程组：

$$y_1 = 0, \\ldots, y_p = 0, \\quad z_{q+1} = 0, \\ldots, z_r = 0, \\ldots, z_n = 0$$

这是 $p + (n - q)$ 个关于 $x_1, \\ldots, x_n$ 的齐次方程，共 $p + n - q > n$（因为 $p > q$）。

等等，这不对，方程数可能 $> n$ 也可能 $< n$。实际上 $p + (n - q)$ 个方程关于 $n$ 个未知数，当 $p > q$ 时 $p + n - q > n$。

但关键是：这 $p + (n-q)$ 个方程的变量是 $x$，由 $y = C_1^{-1}x$ 和 $z = C_2^{-1}x$，每组都是 $x$ 的齐次方程。当方程数 $> n$ 时可能有非零解 $x_0 \\neq 0$（因为自由度）。

对这个 $x_0$：从第一个标准形，$f(x_0) \\leq 0$（因为 $y_1 = \\cdots = y_p = 0$，只剩负项）。

从第二个标准形，$f(x_0) \\geq 0$（因为 $z_{q+1} = \\cdots = z_n = 0$，只剩正项）。

所以 $f(x_0) = 0$ 且所有 $y_i = 0$（$i = 1, \\ldots, p$）和 $z_j = 0$（$j = q+1, \\ldots, n$），但 $x_0 \\neq 0$ 要求某些 $z_j \\neq 0$（$j \\leq q$），矛盾。

---

**推论**

合同标准形唯一（不计排列顺序），即规范形唯一。`,
    conclusion: '正惯性指数 $p$ 和负惯性指数 $q$ 在可逆替换下不变，规范形唯一',
    applications: [
      '合同 $\\iff$ 同阶同秩同惯性指数：$A \\simeq B \\iff p_A = p_B, r(A) = r(B)$',
      '正定 $\\iff p = n, r = n$；负定 $\\iff q = n, r = n$；不定 $\\iff p > 0, q > 0$',
      '$A \\simeq B \\iff$ 规范形相同（实对称矩阵合同的充要条件）'
    ]
  },
];

// 向量与向量空间公式推导数据
const VECTOR_SPACE_DERIVATIONS: DerivationItem[] = [
  {
    id: 'vec-linear-independence',
    title: '向量组线性相关判定定理的推导',
    introduction: '向量组线性相关/无关的判定是线性代数最基础的问题，其等价条件构成完整的判定体系。',
    derivation: `**定义**

$\\alpha_1, \\ldots, \\alpha_s$ 线性相关 $\\iff$ 存在不全为零的 $k_1, \\ldots, k_s$，使 $k_1\\alpha_1 + \\cdots + k_s\\alpha_s = 0$。

---

**等价条件链**

以下各条件等价（$\\alpha_1, \\ldots, \\alpha_s \\in \\mathbb{R}^n$，排成矩阵 $A = (\\alpha_1, \\ldots, \\alpha_s)$）：

1. $\\alpha_1, \\ldots, \\alpha_s$ 线性相关
2. 其中某个向量可由其余向量线性表示
3. $r(\\alpha_1, \\ldots, \\alpha_s) < s$
4. $Ax = 0$ 有非零解
5. （$s > n$ 时）必线性相关

---

**关键推导**

**1 $\\iff$ 2**：若 $k_1\\alpha_1 + \\cdots + k_s\\alpha_s = 0$ 且某个 $k_i \\neq 0$，则 $\\alpha_i = -\\frac{1}{k_i}\\sum_{j \\neq i} k_j \\alpha_j$。反之亦然。

**1 $\\iff$ 3**：$r(A) < s$ 表示 $A$ 的列空间维数 $< s$，即 $s$ 个列向量张成的空间维数不够，必然线性相关。反之 $r(A) = s$ 则列满秩，线性无关。

**1 $\\iff$ 4**：$Ax = 0$ 有非零解就是定义本身（$k_1, \\ldots, k_s$ 就是解）。

**5**：$s > n$ 时 $r(A) \\leq n < s$，由3即得。

---

**极大线性无关组**

向量组的极大线性无关组所含向量数 $= r(A) = $ 向量组的秩。任意两个极大无关组等价且向量数相同。`,
    conclusion: '线性相关 $\\iff$ $r < s$ $\\iff$ $Ax=0$有非零解 $\\iff$ 某个向量可由其余表示',
    applications: [
      '单个向量 $\\alpha$ 线性相关 $\\iff \\alpha = 0$',
      '两个向量线性相关 $\\iff$ 成比例',
      '$n+1$ 个 $n$ 维向量必线性相关（$s > n$）'
    ]
  },
  {
    id: 'vec-dimension-theorem',
    title: '维数公式与基扩充定理的推导',
    introduction: '维数公式 $\\dim(V_1 + V_2) = \\dim V_1 + \\dim V_2 - \\dim(V_1 \\cap V_2)$ 是子空间运算的核心公式。',
    derivation: `**维数公式**

设 $V_1, V_2$ 是 $V$ 的子空间，则：

$$\\dim(V_1 + V_2) = \\dim V_1 + \\dim V_2 - \\dim(V_1 \\cap V_2)$$

---

**证明**

设 $\\dim(V_1 \\cap V_2) = r$，取 $V_1 \\cap V_2$ 的一组基 $\\alpha_1, \\ldots, \\alpha_r$。

将其分别扩充为 $V_1$ 的基 $\\alpha_1, \\ldots, \\alpha_r, \\beta_1, \\ldots, \\beta_s$ 和 $V_2$ 的基 $\\alpha_1, \\ldots, \\alpha_r, \\gamma_1, \\ldots, \\gamma_t$。

则 $\\dim V_1 = r + s$，$\\dim V_2 = r + t$。

**断言**：$\\alpha_1, \\ldots, \\alpha_r, \\beta_1, \\ldots, \\beta_s, \\gamma_1, \\ldots, \\gamma_t$ 是 $V_1 + V_2$ 的基。

首先，这些向量生成 $V_1 + V_2$（$V_1 + V_2$ 的元素 $= v_1 + v_2$，$v_1 \\in V_1$, $v_2 \\in V_2$）。

其次，证明线性无关。设 $\\sum c_i \\alpha_i + \\sum d_j \\beta_j + \\sum e_k \\gamma_k = 0$。

则 $\\sum e_k \\gamma_k = -\\sum c_i \\alpha_i - \\sum d_j \\beta_j \\in V_1$。

又 $\\sum e_k \\gamma_k \\in V_2$，所以 $\\sum e_k \\gamma_k \\in V_1 \\cap V_2$。

但 $\\alpha_1, \\ldots, \\alpha_r$ 是 $V_1 \\cap V_2$ 的基，$\\alpha_1, \\ldots, \\alpha_r, \\gamma_1, \\ldots, \\gamma_t$ 线性无关，所以 $e_k = 0$。

同理 $d_j = 0$，然后 $c_i = 0$。

所以 $\\dim(V_1 + V_2) = r + s + t = (r+s) + (r+t) - r = \\dim V_1 + \\dim V_2 - \\dim(V_1 \\cap V_2)$。

---

**直和判定**

$V_1 + V_2$ 为直和 $\\iff V_1 \\cap V_2 = \\{0\\}$ $\\iff \\dim(V_1 + V_2) = \\dim V_1 + \\dim V_2$。`,
    conclusion: '$\\dim(V_1+V_2) = \\dim V_1 + \\dim V_2 - \\dim(V_1 \\cap V_2)$，直和 $\\iff$ 交为零空间',
    applications: [
      '$\\mathbb{R}^3$ 中两个过原点的不同平面，$\\dim V_1 = \\dim V_2 = 2$，$\\dim(V_1 \\cap V_2) = 1$（交线），$\\dim(V_1 + V_2) = 2+2-1 = 3$',
      '核空间与像空间：$\\dim(\\ker A) + \\dim(\\text{Im}A) = n$（秩-零度定理）',
      '补空间：$V = V_1 \\oplus V_2$，$\\dim V = \\dim V_1 + \\dim V_2$'
    ]
  },
  {
    id: 'vec-schmidt-process',
    title: 'Schmidt正交化过程的推导',
    introduction: 'Gram-Schmidt正交化从线性无关向量组出发，构造等价的正交向量组，是对角化和二次型标准化的关键工具。',
    derivation: `**算法**

设 $\\alpha_1, \\ldots, \\alpha_s$ 线性无关，构造正交组 $\\beta_1, \\ldots, \\beta_s$ 和标准正交组 $e_1, \\ldots, e_s$。

---

**递推公式**

$$\\beta_1 = \\alpha_1$$

$$\\beta_2 = \\alpha_2 - \\frac{(\\alpha_2, \\beta_1)}{(\\beta_1, \\beta_1)} \\beta_1$$

$$\\beta_3 = \\alpha_3 - \\frac{(\\alpha_3, \\beta_1)}{(\\beta_1, \\beta_1)} \\beta_1 - \\frac{(\\alpha_3, \\beta_2)}{(\\beta_2, \\beta_2)} \\beta_2$$

一般地：

$$\\beta_k = \\alpha_k - \\sum_{j=1}^{k-1} \\frac{(\\alpha_k, \\beta_j)}{(\\beta_j, \\beta_j)} \\beta_j$$

然后单位化：$e_k = \\frac{\\beta_k}{||\\beta_k||}$。

---

**正交性的验证**

以 $\\beta_3$ 为例，验证 $(\\beta_3, \\beta_1) = 0$：

$$(\\beta_3, \\beta_1) = (\\alpha_3, \\beta_1) - \\frac{(\\alpha_3, \\beta_1)}{(\\beta_1, \\beta_1)}(\\beta_1, \\beta_1) - \\frac{(\\alpha_3, \\beta_2)}{(\\beta_2, \\beta_2)} \\cdot 0$$

$$= (\\alpha_3, \\beta_1) - (\\alpha_3, \\beta_1) = 0$$

其中最后一项用了 $(\\beta_2, \\beta_1) = 0$（归纳假设）。

---

**几何意义**

$\\frac{(\\alpha_k, \\beta_j)}{(\\beta_j, \\beta_j)} \\beta_j$ 是 $\\alpha_k$ 在 $\\beta_j$ 方向上的投影分量。$\\beta_k$ 就是从 $\\alpha_k$ 中减去所有已有方向上的投影，剩下"新的正交分量"。`,
    conclusion: '$\\beta_k = \\alpha_k - \\sum_{j<k} \\frac{(\\alpha_k,\\beta_j)}{(\\beta_j,\\beta_j)}\\beta_j$，减去投影分量得正交分量',
    applications: [
      '$\\alpha_1 = (1,1,0), \\alpha_2 = (1,0,1)$：$\\beta_1 = (1,1,0)$，$\\beta_2 = (1,0,1) - \\frac{1}{2}(1,1,0) = (\\frac{1}{2},-\\frac{1}{2},1)$',
      '实对称矩阵正交对角化时，重特征值的特征向量需Schmidt正交化',
      'QR分解：$A = QR$，$Q$ 为正交矩阵，$R$ 为上三角矩阵（Schmidt正交化的矩阵形式）'
    ]
  },
];

// 章节数据
const CHAPTERS = [
  { id: 'limits', name: '函数与极限', icon: '∞' },
  { id: 'derivative', name: '导数与微分', icon: '∂' },
  { id: 'mean-value', name: '微分中值定理与导数应用', icon: 'ξ' },
  { id: 'indefinite-integral', name: '不定积分', icon: '∫' },
  { id: 'definite-integral', name: '定积分', icon: '∬' },
  { id: 'vector-geometry', name: '向量代数与空间解析几何', icon: '→' },
  { id: 'multivariable-differential', name: '多元函数微分法', icon: '∂²' },
  { id: 'multi-integral', name: '多元函数积分学', icon: '∬' },
  { id: 'infinite-series', name: '无穷级数', icon: 'Σ' },
  { id: 'differential-equations', name: '微分方程', icon: '📐' },
  { id: 'probability-events', name: '随机事件和概率', icon: '🎲' },
  { id: 'one-dim-rv', name: '一维随机变量及其分布', icon: '📊' },
  { id: 'two-dim-rv', name: '二维随机变量及其分布', icon: '📈' },
  { id: 'numerical-characteristics', name: '随机变量的数字特征', icon: '📏' },
  { id: 'lln-clt', name: '大数定律与中心极限定理', icon: '🎯' },
  { id: 'sampling-distribution', name: '数理统计基本概念', icon: '🔬' },
  { id: 'parameter-estimation', name: '参数估计', icon: '📐' },
  { id: 'hypothesis-testing', name: '假设检验', icon: '⚖️' },
  { id: 'determinant', name: '行列式', icon: '▯' },
  { id: 'matrix', name: '矩阵', icon: '⊞' },
  { id: 'linear-equations', name: '线性方程组', icon: '≡' },
  { id: 'eigenvalue', name: '特征值与特征向量', icon: 'λ' },
  { id: 'quadratic-form', name: '二次型', icon: '◇' },
  { id: 'vector-space', name: '向量与向量空间', icon: '⟨⟩' },
];

// 获取对应章节的推导内容
const getDerivationsByChapter = (chapterId: string): DerivationItem[] => {
  const derivationMap: Record<string, DerivationItem[]> = {
    'limits': LIMITS_DERIVATIONS,
    'derivative': DERIVATIVE_DERIVATIONS,
    'mean-value': MEAN_VALUE_DERIVATIONS,
    'indefinite-integral': INDEFINITE_INTEGRAL_DERIVATIONS,
    'definite-integral': DEFINITE_INTEGRAL_DERIVATIONS,
    'vector-geometry': VECTOR_GEOMETRY_DERIVATIONS,
    'multivariable-differential': MULTIVARIABLE_DIFFERENTIAL_DERIVATIONS,
    'multi-integral': MULTIVARIABLE_INTEGRAL_DERIVATIONS,
    'infinite-series': SERIES_DERIVATIONS,
    'differential-equations': DIFFERENTIAL_EQUATIONS_DERIVATIONS,
    'probability-events': PROBABILITY_EVENTS_DERIVATIONS,
    'one-dim-rv': ONE_DIM_RV_DERIVATIONS,
    'two-dim-rv': TWO_DIM_RV_DERIVATIONS,
    'numerical-characteristics': NUMERICAL_CHARACTERISTICS_DERIVATIONS,
    'lln-clt': LLN_CLT_DERIVATIONS,
    'sampling-distribution': SAMPLING_DISTRIBUTION_DERIVATIONS,
    'parameter-estimation': PARAMETER_ESTIMATION_DERIVATIONS,
    'hypothesis-testing': HYPOTHESIS_TESTING_DERIVATIONS,
    'determinant': DETERMINANT_DERIVATIONS,
    'matrix': MATRIX_DERIVATIONS,
    'linear-equations': LINEAR_EQUATIONS_DERIVATIONS,
    'eigenvalue': EIGENVALUE_DERIVATIONS,
    'quadratic-form': QUADRATIC_FORM_DERIVATIONS,
    'vector-space': VECTOR_SPACE_DERIVATIONS,
  };
  return derivationMap[chapterId] || [];
};

// 渲染带Markdown的文本
const RenderText: React.FC<{ text: string }> = ({ text }) => {
  // 解析文本内容，返回渲染元素数组
  const renderContent = useMemo(() => {
    const elements: React.ReactNode[] = [];
    let keyIndex = 0;
    
    // 使用索引遍历文本
    let i = 0;
    let currentText = '';
    
    while (i < text.length) {
      // 检查是否是块级公式 $$
      if (text[i] === '$' && text[i + 1] === '$') {
        // 先输出之前累积的文本
        if (currentText) {
          elements.push(<TextWithInlineFormula key={`text-${keyIndex++}`} text={currentText} />);
          currentText = '';
        }
        
        // 找到结束的 $$
        let end = i + 2;
        while (end < text.length && !(text[end] === '$' && text[end + 1] === '$')) {
          end++;
        }
        
        if (end < text.length) {
          // 提取公式内容
          const formula = text.slice(i + 2, end);
          elements.push(<MathFormulaBlock key={`block-${keyIndex++}`} latex={formula.trim()} />);
          i = end + 2;
        } else {
          // 没找到结束标记，当作普通文本
          currentText += '$$';
          i += 2;
        }
      } else {
        currentText += text[i];
        i++;
      }
    }
    
    // 输出最后的文本
    if (currentText) {
      elements.push(<TextWithInlineFormula key={`text-${keyIndex++}`} text={currentText} />);
    }
    
    return elements;
  }, [text]);

  return <div className="derivation-text">{renderContent}</div>;
};

// 处理包含行内公式的文本
const TextWithInlineFormula: React.FC<{ text: string }> = ({ text }) => {
  const parts = useMemo(() => {
    const result: React.ReactNode[] = [];
    let keyIndex = 0;
    
    // 先处理分隔线 ---
    const sections = text.split('---');
    
    sections.forEach((section, sectionIdx) => {
      // 处理加粗和行内公式
      const boldParts = section.split(/(\*\*[^*]+\*\*)/g);
      
      boldParts.forEach((part, _partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // 加粗文本
          result.push(<strong key={`bold-${keyIndex++}`}>{part.slice(2, -2)}</strong>);
        } else if (part) {
          // 处理行内公式 $...$（但不匹配 $$...$$）
          // 使用正则匹配单个 $ 包围的内容，排除 $$ 的情况
          const inlineParts = part.split(/(?<!\$)\$(?!\$)([^$]+)(?<!\$)\$(?!\$)/g);
          
          if (inlineParts.length === 1) {
            // 没有行内公式，直接处理文本
            const lines = part.split('\n');
            lines.forEach((line, lineIdx) => {
              if (lineIdx > 0) {
                result.push(<br key={`br-${keyIndex++}`} />);
              }
              if (line) {
                result.push(<span key={`span-${keyIndex++}`}>{line}</span>);
              }
            });
          } else {
            // 有行内公式，交替处理文本和公式
            for (let i = 0; i < inlineParts.length; i++) {
              const p = inlineParts[i];
              if (i % 2 === 1 && p !== undefined) {
                // 这是公式内容
                result.push(<MathFormula key={`inline-${keyIndex++}`} latex={p} displayMode={false} />);
              } else if (p) {
                // 这是普通文本
                const lines = p.split('\n');
                lines.forEach((line, lineIdx) => {
                  if (lineIdx > 0) {
                    result.push(<br key={`br-${keyIndex++}`} />);
                  }
                  if (line) {
                    result.push(<span key={`span-${keyIndex++}`}>{line}</span>);
                  }
                });
              }
            }
          }
        }
      });
      
      // 添加分隔线（除了最后一个部分）
      if (sectionIdx < sections.length - 1) {
        result.push(<hr key={`hr-${keyIndex++}`} className="text-divider" />);
      }
    });
    
    return result;
  }, [text]);

  return <>{parts}</>;
};

const FormulaDerivation: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('vector-geometry');
  const [activeDerivation, setActiveDerivation] = useState<string | null>(null);

  const derivations = getDerivationsByChapter(activeChapter);

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
                setActiveDerivation(null);
              }}
            >
              <span className="chapter-icon">{chapter.icon}</span>
              <span className="chapter-name">{chapter.name}</span>
            </div>
          ))}
        </div>
        <div className="sidebar-topics">
          <h4>推导专题</h4>
          {derivations.map(item => (
            <div
              key={item.id}
              className={`topic-item ${activeDerivation === item.id ? 'active' : ''}`}
              onClick={() => setActiveDerivation(item.id)}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="derivation-content">
        {activeDerivation ? (
          (() => {
            const item = derivations.find(d => d.id === activeDerivation);
            if (!item) return null;
            return (
              <div className="derivation-detail">
                <div className="detail-header">
                  <button className="back-btn" onClick={() => setActiveDerivation(null)}>
                    ← 返回列表
                  </button>
                  <h2>{item.title}</h2>
                  <p className="introduction">{item.introduction}</p>
                </div>

                <div className="derivation-body">
                  <RenderText text={item.derivation} />
                </div>

                <div className="conclusion-box">
                  <h4>📝 核心结论</h4>
                  <div className="conclusion-formula">
                    <RenderText text={item.conclusion} />
                  </div>
                </div>

                <div className="applications-box">
                  <h4>💡 应用示例</h4>
                  <ul>
                    {item.applications.map((app, index) => (
                      <li key={index}>
                        <RenderText text={app} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="derivation-list-view">
            <div className="content-header">
              <h2>{CHAPTERS.find(c => c.id === activeChapter)?.name} - 公式推导</h2>
              <p>点击左侧专题查看详细推导过程</p>
            </div>
            <div className="topic-cards">
              {derivations.map(item => (
                <div 
                  key={item.id} 
                  className="topic-card"
                  onClick={() => setActiveDerivation(item.id)}
                >
                  <h3>{item.title}</h3>
                  <p>{item.introduction}</p>
                  <div className="card-formula">
                    <RenderText text={item.conclusion} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaDerivation;
