import React, { useState, useEffect } from 'react';
import { useApp, isSystemAdmin } from '../context/AppContext';
import { WeeklySchedule, Employee } from '../types';
import { 
  Calendar, 
  Clipboard, 
  FileText, 
  Grid, 
  Save, 
  Trash2, 
  Check, 
  AlertCircle,
  Copy,
  PlusCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ShieldAlert,
  Lock,
  Clock,
  Sparkles,
  Edit3,
  Sliders,
  X,
  Repeat,
  Layers,
  AlertTriangle
} from 'lucide-react';

interface ScheduleTabProps {
  currentUser?: Employee;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({ currentUser }) => {
  const { employees, schedules, saveSchedule, saveAllSchedules, customShifts, t, language } = useApp();
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
  
  // Filter out any employees of category/role containing 'Supervisor'
  // and sort them based on shift priority: Day shift, Mid shift, Swing shift, Graveyard shift
  const activePorters = React.useMemo(() => {
    const getShiftWeight = (shiftStr: string): number => {
      let resolvedShift = shiftStr || '';
      // Look up if this shiftStr is a custom shift name, and link to parent shift if found
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

    return employees
      .filter(emp => {
        const roleLower = (emp.role || '').toLowerCase();
        return !roleLower.includes('supervisor');
      })
      .sort((a, b) => {
        const weightA = getShiftWeight(a.shift);
        const weightB = getShiftWeight(b.shift);
        if (weightA !== weightB) {
          return weightA - weightB;
        }
        return a.name.localeCompare(b.name);
      });
  }, [employees, customShifts]);
  
  // Toggles between 'grid' (manual) and 'import' (copy/paste) modes
  const [mode, setMode] = useState<'grid' | 'import'>('grid');
  
  // Link to internal calendar reference date
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  // Sliding window index for visible weekdays (0 to 4 since 3 are visible: index, index+1, index+2)
  const [startDayIndex, setStartDayIndex] = useState(0);

  // Calculates Monday through Sunday calendar dates for the week of the selected date
  const getWeekDays = (refDateStr: string) => {
    const refDate = new Date(refDateStr + 'T12:00:00');
    const day = refDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const mondayOffset = day === 0 ? -6 : 1 - day;
    
    const monday = new Date(refDate);
    monday.setDate(refDate.getDate() + mondayOffset);
    
    const weekDaysList = [];
    const dayKeys: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDaysList.push({
        key: dayKeys[i],
        date: d,
        formattedDate: d.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: '2-digit' }),
        formattedDayLong: d.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long' })
      });
    }
    return weekDaysList;
  };

  const dayAbbreviation = (dayKey: string) => {
    switch (dayKey) {
      case 'monday': return language === 'en' ? 'Mon' : language === 'es' ? 'Lun' : 'Seg';
      case 'tuesday': return language === 'en' ? 'Tue' : language === 'es' ? 'Mar' : 'Ter';
      case 'wednesday': return language === 'en' ? 'Wed' : language === 'es' ? 'Mié' : 'Qua';
      case 'thursday': return language === 'en' ? 'Thu' : language === 'es' ? 'Jue' : 'Qui';
      case 'friday': return language === 'en' ? 'Fri' : language === 'es' ? 'Vie' : 'Sex';
      case 'saturday': return language === 'en' ? 'Sat' : language === 'es' ? 'Sáb' : 'Sáb';
      case 'sunday': return language === 'en' ? 'Sun' : language === 'es' ? 'Dom' : 'Dom';
      default: return '';
    }
  };

  // Local schedule editing state
  const [localSchedules, setLocalSchedules] = useState<WeeklySchedule[]>([]);
  
  // Paste spreadsheet raw text state
  const [pasteText, setPasteText] = useState('');
  const [parseError, setParseError] = useState('');
  
  // Parsed rows for preview before importing
  const [parsedRows, setParsedRows] = useState<Array<{
    pastedName: string;
    matchedEmployeeId: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  }>>([]);
  
  // Alert/Feedback state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Individual Shift Exception modal state
  const [editingExceptionCell, setEditingExceptionCell] = useState<{
    employeeId: string;
    employeeName: string;
    dayKey: keyof Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'>;
    dayFormattedDate: string;
    dayName: string;
    currentShiftValue: string;
  } | null>(null);

  const [exceptionPreset, setExceptionPreset] = useState<string>('Troca de Turno');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [customText, setCustomText] = useState<string>('');
  const [exceptionNote, setExceptionNote] = useState<string>('');
  const [applyToWholeWeek, setApplyToWholeWeek] = useState<boolean>(false);

  // Helper to identify temporary schedule exception shifts
  const isExceptionShift = (shiftVal: string, empDefaultShift?: string) => {
    if (!shiftVal) return false;
    const s = shiftVal.trim();
    if (s === 'FOLGA' || s === 'OFF') return false;

    const isStandardOption = [
      'Day Shift (7:00 AM - 3:00 PM)',
      'Swing Shift (3:00 PM - 11:00 PM)',
      'Graveyard Shift (11:00 PM - 7:00 AM)',
      'Manhã (06:00 - 14:00)',
      'Tarde (14:00 - 22:00)',
      'Noite (22:00 - 06:00)'
    ].includes(s);

    if (!isStandardOption && empDefaultShift && s !== empDefaultShift) {
      return true;
    }

    const lower = s.toLowerCase();
    return (
      lower.includes('exceção') ||
      lower.includes('exception') ||
      lower.includes('excepcion') ||
      lower.includes('troca') ||
      lower.includes('swap') ||
      lower.includes('extra') ||
      lower.includes('cobertura') ||
      lower.includes('especial') ||
      lower.includes('substitui') ||
      lower.includes('ajuste') ||
      (!isStandardOption && /\d{1,2}:\d{2}/.test(s))
    );
  };

  // Calculate total exception count for active weekly schedule
  const exceptionCount = React.useMemo(() => {
    let count = 0;
    const days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];
    localSchedules.forEach(sched => {
      const emp = activePorters.find(e => e.id === sched.employeeId);
      days.forEach(day => {
        if (isExceptionShift(sched[day], emp?.shift)) {
          count++;
        }
      });
    });
    return count;
  }, [localSchedules, activePorters]);

  const openExceptionModal = (
    employeeId: string,
    employeeName: string,
    dayKey: keyof Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'>,
    dayFormattedDate: string,
    dayName: string,
    currentShiftValue: string
  ) => {
    if (!checkPermission()) return;

    const timeMatch = currentShiftValue.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (timeMatch) {
      setStartTime(timeMatch[1]);
      setEndTime(timeMatch[2]);
    } else {
      setStartTime('08:00');
      setEndTime('17:00');
    }

    if (currentShiftValue.toLowerCase().includes('hora extra') || currentShiftValue.toLowerCase().includes('overtime')) {
      setExceptionPreset('Hora Extra');
    } else if (currentShiftValue.toLowerCase().includes('cobertura') || currentShiftValue.toLowerCase().includes('coverage')) {
      setExceptionPreset('Cobertura de Escala');
    } else if (currentShiftValue.toLowerCase().includes('treinamento') || currentShiftValue.toLowerCase().includes('training')) {
      setExceptionPreset('Treinamento / Reunião');
    } else if (currentShiftValue.toLowerCase().includes('especial') || currentShiftValue.toLowerCase().includes('special')) {
      setExceptionPreset('Escala Especial');
    } else {
      setExceptionPreset('Troca de Turno');
    }

    setCustomText(currentShiftValue === 'FOLGA' || currentShiftValue === 'OFF' ? '' : currentShiftValue);
    setExceptionNote('');
    setApplyToWholeWeek(false);

    setEditingExceptionCell({
      employeeId,
      employeeName,
      dayKey,
      dayFormattedDate,
      dayName,
      currentShiftValue
    });
  };

  const handleApplyException = () => {
    if (!editingExceptionCell) return;

    let finalShiftValue = '';
    
    if (customText.trim()) {
      finalShiftValue = customText.trim();
    } else {
      const formattedTimes = `${startTime} - ${endTime}`;
      finalShiftValue = `${formattedTimes} (${exceptionPreset})`;
      if (exceptionNote.trim()) {
        finalShiftValue += ` - ${exceptionNote.trim()}`;
      }
    }

    const { employeeId, dayKey } = editingExceptionCell;

    setLocalSchedules(prev => prev.map(item => {
      if (item.employeeId === employeeId) {
        if (applyToWholeWeek) {
          return {
            ...item,
            monday: finalShiftValue,
            tuesday: finalShiftValue,
            wednesday: finalShiftValue,
            thursday: finalShiftValue,
            friday: finalShiftValue,
            saturday: finalShiftValue,
            sunday: finalShiftValue,
          };
        } else {
          return {
            ...item,
            [dayKey]: finalShiftValue
          };
        }
      }
      return item;
    }));

    setEditingExceptionCell(null);
    setSuccessMsg(language === 'en' ? 'Shift exception applied to local schedule. Click "Save Schedule" to confirm.' : language === 'es' ? 'Excepción aplicada al horario local. Haga clic en "Guardar Horario" para confirmar.' : 'Exceção de horário aplicada à escala. Clique em "Salvar Escala" para confirmar.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleClearException = () => {
    if (!editingExceptionCell) return;
    const { employeeId, dayKey } = editingExceptionCell;
    const emp = activePorters.find(e => e.id === employeeId);
    const defaultShift = emp?.shift || 'Day Shift (7:00 AM - 3:00 PM)';

    setLocalSchedules(prev => prev.map(item => {
      if (item.employeeId === employeeId) {
        return {
          ...item,
          [dayKey]: defaultShift
        };
      }
      return item;
    }));

    setEditingExceptionCell(null);
    setSuccessMsg(language === 'en' ? 'Shift restored to employee default.' : language === 'es' ? 'Horario restaurado al estándar del empleado.' : 'Horário restaurado para o padrão do colaborador.');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Synchronize local state with AppContext schedules
  useEffect(() => {
    if (schedules && schedules.length > 0) {
      // Build an array of schedules for all ACTIVE employees (excluding supervisors)
      // If an employee doesn't have a schedule document yet, initialize an empty/off one
      const populatedSchedules: WeeklySchedule[] = activePorters.map(emp => {
        const existing = schedules.find(s => s.employeeId === emp.id);
        if (existing) {
          return {
            ...existing,
            employeeName: emp.name // ensure name is fresh
          };
        }
        
        // Fallback default schedule based on their initial registered shift
        const isCustom = emp.schedule === 'Escala Customizada';
        const activeShift = emp.shift || 'Day Shift (7:00 AM - 3:00 PM)';
        const satShift = isCustom ? activeShift : 'FOLGA';
        
        return {
          id: emp.id,
          employeeId: emp.id,
          employeeName: emp.name,
          monday: activeShift,
          tuesday: activeShift,
          wednesday: activeShift,
          thursday: activeShift,
          friday: activeShift,
          saturday: satShift,
          sunday: 'FOLGA'
        };
      });
      setLocalSchedules(populatedSchedules);
    } else {
      // If schedules array from Firestore is still empty, populate from employees list directly
      const defaultSchedules: WeeklySchedule[] = activePorters.map(emp => {
        const isCustom = emp.schedule === 'Escala Customizada';
        const activeShift = emp.shift || 'Day Shift (7:00 AM - 3:00 PM)';
        const satShift = isCustom ? activeShift : 'FOLGA';
        return {
          id: emp.id,
          employeeId: emp.id,
          employeeName: emp.name,
          monday: activeShift,
          tuesday: activeShift,
          wednesday: activeShift,
          thursday: activeShift,
          friday: activeShift,
          saturday: satShift,
          sunday: 'FOLGA'
        };
      });
      setLocalSchedules(defaultSchedules);
    }
  }, [schedules, activePorters]);

  // Extract all unique shifts to populate option suggestions
  const uniqueShifts = Array.from(new Set([
    ...activePorters.map(e => e.shift),
    ...customShifts.map(cs => cs.name)
  ]))
    .filter(Boolean)
    .concat([
      language === 'en' ? 'OFF' : 'FOLGA',
      'Day Shift (7:00 AM - 3:00 PM)',
      'Swing Shift (3:00 PM - 11:00 PM)',
      'Graveyard Shift (11:00 PM - 7:00 AM)'
    ]);
  
  // Deduplicate standard shifts
  const shiftOptions = Array.from(new Set(uniqueShifts));

  // Handle cell change in the manual grid
  const handleCellChange = (employeeId: string, day: keyof Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'>, value: string) => {
    if (!checkPermission()) return;
    setLocalSchedules(prev => prev.map(item => {
      if (item.employeeId === employeeId) {
        return {
          ...item,
          [day]: value
        };
      }
      return item;
    }));
  };

  // Save the full manual grid to Firestore
  const handleSaveAllGrid = async () => {
    if (!checkPermission()) return;
    try {
      setSuccessMsg('');
      setErrorMsg('');
      await saveAllSchedules(localSchedules);
      setSuccessMsg(t('schedule_save_success'));
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (e) {
      console.error(e);
      setErrorMsg(language === 'en' ? 'Error saving weekly schedules.' : language === 'es' ? 'Error al guardar los horarios.' : 'Erro ao salvar escala semanal.');
    }
  };

  // Parses pasted TSV/CSV from Excel or Sheets
  const handleParseText = () => {
    setParseError('');
    setParsedRows([]);
    
    if (!pasteText.trim()) {
      setParseError(language === 'en' ? 'Paste something first!' : language === 'es' ? '¡Pegue algo primero!' : 'Por favor, cole algum texto primeiro!');
      return;
    }

    const lines = pasteText.trim().split('\n');
    const hasHeader = lines[0].toLowerCase().includes('segunda') || 
                      lines[0].toLowerCase().includes('monday') || 
                      lines[0].toLowerCase().includes('lunes') ||
                      lines[0].toLowerCase().includes('funcionário') ||
                      lines[0].toLowerCase().includes('employee') ||
                      lines[0].toLowerCase().includes('name') ||
                      lines[0].toLowerCase().includes('nome');

    const startIdx = hasHeader ? 1 : 0;
    const tempRows: typeof parsedRows = [];

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by tab (standard spreadsheet copy value)
      let cells = line.split('\t');
      if (cells.length < 2) {
        // Fallback to semicolon or comma if pasted as csv
        cells = line.split(';');
        if (cells.length < 2) {
          cells = line.split(',');
        }
      }

      if (cells.length >= 2) {
        const name = cells[0].trim();
        const mon = (cells[1] || '').trim();
        const tue = (cells[2] || '').trim();
        const wed = (cells[3] || '').trim();
        const thu = (cells[4] || '').trim();
        const fri = (cells[5] || '').trim();
        const sat = (cells[6] || '').trim();
        const sun = (cells[7] || '').trim();

        // Perform case-insensitive substring fuzzy matching to identify database employee
        let bestMatchId = '';
        let bestScore = 0;

        for (const emp of activePorters) {
          const empClean = emp.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const pasteClean = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          if (empClean === pasteClean) {
            bestMatchId = emp.id;
            bestScore = 100;
            break;
          } else if (empClean.includes(pasteClean) || pasteClean.includes(empClean)) {
            const score = Math.min(empClean.length, pasteClean.length) / Math.max(empClean.length, pasteClean.length) * 80;
            if (score > bestScore) {
              bestScore = score;
              bestMatchId = emp.id;
            }
          }
        }

        // If no match was found, we see if we can match by employeeNumber
        if (bestScore < 30) {
          for (const emp of activePorters) {
            if (emp.employeeNumber && name.includes(emp.employeeNumber)) {
              bestMatchId = emp.id;
              bestScore = 90;
              break;
            }
          }
        }

        // Normalize shifts. If they paste things like "folga" or "off", clean them.
        const normalizeShiftValue = (val: string) => {
          const lower = val.toLowerCase();
          if (lower === 'folga' || lower === 'off' || lower === 'f' || lower === 'libre' || !val) {
            return language === 'en' ? 'OFF' : 'FOLGA';
          }
          
          // Match standard shifts fuzzy
          if (lower.includes('day') || lower.includes('manha') || lower.includes('diurno')) {
            const match = activePorters.find(e => e.shift.toLowerCase().includes('day') || e.shift.toLowerCase().includes('manha'));
            return match ? match.shift : val;
          }
          if (lower.includes('swing') || lower.includes('tarde') || lower.includes('vespertino')) {
            const match = activePorters.find(e => e.shift.toLowerCase().includes('swing') || e.shift.toLowerCase().includes('tarde'));
            return match ? match.shift : val;
          }
          if (lower.includes('grave') || lower.includes('noite') || lower.includes('noturno') || lower.includes('madruga')) {
            const match = activePorters.find(e => e.shift.toLowerCase().includes('grave') || e.shift.toLowerCase().includes('noite'));
            return match ? match.shift : val;
          }
          if (lower.includes('comercial') || lower.includes('office') || lower.includes('std')) {
            const match = activePorters.find(e => e.shift.toLowerCase().includes('comercial') || e.shift.toLowerCase().includes('office'));
            return match ? match.shift : val;
          }
          return val;
        };

        tempRows.push({
          pastedName: name,
          matchedEmployeeId: bestMatchId,
          monday: normalizeShiftValue(mon),
          tuesday: normalizeShiftValue(tue),
          wednesday: normalizeShiftValue(wed),
          thursday: normalizeShiftValue(thu),
          friday: normalizeShiftValue(fri),
          saturday: normalizeShiftValue(sat),
          sunday: normalizeShiftValue(sun),
        });
      }
    }

    if (tempRows.length === 0) {
      setParseError(t('schedule_parse_error'));
    } else {
      setParsedRows(tempRows);
    }
  };

  // Confirm mapped spreadsheet schedules and write them to Firestore
  const handleConfirmImport = async () => {
    if (!checkPermission()) return;
    try {
      setSuccessMsg('');
      setErrorMsg('');
      
      const newSchedules: WeeklySchedule[] = [];
      
      for (const row of parsedRows) {
        if (!row.matchedEmployeeId) continue; // skip row if not mapped
        
        const emp = activePorters.find(e => e.id === row.matchedEmployeeId);
        if (emp) {
          newSchedules.push({
            id: emp.id,
            employeeId: emp.id,
            employeeName: emp.name,
            monday: row.monday || emp.shift,
            tuesday: row.tuesday || emp.shift,
            wednesday: row.wednesday || emp.shift,
            thursday: row.thursday || emp.shift,
            friday: row.friday || emp.shift,
            saturday: row.saturday || 'FOLGA',
            sunday: row.sunday || 'FOLGA',
          });
        }
      }

      if (newSchedules.length === 0) {
        setErrorMsg(language === 'en' ? 'No matched employees to save.' : language === 'es' ? 'Ningún empleado asignado para guardar.' : 'Nenhum funcionário vinculado para salvar.');
        return;
      }

      await saveAllSchedules(newSchedules);
      setSuccessMsg(t('schedule_save_success'));
      
      // Clean states and return to grid mode
      setPasteText('');
      setParsedRows([]);
      setMode('grid');
      
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (e) {
      console.error(e);
      setErrorMsg(language === 'en' ? 'Error saving schedules.' : language === 'es' ? 'Error al guardar escalas.' : 'Erro ao salvar escala.');
    }
  };

  const getShiftBadgeStyle = (shift: string, isException = false) => {
    if (isException) {
      return 'bg-amber-50 text-amber-800 border-amber-300 font-bold dark:bg-amber-950/40 dark:text-amber-300';
    }
    const s = shift.toLowerCase();
    if (s === 'folga' || s === 'off') {
      return 'bg-slate-100 text-slate-500 border-slate-200';
    }
    if (s.includes('day') || s.includes('manhã') || s.includes('manha')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    if (s.includes('swing') || s.includes('tarde')) {
      return 'bg-amber-50 text-amber-700 border-amber-100';
    }
    if (s.includes('grave') || s.includes('noite') || s.includes('noturno') || s.includes('madrugada')) {
      return 'bg-purple-50 text-purple-700 border-purple-100';
    }
    return 'bg-indigo-50 text-indigo-700 border-indigo-100';
  };

  return (
    <div id="schedule_tab_root" className="flex flex-col gap-6">
      
      {/* Non-admin read-only banner */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold block">🔒 Modo de Leitura Restrito</span>
            <span>A alteração ou importação das escalas de trabalho é permitida exclusivamente para o moderador e administrador do sistema (<strong>Daniel Gomes</strong>).</span>
          </div>
        </div>
      )}

      {/* Banner Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-3xs flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">{t('schedule_title')}</h1>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl">{t('schedule_subtitle')}</p>
          </div>
        </div>
        
        {/* Toggle Mode Button Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <button
            onClick={() => setMode('grid')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              mode === 'grid' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            {t('schedule_manual_btn')}
          </button>
          <button
            onClick={() => setMode('import')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              mode === 'import' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            {t('schedule_copy_paste_btn')}
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs font-semibold">{successMsg}</span>
        </div>
      )}
      
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-xs font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Active Tab Workspace Panel */}
      {mode === 'grid' ? (
        (() => {
          const weekDays = getWeekDays(currentDate);
          const visibleWeekDays = weekDays.slice(startDayIndex, startDayIndex + 3);
          const mondayDateStr = weekDays[0].formattedDate;
          const sundayDateStr = weekDays[6].formattedDate;
          const currentYear = new Date(currentDate + 'T12:00:00').getFullYear();

          return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col gap-4">
              
              {/* Calendar & Horizontal Navigation Dashboard */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* 1. Internal Calendar Week Selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                    {t('schedule_selected_week')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(currentDate + 'T12:00:00');
                        d.setDate(d.getDate() - 7);
                        setCurrentDate(d.toISOString().split('T')[0]);
                      }}
                      title={t('schedule_prev_week')}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 active:scale-95 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Custom Styled Date Input */}
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 hover:border-slate-300 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                      <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => {
                          if (e.target.value) {
                            setCurrentDate(e.target.value);
                          }
                        }}
                        className="text-xs font-bold text-slate-800 focus:outline-hidden bg-transparent cursor-pointer"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(currentDate + 'T12:00:00');
                        d.setDate(d.getDate() + 7);
                        setCurrentDate(d.toISOString().split('T')[0]);
                      }}
                      title={t('schedule_next_week')}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 active:scale-95 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <span className="text-xs font-bold text-slate-700 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-1.5">
                      {mondayDateStr} — {sundayDateStr} ({currentYear})
                    </span>

                    {exceptionCount > 0 && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5 shadow-3xs animate-fade-in" title="Exceções temporárias configuradas nesta semana">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{exceptionCount} {t('schedule_exception_count_badge')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Weekday Horizontal Nav (Prev / Next & Day Track Minimap) */}
                <div className="flex flex-col gap-1.5 md:items-end">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    {language === 'en' ? 'Navigate Days (Horizontal View)' : language === 'es' ? 'Navegar Días (Vista Horizontal)' : 'Navegação de Dias (Visualização Horizontal)'}
                  </span>
                  <div className="flex items-center gap-3">
                    
                    {/* Back Day Button */}
                    <button
                      type="button"
                      disabled={startDayIndex === 0}
                      onClick={() => setStartDayIndex(prev => Math.max(0, prev - 1))}
                      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer animate-fade-in"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      {t('schedule_prev_day')}
                    </button>

                    {/* Day Minimap Selector */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((dayKey, index) => {
                        const isVisible = index >= startDayIndex && index < startDayIndex + 3;
                        return (
                          <button
                            key={dayKey}
                            type="button"
                            onClick={() => {
                              const newIndex = Math.min(index, 4); // lock boundary at max 4
                              setStartDayIndex(newIndex);
                            }}
                            className={`text-[10px] font-bold w-8 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                              isVisible 
                                ? 'bg-indigo-600 text-white shadow-3xs scale-105 font-bold' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                            }`}
                            title={t(`schedule_${dayKey.substring(0, 3)}` as any)}
                          >
                            {dayAbbreviation(dayKey)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Forward Day Button */}
                    <button
                      type="button"
                      disabled={startDayIndex >= 4}
                      onClick={() => setStartDayIndex(prev => Math.min(4, prev + 1))}
                      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer animate-fade-in"
                    >
                      {t('schedule_next_day')}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>

              </div>

              {/* Table container with horizontal overflow disabled to enforce slide buttons */}
              <div className="overflow-x-hidden overflow-y-auto max-h-[500px] relative rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-100">
                      <th className="sticky top-0 left-0 bg-slate-50/95 z-40 px-6 py-4 text-xs font-mono text-slate-400 font-bold uppercase tracking-wider min-w-[200px] border-r border-b border-slate-100 shadow-[2px_2px_5px_-2px_rgba(0,0,0,0.05)]">
                        {t('schedule_employee')}
                      </th>
                      {visibleWeekDays.map(day => (
                        <th key={day.key} className="sticky top-0 bg-slate-50/95 z-30 px-4 py-4 text-xs font-mono text-slate-400 font-bold uppercase tracking-wider text-center min-w-[150px] border-b border-slate-100">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-slate-700 font-bold">
                              {t(`schedule_${day.key.substring(0, 3)}` as any)}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50/80 px-2 py-0.5 rounded-md mt-1 border border-indigo-100/50">
                              {day.formattedDate}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={visibleWeekDays.length + 1} className="px-6 py-12 text-center text-slate-400 text-xs">
                          {t('no_results')}
                        </td>
                      </tr>
                    ) : (
                      localSchedules.map((sched) => {
                        const emp = activePorters.find(e => e.id === sched.employeeId);
                        return (
                          <tr key={sched.employeeId} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="sticky left-0 bg-white group-hover:bg-slate-50/95 z-10 px-6 py-4 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800">{sched.employeeName}</span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                                  {emp ? emp.role : 'Staff'} • {emp?.employeeNumber ? `#${emp.employeeNumber}` : ''}
                                </span>
                              </div>
                            </td>
                            
                            {/* Days of the Week Cells */}
                            {visibleWeekDays.map(day => {
                              const cellVal = sched[day.key] || '';
                              const isException = isExceptionShift(cellVal, emp?.shift);

                              return (
                                <td key={day.key} className="px-2 py-3 text-center min-w-[165px]">
                                  <div className="flex flex-col gap-1 items-center">
                                    <div className="relative flex items-center gap-1 w-full">
                                      <select
                                        value={cellVal === '__CUSTOM_EXCEPTION__' ? '__CUSTOM_EXCEPTION__' : (shiftOptions.includes(cellVal) ? cellVal : cellVal)}
                                        onChange={(e) => {
                                          if (e.target.value === '__CUSTOM_EXCEPTION__') {
                                            openExceptionModal(
                                              sched.employeeId,
                                              sched.employeeName,
                                              day.key,
                                              day.formattedDate,
                                              t(`schedule_${day.key.substring(0, 3)}` as any),
                                              cellVal
                                            );
                                          } else {
                                            handleCellChange(sched.employeeId, day.key, e.target.value);
                                          }
                                        }}
                                        className={`w-full text-xs font-bold py-1.5 px-2 rounded-lg border shadow-3xs cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all ${getShiftBadgeStyle(cellVal, isException)}`}
                                      >
                                        <option value="FOLGA">{language === 'en' ? 'OFF' : 'FOLGA'}</option>
                                        {shiftOptions.filter(s => s !== 'FOLGA' && s !== 'OFF').map(sh => (
                                          <option key={sh} value={sh}>{sh}</option>
                                        ))}
                                        {!shiftOptions.includes(cellVal) && cellVal !== 'FOLGA' && cellVal !== 'OFF' && cellVal !== '' && (
                                          <option value={cellVal}>⚡ {cellVal}</option>
                                        )}
                                        <option value="__CUSTOM_EXCEPTION__" className="font-bold text-amber-700 bg-amber-50">
                                          {t('schedule_exception_custom_opt')}
                                        </option>
                                      </select>

                                      {/* Clock / Edit Exception Quick Button */}
                                      <button
                                        type="button"
                                        onClick={() => openExceptionModal(
                                          sched.employeeId,
                                          sched.employeeName,
                                          day.key,
                                          day.formattedDate,
                                          t(`schedule_${day.key.substring(0, 3)}` as any),
                                          cellVal
                                        )}
                                        title={language === 'en' ? 'Adjust individual time / temporary exception' : language === 'es' ? 'Ajustar horario individual / excepción temporal' : 'Ajustar horário individual / exceção temporária'}
                                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex-shrink-0 ${
                                          isException
                                            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 shadow-3xs'
                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                                        }`}
                                      >
                                        {isException ? <Sparkles className="w-3.5 h-3.5 text-amber-600" /> : <Clock className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>

                                    {isException && (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shadow-3xs">
                                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                        {t('schedule_exception_badge')}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 font-mono">
                  {localSchedules.length} {t('schedule_employee').toLowerCase()}(s)
                </span>
                <button
                  onClick={handleSaveAllGrid}
                  className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  {t('schedule_save_all')}
                </button>
              </div>

            </div>
          );
        })()
      ) : (
        /* SPREADSHEET IMPORT WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form & paste area */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-800">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold">{t('schedule_copy_paste_btn')}</h2>
            </div>
            
            <p className="text-slate-500 text-xs leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-150/50">
              {language === 'en' 
                ? 'Open your spreadsheet (Excel, Google Sheets), select the employee column and the 7 days column (Monday through Sunday), copy them (Ctrl+C), and paste them into the box below.' 
                : language === 'es' 
                ? 'Abra su planilla (Excel, Google Sheets), seleccione la columna de empleado y las 7 de lunes a domingo, cópielas (Ctrl+C) y péguelas en el cuadro de abajo.' 
                : 'Abra sua planilha (Excel, Google Sheets), selecione a coluna de funcionário e as 7 colunas de segunda a domingo, copie-as (Ctrl+C) e cole-as na caixa abaixo.'
              }
            </p>

            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={t('schedule_paste_placeholder')}
              className="w-full h-64 bg-slate-50 text-xs font-mono p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none shadow-3xs transition-all"
            />

            {parseError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] font-semibold">{parseError}</span>
              </div>
            )}

            <button
              onClick={handleParseText}
              className="flex items-center justify-center gap-1.5 text-xs font-bold bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Copy className="w-4 h-4" />
              {language === 'en' ? 'Analyze Spreadsheet' : language === 'es' ? 'Analizar Planilla' : 'Analisar Planilha'}
            </button>
          </div>

          {/* Mapping preview and editor */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {parsedRows.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col gap-4 p-6">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-sm font-bold text-slate-800">{t('schedule_match_preview')}</h2>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full font-mono">
                    {parsedRows.length} {t('schedule_imported_rows')}
                  </span>
                </div>

                <p className="text-slate-400 text-[11px]">
                  {language === 'en'
                    ? 'Review the mappings below. The system automatically associated rows with database records based on name similarity. You can adjust mappings manually.'
                    : language === 'es'
                    ? 'Revise las asignaciones a continuación. El sistema asoció automáticamente las filas con los empleados de la base de datos por similitud. Puede cambiarlos manualmente.'
                    : 'Revise os mapeamentos abaixo. O sistema associou as linhas automaticamente com funcionários do banco de dados por similaridade. Ajuste caso necessário.'
                  }
                </p>

                {/* Previews List */}
                <div className="flex flex-col gap-3.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                  {parsedRows.map((row, idx) => {
                    const isMatched = !!row.matchedEmployeeId;
                    return (
                      <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all ${isMatched ? 'bg-slate-50/50 border-slate-100' : 'bg-amber-50/20 border-amber-200/50'}`}>
                        
                        {/* Header Mapping Selection */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                              {language === 'en' ? 'Pasted Row Name' : language === 'es' ? 'Nombre en Planilla' : 'Nome na Planilha'}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{row.pastedName}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">👉</span>
                            <select
                              value={row.matchedEmployeeId}
                              onChange={(e) => {
                                const newRows = [...parsedRows];
                                newRows[idx].matchedEmployeeId = e.target.value;
                                setParsedRows(newRows);
                              }}
                              className={`text-xs font-bold py-1 px-2.5 rounded-lg border shadow-3xs cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all ${isMatched ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                            >
                              <option value="">
                                {language === 'en' ? '-- Deselect / Ignore --' : language === 'es' ? '-- Ignorar Fila --' : '-- Ignorar Linha --'}
                              </option>
                              {activePorters.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Shift Previews in row */}
                        <div className="grid grid-cols-7 gap-1 bg-white p-2 rounded-lg border border-slate-100 text-center">
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                            const val = (row as any)[day];
                            return (
                              <div key={day} className="flex flex-col gap-0.5">
                                <span className="text-[9px] text-slate-400 font-mono uppercase">
                                  {t(`schedule_${day.substring(0, 3)}` as any)}
                                </span>
                                <span className={`text-[9px] font-bold py-0.5 rounded-sm border truncate block ${getShiftBadgeStyle(val)}`} title={val}>
                                  {val || '-'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Confirm Action Trigger */}
                <button
                  onClick={handleConfirmImport}
                  className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  {language === 'en' ? 'Confirm and Save All' : language === 'es' ? 'Confirmar y Guardar Todo' : 'Confirmar e Salvar Escala'}
                </button>

              </div>
            ) : (
              /* Waiting state */
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl h-80 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <FileText className="w-10 h-10 stroke-[1.5] mb-2 text-slate-300" />
                <h3 className="text-xs font-bold text-slate-600">
                  {language === 'en' ? 'Awaiting Spreadsheet analysis' : language === 'es' ? 'Esperando análisis de planilla' : 'Aguardando análise de planilha'}
                </h3>
                <p className="text-[11px] mt-1 max-w-sm">
                  {language === 'en' 
                    ? 'Paste your spreadsheet cell selections and click the analyze button to map them with your registered employees.'
                    : language === 'es'
                    ? 'Pegue la selección de celdas y presione el botón de análisis para emparejarlas con la lista de personal registrado.'
                    : 'Cole a seleção de células da planilha e clique no botão de analisar para visualizar o mapeamento com os funcionários cadastrados.'
                  }
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Individual Shift Time Adjustment & Temporary Exception Modal */}
      {editingExceptionCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1e2330] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in flex flex-col gap-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center border border-amber-200 dark:border-amber-800 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                    {t('schedule_exception_title')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <strong>{editingExceptionCell.employeeName}</strong> • {editingExceptionCell.dayName}, {editingExceptionCell.dayFormattedDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingExceptionCell(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {t('schedule_exception_desc')}
            </p>

            {/* Quick Exception Preset Chips */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {t('schedule_exception_reason_lbl')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Troca de Turno', icon: '🔄' },
                  { label: 'Hora Extra', icon: '⏱️' },
                  { label: 'Cobertura de Escala', icon: '🛡️' },
                  { label: 'Treinamento / Reunião', icon: '🎓' },
                  { label: 'Escala Especial', icon: '⚡' },
                  { label: 'Horário Reduzido', icon: '⏳' }
                ].map((preset) => {
                  const isActive = exceptionPreset === preset.label;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setExceptionPreset(preset.label);
                        setCustomText(`${startTime} - ${endTime} (${preset.label})`);
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs scale-[1.02]'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Pickers (Start / End) */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {t('schedule_exception_start_lbl')}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setStartTime(newStart);
                    setCustomText(`${newStart} - ${endTime} (${exceptionPreset})`);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {t('schedule_exception_end_lbl')}
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    const newEnd = e.target.value;
                    setEndTime(newEnd);
                    setCustomText(`${startTime} - ${newEnd} (${exceptionPreset})`);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Formatted Shift Label / Custom Freeform Edit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Rótulo do Horário de Exceção:</span>
                <span className="text-[10px] text-slate-400 font-normal">(Personalizável)</span>
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex: 08:00 - 17:00 (Troca com Maria)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Exception Notes / Justification */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {t('schedule_exception_note_lbl')}
              </label>
              <input
                type="text"
                value={exceptionNote}
                onChange={(e) => setExceptionNote(e.target.value)}
                placeholder="Ex: Substituição temporária aprovada pelo supervisor"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Apply Scope Checkbox */}
            <label className="flex items-center gap-2 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/60 cursor-pointer">
              <input
                type="checkbox"
                checked={applyToWholeWeek}
                onChange={(e) => setApplyToWholeWeek(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md border-amber-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Aplicar esta exceção de horário para todos os dias da semana deste funcionário
              </span>
            </label>

            {/* Action Buttons Footer */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClearException}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
              >
                {t('schedule_exception_clear_btn')}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExceptionCell(null)}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyException}
                  className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('schedule_exception_apply_btn')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
                Permissão negada. Somente o funcionário <strong>Daniel Gomes</strong> (Moderador & Administrador do Sistema) tem autorização para alterar ou importar escalas de trabalho dos colaboradores.
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
