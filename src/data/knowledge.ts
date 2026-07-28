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
        sliders: [
          { id: 'x0', name: 'x0', min: -3, max: 3, step: 0.1, defaultValue: 1, label: '观察点 x₀' },
          { id: 'rule_type', name: 'rule_type', min: 0, max: 2, step: 1, defaultValue: 0, label: '法则类型' },
        ],
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
        sliders: [
          { id: 'x_max', name: 'x_max', min: 0.5, max: 3, step: 0.1, defaultValue: 2, label: '积分上限' },
          { id: 'part_type', name: 'part_type', min: 0, max: 2, step: 1, defaultValue: 0, label: '示例类型' },
        ],
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

// 二重积分知识点（名师讲解版）
const doubleIntegralPoint: KnowledgePoint = {
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
const tripleIntegralPoint: KnowledgePoint = {
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
const lineIntegralType1Point: KnowledgePoint = {
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
const lineIntegralType2Point: KnowledgePoint = {
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
const surfaceIntegralType1Point: KnowledgePoint = {
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
const surfaceIntegralType2Point: KnowledgePoint = {
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
      mainText: `**🎯 引子：芝诺悖论与无穷求和**

古希腊哲学家芝诺曾提出一个著名的悖论：

> 阿基里斯（希腊神话中的飞毛腿）要追上一只乌龟。当他跑到乌龟的出发点时，乌龟又向前爬了一段；当他跑到新位置时，乌龟又向前爬了一点……如此无穷无尽，阿基里斯永远追不上乌龟？

这个悖论的"玄机"在于：**无穷多个正数相加，结果未必是无穷大！**

让我们来计算一下：
$$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + \\cdots = 1$$

无穷多项，和却是有限的1！这就是**级数收敛**的奇妙之处。

---

## 📐 级数是什么？——无穷项的"求和游戏"

### 直观理解

想象你有一块蛋糕，第一天吃一半，第二天吃剩下的一半，第三天再吃剩下的一半……

每天吃的量是：$\\frac{1}{2}, \\frac{1}{4}, \\frac{1}{8}, \\frac{1}{16}, \\cdots$

虽然你理论上"永远吃不完"，但**吃的总量永远不会超过1块蛋糕**。这就是收敛级数。

反之，如果每天吃 $\\frac{1}{n}$ 块蛋糕（第n天吃 $\\frac{1}{n}$），那么：
$$\\frac{1}{1} + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\cdots = +\\infty$$

这就是**调和级数**——虽然每项越来越小，但总和却趋向无穷！

**为什么？** 因为虽然每项在变小，但"变小的速度"不够快！

---

### 数学定义

设 $u_1, u_2, u_3, \\cdots$ 是一个数列，称表达式
$$\\sum_{n=1}^{\\infty} u_n = u_1 + u_2 + u_3 + \\cdots$$
为**无穷级数**，简称**级数**。

**部分和**：$S_n = u_1 + u_2 + \\cdots + u_n$

若部分和数列 $\\{S_n\\}$ 收敛于 $S$，则称级数**收敛**，$S$ 称为级数的**和**。

**关键洞察**：级数收敛的本质，是部分和数列的极限存在！

---

## 🔍 如何判断级数是否收敛？——审敛法大全

### ⚠️ 第一步：必要条件检验

**定理**：若 $\\sum u_n$ 收敛，则 $\\lim u_n = 0$

**但是！** 逆命题不成立！

> 调和级数 $\\sum \\frac{1}{n}$ 的通项 $\\frac{1}{n} \\to 0$，但级数发散！

**类比**：通项趋于0，是收敛的"入场券"——没有入场券一定不行，有入场券也不一定能进去！

---

### 📊 正项级数审敛法

当所有项 $u_n \\geq 0$ 时，可用以下方法：

#### 1️⃣ 比较审敛法 ——"比大小"

**思想**：和一个已知收敛/发散的级数比较

> 若 $u_n \\leq v_n$，且 $\\sum v_n$ 收敛，则 $\\sum u_n$ 收敛
> 
> 若 $u_n \\geq v_n$，且 $\\sum v_n$ 发散，则 $\\sum u_n$ 发散

**类比**：如果A跑得比B慢，而B都能在规定时间内跑完，那A肯定也能跑完！

**两个重要的"参照物"**：
- **几何级数** $\\sum r^n$：$|r|<1$ 收敛，和为 $\\frac{1}{1-r}$
- **p级数** $\\sum \\frac{1}{n^p}$：$p>1$ 收敛，$p \\leq 1$ 发散

---

#### 2️⃣ 比值审敛法（达朗贝尔判别法）——"看增长速度"

计算 $\\rho = \\lim \\frac{u_{n+1}}{u_n}$

| $\\rho$ 值 | 结论 | 直觉解释 |
|-----------|------|----------|
| $\\rho < 1$ | 收敛 | 后项比前项小得多，"消耗"得快 |
| $\\rho > 1$ | 发散 | 后项比前项大，"越积越多" |
| $\\rho = 1$ | **失效** | 无法判断，需要更精细的方法 |

**适用场景**：通项含阶乘 $n!$、指数 $a^n$ 等

---

#### 3️⃣ 根值审敛法（柯西判别法）——"看平均增长率"

计算 $\\rho = \\lim \\sqrt[n]{u_n}$

结论与比值法相同。

**适用场景**：通项含 $n$ 次幂，如 $u_n = \\left(\\frac{n}{n+1}\\right)^{n^2}$

---

### 🔄 交错级数审敛法（莱布尼茨判别法）

**交错级数**形如 $\\sum (-1)^n u_n$ 或 $\\sum (-1)^{n+1} u_n$，正负交替。

**莱布尼茨判别法**：若满足
1. $u_n$ 单调递减（绝对值越来越小）
2. $\\lim u_n = 0$（最终趋于零）

则级数收敛，且余项 $|R_n| \\leq u_{n+1}$

**直观理解**：像荡秋千——左右摆动幅度越来越小，最终停在平衡位置！

$$S = u_1 - u_2 + u_3 - u_4 + \\cdots$$

第1步走到 $u_1$，第2步退到 $u_1 - u_2$（比 $u_1$ 小），第3步前进到 $u_1 - u_2 + u_3$（比 $u_1 - u_2$ 大）……

每一步都在"震荡"，但幅度越来越小，最终收敛！

---

### ⚖️ 绝对收敛与条件收敛

**绝对收敛**：$\\sum |u_n|$ 收敛 $\\Rightarrow$ $\\sum u_n$ 收敛

**条件收敛**：$\\sum u_n$ 收敛，但 $\\sum |u_n|$ 发散

**例子对比**：
- $\\sum (-1)^n \\frac{1}{n^2}$：绝对收敛（加绝对值后仍收敛）
- $\\sum (-1)^n \\frac{1}{n}$：条件收敛（加绝对值后发散）

**深刻意义**：绝对收敛的级数可以任意重排，和不变；条件收敛的级数重排后可能改变和！（黎曼重排定理）

---

## 🧮 常用级数速查表

| 级数 | 收敛性 | 和（若收敛） |
|------|--------|-------------|
| $\\sum r^n$ ($|r|<1$) | 收敛 | $\\frac{1}{1-r}$ |
| $\\sum r^n$ ($|r|\\geq 1$) | 发散 | — |
| $\\sum \\frac{1}{n^p}$ ($p>1$) | 收敛 | 无初等表达式 |
| $\\sum \\frac{1}{n^p}$ ($p\\leq 1$) | 发散 | — |
| $\\sum \\frac{1}{n!}$ | 收敛 | $e - 1$ |
| $\\sum (-1)^n \\frac{1}{n}$ | 条件收敛 | $-\\ln 2$ |`,
      highlights: [],
    },
    
    extension: {
      essence: `**级数的本质**：级数是数列极限的另一种表述形式。级数收敛 $\\Leftrightarrow$ 部分和数列收敛。

**调和级数为什么发散？**

直觉：$\\frac{1}{n}$ 趋于0，应该收敛啊？

真相：比较 $\\sum \\frac{1}{n}$ 和积分 $\\int_1^{\\infty} \\frac{1}{x} dx$：

$$\\int_1^{\\infty} \\frac{1}{x} dx = \\ln x \\big|_1^{\\infty} = +\\infty$$

积分发散！而 $\\frac{1}{n} > \\int_n^{n+1} \\frac{1}{x} dx$，所以级数更发散！

**直观理解**：把调和级数分组：
$$\\underbrace{\\frac{1}{1}}_{\\geq \\frac{1}{2}} + \\underbrace{\\frac{1}{2}}_{\\geq \\frac{1}{2}} + \\underbrace{\\frac{1}{3}+\\frac{1}{4}}_{\\geq \\frac{1}{2}} + \\underbrace{\\frac{1}{5}+\\cdots+\\frac{1}{8}}_{\\geq \\frac{1}{2}} + \\cdots$$

每组都 $\\geq \\frac{1}{2}$，无穷多组，和当然趋向无穷！`,
      extension: `**拉阿比判别法**：当比值审敛法 $\\rho = 1$ 失效时使用

$$\\lim n\\left(\\frac{u_n}{u_{n+1}} - 1\\right) = \\lambda$$

- $\\lambda > 1$：收敛
- $\\lambda < 1$：发散

**狄利克雷判别法**：判断一般级数收敛的重要方法

若 $\\{a_n\\}$ 单调趋于0，$\\sum b_n$ 的部分和有界，则 $\\sum a_n b_n$ 收敛。

**黎曼重排定理**：条件收敛级数的项可以重排，使其收敛于任意实数，甚至发散！`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '循环小数化分数',
        description: `**问题**：证明 $0.\\overline{9} = 0.999\\cdots = 1$

**解法**：
$$0.999\\cdots = \\frac{9}{10} + \\frac{9}{100} + \\frac{9}{1000} + \\cdots = \\sum_{n=1}^{\\infty} \\frac{9}{10^n}$$

这是公比 $r = \\frac{1}{10}$ 的几何级数：
$$= \\frac{9/10}{1 - 1/10} = \\frac{9/10}{9/10} = 1$$

**更一般地**：$0.\\overline{a_1a_2\\cdots a_n} = \\frac{a_1a_2\\cdots a_n}{10^n - 1}$`,
        scenario: '几何级数的经典应用。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '调和级数的发散速度',
        description: `调和级数发散，但发散得有多慢？

$$H_n = 1 + \\frac{1}{2} + \\frac{1}{3} + \\cdots + \\frac{1}{n} \\approx \\ln n + \\gamma$$

其中 $\\gamma \\approx 0.577$ 是欧拉常数。

**惊人的事实**：
- 要使 $H_n > 100$，需要 $n \\approx 1.5 \\times 10^{43}$ 项！
- 宇宙年龄约 $1.4 \\times 10^{10}$ 年，即使每秒加一项，也远远不够！

这就是为什么调和级数"看起来像收敛"——它发散得太慢了！`,
        scenario: '理解调和级数的特性。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '黎曼ζ函数与素数',
        description: `黎曼ζ函数定义为：
$$\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = 1 + \\frac{1}{2^s} + \\frac{1}{3^s} + \\cdots$$

当 $s > 1$ 时收敛。欧拉证明了它与素数的深刻联系：
$$\\zeta(s) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}$$

**黎曼猜想**：$\\zeta(s)$ 所有非平凡零点的实部都是 $\\frac{1}{2}$

这是千禧年七大难题之一，悬赏100万美元！`,
        scenario: '数学皇冠上的明珠。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '审敛流程图', 
        description: `**Step 1**：检验必要条件 $\\lim u_n = 0$
- 若 $\\lim u_n \\neq 0$ → **发散**，结束
- 若 $\\lim u_n = 0$ → 继续判断

**Step 2**：判断级数类型
- **正项级数** → 用比较法/比值法/根值法
- **交错级数** → 用莱布尼茨判别法
- **一般级数** → 先判断绝对收敛

**Step 3**：选择合适方法
- 含 $n!$、$a^n$ → 比值法
- 含 $n^n$、$(\\cdots)^n$ → 根值法
- 其他 → 与p级数/几何级数比较`
      },
      { 
        number: 2, 
        title: '比值/根值法失效怎么办', 
        description: `当 $\\rho = 1$ 时，需要更精细的判别法：

**拉阿比判别法**：
$$\\lambda = \\lim n\\left(\\frac{u_n}{u_{n+1}} - 1\\right)$$
- $\\lambda > 1$：收敛
- $\\lambda < 1$：发散

**积分判别法**：
若 $f(n) = u_n$，$f(x)$ 在 $[1, +\\infty)$ 上正且单调递减，则：
$$\\sum u_n \\text{ 与 } \\int_1^{\\infty} f(x) dx \\text{ 同敛散}$$`
      },
      { 
        number: 3, 
        title: '常见错误警示', 
        description: `❌ **错误1**：$\\lim u_n = 0$ 就认为级数收敛
✅ 这是必要条件，不是充分条件！

❌ **错误2**：只检验一个审敛法就下结论
✅ 一个方法失效（如 $\\rho=1$），要换方法

❌ **错误3**：忘记检验端点
✅ 幂级数的收敛区间端点需要单独判断

❌ **错误4**：混淆条件收敛和绝对收敛
✅ 条件收敛的级数不能重排！`,
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
      mainText: `**🎯 引子：计算机如何计算 sin 和 cos？**

你的计算器能在瞬间算出 $\\sin(1.234) = 0.9438...$，但它并不知道什么是三角函数！

它是怎么做到的？

**答案**：用多项式逼近！

$$\\sin x = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\frac{x^7}{5040} + \\cdots$$

这就是**幂级数**的威力——把复杂的函数变成无穷多项式！

---

## 📐 什么是幂级数？——"无限维"的多项式

### 直观理解

多项式是我们最熟悉的函数：$P(x) = a_0 + a_1 x + a_2 x^2 + \\cdots + a_n x^n$

幂级数就是"无限多项式"：
$$\\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + a_3 x^3 + \\cdots$$

**类比**：
- 多项式 = 有限个积木搭成的房子
- 幂级数 = 无限个积木搭成的"完美房子"

虽然我们永远搭不完无限块积木，但只要"地基打得好"（在收敛域内），房子就能稳稳地立住！

---

### 收敛半径——安全的"活动范围"

**核心问题**：幂级数在哪些 $x$ 值处收敛？

**阿贝尔定理**：幂级数的收敛域是一个以原点为中心的**区间** $(-R, R)$

**收敛半径公式**：
$$R = \\lim_{n\\to\\infty} \\left|\\frac{a_n}{a_{n+1}}\\right| \\quad \\text{或} \\quad R = \\frac{1}{\\lim \\sqrt[n]{|a_n|}}$$

**三种情况**：
| 收敛半径 | 收敛域 | 直观理解 |
|----------|--------|----------|
| $R = +\\infty$ | 全实轴 | "超级稳定"，任何 $x$ 都收敛（如 $e^x$ 的展开） |
| $R = 0$ | 仅 $x=0$ | "极度敏感"，只有中心点收敛 |
| $0 < R < +\\infty$ | $(-R, R)$ 或 $[-R, R]$ 等 | 有"活动边界"，端点需单独判断 |

**类比**：收敛半径就像安全活动范围——在范围内，级数"表现良好"；超出范围，级数"失控发散"。

---

## 🔧 幂级数的"超能力"

### 能力1：逐项求导

在收敛域内，幂级数可以逐项求导：
$$\\left(\\sum a_n x^n\\right)' = \\sum n a_n x^{n-1} = a_1 + 2a_2 x + 3a_3 x^2 + \\cdots$$

**这意味着什么？** 

$e^x$ 展开式逐项求导后还是 $e^x$ 本身！
$$\\left(\\sum \\frac{x^n}{n!}\\right)' = \\sum \\frac{x^{n-1}}{(n-1)!} = \\sum \\frac{x^n}{n!}$$

这完美解释了为什么 $\\frac{d}{dx}e^x = e^x$！

---

### 能力2：逐项积分

$$\\int_0^x \\left(\\sum a_n t^n\\right) dt = \\sum \\frac{a_n}{n+1} x^{n+1}$$

**威力展示**：从 $\\frac{1}{1-x} = \\sum x^n$ 可以积分得到：
$$-\\ln(1-x) = \\sum \\frac{x^{n+1}}{n+1} = x + \\frac{x^2}{2} + \\frac{x^3}{3} + \\cdots$$

换个变量就得到 $\\ln(1+x)$ 的展开式！

---

## 🧮 泰勒级数——用导数"刻画"函数

**核心思想**：如果函数 $f(x)$ 可以展开为幂级数，那这个幂级数由它的各阶导数完全决定！

**泰勒展开式**：
$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(x_0)}{n!} (x-x_0)^n$$

**记忆口诀**：$n$ 阶导数除以 $n$ 的阶乘，乘以 $(x-x_0)$ 的 $n$ 次方

---

### 五大必背展开式

| 函数 | 泰勒展开式（在 $x=0$ 处） | 收敛域 |
|------|---------------------------|--------|
| $e^x$ | $1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$ | $(-\\infty, +\\infty)$ |
| $\\sin x$ | $x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots$ | $(-\\infty, +\\infty)$ |
| $\\cos x$ | $1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots$ | $(-\\infty, +\\infty)$ |
| $\\frac{1}{1-x}$ | $1 + x + x^2 + x^3 + \\cdots$ | $(-1, 1)$ |
| $\\ln(1+x)$ | $x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots$ | $(-1, 1]$ |

**有趣观察**：
- $e^x$ 的展开式代入 $ix$，分别取实部和虚部，就能得到 $\\cos x$ 和 $\\sin x$ 的展开式！
- 这正是欧拉公式 $e^{ix} = \\cos x + i\\sin x$ 的来源！

---

## 🎮 幂级数的应用

### 应用1：计算无理数

计算 $e$：
$$e = \\sum_{n=0}^{\\infty} \\frac{1}{n!} = 1 + 1 + \\frac{1}{2} + \\frac{1}{6} + \\frac{1}{24} + \\cdots$$

取前10项：$e \\approx 2.718281801...$，精确到小数点后7位！

**为什么收敛这么快？** 因为 $n!$ 增长极快，项 $\\frac{1}{n!}$ 迅速趋于0。

---

### 应用2：计算"算不出来"的积分

计算 $\\int_0^1 e^{-x^2} dx$

这个积分没有初等原函数！但可以：
1. 展开 $e^{-x^2} = \\sum \\frac{(-x^2)^n}{n!} = \\sum (-1)^n \\frac{x^{2n}}{n!}$
2. 逐项积分：$\\int_0^1 e^{-x^2} dx = \\sum (-1)^n \\frac{1}{(2n+1) \\cdot n!}$
3. 取前几项求近似值

这就是**概率论**中正态分布积分的来源！

---

### 应用3：解微分方程

求 $y' = y$, $y(0) = 1$ 的解

**级数解法**：
1. 设 $y = \\sum a_n x^n$
2. 则 $y' = \\sum (n+1)a_{n+1} x^n$
3. 由 $y' = y$：$a_{n+1} = \\frac{a_n}{n+1}$
4. 由 $y(0) = 1$：$a_0 = 1$
5. 递推得 $a_n = \\frac{1}{n!}$
6. 故 $y = \\sum \\frac{x^n}{n!} = e^x$

**这揭示了幂级数解微分方程的一般方法！**`,
      highlights: [],
    },
    
    extension: {
      essence: `**幂级数的本质**：幂级数提供了一个函数的"无穷多项式表示"。

**解析函数**：能展开为幂级数的函数称为解析函数。它们具有：
- 无穷次可微
- 局部信息决定整体（泰勒级数的唯一性）
- 极好的运算性质

**为什么泰勒展开重要？**

多项式是最简单的函数，计算、求导、积分都很方便。把复杂函数展开成多项式，就能用简单的运算处理复杂问题。

**收敛半径的几何意义**：
复平面上，收敛域是一个圆盘。圆的边界上通常有函数的"奇点"——使函数无定义或不可微的点。`,
      extension: `**复幂级数**：
$$f(z) = \\sum_{n=0}^{\\infty} a_n z^n$$

在复平面上定义了**解析函数**。收敛域是以原点为圆心的圆盘。

**唯一性定理**：
若 $\\sum a_n x^n = \\sum b_n x^n$ 在某个区间上成立，则 $a_n = b_n$ 对所有 $n$ 成立。

**应用**：证明恒等式、求解差分方程

**洛朗级数**：
对于有奇点的函数，可以用洛朗级数（含负幂次项）：
$$f(z) = \\sum_{n=-\\infty}^{\\infty} a_n z^n$$

这是复分析研究奇点性质的重要工具。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算器的秘密',
        description: `**问题**：计算器如何计算 $\\sin(1.234)$？

**答案**：使用泰勒展开！

$$\\sin x = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\frac{x^7}{5040} + \\cdots$$

对于 $x = 1.234$：
- 第1项：$1.234$
- 第2项：$-1.234^3/6 = -0.313...$
- 第3项：$+1.234^5/120 = 0.024...$
- ...

只需5-6项就能精确到小数点后10位！

**技巧**：先用周期性把 $x$ 变小（如 $\\sin(3.14) = \\sin(3.14-\\pi)$），收敛更快。`,
        scenario: '数值计算的基础。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '欧拉公式的推导',
        description: `从泰勒级数推导 $e^{ix} = \\cos x + i\\sin x$：

$$e^{ix} = \\sum_{n=0}^{\\infty} \\frac{(ix)^n}{n!} = \\sum_{n=0}^{\\infty} \\frac{i^n x^n}{n!}$$

注意到 $i^0=1$, $i^1=i$, $i^2=-1$, $i^3=-i$, $i^4=1$, ...

分离实部和虚部：
$$e^{ix} = \\underbrace{\\left(1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots\\right)}_{= \\cos x} + i\\underbrace{\\left(x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots\\right)}_{= \\sin x}$$

**令 $x = \\pi$**：$e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1$，即 $e^{i\\pi} + 1 = 0$！

这就是"最美公式"的由来！`,
        scenario: '数学之美的体现。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '物理中的级数展开',
        description: `**量子力学**：散射振幅的级数展开
**统计力学**：配分函数的展开
**广义相对论**：度规张量的微扰展开

**为什么物理学家喜欢级数？**

很多物理问题没有精确解，但可以用级数求近似解。第一项是"零阶近似"，加更多项就越精确。

**例子**：单摆周期

精确解涉及椭圆积分，无初等表达式。但小角度近似：
$$T \\approx 2\\pi\\sqrt{\\frac{L}{g}}\\left(1 + \\frac{\\theta_0^2}{16} + \\cdots\\right)$$

第一项就是高中物理的公式，后面的项是修正。`,
        scenario: '物理中的近似方法。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '求收敛半径', 
        description: `**方法一**：比值法
$$R = \\lim_{n\\to\\infty} \\left|\\frac{a_n}{a_{n+1}}\\right|$$

**方法二**：根值法
$$R = \\frac{1}{\\lim \\sqrt[n]{|a_n|}}$$

**关键**：端点 $x = \\pm R$ 需单独判断！

**例子**：$\\sum \\frac{x^n}{n}$
- $R = \\lim \\frac{a_n}{a_{n+1}} = \\lim \\frac{n+1}{n} = 1$
- $x = 1$：$\\sum \\frac{1}{n}$ 发散（调和级数）
- $x = -1$：$\\sum \\frac{(-1)^n}{n}$ 收敛（交错级数）
- 收敛域：$[-1, 1)$`
      },
      { 
        number: 2, 
        title: '函数展开为幂级数', 
        description: `**直接法**：计算各阶导数，代入泰勒公式
$$f(x) = \\sum \\frac{f^{(n)}(0)}{n!} x^n$$

**间接法**（更常用）：
1. 利用已知展开式
2. 逐项求导/积分
3. 变量替换

**例子**：求 $\\arctan x$ 的展开

已知 $\\frac{1}{1+x^2} = \\sum (-1)^n x^{2n}$

两边积分：
$$\\arctan x = \\int_0^x \\frac{dt}{1+t^2} = \\sum (-1)^n \\frac{x^{2n+1}}{2n+1}$$`
      },
      { 
        number: 3, 
        title: '求和函数', 
        description: `已知幂级数，求和函数：

**技巧1**：化为几何级数
$$\\sum x^n = \\frac{1}{1-x}, \\quad |x| < 1$$

**技巧2**：逐项求导/积分
设 $S(x) = \\sum n x^n$，注意到 $\\sum x^n = \\frac{1}{1-x}$
$$\\frac{d}{dx}\\left(\\frac{1}{1-x}\\right) = \\frac{1}{(1-x)^2} = \\sum n x^{n-1}$$
故 $S(x) = \\frac{x}{(1-x)^2}$

**技巧3**：建立微分方程
设 $S(x) = \\sum \\frac{x^n}{n!}$，则 $S'(x) = S(x)$，$S(0) = 1$
解得 $S(x) = e^x$`,
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
      mainText: `**🎯 引子：音乐的数学奥秘**

当你弹钢琴的中央C时，为什么能听出是钢琴而不是小提琴？

两个乐器演奏同一个音符，基频都是261.6Hz，但音色完全不同。

**答案**：因为除了基频，还有不同的"泛音"（谐波）！

- 钢琴的泛音分布与小提琴不同
- 这些泛音的"配方"决定了音色
- 傅里叶级数就是这个"配方"的数学表达！

---

## 🎵 傅里叶级数：把声音拆成"成分"

### 核心思想

**傅里叶的惊人发现**：任何周期函数，都可以分解成正弦和余弦函数的叠加！

$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)$$

**类比**：
- 周期函数 = 一首复杂的音乐
- 正弦/余弦函数 = 单纯的"纯音"
- 傅里叶级数 = 把音乐拆解成一个个纯音

每个系数 $a_n, b_n$ 告诉你：频率为 $n$ 的"纯音"占多少比重。

---

## 📐 数学定义

### 标准形式

设 $f(x)$ 是周期为 $2\\pi$ 的函数，其傅里叶级数为：

$$f(x) \\sim \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)$$

### 傅里叶系数公式

**直流分量**（平均值）：
$$a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) dx$$

**余弦系数**（偶函数部分的"含量"）：
$$a_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\cos nx \\, dx$$

**正弦系数**（奇函数部分的"含量"）：
$$b_n = \\frac{1}{\\pi} \\int_{-\\pi}^{\\pi} f(x) \\sin nx \\, dx$$

---

## 🎨 直观理解

### 类比1：光的分解

牛顿用三棱镜把白光分解成彩虹——不同颜色的光。

傅里叶级数就是"数学三棱镜"：
- 白光 → 周期函数
- 彩虹颜色 → 不同频率的正弦波
- 每种颜色的亮度 → 系数 $a_n, b_n$

### 类比2：食谱

把一道菜分解成食材：
- 主菜 → 周期函数
- 食材 → 不同频率的正弦波
- 用量 → 系数

**关键**：知道食材和用量，就能还原整道菜！

---

## 🔧 收敛定理（狄利克雷条件）

**问题**：傅里叶级数什么时候收敛到原函数？

**狄利克雷定理**：若 $f(x)$ 满足
1. 在一个周期内连续或只有**有限个第一类间断点**
2. 在一个周期内只有**有限个极值点**

则傅里叶级数收敛，且：

| 位置 | 收敛值 |
|------|--------|
| 连续点 $x$ | $f(x)$ |
| 间断点 $x$ | $\\frac{f(x^+)+f(x^-)}{2}$（左右极限的平均） |

**直观理解**：即使函数有"跳跃"，傅里叶级数也会在跳跃处"取中庸之道"。

---

## 🌀 两种特殊形式

### 正弦级数（奇函数展开）

若 $f(x)$ 是奇函数（$f(-x) = -f(x)$）：
- $a_n = 0$（所有余弦系数为零）
- 只剩正弦项：$f(x) = \\sum b_n \\sin nx$

**例子**：方波是奇函数，只有正弦项！

### 余弦级数（偶函数展开）

若 $f(x)$ 是偶函数（$f(-x) = f(x)$）：
- $b_n = 0$（所有正弦系数为零）
- 只剩余弦项：$f(x) = \\frac{a_0}{2} + \\sum a_n \\cos nx$

**技巧**：利用奇偶性可以省一半计算量！

---

## 🎼 复数形式（更优雅）

$$f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{inx}$$

其中 $c_n = \\frac{1}{2\\pi} \\int_{-\\pi}^{\\pi} f(x) e^{-inx} dx$

**为什么更优雅？**
- 只有一个系数 $c_n$，而不是 $a_n$ 和 $b_n$
- 负频率的出现让公式对称
- 连接到傅里叶变换更自然

**系数关系**：
$$c_n = \\frac{a_n - ib_n}{2}, \\quad c_{-n} = \\frac{a_n + ib_n}{2}, \\quad c_0 = \\frac{a_0}{2}$$`,
      highlights: [],
    },
    
    extension: {
      essence: `**吉布斯现象——一个美丽的"缺陷"**

用傅里叶级数逼近方波时，在间断点附近会出现约**9%的过冲**。

更神奇的是：无论加多少项，这个过冲永远存在！

**为什么？** 傅里叶级数在间断点收敛于左右极限的平均值，但从两边逼近时需要"跃迁"，这个跃迁会产生振荡。

**直觉**：想象你要用光滑的正弦波"爬上一堵墙"，墙越陡，你需要"冲刺"得越猛，过冲就不可避免。

---

**频域与傅里叶变换**

傅里叶级数用于周期函数。对于**非周期**函数呢？

让周期 $T \\to \\infty$，傅里叶级数变成**傅里叶变换**：
$$\\hat{f}(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i\\omega x} dx$$

**物理意义**：
- 时域信号 $f(t)$ → 频域表示 $\\hat{f}(\\omega)$
- 告诉你每个频率成分"有多少"

这就是频谱分析的数学基础！`,
      extension: `**帕塞瓦尔等式**

傅里叶系数和函数的能量有深刻联系：
$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} |f(x)|^2 dx = \\frac{a_0^2}{2} + \\sum_{n=1}^{\\infty}(a_n^2 + b_n^2)$$

**物理意义**：信号的总能量 = 各频率成分能量之和

**应用**：
- 信号处理中的能量计算
- 量子力学中的态归一化

---

**傅里叶级数的应用领域**

| 领域 | 应用 |
|------|------|
| 信号处理 | 频谱分析、滤波、压缩 |
| 图像处理 | JPEG压缩（离散余弦变换DCT） |
| 音频处理 | MP3压缩、均衡器 |
| 量子力学 | 位置空间 ↔ 动量空间 |
| 热传导 | 分离变量法解偏微分方程 |
| 振动分析 | 共振频率识别 |`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '方波的傅里叶展开——谐波叠加的魔法',
        description: `**方波定义**：
$$f(x) = \\begin{cases} -1, & x \\in [-\\pi, 0) \\\\ 1, & x \\in [0, \\pi) \\end{cases}$$

**计算系数**：
由于方波是奇函数，$a_n = 0$（没有余弦项）

$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin nx \\, dx = \\frac{2}{\\pi}\\int_0^{\\pi} \\sin nx \\, dx = \\frac{2(1-(-1)^n)}{n\\pi}$$

**展开式**：
$$f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$$

**观察**：只有奇次谐波！这是因为方波有特殊的对称性。

**动画演示**：
- n=1：一条正弦波，像"波浪"
- n=3：加三次谐波，开始"变方"
- n=7：更像方波了
- n=∞：完美方波！

**神奇之处**：无穷多个"弯弯的"正弦波，竟然能拼出"直角"的方波！`,
        scenario: '经典例子，展示谐波叠加。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '锯齿波与莱布尼茨级数',
        description: `**锯齿波**：$f(x) = x$，$x \\in [-\\pi, \\pi]$

**傅里叶展开**：
$$x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\frac{\\sin 4x}{4} + \\cdots\\right)$$

**奇妙的副产品**：令 $x = \\frac{\\pi}{2}$

$$\\frac{\\pi}{2} = 2\\left(1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots\\right)$$

即著名的**莱布尼茨级数**：
$$\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\cdots$$

**意义**：用无穷级数表示 $\\pi$！虽然收敛很慢，但数学上非常优美。`,
        scenario: '导出重要常数级数。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '你的耳机如何工作——信号滤波',
        description: `**场景**：听音乐时，均衡器可以增强低音、减弱高音。

**原理**：利用傅里叶分析！

**步骤**：
1. 把音频信号分解成傅里叶级数
2. 对不同频率成分乘以不同系数（滤波器）
3. 重新合成信号

**低通滤波**（增强低音）：
$$g(x) = \\sum_{|n| \\leq N} c_n e^{inx}$$
保留低频，去掉高频。

**高通滤波**（增强高音）：
$$g(x) = \\sum_{|n| > N} c_n e^{inx}$$
去掉低频，保留高频。

**实际应用**：
- 降噪耳机：去掉高频噪声
- MP3压缩：去掉人耳听不到的频率成分
- 图像锐化：增强高频（边缘）`,
        scenario: '数字信号处理核心应用。',
      },
      {
        id: 'app4',
        type: 'research',
        title: 'JPEG图像压缩的数学原理',
        description: `**问题**：一张照片几兆字节，怎么压缩到几百KB？

**答案**：利用离散余弦变换（DCT），傅里叶级数的"表亲"！

**步骤**：
1. 把图像分成8×8的小块
2. 对每个小块做DCT，得到64个频率系数
3. 人眼对高频细节不敏感，把这些系数"扔掉"或量化
4. 只保留重要的低频成分

**结果**：图像大小减小90%，但看起来几乎一样！

**这就是为什么**：
- JPEG图片边缘有时有"块状"伪影
- 高压缩率会损失细节
- 文字图片不适合用JPEG（边缘太锐利）`,
        scenario: '多媒体压缩的核心算法。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '展开周期函数的步骤', 
        description: `**Step 1**：确定周期 $T$ 和基本角频率 $\\omega = \\frac{2\\pi}{T}$

**Step 2**：判断函数的奇偶性
- 奇函数 → 只算正弦系数
- 偶函数 → 只算余弦系数
- 都不是 → 全部都要算

**Step 3**：计算系数
$$a_0 = \\frac{2}{T}\\int_{0}^{T} f(x) dx$$
$$a_n = \\frac{2}{T}\\int_{0}^{T} f(x) \\cos n\\omega x \\, dx$$
$$b_n = \\frac{2}{T}\\int_{0}^{T} f(x) \\sin n\\omega x \\, dx$$

**Step 4**：写出展开式

**Step 5**：验证收敛条件`
      },
      { 
        number: 2, 
        title: '利用奇偶性简化计算', 
        description: `**奇函数的妙用**：
若 $f(-x) = -f(x)$，则：
- $a_n = 0$（自动为零！）
- $b_n = \\frac{4}{T}\\int_{0}^{T/2} f(x) \\sin n\\omega x \\, dx$

**偶函数的妙用**：
若 $f(-x) = f(x)$，则：
- $b_n = 0$（自动为零！）
- $a_n = \\frac{4}{T}\\int_{0}^{T/2} f(x) \\cos n\\omega x \\, dx$

**关键**：积分区间减半，计算量减半！

**记忆口诀**：奇函数乘奇函数是偶函数，积分为零；奇函数乘偶函数是奇函数，积分为零。`
      },
      { 
        number: 3, 
        title: '傅里叶级数的物理意义', 
        description: `**时域 vs 频域**

| 视角 | 描述 | 傅里叶表示 |
|------|------|------------|
| 时域 | 信号随时间变化 | $f(t)$ |
| 频域 | 各频率成分的强度 | $a_n, b_n$ 或 $c_n$ |

**频谱图**：
- 横轴：频率 $n\\omega$
- 纵轴：幅度 $\\sqrt{a_n^2 + b_n^2}$
- 告诉你每个频率"占多大比重"

**实际意义**：
- $a_0/2$：直流分量（平均值）
- $n=1$：基波（基础频率）
- $n>1$：谐波（倍频成分）
- 振幅谱：$|c_n|$ 或 $\\sqrt{a_n^2+b_n^2}$
- 相位谱：$\\arctan(-b_n/a_n)$`,
      },
    ],
  },
}

// ============================================
// 向量代数与空间解析几何知识点
// ============================================

// 向量及其运算知识点
const vectorOperationsPoint: KnowledgePoint = {
  id: 'vector-operations',
  moduleId: 'vector',
  name: '向量及其运算',
  formula: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta, \\quad \\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}|\\sin\\theta \\cdot \\vec{n}',
  coreSentence: '向量是"有方向的量"——既有大小又有方向，点积度量相似度，叉积生成垂直向量。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [
          { id: 'O', x: 0, y: 0, z: 0, label: 'O' },
          { id: 'a', x: 2, y: 1, z: 1, label: 'a' },
          { id: 'b', x: 1, y: 2, z: 1, label: 'b' },
        ],
        sliders: [
          { id: 'angle_a', name: 'angle_a', min: 0, max: 6.28, step: 0.1, defaultValue: 0.46, label: '向量a方向角' },
          { id: 'angle_b', name: 'angle_b', min: 0, max: 6.28, step: 0.1, defaultValue: 1.1, label: '向量b方向角' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：有方向的量**

向量是既有大小又有方向的量，用箭头表示。在坐标系中，向量可以用分量表示。

---

**📐 向量的表示**

**几何表示**：有向线段 $\\vec{AB}$，从 A 指向 B

**坐标表示**：$\\vec{a} = (a_x, a_y, a_z) = a_x\\vec{i} + a_y\\vec{j} + a_z\\vec{k}$

**模（长度）**：$|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}$

---

**📝 向量的运算**

**1. 加法（三角形法则/平行四边形法则）**
$$\\vec{a} + \\vec{b} = (a_x + b_x, a_y + b_y, a_z + b_z)$$

**2. 数乘**
$$\\lambda\\vec{a} = (\\lambda a_x, \\lambda a_y, \\lambda a_z)$$

**3. 点积（数量积）**
$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = a_x b_x + a_y b_y + a_z b_z$$

**性质**：
- $\\vec{a} \\perp \\vec{b} \\Leftrightarrow \\vec{a} \\cdot \\vec{b} = 0$
- $\\vec{a} \\cdot \\vec{a} = |\\vec{a}|^2$

**4. 叉积（向量积）**
$$\\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{vmatrix}$$

**性质**：
- $\\vec{a} \\times \\vec{b} \\perp \\vec{a}$，$\\vec{a} \\times \\vec{b} \\perp \\vec{b}$
- $|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta$（平行四边形面积）
- $\\vec{a} \\parallel \\vec{b} \\Leftrightarrow \\vec{a} \\times \\vec{b} = \\vec{0}$

---

**📝 混合积**

$$[\\vec{a}, \\vec{b}, \\vec{c}] = (\\vec{a} \\times \\vec{b}) \\cdot \\vec{c} = \\begin{vmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{vmatrix}$$

几何意义：平行六面体的有向体积。`,
      highlights: [],
    },
    
    extension: {
      essence: `**向量的本质**：向量是向量空间中的元素，满足加法和数乘运算的八条公理。

**点积的几何意义**：度量两个向量的"相似程度"——同向为正，反向为负，垂直为零。

**叉积的几何意义**：生成一个垂直于两向量的新向量，其大小等于两向量张成的平行四边形面积。

**右手定则**：叉积方向遵循右手定则，四指从 $\\vec{a}$ 转向 $\\vec{b}$，拇指指向 $\\vec{a} \\times \\vec{b}$。`,
      extension: `**向量空间**：抽象的向量空间可以是函数空间、多项式空间等，只要满足八条公理。

**点积的推广**：内积空间中的内积是点积的推广，可以定义函数的内积。

**叉积的局限**：叉积只在三维和七维空间有定义。

**向量的应用**：力、速度、加速度、电场、磁场等物理量都是向量。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算夹角',
        description: `已知 $\\vec{a} = (1, 2, 2)$，$\\vec{b} = (2, 1, 2)$

$$\\cos\\theta = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{1 \\times 2 + 2 \\times 1 + 2 \\times 2}{\\sqrt{9} \\times \\sqrt{9}} = \\frac{8}{9}$$

$$\\theta = \\arccos\\frac{8}{9} \\approx 27.3°$$`,
        scenario: '确定两向量的相对方向。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算面积',
        description: `三角形 ABC 的面积：

$$S = \\frac{1}{2}|\\vec{AB} \\times \\vec{AC}|$$

例：A(1,0,0), B(0,1,0), C(0,0,1)

$\\vec{AB} = (-1, 1, 0)$，$\\vec{AC} = (-1, 0, 1)$

$\\vec{AB} \\times \\vec{AC} = (1, 1, 1)$

$S = \\frac{1}{2}\\sqrt{3}$`,
        scenario: '几何计算。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '物理学应用',
        description: `**力学**：$\\vec{F} = m\\vec{a}$（牛顿第二定律）

**电磁学**：洛伦兹力 $\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})$

**功**：$W = \\vec{F} \\cdot \\vec{s}$

**力矩**：$\\vec{M} = \\vec{r} \\times \\vec{F}$

向量是物理学的语言！`,
        scenario: '物理建模。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '选择坐标系', 
        description: `根据问题选择合适的坐标系：
- **直角坐标系**：最常用，适合对称问题
- **球坐标系**：适合球对称问题
- **柱坐标系**：适合轴对称问题

选择合适的坐标系可以大大简化计算。`
      },
      { 
        number: 2, 
        title: '选择运算类型', 
        description: `**判断垂直**：用点积，$\\vec{a} \\cdot \\vec{b} = 0$

**判断平行**：用叉积，$\\vec{a} \\times \\vec{b} = \\vec{0}$

**求夹角**：用点积公式

**求垂直向量**：用叉积

**求面积/体积**：用叉积/混合积`
      },
      { 
        number: 3, 
        title: '利用向量性质', 
        description: `**单位向量**：$\\vec{e}_a = \\frac{\\vec{a}}{|\\vec{a}|}$

**方向余弦**：$\\cos\\alpha = \\frac{a_x}{|\\vec{a}|}$ 等

**投影公式**：$\\text{proj}_{\\vec{b}}\\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\vec{b}$`
      },
    ],
  },
}

// 平面与直线知识点
const planeAndLinePoint: KnowledgePoint = {
  id: 'plane-and-line',
  moduleId: 'vector',
  name: '平面与直线',
  formula: '\\Pi: Ax + By + Cz + D = 0, \\quad L: \\frac{x-x_0}{m} = \\frac{y-y_0}{n} = \\frac{z-z_0}{p}',
  coreSentence: '平面由法向量确定，直线由方向向量确定——方程形式反映几何本质。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'A', name: 'A', min: -2, max: 2, step: 0.5, defaultValue: 1, label: 'A' },
          { id: 'B', name: 'B', min: -2, max: 2, step: 0.5, defaultValue: 1, label: 'B' },
          { id: 'C', name: 'C', min: -2, max: 2, step: 0.5, defaultValue: 1, label: 'C' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：几何对象代数化**

平面和直线是空间中最基本的几何对象。通过向量，我们可以用方程来精确描述它们。

---

**📐 平面方程**

**一般式**：$Ax + By + Cz + D = 0$

法向量 $\\vec{n} = (A, B, C)$

**点法式**：$A(x-x_0) + B(y-y_0) + C(z-z_0) = 0$

过点 $(x_0, y_0, z_0)$，法向量 $\\vec{n}$

**截距式**：$\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1$

截距分别为 $a, b, c$

**三点式**：过三点 $P_1, P_2, P_3$ 确定一个平面

---

**📝 直线方程**

**一般式**（交线）：
$$\\begin{cases} A_1x + B_1y + C_1z + D_1 = 0 \\\\ A_2x + B_2y + C_2z + D_2 = 0 \\end{cases}$$

**对称式**（点向式）：
$$\\frac{x-x_0}{m} = \\frac{y-y_0}{n} = \\frac{z-z_0}{p}$$

方向向量 $\\vec{s} = (m, n, p)$

**参数式**：
$$\\begin{cases} x = x_0 + mt \\\\ y = y_0 + nt \\\\ z = z_0 + pt \\end{cases}$$

---

**📝 距离公式**

**点到平面**：
$$d = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$

**点到直线**：
$$d = \\frac{|\\vec{P_0P_1} \\times \\vec{s}|}{|\\vec{s}|}$$

其中 $P_0$ 是直线上的点，$\\vec{s}$ 是方向向量。

---

**📝 位置关系**

**两平面**：
- 平行：$\\frac{A_1}{A_2} = \\frac{B_1}{B_2} = \\frac{C_1}{C_2} \\neq \\frac{D_1}{D_2}$
- 重合：$\\frac{A_1}{A_2} = \\frac{B_1}{B_2} = \\frac{C_1}{C_2} = \\frac{D_1}{D_2}$
- 垂直：$A_1A_2 + B_1B_2 + C_1C_2 = 0$

**两直线**：
- 平行：方向向量平行
- 垂直：方向向量点积为零
- 异面：既不相交也不平行`,
      highlights: [],
    },
    
    extension: {
      essence: `**平面的本质**：平面是所有满足 $\\vec{n} \\cdot \\vec{r} = d$ 的点的集合，其中 $\\vec{n}$ 是法向量。

**直线的本质**：直线是所有满足 $\\vec{r} = \\vec{r}_0 + t\\vec{s}$ 的点的集合，其中 $\\vec{s}$ 是方向向量。

**方程的几何意义**：方程形式反映了几何对象的本质特征——法向量或方向向量。`,
      extension: `**线性流形**：平面和直线都是线性流形的特例。一般地，$n$ 维空间中的 $k$ 维线性流形由 $n-k$ 个线性方程确定。

**对偶性**：在三维空间中，点和平面是对偶的——任何关于点和面的定理，交换点和面的角色，得到对偶定理。

**投影**：点、线、面之间的投影关系是计算机图形学的基础。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '求平面方程',
        description: `求过点 $A(1,2,3)$ 且垂直于向量 $\\vec{n} = (1,1,1)$ 的平面。

**点法式**：
$1(x-1) + 1(y-2) + 1(z-3) = 0$

化简：$x + y + z - 6 = 0$`,
        scenario: '根据条件确定平面。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求直线方程',
        description: `求过点 $A(1,2,3)$ 和 $B(2,1,4)$ 的直线。

方向向量：$\\vec{s} = \\vec{AB} = (1, -1, 1)$

**对称式**：
$$\\frac{x-1}{1} = \\frac{y-2}{-1} = \\frac{z-3}{1}$$`,
        scenario: '根据条件确定直线。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '计算距离',
        description: `求点 $P(1,2,3)$ 到平面 $x + y + z - 6 = 0$ 的距离。

$$d = \\frac{|1 + 2 + 3 - 6|}{\\sqrt{1+1+1}} = \\frac{0}{\\sqrt{3}} = 0$$

点在平面上！`,
        scenario: '位置关系判定。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '确定方程类型', 
        description: `**求平面**：
- 已知一点和法向量 → 点法式
- 已知三点 → 三点式或求法向量后用点法式
- 已知截距 → 截距式

**求直线**：
- 已知一点和方向向量 → 对称式
- 已知两点 → 求方向向量后用对称式
- 两平面交线 → 一般式`
      },
      { 
        number: 2, 
        title: '位置关系判断', 
        description: `**两平面**：比较法向量
- 法向量平行 → 平面平行或重合
- 法向量垂直 → 平面垂直

**两直线**：比较方向向量
- 方向向量平行 → 直线平行
- 方向向量垂直 → 直线垂直
- 既不平行也不相交 → 异面直线`
      },
      { 
        number: 3, 
        title: '夹角计算', 
        description: `**两平面夹角**：法向量夹角（或补角）
$$\\cos\\theta = \\frac{|\\vec{n_1} \\cdot \\vec{n_2}|}{|\\vec{n_1}||\\vec{n_2}|}$$

**两直线夹角**：方向向量夹角
$$\\cos\\theta = \\frac{|\\vec{s_1} \\cdot \\vec{s_2}|}{|\\vec{s_1}||\\vec{s_2}|}$$

**直线与平面夹角**：方向向量与法向量夹角的余角
$$\\sin\\theta = \\frac{|\\vec{s} \\cdot \\vec{n}|}{|\\vec{s}||\\vec{n}|}$$`
      },
    ],
  },
}

// 空间曲面知识点
const surfacesPoint: KnowledgePoint = {
  id: 'surfaces',
  moduleId: 'vector',
  name: '空间曲面',
  formula: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1 \\quad (椭球面)',
  coreSentence: '二次曲面是三维空间中的"二次曲线"——用"截痕法"理解曲面的形状。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'surfaceType', name: '曲面类型', min: 0, max: 6, step: 1, defaultValue: 0, label: '曲面' },
          { id: 'a', name: 'a', min: 0.5, max: 3, step: 0.25, defaultValue: 2, label: 'a' },
          { id: 'b', name: 'b', min: 0.5, max: 3, step: 0.25, defaultValue: 1.5, label: 'b' },
          { id: 'c', name: 'c', min: 0.5, max: 3, step: 0.25, defaultValue: 1, label: 'c' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `**🎯 核心思想：截痕法理解曲面**

空间曲面是由方程 $F(x,y,z) = 0$ 确定的点的集合。用"截痕法"——用坐标平面或平行于坐标平面的平面去截曲面，通过截线的形状来理解曲面。

---

## 📐 常用二次曲面详解

### 1️⃣ 椭球面

**标准方程**：
$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$$

**图形特征**：
- 🥚 形状像一个"被拉长的球"，三个方向可以有不同的拉伸程度
- 有界封闭曲面，最"规则"的二次曲面

**截痕分析**：
| 截平面 | 截线形状 | 说明 |
|--------|----------|------|
| $z=0$ (xOy面) | 椭圆 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ | 长短半轴为 a, b |
| $y=0$ (xOz面) | 椭圆 $\\frac{x^2}{a^2} + \\frac{z^2}{c^2} = 1$ | 长短半轴为 a, c |
| $x=0$ (yOz面) | 椭圆 $\\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1$ | 长短半轴为 b, c |
| $z=h$ ($|h|<c$) | 椭圆，随 $|h|$ 增大而缩小 | 越往两端越"细" |

**特殊情况**：
- 当 $a = b = c = R$ 时，退化为球面 $x^2 + y^2 + z^2 = R^2$
- 当 $a = b$ 时，为旋转椭球面（绕 z 轴旋转形成）

---

### 2️⃣ 单叶双曲面

**标准方程**：
$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1$$

**图形特征**：
- 🎯 形状像"腰间收缩的筒"，中间细、上下粗
- 无界曲面，向上下两端无限延伸
- 单叶 = 只有一个连通部分

**截痕分析**：
| 截平面 | 截线形状 | 说明 |
|--------|----------|------|
| $z=0$ (xOy面) | 椭圆 $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ | "腰部"椭圆 |
| $z=h$ | 椭圆，随 $|h|$ 增大而扩大 | 离中心越远截面越大 |
| $x=0$ (yOz面) | 双曲线 | 开口沿 z 轴方向 |
| $y=0$ (xOz面) | 双曲线 | 开口沿 z 轴方向 |

**直观理解**：
想象一个"沙漏"的形状——中间最细，上下越来越粗大。

**实际应用**：广州塔（小蛮腰）的外形就是单叶双曲面！

---

### 3️⃣ 双叶双曲面

**标准方程**：
$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = -1$$

**图形特征**：
- 🌗 分成上下"两叶"，中间有空隙
- 两叶关于 xOy 面对称
- 无界曲面

**截痕分析**：
| 截平面 | 截线形状 | 说明 |
|--------|----------|------|
| $z=0$ (xOy面) | 无截线 | 中间有"空洞" |
| $z=h$ ($|h|>c$) | 椭圆 | 只在 $|z| > c$ 有曲面 |
| $x=0$ (yOz面) | 双曲线 | 两支分别在上下 |
| $y=0$ (xOz面) | 双曲线 | 两支分别在上下 |

**直观理解**：
像两个背靠背的"碗"，一个向上开口，一个向下开口，中间被"挖空"了。

**区分技巧**：方程右边是 $-1$（双叶）还是 $+1$（单叶）

---

### 4️⃣ 椭圆抛物面

**标准方程**：
$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = z$$

**图形特征**：
- 🥣 形状像一个"碗"，开口向上
- 顶点在原点，向 z 轴正方向无限延伸
- 无界曲面

**截痕分析**：
| 截平面 | 截线形状 | 说明 |
|--------|----------|------|
| $z=0$ (xOy面) | 点 (0,0,0) | 只有一个点——顶点 |
| $z=h$ ($h>0$) | 椭圆 $\\frac{x^2}{a^2h} + \\frac{y^2}{b^2h} = 1$ | 越高椭圆越大 |
| $x=0$ (yOz面) | 抛物线 $z = \\frac{y^2}{b^2}$ | 开口向上 |
| $y=0$ (xOz面) | 抛物线 $z = \\frac{x^2}{a^2}$ | 开口向上 |

**直观理解**：
从顶部往下看是椭圆，从侧面看是抛物线。像一个被"压扁"的旋转抛物面。

**实际应用**：卫星天线的反射面常采用抛物面形状

---

### 5️⃣ 双曲抛物面（马鞍面）

**标准方程**：
$$\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = z$$

**图形特征**：
- 🐴 形状像"马鞍"，沿 x 轴方向上凸，沿 y 轴方向下凹
- 有一个"鞍点"在原点
- 无界曲面

**截痕分析**：
| 截平面 | 截线形状 | 说明 |
|--------|----------|------|
| $z=0$ (xOy面) | 两条相交直线 $x = \\pm\\frac{a}{b}y$ | 穿过原点 |
| $z=h$ ($h>0$) | 双曲线，开口沿 x 轴 | 沿 x 方向凸起 |
| $z=h$ ($h<0$) | 双曲线，开口沿 y 轴 | 沿 y 方向凹陷 |
| $x=0$ (yOz面) | 抛物线 $z = -\\frac{y^2}{b^2}$ | 开口向下 |
| $y=0$ (xOz面) | 抛物线 $z = \\frac{x^2}{a^2}$ | 开口向上 |

**直观理解**：
想象骑在马上——前后方向向下凹陷，左右方向向上隆起。在原点处，沿不同方向有截然不同的曲率。

**记忆口诀**：一正一负成马鞍，两抛物线方向反

---

### 6️⃣ 圆锥面

**标准方程**：
$$z^2 = x^2 + y^2$$

或更一般形式：
$$\\frac{x^2}{a^2} + \\frac{y^2}{a^2} = \\frac{z^2}{c^2}$$

**图形特征**：
- 🔺 形状像两个"尖对尖"的圆锥
- 顶点在原点，上下对称
- 可看作绕 z 轴旋转的旋转面

**截痕分析**：
| 截平面 | 截线形状 | 说明 |
|--------|----------|------|
| $z=0$ (xOy面) | 点 (0,0,0) | 只有一个点——顶点 |
| $z=h$ ($h≠0$) | 圆 $x^2 + y^2 = h^2$ | 半径等于 $|h|$ |
| 过 z 轴的平面 | 两条相交直线 | 这是"锥"的特征 |

**直观理解**：
直线 $z = y$ 绕 z 轴旋转一周形成。从原点"放射"出去的曲面。

---

### 7️⃣ 圆柱面（及其他柱面）

**标准方程**：
$$x^2 + y^2 = R^2$$

**图形特征**：
- 🥫 形状像无限延伸的"圆筒"
- 方程中不出现 z，意味着 z 可取任意值
- 母线平行于 z 轴

**重要规律**：
> 方程中缺少哪个变量，柱面的母线就平行于该轴！

**常见柱面**：
| 方程 | 名称 | 特征 |
|------|------|------|
| $x^2 + y^2 = R^2$ | 圆柱面 | 母线平行 z 轴 |
| $y^2 + z^2 = R^2$ | 圆柱面 | 母线平行 x 轴 |
| $y^2 = 2px$ | 抛物柱面 | 母线平行 z 轴 |
| $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ | 椭圆柱面 | 母线平行 z 轴 |
| $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ | 双曲柱面 | 母线平行 z 轴 |

---

## 📝 旋转曲面

由平面曲线绕某轴旋转一周形成的曲面。

**绕 z 轴旋转的方法**：将方程中的 $x$（或 $y$）换成 $\\sqrt{x^2+y^2}$

**常见旋转曲面**：
| 母线 | 旋转轴 | 所得曲面 |
|------|--------|----------|
| $y = R$ (平行于 z 轴的直线) | z 轴 | 圆柱面 $x^2 + y^2 = R^2$ |
| $z = y$ (过原点的直线) | z 轴 | 圆锥面 $z^2 = x^2 + y^2$ |
| $z = y^2$ (抛物线) | z 轴 | 旋转抛物面 $z = x^2 + y^2$ |
| $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ 绕短轴 | — | 旋转椭球面 |
| 双曲线绕虚轴 | — | 单叶双曲面 |

---

## 🔍 快速识别曲面类型的技巧

1. **看方程右边**：$=1$ 还是 $=-1$ 还是 $=z$
   - $=1$ 或 $=-1$ → 双曲面（看符号判断单/双叶）
   - $=z$ → 抛物面

2. **看系数符号**：
   - 全正 → 椭球面或椭圆抛物面
   - 两正一负 → 双曲面
   - 一正一负 → 马鞍面

3. **缺变量**：
   - 方程缺一个变量 → 柱面（母线平行于缺失的轴）`,
      highlights: [],
    },
    
    extension: {
      essence: `**曲面的本质**：曲面是二维流形，可以用两个参数（如 u, v）来描述。

**二次曲面的分类**：二次曲面可以按照其渐近锥面的性质分类为椭圆型、双曲型和抛物型。

**旋转曲面的参数方程**：
$$\\begin{cases} x = f(v)\\cos u \\\\ y = f(v)\\sin u \\\\ z = g(v) \\end{cases}$$

其中 $(f(v), g(v))$ 是母线的参数方程。

**二次曲面的统一方程**：
$$Ax^2 + By^2 + Cz^2 + 2Dxy + 2Eyz + 2Fxz + Gx + Hy + Iz + J = 0$$

通过坐标变换可化为标准形。`,
      extension: `**隐函数定理**：若 $F(x,y,z) = 0$ 满足一定条件，可以局部解出 $z = z(x,y)$。

**曲面的切平面**：在曲面 $F(x,y,z) = 0$ 上点 $(x_0, y_0, z_0)$ 处，切平面方程为：

$$F_x(x-x_0) + F_y(y-y_0) + F_z(z-z_0) = 0$$

**曲面的面积**：$S = \\iint_D \\sqrt{1 + z_x^2 + z_y^2} dxdy$

**直纹面**：单叶双曲面是直纹面，即可以由直线运动生成。这是它被用于建筑结构的重要原因——可以用直的钢筋建造！`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '识别曲面类型',
        description: `判断 $x^2 + 2y^2 + 3z^2 = 1$ 是什么曲面。

**分析步骤**：
1. 标准化：$\\frac{x^2}{1} + \\frac{y^2}{1/2} + \\frac{z^2}{1/3} = 1$
2. 判断：左边三项系数全为正，右边为1
3. 结论：**椭球面**，三个半轴分别为 $1, \\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{3}}$`,
        scenario: '从方程判断曲面类型。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求旋转曲面方程',
        description: `求 $z = x^2$ 绕 z 轴旋转所得曲面。

**方法**：将 $x$ 换成 $\\pm\\sqrt{x^2+y^2}$：
$$z = (\\sqrt{x^2+y^2})^2 = x^2 + y^2$$

**结论**：这是**旋转抛物面**，即椭圆抛物面的特殊情况（a = b = 1）。`,
        scenario: '求旋转曲面方程。',
      },
      {
        id: 'app3',
        type: 'real',
        title: '判断双曲面类型',
        description: `判断 $\\frac{x^2}{4} + \\frac{y^2}{9} - \\frac{z^2}{16} = 1$ 是什么曲面。

**分析**：
- 系数：两正一负
- 右边：等于1
- 结论：**单叶双曲面**

"单叶"意味着曲面是连通的，像一个中间细两头粗的筒。`,
        scenario: '判断双曲面类型。',
      },
      {
        id: 'app4',
        type: 'research',
        title: '建筑工程中的曲面应用',
        description: `**广州塔（小蛮腰）**：单叶双曲面结构
- 用直的钢管就能建造出曲线外形
- 直纹面特性：可由直线族生成
- 结构稳定，材料经济

**冷却塔**：双曲面结构
- 有利于空气对流
- 表面积相对较小，散热效率高

**抛物面天线**：椭圆抛物面
- 将平行光聚焦到焦点
- 卫星通信、雷达系统常用

**马鞍面薄壳结构**：
- 双曲抛物面具有良好的力学性能
- 用材少、跨度大、造型美观`,
        scenario: '工程中的曲面应用。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '截痕法', 
        description: `**核心思想**：用坐标平面或平行坐标面的平面截曲面，通过截线形状理解曲面。

**标准截法**：
1. 用 $x=0$, $y=0$, $z=0$ 截曲面（坐标面截痕）
2. 用 $z=h$ 等平行平面截曲面（平行截痕）
3. 观察截线随参数变化的规律

**典型截痕特征**：
| 曲面 | xOy面截痕 | xOz面截痕 | yOz面截痕 |
|------|-----------|-----------|-----------|
| 椭球面 | 椭圆 | 椭圆 | 椭圆 |
| 单叶双曲面 | 椭圆 | 双曲线 | 双曲线 |
| 双叶双曲面 | 无 | 双曲线 | 双曲线 |
| 椭圆抛物面 | 点 | 抛物线 | 抛物线 |
| 马鞍面 | 两直线 | 抛物线 | 抛物线 |`
      },
      { 
        number: 2, 
        title: '化为标准形', 
        description: `通过坐标变换将一般二次方程化为标准形式。

**步骤**：
1. **配方**：消去一次项
   - 将含 $x$ 的项配成 $(x-x_0)^2$ 形式
   - 平移坐标原点

2. **判断二次型**：确定曲面类型
   - 全正 → 椭圆型
   - 有负有双曲型
   - 有零 → 抛物型

3. **写出标准形式**：确定参数 $a, b, c$

**示例**：
$x^2 + y^2 - 2z^2 + 4x - 6y + 4z = 0$

配方：$(x+2)^2 + (y-3)^2 - 2(z-1)^2 = 4$

令 $X=x+2$, $Y=y-3$, $Z=z-1$：
$\\frac{X^2}{4} + \\frac{Y^2}{4} - \\frac{Z^2}{2} = 1$

结论：单叶双曲面，中心在 $(-2, 3, 1)$`
      },
      { 
        number: 3, 
        title: '旋转曲面识别法', 
        description: `**特征识别**：
方程中某两个变量以 $x^2+y^2$ 或 $\\sqrt{x^2+y^2}$ 的形式出现。

**判定方法**：
- 若方程可写成 $F(\\sqrt{x^2+y^2}, z) = 0$，则是绕 **z 轴**旋转的旋转曲面
- 若方程可写成 $F(x, \\sqrt{y^2+z^2}) = 0$，则是绕 **x 轴**旋转的旋转曲面
- 旋转轴对应"单独出现"的变量

**反推母线**：
对于 $z = x^2 + y^2$：
- 这是绕 z 轴旋转
- 用 $y = 0$ 截得母线：$z = x^2$（抛物线）
- 结论：抛物线 $z = x^2$ 绕 z 轴旋转`,
      },
    ],
  },
}

// ============================================
// 多元函数微分法知识点
// ============================================

// 多元函数基本概念知识点（名师讲解版）
const multivariableBasicPoint: KnowledgePoint = {
  id: 'multivariable-basic',
  moduleId: 'multivariable-differential',
  name: '多元函数基本概念',
  formula: '\\lim_{(x,y) \\to (x_0,y_0)} f(x,y) = A',
  coreSentence: '多元函数的极限要求点从"四面八方"同时趋近——这是与一元函数极限的本质区别。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'epsilon', name: 'ε', min: 0.1, max: 1, step: 0.1, defaultValue: 0.5, label: 'ε' },
          { id: 'delta', name: 'δ', min: 0.1, max: 1, step: 0.1, defaultValue: 0.3, label: 'δ' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：多元函数极限是什么？

**多元函数极限 = 点从四面八方同时趋近时，函数值趋向同一个数。**

一元函数只有左右两个方向，多元函数有无数个方向！

---

## 📐 多元函数是什么？

**定义**：$z = f(x, y)$，输入是平面上的点，输出是一个数。

**几何意义**：二元函数的图像是三维空间中的一张曲面。

| 常见曲面 | 方程 | 形状 |
|----------|------|------|
| 抛物面 | $z = x^2 + y^2$ | 碗形 |
| 圆锥面 | $z = \\sqrt{x^2 + y^2}$ | 锥形 |
| 马鞍面 | $z = xy$ | 马鞍形 |
| 球面 | $x^2 + y^2 + z^2 = R^2$ | 球形 |

---

## 🔑 二重极限的核心：任意路径！

**定义**：$\\lim_{(x,y) \\to (x_0,y_0)} f(x,y) = A$

**ε-δ语言**：$\\forall \\epsilon > 0$，$\\exists \\delta > 0$，当 $0 < \\sqrt{(x-x_0)^2 + (y-y_0)^2} < \\delta$ 时，$|f(x,y) - A| < \\epsilon$

**关键**：极限存在要求点 $(x, y)$ 以 **任意方式**、**任意路径** 趋近 $(x_0, y_0)$ 时，$f(x, y)$ 都趋近于同一个值 $A$。

---

## 🔧 怎么判断极限不存在？

**方法**：找两条不同路径，极限值不同！

**常用路径**：
- 沿 $y = kx$ 趋近（不同斜率）
- 沿 $y = kx^2$ 趋近（抛物线）
- 沿 $x = 0$ 或 $y = 0$ 趋近（坐标轴）

**例子**：$f(x,y) = \\frac{xy}{x^2+y^2}$ 在 $(0,0)$ 处

沿 $y = kx$：$\\lim = \\frac{k}{1+k^2}$（与 $k$ 有关！）

**结论**：极限不存在！

---

## 🔧 怎么计算极限？

| 方法 | 适用情况 |
|------|----------|
| 直接代入 | 函数在该点连续 |
| 夹逼准则 | 放大缩小法 |
| 极坐标变换 | $(x,y) \\to (0,0)$ 时常用 |
| 换元法 | 化为一元函数 |

**极坐标变换技巧**：令 $x = r\\cos\\theta$，$y = r\\sin\\theta$，则 $(x,y) \\to (0,0)$ 等价于 $r \\to 0$

---

## 📝 连续性

**定义**：$f(x,y)$ 在 $(x_0, y_0)$ 连续 $\\Leftrightarrow$ $\\lim_{(x,y) \\to (x_0,y_0)} f(x,y) = f(x_0, y_0)$

**三个条件**：
1. $f(x_0, y_0)$ 有定义
2. 极限存在
3. 极限值等于函数值

**性质**：初等函数在其定义域内连续

---

## ⚠️ 三大误区

**误区1**：认为累次极限存在则二重极限存在
- **记住**：累次极限和二重极限是两回事！

**误区2**：只验证一条路径就断定极限存在
- **记住**：必须验证所有路径，但只需找两条不同路径就能否定！

**误区3**：极坐标变换后忘了讨论 $\\theta$
- **记住**：极限必须与 $\\theta$ 无关！

---

## 🏆 典型例题

**例1**：判断 $\\lim_{(x,y) \\to (0,0)} \\frac{xy}{x^2+y^2}$ 是否存在。

**秒解**：沿 $y = kx$，极限为 $\\frac{k}{1+k^2}$，与 $k$ 有关。

**结论**：极限不存在！

**例2**：计算 $\\lim_{(x,y) \\to (0,0)} \\frac{x^2 y}{x^2 + y^2}$。

**秒解**：夹逼准则
$$\\left| \\frac{x^2 y}{x^2 + y^2} \\right| \\leq \\frac{x^2 |y|}{x^2} = |y| \\leq \\sqrt{x^2+y^2} \\to 0$$

**结论**：极限为 $0$！`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**一句话**：多元极限比一元极限严格得多——要"四面八方"同时趋近。

**路径问题**：
- 判断极限存在：要验证所有路径（不可能做到）
- 判断极限不存在：只需找两条不同路径（可以做到）

---

## 💎 累次极限 vs 二重极限

**累次极限**：$\\lim_{x \\to x_0} \\lim_{y \\to y_0} f(x,y)$ 或 $\\lim_{y \\to y_0} \\lim_{x \\to x_0} f(x,y)$

**关系**：
- 二重极限存在 $\\not\\Rightarrow$ 累次极限存在
- 两个累次极限存在且相等 $\\not\\Rightarrow$ 二重极限存在
- 若二重极限和累次极限都存在，则它们相等`,
      extension: `## 🚀 有界闭区域上连续函数的性质

1. **有界性定理**：$f(x, y)$ 在 $D$ 上有界
2. **最值定理**：$f(x, y)$ 在 $D$ 上必有最大值和最小值
3. **介值定理**：若 $m \\leq \\mu \\leq M$，则存在 $(x, y) \\in D$，使 $f(x, y) = \\mu$`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '判断极限存在性',
        description: `**问题**：$f(x,y) = \\frac{xy}{x^2 + y^2}$ 在 $(0,0)$ 处极限是否存在？

**秒解**：沿 $y = kx$，极限为 $\\frac{k}{1+k^2}$，不同 $k$ 不同值。

**结论**：极限不存在！`,
        scenario: '判断极限存在性。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算二重极限',
        description: `**问题**：计算 $\\lim_{(x,y) \\to (0,0)} \\frac{x^2 y}{x^2 + y^2}$

**秒解**：用夹逼准则，极限为 $0$。`,
        scenario: '极限计算。',
      },
      {
        id: 'app3',
        type: 'real',
        title: '判断连续性',
        description: `**问题**：$f(x,y) = \\begin{cases} \\frac{x^2 y}{x^2 + y^2}, & (x,y) \\neq (0,0) \\\\ 0, & (x,y) = (0,0) \\end{cases}$

**秒解**：极限为 $0$，函数值为 $0$，连续！`,
        scenario: '连续性判断。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '判断极限不存在', 
        description: `**找不同路径法**：
1. 尝试沿 $y = kx$ 趋近
2. 尝试沿 $y = kx^2$ 趋近
3. 若找到两条路径极限不同，则极限不存在`
      },
      { 
        number: 2, 
        title: '计算极限', 
        description: `**常用方法**：
1. 直接代入（连续函数）
2. 夹逼准则：放大缩小法
3. 极坐标变换：$x = r\\cos\\theta$, $y = r\\sin\\theta$`
      },
      { 
        number: 3, 
        title: '讨论连续性', 
        description: `**分段函数**：
1. 非分界点：由初等函数性质判断
2. 分界点：计算极限并与函数值比较`
      },
    ],
  },
}

// 偏导数与全微分知识点（名师讲解版）
const partialDerivativePoint: KnowledgePoint = {
  id: 'partial-derivative',
  moduleId: 'multivariable-differential',
  name: '偏导数与全微分',
  formula: '\\frac{\\partial z}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x, y) - f(x,y)}{\\Delta x}, \\quad dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy',
  coreSentence: '偏导数是"固定其他变量，只让一个变"的变化率；全微分是"用切平面代替曲面"的线性近似。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'x0', name: 'x₀', min: -2, max: 2, step: 0.1, defaultValue: 1, label: 'x₀' },
          { id: 'y0', name: 'y₀', min: -2, max: 2, step: 0.1, defaultValue: 1, label: 'y₀' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：偏导数是什么？

**偏导数 = 固定其他变量，只让一个变，看变化率。**

比如 $\\frac{\\partial z}{\\partial x}$ 就是把 $y$ 当常数，只让 $x$ 变，看 $z$ 怎么变。

---

## 📐 偏导数定义

**对 $x$ 的偏导数**：
$$\\frac{\\partial z}{\\partial x} = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x, y) - f(x,y)}{\\Delta x}$$

**对 $y$ 的偏导数**：
$$\\frac{\\partial z}{\\partial y} = \\lim_{\\Delta y \\to 0} \\frac{f(x, y+\\Delta y) - f(x,y)}{\\Delta y}$$

**几何意义**：
- $\\frac{\\partial z}{\\partial x}$：用平面 $y = y_0$ 截曲面，所得曲线的切线斜率
- $\\frac{\\partial z}{\\partial y}$：用平面 $x = x_0$ 截曲面，所得曲线的切线斜率

---

## 🔧 怎么算偏导数？

**方法**：把其他变量当常数，对目标变量求导。

**例子**：$z = x^2 y + \\sin(xy)$

$\\frac{\\partial z}{\\partial x} = 2xy + y\\cos(xy)$（把 $y$ 当常数）

$\\frac{\\partial z}{\\partial y} = x^2 + x\\cos(xy)$（把 $x$ 当常数）

---

## 📝 高阶偏导数

**二阶偏导数**：
$$\\frac{\\partial^2 z}{\\partial x^2}, \\quad \\frac{\\partial^2 z}{\\partial y^2}, \\quad \\frac{\\partial^2 z}{\\partial x \\partial y}, \\quad \\frac{\\partial^2 z}{\\partial y \\partial x}$$

**混合偏导数相等的条件**：若 $\\frac{\\partial^2 z}{\\partial x \\partial y}$ 和 $\\frac{\\partial^2 z}{\\partial y \\partial x}$ 连续，则它们相等。

**考试技巧**：一般初等函数的混合偏导数都相等，随便先对谁求都行！

---

## 🎯 一句话讲透：全微分是什么？

**全微分 = 用切平面代替曲面。**

在一点附近，曲面太复杂，用切平面来近似，误差是高阶无穷小。

---

## 📐 全微分定义

**定义**：若函数增量可表示为
$$\\Delta z = A\\Delta x + B\\Delta y + o(\\rho)$$

其中 $\\rho = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$，则称函数可微，全微分为：
$$dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy$$

**几何意义**：切平面方程为 $z - z_0 = \\frac{\\partial z}{\\partial x}(x-x_0) + \\frac{\\partial z}{\\partial y}(y-y_0)$

---

## 🔑 可微、可导、连续的关系（必考！）

| 条件 | 结论 |
|------|------|
| 可微 | $\\Rightarrow$ 偏导数存在 |
| 可微 | $\\Rightarrow$ 连续 |
| 偏导数存在 | $\\not\\Rightarrow$ 可微 |
| 偏导数存在 | $\\not\\Rightarrow$ 连续 |
| 偏导数连续 | $\\Rightarrow$ 可微 |

**口诀**：偏导连续必可微，可微必连续，可微必可导。反过来都不对！

---

## ⚠️ 三大误区

**误区1**：认为偏导数存在就可微
- **记住**：偏导数存在不一定可微！反例很多！

**误区2**：认为偏导数存在就连续
- **记住**：偏导数存在不一定连续！

**误区3**：混淆 $\\frac{dz}{dt}$ 和 $\\frac{\\partial z}{\\partial t}$
- **记住**：$\\frac{dz}{dt}$ 是全导数，$\\frac{\\partial z}{\\partial t}$ 是偏导数

---

## 🏆 典型例题

**例1**：$z = e^x \\sin y$，求点 $(0, \\frac{\\pi}{2})$ 处的全微分。

**秒解**：
$\\frac{\\partial z}{\\partial x} = e^x \\sin y$，$\\frac{\\partial z}{\\partial y} = e^x \\cos y$

在 $(0, \\frac{\\pi}{2})$：$\\frac{\\partial z}{\\partial x} = 1$，$\\frac{\\partial z}{\\partial y} = 0$

$dz = dx$

**例2**：证明 $f(x,y) = \\sqrt{|xy|}$ 在 $(0,0)$ 处偏导数存在但不可微。

**秒解**：
$f_x(0,0) = \\lim_{x \\to 0} \\frac{f(x,0)-f(0,0)}{x} = 0$（存在）
$f_y(0,0) = 0$（存在）

但 $\\Delta z - dz = \\sqrt{|xy|}$，沿 $y=x$ 趋近 $(0,0)$ 时：
$\\frac{\\sqrt{|xy|}}{\\sqrt{x^2+y^2}} = \\frac{|x|}{\\sqrt{2}|x|} = \\frac{1}{\\sqrt{2}} \\neq 0$

**结论**：不可微！`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**偏导数**：把多元函数"降维"处理——固定其他变量，只让一个变。

**全微分**：函数在某点附近最佳的线性近似——用切平面近似曲面。

---

## 💎 方向导数的联系

偏导数是沿坐标轴方向的方向导数。

一般地，沿方向 $\\vec{l} = (\\cos\\alpha, \\cos\\beta)$ 的方向导数为：
$$\\frac{\\partial z}{\\partial l} = \\frac{\\partial z}{\\partial x}\\cos\\alpha + \\frac{\\partial z}{\\partial y}\\cos\\beta$$`,
      extension: `## 🚀 多元泰勒公式

$$f(x,y) \\approx f(x_0,y_0) + f_x(x-x_0) + f_y(y-y_0) + \\frac{1}{2}f_{xx}(x-x_0)^2 + f_{xy}(x-x_0)(y-y_0) + \\frac{1}{2}f_{yy}(y-y_0)^2$$

**应用**：近似计算、误差估计、极值判断。

---

## 📚 经济学应用

**边际分析**：设生产函数 $Q = f(K, L)$

- $\\frac{\\partial Q}{\\partial K}$：资本边际产出
- $\\frac{\\partial Q}{\\partial L}$：劳动边际产出

**最优决策**：边际产出之比 = 价格之比`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算偏导数',
        description: `**问题**：$z = x^2 y + \\sin(xy)$，求偏导数。

**秒解**：
$\\frac{\\partial z}{\\partial x} = 2xy + y\\cos(xy)$
$\\frac{\\partial z}{\\partial y} = x^2 + x\\cos(xy)$`,
        scenario: '基本计算。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '计算全微分',
        description: `**问题**：$z = e^x \\sin y$，求 $(0, \\frac{\\pi}{2})$ 处的全微分。

**秒解**：$dz = dx$`,
        scenario: '线性近似。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '判断可微性',
        description: `**问题**：$f(x,y) = \\sqrt{|xy|}$ 在 $(0,0)$ 是否可微？

**秒解**：偏导数存在，但不可微！`,
        scenario: '可微性判断。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '计算偏导数', 
        description: `**方法**：把其他变量当常数，对目标变量求导。

**注意**：
- 熟练掌握一元函数求导
- 注意复合函数求导链`
      },
      { 
        number: 2, 
        title: '判断可微性', 
        description: `**步骤**：
1. 计算偏导数
2. 检验偏导数是否连续（充分条件）
3. 若不连续，用定义检验 $\\lim \\frac{\\Delta z - dz}{\\rho} = 0$`
      },
      { 
        number: 3, 
        title: '利用全微分近似计算', 
        description: `**公式**：$f(x_0 + \\Delta x, y_0 + \\Delta y) \\approx f(x_0, y_0) + f_x\\Delta x + f_y\\Delta y$

**误差估计**：误差上限为 $|f_x| \\cdot |\\Delta x| + |f_y| \\cdot |\\Delta y|$`,
      },
    ],
  },
}

// 复合函数与隐函数求导知识点（名师讲解版）
const compositeImplicitPoint: KnowledgePoint = {
  id: 'composite-implicit',
  moduleId: 'multivariable-differential',
  name: '复合函数与隐函数求导',
  formula: '\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}, \\quad \\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}',
  coreSentence: '链式法则的核心：每条路径上的导数相乘，不同路径相加。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 't', name: 't', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '路径追踪参数' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：链式法则

**链式法则 = 每条路径上的导数相乘，不同路径相加。**

就像从家到学校有多条路，总时间 = 每条路的时间之和。

---

## 📐 三种常见情形

### 情形1：全导数

$z = f(x, y)$，$x = \\phi(t)$，$y = \\psi(t)$

$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt}$$

**口诀**：$z$ 到 $t$ 有两条路，每条路乘起来，再加起来。

---

### 情形2：偏导数

$z = f(u, v)$，$u = u(x, y)$，$v = v(x, y)$

$$\\frac{\\partial z}{\\partial x} = \\frac{\\partial z}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial z}{\\partial v}\\frac{\\partial v}{\\partial x}$$

**口诀**：$z$ 到 $x$ 有两条路（$z \\to u \\to x$ 和 $z \\to v \\to x$），每条路乘起来，再加起来。

---

### 情形3：混合情形

$z = f(x, y, t)$，$x = x(t)$，$y = y(t)$

$$\\frac{dz}{dt} = \\frac{\\partial z}{\\partial x}\\frac{dx}{dt} + \\frac{\\partial z}{\\partial y}\\frac{dy}{dt} + \\frac{\\partial z}{\\partial t}$$

**注意**：区分 $\\frac{dz}{dt}$（全导数）和 $\\frac{\\partial z}{\\partial t}$（偏导数）！

---

## 🔧 隐函数求导公式

**一个方程**：$F(x, y, z) = 0$ 确定隐函数 $z = z(x, y)$

$$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}, \\quad \\frac{\\partial z}{\\partial y} = -\\frac{F_y}{F_z}$$

**口诀**：偏导数 = 负的"对那个变量求偏导"除以"对因变量求偏导"

---

## 📝 怎么用链式法则？

**第一步：画变量关系图**

- 确定谁是自变量、中间变量、因变量
- 画出依赖关系图

**第二步：找路径**

- 从因变量到目标自变量有几条路？

**第三步：写公式**

- 每条路径上的偏导数相乘
- 不同路径相加

---

## ⚠️ 三大误区

**误区1**：漏掉某条路径
- **记住**：必须找出所有从因变量到自变量的路径！

**误区2**：混淆全导数和偏导数
- **记住**：$\\frac{dz}{dt}$ 是全导数，$\\frac{\\partial z}{\\partial t}$ 是偏导数

**误区3**：隐函数求导公式记错符号
- **记住**：前面有个负号！

---

## 🏆 典型例题

**例1**：$z = u^2 + v^2$，$u = x + y$，$v = x - y$，求 $\\frac{\\partial z}{\\partial x}$。

**秒解**：
$\\frac{\\partial z}{\\partial x} = \\frac{\\partial z}{\\partial u}\\frac{\\partial u}{\\partial x} + \\frac{\\partial z}{\\partial v}\\frac{\\partial v}{\\partial x} = 2u \\cdot 1 + 2v \\cdot 1 = 2(u+v) = 4x$

**验证**：$z = (x+y)^2 + (x-y)^2 = 2(x^2+y^2)$，$\\frac{\\partial z}{\\partial x} = 4x$ ✓

**例2**：$x^2 + y^2 + z^2 = 1$，求 $\\frac{\\partial z}{\\partial x}$。

**秒解**：设 $F = x^2 + y^2 + z^2 - 1$

$\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z} = -\\frac{2x}{2z} = -\\frac{x}{z}$`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**链式法则**：体现了复合函数的"层次结构"——总变化率等于各层变化率的乘积之和。

**树形图**：用树形图表示变量之间的依赖关系，帮助确定链式法则中的项。

---

## 💎 隐函数存在定理

若 $F(x_0, y_0, z_0) = 0$ 且 $F_z(x_0, y_0, z_0) \\neq 0$，则在点 $(x_0, y_0)$ 附近唯一确定函数 $z = z(x, y)$。`,
      extension: `## 🚀 雅可比矩阵

对于 $\\vec{y} = f(\\vec{x})$，雅可比矩阵为：
$$J = \\begin{pmatrix} \\frac{\\partial y_1}{\\partial x_1} & \\cdots & \\frac{\\partial y_1}{\\partial x_n} \\end{pmatrix}$$

**反函数定理**：若雅可比行列式 $\\det J \\neq 0$，则函数局部可逆。

**神经网络**：反向传播算法本质上是链式法则的递归应用。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '复合函数求导',
        description: `**问题**：$z = u^2 + v^2$，$u = x + y$，$v = x - y$，求 $\\frac{\\partial z}{\\partial x}$。

**秒解**：$\\frac{\\partial z}{\\partial x} = 4x$`,
        scenario: '链式法则应用。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '隐函数求导',
        description: `**问题**：$x^2 + y^2 + z^2 = 1$，求 $\\frac{\\partial z}{\\partial x}$。

**秒解**：$\\frac{\\partial z}{\\partial x} = -\\frac{x}{z}$`,
        scenario: '隐函数求偏导。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '坐标变换',
        description: `**问题**：$x = r\\cos\\theta$，$y = r\\sin\\theta$，求 $\\frac{\\partial r}{\\partial x}$。

**秒解**：$\\frac{\\partial r}{\\partial x} = \\cos\\theta = \\frac{x}{\\sqrt{x^2+y^2}}$`,
        scenario: '坐标变换。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '画变量关系图', 
        description: `**步骤**：
1. 确定自变量、中间变量、因变量
2. 画出依赖关系图
3. 找出所有从因变量到自变量的路径
4. 每条路径上的偏导数相乘，不同路径相加`
      },
      { 
        number: 2, 
        title: '隐函数求导步骤', 
        description: `**方法一（公式法）**：
设 $F(x, y, z) = 0$，计算 $F_x, F_z$，代入 $\\frac{\\partial z}{\\partial x} = -\\frac{F_x}{F_z}$

**方法二（方程两边求导）**：
方程两边对 $x$ 求偏导，把 $z$ 看作 $x, y$ 的函数。`
      },
      { 
        number: 3, 
        title: '利用全微分', 
        description: `**优势**：不需要区分自变量和中间变量。

**步骤**：写出全微分，根据条件确定自变量，比较系数得偏导数。`,
      },
    ],
  },
}

// 方向导数与梯度知识点（名师讲解版）
const directionalGradientPoint: KnowledgePoint = {
  id: 'directional-gradient',
  moduleId: 'multivariable-differential',
  name: '方向导数与梯度',
  formula: '\\frac{\\partial f}{\\partial l} = \\nabla f \\cdot \\vec{l^0} = |\\nabla f|\\cos\\theta, \\quad \\nabla f = (\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z})',
  coreSentence: '梯度指向函数增加最快的方向——方向导数是梯度在该方向的投影。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'angle', name: '角度', min: 0, max: 6.28, step: 0.1, defaultValue: 0, label: '方向角 θ' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '方向导数变化',
          type: 'step',
          steps: [
            { id: 's1', description: '方向与梯度同向，方向导数最大', changes: { angle: 0 } },
            { id: 's2', description: '方向与梯度垂直，方向导数为零', changes: { angle: 1.57 } },
            { id: 's3', description: '方向与梯度反向，方向导数最小', changes: { angle: 3.14 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：方向导数是什么？

**方向导数 = 沿某个方向的变化率。**

偏导数是沿坐标轴方向的变化率，方向导数是沿任意方向的变化率。

---

## 🎯 一句话讲透：梯度是什么？

**梯度 = 函数增加最快的方向。**

梯度是一个向量，指向"上坡最陡"的方向，模长等于最大变化率。

---

## 📐 方向导数定义

函数 $f(x, y)$ 在点 $(x_0, y_0)$ 沿方向 $\\vec{l}$ 的方向导数：

$$\\frac{\\partial f}{\\partial l} = \\lim_{t \\to 0^+} \\frac{f(x_0 + t\\cos\\alpha, y_0 + t\\cos\\beta) - f(x_0, y_0)}{t}$$

**计算公式**：
$$\\frac{\\partial f}{\\partial l} = \\nabla f \\cdot \\vec{l^0} = |\\nabla f|\\cos\\theta$$

其中 $\\vec{l^0}$ 是单位方向向量，$\\theta$ 是梯度与方向的夹角。

---

## 🔑 梯度的四大性质（必背！）

| 性质 | 内容 |
|------|------|
| 方向 | 梯度方向 = 函数增加最快方向 |
| 模长 | $\\|\\nabla f\\|$ = 最大方向导数 |
| 等值面 | 梯度垂直于等值面 |
| 下降 | $-\\nabla f$ = 函数下降最快方向 |

---

## 🔧 怎么算方向导数？

**第一步**：计算梯度 $\\nabla f = (f_x, f_y)$

**第二步**：将方向向量单位化 $\\vec{l^0}$

**第三步**：点乘 $\\frac{\\partial f}{\\partial l} = \\nabla f \\cdot \\vec{l^0}$

**⚠️ 注意**：方向向量必须单位化！

---

## 📊 方向导数的极值

| 方向 | 方向导数值 |
|------|------------|
| 梯度方向 | $\\|\\nabla f\\|$（最大） |
| 负梯度方向 | $-\\|\\nabla f\\|$（最小） |
| 垂直梯度方向 | $0$ |

**口诀**：同向最大，反向最小，垂直为零！

---

## 📝 等值面与梯度

**等值面**：$F(x, y, z) = c$

**法向量**：$\\vec{n} = \\nabla F = (F_x, F_y, F_z)$

**切平面**：$F_x(x-x_0) + F_y(y-y_0) + F_z(z-z_0) = 0$

**法线**：$\\frac{x-x_0}{F_x} = \\frac{y-y_0}{F_y} = \\frac{z-z_0}{F_z}$

---

## ⚠️ 三大误区

**误区1**：方向向量没单位化
- **记住**：必须用单位向量！

**误区2**：梯度方向搞反
- **记住**：梯度指向增加最快的方向，负梯度指向减少最快的方向！

**误区3**：等值面法向量搞错
- **记住**：法向量就是梯度！

---

## 🏆 典型例题

**例1**：$f(x, y) = x^2 + y^2$，求 $(1,1)$ 处沿 $\\vec{l} = (1,1)$ 的方向导数。

**秒解**：
$\\nabla f = (2x, 2y) = (2, 2)$

$\\vec{l^0} = (\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}})$

$\\frac{\\partial f}{\\partial l} = (2, 2) \\cdot (\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}) = 2\\sqrt{2}$

**例2**：$f(x, y, z) = x^2 + y^2 + z^2$，求 $(1,2,2)$ 处函数增加最快的方向和最大变化率。

**秒解**：
$\\nabla f = (2, 4, 4)$

增加最快方向：$(2, 4, 4)$ 或单位化 $\\frac{1}{3}(1, 2, 2)$

最大变化率：$\\|\\nabla f\\| = 6$`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**方向导数**：函数沿某个方向的"斜率"。

**梯度**：函数的"最陡上坡方向"。

---

## 💎 物理意义

- **温度场**：梯度指向温度升高最快的方向
- **电势场**：梯度指向电势升高最快的方向，负梯度是电场强度
- **地形**：梯度指向"最陡上坡"`,
      extension: `## 🚀 梯度下降算法

在机器学习中，参数更新规则：
$$\\vec{w}_{new} = \\vec{w}_{old} - \\eta \\nabla L(\\vec{w})$$

其中 $\\eta$ 是学习率，$L$ 是损失函数。

---

## 📚 哈密顿算子

$\\nabla = (\\frac{\\partial}{\\partial x}, \\frac{\\partial}{\\partial y}, \\frac{\\partial}{\\partial z})$

- 梯度：$\\nabla f$（标量变向量）
- 散度：$\\nabla \\cdot \\vec{F}$（向量变标量）
- 旋度：$\\nabla \\times \\vec{F}$（向量变向量）`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '计算方向导数',
        description: `**问题**：$f(x, y) = x^2 + y^2$，求 $(1,1)$ 处沿 $(1,1)$ 的方向导数。

**秒解**：$\\frac{\\partial f}{\\partial l} = 2\\sqrt{2}$`,
        scenario: '方向导数计算。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '求最大变化方向',
        description: `**问题**：$f(x, y, z) = x^2 + y^2 + z^2$，求 $(1,2,2)$ 处最大变化方向。

**秒解**：方向 $(1, 2, 2)$，最大变化率 $6$`,
        scenario: '梯度应用。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '梯度下降',
        description: `**问题**：机器学习中的梯度下降算法。

**秒解**：沿负梯度方向迭代更新参数。`,
        scenario: '优化算法。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '计算方向导数', 
        description: `**步骤**：
1. 计算梯度 $\\nabla f$
2. 将方向向量单位化 $\\vec{l^0}$
3. 点乘：$\\frac{\\partial f}{\\partial l} = \\nabla f \\cdot \\vec{l^0}$

**注意**：方向向量必须单位化！`
      },
      { 
        number: 2, 
        title: '求最值方向', 
        description: `**最大方向导数方向**：梯度方向
**最小方向导数方向**：负梯度方向
**方向导数为零的方向**：与梯度垂直的方向`
      },
      { 
        number: 3, 
        title: '切平面与法线', 
        description: `**曲面 $F(x,y,z) = 0$**：
- 法向量：$\\nabla F$
- 切平面：$F_x(x-x_0) + F_y(y-y_0) + F_z(z-z_0) = 0$`,
      },
    ],
  },
}

// 多元函数极值知识点（名师讲解版）
const multivariableExtremumPoint: KnowledgePoint = {
  id: 'multivariable-extremum',
  moduleId: 'multivariable-differential',
  name: '多元函数极值',
  formula: '\\nabla f = 0 \\text{（驻点）}, \\quad \\Delta = AC - B^2, \\quad A = f_{xx}, B = f_{xy}, C = f_{yy}',
  coreSentence: '极值点必是驻点，驻点不一定是极值点——用二阶偏导判别。',
  
  dimensions: {
    model: {
      type: '3d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'surface_type', name: 'surface_type', min: 0, max: 2, step: 1, defaultValue: 0, label: '曲面类型' },
        ],
      },
      animations: [],
    },
    
    explanation: {
      mainText: `## 🎯 一句话讲透：多元函数极值

**极值点 = 局部最高或最低的点。**

和一元函数一样，先找驻点，再用二阶导判别。

---

## 📐 极值定义

**极大值**：在点 $(x_0, y_0)$ 附近，$f(x, y) \\leq f(x_0, y_0)$

**极小值**：在点 $(x_0, y_0)$ 附近，$f(x, y) \\geq f(x_0, y_0)$

---

## 🔑 极值的必要条件

**定理**：若 $f(x, y)$ 在 $(x_0, y_0)$ 处可微且有极值，则：

$$\\nabla f(x_0, y_0) = 0$$

**驻点**：满足 $\\nabla f = 0$ 的点。

**关键**：极值点必是驻点，但驻点不一定是极值点！

---

## 🔧 极值的充分条件（判别法）

设 $(x_0, y_0)$ 是驻点，记：
- $A = f_{xx}$
- $B = f_{xy}$
- $C = f_{yy}$
- $\\Delta = AC - B^2$

| 条件 | 结论 |
|------|------|
| $\\Delta > 0$ 且 $A < 0$ | 极大值 |
| $\\Delta > 0$ 且 $A > 0$ | 极小值 |
| $\\Delta < 0$ | 鞍点（非极值） |
| $\\Delta = 0$ | 不能判定 |

**口诀**：$\\Delta$ 定性，$A$ 定正负！

---

## 🎯 条件极值：拉格朗日乘数法

**问题**：求 $f(x, y)$ 在约束 $\\varphi(x, y) = 0$ 下的极值。

**方法**：构造拉格朗日函数
$$L(x, y, \\lambda) = f(x, y) + \\lambda \\varphi(x, y)$$

**求解**：
$$\\begin{cases} L_x = 0 \\\\ L_y = 0 \\\\ L_\\lambda = 0 \\end{cases}$$

**几何意义**：极值点处，梯度与约束曲线相切。

---

## ⚠️ 三大误区

**误区1**：驻点就是极值点
- **记住**：驻点可能是极值点，也可能是鞍点！

**误区2**：$\\Delta = 0$ 时没有极值
- **记住**：$\\Delta = 0$ 时不能判定，需要用其他方法！

**误区3**：拉格朗日乘数法求出的点一定是极值
- **记住**：只给出候选点，需要验证！

---

## 🏆 典型例题

**例1**：求 $f(x, y) = x^3 + y^3 - 3xy$ 的极值。

**秒解**：
驻点：$(0, 0)$ 和 $(1, 1)$

$A = 6x$，$B = -3$，$C = 6y$，$\\Delta = 36xy - 9$

- $(0, 0)$：$\\Delta = -9 < 0$，鞍点
- $(1, 1)$：$\\Delta = 27 > 0$，$A = 6 > 0$，极小值

**例2**：求 $f(x, y) = xy$ 在 $x + y = 1$ 下的极值。

**秒解**：
$L = xy + \\lambda(x + y - 1)$

解得 $x = y = \\frac{1}{2}$，$f_{max} = \\frac{1}{4}$`,
      highlights: [],
    },
    
    extension: {
      essence: `## 🔮 本质

**极值点**：函数在该点附近"最高"或"最低"。

**鞍点**：从某些方向看是极大，从另一些方向看是极小，像马鞍的中心。

---

## 💎 拉格朗日乘数的意义

$\\lambda$ 表示约束条件的"影子价格"——约束边界移动一单位时，目标函数的变化量。`,
      extension: `## 🚀 黑塞矩阵

$$H = \\begin{pmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{pmatrix}$$

- $H$ 正定 $\\Rightarrow$ 极小值
- $H$ 负定 $\\Rightarrow$ 极大值
- $H$ 不定 $\\Rightarrow$ 鞍点

**注意**：$\\Delta = \\det H$！

---

## 📚 全局优化

**凸函数**：局部极小值即为全局极小值。

**凸函数的判定**：$H$ 半正定。`,
    },
    
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '无条件极值',
        description: `**问题**：求 $f(x, y) = x^3 + y^3 - 3xy$ 的极值。

**秒解**：
- $(0, 0)$：鞍点
- $(1, 1)$：极小值`,
        scenario: '无条件极值问题。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '条件极值',
        description: `**问题**：求 $f(x, y) = xy$ 在 $x + y = 1$ 下的极值。

**秒解**：$x = y = \\frac{1}{2}$，$f_{max} = \\frac{1}{4}$`,
        scenario: '拉格朗日乘数法。',
      },
      {
        id: 'app3',
        type: 'research',
        title: '最优化问题',
        description: `**问题**：生产计划优化。

**秒解**：边际产出之比 = 价格之比`,
        scenario: '经济学优化。',
      },
    ],
    
    method: [
      { 
        number: 1, 
        title: '无条件极值步骤', 
        description: `**步骤**：
1. 求 $f_x = 0$, $f_y = 0$ 的解（驻点）
2. 计算二阶偏导 $A, B, C$
3. 计算 $\\Delta = AC - B^2$
4. 根据 $\\Delta$ 和 $A$ 的符号判别`
      },
      { 
        number: 2, 
        title: '条件极值步骤', 
        description: `**拉格朗日乘数法**：
1. 写出拉格朗日函数 $L = f + \\lambda \\varphi$
2. 求解方程组 $\\nabla L = 0$
3. 验证是否为极值`
      },
      { 
        number: 3, 
        title: '最值问题', 
        description: `**步骤**：
1. 求区域内部的极值（驻点）
2. 求区域边界上的最值
3. 比较所有候选点的函数值

**注意**：闭区域上的连续函数必有最大值和最小值。`,
      },
    ],
  },
}

// ============================================
// 行列式知识点
// ============================================

// 行列式定义与性质知识点
const determinantDefinitionPoint: KnowledgePoint = {
  id: 'determinant-definition',
  moduleId: 'determinant',
  name: '行列式的定义与性质',
  formula: '|A| = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^{n} a_{i,\\sigma(i)}',
  coreSentence: '行列式是将方阵映射到标量的函数，反映了矩阵的"体积缩放因子"和可逆性。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [
          { id: 'O', x: 0, y: 0, label: 'O' },
          { id: 'a1', x: 2, y: 1, label: 'a₁' },
          { id: 'a2', x: 1, y: 2, label: 'a₂' },
          { id: 'a1+a2', x: 3, y: 3, label: 'a₁+a₂' },
        ],
        sliders: [
          { id: 'a11', name: 'a₁₁', min: -3, max: 3, step: 0.5, defaultValue: 2, label: 'a₁₁' },
          { id: 'a21', name: 'a₂₁', min: -3, max: 3, step: 0.5, defaultValue: 1, label: 'a₂₁' },
          { id: 'a12', name: 'a₁₂', min: -3, max: 3, step: 0.5, defaultValue: 1, label: 'a₁₂' },
          { id: 'a22', name: 'a₂₂', min: -3, max: 3, step: 0.5, defaultValue: 2, label: 'a₂₂' },
        ],
      },
      animations: [
        {
          id: 'area-change',
          name: '行列式几何意义：面积变化',
          type: 'auto',
          duration: 8000,
          steps: [
            { id: 's1', description: '初始矩阵：|A|=3，平行四边形面积为3', changes: { a11: 2, a12: 1, a21: 1, a22: 2 } },
            { id: 's2', description: '压缩变换：|A|=1.5，面积缩小', changes: { a11: 1.5, a12: 1, a21: 1, a22: 2 } },
            { id: 's3', description: '继续压缩：|A|=0.5，面积更小', changes: { a11: 1, a12: 1, a21: 0.5, a22: 2 } },
            { id: 's4', description: '临界状态：|A|=0，两向量共线，面积为0！', changes: { a11: 1, a12: 1, a21: 1, a22: 1 } },
            { id: 's5', description: '反向拉伸：|A|=-1，面积为1但方向相反', changes: { a11: -1, a12: 1, a21: 1, a22: 0 } },
            { id: 's6', description: '放大变换：|A|=4，面积放大', changes: { a11: 2, a12: 0, a21: 0, a22: 2 } },
          ],
        },
        {
          id: 'row-swap',
          name: '换行变号演示',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: '原矩阵：两列向量形成的平行四边形', changes: { a11: 2, a12: 1, a21: 1, a22: 2 } },
            { id: 's2', description: '交换两行：向量位置互换，平行四边形翻转', changes: { a11: 1, a12: 2, a21: 2, a22: 1 } },
            { id: 's3', description: '行列式变号：|A|从3变为-3', changes: { a11: 1, a12: 2, a21: 2, a22: 1 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 引子：二元一次方程组**

考虑二元一次方程组：
$$\\begin{cases} a_{11}x_1 + a_{12}x_2 = b_1 \\\\ a_{21}x_1 + a_{22}x_2 = b_2 \\end{cases}$$

用消元法求解，会发现解的分母都是 $a_{11}a_{22} - a_{12}a_{21}$。

这个"神奇"的表达式就是**二阶行列式**！

---

**📐 行列式的定义**

**二阶行列式**：
$$\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$$

主对角线乘积减去副对角线乘积。

**三阶行列式（沙路法则）**：
$$\\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$$

= $a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32}$
- $a_{13}a_{22}a_{31} - a_{12}a_{21}a_{33} - a_{11}a_{23}a_{32}$

**n阶行列式**（排列定义）：
$$|A| = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^{n} a_{i,\\sigma(i)}$$

其中 $S_n$ 是所有n元排列的集合，$\\text{sgn}(\\sigma)$ 是排列的符号。

---

**🔑 行列式的核心性质**

| 性质 | 内容 | 记忆技巧 |
|------|------|----------|
| 转置不变 | $|A^T| = |A|$ | 行列"地位平等" |
| 换行变号 | 交换两行，行列式变号 | 奇排列变偶排列 |
| 倍乘 | 一行乘k，行列式乘k | 提公因子 |
| 倍加不变 | 行倍加到另一行，值不变 | **化简利器** |
| 两行相同为零 | 两行相同或成比例 | 推论性质 |

---

**💡 直观理解**

行列式的几何意义：
- 二阶：$|A|$ = 两列向量张成的**平行四边形面积**
- 三阶：$|A|$ = 三列向量张成的**平行六面体体积**
- n阶：n维超平行体的"有向体积"

$|A| = 0$ 意味着什么？
- 几何上：向量"退化"了，张成的体积为0
- 代数上：矩阵**不可逆**，方程组有非唯一解`,
      highlights: ['行列式是判断矩阵可逆性的关键工具', '倍加不变是化简行列式的核心技巧'],
    },
    
    extension: {
      essence: `**行列式的本质**

行列式是线性代数的"定海神针"——它连接了矩阵的代数性质和几何意义。

**为什么叫"行列式"？**
因为它决定了线性方程组是否有唯一解！$|A| \\neq 0$ 时方程组有唯一解。

**排列定义的直观理解**：
- n个元素的全排列有 $n!$ 种
- 每种排列对应行列式展开中的一项
- 奇排列取负号，偶排列取正号
- 这就是为什么交换两行会变号！

**逆序数**：排列中前面的数比后面的数大的对数。
- 排列 231 的逆序数：2>1, 3>1，共2个，偶排列
- 排列 321 的逆序数：3>2, 3>1, 2>1，共3个，奇排列`,
      further: [
        {
          id: 'ext1',
          title: '行列式的线性性质',
          content: '行列式对单行（列）是线性的：某行可拆成两行之和时，行列式也拆成两个之和。',
        },
        {
          id: 'ext2',
          title: '乘积定理',
          content: '$|AB| = |A||B|$，矩阵乘积的行列式等于各自行列式的乘积。',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '计算三阶行列式',
          description: `计算 $\\begin{vmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{vmatrix}$

**观察**：第2行 = 第1行 + 第3行 - 第1行的2倍 + 第1行...

实际上更简单：第3行 - 第2行 = (7,8,9)-(4,5,6) = (3,3,3)
第2行 - 第1行 = (4,5,6)-(1,2,3) = (3,3,3)

两行成比例！行列式 = **0**`,
          scenario: '利用性质化简。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '计算机图形学：判断点的位置',
          description: `**问题**：判断点P在三角形ABC的哪一侧？

**方法**：计算行列式
$$D = \\begin{vmatrix} x_A & y_A & 1 \\\\ x_B & y_B & 1 \\\\ x_P & y_P & 1 \\end{vmatrix}$$

- $D > 0$：P在AB的左侧
- $D < 0$：P在AB的右侧  
- $D = 0$：P在AB连线上

**应用**：多边形填充、碰撞检测、光线追踪`,
          scenario: '游戏开发和计算机图形学。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '结构力学：判断稳定性',
          description: `**问题**：桁架结构是否稳定？

**方法**：建立平衡方程组，计算系数矩阵的行列式

- $|K| \\neq 0$：结构稳定，可求解
- $|K| = 0$：结构不稳定（机构），需要加固

**工程意义**：行列式为零意味着结构存在"自由度"，可能发生刚体位移。`,
          scenario: '土木工程和机械设计。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '电路分析：网孔电流法',
          description: `**问题**：分析复杂电路的电流分布

**方法**：建立网孔方程组
$$\\begin{pmatrix} R_{11} & R_{12} & R_{13} \\\\ R_{21} & R_{22} & R_{23} \\\\ R_{31} & R_{32} & R_{33} \\end{pmatrix} \\begin{pmatrix} I_1 \\\\ I_2 \\\\ I_3 \\end{pmatrix} = \\begin{pmatrix} V_1 \\\\ V_2 \\\\ V_3 \\end{pmatrix}$$

用克拉默法则或求行列式判断解的存在性。

**应用**：集成电路设计、电力系统分析。`,
          scenario: '电子工程。',
        },
        {
          id: 'app5',
          type: 'research',
          title: '经济学：一般均衡分析',
          description: `**问题**：多个市场同时达到均衡的条件？

**方法**：建立超额需求方程组，雅可比行列式判断均衡的稳定性

$$J = \\begin{vmatrix} \\frac{\\partial E_1}{\\partial p_1} & \\frac{\\partial E_1}{\\partial p_2} \\\\ \\frac{\\partial E_2}{\\partial p_1} & \\frac{\\partial E_2}{\\partial p_2} \\end{vmatrix}$$

- $|J| > 0$：均衡稳定
- $|J| < 0$：均衡不稳定

**意义**：行列式的符号决定了市场的动态行为。`,
          scenario: '宏观经济学建模。',
        },
        {
          id: 'app6',
          type: 'real',
          title: '机器学习：特征值问题',
          description: `**问题**：PCA降维时如何选择主成分？

**方法**：计算协方差矩阵的特征值
$$|\\Sigma - \\lambda I| = 0$$

行列式展开得到特征多项式，特征值的大小决定主成分的重要性。

**应用**：人脸识别、数据压缩、噪声过滤。`,
          scenario: '数据科学和人工智能。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '计算行列式的策略', 
        description: `**步骤**：
1. 观察是否有特殊结构（对角、三角、范德蒙德）
2. 尝试用倍加变换化成三角行列式
3. 对高阶行列式，按含零多的行展开
4. 利用性质简化计算

**常见错误**：
- 忘记换行变号
- 提公因子时漏提
- 展开时代数余子式符号搞错`
      },
    ],
  },
}

// 行列式展开与计算知识点
const determinantExpansionPoint: KnowledgePoint = {
  id: 'determinant-expansion',
  moduleId: 'determinant',
  name: '行列式展开与计算',
  formula: 'D = \\sum_{j=1}^{n} a_{ij} A_{ij} = a_{i1}A_{i1} + a_{i2}A_{i2} + \\cdots + a_{in}A_{in}',
  coreSentence: '行列式展开是将高阶行列式降为低阶行列式的核心方法，结合性质可高效计算。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'a11', name: 'a₁₁', min: -5, max: 5, step: 1, defaultValue: 1, label: 'a₁₁' },
          { id: 'a12', name: 'a₁₂', min: -5, max: 5, step: 1, defaultValue: 2, label: 'a₁₂' },
          { id: 'a13', name: 'a₁₃', min: -5, max: 5, step: 1, defaultValue: 3, label: 'a₁₃' },
          { id: 'a21', name: 'a₂₁', min: -5, max: 5, step: 1, defaultValue: 4, label: 'a₂₁' },
          { id: 'a22', name: 'a₂₂', min: -5, max: 5, step: 1, defaultValue: 5, label: 'a₂₂' },
          { id: 'a23', name: 'a₂₃', min: -5, max: 5, step: 1, defaultValue: 6, label: 'a₂₃' },
          { id: 'a31', name: 'a₃₁', min: -5, max: 5, step: 1, defaultValue: 7, label: 'a₃₁' },
          { id: 'a32', name: 'a₃₂', min: -5, max: 5, step: 1, defaultValue: 8, label: 'a₃₂' },
          { id: 'a33', name: 'a₃₃', min: -5, max: 5, step: 1, defaultValue: 9, label: 'a₃₃' },
        ],
      },
      animations: [
        {
          id: 'expansion-process',
          name: '三阶行列式展开过程',
          type: 'auto',
          duration: 10000,
          steps: [
            { id: 's1', description: '三阶行列式：按第1行展开，观察代数余子式符号', changes: {} },
            { id: 's2', description: 'a₁₁×(-1)^(1+1)×M₁₁：符号为正，去掉第1行第1列', changes: {} },
            { id: 's3', description: 'a₁₂×(-1)^(1+2)×M₁₂：符号为负，去掉第1行第2列', changes: {} },
            { id: 's4', description: 'a₁₃×(-1)^(1+3)×M₁₃：符号为正，去掉第1行第3列', changes: {} },
            { id: 's5', description: '按第2行展开：观察符号变化规律', changes: {} },
            { id: 's6', description: '按第3行展开：棋盘格符号规律 (+ - + / - + - / + - +)', changes: {} },
          ],
        },
        {
          id: 'zero-advantage',
          name: '零元素的威力',
          type: 'auto',
          duration: 6000,
          steps: [
            { id: 's1', description: '普通三阶行列式：展开需计算3个二阶子式', changes: { rowIndex: 1 } },
            { id: 's2', description: '若第1行有2个零元素：只需计算1个子式！', changes: { rowIndex: 1 } },
            { id: 's3', description: '技巧：用倍加变换制造零元素，再展开', changes: { rowIndex: 1 } },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 核心问题**

四阶以上的行列式怎么算？沙路法则只适用于二阶、三阶！

答案：**展开定理**——把高阶行列式"展开"成低阶行列式的组合。

---

**📐 余子式与代数余子式**

**余子式** $M_{ij}$：
去掉第 $i$ 行第 $j$ 列后剩下的 $n-1$ 阶行列式。

**代数余子式** $A_{ij}$：
$$A_{ij} = (-1)^{i+j} M_{ij}$$

符号由位置决定：棋盘格规律，$(1,1)$ 为正。

---

**🔑 展开定理**

**按第 $i$ 行展开**：
$$|A| = a_{i1}A_{i1} + a_{i2}A_{i2} + \\cdots + a_{in}A_{in}$$

**按第 $j$ 列展开**：
$$|A| = a_{1j}A_{1j} + a_{2j}A_{2j} + \\cdots + a_{nj}A_{nj}$$

**展开策略**：选择零元素最多的行或列展开！

---

**💡 展开的本质理解**

展开定理说的是：行列式的值等于某一行（列）各元素"贡献"的总和。

每个元素的"贡献" = 元素值 × 它在全局中的"权重"
- 权重 = 代数余子式 = $(-1)^{i+j} ×$ 去掉该行该列后的行列式

**为什么可以这样？**
因为行列式的每一项恰好包含每行每列各一个元素，固定第 $i$ 行取第 $j$ 列元素后，剩下的元素必须从其他行其他列取。

---

**📝 零元素的妙用**

如果某行有多个零元素：
- 按该行展开时，零元素的项直接消失！
- 只需计算非零元素的代数余子式

**技巧**：先用倍加变换制造零元素，再展开！`,
      highlights: ['选择零元素最多的行/列展开', '展开前先用倍加变换制造零元素'],
    },
    
    extension: {
      essence: `**展开定理的深层意义**

展开定理体现了行列式的**递归结构**：
- n阶行列式可以表示为n个n-1阶行列式的线性组合
- 递归下去，最终变成二阶行列式的计算

**为什么代数余子式有符号？**

考虑三阶行列式：
$$\\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix}$$

按第一行展开：
- $a_{11}$ 的位置是 (1,1)，逆序数基础，正号
- $a_{12}$ 的位置是 (1,2)，固定后剩下元素的排列有奇数次"跨行"
- 符号 $(-1)^{i+j}$ 正好补偿这个"跨行"带来的符号变化`,
      further: [
        {
          id: 'ext1',
          title: '异乘为零定理',
          content: '某行元素与另一行对应代数余子式乘积之和为零：$\\sum_{j=1}^{n} a_{ij}A_{kj} = 0$（当 $i \\neq k$）',
        },
        {
          id: 'ext2',
          title: '伴随矩阵',
          content: '伴随矩阵 $A^*$ 是代数余子式的转置矩阵：$(A^*)_{ij} = A_{ji}$',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '四阶行列式计算',
          description: `计算 $D = \\begin{vmatrix} 1 & 2 & 0 & 1 \\\\ 2 & 3 & 0 & 2 \\\\ 3 & 1 & 2 & 0 \\\\ 4 & 5 & 0 & 3 \\end{vmatrix}$

**观察**：第3列只有一个非零元素！

按第3列展开：$D = 2 \\times (-1)^{3+3} \\times M_{33}$

$M_{33} = \\begin{vmatrix} 1 & 2 & 1 \\\\ 2 & 3 & 2 \\\\ 4 & 5 & 3 \\end{vmatrix}$

第1行减第2行：$\\begin{vmatrix} -1 & -1 & -1 \\\\ 2 & 3 & 2 \\\\ 4 & 5 & 3 \\end{vmatrix}$

提出-1：$(-1) \\times \\begin{vmatrix} 1 & 1 & 1 \\\\ 2 & 3 & 2 \\\\ 4 & 5 & 3 \\end{vmatrix}$

第2列减第1列，第3列减第1列：$(-1) \\times \\begin{vmatrix} 1 & 0 & 0 \\\\ 2 & 1 & 0 \\\\ 4 & 1 & -1 \\end{vmatrix}$

按第1行展开：$(-1) \\times 1 \\times \\begin{vmatrix} 1 & 0 \\\\ 1 & -1 \\end{vmatrix} = (-1) \\times (-1) = 1$

所以 $D = 2 \\times 1 \\times 1 = 2$`,
          scenario: '利用零元素多的列展开。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '范德蒙德行列式与多项式插值',
          description: `**范德蒙德行列式**：
$$V_n = \\begin{vmatrix} 1 & 1 & \\cdots & 1 \\\\ x_1 & x_2 & \\cdots & x_n \\\\ x_1^2 & x_2^2 & \\cdots & x_n^2 \\\\ \\vdots & \\vdots & & \\vdots \\\\ x_1^{n-1} & x_2^{n-1} & \\cdots & x_n^{n-1} \\end{vmatrix}$$

**结论**：$V_n = \\prod_{1 \\leq i < j \\leq n}(x_j - x_i)$

**应用**：拉格朗日插值存在唯一性
- 给定n个点$(x_i, y_i)$，存在唯一的n-1次多项式通过这些点
- 唯一性由范德蒙德行列式非零保证`,
          scenario: '数值计算和信号处理。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '控制工程：特征多项式',
          description: `**问题**：分析线性系统的稳定性

**方法**：计算系统矩阵的特征多项式
$$|sI - A| = s^n + a_{n-1}s^{n-1} + \\cdots + a_1s + a_0$$

这是行列式展开的直接应用！

**劳斯判据**：根据特征多项式系数判断系统稳定性，无需解特征方程。

**应用**：自动驾驶稳定性分析、机器人控制、电力系统调节。`,
          scenario: '自动化控制。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '量子力学：电子轨道',
          description: `**问题**：多电子体系的波函数

**方法**：斯莱特行列式
$$\\Psi(1,2,\\cdots,n) = \\frac{1}{\\sqrt{n!}} \\begin{vmatrix} \\phi_1(1) & \\phi_2(1) & \\cdots & \\phi_n(1) \\\\ \\phi_1(2) & \\phi_2(2) & \\cdots & \\phi_n(2) \\\\ \\vdots & \\vdots & & \\vdots \\\\ \\phi_1(n) & \\phi_2(n) & \\cdots & \\phi_n(n) \\end{vmatrix}$$

**物理意义**：行列式的反对称性保证泡利不相容原理——交换两个电子，波函数变号。

**应用**：原子结构计算、分子轨道理论、量子化学。`,
          scenario: '量子物理和化学。',
        },
        {
          id: 'app5',
          type: 'real',
          title: '流体力学：涡度计算',
          description: `**问题**：计算流场的涡度（旋转程度）

**方法**：速度场的旋度涉及行列式
$$\\vec{\\omega} = \\nabla \\times \\vec{v} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ v_x & v_y & v_z \\end{vmatrix}$$

**应用**：气象预报（气旋分析）、航空航天（机翼涡流）、海洋学。`,
          scenario: '流体动力学。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '行列式计算流程', 
        description: `**策略选择**：
1. **特殊形式** → 直接套公式（对角、三角、范德蒙德）
2. **一般形式** → 倍加化三角 或 按零多的行展开
3. **含参数** → 保留参数，用展开定理

**化三角法步骤**：
1. 用倍加变换把主对角线下方元素全变成0
2. 行列式 = 主对角线元素乘积
3. 注意记录换行次数（每次变号）`
      },
    ],
  },
}

// 克拉默法则知识点
const cramerRulePoint: KnowledgePoint = {
  id: 'cramer-rule',
  moduleId: 'determinant',
  name: '克拉默法则',
  formula: 'x_i = \\frac{D_i}{D} \\quad (D \\neq 0)',
  coreSentence: '克拉默法则用行列式给出线性方程组的显式解，是行列式应用的核心。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'a11', name: 'a₁₁', min: -5, max: 5, step: 1, defaultValue: 2, label: 'a₁₁' },
          { id: 'a12', name: 'a₁₂', min: -5, max: 5, step: 1, defaultValue: 3, label: 'a₁₂' },
          { id: 'a21', name: 'a₂₁', min: -5, max: 5, step: 1, defaultValue: 1, label: 'a₂₁' },
          { id: 'a22', name: 'a₂₂', min: -5, max: 5, step: 1, defaultValue: 2, label: 'a₂₂' },
          { id: 'b1', name: 'b₁', min: -10, max: 10, step: 1, defaultValue: 8, label: 'b₁' },
          { id: 'b2', name: 'b₂', min: -10, max: 10, step: 1, defaultValue: 5, label: 'b₂' },
        ],
      },
      animations: [
        {
          id: 'cramer-solve',
          name: '克拉默法则求解过程',
          type: 'auto',
          duration: 10000,
          steps: [
            { id: 's1', description: '方程组：2x+3y=8, x+2y=5，写出系数行列式D', changes: { a11: 2, a12: 3, a21: 1, a22: 2, b1: 8, b2: 5 } },
            { id: 's2', description: 'D = |2 3; 1 2| = 4-3 = 1 ≠ 0，有唯一解', changes: { a11: 2, a12: 3, a21: 1, a22: 2 } },
            { id: 's3', description: 'D₁ = 用b替换第1列 = |8 3; 5 2| = 16-15 = 1', changes: { a11: 2, a12: 3, a21: 1, a22: 2, b1: 8, b2: 5 } },
            { id: 's4', description: 'D₂ = 用b替换第2列 = |2 8; 1 5| = 10-8 = 2', changes: { a11: 2, a12: 3, a21: 1, a22: 2, b1: 8, b2: 5 } },
            { id: 's5', description: 'x = D₁/D = 1/1 = 1', changes: {} },
            { id: 's6', description: 'y = D₂/D = 2/1 = 2，解为(1,2)', changes: {} },
          ],
        },
        {
          id: 'no-solution',
          name: '无解情况演示',
          type: 'auto',
          duration: 6000,
          steps: [
            { id: 's1', description: '若系数行列式D=0会怎样？', changes: { a11: 1, a12: 2, a21: 2, a22: 4, b1: 3, b2: 6 } },
            { id: 's2', description: 'D = |1 2; 2 4| = 4-4 = 0，不能用克拉默法则！', changes: { a11: 1, a12: 2, a21: 2, a22: 4 } },
            { id: 's3', description: '此时需用秩判断：r(A)和r(A|b)的关系', changes: {} },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 问题引入**

对于线性方程组：
$$\\begin{cases} a_{11}x_1 + a_{12}x_2 = b_1 \\\\ a_{21}x_1 + a_{22}x_2 = b_2 \\end{cases}$$

消元法告诉我们解是：
$$x_1 = \\frac{b_1 a_{22} - b_2 a_{12}}{a_{11}a_{22} - a_{12}a_{21}}, \\quad x_2 = \\frac{a_{11}b_2 - a_{21}b_1}{a_{11}a_{22} - a_{12}a_{21}}$$

这些分母和分子，不都是行列式吗！

---

**📐 克拉默法则**

对于 $n$ 元线性方程组 $Ax = b$，若系数行列式 $D = |A| \\neq 0$，则：

$$x_i = \\frac{D_i}{D}$$

其中 $D_i$ 是将 $D$ 的第 $i$ 列换成常数项 $b$ 得到的行列式。

---

**💡 直观理解**

**$D$**：系数行列式，衡量方程组"解的唯一性"
- $D \\neq 0$：唯一解
- $D = 0$：无解或无穷多解

**$D_i$**：把常数项"放进"第 $i$ 列
- 分子分母"格式统一"
- 解就是"替换后的行列式"与"原行列式"的比值

---

**📝 二元方程组的例子**

$$\\begin{cases} 2x + 3y = 8 \\\\ x + 2y = 5 \\end{cases}$$

$D = \\begin{vmatrix} 2 & 3 \\\\ 1 & 2 \\end{vmatrix} = 1$

$D_x = \\begin{vmatrix} 8 & 3 \\\\ 5 & 2 \\end{vmatrix} = 1$

$D_y = \\begin{vmatrix} 2 & 8 \\\\ 1 & 5 \\end{vmatrix} = 2$

所以 $x = \\frac{D_x}{D} = 1$，$y = \\frac{D_y}{D} = 2$

---

**⚠️ 克拉默法则的局限**

| 优点 | 缺点 |
|------|------|
| 解的形式简洁美观 | 计算量大（n阶需要算n+1个行列式）|
| 理论意义重要 | 只适用于方阵、D≠0的情况 |
| 便于公式推导 | 实际计算不如高斯消元法高效 |`,
      highlights: ['克拉默法则主要用于理论推导，实际计算用高斯消元法'],
    },
    
    extension: {
      essence: `**克拉默法则的深层意义**

克拉默法则揭示了线性代数的核心结构：
- **代数上**：矩阵的逆可以用行列式表示
- **几何上**：解是"有向体积比"

**与矩阵逆的关系**：

$x = A^{-1}b$

而 $A^{-1} = \\frac{1}{|A|}A^*$（伴随矩阵除以行列式）

所以 $x_i = \\frac{1}{|A|}\\sum_{j=1}^{n} A_{ji}b_j$

这正是克拉默法则！$D_i$ 就是把第 $i$ 列换成 $b$ 后按第 $i$ 列展开的结果。`,
      further: [
        {
          id: 'ext1',
          title: '齐次方程组',
          content: '若 $b = 0$（齐次方程组），则 $D \\neq 0$ 时只有零解；$D = 0$ 时有非零解。',
        },
        {
          id: 'ext2',
          title: '判断解的存在性',
          content: '$D \\neq 0$ $\\Leftrightarrow$ 有唯一解 $\\Leftrightarrow$ $A$ 可逆 $\\Leftrightarrow$ $r(A) = n$',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '解三元方程组',
          description: `解方程组：
$$\\begin{cases} x + y + z = 6 \\\\ 2x + 3y - z = 5 \\\\ x - y + 2z = 5 \\end{cases}$$

$D = \\begin{vmatrix} 1 & 1 & 1 \\\\ 2 & 3 & -1 \\\\ 1 & -1 & 2 \\end{vmatrix} = 6 + 1 - 2 - 3 + 1 - 4 = -1 \\neq 0$

$D_x = \\begin{vmatrix} 6 & 1 & 1 \\\\ 5 & 3 & -1 \\\\ 5 & -1 & 2 \\end{vmatrix} = -5$

$D_y = \\begin{vmatrix} 1 & 6 & 1 \\\\ 2 & 5 & -1 \\\\ 1 & 5 & 2 \\end{vmatrix} = -4$

$D_z = \\begin{vmatrix} 1 & 1 & 6 \\\\ 2 & 3 & 5 \\\\ 1 & -1 & 5 \\end{vmatrix} = -3$

解：$x = 5$，$y = 4$，$z = -3$... 需要验证计算`,
          scenario: '克拉默法则求解。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '经济投入产出模型',
          description: `**问题**：分析国民经济各部门之间的投入产出关系

**模型**：里昂惕夫投入产出模型
$$(I - A)x = d$$

其中：
- $A$ 是技术系数矩阵（各行业间的投入比例）
- $d$ 是最终需求向量（消费、投资、出口）
- $x$ 是总产出向量

**求解**：$x = (I - A)^{-1}d$

**应用**：产业政策制定、经济预测、区域发展规划。`,
          scenario: '宏观经济分析。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '有限元分析：节点位移',
          description: `**问题**：计算结构在载荷作用下的位移

**方法**：建立刚度方程
$$[K]\\{u\\} = \\{F\\}$$

- $[K]$：整体刚度矩阵（材料特性决定）
- $\\{u\\}$：节点位移向量（待求）
- $\\{F\\}$：节点力向量（已知载荷）

**数值求解**：对大型稀疏矩阵，用迭代法代替直接求逆。

**应用**：桥梁设计、汽车碰撞模拟、建筑抗震分析。`,
          scenario: '工程力学仿真。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '电力系统潮流计算',
          description: `**问题**：计算电网中各节点的电压和功率分布

**模型**：节点功率平衡方程组
$$P_i = V_i \\sum_{j=1}^{n} V_j(G_{ij}\\cos\\theta_{ij} + B_{ij}\\sin\\theta_{ij})$$

线性化后得到修正方程：
$$\\begin{pmatrix} H & N \\\\ M & L \\end{pmatrix} \\begin{pmatrix} \\Delta\\theta \\\\ \\Delta V \\end{pmatrix} = \\begin{pmatrix} \\Delta P \\\\ \\Delta Q \\end{pmatrix}$$

**应用**：电网规划、故障分析、电力市场竞价。`,
          scenario: '电力系统运行。',
        },
        {
          id: 'app5',
          type: 'real',
          title: '化学反应平衡',
          description: `**问题**：确定化学反应平衡时各组分的浓度

**方法**：建立质量守恒和平衡方程组

例如，多元酸解离平衡：
$$\\begin{cases} [H^+][A^-] = K_a[HA] \\\\ [H^+][OH^-] = K_w \\\\ [HA] + [A^-] = C \\end{cases}$$

线性化后求解，得到各组分浓度。

**应用**：水质分析、制药配方优化、工业反应器设计。`,
          scenario: '化学工程。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '使用克拉默法则的步骤', 
        description: `**步骤**：
1. 写出系数行列式 $D$，检验是否为0
2. 若 $D = 0$：不能用克拉默法则，需讨论解的情况
3. 若 $D \\neq 0$：依次计算 $D_1, D_2, \\cdots, D_n$
4. 解为 $x_i = D_i / D$

**注意**：
- 只适用于方程个数=未知数个数的情形
- 计算量大，实际做题优先用消元法`
      },
    ],
  },
}

// ==================== 矩阵章节 ====================

// 矩阵的定义与运算知识点
const matrixDefinitionPoint: KnowledgePoint = {
  id: 'matrix-definition',
  moduleId: 'matrix',
  name: '矩阵的定义与运算',
  formula: '(AB)_{ij} = \\sum_{k=1}^{n} a_{ik}b_{kj}',
  coreSentence: '矩阵是"数字表格"，矩阵乘法是"行×列"的奇妙组合，是线性代数的核心语言。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [
          { id: 'A', x: 1, y: 1, label: 'A' },
          { id: 'B', x: 3, y: 1, label: 'B' },
          { id: 'AB', x: 5, y: 1, label: 'AB' },
        ],
        sliders: [
          { id: 'a11', name: 'a₁₁', min: -3, max: 3, step: 1, defaultValue: 1, label: 'a₁₁' },
          { id: 'a12', name: 'a₁₂', min: -3, max: 3, step: 1, defaultValue: 2, label: 'a₁₂' },
          { id: 'a21', name: 'a₂₁', min: -3, max: 3, step: 1, defaultValue: 3, label: 'a₂₁' },
          { id: 'a22', name: 'a₂₂', min: -3, max: 3, step: 1, defaultValue: 4, label: 'a₂₂' },
          { id: 'b11', name: 'b₁₁', min: -3, max: 3, step: 1, defaultValue: 1, label: 'b₁₁' },
          { id: 'b12', name: 'b₁₂', min: -3, max: 3, step: 1, defaultValue: 0, label: 'b₁₂' },
          { id: 'b21', name: 'b₂₁', min: -3, max: 3, step: 1, defaultValue: 0, label: 'b₂₁' },
          { id: 'b22', name: 'b₂₂', min: -3, max: 3, step: 1, defaultValue: 1, label: 'b₂₂' },
        ],
      },
      animations: [
        {
          id: 'multiply-step',
          name: '矩阵乘法分步演示',
          type: 'auto',
          duration: 12000,
          steps: [
            { id: 's1', description: '左矩阵A的第1行：[1, 2]，右矩阵B的第1列：[1, 0]', changes: { a11: 1, a12: 2, b11: 1, b21: 0 } },
            { id: 's2', description: '点乘：1×1 + 2×0 = 1 → AB的第(1,1)位置', changes: {} },
            { id: 's3', description: 'A的第1行 × B的第2列：1×0 + 2×1 = 2 → AB的第(1,2)位置', changes: {} },
            { id: 's4', description: 'A的第2行 × B的第1列：3×1 + 4×0 = 3 → AB的第(2,1)位置', changes: {} },
            { id: 's5', description: 'A的第2行 × B的第2列：3×0 + 4×1 = 4 → AB的第(2,2)位置', changes: {} },
            { id: 's6', description: '结果：AB = [[1,2], [3,4]]，口诀：左行右列！', changes: {} },
          ],
        },
        {
          id: 'non-commutative',
          name: '矩阵乘法不满足交换律',
          type: 'auto',
          duration: 8000,
          steps: [
            { id: 's1', description: '设A=[[1,2],[0,0]]，B=[[0,0],[3,4]]', changes: { a11: 1, a12: 2, a21: 0, a22: 0, b11: 0, b12: 0, b21: 3, b22: 4 } },
            { id: 's2', description: 'AB = [[6,8],[0,0]]，计算：第1行×第1列=1×0+2×3=6', changes: {} },
            { id: 's3', description: 'BA = [[0,0],[3,4]]，完全不同！', changes: {} },
            { id: 's4', description: '结论：AB ≠ BA，矩阵乘法不满足交换律！', changes: {} },
          ],
        },
        {
          id: 'identity-effect',
          name: '单位矩阵的作用',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: '单位矩阵I = [[1,0],[0,1]]', changes: { b11: 1, b12: 0, b21: 0, b22: 1 } },
            { id: 's2', description: 'AI = IA = A，乘了等于没乘！', changes: {} },
            { id: 's3', description: '单位矩阵就像数字1在乘法中的作用', changes: {} },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 从方程组说起**

考虑线性方程组：
$$\\begin{cases} 2x + 3y = 5 \\\\ 4x + y = 6 \\end{cases}$$

我们可以把系数单独"提"出来：
$$\\begin{pmatrix} 2 & 3 \\\\ 4 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix}$$

这就是矩阵的由来！**矩阵就是按行列排成的数表**。

---

**📐 矩阵的基本概念**

**定义**：$m \\times n$ 矩阵是有 $m$ 行 $n$ 列的数表：
$$A = \\begin{pmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{pmatrix}$$

记作 $A = (a_{ij})_{m \\times n}$ 或 $A_{m \\times n}$

**特殊矩阵**：
| 名称 | 特点 | 例子 |
|------|------|------|
| 方阵 | 行数=列数 | $A_{n \\times n}$ |
| 单位矩阵 $I$ | 对角线全1，其余为0 | $\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$ |
| 零矩阵 $O$ | 所有元素都是0 | $\\begin{pmatrix}0&0\\\\0&0\\end{pmatrix}$ |
| 对角矩阵 | 非对角线全为0 | $\\begin{pmatrix}a&0\\\\0&b\\end{pmatrix}$ |
| 对称矩阵 | $A^T = A$（关于对角线对称）| $\\begin{pmatrix}1&2\\\\2&3\\end{pmatrix}$ |

---

**➕ 矩阵的运算**

**1. 加法**：对应位置相加（必须同型！）
$$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} + \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ 10 & 12 \\end{pmatrix}$$

**2. 数乘**：每个元素都乘同一个数
$$2 \\cdot \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} = \\begin{pmatrix} 2 & 4 \\\\ 6 & 8 \\end{pmatrix}$$

**3. 转置** $A^T$：行列互换
$$\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$$

**4. 矩阵乘法** ⭐最核心最独特！

$$AB = C，\\text{其中 } c_{ij} = \\text{A的第i行} \\times \\text{B的第j列}$$

$$\\begin{pmatrix} \\underline{1} & \\underline{2} \\\\ 3 & 4 \\end{pmatrix} \\begin{pmatrix} \\mathbf{5} & 6 \\\\ \\mathbf{7} & 8 \\end{pmatrix} = \\begin{pmatrix} 1\\times5+2\\times7 & \\cdots \\\\ \\cdots & \\cdots \\end{pmatrix} = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$$

**关键**：第(1,1)位置 = A的第1行点乘B的第1列！

---

**⚠️ 矩阵乘法的"坑"**

| 性质 | 说明 | 例子 |
|------|------|------|
| **不满足交换律** | $AB \\neq BA$（通常）| $\\begin{pmatrix}1&2\\\\0&0\\end{pmatrix}\\begin{pmatrix}0&0\\\\3&4\\end{pmatrix} \\neq \\begin{pmatrix}0&0\\\\3&4\\end{pmatrix}\\begin{pmatrix}1&2\\\\0&0\\end{pmatrix}$ |
| **AB=O推不出A=O或B=O** | 非零矩阵乘积可以是零矩阵 | $\\begin{pmatrix}1&0\\\\1&0\\end{pmatrix}\\begin{pmatrix}0&0\\\\1&1\\end{pmatrix}=O$ |
| **AB=AC推不出B=C** | 消去律不成立！| 需要A可逆才能消去 |

---

**💡 直观理解**

- **矩阵加法**：像向量相加，"同类项合并"
- **矩阵乘法**：像是"函数复合"，A变换后再做B变换
- **转置**：把表格"横过来"看

**矩阵乘法的几何意义**：
- 每个矩阵代表一个线性变换
- $AB$ 表示先做 $B$ 变换，再做 $A$ 变换
- 这就是为什么 $AB \\neq BA$——变换顺序很重要！`,
      highlights: ['矩阵乘法核心：行的元素 × 列的元素，求和', '矩阵乘法不满足交换律和消去律'],
    },
    
    extension: {
      essence: `**矩阵的本质**

矩阵不仅是"数表"，它是**线性变换的表示**。

想象二维平面上的变换：
- **旋转矩阵**：$\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}$ 把向量逆时针旋转θ角
- **伸缩矩阵**：$\\begin{pmatrix}k&0\\\\0&1\\end{pmatrix}$ 把向量在x方向拉伸k倍
- **剪切矩阵**：$\\begin{pmatrix}1&k\\\\0&1\\end{pmatrix}$ 让图形"倾斜"

**为什么矩阵乘法是行×列？**

设 $A$ 把向量 $v$ 变成 $Av$，$B$ 把向量 $w$ 变成 $Bw$。
那么"先做B再做A"的变换，作用在 $v$ 上就是 $A(Bv) = (AB)v$。

这正是矩阵乘法的定义！`,
      further: [
        {
          id: 'ext1',
          title: '单位矩阵的特殊性',
          content: '$IA = AI = A$，单位矩阵在矩阵乘法中的地位就像数字1在普通乘法中一样——"乘了等于没乘"。',
        },
        {
          id: 'ext2',
          title: '转置的性质',
          content: '$(AB)^T = B^T A^T$（顺序颠倒！），$(A+B)^T = A^T + B^T$，$(A^T)^T = A$',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '计算矩阵乘积',
          description: `计算 $AB$，其中 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，$B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$

**解答**：
$AB = \\begin{pmatrix} 1\\times0+2\\times1 & 1\\times1+2\\times0 \\\\ 3\\times0+4\\times1 & 3\\times1+4\\times0 \\end{pmatrix} = \\begin{pmatrix} 2 & 1 \\\\ 4 & 3 \\end{pmatrix}$

验证 $BA = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix} \\neq AB$`,
          scenario: '基础运算练习。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '计算机图形学：3D变换',
          description: `**问题**：在游戏中实现物体的旋转、缩放、平移

**方法**：用矩阵表示变换，组合变换用矩阵乘法

**绕Z轴旋转θ角**：
$$R_z(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$

**复合变换**：先旋转后缩放 = 缩放矩阵 × 旋转矩阵
$$T = S \\times R$$

**应用**：游戏引擎、CAD设计、虚拟现实、动画制作。`,
          scenario: '游戏开发和计算机图形学。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '神经网络：前向传播',
          description: `**问题**：计算神经网络各层的输出

**方法**：矩阵乘法批量计算
$$Y = W \\cdot X + b$$

其中：
- $X$：输入矩阵（批量数据）
- $W$：权重矩阵
- $b$：偏置向量
- $Y$：输出矩阵

**GPU加速**：现代GPU专为矩阵运算优化，可并行处理大规模矩阵乘法。

**应用**：深度学习、图像识别、自然语言处理。`,
          scenario: '人工智能和深度学习。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '图像处理：卷积运算',
          description: `**问题**：图像模糊、边缘检测、锐化等操作

**方法**：用矩阵表示图像，卷积核与图像做运算

**边缘检测核**（Sobel算子）：
$$G_x = \\begin{pmatrix} -1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1 \\end{pmatrix}$$

**卷积操作**：核在图像上滑动，每个位置计算点积（矩阵运算的特例）。

**应用**：Photoshop滤镜、医学影像分析、自动驾驶视觉系统。`,
          scenario: '数字图像处理。',
        },
        {
          id: 'app5',
          type: 'real',
          title: '社交网络：PageRank算法',
          description: `**问题**：计算网页重要性排名

**方法**：建立链接矩阵，计算稳态概率
$$\\pi = \\pi \\cdot M$$

其中 $M$ 是转移矩阵，$\\pi$ 是排名向量。

**迭代求解**：$\\pi^{(k+1)} = \\pi^{(k)} \\cdot M$

**应用**：搜索引擎排名、社交网络影响力分析、推荐系统。`,
          scenario: '互联网搜索和社交网络。',
        },
        {
          id: 'app6',
          type: 'real',
          title: '密码学：Hill密码',
          description: `**问题**：用矩阵实现经典加密

**方法**：将明文分组，用矩阵变换加密
$$C = K \\cdot P \\mod 26$$

其中：
- $K$：密钥矩阵（需可逆）
- $P$：明文向量
- $C$：密文向量

**解密**：$P = K^{-1} \\cdot C \\mod 26$

**应用**：信息安全、数据加密（现代密码学用更复杂的矩阵运算）。`,
          scenario: '信息安全。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '矩阵乘法的计算技巧', 
        description: `**口诀：左行右列**

计算 $AB$ 的第 $(i,j)$ 个元素：
1. 找到 **左边矩阵 A 的第 i 行**
2. 找到 **右边矩阵 B 的第 j 列**
3. 对应元素相乘再相加

**检验维度**：
- $A_{m \\times n}$，$B_{p \\times q}$
- 能相乘 ⟺ $n = p$（A的列数=B的行数）
- 结果是 $m \\times q$ 矩阵

**记忆**：$(m \\times \\underline{n})(\\underline{n} \\times q) = m \\times q$`
      },
    ],
  },
}

// 逆矩阵与伴随矩阵知识点
const matrixInversePoint: KnowledgePoint = {
  id: 'matrix-inverse',
  moduleId: 'matrix',
  name: '逆矩阵与伴随矩阵',
  formula: 'A^{-1} = \\frac{1}{|A|}A^*, \\quad A^* = |A|A^{-1}',
  coreSentence: '逆矩阵是矩阵的"倒数"，伴随矩阵是求逆的桥梁，二者是考研的核心考点。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'a', name: 'a', min: -5, max: 5, step: 1, defaultValue: 3, label: 'a' },
          { id: 'b', name: 'b', min: -5, max: 5, step: 1, defaultValue: 1, label: 'b' },
          { id: 'c', name: 'c', min: -5, max: 5, step: 1, defaultValue: 2, label: 'c' },
          { id: 'd', name: 'd', min: -5, max: 5, step: 1, defaultValue: 1, label: 'd' },
        ],
      },
      animations: [
        {
          id: 'inverse-formula',
          name: '二阶矩阵求逆过程',
          type: 'auto',
          duration: 10000,
          steps: [
            { id: 's1', description: '二阶矩阵A = [[a,b],[c,d]]，先求行列式|A|=ad-bc', changes: { a: 3, b: 1, c: 2, d: 1 } },
            { id: 's2', description: '|A| = 3×1 - 1×2 = 1 ≠ 0，A可逆', changes: {} },
            { id: 's3', description: '主对角线交换：a↔d，得到[[d,b],[c,a]]', changes: {} },
            { id: 's4', description: '副对角线变号：b→-b, c→-c，得到[[d,-b],[-c,a]]', changes: {} },
            { id: 's5', description: '结果：A⁻¹ = [[1,-1],[-2,3]]/1 = [[1,-1],[-2,3]]', changes: {} },
            { id: 's6', description: '验证：AA⁻¹ = I ✓', changes: {} },
          ],
        },
        {
          id: 'adjugate-demo',
          name: '伴随矩阵演示',
          type: 'auto',
          duration: 8000,
          steps: [
            { id: 's1', description: '对于A = [[3,1],[2,1]]，求伴随矩阵A*', changes: { a: 3, b: 1, c: 2, d: 1 } },
            { id: 's2', description: 'A₁₁ = (-1)²×d = 1, A₁₂ = (-1)³×c = -2', changes: {} },
            { id: 's3', description: 'A₂₁ = (-1)³×b = -1, A₂₂ = (-1)⁴×a = 3', changes: {} },
            { id: 's4', description: 'A* = [[1,-1],[-2,3]]（注意转置！）', changes: {} },
            { id: 's5', description: '验证：AA* = |A|·I = I ✓', changes: {} },
          ],
        },
        {
          id: 'singular-case',
          name: '奇异矩阵演示',
          type: 'auto',
          duration: 5000,
          steps: [
            { id: 's1', description: '设A = [[1,2],[2,4]]', changes: { a: 1, b: 2, c: 2, d: 4 } },
            { id: 's2', description: '|A| = 1×4 - 2×2 = 0，A不可逆！', changes: {} },
            { id: 's3', description: '奇异矩阵：行列式为0，没有逆矩阵', changes: {} },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 从"倒数"说起**

在普通代数中，$a$ 的倒数是 $a^{-1}$，满足 $a \\cdot a^{-1} = 1$。

类似地，矩阵也有"倒数"——**逆矩阵**！

---

**📐 逆矩阵的定义**

若存在矩阵 $B$，使得 $AB = BA = I$，则称 $B$ 是 $A$ 的**逆矩阵**，记作 $A^{-1}$。

**关键问题**：什么样的矩阵有逆？

**定理**：方阵 $A$ 可逆 $\\Leftrightarrow$ $|A| \\neq 0$

| 条件 | 等价说法 |
|------|----------|
| $|A| \\neq 0$ | A是非奇异矩阵（满秩矩阵）|
| $|A| = 0$ | A是奇异矩阵（不满秩）|

---

**🔧 伴随矩阵**

**定义**：$A^* = (A_{ji})$，其中 $A_{ji}$ 是 $a_{ji}$ 的代数余子式。

**核心公式** ⭐：
$$AA^* = A^*A = |A|I$$

这个公式太重要了！它直接推出：
$$A^{-1} = \\frac{A^*}{|A|}$$

---

**📝 伴随矩阵的性质**（考研高频！）

| 公式 | 记忆技巧 |
|------|----------|
| $AA^* = |A|I$ | 原矩阵×伴随=行列式×单位阵 |
| $|A^*| = |A|^{n-1}$ | 伴随的行列式=原行列式的n-1次幂 |
| $(A^*)^* = |A|^{n-2}A$ | 伴随的伴随（n≥3）|
| $(A^{-1})^* = (A^*)^{-1}$ | 逆和伴随可交换 |
| $(kA)^* = k^{n-1}A^*$ | 数乘的伴随 |
| $(AB)^* = B^*A^*$ | 乘积的伴随，顺序颠倒 |

---

**💡 逆矩阵的求法**

**方法一：伴随矩阵法**
$$A^{-1} = \\frac{1}{|A|}A^*$$

适用于低阶矩阵（2阶、3阶）。

**方法二：初等变换法**
$$[A | I] \\xrightarrow{\\text{行变换}} [I | A^{-1}]$$

适用于高阶矩阵。

**二阶矩阵快速求逆公式** ⭐：
若 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，$|A| = ad-bc \\neq 0$，则：
$$A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$

**口诀**：主对角线交换，副对角线变号，再除以行列式！

---

**🔑 逆矩阵的运算性质**

| 性质 | 公式 |
|------|------|
| 逆的逆 | $(A^{-1})^{-1} = A$ |
| 逆的转置 | $(A^T)^{-1} = (A^{-1})^T$ |
| 逆的行列式 | $|A^{-1}| = |A|^{-1}$ |
| 乘积的逆 | $(AB)^{-1} = B^{-1}A^{-1}$ |
| 数乘的逆 | $(kA)^{-1} = \\frac{1}{k}A^{-1}$（k≠0）|

**记忆**：转置、逆都"反序"——$(AB)^T = B^TA^T$，$(AB)^{-1} = B^{-1}A^{-1}$`,
      highlights: ['AA*=|A|I 是伴随矩阵最核心的公式', '二阶矩阵求逆：主对角交换，副对角变号'],
    },
    
    extension: {
      essence: `**伴随矩阵的本质**

伴随矩阵 $A^*$ 的每一列，都是原矩阵 $A$ 各行的"法向量"！

具体来说，$A^*$ 的第 $j$ 列与 $A$ 的第 $i$ 行（$i \\neq j$）正交。

这解释了为什么 $AA^*$ 的非对角线元素都是0！

**几何视角**：

- $A$ 可逆 ⟺ $A$ 将空间"拉伸但不压扁"
- $|A| = 0$ ⟺ $A$ 将空间"压扁"到低维
- $A^{-1}$ 就是"把变换还原回去"

$|A| = 2$ 意味着：$A$ 把面积放大2倍。那么 $A^{-1}$ 把面积缩小到1/2，所以 $|A^{-1}| = 1/2$。`,
      further: [
        {
          id: 'ext1',
          title: '已知A*求A',
          content: '若已知 $A^*$，如何求 $A$？利用 $A = |A|(A^*)^{-1}$，其中 $|A|$ 由 $|A^*| = |A|^{n-1}$ 确定。',
        },
        {
          id: 'ext2',
          title: '伴随矩阵的秩',
          content: '$$r(A^*) = \\begin{cases} n, & r(A) = n \\\\ 1, & r(A) = n-1 \\\\ 0, & r(A) < n-1 \\end{cases}$$',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '求二阶矩阵的逆',
          description: `求 $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 1 \\end{pmatrix}$ 的逆矩阵。

**解答**：
$|A| = 3\\times1 - 1\\times2 = 1$

用快速公式：主对角交换，副对角变号：
$$A^{-1} = \\frac{1}{1}\\begin{pmatrix} 1 & -1 \\\\ -2 & 3 \\end{pmatrix} = \\begin{pmatrix} 1 & -1 \\\\ -2 & 3 \\end{pmatrix}$$

验证：$AA^{-1} = \\begin{pmatrix} 3&1\\\\2&1\\end{pmatrix}\\begin{pmatrix} 1&-1\\\\-2&3\\end{pmatrix} = \\begin{pmatrix} 1&0\\\\0&1\\end{pmatrix}$ ✓`,
          scenario: '二阶矩阵求逆。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '密码学：Hill密码解密',
          description: `**问题**：已知加密矩阵K和密文C，求明文P

**方法**：解密需要求逆矩阵
$$P = K^{-1} \\cdot C \\mod 26$$

**例子**：若 $K = \\begin{pmatrix} 3 & 2 \\\\ 3 & 5 \\end{pmatrix}$，则 $K^{-1} = \\begin{pmatrix} 15 & 8 \\\\ 17 & 3 \\end{pmatrix}$

**应用**：现代密码协议中广泛使用矩阵运算，如RSA加密涉及模逆运算。`,
          scenario: '信息安全。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '信号处理：解卷积',
          description: `**问题**：已知系统输出y和冲激响应h，求输入信号x

**方法**：解卷积方程
$$y = h * x \\Rightarrow Y = H \\cdot X$$

求逆得：$X = H^{-1} \\cdot Y$

**实际应用**：
- 图像去模糊：逆滤波
- 地震信号处理：去除地面响应
- 声学信号处理：房间传递函数逆运算`,
          scenario: '数字信号处理。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '机器人运动学：逆运动学',
          description: `**问题**：已知末端执行器位置，求各关节角度

**方法**：正运动学 $x = f(q)$，逆运动学 $q = f^{-1}(x)$

雅可比矩阵方法：
$$\\dot{q} = J^{-1} \\cdot \\dot{x}$$

**挑战**：雅可比矩阵可能奇异（奇异点），需要特殊处理。

**应用**：工业机器人轨迹规划、手术机器人控制。`,
          scenario: '机器人学。',
        },
        {
          id: 'app5',
          type: 'real',
          title: '数据拟合：最小二乘法',
          description: `**问题**：求解超定方程组 $Ax = b$（方程数>未知数）

**方法**：正规方程
$$x = (A^TA)^{-1}A^Tb$$

**注意**：实际计算不用显式求逆，而用QR分解或SVD分解更稳定。

**应用**：曲线拟合、GPS定位、计量经济学回归分析。`,
          scenario: '统计建模。',
        },
        {
          id: 'app6',
          type: 'research',
          title: '伴随矩阵相关的证明',
          description: `证明：$(AB)^* = B^*A^*$

**证明**：
$(AB)^* = |AB|(AB)^{-1} = |A||B|B^{-1}A^{-1}$
$= |B|B^{-1} \\cdot |A|A^{-1} = B^*A^*$

**关键**：利用 $A^* = |A|A^{-1}$ 这个桥梁！`,
          scenario: '证明技巧。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '逆矩阵问题的解题思路', 
        description: `**遇到逆矩阵问题，三条路**：

1. **定义法**：找 $B$ 使 $AB = I$
2. **伴随法**：$A^{-1} = A^*/|A|$（低阶）
3. **初等变换法**：$[A|I] → [I|A^{-1}]$（高阶）

**常见题型**：
- 求 $A^{-1}$：直接计算
- 已知 $A^{-1}$ 求 $A$：两边取逆
- 解矩阵方程 $AX=B$：$X = A^{-1}B$
- 证明题：用定义或 $A^* = |A|A^{-1}$`
      },
    ],
  },
}

// 矩阵的秩知识点
const matrixRankPoint: KnowledgePoint = {
  id: 'matrix-rank',
  moduleId: 'matrix',
  name: '矩阵的秩',
  formula: 'r(A) = \\text{最高阶非零子式的阶数}',
  coreSentence: '秩是矩阵的"核心维度"，揭示了矩阵的真实复杂度和方程组解的结构。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [],
        sliders: [
          { id: 'transform', name: '变换步数', min: 0, max: 5, step: 1, defaultValue: 0, label: '变换步数' },
        ],
      },
      animations: [
        {
          id: 'echelon-process',
          name: '阶梯形化简求秩',
          type: 'auto',
          duration: 12000,
          steps: [
            { id: 's1', description: '原矩阵：[[1,2,3],[2,4,6],[1,1,1]]，观察第2行是否与第1行相关', changes: { transform: 0 } },
            { id: 's2', description: '第2行 - 2×第1行 → 第2行变零！第1行和第3行独立', changes: { transform: 1 } },
            { id: 's3', description: '第3行 - 第1行 → 第3行变为[0,-1,-2]', changes: { transform: 2 } },
            { id: 's4', description: '阶梯形：[[1,2,3],[0,-1,-2],[0,0,0]]，非零行有2行', changes: { transform: 3 } },
            { id: 's5', description: 'r(A) = 2，第2行是第1行的倍数，只有2个独立行', changes: { transform: 4 } },
            { id: 's6', description: '结论：秩=非零行数=独立向量个数=列空间维度', changes: { transform: 5 } },
          ],
        },
        {
          id: 'rank-properties',
          name: '秩的重要性质演示',
          type: 'auto',
          duration: 10000,
          steps: [
            { id: 's1', description: '性质1：r(A) = r(Aᵀ)，行秩=列秩', changes: {} },
            { id: 's2', description: '性质2：r(AB) ≤ min{r(A), r(B)}，乘积秩不超过各因子秩', changes: {} },
            { id: 's3', description: '性质3：若A可逆，则r(AB)=r(B)，满秩矩阵不降秩', changes: {} },
            { id: 's4', description: '重要结论：AB=O ⇒ r(A)+r(B) ≤ n', changes: {} },
            { id: 's5', description: '例子：A₃ₓ₃有秩2，B的列都是Ax=0的解，r(B)≤1', changes: {} },
          ],
        },
        {
          id: 'full-rank',
          name: '满秩矩阵的特殊性',
          type: 'auto',
          duration: 6000,
          steps: [
            { id: 's1', description: '满秩方阵：r(A)=n，等价于|A|≠0，等价于A可逆', changes: {} },
            { id: 's2', description: '列满秩r(A)=n：Ax=0只有零解，Ax=b若有解则唯一', changes: {} },
            { id: 's3', description: '行满秩r(A)=m：Ax=b总有解（至少一个解）', changes: {} },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 引子：矩阵"真正的维度"**

一个 $3 \\times 4$ 矩阵，看起来有3行4列。但它的"真实维度"可能只有2！

这就是**秩**的概念——矩阵中真正"独立"的行（或列）的个数。

---

**📐 秩的定义**

**子式定义**：
$r(A)$ = 矩阵 $A$ 中**非零子式的最高阶数**

**例子**：
$$A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{pmatrix}$$

第2行 = 2×第1行，所以三阶子式 $|A| = 0$。

但二阶子式 $\\begin{vmatrix} 1&2\\\\1&1\\end{vmatrix} = -1 \\neq 0$。

所以 $r(A) = 2$。

---

**💡 更直观的理解**

**秩 = 行向量组的秩 = 列向量组的秩**

- $r(A) = r$ ⟺ 有 $r$ 个线性无关的行（或列）
- 其他行（列）都可以被这 $r$ 个线性表示

**几何意义**：
- $r(A_{m \\times n}) = r$ 意味着 $A$ 的列向量张成一个 $r$ 维空间
- 比如上面的矩阵，列向量都在一个平面上（2维）

---

**🔧 秩的基本性质**

| 性质 | 公式 | 说明 |
|------|------|------|
| 转置不变 | $r(A^T) = r(A)$ | 行秩=列秩 |
| 范围 | $0 \\leq r(A) \\leq \\min(m,n)$ | 满秩 $\\Leftrightarrow$ $r(A) = \\min(m,n)$ |
| 子矩阵 | 子矩阵的秩 ≤ 原矩阵的秩 | 删行列不增秩 |
| $r(0) = 0$ | 零矩阵的秩是0 | 只有一个矩阵秩为0 |

---

**📏 秩的重要不等式**（考研重点！）

**1. 秩的和**：
$$r(A) + r(B) - n \\leq r(AB) \\leq \\min(r(A), r(B))$$

**2. 秩的和与并**：
$$\\max(r(A), r(B)) \\leq r(A, B) \\leq r(A) + r(B)$$

**3. Sylvester不等式**：
$$r(A) + r(B) - n \\leq r(AB)$$

**4. 特别有用的结论**：
$$r(A) + r(B) \\leq n + r(AB)$$

当 $AB = O$ 时：$r(A) + r(B) \\leq n$

---

**🌟 考研高频性质**

| 条件 | 结论 |
|------|------|
| $A$ 可逆 | $r(AB) = r(B)$，$r(BA) = r(B)$ |
| $A$ 列满秩（$r(A) = n$）| $r(AB) = r(B)$ |
| $A$ 行满秩（$r(A) = m$）| $r(BA) = r(B)$ |
| $A^TA$ | $r(A^TA) = r(A)$ |
| $r(A) = 1$ | $A = \\alpha\\beta^T$，迹=行列式类型问题 |

---

**🔑 秩的求法**

**初等变换法**（最常用）：
$$A \\xrightarrow{\\text{行变换}} \\begin{pmatrix} 1 & * & * & * \\\\ 0 & 1 & * & * \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$$

非零行的个数 = 秩

**本质**：把矩阵化成"阶梯形"，数台阶！`,
      highlights: ['秩 = 非零子式最高阶数 = 线性无关行/列数', 'AB=O时，r(A)+r(B)≤n是重要结论'],
    },
    
    extension: {
      essence: `**秩的深层意义**

秩是线性代数的"灵魂概念"，它连接了：

1. **代数视角**：非零子式的最高阶数
2. **几何视角**：列空间（或行空间）的维度
3. **方程组视角**：独立方程的个数
4. **变换视角**：线性变换像空间的维度

**为什么行秩=列秩？**

这可以从线性方程组的对偶性理解：
- $Ax = 0$ 的解空间维数 = $n - r(A)$
- $A^Ty = 0$ 的解空间维数 = $m - r(A^T)$

但这两个方程组有相同的"本质复杂度"，所以 $r(A) = r(A^T)$。

**满秩矩阵的特殊性**：
- 满秩方阵 = 可逆矩阵
- 列满秩：$Ax = 0$ 只有零解
- 行满秩：$Ax = b$ 总有解`,
      further: [
        {
          id: 'ext1',
          title: '秩1矩阵',
          content: '若 $r(A) = 1$，则 $A = \\alpha\\beta^T$（一个列向量×一个行向量）。此时 $A^n = (\\beta^T\\alpha)^{n-1}A$。',
        },
        {
          id: 'ext2',
          title: '伴随矩阵的秩',
          content: '$$r(A^*) = \\begin{cases} n, & r(A) = n \\\\ 1, & r(A) = n-1 \\\\ 0, & r(A) < n-1 \\end{cases}$$ 这说明只有满秩和秩为n-1时，伴随矩阵才有意义。',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '求矩阵的秩',
          description: `求 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 3 & 6 & 9 \\end{pmatrix}$ 的秩。

**方法：初等变换**

$\\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 3 & 6 & 9 \\end{pmatrix} \\xrightarrow{r_2-2r_1, r_3-3r_1} \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$

非零行只有1行，所以 $r(A) = 1$。

**观察**：第2、3行都是第1行的倍数，只有1个独立的行。`,
          scenario: '基础计算。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '信息检索：文档相似度',
          description: `**问题**：搜索引擎如何判断两篇文档的相关性？

**方法**：构建文档-词项矩阵，计算秩和奇异值分解

**LSI（潜在语义索引）**：
- 文档矩阵的秩反映"主题数量"
- 低秩近似可捕捉文档的隐含语义
- 秩截断可降噪并提高检索效率

**应用**：Google搜索、推荐系统、垃圾邮件过滤。`,
          scenario: '搜索引擎和信息检索。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '通信系统：MIMO信道容量',
          description: `**问题**：多天线系统（MIMO）的最大传输速率？

**方法**：信道矩阵H的秩决定空间复用增益

$$C = \\log_2\\det(I + \\frac{SNR}{n_t}HH^H)$$

- $r(H)$ = 可同时传输的独立数据流数量
- 满秩信道：最大化空间自由度

**应用**：5G通信、WiFi 6、卫星通信。`,
          scenario: '无线通信。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '图像压缩：低秩近似',
          description: `**问题**：如何高效压缩图像？

**方法**：奇异值分解（SVD）低秩近似

$$A \\approx \\sum_{i=1}^{k} \\sigma_i u_i v_i^T$$

- 原图秩为r，用前k个奇异值近似
- k << r 时压缩比高，质量略有损失

**应用**：JPEG压缩、人脸识别、视频编码。`,
          scenario: '数字图像处理。',
        },
        {
          id: 'app5',
          type: 'real',
          title: '机器学习：特征选择',
          description: `**问题**：数据集中有多少"有效"特征？

**方法**：数据矩阵的秩反映特征独立性

- 满秩：特征相互独立，信息丰富
- 低秩：特征高度相关，存在冗余

**应用**：
- 降维：PCA保留主要成分
- 特征工程：去除共线性特征
- 模型诊断：检测过拟合风险`,
          scenario: '数据科学。',
        },
        {
          id: 'app6',
          type: 'research',
          title: '秩与方程组解的关系',
          description: `**核心定理**：

对于 $n$ 元线性方程组 $Ax = b$：
- $r(A) \\neq r(A|b)$ ⟹ 无解
- $r(A) = r(A|b) = n$ ⟹ 唯一解
- $r(A) = r(A|b) < n$ ⟹ 无穷多解

**齐次方程组** $Ax = 0$：
- $r(A) = n$ ⟹ 只有零解
- $r(A) < n$ ⟹ 有非零解（自由变量个数为 $n-r(A)$）

这就是为什么秩如此重要——它直接决定了解的情况！`,
          scenario: '秩的应用。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '秩相关问题的解题策略', 
        description: `**求秩**：初等变换 → 阶梯形 → 数非零行

**证明秩的不等式**：
1. 利用 $r(AB) \\leq \\min(r(A), r(B))$
2. 利用 $AB = O \\Rightarrow r(A) + r(B) \\leq n$
3. 利用 $r(A) + r(B) - n \\leq r(AB)$

**常见题型**：
- 求 $r(A)$：化阶梯形
- 已知 $r(A)$ 求参数：分析何时某阶子式为0/非0
- 证明秩的关系：利用基本不等式`
      },
    ],
  },
}

// 矩阵方程知识点
const matrixEquationPoint: KnowledgePoint = {
  id: 'matrix-equation',
  moduleId: 'matrix',
  name: '矩阵方程与特殊矩阵',
  formula: 'AX = B \\Rightarrow X = A^{-1}B, \\quad XA = B \\Rightarrow X = BA^{-1}',
  coreSentence: '矩阵方程是线性方程组的"升级版"，特殊矩阵（正交、正定等）是考研的重点考查对象。',
  
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [
          { id: 'e1', x: 1, y: 0, label: 'e₁' },
          { id: 'e2', x: 0, y: 1, label: 'e₂' },
        ],
        sliders: [
          { id: 'eq_type', name: 'eq_type', min: 0, max: 2, step: 1, defaultValue: 0, label: '方程类型' },
          { id: 'theta', name: '旋转角θ', min: 0, max: 6.28, step: 0.1, defaultValue: 0, label: 'θ' },
          { id: 'lambda1', name: '特征值λ₁', min: 0.1, max: 3, step: 0.1, defaultValue: 1, label: 'λ₁' },
          { id: 'lambda2', name: '特征值λ₂', min: 0.1, max: 3, step: 0.1, defaultValue: 1, label: 'λ₂' },
        ],
      },
      animations: [
        {
          id: 'orthogonal-transform',
          name: '正交矩阵：旋转变换',
          type: 'auto',
          duration: 8000,
          steps: [
            { id: 's1', description: '正交矩阵Q = [[cosθ,-sinθ],[sinθ,cosθ]]，θ=0时Q=I', changes: { theta: 0 } },
            { id: 's2', description: 'θ=π/4：向量逆时针旋转45°，长度不变', changes: { theta: 0.785 } },
            { id: 's3', description: 'θ=π/2：向量逆时针旋转90°', changes: { theta: 1.57 } },
            { id: 's4', description: 'θ=π：向量旋转180°，方向相反', changes: { theta: 3.14 } },
            { id: 's5', description: '关键性质：正交变换保持长度和角度，|Qx|=|x|', changes: { theta: 1 } },
          ],
        },
        {
          id: 'positive-definite',
          name: '正定矩阵：特征值全正',
          type: 'auto',
          duration: 8000,
          steps: [
            { id: 's1', description: '正定矩阵A：所有特征值λ>0，二次型xᵀAx>0（x≠0）', changes: { lambda1: 2, lambda2: 3 } },
            { id: 's2', description: '几何：xᵀAx = c 是一个椭圆（正定）', changes: { lambda1: 2, lambda2: 1 } },
            { id: 's3', description: '若λ₁>0, λ₂<0：不定，二次型是双曲线', changes: { lambda1: 2, lambda2: -1 } },
            { id: 's4', description: '若λ₁=λ₂>0：正定，二次型是圆', changes: { lambda1: 2, lambda2: 2 } },
            { id: 's5', description: '判定：顺序主子式全>0 ⟺ 正定', changes: { lambda1: 2, lambda2: 3 } },
          ],
        },
        {
          id: 'matrix-equation-solve',
          name: '矩阵方程求解',
          type: 'auto',
          duration: 6000,
          steps: [
            { id: 's1', description: 'AX=B型：X=A⁻¹B，逆矩阵右乘', changes: {} },
            { id: 's2', description: 'XA=B型：X=BA⁻¹，逆矩阵左乘', changes: {} },
            { id: 's3', description: 'AXB=C型：X=A⁻¹CB⁻¹，两边取逆', changes: {} },
            { id: 's4', description: '注意顺序：矩阵乘法不满足交换律！', changes: {} },
          ],
        },
        {
          id: 'special-matrices',
          name: '特殊矩阵性质速览',
          type: 'auto',
          duration: 10000,
          steps: [
            { id: 's1', description: '幂等矩阵A²=A：特征值0或1，r(A)+r(I-A)=n', changes: {} },
            { id: 's2', description: '对合矩阵A²=I：A⁻¹=A，特征值±1', changes: {} },
            { id: 's3', description: '幂零矩阵Aᵏ=O：特征值全0，不可对角化', changes: {} },
            { id: 's4', description: '秩1矩阵A=αβᵀ：Aⁿ=(βᵀα)ⁿ⁻¹A', changes: {} },
            { id: 's5', description: '实对称矩阵：特征值实数，可正交对角化', changes: {} },
          ],
        },
      ],
    },
    
    explanation: {
      mainText: `**🎯 从线性方程组到矩阵方程**

线性方程组 $Ax = b$，把 $x$ 和 $b$ 换成矩阵，就得到**矩阵方程** $AX = B$。

矩阵方程是"批量"解线性方程组！

---

**📐 矩阵方程的类型与解法**

| 类型 | 解法 | 条件 |
|------|------|------|
| $AX = B$ | $X = A^{-1}B$ | $A$ 可逆 |
| $XA = B$ | $X = BA^{-1}$ | $A$ 可逆 |
| $AXB = C$ | $X = A^{-1}CB^{-1}$ | $A,B$ 可逆 |

**注意顺序**：$AX=B$ 右乘逆，$XA=B$ 左乘逆！

---

**🔧 一般矩阵方程的解**

当 $A$ 不可逆时，矩阵方程 $AX = B$ 有解的条件是：
$$r(A) = r(A|B)$$

解的结构：
$$X = X^* + C$$

其中 $X^*$ 是特解，$C$ 的每一列都是 $Ax = 0$ 的解。

---

**⭐ 正交矩阵**

**定义**：若 $A^TA = I$，则 $A$ 是正交矩阵。

**等价条件**：
- $A^T = A^{-1}$
- $A$ 的列（行）向量是标准正交基
- $|A| = \\pm 1$

**性质**：
| 性质 | 说明 |
|------|------|
| 保持长度 | $\\|Ax\\| = \\|x\\|$ |
| 保持角度 | $(Ax)^T(Ay) = x^Ty$ |
| 行列式 | $|A| = \\pm 1$ |
| 正交矩阵的乘积 | 还是正交矩阵 |

**几何意义**：正交矩阵代表"旋转"或"反射"——保持距离和角度的变换。

---

**⭐ 正定矩阵**

**定义**：实对称矩阵 $A$ 称为正定矩阵，若对任意 $x \\neq 0$，有 $x^TAx > 0$。

**判定条件**（等价）：
| 条件 | 说明 |
|------|------|
| 特征值全正 | $\\lambda_1, \\cdots, \\lambda_n > 0$ |
| 顺序主子式全正 | $\\Delta_1 > 0, \\Delta_2 > 0, \\cdots, \\Delta_n > 0$ |
| 合同于 $I$ | 存在可逆 $P$ 使 $P^TAP = I$ |

**半正定**：$x^TAx \\geq 0$（特征值非负）

**几何意义**：正定矩阵定义的二次型 $x^TAx$ 是一个"碗状"曲面，有唯一的极小值点。

---

**⭐ 相似与合同**

**相似**：$P^{-1}AP = B$，记作 $A \\sim B$

性质：
- 相似矩阵有相同的特征值
- 相似矩阵有相同的行列式、迹、秩
- $A \\sim \\Lambda$（对角矩阵）⟺ $A$ 可对角化

**合同**：$P^TAP = B$，记作 $A \\simeq B$

性质：
- 合同矩阵有相同的秩
- 合同变换保持对称性
- 实对称矩阵可合同对角化

**二者关系**：
- 相似必等秩，但等秩不一定相似
- 实对称矩阵：相似 $\\Leftrightarrow$ 合同（正交对角化）

---

**💡 特殊矩阵的考试重点**

| 类型 | 核心性质 | 考点 |
|------|----------|------|
| 幂等矩阵 $A^2=A$ | 特征值0或1，$r(A)+r(I-A)=n$ | 证明秩等式 |
| 对合矩阵 $A^2=I$ | $A^{-1}=A$，特征值±1 | 求特征值 |
| 幂零矩阵 $A^k=O$ | 特征值全0，不可对角化 | 证明特征值 |
| 秩1矩阵 | $A=\\alpha\\beta^T$，$A^n=(\\beta^T\\alpha)^{n-1}A$ | 求幂`,
      highlights: ['矩阵方程解的顺序很重要：AX=B右乘逆，XA=B左乘逆', '正定矩阵判定：特征值全正或顺序主子式全正'],
    },
    
    extension: {
      essence: `**特殊矩阵的本质**

**正交矩阵**：保持"形状"的线性变换
- 旋转、反射
- 不改变向量的长度和夹角
- 是"刚性变换"

**正定矩阵**：保持"方向性"的二次型
- $x^TAx > 0$ 对所有非零 $x$ 成立
- 二次型是一个"碗"，最低点在原点
- 用于最优化、距离定义（如马氏距离）

**相似 vs 合同**：

| | 相似 $P^{-1}AP$ | 合同 $P^TAP$ |
|--|----------------|--------------|
| 保持 | 特征值 | 惯性指数（正负特征值个数）|
| 适用 | 一般方阵 | 主要用于对称矩阵 |
| 几何 | 同一线性变换在不同基下的表示 | 同一二次型的不同表达形式 |

**实对称矩阵的特殊性**：
- 特征值都是实数
- 不同特征值对应的特征向量正交
- 可以正交对角化（相似且合同）`,
      further: [
        {
          id: 'ext1',
          title: '幂等矩阵的秩',
          content: '若 $A^2 = A$（幂等矩阵），则 $r(A) + r(I-A) = n$。证明：利用 $A(I-A) = O$ 和 $A + (I-A) = I$。',
        },
        {
          id: 'ext2',
          title: '正定矩阵的等价刻画',
          content: '$A$ 正定 $\\Leftrightarrow$ $A = B^TB$（$B$ 可逆）$\\Leftrightarrow$ $A$ 的所有主子式都大于0 $\\Leftrightarrow$ 存在对角矩阵 $D$ 使 $A = P^TDP$。',
        },
      ],
    },
    
    applications: {
      items: [
        {
          id: 'app1',
          type: 'example',
          title: '解矩阵方程',
          description: `设 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，$B = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$，解 $AX = B$。

**解法**：
$X = A^{-1}B = A^{-1}$

$|A| = -2$，$A^{-1} = \\frac{1}{-2}\\begin{pmatrix} 4 & -2 \\\\ -3 & 1 \\end{pmatrix} = \\begin{pmatrix} -2 & 1 \\\\ \\frac{3}{2} & -\\frac{1}{2} \\end{pmatrix}$

所以 $X = \\begin{pmatrix} -2 & 1 \\\\ \\frac{3}{2} & -\\frac{1}{2} \\end{pmatrix}$`,
          scenario: '基础矩阵方程。',
        },
        {
          id: 'app2',
          type: 'real',
          title: '计算机图形学：3D旋转',
          description: `**问题**：如何在三维空间中旋转物体？

**方法**：正交矩阵实现旋转变换

**绕z轴旋转θ角**：
$$R_z(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$

**性质**：
- 正交矩阵：$R^T R = I$，保持长度不变
- 行列式 = 1（纯旋转）或 -1（旋转+反射）

**应用**：游戏引擎、动画制作、VR/AR。`,
          scenario: '计算机图形学。',
        },
        {
          id: 'app3',
          type: 'real',
          title: '量子计算：量子门',
          description: `**问题**：量子计算机如何操作量子比特？

**方法**：酉矩阵（复数域的正交矩阵）

**Hadamard门**（量子叠加）：
$$H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$

**Pauli门**（量子翻转）：
$$X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, Y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$

**应用**：量子算法、量子纠错、量子通信。`,
          scenario: '量子计算。',
        },
        {
          id: 'app4',
          type: 'real',
          title: '信号处理：离散傅里叶变换',
          description: `**问题**：如何分析信号的频率成分？

**方法**：傅里叶变换矩阵

$$F = \\frac{1}{\\sqrt{n}}\\begin{pmatrix} 1 & 1 & 1 & \\cdots \\\\ 1 & \\omega & \\omega^2 & \\cdots \\\\ 1 & \\omega^2 & \\omega^4 & \\cdots \\\\ \\vdots & \\vdots & \\vdots & \\ddots \\end{pmatrix}$$

其中 $\\omega = e^{2\\pi i/n}$

**性质**：
- 酉矩阵：$F^*F = I$
- 对角化循环矩阵

**应用**：频谱分析、音频处理、图像压缩（JPEG）。`,
          scenario: '数字信号处理。',
        },
        {
          id: 'app5',
          type: 'real',
          title: '统计学习：协方差矩阵',
          description: `**问题**：如何描述多维数据的分布特征？

**方法**：协方差矩阵（半正定矩阵）

$$\\Sigma = \\frac{1}{n-1}X^TX$$

**性质**：
- 正定：数据在各方向都有方差
- 半正定：某些方向方差为0（数据共面）

**应用**：
- PCA降维：取最大特征值方向
- 马氏距离：$d = \\sqrt{(x-\\mu)^T\\Sigma^{-1}(x-\\mu)}$
- 高斯分布建模`,
          scenario: '统计学与机器学习。',
        },
        {
          id: 'app6',
          type: 'real',
          title: '优化理论：牛顿法',
          description: `**问题**：如何高效求解无约束优化？

**方法**：牛顿法利用Hessian矩阵（二阶导矩阵）

$$x_{k+1} = x_k - H^{-1}\\nabla f(x_k)$$

**Hessian矩阵**：$H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$

**性质**：
- 正定Hessian：局部极小值点
- 负定Hessian：局部极大值点
- 不定Hessian：鞍点

**应用**：深度学习优化、工程优化设计。`,
          scenario: '最优化。',
        },
        {
          id: 'app7',
          type: 'research',
          title: '正定矩阵的判定',
          description: `判断 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 是否正定。

**方法一：顺序主子式**
$\\Delta_1 = 2 > 0$
$\\Delta_2 = 4-1 = 3 > 0$
全正，所以正定。

**方法二：特征值**
$|A - \\lambda I| = (2-\\lambda)^2 - 1 = 0$
$\\lambda = 1, 3 > 0$
特征值全正，所以正定。

**方法三：配方法**
$x^TAx = 2x_1^2 + 2x_2^2 + 2x_1x_2 = 2(x_1 + \\frac{x_2}{2})^2 + \\frac{3}{2}x_2^2 > 0$
（当 $x \\neq 0$ 时）`,
          scenario: '正定判定。',
        },
      ],
    },
    
    method: [
      { 
        number: 1, 
        title: '特殊矩阵问题解题策略', 
        description: `**正交矩阵**：
- 验证 $A^TA = I$
- 或检验行/列向量是否标准正交

**正定矩阵判定**：
1. 求特征值（全正）
2. 求顺序主子式（全正）
3. 配方法化为标准形（系数全正）

**相似对角化**：
1. 求特征值
2. 求特征向量
3. 若有n个线性无关特征向量，则可对角化

**实对称矩阵**：一定可正交对角化！`
      },
    ],
  },
}

// ==================== 概率论与数理统计 ====================

// ============================================
// 第一章：随机事件和概率 —— 8个细粒度知识点
// ============================================

const randomExperimentPoint: KnowledgePoint = {
  id: 'random-experiment',
  moduleId: 'probability-events',
  name: '随机试验、样本空间与随机事件',
  formula: '\\Omega = \\{\\omega_1, \\omega_2, \\cdots\\}',
  coreSentence: '随机试验是概率论的起点——样本空间是所有可能结果的集合，随机事件是样本空间的子集。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'omega', x: 5, y: 0.5, draggable: false, color: '#5D4037', label: 'Ω' },
          { id: 'a', x: 3, y: 0.5, draggable: false, color: '#C62828', label: 'A' },
          { id: 'b', x: 7, y: 0.5, draggable: false, color: '#1565C0', label: 'B' },
          { id: 'w1', x: 2, y: 0.5, draggable: false, color: '#FF8F00', label: 'ω₁' },
          { id: 'w2', x: 4, y: 0.5, draggable: false, color: '#FF8F00', label: 'ω₂' },
          { id: 'w3', x: 6, y: 0.5, draggable: false, color: '#FF8F00', label: 'ω₃' },
          { id: 'w4', x: 8, y: 0.5, draggable: false, color: '#FF8F00', label: 'ω₄' },
        ],
        sliders: [
          { id: 'n_sample', name: 'n_sample', min: 2, max: 12, step: 1, defaultValue: 6, label: '样本点个数 n' },
          { id: 'a_size', name: 'a_size', min: 1, max: 6, step: 1, defaultValue: 2, label: '事件A包含样本点数' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '从随机试验到事件',
          type: 'step',
          steps: [
            { id: 's1', description: '随机试验：掷一颗骰子，观察点数', changes: { n_sample: 6, a_size: 1 } },
            { id: 's2', description: '样本空间Ω = {1,2,3,4,5,6}，共6个样本点', changes: { n_sample: 6, a_size: 1 } },
            { id: 's3', description: '基本事件ω₃ = {3}：只含一个样本点', changes: { n_sample: 6, a_size: 1 } },
            { id: 's4', description: '随机事件A = {2,4,6}："出现偶数"', changes: { n_sample: 6, a_size: 3 } },
            { id: 's5', description: '必然事件Ω = {1,2,3,4,5,6}：每次必发生', changes: { n_sample: 6, a_size: 6 } },
            { id: 's6', description: '不可能事件∅ = {}：永远不会发生', changes: { n_sample: 6, a_size: 0 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：从"不确定性"到"数学对象"**

概率论的第一步，是把日常生活中的"不确定现象"转化为精确的数学语言。这套语言的基础，就是随机试验、样本空间与随机事件。

---

**📐 随机试验的三要素**

一个试验 $E$ 称为**随机试验**，如果它同时满足以下三条：

| 要素 | 含义 | 例子 |
|------|------|------|
| 可重复性 | 在相同条件下可以重复进行 | 掷骰子可以反复做 |
| 明确性 | 所有可能结果是事先已知的 | 点数一定是1~6之一 |
| 随机性 | 一次试验之前不能确定哪个结果出现 | 不知道这次是几点 |

**注意**：随机试验不一定是"纯随机"的——重点在于"试验前无法预知结果"。例如，明天是否下雨就是一个随机试验，虽然它受物理规律支配。

---

**📐 样本空间与样本点**

**定义**：随机试验 $E$ 的所有可能结果组成的集合，称为**样本空间**，记作 $\\Omega$ 或 $S$。

样本空间中的每个元素 $\\omega$ 称为**样本点**。

**关键**：样本空间是**集合**，其中的元素是**互不相同**的。

**经典例子**：

| 随机试验 | 样本空间 Ω | 样本点个数 |
|---------|-----------|-----------|
| 掷一枚硬币 | $\\Omega = \\{正, 反\\}$ | 2 |
| 掷一颗骰子 | $\\Omega = \\{1,2,3,4,5,6\\}$ | 6 |
| 掷两枚硬币 | $\\Omega = \\{(正,正),(正,反),(反,正),(反,反)\\}$ | 4 |
| 在[0,1]上取点 | $\\Omega = [0,1]$ | 无限（不可列） |
| 记录灯泡寿命 | $\\Omega = [0,+\\infty)$ | 无限（不可列） |

**重要区分**：
- **离散样本空间**：样本点有限或可列无限（如掷骰子、抛硬币到出现正面为止）
- **连续样本空间**：样本点不可列（如取值于某区间）

---

**📐 随机事件**

**定义**：样本空间 $\\Omega$ 的子集称为**随机事件**，简称**事件**，通常用大写字母 $A, B, C$ 等表示。

当试验结果 $\\omega \\in A$ 时，称**事件 $A$ 发生**。

**四类特殊事件**：

| 类型 | 定义 | 符号 | 例子（掷骰子） |
|------|------|------|--------------|
| 基本事件 | 只含一个样本点 | $\\{\\omega\\}$ | $\\{3\\}$："出现3点" |
| 复合事件 | 含多个样本点 | $A \\subset \\Omega$ | $\\{2,4,6\\}$："出现偶数" |
| 必然事件 | 一定发生的事件 | $\\Omega$ | "点数在1~6之间" |
| 不可能事件 | 一定不发生的事件 | $\\emptyset$ | "出现7点" |

**注意**：必然事件和不可能事件是"退化"的随机事件——它们的发生没有不确定性，但为了理论完备性，仍归入事件范畴。

---

**📐 事件域（σ-代数）**

严格来说，并非 $\\Omega$ 的所有子集都适合作为事件。我们要求事件集类 $\\mathcal{F}$ 满足三条：

1. $\\Omega \\in \\mathcal{F}$
2. 若 $A \\in \\mathcal{F}$，则 $\\bar{A} \\in \\mathcal{F}$（对补封闭）
3. 若 $A_1, A_2, \\cdots \\in \\mathcal{F}$，则 $\\bigcup_{i=1}^{\\infty} A_i \\in \\mathcal{F}$（对可列并封闭）

这样的 $\\mathcal{F}$ 称为**事件域**或 **σ-代数**。它保证了事件经过并、交、差、补运算后仍然是事件。

- 有限样本空间：事件域 $\\mathcal{F} = 2^{\\Omega}$（幂集，即所有子集）
- 连续样本空间：通常取Borel σ-代数

---

**⚠️ 常见误区**

**误区1**："样本点就是概率"
- **纠正**：样本点是试验的结果，概率是事件的可能性大小。样本点本身没有概率，只有事件才有概率

**误区2**："基本事件一定是等可能的"
- **纠正**：基本事件只要求"不可再分"，不要求等可能。如偏心硬币的{正}和{反}概率不同

**误区3**："不可能事件就是不会出现在题目中的事件"
- **纠正**：不可能事件 $\\emptyset$ 在理论中有重要作用，如互斥事件的交集就是 $\\emptyset$`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：从"观察"到"建模"的抽象飞跃**

随机试验、样本空间和随机事件构成了概率论的**公理化基础**。这一套概念的深刻之处在于：

1. **分离"观察"与"建模"**：随机试验是对现实世界的观察，样本空间和事件是对观察的数学建模。同一现象可以有不同的建模方式。

2. **集合论的语言力量**：将事件定义为样本空间的子集，使得概率论可以直接使用集合论的丰富工具（并、交、补、包含等），这极大地简化了概率推理。

3. **σ-代数的必要性**：在连续样本空间中，并非所有子集都能赋予合理的概率。σ-代数的引入是为了避免"病态"集合，确保概率函数的定义域是良定义的。这与勒贝格测度论中"不可测集"的存在密切相关。

4. **从有限到无限的跨越**：离散样本空间中幂集即事件域，但连续样本空间需要更精细的结构。这种区分直接导致了古典概型与几何概型的不同计算方法。`,
      extension: `**🚀 测度论的视角**

在现代概率论中，概率是一种特殊的**测度**：

- 样本空间 $\\Omega$ 对应可测空间
- 事件域 $\\mathcal{F}$ 对应 σ-代数
- 概率 $P$ 对应测度（满足 $P(\\Omega) = 1$ 的归一化测度）

这种观点统一了概率论与测度论，使得概率论的严格性建立在与勒贝格积分相同的数学基础之上。`,
      further: [
        { id: 'f1', title: '样本空间的选择艺术', content: '同一随机现象可以有不同的样本空间建模。例如"掷两枚硬币"：\n- 方式一：Ω = {(正,正),(正,反),(反,正),(反,反)}，4个样本点\n- 方式二：Ω = {0,1,2}（正面次数），3个样本点\n选择取决于我们关心什么。方式一保留了更多信息，方式二更简洁。\n\n在概率论中，**样本空间的选择直接影响后续计算**，这是建模的第一步决策。' },
        { id: 'f2', title: '从随机试验到随机变量', content: '随机事件是样本空间的子集，而**随机变量**是定义在样本空间上的函数 $X: \\Omega \\to \\mathbb{R}$。\n\n随机变量将"事件"语言翻译为"数值"语言：\n- 事件 A = {ω : X(ω) ∈ B}\n- 例如：掷骰子，X = 点数，则"偶数" = {ω : X(ω) ∈ {2,4,6}}\n\n随机变量是概率论从"集合论"走向"分析学"的关键桥梁。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '质量检测——产品合格判定',
        description: `**问题背景**

工厂生产灯泡，每批次抽检5只灯泡，记录其中的不合格品数量。

**建立模型**

- 随机试验：从一批灯泡中抽检5只，记录不合格数
- 样本空间：$\\Omega = \\{0, 1, 2, 3, 4, 5\\}$
- 样本点：$\\omega_k = k$ 表示"不合格品数为 k"
- 随机事件举例：
  - A = "最多1只不合格" = $\\{0, 1\\}$
  - B = "至少3只不合格" = $\\{3, 4, 5\\}$
  - C = "全部合格" = $\\{0\\}$（基本事件）

**决策规则**

若 P(A) > 0.9，则批次合格；否则需要全检。`,
        scenario: '调整不合格率参数，观察不同事件概率的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '连续抛硬币直到出现正面',
        description: `**问题**

连续抛掷一枚均匀硬币，直到出现正面为止。描述样本空间与事件。

**解**

设 T = 反面，H = 正面，则：

样本空间：$\\Omega = \\{H, TH, TTH, TTTH, \\cdots\\}$

这是**可列无限**的样本空间！

- 基本事件：$\\{H\\}$ = "第1次就正面"
- 复合事件：A = "3次以内出现正面" = $\\{H, TH, TTH\\}$
- 必然事件：$\\Omega$（最终一定出现正面）
- 不可能事件：$\\emptyset$

P(A) = P(H) + P(TH) + P(TTH) = $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$`,
        scenario: '调整最大抛掷次数，观察"n次内出现正面"的概率变化。',
      },
    ],
    method: [
      { number: 1, title: '样本空间枚举法', description: `①明确随机试验是什么（观察什么，怎么记录结果）\n②列举所有可能结果，确保不重不漏\n③有限样本空间可用树形图或表格辅助列举\n④注意有序与无序的区别：掷两枚硬币是有序的(正,反)≠(反,正)` },
      { number: 2, title: '事件表示法', description: `①用自然语言描述事件，再翻译为样本空间子集\n②"至少一个"→并事件，"同时发生"→交事件\n③"不发生"→补事件\n④验证：事件A与事件B的交集是否为∅来判断互斥` },
    ],
  },
}

const eventRelationPoint: KnowledgePoint = {
  id: 'event-relation',
  moduleId: 'probability-events',
  name: '事件的关系与运算',
  formula: 'A \\cup B = \\{\\omega | \\omega \\in A \\text{或} \\omega \\in B\\}',
  coreSentence: '事件是样本空间的子集——用集合运算描述随机事件，对偶律是最有力的化简工具。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'pa', x: 0.3, y: 0.5, draggable: false, color: '#C62828', label: 'A' },
          { id: 'pb', x: 0.7, y: 0.5, draggable: false, color: '#1565C0', label: 'B' },
          { id: 'pab', x: 0.5, y: 0.5, draggable: false, color: '#2E7D32', label: 'AB' },
        ],
        sliders: [
          { id: 'pa_val', name: 'pa_val', min: 0, max: 1, step: 0.01, defaultValue: 0.4, label: 'P(A)' },
          { id: 'pb_val', name: 'pb_val', min: 0, max: 1, step: 0.01, defaultValue: 0.5, label: 'P(B)' },
          { id: 'pab_val', name: 'pab_val', min: 0, max: 0.5, step: 0.01, defaultValue: 0.2, label: 'P(AB)' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '事件关系与运算全景',
          type: 'step',
          steps: [
            { id: 's1', description: 'A⊂B：A发生则B必发生，P(AB)=P(A)=0.3', changes: { pa_val: 0.3, pb_val: 0.5, pab_val: 0.3 } },
            { id: 's2', description: 'A=B：两事件相等，P(A)=P(B)=0.4, P(AB)=0.4', changes: { pa_val: 0.4, pb_val: 0.4, pab_val: 0.4 } },
            { id: 's3', description: '互斥：AB=∅，P(AB)=0', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0 } },
            { id: 's4', description: '对立：A∪B=Ω且AB=∅，P(A)+P(B)=1', changes: { pa_val: 0.4, pb_val: 0.6, pab_val: 0 } },
            { id: 's5', description: 'A∪B：至少一个发生，P(A∪B)=P(A)+P(B)-P(AB)', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0.2 } },
            { id: 's6', description: '对偶律：A∪B的补 = Ā∩B̄，化简利器', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0.2 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：事件是集合，运算即集合运算**

随机事件是样本空间 $\\Omega$ 的子集，事件的关系与运算完全等同于集合的关系与运算。掌握了集合语言，就掌握了事件语言。

---

**📐 事件的五种基本关系**

| 关系 | 符号 | 含义 | 文氏图特征 | 等价条件 |
|------|------|------|-----------|---------|
| 包含 | $A \\subset B$ | A发生则B必发生 | A的区域在B内 | $AB = A$ |
| 相等 | $A = B$ | A与B相互包含 | A与B完全重合 | $A \\subset B$ 且 $B \\subset A$ |
| 互斥（互不相容） | $AB = \\emptyset$ | A与B不能同时发生 | A与B无重叠 | P(AB) = 0 |
| 对立（互逆） | $B = \\bar{A}$ | B是"A不发生" | B = Ω减去A | $A \\cup B = \\Omega$ 且 $AB = \\emptyset$ |
| 独立 | — | A的发生不影响B的概率 | 无特殊几何特征 | P(AB) = P(A)P(B) |

**互斥 vs 对立——最容易混淆的概念**：

- **对立 ⟹ 互斥**，但**互斥 ⟹̸ 对立**
- 对立要求 $A \\cup B = \\Omega$ 且 $AB = \\emptyset$（两条件缺一不可）
- 互斥只要求 $AB = \\emptyset$

**举例**：掷骰子，A={1}，B={2}，则A与B互斥但不对立（A∪B={1,2}≠Ω={1,2,3,4,5,6}）

**独立 vs 互斥——又一个易混淆点**：
- 若 P(A)>0 且 P(B)>0，则**独立与互斥不能同时成立**！
- 互斥：AB=∅ → P(AB)=0 ≠ P(A)P(B) > 0
- 独立：P(AB)=P(A)P(B) > 0 → AB≠∅

---

**📐 事件的三种运算**

| 运算 | 符号 | 含义 | 等价表述 |
|------|------|------|---------|
| 并（和） | $A \\cup B$ | A与B至少一个发生 | "或"逻辑 |
| 交（积） | $A \\cap B = AB$ | A与B同时发生 | "且"逻辑 |
| 差 | $A - B$ | A发生但B不发生 | $A\\bar{B} = A - AB$ |

**差事件的要点**：
$$A - B = A\\bar{B} = A - AB$$

注意 $A - B \\neq \\bar{B}$！$A - B$ 是"在A的那部分中，去掉与B重叠的部分"。

---

**📐 对偶律（德摩根律）——最重要的运算律**

$$\\overline{A \\cup B} = \\bar{A} \\cap \\bar{B}$$
$$\\overline{A \\cap B} = \\bar{A} \\cup \\bar{B}$$

**口诀**：长杠变短杠，∪变∩，∩变∪

**推广到 n 个事件**：
$$\\overline{\\bigcup_{i=1}^{n} A_i} = \\bigcap_{i=1}^{n} \\bar{A_i}, \\quad \\overline{\\bigcap_{i=1}^{n} A_i} = \\bigcup_{i=1}^{n} \\bar{A_i}$$

对偶律的威力：将"并的补"转化为"补的交"，在独立性条件下可以化为乘积！

---

**📐 事件运算的完整规律**

| 规律 | 公式 |
|------|------|
| 交换律 | $A \\cup B = B \\cup A$，$AB = BA$ |
| 结合律 | $(A \\cup B) \\cup C = A \\cup (B \\cup C)$ |
| 分配律 | $A(B \\cup C) = AB \\cup AC$，$A \\cup (BC) = (A \\cup B)(A \\cup C)$ |
| 对偶律 | $\\overline{A \\cup B} = \\bar{A} \\cap \\bar{B}$ |

---

**⚠️ 常见误区**

**误区1**："互斥就是对立"
- **纠正**：互斥只要求AB=∅，对立还要求A∪B=Ω。如掷骰子A={1}，B={2}互斥但不对立

**误区2**："A-B等于Ā"
- **纠正**：A-B = A∩B̄，是"A发生且B不发生"，不是"A不发生"

**误区3**："独立和互斥差不多"
- **纠正**：在P(A)>0, P(B)>0时，独立与互斥互斥！互斥意味着不可能同时发生，独立意味着互不影响`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：对偶律的深刻意义与布尔代数**

对偶律揭示了"至少一个不发生" = "不都发生"的等价关系。这不仅仅是计算技巧，而是反映了逻辑中的**对偶原理**。

在概率计算中，计算 $P(A_1 \\cup A_2 \\cup \\cdots \\cup A_n)$ 常常很复杂（需要容斥原理），但通过对偶律转化为：
$$P(\\overline{A_1 \\cup A_2 \\cup \\cdots \\cup A_n}) = P(\\bar{A}_1 \\cap \\bar{A}_2 \\cap \\cdots \\cap \\bar{A}_n)$$

当事件独立时，右侧可分解为乘积 $P(\\bar{A}_1)P(\\bar{A}_2) \\cdots P(\\bar{A}_n)$，大幅简化计算。

事件的关系与运算本质上构成一个**布尔代数**：与（交）、或（并）、非（补）三种运算满足交换律、分配律、对偶律。这与逻辑学中的命题演算、数字电路中的门电路是同构的数学结构。`,
      extension: `**🚀 事件域（σ-代数）的严格定义**

严格的概率论中，并非Ω的所有子集都能作为事件。只有满足以下三条的集类ℱ才是事件域：
1. Ω∈ℱ
2. A∈ℱ ⟹ Ā∈ℱ（对补封闭）
3. A₁,A₂,...∈ℱ ⟹ ∪Aᵢ∈ℱ（对可列并封闭）

由1和2得∅∈ℱ；由2和3得ℱ对可列交也封闭。这保证了事件经过并、交、差、补运算后仍是事件。`,
      further: [
        { id: 'f1', title: '对偶律的n事件推广', content: 'n个事件的对偶律：\n$$\\overline{\\bigcup_{i=1}^n A_i} = \\bigcap_{i=1}^n \\bar{A}_i$$\n$$\\overline{\\bigcap_{i=1}^n A_i} = \\bigcup_{i=1}^n \\bar{A}_i$$\n\n在独立性条件下，这是化简概率计算的关键工具。典型应用：\n"至少一个发生" = 1 - "全都不发生" = 1 - ∏P(Āᵢ)' },
        { id: 'f2', title: '事件运算与逻辑推理', content: '事件的运算与逻辑推理有深刻的对应关系：\n\n| 事件运算 | 逻辑含义 | 集合运算 |\n|---------|---------|--------|\n| A∪B | A或B | 并集 |\n| AB | A且B | 交集 |\n| Ā | 非A | 补集 |\n| A-B | A且非B | 差集 |\n| A⊂B | A蕴含B | 子集 |\n\n理解这种对应，可以将日常语言的"或""且""非"精确翻译为数学表达式。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '电路可靠性——串并联与事件运算',
        description: `**问题背景**

串联系统：所有元件正常工作系统才工作
并联系统：至少一个元件正常工作系统就工作

**事件表示**

设 $A_i$ = "第i个元件正常"

- 串联：系统正常 = $A_1 A_2 \\cdots A_n$（所有事件同时发生 = 交）
- 并联：系统正常 = $A_1 \\cup A_2 \\cup \\cdots \\cup A_n$（至少一个发生 = 并）

**概率计算**

若各元件独立，可靠度分别为 $p_i$：
- 串联：$P = p_1 p_2 \\cdots p_n$
- 并联：$P = 1 - (1-p_1)(1-p_2) \\cdots (1-p_n)$（用对偶律！）

**实例**：3个元件，可靠度均为0.9
- 串联：P = 0.9³ = 0.729
- 并联：P = 1 - 0.1³ = 0.999`,
        scenario: '调整各元件可靠度，观察串并联系统的整体可靠度。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '用事件运算表示复合事件',
        description: `**问题**

掷一颗骰子，设 A = {出现偶数} = {2,4,6}，B = {点数≤3} = {1,2,3}。用集合运算表示下列事件：

**解**

1. $A \\cup B = \\{1,2,3,4,6\\}$（偶数或不超过3点）
2. $AB = \\{2\\}$（偶数且不超过3点 = 只有2）
3. $A - B = \\{4,6\\}$（偶数但超过3点）
4. $B - A = \\{1,3\\}$（不超过3点但不是偶数）
5. $\\bar{A} = \\{1,3,5\\}$（奇数）
6. $\\overline{A \\cup B} = \\bar{A} \\cap \\bar{B} = \\{5\\}$（对偶律验证：既非偶数又超过3点 = 只有5）

**对偶律验证**：$A \\cup B$ 的补 = $\\{1,2,3,4,6\\}$ 的补 = $\\{5\\}$ = $\\bar{A} \\cap \\bar{B}$ ✓`,
        scenario: '调整事件A和B的定义，观察各运算结果。',
      },
    ],
    method: [
      { number: 1, title: '用集合运算表示事件', description: `①根据题意，用基本事件的并、交、差、补表示目标事件\n②"A且B" = AB，"A或B" = A∪B，"A不发生" = Ā\n③"A发生B不发生" = A-B = ABar{B}\n④遇到复杂的"至少一个"用对偶律转化为"全都不"的补` },
      { number: 2, title: '利用对偶律化简', description: `①目标事件含"并的补"或"交的补"时，优先用对偶律\n②对偶律将∪变∩、∩变∪，配合独立性可化乘积\n③常用：P(A∪B) = 1-P(ĀB̄)\n④n个事件"至少一个发生"：P(∪Aᵢ) = 1-∏P(Āᵢ)` },
      { number: 3, title: '互斥与对立的判断方法', description: `①先检查AB=∅（互斥条件）\n②再检查A∪B=Ω（对立额外条件）\n③互斥是"不能同时"，对立是"非此即彼"\n④注意：P(A)>0, P(B)>0时，独立与互斥矛盾` },
    ],
  },
}

const probabilityAxiomPoint: KnowledgePoint = {
  id: 'probability-axiom',
  moduleId: 'probability-events',
  name: '概率的公理化定义与性质',
  formula: 'P(A \\cup B) = P(A) + P(B) - P(AB)',
  coreSentence: '概率的三条公理构建了整个概率大厦——加法公式是最常用的推论。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'pa', x: 0.3, y: 0.5, draggable: false, color: '#C62828', label: 'A' },
          { id: 'pb', x: 0.7, y: 0.5, draggable: false, color: '#1565C0', label: 'B' },
        ],
        sliders: [
          { id: 'pa_val', name: 'pa_val', min: 0, max: 1, step: 0.01, defaultValue: 0.4, label: 'P(A)' },
          { id: 'pb_val', name: 'pb_val', min: 0, max: 1, step: 0.01, defaultValue: 0.5, label: 'P(B)' },
          { id: 'pab_val', name: 'pab_val', min: 0, max: 0.5, step: 0.01, defaultValue: 0.2, label: 'P(AB)' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '加法公式与性质动态演示',
          type: 'step',
          steps: [
            { id: 's1', description: '初始：P(A)=0.4, P(B)=0.5, P(AB)=0.2', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0.2 } },
            { id: 's2', description: '加法公式：P(A∪B) = 0.4+0.5-0.2 = 0.7', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0.2 } },
            { id: 's3', description: '逆事件：P(Ā) = 1-0.4 = 0.6', changes: { pa_val: 0.4, pb_val: 0.6, pab_val: 0 } },
            { id: 's4', description: '互斥时：P(AB)=0, P(A∪B)=0.4+0.5=0.9', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0 } },
            { id: 's5', description: '包含时：A⊂B, P(A∪B)=P(B)=0.5', changes: { pa_val: 0.3, pb_val: 0.5, pab_val: 0.3 } },
            { id: 's6', description: '差事件：P(A-B)=P(A)-P(AB)=0.4-0.2=0.2', changes: { pa_val: 0.4, pb_val: 0.5, pab_val: 0.2 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：三条公理构建概率大厦**

柯尔莫哥洛夫（Kolmogorov）的公理化定义，把"可能性"从模糊直觉变成了精确的数学对象。就像欧几里得用5条公理建立几何学一样，柯尔莫哥洛夫用3条公理建立了整个概率论。

---

**📐 概率的三条公理**

设 $\\Omega$ 为样本空间，$\\mathcal{F}$ 为事件域，$P$ 为定义在 $\\mathcal{F}$ 上的实值函数，满足：

| 公理 | 内容 | 直觉含义 |
|------|------|---------|
| 非负性 | 对任意事件 $A$，$P(A) \\geq 0$ | 可能性不能为负 |
| 规范性 | $P(\\Omega) = 1$ | 必然事件概率为1 |
| 可列可加性 | 若 $A_1, A_2, \\cdots$ 两两互不相容，则 $P\\left(\\bigcup_{i=1}^{\\infty} A_i\\right) = \\sum_{i=1}^{\\infty} P(A_i)$ | 互斥事件概率可加 |

**注意**：可列可加性是"可列无穷"个互斥事件，比有限可加性更强。由可列可加性可以推出有限可加性，反之不行。

---

**📐 由公理推导的重要性质**

| 性质 | 公式 | 推导思路 |
|------|------|---------|
| 不可能事件 | $P(\\emptyset) = 0$ | $\\emptyset = \\Omega \\cup \\emptyset$，且互斥 |
| 逆事件（补事件） | $P(\\bar{A}) = 1 - P(A)$ | $A \\cup \\bar{A} = \\Omega$，且互斥 |
| 有限可加性 | $A_1, \\cdots, A_n$ 互斥 → $P(\\cup A_i) = \\sum P(A_i)$ | 可列可加性的特例 |
| 包含关系 | $A \\subset B \\Rightarrow P(A) \\leq P(B)$ | $B = A \\cup (B-A)$，且互斥 |
| 有界性 | $0 \\leq P(A) \\leq 1$ | 非负性 + 包含 $\\emptyset \\subset A \\subset \\Omega$ |
| 差事件公式 | $P(A-B) = P(A) - P(AB)$ | $A = (AB) \\cup (A-B)$，且互斥 |

---

**📐 加法公式——最常用的推论**

**两事件加法公式**：
$$P(A \\cup B) = P(A) + P(B) - P(AB)$$

**直觉理解**：直接相加 $P(A) + P(B)$ 会把重叠部分 $P(AB)$ 算了两次，所以减去一次。

**三事件加法公式**：
$$P(A \\cup B \\cup C) = P(A) + P(B) + P(C) - P(AB) - P(AC) - P(BC) + P(ABC)$$

**规律**：奇数个交取正号，偶数个交取负号（这就是**容斥原理**）。

**互斥时的简化**：若 $A_1, A_2, \\cdots, A_n$ 两两互斥，则
$$P(A_1 \\cup A_2 \\cup \\cdots \\cup A_n) = \\sum_{i=1}^n P(A_i)$$

**减法公式**：
$$P(A - B) = P(A) - P(AB)$$

当 $B \\subset A$ 时，简化为 $P(A - B) = P(A) - P(B)$。

---

**📐 概率的连续性**

若 $A_1 \\subset A_2 \\subset \\cdots$（单调增），则 $P\\left(\\bigcup_{n=1}^{\\infty} A_n\\right) = \\lim_{n \\to \\infty} P(A_n)$

若 $A_1 \\supset A_2 \\supset \\cdots$（单调减），则 $P\\left(\\bigcap_{n=1}^{\\infty} A_n\\right) = \\lim_{n \\to \\infty} P(A_n)$

这是可列可加性的推论，在极限理论中有重要应用。

---

**⚠️ 常见误区**

**误区1**："P(A∪B) = P(A) + P(B)总是成立"
- **纠正**：只有A与B互斥时才成立！一般情况下要减去P(AB)

**误区2**："P(A) > P(B)意味着A包含B"
- **纠正**：概率大不代表包含，P(A)≤P(B)只由A⊂B推出，反向不成立

**误区3**："P(A-B) = P(A) - P(B)"
- **纠正**：一般形式是P(A-B) = P(A) - P(AB)，只有B⊂A时才简化为P(A)-P(B)`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：公理化的力量与容斥原理**

柯尔莫哥洛夫公理体系将概率论从"频率直觉"提升为严格的数学理论，就像欧几里得公理化几何一样。三条简洁的公理，足以推导出所有概率性质。

加法公式本质是**容斥原理**在概率上的体现：直接相加会重复计算重叠部分，需要减去。这与集合计数中的容斥原理完全一致——事实上，如果对每个事件赋予权重P(Aᵢ)，容斥原理就直接变成了概率加法公式。

公理化的深刻之处在于：它不回答"概率是什么"（哲学问题），而是规定"概率必须满足什么"（数学要求）。这种"只管行为不管本质"的思路，是现代数学的核心方法论。`,
      extension: `**🚀 从有限到可列——可列可加性的必要性**

为什么公理要求"可列可加性"而不只是"有限可加性"？

因为有限可加性无法推出连续性。例如，考虑 $B_n = (0, 1/n]$，则 $B_1 \\supset B_2 \\supset \\cdots$，且 $\\bigcap B_n = \\emptyset$。如果只有有限可加性，我们无法推出 $\\lim P(B_n) = P(\\emptyset) = 0$。而可列可加性保证了概率函数的连续性，使得极限运算在概率论中合法。`,
      further: [
        { id: 'f1', title: '容斥原理的n事件形式', content: 'n个事件并的概率 = ΣP(Aᵢ) - ΣP(AᵢAⱼ) + ΣP(AᵢAⱼAₖ) - ... + (-1)ⁿ⁺¹P(A₁A₂...Aₙ)\n\n这是加法公式的一般化，也称为容斥原理（Inclusion-Exclusion Principle）。\n\n符号规律：\n- 取k个事件的交，符号为(-1)ᵏ⁺¹\n- 单项ΣP(Aᵢ)取正号\n- 两两交ΣP(AᵢAⱼ)取负号\n- 三三交ΣP(AᵢAⱼAₖ)取正号' },
        { id: 'f2', title: '概率的频率解释与公理化定义的关系', content: '频率解释：P(A) = lim(n→∞) fₙ(A)，其中 fₙ(A) 是n次试验中A发生的频率。\n\n公理化定义不依赖频率解释，但频率的稳定性（大数定律）是公理化体系的经验基础。\n\n两者的关系：\n- 公理化定义是数学基础（先验）\n- 频率解释是物理基础（后验）\n- 大数定律是连接两者的桥梁' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '抽奖概率——先抽后抽概率相同',
        description: `**问题**

10张奖券中有3张中奖。甲先抽，乙后抽，谁的中奖概率大？

**解**

设 A = "甲中奖"，B = "乙中奖"

甲：P(A) = 3/10

乙中奖 = 甲中且乙中 + 甲不中且乙中
$$P(B) = P(A)P(B|A) + P(\\bar{A})P(B|\\bar{A})$$
$$= \\frac{3}{10} \\cdot \\frac{2}{9} + \\frac{7}{10} \\cdot \\frac{3}{9} = \\frac{6}{90} + \\frac{21}{90} = \\frac{27}{90} = \\frac{3}{10}$$

**结论**：P(A) = P(B) = 3/10，先抽后抽概率相同！

这个结果可以推广：n个人依次抽签，每个人的中奖概率都等于中奖数/总数。`,
        scenario: '调整奖券总数和中奖数，验证先抽后抽概率相同。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '利用加法公式求复杂事件概率',
        description: `**问题**

设 P(A) = 0.4, P(B) = 0.5, P(A-B) = 0.2。求 P(Ā∪B)。

**解**

第一步：由差事件公式求 P(AB)
$$P(A-B) = P(A) - P(AB)$$
$$0.2 = 0.4 - P(AB) \\Rightarrow P(AB) = 0.2$$

第二步：求 P(A∪B)
$$P(A \\cup B) = P(A) + P(B) - P(AB) = 0.4 + 0.5 - 0.2 = 0.7$$

第三步：求 P(Ā∪B)
$$P(\\bar{A} \\cup B) = P(\\bar{A}) + P(B) - P(\\bar{A}B)$$

其中 $P(\\bar{A}) = 0.6$，$P(\\bar{A}B) = P(B) - P(AB) = 0.5 - 0.2 = 0.3$

$$P(\\bar{A} \\cup B) = 0.6 + 0.5 - 0.3 = 0.8$$

**另解**：$\\bar{A} \\cup B = \\overline{A - B} = \\overline{A\\bar{B}}$

$P(\\bar{A} \\cup B) = 1 - P(A\\bar{B}) = 1 - P(A-B) = 1 - 0.2 = 0.8$ ✓`,
        scenario: '调整P(A)、P(B)、P(AB)，观察各概率值的变化。',
      },
    ],
    method: [
      { number: 1, title: '对立事件法', description: `当直接求P(A)困难时，求P(Ā)再用P(A)=1-P(Ā)\n适用："至少一个""不全部""至少一次"等否定型事件\n关键：找到A的否定事件Ā，看Ā是否更容易计算` },
      { number: 2, title: '加法公式法', description: `求P(A∪B)时用P(A)+P(B)-P(AB)\n三事件推广时注意正负号交替：加-减+减+加\n关键：必须知道P(AB)，否则无法直接使用` },
      { number: 3, title: '差事件公式法', description: `P(A-B) = P(A) - P(AB)，当B⊂A时简化为P(A-B) = P(A)-P(B)\n常用于：已知P(A)和P(AB)，求P(A-B)\n注意：P(A-B) ≠ P(A) - P(B)（除非B⊂A）` },
    ],
  },
}

const classicalProbabilityPoint: KnowledgePoint = {
  id: 'classical-probability',
  moduleId: 'probability-events',
  name: '古典概型与排列组合',
  formula: 'P(A) = \\frac{m}{n}',
  coreSentence: '古典概型是"有限等可能"——排列组合是核心计算工具，关键是"等可能"而非"有限"。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
          { id: 'f2', expression: 'x/n_total', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 0.5, y: 0.05, draggable: false, color: '#C62828', label: 'm/n' },
        ],
        sliders: [
          { id: 'm', name: 'm', min: 1, max: 10, step: 1, defaultValue: 3, label: 'm (有利事件数)' },
          { id: 'n_total', name: 'n_total', min: 1, max: 10, step: 1, defaultValue: 10, label: 'n (总事件数)' },
          { id: 'k_draw', name: 'k_draw', min: 1, max: 5, step: 1, defaultValue: 2, label: '抽取数 k' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '古典概型经典模型',
          type: 'step',
          steps: [
            { id: 's1', description: '掷骰子：P(偶数) = 3/6 = 1/2', changes: { m: 3, n_total: 6, k_draw: 1 } },
            { id: 's2', description: '不放回抽2球：从5球抽2，P(都是红球)', changes: { m: 3, n_total: 10, k_draw: 2 } },
            { id: 's3', description: '放回抽2球：从5球有放回抽2，P(都是红球)', changes: { m: 9, n_total: 25, k_draw: 2 } },
            { id: 's4', description: '排列问题：3人坐5椅，P(坐前3椅)', changes: { m: 6, n_total: 60, k_draw: 3 } },
            { id: 's5', description: '组合问题：从10人中选3人，P(含特定人)', changes: { m: 36, n_total: 120, k_draw: 3 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：有限+等可能=古典概型**

古典概型是最早被系统研究的概率模型。它的核心是两个条件：**有限性**（样本点个数有限）和**等可能性**（每个样本点概率相同）。满足这两个条件后，概率计算就化为计数问题——排列与组合。

---

**📐 古典概型的定义与条件**

若随机试验满足：
1. **有限性**：样本空间 $\\Omega$ 只有有限个样本点
2. **等可能性**：每个样本点出现的概率相等

则称此概率模型为**古典概型**（等可能概型），此时：
$$P(A) = \\frac{A\\text{包含的样本点数}}{\\Omega\\text{中样本点总数}} = \\frac{m}{n}$$

**注意**：等可能性是本质条件！如果样本空间有限但样本点不等可能，则不是古典概型。

---

**📐 排列数与组合数**

**排列数**（有序选取）：从 n 个不同元素中取 k 个**有序排列**，方法数为：
$$P_n^k = A_n^k = \\frac{n!}{(n-k)!}$$

**组合数**（无序选取）：从 n 个不同元素中取 k 个**无序组合**，方法数为：
$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$

**关系**：$A_n^k = C_n^k \\cdot k!$（先选再排 = 选出后排列）

**组合数的性质**：
- $C_n^k = C_n^{n-k}$（对称性）
- $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$（杨辉三角递推）
- $\\sum_{k=0}^{n} C_n^k = 2^n$（二项式定理）

---

**📐 抽球模型的三种情形详解**

袋中有 $a$ 个红球、$b$ 个白球，从中取 $k$ 个，求取到 $i$ 个红球的概率 $P$：

**情形1：不放回无序**（最常用）

每次取球后不放回，且不考虑取出顺序。总数和有利数都用组合数：

$$n = C_{a+b}^k, \\quad m = C_a^i \\cdot C_b^{k-i}$$

$$P = \\frac{C_a^i \\cdot C_b^{k-i}}{C_{a+b}^k}$$

> 这就是**超几何分布**的概率公式。

**情形2：不放回有序**

每次取球后不放回，但考虑取出顺序（如"依次抽取"）。总数和有利数都用排列数：

$$n = A_{a+b}^k, \\quad P = \\frac{A_a^i \\cdot A_b^{k-i} \\cdot C_k^i}{A_{a+b}^k}$$

> 可以证明：情形1和情形2计算出的概率完全相同！"有序"与"无序"的选取对概率无影响，关键是分子分母一致。

**情形3：有放回**

每次取球后放回，每次独立。总数用幂次：

$$n = (a+b)^k, \\quad m = C_k^i \\cdot a^i \\cdot b^{k-i}$$

$$P = \\frac{C_k^i \\cdot a^i \\cdot b^{k-i}}{(a+b)^k}$$

> 令 $p = \\frac{a}{a+b}$，则 $P = C_k^i p^i (1-p)^{k-i}$，这正是**二项分布**。

---

**📐 分配模型（分房问题）详解**

将 $n$ 个人分配到 $N$ 个房间中（$n \\leq N$），每人恰好住一间，求"某指定的 $n$ 间房各有一人"的概率。

- 总数：每个人有 $N$ 种选择，故 $n = N^n$
- 有利数：$n$ 个人排列到 $n$ 间房，故 $m = n!$
- 概率：$P = \\frac{n!}{N^n}$

**经典变形——生日问题**：$N = 365$，$n$ 个人中"每人生日都不同"的概率为：

$$P(\\text{都不同}) = \\frac{365 \\times 364 \\times \\cdots \\times (365-n+1)}{365^n}$$

当 $n = 23$ 时，$P(\\text{至少两人相同}) = 1 - P(\\text{都不同}) \\approx 0.507$，已超过 $1/2$！

---

**📐 重要组合恒等式**

| 恒等式 | 含义 |
|--------|------|
| $C_n^k = C_n^{n-k}$ | 对称性：选 $k$ 个等于选 $n-k$ 个留下 |
| $C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$ | 杨辉三角递推 |
| $\\sum_{k=0}^{n} C_n^k = 2^n$ | 子集总数（二项式定理取 $x=1$） |
| $C_{m+n}^k = \\sum_{i=0}^{k} C_m^i C_n^{k-i}$ | 范德蒙德卷积 |

---

**⚠️ 常见误区**

**误区1**："样本空间不同，结果就不同"
- **纠正**：古典概型中，样本空间的选择可以不同，但"等可能"的要求决定了选法。掷两枚硬币，不能选 Ω={0正,1正,2正}，因为不等可能

**误区2**："排列组合分不清"
- **纠正**：问"选出来"→组合，问"排成一排"→排列。关键词：有序用排列，无序用组合

**误区3**："放回和不放回差不多"
- **纠正**：放回时总数是幂次，不放回时总数是排列/组合数。放回的概率计算更简单，但不放回更常见

**误区4**："分房问题中房间数量不影响结果"
- **纠正**：房间数 $N$ 越大，"每房至多一人"的概率越小。分房问题的核心是"总数 $= N^n$"`,
      highlights: [
        { start: 0, end: 40, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：等可能性——古典概型的灵魂**

古典概型的本质不在于"有限"，而在于"等可能"。有限性只是保证了计数的可行性，而等可能性才是概率均匀分布的根源。

等可能性的判断是建模的艺术：
- 掷一颗均匀骰子，6个面等可能 → 古典概型
- 掷一颗偏心骰子，6个面不等可能 → 不是古典概型
- 掷两颗均匀骰子，"点数之和"不等可能 → 不能直接以和作为样本空间

这就是为什么在掷两枚硬币时，必须选 Ω={(正,正),(正,反),(反,正),(反,反)} 而非 Ω={0正,1正,2正}——前者等可能，后者不等可能（1正是两个样本点的并）。

排列组合是古典概型的计算工具，但不是古典概型本身。理解等可能性，才能正确建模。`,
      extension: `**🚀 超几何分布——古典概型的概率分布**

从含 $a$ 个红球、$b$ 个白球的袋中不放回取 $n$ 个，取到 $k$ 个红球的概率：
$$P(X=k) = \\frac{C_a^k \\cdot C_b^{n-k}}{C_{a+b}^n}$$

这就是**超几何分布**。当 $a+b$ 很大、$n$ 相对很小时，超几何分布近似二项分布。`,
      further: [
        { id: 'f1', title: '排列组合的常见技巧', content: '**1. 捆绑法**：k个人必须相邻 → 视为一个整体，再排列\n整体数：(n-k+1)! × k!\n\n**2. 插空法**：k个人互不相邻 → 先排其他人，再插空\n插空位有(n-k+1)个，选k个位置排列\n\n**3. 隔板法**：n个相同物品分给k个人，每人至少1个\nC(n-1, k-1)\n\n**4. 容斥原理计数**：|A∪B| = |A|+|B|-|A∩B|' },
        { id: 'f2', title: '古典概型与统计概率的关系', content: '古典概型是先验概率（由对称性推理得出），统计概率是后验概率（由频率估计得出）。\n\n当试验可以重复大量进行时，古典概型的概率值与统计频率在大数定律意义下趋于一致，这是两种定义统一的数学基础。\n\n但对于"明天是否下雨"这类无法精确重复的试验，古典概型不适用，只能用统计方法。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '生日问题——概率的反直觉',
        description: `**问题**

一个房间中至少需要多少人，才能使"至少两人生日相同"的概率超过1/2？（假设一年365天，生日均匀分布）

**解**

直接计算"至少两人相同"很复杂，用对立事件：

"至少两人相同"的对立 = "所有人生日都不同"

$$P(\\text{都不同}) = \\frac{365 \\times 364 \\times \\cdots \\times (365-n+1)}{365^n}$$

计算结果：

| n（人数） | P(至少两人生日相同) |
|-----------|------------------|
| 10 | 0.117 |
| 23 | 0.507 |
| 30 | 0.706 |
| 50 | 0.970 |
| 70 | 0.999 |

**惊人的结论**：仅需23人，概率就超过1/2！这大大违反直觉。

**原理**：$C_{23}^2 = 253$ 对两两比较，远多于直觉的估计。`,
        scenario: '调整人数n，观察"至少两人生日相同"概率的急剧增长。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '不放回抽球与放回抽球的比较',
        description: `**问题**

袋中有5个红球、3个白球，从中取2个。分别求不放回和放回时"恰好1红1白"的概率。

**解**

**不放回**：
- 总数：$C_8^2 = 28$
- 有利数：$C_5^1 \\cdot C_3^1 = 15$
- $P = 15/28 \\approx 0.536$

**放回**：
- 总数：$8 \\times 8 = 64$
- 有利数："先红后白" + "先白后红" = $5 \\times 3 + 3 \\times 5 = 30$
- $P = 30/64 = 15/32 \\approx 0.469$

**对比**：不放回的概率略高！因为第一次取走一个球后，第二次取到不同颜色球的概率增大了。`,
        scenario: '调整红球数、白球数和抽取数，对比两种抽法。',
      },
    ],
    method: [
      { number: 1, title: '古典概型三步法', description: `①确认等可能性：检查样本空间中每个样本点是否等可能\n②数总数n：用排列组合计算样本空间大小\n③数有利数m：用排列组合计算事件A包含的样本点数\n④P(A) = m/n` },
      { number: 2, title: '有序vs无序判断法', description: `①问题含"依次""先后""排成一排"→有序→用排列数\n②问题含"选出""取出""抽取"无序→用组合数\n③放回问题：总数用幂次，有利数用二项展开\n④不放回问题：总数用排列/组合，有利数用分步计数` },
      { number: 3, title: '复杂事件分解法', description: `①将复杂事件分解为互斥的简单事件之并\n②分别计算每个简单事件的概率\n③用加法公式求和\n④或用对立事件法：P(A) = 1-P(Ā)` },
    ],
  },
}

const geometricProbabilityPoint: KnowledgePoint = {
  id: 'geometric-probability',
  moduleId: 'probability-events',
  name: '几何概型',
  formula: 'P(A) = \\frac{S_A}{S_\\Omega}',
  coreSentence: '几何概型是"无限等可能"——概率等于有利区域与样本区域的几何度量之比。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
          { id: 'f2', expression: 'min(x, y)/10', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 0.3, y: 0.3, draggable: true, color: '#C62828', label: '(x,y)' },
          { id: 'p2', x: 0.7, y: 0.7, draggable: true, color: '#1565C0', label: '(a,b)' },
        ],
        sliders: [
          { id: 't1', name: 't1', min: 0, max: 60, step: 1, defaultValue: 30, label: '甲到达时间（分钟）' },
          { id: 't2', name: 't2', min: 0, max: 60, step: 1, defaultValue: 40, label: '乙到达时间（分钟）' },
          { id: 'wait', name: 'wait', min: 0, max: 30, step: 1, defaultValue: 15, label: '等待时间阈值（分钟）' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '会面问题动态演示',
          type: 'step',
          steps: [
            { id: 's1', description: '甲乙约定12:00-13:00内到达', changes: { t1: 30, t2: 40, wait: 15 } },
            { id: 's2', description: '等待阈值15分钟：|t₁-t₂|≤15则相遇', changes: { t1: 20, t2: 25, wait: 15 } },
            { id: 's3', description: '有利区域面积 = 1-2×(45/60)²×0.5 = 7/16', changes: { t1: 30, t2: 30, wait: 15 } },
            { id: 's4', description: '等待阈值20分钟：|t₁-t₂|≤20', changes: { t1: 30, t2: 30, wait: 20 } },
            { id: 's5', description: '有利区域面积 = 1-2×(40/60)²×0.5 = 5/9', changes: { t1: 30, t2: 30, wait: 20 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：当样本点无限时，概率化为几何度量之比**

古典概型要求样本点有限，但很多实际问题中样本点是不可列无限的（如"在区间上随机取一点"）。几何概型将"等可能性"推广到连续空间——概率等于有利区域与样本区域的**几何度量**（长度/面积/体积）之比。

---

**📐 几何概型的定义**

若随机试验满足：
1. **无限性**：样本空间 $\\Omega$ 是一个可度量的几何区域
2. **等可能性**：样本点落在 $\\Omega$ 中任何等度量区域内的概率相等

则称此概率模型为**几何概型**，此时：
$$P(A) = \\frac{A\\text{的几何度量}}{\\Omega\\text{的几何度量}} = \\frac{S_A}{S_\\Omega}$$

其中"几何度量"可以是：
- **一维**：长度（如在线段上取点）
- **二维**：面积（如在矩形上取点）
- **三维**：体积（如在立方体上取点）

---

**📐 经典问题：会面问题的完整解答**

甲乙约定在12:00-13:00之间到达某地，先到者等 $t$ 分钟后离去。求两人能会面的概率。

**建模**：
- 设甲到达时间为 $x$，乙到达时间为 $y$，均以分钟为单位
- 样本空间：$\\Omega = \\{(x,y) : 0 \\leq x \\leq 60, 0 \\leq y \\leq 60\\}$（正方形，面积 $S_\\Omega = 3600$）
- 会面条件：$|x - y| \\leq t$

**计算**（以 $t = 15$ 为例）：

不利区域是正方形中 $|x-y| > 15$ 的两个直角三角形，每个三角形的直角边长为 $60 - 15 = 45$。

$$P = \\frac{S_\\Omega - 2 \\times \\frac{1}{2} \\times 45^2}{S_\\Omega} = \\frac{3600 - 2025}{3600} = \\frac{1575}{3600} = \\frac{7}{16} \\approx 0.4375$$

**一般公式**：若等待时间为 $t$（$0 < t \\leq 60$），则

$$P = \\frac{60^2 - (60-t)^2}{60^2} = 1 - \\left(1 - \\frac{t}{60}\\right)^2$$

| 等待时间 $t$ | 会面概率 $P$ |
|-------------|------------|
| 10分钟 | $1-(5/6)^2 \\approx 0.306$ |
| 15分钟 | $7/16 \\approx 0.438$ |
| 20分钟 | $5/9 \\approx 0.556$ |
| 30分钟 | $3/4 = 0.750$ |
| 60分钟 | $1$（必然会面）|

---

**📐 蒲丰投针问题的详细推导**

平面上画有间距为 $d$ 的平行线，投一根长为 $l$（$l < d$）的针，求针与线相交的概率。

**建模**：针的位置由两个量确定：
- $x$：针的中点到最近平行线的距离，$x \\in [0, d/2]$
- $\\theta$：针与平行线的夹角，$\\theta \\in [0, \\pi]$

样本空间为矩形 $[0, d/2] \\times [0, \\pi]$，面积为 $\\frac{d}{2} \\cdot \\pi$。

**相交条件**：针与线相交 $\\Leftrightarrow$ $x \\leq \\frac{l}{2} \\sin\\theta$

**有利区域面积**：

$$S_A = \\int_0^{\\pi} \\frac{l}{2}\\sin\\theta \\, d\\theta = \\frac{l}{2} \\cdot [-\\cos\\theta]_0^{\\pi} = \\frac{l}{2} \\cdot 2 = l$$

**概率**：

$$P = \\frac{S_A}{S_\\Omega} = \\frac{l}{\\frac{d}{2} \\cdot \\pi} = \\frac{2l}{\\pi d}$$

> **妙用**：当 $l = d/2$ 时，$P = 1/\\pi$。通过大量投针统计相交频率 $f$，可以估计 $\\pi \\approx 1/f$。这是蒙特卡洛方法的早期范例！

---

**📐 贝特朗悖论——三种解法的完整分析**

**问题**：在单位圆上任作一条弦，求弦长超过 $\\sqrt{3}$ 的概率。

**解法1**（P = 1/3）：固定弦的一个端点，另一端点在圆周上均匀分布

弦长 $> \\sqrt{3}$ $\\Leftrightarrow$ 另一端点在 $120°$ 弧上（因为正三角形对应的圆心角为 $120°$）

$$P = \\frac{120°}{360°} = \\frac{1}{3}$$

**解法2**（P = 1/2）：弦的中点在直径上均匀分布

弦长 $> \\sqrt{3}$ $\\Leftrightarrow$ 中点到圆心距离 $< 1/2$（因为弦长 $= 2\\sqrt{1-r^2}$，令 $2\\sqrt{1-r^2} > \\sqrt{3}$ 得 $r < 1/2$）

$$P = \\frac{1/2}{1} = \\frac{1}{2}$$

**解法3**（P = 1/4）：弦的中点在圆面上均匀分布

弦长 $> \\sqrt{3}$ $\\Leftrightarrow$ 中点在内圆（半径 $1/2$）内

$$P = \\frac{\\pi(1/2)^2}{\\pi \\cdot 1^2} = \\frac{1}{4}$$

**核心启示**：三种解法都"合理"，但"等可能"的对象不同——端点、中点在直径上、中点在圆面上。不同的等可能假设对应不同的概率分布，建模时**必须明确"什么等可能"**。

---

**📐 几何概型的注意事项**

1. **样本空间的选取影响概率**：贝特朗悖论已说明，同一问题不同的"等可能"假设导致不同结果
2. **概率为零不等于不可能**：几何概型中，单点概率为零，但事件仍可能发生
3. **维数要匹配**：一维问题用长度比，二维用面积比，三维用体积比，不可混淆
4. **有利区域的确定要画图**：尤其是会面问题这类涉及不等式约束的，画图是确定积分区域的最可靠方法

---

**⚠️ 常见误区**

**误区1**："几何概型就是算面积比"
- **纠正**：也可能是一维的长度比或三维的体积比，取决于问题的维数

**误区2**："会面问题中两人到达时间相互影响"
- **纠正**：甲乙到达时间相互独立，样本空间是正方形而非三角形

**误区3**："几何概型总能给出唯一答案"
- **纠正**：贝特朗悖论表明，不同的等可能假设导致不同结果，建模时必须明确`,
      highlights: [
        { start: 0, end: 40, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：从离散到连续——等可能性的推广**

几何概型是古典概型从"离散"到"连续"的自然推广：

| 特征 | 古典概型 | 几何概型 |
|------|---------|---------|
| 样本空间 | 有限集合 | 几何区域 |
| 等可能性 | 每个样本点等可能 | 每个等度量子区域等可能 |
| 概率计算 | 计数之比 | 几何度量之比 |
| 基本事件概率 | $1/n > 0$ | $0$（单个点测度为零） |

几何概型中基本事件的概率为零，这是与古典概型最根本的区别。这意味着"恰好取到某个特定点"的概率为零，但"取到某个区间内的点"概率可以非零。这种"零概率但不是不可能事件"的现象，是连续概率空间的核心特征。

贝特朗悖论揭示的深刻问题：**在连续空间中，"等可能"不再是唯一的，必须指定等可能的参照（端点？中点？角度？），这本质上是在选择概率分布。**`,
      extension: `**🚀 均匀分布——几何概型的概率分布**

几何概型中的等可能性，对应**均匀分布**：
- 一维：$X \\sim U(a,b)$，概率密度 $f(x) = \\frac{1}{b-a}$，$x \\in [a,b]$
- 二维：$(X,Y) \\sim U(D)$，概率密度 $f(x,y) = \\frac{1}{S_D}$，$(x,y) \\in D$

均匀分布是几何概型的数学表述，它的"等可能性"体现为：落在任何等度量子区域内的概率只与该子区域的度量成正比。`,
      further: [
        { id: 'f1', title: '贝特朗悖论的详细分析', content: '三种解法的根本差异在于"等可能"的对象不同：\n\n**解法1**（P=1/3）：固定弦的一个端点，另一端点在圆周上均匀分布\n弦长>√3 ↔ 另一端点在120°弧上 ↔ 120/360 = 1/3\n\n**解法2**（P=1/2）：弦中点在直径上均匀分布\n弦长>√3 ↔ 中点在内半圆（距圆心<1/2）↔ 1/2\n\n**解法3**（P=1/4）：弦中点在圆面上均匀分布\n弦长>√3 ↔ 中点在内圆（半径1/2）↔ π(1/2)²/π = 1/4\n\n三种假设都是合理的，对应三种不同的随机化方式。这告诉我们：几何概型的建模必须精确描述"什么在什么上均匀分布"。' },
        { id: 'f2', title: '蒲丰投针问题', content: '**问题**：平面上画有间距为d的平行线，投一根长l(l<d)的针，求针与线相交的概率。\n\n**解**：设针中点到最近线的距离为x，针与线的夹角为θ\n- x ∈ [0, d/2]，θ ∈ [0, π]\n- 相交条件：x ≤ (l/2)sinθ\n\n$$P = \\frac{\\int_0^\\pi \\frac{l}{2}\\sin\\theta \\, d\\theta}{\\frac{d}{2} \\cdot \\pi} = \\frac{l}{\\pi d} \\cdot 2 = \\frac{2l}{\\pi d}$$\n\n这个结果可以用来**估计π**：大量投针，统计相交频率，反推π值。这是蒙特卡洛方法的早期范例！' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '会面问题——约会等待概率',
        description: `**问题**

甲乙约定在8:00-9:00之间到达某咖啡馆，先到者等20分钟后离去。求两人能会面的概率。

**解**

设甲到达时间为 $x$（8:00后第 $x$ 分钟），乙为 $y$。
- 样本空间：$\\Omega = [0,60] \\times [0,60]$，面积 $S_\\Omega = 3600$
- 会面条件：$|x - y| \\leq 20$

不利区域：两个直角三角形，直角边长 40。

$$P = \\frac{3600 - 2 \\times \\frac{1}{2} \\times 40^2}{3600} = \\frac{3600 - 1600}{3600} = \\frac{2000}{3600} = \\frac{5}{9}$$

**结论**：等待20分钟时，会面概率为5/9 ≈ 0.556。

**变化**：若等待时间改为30分钟，则 $P = 1 - \\frac{30^2}{60^2} = \\frac{3}{4}$`,
        scenario: '调整等待时间阈值，观察会面概率的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '线段上随机取点',
        description: `**问题**

在区间 (0, 1) 上随机取两个数 $x$ 和 $y$，求 $x + y < 1$ 且 $xy > 0.1$ 的概率。

**解**

样本空间：$\\Omega = (0,1) \\times (0,1)$，面积1

条件1：$x + y < 1$ → 下方三角形，面积1/2
条件2：$xy > 0.1$ → 双曲线 $y = 0.1/x$ 上方

两个条件的交集：三角形中在双曲线上方的区域。

求交点：$x + y = 1$ 且 $xy = 0.1$ → $x(1-x) = 0.1$ → $x^2 - x + 0.1 = 0$

$x = \\frac{1 \\pm \\sqrt{0.6}}{2}$

$$P = \\int_{x_1}^{x_2} (1-x - \\frac{0.1}{x}) dx = \\left[x - \\frac{x^2}{2} - 0.1\\ln x\\right]_{x_1}^{x_2}$$

具体值取决于交点坐标，需要数值计算。`,
        scenario: '调整参数，观察概率随约束条件的变化。',
      },
    ],
    method: [
      { number: 1, title: '几何概型建模三步法', description: `①确定样本空间Ω的几何区域（线段/矩形/圆/空间体）\n②将事件A的条件转化为几何区域（不等式围成的区域）\n③P(A) = A的度量/Ω的度量（长度/面积/体积之比）` },
      { number: 2, title: '会面问题通用解法', description: `①设两人的到达时间为x, y，确定样本空间[0,T]×[0,T]\n②将"相遇"条件转化为|t₁-t₂|≤Δ（等待时间）\n③不利区域是正方形两个角的三角形\n④P = 1 - 2×(T-Δ)²/(2T²) = 1 - ((T-Δ)/T)²` },
    ],
  },
}

const conditionalProbabilityPoint: KnowledgePoint = {
  id: 'conditional-probability',
  moduleId: 'probability-events',
  name: '条件概率与乘法公式',
  formula: 'P(A|B) = \\frac{P(AB)}{P(B)}',
  coreSentence: '条件概率是"已知B发生后，A的概率"——本质是将样本空间从Ω缩小到B。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'omega', x: 0.5, y: 0.5, draggable: false, color: '#5D4037', label: 'Ω' },
          { id: 'a', x: 0.35, y: 0.4, draggable: false, color: '#C62828', label: 'A' },
          { id: 'b', x: 0.6, y: 0.55, draggable: false, color: '#1565C0', label: 'B' },
          { id: 'ab', x: 0.45, y: 0.45, draggable: false, color: '#2E7D32', label: 'AB' },
        ],
        sliders: [
          { id: 'pa', name: 'pa', min: 0.05, max: 0.95, step: 0.01, defaultValue: 0.5, label: 'P(A)' },
          { id: 'pb', name: 'pb', min: 0.05, max: 0.95, step: 0.01, defaultValue: 0.6, label: 'P(B)' },
          { id: 'pab', name: 'pab', min: 0, max: 0.5, step: 0.01, defaultValue: 0.3, label: 'P(AB)' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '条件概率：从Ω到B的缩小',
          type: 'step',
          steps: [
            { id: 's1', description: '原始样本空间Ω：P(A)=0.5, P(B)=0.6, P(AB)=0.3', changes: { pa: 0.5, pb: 0.6, pab: 0.3 } },
            { id: 's2', description: '已知B发生：样本空间缩小到B', changes: { pa: 0.5, pb: 0.6, pab: 0.3 } },
            { id: 's3', description: 'P(A|B) = P(AB)/P(B) = 0.3/0.6 = 0.5', changes: { pa: 0.5, pb: 0.6, pab: 0.3 } },
            { id: 's4', description: '乘法公式：P(AB) = P(B)P(A|B) = 0.6×0.5 = 0.3', changes: { pa: 0.5, pb: 0.6, pab: 0.3 } },
            { id: 's5', description: '独立时：P(A|B) = P(A) = 0.5', changes: { pa: 0.5, pb: 0.6, pab: 0.3 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：信息改变概率——样本空间的"缩水"**

条件概率是概率论中最重要的概念之一。当我们获得了新信息（"B已经发生"），原来的概率空间就需要更新——这就像"开灯后缩小了搜索范围"。

---

**📐 条件概率的定义**

设 $P(B) > 0$，在事件 $B$ 已发生的条件下，事件 $A$ 发生的**条件概率**定义为：
$$P(A|B) = \\frac{P(AB)}{P(B)}$$

**直觉理解**：原来我们在整个 $\\Omega$ 中考察 $A$，概率是 $\\frac{P(A)}{P(\\Omega)}$。现在已知 $B$ 发生了，我们的"视野"从 $\\Omega$ 缩小到了 $B$，所以概率变为 $\\frac{P(AB)}{P(B)}$——分子是A与B同时发生的部分，分母是B的总概率。

**关键**：$P(A|B) \\neq P(B|A)$！除非 $P(A) = P(B)$。

| 量 | 含义 | 读法 |
|----|------|------|
| $P(A)$ | A的无条件概率 | "A的概率" |
| $P(A|B)$ | 已知B发生后A的概率 | "在B条件下A的概率" |
| $P(AB)$ | A和B同时发生的概率 | "A且B的概率" |

---

**📐 条件概率的性质**

条件概率 $P(\\cdot|B)$ 满足概率的三条公理，因此也是概率！它具有概率的所有性质：

1. **非负性**：$P(A|B) \\geq 0$
2. **规范性**：$P(\\Omega|B) = 1$（注意：$P(B|B) = 1$，即在新样本空间 $B$ 中 $B$ 是必然事件）
3. **可加性**：若 $A_1, A_2$ 互斥，则 $P(A_1 \\cup A_2|B) = P(A_1|B) + P(A_2|B)$

**推论**：
- $P(\\bar{A}|B) = 1 - P(A|B)$
- $P(A_1 \\cup A_2|B) = P(A_1|B) + P(A_2|B) - P(A_1 A_2|B)$

---

**📐 乘法公式**

**两事件乘法公式**：
$$P(AB) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)$$

**多事件乘法公式**：
$$P(A_1 A_2 \\cdots A_n) = P(A_1) \\cdot P(A_2|A_1) \\cdot P(A_3|A_1 A_2) \\cdots P(A_n|A_1 A_2 \\cdots A_{n-1})$$

**直觉**：乘法公式就是"逐步缩小"——每获得一个新条件，概率空间就缩小一次。

**例题**：袋中有5个红球、3个白球，不放回取3球，求"依次取到红、白、红"的概率。

$$P = \\frac{5}{8} \\cdot \\frac{3}{7} \\cdot \\frac{4}{6} = \\frac{60}{336} = \\frac{5}{28}$$

---

**📐 条件概率的缩小样本空间理解**

计算条件概率有两种等价的方法：

| 方法 | 思路 | 适用场景 |
|------|------|---------|
| 定义法 | $P(A|B) = P(AB)/P(B)$ | 适合已知概率的题目 |
| 缩小样本空间法 | 以B为新Ω，重新计数 | 适合古典概型 |

**例**：掷骰子，已知点数>3，求点数为偶数的概率。

**定义法**：$P(A|B) = P(\\text{偶数且}>3)/P(>3) = P(\\{4,6\\})/P(\\{4,5,6\\}) = \\frac{2/6}{3/6} = \\frac{2}{3}$

**缩小样本空间法**：B已发生，新Ω = {4,5,6}，其中偶数{4,6}占2/3。

---

**⚠️ 常见误区**

**误区1**："P(A|B)就是P(AB)"
- **纠正**：P(A|B) = P(AB)/P(B)，需要除以P(B)归一化

**误区2**："P(A|B) = P(B|A)"
- **纠正**：这是最常见的错误！P(A|B)和P(B|A)一般不等，这正是贝叶斯公式的核心

**误区3**："条件概率不满足概率公理"
- **纠正**：条件概率是合法的概率，满足所有概率性质`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：信息更新概率——贝叶斯思想的萌芽**

条件概率的深刻意义在于：**概率不是固定的，而是随信息更新的**。

$P(A)$ 是我们在没有任何额外信息时对A的判断——**先验概率**。
$P(A|B)$ 是我们在获知B后对A的更新判断——**后验概率**。

从 $P(A)$ 到 $P(A|B)$ 的更新过程，就是贝叶斯推理的核心。条件概率是将先验转化为后验的数学工具。

乘法公式 $P(AB) = P(A)P(B|A) = P(B)P(A|B)$ 则揭示了"两个事件同时发生"的对称性——可以从任一事件出发，逐步缩小。

多事件乘法公式展示了概率的**链式结构**：每个新事件的发生概率，都依赖于之前所有事件的发生情况。这种依赖关系是马尔可夫链、隐马尔可夫模型等高级模型的基础。`,
      extension: `**🚀 条件概率与独立性**

$P(A|B) = P(A)$ ⟺ $P(AB) = P(A)P(B)$ ⟺ 事件A与B独立。

独立性的含义是：B的发生不改变A的概率（信息不更新概率）。这是条件概率的特殊情况——当信息"无用"时，概率不更新。`,
      further: [
        { id: 'f1', title: '条件概率的链式法则', content: '多事件乘法公式可以写成链式法则：\n\nP(A₁A₂...Aₙ) = P(A₁) × P(A₂|A₁) × P(A₃|A₁A₂) × ... × P(Aₙ|A₁...Aₙ₋₁)\n\n这是概率论中"序贯推理"的基础。在机器学习中，链式法则用于：\n- 语言模型：P(w₁w₂...wₙ) = ∏P(wᵢ|w₁...wᵢ₋₁)\n- 贝叶斯网络：联合分布分解为条件概率的乘积' },
        { id: 'f2', title: '辛普森悖论', content: '辛普森悖论是条件概率最著名的反直觉现象：\n\n在分组数据中，A组每个子组的成功率都高于B组，但合并后A组总成功率反而低于B组。\n\n**原因**：各组样本量不同，加权方式不同导致结论反转。\n\n**例子**：\n- 大医院：重症治愈率30/70=43%，轻症治愈率90/30=75%\n- 小医院：重症治愈率5/10=50%，轻症治愈率48/90=53%\n\n分组看大医院都好，合并后大医院总治愈率120/100=1.2 vs 小医院53/100=0.53...不对，正确例子需要更细致构造。\n\n核心教训：条件概率（分组看）与无条件概率（合并看）可能给出相反结论！' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '医学检测——条件概率的实际应用',
        description: `**问题**

某种疾病的患病率为1%，检测准确率为99%（即患者99%检出阳性，健康人99%检出阴性）。若某人检测为阳性，求其真正患病的概率。

**解**

设 D = "患病"，T = "检测阳性"

已知：P(D) = 0.01, P(T|D) = 0.99, P(T|D̄) = 0.01

求：P(D|T) = ?

$$P(D|T) = \\frac{P(D)P(T|D)}{P(D)P(T|D) + P(\\bar{D})P(T|\\bar{D})} = \\frac{0.01 \\times 0.99}{0.01 \\times 0.99 + 0.99 \\times 0.01} = \\frac{0.0099}{0.0099 + 0.0099} = 0.5$$

**惊人的结论**：检测准确率99%，但阳性结果只有50%概率真正患病！

**原因**：患病率太低（1%），大量假阳性稀释了真正患者。这就是**基础概率忽视**现象。`,
        scenario: '调整患病率和检测准确率，观察P(D|T)的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '不放回抽样中的条件概率',
        description: `**问题**

袋中有3个红球、2个白球，不放回取2球。已知第1个是红球，求第2个也是红球的概率。

**解法1：定义法**

$$P(\\text{第2红}|\\text{第1红}) = \\frac{P(\\text{两红})}{P(\\text{第1红})} = \\frac{\\frac{C_3^2}{C_5^2}}{\\frac{3}{5}} = \\frac{3/10}{3/5} = \\frac{1}{2}$$

**解法2：缩小样本空间法**

已知第1个是红球，剩余4球中有2红2白：
$$P(\\text{第2红}|\\text{第1红}) = \\frac{2}{4} = \\frac{1}{2}$$

**对比**：如果改为放回抽样，则 P(第2红|第1红) = 3/5 = P(第2红)——前后独立！`,
        scenario: '调整红球白球数量，观察条件概率的变化。',
      },
    ],
    method: [
      { number: 1, title: '条件概率直接计算法', description: `①确认条件事件B和目标事件A\n②求P(B)和P(AB)\n③P(A|B) = P(AB)/P(B)\n④注意：分母P(B)必须>0` },
      { number: 2, title: '缩小样本空间法', description: `①以B为新的样本空间Ω'（适用于古典概型）\n②在Ω'中重新计数A的有利事件数m'\n③P(A|B) = m'/n'（n'是Ω'的样本点总数）\n④等价于P(AB)/P(B)，但直观性更强` },
      { number: 3, title: '乘法公式应用', description: `①将目标事件分解为多个事件的交\n②P(A₁A₂...Aₙ) = P(A₁)·P(A₂|A₁)·P(A₃|A₁A₂)·...\n③每一步的条件概率更容易计算\n④关键：选择合适的分解顺序` },
    ],
  },
}

const bayesFormulaPoint: KnowledgePoint = {
  id: 'bayes-formula',
  moduleId: 'probability-events',
  name: '全概率公式与贝叶斯公式',
  formula: 'P(B_j|A) = \\frac{P(B_j)P(A|B_j)}{\\sum_{i=1}^{n} P(B_i)P(A|B_i)}',
  coreSentence: '全概率公式"由因推果"，贝叶斯公式"由果溯因"——先验与后验的桥梁。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'b1', x: 0.25, y: 0.3, draggable: false, color: '#C62828', label: 'B₁' },
          { id: 'b2', x: 0.5, y: 0.3, draggable: false, color: '#1565C0', label: 'B₂' },
          { id: 'b3', x: 0.75, y: 0.3, draggable: false, color: '#2E7D32', label: 'B₃' },
          { id: 'a', x: 0.5, y: 0.7, draggable: false, color: '#FF8F00', label: 'A' },
        ],
        sliders: [
          { id: 'pb1', name: 'pb1', min: 0.05, max: 0.9, step: 0.01, defaultValue: 0.3, label: 'P(B₁)' },
          { id: 'pb2', name: 'pb2', min: 0.05, max: 0.9, step: 0.01, defaultValue: 0.5, label: 'P(B₂)' },
          { id: 'pa_b1', name: 'pa_b1', min: 0.01, max: 0.99, step: 0.01, defaultValue: 0.8, label: 'P(A|B₁)' },
          { id: 'pa_b2', name: 'pa_b2', min: 0.01, max: 0.99, step: 0.01, defaultValue: 0.4, label: 'P(A|B₂)' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '全概率公式与贝叶斯公式',
          type: 'step',
          steps: [
            { id: 's1', description: '完备事件组：B₁, B₂互斥且P(B₁)+P(B₂)=1', changes: { pb1: 0.3, pb2: 0.7, pa_b1: 0.8, pa_b2: 0.4 } },
            { id: 's2', description: '全概率：P(A) = 0.3×0.8 + 0.7×0.4 = 0.52', changes: { pb1: 0.3, pb2: 0.7, pa_b1: 0.8, pa_b2: 0.4 } },
            { id: 's3', description: '贝叶斯：P(B₁|A) = 0.3×0.8/0.52 ≈ 0.462', changes: { pb1: 0.3, pb2: 0.7, pa_b1: 0.8, pa_b2: 0.4 } },
            { id: 's4', description: '贝叶斯：P(B₂|A) = 0.7×0.4/0.52 ≈ 0.538', changes: { pb1: 0.3, pb2: 0.7, pa_b1: 0.8, pa_b2: 0.4 } },
            { id: 's5', description: '先验→后验更新：P(B₁)=0.3→P(B₁|A)≈0.462', changes: { pb1: 0.3, pb2: 0.7, pa_b1: 0.8, pa_b2: 0.4 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：因果推理的双向桥梁**

全概率公式和贝叶斯公式是概率论中最重要的两个公式。它们解决的是因果推理的两个方向：
- **全概率公式**：由因推果——已知各种原因的概率，求结果的总概率
- **贝叶斯公式**：由果溯因——已知结果发生了，反推各原因的概率

---

**📐 完备事件组**

**定义**：若事件组 $B_1, B_2, \\cdots, B_n$ 满足：
1. $B_1, B_2, \\cdots, B_n$ 两两互斥（$B_i B_j = \\emptyset$, $i \\neq j$）
2. $B_1 \\cup B_2 \\cup \\cdots \\cup B_n = \\Omega$

则称 $B_1, B_2, \\cdots, B_n$ 为完备事件组（或样本空间的一个**分割**）。

**直观**：完备事件组就是对Ω的一个"不重不漏"的划分。

**常见例子**：
- $B$ 和 $\\bar{B}$ 构成最简单的完备事件组
- 若有三条生产线生产产品，$B_i$ = "产品来自第i条线"，则 $B_1, B_2, B_3$ 是完备事件组

---

**📐 全概率公式——由因推果**

设 $B_1, B_2, \\cdots, B_n$ 为完备事件组，且 $P(B_i) > 0$，则对任意事件 $A$：
$$P(A) = \\sum_{i=1}^{n} P(B_i) P(A|B_i)$$

**直觉**：A的发生可以按原因分类——A由原因 $B_1$ 导致的部分、由 $B_2$ 导致的部分、...。把各部分加起来就是A的总概率。

**推导**：
$$A = A\\Omega = A(B_1 \\cup B_2 \\cup \\cdots \\cup B_n) = AB_1 \\cup AB_2 \\cup \\cdots \\cup AB_n$$

由于 $B_i$ 两两互斥，$AB_i$ 也两两互斥，故：
$$P(A) = \\sum P(AB_i) = \\sum P(B_i)P(A|B_i)$$

**特殊情况**（$n=2$）：
$$P(A) = P(B)P(A|B) + P(\\bar{B})P(A|\\bar{B})$$

---

**📐 贝叶斯公式——由果溯因**

设 $B_1, B_2, \\cdots, B_n$ 为完备事件组，$P(B_i) > 0$，$P(A) > 0$，则：
$$P(B_j|A) = \\frac{P(B_j)P(A|B_j)}{\\sum_{i=1}^{n} P(B_i)P(A|B_i)}$$

**直觉**：已知A发生了（结果），求A是由原因 $B_j$ 导致的概率。

**核心思想——先验与后验**：
- $P(B_j)$：**先验概率**——在A发生之前对 $B_j$ 的估计
- $P(B_j|A)$：**后验概率**——在A发生后对 $B_j$ 的更新估计
- $P(A|B_j)$：**似然**——在 $B_j$ 下A发生的可能性

贝叶斯公式就是：**后验 = 先验 × 似然 / 归一化常数**

---

**📐 例题：产品来源追溯**

三条生产线生产同一种产品，产量分别占25%、35%、40%，次品率分别为5%、4%、2%。任取一件产品发现是次品，求它来自各条生产线的概率。

**解**：

设 $B_i$ = "产品来自第i条线"，A = "产品是次品"

先验：$P(B_1) = 0.25$, $P(B_2) = 0.35$, $P(B_3) = 0.40$

似然：$P(A|B_1) = 0.05$, $P(A|B_2) = 0.04$, $P(A|B_3) = 0.02$

全概率：$P(A) = 0.25 \\times 0.05 + 0.35 \\times 0.04 + 0.40 \\times 0.02 = 0.0345$

贝叶斯：

| 生产线 | 先验 P(Bᵢ) | 似然 P(A|Bᵢ) | 后验 P(Bᵢ|A) |
|--------|-----------|-------------|-------------|
| 1 | 0.25 | 0.05 | 0.0125/0.0345 ≈ 0.362 |
| 2 | 0.35 | 0.04 | 0.0140/0.0345 ≈ 0.406 |
| 3 | 0.40 | 0.02 | 0.0080/0.0345 ≈ 0.232 |

**结论**：虽然第3条线产量最大（40%），但次品来自它的概率最小（23.2%）——因为它的次品率最低！

---

**⚠️ 常见误区**

**误区1**："全概率公式就是加法公式"
- **纠正**：全概率公式是按完备事件组分类求和，每个项都是条件概率乘积

**误区2**："贝叶斯公式中先验不重要"
- **纠正**：先验概率直接影响后验！先验概率大的原因，即使似然较低，后验也可能不小

**误区3**："P(A|B)和P(B|A)差不多"
- **纠正**：两者差别可能巨大！贝叶斯公式正是用来计算这种转换的`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：贝叶斯革命——从频率到信念**

贝叶斯公式的深刻意义远超概率论本身：

1. **知识更新的数学框架**：贝叶斯公式给出了"用新证据更新旧信念"的严格方法。先验→后验的更新过程，正是人类学习和科学推理的数学模型。

2. **主观概率的合法性**：贝叶斯学派认为概率可以是"信念程度"（主观概率），而不仅仅是频率的极限。这使得概率论可以处理一次性事件（如"明天是否下雨"）。

3. **先验的争议**：贝叶斯方法的最大争议在于先验的选择——先验从何而来？频率学派认为这是"主观的"，贝叶斯学派则认为先验反映了"初始知识状态"，可以通过无信息先验等方法客观化。

4. **大样本下的一致性**：当数据量趋于无穷时，后验概率几乎不依赖于先验的选择——数据"淹没"了先验。这是贝叶斯方法在实践中有效的原因。`,
      extension: `**🚀 贝叶斯统计与机器学习**

贝叶斯公式是现代机器学习的基石之一：

- **朴素贝叶斯分类器**：假设特征条件独立，用贝叶斯公式分类
- **贝叶斯网络**：用有向无环图表示变量间的条件依赖关系
- **贝叶斯优化**：用高斯过程作为先验，逐步更新后验来优化目标函数
- **变分推断**：用优化方法近似后验分布

在深度学习时代，贝叶斯方法正在回归——贝叶斯神经网络、不确定性量化、主动学习等方向都依赖于贝叶斯思想。`,
      further: [
        { id: 'f1', title: '先验概率的选择方法', content: '贝叶斯分析中先验的选择是一个重要问题：\n\n**1. 无信息先验**：\n- 离散情形：均匀分布 P(Bᵢ) = 1/n\n- 连续情形：如Jeffreys先验\n\n**2. 共轭先验**：\n- 选择与似然同族的先验，使得后验也是同族分布\n- 例如：二项分布的似然 + Beta先验 → Beta后验\n\n**3. 经验贝叶斯**：\n- 从数据中估计先验的超参数\n- 兼顾客观性和贝叶斯框架\n\n**4. 主观先验**：\n- 根据专家知识设定\n- 在数据量少时特别重要' },
        { id: 'f2', title: '贝叶斯公式与最大似然估计', content: '贝叶斯公式与最大似然估计（MLE）的关系：\n\nP(Bⱼ|A) ∝ P(Bⱼ)·P(A|Bⱼ)\n\n- MLE：最大化似然 P(A|Bⱼ)，忽略先验\n- MAP（最大后验）：最大化 P(Bⱼ)·P(A|Bⱼ)，考虑先验\n- 当先验为均匀分布时，MAP = MLE\n\nMAP = MLE + 先验正则化，先验起到"正则化项"的作用，防止过拟合。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '垃圾邮件过滤——朴素贝叶斯分类',
        description: `**问题**

已知邮件中"免费"一词在垃圾邮件中出现概率为0.8，在正常邮件中出现概率为0.1。垃圾邮件占比0.3。若一封邮件包含"免费"，求它是垃圾邮件的概率。

**解**

设 $B_1$ = "垃圾邮件"，$B_2$ = "正常邮件"，$A$ = "包含'免费'"

- $P(B_1) = 0.3$, $P(B_2) = 0.7$
- $P(A|B_1) = 0.8$, $P(A|B_2) = 0.1$

$$P(B_1|A) = \\frac{0.3 \\times 0.8}{0.3 \\times 0.8 + 0.7 \\times 0.1} = \\frac{0.24}{0.24 + 0.07} = \\frac{0.24}{0.31} \\approx 0.774$$

**结论**：包含"免费"的邮件有77.4%概率是垃圾邮件。

**朴素贝叶斯扩展**：若考虑多个关键词，假设各词条件独立：
$$P(B_1|A_1 A_2 \\cdots A_k) \\propto P(B_1) \\prod_{i=1}^k P(A_i|B_1)$$`,
        scenario: '调整垃圾邮件比例和关键词条件概率，观察后验概率变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '全概率公式——零件次品来源分析',
        description: `**问题**

某设备使用来自甲、乙两厂的同种零件，甲厂占60%，乙厂40%。甲厂次品率2%，乙厂次品率5%。从设备中任取一件零件发现是次品，求来自甲厂的概率。

**解**

设 $B_1$ = "甲厂", $B_2$ = "乙厂", $A$ = "次品"

- $P(B_1) = 0.6$, $P(B_2) = 0.4$
- $P(A|B_1) = 0.02$, $P(A|B_2) = 0.05$

全概率：$P(A) = 0.6 \\times 0.02 + 0.4 \\times 0.05 = 0.012 + 0.020 = 0.032$

贝叶斯：$P(B_1|A) = \\frac{0.012}{0.032} = 0.375$

**结论**：虽然甲厂产量占比60%，但次品来自甲厂的概率只有37.5%——因为甲厂质量更好。

**先验→后验更新**：$P(B_1) = 0.6 \\to P(B_1|A) = 0.375$，信息"次品"使得甲厂的概率从60%降到37.5%。`,
        scenario: '调整产量比例和次品率，观察后验概率变化。',
      },
    ],
    method: [
      { number: 1, title: '全概率公式解题法', description: `①找出完备事件组B₁,B₂,...,Bₙ（常见的：两种来源用B和B̄；多种来源用各来源）\n②计算各P(Bᵢ)和P(A|Bᵢ)\n③P(A) = Σ P(Bᵢ)P(A|Bᵢ)\n④关键：完备事件组必须"不重不漏"` },
      { number: 2, title: '贝叶斯公式解题法', description: `①明确"结果"A和"原因"Bⱼ\n②用全概率公式求P(A)\n③P(Bⱼ|A) = P(Bⱼ)P(A|Bⱼ)/P(A)\n④注意区分先验P(Bⱼ)和后验P(Bⱼ|A)` },
      { number: 3, title: '先验后验分析法', description: `①列出先验概率P(Bⱼ)（A发生前的估计）\n②列出似然P(A|Bⱼ)（各原因下A的可能性）\n③用贝叶斯公式更新为先验P(Bⱼ|A)\n④比较先验和后验的差异，理解信息的"更新力度"` },
    ],
  },
}

const independenceBernoulliPoint: KnowledgePoint = {
  id: 'independence-bernoulli',
  moduleId: 'probability-events',
  name: '事件的独立性与伯努利概型',
  formula: 'P(AB) = P(A)P(B)',
  coreSentence: '独立意味着"互不影响"——P(AB)=P(A)P(B)是定义，三事件独立需要4个等式，伯努利概型是独立重复试验。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
          { id: 'f2', expression: 'C(n,k)*p^k*(1-p)^(n-k)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'n*p', y: 0.3, draggable: false, color: '#C62828', label: 'np' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 1, max: 20, step: 1, defaultValue: 5, label: '试验次数 n' },
          { id: 'p', name: 'p', min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.5, label: '成功概率 p' },
          { id: 'k', name: 'k', min: 0, max: 20, step: 1, defaultValue: 3, label: '成功次数 k' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '伯努利概型与二项分布',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=5, p=0.5：5次抛硬币，P(k=3)=C(5,3)×0.5⁵=10/32', changes: { n: 5, p: 0.5, k: 3 } },
            { id: 's2', description: 'n=10, p=0.3：10次试验，成功率0.3', changes: { n: 10, p: 0.3, k: 3 } },
            { id: 's3', description: 'n=10, p=0.5：概率分布更对称', changes: { n: 10, p: 0.5, k: 5 } },
            { id: 's4', description: 'n=20, p=0.3：大n下近似正态分布', changes: { n: 20, p: 0.3, k: 6 } },
            { id: 's5', description: '独立性检验：P(AB)=P(A)P(B)?', changes: { n: 5, p: 0.5, k: 3 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：独立是"互不影响"，不是"互不相干"**

独立性是概率论中最重要的概念之一。两个事件独立，意味着一个事件的发生与否不改变另一个事件的概率。这与"互斥"截然不同——互斥是"不能同时发生"，独立是"互不影响"。

---

**📐 两事件独立的定义**

若事件 $A$ 和 $B$ 满足：
$$P(AB) = P(A) \\cdot P(B)$$

则称 $A$ 与 $B$ **相互独立**。

**等价条件**（以下四条互相等价，设 $P(A) > 0$, $P(B) > 0$）：

| 等价表述 | 公式 |
|---------|------|
| 乘法形式 | $P(AB) = P(A)P(B)$ |
| 条件概率形式1 | $P(A|B) = P(A)$ |
| 条件概率形式2 | $P(B|A) = P(B)$ |
| 补事件形式 | $P(A\\bar{B}) = P(A)P(\\bar{B})$ |

**关键**：$P(A|B) = P(A)$ 的含义是——B的发生不改变A的概率，即"B对A没有信息量"。

---

**📐 独立性的重要性质**

**性质1**：若A与B独立，则以下三对也独立：
- $A$ 与 $\\bar{B}$ 独立
- $\\bar{A}$ 与 $B$ 独立
- $\\bar{A}$ 与 $\\bar{B}$ 独立

**证明**：$P(A\\bar{B}) = P(A) - P(AB) = P(A) - P(A)P(B) = P(A)(1-P(B)) = P(A)P(\\bar{B})$ ✓

**性质2**：独立与互斥的关系（$P(A) > 0$, $P(B) > 0$ 时）
- **互斥 ⟹̸ 独立**：互斥时 $P(AB) = 0 \\neq P(A)P(B) > 0$
- **独立 ⟹̸ 互斥**：独立时 $P(AB) = P(A)P(B) > 0$，即AB≠∅

**核心结论**：$P(A) > 0$ 且 $P(B) > 0$ 时，**独立与互斥不能同时成立！**

**特殊情形**：$P(A) = 0$ 或 $P(B) = 0$ 时，A与B既互斥又独立（但这是退化情形）。

---

**📐 三事件独立——需要4个等式**

三个事件 $A, B, C$ 相互独立，需要**同时**满足以下4个等式：

1. $P(AB) = P(A)P(B)$
2. $P(AC) = P(A)P(C)$
3. $P(BC) = P(B)P(C)$
4. $P(ABC) = P(A)P(B)P(C)$

仅满足前3个称为**两两独立**，但不等于相互独立！

**反例**：掷两枚均匀硬币，设
- A = "第1枚正面"
- B = "第2枚正面"  
- C = "两枚同面"

则 P(A) = P(B) = P(C) = 1/2

- P(AB) = 1/4 = P(A)P(B) ✓
- P(AC) = 1/4 = P(A)P(C) ✓
- P(BC) = 1/4 = P(B)P(C) ✓

但 P(ABC) = 1/4 ≠ P(A)P(B)P(C) = 1/8 ✗

所以A、B、C两两独立但不相互独立！

**n个事件独立**：需要 $C_n^2 + C_n^3 + \\cdots + C_n^n = 2^n - n - 1$ 个等式。

---

**📐 伯努利概型**

**定义**：若试验 $E$ 只有两种结果（成功/失败），则称 $E$ 为**伯努利试验**。将 $E$ 独立重复 $n$ 次，称为 **n重伯努利试验**。

**二项概率公式**：在n重伯努利试验中，成功概率为 $p$，则恰好成功 $k$ 次的概率为：
$$P(X = k) = C_n^k p^k (1-p)^{n-k}, \\quad k = 0, 1, \\cdots, n$$

这就是**二项分布** $X \\sim B(n, p)$。

**关键条件**：
1. 每次试验只有两种结果
2. 各次试验相互独立
3. 成功概率 $p$ 保持不变

**例子**：
- 抛n枚硬币：$p = 0.5$
- n次射击，每次命中率0.8：$p = 0.8$
- n件产品抽检，每件次品率0.05：$p = 0.05$

---

**⚠️ 常见误区**

**误区1**："独立就是没有关系"
- **纠正**：独立是概率上的"互不影响"，不是说两事件没有任何联系。例如，A与Ā有密切关系，但若P(A)=0，则A与Ā独立

**误区2**："两两独立就是相互独立"
- **纠正**：两两独立只要求每对独立，不要求三三独立（见反例）

**误区3**："独立重复就是简单重复"
- **纠正**：伯努利概型要求"独立"且"概率不变"，两者缺一不可`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：独立性的哲学——因果与相关**

独立性是概率论中对"因果关系"的数学刻画。如果A与B独立，那么A的发生不提供关于B的任何信息——两者在概率意义下"没有因果关联"。

然而，独立 ≠ 不相关：
- 独立 ⟹ 不相关（协方差为零），但不相关 ⟹̸ 独立
- 不相关只要求"线性无关"，独立要求"整体无关"

三事件独立需要4个等式的事实，揭示了一个深刻道理：**高维的独立性远比低维复杂**。两两独立不保证三三独立，这意味着"局部无关联"不等于"全局无关联"。在统计学中，这就是为什么仅看两两相关系数不足以判断多元独立性。

伯努利概型是独立性的直接应用——n次独立重复试验构成了最简单的随机过程。二项分布是离散概率分布的基石，当n很大时近似正态分布（中心极限定理），当n大p小时近似泊松分布。`,
      extension: `**🚀 从二项分布到正态分布——中心极限定理的萌芽**

当n足够大时，二项分布 $B(n,p)$ 近似正态分布 $N(np, np(1-p))$：

$$P(a \\leq X \\leq b) \\approx \\Phi\\left(\\frac{b+0.5-np}{\\sqrt{np(1-p)}}\\right) - \\Phi\\left(\\frac{a-0.5-np}{\\sqrt{np(1-p)}}\\right)$$

这就是**棣莫弗-拉普拉斯定理**，是中心极限定理的最早形式（1733年）。

当n大、p小时，二项分布近似泊松分布 $P(\\lambda)$，$\\lambda = np$。`,
      further: [
        { id: 'f1', title: '独立性的判定方法', content: '**实际判断独立性**有两种途径：\n\n**1. 直觉判断（先验）**：\n- 掷两枚硬币：两次结果显然互不影响 → 独立\n- 同一人两次考试成绩：显然有影响 → 不独立\n\n**2. 数据验证（后验）**：\n- 检验 P(AB) ≈ P(A)P(B)（卡方检验）\n- 检验相关系数是否接近0\n\n**考试中的判断**：\n- 题目说"独立" → 直接用 P(AB)=P(A)P(B)\n- 题目没说 → 需要验证或计算\n- 关键词："互不影响""无关联" → 独立' },
        { id: 'f2', title: '伯努利概型的扩展', content: '**1. 几何分布**：伯努利试验中首次成功所需的试验次数\nP(X=k) = (1-p)ᵏ⁻¹p, k=1,2,...\n\n**2. 负二项分布**：伯努利试验中第r次成功所需的试验次数\nP(X=k) = C(k-1,r-1)pʳ(1-p)ᵏ⁻ʳ, k=r,r+1,...\n\n**3. 多重伯努利**：每次试验有m种结果（多面骰子）\n→ 多项分布\n\n这些分布构成了离散概率分布的核心家族，都以独立重复试验为基础。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '系统可靠性——独立元件的串并联',
        description: `**问题**

某系统由3个独立工作的元件组成，各元件正常工作的概率分别为0.9、0.8、0.7。

1. 串联系统：求系统正常工作的概率
2. 并联系统：求系统正常工作的概率

**解**

设 $A_i$ = "第i个元件正常"，$A_1, A_2, A_3$ 相互独立。

**串联**：系统正常 = $A_1 A_2 A_3$
$$P = P(A_1)P(A_2)P(A_3) = 0.9 \\times 0.8 \\times 0.7 = 0.504$$

**并联**：系统正常 = $A_1 \\cup A_2 \\cup A_3$
用对偶律：$P = 1 - P(\\bar{A}_1 \\bar{A}_2 \\bar{A}_3) = 1 - 0.1 \\times 0.2 \\times 0.3 = 1 - 0.006 = 0.994$

**结论**：并联系统远比串联系统可靠（0.994 vs 0.504）。`,
        scenario: '调整各元件可靠度，观察串并联系统概率变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '二项分布——多次射击命中次数',
        description: `**问题**

某射手每次射击命中率为0.8，独立射击5次。求：
1. 恰好命中3次的概率
2. 至少命中4次的概率

**解**

这是5重伯努利试验，$X \\sim B(5, 0.8)$。

**1. 恰好3次**：
$$P(X=3) = C_5^3 \\times 0.8^3 \\times 0.2^2 = 10 \\times 0.512 \\times 0.04 = 0.2048$$

**2. 至少4次**：
$$P(X \\geq 4) = P(X=4) + P(X=5)$$
$$= C_5^4 \\times 0.8^4 \\times 0.2 + C_5^5 \\times 0.8^5$$
$$= 5 \\times 0.4096 \\times 0.2 + 0.32768$$
$$= 0.4096 + 0.32768 = 0.73728$$

**验证**：$P(X \\geq 4) = 1 - P(X \\leq 3) = 1 - \\sum_{k=0}^3 C_5^k \\times 0.8^k \\times 0.2^{5-k}$`,
        scenario: '调整命中率p和射击次数n，观察二项分布的变化。',
      },
    ],
    method: [
      { number: 1, title: '独立性判断与验证', description: `①题目明确说"独立"→直接用P(AB)=P(A)P(B)\n②题目未说明→需验证P(AB)=P(A)P(B)是否成立\n③两事件独立↔P(A|B)=P(A)↔P(B|A)=P(B)\n④注意：独立与互斥在P(A)>0, P(B)>0时互斥` },
      { number: 2, title: '伯努利概型识别与计算', description: `①确认三条件：只有两种结果、各次独立、概率不变\n②确定n（试验次数）和p（成功概率）\n③P(X=k) = C(n,k)·pᵏ·(1-p)ⁿ⁻ᵏ\n④"至少""至多"等用对立事件或累加` },
      { number: 3, title: '独立事件乘积概率分解', description: `①n个独立事件同时发生：P(A₁A₂...Aₙ) = P(A₁)P(A₂)...P(Aₙ)\n②"至少一个发生"用对偶律：P(∪Aᵢ) = 1-∏P(Āᵢ)\n③"恰好一个发生" = Σ[P(Aᵢ)∏(j≠i)P(Āⱼ)]\n④注意：三事件以上必须"相互独立"才能分解，两两独立不够` },
    ],
  },
}

// ---- 第二章 一维随机变量及其分布 ----

const distributionFunctionPoint: KnowledgePoint = {
  id: 'distribution-function',
  moduleId: 'one-dim-rv',
  name: '随机变量与分布函数',
  formula: 'F(x) = P\\{X \\leq x\\}',
  coreSentence: '分布函数F(x)完整刻画了随机变量的概率规律，任何关于X的概率计算都可由F完成。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x < 0 ? 0 : x < 1 ? x*x : 1', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'x < 0 ? 0 : x < 2 ? 0.5*x : 1', color: '#ef4444', visible: false }
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: true, color: '#10b981', label: '(0, 0)' },
          { id: 'p2', x: 1, y: 1, draggable: true, color: '#10b981', label: '(1, 1)' }
        ],
        sliders: [
          { id: 's1', name: 'a', min: -3, max: 3, step: 0.1, defaultValue: -1, label: '区间左端 a' },
          { id: 's2', name: 'b', min: -3, max: 3, step: 0.1, defaultValue: 2, label: '区间右端 b' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '分布函数性质演示',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示分布函数单调不减：随着x增大，F(x)从不下降', changes: { 's1': -3, 's2': 3 } },
            { id: 'step2', description: '展示F(-∞)=0：x趋负无穷时F(x)趋近0', changes: { 's1': -3, 's2': -2 } },
            { id: 'step3', description: '展示F(+∞)=1：x趋正无穷时F(x)趋近1', changes: { 's1': 2, 's2': 3 } },
            { id: 'step4', description: '展示右连续性：在跳跃点处F(x)取右极限值', changes: { 's1': 0.5, 's2': 1.5 } },
            { id: 'step5', description: '求概率P{a<X≤b}=F(b)-F(a)：用两端分布函数值之差表示', changes: { 's1': -1, 's2': 2 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 随机变量与分布函数

### 核心思想

在概率论中，我们常常不关心试验的具体结果，而只关心与结果有关的某个数量。**随机变量**就是将样本空间中的每个结果映射为实数的函数，从而使得我们可以用微积分等数学工具来研究概率问题。**分布函数** $F(x) = P\\{X \\leq x\\}$ 则完整刻画了随机变量的概率规律，任何关于 $X$ 的概率计算都可由 $F$ 完成。

### 定义

**随机变量**：设随机试验的样本空间为 $\\Omega$，如果对每个 $\\omega \\in \\Omega$，都有唯一的实数 $X(\\omega)$ 与之对应，则称 $X = X(\\omega)$ 为**随机变量**。

> 随机变量本质上是从样本空间 $\\Omega$ 到实数集 $\\mathbb{R}$ 的一个映射（可测函数）。它将定性的事件转化为定量的数值，使得概率问题可以借助数学分析工具来处理。

**分布函数**：设 $X$ 是一个随机变量，对任意实数 $x$，称

$$F(x) = P\\{X \\leq x\\}$$

为 $X$ 的**分布函数**（Cumulative Distribution Function, CDF）。

$F(x)$ 的值表示随机变量 $X$ 落在 $(-\\infty, x]$ 内的概率，它**完整地描述**了随机变量的概率分布规律。

### 性质与定理

**分布函数的四条基本性质**：

1. **单调不减**：若 $x_1 < x_2$，则 $F(x_1) \\leq F(x_2)$
2. **右连续**：$F(x+0) = F(x)$，即 $\\lim_{t \\to x^+} F(t) = F(x)$
3. **$F(-\\infty) = 0$**：$\\lim_{x \\to -\\infty} F(x) = 0$
4. **$F(+\\infty) = 1$**：$\\lim_{x \\to +\\infty} F(x) = 1$

> **充分性定理**：这四条性质不仅是分布函数的必要条件，也是充分条件——任何一个满足上述四条性质的函数 $F(x)$，都必定是某个随机变量的分布函数。只要验证四条性质，就能确认一个函数是否为合法的分布函数。

---

**离散型分布函数的阶梯形特征**：

若 $X$ 为离散型随机变量，取值为 $x_1 < x_2 < \\cdots$，对应概率为 $p_1, p_2, \\ldots$，则其分布函数为**阶梯函数**：

$$F(x) = \\sum_{x_k \\leq x} p_k$$

- 在取值点 $x_k$ 处有跳跃，跳跃高度为 $p_k$；在相邻取值点之间为水平线段
- **右连续**：在跳跃点处 $F(x)$ 取的是**上方值**（右极限值）

---

**连续型分布函数与密度函数的关系**：

若 $X$ 为连续型随机变量，存在概率密度函数 $f(x)$，使得：

$$F(x) = \\int_{-\\infty}^{x} f(t)\\,dt$$

- **由密度求分布函数**：$F(x) = \\int_{-\\infty}^{x} f(t)\\,dt$
- **由分布函数求密度**：在 $F(x)$ 可导处，$f(x) = F'(x)$
- **连续型分布函数的特征**：$F(x)$ 处处连续，无跳跃点，$P\\{X = a\\} = 0$

| 对比 | 离散型 | 连续型 |
|------|--------|--------|
| $F(x)$ 的形态 | 阶梯函数，有跳跃 | 处处连续，光滑 |
| 单点概率 | $P\\{X=a\\} = F(a)-F(a-0) > 0$ | $P\\{X=a\\} = 0$ |
| 求概率方式 | 求和 | 积分 |

---

**用分布函数求概率——完整公式表**：

| 概率形式 | 计算公式 | 记忆要点 |
|---------|---------|---------|
| $P\\{X \\leq b\\}$ | $F(b)$ | 直接代入 |
| $P\\{X > a\\}$ | $1 - F(a)$ | 取对立事件 |
| $P\\{a < X \\leq b\\}$ | $F(b) - F(a)$ | 右端减左端 |
| $P\\{X = a\\}$ | $F(a) - F(a-0)$ | 跳跃高度 |
| $P\\{a \\leq X \\leq b\\}$ | $F(b) - F(a-0)$ | 左闭用左极限 |
| $P\\{a < X < b\\}$ | $F(b-0) - F(a)$ | 右开用左极限 |
| $P\\{a \\leq X < b\\}$ | $F(b-0) - F(a-0)$ | 两端闭用左极限 |

> **核心规律**：等号 $\\leq$ 用 $F$ 本身，严格不等号 $<$ 用 $F$ 的左极限 $F(\\cdot - 0)$。对**连续型**随机变量，端点开闭不影响概率值。

### 典型例题

**例1**：设随机变量 $X$ 的分布函数为 $F(x) = \\begin{cases} 0, & x < 0 \\\\ x^2, & 0 \\leq x < 1 \\\\ 1, & x \\geq 1 \\end{cases}$，求 $P\\{0.3 < X \\leq 0.7\\}$ 和 $P\\{X = 0.5\\}$。

**解**：
- $P\\{0.3 < X \\leq 0.7\\} = F(0.7) - F(0.3) = 0.49 - 0.09 = 0.40$
- $P\\{X = 0.5\\} = F(0.5) - F(0.5-0) = 0.25 - 0.25 = 0$（连续型随机变量单点概率为0）

**例2**：判断 $F(x) = \\begin{cases} 0, & x < 0 \\\\ \\frac{1}{2}x, & 0 \\leq x < 1 \\\\ 1, & x \\geq 1 \\end{cases}$ 是否为分布函数。

**解**：检验四条性质——①在 $[0,1)$ 上 $F(x)=x/2$ 单调不减 ✓；②右连续 ✓；③$F(-\\infty)=0$ ✓；④$F(+\\infty)=1$ ✓。但注意 $F(1-0) = 1/2 \\neq F(1) = 1$，在 $x=1$ 处有跳跃，跳跃高度为 $1/2$，说明 $P\\{X=1\\} = 1/2$。这是一个**混合型**随机变量（既有连续部分又有离散部分）。

**例3**：设 $F(x)$ 为随机变量 $X$ 的分布函数，证明：对任意 $a < b$，$P\\{a < X \\leq b\\} = F(b) - F(a)$。

**证明**：$\\{X \\leq b\\} = \\{X \\leq a\\} \\cup \\{a < X \\leq b\\}$，且 $\\{X \\leq a\\} \\cap \\{a < X \\leq b\\} = \\emptyset$，由概率的可加性：$P\\{X \\leq b\\} = P\\{X \\leq a\\} + P\\{a < X \\leq b\\}$，即 $F(b) = F(a) + P\\{a < X \\leq b\\}$，移项得证。

### 常见误区

1. **混淆不等号方向**：$P\\{a < X \\leq b\\} = F(b) - F(a)$，注意左端是严格不等号，右端取等号。若左端也取等号，需用 $F(b) - F(a-0)$。
2. **忽略右连续性**：分布函数是**右连续**而非左连续，在离散跳跃点处 $F(x)$ 取右极限值（即上方值）。
3. **把随机变量当作普通变量**：随机变量是样本空间上的函数，不是实数轴上的自由变量。其"取值"受概率分布约束。
4. **忘记充分性**：验证函数是分布函数时，四条性质缺一不可，但也**缺一不多**——满足四条即一定是某个随机变量的分布函数。`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 180, end: 205, type: 'formula' },
        { start: 350, end: 380, type: 'emphasis' },
        { start: 600, end: 630, type: 'formula' }
      ]
    },
    extension: {
      essence: '分布函数的核心思想在于：将概率这一本定义在事件（样本空间的子集）上的函数，通过随机变量的"中介"，转化为定义在实数轴上的普通实函数。这一转化至关重要——它使我们摆脱了抽象样本空间的束缚，可以将所有关于随机变量的概率问题统一归约为对实函数F(x)的运算。分布函数F(x)=P{X≤x}之所以选择"≤"而非"<"，正是为了保证右连续性，这与勒贝格-斯蒂尔杰斯测度的构造传统一脉相承。从测度论视角看，每个分布函数都唯一确定一个R上的概率测度，反之亦然——这便是著名的对应定理。',
      further: [
        { id: 'ext1', title: '分布函数与勒贝格-斯蒂尔杰斯积分', content: '分布函数F(x)可诱导出R上的LS测度dF，使得P{X∈B}=∫_B dF(x)。当F绝对连续时dF=f(x)dx（概率密度），当F为阶梯函数时对应离散分布。这是概率论统一离散与连续的深层框架。' },
        { id: 'ext2', title: '多元推广：联合分布函数', content: '对n维随机向量(X₁,...,Xₙ)，联合分布函数F(x₁,...,xₙ)=P{X₁≤x₁,...,Xₙ≤xₙ}。联合分布完全确定边缘分布（令某些变量→+∞），但边缘分布一般不能确定联合分布——除非独立。' },
        { id: 'ext3', title: '分布函数的不连续点集至多可数', content: '由单调不减性，F的跳跃点集{a:F(a)-F(a-0)>0}至多可数。这意味着分布函数"几乎处处"连续，离散随机变量只在可数个点有跳跃，连续随机变量则处处连续。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '交通信号灯等待时间的概率',
        description: '某路口红灯持续60秒。假设车辆随机到达，用X表示到达后需等待的秒数，求等待不超过20秒的概率。',
        scenario: '设X服从[0,60]上的均匀分布，分布函数F(x)=x/60 (0≤x≤60)。P{X≤20}=F(20)=20/60=1/3≈33.3%。'
      },
      {
        id: 'app2',
        type: 'example',
        title: '已知分布函数求概率',
        description: '设F(x)={0,x<0; A·sinx,0≤x≤π/2; 1,x>π/2}为某随机变量的分布函数，求常数A及P{π/6<X≤π/3}。',
        scenario: '由F(+∞)=1，A·sin(π/2)=1，故A=1。P{π/6<X≤π/3}=F(π/3)-F(π/6)=sin(π/3)-sin(π/6)=√3/2-1/2=(√3-1)/2≈0.366。'
      }
    ],
    method: [
      { number: 1, title: '验证分布函数四性质', description: '判断一个函数是否为分布函数，逐一检验：①单调不减②右连续③F(-∞)=0④F(+∞)=1。缺一不可，也缺一不多。' },
      { number: 2, title: '分布函数法求概率', description: '任何关于X的概率都可化为{X≤某值}的并交补运算，再用F(x)计算。关键是正确处理不等号方向：严格不等用F(a-0)（左极限），取等号用F(a)。' }
    ]
  }
}

const discreteRVPoint: KnowledgePoint = {
  id: 'discrete-rv',
  moduleId: 'one-dim-rv',
  name: '离散型随机变量及分布律',
  formula: 'P\\{X = x_k\\} = p_k, \\quad k=1,2,\\cdots',
  coreSentence: '离散型随机变量只取有限或可列个值，其概率规律完全由分布律（概率分布表）刻画。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [],
        points: [
          { id: 'p1', x: 0, y: 0.4, draggable: false, color: '#3b82f6', label: 'p₁=0.4' },
          { id: 'p2', x: 1, y: 0.3, draggable: false, color: '#3b82f6', label: 'p₂=0.3' },
          { id: 'p3', x: 2, y: 0.2, draggable: false, color: '#3b82f6', label: 'p₃=0.2' },
          { id: 'p4', x: 3, y: 0.1, draggable: false, color: '#3b82f6', label: 'p₄=0.1' }
        ],
        sliders: [
          { id: 's1', name: 'p1', min: 0, max: 1, step: 0.05, defaultValue: 0.4, label: 'p₁' },
          { id: 's2', name: 'p2', min: 0, max: 1, step: 0.05, defaultValue: 0.3, label: 'p₂' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '分布律与分布函数的关系',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示分布律：各取值点处的概率p_k，用竖线高度表示', changes: { 's1': 0.4, 's2': 0.3 } },
            { id: 'step2', description: '验证归一性：所有p_k之和等于1', changes: { 's1': 0.4, 's2': 0.3 } },
            { id: 'step3', description: '由分布律构建分布函数：F(x)=Σp_k（对x_k≤x求和），呈阶梯状', changes: { 's1': 0.25, 's2': 0.25 } },
            { id: 'step4', description: '分布函数在取值点处跳跃，跳跃高度=该点概率', changes: { 's1': 0.5, 's2': 0.2 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 离散型随机变量及分布律

### 核心思想

**离散型随机变量**是最直观的随机变量类型——它只取有限个或可列无穷个值，就像掷骰子只能出现1到6。其概率规律完全由"每个值出现的概率"来描述，这就是**分布律**。

### 定义

如果随机变量 $X$ 的所有可能取值只有有限个或可列无穷个，即 $X$ 的值域为

$$\\{x_1, x_2, \\cdots, x_k, \\cdots\\}$$

则称 $X$ 为**离散型随机变量**。

离散型随机变量 $X$ 的**分布律**（也称概率分布、分布列）为：

$$P\\{X = x_k\\} = p_k, \\quad k = 1, 2, \\cdots$$

常表示为概率分布表：

| $X$ | $x_1$ | $x_2$ | $\\cdots$ | $x_k$ | $\\cdots$ |
|-----|-------|-------|----------|-------|----------|
| $P$ | $p_1$ | $p_2$ | $\\cdots$ | $p_k$ | $\\cdots$ |

### 性质与定理

**分布律的两条基本性质**：

1. **非负性**：$p_k \\geq 0, \\quad k = 1, 2, \\cdots$
2. **归一性**：$\\sum_{k=1}^{\\infty} p_k = 1$

> 这两条性质是判断一组数能否成为分布律的**充要条件**。

---

**分布律与分布函数的关系**：

**由分布律求分布函数**：

$$F(x) = P\\{X \\leq x\\} = \\sum_{x_k \\leq x} p_k$$

**由分布函数求分布律**：

$$p_k = P\\{X = x_k\\} = F(x_k) - F(x_k - 0)$$

> 离散型随机变量的分布函数是**阶梯函数**，在每个取值 $x_k$ 处有跳跃，跳跃高度恰好为 $p_k$。

**离散型分布函数的构造步骤**：
1. 将 $X$ 的取值从小到大排列：$x_1 < x_2 < \\cdots$
2. 在 $x < x_1$ 时，$F(x) = 0$
3. 在 $x_k \\leq x < x_{k+1}$ 时，$F(x) = p_1 + p_2 + \\cdots + p_k$
4. 在 $x \\geq x_n$（有限取值时），$F(x) = 1$

---

### 几何分布 $G(p)$

在独立重复伯努利试验中，**首次成功**所需的试验次数 $X$ 服从几何分布。

**分布律**：

$$P\\{X = k\\} = (1-p)^{k-1} p, \\quad k = 1, 2, 3, \\cdots$$

其中 $0 < p < 1$ 为每次试验成功的概率，记为 $X \\sim G(p)$。

**基本性质**：
- **期望**：$E(X) = \\frac{1}{p}$
- **方差**：$D(X) = \\frac{1-p}{p^2}$
- **分布函数**：$F(k) = P\\{X \\leq k\\} = 1 - (1-p)^k, \\quad k = 1, 2, \\cdots$

**无记忆性（核心性质）**：对任意正整数 $m, n$，

$$P\\{X > m+n \\mid X > m\\} = P\\{X > n\\}$$

> **证明**：$P\\{X > m\\} = (1-p)^m$，$P\\{X > m+n\\} = (1-p)^{m+n}$，故 $P\\{X > m+n \\mid X > m\\} = \\frac{(1-p)^{m+n}}{(1-p)^m} = (1-p)^n = P\\{X > n\\}$。

> **重要结论**：几何分布是**唯一**具有无记忆性的取正整数值的离散型分布。

---

### 超几何分布 $H(n, M, N)$

从含 $M$ 个次品的 $N$ 件产品中**不放回**抽取 $n$ 件，次品数 $X$ 服从超几何分布。

**分布律**：

$$P\\{X = k\\} = \\frac{C_M^k C_{N-M}^{n-k}}{C_N^n}, \\quad k = 0, 1, \\cdots, \\min(n, M)$$

**基本性质**：
- **期望**：$E(X) = n \\cdot \\frac{M}{N}$（与二项分布 $B(n, M/N)$ 的期望相同）
- **方差**：$D(X) = n \\cdot \\frac{M}{N} \\cdot \\frac{N-M}{N} \\cdot \\frac{N-n}{N-1}$

> **与二项分布的关系**：当 $N \\to \\infty$ 且 $M/N \\to p$ 时，$H(n, M, N) \\to B(n, p)$。实用中，当 $n/N \\leq 0.05$（抽样比小于5%）时，超几何分布可用二项分布 $B(n, M/N)$ 近似。

---

### 常见离散分布汇总

| 分布名称 | 分布律 $P\\{X=k\\}$ | 取值范围 | 期望 $E(X)$ | 方差 $D(X)$ |
|---------|-------------------|---------|------------|------------|
| 0-1分布 $B(1,p)$ | $p^k(1-p)^{1-k}$ | $k=0,1$ | $p$ | $p(1-p)$ |
| 二项分布 $B(n,p)$ | $C_n^k p^k(1-p)^{n-k}$ | $k=0,1,\\ldots,n$ | $np$ | $np(1-p)$ |
| 泊松分布 $P(\\lambda)$ | $\\frac{\\lambda^k e^{-\\lambda}}{k!}$ | $k=0,1,2,\\ldots$ | $\\lambda$ | $\\lambda$ |
| 几何分布 $G(p)$ | $(1-p)^{k-1}p$ | $k=1,2,\\ldots$ | $1/p$ | $(1-p)/p^2$ |
| 超几何分布 $H(n,M,N)$ | $\\frac{C_M^k C_{N-M}^{n-k}}{C_N^n}$ | $k=0,1,\\ldots,\\min(n,M)$ | $nM/N$ | 见上方 |

### 典型例题

**例1**：设随机变量 $X$ 的分布律为 $P\\{X=k\\} = \\frac{C}{k(k+1)}, k=1,2,\\cdots$，求常数 $C$。

**解**：由归一性 $\\sum_{k=1}^{\\infty} \\frac{C}{k(k+1)} = 1$。

利用裂项：$\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$，

所以 $C \\cdot \\left(1 - \\frac{1}{2} + \\frac{1}{2} - \\frac{1}{3} + \\cdots\\right) = C \\cdot 1 = 1$，故 $C = 1$。

**例2**：袋中有3个红球2个白球，从中任取2个，以 $X$ 表示取到的红球数，求 $X$ 的分布律。

**解**：$X$ 的可能取值为 0, 1, 2。

$$P\\{X=0\\} = \\frac{C_2^2}{C_5^2} = \\frac{1}{10}$$

$$P\\{X=1\\} = \\frac{C_3^1 C_2^1}{C_5^2} = \\frac{6}{10}$$

$$P\\{X=2\\} = \\frac{C_3^2}{C_5^2} = \\frac{3}{10}$$

**例3**：某人反复掷骰子直到出现6为止，求第3次才首次出现6的概率及平均投掷次数。

**解**：设 $X$ 为首次出现6的投掷次数，$X \\sim G(1/6)$。

$P\\{X=3\\} = (1-1/6)^2 \\cdot (1/6) = (5/6)^2 \\cdot (1/6) = 25/216 \\approx 0.1157$

$E(X) = 1/(1/6) = 6$（平均需掷6次）

### 常见误区

1. **忘记验证归一性**：确定分布律中的待定常数时，必须利用 $\\sum p_k = 1$，而非其他条件。
2. **混淆分布函数与分布律**：分布律是离散点处的概率值，分布函数是累积概率，两者是不同层次的描述。
3. **遗漏取值**：确定 $X$ 的可能取值时容易遗漏，尤其在"取数""摸球"等问题中需仔细分析。
4. **几何分布的起始值**：$G(p)$ 的取值从 $k=1$ 开始（首次成功至少需要1次试验），不要误写为 $k=0$。`,
      highlights: [
        { start: 0, end: 15, type: 'definition' },
        { start: 150, end: 180, type: 'formula' },
        { start: 300, end: 330, type: 'emphasis' },
        { start: 500, end: 540, type: 'formula' }
      ]
    },
    extension: {
      essence: '离散型随机变量的分布律本质上是一个定义在可数集上的概率质量函数（PMF）。从信息论角度看，分布律{p_k}编码了关于随机变量的全部信息——熵H(X)=-Σp_k·ln(p_k)度量了不确定性的大小。从测度论视角，离散分布对应一个纯原子测度（集中在可数个点上的测度），其分布函数是纯跳跃函数。分布律的非负性与归一性恰好是概率测度定义在可数样本空间上的直接体现，这使离散分布成为最"原始"也最直观的概率模型。',
      further: [
        { id: 'ext1', title: '熵与分布律', content: '给定分布律{p_k}，Shannon熵H(X)=-Σp_k·log₂(p_k)度量了每次观察X所获得的平均信息量（比特）。均匀分布时熵最大（最不确定），退化分布（某p_k=1）时熵为0（完全确定）。' },
        { id: 'ext2', title: '离散分布的参数族', content: '常见离散分布构成参数族：0-1分布B(1,p)、二项分布B(n,p)、泊松分布P(λ)、几何分布G(p)、超几何分布H(n,M,N)等。它们各有适用场景，选择正确分布是建模的关键一步。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '产品质检中的次品数分布',
        description: '某批次产品次品率为5%，随机抽取10件检验。设X为抽取到的次品数，求X的分布律及P{X≥2}。',
        scenario: 'X~B(10,0.05)。P{X=k}=C₁₀ᵏ·0.05ᵏ·0.95^(10-k)，k=0,1,...,10。P{X≥2}=1-P{X=0}-P{X=1}=1-0.95¹⁰-10·0.05·0.95⁹=1-0.5987-0.3151=0.0861≈8.61%。'
      },
      {
        id: 'app2',
        type: 'example',
        title: '求分布律中的待定常数',
        description: '设P{X=k}=C·λᵏ/k! (k=0,1,2,...)，已知P{X=0}=P{X=1}，求C和P{X=2}。',
        scenario: 'P{X=0}=C·λ⁰/0!=C，P{X=1}=C·λ¹/1!=Cλ。由P{X=0}=P{X=1}得C=Cλ，因C≠0故λ=1。由归一性ΣC/k!=C·e=1，C=e⁻¹。P{X=2}=e⁻¹·1²/2!=1/(2e)≈0.184。'
      }
    ],
    method: [
      { number: 1, title: '确定分布律三步法', description: '①写出X的所有可能取值；②对每个取值用古典概型/条件概率等求P{X=x_k}；③用归一性验证或确定常数。' },
      { number: 2, title: '分布律↔分布函数互推', description: '分布律→分布函数：F(x)=Σ(x_k≤x)p_k（逐段累加）；分布函数→分布律：在跳跃点x_k处p_k=F(x_k)-F(x_k-0)。' }
    ]
  }
}

const binomialDistributionPoint: KnowledgePoint = {
  id: 'binomial-distribution',
  moduleId: 'one-dim-rv',
  name: '0-1分布与二项分布',
  formula: 'P\\{X = k\\} = C_n^k p^k (1-p)^{n-k}',
  coreSentence: '二项分布B(n,p)描述n重伯努利试验中成功次数的分布，是离散概率中最重要的分布之一。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'combination(10, x) * pow(0.5, x) * pow(0.5, 10 - x)', color: '#3b82f6', visible: true }
        ],
        points: [],
        sliders: [
          { id: 'sn', name: 'n', min: 1, max: 30, step: 1, defaultValue: 10, label: '试验次数 n' },
          { id: 'sp', name: 'p', min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.5, label: '成功概率 p' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '二项分布PMF随参数变化',
          type: 'step',
          steps: [
            { id: 'step1', description: 'n=10, p=0.5：对称的钟形分布，最可能值k₀=5', changes: { 'sn': 10, 'sp': 0.5 } },
            { id: 'step2', description: 'n=10, p=0.3：分布左偏，最可能值k₀=[11×0.3]=3', changes: { 'sn': 10, 'sp': 0.3 } },
            { id: 'step3', description: 'n=20, p=0.5：n增大分布更集中，最可能值k₀=10', changes: { 'sn': 20, 'sp': 0.5 } },
            { id: 'step4', description: 'n=20, p=0.7：分布右偏，最可能值k₀=[21×0.7]=14', changes: { 'sn': 20, 'sp': 0.7 } },
            { id: 'step5', description: 'n=1, p=0.5：退化为0-1分布（伯努利分布）', changes: { 'sn': 1, 'sp': 0.5 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 0-1分布与二项分布

### 核心思想

**二项分布**是概率论中最重要的离散分布，它描述的是在**n重伯努利试验**（n次独立重复试验，每次只有"成功"和"失败"两个结果）中，"成功"出现的总次数的分布。当n=1时，二项分布退化为最简单的**0-1分布**。

### 定义

**0-1分布（伯努利分布）**：

若随机变量 $X$ 只取0和1两个值，且

$$P\\{X=1\\} = p, \\quad P\\{X=0\\} = 1-p \\quad (0 < p < 1)$$

则称 $X$ 服从**0-1分布**（或伯努利分布），记为 $X \\sim B(1, p)$。

等价形式：$P\\{X=k\\} = p^k(1-p)^{1-k}, \\quad k = 0, 1$

| 性质 | 公式 |
|------|------|
| 期望 | $E(X) = p$ |
| 方差 | $D(X) = p(1-p)$ |
| 分布函数 | $F(x) = \\begin{cases} 0, & x < 0 \\\\ 1-p, & 0 \\leq x < 1 \\\\ 1, & x \\geq 1 \\end{cases}$ |

> 0-1分布是二项分布 $n=1$ 的特例，描述一次伯努利试验的结果。任何二项分布 $B(n,p)$ 都可以分解为 $n$ 个独立0-1变量的和：$X = X_1 + X_2 + \\cdots + X_n$，$X_i \\sim B(1,p)$。

---

**n重伯努利试验**：满足以下三个条件：
1. 试验**独立重复**进行 $n$ 次
2. 每次试验只有**两个可能结果**：事件 $A$（"成功"）和 $\\bar{A}$（"失败"）
3. 每次试验中 $P(A) = p$ **保持不变**（$0 < p < 1$）

---

**二项分布**：

若随机变量 $X$ 的分布律为

$$P\\{X = k\\} = C_n^k p^k (1-p)^{n-k}, \\quad k = 0, 1, 2, \\cdots, n$$

则称 $X$ 服从**二项分布**，记为 $X \\sim B(n, p)$，其中 $n$ 为正整数，$0 < p < 1$。

**推导**：在n重伯努利试验中，某指定k次成功、其余n-k次失败的概率为 $p^k(1-p)^{n-k}$，而k次成功可在n次中任选，故有 $C_n^k$ 种方式，由有限可加性得 $P\\{X=k\\} = C_n^k p^k(1-p)^{n-k}$。

### 性质与定理

1. **期望与方差**：$E(X) = np$，$D(X) = np(1-p)$

> **推导**：由0-1分解 $X = X_1 + \\cdots + X_n$，$X_i \\sim B(1,p)$ 独立，则 $E(X) = \\sum E(X_i) = np$，$D(X) = \\sum D(X_i) = np(1-p)$。

2. **对称性**：$B(n, p)$ 与 $B(n, 1-p)$ 关于 $k = n/2$ 对称

3. **可加性**：若 $X_1 \\sim B(n_1, p)$，$X_2 \\sim B(n_2, p)$ 且独立，则 $X_1 + X_2 \\sim B(n_1+n_2, p)$

4. **递推公式**：

$$\\frac{P\\{X=k+1\\}}{P\\{X=k\\}} = \\frac{(n-k)p}{(k+1)(1-p)}, \\quad k = 0, 1, \\ldots, n-1$$

> 从 $P\\{X=0\\} = (1-p)^n$ 出发逐项递推，数值稳定性好得多。

5. **最可能值**：使 $P\\{X=k\\}$ 最大的 $k$ 为

$$k_0 = [(n+1)p]$$

- 若 $(n+1)p$ 为整数，则 $k_0 = (n+1)p$ 和 $k_0 - 1$ 都是最大值点
- 若 $(n+1)p$ 不是整数，则 $k_0 = [(n+1)p]$ 是唯一最大值点

6. **二项展开归一性**：$\\sum_{k=0}^{n} C_n^k p^k (1-p)^{n-k} = [p + (1-p)]^n = 1$

### 典型例题

**例1**：某射手命中率为0.8，独立射击5次，求恰好命中3次的概率和至少命中4次的概率。

**解**：设 $X$ 为命中次数，$X \\sim B(5, 0.8)$。

$$P\\{X=3\\} = C_5^3 \\cdot 0.8^3 \\cdot 0.2^2 = 10 \\cdot 0.512 \\cdot 0.04 = 0.2048$$

$$P\\{X \\geq 4\\} = P\\{X=4\\} + P\\{X=5\\} = C_5^4 \\cdot 0.8^4 \\cdot 0.2 + 0.8^5 = 5 \\cdot 0.4096 \\cdot 0.2 + 0.32768 = 0.73728$$

**例2**：设 $X \\sim B(20, 0.3)$，用递推公式求 $P\\{X=0\\}$ 和 $P\\{X=1\\}$。

**解**：$P\\{X=0\\} = 0.7^{20} \\approx 0.000797$，$\\frac{P\\{X=1\\}}{P\\{X=0\\}} = \\frac{20 \\times 0.3}{1 \\times 0.7} = \\frac{60}{7}$，故 $P\\{X=1\\} \\approx 0.00684$。

**例3**：设 $X \\sim B(10, 0.5)$，求最可能值。

**解**：$k_0 = [(10+1) \\times 0.5] = [5.5] = 5$。由于 $(n+1)p = 5.5$ 不是整数，5是唯一最可能值。

### 常见误区

1. **混淆二项分布与超几何分布**：有放回抽样用二项分布，无放回抽样用超几何分布。当总体很大时超几何分布可近似为二项分布。
2. **忽略独立性前提**：二项分布要求各次试验相互独立。如果试验之间有依赖关系（如不放回抽样），则不能用二项分布。
3. **最可能值公式记错**：是 $[(n+1)p]$ 而非 $[np]$，多了一个1。
4. **混淆σ和σ²记号**：$B(n,p)$ 的方差是 $np(1-p)$，不是 $np$。`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 400, end: 440, type: 'emphasis' },
        { start: 600, end: 640, type: 'formula' }
      ]
    },
    extension: {
      essence: '二项分布B(n,p)是概率论中"频率稳定到概率"这一大数定律思想的离散原型。从代数角度看，二项分布的PMF恰好是二项式[p+(1-p)]ⁿ展开的一般项，这解释了归一性。从随机变量角度看，X~B(n,p)可分解为n个独立0-1变量之和：X=X₁+...+Xₙ，Xᵢ~B(1,p)。这种"可加分解"是二项分布可加性的根源，也是中心极限定理（n→∞时B(n,p)→N(np,npq)）的出发点。p=0.5时二项分布具有完美的对称性，这是组合数C(n,k)=C(n,n-k)的直接反映。',
      further: [
        { id: 'ext1', title: '二项分布与中心极限定理', content: '当n充分大时，B(n,p)可用正态分布N(np,npq)近似（De Moivre-Laplace定理）。实用中np>5且nq>5时正态近似效果良好。这为二项概率的大规模计算提供了快捷途径。' },
        { id: 'ext2', title: '二项分布的递推与计算', content: '直接计算C(n,k)·pᵏ·qⁿ⁻ᵏ可能溢出。递推公式：P{X=k+1}/P{X=k}=[(n-k)/(k+1)]·(p/q)，从P{X=0}=qⁿ出发逐项递推，数值稳定性好得多。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '批量产品验收方案设计',
        description: '某厂产品次品率p=0.1，采用(30,3)抽样方案：抽30件，次品数≤3则接收。求接收概率。',
        scenario: '设X为30件中次品数，X~B(30,0.1)。接收概率=Σ(k=0到3)C(30,k)·0.1ᵏ·0.9³⁰⁻ᵏ≈0.9³⁰+30·0.1·0.9²⁹+435·0.01·0.9²⁸+4060·0.001·0.9²⁷≈0.0424+0.1413+0.2266+0.2361=0.6473≈64.7%。'
      },
      {
        id: 'app2',
        type: 'example',
        title: '二项分布最可能值',
        description: '设X~B(20, 0.3)，求X的最可能值k₀。',
        scenario: '最可能值k₀=[(n+1)p]=[(20+1)×0.3]=[6.3]=6。验证：P{X=6}=C(20,6)·0.3⁶·0.7¹⁴≈0.192，P{X=5}≈0.179，P{X=7}≈0.164，确实k=6时概率最大。'
      }
    ],
    method: [
      { number: 1, title: '识别二项分布模型', description: '关键三要素：①n次独立重复试验；②每次只有两个结果（A与Ā）；③P(A)=p不变。则"成功次数"X~B(n,p)。' },
      { number: 2, title: '二项概率的近似计算', description: '当np较小（≤5）时用泊松近似：B(n,p)≈P(np)；当np和nq都较大时用正态近似：B(n,p)≈N(np,npq)。选择哪种近似看参数大小。' }
    ]
  }
}

const poissonDistributionPoint: KnowledgePoint = {
  id: 'poisson-distribution',
  moduleId: 'one-dim-rv',
  name: '泊松分布与泊松定理',
  formula: 'P\\{X = k\\} = \\frac{\\lambda^k}{k!}e^{-\\lambda}',
  coreSentence: '泊松分布P(λ)描述稀有事件在大量重复中发生的次数，是二项分布的极限分布。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'pow(3, x) * exp(-3) / factorial(x)', color: '#8b5cf6', visible: true }
        ],
        points: [],
        sliders: [
          { id: 'slambda', name: 'lambda', min: 0.5, max: 15, step: 0.5, defaultValue: 3, label: '参数 λ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '泊松分布PMF随λ变化',
          type: 'step',
          steps: [
            { id: 'step1', description: 'λ=1：分布集中在0和1附近，最可能值k₀=0和1', changes: { 'slambda': 1 } },
            { id: 'step2', description: 'λ=3：分布向右移动，最可能值k₀=2', changes: { 'slambda': 3 } },
            { id: 'step3', description: 'λ=5：分布更分散，最可能值k₀=4和5', changes: { 'slambda': 5 } },
            { id: 'step4', description: 'λ=10：分布趋近对称，近似正态形态', changes: { 'slambda': 10 } },
            { id: 'step5', description: 'λ=15：大λ时泊松分布与正态N(λ,λ)高度近似', changes: { 'slambda': 15 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 泊松分布与泊松定理

### 核心思想

**泊松分布**是描述"稀有事件"在大量重复观察中发生次数的数学模型。例如：一页书中印刷错误的个数、一天中到达服务台的顾客数、单位时间内放射性物质衰变次数等。它是二项分布在 $n \\to \\infty$、$np \\to \\lambda$ 时的极限分布。

### 定义

若随机变量 $X$ 的分布律为

$$P\\{X = k\\} = \\frac{\\lambda^k}{k!} e^{-\\lambda}, \\quad k = 0, 1, 2, \\cdots$$

其中 $\\lambda > 0$ 为常数，则称 $X$ 服从**泊松分布**，记为 $X \\sim P(\\lambda)$。

**归一性验证**：$\\sum_{k=0}^{\\infty} \\frac{\\lambda^k}{k!} e^{-\\lambda} = e^{-\\lambda} \\sum_{k=0}^{\\infty} \\frac{\\lambda^k}{k!} = e^{-\\lambda} \\cdot e^{\\lambda} = 1$ ✓

### 性质与定理

**泊松定理（泊松极限定理）**：

设 $np_n = \\lambda$（$\\lambda > 0$ 为常数），则当 $n \\to \\infty$ 时，

$$\\lim_{n \\to \\infty} C_n^k p_n^k (1-p_n)^{n-k} = \\frac{\\lambda^k}{k!} e^{-\\lambda}, \\quad k = 0, 1, 2, \\cdots$$

即当 $n$ 很大、$p$ 很小、$np = \\lambda$ 适中时，可用泊松分布近似二项分布：

$$B(n, p) \\approx P(\\lambda), \\quad \\lambda = np$$

> **实用准则**：当 $n \\geq 20$、$p \\leq 0.05$ 时，泊松近似效果良好；当 $n \\geq 100$、$np \\leq 10$ 时，近似效果极佳。

---

**泊松分布的基本性质**：

1. **期望与方差**：$E(X) = \\lambda$，$D(X) = \\lambda$（均值和方差相等，这是泊松分布的显著特征）

2. **可加性**：若 $X_1 \\sim P(\\lambda_1)$、$X_2 \\sim P(\\lambda_2)$ 且独立，则 $X_1 + X_2 \\sim P(\\lambda_1 + \\lambda_2)$

3. **最可能值**：$k_0 = [\\lambda]$（若 $\\lambda$ 为整数，则 $k_0 = \\lambda$ 和 $k_0 - 1$ 都是最大值点）

4. **大λ正态近似**：当 $\\lambda$ 较大时（$\\lambda > 20$），$P(\\lambda) \\approx N(\\lambda, \\lambda)$

5. **递推公式**：$P\\{X=k+1\\} = \\frac{\\lambda}{k+1} P\\{X=k\\}$，从 $P\\{X=0\\} = e^{-\\lambda}$ 出发逐项计算

**泊松分布的适用场景**：

| 场景 | λ的含义 |
|------|--------|
| 单位时间内电话呼叫数 | 平均呼叫次数 |
| 一页书中印刷错误数 | 平均错误数 |
| 单位面积内瑕疵点数 | 平均瑕疵数 |
| 一定体积内细菌数 | 平均细菌数 |

### 典型例题

**例1**：某电话交换台每分钟平均收到3次呼叫，求：(1) 恰好收到2次呼叫的概率；(2) 收到不超过5次的概率。

**解**：设 $X$ 为每分钟呼叫数，$X \\sim P(3)$。

(1) $P\\{X=2\\} = \\frac{3^2}{2!} e^{-3} = \\frac{9}{2} \\cdot 0.0498 = 0.2240$

(2) $P\\{X \\leq 5\\} = \\sum_{k=0}^{5} \\frac{3^k}{k!} e^{-3} \\approx 0.0498 + 0.1494 + 0.2240 + 0.2240 + 0.1680 + 0.1008 = 0.9160$

**例2**：某批次产品次品率0.005，抽取800件，求恰好有3件次品的概率。

**解**：设 $X$ 为次品数，$X \\sim B(800, 0.005)$。由于 $n = 800$ 很大，$p = 0.005$ 很小，$\\lambda = np = 4$ 适中，用泊松近似：

$$P\\{X=3\\} \\approx \\frac{4^3}{3!} e^{-4} = \\frac{64}{6} \\cdot 0.0183 \\approx 0.1954$$

（精确值约为0.1955，近似效果极佳）

**例3**：设 $X \\sim P(\\lambda)$，已知 $P\\{X=1\\} = P\\{X=2\\}$，求 $\\lambda$ 和 $E(X)$。

**解**：$\\frac{\\lambda^1}{1!} e^{-\\lambda} = \\frac{\\lambda^2}{2!} e^{-\\lambda}$，化简得 $\\lambda = \\frac{\\lambda^2}{2}$，故 $\\lambda = 2$，$E(X) = 2$。

### 常见误区

1. **泊松近似条件不清**：需要 $n$ 大、$p$ 小、$np$ 适中。如果 $np$ 很大（如 >20），应用正态近似而非泊松近似。
2. **λ的确定错误**：λ = np = 期望值，要正确计算实际问题的平均发生次数。
3. **混淆泊松与指数**：泊松分布描述一段时间内事件**发生次数**（离散），指数分布描述两次事件**间隔时间**（连续），两者是对偶关系。`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 200, end: 250, type: 'formula' },
        { start: 400, end: 440, type: 'emphasis' },
        { start: 600, end: 650, type: 'formula' }
      ]
    },
    extension: {
      essence: '泊松分布P(λ)的深刻本质是泊松过程在单位时间上的"快照"。泊松过程{N(t),t≥0}是具有独立增量性和平稳增量性的计数过程，N(t)~P(λt)。泊松分布中E(X)=D(X)=λ这一独特性质，源于泊松过程事件发生率恒定——既没有"聚集"也没有"疏散"的倾向。泊松定理揭示了二项分布与泊松分布的深层联系：将n重伯努利试验的时间轴无限细分（n→∞），同时保持总体期望np=λ不变，离散的二项分布就"连续化"为泊松分布。这是概率论中"离散逼近连续"思想的经典范例。',
      further: [
        { id: 'ext1', title: '泊松过程与指数分布的对偶', content: '若{N(t)}为泊松过程（参数λ），则：①N(t)~P(λt)（计数分布）；②相邻事件间隔T~Exp(λ)（时间分布）。泊松分布与指数分布从"数数"和"计时"两个角度描述同一随机现象，是同一硬币的两面。' },
        { id: 'ext2', title: '复合泊松分布', content: '若Y=Σ(i=1到N)Xᵢ，其中N~P(λ)，Xᵢ独立同分布且与N独立，则Y服从复合泊松分布。保险理赔总额、网络数据包总大小等都可用复合泊松建模，其母函数G_Y(s)=exp(λ(G_X(s)-1))。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '客服中心人员配置',
        description: '某客服中心平均每分钟收到4次来电，若1分钟内来电超过8次则需增派人手。求需增派人手的概率。',
        scenario: '设X为每分钟来电数，X~P(4)。P{X>8}=1-P{X≤8}=1-Σ(k=0到8)4ᵏ/k!·e⁻⁴≈1-0.9786=0.0214≈2.14%。约每50分钟出现一次需增派的情况。'
      },
      {
        id: 'app2',
        type: 'example',
        title: '泊松定理近似二项分布',
        description: '某批次产品次品率0.005，抽取800件，求恰好有3件次品的概率（分别用二项和泊松计算）。',
        scenario: '精确：X~B(800,0.005)，P{X=3}=C(800,3)·0.005³·0.995⁷⁹⁷≈0.1955。近似：λ=np=4，P{X=3}≈4³/3!·e⁻⁴=64/6·0.0183≈0.1954。两者几乎一致，泊松近似效果极佳。'
      }
    ],
    method: [
      { number: 1, title: '泊松分布识别法', description: '满足三条件即可用泊松：①事件在大量独立小区间中发生；②每个小区间事件发生概率很小且近似相等；③关注的是事件发生的总次数。取λ=平均发生次数。' },
      { number: 2, title: '泊松近似二项的计算技巧', description: '当n大p小时：①确定λ=np；②查泊松分布表或用公式P{X=k}=λᵏ/k!·e⁻λ；③求累积概率时逐项累加或用1减尾部。注意λ>20时改用正态近似N(λ,λ)。' }
    ]
  }
}

const continuousRVPoint: KnowledgePoint = {
  id: 'continuous-rv',
  moduleId: 'one-dim-rv',
  name: '连续型随机变量及概率密度',
  formula: 'f(x) \\geq 0, \\quad \\int_{-\\infty}^{+\\infty} f(x)dx = 1',
  coreSentence: '连续型随机变量的概率由概率密度函数的积分确定，单点概率为零是其根本特征。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x < 0 ? 0 : x < 2 ? 0.5 * x : 0', color: '#10b981', visible: true },
          { id: 'f2', expression: 'x < 0 ? 0 : x < 1 ? x * x : 1', color: '#ef4444', visible: false }
        ],
        points: [
          { id: 'p1', x: 1, y: 0.5, draggable: true, color: '#3b82f6', label: '(1, f(1))' }
        ],
        sliders: [
          { id: 'sa', name: 'a', min: 0, max: 2, step: 0.1, defaultValue: 0.5, label: '积分下限 a' },
          { id: 'sb', name: 'b', min: 0, max: 2, step: 0.1, defaultValue: 1.5, label: '积分上限 b' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '密度函数与概率的几何关系',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示概率密度曲线f(x)：非负且总面积=1', changes: { 'sa': 0, 'sb': 2 } },
            { id: 'step2', description: 'P{a<X<b}=∫ₐᵇf(x)dx：概率=曲线下面积', changes: { 'sa': 0.5, 'sb': 1.5 } },
            { id: 'step3', description: '单点概率P{X=a}=0：面积为0', changes: { 'sa': 1, 'sb': 1 } },
            { id: 'step4', description: '密度f(x)可大于1：密度不是概率！', changes: { 'sa': 0, 'sb': 0.5 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 连续型随机变量及概率密度

### 核心思想

**连续型随机变量**与离散型根本不同：它可以在某个区间内取任意值，且取任何一个**特定值**的概率都为零。其概率规律由**概率密度函数**来描述——概率等于密度函数在对应区间上的积分，也就是曲线下的面积。

### 定义

如果存在非负可积函数 $f(x)$，使得对任意实数 $x$，随机变量 $X$ 的分布函数可以表示为

$$F(x) = \\int_{-\\infty}^{x} f(t) dt$$

则称 $X$ 为**连续型随机变量**，$f(x)$ 为 $X$ 的**概率密度函数**（Probability Density Function, PDF）。

### 性质与定理

**概率密度函数的三条基本性质**：

1. **非负性**：$f(x) \\geq 0$
2. **归一性**：$\\int_{-\\infty}^{+\\infty} f(x) dx = 1$（密度曲线下的总面积为1）
3. **在连续点处**：$F'(x) = f(x)$（分布函数的导数等于密度函数）

> ⚠️ **重要**：$f(x)$ 不是概率！$f(x)$ 可以大于1（例如均匀分布U(0,0.5)的密度为2）。只有 $f(x) \\cdot dx$ 在微元意义上才代表概率。

---

**概率计算公式**：

$$P\\{a < X < b\\} = P\\{a \\leq X < b\\} = P\\{a < X \\leq b\\} = P\\{a \\leq X \\leq b\\} = \\int_a^b f(x) dx = F(b) - F(a)$$

> 连续型随机变量在单点处的概率为零：$P\\{X = a\\} = 0$。因此区间端点是否取等号不影响概率值。

---

**密度函数与分布函数的互求**：

- **由密度求分布函数**：$F(x) = \\int_{-\\infty}^{x} f(t) dt$（注意对 $x$ 分区间讨论）
- **由分布函数求密度**：$f(x) = F'(x)$（在 $F$ 可导的点处；不可导点可令 $f(x) = 0$）

---

**连续型与离散型对比**：

| 对比项 | 离散型 | 连续型 |
|--------|--------|--------|
| 概率描述 | 分布律 $P\\{X=x_k\\} = p_k$ | 密度函数 $f(x)$ |
| 归一条件 | $\\sum p_k = 1$ | $\\int f(x)dx = 1$ |
| 求概率 $P\\{X \\in B\\}$ | $\\sum_{x_k \\in B} p_k$ | $\\int_B f(x)dx$ |
| 分布函数形态 | 阶梯函数 | 处处连续函数 |
| 单点概率 | $P\\{X=a\\}$ 可 $> 0$ | $P\\{X=a\\} = 0$ |
| 端点开闭 | 影响概率 | 不影响概率 |

### 典型例题

**例1**：设随机变量 $X$ 的密度函数为 $f(x) = \\begin{cases} cx^2, & 0 < x < 1 \\\\ 0, & \\text{其他} \\end{cases}$，求：(1) 常数 $c$；(2) $P\\{X > 0.5\\}$；(3) 分布函数 $F(x)$。

**解**：
(1) 由归一性：$\\int_0^1 cx^2 dx = c \\cdot \\frac{1}{3} = 1$，故 $c = 3$。

(2) $P\\{X > 0.5\\} = \\int_{0.5}^{1} 3x^2 dx = [x^3]_{0.5}^{1} = 1 - 0.125 = 0.875$

(3) 当 $0 < x < 1$ 时：$F(x) = \\int_0^x 3t^2 dt = x^3$

$$F(x) = \\begin{cases} 0, & x \\leq 0 \\\\ x^3, & 0 < x < 1 \\\\ 1, & x \\geq 1 \\end{cases}$$

**例2**：设 $X$ 的分布函数为 $F(x) = \\begin{cases} 1 - e^{-2x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}$，求密度函数。

**解**：$f(x) = F'(x) = \\begin{cases} 2e^{-2x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}$

**例3**：设 $f(x) = \\begin{cases} A \\cos x, & |x| \\leq \\pi/2 \\\\ 0, & \\text{其他} \\end{cases}$ 为某随机变量的密度函数，求 $A$。

**解**：由归一性 $\\int_{-\\pi/2}^{\\pi/2} A\\cos x\\,dx = A[\\sin x]_{-\\pi/2}^{\\pi/2} = A \\cdot 2 = 1$，故 $A = 1/2$。

### 常见误区

1. **混淆密度与概率**：$f(x)$ 是密度（单位区间上的概率密度），不是概率。$f(x) > 1$ 是合法的。
2. **单点概率不为零**：对于**离散型**随机变量 $P\\{X=a\\}$ 可以不为0；但对于**连续型**，单点概率必为0。
3. **求分布函数忘记分段**：由密度积分求分布函数时，必须对 $x$ 的不同区间分别积分，不能笼统处理。
4. **密度函数在个别点的值**：密度函数在有限个点处的值可以任意修改（不影响积分），但通常取最简洁的表达式。`,
      highlights: [
        { start: 0, end: 15, type: 'definition' },
        { start: 250, end: 290, type: 'formula' },
        { start: 450, end: 500, type: 'emphasis' },
        { start: 650, end: 700, type: 'formula' }
      ]
    },
    extension: {
      essence: '连续型随机变量的概率密度f(x)本质上是对分布函数F(x)的Radon-Nikodym导数——即F关于勒贝格测度的"密度"。f(x)dx代表概率微元，积分∫f(x)dx则是这些微元的"累加"。连续型随机变量最深刻的特征是其分布函数F(x)绝对连续（关于勒贝格测度），这等价于F处处连续且几乎处处可导。单点概率为零P{X=a}=0是绝对连续性的直接推论。从物理类比看，密度函数犹如物质分布的线密度——某点的密度可以很大（>1），但一个点的质量始终为零，质量只分布在区间上。',
      further: [
        { id: 'ext1', title: '奇异型分布——既非离散也非连续', content: '存在既不是离散型也不是连续型的随机变量（奇异型），其分布函数连续但导数几乎处处为0，如Cantor函数。这类分布的F(x)连续（无跳跃）但不绝对连续（不能表为密度积分），在实际中罕见但理论上完善了分类。' },
        { id: 'ext2', title: '混合分布', content: '实际中常见离散与连续的混合分布，如保险理赔金额：有一定概率为0（未出险），条件非零时服从连续分布。其分布函数F(x)=p·I(x≥0)+(1-p)·G(x)，既有跳跃点又有连续部分。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '电子元件寿命的概率密度',
        description: '某电子元件寿命X（小时）的密度f(x)=λe^{-λx}(x>0)，λ=0.001。求寿命在1000到2000小时之间的概率。',
        scenario: 'P{1000<X<2000}=∫₁₀₀₀²⁰⁰⁰0.001·e⁻⁰·⁰⁰¹ˣdx=[-e⁻⁰·⁰⁰¹ˣ]₁₀₀₀²⁰⁰⁰=e⁻¹-e⁻²≈0.3679-0.1353=0.2326≈23.26%。'
      },
      {
        id: 'app2',
        type: 'example',
        title: '由分布函数求密度并验证',
        description: '设F(x)={0,x<0; sinx,0≤x≤π/2; 1,x>π/2}，求f(x)并验证归一性。',
        scenario: 'f(x)=F\'(x)={cosx, 0<x<π/2; 0, 其他}。验证：∫₀^(π/2)cosx dx=[sinx]₀^(π/2)=1-0=1 ✓。f(x)≥0对0<x<π/2成立 ✓。'
      }
    ],
    method: [
      { number: 1, title: '确定密度函数中的常数', description: '利用归一性∫f(x)dx=1建立方程求解。步骤：①写出积分；②计算定积分（含待定常数）；③令结果=1解出常数。' },
      { number: 2, title: '密度↔分布函数互推法', description: '密度→分布函数：分段积分F(x)=∫₋∞ˣf(t)dt，注意对x分区间讨论。分布函数→密度：求导f(x)=F\'(x)，注意在不可导点（如分段连接点）可令f(x)=0。' }
    ]
  }
}

const uniformExponentialPoint: KnowledgePoint = {
  id: 'uniform-exponential',
  moduleId: 'one-dim-rv',
  name: '均匀分布与指数分布',
  formula: 'f(x) = \\frac{1}{b-a}, \\quad a \\leq x \\leq b',
  coreSentence: '均匀分布描述"等可能"取值，指数分布描述"无记忆"等待时间，两者分别是最简单的连续分布和寿命模型。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f_uniform', expression: 'x < 0 ? 0 : x < 3 ? 1/3 : 0', color: '#3b82f6', visible: true },
          { id: 'f_exp', expression: 'x < 0 ? 0 : 1.5 * exp(-1.5 * x)', color: '#ef4444', visible: true }
        ],
        points: [],
        sliders: [
          { id: 'sa', name: 'a', min: -2, max: 2, step: 0.5, defaultValue: 0, label: '均匀分布下限 a' },
          { id: 'sb', name: 'b', min: 1, max: 5, step: 0.5, defaultValue: 3, label: '均匀分布上限 b' },
          { id: 'slambda', name: 'lambda', min: 0.5, max: 3, step: 0.25, defaultValue: 1.5, label: '指数分布参数 λ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '均匀与指数密度对比',
          type: 'step',
          steps: [
            { id: 'step1', description: '均匀分布U(0,3)：区间内密度恒为1/3，"等可能"取值', changes: { 'sa': 0, 'sb': 3, 'slambda': 1.5 } },
            { id: 'step2', description: '改变区间为U(1,4)：密度平移，仍为常数', changes: { 'sa': 1, 'sb': 4, 'slambda': 1.5 } },
            { id: 'step3', description: '指数分布Exp(1.5)：密度从λ处指数衰减', changes: { 'sa': 0, 'sb': 3, 'slambda': 1.5 } },
            { id: 'step4', description: '增大λ=2.5：衰减更快，短等待概率更高', changes: { 'sa': 0, 'sb': 3, 'slambda': 2.5 } },
            { id: 'step5', description: '减小λ=0.5：衰减缓慢，长等待概率更高', changes: { 'sa': 0, 'sb': 3, 'slambda': 0.5 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 均匀分布与指数分布

### 核心思想

**均匀分布**和**指数分布**是两种最基本的连续型分布。均匀分布描述"等可能"落在区间内任意位置的现象——密度函数是常数。指数分布描述"无记忆"的等待时间——已经等了s秒，再等t秒的概率与从头等t秒一样。

### 定义

**均匀分布 $U(a, b)$**：

**密度函数**：

$$f(x) = \\begin{cases} \\frac{1}{b-a}, & a \\leq x \\leq b \\\\ 0, & \\text{其他} \\end{cases}$$

**分布函数**：

$$F(x) = \\begin{cases} 0, & x < a \\\\ \\frac{x-a}{b-a}, & a \\leq x < b \\\\ 1, & x \\geq b \\end{cases}$$

---

**指数分布 $\\text{Exp}(\\lambda)$**：

**密度函数**：

$$f(x) = \\begin{cases} \\lambda e^{-\\lambda x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}$$

**分布函数**：

$$F(x) = \\begin{cases} 1 - e^{-\\lambda x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}$$

> **尾部概率**：$P\\{X > t\\} = e^{-\\lambda t}$（$t > 0$），这是指数分布最常用的计算公式。

### 性质与定理

**均匀分布的性质**：

| 性质 | 公式 |
|------|------|
| 期望 | $E(X) = \\frac{a+b}{2}$（区间的中点） |
| 方差 | $D(X) = \\frac{(b-a)^2}{12}$ |
| "等可能"含义 | $X$ 落在 $[a,b]$ 内任意等长子区间的概率相等 |

> $P\\{c < X < d\\} = \\frac{d-c}{b-a}$，子区间概率 = 子区间长度 / 总区间长度。

---

**指数分布的性质**：

| 性质 | 公式 |
|------|------|
| 期望 | $E(X) = \\frac{1}{\\lambda}$（平均等待时间） |
| 方差 | $D(X) = \\frac{1}{\\lambda^2}$ |
| $k$阶矩 | $E(X^k) = \\frac{k!}{\\lambda^k}$ |

---

**指数分布的无记忆性（核心性质）**：

**定理**：设 $X \\sim \\text{Exp}(\\lambda)$，则对任意 $s > 0, t > 0$，

$$P\\{X > s + t \\mid X > s\\} = P\\{X > t\\}$$

**完整证明**：

$$P\\{X > s + t \\mid X > s\\} = \\frac{P\\{X > s+t\\}}{P\\{X > s\\}} = \\frac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}} = e^{-\\lambda t} = P\\{X > t\\}$$

> 无记忆性的直观解释：如果一个设备的寿命服从指数分布，那么"已经正常运行s小时后，再运行t小时的概率"等于"一个新设备运行t小时的概率"——设备不会"老化"！

> **重要结论**：指数分布是**唯一**具有无记忆性的连续型随机变量分布。

---

**均匀分布与指数分布的对比**：

| 对比项 | 均匀分布 $U(a,b)$ | 指数分布 $\\text{Exp}(\\lambda)$ |
|--------|-------------------|-------------------------------|
| 密度形态 | 常数（平直） | 指数衰减 |
| 取值范围 | 有界 $[a,b]$ | 无界 $(0,+\\infty)$ |
| 核心特征 | 等可能性 | 无记忆性 |
| 物理背景 | 随机投点 | 等待时间/寿命 |
| 与泊松过程关系 | 已知1个事件在区间内，其位置~均匀 | 相邻事件间隔~指数 |

### 典型例题

**例1**：公共汽车每隔10分钟一辆，乘客到站时刻服从均匀分布U(0,10)，求候车不超过3分钟的概率。

**解**：设 $X$ 为候车时间，$X \\sim U(0, 10)$。

$$P\\{X \\leq 3\\} = \\frac{3 - 0}{10 - 0} = 0.3$$

**例2**：某设备寿命 $X \\sim \\text{Exp}(0.02)$（单位：小时），求：(1) 寿命超过50小时的概率；(2) 已运行30小时，再运行50小时的概率。

**解**：
(1) $P\\{X > 50\\} = e^{-0.02 \\times 50} = e^{-1} \\approx 0.3679$

(2) 由无记忆性：$P\\{X > 80 \\mid X > 30\\} = P\\{X > 50\\} = e^{-1} \\approx 0.3679$

**例3**：设 $X \\sim U(0, 1)$，求 $Y = -\\frac{1}{\\lambda} \\ln X$ 的分布（$\\lambda > 0$）。

**解**：当 $y > 0$ 时，$F_Y(y) = P\\{Y \\leq y\\} = P\\{-\\frac{1}{\\lambda}\\ln X \\leq y\\} = P\\{X \\geq e^{-\\lambda y}\\} = 1 - e^{-\\lambda y}$。

这正是 $\\text{Exp}(\\lambda)$ 的分布函数！所以 $Y \\sim \\text{Exp}(\\lambda)$。

> **应用**：这是计算机生成指数分布随机数的**逆变换法**：$Y = -\\frac{1}{\\lambda}\\ln U$，$U \\sim U(0,1)$。

### 常见误区

1. **均匀分布区间搞错**：确认X的取值范围是[a,b]而非[0,1]，否则密度函数写错。
2. **指数分布参数含义**：λ是"速率"（事件发生频率），1/λ是"平均等待时间"。不要混淆两者。
3. **无记忆性的适用范围**：无记忆性只在指数分布成立。人的寿命、机械磨损等有明显老化效应的不能用指数分布。
4. **均匀分布的子区间概率**：直接用长度比计算，无需积分，但必须确认子区间完全在$[a,b]$内。`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 300, end: 350, type: 'formula' },
        { start: 500, end: 560, type: 'emphasis' },
        { start: 700, end: 760, type: 'formula' }
      ]
    },
    extension: {
      essence: '均匀分布与指数分布分别代表了连续分布谱的两个极端：均匀分布是"最不确定"的分布（在给定区间上熵最大），信息量最少；指数分布在给定均值的正随机变量中同样具有最大熵。两者都与泊松过程深度关联：若{N(t)}是参数λ的泊松过程，则相邻事件间隔~Exp(λ)，而在已知某区间内恰有一个事件的条件下，该事件在区间内的位置~均匀分布。指数分布的无记忆性等价于泊松过程的独立增量性，这是两者对偶关系的数学基础。在可靠性工程中，指数分布对应"恒定失效率"（failure rate h(t)=λ为常数），是唯一具有此性质的连续分布。',
      further: [
        { id: 'ext1', title: '从指数到韦布尔：广义寿命模型', content: '韦布尔分布Weibull(λ,k)的失效率h(t)=λk(λt)^(k-1)：k<1时递减（早期失效），k=1退化为指数分布（恒定失效率），k>1时递增（老化失效）。韦布尔分布通过形状参数k统一了三种失效模式，是可靠性分析的标准工具。' },
        { id: 'ext2', title: '均匀分布与随机数生成', content: '均匀分布U(0,1)是所有随机数生成的基础：计算机伪随机数生成器产出U(0,1)随机数，再通过逆变换法F⁻¹(U)生成任意分布的随机数。例如-λ⁻¹ln(U)~Exp(λ)，Φ⁻¹(U)~N(0,1)。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '公交车候车时间分析',
        description: '某线路公交车每15分钟发一班，乘客随机到达站台。求候车超过10分钟的概率及平均候车时间。',
        scenario: '设X为候车时间，X~U(0,15)。P{X>10}=(15-10)/15=1/3≈33.3%。E(X)=(0+15)/2=7.5分钟。乘客平均需等7.5分钟。'
      },
      {
        id: 'app2',
        type: 'real',
        title: '服务器故障间隔时间',
        description: '某服务器平均每500小时出一次故障（故障间隔~Exp(λ)）。求连续运行100小时不出故障的概率，及已运行200小时后再运行100小时的概率。',
        scenario: 'λ=1/500=0.002。P{X>100}=e⁻⁰·⁰⁰²ˣ¹⁰⁰=e⁻⁰·²≈0.8187≈81.87%。由无记忆性：P{X>300|X>200}=P{X>100}=e⁻⁰·²≈81.87%，与全新服务器运行100小时概率相同。'
      }
    ],
    method: [
      { number: 1, title: '均匀分布概率速算', description: 'U(a,b)的子区间概率=子区间长度/总区间长度。P{c<X<d}=(d-c)/(b-a)，无需积分，直接算长度比。' },
      { number: 2, title: '指数分布概率计算', description: '指数分布的核心公式：P{X>t}=e⁻λᵗ（尾部概率），P{X≤t}=1-e⁻λᵗ。涉及条件概率时优先考虑无记忆性简化计算。' }
    ]
  }
}

const normalDistributionPoint: KnowledgePoint = {
  id: 'normal-distribution',
  moduleId: 'one-dim-rv',
  name: '正态分布',
  formula: 'f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
  coreSentence: '正态分布N(μ,σ²)是概率论中最重要的分布，由中心极限定理保证其在自然界中的普遍性。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*PI)*1) * exp(-(x-0)^2/(2*1^2))', color: '#3b82f6', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*PI)*0.5) * exp(-(x-0)^2/(2*0.5^2))', color: '#ef4444', visible: true }
        ],
        points: [
          { id: 'p_mu', x: 0, y: 0, draggable: true, color: '#10b981', label: 'μ=0' }
        ],
        sliders: [
          { id: 'smu', name: 'mu', min: -3, max: 3, step: 0.5, defaultValue: 0, label: '均值 μ' },
          { id: 'ssigma', name: 'sigma', min: 0.5, max: 3, step: 0.25, defaultValue: 1, label: '标准差 σ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '正态分布参数对密度的影响',
          type: 'step',
          steps: [
            { id: 'step1', description: '标准正态N(0,1)：μ=0,σ=1，峰值≈0.399', changes: { 'smu': 0, 'ssigma': 1 } },
            { id: 'step2', description: '增大σ=2：曲线变矮变宽，更分散', changes: { 'smu': 0, 'ssigma': 2 } },
            { id: 'step3', description: '减小σ=0.5：曲线变高变窄，更集中', changes: { 'smu': 0, 'ssigma': 0.5 } },
            { id: 'step4', description: '移动μ=2：整条曲线右移，中心在2', changes: { 'smu': 2, 'ssigma': 1 } },
            { id: 'step5', description: 'μ=-1,σ=1.5：中心左移且更分散', changes: { 'smu': -1, 'ssigma': 1.5 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 正态分布

### 核心思想

**正态分布**（也称高斯分布）是概率论与统计学中最重要的分布，没有之一。由**中心极限定理**保证：大量独立随机因素的叠加效应近似服从正态分布。这解释了为什么身高、测量误差、考试成绩等众多自然和社会现象都呈现"中间多、两头少"的钟形分布。

### 定义

若 $X$ 的密度函数为

$$f(x) = \\frac{1}{\\sqrt{2\\pi} \\sigma} \\exp\\left\\{-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right\\}, \\quad -\\infty < x < +\\infty$$

则称 $X$ 服从正态分布，记为 $X \\sim N(\\mu, \\sigma^2)$，其中 $\\mu \\in \\mathbb{R}$，$\\sigma > 0$。

**参数的几何意义**：
- **μ（均值）**：密度曲线的**对称中心**和**最高点位置**。μ决定曲线"在哪里"。
- **σ²（方差）**：密度曲线的**胖瘦程度**。σ越大曲线越矮胖（分散），σ越小曲线越瘦高（集中）。
- 曲线在 $x = \\mu \\pm \\sigma$ 处有**拐点**。
- 峰值为 $f(\\mu) = \\frac{1}{\\sqrt{2\\pi}\\sigma}$。

### 性质与定理

**标准正态分布 $N(0, 1)$**：

当 $\\mu = 0, \\sigma = 1$ 时，密度和分布函数专用符号：

$$\\varphi(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-x^2/2}, \\quad \\Phi(x) = \\int_{-\\infty}^{x} \\varphi(t) dt$$

**对称性**：$\\Phi(-x) = 1 - \\Phi(x)$，即 $\\Phi(0) = 0.5$。

---

**标准化变换**：

若 $X \\sim N(\\mu, \\sigma^2)$，令 $Z = \\frac{X - \\mu}{\\sigma}$，则 $Z \\sim N(0, 1)$。

> **标准化是正态概率计算的核心方法**：任何正态概率问题都通过标准化转化为查 $\\Phi$ 表。

**概率计算公式**：

$$P\\{a < X < b\\} = \\Phi\\left(\\frac{b-\\mu}{\\sigma}\\right) - \\Phi\\left(\\frac{a-\\mu}{\\sigma}\\right)$$

**常用结论**：
- $P\\{X > \\mu\\} = P\\{X < \\mu\\} = 0.5$（对称性）
- $P\\{|X - \\mu| < k\\sigma\\} = 2\\Phi(k) - 1$
- $P\\{X > a\\} = 1 - \\Phi\\left(\\frac{a-\\mu}{\\sigma}\\right)$

---

**线性变换保持正态性**：若 $X \\sim N(\\mu, \\sigma^2)$，则 $aX + b \\sim N(a\\mu + b, a^2\\sigma^2)$。

---

**3σ 原则**：

$$P\\{|X - \\mu| < \\sigma\\} = 2\\Phi(1) - 1 \\approx 68.27\\%$$
$$P\\{|X - \\mu| < 2\\sigma\\} = 2\\Phi(2) - 1 \\approx 95.45\\%$$
$$P\\{|X - \\mu| < 3\\sigma\\} = 2\\Phi(3) - 1 \\approx 99.73\\%$$

> 3σ原则表明：正态随机变量的值几乎肯定落在 $\\mu \\pm 3\\sigma$ 范围内（99.73%），超出此范围的概率仅0.27%。

---

**标准正态分布的上 $\\alpha$ 分位点**：

设 $Z \\sim N(0,1)$，对 $0 < \\alpha < 1$，若 $z_\\alpha$ 满足

$$P\\{Z > z_\\alpha\\} = \\alpha$$

则称 $z_\\alpha$ 为标准正态分布的**上 $\\alpha$ 分位点**。

等价定义：$\\Phi(z_\\alpha) = 1 - \\alpha$，即 $z_\\alpha = \\Phi^{-1}(1 - \\alpha)$。

**关键性质**：
- **对称性**：$z_{1-\\alpha} = -z_\\alpha$（由 $\\Phi(-x) = 1 - \\Phi(x)$ 推出）
- **常用值**：$z_{0.05} = 1.645$，$z_{0.025} = 1.96$，$z_{0.01} = 2.326$，$z_{0.005} = 2.576$

> 上α分位点是假设检验和置信区间理论的核心概念，$z_{0.025} = 1.96$ 在95%置信区间中频繁出现。

### 典型例题

**例1**：设 $X \\sim N(2, 4)$，求：(1) $P\\{X < 3\\}$；(2) $P\\{-1 < X < 5\\}$；(3) $P\\{|X-2| < 4\\}$。

**解**：$\\mu = 2, \\sigma = 2$

(1) $P\\{X < 3\\} = \\Phi\\left(\\frac{3-2}{2}\\right) = \\Phi(0.5) \\approx 0.6915$

(2) $P\\{-1 < X < 5\\} = \\Phi\\left(\\frac{5-2}{2}\\right) - \\Phi\\left(\\frac{-1-2}{2}\\right) = \\Phi(1.5) - \\Phi(-1.5) = 2\\Phi(1.5) - 1 \\approx 0.8664$

(3) $P\\{|X-2| < 4\\} = P\\{|X-\\mu| < 2\\sigma\\} \\approx 95.45\\%$

**例2**：设 $X \\sim N(\\mu, \\sigma^2)$，已知 $P\\{X > 2\\} = 0.0228$，$P\\{X < -0.4\\} = 0.1587$，求 $\\mu$ 和 $\\sigma$。

**解**：$P\\{X > 2\\} = 1 - \\Phi\\left(\\frac{2-\\mu}{\\sigma}\\right) = 0.0228$，故 $\\Phi\\left(\\frac{2-\\mu}{\\sigma}\\right) = 0.9772$，查表得 $\\frac{2-\\mu}{\\sigma} = 2$。

$P\\{X < -0.4\\} = \\Phi\\left(\\frac{-0.4-\\mu}{\\sigma}\\right) = 0.1587$，故 $\\frac{-0.4-\\mu}{\\sigma} = -1$。

解方程组：$2 - \\mu = 2\\sigma$，$-0.4 - \\mu = -\\sigma$，解得 $\\mu = 0.8$，$\\sigma = 0.6$。

### 常见误区

1. **混淆σ和σ²**：$N(\\mu, \\sigma^2)$中第二个参数是**方差**σ²而非标准差σ。$N(2,4)$的σ=2不是4。
2. **标准化方向错误**：$Z = (X-\\mu)/\\sigma$，是减μ除σ，不要颠倒。
3. **Φ负值查表**：利用 $\\Phi(-x) = 1 - \\Phi(x)$ 将负值转化为正值查表。
4. **忘记对称性**：正态分布关于μ对称，$P\\{X > \\mu\\} = 0.5$。
5. **上α分位点方向**：$z_\\alpha$ 满足 $P\\{Z > z_\\alpha\\} = \\alpha$（右尾概率为α），不是 $P\\{Z < z_\\alpha\\} = \\alpha$。`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 200, end: 260, type: 'formula' },
        { start: 450, end: 500, type: 'emphasis' },
        { start: 650, end: 700, type: 'formula' }
      ]
    },
    extension: {
      essence: '正态分布N(μ,σ²)的普遍性根植于中心极限定理：若X₁,X₂,...,Xₙ独立同分布（只需E(Xᵢ)=μ和D(Xᵢ)=σ²有限），则标准化和(ΣXᵢ-nμ)/(σ√n)依分布收敛到N(0,1)。这意味着无论底层分布如何，大量独立因素的叠加效应都趋向正态——这就是自然界中钟形曲线无处不在的根本原因。从信息论角度，正态分布在给定方差的分布中熵最大（最"随机"），是"最少假设"的分布选择。从特征函数看，正态分布的特征函数φ(t)=exp(iμt-σ²t²/2)具有指数二次型，这是线性变换下封闭性（aX+b仍为正态）和独立和封闭性（独立正态之和仍正态）的根源。',
      further: [
        { id: 'ext1', title: '多维正态分布', content: 'n维正态分布N(μ,Σ)由均值向量μ和协方差矩阵Σ完全确定。其密度f(x)=(2π)^(-n/2)|Σ|^(-1/2)exp{-1/2(x-μ)ᵀΣ⁻¹(x-μ)}。多维正态具有优美的性质：边际分布正态、条件分布正态、仿射变换正态、独立⇔协方差为零。' },
        { id: 'ext2', title: '对数正态分布', content: '若ln(X)~N(μ,σ²)，则X服从对数正态分布。其密度右偏（长尾），常用于金融资产价格、生物学测量等正变量建模。E(X)=exp(μ+σ²/2)，注意E(X)≠exp(μ)，Jensen不等式严格成立。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '产品质量规格设计',
        description: '某零件尺寸X~N(10, 0.04)，规格要求9.8~10.2mm为合格品。求合格率及若要合格率≥99%，σ应控制在多少？',
        scenario: '合格率=P{9.8<X<10.2}=Φ((10.2-10)/0.2)-Φ((9.8-10)/0.2)=Φ(1)-Φ(-1)=2Φ(1)-1≈0.6827≈68.27%。若P{|X-10|<0.2}≥0.99，需Φ(0.2/σ)≥0.995，0.2/σ≥2.576，σ≤0.0776mm。'
      },
      {
        id: 'app2',
        type: 'example',
        title: '正态分布标准化与查表',
        description: '设X~N(1,9)，求P{X>4}和P{-2<X<5}。',
        scenario: 'P{X>4}=1-P{X≤4}=1-Φ((4-1)/3)=1-Φ(1)=1-0.8413=0.1587≈15.87%。P{-2<X<5}=Φ((5-1)/3)-Φ((-2-1)/3)=Φ(4/3)-Φ(-1)≈Φ(1.33)-Φ(-1)≈0.9082-0.1587=0.7495≈74.95%。'
      }
    ],
    method: [
      { number: 1, title: '正态概率标准化三步法', description: '①确认X~N(μ,σ²)的参数；②标准化Z=(X-μ)/σ~N(0,1)；③查Φ表求概率，负值用Φ(-x)=1-Φ(x)转化。' },
      { number: 2, title: '3σ原则快速估算', description: '不需精确计算时的快速估计：约68%在μ±σ内，约95%在μ±2σ内，约99.7%在μ±3σ内。用于判断数据点是否异常。' }
    ]
  }
}

const rvFunctionPoint: KnowledgePoint = {
  id: 'rv-function',
  moduleId: 'one-dim-rv',
  name: '随机变量函数的分布',
  formula: 'f_Y(y) = f_X(h(y)) \\cdot |h^{\\prime}(y)|',
  coreSentence: '已知X的分布求Y=g(X)的分布，公式法适用于单调函数，分布函数法是万能方法。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f_x', expression: 'x < 0 ? 0 : x < 1 ? 1 : 0', color: '#3b82f6', visible: true },
          { id: 'f_y', expression: 'y < 0 ? 0 : y < 1 ? 0.5 / sqrt(y) : 0', color: '#ef4444', visible: true }
        ],
        points: [],
        sliders: [
          { id: 'sg', name: 'gtype', min: 0, max: 2, step: 1, defaultValue: 0, label: '变换类型(0:x² 1:2x 2:eˣ)' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: 'X与Y=g(X)的密度对比',
          type: 'step',
          steps: [
            { id: 'step1', description: 'X~U(0,1)的密度：区间[0,1]上恒为1', changes: { 'sg': 0 } },
            { id: 'step2', description: 'Y=X²的密度：f_Y(y)=1/(2√y)，0<y<1，在0处趋向无穷', changes: { 'sg': 0 } },
            { id: 'step3', description: 'Y=2X的密度：f_Y(y)=1/2，0<y<2，线性拉伸展宽', changes: { 'sg': 1 } },
            { id: 'step4', description: 'Y=eˣ的密度：f_Y(y)=1/y，1<y<e，非线性变换产生非均匀密度', changes: { 'sg': 2 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 随机变量函数的分布

### 核心思想

已知随机变量 $X$ 的分布，如何求 $Y = g(X)$ 的分布？这是概率论中的基本运算问题，在实际中极为常见——例如已知直径的分布求面积的分布、已知电压的分布求功率的分布等。主要有两种方法：**公式法**（适用于单调函数）和**分布函数法**（万能方法）。

### 定义

设 $X$ 为随机变量，$g(x)$ 为可测函数，则 $Y = g(X)$ 也是随机变量。问题：已知 $X$ 的分布（分布函数 $F_X$ 或密度 $f_X$），求 $Y$ 的分布。

### 性质与定理

**一、公式法（单调函数情形）**

**定理**：设 $Y = g(X)$，其中 $y = g(x)$ 在 $X$ 的取值范围内**严格单调**，反函数为 $x = h(y)$，且 $h(y)$ 可导。则 $Y$ 的密度函数为

$$f_Y(y) = f_X(h(y)) \\cdot |h'(y)|$$

> 公式法的本质：密度函数在变换时需要乘以**雅可比因子** $|h'(y)|$，这来自积分换元 $dx = |h'(y)| dy$，保证概率（面积）守恒。

**公式法四步操作**：

| 步骤 | 操作 | 说明 |
|------|------|------|
| ① | 求反函数 $x = h(y)$ | 解 $y = g(x)$ 得 $x$ 关于 $y$ 的表达式 |
| ② | 求导 $h'(y)$ | 对反函数关于 $y$ 求导 |
| ③ | 确定Y的取值范围 | 由X的范围和$y=g(x)$确定 |
| ④ | 代入公式 | $f_Y(y) = f_X(h(y)) \\cdot |h'(y)|$ |

> **注意**：$h'(y)$ 必须取绝对值！当 $g$ 递减时 $h'(y) < 0$，不加绝对值会得到负密度。

---

**二、分布函数法（万能方法）**

**核心思想**：先求 $Y$ 的分布函数 $F_Y(y)$，再求导得到密度 $f_Y(y) = F_Y'(y)$。

**分布函数法四步操作**：

| 步骤 | 操作 | 说明 |
|------|------|------|
| ① | 写出 $F_Y(y) = P\\{Y \\leq y\\} = P\\{g(X) \\leq y\\}$ | 从定义出发 |
| ② | 将 $g(X) \\leq y$ 等价转化为 $X$ 的范围 | **关键步骤**，需根据$g$的单调性分析 |
| ③ | 用 $F_X$ 或积分表示该概率 | 对$X$的范围求分布函数或积分 |
| ④ | 对 $F_Y(y)$ 求导得 $f_Y(y)$ | 利用 $f_Y(y) = F_Y'(y)$ |

> 分布函数法不需要 $g(x)$ 单调，适用于**任何**可测函数，是最通用、最可靠的方法。特别是在 $g(x)$ 非单调（如 $Y = X^2$）时，公式法无法直接使用，必须用分布函数法。

---

**三、分段单调情形的公式法**

若 $g(x)$ 在 $X$ 的取值范围内**分段单调**（如 $Y = X^2$ 在 $(-\\infty, 0)$ 递减、$(0, +\\infty)$ 递增），可将 $g$ 的定义域分为若干单调区间 $I_1, I_2, \\ldots$，各段反函数为 $h_1, h_2, \\ldots$，则：

$$f_Y(y) = \\sum_{i} f_X(h_i(y)) \\cdot |h_i'(y)|$$

> 例如 $Y = X^2$：当 $X > 0$ 时 $h_1(y) = \\sqrt{y}$，$|h_1'(y)| = \\frac{1}{2\\sqrt{y}}$；当 $X < 0$ 时 $h_2(y) = -\\sqrt{y}$，$|h_2'(y)| = \\frac{1}{2\\sqrt{y}}$。故 $f_Y(y) = f_X(\\sqrt{y}) \\cdot \\frac{1}{2\\sqrt{y}} + f_X(-\\sqrt{y}) \\cdot \\frac{1}{2\\sqrt{y}}$。

---

**四、离散型随机变量函数的分布**

若 $X$ 为离散型，$Y = g(X)$，则：

$$P\\{Y = y_k\\} = \\sum_{g(x_i) = y_k} P\\{X = x_i\\}$$

即将"映射到同一y值"的所有x的概率相加。

### 典型例题

**例1（公式法）**：设 $X$ 的密度为 $f_X(x) = \\begin{cases} 2x, & 0 < x < 1 \\\\ 0, & \\text{其他} \\end{cases}$，求 $Y = 3X + 1$ 的密度。

**解**：$y = 3x + 1$ 严格单调递增，反函数 $x = h(y) = \\frac{y-1}{3}$，$h'(y) = \\frac{1}{3}$。

$Y$ 的范围：$1 < y < 4$。

$$f_Y(y) = f_X\\left(\\frac{y-1}{3}\\right) \\cdot \\frac{1}{3} = 2 \\cdot \\frac{y-1}{3} \\cdot \\frac{1}{3} = \\frac{2(y-1)}{9}, \\quad 1 < y < 4$$

**例2（分布函数法）**：设 $X \\sim N(0,1)$，求 $Y = X^2$ 的密度。

**解**：$F_Y(y) = P\\{Y \\leq y\\} = P\\{X^2 \\leq y\\}$

当 $y > 0$ 时：$P\\{X^2 \\leq y\\} = P\\{-\\sqrt{y} \\leq X \\leq \\sqrt{y}\\} = \\Phi(\\sqrt{y}) - \\Phi(-\\sqrt{y}) = 2\\Phi(\\sqrt{y}) - 1$

$$f_Y(y) = F_Y'(y) = 2\\varphi(\\sqrt{y}) \\cdot \\frac{1}{2\\sqrt{y}} = \\frac{1}{\\sqrt{2\\pi y}} e^{-y/2}, \\quad y > 0$$

> 这就是自由度为1的**卡方分布** $\\chi^2(1)$！

**例3（分段单调）**：设 $X$ 的密度为 $f_X(x) = \\begin{cases} \\frac{1}{2}, & -1 < x < 1 \\\\ 0, & \\text{其他} \\end{cases}$，求 $Y = X^2$ 的密度。

**解**：$y = x^2$ 在 $(-1,0)$ 递减，$(0,1)$ 递增。反函数 $h_1(y) = -\\sqrt{y}$（$x < 0$），$h_2(y) = \\sqrt{y}$（$x > 0$），$|h_1'| = |h_2'| = \\frac{1}{2\\sqrt{y}}$。

$$f_Y(y) = f_X(-\\sqrt{y}) \\cdot \\frac{1}{2\\sqrt{y}} + f_X(\\sqrt{y}) \\cdot \\frac{1}{2\\sqrt{y}} = \\frac{1}{2} \\cdot \\frac{1}{2\\sqrt{y}} + \\frac{1}{2} \\cdot \\frac{1}{2\\sqrt{y}} = \\frac{1}{2\\sqrt{y}}, \\quad 0 < y < 1$$

### 常见误区

1. **公式法忘记绝对值**：$f_Y(y) = f_X(h(y)) \\cdot |h'(y)|$，必须取绝对值！当g递减时 $h'(y) < 0$，不加绝对值会得到负密度。
2. **非单调函数强行用公式法**：$Y = X^2$ 不是单调函数，不能直接用公式法，必须用分布函数法（或分段单调处理）。
3. **忘记确定Y的取值范围**：求出 $f_Y(y)$ 后必须指明 $y$ 的范围，否则表达式不完整。
4. **离散型函数取值合并**：若 $g(x_1) = g(x_2) = y$，则 $P\\{Y=y\\} = P\\{X=x_1\\} + P\\{X=x_2\\}$，不要遗漏。
5. **分布函数法不等式转化错误**：$g(X) \\leq y$ 转化为 $X$ 的范围时，需根据 $g$ 的单调性仔细分析，容易出错。`,
      highlights: [
        { start: 0, end: 15, type: 'definition' },
        { start: 250, end: 300, type: 'formula' },
        { start: 450, end: 510, type: 'emphasis' },
        { start: 700, end: 750, type: 'formula' }
      ]
    },
    extension: {
      essence: '随机变量函数Y=g(X)的分布问题，本质上是概率测度在可测变换下的"推前"（pushforward）问题。从测度论看，X诱导R上的概率测度μ_X(A)=P{X∈A}，Y=g(X)诱导的测度μ_Y(B)=μ_X(g⁻¹(B))。公式法中的|h\'(y)|因子是换元积分的雅可比行列式在一维的特例——它保证变换前后"概率微元"守恒：f_Y(y)dy=f_X(x)dx。在多维情形中，雅可比因子变为|det(∂h/∂y)|。分布函数法之所以"万能"，是因为它绕过了单调性要求，直接从定义F_Y(y)=P{g(X)≤y}出发，通过不等式转化处理非单调情况，是概率论中"先求分布函数再求导"这一基本策略的典范应用。',
      further: [
        { id: 'ext1', title: '多维随机变量函数的分布', content: '对(Y₁,Y₂)=g(X₁,X₂)，联合密度变换f_Y(y)=f_X(h(y))·|J|，其中J是逆变换的雅可比矩阵行列式。这是多元微积分换元积分的自然推广，在变换(Z₁=X+Y,Z₂=X-Y)等线性变换中特别简洁。' },
        { id: 'ext2', title: '随机变量的仿射变换保持正态性', content: '若X~N(μ,σ²)，则aX+b~N(aμ+b,a²σ²)。这是正态分布的重要封闭性质：线性变换不改变正态性，只改变参数。由此立即得到标准化(X-μ)/σ~N(0,1)。' }
      ]
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '圆面积的概率分布',
        description: '加工的轴的直径D~N(20,0.04)，求横截面积A=πD²/4超过314mm²的概率。',
        scenario: 'P{A>314}=P{πD²/4>314}=P{D²>400}=P{D>20}（因D>0）。D~N(20,0.04)，σ=0.2。P{D>20}=1-Φ((20-20)/0.2)=1-Φ(0)=0.5=50%。面积超过314mm²的概率为50%。'
      },
      {
        id: 'app2',
        type: 'example',
        title: 'Y=lnX的密度（对数变换）',
        description: '设X的密度f_X(x)=2x(0<x<1)，求Y=lnX的密度。',
        scenario: 'y=lnx严格递减，反函数x=h(y)=eʸ，h\'(y)=eʸ。X∈(0,1)对应Y∈(-∞,0)。f_Y(y)=f_X(eʸ)·|eʸ|=2eʸ·eʸ=2e²ʸ，-∞<y<0。验证：∫₋∞⁰2e²ʸdy=[e²ʸ]₋∞⁰=1 ✓。'
      }
    ],
    method: [
      { number: 1, title: '公式法四步', description: '①求反函数x=h(y)；②求导h\'(y)；③确定Y的取值范围；④代入f_Y(y)=f_X(h(y))·|h\'(y)|。注意：必须取绝对值！' },
      { number: 2, title: '分布函数法四步', description: '①写F_Y(y)=P{g(X)≤y}；②将g(X)≤y等价转化为X的范围；③用F_X或积分表示该概率；④对y求导得f_Y(y)。此法适用于任何函数，是非单调变换的唯一选择。' }
    ]
  }
}



const jointDistributionPoint: KnowledgePoint = {
  id: 'joint-distribution',
  moduleId: 'two-dim-rv',
  name: '二维随机变量与联合分布函数',
  formula: 'F(x,y) = P\\{X \\leq x, Y \\leq y\\}',
  coreSentence: '联合分布函数F(x,y)完整描述了二维随机变量(X,Y)的概率规律，它是研究多维概率问题的基石。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x < 0 || y < 0 ? 0 : x > 1 ? (y > 1 ? 1 : y) : (y > 1 ? x : x*y)', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'x < 0 || y < 0 ? 0 : x > 2 ? (y > 2 ? 1 : y/2) : (y > 2 ? x/2 : x*y/4)', color: '#ef4444', visible: false }
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: true, color: '#10b981', label: '(0, 0)' },
          { id: 'p2', x: 1, y: 1, draggable: true, color: '#10b981', label: '(1, 1)' }
        ],
        sliders: [
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0.5, label: '相关系数 ρ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '联合分布函数性质演示',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示联合分布函数关于x和y分别单调不减', changes: { 'rho': -0.9 } },
            { id: 'step2', description: '展示F(x,y)关于x和y均右连续', changes: { 'rho': 0.5 } },
            { id: 'step3', description: '展示F(-∞,y)=0：固定y，x趋负无穷时F趋0', changes: { 'rho': -0.9 } },
            { id: 'step4', description: '展示F(x,+∞)=F_X(x)：y趋正无穷时得到X的边缘分布', changes: { 'rho': 0.5 } },
            { id: 'step5', description: '展示F(+∞,+∞)=1：x,y均趋正无穷时F趋1', changes: { 'rho': 0.9 } },
            { id: 'step6', description: '展示矩形概率公式：P{x1<X≤x2,y1<Y≤y2}的增量表示', changes: { 'rho': 0 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 二维随机变量与联合分布函数

### 核心思想

在实际问题中，一个随机变量往往不足以描述随机现象的全部特征。例如，研究弹着点需要同时关注横坐标和纵坐标；研究人群健康状况需要同时考虑身高和体重。**二维随机变量**将两个随机变量作为一个整体来研究，**联合分布函数**则是刻画其整体概率规律的核心工具。

### 二维随机变量的严格定义

设 $(\\Omega, \\mathcal{F}, P)$ 是概率空间，$X = X(\\omega)$ 和 $Y = Y(\\omega)$ 是定义在 $\\Omega$ 上的两个随机变量（即对任意实数 $x$，$\\{\\omega : X(\\omega) \\leq x\\} \\in \\mathcal{F}$，$Y$ 同理），则称向量 $(X, Y)$ 为**二维随机变量**（或二维随机向量）。

等价条件：$(X, Y)$ 是二维随机变量 $\\Leftrightarrow$ 对任意 $x, y$，$\\{X \\leq x, Y \\leq y\\} \\in \\mathcal{F}$

> 二维随机变量不是两个随机变量的简单组合，而是一个整体。联合分布不仅包含各自的概率信息，还包含两个变量之间的关联信息——这正是多维概率论比一维丰富得多的原因。

### 联合分布函数的定义

设 $(X, Y)$ 是二维随机变量，对任意实数 $x, y$，称

$$F(x, y) = P\\{X \\leq x, Y \\leq y\\}$$

为 $(X, Y)$ 的**联合分布函数**。

$F(x, y)$ 表示随机点 $(X, Y)$ 落在以 $(x, y)$ 为右上顶点、向左下无限延伸的矩形区域 $(-\\infty, x] \\times (-\\infty, y]$ 内的概率。

### 联合分布函数的四条基本性质

1. **关于每个变量单调不减**：固定 $y$，$F(x, y)$ 关于 $x$ 单调不减；固定 $x$，$F(x, y)$ 关于 $y$ 单调不减
2. **关于每个变量右连续**：$F(x+0, y) = F(x, y)$，$F(x, y+0) = F(x, y)$
3. **边界条件**：
   - $F(-\\infty, y) = \\lim_{x \\to -\\infty} F(x, y) = 0$（对任意固定 $y$）
   - $F(x, -\\infty) = \\lim_{y \\to -\\infty} F(x, y) = 0$（对任意固定 $x$）
   - $F(-\\infty, -\\infty) = 0$，$F(+\\infty, +\\infty) = 1$
4. **非负性（矩形不等式）**：对任意 $x_1 < x_2$，$y_1 < y_2$，

$$F(x_2, y_2) - F(x_2, y_1) - F(x_1, y_2) + F(x_1, y_1) \\geq 0$$

**性质4的直观含义**：上式左端恰好等于 $P\\{x_1 < X \\leq x_2, y_1 < Y \\leq y_2\\}$，即随机点落入矩形 $(x_1, x_2] \\times (y_1, y_2]$ 的概率，自然非负。

> ⚠️ **重要**：性质4不是前三个性质的推论，而是独立的必要条件。存在满足性质1-3但不满足性质4的二元函数，它不能作为联合分布函数。**反例**：$G(x,y) = \\max(F_1(x), F_2(y))$（$F_1, F_2$ 为分布函数）满足性质1-3，但一般不满足性质4。

### 矩形区域概率公式

$$P\\{x_1 < X \\leq x_2, y_1 < Y \\leq y_2\\} = F(x_2, y_2) - F(x_2, y_1) - F(x_1, y_2) + F(x_1, y_1)$$

这是计算 $(X, Y)$ 落入任意矩形区域概率的基础公式。对于开区间、闭区间的各种组合，可通过取极限得到相应公式。

### 二维随机变量的分类

- **二维离散型**：$(X, Y)$ 只取有限或可列无限对值 $(x_i, y_j)$，概率规律由联合分布律 $p_{ij} = P\\{X=x_i, Y=y_j\\}$ 完全确定
- **二维连续型**：存在非负函数 $f(x,y)$ 使 $F(x,y) = \\int_{-\\infty}^{x}\\int_{-\\infty}^{y} f(u,v)\\,du\\,dv$，概率规律由联合密度 $f(x,y)$ 完全确定
- **混合型**：一个分量离散、一个分量连续，如 $X$ 离散、$Y$ 连续

**判断方法**：若 $(X,Y)$ 的可能值是有限或可列个点，则为离散型；若联合分布函数可表示为某非负函数的二重积分，则为连续型；否则为混合型（或奇异型）。

### 例题

**例**：设 $(X, Y)$ 的联合分布函数为 $F(x,y) = \\frac{1}{\\pi^2}(\\frac{\\pi}{2} + \\arctan x)(\\frac{\\pi}{2} + \\arctan y)$，验证 $F(+\\infty, +\\infty) = 1$。

**解**：$F(+\\infty, +\\infty) = \\frac{1}{\\pi^2} \\cdot \\pi \\cdot \\pi = 1$ ✓，此为二维Cauchy分布的联合分布函数。且 $F$ 可分解为 $F_X(x) \\cdot F_Y(y)$ 的形式，故 $X$ 与 $Y$ 独立。

### 常见误区

1. **混淆联合分布与边缘分布**：知道联合分布可求边缘分布，反之不行
2. **忽略矩形不等式**：仅验证单调性、右连续性和边界值不够，必须验证性质4
3. **边界条件不完整**：需注意 $F(-\\infty, y) = 0$ 和 $F(x, -\\infty) = 0$ 是两个不同条件`,
      highlights: [
        { start: 0, end: 20, type: 'definition' },
        { start: 120, end: 145, type: 'formula' },
        { start: 280, end: 310, type: 'emphasis' },
        { start: 450, end: 480, type: 'formula' }
      ]
    },
    extension: {
      essence: '二维随机变量的联合分布函数是将一维分布函数概念向多维的自然推广。核心思想是：多维概率问题可以归结为对联合分布函数的研究。联合分布函数的本质是"累积概率"——随机点落在特定无穷矩形区域内的概率。它不仅包含各个分量的概率信息（通过边缘分布体现），更重要的是包含了分量之间的统计关联信息。联合分布→边缘分布是确定的，但边缘分布→联合分布则需要额外的独立性假设或其他条件，这正说明了关联信息的重要性。在实际应用中，联合分布函数为多维概率计算提供了统一的框架，任何关于(X,Y)的概率都可以通过F(x,y)来计算。',
      further: [
        { id: 'f1', title: 'n维随机变量的推广', content: '联合分布函数可推广到n维：F(x₁,...,xₙ) = P{X₁≤x₁,...,Xₙ≤xₙ}。n维情形下的矩形不等式更复杂，需要所有2ⁿ个顶点处的增量的交替和≥0。这是判定一个n元函数能否作为联合分布函数的充要条件。' },
        { id: 'f2', title: 'Copula理论', content: 'Sklar定理指出，任何联合分布函数F(x,y)都可以分解为边缘分布和一个Copula函数C的复合：F(x,y)=C(F_X(x),F_Y(y))。Copula函数捕捉了变量之间的关联结构，与边缘分布完全分离，这在金融风险建模中有重要应用。' },
        { id: 'f3', title: '联合分布与测度论', content: '在测度论框架下，联合分布函数对应于R²上的Borel测度在矩形(-∞,x]×(-∞,y]上的值。Carathéodory扩张定理保证了这个测度的唯一性，从而联合分布函数完全决定了二维随机变量的概率分布。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'real', title: '弹着点位置的概率分析',
        description: '火炮射击时，弹着点坐标(X,Y)服从二维正态分布。通过联合分布函数可计算弹着点落在目标区域内的概率。',
        scenario: '设弹着点(X,Y)服从二维正态分布，X~N(0,4)，Y~N(0,9)，ρ=0.5。求弹着点落在矩形{-2≤X≤2,-3≤Y≤3}内的概率。解：利用联合分布函数，P=Φ(1)·Φ(1)+修正项（考虑相关性），需要将联合正态密度在矩形区域上做二重积分。'
      },
      {
        id: 'app2', type: 'example', title: '验证二元函数为联合分布函数',
        description: '给定二元函数，验证其是否满足联合分布函数的四条性质。',
        scenario: '判断F(x,y)=1-e^{-x}-e^{-y}+e^{-(x+y)}(x>0,y>0)是否为联合分布函数。解：(1)单调不减✓；(2)右连续✓；(3)F(-∞,y)=0, F(+∞,+∞)=1✓；(4)矩形增量=(1-e^{-(x₂-x₁)})(1-e^{-(y₂-y₁)})≥0✓。因此F是联合分布函数，且X与Y独立。'
      }
    ],
    method: [
      { number: 1, title: '验证联合分布函数法', description: '按照四条性质逐一验证：(1)分别关于x,y单调不减；(2)分别关于x,y右连续；(3)边界值F(-∞,y)=F(x,-∞)=0，F(+∞,+∞)=1；(4)矩形不等式对任意x₁<x₂,y₁<y₂成立。四条缺一不可。' },
      { number: 2, title: '利用联合分布函数计算概率', description: '将所求概率区域的边界用分布函数值表示：(1)矩形区域直接用增量公式；(2)一般区域通过矩形区域的极限或并交运算得到；(3)注意开闭区间对离散型的影响：P{X=x,Y=y}=F(x,y)-F(x-,y)-F(x,y-)+F(x-,y-)。' }
    ]
  }
}

const twoDimDiscretePoint: KnowledgePoint = {
  id: 'two-dim-discrete',
  moduleId: 'two-dim-rv',
  name: '二维离散型随机变量',
  formula: 'P\\{X=x_i, Y=y_j\\} = p_{ij}',
  coreSentence: '二维离散型随机变量的概率规律完全由联合分布律（概率分布表）确定， pij≥0且全部之和为1。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '0.2', color: '#3b82f6', visible: true },
          { id: 'f2', expression: '0.1', color: '#ef4444', visible: false }
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#10b981', label: 'p00=0.1' },
          { id: 'p2', x: 0, y: 1, draggable: false, color: '#10b981', label: 'p01=0.2' },
          { id: 'p3', x: 1, y: 0, draggable: false, color: '#f59e0b', label: 'p10=0.3' },
          { id: 'p4', x: 1, y: 1, draggable: false, color: '#f59e0b', label: 'p11=0.4' }
        ],
        sliders: [
          { id: 'm', name: 'm', min: 2, max: 5, step: 1, defaultValue: 3, label: '行数 m' },
          { id: 'n', name: 'n', min: 2, max: 5, step: 1, defaultValue: 3, label: '列数 n' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '联合分布律演示',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示联合概率分布表：列出所有(xᵢ,yⱼ)对应的pᵢⱼ', changes: { 'm': 3, 'n': 3 } },
            { id: 'step2', description: '验证性质：所有pij≥0', changes: { 'm': 3, 'n': 3 } },
            { id: 'step3', description: '验证性质：ΣΣpij=1，即0.1+0.2+0.3+0.4=1', changes: { 'm': 3, 'n': 3 } },
            { id: 'step4', description: '求边缘分布律：X的分布律由行和得到', changes: { 'm': 3, 'n': 3 } },
            { id: 'step5', description: '求边缘分布律：Y的分布律由列和得到', changes: { 'm': 3, 'n': 3 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 二维离散型随机变量

### 核心思想

如果二维随机变量 $(X, Y)$ 的所有可能取值是有限对或可列无限对，则称 $(X, Y)$ 为**二维离散型随机变量**。与一维情形类似，其概率规律完全由**联合分布律**（即各取值点的概率）确定，通常用**联合概率分布表**来直观表示。

### 联合分布律的定义

设 $(X, Y)$ 的所有可能取值为 $(x_i, y_j)$，$i, j = 1, 2, \\ldots$，则称

$$P\\{X = x_i, Y = y_j\\} = p_{ij}, \\quad i, j = 1, 2, \\ldots$$

为 $(X, Y)$ 的**联合分布律**（联合概率分布）。

### 联合概率分布表

联合分布律通常用表格表示：

| X\\Y | y₁ | y₂ | ... | P{X=xᵢ} |
|------|-----|-----|-----|----------|
| x₁ | p₁₁ | p₁₂ | ... | p₁· |
| x₂ | p₂₁ | p₂₂ | ... | p₂· |
| ... | ... | ... | ... | ... |
| P{Y=yⱼ} | p·₁ | p·₂ | ... | 1 |

其中 $p_{i\\cdot} = \\sum_j p_{ij}$ 是行和（X的边缘分布律），$p_{\\cdot j} = \\sum_i p_{ij}$ 是列和（Y的边缘分布律）。

### 联合分布律的性质

1. **非负性**：$p_{ij} \\geq 0$，对所有 $i, j$
2. **规范性**：$\\sum_i \\sum_j p_{ij} = 1$（所有概率之和为1）

> 这两条性质是联合分布律的充要条件：任何满足这两个条件的数列 $\{p_{ij}\}$ 都可以作为某个二维离散型随机变量的联合分布律。

### 联合分布函数与分布律的关系

$$F(x, y) = \\sum_{x_i \\leq x} \\sum_{y_j \\leq y} p_{ij}$$

联合分布函数是阶梯函数，在每个取值点 $(x_i, y_j)$ 处有跳跃，跳跃高度为 $p_{ij}$。

### 求联合分布律的方法详解

**方法1：古典概型法**（最直接）

利用等可能性和计数方法直接计算每个 $P\\{X=x_i, Y=y_j\\}$。适用于样本空间有限且等可能的情形。

步骤：(1)确定 $X, Y$ 的所有可能取值；(2)对每组 $(x_i, y_j)$，用排列组合计算有利情况数与总情况数之比；(3)列表并验证 $\\sum_i \\sum_j p_{ij} = 1$。

**方法2：乘法公式法**

$$P\\{X=x_i, Y=y_j\\} = P\\{X=x_i\\} \\cdot P\\{Y=y_j|X=x_i\\}$$

先求 $X$ 的边缘概率，再求在 $X=x_i$ 条件下 $Y$ 的条件概率，两者相乘。适用于条件概率容易计算的情形（如不放回抽样）。

**方法3：已知一维分布+条件分布法**

若已知 $X$ 的分布律和 $Y$ 关于 $X$ 的条件分布律，则 $p_{ij} = P\\{X=x_i\\} \\cdot P\\{Y=y_j|X=x_i\\}$。

---

### 由联合分布律求概率

已知联合分布律 $\{p_{ij}\}$ 后，任何关于 $(X,Y)$ 的事件概率都可以通过求和得到：

| 概率形式 | 计算方法 |
|---------|---------|
| $P\\{X=x_i\\}$ | 行和：$\\sum_j p_{ij}$ |
| $P\\{Y=y_j\\}$ | 列和：$\\sum_i p_{ij}$ |
| $P\\{(X,Y) \\in D\\}$ | 对 $D$ 中所有 $(x_i,y_j)$ 对应的 $p_{ij}$ 求和 |
| $P\\{X=x_i, Y=y_j\\}$ | 直接读出 $p_{ij}$ |

> **技巧**：求涉及 $(X,Y)$ 落在某区域内的概率，只需将该区域内所有格子的概率值相加。

---

### 例题

**例1**：袋中有2个红球、3个白球，从中不放回取2次，每次1个。令 $X$ 为第1次取到的红球数，$Y$ 为第2次取到的红球数，求 $(X, Y)$ 的联合分布律。

**解**：$X$ 和 $Y$ 都只能取0或1。

| X\\Y | 0 | 1 |
|------|---|---|
| 0 | 3/10 | 3/10 |
| 1 | 3/10 | 1/10 |

例如 $P\\{X=0, Y=0\\} = \\frac{3}{5} \\cdot \\frac{2}{4} = \\frac{3}{10}$。

验证：$3/10 + 3/10 + 3/10 + 1/10 = 1$ ✓

**例2**：掷两枚均匀骰子，令 $X$ 为第一枚的点数，$Y$ 为两枚点数之和，求 $(X,Y)$ 的联合分布律。

**解**：$X$ 取 $1,2,\\ldots,6$，$Y$ 取 $2,3,\\ldots,12$。对于每组 $(i,j)$：

$$P\\{X=i, Y=j\\} = P\\{X=i\\} \\cdot P\\{Y=j|X=i\\} = \\frac{1}{6} \\times \\begin{cases} \\frac{1}{6}, & \\text{若 } 1 \\leq j-i \\leq 6 \\\\ 0, & \\text{其他} \\end{cases}$$

例如 $P\\{X=2, Y=5\\} = \\frac{1}{6} \\times \\frac{1}{6} = \\frac{1}{36}$（第二枚点数为3），$P\\{X=2, Y=2\\} = 0$（不可能），$P\\{X=5, Y=13\\} = 0$（不可能）。

### 常见误区

1. **忘记验证ΣΣpij=1**：求出分布律后必须验算总和
2. **将联合分布律与边缘分布律混淆**：联合分布律提供的信息比两个边缘分布律更多
3. **在放回/不放回问题上出错**：直接影响联合分布律的计算`,
      highlights: [
        { start: 0, end: 15, type: 'definition' },
        { start: 100, end: 130, type: 'formula' },
        { start: 250, end: 280, type: 'emphasis' },
        { start: 400, end: 430, type: 'formula' }
      ]
    },
    extension: {
      essence: '二维离散型随机变量的核心工具是联合分布律（概率分布表），它以最直接的方式给出了(X,Y)在每个取值点上的概率。联合分布律的表格表示具有天然的优势：行和给出X的边缘分布律，列和给出Y的边缘分布律，每个格子除以行和（列和）给出条件分布律。从信息论角度看，联合分布律包含了两个随机变量的全部信息量——各自的概率分布以及它们之间的关联信息。联合熵H(X,Y)与边缘熵H(X)、H(Y)的差异（互信息I(X;Y)）正是衡量关联强度的指标。',
      further: [
        { id: 'f1', title: '多项分布', content: '多项分布是二维离散分布的重要推广。若n次独立试验中，每次有k种可能结果，概率分别为p₁,...,pₖ，则各结果出现次数(X₁,...,Xₖ)服从多项分布。联合分布律为P{X₁=x₁,...,Xₖ=xₖ}=n!/(x₁!...xₖ!)·p₁^x₁...pₖ^xₖ。' },
        { id: 'f2', title: '联合分布律的矩阵表示', content: '联合分布律可以用概率矩阵P=(pᵢⱼ)表示。X的边缘分布律是行向量p·j（列和），Y的边缘分布律是列向量pᵢ·（行和）。独立性等价于P可以分解为行向量和列向量的外积：pᵢⱼ=aᵢbⱼ。这种矩阵视角在信息论和统计推断中有重要应用。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'example', title: '求不放回抽样下的联合分布律',
        description: '袋中有3个红球2个白球，不放回取2次，令X为第1次取红球数，Y为第2次取红球数，求(X,Y)的联合分布律。',
        scenario: '解：X,Y均取0或1。P{X=1,Y=1}=3/5×2/4=6/20=0.3；P{X=1,Y=0}=3/5×2/4=0.3；P{X=0,Y=1}=2/5×3/4=0.3；P{X=0,Y=0}=2/5×1/4=0.1。验算：0.3+0.3+0.3+0.1=1✓。'
      },
      {
        id: 'app2', type: 'real', title: '产品质检的联合分析',
        description: '两道工序的产品合格率联合分析，第一道工序合格数X和第二道工序合格数Y的联合分布。',
        scenario: '设第一道工序合格率0.9，第二道工序在第一道合格时合格率0.95、不合格时合格率0.6。令X,Y分别为两道工序的合格指示变量。P{X=1,Y=1}=0.9×0.95=0.855，P{X=1,Y=0}=0.9×0.05=0.045，P{X=0,Y=1}=0.1×0.6=0.06，P{X=0,Y=0}=0.1×0.4=0.04。验算：0.855+0.045+0.06+0.04=1✓。'
      }
    ],
    method: [
      { number: 1, title: '古典概型直接计算法', description: '对于等可能模型，直接用"有利情况数/总情况数"计算每个pij。步骤：(1)确定X,Y的所有可能取值；(2)对每组(xi,yj)，计算P{X=xi,Y=yj}；(3)列表并验证ΣΣpij=1。' },
      { number: 2, title: '乘法公式法', description: '当直接计算困难时，利用P{X=xi,Y=yj}=P{X=xi}·P{Y=yj|X=xi}。步骤：(1)先求X的边缘分布P{X=xi}；(2)再求条件概率P{Y=yj|X=xi}；(3)相乘得联合分布律。适用于条件概率容易计算的情形。' }
    ]
  }
}

const twoDimContinuousPoint: KnowledgePoint = {
  id: 'two-dim-continuous',
  moduleId: 'two-dim-rv',
  name: '二维连续型随机变量',
  formula: 'f(x,y) \\geq 0, \\quad \\int_{-\\infty}^{+\\infty}\\int_{-\\infty}^{+\\infty} f(x,y)dxdy = 1',
  coreSentence: '二维连续型随机变量由联合概率密度函数f(x,y)完全确定，非负且全平面积分为1，概率等于密度在区域上的二重积分。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x>0 && y>0 && x+y<1 ? 2 : 0', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'x>0 && y>0 && x<1 && y<1 ? 1 : 0', color: '#ef4444', visible: false }
        ],
        points: [
          { id: 'p1', x: 0, y: 1, draggable: false, color: '#10b981', label: '(0,1)' },
          { id: 'p2', x: 1, y: 0, draggable: false, color: '#10b981', label: '(1,0)' }
        ],
        sliders: [
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0.5, label: '相关系数 ρ' },
          { id: 'sigma_x', name: 'sigma_x', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '标准差 σₓ' },
          { id: 'sigma_y', name: 'sigma_y', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '标准差 σᵧ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '联合密度函数性质与计算',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示联合密度f(x,y)≥0：在定义域内非负', changes: { 'rho': 0.5, 'sigma_x': 1, 'sigma_y': 1 } },
            { id: 'step2', description: '展示规范性：密度在全平面上的二重积分等于1', changes: { 'rho': 0.5, 'sigma_x': 1, 'sigma_y': 1 } },
            { id: 'step3', description: '计算概率：P{(X,Y)∈D}=∬_D f(x,y)dxdy', changes: { 'rho': 0.5, 'sigma_x': 1, 'sigma_y': 1 } },
            { id: 'step4', description: '展示均匀分布：f(x,y)在区域G内为1/|G|，区域外为0', changes: { 'rho': 0.5, 'sigma_x': 1, 'sigma_y': 1 } },
            { id: 'step5', description: '展示二维正态分布的等高线为椭圆', changes: { 'rho': 0.5, 'sigma_x': 1, 'sigma_y': 1 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 二维连续型随机变量

### 核心思想

与一维连续型随机变量类似，如果存在非负函数 $f(x,y)$，使得 $(X,Y)$ 的联合分布函数可以表示为二重积分的形式，则称 $(X,Y)$ 为**二维连续型随机变量**，$f(x,y)$ 为**联合概率密度函数**。联合密度函数完整描述了概率在平面上的"分布密度"。

### 联合概率密度函数的定义

设 $F(x,y)$ 为 $(X,Y)$ 的联合分布函数，若存在非负可积函数 $f(x,y)$，使得

$$F(x, y) = \\int_{-\\infty}^{x} \\int_{-\\infty}^{y} f(u, v)\\,dv\\,du$$

则称 $(X, Y)$ 为**二维连续型随机变量**，$f(x, y)$ 为**联合概率密度函数**。

### 联合密度函数的性质详解

1. **非负性**：$f(x, y) \\geq 0$（几乎处处成立）
2. **规范性（归一性）**：$\\int_{-\\infty}^{+\\infty} \\int_{-\\infty}^{+\\infty} f(x, y)\\,dx\\,dy = 1$

   归一性是确定密度函数中待定常数的关键条件。若 $f(x,y) = c \\cdot g(x,y)$，则 $c = 1 / \\iint g(x,y)\\,dxdy$。

3. **分布函数与密度的关系**：
   - $F(x,y) = \\int_{-\\infty}^{x} \\int_{-\\infty}^{y} f(u,v)\\,dv\\,du$（由密度求分布函数——二重积分）
   - 在 $f(x,y)$ 连续的点处，$f(x,y) = \\frac{\\partial^2 F}{\\partial x \\partial y}$（由分布函数求密度——二阶混合偏导）

4. **概率计算**：对任意平面区域 $D$，

$$P\\{(X, Y) \\in D\\} = \\iint_D f(x, y)\\,dx\\,dy$$

> **直观理解**：在密度函数连续的点 $(x,y)$ 处，$(X,Y)$ 落在包含该点的小面积 $\\Delta A$ 内的概率近似等于 $f(x,y) \\cdot \\Delta A$。密度 $f(x,y)$ 越大，该点附近"聚集"的概率越多。

> ⚠️ **重要**：$f(x,y)$ 的值本身不是概率，可以大于1（只要全平面积分等于1）。这与一维情形类似。

### 常见二维连续分布

#### 1. 区域G上的均匀分布

若 $(X,Y)$ 在有界区域 $G$ 上服从均匀分布，则

$$f(x,y) = \\begin{cases} \\frac{1}{|G|}, & (x,y) \\in G \\\\ 0, & \\text{其他} \\end{cases}$$

其中 $|G|$ 是区域 $G$ 的面积。

**概率计算**：对 $G$ 的任意子区域 $D \\subset G$，$P\\{(X,Y) \\in D\\} = \\frac{|D|}{|G|}$（子区域面积与总面积之比）。这正是"均匀"的含义——概率只与面积成正比，与位置无关。

**例**：$(X,Y)$ 在矩形 $[0,2] \\times [0,1]$ 上均匀分布，则 $f(x,y) = 1/2$（$0<x<2, 0<y<1$），$P\\{X>1, Y>0.5\\} = \\frac{1 \\times 0.5}{2} = 0.25$。

#### 2. 二维正态分布

$$f(x,y) = \\frac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}} \\exp\\left\\{-\\frac{1}{2(1-\\rho^2)}\\left[\\frac{(x-\\mu_1)^2}{\\sigma_1^2} - \\frac{2\\rho(x-\\mu_1)(y-\\mu_2)}{\\sigma_1\\sigma_2} + \\frac{(y-\\mu_2)^2}{\\sigma_2^2}\\right]\\right\\}$$

参数为 $\\mu_1, \\mu_2, \\sigma_1 > 0, \\sigma_2 > 0, \\rho$，其中 $|\\rho| < 1$。

五个参数的含义：
- $\\mu_1, \\mu_2$：$X$ 和 $Y$ 的均值
- $\\sigma_1^2, \\sigma_2^2$：$X$ 和 $Y$ 的方差
- $\\rho$：$X$ 与 $Y$ 的相关系数，衡量线性相关程度。$\\rho = 0$ 时 $X$ 与 $Y$ 独立

二维正态分布的等概率密度线是椭圆，$\\rho$ 决定椭圆的倾斜方向和程度。

### 例题

**例**：设 $(X,Y)$ 的联合密度为 $f(x,y) = \\begin{cases} 2, & 0 < x < y < 1 \\\\ 0, & \\text{其他} \\end{cases}$，验证规范性并求 $P\\{X + Y > 1\\}$。

**解**：规范性验证：$\\int_0^1 \\int_0^y 2\\,dx\\,dy = \\int_0^1 2y\\,dy = 1$ ✓

$P\\{X+Y>1\\} = \\int_{0.5}^1 \\int_{1-y}^y 2\\,dx\\,dy = \\int_{0.5}^1 2(2y-1)\\,dy = 2[y^2-y]_{0.5}^1 = 2 \\cdot 0.25 = 0.5$

### 常见误区

1. **积分区域确定错误**：二重积分的积分限由联合密度的定义域与所求区域的交集确定，画图辅助是关键
2. **忘记验证规范性**：密度函数中的常数因子由规范性条件确定
3. **混淆联合密度与边缘密度**：联合密度对另一个变量积分才得边缘密度`,
      highlights: [
        { start: 0, end: 15, type: 'definition' },
        { start: 100, end: 140, type: 'formula' },
        { start: 300, end: 340, type: 'formula' },
        { start: 450, end: 480, type: 'emphasis' }
      ]
    },
    extension: {
      essence: '二维连续型随机变量的核心是联合概率密度函数f(x,y)，它描述了概率在二维平面上的"分布浓度"。与一维情形类似，f(x,y)在某点的值本身不是概率，而是概率密度——点附近小面积dA内的概率约为f(x,y)·dA。二维均匀分布是最简单的连续分布：概率在区域内均匀分布，密度为面积的倒数。二维正态分布是最重要的连续分布，由五个参数完全确定，其等概率密度线是椭圆。相关系数ρ=0时，二维正态退化为两个独立一维正态的乘积，但ρ=0只对正态分布等价于独立，一般情形不成立。',
      further: [
        { id: 'f1', title: '二维正态分布的性质体系', content: '二维正态分布具有丰富性质：(1)边缘分布是一维正态；(2)条件分布也是一维正态；(3)X与Y独立⟺ρ=0⟺X与Y不相关；(4)线性变换(aX+bY,cX+dY)仍服从二维正态（若|ad-bc|≠0）；(5)等密度线为椭圆，ρ决定椭圆的倾斜方向和程度。' },
        { id: 'f2', title: '概率密度函数的几何意义', content: 'f(x,y)的图像是三维空间中的一张曲面，位于xOy平面上方（非负性），曲面下方的总体积为1（规范性）。概率P{(X,Y)∈D}等于曲面在区域D上方的体积。均匀分布对应"平顶"曲面，正态分布对应"钟形"曲面。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'example', title: '确定联合密度中的待定常数',
        description: '利用规范性条件确定联合密度函数中的常数。',
        scenario: '设f(x,y)=k·e^(-2x-y)(x>0,y>0)，求k。解：∫₀^∞∫₀^∞ k·e^(-2x-y)dxdy = k·∫₀^∞e^(-2x)dx·∫₀^∞e^(-y)dy = k·(1/2)·1 = k/2 = 1，故k=2。'
      },
      {
        id: 'app2', type: 'real', title: '到达时间的联合分布',
        description: '两辆公交车到达时间(X,Y)的联合分布与概率计算。',
        scenario: '设两辆车到达时间(X,Y)在区域{0<x<1,0<y<1}上均匀分布，求先到的一辆在30分钟内的概率。解：f(x,y)=1(0<x<1,0<y<1)。P{min(X,Y)<0.5}=1-P{X≥0.5,Y≥0.5}=1-∫₀.₅¹∫₀.₅¹1dxdy=1-0.25=0.75。'
      }
    ],
    method: [
      { number: 1, title: '确定待定常数法', description: '步骤：(1)令联合密度在全平面上的二重积分等于1；(2)计算积分（注意积分限由定义域确定）；(3)解出常数。这是求密度函数中未知常数的基本方法。' },
      { number: 2, title: '概率的二重积分计算法', description: '步骤：(1)画出联合密度的定义域和所求概率区域D；(2)确定D与定义域的交集区域；(3)选择合适的积分顺序（先x后y或先y后x）；(4)设置积分限并计算二重积分。关键是正确确定积分限，画图辅助是有效手段。' }
    ]
  }
}

const marginalDistributionPoint: KnowledgePoint = {
  id: 'marginal-distribution',
  moduleId: 'two-dim-rv',
  name: '边缘分布',
  formula: 'F_X(x) = F(x, +\\infty), \\quad f_X(x) = \\int_{-\\infty}^{+\\infty} f(x,y)dy',
  coreSentence: '边缘分布是从联合分布中"投影"得到的各分量分布，联合分布确定边缘分布，但边缘分布不能确定联合分布。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x>0 && y>0 && x+y<1 ? 2 : 0', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'x>0 && x<1 ? 2*(1-x) : 0', color: '#ef4444', visible: true }
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: true, color: '#10b981', label: '(0,0)' },
          { id: 'p2', x: 1, y: 0, draggable: false, color: '#f59e0b', label: 'fX(x)' }
        ],
        sliders: [
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0.5, label: '相关系数 ρ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '边缘分布求解过程',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示联合密度f(x,y)的定义域', changes: { 'rho': 0.5 } },
            { id: 'step2', description: '求X的边缘密度：对y积分fX(x)=∫f(x,y)dy', changes: { 'rho': 0.3 } },
            { id: 'step3', description: '求Y的边缘密度：对x积分fY(y)=∫f(x,y)dx', changes: { 'rho': 0.5 } },
            { id: 'step4', description: '验证：X和Y的边缘分布不同，但它们来自同一个联合分布', changes: { 'rho': 0.5 } },
            { id: 'step5', description: '说明：不同的联合分布可以有相同的边缘分布', changes: { 'rho': 0.5 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 边缘分布

### 核心思想

在研究二维随机变量 $(X, Y)$ 时，有时我们只关心其中某一个分量的概率分布。从联合分布中提取出各分量自身的分布，就得到**边缘分布**。"边缘"一词来源于联合概率分布表——将行（列）求和后写在表格的边缘。

### 边缘分布函数的定义

设 $(X, Y)$ 的联合分布函数为 $F(x, y)$，则：

- **X 的边缘分布函数**：$F_X(x) = F(x, +\\infty) = \\lim_{y \\to +\\infty} F(x, y)$
- **Y 的边缘分布函数**：$F_Y(y) = F(+\\infty, y) = \\lim_{x \\to +\\infty} F(x, y)$

### 离散型的边缘分布律求法

设 $(X, Y)$ 的联合分布律为 $P\\{X=x_i, Y=y_j\\} = p_{ij}$，则：

- **X 的边缘分布律**：$P\\{X = x_i\\} = p_{i\\cdot} = \\sum_{j} p_{ij}$（**行和**）
- **Y 的边缘分布律**：$P\\{Y = y_j\\} = p_{\\cdot j} = \\sum_{i} p_{ij}$（**列和**）

> 在概率分布表中，X的边缘分布律就是各行的概率之和（写在表格右侧），Y的边缘分布律就是各列的概率之和（写在表格底部）。

**求法步骤**：(1)列出联合概率分布表；(2)将每一行的 $p_{ij}$ 求和得 $p_{i\\cdot}$；(3)将每一列的 $p_{ij}$ 求和得 $p_{\\cdot j}$；(4)验算 $\\sum_i p_{i\\cdot} = 1$ 和 $\\sum_j p_{\\cdot j} = 1$。

---

### 连续型的边缘密度函数求法

设 $(X, Y)$ 的联合密度为 $f(x, y)$，则：

- **X 的边缘密度函数**：$f_X(x) = \\int_{-\\infty}^{+\\infty} f(x, y)\\,dy$
- **Y 的边缘密度函数**：$f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x, y)\\,dx$

> 求边缘密度就是对另一个变量"积分掉"——将二维信息压缩到一维。**积分限由联合密度的定义域确定**，不是一律从 $-\\infty$ 到 $+\\infty$。

**求法关键**：画图确定积分限！对 $y$ 积分时，$y$ 的范围往往依赖于 $x$；对 $x$ 积分时，$x$ 的范围往往依赖于 $y$。

---

### 核心结论：联合分布确定边缘分布，但反之不然

**由联合分布可以唯一确定边缘分布**，但**边缘分布不能确定联合分布**。

这是因为联合分布不仅包含各分量的概率信息，还包含分量之间的关联信息。两个不同的联合分布可以具有相同的边缘分布。

**反例**：设 $X, Y$ 均取 0 或 1，$P\\{X=0\\} = P\\{X=1\\} = 0.5$，$P\\{Y=0\\} = P\\{Y=1\\} = 0.5$。

- 情形A（独立）：$p_{00} = p_{01} = p_{10} = p_{11} = 0.25$
- 情形B（完全正相关）：$p_{00} = 0.5, p_{11} = 0.5, p_{01} = p_{10} = 0$

两种情形的边缘分布完全相同，但联合分布截然不同！

**例外**：如果已知 $X$ 和 $Y$ **独立**，则联合分布完全由边缘分布确定：$F(x,y) = F_X(x) \\cdot F_Y(y)$（离散型：$p_{ij} = p_{i\\cdot} \\cdot p_{\\cdot j}$）。

---

### 正态分布的边缘分布

若 $(X,Y) \\sim N(\\mu_1, \\mu_2, \\sigma_1^2, \\sigma_2^2, \\rho)$，则边缘分布仍为正态分布：

- $X \\sim N(\\mu_1, \\sigma_1^2)$
- $Y \\sim N(\\mu_2, \\sigma_2^2)$

> 注意：边缘分布不依赖于相关系数 $\\rho$！不同的 $\\rho$ 值对应不同的联合分布，但边缘分布相同。这再次印证了"联合→边缘不可逆"。

---

### 例题

**例1**：设 $(X,Y)$ 的联合密度为 $f(x,y) = \\begin{cases} 2, & 0 < x < y < 1 \\\\ 0, & \\text{其他} \\end{cases}$，求边缘密度。

**解**：X的边缘密度：$f_X(x) = \\int_x^1 2\\,dy = 2(1-x)$，$0 < x < 1$

Y的边缘密度：$f_Y(y) = \\int_0^y 2\\,dx = 2y$，$0 < y < 1$

注意 $f(x,y) \\neq f_X(x) \\cdot f_Y(y)$，故 $X$ 与 $Y$ 不独立。

**例2**：设 $(X,Y)$ 的联合分布律如下，求边缘分布律。

| X\\Y | 0 | 1 | 2 |
|------|---|---|---|
| 0 | 0.1 | 0.2 | 0.1 |
| 1 | 0.2 | 0.3 | 0.1 |

**解**：X的边缘分布律：$P\\{X=0\\} = 0.1+0.2+0.1 = 0.4$，$P\\{X=1\\} = 0.2+0.3+0.1 = 0.6$

Y的边缘分布律：$P\\{Y=0\\} = 0.1+0.2 = 0.3$，$P\\{Y=1\\} = 0.2+0.3 = 0.5$，$P\\{Y=2\\} = 0.1+0.1 = 0.2$

验证：$0.4+0.6 = 1$ ✓，$0.3+0.5+0.2 = 1$ ✓

### 常见误区

1. **积分限错误**：求边缘密度时，对y积分的下限不是-∞，而是由联合密度的定义域确定
2. **认为边缘分布能确定联合分布**：这是最常见的错误，只有独立时才行
3. **忘记写出边缘密度的定义域**：边缘密度仅在特定区间内非零`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 100, end: 140, type: 'formula' },
        { start: 250, end: 290, type: 'emphasis' },
        { start: 400, end: 440, type: 'formula' }
      ]
    },
    extension: {
      essence: '边缘分布的本质是从联合分布中"投影"或"压缩"得到各分量的分布。几何上看，联合密度f(x,y)是三维曲面，对y积分求fX(x)相当于沿y方向将概率"压扁"到x轴上——类比于三维物体沿某方向投影得到二维影子。信息论角度：联合分布包含了H(X,Y)的信息量，边缘分布只包含H(X)和H(Y)，差值I(X;Y)=H(X)+H(Y)-H(X,Y)就是互信息，即被"压缩"掉的关联信息。边缘分布不能确定联合分布，正是因为关联信息在投影中丢失了。',
      further: [
        { id: 'f1', title: '边缘分布的不可逆性', content: '给定两个边缘分布，可以构造无穷多个不同的联合分布具有相同的边缘分布。最简单的例子：X,Y均取0或1，P{X=0}=P{X=1}=0.5，P{Y=0}=P{Y=1}=0.5。联合分布可以是完全正相关的（P{X=Y}=1）或完全负相关的（P{X≠Y}=1）或独立的，边缘分布都一样。' },
        { id: 'f2', title: 'Fréchet-Hoeffding界', content: '给定边缘分布FX和FY，联合分布函数F(x,y)满足Fréchet-Hoeffding上下界：max(FX(x)+FY(y)-1, 0) ≤ F(x,y) ≤ min(FX(x), FY(y))。下界对应完全负相关，上界对应完全正相关。所有可能的联合分布都在这两个极端之间。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'example', title: '求连续型随机变量的边缘密度',
        description: '给定联合密度，求两个边缘密度函数。',
        scenario: '设f(x,y)=8xy(0<x<1,0<y<x)，求边缘密度。解：fX(x)=∫₀^x 8xy dy = 8x·[y²/2]₀^x = 4x³(0<x<1)；fY(y)=∫_y¹ 8xy dx = 8y·[x²/2]_y¹ = 4y(1-y²)(0<y<1)。'
      },
      {
        id: 'app2', type: 'real', title: '收入与消费的联合分析',
        description: '研究家庭收入X和消费Y的联合分布，通过边缘分布分别了解收入分布和消费分布。',
        scenario: '设(X,Y)的联合密度f(x,y)=k·x·y(0<x<2,0<y<1)，由规范性∫₀²∫₀¹ kxy dxdy=k·2·0.5=1得k=1。边缘密度：fX(x)=∫₀¹ xy dy=x/2(0<x<2)，fY(y)=∫₀² xy dx=2y(0<y<1)。收入X~Beta型分布，消费Y~三角形分布。'
      }
    ],
    method: [
      { number: 1, title: '离散型边缘分布律求法', description: '步骤：(1)列出联合概率分布表；(2)X的边缘分布律=各行的概率之和（行和pi·）；(3)Y的边缘分布律=各列的概率之和（列和p·j）；(4)将边缘分布律写在表格的边缘位置。' },
      { number: 2, title: '连续型边缘密度求法', description: '步骤：(1)写出联合密度f(x,y)及其定义域；(2)求fX(x)=∫f(x,y)dy——对y积分，注意积分限由定义域中y的范围（依赖于x）确定；(3)求fY(y)=∫f(x,y)dx——对x积分，注意积分限由定义域中x的范围（依赖于y）确定；(4)写出边缘密度的非零区间。画图辅助确定积分限！' }
    ]
  }
}

const conditionalDistributionPoint: KnowledgePoint = {
  id: 'conditional-distribution',
  moduleId: 'two-dim-rv',
  name: '条件分布',
  formula: 'P\\{X=x_i|Y=y_j\\} = \\frac{p_{ij}}{p_{\\cdot j}}',
  coreSentence: '条件分布是在已知一个随机变量取某值的条件下，另一个随机变量的分布，它深刻揭示了两变量之间的统计依赖关系。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x>0 && y>0 && x+y<1 ? 2 : 0', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'x>0 && x<0.6 ? 2/1.2 : 0', color: '#ef4444', visible: true }
        ],
        points: [
          { id: 'p1', x: 0.4, y: 0, draggable: true, color: '#10b981', label: 'y₀=0.4' },
          { id: 'p2', x: 0, y: 0.4, draggable: false, color: '#f59e0b', label: '条件线' }
        ],
        sliders: [
          { id: 'y_condition', name: 'y_condition', min: -2, max: 2, step: 0.1, defaultValue: 0, label: 'Y的条件值' },
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0.5, label: '相关系数 ρ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '条件分布求解演示',
          type: 'step',
          steps: [
            { id: 'step1', description: '展示联合密度f(x,y)及给定Y=y₀的"截面"', changes: { 'y_condition': 0, 'rho': 0.5 } },
            { id: 'step2', description: '离散型：P{X=xi|Y=yj}=pij/p·j，用联合概率除以Y的边缘概率', changes: { 'y_condition': 0, 'rho': 0.5 } },
            { id: 'step3', description: '连续型：f(x|y)=f(x,y)/fY(y)，用联合密度除以Y的边缘密度', changes: { 'y_condition': 0, 'rho': 0.5 } },
            { id: 'step4', description: '若X与Y独立，则条件分布=无条件分布，即f(x|y)=fX(x)', changes: { 'y_condition': 0, 'rho': 0 } },
            { id: 'step5', description: '条件分布随给定值变化而变化，反映变量间的依赖关系', changes: { 'y_condition': 1, 'rho': 0.5 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 条件分布

### 核心思想

条件分布是在已知一个随机变量取某个值的条件下，另一个随机变量的概率分布。它比边缘分布提供了更精细的信息——不仅知道各变量的分布，还知道一个变量取值对另一个变量分布的影响。条件分布是理解变量之间统计依赖关系的核心工具。

### 离散型条件分布律的完整定义

设 $(X, Y)$ 为二维离散型随机变量，联合分布律为 $p_{ij} = P\\{X=x_i, Y=y_j\\}$，则：

在 $Y = y_j$（即 $p_{\\cdot j} > 0$）的条件下，$X$ 的**条件分布律**为

$$P\\{X = x_i | Y = y_j\\} = \\frac{p_{ij}}{p_{\\cdot j}}, \\quad i = 1, 2, \\ldots$$

类似地，在 $X = x_i$ 的条件下，$Y$ 的条件分布律为

$$P\\{Y = y_j | X = x_i\\} = \\frac{p_{ij}}{p_{i\\cdot}}, \\quad j = 1, 2, \\ldots$$

**条件分布律的性质**：
1. **非负性**：$P\\{X=x_i|Y=y_j\\} \\geq 0$
2. **规范性**：$\\sum_i P\\{X=x_i|Y=y_j\\} = \\sum_i \\frac{p_{ij}}{p_{\\cdot j}} = \\frac{p_{\\cdot j}}{p_{\\cdot j}} = 1$
3. **存在条件**：仅在 $p_{\\cdot j} > 0$ 时有定义

> 条件分布律的计算口诀：**条件概率 = 联合概率 / 条件变量的边缘概率**。在概率分布表中，就是在 $Y=y_j$ 对应的列中，每个格子除以该列的列和。

### 连续型条件密度函数

设 $(X, Y)$ 为二维连续型随机变量，联合密度为 $f(x,y)$，边缘密度为 $f_X(x)$、$f_Y(y)$，则在 $Y = y$（$f_Y(y) > 0$）的条件下，$X$ 的**条件密度函数**为

$$f_{X|Y}(x|y) = \\frac{f(x, y)}{f_Y(y)}$$

类似地，$f_{Y|X}(y|x) = \\frac{f(x, y)}{f_X(x)}$

**推导思路**：对连续型随机变量，$P\\{Y=y\\} = 0$，不能直接用条件概率定义。通过极限过程：$P\\{X \\leq x | y < Y \\leq y + \\Delta y\\} = \\frac{\\int_{-\\infty}^x f(u,y)\\,du \\cdot \\Delta y}{f_Y(y) \\cdot \\Delta y} \\to \\frac{\\int_{-\\infty}^x f(u,y)\\,du}{f_Y(y)}$（$\\Delta y \\to 0$），对 $x$ 求导即得 $f_{X|Y}(x|y) = f(x,y)/f_Y(y)$。

> 条件密度的计算口诀：**条件密度 = 联合密度 / 条件变量的边缘密度**。

### 条件分布函数

由条件密度可以定义条件分布函数：

$$F_{X|Y}(x|y) = \\int_{-\\infty}^{x} f_{X|Y}(u|y)\\,du = \\int_{-\\infty}^{x} \\frac{f(u, y)}{f_Y(y)}\\,du$$

### 条件分布与独立性的关系

**$X$ 与 $Y$ 独立** $\\Leftrightarrow$ 条件分布等于无条件分布，即：

- 离散型：$P\\{X=x_i|Y=y_j\\} = P\\{X=x_i\\}$ 对所有 $i, j$ 成立
- 连续型：$f_{X|Y}(x|y) = f_X(x)$ 对所有 $x, y$ 成立

> 这给出了独立性的直观理解：如果知道 $Y$ 的取值不改变 $X$ 的分布，则 $X$ 与 $Y$ 独立。反过来，如果条件分布随给定值的变化而变化，则 $X$ 与 $Y$ 不独立——变量之间存在统计依赖。

**独立性验证**：若 $f_{X|Y}(x|y) = f_X(x)$（不依赖 $y$），则 $X$ 与 $Y$ 独立。这是判断独立性的实用方法之一。

### 乘法公式

由条件分布的定义可以直接得到：

- 离散型：$p_{ij} = p_{i\\cdot} \\cdot P\\{Y=y_j|X=x_i\\} = p_{\\cdot j} \\cdot P\\{X=x_i|Y=y_j\\}$
- 连续型：$f(x,y) = f_X(x) \\cdot f_{Y|X}(y|x) = f_Y(y) \\cdot f_{X|Y}(x|y)$

乘法公式将联合分布分解为"边缘分布 × 条件分布"，这在贝叶斯推断中是核心公式。

### 例题

**例1**：设 $(X,Y)$ 的联合密度为 $f(x,y) = \\begin{cases} 2, & 0 < x < y < 1 \\\\ 0, & \\text{其他} \\end{cases}$，求 $f_{X|Y}(x|y)$。

**解**：先求 $f_Y(y) = 2y$（$0 < y < 1$），则

$$f_{X|Y}(x|y) = \\frac{f(x,y)}{f_Y(y)} = \\frac{2}{2y} = \\frac{1}{y}, \\quad 0 < x < y$$

即在 $Y = y$ 的条件下，$X$ 服从 $(0, y)$ 上的均匀分布。条件分布随 $y$ 变化，说明 $X$ 与 $Y$ 不独立。

**例2**：设 $(X,Y)$ 的联合分布律为 $P\\{X=0,Y=0\\}=0.1$，$P\\{X=0,Y=1\\}=0.2$，$P\\{X=1,Y=0\\}=0.3$，$P\\{X=1,Y=1\\}=0.4$。求给定 $Y=0$ 时 $X$ 的条件分布律。

**解**：$p_{\\cdot 0} = 0.1 + 0.3 = 0.4$，$P\\{X=0|Y=0\\} = 0.1/0.4 = 0.25$，$P\\{X=1|Y=0\\} = 0.3/0.4 = 0.75$。已知 $Y=0$ 时 $X$ 更可能取1。

### 常见误区

1. **分母为零**：条件分布要求条件变量的边缘概率（密度）大于零
2. **条件密度定义域错误**：$f_{X|Y}(x|y)$ 中 $x$ 的范围依赖于给定的 $y$ 值
3. **混淆条件分布与联合分布**：条件分布是对一个变量归一化的结果`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 100, end: 150, type: 'formula' },
        { start: 280, end: 320, type: 'emphasis' },
        { start: 450, end: 490, type: 'formula' }
      ]
    },
    extension: {
      essence: '条件分布的哲学含义是"信息更新"：在获得Y=y的新信息后，我们对X分布的认知从先验分布fX(x)更新为后验分布f(x|y)。这正是贝叶斯统计的核心思想。从信息论角度，条件分布建立了互信息与条件熵的关系：I(X;Y)=H(X)-H(X|Y)，即互信息等于X的不确定性减去给定Y后X的剩余不确定性。条件分布还揭示了因果与关联的区别——条件分布反映统计关联，不一定反映因果关系。',
      further: [
        { id: 'f1', title: '贝叶斯推断中的条件分布', content: '贝叶斯公式本质上就是条件分布的应用：后验f(θ|data)∝f(data|θ)·f(θ)，即后验分布正比于似然函数乘以先验分布。在参数估计、假设检验中，条件分布提供了将先验知识与观测数据结合的数学框架。马尔可夫链蒙特卡洛(MCMC)方法就是通过条件分布进行采样的。' },
        { id: 'f2', title: '条件期望与回归', content: '条件分布的期望E[X|Y=y]称为回归函数，它是Y=y时X的平均水平。回归函数r(y)=E[X|Y=y]的图像就是回归曲线。最小二乘回归直线是回归函数的最佳线性近似。条件方差Var(X|Y)则衡量了在已知Y后X的剩余变异程度。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'example', title: '求离散型条件分布律',
        description: '给定联合分布律，求条件分布律。',
        scenario: '设(X,Y)的联合分布律：P{X=0,Y=0}=0.1, P{X=0,Y=1}=0.2, P{X=1,Y=0}=0.3, P{X=1,Y=1}=0.4。求P{X=xi|Y=0}。解：p·0=0.1+0.3=0.4。P{X=0|Y=0}=0.1/0.4=0.25，P{X=1|Y=0}=0.3/0.4=0.75。即已知Y=0时，X更可能取1。'
      },
      {
        id: 'app2', type: 'real', title: '医学检测中的条件概率',
        description: '已知检测结果，推算患病概率（贝叶斯公式的条件分布视角）。',
        scenario: '设患病率P(D)=0.01，检测灵敏度P(T+|D)=0.95，特异度P(T-|D̄)=0.90。求P(D|T+)。解：P(D|T+)=P(T+|D)P(D)/P(T+)=0.95×0.01/(0.95×0.01+0.10×0.99)=0.0095/0.1085≈8.76%。即使检测阳性，患病概率也不高！'
      }
    ],
    method: [
      { number: 1, title: '离散型条件分布求法', description: '步骤：(1)由联合分布律求边缘分布律（行和或列和）；(2)用条件概率公式P{X=xi|Y=yj}=pij/p·j；(3)验证条件分布律规范性（对i求和等于1）。' },
      { number: 2, title: '连续型条件密度求法', description: '步骤：(1)求条件变量的边缘密度fY(y)=∫f(x,y)dx；(2)用条件密度公式f(x|y)=f(x,y)/fY(y)；(3)确定条件密度的定义域（x的范围依赖于y）；(4)验证规范性∫f(x|y)dx=1。' }
    ]
  }
}

const rvIndependencePoint: KnowledgePoint = {
  id: 'rv-independence',
  moduleId: 'two-dim-rv',
  name: '随机变量的独立性',
  formula: 'F(x,y) = F_X(x) \\cdot F_Y(y)',
  coreSentence: '随机变量独立意味着联合分布等于边缘分布的乘积，即一个变量的取值不影响另一个变量的分布。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x>0 && x<1 && y>0 && y<1 ? 1 : 0', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'x>0 && y>0 && x+y<1 ? 2 : 0', color: '#ef4444', visible: true }
        ],
        points: [
          { id: 'p1', x: 0.5, y: 0.5, draggable: true, color: '#10b981', label: '独立情形' },
          { id: 'p2', x: 0.3, y: 0.5, draggable: true, color: '#f59e0b', label: '不独立情形' }
        ],
        sliders: [
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0, label: '相关系数 ρ' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '独立性判定演示',
          type: 'step',
          steps: [
            { id: 'step1', description: '独立：联合密度=边缘密度之积，f(x,y)=fX(x)·fY(y)', changes: { 'rho': 0 } },
            { id: 'step2', description: '独立等价条件：F(x,y)=FX(x)·FY(y)对所有x,y成立', changes: { 'rho': 0 } },
            { id: 'step3', description: '独立等价条件（离散）：pij=pi··p·j对所有i,j成立', changes: { 'rho': 0 } },
            { id: 'step4', description: '不独立反例：ρ≠0的二维正态，f(x,y)≠fX(x)·fY(y)', changes: { 'rho': 0.5 } },
            { id: 'step5', description: '独立⟹不相关，但不相关⟹̸独立（正态分布例外）', changes: { 'rho': 0 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 随机变量的独立性

### 核心思想

独立性是概率论中最重要的概念之一。两个随机变量独立意味着一个变量的取值不会对另一个变量的概率分布产生任何影响——它们"各自为政"，没有统计关联。独立性大大简化了多维概率问题的处理。

### 独立性的定义

设 $(X, Y)$ 为二维随机变量，若对任意实数 $x, y$，有

$$F(x, y) = F_X(x) \\cdot F_Y(y)$$

则称 $X$ 与 $Y$ **相互独立**。

等价地，对任意Borel集 $A, B$：$P\\{X \\in A, Y \\in B\\} = P\\{X \\in A\\} \\cdot P\\{Y \\in B\\}$

### 独立性的三个等价条件

#### 1. 分布函数层面

$X$ 与 $Y$ 独立 $\\Leftrightarrow$ $F(x, y) = F_X(x) \\cdot F_Y(y)$ 对所有 $x, y$ 成立

这是最一般的定义，适用于所有类型的随机变量（离散型、连续型、混合型）。

#### 2. 分布律层面（离散型）

$X$ 与 $Y$ 独立 $\\Leftrightarrow$ $p_{ij} = p_{i\\cdot} \\cdot p_{\\cdot j}$ 对所有 $i, j$ 成立

> 即联合概率 = 两个边缘概率之积。在概率分布表中，每个格子的值等于对应行和与列和之积。

#### 3. 密度函数层面（连续型）

$X$ 与 $Y$ 独立 $\\Leftrightarrow$ $f(x, y) = f_X(x) \\cdot f_Y(y)$ 在概率为1的集合上成立

> 即联合密度 = 两个边缘密度之积（几乎处处）。

### 独立性的判断方法

1. **定义法**：验证 $F(x,y) = F_X(x) \\cdot F_Y(y)$
2. **因子分解法**（最常用）：若 $f(x,y)$ 可以分解为 $g(x) \\cdot h(y)$ 的形式，且定义域是矩形区域（即 $x \\in A$ 且 $y \\in B$，不交叉依赖），则 $X$ 与 $Y$ 独立
3. **反证法**：找一个点使 $p_{ij} \\neq p_{i\\cdot} \\cdot p_{\\cdot j}$（或 $f(x,y) \\neq f_X(x) \\cdot f_Y(y)$），则不独立

**因子分解法的关键**：不仅要求 $f(x,y) = g(x) \\cdot h(y)$ 可分解，还要求定义域是矩形区域！例如 $f(x,y) = 2$（$0<x<y<1$）虽然是常数，但定义域是三角形（$x$ 和 $y$ 交叉依赖），所以 $X$ 与 $Y$ 不独立。

### 独立性与不相关的区别与联系

- **独立 $\\Rightarrow$ 不相关**：若 $X$ 与 $Y$ 独立，则 $\\text{Cov}(X,Y) = E(XY) - E(X)E(Y) = 0$，即相关系数 $\\rho = 0$
- **不相关 $\\not\\Rightarrow$ 独立**：$\\rho = 0$ 只说明没有**线性**关系，但可能存在**非线性**关系

**反例**：$X \\sim N(0,1)$，$Y = X^2$，则 $\\text{Cov}(X,Y) = E(X^3) - E(X)E(X^2) = 0$（不相关），但 $Y$ 完全由 $X$ 决定，显然不独立。

**重要结论——正态分布独立与不相关等价**：对**二维正态分布**，以下三者等价：
- $X$ 与 $Y$ 独立
- $X$ 与 $Y$ 不相关（$\\rho = 0$）
- $\\text{Cov}(X,Y) = 0$

> ⚠️ **常见误区**：认为"不相关就是独立"。这只是正态分布的特殊性质，一般情形下不成立。不相关只排除线性关系，独立排除一切依赖关系。

### 例题

**例**：设 $(X,Y)$ 的联合密度为 $f(x,y) = \\begin{cases} e^{-(x+y)}, & x > 0, y > 0 \\\\ 0, & \\text{其他} \\end{cases}$，判断 $X$ 与 $Y$ 是否独立。

**解**：$f_X(x) = e^{-x}(x>0)$，$f_Y(y) = e^{-y}(y>0)$，$f(x,y) = e^{-x} \\cdot e^{-y} = f_X(x) \\cdot f_Y(y)$ ✓，且定义域为 $x>0, y>0$（矩形区域），故 $X$ 与 $Y$ 独立。

**反例**：设 $f(x,y) = 2$（$0 < x < y < 1$），判断独立性。

**解**：定义域 $0 < x < y < 1$ 不是矩形区域（$x$ 的上界依赖 $y$），故 $X$ 与 $Y$ 必不独立。

### 常见误区

1. **定义域交叉依赖**：$f(x,y) = 2(0<x<y<1)$ 的定义域不是矩形，$X$ 与 $Y$ 必不独立
2. **只验证个别点**：独立性需要对所有 $x, y$ 成立，找一个反例即可否定
3. **混淆独立与不相关**：独立是更强的条件，不相关只排除线性关系`,
      highlights: [
        { start: 0, end: 10, type: 'definition' },
        { start: 100, end: 140, type: 'formula' },
        { start: 300, end: 340, type: 'emphasis' },
        { start: 500, end: 540, type: 'formula' }
      ]
    },
    extension: {
      essence: '随机变量独立性的本质是"信息可分离"——联合分布可以分解为各分量分布的乘积，意味着一个变量不携带关于另一个变量的任何信息。从测度论角度，独立性等价于σ-代数的独立性：σ(X)和σ(Y)中的任意两个事件独立。因子分解法是最实用的判断方法：联合密度能分解为x的函数乘y的函数，且定义域是矩形区域，则独立。定义域的"矩形性"常被忽略但至关重要——f(x,y)=2(0<x<y<1)虽然形式上是常数，但定义域三角形使X与Y不独立。',
      further: [
        { id: 'f1', title: 'n个随机变量的独立性', content: 'X₁,...,Xₙ相互独立的定义：F(x₁,...,xₙ)=F₁(x₁)·...·Fₙ(xₙ)。注意"两两独立"不等于"相互独立"：n个随机变量可以两两独立但整体不独立。反例需要至少3个变量，如两两独立的三个事件整体不独立。' },
        { id: 'f2', title: '独立性与信息论', content: 'X与Y独立⟺互信息I(X;Y)=0⟺H(X,Y)=H(X)+H(Y)⟺H(X|Y)=H(X)。即独立等价于X不提供关于Y的任何信息（条件熵=无条件熵）。在数据压缩中，独立变量的联合编码可以分别编码而不损失效率。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'example', title: '判断离散型随机变量的独立性',
        description: '通过验证pij=pi··p·j判断独立性。',
        scenario: '设(X,Y)的联合分布律：P{X=0,Y=0}=1/4, P{X=0,Y=1}=1/4, P{X=1,Y=0}=1/4, P{X=1,Y=1}=1/4。判断X与Y是否独立。解：p0·=1/2, p·0=1/2, p00=1/4=1/2×1/2 ✓。同理所有pij=pi··p·j ✓，故X与Y独立。'
      },
      {
        id: 'app2', type: 'real', title: '系统可靠性分析',
        description: '独立元件组成的系统，其可靠度可由各元件可靠度之积得到。',
        scenario: '两元件寿命X,Y独立，X~Exp(λ₁), Y~Exp(λ₂)。串联系统寿命N=min(X,Y)，可靠度R(t)=P{N>t}=P{X>t}P{Y>t}=e^(-λ₁t)·e^(-λ₂t)=e^(-(λ₁+λ₂)t)，即N~Exp(λ₁+λ₂)。并联系统寿命M=max(X,Y)，P{M≤t}=P{X≤t}P{Y≤t}=(1-e^(-λ₁t))(1-e^(-λ₂t))。'
      }
    ],
    method: [
      { number: 1, title: '因子分解法判断独立性', description: '步骤：(1)将联合密度f(x,y)（或分布律）写开；(2)看能否分解为g(x)·h(y)的形式；(3)检查定义域是否为矩形（x∈A且y∈B，不交叉依赖）；(4)若(2)(3)都满足则独立，否则不独立。关键：定义域的矩形性！' },
      { number: 2, title: '反证法判断不独立', description: '步骤：(1)求边缘分布；(2)找一个反例点使联合概率（密度）≠边缘之积；(3)或指出定义域不是矩形区域（如0<x<y<1是三角形区域）；(4)一个反例即可否定独立性。' }
    ]
  }
}

const twoDimFunctionPoint: KnowledgePoint = {
  id: 'two-dim-function',
  moduleId: 'two-dim-rv',
  name: '二维随机变量函数的分布',
  formula: 'Z = X + Y, \\quad f_Z(z) = \\int_{-\\infty}^{+\\infty} f(x,z-x)dx',
  coreSentence: '二维随机变量函数Z=g(X,Y)的分布可通过分布函数法或卷积公式等方法求解，是概率计算的核心技能。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'x>0 && y>0 ? Math.exp(-(x+y)) : 0', color: '#3b82f6', visible: true },
          { id: 'f2', expression: 'z>0 ? z*Math.exp(-z) : 0', color: '#ef4444', visible: true }
        ],
        points: [
          { id: 'p1', x: 1, y: 1, draggable: true, color: '#10b981', label: 'X+Y=Z' },
          { id: 'p2', x: 2, y: 0, draggable: false, color: '#f59e0b', label: 'fZ(z)' }
        ],
        sliders: [
          { id: 'a', name: 'a', min: -2, max: 3, step: 0.5, defaultValue: 1, label: '系数 a' },
          { id: 'b', name: 'b', min: -2, max: 3, step: 0.5, defaultValue: 1, label: '系数 b' }
        ]
      },
      animations: [
        {
          id: 'anim1',
          name: '二维函数分布求解演示',
          type: 'step',
          steps: [
            { id: 'step1', description: '和的分布：Z=X+Y，用卷积公式fZ(z)=∫f(x,z-x)dx', changes: { 'a': 1, 'b': 1 } },
            { id: 'step2', description: '独立指数之和：Z~Γ(2,λ)，fZ(z)=λ²ze^(-λz)', changes: { 'a': 1, 'b': 1 } },
            { id: 'step3', description: '最值分布：M=max(X,Y)，FM(z)=FX(z)·FY(z)（独立时）', changes: { 'a': 1, 'b': 1 } },
            { id: 'step4', description: '最值分布：N=min(X,Y)，1-FN(z)=(1-FX(z))(1-FY(z))', changes: { 'a': 1, 'b': 1 } },
            { id: 'step5', description: '商的分布：Z=X/Y，fZ(z)=∫|y|·f(zy,y)dy', changes: { 'a': 1, 'b': 1 } },
            { id: 'step6', description: '独立正态之和仍正态：X~N(μ₁,σ₁²), Y~N(μ₂,σ₂²) ⟹ X+Y~N(μ₁+μ₂,σ₁²+σ₂²)', changes: { 'a': 1, 'b': 1 } }
          ]
        }
      ]
    },
    explanation: {
      mainText: `## 二维随机变量函数的分布

### 核心思想

已知 $(X, Y)$ 的联合分布，求 $Z = g(X, Y)$ 的分布是概率论的基本问题。这类问题在实际中大量出现：总支出 = 食品支出 + 服装支出，收益率 = 利润/投资额，系统寿命 = min(元件寿命) 等。核心方法有**分布函数法**和**卷积公式法**。

### 和的分布（卷积公式）

设 $(X, Y)$ 的联合密度为 $f(x, y)$，$Z = X + Y$，则 $Z$ 的密度为

$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f(x, z - x)\\,dx$$

**若 $X$ 与 $Y$ 独立**，卷积公式简化为：

$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) \\cdot f_Y(z - x)\\,dx$$

> 卷积公式的推导：先求分布函数 $F_Z(z) = P\\{X + Y \\leq z\\} = \\iint_{x+y \\leq z} f(x,y)\\,dxdy = \\int_{-\\infty}^{+\\infty} \\int_{-\\infty}^{z-x} f(x,y)\\,dy\\,dx$，再对 $z$ 求导。

### 独立正态变量之和仍正态

若 $X \\sim N(\\mu_1, \\sigma_1^2)$，$Y \\sim N(\\mu_2, \\sigma_2^2)$，且 $X$ 与 $Y$ 独立，则

$$X + Y \\sim N(\\mu_1 + \\mu_2, \\sigma_1^2 + \\sigma_2^2)$$

> 这是正态分布最重要的性质之一：独立正态变量的线性组合仍服从正态分布。更一般地，$aX + bY \\sim N(a\\mu_1 + b\\mu_2, a^2\\sigma_1^2 + b^2\\sigma_2^2)$。

### 最值分布

设 $X$ 与 $Y$ 独立，$M = \\max(X, Y)$，$N = \\min(X, Y)$。

**最大值的分布**：

$$F_M(z) = P\\{M \\leq z\\} = P\\{X \\leq z, Y \\leq z\\} = F_X(z) \\cdot F_Y(z)$$

**最小值的分布**：

$$F_N(z) = P\\{N \\leq z\\} = 1 - P\\{N > z\\} = 1 - (1 - F_X(z))(1 - F_Y(z))$$

> 推广到 $n$ 个独立变量：$F_{\\max}(z) = \\prod_{i=1}^n F_i(z)$，$F_{\\min}(z) = 1 - \\prod_{i=1}^n (1 - F_i(z))$

### 商的分布

设 $(X, Y)$ 的联合密度为 $f(x,y)$，$Z = X/Y$，则

$$f_Z(z) = \\int_{-\\infty}^{+\\infty} |y| \\cdot f(zy, y)\\,dy$$

### 分布函数法（万能方法）

对 $Z = g(X, Y)$，步骤为：

1. 写出 $F_Z(z) = P\\{g(X, Y) \\leq z\\}$
2. 将不等式 $g(x, y) \\leq z$ 确定的区域用联合密度积分表示
3. 计算二重积分得到 $F_Z(z)$
4. 求导得 $f_Z(z) = F_Z'(z)$

### 例题

**例**：设 $X \\sim \\text{Exp}(1)$，$Y \\sim \\text{Exp}(1)$ 独立，求 $Z = X + Y$ 的密度。

**解**：由卷积公式，$f_Z(z) = \\int_0^z e^{-x} \\cdot e^{-(z-x)}\\,dx = \\int_0^z e^{-z}\\,dx = z e^{-z}$（$z > 0$）

即 $Z \\sim \\Gamma(2, 1)$。

### 常见误区

1. **卷积公式积分限错误**：$f_X(x)$ 和 $f_Y(z-x)$ 同时非零的范围确定积分限
2. **忘记对分布函数求导**：用分布函数法求密度时，最后一步求导不可遗漏
3. **最值分布混淆max和min**：max用"都≤"取乘积，min用"都>"取乘积再求补`,
      highlights: [
        { start: 0, end: 15, type: 'definition' },
        { start: 100, end: 140, type: 'formula' },
        { start: 300, end: 340, type: 'formula' },
        { start: 500, end: 540, type: 'emphasis' }
      ]
    },
    extension: {
      essence: '二维随机变量函数Z=g(X,Y)的分布求解本质上是坐标变换问题——从(X,Y)坐标系变换到(Z,W)坐标系（W为辅助变量），再对W积分（边缘化）得到Z的分布。卷积公式是坐标变换(x,y)→(x,z=x+y)的特例。最值分布的公式来源于事件逻辑：max≤z等价于"每个都≤z"（取交集），min≤z等价于"至少一个≤z"（取并集的补）。独立正态之和仍正态是正态分布在卷积运算下的封闭性，这一性质使得正态分布在线性变换下保持不变，是中心极限定理成立的基础。',
      further: [
        { id: 'f1', title: '变量变换法（雅可比方法）', content: '设Z=g₁(X,Y), W=g₂(X,Y)有连续偏导且变换一一对应，则f(z,w)=f(x,y)·|J|⁻¹，其中J=∂(x,y)/∂(z,w)是逆变换的雅可比行列式。再对w积分得fZ(z)=∫f(z,w)dw。这是求二维函数分布的通用方法，卷积公式和商的公式都是其特例。' },
        { id: 'f2', title: '顺序统计量', content: 'n个独立同分布随机变量X₁,...,Xₙ按大小排列得到X₍₁₎≤X₍₂₎≤...≤X₍ₙ₎，称为顺序统计量。X₍₁₎=min的分布：F₍₁₎(z)=1-(1-F(z))ⁿ；X₍ₙ₎=max的分布：F₍ₙ₎(z)=F(z)ⁿ；第k个顺序统计量的密度：f₍ₖ₎(z)=n!/(k-1)!(n-k)!·F(z)^(k-1)·(1-F(z))^(n-k)·f(z)。在可靠性统计和非参数统计中有重要应用。' }
      ]
    },
    applications: [
      {
        id: 'app1', type: 'example', title: '独立均匀变量之和的分布',
        description: '求两个独立均匀分布U(0,1)随机变量之和的分布。',
        scenario: '设X,Y独立且均服从U(0,1)，求Z=X+Y的密度。解：由卷积公式，fZ(z)=∫fX(x)fY(z-x)dx。当0<z<1时，fZ(z)=∫₀ᶻ1·1dx=z；当1<z<2时，fZ(z)=∫_(z-1)¹1·1dx=2-z。即fZ(z)=z(0<z<1), 2-z(1<z<2)，这是一个三角形分布（两个均匀分布的卷积）。'
      },
      {
        id: 'app2', type: 'real', title: '并联系统可靠度计算',
        description: '两个独立元件并联，求系统寿命的分布。',
        scenario: '设两元件寿命X~Exp(0.01), Y~Exp(0.02)独立，并联系统寿命M=max(X,Y)。解：FM(t)=FX(t)·FY(t)=(1-e^(-0.01t))(1-e^(-0.02t))=1-e^(-0.01t)-e^(-0.02t)+e^(-0.03t)。密度fM(t)=0.01e^(-0.01t)+0.02e^(-0.02t)-0.03e^(-0.03t)。系统平均寿命E[M]=1/0.01+1/0.02-1/0.03=100+50-33.3=116.7小时。'
      }
    ],
    method: [
      { number: 1, title: '分布函数法（万能方法）', description: '步骤：(1)写出FZ(z)=P{g(X,Y)≤z}；(2)用联合密度在不等式g(x,y)≤z确定的区域上做二重积分；(3)计算积分得FZ(z)（注意z的不同取值范围）；(4)求导fZ(z)=F\'Z(z)。适用于所有情形，但计算可能较复杂。' },
      { number: 2, title: '卷积公式法（和的分布专用）', description: '步骤：(1)确认Z=X+Y且X,Y独立；(2)写出fZ(z)=∫fX(x)·fY(z-x)dx；(3)由fX(x)和fY(z-x)同时非零确定积分限；(4)计算积分。注意积分限通常随z变化——不同z的范围可能有不同的积分限。' }
    ]
  }
}

// ---- 第四章 随机变量的数字特征 ----

const expectationPoint: KnowledgePoint = {
  id: 'expectation',
  moduleId: 'digital-features',
  name: '数学期望',
  formula: 'E(X) = \\sum_{k} x_k p_k \\quad (\\text{离散}), \\quad E(X) = \\int_{-\\infty}^{+\\infty} xf(x)dx \\quad (\\text{连续})',
  coreSentence: '数学期望是随机变量的"加权平均中心"——用概率作权重，把所有可能值拉到一起取平均。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '0.2*exp(-(x-1)^2/0.5)+0.3*exp(-(x-3)^2/0.5)+0.5*exp(-(x-5)^2/0.5)', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 1, y: 0, draggable: false, color: '#1565C0', label: 'x₁=1, p₁=0.2' },
          { id: 'p2', x: 3, y: 0, draggable: false, color: '#2E7D32', label: 'x₂=3, p₂=0.3' },
          { id: 'p3', x: 5, y: 0, draggable: false, color: '#FF6F00', label: 'x₃=5, p₃=0.5' },
          { id: 'pe', x: 3.6, y: 0, draggable: false, color: '#C62828', label: 'E(X)=3.6' },
        ],
        sliders: [
          { id: 'p', name: 'p', min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.5, label: '成功概率 p' },
          { id: 'n', name: 'n', min: 1, max: 20, step: 1, defaultValue: 10, label: '试验次数 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '概率加权平均',
          type: 'step',
          steps: [
            { id: 's1', description: '初始：p=0.5, n=10，二项分布的期望E(X)=np=5', changes: { p: 0.5, n: 10 } },
            { id: 's2', description: '计算：E(X) = np，概率与次数共同决定期望', changes: { p: 0.5, n: 10 } },
            { id: 's3', description: '增大p：概率越大，期望越偏向成功次数上限', changes: { p: 0.8, n: 10 } },
            { id: 's4', description: '增大n：试验次数越多，期望越大', changes: { p: 0.5, n: 20 } },
            { id: 's5', description: '小p小n：E(X)=np，期望较小', changes: { p: 0.2, n: 5 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：概率加权的平均**

数学期望，简称"期望"，是随机变量最重要的数字特征。它回答了一个基本问题：如果大量重复试验，随机变量取值的"平均水平"是什么？

但这里说的"平均"，不是简单的算术平均，而是**概率加权平均**——概率大的值对平均的贡献更大。

---

**📐 离散型随机变量的期望**

设离散型随机变量X的分布律为P{X=xₖ}=pₖ（k=1,2,...），若级数∑|xₖ|pₖ收敛，则：

$$E(X) = \\sum_{k=1}^{\\infty} x_k p_k$$

**直观理解**：想象一个不均匀的骰子，各面概率不同。掷很多次取平均，这个平均就是期望。概率大的面出现次数多，对平均的贡献自然更大。

**例子**：X的分布律为 P{X=1}=0.2, P{X=3}=0.3, P{X=5}=0.5
$$E(X) = 1×0.2 + 3×0.3 + 5×0.5 = 0.2 + 0.9 + 2.5 = 3.6$$

注意：E(X)不一定等于任何一个可能的取值！

---

**📐 连续型随机变量的期望**

设连续型随机变量X的密度函数为f(x)，若∫|x|f(x)dx收敛，则：

$$E(X) = \\int_{-\\infty}^{+\\infty} x f(x) dx$$

**直观理解**：把连续情况看作离散的极限——将取值区间无限细分，每个小区间[x, x+dx]上的"概率"≈f(x)dx，"贡献"≈x·f(x)dx，求和取极限即得积分。

**例子**：X~U(a,b)均匀分布，E(X) = ∫ₐᵇ x·(1/(b-a))dx = (a+b)/2

---

**📐 随机变量函数的期望（重要！）**

不必先求Y=g(X)的分布，可以直接用X的分布计算：

- 离散型：E[g(X)] = ∑g(xₖ)pₖ
- 连续型：E[g(X)] = ∫g(x)f(x)dx

**二维情形**：E[g(X,Y)] = ∑∑g(xᵢ,yⱼ)pᵢⱼ 或 ∫∫g(x,y)f(x,y)dxdy

**例子**：X~U(0,1)，求E(X²)
直接算：E(X²) = ∫₀¹ x²·1 dx = 1/3，无需先求X²的分布！

---

**📐 期望的性质（核心工具）**

**性质1（线性性）**：E(aX+bY) = aE(X)+bE(Y)
- 推论：E(aX+b) = aE(X)+b
- **不要求X、Y独立！** 这是期望最强大的性质

**性质2（常数提取）**：E(c) = c（常数的期望等于自身）

**性质3（独立乘积）**：若X、Y独立，则E(XY) = E(X)·E(Y)
- **注意**：反之不成立！E(XY)=E(X)E(Y)推不出独立
- **注意**：不独立时E(XY)≠E(X)E(Y)也可能成立

**性质4（乘积拆分技巧）**：E(XY) = E(X)E(Y) + Cov(X,Y)

---

**📐 期望与中位数、众数的区别**

期望、中位数、众数都刻画分布的"中心"，但含义不同：

| 特征 | 定义 | 特点 |
|------|------|------|
| 期望E(X) | 概率加权平均 | 受极端值影响大，可能不存在 |
| 中位数m | P{X≤m}=0.5 | 不受极端值影响，必存在 |
| 众数 | 使f(x)最大的x | 可能有多个，不一定唯一 |

**例子**：收入分布通常是右偏的，少数高收入者拉高期望，所以"平均收入">"中位收入">"众数收入"。中位数更能反映"普通人的收入水平"。

**选择原则**：对称分布用期望，偏态分布用中位数更稳健。

---

**📐 条件期望**

条件期望E(X|Y=y)是在Y=y条件下X的平均水平，它是一个关于y的函数。将y换成随机变量Y，E(X|Y)也是一个随机变量。

**全期望公式（期望版全概率公式）**：

$$E(X) = E[E(X|Y)]$$

**理解**：先对Y的每个取值求条件期望，再对条件期望求期望。将复杂的期望计算分解为"先分类再平均"。

**例子**：某工厂有3条产线，第i条产线产量占比pᵢ，次品率qᵢ。则总次品率E(X) = ∑pᵢqᵢ = E[E(X|产线)]。

---

**📐 期望不存在的例子**

**柯西分布**：f(x) = 1/[π(1+x²)]

∫|x|f(x)dx = (1/π)∫|x|/(1+x²)dx 发散！

因此E(X)不存在。柯西分布的"尾巴太厚"，即使×x后积分仍不收敛。

**启示**：期望并非总是存在的——前提是级数/积分**绝对收敛**。只条件收敛也不行（Riemann重排定理会导致不同排列有不同"期望"）。

---

**📐 常见分布期望汇总**

| 分布 | E(X) |
|------|------|
| 0-1分布B(1,p) | p |
| 二项分布B(n,p) | np |
| 泊松分布P(λ) | λ |
| 几何分布Geo(p) | 1/p |
| 均匀分布U(a,b) | (a+b)/2 |
| 指数分布Exp(λ) | 1/λ |
| 正态分布N(μ,σ²) | μ |
| Γ分布Γ(α,β) | α/β |

**记忆技巧**：二项=np（n次×每次概率），泊松=λ（参数即期望），指数=1/λ（速率的倒数=平均时间），均匀=中点。

---

**⚠️ 常见误区**

**误区1**："E(X²) = [E(X)]²"
- **纠正**：一般不成立！E(X²) ≥ [E(X)]²（方差非负性）
- 只有X为常数时才相等

**误区2**："E(XY) = E(X)·E(Y)"
- **纠正**：这需要X、Y独立才成立，或者Cov(X,Y)=0

**误区3**："期望一定等于某个可能取值"
- **纠正**：X取1或2，E(X)可能是1.5，不是X的可能取值

**误区4**："期望一定存在"
- **纠正**：柯西分布等厚尾分布的期望不存在，前提是级数/积分绝对收敛`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 260, end: 310, type: 'formula' },
        { start: 470, end: 530, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：期望是"重心"**

数学期望的本质是随机变量的**概率重心**（质心）。在力学模型中，若将概率pₖ看作质量，xₖ看作位置，则E(X)恰好是质点系的**重心坐标**。

这个类比极其深刻：
1. **重心稳定**：期望是分布的"平衡点"，是随机变量最可能的"聚集中心"
2. **矩与力矩**：E[(X-a)ᵏ]类比于绕a点的k阶力矩，这正是"矩"命名的由来
3. **方差与转动惯量**：D(X)=E[(X-EX)²]类比于绕重心的转动惯量，衡量质量分布的离散程度

期望不存在的例子：柯西分布f(x)=1/[π(1+x²)]，∫|x|f(x)dx发散，因此E(X)不存在。这说明期望并非总是存在的——前提是级数/积分绝对收敛。`,
      extension: `**🚀 条件期望与全期望公式**

条件期望E(X|Y)是给定Y后X的平均水平，它是一个关于Y的随机变量。

**全期望公式（期望版全概率公式）**：
$$E(X) = E[E(X|Y)]$$

这是概率论中最优雅的公式之一。它将复杂的期望计算分解为"先分类再平均"——对Y的每个取值求条件期望，再对条件期望求期望。应用极广，如马尔可夫链、排队论等。`,
      further: [
        { id: 'f1', title: 'Jensen不等式', content: '若φ是凸函数，则φ(E(X)) ≤ E(φ(X))\n\n典型应用：\n- φ(x)=x² → [E(X)]² ≤ E(X²)，即D(X)≥0\n- φ(x)=1/x → E(1/X) ≥ 1/E(X)（调和均值≤算术均值）\n- φ(x)=-lnx → E(-lnX) ≥ -ln(E(X))，即信息熵≥0\n\nJensen不等式是信息论、凸优化的基石。' },
        { id: 'f2', title: '期望的物理意义', content: '在统计力学中，E(X)对应系综平均。时间平均=系综平均（各态历经假设），这是统计力学的根基。\n\n在金融中，E(X)是资产的期望收益，但金融更关心的是风险（方差、VaR），而非单纯的期望。Markowitz均值-方差模型就是同时考虑期望和方差的经典框架。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '保险定价',
        description: `**问题**

某保险公司承保1000份保单，每份保单的赔付金额X（万元）分布律为：
P{X=0}=0.9, P{X=5}=0.07, P{X=20}=0.025, P{X=50}=0.005

求：①每份保单的平均赔付额 ②若利润率为20%，保费应定为多少？

**解**

①E(X) = 0×0.9 + 5×0.07 + 20×0.025 + 50×0.005
= 0 + 0.35 + 0.5 + 0.25 = 1.1（万元）

②保费 = E(X)×(1+利润率) = 1.1×1.2 = 1.32（万元）

这就是保险定价的"纯保费+附加保费"原理。`,
        scenario: '调整赔付概率，观察期望赔付和保费的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '随机变量函数的期望',
        description: `**问题**

随机变量X的密度函数f(x) = 2x，0<x<1。求E(X)，E(X²)，E(eˣ)。

**解**

E(X) = ∫₀¹ x·2x dx = ∫₀¹ 2x² dx = 2x³/3|₀¹ = 2/3

E(X²) = ∫₀¹ x²·2x dx = ∫₀¹ 2x³ dx = 2x⁴/4|₀¹ = 1/2

E(eˣ) = ∫₀¹ eˣ·2x dx = 2[xeˣ - eˣ]|₀¹ = 2[e - e - 0 + 1] = 2

注意：E(X²) = 1/2 ≠ [E(X)]² = 4/9，验证了D(X) = 1/2 - 4/9 = 1/18 > 0`,
        scenario: '调整密度函数参数，观察不同函数的期望。',
      },
    ],
    method: [
      { number: 1, title: '定义法求期望', description: `①确定X的分布（分布律或密度函数）\n②对离散型：E(X) = ∑xₖpₖ\n③对连续型：E(X) = ∫xf(x)dx\n④检查级数/积分的绝对收敛性` },
      { number: 2, title: '性质法求期望', description: `①将复杂随机变量分解为简单变量的线性组合\n②利用线性性：E(aX+bY) = aE(X)+bE(Y)\n③常见分解：E(X₁+X₂+...+Xₙ) = ∑E(Xᵢ)\n④优势：不需要求联合分布！` },
      { number: 3, title: '函数期望法', description: `①不求Y=g(X)的分布\n②直接用X的分布：E[g(X)] = ∫g(x)f(x)dx\n③这是计算期望最快捷的方法` },
    ],
  },
}

const variancePoint: KnowledgePoint = {
  id: 'variance',
  moduleId: 'digital-features',
  name: '方差',
  formula: 'D(X) = E[(X-EX)^2] = E(X^2) - (EX)^2',
  coreSentence: '方差衡量随机变量的"离散程度"——偏离期望越远、概率越大，方差越大。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*sigma)*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159)*1)*exp(-(x-0)^2/2)', color: '#1565C0', visible: true },
          { id: 'f3', expression: '1/(sqrt(2*3.14159)*3)*exp(-(x-0)^2/18)', color: '#2E7D32', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#FF6F00', label: 'μ=0' },
        ],
        sliders: [
          { id: 'mu', name: 'mu', min: -5, max: 5, step: 0.5, defaultValue: 0, label: '均值μ' },
          { id: 'sigma', name: 'sigma', min: 0.5, max: 4, step: 0.25, defaultValue: 1, label: '标准差σ' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '不同方差下数据分散程度',
          type: 'step',
          steps: [
            { id: 's1', description: 'σ=0.5：数据高度集中，方差=0.25', changes: { mu: 0, sigma: 0.5 } },
            { id: 's2', description: 'σ=1：标准正态，方差=1', changes: { mu: 0, sigma: 1 } },
            { id: 's3', description: 'σ=2：数据明显分散，方差=4', changes: { mu: 0, sigma: 2 } },
            { id: 's4', description: 'σ=3：高度离散，方差=9', changes: { mu: 0, sigma: 3 } },
            { id: 's5', description: 'σ=4：极度分散，方差=16', changes: { mu: 0, sigma: 4 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：方差度量"离散程度"**

期望告诉我们随机变量的"中心"在哪，但无法告诉我们数据有多分散。方差就是来回答这个问题的：随机变量取值偏离中心的平均程度有多大？

**类比**：两个班平均分都是75分，但A班分数集中在70-80，B班从40到100都有。平均分相同，但B班方差远大于A班。

---

**📐 方差的定义**

$$D(X) = \\text{Var}(X) = E[(X - EX)^2]$$

**直观理解**：先算每个值偏离期望的"距离平方"，再取概率加权平均——偏离越远、概率越大，方差越大。

**标准差**：σ(X) = √D(X)，与X同量纲，更便于实际解读。

---

**📐 计算公式（最重要！）**

$$D(X) = E(X^2) - [E(X)]^2$$

**推导**：
D(X) = E[(X-EX)²] = E[X² - 2X·EX + (EX)²] = E(X²) - 2E(X)·E(X) + [E(X)]² = E(X²) - [E(X)]²

**为什么这个公式重要**：只需计算E(X)和E(X²)两个积分/求和，比用定义直接算方便得多。

---

**📐 方差的性质（5条核心性质）**

**性质1**：D(c) = 0（常数的方差为0）
- 逆命题也成立：D(X)=0 ⟺ X以概率1为常数

**性质2**：D(aX+b) = a²D(X)
- 平移b不影响方差，缩放a使方差变为a²倍
- 注意是a²倍不是a倍！D(2X)=4D(X)，不是2D(X)

**性质3**：若X、Y独立，则D(X+Y) = D(X) + D(Y)
- 更一般地，若X₁,...,Xₙ相互独立，则D(∑Xᵢ) = ∑D(Xᵢ)
- **注意**：独立才能直接相加！不独立时D(X+Y) = D(X)+D(Y)+2Cov(X,Y)

**性质4**：D(X-Y) = D(X) + D(Y) - 2Cov(X,Y)
- 若X、Y独立：D(X-Y) = D(X) + D(Y)（注意仍是加号！）
- D(X-Y) ≠ D(X) - D(Y)，方差没有"减法"

**性质5**：D(X) = E(X²) - [E(X)]² ≥ 0（方差非负性）
- 等号成立 ⟺ X以概率1为常数
- 这是Jensen不等式的直接推论

---

**📐 标准化变量**

$$X^* = \\frac{X - E(X)}{\\sqrt{D(X)}}$$

标准化后：E(X*)=0, D(X*)=1

标准化消除了量纲和量级的影响，使得不同随机变量的离散程度可以比较。这是切比雪夫不等式、中心极限定理的基础变换，也是统计中Z-score的来源。

**例子**：甲考试E=80, σ=5；乙考试E=70, σ=10。甲考85，乙考82，谁考得更好？
甲的标准化分=(85-80)/5=1，乙的标准化分=(82-70)/10=1.2。乙相对更优秀！

---

**📐 常见分布方差汇总**

| 分布 | D(X) | 与E(X)的关系 |
|------|------|-------------|
| 0-1分布B(1,p) | p(1-p) | D=E-E² |
| 二项分布B(n,p) | np(1-p) | D<E |
| 泊松分布P(λ) | λ | **D=E** |
| 几何分布Geo(p) | (1-p)/p² | D>E² |
| 均匀分布U(a,b) | (b-a)²/12 | 与E无关 |
| 指数分布Exp(λ) | 1/λ² | **D=E²** |
| 正态分布N(μ,σ²) | σ² | D与E独立 |
| Γ分布Γ(α,β) | α/β² | D=E/β |

**重要特征**：
- 泊松分布：D(X)=E(X)，这是泊松的"签名"——均值≈方差时考虑泊松
- 指数分布：D(X)=[E(X)]²，变异系数CV=σ/μ=1

---

**📐 方差的计算例题**

**例1**：X~U(0,1)，求D(X)

E(X) = ∫₀¹ x dx = 1/2

E(X²) = ∫₀¹ x² dx = 1/3

D(X) = 1/3 - 1/4 = 1/12

**例2**：X~Exp(λ)，求D(X)

E(X) = ∫₀^∞ x·λe^(-λx) dx = 1/λ

E(X²) = ∫₀^∞ x²·λe^(-λx) dx = 2/λ²

D(X) = 2/λ² - 1/λ² = 1/λ²

---

**📐 切比雪夫不等式（引出）**

$$P\\{|X - EX| \\geq \\varepsilon\\} \\leq \\frac{D(X)}{\\varepsilon^2}$$

意义：仅知期望和方差，就能估计X偏离期望的概率上界。令ε=kσ得：P{|X-EX|≥kσ} ≤ 1/k²，对任何分布都成立。

---

**⚠️ 常见误区**

**误区1**："D(X+Y) = D(X)+D(Y)"
- **纠正**：需要X、Y独立！不独立时D(X+Y) = D(X)+D(Y)+2Cov(X,Y)

**误区2**："D(X-Y) = D(X)-D(Y)"
- **纠正**：D(X-Y) = D(X)+D(Y)-2Cov(X,Y)，永远不可能等于D(X)-D(Y)（除非极端情况）

**误区3**："E(X²) = [E(X)]²"
- **纠正**：E(X²) = D(X) + [E(X)]² ≥ [E(X)]²

**误区4**："D(aX) = aD(X)"
- **纠正**：D(aX) = a²D(X)，注意是平方关系！

**误区5**："方差越大越好/越小越好"
- **纠正**：方差无好坏之分。金融中大方差=高风险，制造业中小方差=高质量，不同场景不同需求`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 200, end: 260, type: 'formula' },
        { start: 470, end: 530, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：方差是"转动惯量"**

在力学类比中，若概率分布是质量分布，期望是重心，则方差就是绕重心的**转动惯量**。转动惯量越大，物体越难转动——方差越大，随机变量越难"预测"。

方差的物理直觉：
1. **集中=可预测**：方差小，取值集中在期望附近，预测误差小
2. **分散=难预测**：方差大，取值分散，预测不可靠
3. **方差=0=确定性**：没有随机性，完全可预测

从信息论角度，方差衡量了随机变量包含的"不确定信息量"。对于正态分布N(μ,σ²)，σ²直接决定了分布的"信息熵"大小。`,
      extension: `**🚀 高阶矩与分布特征**

方差是二阶中心矩μ₂。更高阶的矩刻画了分布更细致的特征：
- **三阶中心矩μ₃**：衡量偏度（skewness），γ₁ = μ₃/σ³
- **四阶中心矩μ₄**：衡量峰度（kurtosis），γ₂ = μ₄/σ⁴ - 3

正态分布的偏度=0、峰度=0，是"标准"的对称且"适中峰"分布。`,
      further: [
        { id: 'f1', title: '方差不存在的分布', content: '柯西分布：f(x) = 1/[π(1+x²)]\nE(X)不存在，D(X)自然也不存在\n\nt分布(自由度1)：同柯西分布，期望和方差都不存在\n\nt分布(自由度2)：期望存在(=0)，但方差不存在\n\n规律：E(|X|^k)发散 ⟹ k阶及以上矩不存在' },
        { id: 'f2', title: '样本方差的无偏性', content: '样本方差S² = 1/(n-1) · Σ(Xᵢ-X̄)²\n分母是n-1而非n，这是为了使E(S²) = D(X)（无偏性）\n\n直观理解：用X̄代替EX损失了一个自由度\n\n数学证明：E[Σ(Xᵢ-X̄)²] = (n-1)σ²\n所以除以n-1才能得到σ²的无偏估计' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '投资风险评估',
        description: `**问题**

两只股票的年收益率：
A股票：E(X)=10%, D(X)=4%
B股票：E(Y)=10%, D(Y)=16%

求：①哪只股票风险更大？②若等额投资两只股票，组合收益率的方差？

**解**

①E(X)=E(Y)=10%，期望收益相同
D(X)=4% < D(Y)=16%，B股票方差大4倍，风险远大于A

②设Z=(X+Y)/2
E(Z) = (E(X)+E(Y))/2 = 10%
若X、Y独立：D(Z) = [D(X)+D(Y)]/4 = (4+16)/4 = 5%
组合方差5% < B的16%，分散投资降低风险！
若X、Y完全正相关：D(Z) = D(X+Y)/4，风险更大`,
        scenario: '调整相关系数，观察组合方差的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '方差的计算',
        description: `**问题**

X的密度函数f(x)=2x (0<x<1)，求D(X)。

**解**

第一步：E(X) = ∫₀¹ x·2x dx = 2/3

第二步：E(X²) = ∫₀¹ x²·2x dx = ∫₀¹ 2x³ dx = 1/2

第三步：D(X) = E(X²) - [E(X)]² = 1/2 - 4/9 = 1/18

验证：D(X) = ∫₀¹ (x-2/3)²·2x dx = 1/18 ✓`,
        scenario: '调整密度函数，观察方差的计算过程。',
      },
    ],
    method: [
      { number: 1, title: '定义法求方差', description: `①先求E(X)\n②D(X) = E[(X-EX)²] = ∑(xₖ-EX)²pₖ 或 ∫(x-EX)²f(x)dx\n③计算较繁琐，一般不用` },
      { number: 2, title: '公式法求方差（推荐）', description: `①求E(X)\n②求E(X²)\n③D(X) = E(X²) - [E(X)]²\n④优势：只需两个积分/求和` },
      { number: 3, title: '性质法求方差', description: `①将复杂变量分解\n②利用D(aX+b) = a²D(X)\n③独立时D(X±Y) = D(X)+D(Y)\n④不独立时加上/减去2Cov(X,Y)` },
    ],
  },
}

const covarianceCorrelationPoint: KnowledgePoint = {
  id: 'covariance-correlation',
  moduleId: 'digital-features',
  name: '协方差与相关系数',
  formula: '\\text{Cov}(X,Y) = E(XY) - E(X)E(Y), \\quad \\rho_{XY} = \\frac{\\text{Cov}(X,Y)}{\\sqrt{D(X)D(Y)}}',
  coreSentence: '协方差衡量两个变量的"共变方向"，相关系数是标准化的协方差，|ρ|≤1度量线性相关程度。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'rho*x', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 1, y: 1, draggable: false, color: '#1565C0', label: '(1,1)' },
          { id: 'p2', x: -1, y: -1, draggable: false, color: '#2E7D32', label: '(-1,-1)' },
          { id: 'p3', x: 1, y: -1, draggable: false, color: '#FF6F00', label: '(1,-1)' },
          { id: 'p4', x: -1, y: 1, draggable: false, color: '#6A1B9A', label: '(-1,1)' },
        ],
        sliders: [
          { id: 'rho', name: 'rho', min: -1, max: 1, step: 0.1, defaultValue: 0.8, label: '相关系数ρ' },
          { id: 'n', name: 'n', min: 20, max: 200, step: 10, defaultValue: 100, label: '样本数 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '不同相关系数下的散点图',
          type: 'step',
          steps: [
            { id: 's1', description: 'ρ=1：完全正线性相关，散点在一条直线上', changes: { rho: 1, n: 100 } },
            { id: 's2', description: 'ρ=0.8：强正相关，散点集中在上升带', changes: { rho: 0.8, n: 100 } },
            { id: 's3', description: 'ρ=0.3：弱正相关，线性趋势不明显', changes: { rho: 0.3, n: 100 } },
            { id: 's4', description: 'ρ=0：无线性相关，散点无方向', changes: { rho: 0, n: 100 } },
            { id: 's5', description: 'ρ=-0.8：强负相关，散点集中在下降带', changes: { rho: -0.8, n: 100 } },
            { id: 's6', description: 'ρ=-1：完全负线性相关', changes: { rho: -1, n: 100 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：协方差衡量"共变"，相关系数度量"线性关系"**

两个随机变量之间的关系如何量化？协方差回答"它们是否同方向变化"，相关系数进一步回答"线性关系有多强"。

---

**📐 协方差的定义**

$$\\text{Cov}(X,Y) = E[(X - EX)(Y - EY)]$$

**等价计算公式**：
$$\\text{Cov}(X,Y) = E(XY) - E(X) \cdot E(Y)$$

**直观理解**：
- Cov(X,Y) > 0：X增大时Y也倾向于增大（正相关）
- Cov(X,Y) < 0：X增大时Y倾向于减小（负相关）
- Cov(X,Y) = 0：X和Y无线性共变趋势（不相关）

**例子**：设E(X)=2, E(Y)=3, E(XY)=7
Cov(X,Y) = 7 - 2×3 = 1 > 0，X和Y正相关

---

**📐 协方差的性质**

**性质1（对称性）**：Cov(X,Y) = Cov(Y,X)

**性质2（自身协方差）**：Cov(X,X) = D(X)
- 协方差是方差的推广，方差是协方差的特例

**性质3（双线性性）**：Cov(aX, bY) = ab·Cov(X,Y)
- 推论：Cov(X₁+X₂, Y) = Cov(X₁,Y) + Cov(X₂,Y)（可加性）
- 推论：Cov(X+a, Y+b) = Cov(X,Y)（平移不变性）

**性质4（与方差的关系）**：D(X±Y) = D(X) + D(Y) ± 2Cov(X,Y)
- 独立时Cov(X,Y)=0，退化为D(X)+D(Y)
- 这就是为什么独立变量方差可直接相加
- 更一般地：D(∑aᵢXᵢ) = ∑aᵢ²D(Xᵢ) + 2∑∑aᵢaⱼCov(Xᵢ,Xⱼ)

---

**📐 相关系数的定义**

$$\\rho_{XY} = \\frac{\\text{Cov}(X,Y)}{\\sqrt{D(X) \\cdot D(Y)}}$$

**本质**：标准化后的协方差。消除了量纲和量级的影响，使得不同变量对之间的相关性可以比较。

**相关系数的性质（3条核心性质）**：

**性质1**：|ρ| ≤ 1（最核心的性质）
- 证明：对任意实数t，D(Y-tX) ≥ 0
  展开得D(Y)-2t·Cov(X,Y)+t²D(X) ≥ 0
  取t=Cov(X,Y)/D(X)，代入整理得ρ² ≤ 1

**性质2**：|ρ| = 1 ⟺ X和Y以概率1存在线性关系
   - ρ=1：Y = aX+b（a>0），完全正线性相关
   - ρ=-1：Y = aX+b（a<0），完全负线性相关

**性质3**：ρ=0，称X和Y不相关（无线性关系）

---

**📐 ρ=0（不相关）与独立的关系**

这是考试的高频考点：

**独立 ⟹ 不相关（ρ=0）**：恒成立

**不相关 ⟹̸ 独立**：一般不成立！

**反例1**：X~U(-1,1)，Y=X²
- E(X)=0，E(XY)=E(X³)=0
- Cov(X,Y)=E(XY)-E(X)E(Y)=0，故ρ=0
- 但Y完全由X决定，绝不独立！

**反例2**：X取-1,0,1等概率，Y=X²
- E(X)=0，E(XY)=E(X³)=0，ρ=0
- 但P{X=1,Y=1}=1/3 ≠ P{X=1}·P{Y=1}=1/3·2/3=2/9

**唯一的例外**：若(X,Y)服从二维正态分布，则"不相关 ⟺ 独立"

**总结**：独立 → 不相关（恒成立），不相关 ↛ 独立（一般不成立），二维正态下等价。

---

**📐 ρ=±1的含义**

|ρ|=1意味着X和Y存在**完全的线性关系**：

- ρ=1：X增大，Y严格按比例增大（完全正线性相关）
- ρ=-1：X增大，Y严格按比例减小（完全负线性相关）

|ρ|越接近1，线性关系越强；|ρ|越接近0，线性关系越弱。

---

**📐 ρ的图解含义**

|ρ的范围|含义|散点图特征|
|--------|------|----------|
|0.8~1|强正相关|点集中在上升窄带|
|0.3~0.8|中等正相关|有上升趋势但较散|
|0~0.3|弱正相关|微弱上升趋势|
|0|不相关|无方向，圆形散布|
|-0.3~0|弱负相关|微弱下降趋势|
|-0.8~-0.3|中等负相关|有下降趋势但较散|
|-1~-0.8|强负相关|点集中在下降窄带|

**注意**：ρ只度量线性关系！ρ=0时散点图可能呈现完美抛物线（Y=X²）。

---

**📐 计算例题**

**例**：(X,Y)的联合密度f(x,y)=2，0<x<y<1

求Cov(X,Y)和ρ。

E(X) = ∫₀¹∫ₓ¹ x·2 dy dx = ∫₀¹ 2x(1-x) dx = 1/3

E(Y) = ∫₀¹∫₀ʸ y·2 dx dy = ∫₀¹ 2y² dy = 2/3

E(XY) = ∫₀¹∫ₓ¹ xy·2 dy dx = ∫₀¹ x[y²]ₓ¹ dx = ∫₀¹ x(1-x²) dx = 1/2 - 1/4 = 1/4

Cov(X,Y) = 1/4 - 1/3×2/3 = 1/4 - 2/9 = 1/36 > 0

（还需E(X²), E(Y²)算出D(X), D(Y)后求ρ）

---

**⚠️ 常见误区**

**误区1**："ρ=0说明X和Y没有关系"
- **纠正**：ρ=0只说明没有**线性**关系！可能存在非线性关系（如Y=X²）

**误区2**："Cov(X,Y)=0说明X和Y独立"
- **纠正**：Cov(X,Y)=0只是不相关，一般推不出独立

**误区3**："|ρ|大说明因果关系强"
- **纠正**：相关性≠因果性！"相关不等于因果"

**误区4**："Cov(X,Y)的值越大，相关性越强"
- **纠正**：协方差受量纲影响，X换成cm和m结果差10000倍！应该看ρ`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 170, end: 230, type: 'formula' },
        { start: 520, end: 600, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：相关系数是最优线性预测**

相关系数的深刻含义：ρ²是"线性回归可解释方差的比例"。

设用X的最优线性预测来预测Y：Ŷ = aX+b
最优a和b使得均方误差E[(Y-Ŷ)²]最小

结果：最优预测的均方误差 = D(Y)(1-ρ²)

- ρ²=1：均方误差=0，线性预测完全精确
- ρ²=0：均方误差=D(Y)，线性预测毫无用处
- ρ²=0.8：80%的Y的变异可被X的线性函数解释

这就是统计学中"决定系数R²=ρ²"的来源。`,
      extension: `**🚀 偏相关与复相关**

当有多个变量时，两个变量之间的简单相关系数可能受其他变量影响。

**偏相关**：控制其他变量影响后，两个变量之间的"纯净"相关系数。例如控制年龄后，身高与体重的偏相关。

**复相关**：一个变量与一组变量的线性组合之间的最大相关系数。

这些概念在多元统计分析、回归分析中极为重要。`,
      further: [
        { id: 'f1', title: '协方差矩阵与主成分分析', content: 'n个随机变量的协方差矩阵Σ是n×n对称正定矩阵：\nΣᵢⱼ = Cov(Xᵢ, Xⱼ)\n\n主成分分析(PCA)就是对Σ做特征值分解：\nΣ = QΛQᵀ\n\n最大特征值对应的方向就是数据方差最大的方向（第一主成分），这就是"降维"的数学原理。' },
        { id: 'f2', title: 'Spearman秩相关', content: '当数据不满足正态性时，Pearson相关系数可能失效。\n\nSpearman秩相关系数：将数据转为秩次（排名），再计算Pearson相关系数。\n\n优势：对单调非线性关系也能检测（如Y=eˣ），对异常值鲁棒。\n\nPearson检测线性相关，Spearman检测单调相关，各有适用场景。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'research',
        title: '身高与体重的相关性',
        description: `**问题**

调查100名成年男性，得到：
身高X：E(X)=170cm, D(X)=25
体重Y：E(Y)=70kg, D(Y)=36
Cov(X,Y)=24

求：①相关系数ρ ②体重的最优线性预测 ③预测精度

**解**

①ρ = Cov(X,Y)/√[D(X)D(Y)] = 24/√(25×36) = 24/30 = 0.8

强正相关，身高越高体重越重

②最优线性预测：Ŷ = aX + b
a = Cov(X,Y)/D(X) = 24/25 = 0.96
b = E(Y) - aE(X) = 70 - 0.96×170 = -93.2
Ŷ = 0.96X - 93.2

③预测精度：1-ρ² = 1-0.64 = 0.36
即36%的体重变异不能被身高线性解释`,
        scenario: '调整协方差，观察相关系数和预测精度的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '不相关但不独立的反例',
        description: `**问题**

(X,Y)的联合分布律：

| X\\Y | -1 | 0 | 1 |
|------|-----|-----|-----|
| -1 | 0 | 1/4 | 0 |
| 0 | 1/4 | 0 | 1/4 |
| 1 | 0 | 1/4 | 0 |

验证X和Y不相关但不独立。

**解**

E(X) = (-1)×1/4 + 0×1/2 + 1×1/4 = 0
E(Y) = (-1)×1/4 + 0×1/2 + 1×1/4 = 0
E(XY) = Σxᵢyⱼpᵢⱼ = 0（非零项对应概率全为0）

Cov(X,Y) = 0 - 0×0 = 0，不相关！

但不独立：P{X=1,Y=1}=0≠P{X=1}·P{Y=1}=1/4×1/4=1/16`,
        scenario: '观察联合分布中不相关但不独立的例子。',
      },
    ],
    method: [
      { number: 1, title: '协方差计算法', description: `①求E(X), E(Y), E(XY)\n②Cov(X,Y) = E(XY) - E(X)E(Y)\n③优势：只需三个期望值` },
      { number: 2, title: '相关系数计算法', description: `①求Cov(X,Y)\n②求D(X), D(Y)\n③ρ = Cov(X,Y)/√[D(X)D(Y)]\n④判断|ρ|与1的接近程度` },
      { number: 3, title: '判定独立与不相关', description: `①独立⟹不相关：恒成立\n②不相关⟹̸独立：一般不成立\n③二维正态：不相关⟺独立\n④验证不独立：找一对(x,y)使P{X=x,Y=y}≠P{X=x}P{Y=y}` },
    ],
  },
}

const momentCovMatrixPoint: KnowledgePoint = {
  id: 'moment-cov-matrix',
  moduleId: 'digital-features',
  name: '矩与协方差矩阵',
  formula: 'E(X^k) = \\nu_k \\quad (\\text{k阶原点矩}), \\quad E[(X-EX)^k] = \\mu_k \\quad (\\text{k阶中心矩})',
  coreSentence: '矩是数字特征的统一框架——期望是一阶原点矩，方差是二阶中心矩，协方差矩阵是二阶混合中心矩的矩阵组织。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '(x^2)/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#1565C0', visible: true },
          { id: 'f3', expression: '(x^4)/(3*sqrt(2*3.14159))*exp(-x^2/2)', color: '#2E7D32', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0.399, draggable: false, color: '#FF6F00', label: 'ν₁=E(X)=0' },
        ],
        sliders: [
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0.5, label: '相关系数 ρ' },
          { id: 'sigma_x', name: 'sigma_x', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '标准差 σₓ' },
          { id: 'sigma_y', name: 'sigma_y', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '标准差 σᵧ' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '不同阶矩的含义',
          type: 'step',
          steps: [
            { id: 's1', description: '一阶原点矩ν₁=E(X)=0：分布的"重心"', changes: { rho: 0.5, sigma_x: 1, sigma_y: 1 } },
            { id: 's2', description: '二阶中心矩μ₂=D(X)=1：分布的"离散程度"', changes: { rho: 0.5, sigma_x: 1, sigma_y: 1 } },
            { id: 's3', description: '三阶中心矩μ₃=0：分布的"偏斜度"', changes: { rho: 0.5, sigma_x: 1, sigma_y: 1 } },
            { id: 's4', description: '四阶中心矩μ₄=3：分布的"峰度"', changes: { rho: 0.5, sigma_x: 1, sigma_y: 1 } },
            { id: 's5', description: '高阶矩：刻画分布更细致的特征', changes: { rho: 0.5, sigma_x: 1, sigma_y: 1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：矩是数字特征的"总纲"**

前面学过的期望、方差、协方差，其实都是"矩"的特例。矩提供了一个统一框架，将所有数字特征纳入同一个体系。

---

**📐 原点矩与中心矩的定义**

**k阶原点矩**：
$$\\nu_k = E(X^k)$$

**k阶中心矩**：
$$\\mu_k = E[(X - EX)^k]$$

**两者的关系**：
- ν₁ = E(X)（期望就是一阶原点矩）
- μ₂ = D(X)（方差就是二阶中心矩）
- μ₁ = 0（一阶中心矩恒为0）

**各阶矩的物理含义**：
- 一阶原点矩ν₁ = E(X)：分布的"重心"位置，类似质心坐标
- 二阶中心矩μ₂ = D(X)：分布的"转动惯量"，衡量质量分散程度
- 三阶中心矩μ₃：分布的"偏斜"，正比于偏度γ₁ = μ₃/σ³
- 四阶中心矩μ₄：分布的"尾部厚度"，正比于峰度γ₂ = μ₄/σ⁴ - 3

矩的阶数越高，刻画分布越细致，但对异常值也越敏感。

---

**📐 低阶矩的具体含义**

| 阶数 | 原点矩 | 中心矩 | 含义 |
|------|--------|--------|------|
| 1 | ν₁=E(X) | μ₁=0 | 位置（重心） |
| 2 | ν₂=E(X²) | μ₂=D(X) | 离散度（分散程度） |
| 3 | ν₃=E(X³) | μ₃ | 偏度（对称性） |
| 4 | ν₄=E(X⁴) | μ₄ | 峰度（尾部厚度） |

**偏度**：γ₁ = μ₃/σ³
- γ₁=0：对称分布
- γ₁>0：右偏（正偏），长尾在右
- γ₁<0：左偏（负偏），长尾在左

**峰度**：γ₂ = μ₄/σ⁴ - 3
- γ₂=0：与正态分布相同（正态μ₄=3σ⁴）
- γ₂>0：比正态更尖峰厚尾
- γ₂<0：比正态更平坦薄尾

---

**📐 中心矩与原点矩的换算**

已知原点矩可求中心矩，反之亦然：

μ₂ = ν₂ - ν₁²（即D(X) = E(X²) - [E(X)]²）

μ₃ = ν₃ - 3ν₂ν₁ + 2ν₁³

μ₄ = ν₄ - 4ν₃ν₁ + 6ν₂ν₁² - 3ν₁⁴

---

**📐 协方差矩阵**

对于n维随机向量X=(X₁,X₂,...,Xₙ)ᵀ，**协方差矩阵**定义为：

$$\\Sigma = (\\sigma_{ij})_{n \\times n}, \\quad \\sigma_{ij} = \\text{Cov}(X_i, X_j)$$

**性质**：
1. **对称矩阵**：σᵢⱼ = σⱼᵢ
2. **非负定矩阵**：对任意向量c，cᵀΣc ≥ 0
   - 证明：cᵀΣc = D(cᵀX) ≥ 0（方差的非负性）
   - 当各分量线性无关时，Σ正定（cᵀΣc > 0, c≠0）
   - 若存在线性关系则Σ退化（半正定），行列式为0
3. **对角线元素**：σᵢᵢ = D(Xᵢ)（各分量的方差）
4. **线性变换**：Y=AX+b的协方差矩阵 = AΣAᵀ

**二维协方差矩阵**：
$$\\Sigma = \\begin{pmatrix} D(X_1) & \\text{Cov}(X_1,X_2) \\\\ \\text{Cov}(X_1,X_2) & D(X_2) \\end{pmatrix}$$

**正定性判断**：|Σ| = D(X₁)D(X₂) - [Cov(X₁,X₂)]² = D(X₁)D(X₂)(1-ρ²) ≥ 0
当|ρ|<1时，Σ正定；当|ρ|=1时，Σ退化。

---

**📐 n维正态分布**

n维正态分布N(μ, Σ)由均值向量μ和协方差矩阵Σ完全确定。

**二维正态分布的密度函数**：

$$f(x_1,x_2) = \\frac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}} \\exp\\left[-\\frac{1}{2(1-\\rho^2)}\\left(\\frac{(x_1-\\mu_1)^2}{\\sigma_1^2} - \\frac{2\\rho(x_1-\\mu_1)(x_2-\\mu_2)}{\\sigma_1\\sigma_2} + \\frac{(x_2-\\mu_2)^2}{\\sigma_2^2}\\right)\\right]$$

**n维正态分布的密度函数**：

$$f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{n/2}|\\Sigma|^{1/2}} \\exp\\left[-\\frac{1}{2}(\\mathbf{x}-\\boldsymbol{\\mu})^T\\Sigma^{-1}(\\mathbf{x}-\\boldsymbol{\\mu})\\right]$$

其中|Σ|是协方差矩阵的行列式。

**核心性质**：
1. X~N(μ,Σ)的线性变换Y=AX+b仍服从正态分布（Y~N(Aμ+b, AΣAᵀ)）
2. X₁与X₂不相关 ⟺ X₁与X₂独立（仅对正态分布成立！）
3. 边缘分布仍是正态分布（X₁~N(μ₁,σ₁²)）
4. 条件分布仍是正态分布（X₁|X₂=x₂ ~ N(μ₁|₂, σ²₁|₂)）

**多元数字特征**：n维正态分布的全部信息由均值向量μ（n维）和协方差矩阵Σ（n×n）完全确定，共n+n(n+1)/2个参数。

---

**⚠️ 常见误区**

**误区1**："矩都存在"
- **纠正**：高阶矩可能不存在。例如t分布(ν自由度)的k阶矩仅在k<ν时存在

**误区2**："协方差矩阵一定正定"
- **纠正**：非负定（半正定），不一定正定。若有线性关系则退化

**误区3**："任意两个正态变量的联合分布都是二维正态"
- **纠正**：边缘正态推不出联合正态！需联合密度满足特定形式`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 140, end: 200, type: 'formula' },
        { start: 430, end: 500, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：矩是分布的"指纹"**

如果分布函数是随机变量的完整"照片"，那么矩就是分布的"指纹特征"——用有限个数字尽可能刻画分布的全貌。

**矩的问题**：矩序列{νₖ}能否唯一确定分布？
- 对大部分常见分布：可以（矩问题可解）
- 但存在反例：不同分布可以有相同的所有阶矩
- 正态分布、指数分布等由矩序列唯一确定

协方差矩阵的深刻含义：它不仅组织了所有二阶矩信息，更是n维正态分布的"身份证"——μ和Σ完全确定了n维正态分布的一切。`,
      extension: `**🚀 矩生成函数**

矩生成函数M(t) = E(eᵗˣ)是计算矩的利器：
νₖ = M⁽ᵏ⁾(0)（k阶导数在0点的值）

常见分布的矩生成函数：
- 二项分布B(n,p)：M(t) = (peᵗ+1-p)ⁿ
- 泊松分布P(λ)：M(t) = exp(λ(eᵗ-1))
- 正态分布N(μ,σ²)：M(t) = exp(μt+σ²t²/2)
- 指数分布Exp(λ)：M(t) = λ/(λ-t), t<λ

矩生成函数唯一确定分布（若存在），这比逐个计算矩更强大。`,
      further: [
        { id: 'f1', title: '特征函数', content: '特征函数φ(t) = E(eⁱᵗˣ)是矩生成函数的复数版本\n\n优势：\n1. 对所有分布都存在（不像矩生成函数可能不存在）\n2. 唯一确定分布\n3. 独立随机变量之和的特征函数=特征函数之积\n\n正态分布的特征函数：φ(t) = exp(iμt - σ²t²/2)\n\n特征函数是概率论最强大的工具之一，中心极限定理的严格证明就依赖它。' },
        { id: 'f2', title: '协方差矩阵与马氏距离', content: '欧氏距离忽略了变量间的相关性，马氏距离则利用协方差矩阵校正：\n\nd² = (x-μ)ᵀΣ⁻¹(x-μ)\n\n当Σ=I（单位阵），马氏距离=欧氏距离\n当Σ非对角，马氏距离考虑了变量间的相关性\n\n应用：异常检测、聚类分析、判别分析\n\n直观理解：马氏距离是在"协方差椭圆"上的距离，等距线是椭圆而非圆。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '正态分布的矩计算',
        description: `**问题**

X~N(0,1)，求ν₃, μ₃, ν₄, μ₄。

**解**

ν₃ = E(X³) = ∫x³φ(x)dx
x³是奇函数，φ(x)是偶函数，乘积为奇函数
奇函数在对称区间积分为0
所以ν₃ = 0

μ₃ = E[(X-0)³] = E(X³) = 0
正态分布关于均值对称，故μ₃=0（无偏斜）

ν₄ = E(X⁴) = ∫x⁴φ(x)dx
用分部积分：∫x⁴φ(x)dx = 3∫x²φ(x)dx = 3×1 = 3

μ₄ = E(X⁴) = 3

峰度：γ₂ = μ₄/σ⁴ - 3 = 3/1 - 3 = 0
正态分布的峰度为0，是"标准"的峰度基准。`,
        scenario: '调整分布参数，观察各阶矩的变化。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '二维正态的协方差矩阵',
        description: `**问题**

(X,Y)服从二维正态分布，E(X)=1, E(Y)=2, D(X)=4, D(Y)=9, ρ=1/2

求：①协方差矩阵Σ ②P{X>1} ③X与Y是否独立？

**解**

①Cov(X,Y) = ρ√[D(X)D(Y)] = (1/2)×√(4×9) = (1/2)×6 = 3

Σ = (4  3)
    (3  9)

②X~N(1,4)，P{X>1} = P{Z>0} = 0.5（均值处右侧概率恒为0.5）

③ρ=1/2≠0，X与Y相关，不独立

（若二维正态，ρ=0才独立）`,
        scenario: '调整相关系数，观察协方差矩阵的变化。',
      },
    ],
    method: [
      { number: 1, title: '原点矩计算法', description: `①νₖ = E(Xᵏ) = ∑xₖᵏpₖ 或 ∫xᵏf(x)dx\n②利用对称性简化：奇函数在对称区间积分为0\n③正态分布的k阶矩：k为奇数时为0` },
      { number: 2, title: '中心矩换算法', description: `①先算原点矩ν₁,ν₂,...\n②用换算公式：μ₂=ν₂-ν₁²，μ₃=ν₃-3ν₂ν₁+2ν₁³\n③比直接用定义计算更方便` },
      { number: 3, title: '协方差矩阵构建法', description: `①计算各分量的方差D(Xᵢ)放对角线\n②计算各对分量的协方差Cov(Xᵢ,Xⱼ)放非对角线\n③验证对称性和非负定性` },
    ],
  },
}

const distributionFeaturesSummaryPoint: KnowledgePoint = {
  id: 'distribution-features-summary',
  moduleId: 'digital-features',
  name: '常见分布数字特征汇总',
  formula: '\\text{汇总表：六大离散分布+四大连续分布的E(X), D(X)}',
  coreSentence: '掌握六大离散分布和四大连续分布的期望与方差，是解题的"速查手册"——不用每次都从头算。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*sigma)*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
          { id: 'f2', expression: 'lambda*exp(-lambda*x)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#2E7D32', label: 'E(X)' },
        ],
        sliders: [
          { id: 'dist_type', name: 'dist_type', min: 0, max: 9, step: 1, defaultValue: 0, label: '分布类型' },
          { id: 'param1', name: 'param1', min: 0.1, max: 10, step: 0.1, defaultValue: 1, label: '参数1' },
          { id: 'param2', name: 'param2', min: 0.1, max: 10, step: 0.1, defaultValue: 1, label: '参数2' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '分布切换与数字特征对比',
          type: 'step',
          steps: [
            { id: 's1', description: '0-1分布：E=p, D=p(1-p)，最简单的两点分布', changes: { dist_type: 0, param1: 0.5 } },
            { id: 's2', description: '二项分布B(n,p)：E=np, D=np(1-p)，n次伯努利试验', changes: { dist_type: 1, param1: 10, param2: 0.5 } },
            { id: 's3', description: '泊松分布P(λ)：E=λ, D=λ，期望=方差！', changes: { dist_type: 2, param1: 5 } },
            { id: 's4', description: '均匀分布U(a,b)：E=(a+b)/2, D=(b-a)²/12', changes: { dist_type: 6, param1: 0, param2: 1 } },
            { id: 's5', description: '指数分布Exp(λ)：E=1/λ, D=1/λ²', changes: { dist_type: 7, param1: 1 } },
            { id: 's6', description: '正态分布N(μ,σ²)：E=μ, D=σ²', changes: { dist_type: 8, param1: 0, param2: 1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：常见分布的期望与方差是"必背公式"**

每次考试都会用到这些结论。与其每次从头推导，不如直接记住——它们是概率论解题的"速查手册"。

---

**📐 六大离散分布的数字特征**

**1. 0-1分布（两点分布）B(1,p)**

X取0（概率1-p）或1（概率p）

| 特征 | 值 |
|------|-----|
| E(X) | p |
| D(X) | p(1-p) |

**2. 二项分布B(n,p)**

X表示n次独立伯努利试验中成功的次数

| 特征 | 值 |
|------|-----|
| E(X) | np |
| D(X) | np(1-p) |

**推导技巧**：X=X₁+X₂+...+Xₙ（n个独立的0-1分布之和），利用期望和方差的线性性
- E(X) = E(X₁)+...+E(Xₙ) = n·p
- D(X) = D(X₁)+...+D(Xₙ) = n·p(1-p)（独立性保证方差可加）

**3. 泊松分布P(λ)**

| 特征 | 值 |
|------|-----|
| E(X) | λ |
| D(X) | λ |

**关键特点**：期望=方差！这是泊松分布的"签名"——如果E(X)≈D(X)，可考虑泊松分布。

**4. 几何分布Geo(p)**

X表示首次成功所需的试验次数

| 特征 | 值 |
|------|-----|
| E(X) | 1/p |
| D(X) | (1-p)/p² |

**直觉**：成功概率p=0.1，平均需要1/0.1=10次试验

**推导提示**：E(X) = ∑ₖk·(1-p)^(k-1)·p，利用级数∑kx^(k-1) = 1/(1-x)²，可得E(X)=1/p

**5. 超几何分布H(n,M,N)**

N件产品中M件正品，抽n件，X为正品数

| 特征 | 值 |
|------|-----|
| E(X) | nM/N |
| D(X) | n(M/N)(1-M/N)(N-n)/(N-1) |

**直觉**：E(X)=n·(M/N)，即"抽样比例×总体比例"

**与二项分布的关系**：N→∞时，超几何→二项B(n,M/N)
- 方差中的(N-n)/(N-1)称为**有限总体修正系数**
- 当n远小于N时，修正系数≈1，超几何≈二项

**6. 帕斯卡分布（负二项分布）**

X表示第r次成功所需的试验次数

| 特征 | 值 |
|------|-----|
| E(X) | r/p |
| D(X) | r(1-p)/p² |

---

**📐 四大连续分布的数字特征**

**7. 均匀分布U(a,b)**

| 特征 | 值 |
|------|-----|
| E(X) | (a+b)/2 |
| D(X) | (b-a)²/12 |

**直觉**：期望是区间中点，方差只与区间长度有关

**8. 指数分布Exp(λ)**

| 特征 | 值 |
|------|-----|
| E(X) | 1/λ |
| D(X) | 1/λ² |

**关键特点**：D(X)=[E(X)]²，变异系数CV=1

**9. 正态分布N(μ,σ²)**

| 特征 | 值 |
|------|-----|
| E(X) | μ |
| D(X) | σ² |

**10. Γ分布Γ(α,β)**

| 特征 | 值 |
|------|-----|
| E(X) | α/β |
| D(X) | α/β² |

**特例**：Γ(1,λ)=Exp(λ)，Γ(n/2,1/2)=χ²(n)

**推导提示**：E(X)=α/β 可由Γ函数的递推关系∫₀^∞ x^α e^(-βx) dx = Γ(α+1)/β^(α+1)得出

---

**📐 数字特征之间的联系**

**泊松定理**：n大p小，np=λ时，B(n,p)≈P(λ)

**棣莫弗-拉普拉斯**：n大时，B(n,p)≈N(np,np(1-p))

**指数分布与Γ分布**：n个独立Exp(λ)之和~Γ(n,λ)
- E(∑Xᵢ)=n/λ=α/β ✓
- D(∑Xᵢ)=n/λ²=α/β² ✓

**二项分布的分解**：B(n,p) = B(1,p)₁ + B(1,p)₂ + ... + B(1,p)ₙ
- 这是二项分布期望方差推导的核心技巧
- 也解释了为什么独立0-1变量之和服从二项分布

**关键公式链**：
- D(X) = E(X²) - [E(X)]² → 已知E(X)和D(X)可反推E(X²)
- E(X²) = D(X) + [E(X)]² → 所有分布都有此关系
- Cov(X,Y) = E(XY) - E(X)E(Y) → 乘积的期望与期望的乘积之差

---

**⚠️ 常见误区**

**误区1**："泊松分布的期望和方差总相等"
- **纠正**：E(X)=D(X)=λ，但E(X²)≠λ²！E(X²)=λ+λ²

**误区2**："均匀分布的期望是0"
- **纠正**：E(X)=(a+b)/2，只有U(-a,a)时才为0

**误区3**："指数分布的期望是λ"
- **纠正**：E(X)=1/λ，不是λ！参数λ是"速率"，1/λ才是"平均时间"`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 170, end: 230, type: 'formula' },
        { start: 750, end: 820, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：数字特征是分布的"压缩编码"**

完整描述一个分布需要分布函数F(x)（无穷维信息），而数字特征仅用有限个数字就刻画了分布的核心特征。这是一种"信息压缩"——

- 期望：1个数字 → 分布的位置
- 方差：1个数字 → 分布的离散度
- 偏度：1个数字 → 分布的对称性
- 峰度：1个数字 → 分布的尾部特征

对于正态分布，μ和σ²两个数字完全确定了一切（因为正态分布由两个参数唯一确定）。但对于一般分布，有限个数字无法完全替代分布函数。

这就是为什么矩方法用样本矩估计参数——用"压缩后的信息"反推"完整的信息"。`,
      extension: `**🚀 参数估计中的数字特征**

**矩估计法**：用样本矩替代总体矩来估计参数

例如：X~N(μ,σ²)，用X̄估计μ，用S²估计σ²

**方法**：
1. 写出总体矩与参数的关系：E(X)=μ, D(X)=σ²
2. 用样本矩替换总体矩：X̄=μ̂, S²=σ̂²
3. 解方程组得到估计量

这是最古老的参数估计方法，由Pearson提出。虽然不如最大似然估计高效，但简单直观。`,
      further: [
        { id: 'f1', title: '变异系数与无量纲比较', content: '变异系数CV = σ/μ，是无量纲的离散度量\n\n为什么需要CV？\n- 比较身高(μ=170cm, σ=10)和体重(μ=70kg, σ=8)的离散程度\n- 方差/标准差有量纲，不能直接比较\n- CV消除了量纲和量级影响\n\n身高CV = 10/170 ≈ 0.059\n体重CV = 8/70 ≈ 0.114\n体重的相对离散程度更大' },
        { id: 'f2', title: '常用分布的记忆口诀', content: '【离散型】\n零一期望p，方差p(1-p)\n二项期望np，方差npq\n泊松期望λ，方差也是λ\n几何期望1/p，方差q/p²\n超几期望nM/N，方差带修正\n\n【连续型】\n均匀中点(a+b)/2，方差长度²/12\n指数期望1/λ，方差1/λ²\n正态期望μ，方差σ²\n伽马期望α/β，方差α/β²' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '利用数字特征反推分布参数',
        description: `**问题**

已知X~B(n,p)，E(X)=6, D(X)=3.6，求n和p。

**解**

E(X) = np = 6 ... ①
D(X) = np(1-p) = 3.6 ... ②

由①②：np·(1-p)/np = 3.6/6
1-p = 0.6，所以p = 0.4

代入①：n×0.4 = 6，n = 15

验证：D(X) = 15×0.4×0.6 = 3.6 ✓`,
        scenario: '调整期望和方差，反推分布参数。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '服务台排队模型',
        description: `**问题**

某银行柜台，顾客到达服从泊松分布P(λ)，平均每小时λ=6人；服务时间服从指数分布Exp(μ)，平均每人1/μ=10分钟(μ=6)。

求：①每小时到达顾客数的期望和方差 ②服务时间的期望和方差

**解**

①到达人数X~P(6)
E(X) = 6, D(X) = 6（泊松分布期望=方差）

②服务时间T~Exp(6)
E(T) = 1/6小时 = 10分钟
D(T) = 1/36小时²

当λ=μ=6时，系统处于临界状态（到达率=服务率），队列会越来越长。实际中需要μ>λ才能稳定运行。`,
        scenario: '调整到达率和服务率，观察系统稳定性。',
      },
    ],
    method: [
      { number: 1, title: '直接记忆法', description: `①记住六大离散+四大连续的E和D公式\n②做题时直接套用，不用从头推导\n③注意各分布参数的含义` },
      { number: 2, title: '分解法', description: `①将复杂分布分解为简单分布之和\n②例：B(n,p) = X₁+X₂+...+Xₙ（n个0-1分布）\n③E(B)=nE(X₁)=np, D(B)=nD(X₁)=np(1-p)\n④利用独立和的性质` },
    ],
  },
}

// ---- 第五章 大数定律与中心极限定理 ----

const chebyshevInequalityPoint: KnowledgePoint = {
  id: 'chebyshev-inequality',
  moduleId: 'limit-theorems',
  name: '切比雪夫不等式',
  formula: 'P\\{|X-EX| \\geq \\varepsilon\\} \\leq \\frac{D(X)}{\\varepsilon^2}',
  coreSentence: '切比雪夫不等式是概率论的"安全网"——仅凭期望和方差，就能给出偏离概率的上界。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '0.4/(1+x^2)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'epsilon', y: 0, draggable: false, color: '#2E7D32', label: 'ε' },
          { id: 'p2', x: '-epsilon', y: 0, draggable: false, color: '#FF6F00', label: '-ε' },
        ],
        sliders: [
          { id: 'k', name: 'k', min: 1, max: 5, step: 0.5, defaultValue: 2, label: '倍数 k' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '切比雪夫界与实际概率',
          type: 'step',
          steps: [
            { id: 's1', description: 'k=1：上界=1/k²=1（平凡的界，无信息量）', changes: { k: 1 } },
            { id: 's2', description: 'k=2：上界=1/4=0.25，正态实际≈0.0456', changes: { k: 2 } },
            { id: 's3', description: 'k=3：上界=1/9≈0.111，正态实际≈0.0027', changes: { k: 3 } },
            { id: 's4', description: 'k=4：上界=1/16=0.0625', changes: { k: 4 } },
            { id: 's5', description: 'k=5：上界=1/25=0.04', changes: { k: 5 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：仅凭E(X)和D(X)估计概率上界**

切比雪夫不等式是概率论中一个"粗糙但万能"的工具：不需要知道X的具体分布，只要知道期望和方差，就能估计X偏离期望的概率上界。

---

**📐 切比雪夫不等式的表述**

设随机变量X的期望E(X)和方差D(X)都存在，则对任意ε>0：

$$P\\{|X - EX| \\geq \\varepsilon\\} \\leq \\frac{D(X)}{\\varepsilon^2}$$

**等价形式**：
$$P\\{|X - EX| < \\varepsilon\\} \\geq 1 - \\frac{D(X)}{\\varepsilon^2}$$

**直观理解**：
- 分母ε²越大（要求越宽松），上界越小（偏离概率越低）
- 分子D(X)越大（方差越大），上界越大（偏离概率越高）
- 这完全符合直觉：方差大→容易偏离；要求严（ε小）→偏离概率高

---

**📐 证明思路**

关键步骤（以连续型为例）：

D(X) = ∫(x-EX)²f(x)dx
≥ ∫_{|x-EX|≥ε}(x-EX)²f(x)dx  （缩小积分区域）
≥ ∫_{|x-EX|≥ε}ε²f(x)dx  （在区域内|X-EX|≥ε）
= ε²·P{|X-EX|≥ε}

所以D(X) ≥ ε²·P{|X-EX|≥ε}，即P{|X-EX|≥ε} ≤ D(X)/ε²

**证明的核心**：利用"被积函数在积分区域内必不小于ε²"这一事实放缩。

**离散型证明**类似：
D(X) = ∑(xₖ-EX)²pₖ ≥ ∑_{|xₖ-EX|≥ε}(xₖ-EX)²pₖ ≥ ε²∑_{|xₖ-EX|≥ε}pₖ = ε²·P{|X-EX|≥ε}

**等价形式的解读**：P{|X-EX|<ε} ≥ 1-D(X)/ε²
- 当D(X)/ε² < 1时，给出了X落在(EX-ε, EX+ε)内的概率下界
- 这比原始形式更实用——实际中我们更关心"落在内的概率"而非"落在外的概率"

---

**📐 应用一：估计概率上界**

**例**：E(X)=2, D(X)=4，估计P{|X-2|≥6}

切比雪夫：P{|X-2|≥6} ≤ 4/36 = 1/9 ≈ 0.111

如果X~N(2,4)：P{|X-2|≥6} = P{|Z|≥3} ≈ 0.0027

**切比雪夫的界是0.111，而实际只有0.0027——差距近40倍！**

这体现了切比雪夫不等式的特点：**粗糙但普适**。它对任何分布都成立，但代价是界很松。

---

**📐 应用二：证明收敛**

若E(Xₙ)→μ, D(Xₙ)→0，则Xₙ依概率收敛到μ。

证明：对任意ε>0，
P{|Xₙ-μ|≥ε} ≤ D(Xₙ)/ε² → 0（当D(Xₙ)→0时）

这个思路是大数定律证明的基础。

---

**📐 取ε=kσ的特殊形式**

令ε=kσ（k个标准差），则：
P{|X-EX|≥kσ} ≤ 1/k²

| k | 上界 | 正态实际 |
|---|------|---------|
| 1 | ≤1 | ≈0.3173 |
| 2 | ≤0.25 | ≈0.0456 |
| 3 | ≤1/9≈0.111 | ≈0.0027 |

切比雪夫保证了"至少75%的数据在2σ内"和"至少88.9%的数据在3σ内"，对任何分布都成立。

---

**📐 与其他不等式的关系**

切比雪夫不等式处于概率不等式体系的中间位置：

| 不等式 | 条件 | 结论 | 强弱 |
|--------|------|------|------|
| 马尔可夫 | X≥0 | P{X≥ε}≤E(X)/ε | 最弱 |
| 切比雪夫 | E(X), D(X)存在 | P{\|X-EX\|≥ε}≤D(X)/ε² | 中等 |
| Hoeffding | Xᵢ有界 | P{\|X̄-μ\|≥ε}≤2exp(-2nε²/(b-a)²) | 最强 |

**马尔可夫→切比雪夫**：令Y=(X-μ)²≥0，则P{|X-μ|≥ε}=P{Y≥ε²}≤E(Y)/ε²=σ²/ε²

**切比雪夫的独特价值**：它是"条件最弱、结论最普适"的不等式。当分布未知时，切比雪夫是唯一可用的工具。

---

**⚠️ 常见误区**

**误区1**："切比雪夫不等式能精确计算概率"
- **纠正**：它只能给出上界，不是精确值。对于已知分布，直接计算更精确

**误区2**："ε可以取任意值"
- **纠正**：ε>0即可，但当ε≤√D(X)时上界≥1，没有实际意义

**误区3**："切比雪夫不等式只有理论价值"
- **纠正**：在实际中，当分布未知但已知均值和方差时，切比雪夫不等式是唯一可用的概率估计工具`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 120, end: 180, type: 'formula' },
        { start: 460, end: 530, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：切比雪夫不等式是"最坏情况保证"**

切比雪夫不等式的本质是：在所有期望为μ、方差为σ²的分布中，偏离概率的最大值是多少？

答案就是D(X)/ε²——这是"最坏分布"下的偏离概率。对于正态分布这样"集中"的分布，实际偏离概率远小于上界。

这种"最坏情况"思维在数学中极为重要：
1. **马尔可夫不等式**：P{X≥ε} ≤ E(X)/ε（更弱但只要求期望存在）
2. **切比雪夫不等式**：P{|X-μ|≥ε} ≤ σ²/ε²（马尔可夫的推论）
3. **Hoeffding不等式**：有界随机变量的指数级上界（更强但要求更多条件）

不等式越强，条件越苛刻；条件越弱，结论越保守。这是数学中"条件与结论的博弈"。`,
      extension: `**🚀 马尔可夫不等式——切比雪夫的"母亲"**

马尔可夫不等式：若X≥0，E(X)<∞，则对任意t>0：

P{X≥t} ≤ E(X)/t

**推导切比雪夫**：令Y=(X-μ)²≥0，则
P{|X-μ|≥ε} = P{Y≥ε²} ≤ E(Y)/ε² = σ²/ε²

马尔可夫不等式是"非负随机变量尾部概率"的最基本工具，切比雪夫只是它的一个推论。`,
      further: [
        { id: 'f1', title: '切尔诺夫界', content: '对于独立随机变量之和S=X₁+X₂+...+Xₙ，切尔诺夫界给出指数级衰减的上界：\n\nP{S≥(1+δ)μ} ≤ exp(-δ²μ/(2+δ))\n\n其中μ=E(S)。\n\n优势：比切比雪夫的1/ε²衰减快得多\n代价：要求独立性+有界性/次高斯性\n\n应用：算法分析、机器学习理论、随机化算法的正确性证明' },
        { id: 'f2', title: '切比雪夫不等式与大数定律', content: '切比雪夫大数定律的证明直接依赖切比雪夫不等式：\n\n设X₁,...,Xₙ独立同分布，E(Xᵢ)=μ, D(Xᵢ)=σ²\n令X̄=(X₁+...+Xₙ)/n\n则E(X̄)=μ, D(X̄)=σ²/n\n\nP{|X̄-μ|≥ε} ≤ σ²/(nε²) → 0（当n→∞）\n\n这就是切比雪夫大数定律！切比雪夫不等式将"方差趋于0"翻译成了"概率趋于0"。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '产品质量控制',
        description: `**问题**

某工厂生产零件，长度X的均值E(X)=100mm，方差D(X)=4mm²。不知道X的分布。求：长度在96~104mm之外的概率不超过多少？

**解**

P{|X-100|≥4} ≤ D(X)/4² = 4/16 = 0.25

即长度偏离均值超过4mm的概率不超过25%。

等价地：P{96≤X≤104} ≥ 75%

如果已知X~N(100,4)：
P{|X-100|≥4} = P{|Z|≥2} ≈ 0.0456 ≈ 4.56%
远小于切比雪夫的25%上界。

但若分布未知，25%是我们能保证的最坏情况。`,
        scenario: '调整方差和ε，观察概率上界的变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '利用切比雪夫不等式证明收敛',
        description: `**问题**

设X₁,X₂,...独立同分布，E(Xᵢ)=μ, D(Xᵢ)=σ²>0。证明X̄ₙ=(1/n)∑Xᵢ依概率收敛于μ。

**解**

E(X̄ₙ) = (1/n)·nμ = μ
D(X̄ₙ) = (1/n²)·nσ² = σ²/n

对任意ε>0，由切比雪夫不等式：
P{|X̄ₙ-μ|≥ε} ≤ D(X̄ₙ)/ε² = σ²/(nε²)

当n→∞时，σ²/(nε²)→0

因此P{|X̄ₙ-μ|≥ε}→0，即X̄ₙ ⟶ᴾ μ

这就是**切比雪夫大数定律**的证明。`,
        scenario: '调整n，观察样本均值方差趋于0的过程。',
      },
    ],
    method: [
      { number: 1, title: '直接套用估计概率上界', description: `①确定E(X)和D(X)\n②确定ε（偏离阈值）\n③P{|X-EX|≥ε} ≤ D(X)/ε²\n④注意：当D(X)/ε²>1时界无实际意义` },
      { number: 2, title: '证明依概率收敛', description: `①计算E(Yₙ)和D(Yₙ)\n②对任意ε>0，P{|Yₙ-E(Yₙ)|≥ε} ≤ D(Yₙ)/ε²\n③证D(Yₙ)→0\n④则Yₙ依概率收敛到E(Yₙ)` },
    ],
  },
}

const lawLargeNumbersPoint: KnowledgePoint = {
  id: 'law-large-numbers',
  moduleId: 'limit-theorems',
  name: '大数定律',
  formula: '\\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\mu',
  coreSentence: '大数定律揭示"频率稳定于概率"的数学本质——大量重复试验下，平均值趋于期望值。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '0.5', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 10, y: 0.6, draggable: false, color: '#1565C0', label: 'n=10' },
          { id: 'p2', x: 50, y: 0.52, draggable: false, color: '#2E7D32', label: 'n=50' },
          { id: 'p3', x: 100, y: 0.51, draggable: false, color: '#FF6F00', label: 'n=100' },
          { id: 'p4', x: 500, y: 0.502, draggable: false, color: '#6A1B9A', label: 'n=500' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 10, max: 500, step: 10, defaultValue: 100, label: '试验次数 n' },
          { id: 'p', name: 'p', min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.5, label: '概率 p' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '频率趋于概率的过程',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=10：频率波动很大，可能偏离0.5较远', changes: { n: 10, p: 0.5 } },
            { id: 's2', description: 'n=50：频率开始向0.5靠拢', changes: { n: 50, p: 0.5 } },
            { id: 's3', description: 'n=100：频率更接近0.5', changes: { n: 100, p: 0.5 } },
            { id: 's4', description: 'n=500：频率稳定在0.5附近', changes: { n: 500, p: 0.5 } },
            { id: 's5', description: 'n=500,p=0.3：大数定律体现——频率≈概率', changes: { n: 500, p: 0.3 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：大量重复下，平均趋于稳定**

大数定律是概率论最根本的定理之一。它回答了一个核心问题：为什么"频率趋于概率"？"长期平均"为什么可靠？

直觉：掷硬币1次，正面概率可能是0或1；掷1000次，正面比例极可能接近0.5。这就是大数定律。

---

**📐 切比雪夫大数定律**

设X₁,X₂,...,Xₙ相互独立，E(Xᵢ)=μᵢ, D(Xᵢ)≤C（方差一致有界），则：

$$\\frac{1}{n}\\sum_{i=1}^n X_i - \\frac{1}{n}\\sum_{i=1}^n \\mu_i \\xrightarrow{P} 0$$

**特例（独立同分布）**：若X₁,X₂,...独立同分布，E(Xᵢ)=μ, D(Xᵢ)=σ²，则：

$$\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i \\xrightarrow{P} \\mu$$

**证明**：E(X̄ₙ)=μ, D(X̄ₙ)=σ²/n→0
由切比雪夫不等式，P{|X̄ₙ-μ|≥ε} ≤ σ²/(nε²)→0

**条件**：独立+同分布+方差存在

---

**📐 辛钦大数定律**

设X₁,X₂,...独立同分布，且E(Xᵢ)=μ存在（不要求方差存在！），则：

$$\\bar{X}_n \\xrightarrow{P} \\mu$$

**与切比雪夫大数定律的区别**：
- 切比雪夫：要求方差存在（D(Xᵢ)<∞）
- 辛钦：只要求期望存在，不要求方差存在

**辛钦更强**：条件更弱，结论相同。但证明更复杂（需用特征函数）。

**意义**：即使分布"尾巴很重"（方差不存在），只要期望存在，样本均值仍依概率收敛到期望。

**注意**：辛钦要求**同分布**！切比雪夫不要求同分布，只要求方差一致有界。两者条件各有侧重：
- 辛钦：同分布 + 期望存在（不要方差）
- 切比雪夫：独立 + 方差有界（不要同分布）

---

**📐 伯努利大数定律**

设nₐ为n次独立伯努利试验中事件A发生的次数，p=P(A)，则：

$$\\frac{n_A}{n} \\xrightarrow{P} p$$

即：**频率依概率收敛于概率**。

**这是大数定律的原始形式**——雅各布·伯努利在1713年证明的，是大数定律的第一个严格证明。

**伯努利大数定律是辛钦大数定律的特例**：取Xᵢ为0-1分布B(1,p)，则nₐ/n = X̄ₙ，E(Xᵢ)=p。

**证明思路**：nₐ=X₁+X₂+...+Xₙ，E(nₐ/n)=p，D(nₐ/n)=p(1-p)/n
由切比雪夫不等式：P{|nₐ/n-p|≥ε} ≤ p(1-p)/(nε²) → 0

---

**📐 三大定律的详细对比**

| 定律 | 条件 | 结论 | 证明工具 |
|------|------|------|----------|
| 伯努利 | 独立0-1分布B(1,p) | 频率nₐ/n→概率p | 切比雪夫不等式 |
| 切比雪夫 | 独立+方差有界D(Xᵢ)≤C | X̄ₙ-E(X̄ₙ)→0 | 切比雪夫不等式 |
| 辛钦 | 独立同分布+期望存在 | X̄ₙ→μ | 特征函数 |

**关键区别**：
- 辛钦 vs 切比雪夫：辛钦要"同分布"但不要"方差存在"；切比雪夫不要"同分布"但要"方差有界"
- 独立同分布且方差存在时，两者都可用，但辛钦条件更弱
- 独立但不同分布时，只能用切比雪夫（要求方差有界）

伯努利 ⊂ 切比雪夫 ⊂ 辛钦（条件越来越弱）

---

**📐 大数定律的意义**

1. **理论意义**：为"频率稳定于概率"提供了严格的数学证明，是概率论公理化体系的基石

2. **实践意义**：
   - 蒙特卡洛方法的数学基础：用大量随机模拟的平均值近似期望
   - 统计推断的基础：样本均值是总体均值的一致估计
   - 保险精算的基础：大量保单的平均赔付额趋于期望赔付额
   - 抽样调查的基础：大样本的调查结果更接近总体真实值

3. **哲学意义**：偶然中蕴含必然——大量随机现象的叠加会产生确定性规律

4. **大数定律与中心极限定理的关系**：
   - 大数定律：X̄ₙ → μ（回答"收敛到什么"）
   - 中心极限定理：√n(X̄ₙ-μ) → N(0,σ²)（回答"以什么速度、什么方式收敛"）
   - CLT比大数定律更精细，包含了更多的信息
   - 大数定律只说"趋近"，CLT进一步告诉"趋近的分布形状"

---

**⚠️ 常见误区**

**误区1**："大数定律说X̄ₙ一定等于μ"
- **纠正**：是"依概率收敛"，即P{|X̄ₙ-μ|≥ε}→0，不是X̄ₙ=μ

**误区2**："n次试验后频率就等于概率"
- **纠正**：频率趋向概率，但不一定相等。n=1000次掷硬币，频率可能是0.507

**误区3**："大数定律可以预测下一次的结果"
- **纠正**："赌徒谬误"——前面连续出正面不意味着下次更可能出反面！每次试验独立`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 160, end: 230, type: 'formula' },
        { start: 680, end: 750, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：偶然中的必然**

大数定律揭示了一个深刻的哲学命题：大量偶然事件的叠加会产生必然的规律。

**频率→概率**不是一个经验观察，而是一个数学定理。它告诉我们：在不确定性的海洋中，存在着确定性的岛屿——只要样本量足够大。

但大数定律只保证了"概率意义下的收敛"，不保证"逐点收敛"。即使n很大，X̄ₙ仍可能偶尔偏离μ很远——只是这种事件的概率趋于0。

**强大数定律**（Kolmogorov）更进一步：X̄ₙ几乎必然收敛于μ，即P{lim X̄ₙ = μ} = 1。这是比依概率收敛更强的结论。`,
      extension: `**🚀 强大数定律 vs 弱大数定律**

弱大数定律：X̄ₙ ⟶ᴾ μ（依概率收敛）
强大数定律：X̄ₙ ⟶ₐ.ₛ. μ（几乎必然收敛）

几乎必然收敛 ⟹ 依概率收敛，反之不成立。

强大数定律的含义：样本路径中，几乎每一条路径的X̄ₙ都收敛于μ。只有零测集的路径不收敛。

证明强大数定律需要更深的工具（Kolmogorov三级数定理、Borel-Cantelli引理等），远比弱大数定律复杂。`,
      further: [
        { id: 'f1', title: '蒙特卡洛方法', content: '大数定律的直接应用：\n\n求I = ∫₀¹ g(x)dx\n\n方法：生成U₁,...,Uₙ~U(0,1)\nÎ = (1/n)∑g(Uᵢ)\n\n由辛钦大数定律：Î →ᴾ E[g(U)] = I\n\n误差：由中心极限定理\nÎ ≈ N(I, σ²/n)\n95%置信区间：Î ± 1.96σ/√n\n\nn越大，估计越精确——这就是大数定律的威力。' },
        { id: 'f2', title: '遍历定理', content: '大数定律的推广：\n\n时间平均 = 空间平均（对遍历系统）\n\n(1/n)∑f(Xₜ) → E[f(X)]\n\n条件：马尔可夫链是不可约、非周期、正常返的\n\n物理意义：一个粒子长时间的行为等价于大量粒子在某一时刻的统计行为\n\n应用：统计物理、MCMC算法、时间序列分析' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '蒙特卡洛估计π',
        description: `**问题**

用蒙特卡洛方法估计π的值。

**方法**

在单位正方形[0,1]²内随机投点，落在1/4圆内的概率=π/4。

步骤：
1. 生成n个点(Uᵢ,Vᵢ)，Uᵢ,Vᵢ~U(0,1)独立
2. 计算k = #{i: Uᵢ²+Vᵢ²≤1}
3. 估计π ≈ 4k/n

**大数定律保证**：4k/n →ᴾ π（当n→∞时）

**精度**：n=10000时，估计π≈3.14，误差约0.01
n=1000000时，估计π≈3.1416，误差约0.001

这就是大数定律的实际力量——用随机性逼近确定性。`,
        scenario: '增加模拟次数，观察估计精度提高。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '用切比雪夫大数定律估计样本量',
        description: `**问题**

总体X的均值μ未知，方差σ²=4。要使样本均值X̄ₙ与μ的误差不超过0.5的概率至少为0.95，至少需要多少样本？

**解**

由切比雪夫不等式：
P{|X̄ₙ-μ|≥0.5} ≤ D(X̄ₙ)/(0.5)² = (4/n)/0.25 = 16/n

要求P{|X̄ₙ-μ|<0.5} ≥ 0.95
即P{|X̄ₙ-μ|≥0.5} ≤ 0.05

所以16/n ≤ 0.05，n ≥ 320

至少需要320个样本。

（注：若已知正态分布，n ≈ 62就够，切比雪夫的估计偏保守）`,
        scenario: '调整精度要求和置信水平，计算所需样本量。',
      },
    ],
    method: [
      { number: 1, title: '判断适用哪个大数定律', description: `①0-1分布→伯努利大数定律\n②独立同分布+方差存在→切比雪夫或辛钦均可\n③独立同分布+方差不存在→只能用辛钦\n④独立不同分布+方差有界→切比雪夫` },
      { number: 2, title: '大数定律的应用步骤', description: `①确认随机变量序列的独立性\n②验证期望是否存在（辛钦）或方差是否有界（切比雪夫）\n③计算样本均值X̄ₙ的期望和方差\n④利用切比雪夫不等式估计收敛速度` },
    ],
  },
}

const centralLimitTheoremPoint: KnowledgePoint = {
  id: 'central-limit-theorem',
  moduleId: 'limit-theorems',
  name: '中心极限定理',
  formula: '\\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0,1)',
  coreSentence: '中心极限定理是概率论最深刻的定理——大量独立随机因素叠加的结果必趋近正态分布。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159*n/12))*exp(-(x-n/2)^2/(2*n/12))', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0.399, draggable: false, color: '#2E7D32', label: 'N(0,1)' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 2, max: 50, step: 1, defaultValue: 30, label: '样本量 n' },
          { id: 'dist_type', name: 'dist_type', min: 0, max: 2, step: 1, defaultValue: 0, label: '分布类型(0:均匀 1:指数 2:伯努利)' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: 'n增大时样本均值分布趋近正态',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=2：均匀分布U(0,1)之和，呈现三角分布', changes: { n: 2, dist_type: 0 } },
            { id: 's2', description: 'n=5：已初步呈现钟形', changes: { n: 5, dist_type: 0 } },
            { id: 's3', description: 'n=10：与正态分布已相当接近', changes: { n: 10, dist_type: 0 } },
            { id: 's4', description: 'n=30：几乎与正态分布重合', changes: { n: 30, dist_type: 0 } },
            { id: 's5', description: 'n=30,指数分布：非对称分布也趋近正态', changes: { n: 30, dist_type: 1 } },
            { id: 's6', description: 'n=30,伯努利分布：离散分布也趋近正态', changes: { n: 30, dist_type: 2 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：独立叠加→正态分布**

中心极限定理（CLT）是概率论中最重要的定理，没有之一。它揭示了一个惊人的事实：**无论原始分布是什么形状，大量独立随机变量之和（标准化后）都趋近于标准正态分布。**

这就是为什么正态分布如此"正态"——它是自然界最普遍的分布。

---

**📐 列维-林德伯格定理（独立同分布CLT）**

设X₁,X₂,...独立同分布，E(Xᵢ)=μ, D(Xᵢ)=σ²>0，则：

$$\\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0,1)$$

等价地：
$$\\sum_{i=1}^n X_i \\overset{\\text{近似}}{\\sim} N(n\\mu, n\\sigma^2)$$
$$\\bar{X}_n \\overset{\\text{近似}}{\\sim} N(\\mu, \\sigma^2/n)$$

**条件**：独立+同分布+方差存在且非零

**"趋近正态"的含义**：n→∞时，标准化后的分布函数逐点收敛到Φ(x)。

**严格数学表述**：对任意实数x，
$$\\lim_{n \\to \\infty} P\\left\\{\\frac{\\sum_{i=1}^n X_i - n\\mu}{\\sqrt{n}\\sigma} \\leq x\\right\\} = \\Phi(x) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^x e^{-t^2/2}dt$$

注意：这是"依分布收敛"（弱收敛），不是"依概率收敛"。

---

**📐 直观理解：为什么叠加会产生正态？**

想象掷骰子：
- 1个骰子：均匀分布{1,2,3,4,5,6}
- 2个骰子之和：三角分布（7最可能）
- 10个骰子之和：接近正态
- 100个骰子之和：几乎完美的正态

**本质**：每个随机变量贡献了"一点随机性"，大量微小随机性的叠加效果就是正态分布。这就像"随机游走"——每步随机，但大量步数后，位置分布趋于正态。

**更深刻的理解**：正态分布是"最大熵"分布（在给定均值和方差的约束下）。大量随机因素的叠加，等价于信息熵最大化，自然趋向正态。

---

**📐 棣莫弗-拉普拉斯定理（二项分布的CLT）**

设Yₙ~B(n,p)，当n充分大时：

$$\\frac{Y_n - np}{\\sqrt{np(1-p)}} \\xrightarrow{d} N(0,1)$$

即：Yₙ ≈ N(np, np(1-p))

**适用条件**：np≥5且n(1-p)≥5（经验准则）

**历史意义**：这是历史上第一个中心极限定理（1733年），比列维-林德伯格定理早了近200年。棣莫弗最早发现二项分布的正态近似，拉普拉斯后来推广了这一结果。

**与泊松近似的关系**：
- np→∞, p→0, np=λ：用泊松近似
- n大, p不太小：用正态近似

**实际选择**：
| 场景 | 近似方法 | 条件 |
|------|----------|------|
| B(n,p), n大p不太小 | 正态近似N(np,np(1-p)) | np≥5, n(1-p)≥5 |
| B(n,p), n大p很小 | 泊松近似P(np) | p≤0.1, np适中 |
| B(n,p), n很大 | 两者皆可 | 正态更方便 |

---

**📐 中心极限定理的应用**

**应用1：概率近似计算**

设X₁,...,X₅₀独立同分布，E(Xᵢ)=2, D(Xᵢ)=4

求P{∑Xᵢ > 110}

∑Xᵢ ≈ N(100, 200)

P{∑Xᵢ>110} = P{(∑Xᵢ-100)/√200 > 10/√200}
≈ P{Z > 0.707} ≈ 1 - Φ(0.707) ≈ 0.24

**应用2：置信区间**

X̄ₙ ≈ N(μ, σ²/n)

P{|X̄ₙ-μ|<1.96σ/√n} ≈ 0.95

即μ的95%置信区间：[X̄ₙ-1.96σ/√n, X̄ₙ+1.96σ/√n]

---

**📐 连续性修正（离散分布正态近似）**

当用正态近似离散分布时，需要**连续性修正**：

P{Yₙ≤k} ≈ Φ((k+0.5-np)/√(np(1-p)))

**为什么+0.5？**：离散的{k}对应连续的[k-0.5, k+0.5]，所以P{Y≤k}应包含整个区间，需要右端+0.5。

---

**📐 CLT的应用步骤（标准化→查表→计算）**

**步骤1（标准化）**：将所求概率转化为标准正态形式
- 计算∑Xᵢ的近似分布：N(nμ, nσ²)
- 标准化：Z = (∑Xᵢ - nμ)/(√n·σ)

**步骤2（查表）**：用标准正态分布函数Φ(x)计算概率
- P{Z ≤ x} = Φ(x)
- 常用值：Φ(1.645)≈0.95, Φ(1.96)≈0.975, Φ(2.576)≈0.995

**步骤3（还原答案）**：将标准正态结果还原到原始问题

**例子**：X₁,...,X₃₆独立同分布，E(Xᵢ)=10, D(Xᵢ)=9
求P{∑Xᵢ > 380}

∑Xᵢ ≈ N(360, 324)
P{∑Xᵢ>380} = P{Z > (380-360)/18} = P{Z > 1.11} = 1-Φ(1.11) ≈ 0.1335

---

**📐 样本量n的选取**

CLT给出了近似精度与样本量n的关系：

**经验准则**：
- 原始分布近似对称（如均匀分布）：n≥15即可
- 原始分布轻微偏态（如指数分布）：n≥30
- 原始分布严重偏态（如χ²(1)）：n≥100

**Berry-Esseen定理**：|Fₙ(x)-Φ(x)| ≤ C·E|X-μ|³/(σ³√n)
- 收敛速度为O(1/√n)
- E|X-μ|³/σ³越大的分布（越偏），需要越大的n

**置信区间的样本量**：要使μ的95%置信区间宽度为2δ：
n ≥ (1.96σ/δ)²

---

**📐 CLT与大数定律的关系**

| 比较项 | 大数定律 | 中心极限定理 |
|--------|----------|------------|
| 结论 | X̄ₙ → μ（依概率） | √n(X̄ₙ-μ) → N(0,σ²)（依分布） |
| 信息量 | 只说"收敛到什么" | 还说"收敛的分布形状" |
| 速度 | 不涉及 | O(1/√n) |
| 关系 | 弱结论 | 强结论（蕴含大数定律） |

**CLT蕴含大数定律**：由CLT，√n(X̄ₙ-μ)/σ → N(0,1)
所以X̄ₙ-μ = σ/√n · [√n(X̄ₙ-μ)/σ] → 0（因为σ/√n→0）
即X̄ₙ → μ（依概率），这就是大数定律。

**直观理解**：大数定律说"趋于0"，CLT进一步说"乘以√n后趋于正态"——多了一个√n的放大，看到了更细致的收敛行为。

---

**⚠️ 常见误区**

**误区1**："n≥30就一定可以用CLT"
- **纠正**：30只是经验准则。原始分布越偏，需要越大的n。指数分布n≈30即可，严重偏态可能需要n>100

**误区2**："CLT说Xᵢ本身趋近正态"
- **纠正**：CLT说的是**标准化之和**趋近正态，原始变量Xᵢ的分布不变！

**误区3**："任何大量随机变量之和都趋近正态"
- **纠正**：需要独立性！如果变量高度相关，CLT可能不适用。此外，单个变量的"贡献"不能过于主导（如帕累托分布的尾部过重）`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
        { start: 150, end: 220, type: 'formula' },
        { start: 620, end: 690, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：正态分布是"吸引子"**

中心极限定理的深刻含义：正态分布是概率分布空间中的一个"吸引子"——在标准化求和的运算下，几乎所有分布都会被"吸引"到正态分布。

这类似于物理学中的"中心极限行为"：
- 大量分子的速度分布→麦克斯韦分布（本质是正态）
- 大量噪声的叠加→高斯噪声
- 测量误差的分布→正态分布

从数学角度，CLT的本质是特征函数的"旋转"：独立变量之和的特征函数=各特征函数之积，标准化后的特征函数在0点附近展开，一阶项恰好对应正态分布的特征函数exp(-t²/2)。

正态分布之所以"正态"，不是因为它常见，而是因为它**必然**——只要满足独立性条件，正态分布就是叠加效应的必然归宿。`,
      extension: `**🚀 CLT的推广**

1. **林德伯格条件**：独立（不必同分布）的CLT
   - 条件：没有单个变量"过于主导"求和结果
   - 核心要求：max σᵢ²/∑σⱼ² → 0

2. **李雅普诺夫条件**：林德伯格条件的充分条件
   - 存在δ>0，使∑E[|Xᵢ-μᵢ|^(2+δ)]/(∑σⱼ²)^(1+δ/2) → 0

3. **多元CLT**：随机向量的CLT
   - X̄ₙ ⟶ᵈ N(μ, Σ/n)

4. **相依变量的CLT**：马尔可夫链CLT、混合过程CLT等`,
      further: [
        { id: 'f1', title: 'Berry-Esseen定理', content: 'CLT只保证n→∞时收敛，但实际需要知道n多大才够。\n\nBerry-Esseen定理给出收敛速度：\n|Fₙ(x) - Φ(x)| ≤ C·ρ/(σ³√n)\n\n其中ρ=E|X-μ|³, C≤0.4748\n\n含义：\n1. 收敛速度是O(1/√n)——较慢\n2. 原始分布越偏（ρ/σ³越大），收敛越慢\n3. 对于均匀分布U(0,1)：n≈10已很接近\n4. 对于指数分布：n≈30才足够\n5. 对于严重偏态分布：可能需要n>100' },
        { id: 'f2', title: 'CLT与统计推断', content: 'CLT是统计推断的基石：\n\n1. **大样本假设检验**：\n   Z = (X̄-μ₀)/(σ/√n) ~ N(0,1)\n   即使总体非正态，n大时仍可用Z检验\n\n2. **置信区间**：\n   X̄ ± z_{α/2}·σ/√n\n\n3. **比例检验**：\n   p̂ ± z_{α/2}·√(p̂(1-p̂)/n)\n\n4. **回归系数**：\n   大样本下，OLS估计量渐近正态\n\n没有CLT，整个大样本统计理论将不复存在。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '考试成绩的正态近似',
        description: `**问题**

某考试有100道判断题（每题1分），每题独立猜对概率0.5。求猜对60题以上的概率。

**解**

设Y为猜对题数，Y~B(100, 0.5)

E(Y) = np = 50
D(Y) = np(1-p) = 25

棣莫弗-拉普拉斯定理：Y ≈ N(50, 25)

P{Y≥60} = P{Y>59.5}（连续性修正）
= P{(Y-50)/5 > (59.5-50)/5}
= P{Z > 1.9}
= 1 - Φ(1.9)
≈ 1 - 0.9713 = 0.0287

猜对60题以上的概率约2.87%，纯猜基本不可能及格（60分）。`,
        scenario: '调整题数和猜对概率，观察正态近似效果。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '样本均值的置信区间',
        description: `**问题**

某工厂生产灯泡，寿命X的均值μ未知，标准差σ=100小时。随机抽取n=64只灯泡，测得X̄=1520小时。求μ的95%置信区间。

**解**

由CLT：X̄ ≈ N(μ, σ²/n) = N(μ, 10000/64) = N(μ, 156.25)

P{|X̄-μ|<1.96·√(156.25)} ≈ 0.95

1.96×12.5 = 24.5

95%置信区间：[1520-24.5, 1520+24.5] = [1495.5, 1544.5]

即以95%的置信度认为灯泡平均寿命在1495.5~1544.5小时之间。

若要提高精度到±10小时：
n ≥ (1.96×100/10)² = 384.16 ≈ 385`,
        scenario: '调整样本量和标准差，观察置信区间宽度变化。',
      },
    ],
    method: [
      { number: 1, title: '独立同分布CLT的解题步骤', description: `①确认X₁,...,Xₙ独立同分布，算出μ=E(Xᵢ)和σ²=D(Xᵢ)\n②标准化：Z = (∑Xᵢ-nμ)/(√n·σ)\n③当n充分大时，Z≈N(0,1)\n④用Φ表计算近似概率` },
      { number: 2, title: '二项分布正态近似的解题步骤', description: `①确认Y~B(n,p)，检查np≥5且n(1-p)≥5\n②标准化：Z=(Y-np)/√(np(1-p))\n③连续性修正：P{Y≤k}≈Φ((k+0.5-np)/√(np(1-p)))\n④用Φ表计算` },
      { number: 3, title: '判断用泊松近似还是正态近似', description: `①n大p小(np适中)→泊松近似P(np)\n②n大p不太小(np≥5,n(1-p)≥5)→正态近似\n③n很大→两者皆可，正态更方便` },
    ],
  },
}

// ---- 第六章 数理统计的基本概念 ----

const populationSamplePoint: KnowledgePoint = {
  id: 'population-sample',
  moduleId: 'statistics-basics',
  name: '总体、样本与统计量',
  formula: '\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i',
  coreSentence: '统计推断的基石——用样本的"缩影"推断总体的"全貌"，统计量是连接两者的桥梁。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*sigma)*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 'mu', y: '1/(sqrt(2*3.14159)*sigma)', draggable: false, color: '#1565C0', label: '总体均值μ' },
          { id: 'p2', x: 'xbar', y: 0, draggable: false, color: '#2E7D32', label: 'X̄' },
        ],
        sliders: [
          { id: 'mu', name: 'mu', min: -3, max: 3, step: 0.1, defaultValue: 0, label: '总体均值μ' },
          { id: 'sigma', name: 'sigma', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '总体标准差σ' },
          { id: 'sample_size', name: 'sample_size', min: 5, max: 100, step: 5, defaultValue: 30, label: '样本量' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '从总体到样本到统计量',
          type: 'step',
          steps: [
            { id: 's1', description: '总体分布N(μ,σ²)：我们想了解的"全貌"', changes: { mu: 0, sigma: 1, sample_size: 30 } },
            { id: 's2', description: '从中随机抽取n个样本X₁,X₂,...,Xₙ', changes: { mu: 0, sigma: 1, sample_size: 30 } },
            { id: 's3', description: '构造样本均值X̄：一个随机变量', changes: { mu: 0, sigma: 1, sample_size: 30 } },
            { id: 's4', description: '样本方差S²：衡量样本离散程度', changes: { mu: 0, sigma: 1, sample_size: 30 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：用"部分"推断"整体"**

数理统计的核心任务是：从总体中抽取部分样本，利用样本信息推断总体的未知性质。而统计量，就是从样本中提炼信息的工具。

---

**📐 总体与个体**

**总体**：研究对象的全体，通常用随机变量X表示。总体的数学描述是一个概率分布F(x)或密度函数f(x)。

**个体**：总体中的每个成员，即X的每个可能取值。

例如：研究某厂灯泡寿命，所有灯泡的寿命构成总体X，每个灯泡的寿命值是个体。

**总体分布的数学表述**：
- 离散型：P(X=xₖ) = pₖ, k=1,2,...，总体由分布律{pₖ}完全刻画
- 连续型：总体由密度函数f(x)刻画，P(a≤X≤b)=∫ₐᵇf(x)dx
- 一般情形：总体由分布函数F(x)=P(X≤x)刻画

**注意**：总体是一个概率分布——说"总体X~N(μ,σ²)"就是用分布来描述总体。参数θ（如μ,σ²）刻画了总体的特征，统计推断的目标就是通过样本推断θ。

---

**📐 简单随机样本**

从总体X中抽取的n个独立同分布的随机变量X₁,X₂,...,Xₙ称为**简单随机样本**，简称样本。满足：
1. **独立性**：X₁,X₂,...,Xₙ相互独立，即联合分布等于边缘分布之积：F(x₁,...,xₙ)=F(x₁)·...·F(xₙ)
2. **同分布性**：每个Xᵢ与总体X同分布，即F_{Xᵢ}(x)=F(x)对一切x成立

**样本容量**n：样本中包含的个体数目。

**样本的严格定义**：简单随机样本(X₁,X₂,...,Xₙ)是n维随机向量，其联合分布为：
$$f(x_1, x_2, \\ldots, x_n) = \\prod_{i=1}^n f(x_i)$$

**直观理解**：想象一个装满球的箱子（总体），每次摸一个球记录后放回（保证独立性），摸n次就得到一个简单随机样本。

---

**📐 样本的双重性**

样本具有"双重身份"，理解这一点对后续学习至关重要：

1. **抽样前**：X₁,X₂,...,Xₙ是随机变量，因为每次抽样结果事先不确定
2. **抽样后**：x₁,x₂,...,xₙ是确定的数值（观测值），即样本的一次实现

因此，统计量g(X₁,...,Xₙ)也是随机变量（抽样前），而g(x₁,...,xₙ)是一个确定值（抽样后）。计算概率、求期望时用随机变量视角；代入具体数据计算时用观测值视角。

---

**📐 统计量的定义**

设X₁,X₂,...,Xₙ是来自总体X的样本，g(X₁,X₂,...,Xₙ)是**不含任何未知参数**的函数，则称g为**统计量**。

**关键**：统计量中不能含有未知参数！因为统计量是可以由样本值完全计算出来的量。

例如：X~N(μ,σ²)，若μ未知，则X̄=∑Xᵢ/n是统计量，但(X̄-μ)/σ不是统计量。

**统计量与参数的区别**：
- 参数θ：刻画总体特征的未知常数，如μ,σ²
- 统计量g：完全由样本决定的量，不含未知参数
- 估计：用统计量g来"估计"参数θ，即θ̂=g(X₁,...,Xₙ)

---

**📐 常用统计量**

| 统计量 | 定义 | 说明 |
|--------|------|------|
| 样本均值 | X̄ = (1/n)∑Xᵢ | 描述样本集中趋势 |
| 样本方差 | S² = (1/(n-1))∑(Xᵢ-X̄)² | 描述样本离散程度 |
| 样本标准差 | S = √S² | |
| 样本k阶原点矩 | Aₖ = (1/n)∑Xᵢᵏ | k=1时即X̄ |
| 样本k阶中心矩 | Bₖ = (1/n)∑(Xᵢ-X̄)ᵏ | k=2时不是S²（差n/(n-1)倍） |

**⚠️ 最常见误区：样本方差为什么除以n-1而不是n？**

因为E[S²] = σ²（无偏性），若除以n则E[(1/n)∑(Xᵢ-X̄)²] = (n-1)σ²/n ≠ σ²。直观理解：用X̄代替μ会"损失一个自由度"，所以分母少1。

---

**📐 样本均值的性质**

若总体X的E(X)=μ, D(X)=σ²，则：
- E(X̄) = μ（X̄是μ的无偏估计）
- D(X̄) = σ²/n（样本越大，X̄越稳定）

这告诉我们：**样本均值X̄的期望等于总体均值，但其方差只有总体方差的1/n**。

---

**📐 样本分布函数与经验分布函数**

样本分布函数（经验分布函数）是从样本直接构造的分布函数：
$$F_n(x) = \\frac{1}{n}\\sum_{i=1}^n I_{\\{X_i \\leq x\\}}$$

其中I{Xᵢ≤x}是指示函数。Fₙ(x)表示样本中不超过x的比例。

**性质**：
1. Fₙ(x)是非减的阶梯函数，在每个观测值处跳跃1/n
2. Fₙ(−∞)=0, Fₙ(+∞)=1
3. 对固定x，nFₙ(x)~B(n,F(x))

**格里文科定理（Glivenko-Cantelli）**：
$$P\\{\\lim_{n \\to \\infty} \\sup_{x} |F_n(x) - F(x)| = 0\\} = 1$$

含义：当n→∞时，经验分布函数Fₙ(x)一致收敛到总体分布F(x)——这是用样本推断总体的理论基石，也是非参数统计的根本保证。`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：统计量是信息的"压缩器"**

统计量的本质是从高维样本(X₁,...,Xₙ)到低维数值的映射。一个好的统计量应当在压缩信息的同时尽量保留我们关心的总体特征。

样本均值X̄保留了总体位置信息μ，样本方差S²保留了总体离散信息σ²。这种"压缩而不丢失关键信息"的思想，贯穿整个数理统计。

更深层地，充分统计量的概念告诉我们：某些统计量能保留样本中关于参数的全部信息——这是Fisher提出的信息论视角。`,
      extension: `**🚀 充分统计量**

若在给定统计量T的条件下，样本的分布不再依赖参数θ，则称T为θ的充分统计量。

Fisher-Neyman因子分解定理：T是θ的充分统计量 ⟺ 似然函数可分解为：
L(θ) = g(T(x),θ)·h(x)

例如：X₁,...,Xₙ i.i.d. ~ N(μ,σ²)中，X̄是μ的充分统计量（σ²已知时）。`,
      further: [
        { id: 'f1', title: '自由度的直观理解', content: '自由度 = 数据点个数 - 约束条件个数\n\n样本方差S² = ∑(Xᵢ-X̄)²/(n-1)中，n个偏差(Xᵢ-X̄)满足一个约束：∑(Xᵢ-X̄)=0，因此自由度=n-1。\n\n直观：n个"自由变化"的量被一个线性约束"锁住"了一个，只剩n-1个自由度。' },
        { id: 'f2', title: '样本矩与总体矩的关系', content: '由大数定律：\nAₖ = (1/n)∑Xᵢᵏ → E(Xᵏ) = μₖ (a.s.)\n\n样本k阶原点矩Aₖ是总体k阶原点矩μₖ的强相合估计。\n这就是矩估计法的理论基础：用样本矩近似总体矩。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '计算样本均值和样本方差',
        description: `**问题**

从某总体中抽取5个样本：3, 5, 7, 4, 6，求样本均值X̄和样本方差S²。

**解**

X̄ = (3+5+7+4+6)/5 = 25/5 = 5

S² = (1/4)[(3-5)²+(5-5)²+(7-5)²+(4-5)²+(6-5)²]
   = (1/4)[4+0+4+1+1] = 10/4 = 2.5

注意：分母是n-1=4而非n=5！`,
        scenario: '调整样本值，观察均值和方差的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '质量控制——用样本推断产品合格率',
        description: `**问题**

某工厂生产零件，直径X~N(μ,0.01²)。随机抽取16个零件，测得样本均值X̄=10.05mm。问：能否认为μ=10mm？

**分析**

X̄~N(μ,σ²/n) = N(μ, 0.01²/16) = N(μ, 0.0025²)

若μ=10，则X̄~N(10, 0.0025²)
P{|X̄-10|>0.05} = P{|Z|>0.05/0.0025} = P{|Z|>20} ≈ 0

如此小的概率事件竟然发生，说明μ=10的假设值得怀疑。

这就是假设检验的思想雏形——用统计量的分布来判断假设的合理性。`,
        scenario: '调整样本均值和样本量，观察对判断的影响。',
      },
    ],
    method: [
      { number: 1, title: '判断是否为统计量', description: `①检查表达式是否只含样本X₁,...,Xₙ\n②检查是否含有未知参数\n③含未知参数→不是统计量；不含→是统计量\n④注意：已知常数不影响判断` },
      { number: 2, title: '计算常用统计量', description: `①X̄ = (1/n)∑xᵢ（算术平均）\n②S² = (1/(n-1))∑(xᵢ-X̄)²（注意除以n-1）\n③简化：S² = [∑xᵢ² - nX̄²]/(n-1)\n④Aₖ = (1/n)∑xᵢᵏ（样本k阶原点矩）` },
    ],
  },
}

const samplingDistributionsPoint: KnowledgePoint = {
  id: 'sampling-distributions',
  moduleId: 'statistics-basics',
  name: '三大抽样分布',
  formula: '\\chi^2(n), \\quad t(n), \\quad F(m,n)',
  coreSentence: 'χ²、t、F三大分布是统计推断的"三大武器"——它们分别由正态分布构造而来，是假设检验和区间估计的理论基础。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '(1/(2^(n/2)*gamma(n/2)))*x^(n/2-1)*exp(-x/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: 'gamma((n+1)/2)/(sqrt(n*3.14159)*gamma(n/2))*(1+x^2/n)^(-(n+1)/2)', color: '#1565C0', visible: false },
          { id: 'f3', expression: '(gamma((m+n)/2)/(gamma(m/2)*gamma(n/2)))*(m/n)^(m/2)*x^(m/2-1)*(1+m*x/n)^(-(m+n)/2)', color: '#2E7D32', visible: false },
        ],
        points: [
          { id: 'p1', x: 'n', y: 0, draggable: false, color: '#C62828', label: 'n' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 1, max: 30, step: 1, defaultValue: 5, label: '自由度 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '三大分布曲线变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'χ²(n)分布：n个独立标准正态的平方和，右偏', changes: { n: 5 } },
            { id: 's2', description: 'χ²(n)：自由度增大，趋近正态', changes: { n: 20 } },
            { id: 's3', description: 't(n)分布：比标准正态稍"胖"，尾部更厚', changes: { n: 3 } },
            { id: 's4', description: 't(n)：自由度增大，趋近N(0,1)', changes: { n: 30 } },
            { id: 's5', description: 'F分布：两个χ²之比，用于比较方差', changes: { n: 10 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：正态分布"变出"三大分布**

三大抽样分布都是从标准正态分布Z~N(0,1)构造出来的。它们是后续假设检验和区间估计的"钥匙"——不同的检验问题对应不同的分布。

---

**📐 χ²分布（卡方分布）**

**定义**：设Z₁,Z₂,...,Zₙ独立同分布于N(0,1)，则
$$\\chi^2 = Z_1^2 + Z_2^2 + \\cdots + Z_n^2 \\sim \\chi^2(n)$$

n称为**自由度**。

**密度函数**：
$$f(x) = \\frac{1}{2^{n/2}\\Gamma(n/2)} x^{n/2-1} e^{-x/2}, \\quad x > 0$$

其中Γ(α)=∫₀^∞t^{α-1}e^{-t}dt是Gamma函数。密度函数的形状取决于n：n≤2时单调递减，n>2时先升后降，在x=n-2处取最大值。

**性质**：
1. 期望：E[χ²(n)] = n
2. 方差：D[χ²(n)] = 2n
3. **可加性**：若X~χ²(m), Y~χ²(n)且独立，则X+Y~χ²(m+n)
4. 当n→∞时，χ²(n)→N(n, 2n)（渐近正态）

**可加性的直观理解**：m个独立标准正态平方和加上n个独立标准正态平方和，等于m+n个独立标准正态平方和。

**密度函数特点**：
- 只在x>0上取值（非负随机变量的分布）
- 右偏态，自由度n越大越接近对称

**重要定理**：若X₁,...,Xₙ i.i.d. ~ N(μ,σ²)，则∑(Xᵢ-μ)²/σ² ~ χ²(n)

---

**📐 t分布（学生氏分布）**

**定义**：设Z~N(0,1), Y~χ²(n)且独立，则
$$T = \\frac{Z}{\\sqrt{Y/n}} \\sim t(n)$$

**密度函数**：
$$f(x) = \\frac{\\Gamma((n+1)/2)}{\\sqrt{n\\pi}\\Gamma(n/2)} \\left(1+\\frac{x^2}{n}\\right)^{-(n+1)/2}, \\quad -\\infty < x < +\\infty$$

**性质**：
1. 密度函数关于原点对称（偶函数）
2. 比N(0,1)的尾部更厚（"胖尾"），因此对极端值更敏感
3. E[T]=0(n>1), D[T]=n/(n-2)(n>2)
4. **当n→∞时，t(n)→N(0,1)**（实际应用中n≥30即可近似）

**t分布与标准正态的对比**：
- 中心处：t分布的峰值更低（因为质量被"推"到了尾部）
- 尾部：t分布尾部更厚，P{|T|>3}远大于P{|Z|>3}
- 当n=1时，t(1)就是Cauchy分布，期望和方差都不存在！

**直观理解**：t分布是"不确定的σ"导致的。当σ未知而用S代替时，分母的不确定性使得分布尾部变厚。

---

**📐 F分布**

**定义**：设U~χ²(m), V~χ²(n)且独立，则
$$F = \\frac{U/m}{V/n} \\sim F(m,n)$$

m称为第一自由度，n称为第二自由度。

**密度函数**：
$$f(x) = \\frac{\\Gamma((m+n)/2)}{\\Gamma(m/2)\\Gamma(n/2)} \\left(\\frac{m}{n}\\right)^{m/2} x^{m/2-1} \\left(1+\\frac{m}{n}x\\right)^{-(m+n)/2}, \\quad x > 0$$

**性质**：
1. 只在x>0上取值
2. 若F~F(m,n)，则1/F~F(n,m)（**倒数关系**）
3. F₁₋α(m,n) = 1/Fα(n,m)（分位点互推）
4. 当n→∞时，mF→χ²(m)

**重要用途**：比较两个正态总体的方差（方差齐性检验）。

---

**📐 上α分位点**

设随机变量X的分布函数为F(x)，则满足P{X>xα}=α的点xα称为**上α分位点**。

χ²α(n)：P{χ²(n)>χ²α(n)}=α
tα(n)：P{t(n)>tα(n)}=α
Fα(m,n)：P{F(m,n)>Fα(m,n)}=α

**查表方法**：
- χ²分布：根据自由度n和α值查χ²分布表，如χ²₀.₀₅(10)=18.307
- t分布：根据自由度n和α值查t分布表，如t₀.₀₂₅(10)=2.228
- F分布：根据两个自由度(m,n)和α值查F分布表，如F₀.₀₅(5,10)=3.33

**分位点互推关系**：
- t分布对称：t₁₋α(n) = -tα(n)（例：t₀.₉₇₅(10) = -t₀.₀₂₅(10) = -2.228）
- F分布：F₁₋α(m,n) = 1/Fα(n,m)（例：F₀.₉₅(10,5) = 1/F₀.₀₅(5,10) = 1/3.33 ≈ 0.30）
- χ²分布没有简单的互推公式，需直接查表

---

**⚠️ 常见误区**

**误区1**："χ²分布就是正态分布的平方"
- **纠正**：是n个独立标准正态的平方和，不是单个正态的平方

**误区2**："t分布自由度越大越胖"
- **纠正**：恰好相反！自由度越大，t分布越接近标准正态，尾部越"瘦"

**误区3**："F分布的分子分母自由度可以互换"
- **纠正**：F(m,n)和F(n,m)是不同的分布！互换需注意1/F~F(n,m)`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：三大分布的统一构造逻辑**

三大抽样分布有统一的"DNA"——它们都由标准正态分布Z~N(0,1)通过不同的"组合方式"构造而来：

χ²(n) = Z₁²+...+Zₙ²（平方求和）
t(n) = Z/√(χ²/n)（标准化+除以不确定的σ）
F(m,n) = (χ²_m/m)/(χ²_n/n)（两个χ²的比值）

这三种构造方式分别对应了统计推断中的三类核心问题：
- χ²分布：检验方差（单个总体的离散程度）
- t分布：检验均值（σ未知时的位置推断）
- F分布：比较方差（两个总体离散程度的对比）

理解了这层逻辑，三大分布就不再是三个孤立的知识点，而是一个有机整体。`,
      extension: `**🚀 非中心χ²分布与非中心t分布**

当Z₁,...,Zₙ i.i.d. ~ N(δᵢ,1)时，∑Zᵢ²~χ²(n,λ)，其中λ=∑δᵢ²称为非中心参数。

当Z~N(δ,1), Y~χ²(n)独立时，Z/√(Y/n)~t(n,δ)，δ称为非中心参数。

非中心分布在功效分析中起核心作用——它刻画了"假设不成立时，检验统计量的真实分布"。`,
      further: [
        { id: 'f1', title: 'χ²分布的可加性证明', content: '设X~χ²(m), Y~χ²(n)独立，由矩母函数：\nM_X(t) = (1-2t)^(-m/2)\nM_Y(t) = (1-2t)^(-n/2)\nM_{X+Y}(t) = M_X(t)·M_Y(t) = (1-2t)^(-(m+n)/2)\n这正是χ²(m+n)的矩母函数，由唯一性定理得证。' },
        { id: 'f2', title: '为什么叫"学生氏"分布', content: 't分布由William Gosset在1908年发表，当时他在Guinness啤酒厂工作。啤酒厂禁止员工发表论文（怕泄露商业秘密），Gosset用笔名"Student"发表，因此得名"学生氏分布"。\n\nGosset解决的实际问题正是小样本（n<30）情况下的均值推断，这在酿酒质量控制中至关重要。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '利用χ²分布求概率',
        description: `**问题**

设X₁,X₂,...,X₁₀ i.i.d. ~ N(0,1)，求P{∑Xᵢ²>18.31}。

**解**

由χ²分布定义，∑Xᵢ²~χ²(10)

查χ²分布表：χ²₀.₀₅(10) = 18.307

因此P{∑Xᵢ²>18.31} ≈ 0.05

这意味着：10个独立标准正态变量的平方和超过18.31的概率只有5%。`,
        scenario: '调整自由度和分位点，观察概率变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '金融风险管理——t分布与厚尾',
        description: `**问题背景**

金融收益率数据通常呈现"厚尾"特征——极端事件（暴跌、暴涨）发生的概率比正态分布预测的要高。用t分布建模更合理。

**分析**

标准正态：P{|Z|>3} ≈ 0.27%
t(5)：P{|T|>3} ≈ 3.0%

在风险价值(VaR)计算中，若误用正态分布，会严重低估尾部风险。t(5)预测的3σ外概率是正态的11倍！

这就是2008年金融危机的数学根源之一——"黑天鹅"事件在正态假设下几乎不可能发生，但在厚尾分布下并非如此。`,
        scenario: '调整t分布自由度，观察尾部概率变化。',
      },
    ],
    method: [
      { number: 1, title: '识别抽样分布类型', description: `①看统计量形式：∑(标准正态)²→χ²；标准正态/√(χ²/n)→t；(χ²/m)/(χ²/n)→F\n②确定自由度：χ²的自由度=独立标准正态个数；t的自由度=分母χ²的自由度；F有两个自由度\n③注意独立性条件` },
      { number: 2, title: '利用分位点关系互推', description: `①t分布对称：t₁₋α(n)=-tα(n)\n②F分布互推：F₁₋α(m,n)=1/Fα(n,m)\n③χ²无简单互推，需查表\n④常用：α=0.05, 0.025, 0.01` },
    ],
  },
}

const normalSamplingTheoremPoint: KnowledgePoint = {
  id: 'normal-sampling-theorem',
  moduleId: 'statistics-basics',
  name: '正态总体的抽样分布定理',
  formula: '\\bar{X} \\sim N(\\mu, \\frac{\\sigma^2}{n}), \\quad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)',
  coreSentence: '正态总体是数理统计的"乐土"——X̄和S²的精确分布都能推导出来，且两者独立。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*sigma)*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159)*sigma/sqrt(n))*exp(-(x-mu)^2/(2*sigma^2/n))', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'mu', y: 0, draggable: false, color: '#5D4037', label: 'μ' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 1, max: 30, step: 1, defaultValue: 5, label: '样本量 n' },
          { id: 'sigma', name: 'sigma', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '总体标准差 σ' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: 'X̄的分布随n变化',
          type: 'step',
          steps: [
            { id: 's1', description: '总体X~N(0,1)，X̄~N(0,1/n)', changes: { n: 1, sigma: 1 } },
            { id: 's2', description: 'n=5：X̄的方差缩小为σ²/5', changes: { n: 5, sigma: 1 } },
            { id: 's3', description: 'n=10：X̄更集中', changes: { n: 10, sigma: 1 } },
            { id: 's4', description: 'n=30：X̄高度集中，接近μ', changes: { n: 30, sigma: 1 } },
            { id: 's5', description: '标准正态 vs X̄分布对比', changes: { n: 4, sigma: 1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：正态总体下一切都"精确可知"**

正态总体之所以特殊，是因为在正态假设下，X̄和S²的精确分布都能推导出来，而且两者独立。这为后续的区间估计和假设检验提供了精确的理论依据。

---

**📐 单正态总体下的抽样分布**

设X₁,X₂,...,Xₙ是来自N(μ,σ²)的样本，X̄为样本均值，S²为样本方差。

**定理1（X̄的分布）**：
$$\\bar{X} \\sim N(\\mu, \\frac{\\sigma^2}{n})$$

标准化：$$\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} \\sim N(0,1)$$

**证明思路**：X̄=(X₁+...+Xₙ)/n是正态变量的线性组合，正态分布具有"再生性"——独立正态变量的线性组合仍是正态。由期望和方差的性质：E(X̄)=μ, D(X̄)=σ²/n，因此X̄~N(μ,σ²/n)。

**理解**：
- X̄仍是正态分布（正态分布的线性组合仍是正态）
- 均值不变，方差缩为1/n
- n越大，X̄越"稳定"地聚集在μ周围

**定理2（S²的分布）**：
$$\\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)$$

**证明思路**（基于Cochran分解）：
$$\\sum_{i=1}^n \\frac{(X_i-\\mu)^2}{\\sigma^2} = \\sum_{i=1}^n \\frac{(X_i-\\bar{X})^2}{\\sigma^2} + \\frac{n(\\bar{X}-\\mu)^2}{\\sigma^2}$$

左边~χ²(n)，右边第二项~χ²(1)，由Cochran定理知第一项~χ²(n-1)且与第二项独立，即(n-1)S²/σ²~χ²(n-1)且与X̄独立。

**理解**：
- (n-1)是自由度，源于"用X̄代替μ损失1个自由度"
- 这个定理可以用来对σ²做区间估计和假设检验

**定理3（X̄与S²独立）**：
X̄和S²相互独立！

这是一个非常不平凡的结论——虽然S²的计算公式中含有X̄，但它们作为随机变量却是独立的。这个独立性是正态分布的特有性质，非正态总体下通常不成立。

**独立性的直观理解**：X̄反映数据的"位置"，S²反映数据的"散布"。正态分布关于均值对称，知道均值在哪并不提供散布程度的信息——位置和散布是"解耦"的。但对偏态分布（如指数分布），均值的位置会影响散布的分布，因此不独立。

**定理4（σ未知时的t分布）**：
$$\\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} \\sim t(n-1)$$

这是最实用的定理：当σ未知时，用S代替σ，统计量服从t分布。

推导：U=(X̄-μ)/(σ/√n)~N(0,1), V=(n-1)S²/σ²~χ²(n-1)且独立，
所以T=U/√(V/(n-1))=(X̄-μ)/(S/√n)~t(n-1)

---

**📐 双正态总体下的抽样分布**

设X₁,...,Xₙ₁~N(μ₁,σ₁²), Y₁,...,Yₙ₂~N(μ₂,σ₂²)，两样本独立。

**均值差的分布**：
$$\\bar{X}-\\bar{Y} \\sim N(\\mu_1-\\mu_2, \\frac{\\sigma_1^2}{n_1}+\\frac{\\sigma_2^2}{n_2})$$

**σ₁=σ₂=σ时**（方差齐性）：
$$\\frac{(\\bar{X}-\\bar{Y})-(\\mu_1-\\mu_2)}{S_w\\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}} \\sim t(n_1+n_2-2)$$

其中S_w² = [(n₁-1)S₁²+(n₂-1)S₂²]/(n₁+n₂-2)是合并方差估计。

**方差比的分布**：
$$\\frac{S_1^2/\\sigma_1^2}{S_2^2/\\sigma_2^2} \\sim F(n_1-1, n_2-1)$$

特别地，当σ₁=σ₂时：S₁²/S₂²~F(n₁-1,n₂-1)

---

**📐 定理的应用场景**

| 定理 | 应用场景 | 对应方法 |
|------|---------|---------|
| X̄~N(μ,σ²/n) | σ²已知时推断μ | Z检验/Z置信区间 |
| (X̄-μ)/(S/√n)~t(n-1) | σ²未知时推断μ | t检验/t置信区间 |
| (n-1)S²/σ²~χ²(n-1) | 推断σ² | χ²检验/χ²置信区间 |
| X̄₁-X̄₂的分布 | 比较两总体均值 | 两样本t检验 |
| S₁²/S₂²~F | 比较两总体方差 | F检验/方差齐性检验 |

**核心逻辑**：先确定要推断的参数和已知条件，再选择对应的定理和分布——这就是统计推断的"配方"。

---

**⚠️ 常见误区**

**误区1**："X̄和S²计算时用到了相同的数据，所以不独立"
- **纠正**：在正态总体下，X̄和S²确实独立，这是正态分布的特殊性质，不适用于其他分布

**误区2**："(n-1)S²/σ²~χ²(n-1)对所有总体成立"
- **纠正**：这个结论只在正态总体下成立，非正态总体需要用渐近理论`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：正态分布的"再生性"与"独立分解"**

正态总体抽样分布定理的深层基础是两个性质：

**再生性**（稳定性）：独立正态变量的线性组合仍是正态。这使得X̄~N(μ,σ²/n)可以直接推导。

**独立分解**（Cochran定理）：正态样本的总离差可以分解为相互独立的分量。∑(Xᵢ-μ)²/σ²=∑(Xᵢ-X̄)²/σ² + n(X̄-μ)²/σ²，左边~χ²(n)，第二项~χ²(1)，所以第一项~χ²(n-1)且与第二项独立——同时证明了定理2和定理3！

这就是正态分布在数理统计中地位如此特殊的原因：只有正态总体才能给出X̄和S²的精确分布和独立性。`,
      extension: `**🚀 非正态总体的渐近理论**

当总体不服从正态分布时，由中心极限定理，n足够大时：
(X̄-μ)/(S/√n) → N(0,1)（渐近成立）

这是大样本统计推断的理论基础。但"n多大才够"取决于总体的偏度和峰度——越偏离正态，需要的n越大。`,
      further: [
        { id: 'f1', title: 'Cochran分解定理', content: '设X₁,...,Xₙ i.i.d. ~ N(0,1)，Q=∑Xᵢ²=Q₁+Q₂+...+Qₖ，其中Qᵢ是秩为fᵢ的二次型。\n\n则Q₁,...,Qₖ相互独立，且Qᵢ~χ²(fᵢ)的充要条件是：∑fᵢ=n。\n\n这个定理统一解释了为什么(n-1)S²/σ²~χ²(n-1)且与X̄独立。' },
        { id: 'f2', title: 'X̄与S²独立的直觉', content: '直观理解：X̄反映"位置"，S²反映"散布"。对于正态分布，知道均值在哪并不能告诉你数据有多分散——这就是"位置"和"散布"的独立性。\n\n但对于均匀分布，如果X̄靠近分布中心，S²倾向于较小（数据被"挤"在中间），所以X̄和S²不独立。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '求X̄落入某区间的概率',
        description: `**问题**

设X₁,...,X₂₅ i.i.d. ~ N(2,4²)，求P{|X̄-2|≤1.6}。

**解**

X̄~N(2, 4²/25) = N(2, 0.8²)

P{|X̄-2|≤1.6} = P{|(X̄-2)/0.8|≤2}
= P{-2≤Z≤2} = Φ(2)-Φ(-2)
= 2Φ(2)-1 ≈ 2×0.9772-1 = 0.9544

约95.4%的概率，X̄与μ的偏差不超过1.6。`,
        scenario: '调整μ、σ、n，观察X̄的分布变化和概率。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '双总体均值差的分布——药物疗效比较',
        description: `**问题**

比较A、B两种降压药的疗效。A组25人，服药后血压下降X̄₁=15mmHg, S₁=8；B组20人，X̄₂=12mmHg, S₂=6。假设两总体方差相等，求μ₁-μ₂的估计分布。

**解**

S_w² = [(25-1)×64+(20-1)×36]/(25+20-2) = (1536+684)/43 ≈ 51.63
S_w ≈ 7.19

((X̄₁-X̄₂)-(μ₁-μ₂))/(S_w√(1/25+1/20)) ~ t(43)

代入：T = (15-12)/(7.19×√(0.04+0.05)) = 3/(7.19×0.3) = 3/2.157 ≈ 1.39

t₀.₀₂₅(43)≈2.017，|T|<2.017，尚不能认为两药疗效有显著差异。`,
        scenario: '调整两组参数，观察均值差的检验结果。',
      },
    ],
    method: [
      { number: 1, title: '单正态总体抽样分布三步法', description: `①明确条件：σ²已知还是未知\n②σ²已知→用N(0,1)：U=(X̄-μ)/(σ/√n)\n③σ²未知→用t(n-1)：T=(X̄-μ)/(S/√n)\n④涉及S²→用χ²(n-1)：(n-1)S²/σ²~χ²(n-1)` },
      { number: 2, title: '双正态总体抽样分布', description: `①均值差→N或t分布（取决于σ是否已知/相等）\n②方差比→F分布：S₁²/S₂²~F(n₁-1,n₂-1)（σ₁=σ₂时）\n③注意两样本必须独立\n④成对数据需用差值dᵢ=Xᵢ-Yᵢ转为单总体问题` },
    ],
  },
}

const orderStatisticsPoint: KnowledgePoint = {
  id: 'order-statistics',
  moduleId: 'statistics-basics',
  name: '次序统计量与经验分布函数',
  formula: 'F_n(x) = \\frac{1}{n}\\sum_{i=1}^n I_{\\{X_i \\leq x\\}}',
  coreSentence: '经验分布函数是总体分布函数的"镜子"——格里文科定理保证了当n→∞时，这面镜子越来越清晰。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(1+exp(-1.5*x))', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: -2, y: 0, draggable: false, color: '#1565C0', label: 'X₍₁₎' },
          { id: 'p2', x: -0.5, y: 0.2, draggable: false, color: '#1565C0', label: 'X₍₂₎' },
          { id: 'p3', x: 0.5, y: 0.4, draggable: false, color: '#1565C0', label: 'X₍₃₎' },
          { id: 'p4', x: 1.5, y: 0.6, draggable: false, color: '#1565C0', label: 'X₍₄₎' },
          { id: 'p5', x: 2.5, y: 0.8, draggable: false, color: '#1565C0', label: 'X₍₅₎' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 50, step: 5, defaultValue: 5, label: '样本量 n' },
          { id: 'k', name: 'k', min: 1, max: 25, step: 1, defaultValue: 3, label: '次序 k' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '经验分布函数逼近总体分布',
          type: 'step',
          steps: [
            { id: 's1', description: 'n=5：经验分布函数F₅(x)是粗糙的阶梯函数', changes: { n: 5, k: 3 } },
            { id: 's2', description: 'n=10：阶梯更多，开始呈现总体的形状', changes: { n: 10, k: 5 } },
            { id: 's3', description: 'n=20：经验分布函数已很接近总体分布函数', changes: { n: 20, k: 10 } },
            { id: 's4', description: 'n=50：几乎重合——格里文科定理的体现', changes: { n: 50, k: 25 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：用数据"画"出分布函数**

经验分布函数Fₙ(x)是从样本直接构造的分布函数——它不需要知道总体的任何信息，完全由数据决定。当样本量增大时，Fₙ(x)会越来越接近总体的真实分布F(x)。

---

**📐 次序统计量的定义与分布**

设X₁,X₂,...,Xₙ是来自总体F(x)的样本，将它们按从小到大排列：
$$X_{(1)} \\leq X_{(2)} \\leq \\cdots \\leq X_{(n)}$$

则X₍ₖ₎称为第k个**次序统计量**。

**注意**：
- X₍₁₎=min(X₁,...,Xₙ)是最小值
- X₍ₙ₎=max(X₁,...,Xₙ)是最大值
- X₍ₖ₎不再是独立同分布的！（排列后引入了依赖关系）

**次序统计量的密度**：

若总体有密度f(x)，则X₍ₖ₎的密度为：
$$f_{X_{(k)}}(x) = \\frac{n!}{(k-1)!(n-k)!}[F(x)]^{k-1}[1-F(x)]^{n-k}f(x)$$

直观理解：X₍ₖ₎在x处取值意味着——n个样本中恰有k-1个小于x，1个等于x附近，n-k个大于x。组合数n!/[(k-1)!(n-k)!]是这些样本的排列方式数。

**极值X₍ₙ₎的分布**：

P{X₍ₙ₎≤x} = P{X₁≤x, X₂≤x, ..., Xₙ≤x} = [F(x)]ⁿ

因为最大值不超过x ⟺ 每个样本都不超过x，且样本独立。

同理，最小值X₍₁₎的分布：P{X₍₁₎≤x} = 1-[1-F(x)]ⁿ

**极差R = X₍ₙ₎ - X₍₁₎**：衡量数据散布程度的另一种度量，计算简单但不如标准差稳定。在质量控制图中Cp工序能力指数的计算中常用极差。

---

**📐 经验分布函数的严格定义与性质**

**定义**：
$$F_n(x) = \\frac{1}{n}\\sum_{i=1}^n I_{\\{X_i \\leq x\\}}$$

其中I{Xᵢ≤x}是指示函数：Xᵢ≤x时为1，否则为0。

**等价定义**：Fₙ(x) = (不超过x的样本个数)/n = (样本中≤x的个数)/n

用次序统计量表示：
$$F_n(x) = \\begin{cases} 0, & x < X_{(1)} \\\\ k/n, & X_{(k)} \\leq x < X_{(k+1)}, \\quad k=1,...,n-1 \\\\ 1, & x \\geq X_{(n)} \\end{cases}$$

**性质**：
1. Fₙ(x)是非减的阶梯函数，在每个X₍ₖ₎处跳跃1/n
2. Fₙ(x)满足分布函数的四条性质（有界、单调不减、极限0和1、右连续）
3. 对固定的x，nFₙ(x)~B(n, F(x))（二项分布），由此可求Fₙ(x)的期望和方差

**统计意义**：对每个固定的x，Fₙ(x)是F(x)的无偏估计，即E[Fₙ(x)]=F(x)，且Var[Fₙ(x)]=F(x)[1-F(x)]/n→0。

---

**📐 格里文科定理（Glivenko-Cantelli）**

$$P\\{\\lim_{n \\to \\infty} \\sup_{-\\infty < x < +\\infty} |F_n(x) - F(x)| = 0\\} = 1$$

**含义**：当样本量n→∞时，经验分布函数Fₙ(x)一致收敛到总体分布函数F(x)，概率为1。

**直观理解**：你不需要知道总体的分布是什么，只要样本足够多，Fₙ(x)就会"自动"逼近F(x)。这是非参数统计的理论基石。

**收敛速度**：Kolmogorov-Smirnov统计量Dₙ=sup|Fₙ(x)-F(x)|的分布已知，可用于分布拟合检验。

**次序统计量在估计中的应用**：
- **样本中位数**M̃ = X₍₍ₙ₊₁₎/₂₎（n为奇数时），是总体中位数的估计
- **样本分位数**X₍⌈np⌉₎是总体p分位数的估计
- **箱线图**的五数概括（min, Q₁, median, Q₃, max）都基于次序统计量
- **极值理论**：X₍ₙ₎的渐近分布只有三种类型（Gumbel、Fréchet、Weibull），用于百年一遇洪水等极端事件估计

---

**⚠️ 常见误区**

**误区1**："次序统计量X₍₁₎,X₍₂₎,...,X₍ₙ₎仍然独立"
- **纠正**：排序操作引入了依赖关系。X₍ₖ₎≤X₍ₖ₊₁₎恒成立，所以它们不独立

**误区2**："Fₙ(x)就是总体的分布函数"
- **纠正**：Fₙ(x)是由样本构造的，是一个随机函数。只有当n→∞时它才收敛到F(x)`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：经验分布函数——从数据到分布的桥梁**

经验分布函数的深层意义在于：它提供了一种"免假设"的统计推断方式。

参数方法：假设总体~N(μ,σ²)→估计μ和σ²
非参数方法：用Fₙ(x)直接逼近F(x)→不做分布假设

格里文科定理保证了这种"免假设"方式的合理性：只要数据足够多，经验分布函数就会忠实地反映总体分布。这是非参数统计（符号检验、秩和检验、KS检验等）的理论基础。

从信息论角度看，Fₙ(x)保留了样本中关于F(x)的所有信息——它是F(x)的充分统计量。`,
      extension: `**🚀 Kolmogorov-Smirnov检验**

H₀：总体分布为F₀(x)（已知分布）
检验统计量：Dₙ = sup|Fₙ(x)-F₀(x)|

当Dₙ > Dₙ,α时拒绝H₀。

优点：非参数方法，对任何分布都适用
缺点：对尾部差异不够敏感（Anderson-Darling检验改进了这一点）`,
      further: [
        { id: 'f1', title: '样本中位数的分布', content: '样本中位数M̃ = X₍₍ₙ₊₁₎/₂₎（n为奇数时）\n\n当总体~N(μ,σ²)时，M̃渐近服从N(μ, πσ²/(2n))。\n\n比较：X̄~N(μ,σ²/n)，所以M̃的渐近效率为2/π≈63.9%，即中位数不如均值"高效"，但中位数对异常值更稳健。' },
        { id: 'f2', title: '分位数的经验估计', content: '总体p分位数x_p满足F(x_p)=p。\n\n经验估计：x̂_p = X₍⌈np⌉₎\n\n例如中位数(p=0.5)的估计就是样本中位数。\n箱线图的五数概括（min, Q₁, median, Q₃, max）都是次序统计量。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '求最大值的分布',
        description: `**问题**

设X₁,X₂,X₃ i.i.d. ~ U(0,1)，求max{X₁,X₂,X₃}的分布和期望。

**解**

P{X₍₃₎≤x} = [F(x)]³ = x³, 0≤x≤1

密度：f(x) = 3x², 0≤x≤1

E[X₍₃₎] = ∫₀¹x·3x²dx = 3/4 = 0.75

直观理解：3个均匀随机变量中的最大值，平均在0.75处。最大值倾向于靠近上限1。`,
        scenario: '调整样本量n，观察最大值分布的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '水文工程——百年一遇洪水估计',
        description: `**问题背景**

水利工程设计需要估计"百年一遇"的洪水水位，即年最高水位X的99%分位数x₀.₉₉。

**方法**

根据过去50年的年最高水位记录X₁,...,X₅₀，用经验分布估计：
x̂₀.₉₉ ≈ X₍₅₀₎（最大值）或X₍₄₉₎

**更精确的方法**：
假设X~GEV（广义极值分布），用X₍ₙ₎的渐近理论（极值理论），估计GEV的参数后计算分位数。

**核心思想**：次序统计量X₍ₙ₎的渐近分布只有三种类型（Gumbel、Fréchet、Weibull），这就是极值理论的Fisher-Tippett定理。`,
        scenario: '调整分位数水平，观察洪水水位估计。',
      },
    ],
    method: [
      { number: 1, title: '求次序统计量的分布', description: `①第k个次序统计量X₍ₖ₎的密度：f₍ₖ₎(x) = n!/(k-1)!(n-k)![F(x)]ᵏ⁻¹[1-F(x)]ⁿ⁻ᵏf(x)\n②特殊情形：X₍ₙ₎的CDF=[F(x)]ⁿ，X₍₁₎的CDF=1-[1-F(x)]ⁿ\n③求期望：直接积分E[X₍ₖ₎]=∫xf₍ₖ₎(x)dx` },
      { number: 2, title: '构造经验分布函数', description: `①将样本排序：x₍₁₎≤x₍₂₎≤...≤x₍ₙ₎\n②Fₙ(x) = k/n, x₍ₖ₎≤x<x₍ₖ₊₁₎\n③Fₙ(x)是右连续的阶梯函数\n④用KS统计量Dₙ=max|Fₙ(x)-F₀(x)|做拟合检验` },
    ],
  },
}

// ---- 第七章 参数估计 ----

const momentEstimationPoint: KnowledgePoint = {
  id: 'moment-estimation',
  moduleId: 'parameter-estimation',
  name: '矩估计法',
  formula: '\\hat{\\theta} = g(\\bar{X}, \\overline{X^2}, \\cdots)',
  coreSentence: '矩估计是最朴素的估计方法——"用样本矩替代总体矩"，大道至简但有时不唯一。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '(1/(sqrt(2*3.14159)*sigma))*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
          { id: 'f2', expression: '(1/(sqrt(2*3.14159)*sigma_hat))*exp(-(x-mu_hat)^2/(2*sigma_hat^2))', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'mu', y: 0, draggable: false, color: '#C62828', label: '真实μ' },
          { id: 'p2', x: 'mu_hat', y: 0, draggable: false, color: '#1565C0', label: 'μ̂' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 100, step: 5, defaultValue: 30, label: '样本量 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '矩估计过程演示',
          type: 'step',
          steps: [
            { id: 's1', description: '真实总体N(μ,σ²)', changes: { n: 30 } },
            { id: 's2', description: '第一步：用A₁=X̄替代μ₁=E(X)=μ', changes: { n: 30 } },
            { id: 's3', description: '第二步：用A₂替代μ₂=E(X²)，解出σ²', changes: { n: 30 } },
            { id: 's4', description: '矩估计完成：μ̂=X̄, σ̂²=A₂-X̄²', changes: { n: 30 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：用样本矩"替代"总体矩**

矩估计法（Method of Moments, MM）由Pearson在1894年提出，是最早的参数估计方法。其基本思想极为朴素：用样本矩作为总体矩的估计，建立方程组解出参数。

---

**📐 矩估计的基本思想**

由大数定律，样本矩Aₖ=(1/n)∑Xᵢᵏ依概率收敛到总体矩μₖ=E(Xᵏ)。因此，当n较大时，用样本矩近似总体矩是合理的。

**核心等式**：
$$\\hat{\\mu}_k = A_k, \\quad k = 1, 2, \\ldots$$

即：总体k阶矩 = 样本k阶矩

---

**📐 矩估计法的详细步骤（4步法）**

设总体分布有m个未知参数θ₁,θ₂,...,θₘ：

**步骤1**：求总体前m阶矩
$$\\mu_k = E(X^k) = g_k(\\theta_1, \\theta_2, \\ldots, \\theta_m), \\quad k=1,2,\\ldots,m$$

将总体矩用参数表示出来。注意：可以用原点矩μₖ=E(Xᵏ)，也可以用中心矩，但优先用低阶原点矩。

**步骤2**：令总体矩等于样本矩
$$g_k(\\theta_1, \\ldots, \\theta_m) = A_k, \\quad k=1,\\ldots,m$$

其中Aₖ=(1/n)∑Xᵢᵏ是样本k阶原点矩。得到m个方程m个未知数。

**步骤3**：解方程组，得到矩估计
$$\\hat{\\theta}_1, \\hat{\\theta}_2, \\ldots, \\hat{\\theta}_m$$

方程组通常关于θ₁,...,θₘ非线性，但很多常见分布可直接求解。

**步骤4**：验证结果合理性
- 检查θ̂是否落在参数空间内
- 检查是否存在不合理结果（如U(0,θ)的θ̂=2X̄可能小于X₍ₙ₎）

---

**📐 常见分布的矩估计实例**

**例1：正态总体N(μ,σ²)**

μ₁=E(X)=μ, μ₂=E(X²)=σ²+μ²

令μ₁=A₁=X̄, μ₂=A₂=(1/n)∑Xᵢ²

解得：μ̂=X̄, σ̂²=A₂-X̄²=(1/n)∑(Xᵢ-X̄)²

注意：σ̂²的分母是n而不是n-1！矩估计得到的方差估计是有偏的。

**例2：均匀分布U(a,b)**

μ₁=E(X)=(a+b)/2, μ₂=E(X²)=(b-a)²/12+(a+b)²/4

令μ₁=X̄, μ₂=A₂，解得：
â = X̄ - √(3(A₂-X̄²)), b̂ = X̄ + √(3(A₂-X̄²))

**例3：泊松分布P(λ)**

μ₁=E(X)=λ

令μ₁=X̄，解得：λ̂=X̄

只有一个参数，只需一个方程，特别简单。

**例4：指数分布Exp(λ)**

μ₁=E(X)=1/λ

令1/λ=X̄，解得：λ̂=1/X̄

**例5：二项分布B(n,p)**（n已知）

μ₁=E(X)=np

令np=X̄，解得：p̂=X̄/n

---

**📐 矩估计的不唯一性**

当总体矩的选取方式不同时，可能得到不同的矩估计。

例如：泊松分布P(λ)中，λ=E(X)=D(X)
- 用一阶矩：λ̂=X̄
- 用二阶中心矩：λ̂=Sₙ²=(1/n)∑(Xᵢ-X̄)²

两个估计都是矩估计，但结果不同！通常优先用低阶矩，因为低阶矩的方差更小，估计更稳定。

---

**📐 矩估计的优缺点**

**优点**：
1. 计算简单，不需要优化或迭代
2. 直观易懂，"用样本替代总体"的思想朴素
3. 大样本下具有相合性（由大数定律保证）
4. 不需要知道似然函数的具体形式

**缺点**：
1. 不唯一——矩的选取影响结果
2. 不一定充分——可能没有利用样本的全部信息
3. 不一定最优——不是所有情况下最有效的估计
4. 可能不合理——如U(0,θ)的θ̂=2X̄可能小于X₍ₙ₎
5. 不一定存在——方程组可能无实数解

---

**⚠️ 常见误区**

**误区1**："矩估计总是存在"
- **纠正**：方程组可能无解。例如β分布的矩估计方程可能无实数解

**误区2**："矩估计一定无偏"
- **纠正**：矩估计通常是有偏的。如正态总体σ²的矩估计σ̂²=(1/n)∑(Xᵢ-X̄)²，E[σ̂²]=(n-1)σ²/n≠σ²`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：矩估计的哲学——"替代原理"**

矩估计的哲学基础是"替代原理"：用可观测的（样本矩）替代不可观测的（总体矩）。这种思想在统计学中无处不在——频率代替概率、样本分位数代替总体分位数，都是替代原理的体现。

矩估计的优点是计算简单、直观易懂，且在大样本下具有相合性（由大数定律保证）。

其缺点也很明显：
1. 不唯一性——矩的选取影响结果
2. 不一定充分——可能没有利用样本的全部信息
3. 不一定最优——不是所有情况下最有效的估计

正是这些不足，催生了更精巧的最大似然估计。`,
      extension: `**🚀 广义矩估计（GMM）**

Hansen在1982年提出广义矩估计，将矩估计推广到过度识别的情形（方程数>参数数），通过最小化加权距离来求解：

min [m(θ)]'W[m(θ)]

其中m(θ)是样本矩与理论矩的偏差向量，W是权重矩阵。

GMM是计量经济学的核心方法，工具变量法、两阶段最小二乘法都是GMM的特例。`,
      further: [
        { id: 'f1', title: '为什么优先用低阶矩', content: '低阶矩的方差更小，估计更稳定。\n\n具体地：Var(Aₖ) = (μ₂ₖ-μₖ²)/n，k越大，μ₂ₖ增长越快（尤其对于重尾分布），导致高阶矩的方差急剧增大。\n\n因此用低阶矩得到的矩估计通常更精确。' },
        { id: 'f2', title: '矩估计的相合性', content: '由大数定律：Aₖ → μₖ (a.s.)\n\n若θ = g(μ₁,...,μₘ)，g连续，则θ̂ = g(A₁,...,Aₘ) → g(μ₁,...,μₘ) = θ (a.s.)\n\n即连续函数的矩估计是强相合的。这保证了矩估计在大样本下的合理性。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '均匀分布的矩估计',
        description: `**问题**

设X₁,...,Xₙ i.i.d. ~ U(0,θ)，θ>0未知，求θ的矩估计。

**解**

E(X) = θ/2

令θ/2 = X̄，解得θ̂ = 2X̄

**讨论**：

这个估计有个有趣的问题：如果样本最大值X₍ₙ₎>2X̄怎么办？这意味着θ̂<X₍ₙ₎，但θ不可能小于最大值。

这说明矩估计有时会给出"不合理"的结果。最大似然估计θ̂_MLE=X₍ₙ₎就没有这个问题。`,
        scenario: '调整θ，观察矩估计的效果。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '保险精算——索赔额的矩估计',
        description: `**问题**

某保险公司的索赔额X服从参数为α,β的Gamma分布：f(x)=βαxα-1e-βx/Γ(α)，x>0。

随机抽取10笔索赔记录：2.1, 3.5, 1.8, 4.2, 2.7, 3.1, 5.0, 2.4, 3.8, 1.5

**解**

E(X)=α/β, E(X²)=α(α+1)/β²

X̄ = 29.1/10 = 2.91
A₂ = (1/10)(4.41+12.25+3.24+17.64+7.29+9.61+25+5.76+14.44+2.25) = 101.89/10 = 10.189

令α/β=2.91, α(α+1)/β²=10.189

由第一个方程β=α/2.91，代入第二个：
α(α+1)/(α/2.91)² = 10.189
(α+1)·2.91²/α = 10.189
α+1 = 10.189α/8.4681 = 1.203α
0.203α=1, α≈4.93, β≈1.69`,
        scenario: '调整样本值，观察参数估计的变化。',
      },
    ],
    method: [
      { number: 1, title: '矩估计标准步骤', description: `①写出总体前m阶矩μ₁,...,μₘ（用参数表示）\n②令μₖ=Aₖ（k=1,...,m），建立方程组\n③解方程组得θ̂₁,...,θ̂ₘ\n④优先用低阶矩，m个参数只需m个方程` },
      { number: 2, title: '注意矩估计的坑', description: `①不唯一性：换一组矩可能得不同估计，优先低阶\n②有偏性：矩估计通常有偏（如σ̂²的分母是n不是n-1）\n③可能不合理：如U(0,θ)的θ̂=2X̄可能小于X₍ₙ₎\n④不一定存在：方程组可能无实数解` },
    ],
  },
}

const maximumLikelihoodPoint: KnowledgePoint = {
  id: 'maximum-likelihood',
  moduleId: 'parameter-estimation',
  name: '最大似然估计',
  formula: '\\hat{\\theta} = \\arg\\max_{\\theta} L(\\theta) = \\prod_{i=1}^n f(x_i;\\theta)',
  coreSentence: '最大似然估计的核心思想——"既然发生了，就让它最可能发生"，寻找使观测数据出现概率最大的参数值。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'exp(-0.5*((x-theta)/1)^2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '-0.5*((x-theta)/1)^2', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'theta', y: 1, draggable: false, color: '#2E7D32', label: 'θ̂_MLE' },
        ],
        sliders: [
          { id: 'theta', name: 'theta', min: -3, max: 3, step: 0.1, defaultValue: 0, label: '参数θ' },
          { id: 'n', name: 'n', min: 1, max: 20, step: 1, defaultValue: 5, label: '样本量n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '似然函数随θ变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'θ较小时，似然值低', changes: { theta: -2, n: 5 } },
            { id: 's2', description: 'θ增大，似然值升高', changes: { theta: -1, n: 5 } },
            { id: 's3', description: 'θ接近真实值，似然值最大', changes: { theta: 0, n: 5 } },
            { id: 's4', description: 'θ继续增大，似然值下降', changes: { theta: 1, n: 5 } },
            { id: 's5', description: '样本量增大，似然函数更尖锐', changes: { theta: 0, n: 20 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：让已发生的事"最可能"发生**

最大似然估计（Maximum Likelihood Estimation, MLE）是Fisher在1922年提出的，是现代统计学最重要的参数估计方法。

其哲学基础：**既然样本x₁,...,xₙ已经观测到了，那么参数θ的"最佳猜测"应该使得这个样本出现的概率最大。**

这就像侦探破案：既然案发现场留下了这些线索（样本），那么最可能的情况（参数值）是什么？

---

**📐 似然函数的构造方法**

设总体X的概率密度（或分布律）为f(x;θ)，θ∈Θ。

**似然函数**：
$$L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$$

构造方法：将每个观测值xᵢ代入密度函数f(x;θ)中，将所有结果相乘。

**对数似然函数**：
$$\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$$

**对数似然的优势**：
1. 乘法变加法，大大简化计算（尤其乘积中有指数函数时）
2. 避免多个小数相乘导致的数值下溢
3. 求导更方便（和的导数=导数之和）
4. 最大化L(θ)等价于最大化lnL(θ)（ln单调递增）

**关键理解**：
- 似然函数L(θ)是θ的函数（x₁,...,xₙ已固定）
- 密度函数f(x;θ)是x的函数（θ已固定）
- 同一个数学表达式，不同视角！

---

**📐 最大似然估计原理**

$$\\hat{\\theta}_{MLE} = \\arg\\max_{\\theta \\in \\Theta} L(\\theta)$$

等价地：最大化ln L(θ)（因为ln是单调递增函数）

---

**📐 求MLE的详细步骤**

**步骤1：构造似然函数**
$$L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$$

注意定义域约束！如U(0,θ)中θ必须大于所有xᵢ。

**步骤2：取对数**
$$\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$$

**步骤3：对θ求导，令导数为0**
$$\\frac{\\partial \\ln L(\\theta)}{\\partial \\theta} = 0$$

多参数时对各参数分别求偏导，建立方程组。

**步骤4：解方程，得θ̂_MLE**

**步骤5（验证）：检查二阶导数<0，确认是最大值**

---

**📐 常见分布的MLE实例**

**例1：正态总体N(μ,σ²)**

L(μ,σ²) = ∏(1/√(2πσ²))exp(-(xᵢ-μ)²/(2σ²))
= (2πσ²)^(-n/2) exp(-∑(xᵢ-μ)²/(2σ²))

ln L = -n/2·ln(2π) - n/2·ln(σ²) - ∑(xᵢ-μ)²/(2σ²)

对μ求导：∂lnL/∂μ = ∑(xᵢ-μ)/σ² = 0 → μ̂=X̄
对σ²求导：∂lnL/∂σ² = -n/(2σ²) + ∑(xᵢ-μ)²/(2σ⁴) = 0 → σ̂²=(1/n)∑(xᵢ-X̄)²

**例2：均匀分布U(0,θ)**

f(x;θ)=1/θ, 0<x<θ

L(θ) = (1/θ)ⁿ，但要求0<xᵢ<θ对所有i成立，即θ>max(x₁,...,xₙ)

L(θ)=(1/θ)ⁿ在θ>max{xᵢ}上递减，因此θ̂=max{xᵢ}=X₍ₙ₎

**此例不可用求导法！**因为似然函数在边界取最大值。

**例3：指数分布Exp(λ)**

L(λ)=λⁿexp(-λ∑xᵢ), lnL=nlnλ-λ∑xᵢ

d(lnL)/dλ=n/λ-∑xᵢ=0 → λ̂=n/∑xᵢ=1/X̄

**例4：泊松分布P(λ)**

L(λ)=∏(λ^xᵢ·e^(-λ)/xᵢ!), lnL=∑xᵢlnλ-nλ-∑ln(xᵢ!)

d(lnL)/dλ=∑xᵢ/λ-n=0 → λ̂=X̄

---

**📐 不可导时的处理（边界点）**

当似然函数不可导或在边界取最值时：
1. 画出L(θ)的图像，观察最值位置
2. 利用单调性判断（如U(0,θ)中L(θ)=(1/θ)ⁿ递减）
3. 常见于均匀分布、截断分布等有界支撑集的分布
4. 边界处MLE通常是次序统计量（如X₍ₙ₎）

---

**📐 MLE的性质**

**不变性**：若θ̂是θ的MLE，则g(θ̂)是g(θ)的MLE。例如μ̂=X̄是μ的MLE，则e^μ̂=e^(X̄)是e^μ的MLE。

**渐近正态性**：在正则条件下，当n→∞时：
$$\\sqrt{n}(\\hat{\\theta}_{MLE} - \\theta) \\xrightarrow{d} N(0, I^{-1}(\\theta))$$

其中I(θ)是Fisher信息量。这意味着MLE的渐近方差达到了Cramér-Rao下界——MLE是渐近有效的。

**相合性**：θ̂_MLE → θ（依概率），即大样本下MLE收敛到真实参数。

---

**⚠️ 常见误区**

**误区1**："MLE一定通过求导得到"
- **纠正**：均匀分布U(0,θ)的MLE=X₍ₙ₎是在边界取得，无法通过求导得到

**误区2**："MLE一定无偏"
- **纠正**：正态总体σ²的MLE=(1/n)∑(Xᵢ-X̄)²是有偏的；U(0,θ)的MLE=X₍ₙ₎也是biased，E[X₍ₙ₎]=nθ/(n+1)≠θ`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：最大似然的深层哲学**

最大似然估计的哲学基础是**似然原理**：在给定观测数据后，关于θ的全部信息都包含在似然函数L(θ)中。

MLE具有一系列优良的大样本性质：
1. **相合性**：θ̂_MLE → θ (a.s.)
2. **渐近正态性**：√n(θ̂_MLE-θ) → N(0, I⁻¹(θ))
3. **渐近有效性**：渐近方差达到Cramér-Rao下界
4. **不变性**：若θ̂是θ的MLE，则g(θ̂)是g(θ)的MLE

其中I(θ)是Fisher信息量：I(θ) = -E[∂²lnf(X;θ)/∂θ²]

Fisher信息量度量了样本中关于θ的"信息含量"，而MLE的渐近方差1/(nI(θ))是所有正规估计中可能达到的最小值——这就是MLE"最大似然"的真正含义：它最大限度地利用了样本中的信息。`,
      extension: `**🚀 EM算法——当MLE没有解析解时**

对于不完全数据（含隐变量、缺失数据），MLE可能没有解析解。Dempster等人在1977年提出EM算法：

E步：计算Q(θ|θ⁽ᵗ⁾) = E[ln L_c(θ)|x_obs, θ⁽ᵗ⁾]（期望）
M步：θ⁽ᵗ⁺¹⁾ = argmax Q(θ|θ⁽ᵗ⁾)（最大化）

迭代至收敛，保证似然函数单调递增。

应用：高斯混合模型、隐马尔可夫模型、缺失数据处理。`,
      further: [
        { id: 'f1', title: 'Fisher信息量与Cramér-Rao下界', content: 'Fisher信息量：I(θ) = -E[∂²lnf(X;θ)/∂θ²]\n\nCramér-Rao不等式：在正规条件下，任何无偏估计θ̂的方差满足：\nVar(θ̂) ≥ 1/(nI(θ))\n\n1/(nI(θ))称为Cramér-Rao下界(CRLB)，是所有无偏估计的方差下限。\n\nMLE的渐近方差恰好等于CRLB，因此MLE是渐近有效的。' },
        { id: 'f2', title: 'MLE的不变性', content: '若θ̂是θ的MLE，则对任意函数g，g(θ̂)是g(θ)的MLE。\n\n例如：正态总体μ的MLE=X̄，则e^μ的MLE=e^(X̄)。\n\n注意：不变性不适用于无偏性！g(E[θ̂])≠E[g(θ̂)]（Jensen不等式）。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '指数分布的MLE',
        description: `**问题**

设X₁,...,Xₙ i.i.d. ~ Exp(λ)，f(x;λ)=λe^(-λx), x>0，求λ的MLE。

**解**

L(λ) = λⁿ exp(-λ∑xᵢ)

ln L = n ln λ - λ∑xᵢ

d(lnL)/dλ = n/λ - ∑xᵢ = 0

解得：λ̂ = n/∑xᵢ = 1/X̄

验证：d²(lnL)/dλ² = -n/λ² < 0 ✓

**含义**：指数分布参数λ的MLE是样本均值的倒数。λ是"速率参数"，X̄是平均等待时间，两者互为倒数，直觉合理。`,
        scenario: '调整样本值，观察λ的MLE变化。',
      },
      {
        id: 'app2',
        type: 'research',
        title: '逻辑回归——MLE在机器学习中的应用',
        description: `**问题背景**

逻辑回归是分类问题的基础模型：P(Y=1|X=x) = 1/(1+e^(-xβ))

**似然函数**

L(β) = ∏[σ(xᵢβ)]ʸⁱ[1-σ(xᵢβ)]^(1-yᵢ)

其中σ(z)=1/(1+e^(-z))

**对数似然**

ln L(β) = ∑[yᵢlnσ(xᵢβ) + (1-yᵢ)ln(1-σ(xᵢβ))]

**求解**

对β求导，令为0——没有解析解！需用迭代法（梯度上升、Newton-Raphson等）。

这就是为什么逻辑回归的"训练"本质上就是在做MLE。深度学习的交叉熵损失，也是对数似然的负数。`,
        scenario: '调整参数，观察似然函数形状。',
      },
    ],
    method: [
      { number: 1, title: 'MLE标准四步法', description: `①构造似然函数L(θ)=∏f(xᵢ;θ)\n②取对数lnL(θ)=∑lnf(xᵢ;θ)\n③对θ求导令为0（多参数求偏导）\n④解方程得θ̂，验证二阶导<0` },
      { number: 2, title: '不可导时的MLE', description: `①画出L(θ)的图像\n②利用单调性判断最值\n③最值常在边界（如U(0,θ)的θ̂=X₍ₙ₎）\n④注意参数的取值范围对L(θ)的约束` },
    ],
  },
}

const estimatorCriteriaPoint: KnowledgePoint = {
  id: 'estimator-criteria',
  moduleId: 'parameter-estimation',
  name: '估计量的评价标准',
  formula: 'E(\\hat{\\theta}) = \\theta \\quad (\\text{无偏性})',
  coreSentence: '好估计量要过三关——无偏性（不偏不倚）、有效性（方差最小）、一致性（大样本下收敛），样本方差除以n-1就是为了满足无偏性。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*0.5)*exp(-(x-0)^2/(2*0.25))', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159)*1)*exp(-(x-0)^2/2)', color: '#1565C0', visible: true },
          { id: 'f3', expression: '1/(sqrt(2*3.14159)*0.3)*exp(-(x-0.3)^2/(2*0.09))', color: '#2E7D32', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#5D4037', label: 'θ' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 200, step: 5, defaultValue: 30, label: '样本量 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '三种标准的对比',
          type: 'step',
          steps: [
            { id: 's1', description: '无偏：期望在θ处，但可能很分散', changes: { n: 30 } },
            { id: 's2', description: '有效：两个无偏估计中，方差小的更有效', changes: { n: 30 } },
            { id: 's3', description: '有偏但可能更好：偏差小+方差小→MSE更小', changes: { n: 30 } },
            { id: 's4', description: '一致：n→∞时θ̂→θ', changes: { n: 200 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：怎样才算一个"好"估计？**

同一个参数可以有多种估计方法（矩估计、MLE等），我们需要评价标准来判断哪个更好。三大标准——无偏性、有效性、一致性——从不同角度刻画了估计量的"好坏"。

---

**📐 无偏性**

**定义**：若E(θ̂) = θ，则称θ̂是θ的**无偏估计**。

偏差：Bias(θ̂) = E(θ̂) - θ

- 无偏 ⟺ Bias = 0
- 正偏差 ⟹ 平均高估
- 负偏差 ⟹ 平均低估

**核心意义**：无偏性保证了"长期平均"来看，估计值既不偏高也不偏低。

**验证方法**：求θ̂的期望E[θ̂]，看是否等于θ。常用技巧：E[∑Xᵢ]=nE[X], E[X̄]=E[X]。

**经典问题：样本方差为什么除以n-1？**

S² = (1/(n-1))∑(Xᵢ-X̄)²

**推导**：关键在于用X̄代替μ时引入了相关性。直观推导：
∑(Xᵢ-X̄)² = ∑[(Xᵢ-μ)-(X̄-μ)]² = ∑(Xᵢ-μ)² - n(X̄-μ)²

E[∑(Xᵢ-μ)²] = nσ²
E[n(X̄-μ)²] = n·σ²/n = σ²

所以E[∑(Xᵢ-X̄)²] = nσ²-σ² = (n-1)σ²

因此E[S²] = (n-1)σ²/(n-1) = σ² ✓

若除以n：E[(1/n)∑(Xᵢ-X̄)²] = (n-1)σ²/n < σ²（有偏，偏小！）

**切比雪夫不等式视角**：P{|X̄-μ|≥ε} ≤ σ²/(nε²)，当n→∞时右边→0，说明X̄依概率收敛到μ。

---

**📐 有效性**

**定义**：设θ̂₁和θ̂₂都是θ的无偏估计，若Var(θ̂₁) < Var(θ̂₂)，则称θ̂₁比θ̂₂**更有效**。

**最小方差无偏估计（MVUE）**：在所有无偏估计中方差最小的那个。MVUE是最优的无偏估计，如果存在的话。

**例**：估计μ时，X̄和中位数M̃都是无偏的（正态总体下），但Var(X̄)=σ²/n < πσ²/(2n)=Var(M̃)，所以X̄更有效。X̄的渐近效率是中位数的π/2≈1.57倍。

---

**📐 均方误差（MSE）**

当两个估计一个有偏一个无偏时，如何比较？

$$MSE(\\hat{\\theta}) = E[(\\hat{\\theta}-\\theta)^2] = Var(\\hat{\\theta}) + [Bias(\\hat{\\theta})]^2$$

MSE = 方差 + 偏差²

**意义**：MSE综合衡量了估计的"精度"和"准确度"。有时一个略有偏差但方差很小的估计，MSE反而比无偏估计更小。

**例子**：正态总体σ²的估计
- S²（无偏）：MSE = 2σ⁴/(n-1)
- (1/n)∑(Xᵢ-X̄)²（MLE，有偏）：MSE = (2n-1)σ⁴/n² < 2σ⁴/(n-1)

MLE的MSE更小！这就是"偏差-方差权衡"——有偏估计可能整体更优。

---

**📐 一致性（相合性）**

**定义**：若θ̂ₙ →θ（依概率），即对任意ε>0：
$$\\lim_{n \\to \\infty} P\\{|\\hat{\\theta}_n - \\theta| > \\varepsilon\\} = 0$$

则称θ̂ₙ是θ的**相合估计**（一致估计）。

**充分条件**：若θ̂ₙ满足lim E(θ̂ₙ)=θ且lim Var(θ̂ₙ)=0，则θ̂ₙ是相合估计。

**验证方法**：用切比雪夫不等式：P{|θ̂ₙ-θ|>ε} ≤ Var(θ̂ₙ)/ε²。若Var(θ̂ₙ)→0，则θ̂ₙ是相合的。

**例**：X̄是μ的相合估计：
E(X̄)=μ, Var(X̄)=σ²/n→0
由切比雪夫不等式：P{|X̄-μ|>ε} ≤ σ²/(nε²)→0

**核心意义**：一致性保证了当数据量足够大时，估计值会"收敛"到真实值。这是最基本的要求——一个连一致性都不满足的估计量是毫无意义的。

---

**⚠️ 常见误区**

**误区1**："无偏估计一定比有偏估计好"
- **纠正**：有偏估计可能MSE更小（偏差-方差权衡）。例如正态σ²的MLE

**误区2**："无偏估计总是存在"
- **纠正**：有些参数不存在无偏估计。例如X~P(λ)时，1/λ没有无偏估计`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：偏差-方差权衡——统计学的核心矛盾**

MSE = 方差 + 偏差² 揭示了统计学的核心矛盾：

**偏差-方差权衡**：降低偏差通常增大方差，反之亦然。

这不仅是参数估计的问题，而是整个统计学习的核心：
- 简单模型：偏差大、方差小（欠拟合）
- 复杂模型：偏差小、方差大（过拟合）
- 最优模型：在偏差和方差之间取得平衡

在正则化（Ridge、Lasso）中，我们有意引入偏差来换取方差的降低，从而获得更小的MSE。这正是现代机器学习的核心思想。`,
      extension: `**🚀 Cramér-Rao下界与UMVUE**

Cramér-Rao不等式：在正规条件下，任何无偏估计θ̂满足：
Var(θ̂) ≥ 1/(nI(θ))

达到下界的无偏估计就是UMVUE（一致最小方差无偏估计）。

寻找UMVUE的方法：
1. Lehmann-Scheffé定理：基于充分完备统计量的无偏估计是UMVUE
2. Rao-Blackwell定理：对任何无偏估计，关于充分统计量取条件期望可改善（方差减小）`,
      further: [
        { id: 'f1', title: '为什么不存在1/λ的无偏估计', content: '设X~P(λ)，要估计1/λ。\n\n假设存在无偏估计g(X)，则：\nE[g(X)] = ∑g(k)λᵏe^(-λ)/k! = 1/λ\n\n左边是e^(-λ)乘以一个幂级数，在λ=0附近解析；右边1/λ在λ=0处发散。矛盾！\n\n所以1/λ不存在无偏估计。类似地，1/μ在正态总体中也不存在无偏估计。' },
        { id: 'f2', title: 'Stein现象', content: 'Stein在1956年证明了一个惊人结果：\n\n当维数p≥3时，正态均值向量μ的MLE X̄不是可容许的——存在更好的估计（James-Stein估计）！\n\nJames-Stein估计：μ̂_JS = (1-(p-2)/(n||X̄||²))X̄\n\n它在μ的所有值上都有更小的MSE，这意味着"同时估计多个均值"时，MLE不是最优的——收缩(shrinkage)总比不收缩好！' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '比较两个估计的有效性',
        description: `**问题**

设X₁,...,Xₙ i.i.d. ~ N(μ,σ²)，比较μ̂₁=X̄和μ̂₂=(X₁+X₂)/2的有效性。

**解**

两者都是无偏的：
E[X̄]=μ, E[(X₁+X₂)/2]=μ

比较方差：
Var(X̄) = σ²/n
Var((X₁+X₂)/2) = σ²/2

当n>2时，σ²/n < σ²/2，X̄更有效。
当n=2时，两者方差相等。

**结论**：X̄利用了全部n个样本的信息，而(X₁+X₂)/2只用了2个，浪费了信息，所以X̄更有效。`,
        scenario: '调整n，观察两个估计的方差比较。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '投资组合风险估计——偏差-方差权衡',
        description: `**问题背景**

估计投资组合的方差σ²（风险度量），有三种估计：
1. 样本方差S²（无偏）
2. MLE σ̂²（有偏，偏小）
3. 收缩估计σ̂²_shrink = αS² + (1-α)σ₀²（向先验σ₀²收缩）

**分析**

在样本量较小时，S²方差很大，导致风险估计不稳定。收缩估计引入少量偏差，但大幅降低方差，整体MSE更小。

这是Ledoit-Wolf收缩估计的核心思想，在量化金融中被广泛使用——华尔街更关心MSE而非无偏性。`,
        scenario: '调整收缩系数α，观察MSE变化。',
      },
    ],
    method: [
      { number: 1, title: '判断无偏性', description: `①求θ̂的期望E[θ̂]\n②看E[θ̂]是否等于θ\n③常用技巧：E[∑Xᵢ]=nE[X], E[X̄]=E[X]\n④注意：E[g(θ̂)]≠g(E[θ̂])（Jensen不等式）` },
      { number: 2, title: '比较估计量的优劣', description: `①都是无偏→比较方差（有效性）\n②一个有偏一个无偏→比较MSE = Var + Bias²\n③看大样本性质→一致性（E→θ且Var→0）\n④寻找UMVUE→用Lehmann-Scheffé定理` },
    ],
  },
}

const intervalEstimationPoint: KnowledgePoint = {
  id: 'interval-estimation',
  moduleId: 'parameter-estimation',
  name: '区间估计',
  formula: 'P\\{\\underline{\\theta} < \\theta < \\overline{\\theta}\\} = 1-\\alpha',
  coreSentence: '点估计给一个数，区间估计给一个范围——置信水平1-α不是"θ在区间内的概率"，而是"这种方法100次中约95次能套住θ"。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: -1.96, y: 0, draggable: false, color: '#1565C0', label: '-z₀.₀₂₅' },
          { id: 'p2', x: 1.96, y: 0, draggable: false, color: '#1565C0', label: 'z₀.₀₂₅' },
          { id: 'p3', x: 0, y: 0.399, draggable: false, color: '#2E7D32', label: '置信区间中心' },
        ],
        sliders: [
          { id: 'confidence', name: 'confidence', min: 0.8, max: 0.99, step: 0.01, defaultValue: 0.95, label: '置信水平' },
          { id: 'n', name: 'n', min: 5, max: 50, step: 1, defaultValue: 25, label: '样本量 n' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '置信区间的含义',
          type: 'step',
          steps: [
            { id: 's1', description: '总体X~N(μ,σ²)，σ已知', changes: { confidence: 0.95, n: 25 } },
            { id: 's2', description: 'X̄~N(μ,σ²/n)，取枢轴量U=(X̄-μ)/(σ/√n)~N(0,1)', changes: { confidence: 0.95, n: 25 } },
            { id: 's3', description: 'P{|U|≤z₀.₀₂₅}=0.95，解出μ的95%置信区间', changes: { confidence: 0.95, n: 25 } },
            { id: 's4', description: '置信水平升高→区间变宽', changes: { confidence: 0.99, n: 25 } },
            { id: 's5', description: 'n增大→区间变窄（更精确）', changes: { confidence: 0.95, n: 50 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：用区间代替点，量化不确定性**

点估计θ̂给出一个数值，但没有告诉我们这个估计有多可靠。区间估计用[θ̲,θ̄]给出一个范围，并告诉我们这个范围包含真实参数的概率——这就是置信水平1-α。

---

**📐 置信区间与置信水平详解**

设θ是总体参数，若统计量θ̲和θ̄满足：
$$P\\{\\underline{\\theta} < \\theta < \\overline{\\theta}\\} = 1-\\alpha$$

则称[θ̲,θ̄]为θ的**置信水平为1-α的置信区间**。

**正确理解**：
- 1-α不是"θ落在[θ̲,θ̄]内的概率"
- 而是"反复抽样100次，约(1-α)×100次的区间会包含θ"
- θ是固定的（非随机的），随机的是区间[θ̲,θ̄]！

**比喻**：置信区间像渔网，θ是鱼。每次撒网（抽样）得到一个网的位置（区间），鱼的位置是固定的。95%的置信水平意味着：如果撒100次网，约95次能网住鱼。

**置信水平1-α的选取**：
- 常用值：0.90, 0.95, 0.99
- α=0.05（95%置信）是最常用的
- 置信水平越高→区间越宽→精度越低，需要权衡

---

**📐 枢轴量法三步法**

**枢轴量**：含待估参数θ但不包含其他未知参数的函数G(X₁,...,Xₙ;θ)，且G的分布已知（不依赖θ）。

**构造置信区间的步骤**：
1. **找枢轴量**G(X₁,...,Xₙ;θ)，其分布已知
2. **定概率**：对给定的1-α，找a,b使得P{a≤G≤b}=1-α（通常取两侧各α/2）
3. **解不等式**：从a≤G≤b中解出θ̲<θ<θ̄

**关键**：枢轴量是连接统计量和参数的"桥梁"——它包含参数θ，但分布已知，因此可以反解出θ的范围。

---

**📐 单正态总体N(μ,σ²)的置信区间**

**①σ²已知时，μ的置信区间**

枢轴量：U=(X̄-μ)/(σ/√n)~N(0,1)

P{|U|≤zα/2}=1-α ⟹ μ的1-α置信区间：

$$\\bar{X} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}$$

区间长度：L = 2zα/2·σ/√n，与1/√n成正比。

**②σ²未知时，μ的置信区间**

枢轴量：T=(X̄-μ)/(S/√n)~t(n-1)

P{|T|≤tα/2(n-1)}=1-α ⟹ μ的1-α置信区间：

$$\\bar{X} \\pm t_{\\alpha/2}(n-1) \\cdot \\frac{S}{\\sqrt{n}}$$

注意：tα/2(n-1)>zα/2，所以σ未知时区间更宽——不确定性的代价。

**③σ²的置信区间**

枢轴量：(n-1)S²/σ²~χ²(n-1)

P{χ²₁-α/2≤(n-1)S²/σ²≤χ²α/2}=1-α ⟹

$$\\left[\\frac{(n-1)S^2}{\\chi^2_{\\alpha/2}(n-1)}, \\quad \\frac{(n-1)S^2}{\\chi^2_{1-\\alpha/2}(n-1)}\\right]$$

注意：σ²的置信区间不是对称的！因为χ²分布不对称。

---

**📐 大样本近似置信区间**

当总体非正态但n足够大时，由中心极限定理：
(X̄-μ)/(S/√n) → N(0,1)

μ的近似1-α置信区间：X̄ ± zα/2·S/√n

**比例p的置信区间**（大样本）：p̂ ± zα/2·√(p̂(1-p̂)/n)

经验法则：n≥30可用大样本近似，但总体严重偏态时需更大n。

---

**📐 置信区间长度与样本量的关系**

σ²已知时μ的置信区间长度L = 2zα/2·σ/√n。

**要求区间长度≤d时所需样本量**：
$$n \\geq \\left(\\frac{2z_{\\alpha/2} \\sigma}{d}\\right)^2$$

例：σ=5, α=0.05, 要求L≤2：n ≥ (2×1.96×5/2)² = 96.04，取n=97。

**意义**：精度要求提高一倍（d减半），样本量需增大四倍——精度的代价是样本量的平方级增长。

---

**📐 双正态总体的置信区间**

**均值差μ₁-μ₂（σ₁²=σ₂²=σ²未知时）**：

$$(\\bar{X}_1-\\bar{X}_2) \\pm t_{\\alpha/2}(n_1+n_2-2) \\cdot S_w\\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}$$

**方差比σ₁²/σ₂²**：

$$\\left[\\frac{S_1^2}{S_2^2} \\cdot \\frac{1}{F_{\\alpha/2}(n_1-1,n_2-1)}, \\quad \\frac{S_1^2}{S_2^2} \\cdot F_{\\alpha/2}(n_2-1,n_1-1)\\right]$$

---

**⚠️ 常见误区**

**误区1**："95%置信区间意味着θ有95%的概率在此区间内"
- **纠正**：θ是固定常数，不是随机变量。随机的是区间的端点。"95%置信"指的是方法论的可靠性，不是单次结果的概率

**误区2**："置信水平越高越好"
- **纠正**：置信水平越高→区间越宽→精度越低。需要在置信水平和区间宽度之间权衡`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：置信区间的频率解释 vs 贝叶斯解释**

频率学派的置信区间有一个令人不安的问题：它不能对"某次具体的区间是否包含θ"给出概率陈述。一个95%置信区间要么包含θ（概率1），要么不包含（概率0），"95%"是方法论层面的保证。

贝叶斯学派用**可信区间**（credible interval）解决了这个问题：给定先验π(θ)和数据x后，P(θ∈[a,b]|x)=1-α可以直接计算。这是对参数本身的概率陈述。

两种解释反映了统计学最根本的哲学分歧：参数是固定的（频率派）还是随机的（贝叶斯派）？在实践中，当先验信息充分时，贝叶斯方法通常更优；当先验模糊时，频率方法更稳健。`,
      extension: `**🚀 样本量的确定**

在实际应用中，常需要根据精度要求反推样本量n。

例如：σ²已知时，要求μ的1-α置信区间宽度≤d：
2zα/2σ/√n ≤ d ⟹ n ≥ (2zα/2σ/d)²

例：σ=5, α=0.05, 要求宽度≤2：
n ≥ (2×1.96×5/2)² = 96.04，取n=97`,
      further: [
        { id: 'f1', title: '单侧置信区间', content: '有时只关心参数的上界或下界：\n\nμ的单侧置信下限：P{μ≥μ̲}=1-α\nμ̲ = X̄ - zα·σ/√n\n\n应用场景：产品寿命的置信下限、有害物质含量的置信上限等。' },
        { id: 'f2', title: '大样本置信区间', content: '当总体非正态但n足够大时，由中心极限定理：\n(X̄-μ)/(S/√n) → N(0,1)\n\n因此μ的近似1-α置信区间：\nX̄ ± zα/2·S/√n\n\n"n多大才够？"经验法则：n≥30，但若总体严重偏态，需要更大的n。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '正态总体均值的置信区间',
        description: `**问题**

从某批零件中抽取16件，测得长度均值X̄=10.2cm，S=0.4cm。求总体均值μ的95%置信区间。

**解**

σ未知，用t分布：
n=16, α=0.05, t₀.₀₂₅(15)=2.131

μ的95%置信区间：
X̄ ± t₀.₀₂₅(15)·S/√n
= 10.2 ± 2.131×0.4/4
= 10.2 ± 0.213
= [9.987, 10.413]

我们有95%的信心认为μ在9.987~10.413之间。`,
        scenario: '调整α和n，观察置信区间的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '民意调查中的置信区间',
        description: `**问题**

某民意调查随机调查1000人，支持率为52%。求总体支持率的95%置信区间。

**解**

这是比例p的置信区间。n=1000, p̂=0.52

大样本下，p̂近似N(p, p(1-p)/n)

p的95%置信区间：
p̂ ± z₀.₀₂₅·√(p̂(1-p̂)/n)
= 0.52 ± 1.96×√(0.52×0.48/1000)
= 0.52 ± 1.96×0.0158
= 0.52 ± 0.031
= [0.489, 0.551]

支持率在48.9%~55.1%之间，无法断言过半数支持！这就是为什么民调总说"误差范围±3%"。`,
        scenario: '调整样本量和比例，观察置信区间宽度。',
      },
    ],
    method: [
      { number: 1, title: '枢轴量法三步走', description: `①找枢轴量G(X;θ)：含θ、分布已知、不含其他未知参数\n②对1-α，找a,b使P{a≤G≤b}=1-α（通常取两侧各α/2）\n③从不等式a≤G≤b解出θ̲<θ<θ̄` },
      { number: 2, title: '正态总体置信区间速查', description: `①μ（σ²已知）：X̄ ± zα/2·σ/√n\n②μ（σ²未知）：X̄ ± tα/2(n-1)·S/√n\n③σ²：[(n-1)S²/χ²α/2, (n-1)S²/χ²₁-α/2]\n④μ₁-μ₂：差值±tα/2·Sw√(1/n₁+1/n₂)\n⑤σ₁²/σ₂²：用F分布` },
    ],
  },
}

// ---- 第八章 假设检验 ----

const hypothesisTestingBasicsPoint: KnowledgePoint = {
  id: 'hypothesis-testing-basics',
  moduleId: 'hypothesis-testing',
  name: '假设检验的基本思想与两类错误',
  formula: 'H_0: \\mu = \\mu_0 \\quad vs \\quad H_1: \\mu \\neq \\mu_0',
  coreSentence: '假设检验是"反证法+小概率原理"——假设H₀成立，若观测到小概率事件，则拒绝H₀；但"不拒绝"不等于"接受"。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159))*exp(-(x-2)^2/2)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 1.645, y: 0, draggable: false, color: '#FF6F00', label: '拒绝域边界' },
        ],
        sliders: [
          { id: 'alpha', name: 'alpha', min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05, label: '显著性水平 α' },
          { id: 'mu0', name: 'mu0', min: -1, max: 3, step: 0.1, defaultValue: 0, label: 'H₀: μ=μ₀' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '两类错误的含义',
          type: 'step',
          steps: [
            { id: 's1', description: 'H₀成立（红色分布），统计量落入拒绝域→弃真（第Ⅰ类错误）', changes: { alpha: 0.05, mu0: 0 } },
            { id: 's2', description: 'H₀不成立（蓝色分布），统计量未落入拒绝域→取伪（第Ⅱ类错误）', changes: { alpha: 0.05, mu0: 0 } },
            { id: 's3', description: 'α增大→拒绝域变大→弃真增加但取伪减少', changes: { alpha: 0.1, mu0: 0 } },
            { id: 's4', description: '改变μ₀→影响检验的假设值', changes: { alpha: 0.05, mu0: 1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：小概率原理+反证法**

假设检验的逻辑与法庭审判类似：
- H₀（原假设）= "被告无罪"——默认成立，除非有充分证据
- H₁（备择假设）= "被告有罪"——需要证据支持
- 小概率事件 = "有罪的证据"
- 拒绝H₀ = "判定有罪"

**核心逻辑**：假设H₀成立，在此假设下推导统计量的分布。若观测到的统计量取值落在"小概率区域"（拒绝域），则"H₀成立"这个假设就值得怀疑——这就是**小概率原理**。

---

**📐 原假设与备择假设**

**原假设H₀**：想要"否定"或"拒绝"的假设，通常表示"没有效应""没有差异"。
**备择假设H₁**：想要"支持"或"证实"的假设，通常表示"有效应""有差异"。

| 检验类型 | H₀ | H₁ |
|---------|-----|-----|
| 双侧检验 | μ=μ₀ | μ≠μ₀ |
| 左侧检验 | μ≥μ₀ | μ<μ₀ |
| 右侧检验 | μ≤μ₀ | μ>μ₀ |

**如何选择H₀和H₁**：
- H₀是"受保护"的假设，没有强有力证据不能拒绝
- 常把"没有变化""没有效果""符合标准"放在H₀
- 把"有变化""有效果""不合格"放在H₁

---

**📐 两类错误的定义与关系**

| | H₀为真 | H₀为假 |
|---|--------|--------|
| 拒绝H₀ | **第Ⅰ类错误（弃真）** | 正确决策（功效） |
| 不拒绝H₀ | 正确决策 | **第Ⅱ类错误（取伪）** |

**第Ⅰ类错误（弃真）**：H₀为真时错误地拒绝H₀
概率：P{拒绝H₀|H₀为真} = α（显著性水平）

**第Ⅱ类错误（取伪）**：H₀为假时错误地不拒绝H₀
概率：P{不拒绝H₀|H₀为假} = β

**功效函数**：1-β = P{拒绝H₀|H₀为假}（正确拒绝H₀的概率）。功效越大，检验区分H₀和H₁的能力越强。

**两类错误的关系——α和β不能同时减小**：
- 在固定样本量下，减小α（更难拒绝H₀）必然增大β（更难检测到H₁为真）
- 直观理解：拒绝域变小→弃真减少，但取伪增加
- **只有在增大样本量n时，才能同时减小α和β**
- 这是假设检验的根本限制，类似于估计中的偏差-方差权衡

---

**📐 显著性水平的选取原则**

α是研究者事先设定的"小概率"标准，通常取0.05、0.01或0.10。

α=0.05意味着：即使H₀为真，也有5%的概率被错误拒绝（冤枉好人）。

选择α的原则：
- 后果严重时（如药物安全检验），α应小（如0.01）——宁可放过好药，不可让无效药上市
- 探索性研究时，α可稍大（如0.10）——宁可多些假阳性，不可遗漏潜在发现
- α的选取必须在看到数据之前确定，不能根据数据调整α

---

**📐 单侧与双侧检验的选择**

**双侧检验**H₀:μ=μ₀ vs H₁:μ≠μ₀：
- 关心μ是否"偏离"μ₀，方向不明确
- 拒绝域在两侧，各占α/2
- 例：零件直径是否等于标准值

**单侧检验**H₀:μ≤μ₀ vs H₁:μ>μ₀（右侧）：
- 只关心μ是否"大于"μ₀，方向明确
- 拒绝域在一侧，占全部α
- 例：新药是否比旧药好

**重要**：选择单侧还是双侧应在看到数据之前决定！看到数据后选择会增大第Ⅰ类错误的实际概率。

---

**📐 P值概念**

**P值**：在H₀为真的条件下，观测到当前或更极端结果的概率。

P值 = P{统计量取值≥观测值|H₀}（右侧检验时）

**决策规则**：P值≤α → 拒绝H₀

P值的优势：
- 不仅告诉我们是否拒绝H₀，还量化了拒绝的"信心程度"
- P=0.001比P=0.049（都在α=0.05下拒绝）提供了更强的否定H₀的证据
- P值越小，否定H₀的证据越强

**注意**：P值不是H₀为真的概率！P值≠P(H₀为真)。

---

**📐 假设检验的五步流程**

1. **建立假设**H₀和H₁（根据问题确定双侧/单侧）
2. **选择检验统计量**，确定其在H₀下的分布（关键是找到合适的枢轴量）
3. **给定显著性水平α**（通常0.05）
4. **确定拒绝域**（查表求临界值，使P{统计量∈拒绝域|H₀}=α）
5. **计算与判断**：由样本算统计量观测值，落入拒绝域→拒绝H₀；否则不拒绝H₀

也可用P值法替代步骤4-5：计算P值，P值≤α则拒绝H₀。

---

**⚠️ 常见误区**

**误区1**："不拒绝H₀"="接受H₀"
- **纠正**：不拒绝H₀只说明证据不足，不代表H₀为真。就像"证据不足，无罪释放"不等于"确认无罪"

**误区2**："P值是H₀为真的概率"
- **纠正**：P值是在H₀为真的条件下，观测到当前或更极端结果的概率。P值≠P(H₀为真)

**误区3**："α和β可以同时很小"
- **纠正**：在固定样本量下，减小α必然增大β。同时减小两者需要增大样本量`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：假设检验的不对称性——保护H₀**

假设检验的逻辑是不对称的：H₀被"保护"，除非有足够证据才被拒绝。这种不对称性不是技术限制，而是科学哲学的要求——"证伪比证实更容易"（Popper）。

一个例子就能说明为什么：要证明"所有天鹅都是白色的"（H₀），需要检查世界上所有天鹅；但只需一只黑天鹅就能否定它（拒绝H₀）。

因此，假设检验的本质是"试图证伪H₀"——我们永远无法证实H₀，只能"未能证伪"。这就是为什么统计结论只能说"拒绝H₀"或"不拒绝H₀"，而不能说"接受H₀"。

Neyman-Pearson理论将这种不对称性形式化：在控制第Ⅰ类错误概率≤α的条件下，最大化功效1-β（最优势检验）。`,
      extension: `**🚀 P值——比拒绝域更精细的度量**

P值 = P{统计量取值≥观测值|H₀}（右侧检验时）

P值的含义：在H₀为真的假设下，观测到当前或更极端结果的概率。

决策规则：P值≤α → 拒绝H₀

P值的优势：它不仅告诉我们是否拒绝H₀，还量化了拒绝H₀的"信心程度"。P=0.001比P=0.049（都在α=0.05下拒绝）提供了更强的否定H₀的证据。

但要注意：P值不是效应大小的度量，大样本下微小的效应也能产生极小的P值。`,
      further: [
        { id: 'f1', title: 'Neyman-Pearson引理', content: '对于简单假设H₀:θ=θ₀ vs H₁:θ=θ₁，似然比检验：\n拒绝H₀ ⟺ L(θ₁)/L(θ₀) > k\n\n是最优势检验（MP检验），即在所有满足P{第Ⅰ类错误}≤α的检验中，功效1-β最大。\n\n这是假设检验理论的基石，所有常用检验都可以从这个引理出发推导。' },
        { id: 'f2', title: '统计显著 vs 实际显著', content: '统计显著（P<α）只说明"效应存在"，不说明"效应大"。\n\n例：新药比旧药有效，P<0.001（高度显著），但效果只提高0.1%（实际意义不大）。\n\n大样本下，即使微不足道的效应也能被检测出来。因此报告效应量（effect size）和置信区间比P值更有意义。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '产品质量检验',
        description: `**问题**

某工厂零件直径标准μ₀=10mm, σ=0.2mm。随机抽检25件，X̄=10.08mm。问：能否认为生产正常？（α=0.05）

**解**

H₀: μ=10 vs H₁: μ≠10

σ已知，用Z检验：
U = (X̄-μ₀)/(σ/√n) = (10.08-10)/(0.2/5) = 0.08/0.04 = 2

z₀.₀₂₅ = 1.96

|U|=2 > 1.96，拒绝H₀。

结论：在α=0.05下，生产不正常（零件直径偏大）。

**注意**：如果α=0.01，z₀.₀₀₅=2.576，|U|=2<2.576，则不拒绝H₀。可见结论依赖于α的选择。`,
        scenario: '调整X̄和α，观察检验结论的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '临床试验——药物有效性检验',
        description: `**问题背景**

新降压药vs安慰剂：需检验新药是否有效。

H₀: μ新药=μ安慰剂（无效）vs H₁: μ新药<μ安慰剂（有效）

**两类错误的实际意义**：

- 第Ⅰ类错误（弃真）：新药实际无效但判为有效→让无效药物上市→危害患者健康
- 第Ⅱ类错误（取伪）：新药实际有效但判为无效→放弃有效药物→损失治疗机会

在药物审批中，第Ⅰ类错误后果更严重，所以α通常设得很小（0.01或0.001），代价是增大β（可能错过好药）。这就是为什么药物试验需要非常大的样本量——为了同时控制两类错误。`,
        scenario: '调整α和β，观察两类错误的权衡。',
      },
    ],
    method: [
      { number: 1, title: '假设检验六步法', description: `①建立假设H₀和H₁（双侧/单侧）\n②选检验统计量，定H₀下的分布\n③给定α\n④确定拒绝域（查表求临界值）\n⑤计算统计量观测值\n⑥判断：落入拒绝域→拒绝H₀，否则不拒绝` },
      { number: 2, title: 'P值法', description: `①建立假设\n②选统计量并计算观测值\n③计算P值=在H₀下取到当前或更极端值的概率\n④P值≤α→拒绝H₀\n⑤P值越小，否定H₀的证据越强` },
    ],
  },
}

const meanTestingPoint: KnowledgePoint = {
  id: 'mean-testing',
  moduleId: 'hypothesis-testing',
  name: '正态总体均值的检验',
  formula: 'U = \\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim N(0,1)',
  coreSentence: '均值检验的关键在于σ²是否已知——已知用Z检验，未知用t检验，单侧双侧取决于实际问题。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 'z_obs', y: 0, draggable: false, color: '#1565C0', label: 'U观测值' },
          { id: 'p2', x: 1.96, y: 0, draggable: false, color: '#FF6F00', label: 'z₀.₀₂₅=1.96' },
          { id: 'p3', x: -1.96, y: 0, draggable: false, color: '#FF6F00', label: '-z₀.₀₂₅' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 50, step: 1, defaultValue: 25, label: '样本量 n' },
          { id: 'sigma', name: 'sigma', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '标准差 σ' },
          { id: 'alpha', name: 'alpha', min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05, label: '显著性水平 α' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: 'Z检验vs t检验',
          type: 'step',
          steps: [
            { id: 's1', description: 'σ²已知：Z检验，用N(0,1)分位点', changes: { n: 25, sigma: 1, alpha: 0.05 } },
            { id: 's2', description: 'σ²未知：t检验，用t(n-1)分位点（更宽）', changes: { n: 25, sigma: 1, alpha: 0.05 } },
            { id: 's3', description: '双侧检验：拒绝域在两侧', changes: { n: 25, sigma: 1, alpha: 0.05 } },
            { id: 's4', description: '单侧检验：拒绝域在一侧', changes: { n: 25, sigma: 1, alpha: 0.05 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：检验均值是否"偏离"标准值**

正态总体均值检验是最常用的假设检验。核心问题是：样本均值X̄与假设值μ₀之间的差异，是"真实的偏离"还是"随机波动"造成的？

---

**📐 σ²已知时的Z检验详细步骤**

设X₁,...,Xₙ i.i.d. ~ N(μ,σ²)，σ²已知，检验H₀: μ=μ₀。

**检验统计量的构造原理**：为什么要选U=(X̄-μ₀)/(σ/√n)？

1. X̄是μ的最佳估计，X̄-μ₀反映"偏离程度"
2. 但X̄-μ₀的分布依赖于n和σ，直接用无法确定临界值
3. 标准化：H₀成立时X̄~N(μ₀,σ²/n)，故(X̄-μ₀)/(σ/√n)~N(0,1)
4. 标准化后的统计量分布已知且不依赖任何未知参数，可以确定临界值

**检验统计量**：
$$U = \\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}} \\sim N(0,1) \\quad (H_0\\text{成立时})$$

**拒绝域**：

| 检验类型 | H₁ | 拒绝域 |
|---------|-----|--------|
| 双侧 | μ≠μ₀ | |U|>zα/2 |
| 右侧 | μ>μ₀ | U>zα |
| 左侧 | μ<μ₀ | U<-zα |

**单侧检验拒绝域的确定**：右侧检验H₁:μ>μ₀，当X̄显著大于μ₀时拒绝H₀，即U>zα。左侧检验H₁:μ<μ₀，当X̄显著小于μ₀时拒绝，即U<-zα。

**为什么单侧的临界值更小？**因为单侧检验将全部α放在一侧，不需要像双侧那样分成两半。如α=0.05时，z₀.₀₂₅=1.96而z₀.₀₅=1.645。

**Z检验完整五步法例题**：某品牌矿泉水标称500ml，σ=3ml。抽检25瓶，X̄=498ml。问：容量是否达标？（α=0.05）

1. **假设**：H₀:μ=500 vs H₁:μ<500（左侧检验，只关心偏少）
2. **统计量**：U=(X̄-μ₀)/(σ/√n)=(498-500)/(3/5)=-10/3≈-3.33
3. **临界值**：α=0.05, z₀.₀₅=1.645
4. **拒绝域**：U<-1.645
5. **判断**：U=-3.33<-1.645，拒绝H₀。容量显著偏低。

---

**📐 σ²未知时的t检验详细步骤**

当σ²未知时，用S代替σ，检验统计量变为：

$$T = \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}} \\sim t(n-1) \\quad (H_0\\text{成立时})$$

**构造原理**：为什么T服从t分布？

H₀成立时：①X̄~N(μ₀,σ²/n)，标准化得(X̄-μ₀)/(σ/√n)~N(0,1)；②(n-1)S²/σ²~χ²(n-1)且与X̄独立；③由t分布定义，N(0,1)除以√(χ²/自由度)得t分布：T=[(X̄-μ₀)/(σ/√n)] / √[(n-1)S²/(σ²(n-1))] = (X̄-μ₀)/(S/√n) ~ t(n-1)。

**拒绝域**：

| 检验类型 | H₁ | 拒绝域 |
|---------|-----|--------|
| 双侧 | μ≠μ₀ | |T|>tα/2(n-1) |
| 右侧 | μ>μ₀ | T>tα(n-1) |
| 左侧 | μ<μ₀ | T<-tα(n-1) |

**t检验完整五步法例题**：某饮料标称500ml，抽9瓶得X̄=498ml, S=3ml。容量达标否？（α=0.05）

1. **假设**：H₀:μ=500 vs H₁:μ<500（左侧检验）
2. **统计量**：T=(498-500)/(3/3)=-2
3. **临界值**：t₀.₀₅(8)=1.860
4. **拒绝域**：T<-1.860
5. **判断**：T=-2<-1.860，拒绝H₀。容量显著偏低。

**t检验与Z检验的区别**：
- t(n-1)比N(0,1)"胖"，因此tα/2(n-1)>zα/2
- 同样的数据，t检验更难拒绝H₀（更保守）——σ未知带来的不确定性
- 当n≥30时，t(n-1)≈N(0,1)，两者几乎等价

---

**📐 检验与置信区间的关系**

双侧检验H₀:μ=μ₀ vs H₁:μ≠μ₀（显著性水平α）与μ的1-α置信区间存在**对偶关系**：

$$\\text{拒绝H₀} \\Leftrightarrow \\mu_0 \\notin \\left[\\bar{X} - \\frac{\\sigma}{\\sqrt{n}} z_{\\alpha/2}, \\quad \\bar{X} + \\frac{\\sigma}{\\sqrt{n}} z_{\\alpha/2}\\right]$$

即：**μ₀落在置信区间外 ⟺ 拒绝H₀**。

**实用意义**：给出置信区间比仅做检验提供更多信息——不仅知道"是否有差异"，还知道"差异有多大"以及差异的精度。

---

**⚠️ 常见误区**

**误区1**："不拒绝H₀就说明μ=μ₀"
- **纠正**：不拒绝只说明"差异不够显著"，可能是因为样本量太小（检验功效不足）

**误区2**："双侧检验比单侧检验更严格"
- **纠正**：对同一侧的偏离，单侧检验更容易检测出来。但单侧检验对另一侧的偏离完全无能为力

**误区3**："P值越小，效应越大"
- **纠正**：P值反映的是"证据强度"（差异的统计显著性），不是效应的大小。大样本下微小差异也能得到很小的P值`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：Z检验与t检验的统一视角**

Z检验和t检验的统计量形式完全相同：X̄-μ₀除以标准误。区别只在于分母中σ是已知的还是用S估计的。

当σ已知时，分母是常数→U服从精确的N(0,1)。
当σ未知时，分母含随机性→T服从t(n-1)（尾部更厚）。

t分布的"胖尾"反映了对σ的不确定性——我们不知道σ，所以需要"留更多余地"。自由度n-1越大，对σ的估计越准确，"胖尾"越不明显，最终退化为标准正态。`,
      extension: `**🚀 Welch t检验——方差不等时的两样本t检验**

当两总体方差不等时，Welch提出修正：
T* = (X̄₁-X̄₂)/(√(S₁²/n₁+S₂²/n²))
近似服从t(ν)，自由度由Satterthwaite公式给出。`,
      further: [
        { id: 'f1', title: '功效分析——样本量的确定', content: 'Z检验右侧检验：n = (zα+zβ)²σ²/δ²\n例：α=0.05, β=0.20, δ=0.5\nn ≈ 25' },
        { id: 'f2', title: '配对t检验', content: '当数据是成对观测时，用差值dᵢ=Xᵢ-Yᵢ转化为单样本t检验：\nT = d̄/(Sd/√n) ~ t(n-1)\n配对设计消除了个体差异的干扰。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: 'σ²未知时的单样本t检验',
        description: `**问题**

某品牌饮料标称容量500ml。随机抽取9瓶，测得X̄=498ml, S=3ml。问：容量是否达标？（α=0.05）

**解**

H₀:μ=500 vs H₁:μ<500（左侧检验）

T = (498-500)/(3/3) = -2

t₀.₀₅(8) = -1.860

T=-2 < -1.860，拒绝H₀。

结论：容量显著低于500ml，不达标。`,
        scenario: '调整X̄和S，观察检验结论。',
      },
      {
        id: 'app2',
        type: 'real',
        title: 'AB测试——网页改版效果评估',
        description: `**问题**

电商网站测试新版首页，A组5000人转化率3.2%，B组5000人3.8%。新版是否显著提高？

**解**

H₀:p₁=p₂ vs H₁:p₁<p₂

p̂ = 0.035（合并比例）

U = (0.038-0.032)/√(0.035×0.965×0.0004) = 0.006/0.00367 = 1.63

z₀.₀₅ = 1.645

U=1.63 < 1.645，不拒绝H₀。但P值≈0.052，接近显著。`,
        scenario: '调整两组转化率，观察检验结果。',
      },
    ],
    method: [
      { number: 1, title: '均值检验选择流程', description: `①σ²已知→Z检验，用N(0,1)分位点\n②σ²未知→t检验，用t(n-1)分位点\n③方向明确→单侧检验；不明确→双侧\n④大样本(n≥30)→t≈Z，可用Z近似` },
      { number: 2, title: '检验与置信区间互推', description: `①双侧检验：μ₀∉置信区间→拒绝H₀\n②给出置信区间比仅做检验更有信息量\n③两者等价但置信区间提供了效应大小的信息` },
    ],
  },
}

const varianceTestingPoint: KnowledgePoint = {
  id: 'variance-testing',
  moduleId: 'hypothesis-testing',
  name: '正态总体方差的检验',
  formula: '\\chi^2 = \\frac{(n-1)S^2}{\\sigma_0^2} \\sim \\chi^2(n-1)',
  coreSentence: '方差检验用的是χ²分布和F分布——χ²检验单个方差，F检验比较两个方差。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '(1/(2^(n/2)*gamma(n/2)))*x^(n/2-1)*exp(-x/2)', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 'chi2_obs', y: 0, draggable: false, color: '#1565C0', label: 'χ²观测值' },
        ],
        sliders: [
          { id: 'n', name: 'n', min: 5, max: 50, step: 1, defaultValue: 20, label: '样本量 n' },
          { id: 'sigma0_sq', name: 'sigma0_sq', min: 0.5, max: 5, step: 0.1, defaultValue: 1, label: '假设方差 σ₀²' },
          { id: 'alpha', name: 'alpha', min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05, label: '显著性水平 α' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: 'χ²检验过程',
          type: 'step',
          steps: [
            { id: 's1', description: 'H₀:σ²=σ₀²，构造χ²=(n-1)S²/σ₀²', changes: { n: 20, sigma0_sq: 1, alpha: 0.05 } },
            { id: 's2', description: '双侧拒绝域：χ²<χ²₁-α/2或χ²>χ²α/2', changes: { n: 20, sigma0_sq: 1, alpha: 0.05 } },
            { id: 's3', description: 'S²偏大→χ²偏大→可能拒绝H₀', changes: { n: 20, sigma0_sq: 1, alpha: 0.05 } },
            { id: 's4', description: 'S²接近σ₀²→χ²接近n-1→不拒绝H₀', changes: { n: 20, sigma0_sq: 1, alpha: 0.05 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：检验"波动"是否符合标准**

方差检验关注的是数据的"波动程度"是否与假设一致。生产质量控制中，不仅要控制均值，还要控制方差——波动太大同样是质量问题。方差检验使用χ²分布（单总体）和F分布（两总体比较）。

---

**📐 单总体方差χ²检验的完整步骤**

设X₁,...,Xₙ i.i.d. ~ N(μ,σ²)，检验H₀:σ²=σ₀²。

**检验统计量的构造原理**：由正态总体抽样分布定理，H₀成立时(n-1)S²/σ₀²~χ²(n-1)。这个统计量只含样本信息和假设值σ₀²，不含未知参数，因此可作为检验统计量。

**检验统计量**：
$$\\chi^2 = \\frac{(n-1)S^2}{\\sigma_0^2} \\sim \\chi^2(n-1) \\quad (H_0\\text{成立时})$$

**拒绝域**：

| 检验类型 | H₁ | 拒绝域 |
|---------|-----|--------|
| 双侧 | σ²≠σ₀² | χ²<χ²₁-α/2(n-1)或χ²>χ²α/2(n-1) |
| 右侧 | σ²>σ₀² | χ²>χ²α(n-1) |
| 左侧 | σ²<σ₀² | χ²<χ²₁-α(n-1) |

**注意**：χ²分布不对称！双侧检验的两个临界值不是互为相反数。例如χ²₀.₉₇₅(10)=3.25, χ²₀.₀₂₅(10)=20.48，拒绝域为χ²<3.25或χ²>20.48。

**χ²检验完整例题**：某奶粉包装标准要求σ≤5g（即σ²≤25）。抽检16袋，S=7g。包装精度是否合格？（α=0.05）

1. H₀:σ²=25 vs H₁:σ²>25（右侧检验，只关心波动偏大）
2. χ²=(n-1)S²/σ₀²=15×49/25=29.4
3. 查表：χ²₀.₀₅(15)=24.996
4. 拒绝域：χ²>24.996
5. χ²=29.4>24.996，拒绝H₀。包装精度不达标，波动偏大。

**P值法**：P=P{χ²(15)>29.4}≈0.014<0.05，拒绝H₀。

---

**📐 双总体方差F检验的完整步骤**

设X₁,...,Xₙ₁~N(μ₁,σ₁²), Y₁,...,Yₙ₂~N(μ₂,σ₂²)独立，检验H₀:σ₁²=σ₂²。

**检验统计量的构造原理**：H₀成立时σ₁²=σ₂²，由F分布定义：
$$F = \\frac{S_1^2/\\sigma_1^2}{S_2^2/\\sigma_2^2} = \\frac{S_1^2}{S_2^2} \\sim F(n_1-1, n_2-1)$$

**约定**：将较大的S²放在分子位置，使F≥1，只需查F分布右侧分位点。

**拒绝域**：

| 检验类型 | H₁ | 拒绝域 |
|---------|-----|--------|
| 双侧 | σ₁²≠σ₂² | F>Fα/2(n大-1,n小-1) |
| 右侧 | σ₁²>σ₂² | F>Fα(n₁-1,n₂-1) |

**F检验完整例题**：A工艺8件产品S₁=0.015mm；B工艺10件产品S₂=0.008mm。B是否更稳定？（α=0.05）

1. H₀:σ₁²=σ₂² vs H₁:σ₁²>σ₂²
2. F=S₁²/S₂²=0.015²/0.008²=0.000225/0.000064=3.516
3. 查表：F₀.₀₅(7,9)=3.29
4. 拒绝域：F>3.29
5. F=3.516>3.29，拒绝H₀。A工艺方差显著大于B，B工艺更稳定。

**P值法**：P=P{F(7,9)>3.516}≈0.043<0.05，拒绝H₀。

---

**📐 χ²检验与F检验的对比**

| 检验 | 用途 | 统计量 | 分布 | 适用条件 |
|------|------|--------|------|---------|
| χ²检验 | 单总体方差 | (n-1)S²/σ₀² | χ²(n-1) | 正态总体 |
| F检验 | 两总体方差比 | S₁²/S₂² | F(n₁-1,n₂-1) | 两正态总体独立 |

**共同特点**：
1. 都对正态性假设敏感——非正态数据下结果不可靠
2. 都使用非对称分布，拒绝域不对称
3. 方差检验不如均值检验稳健，建议结合Levene检验使用

---

**⚠️ 常见误区**

**误区1**："χ²检验的拒绝域是对称的"
- **纠正**：χ²分布不对称，χ²₁-α/2≠-χ²α/2（χ²只取正值，不存在"负"的临界值）

**误区2**："F检验中两个S²可以任意放"
- **纠正**：约定大S²放分子，使F≥1，只需查右侧分位点

**误区3**："方差检验与均值检验一样对正态性稳健"
- **纠正**：方差检验对正态性偏离非常敏感，远不如t检验稳健。建议先用Shapiro-Wilk检验正态性，或直接用Levene检验`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：方差检验的敏感性**

χ²检验和F检验对方差的正态性假设非常敏感——远比t检验对正态性的容忍度低。方差是二阶矩，正态偏离对方差的影响大于对均值的影响。解决方案：Levene检验对正态性偏离更稳健。`,
      extension: `**🚀 Levene检验**

Levene检验比较|Xᵢ-X̄ᵢ|的组间差异，对正态性偏离稳健，是SPSS默认的方差齐性检验方法。`,
      further: [
        { id: 'f1', title: 'χ²检验的P值计算', content: 'P值 = P{χ²(n-1) ≥ 观测值}（右侧检验）\n双侧P值 = 2·min(P{χ²≥观测值}, P{χ²≤观测值})' },
        { id: 'f2', title: '方差检验与均值检验的配合', content: '现代建议：直接用Welch t检验，不必先做F检验验证方差齐性。因为F检验本身对正态性敏感。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '产品质量稳定性检验',
        description: `**问题**

某奶粉包装标准σ=5g。抽检16袋，S=7g。问：包装精度是否合格？（α=0.05）

**解**

H₀:σ²=25 vs H₁:σ²>25

χ² = 15×49/25 = 29.4

χ²₀.₀₅(15) = 24.996

χ²=29.4 > 24.996，拒绝H₀。精度不达标。`,
        scenario: '调整S和σ₀，观察检验结论。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '两种工艺的方差比较',
        description: `**问题**

A工艺：n₁=8, S₁=0.015mm；B工艺：n₂=10, S₂=0.008mm。B是否更稳定？

**解**

H₀:σ₁²=σ₂² vs H₁:σ₁²>σ₂²

F = 0.015²/0.008² = 3.516

F₀.₀₅(7,9) = 3.29

F=3.516 > 3.29，拒绝H₀。B工艺更稳定。`,
        scenario: '调整两组标准差，观察F检验结果。',
      },
    ],
    method: [
      { number: 1, title: '方差检验选择', description: `①单个方差→χ²检验\n②两个方差比较→F检验\n③约定大S²放分子\n④注意χ²分布不对称` },
      { number: 2, title: '方差检验与均值检验配合', description: `①方差齐性→等方差t检验\n②方差不齐→Welch t检验\n③现代建议：直接用Welch t检验` },
    ],
  },
}

const twoSampleTestingPoint: KnowledgePoint = {
  id: 'two-sample-testing',
  moduleId: 'hypothesis-testing',
  name: '两正态总体的比较检验',
  formula: 't = \\frac{(\\bar{X}_1 - \\bar{X}_2) - (\\mu_1 - \\mu_2)}{S_w\\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}}',
  coreSentence: '比较两个总体——均值差用t检验，方差比用F检验，成对数据用配对t检验，三种场景各有其法。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*1)*exp(-(x-0)^2/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159)*1)*exp(-(x-1.5)^2/2)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#C62828', label: '总体1' },
          { id: 'p2', x: 1.5, y: 0, draggable: false, color: '#1565C0', label: '总体2' },
        ],
        sliders: [
          { id: 'n1', name: 'n1', min: 5, max: 50, step: 1, defaultValue: 20, label: '样本量 n₁' },
          { id: 'n2', name: 'n2', min: 5, max: 50, step: 1, defaultValue: 20, label: '样本量 n₂' },
          { id: 'alpha', name: 'alpha', min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05, label: '显著性水平 α' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '两总体比较检验',
          type: 'step',
          steps: [
            { id: 's1', description: '两总体分布：是否有差异？', changes: { n1: 20, n2: 20, alpha: 0.05 } },
            { id: 's2', description: '均值差检验：μ₁-μ₂是否为0？', changes: { n1: 20, n2: 20, alpha: 0.05 } },
            { id: 's3', description: '差异变大→更容易检测到', changes: { n1: 20, n2: 20, alpha: 0.05 } },
            { id: 's4', description: '样本量增大→检验更灵敏', changes: { n1: 50, n2: 50, alpha: 0.05 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：两总体"谁强谁弱"**

两总体比较检验是实际应用中最常见的检验场景——比较两种药物、两种工艺、两组人群等。核心问题是：两个总体参数的差异是"真实的"还是"随机波动"造成的？

---

**📐 两总体均值差的检验（σ已知/未知两种）**

**情形1：σ₁²和σ₂²已知**

检验统计量的构造原理：X̄₁-X̄₂~N(μ₁-μ₂, σ₁²/n₁+σ₂²/n₂)，标准化后服从N(0,1)。

$$U = \\frac{(\\bar{X}_1 - \\bar{X}_2) - (\\mu_1 - \\mu_2)}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}} \\sim N(0,1)$$

H₀:μ₁=μ₂时拒绝域：|U|>zα/2（双侧）

**情形2：σ₁²=σ₂²=σ²未知（等方差t检验）**

设X₁,...,Xₙ₁~N(μ₁,σ²), Y₁,...,Yₙ₂~N(μ₂,σ²)独立。

**检验统计量**：
$$t = \\frac{(\\bar{X}_1 - \\bar{X}_2) - (\\mu_1 - \\mu_2)}{S_w\\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}} \\sim t(n_1+n_2-2)$$

其中合并方差：
$$S_w^2 = \\frac{(n_1-1)S_1^2 + (n_2-1)S_2^2}{n_1+n_2-2}$$

Sw²是两组方差的加权平均，自由度大的组权重更大。

**拒绝域**（H₀:μ₁=μ₂时）：

| H₁ | 拒绝域 |
|-----|--------|
| μ₁≠μ₂ | |t|>tα/2(n₁+n₂-2) |
| μ₁>μ₂ | t>tα(n₁+n₂-2) |
| μ₁<μ₂ | t<-tα(n₁+n₂-2) |

**关键前提**：σ₁²=σ₂²（方差齐性）。如果不满足，用Welch t检验。

---

**📐 两总体方差比的F检验**

**检验H₀:σ₁²=σ₂²**

**检验统计量构造原理**：由正态总体抽样分布，S₁²/σ₁²与S₂²/σ₂²分别服从缩放的χ²分布，H₀成立时σ₁²=σ₂²，比值S₁²/S₂²~F(n₁-1,n₂-1)。

F = S₁²/S₂² ~ F(n₁-1, n₂-1)

约定大S²放分子。通常先做F检验判断方差齐性，再做t检验比较均值。

---

**📐 成对数据的t检验**

当数据是成对观测（同一对象的前后测量、配对实验等），不能直接用两样本t检验！

**检验统计量构造原理**：令dᵢ = Xᵢ - Yᵢ，每个dᵢ是个体内部的差异，消除了个体间变异的干扰。配对数据转化为单样本问题：

H₀: μd = 0（即μ₁ = μ₂）

$$t = \\frac{\\bar{d}}{S_d/\\sqrt{n}} \\sim t(n-1)$$

**完整例题**：10名患者服药前后血压差值d̄=-5, Sd=8

1. H₀:μd=0 vs H₁:μd≠0
2. t=d̄/(Sd/√n)=-5/(8/√10)=-1.976
3. t₀.₀₂₅(9)=2.262
4. |t|=1.976<2.262，不拒绝H₀。尚不能认为药物有降压效果。

**配对设计的优势**：消除了个体差异的干扰，通常比独立样本t检验更有效（更小的标准误，更大的功效）。但要求配对因素确实与响应相关——如果配对无效，反而损失自由度。

---

**📐 三种两总体检验的选择与构造原理**

| 场景 | 方法 | 统计量构造 | 条件 |
|------|------|-----------|------|
| 比较均值（等方差） | 两样本t检验 | X̄₁-X̄₂除以Sw√(1/n₁+1/n₂) | σ₁²=σ₂² |
| 比较均值（不等方差） | Welch t检验 | X̄₁-X̄₂除以√(S₁²/n₁+S₂²/n₂) | σ₁²≠σ₂² |
| 比较方差 | F检验 | S₁²/S₂² | 正态总体 |
| 成对数据 | 配对t检验 | d̄/(Sd/√n) | 自然配对 |

---

**⚠️ 常见误区**

**误区1**："成对数据可以用两独立样本t检验"
- **纠正**：成对数据用两独立样本t检验会忽略配对信息，增大标准误，降低检验功效。必须用配对t检验

**误区2**："两样本t检验一定要先做F检验"
- **纠正**：现代建议直接用Welch t检验，无需先验证方差齐性`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：配对vs独立——实验设计决定检验方法**

两总体比较检验的核心不在于选哪个统计量，而在于实验设计。配对设计和独立设计对应完全不同的统计方法，选错方法会导致严重错误。

独立设计：两组不同的对象（如A组用药、B组用安慰剂）→两样本t检验
配对设计：同一组对象的前后对比（如用药前后）→配对t检验

配对设计的优势是消除了个体间的变异，让"信号"更清晰。但配对设计要求配对有效——如果配对因素与响应无关，配对反而会损失自由度。`,
      extension: `**🚀 非参数替代方法**

当正态性不满足时，可用非参数检验替代：

- 两独立样本→Wilcoxon秩和检验（Mann-Whitney U检验）
- 配对样本→Wilcoxon符号秩检验
- 方差齐性→Levene检验

非参数方法对分布假设更宽松，但功效略低于参数方法（正态成立时）。`,
      further: [
        { id: 'f1', title: '合并方差Sw²的直观理解', content: 'Sw²是两组样本方差的加权平均：\nSw² = [(n₁-1)S₁²+(n₂-1)S₂²]/(n₁+n₂-2)\n\n权重与自由度成正比。自由度大的组贡献更多信息，权重更大。\n\n当n₁=n₂时，Sw²=(S₁²+S₂²)/2，就是简单平均。' },
        { id: 'f2', title: '等方差vs不等方差t检验的影响', content: '当σ₁²≠σ₂²但用了等方差t检验：\n- 若n₁=n₂，影响很小（t检验对等方差假设稳健）\n- 若n₁≠nₙ且大方差对应小样本，实际α偏大（过多拒绝）\n- 若n₁≠n₂且大方差对应大样本，实际α偏小（过少拒绝）\n\n因此样本量不等时，建议用Welch t检验。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '两总体均值差的t检验',
        description: `**问题**

比较两种教学方法。A组25人，X̄₁=82, S₁=8；B组30人，X̄₂=78, S₂=10。假设方差齐性，问两种方法效果是否不同？（α=0.05）

**解**

H₀:μ₁=μ₂ vs H₁:μ₁≠μ₂

Sw² = (24×64+29×100)/53 = (1536+2900)/53 ≈ 83.7
Sw ≈ 9.15

t = (82-78)/(9.15×√(1/25+1/30)) = 4/(9.15×0.273) = 4/2.498 ≈ 1.60

t₀.₀₂₅(53) ≈ 2.006

|t|=1.60 < 2.006，不拒绝H₀。

结论：尚不能认为两种教学方法效果有显著差异。`,
        scenario: '调整两组参数，观察检验结果。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '减肥药效果——配对t检验',
        description: `**问题**

10名肥胖者服用减肥药，前后体重(kg)：

| 编号 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|------|---|---|---|---|---|---|---|---|---|---|
| 前 | 85 | 90 | 78 | 92 | 88 | 76 | 95 | 82 | 89 | 80 |
| 后 | 82 | 87 | 76 | 89 | 85 | 74 | 91 | 80 | 85 | 78 |
| dᵢ | -3 | -3 | -2 | -3 | -3 | -2 | -4 | -2 | -4 | -2 |

d̄ = -2.8, Sd = 0.79

**解**

H₀:μd=0 vs H₁:μd<0（体重减少）

t = -2.8/(0.79/√10) = -2.8/0.250 = -11.22

t₀.₀₅(9) = -1.833

t=-11.22 < -1.833，拒绝H₀。

结论：减肥药显著降低体重（配对t检验，P<<0.001）。`,
        scenario: '调整前后体重差值，观察配对t检验结果。',
      },
    ],
    method: [
      { number: 1, title: '两总体比较检验选择流程', description: `①成对数据→配对t检验（用差值dᵢ）\n②独立样本、等方差→两样本t检验（用Sw）\n③独立样本、不等方差→Welch t检验\n④比较方差→F检验` },
      { number: 2, title: '两样本t检验完整步骤', description: `①判断是否配对数据\n②若独立：先考虑方差是否相等（F检验或直接用Welch）\n③构造检验统计量t\n④与tα/2(n₁+n₂-2)比较（等方差时）\n⑤做出统计结论，结合实际背景解释` },
    ],
  },
}

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
    id: 'multivariable-differential',
    name: '多元函数微分法',
    icon: '∂²',
    description: '多元函数微分法是一元函数微分学的自然推广，描述多维变化率',
    knowledgePoints: [multivariableBasicPoint, partialDerivativePoint, compositeImplicitPoint, directionalGradientPoint, multivariableExtremumPoint],
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
    knowledgePoints: [vectorOperationsPoint, planeAndLinePoint, surfacesPoint],
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
  {
    id: 'determinant',
    name: '行列式',
    icon: '⊞',
    description: '行列式是将方阵映射到标量的函数，是判断矩阵可逆性和求解线性方程组的核心工具',
    knowledgePoints: [determinantDefinitionPoint, determinantExpansionPoint, cramerRulePoint],
  },
  {
    id: 'matrix',
    name: '矩阵',
    icon: '▦',
    description: '矩阵是线性变换的代数表示，是现代数学和工程计算的核心语言',
    knowledgePoints: [matrixDefinitionPoint, matrixInversePoint, matrixRankPoint, matrixEquationPoint],
  },
    {
    id: 'probability-events',
    name: '随机事件和概率',
    icon: '🎲',
    description: '用集合语言描述随机事件，三条公理构建概率大厦，排列组合与三大公式是核心工具',
    knowledgePoints: [randomExperimentPoint, eventRelationPoint, probabilityAxiomPoint, classicalProbabilityPoint, geometricProbabilityPoint, conditionalProbabilityPoint, bayesFormulaPoint, independenceBernoulliPoint],
  },
  {
    id: 'one-dim-rv',
    name: '一维随机变量及其分布',
    icon: '📊',
    description: '随机变量将随机现象数量化，分布函数完整刻画概率规律，六大常见分布各有其应用场景',
    knowledgePoints: [distributionFunctionPoint, discreteRVPoint, binomialDistributionPoint, poissonDistributionPoint, continuousRVPoint, uniformExponentialPoint, normalDistributionPoint, rvFunctionPoint],
  },
  {
    id: 'two-dim-rv',
    name: '二维随机变量及其分布',
    icon: '📈',
    description: '联合分布描述两个变量的概率规律，边缘分布与条件分布是降维工具，独立性简化计算',
    knowledgePoints: [jointDistributionPoint, twoDimDiscretePoint, twoDimContinuousPoint, marginalDistributionPoint, conditionalDistributionPoint, rvIndependencePoint, twoDimFunctionPoint],
  },
  {
    id: 'digital-features',
    name: '随机变量的数字特征',
    icon: '📐',
    description: '期望、方差、相关系数用数值刻画分布的核心特征，是统计推断的理论基础',
    knowledgePoints: [expectationPoint, variancePoint, covarianceCorrelationPoint, momentCovMatrixPoint, distributionFeaturesSummaryPoint],
  },
  {
    id: 'limit-theorems',
    name: '大数定律与中心极限定理',
    icon: '∞',
    description: '大数定律揭示频率趋于概率，中心极限定理揭示大量随机因素叠加必趋正态',
    knowledgePoints: [chebyshevInequalityPoint, lawLargeNumbersPoint, centralLimitTheoremPoint],
  },
  {
    id: 'statistics-basics',
    name: '数理统计的基本概念',
    icon: '🔬',
    description: '从样本推断总体，统计量是桥梁，三大抽样分布是推断的理论武器',
    knowledgePoints: [populationSamplePoint, samplingDistributionsPoint, normalSamplingTheoremPoint, orderStatisticsPoint],
  },
  {
    id: 'parameter-estimation',
    name: '参数估计',
    icon: '📏',
    description: '矩估计和最大似然估计是两大点估计方法，无偏性、有效性、一致性评价优劣，区间估计给出精度保证',
    knowledgePoints: [momentEstimationPoint, maximumLikelihoodPoint, estimatorCriteriaPoint, intervalEstimationPoint],
  },
  {
    id: 'hypothesis-testing',
    name: '假设检验',
    icon: '✅',
    description: '小概率原理是核心思想，两类错误权衡取舍，Z/t/chisq/F检验各有适用场景',
    knowledgePoints: [hypothesisTestingBasicsPoint, meanTestingPoint, varianceTestingPoint, twoSampleTestingPoint],
  },
]

// 获取当前知识点
export const getCurrentKnowledge = (moduleId: string, knowledgeId: string): KnowledgePoint | null => {
  const module = knowledgeModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.knowledgePoints.find(k => k.id === knowledgeId) || null
}
