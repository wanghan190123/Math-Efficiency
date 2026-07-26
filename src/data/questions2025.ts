import { Question, QuestionSet } from '@/types/question'

export const questions2025: Question[] = [
  {
    id: '2025-01',
    year: 2025,
    number: 1,
    type: 'choice',
    chapter: '高等数学-一元函数微分学',
    knowledgePoints: ['极值', '拐点', '变上限积分'],
    formulas: ['极值判别法', '拐点判别法'],
    methods: ['求导分析', '二阶导数判别'],
    content: '已知函数 $f(x)=\\int_{0}^{x} e^{t^{2}} \\sin t \\, dt$，$g(x)=\\int_{0}^{x} e^{t^{2}} \\, dt \\cdot \\sin^{2} x$，则（）',
    options: [
      'A. $x=0$ 是 $f(x)$ 的极值点，也是 $g(x)$ 的极值点',
      'B. $x=0$ 是 $f(x)$ 的极值点，$(0,0)$ 是曲线 $y=g(x)$ 的拐点',
      'C. $x=0$ 是 $f(x)$ 的极值点，$(0,0)$ 是曲线 $y=f(x)$ 的拐点',
      'D. $(0,0)$ 是曲线 $y=f(x)$ 的拐点，$(0,0)$ 也是曲线 $y=g(x)$ 的拐点'
    ],
    answer: 'B',
    analysis: '$f\'(x)=e^{x^{2}}\\sin x$，$f\'\'(x)=2xe^{x^{2}}\\sin x+e^{x^{2}}\\cos x$\n\n$f\'(0)=0$，$f\'\'(0)=1>0$。\n\n$x=0$ 是 $f(x)$ 的极值点。\n\n$g\'(x)=e^{x^{2}}\\sin^{2} x+\\sin 2x \\int_{0}^{x} e^{t^{2}} dt$，\n\n$g\'\'(x)=e^{x^{2}}\\sin 2x+2xe^{x^{2}}\\sin^{2} x+\\sin 2x e^{x^{2}}+2\\cos 2x \\int_{0}^{x} e^{t^{2}} dt$\n\n$g\'(0)=0$，$g\'\'(0)=0$，$g\'\'\'(0)>0$\n\n$(0,0)$ 是 $y=g(x)$ 的拐点。'
  },
  {
    id: '2025-02',
    year: 2025,
    number: 2,
    type: 'choice',
    chapter: '高等数学-无穷级数',
    knowledgePoints: ['级数收敛', '条件收敛', '绝对收敛'],
    formulas: ['比较判别法', '莱布尼茨判别法'],
    methods: ['等价无穷小', '交错级数判别'],
    content: '已知级数：① $\\sum_{n=1}^{\\infty} \\sin \\frac{n^{3} \\pi}{n^{2}+1}$ ② $\\sum_{n=1}^{\\infty}(-1)^{n}(\\frac{1}{\\sqrt[3]{n^{2}}}-\\tan \\frac{1}{\\sqrt[3]{n^{2}}})$',
    options: [
      'A. ①与②均条件收敛',
      'B. ①条件收敛，②绝对收敛',
      'C. ①绝对收敛，②条件收敛',
      'D. ①与②均绝对收敛'
    ],
    answer: 'B',
    analysis: '$|\\sin \\frac{n^{3} \\pi}{n^{2}+1}|=|\\sin (\\frac{n^{3} \\pi}{n^{2}+1}-n\\pi)|=|\\sin \\frac{n}{n^{2}+1} \\pi| \\sim \\frac{n}{n^{2}+1} \\pi \\sim \\frac{1}{n} \\pi$。\n\n$\\sum_{n=1}^{\\infty} \\frac{1}{n}$ 发散，∴不是绝对收敛。\n\n$\\sin \\frac{n^{3} \\pi}{n^{2}+1}=(-1)^{n} \\sin \\frac{n}{n^{2}+1} \\pi$，为交错级数，$\\sin \\frac{n}{n^{2}+1} \\pi$ 递减，条件收敛。\n\n$(-1)^{n}(\\frac{1}{\\sqrt[3]{n^{2}}}-\\tan \\frac{1}{\\sqrt[3]{n^{2}}}) \\sim -\\frac{1}{3}\\frac{1}{n^{2}}+o(\\frac{1}{n^{2}})$。\n\n$\\sum_{n=1}^{\\infty} \\frac{1}{n^{2}}$ 收敛，∴绝对收敛。'
  },
  {
    id: '2025-03',
    year: 2025,
    number: 3,
    type: 'choice',
    chapter: '高等数学-一元函数微分学',
    knowledgePoints: ['函数极限', '导数极限', '洛必达法则'],
    formulas: ['洛必达法则', '极限性质'],
    methods: ['反例法', '极限计算'],
    content: '设函数 $f(x)$ 在区间 $(0,+\\infty)$ 上可导，则（）',
    options: [
      'A. 当 $\\lim_{x \\to +\\infty} f(x)$ 存在时，$\\lim_{x \\to +\\infty} f\'(x)$ 存在',
      'B. 当 $\\lim_{x \\to +\\infty} f\'(x)$ 存在时，$\\lim_{x \\to +\\infty} f(x)$ 存在',
      'C. 当 $\\lim_{x \\to +\\infty} \\frac{\\int_{0}^{x} f(t) dt}{x}$ 存在时，$\\lim_{x \\to +\\infty} f(x)$ 存在',
      'D. 当 $\\lim_{x \\to +\\infty} f(x)$ 存在时，$\\lim_{x \\to +\\infty} \\frac{\\int_{0}^{x} f(t) dt}{x}$ 存在'
    ],
    answer: 'D',
    analysis: 'A 错误，反例：$f(x)=\\frac{\\sin x^{2}}{x}$，$\\lim_{x \\to +\\infty} f(x)=0$，但 $\\lim_{x \\to +\\infty} f\'(x)$ 不存在。\n\nB 错误，反例：$f(x)=\\sqrt{x}$，$f\'(x)=\\frac{1}{2\\sqrt{x}}$，$\\lim_{x \\to +\\infty} f\'(x)=0$ 存在，但 $\\lim_{x \\to +\\infty} f(x)$ 不存在。\n\nC 错误，反例：$f(x)=\\cos x$，$\\lim_{x \\to +\\infty} \\frac{\\int_{0}^{x} f(t) dt}{x}=\\lim_{x \\to +\\infty} \\frac{\\sin x}{x}$ 存在，但 $\\lim_{x \\to +\\infty} f(x)$ 不存在。\n\nD 正确，由洛必达法则 $\\lim_{x \\to +\\infty} \\frac{\\int_{0}^{x} f(t) dt}{x}=\\lim_{x \\to +\\infty} \\frac{f(x)}{1}=A$。'
  },
  {
    id: '2025-04',
    year: 2025,
    number: 4,
    type: 'choice',
    chapter: '高等数学-重积分',
    knowledgePoints: ['二重积分', '交换积分次序'],
    formulas: ['积分区域变换'],
    methods: ['交换积分次序', '区域分析'],
    content: '设函数 $f(x, y)$ 连续，则 $\\int_{-2}^{2} dx \\int_{4-x^{2}}^{4} f(x, y) dy=$（）',
    options: [
      'A. $\\int_{0}^{4}[\\int_{-2}^{-\\sqrt{4-y}} f(x, y) dx+\\int_{\\sqrt{4-y}}^{2} f(x, y) dx] dy$',
      'B. $\\int_{0}^{4}[\\int_{-2}^{\\sqrt{4-y}} f(x, y) dx+\\int_{\\sqrt{4-y}}^{2} f(x, y) dx] dy$',
      'C. $\\int_{0}^{4}[\\int_{-2}^{-\\sqrt{4-y}} f(x, y) dx+\\int_{2}^{\\sqrt{4-y}} f(x, y) dx] dy$',
      'D. $2\\int_{0}^{4} dy \\int_{\\sqrt{4-y}}^{2} f(x, y) dx$'
    ],
    answer: 'A',
    analysis: '积分区域 $D=\\{(x, y) | 4-x^{2} \\leq y \\leq 4, -2 \\leq x \\leq 2\\}$。\n\n记 $D_{1}=\\{(x, y) | 4-x^{2} \\leq y \\leq 4, -2 \\leq x \\leq 0\\}$，$D_{2}=\\{(x, y) | 4-x^{2} \\leq y \\leq 4, 0 \\leq x \\leq 2\\}$。\n\n交换积分次序得：\n\n$I=\\int_{0}^{4} dy \\int_{-2}^{-\\sqrt{4-y}} f(x, y) dx+\\int_{0}^{4} dy \\int_{\\sqrt{4-y}}^{2} f(x, y) dx$\n\n$=\\int_{0}^{4}[\\int_{-2}^{-\\sqrt{4-y}} f(x, y) dx+\\int_{\\sqrt{4-y}}^{2} f(x, y) dx] dy$'
  },
  {
    id: '2025-05',
    year: 2025,
    number: 5,
    type: 'choice',
    chapter: '线性代数-二次型',
    knowledgePoints: ['二次型', '正惯性指数', '特征值'],
    formulas: ['特征方程', '惯性定理'],
    methods: ['特征值法', '配方法'],
    content: '二次型 $f(x_{1}, x_{2}, x_{3})=x_{1}^{2}+2 x_{1} x_{2}+2 x_{1} x_{3}$ 的正惯性指数为（）',
    options: [
      'A. 0',
      'B. 1',
      'C. 2',
      'D. 3'
    ],
    answer: 'B',
    analysis: '二次型矩阵 $A=\\begin{pmatrix}1 & 1 & 1 \\\\ 1 & 0 & 0 \\\\ 1 & 0 & 0\\end{pmatrix}$\n\n特征方程 $|\\lambda E-A|=\\lambda(\\lambda-2)(\\lambda+1)=0$\n\n解得 $\\lambda_{1}=0, \\lambda_{2}=2, \\lambda_{3}=-1$\n\n正惯性指数为1。'
  },
  {
    id: '2025-06',
    year: 2025,
    number: 6,
    type: 'choice',
    chapter: '线性代数-向量组',
    knowledgePoints: ['线性相关', '线性无关', '方程组解'],
    formulas: ['秩的性质', '方程组解的判定'],
    methods: ['秩分析', '几何意义'],
    content: '设 $\\alpha_{1}, \\alpha_{2}, \\alpha_{3}, \\alpha_{4}$ 是 n 维列向量，$\\alpha_{1}, \\alpha_{2}$ 线性无关，$\\alpha_{1}, \\alpha_{2}, \\alpha_{3}$ 线性相关，且 $\\alpha_{1}+\\alpha_{2}+\\alpha_{4}=0$。在空间直角坐标系 $O-xyz$ 中，关于 $x, y, z$ 的方程组 $x \\alpha_{1}+y \\alpha_{2}+z \\alpha_{3}=\\alpha_{4}$ 的几何图形是（）',
    options: [
      'A. 过原点的一个平面',
      'B. 过原点的一条直线',
      'C. 不过原点的一个平面',
      'D. 不过原点的一条直线'
    ],
    answer: 'D',
    analysis: '记 $A=(\\alpha_{1}, \\alpha_{2}, \\alpha_{3})$，由 $\\alpha_{1}, \\alpha_{2}$ 线性无关，$\\alpha_{1}, \\alpha_{2}, \\alpha_{3}$ 线性相关，得 $r(A)=2$。\n\n记 $\\bar{A}=(A|\\alpha_{4})$，由 $\\alpha_{1}+\\alpha_{2}+\\alpha_{4}=0$，得 $r(\\bar{A})=2$。\n\n于是 $Ax=\\alpha_{4}$ 有无穷多解。若过原点，则 $\\alpha_{4}=0$，与 $\\alpha_{1}, \\alpha_{2}$ 线性无关矛盾，故不过原点。\n\n由 $r(A)=r(\\bar{A})=2$，两平面交于一条直线，且不过原点。'
  },
  {
    id: '2025-07',
    year: 2025,
    number: 7,
    type: 'choice',
    chapter: '线性代数-矩阵',
    knowledgePoints: ['矩阵秩', '秩不等式'],
    formulas: ['秩的性质', '西尔维斯特不等式'],
    methods: ['反例法', '秩分析'],
    content: '设 n 阶矩阵 A, B, C 满足 $r(A)+r(B)+r(C)=r(ABC)+2n$，给出下列四个结论：\n\n(1) $r(ABC)+n=r(AB)+r(C)$\n\n(2) $r(AB)+n=r(A)+r(B)$\n\n(3) $r(A)=r(B)=r(C)=n$\n\n(4) $r(AB)=r(BC)=n$\n\n其中正确结论的序号是（）',
    options: [
      'A. ①②',
      'B. ①③',
      'C. ②④',
      'D. ③④'
    ],
    answer: 'A',
    analysis: '取 $A=\\begin{pmatrix}1 & 0 \\\\ 0 & 0\\end{pmatrix}$，$B=\\begin{pmatrix}0 & 0 \\\\ 0 & 1\\end{pmatrix}$，$C=E$，满足 $r(A)+r(B)+r(C)=r(ABC)+2n$。\n\n$r(A)=1$，$r(B)=1$，$r(C)=2$，排除结论③④，故选A。'
  },
  {
    id: '2025-08',
    year: 2025,
    number: 8,
    type: 'choice',
    chapter: '概率论-随机变量',
    knowledgePoints: ['二维正态分布', '方差', '最值'],
    formulas: ['方差性质', '极值求法'],
    methods: ['方差计算', '求导求极值'],
    content: '设二维随机变量 $(X, Y)$ 服从正态分布 $N(0,0; 1,1; \\rho)$，其中 $\\rho \\in(-1,1)$。若 $a, b$ 为满足 $a^{2}+b^{2}=1$ 的任意实数，则 $D(aX+bY)$ 的最大值为（）',
    options: [
      'A. 1',
      'B. 2',
      'C. $1+|\\rho|$',
      'D. $1+\\rho^{2}$'
    ],
    answer: 'C',
    analysis: '$D(aX+bY)=a^{2}DX+b^{2}DY+2ab\\rho \\cdot 1 \\cdot 1=a^{2}+b^{2}+2ab\\rho=1+2ab\\rho$\n\n$=1+2a\\sqrt{1-a^{2}}\\rho=f(a)$\n\n$f\'(a)=2\\rho(\\sqrt{1-a^{2}}-\\frac{a^{2}}{\\sqrt{1-a^{2}}})=0$\n\n$2a^{2}=1 \\Rightarrow a=\\pm\\frac{1}{\\sqrt{2}}$，$b=\\pm\\frac{1}{\\sqrt{2}}$\n\n最大值为 $1+|\\rho|$。'
  },
  {
    id: '2025-09',
    year: 2025,
    number: 9,
    type: 'choice',
    chapter: '概率论-随机变量',
    knowledgePoints: ['二项分布', '泊松分布', '泊松定理'],
    formulas: ['泊松定理', '概率计算'],
    methods: ['泊松近似'],
    content: '设 $X_{1}, X_{2}, \\cdots, X_{20}$ 是来自总体 $B(1, 0.1)$ 的简单随机样本。令 $T=\\sum_{i=1}^{20} X_{i}$，则 $P\\{T \\leq 1\\} \\approx$（）',
    options: [
      'A. $\\frac{1}{e^{2}}$',
      'B. $\\frac{2}{e^{2}}$',
      'C. $\\frac{3}{e^{2}}$',
      'D. $\\frac{4}{e^{2}}$'
    ],
    answer: 'C',
    analysis: '由题意 $T \\sim B(20, 0.1)$，$np=20 \\times 0.1=2$。\n\n由泊松定理：\n\n$P\\{T \\leq 1\\}=P\\{T=0\\}+P\\{T=1\\}=\\frac{2^{0}}{0!}e^{-2}+\\frac{2^{1}}{1!}e^{-2}=e^{-2}+2e^{-2}=\\frac{3}{e^{2}}$'
  },
  {
    id: '2025-10',
    year: 2025,
    number: 10,
    type: 'choice',
    chapter: '概率论-假设检验',
    knowledgePoints: ['假设检验', '拒绝域'],
    formulas: ['正态总体检验', '分位数'],
    methods: ['检验统计量'],
    content: '设 $X_{1}, X_{2}, \\cdots, X_{n}$ 为来自正态总体 $N(\\mu, 2)$ 的简单随机样本。记 $\\bar{X}=\\frac{1}{n}\\sum_{i=1}^{n} X_{i}$，$Z_{\\alpha}$ 表示标准正态分布的上侧 $\\alpha$ 分位数。假设检验问题：$H_{0}: \\mu \\leq 1$，$H_{1}: \\mu > 1$ 的显著性水平为 $\\alpha$ 的检验的拒绝域为（）',
    options: [
      'A. $\\{(X_{1}, \\cdots, X_{n}) | \\bar{X} > 1+\\frac{2}{n}Z_{\\alpha}\\}$',
      'B. $\\{(X_{1}, \\cdots, X_{n}) | \\bar{X} > 1+\\frac{\\sqrt{2}}{n}Z_{\\alpha}\\}$',
      'C. $\\{(X_{1}, \\cdots, X_{n}) | \\bar{X} > 1+\\frac{2}{\\sqrt{n}}Z_{\\alpha}\\}$',
      'D. $\\{(X_{1}, \\cdots, X_{n}) | \\bar{X} > 1+\\sqrt{\\frac{2}{n}}Z_{\\alpha}\\}$'
    ],
    answer: 'D',
    analysis: '$\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} > z_{\\alpha} \\Rightarrow \\bar{X} > \\sqrt{\\frac{2}{n}}z_{\\alpha}+1$'
  },
  {
    id: '2025-11',
    year: 2025,
    number: 11,
    type: 'fill',
    chapter: '高等数学-极限',
    knowledgePoints: ['极限计算', '等价无穷小'],
    formulas: ['等价无穷小替换', '泰勒公式'],
    methods: ['等价替换', '变形'],
    content: '$\\lim_{x \\to 0^{+}} \\frac{x^{x}-1}{\\ln x \\cdot \\ln(1-x)}=$______',
    answer: '$-1$',
    analysis: '$\\lim_{x \\to 0^{+}} \\frac{e^{x\\ln x}-1}{-x\\ln x}=\\lim_{x \\to 0^{+}} \\frac{x\\ln x}{-x\\ln x}=-1$'
  },
  {
    id: '2025-12',
    year: 2025,
    number: 12,
    type: 'fill',
    chapter: '高等数学-无穷级数',
    knowledgePoints: ['傅里叶级数', '和函数'],
    formulas: ['傅里叶级数性质', '延拓'],
    methods: ['周期延拓', '收敛定理'],
    content: '已知函数 $f(x)= \\begin{cases}0, & 0 \\leq x < \\frac{1}{2} \\\\ x^{2}, & \\frac{1}{2} \\leq x \\leq 1\\end{cases}$ 的傅里叶级数为 $\\sum_{n=1}^{\\infty} b_{n} \\sin n\\pi x$，$S(x)$ 为和函数，则 $S(-\\frac{7}{2})=$______',
    answer: '$\\frac{1}{8}$',
    analysis: '$S(-\\frac{7}{2})=S(-\\frac{7}{2}+4)=S(\\frac{1}{2})=\\frac{f(\\frac{1}{2}^{-})+f(\\frac{1}{2}^{+})}{2}=\\frac{0+\\frac{1}{4}}{2}=\\frac{1}{8}$'
  },
  {
    id: '2025-13',
    year: 2025,
    number: 13,
    type: 'fill',
    chapter: '高等数学-多元函数微分学',
    knowledgePoints: ['方向导数', '梯度'],
    formulas: ['方向导数公式', '梯度计算'],
    methods: ['梯度计算', '方向导数'],
    content: '已知函数 $u(x, y, z)=xy^{2}z^{3}$，向量 $n=(2, 2, -1)$，则 $\\frac{\\partial u}{\\partial n}|_{(1,1,1)}=$______',
    answer: '1',
    analysis: '$\\frac{\\partial u}{\\partial x}=y^{2}z^{3}$，$\\frac{\\partial u}{\\partial y}=2xyz^{3}$，$\\frac{\\partial u}{\\partial z}=3xy^{2}z^{2}$\n\n在 $(1,1,1)$ 处梯度 $\\nabla u=(1, 2, 3)$。\n\n向量 $\\vec{n}=(2, 2, -1)$ 归一化得 $\\vec{n}_{0}=(\\frac{2}{3}, \\frac{2}{3}, -\\frac{1}{3})$。\n\n$\\frac{\\partial u}{\\partial \\vec{n}}|_{(1,1,1)}=\\nabla u \\cdot \\vec{n}_{0}=(1, 2, 3) \\cdot (\\frac{2}{3}, \\frac{2}{3}, -\\frac{1}{3})=\\frac{2}{3}+\\frac{4}{3}-1=1$'
  },
  {
    id: '2025-14',
    year: 2025,
    number: 14,
    type: 'fill',
    chapter: '高等数学-曲线积分',
    knowledgePoints: ['曲线积分', '格林公式'],
    formulas: ['格林公式', '曲线积分计算'],
    methods: ['补线法', '格林公式'],
    content: '已知有向曲线 L 是沿抛物线 $y=1-x^{2}$ 从点 $(-1, 0)$ 到点 $(1, 0)$ 的一段，则曲线积分 $\\int_{L}(y+\\cos x) dx+(2x+\\cos y) dy=$______',
    answer: '$\\frac{4}{3}-2\\sin 1$',
    analysis: '记 $L_{0}$ 是从 $x=-1$ 到 $x=1$ 的直线。\n\n由格林公式：$I_{1}=\\oint_{L_{0}+L}(y+\\cos x) dx+(2x+\\cos y) dy=\\iint_{D} d\\sigma=\\int_{-1}^{1}(1-x^{2})dx=\\frac{4}{3}$\n\n又 $I_{2}=\\int_{L_{0}}(y+\\cos x) dx+(2x+\\cos y) dy=\\int_{-1}^{1} \\cos x dx=2\\sin 1$\n\n故 $I=\\frac{4}{3}-2\\sin 1$'
  },
  {
    id: '2025-15',
    year: 2025,
    number: 15,
    type: 'fill',
    chapter: '线性代数-矩阵',
    knowledgePoints: ['矩阵秩', '方程组同解'],
    formulas: ['秩的性质', '行列式'],
    methods: ['秩分析', '行列式计算'],
    content: '设矩阵 $A=\\begin{pmatrix}4 & 2 & -3 \\\\ a & 3 & -4 \\\\ b & 5 & -7\\end{pmatrix}$，若 $A^{2}x=0$ 与 $Ax=0$ 不同解，则 $a-b=$______',
    answer: '$-4$',
    analysis: '若 $A^{2}x=0$ 与 $Ax=0$ 同解，则 $r(A)=r(A^{2})$。如果 A 可逆，则同解。\n\n要想不同解，则 A 不可逆，即 $|A|=0$。\n\n$|A|=\\begin{vmatrix}4 & 2 & -3 \\\\ a & 3 & -4 \\\\ b & 5 & -7\\end{vmatrix}=0$\n\n得 $a-b=-4$。'
  },
  {
    id: '2025-16',
    year: 2025,
    number: 16,
    type: 'fill',
    chapter: '概率论-随机事件',
    knowledgePoints: ['独立性', '条件概率'],
    formulas: ['概率公式', '独立性'],
    methods: ['方程求解', '条件概率'],
    content: '设 A, B 为两个随机事件，且 A 与 B 相互独立。已知 $P(A)=2P(B)$，$P(A \\cup B)=\\frac{5}{8}$，则在事件 A, B 至少有一个发生的条件下，A, B 中恰有一个发生的概率为______',
    answer: '$\\frac{4}{5}$',
    analysis: '$P(A \\cup B)=P(A)+P(B)-P(A)P(B)=\\frac{5}{8}$\n\n$\\Rightarrow 3P(B)-2P^{2}(B)=\\frac{5}{8}$\n\n$\\Rightarrow 16P^{2}(B)-24P(B)+5=0$\n\n解得 $P(B)=\\frac{1}{4}$，$P(A)=\\frac{1}{2}$。\n\n$P(A\\bar{B})+P(\\bar{A}B)=P(A)-P(A)P(B)+P(B)-P(A)P(B)=\\frac{1}{2}+\\frac{1}{4}-2 \\times \\frac{1}{4} \\times \\frac{1}{2}=\\frac{1}{2}$\n\n所求概率 $=\\frac{\\frac{1}{2}}{\\frac{5}{8}}=\\frac{4}{5}$'
  },
  {
    id: '2025-17',
    year: 2025,
    number: 17,
    type: 'answer',
    chapter: '高等数学-不定积分',
    knowledgePoints: ['有理函数积分', '部分分式'],
    formulas: ['部分分式分解', '积分公式'],
    methods: ['部分分式法'],
    content: '（本题满分10分）计算 $\\int_{0}^{1} \\frac{1}{(x+1)(x^{2}-2x+2)} dx$。',
    answer: '$\\frac{1}{5}\\ln 2+\\frac{1}{10}\\pi$',
    analysis: '设 $\\frac{1}{(x+1)(x^{2}-2x+2)}=\\frac{A}{x+1}+\\frac{Bx+C}{x^{2}-2x+2}$\n\n解得 $A=\\frac{1}{5}$，$B=-\\frac{1}{5}$，$C=\\frac{3}{5}$。\n\n$\\int_{0}^{1} \\frac{1}{(x+1)(x^{2}-2x+2)} dx$\n\n$=\\int_{0}^{1}(\\frac{\\frac{1}{5}}{x+1}+\\frac{-\\frac{1}{5}x+\\frac{3}{5}}{x^{2}-2x+2}) dx$\n\n$=\\frac{1}{5}\\ln|1+x||_{0}^{1}-\\frac{1}{10}\\ln|x^{2}-2x+2||_{0}^{1}+\\frac{2}{5}\\arctan(x-1)|_{0}^{1}$\n\n$=\\frac{1}{5}\\ln 2+\\frac{1}{10}\\pi$'
  },
  {
    id: '2025-18',
    year: 2025,
    number: 18,
    type: 'answer',
    chapter: '高等数学-多元函数微分学',
    knowledgePoints: ['偏导数', '微分方程'],
    formulas: ['复合函数求导', '一阶线性微分方程'],
    methods: ['变量替换', '解微分方程'],
    content: '（本题满分10分）已知函数 $f(u)$ 在区间 $(0,+\\infty)$ 内具有2阶导数，记 $g(x, y)=f(\\frac{x}{y})$。若 $g(x, y)$ 满足 $x^{2}\\frac{\\partial^{2} g}{\\partial x^{2}}+xy\\frac{\\partial^{2} g}{\\partial x \\partial y}+y^{2}\\frac{\\partial^{2} g}{\\partial y^{2}}=1$，且 $g(x, x)=1$，$\\frac{\\partial g}{\\partial x}|_{(x, x)}=\\frac{2}{x}$，求 $f(u)$。',
    answer: '$f(u)=\\frac{1}{2}\\ln^{2} u+2\\ln u+1$',
    analysis: '令 $u=\\frac{x}{y}$，则 $\\frac{\\partial g}{\\partial x}=f\'(u)\\frac{1}{y}$，$\\frac{\\partial g}{\\partial y}=f\'(u)(-\\frac{x}{y^{2}})$。\n\n$g(x, x)=f(1)=1$，$\\frac{\\partial g}{\\partial x}|_{(x, x)}=f\'(1)\\frac{1}{x}=\\frac{2}{x}$，故 $f\'(1)=2$。\n\n$\\frac{\\partial^{2} g}{\\partial x^{2}}=f\'\'(u)\\frac{1}{y^{2}}$\n\n$\\frac{\\partial^{2} g}{\\partial x \\partial y}=-\\frac{x}{y^{3}}f\'\'(u)-\\frac{1}{y^{2}}f\'(u)$\n\n$\\frac{\\partial^{2} g}{\\partial y^{2}}=\\frac{x^{2}}{y^{4}}f\'\'(u)+\\frac{2x}{y^{3}}f\'(u)$\n\n代入原方程化简得：$u^{2}f\'\'(u)+uf\'(u)=1$\n\n令 $p=f\'(u)$，则 $p\'+\\frac{1}{u}p=\\frac{1}{u^{2}}$。\n\n解得 $p=\\frac{\\ln u}{u}+\\frac{C}{u}$，由 $p|_{u=1}=C=2$。\n\n故 $f\'(u)=\\frac{\\ln u}{u}+\\frac{2}{u}$。\n\n积分得 $f(u)=\\frac{1}{2}\\ln^{2} u+2\\ln u+C$，由 $f(1)=C=1$。\n\n故 $f(u)=\\frac{1}{2}\\ln^{2} u+2\\ln u+1$。'
  },
  {
    id: '2025-19',
    year: 2025,
    number: 19,
    type: 'answer',
    chapter: '高等数学-一元函数微分学',
    knowledgePoints: ['导数单调性', '拉格朗日中值定理'],
    formulas: ['拉格朗日中值定理', '导数性质'],
    methods: ['充分必要性证明', '中值定理'],
    content: '（本题满分10分）设函数 $f(x)$ 在区间 $(a, b)$ 内可导。证明导函数 $f\'(x)$ 在 $(a, b)$ 内严格单调增加的充分必要条件是对 $(a, b)$ 内任意的 $x_{1}, x_{2}, x_{3}$，当 $x_{1} < x_{2} < x_{3}$ 时 $\\frac{f(x_{2})-f(x_{1})}{x_{2}-x_{1}} < \\frac{f(x_{3})-f(x_{2})}{x_{3}-x_{2}}$。',
    answer: '见解析',
    analysis: '**充分性**：若对 $(a, b)$ 内任意的 $x_{1} < x_{2} < x_{3}$，都有\n\n$\\frac{f(x_{2})-f(x_{1})}{x_{2}-x_{1}} < \\frac{f(x_{3})-f(x_{2})}{x_{3}-x_{2}}$\n\n令 $x_{2} \\to x_{1}^{+}$ 得 $f\'_{+}(x_{1}) \\leq \\frac{f(x_{3})-f(x_{1})}{x_{3}-x_{1}}$\n\n令 $x_{2} \\to x_{3}^{-}$ 得 $\\frac{f(x_{3})-f(x_{1})}{x_{3}-x_{1}} \\leq f\'_{-}(x_{3})$\n\n由 $f\'(x)$ 存在，得 $f\'(x_{1}) < f\'(x_{3})$，充分性得证。\n\n**必要性**：已知 $f\'(x)$ 单调递增，在 $[x_{1}, x_{2}]$，$[x_{2}, x_{3}]$ 上分别使用拉格朗日中值定理：\n\n存在 $\\xi_{1} \\in (x_{1}, x_{2})$，$\\xi_{2} \\in (x_{2}, x_{3})$，使\n\n$f\'(\\xi_{1})=\\frac{f(x_{2})-f(x_{1})}{x_{2}-x_{1}}$，$f\'(\\xi_{2})=\\frac{f(x_{3})-f(x_{2})}{x_{3}-x_{2}}$\n\n由 $f\'(x)$ 单调递增且 $\\xi_{1} < \\xi_{2}$，得 $f\'(\\xi_{1}) < f\'(\\xi_{2})$，必要性得证。'
  },
  {
    id: '2025-20',
    year: 2025,
    number: 20,
    type: 'answer',
    chapter: '高等数学-曲面积分',
    knowledgePoints: ['曲面积分', '高斯公式'],
    formulas: ['高斯公式', '旋转曲面'],
    methods: ['补面法', '高斯公式'],
    content: '（本题满分10分）设 $\\Sigma$ 是由直线 $l_{1}: \\begin{cases}x=0 \\\\ y=0 \\\\ z=0\\end{cases}$ 绕直线 $l_{2}: \\begin{cases}x=t \\\\ y=t \\\\ z=t\\end{cases}$ 旋转所得曲面，$\\Sigma_{1}$ 是 $\\Sigma$ 介于平面 $x+y+z=0$ 与平面 $x+y+z=1$ 之间部分的外侧，计算曲面积分 $I=\\iint_{\\Sigma_{1}} x dydz+(y+1) dzdx+(z+2) dxdy$。',
    answer: '$I=\\frac{\\sqrt{2}}{4}\\pi-1$',
    analysis: '直线 $l_{1}$ 绕直线 $l_{2}$ 旋转所得曲面 $\\Sigma$ 为圆锥面。\n\n补面 $\\Sigma_{0}: x+y+z=1$，方向指向外侧。\n\n由高斯公式：\n\n$I_{1}=\\oiint_{\\Sigma_{0}+\\Sigma_{1}} x dydz+(y+1) dzdx+(z+2) dxdy$\n\n$=\\iiint_{\\Omega} 3 dv = 3 \\cdot \\frac{1}{3}\\pi(\\frac{\\sqrt{2}}{2})^{2} \\cdot \\frac{\\sqrt{2}}{2} = \\frac{\\sqrt{2}}{4}\\pi$\n\n又 $I_{2}=\\iint_{\\Sigma_{0}} x dydz+(y+1) dzdx+(z+2) dxdy$\n\n$=\\iint_{D_{xy}} [x + (y+1) + (3-x-y)] dxdy = \\iint_{D_{xy}} 2 dxdy = 2 \\cdot \\frac{1}{2} \\cdot 1 \\cdot 1 = 1$\n\n故 $I = I_{1} - I_{2} = \\frac{\\sqrt{2}}{4}\\pi - 1$'
  },
  {
    id: '2025-21',
    year: 2025,
    number: 21,
    type: 'answer',
    chapter: '线性代数-特征值',
    knowledgePoints: ['特征值', '特征向量'],
    formulas: ['特征方程', '特征向量'],
    methods: ['特征值计算', '向量关系'],
    content: '（本题满分10分）设矩阵 $A=\\begin{pmatrix}0 & -1 & 2 \\\\ -1 & 0 & 2 \\\\ -1 & -1 & a\\end{pmatrix}$，且 $\\lambda=1$ 是 A 的特征多项式的重根。\n\n(1) 求 a 的值；\n\n(2) 求所有满足 $A\\alpha=\\alpha+\\beta$，$A^{2}\\alpha=\\alpha+2\\beta$ 的非零列向量 $\\alpha, \\beta$。',
    answer: '(1) $a=3$；(2) $\\alpha=(a_{1}, a_{2}, a_{3})^{T}$，$\\beta=(2a_{3}-a_{1}-a_{2})(1, 1, 1)^{T}$，其中 $a_{1}a_{2}a_{3} \\neq 0$，$a_{1}+a_{2} \\neq 2a_{3}$',
    analysis: '(1) $f(\\lambda)=|A-\\lambda E|=(1-\\lambda)[(\\lambda-a)(\\lambda+1)+4]$\n\n由 $\\lambda=1$ 是重根，得 $(1-a)(1+1)+4=0$，故 $a=3$。\n\n(2) 由(1)知 $A=\\begin{pmatrix}0 & -1 & 2 \\\\ -1 & 0 & 2 \\\\ -1 & -1 & 3\\end{pmatrix}$。\n\n由 $A\\alpha=\\alpha+\\beta$，$A^{2}\\alpha=\\alpha+2\\beta$，得 $(A-E)\\alpha=\\beta$，$(A^{2}-E)\\alpha=2\\beta=2(A-E)\\alpha$。\n\n即 $(A-E)^{2}\\alpha=0$，其中 $(A-E)^{2}=0$。\n\n故 $\\alpha$ 为任意非零向量，$\\alpha=(a_{1}, a_{2}, a_{3})^{T}$，$a_{1}a_{2}a_{3} \\neq 0$。\n\n$\\beta=(A-E)\\alpha=\\begin{pmatrix}-1 & -1 & 2 \\\\ -1 & -1 & 2 \\\\ -1 & -1 & 2\\end{pmatrix}\\begin{pmatrix}a_{1} \\\\ a_{2} \\\\ a_{3}\\end{pmatrix}=\\begin{pmatrix}2a_{3}-a_{1}-a_{2} \\\\ 2a_{3}-a_{1}-a_{2} \\\\ 2a_{3}-a_{1}-a_{2}\\end{pmatrix}$\n\n其中 $a_{1}+a_{2} \\neq 2a_{3}$。'
  },
  {
    id: '2025-22',
    year: 2025,
    number: 22,
    type: 'answer',
    chapter: '概率论-随机变量',
    knowledgePoints: ['概率密度', '期望', '泊松分布'],
    formulas: ['期望公式', '泊松分布'],
    methods: ['概率计算', '条件分布'],
    content: '（本题满分12分）投保人的损失事件发生时，保险公司的赔付额 Y 与投保人的损失额 X 的关系为 $Y= \\begin{cases}0, & X \\leq 100 \\\\ X-100, & X > 100\\end{cases}$。\n\n设定损事件发生时，投保人的损失额 X 的概率密度为 $f(x)= \\begin{cases}\\frac{2 \\times 100^{2}}{(100+x)^{3}}, & x > 0 \\\\ 0, & x \\leq 0\\end{cases}$。\n\n(1) 求 $P\\{Y > 0\\}$ 及 $EY$；\n\n(2) 这种损失事件在一年内发生的次数记为 N，保险公司在一年内就这种损失事件产生的理赔次数记为 M。假设 N 服从参数为8的泊松分布，在 $N=n(n \\geq 1)$ 的条件下，M 服从二项分布 $B(n, p)$，其中 $p=P\\{Y > 0\\}$，求 M 的概率分布。',
    answer: '(1) $P\\{Y > 0\\}=\\frac{1}{4}$，$EY=50$；(2) $M \\sim P(2)$',
    analysis: '(1) $P\\{Y > 0\\}=P\\{X > 100\\}=\\int_{100}^{+\\infty} \\frac{2 \\times 100^{2}}{(100+x)^{3}} dx = \\frac{1}{4}$\n\n$EY=\\int_{100}^{+\\infty} (x-100) \\frac{2 \\times 100^{2}}{(100+x)^{3}} dx = 50$\n\n(2) $P\\{M=m\\}=\\sum_{n=m}^{\\infty} P\\{N=n\\} \\cdot P\\{M=m | N=n\\}$\n\n$=\\sum_{n=m}^{\\infty} \\frac{8^{n}}{n!}e^{-8} \\cdot C_{n}^{m}(\\frac{1}{4})^{m}(\\frac{3}{4})^{n-m}$\n\n$=(\\frac{1}{4})^{m}e^{-8}\\frac{8^{m}}{m!}\\sum_{n=m}^{\\infty} \\frac{6^{n-m}}{(n-m)!}$\n\n$=\\frac{2^{m}}{m!}e^{-2}$\n\n即 $M \\sim P(2)$。'
  }
]

export const questionSet2025: QuestionSet = {
  id: '2025-math1',
  name: '2025年考研数学一真题',
  year: 2025,
  source: '全国硕士研究生招生考试',
  questions: questions2025
}
