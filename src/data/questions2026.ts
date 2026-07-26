import { Question, QuestionSet } from '@/types/question'

export const questions2026: Question[] = [
  {
    id: '2026-01',
    year: 2026,
    number: 1,
    type: 'choice',
    chapter: '高等数学-多元函数微分学',
    knowledgePoints: ['隐函数求导', '偏导数'],
    formulas: ['隐函数求导公式', '偏导数计算'],
    methods: ['公式法', '直接求导'],
    content: '设函数 $z=z(x, y)$ 由方程 $x-az=e^{y+az}$（$a$是非0常数）确定，则（）',
    options: [
      'A. $\\frac{\\partial z}{\\partial x}-\\frac{\\partial z}{\\partial y}=\\frac{1}{a}$',
      'B. $\\frac{\\partial z}{\\partial x}+\\frac{\\partial z}{\\partial y}=\\frac{1}{a}$',
      'C. $\\frac{\\partial z}{\\partial x}-\\frac{\\partial z}{\\partial y}=-\\frac{1}{a}$',
      'D. $\\frac{\\partial z}{\\partial x}+\\frac{\\partial z}{\\partial y}=-\\frac{1}{a}$'
    ],
    answer: 'A',
    analysis: '利用多元隐函数求导公式求偏导，令 $F(x, y, z)=e^{y+az}+az-x$，则 $F_x\'=-1$，$F_y\'=e^{y+az}$，$F_z\'=a(1+e^{y+az})$。\n\n故 $\\frac{\\partial z}{\\partial x}-\\frac{\\partial z}{\\partial y}=-\\frac{F_x\'}{F_z\'}-(-\\frac{F_y\'}{F_z\'})=\\frac{1}{a}$。'
  },
  {
    id: '2026-02',
    year: 2026,
    number: 2,
    type: 'choice',
    chapter: '高等数学-无穷级数',
    knowledgePoints: ['幂级数', '收敛域'],
    formulas: ['收敛半径', '比值判别法'],
    methods: ['拆分奇偶项', '根值判别法'],
    content: '级数 $\\sum_{n=1}^{\\infty}(\\frac{3+(-1)^n}{4})^n x^{2n}$ 的收敛域是（）',
    options: [
      'A. $[-2,2]$',
      'B. $[-1,1]$',
      'C. $(-2,2)$',
      'D. $(-1,1)$'
    ],
    answer: 'D',
    analysis: '将级数拆分为奇偶项：\n\n$\\sum_{n=1}^{\\infty}(\\frac{3+(-1)^n}{4})^n x^{2n}=\\sum_{n=1}^{\\infty}(\\frac{3+(-1)^{2n-1}}{4})^{2n-1} x^{4n-2}+\\sum_{n=1}^{\\infty}(\\frac{3+(-1)^{2n}}{4})^{2n} x^{4n}$\n\n$=\\sum_{n=1}^{\\infty}(\\frac{1}{2})^{2n-1} x^{4n-2}+\\sum_{n=1}^{\\infty} x^{4n}$。\n\n其中 $\\sum_{n=1}^{\\infty}(\\frac{1}{2})^{2n-1} x^{4n-2}$ 收敛半径为 $\\sqrt{2}$，$\\sum_{n=1}^{\\infty} x^{4n}$ 收敛半径为1，故原级数收敛半径为1。\n\n又 $\\lim\\limits_{n \\to \\infty}(\\frac{3+(-1)^n}{4})^n$ 不存在，当 $x=\\pm1$ 时，$\\sum_{n=1}^{\\infty}(\\frac{3+(-1)^n}{4})^n$ 发散，故收敛域为 $(-1,1)$。'
  },
  {
    id: '2026-03',
    year: 2026,
    number: 3,
    type: 'choice',
    chapter: '高等数学-一元函数微分学',
    knowledgePoints: ['极值', '单调性', '凹凸性'],
    formulas: ['极值判别法', '凹凸性判定'],
    methods: ['反例法', '定义验证'],
    content: '设函数 $f(x)$ 在区间 $[-1,1]$ 上有定义，则（）',
    options: [
      'A. 当 $f(x)$ 在 $(-1,0)$ 单调递减，在 $(0,1)$ 单调递增时，$f(0)$ 是极小值',
      'B. 当 $f(0)$ 是极小值时，$f(x)$ 在 $(-1,0)$ 单调递减，在 $(0,1)$ 单调递增',
      'C. 当 $f(x)$ 的图形在 $[-1,1]$ 是凹的时，$\\frac{f(x)-f(1)}{x-1}$ 在 $[-1,1)$ 单调递增',
      'D. 当 $\\frac{f(x)-f(1)}{x-1}$ 在 $[-1,1)$ 单调递增时，$f(x)$ 的图形在 $[-1,1]$ 是凹的'
    ],
    answer: 'C',
    analysis: '(A) 极值第一判别法要求 $f(x)$ 在 $x=0$ 处连续，故错；\n\n(B) 取 $f(x)=-\\cos10x$，在 $x=0$ 处取极小值，但在 $(-1,0)$ 和 $(0,1)$ 非单调，故错；\n\n(D) 取 $f(x)=x^3+x^2-2x$，则 $\\frac{f(x)-f(1)}{x-1}=x^2+2x$ 单调递增，但 $f\'\'(x)=6x+2$ 在 $x=-\\frac{1}{3}$ 两侧异号，凹性改变，故错；\n\n(C) 设 $f(x)$ 在 $[-1,1]$ 上凹，需证对 $\\forall x_1<x_2$，有 $\\frac{f(x_1)-f(1)}{x_1-1}<\\frac{f(x_2)-f(1)}{x_2-1}$。\n\n由凹函数定义：$\\forall x,y\\in[-1,1],\\lambda\\in(0,1)$，有 $f(\\lambda x+(1-\\lambda)y)<\\lambda f(x)+(1-\\lambda)f(y)$。\n\n令 $\\lambda=\\frac{x_2-x_1}{1-x_1},x=1,y=x_1$，则 $f(x_2)=f(\\lambda\\cdot1+(1-\\lambda)x_1)<\\lambda f(1)+(1-\\lambda)f(x_1)$，整理得 $\\frac{f(x_1)-f(1)}{x_1-1}<\\frac{f(x_2)-f(1)}{x_2-1}$，得证。'
  },
  {
    id: '2026-04',
    year: 2026,
    number: 4,
    type: 'choice',
    chapter: '高等数学-重积分',
    knowledgePoints: ['三重积分', '球坐标变换'],
    formulas: ['球坐标变换公式', '体积元素'],
    methods: ['坐标变换', '定限'],
    content: '已知有界区域 $\\Omega$ 由曲面 $z=\\sqrt{4-x^2-y^2}$ 与 $z=\\sqrt{x^2+y^2}$ 围成，函数 $f(u)$ 连续，则 $\\iiint_{\\Omega} f(x^2+y^2+z^2) dxdydz=$（）',
    options: [
      'A. $\\int_{0}^{2\\pi} d\\theta \\int_{0}^{2} dr \\int_{r}^{\\sqrt{4-r^2}} f(r^2+z^2) rdz$',
      'B. $\\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\sqrt{2}} dr \\int_{0}^{\\sqrt{4-r^2}} f(r^2+z^2) rdz$',
      'C. $\\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\frac{\\pi}{4}} d\\varphi \\int_{0}^{2} f(r^2) r^2 \\sin\\varphi dr$',
      'D. $\\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\frac{\\pi}{2}} d\\varphi \\int_{0}^{2} f(r^2) r^2 \\sin\\varphi dr$'
    ],
    answer: 'C',
    analysis: '三重积分化为球坐标系下累次积分，球坐标变换：$x=r\\sin\\varphi\\cos\\theta,y=r\\sin\\varphi\\sin\\theta,z=r\\cos\\varphi$，$dV=r^2\\sin\\varphi drd\\varphi d\\theta$。\n\n曲面 $z=\\sqrt{4-x^2-y^2}$ 对应 $r=2$，$z=\\sqrt{x^2+y^2}$ 对应 $\\varphi=\\frac{\\pi}{4}$，故 $\\iiint_{\\Omega} f(x^2+y^2+z^2) dV=\\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\frac{\\pi}{4}} d\\varphi \\int_{0}^{2} f(r^2) r^2 \\sin\\varphi dr$。'
  },
  {
    id: '2026-05',
    year: 2026,
    number: 5,
    type: 'choice',
    chapter: '线性代数-矩阵',
    knowledgePoints: ['置换矩阵', '伴随矩阵', '逆矩阵'],
    formulas: ['伴随矩阵性质', '逆矩阵性质'],
    methods: ['初等变换', '矩阵分解'],
    content: '单位矩阵经过若干次互换两行得到的矩阵为置换矩阵，设 $A$ 为 $n$ 阶置换矩阵，$A^*$ 为 $A$ 的伴随矩阵，则（）',
    options: [
      'A. $A^*$ 为置换矩阵',
      'B. $A^{-1}$ 为置换矩阵',
      'C. $A^{-1}=A^*$',
      'D. $A^{-1}=-A^*$'
    ],
    answer: 'B',
    analysis: '设 $A=P_1P_2\\cdots P_s$，其中 $P_1,P_2,\\cdots,P_s$ 为初等互换矩阵，则 $A^{-1}=(P_1P_2\\cdots P_s)^{-1}=P_s^{-1}\\cdots P_2^{-1}P_1^{-1}=P_s\\cdots P_2P_1$，初等互换矩阵的逆为自身，故 $A^{-1}$ 仍为置换矩阵。'
  },
  {
    id: '2026-06',
    year: 2026,
    number: 6,
    type: 'choice',
    chapter: '线性代数-线性方程组',
    knowledgePoints: ['线性表示', '方程组解的存在性'],
    formulas: ['线性表示的定义', '方程组有解条件'],
    methods: ['矩阵分解', '向量关系'],
    content: '设 $A,B$ 为 $n$ 阶矩阵，$\\beta$ 是 $n$ 维列向量，若 $A$ 的列向量组可由 $B$ 的列向量组表示，则（）',
    options: [
      'A. 当 $Ax=\\beta$ 有解时，$Bx=\\beta$ 有解',
      'B. 当 $A^Tx=\\beta$ 有解时，$B^Tx=\\beta$ 有解',
      'C. 当 $Bx=\\beta$ 有解时，$Ax=\\beta$ 有解',
      'D. 当 $B^Tx=\\beta$ 有解时，$A^Tx=\\beta$ 有解'
    ],
    answer: 'A',
    analysis: '由题设，存在 $n$ 阶矩阵 $C$ 使得 $A=BC$。若 $Ax=\\beta$ 有解，则 $\\exists x_0$ 使 $BCx_0=\\beta$，令 $X=Cx_0$，则 $BX=\\beta$，即 $Bx=\\beta$ 有解。'
  },
  {
    id: '2026-07',
    year: 2026,
    number: 7,
    type: 'choice',
    chapter: '线性代数-二次型',
    knowledgePoints: ['二次型', '特征值', '规范形'],
    formulas: ['特征方程', '正交变换'],
    methods: ['特征值法', '配方法'],
    content: '设二次型 $f(x_1, x_2, x_3)=a(x_1^2+x_2^2+x_3^2)+4x_1x_2+4x_1x_3+4x_2x_3$，若方程 $f(x_1, x_2, x_3)=-1$ 表示的曲面为圆柱面，则（）',
    options: [
      'A. $a=-4$，且 $f$ 的规范形为 $-y_1^2-y_2^2-y_3^2$',
      'B. $a=-4$，且 $f$ 在正交变换下的标准形为 $-6y_1^2-6y_2^2$',
      'C. $a=2$，且 $f$ 的规范形为 $-y_1^2-y_2^2-y_3^2$',
      'D. $a=2$，且 $f$ 在正交变换下的标准形为 $-6y_1^2-6y_2^2$'
    ],
    answer: 'B',
    analysis: '$f=-1$ 为圆柱面，故二次型矩阵 $A$ 的特征值满足 $\\lambda_1<0,\\lambda_2<0,\\lambda_3=0$，即 $|A|=0$。\n\n二次型矩阵 $A=\\begin{pmatrix}a&2&2\\\\2&a&2\\\\2&2&a\\end{pmatrix}$，计算得 $|A|=(a+4)(a-2)^2=0$，故 $a=-4$ 或 $a=2$。\n\n又迹 $\\lambda_1+\\lambda_2+\\lambda_3=3a<0$，故 $a=-4$。\n\n此时 $A=\\begin{pmatrix}-4&2&2\\\\2&-4&2\\\\2&2&-4\\end{pmatrix}$，特征方程 $|\\lambda E-A|=0$，解得特征值 $\\lambda_1=\\lambda_2=-6,\\lambda_3=0$，故正交变换下标准形为 $-6y_1^2-6y_2^2$。'
  },
  {
    id: '2026-08',
    year: 2026,
    number: 8,
    type: 'choice',
    chapter: '概率论-随机变量',
    knowledgePoints: ['正态分布', '期望', '方差'],
    formulas: ['期望性质', '方差性质'],
    methods: ['展开计算', '性质应用'],
    content: '设随机变量 $X \\sim N(1,2)$，令 $f(t)=E[(X+t)^2]$，则 $f(t)$ 的最小值点和最小值分别为（）',
    options: [
      'A. 1,2',
      'B. 1,4',
      'C. -1,2',
      'D. -1,4'
    ],
    answer: 'C',
    analysis: '由期望与方差的性质：\n\n$f(t)=E[(X+t)^2]=D(X+t)+[E(X+t)]^2=DX+(EX+t)^2=2+(1+t)^2$。\n\n当 $t=-1$ 时，$f(t)$ 取最小值 $2$。'
  },
  {
    id: '2026-09',
    year: 2026,
    number: 9,
    type: 'choice',
    chapter: '概率论-随机变量',
    knowledgePoints: ['分布函数', '期望', '方差'],
    formulas: ['分布函数性质', '期望方差公式'],
    methods: ['分布变换', '参数确定'],
    content: '设连续型随机变量 $X$ 的分布函数为 $F(x)$，随机变量 $Y$ 的分布函数为 $F(ay+b)$，$X$ 的数学期望为 $\\mu$，方差为 $\\sigma^2(\\sigma>0)$，若 $Y$ 的数学期望和方差分别为0和1，则（）',
    options: [
      'A. $a=\\sigma, b=\\mu$',
      'B. $a=\\sigma, b=-\\mu$',
      'C. $a=\\frac{1}{\\sigma}, b=\\mu$',
      'D. $a=\\frac{1}{\\sigma}, b=-\\mu$'
    ],
    answer: 'A',
    analysis: '由分布函数关系知 $a>0$，且 $Y=\\frac{1}{a}X-\\frac{b}{a}$。\n\n则 $D(Y)=\\frac{1}{a^2}D(X)=\\frac{\\sigma^2}{a^2}=1 \\Rightarrow a=\\sigma$；\n\n$E(Y)=\\frac{1}{a}E(X)-\\frac{b}{a}=\\frac{\\mu-b}{\\sigma}=0 \\Rightarrow b=\\mu$。'
  },
  {
    id: '2026-10',
    year: 2026,
    number: 10,
    type: 'choice',
    chapter: '概率论-随机变量',
    knowledgePoints: ['条件概率', '分布律'],
    formulas: ['条件概率公式', '分布律性质'],
    methods: ['直接计算', '不等式验证'],
    content: '设随机变量 $X$ 的分布律为 $P\\{X=k\\}=\\frac{1}{2^{k+1}}+\\frac{1}{3^k}\\ (k=1,2,\\dots)$，则对于正整数 $m,n$，有（）',
    options: [
      'A. $P\\{X>m+n | X>m\\}=P\\{X>m\\}$',
      'B. $P\\{X>m+n | X>m\\}=P\\{X>n\\}$',
      'C. $P\\{X>m+n | X>m\\}>P\\{X>m\\}$',
      'D. $P\\{X>m+n | X>m\\}>P\\{X>n\\}$'
    ],
    answer: 'D',
    analysis: '由条件概率公式：$P\\{X>m+n | X>m\\}=\\frac{P\\{X>m+n\\}}{P\\{X>m\\}}$。\n\n计算得：$P\\{X>k\\}=\\sum_{i=k+1}^{\\infty}(\\frac{1}{2^{i+1}}+\\frac{1}{3^i})=\\frac{1}{2^{k+1}}+\\frac{1}{2}\\cdot\\frac{1}{3^k}$。\n\n验证 $P\\{X>m+n\\}-P\\{X>m\\}P\\{X>n\\}$：\n\n$P\\{X>m+n\\}-P\\{X>m\\}P\\{X>n\\}$\n\n$=\\frac{1}{4}(\\frac{1}{2^{m+n}}+\\frac{1}{3^{m+n}}-\\frac{1}{2^n3^m}-\\frac{1}{3^n2^m})$\n\n$=\\frac{1}{4}(\\frac{1}{3^n}-\\frac{1}{2^n})(\\frac{1}{3^m}-\\frac{1}{2^m})>0$，\n\n故 $\\frac{P\\{X>m+n\\}}{P\\{X>m\\}}>P\\{X>n\\}$。'
  },
  {
    id: '2026-11',
    year: 2026,
    number: 11,
    type: 'fill',
    chapter: '高等数学-向量代数',
    knowledgePoints: ['向量叉乘', '散度'],
    formulas: ['叉乘公式', '散度定义'],
    methods: ['直接计算'],
    content: '设向量 $\\overrightarrow{v_1}=(0, x, z)$，$\\overrightarrow{v_2}=(y, 0, 1)$，令 $\\vec{F}(x, y, z)=\\overrightarrow{v_1} \\times \\overrightarrow{v_2}$，则 $\\text{div}\\vec{F}=$______',
    answer: '$1+z$',
    analysis: '叉乘计算：$\\vec{F}=\\overrightarrow{v_1} \\times \\overrightarrow{v_2}=\\begin{vmatrix}\\vec{i} & \\vec{j} & \\vec{k} \\\\ 0 & x & z \\\\ y & 0 & 1\\end{vmatrix}=(x, yz, -xy)$，散度 $\\text{div}\\vec{F}=\\frac{\\partial x}{\\partial x}+\\frac{\\partial(yz)}{\\partial y}+\\frac{\\partial(-xy)}{\\partial z}=1+z$。'
  },
  {
    id: '2026-12',
    year: 2026,
    number: 12,
    type: 'fill',
    chapter: '高等数学-极限',
    knowledgePoints: ['极限计算', '等价无穷小', '泰勒展开'],
    formulas: ['等价无穷小', '泰勒公式'],
    methods: ['通分', '泰勒展开'],
    content: '$\\lim\\limits_{x \\to 0}(\\frac{1}{x}-\\frac{\\ln (1+x)}{x \\sin x})=$______',
    answer: '$\\frac{1}{2}$',
    analysis: '等价无穷小 $\\sin x \\sim x(x\\to0)$，通分后泰勒展开：\n\n$\\lim_{x \\to 0}(\\frac{1}{x}-\\frac{\\ln (1+x)}{x \\sin x})=\\lim_{x \\to 0} \\frac{\\sin x-\\ln (1+x)}{x^2}$\n\n$=\\lim_{x \\to 0} \\frac{[x+o(x^2)]-[x-\\frac{1}{2}x^2+o(x^2)]}{x^2}=\\frac{1}{2}$。'
  },
  {
    id: '2026-13',
    year: 2026,
    number: 13,
    type: 'fill',
    chapter: '高等数学-导数与微分',
    knowledgePoints: ['参数方程求导', '二阶导数'],
    formulas: ['参数求导公式'],
    methods: ['参数求导'],
    content: '设 $y=y(x)$ 由参数方程 $\\begin{cases}x=2 \\sin^2 t \\ (t \\in(0, \\frac{\\pi}{2})) \\\\ y=t+\\cos t \\ (t \\in(0, \\frac{\\pi}{2}))\\end{cases}$ 确定，则 $\\frac{d^2 y}{d x^2}\\big|_{x=\\frac{\\pi}{4}}=$______',
    answer: '$-\\frac{\\sqrt{2}}{8}$',
    analysis: '一阶参数求导：$x\'(t)=4\\sin t\\cos t=2\\sin2t$，$y\'(t)=1-\\sin t$，故 $\\frac{dy}{dx}=\\frac{y\'(t)}{x\'(t)}=\\frac{1-\\sin t}{2\\sin2t}$。\n\n二阶参数求导：$\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}(\\frac{dy}{dx})}{x\'(t)}=\\frac{-\\cos t\\cdot2\\sin2t-(1-\\sin t)\\cdot4\\cos2t}{8\\sin^32t}$。\n\n当 $x=\\frac{\\pi}{4}$ 时 $t=\\frac{\\pi}{4}$，代入得 $\\frac{d^2y}{dx^2}\\big|_{t=\\frac{\\pi}{4}}=-\\frac{\\sqrt{2}}{8}$。'
  },
  {
    id: '2026-14',
    year: 2026,
    number: 14,
    type: 'fill',
    chapter: '高等数学-反常积分',
    knowledgePoints: ['反常积分', '分部积分'],
    formulas: ['分部积分公式'],
    methods: ['分部积分法'],
    content: '$\\int_{1}^{+\\infty} \\frac{\\ln (x+1)}{x^2} d x=$______',
    answer: '$2\\ln2$',
    analysis: '分部积分法：\n\n$\\int \\frac{\\ln (1+x)}{x^2} dx=\\int \\ln (1+x) d(-\\frac{1}{x})=-\\frac{1}{x}\\ln(1+x)+\\int \\frac{1}{x(1+x)}dx$\n\n$=-\\frac{1}{x}\\ln(1+x)+\\ln\\frac{x}{x+1}+C$。\n\n反常积分计算：\n\n$\\int_{1}^{+\\infty} \\frac{\\ln (1+x)}{x^2} dx=\\lim_{M\\to+\\infty}(-\\frac{1}{x}\\ln(1+x)+\\ln\\frac{x}{x+1})\\big|_{1}^{M}=2\\ln2$。'
  },
  {
    id: '2026-15',
    year: 2026,
    number: 15,
    type: 'fill',
    chapter: '线性代数-矩阵',
    knowledgePoints: ['矩阵的秩', '特征值'],
    formulas: ['特征方程', '秩的性质'],
    methods: ['特征值法'],
    content: '设 $A=\\begin{pmatrix}1 & 0 & 0 \\\\ 2 & a & 2 \\\\ 0 & 2 & a\\end{pmatrix}$，$B=\\begin{pmatrix}a & -1 & -1 \\\\ -1 & 2 & 1 \\\\ -1 & 1 & a\\end{pmatrix}$，若 $r(A)<r(B)$，则 $a$ 的取值范围为______',
    answer: '$a<0$',
    analysis: '求 $A$ 的特征值：$|\\lambda E-A|=(\\lambda-1)(\\lambda-a)^2-4(\\lambda-1)=0$，得 $\\lambda_1=1,\\lambda_2=a+2,\\lambda_3=a-2$；\n\n求 $B$ 的特征值：$|\\lambda E-B|=0$，得 $\\lambda_1=2,\\lambda_2=a+1,\\lambda_3=a-1$；\n\n由 $r(A)<r(B)$，得 $a+2<2 \\Rightarrow a<0$。'
  },
  {
    id: '2026-16',
    year: 2026,
    number: 16,
    type: 'fill',
    chapter: '概率论-随机变量',
    knowledgePoints: ['泊松分布', '期望', '独立性'],
    formulas: ['泊松分布性质', '期望性质'],
    methods: ['变形计算'],
    content: '设随机变量 $X$ 服从参数为1的泊松分布，随机变量 $Y$ 服从参数为3的泊松分布，$X$ 与 $Y-X$ 相互独立，则 $E(X Y)=$______',
    answer: '$4$',
    analysis: '变形 $XY=X(Y-X)+X^2$，由期望性质与独立性：\n\n$E(XY)=E[X(Y-X)]+E(X^2)=E(X)E(Y-X)+D(X)+[E(X)]^2$\n\n$=E(X)[E(Y)-E(X)]+D(X)+[E(X)]^2$。\n\n代入 $E(X)=1,D(X)=1,E(Y)=3$，得 $E(XY)=1\\times(3-1)+1+1^2=4$。'
  },
  {
    id: '2026-17',
    year: 2026,
    number: 17,
    type: 'answer',
    chapter: '高等数学-多元函数微分学',
    knowledgePoints: ['二元函数极值', '驻点', '二阶偏导'],
    formulas: ['极值判别法', '二阶偏导公式'],
    methods: ['求驻点', '判别极值'],
    content: '（本题满分10分）求 $f(x, y)=(2 x^2-y^2) e^x$ 的极值。',
    answer: '极大值为 $f(-2,0)=8e^{-2}$，无极小值。',
    analysis: '**步骤1：求驻点**\n\n求一阶偏导并令其为0：\n\n$\\begin{cases}f_x\'=(4x+2x^2-y^2)e^x=0 \\\\ f_y\'=-2ye^x=0\\end{cases} \\Rightarrow \\begin{cases}2x^2+4x-y^2=0 \\\\ y=0\\end{cases}$，解得驻点 $(0,0),(-2,0)$。\n\n**步骤2：判别极值**\n\n求二阶偏导：\n\n$\\begin{cases}f_{xx}\'\'=(2x^2+8x+4-y^2)e^x \\\\ f_{xy}\'\'=-2ye^x \\\\ f_{yy}\'\'=-2e^x\\end{cases}$\n\n- 点 $(0,0)$：$A=4,B=0,C=-2$，$AC-B^2=-8<0$，非极值点；\n\n- 点 $(-2,0)$：$A=-4e^{-2},B=0,C=-2e^{-2}$，$AC-B^2=8e^{-4}>0$，且 $A<0$，为极大值点。\n\n**结论**：极大值为 $f(-2,0)=8e^{-2}$，无极小值。'
  },
  {
    id: '2026-18',
    year: 2026,
    number: 18,
    type: 'answer',
    chapter: '高等数学-微分方程',
    knowledgePoints: ['全微分', '微分方程'],
    formulas: ['全微分条件', '二阶微分方程'],
    methods: ['混合偏导相等', '解微分方程'],
    content: '（本题满分12分）设 $f(u)$ 在 $(0,+\\infty)$ 内具有3阶连续导数，且存在可微函数 $F(x, y)$ 使 $d F(x, y)=\\frac{f(x y)}{x^2 y} d x+\\frac{f\'\'(x y)}{x y^2} d y\\ (x y>0)$。\n\n(1) 证明：$\\frac{f\'\'(u)}{u}-\\frac{f(u)}{u}=C$（$C$为常数）；\n\n(2) 设 $f(1)=1,f\'(1)=-1,f\'\'(1)=0$，求 $f(u)$ 的表达式。',
    answer: '(1) 见解析；(2) $f(u)=-e^{u-1}+e^{1-u}+u$',
    analysis: '(1) 由全微分定义，$\\frac{\\partial F}{\\partial x}=\\frac{f(xy)}{x^2y}$，$\\frac{\\partial F}{\\partial y}=\\frac{f\'\'(xy)}{xy^2}$。\n\n因 $f\'\'\'(u)$ 连续，故二阶混合偏导相等：$\\frac{\\partial^2 F}{\\partial x\\partial y}=\\frac{\\partial^2 F}{\\partial y\\partial x}$。\n\n计算混合偏导：\n\n$\\frac{\\partial}{\\partial y}(\\frac{f(xy)}{x^2y})=\\frac{f\'(xy)\\cdot x\\cdot y - f(xy)\\cdot1}{x^2y^2}$，\n\n$\\frac{\\partial}{\\partial x}(\\frac{f\'\'(xy)}{xy^2})=\\frac{f\'\'\'(xy)\\cdot y\\cdot x - f\'\'(xy)\\cdot1}{x^2y^2}$。\n\n等式两边消去分母，令 $u=xy$，得：$uf\'(u)-f(u)=uf\'\'\'(u)-f\'\'(u)$，\n\n整理为：$(\\frac{f\'\'(u)}{u})\'=(\\frac{f(u)}{u})\'$，故 $\\frac{f\'\'(u)}{u}-\\frac{f(u)}{u}=C$。\n\n(2) 由(1)得微分方程 $f\'\'(u)-f(u)=Cu$，代入初始条件 $f(1)=1,f\'\'(1)=0$，得 $0-1=C\\cdot1 \\Rightarrow C=-1$，\n\n故方程为 $f\'\'(u)-f(u)=-u$。\n\n**求通解**\n\n齐次方程 $f\'\'(u)-f(u)=0$ 的通解为 $f_h(u)=C_1e^u+C_2e^{-u}$；\n\n设特解 $f_p(u)=au+b$，代入方程得 $-au-b=-u \\Rightarrow a=1,b=0$，即 $f_p(u)=u$。\n\n通解为 $f(u)=C_1e^u+C_2e^{-u}+u$。\n\n代入 $f(1)=1,f\'(1)=-1$：\n\n$\\begin{cases}C_1e+C_2e^{-1}+1=1 \\\\ C_1e-C_2e^{-1}+1=-1\\end{cases} \\Rightarrow \\begin{cases}C_1e+C_2e^{-1}=0 \\\\ C_1e-C_2e^{-1}=-2\\end{cases}$，\n\n解得 $C_1=-e^{-1},C_2=e$。\n\n**结论**：$f(u)=-e^{u-1}+e^{1-u}+u$。'
  },
  {
    id: '2026-19',
    year: 2026,
    number: 19,
    type: 'answer',
    chapter: '高等数学-曲线积分',
    knowledgePoints: ['曲线积分', '格林公式'],
    formulas: ['格林公式', '曲线积分计算'],
    methods: ['补线法', '格林公式'],
    content: '（本题满分12分）设有向曲线 $L$ 为椭圆 $x^2+3 y^2=1$ 上沿逆时针方向从点 $A(-\\frac{1}{2},-\\frac{1}{2})$ 到点 $B(\\frac{1}{2}, \\frac{1}{2})$ 的部分，计算曲线积分 $I=\\int_{L}(e^{x^2} \\sin x-2 x y) d x+(6 x-x^2-y \\cos^4 y) d y$。',
    answer: '$I=\\sqrt{3}\\pi-\\frac{1}{4}$',
    analysis: '利用格林公式，**补线** $L_1:y=x$（$x$ 从 $-\\frac{1}{2}$ 到 $\\frac{1}{2}$），则 $L+L_1^-$ 为逆时针闭曲线。\n\n令 $P=e^{x^2}\\sin x-2xy$，$Q=6x-x^2-y\\cos^4y$，则 $\\frac{\\partial Q}{\\partial x}=6-2x$，$\\frac{\\partial P}{\\partial y}=-2x$，故 $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=6$。\n\n**步骤1：格林公式计算闭曲线积分**\n\n$\\int_{L+L_1^-} Pdx+Qdy=\\iint_{D}6dxdy$，其中 $D$ 为 $L+L_1^-$ 围成的区域，\n\n椭圆面积元计算得：$\\iint_{D}6dxdy=6\\cdot\\frac{1}{2}\\cdot\\pi\\cdot\\frac{1}{\\sqrt{3}}\\cdot1=\\sqrt{3}\\pi$。\n\n**步骤2：计算补线 $L_1$ 的积分**\n\n$\\int_{L_1} Pdx+Qdy=\\int_{-\\frac{1}{2}}^{\\frac{1}{2}}(e^{x^2}\\sin x-2x^2+6x-x^2-x\\cos^4x)dx$，\n\n由奇函数在对称区间积分得0，仅剩偶函数项：$\\int_{-\\frac{1}{2}}^{\\frac{1}{2}}-3x^2dx=-3\\cdot\\frac{2}{3}\\cdot(\\frac{1}{2})^3=-\\frac{1}{4}$。\n\n**步骤3：合并结果**\n\n$I=\\iint_{D}6dxdy+\\int_{L_1} Pdx+Qdy=\\sqrt{3}\\pi-\\frac{1}{4}$。'
  },
  {
    id: '2026-20',
    year: 2026,
    number: 20,
    type: 'answer',
    chapter: '高等数学-一元函数微分学',
    knowledgePoints: ['定积分性质', '罗尔定理'],
    formulas: ['罗尔定理', '积分换元'],
    methods: ['积分换元', '罗尔定理'],
    content: '（本题满分12分）设可导函数 $f(x)$ 严格单调递增且满足 $\\int_{-1}^{1} f(x) d x=0$，记 $a=\\int_{0}^{1} f(x) d x$。\n\n(1) 证明 $a>0$；\n\n(2) 令 $F(x)=a(1-x^2)+\\int_{1}^{x} f(t) d t$，证明：存在 $\\xi \\in(-1,1)$ 使 $F\'\'(\\xi)=0$。',
    answer: '(1)(2) 见解析',
    analysis: '(1) 由 $\\int_{-1}^{1}f(x)dx=0$，得 $\\int_{-1}^{0}f(x)dx=-\\int_{0}^{1}f(x)dx=-a$。\n\n对 $\\int_{-1}^{0}f(x)dx$ 作换元 $t=-x$，则 $\\int_{-1}^{0}f(x)dx=\\int_{1}^{0}f(-t)d(-t)=\\int_{0}^{1}f(-x)dx=-a$。\n\n故 $2a=\\int_{0}^{1}[f(x)-f(-x)]dx$。\n\n因 $f(x)$ 严格单调递增，$\\forall x\\in(0,1]$，$x>-x \\Rightarrow f(x)>f(-x)$，故积分大于0，即 $2a>0 \\Rightarrow a>0$。\n\n(2) 先计算 $F(x)$ 在关键点的函数值：\n\n- $F(-1)=a(1-1)+\\int_{1}^{-1}f(t)dt=-\\int_{-1}^{1}f(t)dt=0$；\n\n- $F(1)=a(1-1)+\\int_{1}^{1}f(t)dt=0$；\n\n- $F(0)=a(1-0)+\\int_{1}^{0}f(t)dt=a-\\int_{0}^{1}f(t)dt=a-a=0$。\n\n由**罗尔定理**：\n\n- $F(x)$ 在 $[-1,0]$ 上连续可导，$F(-1)=F(0)=0$，故 $\\exists \\xi_1\\in(-1,0)$，使 $F\'(\\xi_1)=0$；\n\n- $F(x)$ 在 $[0,1]$ 上连续可导，$F(0)=F(1)=0$，故 $\\exists \\xi_2\\in(0,1)$，使 $F\'(\\xi_2)=0$。\n\n又 $F\'(x)$ 在 $[\\xi_1,\\xi_2]$ 上连续可导，$F\'(\\xi_1)=F\'(\\xi_2)=0$，再次由罗尔定理，$\\exists \\xi\\in(\\xi_1,\\xi_2)\\subset(-1,1)$，使 $F\'\'(\\xi)=0$。'
  },
  {
    id: '2026-21',
    year: 2026,
    number: 21,
    type: 'answer',
    chapter: '线性代数-向量组',
    knowledgePoints: ['极大线性无关组', '矩阵运算'],
    formulas: ['矩阵乘法', '幂运算'],
    methods: ['初等行变换', '矩阵分解'],
    content: '（本题满分12分）设 $\\alpha_1=\\begin{pmatrix}1\\\\0\\\\-1\\\\-1\\end{pmatrix}$，$\\alpha_2=\\begin{pmatrix}1\\\\-1\\\\0\\\\-2\\end{pmatrix}$，$\\alpha_3=\\begin{pmatrix}0\\\\-1\\\\1\\\\-1\\end{pmatrix}$，$\\alpha_4=\\begin{pmatrix}0\\\\1\\\\-1\\\\1\\end{pmatrix}$，$A=(\\alpha_1,\\alpha_2,\\alpha_3,\\alpha_4)$，$G=(\\alpha_1,\\alpha_2)$。\n\n(1) 证明：$\\alpha_1,\\alpha_2$ 是 $\\alpha_1,\\alpha_2,\\alpha_3,\\alpha_4$ 的极大线性无关组；\n\n(2) 求矩阵 $H$ 使得 $A=GH$，并求 $A^{10}$。',
    answer: '(1) 见解析；(2) $H=\\begin{pmatrix}1 & 0 & -1 & 1 \\\\ 0 & 1 & 1 & -1\\end{pmatrix}$，$A^{10}=\\begin{pmatrix}1 & -8 & -9 & 9 \\\\ 0 & -1 & -1 & 1 \\\\ -1 & 9 & 10 & -10 \\\\ -1 & 7 & 8 & -8\\end{pmatrix}$',
    analysis: '(1) 将向量组按列构成矩阵作初等行变换：\n\n$(\\alpha_1,\\alpha_2,\\alpha_3,\\alpha_4)=\\begin{pmatrix}1 & 1 & 0 & 0 \\\\ 0 & -1 & -1 & 1 \\\\ -1 & 0 & 1 & -1 \\\\ -1 & -2 & -1 & 1\\end{pmatrix} \\xrightarrow{\\text{行变换}} \\begin{pmatrix}1 & 0 & -1 & 1 \\\\ 0 & 1 & 1 & -1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0\\end{pmatrix}$。\n\n秩 $r(\\alpha_1,\\alpha_2,\\alpha_3,\\alpha_4)=2$，且 $r(\\alpha_1,\\alpha_2)=2$，故 $\\alpha_1,\\alpha_2$ 线性无关；\n\n又 $\\alpha_3=-\\alpha_1+\\alpha_2$，$\\alpha_4=\\alpha_1-\\alpha_2$，其余向量可由 $\\alpha_1,\\alpha_2$ 线性表示，因此 $\\alpha_1,\\alpha_2$ 是极大线性无关组。\n\n(2) 由行变换结果，$\\alpha_1=1\\cdot\\alpha_1+0\\cdot\\alpha_2$，$\\alpha_2=0\\cdot\\alpha_1+1\\cdot\\alpha_2$，$\\alpha_3=-1\\cdot\\alpha_1+1\\cdot\\alpha_2$，$\\alpha_4=1\\cdot\\alpha_1-1\\cdot\\alpha_2$，故\n\n$H=\\begin{pmatrix}1 & 0 & -1 & 1 \\\\ 0 & 1 & 1 & -1\\end{pmatrix}$。\n\n**求 $A^{10}$**\n\n由 $A=GH$，得 $A^{10}=\\underbrace{GH\\cdot GH\\cdot\\cdots\\cdot GH}_{10次}=G(HG)^9H$。\n\n计算 $HG$：$HG=\\begin{pmatrix}1 & 0 & -1 & 1 \\\\ 0 & 1 & 1 & -1\\end{pmatrix}\\begin{pmatrix}1 & 1 \\\\ 0 & -1 \\\\ -1 & 0 \\\\ -1 & -2\\end{pmatrix}=\\begin{pmatrix}1 & -1 \\\\ 0 & 1\\end{pmatrix}$。\n\n幂运算：$(HG)^n=\\begin{pmatrix}1 & -n \\\\ 0 & 1\\end{pmatrix}$，故 $(HG)^9=\\begin{pmatrix}1 & -9 \\\\ 0 & 1\\end{pmatrix}$。\n\n因此：\n\n$A^{10}=G(HG)^9H=\\begin{pmatrix}1 & 1 \\\\ 0 & -1 \\\\ -1 & 0 \\\\ -1 & -2\\end{pmatrix}\\begin{pmatrix}1 & -9 \\\\ 0 & 1\\end{pmatrix}\\begin{pmatrix}1 & 0 & -1 & 1 \\\\ 0 & 1 & 1 & -1\\end{pmatrix}=\\begin{pmatrix}1 & -8 & -9 & 9 \\\\ 0 & -1 & -1 & 1 \\\\ -1 & 9 & 10 & -10 \\\\ -1 & 7 & 8 & -8\\end{pmatrix}$。'
  },
  {
    id: '2026-22',
    year: 2026,
    number: 22,
    type: 'answer',
    chapter: '概率论-参数估计',
    knowledgePoints: ['指数分布', '无偏估计', '最大似然估计'],
    formulas: ['指数分布性质', '似然函数'],
    methods: ['分布变换', '最大似然估计法'],
    content: '（本题满分12分）假设某种元件寿命服从指数分布，其均值 $\\theta$ 是未知参数，为估计 $\\theta$，取 $n$ 个这种元件同时做寿命实验，试验直到出现 $k(1 ≤k ≤n)$ 个元件失效时停止。\n\n(1) 若 $k=1$，失效元件寿命记为 $T$。(i) 求 $T$ 的概率密度；(ii) 确定 $a$，使 $\\hat{\\theta}=a T$ 是 $\\theta$ 的无偏估计，并求 $D(\\hat{\\theta})$；\n\n(2) 已知 $k$ 个失效元件寿命值分别为 $t_1 ≤t_2 ≤\\cdots ≤t_k$，似然函数为 $L(\\theta)=\\frac{1}{\\theta^k} e^{-\\frac{1}{\\theta}[\\sum_{i=1}^{k} t_i+(n-k) t_k]}$，求 $\\theta$ 的最大似然估计。',
    answer: '(1)(i) $f_T(t)=\\begin{cases}\\frac{n}{\\theta}e^{-\\frac{nt}{\\theta}}, & t>0 \\\\ 0, & 其他\\end{cases}$；(ii) $a=n$，$D(\\hat{\\theta})=\\theta^2$；(2) $\\hat{\\theta}=\\frac{1}{k}[\\sum_{i=1}^k t_i+(n-k)t_k]$',
    analysis: '指数分布的分布函数与概率密度：$F(x)=\\begin{cases}0, & x<0 \\\\ 1-e^{-\\frac{x}{\\theta}}, & x\\geq0\\end{cases}$，$f(x)=\\begin{cases}\\frac{1}{\\theta}e^{-\\frac{x}{\\theta}}, & x>0 \\\\ 0, & 其他\\end{cases}$，且 $T=\\min\\{X_1,X_2,\\dots,X_n\\}$。\n\n(1)(i) 求 $T$ 的分布函数：\n\n$F_T(t)=P\\{T\\leq t\\}=1-P\\{T>t\\}=1-P\\{\\min\\{X_1,\\dots,X_n\\}>t\\}$\n\n$=1-\\prod_{i=1}^n P\\{X_i>t\\}=1-[1-F(t)]^n=\\begin{cases}0, & t<0 \\\\ 1-e^{-\\frac{nt}{\\theta}}, & t\\geq0\\end{cases}$。\n\n求导得概率密度：$f_T(t)=\\begin{cases}\\frac{n}{\\theta}e^{-\\frac{nt}{\\theta}}, & t>0 \\\\ 0, & 其他\\end{cases}$。\n\n(ii) 无偏估计要求 $E(\\hat{\\theta})=E(aT)=\\theta$。\n\n由指数分布期望，$T\\sim E(\\frac{n}{\\theta})$，故 $E(T)=\\frac{\\theta}{n}$，因此 $a\\cdot\\frac{\\theta}{n}=\\theta \\Rightarrow a=n$。\n\n方差 $D(T)=(\\frac{\\theta}{n})^2$，故 $D(\\hat{\\theta})=D(nT)=n^2D(T)=\\theta^2$。\n\n(2) 对似然函数**取对数**：\n\n$\\ln L(\\theta)=-k\\ln\\theta-\\frac{1}{\\theta}[\\sum_{i=1}^k t_i+(n-k)t_k]$。\n\n对 $\\theta$ 求导并令其为0：\n\n$\\frac{d\\ln L(\\theta)}{d\\theta}=-\\frac{k}{\\theta}+\\frac{1}{\\theta^2}[\\sum_{i=1}^k t_i+(n-k)t_k]=0$。\n\n解得 $\\theta$ 的最大似然估计为：$\\hat{\\theta}=\\frac{1}{k}[\\sum_{i=1}^k t_i+(n-k)t_k]$。'
  }
]

export const questionSet2026: QuestionSet = {
  id: '2026-math1',
  name: '2026年考研数学一真题',
  year: 2026,
  source: '全国硕士研究生招生考试',
  questions: questions2026
}
