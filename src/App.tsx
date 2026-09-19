/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp, isSystemAdmin } from './context/AppContext';
import { DashboardTab } from './components/DashboardTab';
import { ChecklistCreatorTab } from './components/ChecklistCreatorTab';
import { ChecklistTrackerTab } from './components/ChecklistTrackerTab';
import { EmployeesTab } from './components/EmployeesTab';
import { EnvironmentsTab } from './components/EnvironmentsTab';
import { TasksTab } from './components/TasksTab';
import { ScheduleTab } from './components/ScheduleTab';
import { AccessPortal } from './components/AccessPortal';
import { Employee } from './types';
import { 
  ClipboardCheck, 
  LayoutDashboard, 
  Layers, 
  MapPin, 
  Users, 
  PlusCircle, 
  CheckSquare, 
  RotateCw,
  Sparkles,
  Calendar,
  Eye,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

type ThemeMode = 'soft' | 'light' | 'dark-soft';

interface AuthSession {
  role: 'supervisor' | 'porter';
  employee: Employee;
}

function AppContent() {
  const { language, setLanguage, t, loading, checklists } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>('');
  
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('gestao_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('gestao_theme_mode') as ThemeMode) || 'soft';
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('gestao_theme_mode', mode);
  };

  useEffect(() => {
    document.documentElement.classList.remove('theme-dark-soft', 'theme-light', 'theme-soft');
    document.body.classList.remove('theme-dark-soft', 'theme-light', 'theme-soft');
    if (themeMode === 'dark-soft') {
      document.documentElement.classList.add('theme-dark-soft');
      document.body.classList.add('theme-dark-soft');
    } else if (themeMode === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
    } else {
      document.documentElement.classList.add('theme-soft');
      document.body.classList.add('theme-soft');
    }
  }, [themeMode]);

  const handleLoginSuccess = (role: 'supervisor' | 'porter', employee: Employee) => {
    const session: AuthSession = { role, employee };
    setAuthSession(session);
    localStorage.setItem('gestao_auth_session', JSON.stringify(session));

    if (role === 'porter') {
      setActiveTab('checklists');
      // Auto-select checklist if available for this porter
      const porterChecklist = checklists.find(c => 
        c.employeeId === employee.id || 
        c.employeeName.toLowerCase().includes(employee.name.toLowerCase())
      );
      if (porterChecklist) {
        setSelectedChecklistId(porterChecklist.id);
      }
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem('gestao_auth_session');
  };

  const navigateToTab = (tab: string) => {
    if (authSession?.role === 'porter' && tab !== 'checklists') {
      // Porter is restricted only to checklists tab
      setActiveTab('checklists');
      return;
    }
    setActiveTab(tab);
  };

  const handleSelectChecklistFromOutside = (id: string) => {
    setSelectedChecklistId(id);
    setActiveTab('checklists');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-xl max-w-sm mx-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {language === 'en' ? 'Synchronizing workspace...' : language === 'es' ? 'Sincronizando espacio de trabajo...' : 'Sincronizando espaço de trabalho...'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'en' ? 'Loading real-time data' : language === 'es' ? 'Cargando datos en tiempo real' : 'Carregando dados em tempo real'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab 
            onNavigateToTab={navigateToTab} 
            onSelectChecklist={handleSelectChecklistFromOutside} 
          />
        );
      case 'new-checklist':
        return <ChecklistCreatorTab onSuccessNavigate={() => setActiveTab('checklists')} />;
      case 'checklists':
        return (
          <ChecklistTrackerTab 
            selectedChecklistId={selectedChecklistId} 
            onClearSelectedChecklist={() => setSelectedChecklistId('')}
            onSelectChecklist={(id) => setSelectedChecklistId(id)}
            onNavigateToTab={navigateToTab}
          />
        );
      case 'employees':
        return <EmployeesTab currentUser={authSession?.employee} />;
      case 'environments':
        return <EnvironmentsTab currentUser={authSession?.employee} />;
      case 'tasks':
        return <TasksTab currentUser={authSession?.employee} />;
      case 'schedule':
        return <ScheduleTab currentUser={authSession?.employee} />;
      default:
        return <DashboardTab onNavigateToTab={navigateToTab} onSelectChecklist={handleSelectChecklistFromOutside} />;
    }
  };

  return (
    <div className={`min-h-screen theme-${themeMode} flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800 transition-colors duration-200`}>
      
      {/* Upper Navigation Header (hidden when print!) */}
      <header className="print:hidden bg-white/95 dark:bg-[#222733] border-b border-slate-200/80 dark:border-slate-700/60 sticky top-0 z-50 shadow-2xs backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Header Row: Branding + User Badge + Theme & Language Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-100/80 dark:border-slate-800/80">
            
            {/* Branding Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xs">
                <ClipboardCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="text-sm font-display font-bold text-slate-900 dark:text-slate-100 tracking-tight block">
                  {t('app_title')}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide font-mono block">
                  {t('app_subtitle')}
                </span>
              </div>
            </div>

            {/* Right Controls Container */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              
              {/* Operational Status (hidden on small screens) */}
              <div className="hidden xl:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">{t('status_operational')}</span>
              </div>

              {/* Authenticated User Badge */}
              {authSession && (
                <div className="flex items-center gap-2 bg-slate-100/90 dark:bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-slate-250 dark:border-slate-700 shadow-2xs">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-2xs ${
                    isSystemAdmin(authSession.employee) ? 'bg-indigo-700 ring-2 ring-indigo-400' : authSession.role === 'supervisor' ? 'bg-indigo-600' : 'bg-amber-600'
                  }`}>
                    {isSystemAdmin(authSession.employee) ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> : authSession.role === 'supervisor' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate max-w-[120px]">
                      {authSession.employee.name}
                    </span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider block ${
                      isSystemAdmin(authSession.employee) ? 'text-indigo-600 dark:text-indigo-400' : authSession.role === 'supervisor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {isSystemAdmin(authSession.employee) ? 'Admin' : authSession.role === 'supervisor' ? 'Supervisor' : 'Casino Porter'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title={t('portal_switch_user')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Theme Switcher */}
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs" title={t('reading_mode')}>
                <button
                  onClick={() => setThemeMode('soft')}
                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    themeMode === 'soft' 
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  title={t('theme_soft')}
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">{language === 'pt' ? 'Suave' : language === 'es' ? 'Suave' : 'Soft'}</span>
                </button>

                <button
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    themeMode === 'light' 
                      ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  title={t('theme_light')}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{language === 'pt' ? 'Claro' : language === 'es' ? 'Claro' : 'Light'}</span>
                </button>

                <button
                  onClick={() => setThemeMode('dark-soft')}
                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    themeMode === 'dark-soft' 
                      ? 'bg-slate-900 text-indigo-300 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                  title={t('theme_dark_soft')}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">{language === 'pt' ? 'Grafite' : language === 'es' ? 'Grafito' : 'Slate'}</span>
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-[10px] px-2 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={`text-[10px] px-2 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    language === 'es' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Español"
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage('pt')}
                  className={`text-[10px] px-2 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    language === 'pt' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Português"
                >
                  PT
                </button>
              </div>

            </div>

          </div>

          {/* Navigation Tabs Bar - Responsive Flex Wrap without Horizontal Scrolling */}
          {authSession && (
            <nav className="py-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {authSession.role === 'supervisor' && (
                <>
                  <button
                    onClick={() => navigateToTab('dashboard')}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'dashboard' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{t('tab_dashboard')}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('schedule')}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'schedule' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('tab_weekly_schedule')}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('new-checklist')}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'new-checklist' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t('tab_new_checklist')}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => navigateToTab('checklists')}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'checklists' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{t('tab_checklists')}</span>
              </button>

              {authSession.role === 'supervisor' && (
                <>
                  <button
                    onClick={() => navigateToTab('employees')}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'employees' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t('tab_employees')}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('environments')}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'environments' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t('tab_environments')}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('tasks')}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'tasks' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{t('tab_tasks')}</span>
                  </button>
                </>
              )}
            </nav>
          )}

        </div>
      </header>

      {/* Primary Workstation layout content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!authSession ? (
          <AccessPortal onLoginSuccess={handleLoginSuccess} />
        ) : (
          renderActiveTabContent()
        )}
      </main>

      {/* Humble simple minimalist Footer (hidden when print!) */}
      <footer className="print:hidden bg-white/80 dark:bg-[#222733] border-t border-slate-200/80 dark:border-slate-700/60 py-5 mt-auto text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t('footer_text')}</span>
          <span className="font-mono">{t('footer_subtitle')}</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
