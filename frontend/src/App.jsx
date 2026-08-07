import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  RefreshCw, 
  Send, 
  Mail, 
  Phone, 
  Layers, 
  FileText, 
  Sliders, 
  DollarSign, 
  Bot 
} from 'lucide-react';

const BACKEND_URL = "http://127.0.0.1:8000";

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    raw_message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch leads from FastAPI
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/leads/`);
      if (!response.ok) throw new Error("Error en la conexión con el servidor de base de datos.");
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Lead to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          status: 'New'
        })
      });
      
      if (!response.ok) throw new Error("No se pudo registrar el lead en el backend.");
      
      setForm({ name: '', email: '', phone: '', raw_message: '' });
      fetchLeads(); // Refresh leads table
    } catch (err) {
      alert(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Metric calculations
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === "Qualified").length;
  const highPriorityLeads = leads.filter(l => l.lead_score >= 70).length;
  const averageScore = totalLeads > 0 
    ? Math.round(leads.reduce((acc, curr) => acc + (curr.lead_score || 0), 0) / totalLeads) 
    : 0;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-12">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono uppercase tracking-widest mb-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>AI-Driven Leads Orchestrator // v1.2</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Panel de Orquestación e Ingesta</h1>
        </div>
        <button 
          onClick={fetchLeads} 
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg border border-slate-750 text-sm font-medium transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Sincronizar Datos</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KPI Section */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-xl shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Leads</span>
              <div className="text-2xl font-bold text-white">{totalLeads}</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-xl shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Calificados por IA</span>
              <div className="text-2xl font-bold text-white">{qualifiedLeads}</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-xl shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Leads Prioritarios</span>
              <div className="text-2xl font-bold text-white">{highPriorityLeads}</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-xl shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Score Promedio</span>
              <div className="text-2xl font-bold text-white">{averageScore}%</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Left Column: Form Simulator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F172A] border border-slate-850 p-6 rounded-2xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-semibold text-lg text-white flex items-center space-x-2">
                <Send className="w-4 h-4 text-purple-400" />
                <span>Simulador de Registro</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Inserta un lead directamente en la base de datos para simular la ingesta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Carlos Mendoza" 
                  className="w-full bg-[#030712] border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="carlos@empresa.com" 
                  className="w-full bg-[#030712] border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Teléfono de Contacto</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+52 999 123 4567" 
                  className="w-full bg-[#030712] border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Mensaje de Solicitud (Input de IA)</label>
                <textarea 
                  name="raw_message" 
                  value={form.raw_message}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Detalla presupuesto y necesidades..." 
                  className="w-full bg-[#030712] border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none resize-none transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={formSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-darkBg font-semibold rounded-lg text-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>{formSubmitting ? 'Registrando...' : 'Insertar Lead'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Leads Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0F172A] border border-slate-850 rounded-2xl shadow-xl overflow-hidden">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0F172A]/80">
              <h3 className="font-semibold text-lg text-white flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Base de Datos de Leads</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">Filas encontradas: {totalLeads}</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                <span>Sincronizando información...</span>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-rose-400 font-mono text-xs">
                {error}
              </div>
            ) : totalLeads === 0 ? (
              <div className="p-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                <span>No hay leads registrados en la base de datos local.</span>
                <span>Utiliza el simulador de la izquierda para registrar el primero.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-850 bg-slate-900/30 font-mono text-xs text-slate-400">
                      <th className="p-4 pl-6">ID</th>
                      <th className="p-4">Contacto</th>
                      <th className="p-4">Estatus</th>
                      <th className="p-4">Presupuesto</th>
                      <th className="p-4 pr-6">AI Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-sm">
                    {filteredProjects.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 pl-6 font-mono text-xs text-slate-500">#{lead.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">{lead.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5 flex flex-col space-y-0.5">
                            <span className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{lead.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{lead.phone}</span>
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            lead.status === 'New' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-200">
                            {lead.budget ? `$${lead.budget.toLocaleString()} MXN` : 'No detectado'}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Tier: {lead.budget_tier || 'N/A'}</div>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full ${
                                  (lead.lead_score || 0) >= 70 ? 'bg-emerald-500' : 'bg-purple-500'
                                }`} 
                                style={{ width: `${lead.lead_score || 0}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-slate-300">{lead.lead_score || 0}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
