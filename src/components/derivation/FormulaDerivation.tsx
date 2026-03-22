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
      
      boldParts.forEach((part, partIdx) => {
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
  const [activeChapter, setActiveChapter] = useState('differential-equations');
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
