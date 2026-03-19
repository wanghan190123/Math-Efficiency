import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import './Calculator.css';

// 类型定义
interface HistoryItem {
  input: string;
  output: string;
  type: 'algebra' | 'function' | 'geometry' | 'coordinate';
}

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface FunctionData {
  expression: string;
  color: string;
  type: string;
  // 积分相关
  integral?: {
    a: number;
    b: number;
    value: number;
  };
}

// 符号面板数据 - 带说明
const SYMBOL_PANELS = {
  basic: {
    label: '基础运算',
    symbols: [
      { display: '7', insert: '7', hint: '数字7' }, { display: '8', insert: '8', hint: '数字8' }, { display: '9', insert: '9', hint: '数字9' },
      { display: '÷', insert: '/', hint: '除法' }, { display: '(', insert: '(', hint: '左括号' }, { display: ')', insert: ')', hint: '右括号' },
      { display: '4', insert: '4', hint: '数字4' }, { display: '5', insert: '5', hint: '数字5' }, { display: '6', insert: '6', hint: '数字6' },
      { display: '×', insert: '*', hint: '乘法' }, { display: 'x', insert: 'x', hint: '变量x' }, { display: 'y', insert: 'y', hint: '变量y' },
      { display: '1', insert: '1', hint: '数字1' }, { display: '2', insert: '2', hint: '数字2' }, { display: '3', insert: '3', hint: '数字3' },
      { display: '-', insert: '-', hint: '减法' }, { display: 'a', insert: 'a', hint: '参数a' }, { display: 'b', insert: 'b', hint: '参数b' },
      { display: '0', insert: '0', hint: '数字0' }, { display: '.', insert: '.', hint: '小数点' }, { display: 'π', insert: 'pi', hint: '圆周率≈3.14159' },
      { display: '+', insert: '+', hint: '加法' }, { display: 'e', insert: 'e', hint: '自然常数≈2.718' }, { display: ',', insert: ', ', hint: '分隔符' },
    ]
  },
  functions: {
    label: '函数',
    symbols: [
      { display: 'sin', insert: 'sin(', hint: '正弦函数' }, { display: 'cos', insert: 'cos(', hint: '余弦函数' }, { display: 'tan', insert: 'tan(', hint: '正切函数' },
      { display: 'sin⁻¹', insert: 'asin(', hint: '反正弦' }, { display: 'cos⁻¹', insert: 'acos(', hint: '反余弦' }, { display: 'tan⁻¹', insert: 'atan(', hint: '反正切' },
      { display: 'ln', insert: 'log(', hint: '自然对数' }, { display: 'log₁₀', insert: 'log10(', hint: '常用对数' }, { display: 'log₂', insert: 'log2(', hint: '以2为底对数' },
      { display: 'eˣ', insert: 'exp(', hint: 'e的x次方' }, { display: '√x', insert: 'sqrt(', hint: '平方根' }, { display: '³√x', insert: 'cbrt(', hint: '立方根' },
      { display: 'x²', insert: '^2', hint: '平方' }, { display: 'x³', insert: '^3', hint: '立方' }, { display: 'xⁿ', insert: '^', hint: '幂运算' },
      { display: '|x|', insert: 'abs(', hint: '绝对值' }, { display: '⌊x⌋', insert: 'floor(', hint: '向下取整' }, { display: '⌈x⌉', insert: 'ceil(', hint: '向上取整' },
      { display: '1/x', insert: '1/', hint: '倒数' }, { display: 'n!', insert: '!', hint: '阶乘' }, { display: '%', insert: '%', hint: '百分号' },
    ]
  },
  calculus: {
    label: '微积分',
    symbols: [
      { display: "f'(x)", insert: 'diff(', hint: '求导 diff(x^2)' }, { display: '∫f(x)dx', insert: 'integral(', hint: '不定积分 integral(x^2)' }, { display: '∫ab', insert: 'definite(', hint: '定积分 definite(x^2,0,1)' },
      { display: '∑', insert: 'sum(', hint: '求和' }, { display: '∏', insert: 'product(', hint: '求积' }, { display: 'lim', insert: 'limit(', hint: '极限' },
      { display: '化简', insert: 'simplify(', hint: '化简表达式' }, { display: '展开', insert: 'expand(', hint: '展开多项式' }, { display: '因式', insert: 'factor(', hint: '因式分解' },
      { display: '解方程', insert: 'solve(', hint: 'solve(x^2-4=0)' }, { display: '求根', insert: 'roots(', hint: '求方程根' }, { display: '零点', insert: 'zeros(', hint: '求零点' },
    ]
  },
  geometry: {
    label: '几何作图',
    symbols: [
      { display: '点A', insert: 'point(', hint: '点 point(1,2)' }, { display: '线段', insert: 'line(', hint: '线段 line((0,0),(1,1))' }, { display: '射线', insert: 'ray(', hint: '射线' },
      { display: '圆', insert: 'circle(', hint: '圆 circle((0,0),2)' }, { display: '椭圆', insert: 'ellipse(', hint: '椭圆' }, { display: '弧', insert: 'arc(', hint: '弧' },
      { display: '△', insert: 'triangle(', hint: '三角形 triangle((0,0),(1,0),(0.5,1))' }, { display: '矩形', insert: 'rectangle(', hint: '矩形' }, { display: '多边形', insert: 'polygon(', hint: '多边形' },
      { display: '距离', insert: 'distance(', hint: '两点距离 distance((0,0),(3,4))' }, { display: '中点', insert: 'midpoint(', hint: '中点 midpoint((0,0),(2,2))' }, { display: '斜率', insert: 'slope(', hint: '斜率 slope((0,0),(1,2))' },
      { display: '面积', insert: 'area(', hint: '计算面积' }, { display: '周长', insert: 'perimeter(', hint: '计算周长' }, { display: '角度', insert: 'angle(', hint: '计算角度' },
    ]
  },
  graph: {
    label: '绘图',
    symbols: [
      { display: 'y=f(x)', insert: 'y = ', hint: '绘制函数 y = x^2' }, { display: 'plot', insert: 'plot ', hint: '绘制 plot sin(x)' }, { display: '积分图', insert: 'intgraph(', hint: '积分图 intgraph(x^2,0,2)' },
      { display: '切线', insert: 'tangent(', hint: '切线 tangent(x^2,1)' }, { display: '法线', insert: 'normal(', hint: '法线' }, { display: '渐近线', insert: 'asymptote(', hint: '渐近线' },
      { display: '极坐标', insert: 'polar(', hint: '极坐标 polar(r)' }, { display: '参数', insert: 'parametric(', hint: '参数方程' }, { display: '向量场', insert: 'vectorfield(', hint: '向量场' },
      { display: '填充', insert: 'fill(', hint: '填充区域' }, { display: '标注', insert: 'label(', hint: '添加标注' }, { display: '清除', insert: 'clear', hint: '清除所有图形' },
    ]
  },
  greek: {
    label: '希腊字母',
    symbols: [
      { display: 'α', insert: 'alpha', hint: 'alpha' }, { display: 'β', insert: 'beta', hint: 'beta' }, { display: 'γ', insert: 'gamma', hint: 'gamma' },
      { display: 'δ', insert: 'delta', hint: 'delta' }, { display: 'ε', insert: 'epsilon', hint: 'epsilon' }, { display: 'θ', insert: 'theta', hint: 'theta' },
      { display: 'λ', insert: 'lambda', hint: 'lambda' }, { display: 'μ', insert: 'mu', hint: 'mu' }, { display: 'π', insert: 'pi', hint: 'pi' },
      { display: 'σ', insert: 'sigma', hint: 'sigma' }, { display: 'φ', insert: 'phi', hint: 'phi' }, { display: 'ω', insert: 'omega', hint: 'omega' },
      { display: 'Δ', insert: 'Delta', hint: 'Delta(大写)' }, { display: 'Σ', insert: 'Sigma', hint: 'Sigma(大写)' }, { display: 'Π', insert: 'Pi', hint: 'Pi(大写)' },
    ]
  }
};

type PanelKey = keyof typeof SYMBOL_PANELS;

const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [geometryObjects, setGeometryObjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'graph'>('input');
  const [graphMode, setGraphMode] = useState<'function' | 'geometry'>('function');
  const [activePanel, setActivePanel] = useState<PanelKey>('basic');
  const [showSymbolPanel, setShowSymbolPanel] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 颜色列表
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e91e63', '#00bcd4'];

  // 精确格式化数值结果
  const formatExact = (value: any): string => {
    // 如果是mathjs的类型
    if (value && typeof value === 'object') {
      // 分数类型
      if (value.isFraction) {
        return `${value.n}/${value.d}`;
      }
      // 复数
      if (value.isComplex) {
        const re = formatExact(value.re);
        const im = formatExact(value.im);
        if (value.im === 0) return re;
        if (value.re === 0) return im === '1' ? 'i' : im === '-1' ? '-i' : `${im}i`;
        return `${re} + ${im === '1' ? '' : im === '-1' ? '-' : im}i`;
      }
      // 表达式节点
      if (value.isNode) {
        return value.toString();
      }
      // BigNumber
      if (value.isBigNumber) {
        return formatExact(value.toNumber());
      }
    }
    
    // 数字类型
    if (typeof value === 'number') {
      // 检查特殊值
      if (value === Math.PI) return 'π';
      if (value === Math.E) return 'e';
      if (value === Infinity) return '∞';
      if (value === -Infinity) return '-∞';
      if (Number.isNaN(value)) return 'NaN';
      if (Number.isInteger(value)) return value.toString();
      
      // 检查是否为简单分数
      const frac = toFraction(value);
      if (frac) return frac;
      
      // 检查是否为根式的简单情况
      const sqrt = toSqrt(value);
      if (sqrt) return sqrt;
      
      // 检查是否为π或e的倍数
      const piMultiple = value / Math.PI;
      const eMultiple = value / Math.E;
      
      if (Math.abs(piMultiple - Math.round(piMultiple)) < 1e-10) {
        const n = Math.round(piMultiple);
        if (n === 1) return 'π';
        if (n === -1) return '-π';
        if (n === 0) return '0';
        return `${n}π`;
      }
      
      if (Math.abs(eMultiple - Math.round(eMultiple)) < 1e-10) {
        const n = Math.round(eMultiple);
        if (n === 1) return 'e';
        if (n === -1) return '-e';
        if (n === 0) return '0';
        return `${n}e`;
      }
      
      // 检查π/e组合
      if (Math.abs(piMultiple - 1/2) < 1e-10) return 'π/2';
      if (Math.abs(piMultiple - 1/3) < 1e-10) return 'π/3';
      if (Math.abs(piMultiple - 1/4) < 1e-10) return 'π/4';
      if (Math.abs(piMultiple - 1/6) < 1e-10) return 'π/6';
      if (Math.abs(piMultiple - 2/3) < 1e-10) return '2π/3';
      if (Math.abs(piMultiple - 3/4) < 1e-10) return '3π/4';
      
      // 有限小数（最多6位）
      const str = value.toString();
      if (str.includes('.') && str.split('.')[1].length <= 6) {
        return str;
      }
      
      // 否则显示为分数近似
      const approx = approximateFraction(value);
      return `${approx.n}/${approx.d} (≈${value.toFixed(4)})`;
    }
    
    return String(value);
  };
  
  // 转换为分数
  const toFraction = (n: number): string | null => {
    const tolerance = 1e-10;
    const maxDenominator = 1000;
    
    for (let d = 1; d <= maxDenominator; d++) {
      const num = n * d;
      const roundedNum = Math.round(num);
      if (Math.abs(num - roundedNum) < tolerance) {
        const gcd = greatestCommonDivisor(Math.abs(roundedNum), d);
        const numerator = roundedNum / gcd;
        const denominator = d / gcd;
        if (denominator === 1) return numerator.toString();
        return `${numerator}/${denominator}`;
      }
    }
    return null;
  };
  
  // 检查是否为根式
  const toSqrt = (n: number): string | null => {
    // 检查常见平方根
    const perfectSquares = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20];
    for (const sq of perfectSquares) {
      if (Math.abs(n * n - sq) < 1e-10) {
        return `√${sq}`;
      }
      // 检查系数
      for (let coef = 2; coef <= 10; coef++) {
        if (Math.abs(n * n - coef * coef * sq) < 1e-10) {
          return `${coef}√${sq}`;
        }
      }
    }
    return null;
  };
  
  // 最大公约数
  const greatestCommonDivisor = (a: number, b: number): number => {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
  };
  
  // 近似分数
  const approximateFraction = (n: number): { n: number; d: number } => {
    let a = Math.floor(n);
    let h1 = 1, k1 = 0;
    let h = a, k = 1;
    let x = n - a;
    
    while (Math.abs(n - h / k) > 1e-6) {
      x = 1 / x;
      a = Math.floor(x);
      x = x - a;
      const h2 = h1;
      const k2 = k1;
      h1 = h;
      k1 = k;
      h = a * h + h2;
      k = a * k + k2;
      if (k > 100) break;
    }
    
    return { n: h, d: k };
  };

  // 插入符号到输入框
  const insertSymbol = (insert: string) => {
    const inputEl = inputRef.current;
    if (inputEl) {
      const start = inputEl.selectionStart || 0;
      const end = inputEl.selectionEnd || 0;
      const newInput = input.substring(0, start) + insert + input.substring(end);
      setInput(newInput);
      // 设置光标位置
      setTimeout(() => {
        inputEl.selectionStart = inputEl.selectionEnd = start + insert.length;
        inputEl.focus();
      }, 0);
    } else {
      setInput(input + insert);
    }
  };

  // 删除最后一个字符
  const backspace = () => {
    setInput(input.slice(0, -1));
    inputRef.current?.focus();
  };

  // 清空输入
  const clearInput = () => {
    setInput('');
    inputRef.current?.focus();
  };

  // 自动滚动历史记录
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // 绘制坐标系和函数
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40; // 每个单位的像素数

    // 清空画布
    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(0, 0, width, height);

    // 绘制网格
    ctx.strokeStyle = '#d4c5a9';
    ctx.lineWidth = 0.5;
    
    // 垂直线
    for (let x = centerX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // 水平线
    for (let y = centerY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // 绘制刻度数字
    ctx.fillStyle = '#5d4037';
    ctx.font = '12px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    
    // X轴刻度
    for (let i = -Math.floor(centerX / scale); i <= Math.floor((width - centerX) / scale); i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), centerX + i * scale, centerY + 18);
      }
    }
    
    // Y轴刻度
    ctx.textAlign = 'right';
    for (let i = -Math.floor((height - centerY) / scale); i <= Math.floor(centerY / scale); i++) {
      if (i !== 0) {
        ctx.fillText(i.toString(), centerX - 8, centerY - i * scale + 4);
      }
    }

    // 原点
    ctx.fillText('O', centerX - 8, centerY + 18);

    // 绘制函数曲线和积分区域
    functions.forEach((func, index) => {
      // 如果有积分区域，先绘制填充
      if (func.integral) {
        const { a, b } = func.integral;
        ctx.fillStyle = `${func.color}33`; // 半透明填充
        ctx.beginPath();
        
        const startX = centerX + a * scale;
        const endX = centerX + b * scale;
        
        // 从x轴开始
        ctx.moveTo(startX, centerY);
        
        // 绘制曲线部分
        for (let px = startX; px <= endX; px++) {
          const x = (px - centerX) / scale;
          try {
            const expr = math.parse(func.expression);
            const compiled = expr.compile();
            const y = compiled.evaluate({ x });
            
            if (isFinite(y) && !isNaN(y)) {
              const py = centerY - y * scale;
              ctx.lineTo(px, py);
            }
          } catch (e) {}
        }
        
        // 回到x轴
        ctx.lineTo(endX, centerY);
        ctx.closePath();
        ctx.fill();
        
        // 绘制积分边界线
        ctx.strokeStyle = func.color;
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, centerY);
        ctx.lineTo(startX, centerY - (func.integral.value > 0 ? 50 : -50));
        ctx.moveTo(endX, centerY);
        ctx.lineTo(endX, centerY - (func.integral.value > 0 ? 50 : -50));
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 显示积分值
        ctx.fillStyle = func.color;
        ctx.font = 'bold 14px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`∫ = ${formatExact(func.integral.value)}`, (startX + endX) / 2, centerY + 40);
        ctx.fillText(`[${a}, ${b}]`, (startX + endX) / 2, centerY + 58);
      }
      
      // 绘制函数曲线
      ctx.strokeStyle = func.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale;
        try {
          const expr = math.parse(func.expression);
          const compiled = expr.compile();
          const y = compiled.evaluate({ x });
          
          if (isFinite(y) && !isNaN(y)) {
            const py = centerY - y * scale;
            if (py > -100 && py < height + 100) {
              if (firstPoint) {
                ctx.moveTo(px, py);
                firstPoint = false;
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              firstPoint = true;
            }
          } else {
            firstPoint = true;
          }
        } catch (e) {
          firstPoint = true;
        }
      }
      ctx.stroke();
    });

    // 绘制几何对象
    geometryObjects.forEach((obj, index) => {
      const color = colors[index % colors.length];
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      
      if (obj.type === 'point') {
        const px = centerX + obj.x * scale;
        const py = centerY - obj.y * scale;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(obj.label || `P${index + 1}`, px + 10, py - 10);
      } else if (obj.type === 'line') {
        ctx.lineWidth = 2;
        ctx.beginPath();
        const x1 = centerX + obj.x1 * scale;
        const y1 = centerY - obj.y1 * scale;
        const x2 = centerX + obj.x2 * scale;
        const y2 = centerY - obj.y2 * scale;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (obj.type === 'circle') {
        ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = centerX + obj.cx * scale;
        const cy = centerY - obj.cy * scale;
        ctx.arc(cx, cy, obj.r * scale, 0, Math.PI * 2);
        ctx.stroke();
        // 圆心
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (obj.type === 'polygon') {
        ctx.lineWidth = 2;
        ctx.beginPath();
        obj.points.forEach((p: Point, i: number) => {
          const px = centerX + p.x * scale;
          const py = centerY - p.y * scale;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
        // 标注顶点
        obj.points.forEach((p: Point, i: number) => {
          const px = centerX + p.x * scale;
          const py = centerY - p.y * scale;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(p.label || `${i + 1}`, px + 8, py - 8);
        });
      }
    });

  }, [functions, geometryObjects]);

  // 画布初始化和重绘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置画布大小
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    drawGraph();
  }, [drawGraph]);

  // 解析并执行命令
  const executeCommand = () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    let output = '';
    let type: 'algebra' | 'function' | 'geometry' | 'coordinate' = 'algebra';

    try {
      // 判断输入类型并执行相应操作
      
      // 1. 函数绘制: y=... 或 f(x)=...
      if (trimmedInput.match(/^[yf]\s*=\s*.+/i) || trimmedInput.match(/^plot\s+.+/i)) {
        type = 'function';
        const expr = trimmedInput.replace(/^[yf]\s*=\s*/i, '').replace(/^plot\s+/i, '');
        
        // 验证表达式
        try {
          const parsed = math.parse(expr);
          parsed.compile().evaluate({ x: 1 }); // 测试计算
          
          const color = colors[functions.length % colors.length];
          setFunctions([...functions, { expression: expr, color, type: 'function' }]);
          output = `已绘制函数: y = ${expr}`;
        } catch (e) {
          output = `函数表达式无效: ${e}`;
        }
      }
      // 2. 点: point(1,2) 或 P=(1,2)
      else if (trimmedInput.match(/^point\s*\([^)]+\)/i) || trimmedInput.match(/^[A-Z]\s*=\s*\([^)]+\)/)) {
        type = 'geometry';
        let x, y, label;
        
        const match1 = trimmedInput.match(/point\s*\(\s*([^,]+)\s*,\s*([^)]+)\)/i);
        const match2 = trimmedInput.match(/^([A-Z])\s*=\s*\(\s*([^,]+)\s*,\s*([^)]+)\)/);
        
        if (match1) {
          x = parseFloat(match1[1]);
          y = parseFloat(match1[2]);
          label = `P${geometryObjects.length + 1}`;
        } else if (match2) {
          label = match2[1];
          x = parseFloat(match2[2]);
          y = parseFloat(match2[3]);
        }
        
        if (isFinite(x!) && isFinite(y!)) {
          setGeometryObjects([...geometryObjects, { type: 'point', x, y, label }]);
          output = `已绘制点 ${label}: (${x}, ${y})`;
        } else {
          output = '点坐标格式错误';
        }
      }
      // 3. 直线: line(A,B) 或 line((1,2),(3,4))
      else if (trimmedInput.match(/^line\s*\([^)]+\)/i)) {
        type = 'geometry';
        const match = trimmedInput.match(/line\s*\(\s*\(([^)]+)\)\s*,\s*\(([^)]+)\)\s*\)/i);
        if (match) {
          const p1 = match[1].split(',').map(Number);
          const p2 = match[2].split(',').map(Number);
          setGeometryObjects([...geometryObjects, { type: 'line', x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] }]);
          output = `已绘制直线: 过点(${p1[0]},${p1[1]})和点(${p2[0]},${p2[1]})`;
        } else {
          output = '直线格式错误，请使用 line((x1,y1),(x2,y2))';
        }
      }
      // 4. 圆: circle((cx,cy),r) 或 circle(A,B)
      else if (trimmedInput.match(/^circle\s*\([^)]+\)/i)) {
        type = 'geometry';
        const match = trimmedInput.match(/circle\s*\(\s*\(([^)]+)\)\s*,\s*([^)]+)\s*\)/i);
        if (match) {
          const center = match[1].split(',').map(Number);
          const r = parseFloat(match[2]);
          setGeometryObjects([...geometryObjects, { type: 'circle', cx: center[0], cy: center[1], r }]);
          output = `已绘制圆: 圆心(${center[0]},${center[1]}), 半径${r}`;
        } else {
          output = '圆格式错误，请使用 circle((cx,cy),r)';
        }
      }
      // 5. 三角形: triangle((0,0),(1,0),(0,1))
      else if (trimmedInput.match(/^triangle\s*\([^)]+/i)) {
        type = 'geometry';
        const match = trimmedInput.match(/triangle\s*\(\s*\(([^)]+)\)\s*,\s*\(([^)]+)\)\s*,\s*\(([^)]+)\)\s*\)/i);
        if (match) {
          const p1 = match[1].split(',').map(Number);
          const p2 = match[2].split(',').map(Number);
          const p3 = match[3].split(',').map(Number);
          setGeometryObjects([...geometryObjects, { type: 'polygon', points: [
            { x: p1[0], y: p1[1] },
            { x: p2[0], y: p2[1] },
            { x: p3[0], y: p3[1] }
          ]}]);
          output = `已绘制三角形: (${p1[0]},${p1[1]}), (${p2[0]},${p2[1]}), (${p3[0]},${p3[1]})`;
        } else {
          output = '三角形格式错误';
        }
      }
      // 6. 距离: distance((x1,y1),(x2,y2))
      else if (trimmedInput.match(/^distance\s*\([^)]+\)/i)) {
        type = 'coordinate';
        const match = trimmedInput.match(/distance\s*\(\s*\(([^)]+)\)\s*,\s*\(([^)]+)\)\s*\)/i);
        if (match) {
          const p1 = match[1].split(',').map(Number);
          const p2 = match[2].split(',').map(Number);
          const dist = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
          output = `距离 = √[((${p2[0]}-${p1[0]})² + (${p2[1]}-${p1[1]})²] = √${(p2[0]-p1[0])**2 + (p2[1]-p1[1])**2} = ${formatExact(dist)}`;
        } else {
          output = '距离计算格式错误';
        }
      }
      // 7. 中点: midpoint((x1,y1),(x2,y2))
      else if (trimmedInput.match(/^midpoint\s*\([^)]+\)/i)) {
        type = 'coordinate';
        const match = trimmedInput.match(/midpoint\s*\(\s*\(([^)]+)\)\s*,\s*\(([^)]+)\)\s*\)/i);
        if (match) {
          const p1 = match[1].split(',').map(Number);
          const p2 = match[2].split(',').map(Number);
          const mx = (p1[0] + p2[0]) / 2;
          const my = (p1[1] + p2[1]) / 2;
          output = `中点 = ((${p1[0]}+${p2[0]})/2, (${p1[1]}+${p2[1]})/2) = (${mx}, ${my})`;
        } else {
          output = '中点计算格式错误';
        }
      }
      // 8. 斜率: slope((x1,y1),(x2,y2))
      else if (trimmedInput.match(/^slope\s*\([^)]+\)/i)) {
        type = 'coordinate';
        const match = trimmedInput.match(/slope\s*\(\s*\(([^)]+)\)\s*,\s*\(([^)]+)\)\s*\)/i);
        if (match) {
          const p1 = match[1].split(',').map(Number);
          const p2 = match[2].split(',').map(Number);
          const k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
          output = `斜率 k = (${p2[1]}-${p1[1]})/(${p2[0]}-${p1[0]}) = ${p2[1]-p1[1]}/${p2[0]-p1[0]} = ${formatExact(k)}`;
        } else {
          output = '斜率计算格式错误';
        }
      }
      // 9. 求导: diff(x^2) 或 derivative(x^2)
      else if (trimmedInput.match(/^(diff|derivative)\s*\(.+\)/i)) {
        type = 'algebra';
        const match = trimmedInput.match(/^(?:diff|derivative)\s*\((.+)\)/i);
        if (match) {
          const expr = match[1];
          const derivative = math.derivative(expr, 'x');
          output = `d/dx(${expr}) = ${derivative.toString()}`;
        }
      }
      // 10. 化简: simplify(...)
      else if (trimmedInput.match(/^simplify\s*\(.+\)/i)) {
        type = 'algebra';
        const match = trimmedInput.match(/^simplify\s*\((.+)\)/i);
        if (match) {
          const simplified = math.simplify(match[1]);
          output = `化简结果: ${simplified.toString()}`;
        }
      }
      // 11. 解方程: solve(x^2-4=0) 或 solve(x+1=3)
      else if (trimmedInput.match(/^solve\s*\(.+\)/i)) {
        type = 'algebra';
        const match = trimmedInput.match(/^solve\s*\((.+)\)/i);
        if (match) {
          const eq = match[1].replace('=', '-(') + ')';
          try {
            // 简单方程求解
            const solutions: number[] = [];
            for (let test = -100; test <= 100; test += 0.1) {
              try {
                const result = math.evaluate(eq.replace(/x/g, `(${test})`));
                if (Math.abs(result) < 0.01) {
                  const rounded = Math.round(test * 100) / 100;
                  if (!solutions.includes(rounded)) {
                    solutions.push(rounded);
                  }
                }
              } catch (e) {}
            }
            if (solutions.length > 0) {
              output = `方程 ${match[1]} 的解: x = ${solutions.join(', x = ')}`;
            } else {
              output = `未找到数值解，请尝试其他方法`;
            }
          } catch (e) {
            output = `方程求解失败: ${e}`;
          }
        }
      }
      // 12. 定积分计算: definite(x^2,0,2)
      else if (trimmedInput.match(/^definite\s*\(.+\)/i)) {
        type = 'algebra';
        const match = trimmedInput.match(/definite\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/i);
        if (match) {
          const expr = match[1].trim();
          const a = parseFloat(match[2]);
          const b = parseFloat(match[3]);
          
          if (isFinite(a) && isFinite(b)) {
            try {
              // 数值积分（辛普森公式）
              const n = 1000;
              const h = (b - a) / n;
              let sum = 0;
              const compiled = math.compile(expr);
              
              for (let i = 0; i <= n; i++) {
                const x = a + i * h;
                const fx = compiled.evaluate({ x });
                if (i === 0 || i === n) {
                  sum += fx;
                } else if (i % 2 === 0) {
                  sum += 2 * fx;
                } else {
                  sum += 4 * fx;
                }
              }
              const result = (h / 3) * sum;
              
              output = `定积分计算:\n∫[${a},${b}] ${expr} dx\n= ${formatExact(result)}`;
            } catch (e) {
              output = `积分计算错误: ${e}`;
            }
          } else {
            output = '积分上下限格式错误';
          }
        }
      }
      // 13. 积分图形: intgraph(x^2,0,2) - 绘制函数并显示积分区域
      else if (trimmedInput.match(/^intgraph\s*\(.+\)/i)) {
        type = 'function';
        const match = trimmedInput.match(/intgraph\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/i);
        if (match) {
          const expr = match[1].trim();
          const a = parseFloat(match[2]);
          const b = parseFloat(match[3]);
          
          if (isFinite(a) && isFinite(b)) {
            try {
              // 计算积分值
              const n = 1000;
              const h = (b - a) / n;
              let sum = 0;
              const compiled = math.compile(expr);
              
              for (let i = 0; i <= n; i++) {
                const x = a + i * h;
                const fx = compiled.evaluate({ x });
                if (i === 0 || i === n) {
                  sum += fx;
                } else if (i % 2 === 0) {
                  sum += 2 * fx;
                } else {
                  sum += 4 * fx;
                }
              }
              const result = (h / 3) * sum;
              
              // 添加带积分信息的函数
              const color = colors[functions.length % colors.length];
              setFunctions([...functions, { 
                expression: expr, 
                color, 
                type: 'integral',
                integral: { a, b, value: result }
              }]);
              
              output = `积分图形已绘制:\ny = ${expr}\n∫[${a},${b}] = ${formatExact(result)}`;
            } catch (e) {
              output = `积分图形错误: ${e}`;
            }
          } else {
            output = '积分上下限格式错误';
          }
        }
      }
      // 14. 不定积分: integral(x^2)
      else if (trimmedInput.match(/^integral\s*\(.+\)/i)) {
        type = 'algebra';
        const match = trimmedInput.match(/^integral\s*\((.+)\)/i);
        if (match) {
          try {
            const expr = match[1];
            const integral = math.integrate(expr, 'x');
            output = `∫${expr} dx = ${integral.toString()} + C`;
          } catch (e) {
            output = `不定积分计算错误: ${e}`;
          }
        }
      }
      // 15. 清除图形: clear
      else if (trimmedInput.toLowerCase() === 'clear') {
        setFunctions([]);
        setGeometryObjects([]);
        output = '已清除所有图形';
      }
      // 16. 帮助: help
      else if (trimmedInput.toLowerCase() === 'help') {
        output = `命令帮助:
【函数绘制】
  y = x^2              绘制函数
  plot sin(x)          绘制sin函数

【积分功能】
  intgraph(x^2,0,2)    绘制积分图形(函数,下限,上限)
  definite(x^2,0,2)    计算定积分值
  integral(x^2)        求不定积分

【几何作图】
  point(1,2)           绘制点
  A = (1,2)            绘制带标签的点
  line((0,0),(1,1))    绘制直线
  circle((0,0),2)      绘制圆
  triangle((0,0),(1,0),(0,1))  绘制三角形

【坐标运算】
  distance((0,0),(3,4))  计算两点距离
  midpoint((0,0),(2,2))  计算中点
  slope((0,0),(1,2))     计算斜率

【代数计算】
  diff(x^2)            求导
  simplify(...)        化简
  solve(x^2-4=0)       解方程
  直接输入算式计算

【其他】
  clear                清除图形
  help                 显示帮助`;
      }
      // 14. 默认：尝试数学计算
      else {
        type = 'algebra';
        const result = math.evaluate(trimmedInput);
        output = `= ${result}`;
      }
    } catch (e) {
      output = `错误: ${e}`;
    }

    setHistory([...history, { input: trimmedInput, output, type }]);
    setInput('');
  };

  // 键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    }
  };

  return (
    <div className="calculator">
      <div className="calculator__main">
        {/* 左侧：输入和计算区 */}
        <div className="calculator__left">
          {/* 符号面板 */}
          {showSymbolPanel && (
            <div className="symbol-panel">
              <div className="symbol-panel__tabs">
                {(Object.keys(SYMBOL_PANELS) as PanelKey[]).map((key) => (
                  <button
                    key={key}
                    className={`symbol-tab ${activePanel === key ? 'active' : ''}`}
                    onClick={() => setActivePanel(key)}
                  >
                    {SYMBOL_PANELS[key].label}
                  </button>
                ))}
                <button 
                  className="symbol-toggle"
                  onClick={() => setShowSymbolPanel(false)}
                  title="隐藏面板"
                >
                  ▼
                </button>
              </div>
              <div className="symbol-panel__grid">
                {SYMBOL_PANELS[activePanel].symbols.map((sym, i) => (
                  <button
                    key={i}
                    className="symbol-btn"
                    onClick={() => insertSymbol(sym.insert)}
                    title={sym.hint || sym.insert}
                  >
                    <span className="symbol-display">{sym.display}</span>
                    {sym.hint && <span className="symbol-hint">{sym.hint}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* 显示符号面板按钮 */}
          {!showSymbolPanel && (
            <button 
              className="show-panel-btn"
              onClick={() => setShowSymbolPanel(true)}
            >
              ▲ 显示符号面板
            </button>
          )}

          {/* 历史记录 */}
          <div className="history-panel" ref={historyRef}>
            {history.length === 0 ? (
              <div className="history-empty">
                <p>输入数学表达式或命令开始计算</p>
                <p className="hint">输入 help 查看所有命令</p>
              </div>
            ) : (
              history.map((item, i) => (
                <div key={i} className={`history-item ${item.type}`}>
                  <div className="history-input">
                    <span className="prompt">❯</span>
                    <span>{item.input}</span>
                  </div>
                  <div className="history-output">{item.output}</div>
                </div>
              ))
            )}
          </div>

          {/* 输入框 */}
          <div className="input-panel">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入表达式或命令..."
              className="calc-input"
              autoFocus
            />
            <button className="input-btn backspace" onClick={backspace} title="退格">
              ⌫
            </button>
            <button className="input-btn clear" onClick={clearInput} title="清空">
              C
            </button>
            <button className="execute-btn" onClick={executeCommand}>
              执行
            </button>
          </div>
        </div>

        {/* 右侧：图形显示区 */}
        <div className="calculator__right">
          <div className="graph-header">
            <button
              className={`graph-tab ${graphMode === 'function' ? 'active' : ''}`}
              onClick={() => setGraphMode('function')}
            >
              函数图像
            </button>
            <button
              className={`graph-tab ${graphMode === 'geometry' ? 'active' : ''}`}
              onClick={() => setGraphMode('geometry')}
            >
              几何作图
            </button>
            <div className="graph-info">
              {functions.length > 0 && <span>函数: {functions.length}</span>}
              {geometryObjects.length > 0 && <span>图形: {geometryObjects.length}</span>}
            </div>
          </div>
          <div className="graph-canvas-container">
            <canvas ref={canvasRef} className="graph-canvas" />
          </div>
          
          {/* 函数/图形列表 */}
          {(functions.length > 0 || geometryObjects.length > 0) && (
            <div className="objects-list">
              {functions.map((f, i) => (
                <div key={`f${i}`} className="object-item">
                  <span className="object-color" style={{ background: f.color }} />
                  <span className="object-expr">y = {f.expression}</span>
                  <button 
                    className="object-remove"
                    onClick={() => setFunctions(functions.filter((_, idx) => idx !== i))}
                  >✕</button>
                </div>
              ))}
              {geometryObjects.map((obj, i) => (
                <div key={`g${i}`} className="object-item">
                  <span className="object-color" style={{ background: colors[i % colors.length] }} />
                  <span className="object-expr">
                    {obj.type === 'point' && `点 ${obj.label}(${obj.x}, ${obj.y})`}
                    {obj.type === 'line' && `线段 (${obj.x1},${obj.y1})-(${obj.x2},${obj.y2})`}
                    {obj.type === 'circle' && `圆 中心(${obj.cx},${obj.cy}) r=${obj.r}`}
                    {obj.type === 'polygon' && `多边形 (${obj.points.length}个顶点)`}
                  </span>
                  <button 
                    className="object-remove"
                    onClick={() => setGeometryObjects(geometryObjects.filter((_, idx) => idx !== i))}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
