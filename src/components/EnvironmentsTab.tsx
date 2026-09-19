import React, { useState } from 'react';
import { useApp, isSystemAdmin } from '../context/AppContext';
import { WorkEnvironment, Employee } from '../types';
import { getLocalizedEnvironmentName, compareEnvironmentsNumerically } from '../data/taskTranslations';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Layers, 
  HelpCircle,
  FileText,
  BadgeAlert,
  ArrowRight,
  X,
  Pencil,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface EnvironmentsTabProps {
  currentUser?: Employee;
}

export const EnvironmentsTab: React.FC<EnvironmentsTabProps> = ({ currentUser }) => {
  const { environments, addEnvironment, deleteEnvironment, updateEnvironment, t, language } = useApp();
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

  // Mode state
  const [isAdding, setIsAdding] = useState(false);
  const [editingEnv, setEditingEnv] = useState<WorkEnvironment | null>(null);
  
  // Custom delete confirmation state
  const [deletingEnv, setDeletingEnv] = useState<WorkEnvironment | null>(null);
  
  // Create states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Subareas tag-compiled state
  const [subAreas, setSubAreas] = useState<string[]>([]);
  const [newSubAreaInput, setNewSubAreaInput] = useState('');

  // Edit handler
  const handleEditClick = (env: WorkEnvironment) => {
    if (!checkPermission()) return;
    setEditingEnv(env);
    setName(env.name);
    setDescription(env.description || '');
    setSubAreas(env.subAreas);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setSubAreas([]);
    setEditingEnv(null);
    setIsAdding(false);
  };

  // Handle adding tags
  const handleAddSubAreaTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission()) return;
    const cleanText = newSubAreaInput.trim();
    if (!cleanText) return;

    if (subAreas.includes(cleanText)) {
      setNewSubAreaInput('');
      return;
    }

    setSubAreas(prev => [...prev, cleanText]);
    setNewSubAreaInput('');
  };

  const handleRemoveSubAreaTag = (indexToRemove: number) => {
    if (!checkPermission()) return;
    setSubAreas(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // Submit main environment
  const handleCreateEnvironment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission()) return;
    if (!name.trim()) return;

    if (editingEnv) {
      updateEnvironment(editingEnv.id, {
        name: name.trim(),
        description: description.trim(),
        subAreas: subAreas.length > 0 ? subAreas : ['Geral']
      });
    } else {
      addEnvironment({
        name: name.trim(),
        description: description.trim(),
        subAreas: subAreas.length > 0 ? subAreas : ['Geral']
      });
    }

    // Reset fields
    handleCancel();
  };

  const handleDeleteClick = (env: WorkEnvironment) => {
    if (!checkPermission()) return;
    setDeletingEnv(env);
  };

  const handleConfirmDeleteEnv = () => {
    if (!checkPermission()) return;
    if (deletingEnv) {
      deleteEnvironment(deletingEnv.id);
      setDeletingEnv(null);
    }
  };

  const handleDeleteDummy = (id: string, name: string) => {
    const confirmMsg = language === 'en' 
      ? `Deleting environment "${name}" will remove all associated routines from future lists. Confirm?` 
      : language === 'es' 
      ? `Eliminar el sector "${name}" quitará todas sus rutinas asociadas en checklists futuros. ¿Confirmar?` 
      : `Excluir o ambiente "${name}" removerá suas rotinas associadas dos guias futuros. Confirmar?`;
    
    if (confirm(confirmMsg)) {
      deleteEnvironment(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Non-admin read-only banner */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-2xs">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold block">🔒 Modo de Leitura Restrito</span>
            <span>Alterações nos cadastros de ambientes e subáreas são permitidas exclusivamente para o moderador e administrador do sistema (<strong>Daniel Gomes</strong>).</span>
          </div>
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-sans font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-600" />
            {t('env_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('env_subtitle')}
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
          className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {isAdding 
            ? (language === 'en' ? 'View Mapped Environments' : language === 'es' ? 'Ver Áreas Mapeadas' : 'Ver Ambientes Mapeados') 
            : t('env_add_btn')}
        </button>
      </div>

      {isAdding ? (
        /* Create Environment View */
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 shadow-xs p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-3">
            {editingEnv 
              ? (language === 'en' ? 'Edit Mapped Environment' : language === 'es' ? 'Editar Área Mapeada' : 'Editar Ambiente Mapeado') 
              : t('env_new_form')}
          </h2>

          <form onSubmit={handleCreateEnvironment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('env_name_lbl')} *</label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder={language === 'en' ? 'Ex: Reception & Entry Lobby' : language === 'es' ? 'Ej: Recepción e Hall de Entrada' : 'Ex: Recepção e Lobby de Entrada'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'en' ? 'Description / Complexity Notes' : language === 'es' ? 'Descripción / Notas de Complejidad' : 'Descrição / Notas de Complexidade'}</label>
              <textarea
                rows={2}
                maxLength={120}
                placeholder={language === 'en' ? 'Ex: High visibility space with glass and marble surfaces. Requires hourly attention.' : language === 'es' ? 'Ej: Espacio de alta visibilidad con superficies de vidrio y mármol. Requiere atención constante.' : 'Ex: Espaço de muita visibilidade com superfícies de vidro e mármore. Requer cuidado de hora em hora.'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none resize-none font-medium"
              ></textarea>
            </div>

            {/* Subareas Dynamic Tags Builder */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-0.5">{language === 'en' ? 'Map Sector Sub-areas (Critical Locations)' : language === 'es' ? 'Mapear Sub-áreas del Sector (Puntos Críticos)' : 'Mapear Sub-áreas do Setor (Pontos Críticos)'}</label>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
                  {language === 'en' ? 'Add specific rooms, restrooms, or patios contained inside this general environment.' : language === 'es' ? 'Añada salas específicas, baños o patios contenidos dentro de este entorno general.' : 'Adicione as salas específicas, banheiros ou pátios de responsabilidade contidos neste ambiente geral.'}
                </p>
              </div>

              {/* Tag creation input (stops default form submission) */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Ex: Restroom Female Stall 1' : language === 'es' ? 'Ej: Baño Femenino Cabina 1' : 'Ex: Banheiro Feminino Box 1'}
                  value={newSubAreaInput}
                  onChange={(e) => setNewSubAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const cleanText = newSubAreaInput.trim();
                      if (cleanText) {
                        if (!subAreas.includes(cleanText)) {
                          setSubAreas(prev => [...prev, cleanText]);
                        }
                        setNewSubAreaInput('');
                      }
                    }
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2 outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const cleanText = newSubAreaInput.trim();
                    if (cleanText) {
                      if (!subAreas.includes(cleanText)) {
                        setSubAreas(prev => [...prev, cleanText]);
                      }
                      setNewSubAreaInput('');
                    }
                  }}
                  className="bg-indigo-600 font-semibold hover:bg-indigo-750 text-white rounded-lg px-4 text-xs cursor-pointer"
                >
                  {t('add')}
                </button>
              </div>

              {/* Tag visualization */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {subAreas.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">{language === 'en' ? 'Write and add above to list sub-areas...' : language === 'es' ? 'Escriba y añada arriba para listar sub-áreas...' : 'Escreva e adicione acima para compor sub-áreas...'}</span>
                ) : (
                  subAreas.map((sub, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full text-center font-medium"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubAreaTag(i)}
                        className="text-slate-400 hover:text-red-500 font-bold ml-1 text-xs cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Form actions */}
            <div className="border-t border-slate-100 pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold p-3 rounded-lg transition-transform active:scale-99 cursor-pointer"
              >
                {editingEnv
                  ? (language === 'en' ? 'Save Changes' : language === 'es' ? 'Guardar Cambios' : 'Salvar Alterações')
                  : (language === 'en' ? 'Save Mapped Area' : language === 'es' ? 'Guardar Área Mapeada' : 'Salvar Ambientes Mapeados')}
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
        /* List Environments */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...environments].sort((a, b) => compareEnvironmentsNumerically(a.name, b.name)).map((env) => (
            <div key={env.id} className="bg-white rounded-xl border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow p-5 flex flex-col justify-between">
              
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 animate-pulse-subtle">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{getLocalizedEnvironmentName(env.name, language)}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(env)}
                      className="p-1 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-md cursor-pointer"
                      title={language === 'en' ? 'Edit Area' : language === 'es' ? 'Editar Área' : 'Editar Setor'}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(env)}
                      className="p-1 text-slate-400 hover:text-red-650 bg-slate-50 hover:bg-slate-100 rounded-md cursor-pointer"
                      title={language === 'en' ? 'Delete Area' : language === 'es' ? 'Eliminar Área' : 'Excluir Setor'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {env.description && (
                  <p className="text-[11px] text-slate-400 mt-2.5 bg-slate-50 p-2.5 rounded-lg leading-relaxed border border-slate-100/30">
                    {env.description}
                  </p>
                )}

                {/* Subareas nested list */}
                <div className="mt-4 space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                    {language === 'en' ? 'Critical Checkpoints / Sub-areas' : language === 'es' ? 'Puntos Críticos / Sub-áreas' : 'Pontos Críticos / Sub-áreas'} ({env.subAreas.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {env.subAreas.map((sub, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-650 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-105">
                        {getLocalizedEnvironmentName(sub, language)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status information badge footer */}
              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>CÓD: {env.id.toUpperCase()}</span>
                <span>{language === 'en' ? 'Active Mapping' : language === 'es' ? 'Mapeo Activo' : 'Mapeamento Ativo'}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingEnv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-905/40 backdrop-blur-xs"
            onClick={() => setDeletingEnv(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setDeletingEnv(null)}
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
                  ? `Deleting environment "${deletingEnv.name}" will remove all associated routines from future lists. Confirm?`
                  : language === 'es'
                  ? `Eliminar el sector "${deletingEnv.name}" eliminará las rutinas correspondientes de listas de control futuras. ¿Confirmar?`
                  : `Excluir o ambiente "${deletingEnv.name}" removerá suas rotinas associadas dos checklists futuros. Confirmar?`}
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingEnv(null)}
                  className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'es' ? 'Cancelar' : 'Cancelar'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteEnv}
                  className="w-full text-xs font-semibold text-white bg-red-600 hover:bg-red-700 py-3 rounded-xl transition-all active:scale-99 cursor-pointer"
                >
                  {language === 'en' ? 'Delete' : language === 'es' ? 'Eliminar' : 'Excluir'}
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
                Permissão negada. Somente o funcionário <strong>Daniel Gomes</strong> (Moderador & Administrador do Sistema) tem autorização para incluir, alterar ou excluir cadastros de ambientes e áreas de trabalho.
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
