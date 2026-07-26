export interface FormulaItem {
  id: string
  name: string
  latex: string
  description: string
  category: string
  tags: string[]
  example?: string
}

export const FORMULAS: FormulaItem[] = [
  {
    id: 'limit-definition',
    name: '极限定义',
    latex: '\\lim_{x \\to x_0} f(x) = A',
    description: '对于任意给定的正数ε，存在正数δ，使得当0<|x-x₀|<δ时，有|f(x)-A|<ε',
    category: '高等数学-极限',
    tags: ['极限', '基础'],
    example: '证明 lim(x→0) sin(x)/x = 1'
  },
  {
    id: 'infinitesimal-comparison',
    name: '无穷小比较',
    latex: '\\lim \\frac{\\alpha}{\\beta} = 1',
    description: '当极限为1时，α与β是等价无穷小',
    category: '高等数学-极限',
    tags: ['无穷小', '比较']
  },
  {
    id: 'derivative-definition',
    name: '导数定义',
    latex: "f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}",
    description: '函数在某点的瞬时变化率',
    category: '高等数学-导数',
    tags: ['导数', '基础']
  },
  {
    id: 'implicit-derivative',
    name: '隐函数求导',
    latex: '\\frac{dy}{dx} = -\\frac{F_x}{F_y}',
    description: '对F(x,y)=0两边求导，解出dy/dx',
    category: '高等数学-导数',
    tags: ['隐函数', '求导']
  },
  {
    id: 'integral-formula',
    name: '不定积分基本公式',
    latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
    description: '幂函数的不定积分',
    category: '高等数学-积分',
    tags: ['积分', '基础']
  },
  {
    id: 'substitution-integral',
    name: '换元积分法',
    latex: '\\int f(g(x))g\'(x)dx = \\int f(u)du',
    description: '通过变量替换简化积分',
    category: '高等数学-积分',
    tags: ['积分', '换元']
  },
  {
    id: 'determinant-expansion',
    name: '行列式展开定理',
    latex: '|A| = \\sum_{j=1}^{n} a_{ij} A_{ij}',
    description: '按某一行或列展开行列式',
    category: '线性代数-行列式',
    tags: ['行列式', '展开']
  },
  {
    id: 'adjugate-matrix',
    name: '伴随矩阵',
    latex: 'A^* = |A| A^{-1}',
    description: '伴随矩阵与逆矩阵的关系',
    category: '线性代数-矩阵',
    tags: ['矩阵', '伴随']
  },
  {
    id: 'eigenvalue-definition',
    name: '特征值定义',
    latex: 'Ax = \\lambda x',
    description: '非零向量x满足Ax=λx，则λ是特征值，x是特征向量',
    category: '线性代数-特征值',
    tags: ['特征值', '定义']
  },
  {
    id: 'characteristic-polynomial',
    name: '特征多项式',
    latex: '|\\lambda E - A| = 0',
    description: '特征方程的根即为特征值',
    category: '线性代数-特征值',
    tags: ['特征值', '多项式']
  },
  // ==================== 概率论与数理统计 ====================

  // ---- 第一章 随机事件和概率 ----

  // 事件关系与运算
  {
    id: 'prob-event-contain',
    name: '事件的包含',
    latex: 'A \\subset B \\Leftrightarrow \\text{若}A\\text{发生则}B\\text{必发生}',
    description: 'A是B的子事件：A发生必然导致B发生',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '关系']
  },
  {
    id: 'prob-event-equal',
    name: '事件相等',
    latex: 'A = B \\Leftrightarrow A \\subset B \\text{且} B \\subset A',
    description: '两个事件相互包含，则相等',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '关系']
  },
  {
    id: 'prob-event-union',
    name: '事件的和（并）',
    latex: 'A \\cup B = \\{\\omega | \\omega \\in A \\text{或} \\omega \\in B\\}',
    description: 'A与B至少有一个发生',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '运算']
  },
  {
    id: 'prob-event-intersection',
    name: '事件的积（交）',
    latex: 'A \\cap B = AB = \\{\\omega | \\omega \\in A \\text{且} \\omega \\in B\\}',
    description: 'A与B同时发生',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '运算']
  },
  {
    id: 'prob-event-difference',
    name: '事件的差',
    latex: 'A - B = A\\overline{B} = \\{\\omega | \\omega \\in A \\text{且} \\omega \\notin B\\}',
    description: 'A发生但B不发生',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '运算']
  },
  {
    id: 'prob-event-complement',
    name: '对立事件（逆事件）',
    latex: '\\overline{A} = \\Omega - A, \\quad A \\cup \\overline{A} = \\Omega, \\quad A\\overline{A} = \\emptyset',
    description: 'A不发生的事件，A与Ā互为对立事件',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '关系']
  },
  {
    id: 'prob-event-mutually-exclusive',
    name: '互不相容（互斥）',
    latex: 'AB = \\emptyset',
    description: 'A与B不能同时发生',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '关系']
  },
  {
    id: 'prob-de-morgan',
    name: '对偶律（德摩根律）',
    latex: '\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}, \\quad \\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}',
    description: '和的逆等于逆的积，积的逆等于逆的和。推广：\\overline{\\cup_{i=1}^n A_i}=\\cap_{i=1}^n\\overline{A_i}',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '运算律', '重点']
  },
  {
    id: 'prob-event-algebra',
    name: '事件运算规律',
    latex: 'A \\cup B = B \\cup A, \\quad AB = BA, \\quad A \\cup (BC) = (AB) \\cup C',
    description: '交换律、结合律、分配律',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['事件', '运算律']
  },

  // 概率公理与性质
  {
    id: 'prob-axiom-non-negative',
    name: '概率的非负性',
    latex: 'P(A) \\geq 0',
    description: '任何事件的概率非负',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '公理']
  },
  {
    id: 'prob-axiom-norm',
    name: '概率的规范性',
    latex: 'P(\\Omega) = 1',
    description: '必然事件的概率为1',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '公理']
  },
  {
    id: 'prob-axiom-additivity',
    name: '概率的可列可加性',
    latex: 'P\\left(\\bigcup_{i=1}^{\\infty} A_i\\right) = \\sum_{i=1}^{\\infty} P(A_i), \\quad A_iA_j=\\emptyset(i \\neq j)',
    description: '互不相容的事件之并的概率等于各自概率之和',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '公理']
  },
  {
    id: 'prob-property-complement',
    name: '逆事件概率',
    latex: 'P(\\overline{A}) = 1 - P(A)',
    description: '对立事件概率之和为1',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '性质']
  },
  {
    id: 'prob-property-difference',
    name: '差事件概率',
    latex: 'P(A - B) = P(A) - P(AB)',
    description: 'A发生B不发生的概率等于A的概率减AB同时发生的概率',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '性质']
  },
  {
    id: 'prob-property-inclusion',
    name: '包含关系概率',
    latex: 'A \\subset B \\Rightarrow P(A) \\leq P(B)',
    description: '若A是B的子事件，则A的概率不超过B',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '性质']
  },
  {
    id: 'prob-addition-formula',
    name: '加法公式',
    latex: 'P(A \\cup B) = P(A) + P(B) - P(AB)',
    description: '任意两事件并的概率。推广：P(A∪B∪C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+P(ABC)',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '加法公式', '重点']
  },

  // 古典概型与几何概型
  {
    id: 'prob-classical',
    name: '古典概型',
    latex: 'P(A) = \\frac{m}{n} = \\frac{A\\text{包含的基本事件数}}{\\text{基本事件总数}}',
    description: '有限等可能概型，样本空间有限且每个基本事件等可能',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '古典概型']
  },
  {
    id: 'prob-geometric',
    name: '几何概型',
    latex: 'P(A) = \\frac{\\mu(A)}{\\mu(\\Omega)}',
    description: 'μ为几何度量（长度、面积、体积），样本空间无限但等可能',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '几何概型']
  },

  // 条件概率与三大公式
  {
    id: 'prob-conditional',
    name: '条件概率',
    latex: 'P(A|B) = \\frac{P(AB)}{P(B)}, \\quad P(B) > 0',
    description: '在B已发生的条件下A发生的概率',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '条件概率', '重点']
  },
  {
    id: 'prob-multiplication',
    name: '乘法公式',
    latex: 'P(AB) = P(A)P(B|A) = P(B)P(A|B)',
    description: '推广：P(ABC)=P(A)P(B|A)P(C|AB)',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '乘法公式', '重点']
  },
  {
    id: 'prob-total-probability',
    name: '全概率公式',
    latex: 'P(A) = \\sum_{i=1}^{n} P(B_i)P(A|B_i)',
    description: 'B₁,B₂,...,Bₙ为完备事件组（Ω的分割），则P(A)等于各原因下A的条件概率加权求和',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '全概率公式', '重点']
  },
  {
    id: 'prob-bayes',
    name: '贝叶斯公式',
    latex: 'P(B_j|A) = \\frac{P(B_j)P(A|B_j)}{\\sum_{i=1}^{n} P(B_i)P(A|B_i)}',
    description: '已知结果A，求原因Bⱼ的概率（后验概率）',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '贝叶斯', '重点']
  },

  // 独立性与伯努利
  {
    id: 'prob-independence',
    name: '事件独立性',
    latex: 'P(AB) = P(A)P(B)',
    description: 'A与B独立等价于P(AB)=P(A)P(B)。注意：独立≠互不相容！',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '独立性', '重点']
  },
  {
    id: 'prob-three-independence',
    name: '三事件独立',
    latex: 'P(AB) = P(A)P(B), \\quad P(AC) = P(A)P(C), \\quad P(BC) = P(B)P(C), \\quad P(ABC) = P(A)P(B)P(C)',
    description: '三事件相互独立需四个等式同时成立，两两独立≠相互独立',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '独立性', '重点']
  },
  {
    id: 'prob-bernoulli',
    name: 'n重伯努利概型',
    latex: 'P_n(k) = C_n^k p^k (1-p)^{n-k}, \\quad k=0,1,...,n',
    description: 'n次独立重复试验中事件A恰好发生k次的概率',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '伯努利', '重点']
  },

  // ---- 第二章 一维随机变量及其分布 ----

  // 分布函数
  {
    id: 'prob-cdf-definition',
    name: '分布函数定义',
    latex: 'F(x) = P\\{X \\leq x\\}, \\quad -\\infty < x < +\\infty',
    description: '随机变量X取值不超过x的概率',
    category: '概率论与数理统计-一维随机变量',
    tags: ['分布函数', '定义', '重点']
  },
  {
    id: 'prob-cdf-properties',
    name: '分布函数性质',
    latex: '0 \\leq F(x) \\leq 1; \\quad F(x_1) \\leq F(x_2)(x_1<x_2); \\quad F(-\\infty)=0, F(+\\infty)=1; \\quad F(x+0)=F(x)',
    description: '单调不减、有界、右连续',
    category: '概率论与数理统计-一维随机变量',
    tags: ['分布函数', '性质']
  },

  // 离散型
  {
    id: 'prob-pmf-definition',
    name: '分布律（PMF）',
    latex: 'P\\{X=x_k\\} = p_k, \\quad k=1,2,..., \\quad \\sum_k p_k = 1',
    description: '离散型随机变量取各值的概率列表',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '分布律']
  },
  {
    id: 'prob-discrete-cdf',
    name: '离散型分布函数',
    latex: 'F(x) = \\sum_{x_k \\leq x} p_k',
    description: '离散型随机变量的分布函数是阶梯函数',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '分布函数']
  },

  // 连续型
  {
    id: 'prob-pdf-definition',
    name: '概率密度函数（PDF）',
    latex: 'F(x) = \\int_{-\\infty}^{x} f(t)dt, \\quad f(x) \\geq 0, \\quad \\int_{-\\infty}^{+\\infty} f(x)dx = 1',
    description: '连续型随机变量的分布函数是概率密度的变上限积分',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '密度函数', '重点']
  },
  {
    id: 'prob-pdf-probability',
    name: '连续型概率计算',
    latex: 'P\\{a < X \\leq b\\} = F(b) - F(a) = \\int_a^b f(x)dx',
    description: '连续型随机变量在区间取值的概率等于密度函数在该区间的积分',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '概率计算']
  },
  {
    id: 'prob-pdf-point',
    name: '连续型单点概率',
    latex: 'P\\{X = x_0\\} = 0',
    description: '连续型随机变量取任一确定值的概率为零',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '性质']
  },

  // 常见离散分布
  {
    id: 'prob-dist-01',
    name: '0-1分布（两点分布）',
    latex: 'P\\{X=k\\} = p^k(1-p)^{1-k}, \\quad k=0,1',
    description: '只取0和1两个值，伯努利试验一次的结果',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '0-1分布']
  },
  {
    id: 'prob-dist-binomial',
    name: '二项分布 B(n,p)',
    latex: 'P\\{X=k\\} = C_n^k p^k (1-p)^{n-k}, \\quad k=0,1,...,n',
    description: 'n重伯努利试验中成功次数的分布。E(X)=np, D(X)=np(1-p)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '二项分布', '重点']
  },
  {
    id: 'prob-dist-poisson',
    name: '泊松分布 P(λ)',
    latex: 'P\\{X=k\\} = \\frac{\\lambda^k}{k!}e^{-\\lambda}, \\quad k=0,1,2,...',
    description: '稀有事件模型。E(X)=D(X)=λ。泊松定理：n→∞,np→λ时B(n,p)→P(λ)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '泊松分布', '重点']
  },
  {
    id: 'prob-dist-geometric',
    name: '几何分布 G(p)',
    latex: 'P\\{X=k\\} = (1-p)^{k-1}p, \\quad k=1,2,...',
    description: '首次成功所需的试验次数。无记忆性：P(X>m+n|X>m)=P(X>n)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '几何分布']
  },
  {
    id: 'prob-dist-hypergeometric',
    name: '超几何分布 H(n,M,N)',
    latex: 'P\\{X=k\\} = \\frac{C_M^k C_{N-M}^{n-k}}{C_N^n}',
    description: '不放回抽样中成功次数的分布。N→∞时趋于B(n,M/N)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['离散', '超几何分布']
  },

  // 常见连续分布
  {
    id: 'prob-dist-uniform',
    name: '均匀分布 U(a,b)',
    latex: 'f(x) = \\begin{cases} \\frac{1}{b-a}, & a \\leq x \\leq b \\\\ 0, & \\text{其他} \\end{cases}',
    description: 'E(X)=(a+b)/2, D(X)=(b-a)²/12',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '均匀分布']
  },
  {
    id: 'prob-dist-exponential',
    name: '指数分布 Exp(λ)',
    latex: 'f(x) = \\begin{cases} \\lambda e^{-\\lambda x}, & x > 0 \\\\ 0, & x \\leq 0 \\end{cases}',
    description: 'E(X)=1/λ, D(X)=1/λ²。无记忆性：P(X>s+t|X>s)=P(X>t)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '指数分布', '重点']
  },
  {
    id: 'prob-dist-normal',
    name: '正态分布 N(μ,σ²)',
    latex: 'f(x) = \\frac{1}{\\sqrt{2\\pi}\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}, \\quad -\\infty < x < +\\infty',
    description: 'E(X)=μ, D(X)=σ²。钟形曲线，关于x=μ对称',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '正态分布', '重点']
  },
  {
    id: 'prob-standard-normal',
    name: '标准正态分布 N(0,1)',
    latex: '\\varphi(x) = \\frac{1}{\\sqrt{2\\pi}}e^{-\\frac{x^2}{2}}, \\quad \\Phi(x) = \\int_{-\\infty}^x \\varphi(t)dt',
    description: 'Φ(-x)=1-Φ(x), Φ(0)=0.5。标准化：Z=(X-μ)/σ ~ N(0,1)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '正态分布', '重点']
  },
  {
    id: 'prob-normal-standardize',
    name: '正态分布标准化',
    latex: 'X \\sim N(\\mu, \\sigma^2) \\Rightarrow Z = \\frac{X-\\mu}{\\sigma} \\sim N(0,1)',
    description: 'P{a<X<b}=Φ((b-μ)/σ)-Φ((a-μ)/σ)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '正态分布', '重点']
  },
  {
    id: 'prob-normal-3sigma',
    name: '正态分布3σ原则',
    latex: 'P\\{|X-\\mu|<\\sigma\\} \\approx 0.6826, \\quad P\\{|X-\\mu|<2\\sigma\\} \\approx 0.9544, \\quad P\\{|X-\\mu|<3\\sigma\\} \\approx 0.9974',
    description: '数据分别落在μ±σ、μ±2σ、μ±3σ内的概率',
    category: '概率论与数理统计-一维随机变量',
    tags: ['连续', '正态分布']
  },

  // 随机变量函数的分布
  {
    id: 'prob-function-discrete',
    name: '离散型函数分布',
    latex: 'Y=g(X): \\quad P\\{Y=y_j\\} = \\sum_{g(x_i)=y_j} P\\{X=x_i\\}',
    description: '将X的取值通过g映射，合并相同yⱼ对应的概率',
    category: '概率论与数理统计-一维随机变量',
    tags: ['函数分布']
  },
  {
    id: 'prob-function-continuous',
    name: '连续型函数分布（公式法）',
    latex: 'y=g(x)\\text{单调可导}: f_Y(y) = \\begin{cases} f_X(h(y))|h\'(y)|, & \\alpha<y<\\beta \\\\ 0, & \\text{其他} \\end{cases}',
    description: 'h=g⁻¹为反函数，α=min(g(±∞))，β=max(g(±∞))',
    category: '概率论与数理统计-一维随机变量',
    tags: ['函数分布', '重点']
  },
  {
    id: 'prob-function-cdf-method',
    name: '分布函数法',
    latex: 'F_Y(y) = P\\{Y \\leq y\\} = P\\{g(X) \\leq y\\}, \\quad f_Y(y) = F_Y\'(y)',
    description: '先求Y的分布函数，再求导得密度。适用于g非单调的情形',
    category: '概率论与数理统计-一维随机变量',
    tags: ['函数分布', '重点']
  },

  // ---- 第三章 二维随机变量及其分布 ----

  {
    id: 'prob-joint-cdf',
    name: '联合分布函数',
    latex: 'F(x,y) = P\\{X \\leq x, Y \\leq y\\}',
    description: 'X不超过x且Y不超过y的概率',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '分布函数', '重点']
  },
  {
    id: 'prob-joint-cdf-properties',
    name: '联合分布函数性质',
    latex: 'F(-\\infty,y)=F(x,-\\infty)=0; \\quad F(+\\infty,+\\infty)=1; \\quad F\\text{关于}x,y\\text{单调不减且右连续}',
    description: '有界性、单调性、右连续性',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '分布函数']
  },
  {
    id: 'prob-joint-pmf',
    name: '二维离散型联合分布律',
    latex: 'P\\{X=x_i, Y=y_j\\} = p_{ij}, \\quad \\sum_i\\sum_j p_{ij} = 1',
    description: '二维离散型随机变量取各对值的概率',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '离散']
  },
  {
    id: 'prob-joint-pdf',
    name: '二维连续型联合密度',
    latex: 'F(x,y) = \\int_{-\\infty}^{x}\\int_{-\\infty}^{y} f(u,v)dudv',
    description: '联合分布函数是联合密度的二重积分',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '连续', '重点']
  },
  {
    id: 'prob-joint-pdf-probability',
    name: '二维概率计算',
    latex: 'P\\{(X,Y) \\in D\\} = \\iint_D f(x,y)dxdy',
    description: '二维随机变量落入区域D的概率等于联合密度在D上的二重积分',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '概率计算', '重点']
  },
  {
    id: 'prob-marginal-pmf',
    name: '边缘分布律',
    latex: 'p_{i\\cdot} = \\sum_j p_{ij}, \\quad p_{\\cdot j} = \\sum_i p_{ij}',
    description: '对联合分布律按行或按列求和',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '边缘分布']
  },
  {
    id: 'prob-marginal-pdf',
    name: '边缘密度函数',
    latex: 'f_X(x) = \\int_{-\\infty}^{+\\infty} f(x,y)dy, \\quad f_Y(y) = \\int_{-\\infty}^{+\\infty} f(x,y)dx',
    description: '对联合密度求另一个变量的积分得边缘密度',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '边缘分布', '重点']
  },
  {
    id: 'prob-conditional-pmf',
    name: '条件分布律',
    latex: 'P\\{X=x_i|Y=y_j\\} = \\frac{p_{ij}}{p_{\\cdot j}}, \\quad P\\{Y=y_j|X=x_i\\} = \\frac{p_{ij}}{p_{i\\cdot}}',
    description: '在Y=yⱼ条件下X的分布律',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '条件分布']
  },
  {
    id: 'prob-conditional-pdf',
    name: '条件密度函数',
    latex: 'f_{X|Y}(x|y) = \\frac{f(x,y)}{f_Y(y)}, \\quad f_{Y|X}(y|x) = \\frac{f(x,y)}{f_X(x)}',
    description: '联合密度除以边缘密度得条件密度',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '条件分布', '重点']
  },
  {
    id: 'prob-2d-independence',
    name: '随机变量独立性',
    latex: 'F(x,y) = F_X(x)F_Y(y) \\Leftrightarrow f(x,y) = f_X(x)f_Y(y) \\Leftrightarrow p_{ij} = p_{i\\cdot}p_{\\cdot j}',
    description: '联合分布等于边缘分布之积。连续型：f(x,y)=f_X(x)f_Y(y)；离散型：pᵢⱼ=pᵢ·p·ⱼ',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '独立性', '重点']
  },
  {
    id: 'prob-2d-uniform',
    name: '二维均匀分布',
    latex: 'f(x,y) = \\begin{cases} \\frac{1}{S_D}, & (x,y) \\in D \\\\ 0, & \\text{其他} \\end{cases}',
    description: 'S_D为区域D的面积，在D上等可能取值',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '均匀分布']
  },
  {
    id: 'prob-2d-normal',
    name: '二维正态分布',
    latex: '(X,Y) \\sim N(\\mu_1,\\mu_2,\\sigma_1^2,\\sigma_2^2,\\rho)',
    description: '五个参数：μ₁,μ₂为均值，σ₁²,σ₂²为方差，ρ为相关系数。边缘分布为一维正态；X,Y独立⟺ρ=0',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '正态分布', '重点']
  },

  // 二维函数分布
  {
    id: 'prob-2d-function-z',
    name: 'Z=X+Y的密度',
    latex: 'f_Z(z) = \\int_{-\\infty}^{+\\infty} f(x,z-x)dx \\quad (\\text{卷积公式})',
    description: '独立时：f_Z(z)=∫f_X(x)f_Y(z-x)dx',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '函数分布', '重点']
  },
  {
    id: 'prob-2d-function-max-min',
    name: '最大值与最小值分布',
    latex: 'F_{\\max}(z) = F_X(z)F_Y(z), \\quad F_{\\min}(z) = 1-[1-F_X(z)][1-F_Y(z)]',
    description: 'X,Y独立时：M=max(X,Y)的分布函数为各自之积；N=min(X,Y)的分布函数用对立事件求',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维', '函数分布', '重点']
  },

  // ---- 第四章 随机变量的数字特征 ----

  {
    id: 'prob-expectation-discrete',
    name: '离散型期望',
    latex: 'E(X) = \\sum_{i=1}^{\\infty} x_i p_i',
    description: '随机变量取值以概率为权的加权平均',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '定义', '重点']
  },
  {
    id: 'prob-expectation-continuous',
    name: '连续型期望',
    latex: 'E(X) = \\int_{-\\infty}^{+\\infty} x f(x)dx',
    description: '随机变量取值以密度为权的加权积分',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '定义', '重点']
  },
  {
    id: 'prob-expectation-function',
    name: '随机变量函数的期望',
    latex: 'E[g(X)] = \\sum_i g(x_i)p_i \\quad \\text{或} \\quad E[g(X)] = \\int_{-\\infty}^{+\\infty} g(x)f(x)dx',
    description: '不需要先求Y=g(X)的分布，直接用X的分布计算',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '重点']
  },
  {
    id: 'prob-expectation-2d-function',
    name: '二维函数的期望',
    latex: 'E[g(X,Y)] = \\sum_i\\sum_j g(x_i,y_j)p_{ij} \\quad \\text{或} \\quad \\int\\int g(x,y)f(x,y)dxdy',
    description: '不需要先求Z=g(X,Y)的分布',
    category: '概率论与数理统计-数字特征',
    tags: ['期望']
  },
  {
    id: 'prob-expectation-properties',
    name: '期望的性质',
    latex: 'E(C)=C; \\quad E(aX+b)=aE(X)+b; \\quad E(X+Y)=E(X)+E(Y); \\quad E(XY)=E(X)E(Y)\\text{（独立时）}',
    description: '线性性、可加性、独立时可乘性',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '性质']
  },
  {
    id: 'prob-variance-definition',
    name: '方差定义',
    latex: 'D(X) = E[(X-EX)^2] = E(X^2) - [E(X)]^2',
    description: '衡量随机变量取值偏离均值的程度。计算常用公式：D(X)=E(X²)-[E(X)]²',
    category: '概率论与数理统计-数字特征',
    tags: ['方差', '定义', '重点']
  },
  {
    id: 'prob-variance-properties',
    name: '方差的性质',
    latex: 'D(C)=0; \\quad D(aX+b)=a^2D(X); \\quad D(X \\pm Y)=D(X)+D(Y) \\pm 2Cov(X,Y)',
    description: '独立时D(X±Y)=D(X)+D(Y)，注意加减号方差相同！',
    category: '概率论与数理统计-数字特征',
    tags: ['方差', '性质', '重点']
  },
  {
    id: 'prob-covariance',
    name: '协方差',
    latex: 'Cov(X,Y) = E[(X-EX)(Y-EY)] = E(XY) - E(X)E(Y)',
    description: '衡量X与Y的线性相关程度。Cov(X,X)=D(X)',
    category: '概率论与数理统计-数字特征',
    tags: ['协方差', '重点']
  },
  {
    id: 'prob-covariance-properties',
    name: '协方差的性质',
    latex: 'Cov(X,Y)=Cov(Y,X); \\quad Cov(aX,bY)=ab\\cdot Cov(X,Y); \\quad Cov(X_1+X_2,Y)=Cov(X_1,Y)+Cov(X_2,Y)',
    description: '对称性、双线性、可加性',
    category: '概率论与数理统计-数字特征',
    tags: ['协方差', '性质']
  },
  {
    id: 'prob-correlation',
    name: '相关系数',
    latex: '\\rho_{XY} = \\frac{Cov(X,Y)}{\\sqrt{D(X)}\\sqrt{D(Y)}}',
    description: '|ρ|≤1，ρ=0称不相关。不相关≠独立（正态除外）。|ρ|=1⟺P{Y=aX+b}=1',
    category: '概率论与数理统计-数字特征',
    tags: ['相关系数', '重点']
  },
  {
    id: 'prob-correlation-independence',
    name: '不相关与独立的关系',
    latex: '\\rho=0 \\Leftrightarrow Cov(X,Y)=0 \\Leftrightarrow E(XY)=E(X)E(Y) \\Leftrightarrow D(X \\pm Y)=D(X)+D(Y)',
    description: '独立⟹不相关，不相关⇏独立。但二维正态：独立⟺不相关',
    category: '概率论与数理统计-数字特征',
    tags: ['相关系数', '独立性', '重点']
  },
  {
    id: 'prob-moment',
    name: '矩',
    latex: 'k\\text{阶原点矩}: E(X^k); \\quad k\\text{阶中心矩}: E[(X-EX)^k]',
    description: '期望是一阶原点矩，方差是二阶中心矩',
    category: '概率论与数理统计-数字特征',
    tags: ['矩']
  },

  // 常见分布的数字特征汇总
  {
    id: 'prob-common-dist-params',
    name: '常见分布期望方差汇总',
    latex: 'B(n,p):\\mu=np,\\sigma^2=npq; \\quad P(\\lambda):\\mu=\\lambda,\\sigma^2=\\lambda; \\quad U(a,b):\\mu=\\frac{a+b}{2},\\sigma^2=\\frac{(b-a)^2}{12}',
    description: 'Exp(λ):μ=1/λ,σ²=1/λ²; N(μ,σ²):μ=μ,σ²=σ²; 几何分布G(p):μ=1/p,σ²=(1-p)/p²',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '方差', '汇总', '重点']
  },

  // ---- 第五章 大数定律与中心极限定理 ----

  {
    id: 'prob-chebyshev',
    name: '切比雪夫不等式',
    latex: 'P\\{|X-EX| \\geq \\varepsilon\\} \\leq \\frac{D(X)}{\\varepsilon^2}',
    description: '不需要知道分布，只需知道期望和方差即可估计概率',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['切比雪夫', '重点']
  },
  {
    id: 'prob-khinchin',
    name: '辛钦大数定律',
    latex: '\\frac{1}{n}\\sum_{i=1}^{n} X_i \\xrightarrow{P} \\mu, \\quad X_i\\text{独立同分布}, E(X_i)=\\mu',
    description: '独立同分布随机变量的算术平均依概率收敛于期望',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['大数定律']
  },
  {
    id: 'prob-bernoulli-lln',
    name: '伯努利大数定律',
    latex: '\\frac{n_A}{n} \\xrightarrow{P} p, \\quad n_A \\sim B(n,p)',
    description: '频率依概率收敛于概率，是频率稳定性的理论依据',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['大数定律']
  },
  {
    id: 'prob-clt',
    name: '列维-林德伯格定理（独立同分布CLT）',
    latex: '\\frac{\\sum_{i=1}^{n}X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0,1)',
    description: '独立同分布随机变量之和的标准化近似服从标准正态分布（n足够大时）',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['中心极限定理', '重点']
  },
  {
    id: 'prob-demovre-laplace',
    name: '棣莫弗-拉普拉斯定理',
    latex: '\\frac{X_n - np}{\\sqrt{np(1-p)}} \\xrightarrow{d} N(0,1), \\quad X_n \\sim B(n,p)',
    description: '二项分布的正态近似，n足够大时B(n,p)≈N(np,npq)',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['中心极限定理', '重点']
  },

  // ---- 第六章 数理统计基本概念 ----

  {
    id: 'stat-population-sample',
    name: '总体与样本',
    latex: 'X_1, X_2, ..., X_n \\text{独立同分布}, \\quad X_i \\sim F(x)',
    description: '样本是与总体同分布且相互独立的随机变量',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['统计', '基础']
  },
  {
    id: 'stat-sample-mean',
    name: '样本均值',
    latex: '\\bar{X} = \\frac{1}{n}\\sum_{i=1}^{n} X_i',
    description: 'E(X̄)=μ, D(X̄)=σ²/n',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['统计量', '重点']
  },
  {
    id: 'stat-sample-variance',
    name: '样本方差',
    latex: 'S^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(X_i - \\bar{X})^2',
    description: '注意分母是n-1不是n！E(S²)=σ²，S²是σ²的无偏估计',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['统计量', '重点']
  },
  {
    id: 'stat-sample-moments',
    name: '样本k阶矩',
    latex: 'A_k = \\frac{1}{n}\\sum_{i=1}^{n}X_i^k, \\quad B_k = \\frac{1}{n}\\sum_{i=1}^{n}(X_i-\\bar{X})^k',
    description: 'A_k为样本k阶原点矩，B_k为样本k阶中心矩',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['统计量']
  },

  // 抽样分布
  {
    id: 'stat-chisquare',
    name: 'χ²分布',
    latex: '\\chi^2 = \\sum_{i=1}^{n} X_i^2, \\quad X_i \\sim N(0,1) \\Rightarrow \\chi^2 \\sim \\chi^2(n)',
    description: 'n个标准正态的平方和。E(χ²)=n, D(χ²)=2n。可加性：χ₁²+χ₂²~χ²(n₁+n₂)',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '重点']
  },
  {
    id: 'stat-t-distribution',
    name: 't分布',
    latex: 'T = \\frac{X}{\\sqrt{Y/n}}, \\quad X\\sim N(0,1), Y\\sim\\chi^2(n) \\Rightarrow T \\sim t(n)',
    description: '标准正态除以χ²/n的平方根。对称分布，n→∞时趋于N(0,1)',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '重点']
  },
  {
    id: 'stat-f-distribution',
    name: 'F分布',
    latex: 'F = \\frac{X/n_1}{Y/n_2}, \\quad X\\sim\\chi^2(n_1), Y\\sim\\chi^2(n_2) \\Rightarrow F \\sim F(n_1,n_2)',
    description: '两个χ²分别除以自由度之比。1/F~F(n₂,n₁)',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '重点']
  },
  {
    id: 'stat-normal-sample',
    name: '正态总体抽样分布',
    latex: '\\bar{X} \\sim N(\\mu, \\frac{\\sigma^2}{n}), \\quad \\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1), \\quad \\bar{X}\\text{与}S^2\\text{独立}',
    description: '正态总体最重要的抽样分布结论',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '重点']
  },
  {
    id: 'stat-t-test-statistic',
    name: '正态总体t统计量',
    latex: 'T = \\frac{\\bar{X}-\\mu}{S/\\sqrt{n}} \\sim t(n-1)',
    description: 'σ未知时用S代替σ，服从t(n-1)',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '重点']
  },

  // 分位数
  {
    id: 'stat-quantile',
    name: '上α分位数',
    latex: 'P\\{X > x_\\alpha\\} = \\alpha',
    description: '标准正态：z_α满足P{Z>z_α}=α。性质：z₁₋_α=-z_α',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['分位数']
  },

  // ---- 第七章 参数估计 ----

  {
    id: 'stat-moment-estimation',
    name: '矩估计法',
    latex: 'E(X^k) = \\frac{1}{n}\\sum_{i=1}^{n}X_i^k = A_k',
    description: '用样本矩代替总体矩，解出未知参数。一阶矩求一个参数，二阶矩求两个参数',
    category: '概率论与数理统计-参数估计',
    tags: ['点估计', '矩估计', '重点']
  },
  {
    id: 'stat-mle',
    name: '最大似然估计',
    latex: 'L(\\theta) = \\prod_{i=1}^{n} f(x_i;\\theta), \\quad \\hat{\\theta} = \\arg\\max_\\theta L(\\theta)',
    description: '使样本出现概率最大的参数值。取对数：ln L(θ)，对θ求导令其为零',
    category: '概率论与数理统计-参数估计',
    tags: ['点估计', '最大似然', '重点']
  },
  {
    id: 'stat-unbiased',
    name: '无偏性',
    latex: 'E(\\hat{\\theta}) = \\theta',
    description: '估计量的期望等于被估参数',
    category: '概率论与数理统计-参数估计',
    tags: ['估计评价', '无偏', '重点']
  },
  {
    id: 'stat-efficiency',
    name: '有效性',
    latex: '\\hat{\\theta}_1\\text{比}\\hat{\\theta}_2\\text{有效} \\Leftrightarrow D(\\hat{\\theta}_1) < D(\\hat{\\theta}_2)',
    description: '都是无偏估计时，方差小者更有效',
    category: '概率论与数理统计-参数估计',
    tags: ['估计评价']
  },
  {
    id: 'stat-consistency',
    name: '一致性（相合性）',
    latex: '\\hat{\\theta}_n \\xrightarrow{P} \\theta \\quad (n \\to \\infty)',
    description: '样本量增大时估计量依概率收敛于真值',
    category: '概率论与数理统计-参数估计',
    tags: ['估计评价']
  },

  // 区间估计
  {
    id: 'stat-ci-sigma-known',
    name: 'σ已知时μ的置信区间',
    latex: '\\left[\\bar{X} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}, \\quad \\bar{X} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\right]',
    description: '置信水平1-α，用正态分位数',
    category: '概率论与数理统计-参数估计',
    tags: ['区间估计', '重点']
  },
  {
    id: 'stat-ci-sigma-unknown',
    name: 'σ未知时μ的置信区间',
    latex: '\\left[\\bar{X} - t_{\\alpha/2}(n-1)\\frac{S}{\\sqrt{n}}, \\quad \\bar{X} + t_{\\alpha/2}(n-1)\\frac{S}{\\sqrt{n}}\\right]',
    description: '用t分布分位数，自由度n-1',
    category: '概率论与数理统计-参数估计',
    tags: ['区间估计', '重点']
  },
  {
    id: 'stat-ci-variance',
    name: 'σ²的置信区间',
    latex: '\\left[\\frac{(n-1)S^2}{\\chi^2_{\\alpha/2}(n-1)}, \\quad \\frac{(n-1)S^2}{\\chi^2_{1-\\alpha/2}(n-1)}\\right]',
    description: '用χ²分布分位数',
    category: '概率论与数理统计-参数估计',
    tags: ['区间估计']
  },

  // ---- 第八章 假设检验 ----

  {
    id: 'stat-hypothesis-basics',
    name: '假设检验基本思想',
    latex: 'H_0\\text{（原假设）} \\xrightarrow{\\text{小概率原理}} \\text{拒绝或接受}',
    description: '小概率事件在一次试验中几乎不可能发生。若H₀下出现小概率事件，则拒绝H₀',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', '基础']
  },
  {
    id: 'stat-error-types',
    name: '两类错误',
    latex: '\\text{第一类错误（弃真）}: P\\{\\text{拒}H_0|H_0\\text{真}\\}=\\alpha; \\quad \\text{第二类错误（取伪）}: P\\{\\text{受}H_0|H_0\\text{假}\\}=\\beta',
    description: 'α为显著性水平，样本量固定时减小α则β增大',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', '两类错误']
  },
  {
    id: 'stat-z-test',
    name: 'Z检验（σ已知检验μ）',
    latex: 'Z = \\frac{\\bar{X} - \\mu_0}{\\sigma/\\sqrt{n}}, \\quad |Z| > z_{\\alpha/2} \\Rightarrow \\text{拒绝}H_0',
    description: 'σ已知时检验均值是否等于μ₀',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', 'Z检验']
  },
  {
    id: 'stat-t-test',
    name: 't检验（σ未知检验μ）',
    latex: 'T = \\frac{\\bar{X} - \\mu_0}{S/\\sqrt{n}}, \\quad |T| > t_{\\alpha/2}(n-1) \\Rightarrow \\text{拒绝}H_0',
    description: 'σ未知时检验均值，用样本标准差S代替σ',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', 't检验', '重点']
  },
  {
    id: 'stat-chisquare-test',
    name: 'χ²检验（检验σ²）',
    latex: '\\chi^2 = \\frac{(n-1)S^2}{\\sigma_0^2}, \\quad \\chi^2 > \\chi^2_{\\alpha/2}(n-1)\\text{或}<\\chi^2_{1-\\alpha/2}(n-1) \\Rightarrow \\text{拒}H_0',
    description: '检验方差是否等于σ₀²',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', 'χ²检验']
  },
  {
    id: 'stat-f-test',
    name: 'F检验（两总体方差比较）',
    latex: 'F = \\frac{S_1^2}{S_2^2}, \\quad F > F_{\\alpha/2}(n_1-1,n_2-1) \\Rightarrow \\text{拒绝}H_0',
    description: '检验两个正态总体的方差是否相等',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', 'F检验']
  },

  // ============================================================
  //  二级结论与拓展公式
  // ============================================================

  // ---- 第一章 随机事件和概率 - 二级结论 ----
  {
    id: 'prob-2nd-inclusion-exclusion',
    name: '容斥原理（n个事件）',
    latex: 'P\\left(\\bigcup_{i=1}^{n}A_i\\right) = \\sum_{i}P(A_i) - \\sum_{i<j}P(A_iA_j) + \\sum_{i<j<k}P(A_iA_jA_k) - \\cdots + (-1)^{n-1}P(A_1A_2\\cdots A_n)',
    description: '推广的加法公式，交替加减。常考n=3的情形',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '容斥原理', '二级结论']
  },
  {
    id: 'prob-2nd-complement-trick',
    name: '对立事件转化法',
    latex: 'P\\left(\\bigcup_{i=1}^{n}A_i\\right) = 1 - P\\left(\\bigcap_{i=1}^{n}\\bar{A}_i\\right) = 1 - \\prod_{i=1}^{n}P(\\bar{A}_i)\\;(\\text{独立时})',
    description: '求"至少一个发生"的利器。独立时：1-全不发生的概率',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '对立事件', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-partition-identify',
    name: '完备事件组识别法',
    latex: 'B_1,B_2,\\ldots,B_n\\text{为完备组} \\Leftrightarrow \\begin{cases} B_iB_j=\\emptyset(i\\neq j) \\\\ \\bigcup_{i=1}^n B_i=\\Omega \\end{cases}',
    description: '全概率/贝叶斯必用。常见完备组：{A,Ā}、{B₁,...,Bₙ}互斥且覆盖Ω',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '完备事件组', '二级结论']
  },
  {
    id: 'prob-2nd-bayes-update',
    name: '贝叶斯后验概率的序贯更新',
    latex: 'P(B|A_1A_2) = \\frac{P(B)P(A_1A_2|B)}{P(B)P(A_1A_2|B)+P(\\bar{B})P(A_1A_2|\\bar{B})}',
    description: '多次观测后逐步更新后验概率，是贝叶斯推断的序贯思想',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '贝叶斯', '二级结论']
  },
  {
    id: 'prob-2nd-independent-three-event',
    name: '三事件相互独立的四个条件',
    latex: '\\begin{cases} P(AB)=P(A)P(B) \\\\ P(AC)=P(A)P(C) \\\\ P(BC)=P(B)P(C) \\\\ P(ABC)=P(A)P(B)P(C) \\end{cases}',
    description: '三事件相互独立需同时满足4个等式。两两独立≠相互独立！',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '独立性', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-birthday',
    name: '生日问题（分房问题公式）',
    latex: 'P(\\text{n人中至少两人生日相同}) = 1 - \\frac{365!}{365^n(365-n)!}',
    description: 'n=23时概率超过50%，n=50时约97%。分房问题：将n球放m房，某房有≥2球的概率',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '古典概型', '二级结论']
  },
  {
    id: 'prob-2nd-odds-formula',
    name: '事件的赔率与概率互化',
    latex: '\\text{赔率}O(A) = \\frac{P(A)}{1-P(A)}, \\quad P(A) = \\frac{O(A)}{1+O(A)}',
    description: '赔率O(A)=a:b意味着P(A)=a/(a+b)。博彩和决策论中常用',
    category: '概率论与数理统计-随机事件和概率',
    tags: ['概率', '赔率', '二级结论']
  },

  // ---- 第二章 一维随机变量 - 二级结论 ----
  {
    id: 'prob-2nd-cdf-prob-table',
    name: '用F(x)求概率的完整公式表',
    latex: '\\begin{aligned} P\\{X \\le b\\} &= F(b) \\\\ P\\{X > a\\} &= 1-F(a) \\\\ P\\{a<X\\le b\\} &= F(b)-F(a) \\\\ P\\{X=a\\} &= F(a)-F(a-0) \\end{aligned}',
    description: '四条核心公式。注意F(a-0)=lim(t→a⁻)F(t)，用于求单点概率',
    category: '概率论与数理统计-一维随机变量',
    tags: ['分布函数', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-discrete-cdf-step',
    name: '离散型分布函数的阶梯跳跃',
    latex: 'F(x) = \\sum_{x_k \\le x} p_k, \\quad P\\{X=x_k\\} = F(x_k) - F(x_k^-)',
    description: '分布函数在xₖ处跳跃，跳跃高度=该点概率pₖ',
    category: '概率论与数理统计-一维随机变量',
    tags: ['分布函数', '二级结论']
  },
  {
    id: 'prob-2nd-binomial-mode',
    name: '二项分布的最可能值',
    latex: 'k_0 = \\lfloor (n+1)p \\rfloor, \\quad \\text{当}(n+1)p\\text{为整数时}, k_0\\text{和}k_0-1\\text{并列最可能}',
    description: '二项分布B(n,p)取概率最大的k值。例如B(10,0.3)最可能值k₀=3',
    category: '概率论与数理统计-一维随机变量',
    tags: ['二项分布', '二级结论']
  },
  {
    id: 'prob-2nd-binomial-recurrence',
    name: '二项分布递推公式',
    latex: 'P(X=k+1) = \\frac{n-k}{k+1} \\cdot \\frac{p}{1-p} \\cdot P(X=k)',
    description: '避免计算组合数，从P(X=0)=(1-p)ⁿ出发逐项递推',
    category: '概率论与数理统计-一维随机变量',
    tags: ['二项分布', '二级结论']
  },
  {
    id: 'prob-2nd-poisson-approx',
    name: '泊松定理（二项→泊松近似）',
    latex: 'C_n^k p^k(1-p)^{n-k} \\approx \\frac{\\lambda^k}{k!}e^{-\\lambda}, \\quad \\lambda=np,\\; n\\ge 20,\\; p\\le 0.05',
    description: '当n大p小时，B(n,p)≈P(λ)，其中λ=np。n≥100,p≤0.1时效果更好',
    category: '概率论与数理统计-一维随机变量',
    tags: ['泊松分布', '近似', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-poisson-additivity',
    name: '泊松分布的可加性',
    latex: 'X \\sim P(\\lambda_1), \\; Y \\sim P(\\lambda_2), \\; X,Y\\text{独立} \\Rightarrow X+Y \\sim P(\\lambda_1+\\lambda_2)',
    description: '独立泊松变量之和仍为泊松分布。推广：∑Xᵢ~P(∑λᵢ)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['泊松分布', '二级结论']
  },
  {
    id: 'prob-2nd-exp-memoryless',
    name: '指数分布的无记忆性',
    latex: 'P\\{X>s+t\\,|\\,X>s\\} = P\\{X>t\\}, \\quad X\\sim Exp(\\lambda)',
    description: '"已经等待了s时间"不影响"还需等待t时间"的概率。指数分布是唯一具有无记忆性的连续分布',
    category: '概率论与数理统计-一维随机变量',
    tags: ['指数分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-normal-symmetry',
    name: '标准正态分布的对称公式',
    latex: '\\varphi(-x)=\\varphi(x), \\quad \\Phi(-x)=1-\\Phi(x), \\quad P\\{|X|<a\\}=2\\Phi(a)-1',
    description: '正态分布关于μ对称的直接推论。X~N(0,1)时P{|X|<a}=2Φ(a)-1',
    category: '概率论与数理统计-一维随机变量',
    tags: ['正态分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-normal-linear',
    name: '正态变量的线性变换',
    latex: 'X\\sim N(\\mu,\\sigma^2) \\Rightarrow aX+b \\sim N(a\\mu+b, a^2\\sigma^2)',
    description: '正态变量的线性变换仍为正态。特别：a=1/σ,b=-μ/σ即标准化',
    category: '概率论与数理统计-一维随机变量',
    tags: ['正态分布', '二级结论']
  },
  {
    id: 'prob-2nd-normal-sum-diff',
    name: '独立正态变量的和与差',
    latex: 'X\\sim N(\\mu_1,\\sigma_1^2),\\;Y\\sim N(\\mu_2,\\sigma_2^2),\\;\\text{独立} \\Rightarrow X\\pm Y\\sim N(\\mu_1\\pm\\mu_2,\\sigma_1^2+\\sigma_2^2)',
    description: '和与差的方差都是σ₁²+σ₂²（注意不是减！），因为D(X-Y)=D(X)+D(Y)',
    category: '概率论与数理统计-一维随机变量',
    tags: ['正态分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-rv-function-monotone',
    name: '单调函数的密度公式',
    latex: 'f_Y(y) = f_X(h(y))|h^{\\prime}(y)|, \\quad y=g(x)\\text{单调},\\; x=h(y)\\text{为反函数}',
    description: 'y的取值范围(α,β)由g的值域确定。注意|h′(y)|取绝对值',
    category: '概率论与数理统计-一维随机变量',
    tags: ['函数分布', '二级结论', '重点']
  },

  // ---- 第三章 二维随机变量 - 二级结论 ----
  {
    id: 'prob-2nd-joint-to-marginal',
    name: '联合→边缘不可逆',
    latex: 'f(x,y) \\xrightarrow{\\text{积分}} f_X(x),\\,f_Y(y), \\quad \\text{但} f_X(x)f_Y(y) \\not\\xrightarrow{\\text{还原}} f(x,y)',
    description: '边缘分布不能唯一确定联合分布（除非独立）。相同边缘可对应不同联合',
    category: '概率论与数理统计-二维随机变量',
    tags: ['边缘分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-2d-normal-marginal',
    name: '二维正态的边缘分布',
    latex: '(X,Y)\\sim N(\\mu_1,\\mu_2,\\sigma_1^2,\\sigma_2^2,\\rho) \\Rightarrow X\\sim N(\\mu_1,\\sigma_1^2),\\;Y\\sim N(\\mu_2,\\sigma_2^2)',
    description: '边缘分布不含ρ！即ρ的不同取值对应相同边缘分布',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维正态', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-2d-normal-independence',
    name: '二维正态独立的充要条件',
    latex: '(X,Y)\\sim N(\\mu_1,\\mu_2,\\sigma_1^2,\\sigma_2^2,\\rho) \\Rightarrow X,Y\\text{独立} \\Leftrightarrow \\rho=0',
    description: '正态分布是唯一的"独立⟺不相关"的分布！其他分布不成立',
    category: '概率论与数理统计-二维随机变量',
    tags: ['二维正态', '独立性', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-convolution',
    name: '卷积公式（和的分布）',
    latex: 'f_{X+Y}(z) = \\int_{-\\infty}^{+\\infty} f(x,z-x)dx = \\int_{-\\infty}^{+\\infty} f(z-y,y)dy',
    description: '当X,Y独立时：f_{X+Y}(z)=∫f_X(x)f_Y(z-x)dx',
    category: '概率论与数理统计-二维随机变量',
    tags: ['卷积', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-max-min-cdf',
    name: '最值分布的分布函数',
    latex: 'F_{\\max}(z) = F_X(z)F_Y(z), \\quad F_{\\min}(z) = 1-[1-F_X(z)][1-F_Y(z)]',
    description: 'X,Y独立时。max的CDF=各CDF之积；min的CDF=1减各互补CDF之积',
    category: '概率论与数理统计-二维随机变量',
    tags: ['最值分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-independence-factorization',
    name: '独立的因子分解判断法',
    latex: 'X,Y\\text{独立} \\Leftrightarrow f(x,y)=f_X(x)\\cdot f_Y(y)=g(x)\\cdot h(y)',
    description: '联合密度可分离为x和y的函数之积。注意定义域也必须是矩形区域',
    category: '概率论与数理统计-二维随机变量',
    tags: ['独立性', '二级结论']
  },
  {
    id: 'prob-2nd-quotient-density',
    name: '商的密度函数',
    latex: 'f_{X/Y}(z) = \\int_{-\\infty}^{+\\infty} |y| f(yz,y)dy, \\quad X,Y\\text{独立时}=\\int |y|f_X(yz)f_Y(y)dy',
    description: '注意被积函数中的|y|因子，容易遗漏',
    category: '概率论与数理统计-二维随机变量',
    tags: ['商分布', '二级结论']
  },

  // ---- 第四章 数字特征 - 二级结论 ----
  {
    id: 'prob-2nd-var-compute',
    name: '方差计算公式',
    latex: 'D(X) = E(X^2) - [E(X)]^2',
    description: '最常用的方差计算公式。E(X²)常通过E[g(X)]公式计算',
    category: '概率论与数理统计-数字特征',
    tags: ['方差', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-expectation-linear',
    name: '期望的线性性（无条件成立）',
    latex: 'E(aX+bY+c) = aE(X)+bE(Y)+c',
    description: '不需要X,Y独立！这是期望最强大的性质。E(X-Y)=E(X)-E(Y)也总是成立',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-var-sum-diff',
    name: '方差和差公式',
    latex: 'D(X \\pm Y) = D(X)+D(Y) \\pm 2Cov(X,Y)',
    description: '独立时Cov=0，则D(X±Y)=D(X)+D(Y)。注意和与差的方差相同（当独立时）',
    category: '概率论与数理统计-数字特征',
    tags: ['方差', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-cov-equivalent',
    name: '协方差的等价形式',
    latex: 'Cov(X,Y) = E(XY)-E(X)E(Y) = E[(X-EX)(Y-EY)]',
    description: '计算协方差首选E(XY)-E(X)E(Y)，避免了先求中心化变量',
    category: '概率论与数理统计-数字特征',
    tags: ['协方差', '二级结论']
  },
  {
    id: 'prob-2nd-cov-linear',
    name: '协方差的线性性',
    latex: 'Cov(aX+b, cY+d) = ac\\cdot Cov(X,Y)',
    description: '协方差对平移不变（加常数不影响），对缩放有系数ac',
    category: '概率论与数理统计-数字特征',
    tags: ['协方差', '二级结论']
  },
  {
    id: 'prob-2nd-correlation-bounds',
    name: '相关系数的等价条件',
    latex: '\\rho=0 \\Leftrightarrow E(XY)=E(X)E(Y) \\Leftrightarrow D(X\\pm Y)=D(X)+D(Y)',
    description: '不相关的三个等价条件。第三个最实用：验证D(X+Y)=D(X)+D(Y)即知不相关',
    category: '概率论与数理统计-数字特征',
    tags: ['相关系数', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-correlation-extreme',
    name: '相关系数极值的含义',
    latex: '\\rho=1 \\Leftrightarrow P(Y=aX+b)=1(a>0), \\quad \\rho=-1 \\Leftrightarrow P(Y=aX+b)=1(a<0)',
    description: '|ρ|=1等价于X,Y几乎必然存在线性关系',
    category: '概率论与数理统计-数字特征',
    tags: ['相关系数', '二级结论']
  },
  {
    id: 'prob-2nd-var-linear-transform',
    name: '线性变换下方差的变化',
    latex: 'D(aX+b) = a^2 D(X)',
    description: '常数平移不改变方差，缩放的方差变a²倍。D(aX)=a²D(X)',
    category: '概率论与数理统计-数字特征',
    tags: ['方差', '二级结论']
  },
  {
    id: 'prob-2nd-conditional-expectation',
    name: '全期望公式',
    latex: 'E(X) = E[E(X|Y)] = \\sum_j E(X|Y=y_j)P(Y=y_j)',
    description: '用条件期望计算无条件期望。连续型：E(X)=∫E(X|Y=y)f_Y(y)dy',
    category: '概率论与数理统计-数字特征',
    tags: ['条件期望', '二级结论']
  },
  {
    id: 'prob-2nd-var-decomposition',
    name: '方差分解公式',
    latex: 'D(X) = E[D(X|Y)] + D[E(X|Y)]',
    description: '总方差=组内方差的期望+组间方差。统计学中ANOVA的理论基础',
    category: '概率论与数理统计-数字特征',
    tags: ['方差', '二级结论']
  },
  {
    id: 'prob-2nd-indep-product-expectation',
    name: '独立变量乘积的期望',
    latex: 'X,Y\\text{独立} \\Rightarrow E(XY)=E(X)E(Y), \\quad E(X^kY^l)=E(X^k)E(Y^l)',
    description: '独立性保证乘积的期望等于期望的乘积，推广到任意幂次',
    category: '概率论与数理统计-数字特征',
    tags: ['期望', '独立性', '二级结论']
  },

  // ---- 第五章 大数定律与CLT - 二级结论 ----
  {
    id: 'prob-2nd-chebyshev-equiv',
    name: '切比雪夫不等式等价形式',
    latex: 'P\\{|X-EX|<\\varepsilon\\} \\geq 1 - \\frac{D(X)}{\\varepsilon^2}',
    description: '与原形式等价，但更直观：X落在EX附近ε范围内的概率不低于1-D(X)/ε²',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['切比雪夫', '二级结论']
  },
  {
    id: 'prob-2nd-chebyshev-convergence',
    name: '切比雪夫大数定律的证明思路',
    latex: 'X_i\\text{独立},\\; D(X_i)\\le C \\Rightarrow D(\\bar{X}_n)=\\frac{1}{n^2}\\sum D(X_i)\\le\\frac{C}{n}\\to0',
    description: 'D(X̄ₙ)→0 + 切比雪夫不等式 → X̄ₙ依概率收敛于E(X̄ₙ)',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['大数定律', '二级结论']
  },
  {
    id: 'prob-2nd-clt-applicable',
    name: 'CLT应用的关键条件',
    latex: 'n \\ge 30, \\quad E(X_i)=\\mu, \\quad D(X_i)=\\sigma^2, \\quad \\text{独立同分布}',
    description: 'n≥30是经验准则（非严格）。本质要求：独立、同分布、方差有限。σ²=∞时CLT不适用',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['中心极限定理', '二级结论']
  },
  {
    id: 'prob-2nd-clt-implies-lln',
    name: 'CLT蕴含大数定律',
    latex: '\\frac{\\sum X_i - n\\mu}{\\sqrt{n}\\sigma} \\xrightarrow{d} N(0,1) \\Rightarrow \\bar{X}_n = \\mu + \\frac{\\sigma}{\\sqrt{n}}Z_n \\xrightarrow{P} \\mu',
    description: 'CLT是比LLN更强的结论：不仅告诉我们X̄→μ，还告诉我们收敛速度是O(1/√n)',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['中心极限定理', '二级结论']
  },
  {
    id: 'prob-2nd-normal-approx-bino',
    name: '二项分布的正态近似条件',
    latex: 'B(n,p) \\approx N(np, npq), \\quad np \\ge 5 \\text{且} nq \\ge 5',
    description: '连续性修正：P(X=k)≈P(k-0.5<X<k+0.5)。np<5时用泊松近似更好',
    category: '概率论与数理统计-大数定律与中心极限定理',
    tags: ['中心极限定理', '近似', '二级结论', '重点']
  },

  // ---- 第六章 数理统计基本概念 - 二级结论 ----
  {
    id: 'prob-2nd-sample-mean-dist',
    name: '正态总体样本均值的分布',
    latex: 'X_1,\\ldots,X_n \\sim N(\\mu,\\sigma^2) \\Rightarrow \\bar{X}\\sim N(\\mu,\\frac{\\sigma^2}{n})',
    description: 'X̄与X同均值，但方差缩小n倍。n越大X̄越集中在μ附近',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-chisquare-add',
    name: 'χ²分布的可加性',
    latex: 'X\\sim\\chi^2(m),\\;Y\\sim\\chi^2(n),\\;\\text{独立} \\Rightarrow X+Y\\sim\\chi^2(m+n)',
    description: '独立χ²变量之和仍为χ²分布，自由度相加',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '二级结论']
  },
  {
    id: 'prob-2nd-chisquare-sample',
    name: '正态总体样本方差的分布',
    latex: 'X_i\\sim N(\\mu,\\sigma^2) \\Rightarrow \\frac{(n-1)S^2}{\\sigma^2}\\sim\\chi^2(n-1),\\quad \\bar{X}\\perp S^2',
    description: 'X̄与S²独立！这是后续t检验、F检验的理论基础。自由度n-1（不是n）',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-t-vs-normal',
    name: 't分布与标准正态的关系',
    latex: 't(n) \\xrightarrow{n\\to\\infty} N(0,1), \\quad n > 45\\text{时可用}z_\\alpha\\text{代替}t_\\alpha(n)',
    description: 't分布比N(0,1)尾部更厚（自由度越小越厚）。n→∞时趋于标准正态',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '二级结论']
  },
  {
    id: 'prob-2nd-f-reciprocal',
    name: 'F分布的倒数关系',
    latex: 'F\\sim F(m,n) \\Rightarrow \\frac{1}{F}\\sim F(n,m)',
    description: 'F分布的倒数交换自由度。用于F检验中上、下分位点的互推',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['抽样分布', '二级结论']
  },
  {
    id: 'prob-2nd-quantile-relation',
    name: '分位点的互推公式',
    latex: 't_{1-\\alpha}(n)=-t_\\alpha(n), \\quad \\chi^2_{1-\\alpha}(n)\\neq-\\chi^2_\\alpha(n), \\quad F_{1-\\alpha}(m,n)=\\frac{1}{F_\\alpha(n,m)}',
    description: 't分布关于0对称（类似正态），χ²不对称，F用倒数关系',
    category: '概率论与数理统计-数理统计基本概念',
    tags: ['分位点', '二级结论', '重点']
  },

  // ---- 第七章 参数估计 - 二级结论 ----
  {
    id: 'prob-2nd-mle-invariance',
    name: 'MLE的不变性',
    latex: '\\hat{\\theta}\\text{是}\\theta\\text{的MLE} \\Rightarrow g(\\hat{\\theta})\\text{是}g(\\theta)\\text{的MLE}',
    description: '极大似然估计经过函数变换后仍是MLE。如σ̂²_MLE是σ²的MLE，则σ̂_MLE也是σ的MLE',
    category: '概率论与数理统计-参数估计',
    tags: ['最大似然', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-mle-asymptotic',
    name: 'MLE的渐近正态性',
    latex: '\\hat{\\theta}_{MLE} \\xrightarrow{d} N\\left(\\theta, \\frac{1}{nI(\\theta)}\\right), \\quad I(\\theta)=-E\\left[\\frac{\\partial^2 \\ln L}{\\partial\\theta^2}\\right]',
    description: '大样本下MLE渐近正态，方差为1/(nI(θ))，I(θ)为Fisher信息量',
    category: '概率论与数理统计-参数估计',
    tags: ['最大似然', '二级结论']
  },
  {
    id: 'prob-2nd-unbiased-svariance',
    name: '样本方差除以n-1的原因',
    latex: 'E\\left[\\frac{1}{n}\\sum(X_i-\\bar{X})^2\\right] = \\frac{n-1}{n}\\sigma^2, \\quad E[S^2]=\\sigma^2',
    description: '除以n的样本方差是有偏的（偏小），除以n-1才能保证无偏性。自由度概念',
    category: '概率论与数理统计-参数估计',
    tags: ['无偏性', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-ci-length',
    name: '置信区间长度与样本量',
    latex: '\\sigma\\text{已知}: L=2z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}, \\quad n = \\left(\\frac{2z_{\\alpha/2}\\sigma}{L}\\right)^2',
    description: '已知允许误差L，反推所需样本量n。L↓或1-α↑都需要n增大',
    category: '概率论与数理统计-参数估计',
    tags: ['区间估计', '二级结论']
  },
  {
    id: 'prob-2nd-ci-two-sample',
    name: '双总体均值差的置信区间',
    latex: '\\mu_1-\\mu_2\\in\\left(\\bar{X}_1-\\bar{X}_2\\pm t_{\\alpha/2}(n_1+n_2-2)S_w\\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}\\right)',
    description: 'σ₁=σ₂=σ未知时，S_w²=((n₁-1)S₁²+(n₂-1)S₂²)/(n₁+n₂-2)',
    category: '概率论与数理统计-参数估计',
    tags: ['区间估计', '二级结论']
  },
  {
    id: 'prob-2nd-mle-vs-moment',
    name: '矩估计vs最大似然估计',
    latex: '\\text{矩估计：简单但不唯一，可能不合理}; \\quad \\text{MLE：复杂但优良（不变性、渐近正态、相合性）}',
    description: '矩估计优点：计算简单、不要求知道分布类型。MLE优点：性质优良。考研中MLE是重点',
    category: '概率论与数理统计-参数估计',
    tags: ['估计方法', '二级结论']
  },

  // ---- 第八章 假设检验 - 二级结论 ----
  {
    id: 'prob-2nd-error-relation',
    name: '两类错误的此消彼长',
    latex: '\\alpha\\downarrow \\Rightarrow \\beta\\uparrow, \\quad \\text{固定n时不能同时减小} \\alpha\\text{和}\\beta',
    description: '减小弃真概率必然增加取伪概率。增大n可以同时减小两者',
    category: '概率论与数理统计-假设检验',
    tags: ['两类错误', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-test-ci-duality',
    name: '检验与置信区间的对偶关系',
    latex: '\\mu\\text{的}1-\\alpha\\text{置信区间} = \\{\\mu_0: \\text{在}\\alpha\\text{水平下不拒绝}H_0:\\mu=\\mu_0\\}',
    description: '置信区间=所有不被拒绝的μ₀值。双边检验↔双侧置信区间',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-p-value',
    name: 'P值的定义',
    latex: 'p = P\\{\\text{统计量取值比观测值更极端}\\,|\\,H_0\\text{成立}\\}',
    description: 'p<α则拒绝H₀。P值越小，拒绝H₀的证据越强。P值不是H₀为真的概率',
    category: '概率论与数理统计-假设检验',
    tags: ['P值', '二级结论', '重点']
  },
  {
    id: 'prob-2nd-one-sided-vs-two',
    name: '单侧与双侧检验的选择',
    latex: '\\text{双侧}: H_1:\\mu\\neq\\mu_0,\\;|T|>t_{\\alpha/2}; \\quad \\text{单侧}: H_1:\\mu>\\mu_0,\\;T>t_\\alpha',
    description: '单侧检验的临界值更小（α而非α/2），更容易拒绝H₀。但有方向假设时才用单侧',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', '二级结论']
  },
  {
    id: 'prob-2nd-paired-t-test',
    name: '成对数据t检验',
    latex: 'd_i = X_i - Y_i, \\quad T = \\frac{\\bar{d}}{S_d/\\sqrt{n}}, \\quad T \\sim t(n-1)',
    description: '配对设计的检验。差值dᵢ消除个体差异，比两独立样本t检验更灵敏',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', '成对t检验', '二级结论']
  },
  {
    id: 'prob-2nd-power-function',
    name: '功效函数',
    latex: 'g(\\theta) = P\\{\\text{拒绝}H_0\\,|\\,\\theta\\}, \\quad 1-\\beta = g(\\theta_1),\\;\\theta_1\\in H_1',
    description: '1-β称为检验功效，度量检验发现真实差异的能力。好的检验功效应接近1',
    category: '概率论与数理统计-假设检验',
    tags: ['假设检验', '二级结论']
  }
]

export const FORMULA_FAVORITES_KEY = 'math-efficiency-formula-favorites'

export const getFormulaFavorites = (): Set<string> => {
  try {
    const saved = localStorage.getItem(FORMULA_FAVORITES_KEY)
    return saved ? new Set(JSON.parse(saved)) : new Set()
  } catch {
    return new Set()
  }
}

export const saveFormulaFavorites = (favorites: Set<string>) => {
  localStorage.setItem(FORMULA_FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
}
