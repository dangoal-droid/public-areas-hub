import { Employee, WorkEnvironment, TaskTemplate, DailyChecklist } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-0',
    name: 'Daniel Gomes',
    employeeNumber: '1000',
    password: '1234',
    shift: 'Day Shift (7:00 AM - 3:00 PM)',
    schedule: '5x2',
    role: 'Moderador & Administrador',
    defaultCartNumber: 'N/A',
    defaultRadioNumber: '00',
    defaultKeyNumber: 'ADM-01',
    active: true,
    gender: 'Masculino'
  },
  {
    id: 'emp-1',
    name: 'João Pedro Silva',
    employeeNumber: '1001',
    shift: 'Day Shift (7:00 AM - 3:00 PM)',
    schedule: '5x2',
    role: 'Casino Porter',
    defaultCartNumber: '02',
    defaultRadioNumber: '14',
    defaultKeyNumber: 'A-03',
    active: true,
    gender: 'Masculino'
  },
  {
    id: 'emp-2',
    name: 'Maria Eduarda Oliveira',
    employeeNumber: '1002',
    shift: 'Swing Shift (3:00 PM - 11:00 PM)',
    schedule: '5x2',
    role: 'Casino Porter',
    defaultCartNumber: '05',
    defaultRadioNumber: '09',
    defaultKeyNumber: 'B-12',
    active: true,
    gender: 'Feminino'
  },
  {
    id: 'emp-3',
    name: 'Carlos Henrique Santos',
    employeeNumber: '1003',
    password: '1234',
    shift: 'Day Shift (7:00 AM - 3:00 PM)',
    schedule: '5x2',
    role: 'Public Area Supervisor',
    defaultCartNumber: 'N/A',
    defaultRadioNumber: '07',
    defaultKeyNumber: 'G-01',
    active: true,
    gender: 'Masculino'
  },
  {
    id: 'emp-4',
    name: 'Ana Júlia Souza',
    employeeNumber: '1004',
    shift: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    schedule: 'Escala Customizada',
    role: 'Casino Porter',
    defaultCartNumber: '08',
    defaultRadioNumber: '22',
    defaultKeyNumber: 'C-08',
    active: true,
    gender: 'Feminino'
  },
  {
    id: 'emp-5',
    name: 'Roberta Martins Lima',
    employeeNumber: '1005',
    password: '1234',
    shift: 'Swing Shift (3:00 PM - 11:00 PM)',
    schedule: '5x2',
    role: 'Public Area Supervisor',
    defaultCartNumber: 'N/A',
    defaultRadioNumber: '01',
    defaultKeyNumber: 'Master-01',
    active: true,
    gender: 'Feminino'
  },
  {
    id: 'emp-6',
    name: 'Marcos Vinícius Costa',
    employeeNumber: '1006',
    shift: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    schedule: 'Escala Customizada',
    role: 'Casino Porter',
    defaultCartNumber: '04',
    defaultRadioNumber: '11',
    defaultKeyNumber: 'D-02',
    active: true,
    gender: 'Masculino'
  }
];

export const INITIAL_ENVIRONMENTS: WorkEnvironment[] = [
  {
    id: 'env-1',
    name: 'Lobby Principal & Recepção',
    description: 'Área de alta visibilidade e tráfego intenso de visitantes na entrada.',
    subAreas: ['Porta Giratória de Vidro', 'Balcão de Atendimento', 'Sofás e Poltronas de Espera', 'Catracas de Acesso', 'Tapetes de Entrada']
  },
  {
    id: 'env-2',
    name: 'Sanitários Sociais - Bloco A (Piso 1)',
    description: 'Foco em assepsia rigorosa e reabastecimento contínuo de insumos.',
    subAreas: ['Sanitário Feminino', 'Sanitário Masculino', 'Sanitário PNE / Acessível', 'Antecâmara com Espelhos', 'Dispensadores de Papel/Sabonete']
  },
  {
    id: 'env-3',
    name: 'Escritórios Administrativos - Bloco B',
    description: 'Áreas de escritórios corporativos, salas de diretoria e reuniões.',
    subAreas: ['Salas de Reunião (1 a 4)', 'Estações de Trabalho Organizadoras', 'Corredor Administrativo', 'Copa / Cafeteria', 'Salas de Diretoria']
  },
  {
    id: 'env-4',
    name: 'Refeitório Geral & Área de Convivência',
    description: 'Área comum de alimentação. Higienização programada devido a horários de pico.',
    subAreas: ['Balcões de Alimentação', 'Mesas e Cadeiras de Refeição', 'Pias de Lavatório Interno', 'Micro-ondas e Eletrodomésticos', 'Área de Descarte de Lixo']
  },
  {
    id: 'env-5',
    name: 'Garagem, Rampas & Docas',
    description: 'Área externa de recepção de mercadorias e estacionamentos.',
    subAreas: ['Rampa de Acesso Principal', 'Doca de Carga e Descarga', 'Hall de Elevadores (G1/G2)', 'Guarita dos Vigilantes', 'Depósito Central de Resíduos']
  }
];

export const INITIAL_TASK_TEMPLATES: TaskTemplate[] = [
  // Lobby Principal (env-1)
  {
    id: 'task-1',
    title: 'Aspirar os tapetes e capachos sanitizantes da entrada',
    description: 'Garantir que a sujidade grossa dos sapatos não seja levada para dentro do lobby.',
    type: 'routine',
    environmentId: 'env-1',
    shiftTarget: 'Day Shift (7:00 AM - 3:00 PM)',
    frequency: 'A cada 3 horas'
  },
  {
    id: 'task-2',
    title: 'Limpar marcas de dedos e poeira nos vidros e portas giratórias',
    description: 'Utilizar spray limpa-vidros e pano de microfibra azul para evitar fiapos.',
    type: 'routine',
    environmentId: 'env-1',
    shiftTarget: 'Todos',
    frequency: 'A cada 2 horas'
  },
  {
    id: 'task-3',
    title: 'Mapeamento e recolhimento de resíduos nos sofás de espera',
    description: 'Tirar papéis jogados, organizar almofadas e passar pano úmido rápido.',
    type: 'routine',
    environmentId: 'env-1',
    shiftTarget: 'Swing Shift (3:00 PM - 11:00 PM)',
    frequency: 'Duas vezes por turno'
  },
  {
    id: 'task-4',
    title: 'Mopeamento úmido do piso de granito com desinfetante neutro',
    description: 'Passar esfregão úmido com sinalização de piso molhado obrigatória.',
    type: 'routine',
    environmentId: 'env-1',
    shiftTarget: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    frequency: 'Uma vez por turno'
  },

  // Sanitários (env-2)
  {
    id: 'task-5',
    title: 'Reposição de papel toalha, papel higiênico e sabonete líquido',
    description: 'Verificar todos os boxes e pias femininas, masculinas e PNE.',
    type: 'routine',
    environmentId: 'env-2',
    shiftTarget: 'Todos',
    frequency: 'De hora em hora'
  },
  {
    id: 'task-6',
    title: 'Higienização das pias, torneiras e espelhos centrais',
    description: 'Eliminar marcas de respingo de água e sabão. Manter os metais polidos.',
    type: 'routine',
    environmentId: 'env-2',
    shiftTarget: 'Todos',
    frequency: 'A cada 2 horas'
  },
  {
    id: 'task-7',
    title: 'Esvaziar lixeiras e trocar sacolas plásticas (branca para resíduo infectante)',
    description: 'Amarrar devidamente o saco cheio e destinar ao expurgo local.',
    type: 'routine',
    environmentId: 'env-2',
    shiftTarget: 'Todos',
    frequency: 'Três vezes por turno'
  },
  {
    id: 'task-8',
    title: 'Lavação completa dos vasos sanitários e mictórios com cloro em gel',
    description: 'Deixar agir por 10 minutos antes de esfregar e dar descarga.',
    type: 'routine',
    environmentId: 'env-2',
    shiftTarget: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    frequency: 'Diário (Noite)'
  },

  // Escritórios (env-3)
  {
    id: 'task-9',
    title: 'Limpar poeira das mesas e superfícies corporativas desocupadas',
    description: 'Passar pano de microfibra com álcool isopropílico/70%. Não mexer em papéis pessoais.',
    type: 'routine',
    environmentId: 'env-3',
    shiftTarget: 'Day Shift (7:00 AM - 3:00 PM)',
    frequency: 'Diário'
  },
  {
    id: 'task-10',
    title: 'Higienização rápida da copa e reabastecimento de copos plásticos',
    description: 'Limpar pia da copa, bancada do café e repor suporte de copos.',
    type: 'routine',
    environmentId: 'env-3',
    shiftTarget: 'Swing Shift (3:00 PM - 11:00 PM)',
    frequency: 'Duas vezes por turno'
  },
  {
    id: 'task-11',
    title: 'Aspirar carpetes das salas de reunião e corredores centrais',
    description: 'Passar aspirador industrial silencioso nas salas 1, 2, 3 e 4.',
    type: 'routine',
    environmentId: 'env-3',
    shiftTarget: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    frequency: 'Diário (Noite)'
  },

  // Refeitório (env-4)
  {
    id: 'task-12',
    title: 'Limpeza e desinfecção de mesas e cadeiras com álcool 70%',
    description: 'Ação crítica durante e logo após os horários de pico (11:30 às 14:00 e 18:00 às 20:00).',
    type: 'routine',
    environmentId: 'env-4',
    shiftTarget: 'Swing Shift (3:00 PM - 11:00 PM)',
    frequency: 'Continuo nos picos'
  },
  {
    id: 'task-13',
    title: 'Recolhimento sistemático de lixo orgânico e reciclável (refeitório)',
    description: 'Evitar acúmulo nas lixeiras centrais para afastar pragas e odores.',
    type: 'routine',
    environmentId: 'env-4',
    shiftTarget: 'Todos',
    frequency: 'A cada 3 horas'
  },

  // Tarefas Eventuais Globais (Sem área obrigatória ou customizadas)
  {
    id: 'task-eventual-1',
    title: 'Lavação pressurizada da rampa externa de acesso de veículos',
    description: 'Utilizar lavadora de alta pressão para remover lodo e marcas de pneu.',
    type: 'occasional',
    frequency: 'Semanal / Sob Demanda'
  },
  {
    id: 'task-eventual-2',
    title: 'Polimento específico do balcão de mármore do Lobby Principal',
    description: 'Aplicação de cera cristalizadora e politriz para reaver o brilho natural.',
    type: 'occasional',
    environmentId: 'env-1',
    frequency: 'Quinzenal'
  },
  {
    id: 'task-eventual-3',
    title: 'Limpeza interna pesada de geladeiras e freezers do refeitório',
    description: 'Desligar equipamentos, retirar itens esquecidos e passar sanitizante neutro.',
    type: 'occasional',
    environmentId: 'env-4',
    frequency: 'Mensal'
  },
  {
    id: 'task-eventual-4',
    title: 'Higienização de luminárias e grelhas de ar condicionado em altura',
    description: 'Necessita escada metálica e uso de Equipamento de Proteção Individual (EPI).',
    type: 'occasional',
    frequency: 'Mensal'
  }
];

// Seed checklists for today
const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const INITIAL_CHECKLISTS: DailyChecklist[] = [
  {
    id: 'ch-1',
    employeeId: 'emp-1',
    employeeName: 'João Pedro Silva',
    employeeRole: 'Casino Porter',
    shift: 'Day Shift (7:00 AM - 3:00 PM)',
    date: getTodayString(),
    intervalTime: '10:00 - 11:00',
    coverageTime: '11:00 - 11:30',
    cartNumber: '02',
    radioNumber: '14',
    keyNumber: 'A-03',
    environmentId: 'env-1',
    environmentName: 'Lobby Principal & Recepção',
    status: 'in_progress',
    tasks: [
      {
        id: 'task-1',
        title: 'Aspirar os tapetes e capachos sanitizantes da entrada',
        description: 'Garantir que a sujidade grossa dos sapatos não seja levada para dentro do lobby.',
        completed: true,
        completedAt: '2026-05-31T07:15:00Z',
        notes: 'Feito com o aspirador nº 3.'
      },
      {
        id: 'task-2',
        title: 'Limpar marcas de dedos e poeira nos vidros e portas giratórias',
        description: 'Utilizar spray limpa-vidros e pano de microfibra azul para evitar fiapos.',
        completed: true,
        completedAt: '2026-05-31T08:45:00Z'
      },
      {
        id: 'task-eventual-2',
        title: 'Polimento específico do balcão de mármore do Lobby Principal',
        description: 'Aplicação de cera cristalizadora e politriz para reaver o brilho natural.',
        completed: false,
        isCustomOccasional: true
      },
      {
        id: 'custom-task-new-1',
        title: 'Organizar guarita de chaves desativadas a pedido da chefia',
        description: 'Organizar o quadro de chaves antigas que estava bagunçado.',
        completed: false,
        isCustomOccasional: true
      }
    ],
    notes: 'Iniciado rádio em perfeito funcionamento. Carrinho limpo e abastecido.'
  },
  {
    id: 'ch-2',
    employeeId: 'emp-2',
    employeeName: 'Maria Eduarda Oliveira',
    employeeRole: 'Casino Porter',
    shift: 'Swing Shift (3:00 PM - 11:00 PM)',
    date: getTodayString(),
    intervalTime: '18:00 - 19:00',
    coverageTime: '19:00 - 19:45',
    cartNumber: '05',
    radioNumber: '09',
    keyNumber: 'B-12',
    environmentId: 'env-2',
    environmentName: 'Sanitários Sociais - Bloco A (Piso 1)',
    status: 'pending',
    tasks: [
      {
        id: 'task-5',
        title: 'Reposição de papel toalha, papel higiênico e sabonete líquido',
        description: 'Verificar todos os boxes e pias femininas, masculinas e PNE.',
        completed: false
      },
      {
        id: 'task-6',
        title: 'Higienização das pias, torneiras e espelhos centrais',
        description: 'Eliminar marcas de respingo de água e sabão. Manter os metais polidos.',
        completed: false
      },
      {
        id: 'task-7',
        title: 'Esvaziar lixeiras e trocar sacolas plásticas (branca para resíduo infectante)',
        completed: false
      }
    ],
    notes: 'Aguardando o início do turno da tarde.'
  },
  {
    id: 'ch-3',
    employeeId: 'emp-4',
    employeeName: 'Ana Júlia Souza',
    employeeRole: 'Casino Porter',
    shift: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    date: getTodayString(),
    intervalTime: '02:00 - 03:00',
    coverageTime: 'Nenhum',
    cartNumber: '08',
    radioNumber: '22',
    keyNumber: 'C-08',
    environmentId: 'env-3',
    environmentName: 'Escritórios Administrativos - Bloco B',
    status: 'completed',
    tasks: [
      {
        id: 'task-11',
        title: 'Aspirar carpetes das salas de reunião e corredores centrais',
        description: 'Passar aspirador industrial silencioso nas salas 1, 2, 3 e 4.',
        completed: true,
        completedAt: '2026-05-31T01:30:00Z'
      },
      {
        id: 'custom-task-noite',
        title: 'Limpar poeira das prateleiras de arquivos confidenciais',
        description: 'Limpeza externa com pano seco para não danificar arquivamento histórico.',
        completed: true,
        completedAt: '2026-05-31T03:40:00Z',
        isCustomOccasional: true
      }
    ],
    notes: 'Todas as salas fechadas e trancadas após a limpeza. Chave C-08 devolvida ao final.'
  }
];
