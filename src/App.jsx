import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Terminal, 
  Cpu, 
  Layers, 
  Send, 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Database, 
  Workflow, 
  MessageSquare, 
  Code,
  Zap,
  Compass,
  Server,
  Smartphone,
  Sparkles,
  GitBranch,
  Wrench,
  Globe,
  Download
} from 'lucide-react';

// WebGL Background component using the custom fluid aurora shader
function BackgroundShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    window.addEventListener('resize', syncSize);
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        
        // Fluid auroras color definitions
        vec3 color1 = vec3(0.5, 0.0, 1.0); // Purple/Violet
        vec3 color2 = vec3(0.0, 1.0, 0.5); // Emerald
        vec3 color3 = vec3(0.0, 0.5, 1.0); // Cyan
        
        float n1 = sin(uv.x * 2.0 + u_time * 0.5) * 0.5 + 0.5;
        float n2 = cos(uv.y * 3.0 - u_time * 0.3) * 0.5 + 0.5;
        float n3 = sin((uv.x + uv.y) * 1.5 + u_time * 0.4) * 0.5 + 0.5;
        
        vec3 finalColor = mix(color1, color2, n1);
        finalColor = mix(finalColor, color3, n2 * n3);
        
        // Soft overlay darken for clean readability
        gl_FragColor = vec4(finalColor * 0.09, 1.0);
      }
    `;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    let reqId;
    function render(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      reqId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      window.removeEventListener('resize', syncSize);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [terminalDemoStep, setTerminalDemoStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [loaderText, setLoaderText] = useState('Iniciando orquestación de sistemas...');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intro Loader simulation
  useEffect(() => {
    const loaderSteps = [
      { t: 'Iniciando conexión segura con agentes locales...', d: 300 },
      { t: 'Compilando parsers de facturación y automatizaciones estructuradas...', d: 700 },
      { t: 'Sincronizando flujos activos en orquestador n8n...', d: 1100 },
      { t: 'Conectando endpoints de bases de datos PostgreSQL...', d: 1500 },
      { t: 'Despliegue de entorno completado con éxito.', d: 1800 }
    ];

    loaderSteps.forEach(step => {
      setTimeout(() => {
        setLoaderText(step.t);
      }, step.d);
    });

    const closeLoader = setTimeout(() => {
      setIsLoading(false);
    }, 2100);

    return () => clearTimeout(closeLoader);
  }, []);

  const demoSteps = [
    { type: 'input', text: 'iniciar_agente --modelo qwen2.5:7b --tarea "Procesar y organizar reportes"' },
    { type: 'system', text: 'Initializing Qwen2.5 local context via Ollama SDK...' },
    { type: 'agent', text: 'Agent [Decision Matrix]: Evaluating local storage tools and permissions.' },
    { type: 'system', text: 'Function Calling Triggered: read_directory({ path: "./reportes_ia" })' },
    { type: 'success', text: 'FS Event: Found 3 documents: extract_draft.txt, invoice_unprocessed.csv, logs.json.' },
    { type: 'agent', text: 'Agent [Planning Mode]: Parsing invoice contents and formatting database inputs.' },
    { type: 'system', text: 'Function Calling Triggered: run_invoice_automation()' },
    { type: 'success', text: 'Database Event: Structured invoice registers successfully written to PostgreSQL.' },
    { type: 'agent', text: 'Integration Complete. Dispatching push notification to client endpoint...' },
    { type: 'whatsapp', text: 'WhatsApp API: "¡Hola Ángel! Tu agente local ha procesado las facturas y actualizado el gestor. 🚀"' }
  ];

  const startTerminalDemo = () => {
    if (isTyping) return;
    setTerminalLogs([]);
    setTerminalDemoStep(0);
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isTyping) return;

    if (terminalDemoStep < demoSteps.length) {
      const timeout = setTimeout(() => {
        setTerminalLogs(prev => [...prev, demoSteps[terminalDemoStep]]);
        setTerminalDemoStep(prev => prev + 1);
      }, 900);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [terminalDemoStep, isTyping]);

  // Real projects from your GitHub profile (Vaips26)
  const projects = [
    {
      id: 'agente-ia-archivos-local',
      title: 'Local Filesystem AI Agent',
      category: 'agents',
      description: 'Agente conversacional autónomo desarrollado en Python. Permite interactuar directamente con el sistema de archivos del servidor mediante llamadas a funciones estructuradas (Function Calling) utilizando modelos de lenguaje locales ejecutados con Ollama.',
      tags: ['Ollama', 'Python', 'Qwen2.5', 'OpenAI SDK', 'Function Calling'],
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      github: 'https://github.com/Vaips26/agente-ia-archivos-local',
    },
    {
      id: 'agente-investigacion',
      title: 'AI Research Agent',
      category: 'agents',
      description: 'Agente autónomo enfocado en la recolección, síntesis y generación estructurada de informes de investigación. Utiliza técnicas avanzadas de búsqueda semántica y procesamiento de lenguaje para consolidar datos web complejos.',
      tags: ['Python', 'LangChain', 'OpenAI API', 'Semantic Search'],
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      github: 'https://github.com/Vaips26/agente-investigacion',
    },
    {
      id: 'Facturas_-Automatizadas',
      title: 'Automated Invoices System',
      category: 'automation',
      description: 'Sistema inteligente para la extracción y procesamiento automatizado de información contable a partir de facturas digitales. Elimina el factor de captura manual mediante el análisis semántico y almacenamiento en bases de datos PostgreSQL.',
      tags: ['Python', 'Document AI', 'Data Pipelines', 'PostgreSQL'],
      icon: <Workflow className="w-6 h-6 text-emerald-400" />,
      github: 'https://github.com/Vaips26/Facturas_-Automatizadas',
    },
    {
      id: 'task-manager-fullstack',
      title: 'Fullstack Task Manager',
      category: 'fullstack',
      description: 'Plataforma completa de administración de tareas y desarrollo de proyectos. Implementa una arquitectura cliente-servidor robusta con control de estados, endpoints optimizados y diseño fluido adaptado a múltiples dispositivos.',
      tags: ['React', 'Node.js', 'Express', 'SQL', 'REST API'],
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      github: 'https://github.com/Vaips26/task-manager-fullstack',
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  const languages = [
    { name: 'Python', desc: 'Core de automatización e IA', color: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50' },
    { name: 'JavaScript', desc: 'Desarrollo web e interactividad', color: 'border-yellow-500/20 text-yellow-400 hover:border-yellow-500/50' },
    { name: 'TypeScript', desc: 'Estructuración estática robusta', color: 'border-blue-500/20 text-blue-400 hover:border-blue-500/50' },
    { name: 'SQL', desc: 'Gestión de bases de datos relacionales', color: 'border-cyan-500/20 text-cyan-400 hover:border-cyan-500/50' },
    { name: 'HTML5', desc: 'Maquetación semántica web', color: 'border-orange-500/20 text-orange-400 hover:border-orange-500/50' },
    { name: 'CSS3', desc: 'Estilos modernos y adaptables', color: 'border-pink-500/20 text-pink-400 hover:border-pink-500/50' }
  ];

  const frameworks = {
    frontend: [
      { name: 'React', badge: 'Library' },
      { name: 'Next.js', badge: 'SSR Framework' }
    ],
    backend: [
      { name: 'FastAPI', badge: 'Async API' },
      { name: 'PostgreSQL', badge: 'Database' },
      { name: 'Uvicorn', badge: 'ASGI Server' }
    ],
    mobile: [
      { name: 'React Native', badge: 'Cross-platform' }
    ]
  };

  const tools = [
    { name: 'VS Code', type: 'Editor', icon: <Code className="w-4 h-4 text-sky-400" /> },
    { name: 'Git', type: 'Control de Versiones', icon: <GitBranch className="w-4 h-4 text-orange-500" /> },
    { name: 'GitHub', type: 'Plataforma', icon: <Github className="w-4 h-4 text-slate-300" /> },
    { name: 'Vercel', type: 'Hosting/Front', icon: <Globe className="w-4 h-4 text-white" /> },
    { name: 'Netlify', type: 'Hosting/Front', icon: <Globe className="w-4 h-4 text-cyan-300" /> },
    { name: 'npm', type: 'Manejador Paquetes', icon: <Wrench className="w-4 h-4 text-red-400" /> },
    { name: 'Kimi K3', type: 'Ecosistema IA', icon: <Sparkles className="w-4 h-4 text-purple-400" />, highlight: true },
    { name: 'Claude Code', type: 'AI Assistant', icon: <Bot className="w-4 h-4 text-emerald-400" />, highlight: true }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-darkBg flex flex-col items-center justify-center z-50 p-6 font-mono">
        <div className="max-w-md w-full border border-slate-800 rounded-xl bg-panelBg/80 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500"></div>
          
          <div className="flex items-center space-x-2.5 mb-6 text-slate-400 text-xs border-b border-slate-850 pb-3">
            <Bot className="w-4 h-4 text-purple-400 animate-spin" />
            <span>CONNECTING TO INTEGRATION CORE...</span>
          </div>

          <div className="space-y-3 min-h-[90px]">
            <div className="text-purple-400 text-sm flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              <span>[VAIPS26.SYSTEM] Status: ONLINE</span>
            </div>
            <div className="text-slate-300 text-xs leading-relaxed">
              {loaderText}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
            <span>YUCATÁN, MX</span>
            <span>CORE_REV_04</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 font-sans relative overflow-hidden bg-grid-pattern">
      
      {/* WebGL Animated Backdrop (Fluid auroras) */}
      <BackgroundShader />

      {/* Premium Mouse Spotlight Tracker */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(550px at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.045), transparent 80%)`
        }}
      />

      {/* Header / Navbar */}
      <nav className="border-b border-slate-800/60 bg-darkBg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 animate-fade-in-up">
            <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="font-mono font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              VAIPS26_SYSTEMS
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-purple-400 transition-colors">Enfoque</a>
            <a href="#demo" className="hover:text-purple-400 transition-colors">Agente en Vivo</a>
            <a href="#tech-stack" className="hover:text-purple-400 transition-colors">Tecnologías</a>
            <a href="#projects" className="hover:text-purple-400 transition-colors">Proyectos</a>
            
            {/* Dual Language CV Download Links */}
            <div className="flex items-center space-x-2">
              <a 
                href="/CV_Angel_Viveros_ES.pdf" 
                download="CV_Angel_Viveros_ES.pdf"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-750 transition-all text-xs flex items-center space-x-1"
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>CV (ES)</span>
              </a>
              <a 
                href="/CV_Angel_Viveros_EN.pdf" 
                download="CV_Angel_Viveros_EN.pdf"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-750 transition-all text-xs flex items-center space-x-1"
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>CV (EN)</span>
              </a>
            </div>

            <a href="#contact" className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all">
              Contacto
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs text-purple-400 font-mono">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>FULL STACK · AUTOMATION · IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Ángel Viveros <br/>
              <span className="bg-gradient-to-r from-emerald-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                Full Stack & AI
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Especializado en el desarrollo de soluciones <strong className="text-emerald-400 font-medium">Full Stack</strong>, la automatización avanzada de procesos lógicos de negocio y la integración de arquitecturas autónomas de Inteligencia Artificial.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={startTerminalDemo}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-darkBg font-semibold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/10"
              >
                <span>Iniciar Simulación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a 
                href="https://github.com/Vaips26" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-slate-850 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-all flex items-center space-x-2"
              >
                <Github className="w-4 h-4 text-purple-400" />
                <span>GitHub Profile</span>
              </a>

              {/* Dual Language CV Buttons in Hero */}
              <div className="flex items-center gap-2">
                <a 
                  href="/CV_Angel_Viveros_ES.pdf" 
                  download="CV_Angel_Viveros_ES.pdf"
                  className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500 hover:bg-slate-850 transition-all flex items-center space-x-2 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>CV (ES)</span>
                </a>
                <a 
                  href="/CV_Angel_Viveros_EN.pdf" 
                  download="CV_Angel_Viveros_EN.pdf"
                  className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500 hover:bg-slate-850 transition-all flex items-center space-x-2 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>CV (EN)</span>
                </a>
              </div>
            </div>
          </div>

          {/* STANDOUT ELEMENT: Geometrical Morphing Cyber-Emblem */}
          <div className="lg:col-span-5 relative animate-fade-in-up [animation-delay:0.2s] flex justify-center">
            <div className="relative w-full aspect-square max-w-[340px] rounded-2xl bg-panelBg/80 border border-slate-850 p-6 flex flex-col justify-center items-center shadow-2xl glow-purple transition-all duration-500 hover:scale-[1.03]">
              <div className="relative w-48 h-48 flex items-center justify-center animate-pulse-slow">
                <svg className="w-full h-full animate-rotate-slow absolute opacity-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="90" stroke="url(#gradient-purple-cyan)" strokeWidth="1.5" strokeDasharray="6 6"/>
                  <circle cx="100" cy="100" r="75" stroke="url(#gradient-purple-cyan)" strokeWidth="1"/>
                </svg>
                
                <svg className="w-40 h-40 z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" stroke="url(#emblem-gradient)" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M50 15 L80 34 L80 66 L50 85 L20 66 L20 34 Z" stroke="#1E293B" strokeWidth="1.5"/>
                  <path d="M50 30 L67 40 L67 60 L50 70 L33 60 L33 40 Z" fill="url(#core-gradient)" fillOpacity="0.4" stroke="url(#emblem-gradient)" strokeWidth="1.5"/>
                  <line x1="50" y1="5" x2="50" y2="95" stroke="url(#emblem-gradient)" strokeWidth="0.5" strokeDasharray="3 3"/>
                  <line x1="10" y1="50" x2="90" y2="50" stroke="url(#emblem-gradient)" strokeWidth="0.5" strokeDasharray="3 3"/>
                  
                  <defs>
                    <linearGradient id="gradient-purple-cyan" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#8B5CF6"/>
                      <stop offset="100%" stopColor="#10B981"/>
                    </linearGradient>
                    <linearGradient id="emblem-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#8B5CF6"/>
                      <stop offset="50%" stopColor="#06B6D4"/>
                      <stop offset="100%" stopColor="#10B981"/>
                    </linearGradient>
                    <linearGradient id="core-gradient" x1="33" y1="30" x2="67" y2="70" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-[11px] font-mono text-slate-500 text-center mt-4">
                SISTEMA AUTÓNOMO DE DISEÑO DE SOFTWARE
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* About Section & Academic Background */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-900 relative z-10">
        <div className="grid md:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
              <span className="text-purple-400">01.</span>
              <span>Enfoque Profesional & Desarrollo</span>
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Como desarrollador Full Stack y especialista en automatizaciones, diseño infraestructura de software escalable capaz de procesar flujos complejos e integrar componentes de Inteligencia Artificial de forma nativa.
              </p>
              <p>
                Estructuro proyectos integrando automatizaciones robustas en <strong className="text-white">n8n</strong>, lógica asíncrona mediante microservicios en <strong className="text-white">FastAPI</strong>, y persistencia avanzada con bases de datos como <strong className="text-white">PostgreSQL</strong>.
              </p>
              <p>
                Mi visión está orientada a la ingeniería de software moderna: soluciones limpias, mantenibles y de alto rendimiento que agilizan las operaciones tecnológicas empresariales.
              </p>
            </div>
          </div>

          <div className="space-y-6 bg-panelBg/40 border border-slate-800/60 p-6 sm:p-8 rounded-2xl relative shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80">
            <h3 className="text-lg font-bold text-white font-mono flex items-center space-x-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <span>Credenciales y Formación</span>
            </h3>

            <div className="space-y-6">
              <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                <div className="text-xs font-mono text-emerald-400">UNIVERSIDAD POLITÉCNICA DE YUCATÁN</div>
                <h4 className="font-semibold text-white">Ingeniería Computacional Bilingüe</h4>
                <p className="text-xs text-slate-400">Programa académico conducido completamente en inglés y orientado a desarrollo matemático y de sistemas.</p>
              </div>

              <div className="border-l-2 border-purple-500 pl-4 space-y-1">
                <div className="text-xs font-mono text-purple-400">GOOGLE CAREER CERTIFICATES</div>
                <h4 className="font-semibold text-white">Google Project Management Certificate</h4>
                <p className="text-xs text-slate-400">Coursera (2024 / 2025)</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Agent Terminal Demonstration */}
      <section id="demo" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900 relative z-10">
        <div className="bg-panelBg/60 border border-slate-850 rounded-2xl overflow-hidden glow-cyan">
          
          <div className="bg-slate-900/90 px-6 py-4 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs font-mono text-slate-400">terminal@angelviveros-system: ~</span>
            </div>
            <button 
              onClick={startTerminalDemo}
              disabled={isTyping}
              className={`px-4 py-1.5 rounded text-xs font-mono transition-all flex items-center space-x-2 ${
                isTyping 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <span>{isTyping ? 'Procesando...' : 'Iniciar Simulación'}</span>
              <Terminal className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 font-mono text-sm min-h-[320px] max-h-[450px] overflow-y-auto space-y-3 bg-darkBg/90">
            {terminalLogs.length === 0 && !isTyping && (
              <div className="text-slate-500 h-full flex flex-col items-center justify-center py-12 text-center">
                <Terminal className="w-10 h-10 mb-3 text-slate-600" />
                <p>Presiona "Iniciar Simulación" para ejecutar la cadena de razonamiento de automatización en vivo.</p>
                <p className="text-xs mt-1">Este flujo simula un pipeline asíncrono con base de datos y envío de alertas.</p>
              </div>
            )}

            {terminalLogs.map((log, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 transform translate-y-0 opacity-100 ${
                  log.type === 'input' ? 'text-cyan-400' :
                  log.type === 'system' ? 'text-slate-400' :
                  log.type === 'agent' ? 'text-yellow-300' :
                  log.type === 'success' ? 'text-emerald-400' :
                  log.type === 'whatsapp' ? 'text-green-300 border-l-2 border-green-500 pl-2 bg-green-500/5 py-1' : 'text-slate-100'
                }`}
              >
                {log.type === 'input' && <span className="text-slate-500">guest@viveros:~ $ </span>}
                {log.type === 'agent' && <span className="text-yellow-500">⚡ </span>}
                {log.type === 'success' && <span className="text-emerald-500">✓ </span>}
                {log.text}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-emerald-400 animate-pulse text-xs pt-2">
                <span className="w-2 h-4 bg-emerald-400 inline-block animate-ping"></span>
                <span>Procesando flujo de trabajo lógico asíncrono...</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Tech Stack Matrix with Pure CSS Spring Hover Animations */}
      <section id="tech-stack" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-900 relative z-10">
        <div className="space-y-12">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
              <span className="text-emerald-400">02.</span>
              <span>Stack Tecnológico & Herramientas</span>
            </h2>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
              Las herramientas, frameworks y lenguajes que utilizo cotidianamente para desarrollar software e integrar flujos avanzados de IA.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Languages Grid */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-2 border-b border-slate-850 pb-2">
                <Code className="w-4 h-4" />
                <span>Lenguajes</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang, index) => (
                  <div 
                    key={index}
                    className={`p-3.5 rounded-xl bg-panelBg/30 border ${lang.color} transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-slate-900/60 hover:shadow-xl cursor-pointer flex flex-col justify-between h-24`}
                  >
                    <span className="font-bold text-sm tracking-wide text-white">{lang.name}</span>
                    <span className="text-[10px] text-slate-400 leading-tight font-sans mt-1">{lang.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frameworks Grid */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center space-x-2 border-b border-slate-850 pb-2">
                <Layers className="w-4 h-4" />
                <span>Frameworks & Entornos</span>
              </h3>
              
              <div className="space-y-4">
                {/* Frontend */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>Frontend</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.frontend.map((fw, idx) => (
                      <div 
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-panelBg/50 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300 transform hover:translate-x-1 cursor-pointer flex items-center justify-between w-full"
                      >
                        <span className="text-xs font-semibold text-slate-200">{fw.name}</span>
                        <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">{fw.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
                    <Server className="w-3 h-3 text-slate-500" />
                    <span>Backend & Bases de Datos</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.backend.map((fw, idx) => (
                      <div 
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-panelBg/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 transform hover:translate-x-1 cursor-pointer flex items-center justify-between w-full"
                      >
                        <span className="text-xs font-semibold text-slate-200">{fw.name}</span>
                        <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">{fw.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
                    <Smartphone className="w-3 h-3 text-slate-500" />
                    <span>Mobile</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.mobile.map((fw, idx) => (
                      <div 
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-panelBg/50 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-300 transform hover:translate-x-1 cursor-pointer flex items-center justify-between w-full"
                      >
                        <span className="text-xs font-semibold text-slate-200">{fw.name}</span>
                        <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{fw.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center space-x-2 border-b border-slate-850 pb-2">
                <Wrench className="w-4 h-4" />
                <span>Herramientas & Entorno</span>
              </h3>
              <div className="space-y-2">
                {tools.map((tool, idx) => (
                  <div 
                    key={idx}
                    className={`p-2.5 rounded-xl bg-panelBg/30 border transition-all duration-300 transform hover:scale-[1.015] cursor-pointer flex items-center justify-between ${
                      tool.highlight 
                        ? 'border-purple-500/35 bg-purple-950/10 hover:border-purple-400 glow-cyan animate-pulse hover:animate-none' 
                        : 'border-slate-800 hover:border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 bg-slate-900/80 rounded-lg">
                        {tool.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{tool.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{tool.type}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Projects Showcase - Redesigned to present real GitHub repositories */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-900 relative z-10">
        <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                <span className="text-emerald-400">03.</span>
                <span>Proyectos Reales</span>
              </h2>
              <p className="text-slate-400 max-w-xl text-sm sm:text-base">
                Proyectos reales mapeados directamente desde mi cuenta de GitHub (<strong className="text-slate-200 font-medium">Vaips26</strong>).
              </p>
            </div>
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 md:pb-0">
              {['all', 'agents', 'automation', 'fullstack'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    activeTab === tab 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {tab === 'all' ? 'Todos' : tab === 'fullstack' ? 'Full Stack' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map(project => (
              <div 
                key={project.id}
                className="group p-6 sm:p-8 rounded-2xl bg-panelBg/40 border border-slate-850 hover:bg-panelBg/60 transition-all duration-300 transform hover:-translate-y-1.5 hover:border-emerald-500/40 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors">
                      {project.icon}
                    </div>
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
                    >
                      <span className="text-[10px] font-mono">Ir al Repositorio</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-850 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 text-xs font-mono border border-slate-800/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
        <div className="bg-gradient-to-br from-panelBg/80 to-slate-950 border border-slate-850 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">¿Tienes un flujo que requiera automatización?</h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Diseño integraciones asíncronas con webhooks, orquestación de flujos en n8n y backends escalables que potencian la productividad y automatización.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:angelviverosaguilar@hotmail.com" 
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 text-darkBg font-semibold hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <Mail className="w-5 h-5" />
                <span>angelviverosaguilar@hotmail.com</span>
              </a>
              <div className="flex items-center gap-2">
                <a 
                  href="https://github.com/Vaips26" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>Localización: Yucatán, México (GMT-6)</span>
              <span>Teléfono: 9993668391</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-darkBg/95 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>© {new Date().getFullYear()} Ángel Viveros. Todos los derechos reservados.</div>
          <div>Diseñado y programado para integraciones autónomas de IA y automatización de procesos.</div>
        </div>
      </footer>

    </div>
  );
}
