import React, { useState } from 'react';
import { useApp, isSystemAdmin } from '../context/AppContext';
import { Employee } from '../types';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  Trash2, 
  Radio, 
  Key, 
  ShoppingCart, 
  Search, 
  Check, 
  X,
  Plus,
  Pencil,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface EmployeesTabProps {
  currentUser?: Employee;
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({ currentUser }) => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, customShifts, addCustomShift, deleteCustomShift, t, language } = useApp();
  const isAdmin = isSystemAdmin(currentUser);
  
  // Permission alert modal state for non-admins
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const checkPermission = (): boolean => {
    if (!isAdmin) {
      setShowPermissionModal(true);
      return false;
    }
    return true;
  };

  // Search filtering state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom delete confirmation modal state
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  
  // Create state
  const [isAdding, setIsAdding] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Casino Porter');
  const [gender, setGender] = useState('Masculino');
  const [shift, setShift] = useState('Day Shift (7:00 AM - 3:00 PM)');
  const [schedule, setSchedule] = useState('5x2');
  const [radio, setRadio] = useState('');
  const [key, setKey] = useState('');
  const [cart, setCart] = useState('');
  const [daysOff, setDaysOff] = useState<string[]>(['saturday', 'sunday']);

  // Custom shifts modal and form state
  const [showCustomShiftsModal, setShowCustomShiftsModal] = useState(false);
  const [newShiftName, setNewShiftName] = useState('');
  const [newShiftParent, setNewShiftParent] = useState('Day Shift (7:00 AM - 3:00 PM)');
  const [shiftError, setShiftError] = useState('');

  // Edit handler
  const handleEditClick = (emp: Employee) => {
    if (!checkPermission()) return;
    setEditingEmployee(emp);
    setName(emp.name);
    setEmployeeNumber(emp.employeeNumber || '');
    setPassword(emp.password || '');
    setRole(emp.role);
    setGender(emp.gender || 'Masculino');
    setShift(emp.shift);
    setSchedule(emp.schedule);
    setRadio(emp.defaultRadioNumber === 'N/A' ? '' : emp.defaultRadioNumber || '');
    setKey(emp.defaultKeyNumber === 'N/A' ? '' : emp.defaultKeyNumber || '');
    setCart(emp.defaultCartNumber === 'N/A' ? '' : emp.defaultCartNumber || '');
    setDaysOff(emp.daysOff || []);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setName('');
    setEmployeeNumber('');
    setPassword('');
    setRadio('');
    setKey('');
    setCart('');
    setGender('Masculino');
    setSchedule('5x2');
    setShift('Day Shift (7:00 AM - 3:00 PM)');
    setDaysOff(['saturday', 'sunday']);
    setEditingEmployee(null);
    setIsAdding(false);
  };

  // Submit handler
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission()) return;
    if (!name.trim()) return;

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        name: name.trim(),
        employeeNumber: employeeNumber.trim(),
        password: password.trim(),
        role,
        gender,
        shift,
        schedule,
        defaultRadioNumber: radio.trim(),
        defaultKeyNumber: key.trim(),
        defaultCartNumber: cart.trim(),
        daysOff
      });
    } else {
      addEmployee({
        name: name.trim(),
        employeeNumber: employeeNumber.trim(),
        password: password.trim(),
        role,
        gender,
        shift,
        schedule,
        defaultRadioNumber: radio.trim(),
        defaultKeyNumber: key.trim(),
        defaultCartNumber: cart.trim(),
        active: true,
        daysOff
      });
    }

    // Reset inputs
    handleCancel();
  };

  const handleToggleActive = (id: string, current: boolean) => {
    if (!checkPermission()) return;
    updateEmployee(id, { active: !current });
  };

  const handleDeleteClick = (emp: Employee) => {
    if (!checkPermission()) return;
    setDeletingEmployee(emp);
  };

  const handleConfirmDelete = () => {
    if (!checkPermission()) return;
    if (deletingEmployee) {
      deleteEmployee(deletingEmployee.id);
      setDeletingEmployee(null);
    }
  };

  const handleDeleteDummy1 = (id: string, name: string) => {
    const confirmMsg = language === 'en'
      ? `Are you sure you want to permanently remove employee "${name}"?`
      : language === 'es'
      ? `¿Está seguro de que desea eliminar al empleado "${name}"?`
      : `Tem certeza de que deseja remover o funcionário "${name}"?`;
      
    if (confirm(confirmMsg)) {
      deleteEmployee(id);
    }
  };

  // Filter and sort by shift weight then alphabetical name
  const filteredEmployees = React.useMemo(() => {
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
      if (lower.includes('graveyard') || lower.includes('noite') || lower.includes('noturno')) return 4;
      return 5;
    };

    return employees
      .filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employeeNumber && emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const weightA = getShiftWeight(a.shift || '');
        const weightB = getShiftWeight(b.shift || '');
        if (weightA !== weightB) {
          return weightA - weightB;
        }
        return a.name.localeCompare(b.name);
      });
  }, [employees, searchTerm, customShifts]);

  return (
    <div className="space-y-6">
      
      {/* Non-admin read-only banner */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold block">🔒 Modo de Leitura Restrito</span>
            <span>Alterações nos cadastros de funcionários e turnos são permitidas exclusivamente para o moderador e administrador do sistema (<strong>Daniel Gomes</strong>).</span>
          </div>
        </div>
      )}

      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            {t('emp_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('emp_subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCustomShiftsModal(true)}
            className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-250/50 cursor-pointer shadow-xs"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            {language === 'en' ? 'Manage Custom Shifts' : language === 'es' ? 'Gestionar Turnos' : 'Gerenciar Turnos'}
          </button>

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
            <UserPlus className="w-4 h-4" /> 
            {isAdding 
              ? (language === 'en' ? 'View Directory' : language === 'es' ? 'Ver Empleados' : 'Ver Funcionários') 
              : t('emp_add_btn')}
          </button>
        </div>
      </div>

      {isAdding ? (
        /* Create New Employee Form */
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 shadow-xs p-6">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3 mb-5">
            {editingEmployee 
              ? (language === 'en' ? 'Edit Employee Details' : language === 'es' ? 'Editar Datos de Colaborador' : 'Editar Cadastro de Colaborador') 
              : t('emp_new_form')}
          </h2>
          
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('emp_name_lbl')} *</label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  placeholder={language === 'en' ? 'Ex: Johnathan Doe' : language === 'es' ? 'Ej: Juan Pérez' : 'Ex: João Pedro Santos'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('emp_number_lbl')}</label>
                <input
                  type="text"
                  maxLength={20}
                  placeholder={t('emp_number_placeholder')}
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{language === 'en' ? 'Access Password 🔒' : language === 'es' ? 'Contraseña 🔒' : 'Senha de Acesso 🔒'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Padrão: 1234)</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  placeholder={language === 'en' ? 'Ex: 1234' : language === 'es' ? 'Ej: 1234' : 'Ex: 1234'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('emp_role_lbl')} *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                >
                  <option value="Casino Porter">Casino Porter</option>
                  <option value="Public Area Supervisor">Public Area Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Gender *' : language === 'es' ? 'Género *' : 'Gênero *'}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                >
                  <option value="Masculino">{language === 'en' ? 'Male ♂' : language === 'es' ? 'Masculino ♂' : 'Masculino ♂'}</option>
                  <option value="Feminino">{language === 'en' ? 'Female ♀' : language === 'es' ? 'Femenino ♀' : 'Feminino ♀'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('emp_schedule_lbl')} *</label>
                <select
                  value={schedule}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSchedule(val);
                    if (val === '5x2') {
                      setDaysOff(['saturday', 'sunday']);
                    } else if (val === '6x1') {
                      setDaysOff(['sunday']);
                    } else if (val === 'Escala Customizada') {
                      setDaysOff([]);
                    }
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
                >
                  <option value="5x2">{language === 'en' ? '5x2 (5 workdays x 2 restdays)' : language === 'es' ? '5x2 (5 días x 2 francos)' : '5x2 (5 dias de trabalho x 2 folgas)'}</option>
                  <option value="6x1">{language === 'en' ? '6x1 (6 workdays x 1 restday)' : language === 'es' ? '6x1 (6 días x 1 franco)' : '6x1 (6 dias de trabalho x 1 folga)'}</option>
                  <option value="Escala Customizada">{language === 'en' ? 'Custom / Occasional Schedule' : language === 'es' ? 'Escala Personalizada / Eventual' : 'Escala customizada/eventual'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Default Work Shift *' : language === 'es' ? 'Turno de Trabalho Principal *' : 'Turno de Trabalho Padrão *'}</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
              >
                <option value="Day Shift (7:00 AM - 3:00 PM)">Day Shift (7:00 AM - 3:00 PM)</option>
                <option value="Mid Shift (11:00 AM - 7:00 PM)">Mid Shift (11:00 AM - 7:00 PM)</option>
                <option value="Swing Shift (3:00 PM - 11:00 PM)">Swing Shift (3:00 PM - 11:00 PM)</option>
                <option value="Graveyard Shift (11:00 PM - 7:00 AM)">Graveyard Shift (11:00 PM - 7:00 AM)</option>
                {customShifts.length > 0 && (
                  <>
                    <option disabled className="bg-slate-250 font-bold">-- {language === 'en' ? 'Custom Shifts' : language === 'es' ? 'Turnos Personalizados' : 'Turnos Personalizados'} --</option>
                    {customShifts.map(cs => (
                      <option key={cs.id} value={cs.name}>
                        {cs.name} ({language === 'en' ? 'linked to' : language === 'es' ? 'vinculado a' : 'vinculado ao'} {cs.parentShift.split(' ')[0]})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Days Off Selector */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
              <span className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                {language === 'en' ? 'Weekly Days Off (Folgas)' : language === 'es' ? 'Días de Franco (Folgas)' : 'Dias de Folga Semanais'}
              </span>
              <p className="text-[11px] text-slate-400 mb-3">
                {language === 'en' ? 'Check the days this employee does NOT work. These will automatically sync as "FOLGA" on the Weekly Schedule.' : language === 'es' ? 'Marque los días en que el colaborador NO trabaja. Se guardarán como "FOLGA".' : 'Marque os dias em que o funcionário NÃO trabalha. Estes dias serão definidos como "FOLGA" automaticamente.'}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {[
                  { key: 'monday', label: t('schedule_mon') },
                  { key: 'tuesday', label: t('schedule_tue') },
                  { key: 'wednesday', label: t('schedule_wed') },
                  { key: 'thursday', label: t('schedule_thu') },
                  { key: 'friday', label: t('schedule_fri') },
                  { key: 'saturday', label: t('schedule_sat') },
                  { key: 'sunday', label: t('schedule_sun') },
                ].map((day) => {
                  const isChecked = daysOff.includes(day.key);
                  return (
                    <label
                      key={day.key}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDaysOff([...daysOff, day.key]);
                          } else {
                            setDaysOff(daysOff.filter((d) => d !== day.key));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      {day.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <span className="block text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-3">
                {language === 'en' ? 'Default Assets Under Custody Control (Optional)' : language === 'es' ? 'Identificación de Equipos Bajo Custodia Padrón (Opcional)' : 'Identificação de Ativos Sob Custódia Padrão (Opcional)'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-600" /> {language === 'en' ? 'Default Radio HT Channel' : language === 'es' ? 'Canal de Radio Padrón' : 'Canal de Rádio Padrão'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 14"
                    value={radio}
                    onChange={(e) => setRadio(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Key className="w-3 h-3 text-amber-600" /> {language === 'en' ? 'Keyring / Drawer ID #' : language === 'es' ? 'Llavero de Custodia #' : 'Chave / Claviculário nº'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: A-03"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3 text-emerald-600" /> {language === 'en' ? 'Default Cleaning Cart #' : language === 'es' ? 'Carro de Limpieza #' : 'Carrinho Padrão'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 02"
                    value={cart}
                    onChange={(e) => setCart(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold p-3 rounded-lg transition-transform active:scale-99 cursor-pointer"
              >
                {editingEmployee
                  ? (language === 'en' ? 'Save Changes' : language === 'es' ? 'Guardar Cambios' : 'Salvar Alterações')
                  : (language === 'en' ? 'Register Employee' : language === 'es' ? 'Registrar Empleado' : 'Cadastrar Colaborador')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-slate-105 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 rounded-lg cursor-pointer"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Employees database explorer */
        <div className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm bg-white border border-slate-200 p-2 rounded-xl focus-within:border-indigo-500 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search employee or role...' : language === 'es' ? 'Buscar empleado o puesto...' : 'Buscar colaborador ou cargo...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div 
                key={emp.id} 
                className={`bg-white rounded-xl border border-slate-100 p-5 ${
                  !emp.active ? 'opacity-65' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${emp.active ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                        {emp.name}
                        {emp.employeeNumber && (
                          <span className="text-[10px] text-slate-400 font-mono font-semibold bg-slate-50 border border-slate-100 rounded px-1 py-0.5 shrink-0" title={`${language === 'en' ? 'Employee' : language === 'es' ? 'Colaborador' : 'Colaborador'} #${emp.employeeNumber}`}>
                            #{emp.employeeNumber}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1 items-center mt-1">
                      <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 block w-fit">
                        {emp.role}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border block w-fit ${
                        emp.gender === 'Feminino'
                          ? 'text-pink-700 bg-pink-50 border-pink-100'
                          : 'text-blue-700 bg-blue-50 border-blue-100'
                      }`}>
                        {emp.gender === 'Feminino'
                          ? (language === 'en' ? 'Female ♀' : language === 'es' ? 'Femenino ♀' : 'Feminino ♀')
                          : (language === 'en' ? 'Male ♂' : language === 'es' ? 'Masculino ♂' : 'Masculino ♂')}
                      </span>
                      {(emp.role.toLowerCase().includes('supervisor') || emp.role.toLowerCase().includes('administrador') || emp.role.toLowerCase().includes('líder') || emp.role.toLowerCase().includes('gerente') || emp.role === 'Public Area Supervisor') && (
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md px-1.5 py-0.5 font-bold flex items-center gap-1 shrink-0" title={language === 'en' ? 'Password Protected Account' : language === 'es' ? 'Cuenta Protegida con Contraseña' : 'Conta Protegida com Senha'}>
                          <Lock className="w-2.5 h-2.5 text-indigo-600" /> {language === 'en' ? 'Protected' : language === 'es' ? 'Protegida' : 'Senha Ativa'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditClick(emp)}
                      className="p-1.5 text-slate-450 hover:text-indigo-650 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title={language === 'en' ? 'Edit Profile' : language === 'es' ? 'Editar Colaborador' : 'Editar Cadastro'}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(emp)}
                      className="p-1.5 text-slate-450 hover:text-red-500 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title={language === 'en' ? 'Delete' : language === 'es' ? 'Eliminar' : 'Excluir'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Primary Shift:' : language === 'es' ? 'Turno Principal:' : 'Turno Principal:'}</span>
                    <strong className="text-slate-700">{emp.shift}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Gender:' : language === 'es' ? 'Género:' : 'Gênero:'}</span>
                    <strong className="text-slate-700">
                      {emp.gender === 'Feminino'
                        ? (language === 'en' ? 'Female' : language === 'es' ? 'Femenino' : 'Feminino')
                        : (language === 'en' ? 'Male' : language === 'es' ? 'Masculino' : 'Masculino')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{language === 'en' ? 'Roster Cycle:' : language === 'es' ? 'Régimen de Escala:' : 'Regime Escala:'}</span>
                    <strong className="text-slate-700 font-mono">{language === 'en' ? 'Cycle' : language === 'es' ? 'Escala' : 'Escala'} {emp.schedule}</strong>
                  </div>
                  {emp.daysOff && emp.daysOff.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'en' ? 'Days Off:' : language === 'es' ? 'Días de Franco:' : 'Dias de Folga:'}</span>
                      <strong className="text-rose-600 bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5 text-[10px] font-bold flex gap-1 items-center shrink-0">
                        {emp.daysOff.map(dayKey => {
                          const lookupMap: Record<string, string> = {
                            monday: language === 'en' ? 'Mon' : language === 'es' ? 'Lun' : 'Seg',
                            tuesday: language === 'en' ? 'Tue' : language === 'es' ? 'Mar' : 'Ter',
                            wednesday: language === 'en' ? 'Wed' : language === 'es' ? 'Mié' : 'Qua',
                            thursday: language === 'en' ? 'Thu' : language === 'es' ? 'Jue' : 'Qui',
                            friday: language === 'en' ? 'Fri' : language === 'es' ? 'Vie' : 'Sex',
                            saturday: language === 'en' ? 'Sat' : language === 'es' ? 'Sáb' : 'Sáb',
                            sunday: language === 'en' ? 'Sun' : language === 'es' ? 'Dom' : 'Dom',
                          };
                          return lookupMap[dayKey] || dayKey;
                        }).join(', ')}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Default equipments */}
                <div className="mt-4 border-t border-slate-100/80 pt-3 flex items-center justify-between text-[11px] font-medium text-slate-400">
                  <span className="text-[10px] uppercase font-mono">{language === 'en' ? 'Equipments:' : language === 'es' ? 'Equipamiento:' : 'Equipamentos:'}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5" title="Radios">
                      <Radio className="w-3 h-3 text-cyan-600" /> <span className="text-slate-700 font-bold">{emp.defaultRadioNumber || '-'}</span>
                    </div>
                    <div className="flex items-center gap-0.5" title="Keys">
                      <Key className="w-3 h-3 text-amber-600" /> <span className="text-slate-700 font-bold">{emp.defaultKeyNumber || '-'}</span>
                    </div>
                    <div className="flex items-center gap-0.5" title="Carts">
                      <ShoppingCart className="w-3 h-3 text-emerald-600" /> <span className="text-slate-700 font-bold">{emp.defaultCartNumber || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle control */}
                <div className="mt-4 border-t border-slate-100 pt-3 flex justify-end">
                  <button
                    onClick={() => handleToggleActive(emp.id, emp.active)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      emp.active
                        ? 'bg-amber-50/50 hover:bg-amber-100 border-amber-100 text-amber-850'
                        : 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-100 text-emerald-850'
                    }`}
                  >
                    {emp.active 
                      ? (language === 'en' ? 'Suspend / Deactivate' : language === 'es' ? 'Apartar / Desactivar' : 'Afastar / Desativar') 
                      : (language === 'en' ? 'Reactivate Profile' : language === 'es' ? 'Reactivar Registro' : 'Reativar Cadastro')}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-905/40 backdrop-blur-xs"
            onClick={() => setDeletingEmployee(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setDeletingEmployee(null)}
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
                  ? `Are you sure you want to permanently remove employee "${deletingEmployee.name}"? This action cannot be undone.`
                  : language === 'es'
                  ? `¿Está seguro de que desea eliminar permanentemente al colaborador "${deletingEmployee.name}"? Esta acción no se puede deshacer.`
                  : `Tem certeza de que deseja remover permanentemente o colaborador "${deletingEmployee.name}"? Esta ação não poderá ser desfeita.`}
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingEmployee(null)}
                  className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all active:scale-99 cursor-pointer"
                >
                  {language === 'en' ? 'Delete' : language === 'es' ? 'Eliminar' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Shifts Management Modal */}
      {showCustomShiftsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-905/40 backdrop-blur-xs"
            onClick={() => {
              setShowCustomShiftsModal(false);
              setShiftError('');
              setNewShiftName('');
            }}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-6 max-w-lg w-full shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <button
              onClick={() => {
                setShowCustomShiftsModal(false);
                setShiftError('');
                setNewShiftName('');
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2 mb-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              {language === 'en' ? 'Manage Custom Shifts' : language === 'es' ? 'Gestionar Turnos Especiales' : 'Gerenciar Turnos Customizados'}
            </h3>

            {/* Scrollable area */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-5 py-2">
              {/* Add form */}
              <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Create Alternative Shift' : language === 'es' ? 'Crear Turno Especial' : 'Cadastrar Turno Alternativo'}
                </h4>

                {shiftError && (
                  <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg">
                    {shiftError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {language === 'en' ? 'Shift Name *' : language === 'es' ? 'Nombre del Turno *' : 'Nome do Turno *'}
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      placeholder={language === 'en' ? 'Ex: Alt Mid Shift (12pm-8pm)' : language === 'es' ? 'Ej: Turno Intermedio B (12:00-20:00)' : 'Ex: Turno Intermediário B (12:00-20:00)'}
                      value={newShiftName}
                      onChange={(e) => {
                        setNewShiftName(e.target.value);
                        setShiftError('');
                      }}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {language === 'en' ? 'Link to Standard Shift *' : language === 'es' ? 'Vincular al Turno Patrón *' : 'Vincular ao Turno Padrão *'}
                    </label>
                    <select
                      value={newShiftParent}
                      onChange={(e) => setNewShiftParent(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 outline-none font-medium"
                    >
                      <option value="Day Shift (7:00 AM - 3:00 PM)">Day Shift (7:00 AM - 3:00 PM)</option>
                      <option value="Mid Shift (11:00 AM - 7:00 PM)">Mid Shift (11:00 AM - 7:00 PM)</option>
                      <option value="Swing Shift (3:00 PM - 11:00 PM)">Swing Shift (3:00 PM - 11:00 PM)</option>
                      <option value="Graveyard Shift (11:00 PM - 7:00 AM)">Graveyard Shift (11:00 PM - 7:00 AM)</option>
                    </select>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  💡 {language === 'en' 
                    ? 'Linking to a standard shift keeps the weekly schedule organized and correctly sorted.' 
                    : language === 'es' 
                    ? 'Vincular a un turno patrón mantiene la escala semanal organizada y ordenada correctamente.' 
                    : 'Vincular a um turno padrão mantém o cronograma semanal organizado e ordenado de forma coesa.'}
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newShiftName.trim()) {
                        setShiftError(language === 'en' ? 'Shift name is required.' : language === 'es' ? 'Se requiere el nombre del turno.' : 'Nome do turno é obrigatório.');
                        return;
                      }
                      
                      // Check for duplicates
                      const normalizedInput = newShiftName.trim().toLowerCase();
                      const duplicate = customShifts.some(cs => cs.name.toLowerCase() === normalizedInput) ||
                        ['day shift (7:00 am - 3:00 pm)', 'mid shift (11:00 am - 7:00 pm)', 'swing shift (3:00 pm - 11:00 pm)', 'graveyard shift (11:00 pm - 7:00 am)']
                        .some(standard => standard.toLowerCase() === normalizedInput);
                      
                      if (duplicate) {
                        setShiftError(language === 'en' ? 'This shift name already exists.' : language === 'es' ? 'Este nombre de turno ya existe.' : 'Este nome de turno já existe.');
                        return;
                      }

                      await addCustomShift({
                        name: newShiftName.trim(),
                        parentShift: newShiftParent
                      });

                      setNewShiftName('');
                      setShiftError('');
                    }}
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {language === 'en' ? 'Add Shift' : language === 'es' ? 'Agregar Turno' : 'Adicionar Turno'}
                  </button>
                </div>
              </div>

              {/* Shifts list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  {language === 'en' ? 'Registered Custom Shifts' : language === 'es' ? 'Turnos Especiales Registrados' : 'Turnos Alternativos Cadastrados'}
                </h4>

                {customShifts.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-25/50">
                    <p className="text-xs text-slate-450">
                      {language === 'en' ? 'No custom shifts registered yet.' : language === 'es' ? 'Aún no hay turnos especiales registrados.' : 'Nenhum turno alternativo cadastrado ainda.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
                    {customShifts.map((cs) => {
                      // Count employees using this shift
                      const count = employees.filter(emp => emp.shift === cs.name).length;
                      
                      return (
                        <div key={cs.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-25/50 transition-colors">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900 block">{cs.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">
                              {language === 'en' ? 'Linked to:' : language === 'es' ? 'Vinculado a:' : 'Vinculado a:'}{' '}
                              <strong className="text-slate-500 font-semibold">{cs.parentShift.split(' ')[0]}</strong>
                              {count > 0 && ` • ${count} ${language === 'en' ? 'employee(s)' : language === 'es' ? 'colaborador(es)' : 'funcionário(s)'}`}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={async () => {
                              if (!checkPermission()) return;
                              if (count > 0) {
                                const confirmDelete = confirm(
                                  language === 'en'
                                    ? `Warning: ${count} employee(s) are currently assigned to this shift. Are you sure you want to delete it?`
                                    : language === 'es'
                                    ? `Atención: ${count} colaborador(es) tienen este turno asignado. ¿Desea eliminarlo igualmente?`
                                    : `Atenção: ${count} funcionário(s) estão atualmente associados a este turno. Tem certeza de que deseja excluí-lo?`
                                );
                                if (!confirmDelete) return;
                              }
                              await deleteCustomShift(cs.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={language === 'en' ? 'Delete Shift' : language === 'es' ? 'Eliminar Turno' : 'Excluir Turno'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCustomShiftsModal(false);
                  setShiftError('');
                  setNewShiftName('');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer"
              >
                {language === 'en' ? 'Close' : language === 'es' ? 'Cerrar' : 'Fechar'}
              </button>
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
                Permissão negada. Somente o funcionário <strong>Daniel Gomes</strong> (Moderador & Administrador do Sistema) tem autorização para incluir, alterar ou excluir cadastros de colaboradores e turnos.
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
