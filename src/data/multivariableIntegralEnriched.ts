// ============================================
// 多元函数积分学知识点（名师讲解版）
// ============================================

import { KnowledgePoint } from '@/types'

// 二重积分知识点（名师讲解版）
export const doubleIntegralPointEnriched: KnowledgePoint = {
  id: 'double-integral',
  moduleId: 'multivariable-integral',
  name: '二重积分',
  formula: '\\iint_D f(x, y) \\, d\\sigma',
  coreSentence: '二重积分就是"把平面切成无数小块，每块乘高度再累加"——本质上就是求曲顶柱体体积。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2 + y^2', color: '#D4A574', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 4, max: 50, step: 1, defaultValue: 10, label: '分割数 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '分割细化过程',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=4，切4块，粗糙得很', changes: { n: 4 } },
            { id: 's2', description: 'n=10，切10块，有点样子了', changes: { n: 10 } },
            { id: 's3', description: 'n=25，切25块，越来越准', changes: { n: 25 } },
            { id: 's4', description: 'n=50，切50块，极限逼近', changes: { n: 50 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：二重积分是什么？

**二重积分 = 求曲顶柱体的体积。**

就这么简单。别被那些复杂的定义吓到了。

---

## 📐 怎么理解？

想象一下，你有一个平面区域 $D$，上面盖着一个曲面 $z = f(x,y)$。

这就形成了一个"曲顶柱体"——底是平的，顶是弯的。

**问题来了：怎么求这个怪东西的体积？**

### 思路很简单

1. **切**：把底面切成无数小块
2. **算**：每小块上的柱体体积 ≈ 底面积 × 高度
3. **加**：把所有小柱体体积加起来
4. **极限**：切得越细越准，取极限就是精确值

这就是二重积分的全部思想！

---

## 🔢 定义（考试要考，但理解更重要）

把区域 $D$ 切成 $n$ 块，每块面积 $\\Delta\\sigma_i$，在每块上任取一点 $(\\xi_i, \\eta_i)$，作和：

$$\\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta\\sigma_i$$

当切得无限细时，这个和的极限就是二重积分：

$$\\iint_D f(x, y) \\, d\\sigma$$

**记住**：这就是"分割→近似→求和→取极限"四步法，跟定积分一模一样的思想！

---

## 💡 几何意义（秒懂）

| 情况 | 意义 |
|------|------|
| $f(x,y) \\geq 0$ | 曲顶柱体体积 |
| $f(x,y) \\leq 0$ | 体积的相反数（在xy平面下方） |
| $f(x,y) = 1$ | 区域 $D$ 的面积 |

**考试技巧**：如果让你求平面图形面积，就令 $f(x,y) = 1$，然后算二重积分！

---

## 🔧 怎么算？两种方法

### 方法一：直角坐标

**核心思想**：把二重积分变成两次定积分（累次积分）

**X型区域**（从左到右看，上下各一条边界）：
$$\\iint_D f(x,y) d\\sigma = \\int_a^b dx \\int_{y_下(x)}^{y_上(x)} f(x,y) dy$$

**口诀**：先积 $y$（把 $x$ 当常数），再积 $x$

**Y型区域**（从下到上看，左右各一条边界）：
$$\\iint_D f(x,y) d\\sigma = \\int_c^d dy \\int_{x_左(y)}^{x_右(y)} f(x,y) dx$$

**口诀**：先积 $x$（把 $y$ 当常数），再积 $y$

**怎么选？**
- 哪种类型不需要分段，就选哪种
- 哪种内层积分更简单，就选哪种

---

### 方法二：极坐标

**什么时候用？**
- 区域是圆、圆环、扇形
- 被积函数里有 $x^2 + y^2$

**变换公式**：
$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$

**面积元素**（千万别忘！）：
$$d\\sigma = r \\, dr \\, d\\theta$$

**完整公式**：
$$\\iint_D f(x,y) d\\sigma = \\iint_{D'} f(r\\cos\\theta, r\\sin\\theta) \\cdot r \\, dr \\, d\\theta$$

**⚠️ 致命错误**：忘了乘 $r$！这是90%的同学都会犯的错！

---

## 📊 常见极坐标区域（背下来）

| 区域 | $r$ 范围 | $\\theta$ 范围 |
|------|----------|----------------|
| 圆心在原点的圆 | $0 \\leq r \\leq R$ | $0 \\leq \\theta \\leq 2\\pi$ |
| 圆心在x轴的圆 | $0 \\leq r \\leq 2R\\cos\\theta$ | $-\\frac{\\pi}{2} \\leq \\theta \\leq \\frac{\\pi}{2}$ |
| 圆心在y轴的圆 | $0 \\leq r \\leq 2R\\sin\\theta$ | $0 \\leq \\theta \\leq \\pi$ |

---

## 🎓 对称性技巧（秒杀题目的神器）

**如果区域关于坐标轴对称**：

| 对称情况 | 被积函数 | 结果 |
|----------|----------|------|
| 关于x轴对称 | 关于y奇函数 | = 0 |
| 关于x轴对称 | 关于y偶函数 | = 2倍上半部分 |
| 关于y轴对称 | 关于x奇函数 | = 0 |
| 关于y轴对称 | 关于x偶函数 | = 2倍右半部分 |

**口诀**：区域对称看函数，奇零偶倍要记住！

**例子**：$\\iint_D xy d\\sigma$，$D$ 是圆域 $x^2+y^2 \\leq 1$

区域关于x轴、y轴都对称，$xy$ 关于 $x$ 是奇函数，关于 $y$ 也是奇函数。

**直接写答案**：积分 = 0！

不用算，直接出结果，这就是对称性的威力！

---

## ⚠️ 三大误区（考试必错点）

**误区1**：极坐标忘了乘 $r$
- **后果**：答案差一个因子，直接扣分
- **记住**：$d\\sigma = r dr d\\theta$，那个 $r$ 是必须的！

**误区2**：积分限写反
- **后果**：答案差个负号
- **记住**：内层积分限是函数，外层是常数

**误区3**：对称性乱用
- **后果**：题目做错了还觉得自己很聪明
- **记住**：先看区域对称，再看函数奇偶，两个条件缺一不可

---

## 📝 解题四步法

**第一步：画区域**
- 画出积分区域 $D$ 的草图
- 标出边界曲线和交点

**第二步：定类型**
- X型还是Y型？
- 圆形区域用极坐标

**第三步：定积分限**
- 外层：从常数到常数
- 内层：从函数到函数

**第四步：计算**
- 先算内层（外层变量当常数）
- 再算外层

---

## 🏆 典型例题

**例1**：计算 $\\iint_D xy d\\sigma$，$D$ 由 $y=x$ 和 $y=x^2$ 围成。

**解**：
1. 画图：交点 $(0,0)$ 和 $(1,1)$
2. 选X型：$0 \\leq x \\leq 1$，$x^2 \\leq y \\leq x$
3. 积分：
$$\\int_0^1 dx \\int_{x^2}^x xy dy = \\int_0^1 x \\cdot \\frac{y^2}{2}\\Big|_{x^2}^x dx = \\frac{1}{2}\\int_0^1 (x^3 - x^5) dx = \\frac{1}{24}$$

**例2**：计算 $\\iint_D (x^2+y^2) d\\sigma$，$D: x^2+y^2 \\leq 1$。

**解**：圆形区域，用极坐标！
$$\\int_0^{2\\pi} d\\theta \\int_0^1 r^2 \\cdot r dr = 2\\pi \\cdot \\frac{1}{4} = \\frac{\\pi}{2}$$

看到没？极坐标多简单！`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 二重积分的本质

**一句话**：二重积分就是二维的"求和"。

定积分是在直线上求和，二重积分是在平面上求和。

**物理意义**：
- $f(x,y)$ = 面密度 → 积分 = 总质量
- $f(x,y) = 1$ → 积分 = 面积
- $f(x,y) = x$ 或 $y$ → 积分可求质心

---

## 💎 交换积分顺序

**什么时候需要换？**
- 内层积分积不出来
- 内层积分太复杂

**怎么换？**
1. 根据原积分限画出区域
2. 重新确定积分限
3. 换序计算

**例子**：$\\int_0^1 dy \\int_y^1 e^{x^2} dx$

内层 $e^{x^2}$ 根本积不出来！必须换序。

原区域：$0 \\leq y \\leq 1$，$y \\leq x \\leq 1$

换序后：$0 \\leq x \\leq 1$，$0 \\leq y \\leq x$

$$\\int_0^1 dx \\int_0^x e^{x^2} dy = \\int_0^1 xe^{x^2} dx = \\frac{1}{2}(e-1)$$

搞定！

---

## 🚀 应用公式

**面积**：$S = \\iint_D d\\sigma$

**体积**：$V = \\iint_D f(x,y) d\\sigma$（$f \\geq 0$）

**质量**：$M = \\iint_D \\rho(x,y) d\\sigma$

**质心**：$\\bar{x} = \\frac{\\iint_D x\\rho d\\sigma}{M}$，$\\bar{y} = \\frac{\\iint_D y\\rho d\\sigma}{M}$

**转动惯量**：$I_x = \\iint_D y^2\\rho d\\sigma$，$I_y = \\iint_D x^2\\rho d\\sigma$`,
      extension: `## 📚 广义极坐标

椭圆区域 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} \\leq 1$ 怎么办？

**变换**：$x = ar\\cos\\theta$，$y = br\\sin\\theta$

**面积元素**：$d\\sigma = abr dr d\\theta$

**积分限**：$0 \\leq r \\leq 1$，$0 \\leq \\theta \\leq 2\\pi$

椭圆就变成单位圆了！`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '求平面面积',
        description: `**问题**：求 $y = x^2$ 和 $y = \\sqrt{x}$ 围成的面积。

**秒解**：
$$S = \\iint_D d\\sigma = \\int_0^1 dx \\int_{x^2}^{\\sqrt{x}} dy = \\int_0^1 (\\sqrt{x} - x^2) dx = \\frac{1}{3}$$

就这么简单！`,
        scenario: '二重积分求面积的标准做法。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求曲顶柱体体积',
        description: `**问题**：求 $z = x^2 + y^2$ 在圆域 $x^2+y^2 \\leq 1$ 上的体积。

**秒解**（极坐标）：
$$V = \\int_0^{2\\pi} d\\theta \\int_0^1 r^2 \\cdot r dr = 2\\pi \\cdot \\frac{1}{4} = \\frac{\\pi}{2}$$

三行搞定！`,
        scenario: '极坐标在圆形区域的威力。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '求质心',
        description: `**问题**：均匀半圆薄板，求质心。

**分析**：
- 由对称性，$\\bar{x} = 0$
- 只需求 $\\bar{y}$

**计算**：
$$\\bar{y} = \\frac{\\iint_D y d\\sigma}{S} = \\frac{\\int_0^{\\pi} d\\theta \\int_0^R r\\sin\\theta \\cdot r dr}{\\frac{\\pi R^2}{2}} = \\frac{4R}{3\\pi}$$

**结论**：质心在圆心上方约 $0.424R$ 处。`,
        scenario: '质心计算的标准流程。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '画图定类型', 
        description: `**必做第一步**：画出积分区域！

- X型：从左到右，上下各一条边界
- Y型：从下到上，左右各一条边界
- 圆形：直接上极坐标

**选型原则**：选不需要分段的那种！`
      },
      { 
        number: 2, 
        title: '定积分限', 
        description: `**X型**：$\\int_a^b dx \\int_{y_下(x)}^{y_上(x)} f(x,y) dy$

**Y型**：$\\int_c^d dy \\int_{x_左(y)}^{x_右(y)} f(x,y) dx$

**极坐标**：$\\int_{\\theta_1}^{\\theta_2} d\\theta \\int_{r_1(\\theta)}^{r_2(\\theta)} f \\cdot r dr$

**记住**：外层常数，内层函数！`
      },
      { 
        number: 3, 
        title: '计算检验', 
        description: `**计算**：先内层后外层，外层变量当常数。

**检验**：
- 结果正负对吗？（$f \\geq 0$ 时积分应 $\\geq 0$）
- 量纲对吗？
- 能用对称性检验吗？`
      },
    ],
  },
}

// 三重积分知识点（名师讲解版）
export const tripleIntegralPointEnriched: KnowledgePoint = {
  id: 'triple-integral',
  moduleId: 'multivariable-integral',
  name: '三重积分',
  formula: '\\iiint_\\Omega f(x, y, z) \\, dV',
  coreSentence: '三重积分就是"把空间切成无数小块，累加函数值乘体积"——求质量、质心、转动惯量的核心工具。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 4, max: 30, step: 1, defaultValue: 8, label: '分割数 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '分割细化',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=4，粗略分割', changes: { n: 4 } },
            { id: 's2', description: 'n=10，中等分割', changes: { n: 10 } },
            { id: 's3', description: 'n=20，精细分割', changes: { n: 20 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：三重积分是什么？

**三重积分 = 在空间区域上的"求和"。**

二重积分是在平面上求和，三重积分是在空间中求和。

就这么简单。

---

## 📐 物理意义（秒懂）

| 被积函数 | 积分结果 |
|----------|----------|
| 密度 $\\rho(x,y,z)$ | 物体总质量 |
| 1 | 物体体积 |
| $x$ 或 $y$ 或 $z$ | 可求质心坐标 |
| $x^2$ 或 $y^2$ 或 $z^2$ | 可求转动惯量 |

**最常用的**：$f = \\rho$ 求质量，$f = 1$ 求体积。

---

## 🔧 怎么算？三种坐标系统

### 方法一：直角坐标

**投影法（先一后二）**：
1. 把空间区域投影到某个坐标面
2. 先积一个变量
3. 再积另外两个变量

**公式**：
$$\\iiint_\\Omega f dV = \\iint_{D_{xy}} d\\sigma \\int_{z_下(x,y)}^{z_上(x,y)} f(x,y,z) dz$$

**口诀**：先积 $z$（把 $x,y$ 当常数），再在投影区域上做二重积分。

---

**截面法（先二后一）**：
1. 用垂直于某轴的平面截区域
2. 先在截面上做二重积分
3. 再积该轴方向

**公式**：
$$\\iiint_\\Omega f dV = \\int_a^b dz \\iint_{D_z} f(x,y,z) d\\sigma$$

**什么时候用**：截面形状规则，二重积分好算。

---

### 方法二：柱坐标

**什么时候用？**
- 区域是圆柱体、旋转体
- 被积函数有 $x^2 + y^2$

**变换**：
$$x = r\\cos\\theta, \\quad y = r\\sin\\theta, \\quad z = z$$

**体积元素**（千万别忘！）：
$$dV = r \\, dr \\, d\\theta \\, dz$$

**注意**：跟极坐标一样，别丢了 $r$！

---

### 方法三：球坐标

**什么时候用？**
- 区域是球体、球壳、圆锥
- 被积函数有 $x^2 + y^2 + z^2$

**变换**：
$$x = r\\sin\\varphi\\cos\\theta, \\quad y = r\\sin\\varphi\\sin\\theta, \\quad z = r\\cos\\varphi$$

**三个角的意思**：
- $r$：到原点的距离
- $\\varphi$：和 $z$ 轴的夹角（从上往下，$0$ 到 $\\pi$）
- $\\theta$：在 $xy$ 平面上的方位角（$0$ 到 $2\\pi$）

**体积元素**（必须背下来！）：
$$dV = r^2 \\sin\\varphi \\, dr \\, d\\varphi \\, d\\theta$$

**⚠️ 致命错误**：忘了 $r^2\\sin\\varphi$！这是最容易丢分的点！

---

## 📊 常见区域（背下来）

| 区域 | 坐标系 | 积分限 |
|------|--------|--------|
| 球体 | 球坐标 | $r: 0\\to R$，$\\varphi: 0\\to\\pi$，$\\theta: 0\\to 2\\pi$ |
| 上半球 | 球坐标 | $r: 0\\to R$，$\\varphi: 0\\to\\frac{\\pi}{2}$，$\\theta: 0\\to 2\\pi$ |
| 圆柱体 | 柱坐标 | $r: 0\\to R$，$\\theta: 0\\to 2\\pi$，$z: z_1\\to z_2$ |
| 圆锥体 | 柱坐标 | $r: 0\\to kz$，$\\theta: 0\\to 2\\pi$，$z: 0\\to H$ |

---

## 🎓 对称性技巧

**区域关于坐标平面对称**：

| 对称面 | 被积函数 | 结果 |
|--------|----------|------|
| 关于 $xy$ 平面 | 关于 $z$ 奇函数 | = 0 |
| 关于 $xz$ 平面 | 关于 $y$ 奇函数 | = 0 |
| 关于 $yz$ 平面 | 关于 $x$ 奇函数 | = 0 |

**例子**：$\\iiint_\\Omega xyz dV$，$\\Omega$ 是球体 $x^2+y^2+z^2 \\leq R^2$

球体关于三个坐标面都对称，$xyz$ 关于每个变量都是奇函数。

**直接写答案**：积分 = 0！

---

## ⚠️ 三大误区

**误区1**：球坐标忘了 $r^2\\sin\\varphi$
- **记住**：$dV = r^2\\sin\\varphi dr d\\varphi d\\theta$，三项一个不能少！

**误区2**：角度范围搞错
- **记住**：$\\varphi$ 是 $0$ 到 $\\pi$（从北极到南极），$\\theta$ 是 $0$ 到 $2\\pi$（绕一圈）

**误区3**：坐标系选错
- **记住**：圆柱用柱坐标，球体用球坐标，别混了！

---

## 📝 解题四步法

**第一步：看形状**
- 圆柱形 → 柱坐标
- 球形 → 球坐标
- 一般形状 → 直角坐标

**第二步：定顺序**
- 投影法：先一后二
- 截面法：先二后一

**第三步：定积分限**
- 外层：常数
- 内层：函数

**第四步：计算检验**

---

## 🏆 典型例题

**例1**：求球体 $x^2+y^2+z^2 \\leq R^2$ 的体积。

**秒解**（球坐标）：
$$V = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi} d\\varphi \\int_0^R r^2 \\sin\\varphi dr = 2\\pi \\cdot 2 \\cdot \\frac{R^3}{3} = \\frac{4\\pi R^3}{3}$$

三行搞定球体积公式！

**例2**：半球体 $x^2+y^2+z^2 \\leq R^2, z \\geq 0$，密度 $\\rho = z$，求质量。

**秒解**（球坐标）：
$$M = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi/2} d\\varphi \\int_0^R (r\\cos\\varphi) r^2\\sin\\varphi dr = 2\\pi \\cdot \\frac{1}{2} \\cdot \\frac{R^4}{4} = \\frac{\\pi R^4}{4}$$`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 三重积分的本质

**一句话**：三重积分就是三维空间中的"求和"。

定积分是一维求和，二重积分是二维求和，三重积分是三维求和。

**物理意义**：
- $f = \\rho$ → 质量
- $f = 1$ → 体积
- $f = x, y, z$ → 质心
- $f = x^2, y^2, z^2$ → 转动惯量

---

## 💎 两种方法的本质

**投影法（先一后二）**：
- 本质：把三维问题降为二维+一维
- 适用：区域在某方向上"厚度"变化简单

**截面法（先二后一）**：
- 本质：先算切片，再累加
- 适用：截面形状规则`,
      extension: `## 📚 广义球坐标

椭球 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} \\leq 1$ 怎么办？

**变换**：$x = ar\\sin\\varphi\\cos\\theta$，$y = br\\sin\\varphi\\sin\\theta$，$z = cr\\cos\\varphi$

**体积元素**：$dV = abcr^2\\sin\\varphi dr d\\varphi d\\theta$

椭球就变成单位球了！

---

## 🚀 应用公式

**体积**：$V = \\iiint_\\Omega dV$

**质量**：$M = \\iiint_\\Omega \\rho dV$

**质心**：$\\bar{x} = \\frac{\\iiint_\\Omega x\\rho dV}{M}$

**转动惯量**：$I_x = \\iiint_\\Omega (y^2+z^2)\\rho dV$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '求球体体积',
        description: `**问题**：求半径为 $R$ 的球体体积。

**秒解**（球坐标）：
$$V = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi} d\\varphi \\int_0^R r^2 \\sin\\varphi dr = \\frac{4\\pi R^3}{3}$$

经典公式的推导！`,
        scenario: '验证球体积公式。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求物体质量',
        description: `**问题**：半球体，密度 $\\rho = z$，求质量。

**秒解**：
$$M = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi/2} d\\varphi \\int_0^R r\\cos\\varphi \\cdot r^2\\sin\\varphi dr = \\frac{\\pi R^4}{4}$$`,
        scenario: '变密度物体的质量计算。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '求质心',
        description: `**问题**：均匀半球体，求质心。

**分析**：由对称性，$\\bar{x} = \\bar{y} = 0$

**计算**：
$$\\bar{z} = \\frac{\\iiint_\\Omega z dV}{V} = \\frac{\\frac{\\pi R^4}{4}}{\\frac{2\\pi R^3}{3}} = \\frac{3R}{8}$$

**结论**：质心在圆心上方 $\\frac{3R}{8}$ 处。`,
        scenario: '质心计算的标准流程。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '看形状选坐标', 
        description: `**圆柱形** → 柱坐标
**球形** → 球坐标
**一般形状** → 直角坐标

**选对坐标系，题目就成功了一半！**`
      },
      { 
        number: 2, 
        title: '定积分顺序', 
        description: `**投影法**：先积一个变量，再积两个变量
**截面法**：先积两个变量，再积一个变量

**原则**：哪种让积分更简单，就选哪种！`
      },
      { 
        number: 3, 
        title: '记住体积元素', 
        description: `**柱坐标**：$dV = r dr d\\theta dz$（别丢 $r$）
**球坐标**：$dV = r^2\\sin\\varphi dr d\\varphi d\\theta$（别丢 $r^2\\sin\\varphi$）

**这是最容易丢分的地方！**`
      },
      { 
        number: 4, 
        title: '检验结果', 
        description: `- 体积应该 $> 0$
- 质心应该在物体内部
- 利用对称性检验`,
      },
    ],
  },
}

// 第一型曲线积分知识点（名师讲解版）
export const lineIntegralType1PointEnriched: KnowledgePoint = {
  id: 'line-integral-type1',
  moduleId: 'multivariable-integral',
  name: '第一型曲线积分',
  formula: '\\int_L f(x, y) \\, ds',
  coreSentence: '第一型曲线积分就是"沿曲线累加"——求曲线质量、弧长的标量积分，跟方向无关。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 50, step: 1, defaultValue: 15, label: '分段数 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '分割曲线',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=5，切5段', changes: { n: 5 } },
            { id: 's2', description: 'n=15，切15段', changes: { n: 15 } },
            { id: 's3', description: 'n=30，切30段', changes: { n: 30 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：第一型曲线积分是什么？

**第一型曲线积分 = 沿着曲线"累加"。**

定积分是在直线上累加，曲线积分是在弯线上累加。

就这么简单。

---

## 📐 物理意义（秒懂）

| 被积函数 | 积分结果 |
|----------|----------|
| 线密度 $\\rho(x,y)$ | 曲线总质量 |
| 1 | 曲线弧长 |
| $x$ 或 $y$ | 可求质心坐标 |

**最常用的**：$f = \\rho$ 求质量，$f = 1$ 求弧长。

---

## 🔑 核心特点：与方向无关！

这是第一型和第二型曲线积分最大的区别：

**第一型**：$\\int_L f ds = \\int_{-L} f ds$（正着走反着走都一样）

**第二型**：$\\int_L P dx + Q dy = -\\int_{-L} P dx + Q dy$（方向相反差负号）

**为什么？** 因为 $ds$（弧长）永远是正的，不管你往哪个方向走。

---

## 🔧 怎么算？

### 参数方程法

**曲线参数化**：$x = \\varphi(t)$，$y = \\psi(t)$，$\\alpha \\leq t \\leq \\beta$

**公式**：
$$\\int_L f(x,y) ds = \\int_\\alpha^\\beta f(\\varphi(t), \\psi(t)) \\sqrt{\\varphi'^2 + \\psi'^2} dt$$

**⚠️ 关键点**：
- 积分限必须从小到大（$\\alpha < \\beta$）
- 因为 $ds > 0$，弧长永远是正的

---

### 直角坐标法

**曲线方程**：$y = y(x)$，$a \\leq x \\leq b$

**公式**：
$$\\int_L f(x,y) ds = \\int_a^b f(x, y(x)) \\sqrt{1 + y'^2} dx$$

---

### 极坐标法

**曲线方程**：$r = r(\\theta)$，$\\alpha \\leq \\theta \\leq \\beta$

**公式**：
$$\\int_L f(x,y) ds = \\int_\\alpha^\\beta f(r\\cos\\theta, r\\sin\\theta) \\sqrt{r^2 + r'^2} d\\theta$$

---

## 📊 常见曲线参数化（背下来）

| 曲线 | 参数方程 | 参数范围 |
|------|----------|----------|
| 圆 | $x = R\\cos t$，$y = R\\sin t$ | $t \\in [0, 2\\pi]$ |
| 半圆（上） | $x = R\\cos t$，$y = R\\sin t$ | $t \\in [0, \\pi]$ |
| 直线段AB | $x = x_A + (x_B-x_A)t$ | $t \\in [0, 1]$ |
| 椭圆 | $x = a\\cos t$，$y = b\\sin t$ | $t \\in [0, 2\\pi]$ |
| 星形线 | $x = a\\cos^3 t$，$y = a\\sin^3 t$ | $t \\in [0, 2\\pi]$ |

---

## 🎓 对称性技巧

**曲线关于坐标轴对称**：

| 对称情况 | 被积函数 | 结果 |
|----------|----------|------|
| 关于x轴对称 | 关于y奇函数 | = 0 |
| 关于x轴对称 | 关于y偶函数 | = 2倍上半部分 |
| 关于y轴对称 | 关于x奇函数 | = 0 |
| 关于y轴对称 | 关于x偶函数 | = 2倍右半部分 |

---

## ⚠️ 三大误区

**误区1**：积分限从大到小
- **记住**：$ds > 0$，积分限必须从小到大！

**误区2**：忘了弧微分因子
- **记住**：$ds = \\sqrt{\\varphi'^2 + \\psi'^2} dt$，别忘开根号！

**误区3**：跟第二型搞混
- **记住**：第一型跟方向无关，第二型跟方向有关！

---

## 🏆 典型例题

**例1**：半圆弧 $x^2+y^2=R^2, y\\geq 0$，线密度 $\\rho = y$，求质量。

**秒解**：
参数化：$x = R\\cos t$，$y = R\\sin t$，$t \\in [0, \\pi]$

$$M = \\int_L y ds = \\int_0^\\pi R\\sin t \\cdot R dt = R^2 \\int_0^\\pi \\sin t dt = 2R^2$$

**例2**：求星形线 $x = a\\cos^3 t, y = a\\sin^3 t$ 的周长。

**秒解**：
$$s = 4\\int_0^{\\pi/2} \\sqrt{9a^2\\cos^4 t \\sin^2 t + 9a^2\\sin^4 t \\cos^2 t} dt = 6a$$

总周长 = $4 \\times 6a = 24a$`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**一句话**：第一型曲线积分 = 曲线上的"求和"。

定积分是直线上的求和，曲线积分是弯线上的求和。

**与定积分的关系**：当曲线是直线段时，第一型曲线积分就退化为定积分。

---

## 💎 空间曲线

对于空间曲线 $L: x=x(t), y=y(t), z=z(t)$：

$$\\int_L f(x,y,z) ds = \\int_\\alpha^\\beta f(x(t),y(t),z(t)) \\sqrt{x'^2+y'^2+z'^2} dt$$

**弧微分**：$ds = \\sqrt{x'^2+y'^2+z'^2} dt$`,
      extension: `## 🚀 应用公式

**弧长**：$s = \\int_L ds$

**质量**：$M = \\int_L \\rho ds$

**质心**：$\\bar{x} = \\frac{\\int_L x\\rho ds}{M}$，$\\bar{y} = \\frac{\\int_L y\\rho ds}{M}$

**转动惯量**：$I_x = \\int_L y^2\\rho ds$，$I_y = \\int_L x^2\\rho ds$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '求曲线质量',
        description: `**问题**：半圆弧，线密度 $\\rho = y$，求质量。

**秒解**：
$$M = \\int_L y ds = \\int_0^\\pi R\\sin t \\cdot R dt = 2R^2$$`,
        scenario: '曲线质量的标准计算。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求曲线弧长',
        description: `**问题**：求星形线周长。

**秒解**：
$$s = 4 \\times 6a = 24a$$

利用对称性，只算第一象限再乘4！`,
        scenario: '对称性简化计算。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '参数化曲线', 
        description: `**常见曲线参数化**：
- 圆：$x = R\\cos t$，$y = R\\sin t$
- 直线段：$x = x_A + (x_B-x_A)t$
- 抛物线：$x = t$，$y = t^2$

**参数范围要完全覆盖曲线！**`
      },
      { 
        number: 2, 
        title: '计算弧微分', 
        description: `**参数形式**：$ds = \\sqrt{\\varphi'^2 + \\psi'^2} dt$

**直角坐标**：$ds = \\sqrt{1+y'^2} dx$

**极坐标**：$ds = \\sqrt{r^2+r'^2} d\\theta$

**别忘开根号！**`
      },
      { 
        number: 3, 
        title: '代入算定积分', 
        description: `**注意**：
- 积分限从小到大
- 利用对称性简化

**检验**：结果应该 $\\geq 0$（因为 $ds > 0$）`,
      },
    ],
  },
}

// 第二型曲线积分知识点（名师讲解版）
export const lineIntegralType2PointEnriched: KnowledgePoint = {
  id: 'line-integral-type2',
  moduleId: 'multivariable-integral',
  name: '第二型曲线积分',
  formula: '\\int_L P dx + Q dy',
  coreSentence: '第二型曲线积分就是"沿曲线做功"——跟方向有关，是向量场积分的核心。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 50, step: 1, defaultValue: 15, label: '分段数 n' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：第二型曲线积分是什么？

**第二型曲线积分 = 变力沿曲线做功。**

这就是它的物理本质。一个力场 $\\vec{F} = (P, Q)$，沿着曲线 $L$ 走，做了多少功？

---

## 📐 物理意义（秒懂）

**变力做功**：
$$W = \\int_L \\vec{F} \\cdot d\\vec{r} = \\int_L P dx + Q dy$$

其中：
- $\\vec{F} = (P, Q)$ 是力场
- $d\\vec{r} = (dx, dy)$ 是位移微元
- $\\vec{F} \\cdot d\\vec{r}$ 是力在位移方向上的投影

---

## 🔑 核心特点：与方向有关！

这是第二型和第一型最大的区别：

**第二型**：$\\int_{-L} P dx + Q dy = -\\int_L P dx + Q dy$

**方向相反，结果差负号！**

**为什么？** 因为 $dx$, $dy$ 是有向投影，方向变了，投影就变号。

---

## 🔧 怎么算？

### 参数方程法

**曲线参数化**：$x = \\varphi(t)$，$y = \\psi(t)$

起点对应 $t = \\alpha$，终点对应 $t = \\beta$

**公式**：
$$\\int_L P dx + Q dy = \\int_\\alpha^\\beta [P\\varphi'(t) + Q\\psi'(t)] dt$$

**⚠️ 关键点**：
- 积分限从起点到终点（不必 $\\alpha < \\beta$）
- 方向由参数顺序决定

---

## 🔄 格林公式（神器！）

**公式**：
$$\\oint_L P dx + Q dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) d\\sigma$$

**条件**：
- $L$ 是封闭曲线（正向 = 逆时针）
- $P, Q$ 在 $D$ 上有连续偏导数

**威力**：把曲线积分变成二重积分！

---

## 🎓 格林公式的三大应用

### 应用1：计算闭曲线积分

**例子**：$\\oint_L (e^x\\sin y - 2y) dx + (e^x\\cos y - 2) dy$，$L$ 为正向圆周 $x^2+y^2=1$

**秒解**：
$$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = e^x\\cos y - (e^x\\cos y - 2) = 2$$

$$\\oint_L = \\iint_D 2 d\\sigma = 2\\pi$$

---

### 应用2：计算非闭曲线积分

**技巧**：补一条线使其封闭，用格林公式，再减去补的那段。

---

### 应用3：判断积分与路径无关

**条件**：$\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$（处处成立）

**结论**：积分只与起终点有关，与路径无关！

**应用**：可以选最简单的路径计算。

---

## ⚠️ 三大误区

**误区1**：格林公式方向搞反
- **记住**：正向 = 逆时针，负向 = 顺时针

**误区2**：积分限方向搞反
- **记住**：从起点到终点，不必从小到大

**误区3**：路径无关条件不满足
- **记住**：$\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$ 必须处处成立！

---

## 🏆 典型例题

**例1**：力场 $\\vec{F} = (y, -x)$，质点沿上半圆周从 $(1,0)$ 到 $(-1,0)$，求做功。

**秒解**：
参数化：$x = \\cos t$，$y = \\sin t$，$t: 0 \\to \\pi$

$$W = \\int_L y dx - x dy = \\int_0^\\pi [\\sin t(-\\sin t) - \\cos t(\\cos t)] dt = -\\int_0^\\pi 1 dt = -\\pi$$

**例2**：用格林公式计算 $\\oint_L (x^2+y^2) dx + 2xy dy$，$L$ 为正向圆周 $x^2+y^2=1$。

**秒解**：
$$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 2y - 2y = 0$$

**直接写答案**：积分 = 0！`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**一句话**：第二型曲线积分 = 向量场沿曲线的"投影累加"。

**物理意义**：变力做功、电场沿路径的积分、磁场沿路径的积分。

---

## 💎 与路径无关的等价条件

在单连通区域内，以下四条等价：

1. $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$（处处成立）
2. 沿任意闭曲线积分为零
3. 积分只与起终点有关
4. 存在势函数 $u$ 使得 $du = P dx + Q dy$

**应用**：如果满足条件，可以找势函数，用牛顿-莱布尼茨公式！`,
      extension: `## 📚 斯托克斯公式（空间曲线）

$$\\oint_\\Gamma P dx + Q dy + R dz = \\iint_\\Sigma (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}$$

**意义**：把空间曲线积分转化为曲面积分。

**连接**：连接了第一型曲面积分和第二型曲线积分。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算变力做功',
        description: `**问题**：力场 $\\vec{F} = (y, -x)$，沿上半圆周做功。

**秒解**：
$$W = \\int_L y dx - x dy = -\\pi$$`,
        scenario: '展示物理意义。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '格林公式简化计算',
        description: `**问题**：闭曲线积分，被积函数复杂。

**秒解**：用格林公式，转化为二重积分。

如果 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}$ 简单，就赚到了！`,
        scenario: '格林公式的威力。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断用格林公式', 
        description: `**适用**：
- 闭曲线积分
- 偏导数简单
- 非闭曲线可补成闭曲线

**不适用**：偏导数复杂，或区域有"洞"`,
      },
      { 
        number: 2, 
        title: '参数化曲线', 
        description: `**方向**：
- 逆时针为正方向
- 顺时针为负方向

**积分限**：从起点到终点`,
      },
      { 
        number: 3, 
        title: '检验路径无关', 
        description: `**条件**：$\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$

**如果满足**：
- 选最简单的路径
- 或找势函数`,
      },
    ],
  },
}

// 第一型曲面积分知识点（名师讲解版）
export const surfaceIntegralType1PointEnriched: KnowledgePoint = {
  id: 'surface-integral-type1',
  moduleId: 'multivariable-integral',
  name: '第一型曲面积分',
  formula: '\\iint_\\Sigma f(x, y, z) \\, dS',
  coreSentence: '第一型曲面积分就是"沿曲面累加"——求曲面质量、面积的标量积分，跟方向无关。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 4, max: 30, step: 1, defaultValue: 10, label: '分割数 n' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：第一型曲面积分是什么？

**第一型曲面积分 = 沿着曲面"累加"。**

二重积分是在平面上累加，曲面积分是在弯面上累加。

就这么简单。

---

## 📐 物理意义（秒懂）

| 被积函数 | 积分结果 |
|----------|----------|
| 面密度 $\\rho(x,y,z)$ | 曲面总质量 |
| 1 | 曲面面积 |
| $x$, $y$, $z$ | 可求质心坐标 |

**最常用的**：$f = \\rho$ 求质量，$f = 1$ 求面积。

---

## 🔑 核心特点：与方向无关！

**第一型**：标量积分，跟曲面法向量方向无关。

**第二型**：向量积分，跟曲面法向量方向有关。

---

## 🔧 怎么算？

### 投影法

**曲面方程**：$z = z(x,y)$，投影到 $xy$ 平面得区域 $D$

**公式**：
$$\\iint_\\Sigma f(x,y,z) dS = \\iint_D f(x,y,z(x,y)) \\sqrt{1 + z_x^2 + z_y^2} dx dy$$

**⚠️ 关键**：$\\sqrt{1 + z_x^2 + z_y^2}$ 是面积微元因子，千万别忘！

---

## 📊 常见曲面的面积微元（背下来）

| 曲面 | 方程 | $dS$ |
|------|------|------|
| 平面 | $ax+by+cz=d$ | $\\frac{\\sqrt{a^2+b^2+c^2}}{|c|}dxdy$ |
| 球面 | $x^2+y^2+z^2=R^2$ | $R^2\\sin\\varphi d\\varphi d\\theta$ |
| 柱面 | $x^2+y^2=R^2$ | $Rd\\theta dz$ |
| 旋转面 | $z=f(\\sqrt{x^2+y^2})$ | $\\sqrt{1+f'^2}rdrd\\theta$ |

---

## 🎓 对称性技巧

**曲面关于坐标平面对称**：

| 对称面 | 被积函数 | 结果 |
|--------|----------|------|
| 关于 $xy$ 平面 | 关于 $z$ 奇函数 | = 0 |
| 关于 $xz$ 平面 | 关于 $y$ 奇函数 | = 0 |
| 关于 $yz$ 平面 | 关于 $x$ 奇函数 | = 0 |

---

## ⚠️ 三大误区

**误区1**：忘了面积微元因子
- **记住**：$dS = \\sqrt{1 + z_x^2 + z_y^2} dx dy$

**误区2**：投影重叠没分段
- **记住**：如果投影有重叠，要分段积分！

**误区3**：跟第二型搞混
- **记住**：第一型是标量，第二型是向量！

---

## 🏆 典型例题

**例1**：求半径为 $R$ 的球面面积。

**秒解**（球坐标）：
$$S = \\int_0^{2\\pi} d\\theta \\int_0^\\pi R^2 \\sin\\varphi d\\varphi = 4\\pi R^2$$

三行搞定球面积公式！

**例2**：半球面 $x^2+y^2+z^2=1, z\\geq 0$，面密度 $\\rho = z$，求质量。

**秒解**：
$$M = \\iint_\\Sigma z dS = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi/2} \\cos\\varphi \\cdot \\sin\\varphi d\\varphi = \\pi$$`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**一句话**：第一型曲面积分 = 曲面上的"求和"。

二重积分是平面上的求和，曲面积分是曲面上的求和。

**与二重积分的关系**：当曲面是平面时，第一型曲面积分就退化为二重积分。

---

## 💎 球面和柱面的面积微元

**球面**（$r = R$）：
$$dS = R^2 \\sin\\varphi d\\varphi d\\theta$$

**柱面**（$r = R$）：
$$dS = R d\\theta dz$$

**推导**：用参数方程计算雅可比行列式。`,
      extension: `## 🚀 应用公式

**面积**：$S = \\iint_\\Sigma dS$

**质量**：$M = \\iint_\\Sigma \\rho dS$

**质心**：$\\bar{x} = \\frac{\\iint_\\Sigma x\\rho dS}{M}$

**转动惯量**：$I_x = \\iint_\\Sigma (y^2+z^2)\\rho dS$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '求球面面积',
        description: `**问题**：求半径为 $R$ 的球面面积。

**秒解**：
$$S = 4\\pi R^2$$

经典公式！`,
        scenario: '验证球面积公式。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求曲面质量',
        description: `**问题**：半球面，密度 $\\rho = z$，求质量。

**秒解**：
$$M = \\pi$$`,
        scenario: '变密度曲面的质量计算。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '确定曲面方程', 
        description: `**选择投影平面**：
- $z = z(x,y)$ → 投影到 $xy$ 平面
- $y = y(x,z)$ → 投影到 $xz$ 平面
- $x = x(y,z)$ → 投影到 $yz$ 平面

**原则**：投影区域简单，不重叠`,
      },
      { 
        number: 2, 
        title: '计算面积微元', 
        description: `**一般曲面**：$dS = \\sqrt{1 + z_x^2 + z_y^2} dx dy$

**球面**：$dS = R^2\\sin\\varphi d\\varphi d\\theta$

**柱面**：$dS = Rd\\theta dz$`,
      },
      { 
        number: 3, 
        title: '转化为二重积分', 
        description: `**注意**：
- 投影可能需要分段
- 利用对称性简化`,
      },
    ],
  },
}

// 第二型曲面积分知识点（名师讲解版）
export const surfaceIntegralType2PointEnriched: KnowledgePoint = {
  id: 'surface-integral-type2',
  moduleId: 'multivariable-integral',
  name: '第二型曲面积分',
  formula: '\\iint_\\Sigma P dy dz + Q dz dx + R dx dy',
  coreSentence: '第二型曲面积分就是"向量场穿过曲面的通量"——跟方向有关，是电磁学的核心工具。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 4, max: 30, step: 1, defaultValue: 10, label: '分割数 n' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：第二型曲面积分是什么？

**第二型曲面积分 = 向量场穿过曲面的通量。**

物理意义：流体穿过曲面的流量、电场穿过曲面的电通量、磁场穿过曲面的磁通量。

---

## 📐 物理意义（秒懂）

**通量公式**：
$$\\Phi = \\iint_\\Sigma \\vec{F} \\cdot d\\vec{S} = \\iint_\\Sigma \\vec{F} \\cdot \\vec{n} dS$$

其中：
- $\\vec{F} = (P, Q, R)$ 是向量场
- $\\vec{n}$ 是曲面单位法向量
- $\\vec{F} \\cdot \\vec{n}$ 是向量场在法向的投影

---

## 🔑 核心特点：与方向有关！

**第二型**：$\\iint_{-\\Sigma} = -\\iint_\\Sigma$

**方向相反，结果差负号！**

**曲面方向**：
- 封闭曲面：外侧为正方向
- 非封闭曲面：由法向量方向决定

---

## 🔧 怎么算？

### 投影法

**曲面方程**：$z = z(x,y)$

**公式**：
$$\\iint_\\Sigma R dx dy = \\pm \\iint_{D_{xy}} R(x,y,z(x,y)) dx dy$$

**正负号**：
- 上侧（法向量与 $z$ 轴正向成锐角）：取正
- 下侧：取负

---

## 🔄 高斯公式（神器！）

**公式**：
$$\\oiint_\\Sigma P dy dz + Q dz dx + R dx dy = \\iiint_\\Omega \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}\\right) dV$$

**条件**：
- $\\Sigma$ 是封闭曲面（外侧为正方向）
- $P, Q, R$ 有连续偏导数

**威力**：把曲面积分变成三重积分！

---

## 🎓 散度

**定义**：
$$\\text{div}\\vec{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}$$

**物理意义**：散度 = 源的强度

**高斯公式的意义**：通量 = 散度的体积分

---

## ⚠️ 三大误区

**误区1**：高斯公式方向搞反
- **记住**：外侧为正方向

**误区2**：投影正负号搞错
- **记住**：法向量与坐标轴正向成锐角取正

**误区3**：曲面不封闭乱用高斯
- **记住**：不封闭要补面，用完再减！

---

## 🏆 典型例题

**例1**：$\\vec{F} = (x, y, z)$ 穿出球面 $x^2+y^2+z^2=1$ 的通量。

**秒解**（高斯公式）：
$$\\text{div}\\vec{F} = 1+1+1 = 3$$

$$\\Phi = \\iiint_\\Omega 3 dV = 3 \\cdot \\frac{4\\pi}{3} = 4\\pi$$

**例2**：验证高斯电场定律。

**秒解**：
$$\\oiint_\\Sigma \\vec{E} \\cdot d\\vec{S} = \\frac{Q_{\\text{内}}}{\\varepsilon_0}$$

这是麦克斯韦方程组之一！`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**一句话**：第二型曲面积分 = 向量场穿过曲面的"流量"。

**物理意义**：
- 流速场 → 流量
- 电场 → 电通量
- 磁场 → 磁通量

---

## 💎 高斯公式的意义

**散度定理**：穿出封闭曲面的通量 = 内部散度的体积分。

**物理意义**：流出 = 内部产生`,
      extension: `## 📚 斯托克斯公式

$$\\oint_\\Gamma \\vec{F} \\cdot d\\vec{r} = \\iint_\\Sigma (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}$$

**意义**：把曲线积分转化为曲面积分。

**连接**：连接了第二型曲线积分和第二型曲面积分。

---

## 🚀 电磁学应用

**高斯电场定律**：
$$\\oiint_\\Sigma \\vec{E} \\cdot d\\vec{S} = \\frac{Q_{\\text{内}}}{\\varepsilon_0}$$

**高斯磁场定律**：
$$\\oiint_\\Sigma \\vec{B} \\cdot d\\vec{S} = 0$$

**法拉第定律**：
$$\\oint_\\Gamma \\vec{E} \\cdot d\\vec{r} = -\\frac{d\\Phi_B}{dt}$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'research',
        title: '高斯公式计算通量',
        description: `**问题**：$\\vec{F} = (x, y, z)$ 穿出球面的通量。

**秒解**：
$$\\Phi = 4\\pi$$

用高斯公式，三行搞定！`,
        scenario: '高斯公式的威力。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '电磁场应用',
        description: `**高斯定律**：穿过封闭曲面的电通量 = 内部电荷/$\\varepsilon_0$

**连续性方程**：流出封闭曲面的电流 = 内部电荷减少率

这些都是麦克斯韦方程组的核心内容！`,
        scenario: '电磁学核心定律。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断用高斯公式', 
        description: `**适用**：
- 封闭曲面
- 散度简单
- 非封闭可补成封闭

**不适用**：散度复杂，或区域有"洞"`,
      },
      { 
        number: 2, 
        title: '确定曲面方向', 
        description: `**封闭曲面**：外侧为正

**非封闭曲面**：
- 上侧/下侧：法向量与 $z$ 轴夹角
- 前侧/后侧：法向量与 $x$ 轴夹角`,
      },
      { 
        number: 3, 
        title: '投影计算', 
        description: `**公式**：$\\iint_\\Sigma R dx dy = \\pm \\iint_D R dx dy$

**正负**：由曲面方向决定

**补面技巧**：非封闭可补面，用高斯公式后减去`,
      },
    ],
  },
}

// 导出所有名师版知识点
export const multivariableIntegralPointsEnriched = {
  doubleIntegral: doubleIntegralPointEnriched,
  tripleIntegral: tripleIntegralPointEnriched,
  lineIntegralType1: lineIntegralType1PointEnriched,
  lineIntegralType2: lineIntegralType2PointEnriched,
  surfaceIntegralType1: surfaceIntegralType1PointEnriched,
  surfaceIntegralType2: surfaceIntegralType2PointEnriched,
}
