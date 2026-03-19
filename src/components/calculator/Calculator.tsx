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
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [geometryObjects, setGeometryObjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'graph'>('input');
  const [graphMode, setGraphMode] = useState<'function' | 'geometry'>('function');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // 颜色列表
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e91e63', '#00bcd4'];

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

    // 绘制函数曲线
    functions.forEach((func, index) => {
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
          output = `距离 = √[((${p2[0]}-${p1[0]})² + (${p2[1]}-${p1[1]})²] = √${(p2[0]-p1[0])**2 + (p2[1]-p1[1])**2} = ${dist.toFixed(4)}`;
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
          output = `斜率 k = (${p2[1]}-${p1[1]})/(${p2[0]}-${p1[0]}) = ${p2[1]-p1[1]}/${p2[0]-p1[0]} = ${k.toFixed(4)}`;
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
      // 12. 清除图形: clear
      else if (trimmedInput.toLowerCase() === 'clear') {
        setFunctions([]);
        setGeometryObjects([]);
        output = '已清除所有图形';
      }
      // 13. 帮助: help
      else if (trimmedInput.toLowerCase() === 'help') {
        output = `命令帮助:
【函数绘制】
  y = x^2          绘制函数
  plot sin(x)      绘制sin函数

【几何作图】
  point(1,2)       绘制点
  A = (1,2)        绘制带标签的点
  line((0,0),(1,1))  绘制直线
  circle((0,0),2)  绘制圆
  triangle((0,0),(1,0),(0,1))  绘制三角形

【坐标运算】
  distance((0,0),(3,4))  计算距离
  midpoint((0,0),(2,2))  计算中点
  slope((0,0),(1,2))     计算斜率

【代数计算】
  diff(x^2)        求导
  simplify(...)    化简
  solve(x^2-4=0)   解方程
  直接输入算式进行计算

【其他】
  clear            清除图形
  help             显示帮助`;
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

  // 快捷命令按钮
  const quickCommands = [
    { label: 'y = x²', cmd: 'y = x^2' },
    { label: 'y = sin(x)', cmd: 'y = sin(x)' },
    { label: '点', cmd: 'point(1,2)' },
    { label: '圆', cmd: 'circle((0,0),2)' },
    { label: '直线', cmd: 'line((0,0),(2,2))' },
    { label: '三角形', cmd: 'triangle((0,0),(2,0),(1,1.732))' },
    { label: '求导', cmd: 'diff(x^3+2*x^2)' },
    { label: '解方程', cmd: 'solve(x^2-4=0)' },
    { label: '距离', cmd: 'distance((0,0),(3,4))' },
    { label: '清除', cmd: 'clear' },
  ];

  return (
    <div className="calculator">
      <div className="calculator__main">
        {/* 左侧：输入和计算区 */}
        <div className="calculator__left">
          {/* 快捷命令栏 */}
          <div className="quick-commands">
            {quickCommands.map((qc, i) => (
              <button
                key={i}
                className="quick-cmd-btn"
                onClick={() => setInput(qc.cmd)}
              >
                {qc.label}
              </button>
            ))}
          </div>

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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入表达式或命令..."
              className="calc-input"
              autoFocus
            />
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
