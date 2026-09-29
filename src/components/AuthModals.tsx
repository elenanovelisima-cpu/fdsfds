import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  Check, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Tag, 
  Gift, 
  ClipboardList, 
  UserCheck, 
  Wrench, 
  Binoculars,
  Sparkles
} from 'lucide-react';
import { playRetroSound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

/* -------------------------------------------------------------------------- */
/* ROLE TYPES & DATA                                                          */
/* -------------------------------------------------------------------------- */

export type UserRoleType = 'Entrenador' | 'Jugador' | 'Técnico' | 'Ojeador';

interface RoleOption {
  id: UserRoleType;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const ROLES: RoleOption[] = [
  {
    id: 'Entrenador',
    title: 'Entrenador',
    description: 'Gestiona tu equipo y planificación',
    badge: 'HEAD COACH',
    icon: <ClipboardList className="w-6 h-6 text-[#0c3975]" />,
  },
  {
    id: 'Jugador',
    title: 'Jugador',
    description: 'Accede a tus estadísticas y seguimiento',
    badge: 'ATLETA',
    icon: <UserCheck className="w-6 h-6 text-[#0c3975]" />,
  },
  {
    id: 'Técnico',
    title: 'Técnico',
    description: 'Colabora con el cuerpo técnico',
    badge: 'STAFF',
    icon: <Wrench className="w-6 h-6 text-[#0c3975]" />,
  },
  {
    id: 'Ojeador',
    title: 'Ojeador',
    description: 'Analiza y descubre nuevos talentos',
    badge: 'SCOUT',
    icon: <Binoculars className="w-6 h-6 text-[#0c3975]" />,
  },
];

/* -------------------------------------------------------------------------- */
/* 1. REGISTER MODAL (CREAR CUENTA + SELECCIÓN DE ROL)                        */
/* -------------------------------------------------------------------------- */

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onShowToast: (msg: string) => void;
  onRegisterSuccess?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onShowToast,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRoleType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');
  const [promoCode, setPromoCode] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRoleType) => {
    playRetroSound('click');
    setSelectedRole(role);
    setStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      onShowToast('Por favor introduce tu nombre completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      onShowToast('Por favor introduce un email válido.');
      return;
    }
    if (password.length < 6) {
      onShowToast('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      onShowToast('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      email,
      password,
      name: fullName,
      team: affiliateCode ? `Club ${affiliateCode}` : 'Club FEB',
      roleInClub: selectedRole || 'Entrenador',
    });
    setIsSubmitting(false);

    if (res.success) {
      playRetroSound('burst');
      onShowToast(`¡Registro completado! Bienvenido a BASKETDATA, ${email}.`);
      
      // Reset and close
      setStep('role');
      setSelectedRole(null);
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAffiliateCode('');
      setPromoCode('');
      onClose();
      if (onRegisterSuccess) onRegisterSuccess();
    } else {
      onShowToast(res.error || 'Error al crear la cuenta.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 font-sans select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#faf7f0] border-4 border-[#0c3975] rounded-md shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        
        {/* Top Header Row with Title & Close button */}
        <div className="flex items-center justify-between border-b-2 border-[#0c3975] pb-3 mb-4">
          <div className="flex items-center gap-2">
            {step === 'form' && (
              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  setStep('role');
                }}
                className="w-7 h-7 bg-white text-[#0c3975] border border-[#0c3975] hover:bg-slate-100 flex items-center justify-center rounded cursor-pointer transition-colors mr-1"
                title="Volver a selección de rol"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
              </button>
            )}
            <div>
              <span className="font-slab text-xl sm:text-2xl text-[#0c3975] uppercase block leading-tight">
                {step === 'role' ? 'CREAR CUENTA' : 'DATOS DE LA CUENTA'}
              </span>
              <span className="text-[11px] font-mono-code text-slate-600 block mt-0.5">
                {step === 'role' 
                  ? 'Paso 1 de 2: Elige tu tipo de perfil' 
                  : `Paso 2 de 2: Perfil ${selectedRole?.toUpperCase()}`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playRetroSound('click');
              onClose();
            }}
            className="w-7 h-7 bg-white text-black font-black border border-black hover:bg-yellow-300 flex items-center justify-center cursor-pointer rounded transition-colors"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* =================================================================== */}
        {/* STEP 1: ¿QUÉ TIPO DE USUARIO ERES?                                  */}
        {/* =================================================================== */}
        {step === 'role' && (
          <div>
            <div className="text-center mb-5">
              <h3 className="font-slab text-lg sm:text-xl text-[#0c3975] uppercase tracking-wide">
                ¿QUÉ TIPO DE USUARIO ERES?
              </h3>
              <p className="text-xs text-slate-600 font-mono-code mt-1">
                Selecciona tu rol para adaptar tu experiencia y estadísticas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {ROLES.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className="comic-interactive-card bg-white border-2 border-[#0c3975]/30 hover:border-[#0c3975] hover:bg-amber-50/50 p-4 rounded-[6px] cursor-pointer transition-all duration-150 flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-[6px] bg-[#0c3975]/10 group-hover:bg-[#0c3975] flex items-center justify-center group-hover:text-white transition-colors">
                        {role.icon}
                      </div>
                      <span className="font-mono-code text-[9.5px] font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-[#0c3975] rounded border border-[#0c3975]/20">
                        {role.badge}
                      </span>
                    </div>

                    <h4 className="font-slab text-base text-[#0c3975] group-hover:text-[#c02328] transition-colors uppercase">
                      {role.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-mono-code mt-1 leading-snug">
                      {role.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[#0c3975] font-slab text-[11px] uppercase font-bold group-hover:text-[#c02328]">
                    <span>SELECCIONAR</span>
                    <span className="text-xs">→</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with switch to login */}
            <div className="border-t border-[#0c3975]/20 pt-3 text-center">
              <span className="text-xs font-mono-code text-slate-600">
                ¿Ya tienes una cuenta registrada?{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  onSwitchToLogin();
                }}
                className="text-xs font-slab font-bold text-[#c02328] hover:underline uppercase ml-1 cursor-pointer"
              >
                INICIAR SESIÓN
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: FORMULARIO DE REGISTRO                                      */}
        {/* =================================================================== */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            
            {/* Active Role Indicator Badge */}
            <div className="flex items-center justify-between bg-amber-50 border border-amber-900/30 rounded px-3 py-1.5 text-xs font-mono-code">
              <span className="text-slate-700">Rol seleccionado:</span>
              <span className="font-bold text-[#0c3975] uppercase flex items-center gap-1.5">
                <Check size={14} className="text-green-700" />
                {selectedRole}
              </span>
            </div>

            {/* 1. Nombre completo */}
            <div>
              <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. Email */}
            <div>
              <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 3. Contraseña y Confirmar Contraseña (2 columns on sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 pr-9 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 pr-9 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Códigos opcionales (Afiliado y Promocional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-slab font-bold text-[#0c3975] uppercase mb-1">
                  Código de afiliado (opcional)
                </label>
                <input
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                  placeholder="Ej: BASKET2026"
                  className="w-full bg-white border-2 border-black/20 focus:border-[#0c3975] focus:outline-none rounded px-3 py-1.5 text-xs font-mono-code text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-slab font-bold text-[#0c3975] uppercase mb-1">
                  Código promocional (opcional)
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Código promocional"
                  className="w-full bg-white border-2 border-black/20 focus:border-[#0c3975] focus:outline-none rounded px-3 py-1.5 text-xs font-mono-code text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Note on Database connection in the future */}
            <p className="text-[10px] text-slate-500 font-mono-code text-center pt-1">
              * Datos guardados en entorno de demostración, listos para vinculación con backend.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-[#0c3975] hover:bg-[#124b94] text-white py-3 px-4 font-slab text-sm uppercase tracking-wider cursor-pointer rounded shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>CREAR CUENTA</span>
              <span>→</span>
            </button>

            {/* Back & Switch to Login */}
            <div className="flex items-center justify-between border-t border-[#0c3975]/20 pt-3 text-xs font-mono-code">
              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  setStep('role');
                }}
                className="text-slate-600 hover:text-[#0c3975] underline cursor-pointer"
              >
                ← Cambiar rol
              </button>

              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  onSwitchToLogin();
                }}
                className="font-slab font-bold text-[#c02328] hover:underline uppercase cursor-pointer"
              >
                ¿YA TIENES CUENTA? ENTRAR
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. LOGIN MODAL (INICIAR SESIÓN / ENTRAR + OLVIDÉ CONTRASEÑA)                */
/* -------------------------------------------------------------------------- */

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onShowToast: (msg: string) => void;
  onLoginSuccess?: (role: 'admin' | 'user') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onShowToast,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const [isForgotView, setIsForgotView] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim()) {
      onShowToast('Por favor introduce tu usuario o email.');
      return;
    }
    if (!password) {
      onShowToast('Por favor introduce tu contraseña.');
      return;
    }

    setIsLoading(true);
    const res = await login(emailOrUser, password);
    setIsLoading(false);

    if (res.success) {
      playRetroSound('burst');
      if (res.role === 'admin') {
        onShowToast('¡Bienvenido Administrador Teo! Accediendo al Panel de Control...');
        setEmailOrUser('');
        setPassword('');
        onClose();
        if (onLoginSuccess) onLoginSuccess('admin');
      } else {
        onShowToast(`¡Bienvenido de nuevo, ${emailOrUser}! (Sesión iniciada)`);
        setEmailOrUser('');
        setPassword('');
        onClose();
        if (onLoginSuccess) onLoginSuccess('user');
      }
    } else {
      playRetroSound('click');
      onShowToast(res.error || 'Credenciales no reconocidas.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      onShowToast('Introduce un email válido para recuperar la contraseña.');
      return;
    }

    playRetroSound('click');
    onShowToast(`Enlace de restablecimiento enviado a ${recoveryEmail}`);
    setRecoveryEmail('');
    setIsForgotView(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 font-sans select-none overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#faf7f0] border-4 border-[#0c3975] rounded-md shadow-2xl p-5 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#0c3975] pb-3 mb-4">
          <div>
            <span className="font-slab text-xl sm:text-2xl text-[#0c3975] uppercase block leading-tight">
              {isForgotView ? 'RECUPERAR CLAVE' : 'INICIAR SESIÓN'}
            </span>
            <span className="text-[11px] font-mono-code text-slate-600 block mt-0.5">
              {isForgotView 
                ? 'Te enviaremos un enlace de acceso' 
                : 'Accede a tu panel y estadísticas de BASKETDATA'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playRetroSound('click');
              setIsForgotView(false);
              onClose();
            }}
            className="w-7 h-7 bg-white text-black font-black border border-black hover:bg-yellow-300 flex items-center justify-center cursor-pointer rounded transition-colors"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* View 1: Standard Login Form */}
        {!isForgotView ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {/* Usuario / Email */}
            <div>
              <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                Usuario o Email
              </label>
              <input
                type="text"
                required
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-slab font-bold text-[#0c3975] uppercase">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playRetroSound('click');
                    setIsForgotView(true);
                  }}
                  className="text-[11px] font-mono-code text-[#c02328] hover:underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 pr-9 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-3 bg-[#0c3975] hover:bg-[#124b94] text-white py-3 px-4 font-slab text-sm uppercase tracking-wider cursor-pointer rounded shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>ENTRAR</span>
              <span>→</span>
            </button>

            {/* Switch to Register */}
            <div className="border-t border-[#0c3975]/20 pt-3 text-center">
              <span className="text-xs font-mono-code text-slate-600">
                ¿No tienes cuenta todavía?{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  onSwitchToRegister();
                }}
                className="text-xs font-slab font-bold text-[#c02328] hover:underline uppercase ml-1 cursor-pointer"
              >
                REGÍSTRATE GRATIS
              </button>
            </div>
          </form>
        ) : (
          /* View 2: Forgot Password Form */
          <form onSubmit={handleForgotSubmit} className="space-y-3.5">
            <p className="text-xs text-slate-600 font-mono-code leading-relaxed">
              Introduce el correo electrónico asociado a tu cuenta de BASKETDATA y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>

            <div>
              <label className="block text-xs font-slab font-bold text-[#0c3975] uppercase mb-1">
                Email de tu cuenta
              </label>
              <input
                type="email"
                required
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-white border-2 border-black/30 focus:border-[#0c3975] focus:outline-none rounded px-3 py-2 text-xs sm:text-sm font-mono-code text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#0c3975] hover:bg-[#124b94] text-white py-2.5 px-4 font-slab text-xs uppercase tracking-wider cursor-pointer rounded shadow-md transition-colors"
            >
              ENVIAR INSTRUCCIONES
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  playRetroSound('click');
                  setIsForgotView(false);
                }}
                className="text-xs font-mono-code text-slate-600 hover:text-[#0c3975] underline cursor-pointer"
              >
                ← Volver a Iniciar sesión
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
