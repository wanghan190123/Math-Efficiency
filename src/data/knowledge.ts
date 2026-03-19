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
      mainText: `**数学定义**

对于数列 {xₙ}，如果存在常数 A，对于任意给定的正数 ε（无论多小），总存在正整数 N，使得当 n > N 时，|xₙ - A| < ε 恒成立，则称 A 为数列 {xₙ} 的极限，记作：

$$\\lim_{n \\to \\infty} x_n = A$$

**直观理解**

数列极限就像一群人排队走向目标线：
- n 是排队的序号
- xₙ 是每个人的位置
- A 是最终的目标线

无论你要求"离目标线多近"（ε 多小），总能找到一个"起点"（N），从这个起点往后的所有人，都能满足你的要求。

这就是"无限逼近"的本质：不是"达到"，而是"再也跑不出去"。

**关键要点**

1. **ε 的任意性**：ε 可以任意小，代表我们要求的精度
2. **N 的存在性**：对于每个 ε，都能找到对应的 N
3. **极限的唯一性**：如果极限存在，则必定唯一
4. **有界性**：收敛数列必有界`,
      highlights: [
        { start: 0, end: 50, type: 'definition' },
      ],
    },
    
    extension: {
      essence: `**核心内涵**

极限的核心是"无限趋近但不要求相等"，打破了"必须到达才算成立"的直觉。

"ε-N 语言"是用"有限"描述"无限"的数学智慧，是高数严谨性的起点。它将模糊的"越来越近"转化为精确的数学表述。

**收敛数列的性质**

1. **唯一性**：若数列收敛，则极限唯一
   - 证明：假设有A₁、A₂两个极限，取 ε = |A₁-A₂|/2，导出矛盾

2. **有界性**：收敛数列必有界
   - 证明：取 ε=1，存在N，当n>N时|xₙ-A|<1，即|xₙ|<|A|+1

3. **保号性**：若 lim xₙ = A > 0，则存在N，当n>N时 xₙ > 0`,
      extension: `**从数列极限到函数极限**

数列极限可以延伸到函数极限：
- x → x₀：自变量趋向某点
- x → ∞：自变量趋向无穷

两者的本质都是"变量变化的终极趋势"。

**相关定理**

1. **夹逼定理**：若 yₙ ≤ xₙ ≤ zₙ，且 lim yₙ = lim zₙ = A，则 lim xₙ = A

2. **单调有界原理**：单调有界数列必收敛

**实际计算方法**

常用技巧：
- 分子分母同除最高次幂
- 有理化
- 等价无穷小替换`,
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
        description: `对于给定的 ε，找满足条件的 N：
1. 解不等式 |xₙ - A| < ε
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
      mainText: `**数学定义**

函数 f(x) 在点 x₀ 处的导数定义为：

$$f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$

或写成：

$$f'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}$$

**几何意义**

导数 f'(x₀) 是曲线 y = f(x) 在点 (x₀, f(x₀)) 处**切线的斜率**。

**从割线到切线**

1. **割线**：连接曲线上两点的直线，斜率 = 平均变化率
   $$k_{割} = \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}$$

2. **切线**：当 Q → P 时割线的极限位置，斜率 = 瞬时变化率
   $$k_{切} = \\lim_{Q \\to P} k_{割} = f'(x_0)$$

**物理意义**

- 位移 s(t) 的导数 = 瞬时速度 v(t)
- 速度 v(t) 的导数 = 瞬时加速度 a(t)`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
      ],
    },
    
    extension: {
      essence: `**核心内涵**

导数是"瞬时变化率"的抽象。

从"平均变化率"到"瞬时变化率"，是从"宏观"到"微观"的跨越，体现了微积分的核心思想——**局部线性近似**。

**导数的本质**

导数将非线性问题局部线性化：
$$f(x) \\approx f(x_0) + f'(x_0)(x - x_0)$$

这是泰勒展开的基础，也是数值计算的核心。`,
      extension: `**从一元到多元**

一元函数导数 → 多元函数偏导数
- 偏导数 = 沿坐标轴方向的导数
- 梯度 = 各方向偏导数组成的向量

**高阶导数**

二阶导数 f''(x) 描述凹凸性：
- f'' > 0：凹函数（开口向上）
- f'' < 0：凸函数（开口向下）

**微分与导数的关系**

$$dy = f'(x)dx$$

微分是导数的"应用形式"，便于近似计算和误差估计。`,
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
1. 过点 (x₀, f(x₀)) 作切线
2. 切线斜率 = 导数值
3. 斜率正 → 函数上升；斜率负 → 函数下降`
      },
      { 
        number: 2, 
        title: '定义法 - 计算极限', 
        description: `用定义计算导数：
1. 写出差商：[f(x₀+Δx)-f(x₀)]/Δx
2. 化简表达式
3. 取极限 Δx→0

例：f(x)=x²，则 f'(x₀)=lim [(x₀+Δx)²-x₀²]/Δx = 2x₀`
      },
      { 
        number: 3, 
        title: '公式法 - 求导法则', 
        description: `常用求导公式：
- (xⁿ)' = nxⁿ⁻¹
- (eˣ)' = eˣ
- (ln x)' = 1/x
- (sin x)' = cos x
- (cos x)' = -sin x

复合函数：链式法则
[f(g(x))]' = f'(g(x))·g'(x)`
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
    knowledgePoints: [sequenceLimitPoint],
  },
  {
    id: 'derivative',
    name: '导数与微分',
    icon: '∂',
    description: '导数描述变化率，是研究函数性质的重要工具',
    knowledgePoints: [derivativeGeometryPoint],
  },
  {
    id: 'integral',
    name: '积分',
    icon: '∫',
    description: '积分是求和的极限，是计算面积、体积的基础',
    knowledgePoints: [],
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
    knowledgePoints: [],
  },
]

// 获取当前知识点
export const getCurrentKnowledge = (moduleId: string, knowledgeId: string): KnowledgePoint | null => {
  const module = knowledgeModules.find(m => m.id === moduleId)
  if (!module) return null
  return module.knowledgePoints.find(k => k.id === knowledgeId) || null
}