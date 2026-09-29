import { supabase } from './supabase';

export interface LeagueStats {
  leagueName: string;
  playersCount: number;
  teamsCount: number;
}

export interface DatabaseSummary {
  totalPlayers: number;
  totalTeams: number;
  leagues: LeagueStats[];
  lastChecked: string;
}

export const KNOWN_LEAGUES = [
  'LF ENDESA',
  'PRIMERA FEB',
  'SEGUNDA FEB',
  'TERCERA FEB',
  'LF CHALLENGE',
  'L.F.-2',
  'LIGA U',
];

export async function fetchDatabaseSummary(): Promise<DatabaseSummary> {
  const { count: totalPlayers } = await supabase.from('players').select('id', { count: 'exact', head: true });
  const { count: totalTeams } = await supabase.from('teams').select('id', { count: 'exact', head: true });

  const leagues: LeagueStats[] = [];

  for (const leagueName of KNOWN_LEAGUES) {
    const { count: pCount } = await supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .filter('data->>league_name', 'eq', leagueName);

    const { count: tCount } = await supabase
      .from('teams')
      .select('id', { count: 'exact', head: true })
      .filter('data->>league_name', 'eq', leagueName);

    leagues.push({
      leagueName,
      playersCount: pCount || 0,
      teamsCount: tCount || 0,
    });
  }

  return {
    totalPlayers: totalPlayers || 0,
    totalTeams: totalTeams || 0,
    leagues,
    lastChecked: new Date().toLocaleTimeString('es-ES'),
  };
}

export async function deleteLeagueFromSupabase(leagueName: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Delete players of this league
    const { error: pErr } = await supabase
      .from('players')
      .delete()
      .filter('data->>league_name', 'eq', leagueName);

    if (pErr) throw pErr;

    // Delete teams of this league
    const { error: tErr } = await supabase
      .from('teams')
      .delete()
      .filter('data->>league_name', 'eq', leagueName);

    if (tErr) throw tErr;

    return {
      success: true,
      message: `Liga ${leagueName} vaciada con éxito de Supabase (jugadores y equipos).`,
    };
  } catch (err: unknown) {
    console.error('Error deleting league:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Error al vaciar la liga.',
    };
  }
}

export async function deleteAllPlayersFromSupabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .neq('id', 'placeholder-safe-id-never-matches');

    if (error) throw error;
    return { success: true, message: 'Se han eliminado todos los jugadores de la tabla players en Supabase.' };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Error al vaciar jugadores.' };
  }
}

export async function deleteAllTeamsFromSupabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .neq('id', 'placeholder-safe-id-never-matches');

    if (error) throw error;
    return { success: true, message: 'Se han eliminado todos los equipos de la tabla teams en Supabase.' };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Error al vaciar equipos.' };
  }
}

export async function purgeAllSupabaseData(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const resP = await deleteAllPlayersFromSupabase();
    if (!resP.success) throw new Error(resP.message);

    const resT = await deleteAllTeamsFromSupabase();
    if (!resT.success) throw new Error(resT.message);

    return {
      success: true,
      message: 'Base de datos vaciada por completo (tabla players y teams purgadas).',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Error durante el vaciado total.',
    };
  }
}

export interface SupabasePlayerItem {
  id: string;
  name: string;
  team: string;
  league: string;
  position: string;
  photoUrl?: string;
  points?: string;
  assists?: string;
  rebounds?: string;
  valuation?: string;
}

export async function searchSupabasePlayers(
  query: string,
  league?: string,
  limit = 24
): Promise<SupabasePlayerItem[]> {
  try {
    let req = supabase.from('players').select('id, data').limit(limit);

    if (league && league !== 'ALL') {
      req = req.filter('data->>league_name', 'eq', league);
    }

    if (query.trim()) {
      req = req.ilike('data->>player_name', `%${query.trim()}%`);
    }

    const { data, error } = await req;
    if (error || !data) return [];

    return data.map((item) => {
      const d = item.data || {};
      const avg = d.season_stats_avg?.[0] || {};
      return {
        id: item.id,
        name: d.player_name || 'Sin nombre',
        team: d.team_name || 'Sin equipo',
        league: d.league_name || 'FEB',
        position: d.position || 'Jugador',
        photoUrl: d.photo_url || `https://imagenes.feb.es/Foto.aspx?c=${item.id}`,
        points: avg.puntos || '0',
        assists: avg.asistencias || '0',
        rebounds: avg.rebotes_total || '0',
        valuation: avg.valoracion || '0',
      };
    });
  } catch (e) {
    console.error('Error searching players:', e);
    return [];
  }
}

export async function deleteSinglePlayerFromSupabase(playerId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('players').delete().eq('id', playerId);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchFullPlayerDetails(playerId: string): Promise<{
  id: string;
  data: Record<string, any>;
} | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('id, data')
      .eq('id', playerId)
      .single();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error('Error fetching player details:', err);
    return null;
  }
}
