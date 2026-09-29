import { AuthUser } from '../context/AuthContext';

export type AnalyticsPeriod = '1d' | '7d' | '30d' | '90d';

export interface UserUsageRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  sessions: number;
  timeSpent: string;
  reportsCreated: number;
  lastConnection: string;
}

export interface PageVisitRecord {
  path: string;
  name: string;
  visits: number;
  totalTime: string;
  averageTime: string;
  percentage: number;
}

export interface AnalyticsSummary {
  period: AnalyticsPeriod;
  uniqueVisitors: number;
  anonymousVisitors: number;
  activeRegistered: number;
  totalSessions: number;
  totalTime: string;
  reportsCreated: number;
  usersUsage: UserUsageRecord[];
  pagesVisits: PageVisitRecord[];
  dailyTraffic: { label: string; visitors: number; sessions: number }[];
}

export function getAnalyticsData(period: AnalyticsPeriod, registeredUsers: AuthUser[]): AnalyticsSummary {
  const multipliers: Record<AnalyticsPeriod, number> = {
    '1d': 1,
    '7d': 7.2,
    '30d': 31.4,
    '90d': 94.6,
  };

  const m = multipliers[period];

  const uniqueVisitors = Math.round(148 * m);
  const anonymousVisitors = Math.round(124 * m);
  const activeRegistered = Math.max(registeredUsers.length, Math.round(24 * (period === '1d' ? 1 : m * 0.4)));
  const totalSessions = Math.round(212 * m);
  
  const totalHours = Math.round(16.5 * m);
  const totalTime = totalHours >= 24 ? `${Math.floor(totalHours / 24)}d ${totalHours % 24}h` : `${totalHours}h 42m`;
  const reportsCreated = Math.round(38 * m);

  // Per registered user usage
  const usersUsage: UserUsageRecord[] = registeredUsers.map((user, idx) => {
    const isTeo = user.email.toLowerCase() === 'teo@gmail.com';
    const baseSessions = isTeo ? 9 : 4 + (idx % 3);
    const sessions = Math.max(1, Math.round(baseSessions * (period === '1d' ? 1 : m * 0.45)));
    const minutes = sessions * (isTeo ? 24 : 14);
    const timeSpent = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
    const userReports = Math.round(sessions * (isTeo ? 0.8 : 0.4));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role === 'admin' ? 'Superadmin' : 'Entrenador / Scout',
      sessions,
      timeSpent,
      reportsCreated: userReports,
      lastConnection: user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Hoy',
    };
  });

  // Pages most visited
  const basePages = [
    { path: '/', name: 'Inicio (Cartas & Hub FEB)', baseVisits: 110, baseMinutes: 280, avg: '2m 32s' },
    { path: '/player-profile', name: 'Perfil de Jugador (Luka Doncic)', baseVisits: 54, baseMinutes: 195, avg: '3m 36s' },
    { path: '/pro-tools', name: 'Herramientas de Tiro & Telemetría FEB', baseVisits: 38, baseMinutes: 140, avg: '3m 41s' },
    { path: '/checklist', name: 'Checklist & Scouting de Jugadores', baseVisits: 29, baseMinutes: 98, avg: '3m 22s' },
    { path: '/admin', name: 'Panel de Control Superadmin', baseVisits: 18, baseMinutes: 85, avg: '4m 43s' },
  ];

  const totalPageVisits = basePages.reduce((acc, p) => acc + Math.round(p.baseVisits * m), 0);

  const pagesVisits: PageVisitRecord[] = basePages.map((p) => {
    const visits = Math.round(p.baseVisits * m);
    const totalMin = Math.round(p.baseMinutes * m);
    const timeFormatted = totalMin >= 60 ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` : `${totalMin}m`;
    return {
      path: p.path,
      name: p.name,
      visits,
      totalTime: timeFormatted,
      averageTime: p.avg,
      percentage: Math.round((visits / totalPageVisits) * 100),
    };
  });

  // Daily trend
  const daysCount = period === '1d' ? 8 : period === '7d' ? 7 : period === '30d' ? 10 : 12;
  const dailyTraffic = Array.from({ length: daysCount }).map((_, i) => {
    const dayLabel = period === '1d' ? `${i * 3}:00` : `Día ${i + 1}`;
    const base = period === '1d' ? 20 : 120;
    const factor = 1 + Math.sin(i * 0.9) * 0.35;
    return {
      label: dayLabel,
      visitors: Math.round(base * factor),
      sessions: Math.round(base * factor * 1.35),
    };
  });

  return {
    period,
    uniqueVisitors,
    anonymousVisitors,
    activeRegistered,
    totalSessions,
    totalTime,
    reportsCreated,
    usersUsage,
    pagesVisits,
    dailyTraffic,
  };
}
