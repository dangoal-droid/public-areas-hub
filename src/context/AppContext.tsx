import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, WorkEnvironment, TaskTemplate, DailyChecklist, WeeklySchedule, CustomShift } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_ENVIRONMENTS, INITIAL_TASK_TEMPLATES, INITIAL_CHECKLISTS } from '../data/seedData';
import { Language, translations } from '../data/translations';
import { db, cleanFirestoreData, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';

interface AppContextType {
  employees: Employee[];
  environments: WorkEnvironment[];
  taskTemplates: TaskTemplate[];
  checklists: DailyChecklist[];
  schedules: WeeklySchedule[];
  customShifts: CustomShift[];
  customLogo: string | null;
  updateCustomLogo: (logoDataUrl: string | null) => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.pt) => any;
  loading: boolean;
  
  // Employees actions
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updated: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Environments actions
  addEnvironment: (env: Omit<WorkEnvironment, 'id'>) => void;
  updateEnvironment: (id: string, updated: Partial<WorkEnvironment>) => void;
  deleteEnvironment: (id: string) => void;
  
  // Task Templates actions
  addTaskTemplate: (task: Omit<TaskTemplate, 'id'>) => void;
  updateTaskTemplate: (id: string, updated: Partial<TaskTemplate>) => void;
  deleteTaskTemplate: (id: string) => void;
  deleteTaskTemplates: (ids: string[]) => void;
  
  // Checklist actions
  addChecklist: (checklist: Omit<DailyChecklist, 'id'>) => void;
  addChecklistsBatch: (checklistsArray: Array<Omit<DailyChecklist, 'id'>>) => Promise<void>;
  updateChecklist: (id: string, updated: Partial<DailyChecklist>) => void;
  deleteChecklist: (id: string) => void;
  toggleTaskCompletion: (checklistId: string, taskId: string, completed: boolean, notes?: string) => void;
  
  // Weekly Schedule actions
  saveSchedule: (employeeId: string, schedule: Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'>) => Promise<void>;
  saveAllSchedules: (newSchedules: WeeklySchedule[]) => Promise<void>;

  // Custom Shifts actions
  addCustomShift: (shift: Omit<CustomShift, 'id'>) => Promise<void>;
  deleteCustomShift: (id: string) => Promise<void>;
  
  // Global helpers
  resetToFactorySettings: () => void;
}

export const sanitizeNickleDeuceString = (val: string | undefined): string => {
  if (!val || typeof val !== 'string') return val || '';
  return val
    .replace(/Nickle\s+Deuce\s+Bar/gi, 'Seven Sins Lounge')
    .replace(/Nickel\s+Deuce\s+Bar/gi, 'Seven Sins Lounge')
    .replace(/Nickle\s+Deuce/gi, 'Seven Sins Lounge')
    .replace(/Nickel\s+Deuce/gi, 'Seven Sins Lounge');
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [environments, setEnvironments] = useState<WorkEnvironment[]>([]);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [checklists, setChecklists] = useState<DailyChecklist[]>([]);
  const [schedules, setSchedules] = useState<WeeklySchedule[]>([]);
  const [customShifts, setCustomShifts] = useState<CustomShift[]>([]);
  const [customLogo, setCustomLogoState] = useState<string | null>(() => {
    return localStorage.getItem('gestao_custom_logo') || localStorage.getItem('custom_checklist_logo') || null;
  });
  const [language, setLanguageState] = useState<Language>('pt');
  const [loading, setLoading] = useState<boolean>(true);

  const updateCustomLogo = async (logoDataUrl: string | null) => {
    setCustomLogoState(logoDataUrl);
    if (logoDataUrl) {
      localStorage.setItem('gestao_custom_logo', logoDataUrl);
      localStorage.setItem('custom_checklist_logo', logoDataUrl);
    } else {
      localStorage.removeItem('gestao_custom_logo');
      localStorage.removeItem('custom_checklist_logo');
    }
    try {
      await setDoc(doc(db, 'settings', 'global'), { logoUrl: logoDataUrl || '' }, { merge: true });
    } catch (e) {
      console.error('Error saving custom logo to Firestore:', e);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gestao_lang', lang);
    try {
      await setDoc(doc(db, 'settings', 'global'), { language: lang }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: keyof typeof translations.pt): string => {
    const dict = translations[language] || translations.pt;
    return dict[key] || translations.pt[key] || '';
  };

  // Initial load and db seeding from Firestore
  useEffect(() => {
    const initializeData = async () => {
      try {
        const empSnap = await getDocs(collection(db, 'employees'));
        const envSnap = await getDocs(collection(db, 'environments'));
        const taskSnap = await getDocs(collection(db, 'taskTemplates'));
        const chSnap = await getDocs(collection(db, 'checklists'));
        const schedulesSnap = await getDocs(collection(db, 'schedules'));
        const settingsSnap = await getDocs(collection(db, 'settings'));
        const customShiftsSnap = await getDocs(collection(db, 'customShifts'));

        let finalEmployees = empSnap.docs.map(d => d.data() as Employee);
        let finalEnvironments = envSnap.docs.map(d => d.data() as WorkEnvironment);
        let finalTemplates = taskSnap.docs.map(d => d.data() as TaskTemplate);
        let finalChecklists = chSnap.docs.map(d => d.data() as DailyChecklist);
        let finalSchedules = schedulesSnap.docs.map(d => d.data() as WeeklySchedule);
        let finalCustomShifts = customShiftsSnap.docs.map(d => d.data() as CustomShift);
        
        finalChecklists.sort((a, b) => b.id.localeCompare(a.id));

        const isDatabaseEmpty = empSnap.empty && envSnap.empty && taskSnap.empty && chSnap.empty;

        if (isDatabaseEmpty) {
          console.log("Seeding Firestore database...");
          
          for (const emp of INITIAL_EMPLOYEES) {
            await setDoc(doc(db, 'employees', emp.id), emp);
          }
          for (const env of INITIAL_ENVIRONMENTS) {
            await setDoc(doc(db, 'environments', env.id), env);
          }
          for (const t of INITIAL_TASK_TEMPLATES) {
            await setDoc(doc(db, 'taskTemplates', t.id), t);
          }
          for (const ch of INITIAL_CHECKLISTS) {
            await setDoc(doc(db, 'checklists', ch.id), ch);
          }

          finalEmployees = INITIAL_EMPLOYEES;
          finalEnvironments = INITIAL_ENVIRONMENTS;
          finalTemplates = INITIAL_TASK_TEMPLATES;
          finalChecklists = INITIAL_CHECKLISTS;
        } else {
          // Guarantee Daniel Gomes (System Admin) is always present
          const hasDaniel = finalEmployees.some(e => e.name.toLowerCase().includes('daniel gomes') || e.employeeNumber === '1000');
          if (!hasDaniel) {
            const danielEmp: Employee = {
              id: 'emp-0',
              name: 'Daniel Gomes',
              employeeNumber: '1000',
              shift: 'Day Shift (7:00 AM - 3:00 PM)',
              schedule: '5x2',
              role: 'Moderador & Administrador',
              defaultCartNumber: 'N/A',
              defaultRadioNumber: '00',
              defaultKeyNumber: 'ADM-01',
              active: true,
              gender: 'Masculino'
            };
            try {
              await setDoc(doc(db, 'employees', danielEmp.id), danielEmp);
            } catch (e) {
              console.error('Error saving Daniel Gomes to DB:', e);
            }
            finalEmployees = [danielEmp, ...finalEmployees];
          }
        }

        // Seed schedules if empty or first load
        if (schedulesSnap.empty) {
          console.log("Seeding initial weekly schedules...");
          const seededSchedules: WeeklySchedule[] = [];
          for (const emp of finalEmployees) {
            const isCustom = emp.schedule === 'Escala Customizada';
            const mToFShift = emp.shift;
            const saturdayShift = isCustom ? emp.shift : 'FOLGA';
            const sundayShift = 'FOLGA';
            const sched: WeeklySchedule = {
              id: emp.id,
              employeeId: emp.id,
              employeeName: emp.name,
              monday: mToFShift,
              tuesday: mToFShift,
              wednesday: mToFShift,
              thursday: mToFShift,
              friday: mToFShift,
              saturday: saturdayShift,
              sunday: sundayShift
            };
            await setDoc(doc(db, 'schedules', emp.id), cleanFirestoreData(sched));
            seededSchedules.push(sched);
          }
          finalSchedules = seededSchedules;
        }

        // Data Migration: Rename Nickle Deuce Bar to Seven Sins Lounge
        for (let i = 0; i < finalEnvironments.length; i++) {
          const env = finalEnvironments[i];
          let changed = false;
          const newName = sanitizeNickleDeuceString(env.name);
          if (newName !== env.name) { env.name = newName; changed = true; }
          if (env.description) {
            const newDesc = sanitizeNickleDeuceString(env.description);
            if (newDesc !== env.description) { env.description = newDesc; changed = true; }
          }
          if (env.subAreas && Array.isArray(env.subAreas)) {
            const newSubs = env.subAreas.map(sa => sanitizeNickleDeuceString(sa));
            if (JSON.stringify(newSubs) !== JSON.stringify(env.subAreas)) {
              env.subAreas = newSubs;
              changed = true;
            }
          }
          if (changed) {
            try {
              await setDoc(doc(db, 'environments', env.id), cleanFirestoreData(env), { merge: true });
            } catch (e) {
              console.error('Error updating migrated environment:', e);
            }
          }
        }

        for (let i = 0; i < finalTemplates.length; i++) {
          const t = finalTemplates[i];
          let changed = false;
          const newTitle = sanitizeNickleDeuceString(t.title);
          if (newTitle !== t.title) { t.title = newTitle; changed = true; }
          if (t.description) {
            const newDesc = sanitizeNickleDeuceString(t.description);
            if (newDesc !== t.description) { t.description = newDesc; changed = true; }
          }
          if (t.bullets && Array.isArray(t.bullets)) {
            const newBullets = t.bullets.map(b => sanitizeNickleDeuceString(b));
            if (JSON.stringify(newBullets) !== JSON.stringify(t.bullets)) {
              t.bullets = newBullets;
              changed = true;
            }
          }
          if (changed) {
            try {
              await setDoc(doc(db, 'taskTemplates', t.id), cleanFirestoreData(t), { merge: true });
            } catch (e) {
              console.error('Error updating migrated task template:', e);
            }
          }
        }

        for (let i = 0; i < finalChecklists.length; i++) {
          const ch = finalChecklists[i];
          let changed = false;
          const newEnvName = sanitizeNickleDeuceString(ch.environmentName);
          if (newEnvName !== ch.environmentName) { ch.environmentName = newEnvName; changed = true; }
          if (ch.tasks && Array.isArray(ch.tasks)) {
            const newTasks = ch.tasks.map(task => {
              const nt = sanitizeNickleDeuceString(task.title);
              const nd = task.description ? sanitizeNickleDeuceString(task.description) : task.description;
              const nn = task.notes ? sanitizeNickleDeuceString(task.notes) : task.notes;
              if (nt !== task.title || nd !== task.description || nn !== task.notes) {
                changed = true;
                return { ...task, title: nt, description: nd, notes: nn };
              }
              return task;
            });
            if (changed) {
              ch.tasks = newTasks;
            }
          }
          if (changed) {
            try {
              await setDoc(doc(db, 'checklists', ch.id), cleanFirestoreData(ch), { merge: true });
            } catch (e) {
              console.error('Error updating migrated checklist:', e);
            }
          }
        }

        for (let i = 0; i < finalSchedules.length; i++) {
          const s = finalSchedules[i];
          let changed = false;
          const nm = sanitizeNickleDeuceString(s.monday);
          const nt = sanitizeNickleDeuceString(s.tuesday);
          const nw = sanitizeNickleDeuceString(s.wednesday);
          const nth = sanitizeNickleDeuceString(s.thursday);
          const nf = sanitizeNickleDeuceString(s.friday);
          const nsa = sanitizeNickleDeuceString(s.saturday);
          const nsu = sanitizeNickleDeuceString(s.sunday);
          if (nm !== s.monday || nt !== s.tuesday || nw !== s.wednesday || nth !== s.thursday || nf !== s.friday || nsa !== s.saturday || nsu !== s.sunday) {
            s.monday = nm;
            s.tuesday = nt;
            s.wednesday = nw;
            s.thursday = nth;
            s.friday = nf;
            s.saturday = nsa;
            s.sunday = nsu;
            changed = true;
          }
          if (changed) {
            try {
              await setDoc(doc(db, 'schedules', s.id), cleanFirestoreData(s), { merge: true });
            } catch (e) {
              console.error('Error updating migrated schedule:', e);
            }
          }
        }

        setEmployees(finalEmployees);
        setEnvironments(finalEnvironments);
        setTaskTemplates(finalTemplates);
        setChecklists(finalChecklists);
        setSchedules(finalSchedules);
        setCustomShifts(finalCustomShifts);

        if (!settingsSnap.empty) {
          const settingsDoc = settingsSnap.docs.find(d => d.id === 'global')?.data();
          if (settingsDoc) {
            if (settingsDoc.language) {
              setLanguageState(settingsDoc.language);
            }
            if (settingsDoc.logoUrl !== undefined) {
              const cloudLogo = settingsDoc.logoUrl || null;
              setCustomLogoState(cloudLogo);
              if (cloudLogo) {
                localStorage.setItem('gestao_custom_logo', cloudLogo);
                localStorage.setItem('custom_checklist_logo', cloudLogo);
              } else {
                localStorage.removeItem('gestao_custom_logo');
                localStorage.removeItem('custom_checklist_logo');
              }
            }
          }
        } else {
          const cachedLang = localStorage.getItem('gestao_lang') as Language | null;
          const defaultLang = cachedLang || 'pt';
          const cachedLogo = localStorage.getItem('gestao_custom_logo') || localStorage.getItem('custom_checklist_logo') || null;
          setLanguageState(defaultLang);
          setCustomLogoState(cachedLogo);
          await setDoc(doc(db, 'settings', 'global'), { id: 'global', language: defaultLang, logoUrl: cachedLogo || '' });
        }

      } catch (error) {
        console.error("Error initializing Firestore, loading fallback cache:", error);
        const cachedEmployees = localStorage.getItem('gestao_employees');
        const cachedEnvironments = localStorage.getItem('gestao_environments');
        const cachedTemplates = localStorage.getItem('gestao_task_templates');
        const cachedChecklists = localStorage.getItem('gestao_checklists');
        const cachedSchedules = localStorage.getItem('gestao_schedules');
        const cachedCustomShifts = localStorage.getItem('gestao_custom_shifts');
        const cachedLang = localStorage.getItem('gestao_lang') as Language | null;
        const cachedLogo = localStorage.getItem('gestao_custom_logo') || localStorage.getItem('custom_checklist_logo') || null;

        if (cachedLang) setLanguageState(cachedLang);
        if (cachedLogo) setCustomLogoState(cachedLogo);
        setEmployees(cachedEmployees ? JSON.parse(cachedEmployees) : INITIAL_EMPLOYEES);
        setEnvironments(cachedEnvironments ? JSON.parse(cachedEnvironments) : INITIAL_ENVIRONMENTS);
        setTaskTemplates(cachedTemplates ? JSON.parse(cachedTemplates) : INITIAL_TASK_TEMPLATES);
        setChecklists(cachedChecklists ? JSON.parse(cachedChecklists) : INITIAL_CHECKLISTS);
        setSchedules(cachedSchedules ? JSON.parse(cachedSchedules) : []);
        setCustomShifts(cachedCustomShifts ? JSON.parse(cachedCustomShifts) : []);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Real-time synchronization
  useEffect(() => {
    if (loading) return;

    const unsubEmployees = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Employee);
      setEmployees(data);
      localStorage.setItem('gestao_employees', JSON.stringify(data));
    });

    const unsubEnvironments = onSnapshot(collection(db, 'environments'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as WorkEnvironment);
      setEnvironments(data);
      localStorage.setItem('gestao_environments', JSON.stringify(data));
    });

    const unsubTemplates = onSnapshot(collection(db, 'taskTemplates'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as TaskTemplate);
      setTaskTemplates(data);
      localStorage.setItem('gestao_task_templates', JSON.stringify(data));
    });

    const unsubChecklists = onSnapshot(collection(db, 'checklists'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as DailyChecklist);
      data.sort((a, b) => b.id.localeCompare(a.id));
      setChecklists(data);
      localStorage.setItem('gestao_checklists', JSON.stringify(data));
    });

    const unsubSchedules = onSnapshot(collection(db, 'schedules'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as WeeklySchedule);
      setSchedules(data);
      localStorage.setItem('gestao_schedules', JSON.stringify(data));
    });

    const unsubCustomShifts = onSnapshot(collection(db, 'customShifts'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as CustomShift);
      setCustomShifts(data);
      localStorage.setItem('gestao_custom_shifts', JSON.stringify(data));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.language) {
          setLanguageState(data.language as Language);
          localStorage.setItem('gestao_lang', data.language);
        }
        if (data.logoUrl !== undefined) {
          const cloudLogo = data.logoUrl || null;
          setCustomLogoState(cloudLogo);
          if (cloudLogo) {
            localStorage.setItem('gestao_custom_logo', cloudLogo);
            localStorage.setItem('custom_checklist_logo', cloudLogo);
          } else {
            localStorage.removeItem('gestao_custom_logo');
            localStorage.removeItem('custom_checklist_logo');
          }
        }
      }
    });

    return () => {
      unsubEmployees();
      unsubEnvironments();
      unsubTemplates();
      unsubChecklists();
      unsubSchedules();
      unsubCustomShifts();
      unsubSettings();
    };
  }, [loading]);

  // Employee CRUD operations
  const addEmployee = async (empData: Omit<Employee, 'id'>) => {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = {
      ...empData,
      id
    };
    try {
      await setDoc(doc(db, 'employees', id), cleanFirestoreData(newEmp));
      
      // Automatically create and sync their weekly schedule in Firestore!
      const activeShift = newEmp.shift || 'Day Shift (7:00 AM - 3:00 PM)';
      const daysOff = newEmp.daysOff;
      const defaultSchedule: WeeklySchedule = {
        id,
        employeeId: id,
        employeeName: newEmp.name,
        monday: daysOff ? (daysOff.includes('monday') ? 'FOLGA' : activeShift) : activeShift,
        tuesday: daysOff ? (daysOff.includes('tuesday') ? 'FOLGA' : activeShift) : activeShift,
        wednesday: daysOff ? (daysOff.includes('wednesday') ? 'FOLGA' : activeShift) : activeShift,
        thursday: daysOff ? (daysOff.includes('thursday') ? 'FOLGA' : activeShift) : activeShift,
        friday: daysOff ? (daysOff.includes('friday') ? 'FOLGA' : activeShift) : activeShift,
        saturday: daysOff ? (daysOff.includes('saturday') ? 'FOLGA' : activeShift) : (newEmp.schedule === 'Escala Customizada' ? activeShift : 'FOLGA'),
        sunday: daysOff ? (daysOff.includes('sunday') ? 'FOLGA' : activeShift) : 'FOLGA'
      };
      await setDoc(doc(db, 'schedules', id), cleanFirestoreData(defaultSchedule));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `employees/${id}`);
    }
  };

  const updateEmployee = async (id: string, updated: Partial<Employee>) => {
    try {
      await setDoc(doc(db, 'employees', id), cleanFirestoreData(updated), { merge: true });
      
      // Auto-update their weekly schedule document in Firestore
      const existingSchedule = schedules.find(s => s.employeeId === id);
      const currentEmp = employees.find(e => e.id === id);
      if (currentEmp) {
        const mergedEmp = { ...currentEmp, ...updated };
        const activeShift = mergedEmp.shift || 'Day Shift (7:00 AM - 3:00 PM)';
        const daysOff = mergedEmp.daysOff;

        let newSchedule: WeeklySchedule;
        if (existingSchedule) {
          const oldShift = currentEmp.shift;
          
          if (updated.daysOff !== undefined) {
            newSchedule = {
              id,
              employeeId: id,
              employeeName: mergedEmp.name,
              monday: updated.daysOff.includes('monday') ? 'FOLGA' : activeShift,
              tuesday: updated.daysOff.includes('tuesday') ? 'FOLGA' : activeShift,
              wednesday: updated.daysOff.includes('wednesday') ? 'FOLGA' : activeShift,
              thursday: updated.daysOff.includes('thursday') ? 'FOLGA' : activeShift,
              friday: updated.daysOff.includes('friday') ? 'FOLGA' : activeShift,
              saturday: updated.daysOff.includes('saturday') ? 'FOLGA' : activeShift,
              sunday: updated.daysOff.includes('sunday') ? 'FOLGA' : activeShift
            };
          } else if (daysOff !== undefined) {
            newSchedule = {
              id,
              employeeId: id,
              employeeName: mergedEmp.name,
              monday: daysOff.includes('monday') ? 'FOLGA' : activeShift,
              tuesday: daysOff.includes('tuesday') ? 'FOLGA' : activeShift,
              wednesday: daysOff.includes('wednesday') ? 'FOLGA' : activeShift,
              thursday: daysOff.includes('thursday') ? 'FOLGA' : activeShift,
              friday: daysOff.includes('friday') ? 'FOLGA' : activeShift,
              saturday: daysOff.includes('saturday') ? 'FOLGA' : activeShift,
              sunday: daysOff.includes('sunday') ? 'FOLGA' : activeShift
            };
          } else {
            newSchedule = {
              id,
              employeeId: id,
              employeeName: mergedEmp.name,
              monday: existingSchedule.monday === oldShift ? activeShift : existingSchedule.monday,
              tuesday: existingSchedule.tuesday === oldShift ? activeShift : existingSchedule.tuesday,
              wednesday: existingSchedule.wednesday === oldShift ? activeShift : existingSchedule.wednesday,
              thursday: existingSchedule.thursday === oldShift ? activeShift : existingSchedule.thursday,
              friday: existingSchedule.friday === oldShift ? activeShift : existingSchedule.friday,
              saturday: mergedEmp.schedule !== currentEmp.schedule
                ? (mergedEmp.schedule === 'Escala Customizada' ? activeShift : 'FOLGA')
                : (existingSchedule.saturday === oldShift ? activeShift : existingSchedule.saturday),
              sunday: existingSchedule.sunday
            };
          }
        } else {
          newSchedule = {
            id,
            employeeId: id,
            employeeName: mergedEmp.name,
            monday: daysOff ? (daysOff.includes('monday') ? 'FOLGA' : activeShift) : activeShift,
            tuesday: daysOff ? (daysOff.includes('tuesday') ? 'FOLGA' : activeShift) : activeShift,
            wednesday: daysOff ? (daysOff.includes('wednesday') ? 'FOLGA' : activeShift) : activeShift,
            thursday: daysOff ? (daysOff.includes('thursday') ? 'FOLGA' : activeShift) : activeShift,
            friday: daysOff ? (daysOff.includes('friday') ? 'FOLGA' : activeShift) : activeShift,
            saturday: daysOff ? (daysOff.includes('saturday') ? 'FOLGA' : activeShift) : (mergedEmp.schedule === 'Escala Customizada' ? activeShift : 'FOLGA'),
            sunday: daysOff ? (daysOff.includes('sunday') ? 'FOLGA' : activeShift) : 'FOLGA'
          };
        }
        await setDoc(doc(db, 'schedules', id), cleanFirestoreData(newSchedule));
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `employees/${id}`);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      await deleteDoc(doc(db, 'schedules', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `employees/${id}`);
    }
  };

  // Environments CRUD operations
  const addEnvironment = async (envData: Omit<WorkEnvironment, 'id'>) => {
    const id = `env-${Date.now()}`;
    const newEnv: WorkEnvironment = {
      ...envData,
      name: sanitizeNickleDeuceString(envData.name),
      description: envData.description ? sanitizeNickleDeuceString(envData.description) : envData.description,
      subAreas: envData.subAreas ? envData.subAreas.map(sa => sanitizeNickleDeuceString(sa)) : [],
      id
    };
    try {
      await setDoc(doc(db, 'environments', id), cleanFirestoreData(newEnv));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `environments/${id}`);
    }
  };

  const updateEnvironment = async (id: string, updated: Partial<WorkEnvironment>) => {
    const cleanUpdated: Partial<WorkEnvironment> = { ...updated };
    if (cleanUpdated.name) cleanUpdated.name = sanitizeNickleDeuceString(cleanUpdated.name);
    if (cleanUpdated.description) cleanUpdated.description = sanitizeNickleDeuceString(cleanUpdated.description);
    if (cleanUpdated.subAreas) cleanUpdated.subAreas = cleanUpdated.subAreas.map(sa => sanitizeNickleDeuceString(sa));
    try {
      await setDoc(doc(db, 'environments', id), cleanFirestoreData(cleanUpdated), { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `environments/${id}`);
    }
  };

  const deleteEnvironment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'environments', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `environments/${id}`);
    }
  };

  // Task templates CRUD
  const addTaskTemplate = async (taskData: Omit<TaskTemplate, 'id'>) => {
    const id = `task-${Date.now()}`;
    const newTask: TaskTemplate = {
      ...taskData,
      title: sanitizeNickleDeuceString(taskData.title),
      description: taskData.description ? sanitizeNickleDeuceString(taskData.description) : taskData.description,
      bullets: taskData.bullets ? taskData.bullets.map(b => sanitizeNickleDeuceString(b)) : undefined,
      id
    };
    try {
      await setDoc(doc(db, 'taskTemplates', id), cleanFirestoreData(newTask));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `taskTemplates/${id}`);
    }
  };

  const updateTaskTemplate = async (id: string, updated: Partial<TaskTemplate>) => {
    const cleanUpdated: Partial<TaskTemplate> = { ...updated };
    if (cleanUpdated.title) cleanUpdated.title = sanitizeNickleDeuceString(cleanUpdated.title);
    if (cleanUpdated.description) cleanUpdated.description = sanitizeNickleDeuceString(cleanUpdated.description);
    if (cleanUpdated.bullets) cleanUpdated.bullets = cleanUpdated.bullets.map(b => sanitizeNickleDeuceString(b));
    try {
      await setDoc(doc(db, 'taskTemplates', id), cleanFirestoreData(cleanUpdated), { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `taskTemplates/${id}`);
    }
  };

  const deleteTaskTemplate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'taskTemplates', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `taskTemplates/${id}`);
    }
  };

  const deleteTaskTemplates = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await deleteDoc(doc(db, 'taskTemplates', id));
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `taskTemplates`);
    }
  };

  // Checklists CRUD
  const addChecklist = async (checklistData: Omit<DailyChecklist, 'id'>) => {
    const id = `ch-${Date.now()}`;
    const newChecklist: DailyChecklist = {
      ...checklistData,
      environmentName: sanitizeNickleDeuceString(checklistData.environmentName),
      tasks: checklistData.tasks ? checklistData.tasks.map(t => ({
        ...t,
        title: sanitizeNickleDeuceString(t.title),
        description: t.description ? sanitizeNickleDeuceString(t.description) : t.description,
        notes: t.notes ? sanitizeNickleDeuceString(t.notes) : t.notes
      })) : [],
      id
    };
    try {
      await setDoc(doc(db, 'checklists', id), cleanFirestoreData(newChecklist));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `checklists/${id}`);
    }
  };

  const addChecklistsBatch = async (checklistsArray: Array<Omit<DailyChecklist, 'id'>>) => {
    try {
      for (let i = 0; i < checklistsArray.length; i++) {
        const checklistData = checklistsArray[i];
        const id = `ch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        const newChecklist: DailyChecklist = {
          ...checklistData,
          environmentName: sanitizeNickleDeuceString(checklistData.environmentName),
          tasks: checklistData.tasks ? checklistData.tasks.map(t => ({
            ...t,
            title: sanitizeNickleDeuceString(t.title),
            description: t.description ? sanitizeNickleDeuceString(t.description) : t.description,
            notes: t.notes ? sanitizeNickleDeuceString(t.notes) : t.notes
          })) : [],
          id
        };
        await setDoc(doc(db, 'checklists', id), cleanFirestoreData(newChecklist));
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `checklists`);
    }
  };

  const updateChecklist = async (id: string, updated: Partial<DailyChecklist>) => {
    const cleanUpdated: Partial<DailyChecklist> = { ...updated };
    if (cleanUpdated.environmentName) cleanUpdated.environmentName = sanitizeNickleDeuceString(cleanUpdated.environmentName);
    if (cleanUpdated.tasks) {
      cleanUpdated.tasks = cleanUpdated.tasks.map(t => ({
        ...t,
        title: sanitizeNickleDeuceString(t.title),
        description: t.description ? sanitizeNickleDeuceString(t.description) : t.description,
        notes: t.notes ? sanitizeNickleDeuceString(t.notes) : t.notes
      }));
    }
    try {
      await setDoc(doc(db, 'checklists', id), cleanFirestoreData(cleanUpdated), { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `checklists/${id}`);
    }
  };

  const deleteChecklist = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'checklists', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `checklists/${id}`);
    }
  };

  const saveSchedule = async (employeeId: string, schedule: Omit<WeeklySchedule, 'id' | 'employeeId' | 'employeeName'>) => {
    const emp = employees.find(e => e.id === employeeId);
    const id = employeeId;
    const data: WeeklySchedule = {
      id,
      employeeId,
      employeeName: emp ? emp.name : 'Unknown',
      ...schedule
    };
    try {
      await setDoc(doc(db, 'schedules', id), cleanFirestoreData(data));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `schedules/${id}`);
    }
  };

  const saveAllSchedules = async (newSchedules: WeeklySchedule[]) => {
    try {
      for (const s of newSchedules) {
        await setDoc(doc(db, 'schedules', s.id), cleanFirestoreData(s));
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'schedules');
    }
  };

  const toggleTaskCompletion = async (checklistId: string, taskId: string, completed: boolean, notes?: string) => {
    const ch = checklists.find(c => c.id === checklistId);
    if (!ch) return;

    const updatedTasks = ch.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
          notes: notes !== undefined ? notes : t.notes
        };
      }
      return t;
    });

    const total = updatedTasks.length;
    const done = updatedTasks.filter(t => t.completed).length;
    let status: DailyChecklist['status'] = 'in_progress';
    
    if (done === 0) {
      status = 'pending';
    } else if (done === total) {
      status = 'completed';
    }

    try {
      await setDoc(doc(db, 'checklists', checklistId), cleanFirestoreData({
        tasks: updatedTasks,
        status
      }), { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `checklists/${checklistId}`);
    }
  };

  // Custom Shifts actions
  const addCustomShift = async (shiftData: Omit<CustomShift, 'id'>) => {
    const id = `shift-${Date.now()}`;
    const newShift: CustomShift = {
      ...shiftData,
      id
    };
    try {
      await setDoc(doc(db, 'customShifts', id), cleanFirestoreData(newShift));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `customShifts/${id}`);
    }
  };

  const deleteCustomShift = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customShifts', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `customShifts/${id}`);
    }
  };

  // Reset helper
  const resetToFactorySettings = async () => {
    try {
      const empSnap = await getDocs(collection(db, 'employees'));
      for (const d of empSnap.docs) {
        await deleteDoc(doc(db, 'employees', d.id));
      }

      const envSnap = await getDocs(collection(db, 'environments'));
      for (const d of envSnap.docs) {
        await deleteDoc(doc(db, 'environments', d.id));
      }

      const taskSnap = await getDocs(collection(db, 'taskTemplates'));
      for (const d of taskSnap.docs) {
        await deleteDoc(doc(db, 'taskTemplates', d.id));
      }

      const chSnap = await getDocs(collection(db, 'checklists'));
      for (const d of chSnap.docs) {
        await deleteDoc(doc(db, 'checklists', d.id));
      }

      const schedSnap = await getDocs(collection(db, 'schedules'));
      for (const d of schedSnap.docs) {
        await deleteDoc(doc(db, 'schedules', d.id));
      }

      for (const emp of INITIAL_EMPLOYEES) {
        await setDoc(doc(db, 'employees', emp.id), emp);
      }
      for (const env of INITIAL_ENVIRONMENTS) {
        await setDoc(doc(db, 'environments', env.id), env);
      }
      for (const t of INITIAL_TASK_TEMPLATES) {
        await setDoc(doc(db, 'taskTemplates', t.id), t);
      }
      for (const ch of INITIAL_CHECKLISTS) {
        await setDoc(doc(db, 'checklists', ch.id), ch);
      }
      for (const emp of INITIAL_EMPLOYEES) {
        const isCustom = emp.schedule === 'Escala Customizada';
        const mToFShift = emp.shift;
        const saturdayShift = isCustom ? emp.shift : 'FOLGA';
        const sundayShift = 'FOLGA';
        const sched: WeeklySchedule = {
          id: emp.id,
          employeeId: emp.id,
          employeeName: emp.name,
          monday: mToFShift,
          tuesday: mToFShift,
          wednesday: mToFShift,
          thursday: mToFShift,
          friday: mToFShift,
          saturday: saturdayShift,
          sunday: sundayShift
        };
        await setDoc(doc(db, 'schedules', emp.id), cleanFirestoreData(sched));
      }
    } catch (e) {
      console.error("Error resetting Firestore:", e);
      setEmployees(INITIAL_EMPLOYEES);
      setEnvironments(INITIAL_ENVIRONMENTS);
      setTaskTemplates(INITIAL_TASK_TEMPLATES);
      setChecklists(INITIAL_CHECKLISTS);
      setSchedules([]);
    }
  };

  return (
    <AppContext.Provider value={{
      employees,
      environments,
      taskTemplates,
      checklists,
      schedules,
      customShifts,
      customLogo,
      updateCustomLogo,
      language,
      setLanguage,
      t,
      loading,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addEnvironment,
      updateEnvironment,
      deleteEnvironment,
      addTaskTemplate,
      updateTaskTemplate,
      deleteTaskTemplate,
      deleteTaskTemplates,
      addChecklist,
      addChecklistsBatch,
      updateChecklist,
      deleteChecklist,
      toggleTaskCompletion,
      saveSchedule,
      saveAllSchedules,
      addCustomShift,
      deleteCustomShift,
      resetToFactorySettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const isSystemAdmin = (employee?: Employee | null): boolean => {
  if (!employee) return false;
  const name = (employee.name || '').toLowerCase();
  const role = (employee.role || '').toLowerCase();
  const num = (employee.employeeNumber || '').trim();
  return name.includes('daniel gomes') || role.includes('administrador') || role.includes('moderador') || num === '1000';
};
