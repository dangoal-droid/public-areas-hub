import React, { useState } from 'react';
import { useApp, isSystemAdmin } from '../context/AppContext';
import { TaskTemplate, Employee } from '../types';
import { getLocalizedTask, TASK_TRANSLATIONS, getLocalizedFrequency, translateOperationalString } from '../data/taskTranslations';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  RotateCw, 
  Sparkles, 
  Search, 
  HelpCircle,
  X,
  Pencil,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface TasksTabProps {
  currentUser?: Employee;
}

export const TasksTab: React.FC<TasksTabProps> = ({ currentUser }) => {
  const { taskTemplates, environments, addTaskTemplate, updateTaskTemplate, deleteTaskTemplate, deleteTaskTemplates, t, language } = useApp();
  const isAdmin = isSystemAdmin(currentUser);

  // Permission alert modal state
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const checkPermission = (): boolean => {
    if (!isAdmin) {
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  // Selected environment filter for current list view
  const [filterEnvId, setFilterEnvId] = useState('Todos');

  // Create Mode state
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskTemplate | null>(null);
  
  // Custom delete confirmation state
  const [deletingTask, setDeletingTask] = useState<TaskTemplate | null>(null);
  const [deletingBulkType, setDeletingBulkType] = useState<'routine_all' | 'routine_filtered' | 'occasional_all' | null>(null);
  
  // New task inputs state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'routine' | 'occasional'>('routine');
  const [envId, setEnvId] = useState('');
  const [shiftTarget, setShiftTarget] = useState('Todos');
  const [frequency, setFrequency] = useState('Diário');

  // Bullets state
  const [bullets, setBullets] = useState<string[]>([]);
  const [newBulletInput, setNewBulletInput] = useState('');

  // Multi-lingual translations state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<{
    pt: { title: string; description?: string; bullets?: string[] };
    en: { title: string; description?: string; bullets?: string[] };
    es: { title: string; description?: string; bullets?: string[] };
  }>({
    pt: { title: '', description: '', bullets: [] },
    en: { title: '', description: '', bullets: [] },
    es: { title: '', description: '', bullets: [] }
  });

  const triggerAutoTranslation = async () => {
    if (!title.trim()) return;
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: title.trim(), 
          description: description.trim(),
          bullets
        }),
      });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.translations) {
          setTranslations(data.translations);
        }
      }
    } catch (e) {
      console.warn('Translation notice:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleEditClick = async (task: TaskTemplate) => {
    if (!checkPermission()) return;
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setType(task.type);
    setEnvId(task.environmentId || '');
    setShiftTarget(task.shiftTarget || 'Todos');
    setFrequency(task.frequency || (task.type === 'occasional' ? 'Sob Demanda' : 'Diário'));
    setBullets(task.bullets || []);
    setNewBulletInput('');
    
    setIsAdding(true);

    // Set manual translations from existing template if present (and not a fallback), or search dictionary, or fetch on the fly
    const isExistingFallback = !!task.translations && 
      task.translations.pt?.title === task.translations.en?.title && 
      task.translations.es?.title === task.translations.en?.title;

    let initialTranslations = !isExistingFallback ? task.translations : null;

    if (!initialTranslations) {
      // Check static dictionary by ID or by matching title
      let staticMatch = TASK_TRANSLATIONS[task.id];
      if (!staticMatch) {
        const cleanTitle = task.title.trim().toLowerCase();
        const foundKey = Object.keys(TASK_TRANSLATIONS).find(key => {
          const entry = TASK_TRANSLATIONS[key];
          return (
            entry.pt.title.trim().toLowerCase() === cleanTitle ||
            entry.en.title.trim().toLowerCase() === cleanTitle ||
            entry.es.title.trim().toLowerCase() === cleanTitle
          );
        });
        if (foundKey) {
          staticMatch = TASK_TRANSLATIONS[foundKey];
        }
      }
      if (staticMatch) {
        initialTranslations = staticMatch;
      }
    }

    if (initialTranslations) {
      setTranslations({
        pt: { title: initialTranslations.pt.title || '', description: initialTranslations.pt.description || '', bullets: initialTranslations.pt.bullets || [] },
        en: { title: initialTranslations.en.title || '', description: initialTranslations.en.description || '', bullets: initialTranslations.en.bullets || [] },
        es: { title: initialTranslations.es.title || '', description: initialTranslations.es.description || '', bullets: initialTranslations.es.bullets || [] }
      });
    } else {
      // Default to original text
      setTranslations({
        pt: { title: task.title, description: task.description || '', bullets: task.bullets || [] },
        en: { title: task.title, description: task.description || '', bullets: task.bullets || [] },
        es: { title: task.title, description: task.description || '', bullets: task.bullets || [] }
      });

      // Automatically translate on-the-fly in the background to avoid displaying identical strings
      setIsTranslating(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: task.title, description: task.description || '', bullets: task.bullets || [] }),
        });
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.translations) {
            setTranslations(data.translations);
          }
        }
      } catch (e) {
        console.warn('Translation during edit click notice:', e);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setType('routine');
    setEnvId('');
    setShiftTarget('Todos');
    setFrequency('Diário');
    setBullets([]);
    setNewBulletInput('');
    setEditingTask(null);
    setTranslations({
      pt: { title: '', description: '', bullets: [] },
      en: { title: '', description: '', bullets: [] },
      es: { title: '', description: '', bullets: [] }
    });
    setIsAdding(false);
  };

  const handleCreateTaskTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission()) return;
    if (!title.trim()) return;

    setIsTranslating(true);
    let finalTranslations = { ...translations };

    // Automatically call the translate endpoint if the translations fields are empty or untouched or identical, or if bullets are out of sync/untranslated, or if title/description was edited
    const isTranslationsEmpty = !translations.en.title || !translations.es.title || !translations.pt.title;
    const isTranslationsIdentical = translations.pt.title === translations.en.title && translations.es.title === translations.en.title;
    const isBulletsOutOfSync = 
      !translations.pt.bullets || translations.pt.bullets.length !== bullets.length ||
      !translations.en.bullets || translations.en.bullets.length !== bullets.length ||
      !translations.es.bullets || translations.es.bullets.length !== bullets.length;
    
    const areBulletsUntranslated = bullets.length > 0 && (
      !translations.en.bullets ||
      !translations.es.bullets ||
      JSON.stringify(translations.en.bullets) === JSON.stringify(bullets) ||
      JSON.stringify(translations.es.bullets) === JSON.stringify(bullets)
    );

    const isTitleChanged = title.trim() !== (translations.pt.title || '').trim() && 
                           title.trim() !== (translations.en.title || '').trim() && 
                           title.trim() !== (translations.es.title || '').trim();
    const isDescriptionChanged = description.trim() !== (translations.pt.description || '').trim() && 
                                 description.trim() !== (translations.en.description || '').trim() && 
                                 description.trim() !== (translations.es.description || '').trim();
    
    if (isTranslationsEmpty || isTranslationsIdentical || isBulletsOutOfSync || areBulletsUntranslated || isTitleChanged || isDescriptionChanged) {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            title: title.trim(), 
            description: description.trim(),
            bullets
          }),
        });
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.translations) {
            finalTranslations = {
              pt: {
                title: translations.pt.title.trim() || data.translations.pt?.title || title.trim(),
                description: translations.pt.description?.trim() || data.translations.pt?.description || description.trim(),
                bullets: bullets.map((b, idx) => translations.pt.bullets?.[idx]?.trim() || data.translations.pt?.bullets?.[idx] || translateOperationalString(b, 'pt'))
              },
              en: {
                title: translations.en.title.trim() || data.translations.en?.title || title.trim(),
                description: translations.en.description?.trim() || data.translations.en?.description || description.trim(),
                bullets: bullets.map((b, idx) => translations.en.bullets?.[idx]?.trim() || data.translations.en?.bullets?.[idx] || translateOperationalString(b, 'en'))
              },
              es: {
                title: translations.es.title.trim() || data.translations.es?.title || title.trim(),
                description: translations.es.description?.trim() || data.translations.es?.description || description.trim(),
                bullets: bullets.map((b, idx) => translations.es.bullets?.[idx]?.trim() || data.translations.es?.bullets?.[idx] || translateOperationalString(b, 'es'))
              }
            };
          }
        }
      } catch (error) {
        console.warn('Auto translation on save notice:', error);
      }
    }

    // Always ensure finalTranslations has valid non-empty fields
    finalTranslations = {
      pt: {
        title: finalTranslations.pt?.title?.trim() || translateOperationalString(title.trim(), 'pt'),
        description: finalTranslations.pt?.description?.trim() || (description.trim() ? translateOperationalString(description.trim(), 'pt') : ''),
        bullets: bullets.map((b, idx) => finalTranslations.pt?.bullets?.[idx]?.trim() || translateOperationalString(b, 'pt'))
      },
      en: {
        title: finalTranslations.en?.title?.trim() || translateOperationalString(title.trim(), 'en'),
        description: finalTranslations.en?.description?.trim() || (description.trim() ? translateOperationalString(description.trim(), 'en') : ''),
        bullets: bullets.map((b, idx) => finalTranslations.en?.bullets?.[idx]?.trim() || translateOperationalString(b, 'en'))
      },
      es: {
        title: finalTranslations.es?.title?.trim() || translateOperationalString(title.trim(), 'es'),
        description: finalTranslations.es?.description?.trim() || (description.trim() ? translateOperationalString(description.trim(), 'es') : ''),
        bullets: bullets.map((b, idx) => finalTranslations.es?.bullets?.[idx]?.trim() || translateOperationalString(b, 'es'))
      }
    };

    if (!description.trim()) {
      if (finalTranslations.pt) finalTranslations.pt.description = '';
      if (finalTranslations.en) finalTranslations.en.description = '';
      if (finalTranslations.es) finalTranslations.es.description = '';
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      type,
      environmentId: envId || '',
      shiftTarget: shiftTarget || 'Todos',
      frequency: frequency.trim(),
      bullets: bullets.length > 0 ? bullets : [],
      translations: finalTranslations
    };

    if (editingTask) {
      updateTaskTemplate(editingTask.id, taskData);
    } else {
      addTaskTemplate(taskData);
    }

    setIsTranslating(false);
    handleCancel();
  };

  const handleDeleteClick = (task: TaskTemplate) => {
    if (!checkPermission()) return;
    setDeletingTask(task);
  };

  const handleConfirmDeleteTask = () => {
    if (!checkPermission()) return;
    if (deletingTask) {
      deleteTaskTemplate(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleBulkDeleteClick = (type: 'routine_all' | 'routine_filtered' | 'occasional_all') => {
    if (!checkPermission()) return;
    setDeletingBulkType(type);
  };

  const handleConfirmBulkDelete = () => {
    if (!checkPermission()) return;
    if (!deletingBulkType) return;
    
    let targetsToDelete: TaskTemplate[] = [];
    if (deletingBulkType === 'routine_all') {
      targetsToDelete = taskTemplates.filter(t => t.type === 'routine');
    } else if (deletingBulkType === 'routine_filtered') {
      targetsToDelete = taskTemplates.filter(t => t.type === 'routine' && t.environmentId === filterEnvId);
    } else if (deletingBulkType === 'occasional_all') {
      targetsToDelete = taskTemplates.filter(t => t.type === 'occasional');
    }

    const idsToDelete = targetsToDelete.map(t => t.id);
    if (idsToDelete.length > 0) {
      deleteTaskTemplates(idsToDelete);
    }
    setDeletingBulkType(null);
  };

  const handleDeleteDummy = (id: string, name: string) => {
    const confirmMsg = language === 'en'
      ? `Are you sure you want to remove the template "${name}" from the database?`
      : language === 'es'
      ? `¿Está seguro de que desea eliminar la plantilla "${name}" de la base de datos de rutinas?`
      : `Remover o modelo "${name}" do banco de rotinas?`;

    if (confirm(confirmMsg)) {
      deleteTaskTemplate(id);
    }
  };

  // Filter and sort tasks based on Selected Area in numerical order
  const routineTemplates = React.useMemo(() => {
    const filtered = taskTemplates.filter(t => 
      t.type === 'routine' && 
      (filterEnvId === 'Todos' || t.environmentId === filterEnvId)
    );

    const getEnvNumber = (envId?: string) => {
      if (!envId) return 9999;
      const match = envId.match(/\d+/);
      return match ? parseInt(match[0], 10) : 9999;
    };

    const getTaskNumber = (taskId: string) => {
      const match = taskId.match(/\d+/);
      return match ? parseInt(match[0], 10) : 9999;
    };

    return [...filtered].sort((a, b) => {
      const envA = getEnvNumber(a.environmentId);
      const envB = getEnvNumber(b.environmentId);
      if (envA !== envB) {
        return envA - envB;
      }
      return getTaskNumber(a.id) - getTaskNumber(b.id);
    });
  }, [taskTemplates, filterEnvId]);

  const occasionalTemplates = taskTemplates.filter(t => 
    t.type === 'occasional'
  );

  return (
    <div className="space-y-6">
      
      {/* Non-admin read-only banner */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold block">🔒 Modo de Leitura Restrito</span>
            <span>Alterações em modelos e rotinas de tarefas são permitidas exclusivamente para o moderador e administrador do sistema (<strong>Daniel Gomes</strong>).</span>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-slate-900 flex items-center gap-2">
            <RotateCw className="w-6 h-6 text-indigo-600" />
            {t('task_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('task_subtitle')}
          </p>
        </div>

        <button
          onClick={() => {
            if (isAdding) {
              handleCancel();
            } else {
              setIsAdding(true);
            }
          }}
          className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {isAdding 
            ? (language === 'en' ? 'View Routines Bank' : language === 'es' ? 'Ver Biblioteca de Tareas' : 'Ver Banco de Tarefas') 
            : t('task_add_btn')}
        </button>
      </div>

      {isAdding ? (
        /* Create Task Template Form */
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 shadow-xs p-6">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3 mb-5">
            {editingTask 
              ? (language === 'en' ? 'Edit Routine Task' : language === 'es' ? 'Editar Plantilla de Tarea' : 'Editar Modelo de Tarefa') 
              : t('task_new_form')}
          </h2>

          <form onSubmit={handleCreateTaskTemplate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Activity Title / Name *' : language === 'es' ? 'Título/Nombre de la Actividad *' : 'Título/Nome da Atividade *'}</label>
              <input
                type="text"
                required
                maxLength={70}
                placeholder={language === 'en' ? 'Ex: Refill wall-mounted sanitizers and soap dispenser' : language === 'es' ? 'Ej: Reabastecer desinfectantes y dispensador de jabón' : 'Ex: Reabastecer sanitizantes e álcool gel em parede'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('task_descr_lbl')}</label>
              <textarea
                rows={2}
                placeholder={language === 'en' ? 'Ex: Dilute 2 caps of neutral detergent in 2 liters of water in the green bucket...' : language === 'es' ? 'Ej: Diluir 2 tapitas de jabón neutro en 2 litros de agua en el balde verde...' : "Ex: Diluir 2 tampinhas de sabão neutro para 2 litros d'água no balde verde..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none resize-none font-medium"
              ></textarea>
            </div>

            {/* Auto Translate status and action trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/40 rounded-xl p-3 border border-indigo-100/30">
              <span className="text-[11px] text-indigo-900 font-medium leading-relaxed max-w-md">
                {language === 'en' 
                  ? '✨ This task will be automatically translated into English, Portuguese, and Spanish upon saving.' 
                  : language === 'es'
                  ? '✨ Esta tarea se traducirá automáticamente al inglés, portugués y español al guardar.'
                  : '✨ Esta atividade será traduzida automaticamente para inglês, português e espanhol ao salvar.'}
              </span>
              <button
                type="button"
                disabled={isTranslating || !title.trim()}
                onClick={triggerAutoTranslation}
                className="text-[11px] font-bold text-indigo-700 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors disabled:opacity-50 cursor-pointer shadow-3xs flex-shrink-0"
              >
                {isTranslating 
                  ? (language === 'en' ? 'Translating...' : language === 'es' ? 'Traduciendo...' : 'Traduzindo...') 
                  : (language === 'en' ? '✨ Preview Translations' : language === 'es' ? '✨ Previsualizar Traducciones' : '✨ Pré-visualizar Traduções')}
              </button>
            </div>

            {/* Collapsible Manual Translations Input Fields */}
            <details className="group border border-slate-150 rounded-xl bg-slate-50/20 p-3.5 text-xs">
              <summary className="font-bold text-slate-700 cursor-pointer flex items-center justify-between list-none select-none">
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-mono">
                  <span>⚙️</span>
                  {language === 'en' ? 'Edit Manual Translations (Optional)' : language === 'es' ? 'Editar Traducciones Manuales (Opcional)' : 'Editar Traduções Manuais (Opcional)'}
                </span>
                <span className="transition-transform group-open:rotate-180 text-slate-400 font-mono text-[9px]">▼</span>
              </summary>
              <div className="mt-3 space-y-3.5 pt-3.5 border-t border-slate-100">
                {/* PT */}
                <div className="p-3 bg-white border border-slate-100 rounded-lg space-y-2 shadow-3xs">
                  <span className="font-bold text-[9px] text-emerald-600 uppercase font-mono tracking-wider flex items-center gap-1">🇧🇷 Português (pt)</span>
                  <input
                    type="text"
                    placeholder="Título da Atividade (Português)"
                    value={translations.pt.title}
                    onChange={(e) => setTranslations(prev => ({ ...prev, pt: { ...prev.pt, title: e.target.value } }))}
                    className="w-full text-[11px] bg-slate-50 border border-slate-150 focus:border-indigo-400 rounded-md p-2 outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Descrição da Atividade (Português)"
                    value={translations.pt.description || ''}
                    onChange={(e) => setTranslations(prev => ({ ...prev, pt: { ...prev.pt, description: e.target.value } }))}
                    className="w-full text-[11px] bg-slate-50 border border-slate-150 focus:border-indigo-400 rounded-md p-2 outline-none font-medium"
                  />
                  {bullets.length > 0 && (
                    <div className="pt-1.5 space-y-2 border-t border-slate-100 mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Sub-tarefas (pt):</span>
                      {bullets.map((bullet, idx) => (
                        <div key={idx} className="flex flex-col gap-1 pl-2 border-l-2 border-emerald-300">
                          <span className="text-[9px] text-slate-400 font-medium">Sub-tarefa {idx + 1}: {bullet}</span>
                          <input
                            type="text"
                            placeholder="Tradução da sub-tarefa (pt)"
                            value={translations.pt.bullets?.[idx] || ''}
                            onChange={(e) => {
                              const newBullets = [...(translations.pt.bullets || [])];
                              for (let i = 0; i <= idx; i++) {
                                if (newBullets[i] === undefined) {
                                  newBullets[i] = bullets[i] || '';
                                }
                              }
                              newBullets[idx] = e.target.value;
                              setTranslations(prev => ({
                                ...prev,
                                pt: { ...prev.pt, bullets: newBullets }
                              }));
                            }}
                            className="w-full text-[10px] bg-slate-50 border border-slate-150 rounded-md p-1.5 outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* EN */}
                <div className="p-3 bg-white border border-slate-100 rounded-lg space-y-2 shadow-3xs">
                  <span className="font-bold text-[9px] text-indigo-600 uppercase font-mono tracking-wider flex items-center gap-1">🇺🇸 English (en)</span>
                  <input
                    type="text"
                    placeholder="Activity Title (English)"
                    value={translations.en.title}
                    onChange={(e) => setTranslations(prev => ({ ...prev, en: { ...prev.en, title: e.target.value } }))}
                    className="w-full text-[11px] bg-slate-50 border border-slate-155 focus:border-indigo-400 rounded-md p-2 outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Activity Description (English)"
                    value={translations.en.description || ''}
                    onChange={(e) => setTranslations(prev => ({ ...prev, en: { ...prev.en, description: e.target.value } }))}
                    className="w-full text-[11px] bg-slate-50 border border-slate-155 focus:border-indigo-400 rounded-md p-2 outline-none font-medium"
                  />
                  {bullets.length > 0 && (
                    <div className="pt-1.5 space-y-2 border-t border-slate-100 mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Sub-tasks (en):</span>
                      {bullets.map((bullet, idx) => (
                        <div key={idx} className="flex flex-col gap-1 pl-2 border-l-2 border-indigo-300">
                          <span className="text-[9px] text-slate-400 font-medium">Sub-task {idx + 1}: {bullet}</span>
                          <input
                            type="text"
                            placeholder="Sub-task translation (en)"
                            value={translations.en.bullets?.[idx] || ''}
                            onChange={(e) => {
                              const newBullets = [...(translations.en.bullets || [])];
                              for (let i = 0; i <= idx; i++) {
                                if (newBullets[i] === undefined) {
                                  newBullets[i] = bullets[i] || '';
                                }
                              }
                              newBullets[idx] = e.target.value;
                              setTranslations(prev => ({
                                ...prev,
                                en: { ...prev.en, bullets: newBullets }
                              }));
                            }}
                            className="w-full text-[10px] bg-slate-50 border border-slate-150 rounded-md p-1.5 outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ES */}
                <div className="p-3 bg-white border border-slate-100 rounded-lg space-y-2 shadow-3xs">
                  <span className="font-bold text-[9px] text-amber-600 uppercase font-mono tracking-wider flex items-center gap-1">🇪🇸 Español (es)</span>
                  <input
                    type="text"
                    placeholder="Título de la Actividad (Español)"
                    value={translations.es.title}
                    onChange={(e) => setTranslations(prev => ({ ...prev, es: { ...prev.es, title: e.target.value } }))}
                    className="w-full text-[11px] bg-slate-50 border border-slate-150 focus:border-indigo-400 rounded-md p-2 outline-none font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Descripción de la Actividad (Español)"
                    value={translations.es.description || ''}
                    onChange={(e) => setTranslations(prev => ({ ...prev, es: { ...prev.es, description: e.target.value } }))}
                    className="w-full text-[11px] bg-slate-50 border border-slate-150 focus:border-indigo-400 rounded-md p-2 outline-none font-medium"
                  />
                  {bullets.length > 0 && (
                    <div className="pt-1.5 space-y-2 border-t border-slate-100 mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Sub-tareas (es):</span>
                      {bullets.map((bullet, idx) => (
                        <div key={idx} className="flex flex-col gap-1 pl-2 border-l-2 border-amber-300">
                          <span className="text-[9px] text-slate-400 font-medium">Sub-tarea {idx + 1}: {bullet}</span>
                          <input
                            type="text"
                            placeholder="Traducción de la sub-tarea (es)"
                            value={translations.es.bullets?.[idx] || ''}
                            onChange={(e) => {
                              const newBullets = [...(translations.es.bullets || [])];
                              for (let i = 0; i <= idx; i++) {
                                if (newBullets[i] === undefined) {
                                  newBullets[i] = bullets[i] || '';
                                }
                              }
                              newBullets[idx] = e.target.value;
                              setTranslations(prev => ({
                                ...prev,
                                es: { ...prev.es, bullets: newBullets }
                              }));
                            }}
                            className="w-full text-[10px] bg-slate-50 border border-slate-150 rounded-md p-1.5 outline-none font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </details>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Activity Type *' : language === 'es' ? 'Tipo de Actividad *' : 'Tipo de Atividade *'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('routine')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      type === 'routine' 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" /> {language === 'en' ? 'Routine (Recurrent)' : language === 'es' ? 'Rutina (Recurrente)' : 'Rotina (Recorrente)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType('occasional');
                      if (frequency === 'Diário') setFrequency('Sob Demanda');
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      type === 'occasional' 
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {language === 'en' ? 'Occasional (Special)' : language === 'es' ? 'Eventual (Eventual)' : 'Eventual (Manual)'}
                  </button>
                </div>
              </div>

              {/* Environment target selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('task_target_env_lbl')}</label>
                <select
                  value={envId}
                  onChange={(e) => setEnvId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                >
                  <option value="">{language === 'en' ? '-- Any Environment (General) --' : language === 'es' ? '-- Cualquier Ambiente (General) --' : '-- Qualquer Ambiente (Geral) --'}</option>
                  {environments.map(env => (
                    <option key={env.id} value={env.id}>{env.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shift filter of priority template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Target Work Shift *' : language === 'es' ? 'Turno de Trabajo Objetivo *' : 'Turno Prioritário *'}</label>
                <select
                  value={shiftTarget}
                  onChange={(e) => setShiftTarget(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                >
                  <option value="Todos">{language === 'en' ? 'Applicable to Any Shift (All)' : language === 'es' ? 'Apto para Cualquier Turno (Todos)' : 'Apto a Qualquer Turno (Todos)'}</option>
                  <option value="Day Shift (7:00 AM - 3:00 PM)">Day Shift (7:00 AM - 3:00 PM)</option>
                  <option value="Mid Shift (11:00 AM - 7:00 PM)">Mid Shift (11:00 AM - 7:00 PM)</option>
                  <option value="Swing Shift (3:00 PM - 11:00 PM)">Swing Shift (3:00 PM - 11:00 PM)</option>
                  <option value="Graveyard Shift (11:00 PM - 7:00 AM)">Graveyard Shift (11:00 PM - 7:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Estimated Operational Frequency' : language === 'es' ? 'Frecuencia de Ejecución Estimada' : 'Frequência Estimada de Execução'}</label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Ex: Every 2 hours, Daily at 10:00 AM' : language === 'es' ? 'Ej: Cada 2 horas, Diario a las 10:00hs' : 'Ex: De 2 em 2 horas, Diário às 10h'}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[
                    { label: language === 'en' ? 'Daily' : language === 'es' ? 'Diario' : 'Diário', val: 'Diário' },
                    { label: language === 'en' ? 'Every other day' : language === 'es' ? 'Un día sí, un día no' : 'Dia sim, dia não', val: 'Dia sim, dia não' },
                    { label: language === 'en' ? 'Every 2 hours' : language === 'es' ? 'Cada 2 horas' : 'A cada 2 horas', val: 'A cada 2 horas' },
                    { label: language === 'en' ? 'Every 3 hours' : language === 'es' ? 'Cada 3 horas' : 'A cada 3 horas', val: 'A cada 3 horas' },
                    { label: language === 'en' ? '2 times min/shift' : language === 'es' ? 'Mín. 2 veces/turno' : 'Mín. 2 vezes/turno', val: 'Mínimo 2 vezes por turno' },
                    { label: language === 'en' ? '3 times min/shift' : language === 'es' ? 'Mín. 3 veces/turno' : 'Mín. 3 vezes/turno', val: 'Mínimo 3 vezes por turno' },
                    { label: language === 'en' ? 'Twice per shift' : language === 'es' ? 'Dos veces por turno' : 'Duas vezes por turno', val: 'Duas vezes por turno' },
                    { label: language === 'en' ? 'Once per shift' : language === 'es' ? 'Una vez por turno' : 'Uma vez por turno', val: 'Uma vez por turno' },
                    { label: language === 'en' ? 'Wed through Sun' : language === 'es' ? 'Miércoles a Domingo' : 'Quarta a Domingo', val: 'Quarta a Domingo' },
                    { label: language === 'en' ? 'Hourly' : language === 'es' ? 'Cada hora' : 'De hora em hora', val: 'De hora em hora' },
                    { label: language === 'en' ? 'On-demand' : language === 'es' ? 'Bajo Demanda' : 'Sob Demanda', val: 'Sob Demanda' },
                    { label: language === 'en' ? 'Weekly' : language === 'es' ? 'Semanal' : 'Semanal', val: 'Semanal' },
                    { label: language === 'en' ? 'Biweekly' : language === 'es' ? 'Quincenal' : 'Quinzenal', val: 'Quinzenal' },
                    { label: language === 'en' ? 'Monthly' : language === 'es' ? 'Mensual' : 'Mensal', val: 'Mensal' },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => setFrequency(chip.val)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        frequency === chip.val
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Routine / Occasional Bullets (Sub-tasks) Dynamic Tags Builder */}
            {(type === 'routine' || type === 'occasional') && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">
                    {type === 'routine'
                      ? (language === 'en' ? 'Routine Bullets (Sub-tasks / Specific Checklist Items)' : language === 'es' ? 'Viñetas de la Rutina (Sub-tareas / Ítems de Control Específicos)' : 'Sub-tarefas da Rotina (Bullets / Itens de Verificação)')
                      : (language === 'en' ? 'Occasional Bullets (Sub-tasks / Specific Checklist Items)' : language === 'es' ? 'Viñetas de la Tarea Eventual (Sub-tareas / Ítems de Control Específicos)' : 'Sub-tarefas da Tarefa Eventual (Bullets / Itens de Verificação)')}
                  </label>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                    {type === 'routine'
                      ? (language === 'en' ? 'Add specific steps or checklist items for this routine to allow granular selection when generating checklists.' : language === 'es' ? 'Añada pasos o controles específicos para esta rutina para permitir una selección granular al generar checklists.' : 'Adicione passos ou itens específicos para esta rotina para permitir a seleção granular ao gerar checklists.')
                      : (language === 'en' ? 'Add specific steps or checklist items for this occasional task to allow granular selection when generating checklists.' : language === 'es' ? 'Añada pasos o controles específicos para esta tarea eventual para permitir una selección granular al generar checklists.' : 'Adicione passos ou itens específicos para esta tarefa eventual para permitir a seleção granular ao gerar checklists.')}
                  </p>
                </div>

                {/* Tag creation input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Ex: Wash glass mirror' : language === 'es' ? 'Ej: Limpiar espejo de vidro' : 'Ex: Limpar espelho de vidro'}
                    value={newBulletInput}
                    onChange={(e) => setNewBulletInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const cleanText = newBulletInput.trim();
                        if (cleanText) {
                          if (!bullets.includes(cleanText)) {
                            setBullets(prev => {
                              const updated = [...prev, cleanText];
                              setTranslations(tPrev => ({
                                pt: { ...tPrev.pt, bullets: [...(tPrev.pt.bullets || []), cleanText] },
                                en: { ...tPrev.en, bullets: [...(tPrev.en.bullets || []), translateOperationalString(cleanText, 'en')] },
                                es: { ...tPrev.es, bullets: [...(tPrev.es.bullets || []), translateOperationalString(cleanText, 'es')] }
                              }));
                              return updated;
                            });
                          }
                          setNewBulletInput('');
                        }
                      }
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const cleanText = newBulletInput.trim();
                      if (cleanText) {
                        if (!bullets.includes(cleanText)) {
                          setBullets(prev => {
                            const updated = [...prev, cleanText];
                            setTranslations(tPrev => ({
                              pt: { ...tPrev.pt, bullets: [...(tPrev.pt.bullets || []), cleanText] },
                              en: { ...tPrev.en, bullets: [...(tPrev.en.bullets || []), translateOperationalString(cleanText, 'en')] },
                              es: { ...tPrev.es, bullets: [...(tPrev.es.bullets || []), translateOperationalString(cleanText, 'es')] }
                            }));
                            return updated;
                          });
                        }
                        setNewBulletInput('');
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Bullets List tags */}
                {bullets.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50/50 rounded-lg border border-slate-150">
                    {bullets.map((bullet, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-1 rounded-md text-[10px] font-semibold"
                      >
                        {bullet}
                        <button
                          type="button"
                          onClick={() => {
                            setBullets(prev => {
                              const updated = prev.filter((_, i) => i !== index);
                              setTranslations(tPrev => ({
                                pt: { ...tPrev.pt, bullets: (tPrev.pt.bullets || []).filter((_, i) => i !== index) },
                                en: { ...tPrev.en, bullets: (tPrev.en.bullets || []).filter((_, i) => i !== index) },
                                es: { ...tPrev.es, bullets: (tPrev.es.bullets || []).filter((_, i) => i !== index) }
                              }));
                              return updated;
                            });
                          }}
                          className="hover:text-red-500 hover:bg-indigo-100/50 p-0.5 rounded-sm shrink-0 transition-colors cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-slate-100 pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold p-3 rounded-lg transition-transform active:scale-99 cursor-pointer"
              >
                {editingTask
                  ? (language === 'en' ? 'Save Changes' : language === 'es' ? 'Guardar Cambios' : 'Salvar Alterações')
                  : (language === 'en' ? 'Save to Database' : language === 'es' ? 'Registrar en base de datos' : 'Incluir no Banco de Dados')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-105 hover:bg-slate-205 text-slate-700 text-xs font-semibold px-4 rounded-lg cursor-pointer"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Dual views split columns (Routine left, Occasional right) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column A: Routine recurrent tasks mapping */}
          <div className="bg-white rounded-xl border border-slate-105 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse-subtle"></span>
                  {language === 'en' ? 'Recurrent Routine Tasks' : language === 'es' ? 'Tareas de Rutina Recurrentes' : 'Tarefas de Rotina Recorrentes'} ({routineTemplates.length})
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{language === 'en' ? 'Loaded automatically when selecting corresponding workspace sector.' : language === 'es' ? 'Se cargan automáticamente al seleccionar el sector correspondiente.' : 'Disparadas automaticamente ao selecionar o setor correspondente.'}</p>
              </div>

              {/* Environment Filter Selector */}
              <select
                value={filterEnvId}
                onChange={(e) => setFilterEnvId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-505"
              >
                <option value="Todos">{language === 'en' ? 'All Environments' : language === 'es' ? 'Todos los Ambientes' : 'Todos os Ambientes'}</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>
            </div>

            {/* Action buttons for group deletion */}
            {taskTemplates.filter(t => t.type === 'routine').length > 0 && (
              <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 pl-1">
                  {language === 'en' ? 'Bulk Actions:' : language === 'es' ? 'Acciones en Grupo:' : 'Ações em Lote:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {/* Delete entire group of routines */}
                  <button
                    type="button"
                    onClick={() => handleBulkDeleteClick('routine_all')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-650 hover:text-red-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-3xs"
                    title={language === 'en' ? 'Delete all recurrent routine tasks' : language === 'es' ? 'Eliminar todas las tareas de rutina' : 'Excluir todas as tarefas de rotina'}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    {language === 'en' ? 'Delete All' : language === 'es' ? 'Eliminar Todo' : 'Excluir Tudo'}
                  </button>

                  {/* Delete only the items in the current filtered subcategory (environment) */}
                  {filterEnvId !== 'Todos' && routineTemplates.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleBulkDeleteClick('routine_filtered')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-850 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-3xs"
                      title={language === 'en' ? 'Delete templates in this sub-category/environment' : language === 'es' ? 'Eliminar plantillas de esta subcategoría' : 'Excluir modelos deste setor/ambiente selecionado'}
                    >
                      <Trash2 className="w-3 h-3 text-amber-600" />
                      {language === 'en' ? 'Delete Filtered Category' : language === 'es' ? 'Excluir Subcategoría' : 'Excluir Subcategoria'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {routineTemplates.length === 0 ? (
              <div className="text-center py-10 text-slate-400 italic text-xs">
                {language === 'en' ? 'No routine tasks found for this selected environment.' : language === 'es' ? 'Ninguna tarea de rutina encontrada para el ambiente seleccionado.' : 'Nenhuma tarefa de rotina encontrada para o ambiente selecionado.'}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {routineTemplates.map((template) => {
                  const localizedTemplate = getLocalizedTask(template, language);
                  const correlatedEnv = environments.find(e => e.id === template.environmentId);
                  return (
                    <div key={template.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg space-y-2 relative group flex items-start justify-between gap-2">
                      <div className="space-y-1 pr-4">
                        <span className="text-slate-800 text-xs font-semibold block leading-tight">{localizedTemplate.title}</span>
                        {localizedTemplate.description && (
                          <p className="text-[11px] text-slate-400 font-normal leading-relaxed">{localizedTemplate.description}</p>
                        )}
                        {/* Bullets Sub-tasks List in Card */}
                        {localizedTemplate.bullets && localizedTemplate.bullets.length > 0 && (
                          <div className="mt-2 pl-3 border-l-2 border-indigo-200 space-y-1">
                            {localizedTemplate.bullets.map((b, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></span>
                                <span className="truncate">{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1 font-medium">
                          {correlatedEnv && (
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100/30 flex items-center gap-0.5 font-medium">
                              <MapPin className="w-2.5 h-2.5" /> {correlatedEnv.name}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono font-medium">
                            {language === 'en' ? 'Freq:' : language === 'es' ? 'Frec:' : 'Freq:'} {getLocalizedFrequency(template.frequency || '', language) || (language === 'en' ? 'Continuous' : language === 'es' ? 'Continua' : 'Contínua')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditClick(template)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={language === 'en' ? 'Edit Routine' : language === 'es' ? 'Editar Rutina' : 'Editar Rotina'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(template)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={language === 'en' ? 'Delete Routine' : language === 'es' ? 'Eliminar Rutina' : 'Excluir Rotina'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column B: Occasional / Special Template Libraries */}
          <div className="bg-white rounded-xl border border-slate-105 shadow-2xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse-subtle"></span>
                {language === 'en' ? 'Occasional / On-Demand Tasks' : language === 'es' ? 'Biblioteca de Tareas Eventuales' : 'Biblioteca de Tarefas Eventuais'} ({occasionalTemplates.length})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{language === 'en' ? 'Allows manual on-the-fly selection while spawning operational checklists.' : language === 'es' ? 'Permite seleccionarlas manualmente de forma rápida al crear checklists.' : 'Selecione-as manualmente de forma rápida ao criar checklists.'}</p>
            </div>

            {/* Action buttons for group deletion of occasional tasks */}
            {taskTemplates.filter(t => t.type === 'occasional').length > 0 && (
              <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 pl-1">
                  {language === 'en' ? 'Bulk Actions:' : language === 'es' ? 'Acciones en Grupo:' : 'Ações em Lote:'}
                </span>
                <button
                  type="button"
                  onClick={() => handleBulkDeleteClick('occasional_all')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-650 hover:text-red-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-3xs"
                  title={language === 'en' ? 'Delete all occasional/on-demand templates' : language === 'es' ? 'Eliminar todas las tareas eventuales' : 'Excluir todas as tarefas eventuais'}
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                  {language === 'en' ? 'Delete All' : language === 'es' ? 'Eliminar Todo' : 'Excluir Tudo'}
                </button>
              </div>
            )}

            {occasionalTemplates.length === 0 ? (
              <div className="text-center py-10 text-slate-400 italic text-xs">
                {language === 'en' ? 'No occasional tasks registered in database.' : language === 'es' ? 'Ninguna tarea eventual registrada en la base de datos.' : 'Nenhuma tarefa eventual cadastrada no banco.'}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {occasionalTemplates.map((template) => {
                  const localizedTemplate = getLocalizedTask(template, language);
                  const correlatedEnv = environments.find(e => e.id === template.environmentId);
                  return (
                    <div key={template.id} className="p-3 bg-amber-50/10 border border-amber-100/60 rounded-lg space-y-2 relative group flex items-start justify-between gap-2">
                      <div className="space-y-1 pr-4">
                        <span className="text-slate-800 text-xs font-semibold block leading-tight">{localizedTemplate.title}</span>
                        {localizedTemplate.description && (
                          <p className="text-[11px] text-slate-450 font-normal leading-relaxed">{localizedTemplate.description}</p>
                        )}
                        {/* Bullets Sub-tasks List in Card */}
                        {localizedTemplate.bullets && localizedTemplate.bullets.length > 0 && (
                          <div className="mt-2 pl-3 border-l-2 border-amber-200 space-y-1">
                            {localizedTemplate.bullets.map((b, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                                <span className="truncate">{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 pt-1 font-medium select-none">
                          {correlatedEnv && (
                            <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100/40">
                              {language === 'en' ? 'Focus: ' : language === 'es' ? 'Enfoque: ' : 'Foco: '}{correlatedEnv.name}
                            </span>
                          )}
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                            {getLocalizedFrequency(template.frequency || 'Sob Demanda', language)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditClick(template)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={language === 'en' ? 'Edit Occasional' : language === 'es' ? 'Editar Eventual' : 'Editar Eventual'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(template)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={language === 'en' ? 'Delete Occasional' : language === 'es' ? 'Eliminar Eventual' : 'Excluir Eventual'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-905/40 backdrop-blur-xs"
            onClick={() => setDeletingTask(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setDeletingTask(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                {language === 'en' ? 'Confirm Deletion' : language === 'es' ? 'Confirmar Eliminación' : 'Confirmar Exclusão'}
              </h3>
              
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'en' 
                  ? `Are you sure you want to permanently remove custom routine template "${deletingTask.title}"? This action cannot be undone.`
                  : language === 'es'
                  ? `¿Está seguro de que deseja eliminar permanentemente la plantilla de rutina "${deletingTask.title}"? Esta acción no se puede deshacer.`
                  : `Tem certeza de que deseja remover permanentemente o modelo de rotina "${deletingTask.title}"? Esta ação não poderá ser desfeita.`}
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingTask(null)}
                  className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteTask}
                  className="w-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all active:scale-99 cursor-pointer"
                >
                  {language === 'en' ? 'Delete' : language === 'es' ? 'Eliminar' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Bulk Delete Confirmation Modal */}
      {deletingBulkType && (() => {
        const selectedEnvName = environments.find(e => e.id === filterEnvId)?.name || '';
        const getBulkDeleteDetails = () => {
          if (deletingBulkType === 'routine_all') {
            return {
              title: language === 'en' 
                ? 'Confirm Deleting All Routines' 
                : language === 'es' 
                ? 'Confirmar Eliminación Completa' 
                : 'Confirmar Exclusão Completa',
              msg: language === 'en'
                ? 'Are you sure you want to permanently delete ALL recurrent routine tasks? This cannot be undone and will empty the default task repository.'
                : language === 'es'
                ? '¿Está seguro de que desea eliminar permanentemente TODAS las tareas de rutina recurrentes? Esta acción vaciará el repositorio predeterminado.'
                : 'Tem certeza de que deseja excluir permanentemente TODAS as tarefas de rotina recorrentes? Esta ação esvaziará o banco padrão de rotinas.'
            };
          }
          if (deletingBulkType === 'routine_filtered') {
            return {
              title: language === 'en' 
                ? 'Confirm Sub-Category Deletion' 
                : language === 'es' 
                ? 'Confirmar Eliminación de Subcategoría' 
                : 'Confirmar Exclusão de Subcategoria',
              msg: language === 'en'
                ? `Are you sure you want to permanently delete all recurrent routine tasks for the "${selectedEnvName}" environment?`
                : language === 'es'
                ? `¿Está seguro de que desea eliminar permanentemente todas las tareas de rutina recurrentes de la subcategoría "${selectedEnvName}"?`
                : `Tem certeza de que deseja excluir permanentemente todas as tarefas de rotina recorrentes do setor/ambiente "${selectedEnvName}"?`
            };
          }
          return {
            title: language === 'en' 
              ? 'Confirm Deleting All Occasional Tasks' 
              : language === 'es' 
              ? 'Confirmar Eliminación de Eventuales' 
              : 'Confirmar Exclusão de Eventuais',
            msg: language === 'en'
              ? 'Are you sure you want to permanently delete ALL occasional/on-demand templates? This action cannot be undone.'
              : language === 'es'
              ? '¿Está seguro de que deseja eliminar permanentemente TODAS las plantillas eventuales? Esta acción no se puede deshacer.'
              : 'Tem certeza de que deseja excluir permanentemente TODOS os modelos de tarefas eventuais? Esta ação não poderá ser desfeita.'
          };
        };

        const details = getBulkDeleteDetails();

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-905/40 backdrop-blur-xs"
              onClick={() => setDeletingBulkType(null)}
            ></div>
            
            <div className="relative bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setDeletingBulkType(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl mb-4">
                  <Trash2 className="w-6 h-6 animate-bounce-subtle" />
                </div>
                
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  {details.title}
                </h3>
                
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {details.msg}
                </p>
                
                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  <button
                    type="button"
                    onClick={() => setDeletingBulkType(null)}
                    className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBulkDelete}
                    className="w-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all active:scale-99 cursor-pointer"
                  >
                    {language === 'en' ? 'Delete' : language === 'es' ? 'Eliminar' : 'Excluir'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Permission Denied Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#222733] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Acesso Restrito ao Administrador</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Permissão negada. Somente o funcionário <strong>Daniel Gomes</strong> (Moderador & Administrador do Sistema) tem autorização para incluir, alterar ou excluir rotinas e modelos de tarefas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPermissionModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
