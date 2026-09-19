export interface Employee {
  id: string;
  name: string;
  employeeNumber?: string;
  password?: string; // Access password for supervisors / administrators
  shift: string; // e.g., "Manhã (06:00 - 14:00)", "Tarde (14:00 - 22:00)", "Noite (22:00 - 06:00)"
  schedule: string; // e.g., "6x1", "5x2", "12x36"
  role: string; // e.g., "Auxiliar de Limpeza", "Líder de Equipe", "Auxiliar de Serviços Gerais"
  defaultCartNumber?: string;
  defaultRadioNumber?: string;
  defaultKeyNumber?: string;
  active: boolean;
  gender?: string;
  daysOff?: string[]; // e.g., ["saturday", "sunday"]
}

export interface WorkEnvironment {
  id: string;
  name: string;
  description?: string;
  subAreas: string[]; // List of specific areas (e.g. "Banheiro Feminino", "Corredor Principal")
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  type: 'routine' | 'occasional';
  environmentId?: string; // Optional: specific to an environment, or applicable globally
  shiftTarget?: string; // Optional: "Todos", "Manhã", "Tarde", "Noite"
  frequency?: string; // e.g., "Diário", "A cada 2 horas", "Duas vezes por dia"
  bullets?: string[]; // Added bullets (sub-tasks/checklist items)
  translations?: {
    pt?: { title: string; description?: string; bullets?: string[] };
    en?: { title: string; description?: string; bullets?: string[] };
    es?: { title: string; description?: string; bullets?: string[] };
  };
}

export interface ChecklistTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  isCustomOccasional?: boolean;
  frequency?: string;
  translations?: {
    pt?: { title: string; description?: string };
    en?: { title: string; description?: string };
    es?: { title: string; description?: string };
  };
}

export interface DailyChecklist {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  shift: string;
  date: string; // YYYY-MM-DD
  intervalTime: string; // e.g., "11:30 - 12:30"
  coverageTime: string; // "12:30 - 13:30 (Cobrir Maria)"
  cartNumber: string; // Carro de Limpeza nº
  radioNumber: string; // Rádio nº
  keyNumber: string; // Chaves nº
  environmentId: string; // ID of the workspace
  environmentName: string; // Denormalized name of the workspace
  tasks: ChecklistTask[];
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

export interface WeeklySchedule {
  id: string; // Unique ID (often the employee ID or employeeId_week)
  employeeId: string;
  employeeName: string;
  monday: string;    // e.g., "Manhã", "Tarde", "Noite", "Comercial", "FOLGA"
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface CustomShift {
  id: string;
  name: string;
  parentShift: string;
}

