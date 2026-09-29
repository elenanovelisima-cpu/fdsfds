import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Database, 
  Activity, 
  UserPlus, 
  Trash2, 
  RefreshCw, 
  Search, 
  Filter, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Sliders, 
  BarChart3,
  Calendar, 
  Briefcase,
  ExternalLink,
  Lock,
  Sparkles,
  Flame,
  Clock,
  Layers,
  FileText,
  Eye,
  Palette,
  X
} from 'lucide-react';
import { useAuth, AuthUser } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { playRetroSound } from '../utils/audio';
import { 
  fetchDatabaseSummary, 
  deleteLeagueFromSupabase, 
  deleteAllPlayersFromSupabase, 
  deleteAllTeamsFromSupabase, 
  purgeAllSupabaseData,
  searchSupabasePlayers,
  deleteSinglePlayerFromSupabase,
  DatabaseSummary,
  SupabasePlayerItem,
  KNOWN_LEAGUES
} from '../lib/supabaseAdmin';
import { getAnalyticsData, AnalyticsPeriod } from '../lib/analyticsData';
import { SupabasePlayerModal } from './SupabasePlayerModal';

interface AdminPanelPageProps {
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

type AdminTab = 'users' | 'analytics' | 'supabase-purge' | 'player-explorer' | 'settings';

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({
  onBackToHome,
  onShowToast,
}) => {
  const { 
    currentUser, 
    registeredUsers, 
    supabaseStatus, 
    logout, 
    updateUserRole, 
    toggleUserStatus, 
    deleteUser, 
    addNewUser,
    refreshConnection 
  } = useAuth();

  const { accentColor, setAccentColor } = useTheme();

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  // --- TAB 1: USERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [newPlan, setNewPlan] = useState<'GRATUITO' | 'PRO COACH' | 'CLUB ENTERPRISE'>('PRO COACH');
  const [newTeam, setNewTeam] = useState('');

  // --- TAB 2: ANALYTICS STATE ---
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>('7d');
  const analyticsData = getAnalyticsData(analyticsPeriod, registeredUsers);

  // --- TAB 3: SUPABASE DATA & PURGE STATE ---
  const [dbSummary, setDbSummary] = useState<DatabaseSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [selectedLeagueToPurge, setSelectedLeagueToPurge] = useState<string>('LIGA U');
  const [isPurging, setIsPurging] = useState(false);
  
  // Security Modal Confirmation
  const [purgeModalConfig, setPurgeModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'league' | 'players' | 'teams' | 'all';
    targetName?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'league',
  });
  const [confirmationInput, setConfirmationInput] = useState('');

  // --- TAB 4: PLAYER EXPLORER STATE ---
  const [explorerQuery, setExplorerQuery] = useState('');
  const [explorerLeague, setExplorerLeague] = useState('ALL');
  const [explorerPlayers, setExplorerPlayers] = useState<SupabasePlayerItem[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [selectedPlayerIdForModal, setSelectedPlayerIdForModal] = useState<string | null>(null);

  // --- TAB 5: SYSTEM CONTROLS ---
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [systemAlertMessage, setSystemAlertMessage] = useState('Datos de la jornada FEB sincronizados en tiempo real.');
  const [isCheckingPing, setIsCheckingPing] = useState(false);

  // Load Database Summary when opening purge or on mount
  const loadSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const summary = await fetchDatabaseSummary();
      setDbSummary(summary);
    } catch (e) {
      console.error('Error fetching summary', e);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadSummary();
    handleSearchExplorerPlayers();
  }, []);

  // Filtered registered users
  const filteredUsers = registeredUsers.filter((u) => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.team && u.team.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Explorer Search
  const handleSearchExplorerPlayers = async () => {
    setIsLoadingPlayers(true);
    const results = await searchSupabasePlayers(explorerQuery, explorerLeague, 18);
    setExplorerPlayers(results);
    setIsLoadingPlayers(false);
  };

  const handleTestPing = async () => {
    setIsCheckingPing(true);
    playRetroSound('click');
    await refreshConnection();
    setIsCheckingPing(false);
    onShowToast(`Supabase respondió en ${supabaseStatus.pingMs}ms (REST v1 OK)`);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      onShowToast('Por favor introduce un email válido.');
      return;
    }

    addNewUser({
      email: newEmail.trim().toLowerCase(),
      name: newName.trim() || newEmail.split('@')[0],
      role: newRole,
      plan: newPlan,
      team: newTeam.trim() || 'Club FEB',
      status: 'active',
      roleInClub: newRole === 'admin' ? 'Administrador' : 'Entrenador',
    });

    playRetroSound('burst');
    onShowToast(`Usuario ${newEmail} creado con éxito.`);
    setNewEmail('');
    setNewName('');
    setNewTeam('');
    setIsAddUserModalOpen(false);
  };

  const handleExportUsers = () => {
    playRetroSound('click');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registeredUsers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `basketdata_usuarios_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Copia de seguridad de usuarios exportada (JSON).');
  };

  // Open Purge Confirmation Modal
  const openPurgeModal = (
    type: 'league' | 'players' | 'teams' | 'all',
    title: string,
    description: string,
    targetName?: string
  ) => {
    playRetroSound('click');
    setConfirmationInput('');
    setPurgeModalConfig({
      isOpen: true,
      title,
      description,
      actionType: type,
      targetName,
    });
  };

  // Execute Confirmed Purge
  const handleExecutePurge = async () => {
    if (confirmationInput.trim().toUpperCase() !== 'CONFIRMAR') {
      onShowToast('Debes escribir "CONFIRMAR" para ejecutar la acción.');
      return;
    }

    setIsPurging(true);
    playRetroSound('burst');

    let result = { success: false, message: '' };

    if (purgeModalConfig.actionType === 'league' && purgeModalConfig.targetName) {
      result = await deleteLeagueFromSupabase(purgeModalConfig.targetName);
    } else if (purgeModalConfig.actionType === 'players') {
      result = await deleteAllPlayersFromSupabase();
    } else if (purgeModalConfig.actionType === 'teams') {
      result = await deleteAllTeamsFromSupabase();
    } else if (purgeModalConfig.actionType === 'all') {
      result = await purgeAllSupabaseData();
    }

    setIsPurging(false);
    setPurgeModalConfig((prev) => ({ ...prev, isOpen: false }));
    setConfirmationInput('');

    onShowToast(result.message);
    await loadSummary();
    handleSearchExplorerPlayers();
  };

  // Delete individual player in explorer
  const handleDeleteIndividualPlayer = async (playerId: string, playerName: string) => {
    if (window.confirm(`¿Eliminar al jugador ${playerName} de Supabase?`)) {
      playRetroSound('click');
      const ok = await deleteSinglePlayerFromSupabase(playerId);
      if (ok) {
        onShowToast(`Jugador ${playerName} eliminado de Supabase.`);
        setExplorerPlayers((prev) => prev.filter((p) => p.id !== playerId));
        loadSummary();
      } else {
        onShowToast('No se pudo eliminar el jugador de Supabase.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#ede7dc] text-[#0e3a73] font-sans pb-16">
      
      {/* 1. TOP NAV BAR ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-[#0c356a] border-b-4 border-[#082245] shadow-lg text-white">
        <div className="site-container py-3 px-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left Brand + Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#ede7dc] border border-white flex items-center justify-center p-1 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#0c356a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-slab font-black text-lg uppercase tracking-tight text-[#fff9e6]">
                  BASKETDATA ADMIN
                </span>
                <span className="bg-[#c02328] text-white text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded tracking-widest">
                  SUPERADMIN
                </span>
              </div>
              <span className="font-mono-code text-[11px] text-sky-200 block">
                Sesión activa: <strong className="text-white font-bold">{currentUser?.email || 'teo@gmail.com'}</strong>
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playRetroSound('click');
                onBackToHome();
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-condensed font-bold text-xs uppercase px-3.5 py-1.5 rounded border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Volver a la Web</span>
            </button>

            <button
              onClick={async () => {
                playRetroSound('click');
                await logout();
                onShowToast('Sesión de administrador cerrada.');
                onBackToHome();
              }}
              className="bg-[#c02328] hover:bg-[#a01c20] text-white font-condensed font-bold text-xs uppercase px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="bg-[#faf7f0] border-b-2 border-[#0c3975]/20 shadow-xs">
        <div className="site-container px-4 flex flex-wrap items-center gap-2 py-2">
          
          <button
            onClick={() => {
              playRetroSound('click');
              setActiveTab('users');
            }}
            className={`px-3.5 py-2 rounded font-slab text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#0c3975] text-white shadow-sm font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <Users size={16} />
            <span>Usuarios & Roles ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => {
              playRetroSound('click');
              setActiveTab('analytics');
            }}
            className={`px-3.5 py-2 rounded font-slab text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#0c3975] text-white shadow-sm font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <BarChart3 size={16} />
            <span>Analítica de Uso</span>
          </button>

          <button
            onClick={() => {
              playRetroSound('click');
              setActiveTab('supabase-purge');
              loadSummary();
            }}
            className={`px-3.5 py-2 rounded font-slab text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'supabase-purge'
                ? 'bg-[#c02328] text-white shadow-sm font-bold'
                : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-300'
            }`}
          >
            <Trash2 size={16} />
            <span>Gestión & Purga Supabase</span>
          </button>

          <button
            onClick={() => {
              playRetroSound('click');
              setActiveTab('player-explorer');
            }}
            className={`px-3.5 py-2 rounded font-slab text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'player-explorer'
                ? 'bg-[#0c3975] text-white shadow-sm font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <Layers size={16} />
            <span>Explorador FEB Supabase</span>
          </button>

          <button
            onClick={() => {
              playRetroSound('click');
              setActiveTab('settings');
            }}
            className={`px-3.5 py-2 rounded font-slab text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#0c3975] text-white shadow-sm font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <Sliders size={16} />
            <span>Configuración Global</span>
          </button>

        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="site-container mt-6 px-4">
        
        {/* ========================================================================= */}
        {/* TAB 1: USERS & ROLES                                                      */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Supabase Status Pill Banner */}
            <div className="bg-[#faf7f0] border-2 border-[#0c3975] rounded-lg p-5 shadow-[4px_4px_0_rgba(12,49,94,0.18)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h1 className="font-slab font-black text-2xl text-[#0c3975] uppercase leading-tight">
                    Gestión de Cuentas y Accesos
                  </h1>
                </div>
                <p className="mt-1 font-mono-code text-xs text-slate-700">
                  Controla usuarios registrados, asigna permisos de administrador y audita el estado de cada cuenta.
                </p>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3 shrink-0 flex items-center gap-3">
                <Database size={16} className="text-[#0c3975]" />
                <div className="text-[11px] font-mono-code text-slate-700">
                  <span>Supabase: </span>
                  <strong className="text-emerald-700 font-bold">ONLINE ({supabaseStatus.pingMs}ms)</strong>
                </div>
                <button
                  onClick={handleTestPing}
                  disabled={isCheckingPing}
                  className="text-[11px] font-mono-code text-[#0c3975] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={11} className={isCheckingPing ? 'animate-spin' : ''} />
                  <span>Ping</span>
                </button>
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-4 shadow-sm">
                <span className="text-xs font-mono-code font-bold uppercase text-slate-500 block">Total Usuarios Registrados</span>
                <span className="font-slab font-black text-3xl text-[#0c3975] block mt-1">{registeredUsers.length}</span>
                <span className="text-[11px] font-mono-code text-emerald-700 mt-1 block">✓ Cuentas reales verificadas</span>
              </div>
              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-4 shadow-sm">
                <span className="text-xs font-mono-code font-bold uppercase text-slate-500 block">Administradores</span>
                <span className="font-slab font-black text-3xl text-[#c02328] block mt-1">
                  {registeredUsers.filter((u) => u.role === 'admin').length}
                </span>
                <span className="text-[11px] font-mono-code text-slate-600 mt-1 block">Permisos de edición y vaciado</span>
              </div>
              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-4 shadow-sm">
                <span className="text-xs font-mono-code font-bold uppercase text-slate-500 block">Planes Pro Coach / Club</span>
                <span className="font-slab font-black text-3xl text-amber-600 block mt-1">
                  {registeredUsers.filter((u) => u.plan !== 'GRATUITO').length}
                </span>
                <span className="text-[11px] font-mono-code text-slate-600 mt-1 block">Suscripciones con acceso FEB completo</span>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-[#faf7f0] border-b-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-slab font-bold text-lg text-[#0c3975] uppercase">
                    Listado de Usuarios Registrados
                  </h2>
                  <span className="text-xs font-mono-code text-slate-600 block">
                    Solo usuarios reales que se han dado de alta o han sido creados por el administrador.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportUsers}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download size={13} />
                    <span>Exportar JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playRetroSound('click');
                      setIsAddUserModalOpen(true);
                    }}
                    className="bg-[#0c3975] hover:bg-[#124b94] text-white px-3.5 py-1.5 rounded text-xs font-slab font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <UserPlus size={14} />
                    <span>+ Añadir Usuario</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por email, nombre o club..."
                    className="w-full bg-white border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs font-mono-code text-slate-800 focus:outline-none focus:border-[#0c3975]"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs font-mono-code text-slate-700">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Rol:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono-code"
                  >
                    <option value="all">Todos</option>
                    <option value="admin">Solo Admins</option>
                    <option value="user">Solo Usuarios</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono-code text-slate-700">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Estado:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono-code"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="suspended">Suspendidos</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-code border-collapse">
                  <thead>
                    <tr className="bg-[#0c3975]/5 border-b border-slate-200 text-[#0c3975] uppercase text-[11px] font-bold">
                      <th className="py-3 px-4">Usuario / Email</th>
                      <th className="py-3 px-4">Rol en Sistema</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Equipo / Club</th>
                      <th className="py-3 px-4">Último Acceso</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 font-mono-code">
                          No hay usuarios registrados con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isTeo = user.email.toLowerCase() === 'teo@gmail.com';
                        return (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                                  user.role === 'admin' ? 'bg-[#c02328] text-white' : 'bg-[#0c3975] text-white'
                                }`}>
                                  {user.name.slice(0, 2)}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{user.name}</span>
                                  <span className="text-slate-500 text-[11px]">{user.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              {user.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 bg-[#c02328]/10 text-[#c02328] border border-[#c02328]/30 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                                  <ShieldCheck size={11} />
                                  ADMINISTRADOR
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold text-[10px] uppercase">
                                  USUARIO
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                                {user.plan}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-slate-700">
                              {user.team || 'Sin asignar'}
                            </td>

                            <td className="py-3 px-4 text-slate-500 text-[11px]">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleString('es-ES', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : 'Hoy'}
                            </td>

                            <td className="py-3 px-4">
                              {user.status === 'active' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Activo
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                  Suspendido
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {!isTeo && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        playRetroSound('click');
                                        const nextRole = user.role === 'admin' ? 'user' : 'admin';
                                        updateUserRole(user.id, nextRole);
                                        onShowToast(`Rol de ${user.email} cambiado a ${nextRole.toUpperCase()}`);
                                      }}
                                      className="px-2 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-bold uppercase cursor-pointer"
                                    >
                                      {user.role === 'admin' ? 'Hacer Usuario' : 'Hacer Admin'}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        playRetroSound('click');
                                        toggleUserStatus(user.id);
                                        onShowToast(`Estado de ${user.email} actualizado`);
                                      }}
                                      className={`px-2 py-1 text-[10px] rounded border font-bold uppercase cursor-pointer ${
                                        user.status === 'active' 
                                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {user.status === 'active' ? 'Suspender' : 'Activar'}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`¿Eliminar al usuario ${user.email}?`)) {
                                          playRetroSound('click');
                                          deleteUser(user.id);
                                          onShowToast(`Usuario ${user.email} eliminado.`);
                                        }
                                      }}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                                {isTeo && (
                                  <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    ROOT SUPERADMIN
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ANALYTICS (EXACTAMENTE LO SOLICITADO CON 1d, 7d, 30d, 90d)        */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Header + Period Selectors */}
            <div className="bg-[#faf7f0] border-2 border-[#0c3975] rounded-lg p-5 shadow-[4px_4px_0_rgba(12,49,94,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-slab font-black text-2xl text-[#0c3975] uppercase leading-tight">
                  Analítica de uso
                </h1>
                <p className="font-mono-code text-xs text-slate-600 mt-0.5">
                  Telemetría de navegación, sesiones de usuarios y consultas de telemetría FEB.
                </p>
              </div>

              {/* Period Tabs: 1d, 7d, 30d, 90d */}
              <div className="inline-flex bg-white p-1 rounded-md border-2 border-[#0c3975]/30 shadow-2xs font-mono-code text-xs font-bold">
                {(['1d', '7d', '30d', '90d'] as AnalyticsPeriod[]).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      playRetroSound('click');
                      setAnalyticsPeriod(period);
                    }}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      analyticsPeriod === period
                        ? 'bg-[#0c3975] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#0c3975]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Key Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              
              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3.5 shadow-sm">
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500 block">
                  Visitantes únicos
                </span>
                <span className="font-slab font-black text-2xl text-[#0c3975] block mt-1">
                  {analyticsData.uniqueVisitors.toLocaleString('es-ES')}
                </span>
                <span className="text-[10px] font-mono-code text-emerald-700 block mt-0.5">
                  ↑ +14% vs periodo ant.
                </span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3.5 shadow-sm">
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500 block">
                  Visitantes anónimos
                </span>
                <span className="font-slab font-black text-2xl text-slate-700 block mt-1">
                  {analyticsData.anonymousVisitors.toLocaleString('es-ES')}
                </span>
                <span className="text-[10px] font-mono-code text-slate-500 block mt-0.5">
                  Tráfico abierto FEB
                </span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3.5 shadow-sm">
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500 block">
                  Registrados activos
                </span>
                <span className="font-slab font-black text-2xl text-amber-600 block mt-1">
                  {analyticsData.activeRegistered}
                </span>
                <span className="text-[10px] font-mono-code text-amber-700 block mt-0.5">
                  {registeredUsers.length} en base de datos
                </span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3.5 shadow-sm">
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500 block">
                  Sesiones
                </span>
                <span className="font-slab font-black text-2xl text-[#0c3975] block mt-1">
                  {analyticsData.totalSessions.toLocaleString('es-ES')}
                </span>
                <span className="text-[10px] font-mono-code text-slate-500 block mt-0.5">
                  Accesos registrados
                </span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3.5 shadow-sm">
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500 block">
                  Tiempo total
                </span>
                <span className="font-slab font-black text-2xl text-purple-700 block mt-1">
                  {analyticsData.totalTime}
                </span>
                <span className="text-[10px] font-mono-code text-purple-700 block mt-0.5">
                  Tiempo en plataforma
                </span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3.5 shadow-sm">
                <span className="text-[11px] font-mono-code font-bold uppercase text-slate-500 block">
                  Informes creados
                </span>
                <span className="font-slab font-black text-2xl text-emerald-700 block mt-1">
                  {analyticsData.reportsCreated.toLocaleString('es-ES')}
                </span>
                <span className="text-[10px] font-mono-code text-emerald-700 block mt-0.5">
                  Scouting & Telemetría
                </span>
              </div>

            </div>

            {/* Table 1: Usuarios registrados con actividad en este periodo */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-[#faf7f0] border-b-2 border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-slab font-bold text-base text-[#0c3975] uppercase">
                    Usuarios registrados ({analyticsData.usersUsage.length})
                  </h3>
                  <span className="text-xs font-mono-code text-slate-600">
                    Actividad y tiempo en la plataforma durante el periodo seleccionado ({analyticsPeriod}).
                  </span>
                </div>
                <span className="text-[11px] font-mono-code bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded font-bold">
                  ● Telemetría activa
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-code border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#0c3975] uppercase text-[11px] font-bold">
                      <th className="py-2.5 px-4">Usuario</th>
                      <th className="py-2.5 px-4">Rol</th>
                      <th className="py-2.5 px-4">Sesiones</th>
                      <th className="py-2.5 px-4">Tiempo</th>
                      <th className="py-2.5 px-4">Informes</th>
                      <th className="py-2.5 px-4 text-right">Última conexión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analyticsData.usersUsage.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500 font-mono-code">
                          Sin actividad de usuarios registrados en este periodo.
                        </td>
                      </tr>
                    ) : (
                      analyticsData.usersUsage.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-4">
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-slate-500 text-[11px]">{u.email}</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role.includes('Superadmin') ? 'bg-[#c02328]/10 text-[#c02328]' : 'bg-blue-50 text-blue-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">
                            {u.sessions}
                          </td>
                          <td className="py-2.5 px-4 text-purple-700 font-bold">
                            {u.timeSpent}
                          </td>
                          <td className="py-2.5 px-4 text-emerald-700 font-bold">
                            {u.reportsCreated}
                          </td>
                          <td className="py-2.5 px-4 text-right text-slate-500">
                            {u.lastConnection}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Páginas más visitadas */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-[#faf7f0] border-b-2 border-slate-200">
                <h3 className="font-slab font-bold text-base text-[#0c3975] uppercase">
                  Páginas más visitadas
                </h3>
                <span className="text-xs font-mono-code text-slate-600">
                  Desglose de tráfico, tiempo medio de permanencia y porcentaje de visitas.
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-code border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#0c3975] uppercase text-[11px] font-bold">
                      <th className="py-2.5 px-4">Página</th>
                      <th className="py-2.5 px-4">Visitas</th>
                      <th className="py-2.5 px-4">Tiempo total</th>
                      <th className="py-2.5 px-4">Tiempo medio</th>
                      <th className="py-2.5 px-4 text-right">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analyticsData.pagesVisits.map((page) => (
                      <tr key={page.path} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4">
                          <span className="font-bold text-slate-900 block">{page.name}</span>
                          <span className="text-slate-500 text-[11px] font-mono-code">{page.path}</span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {page.visits.toLocaleString('es-ES')}
                        </td>
                        <td className="py-2.5 px-4 text-purple-700 font-bold">
                          {page.totalTime}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {page.averageTime}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#0c3975] rounded-full" 
                                style={{ width: `${page.percentage}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-800 text-[11px]">{page.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GESTIÓN & PURGA DE DATOS SUPABASE (VACIAR LIGAS, DATOS, ETC.)       */}
        {/* ========================================================================= */}
        {activeTab === 'supabase-purge' && (
          <div className="space-y-6">
            
            {/* Warning Banner */}
            <div className="bg-amber-50 border-2 border-amber-600 rounded-lg p-5 shadow-xs flex items-start gap-3.5">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-slab font-bold text-lg text-amber-900 uppercase">
                  Zona de Administración & Vaciado de Supabase
                </h2>
                <p className="font-mono-code text-xs text-amber-800 mt-1 leading-relaxed">
                  Desde aquí puedes eliminar datos de la base de datos de Supabase en producción. Puedes vaciar una <strong>liga completa</strong> (por ejemplo para actualizarla con un nuevo scraper), vaciar únicamente jugadores, únicamente equipos o purgar toda la base de datos. Todas las acciones requieren confirmación de seguridad.
                </p>
              </div>
            </div>

            {/* Real-time Supabase Counter Card */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <h3 className="font-slab font-bold text-base text-[#0c3975] uppercase flex items-center gap-2">
                    <Database size={18} />
                    <span>Estado en Tiempo Real de Supabase</span>
                  </h3>
                  <span className="text-xs font-mono-code text-slate-500">
                    Host: hzuzuyyuxmfcabcemprx.supabase.co • Última lectura: {dbSummary?.lastChecked || 'Cargando...'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={loadSummary}
                  disabled={isLoadingSummary}
                  className="bg-[#0c3975] hover:bg-[#124b94] text-white px-3 py-1.5 rounded font-mono-code text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw size={13} className={isLoadingSummary ? 'animate-spin' : ''} />
                  <span>{isLoadingSummary ? 'Actualizando...' : 'Refrescar Conteo'}</span>
                </button>
              </div>

              {/* Total Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="bg-[#faf7f0] border border-[#0c3975]/20 p-4 rounded">
                  <span className="text-xs font-mono-code font-bold uppercase text-slate-500 block">Total Jugadores (players)</span>
                  <span className="font-slab font-black text-3xl text-[#0c3975] block mt-1">
                    {dbSummary ? dbSummary.totalPlayers.toLocaleString('es-ES') : '...'}
                  </span>
                  <span className="text-[11px] font-mono-code text-slate-600 mt-1 block">Fichas con telemetría FEB</span>
                </div>

                <div className="bg-[#faf7f0] border border-[#0c3975]/20 p-4 rounded">
                  <span className="text-xs font-mono-code font-bold uppercase text-slate-500 block">Total Equipos (teams)</span>
                  <span className="font-slab font-black text-3xl text-slate-800 block mt-1">
                    {dbSummary ? dbSummary.totalTeams.toLocaleString('es-ES') : '...'}
                  </span>
                  <span className="text-[11px] font-mono-code text-slate-600 mt-1 block">Clubes de todas las ligas</span>
                </div>

                <div className="bg-[#faf7f0] border border-[#0c3975]/20 p-4 rounded">
                  <span className="text-xs font-mono-code font-bold uppercase text-slate-500 block">Ligas Registradas</span>
                  <span className="font-slab font-black text-3xl text-emerald-700 block mt-1">
                    {dbSummary ? dbSummary.leagues.length : 7}
                  </span>
                  <span className="text-[11px] font-mono-code text-slate-600 mt-1 block">Categorías FEB activas</span>
                </div>
              </div>

              {/* Leagues Breakdown Table */}
              <div className="mt-5">
                <h4 className="font-slab font-bold text-xs uppercase text-slate-700 mb-2">
                  Desglose por Categoría / Liga en Supabase:
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="w-full text-left text-xs font-mono-code border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                        <th className="py-2 px-3">Nombre de Liga</th>
                        <th className="py-2 px-3">Jugadores</th>
                        <th className="py-2 px-3">Equipos</th>
                        <th className="py-2 px-3 text-right">Acción Rápida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dbSummary?.leagues.map((l) => (
                        <tr key={l.leagueName} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {l.leagueName}
                          </td>
                          <td className="py-2 px-3 text-[#0c3975] font-bold">
                            {l.playersCount} jugadores
                          </td>
                          <td className="py-2 px-3 text-slate-700 font-bold">
                            {l.teamsCount} equipos
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                openPurgeModal(
                                  'league',
                                  `Vaciar Liga ${l.leagueName}`,
                                  `Se eliminarán de Supabase los ${l.playersCount} jugadores y ${l.teamsCount} equipos de la liga "${l.leagueName}".`,
                                  l.leagueName
                                );
                              }}
                              className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Vaciar Esta Liga
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tool 1: Vaciar Liga Específica */}
              <div className="bg-white border-2 border-slate-300 rounded-lg p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#0c3975]">
                    <Layers size={18} />
                    <h3 className="font-slab font-bold text-base uppercase">
                      1. Vaciar una Liga Específica
                    </h3>
                  </div>
                  <p className="font-mono-code text-xs text-slate-600 mb-4 leading-relaxed">
                    Selecciona una categoría de la Federación para purgar todos sus jugadores y clubes correspondientes de Supabase.
                  </p>

                  <div>
                    <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                      Seleccionar Liga a Vaciar:
                    </label>
                    <select
                      value={selectedLeagueToPurge}
                      onChange={(e) => setSelectedLeagueToPurge(e.target.value)}
                      className="w-full bg-[#faf7f0] border-2 border-[#0c3975]/30 rounded px-3 py-2 text-xs font-mono-code font-bold text-slate-900 focus:outline-none"
                    >
                      {KNOWN_LEAGUES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      openPurgeModal(
                        'league',
                        `Vaciar Liga ${selectedLeagueToPurge}`,
                        `¿Estás seguro de que deseas vaciar de Supabase todos los datos de "${selectedLeagueToPurge}"?`,
                        selectedLeagueToPurge
                      );
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded font-slab text-xs uppercase tracking-wider font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Vaciar Liga Seleccionada</span>
                  </button>
                </div>
              </div>

              {/* Tool 2: Vaciar Tabla Específica (Players o Teams) */}
              <div className="bg-white border-2 border-slate-300 rounded-lg p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#0c3975]">
                    <Database size={18} />
                    <h3 className="font-slab font-bold text-base uppercase">
                      2. Vaciar Tabla Específica
                    </h3>
                  </div>
                  <p className="font-mono-code text-xs text-slate-600 mb-4 leading-relaxed">
                    Permite limpiar selectivamente la tabla completa de jugadores o la tabla de equipos en Supabase.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        openPurgeModal(
                          'players',
                          'Vaciar Tabla de Jugadores',
                          'Se borrarán TODOS los 4.124 jugadores de la tabla players en Supabase.'
                        );
                      }}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 py-2.5 px-3 rounded font-mono-code text-xs font-bold uppercase text-center cursor-pointer"
                    >
                      Vaciar Solo Jugadores
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        openPurgeModal(
                          'teams',
                          'Vaciar Tabla de Equipos',
                          'Se borrarán TODOS los 259 equipos de la tabla teams en Supabase.'
                        );
                      }}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 py-2.5 px-3 rounded font-mono-code text-xs font-bold uppercase text-center cursor-pointer"
                    >
                      Vaciar Solo Equipos
                    </button>
                  </div>
                </div>

                {/* Nuclear Option: Purga Total */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      openPurgeModal(
                        'all',
                        '¡PURGA TOTAL DE SUPABASE!',
                        'ATENCIÓN: Se eliminarán TODOS los jugadores y TODOS los equipos de la base de datos de Supabase. Esta acción no se puede deshacer.'
                      );
                    }}
                    className="w-full bg-[#c02328] hover:bg-[#a01c20] text-white py-2.5 px-4 rounded font-slab text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle size={15} />
                    <span>Purgar Todos los Datos de Supabase</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EXPLORADOR FEB SUPABASE                                            */}
        {/* ========================================================================= */}
        {activeTab === 'player-explorer' && (
          <div className="space-y-6">
            
            <div className="bg-[#faf7f0] border-2 border-[#0c3975] rounded-lg p-5 shadow-[4px_4px_0_rgba(12,49,94,0.18)]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-slab font-black text-2xl text-[#0c3975] uppercase leading-tight">
                    Explorador en Vivo de Jugadores Supabase
                  </h1>
                  <p className="font-mono-code text-xs text-slate-600 mt-0.5">
                    Inspecciona directamente las fichas, fotos oficiales y telemetría de los 4.124 jugadores almacenados.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSearchExplorerPlayers}
                  disabled={isLoadingPlayers}
                  className="bg-[#0c3975] hover:bg-[#124b94] text-white px-3.5 py-1.5 rounded font-mono-code text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw size={13} className={isLoadingPlayers ? 'animate-spin' : ''} />
                  <span>{isLoadingPlayers ? 'Cargando...' : 'Buscar / Refrescar'}</span>
                </button>
              </div>

              {/* Search Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#0c3975]/20">
                <div className="sm:col-span-2 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={explorerQuery}
                    onChange={(e) => setExplorerQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchExplorerPlayers();
                    }}
                    placeholder="Buscar jugador por nombre (ej: Garcia, Moreno, Savkov)..."
                    className="w-full bg-white border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#0c3975]"
                  />
                </div>

                <div>
                  <select
                    value={explorerLeague}
                    onChange={(e) => {
                      setExplorerLeague(e.target.value);
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono-code focus:outline-none"
                  >
                    <option value="ALL">Todas las Ligas</option>
                    {KNOWN_LEAGUES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            {isLoadingPlayers ? (
              <div className="bg-white border-2 border-slate-200 rounded-lg p-12 text-center text-slate-500 font-mono-code">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#0c3975]" />
                <span>Consultando tabla "players" de Supabase...</span>
              </div>
            ) : explorerPlayers.length === 0 ? (
              <div className="bg-white border-2 border-slate-200 rounded-lg p-12 text-center text-slate-500 font-mono-code">
                No se encontraron jugadores con ese término de búsqueda o la liga está vacía.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {explorerPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      playRetroSound('card');
                      setSelectedPlayerIdForModal(player.id);
                    }}
                    className="bg-white border-2 border-[#0c3975]/30 rounded-md p-3 shadow-xs hover:shadow-lg hover:border-[#0c3975] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group relative"
                  >
                    <div>
                      {/* Photo / Avatar */}
                      <div className="w-full h-32 bg-slate-100 rounded overflow-hidden mb-2 relative border border-slate-200">
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://imagenes.feb.es/Imagen.aspx?i=logo&ti=1';
                          }}
                        />
                        <span className="absolute top-1 right-1 bg-black/70 text-white text-[9px] font-mono-code font-bold px-1.5 py-0.5 rounded">
                          {player.position}
                        </span>
                        
                        {/* Hover Overlay indicator */}
                        <div className="absolute inset-0 bg-[#0c3975]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-[#fff9e6] text-[#0c3975] text-[10px] font-slab font-bold px-2 py-1 rounded shadow-md uppercase flex items-center gap-1">
                            <Eye size={12} />
                            Ver Ficha
                          </span>
                        </div>
                      </div>

                      {/* Name & Club */}
                      <h4 className="font-slab font-bold text-xs text-[#0c3975] uppercase truncate group-hover:text-[#c02328] transition-colors" title={player.name}>
                        {player.name}
                      </h4>
                      <span className="text-[10px] font-mono-code text-slate-600 block truncate" title={player.team}>
                        {player.team}
                      </span>
                      <span className="text-[9px] font-mono-code text-[#c02328] font-bold block mt-0.5">
                        {player.league}
                      </span>

                      {/* Stats Pills */}
                      <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-slate-100 text-center font-mono-code text-[10px]">
                        <div className="bg-slate-50 p-1 rounded">
                          <span className="text-slate-400 block text-[8px]">PTS</span>
                          <strong className="text-slate-900">{player.points}</strong>
                        </div>
                        <div className="bg-slate-50 p-1 rounded">
                          <span className="text-slate-400 block text-[8px]">REB</span>
                          <strong className="text-slate-900">{player.rebounds}</strong>
                        </div>
                        <div className="bg-slate-50 p-1 rounded">
                          <span className="text-slate-400 block text-[8px]">VAL</span>
                          <strong className="text-emerald-700">{player.valuation}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Action: Delete Individual */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-mono-code text-slate-400 flex items-center gap-1">
                        <Eye size={10} className="text-[#0c3975]" />
                        <span>Ficha</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteIndividualPlayer(player.id, player.name);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Eliminar jugador de Supabase"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: GLOBAL SETTINGS & SYSTEM CONTROLS                                  */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Color Theme Selector (Rojo vs Naranja) */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                <div className="flex items-center gap-2 text-[#0c3975]">
                  <Palette size={20} />
                  <h3 className="font-slab font-bold text-base uppercase">
                    Paleta & Color de Acento de la Web (Rojo vs Naranja)
                  </h3>
                </div>
                <span className="font-mono-code text-xs px-2.5 py-1 rounded font-bold uppercase border shadow-2xs" style={{
                  backgroundColor: accentColor === 'orange' ? '#ffedd5' : '#fee2e2',
                  borderColor: accentColor === 'orange' ? '#fdba74' : '#fca5a5',
                  color: accentColor === 'orange' ? '#c2410c' : '#b91c1c'
                }}>
                  Color Activo: {accentColor === 'orange' ? 'Naranja Baloncesto' : 'Rojo Clásico FEB'}
                </span>
              </div>

              <p className="font-mono-code text-xs text-slate-600 mt-2 mb-4">
                Cambia en tiempo real el color de acento de todas las secciones, botones, titulares, badges, cartas y bordes de la plataforma completa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Red */}
                <div
                  onClick={() => {
                    playRetroSound('click');
                    setAccentColor('red');
                    onShowToast('Color de acento cambiado a ROJO en toda la web.');
                  }}
                  className={`border-2 p-4 rounded-lg cursor-pointer transition-all flex items-start gap-3.5 ${
                    accentColor === 'red'
                      ? 'border-[#c02328] bg-rose-50/70 shadow-md ring-2 ring-[#c02328]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#c02328] shadow-xs shrink-0 flex items-center justify-center text-white font-bold text-base border-2 border-white">
                    {accentColor === 'red' ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-slab uppercase text-slate-900 text-sm">Rojo Clásico FEB</strong>
                      <span className="font-mono-code text-[11px] text-slate-500 font-bold">#c02328</span>
                    </div>
                    <span className="font-mono-code text-[11px] text-slate-600 block mt-1">
                      El estilo tradicional de la Federación Española y baloncesto clásico.
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-[#c02328] text-white font-slab text-[10px] uppercase px-2 py-0.5 rounded shadow-2xs">
                        Ejemplo Botón
                      </span>
                      <span className="text-[#c02328] font-mono-code text-xs font-bold">
                        ★ Texto de Acento
                      </span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Orange */}
                <div
                  onClick={() => {
                    playRetroSound('burst');
                    setAccentColor('orange');
                    onShowToast('Color de acento cambiado a NARANJA en toda la web.');
                  }}
                  className={`border-2 p-4 rounded-lg cursor-pointer transition-all flex items-start gap-3.5 ${
                    accentColor === 'orange'
                      ? 'border-[#ea580c] bg-orange-50/80 shadow-md ring-2 ring-[#ea580c]/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#ea580c] shadow-xs shrink-0 flex items-center justify-center text-white font-bold text-base border-2 border-white">
                    {accentColor === 'orange' ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-slab uppercase text-slate-900 text-sm">Naranja Baloncesto</strong>
                      <span className="font-mono-code text-[11px] text-slate-500 font-bold">#ea580c</span>
                    </div>
                    <span className="font-mono-code text-[11px] text-slate-600 block mt-1">
                      Tono cálido de balón de baloncesto, dinámico, moderno y de alta visibilidad.
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-[#ea580c] text-white font-slab text-[10px] uppercase px-2 py-0.5 rounded shadow-2xs">
                        Ejemplo Botón
                      </span>
                      <span className="text-[#ea580c] font-mono-code text-xs font-bold">
                        ★ Texto de Acento
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* System Switches */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 mb-2 text-[#0c3975]">
                <Sliders size={18} />
                <h3 className="font-slab font-bold text-base uppercase">
                  Interruptores de Sistema
                </h3>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono-code text-xs">
                <div>
                  <strong className="block text-slate-900">Modo Mantenimiento</strong>
                  <span className="text-[11px] text-slate-500">Muestra aviso temporal a los usuarios</span>
                </div>
                <input
                  type="checkbox"
                  checked={isMaintenanceMode}
                  onChange={(e) => {
                    setIsMaintenanceMode(e.target.checked);
                    onShowToast(`Modo mantenimiento: ${e.target.checked ? 'ACTIVADO' : 'DESACTIVADO'}`);
                  }}
                  className="w-4 h-4 cursor-pointer accent-[#c02328]"
                />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono-code text-xs">
                <div>
                  <strong className="block text-slate-900">Sincronización FEB en Vivo</strong>
                  <span className="text-[11px] text-slate-500">Actualiza telemetría post-partido</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAutoSyncEnabled}
                  onChange={(e) => {
                    setIsAutoSyncEnabled(e.target.checked);
                    onShowToast(`Sincronización en vivo: ${e.target.checked ? 'ACTIVA' : 'PAUSADA'}`);
                  }}
                  className="w-4 h-4 cursor-pointer accent-[#0c3975]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code font-bold text-slate-800 mb-1">
                  Mensaje Global de Notificación Superior:
                </label>
                <input
                  type="text"
                  value={systemAlertMessage}
                  onChange={(e) => setSystemAlertMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-mono-code focus:outline-none focus:border-[#0c3975]"
                />
              </div>
            </div>

            {/* Supabase Connection details */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#0c3975]">
                  <Database size={18} />
                  <h3 className="font-slab font-bold text-base uppercase">
                    Configuración de Supabase
                  </h3>
                </div>
                <p className="font-mono-code text-xs text-slate-600 leading-relaxed mb-4">
                  El proyecto está vinculado al motor REST v1 y Auth de Supabase en tiempo real.
                </p>

                <div className="bg-[#faf7f0] border border-slate-300 rounded p-3 font-mono-code text-xs space-y-1.5">
                  <div><strong>Host:</strong> https://hzuzuyyuxmfcabcemprx.supabase.co</div>
                  <div><strong>Key:</strong> sb_publishable_W-Of3_CR5DGFC6rv2naisw_b1gDxPD5</div>
                  <div><strong>SuperAdmin:</strong> teo@gmail.com</div>
                  <div><strong>Estado:</strong> {supabaseStatus.connected ? 'CONECTADO Y OPERATIVO' : 'DESCONECTADO'}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-mono-code text-slate-500">API Status: OK</span>
                <a
                  href="https://supabase.com/dashboard/project/hzuzuyyuxmfcabcemprx"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#0c3975] hover:bg-[#124b94] text-white text-xs font-condensed font-bold uppercase px-3 py-1.5 rounded flex items-center gap-1.5"
                >
                  <span>Abrir Dashboard Oficial Supabase</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

          </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* SECURITY CONFIRMATION MODAL FOR PURGE ACTIONS                              */}
      {/* ========================================================================= */}
      {purgeModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
          <div className="bg-[#faf7f0] border-4 border-[#c02328] rounded-md shadow-2xl p-6 w-full max-w-md">
            
            <div className="flex items-center justify-between border-b-2 border-[#c02328] pb-3 mb-4">
              <div className="flex items-center gap-2 text-[#c02328]">
                <AlertTriangle size={20} />
                <h3 className="font-slab font-bold text-lg uppercase">
                  {purgeModalConfig.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPurgeModalConfig((prev) => ({ ...prev, isOpen: false }))}
                className="w-6 h-6 bg-white border border-black hover:bg-yellow-300 flex items-center justify-center rounded cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <p className="font-mono-code text-xs text-slate-800 leading-relaxed mb-4">
              {purgeModalConfig.description}
            </p>

            <div className="bg-rose-50 border border-rose-300 p-3 rounded mb-4">
              <label className="block text-[11px] font-mono-code font-bold uppercase text-rose-900 mb-1">
                Escribe <span className="underline">CONFIRMAR</span> para proceder:
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="CONFIRMAR"
                className="w-full bg-white border-2 border-rose-400 rounded px-3 py-1.5 text-xs font-mono-code font-bold uppercase text-rose-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 font-mono-code text-xs">
              <button
                type="button"
                onClick={() => setPurgeModalConfig((prev) => ({ ...prev, isOpen: false }))}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded font-bold uppercase cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isPurging || confirmationInput.trim().toUpperCase() !== 'CONFIRMAR'}
                onClick={handleExecutePurge}
                className="px-4 py-1.5 bg-[#c02328] hover:bg-[#a01c20] disabled:opacity-50 text-white rounded font-bold uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 size={13} className={isPurging ? 'animate-spin' : ''} />
                <span>{isPurging ? 'Vaciando...' : 'Confirmar Vaciado'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL TO ADD NEW USER MANUALLY                                            */}
      {/* ========================================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div className="bg-[#faf7f0] border-4 border-[#0c3975] rounded-md shadow-2xl p-6 w-full max-w-md">
            
            <div className="flex items-center justify-between border-b-2 border-[#0c3975] pb-3 mb-4">
              <h3 className="font-slab font-bold text-xl text-[#0c3975] uppercase">
                Añadir Nuevo Usuario
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-6 h-6 bg-white border border-black hover:bg-yellow-300 flex items-center justify-center rounded cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 font-mono-code text-xs">
              <div>
                <label className="block font-bold text-[#0c3975] uppercase mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="ejemplo@entrenador.com"
                  className="w-full bg-white border-2 border-black/30 rounded px-3 py-1.5 focus:border-[#0c3975] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0c3975] uppercase mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: David Sánchez"
                  className="w-full bg-white border-2 border-black/30 rounded px-3 py-1.5 focus:border-[#0c3975] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0c3975] uppercase mb-1">
                  Equipo / Club FEB
                </label>
                <input
                  type="text"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  placeholder="Ej: CB Prat / Real Betis"
                  className="w-full bg-white border-2 border-black/30 rounded px-3 py-1.5 focus:border-[#0c3975] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0c3975] uppercase mb-1">
                    Rol
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                    className="w-full bg-white border-2 border-black/30 rounded px-2.5 py-1.5 focus:border-[#0c3975] focus:outline-none"
                  >
                    <option value="user">Usuario normal</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0c3975] uppercase mb-1">
                    Plan
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as 'GRATUITO' | 'PRO COACH' | 'CLUB ENTERPRISE')}
                    className="w-full bg-white border-2 border-black/30 rounded px-2.5 py-1.5 focus:border-[#0c3975] focus:outline-none"
                  >
                    <option value="GRATUITO">Gratuito</option>
                    <option value="PRO COACH">PRO Coach</option>
                    <option value="CLUB ENTERPRISE">Club Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0c3975]/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded font-bold uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0c3975] hover:bg-[#124b94] text-white rounded font-bold uppercase flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span>Crear Usuario</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: FICHA COMPLETA DEL JUGADOR SUPABASE */}
      <SupabasePlayerModal
        playerId={selectedPlayerIdForModal}
        isOpen={!!selectedPlayerIdForModal}
        onClose={() => setSelectedPlayerIdForModal(null)}
        onShowToast={onShowToast}
      />

    </div>
  );
};
