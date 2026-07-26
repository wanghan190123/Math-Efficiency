import { Question, QuestionSet } from '@/types/question'
import { questions2026, questionSet2026 } from './questions2026'
import { questions2025, questionSet2025 } from './questions2025'

export const sampleQuestions: Question[] = [
  ...questions2026,
  ...questions2025,
  {
    id: '2023-01',
    year: 2023,
    number: 1,
    type: 'choice',
    chapter: '高等数学-极限与连续',
    knowledgePoints: ['极限', '无穷小'],
    formulas: ['极限定义', '无穷小比较'],
    methods: ['等价无穷小替换', '泰勒展开'],
    content: '设 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$，则下列结论正确的是（）',
    options: [
      'A. $f(x)$ 是 $x$ 的高阶无穷小',
      'B. $f(x)$ 是 $x$ 的等价无穷小',
      'C. $f(x)$ 是 $x$ 的低阶无穷小',
      'D. $f(x)$ 与 $x$ 同阶但非等价无穷小'
    ],
    answer: 'B',
    analysis: '由 $\\lim_{x \\to 0} \\frac{f(x)}{x} = 1$ 可知，当 $x \\to 0$ 时，$\\frac{f(x)}{x} \\to 1$，即 $f(x) \\sim x$。因此 $f(x)$ 是 $x$ 的等价无穷小。\n\n**解题思路**：\n1. 理解无穷小比较的定义\n2. 掌握等价无穷小的判定条件：$\\lim \\frac{\\alpha}{\\beta} = 1$ 时，$\\alpha \\sim \\beta$'
  },
  {
    id: '2023-02',
    year: 2023,
    number: 2,
    type: 'fill',
    chapter: '高等数学-导数与微分',
    knowledgePoints: ['导数定义', '隐函数求导'],
    formulas: ['导数公式', '隐函数求导法则'],
    methods: ['直接求导', '对数求导法'],
    content: '设函数 $y = y(x)$ 由方程 $e^y + xy - e = 0$ 确定，则 $\\frac{dy}{dx} = \\underline{\\quad\\quad}$。',
    answer: '$-\\frac{y}{x+e^y}$',
    analysis: '对方程 $e^y + xy - e = 0$ 两边关于 $x$ 求导：\n\n$$e^y \\cdot y\' + y + x \\cdot y\' = 0$$\n\n整理得：\n$$y\'(e^y + x) = -y$$\n\n因此：\n$$y\' = -\\frac{y}{x + e^y}$$\n\n**解题思路**：\n1. 识别隐函数求导问题\n2. 方程两边同时对 $x$ 求导\n3. 整理求出 $y\'$'
  },
  {
    id: '2023-03',
    year: 2023,
    number: 3,
    type: 'answer',
    chapter: '高等数学-不定积分',
    knowledgePoints: ['不定积分', '换元积分法'],
    formulas: ['积分公式', '换元积分法'],
    methods: ['第一类换元法', '三角换元'],
    content: '计算不定积分 $\\int \\frac{dx}{\\sqrt{x^2 + a^2}}$（其中 $a > 0$）。',
    answer: '$\\ln(x + \\sqrt{x^2 + a^2}) + C$',
    analysis: '**方法一：三角换元**\n\n设 $x = a\\tan t$，$t \\in (-\\frac{\\pi}{2}, \\frac{\\pi}{2})$，则 $dx = a\\sec^2 t \\, dt$。\n\n$$\\int \\frac{dx}{\\sqrt{x^2 + a^2}} = \\int \\frac{a\\sec^2 t \\, dt}{a\\sec t} = \\int \\sec t \\, dt$$\n\n$$= \\ln|\\sec t + \\tan t| + C = \\ln\\left|\\frac{\\sqrt{x^2+a^2}}{a} + \\frac{x}{a}\\right| + C$$\n\n$$= \\ln(x + \\sqrt{x^2 + a^2}) + C$$\n\n**解题思路**：\n1. 识别积分类型：含 $\\sqrt{x^2 + a^2}$ 的积分\n2. 选择合适的三角换元\n3. 计算并回代'
  },
  {
    id: '2022-01',
    year: 2022,
    number: 1,
    type: 'choice',
    chapter: '线性代数-行列式',
    knowledgePoints: ['行列式计算', '行列式性质'],
    formulas: ['行列式展开定理', '范德蒙行列式'],
    methods: ['展开法', '性质化简'],
    content: '设 $A$ 为3阶方阵，$|A| = 2$，则 $|2A^*| = $（）',
    options: [
      'A. 4',
      'B. 8',
      'C. 16',
      'D. 32'
    ],
    answer: 'D',
    analysis: '由伴随矩阵的性质：$A^* = |A|A^{-1}$\n\n因此 $|A^*| = ||A|A^{-1}| = |A|^{n-1} = 2^{3-1} = 4$\n\n所以 $|2A^*| = 2^3 |A^*| = 8 \\times 4 = 32$\n\n**解题思路**：\n1. 掌握伴随矩阵与逆矩阵的关系\n2. 掌握行列式的乘法性质\n3. 注意 $|kA| = k^n|A|$'
  },
  {
    id: '2022-02',
    year: 2022,
    number: 2,
    type: 'fill',
    chapter: '线性代数-矩阵',
    knowledgePoints: ['矩阵运算', '逆矩阵'],
    formulas: ['逆矩阵公式', '矩阵乘法'],
    methods: ['伴随矩阵法', '初等变换法'],
    content: '设矩阵 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，则 $A^{-1} = \\underline{\\quad\\quad}$。',
    answer: '$\\begin{pmatrix} -2 & 1 \\\\ \\frac{3}{2} & -\\frac{1}{2} \\end{pmatrix}$',
    analysis: '对于2阶矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，其逆矩阵为：\n\n$$A^{-1} = \\frac{1}{|A|}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n\n计算 $|A| = 1 \\times 4 - 2 \\times 3 = -2$\n\n所以 $A^{-1} = \\frac{1}{-2}\\begin{pmatrix} 4 & -2 \\\\ -3 & 1 \\end{pmatrix} = \\begin{pmatrix} -2 & 1 \\\\ \\frac{3}{2} & -\\frac{1}{2} \\end{pmatrix}$'
  },
  {
    id: '2022-03',
    year: 2022,
    number: 3,
    type: 'answer',
    chapter: '线性代数-特征值',
    knowledgePoints: ['特征值', '特征向量'],
    formulas: ['特征方程', '特征多项式'],
    methods: ['直接计算', '正交化'],
    content: '求矩阵 $A = \\begin{pmatrix} 4 & 2 \\\\ 1 & 3 \\end{pmatrix}$ 的特征值和特征向量。',
    answer: '特征值 $\\lambda_1 = 5$，对应特征向量 $\\xi_1 = k_1(2,1)^T$；特征值 $\\lambda_2 = 2$，对应特征向量 $\\xi_2 = k_2(1,-1)^T$',
    analysis: '**步骤一：求特征值**\n\n特征方程 $|A - \\lambda E| = 0$：\n\n$$\\begin{vmatrix} 4-\\lambda & 2 \\\\ 1 & 3-\\lambda \\end{vmatrix} = (4-\\lambda)(3-\\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = 0$$\n\n解得 $\\lambda_1 = 5$，$\\lambda_2 = 2$\n\n**步骤二：求特征向量**\n\n对于 $\\lambda_1 = 5$：\n$$(A - 5E)X = \\begin{pmatrix} -1 & 2 \\\\ 1 & -2 \\end{pmatrix}\\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix} = 0$$\n解得 $x_1 = 2x_2$，特征向量 $\\xi_1 = k_1(2,1)^T$\n\n对于 $\\lambda_2 = 2$：\n$$(A - 2E)X = \\begin{pmatrix} 2 & 2 \\\\ 1 & 1 \\end{pmatrix}\\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix} = 0$$\n解得 $x_1 = -x_2$，特征向量 $\\xi_2 = k_2(1,-1)^T$'
  },
  {
    id: '2021-01',
    year: 2021,
    number: 1,
    type: 'choice',
    chapter: '概率论-随机事件',
    knowledgePoints: ['条件概率', '全概率公式'],
    formulas: ['条件概率公式', '全概率公式', '贝叶斯公式'],
    methods: ['事件分解', '公式应用'],
    content: '设 $P(A) = 0.5$，$P(B) = 0.6$，$P(B|A) = 0.8$，则 $P(A|B) = $（）',
    options: [
      'A. $\\frac{1}{3}$',
      'B. $\\frac{2}{3}$',
      'C. $\\frac{1}{2}$',
      'D. $\\frac{5}{6}$'
    ],
    answer: 'B',
    analysis: '由条件概率公式：$P(A|B) = \\frac{P(AB)}{P(B)}$\n\n先求 $P(AB)$：\n$P(AB) = P(B|A) \\cdot P(A) = 0.8 \\times 0.5 = 0.4$\n\n因此：\n$P(A|B) = \\frac{0.4}{0.6} = \\frac{2}{3}$\n\n**解题思路**：\n1. 熟练运用条件概率公式\n2. 注意 $P(AB) = P(B|A)P(A) = P(A|B)P(B)$'
  },
  {
    id: '2021-02',
    year: 2021,
    number: 2,
    type: 'fill',
    chapter: '概率论-随机变量',
    knowledgePoints: ['期望', '方差'],
    formulas: ['期望公式', '方差公式', '期望性质'],
    methods: ['定义法', '性质法'],
    content: '设随机变量 $X$ 服从参数为 $\\lambda$ 的泊松分布，且 $E(X^2) = 2$，则 $\\lambda = \\underline{\\quad\\quad}$。',
    answer: '1',
    analysis: '泊松分布 $X \\sim P(\\lambda)$ 的性质：\n- $E(X) = \\lambda$\n- $D(X) = \\lambda$\n\n由方差公式：$D(X) = E(X^2) - [E(X)]^2$\n\n代入：$\\lambda = 2 - \\lambda^2$\n\n解方程：$\\lambda^2 + \\lambda - 2 = 0$\n\n解得 $\\lambda = 1$（舍去 $\\lambda = -2$）'
  },
  {
    id: '2021-03',
    year: 2021,
    number: 3,
    type: 'answer',
    chapter: '概率论-参数估计',
    knowledgePoints: ['最大似然估计', '矩估计'],
    formulas: ['似然函数', '矩估计公式'],
    methods: ['求导法', '方程组法'],
    content: '设总体 $X$ 的概率密度函数为 $f(x) = \\begin{cases} (\\theta + 1)x^{\\theta}, & 0 < x < 1 \\\\ 0, & \\text{其他} \\end{cases}$，其中 $\\theta > -1$ 为未知参数。求 $\\theta$ 的矩估计量和最大似然估计量。',
    answer: '矩估计 $\\hat{\\theta} = \\frac{2\\bar{X} - 1}{1 - \\bar{X}}$，最大似然估计 $\\hat{\\theta} = -1 - \\frac{n}{\\sum_{i=1}^{n}\\ln X_i}$',
    analysis: '**一、矩估计**\n\n计算 $E(X)$：\n$$E(X) = \\int_0^1 x \\cdot (\\theta+1)x^{\\theta} dx = (\\theta+1)\\int_0^1 x^{\\theta+1} dx = \\frac{\\theta+1}{\\theta+2}$$\n\n令 $E(X) = \\bar{X}$，解得：$\\hat{\\theta} = \\frac{2\\bar{X} - 1}{1 - \\bar{X}}$\n\n**二、最大似然估计**\n\n似然函数：$L(\\theta) = \\prod_{i=1}^{n}(\\theta+1)X_i^{\\theta} = (\\theta+1)^n \\prod_{i=1}^{n}X_i^{\\theta}$\n\n取对数：$\\ln L = n\\ln(\\theta+1) + \\theta\\sum_{i=1}^{n}\\ln X_i$\n\n对 $\\theta$ 求导并令其为0：$\\frac{n}{\\theta+1} + \\sum_{i=1}^{n}\\ln X_i = 0$\n\n解得：$\\hat{\\theta} = -1 - \\frac{n}{\\sum_{i=1}^{n}\\ln X_i}$'
  }
]

export const sampleQuestionSets: QuestionSet[] = [
  questionSet2026,
  questionSet2025,
  {
    id: '2023-math',
    name: '2023年考研数学真题',
    year: 2023,
    source: '全国硕士研究生入学统一考试',
    questions: sampleQuestions.filter(q => q.year === 2023)
  },
  {
    id: '2022-math',
    name: '2022年考研数学真题',
    year: 2022,
    source: '全国硕士研究生入学统一考试',
    questions: sampleQuestions.filter(q => q.year === 2022)
  },
  {
    id: '2021-math',
    name: '2021年考研数学真题',
    year: 2021,
    source: '全国硕士研究生入学统一考试',
    questions: sampleQuestions.filter(q => q.year === 2021)
  }
]
