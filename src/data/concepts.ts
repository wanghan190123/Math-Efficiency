export interface ConceptItem {
  id: string
  name: string
  category: string
  definition: string
  plainTranslation?: string
  whyNeedIt?: string
  formula?: string
  example?: string
  tags?: string[]
}

export const CONCEPTS: ConceptItem[] = [
  {
    id: 'limit-concept',
    name: '极限',
    category: '高等数学-极限与连续',
    definition: '设函数f(x)在点x₀的某一去心邻域内有定义。如果存在常数A，对于任意给定的正数ε，总存在正数δ，使得当x满足0<|x-x₀|<δ时，对应的函数值f(x)都满足|f(x)-A|<ε，则称A为函数f(x)当x→x₀时的极限。',
    plainTranslation: '极限就是当x无限接近某个值时，函数值无限接近的那个数。注意：x不等于那个值，只是无限接近。',
    whyNeedIt: '极限是微积分的基础概念，导数、积分、级数等概念都建立在极限之上。它帮助我们研究函数在某点附近的趋势，而不是该点的具体值。',
    formula: '\\lim_{x \\to x_0} f(x) = A',
    example: 'lim(x→0) sin(x)/x = 1，这是重要极限之一',
    tags: ['极限', '基础', '核心概念']
  },
  {
    id: 'continuity-concept',
    name: '连续性',
    category: '高等数学-极限与连续',
    definition: '设函数f(x)在点x₀的某邻域内有定义，如果lim(x→x₀)f(x)=f(x₀)，则称函数f(x)在点x₀处连续。',
    plainTranslation: '连续就是函数图像不断开。如果在该点的极限值等于函数值，就是连续。',
    whyNeedIt: '连续函数具有很多重要性质，如介值定理、最值定理等。判断函数是否连续是研究函数性质的重要步骤。',
    tags: ['连续', '极限', '基础']
  },
  {
    id: 'derivative-concept',
    name: '导数',
    category: '高等数学-导数与微分',
    definition: '设函数y=f(x)在点x₀的某邻域内有定义，当自变量x在x₀处有增量Δx时，函数相应地有增量Δy=f(x₀+Δx)-f(x₀)。如果极限lim(Δx→0)(Δy/Δx)存在，则称函数f(x)在点x₀处可导，该极限值称为f(x)在x₀处的导数。',
    plainTranslation: '导数就是瞬时变化率，表示函数在某点变化的快慢。几何意义是切线斜率。',
    whyNeedIt: '导数是研究函数变化规律的有力工具，可以求函数的单调性、极值、凹凸性等。在物理中表示瞬时速度、加速度等。',
    formula: "f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}",
    tags: ['导数', '核心概念', '变化率']
  },
  {
    id: 'integral-concept',
    name: '定积分',
    category: '高等数学-定积分',
    definition: '设函数f(x)在[a,b]上有界，在[a,b]中任意插入若干个分点，把区间分成n个小区间。在每个小区间上任取一点ξᵢ，作和式Σf(ξᵢ)Δxᵢ。如果当分点无限增加，每个小区间长度都趋于零时，该和式的极限存在，则称此极限为f(x)在[a,b]上的定积分。',
    plainTranslation: '定积分就是求曲边梯形的面积。把区间分成很多小段，用矩形面积近似，然后取极限。',
    whyNeedIt: '定积分可以计算面积、体积、弧长、功等物理量，是微积分的核心概念之一。',
    formula: '\\int_a^b f(x)dx = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i) \\Delta x_i',
    tags: ['积分', '核心概念', '面积']
  },
  {
    id: 'determinant-concept',
    name: '行列式',
    category: '线性代数-行列式',
    definition: 'n阶行列式是由n²个数按n行n列排列成的数表，按照一定规则运算得到的一个数。二阶行列式|a b; c d| = ad-bc，三阶行列式按沙路法或展开定理计算。',
    plainTranslation: '行列式是一个由方阵算出来的数，表示矩阵的某种"体积"或"缩放因子"。',
    whyNeedIt: '行列式可用于判断矩阵是否可逆、求解线性方程组、计算矩阵特征值等。',
    formula: '|A| = \\sum_{j=1}^{n} a_{1j} A_{1j}',
    tags: ['行列式', '矩阵', '基础']
  },
  {
    id: 'matrix-concept',
    name: '矩阵',
    category: '线性代数-矩阵',
    definition: '由m×n个数排成的m行n列的数表称为m×n矩阵，记作A=(aᵢⱼ)或A=[aᵢⱼ]。当m=n时，称为n阶方阵。',
    plainTranslation: '矩阵就是一个数表，可以表示线性变换、存储数据等。',
    whyNeedIt: '矩阵是线性代数的核心工具，可用于表示线性方程组、线性变换、图形变换等。',
    tags: ['矩阵', '基础', '核心概念']
  },
  {
    id: 'eigenvalue-concept',
    name: '特征值与特征向量',
    category: '线性代数-特征值',
    definition: '设A是n阶方阵，如果存在数λ和非零向量x，使得Ax=λx，则称λ为A的特征值，x为对应于λ的特征向量。',
    plainTranslation: '特征向量是被矩阵变换后方向不变的向量，特征值是变换后的缩放倍数。',
    whyNeedIt: '特征值和特征向量在矩阵对角化、主成分分析、振动分析等领域有重要应用。',
    formula: 'Ax = \\lambda x',
    tags: ['特征值', '特征向量', '核心概念']
  },
  {
    id: 'probability-concept',
    name: '概率',
    category: '概率论-随机事件',
    definition: '随机事件A发生的可能性大小的数值度量称为概率，记作P(A)。概率满足非负性、规范性和可加性。',
    plainTranslation: '概率就是事件发生的可能性，范围是0到1，0表示不可能发生，1表示一定发生。',
    whyNeedIt: '概率是描述随机现象的基本工具，是统计推断的理论基础。',
    formula: '0 \\leq P(A) \\leq 1',
    tags: ['概率', '基础', '核心概念']
  },
  {
    id: 'random-variable-concept',
    name: '随机变量',
    category: '概率论-随机变量',
    definition: '设E是随机试验，样本空间为Ω={ω}。如果对于每一个ω∈Ω，都有一个实数X(ω)与之对应，则称X=X(ω)为随机变量。',
    plainTranslation: '随机变量就是把随机试验的结果映射成数值的函数。',
    whyNeedIt: '随机变量将随机现象数量化，便于用数学方法研究。',
    tags: ['随机变量', '基础', '核心概念']
  },
  {
    id: 'expectation-concept',
    name: '期望',
    category: '概率论-随机变量',
    definition: '离散型随机变量X的期望定义为E(X)=Σxᵢpᵢ，其中xᵢ是X的所有可能取值，pᵢ是取值的概率。连续型随机变量的期望定义为E(X)=∫xf(x)dx。',
    plainTranslation: '期望就是平均值，表示随机变量取值的平均水平。',
    whyNeedIt: '期望是描述随机变量分布中心的重要数字特征，在决策分析中有重要应用。',
    formula: 'E(X) = \\sum_{i} x_i p_i',
    tags: ['期望', '数字特征', '基础']
  },
  {
    id: 'variance-concept',
    name: '方差',
    category: '概率论-随机变量',
    definition: '随机变量X的方差定义为D(X)=E[(X-E(X))²]=E(X²)-[E(X)]²，标准差是方差的算术平方根。',
    plainTranslation: '方差衡量数据偏离平均值的程度，方差越大，数据越分散。',
    whyNeedIt: '方差描述随机变量取值的分散程度，是风险评估、质量控制等领域的重要指标。',
    formula: 'D(X) = E(X^2) - [E(X)]^2',
    tags: ['方差', '数字特征', '基础']
  }
]

export const CONCEPT_FAVORITES_KEY = 'math-efficiency-concept-favorites'

export const getConceptFavorites = (): Set<string> => {
  try {
    const saved = localStorage.getItem(CONCEPT_FAVORITES_KEY)
    return saved ? new Set(JSON.parse(saved)) : new Set()
  } catch {
    return new Set()
  }
}

export const saveConceptFavorites = (favorites: Set<string>) => {
  localStorage.setItem(CONCEPT_FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
}
