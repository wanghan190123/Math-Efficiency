import { KnowledgePoint } from '@/types'

// ==================== 第三章 二维随机变量及其分布 ====================

const jointDistributionPoint: KnowledgePoint = {
  id: 'joint-distribution',
  moduleId: 'probability',
  name: '二维随机变量与联合分布函数',
  formula: 'F(x,y) = P\\{X \\leq x, Y \\leq y\\}',
  coreSentence: '联合分布函数F(x,y)同时锁定两个随机变量的概率信息——它是从"单变量"走向"多变量"的关键一步。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '1 - exp(-x - y)', color: '#D4A574', visible: true },
        ],
        points: [
          { id: 'p1', x: 'x_val', y: 'y_val', draggable: true, color: '#C62828', label: '(x,y)' },
          { id: 'p2', x: 'x_val', y: 0, draggable: false, color: '#1565C0', label: 'x' },
          { id: 'p3', x: 0, y: 'y_val', draggable: false, color: '#2E7D32', label: 'y' },
        ],
        sliders: [
          { id: 'x_val', name: 'x_val', min: 0, max: 5, step: 0.1, defaultValue: 1, label: 'x 值' },
          { id: 'y_val', name: 'y_val', min: 0, max: 5, step: 0.1, defaultValue: 1, label: 'y 值' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '联合分布函数几何意义',
          type: 'step',
          steps: [
            { id: 's1', description: '初始：F(x,y) 表示点(X,Y)落在矩形(-∞,x]×(-∞,y]内的概率', changes: { x_val: 1, y_val: 1 } },
            { id: 's2', description: '增大x：矩形右边界右移，概率增大', changes: { x_val: 2, y_val: 1 } },
            { id: 's3', description: '增大y：矩形上边界上移，概率增大', changes: { x_val: 2, y_val: 3 } },
            { id: 's4', description: 'x,y同时增大：区域扩大，F(x,y)趋近于1', changes: { x_val: 5, y_val: 5 } },
            { id: 's5', description: 'x→-∞或y→-∞：区域消失，F(x,y)→0', changes: { x_val: 0.01, y_val: 0.01 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：从"单打独斗"到"联合作战"**

第一章我们研究了一个随机变量的概率规律，但现实世界中，很多随机现象需要**同时关注两个甚至多个量**。比如：射击时关注弹着点的横纵坐标、体检时同时看身高和体重、分析股票时同时考虑收益率和风险。

**二维随机变量**就是将两个随机变量作为一个整体来研究它们的联合概率规律。

---

**📐 二维随机变量的定义**

设E是一个随机试验，样本空间Ω={ω}，X=X(ω)和Y=Y(ω)是定义在Ω上的两个随机变量，则称向量**(X,Y)**为**二维随机变量**（或二维随机向量）。

**直观理解**：每次试验的结果ω，对应平面上的一个点(X(ω), Y(ω))。我们关心的不再是"X取某个值"或"Y取某个值"的概率，而是"(X,Y)落在平面上某个区域"的概率。

---

**📐 联合分布函数的定义**

对任意实数x, y，称
$$F(x,y) = P\\{X \\leq x, Y \\leq y\\}$$
为二维随机变量(X,Y)的**联合分布函数**。

**几何意义**：F(x,y)表示随机点(X,Y)落在以(x,y)为右上顶点的**左下无穷矩形区域**内的概率，即落在区域{(-∞,x]×(-∞,y]}内的概率。

---

**📐 联合分布函数的四条性质**

**性质1（单调性）**：F(x,y)关于x和y都**单调不减**——x或y增大时，矩形区域只会扩大不会缩小，概率只会增大。

**性质2（有界性）**：
- $0 \\leq F(x,y) \\leq 1$
- $F(-\\infty, y) = 0$，$F(x, -\\infty) = 0$
- $F(+\\infty, +\\infty) = 1$

**性质3（右连续性）**：F(x,y)关于x和y都**右连续**，即
$$F(x^+, y) = F(x, y), \\quad F(x, y^+) = F(x, y)$$

**性质4（矩形不等式）**：对任意 $x_1 < x_2$，$y_1 < y_2$，
$$P\\{x_1 < X \\leq x_2, y_1 < Y \\leq y_2\\} = F(x_2, y_2) - F(x_1, y_2) - F(x_2, y_1) + F(x_1, y_1) \\geq 0$$

这四条性质与一维分布函数的三条性质相呼应，但**性质4是二维特有的**——它保证了概率的非负性，是判断一个二元函数能否作为分布函数的必要条件。

---

**📐 二维随机变量的分类**

| 类型 | 定义方式 | 典型例子 |
|------|---------|---------|
| 二维离散型 | 取有限或可列无限个值 | 掷两枚骰子的点数(X₁,X₂) |
| 二维连续型 | 存在联合概率密度f(x,y) | 弹着点坐标(X,Y)服从正态分布 |

---

**⚠️ 常见误区**

**误区1**："F(x,y) = F_X(x)·F_Y(y)总是成立"
- **纠正**：只有X和Y独立时才成立！一般情况下F(x,y)包含了X和Y之间的关联信息

**误区2**："性质4是多余的"
- **纠正**：满足前三个性质但违反性质4的反例确实存在，性质4不可省略

**误区3**："联合分布函数唯一决定两个边缘分布，反之亦然"
- **纠正**：联合→边缘可以，边缘→联合不行！不同的联合分布可以有相同的边缘分布`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
        { start: 180, end: 220, type: 'definition' },
        { start: 310, end: 360, type: 'formula' },
      ],
    },

    extension: {
      essence: `**🔮 核心内涵：联合 vs 边缘——整体大于部分之和**

联合分布函数是研究二维随机变量的**总入口**。它不仅包含了X和Y各自的概率信息（通过边缘分布），更重要的是包含了X和Y之间**关联关系**的信息。

这种"1+1>2"的结构是概率论最深刻的洞见之一：两个随机变量的联合行为不能仅从各自的单独行为推出。就像了解两个人的性格不等于了解他们互动的模式。

联合分布函数的四条性质中，前三条是一维性质的二维推广，而**性质4（矩形不等式）是二维独有的约束**，它保证了概率测度的非负性。反过来，满足这四条性质的二元函数是否一定能成为某个二维随机变量的分布函数？答案是肯定的——这是概率论中**存在性定理**的保证。

从认识论角度看，从一维到二维的跨越不仅仅是"多了一个变量"那么简单。二维情形引入了"关联"这个全新维度，直接催生了后续的条件分布、独立性等核心概念。`,
      extension: `**🚀 从二维到n维**

将二维推广到n维随机变量(X₁,X₂,...,Xₙ)：
$$F(x_1,...,x_n) = P\\{X_1 \\leq x_1, ..., X_n \\leq x_n\\}$$

n维联合分布函数有类似的单调性、有界性、右连续性和多维矩形不等式。这就是**随机向量**理论——现代统计学、机器学习、金融工程都建立在多维随机变量的联合分析上。`,
      further: [
        { id: 'f1', title: '联合分布函数的构造', content: '如何从零构造一个合法的联合分布函数？需要验证四条性质。常见的构造方法有：(1)离散型用分布律表定义后求和得到F(x,y)；(2)连续型用密度函数积分得到F(x,y)；(3)已知边缘分布+相关结构（如Copula函数）联合构造。' },
        { id: 'f2', title: 'Copula函数——联合分布的"粘合剂"', content: 'Sklar定理指出：任何联合分布函数F(x,y)都可分解为边缘分布和一个Copula函数C：F(x,y)=C(F_X(x),F_Y(y))。Copula函数专门刻画变量间的相依结构，独立时C(u,v)=uv。Copula理论是现代金融风险管理的核心工具。' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'real',
        title: '弹着点分析——射击精度的联合刻画',
        description: `**问题背景**

火炮射击时，弹着点的横纵坐标(X,Y)构成二维随机变量。仅知道X和Y各自的分布无法刻画"弹着点是否偏向某个方向"等关联信息。

**解**

设(X,Y)的联合分布函数为F(x,y)，则：
- 弹着点落在目标圆盘 $x^2+y^2 \\leq r^2$ 内的概率：
$$P\\{X^2+Y^2 \\leq r^2\\} = \\iint_{x^2+y^2 \\leq r^2} f(x,y) dxdy$$

若X,Y独立且均服从N(0,σ²)，则弹着点服从**二维正态分布**，弹着点关于原点对称散布。

**意义**：联合分布能刻画弹着点的散布形状，而边缘分布只能刻画单方向的散布范围。`,
        scenario: '调整σ值，观察弹着点散布圆的变化。当X,Y不独立时，散布呈椭圆而非圆形。',
      },
      {
        id: 'app2',
        type: 'example',
        title: '验证二元函数能否作为联合分布函数',
        description: `**问题**

判断 $F(x,y) = \\begin{cases} 1, & x+y \\geq 1 \\\\ 0, & x+y < 1 \\end{cases}$ 是否为联合分布函数。

**解**

逐条验证四条性质：

(1) 单调性：当x+y≥1时F=1，否则F=0。但x增大时F可能从0跳到1，单调不减 ✓

(2) 有界性：$F(-\\infty,y)=0$ ✓，$F(+\\infty,+\\infty)=1$ ✓

(3) 右连续性：在x+y=1处，从右侧看F=1=F(1,y)，右连续 ✓

(4) **矩形不等式**：取 $x_1=0, x_2=1, y_1=0, y_2=1$：
$$F(1,1)-F(0,1)-F(1,0)+F(0,0) = 1-1-1+0 = -1 < 0$$ ❌

**结论**：不满足性质4，不能作为联合分布函数！`,
        scenario: '拖动(x,y)点观察F(x,y)值，验证性质4失效的区域。',
      },
    ],

    method: [
      { number: 1, title: '逐条验证四性质', description: `判断二元函数G(x,y)能否作为联合分布函数：\n①单调不减：固定一个变量，对另一个变量单调不减\n②有界性：G(-∞,y)=0, G(x,-∞)=0, G(+∞,+∞)=1\n③右连续：对每个变量都右连续\n④矩形不等式：取矩形区域验证概率非负\n\n**特别注意性质4**——前三条都满足但第四条不满足的例子存在！` },
      { number: 2, title: '联合分布函数求概率', description: `用F(x,y)计算(X,Y)落在矩形区域的概率：\n$$P\\{x_1<X\\leq x_2, y_1<Y\\leq y_2\\} = F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)+F(x_1,y_1)$$\n记忆口诀："正-负-负+正"，类比容斥原理。\n非矩形区域需用密度函数积分。` },
    ],
  },
}

const twoDimDiscretePoint: KnowledgePoint = {
  id: 'two-dim-discrete',
  moduleId: 'probability',
  name: '二维离散型随机变量',
  formula: 'P\\{X=x_i, Y=y_j\\} = p_{ij}',
  coreSentence: '联合分布律是离散型二维变量的概率全貌——一张表格锁定所有信息，pij≥0且全部求和等于1。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '0', color: '#5D4037', visible: false },
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#C62828', label: 'p₀₀=0.1' },
          { id: 'p2', x: 1, y: 0, draggable: false, color: '#C62828', label: 'p₁₀=0.3' },
          { id: 'p3', x: 0, y: 1, draggable: false, color: '#1565C0', label: 'p₀₁=0.2' },
          { id: 'p4', x: 1, y: 1, draggable: false, color: '#1565C0', label: 'p₁₁=0.4' },
        ],
        sliders: [
          { id: 'p00', name: 'p00', min: 0, max: 0.5, step: 0.01, defaultValue: 0.1, label: 'p₀₀' },
          { id: 'p10', name: 'p10', min: 0, max: 0.5, step: 0.01, defaultValue: 0.3, label: 'p₁₀' },
          { id: 'p01', name: 'p01', min: 0, max: 0.5, step: 0.01, defaultValue: 0.2, label: 'p₀₁' },
          { id: 'p11', name: 'p11', min: 0, max: 0.5, step: 0.01, defaultValue: 0.4, label: 'p₁₁' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '联合分布律构造',
          type: 'step',
          steps: [
            { id: 's1', description: '初始分布律：p₀₀=0.1, p₁₀=0.3, p₀₁=0.2, p₁₁=0.4，总和=1 ✓', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's2', description: '验证性质1：每个pij≥0 ✓', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's3', description: '验证性质2：ΣΣpij=0.1+0.3+0.2+0.4=1 ✓', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's4', description: '调大p₁₁=0.5：总和=1.1 > 1，不合法！', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.5 } },
            { id: 's5', description: '修正：减小p₀₀=0.0，总和=1.0，恢复合法', changes: { p00: 0, p10: 0.3, p01: 0.2, p11: 0.5 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：概率信息的"电子表格"**

如果说一维离散型随机变量的分布律是"一列数据"，那么二维离散型的联合分布律就是一张"二维表格"——行代表Y的取值，列代表X的取值，每个格子里填的就是联合概率pij。

---

**📐 联合分布律的定义**

设(X,Y)的所有可能取值为 $(x_i, y_j)$，$i,j=1,2,...$，则称
$$P\\{X=x_i, Y=y_j\\} = p_{ij}, \\quad i,j=1,2,...$$
为(X,Y)的**联合分布律**（或联合概率分布）。

常用**联合概率分布表**表示：

| X\\Y | y₁ | y₂ | ... | yⱼ | ... |
|------|----|----|-----|----|-----|
| x₁ | p₁₁ | p₁₂ | ... | p₁ⱼ | ... |
| x₂ | p₂₁ | p₂₂ | ... | p₂ⱼ | ... |
| ... | ... | ... | ... | ... | ... |
| xᵢ | pᵢ₁ | pᵢ₂ | ... | pᵢⱼ | ... |

---

**📐 联合分布律的两条性质**

**性质1（非负性）**：$p_{ij} \\geq 0$，对所有i, j

**性质2（规范性）**：$\\sum_{i=1}^{\\infty}\\sum_{j=1}^{\\infty} p_{ij} = 1$

这两条性质是判断一组数能否构成合法联合分布律的**充要条件**。

---

**📐 经典例题：求联合分布律**

**例**：袋中有2白球3黑球，不放回取两次。X=第1次取到白球数(0或1)，Y=第2次取到白球数(0或1)。求(X,Y)的联合分布律。

**解**：

$P\\{X=0, Y=0\\} = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20}$

$P\\{X=0, Y=1\\} = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20}$

$P\\{X=1, Y=0\\} = \\frac{2}{5} \\times \\frac{3}{4} = \\frac{6}{20}$

$P\\{X=1, Y=1\\} = \\frac{2}{5} \\times \\frac{1}{4} = \\frac{2}{20}$

联合分布律表：

| X\\Y | 0 | 1 |
|------|---|---|
| 0 | 6/20 | 6/20 |
| 1 | 6/20 | 2/20 |

验证：$6/20+6/20+6/20+2/20 = 20/20 = 1$ ✓

---

**📐 由联合分布律求联合分布函数**

$$F(x,y) = \\sum_{x_i \\leq x}\\sum_{y_j \\leq y} p_{ij}$$

即把联合分布律表中，满足 $x_i \\leq x$ 且 $y_j \\leq y$ 的所有pij加起来。

---

**⚠️ 常见误区**

**误区1**："联合分布律就是两个一维分布律的简单组合"
- **纠正**：联合分布律还包含了X与Y之间的关联信息！$p_{ij} \\neq P\\{X=x_i\\} \\cdot P\\{Y=y_j\\}$（除非独立）

**误区2**："分布律表中每行每列之和必须等于1"
- **纠正**：只有**全部元素之和**等于1，每行/列之和等于的是**边缘分布**的概率值`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
        { start: 150, end: 200, type: 'formula' },
        { start: 400, end: 450, type: 'emphasis' },
      ],
    },

    extension: {
      essence: `**🔮 核心内涵：联合分布律——离散型二维变量的"基因密码"**

联合分布律是离散型二维随机变量最本质的刻画方式。它不仅决定了联合分布函数（通过求和），还决定了边缘分布、条件分布、协方差等所有重要的概率特征。可以说，一张联合分布律表包含了(X,Y)的全部信息。

从信息论角度看，联合分布律给出的信息量等于X的信息量+Y的信息量-X与Y之间的互信息。当X和Y独立时，联合分布律可以被"分解"为两个边缘分布律的乘积，信息没有冗余；当X和Y有关联时，联合分布律"编码"了这种关联。

在实际计算中，求联合分布律的关键是**正确理解随机试验的机制**——特别是区分"有放回"与"无放回"，区分"有序"与"无序"。不同的机制会导致截然不同的联合分布律。`,
      extension: `**🚀 多维离散型随机变量**

推广到n维离散型：$(X_1,...,X_n)$的联合分布律为
$$P\\{X_1=x_{i_1}, ..., X_n=x_{i_n}\\} = p_{i_1...i_n}$$

同样要求非负性和规范性。高维联合分布律表的维度随变量个数指数增长，这就是"维数灾难"在概率论中的体现。`,
      further: [
        { id: 'f1', title: '有放回 vs 无放回的联合分布律对比', content: '同样从2白3黑的袋中取两次，有放回时：p₀₀=(3/5)²=9/25, p₀₁=6/25, p₁₀=6/25, p₁₁=(2/5)²=4/25。无放回时如正文中计算。关键区别：有放回时pij = pi·×p·j（独立），无放回时不独立。' },
        { id: 'f2', title: '多项分布——二维离散分布的推广', content: '多项分布是二项分布的多维推广。n次独立试验，每次结果有k种可能（概率分别为p₁,...,pₖ），则(X₁,...,Xₖ)服从多项分布M(n,p₁,...,pₖ)：P{X₁=x₁,...,Xₖ=xₖ}=n!/(x₁!...xₖ!)·p₁^{x₁}...pₖ^{xₖ}。当k=2时退化为二项分布。' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '不放回抽样的联合分布律',
        description: `**问题**

箱中有3件正品2件次品，不放回抽取2件。X=第1件中正品数，Y=第2件中正品数。求联合分布律。

**解**

$P\\{X=0,Y=0\\} = \\frac{2}{5} \\times \\frac{1}{4} = \\frac{2}{20} = 0.1$

$P\\{X=0,Y=1\\} = \\frac{2}{5} \\times \\frac{3}{4} = \\frac{6}{20} = 0.3$

$P\\{X=1,Y=0\\} = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = 0.3$

$P\\{X=1,Y=1\\} = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = 0.3$

验证：0.1+0.3+0.3+0.3=1 ✓`,
        scenario: '调整正品和次品数量，观察联合分布律的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '质量检测——两道工序的联合分析',
        description: `**问题背景**

产品经过两道工序加工。X=第1道工序后合格(1)或不合格(0)，Y=第2道工序后合格(1)或不合格(0)。已知联合分布律：

| X\\Y | 0 | 1 |
|------|---|---|
| 0 | 0.15 | 0.05 |
| 1 | 0.10 | 0.70 |

**分析**

- 产品最终合格的概率：$P\\{X=1,Y=1\\}=0.70$
- 第1道合格但第2道不合格：$P\\{X=1,Y=0\\}=0.10$，第2道工序不良率=0.10/0.80=12.5%
- 两道都不合格：$P\\{X=0,Y=0\\}=0.15$

这比单独看每道工序的合格率(0.80和0.75)更深入地揭示了生产问题。`,
        scenario: '调整各概率值，观察两道工序的关联如何影响最终产品质量。',
      },
    ],

    method: [
      { number: 1, title: '乘法公式法求pij', description: `步骤：\n①分析随机试验机制（有/无放回、有序/无序）\n②用乘法公式：$p_{ij}=P\\{X=x_i\\} \\cdot P\\{Y=y_j|X=x_i\\}$\n③逐个计算每个格子的概率\n④验证非负性和规范性（ΣΣpij=1）\n\n**关键**：先固定一个变量，再求条件概率。` },
      { number: 2, title: '古典概型法求pij', description: `当样本点等可能时：\n①列出所有样本点（画树形图辅助）\n②对每个(xᵢ,yⱼ)，计算有利样本点数m\n③pij = m/n\n④填表并验证ΣΣpij=1\n\n**注意**：区分"有序"和"无序"抽样对样本空间的影响。` },
    ],
  },
}

const twoDimContinuousPoint: KnowledgePoint = {
  id: 'two-dim-continuous',
  moduleId: 'probability',
  name: '二维连续型随机变量',
  formula: 'f(x,y) \\geq 0, \\quad \\int_{-\\infty}^{+\\infty}\\int_{-\\infty}^{+\\infty} f(x,y)dxdy = 1',
  coreSentence: '联合概率密度f(x,y)是连续型二维变量的"概率高度场"——曲面下的总体积等于1，区域内的体积就是概率。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'exp(-(x^2+y^2)/2)/(2*pi)', color: '#D4A574', visible: true },
        ],
        points: [
          { id: 'p1', x: 'x_val', y: 'y_val', draggable: true, color: '#C62828', label: '(x,y)' },
        ],
        sliders: [
          { id: 'x_val', name: 'x_val', min: -3, max: 3, step: 0.1, defaultValue: 0, label: 'x 值' },
          { id: 'y_val', name: 'y_val', min: -3, max: 3, step: 0.1, defaultValue: 0, label: 'y 值' },
          { id: 'sigma', name: 'sigma', min: 0.5, max: 3, step: 0.1, defaultValue: 1, label: 'σ 参数' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '密度函数曲面与概率',
          type: 'step',
          steps: [
            { id: 's1', description: '标准正态密度：σ=1，f(x,y)在原点最高', changes: { sigma: 1, x_val: 0, y_val: 0 } },
            { id: 's2', description: '增大σ=2：密度变矮变宽，散布更大', changes: { sigma: 2, x_val: 0, y_val: 0 } },
            { id: 's3', description: '减小σ=0.5：密度变高变窄，更集中', changes: { sigma: 0.5, x_val: 0, y_val: 0 } },
            { id: 's4', description: '整片曲面下的体积=1（规范性）', changes: { sigma: 1, x_val: 0, y_val: 0 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：概率密度——概率的"高度场"**

一维连续型随机变量的概率密度是"曲线下的面积=概率"，二维则是"曲面下的体积=概率"。f(x,y)可以想象成一张铺在平面上的"帐篷"，帐篷越高，那个区域取值的可能性越大。

---

**📐 联合概率密度函数的定义**

设F(x,y)是(X,Y)的联合分布函数，若存在**非负可积函数**f(x,y)，使得
$$F(x,y) = \\int_{-\\infty}^{x}\\int_{-\\infty}^{y} f(u,v)dvdu$$
则称(X,Y)为**二维连续型随机变量**，f(x,y)为**联合概率密度函数**（简称联合密度）。

等价地，若F(x,y)在点(x,y)处可微，则
$$f(x,y) = \\frac{\\partial^2 F(x,y)}{\\partial x \\partial y}$$

---

**📐 联合概率密度的性质**

**性质1（非负性）**：$f(x,y) \\geq 0$

**性质2（规范性）**：$\\int_{-\\infty}^{+\\infty}\\int_{-\\infty}^{+\\infty} f(x,y)dxdy = 1$

几何意义：整个密度曲面与xOy平面之间的体积等于1。

**性质3（概率计算）**：对平面上任意区域D，
$$P\\{(X,Y) \\in D\\} = \\iint_D f(x,y)dxdy$$

**性质4**：在f(x,y)的连续点处，
$$f(x,y) = \\frac{\\partial^2 F}{\\partial x \\partial y}$$

**重要注意**：f(x,y)在某点的值**不是概率**！$f(x_0,y_0)$可以大于1。只有**面积分**（更确切地说是体积）才是概率。

---

**📐 常见二维连续分布**

**1. 二维均匀分布**

设G是平面上有界区域，面积为A，则
$$f(x,y) = \\begin{cases} \\frac{1}{A}, & (x,y) \\in G \\\\ 0, & \\text{其他} \\end{cases}$$

在G上均匀散布的随机点服从二维均匀分布。

**2. 二维正态分布**

$$(X,Y) \\sim N(\\mu_1, \\mu_2, \\sigma_1^2, \\sigma_2^2, \\rho)$$

密度函数为
$$f(x,y) = \\frac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}} \\exp\\left\\{-\\frac{1}{2(1-\\rho^2)}\\left[\\frac{(x-\\mu_1)^2}{\\sigma_1^2}-\\frac{2\\rho(x-\\mu_1)(y-\\mu_2)}{\\sigma_1\\sigma_2}+\\frac{(y-\\mu_2)^2}{\\sigma_2^2}\\right]\\right\\}$$

五个参数：μ₁, μ₂（位置），σ₁, σ₂（散布），ρ（关联）。ρ是X和Y的**相关系数**，|ρ|≤1。

---

**⚠️ 常见误区**

**误区1**："f(x,y)就是概率"
- **纠正**：f(x,y)是概率密度，是"单位面积上的概率"，本身可以大于1。只有积分才是概率

**误区2**："连续型随机变量在一点的概率=0，所以事件不可能发生"
- **纠正**：概率为0≠不可能！这是连续型随机变量的固有特征，概率0的事件仍可能发生

**误区3**："均匀分布的密度函数在G内可以取任意值"
- **纠正**：密度函数值必须是1/A（常数），保证规范性`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
        { start: 200, end: 250, type: 'formula' },
        { start: 500, end: 560, type: 'definition' },
      ],
    },

    extension: {
      essence: `**🔮 核心内涵：密度函数——从"计数"到"积分"的思维升级**

一维离散型用"计数"（求和），连续型用"积分"。二维同理，但积分从一重变成了二重。

联合概率密度的核心思想是**局部化**：在点(x,y)附近的小区域ΔS内，概率近似等于f(x,y)·ΔS。这就像地形图上的等高线——等高线越密，坡度越陡；密度值越大，概率越集中。

二维正态分布是最重要的二维连续分布。它的5个参数各有明确的概率意义：μ₁和μ₂控制位置，σ₁和σ₂控制散布范围，而ρ是联系两个变量的纽带。当ρ=0时X和Y独立（仅对正态分布成立！），ρ=±1时X和Y完全线性相关。二维正态分布的等高线是一族同心椭圆，ρ决定椭圆的倾斜方向和扁率。`,
      extension: `**🚀 二维正态分布的深刻性质**

1. 二维正态分布的边缘分布是一维正态分布
2. X和Y独立的充要条件是ρ=0（正态分布的"特权"——其他分布没有这个性质）
3. X和Y的任何线性组合仍服从正态分布
4. 条件分布也是正态分布

这些性质使正态分布成为统计学的基石——中心极限定理保证了大量随机因素叠加的结果趋向正态。`,
      further: [
        { id: 'f1', title: '二维正态分布的等高线', content: '固定f(x,y)=c，得到等高线方程为关于(x,y)的二次曲线。当ρ=0时为以(μ₁,μ₂)为中心的标准椭圆；当ρ≠0时椭圆倾斜。ρ越接近±1，椭圆越扁，表示X和Y的线性关系越强。' },
        { id: 'f2', title: '概率密度函数的构造方法', content: '构造合法的f(x,y)需满足：①非负性f(x,y)≥0；②规范性∫∫f(x,y)dxdy=1。常见构造方式：(a)在有限区域G上取f=1/A(G为面积)；(b)用已知密度函数的乘积f(x,y)=f₁(x)f₂(y)（独立情形）；(c)用指数型函数并调整归一化常数。' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '二维均匀分布求概率',
        description: `**问题**

设(X,Y)在区域G={(x,y): 0≤x≤2, 0≤y≤1}上服从均匀分布，求P{X+Y≤1}。

**解**

G的面积A=2×1=2，所以密度函数为：
$$f(x,y) = \\begin{cases} 1/2, & (x,y) \\in G \\\\ 0, & \\text{其他} \\end{cases}$$

X+Y≤1与G的交集为三角形区域：0≤x≤1, 0≤y≤1-x

$$P\\{X+Y \\leq 1\\} = \\int_0^1 dx \\int_0^{1-x} \\frac{1}{2} dy = \\frac{1}{2}\\int_0^1(1-x)dx = \\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$$

**验证**：三角形面积=1/2，除以G面积2，得1/4 ✓`,
        scenario: '调整区域G的大小，观察概率随区域的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '到达时间问题——会面概率',
        description: `**问题**

甲乙约定8:00-9:00在某地会面。甲到达时刻X，乙到达时刻Y，都均匀分布在[0,60]分钟上。求两人到站时间差不超过15分钟的概率（先到者等15分钟后离开）。

**解**

(X,Y)在正方形[0,60]²上均匀分布，密度f(x,y)=1/3600。

所求事件：|X-Y|≤15，即-15≤X-Y≤15。

$$P\\{|X-Y| \\leq 15\\} = \\frac{\\text{正方形面积} - 2 \\times \\text{三角形面积}}{3600}$$

两个三角形各面积=(45²/2)=1012.5

$$P = \\frac{3600 - 2 \\times 1012.5}{3600} = \\frac{1575}{3600} = \\frac{7}{16} \\approx 0.4375$$

两人能见面的概率约为43.75%。`,
        scenario: '调整等待时间阈值，观察会面概率如何变化。',
      },
    ],

    method: [
      { number: 1, title: '密度函数法求概率', description: `步骤：\n①确定密度函数f(x,y)的表达式\n②将概率事件转化为积分区域D\n③计算二重积分 $P=\\iint_D f(x,y)dxdy$\n④确定积分上下限是关键——画出区域D的图形\n\n**技巧**：对均匀分布，P=D面积/G面积（面积比法）` },
      { number: 2, title: '由F(x,y)求f(x,y)', description: `步骤：\n①对F(x,y)求二阶混合偏导：$f(x,y)=\\frac{\\partial^2 F}{\\partial x \\partial y}$\n②注意F(x,y)的分段情况——在每段内分别求导\n③在F不可微的点上，f的值可以任意取（通常取0）\n④最后验证∫∫f(x,y)dxdy=1` },
    ],
  },
}

const marginalDistributionPoint: KnowledgePoint = {
  id: 'marginal-distribution',
  moduleId: 'probability',
  name: '边缘分布',
  formula: 'F_X(x) = F(x, +\\infty), \\quad f_X(x) = \\int_{-\\infty}^{+\\infty} f(x,y)dy',
  coreSentence: '边缘分布是联合分布的"投影"——从二维回到一维，但投影会丢失关联信息。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'exp(-(x^2+y^2)/2)/(2*pi)', color: '#D4A574', visible: true },
          { id: 'f2', expression: 'exp(-x^2/2)/sqrt(2*pi)', color: '#C62828', visible: true },
          { id: 'f3', expression: 'exp(-y^2/2)/sqrt(2*pi)', color: '#1565C0', visible: true },
        ],
        points: [
          { id: 'p1', x: 'x_val', y: 0, draggable: true, color: '#C62828', label: 'x' },
        ],
        sliders: [
          { id: 'x_val', name: 'x_val', min: -3, max: 3, step: 0.1, defaultValue: 0, label: 'x 值' },
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0, label: 'ρ 相关系数' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '边缘分布的"投影"过程',
          type: 'step',
          steps: [
            { id: 's1', description: '联合密度f(x,y)完整呈现（二维正态）', changes: { rho: 0, x_val: 0 } },
            { id: 's2', description: '对y积分得到f_X(x)：沿y方向"压缩"', changes: { rho: 0, x_val: 0 } },
            { id: 's3', description: '边缘密度f_X(x)始终是N(0,1)正态', changes: { rho: 0, x_val: 0 } },
            { id: 's4', description: '改变ρ=0.5：联合密度变化但边缘密度不变！', changes: { rho: 0.5, x_val: 0 } },
            { id: 's5', description: 'ρ=-0.8：联合密度大变，边缘密度仍不变', changes: { rho: -0.8, x_val: 0 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：联合→边缘，如同3D→2D的投影**

想象用手电筒从侧面照射一个三维物体，墙上投下的影子就是"边缘"。联合分布f(x,y)沿y方向"压扁"得到f_X(x)，沿x方向"压扁"得到f_Y(y)。但就像影子丢失了深度信息，边缘分布丢失了X与Y之间的关联信息。

---

**📐 边缘分布函数的定义**

**X的边缘分布函数**：
$$F_X(x) = F(x, +\\infty) = \\lim_{y \\to +\\infty} F(x,y)$$

**Y的边缘分布函数**：
$$F_Y(y) = F(+\\infty, y) = \\lim_{x \\to +\\infty} F(x,y)$$

**直观理解**：$F_X(x)$就是"不关心Y取什么值，只看X≤x"的概率，即
$$F_X(x) = P\\{X \\leq x\\} = P\\{X \\leq x, Y < +\\infty\\}$$

---

**📐 离散型的边缘分布律**

设(X,Y)的联合分布律为pij，则

**X的边缘分布律**：
$$P\\{X = x_i\\} = p_{i\\cdot} = \\sum_{j=1}^{\\infty} p_{ij}$$

**Y的边缘分布律**：
$$P\\{Y = y_j\\} = p_{\\cdot j} = \\sum_{i=1}^{\\infty} p_{ij}$$

**记忆**：$p_{i\\cdot}$就是把第i**行**的所有概率加起来（行和），$p_{\\cdot j}$就是把第j**列**的所有概率加起来（列和）。

**例**：对于联合分布律表

| X\\Y | 0 | 1 | pᵢ· |
|------|---|---|------|
| 0 | 0.1 | 0.3 | **0.4** |
| 1 | 0.4 | 0.2 | **0.6** |
| p·j | **0.5** | **0.5** | 1.0 |

X的边缘分布：P{X=0}=0.4, P{X=1}=0.6
Y的边缘分布：P{Y=0}=0.5, P{Y=1}=0.5

---

**📐 连续型的边缘密度**

设(X,Y)的联合密度为f(x,y)，则

**X的边缘密度**：
$$f_X(x) = \\int_{-\\infty}^{+\\infty} f(x,y)dy$$

**Y的边缘密度**：
$$f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x,y)dx$$

**直观理解**：f_X(x)就是把联合密度"沿y方向叠加"——对每个固定的x，将f(x,y)对所有y积分。

---

**📐 关键结论：联合分布决定边缘分布，反之不然！**

这是最重要的结论：**已知联合分布→可求边缘分布，但已知边缘分布→不能确定联合分布**。

**经典反例**：以下两个不同的联合分布律有相同的边缘分布：

表1：
| X\\Y | 0 | 1 |
|------|---|---|
| 0 | 0.1 | 0.3 |
| 1 | 0.4 | 0.2 |

表2：
| X\\Y | 0 | 1 |
|------|---|---|
| 0 | 0.2 | 0.2 |
| 1 | 0.3 | 0.3 |

两个表的边缘分布都是P{X=0}=0.4, P{X=1}=0.6, P{Y=0}=0.5, P{Y=1}=0.5，但联合分布不同！

---

**⚠️ 常见误区**

**误区1**："知道了边缘分布就等于知道了联合分布"
- **纠正**：边缘分布只是联合分布的"投影"，投影丢失了关联信息

**误区2**："二维正态的边缘分布一定是正态的，所以两个正态变量的联合分布一定是二维正态"
- **纠正**：边缘正态推不出联合正态！反例：取标准正态X，令Y=X（|X|≤1时）或Y=-X（|X|>1时），Y也标准正态，但(X,Y)非二维正态`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
        { start: 250, end: 310, type: 'formula' },
        { start: 600, end: 660, type: 'emphasis' },
      ],
    },

    extension: {
      essence: `**🔮 核心内涵：信息不可逆——"降维"必失信息**

边缘分布的本质是**降维操作**：从二维的联合信息中提取一维的边际信息。这个过程是不可逆的——就像从照片中只能看到正面，无法推断背面的样子。

这个不可逆性有深刻的概率论意义：它说明**关联信息**（X和Y之间的关系）是独立于各自分布的额外信息。协方差、相关系数等概念正是为了量化这种"边缘分布无法捕获的关联"。

在正态分布的特殊情形下，边缘分布虽然不能完全确定联合分布，但5个参数中4个（μ₁, μ₂, σ₁, σ₂）由边缘分布确定，只剩ρ需要额外信息。这就是正态分布在统计学中地位特殊的原因之一。`,
      extension: `**🚀 边缘分布在统计学中的应用**

统计学中的"边际化"（marginalization）就是求边缘分布。在贝叶斯统计中，后验分布常常是高维联合分布，我们关心的只是其中某个参数的边缘后验分布——这需要对其余参数"积分消除"（marginalize out），这就是边缘化的统计意义。`,
      further: [
        { id: 'f1', title: '边缘分布不变性——同边缘不同联合', content: '设X,Y的边缘分布都是P{X=0}=P{X=1}=1/2，P{Y=0}=P{Y=1}=1/2。则联合分布可以是：\n(1)独立：pij=1/4对所有i,j\n(2)X=Y：p₀₀=p₁₁=1/2, p₀₁=p₁₀=0\n(3)X≠Y：p₀₁=p₁₀=1/2, p₀₀=p₁₁=0\n三种联合完全不同，但边缘分布相同！' },
        { id: 'f2', title: '边缘密度积分的技巧', content: '求边缘密度时，积分限的确定是关键：\n①画出联合密度f(x,y)≠0的区域G\n②求f_X(x)：固定x，确定y的范围（y关于x的函数）\n③求f_Y(y)：固定y，确定x的范围\n④分段讨论：不同的x范围可能有不同的y积分限\n⑤对均匀分布：f_X(x)=（G在x处的截线长度）/（G的面积）' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '由联合密度求边缘密度',
        description: `**问题**

设(X,Y)的联合密度为
$$f(x,y) = \\begin{cases} 2e^{-(2x+y)}, & x>0, y>0 \\\\ 0, & \\text{其他} \\end{cases}$$

求边缘密度f_X(x)和f_Y(y)。

**解**

对x>0：
$$f_X(x) = \\int_0^{+\\infty} 2e^{-(2x+y)}dy = 2e^{-2x}\\int_0^{+\\infty} e^{-y}dy = 2e^{-2x} \\cdot 1 = 2e^{-2x}$$

所以 $f_X(x) = \\begin{cases} 2e^{-2x}, & x>0 \\\\ 0, & x \\leq 0 \\end{cases}$，即X~Exp(2)

对y>0：
$$f_Y(y) = \\int_0^{+\\infty} 2e^{-(2x+y)}dx = 2e^{-y}\\int_0^{+\\infty} e^{-2x}dx = 2e^{-y} \\cdot \\frac{1}{2} = e^{-y}$$

所以 $f_Y(y) = \\begin{cases} e^{-y}, & y>0 \\\\ 0, & y \\leq 0 \\end{cases}$，即Y~Exp(1)`,
        scenario: '调整联合密度参数，观察边缘密度的变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '考试成绩的边缘分析',
        description: `**问题背景**

设(X,Y)表示数学和语文成绩的联合分布。已知联合分布律：

| 数学X\\语文Y | <60 | 60-80 | >80 |
|------------|-----|-------|-----|
| <60 | 0.05 | 0.10 | 0.02 |
| 60-80 | 0.08 | 0.30 | 0.10 |
| >80 | 0.02 | 0.10 | 0.23 |

**求边缘分布**

数学X的边缘分布：P{X<60}=0.17, P{60≤X≤80}=0.48, P{X>80}=0.35
语文Y的边缘分布：P{Y<60}=0.15, P{60≤Y≤80}=0.50, P{Y>80}=0.35

**分析**：数学和语文的优秀率(>80)相同(0.35)，但联合分布显示两科同时>80的概率=0.23，远大于0.35×0.35=0.1225，说明两科成绩正相关。这是边缘分布无法揭示的信息。`,
        scenario: '调整联合分布律各值，观察边缘分布和关联的变化。',
      },
    ],

    method: [
      { number: 1, title: '离散型求边缘分布律', description: `步骤：\n①写出联合分布律表\n②X的边缘分布律=每一行的和 $p_{i\\cdot}=\\sum_j p_{ij}$\n③Y的边缘分布律=每一列的和 $p_{\\cdot j}=\\sum_i p_{ij}$\n④验证：$\\sum_i p_{i\\cdot}=1$, $\\sum_j p_{\\cdot j}=1$\n\n**技巧**：在分布律表右侧和下方直接写出"行和"和"列和"。` },
      { number: 2, title: '连续型求边缘密度', description: `步骤：\n①画出f(x,y)≠0的区域G\n②求f_X(x)：固定x，对y积分 $f_X(x)=\\int f(x,y)dy$\n③确定y的积分限：y随x变化的范围\n④求f_Y(y)：固定y，对x积分\n⑤分段讨论不同x/y范围的积分结果\n\n**关键**：画图确定积分限！` },
    ],
  },
}

const conditionalDistributionPoint: KnowledgePoint = {
  id: 'conditional-distribution',
  moduleId: 'probability',
  name: '条件分布',
  formula: 'P\\{X=x_i|Y=y_j\\} = \\frac{p_{ij}}{p_{\\cdot j}}',
  coreSentence: '条件分布是"已知部分信息后重新评估概率"——它是贝叶斯思想的分布层面体现。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: '0', color: '#5D4037', visible: false },
        ],
        points: [
          { id: 'p1', x: 0, y: 0, draggable: false, color: '#C62828', label: 'p₀₀=0.1' },
          { id: 'p2', x: 1, y: 0, draggable: false, color: '#C62828', label: 'p₁₀=0.3' },
          { id: 'p3', x: 0, y: 1, draggable: false, color: '#1565C0', label: 'p₀₁=0.2' },
          { id: 'p4', x: 1, y: 1, draggable: false, color: '#1565C0', label: 'p₁₁=0.4' },
        ],
        sliders: [
          { id: 'p00', name: 'p00', min: 0, max: 0.5, step: 0.01, defaultValue: 0.1, label: 'p₀₀' },
          { id: 'p10', name: 'p10', min: 0, max: 0.5, step: 0.01, defaultValue: 0.3, label: 'p₁₀' },
          { id: 'p01', name: 'p01', min: 0, max: 0.5, step: 0.01, defaultValue: 0.2, label: 'p₀₁' },
          { id: 'p11', name: 'p11', min: 0, max: 0.5, step: 0.01, defaultValue: 0.4, label: 'p₁₁' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '条件分布的计算过程',
          type: 'step',
          steps: [
            { id: 's1', description: '联合分布律：p₀₀=0.1, p₁₀=0.3, p₀₁=0.2, p₁₁=0.4', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's2', description: '固定Y=0：p·₀=0.1+0.3=0.4，在Y=0条件下重新归一化', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's3', description: 'P{X=0|Y=0}=0.1/0.4=0.25, P{X=1|Y=0}=0.3/0.4=0.75', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's4', description: '固定Y=1：p·₁=0.2+0.4=0.6', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
            { id: 's5', description: 'P{X=0|Y=1}=0.2/0.6=1/3, P{X=1|Y=1}=0.4/0.6=2/3', changes: { p00: 0.1, p10: 0.3, p01: 0.2, p11: 0.4 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：信息更新——"知道了Y之后，X的概率要重算"**

条件分布是概率论中最深刻的概念之一。它回答的问题是：**在已知Y取某个值的条件下，X的概率分布会发生什么变化？**

这就像天气预报：不知道今天的温度，明天温度的分布是一种情况；知道了今天30°C，明天温度的分布就变了——条件分布刻画了这种"信息更新"。

---

**📐 离散型条件分布律**

设(X,Y)的联合分布律为pij，若$P\\{Y=y_j\\} = p_{\\cdot j} > 0$，则

$$P\\{X=x_i | Y=y_j\\} = \\frac{p_{ij}}{p_{\\cdot j}}, \\quad i=1,2,...$$

称为**在Y=yj条件下X的条件分布律**。

**直观理解**：在Y=yj这一列中，每个pij除以该列总和p·j，就是"在Y=yj已发生的条件下"各X值的概率——对一列进行**归一化**。

同理，在X=xi条件下Y的条件分布律为：
$$P\\{Y=y_j | X=x_i\\} = \\frac{p_{ij}}{p_{i\\cdot}}, \\quad j=1,2,...$$

**例**：联合分布律

| X\\Y | 0 | 1 |
|------|---|---|
| 0 | 0.1 | 0.2 |
| 1 | 0.3 | 0.4 |

Y=0时：P{X=0|Y=0}=0.1/0.4=0.25, P{X=1|Y=0}=0.3/0.4=0.75
Y=1时：P{X=0|Y=1}=0.2/0.6=1/3, P{X=1|Y=1}=0.4/0.6=2/3

对比边缘分布：P{X=0}=0.3, P{X=1}=0.7——条件分布与边缘分布不同，说明X和Y不独立！

---

**📐 连续型条件密度**

设(X,Y)的联合密度为f(x,y)，边缘密度为f_X(x)和f_Y(y)，则

**在Y=y条件下X的条件密度**（当f_Y(y)>0时）：
$$f_{X|Y}(x|y) = \\frac{f(x,y)}{f_Y(y)}$$

**在X=x条件下Y的条件密度**（当f_X(x)>0时）：
$$f_{Y|X}(y|x) = \\frac{f(x,y)}{f_X(x)}$$

**直观理解**：条件密度=联合密度/边缘密度。在y处"切一刀"，得到联合密度的截面，再除以该截面的"总面积"（即f_Y(y)）进行归一化。

---

**📐 条件分布与独立性的关系**

**定理**：X和Y独立 ⟺ 对所有xi和yj，条件分布等于边缘分布：
$$P\\{X=x_i|Y=y_j\\} = P\\{X=x_i\\}$$

**直觉**：如果知道Y的取值不影响X的分布，那X和Y当然独立！反之亦然。

**连续型**：X和Y独立 ⟺ f_{X|Y}(x|y) = f_X(x) 对所有y成立。

---

**📐 条件分布函数**

在Y=y条件下X的条件分布函数：
$$F_{X|Y}(x|y) = \\int_{-\\infty}^{x} f_{X|Y}(u|y)du = \\int_{-\\infty}^{x} \\frac{f(u,y)}{f_Y(y)}du$$

---

**⚠️ 常见误区**

**误区1**："条件分布只是在原分布上乘以一个条件概率"
- **纠正**：条件分布是"重新归一化"——将满足条件的部分缩放使其总和为1

**误区2**："条件密度f(x|y)中的y是随机变量"
- **纠正**：在f(x|y)中，y是已知的固定值（条件），只有x是变量

**误区3**："条件分布只能对离散型使用"
- **纠正**：连续型有条件密度，离散型有条件分布律，两种情形都有`,
      highlights: [
        { start: 0, end: 40, type: 'definition' },
        { start: 220, end: 280, type: 'formula' },
        { start: 550, end: 610, type: 'definition' },
      ],
    },

    extension: {
      essence: `**🔮 核心内涵：条件分布——概率论中的"信息更新"机制**

条件分布是贝叶斯思想在分布层面的体现。它的核心逻辑是：**获取新信息后，原有的概率估计需要更新**。边缘分布是"没有任何先验信息"时X的分布，条件分布是"已知Y取某个值"后X的更新分布。

条件分布与边缘分布的差异程度，恰好度量了X和Y之间的关联强弱。当条件分布等于边缘分布时，X和Y独立——知道Y的值对X的分布没有任何影响。当条件分布与边缘分布差别越大，X和Y的关联越强。

从数学结构看，条件分布 $f_{X|Y}(x|y) = f(x,y)/f_Y(y)$ 揭示了联合密度=边缘密度×条件密度，即 $f(x,y) = f_Y(y) \\cdot f_{X|Y}(x|y)$。这就是**乘法公式**在密度层面的体现。`,
      extension: `**🚀 条件期望——条件分布的核心数字特征**

在Y=y条件下X的条件期望定义为：
$$E[X|Y=y] = \\int_{-\\infty}^{+\\infty} x \\cdot f_{X|Y}(x|y) dx$$

它是一个关于y的函数，记为g(y)=E[X|Y=y]。而E[X|Y]=g(Y)是一个随机变量！条件期望有重要性质：E[E[X|Y]]=E[X]（全期望公式），这是概率论最强大的计算工具之一。`,
      further: [
        { id: 'f1', title: '条件分布与贝叶斯公式', content: '条件分布律 P{X=xi|Y=yj}=pij/p·j 本质上就是贝叶斯公式在离散分布上的体现。P{Y=yj|X=xi}=P{X=xi|Y=yj}·P{Y=yj}/P{X=xi}，即从"先知道Y推断X"翻转为"先知道X推断Y"。贝叶斯公式正是利用条件分布实现这种翻转。' },
        { id: 'f2', title: '二维正态分布的条件分布', content: '若(X,Y)~N(μ₁,μ₂,σ₁²,σ₂²,ρ)，则在Y=y条件下X的条件分布仍为正态分布：X|Y=y ~ N(μ₁+ρσ₁/σ₂(y-μ₂), σ₁²(1-ρ²))。注意：条件方差σ₁²(1-ρ²)小于无条件方差σ₁²——知道Y的值减少了X的不确定性！ρ越大，不确定性减少越多。' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '由联合密度求条件密度',
        description: `**问题**

设(X,Y)的联合密度为
$$f(x,y) = \\begin{cases} 6xy^2, & 0<x<1, 0<y<1 \\\\ 0, & \\text{其他} \\end{cases}$$

求f_{X|Y}(x|y)和f_{Y|X}(y|x)。

**解**

先求边缘密度：
$$f_Y(y) = \\int_0^1 6xy^2 dx = 6y^2 \\cdot \\frac{1}{2} = 3y^2, \\quad 0<y<1$$

$$f_X(x) = \\int_0^1 6xy^2 dy = 6x \\cdot \\frac{1}{3} = 2x, \\quad 0<x<1$$

条件密度：
$$f_{X|Y}(x|y) = \\frac{f(x,y)}{f_Y(y)} = \\frac{6xy^2}{3y^2} = 2x, \\quad 0<x<1$$

$$f_{Y|X}(y|x) = \\frac{f(x,y)}{f_X(x)} = \\frac{6xy^2}{2x} = 3y^2, \\quad 0<y<1$$

**注意**：此例中条件分布不依赖于条件变量的值，说明X和Y独立！验证：f(x,y)=6xy²=2x·3y²=f_X(x)·f_Y(y) ✓`,
        scenario: '调整联合密度函数，观察条件密度是否依赖于条件变量。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '医学诊断——条件分布辅助判断',
        description: `**问题背景**

设X=患病(1)或健康(0)，Y=检测阳性(1)或阴性(0)。已知联合分布律：

| X\\Y | 阴性(0) | 阳性(1) |
|------|---------|---------|
| 健康(0) | 0.882 | 0.098 |
| 患病(1) | 0.004 | 0.016 |

**求条件分布**

P{X=1|Y=1} = 0.016/(0.098+0.016) = 0.016/0.114 ≈ 0.14

检测阳性时患病概率仅14%！这就是**基础概率忽视**——虽然检测灵敏度=0.016/0.02=80%，特异度=0.882/0.98=90%，但因患病率低(2%)，阳性结果大部分是假阳性。

条件分布帮助医生正确理解检测结果，避免过度诊断。`,
        scenario: '调整患病率和检测准确率，观察条件概率的变化。',
      },
    ],

    method: [
      { number: 1, title: '离散型求条件分布律', description: `步骤：\n①写出联合分布律表，求出边缘分布（行和、列和）\n②固定Y=yⱼ，取第j列：P{X=xᵢ|Y=yⱼ}=pᵢⱼ/p·ⱼ\n③对整列归一化：验证Σᵢ P{X=xᵢ|Y=yⱼ}=1\n④同理可求固定X=xᵢ时Y的条件分布\n\n**注意**：只有p·ⱼ>0时才能求条件分布！` },
      { number: 2, title: '连续型求条件密度', description: `步骤：\n①求边缘密度f_X(x)和f_Y(y)\n②在f_Y(y)>0处：f_{X|Y}(x|y)=f(x,y)/f_Y(y)\n③在f_X(x)>0处：f_{Y|X}(y|x)=f(x,y)/f_X(x)\n④注意定义域：条件密度的非零区域可能缩小\n⑤验证：∫f_{X|Y}(x|y)dx=1\n\n**关键**：先求边缘密度，再做除法！` },
    ],
  },
}

const rvIndependencePoint: KnowledgePoint = {
  id: 'rv-independence',
  moduleId: 'probability',
  name: '随机变量的独立性',
  formula: 'F(x,y) = F_X(x) \\cdot F_Y(y)',
  coreSentence: '独立性意味着"知道一个变量的值对另一个毫无影响"——联合分布等于边缘分布的乘积。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'exp(-x^2/2-y^2/2)/(2*pi)', color: '#D4A574', visible: true },
        ],
        points: [
          { id: 'p1', x: 'x_val', y: 'y_val', draggable: true, color: '#C62828', label: '(x,y)' },
        ],
        sliders: [
          { id: 'x_val', name: 'x_val', min: -3, max: 3, step: 0.1, defaultValue: 1, label: 'x' },
          { id: 'y_val', name: 'y_val', min: -3, max: 3, step: 0.1, defaultValue: 1, label: 'y' },
          { id: 'rho', name: 'rho', min: -0.9, max: 0.9, step: 0.1, defaultValue: 0, label: 'ρ' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '独立性判定演示',
          type: 'step',
          steps: [
            { id: 's1', description: 'ρ=0：联合密度可分解，X与Y独立', changes: { rho: 0, x_val: 1, y_val: 1 } },
            { id: 's2', description: '验证：f(x,y)=f_X(x)·f_Y(y)成立', changes: { rho: 0, x_val: 1, y_val: 1 } },
            { id: 's3', description: 'ρ=0.5：联合密度不可分解，不独立', changes: { rho: 0.5, x_val: 1, y_val: 1 } },
            { id: 's4', description: '验证：f(x,y)≠f_X(x)·f_Y(y)', changes: { rho: 0.5, x_val: 1, y_val: 1 } },
            { id: 's5', description: 'ρ=-0.8：强负相关，更不独立', changes: { rho: -0.8, x_val: 1, y_val: 1 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：独立性="互不干扰"**

两个随机变量独立，意味着**一个变量的取值不会影响另一个变量的概率分布**。就像两个互不相连的轮盘赌——一个转出什么结果，完全不影响另一个。

独立性是概率论中最重要的概念之一，它将复杂的联合分布简化为简单的边缘分布之积。

---

**📐 独立性的定义（分布函数层面）**

设(X,Y)的联合分布函数为F(x,y)，边缘分布函数为F_X(x)和F_Y(y)。若对所有x, y，都有
$$F(x,y) = F_X(x) \\cdot F_Y(y)$$
则称随机变量X和Y**相互独立**。

**等价表述**：对任意实数x, y，
$$P\\{X \\leq x, Y \\leq y\\} = P\\{X \\leq x\\} \\cdot P\\{Y \\leq y\\}$$

即事件{X≤x}和{Y≤y}独立——这把随机变量的独立性还原为事件的独立性。

---

**📐 独立性的等价条件**

**离散型**：X和Y独立 ⟺ 对所有i, j，
$$p_{ij} = p_{i\\cdot} \\cdot p_{\\cdot j}$$

即联合分布律等于边缘分布律的乘积。

**连续型**：X和Y独立 ⟺ 在f(x,y)的连续点处，
$$f(x,y) = f_X(x) \\cdot f_Y(y)$$

即联合密度等于边缘密度的乘积。

**重要**：对于连续型，只要f(x,y)和f_X(x)f_Y(y)在某个面积为正的区域上不等，就不独立。但个别点上不等不影响独立性。

---

**📐 独立性的实用判断方法**

**方法1：定义法**
直接验证F(x,y)=F_X(x)·F_Y(y)或pij=pi··p·j或f(x,y)=f_X(x)·f_Y(y)

**方法2：因子分解法**（最常用！）
如果联合密度能写成
$$f(x,y) = g(x) \\cdot h(y)$$
其中g(x)只含x，h(y)只含y，且定义域也是"矩形"的（即x的范围不依赖于y），则X和Y独立。

**例**：$f(x,y) = 2e^{-(2x+y)}$，x>0, y>0
→ g(x)=2e^{-2x}, h(y)=e^{-y}，且定义域{0<x, 0<y}是矩形区域，所以独立 ✓

**反例**：$f(x,y) = 2$，0<x<y<1
→ 虽然2=1×1，但定义域{0<x<y<1}不是矩形（x的范围依赖于y），不独立 ✗

**方法3：正态分布的特殊判据**
若(X,Y)服从二维正态分布，则X和Y独立 ⟺ ρ=0

---

**📐 独立性的重要性质**

**性质1**：若X和Y独立，则对任意函数g和h，g(X)和h(Y)也独立

**性质2**：若X₁,...,Xₙ相互独立，则其任何子集也相互独立

**性质3**：独立随机变量之和的分布可由卷积求得

---

**⚠️ 常见误区**

**误区1**："不相关就是独立"
- **纠正**：独立⟹不相关，但反之不成立！除非(X,Y)服从二维正态分布

**误区2**："定义域是矩形就一定独立"
- **纠正**：矩形定义域是因子分解法判断独立的**必要条件**，还需要密度能分解为x的函数×y的函数

**误区3**："边缘正态则联合正态，独立就是ρ=0"
- **纠正**：边缘正态推不出联合正态！ρ=0⟺独立只在(X,Y)服从二维正态的前提下成立`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
        { start: 200, end: 260, type: 'formula' },
        { start: 550, end: 610, type: 'emphasis' },
      ],
    },

    extension: {
    essence: `**🔮 核心内涵：独立性——概率论中最强的简化假设**

独立性将"两个变量联合"的问题分解为"两个单变量"的问题，极大地简化了计算。没有独立性假设，联合分布的分析将变得极其复杂。

从信息论角度看，独立意味着两个变量之间**互信息为0**——知道一个变量的值不会减少另一个变量的不确定性。这是最"无趣"的关系——没有任何关联可利用。

但现实中，独立往往是近似成立的。比如不同人的身高可以近似视为独立（除非他们是亲属），不同时间段的股价变动在短时间内可以近似独立。统计学中，"独立同分布(i.i.d.)"是最基本的假设——大数定律和中心极限定理都建立在这个基础上。`,
      extension: `**🚀 多个随机变量的独立性**

n个随机变量X₁,...,Xₙ相互独立的定义：对任意实数x₁,...,xₙ，
$$F(x_1,...,x_n) = \\prod_{i=1}^{n} F_{X_i}(x_i)$$

注意："两两独立"不等于"相互独立"！两两独立只要求任意两个独立，相互独立还要求任意子集的联合分布等于各自边缘分布的乘积。

反例：X₁,X₂独立同分布取{0,1}各1/2，X₃=X₁⊕X₂（异或）。则两两独立但不相互独立。`,
      further: [
        { id: 'f1', title: '两两独立≠相互独立', content: '构造反例：掷均匀硬币两次。X₁=第1次正面, X₂=第2次正面, X₃=X₁⊕X₂。验证：P{X₁=1,X₂=1}=1/4=P{X₁=1}P{X₂=1}（两两独立），但P{X₁=1,X₂=1,X₃=0}=1/4≠P{X₁=1}P{X₂=1}P{X₃=0}=1/4×1/2=1/8（不相互独立）。这说明两两独立是比相互独立更弱的条件。' },
        { id: 'f2', title: '独立性在统计推断中的核心地位', content: '统计学三大基本推断方法都依赖独立性：\n(1)极大似然估计：似然函数L=∏f(xi;θ)仅在样本独立时成立\n(2)假设检验：检验统计量的分布依赖样本独立性\n(3)回归分析：误差项独立是OLS估计有效性的前提\n\n当独立性不满足时（如时间序列的自相关），需要特殊的统计方法。' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '判断独立性——因子分解法',
        description: `**问题1**：$f(x,y) = \\begin{cases} 12xy(1-y), & 0<x<1, 0<y<1 \\\\ 0, & \\text{其他} \\end{cases}$

判断X和Y是否独立。

**解**：
$f(x,y) = \\underbrace{12x}_{g(x)} \\cdot \\underbrace{y(1-y)}_{h(y)}$

定义域{0<x<1, 0<y<1}是矩形，g(x)只含x，h(y)只含y，所以**X和Y独立** ✓

验证：$f_X(x) = \\int_0^1 12xy(1-y)dy = 12x \\cdot \\frac{1}{6} = 2x$
$f_Y(y) = \\int_0^1 12xy(1-y)dx = 12y(1-y) \\cdot \\frac{1}{2} = 6y(1-y)$
$f_X(x) \\cdot f_Y(y) = 2x \\cdot 6y(1-y) = 12xy(1-y) = f(x,y)$ ✓

---

**问题2**：$f(x,y) = \\begin{cases} 2, & 0<x<y<1 \\\\ 0, & \\text{其他} \\end{cases}$

**解**：虽然f(x,y)=2=1×1可以分解，但定义域{0<x<y<1}**不是矩形**（x的上界依赖于y），所以**X和Y不独立** ✗

验证：$f_X(x)=2(1-x)$，$f_Y(y)=2y$，$f_X(x)f_Y(y)=4y(1-x) \\neq 2=f(x,y)$ ✗`,
        scenario: '调整密度函数和定义域，观察独立性判断结果。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '系统可靠性——独立性假设的应用',
        description: `**问题背景**

某系统由n个独立元件组成，第i个元件的可靠度为pᵢ。求：
(1) 串联系统（全部正常才正常）的可靠度
(2) 并联系统（至少一个正常就正常）的可靠度

**解**

设Xᵢ="第i个元件正常"（取1/0），各Xᵢ独立。

(1) 串联系统可靠度：
$$P\\{X_1=1, X_2=1, ..., X_n=1\\} = \\prod_{i=1}^{n} p_i$$

(2) 并联系统可靠度（用对立事件）：
$$P\\{\\text{至少一个正常}\\} = 1 - P\\{\\text{全部故障}\\} = 1 - \\prod_{i=1}^{n}(1-p_i)$$

**例**：3个元件，可靠度均为0.9
- 串联：0.9³=0.729
- 并联：1-0.1³=0.999

独立性假设使得乘法分解成立，是系统可靠性分析的基础！`,
        scenario: '调整元件数量和可靠度，对比串并联系统的整体可靠度。',
      },
    ],

    method: [
      { number: 1, title: '因子分解法判断独立', description: `步骤：\n①将f(x,y)尝试分解为g(x)·h(y)\n②检查定义域是否为"矩形"（x的范围不依赖于y）\n③若①②都满足，则X和Y独立\n④否则，不独立\n\n**快速判断**：若定义域含"x<y"或"x²+y²<1"等非矩形边界，直接判定不独立！` },
      { number: 2, title: '定义法验证独立', description: `步骤：\n①求出联合分布和边缘分布\n②验证pij=pi··p·j（离散）或f(x,y)=f_X(x)·f_Y(y)（连续）\n③只需找一个反例即可否定独立性\n④若需证明独立，必须验证所有i,j或所有x,y\n\n**技巧**：否定独立比肯定独立容易——找一个反例即可！` },
    ],
  },
}

const twoDimFunctionPoint: KnowledgePoint = {
  id: 'two-dim-function',
  moduleId: 'probability',
  name: '二维随机变量函数的分布',
  formula: 'Z = X + Y, \\quad f_Z(z) = \\int_{-\\infty}^{+\\infty} f(x,z-x)dx',
  coreSentence: '求二维随机变量函数的分布，核心是"变量替换+雅可比行列式"——卷积公式是最重要的特例。',

  dimensions: {
    model: {
      type: '2d',
      config: {
        functions: [
          { id: 'f1', expression: 'exp(-abs(x)-abs(y))/4', color: '#D4A574', visible: true },
          { id: 'f2', expression: 'z*exp(-z)/4', color: '#C62828', visible: true },
        ],
        points: [
          { id: 'p1', x: 'z_val', y: 0, draggable: true, color: '#2E7D32', label: 'z=X+Y' },
        ],
        sliders: [
          { id: 'z_val', name: 'z_val', min: -5, max: 5, step: 0.1, defaultValue: 0, label: 'z 值' },
          { id: 'func_type', name: 'func_type', min: 0, max: 2, step: 1, defaultValue: 0, label: '函数类型(0:和/1:max/2:商)' },
        ],
      },
      animations: [
        {
          id: 'a1',
          name: '卷积公式的几何推导',
          type: 'step',
          steps: [
            { id: 's1', description: 'Z=X+Y：在(x,y)平面上，z=x+y是一条斜线', changes: { z_val: 0, func_type: 0 } },
            { id: 's2', description: '沿斜线积分f(x,z-x)，即对所有x求f(x,z-x)', changes: { z_val: 1, func_type: 0 } },
            { id: 's3', description: 'z增大：斜线上移，积分值变化', changes: { z_val: 2, func_type: 0 } },
            { id: 's4', description: 'f_Z(z)=∫f(x,z-x)dx：这就是卷积公式', changes: { z_val: 0, func_type: 0 } },
            { id: 's5', description: 'Z=max(X,Y)：分布函数F_Z(z)=F_X(z)·F_Y(z)', changes: { z_val: 0, func_type: 1 } },
          ],
        },
      ],
    },

    explanation: {
      mainText: `**🎯 核心思想：从"联合"到"新变量"的分布变换**

已知(X,Y)的联合分布，求Z=g(X,Y)的分布——这是概率论中最实用的计算技能。比如已知两种原料的用量X和Y，求总用量Z=X+Y的分布。

核心方法：**先求分布函数，再求导得密度**。

---

**📐 和的分布——卷积公式**

设(X,Y)的联合密度为f(x,y)，Z=X+Y，则Z的密度为
$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f(x, z-x) dx$$

这就是著名的**卷积公式**。

**推导**：
$$F_Z(z) = P\\{Z \\leq z\\} = P\\{X+Y \\leq z\\} = \\iint_{x+y \\leq z} f(x,y)dxdy$$

$$= \\int_{-\\infty}^{+\\infty} dx \\int_{-\\infty}^{z-x} f(x,y)dy$$

对z求导：
$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f(x, z-x) dx$$

**独立时的简化**：当X和Y独立时，f(x,y)=f_X(x)·f_Y(y)，
$$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z-x) dx = f_X * f_Y(z)$$

这就是**卷积运算**，记作f_Z = f_X * f_Y。

**例**：X~Exp(λ₁)与Y~Exp(λ₂)独立，则Z=X+Y的密度为
$$f_Z(z) = \\int_0^z \\lambda_1 e^{-\\lambda_1 x} \\cdot \\lambda_2 e^{-\\lambda_2(z-x)} dx = \\frac{\\lambda_1 \\lambda_2}{\\lambda_1 - \\lambda_2}(e^{-\\lambda_2 z} - e^{-\\lambda_1 z}), \\quad z>0$$

---

**📐 最值分布**

**Z=max(X,Y)的分布**：
$$F_Z(z) = P\\{\\max(X,Y) \\leq z\\} = P\\{X \\leq z, Y \\leq z\\} = F(x,z) \\bigg|_{\\text{在}(z,z)处}}$$

若X和Y独立：
$$F_Z(z) = F_X(z) \\cdot F_Y(z)$$

**W=min(X,Y)的分布**：
$$F_W(w) = P\\{\\min(X,Y) \\leq w\\} = 1 - P\\{X>w, Y>w\\}$$

若X和Y独立：
$$F_W(w) = 1 - [1-F_X(w)][1-F_Y(w)]$$

---

**📐 商的分布**

设Z=X/Y，则
$$f_Z(z) = \\int_{-\\infty}^{+\\infty} |y| f(yz, y) dy$$

**推导**：令u=x/y, v=y（变换），雅可比行列式|J|=|y|，则f_{U,V}(u,v)=f(uv,v)|v|，对v积分得f_Z。

---

**📐 一般函数的分布——分布函数法**

**通用步骤**：
1. 写出Z=g(X,Y)的分布函数：$F_Z(z) = P\\{g(X,Y) \\leq z\\}$
2. 将不等式g(x,y)≤z转化为(x,y)平面上的区域D_z
3. 计算 $F_Z(z) = \\iint_{D_z} f(x,y)dxdy$
4. 对z求导得密度：$f_Z(z) = F_Z'(z)$

---

**⚠️ 常见误区**

**误区1**："卷积公式只在独立时才能用"
- **纠正**：卷积公式 $f_Z(z)=\\int f(x,z-x)dx$ 对一般联合密度也成立！只是独立时才能写成f_X*f_Y

**误区2**："max的密度等于密度的乘积"
- **纠正**：是**分布函数**的乘积！$F_{max}(z)=F_X(z)·F_Y(y)$，密度需要再求导

**误区3**："和的分布等于分布的和"
- **纠正**：分布不能直接相加！必须用卷积公式（对密度做积分变换）`,
      highlights: [
        { start: 0, end: 30, type: 'definition' },
        { start: 160, end: 220, type: 'formula' },
        { start: 560, end: 620, type: 'emphasis' },
      ],
    },

    extension: {
      essence: `**🔮 核心内涵：分布变换——概率论中的"换元积分"**

求随机变量函数的分布，本质上是**概率测度在变换下的推前（pushforward）**。就像微积分中的换元积分需要雅可比行列式，概率密度在变换下也需要乘以雅可比因子来保证概率守恒。

卷积公式是这种思想的最典型体现。它表明：两个独立随机变量之和的密度，是各自密度的卷积。这和信号处理中的卷积运算完全一致——两个独立信号的叠加效应，在数学上就是卷积。

最值分布的优美公式 $F_{max}(z)=\\prod F_{X_i}(z)$ 和 $F_{min}(z)=1-\\prod(1-F_{X_i}(z))$ 揭示了极值统计的核心：最大值由"最弱环节"决定（分布函数相乘），最小值由"最强环节"决定（用对立事件转化）。

这些公式在可靠性工程、保险精算、极端事件分析中有广泛应用。`,
      extension: `**🚀 n个独立随机变量的和与最值**

**和**：$S_n = X_1 + ... + X_n$，密度为n重卷积
$$f_{S_n} = f_{X_1} * f_{X_2} * ... * f_{X_n}$$

**独立同分布**时：若Xᵢ~N(μ,σ²)，则$S_n \\sim N(n\\mu, n\\sigma²)$
若Xᵢ~Exp(λ)，则$S_n \\sim \\Gamma(n, \\lambda)$

**最值**：
$$F_{\\max}(z) = [F(z)]^n, \\quad F_{\\min}(z) = 1-[1-F(z)]^n$$

当n→∞时，最大值的极限分布只有三种类型（极值分布的Fisher-Tippett定理），这是极值理论的基础。`,
      further: [
        { id: 'f1', title: '卷积公式的变换推导法', content: '更系统的推导方法——变量替换法：设Z₁=g₁(X,Y), Z₂=g₂(X,Y)（需要一个辅助变量），求出逆变换X=h₁(Z₁,Z₂), Y=h₂(Z₁,Z₂)，计算雅可比行列式J=∂(x,y)/∂(z₁,z₂)，则f_{Z₁,Z₂}(z₁,z₂)=f(h₁,h₂)|J|，最后对Z₂积分得Z₁的边缘密度。这种方法系统化、不易出错。' },
        { id: 'f2', title: '独立正态变量和的分布', content: '若X~N(μ₁,σ₁²)与Y~N(μ₂,σ₂²)独立，则X+Y~N(μ₁+μ₂, σ₁²+σ₂²)。\n\n推广：独立正态变量的任意线性组合aX+bY仍服从正态分布，这是正态分布的"再生性"。\n\n不独立时：若(X,Y)~N(μ₁,μ₂,σ₁²,σ₂²,ρ)，则aX+bY~N(aμ₁+bμ₂, a²σ₁²+b²σ₂²+2abρσ₁σ₂)。' },
      ],
    },

    applications: [
      {
        id: 'app1',
        type: 'example',
        title: '卷积公式求和的分布',
        description: `**问题**

设X和Y独立，X~U(0,1)，Y~U(0,1)。求Z=X+Y的密度。

**解**

由卷积公式：$f_Z(z) = \\int_{-\\infty}^{+\\infty} f_X(x) f_Y(z-x) dx$

$f_X(x)=1$（0<x<1），$f_Y(y)=1$（0<y<1），$f_Y(z-x)=1$（0<z-x<1即z-1<x<z）

积分限取交集：

- 当0<z≤1时：0<x<z，$f_Z(z)=\\int_0^z 1 \\cdot 1\\, dx = z$
- 当1<z<2时：z-1<x<1，$f_Z(z)=\\int_{z-1}^1 1 \\cdot 1\\, dx = 2-z$
- 其他：$f_Z(z)=0$

所以 $f_Z(z) = \\begin{cases} z, & 0<z\\leq 1 \\\\ 2-z, & 1<z<2 \\\\ 0, & \\text{其他} \\end{cases}$

这是一个**三角形分布**（Simpson分布），两个均匀分布的卷积不再是均匀的！`,
        scenario: '调整X和Y的分布参数，观察和分布的形状变化。',
      },
      {
        id: 'app2',
        type: 'real',
        title: '并联系统寿命——最小值分布',
        description: `**问题背景**

并联系统由n个独立元件组成，系统寿命=min(X₁,...,Xₙ)，其中Xᵢ为第i个元件寿命。

设各元件寿命独立，Xᵢ~Exp(λᵢ)，求系统寿命分布。

**解**

$$F_{\\min}(t) = 1 - \\prod_{i=1}^{n} [1-F_{X_i}(t)] = 1 - \\prod_{i=1}^{n} e^{-\\lambda_i t}$$

$$= 1 - e^{-\\sum \\lambda_i t} = 1 - e^{-(\\lambda_1+...+\\lambda_n)t}$$

即min(X₁,...,Xₙ)~Exp(λ₁+...+λₙ)！

**意义**：并联系统的失效率等于各元件失效率之和。元件越多，失效率越高，系统寿命越短——并联系统的寿命由最先坏的那个元件决定。

**对比**：串联系统寿命=max(X₁,...,Xₙ)，F_max(t)=∏[1-e^{-λᵢt}]，不再是指数分布。`,
        scenario: '调整元件数量n和失效率λ，观察并联系统寿命分布的变化。',
      },
    ],

    method: [
      { number: 1, title: '分布函数法（万能方法）', description: `步骤：\n①写出Z=g(X,Y)的分布函数F_Z(z)=P{g(X,Y)≤z}\n②将不等式转化为(x,y)平面的区域D_z\n③计算F_Z(z)=∬_{D_z} f(x,y)dxdy\n④对z求导得密度f_Z(z)=F'_Z(z)\n\n**适用**：任何函数g，是最通用的方法。缺点：积分区域可能复杂。` },
      { number: 2, title: '卷积公式法（和的分布专用）', description: `步骤：\n①确认求的是Z=X+Y的分布\n②代入卷积公式：f_Z(z)=∫f(x,z-x)dx\n③确定积分限（关键！）——画出f(x,z-x)≠0的区域\n④分段讨论z的不同范围\n⑤独立时：f_Z(z)=∫f_X(x)f_Y(z-x)dx\n\n**注意**：积分限的确定是卷积法的最大难点，画图辅助！` },
      { number: 3, title: '最值公式法（max/min专用）', description: `步骤：\n①max(X,Y)：F_max(z)=P{X≤z,Y≤z}=F(z,z)\n  独立时：F_max(z)=F_X(z)·F_Y(z)\n②min(X,Y)：F_min(z)=1-P{X>z,Y>z}\n  独立时：F_min(z)=1-[1-F_X(z)][1-F_Y(z)]\n③求导得密度\n\n**推广**：n个独立变量时用乘积公式。` },
    ],
  },
}

export {
  jointDistributionPoint,
  twoDimDiscretePoint,
  twoDimContinuousPoint,
  marginalDistributionPoint,
  conditionalDistributionPoint,
  rvIndependencePoint,
  twoDimFunctionPoint,
}
