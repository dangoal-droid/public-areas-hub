import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  getLocalizedEnvironmentName, 
  getLocalizedRole, 
  getLocalizedShift, 
  getLocalizedCoverageTime,
  compareEnvironmentsNumerically,
  sortEnvironmentNameString
} from '../data/taskTranslations';
import { 
  Users, 
  MapPin, 
  ListTodo, 
  Radio, 
  Key, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DashboardTabProps {
  onNavigateToTab: (tab: string) => void;
  onSelectChecklist: (checklistId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigateToTab, onSelectChecklist }) => {
  const { checklists, employees, environments, taskTemplates, resetToFactorySettings, language, t } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Get current date string
  const todayStr = new Date().toISOString().split('T')[0];
  const langLocaleMap: Record<string, string> = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES'
  };
  const activeLocale = langLocaleMap[language] || 'pt-BR';
  const formattedToday = new Date().toLocaleDateString(activeLocale, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Today's checklists
  const todayChecklists = checklists.filter(c => c.date === todayStr);

  // Metrics
  const totalChecklistsCount = todayChecklists.length;
  const completedChecklistsCount = todayChecklists.filter(c => c.status === 'completed').length;
  const inProgressChecklistsCount = todayChecklists.filter(c => c.status === 'in_progress').length;
  const pendingChecklistsCount = todayChecklists.filter(c => c.status === 'pending').length;

  const totalTasksCount = todayChecklists.reduce((acc, c) => acc + c.tasks.length, 0);
  const completedTasksCount = todayChecklists.reduce((acc, c) => acc + c.tasks.filter(t => t.completed).length, 0);
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Track checked-out gear based on active/pending/completed checklists today
  const activeRadios = todayChecklists
    .filter(c => c.radioNumber && c.radioNumber !== 'N/A' && c.radioNumber !== '-')
    .map(c => ({ number: c.radioNumber, name: c.employeeName }));
  
  const activeKeys = todayChecklists
    .filter(c => c.keyNumber && c.keyNumber !== 'N/A' && c.keyNumber !== '-')
    .map(c => ({ number: c.keyNumber, name: c.employeeName }));

  const activeCarts = todayChecklists
    .filter(c => c.cartNumber && c.cartNumber !== 'N/A' && c.cartNumber !== '-')
    .map(c => ({ number: c.cartNumber, name: c.employeeName }));

  const handleResetData = () => {
    resetToFactorySettings();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-sm">
        <div>
          <span className="text-slate-400 text-xs font-mono tracking-wider uppercase">{t('dash_operations_panel')}</span>
          <h1 className="text-2xl font-sans font-bold tracking-tight mt-1">{t('dash_hello')}</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {t('dash_welcome')}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
          <Calendar className="w-5 h-5 text-indigo-300" />
          <div className="text-left">
            <div className="text-xs text-slate-400 font-mono">{t('dash_today_date')}</div>
            <div className="text-sm font-semibold capitalize">{formattedToday}</div>
          </div>
        </div>
      </div>

      {/* Numerical Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{t('dash_checklists_today')}</span>
            <div className="text-3xl font-sans font-bold text-slate-900 mt-1">{totalChecklistsCount}</div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-600 font-semibold">{completedChecklistsCount}</span> {t('dash_completed')} • <span className="text-amber-600 font-semibold">{inProgressChecklistsCount}</span> {t('dash_active')}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
            <ListTodo className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{t('dash_task_efficiency')}</span>
            <div className="text-3xl font-sans font-bold text-slate-900 mt-1">{taskCompletionRate}%</div>
            <div className="text-xs text-slate-400 mt-1">
              {t('dash_completion_rate')}
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{t('dash_equipment_in_use')}</span>
            <div className="text-3xl font-sans font-bold text-slate-900 mt-1">
              H: {activeRadios.length} • K: {activeKeys.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {t('dash_gear_sub')}
            </div>
          </div>
          <div className="p-3 bg-cyan-50 rounded-lg text-cyan-600">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{t('emp_list_title')}</span>
            <div className="text-3xl font-sans font-bold text-slate-900 mt-1">{employees.length}</div>
            <div className="text-xs text-slate-400 mt-1">
              {t('dash_active_operation')}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist Progress & Gear Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (2/3): Today's Duty List and Coverage Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-sans font-bold text-slate-900">{t('dash_day_schedules')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t('dash_break_schedule_updated')}</p>
              </div>
              <button
                onClick={() => onNavigateToTab('new-checklist')}
                className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-lg transition-transform active:scale-95 shadow-2xs"
              >
                {t('tab_new_checklist')}
              </button>
            </div>

            {todayChecklists.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">{t('dash_no_checklists')}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {language === 'en' ? 'No checklists have been generated for today yet. Start by generating one.' : language === 'es' ? 'Aún no se ha generado ninguna lista para hoy. Empiece por crear una.' : 'Ainda não foram gerados checklists para a data de hoje. Clique no botão acima para iniciar o expediente.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100 font-mono">
                    <tr>
                      <th className="py-3 px-4">{language === 'en' ? 'Employee / Role' : language === 'es' ? 'Empleado / Rol' : 'Funcionário / Função'}</th>
                      <th className="py-3 px-4">{t('dash_shift')}</th>
                      <th className="py-3 px-4">{language === 'en' ? 'Assigned Area' : language === 'es' ? 'Área Asignada' : 'Área Designada'}</th>
                      <th className="py-3 px-4">{t('dash_break')}</th>
                      <th className="py-3 px-4">{language === 'en' ? 'Coverage Details' : language === 'es' ? 'Detalles Cobertura' : 'Horário Cobertura'}</th>
                      <th className="py-3 px-4 text-center">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...todayChecklists].sort((a, b) => {
                      const envA = sortEnvironmentNameString(getLocalizedEnvironmentName(a.environmentName, language));
                      const envB = sortEnvironmentNameString(getLocalizedEnvironmentName(b.environmentName, language));
                      const envCompare = compareEnvironmentsNumerically(envA, envB);
                      if (envCompare !== 0) return envCompare;
                      return a.employeeName.localeCompare(b.employeeName);
                    }).map((ch) => (
                      <tr 
                        key={ch.id} 
                        className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                        onClick={() => {
                          onSelectChecklist(ch.id);
                          onNavigateToTab('checklists');
                        }}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600">{ch.employeeName}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{getLocalizedRole(ch.employeeRole, language)}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                          {getLocalizedShift(ch.shift, language).split(' ')[0]}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            {getLocalizedEnvironmentName(sortEnvironmentNameString(ch.environmentName), language)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-mono">
                          <span className="bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-md border border-amber-100">
                            {ch.intervalTime || (language === 'en' ? 'Not set' : language === 'es' ? 'Sin programar' : 'Não marcado')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {ch.coverageTime && getLocalizedCoverageTime(ch.coverageTime, language) !== 'Nenhum' && getLocalizedCoverageTime(ch.coverageTime, language) !== 'Ninguno' && getLocalizedCoverageTime(ch.coverageTime, language) !== 'None' && ch.coverageTime !== '-' ? (
                            <span className="bg-indigo-50 text-indigo-800 font-medium px-2 py-0.5 rounded-md border border-indigo-100 block truncate max-w-[150px]">
                              {getLocalizedCoverageTime(ch.coverageTime, language)}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">{language === 'en' ? 'No coverage' : language === 'es' ? 'Sin cobertura' : 'Sem cobertura'}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {ch.status === 'completed' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                              {language === 'en' ? 'Completed' : language === 'es' ? 'Completado' : 'Concluído'}
                            </span>
                          )}
                          {ch.status === 'in_progress' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 animate-pulse">
                              {language === 'en' ? 'In progress' : language === 'es' ? 'En curso' : 'Em andamento'}
                            </span>
                          )}
                          {ch.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                              {language === 'en' ? 'Pending' : language === 'es' ? 'Pendiente' : 'Pendente'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Quick Setup Map Helper Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-lg text-slate-700 h-fit">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{t('tab_environments')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {language === 'en' 
                    ? 'Want to map out restrooms, offices, entries or garage levels? Go to the Environments tab to registry layout areas.' 
                    : language === 'es' 
                    ? '¿Quiere mapear baños, oficinas, entradas o plantas de garaje? Vaya a la pestaña de Ambientes para registrar áreas.' 
                    : 'Deseja mapear novos banheiros, escritórios, guaras ou garagens corporativas? Vá para a aba Ambientes para catalogar as sub-áreas.'}
                </p>
                <button 
                  onClick={() => onNavigateToTab('environments')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-2 flex items-center gap-1 group"
                >
                  {language === 'en' ? 'Manage environments' : language === 'es' ? 'Gestionar ambientes' : 'Modelar Mapas'} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl flex gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-lg text-slate-700 h-fit">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{t('tab_tasks')}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {language === 'en' 
                    ? 'Design active standard tasks per shift and set default checklist question guides to make assignment straightforward.' 
                    : language === 'es' 
                    ? 'Diseñe tareas estándar periódicas por turno y configure preguntas predeterminadas de chequeo para agilizar.' 
                    : 'Cadastre tarefas recorrentes por turnos de trabalho e configure tarefas padrão para fácil inclusão.'}
                </p>
                <button 
                  onClick={() => onNavigateToTab('tasks')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-2 flex items-center gap-1 group"
                >
                  {language === 'en' ? 'Manage tasks' : language === 'es' ? 'Gestionar rutinas' : 'Biblioteca de Rotinas'} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (1/3): Carts, Radios, Keys Checkout State */}
        <div className="space-y-6">
          
          {/* Radio / Keys / Carts Allocation Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 font-mono mb-4">
              {language === 'en' ? 'Equipment Custody Log' : language === 'es' ? 'Equipos Bajo Custodia' : 'Equipamentos Sob Custódia'}
            </h3>
            
            <div className="space-y-4">
              {/* Radios list */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {language === 'en' ? 'Active Radios' : language === 'es' ? 'Radios Activos' : 'Rádios Ativos'}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full font-mono text-slate-500">
                    {activeRadios.length}
                  </span>
                </div>
                {activeRadios.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pl-6">
                    {language === 'en' ? 'No radios checked out today.' : language === 'es' ? 'Ningún radio registrado hoy.' : 'Nenhum rádio retirado hoje.'}
                  </p>
                ) : (
                  <div className="space-y-1.5 pl-6 max-h-[120px] overflow-y-auto">
                    {activeRadios.map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
                        <span className="font-semibold text-slate-800">{t('dash_radio')} {r.number}</span>
                        <span className="text-slate-500 truncate max-w-[120px]">{r.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Keys list */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {language === 'en' ? 'Keys in Use' : language === 'es' ? 'Llaves en Uso' : 'Chaves em Uso'}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full font-mono text-slate-500">
                    {activeKeys.length}
                  </span>
                </div>
                {activeKeys.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pl-6">
                    {language === 'en' ? 'No keys checked out.' : language === 'es' ? 'Ninguna llave registrada.' : 'Nenhuma chave em uso.'}
                  </p>
                ) : (
                  <div className="space-y-1.5 pl-6 max-h-[120px] overflow-y-auto">
                    {activeKeys.map((k, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
                        <span className="font-semibold text-slate-800">{language === 'en' ? 'Code' : language === 'es' ? 'Código' : 'Cód.'} {k.number}</span>
                        <span className="text-slate-500 truncate max-w-[120px]">{k.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Carts list */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {language === 'en' ? 'Cleaning Carts' : language === 'es' ? 'Kits / Carros de Limpieza' : 'Kits / Carros de Limpeza'}
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full font-mono text-slate-500">
                    {activeCarts.length}
                  </span>
                </div>
                {activeCarts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pl-6">
                    {language === 'en' ? 'No carts checked out.' : language === 'es' ? 'Ningún carro registrado.' : 'Nenhum veículo em andamento.'}
                  </p>
                ) : (
                  <div className="space-y-1.5 pl-6 max-h-[120px] overflow-y-auto">
                    {activeCarts.map((c, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100">
                        <span className="font-semibold text-slate-800">{t('dash_cart')} {c.number}</span>
                        <span className="text-slate-500 truncate max-w-[120px]">{c.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tutorial / Status Information */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-5 rounded-xl border border-indigo-100 text-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 font-mono">
                {language === 'en' ? 'Guidelines' : language === 'es' ? 'Pautas Clave' : 'Boas Práticas'}
              </span>
            </div>
            <ul className="text-xs space-y-2 text-indigo-950/80 pl-4 list-disc leading-relaxed">
              {language === 'en' ? (
                <>
                  <li>Assign each radio uniquely in the daily checklist to avoid signal overlaps on shift channels.</li>
                  <li>Team backup coverage ensures that critical facilities (canteens, restrooms) never stay unstaffed during meal recesses.</li>
                  <li>To export or print copies, select the official sheet view action under the Checklists area.</li>
                </>
              ) : language === 'es' ? (
                <>
                  <li>Asocie cada canal de radio de forma única para evitar solapamientos en las frecuencias laborales.</li>
                  <li>La cobertura entre colegas garantiza que zonas críticas (baños, comedores) permanezcan atendidas en horas de almuerzo/cena.</li>
                  <li>Para exportar de forma impresa, seleccione la visualización del formulario en la pestaña de checklists.</li>
                </>
              ) : (
                <>
                  <li>Associe cada rádio de forma única no checklist diário para evitar interferência na frequência de trabalho.</li>
                  <li>A cobertura de colegas assegura que nenhuma área crítica (como banheiros e refeitórios) fique sem supervisão durante a hora de almoço.</li>
                  <li>Para imprimir ou exportar uma folha física, selecione a opção de impressão no checklist selecionado na aba "Checklists".</li>
                </>
              )}
            </ul>
          </div>

          {/* Reset settings */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'Local Database' : language === 'es' ? 'Base de Datos Local' : 'Banco de Dados Local'}
              </div>
              <div className="text-[11px] text-slate-400">
                {language === 'en' ? 'Reset framework status back to demonstration sandboxed values.' : language === 'es' ? 'Restablecer el sistema con datos iniciales de demostración.' : 'Restaurar registros padrão de demonstração.'}
              </div>
            </div>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap"
              >
                {language === 'en' ? 'Reset Data' : language === 'es' ? 'Restablecer' : 'Resetar Dados'}
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={handleResetData}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-2 py-1 rounded"
                >
                  {language === 'en' ? 'Yes' : language === 'es' ? 'Síd' : 'Sim'}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded"
                >
                  {language === 'en' ? 'No' : language === 'es' ? 'No' : 'Não'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
