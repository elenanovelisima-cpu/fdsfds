import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'suspended';
  plan: 'GRATUITO' | 'PRO COACH' | 'CLUB ENTERPRISE';
  phone?: string;
  team?: string;
  roleInClub?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  registeredUsers: AuthUser[];
  supabaseStatus: {
    connected: boolean;
    pingMs: number;
    lastChecked: string;
    endpoint: string;
  };
  login: (email: string, pass: string) => Promise<{ success: boolean; role?: 'admin' | 'user'; error?: string }>;
  register: (data: {
    email: string;
    password?: string;
    name?: string;
    team?: string;
    roleInClub?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserRole: (userId: string, newRole: 'admin' | 'user') => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  addNewUser: (user: Omit<AuthUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  refreshConnection: () => Promise<void>;
}

const STORAGE_KEY_CURRENT_USER = 'basketdata_auth_current_user_v2';
const STORAGE_KEY_USERS = 'basketdata_auth_users_list_v2';

// Only Teo as Super Admin initially; any new user will come from real registrations
const INITIAL_USERS: AuthUser[] = [
  {
    id: 'usr-admin-teo',
    email: 'teo@gmail.com',
    name: 'Teo Admin',
    role: 'admin',
    createdAt: '2026-01-15T09:30:00Z',
    lastLogin: new Date().toISOString(),
    status: 'active',
    plan: 'CLUB ENTERPRISE',
    team: 'BASKETDATA Staff',
    roleInClub: 'Super Administrador',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure Teo is always present and has admin role
        const teoExists = parsed.some((u: AuthUser) => u.email.toLowerCase() === 'teo@gmail.com');
        if (!teoExists) {
          return [INITIAL_USERS[0], ...parsed];
        }
        return parsed;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [supabaseStatus, setSupabaseStatus] = useState({
    connected: true,
    pingMs: 45,
    lastChecked: new Date().toLocaleTimeString(),
    endpoint: 'https://hzuzuyyuxmfcabcemprx.supabase.co',
  });

  // Check Supabase connection on load
  const refreshConnection = async () => {
    const res = await checkSupabaseConnection();
    setSupabaseStatus({
      connected: res.ok,
      pingMs: res.pingMs || 50,
      lastChecked: new Date().toLocaleTimeString(),
      endpoint: 'https://hzuzuyyuxmfcabcemprx.supabase.co',
    });
  };

  useEffect(() => {
    refreshConnection();
  }, []);

  // Save users list changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Error saving users to storage', e);
    }
  }, [registeredUsers]);

  // Save current user changes to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.error('Error saving current user', e);
    }
  }, [currentUser]);

  // LOGIN FUNCTION
  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; role?: 'admin' | 'user'; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Special Admin Credentials Check
    if (cleanEmail === 'teo@gmail.com' && cleanPass === 'Teo2021.') {
      // Attempt Supabase auth in background
      try {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });
        if (signInErr) {
          // If not created yet in Supabase Auth, try creating it
          await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPass,
            options: {
              data: { role: 'admin', name: 'Teo Admin' },
            },
          });
        }
      } catch (err) {
        console.warn('Supabase auth notice:', err);
      }

      // Find or build admin record
      let adminRecord = registeredUsers.find((u) => u.email.toLowerCase() === 'teo@gmail.com');
      if (!adminRecord) {
        adminRecord = INITIAL_USERS[0];
        setRegisteredUsers((prev) => [adminRecord!, ...prev]);
      } else {
        adminRecord = {
          ...adminRecord,
          lastLogin: new Date().toISOString(),
          status: 'active',
          role: 'admin',
        };
        setRegisteredUsers((prev) =>
          prev.map((u) => (u.email.toLowerCase() === 'teo@gmail.com' ? adminRecord! : u))
        );
      }

      setCurrentUser(adminRecord);
      return { success: true, role: 'admin' };
    }

    // 2. Regular User Login: Check Supabase Auth and local records
    try {
      const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      // If Supabase succeeds or if we have user record
      const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (supaData?.user || existingUser) {
        const userToSet: AuthUser = existingUser
          ? {
              ...existingUser,
              lastLogin: new Date().toISOString(),
            }
          : {
              id: supaData?.user?.id || `usr-${Date.now()}`,
              email: cleanEmail,
              name: supaData?.user?.user_metadata?.name || cleanEmail.split('@')[0],
              role: cleanEmail === 'teo@gmail.com' ? 'admin' : 'user',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              status: 'active',
              plan: 'PRO COACH',
            };

        // Update list
        setRegisteredUsers((prev) => {
          const exists = prev.some((u) => u.email.toLowerCase() === cleanEmail);
          if (exists) {
            return prev.map((u) => (u.email.toLowerCase() === cleanEmail ? userToSet : u));
          }
          return [...prev, userToSet];
        });

        setCurrentUser(userToSet);
        return { success: true, role: userToSet.role };
      }

      // If Supabase gave an error and no local record exists
      if (supaErr) {
        // As a friendly fallback for new users during development demo:
        // If password is at least 4 characters, allow creation/login
        if (cleanPass.length >= 4) {
          const newUser: AuthUser = {
            id: `usr-${Date.now()}`,
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            status: 'active',
            plan: 'GRATUITO',
          };
          setRegisteredUsers((prev) => [...prev, newUser]);
          setCurrentUser(newUser);
          return { success: true, role: 'user' };
        }
        return { success: false, error: supaErr.message || 'Credenciales incorrectas' };
      }
    } catch (e: unknown) {
      console.warn('Auth attempt error:', e);
    }

    // Fallback: check registered users in state
    const match = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (match) {
      if (match.status === 'suspended') {
        return { success: false, error: 'Esta cuenta está suspendida por el administrador.' };
      }
      const updated = { ...match, lastLogin: new Date().toISOString() };
      setRegisteredUsers((prev) => prev.map((u) => (u.id === match.id ? updated : u)));
      setCurrentUser(updated);
      return { success: true, role: updated.role };
    }

    return {
      success: false,
      error: 'Usuario o contraseña no reconocidos. Si eres Teo usa teo@gmail.com y Teo2021.',
    };
  };

  // REGISTER FUNCTION
  const register = async (data: {
    email: string;
    password?: string;
    name?: string;
    team?: string;
    roleInClub?: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check if already registered
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
    }

    // Attempt Supabase signUp
    try {
      if (data.password) {
        await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password,
          options: {
            data: {
              name: data.name || cleanEmail.split('@')[0],
              team: data.team || '',
              roleInClub: data.roleInClub || '',
            },
          },
        });
      }
    } catch (err) {
      console.warn('Supabase register notice:', err);
    }

    const isTeo = cleanEmail === 'teo@gmail.com';
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: data.name || cleanEmail.split('@')[0],
      role: isTeo ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
      plan: 'PRO COACH',
      team: data.team || 'Equipo FEB',
      roleInClub: data.roleInClub || 'Entrenador',
      phone: data.phone || '',
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    return { success: true };
  };

  // LOGOUT
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
  };

  // ADMIN ACTIONS
  const updateUserRole = (userId: string, newRole: 'admin' | 'user') => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const toggleUserStatus = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
  };

  const deleteUser = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const addNewUser = (userData: Omit<AuthUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: AuthUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: 'Nunca',
    };
    setRegisteredUsers((prev) => [newUser, ...prev]);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        registeredUsers,
        supabaseStatus,
        login,
        register,
        logout,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        addNewUser,
        refreshConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
