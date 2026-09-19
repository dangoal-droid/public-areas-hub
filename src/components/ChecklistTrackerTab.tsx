import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyChecklist, ChecklistTask } from '../types';
import { 
  getLocalizedTask, 
  getLocalizedEnvironmentName, 
  getLocalizedRole, 
  getLocalizedShift, 
  getLocalizedCoverageTime,
  getLocalizedFrequency,
  groupChecklistTasks,
  GroupedChecklistTask,
  compareEnvironmentsNumerically,
  sortEnvironmentNameString
} from '../data/taskTranslations';
import { jsPDF } from 'jspdf';
import { 
  Search, 
  MapPin, 
  Clock, 
  Radio, 
  Key, 
  ShoppingCart, 
  Calendar, 
  CheckCircle, 
  Clock3, 
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Trash2,
  Check,
  Edit2,
  ChevronRight,
  User,
  Plus,
  ClipboardList,
  FileText,
  Share2,
  Mail,
  Copy,
  Download,
  X,
  ExternalLink,
  Cloud,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface ChecklistTrackerTabProps {
  selectedChecklistId: string;
  onClearSelectedChecklist: () => void;
  onSelectChecklist: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const ChecklistTrackerTab: React.FC<ChecklistTrackerTabProps> = ({ 
  selectedChecklistId, 
  onClearSelectedChecklist,
  onSelectChecklist,
  onNavigateToTab
}) => {
  const { checklists, toggleTaskCompletion, deleteChecklist, updateChecklist, t, language, employees, environments, taskTemplates, customLogo, updateCustomLogo } = useApp();

  // Filters state
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterShift, setFilterShift] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom delete confirmation state
  const [deletingChecklistId, setDeletingChecklistId] = useState<string | null>(null);

  // Editing checklist attributes state
  const [editingChecklist, setEditingChecklist] = useState<DailyChecklist | null>(null);
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editShift, setEditShift] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editIntervalTime, setEditIntervalTime] = useState('');
  const [editCoverageTime, setEditCoverageTime] = useState('');
  const [editCartNumber, setEditCartNumber] = useState('');
  const [editRadioNumber, setEditRadioNumber] = useState('');
  const [editKeyNumber, setEditKeyNumber] = useState('');
  const [editSelectedEnvironmentIds, setEditSelectedEnvironmentIds] = useState<string[]>([]);
  const [editReloadTasks, setEditReloadTasks] = useState(false);

  // Editing individual task notes
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tempNotesInput, setTempNotesInput] = useState('');

  // General observations editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [generalNotesField, setGeneralNotesField] = useState('');

  // State initialization for editing a checklist
  const handleStartEditChecklist = (checklist: DailyChecklist) => {
    setEditingChecklist(checklist);
    setEditEmployeeId(checklist.employeeId);
    setEditShift(checklist.shift);
    setEditDate(checklist.date);
    setEditIntervalTime(checklist.intervalTime || '');
    setEditCoverageTime(checklist.coverageTime || '');
    setEditCartNumber(checklist.cartNumber || '');
    setEditRadioNumber(checklist.radioNumber || '');
    setEditKeyNumber(checklist.keyNumber || '');
    
    // Parse environments as array
    const envIds = checklist.environmentId ? checklist.environmentId.split(',') : [];
    setEditSelectedEnvironmentIds(envIds);
    setEditReloadTasks(false);
  };

  const handleSaveEditedChecklist = () => {
    if (!editingChecklist) return;

    const matchedEmployee = employees.find(e => e.id === editEmployeeId);
    if (!matchedEmployee) return;

    // Compile environments
    const selectedEnvs = environments.filter(env => editSelectedEnvironmentIds.includes(env.id));
    selectedEnvs.sort((a, b) => compareEnvironmentsNumerically(a.name, b.name));
    const combinedEnvNames = selectedEnvs.map(env => env.name).join(', ');

    // Compile and reload tasks if requested
    let updatedTasks = [...editingChecklist.tasks];
    if (editReloadTasks && selectedEnvs.length > 0) {
      // Find all routine tasks corresponding to the selected environments
      const runtimeTemplates = taskTemplates.filter(
        t => t.type === 'routine' && t.environmentId && editSelectedEnvironmentIds.includes(t.environmentId)
      );

      // Map templates to ChecklistTasks
      const mappedTasks: ChecklistTask[] = runtimeTemplates.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        completed: false
      }));

      // Merge avoiding duplicates
      const existingTitles = new Set(updatedTasks.map(t => t.title.toLowerCase()));
      const existingIds = new Set(updatedTasks.map(t => t.id));

      const newUnique = mappedTasks.filter(
        t => !existingIds.has(t.id) && !existingTitles.has(t.title.toLowerCase())
      );

      updatedTasks = [...updatedTasks, ...newUnique];
    }

    // Update through context
    updateChecklist(editingChecklist.id, {
      employeeId: editEmployeeId,
      employeeName: matchedEmployee.name,
      employeeRole: matchedEmployee.role,
      shift: editShift,
      date: editDate,
      intervalTime: editIntervalTime,
      coverageTime: editCoverageTime,
      cartNumber: editCartNumber,
      radioNumber: editRadioNumber,
      keyNumber: editKeyNumber,
      environmentId: editSelectedEnvironmentIds.join(','),
      environmentName: combinedEnvNames,
      tasks: updatedTasks
    });

    setEditingChecklist(null);
  };

  // Find currently active checklist
  const activeChecklist = checklists.find(c => c.id === selectedChecklistId);

  // Handle single checklist change helpers
  const handleToggleTask = (checklistId: string, taskId: string, prevCompleted: boolean) => {
    toggleTaskCompletion(checklistId, taskId, !prevCompleted);
  };

  const handleSaveIndividualTaskNote = (checklistId: string, taskId: string) => {
    toggleTaskCompletion(checklistId, taskId, true, tempNotesInput);
    setEditingTaskId(null);
    setTempNotesInput('');
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Custom uploaded logo notification state
  const [logoUploadNotice, setLogoUploadNotice] = useState<string>('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'en' ? 'Logo image file must be smaller than 8MB' : language === 'es' ? 'El archivo del logo debe ser menor a 8MB' : 'O arquivo do logotipo deve ser menor que 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1200;
          let w = img.width || 800;
          let h = img.height || 400;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const optimizedDataUrl = canvas.toDataURL('image/png');
            updateCustomLogo(optimizedDataUrl);
          } else {
            updateCustomLogo(dataUrl);
          }
        } catch (err) {
          updateCustomLogo(dataUrl);
        }

        setLogoUploadNotice(language === 'en' ? 'Custom logo saved and synchronized to all devices!' : language === 'es' ? '¡Logo guardado y sincronizado en todos los dispositivos!' : 'Logotipo salvo e sincronizado para todos os dispositivos!');
        setTimeout(() => setLogoUploadNotice(''), 5000);
      };
      img.onerror = () => {
        updateCustomLogo(dataUrl);
        setLogoUploadNotice(language === 'en' ? 'Custom logo saved and synchronized to all devices!' : language === 'es' ? '¡Logo guardado y sincronizado en todos los dispositivos!' : 'Logotipo salvo e sincronizado para todos os dispositivos!');
        setTimeout(() => setLogoUploadNotice(''), 5000);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    updateCustomLogo(null);
    setLogoUploadNotice(language === 'en' ? 'Logo restored to default on all devices' : language === 'es' ? 'Logo restaurado al predeterminado en todos los dispositivos' : 'Logotipo restaurado para o padrão em todos os dispositivos');
    setTimeout(() => setLogoUploadNotice(''), 3000);
  };

  const currentLogoUrl = customLogo || '/silver-sevens-logo.svg';

  const loadLogoImageAsDataUrl = (): Promise<string> => {
    return new Promise((resolve) => {
      const storedLogo = customLogo || localStorage.getItem('gestao_custom_logo') || localStorage.getItem('custom_checklist_logo');
      if (storedLogo) {
        // If custom logo is already a data URL (PNG/JPEG/SVG base64), return it directly
        if (storedLogo.startsWith('data:image/png') || storedLogo.startsWith('data:image/jpeg') || storedLogo.startsWith('data:image/webp') || storedLogo.startsWith('data:image/svg')) {
          resolve(storedLogo);
          return;
        }
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 1100;
          canvas.height = img.height || 600;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(storedLogo || '');
          }
        } catch (e) {
          resolve(storedLogo || '');
        }
      };
      img.onerror = () => {
        resolve(storedLogo || '');
      };
      img.src = storedLogo || '/silver-sevens-logo.svg';
    });
  };

  const generatePDFDoc = (checklist: DailyChecklist, logoDataUrl?: string) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const marginX = 4;
    let currentY = 8;

    const drawLine = (y: number, color = '#cbd5e1') => {
      doc.setDrawColor(color);
      doc.setLineWidth(0.2);
      doc.line(marginX, y, 210 - marginX, y);
    };

    // Header Board - Light background to keep logo and header text crisp
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.rect(marginX, currentY, 210 - (marginX * 2), 20, 'FD');

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const titleText = 'DAILY EVS PORTER CHECKLIST';
    doc.text(titleText, marginX + 3.5, currentY + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139); // slate-500
    const systemText = 'PUBLIC AREAS WORKFLOW MANAGEMENT';
    doc.text(systemText, marginX + 3.5, currentY + 14);

    // Silver Sevens Logo on the right side of PDF header
    const logoX = 210 - marginX - 35;
    const logoY = currentY + 2.5;

    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', logoX, logoY, 32, 15);
      } catch (e) {
        // Silent catch
      }
    }

    currentY += 23.5;

    // Operator Details Block (Compact single box)
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(marginX, currentY, 210 - (marginX * 2), 28, 'FD');

    // Row 1
    // Column 1: Employee Name
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text(language === 'en' ? 'EMPLOYEE NAME:' : language === 'es' ? 'NOMBRE DEL EMPLEADO:' : 'NOME DO COLABORADOR:', marginX + 3, currentY + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(8);
    doc.text(checklist.employeeName, marginX + 3, currentY + 8.5);

    // Column 2: Role / Function
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(language === 'en' ? 'ROLE / FUNCTION:' : language === 'es' ? 'CARGO / FUNCIÓN:' : 'CARGO / FUNÇÃO:', marginX + 60, currentY + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(getLocalizedRole(checklist.employeeRole, language), marginX + 60, currentY + 8.5);

    // Column 3: Work Shift
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(language === 'en' ? 'WORK SHIFT:' : language === 'es' ? 'TURNO:' : 'TURNO:', marginX + 116, currentY + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(getLocalizedShift(checklist.shift, language), marginX + 116, currentY + 8.5);

    // Column 4: Operation Date
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(language === 'en' ? 'OPERATION DATE:' : language === 'es' ? 'FECHA OPERACIÓN:' : 'DATA OPERAÇÃO:', marginX + 160, currentY + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    const formattedDate = new Date(checklist.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR');
    doc.text(formattedDate, marginX + 160, currentY + 8.5);

    // Divider line between rows
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.15);
    doc.line(marginX + 2, currentY + 11, 210 - marginX - 2, currentY + 11);

    // Row 2
    // Column 1: Assigned Workplace
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(language === 'en' ? 'ASSIGNED WORKPLACE:' : language === 'es' ? 'ÁREA DE TRABAJO:' : 'AMBIENTE RESPONSÁVEL:', marginX + 3, currentY + 15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    const localizedEnv = getLocalizedEnvironmentName(checklist.environmentName, language);
    const anchorArea = localizedEnv.replace(/\s*\([^)]*\)/g, "").trim();
    const splitEnv = doc.splitTextToSize(anchorArea, 108);
    doc.text(splitEnv, marginX + 3, currentY + 18.8);

    // Column 2: Interval Break
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(language === 'en' ? 'PLANNED BREAK:' : language === 'es' ? 'HORA DESCANSO:' : 'HORÁRIO DE INTERVALO:', marginX + 116, currentY + 15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(checklist.intervalTime || (language === 'en' ? 'Not configured' : language === 'es' ? 'Sin definir' : 'Não definido'), marginX + 116, currentY + 18.8);

    // Column 3: Break Coverage
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(language === 'en' ? 'BREAK COVERAGE:' : language === 'es' ? 'COBERTURA TURNO:' : 'COBERTURA ALMOÇO:', marginX + 160, currentY + 15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    const localizedCoverage = getLocalizedCoverageTime(checklist.coverageTime, language) || (language === 'en' ? 'None designated' : language === 'es' ? 'Ninguna' : 'Nenhuma');
    const splitCoverage = doc.splitTextToSize(localizedCoverage, 42);
    doc.text(splitCoverage, marginX + 160, currentY + 18.8);

    // Divider line between row 2 and equipment row
    doc.line(marginX + 2, currentY + 21.5, 210 - marginX - 2, currentY + 21.5);

    // Row 3: Gear Badges
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${language === 'en' ? 'ALLOCATED GEAR:' : language === 'es' ? 'EQUIPOS ASIGNADOS:' : 'EQUIPAMENTOS ALOCADOS:'}`, marginX + 3, currentY + 25.5);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text(`Radio #: ${checklist.radioNumber || '-'}`, marginX + 54, currentY + 25.5);
    doc.text(`Key #: ${checklist.keyNumber || '-'}`, marginX + 104, currentY + 25.5);
    doc.text(`Cart #: ${checklist.cartNumber || '-'}`, marginX + 152, currentY + 25.5);

    currentY += 32;

    // Activities list header
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(language === 'en' ? 'SCHEDULED ACTIVITIES PERFORMED:' : language === 'es' ? 'ACTIVIDADES PROGRAMADAS REALIZADAS:' : 'TAREFAS E ROTINAS DESEMPENHADAS:', marginX, currentY);

    currentY += 2.5;
    drawLine(currentY, '#0f172a'); // header thick divider
    currentY += 5.5; // Spacing between header divider line and first task

    const allGroupedTasks = groupChecklistTasks(checklist.tasks, language);
    const groupsToShow = allGroupedTasks;

    const availableWidth1Col = 210 - (marginX * 2); // 202mm
    const hasSupervisorRemarks = Boolean(checklist.notes && checklist.notes.trim().length > 0);
    const generalNotes = checklist.notes ? checklist.notes.trim() : '';
    const splitGeneralNotes = hasSupervisorRemarks ? doc.splitTextToSize(generalNotes, availableWidth1Col - 6) : [];
    const boxHeight = hasSupervisorRemarks ? Math.max(9, Math.min(22, (splitGeneralNotes.length * 3.3) + 4)) : 0;

    // Anchor footer permanently at the bottom of the page
    const signatureLineY = 282;
    const gapAboveSignatures = 5;
    const supervisorBoxY = signatureLineY - gapAboveSignatures - boxHeight;
    const supervisorHeaderY = supervisorBoxY - 5.5;
    const maxTasksY = hasSupervisorRemarks ? (supervisorHeaderY - 3) : (signatureLineY - 8); // Absolute lower boundary for tasks on page

    // Helper to calculate exact vertical height of a group for a specific width
    const getGroupHeight = (group: GroupedChecklistTask, width: number): number => {
      let h = 0;
      if (group.isGroup) {
        const completedCount = group.subtasks.filter(st => st.completed).length;
        const totalCount = group.subtasks.length;
        const locFreq = group.frequency ? getLocalizedFrequency(group.frequency, language) : '';
        const freqText = locFreq ? ` [${locFreq}]` : '';
        const titleWithFraction = `${group.parentTitle}${freqText} (${completedCount}/${totalCount})`;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        const splitParentTitle = doc.splitTextToSize(titleWithFraction, width);
        h += (splitParentTitle.length * 4.2);

        group.subtasks.forEach((subtask) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.0);
          const splitSubTitle = doc.splitTextToSize(subtask.bulletText, width - 8);
          h += (splitSubTitle.length * 4.0);
          if (subtask.notes) {
            const noteLabel = language === 'en' ? 'Obs: ' : language === 'es' ? 'Obs: ' : 'Obs: ';
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9.0);
            const splitNote = doc.splitTextToSize(noteLabel + subtask.notes, width - 12);
            h += (splitNote.length * 3.5) + 3.0;
          }
        });
        h += 2;
      } else {
        const task = group.singleTask!;
        const locFreq = (group.frequency || task.frequency) ? getLocalizedFrequency(group.frequency || task.frequency, language) : '';
        const freqText = locFreq ? ` [${locFreq}]` : '';
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        const splitTitle = doc.splitTextToSize(`${task.title}${freqText}`, width - 7);
        h += (splitTitle.length * 4.2);

        if (task.description) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          const splitDesc = doc.splitTextToSize(task.description, width - 7);
          h += (splitDesc.length * 3.8);
        }
        if (task.notes) {
          const noteLabel = language === 'en' ? 'Obs: ' : language === 'es' ? 'Obs: ' : 'Obs: ';
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9.0);
          const splitNote = doc.splitTextToSize(noteLabel + task.notes, width - 10);
          h += (splitNote.length * 3.5) + 3.0;
        }
        h += 2;
      }
      return h;
    };

    if (groupsToShow.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        language === 'en' 
          ? 'No completed activities recorded on this checklist yet.' 
          : language === 'es' 
          ? 'Ninguna actividad completada registrada en esta lista todavía.' 
          : 'Nenhuma atividade concluída registrada neste checklist ainda.',
        marginX,
        currentY + 4
      );
    } else {
      // Calculate total height required if all items are rendered in 1 single column of full width (194mm)
      let total1ColHeight = 0;
      groupsToShow.forEach(g => {
        total1ColHeight += getGroupHeight(g, availableWidth1Col);
      });

      // ONLY use 2 columns if tasks exceed the available space in 1 single column
      const tasksStartY = currentY;
      const useTwoColumns = (tasksStartY + total1ColHeight) > maxTasksY;

      const colGap = 6;
      const colWidth = useTwoColumns ? ((availableWidth1Col - colGap) / 2) : availableWidth1Col;
      const col1X = marginX;
      const col2X = marginX + colWidth + colGap;

      let currentCol = 1;
      let curX = col1X;
      let itemY = tasksStartY;

      groupsToShow.forEach((group) => {
        if (group.isGroup) {
          const completedCount = group.subtasks.filter(st => st.completed).length;
          const totalCount = group.subtasks.length;
          const locFreq = group.frequency ? getLocalizedFrequency(group.frequency, language) : '';
          const freqText = locFreq ? ` [${locFreq}]` : '';
          const titleWithFraction = `${group.parentTitle}${freqText} (${completedCount}/${totalCount})`;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          const splitParentTitle = doc.splitTextToSize(titleWithFraction, colWidth);
          const parentTitleHeight = splitParentTitle.length * 4.2;

          // Estimate min height needed to start group (title + at least 1 subtask ~6.5mm)
          const minGroupStartHeight = parentTitleHeight + 6.5;

          if (useTwoColumns && currentCol === 1 && (itemY + minGroupStartHeight) > maxTasksY) {
            // Column 1 is full! Switch to Column 2
            currentCol = 2;
            curX = col2X;
            itemY = tasksStartY;
          } else if (currentCol === 2 && (itemY + minGroupStartHeight) > maxTasksY) {
            // Overflow to page 2 if needed
            doc.addPage();
            currentCol = 1;
            curX = col1X;
            itemY = 16;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(15, 23, 42);
          doc.text(splitParentTitle, curX, itemY);
          itemY += parentTitleHeight;

          group.subtasks.forEach((subtask) => {
            const splitSubTitle = doc.splitTextToSize(subtask.bulletText, colWidth - 8);
            const subTitleHeight = splitSubTitle.length * 4.0;
            
            let noteHeight = 0;
            let splitNote: string[] = [];
            const noteLabel = language === 'en' ? 'Obs: ' : language === 'es' ? 'Obs: ' : 'Obs: ';
            if (subtask.notes) {
              doc.setFont("helvetica", "italic");
              doc.setFontSize(9.0);
              splitNote = doc.splitTextToSize(noteLabel + subtask.notes, colWidth - 12);
              noteHeight = (splitNote.length * 3.5) + 3.0;
            }

            const totalSubtaskHeight = subTitleHeight + noteHeight;

            // Check if subtask fits in current column
            if (useTwoColumns && currentCol === 1 && (itemY + totalSubtaskHeight) > maxTasksY) {
              // Wrap remaining subtasks of group to Column 2!
              currentCol = 2;
              curX = col2X;
              itemY = tasksStartY;

              // Print group continuation title
              doc.setFont("helvetica", "bold");
              doc.setFontSize(10.5);
              doc.setTextColor(15, 23, 42);
              const contTitle = `${group.parentTitle}${freqText} (${language === 'en' ? 'Cont.' : language === 'es' ? 'Cont.' : 'Cont.'})`;
              const splitContTitle = doc.splitTextToSize(contTitle, colWidth);
              doc.text(splitContTitle, curX, itemY);
              itemY += (splitContTitle.length * 4.2);
            } else if (currentCol === 2 && (itemY + totalSubtaskHeight) > maxTasksY) {
              doc.addPage();
              currentCol = 1;
              curX = col1X;
              itemY = 16;
            }

            const indent = 2;
            if (subtask.completed) {
              doc.setDrawColor(22, 163, 74);
              doc.setFillColor(255, 255, 255);
              doc.rect(curX + indent, itemY - 2.8, 3.2, 3.2, 'FD');
              
              doc.setLineWidth(0.4);
              doc.setDrawColor(22, 163, 74);
              doc.line(curX + indent + 0.6, itemY - 2.2, curX + indent + 2.6, itemY - 0.4);
              doc.line(curX + indent + 2.6, itemY - 2.2, curX + indent + 0.6, itemY - 0.4);
              doc.setLineWidth(0.2);
              doc.setDrawColor(15, 23, 42);
            } else {
              doc.setDrawColor(148, 163, 184);
              doc.setFillColor(255, 255, 255);
              doc.rect(curX + indent, itemY - 2.8, 3.2, 3.2, 'FD');
              doc.setDrawColor(15, 23, 42);
            }

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.0);
            if (subtask.completed) {
              doc.setTextColor(148, 163, 184);
            } else {
              doc.setTextColor(51, 65, 85);
            }
            doc.text(splitSubTitle, curX + indent + 4.8, itemY);
            itemY += subTitleHeight;

            if (subtask.notes && splitNote.length > 0) {
              doc.setFillColor(248, 250, 252);
              const rectHeight = (splitNote.length * 3.5) + 1.8;
              doc.rect(curX + indent + 4, itemY - 1.4, colWidth - 8, rectHeight, 'F');
              doc.setFont("helvetica", "italic");
              doc.setFontSize(9.0);
              doc.setTextColor(79, 70, 229);
              doc.text(splitNote, curX + indent + 5.5, itemY + 0.8);
              itemY += rectHeight + 1.4;
            }
          });

          itemY += 2;
        } else {
          const task = group.singleTask!;
          const locFreq = (group.frequency || task.frequency) ? getLocalizedFrequency(group.frequency || task.frequency, language) : '';
          const freqText = locFreq ? ` [${locFreq}]` : '';

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          const splitTitle = doc.splitTextToSize(`${task.title}${freqText}`, colWidth - 5.5);
          const titleHeight = splitTitle.length * 4.2;

          let descHeight = 0;
          let splitDesc: string[] = [];
          if (task.description) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            splitDesc = doc.splitTextToSize(task.description, colWidth - 5.5);
            descHeight = splitDesc.length * 3.8;
          }

          let notesHeight = 0;
          let splitNote: string[] = [];
          if (task.notes) {
            const noteLabel = language === 'en' ? 'Obs: ' : language === 'es' ? 'Obs: ' : 'Obs: ';
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9.0);
            splitNote = doc.splitTextToSize(noteLabel + task.notes, colWidth - 7.5);
            notesHeight = (splitNote.length * 3.5) + 3.0;
          }

          const totalTaskHeight = titleHeight + descHeight + notesHeight + 2;

          if (useTwoColumns && currentCol === 1 && (itemY + totalTaskHeight) > maxTasksY) {
            currentCol = 2;
            curX = col2X;
            itemY = tasksStartY;
          } else if (currentCol === 2 && (itemY + totalTaskHeight) > maxTasksY) {
            doc.addPage();
            currentCol = 1;
            curX = col1X;
            itemY = 16;
          }

          if (task.completed) {
            doc.setDrawColor(22, 163, 74);
            doc.setFillColor(255, 255, 255);
            doc.rect(curX, itemY - 2.8, 3.2, 3.2, 'FD');

            doc.setLineWidth(0.4);
            doc.setDrawColor(22, 163, 74);
            doc.line(curX + 0.6, itemY - 2.2, curX + 2.6, itemY - 0.4);
            doc.line(curX + 2.6, itemY - 2.2, curX + 0.6, itemY - 0.4);
            doc.setLineWidth(0.2);
            doc.setDrawColor(15, 23, 42);
          } else {
            doc.setDrawColor(148, 163, 184);
            doc.setFillColor(255, 255, 255);
            doc.rect(curX, itemY - 2.8, 3.2, 3.2, 'FD');
            doc.setDrawColor(15, 23, 42);
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          if (task.completed) {
            doc.setTextColor(148, 163, 184);
          } else {
            doc.setTextColor(15, 23, 42);
          }
          doc.text(splitTitle, curX + 5.5, itemY);
          itemY += titleHeight;

          if (task.description && splitDesc.length > 0) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(100, 116, 139);
            doc.text(splitDesc, curX + 5.5, itemY - 0.3);
            itemY += descHeight;
          }

          if (task.notes && splitNote.length > 0) {
            doc.setFillColor(248, 250, 252);
            const rectHeight = (splitNote.length * 3.5) + 1.8;
            doc.rect(curX + 5, itemY - 1.4, colWidth - 7.5, rectHeight, 'F');
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9.0);
            doc.setTextColor(79, 70, 229);
            doc.text(splitNote, curX + 6.5, itemY + 0.8);
            itemY += rectHeight + 1.5;
          }

          itemY += 2;
        }
      });
    }

    // DRAW ANCHORED FOOTER (Supervisor Remarks if present + Signatures permanently on bottom)
    if (hasSupervisorRemarks) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(language === 'en' ? 'SUPERVISOR OPERATIONAL REMARKS:' : language === 'es' ? 'OBSERVACIONES OPERATIVAS DEL SUPERVISOR:' : 'OBSERVAÇÕES OPERACIONAIS DO SUPERVISOR:', marginX, supervisorHeaderY);
      drawLine(supervisorHeaderY + 2.5, '#0f172a');

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(marginX, supervisorBoxY, 210 - (marginX * 2), boxHeight, 'FD');

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(splitGeneralNotes, marginX + 3, supervisorBoxY + 4.5);
    }

    // Signature field anchored at signatureLineY
    const lineSize = 80;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.3);

    // Operator signature line
    doc.line(marginX, signatureLineY, marginX + lineSize, signatureLineY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(checklist.employeeName, marginX + (lineSize / 2), signatureLineY + 3.8, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(language === 'en' ? 'Employee Signature / Rubric' : language === 'es' ? 'Firma o Inicial del Empleado' : 'Assinatura do Colaborador', marginX + (lineSize / 2), signatureLineY + 7.2, { align: 'center' });

    // Supervisor signature line
    doc.line(210 - marginX - lineSize, signatureLineY, 210 - marginX, signatureLineY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(language === 'en' ? 'PUBLIC AREAS SUPERVISOR' : language === 'es' ? 'SUPERVISOR DE ÁREAS PÚBLICAS' : 'SUPERVISOR DE ÁREAS PÚBLICAS', 210 - marginX - (lineSize / 2), signatureLineY + 3.8, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(language === 'en' ? 'Signature / Verification Stamp' : language === 'es' ? 'Firma / Sello de Verificación' : 'Assinatura / Visto de Conferência', 210 - marginX - (lineSize / 2), signatureLineY + 7.2, { align: 'center' });

    return doc;
  };

  const handleDownloadPDF = async (checklist: DailyChecklist) => {
    const logoDataUrl = await loadLogoImageAsDataUrl();
    const doc = generatePDFDoc(checklist, logoDataUrl);
    const sanitizedName = checklist.employeeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    doc.save(`checklist_${sanitizedName}_${checklist.date}.pdf`);
  };

  const handleNativeShare = async (checklist: DailyChecklist) => {
    try {
      const logoDataUrl = await loadLogoImageAsDataUrl();
      const doc = generatePDFDoc(checklist, logoDataUrl);
      const pdfBlob = doc.output('blob');
      const filename = `checklist_${checklist.employeeName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${checklist.date}.pdf`;
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: language === 'en' 
            ? `Daily Checklist - ${checklist.employeeName}` 
            : language === 'es' 
            ? `Checklist Diario - ${checklist.employeeName}` 
            : `Checklist Diário - ${checklist.employeeName}`,
          text: language === 'en' 
            ? `Sending daily checklist sheet for ${checklist.employeeName} (${checklist.date})` 
            : language === 'es' 
            ? `Enviando hoja de control para ${checklist.employeeName} (${checklist.date})` 
            : `Segue o checklist diário de ${checklist.employeeName} (${checklist.date})`,
        });
      } else {
        setIsShareModalOpen(true);
      }
    } catch (err) {
      console.warn("Native sharing not fully supported, showing choices modal:", err);
      setIsShareModalOpen(true);
    }
  };

  const handleCopyToClipboard = (checklist: DailyChecklist) => {
    const totalCount = checklist.tasks.length;
    const completedCount = checklist.tasks.filter(t => t.completed).length;
    const formattedDate = new Date(checklist.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR');
    const generalNotes = checklist.notes || (language === 'en' ? 'None' : language === 'es' ? 'Ninguna' : 'Nenhuma');
    
    let textSummary = '';
    if (language === 'en') {
      textSummary = `📋 DAILY OPERATIONAL CHECKLIST\n-----------------------------\n` +
        `Operator: ${checklist.employeeName}\n` +
        `Role: ${getLocalizedRole(checklist.employeeRole, language)}\n` +
        `Date: ${formattedDate}\n` +
        `Area: ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `Shift: ${getLocalizedShift(checklist.shift, language)}\n` +
        `Custody HT Channel: ${checklist.radioNumber || '-'}\n` +
        `Custody Key ID: ${checklist.keyNumber || '-'}\n` +
        `Progress: ${completedCount}/${totalCount} completed tasks\n` +
        `Supervisor Notes: ${generalNotes}\n\n` +
        `Tasks Summary:\n` +
        checklist.tasks.map(t => {
          const lt = getLocalizedTask(t, language);
          const freqStr = t.frequency ? ` [${getLocalizedFrequency(t.frequency, language)}]` : '';
          return `${lt.completed ? '[X]' : '[ ]'} ${lt.title}${freqStr}${lt.notes ? ` (Note: ${lt.notes})` : ''}`;
        }).join('\n');
    } else if (language === 'es') {
      textSummary = `📋 HOJA DE CHECKLIST OPERATIVO\n-----------------------------\n` +
        `Empleado: ${checklist.employeeName}\n` +
        `Cargo: ${getLocalizedRole(checklist.employeeRole, language)}\n` +
        `Fecha: ${formattedDate}\n` +
        `Área de Trabajo: ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `Turno: ${getLocalizedShift(checklist.shift, language)}\n` +
        `Custodia Radio: ${checklist.radioNumber || '-'}\n` +
        `Custodia Llave: ${checklist.keyNumber || '-'}\n` +
        `Progreso: ${completedCount}/${totalCount} completadas\n` +
        `Notas de Supervisión: ${generalNotes}\n\n` +
        `Resumen de Actividades:\n` +
        checklist.tasks.map(t => {
          const lt = getLocalizedTask(t, language);
          const freqStr = t.frequency ? ` [${getLocalizedFrequency(t.frequency, language)}]` : '';
          return `${lt.completed ? '[X]' : '[ ]'} ${lt.title}${freqStr}${lt.notes ? ` (Obs: ${lt.notes})` : ''}`;
        }).join('\n');
    } else {
      textSummary = `📋 RELATÓRIO DO CHECKLIST DIÁRIO\n-----------------------------\n` +
        `Colaborador: ${checklist.employeeName}\n` +
        `Cargo: ${getLocalizedRole(checklist.employeeRole, language)}\n` +
        `Data: ${formattedDate}\n` +
        `Ambiente: ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `Turno: ${getLocalizedShift(checklist.shift, language)}\n` +
        `Rádio HT: ${checklist.radioNumber || '-'}\n` +
        `Chave Claviculário: ${checklist.keyNumber || '-'}\n` +
        `Progresso: ${completedCount}/${totalCount} concluídas\n` +
        `Notas do Supervisor: ${generalNotes}\n\n` +
        `Resumo das Atividades:\n` +
        checklist.tasks.map(t => {
          const lt = getLocalizedTask(t, language);
          const freqStr = t.frequency ? ` [${getLocalizedFrequency(t.frequency, language)}]` : '';
          return `${lt.completed ? '[X]' : '[ ]'} ${lt.title}${freqStr}${lt.notes ? ` (Obs: ${lt.notes})` : ''}`;
        }).join('\n');
    }

    navigator.clipboard.writeText(textSummary);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const getEmailLink = (checklist: DailyChecklist) => {
    const totalCount = checklist.tasks.length;
    const completedCount = checklist.tasks.filter(t => t.completed).length;
    const formattedDate = new Date(checklist.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR');
    const generalNotes = checklist.notes || (language === 'en' ? 'None' : language === 'es' ? 'Ninguna' : 'Nenhuma');

    let subject = '';
    let body = '';

    if (language === 'en') {
      subject = `Daily Operational Checklist - ${checklist.employeeName} (${formattedDate})`;
      body = `Hello,\n\nPlease find the daily operational work checklist sheet for ${checklist.employeeName} on ${formattedDate}.\n\n` +
        `Workplace Area: ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `Current Shift: ${getLocalizedShift(checklist.shift, language)}\n` +
        `Completed Tasks: ${completedCount}/${totalCount}\n` +
        `Supervisor Notes: ${generalNotes}\n\n` +
        `You can generate and download the complete PDF and signatures within the Facilities Profile Management dashboard.\n\n` +
        `Best regards,\nPublic Areas Supervisor`;
    } else if (language === 'es') {
      subject = `Checklist Operativo Diario - ${checklist.employeeName} (${formattedDate})`;
      body = `Hola,\n\nComparto de manera formal el checklist operativo diario de ${checklist.employeeName} correspondiente al ${formattedDate}.\n\n` +
        `Área Designada: ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `Turno de Trabajo: ${getLocalizedShift(checklist.shift, language)}\n` +
        `Tareas Concluidas: ${completedCount}/${totalCount}\n` +
        `Observaciones del Supervisor: ${generalNotes}\n\n` +
        `El PDF con diseño físico imprimible y firmas registradas se encuentra listo para descargar dentro del panel principal.\n\n` +
        `Atentamente,\nSupervisor de Áreas Públicas`;
    } else {
      subject = `Checklist Operacional Diário - ${checklist.employeeName} (${formattedDate})`;
      body = `Olá,\n\nCompartilho de forma oficial o checklist operacional diário de ${checklist.employeeName} referente à data de ${formattedDate}.\n\n` +
        `Ambiente Vinculado: ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `Turno Ativo: ${getLocalizedShift(checklist.shift, language)}\n` +
        `Progresso de Atividades: ${completedCount}/${totalCount} concluídas\n` +
        `Observações do Supervisor: ${generalNotes}\n\n` +
        `O relatório em PDF estruturado com as assinaturas e o visto de conferência se encontra disponível para extração no painel.\n\n` +
        `Atenciosamente,\nSupervisor de Áreas Públicas`;
    }

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getWhatsAppLink = (checklist: DailyChecklist) => {
    const totalCount = checklist.tasks.length;
    const completedCount = checklist.tasks.filter(t => t.completed).length;
    const formattedDate = new Date(checklist.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR');
    const generalNotes = checklist.notes || (language === 'en' ? 'None' : language === 'es' ? 'Ninguna' : 'Nenhuma');

    let text = '';
    if (language === 'en') {
      text = `*📋 DAILY WORK CHECKLIST SHEET*\n` +
        `-----------------------------\n` +
        `*Operator:* ${checklist.employeeName}\n` +
        `*Date:* ${formattedDate}\n` +
        `*Area:* ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `*Shift:* ${getLocalizedShift(checklist.shift, language)}\n` +
        `*Progress:* ${completedCount}/${totalCount} completed\n` +
        `*Notes:* _${generalNotes}_`;
    } else if (language === 'es') {
      text = `*📋 REPORTE DE CHECKLIST DIARIO*\n` +
        `-----------------------------\n` +
        `*Empleado:* ${checklist.employeeName}\n` +
        `*Fecha:* ${formattedDate}\n` +
        `*Área:* ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `*Turno:* ${getLocalizedShift(checklist.shift, language)}\n` +
        `*Progreso:* ${completedCount}/${totalCount} completadas\n` +
        `*Notes:* _${generalNotes}_`;
    } else {
      text = `*📋 REPORT DE CHECKLIST DIÁRIO*\n` +
        `-----------------------------\n` +
        `*Colaborador:* ${checklist.employeeName}\n` +
        `*Data:* ${formattedDate}\n` +
        `*Setor:* ${getLocalizedEnvironmentName(checklist.environmentName, language)}\n` +
        `*Turno:* ${getLocalizedShift(checklist.shift, language)}\n` +
        `*Progresso:* ${completedCount}/${totalCount} concluídas\n` +
        `*Notas:* _${generalNotes}_`;
    }

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleDeleteChecklistClick = (id: string) => {
    setDeletingChecklistId(id);
  };

  const handleConfirmDeleteChecklist = () => {
    if (deletingChecklistId) {
      deleteChecklist(deletingChecklistId);
      onClearSelectedChecklist();
      setDeletingChecklistId(null);
    }
  };

  const handleDeleteChecklistDummy = (id: string) => {
    const confirmationMsg = language === 'en' 
      ? 'Are you sure you want to permanently delete this daily checklist?' 
      : language === 'es' 
      ? '¿Está seguro de que desea eliminar permanentemente este checklist diario?' 
      : 'Tem certeza de que deseja excluir este checklist diário?';
      
    if (confirm(confirmationMsg)) {
      deleteChecklist(id);
      onClearSelectedChecklist();
    }
  };

  const handleSaveGeneralDetails = (id: string) => {
    updateChecklist(id, { notes: generalNotesField });
    setIsEditingNotes(false);
  };

  // Filter roster shifts comparison
  const filteredChecklists = checklists.filter(ch => {
    const matchDate = !filterDate || ch.date === filterDate;
    
    // Support shift check across languages
    let matchShift = true;
    if (filterShift !== 'Todos' && filterShift !== 'All') {
      const isMorningSelected = filterShift === 'Manhã' || filterShift === 'Morning';
      const isAfternoonSelected = filterShift === 'Tarde' || filterShift === 'Afternoon';
      const isNightSelected = filterShift === 'Noite' || filterShift === 'Night';
      
      const chShiftLower = ch.shift.toLowerCase();
      if (isMorningSelected) {
        matchShift = chShiftLower.includes('manhã') || chShiftLower.includes('morn') || chShiftLower.includes('mañ');
      } else if (isAfternoonSelected) {
        matchShift = chShiftLower.includes('tarde') || chShiftLower.includes('after') || chShiftLower.includes('tard');
      } else if (isNightSelected) {
        matchShift = chShiftLower.includes('noite') || chShiftLower.includes('night') || chShiftLower.includes('noch');
      } else {
        matchShift = ch.shift.includes(filterShift);
      }
    }

    const matchStatus = filterStatus === 'Todos' || filterStatus === 'All' || ch.status === filterStatus;
    const matchSearch = !searchQuery || 
      ch.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ch.environmentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchDate && matchShift && matchStatus && matchSearch;
  }).sort((a, b) => {
    const envA = sortEnvironmentNameString(getLocalizedEnvironmentName(a.environmentName, language));
    const envB = sortEnvironmentNameString(getLocalizedEnvironmentName(b.environmentName, language));
    const envCompare = compareEnvironmentsNumerically(envA, envB);
    if (envCompare !== 0) return envCompare;
    return a.employeeName.localeCompare(b.employeeName);
  });

  // Increment/Decrement date
  const handleAdjustDate = (days: number) => {
    const current = new Date(filterDate);
    current.setDate(current.getDate() + days);
    setFilterDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      
      {/* Hide the filter/list interface during paper print */}
      <div className="print:hidden space-y-4">
        {/* Top title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-sans font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                {t('tracker_title')}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <Cloud className="w-3 h-3 text-emerald-600 animate-pulse" />
                {language === 'en' 
                  ? 'Cloud Sync Active' 
                  : language === 'es' 
                  ? 'Sincronización en Nube Activa' 
                  : 'Sincronização Nuvem Ativa'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('tracker_subtitle')}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Custom Logo Upload Control */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <div className="h-8 w-16 flex items-center justify-center bg-slate-50 rounded border border-slate-100 overflow-hidden shrink-0">
                <img 
                  src={currentLogoUrl} 
                  alt="Logo" 
                  className="max-h-7 max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer hover:underline">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{customLogo ? (language === 'en' ? 'Change Logo' : language === 'es' ? 'Cambiar Logo' : 'Alterar Logo') : (language === 'en' ? 'Upload Logo' : language === 'es' ? 'Enviar Logo' : 'Enviar Logotipo')}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {customLogo && (
                  <button 
                    onClick={handleResetLogo}
                    className="text-[10px] text-slate-400 hover:text-red-600 text-left font-medium cursor-pointer"
                  >
                    {language === 'en' ? 'Reset logo' : language === 'es' ? 'Restaurar logo' : 'Restaurar padrão'}
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('new-checklist')}
              className="flex items-center justify-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t('tab_new_checklist')}
            </button>
          </div>
        </div>

        {logoUploadNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-2xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{logoUploadNotice}</span>
          </div>
        )}

        {/* Filters Panel */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Date Filter */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono">
                {language === 'en' ? 'Selected Date' : language === 'es' ? 'Fecha Seleccionada' : 'Data selecionada'}
              </label>
              {filterDate ? (
                <button 
                  onClick={() => setFilterDate('')} 
                  className="text-[10px] text-indigo-600 hover:underline font-semibold"
                >
                  {language === 'en' ? 'All Dates' : language === 'es' ? 'Todas las Fechas' : 'Todas as Datas'}
                </button>
              ) : (
                <button 
                  onClick={() => setFilterDate(new Date().toISOString().split('T')[0])} 
                  className="text-[10px] text-indigo-600 hover:underline font-semibold"
                >
                  {language === 'en' ? 'Select Today' : language === 'es' ? 'Ver Hoy' : 'Ver Hoje'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-slate-50 p-1">
              <button 
                onClick={() => handleAdjustDate(-1)} 
                className="hover:bg-slate-200 text-slate-600 px-1.5 py-1 rounded text-xs font-bold"
                title={language === 'en' ? 'Previous Day' : language === 'es' ? 'Día Anterior' : 'Dia Anterior'}
              >
                ◀
              </button>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full text-xs bg-transparent border-none text-center focus:outline-none p-1 font-semibold text-slate-800"
              />
              <button 
                onClick={() => handleAdjustDate(1)} 
                className="hover:bg-slate-200 text-slate-600 px-1.5 py-1 rounded text-xs font-bold"
                title={language === 'en' ? 'Next Day' : language === 'es' ? 'Día Siguiente' : 'Próximo Dia'}
              >
                ▶
              </button>
            </div>
          </div>

          {/* Shift Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1.5">{t('creator_shift')}</label>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            >
              <option value="Todos">{language === 'en' ? 'All Shifts' : language === 'es' ? 'Todos los Turnos' : 'Todos os Turnos'}</option>
              <option value="Manhã">{language === 'en' ? 'Morning' : language === 'es' ? 'Mañana' : 'Manhã'}</option>
              <option value="Tarde">{language === 'en' ? 'Afternoon' : language === 'es' ? 'Tarde' : 'Tarde'}</option>
              <option value="Noite">{language === 'en' ? 'Night' : language === 'es' ? 'Noche' : 'Noite'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1.5">{language === 'en' ? 'Execution State' : language === 'es' ? 'Estado de Ejecución' : 'Status de Execução'}</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
            >
              <option value="Todos">{language === 'en' ? 'All States' : language === 'es' ? 'Todos los Estados' : 'Todos os Status'}</option>
              <option value="pending">{language === 'en' ? 'Pending (Not Started)' : language === 'es' ? 'Pendiente (No Iniciado)' : 'Pendente (Não Iniciado)'}</option>
              <option value="in_progress">{language === 'en' ? 'In Progress' : language === 'es' ? 'En Curso' : 'Em Andamento'}</option>
              <option value="completed">{language === 'en' ? 'Completed (100%)' : language === 'es' ? 'Completado (100%)' : 'Concluído (100%)'}</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1.5">{language === 'en' ? 'Search Employee or Workplace' : language === 'es' ? 'Buscar Empleado o Espacio' : 'Buscar Colaborador ou Área'}</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Ex: Charles, Lobby...' : language === 'es' ? 'Ex: Carlos, Entrada...' : 'Ex: Maria, Recepção...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Checklist Listing (Left) & Extended Selected Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Checklists List Column (5/12 width) */}
        <div className="lg:col-span-5 space-y-3 print:hidden">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase font-mono">
              {language === 'en' ? 'Checklists Found' : language === 'es' ? 'Fichas Encontradas' : 'Registros Encontrados'} ({filteredChecklists.length})
            </span>
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')} 
                className="text-[10px] text-indigo-600 hover:underline font-semibold"
              >
                {language === 'en' ? 'Clear Date' : language === 'es' ? 'Limpiar Fecha' : 'Limpar Data'}
              </button>
            )}
          </div>

          {filteredChecklists.length === 0 ? (
            <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <div className="text-xs font-semibold text-slate-600">{language === 'en' ? 'No checklists match selected filters' : language === 'es' ? 'Ningún checklist coincide con los filtros' : 'Nenhum checklist corresponde aos filtros'}</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                {language === 'en' ? 'Try adjusting the filters or register a new shift operational checklist now!' : language === 'es' ? '¡Intente ajustar la fecha seleccionada o registre una nueva hoja operacional arriba!' : 'Tente ajustar a data selecionada ou criar uma nova escala operacional na barra superior!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredChecklists.map((ch) => {
                const total = ch.tasks.length;
                const completed = ch.tasks.filter(t => t.completed).length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                const isSelected = ch.id === selectedChecklistId;

                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onSelectChecklist(ch.id);
                      setIsEditingNotes(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/15 shadow-2xs' 
                        : 'border-slate-100 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{ch.employeeName}</h3>
                        <p className="text-xs text-slate-400 font-medium ">{ch.employeeRole} • <span className="font-mono text-[11px] text-slate-500">{ch.shift.split(' ')[0]}</span></p>
                      </div>
                      
                      {/* Badge status */}
                      <div>
                        {ch.status === 'completed' && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                            100% Ok
                          </span>
                        )}
                        {ch.status === 'in_progress' && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-100">
                            {language === 'en' ? 'Active' : language === 'es' ? 'Activo' : 'Ativo'}
                          </span>
                        )}
                        {ch.status === 'pending' && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
                            {language === 'en' ? 'Pending' : language === 'es' ? 'Pendiente' : 'Sem início'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Environment assigned */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-medium truncate">{getLocalizedEnvironmentName(sortEnvironmentNameString(ch.environmentName), language)}</span>
                    </div>

                    {/* Meta equipment tags */}
                    <div className="mt-2.5 flex items-center gap-3 border-t border-slate-100/80 pt-2.5 text-[10px] font-medium text-slate-400">
                      <div className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-cyan-600" /> {language === 'en' ? 'Radio:' : language === 'es' ? 'Radio:' : 'Rádio:'} <strong className="text-slate-600 font-semibold">{ch.radioNumber}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-600" /> {language === 'en' ? 'Keys:' : language === 'es' ? 'Llaves:' : 'Chaves:'} <strong className="text-slate-600 font-semibold">{ch.keyNumber}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3 text-emerald-600" /> {language === 'en' ? 'Cart:' : language === 'es' ? 'Carro:' : 'Kit:'} <strong className="text-slate-600 font-semibold">{ch.cartNumber}</strong>
                      </div>
                    </div>

                    {/* Progress Bar & percentage */}
                    <div className="mt-3.5 flex items-center gap-3">
                      <div className="flex-1 bg-slate-105 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            pct === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 font-mono w-7 text-right">
                        {completed}/{total}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Checklist Detail View (7/12 width) */}
        <div className="lg:col-span-7">
          {!activeChecklist ? (
            <div className="hidden lg:flex flex-col items-center justify-center h-[400px] border border-slate-100 bg-white rounded-xl p-8 text-center text-slate-400">
              <ClipboardList className="w-12 h-12 text-slate-200 mb-3" />
              <h3 className="font-bold text-slate-500">{language === 'en' ? 'No Checklist Selected' : language === 'es' ? 'Ningún Checklist Seleccionado' : 'Nenhum checklist selecionado'}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {language === 'en' ? 'Select a checklist record on the left sidebar to view active operational tasks, add supervisor notes or view printable shift sheets.' : language === 'es' ? 'Seleccione un registro de checklist a la izquierda para ver tareas activas, notas del supervisor u hojas de servicio imprimibles.' : 'Selecione uma guias de checklist na coluna esquerda para visualizar as tarefas de rotinas, observações ou simular a folha física de impressão.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-indigo-150/40 shadow-xs/50 overflow-hidden space-y-0 relative">
              
              {/* Header Top Bar / Actions */}
              <div className="bg-slate-100 border-b border-slate-200 text-slate-900 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold font-sans text-sm border-2 border-indigo-200 shadow-2xs">
                    {activeChecklist.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold leading-tight text-slate-900">{activeChecklist.employeeName}</h2>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">{getLocalizedRole(activeChecklist.employeeRole, language)} • {getLocalizedShift(activeChecklist.shift, language)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Save PDF button */}
                    <button
                      onClick={() => handleDownloadPDF(activeChecklist)}
                      className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 font-semibold text-white px-3 py-2 rounded-lg transition-all shadow-2xs border border-indigo-500 cursor-pointer"
                      title={language === 'en' ? 'Save as vector PDF' : language === 'es' ? 'Exportar como PDF' : 'Salvar como PDF Vetorial'}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Export PDF' : language === 'es' ? 'Gerar PDF' : 'Gerar PDF'}</span>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={() => handleNativeShare(activeChecklist)}
                      className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 font-medium text-slate-700 px-3 py-2 rounded-lg transition-all border border-slate-200 cursor-pointer shadow-2xs"
                      title={language === 'en' ? 'Send or share this checklist file' : language === 'es' ? 'Compartir o enviar este reporte' : 'Encaminhar ou compartilhar este checklist'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'en' ? 'Forward' : language === 'es' ? 'Compartir' : 'Encaminhar'}</span>
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={handleTriggerPrint}
                      className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 font-medium text-slate-700 px-3 py-2 rounded-lg transition-all border border-slate-200 cursor-pointer shadow-2xs"
                      title={language === 'en' ? 'Print service sheet' : language === 'es' ? 'Imprimir hoja de servicio' : 'Imprimir Folha Física de Serviço'}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'en' ? 'Print Sheet' : language === 'es' ? 'Imprimir Ficha' : 'Imprimir'}</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleStartEditChecklist(activeChecklist)}
                      className="flex items-center gap-1.5 text-xs bg-white text-slate-800 hover:bg-slate-50 font-bold px-3 py-2 rounded-lg transition-all border border-slate-200 cursor-pointer shadow-2xs"
                      title={language === 'en' ? 'Edit Checklist Details' : language === 'es' ? 'Editar Datos del Checklist' : 'Editar Dados do Checklist'}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-650" />
                      <span>{language === 'en' ? 'Edit' : language === 'es' ? 'Editar' : 'Editar'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteChecklistClick(activeChecklist.id)}
                      className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg border border-slate-200 cursor-pointer shadow-2xs"
                      title={language === 'en' ? 'Delete checklist' : language === 'es' ? 'Eliminar registro' : 'Excluir Checklist'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Printable sheet container */}
              <div className="p-4 sm:p-6 space-y-4 print:p-0 print:m-0 print:border-none print:shadow-none print:space-y-3">
                
                {/* Print & Sheet Banner Header with Title and Logo on Right */}
                <div className="bg-white border-b-2 border-slate-800 pb-3 mb-3 flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 leading-tight">
                      DAILY EVS PORTER CHECKLIST
                    </h1>
                    <p className="text-[10px] sm:text-xs font-mono font-semibold text-slate-500 mt-0.5">
                      PUBLIC AREAS WORKFLOW MANAGEMENT
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src={currentLogoUrl} 
                      alt="Silver Sevens Hotel & Casino" 
                      className="h-10 sm:h-12 w-auto object-contain max-w-[150px] sm:max-w-[200px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Compact Header Info Box: Operator, Role, Shift, Date, Workplace, Breaks & Gear */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-2 text-xs print:p-2 print:space-y-1.5 print:text-[10px]">
                  {/* Row 1: Personnel & Shift Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5 border-b border-slate-200/60 pb-2 print:pb-1.5">
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Employee Name' : language === 'es' ? 'Nombre del Empleado' : 'Nome do Colaborador'}
                      </span>
                      <strong className="text-xs print:text-[11px] text-slate-900 block truncate font-bold" title={activeChecklist.employeeName}>
                        {activeChecklist.employeeName}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Role / Function' : language === 'es' ? 'Cargo / Función' : 'Cargo / Função'}
                      </span>
                      <span className="text-xs print:text-[10px] font-semibold text-slate-800 block truncate" title={getLocalizedRole(activeChecklist.employeeRole, language)}>
                        {getLocalizedRole(activeChecklist.employeeRole, language)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Work Shift' : language === 'es' ? 'Turno' : 'Turno'}
                      </span>
                      <span className="text-xs print:text-[10px] font-semibold text-slate-800 block truncate">
                        {getLocalizedShift(activeChecklist.shift, language)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Operation Date' : language === 'es' ? 'Fecha Operación' : 'Data Operação'}
                      </span>
                      <span className="text-xs print:text-[10px] font-bold text-slate-900 block">
                        {new Date(activeChecklist.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Workplace, Breaks & Gear */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5 pt-0.5">
                    <div className="col-span-1 sm:col-span-2 print:col-span-2">
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Assigned Workplace' : language === 'es' ? 'Área de Trabajo' : 'Ambiente Responsável'}
                      </span>
                      <span className="text-xs print:text-[10px] font-bold text-indigo-950 block truncate" title={getLocalizedEnvironmentName(sortEnvironmentNameString(activeChecklist.environmentName), language)}>
                        {getLocalizedEnvironmentName(sortEnvironmentNameString(activeChecklist.environmentName), language)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Planned Break' : language === 'es' ? 'Hora Descanso' : 'Horário de Intervalo'}
                      </span>
                      <span className="text-xs print:text-[10px] font-semibold text-slate-800 block truncate">
                        {activeChecklist.intervalTime || (language === 'en' ? 'Not configured' : language === 'es' ? 'Sin definir' : 'Não definido')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 font-mono">
                        {language === 'en' ? 'Break Coverage' : language === 'es' ? 'Cobertura Turno' : 'Cobertura Almoço'}
                      </span>
                      <span className="text-xs print:text-[10px] font-semibold text-slate-800 block truncate" title={getLocalizedCoverageTime(activeChecklist.coverageTime, language)}>
                        {getLocalizedCoverageTime(activeChecklist.coverageTime, language) || (language === 'en' ? 'None designated' : language === 'es' ? 'Ninguna' : 'Nenhuma')}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Allocated Gear Badges (Radio, Key, Cart) */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1.5 border-t border-slate-200/50 text-[10px] text-slate-600 print:text-[9px] print:pt-1">
                    <span className="font-mono font-bold uppercase text-[9px] text-slate-400">{language === 'en' ? 'Allocated Gear:' : language === 'es' ? 'Equipos Asignados:' : 'Equipamentos Alocados:'}</span>
                    
                    <div className="inline-flex items-center gap-1 bg-cyan-50/80 border border-cyan-150 px-2 py-0.5 rounded text-cyan-900 font-medium">
                      <Radio className="w-3 h-3 text-cyan-700" />
                      <span>{language === 'en' ? 'Radio #' : language === 'es' ? 'Radio #' : 'Rádio #'}: <strong className="font-bold">{activeChecklist.radioNumber || '-'}</strong></span>
                    </div>

                    <div className="inline-flex items-center gap-1 bg-amber-50/80 border border-amber-150 px-2 py-0.5 rounded text-amber-900 font-medium">
                      <Key className="w-3 h-3 text-amber-700" />
                      <span>{language === 'en' ? 'Key #' : language === 'es' ? 'Llave #' : 'Chave #'}: <strong className="font-bold">{activeChecklist.keyNumber || '-'}</strong></span>
                    </div>

                    <div className="inline-flex items-center gap-1 bg-emerald-50/80 border border-emerald-150 px-2 py-0.5 rounded text-emerald-950 font-medium">
                      <ShoppingCart className="w-3 h-3 text-emerald-700" />
                      <span>{language === 'en' ? 'Cart #' : language === 'es' ? 'Carro #' : 'Carrinho #'}: <strong className="font-bold">{activeChecklist.cartNumber || '-'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Standard checklist rendering - Grouped in up to 2 columns for A4 sheet optimization */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase font-mono print:text-xs">
                      {language === 'en' ? 'Scheduled Activities to Perform' : language === 'es' ? 'Actividades Programadas a Realizar' : 'Tarefas a Desempenhar'} ({activeChecklist.tasks.length} {language === 'en' ? 'items' : language === 'es' ? 'ítems' : 'itens'})
                    </span>
                    <span className="text-xs text-slate-400 font-semibold print:hidden">
                      {language === 'en' ? 'Check the box to confirm completion status' : language === 'es' ? 'Pulse en la casilla para confirmar' : 'Clique no quadrado para salvar conclusão'}
                    </span>
                  </div>

                  {/* 2 Columns grid for scheduled activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 print:gap-2.5">
                    {groupChecklistTasks(activeChecklist.tasks, language).map((group) => {
                      if (group.isGroup) {
                        return (
                          <div key={group.parentId} className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-lg space-y-2 shadow-2xs group/group print:p-2.5 print:space-y-1.5">
                            <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 leading-tight flex-wrap print:text-xs">
                                  {group.parentTitle}
                                  {group.isCustomOccasional && (
                                    <span className="flex-shrink-0 text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-100 uppercase">
                                      {language === 'en' ? 'Occasional' : language === 'es' ? 'Eventual' : 'Eventual'}
                                    </span>
                                  )}
                                  {group.frequency && (
                                    <span className="flex-shrink-0 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200/80 uppercase flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5 text-indigo-600" />
                                      {getLocalizedFrequency(group.frequency, language)}
                                    </span>
                                  )}
                                </span>
                                {group.parentDescription && (
                                  <p className="text-xs text-slate-500 mt-0.5 font-normal truncate print:text-[10px]">
                                    {group.parentDescription}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-700 font-mono bg-slate-200/80 px-2 py-0.5 rounded-full shrink-0">
                                {group.subtasks.filter(st => st.completed).length}/{group.subtasks.length}
                              </span>
                            </div>

                            <div className="space-y-1.5 print:space-y-1">
                              {group.subtasks.map((subtask) => {
                                const showNoteInput = editingTaskId === subtask.id;
                                return (
                                  <div key={subtask.id} className="flex items-start gap-2 p-1.5 bg-white border border-slate-100 rounded hover:border-slate-200 transition-all group/subtask min-w-0 print:p-1.5 print:border-slate-200">
                                    <div className="flex-shrink-0 pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTask(activeChecklist.id, subtask.id, subtask.completed)}
                                        className={`print:hidden w-4.5 h-4.5 rounded border flex items-center justify-center transition-all focus:outline-none ${
                                          subtask.completed 
                                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs' 
                                            : 'border-slate-300 hover:border-slate-400 bg-white'
                                        }`}
                                      >
                                        {subtask.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                      </button>
                                      <div className="hidden print:flex w-4 h-4 border border-slate-800 rounded items-center justify-center font-bold text-[10px]">
                                        {subtask.completed ? 'X' : ''}
                                      </div>
                                    </div>

                                    <div className="flex-1 min-w-0 text-xs sm:text-sm print:text-[11px]">
                                      <span className={`font-semibold block leading-snug break-words ${
                                        subtask.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                                      }`}>
                                        {subtask.bulletText}
                                      </span>

                                      {subtask.notes && (
                                        <div className="mt-1 bg-slate-50 p-1.5 rounded border border-slate-100 text-xs print:text-[10.5px] text-indigo-950/80 italic flex items-start gap-1 justify-between">
                                          <span className="break-all"><strong>{language === 'en' ? 'Note:' : language === 'es' ? 'Nota:' : 'Obs:'}</strong> {subtask.notes}</span>
                                          <button
                                            onClick={() => {
                                              setEditingTaskId(subtask.id);
                                              setTempNotesInput(subtask.notes || '');
                                            }}
                                            className="print:hidden text-xs text-indigo-600 hover:underline flex-shrink-0 font-semibold"
                                          >
                                            {language === 'en' ? 'Edit' : language === 'es' ? 'Ed.' : 'Ed.'}
                                          </button>
                                        </div>
                                      )}

                                      {showNoteInput && (
                                        <div className="mt-1 text-xs bg-slate-50 border border-indigo-100 p-1.5 rounded flex flex-col gap-1 print:hidden">
                                          <input
                                            type="text"
                                            placeholder={language === 'en' ? 'Write malfunction or note...' : language === 'es' ? 'Escriba anomalía o nota...' : 'Escreva avaria ou nota...'}
                                            value={tempNotesInput}
                                            onChange={(e) => setTempNotesInput(e.target.value)}
                                            className="w-full text-xs bg-white border border-slate-200 outline-none p-1 rounded"
                                            autoFocus
                                          />
                                          <div className="flex items-center justify-end gap-1">
                                            <button
                                              onClick={() => handleSaveIndividualTaskNote(activeChecklist.id, subtask.id)}
                                              className="bg-indigo-600 text-white rounded px-2 py-0.5 text-xs font-semibold"
                                            >
                                              {language === 'en' ? 'Save' : language === 'es' ? 'Guardar' : 'Salvar'}
                                            </button>
                                            <button
                                              onClick={() => setEditingTaskId(null)}
                                              className="text-xs text-slate-500 hover:underline"
                                            >
                                              {language === 'en' ? 'Exit' : language === 'es' ? 'Salir' : 'Sair'}
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {!subtask.notes && !showNoteInput && (
                                        <button
                                          onClick={() => {
                                            setEditingTaskId(subtask.id);
                                            setTempNotesInput('');
                                          }}
                                          className="print:hidden text-xs text-slate-400 hover:text-indigo-600 mt-0.5 inline-block opacity-0 group-hover/subtask:opacity-100 focus:opacity-100 transition-opacity"
                                        >
                                          + {language === 'en' ? 'Add note' : language === 'es' ? 'Añadir nota' : 'Registrar observação'}
                                        </button>
                                      )}

                                      {subtask.completed && subtask.completedAt && (
                                        <span className="block text-[10px] print:text-[9px] text-slate-400 font-mono mt-0.5">
                                          {new Date(subtask.completedAt).toLocaleTimeString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      } else {
                        const rawTask = group.singleTask!;
                        const task = getLocalizedTask(rawTask, language);
                        const showNoteInput = editingTaskId === task.id;
                        return (
                          <div key={task.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5 group/task shadow-2xs print:p-2.5">
                            <div className="flex-shrink-0 pt-0.5">
                              <button
                                type="button"
                                onClick={() => handleToggleTask(activeChecklist.id, task.id, task.completed)}
                                className={`print:hidden w-5 h-5 rounded border flex items-center justify-center transition-all focus:outline-none ${
                                  task.completed 
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs' 
                                    : 'border-slate-300 hover:border-slate-400 bg-white'
                                }`}
                              >
                                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                              <div className="hidden print:flex w-4 h-4 border border-slate-800 rounded items-center justify-center font-bold text-[10px]">
                                {task.completed ? 'X' : ''}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-xs sm:text-sm print:text-[11px] font-bold block leading-snug ${
                                  task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                                }`}>
                                  {task.title}
                                </span>
                                {task.isCustomOccasional && (
                                  <span className="flex-shrink-0 text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-100 uppercase">
                                    {language === 'en' ? 'Occasional' : language === 'es' ? 'Eventual' : 'Eventual'}
                                  </span>
                                )}
                                {(group.frequency || rawTask.frequency) && (
                                  <span className="flex-shrink-0 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200/80 uppercase flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5 text-indigo-600" />
                                    {getLocalizedFrequency(group.frequency || rawTask.frequency, language)}
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-xs print:text-[10px] mt-0.5 text-slate-500 font-normal">
                                  {task.description}
                                </p>
                              )}

                              {task.notes && (
                                <div className="mt-1 bg-slate-50 p-1.5 rounded border border-slate-100 text-xs print:text-[10.5px] text-indigo-950/80 italic flex items-start gap-1 justify-between">
                                  <span><strong>{language === 'en' ? 'Note:' : language === 'es' ? 'Nota:' : 'Obs:'}</strong> {task.notes}</span>
                                  <button
                                    onClick={() => {
                                      setEditingTaskId(task.id);
                                      setTempNotesInput(task.notes || '');
                                    }}
                                    className="print:hidden text-xs text-indigo-600 hover:underline flex-shrink-0 font-semibold"
                                  >
                                    {language === 'en' ? 'Edit' : language === 'es' ? 'Editar' : 'Editar'}
                                  </button>
                                </div>
                              )}

                              {showNoteInput && (
                                <div className="mt-1.5 text-xs bg-slate-50 border border-indigo-100 p-1.5 rounded flex items-center gap-1.5 print:hidden">
                                  <input
                                    type="text"
                                    placeholder={language === 'en' ? 'Write malfunction or note...' : language === 'es' ? 'Escriba anomalía o nota...' : 'Escreva avaria ou nota...'}
                                    value={tempNotesInput}
                                    onChange={(e) => setTempNotesInput(e.target.value)}
                                    className="w-full text-xs bg-white border border-slate-200 outline-none p-1 rounded"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveIndividualTaskNote(activeChecklist.id, task.id)}
                                    className="bg-indigo-600 text-white rounded px-2 py-0.5 text-xs font-semibold shrink-0"
                                  >
                                    {language === 'en' ? 'Save' : language === 'es' ? 'Guardar' : 'Salvar'}
                                  </button>
                                  <button
                                    onClick={() => setEditingTaskId(null)}
                                    className="text-xs text-slate-500 hover:underline shrink-0"
                                  >
                                    {language === 'en' ? 'Exit' : language === 'es' ? 'Salir' : 'Sair'}
                                  </button>
                                </div>
                              )}

                              {!task.notes && !showNoteInput && (
                                <button
                                  onClick={() => {
                                    setEditingTaskId(task.id);
                                    setTempNotesInput('');
                                  }}
                                  className="print:hidden text-xs text-slate-400 hover:text-indigo-600 mt-0.5 inline-block opacity-0 group-hover/task:opacity-100 focus:opacity-100 transition-opacity"
                                >
                                  + {language === 'en' ? 'Add note' : language === 'es' ? 'Añadir nota' : 'Registrar observação'}
                                </button>
                              )}

                              {task.completed && task.completedAt && (
                                <span className="block text-[10px] print:text-[9px] text-slate-400 font-mono mt-0.5">
                                  {language === 'en' ? 'Completed at' : language === 'es' ? 'Completado a las' : 'Concluído às'} {new Date(task.completedAt).toLocaleTimeString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>

                {/* Global Notes for this checklist */}
                <div className="border-t border-slate-200 pt-3.5 space-y-2 print:pt-2.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase font-mono flex items-center justify-between print:text-xs">
                    <span>{language === 'en' ? 'Supervisor Operational Notes' : language === 'es' ? 'Observaciones Operativas del Supervisor' : 'Observações Operacionais do Supervisor'}</span>
                    {!isEditingNotes && (
                      <button
                        onClick={() => {
                          setIsEditingNotes(true);
                          setGeneralNotesField(activeChecklist.notes || '');
                        }}
                        className="print:hidden text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> {language === 'en' ? 'Write notes' : language === 'es' ? 'Escribir notas' : 'Escrever notas'}
                      </button>
                    )}
                  </h3>

                  {isEditingNotes ? (
                    <div className="space-y-2 print:hidden">
                      <textarea
                        rows={2}
                        className="w-full text-xs sm:text-sm border border-slate-200 focus:border-indigo-500 p-2.5 rounded-lg resize-none outline-none"
                        value={generalNotesField}
                        onChange={(e) => setGeneralNotesField(e.target.value)}
                        placeholder={language === 'en' ? 'Edit main notes for this shift...' : language === 'es' ? 'Edite las notas principales del turno...' : 'Edite as notas principais do turno...'}
                      ></textarea>
                      <div className="flex gap-2">
                        <button
                           onClick={() => handleSaveGeneralDetails(activeChecklist.id)}
                          className="bg-indigo-600 text-white rounded px-3 py-1.5 text-xs font-semibold"
                        >
                          {language === 'en' ? 'Save Notes' : language === 'es' ? 'Guardar Notas' : 'Salvar Notas'}
                        </button>
                        <button
                          onClick={() => setIsEditingNotes(false)}
                          className="text-xs text-slate-500 hover:underline"
                        >
                          {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50/80 p-3 rounded-lg leading-relaxed border border-slate-100 print:p-2.5 print:text-[11px]">
                      {activeChecklist.notes || (language === 'en' ? 'No special instruction or anomaly registered for this day.' : language === 'es' ? 'Ninguna instrucción especial o anomalía registrada hoy.' : 'Nenhuma instrução especial ou anomalia registrada no dia.')}
                    </p>
                  )}
                </div>

                {/* Signature Board (Prints only) */}
                <div className="hidden print:grid grid-cols-2 gap-8 pt-8">
                  <div className="border-t border-slate-800 text-center text-xs print:text-xs pt-1.5 leading-normal">
                    <strong className="block text-slate-900">{activeChecklist.employeeName}</strong>
                    <span className="text-slate-600">{language === 'en' ? 'Employee Signature' : language === 'es' ? 'Firma del Empleado' : 'Assinatura do Colaborador'}</span>
                  </div>
                  <div className="border-t border-slate-800 text-center text-xs print:text-xs pt-1.5 leading-normal">
                    <strong className="block text-slate-900">{language === 'en' ? 'PUBLIC AREAS SUPERVISOR' : language === 'es' ? 'SUPERVISOR DE ÁREAS PÚBLICAS' : 'SUPERVISOR DE ÁREAS PÚBLICAS'}</strong>
                    <span className="text-slate-600">{language === 'en' ? 'Signature / Verification Stamp' : language === 'es' ? 'Firma / Sello de Verificación' : 'Assinatura / Visto de Conferência'}</span>
                  </div>
                </div>

              </div>
              
            </div>
          )}
        </div>

      </div>

      {/* Elegant Manual Sharing Fallback Modal */}
      {isShareModalOpen && activeChecklist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-150/80 shadow-2xl p-6 relative animate-scale-up">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-105 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Share2 className="w-5 h-5 animate-pulse-subtle" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  {language === 'en' ? 'Share & Forward Checklist' : language === 'es' ? 'Compartir y Enviar Reporte' : 'Encaminhar e Compartilhar'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {language === 'en' 
                    ? `Forward files or links for ${activeChecklist.employeeName}` 
                    : language === 'es' 
                    ? `Enviar archivo o resumen de ${activeChecklist.employeeName}` 
                    : `Encaminhe o arquivo ou relatório de ${activeChecklist.employeeName}`}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: PDF Download */}
              <button
                onClick={() => {
                  handleDownloadPDF(activeChecklist);
                  setIsShareModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 transition-colors flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="p-2 bg-indigo-105 text-indigo-705 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-indigo-950">
                    {language === 'en' ? 'Generate & Download PDF' : language === 'es' ? 'Generar y Descargar PDF' : 'Baixar Arquivo PDF'}
                  </span>
                  <span className="block text-[10px] text-indigo-800/70 mt-0.5 leading-normal font-medium">
                    {language === 'en' 
                      ? 'Compiles and saves high-contrast vector A4 document on your device' 
                      : language === 'es' 
                      ? 'Compila y descarga el documento oficial A4 para archivar' 
                      : 'Gera e faz o download oficial do arquivo A4 do checklist no dispositivo'}
                  </span>
                </div>
              </button>

              {/* Option 2: Preformatted WhatsApp Web */}
              <a
                href={getWhatsAppLink(activeChecklist)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full text-left p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/35 hover:bg-emerald-50 transition-colors flex items-start gap-3.5 group cursor-pointer no-underline block"
              >
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-emerald-950">
                    {language === 'en' ? 'Forward via WhatsApp' : language === 'es' ? 'Enviar por WhatsApp' : 'Encaminhar via WhatsApp'}
                  </span>
                  <span className="block text-[10px] text-emerald-800/70 mt-0.5 leading-normal font-medium">
                    {language === 'en' 
                      ? 'Redirects to WhatsApp with prefilled operational progress summary' 
                      : language === 'es' 
                      ? 'Redirecciona a WhatsApp con el resumen de actividades listo' 
                      : 'Abre o WhatsApp com o texto resumo das tarefas preenchido'}
                  </span>
                </div>
              </a>

              {/* Option 3: Preformatted Mail Client */}
              <a
                href={getEmailLink(activeChecklist)}
                onClick={() => setIsShareModalOpen(false)}
                className="w-full text-left p-3.5 rounded-xl border border-amber-100 bg-amber-50/20 hover:bg-amber-50 transition-colors flex items-start gap-3.5 group cursor-pointer no-underline block"
              >
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-amber-950">
                    {language === 'en' ? 'Send by Email' : language === 'es' ? 'Enviar por Correo' : 'Enviar por E-mail'}
                  </span>
                  <span className="block text-[10px] text-amber-800/70 mt-0.5 leading-normal font-medium">
                    {language === 'en' 
                      ? 'Opens email (Gmail, Outlook) with prefilled subject and body summary' 
                      : language === 'es' 
                      ? 'Abre tu correo electrónico con el asunto e informe completo' 
                      : 'Abre seu e-mail padrão com o assunto e relatório predefinidos'}
                  </span>
                </div>
              </a>

              {/* Option 4: Google Drive & Cloud Storages */}
              <button
                onClick={() => {
                  handleDownloadPDF(activeChecklist);
                  window.open('https://drive.google.com/drive/u/0/my-drive', '_blank');
                  setIsShareModalOpen(false);
                }}
                className="w-full text-left p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50/70 transition-colors flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                  <Cloud className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-blue-950">
                    {language === 'en' ? 'Store in Google Drive' : language === 'es' ? 'Guardar en Google Drive' : 'Salvar no Google Drive'}
                  </span>
                  <span className="block text-[10px] text-blue-800/60 mt-0.5 leading-normal font-medium">
                    {language === 'en' 
                      ? 'Generates your PDF and opens Google Drive in a new tab so you can easily upload it' 
                      : language === 'es' 
                      ? 'Genera tu PDF y abre Google Drive en otra pestaña para arrastrarlo y guardarlo' 
                      : 'Gera o PDF do seu checklist e abre o Google Drive para você arrastar e arquivar'}
                  </span>
                </div>
              </button>

              {/* Option 4: Clipboard Copier */}
              <button
                onClick={() => handleCopyToClipboard(activeChecklist)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-start gap-3.5 group cursor-pointer ${
                  copiedSuccess 
                    ? 'border-emerald-300 bg-emerald-50/20' 
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 transition-all ${
                  copiedSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 group-hover:scale-105'
                }`}>
                  {copiedSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-800 font-bold">
                    {copiedSuccess 
                      ? (language === 'en' ? 'Copied successfully!' : language === 'es' ? '¡Copiado con éxito!' : 'Copiado com sucesso!') 
                      : (language === 'en' ? 'Copy Text Summary' : language === 'es' ? 'Copiar Resumen de Texto' : 'Copiar Resumo em Texto')}
                  </span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 leading-normal font-medium">
                    {language === 'en' 
                      ? 'Copies plain text list of completed duties to your device clipboard' 
                      : language === 'es' 
                      ? 'Copia los datos de control al portapapeles en formato limpio' 
                      : 'Copia a lista e percentual de tarefas para colar em outros canais'}
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-150 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'en' ? 'Close Panel' : language === 'es' ? 'Cerrar' : 'Fechar Janela'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingChecklistId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-905/40 backdrop-blur-xs"
            onClick={() => setDeletingChecklistId(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setDeletingChecklistId(null)}
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
                  ? 'Are you sure you want to permanently delete this daily checklist? This action is irreversible.' 
                  : language === 'es' 
                  ? '¿Está seguro de que desea eliminar permanentemente este checklist diario? Esta acción no se puede deshacer.' 
                  : 'Tem certeza de que deseja excluir este checklist diário permanentemente? Esta ação não poderá ser desfeita.'}
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingChecklistId(null)}
                  className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteChecklist}
                  className="w-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all active:scale-99 cursor-pointer"
                >
                  {language === 'en' ? 'Delete' : language === 'es' ? 'Eliminar' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit Checklist Modal */}
      {editingChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setEditingChecklist(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-slate-150 shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingChecklist(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Edit2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  {language === 'en' ? 'Edit Checklist Details' : language === 'es' ? 'Editar Datos del Checklist' : 'Editar Dados do Checklist'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  {language === 'en' ? 'Modify checklist assignments and metadata' : language === 'es' ? 'Modifique asignaciones y metadatos del checklist' : 'Modifique as atribuições, equipamentos e setores do checklist'}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-left">
              {/* Row 1: Employee & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Operator / Employee' : language === 'es' ? 'Operador / Empleado' : 'Colaborador / Operador'}
                  </label>
                  <select
                    value={editEmployeeId}
                    onChange={(e) => setEditEmployeeId(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-slate-800"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Work shift' : language === 'es' ? 'Turno de trabajo' : 'Turno de Trabalho'}
                  </label>
                  <select
                    value={editShift}
                    onChange={(e) => setEditShift(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-slate-800"
                  >
                    <option value="Day Shift (7:00 AM - 3:00 PM)">Day Shift (7:00 AM - 3:00 PM)</option>
                    <option value="Mid Shift (11:00 AM - 7:00 PM)">Mid Shift (11:00 AM - 7:00 PM)</option>
                    <option value="Swing Shift (3:00 PM - 11:00 PM)">Swing Shift (3:00 PM - 11:00 PM)</option>
                    <option value="Graveyard Shift (11:00 PM - 7:00 AM)">Graveyard Shift (11:00 PM - 7:00 AM)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Date, Planned Break & Break Coverage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Date' : language === 'es' ? 'Fecha' : 'Data da Escala'}
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Planned Break' : language === 'es' ? 'Hora descanso' : 'Horário de Intervalo'}
                  </label>
                  <input
                    type="text"
                    value={editIntervalTime}
                    onChange={(e) => setEditIntervalTime(e.target.value)}
                    placeholder="e.g. 10:00 - 11:00"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Break Coverage' : language === 'es' ? 'Cobertura Turno' : 'Cobertura de Almoço'}
                  </label>
                  <input
                    type="text"
                    value={editCoverageTime}
                    onChange={(e) => setEditCoverageTime(e.target.value)}
                    placeholder="e.g. Cobrir João"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Row 3: Radio, Keys & Cart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Radio Ch #' : language === 'es' ? 'Canal Radio' : 'Canal do Rádio nº'}
                  </label>
                  <input
                    type="text"
                    value={editRadioNumber}
                    onChange={(e) => setEditRadioNumber(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Key Ring' : language === 'es' ? 'Llavero nº' : 'Kit de Chaves nº'}
                  </label>
                  <input
                    type="text"
                    value={editKeyNumber}
                    onChange={(e) => setEditKeyNumber(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                    {language === 'en' ? 'Cleaning Cart' : language === 'es' ? 'Carro Limp.' : 'Carro Limpeza nº'}
                  </label>
                  <input
                    type="text"
                    value={editCartNumber}
                    onChange={(e) => setEditCartNumber(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Row 4: Assigned Workplace Environments (Multi-selection grid) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-2">
                  {language === 'en' ? 'Assigned Sectors / Environments' : language === 'es' ? 'Sectores / Ambientes Asignados' : 'Setores / Ambientes de Atuação (Múltiplos)'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                  {environments.map((env) => {
                    const isSelected = editSelectedEnvironmentIds.includes(env.id);
                    return (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setEditSelectedEnvironmentIds(editSelectedEnvironmentIds.filter(id => id !== env.id));
                          } else {
                            setEditSelectedEnvironmentIds([...editSelectedEnvironmentIds, env.id]);
                          }
                        }}
                        className={`text-[11px] p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-650 bg-indigo-50 text-indigo-950 font-bold shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {env.name}
                      </button>
                    );
                  })}
                </div>
                {editSelectedEnvironmentIds.length === 0 && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">
                    ⚠️ {language === 'en' ? 'Please select at least one environment.' : language === 'es' ? 'Por favor, elija al menos un sector.' : 'Por favor, selecione ao menos um setor/ambiente.'}
                  </p>
                )}
              </div>

              {/* Row 5: Smart task append checkbox */}
              <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="editReloadTasks"
                  checked={editReloadTasks}
                  onChange={(e) => setEditReloadTasks(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="editReloadTasks" className="text-xs text-indigo-950 font-medium select-none cursor-pointer leading-tight">
                  <strong className="block mb-0.5">{language === 'en' ? 'Load routine tasks from selected sectors' : language === 'es' ? 'Importar tareas de los nuevos sectores' : 'Carregar rotinas padrão dos novos setores selecionados'}</strong>
                  <span className="text-[10px] text-slate-500 block font-normal leading-normal">
                    {language === 'en' 
                      ? 'Adds all recurrent routinary task templates linked to the checked sectors above into the active checklist, preventing duplicates.' 
                      : language === 'es' 
                      ? 'Agrega las tareas de rutina recurrentes de los nuevos sectores elegidos sin borrar tus avances de tareas existentes.'
                      : 'Adiciona todas as tarefas de rotinas recorrentes dos novos setores selecionados ao checklist ativo, sem remover os seus progressos existentes.'}
                  </span>
                </label>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="grid grid-cols-2 gap-3 w-full mt-6 border-t border-slate-100 pt-4 text-left">
              <button
                type="button"
                onClick={() => setEditingChecklist(null)}
                className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={handleSaveEditedChecklist}
                disabled={editSelectedEnvironmentIds.length === 0}
                className="w-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed py-3 rounded-xl transition-all active:scale-99 cursor-pointer shadow-xs"
              >
                {language === 'en' ? 'Save Changes' : language === 'es' ? 'Guardar Cambios' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
