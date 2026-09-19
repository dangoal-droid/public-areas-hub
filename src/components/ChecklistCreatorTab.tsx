import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChecklistTask, DailyChecklist, Employee, TaskTemplate, WeeklySchedule, WorkEnvironment } from '../types';
import { getLocalizedTask, TASK_TRANSLATIONS, groupChecklistTasks, getLocalizedFrequency, getLocalizedEnvironmentName, translateOperationalString, compareEnvironmentsNumerically } from '../data/taskTranslations';
import { 
  ClipboardList, 
  User, 
  MapPin, 
  Clock, 
  Radio, 
  Key, 
  ShoppingCart, 
  Calendar, 
  Plus, 
  Check, 
  Trash2, 
  HelpCircle,
  AlertCircle,
  Zap,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Layers,
  Bot
} from 'lucide-react';

// Helper to determine weekday field name
const getDayOfWeekName = (dateString: string): keyof Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'> => {
  const d = new Date(dateString + 'T12:00:00');
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mapping: Array<keyof Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'>> = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday' // default fallback mapping
  ];
  return mapping[day] || 'monday';
};

interface ChecklistCreatorTabProps {
  onSuccessNavigate: () => void;
}

export const ChecklistCreatorTab: React.FC<ChecklistCreatorTabProps> = ({ onSuccessNavigate }) => {
  const { employees, environments, taskTemplates, addChecklist, addChecklistsBatch, customShifts, t, language, schedules, checklists } = useApp();

  // Date State (declared first so subsequent hooks can access it)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Continuous Automation State
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoGenSuccessMessage, setAutoGenSuccessMessage] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(() => {
    return localStorage.getItem('gestao_auto_sync_enabled') !== 'false';
  });

  const toggleAutoSync = () => {
    setAutoSyncEnabled(prev => {
      const next = !prev;
      localStorage.setItem('gestao_auto_sync_enabled', String(next));
      return next;
    });
  };

  // Helper to determine active day of the week
  const dayOfWeek = React.useMemo(() => getDayOfWeekName(date), [date]);

  // Filter out any employees of category/role containing 'Supervisor'
  const activePorters = React.useMemo(() => {
    return employees.filter(emp => {
      const roleLower = (emp.role || '').toLowerCase();
      return !roleLower.includes('supervisor');
    });
  }, [employees]);

  // Get all scheduled porters for the selected date
  const scheduledPortersOfToday = React.useMemo(() => {
    return activePorters.filter(emp => {
      if (!emp.active) return false;
      const empSched = schedules.find(s => s.employeeId === emp.id);
      const todayShift = empSched ? empSched[dayOfWeek] : emp.shift;
      return todayShift && todayShift !== 'FOLGA' && todayShift !== 'OFF';
    });
  }, [activePorters, schedules, dayOfWeek]);

  // Existing checklists for the selected date
  const existingChecklistsForDate = React.useMemo(() => {
    return checklists.filter(c => c.date === date);
  }, [checklists, date]);

  // Scheduled employees missing a checklist for the selected date
  const pendingEmployeesForDate = React.useMemo(() => {
    const existingEmpIds = new Set(existingChecklistsForDate.map(c => c.employeeId));
    return scheduledPortersOfToday.filter(emp => !existingEmpIds.has(emp.id));
  }, [scheduledPortersOfToday, existingChecklistsForDate]);

  // Calculate date 7 days prior
  const getPrevWeekDateStr = (targetDateStr: string) => {
    const d = new Date(targetDateStr + 'T12:00:00');
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  };

  // Helper to build default tasks for an employee if no previous checklist history exists
  const buildDefaultTasksForEmployee = (emp: Employee) => {
    const routineTasks = taskTemplates.filter(t => t.type === 'routine');
    const genderFiltered = filterTasksByGender(routineTasks, emp.gender);

    const mappedTasks: ChecklistTask[] = [];
    genderFiltered.forEach(t => {
      if (t.bullets && t.bullets.length > 0) {
        t.bullets.forEach((bullet, bulletIdx) => {
          const transSource = (t.translations || TASK_TRANSLATIONS[t.id]) as any;
          mappedTasks.push({
            id: `${t.id}-bullet-${bulletIdx}`,
            title: `${t.title} - ${bullet}`,
            description: t.description,
            completed: false,
            frequency: t.frequency,
            translations: transSource ? {
              pt: {
                title: `${transSource.pt?.title || translateOperationalString(t.title, 'pt')} - ${transSource.pt?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'pt')}`,
                description: transSource.pt?.description
              },
              en: {
                title: `${transSource.en?.title || translateOperationalString(t.title, 'en')} - ${transSource.en?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'en')}`,
                description: transSource.en?.description
              },
              es: {
                title: `${transSource.es?.title || translateOperationalString(t.title, 'es')} - ${transSource.es?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'es')}`,
                description: transSource.es?.description
              }
            } : undefined
          });
        });
      } else {
        mappedTasks.push({
          id: t.id,
          title: t.title,
          description: t.description,
          completed: false,
          frequency: t.frequency,
          translations: t.translations || TASK_TRANSLATIONS[t.id]
        });
      }
    });

    return mappedTasks;
  };

  // Auto-Generate Checklists logic based on previous week or active schedule
  const handleAutoGenerateChecklists = async () => {
    if (pendingEmployeesForDate.length === 0) return;
    setIsAutoGenerating(true);
    setAutoGenSuccessMessage('');

    try {
      const prevWeekDateStr = getPrevWeekDateStr(date);
      const newChecklists: Array<Omit<DailyChecklist, 'id'>> = [];

      for (const emp of pendingEmployeesForDate) {
        const empSched = schedules.find(s => s.employeeId === emp.id);
        const activeShift = (empSched ? empSched[dayOfWeek] : emp.shift) || emp.shift;

        // 1. Look for previous week's checklist on exact same weekday (7 days prior)
        let prevChecklist = checklists.find(c => c.employeeId === emp.id && c.date === prevWeekDateStr);

        // 2. Fallback: most recent previous checklist for this employee on the same weekday
        if (!prevChecklist) {
          const empHistory = checklists
            .filter(c => c.employeeId === emp.id && c.date < date)
            .sort((a, b) => b.date.localeCompare(a.date));
          
          prevChecklist = empHistory.find(c => getDayOfWeekName(c.date) === dayOfWeek) || empHistory[0];
        }

        if (prevChecklist) {
          // Clone previous checklist baseline with completed reset to false
          const clonedTasks: ChecklistTask[] = prevChecklist.tasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            completed: false,
            isCustomOccasional: t.isCustomOccasional,
            translations: t.translations
          }));

          newChecklists.push({
            employeeId: emp.id,
            employeeName: emp.name,
            employeeRole: prevChecklist.employeeRole || emp.role,
            shift: activeShift,
            date: date,
            intervalTime: prevChecklist.intervalTime || '11:00 AM - 12:00 PM',
            coverageTime: prevChecklist.coverageTime || (language === 'en' ? 'None' : language === 'es' ? 'Ninguno' : 'Nenhum'),
            cartNumber: (prevChecklist.cartNumber && prevChecklist.cartNumber !== 'N/A' ? prevChecklist.cartNumber : '') || (emp.defaultCartNumber && emp.defaultCartNumber !== 'N/A' ? emp.defaultCartNumber : ''),
            radioNumber: (prevChecklist.radioNumber && prevChecklist.radioNumber !== 'N/A' ? prevChecklist.radioNumber : '') || (emp.defaultRadioNumber && emp.defaultRadioNumber !== 'N/A' ? emp.defaultRadioNumber : ''),
            keyNumber: (prevChecklist.keyNumber && prevChecklist.keyNumber !== 'N/A' ? prevChecklist.keyNumber : '') || (emp.defaultKeyNumber && emp.defaultKeyNumber !== 'N/A' ? emp.defaultKeyNumber : ''),
            environmentId: prevChecklist.environmentId || environments.map(e => e.id).join(','),
            environmentName: prevChecklist.environmentName || environments.map(e => e.name).join(', '),
            tasks: clonedTasks,
            status: 'pending',
            notes: ''
          });
        } else {
          // Default baseline for employee without previous history
          const defaultTasks = buildDefaultTasksForEmployee(emp);
          const allEnvIds = environments.map(e => e.id).join(',');
          const allEnvNames = environments.map(e => e.name).join(', ');

          let defaultInterval = '11:00 AM - 12:00 PM';
          let defaultCoverage = language === 'en' ? 'None' : language === 'es' ? 'Ninguno' : 'Nenhum';
          const lowerShift = activeShift.toLowerCase();
          if (lowerShift.includes('tarde') || lowerShift.includes('swing') || lowerShift.includes('afternoon')) {
            defaultInterval = '06:00 PM - 07:00 PM';
          } else if (lowerShift.includes('noite') || lowerShift.includes('night') || lowerShift.includes('madrugada')) {
            defaultInterval = '01:00 AM - 02:00 AM';
          } else if (lowerShift.includes('mid') || lowerShift.includes('intermediario')) {
            defaultInterval = '02:00 PM - 03:00 PM';
          }

          newChecklists.push({
            employeeId: emp.id,
            employeeName: emp.name,
            employeeRole: emp.role,
            shift: activeShift,
            date: date,
            intervalTime: defaultInterval,
            coverageTime: defaultCoverage,
            cartNumber: (emp.defaultCartNumber && emp.defaultCartNumber !== 'N/A' ? emp.defaultCartNumber : ''),
            radioNumber: (emp.defaultRadioNumber && emp.defaultRadioNumber !== 'N/A' ? emp.defaultRadioNumber : ''),
            keyNumber: (emp.defaultKeyNumber && emp.defaultKeyNumber !== 'N/A' ? emp.defaultKeyNumber : ''),
            environmentId: allEnvIds,
            environmentName: allEnvNames,
            tasks: defaultTasks,
            status: 'pending',
            notes: ''
          });
        }
      }

      if (newChecklists.length > 0) {
        if (addChecklistsBatch) {
          await addChecklistsBatch(newChecklists);
        } else {
          for (const ch of newChecklists) {
            addChecklist(ch);
          }
        }

        const count = newChecklists.length;
        setAutoGenSuccessMessage(
          language === 'en'
            ? `🎉 Successfully auto-generated ${count} daily checklist(s) for ${date} based on previous week baseline!`
            : language === 'es'
            ? `🎉 ¡Se auto-generaron con éxito ${count} checklist(s) diario(s) para el ${date} basados en la semana anterior!`
            : `🎉 ${count} checklist(s) diário(s) gerado(s) com sucesso para ${date} com base na semana anterior!`
        );
      }
    } catch (err) {
      console.error('Error auto-generating checklists:', err);
      setErrorAlert(language === 'en' ? 'Failed to auto-generate checklists.' : language === 'es' ? 'Error al auto-generar los checklists.' : 'Falha ao auto-gerar os checklists.');
    } finally {
      setIsAutoGenerating(false);
    }
  };

  // Check if all scheduled porters of today have the same gender
  const allScheduledPortersHaveSameGender = React.useMemo(() => {
    if (scheduledPortersOfToday.length === 0) return false;
    const genders = scheduledPortersOfToday
      .map(emp => (emp.gender || '').toLowerCase())
      .filter(g => g === 'feminino' || g === 'female' || g === 'masculino' || g === 'male');
    
    if (genders.length === 0) return false;
    
    // Check if every gender in the array is identical to the first one
    const firstGender = genders[0];
    return genders.every(g => g === firstGender);
  }, [scheduledPortersOfToday]);

  // Selected Employee
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Selected Employee Object & Gender
  const selectedEmployee = React.useMemo(() => {
    return employees.find(e => e.id === selectedEmployeeId);
  }, [employees, selectedEmployeeId]);

  const employeeGender = selectedEmployee?.gender;

  // Helpers to filter subareas and tasks based on gender
  const hasMaleIndicators = (text: string): boolean => {
    const lower = text.toLowerCase();
    const maleRegex = /\b(masculino|masculina|male|masc|homem|homens|men|gents|gentlemen)\b/i;
    if (maleRegex.test(lower)) return true;
    const singleMRegex = /\b(m)\b/i;
    if (singleMRegex.test(lower)) return true;
    return false;
  };

  const hasFemaleIndicators = (text: string): boolean => {
    const lower = text.toLowerCase();
    const femaleRegex = /\b(feminino|feminina|female|fem|mulher|mulheres|women|ladies)\b/i;
    if (femaleRegex.test(lower)) return true;
    const singleFRegex = /\b(f)\b/i;
    if (singleFRegex.test(lower)) return true;
    return false;
  };

  const filterSubAreasByGender = (subAreas: string[], gender?: string): string[] => {
    if (!gender || allScheduledPortersHaveSameGender) return subAreas;
    const isFemale = gender.toLowerCase() === 'feminino' || gender.toLowerCase() === 'female';
    const isMale = gender.toLowerCase() === 'masculino' || gender.toLowerCase() === 'male';

    return subAreas.filter(subArea => {
      const hasMaleTerm = hasMaleIndicators(subArea);
      const hasFemaleTerm = hasFemaleIndicators(subArea);

      if (isFemale && hasMaleTerm && !hasFemaleTerm) {
        return false;
      }
      if (isMale && hasFemaleTerm && !hasMaleTerm) {
        return false;
      }
      return true;
    });
  };

  const filterTasksByGender = (tasks: TaskTemplate[], gender?: string): TaskTemplate[] => {
    if (!gender || allScheduledPortersHaveSameGender) return tasks;
    const isFemale = gender.toLowerCase() === 'feminino' || gender.toLowerCase() === 'female';
    const isMale = gender.toLowerCase() === 'masculino' || gender.toLowerCase() === 'male';

    return tasks.filter(task => {
      const hasMaleTerm = hasMaleIndicators(task.title) || hasMaleIndicators(task.description || '');
      const hasFemaleTerm = hasFemaleIndicators(task.title) || hasFemaleIndicators(task.description || '');

      if (isFemale && hasMaleTerm && !hasFemaleTerm) {
        return false;
      }
      if (isMale && hasFemaleTerm && !hasMaleTerm) {
        return false;
      }
      return true;
    });
  };
  
  // Custom states that auto-populate but can be edited
  const [shift, setShift] = useState('');
  const [role, setRole] = useState('');
  const [cartNumber, setCartNumber] = useState('');
  const [radioNumber, setRadioNumber] = useState('');
  const [keyNumber, setKeyNumber] = useState('');
  
  // Custom manual entries
  const [intervalTime, setIntervalTime] = useState('');
  const [coverageTime, setCoverageTime] = useState('');
  const [selectedEnvironmentIds, setSelectedEnvironmentIds] = useState<string[]>([]);
  const [selectedSubAreas, setSelectedSubAreas] = useState<Record<string, string[]>>({});
  const [selectedBullets, setSelectedBullets] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');

  // Helper to filter tasks by unchecked sub-areas
  const filterTasksByUncheckedSubAreas = (
    tasks: TaskTemplate[], 
    selectedSub: Record<string, string[]>, 
    envs: WorkEnvironment[]
  ): TaskTemplate[] => {
    return tasks.filter(task => {
      if (!task.environmentId) return true;
      const env = envs.find(e => e.id === task.environmentId);
      if (!env) return true;

      // Find sub-areas of this environment that are NOT selected
      const allSubsForThisEnv = filterSubAreasByGender(env.subAreas, employeeGender);
      const selectedSubsForThisEnv = selectedSub[env.id] || [];
      const uncheckedSubs = allSubsForThisEnv.filter(sub => !selectedSubsForThisEnv.includes(sub));

      // If any unchecked sub-area is explicitly mentioned in the task title/description, filter it out
      for (const uncheckedSub of uncheckedSubs) {
        const uncheckedLower = uncheckedSub.toLowerCase();
        const taskTitleLower = task.title.toLowerCase();
        const taskDescLower = (task.description || '').toLowerCase();

        // Exact substring match
        if (taskTitleLower.includes(uncheckedLower) || taskDescLower.includes(uncheckedLower)) {
          return false;
        }

        // Handle common shorthand cases (e.g. "Banheiro Masc", "Sanitário Fem")
        if (uncheckedLower.includes('masculino') || uncheckedLower.includes('masculina')) {
          if (taskTitleLower.includes('masculino') || taskTitleLower.includes('masculina') || taskTitleLower.includes('masc')) {
            return false;
          }
        }
        if (uncheckedLower.includes('feminino') || uncheckedLower.includes('feminina')) {
          if (taskTitleLower.includes('feminino') || taskTitleLower.includes('feminina') || taskTitleLower.includes('fem')) {
            return false;
          }
        }
      }

      return true;
    });
  };

  // Memoized filtered routines with bullets for selection
  const activeRoutinesWithBullets = React.useMemo(() => {
    const routineTasks = taskTemplates.filter(
      t => t.type === 'routine' && t.environmentId && selectedEnvironmentIds.includes(t.environmentId)
    );
    const genderFiltered = filterTasksByGender(routineTasks, employeeGender);
    const finalFiltered = filterTasksByUncheckedSubAreas(genderFiltered, selectedSubAreas, environments);
    return finalFiltered.filter(t => t.bullets && t.bullets.length > 0);
  }, [selectedEnvironmentIds, selectedSubAreas, taskTemplates, employeeGender, environments]);

  // Synchronize and initialize selectedSubAreas whenever selected environments, gender, or schedule rules change
  useEffect(() => {
    setSelectedSubAreas(prev => {
      const next = { ...prev };
      let updated = false;

      // 1. Remove any keys for environments that are no longer selected
      Object.keys(next).forEach(envId => {
        if (!selectedEnvironmentIds.includes(envId)) {
          delete next[envId];
          updated = true;
        }
      });

      // 2. For all currently selected environments, make sure they have a state.
      // If they don't, initialize with all their filtered sub-areas.
      selectedEnvironmentIds.forEach(envId => {
        const env = environments.find(e => e.id === envId);
        if (env) {
          const validSubAreas = filterSubAreasByGender(env.subAreas, employeeGender);
          if (!next[envId]) {
            next[envId] = validSubAreas;
            updated = true;
          } else {
            // Also sanitize existing selection: keep only valid sub-areas after gender filter
            const filteredSelection = next[envId].filter(sub => validSubAreas.includes(sub));
            if (filteredSelection.length !== next[envId].length) {
              next[envId] = filteredSelection;
              updated = true;
            }
          }
        }
      });

      return updated ? next : prev;
    });
  }, [selectedEnvironmentIds, employeeGender, allScheduledPortersHaveSameGender, environments]);

  // Initialize selectedBullets state for newly loaded routine templates
  useEffect(() => {
    if (selectedEnvironmentIds.length === 0) {
      setSelectedBullets({});
      return;
    }

    const routineTasks = taskTemplates.filter(
      t => t.type === 'routine' && t.environmentId && selectedEnvironmentIds.includes(t.environmentId)
    );
    const genderFiltered = filterTasksByGender(routineTasks, employeeGender);
    const finalFiltered = filterTasksByUncheckedSubAreas(genderFiltered, selectedSubAreas, environments);

    setSelectedBullets(prev => {
      const next = { ...prev };
      let changed = false;

      // Clean up deleted or unselected routine templates
      const activeIds = new Set(finalFiltered.map(t => t.id));
      Object.keys(next).forEach(id => {
        if (!activeIds.has(id)) {
          delete next[id];
          changed = true;
        }
      });

      // Add new routine templates
      finalFiltered.forEach(t => {
        if (t.bullets && t.bullets.length > 0 && !next[t.id]) {
          next[t.id] = t.bullets;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [selectedEnvironmentIds, selectedSubAreas, taskTemplates, employeeGender, environments]);

  // Handle toggling specific subarea checkbox/pill
  const handleToggleSubArea = (envId: string, subArea: string) => {
    setSelectedSubAreas(prev => {
      const currentList = prev[envId] || [];
      const isSelected = currentList.includes(subArea);
      const nextList = isSelected
        ? currentList.filter(s => s !== subArea)
        : [...currentList, subArea];
      return {
        ...prev,
        [envId]: nextList
      };
    });
  };

  // Handle toggling workspace environments
  const handleToggleEnvironment = (envId: string) => {
    setSelectedEnvironmentIds(prev =>
      prev.includes(envId)
        ? prev.filter(id => id !== envId)
        : [...prev, envId]
    );
  };

  // Selected tasks for today's checklist
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>([]);
  
  // Temporary custom task being drafted on the spot
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskDesc, setCustomTaskDesc] = useState('');

  // UI Error alert
  const [errorAlert, setErrorAlert] = useState('');

  // Auto-populate when employee selection changes
  useEffect(() => {
    if (!selectedEmployeeId) return;
    const emp = employees.find(e => e.id === selectedEmployeeId);
    if (emp) {
      // Find what shift this employee is scheduled for today in the weekly schedule
      const dayOfWeek = getDayOfWeekName(date);
      const empSched = schedules.find(s => s.employeeId === selectedEmployeeId);
      const scheduledShift = empSched ? empSched[dayOfWeek] : emp.shift;
      
      const activeShift = scheduledShift || emp.shift;
      
      setShift(activeShift);
      setRole(emp.role);
      setCartNumber(emp.defaultCartNumber && emp.defaultCartNumber !== 'N/A' ? emp.defaultCartNumber : '');
      setRadioNumber(emp.defaultRadioNumber && emp.defaultRadioNumber !== 'N/A' ? emp.defaultRadioNumber : '');
      setKeyNumber(emp.defaultKeyNumber && emp.defaultKeyNumber !== 'N/A' ? emp.defaultKeyNumber : '');
      
      // Guess standard interval based on activeShift
      const isMorning = activeShift.includes('Manhã') || activeShift.toLowerCase().includes('morn') || activeShift.toLowerCase().includes('mañ') || activeShift.toLowerCase().includes('dia') || activeShift.toLowerCase().includes('day');
      const isAfternoon = activeShift.includes('Tarde') || activeShift.toLowerCase().includes('after') || activeShift.toLowerCase().includes('tard') || activeShift.toLowerCase().includes('swing');
      const isNight = activeShift.includes('Noite') || activeShift.toLowerCase().includes('night') || activeShift.toLowerCase().includes('noch') || activeShift.toLowerCase().includes('madrugada') || activeShift.toLowerCase().includes('graveyard');
      const isMid = activeShift.toLowerCase().includes('mid') || activeShift.toLowerCase().includes('entre');

      if (isMid) {
        setIntervalTime('02:00 PM - 03:00 PM');
        setCoverageTime('03:00 PM - 03:30 PM');
      } else if (isMorning) {
        setIntervalTime('11:00 AM - 12:00 PM');
        setCoverageTime('12:00 PM - 01:00 PM');
      } else if (isAfternoon) {
        setIntervalTime('06:00 PM - 07:00 PM');
        setCoverageTime('07:00 PM - 08:00 PM');
      } else if (isNight) {
        setIntervalTime('01:00 AM - 02:00 AM');
        setCoverageTime(language === 'en' ? 'None' : language === 'es' ? 'Ninguno' : 'Nenhum');
      } else {
        setIntervalTime('12:00 PM - 01:00 PM');
        setCoverageTime('');
      }
    }
  }, [selectedEmployeeId, date, employees, schedules, language]);

  // Load routine tasks automatically when environments change or sub-areas are selected/deselected
  useEffect(() => {
    if (selectedEnvironmentIds.length === 0) {
      setChecklistTasks([]);
      return;
    }

    // Filter routine tasks linked to any of these environments
    const routineTasks = taskTemplates.filter(
      t => t.type === 'routine' && t.environmentId && selectedEnvironmentIds.includes(t.environmentId)
    );

    // Apply gender-based filtering on loaded routine tasks
    const genderFilteredRoutineTasks = filterTasksByGender(routineTasks, employeeGender);

    // Filter tasks by selected sub-areas
    const finalFilteredRoutineTasks = filterTasksByUncheckedSubAreas(genderFilteredRoutineTasks, selectedSubAreas, environments);

    // Merge routine tasks with current manual/occasional tasks
    setChecklistTasks(prev => {
      // Keep only manually added/occasional tasks
      const manualAndOccasions = prev.filter(t => t.isCustomOccasional);
      
      const mappedRoutine: ChecklistTask[] = [];

      finalFilteredRoutineTasks.forEach(t => {
        if (t.bullets && t.bullets.length > 0) {
          // If template has bullets, only generate tasks for SELECTED bullets
          const chosen = selectedBullets[t.id] ?? t.bullets;
          chosen.forEach(bullet => {
            const bulletIdx = t.bullets?.indexOf(bullet) ?? -1;
            const transSource = (t.translations || TASK_TRANSLATIONS[t.id]) as any;
            
            mappedRoutine.push({
              id: `${t.id}-bullet-${bulletIdx}`,
              title: `${t.title} - ${bullet}`,
              description: t.description,
              completed: false,
              frequency: t.frequency,
              translations: transSource ? {
                pt: {
                  title: `${transSource.pt?.title || translateOperationalString(t.title, 'pt')} - ${transSource.pt?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'pt')}`,
                  description: transSource.pt?.description || (t.description ? translateOperationalString(t.description, 'pt') : undefined)
                },
                en: {
                  title: `${transSource.en?.title || translateOperationalString(t.title, 'en')} - ${transSource.en?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'en')}`,
                  description: transSource.en?.description || (t.description ? translateOperationalString(t.description, 'en') : undefined)
                },
                es: {
                  title: `${transSource.es?.title || translateOperationalString(t.title, 'es')} - ${transSource.es?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'es')}`,
                  description: transSource.es?.description || (t.description ? translateOperationalString(t.description, 'es') : undefined)
                }
              } : {
                pt: {
                  title: `${translateOperationalString(t.title, 'pt')} - ${translateOperationalString(bullet, 'pt')}`,
                  description: t.description ? translateOperationalString(t.description, 'pt') : undefined
                },
                en: {
                  title: `${translateOperationalString(t.title, 'en')} - ${translateOperationalString(bullet, 'en')}`,
                  description: t.description ? translateOperationalString(t.description, 'en') : undefined
                },
                es: {
                  title: `${translateOperationalString(t.title, 'es')} - ${translateOperationalString(bullet, 'es')}`,
                  description: t.description ? translateOperationalString(t.description, 'es') : undefined
                }
              }
            });
          });
        } else {
          // Normal task with no bullets
          mappedRoutine.push({
            id: t.id,
            title: t.title,
            description: t.description,
            completed: false,
            frequency: t.frequency,
            translations: t.translations || TASK_TRANSLATIONS[t.id]
          });
        }
      });

      // Return both, avoiding duplicates by ID
      const seenIds = new Set(mappedRoutine.map(t => t.id));
      const filteredManualAndOccasions = manualAndOccasions.filter(t => !seenIds.has(t.id));
      
      return [...mappedRoutine, ...filteredManualAndOccasions];
    });
  }, [selectedEnvironmentIds, selectedSubAreas, selectedBullets, taskTemplates, employeeGender, environments]);

  // Handle adding occasional tasks from the general tasks library
  const handleAddOccasionalFromTemplates = (template: TaskTemplate) => {
    const transSource = (template.translations || TASK_TRANSLATIONS[template.id]) as any;
    const taskFreq = template.frequency || 'Sob Demanda';
    if (template.bullets && template.bullets.length > 0) {
      const newTasks: ChecklistTask[] = template.bullets.map((bullet, bulletIdx) => {
        const bulletId = `${template.id}-bullet-${bulletIdx}`;
        return {
          id: bulletId,
          title: `${template.title} - ${bullet}`,
          description: template.description || (language === 'en' ? 'Scheduled occasional task' : language === 'es' ? 'Tarea eventual programada' : 'Tarefa eventual agendada'),
          completed: false,
          frequency: taskFreq,
          isCustomOccasional: true,
          translations: transSource ? {
            pt: {
              title: `${transSource.pt?.title || translateOperationalString(template.title, 'pt')} - ${transSource.pt?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'pt')}`,
              description: transSource.pt?.description
            },
            en: {
              title: `${transSource.en?.title || translateOperationalString(template.title, 'en')} - ${transSource.en?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'en')}`,
              description: transSource.en?.description
            },
            es: {
              title: `${transSource.es?.title || translateOperationalString(template.title, 'es')} - ${transSource.es?.bullets?.[bulletIdx] || translateOperationalString(bullet, 'es')}`,
              description: transSource.es?.description
            }
          } : {
            pt: {
              title: `${translateOperationalString(template.title, 'pt')} - ${translateOperationalString(bullet, 'pt')}`,
              description: template.description ? translateOperationalString(template.description, 'pt') : undefined
            },
            en: {
              title: `${translateOperationalString(template.title, 'en')} - ${translateOperationalString(bullet, 'en')}`,
              description: template.description ? translateOperationalString(template.description, 'en') : undefined
            },
            es: {
              title: `${translateOperationalString(template.title, 'es')} - ${translateOperationalString(bullet, 'es')}`,
              description: template.description ? translateOperationalString(template.description, 'es') : undefined
            }
          }
        };
      });

      // Avoid double adding any of the bullets
      setChecklistTasks(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const filteredNew = newTasks.filter(t => !existingIds.has(t.id));
        return [...prev, ...filteredNew];
      });
    } else {
      // Avoid double adding
      if (checklistTasks.some(t => t.id === template.id)) return;

      setChecklistTasks(prev => [
        ...prev,
        {
          id: template.id,
          title: template.title,
          description: template.description || (language === 'en' ? 'Scheduled occasional task' : language === 'es' ? 'Tarea eventual programada' : 'Tarefa eventual agendada'),
          completed: false,
          frequency: taskFreq,
          isCustomOccasional: true,
          translations: template.translations || TASK_TRANSLATIONS[template.id] || {
            pt: {
              title: translateOperationalString(template.title, 'pt'),
              description: template.description ? translateOperationalString(template.description, 'pt') : 'Tarefa eventual agendada'
            },
            en: {
              title: translateOperationalString(template.title, 'en'),
              description: template.description ? translateOperationalString(template.description, 'en') : 'Scheduled occasional task'
            },
            es: {
              title: translateOperationalString(template.title, 'es'),
              description: template.description ? translateOperationalString(template.description, 'es') : 'Tarea eventual programada'
            }
          }
        }
      ]);
    }
  };

  // Handle adding on-the-spot manual task (Tarefa Eventual customizada)
  const handleAddCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskTitle.trim()) return;

    const uniqueId = `custom-task-diy-${Date.now()}`;
    const cleanTitle = customTaskTitle.trim();
    const cleanDesc = customTaskDesc.trim();

    const newTask: ChecklistTask = {
      id: uniqueId,
      title: cleanTitle,
      description: cleanDesc || undefined,
      completed: false,
      frequency: 'Sob Demanda',
      isCustomOccasional: true,
      translations: {
        pt: {
          title: translateOperationalString(cleanTitle, 'pt'),
          description: cleanDesc ? translateOperationalString(cleanDesc, 'pt') : undefined
        },
        en: {
          title: translateOperationalString(cleanTitle, 'en'),
          description: cleanDesc ? translateOperationalString(cleanDesc, 'en') : undefined
        },
        es: {
          title: translateOperationalString(cleanTitle, 'es'),
          description: cleanDesc ? translateOperationalString(cleanDesc, 'es') : undefined
        }
      }
    };

    setChecklistTasks(prev => [...prev, newTask]);
    setCustomTaskTitle('');
    setCustomTaskDesc('');

    // Translate on the fly in the background so it responds dynamically when language toggles
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle, description: cleanDesc })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.translations) {
          setChecklistTasks(prev => prev.map(t => {
            if (t.id === uniqueId) {
              return { ...t, translations: data.translations };
            }
            return t;
          }));
        }
      }
    } catch (error) {
      console.warn('Notice translating custom on-the-spot task:', error);
    }
  };

  // Remove a task from this specific checklist template during setup
  const handleRemoveTask = (id: string) => {
    setChecklistTasks(prev => prev.filter(t => t.id !== id));
  };

  // Submit and create checklist
  const handleSubmitChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAlert('');
    
    if (!selectedEmployeeId) {
      setErrorAlert(language === 'en' ? 'Please select an employee.' : language === 'es' ? 'Por favor, seleccione un empleado.' : 'Por favor, selecione o funcionário.');
      return;
    }
    if (selectedEnvironmentIds.length === 0) {
      setErrorAlert(language === 'en' ? 'Please select at least one designated workplace environment.' : language === 'es' ? 'Por favor, seleccione al menos un ambiente de trabajo asignado.' : 'Por favor, selecione ao menos um ambiente de trabalho designado.');
      return;
    }
    if (checklistTasks.length === 0) {
      setErrorAlert(language === 'en' ? 'Add at least one routine or occasional task for this employee.' : language === 'es' ? 'Agregue al menos una tarea periódica o eventual para este empleado.' : 'Adicione pelo menos uma tarefa de rotina ou eventual para este funcionário.');
      return;
    }

    const employeeObj = employees.find(e => e.id === selectedEmployeeId)!;
    const environmentObjs = environments.filter(env => selectedEnvironmentIds.includes(env.id));
    environmentObjs.sort((a, b) => compareEnvironmentsNumerically(a.name, b.name));
    const combinedEnvironmentNames = environmentObjs.map(env => {
      const selectedSubs = selectedSubAreas[env.id] || [];
      const totalAvailableSubs = filterSubAreasByGender(env.subAreas, employeeGender);
      if (selectedSubs.length > 0 && selectedSubs.length < totalAvailableSubs.length) {
        return `${env.name} (${selectedSubs.join(', ')})`;
      }
      if (selectedSubs.length === 0 && totalAvailableSubs.length > 0) {
        return `${env.name} (${language === 'en' ? 'No subareas selected' : language === 'es' ? 'Ninguna subárea seleccionada' : 'Nenhuma sub-área selecionada'})`;
      }
      return env.name;
    }).join(', ');

    const newChecklistData: Omit<DailyChecklist, 'id'> = {
      employeeId: selectedEmployeeId,
      employeeName: employeeObj.name,
      employeeRole: role || employeeObj.role,
      shift: shift || employeeObj.shift,
      date,
      intervalTime: intervalTime.trim(),
      coverageTime: coverageTime.trim() || (language === 'en' ? 'None' : language === 'es' ? 'Ninguno' : 'Nenhum'),
      cartNumber: cartNumber.trim(),
      radioNumber: radioNumber.trim(),
      keyNumber: keyNumber.trim(),
      environmentId: selectedEnvironmentIds.join(','),
      environmentName: combinedEnvironmentNames,
      tasks: checklistTasks,
      status: 'pending',
      notes: notes.trim()
    };

    addChecklist(newChecklistData);
    
    // Clear Form inputs
    setSelectedEmployeeId('');
    setSelectedEnvironmentIds([]);
    setSelectedSubAreas({});
    setNotes('');
    setChecklistTasks([]);

    // Open tracking list tab
    onSuccessNavigate();
  };

  // Get list of occasional tasks available for manual insertion
  const availableOccasionalTemplates = taskTemplates.filter(
    t => t.type === 'occasional' && (!t.environmentId || selectedEnvironmentIds.includes(t.environmentId))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-sans font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-indigo-600" />
          {t('creator_title')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('creator_subtitle')}
        </p>
      </div>

      {/* Auto-Generation & Continuous Automation Panel */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-indigo-700/50">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-1/3 -top-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-700/60 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  {language === 'en' 
                    ? 'Weekly Schedule Auto-Generation' 
                    : language === 'es' 
                    ? 'Auto-Generación por Escala Semanal' 
                    : 'Auto-Geração por Escala Semanal'}
                  <span className="text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    {language === 'en' ? 'Continuous Rule' : language === 'es' ? 'Regla Continua' : 'Regra Contínua'}
                  </span>
                </h2>
                <p className="text-[11px] text-indigo-200/80 mt-0.5">
                  {language === 'en'
                    ? 'Automatically clones previous week checklists when there are no weekly schedule changes.'
                    : language === 'es'
                    ? 'Clona automáticamente las fichas de la semana anterior cuando no hay cambios en la agenda.'
                    : 'Clona automaticamente as fichas da semana anterior quando não há alterações na escala semanal.'}
                </p>
              </div>
            </div>

            {/* Toggle Continuous Automation */}
            <div className="flex items-center gap-2 bg-indigo-950/60 border border-indigo-700/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              <span className="text-[10px] font-semibold text-indigo-200">
                {language === 'en' ? 'Continuous Auto-Sync:' : language === 'es' ? 'Auto-Sincronización:' : 'Automação Contínua:'}
              </span>
              <button
                type="button"
                onClick={toggleAutoSync}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  autoSyncEnabled
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {autoSyncEnabled 
                  ? (language === 'en' ? 'ENABLED' : language === 'es' ? 'ACTIVADA' : 'ATIVADA') 
                  : (language === 'en' ? 'DISABLED' : language === 'es' ? 'DESACTIVADA' : 'DESACTIVADA')}
              </button>
            </div>
          </div>

          {/* Status Message / Pending Checklists Action */}
          {pendingEmployeesForDate.length === 0 ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-200 block">
                  {language === 'en' 
                    ? `100% Up to Date for ${date}` 
                    : language === 'es' 
                    ? `100% Actualizado para el ${date}` 
                    : `100% Atualizado para ${date}`}
                </span>
                <span className="text-emerald-300/80 text-[11px]">
                  {language === 'en'
                    ? `All ${scheduledPortersOfToday.length} scheduled employees for this date already have active daily checklists.`
                    : language === 'es'
                    ? `Todos los ${scheduledPortersOfToday.length} empleados programados para esta fecha ya tienen su checklist diario activo.`
                    : `Todos os ${scheduledPortersOfToday.length} colaboradores escalados para esta data já possuem checklist diário ativo.`}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-950/70 border border-indigo-500/40 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="text-xs font-bold text-amber-300">
                      {language === 'en'
                        ? `${pendingEmployeesForDate.length} Scheduled Employee(s) Need Daily Checklists for ${date}`
                        : language === 'es'
                        ? `${pendingEmployeesForDate.length} Empleado(s) Programado(s) requieren Checklist para el ${date}`
                        : `${pendingEmployeesForDate.length} Colaborador(es) Escalado(s) sem Checklist para ${date}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-200/80 mt-1">
                    {language === 'en'
                      ? 'No changes detected in weekly schedule. Auto-generate all missing checklists in 1 click using last week baseline.'
                      : language === 'es'
                      ? 'Sin cambios detectados en la agenda. Auto-genere todas las fichas faltantes en 1 clic usando la semana anterior.'
                      : 'Sem alterações na escala semanal. Gerar todas as folhas pendentes em 1 clique com base nas fichas da semana anterior.'}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isAutoGenerating}
                  onClick={handleAutoGenerateChecklists}
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 hover:from-amber-400 hover:to-indigo-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isAutoGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{language === 'en' ? 'Auto-Generating...' : language === 'es' ? 'Auto-Generando...' : 'Auto-Gerando...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>
                        {language === 'en'
                          ? `Auto-Generate ${pendingEmployeesForDate.length} Checklist(s)`
                          : language === 'es'
                          ? `Auto-Generar ${pendingEmployeesForDate.length} Checklist(s)`
                          : `Auto-Gerar ${pendingEmployeesForDate.length} Checklist(s)`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Badges of pending employees */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-indigo-800/60">
                <span className="text-[10px] text-indigo-300 font-semibold mr-1 flex items-center">
                  {language === 'en' ? 'Pending:' : language === 'es' ? 'Pendientes:' : 'Pendentes:'}
                </span>
                {pendingEmployeesForDate.map(emp => {
                  const empSched = schedules.find(s => s.employeeId === emp.id);
                  const activeShift = (empSched ? empSched[dayOfWeek] : emp.shift) || emp.shift;
                  return (
                    <span 
                      key={emp.id}
                      className="text-[10px] bg-indigo-900/90 text-indigo-100 border border-indigo-700/80 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-medium"
                    >
                      <User className="w-2.5 h-2.5 text-indigo-400" />
                      <span>{emp.name}</span>
                      <span className="text-[9px] text-amber-300 font-mono">({activeShift.replace(' Shift', '')})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success notification banner */}
          {autoGenSuccessMessage && (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 p-3 rounded-xl text-xs flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{autoGenSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={onSuccessNavigate}
                className="bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[10px] hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                {language === 'en' ? 'View Tracker' : language === 'es' ? 'Ver Monitoreo' : 'Ver Acompanhamento'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorAlert && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="font-semibold">{errorAlert}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Parameters column (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmitChecklist} className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">1</span>
              {language === 'en' ? 'Shift & Break Allocation Profile' : language === 'es' ? 'Perfil de Turno y Distribución de Tareas' : 'Informações Globais de Turno e Escala'}
            </h2>

            {/* Quick pre-select panel for scheduled employees of the selected date */}
            <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-indigo-900">{t('schedule_quick_pre_select')}</h3>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {t('schedule_quick_pre_select_desc')}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                {(() => {
                  const dayOfWeek = getDayOfWeekName(date);

                  const getShiftWeight = (shiftStr: string): number => {
                    let resolvedShift = shiftStr || '';
                    // Resolve custom shifts to their parent shifts
                    const customMatch = customShifts.find(cs => cs.name === resolvedShift);
                    if (customMatch) {
                      resolvedShift = customMatch.parentShift;
                    }

                    const lower = resolvedShift.toLowerCase();
                    if (lower.includes('day') || lower.includes('manha') || lower.includes('manhã') || lower.includes('diurno')) return 1;
                    if (lower.includes('mid') || lower.includes('intermediario') || lower.includes('intermediário') || lower.includes('meio-dia')) return 2;
                    if (lower.includes('swing') || lower.includes('tarde') || lower.includes('vespertino')) return 3;
                    if (lower.includes('grave') || lower.includes('night') || lower.includes('noite') || lower.includes('noturno') || lower.includes('madrugada')) return 4;
                    return 5;
                  };

                  const scheduledEmps = activePorters.filter(emp => {
                    if (!emp.active) return false;
                    const empSched = schedules.find(s => s.employeeId === emp.id);
                    const todayShift = empSched ? empSched[dayOfWeek] : emp.shift;
                    return todayShift && todayShift !== 'FOLGA' && todayShift !== 'OFF';
                  }).sort((a, b) => {
                    const schedA = schedules.find(s => s.employeeId === a.id);
                    const todayShiftA = schedA ? schedA[dayOfWeek] : a.shift;
                    const weightA = getShiftWeight(todayShiftA || '');

                    const schedB = schedules.find(s => s.employeeId === b.id);
                    const todayShiftB = schedB ? schedB[dayOfWeek] : b.shift;
                    const weightB = getShiftWeight(todayShiftB || '');

                    if (weightA !== weightB) {
                      return weightA - weightB;
                    }
                    return a.name.localeCompare(b.name);
                  });

                  if (scheduledEmps.length === 0) {
                    return (
                      <span className="text-xs text-slate-400 italic">
                        {t('schedule_no_one_scheduled')}
                      </span>
                    );
                  }

                  return scheduledEmps.map(emp => {
                    const empSched = schedules.find(s => s.employeeId === emp.id);
                    const todayShift = empSched ? empSched[dayOfWeek] : emp.shift;
                    const isSelected = selectedEmployeeId === emp.id;
                    
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => setSelectedEmployeeId(emp.id)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs scale-[1.02]' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50 hover:scale-[1.01]'
                        }`}
                      >
                        <span className="font-bold">{emp.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                          isSelected 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {todayShift.includes('Shift') ? todayShift.replace(' Shift', '') : todayShift}
                        </span>
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Selection of Employee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" /> {t('creator_select_employee')} *
                </label>
                <select
                  required
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none transition-colors"
                >
                  <option value="">-- {t('creator_choose')} --</option>
                  {activePorters.filter(e => e.active).map(emp => {
                    const genderLabel = emp.gender === 'Feminino'
                      ? (language === 'en' ? 'Female' : language === 'es' ? 'Femenino' : 'Feminino')
                      : (language === 'en' ? 'Male' : language === 'es' ? 'Masculino' : 'Masculino');
                    return (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({genderLabel} - {emp.role})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> {t('creator_date')}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>

            {/* Autopopulated details with manual correction allowed */}
            {selectedEmployeeId && (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  {language === 'en' ? 'Operational Profile Card' : language === 'es' ? 'Ficha del Operador' : 'Ficha do Operacional'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('emp_role_lbl')}</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-md p-2 outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('creator_shift')}</label>
                    <input
                      type="text"
                      value={shift}
                      onChange={(e) => setShift(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-md p-2 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/60 pt-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-cyan-600" /> {language === 'en' ? 'Radio Number' : language === 'es' ? 'Número de Radio' : 'Número de Rádio'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 14"
                      value={radioNumber}
                      onChange={(e) => setRadioNumber(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-md p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Key className="w-3 h-3 text-amber-600" /> {language === 'en' ? 'Key Number' : language === 'es' ? 'Número de Llave' : 'Número da Chave'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: A-03"
                      value={keyNumber}
                      onChange={(e) => setKeyNumber(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-md p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3 text-emerald-600" /> {language === 'en' ? 'Cleaning Cart #' : language === 'es' ? 'Nº Carro de Limpieza' : 'Carro de Limpeza nº'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 05"
                      value={cartNumber}
                      onChange={(e) => setCartNumber(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 focus:border-indigo-500 rounded-md p-2 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Break times & colleagues coverage schedules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {language === 'en' ? 'Planned Shift Break Interval (Lunch/Snack)' : language === 'es' ? 'Horario de Descanso (Almuerzo/Merienda)' : 'Horário de Intervalo (Almoço/Lanche)'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Ex: 11:30 AM - 12:30 PM' : language === 'es' ? 'Ej: 11:30 AM - 12:30 PM' : 'Ex: 11:30 AM - 12:30 PM'}
                  value={intervalTime}
                  required
                  onChange={(e) => setIntervalTime(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {language === 'en' ? 'Colleague Coverage Schedule (Backup Support)' : language === 'es' ? 'Cobertura de Compañero (Apoyo de Descanso)' : 'Cobertura de Colega (Intervalo Alheio)'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Ex: 12:30 PM - 01:30 PM (Cover John)' : language === 'es' ? 'Ej: 12:30 PM - 01:30 PM (Cubrir Juan)' : 'Ex: 12:30 PM - 01:30 PM (Cobrir João)'}
                  value={coverageTime}
                  onChange={(e) => setCoverageTime(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>

            {/* Workplace area assignment mapping */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {language === 'en' ? 'Designated Workplace Environments *' : language === 'es' ? 'Ambientes de Trabajo Asignados *' : 'Ambientes de Trabalho Designados *'}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {environments.map(env => {
                  const isSelected = selectedEnvironmentIds.includes(env.id);
                  return (
                    <button
                      type="button"
                      key={env.id}
                      onClick={() => handleToggleEnvironment(env.id)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/45 text-indigo-900 ring-2 ring-indigo-600/15'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100/70 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition-colors duration-150 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-white border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold block truncate leading-tight text-slate-800">{getLocalizedEnvironmentName(env.name, language)}</span>
                        {env.subAreas && env.subAreas.length > 0 ? (
                          <span className="text-[10px] text-slate-450 block truncate mt-1">
                            {filterSubAreasByGender(env.subAreas, employeeGender).map(s => getLocalizedEnvironmentName(s, language)).join(', ')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block italic mt-1">
                            {language === 'en' ? 'No subareas' : language === 'es' ? 'Sin subáreas' : 'Sem subáreas'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedEnvironmentIds.length > 0 && (
                <div className="mt-3 bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 animate-pulse"></span>
                    <span>{language === 'en' ? 'Select/Deselect Specific Subareas to cover:' : language === 'es' ? 'Seleccionar/Deseleccionar Subáreas Específicas a cubrir:' : 'Selecione as Sub-módulos/Sub-áreas específicas a cobrir:'}</span>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {environments.filter(env => selectedEnvironmentIds.includes(env.id)).map(env => {
                      const filteredSubs = filterSubAreasByGender(env.subAreas, employeeGender);
                      if (filteredSubs.length === 0) return null;
                      return (
                        <div key={env.id} className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-700 block">{getLocalizedEnvironmentName(env.name, language)}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {filteredSubs.map(sub => {
                              const isSubSelected = (selectedSubAreas[env.id] || []).includes(sub);
                              return (
                                <button
                                  type="button"
                                  key={sub}
                                  onClick={() => handleToggleSubArea(env.id, sub)}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-150 cursor-pointer ${
                                    isSubSelected
                                      ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {isSubSelected ? (
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  ) : (
                                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                  )}
                                  {getLocalizedEnvironmentName(sub, language)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specific Bullet (Tasks list) Selection */}
              {activeRoutinesWithBullets.length > 0 && (
                <div className="mt-3 bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-750 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 animate-pulse"></span>
                    <span>
                      {language === 'en' 
                        ? 'Select/Deselect Specific Tasks of Routines:' 
                        : language === 'es' 
                        ? 'Seleccionar/Deseleccionar Pasos de las Rutinas:' 
                        : 'Selecione os passos/tarefas específicos das rotinas:'}
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {activeRoutinesWithBullets.map(t => {
                      const localizedTask = getLocalizedTask(t, language);
                      const currentSelected = selectedBullets[t.id] ?? t.bullets ?? [];
                      const bulletsList = t.bullets ?? [];
                      return (
                        <div key={t.id} className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-700 block">{localizedTask.title}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {bulletsList.map((bullet, idx) => {
                              const isBulletSelected = currentSelected.includes(bullet);
                              const bulletText = localizedTask.bullets?.[idx] || bullet;
                              return (
                                <button
                                  type="button"
                                  key={bullet}
                                  onClick={() => {
                                    setSelectedBullets(prev => {
                                      const prevList = prev[t.id] ?? t.bullets ?? [];
                                      const nextList = prevList.includes(bullet)
                                        ? prevList.filter(b => b !== bullet)
                                        : [...prevList, bullet];
                                      return { ...prev, [t.id]: nextList };
                                    });
                                  }}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-150 cursor-pointer ${
                                    isBulletSelected
                                      ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {isBulletSelected ? (
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  ) : (
                                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                  )}
                                  {bulletText}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Checklist assembly progress review */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>{language === 'en' ? 'Checklist Task Board' : language === 'es' ? 'Folleto de Tareas del Checklist' : 'Lista das Tarefas do Checklist'} ({checklistTasks.length})</span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-sans">
                  {selectedEnvironmentIds.length > 0 
                    ? (language === 'en' ? 'Routines Loaded' : language === 'es' ? 'Rutinas Cargadas' : 'Rotinas Carregadas') 
                    : (language === 'en' ? 'Choose areas first' : language === 'es' ? 'Seleccione áreas primero' : 'Escolha as áreas')}
                </span>
              </h3>

              {checklistTasks.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                  {language === 'en' 
                    ? 'Awaiting workplace environment selection to retrieve active routine questionnaire...' 
                    : language === 'es' 
                    ? 'Esperando selección del ambiente de trabalho para cargar cuestionarios estándar...' 
                    : 'Aguardando seleção do ambiente de trabalho para carregar a grade de rotinas padrão...'}
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {groupChecklistTasks(checklistTasks, language).map((group) => {
                    if (group.isGroup) {
                      return (
                        <div key={group.parentId} className="p-3 rounded-lg border border-slate-150 bg-slate-50/50 space-y-2 text-xs">
                          <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-1.5">
                            <div>
                              <span className="font-bold text-slate-800 flex items-center gap-1.5 leading-tight flex-wrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                                {group.parentTitle}
                                {group.isCustomOccasional && (
                                  <span className="flex-shrink-0 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100 uppercase">
                                    {language === 'en' ? 'Occasional' : language === 'es' ? 'Eventual' : 'Eventual'}
                                  </span>
                                )}
                                {group.frequency && (
                                  <span className="flex-shrink-0 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200/80 uppercase flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5 text-indigo-600" />
                                    {getLocalizedFrequency(group.frequency, language)}
                                  </span>
                                )}
                              </span>
                              {group.parentDescription && (
                                <p className="text-[10px] text-slate-400 mt-0.5 font-normal">
                                  {group.parentDescription}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                // Remove all subtasks in this group
                                setChecklistTasks(prev => prev.filter(t => !t.id.startsWith(`${group.parentId}-bullet-`)));
                              }}
                              className="text-slate-400 hover:text-red-600 text-[10px] font-semibold hover:underline flex items-center gap-1 shrink-0"
                              title={language === 'en' ? 'Remove all tasks of this routine' : language === 'es' ? 'Eliminar todos los pasos' : 'Remover todas as tarefas da rotina'}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{language === 'en' ? 'Remove all' : language === 'es' ? 'Quitar todos' : 'Remover todos'}</span>
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {group.subtasks.map((subtask) => (
                              <div key={subtask.id} className="bg-white border border-slate-200 rounded-lg py-1 px-2.5 flex items-center gap-1.5">
                                <span className="text-slate-700 font-medium text-[11px]">{subtask.bulletText}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTask(subtask.id)}
                                  className="text-slate-400 hover:text-red-500 rounded-sm hover:bg-slate-50"
                                  title={language === 'en' ? 'Remove task' : language === 'es' ? 'Eliminar paso' : 'Remover tarefa'}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    } else {
                      const rawTask = group.singleTask!;
                      const task = getLocalizedTask(rawTask, language);
                      return (
                        <div 
                          key={task.id} 
                          className={`p-3 rounded-lg flex items-start justify-between gap-3 border text-xs transition-all ${
                            task.isCustomOccasional 
                              ? 'bg-amber-50/50 border-amber-100' 
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`w-1.5 h-1.5 rounded-full ${task.isCustomOccasional ? 'bg-amber-500' : 'bg-indigo-500'}`}></span>
                              <span className="font-semibold text-slate-800">{task.title}</span>
                              {(group.frequency || task.frequency) && (
                                <span className="flex-shrink-0 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200/80 uppercase flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 text-indigo-600" />
                                  {getLocalizedFrequency(group.frequency || task.frequency, language)}
                                </span>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-slate-400 mt-1 pl-3 font-normal">{task.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(task.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-sm"
                            title={language === 'en' ? 'Remove from checklist' : language === 'es' ? 'Eliminar del checklist' : 'Remover do checklist diário'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>

            {/* Observations notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'en' ? 'Special Instructions / Launch Notes' : language === 'es' ? 'Instrucciones Especiales / Notas de Despegue' : 'Instruções Especiais / Observações do Lançamento'}
              </label>
              <textarea
                rows={2}
                placeholder={language === 'en' ? 'Ex: Check reported leak in restroom #3. Return sector keys back to locker board at end of shift.' : language === 'es' ? 'Ex: Revisar fuga reportada en el baño nº 3. Devolver llaves al final del turno.' : 'Ex: Verificar vazamento informado no banheiro nº 3. Entregar as chaves de volta no claviculário ao fim do turno.'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-none resize-none"
              ></textarea>
            </div>

            {/* Generate Button */}
            <div className="border-t border-slate-100 pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold p-3.5 rounded-xl transition-all shadow-sm active:scale-99"
              >
                {language === 'en' 
                  ? `Activate & Save Daily Checklist Work Sheet (${checklistTasks.length} tasks)` 
                  : language === 'es' 
                  ? `Activar y Guardar Ficha de Checklist Diario (${checklistTasks.length} tareas)` 
                  : `Ativar & Salvar Folha de Checklist Diário (${checklistTasks.length} tarefas)`}
              </button>
            </div>
          </form>
        </div>

        {/* Right tools column: occasional templates & manual injector (1/3) */}
        <div className="space-y-6">
          
          {/* Create custom checklist task on the fly */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-2 mb-3">
              {language === 'en' ? 'Custom Occasional Task' : language === 'es' ? 'Tarea Eventual Personalizada' : 'Tarefa Eventual Customizada'}
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              {language === 'en' ? 'Need the operational member to carry out an extraordinary job today? Write it down to inject it.' : language === 'es' ? '¿Necesita que el empleado haga una tarea extraordinaria hoy? Escríbala directamente.' : 'Precisa que o funcionário faça alguma tarefa extraordinária no dia de hoje? Digite e adicione diretamente.'}
            </p>

            <form onSubmit={handleAddCustomTask} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">{language === 'en' ? 'Task Title' : language === 'es' ? 'Título de la Tarea' : 'Título da Tarefa'}</label>
                <input
                   type="text"
                   placeholder={language === 'en' ? 'Ex: Post-repair cleanup' : language === 'es' ? 'Ex: Limpieza post-avería' : 'Ex: Limpeza pós-vazamento'}
                   value={customTaskTitle}
                   onChange={(e) => setCustomTaskTitle(e.target.value)}
                   className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">{language === 'en' ? 'Quick Instructions (Optional)' : language === 'es' ? 'Instrucciones Rápidas (Opcional)' : 'Instruções rápidas (Opcional)'}</label>
                <textarea
                  rows={2}
                  placeholder={language === 'en' ? 'Ex: Mop floor with bleach after water supply resides.' : language === 'es' ? 'Ex: Pasar mopa con desinfectante después del desagüe.' : 'Ex: Passar esfregão com desinfetante após retirada da água.'}
                  value={customTaskDesc}
                  onChange={(e) => setCustomTaskDesc(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!customTaskTitle.trim()}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs p-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                {language === 'en' ? 'Inject into Checklist' : language === 'es' ? 'Inyectar en Checklist' : 'Injetar no Checklist'}
              </button>
            </form>
          </div>

          {/* Quick-add Occasional Task templates */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-2 mb-3">
              {language === 'en' ? 'Occasional Task Bank' : language === 'es' ? 'Banco de Tareas Eventuales' : 'Banco de Tarefas Eventuais'}
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {language === 'en' ? 'Click to easily include non-routine activities saved in your global registry.' : language === 'es' ? 'Haga clic para incluir tareas eventuales guardadas en la biblioteca.' : 'Clique para incluir tarefas não corriqueiras salvas no banco de dados.'}
            </p>

            {availableOccasionalTemplates.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400 italic">
                {language === 'en' ? 'No occasional templates registered' : language === 'es' ? 'Ninguna tarea eventual registrada' : 'Nenhuma tarefa eventual cadastrada'} {selectedEnvironmentIds.length > 0 && (language === 'en' ? ' for these sectors' : language === 'es' ? ' para estos sectores' : ' para estes setores')}.
              </div>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {availableOccasionalTemplates.map((template) => {
                  const localizedTemplate = getLocalizedTask(template, language);
                  const alreadyAdded = template.bullets && template.bullets.length > 0
                    ? template.bullets.some((_, idx) => checklistTasks.some(t => t.id === `${template.id}-bullet-${idx}`))
                    : checklistTasks.some(t => t.id === template.id);
                  return (
                    <button
                      key={template.id}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddOccasionalFromTemplates(template)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between gap-2 ${
                        alreadyAdded 
                          ? 'bg-slate-100/50 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-amber-50/20 border-amber-100 text-slate-800 hover:bg-amber-50/60'
                      }`}
                    >
                      <div className="truncate pr-1">
                        <span className="font-semibold block truncate">{localizedTemplate.title}</span>
                        <span className="text-[10px] text-amber-600 font-mono block">
                          {getLocalizedFrequency(template.frequency || 'Sob Demanda', language)}
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        {alreadyAdded ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assistant Info */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 text-slate-700">
            <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-800 block mb-0.5">{language === 'en' ? 'Productivity Tip:' : language === 'es' ? 'Consejo Práctico:' : 'Dica de Produtividade:'}</strong>
              {language === 'en' ? 'Changing the assigned environments refreshes tasks. Be sure to select the correct workplaces first!' : language === 'es' ? 'Cambiar los ambientes asignados recarga las rutinas. ¡Asegúrese de configurar las áreas correctas primero!' : 'Mudar os ambientes atribuídos recarrega as rotinas. Certifique-se de configurar as áreas corretas primeiro!'}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
