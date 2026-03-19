import { KnowledgeModule, KnowledgePoint } from '@/types'

// 数列极限知识点
const sequenceLimitPoint: KnowledgePoint = {
  id: 'sequence-limit',
  moduleId: 'limits',
  name: '数列极限',
  formula: '\\lim_{n \\to \\infty} x_n = A',
  coreSentence: '数列极限就是"无限趋近但不要求相等"——无论你要求离目标多近，总能找到一个起点，从这里往后都满足你的要求。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1 + 1/x', color: '#D4A574', visible: true },
        ],
        points: [
          { id: 'p1', x: 'n', y: '1 + 1/n', draggable: false, color: '#C62828', label: 'x_n' },
          { id: 'p2', x: 'n', y: '1', draggable: false, color: '#5D4037', label: 'A=1' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 1, max: 100, step: 1, defaultValue: 10, label: '项数 n' },
          { id: 'epsilon', name: 'epsilon', min: 0.01, max: 1, step: 0.01, defaultValue: 0.1, label: 'ε 阈值' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '逼近过程',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: '初始状态：n=1, x₁=2，距离目标较远', changes: { n: 1 } },
            { id: 's2', description: 'n=5, x₅=1.2，开始接近', changes: { n: 5 } },
            { id: 's3', description: 'n=10, x₁₀=1.1，更接近了', changes: { n: 10 } },
            { id: 's4', description: 'n=20, x₂₀=1.05，已经很近', changes: { n: 20 } },
            { id: 's5', description: 'n=50, x₅₀=1.02，几乎重合', changes: { n: 50 } },
            { id: 's6', description: 'n=100, x₁₀₀=1.01，极限逼近', changes: { n: 100 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：用"有限"描述"无限"**

数列极限是高等数学的第一道门槛。它解决了一个看似不可能的问题：如何用有限的步骤，描述无限的过程？

答案就是著名的 **ε-N 语言**。

---

**📐 数学定义（ε-N 语言）**

对于数列 {xₙ}，如果存在常数 A，对于**任意给定的正数 ε**（无论多小），**总存在正整数 N**，使得当 **n > N** 时，**|xₙ - A| < ε** 恒成立，则称 A 为数列 {xₙ} 的极限，记作：

$$\\lim_{n \\to \\infty} x_n = A$$

---

**🎭 直观理解：射击比赛的比喻**

想象一个射击比赛：
- **目标靶心** = 极限值 A
- **弹孔位置** = 数列项 xₙ
- **你的要求** = ε（允许的误差范围）
- **射手状态** = 数列的性质

极限存在的含义：**无论裁判把ε设得多小（要求多严格），射手总能找到一个时刻N，从这之后每一枪都命中ε范围内。**

这是一个"承诺"问题：射手能否承诺"从某时刻起，永不失手"？

**例子：数列 xₙ = 1 + 1/n，极限 A = 1**

| ε（要求） | N（转折点） | 验证 |
|---------|-----------|------|
| 0.1 | N=10 | n>10时，1/n<0.1 ✓ |
| 0.01 | N=100 | n>100时，1/n<0.01 ✓ |
| 0.001 | N=1000 | n>1000时，1/n<0.001 ✓ |
| 任意ε | N=⌈1/ε⌉ | n>N时，1/n<ε ✓ |

---

**🧩 关键要点的深度解读**

**1. ε 的任意性（"你说了算"）**

ε 是"挑战者"提出的精度要求。极限定义中，ε 可以**任意小**，这体现了"无限逼近"的要求。

- ε=0.1 → 粗略要求
- ε=0.0001 → 精细要求
- ε→0 → 极限意义

**误区提醒**：ε 不是"无穷小量"，而是一个**固定的正数**。"任意"强调的是"对所有可能的ε都要成立"。

**2. N 的存在性（"我能做到"）**

N 是"应答者"给出的承诺起点。对于每个ε，都要能找到对应的N。

**关键**：N 依赖于 ε（记作 N(ε)），ε 越小，N 通常越大。

**3. 极限的唯一性**

**定理**：如果数列收敛，则极限唯一。

**证明思路**（反证法）：
假设 A₁ ≠ A₂ 都是极限，取 ε = |A₁-A₂|/2 > 0，则存在 N₁、N₂ 使得：
- n > N₁ 时，|xₙ - A₁| < ε
- n > N₂ 时，|xₙ - A₂| < ε

取 N = max(N₁, N₂)，则：
|xₙ - A₁| < ε 且 |xₙ - A₂| < ε

由三角不等式：|A₁ - A₂| ≤ |xₙ - A₁| + |xₙ - A₂| < 2ε = |A₁ - A₂|，矛盾！

**4. 有界性定理**

**定理**：收敛数列必有界。

**直观理解**：既然数列最终"安定"在极限附近，那么它就不可能"跑飞"。

**证明**：
取 ε = 1，存在 N，当 n > N 时，|xₙ - A| < 1，即 |xₙ| < |A| + 1。
令 M = max{|x₁|, |x₂|, ..., |xₙ|, |A|+1}，则对所有 n，|xₙ| ≤ M。

---

**⚠️ 常见误区**

**误区1**："极限就是数列最终达到的值"
- **纠正**：极限是"无限逼近"，数列可能永远不会"达到"极限值
- **例子**：xₙ = 1/n，极限是0，但没有任何一项等于0

**误区2**："N越大越好"
- **纠正**：N 是一个"门槛"，只要存在即可，不需要最小
- **技巧**：找N时可以放缩，找到更大的N也行

**误区3**："收敛数列单调"
- **纠正**：收敛数列可以振荡收敛
- **例子**：xₙ = (-1)ⁿ/n，振荡但收敛于0`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    
    extension: {
      essence: `**🔮 核心内涵：从"静态"到"动态"的思维跃迁**

数列极限体现了高等数学与初等数学的根本区别：

| 初等数学 | 高等数学 |
|---------|---------|
| 静态的、有限的 | 动态的、无限的 |
| "是什么" | "趋向什么" |
| 精确相等 | 无限逼近 |
| 结果导向 | 过程导向 |

**"ε-N 语言"的哲学智慧**

这是人类第一次用**有限的逻辑**精确描述了**无限的过程**。

ε 代表"挑战"：你要求多精确？
N 代表"承诺"：我能做到！
极限代表"境界"：永远达不到，但无限接近。

这种思想贯穿整个微积分：
- 函数极限 → ε-δ 语言
- 积分 → 黎曼和的极限
- 级数收敛 → 部分和的极限

---

**📚 收敛数列的核心性质**

**性质1：唯一性**
若数列收敛，则极限唯一。

**性质2：有界性**
收敛数列必有界。（但注意：有界不一定收敛，如 (-1)ⁿ）

**性质3：保号性**
若 lim xₙ = A > 0，则存在 N，当 n > N 时，xₙ > 0。
*（反之：若 xₙ ≥ 0 且极限存在，则 lim xₙ ≥ 0）*

**性质4：保不等式**
若 xₙ ≤ yₙ（n充分大后），且两数列都收敛，则 lim xₙ ≤ lim yₙ。

**性质5：夹逼性**
若 yₙ ≤ xₙ ≤ zₙ，且 lim yₙ = lim zₙ = A，则 lim xₙ = A。
*这是证明极限存在的有力工具！*

---

**🔬 子列定理**

**定义**：从数列中选取无穷多项，保持原有顺序，得到子列 {xₙₖ}。

**定理**：
1. 若数列收敛于A，则其任何子列都收敛于A
2. 若数列有两个子列收敛于不同值，则原数列发散
3. 若奇子列和偶子列都收敛于A，则原数列收敛于A

**应用**：证明 (-1)ⁿ 发散
- 奇子列：x₁, x₃, x₅, ... = -1, -1, -1, ... → -1
- 偶子列：x₂, x₄, x₆, ... = 1, 1, 1, ... → 1
- 两子列极限不同，故原数列发散`,
      extension: `**🚀 从数列极限到函数极限**

数列是"离散"的极限，函数是"连续"的极限。

| 数列极限 | 函数极限 |
|---------|---------|
| n → ∞ | x → x₀ 或 x → ∞ |
| ε-N 语言 | ε-δ 语言 |
| 下标趋向无穷 | 自变量趋向某点/无穷 |

**函数极限的 ε-δ 定义**：

$$\\lim_{x \\to x_0} f(x) = A \\Leftrightarrow \\forall \\varepsilon > 0, \\exists \\delta > 0, 0 < |x - x_0| < \\delta \\Rightarrow |f(x) - A| < \\varepsilon$$

两者本质相同：都是用"有限"描述"无限"，用"静态"逼近"动态"。

---

**📐 重要极限定理**

**1. 单调有界原理**

**定理**：单调有界数列必收敛。

- 单调递增 + 有上界 → 收敛
- 单调递减 + 有下界 → 收敛

**应用**：证明数列 xₙ = (1+1/n)ⁿ 收敛
- 证明单调递增（利用伯努利不等式）
- 证明有上界（证明 xₙ < 3）
- 由单调有界原理，极限存在，记为 e

**2. 柯西收敛准则**

**定理**：数列收敛 ⟺ ∀ε>0，∃N，当 m,n>N 时，|xₘ - xₙ| < ε。

**意义**：这是判断收敛的"内在标准"——不需要知道极限值是什么！

---

**🎓 计算极限的常用方法**

**方法1：直接代入法**
适用于连续函数，如 lim(n→∞) (n²+1)/(2n²+3) = 1/2

**方法2：分子分母同除最高次幂**
$$\\lim_{n \\to \\infty} \\frac{2n^3 + 3n}{n^3 + 1} = \\lim_{n \\to \\infty} \\frac{2 + 3/n^2}{1 + 1/n^3} = 2$$

**方法3：有理化**
$$\\lim_{n \\to \\infty} (\\sqrt{n+1} - \\sqrt{n}) = \\lim_{n \\to \\infty} \\frac{1}{\\sqrt{n+1} + \\sqrt{n}} = 0$$

**方法4：等价无穷小**
$$\\lim_{n \\to \\infty} n \\cdot \\sin\\frac{1}{n} = \\lim_{n \\to \\infty} n \\cdot \\frac{1}{n} = 1$$
*（当 x→0 时，sin x ~ x）*

**方法5：夹逼定理**
证明 lim(n→∞) sin(1/n) = 0：
- -1 ≤ sin(1/n) ≤ 1
- 实际上用 |sin(1/n)| ≤ |1/n| → 0

---

**🌟 两个重要极限**

**重要极限1**：
$$\\lim_{n \\to \\infty} (1 + \\frac{1}{n})^n = e \\approx 2.71828...$$

**重要极限2**：
$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$

这两个极限是推导导数公式的基础！`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '银行复利计算 - 连续复利模型',
        description: `**问题描述**

本金 P，年利率 r，每年复利 n 次。当复利次数趋于无穷时，本利和为多少？

**数学建模**

每次复利周期利率为 r/n，一年后的本利和：
$$S_n = P(1 + \\frac{r}{n})^n$$

当 n → ∞ 时：
$$\\lim_{n \\to \\infty} P(1 + \\frac{r}{n})^n = Pe^r$$

**实际意义**

这给出了"连续复利"的理论基础，是金融工程的重要模型。`,
        scenario: '调整 n 从 1（年复利）到 365（日复利）到无穷，观察本利和逼近 Pe^r 的过程。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '牛顿迭代法 - 数值求解方程根',
        description: `**问题描述**

求方程 f(x) = 0 的根。

**算法思想**

从初始点 x₀ 出发，构造迭代序列：
$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}$$

在一定条件下，{xₙ} 收敛于方程的根。

**收敛性分析**

若 f 在根附近二阶可微且 f'(根) ≠ 0，则牛顿法二阶收敛：
$$|x_{n+1} - \\alpha| \\leq C|x_n - \\alpha|^2$$`,
        scenario: '设置方程 f(x) = x² - 2，观察迭代序列收敛于 √2 的过程。',
      },
      {
        id: 'app3',
        type: 'real',
        title: '芝诺悖论 - 阿基里斯与乌龟',
        description: `**经典悖论**

阿基里斯追乌龟，每次到达乌龟前一位置时，乌龟又前进了一段。他永远追不上乌龟吗？

**数学解释**

设阿基里斯速度 v，乌龟速度 u < v，初始距离 d。

第n段路程：dₙ = d·(u/v)ⁿ⁻¹

总路程：$$S = \\sum_{n=1}^{\\infty} d_n = d \\cdot \\frac{1}{1-u/v} = \\frac{dv}{v-u}$$

有限的距离！悖论破解。`,
        scenario: '可视化展示无限级数求和得到有限值的过程。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断趋势 - 画图观察', 
        description: `画出数列前 20-50 项的散点图，观察变化趋势：
- 趋于稳定值 → 可能收敛
- 持续增大/减小 → 可能发散
- 振荡不衰减 → 发散`
      },
      { 
        number: 2, 
        title: '验证定义 - 找 N 对应 ε', 
        description: `对于给定的 $\\varepsilon$，找满足条件的 N：
1. 解不等式 $|x_n - A| < \\varepsilon$
2. 求出 n 的范围
3. 取 N 为满足条件的最小正整数`
      },
      { 
        number: 3, 
        title: '利用性质定理', 
        description: `收敛数列的判定：
- 单调有界 → 必收敛
- 夹逼定理 → 三明治法
- 子列收敛 → 所有子列极限相同

发散判定：
- 无界 → 发散
- 存在发散子列 → 发散`
      },
    ],
  },
}

// 函数极限知识点
const functionLimitPoint: KnowledgePoint = {
  id: 'function-limit',
  moduleId: 'limits',
  name: '函数极限',
  formula: '\\lim_{x \\to x_0} f(x) = A',
  coreSentence: '函数极限是"自变量无限逼近某点时函数值的终极趋势"——无论x从哪边靠近x₀，f(x)都会无限逼近A。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'sin(x)/x', color: '#D4A574', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'x', name: 'x', min: -3, max: 3, step: 0.01, defaultValue: 1, label: 'x 值' },
          { id: 'delta', name: 'delta', min: 0.05, max: 2, step: 0.01, defaultValue: 0.5, label: 'δ 邻域' },
          { id: 'epsilon', name: 'epsilon', min: 0.05, max: 1, step: 0.01, defaultValue: 0.2, label: 'ε 精度' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '逼近过程',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: 'x从远处接近，f(x)接近极限值', changes: { x: 2, delta: 0.8 } },
            { id: 's2', description: 'x继续靠近x₀=0', changes: { x: 1, delta: 0.5 } },
            { id: 's3', description: 'x更近，f(x)更接近1', changes: { x: 0.5, delta: 0.3 } },
            { id: 's4', description: 'x接近0，f(x)≈1', changes: { x: 0.1, delta: 0.15 } },
            { id: 's5', description: '极限状态：x→0，f(x)→1', changes: { x: 0.01, delta: 0.05, epsilon: 0.1 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：从离散到连续**

函数极限是数列极限的自然延伸。当自变量 x 无限接近某个值 x₀ 时，函数值 f(x) 会无限接近一个确定的数 A。

---

**📐 ε-δ 语言（精确描述）**

$$\\lim_{x \\to x_0} f(x) = A \\Leftrightarrow \\forall \\varepsilon > 0, \\exists \\delta > 0, 0 < |x - x_0| < \\delta \\Rightarrow |f(x) - A| < \\varepsilon$$

**直观理解**：
- 你给我任意一个"精度要求"ε
- 我总能找到一个"接近范围"δ
- 只要 x 在 x₀ 的 δ 范围内（但不等于 x₀）
- f(x) 就一定落在 A 的 ε 范围内

---

**📐 左极限与右极限**

**左极限**：$\\lim_{x \\to x_0^-} f(x) = A$，x 从左边靠近 x₀

**右极限**：$\\lim_{x \\to x_0^+} f(x) = A$，x 从右边靠近 x₀

**极限存在的充要条件**：
$$\\lim_{x \\to x_0} f(x) \\text{ 存在} \\Leftrightarrow \\lim_{x \\to x_0^-} f(x) = \\lim_{x \\to x_0^+} f(x)$$

---

**📐 无穷远处的极限**

- $\\lim_{x \\to +\\infty} f(x) = A$：x 趋向正无穷
- $\\lim_{x \\to -\\infty} f(x) = A$：x 趋向负无穷

**ε-X 语言**：
$$\\lim_{x \\to +\\infty} f(x) = A \\Leftrightarrow \\forall \\varepsilon > 0, \\exists X > 0, x > X \\Rightarrow |f(x) - A| < \\varepsilon$$

---

**⚠️ 常见误区**

**误区1**："极限就是函数值"
- **纠正**：极限是趋势，函数在 x₀ 处可以无定义或值不同
- **例子**：$\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1$，但函数在 x=0 无定义

**误区2**："x 从两边靠近必须相等"
- **纠正**：单侧极限可以不等，此时极限不存在`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：动态逼近**

函数极限的本质是**动态逼近**——关注的是"趋势"而非"结果"。

| 初等数学 | 高等数学 |
|---------|---------|
| 静态：f(x₀) = ? | 动态：lim f(x) = ? |
| 精确相等 | 无限逼近 |
| 点的值 | 趋势值 |

**极限与函数值的关系**：
- 极限存在 ≠ 函数有定义
- 极限存在 ≠ 极限等于函数值
- 极限存在 ⟹ 函数在该点附近有界

---

**🎓 海涅定理（归结原则）**

函数极限与数列极限的桥梁：

$$\\lim_{x \\to x_0} f(x) = A \\Leftrightarrow \\forall \\{x_n\\}, x_n \\to x_0, x_n \\neq x_0, \\lim_{n \\to \\infty} f(x_n) = A$$

**应用**：用数列极限判断函数极限不存在（找两个不同极限的子列）`,
      extension: `**🚀 极限的性质**

**唯一性**：若极限存在，则极限唯一

**局部有界性**：若 $\\lim f(x) = A$，则 f(x) 在 x₀ 附近有界

**局部保号性**：若 $\\lim f(x) = A > 0$，则存在 δ > 0，当 $0 < |x - x_0| < \\delta$ 时 $f(x) > 0$

---

**📐 极限运算法则**

设 $\\lim f(x) = A, \\lim g(x) = B$，则：

| 运算 | 公式 |
|-----|------|
| 加法 | $\\lim(f + g) = A + B$ |
| 减法 | $\\lim(f - g) = A - B$ |
| 乘法 | $\\lim(f \\cdot g) = A \\cdot B$ |
| 除法 | $\\lim(f/g) = A/B$（B ≠ 0）|
| 复合 | $\\lim f[g(x)] = f[\\lim g(x)]$（f 连续）|

---

**🌟 两个重要极限**

1. $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$

2. $\\lim_{x \\to 0} (1 + x)^{\\frac{1}{x}} = e$

这两个极限是推导其他极限的基础！`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '瞬时速度的计算',
        description: `**物理背景**

物体运动路程函数 s(t)，求 t₀ 时刻的瞬时速度。

**数学建模**

平均速度：$\\bar{v} = \\frac{s(t_0 + \\Delta t) - s(t_0)}{\\Delta t}$

瞬时速度：
$$v(t_0) = \\lim_{\\Delta t \\to 0} \\frac{s(t_0 + \\Delta t) - s(t_0)}{\\Delta t}$$

**例子**：自由落体 $s = \\frac{1}{2}gt^2$，则 $v(t) = gt$`,
        scenario: '可视化展示平均速度趋近瞬时速度的过程。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '药物浓度变化率',
        description: `**医学背景**

血液中药物浓度 C(t)，求某时刻的浓度变化率。

**数学建模**

平均变化率：$\\frac{\\Delta C}{\\Delta t}$

瞬时变化率：$\\lim_{\\Delta t \\to 0} \\frac{\\Delta C}{\\Delta t}$

**应用**：确定药物代谢速度，指导给药间隔。`,
        scenario: '展示药物浓度曲线及变化率。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '渐近线求解',
        description: `**几何背景**

曲线的渐近线描述函数在无穷远处的行为。

**三类渐近线**

1. **水平渐近线**：$y = A$，其中 $\\lim_{x \\to \\infty} f(x) = A$

2. **垂直渐近线**：$x = x_0$，其中 $\\lim_{x \\to x_0} f(x) = \\infty$

3. **斜渐近线**：$y = kx + b$，其中 $k = \\lim_{x \\to \\infty}\\frac{f(x)}{x}$，$b = \\lim_{x \\to \\infty}[f(x) - kx]$

**例子**：$y = \\frac{x^2}{x-1}$ 的斜渐近线为 $y = x + 1$`,
        scenario: '可视化展示曲线与渐近线的关系。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断极限类型', 
        description: `观察极限形式，确定类型：
- 确定式：直接代入
- 0/0 型：约分、洛必达、等价无穷小
- ∞/∞ 型：抓大头、洛必达
- 1^∞ 型：用重要极限或取对数`
      },
      { 
        number: 2, 
        title: '选择计算方法', 
        description: `根据类型选择方法：
- 约分消去零因子
- 有理化（根式）
- 等价无穷小替换
- 洛必达法则
- 泰勒展开`
      },
      { 
        number: 3, 
        title: '验证结果', 
        description: `计算完成后验证：
1. 结果是否合理（符号、数量级）
2. 左右极限是否相等
3. 代入检验是否正确`
      },
    ],
  },
}

// 无穷小与无穷大知识点
const infinitesimalPoint: KnowledgePoint = {
  id: 'infinitesimal',
  moduleId: 'limits',
  name: '无穷小与无穷大',
  formula: '\\lim f(x) = 0 \\quad \\text{(无穷小)}',
  coreSentence: '无穷小是"极限为零的变量"——不是"很小的数"，而是一个趋于零的过程。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x', color: '#C62828', visible: true },
          { id: 'f2', expression: 'x^2', color: '#1565C0', visible: true },
          { id: 'f3', expression: 'x^3', color: '#558B2F', visible: true },
        ],
        points: [],
        sliders: [
          { id: 't', name: 't', min: 0.01, max: 2, step: 0.01, defaultValue: 0.5, label: 'x 值' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '无穷小比较',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: 'x=1时，三个无穷小有差异', changes: { t: 1 } },
            { id: 's2', description: 'x=0.5时，高阶无穷小变小', changes: { t: 0.5 } },
            { id: 's3', description: 'x=0.1时，高阶无穷小更小', changes: { t: 0.1 } },
            { id: 's4', description: 'x=0.01时，差距明显', changes: { t: 0.01 } },
            { id: 's5', description: 'x→0，高阶趋零更快', changes: { t: 0.001 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心概念：不是"小数"，是"趋零过程"**

无穷小和无穷大是极限理论中的重要概念，它们描述的是变量的变化趋势，而不是固定的数值。

---

**📐 无穷小的定义**

若 $\\lim f(x) = 0$，则称 f(x) 为该极限过程中的**无穷小**。

**注意**：
- 无穷小不是"很小的数"
- 无穷小是一个**变量**，其极限为零
- 0 是唯一的"常数无穷小"

**例子**：
- $x \\to 0$ 时，x、sin x、tan x 都是无穷小
- $x \\to \\infty$ 时，$\\frac{1}{x}$ 是无穷小

---

**📐 无穷大的定义**

若 $\\lim |f(x)| = +\\infty$，则称 f(x) 为该极限过程中的**无穷大**。

**注意**：
- 无穷大不是"很大的数"
- 无穷大是一个**变量**，其绝对值无限增大

**例子**：
- $x \\to 0$ 时，$\\frac{1}{x}$ 是无穷大
- $x \\to +\\infty$ 时，$x^2$ 是无穷大

---

**📐 无穷小与无穷大的关系**

$$f(x) \\to \\infty \\Leftrightarrow \\frac{1}{f(x)} \\to 0$$

$$f(x) \\to 0 (f \\neq 0) \\Leftrightarrow \\frac{1}{f(x)} \\to \\infty$$

**口诀**：无穷大的倒数是无穷小，非零无穷小的倒数是无穷大。

---

**📐 无穷小的比较**

设 $\\alpha, \\beta$ 都是无穷小，比较 $\\lim\\frac{\\alpha}{\\beta}$：

| 极限值 | 关系 | 含义 |
|-------|------|------|
| 0 | 高阶无穷小 | α 比 β 趋零更快 |
| $c \\neq 0$ | 同阶无穷小 | α、β 趋零速度相近 |
| 1 | 等价无穷小 | α∼β，趋零速度相同 |
| ∞ | 低阶无穷小 | α 比 β 趋零更慢 |

---

**📐 常用等价无穷小**

当 $x \\to 0$ 时：

| 公式 | 记忆技巧 |
|-----|---------|
| $\\sin x \\sim x$ | sin 小角≈角 |
| $\\tan x \\sim x$ | tan 小角≈角 |
| $\\arcsin x \\sim x$ | 反函数同理 |
| $\\arctan x \\sim x$ | 反函数同理 |
| $\\ln(1+x) \\sim x$ | ln 近似展开 |
| $e^x - 1 \\sim x$ | 指数近似 |
| $1 - \\cos x \\sim \\frac{x^2}{2}$ | 余弦二阶展开 |
| $(1+x)^\\alpha - 1 \\sim \\alpha x$ | 幂函数近似 |`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：量级的概念**

无穷小的比较本质上是**量级**的比较。就像比较速度：
- 跑得快的比跑得慢的先到达终点
- 高阶无穷小比低阶无穷小更快趋近零

**阶的意义**：
- 高阶无穷小 = 更小量级（可忽略）
- 低阶无穷小 = 更大量级（主导）
- 同阶无穷小 = 同一量级

---

**🎓 无穷小的运算法则**

1. **有限个无穷小的和**仍是无穷小
2. **无穷小×有界量**仍是无穷小
3. **无穷小×无穷小**是高阶无穷小

**注意**：无穷个无穷小的和不一定是无穷小！`,
      extension: `**🚀 高阶无穷小的记号**

$\\alpha = o(\\beta)$ 表示 $\\alpha$ 是比 $\\beta$ 高阶的无穷小，即：
$$\\lim\\frac{\\alpha}{\\beta} = 0$$

**应用**：泰勒公式中的余项 $o(x^n)$ 表示比 $x^n$ 高阶的无穷小。

---

**📐 等价无穷小替换法则**

在乘除运算中，可以用等价无穷小替换：

$$\\lim\\frac{f(x) \\cdot \\alpha}{g(x)} = \\lim\\frac{f(x) \\cdot \\beta}{g(x)} \\quad (\\alpha \\sim \\beta)$$

**注意**：
- 只能用于乘除
- 不能用于加减
- 替换后需验证极限存在

**错误例子**：
$$\\lim_{x \\to 0}\\frac{\\tan x - \\sin x}{x^3} \\neq \\lim_{x \\to 0}\\frac{x - x}{x^3} = 0$$

正确做法：
$$\\lim_{x \\to 0}\\frac{\\tan x - \\sin x}{x^3} = \\lim_{x \\to 0}\\frac{\\sin x(\\frac{1}{\\cos x} - 1)}{x^3} = \\lim_{x \\to 0}\\frac{x \\cdot \\frac{x^2}{2}}{x^3} = \\frac{1}{2}$$

---

**🌟 无穷大的运算规则**

| 运算 | 结果 |
|-----|------|
| ∞ + ∞ | ∞ |
| ∞ - ∞ | 未定式 |
| ∞ × ∞ | ∞ |
| ∞ ÷ 有界量 | ∞ |
| 有界量 ÷ ∞ | 0 |`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '误差估计',
        description: `**工程背景**

测量值与真实值之间的误差往往是无穷小量。

**数学建模**

设真实值为 A，测量值为 a，误差 $\\varepsilon = a - A$ 是无穷小。

**相对误差**：
$$\\frac{|\\varepsilon|}{|A|}$$

**应用等价无穷小**：当误差很小时，可用等价无穷小简化计算。

**例子**：$\\sin\\theta \\approx \\theta$（当 θ 很小时）用于工程近似。`,
        scenario: '展示小角度近似在工程中的应用。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '数值分析中的收敛速度',
        description: `**算法背景**

迭代算法产生序列 $\\{x_n\\}$ 收敛到 $x^*$，误差 $e_n = x_n - x^*$ 是无穷小。

**收敛速度的比较**

若 $\\lim_{n \\to \\infty}\\frac{|e_{n+1}|}{|e_n|^p} = c$，则称收敛阶为 p。

| 收敛阶 | 含义 |
|-------|------|
| p = 1 | 线性收敛 |
| p = 2 | 二次收敛（更快）|
| p > 2 | 超线性收敛 |

**例子**：牛顿法是二次收敛，二分法是线性收敛。`,
        scenario: '可视化展示不同收敛速度的差异。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '识别无穷小阶数', 
        description: `常见无穷小的阶（x→0时）：
- $x$：一阶
- $x^2$：二阶
- $\\sin x, \\tan x$：一阶
- $1 - \\cos x$：二阶
- $\\ln(1+x)$：一阶`
      },
      { 
        number: 2, 
        title: '等价无穷小替换', 
        description: `步骤：
1. 识别极限中的无穷小因子
2. 用等价无穷小替换
3. 简化计算

注意：只在乘除中使用！`
      },
      { 
        number: 3, 
        title: '比较无穷小阶数', 
        description: `方法：计算两个无穷小的比值极限
- 极限为0 → 分子是高阶无穷小
- 极限为非零常数 → 同阶
- 极限为无穷 → 分子是低阶无穷小`
      },
    ],
  },
}

// 函数连续性知识点
const continuityPoint: KnowledgePoint = {
  id: 'continuity',
  moduleId: 'limits',
  name: '函数的连续性',
  formula: '\\lim_{x \\to x_0} f(x) = f(x_0)',
  coreSentence: '连续就是"不断开"——图像可以一笔画完，没有跳跃，没有断点。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2+1 (x>=0)', color: '#C62828', visible: true },
          { id: 'f2', expression: 'x-1 (x<0)', color: '#1565C0', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'x', name: 'x', min: -4, max: 4, step: 0.01, defaultValue: 0, label: 'x 值' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '连续性观察',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: '从左侧接近间断点', changes: { x: -2 } },
            { id: 's2', description: '继续从左靠近x=0', changes: { x: -1 } },
            { id: 's3', description: '接近间断点', changes: { x: -0.1 } },
            { id: 's4', description: '跳跃！右极限≠左极限', changes: { x: 0 } },
            { id: 's5', description: '从右侧离开', changes: { x: 1 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心直观：一笔画完**

连续的函数图像可以用笔"一笔画完"而不抬笔。连续性的本质是：函数值没有突变。

---

**📐 连续的定义**

**定义1（极限语言）**：
$$\\lim_{x \\to x_0} f(x) = f(x_0)$$

即：极限值 = 函数值

**定义2（ε-δ语言）**：
$$\\forall \\varepsilon > 0, \\exists \\delta > 0, |x - x_0| < \\delta \\Rightarrow |f(x) - f(x_0)| < \\varepsilon$$

**与极限定义的区别**：这里 $x = x_0$ 时也成立！

**定义3（增量形式）**：
$$\\lim_{\\Delta x \\to 0} \\Delta y = 0$$

即：自变量变化很小时，函数变化也很小。

---

**📐 连续的三个条件**

函数 f(x) 在 x₀ 处连续 ⟺ 三个条件同时满足：

1. $f(x_0)$ 有定义
2. $\\lim_{x \\to x_0} f(x)$ 存在
3. $\\lim_{x \\to x_0} f(x) = f(x_0)$

**任何一个条件不满足，就不连续！**

---

**📐 左连续与右连续**

- **左连续**：$\\lim_{x \\to x_0^-} f(x) = f(x_0)$
- **右连续**：$\\lim_{x \\to x_0^+} f(x) = f(x_0)$

**连续的充要条件**：既左连续又右连续

---

**📐 间断点类型**

**第一类间断点**（左右极限都存在）：

| 类型 | 特征 | 例子 |
|-----|------|------|
| 可去间断点 | 左右极限相等，但不等于函数值（或无定义） | $f(x) = \\frac{\\sin x}{x}$ 在 x=0 |
| 跳跃间断点 | 左右极限存在但不相等 | $f(x) = \\frac{|x|}{x}$ 在 x=0 |

**第二类间断点**（左右极限至少一个不存在）：

| 类型 | 特征 | 例子 |
|-----|------|------|
| 无穷间断点 | 极限为无穷 | $f(x) = \\frac{1}{x}$ 在 x=0 |
| 振荡间断点 | 极限振荡不存在 | $f(x) = \\sin\\frac{1}{x}$ 在 x=0 |

---

**📐 连续函数的性质**

**定理1**：基本初等函数在其定义域内连续

**定理2**：初等函数在其定义区间内连续

**推论**：求初等函数在定义域内某点的极限，直接代入即可！`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：稳定与突变**

连续性描述了函数的"稳定性"：
- 连续：平稳过渡，没有突变
- 间断：出现跳跃或断开

**连续性的意义**：
- 物理意义：没有瞬时突变（能量守恒）
- 几何意义：图像不断开
- 计算意义：极限等于函数值

---

**🎓 间断点判断方法**

**步骤**：
1. 找出可能的间断点（分母为零、分段点等）
2. 求左右极限
3. 根据左右极限判断类型

**快速判断**：
- 左右极限相等 → 第一类（可去）
- 左右极限存在但不等 → 第一类（跳跃）
- 至少一个极限不存在 → 第二类`,
      extension: `**🚀 闭区间连续函数的性质**

设 $f \\in C[a,b]$（f 在 [a,b] 上连续），则：

**性质1：有界性定理**
f 在 [a,b] 上有界

**性质2：最值定理**
f 在 [a,b] 上必有最大值和最小值

**性质3：介值定理**
若 $f(a) < C < f(b)$，则 $\\exists \\xi \\in (a,b)$，使 $f(\\xi) = C$

**性质4：零点定理**
若 $f(a) \\cdot f(b) < 0$，则 $\\exists \\xi \\in (a,b)$，使 $f(\\xi) = 0$

---

**🌟 零点定理的应用**

**证明方程有根**：
1. 构造辅助函数 f(x)
2. 验证 f(a)·f(b) < 0
3. 由零点定理，存在 ξ 使 f(ξ) = 0

**例子**：证明 $x^3 + x - 1 = 0$ 在 (0,1) 内有根

设 $f(x) = x^3 + x - 1$，则 $f(0) = -1 < 0$，$f(1) = 1 > 0$

由零点定理，$\\exists \\xi \\in (0,1)$，使 $f(\\xi) = 0$

---

**📐 一致连续**

**定义**：$\\forall \\varepsilon > 0, \\exists \\delta > 0, \\forall x_1, x_2 \\in I, |x_1 - x_2| < \\delta \\Rightarrow |f(x_1) - f(x_2)| < \\varepsilon$

**康托定理**：闭区间上的连续函数必一致连续。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '方程根的存在性证明',
        description: `**数学背景**

证明方程 f(x) = 0 在某区间内有根。

**方法**：利用零点定理

**步骤**：
1. 构造辅助函数 f(x)
2. 找到区间端点 a, b
3. 验证 f(a)·f(b) < 0
4. 由零点定理得出结论

**例子**：证明 $x = \\cos x$ 在 $(0, \\frac{\\pi}{2})$ 内有解

设 $f(x) = x - \\cos x$，则 $f(0) = -1 < 0$，$f(\\frac{\\pi}{2}) = \\frac{\\pi}{2} > 0$

故存在 ξ 使 $\\xi = \\cos\\xi$`,
        scenario: '可视化展示函数图像与零点。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '物理中的连续性',
        description: `**物理背景**

许多物理量都是连续变化的：温度、压力、位移等。

**例子：温度分布**

物体内部温度 T(x,y,z) 是位置的连续函数（没有无限大温度梯度）

**应用**：
- 气象预报：温度场的连续变化
- 热传导：温度分布的介值定理应用

**反例**：激波（空气动力学中压力的突变）`,
        scenario: '展示温度场的连续分布。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '不动点定理',
        description: `**数学背景**

布劳威尔不动点定理：连续映射在紧凸集上必有不动点。

**简单形式**：
若 $f: [a,b] \\to [a,b]$ 连续，则存在 $\\xi \\in [a,b]$，使 $f(\\xi) = \\xi$

**证明思路**：
设 $g(x) = f(x) - x$，则 $g(a) \\ge 0$，$g(b) \\le 0$

由介值定理，存在 ξ 使 $g(\\xi) = 0$，即 $f(\\xi) = \\xi$

**应用**：证明微分方程解的存在性、经济学均衡的存在性`,
        scenario: '可视化展示不动点的几何意义。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断连续性', 
        description: `步骤：
1. 找出定义域
2. 检验三个条件：有定义、极限存在、极限等于函数值
3. 对分段函数，检验分段点的左右连续`
      },
      { 
        number: 2, 
        title: '判断间断点类型', 
        description: `步骤：
1. 找出可能的间断点
2. 计算左右极限
3. 分类：
   - 左右极限相等 → 可去间断点
   - 左右极限存在但不等 → 跳跃间断点
   - 至少一个不存在 → 第二类间断点`
      },
      { 
        number: 3, 
        title: '利用闭区间性质', 
        description: `常见题型：
1. 证明方程有根 → 零点定理
2. 证明方程有解 → 介值定理
3. 证明函数有界/有最值 → 有界性/最值定理

技巧：构造合适的辅助函数和区间`
      },
    ],
  },
}

// 导数几何意义知识点
const derivativeGeometryPoint: KnowledgePoint = {
  id: 'derivative-geometry',
  moduleId: 'derivative',
  name: '导数的几何意义',
  formula: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}",
  coreSentence: '导数就是"瞬时变化率"——你站在函数图像的某点，导数就是你脚下那一瞬间的坡度。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'p', x: 'x0', y: 'x0^2', draggable: true, color: '#C62828', label: 'P' },
          { id: 'q', x: 'x0 + dx', y: '(x0 + dx)^2', draggable: true, color: '#1565C0', label: 'Q' },
        ],
        sliders: [
          { id: 'x0', name: 'x0', min: -3, max: 3, step: 0.1, defaultValue: 1, label: 'P点位置 x₀' },
          { id: 'dx', name: 'dx', min: 0.01, max: 3, step: 0.01, defaultValue: 1, label: 'Δx 距离' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '割线变切线',
          type: 'step',
          steps: [
            { id: 's1', description: 'Δx=2，Q点较远，割线斜率明显大于切线斜率', changes: { dx: 2 } },
            { id: 's2', description: 'Δx=1，Q点靠近，割线斜率接近切线', changes: { dx: 1 } },
            { id: 's3', description: 'Δx=0.5，更近了，差距缩小', changes: { dx: 0.5 } },
            { id: 's4', description: 'Δx=0.1，非常近，几乎重合', changes: { dx: 0.1 } },
            { id: 's5', description: 'Δx=0.01，极限逼近！割线→切线', changes: { dx: 0.01 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：从"平均"到"瞬时"的飞跃**

导数是微积分的灵魂。它回答了一个看似矛盾的问题：**如何测量"一瞬间"的变化？**

答案：用极限把"平均变化率"升级为"瞬时变化率"。

---

**📐 数学定义**

函数 f(x) 在点 x₀ 处的导数定义为：

$$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$

也可以写成：

$$f'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}$$

**符号说明**：
- Δx = x - x₀：自变量的增量
- Δy = f(x) - f(x₀)：函数值的增量
- 差商 Δy/Δx：平均变化率
- 极限 lim(Δx→0)：瞬时变化率

---

**🎭 几何意义：从割线到切线**

**场景**：在曲线 y = f(x) 上有两点 P 和 Q

**第一步：割线（连接两点的直线）**
- 连接 P(x₀, f(x₀)) 和 Q(x₀+Δx, f(x₀+Δx))
- 割线斜率 = 平均变化率 = Δy/Δx

$$k_{割} = \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$

**第二步：让 Q 趋近于 P**
- 当 Δx → 0 时，Q 点沿着曲线滑向 P
- 割线不断旋转，逼近某个极限位置

**第三步：切线（割线的极限）**
- 当 Q 无限接近 P 时，割线变成了切线
- 切线斜率 = 瞬时变化率 = 导数

$$k_{切} = \\lim_{\\Delta x \\to 0} k_{割} = f'(x_0)$$

**🎯 关键洞察**：切线是"过一点的直线中，与曲线最贴合的那条"。

---

**🏃 物理意义：瞬时速度**

**场景**：汽车行驶，位移函数 s(t)

| 概念 | 公式 | 含义 |
|-----|------|-----|
| 平均速度 | Δs/Δt | 一段时间内的平均快慢 |
| 瞬时速度 | s'(t) = lim(Δt→0) Δs/Δt | 某一时刻的快慢 |

**例子**：自由落体 s(t) = ½gt²
- 平均速度（0~t）：s(t)/t = ½gt
- 瞬时速度（t时刻）：s'(t) = gt
- 这是伽利略的伟大发现！

**加速度**：速度的变化率
$$a(t) = v'(t) = s''(t)$$

---

**🧩 导数存在与可导性**

**可导**：极限 f'(x₀) 存在

**可导的条件**：
1. 函数在 x₀ 处连续（必要条件）
2. 左导数 = 右导数（充要条件）

**左右导数**：
$$f'_-(x_0) = \\lim_{\\Delta x \\to 0^-} \\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$$
$$f'_+(x_0) = \\lim_{\\Delta x \\to 0^+} \\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$$

**例子**：f(x) = |x| 在 x=0 处
- f'₋(0) = -1，f'₊(0) = 1
- 左导数 ≠ 右导数，故不可导
- 几何意义：角点，没有唯一切线

---

**📐 基本求导公式**

| 函数 | 导数 | 记忆技巧 |
|-----|------|---------|
| c（常数） | 0 | 常数不变 |
| xⁿ | nxⁿ⁻¹ | 幂降一次，乘原指数 |
| eˣ | eˣ | 自己是自己 |
| aˣ | aˣ ln a | 底数的对数 |
| ln x | 1/x | 倒数 |
| sin x | cos x | 正弦变余弦 |
| cos x | -sin x | 余弦变负正弦 |
| tan x | sec² x | 正切平方正割 |
| cot x | -csc² x | 余切平方余割 |

**求导法则**：
- (u ± v)' = u' ± v'
- (uv)' = u'v + uv'（乘法法则）
- (u/v)' = (u'v - uv')/v²（除法法则）
- [f(g(x))]' = f'(g(x))·g'(x)（链式法则）

---

**⚠️ 常见误区**

**误区1**："切线只能与曲线交于一点"
- **纠正**：切线可以与曲线交于多个点
- **例子**：y = x³ 在原点处的切线 y = 0，与曲线"穿过"交于原点

**误区2**："连续一定可导"
- **纠正**：连续是可导的必要条件，不是充分条件
- **反例**：y = |x| 在 x=0 连续但不可导

**误区3**："导数为零的点就是极值点"
- **纠正**：导数为零是极值的必要条件（驻点），还需判断左右导数符号
- **反例**：y = x³ 在 x=0 导数为零，但不是极值点`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
      ],
    },
    
    extension: {
      essence: `**🔮 核心内涵：局部线性近似**

导数揭示了非线性函数的"局部本性"：在足够小的范围内，任何光滑曲线都可以用直线近似。

$$f(x) \\approx f(x_0) + f'(x_0)(x - x_0)$$

这就是**线性化**思想，是科学计算的核心！

---

**📐 微分的概念**

**定义**：若 f'(x₀) 存在，则称
$$dy = f'(x_0)dx$$
为函数在 x₀ 处的微分。

**几何意义**：微分是切线的纵坐标增量。

**可微 ⟺ 可导**（一元函数）

**微分的运算规则**：
- d(uv) = v·du + u·dv
- d(u/v) = (v·du - u·dv)/v²
- d[f(g(x))] = f'(g(x))·g'(x)dx

---

**🎓 可导性与连续性的关系**

**定理**：可导 ⟹ 连续

**证明**：
$$\\lim_{x \\to x_0} [f(x) - f(x_0)] = \\lim_{x \\to x_0} \\frac{f(x)-f(x_0)}{x-x_0} \\cdot (x-x_0) = f'(x_0) \\cdot 0 = 0$$

**逆命题不成立**：连续 ⇏ 可导

| 条件 | 结论 |
|-----|------|
| 可导 | 一定连续 |
| 连续 | 不一定可导 |
| 不连续 | 一定不可导 |

**反例**：连续但不可导
- y = |x| 在 x=0：角点
- y = x^(1/3) 在 x=0：尖点，切线垂直
- 魏尔斯特拉斯函数：处处连续，处处不可导

---

**🔬 高阶导数**

**定义**：导数的导数
$$f''(x) = \\frac{d}{dx}[f'(x)] = \\frac{d^2 f}{dx^2}$$

**物理意义**：
- s'(t) = v(t)：速度
- s''(t) = a(t)：加速度
- s'''(t) = j(t)：加加速度（Jerk，舒适度指标）

**几何意义**：
- f''(x) > 0：凹函数（开口向上）
- f''(x) < 0：凸函数（开口向下）
- f''(x) = 0：拐点候选

**常用高阶导数**：
- (eˣ)⁽ⁿ⁾ = eˣ
- (sin x)⁽ⁿ⁾ = sin(x + nπ/2)
- (cos x)⁽ⁿ⁾ = cos(x + nπ/2)
- (xᵐ)⁽ⁿ⁾ = m!/(m-n)! · xᵐ⁻ⁿ （n≤m）`,
      extension: `**🚀 从一元导数到多元偏导**

**偏导数的定义**：
$$\\frac{\\partial f}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x, y) - f(x, y)}{\\Delta x}$$

**几何意义**：沿坐标轴方向的切线斜率。

**梯度向量**：
$$\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right)$$

梯度方向是函数增长最快的方向！

---

**📐 微分中值定理**

**费马引理**：若 f 在 x₀ 处可导且取得极值，则 f'(x₀) = 0

**罗尔定理**：若 f 在 [a,b] 连续，(a,b) 可导，且 f(a) = f(b)，则存在 ξ∈(a,b)，使 f'(ξ) = 0

**拉格朗日中值定理**：
$$f'(\\xi) = \\frac{f(b) - f(a)}{b - a}, \\quad \\xi \\in (a, b)$$

**几何意义**：曲线上存在一点，其切线平行于连接端点的割线。

**柯西中值定理**：
$$\\frac{f'(\\xi)}{g'(\\xi)} = \\frac{f(b) - f(a)}{g(b) - g(a)}$$

---

**🎓 泰勒公式：导数的终极应用**

**泰勒展开**：
$$f(x) = f(x_0) + f'(x_0)(x-x_0) + \\frac{f''(x_0)}{2!}(x-x_0)^2 + \\cdots + \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n + R_n$$

**麦克劳林展开**（x₀=0）：
$$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$$
$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots$$
$$\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots$$

**意义**：用多项式逼近任意光滑函数！

---

**🌟 导数的应用场景**

**1. 求极值**
- 找驻点：f'(x) = 0
- 判断极值：f''(x) 的符号

**2. 单调性分析**
- f'(x) > 0 ⟹ 单调递增
- f'(x) < 0 ⟹ 单调递减

**3. 凹凸性分析**
- f''(x) > 0 ⟹ 凹函数
- f''(x) < 0 ⟹ 凸函数
- f''(x) = 0 ⟹ 拐点候选

**4. 曲率计算**
$$\\kappa = \\frac{|y''|}{(1+y'^2)^{3/2}}$$

**5. 洛必达法则**（求极限）
$$\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}$$

---

**🔬 偏微分方程中的应用**

导数是描述变化规律的核心工具：
- 热传导方程：∂u/∂t = k∂²u/∂x²
- 波动方程：∂²u/∂t² = c²∂²u/∂x²
- 拉普拉斯方程：∂²u/∂x² + ∂²u/∂y² = 0`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '汽车速度表 - 瞬时速度测量',
        description: `**物理背景**

汽车的速度表显示的是瞬时速度，而非平均速度。

**数学原理**

设位移函数 s(t)，则瞬时速度：
$$v(t) = s'(t) = \\lim_{\\Delta t \\to 0} \\frac{s(t+\\Delta t) - s(t)}{\\Delta t}$$

**实际计算**

GPS 测速：通过极短时间内的位移变化估算瞬时速度。
时间间隔越短，结果越精确。`,
        scenario: '在位移-时间图像中，观察不同时刻的切线斜率（速度）变化。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '边际成本分析 - 经济学应用',
        description: `**经济背景**

生产 x 单位产品的总成本为 C(x)，边际成本是多少？

**数学定义**

边际成本 = 成本函数的导数：
$$MC = C'(x) = \\lim_{\\Delta x \\to 0} \\frac{C(x+\\Delta x) - C(x)}{\\Delta x}$$

**经济意义**

边际成本表示：多生产1单位产品所增加的成本。

**最优化决策**

当边际成本 = 边际收益时，利润最大化。`,
        scenario: '绘制成本曲线，标记边际成本（切线斜率），找到最优产量点。',
      },
      {
        id: 'app3',
        type: 'real',
        title: '药物代谢 - 浓度变化率',
        description: `**医学背景**

血液中药物浓度 C(t) 随时间变化，何时代谢最快？

**数学分析**

代谢速率 = 浓度的负导数：
$$v(t) = -C'(t)$$

**临床应用**

- 峰值浓度时间：C'(t) = 0
- 最大代谢速率：C''(t) = 0
- 半衰期计算：指数衰减模型`,
        scenario: '绘制药物浓度曲线，分析不同时间的代谢速率。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '图像判断 - 切线斜率', 
        description: `在函数图像上：
1. 过点 $(x_0, f(x_0))$ 作切线
2. 切线斜率 = 导数值
3. 斜率正 → 函数上升；斜率负 → 函数下降`
      },
      { 
        number: 2, 
        title: '定义法 - 计算极限', 
        description: `用定义计算导数：
1. 写出差商：$[f(x_0+\\Delta x)-f(x_0)]/\\Delta x$
2. 化简表达式
3. 取极限 $\\Delta x \\to 0$

例：$f(x)=x^2$，则 $f'(x_0)=\\lim [(x_0+\\Delta x)^2-x_0^2]/\\Delta x = 2x_0$`
      },
      { 
        number: 3, 
        title: '公式法 - 求导法则', 
        description: `常用求导公式：
- $(x^n)' = nx^{n-1}$
- $(e^x)' = e^x$
- $(\\ln x)' = 1/x$
- $(\\sin x)' = \\cos x$
- $(\\cos x)' = -\\sin x$

复合函数：链式法则
$[f(g(x))]' = f'(g(x)) \\cdot g'(x)$`
      },
    ],
  },
}

// 求导法则知识点
const derivativeRulesPoint: KnowledgePoint = {
  id: 'derivative-rules',
  moduleId: 'derivative',
  name: '求导法则',
  formula: "(u \\pm v)' = u' \\pm v', \\quad (uv)' = u'v + uv', \\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}",
  coreSentence: '求导法则是"化繁为简"的工具——把复杂函数的求导分解为简单函数的运算。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2', color: '#C62828', visible: true },
          { id: 'f2', expression: 'e^x', color: '#1565C0', visible: true },
          { id: 'f3', expression: 'x^2*e^x', color: '#558B2F', visible: true },
        ],
        points: [],
        sliders: [],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：四则运算与复合**

掌握了基本初等函数的导数后，需要一套规则来处理复杂函数。求导法则就是这套"组合工具"。

---

**📐 四则运算法则**

**加法法则**：
$$(u + v)' = u' + v'$$

**减法法则**：
$$(u - v)' = u' - v'$$

**乘法法则**：
$$(uv)' = u'v + uv'$$

**除法法则**：
$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2} \\quad (v \\neq 0)$$

---

**📐 复合函数求导（链式法则）**

**法则**：
$$[f(g(x))]' = f'(g(x)) \\cdot g'(x)$$

**口诀**："外层导数乘内层导数"

**例子**：求 $(x^2 + 1)^3$ 的导数

设 $u = x^2 + 1$，则：
$$\\frac{d}{dx}(u^3) = 3u^2 \\cdot u' = 3(x^2 + 1)^2 \\cdot 2x = 6x(x^2 + 1)^2$$

---

**📐 常用求导公式**

| 函数 | 导数 |
|-----|------|
| $c$（常数）| $0$ |
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \\ln a$ |
| $\\ln x$ | $\\frac{1}{x}$ |
| $\\log_a x$ | $\\frac{1}{x \\ln a}$ |
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $-\\sin x$ |
| $\\tan x$ | $\\sec^2 x$ |
| $\\arcsin x$ | $\\frac{1}{\\sqrt{1-x^2}}$ |
| $\\arctan x$ | $\\frac{1}{1+x^2}$ |`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：线性与非线性**

加法法则体现"线性"：导数可以直接相加。乘法法则体现"非线性"：两个函数相互影响。

**链式法则的本质**：
- 变化率的传递：$y$ 随 $u$ 变，$u$ 随 $x$ 变
- 总变化率 = 各层变化率的乘积

---

**🎓 反函数求导法则**

若 $y = f(x)$ 有反函数 $x = f^{-1}(y)$，则：
$$(f^{-1})'(y) = \\frac{1}{f'(x)} = \\frac{dx}{dy}$$

**例子**：$y = \\arcsin x$ 的导数

$x = \\sin y$，所以：
$$\\frac{dx}{dy} = \\cos y, \\quad \\frac{dy}{dx} = \\frac{1}{\\cos y} = \\frac{1}{\\sqrt{1-\\sin^2 y}} = \\frac{1}{\\sqrt{1-x^2}}$$`,
      extension: `**🚀 高阶导数**

**定义**：导数的导数
$$f''(x) = \\frac{d}{dx}f'(x), \\quad f^{(n)}(x) = \\frac{d}{dx}f^{(n-1)}(x)$$

**常用高阶导数公式**：

| 函数 | n阶导数 |
|-----|---------|
| $x^n$ | $n!$（当n阶）|
| $e^x$ | $e^x$ |
| $\\sin x$ | $\\sin(x + n\\cdot\\frac{\\pi}{2})$ |
| $\\cos x$ | $\\cos(x + n\\cdot\\frac{\\pi}{2})$ |
| $\\ln x$ | $(-1)^{n-1}\\frac{(n-1)!}{x^n}$ |

**莱布尼茨公式**：
$$(uv)^{(n)} = \\sum_{k=0}^{n} C_n^k u^{(k)} v^{(n-k)}$$

---

**🌟 隐函数求导**

对于 $F(x, y) = 0$ 确定的隐函数：

1. 两边对 x 求导（y 看作 x 的函数）
2. 解出 $\\frac{dy}{dx}$

**例子**：$x^2 + y^2 = 1$

$$2x + 2y \\cdot y' = 0 \\Rightarrow y' = -\\frac{x}{y}$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '运动学中的加速度',
        description: `**物理背景**

位置 $\\to$ 速度 $\\to$ 加速度

**数学表达**：
- 位置：$s(t)$
- 速度：$v(t) = s'(t)$
- 加速度：$a(t) = v'(t) = s''(t)$

**例子**：自由落体 $s = \\frac{1}{2}gt^2$

$v = s' = gt$，$a = v' = g$（恒定加速度）`,
        scenario: '展示位移、速度、加速度的关系。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '经济学中的边际分析',
        description: `**经济背景**

边际成本 = 成本函数的导数

**数学建模**：

设成本函数 $C(q)$，则：
- 边际成本 $MC = C'(q)$
- 边际收益 $MR = R'(q)$
- 边际利润 $MP = P'(q)$

**最优产量**：$MR = MC$ 时利润最大`,
        scenario: '展示边际成本曲线与最优产量决策。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '识别函数结构', 
        description: `分析函数是由哪些基本函数通过什么运算组成的：
- 四则运算 → 用四则法则
- 复合函数 → 用链式法则
- 混合结构 → 综合应用`
      },
      { 
        number: 2, 
        title: '分层求导', 
        description: `对于复合函数，从外到内逐层求导：
1. 识别最外层函数
2. 求外层导数
3. 乘以内层导数
4. 重复直到最内层`
      },
      { 
        number: 3, 
        title: '整理化简', 
        description: `求导后整理结果：
- 合并同类项
- 因式分解
- 化成最简形式`
      },
    ],
  },
}

// 隐函数与参数方程求导知识点
const implicitParametricPoint: KnowledgePoint = {
  id: 'implicit-parametric',
  moduleId: 'derivative',
  name: '隐函数与参数方程求导',
  formula: '\\frac{dy}{dx} = -\\frac{F_x}{F_y}, \\quad \\frac{dy}{dx} = \\frac{\\dot{y}}{\\dot{x}}',
  coreSentence: '隐函数和参数方程求导是"曲线不用显式表达"的求导方法——直接对关系式求导即可。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 't', name: 't', min: 0.1, max: 6.2, step: 0.1, defaultValue: 0.785, label: '参数 t' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '参数变化',
          type: 'auto',
          duration: 8000,
          steps: [
            { id: 's1', description: 't=0, 点在(1,0)', changes: { t: 0.1 } },
            { id: 's2', description: 't=π/4, 点在右上', changes: { t: 0.785 } },
            { id: 's3', description: 't=π/2, 点在(0,1)', changes: { t: 1.57 } },
            { id: 's4', description: 't=π, 点在(-1,0)', changes: { t: 3.14 } },
            { id: 's5', description: 't=3π/2, 点在(0,-1)', changes: { t: 4.71 } },
            { id: 's6', description: 't=2π, 回到起点', changes: { t: 6.2 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：不显式解出y也能求导**

有些函数关系很难或无法显式表示为 $y = f(x)$，这时需要特殊的方法来求导。

---

**📐 隐函数求导**

**定义**：由方程 $F(x, y) = 0$ 确定的函数关系

**方法**：
1. 方程两边对 x 求导
2. 把 y 看作 x 的函数，用链式法则
3. 解出 $\\frac{dy}{dx}$

**例子**：求 $x^2 + y^2 = 1$ 的导数

两边对 x 求导：
$$2x + 2y \\cdot \\frac{dy}{dx} = 0$$

解得：
$$\\frac{dy}{dx} = -\\frac{x}{y}$$

---

**📐 公式法（偏导数）**

对于 $F(x, y) = 0$：
$$\\frac{dy}{dx} = -\\frac{F_x}{F_y} = -\\frac{\\partial F/\\partial x}{\\partial F/\\partial y}$$

**验证上例**：
- $F_x = 2x$
- $F_y = 2y$
- $\\frac{dy}{dx} = -\\frac{2x}{2y} = -\\frac{x}{y}$ ✓

---

**📐 参数方程求导**

**形式**：
$$\\begin{cases} x = \\varphi(t) \\\\ y = \\psi(t) \\end{cases}$$

**一阶导数**：
$$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt} = \\frac{\\dot{y}}{\\dot{x}}$$

**二阶导数**：
$$\\frac{d^2y}{dx^2} = \\frac{d}{dt}\\left(\\frac{dy}{dx}\\right) \\cdot \\frac{dt}{dx} = \\frac{\\dot{x}\\ddot{y} - \\dot{y}\\ddot{x}}{\\dot{x}^3}$$

---

**📐 例子：圆的参数方程**

圆：$\\begin{cases} x = r\\cos t \\\\ y = r\\sin t \\end{cases}$

一阶导数：
$$\\frac{dy}{dx} = \\frac{r\\cos t}{-r\\sin t} = -\\cot t = -\\frac{x}{y}$$

与隐函数求导结果一致！`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：多变量视角**

隐函数求导本质上是偏导数的应用：
- $F_x$：x 方向的变化率
- $F_y$：y 方向的变化率
- 切线斜率 = 两个变化率的比值

**几何意义**：
- 隐函数 $F(x,y) = 0$ 的图像是一条等值线
- 切线方向与梯度 $\\nabla F = (F_x, F_y)$ 垂直
- 切线斜率 $= -\\frac{F_x}{F_y}$`,
      extension: `**🚀 极坐标求导**

极坐标方程 $r = r(\\theta)$：

参数形式：
$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$

导数公式：
$$\\frac{dy}{dx} = \\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}$$

---

**🌟 相关变化率**

**问题类型**：多个变量相关，一个变化时其他如何变化？

**方法**：
1. 建立变量间的关系式
2. 对时间 t 求导
3. 代入已知值求未知变化率

**例子**：气球充气，半径 $r$ 以 2cm/s 增加，求 $r=5$cm 时体积增加速率。

$V = \\frac{4}{3}\\pi r^3$

$\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt} = 4\\pi \\cdot 25 \\cdot 2 = 200\\pi$ cm³/s`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '椭圆轨道运动',
        description: `**物理背景**

行星运动轨道为椭圆，用参数方程描述更方便。

**数学建模**：

椭圆参数方程：
$$\\begin{cases} x = a\\cos t \\\\ y = b\\sin t \\end{cases}$$

速度方向（切线方向）：
$$\\frac{dy}{dx} = -\\frac{b}{a}\\cot t$$

**应用**：计算卫星在不同位置的运行方向`,
        scenario: '展示椭圆轨道上的速度方向。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '摆线研究',
        description: `**数学背景**

摆线是圆周上一点在圆滚动时的轨迹。

**参数方程**：
$$\\begin{cases} x = a(t - \\sin t) \\\\ y = a(1 - \\cos t) \\end{cases}$$

**切线斜率**：
$$\\frac{dy}{dx} = \\frac{a\\sin t}{a(1-\\cos t)} = \\cot\\frac{t}{2}$$

**有趣性质**：摆线的切线总是通过滚圆的最高点`,
        scenario: '展示摆线的生成过程和切线特性。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '隐函数求导步骤', 
        description: `1. 方程两边对x求导
2. y看成x的函数，遇到y要乘y'
3. 整理方程，解出y'
4. 或用公式 y' = -Fx/Fy`
      },
      { 
        number: 2, 
        title: '参数方程求导步骤', 
        description: `1. 分别求 dx/dt 和 dy/dt
2. 一阶导数 dy/dx = (dy/dt)/(dx/dt)
3. 二阶导数再对t求导后除以dx/dt`
      },
      { 
        number: 3, 
        title: '验证技巧', 
        description: `可以用特殊点验证：
- 对称点处导数应有关系
- 驻点处导数应为0
- 与显式表达对比（如能显式化）`
      },
    ],
  },
}

// 微分知识点
const differentialPoint: KnowledgePoint = {
  id: 'differential',
  moduleId: 'derivative',
  name: '微分',
  formula: 'dy = f\'(x) \\, dx',
  coreSentence: '微分是"导数的另一种表达"——把变化量分解为"变化率×自变量增量"。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2', color: '#5D4037', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'x0', name: 'x0', min: -2, max: 2, step: 0.1, defaultValue: 1, label: '点位置 x₀' },
          { id: 'dx', name: 'dx', min: 0.05, max: 1.5, step: 0.05, defaultValue: 0.5, label: '增量 Δx' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '微分逼近',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: 'Δx=1.0，误差较大', changes: { dx: 1.0 } },
            { id: 's2', description: 'Δx=0.5，误差减小', changes: { dx: 0.5 } },
            { id: 's3', description: 'Δx=0.2，误差更小', changes: { dx: 0.2 } },
            { id: 's4', description: 'Δx=0.1，很接近了', changes: { dx: 0.1 } },
            { id: 's5', description: 'Δx→0，dy→Δy', changes: { dx: 0.05 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：线性近似**

微分是把非线性问题"线性化"的工具。它用切线来近似曲线，用直线来近似曲面。

---

**📐 微分的定义**

函数 $y = f(x)$ 的微分定义为：
$$dy = f'(x) \\, dx$$

**注意**：
- $dx$ 是自变量的增量（任意给定）
- $dy$ 是函数增量的**线性主部**
- $\\Delta y = f(x + \\Delta x) - f(x)$ 是实际增量

---

**📐 微分与增量的关系**

$$\\Delta y = dy + o(\\Delta x)$$

其中 $o(\\Delta x)$ 是高阶无穷小。

**几何意义**：
- $\\Delta y$：曲线上的实际增量
- $dy$：切线上的增量
- 两者之差：曲线与切线的偏离

---

**📐 微分形式不变性**

无论 $x$ 是自变量还是中间变量，微分形式相同：

$$dy = f'(x)dx$$

**例子**：$y = \\sin u$，其中 $u = x^2$

- 若 $u$ 为自变量：$dy = \\cos u \\, du$
- 若 $u = x^2$：$dy = \\cos(x^2) \\cdot 2x \\, dx = \\cos u \\, du$

**形式不变！这就是微分形式的"不变性"。**

---

**📐 微分基本公式**

| 函数 | 微分 |
|-----|------|
| $x^n$ | $nx^{n-1}dx$ |
| $e^x$ | $e^x dx$ |
| $\\ln x$ | $\\frac{dx}{x}$ |
| $\\sin x$ | $\\cos x \\, dx$ |
| $\\cos x$ | $-\\sin x \\, dx$ |

**微分运算法则**：
- $d(u \\pm v) = du \\pm dv$
- $d(uv) = v\\,du + u\\,dv$
- $d(u/v) = \\frac{v\\,du - u\\,dv}{v^2}$`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：线性化思想**

微分的核心是"以直代曲"：
- 局部用切线代替曲线
- 把非线性问题转化为线性问题
- 误差是高阶无穷小

**微分与导数的区别**：

| 导数 | 微分 |
|-----|------|
| 变化率 | 变化量 |
| 一个数 | 一个线性函数 |
| $\\lim$ 过程 | 近似计算 |
| 描述"快慢" | 描述"增量" |

---

**🎓 一阶微分形式不变性的意义**

使得我们可以用"凑微分"法求积分，而不必关心变量之间的依赖关系。`,
      extension: `**🚀 微分在近似计算中的应用**

**线性近似**：
$$f(x + \\Delta x) \\approx f(x) + f'(x)\\Delta x$$

**例子**：计算 $\\sqrt{1.02}$

设 $f(x) = \\sqrt{x}$，在 $x=1$ 处：
$$f(1.02) \\approx f(1) + f'(1) \\cdot 0.02 = 1 + \\frac{1}{2} \\cdot 0.02 = 1.01$$

实际值：$\\sqrt{1.02} \\approx 1.00995$

误差极小！

---

**🌟 误差估计**

**绝对误差**：$|\\Delta y| \\approx |dy|$

**相对误差**：$\\left|\\frac{\\Delta y}{y}\\right| \\approx \\left|\\frac{dy}{y}\\right|$

**例子**：测量半径 $r$ 有误差 $\\Delta r$，求面积误差

$S = \\pi r^2$

$dS = 2\\pi r \\, dr$

相对误差：$\\frac{dS}{S} = 2\\frac{dr}{r}$

面积相对误差是半径相对误差的2倍！`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '工程中的近似计算',
        description: `**工程背景**

很多复杂函数在工程中需要快速估算。

**数学建模**

用微分近似：
$$f(x + h) \\approx f(x) + f'(x) \\cdot h$$

**常用近似**（$|x| << 1$ 时）：
- $\\sin x \\approx x$
- $\\cos x \\approx 1 - \\frac{x^2}{2}$
- $\\sqrt{1+x} \\approx 1 + \\frac{x}{2}$
- $\\ln(1+x) \\approx x$
- $e^x \\approx 1 + x$

**例子**：估算 $e^{0.1}$

$e^{0.1} \\approx 1 + 0.1 = 1.1$

实际：$e^{0.1} \\approx 1.105$`,
        scenario: '展示线性近似与实际曲线的对比。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '测量误差传播',
        description: `**测量背景**

间接测量中，直接测量量的误差如何传播？

**数学建模**

设 $y = f(x_1, x_2, \\ldots, x_n)$

全微分：
$$dy = \\frac{\\partial f}{\\partial x_1}dx_1 + \\cdots + \\frac{\\partial f}{\\partial x_n}dx_n$$

**最大误差估计**：
$$|\\Delta y|_{max} \\approx \\sum_{i=1}^{n}\\left|\\frac{\\partial f}{\\partial x_i}\\right||dx_i|$$

**例子**：圆柱体积 $V = \\pi r^2 h$

测量误差：$\\frac{\\Delta V}{V} \\approx 2\\frac{\\Delta r}{r} + \\frac{\\Delta h}{h}$`,
        scenario: '展示误差传播的可视化。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '求微分', 
        description: `步骤：
1. 先求导数 f'(x)
2. 乘以 dx 得微分 dy = f'(x)dx
3. 或直接用微分公式`
      },
      { 
        number: 2, 
        title: '近似计算', 
        description: `步骤：
1. 选择合适的函数和展开点
2. 计算函数值和导数值
3. 用线性近似公式估算`
      },
      { 
        number: 3, 
        title: '误差估计', 
        description: `步骤：
1. 写出函数关系式
2. 求全微分或对数微分
3. 代入误差值计算`
      },
    ],
  },
}

// 不定积分知识点
const indefiniteIntegralPoint: KnowledgePoint = {
  id: 'indefinite-integral',
  moduleId: 'integral',
  name: '不定积分',
  formula: '\\int f(x) \\, dx = F(x) + C',
  coreSentence: '不定积分是"求导的逆运算"——已知导数求原函数，答案是一族函数。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2+C', color: '#C62828', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'C', name: 'C', min: -3, max: 3, step: 0.5, defaultValue: 0, label: '常数 C' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '常数变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'C=-3，曲线下移', changes: { C: -3 } },
            { id: 's2', description: 'C=0，标准位置', changes: { C: 0 } },
            { id: 's3', description: 'C=3，曲线上移', changes: { C: 3 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：逆运算**

不定积分是导数的逆运算。如果 $F'(x) = f(x)$，则 $F(x)$ 是 $f(x)$ 的一个原函数。

---

**📐 定义**

函数 $f(x)$ 的不定积分定义为：
$$\\int f(x) \\, dx = F(x) + C$$

其中 $F(x)$ 是 $f(x)$ 的一个原函数，$C$ 是任意常数。

---

**📐 为什么有常数C？**

因为常数的导数为零，所以：
$$\\frac{d}{dx}[F(x) + C] = F'(x) = f(x)$$

**几何意义**：$F(x) + C$ 表示一族平行的曲线，它们只是上下平移。

---

**📐 基本积分公式**

| 函数 | 积分 |
|-----|------|
| $x^n$ ($n \\neq -1$) | $\\frac{x^{n+1}}{n+1} + C$ |
| $\\frac{1}{x}$ | $\\ln|x| + C$ |
| $e^x$ | $e^x + C$ |
| $a^x$ | $\\frac{a^x}{\\ln a} + C$ |
| $\\sin x$ | $-\\cos x + C$ |
| $\\cos x$ | $\\sin x + C$ |
| $\\sec^2 x$ | $\\tan x + C$ |
| $\\csc^2 x$ | $-\\cot x + C$ |
| $\\frac{1}{\\sqrt{1-x^2}}$ | $\\arcsin x + C$ |
| $\\frac{1}{1+x^2}$ | $\\arctan x + C$ |

---

**📐 积分基本性质**

**线性性**：
$$\\int [af(x) + bg(x)] \\, dx = a\\int f(x) \\, dx + b\\int g(x) \\, dx$$

**注意**：积分没有乘法和除法法则！`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：从局部到整体**

导数：从整体到局部（函数 → 变化率）
积分：从局部到整体（变化率 → 函数）

**物理意义**：
- 已知速度 → 求位移（积分）
- 已知位移 → 求速度（求导）

---

**🎓 原函数存在定理**

**定理**：连续函数一定有原函数

**注意**：不连续函数也可能有原函数，但不一定。

**例子**：$f(x) = \\frac{1}{x}$ 在 $x=0$ 处不连续，但它在 $(-\\infty, 0)$ 和 $(0, +\\infty)$ 上分别有原函数 $\\ln|x|$。`,
      extension: `**🚀 常用积分技巧**

**1. 直接积分法**

直接套用基本公式

**例子**：$\\int (x^2 + 3x - 1) \\, dx = \\frac{x^3}{3} + \\frac{3x^2}{2} - x + C$

**2. 凑微分法**

利用 $d\\varphi(x) = \\varphi'(x)dx$

**例子**：$\\int \\cos(2x) \\, dx$

设 $u = 2x$，$du = 2dx$

$= \\frac{1}{2}\\int \\cos u \\, du = \\frac{1}{2}\\sin u + C = \\frac{1}{2}\\sin 2x + C$

**3. 分项积分**

把复杂积分拆成简单积分的和

**例子**：$\\int \\frac{x^2}{x^2+1} \\, dx = \\int (1 - \\frac{1}{x^2+1}) \\, dx = x - \\arctan x + C$

---

**🌟 积分结果验证**

积分后对结果求导，应等于被积函数：
$$\\frac{d}{dx}[\\int f(x) \\, dx] = f(x)$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '已知速度求位移',
        description: `**物理背景**

已知物体运动速度，求位移。

**数学建模**

速度 $v(t)$，位移 $s(t) = \\int v(t) \\, dt$

**例子**：自由落体速度 $v = gt$

$s = \\int gt \\, dt = \\frac{1}{2}gt^2 + C$

设 $t=0$ 时 $s=0$，得 $C=0$

所以 $s = \\frac{1}{2}gt^2$`,
        scenario: '展示速度-位移的积分关系。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '经济学中的总量计算',
        description: `**经济背景**

已知边际成本，求总成本。

**数学建模**

边际成本 $MC(q)$，总成本 $C(q) = \\int MC(q) \\, dq$

**例子**：边际成本 $MC = 2q + 5$

$C = \\int (2q + 5) \\, dq = q^2 + 5q + C_0$

其中 $C_0$ 是固定成本`,
        scenario: '展示边际量与总量的积分关系。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '识别积分类型', 
        description: `观察被积函数：
- 基本函数 → 直接公式
- 多项式 → 逐项积分
- 复合函数 → 考虑换元
- 乘积形式 → 考虑分部积分`
      },
      { 
        number: 2, 
        title: '变形简化', 
        description: `常见变形技巧：
- 三角恒等式
- 代数变形（因式分解、配方）
- 分式拆分
- 凑微分`
      },
      { 
        number: 3, 
        title: '验证结果', 
        description: `积分后务必验证：
对结果求导 = 被积函数？`
      },
    ],
  },
}

// 换元积分法知识点
const substitutionPoint: KnowledgePoint = {
  id: 'substitution',
  moduleId: 'integral',
  name: '换元积分法',
  formula: '\\int f[\\varphi(x)] \\varphi\'(x) \\, dx = \\int f(u) \\, du',
  coreSentence: '换元积分是"变量替换"——把复杂的积分转化为简单的标准形式。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'u', name: 'u', min: 0.1, max: 4, step: 0.1, defaultValue: 1, label: '新变量 u' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '换元演示',
          type: 'step',
          steps: [
            { id: 's1', description: 'u=0.5', changes: { u: 0.5 } },
            { id: 's2', description: 'u=1', changes: { u: 1 } },
            { id: 's3', description: 'u=2', changes: { u: 2 } },
            { id: 's4', description: 'u=4', changes: { u: 4 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：化繁为简**

换元积分法通过变量替换，把难以直接积分的函数转化为容易积分的形式。

---

**📐 第一类换元法（凑微分法）**

**公式**：
$$\\int f[\\varphi(x)] \\varphi'(x) \\, dx = \\int f(u) \\, du$$

其中 $u = \\varphi(x)$

**步骤**：
1. 观察被积函数，找出复合结构
2. 设 $u = \\varphi(x)$
3. 凑出 $du = \\varphi'(x)dx$
4. 换元后积分
5. 回代

**例子**：$\\int x\\cos(x^2) \\, dx$

设 $u = x^2$，则 $du = 2x\\,dx$

$= \\frac{1}{2}\\int \\cos u \\, du = \\frac{1}{2}\\sin u + C = \\frac{1}{2}\\sin(x^2) + C$

---

**📐 第二类换元法（变量替换）**

**公式**：
$$\\int f(x) \\, dx = \\int f[\\psi(t)] \\psi'(t) \\, dt$$

其中 $x = \\psi(t)$

**常见替换**：

| 被积函数含 | 设 |
|-----------|---|
| $\\sqrt{a^2-x^2}$ | $x = a\\sin t$ |
| $\\sqrt{a^2+x^2}$ | $x = a\\tan t$ |
| $\\sqrt{x^2-a^2}$ | $x = a\\sec t$ |
| $\\sqrt[n]{ax+b}$ | $t = \\sqrt[n]{ax+b}$ |

**例子**：$\\int \\frac{dx}{\\sqrt{x^2+1}}$

设 $x = \\tan t$，$dx = \\sec^2 t \\, dt$

$= \\int \\frac{\\sec^2 t}{\\sec t} \\, dt = \\int \\sec t \\, dt = \\ln|\\sec t + \\tan t| + C$

$= \\ln|x + \\sqrt{x^2+1}| + C$`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：复合函数的逆运算**

换元积分法本质上是复合函数求导法则的逆应用：
- 求导：链式法则层层展开
- 积分：换元法层层收缩

**凑微分 vs 变量替换**：

| 凑微分 | 变量替换 |
|-------|---------|
| $u = \\varphi(x)$ | $x = \\psi(t)$ |
| 被动识别结构 | 主动构造替换 |
| 适用于复合函数 | 适用于根号等困难形式 |

---

**🎓 常用凑微分模式**

| 被积函数 | 凑微分 |
|---------|-------|
| $f(ax+b)$ | $dx = \\frac{1}{a}d(ax+b)$ |
| $xf(x^2)$ | $x\\,dx = \\frac{1}{2}d(x^2)$ |
| $\\frac{f(\\ln x)}{x}$ | $\\frac{dx}{x} = d(\\ln x)$ |
| $f(e^x)e^x$ | $e^x dx = d(e^x)$ |
| $\\frac{f'(x)}{f(x)}$ | $\\frac{f'(x)}{f(x)}dx = d\\ln|f(x)|$ |`,
      extension: `**🚀 三角换元的几何理解**

设 $x = a\\sin t$，则：
- $x$ 是直角边
- $a$ 是斜边
- $\\sqrt{a^2-x^2}$ 是另一直角边

**三角形辅助记忆**：画出对应的直角三角形，可快速确定各表达式的三角表示。

---

**🌟 倒数换元**

当被积函数分母次数较高时，设 $x = \\frac{1}{t}$

**例子**：$\\int \\frac{dx}{x\\sqrt{x^2-1}}$

设 $x = \\frac{1}{t}$，$dx = -\\frac{dt}{t^2}$

$= -\\int \\frac{dt}{\\sqrt{1-t^2}} = -\\arcsin t + C = -\\arcsin\\frac{1}{x} + C$

---

**🌟 万能代换**

对于三角有理式，设 $t = \\tan\\frac{x}{2}$

$$\\sin x = \\frac{2t}{1+t^2}, \\quad \\cos x = \\frac{1-t^2}{1+t^2}, \\quad dx = \\frac{2dt}{1+t^2}$$

可把任意三角有理式转化为有理函数。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'research',
        title: '椭圆积分',
        description: `**数学背景**

椭圆周长不能表示为初等函数，引出椭圆积分。

**第一类椭圆积分**：
$$F(k, \\varphi) = \\int_0^{\\varphi} \\frac{d\\theta}{\\sqrt{1-k^2\\sin^2\\theta}}$$

**换元**：设 $t = \\sin\\theta$ 可转化为另一种形式。

**应用**：椭圆周长、单摆周期等物理问题`,
        scenario: '展示椭圆积分与椭圆周长的关系。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '概率论中的正态分布积分',
        description: `**统计背景**

标准正态分布的概率计算涉及积分。

**积分**：
$$\\int e^{-x^2} dx$$

这个积分**不能用初等函数表示**！

但定积分：
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

**证明技巧**：用极坐标换元

设 $x = r\\cos\\theta$，$y = r\\sin\\theta$

$(\\int e^{-x^2}dx)^2 = \\iint e^{-(x^2+y^2)}dxdy = \\int_0^{2\\pi}\\int_0^{\\infty} e^{-r^2}r\\,dr\\,d\\theta = \\pi$`,
        scenario: '展示正态分布曲线下的面积。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '识别凑微分模式', 
        description: `观察被积函数中是否有：
- $\\varphi(x)$ 及其导数 $\\varphi'(x)$ 同时出现
- 常见模式：$xf(x^2)$、$f'(x)/f(x)$、$f(\\ln x)/x$ 等`
      },
      { 
        number: 2, 
        title: '选择变量替换', 
        description: `根据困难形式选择替换：
- 含 $\\sqrt{a^2-x^2}$ → 设 $x=a\\sin t$
- 含 $\\sqrt{x^2+a^2}$ → 设 $x=a\\tan t$
- 含根式 → 直接设根式为新变量`
      },
      { 
        number: 3, 
        title: '注意换元条件', 
        description: `换元法要求：
- 替换函数单调可导
- 换元后变量范围可能变化
- 定积分要改变积分限`
      },
    ],
  },
}

// 分部积分法知识点
const integrationByPartsPoint: KnowledgePoint = {
  id: 'integration-by-parts',
  moduleId: 'integral',
  name: '分部积分法',
  formula: '\\int u \\, dv = uv - \\int v \\, du',
  coreSentence: '分部积分是"交换积分对象"——把难积的转化为易积的。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：乘积求导的逆运算**

分部积分法源于乘积求导公式 $(uv)' = u'v + uv'$ 的逆推。

---

**📐 分部积分公式**

$$\\int u \\, dv = uv - \\int v \\, du$$

或写成：
$$\\int u(x)v'(x) \\, dx = u(x)v(x) - \\int v(x)u'(x) \\, dx$$

---

**📐 使用条件**

当被积函数是两种不同类型函数的乘积时：
- 多项式 × 指数函数
- 多项式 × 三角函数
- 多项式 × 对数函数
- 指数函数 × 三角函数
- ...

---

**📐 选择u和dv的原则**

**口诀**："反对幂三指"

按照优先级选择 $u$：
1. **反**三角函数
2. **对**数函数
3. **幂**函数（多项式）
4. **三**角函数
5. **指**数函数

越靠左越优先作为 $u$，剩下的作为 $dv$。

---

**📐 基本例子**

**例1**：$\\int x e^x \\, dx$

设 $u = x$，$dv = e^x dx$
则 $du = dx$，$v = e^x$

$= xe^x - \\int e^x dx = xe^x - e^x + C = e^x(x-1) + C$

**例2**：$\\int x \\ln x \\, dx$

设 $u = \\ln x$，$dv = x\\,dx$
则 $du = \\frac{dx}{x}$，$v = \\frac{x^2}{2}$

$= \\frac{x^2}{2}\\ln x - \\int \\frac{x^2}{2} \\cdot \\frac{dx}{x} = \\frac{x^2}{2}\\ln x - \\frac{x^2}{4} + C$`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：转移难度**

分部积分的本质是把"难积的部分"转移到另一个位置：
- 把复杂函数放在 $u$（微分后变简单）
- 把好积函数放在 $dv$（积分后仍是好积的）

**成功的关键**：$\\int v\\,du$ 比 $\\int u\\,dv$ 更容易！

---

**🎓 推广形式**

**表格法（快速分部积分）**：

对于 $\\int x^n e^{ax} dx$ 类型：

| 微分（u） | 积分（dv） |
|----------|-----------|
| $x^n$ | $e^{ax}$ |
| $nx^{n-1}$ | $\\frac{1}{a}e^{ax}$ |
| $n(n-1)x^{n-2}$ | $\\frac{1}{a^2}e^{ax}$ |
| ... | ... |
| $n!$ | $\\frac{1}{a^n}e^{ax}$ |

斜线相乘，正负交替：
$\\int x^n e^{ax} dx = \\frac{x^n e^{ax}}{a} - \\frac{nx^{n-1}e^{ax}}{a^2} + \\frac{n(n-1)x^{n-2}e^{ax}}{a^3} - ...$`,
      extension: `**🚀 循环积分**

有些积分分部积分后会回到原积分，形成方程。

**例子**：$\\int e^x \\sin x \\, dx$

设 $u = \\sin x$，$dv = e^x dx$

$= e^x \\sin x - \\int e^x \\cos x dx$（再分部）

$= e^x \\sin x - [e^x \\cos x + \\int e^x \\sin x dx]$

$= e^x(\\sin x - \\cos x) - \\int e^x \\sin x dx$

移项解方程：
$2\\int e^x \\sin x dx = e^x(\\sin x - \\cos x)$

$\\int e^x \\sin x dx = \\frac{e^x(\\sin x - \\cos x)}{2} + C$

---

**🌟 递推公式**

分部积分可用于建立递推公式。

**例子**：$I_n = \\int x^n e^x dx$

分部积分得：
$I_n = x^n e^x - n I_{n-1}$

结合 $I_0 = e^x + C$，可递推计算任意 $I_n$。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'research',
        title: '傅里叶系数计算',
        description: `**数学背景**

傅里叶级数的系数涉及三角积分。

**系数公式**：
$$a_n = \\frac{2}{T}\\int_0^T f(x)\\cos\\frac{2\\pi nx}{T}dx$$

当 $f(x)$ 是多项式时，需要用分部积分。

**例子**：$\\int x \\cos x \\, dx$

分部积分：$u=x$，$dv=\\cos x dx$

$= x\\sin x + \\cos x + C$`,
        scenario: '展示傅里叶级数的系数计算。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '伽马函数',
        description: `**数学背景**

伽马函数是阶乘的推广。

**定义**：
$$\\Gamma(x) = \\int_0^{\\infty} t^{x-1} e^{-t} dt \\quad (x > 0)$$

**递推性质**（用分部积分证明）：
$$\\Gamma(x+1) = x\\Gamma(x)$$

当 $n$ 为正整数时：
$$\\Gamma(n+1) = n!$$

**证明**：
$\\Gamma(n+1) = \\int_0^{\\infty} t^n e^{-t} dt$

$= [-t^n e^{-t}]_0^{\\infty} + n\\int_0^{\\infty} t^{n-1} e^{-t} dt = n\\Gamma(n)$`,
        scenario: '展示伽马函数与阶乘的关系。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断是否用分部积分', 
        description: `被积函数是两种不同类型函数的乘积时，考虑分部积分。
特征：
- 含对数、反三角函数 → 通常选作 u
- 多项式 × 指数/三角 → 多项式作 u`
      },
      { 
        number: 2, 
        title: '正确选择u和dv', 
        description: `遵循"反对幂三指"原则：
- u：微分后变简单的
- dv：积分后不会变复杂的`
      },
      { 
        number: 3, 
        title: '处理循环情况', 
        description: `如果分部积分后出现原积分：
1. 不要慌，这是正常的
2. 移项，解方程
3. 注意加常数 C`
      },
    ],
  },
}

// 定积分定义知识点
const definiteIntegralPoint: KnowledgePoint = {
  id: 'definite-integral',
  moduleId: 'integral',
  name: '定积分的定义',
  formula: '\\int_a^b f(x) \\, dx = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i) \\Delta x_i',
  coreSentence: '定积分是"无限细分，无限累加"——把曲线下的面积切成无数细条，再求这些细条面积的和。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2', color: '#5D4037', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 4, max: 100, step: 1, defaultValue: 4, label: '分割数 n' },
          { id: 'a', name: 'a', min: 0, max: 2, step: 0.1, defaultValue: 0, label: '下限 a' },
          { id: 'b', name: 'b', min: 0.5, max: 3, step: 0.1, defaultValue: 2, label: '上限 b' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '黎曼和逼近',
          type: 'step',
          steps: [
            { id: 's1', description: '分割数n=4，矩形较宽，近似粗糙', changes: { n: 4 } },
            { id: 's2', description: 'n=10，矩形变窄，近似改善', changes: { n: 10 } },
            { id: 's3', description: 'n=25，更细腻的逼近', changes: { n: 25 } },
            { id: 's4', description: 'n=50，精度明显提高', changes: { n: 50 } },
            { id: 's5', description: 'n=100，几乎与曲线重合！', changes: { n: 100 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：分割、近似、求和、取极限**

定积分是解决"求总量"问题的利器。无论是求面积、体积、路程还是质量，都可以用定积分来解决。

**四个步骤**：
1. **分割**：把整体切成小块
2. **近似**：每小块用简单量近似
3. **求和**：所有小块加起来
4. **取极限**：让小块无限小

---

**📐 数学定义（黎曼积分）**

设函数 f(x) 在 [a, b] 上有界，对 [a, b] 作任意分割，在每个小区间上任取一点 ξᵢ，作和式：

$$S_n = \\sum_{i=1}^{n} f(\\xi_i) \\Delta x_i$$

称为**黎曼和**。当分割的最大区间长度 λ → 0 时，若 S_n 趋于确定的极限 I，则称 I 为 f(x) 在 [a, b] 上的定积分，记作：

$$\\int_a^b f(x) \\, dx = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i) \\Delta x_i$$

---

**🎭 几何意义**

**曲线下的面积**：当 f(x) ≥ 0 时，定积分 ∫ₐᵇ f(x)dx 表示曲线 y = f(x) 与 x 轴、x=a、x=b 围成的曲边梯形面积。

**更一般的情况**：
- f(x) > 0：面积为正
- f(x) < 0：面积为负
- 总积分 = 正负面积的代数和

---

**🧩 黎曼和的三种形式**

**左端点法**：ξᵢ 取小区间左端点
$$S_L = \\sum_{i=1}^{n} f(x_{i-1}) \\Delta x$$

**右端点法**：ξᵢ 取小区间右端点
$$S_R = \\sum_{i=1}^{n} f(x_i) \\Delta x$$

**中点法**：ξᵢ 取小区间中点（精度最高）
$$S_M = \\sum_{i=1}^{n} f\\left(\\frac{x_{i-1} + x_i}{2}\\right) \\Delta x$$

当分割无限细时，三种方法的结果趋于相同！

---

**📐 定积分的性质**

**性质1：线性性**
$$\\int_a^b [αf(x) + βg(x)]dx = α\\int_a^b f(x)dx + β\\int_a^b g(x)dx$$

**性质2：区间可加性**
$$\\int_a^b f(x)dx = \\int_a^c f(x)dx + \\int_c^b f(x)dx$$

**性质3：积分上下限交换**
$$\\int_a^b f(x)dx = -\\int_b^a f(x)dx$$

**性质4：积分中值定理**
$$\\int_a^b f(x)dx = f(ξ)(b-a), \\quad ξ \\in [a, b]$$
*几何意义：曲边梯形面积 = 等宽矩形面积*

---

**⚠️ 常见误区**

**误区1**："定积分一定表示面积"
- **纠正**：定积分是面积的代数和，有正负之分
- **例子**：∫₀²π sin x dx = 0，但曲线与x轴围成的"面积"是4

**误区2**："积分变量不同，积分结果不同"
- **纠正**：定积分的结果是数，与积分变量符号无关
- **事实**：∫ₐᵇ f(x)dx = ∫ₐᵇ f(t)dt（换元不换值）`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：从"有限和"到"无限和"**

定积分的本质是**求和的极限**，它把离散的求和运算推广到连续的情况。

| 离散 | 连续 |
|-----|------|
| 求和 Σ | 积分 ∫ |
| 有限项 | 无穷项 |
| Δx 固定 | dx 无穷小 |

**积分与导数的关系**

牛顿-莱布尼茨公式揭示了积分与导数的内在联系：

$$\\int_a^b f(x)dx = F(b) - F(a)$$

其中 F(x) 是 f(x) 的原函数。

这个公式被称为**微积分基本定理**，它把求积分的问题转化为求原函数的问题。

---

**🎓 可积性理论**

**定理**：若 f(x) 在 [a, b] 上连续，则 f(x) 在 [a, b] 上可积。

**更一般的条件**：
1. 连续 ⟹ 可积
2. 有界且只有有限个间断点 ⟹ 可积
3. 单调 ⟹ 可积

**不可积的例子**：
- 狄利克雷函数：D(x) = 1（x为有理数），0（x为无理数），在任何区间都不可积`,
      extension: `**🚀 从定积分到不定积分**

**不定积分**：求原函数
$$\\int f(x)dx = F(x) + C$$

**定积分**：求数值
$$\\int_a^b f(x)dx = F(b) - F(a)$$

**联系**：牛顿-莱布尼茨公式

---

**📐 基本积分公式**

| f(x) | ∫f(x)dx |
|------|---------|
| xⁿ (n≠-1) | xⁿ⁺¹/(n+1) + C |
| 1/x | ln\|x\| + C |
| eˣ | eˣ + C |
| aˣ | aˣ/ln a + C |
| sin x | -cos x + C |
| cos x | sin x + C |
| sec²x | tan x + C |
| 1/√(1-x²) | arcsin x + C |
| 1/(1+x²) | arctan x + C |

---

**🎓 积分方法**

**1. 换元积分法**
$$\\int f[g(x)]g'(x)dx = \\int f(u)du$$

**2. 分部积分法**
$$\\int u\\,dv = uv - \\int v\\,du$$

**选择技巧**：
- 反三角函数、对数函数优先设为 u
- 幂函数、指数函数优先设为 v'

---

**🌟 定积分的应用**

**1. 平面图形面积**
$$S = \\int_a^b |f(x) - g(x)|dx$$

**2. 旋转体体积**
$$V = \\pi \\int_a^b [f(x)]^2 dx$$

**3. 曲线弧长**
$$L = \\int_a^b \\sqrt{1 + [f'(x)]^2}dx$$

**4. 变力做功**
$$W = \\int_a^b F(x)dx$$

**5. 液体压力**
$$P = \\rho g \\int_a^b x \\cdot f(x)dx$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '水箱注水问题',
        description: `**问题描述**

一个圆柱形水箱，底面半径 2m，高 5m。从底部注水，水位上升速度为 0.1 m/min。问注满水箱需要做多少功？

**数学建模**

- 水的密度 ρ = 1000 kg/m³
- 重力加速度 g = 9.8 m/s²
- 水位高度 h，水层重量 dW = ρg·πr²·dh
- 提升高度 (5-h)

**积分计算**
$$W = \\int_0^5 \\rho g \\cdot \\pi r^2 (5-h)dh = 1000 \\times 9.8 \\times \\pi \\times 4 \\times \\frac{25}{2} = 490000\\pi \\text{ J}$$`,
        scenario: '可视化展示水层分割和功的累积过程。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '概率密度函数与期望',
        description: `**概率论背景**

连续随机变量 X 的概率密度函数为 f(x)，则：
- $P(a \\le X \\le b) = \\int_a^b f(x)dx$
- $E(X) = \\int_{-\\infty}^{\\infty} x \\cdot f(x)dx$

**例子：正态分布**
$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

**验证**：$\\int_{-\\infty}^{\\infty} f(x)dx = 1$（概率归一化）`,
        scenario: '展示概率密度曲线下的面积与概率的关系。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '确定积分限', 
        description: `分析问题，确定积分变量和积分限：
- 求面积：找出边界交点
- 求体积：确定旋转轴和边界
- 求物理量：分析变化范围`
      },
      { 
        number: 2, 
        title: '写出积分表达式', 
        description: `根据几何或物理意义，写出被积函数：
- 面积：$|f(x) - g(x)|$
- 体积：$\\pi [f(x)]^2$
- 弧长：$\\sqrt{1+(f')^2}$
- 功：力×位移微元`
      },
      { 
        number: 3, 
        title: '计算定积分', 
        description: `利用牛顿-莱布尼茨公式或数值方法：
1. 先求原函数（不定积分）
2. 代入上下限
3. 计算差值

技巧：对称性、换元法、分部积分`
      },
    ],
  },
}

// 二阶常系数线性微分方程知识点
const secondOrderODEPoint: KnowledgePoint = {
  id: 'second-order-ode',
  moduleId: 'differential-equations',
  name: '二阶常系数线性微分方程',
  formula: "y'' + py' + qy = f(x)",
  coreSentence: '二阶常系数线性微分方程的解法核心是"齐次通解+非齐次特解"——先求特征根写出齐次通解，再用待定系数法求特解。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'y(x)', color: '#D4A574', visible: true },
        ],
        points: [
          { id: 'p1', x: 'x0', y: 'y0', draggable: false, color: '#C62828', label: '初始点' },
        ],
        sliders: [
          { id: 'p', name: 'p', min: -5, max: 5, step: 0.1, defaultValue: 0, label: '系数 p' },
          { id: 'q', name: 'q', min: 0, max: 10, step: 0.1, defaultValue: 1, label: '系数 q' },
          { id: 'x0', name: 'x0', min: -5, max: 5, step: 0.1, defaultValue: 0, label: '初始位置 x₀' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '特征根变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'p=0, q=1：特征根为±i，振动解', changes: { p: 0, q: 1 } },
            { id: 's2', description: 'p=1, q=1：特征根重根r=-1，临界阻尼', changes: { p: 2, q: 1 } },
            { id: 's3', description: 'p=3, q=1：特征根不等实根，过阻尼', changes: { p: 3, q: 1 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：通解结构**

二阶常系数线性微分方程是微分方程中最重要、最实用的类型之一。它的解法有完整的理论体系，核心思想是"叠加原理"。

---

**📐 方程形式**

**齐次方程**：
$$y'' + py' + qy = 0$$

**非齐次方程**：
$$y'' + py' + qy = f(x)$$

其中 p、q 为常数。

---

**🔑 特征方程法（求齐次通解）**

**第一步：写出特征方程**
$$r^2 + pr + q = 0$$

**第二步：求特征根，写通解**

| 特征根情况 | 齐次通解形式 |
|-----------|-------------|
| 不等实根 r₁≠r₂ | $y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$ |
| 重根 r₁=r₂=r | $y = (C_1 + C_2 x) e^{rx}$ |
| 共轭复根 α±iβ | $y = e^{αx}(C_1 \\cos βx + C_2 \\sin βx)$ |

---

**📝 特解的求法（待定系数法）**

**情况1：f(x) = P_m(x)e^{λx}（指数型）**

设特解：$y^* = x^k Q_m(x) e^{λx}$

其中 k = λ 作为特征根的重数（0, 1, 2）

**情况2：f(x) = e^{αx}[P_m \\cos βx + Q_n \\sin βx]（三角型）**

设特解：$y^* = x^k e^{αx}[A \\cos βx + B \\sin βx]$

其中 k = 0 若 α±iβ 不是特征根，k = 1 若是特征根

---

**⚠️ 常见误区**

**误区1**："特解形式与f(x)相同"
- **纠正**：要根据特征根调整，乘以x^k因子

**误区2**："通解只要齐次通解"
- **纠正**：非齐次方程通解 = 齐次通解 + 特解

**误区3**："复根情况太难记"
- **技巧**：记 "欧拉公式" e^(iβx) = cos(βx) + i·sin(βx)`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：线性叠加原理**

二阶线性微分方程最核心的性质是**叠加原理**：

若 y₁、y₂ 是齐次方程的解，则 $C_1 y_1 + C_2 y_2$ 也是解。

这就是为什么齐次通解可以写成两个基解的线性组合。

---

**📐 解的结构定理**

**定理1（齐次解的结构）**
若 y₁、y₂ 线性无关（朗斯基行列式 W(y₁,y₂) ≠ 0），则齐次方程的所有解可表示为：
$$y = C_1 y_1 + C_2 y_2$$

**定理2（非齐次解的结构）**
非齐次方程的通解 = 对应齐次方程通解 + 非齐次方程特解
$$y = \\bar{y} + y^*$$

---

**🎓 解的存在唯一性**

**定理**：若 p、q、f(x) 在区间 I 上连续，则初值问题
$$y'' + py' + qy = f(x), \\quad y(x_0) = y_0, \\quad y'(x_0) = y'_0$$
在 I 上存在唯一解。

这保证了我们可以放心地求特解！`,
      extension: `**🚀 高阶常系数方程**

n阶常系数齐次方程：
$$y^{(n)} + a_1 y^{(n-1)} + \\cdots + a_n y = 0$$

特征方程有n个根，每个k重根r贡献：
$$e^{rx}(C_1 + C_2 x + \\cdots + C_k x^{k-1})$$

---

**📐 欧拉方程**

形式：
$$x^n y^{(n)} + a_1 x^{n-1} y^{(n-1)} + \\cdots + a_n y = f(x)$$

**解法**：令 x = e^t（或 t = ln x），化为常系数方程。

**原理**：
- $x \\frac{d}{dx} = \\frac{d}{dt} = D$
- $x^2 \\frac{d^2}{dx^2} = D(D-1)$
- 以此类推...

---

**🎓 常数变易法**

当待定系数法不适用时，用常数变易法求特解：

设齐次通解 $y = C_1 y_1 + C_2 y_2$，令
$$y^* = C_1(x) y_1 + C_2(x) y_2$$

解方程组：
$$\\begin{cases} C_1' y_1 + C_2' y_2 = 0 \\\\ C_1' y_1' + C_2' y_2' = f(x) \\end{cases}$$

---

**🌟 物理应用**

**阻尼振动**：
$$m x'' + c x' + k x = 0$$

- 欠阻尼（c² < 4mk）：振动衰减
- 临界阻尼（c² = 4mk）：最快回到平衡位置
- 过阻尼（c² > 4mk）：缓慢回到平衡位置`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '弹簧阻尼系统',
        description: `**物理背景**

质量为 m 的物体连接弹簧，弹簧系数 k，阻尼系数 c。

**运动方程**
$$m x'' + c x' + k x = 0$$

**三种情况分析**

| 条件 | 特征根 | 运动类型 |
|-----|--------|---------|
| c² < 4mk | 共轭复根 | 欠阻尼振动 |
| c² = 4mk | 重根 | 临界阻尼 |
| c² > 4mk | 不等实根 | 过阻尼 |

**工程意义**：汽车避震器设计需要选择合适的阻尼系数，使系统接近临界阻尼。`,
        scenario: '可视化展示三种阻尼情况下的位移-时间曲线。',
      },
      {
        id: 'app2',
        type: 'real',
        title: 'RLC电路',
        description: `**电路背景**

电感 L、电阻 R、电容 C 串联，接交流电源 E(t)。

**电荷方程**
$$L q'' + R q' + \\frac{1}{C} q = E(t)$$

**与力学系统类比**

| 力学系统 | 电路系统 |
|---------|---------|
| 位移 x | 电荷 q |
| 质量 m | 电感 L |
| 阻尼 c | 电阻 R |
| 弹簧系数 k | 1/C |
| 外力 F(t) | 电源 E(t) |

**应用**：收音机调谐电路、滤波器设计。`,
        scenario: '展示RLC电路中电荷随时间的变化。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '共振现象',
        description: `**问题描述**

考虑受迫振动方程：
$$x'' + 2βx' + ω_0^2 x = F_0 \\cos ωt$$

**共振条件**

当驱动频率 ω 接近固有频率 $\\sqrt{ω_0^2 - 2β^2}$ 时，振幅最大。

**数学分析**

特解形式：
$$x_p = A \\cos ωt + B \\sin ωt$$

振幅：
$$A_{max} = \\frac{F_0}{2β\\sqrt{ω_0^2 - β^2}}$$

当阻尼 β → 0 时，振幅趋于无穷（共振灾难）。`,
        scenario: '可视化展示不同驱动频率下的振幅响应。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '写特征方程，求特征根', 
        description: `对于齐次方程 $y'' + py' + qy = 0$：
1. 写出特征方程 $r^2 + pr + q = 0$
2. 求根：$r = \\frac{-p \\pm \\sqrt{p^2-4q}}{2}$
3. 根据根的情况写齐次通解

记忆口诀："不等两实根，重根乘以x，复根cos加sin"`
      },
      { 
        number: 2, 
        title: '设特解形式，待定系数', 
        description: `根据 $f(x)$ 的形式设特解：
- 指数型 $f(x) = P_m(x)e^{\\lambda x}$：设 $y^* = x^k Q_m(x)e^{\\lambda x}$
- 三角型 $f(x) = e^{\\alpha x}[P\\cos\\beta x + Q\\sin\\beta x]$：设 $y^* = x^k e^{\\alpha x}[A\\cos\\beta x + B\\sin\\beta x]$

k 的取值：$\\lambda$ 或 $\\alpha\\pm i\\beta$ 不是特征根→k=0；是单根→k=1；是重根→k=2`
      },
      { 
        number: 3, 
        title: '代入求系数，写通解', 
        description: `1. 将特解 $y^*$ 代入原方程
2. 比较两边系数，求出待定系数
3. 写出通解：$y = \\bar{y} + y^*$

最后用初始条件确定 $C_1$、$C_2$（如果有）`
      },
    ],
  },
}

// 一阶微分方程知识点
const firstOrderODEPoint: KnowledgePoint = {
  id: 'first-order-ode',
  moduleId: 'differential-equations',
  name: '一阶微分方程',
  formula: "\\frac{dy}{dx} = f(x, y)",
  coreSentence: '一阶微分方程的核心是"识别类型，选择方法"——可分离变量直接积分，齐次方程换元，线性方程套公式。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'y(x)', color: '#D4A574', visible: true },
        ],
        points: [
          { id: 'p1', x: 'x0', y: 'y0', draggable: false, color: '#C62828', label: '初始点' },
        ],
        sliders: [
          { id: 'C', name: 'C', min: -3, max: 3, step: 0.1, defaultValue: 1, label: '常数 C' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '解曲线变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'C=1 的解曲线', changes: { C: 1 } },
            { id: 's2', description: 'C=0 的解曲线', changes: { C: 0 } },
            { id: 's3', description: 'C=-1 的解曲线', changes: { C: -1 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：分类求解**

一阶微分方程没有统一的解法，关键是**识别方程类型**，然后选择对应的方法。

---

**📐 类型一：可分离变量方程**

**形式**：
$$\\frac{dy}{dx} = f(x)g(y)$$

**解法**：分离变量后两边积分
$$\\int \\frac{dy}{g(y)} = \\int f(x)dx$$

**例**：$\\frac{dy}{dx} = xy$
$$\\int \\frac{dy}{y} = \\int x dx \\Rightarrow \\ln|y| = \\frac{x^2}{2} + C$$

---

**📐 类型二：齐次方程**

**形式**：
$$\\frac{dy}{dx} = f\\left(\\frac{y}{x}\\right)$$

**解法**：令 $u = \\frac{y}{x}$，则 $y = xu$，$\\frac{dy}{dx} = u + x\\frac{du}{dx}$

代入后化为可分离变量方程：
$$x\\frac{du}{dx} = f(u) - u$$

---

**📐 类型三：一阶线性方程**

**形式**：
$$\\frac{dy}{dx} + P(x)y = Q(x)$$

**通解公式**：
$$y = e^{-\\int Pdx}\\left(\\int Qe^{\\int Pdx}dx + C\\right)$$

**记忆**：先求积分因子 $μ = e^{\\int Pdx}$，再套公式。

---

**📐 类型四：伯努利方程**

**形式**：
$$\\frac{dy}{dx} + P(x)y = Q(x)y^n \\quad (n \\neq 0, 1)$$

**解法**：令 $z = y^{1-n}$，化为一阶线性方程。

---

**⚠️ 常见误区**

**误区1**：看到 y' = xy 就直接积分
- **纠正**：这是可分离变量方程，要先分离：dy/y = xdx

**误区2**：线性方程公式记不住
- **技巧**：先求积分因子 μ(x)，再两边乘以 μ`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：变量替换**

一阶微分方程的各种解法，本质上都是通过**变量替换**将复杂方程化为简单形式。

| 原方程类型 | 变量替换 | 目标形式 |
|-----------|---------|---------|
| 齐次方程 | u = y/x | 可分离变量 |
| 伯努利方程 | z = y^(1-n) | 一阶线性 |
| 全微分方程 | 找积分因子 | 全微分形式 |

---

**🎓 全微分方程**

**形式**：$P(x,y)dx + Q(x,y)dy = 0$

**判断**：若 $\\frac{∂P}{∂y} = \\frac{∂Q}{∂x}$，则为全微分方程

**解法**：找 u(x,y) 使 du = Pdx + Qdy，通解 u(x,y) = C

**积分因子**：若不是全微分方程，可尝试找积分因子 μ 使其成为全微分方程。

常用积分因子：
- 若 $\\frac{1}{Q}(\\frac{∂P}{∂y} - \\frac{∂Q}{∂x})$ 仅含 x，则 μ = e^(∫f(x)dx)
- 若 $\\frac{1}{P}(\\frac{∂Q}{∂x} - \\frac{∂P}{∂y})$ 仅含 y，则 μ = e^(∫g(y)dy)`,
      extension: `**🚀 解的存在唯一性**

**皮卡定理**：若 f(x,y) 在矩形区域 R 内连续且关于 y 满足李普希茨条件，则初值问题
$$\\frac{dy}{dx} = f(x,y), \\quad y(x_0) = y_0$$
在 x₀ 附近存在唯一解。

**几何意义**：积分曲线不相交。

---

**📐 解的几何解释**

一阶微分方程 $\\frac{dy}{dx} = f(x,y)$ 的解是平面上的一族曲线（积分曲线族）。

**方向场**：在平面上每点画一个小线段，斜率为 f(x,y)。积分曲线处处与方向场相切。

---

**🌟 应用实例**

**人口增长模型（Malthus）**：
$$\\frac{dN}{dt} = rN \\Rightarrow N(t) = N_0 e^{rt}$$

**Logistic模型**：
$$\\frac{dN}{dt} = rN(1 - \\frac{N}{K}) \\Rightarrow N(t) = \\frac{K}{1 + (\\frac{K}{N_0} - 1)e^{-rt}}$$

**冷却定律**：
$$\\frac{dT}{dt} = -k(T - T_0) \\Rightarrow T(t) = T_0 + (T_1 - T_0)e^{-kt}$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '牛顿冷却定律',
        description: `**物理背景**

物体温度 T 的变化率与它和环境温度 T₀ 之差成正比。

**数学模型**
$$\\frac{dT}{dt} = -k(T - T_0)$$

**求解**
$$\\int \\frac{dT}{T - T_0} = -k\\int dt \\Rightarrow \\ln|T - T_0| = -kt + C$$

**结果**
$$T(t) = T_0 + (T_1 - T_0)e^{-kt}$$

其中 T₁ 是初始温度，k 是冷却系数。`,
        scenario: '可视化展示不同初始温度下的冷却曲线。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '人口增长模型',
        description: `**Malthus模型**（理想增长）
$$\\frac{dN}{dt} = rN \\Rightarrow N = N_0 e^{rt}$$

问题：无限制增长，不符合实际。

**Logistic模型**（有环境容纳量K）
$$\\frac{dN}{dt} = rN(1 - \\frac{N}{K})$$

**分离变量求解**
$$\\int \\frac{dN}{N(1-N/K)} = \\int r dt$$

**结果**（S型曲线）
$$N(t) = \\frac{K}{1 + (\\frac{K}{N_0} - 1)e^{-rt}}$$`,
        scenario: '对比指数增长与Logistic增长曲线。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '药物代谢模型',
        description: `**医学背景**

血液中药物浓度 C 随时间递减，假设按一级动力学消除。

**数学模型**
$$\\frac{dC}{dt} = -kC$$

**解**：$C(t) = C_0 e^{-kt}$

**半衰期**：$t_{1/2} = \\frac{\\ln 2}{k}$

**应用**：
- 确定给药间隔
- 计算稳态血药浓度
- 个体化给药方案`,
        scenario: '展示药物浓度衰减曲线和半衰期。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '识别方程类型', 
        description: `观察方程形式，判断属于哪种类型：
1. $y' = f(x)g(y)$ → 可分离变量
2. $y' = f(y/x)$ → 齐次方程
3. $y' + P(x)y = Q(x)$ → 一阶线性
4. $y' + Py = Qy^n$ → 伯努利方程
5. $Pdx + Qdy = 0$ → 检验是否全微分`
      },
      { 
        number: 2, 
        title: '选择对应方法', 
        description: `根据类型选择解法：
- 可分离变量：分离后积分
- 齐次方程：令 $u=y/x$ 换元
- 一阶线性：套通解公式
- 伯努利：令 $z=y^{1-n}$
- 全微分：找原函数或积分因子`
      },
      { 
        number: 3, 
        title: '求解并验证', 
        description: `1. 执行求解过程
2. 检查是否遗漏特解（如 $y=0$）
3. 用初始条件确定常数
4. 验证解的正确性（代入原方程）`
      },
    ],
  },
}

// 可降阶微分方程知识点
const reducibleODEPoint: KnowledgePoint = {
  id: 'reducible-ode',
  moduleId: 'differential-equations',
  name: '可降阶微分方程',
  formula: "y^{(n)} = f(x, y, y', \\cdots, y^{(n-1)})",
  coreSentence: '可降阶方程的核心是"缺谁降谁"——缺y令p=y\'，缺x令p=y\'并注意y\'\'=p·dp/dy。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'C1', name: 'C1', min: -2, max: 2, step: 0.1, defaultValue: 1, label: '常数 C₁' },
          { id: 'C2', name: 'C2', min: -2, max: 2, step: 0.1, defaultValue: 0, label: '常数 C₂' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：降阶法**

高阶微分方程若能降低阶数，就可能化为已知的可解形式。关键在于观察方程中**缺什么变量**。

---

**📐 类型一：y'' = f(x) 型**

**特点**：方程中只有 x，缺 y 和 y'

**解法**：直接积分两次
$$y' = \\int f(x)dx + C_1$$
$$y = \\iint f(x)dx dx + C_1 x + C_2$$

**例**：$y'' = x^2$
$$y' = \\frac{x^3}{3} + C_1, \\quad y = \\frac{x^4}{12} + C_1 x + C_2$$

---

**📐 类型二：y'' = f(x, y') 型**

**特点**：方程中缺 y

**解法**：令 $p = y'$，则 $y'' = \\frac{dp}{dx}$

$$\\frac{dp}{dx} = f(x, p)$$

化为一阶方程求解，得 p = p(x, C₁)

然后 $y = \\int p(x, C_1)dx + C_2$

**例**：$y'' = y' + x$
$$p' = p + x \\Rightarrow p = Ce^x - x - 1$$
$$y = \\int (Ce^x - x - 1)dx = Ce^x - \\frac{x^2}{2} - x + C_2$$

---

**📐 类型三：y'' = f(y, y') 型**

**特点**：方程中缺 x

**解法**：令 $p = y'$，但注意 $y'' = \\frac{dp}{dx} = \\frac{dp}{dy} \\cdot \\frac{dy}{dx} = p \\frac{dp}{dy}$

$$p \\frac{dp}{dy} = f(y, p)$$

化为关于 y 和 p 的一阶方程。

**例**：$y'' = y$
$$p \\frac{dp}{dy} = y \\Rightarrow p dp = y dy$$
$$\\frac{p^2}{2} = \\frac{y^2}{2} + C_1 \\Rightarrow p = \\pm\\sqrt{y^2 + C_1}$$
$$\\frac{dy}{dx} = \\pm\\sqrt{y^2 + C_1}$$

---

**⚠️ 关键记忆**

| 缺失变量 | 换元方法 | y'' 的表达 |
|---------|---------|-----------|
| 缺 y | p = y' | y'' = dp/dx |
| 缺 x | p = y' | y'' = p·dp/dy |

**口诀**："缺y用dx，缺x用dy"`,
      highlights: [],
    },
    
    extension: {
      essence: `**🔮 核心内涵：变量替换的艺术**

降阶法的本质是通过巧妙的变量替换，将高阶问题降维打击。

**数学思想**：
- 降维：n阶 → n-1阶
- 分治：先解低阶，再回代
- 恒等变换：$y'' = \\frac{d}{dx}(y') = \\frac{dp}{dx} = \\frac{dp}{dy} \\cdot \\frac{dy}{dx}$

---

**🎓 更高阶的可降阶方程**

**y^(n) = f(x) 型**：连续积分 n 次

**缺中间变量的高阶方程**：类似方法降阶`,
      extension: `**🚀 物理中的应用**

**自由落体运动**

加速度为常数 g：
$$\\frac{d^2s}{dt^2} = g$$

积分两次：
$$v = \\frac{ds}{dt} = gt + v_0$$
$$s = \\frac{1}{2}gt^2 + v_0 t + s_0$$

---

**🎯 解题技巧**

**技巧1**：先判断缺什么变量

**技巧2**：注意常数 C₁、C₂ 的积分处理

**技巧3**：有些方程可能同时缺多种变量，需要灵活处理

---

**📐 与二阶常系数方程的关系**

二阶常系数方程 y'' + py' + qy = f(x) 不能用降阶法，因为有 y 项。

但特殊情况下可以：
- 若 p = q = 0，就是 y'' = f(x) 型
- 若 p ≠ 0, q = 0，是 y'' = f(x, y') 型`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '自由落体与抛体运动',
        description: `**物理背景**

只考虑重力，忽略空气阻力。

**运动方程**
$$\\frac{d^2y}{dt^2} = -g$$

**求解**
$$\\frac{dy}{dt} = -gt + v_0$$
$$y = -\\frac{1}{2}gt^2 + v_0 t + y_0$$

**抛体运动**（斜抛）
$$\\frac{d^2x}{dt^2} = 0, \\quad \\frac{d^2y}{dt^2} = -g$$`,
        scenario: '可视化展示抛体运动轨迹。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '悬链线问题',
        description: `**问题描述**

悬挂在两点的均匀绳索形成的曲线是什么？

**数学建模**

设绳索单位长重量为 ρ，张力为 T。

**方程推导**
$$\\frac{d^2y}{dx^2} = \\frac{ρg}{T}\\sqrt{1 + (y')^2}$$

这是 y'' = f(y') 型（缺 y）

**求解**：令 p = y'
$$\\frac{dp}{dx} = \\frac{1}{a}\\sqrt{1 + p^2}$$

**结果**：悬链线
$$y = a \\cosh\\frac{x}{a} = \\frac{a}{2}(e^{x/a} + e^{-x/a})$$`,
        scenario: '展示悬链线的形状。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断缺什么变量', 
        description: `观察方程中是否缺 y 或缺 x：
- 只出现 x → $y'' = f(x)$ 型
- 出现 $x, y'$ 但无 y → $y'' = f(x, y')$ 型
- 出现 $y, y'$ 但无 x → $y'' = f(y, y')$ 型`
      },
      { 
        number: 2, 
        title: '选择换元方式', 
        description: `根据缺失变量选择换元：
- $y'' = f(x)$：直接积分
- $y'' = f(x, y')$：令 $p = y'$，$y'' = dp/dx$
- $y'' = f(y, y')$：令 $p = y'$，$y'' = p \\cdot dp/dy$`
      },
      { 
        number: 3, 
        title: '求解一阶方程', 
        description: `换元后得到一阶方程：
1. 用一阶方程的方法求解
2. 积分求出原函数
3. 确定常数 $C_1$、$C_2$`
      },
    ],
  },
}

// ============================================
// 多元函数积分学知识点
// ============================================

// 二重积分知识点
const doubleIntegralPoint: KnowledgePoint = {
  id: 'double-integral',
  moduleId: 'multivariable-integral',
  name: '二重积分',
  formula: '\\iint_D f(x, y) \\, dA = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta\\sigma_i',
  coreSentence: '二重积分是"把区域切成无数小块，每块乘上函数值再累加"——计算曲顶柱体体积的核心工具。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x^2 + y^2', color: '#5D4037', visible: true },
        ],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 4, max: 50, step: 1, defaultValue: 10, label: '分割数 n' },
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
            { id: 's3', description: 'n=25，精细分割', changes: { n: 25 } },
            { id: 's4', description: 'n=50，极限逼近', changes: { n: 50 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：从一维到二维的推广**

二重积分是定积分在二维区域上的自然推广。它解决的核心问题是：如何计算"曲顶柱体"的体积？

---

**📐 定义**

设 $f(x, y)$ 在有界闭区域 $D$ 上有界。将 $D$ 任意分成 $n$ 个小区域 $\\Delta\\sigma_1, \\cdots, \\Delta\\sigma_n$，在每个小区域上任取一点 $(\\xi_i, \\eta_i)$，作和：

$$\\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta\\sigma_i$$

若当各小区域直径的最大值 $\\lambda \\to 0$ 时，此和的极限存在，则称此极限为 $f(x,y)$ 在 $D$ 上的**二重积分**，记作：

$$\\iint_D f(x, y) \\, d\\sigma$$

---

**📝 直角坐标系下的计算**

**X型区域**（$a \\leq x \\leq b$, $\\varphi_1(x) \\leq y \\leq \\varphi_2(x)$）：

$$\\iint_D f(x,y) d\\sigma = \\int_a^b dx \\int_{\\varphi_1(x)}^{\\varphi_2(x)} f(x,y) dy$$

**Y型区域**（$c \\leq y \\leq d$, $\\psi_1(y) \\leq x \\leq \\psi_2(y)$）：

$$\\iint_D f(x,y) d\\sigma = \\int_c^d dy \\int_{\\psi_1(y)}^{\\psi_2(y)} f(x,y) dx$$

---

**🔄 极坐标变换**

当区域为圆域或部分圆域时，极坐标更方便：

$$x = r\\cos\\theta, \\quad y = r\\sin\\theta$$

$$d\\sigma = r \\, dr \\, d\\theta$$

$$\\iint_D f(x,y) d\\sigma = \\iint_{D'} f(r\\cos\\theta, r\\sin\\theta) \\cdot r \\, dr \\, d\\theta$$`,
      highlights: [],
    },
    
    extension: {
      essence: `二重积分的本质是**二维黎曼和的极限**。它将"积分"思想从一维直线推广到二维平面区域。

从物理角度看，若 $f(x,y)$ 表示面密度，则二重积分给出区域的总质量；若 $f(x,y) = 1$，则积分给出区域的面积。

**几何意义**：当 $f(x,y) \\geq 0$ 时，二重积分表示以 $D$ 为底、$z = f(x,y)$ 为顶的曲顶柱体体积。`,
      extension: `**对称性技巧**：
- 若 $D$ 关于 $x$ 轴对称，$f(x,-y) = f(x,y)$ 则可只算上半部分再乘2
- 若 $D$ 关于 $y$ 轴对称，类似处理

**广义极坐标**：对于椭圆区域，可用 $x = ar\\cos\\theta, y = br\\sin\\theta$，此时 $d\\sigma = abr \\, dr \\, d\\theta$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算平面图形面积',
        description: `利用二重积分计算不规则区域的面积：
$$S = \\iint_D d\\sigma$$

**例**：计算半径为 $R$ 的圆的面积。
用极坐标：$S = \\int_0^{2\\pi} d\\theta \\int_0^R r \\, dr = 2\\pi \\cdot \\frac{R^2}{2} = \\pi R^2$`,
        scenario: '验证经典公式，加深理解。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算曲顶柱体体积',
        description: `计算 $z = x^2 + y^2$ 在圆域 $x^2 + y^2 \\leq 1$ 上的体积。

用极坐标：
$$V = \\iint_D (x^2 + y^2) d\\sigma = \\int_0^{2\\pi} d\\theta \\int_0^1 r^2 \\cdot r \\, dr = 2\\pi \\cdot \\frac{1}{4} = \\frac{\\pi}{2}$$`,
        scenario: '展示极坐标在圆形区域计算中的优势。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '质心与转动惯量',
        description: `平面薄板的质心：
$$\\bar{x} = \\frac{\\iint_D x \\rho(x,y) d\\sigma}{M}, \\quad \\bar{y} = \\frac{\\iint_D y \\rho(x,y) d\\sigma}{M}$$

转动惯量：
$$I_x = \\iint_D y^2 \\rho(x,y) d\\sigma, \\quad I_y = \\iint_D x^2 \\rho(x,y) d\\sigma$$`,
        scenario: '物理应用，展示二重积分的工程价值。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '画区域定类型', 
        description: `画出积分区域 $D$，判断是X型还是Y型：
- X型：从左到右，下边界一个函数，上边界一个函数
- Y型：从下到上，左边界一个函数，右边界一个函数

选型原则：看哪种类型不需要分段，优先选择。`
      },
      { 
        number: 2, 
        title: '定积分限，化二重为累次', 
        description: `X型：$\\int_a^b dx \\int_{y_1(x)}^{y_2(x)} f(x,y) dy$
- 外层：$x$ 从最小到最大
- 内层：$y$ 从下边界到上边界

Y型：$\\int_c^d dy \\int_{x_1(y)}^{x_2(y)} f(x,y) dx$
- 外层：$y$ 从最小到最大
- 内层：$x$ 从左边界到右边界`
      },
      { 
        number: 3, 
        title: '计算累次积分', 
        description: `先算内层（把外层变量当常数），再算外层。

**换序技巧**：若内层积不出来，考虑交换积分顺序。

**极坐标技巧**：区域为圆或扇形，被积函数有 $x^2+y^2$，换极坐标。`
      },
    ],
  },
}

// 三重积分知识点
const tripleIntegralPoint: KnowledgePoint = {
  id: 'triple-integral',
  moduleId: 'multivariable-integral',
  name: '三重积分',
  formula: '\\iiint_\\Omega f(x, y, z) \\, dV = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i, \\zeta_i) \\Delta v_i',
  coreSentence: '三重积分是"把空间区域切成无数小块，累加函数值乘体积"——计算空间物体质量、质心的核心工具。',
  
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
      mainText: `**🎯 核心思想：从二维到三维的推广**

三重积分是二重积分在三维空间上的自然推广。它解决的核心问题是：如何计算空间物体的质量、质心、转动惯量等物理量？

---

**📐 定义**

设 $f(x, y, z)$ 在空间有界闭区域 $\\Omega$ 上有界。将 $\\Omega$ 任意分成 $n$ 个小区域 $\\Delta v_1, \\cdots, \\Delta v_n$，在每个小区域上任取一点 $(\\xi_i, \\eta_i, \\zeta_i)$，作和：

$$\\sum_{i=1}^{n} f(\\xi_i, \\eta_i, \\zeta_i) \\Delta v_i$$

当各小区域直径的最大值 $\\lambda \\to 0$ 时，若极限存在，则称为 $f(x,y,z)$ 在 $\\Omega$ 上的**三重积分**：

$$\\iiint_\\Omega f(x, y, z) \\, dV$$

---

**📝 直角坐标系计算**

**投影法**（先一后二）：
$$\\iiint_\\Omega f dV = \\iint_{D_{xy}} d\\sigma \\int_{z_1(x,y)}^{z_2(x,y)} f(x,y,z) dz$$

**截面法**（先二后一）：
$$\\iiint_\\Omega f dV = \\int_a^b dz \\iint_{D_z} f(x,y,z) d\\sigma$$

---

**🔄 柱坐标变换**

$$x = r\\cos\\theta, \\quad y = r\\sin\\theta, \\quad z = z$$

$$dV = r \\, dr \\, d\\theta \\, dz$$

适用于：旋转体、圆柱形区域

---

**🔄 球坐标变换**

$$x = r\\sin\\varphi\\cos\\theta, \\quad y = r\\sin\\varphi\\sin\\theta, \\quad z = r\\cos\\varphi$$

$$dV = r^2 \\sin\\varphi \\, dr \\, d\\varphi \\, d\\theta$$

适用于：球体、圆锥体`,
      highlights: [],
    },
    
    extension: {
      essence: `三重积分的本质是**三维黎曼和的极限**。

**物理意义**：
- 若 $f(x,y,z)$ = 密度 $\\rho$，则积分 = 物体质量
- 若 $f(x,y,z) = 1$，则积分 = 物体体积
- 若 $f(x,y,z) = x$，则积分可求质心坐标

**对称性**：
- 区域关于 $xy$ 平面对称 + $f$ 关于 $z$ 奇函数 → 积分为0
- 区域关于原点对称 + $f$ 奇函数 → 积分为0`,
      extension: `**广义球坐标**：对于椭球，可用 $x = a r\\sin\\varphi\\cos\\theta$ 等，此时 $dV = abcr^2\\sin\\varphi dr d\\varphi d\\theta$。

**重心公式**：
$$\\bar{x} = \\frac{1}{M}\\iiint_\\Omega x\\rho dV$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算球体体积',
        description: `用球坐标计算半径为 $R$ 的球体体积：

$$V = \\iiint_\\Omega dV = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi} d\\varphi \\int_0^R r^2 \\sin\\varphi dr$$

$$= 2\\pi \\cdot 2 \\cdot \\frac{R^3}{3} = \\frac{4\\pi R^3}{3}$$`,
        scenario: '验证经典球体积公式。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算物体质量',
        description: `半球体 $x^2+y^2+z^2 \\leq R^2, z \\geq 0$，密度 $\\rho = z$。

用球坐标：
$$M = \\iiint_\\Omega z \\, dV = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi/2} d\\varphi \\int_0^R (r\\cos\\varphi) r^2\\sin\\varphi dr$$

$$= 2\\pi \\cdot \\frac{1}{2} \\cdot \\frac{R^4}{4} = \\frac{\\pi R^4}{4}$$`,
        scenario: '展示变密度物体的质量计算。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '分析区域形状', 
        description: `判断区域类型：
- **柱形**：有轴对称，用柱坐标
- **球形**：有球对称，用球坐标
- **一般**：用直角坐标

优先选择让积分限简单的坐标系。`
      },
      { 
        number: 2, 
        title: '确定积分顺序', 
        description: `**投影法**：把区域投影到坐标面，先积一个变量，再积另外两个。

**截面法**：用垂直于某轴的平面截区域，先积截面上的二重积分，再积该轴。

选择原则：哪种方法让被积函数更容易积分。`
      },
      { 
        number: 3, 
        title: '换坐标计算', 
        description: `**柱坐标**：$dV = r dr d\\theta dz$，注意别丢 $r$

**球坐标**：$dV = r^2\\sin\\varphi dr d\\varphi d\\theta$，注意别丢 $r^2\\sin\\varphi$

角度范围：
- $\\theta$：$0$ 到 $2\\pi$
- $\\varphi$：$0$ 到 $\\pi$（从z轴正向到负向）`
      },
    ],
  },
}

// 第一型曲线积分知识点
const lineIntegralType1Point: KnowledgePoint = {
  id: 'line-integral-type1',
  moduleId: 'multivariable-integral',
  name: '第一型曲线积分',
  formula: '\\int_L f(x, y) \\, ds = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta s_i',
  coreSentence: '第一型曲线积分是"沿曲线的累加"——计算曲线质量、质心的核心工具，与方向无关。',
  
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
            { id: 's1', description: 'n=5，粗略分割', changes: { n: 5 } },
            { id: 's2', description: 'n=15，中等分割', changes: { n: 15 } },
            { id: 's3', description: 'n=30，精细分割', changes: { n: 30 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：沿曲线的积分**

第一型曲线积分（对弧长的曲线积分）是将函数值沿曲线"累加"。与定积分不同，这里是在曲线上积分，而不是直线上。

---

**📐 定义**

设 $L$ 为光滑曲线弧，$f(x, y)$ 在 $L$ 上有界。将 $L$ 分成 $n$ 段，每段弧长为 $\\Delta s_i$，取点 $(\\xi_i, \\eta_i)$，作和：

$$\\sum_{i=1}^{n} f(\\xi_i, \\eta_i) \\Delta s_i$$

当最大弧长 $\\lambda \\to 0$ 时，若极限存在，则称为 $f$ 在 $L$ 上的**第一型曲线积分**。

---

**📝 参数方程计算**

若曲线 $L$ 由参数方程给出：
$$x = \\varphi(t), \\quad y = \\psi(t), \\quad \\alpha \\leq t \\leq \\beta$$

则：
$$\\int_L f(x,y) ds = \\int_\\alpha^\\beta f(\\varphi(t), \\psi(t)) \\sqrt{\\varphi'^2(t) + \\psi'^2(t)} dt$$

**注意**：积分限必须从小的参数到大的参数（$\\alpha < \\beta$），因为 $ds > 0$。

---

**📝 直角坐标计算**

若 $L: y = y(x)$, $a \\leq x \\leq b$：

$$\\int_L f(x,y) ds = \\int_a^b f(x, y(x)) \\sqrt{1 + y'^2(x)} dx$$

---

**📝 极坐标计算**

若 $L: r = r(\\theta)$, $\\alpha \\leq \\theta \\leq \\beta$：

$$\\int_L f(x,y) ds = \\int_\\alpha^\\beta f(r\\cos\\theta, r\\sin\\theta) \\sqrt{r^2 + r'^2} d\\theta$$`,
      highlights: [],
    },
    
    extension: {
      essence: `**与定积分的关系**：当曲线为直线段时，第一型曲线积分退化为定积分。

**物理意义**：
- 若 $f(x,y)$ = 线密度 $\\rho$，则积分 = 曲线总质量
- 若 $f(x,y) = 1$，则积分 = 曲线弧长

**方向无关性**：第一型曲线积分与曲线方向无关，即 $\\int_L f ds = \\int_{-L} f ds$。

**对称性**：若曲线关于 $x$ 轴对称，$f(x,-y) = f(x,y)$，则可只算一半再乘2。`,
      extension: `**空间曲线**：对于空间曲线 $L: x=x(t), y=y(t), z=z(t)$：

$$\\int_L f(x,y,z) ds = \\int_\\alpha^\\beta f(x(t),y(t),z(t)) \\sqrt{x'^2+y'^2+z'^2} dt$$

**质心公式**：
$$\\bar{x} = \\frac{\\int_L x\\rho ds}{M}, \\quad \\bar{y} = \\frac{\\int_L y\\rho ds}{M}$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算曲线质量',
        description: `半圆弧 $x^2+y^2=R^2, y\\geq 0$，线密度 $\\rho = y$。

参数化：$x = R\\cos t, y = R\\sin t$, $t \\in [0, \\pi]$

$$M = \\int_L y ds = \\int_0^\\pi R\\sin t \\cdot R dt = R^2 \\int_0^\\pi \\sin t dt = 2R^2$$`,
        scenario: '展示曲线质量计算。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算曲线弧长',
        description: `计算星形线 $x = a\\cos^3 t, y = a\\sin^3 t$ 的周长。

$$s = \\int_L ds = 4\\int_0^{\\pi/2} \\sqrt{9a^2\\cos^4 t \\sin^2 t + 9a^2\\sin^4 t \\cos^2 t} dt$$

$$= 6a \\int_0^{\\pi/2} \\sin t \\cos t dt = 6a$$

总周长 = $4 \\times 6a = 24a$`,
        scenario: '经典曲线弧长计算。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '写出曲线参数方程', 
        description: `常见曲线参数化：
- **圆**：$x = R\\cos t, y = R\\sin t$
- **直线段**：从点A到点B，$x = x_A + (x_B-x_A)t, y = y_A + (y_B-y_A)t$
- **抛物线**：$y = x^2$ 可用 $x = t, y = t^2$

参数范围要完全覆盖曲线。`
      },
      { 
        number: 2, 
        title: '计算弧微分 ds', 
        description: `参数形式：$ds = \\sqrt{\\varphi'^2 + \\psi'^2} dt$

直角坐标（$y=y(x)$）：$ds = \\sqrt{1+y'^2} dx$

极坐标（$r=r(\\theta)$）：$ds = \\sqrt{r^2+r'^2} d\\theta$

**易错**：别忘记开根号！`
      },
      { 
        number: 3, 
        title: '代入计算定积分', 
        description: `将 $f(x,y)$ 和 $ds$ 都用参数表示，转化为定积分计算。

注意：
- 积分限从小到大（$ds$ 恒正）
- 利用对称性简化计算`
      },
    ],
  },
}

// 第二型曲线积分知识点
const lineIntegralType2Point: KnowledgePoint = {
  id: 'line-integral-type2',
  moduleId: 'multivariable-integral',
  name: '第二型曲线积分',
  formula: '\\int_L P dx + Q dy = \\int_L \\vec{F} \\cdot d\\vec{r}',
  coreSentence: '第二型曲线积分是"沿曲线做功"——与方向相关，是向量场积分的核心。',
  
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
      mainText: `**🎯 核心思想：沿曲线的"有向"积分**

第二型曲线积分（对坐标的曲线积分）描述向量场沿曲线的"投影累加"。物理原型是**变力沿曲线做功**。

---

**📐 定义**

设 $L$ 为从点 $A$ 到点 $B$ 的有向光滑曲线，$P(x,y)$, $Q(x,y)$ 在 $L$ 上有界。

$$\\int_L P dx + Q dy = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} [P(\\xi_i, \\eta_i)\\Delta x_i + Q(\\xi_i, \\eta_i)\\Delta y_i]$$

其中 $\\Delta x_i$, $\\Delta y_i$ 是第 $i$ 段有向弧在坐标轴上的投影。

---

**📝 参数方程计算**

若 $L: x = \\varphi(t), y = \\psi(t)$，起点对应 $t = \\alpha$，终点对应 $t = \\beta$：

$$\\int_L P dx + Q dy = \\int_\\alpha^\\beta [P(\\varphi(t), \\psi(t))\\varphi'(t) + Q(\\varphi(t), \\psi(t))\\psi'(t)] dt$$

**注意**：积分限由起点到终点，不必 $\\alpha < \\beta$。

---

**🔄 格林公式**

设 $D$ 为光滑闭曲线 $L$ 所围区域，$P, Q$ 在 $D$ 上有连续偏导数：

$$\\oint_L P dx + Q dy = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) d\\sigma$$

其中 $L$ 取正向（逆时针方向）。

---

**🔄 格林公式的应用**

**计算闭曲线积分**：将曲线积分转化为二重积分。

**计算非闭曲线积分**：添加直线段使其封闭，应用格林公式后再减去添加部分。

**曲线积分与路径无关**：若 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$，则积分只与起终点有关。`,
      highlights: [],
    },
    
    extension: {
      essence: `**方向相关**：第二型曲线积分与方向有关：
$$\\int_{-L} P dx + Q dy = -\\int_L P dx + Q dy$$

**物理意义**：若 $\\vec{F} = (P, Q)$ 为力场，则积分 = 力沿曲线做的功。

**与路径无关的等价条件**（单连通区域）：
1. $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$（处处成立）
2. 沿任意闭曲线积分为零
3. 积分只与起终点有关
4. 存在势函数 $u$ 使得 $du = P dx + Q dy$`,
      extension: `**空间曲线积分**（斯托克斯公式）：

$$\\oint_\\Gamma P dx + Q dy + R dz = \\iint_\\Sigma \\left| \\begin{matrix} dy dz & dz dx & dx dy \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{matrix} \\right|$$

连接了空间曲线积分与曲面积分。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算变力做功',
        description: `力场 $\\vec{F} = (y, -x)$，质点沿上半圆周从 $(1,0)$ 到 $(-1,0)$，求做功。

参数化：$x = \\cos t, y = \\sin t$, $t: 0 \\to \\pi$

$$W = \\int_L y dx - x dy = \\int_0^\\pi [\\sin t(-\\sin t) - \\cos t(\\cos t)] dt$$

$$= -\\int_0^\\pi (\\sin^2 t + \\cos^2 t) dt = -\\int_0^\\pi 1 dt = -\\pi$$`,
        scenario: '展示第二型曲线积分的物理意义。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '用格林公式简化计算',
        description: `计算 $\\oint_L (e^x\\sin y - 2y) dx + (e^x\\cos y - 2) dy$，$L$ 为正向圆周 $x^2+y^2=1$。

用格林公式：$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = e^x\\cos y - (e^x\\cos y - 2) = 2$

$$\\oint_L = \\iint_D 2 d\\sigma = 2 \\cdot \\pi \\cdot 1^2 = 2\\pi$$`,
        scenario: '展示格林公式的威力。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断是否用格林公式', 
        description: `**适用格林公式的情况**：
- 闭曲线积分
- 被积函数偏导数简单
- 非闭曲线可补成闭曲线

**不适用**：曲线不封闭且难以补封闭，或偏导数复杂。`
      },
      { 
        number: 2, 
        title: '参数化曲线', 
        description: `写出曲线的参数方程，确定参数范围（从起点到终点）。

**方向**：逆时针为正方向，顺时针为负方向。

**补线技巧**：非闭曲线可添加直线段使其封闭，用格林公式后减去添加部分。`
      },
      { 
        number: 3, 
        title: '验证与路径无关', 
        description: `检验 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$：
- 若成立，积分只与起终点有关
- 可选更简单的路径计算
- 或找势函数，用牛顿-莱布尼茨公式

**势函数**：$u(x,y) = \\int_{x_0}^x P(t, y_0) dt + \\int_{y_0}^y Q(x, t) dt$`,
      },
    ],
  },
}

// 第一型曲面积分知识点
const surfaceIntegralType1Point: KnowledgePoint = {
  id: 'surface-integral-type1',
  moduleId: 'multivariable-integral',
  name: '第一型曲面积分',
  formula: '\\iint_\\Sigma f(x, y, z) \\, dS = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i, \\zeta_i) \\Delta S_i',
  coreSentence: '第一型曲面积分是"沿曲面的累加"——计算曲面质量、面积的标量积分。',
  
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
      mainText: `**🎯 核心思想：沿曲面的积分**

第一型曲面积分（对面积的曲面积分）是将函数值沿曲面"累加"。物理原型是**曲面薄壳的质量**。

---

**📐 定义**

设 $\\Sigma$ 为光滑曲面，$f(x,y,z)$ 在 $\\Sigma$ 上有界。将 $\\Sigma$ 分成 $n$ 块，每块面积为 $\\Delta S_i$，作和取极限：

$$\\iint_\\Sigma f(x, y, z) \\, dS$$

---

**📝 计算方法**

**投影法**：将曲面 $\\Sigma: z = z(x,y)$ 投影到 $xy$ 平面，投影区域为 $D$：

$$\\iint_\\Sigma f(x,y,z) dS = \\iint_D f(x,y,z(x,y)) \\sqrt{1 + z_x^2 + z_y^2} dx dy$$

其中 $\\sqrt{1 + z_x^2 + z_y^2}$ 是**面积微元因子**。

---

**📝 几种常见曲面**

| 曲面 | 方程 | $dS$ |
|------|------|------|
| 平面 | $ax+by+cz=d$ | $\\frac{\\sqrt{a^2+b^2+c^2}}{|c|}dxdy$ |
| 球面 | $x^2+y^2+z^2=R^2$ | $R^2\\sin\\varphi d\\varphi d\\theta$ |
| 柱面 | $x^2+y^2=R^2$ | $Rd\\theta dz$ |
| 旋转面 | $z=f(\\sqrt{x^2+y^2})$ | $\\sqrt{1+f'^2}rdrd\\theta$ |`,
      highlights: [],
    },
    
    extension: {
      essence: `**物理意义**：
- 若 $f(x,y,z)$ = 面密度，则积分 = 曲面总质量
- 若 $f(x,y,z) = 1$，则积分 = 曲面面积

**与曲面方向无关**：第一型曲面积分是标量积分，与曲面法向量的选择无关。

**对称性**：若曲面关于坐标平面对称，被积函数有相应奇偶性，可简化计算。`,
      extension: `**球面上的面积微元**：

在球坐标下，球面 $r = R$ 的面积微元：
$$dS = R^2 \\sin\\varphi \\, d\\varphi \\, d\\theta$$

推导：$x = R\\sin\\varphi\\cos\\theta$, $y = R\\sin\\varphi\\sin\\theta$, $z = R\\cos\\varphi$

**柱面上的面积微元**：

柱面 $r = R$ 的面积微元：
$$dS = R \\, d\\theta \\, dz$$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算球面面积',
        description: `计算半径为 $R$ 的球面面积。

用球坐标：
$$S = \\iint_\\Sigma dS = \\int_0^{2\\pi} d\\theta \\int_0^\\pi R^2 \\sin\\varphi d\\varphi$$

$$= 2\\pi R^2 \\int_0^\\pi \\sin\\varphi d\\varphi = 4\\pi R^2$$`,
        scenario: '验证经典球面积公式。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算曲面质量',
        description: `半球面 $x^2+y^2+z^2=1, z\\geq 0$，面密度 $\\rho = z$。

$$M = \\iint_\\Sigma z dS = \\int_0^{2\\pi} d\\theta \\int_0^{\\pi/2} \\cos\\varphi \\cdot \\sin\\varphi d\\varphi$$

$$= 2\\pi \\cdot \\frac{1}{2} = \\pi$$`,
        scenario: '展示变密度曲面的质量计算。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '确定曲面方程和投影', 
        description: `写出曲面方程，选择投影平面：
- $z = z(x,y)$ → 投影到 $xy$ 平面
- $y = y(x,z)$ → 投影到 $xz$ 平面
- $x = x(y,z)$ → 投影到 $yz$ 平面

选择原则：投影区域简单，不重叠。`
      },
      { 
        number: 2, 
        title: '计算面积微元因子', 
        description: `对于 $z = z(x,y)$：
$$dS = \\sqrt{1 + \\left(\\frac{\\partial z}{\\partial x}\\right)^2 + \\left(\\frac{\\partial z}{\\partial y}\\right)^2} dx dy$$

**球面**：$dS = R^2\\sin\\varphi d\\varphi d\\theta$

**柱面**：$dS = Rd\\theta dz$`
      },
      { 
        number: 3, 
        title: '转化为二重积分', 
        description: `将曲面投影、被积函数、面积微元都转化为二重积分的形式，然后计算。

**注意**：
- 投影可能需要分段（曲面有重叠投影时）
- 利用对称性简化`,
      },
    ],
  },
}

// 第二型曲面积分知识点
const surfaceIntegralType2Point: KnowledgePoint = {
  id: 'surface-integral-type2',
  moduleId: 'multivariable-integral',
  name: '第二型曲面积分',
  formula: '\\iint_\\Sigma P dy dz + Q dz dx + R dx dy = \\iint_\\Sigma \\vec{F} \\cdot d\\vec{S}',
  coreSentence: '第二型曲面积分是"向量场穿过曲面的通量"——与曲面方向相关，是电磁学的核心工具。',
  
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
      mainText: `**🎯 核心思想：通量积分**

第二型曲面积分（对坐标的曲面积分）描述向量场"穿过"曲面的流量。物理原型是**流体穿过曲面的流量**。

---

**📐 定义**

设 $\\Sigma$ 为有向光滑曲面，$\\vec{n}$ 为其单位法向量，$\\vec{F} = (P, Q, R)$ 为向量场：

$$\\iint_\\Sigma \\vec{F} \\cdot d\\vec{S} = \\iint_\\Sigma \\vec{F} \\cdot \\vec{n} \\, dS$$

展开为：
$$\\iint_\\Sigma P dy dz + Q dz dx + R dx dy$$

其中 $dy dz$, $dz dx$, $dx dy$ 是有向面积元素。

---

**📝 计算方法**

对于曲面 $\\Sigma: z = z(x,y)$，上侧为正方向：

$$\\iint_\\Sigma R dx dy = \\pm \\iint_{D_{xy}} R(x,y,z(x,y)) dx dy$$

- 上侧（$\\vec{n}$ 与 $z$ 轴正向成锐角）：取正
- 下侧：取负

---

**🔄 高斯公式**

设 $\\Omega$ 为封闭曲面 $\\Sigma$ 所围区域，$\\vec{F} = (P, Q, R)$ 有连续偏导数：

$$\\oiint_\\Sigma P dy dz + Q dz dx + R dx dy = \\iiint_\\Omega \\left(\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}\\right) dV$$

曲面 $\\Sigma$ 取外侧。`,
      highlights: [],
    },
    
    extension: {
      essence: `**方向相关**：第二型曲面积分与曲面方向有关：
$$\\iint_{-\\Sigma} = -\\iint_\\Sigma$$

**物理意义**：
- 若 $\\vec{F}$ 为流速场，积分 = 单位时间穿过曲面的流量
- 若 $\\vec{F}$ 为电场，积分 = 电通量
- 若 $\\vec{F}$ 为磁场，积分 = 磁通量

**散度**：
$$\\text{div}\\vec{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}$$

高斯公式：通量 = 散度的体积分。`,
      extension: `**斯托克斯公式**（连接曲线积分与曲面积分）：

$$\\oint_\\Gamma \\vec{F} \\cdot d\\vec{r} = \\iint_\\Sigma (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}$$

其中 $\\nabla \\times \\vec{F}$ 是旋度，$\\Gamma$ 是曲面 $\\Sigma$ 的边界曲线。

**统一公式**：外微分形式 $\\int_{\\partial M} \\omega = \\int_M d\\omega$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'research',
        title: '用高斯公式计算通量',
        description: `计算 $\\vec{F} = (x, y, z)$ 穿出球面 $x^2+y^2+z^2=1$ 的通量。

用高斯公式：$\\text{div}\\vec{F} = 1+1+1 = 3$

$$\\Phi = \\iiint_\\Omega 3 dV = 3 \\cdot \\frac{4\\pi}{3} = 4\\pi$$

或直接积分：
$$\\Phi = \\iint_\\Sigma (x,y,z) \\cdot \\frac{(x,y,z)}{1} dS = \\iint_\\Sigma 1 \\cdot dS = 4\\pi$$`,
        scenario: '展示高斯公式的简洁性。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '电磁场应用',
        description: `**高斯电场定律**：穿过封闭曲面的电通量等于内部电荷除以 $\\varepsilon_0$：

$$\\oiint_\\Sigma \\vec{E} \\cdot d\\vec{S} = \\frac{Q_{\\text{内}}}{\\varepsilon_0}$$

**连续性方程**：电荷守恒的数学表达：

$$\\oiint_\\Sigma \\vec{J} \\cdot d\\vec{S} = -\\frac{dQ}{dt}$$

流出封闭曲面的电流等于内部电荷减少率。`,
        scenario: '电磁学核心定律。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断用高斯公式', 
        description: `**适用高斯公式的情况**：
- 封闭曲面
- 向量场的散度简单
- 非封闭曲面可补成封闭

**不适用**：曲面不封闭且难以补，或散度复杂。`
      },
      { 
        number: 2, 
        title: '确定曲面方向', 
        description: `**封闭曲面**：外侧为正方向

**非封闭曲面**：
- 上侧/下侧：法向量与 $z$ 轴夹角
- 前侧/后侧：法向量与 $x$ 轴夹角
- 右侧/左侧：法向量与 $y$ 轴夹角

**方向影响符号**：反向取负。`
      },
      { 
        number: 3, 
        title: '投影计算', 
        description: `将曲面积分转化为二重积分：
- $\\iint_\\Sigma R dx dy = \\pm \\iint_D R(x,y,z(x,y)) dx dy$
- 正负由曲面方向决定

**补面技巧**：非封闭曲面可添加平面使其封闭，用高斯公式后减去添加部分。`,
      },
    ],
  },
}

// ============================================
// 级数知识点
// ============================================

// 数项级数审敛法知识点
const seriesConvergencePoint: KnowledgePoint = {
  id: 'series-convergence',
  moduleId: 'series',
  name: '数项级数审敛法',
  formula: '\\sum_{n=1}^{\\infty} u_n = u_1 + u_2 + u_3 + \\cdots',
  coreSentence: '级数审敛的核心是"判断无穷项和是否有极限"——部分和数列收敛则级数收敛。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 100, step: 1, defaultValue: 20, label: '项数 n' },
          { id: 'r', name: 'r', min: 0.1, max: 1.5, step: 0.1, defaultValue: 0.5, label: '公比 r' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '部分和变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=5，部分和S₅', changes: { n: 5 } },
            { id: 's2', description: 'n=20，部分和S₂₀', changes: { n: 20 } },
            { id: 's3', description: 'n=50，部分和S₅₀', changes: { n: 50 } },
            { id: 's4', description: 'n=100，趋于极限', changes: { n: 100 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：无穷项求和的收敛性**

级数是"无穷个数相加"的数学表达。关键问题是：这无穷多项加起来，结果是一个有限的数，还是无穷大？

---

**📐 定义**

设 $u_1, u_2, u_3, \\cdots$ 是一个数列，称表达式

$$\\sum_{n=1}^{\\infty} u_n = u_1 + u_2 + u_3 + \\cdots$$

为**无穷级数**，简称**级数**。

**部分和**：$S_n = u_1 + u_2 + \\cdots + u_n$

若部分和数列 $\\{S_n\\}$ 收敛于 $S$，则称级数**收敛**，$S$ 称为级数的**和**。

---

**🔍 审敛法体系**

**1. 必要条件**
若 $\\sum u_n$ 收敛，则 $\\lim u_n = 0$。
（逆命题不成立！如调和级数）

**2. 正项级数审敛法**

| 方法 | 条件 | 结论 |
|------|------|------|
| 比较审敛法 | $u_n \\leq v_n$，$\\sum v_n$ 收敛 | $\\sum u_n$ 收敛 |
| 比值审敛法 | $\\lim \\frac{u_{n+1}}{u_n} = \\rho$ | $\\rho<1$ 收敛，$\\rho>1$ 发散 |
| 根值审敛法 | $\\lim \\sqrt[n]{u_n} = \\rho$ | $\\rho<1$ 收敛，$\\rho>1$ 发散 |

**3. 交错级数审敛法（莱布尼茨）**

若交错级数 $\\sum (-1)^n u_n$ 满足：
- $u_n$ 单调递减
- $\\lim u_n = 0$

则级数收敛，且 $|R_n| \\leq u_{n+1}$

**4. 绝对收敛与条件收敛**

- **绝对收敛**：$\\sum |u_n|$ 收敛 $\\Rightarrow$ $\\sum u_n$ 收敛
- **条件收敛**：$\\sum u_n$ 收敛但 $\\sum |u_n|$ 发散`,
      highlights: [],
    },
    
    extension: {
      essence: `**级数的本质**：级数是数列极限的另一种表述形式。级数收敛 $\\Leftrightarrow$ 部分和数列收敛。

**调和级数的启示**：$\\sum \\frac{1}{n}$ 发散，说明 $\\lim u_n = 0$ 只是收敛的必要条件，不是充分条件。

**审敛法的逻辑**：
- 比较：与已知收敛/发散的级数比较
- 比值/根值：看通项的"增长速度"
- 交错：利用正负相消的特性`,
      extension: `**拉阿比判别法**：当比值审敛法 $\\rho = 1$ 失效时，可用

$$\\lim n\\left(\\frac{u_n}{u_{n+1}} - 1\\right) = \\lambda$$

- $\\lambda > 1$：收敛
- $\\lambda < 1$：发散

**狄利克雷判别法**：判断一般级数收敛的重要方法。

**级数的运算**：收敛级数可以线性组合，但一般不能重排（黎曼重排定理）。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '几何级数',
        description: `等比级数 $\\sum_{n=0}^{\\infty} r^n$：
- $|r| < 1$：收敛，和为 $\\frac{1}{1-r}$
- $|r| \\geq 1$：发散

**应用**：循环小数化分数
$$0.999\\cdots = \\sum_{n=1}^{\\infty} \\frac{9}{10^n} = \\frac{9/10}{1-1/10} = 1$$`,
        scenario: '最基本的重要级数。',
      },
      {
        id: 'app2',
        type: 'real',
        title: 'p级数',
        description: `$p$-级数 $\\sum \\frac{1}{n^p}$：
- $p > 1$：收敛
- $p \\leq 1$：发散

调和级数 $\\sum \\frac{1}{n}$ 是 $p=1$ 的特例，发散。

**审敛技巧**：与 $p$-级数比较，判断待审级数的收敛性。`,
        scenario: '重要的比较基准。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '黎曼ζ函数',
        description: `黎曼ζ函数定义为：
$$\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}$$

当 $s > 1$ 时收敛。$\\zeta(2) = \\frac{\\pi^2}{6}$。

黎曼猜想涉及 $\\zeta(s)$ 零点的分布，是千禧年难题之一。`,
        scenario: '数学前沿研究。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断级数类型', 
        description: `首先判断级数类型：
- **正项级数**：所有项 $u_n \\geq 0$
- **交错级数**：正负交替
- **一般级数**：正负不定

不同类型用不同审敛法。`
      },
      { 
        number: 2, 
        title: '选择审敛法', 
        description: `**正项级数优先级**：
1. 必要条件：$\\lim u_n \\neq 0$ → 发散
2. 比值法：含阶乘、指数
3. 根值法：含 $n$ 次幂
4. 比较法：与几何级数、p-级数比较

**交错级数**：莱布尼茨判别法

**一般级数**：先判断绝对收敛`
      },
      { 
        number: 3, 
        title: '精确判断', 
        description: `注意审敛法的局限性：
- 比值/根值法 $\\rho = 1$ 时失效
- 需要用更精细的方法（积分判别法、拉阿比判别法）

**积分判别法**：若 $f(n) = u_n$，$f$ 单调递减，则 $\\sum u_n$ 与 $\\int_1^{\\infty} f(x)dx$ 同敛散。`
      },
    ],
  },
}

// 幂级数知识点
const powerSeriesPoint: KnowledgePoint = {
  id: 'power-series',
  moduleId: 'series',
  name: '幂级数',
  formula: '\\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + \\cdots',
  coreSentence: '幂级数是"多项式的无限推广"——在收敛域内可以表示复杂函数，是泰勒展开的基础。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 1, max: 20, step: 1, defaultValue: 5, label: '项数 n' },
          { id: 'x', name: 'x', min: -1.5, max: 1.5, step: 0.1, defaultValue: 0.5, label: 'x 值' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '幂级数逼近',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=1，线性逼近', changes: { n: 1 } },
            { id: 's2', description: 'n=3，三阶逼近', changes: { n: 3 } },
            { id: 's3', description: 'n=7，七阶逼近', changes: { n: 7 } },
            { id: 's4', description: 'n=15，高阶逼近', changes: { n: 15 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：用多项式逼近函数**

幂级数是形如 $\\sum a_n x^n$ 的级数，它是多项式在无穷维的自然推广。在收敛域内，幂级数定义了一个函数。

---

**📐 收敛半径**

幂级数 $\\sum a_n x^n$ 的收敛域是一个以原点为中心的区间。

**阿贝尔定理**：若级数在 $x = x_0 \\neq 0$ 处收敛，则对于 $|x| < |x_0|$ 的一切 $x$，级数绝对收敛。

**收敛半径**：
$$R = \\frac{1}{\\lim_{n\\to\\infty} \\sqrt[n]{|a_n|}} = \\lim_{n\\to\\infty} \\left|\\frac{a_n}{a_{n+1}}\\right|$$

收敛域：$(-R, R)$，端点需单独判断。

---

**📝 幂级数的性质**

**1. 和函数的连续性**：在收敛域内连续

**2. 逐项求导**：
$$\\left(\\sum a_n x^n\\right)' = \\sum n a_n x^{n-1}$$

**3. 逐项积分**：
$$\\int_0^x \\sum a_n t^n dt = \\sum \\frac{a_n}{n+1} x^{n+1}$$

---

**📝 常用幂级数展开**

| 函数 | 展开式 | 收敛域 |
|------|--------|--------|
| $e^x$ | $\\sum \\frac{x^n}{n!}$ | $(-\\infty, +\\infty)$ |
| $\\sin x$ | $\\sum (-1)^n \\frac{x^{2n+1}}{(2n+1)!}$ | $(-\\infty, +\\infty)$ |
| $\\cos x$ | $\\sum (-1)^n \\frac{x^{2n}}{(2n)!}$ | $(-\\infty, +\\infty)$ |
| $\\frac{1}{1-x}$ | $\\sum x^n$ | $(-1, 1)$ |
| $\\ln(1+x)$ | $\\sum (-1)^n \\frac{x^{n+1}}{n+1}$ | $(-1, 1]$ |
| $(1+x)^\\alpha$ | $\\sum \\binom{\\alpha}{n} x^n$ | $(-1, 1)$ |`,
      highlights: [],
    },
    
    extension: {
      essence: `**幂级数的本质**：幂级数提供了一个函数的"无穷多项式表示"。在收敛域内，幂级数定义的函数具有无穷次可微性。

**泰勒级数的联系**：若函数 $f(x)$ 在某点附近可以展开为幂级数，则这个幂级数就是泰勒级数。

$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(x_0)}{n!} (x-x_0)^n$$

**解析函数**：可以展开为幂级数的函数称为解析函数，具有很好的性质。`,
      extension: `**复幂级数**：在复平面上，幂级数定义了解析函数。收敛域变成圆盘。

**级数的运算**：
- 幂级数可以加减、乘除（在共同收敛域内）
- 可以复合（代入另一级数）

**唯一性定理**：若 $\\sum a_n x^n = \\sum b_n x^n$ 在某区间成立，则 $a_n = b_n$。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算函数值',
        description: `用幂级数计算 $e$, $\\sin$, $\\cos$ 等函数值：

$$e = \\sum_{n=0}^{\\infty} \\frac{1}{n!} = 1 + 1 + \\frac{1}{2} + \\frac{1}{6} + \\cdots \\approx 2.718$$

$$\\sin 30° = \\sin\\frac{\\pi}{6} = \\frac{\\pi}{6} - \\frac{\\pi^3}{6^3 \\cdot 3!} + \\cdots \\approx 0.5$$`,
        scenario: '数值计算的基础。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算定积分',
        description: `计算 $\\int_0^1 e^{-x^2} dx$（无法用初等函数表示）

展开 $e^{-x^2} = \\sum (-1)^n \\frac{x^{2n}}{n!}$

$$\\int_0^1 e^{-x^2} dx = \\sum (-1)^n \\frac{1}{(2n+1) \\cdot n!}$$

取前几项即可得到高精度近似值。`,
        scenario: '无法解析求解的积分。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '求解微分方程',
        description: `求解 $y' = y$, $y(0) = 1$

设 $y = \\sum a_n x^n$，代入得：
$$\\sum (n+1) a_{n+1} x^n = \\sum a_n x^n$$

比较系数：$a_{n+1} = \\frac{a_n}{n+1}$，故 $a_n = \\frac{1}{n!}$

$$y = \\sum \\frac{x^n}{n!} = e^x$$`,
        scenario: '级数法解微分方程。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '求收敛半径', 
        description: `**方法**：
$$R = \\lim_{n\\to\\infty} \\left|\\frac{a_n}{a_{n+1}}\\right|$$

或用根值法：
$$R = \\frac{1}{\\lim \\sqrt[n]{|a_n|}}$$

**注意**：端点 $x = \\pm R$ 需单独判断收敛性。`
      },
      { 
        number: 2, 
        title: '函数展开为幂级数', 
        description: `**直接法**：计算 $f^{(n)}(x_0)$，代入泰勒公式

**间接法**（常用）：
- 利用已知展开式
- 逐项求导/积分
- 代入替换

**例**：$\\arctan x = \\int_0^x \\frac{dt}{1+t^2} dt = \\int_0^x \\sum (-1)^n t^{2n} dt = \\sum (-1)^n \\frac{x^{2n+1}}{2n+1}$`
      },
      { 
        number: 3, 
        title: '求和函数', 
        description: `给定幂级数，求和函数：

**技巧**：
- 逐项求导/积分化为已知级数
- 建立微分方程求解

**例**：设 $S(x) = \\sum n x^n$，则 $S(x) = x \\cdot \\sum n x^{n-1} = x \\cdot \\frac{d}{dx}\\left(\\frac{1}{1-x}\\right) = \\frac{x}{(1-x)^2}$`
      },
    ],
  },
}

// 傅里叶级数知识点
const fourierSeriesPoint: KnowledgePoint = {
  id: 'fourier-series',
  moduleId: 'series',
  name: '傅里叶级数',
  formula: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)',
  coreSentence: '傅里叶级数是"用三角函数逼近周期函数"——任何周期信号都可以分解为不同频率的正弦波叠加。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'n', name: 'n', min: 1, max: 20, step: 1, defaultValue: 3, label: '谐波数 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '谐波叠加',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=1，基波', changes: { n: 1 } },
            { id: 's2', description: 'n=3，三次谐波', changes: { n: 3 } },
            { id: 's3', description: 'n=7，七次谐波', changes: { n: 7 } },
            { id: 's4', description: 'n=15，高次谐波叠加', changes: { n: 15 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：周期信号的频谱分解**

傅里叶级数将周期函数分解为一系列正弦和余弦函数的叠加。这是信号处理、量子力学的数学基础。

---

**📐 定义**

设 $f(x)$ 是周期为 $2\\pi$ 的函数，其傅里叶级数为：

$$f(x) \\sim \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)$$

**傅里叶系数**：
$$a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) dx$$

$$a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos nx \\, dx$$

$$b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin nx \\, dx$$

---

**📝 收敛定理（狄利克雷）**

若 $f(x)$ 满足：
1. 在一个周期内连续或只有有限个第一类间断点
2. 在一个周期内只有有限个极值点

则傅里叶级数收敛，且：
- 在连续点，级数收敛于 $f(x)$
- 在间断点，级数收敛于 $\\frac{f(x^+)+f(x^-)}{2}$

---

**📝 复数形式**

$$f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{inx}$$

其中 $c_n = \\frac{1}{2\\pi} \\int_{-\\pi}^{\\pi} f(x) e^{-inx} dx$`,
      highlights: [],
    },
    
    extension: {
      essence: `**物理意义**：傅里叶级数揭示了周期信号的本质——任何周期信号都是不同频率正弦波的叠加。

**频域视角**：
- $a_n, b_n$ 表示频率为 $n$ 的谐波成分的幅度
- 频谱图：横轴为频率，纵轴为幅度

**吉布斯现象**：在间断点附近，傅里叶级数的部分和会出现约9%的过冲，即使增加项数也不会消失。`,
      extension: `**傅里叶变换**：对于非周期函数，周期趋于无穷，傅里叶级数变为傅里叶变换：

$$\\hat{f}(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i\\omega x} dx$$

**应用领域**：
- 信号处理：频谱分析、滤波
- 图像处理：图像压缩（JPEG使用DCT）
- 量子力学：波函数在位置空间和动量空间的转换`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '方波的傅里叶展开',
        description: `方波 $f(x)$：在 $[-\\pi, 0)$ 为 $-1$，在 $[0, \\pi)$ 为 $1$

傅里叶系数：$a_n = 0$, $b_n = \\frac{2(1-(-1)^n)}{n\\pi}$

$$f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$$

只包含奇次谐波！`,
        scenario: '经典例子，展示谐波叠加。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '锯齿波的傅里叶展开',
        description: `锯齿波 $f(x) = x$, $x \\in [-\\pi, \\pi]$

$$x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots\\right)$$

令 $x = \\frac{\\pi}{2}$，得到著名的莱布尼茨级数：
$$\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots$$`,
        scenario: '导出重要常数级数。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '信号滤波',
        description: `**低通滤波**：保留低频成分，去除高频噪声

设信号 $f(x) = \\sum c_n e^{inx}$，滤波后：
$$g(x) = \\sum_{|n| \\leq N} c_n e^{inx}$$

**高通滤波**：保留高频成分，突出边缘和细节

这就是图像处理中模糊/锐化的原理。`,
        scenario: '数字信号处理核心应用。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '确定周期和积分区间', 
        description: `**标准周期**：$T = 2\\pi$，积分区间 $[-\\pi, \\pi]$

**任意周期**：$T = 2l$，令 $t = \\frac{l x}{\\pi}$ 转化

**系数公式**（周期 $2l$）：
$$a_n = \\frac{1}{l} \\int_{-l}^{l} f(x) \\cos \\frac{n\\pi x}{l} dx$$`
      },
      { 
        number: 2, 
        title: '利用函数的奇偶性', 
        description: `**奇函数**：$f(-x) = -f(x)$
- $a_n = 0$，只有正弦项
- 只计算 $\\int_0^{\\pi} f(x) \\sin nx \\, dx$ 并乘2

**偶函数**：$f(-x) = f(x)$
- $b_n = 0$，只有余弦项
- 只计算 $\\int_0^{\\pi} f(x) \\cos nx \\, dx$ 并乘2

可大大简化计算！`
      },
      { 
        number: 3, 
        title: '验证收敛条件', 
        description: `检查狄利克雷条件：
1. 周期内有限个间断点
2. 周期内有限个极值点

若满足，则在连续点级数收敛于函数值，间断点收敛于左右极限的平均值。

**注意**：展开式只在周期函数的定义域内有效，延拓需谨慎。`
      },
    ],
  },
}

// 知识模块定义
export const knowledgeModules: KnowledgeModule[] = [
  {
    id: 'limits',
    name: '函数与极限',
    icon: '∞',
    description: '极限是高等数学的基石，理解极限思想是学习高数的关键',
    knowledgePoints: [sequenceLimitPoint, functionLimitPoint, infinitesimalPoint, continuityPoint],
  },
  {
    id: 'derivative',
    name: '导数与微分',
    icon: '∂',
    description: '导数描述变化率，是研究函数性质的重要工具',
    knowledgePoints: [derivativeGeometryPoint, derivativeRulesPoint, implicitParametricPoint, differentialPoint],
  },
  {
    id: 'integral',
    name: '积分',
    icon: '∫',
    description: '积分是求和的极限，是计算面积、体积的基础',
    knowledgePoints: [indefiniteIntegralPoint, substitutionPoint, integrationByPartsPoint, definiteIntegralPoint],
  },
  {
    id: 'differential-equations',
    name: '微分方程',
    icon: '📐',
    description: '微分方程描述变化规律，是科学建模的核心工具',
    knowledgePoints: [firstOrderODEPoint, secondOrderODEPoint, reducibleODEPoint],
  },
  {
    id: 'vector',
    name: '向量代数与空间几何',
    icon: '→',
    description: '向量是描述空间的重要工具，连接代数与几何',
    knowledgePoints: [],
  },
  {
    id: 'series',
    name: '级数',
    icon: 'Σ',
    description: '级数是无穷项求和，是函数展开的理论基础',
    knowledgePoints: [seriesConvergencePoint, powerSeriesPoint, fourierSeriesPoint],
  },
  {
    id: 'multivariable-integral',
    name: '多元函数积分学',
    icon: '∬',
    description: '多元函数积分是高维空间中积分的自然推广，是物理建模的核心工具',
    knowledgePoints: [doubleIntegralPoint, tripleIntegralPoint, lineIntegralType1Point, lineIntegralType2Point, surfaceIntegralType1Point, surfaceIntegralType2Point],
  },
]

// 获取当前知识点
export const getCurrentKnowledge = (moduleId: string, knowledgeId: string): KnowledgePoint | null => {
  const module = knowledgeModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.knowledgePoints.find(k => k.id === knowledgeId) || null
}