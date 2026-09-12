export interface WebTemplate {
  id: string;
  name: string;
  description: string;
  iconName: string;
  html: string;
  css: string;
  js: string;
}

export interface ReactTemplate {
  id: string;
  name: string;
  description: string;
  iconName: string;
  files: Record<string, string>;
}

export const WEB_TEMPLATES: WebTemplate[] = [
  {
    id: "default-web",
    name: "Interactive Web Starter",
    description: "Classic HTML5, CSS3, and JavaScript starter with styled UI elements.",
    iconName: "Code2",
    html: `<div class="container">
  <div class="card">
    <div class="icon">✨</div>
    <h1>Web CodePlayground</h1>
    <p>Edit HTML, CSS & JavaScript on the left and see live changes instantly!</p>
    <div class="btn-group">
      <button id="btn-count" class="btn btn-primary">Click Count: <span id="count">0</span></button>
      <button id="btn-theme" class="btn btn-secondary">Toggle Background</button>
    </div>
  </div>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
  color: #f8fafc;
  padding: 1.5rem;
}

.container {
  max-width: 480px;
  width: 100%;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #38bdf8, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.btn-group {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}
.btn-primary:hover {
  transform: scale(1.03);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}`,
    js: `let count = 0;
const countEl = document.getElementById('count');
const countBtn = document.getElementById('btn-count');
const themeBtn = document.getElementById('btn-theme');

countBtn.addEventListener('click', () => {
  count++;
  countEl.textContent = count;
  console.log(\`Button clicked! New count is: \${count}\`);
});

const bgGradients = [
  'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
  'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #0f172a 100%)',
  'linear-gradient(135deg, #831843 0%, #4c0519 50%, #0f172a 100%)',
  'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
];
let currentBg = 0;

themeBtn.addEventListener('click', () => {
  currentBg = (currentBg + 1) % bgGradients.length;
  document.body.style.background = bgGradients[currentBg];
  console.log('Background theme changed!');
});

console.log('Interactive Web Starter Loaded Successfully!');`
  },
  {
    id: "canvas-particles",
    name: "Interactive Canvas Particles",
    description: "HTML5 Canvas particle animation system with mouse interaction.",
    iconName: "Sparkles",
    html: `<canvas id="canvas"></canvas>
<div class="overlay">
  <h1>Interactive Particles</h1>
  <p>Move your mouse around to attract and push floating particles.</p>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  overflow: hidden;
  background: #090d16;
  font-family: system-ui, sans-serif;
  color: white;
}
canvas {
  display: block;
  position: absolute;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
}
.overlay {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}
h1 {
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
  margin-bottom: 0.5rem;
}
p { color: #94a3b8; font-size: 1.1rem; }`,
    js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const mouse = { x: width / 2, y: height / 2 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 2.5 + 1;
    this.color = \`hsl(\${Math.random() * 60 + 190}, 80%, 65%)\`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.x -= (dx / dist) * 2;
      this.y -= (dy / dist) * 2;
    }

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());

function animate() {
  ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();
console.log('Particle canvas animation running!');`
  },
  {
    id: "tailwind-landing",
    name: "Tailwind CSS Card Component",
    description: "Modern UI card built with utility CSS classes and gradient accents.",
    iconName: "Layout",
    html: `<div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
    <div class="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <div class="space-y-2">
      <h2 class="text-2xl font-bold tracking-tight text-white">Supercharged Editor</h2>
      <p class="text-slate-400 text-sm leading-relaxed">
        CodePlayground brings full live preview, Monaco editor power, and one-click ZIP download right inside your browser.
      </p>
    </div>
    <div class="flex items-center gap-3 pt-2">
      <button class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-cyan-500/25">
        Get Started
      </button>
      <button class="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition duration-200">
        Learn More
      </button>
    </div>
  </div>
</div>`,
    css: `/* Tailwind CDN script handles styling automatically */`,
    js: `console.log('Tailwind UI template active!');`
  }
];

export const REACT_TEMPLATES: ReactTemplate[] = [
  {
    id: "interactive-counter",
    name: "Interactive Counter & Custom Hook",
    description: "Multi-file React template with custom hooks, glassmorphism UI, and state.",
    iconName: "Atom",
    files: {
      "src/index.jsx": `import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

      "src/App.jsx": `import Header from './components/Header';
import Counter from './components/Counter';

export default function App() {
  return (
    <div className="app">
      <Header title="My React App" />
      <main className="main-content">
        <Counter />
      </main>
    </div>
  );
}`,

      "src/components/Header.jsx": `export default function Header({ title }) {
  return (
    <header className="header">
      <div className="header-inner">
        <span className="logo">⚛️</span>
        <h1>{title}</h1>
      </div>
    </header>
  );
}`,

      "src/components/Counter.jsx": `import useCounter from '../hooks/useCounter';

export default function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div className="counter-card">
      <h2 className="counter-title">Interactive Counter</h2>
      <div className="counter-display">{count}</div>
      <div className="counter-buttons">
        <button className="btn btn-secondary" onClick={decrement}>−</button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
        <button className="btn btn-primary" onClick={increment}>+</button>
      </div>
      <p className="counter-hint">Powered by a custom React hook</p>
    </div>
  );
}`,

      "src/hooks/useCounter.js": `export default function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue);

  const increment = () => {
    console.log('Incrementing! New value:', count + 1);
    setCount(c => c + 1);
  };
  const decrement = () => setCount(c => c - 1);
  const reset = () => {
    console.log('Resetting counter');
    setCount(initialValue);
  };

  return { count, increment, decrement, reset };
}`,

      "src/styles.css": `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
  color: #f8fafc;
}
.app { min-height: 100vh; display: flex; flex-direction: column; }
.header { background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(148, 163, 184, 0.1); padding: 1rem 2rem; }
.header-inner { max-width: 800px; margin: 0 auto; display: flex; align-items: center; gap: 0.75rem; }
.logo { font-size: 1.8rem; }
.header h1 { font-size: 1.4rem; font-weight: 700; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.main-content { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1rem; }
.counter-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 1.5rem; padding: 3rem; text-align: center; max-width: 360px; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,0.4); }
.counter-title { font-size: 1.1rem; color: #94a3b8; margin-bottom: 1.5rem; font-weight: 500; }
.counter-display { font-size: 5rem; font-weight: 800; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 1rem 0 2rem; line-height: 1; }
.counter-buttons { display: flex; gap: 0.75rem; justify-content: center; margin-bottom: 1.5rem; }
.btn { padding: 0.6rem 1.4rem; border-radius: 0.6rem; font-size: 1.1rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
.btn-primary { background: #3b82f6; color: white; }
.btn-secondary { background: #6366f1; color: white; }
.btn-ghost { background: rgba(148, 163, 184, 0.1); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.2); }
.counter-hint { font-size: 0.75rem; color: rgba(148, 163, 184, 0.5); }`
    }
  },
  {
    id: "todo-app",
    name: "React Todo Task Manager",
    description: "Complete Todo App with filter tabs, stats counter, and persistent state.",
    iconName: "CheckSquare",
    files: {
      "src/index.jsx": `import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

      "src/App.jsx": `import TodoList from './components/TodoList';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <header className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold">
            ✓
          </div>
          <div>
            <h1 className="text-xl font-bold">Tasks & Todos</h1>
            <p className="text-xs text-slate-400">Organize your work with React</p>
          </div>
        </header>
        <TodoList />
      </div>
    </div>
  );
}`,

      "src/components/TodoList.jsx": `export default function TodoList() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Explore CodePlayground templates', completed: true },
    { id: 2, text: 'Build a cool React app', completed: false },
    { id: 3, text: 'Export project as ZIP', completed: false },
  ]);
  const [text, setText] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const addTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div>
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
        />
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition">
          Add
        </button>
      </form>

      <div className="flex gap-2 mb-4 text-xs">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={\`capitalize px-3 py-1 rounded-lg border \${filter === f ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-semibold' : 'border-slate-800 text-slate-400 hover:text-white'}\`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {filtered.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-800 rounded-xl">
            <span
              onClick={() => toggleTodo(t.id)}
              className={\`cursor-pointer text-sm flex-1 \${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}\`}
            >
              {t.completed ? '✓ ' : '○ '}{t.text}
            </span>
            <button onClick={() => deleteTodo(t.id)} className="text-xs text-rose-400 hover:text-rose-300">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-500 flex justify-between">
        <span>{todos.filter(t => !t.completed).length} items remaining</span>
        <span>Total: {todos.length}</span>
      </div>
    </div>
  );
}`,

      "src/styles.css": `/* Tailwind utility styles available in environment */`
    }
  },
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe Game",
    description: "Classic React tutorial game with winner detection and reset.",
    iconName: "Gamepad2",
    files: {
      "src/index.jsx": `import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,

      "src/App.jsx": `export default function App() {
  const [board, setBoard] = React.useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = React.useState(true);

  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const nextBoard = board.slice();
    nextBoard[i] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext(!isXNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xs w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Tic-Tac-Toe</h1>
        <p className="text-sm text-slate-400 mb-6">
          {winner ? \`Winner: \${winner} 🎉\` : board.every(Boolean) ? 'It is a Draw!' : \`Next Player: \${isXNext ? 'X' : 'O'}\`}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="h-20 bg-slate-800 hover:bg-slate-700 text-3xl font-extrabold rounded-xl border border-slate-700 text-cyan-400 transition"
            >
              {cell}
            </button>
          ))}
        </div>

        <button onClick={reset} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl transition">
          Restart Game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}`,

      "src/styles.css": `/* Tailwind utility styles available */`
    }
  }
];
