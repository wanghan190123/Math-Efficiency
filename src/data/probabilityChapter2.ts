import { KnowledgePoint } from '@/types'

// ==================== 第二章 一维随机变量及其分布 ====================

// ---- 2.1 随机变量与分布函数 ----

const distributionFunctionPoint: KnowledgePoint = {
  id: 'distribution-function',
  moduleId: 'probability',
  name: '随机变量与分布函数',
  formula: 'F(x) = P\\{X \\leq x\\}',
  coreSentence: '随机变量将样本点映射为实数，分布函数F(x)=P{X≤x}是刻画概率规律的"身份证"——四条性质缺一不可。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(1+exp(-1.5*(x-mu)/sigma))', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 'mu', y: 0.5, draggable: false, color: '#1565C0', label: 'F(μ)=0.5' },
          { id: 'p2', x: 'x_val', y: '1/(1+exp(-1.5*(x_val-mu)/sigma))', draggable: true, color: '#2E7D32', label: '(x,F(x))' },
        ],
        sliders: [
          { id: 'mu', name: 'mu', min: -3, max: 3, step: 0.1, defaultValue: 0, label: 'μ 位置参数' },
          { id: 'sigma', name: 'sigma', min: 0.3, max: 3, step: 0.1, defaultValue: 1, label: 'σ 尺度参数' },
          { id: 'x_val', name: 'x_val', min: -5, max: 5, step: 0.1, defaultValue: 1, label: 'x 观测点' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '分布函数性质演示',
          type: 'step',
          steps: [
            { id: 's1', description: '性质①：F(-∞)→0，F(+∞)→1', changes: { mu: 0, sigma: 1, x_val: -5 } },
            { id: 's2', description: '性质②：单调不减——x增大F(x)增大', changes: { mu: 0, sigma: 1, x_val: -2 } },
            { id: 's3', description: '性质③：F(x)右连续', changes: { mu: 0, sigma: 1, x_val: 0 } },
            { id: 's4', description: '概率计算：P{a<X≤b}=F(b)-F(a)', changes: { mu: 0, sigma: 1, x_val: 2 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：从事件到函数——概率论进入"函数时代"**

随机变量是把随机试验的每个结果（样本点）转化为一个实数的规则。有了随机变量，对事件的研究就转化为对实数的研究，概率论从此有了函数工具。

---

**📐 随机变量的定义**

设(Ω, F, P)为概率空间，若对每个ω∈Ω，都有一个实数X(ω)与之对应，且对任意实数x，{ω : X(ω) ≤ x}∈F（即{X ≤ x}是事件），则称X为**随机变量**。

**直观理解**：随机变量是样本空间到实数轴的"桥梁"——

| 概率论语言 | 函数语言 |
|-----------|---------|
| 样本点ω | 自变量 |
| 随机变量X(ω) | 函数值 |
| 事件{X ≤ x} | 水平截集 |
| P{X ≤ x} | 截集的测度 |

---

**📐 分布函数F(x)的定义**

$$F(x) = P\\{X \\leq x\\}, \\quad -\\infty < x < +\\infty$$

F(x)的值是"X落在x及以左"的概率，它是x的函数，完整刻画了X的概率分布规律。

---

**📐 分布函数的四条基本性质（也是充要条件）**

| 序号 | 性质 | 数学描述 |
|------|------|---------|
| ① | 有界性 | 0 ≤ F(x) ≤ 1 |
| ② | 单调不减 | x₁ < x₂ ⟹ F(x₁) ≤ F(x₂) |
| ③ | 极限条件 | F(-∞) = 0, F(+∞) = 1 |
| ④ | 右连续 | F(x₀) = F(x₀+0) = lim F(x₀+h), h→0⁺ |

**充要性**：满足上述四条的函数F(x)一定是某个随机变量的分布函数。这四条是"检验函数能否成为分布函数"的标准。

---

**📐 用F(x)计算各种概率**

| 概率 | 公式 | 说明 |
|------|------|------|
| P{a < X ≤ b} | F(b) - F(a) | 最基本的公式 |
| P{X = a} | F(a) - F(a-0) | 跳跃值（左极限之差） |
| P{a ≤ X ≤ b} | F(b) - F(a-0) | 左端点取等号 |
| P{a < X < b} | F(b-0) - F(a) | 两端取严格不等号 |
| P{X > a} | 1 - F(a) | 取补事件 |

**核心提醒**：F(x)的定义是P{X≤x}，注意是"≤"不是"<"！端点是否包含取决于左极限F(a-0)。

---

**⚠️ 常见误区**

**误区1**："F(x)一定是连续函数"
- **纠正**：F(x)只保证右连续。离散型随机变量的F(x)是阶梯函数，在取值点处有跳跃间断（但右连续）

**误区2**："P{X=a}=0意味着X不取a"
- **纠正**：连续型随机变量P{X=a}=0，但X确实可以取到a。"概率为零"≠"不可能事件"

**误区3**："F(x)是概率密度"
- **纠正**：F(x)是累积概率，不是密度。f(x)=F'(x)才是密度（若存在）`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 480, end: 520, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：分布函数与概率测度的对应**

Carathéodory扩张定理保证了：满足四条性质的F(x)可以唯一确定一个概率测度P，使得F(x)=P{X≤x}。这意味着F(x)和P是一一对应的——分布函数确实是随机变量的"身份证"。

更深刻地，分布函数将概率论与测度论联系起来：F(x)本质上是由P诱导的实数轴上的一个测度（Lebesgue-Stieltjes测度），概率计算就是对这个测度的积分。这种观点统一了离散型和连续型——离散型对应纯点测度（求和），连续型对应绝对连续测度（Lebesgue积分）。`,
      extension: `**🚀 分布函数的Lebesgue分解定理**

任意分布函数可以唯一分解为：
F(x) = α₁F_d(x) + α₂F_c(x) + α₃F_s(x)

其中F_d是纯跳跃部分（离散型），F_c是绝对连续部分（连续型），F_s是奇异连续部分（如康托尔函数），α₁+α₂+α₃=1。

奇异连续分布是理论上的存在，实际应用中几乎不出现。`,
      further: [
        { id: 'f1', title: '右连续vs左连续', content: 'F(x)右连续：F(x₀)=lim F(x₀+h), h→0+\n离散型：F(x)在取值点右连续但有左极限跳跃，跳跃高度=P{X=该点}\n连续型：F(x)处处连续，无跳跃\n"右连续"保证F(x)在跳跃点取"上值"' },
        { id: 'f2', title: '如何验证一个函数是分布函数', content: '验证四条：\n① 0≤F(x)≤1 对所有x成立\n② x₁<x₂ ⟹ F(x₁)≤F(x₂)\n③ lim F(x)=0 (x→-∞), lim F(x)=1 (x→+∞)\n④ 右连续：每点x₀处lim F(x₀+h)=F(x₀) (h→0+)\n四条全满足 ⟹ 是分布函数' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '由分布函数求概率',
        description: `**问题**

设随机变量X的分布函数为：
F(x) = 0, x<0; x/3, 0≤x<1; 2/3, 1≤x<3; 1, x≥3

求：①P{X≤0.5} ②P{X=1} ③P{0.5<X<2} ④P{X≥3}

**解**

①P{X≤0.5} = F(0.5) = 0.5/3 = 1/6

②P{X=1} = F(1) - F(1-0) = 2/3 - 1/3 = 1/3（跳跃值）

③P{0.5<X<2} = F(2-0) - F(0.5) = 2/3 - 1/6 = 1/2

④P{X≥3} = 1 - F(3-0) = 1 - 2/3 = 1/3`,
        scenario: '调整分布函数的分段点，观察概率变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '验证函数是否为分布函数',
        description: `**问题**

判断F(x) = 1/(1+e^(-x))是否为某随机变量的分布函数。

**解**

逐条验证四条性质：
① 0 < 1/(1+e^(-x)) < 1 ✓（分子<分母）
② F'(x) = e^(-x)/(1+e^(-x))² > 0 ✓（单调不减）
③ F(-∞) = 0, F(+∞) = 1 ✓
④ F(x)处处可导，故连续，更右连续 ✓

结论：F(x)是分布函数（Logistic分布）`,
        scenario: '尝试不同的函数形式，验证分布函数性质。',
      },
    ],
    method: [
      { number: 1, title: '由分布律/密度求F(x)', description: `离散型：F(x) = Σ_{xₖ≤x} pₖ（将不超过x的所有概率求和）\n连续型：F(x) = ∫_{-∞}^{x} f(t)dt（对密度积分）\n关键：注意分段表示，在不同区间写出不同的表达式` },
      { number: 2, title: '由F(x)求概率', description: `P{a<X≤b} = F(b) - F(a)\nP{X=a} = F(a) - F(a-0)（左极限之差，即跳跃值）\nP{X>a} = 1 - F(a)\n注意：端点是否包含取决于F在该点的连续性` },
      { number: 3, title: '验证F(x)是否为分布函数', description: `逐条检验四条性质：\n① 0≤F(x)≤1\n② 单调不减\n③ F(-∞)=0, F(+∞)=1\n④ 右连续\n缺一不可` },
    ],
  },
}

// ---- 2.2 离散型随机变量及分布律 ----

const discreteRVPoint: KnowledgePoint = {
  id: 'discrete-rv',
  moduleId: 'probability',
  name: '离散型随机变量及分布律',
  formula: 'P\\{X = x_k\\} = p_k, \\quad k=1,2,\\cdots',
  coreSentence: '离散型随机变量取有限或可列个值——分布律（概率分布表）是它的完整描述，pk≥0且Σpk=1。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 'p0', draggable: false, color: '#C62828', label: 'p₀' },
          { id: 'p2', x: 1, y: 'p1', draggable: false, color: '#1565C0', label: 'p₁' },
          { id: 'p3', x: 2, y: 'p2', draggable: false, color: '#2E7D32', label: 'p₂' },
          { id: 'p4', x: 3, y: 'p3', draggable: false, color: '#FF6F00', label: 'p₃' },
        ],
        sliders: [
          { id: 'p0', name: 'p0', min: 0, max: 0.8, step: 0.05, defaultValue: 0.4, label: 'P{X=0}' },
          { id: 'p1', name: 'p1', min: 0, max: 0.8, step: 0.05, defaultValue: 0.3, label: 'P{X=1}' },
          { id: 'p2', name: 'p2', min: 0, max: 0.8, step: 0.05, defaultValue: 0.2, label: 'P{X=2}' },
          { id: 'p3', name: 'p3', min: 0, max: 0.8, step: 0.05, defaultValue: 0.1, label: 'P{X=3}' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '分布律变化与阶梯函数',
          type: 'step',
          steps: [
            { id: 's1', description: '概率集中于X=0：p₀=0.7', changes: { p0: 0.7, p1: 0.2, p2: 0.1, p3: 0 } },
            { id: 's2', description: '均匀分布：pₖ=0.25', changes: { p0: 0.25, p1: 0.25, p2: 0.25, p3: 0.25 } },
            { id: 's3', description: '概率集中于X=3：p₃=0.6', changes: { p0: 0.1, p1: 0.1, p2: 0.2, p3: 0.6 } },
            { id: 's4', description: '观察：F(x)是阶梯函数，跳跃高度=pₖ', changes: { p0: 0.4, p1: 0.3, p2: 0.2, p3: 0.1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：离散型用"表格"描述概率分布**

如果一个随机变量X只取有限个或可列个值，就称X为**离散型随机变量**。它的概率规律可以用一张"概率分布表"完全描述——简洁、直观、完整。

---

**📐 离散型随机变量的定义**

若随机变量X的全部可能取值只有有限个或可列无穷个（如x₁, x₂, x₃, ...），则称X为**离散型随机变量**。

**典型例子**：
- 骰子点数：X∈{1,2,3,4,5,6}
- 电话呼入次数：X∈{0,1,2,...}
- 产品合格数：X∈{0,1,...,n}

---

**📐 分布律（概率分布表）**

分布律是离散型随机变量的核心描述工具：

$$P\\{X = x_k\\} = p_k, \\quad k = 1, 2, \\cdots$$

或用表格表示：

| X | x₁ | x₂ | x₃ | ... |
|---|----|----|----|-----|
| P | p₁ | p₂ | p₃ | ... |

**两条基本性质**（也是充要条件）：
1. **非负性**：pₖ ≥ 0，对所有k
2. **归一性**：Σpₖ = 1（所有概率之和为1）

---

**📐 分布律与分布函数的关系**

**由分布律求分布函数**（"累加"）：
$$F(x) = \\sum_{x_k \\leq x} p_k$$

F(x)是**阶梯函数**，在x=xₖ处有跳跃，跳跃高度为pₖ。

**由分布函数求分布律**（"取差"）：
$$p_k = P\\{X = x_k\\} = F(x_k) - F(x_k - 0)$$

即每个取值点的概率=分布函数在该点的跳跃高度。

---

**📐 例题：由分布律求分布函数**

设X的分布律为：

| X | -1 | 0 | 2 |
|---|----|---|---|
| P | 0.2 | 0.5 | 0.3 |

则分布函数为：
$$F(x) = \\begin{cases} 0, & x < -1 \\\\ 0.2, & -1 \\leq x < 0 \\\\ 0.7, & 0 \\leq x < 2 \\\\ 1, & x \\geq 2 \\end{cases}$$

注意：F(x)在x=-1处从0跳到0.2，在x=0处从0.2跳到0.7，在x=2处从0.7跳到1。

---

**⚠️ 常见误区**

**误区1**："Σpₖ=1只要检查前几项"
- **纠正**：必须验证所有概率之和确实为1，尤其是无穷多个取值时

**误区2**："F(x)在xₖ处连续"
- **纠正**：F(x)在取值点xₖ处有跳跃，高度为pₖ。只有pₖ=0时才连续`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 650, end: 690, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：离散型是概率论最直观的起点**

离散型随机变量的分布律是概率论中最原始、最直观的描述方式——每个取值对应一个概率，一目了然。分布律与分布函数的"累加-取差"关系，本质上是离散情况下的"积分-微分"关系。

从更高观点看，分布律pₖ对应一个纯点测度（Dirac测度的线性组合），分布函数F(x)是这个测度的累积分布。离散型是理解连续型的基础——连续型的"密度×dx≈概率"正是离散型"pₖ=概率"的极限形式。`,
      extension: `**🚀 概率母函数与矩母函数**

对于取非负整数值的离散型随机变量X，定义**概率母函数**：
G(s) = E[s^X] = Σpₖs^k

性质：G(1)=1, G'(1)=E[X], G''(1)+G'(1)=E[X²]

母函数方法在分支过程（如种群繁殖模型）中有核心应用，可以避免直接求分布的复杂计算。`,
      further: [
        { id: 'f1', title: '可列无穷的例子', content: '几何分布：X取值1,2,3,...\nP{X=k} = (1-p)^(k-1)·p\n\n验证归一性：\nΣ_{k=1}^∞ (1-p)^(k-1)·p = p·1/(1-(1-p)) = p/p = 1 ✓\n\n这是可列无穷取值的典型例子，用等比级数求和验证归一性。' },
        { id: 'f2', title: '离散型与连续型的统一', content: '从测度论角度，离散型和连续型统一于Lebesgue-Stieltjes积分：\n\nP{X∈A} = ∫_A dF(x)\n\n离散型：dF(x) = Σpₖδ(x-xₖ)dx（Dirac-δ函数）\n连续型：dF(x) = f(x)dx\n\n两者统一，差别仅在测度的形式。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '产品质量等级分布',
        description: `**问题**

某工厂产品分三个等级，概率分布如下：

| 等级X | 1（优） | 2（良） | 3（合格） |
|-------|---------|---------|----------|
| P     | 0.3    | 0.5    | 0.2     |

求：①分布函数F(x) ②P{X≥2} ③P{1<X≤3}

**解**

① F(x) = 0 (x<1); 0.3 (1≤x<2); 0.8 (2≤x<3); 1 (x≥3)

② P{X≥2} = P{X=2}+P{X=3} = 0.5+0.2 = 0.7

③ P{1<X≤3} = F(3)-F(1) = 1-0.3 = 0.7`,
        scenario: '调整各等级概率，观察分布函数变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '确定分布律中的未知参数',
        description: `**问题**

设P{X=k} = c·(2/3)^k, k=1,2,3,...，求常数c。

**解**

由归一性Σpₖ=1：
c·Σ_{k=1}^∞ (2/3)^k = 1
c·(2/3)/(1-2/3) = 1（等比级数求和）
c·2 = 1
c = 1/2

验证：Σ(1/2)·(2/3)^k = (1/2)·2 = 1 ✓`,
        scenario: '尝试不同的底数，求归一化常数。',
      },
    ],
    method: [
      { number: 1, title: '确定分布律中的未知参数', description: `①利用非负性：pₖ≥0，确定参数范围\n②利用归一性：Σpₖ=1，解方程求参数\n③无穷级数时用求和公式（等比级数等）` },
      { number: 2, title: '由分布律求分布函数', description: `①将xₖ从小到大排列\n②F(x)在x<x₁时为0\n③在xₖ≤x<xₖ₊₁时，F(x)=p₁+p₂+...+pₖ\n④最后一段F(x)=1` },
    ],
  },
}

// ---- 2.3 0-1分布与二项分布 ----

const binomialDistributionPoint: KnowledgePoint = {
  id: 'binomial-distribution',
  moduleId: 'probability',
  name: '0-1分布与二项分布',
  formula: 'P\\{X = k\\} = C_n^k p^k (1-p)^{n-k}',
  coreSentence: '0-1分布是一次伯努利试验的成败，二项分布是n次独立重复试验中成功的次数——最可能值在(n+1)p附近。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'p1', x: 'n_val*p_val', y: 0, draggable: false, color: '#C62828', label: 'E[X]=np' },
          { id: 'p2', x: 'n_val', y: 0, draggable: false, color: '#2E7D32', label: 'n' },
        ],
        sliders: [
          { id: 'n_val', name: 'n_val', min: 1, max: 30, step: 1, defaultValue: 10, label: 'n 试验次数' },
          { id: 'p_val', name: 'p_val', min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.3, label: 'p 成功概率' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '二项分布PMF参数变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'B(5, 0.3)：期望=1.5，偏左', changes: { n_val: 5, p_val: 0.3 } },
            { id: 's2', description: 'B(5, 0.5)：期望=2.5，对称', changes: { n_val: 5, p_val: 0.5 } },
            { id: 's3', description: 'B(10, 0.3)：期望=3', changes: { n_val: 10, p_val: 0.3 } },
            { id: 's4', description: 'B(20, 0.3)：期望=6，趋向钟形', changes: { n_val: 20, p_val: 0.3 } },
            { id: 's5', description: 'B(20, 0.5)：期望=10，完美对称', changes: { n_val: 20, p_val: 0.5 } },
            { id: 's6', description: 'B(1, 0.4)：退化为0-1分布', changes: { n_val: 1, p_val: 0.4 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：独立重复试验的计数问题**

0-1分布是最简单的随机变量——只有两个取值：成功或失败。二项分布是n次独立重复伯努利试验中成功次数的分布，是0-1分布的"n次叠加"。

---

**📐 0-1分布（伯努利分布）B(1,p)**

若X只取0和1两个值：
$$P\\{X = k\\} = p^k (1-p)^{1-k}, \\quad k = 0, 1$$

| 特征 | 值 |
|------|-----|
| P{X=1} | p（成功概率） |
| P{X=0} | 1-p（失败概率） |
| E[X] | p |
| D[X] | p(1-p) |

0-1分布是二项分布n=1的特例，也是指示变量（某事件是否发生）的分布。

---

**📐 n重伯努利试验**

若试验满足：
1. 共进行**n次**独立试验
2. 每次试验只有两个结果：**成功**（概率p）和**失败**（概率1-p）
3. 各次试验**相互独立**

则称为**n重伯努利试验**。n次中成功的次数X服从二项分布。

---

**📐 二项分布 B(n,p)**

$$P\\{X = k\\} = C_n^k p^k (1-p)^{n-k}, \\quad k = 0, 1, \\cdots, n$$

| 特征 | 值 |
|------|-----|
| 期望 | np |
| 方差 | np(1-p) |
| 取值范围 | {0, 1, ..., n} |

**名称由来**：P{X=k}恰好是二项式[p+(1-p)]ⁿ展开的第k项。

---

**📐 二项分布的最可能值（众数）**

设k₀是使P{X=k}最大的k值，则：

| 条件 | 最可能值k₀ |
|------|-----------|
| (n+1)p不是整数 | k₀ = ⌊(n+1)p⌋ |
| (n+1)p是整数 | k₀ = (n+1)p 或 (n+1)p-1（两个最可能值） |

**例**：B(10, 0.3)，(n+1)p=11×0.3=3.3，k₀=3

---

**📐 二项分布的性质**

1. **p=0.5时对称**：P{X=k}=P{X=n-k}
2. **可加性**：X~B(n₁,p), Y~B(n₂,p)且独立，则X+Y~B(n₁+n₂,p)
3. **与0-1分布的关系**：X=X₁+X₂+...+Xₙ，其中Xᵢ~B(1,p)独立

---

**⚠️ 常见误区**

**误区1**："二项分布要求每次概率可以不同"
- **纠正**：每次的成功概率p必须相同，否则不是二项分布

**误区2**："最可能值就是期望np"
- **纠正**：最可能值是⌊(n+1)p⌋，与np接近但一般不等`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 580, end: 630, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：二项分布是"独立叠加"的典范**

二项分布的核心思想是"独立重复"——n个独立的0-1变量之和。这种"叠加"思想贯穿概率论：大数定律说叠加后平均值趋于期望，中心极限定理说叠加后标准化趋于正态。

从信息论角度，二项分布是给定期望np约束下熵最大的分布——在只知道成功概率的条件下，二项分布是对情况最"无知"（最不确定）的描述，因此也是最合理的模型。`,
      extension: `**🚀 多项分布——二项分布的推广**

若每次试验有m个结果（而非2个），概率分别为p₁,p₂,...,pₘ，则n次试验中各结果出现次数(X₁,X₂,...,Xₘ)服从**多项分布**：

P{X₁=k₁,...,Xₘ=kₘ} = n!/(k₁!k₂!...kₘ!) · p₁^k₁p₂^k₂...pₘ^kₘ

m=2时退化为二项分布。`,
      further: [
        { id: 'f1', title: '二项分布的递推公式', content: 'P{X=k+1}/P{X=k} = [(n-k)/(k+1)] · [p/(1-p)]\n\n当k<(n+1)p-1时比值>1，P递增\n当k>(n+1)p-1时比值<1，P递减\n这就是最可能值在⌊(n+1)p⌋附近的证明。' },
        { id: 'f2', title: '二项分布的正态近似', content: '当n较大时，B(n,p)≈N(np, np(1-p))\n\nDe Moivre-Laplace定理：\n(X-np)/√(np(1-p)) → N(0,1)\n\n实际使用条件：np≥5且n(1-p)≥5\n连续性修正：P{X=k} ≈ Φ((k+0.5-np)/σ) - Φ((k-0.5-np)/σ)' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '产品抽检——二项分布',
        description: `**问题**

某产品次品率10%，随机抽20件（有放回），求：
①恰好2件次品的概率
②不超过3件次品的概率
③最可能的次品数

**解**

X~B(20, 0.1)

①P{X=2} = C₂₀² × 0.1² × 0.9¹⁸ ≈ 0.285

②P{X≤3} = P(0)+P(1)+P(2)+P(3)
= 0.9²⁰ + 20×0.1×0.9¹⁹ + 190×0.01×0.9¹⁸ + 1140×0.001×0.9¹⁷
≈ 0.122 + 0.270 + 0.285 + 0.190 = 0.867

③(n+1)p = 21×0.1 = 2.1，k₀ = ⌊2.1⌋ = 2`,
        scenario: '调整次品率和抽样数，观察二项分布形态变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '网络传输可靠性',
        description: `**问题**

数据包经某网络传输，每次丢失概率0.01。发送10个数据包，求至少8个成功到达的概率。

**解**

X~B(10, 0.99)（成功到达次数）

P{X≥8} = Σ_{k=8}^{10} C₁₀ᵏ × 0.99ᵏ × 0.01^(10-k)

= C₁₀⁸×0.99⁸×0.01² + C₁₀⁹×0.99⁹×0.01 + C₁₀¹⁰×0.99¹⁰

≈ 0.0042 + 0.091 + 0.904 ≈ 0.999

即使单次有1%丢失率，10个包至少8个到达的概率≈99.9%`,
        scenario: '调整丢失率，评估传输可靠性。',
      },
    ],
    method: [
      { number: 1, title: '识别二项分布', description: `①确认"独立重复n次试验"\n②每次只有"成功/失败"两个结果\n③每次成功概率p相同\n④关注"成功次数"→X~B(n,p)` },
      { number: 2, title: '求最可能值', description: `计算(n+1)p：\n若(n+1)p非整数→k₀=⌊(n+1)p⌋\n若(n+1)p为整数→k₀=(n+1)p或(n+1)p-1` },
      { number: 3, title: '二项分布的概率计算', description: `①直接计算：代入Cₙᵏpᵏ(1-p)ⁿ⁻ᵏ\n②递推法：利用P{X=k+1}/P{X=k}=[(n-k)/(k+1)]·[p/(1-p)]\n③近似法：n大p小时用泊松近似；n大p适中时用正态近似` },
    ],
  },
}

// ---- 2.4 泊松分布与泊松定理 ----

const poissonDistributionPoint: KnowledgePoint = {
  id: 'poisson-distribution',
  moduleId: 'probability',
  name: '泊松分布与泊松定理',
  formula: 'P\\{X = k\\} = \\frac{\\lambda^k}{k!}e^{-\\lambda}',
  coreSentence: '泊松分布描述"稀有事件的计数"——泊松定理将二项分布近似为泊松分布，期望=方差=λ是其独特标志。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1', color: '#5D4037', visible: true },
        ],
        points: [
          { id: 'p1', x: 'lambda', y: 0, draggable: false, color: '#C62828', label: 'E[X]=λ' },
          { id: 'p2', x: 'lambda', y: '1/sqrt(2*3.14159*lambda)', draggable: false, color: '#1565C0', label: '峰值' },
        ],
        sliders: [
          { id: 'lambda', name: 'lambda', min: 0.5, max: 15, step: 0.5, defaultValue: 3, label: 'λ 参数' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '泊松分布PMF随λ变化',
          type: 'step',
          steps: [
            { id: 's1', description: 'λ=1：高度偏斜，众数在0和1', changes: { lambda: 1 } },
            { id: 's2', description: 'λ=3：右偏，众数在2', changes: { lambda: 3 } },
            { id: 's3', description: 'λ=5：趋向对称', changes: { lambda: 5 } },
            { id: 's4', description: 'λ=10：接近正态钟形', changes: { lambda: 10 } },
            { id: 's5', description: 'λ=15：更接近正态N(15,15)', changes: { lambda: 15 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：大量稀有事件的累计效应**

泊松分布描述的是"在大量试验中，每次发生概率极小的稀有事件，累计发生的次数"。它最初由Poisson在研究法庭判决概率时发现，如今广泛应用于排队论、保险精算、核物理等领域。

---

**📐 泊松分布 P(λ) 的定义**

$$P\\{X = k\\} = \\frac{\\lambda^k}{k!} e^{-\\lambda}, \\quad k = 0, 1, 2, \\cdots$$

其中λ > 0为参数。

| 特征 | 值 |
|------|-----|
| 期望 | λ |
| 方差 | λ |
| 最可能值 | ⌊λ⌋（λ非整数时）；λ-1或λ（λ为整数时） |

**独特标志**：E[X] = D[X] = λ——期望等于方差，这是泊松分布的特征性质。

---

**📐 泊松分布的适用场景**

泊松分布适用于描述**单位时间/空间内稀有事件的发生次数**：

| 应用领域 | X的含义 | λ的含义 |
|---------|---------|---------|
| 电话交换 | 呼入次数 | 平均呼入率×时间 |
| 核物理 | 衰变次数 | 平均衰变率×时间 |
| 保险 | 理赔次数 | 平均理赔率×时间 |
| 排队论 | 到达顾客数 | 平均到达率×时间 |
| 生态学 | 区域内物种数 | 平均密度×面积 |

---

**📐 泊松定理——二项分布的泊松近似**

**定理**：设npₙ = λ（常数），则当n→∞时：

$$C_n^k p_n^k (1-p_n)^{n-k} \\to \\frac{\\lambda^k}{k!} e^{-\\lambda}$$

**证明思路**：
$$C_n^k p^k (1-p)^{n-k} = \\frac{n!}{k!(n-k)!} \\cdot \\left(\\frac{\\lambda}{n}\\right)^k \\cdot \\left(1 - \\frac{\\lambda}{n}\\right)^{n-k}$$

当n→∞时：
- n!/(n-k)! → nᵏ
- (1-λ/n)ⁿ → e^(-λ)
- (1-λ/n)^(-k) → 1

合起来得到 λᵏ/k! · e^(-λ)。

**实际使用条件**：n≥20, p≤0.05时，B(n,p) ≈ P(np)，精度较好。

---

**📐 泊松分布的性质**

1. **可加性**：X₁~P(λ₁), X₂~P(λ₂)且独立，则X₁+X₂~P(λ₁+λ₂)
2. **条件分布**：X₁~P(λ₁), X₂~P(λ₂)独立，则X₁|X₁+X₂=n ~ B(n, λ₁/(λ₁+λ₂))
3. **众数**：当λ增大时，P(λ)趋向对称，接近正态N(λ, λ)

---

**⚠️ 常见误区**

**误区1**："泊松分布只适用于λ很小的情况"
- **纠正**：λ可以很大（如λ=100），此时泊松分布近似正态分布

**误区2**："泊松近似只要求n大"
- **纠正**：需要n大**且**p小，使得np=λ适中。若p不趋于0，则近似不成立`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 480, end: 520, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：泊松分布与泊松过程**

泊松分布的深层来源是**泊松过程**{N(t), t≥0}——一个具有独立增量和平稳增量的计数过程。N(t)表示(0,t]时间内事件发生次数，则N(t)~P(λt)。

泊松过程的三个等价定义：
1. 独立增量+平稳增量+稀有性（P{N(h)=1}/h→λ）
2. 相邻事件间隔~Exp(λ)且独立
3. N(t)~P(λt)且独立增量

"计数"服从泊松分布 ↔ "间隔"服从指数分布，这是同一随机过程的两种视角。`,
      extension: `**🚀 复合泊松分布**

若N~P(λ)，Yᵢ独立同分布，则S = Σ_{i=1}^{N} Yᵢ服从**复合泊松分布**。

应用：保险总赔付额=Σ各次赔付额，理赔次数~P(λ)，每次赔付额~F(y)。

E[S] = λ·E[Y₁], D[S] = λ·E[Y₁²]`,
      further: [
        { id: 'f1', title: '泊松定理的精确误差估计', content: '泊松近似的误差界（Le Cam定理）：\n\nΣ_{k=0}^{n} |B(n,p;k) - P(np;k)| ≤ 2np²\n\n当p≤0.05时，2np²很小，近似精度好。\n例：n=100, p=0.03, 误差界≤2×100×0.0009=0.18' },
        { id: 'f2', title: '泊松分布与χ²分布的关系', content: 'P{X≤k} = P{χ²(2k+2) > 2λ}\n\n这个关系允许用χ²分布表来查泊松分布的累积概率，\n在计算工具不发达的年代是重要的计算技巧。\n\n证明利用了Γ函数与泊松求和的积分表示。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '呼叫中心 staffing',
        description: `**问题**

某呼叫中心平均每小时接到5个电话，求：
①一小时恰好3个电话的概率
②一小时不超过2个电话的概率

**解**

X~P(5)

①P{X=3} = 5³/3! · e^(-5) = 125/6 · 0.00674 ≈ 0.1404

②P{X≤2} = e^(-5)(1 + 5 + 25/2) = 0.00674 × 18.5 ≈ 0.1247

约12.5%的时间一小时不超过2个电话——排班参考。`,
        scenario: '调整λ，观察不同强度下的概率分布。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '泊松近似二项分布',
        description: `**问题**

某书一页上印刷错误的概率为0.005，全书500页，求恰好有2页有错误的概率。

**解**

X~B(500, 0.005)，np=2.5

直接计算：C₅₀₀²×0.005²×0.995⁴⁹⁸

泊松近似：X≈P(2.5)
P{X=2} = 2.5²/2! · e^(-2.5) = 3.125 × 0.0821 ≈ 0.2565

近似精度：n=500, p=0.005，满足n≥20, p≤0.05 ✓`,
        scenario: '对比二项分布精确值与泊松近似值。',
      },
    ],
    method: [
      { number: 1, title: '泊松近似二项分布', description: `条件：n≥20, p≤0.05\n步骤：\n①计算λ=np\n②用P(λ)近似B(n,p)\n③P{X=k}≈λᵏ/k!·e^(-λ)` },
      { number: 2, title: '泊松分布概率计算', description: `①利用递推：P{X=k+1} = λ/(k+1) · P{X=k}\n②从P{X=0}=e^(-λ)出发逐项计算\n③累积概率用查表或计算器\n④λ大时用正态近似：P(λ)≈N(λ,λ)` },
    ],
  },
}

// ---- 2.5 连续型随机变量及概率密度 ----

const continuousRVPoint: KnowledgePoint = {
  id: 'continuous-rv',
  moduleId: 'probability',
  name: '连续型随机变量及概率密度',
  formula: 'f(x) \\geq 0, \\quad \\int_{-\\infty}^{+\\infty} f(x)dx = 1',
  coreSentence: '连续型随机变量用密度函数描述——单点概率为零，区间概率靠积分，密度f(x)不是概率而是"概率浓度"。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*sigma)*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
          { id: 'f2', expression: '0', color: '#1565C0', visible: false },
        ],
        points: [
          { id: 'p1', x: 'a_val', y: 0, draggable: false, color: '#2E7D32', label: 'a' },
          { id: 'p2', x: 'b_val', y: 0, draggable: false, color: '#FF6F00', label: 'b' },
        ],
        sliders: [
          { id: 'mu', name: 'mu', min: -2, max: 2, step: 0.1, defaultValue: 0, label: 'μ 密度位置' },
          { id: 'sigma', name: 'sigma', min: 0.3, max: 2, step: 0.1, defaultValue: 1, label: 'σ 密度宽度' },
          { id: 'a_val', name: 'a_val', min: -3, max: 1, step: 0.1, defaultValue: -1, label: 'a 积分下限' },
          { id: 'b_val', name: 'b_val', min: -1, max: 3, step: 0.1, defaultValue: 1, label: 'b 积分上限' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '密度函数与概率的关系',
          type: 'step',
          steps: [
            { id: 's1', description: '密度曲线：f(x)≥0，总面积=1', changes: { mu: 0, sigma: 1, a_val: -3, b_val: 3 } },
            { id: 's2', description: 'P{a<X<b}=∫ₐᵇf(x)dx（阴影面积）', changes: { mu: 0, sigma: 1, a_val: -1, b_val: 1 } },
            { id: 's3', description: 'σ增大→密度变矮变宽', changes: { mu: 0, sigma: 2, a_val: -1, b_val: 1 } },
            { id: 's4', description: 'μ右移→整体右移', changes: { mu: 1, sigma: 1, a_val: 0, b_val: 2 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：密度函数是概率的"浓度"**

连续型随机变量没有分布律（因为取值不可列），但可以用**概率密度函数**f(x)描述概率在实数轴上的"分布浓度"。概率不是某个点的f(x)值，而是f(x)在区间上的积分（面积）。

---

**📐 连续型随机变量与密度函数的定义**

若存在非负可积函数f(x)，使得对任意实数x：

$$F(x) = \\int_{-\\infty}^{x} f(t) dt$$

则称X为**连续型随机变量**，f(x)为X的**概率密度函数**。

**直观理解**：F(x)是"从-∞到x累积的概率"，f(x)是F(x)的变化率（"概率密度"），就像速度是位移的变化率。

---

**📐 密度函数的四条性质**

| 性质 | 描述 |
|------|------|
| ① 非负性 | f(x) ≥ 0 |
| ② 归一性 | ∫₋∞⁺∞ f(x)dx = 1 |
| ③ 概率公式 | P{a < X ≤ b} = ∫ₐᵇ f(x)dx |
| ④ 导数关系 | f(x) = F'(x)（在F可导处） |

**注意**：①和②是充要条件——满足这两条的f(x)一定是某个连续型随机变量的密度函数。

---

**📐 连续型随机变量的重要特征**

1. **P{X = x₀} = 0**——取任何单点的概率为零
2. 因此四种区间概率相等：
   P{a<X≤b} = P{a≤X≤b} = P{a<X<b} = P{a≤X<b}
3. **f(x)不是概率！** f(x)是概率密度，只有积分才有概率意义
4. **f(x)可以大于1**——例如均匀分布U(0,0.5)的密度f(x)=2>1

---

**📐 密度函数与分布函数的关系**

**由密度求分布函数**（"积分"）：
$$F(x) = \\int_{-\\infty}^{x} f(t) dt$$

**由分布函数求密度**（"求导"）：
$$f(x) = F'(x)$$

（在F'(x)存在的点；有限个点处F'(x)不存在不影响密度的确定）

---

**📐 例题：验证密度函数并求概率**

设f(x) = c·x², 0<x<1，求c和P{X>0.5}。

**解**：

由归一性：∫₀¹ c·x² dx = c·[x³/3]₀¹ = c/3 = 1，所以c=3。

P{X>0.5} = ∫₀.₅¹ 3x² dx = [x³]₀.₅¹ = 1 - 0.125 = 0.875

---

**⚠️ 常见误区**

**误区1**："f(x)是概率，所以f(x)≤1"
- **纠正**：f(x)是密度不是概率，可以大于1。只有∫f(x)dx=1（面积为1）

**误区2**："连续型随机变量不取单值"
- **纠正**：可以取到，只是P{X=x₀}=0。"概率为零"≠"不可能事件"

**误区3**："F(x)可导则X是连续型"
- **纠正**：还需要F'(x)非负且积分等于1。奇异型分布的F(x)也处处可导，但导数几乎处处为零`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 500, end: 550, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：密度与测度的关系**

连续型随机变量的密度函数f(x)本质上是对Lebesgue测度的Radon-Nikodym导数——概率测度P对Lebesgue测度的"密度"。积分∫ₐᵇf(x)dx就是概率测度P在[a,b]上的值。

"概率为零≠不可能"这个反直觉结论的数学根源在于：Lebesgue测度下，单点集的测度为零，但单点集不是空集。这是测度论与朴素概率直觉的根本区别。`,
      extension: `**🚀 概率密度变换的几何意义**

当Y=g(X)时，f_Y(y)=f_X(h(y))·|h'(y)|中的|h'(y)|是Jacobian因子——它补偿了变量替换带来的"面积缩放"。

直觉：概率（面积）在变量替换下不变，但"宽度"改变了，所以"高度"（密度）要相应调整。|h'(y)|就是宽度的反比因子。`,
      further: [
        { id: 'f1', title: '混合型随机变量', content: '不是所有随机变量都"纯离散"或"纯连续"。\n\n混合型例子：\nF(x) = 0.3·F_d(x) + 0.7·F_c(x)\n\n30%的概率集中在离散点上，70%按连续密度分布。\n如：保险赔付——30%的客户不索赔（X=0），70%的赔付额连续分布。' },
        { id: 'f2', title: '密度函数的确定方法', content: '求f(x)的步骤：\n①先求F(x)（通常由定义F(x)=P{X≤x}出发）\n②对F(x)求导：f(x)=F\'(x)\n③注意：在F(x)不可导的有限个点处，f(x)可取任意值\n④最终验证：f(x)≥0且∫f(x)dx=1' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '确定密度中的未知参数',
        description: `**问题**

设f(x) = c(1-x²), -1<x<1，求c和P{|X|>1/2}。

**解**

归一性：∫₋₁¹ c(1-x²)dx = c[x - x³/3]₋₁¹ = c·4/3 = 1
所以c = 3/4

P{|X|>1/2} = 1 - P{|X|≤1/2}
= 1 - ∫₋₁/₂^{1/2} (3/4)(1-x²)dx
= 1 - (3/4)[x - x³/3]₋₁/₂^{1/2}
= 1 - (3/4)·(1/2 - 1/24 - (-1/2 + 1/24))
= 1 - (3/4)·(11/12)
= 1 - 11/16 = 5/16`,
        scenario: '调整密度函数形式，观察概率变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '电阻值的概率',
        description: `**问题**

某型号电阻标称值100Ω，实际阻值X的密度f(x)=k(x-95)(105-x), 95<x<105，求阻值在98~102Ω之间的概率。

**解**

先求k：∫₉₅¹⁰⁵ k(x-95)(105-x)dx = 1
令u=x-95: ∫₀¹⁰ ku(10-u)du = k∫₀¹⁰(10u-u²)du = k[5u²-u³/3]₀¹⁰ = k·500/3 = 1
k = 3/500

P{98<X<102} = (3/500)∫₉₈¹⁰² (x-95)(105-x)dx
= (3/500)∫₃⁷ u(10-u)du = (3/500)[5u²-u³/3]₃⁷
= (3/500)(5·49-343/3-5·9+27/3)
= (3/500)(245-114.33-45+9) = (3/500)·94.67 ≈ 0.568`,
        scenario: '调整标称值和容差，观察合格率。',
      },
    ],
    method: [
      { number: 1, title: '确定密度函数中的参数', description: `①利用非负性f(x)≥0确定参数范围\n②利用归一性∫f(x)dx=1解方程求参数\n③分段函数时各段分别积分后求和` },
      { number: 2, title: '由密度求概率', description: `P{a<X<b} = ∫ₐᵇ f(x)dx\n①确定积分区间与f(x)非零区域的交集\n②分段积分\n③求F(x)时从-∞积到x` },
      { number: 3, title: '由F(x)求f(x)', description: `f(x) = F\'(x)\n①对F(x)各段分别求导\n②不可导点处f(x)取任意值（通常取0）\n③验证∫f(x)dx=1` },
    ],
  },
}

// ---- 2.6 均匀分布与指数分布 ----

const uniformExponentialPoint: KnowledgePoint = {
  id: 'uniform-exponential',
  moduleId: 'probability',
  name: '均匀分布与指数分布',
  formula: 'f(x) = \\frac{1}{b-a}, \\quad a \\leq x \\leq b',
  coreSentence: '均匀分布是"等可能"的连续版本，指数分布是"无记忆"的等待时间——两种分布各有独特性质。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(b-a)', color: '#C62828', visible: true },
          { id: 'f2', expression: 'lambda_val*exp(-lambda_val*x)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'a_val', y: 0, draggable: false, color: '#2E7D32', label: 'a' },
          { id: 'p2', x: 'b_val', y: 0, draggable: false, color: '#FF6F00', label: 'b' },
          { id: 'p3', x: '1/lambda_val', y: 'lambda_val*exp(-1)', draggable: false, color: '#7B1FA2', label: '1/λ' },
        ],
        sliders: [
          { id: 'a_val', name: 'a_val', min: 0, max: 3, step: 0.1, defaultValue: 0, label: 'a 均匀下界' },
          { id: 'b_val', name: 'b_val', min: 1, max: 6, step: 0.1, defaultValue: 3, label: 'b 均匀上界' },
          { id: 'lambda_val', name: 'lambda_val', min: 0.2, max: 3, step: 0.1, defaultValue: 1, label: 'λ 指数参数' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '均匀与指数分布对比',
          type: 'step',
          steps: [
            { id: 's1', description: 'U(0,3)：均匀分布，等可能取值', changes: { a_val: 0, b_val: 3, lambda_val: 1 } },
            { id: 's2', description: 'Exp(1)：指数分布，衰减曲线', changes: { a_val: 0, b_val: 3, lambda_val: 1 } },
            { id: 's3', description: 'U(1,5)：区间变化', changes: { a_val: 1, b_val: 5, lambda_val: 1 } },
            { id: 's4', description: 'Exp(2)：衰减更快', changes: { a_val: 0, b_val: 3, lambda_val: 2 } },
            { id: 's5', description: 'U(0,1)：密度=1，与Exp(1)对比', changes: { a_val: 0, b_val: 1, lambda_val: 1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想："等可能"与"无记忆"——两种独特的分布**

均匀分布是连续型中唯一满足"等可能"的分布——X落在[a,b]内任何等长子区间的概率相同。指数分布是连续型中唯一满足"无记忆性"的分布——"已经等待了s时间"不影响"再等t时间"的概率。

---

**📐 均匀分布 U(a,b)**

$$f(x) = \\begin{cases} \\frac{1}{b-a}, & a \\leq x \\leq b \\\\ 0, & \\text{其他} \\end{cases}$$

| 特征 | 值 |
|------|-----|
| 期望 | (a+b)/2 |
| 方差 | (b-a)²/12 |
| 分布函数 | F(x) = (x-a)/(b-a), a≤x≤b |

**"等可能"含义**：对[a,b]内任意子区间[c,d]：
$$P\\{c \\leq X \\leq d\\} = \\frac{d-c}{b-a}$$

概率只与区间**长度**成正比，与位置无关。

---

**📐 均匀分布的概率计算**

子区间[c,d]⊂[a,b]的概率：
$$P\\{c \\leq X \\leq d\\} = \\frac{d - c}{b - a}$$

**例**：X~U(0,10)，P{3<X<7} = (7-3)/(10-0) = 0.4

---

**📐 指数分布 Exp(λ)**

$$f(x) = \\begin{cases} \\lambda e^{-\\lambda x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}$$

| 特征 | 值 |
|------|-----|
| 期望 | 1/λ |
| 方差 | 1/λ² |
| 分布函数 | F(x) = 1-e^(-λx), x>0 |
| 生存函数 | P{X>x} = e^(-λx) |

**应用场景**：设备寿命、等待时间、服务时间、粒子衰变时间等。

---

**📐 指数分布的无记忆性（特征性质）**

$$P\\{X > s+t \\,|\\, X > s\\} = P\\{X > t\\}$$

**证明**：
$$P\\{X > s+t \\,|\\, X > s\\} = \\frac{P\\{X > s+t\\}}{P\\{X > s\\}} = \\frac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}} = e^{-\\lambda t} = P\\{X > t\\}$$

**直觉**："已经等了s分钟"这个信息完全被指数函数的乘法性质消去了！

**反之**：若非负连续型随机变量X满足无记忆性，则X一定服从指数分布。无记忆性是指数分布的**特征性质**。

---

**📐 两种分布的对比**

| 性质 | 均匀分布U(a,b) | 指数分布Exp(λ) |
|------|---------------|----------------|
| 取值范围 | [a,b] 有界 | (0,+∞) 无界 |
| 密度形态 | 常数（平的） | 递减（衰减） |
| 特征性质 | 等可能 | 无记忆 |
| 物理含义 | 随机取点 | 等待/寿命 |
| 与泊松关系 | — | 泊松过程的间隔 |

---

**⚠️ 常见误区**

**误区1**："均匀分布的密度一定≤1"
- **纠正**：U(0,0.5)的密度f(x)=2>1，密度可以大于1

**误区2**："指数分布无记忆意味着'新如旧'"
- **纠正**：无记忆性说的是概率规律不变，不是说设备状态不变。已运行的设备确实有磨损，但指数分布模型假设"磨损不影响失效率"——适用于"随机失效"阶段`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 650, end: 700, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：均匀分布与指数分布的深层联系**

均匀分布和指数分布看似毫无关系，但它们通过**逆变换法**紧密相连：

若U~U(0,1)，则X = -ln(U)/λ ~ Exp(λ)

这个关系是蒙特卡洛模拟的基础——先生成均匀随机数U，再通过变换得到指数分布（或任何其他分布）的随机数。从均匀到一切，这就是均匀分布在随机数生成中的"万能"地位。`,
      extension: `**🚀 伽马分布 Γ(α,λ)——指数分布的推广**

f(x) = λᵅx^(α-1)e^(-λx)/Γ(α), x>0

- α=1时退化为Exp(λ)
- α=n/2, λ=1/2时为χ²(n)分布
- 泊松过程中第α个事件到达时间~Γ(α,λ)
- α个独立Exp(λ)之和~Γ(α,λ)

伽马分布是"等待第α个事件"的时间分布。`,
      further: [
        { id: 'f1', title: '指数分布与泊松过程的对偶', content: '泊松过程N(t)~P(λt)：\n- N(t)：(0,t]内事件数——计数视角\n- T₁：第1个事件到达时间——间隔视角\n\n关系：\nN(t)=0 ⟺ T₁>t\nP{N(t)=0} = e^(-λt) = P{T₁>t}\n\nT₁~Exp(λ), T₂-T₁~Exp(λ), ...\n相邻间隔独立同分布~Exp(λ)' },
        { id: 'f2', title: 'Bathtub曲线与指数分布', content: '设备失效率函数λ(t)=f(t)/(1-F(t))\n\n指数分布：λ(t)=λ（常数失效率）\n→ 无记忆性的本质：失效率不随时间变化\n\n实际Bathtub曲线：\n- 早期：λ(t)递减（老化筛选期）\n- 中期：λ(t)≈常数（随机失效期）→指数分布适用\n- 晚期：λ(t)递增（耗损失效期）\n\n指数分布只适用于"随机失效期"。' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '设备维修决策——指数分布',
        description: `**问题**

某设备寿命X~Exp(0.01)（平均100小时），已运行80小时未故障，求再运行50小时的概率。

**解**

由无记忆性：
P{X>80+50 | X>80} = P{X>50} = e^(-0.01×50) = e^(-0.5) ≈ 0.607

**决策意义**：已运行80小时不影响后续可靠性——"预防性更换"在指数寿命模型下无意义！`,
        scenario: '调整λ和已运行时间，观察无记忆性。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '公交到站时间——均匀分布',
        description: `**问题**

公交车每15分钟一班，乘客随机到达车站，求等待时间超过10分钟的概率。

**解**

等待时间X~U(0, 15)

P{X>10} = (15-10)/15 = 5/15 = 1/3 ≈ 0.333

平均等待时间E[X] = 15/2 = 7.5分钟

**启示**：即使班车频率固定，随机到达的乘客平均也要等半个发车间隔。`,
        scenario: '调整发车间隔，观察等待时间分布。',
      },
    ],
    method: [
      { number: 1, title: '均匀分布概率计算', description: `①确认X~U(a,b)\n②P{c<X<d} = (d-c)/(b-a)（子区间长度/总长度）\n③注意：只在[c,d]⊂[a,b]时成立` },
      { number: 2, title: '指数分布概率计算', description: `①确认X~Exp(λ)\n②P{X>t} = e^(-λt)（生存函数）\n③P{s<X<t} = e^(-λs) - e^(-λt)\n④无记忆性：P{X>s+t|X>s} = P{X>t}` },
    ],
  },
}

// ---- 2.7 正态分布 ----

const normalDistributionPoint: KnowledgePoint = {
  id: 'normal-distribution',
  moduleId: 'probability',
  name: '正态分布',
  formula: 'f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
  coreSentence: '正态分布是概率论的"中心"——μ决定位置、σ决定分散，标准化变换和3σ原则是概率计算的关键。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159)*sigma)*exp(-(x-mu)^2/(2*sigma^2))', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 'mu', y: '1/(sqrt(2*3.14159)*sigma)', draggable: false, color: '#1565C0', label: '峰值' },
          { id: 'p2', x: 'mu-sigma*3', y: 0, draggable: false, color: '#2E7D32', label: 'μ-3σ' },
          { id: 'p3', x: 'mu+sigma*3', y: 0, draggable: false, color: '#FF6F00', label: 'μ+3σ' },
          { id: 'p4', x: 'mu-sigma', y: 0, draggable: false, color: '#7B1FA2', label: 'μ-σ' },
          { id: 'p5', x: 'mu+sigma', y: 0, draggable: false, color: '#7B1FA2', label: 'μ+σ' },
        ],
        sliders: [
          { id: 'mu', name: 'mu', min: -3, max: 3, step: 0.1, defaultValue: 0, label: 'μ 均值' },
          { id: 'sigma', name: 'sigma', min: 0.3, max: 3, step: 0.1, defaultValue: 1, label: 'σ 标准差' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '正态分布参数变化与3σ原则',
          type: 'step',
          steps: [
            { id: 's1', description: '标准正态N(0,1)：μ=0, σ=1', changes: { mu: 0, sigma: 1 } },
            { id: 's2', description: '1σ原则：68.26%在(μ-σ,μ+σ)内', changes: { mu: 0, sigma: 1 } },
            { id: 's3', description: '2σ原则：95.44%在(μ-2σ,μ+2σ)内', changes: { mu: 0, sigma: 1 } },
            { id: 's4', description: '3σ原则：99.74%在(μ-3σ,μ+3σ)内', changes: { mu: 0, sigma: 1 } },
            { id: 's5', description: '均值右移：μ=2, σ=1', changes: { mu: 2, sigma: 1 } },
            { id: 's6', description: '方差增大：μ=0, σ=2，更矮更宽', changes: { mu: 0, sigma: 2 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：正态分布是概率论的"中心"**

由中心极限定理，大量独立随机因素的综合效应服从正态分布——这就是"正态"（正常状态）之名的由来。它是自然界最普遍的分布：身高、成绩、测量误差、血压......几乎所有"多因素叠加"的数据都呈现钟形曲线。

---

**📐 正态分布 N(μ, σ²) 的定义**

$$f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}, \\quad -\\infty < x < +\\infty$$

**两个参数的含义**：

| 参数 | 名称 | 几何意义 |
|------|------|---------|
| μ | 均值（位置参数） | 密度曲线的对称轴位置 |
| σ | 标准差（尺度参数） | 密度曲线的"胖瘦"程度 |

- μ增大 → 整条曲线右移
- σ增大 → 曲线变矮变胖（更分散）
- σ减小 → 曲线变高变瘦（更集中）

---

**📐 标准正态分布 N(0,1)**

$$\\varphi(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{x^2}{2}}$$

$$\\Phi(x) = \\int_{-\\infty}^{x} \\varphi(t) dt$$

**标准化变换**（核心工具）：
$$X \\sim N(\\mu, \\sigma^2) \\Rightarrow Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$$

---

**📐 正态概率计算**

$$P\\{a < X < b\\} = \\Phi\\left(\\frac{b - \\mu}{\\sigma}\\right) - \\Phi\\left(\\frac{a - \\mu}{\\sigma}\\right)$$

**Φ的重要性质**：
- Φ(0) = 0.5（对称性）
- **Φ(-x) = 1 - Φ(x)**（负值查表的关键公式！）
- Φ(1.96) ≈ 0.975
- Φ(2.576) ≈ 0.995

**查表步骤**：①标准化 ②查Φ表 ③利用Φ(-x)=1-Φ(x)处理负值

---

**📐 3σ原则**

| 范围 | 概率 | 含义 |
|------|------|------|
| (μ-σ, μ+σ) | ≈ 68.26% | 约2/3的数据 |
| (μ-2σ, μ+2σ) | ≈ 95.44% | 约95%的数据 |
| (μ-3σ, μ+3σ) | ≈ 99.74% | 几乎全部数据 |

**含义**：正态分布的数据几乎全部落在μ±3σ范围内，超出3σ的概率仅0.26%——这就是质量控制中"3σ原则"的理论基础。

---

**📐 正态分布的重要性质**

1. **对称性**：f(x)关于x=μ对称，f(μ-x)=f(μ+x)
2. **最大值**：x=μ时f(x)取最大值1/(√(2π)σ)
3. **拐点**：x=μ±σ处（密度曲线由凸转凹）
4. **线性变换**：X~N(μ,σ²), aX+b~N(aμ+b, a²σ²)
5. **可加性**：X₁~N(μ₁,σ₁²), X₂~N(μ₂,σ₂²)独立，则X₁+X₂~N(μ₁+μ₂, σ₁²+σ₂²)

---

**⚠️ 常见误区**

**误区1**："Φ(-1.96)需要单独查表"
- **纠正**：Φ(-x) = 1-Φ(x)，Φ(-1.96) = 1-0.975 = 0.025

**误区2**："σ²是密度函数的参数"
- **纠正**：记号N(μ,σ²)中的σ²是方差，但密度函数中用的是σ（标准差）

**误区3**："正态分布只在μ附近有值"
- **纠正**：f(x)在(-∞,+∞)上恒正，只是远离μ时值极小但非零`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 550, end: 600, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：正态分布的历史与中心地位**

高斯在研究天文测量误差时引入正态分布，发现误差服从"钟形曲线"。Gauss-Markov定理证明：在所有无偏估计中，最小二乘估计方差最小——这正是正态分布与最优估计的深层联系。

中心极限定理揭示了正态分布的核心地位：无论个体分布如何，大量独立同分布的随机变量之"和"经标准化后趋向正态分布。这就是"正态"之名的数学含义——"正常状态"下的极限分布。`,
      extension: `**🚀 对数正态分布**

若Y=lnX~N(μ,σ²)，则X服从**对数正态分布**。

密度：f(x) = 1/(xσ√(2π)) · exp(-(ln x-μ)²/(2σ²)), x>0

应用：股票价格、收入分布、生物学中的物种丰度等正偏态数据。

特点：乘法效应（而非加法效应）产生对数正态——"比例增长"导致对数正态。`,
      further: [
        { id: 'f1', title: '正态分布与中心极限定理', content: 'Lindeberg-Lévy中心极限定理：\n设X₁,X₂,...独立同分布，E(Xᵢ)=μ, D(Xᵢ)=σ²>0\n则 (ΣXᵢ - nμ)/(σ√n) → N(0,1) (依分布)\n\n应用：\n①二项分布→正态（De Moivre-Laplace）\n②样本均值→正态（大样本推断）\n③随机游走→正态（扩散过程）\n\n这就是为什么正态分布如此普遍！' },
        { id: 'f2', title: '标准正态分布表的使用技巧', content: '常用Φ值：\nΦ(1.00)=0.8413, Φ(1.645)=0.9500\nΦ(1.96)=0.9750, Φ(2.00)=0.9772\nΦ(2.576)=0.9950, Φ(3.00)=0.9987\n\n技巧：\n①P{|X|<a}=2Φ(a)-1（对称区间）\n②P{X>a}=1-Φ(a)（右侧尾部）\n③Φ(-a)=1-Φ(a)（负值转换）\n④反查表：已知P求x，如Φ(x)=0.95→x≈1.645' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '学生成绩与分数线',
        description: `**问题**

考试成绩X~N(72, 8²)，求：
①一人成绩在60~84分的概率
②前10%的分数线

**解**

①P{60<X<84} = Φ((84-72)/8) - Φ((60-72)/8)
= Φ(1.5) - Φ(-1.5) = 2Φ(1.5)-1
= 2×0.9332-1 = 0.8664

②P{X>x} = 0.1 ⟹ Φ((x-72)/8) = 0.9 ⟹ (x-72)/8 ≈ 1.28 ⟹ x ≈ 82.24

前10%分数线约为82分。`,
        scenario: '调整均值和标准差，观察成绩分布和分数线变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '质量控制3σ原则',
        description: `**问题**

某零件直径规格50±0.5mm，实际加工直径X~N(50, 0.15²)，求不合格率。

**解**

合格范围[49.5, 50.5]

P{合格} = Φ((50.5-50)/0.15) - Φ((49.5-50)/0.15)
= Φ(3.33) - Φ(-3.33) = 2Φ(3.33)-1
≈ 2×0.9996-1 = 0.9992

不合格率 ≈ 0.08%

**3σ检验**：σ=0.15, 3σ=0.45<0.5（容差），所以几乎全部合格 ✓`,
        scenario: '调整σ和容差，评估质量控制效果。',
      },
    ],
    method: [
      { number: 1, title: '标准化变换', description: `X~N(μ,σ²)→Z=(X-μ)/σ~N(0,1)\n步骤：\n①写出原事件的概率\n②用Z=(X-μ)/σ替换\n③转化为Φ函数查表` },
      { number: 2, title: '查Φ表与性质运用', description: `P{a<X<b}=Φ((b-μ)/σ)-Φ((a-μ)/σ)\n①正值直接查表\n②负值用Φ(-x)=1-Φ(x)转换\n③对称区间：P{|X-μ|<aσ}=2Φ(a)-1` },
      { number: 3, title: '反查表求分位数', description: `已知P{X>x}=α，求x：\n①Φ((x-μ)/σ)=1-α\n②查表得Φ(z)=1-α对应的z\n③x=μ+σz\n常用：z₀.₀₅=1.645, z₀.₀₂₅=1.96` },
    ],
  },
}

// ---- 2.8 随机变量函数的分布 ----

const rvFunctionPoint: KnowledgePoint = {
  id: 'rv-function',
  moduleId: 'probability',
  name: '随机变量函数的分布',
  formula: 'f_Y(y) = f_X(h(y)) \\cdot |h\'(y)|',
  coreSentence: '求函数分布有两种武器——公式法用于单调可导函数（直接套公式），分布函数法是万能方法（先求F_Y再求导）。',
  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1/(sqrt(2*3.14159))*exp(-x^2/2)', color: '#C62828', visible: true },
          { id: 'f2', expression: '1/(sqrt(2*3.14159)*sqrt(abs(y)))*exp(-y/2)/2', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 0, y: 0.399, draggable: false, color: '#2E7D32', label: 'X密度峰值' },
          { id: 'p2', x: 1, y: 0.242, draggable: false, color: '#FF6F00', label: 'Y=X²密度' },
        ],
        sliders: [
          { id: 'a_val', name: 'a_val', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: '变换系数a' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: 'X→Y=g(X)的密度变换',
          type: 'step',
          steps: [
            { id: 's1', description: 'X~N(0,1)的标准正态密度', changes: { a_val: 1 } },
            { id: 's2', description: 'Y=X²的密度（χ²(1)分布）', changes: { a_val: 1 } },
            { id: 's3', description: 'Y=aX+b的密度变换（线性）', changes: { a_val: 2 } },
            { id: 's4', description: '公式法：g单调可导时直接套公式', changes: { a_val: 1 } },
          ],
        },
      ],
    },
    explanation: {
      mainText: `**🎯 核心思想：两种武器求函数分布**

已知X的分布，求Y=g(X)的分布——这是概率论中的基本运算。有两种方法：
- **公式法**（快）：g单调可导时，直接套公式
- **分布函数法**（万能）：先求F_Y(y)=P{Y≤y}，再求导得f_Y(y)

---

**📐 离散型：映射合并概率**

若X的分布律为P{X=xₖ}=pₖ，Y=g(X)，则：

$$P\\{Y = y_j\\} = \\sum_{g(x_k) = y_j} p_k$$

**核心**：将映射到同一y值的x的概率合并。

**例**：X分布律为P{-1}=0.2, P{0}=0.3, P{1}=0.5，求Y=X²的分布律。

- Y=0：X=0 → P=0.3
- Y=1：X=-1或X=1 → P=0.2+0.5=0.7

| Y | 0 | 1 |
|---|---|---|
| P | 0.3 | 0.7 |

---

**📐 连续型：公式法（g单调可导）**

若y=g(x)单调可导，反函数为x=h(y)，则：

$$f_Y(y) = f_X(h(y)) \\cdot |h'(y)|$$

**理解**：|h'(y)|是变量替换的"面积补偿因子"——保证概率（面积）在变换下不变。

**公式法的步骤**：
1. 求反函数x=h(y)
2. 求导h'(y)
3. 确定y的取值范围(α,β)
4. 代入公式：f_Y(y)=f_X(h(y))·|h'(y)|, α<y<β

---

**📐 连续型：分布函数法（万能方法）**

**步骤**：
1. 写出F_Y(y) = P{Y≤y} = P{g(X)≤y}
2. 解不等式g(X)≤y，转为X的取值范围
3. 用F_X或f_X的积分表示F_Y(y)
4. 求导：f_Y(y) = F'_Y(y)
5. 确定y的取值范围

**分布函数法的优势**：不要求g单调，适用于Y=X², Y=|X|等非单调函数。

---

**📐 典型例题**

**例1**：X~N(0,1)，求Y=X²的密度（公式法不直接适用，用分布函数法）

F_Y(y) = P{X²≤y} = P{-√y≤X≤√y} = Φ(√y)-Φ(-√y) = 2Φ(√y)-1

f_Y(y) = F'_Y(y) = 2φ(√y)·1/(2√y) = 1/√(2πy)·e^(-y/2), y>0

这是**χ²(1)分布**的密度。

**例2**：X~U(0,1)，求Y=-2lnX的密度

y=-2lnx → x=e^(-y/2)=h(y), h'(y)=-1/2·e^(-y/2)

f_Y(y) = f_X(e^(-y/2))·|-1/2·e^(-y/2)| = 1·(1/2)·e^(-y/2) = (1/2)e^(-y/2), y>0

Y~Exp(1/2)（指数分布）

---

**📐 两种方法的选择**

| 情况 | 方法 | 理由 |
|------|------|------|
| g单调可导 | 公式法 | 直接、快速 |
| g非单调 | 分布函数法 | 万能、可靠 |
| 离散型 | 映射合并 | 本质方法 |
| g分段单调 | 分段用公式法 | 每段单调部分分别处理 |

---

**⚠️ 常见误区**

**误区1**："f_Y(y)=f_X(y)·|g'(y)|"
- **纠正**：公式中是反函数h(y)和h'(y)，不是g和g'！f_Y(y)=f_X(h(y))·|h'(y)|

**误区2**："公式法要求g(x)全局单调"
- **纠正**：g(x)可以分段单调，如Y=X²在(-∞,0)递减、(0,+∞)递增，可分段处理

**误区3**："忘记确定y的取值范围"
- **纠正**：f_Y(y)只在y∈(α,β)时非零，范围由g(xₖ)和X的定义域决定`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 200, end: 240, type: 'formula' },
        { start: 650, end: 700, type: 'emphasis' },
      ],
    },
    extension: {
      essence: `**🔮 核心内涵：变量替换的几何本质**

公式法中|h'(y)|的几何意义是"Jacobian因子"——在变量替换y=g(x)下，x轴上的微元dx变成了y轴上的微元dy=|g'(x)|dx，为了保持概率（面积）不变，密度必须乘以补偿因子1/|g'(x)|=|h'(y)|。

这个思想在高维情形中推广为Jacobian行列式：多维变量替换时，密度乘以Jacobian的绝对值。这是概率论与微积分深刻联系的体现——"概率守恒"在变量替换下的表现。`,
      extension: `**🚀 多维随机变量函数的分布**

若(X₁,X₂)有联合密度f(x₁,x₂)，求Y=g(X₁,X₂)的密度：

**方法1：分布函数法**
F_Y(y) = P{g(X₁,X₂)≤y}，在(x₁,x₂)平面上对联合密度积分

**方法2：变量替换法**
引入辅助变量Z=ψ(X₁,X₂)，用Jacobian行列式求联合密度f(y,z)，再对z积分得边缘密度f_Y(y)

**典型应用**：X₁+X₂的分布（卷积公式）、X₁/X₂的分布（商的分布）`,
      further: [
        { id: 'f1', title: '正态分布的线性变换', content: 'X~N(μ,σ²), Y=aX+b (a≠0)\n\n方法1（公式法）：\nh(y)=(y-b)/a, h\'(y)=1/a\nf_Y(y) = (1/|a|)·f_X((y-b)/a)\n= N(aμ+b, a²σ²)的密度\n\n方法2（性质）：\nE[Y]=aμ+b, D[Y]=a²σ²\n正态的线性变换仍为正态\n→Y~N(aμ+b, a²σ²)' },
        { id: 'f2', title: '分段单调函数的处理', content: 'Y=X²的情况：\nF_Y(y) = P{X²≤y}\n= P{-√y≤X≤√y}\n= F_X(√y) - F_X(-√y)\n\n求导：\nf_Y(y) = f_X(√y)·1/(2√y) + f_X(-√y)·1/(2√y)\n= [f_X(√y) + f_X(-√y)] / (2√y)\n\n一般公式（g分段单调）：\nf_Y(y) = Σ f_X(hᵢ(y))·|hᵢ\'(y)|\n对所有反函数分支hᵢ求和' },
      ],
    },
    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '对数变换Y=ln X',
        description: `**问题**

X~Exp(1)（指数分布），求Y=ln X的密度。

**解**

y=lnx单调递增，反函数x=eʸ=h(y)
h'(y)=eʸ

f_Y(y) = f_X(eʸ)·eʸ = e^(-eʸ)·eʸ = e^(y-eʸ), -∞<y<+∞

这是**Gumbel分布**（极值分布的一种），在极端值理论中有重要应用——描述"最大值的极限分布"。`,
        scenario: '调整X的分布参数，观察Y=lnX的密度变化。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '圆面积Y=πX²',
        description: `**问题**

圆的半径X~U(0,1)，求圆面积Y=πX²的密度。

**解**

y=πx²在(0,1)上单调递增
反函数：x=√(y/π)=h(y)
h'(y)=1/(2√(πy))

X的密度：f_X(x)=1, 0<x<1

f_Y(y) = f_X(√(y/π))·1/(2√(πy))
= 1/(2√(πy)), 0<y<π

验证：∫₀^π 1/(2√(πy)) dy = [√(y/π)]₀^π = 1 ✓

**直觉**：半径均匀分布时，面积在0附近概率密度最大（小的面积段对应更长的半径段）。`,
        scenario: '调整半径分布，观察面积分布变化。',
      },
    ],
    method: [
      { number: 1, title: 'g单调→公式法', description: `①求反函数x=h(y)\n②求导h'(y)\n③确定y的取值范围(α,β)\n④f_Y(y) = f_X(h(y))·|h'(y)|, α<y<β\n⑤验证：∫f_Y(y)dy=1` },
      { number: 2, title: 'g非单调→分布函数法', description: `①F_Y(y) = P{g(X)≤y}\n②解不等式g(X)≤y，转为X的范围\n③用F_X或∫f_X表示F_Y(y)\n④求导f_Y(y) = F'_Y(y)\n⑤注意分段处理，确定y的取值范围` },
      { number: 3, title: '离散型→映射合并法', description: `①列出X的分布律\n②计算每个yₖ=g(xₖ)\n③相同y值的概率合并：P{Y=y}=Σ_{g(x)=y}P{X=x}\n④写出Y的分布律` },
    ],
  },
}

export {
  distributionFunctionPoint,
  discreteRVPoint,
  binomialDistributionPoint,
  poissonDistributionPoint,
  continuousRVPoint,
  uniformExponentialPoint,
  normalDistributionPoint,
  rvFunctionPoint,
}
