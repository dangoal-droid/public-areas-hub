import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Employee } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2,
  Building2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface AccessPortalProps {
  onLoginSuccess: (role: 'supervisor' | 'porter', employee: Employee) => void;
}

export const AccessPortal: React.FC<AccessPortalProps> = ({ onLoginSuccess }) => {
  const { employees, t } = useApp();
  const [selectedRole, setSelectedRole] = useState<'supervisor' | 'porter' | null>(null);
  const [employeeNumberInput, setEmployeeNumberInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanInput = employeeNumberInput.trim();
    if (!cleanInput) {
      setErrorMessage(t('portal_employee_number_prompt'));
      return;
    }

    if (selectedRole === 'supervisor') {
      // Look up supervisor by employeeNumber or ID or Name
      const matched = employees.find(emp => 
        emp.active && 
        (emp.employeeNumber === cleanInput || emp.id === cleanInput || emp.name.toLowerCase().includes(cleanInput.toLowerCase())) &&
        (emp.role.toLowerCase().includes('supervisor') || emp.role.toLowerCase().includes('líder') || emp.role.toLowerCase().includes('gerente') || emp.role.toLowerCase().includes('administrador') || emp.role.toLowerCase().includes('moderador') || emp.role === 'Public Area Supervisor')
      );

      if (!matched) {
        setErrorMessage(t('portal_err_supervisor_not_found'));
        return;
      }

      const cleanPassword = passwordInput.trim();
      if (!cleanPassword) {
        setErrorMessage(t('portal_err_password_required'));
        return;
      }

      // Check password: match employee.password if set, else fallback to '1234', 'admin123', or employee number
      const expectedPassword = matched.password && matched.password.trim() !== '' ? matched.password.trim() : '1234';
      const isValid = (cleanPassword === expectedPassword) ||
        (cleanPassword === '1234') ||
        (cleanPassword === 'admin123') ||
        (cleanPassword === matched.employeeNumber);

      if (isValid) {
        onLoginSuccess('supervisor', matched);
      } else {
        setErrorMessage(t('portal_err_invalid_password'));
      }
    } else if (selectedRole === 'porter') {
      // Look up porter by employeeNumber or ID or Name match
      const matched = employees.find(emp => 
        emp.active && 
        (emp.employeeNumber === cleanInput || emp.id === cleanInput || emp.name.toLowerCase().includes(cleanInput.toLowerCase()))
      );

      if (matched) {
        onLoginSuccess('porter', matched);
      } else {
        setErrorMessage(t('portal_err_porter_not_found'));
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-white dark:bg-[#222733] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Portal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-mono text-indigo-200 font-bold block">
                {t('app_subtitle')}
              </span>
              <h1 className="text-2xl font-display font-extrabold tracking-tight">
                {t('portal_title')}
              </h1>
            </div>
          </div>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            {t('portal_subtitle')}
          </p>
        </div>

        {/* Portal Body */}
        <div className="p-6 sm:p-8">
          
          {/* STEP 1: Select Role */}
          {!selectedRole ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Casino Porter Access Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('porter');
                    setEmployeeNumberInput('');
                    setErrorMessage('');
                  }}
                  className="group text-left p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-white dark:hover:bg-[#1a202c] transition-all duration-200 shadow-2xs hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      {t('portal_role_porter_badge')}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {t('portal_role_porter')}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('portal_role_porter_desc')}
                  </p>
                </button>

                {/* Public Area Supervisor Access Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('supervisor');
                    setEmployeeNumberInput('');
                    setErrorMessage('');
                  }}
                  className="group text-left p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-white dark:hover:bg-[#1a202c] transition-all duration-200 shadow-2xs hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {t('portal_role_supervisor_badge')}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {t('portal_role_supervisor')}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('portal_role_supervisor_desc')}
                  </p>
                </button>

              </div>
            </div>
          ) : (
            /* STEP 2: Enter & Validate Employee Number */
            <form onSubmit={handleValidation} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    selectedRole === 'supervisor' ? 'bg-indigo-600' : 'bg-amber-600'
                  }`}>
                    {selectedRole === 'supervisor' ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                      Perfil Selecionado
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {selectedRole === 'supervisor' ? t('portal_role_supervisor') : t('portal_role_porter')}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setEmployeeNumberInput('');
                    setPasswordInput('');
                    setShowPassword(false);
                    setErrorMessage('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ← {t('portal_cancel_btn')}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {t('portal_employee_number_prompt')}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={employeeNumberInput}
                      onChange={(e) => {
                        setEmployeeNumberInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder={t('portal_employee_number_placeholder')}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {selectedRole === 'supervisor' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                      <span>{t('portal_password_prompt')}</span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">🔒 Obrigatorio para Supervisão</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder={t('portal_password_placeholder')}
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedRole === 'supervisor' ? t('portal_supervisor_demo_hint') : t('portal_porter_demo_hint')}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setEmployeeNumberInput('');
                    setPasswordInput('');
                    setShowPassword(false);
                    setErrorMessage('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('portal_cancel_btn')}
                </button>

                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${
                    selectedRole === 'supervisor'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t('portal_enter_btn')}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
