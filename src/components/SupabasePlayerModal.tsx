import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Activity, 
  BarChart3, 
  Calendar, 
  Award, 
  Shield, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Database,
  User,
  Clock,
  ChevronRight
} from 'lucide-react';
import { playRetroSound } from '../utils/audio';
import { fetchFullPlayerDetails } from '../lib/supabaseAdmin';

interface SupabasePlayerModalProps {
  playerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SupabasePlayerModal: React.FC<SupabasePlayerModalProps> = ({
  playerId,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [playerData, setPlayerData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'averages' | 'totals' | 'career' | 'raw_json'>('averages');
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !playerId) {
      setPlayerData(null);
      return;
    }

    const loadPlayer = async () => {
      setLoading(true);
      const res = await fetchFullPlayerDetails(playerId);
      if (res && res.data) {
        setPlayerData(res.data);
      } else {
        onShowToast('No se pudieron obtener los datos completos del jugador.');
      }
      setLoading(false);
    };

    loadPlayer();
  }, [isOpen, playerId]);

  if (!isOpen || !playerId) return null;

  const d = playerData || {};
  const seasonStatsAvg: any[] = d.season_stats_avg || [];
  const seasonStatsTotal: any[] = d.season_stats_total || [];
  const careerHistory: any[] = d.career_history || [];

  // Main Average Sample (Phase 1 or Global)
  const currentAvg = seasonStatsAvg[0] || {};
  const currentTotal = seasonStatsTotal[0] || {};

  const handleCopyJson = () => {
    playRetroSound('click');
    navigator.clipboard.writeText(JSON.stringify(d, null, 2));
    setHasCopied(true);
    onShowToast('JSON completo de Supabase copiado al portapapeles');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs select-none animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playRetroSound('click');
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#faf7f0] border-4 border-[#0c3975] rounded-lg shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#0c3975]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. MODAL TOP BAR */}
        <div className="bg-[#0c3975] text-white p-3.5 px-5 flex items-center justify-between border-b-2 border-[#08244b] shrink-0">
          <div className="flex items-center gap-2.5">
            <Database size={18} className="text-amber-400" />
            <span className="font-slab font-black text-sm sm:text-base uppercase tracking-wider text-[#fff9e6]">
              FICHA COMPLETA SUPABASE • BALONCESTO FEB
            </span>
            <span className="bg-[#c02328] text-white text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded tracking-widest">
              ID: {playerId}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playRetroSound('click');
              onClose();
            }}
            className="w-7 h-7 bg-white text-black border border-black hover:bg-yellow-300 rounded flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs transition-colors"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* 2. LOADING STATE */}
        {loading ? (
          <div className="p-16 text-center font-mono-code text-slate-600 flex flex-col items-center justify-center space-y-3">
            <RefreshCw size={28} className="animate-spin text-[#0c3975]" />
            <p className="text-sm font-bold">Consultando telemetría completa de Supabase...</p>
            <span className="text-xs text-slate-400">players.id = {playerId}</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 3. HERO PLAYER PROFILE CARD */}
            <div className="bg-white border-2 border-[#0c3975]/30 rounded-lg p-4 sm:p-5 shadow-sm flex flex-col md:flex-row gap-5 items-start">
              
              {/* Photo + Dorsal */}
              <div className="relative shrink-0 mx-auto md:mx-0">
                <div className="w-28 h-36 sm:w-32 sm:h-40 bg-slate-100 rounded-md border-2 border-[#0c3975] overflow-hidden shadow-xs">
                  <img
                    src={d.photo_url || `https://imagenes.feb.es/Foto.aspx?c=${playerId}`}
                    alt={d.player_name || 'Jugador FEB'}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.src = 'https://imagenes.feb.es/Imagen.aspx?i=logo&ti=1';
                    }}
                  />
                </div>
                {d.dorsal && (
                  <span className="absolute -bottom-2 -right-2 bg-[#c02328] text-white font-slab font-black text-sm px-2.5 py-0.5 rounded border border-white shadow-xs">
                    #{d.dorsal}
                  </span>
                )}
              </div>

              {/* Bio & Details */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="bg-[#0c3975]/10 text-[#0c3975] text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded border border-[#0c3975]/30">
                    {d.league_name || 'LIGA FEB'}
                  </span>
                  {d.group_name && (
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded">
                      {d.group_name}
                    </span>
                  )}
                  {d.is_starter && (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border border-emerald-200">
                      ★ TITULAR HABITUAL
                    </span>
                  )}
                </div>

                <h2 className="font-slab font-black text-2xl sm:text-3xl text-[#0c3975] uppercase tracking-tight">
                  {d.player_name || 'JUGADOR SIN NOMBRE'}
                </h2>

                <div className="flex items-center justify-center md:justify-start gap-2 font-mono-code text-xs text-slate-700 font-bold">
                  <span className="text-[#c02328]">{d.team_name || 'Club no especificado'}</span>
                  <span>•</span>
                  <span>{d.position || 'Jugador'}</span>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono-code">
                  <div className="bg-[#faf7f0] border border-slate-200 p-2 rounded">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Altura</span>
                    <strong className="text-slate-800">{d.height || 'N/D'}</strong>
                  </div>
                  <div className="bg-[#faf7f0] border border-slate-200 p-2 rounded">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Nacimiento</span>
                    <strong className="text-slate-800">{d.birth_date || 'N/D'}</strong>
                  </div>
                  <div className="bg-[#faf7f0] border border-slate-200 p-2 rounded">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Nacionalidad</span>
                    <strong className="text-slate-800">{d.nationality || 'ESP'}</strong>
                  </div>
                  <div className="bg-[#faf7f0] border border-slate-200 p-2 rounded">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Formación</span>
                    <strong className="text-slate-800">{d.formation || 'Nacional'}</strong>
                  </div>
                </div>

              </div>

            </div>

            {/* 4. BIG STAT HIGHLIGHTS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center font-mono-code">
              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">PUNTOS</span>
                <span className="font-slab font-black text-xl text-[#0c3975]">
                  {currentAvg.puntos || d.points || '0'}
                </span>
                <span className="text-[8px] text-slate-500 block">por partido</span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">REBOTES</span>
                <span className="font-slab font-black text-xl text-slate-800">
                  {currentAvg.rebotes_total || d.rebounds_total || '0'}
                </span>
                <span className="text-[8px] text-slate-500 block">totales</span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">ASISTENCIAS</span>
                <span className="font-slab font-black text-xl text-blue-700">
                  {currentAvg.asistencias || d.assists || '0'}
                </span>
                <span className="text-[8px] text-slate-500 block">por partido</span>
              </div>

              <div className="bg-white border-2 border-emerald-500 p-2.5 rounded-md shadow-xs bg-emerald-50/30">
                <span className="text-emerald-700 block text-[9px] uppercase font-bold">VALORACIÓN</span>
                <span className="font-slab font-black text-xl text-emerald-700">
                  {currentAvg.valoracion || d.valuation || '0'}
                </span>
                <span className="text-[8px] text-emerald-600 block">FEB Media</span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">ROBOS</span>
                <span className="font-slab font-black text-xl text-slate-800">
                  {currentAvg.robos || d.steals || '0'}
                </span>
                <span className="text-[8px] text-slate-500 block">por partido</span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">MINUTOS</span>
                <span className="font-slab font-black text-xl text-slate-800">
                  {currentAvg.minutos || d.minutes || '00:00'}
                </span>
                <span className="text-[8px] text-slate-500 block">promedio</span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">% T2</span>
                <span className="font-slab font-black text-xl text-amber-600">
                  {currentAvg.t2_pct || d.t2_pct || '0%'}
                </span>
                <span className="text-[8px] text-slate-500 block">efectividad</span>
              </div>

              <div className="bg-white border-2 border-[#0c3975]/30 p-2.5 rounded-md shadow-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">% T3</span>
                <span className="font-slab font-black text-xl text-[#c02328]">
                  {currentAvg.t3_pct || d.t3_pct || '0%'}
                </span>
                <span className="text-[8px] text-slate-500 block">triples</span>
              </div>
            </div>

            {/* 5. TABS FOR DETAILED SECTIONS */}
            <div>
              <div className="flex flex-wrap items-center gap-2 border-b-2 border-[#0c3975]/30 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    playRetroSound('click');
                    setActiveTab('averages');
                  }}
                  className={`px-3 py-1.5 rounded font-slab text-xs uppercase tracking-wider cursor-pointer font-bold transition-all ${
                    activeTab === 'averages'
                      ? 'bg-[#0c3975] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  Medias por Fase ({seasonStatsAvg.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playRetroSound('click');
                    setActiveTab('totals');
                  }}
                  className={`px-3 py-1.5 rounded font-slab text-xs uppercase tracking-wider cursor-pointer font-bold transition-all ${
                    activeTab === 'totals'
                      ? 'bg-[#0c3975] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  Totales Acumulados ({seasonStatsTotal.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playRetroSound('click');
                    setActiveTab('career');
                  }}
                  className={`px-3 py-1.5 rounded font-slab text-xs uppercase tracking-wider cursor-pointer font-bold transition-all ${
                    activeTab === 'career'
                      ? 'bg-[#0c3975] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  Trayectoria & Clubes ({careerHistory.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playRetroSound('click');
                    setActiveTab('raw_json');
                  }}
                  className={`px-3 py-1.5 rounded font-slab text-xs uppercase tracking-wider cursor-pointer font-bold transition-all ml-auto ${
                    activeTab === 'raw_json'
                      ? 'bg-[#c02328] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  JSON Supabase ({Object.keys(d).length} claves)
                </button>
              </div>

              {/* TAB CONTENT A: AVERAGES TABLE */}
              {activeTab === 'averages' && (
                <div className="mt-4 bg-white border-2 border-slate-200 rounded-lg shadow-xs overflow-x-auto">
                  {seasonStatsAvg.length === 0 ? (
                    <div className="p-8 text-center font-mono-code text-xs text-slate-500">
                      No hay desgloses de medias registrados para este jugador.
                    </div>
                  ) : (
                    <table className="w-full text-left font-mono-code text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                          <th className="py-2.5 px-3">Fase</th>
                          <th className="py-2.5 px-3">PJ</th>
                          <th className="py-2.5 px-3">MIN</th>
                          <th className="py-2.5 px-3">PTS</th>
                          <th className="py-2.5 px-3">% T2</th>
                          <th className="py-2.5 px-3">% T3</th>
                          <th className="py-2.5 px-3">% TL</th>
                          <th className="py-2.5 px-3">RO</th>
                          <th className="py-2.5 px-3">RD</th>
                          <th className="py-2.5 px-3">RT</th>
                          <th className="py-2.5 px-3">AST</th>
                          <th className="py-2.5 px-3">BR</th>
                          <th className="py-2.5 px-3">BP</th>
                          <th className="py-2.5 px-3">TF</th>
                          <th className="py-2.5 px-3">TC</th>
                          <th className="py-2.5 px-3">FC</th>
                          <th className="py-2.5 px-3">FR</th>
                          <th className="py-2.5 px-3 text-right">VAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {seasonStatsAvg.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-900">{row.fase || 'Temporada'}</td>
                            <td className="py-2 px-3">{row.partidos}</td>
                            <td className="py-2 px-3">{row.minutos}</td>
                            <td className="py-2 px-3 font-bold text-[#0c3975]">{row.puntos}</td>
                            <td className="py-2 px-3">{row.t2_pct}</td>
                            <td className="py-2 px-3">{row.t3_pct}</td>
                            <td className="py-2 px-3">{row.tl_pct}</td>
                            <td className="py-2 px-3 text-slate-500">{row.rebotes_of}</td>
                            <td className="py-2 px-3 text-slate-500">{row.rebotes_def}</td>
                            <td className="py-2 px-3 font-bold">{row.rebotes_total}</td>
                            <td className="py-2 px-3 font-bold text-blue-700">{row.asistencias}</td>
                            <td className="py-2 px-3">{row.robos}</td>
                            <td className="py-2 px-3">{row.perdidas}</td>
                            <td className="py-2 px-3">{row.tapones_favor}</td>
                            <td className="py-2 px-3">{row.tapones_contra}</td>
                            <td className="py-2 px-3">{row.faltas_cometidas}</td>
                            <td className="py-2 px-3">{row.faltas_recibidas}</td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-700">{row.valoracion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB CONTENT B: TOTALS TABLE */}
              {activeTab === 'totals' && (
                <div className="mt-4 bg-white border-2 border-slate-200 rounded-lg shadow-xs overflow-x-auto">
                  {seasonStatsTotal.length === 0 ? (
                    <div className="p-8 text-center font-mono-code text-xs text-slate-500">
                      No hay desgloses de totales registrados para este jugador.
                    </div>
                  ) : (
                    <table className="w-full text-left font-mono-code text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                          <th className="py-2.5 px-3">Fase</th>
                          <th className="py-2.5 px-3">Partidos</th>
                          <th className="py-2.5 px-3">Minutos Tot.</th>
                          <th className="py-2.5 px-3">Puntos Tot.</th>
                          <th className="py-2.5 px-3">T2 (A/I)</th>
                          <th className="py-2.5 px-3">T3 (A/I)</th>
                          <th className="py-2.5 px-3">TL (A/I)</th>
                          <th className="py-2.5 px-3">TC Total</th>
                          <th className="py-2.5 px-3">Reb. Tot</th>
                          <th className="py-2.5 px-3">Asistencias</th>
                          <th className="py-2.5 px-3">Robos</th>
                          <th className="py-2.5 px-3">Pérdidas</th>
                          <th className="py-2.5 px-3 text-right">VAL Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {seasonStatsTotal.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-900">{row.fase || 'Total'}</td>
                            <td className="py-2 px-3">{row.partidos}</td>
                            <td className="py-2 px-3">{row.minutos_total}</td>
                            <td className="py-2 px-3 font-bold text-[#0c3975]">{row.puntos_total}</td>
                            <td className="py-2 px-3">{row.t2} ({row.t2_pct})</td>
                            <td className="py-2 px-3">{row.t3} ({row.t3_pct})</td>
                            <td className="py-2 px-3">{row.tl} ({row.tl_pct})</td>
                            <td className="py-2 px-3">{row.tc}</td>
                            <td className="py-2 px-3 font-bold">{row.rebotes_total}</td>
                            <td className="py-2 px-3 font-bold text-blue-700">{row.asistencias}</td>
                            <td className="py-2 px-3">{row.robos}</td>
                            <td className="py-2 px-3">{row.perdidas}</td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-700">{row.valoracion_total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB CONTENT C: CAREER HISTORY */}
              {activeTab === 'career' && (
                <div className="mt-4 bg-white border-2 border-slate-200 rounded-lg shadow-xs overflow-x-auto">
                  {careerHistory.length === 0 ? (
                    <div className="p-8 text-center font-mono-code text-xs text-slate-500">
                      Sin historial de clubes previo registrado en la federación.
                    </div>
                  ) : (
                    <table className="w-full text-left font-mono-code text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-[#0c3975] uppercase text-[10px] font-bold border-b border-slate-200">
                          <th className="py-2.5 px-3">Temporada</th>
                          <th className="py-2.5 px-3">Categoría / Liga</th>
                          <th className="py-2.5 px-3">Club</th>
                          <th className="py-2.5 px-3">Tipo Licencia</th>
                          <th className="py-2.5 px-3">Fecha Alta</th>
                          <th className="py-2.5 px-3 text-right">Fecha Baja</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {careerHistory.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-900">{item.temporada || '-'}</td>
                            <td className="py-2 px-3 text-[#c02328] font-bold">{item.categoria || '-'}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{item.club || '-'}</td>
                            <td className="py-2 px-3">{item.tipo_licencia || 'Jugador/a'}</td>
                            <td className="py-2 px-3 text-slate-500">{item.fecha_alta || '-'}</td>
                            <td className="py-2 px-3 text-right text-slate-500">{item.fecha_baja || 'Vigente'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB CONTENT D: RAW JSON */}
              {activeTab === 'raw_json' && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-xs text-slate-600 font-bold">
                      Esquema JSON crudo obtenido desde Supabase REST v1:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="bg-[#0c3975] hover:bg-[#124b94] text-white px-3 py-1 rounded text-xs font-mono-code font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {hasCopied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{hasCopied ? '¡Copiado!' : 'Copiar JSON'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-emerald-400 p-4 rounded-md font-mono-code text-xs max-h-96 overflow-y-auto border border-slate-800 shadow-inner">
                    <pre>{JSON.stringify(d, null, 2)}</pre>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* 6. MODAL FOOTER */}
        <div className="p-3.5 px-5 bg-[#faf7f0] border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono-code text-slate-500">
            <span>FEB ID: <strong>{playerId}</strong></span>
            <span>•</span>
            <span>Actualizado: <strong>{d.updated_at ? new Date(d.updated_at).toLocaleDateString('es-ES') : 'Reciente'}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => {
              playRetroSound('click');
              onClose();
            }}
            className="px-4 py-1.5 bg-[#0c3975] hover:bg-[#124b94] text-white rounded font-slab font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};
