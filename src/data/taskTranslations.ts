export interface LocalizedTaskData {
  title: string;
  description: string;
  bullets?: string[];
}

export const TASK_TRANSLATIONS: Record<string, Record<'pt' | 'en' | 'es', LocalizedTaskData>> = {
  'task-1': {
    pt: {
      title: 'Aspirar os tapetes e capachos sanitizantes da entrada',
      description: 'Garantir que a sujidade grossa dos sapatos não seja levada para dentro do lobby.'
    },
    en: {
      title: 'Vacuum the carpets and sanitizing mats at the entrance',
      description: 'Ensure that heavy dirt from shoes is not carried inside the lobby.'
    },
    es: {
      title: 'Aspirar las alfombras y tapetes sanitantes de la entrada',
      description: 'Garantizar que la suciedad gruesa de los zapatos no se lleve dentro del lobby.'
    }
  },
  'task-2': {
    pt: {
      title: 'Limpar marcas de dedos e poeira nos vidros e portas giratórias',
      description: 'Utilizar spray limpa-vidros e pano de microfibra azul para evitar fiapos.'
    },
    en: {
      title: 'Clean fingerprints and dust on glass and revolving doors',
      description: 'Use glass cleaner spray and a blue microfiber cloth to avoid lint.'
    },
    es: {
      title: 'Limpiar marcas de dedos y polvo en los vidrios y puertas giratorias',
      description: 'Utilizar spray limpiavidrios y paño de microfibra azul para evitar pelusas.'
    }
  },
  'task-3': {
    pt: {
      title: 'Mapeamento e recolhimento de resíduos nos sofás de espera',
      description: 'Tirar papéis jogados, organizar almofadas e passar pano úmido rápido.'
    },
    en: {
      title: 'Spotting and collecting waste on the waiting area sofas',
      description: 'Remove discarded papers, organize cushions, and run a quick damp cloth.'
    },
    es: {
      title: 'Mapeo y recogida de residuos en los sofás de espera',
      description: 'Quitar papeles tirados, organizar cojines y pasar un paño húmedo rápido.'
    }
  },
  'task-4': {
    pt: {
      title: 'Mopeamento úmido do piso de granito com desinfetante neutro',
      description: 'Passar esfregão úmido com sinalização de piso molhado obrigatória.'
    },
    en: {
      title: 'Damp mopping of the granite floor with neutral disinfectant',
      description: 'Mop with a damp cloth with mandatory wet floor signage.'
    },
    es: {
      title: 'Trapeado húmedo del piso de granito con desinfectante neutro',
      description: 'Pasar trapeador húmedo con señalización de piso mojado obligatoria.'
    }
  },
  'task-5': {
    pt: {
      title: 'Reposição de papel toalha, papel higiênico e sabonete líquido',
      description: 'Verificar todos os boxes e pias femininas, masculinas e PNE.'
    },
    en: {
      title: 'Replenishment of paper towels, toilet paper, and liquid soap',
      description: 'Check all stalls and sinks for women, men, and accessible restrooms.'
    },
    es: {
      title: 'Reposición de toallas de papel, papel higiénico y jabón líquido',
      description: 'Verificar todos los cubículos y lavabos femeninos, masculinos y para personas con discapacidad.'
    }
  },
  'task-6': {
    pt: {
      title: 'Higienização das pias, torneiras e espelhos centrais',
      description: 'Eliminar marcas de respingo de água e sabão. Manter os metais polidos.'
    },
    en: {
      title: 'Sanitization of sinks, faucets, and central mirrors',
      description: 'Eliminate water splashes and soap marks. Keep metals polished.'
    },
    es: {
      title: 'Higienización de lavabos, grifos y espejos centrales',
      description: 'Eliminar marcas de salpicaduras de agua y jabón. Mantener los metales pulidos.'
    }
  },
  'task-7': {
    pt: {
      title: 'Esvaziar lixeiras e trocar sacolas plásticas (branca para resíduo infectante)',
      description: 'Amarrar devidamente o saco cheio e destinar ao expurgo local.'
    },
    en: {
      title: 'Empty trash cans and change plastic bags (white for infectious waste)',
      description: 'Properly tie the full bag and send it to local disposal.'
    },
    es: {
      title: 'Vaciar papeleras y cambiar bolsas plásticas (blanca para residuos infecciosos)',
      description: 'Atar debidamente la bolsa llena y destinarla al desecho local.'
    }
  },
  'task-8': {
    pt: {
      title: 'Lavação completa dos vasos sanitários e mictórios com cloro em gel',
      description: 'Deixar agir por 10 minutos antes de esfregar e dar descarga.'
    },
    en: {
      title: 'Complete washing of toilets and urinals with chlorine gel',
      description: 'Let it act for 10 minutes before scrubbing and flushing.'
    },
    es: {
      title: 'Lavado completo de inodoros y urinarios con cloro en gel',
      description: 'Dejar actuar por 10 minutos antes de cepillar y tirar de la cadena.'
    }
  },
  'task-9': {
    pt: {
      title: 'Limpar poeira das mesas e superfícies corporativas desocupadas',
      description: 'Passar pano de microfibra com álcool isopropílico/70%. Não mexer em papéis pessoais.'
    },
    en: {
      title: 'Dust unoccupied desks and corporate surfaces',
      description: 'Wipe with a microfiber cloth and isopropyl/70% alcohol. Do not move personal papers.'
    },
    es: {
      title: 'Limpiar el polvo de escritorios y superficies corporativas desocupadas',
      description: 'Pasar paño de microfibra con alcohol isopropílico/70%. No tocar papeles personales.'
    }
  },
  'task-10': {
    pt: {
      title: 'Higienização rápida da copa e reabastecimento de copos plásticos',
      description: 'Limpar pia da copa, bancada do café e repor suporte de copos.'
    },
    en: {
      title: 'Quick sanitization of the pantry and replenishment of plastic cups',
      description: 'Clean the pantry sink, coffee counter, and refill the cup holder.'
    },
    es: {
      title: 'Higienización rápida de la cocina y reabastecimiento de vasos plásticos',
      description: 'Limpiar fregadero de la cocina, barra de café y reponer soporte de vasos.'
    }
  },
  'task-11': {
    pt: {
      title: 'Aspirar carpetes das salas de reunião e corredores centrais',
      description: 'Passar aspirador industrial silencioso nas salas 1, 2, 3 e 4.'
    },
    en: {
      title: 'Vacuum carpets in meeting rooms and central hallways',
      description: 'Use a quiet industrial vacuum cleaner in rooms 1, 2, 3, and 4.'
    },
    es: {
      title: 'Aspirar alfombras de salas de reuniones y pasillos centrales',
      description: 'Pasar aspiradora industrial silenciosa en las salas 1, 2, 3 y 4.'
    }
  },
  'task-12': {
    pt: {
      title: 'Limpeza e desinfecção de mesas e cadeiras com álcool 70%',
      description: 'Ação crítica durante e logo após os horários de pico (11:30 às 14:00 e 18:00 às 20:00).'
    },
    en: {
      title: 'Cleaning and disinfection of tables and chairs with 70% alcohol',
      description: 'Critical action during and right after peak hours (11:30 AM to 2:00 PM and 6:00 PM to 8:00 PM).'
    },
    es: {
      title: 'Limpieza y desinfección de mesas y sillas con alcohol al 70%',
      description: 'Acción crítica durante y justo después de las horas pico (11:30 a 14:00 y 18:00 a 20:00).'
    }
  },
  'task-13': {
    pt: {
      title: 'Recolhimento sistemático de lixo orgânico e reciclável (refeitório)',
      description: 'Evitar acúmulo nas lixeiras centrais para afastar pragas e odores.'
    },
    en: {
      title: 'Systematic collection of organic and recyclable waste (cafeteria)',
      description: 'Avoid accumulation in central trash cans to deter pests and odors.'
    },
    es: {
      title: 'Recogida sistemática de basura orgánica y reciclable (comedor)',
      description: 'Evitar acumulación en basureras centrales para alejar plagas y olores.'
    }
  },
  'task-eventual-1': {
    pt: {
      title: 'Lavação pressurizada da rampa externa de acesso de veículos',
      description: 'Utilizar lavadora de alta pressão para remover lodo e marcas de pneu.'
    },
    en: {
      title: 'Pressurized washing of the external vehicle access ramp',
      description: 'Use high-pressure washer to remove mud and tire marks.'
    },
    es: {
      title: 'Lavado a presión de la rampa externa de acceso de vehículos',
      description: 'Utilizar hidrolavadora para remover lodo y marcas de neumáticos.'
    }
  },
  'task-eventual-2': {
    pt: {
      title: 'Polimento específico do balcão de mármore do Lobby Principal',
      description: 'Aplicação de cera cristalizadora e politriz para reaver o brilho natural.'
    },
    en: {
      title: 'Specific polishing of the Main Lobby marble counter',
      description: 'Application of crystallizing wax and polisher to restore natural shine.'
    },
    es: {
      title: 'Pulido específico del mostrador de mármol del Lobby Principal',
      description: 'Aplicación de cera cristalizadora y pulidora para recuperar el brillo natural.'
    }
  },
  'task-eventual-3': {
    pt: {
      title: 'Limpeza interna pesada de geladeiras e freezers do refeitório',
      description: 'Desligar equipamentos, retirar itens esquecidos e passar sanitizante neutro.',
      bullets: [
        'Desligar os equipamentos da tomada com segurança',
        'Retirar todos os alimentos e descartar itens vencidos',
        'Higienizar as prateleiras e gavetas internas com sanitizante neutro',
        'Limpar as borrachas de vedação das portas e religar os aparelhos'
      ]
    },
    en: {
      title: 'Heavy-duty internal cleaning of cafeteria refrigerators and freezers',
      description: 'Turn off equipment, remove forgotten items, and wipe with neutral sanitizer.',
      bullets: [
        'Safely unplug equipment from power outlet',
        'Remove all food items and discard expired products',
        'Sanitize internal shelves and drawers with neutral cleaner',
        'Clean door rubber gaskets and plug appliances back in'
      ]
    },
    es: {
      title: 'Limpieza interna profunda de refrigeradores y congeladores del comedor',
      description: 'Apagar equipos, retirar artículos olvidados y pasar desinfectante neutro.',
      bullets: [
        'Desconectar los equipos de la toma de corriente con seguridad',
        'Retirar todos los alimentos y desechar productos vencidos',
        'Higienizar los estantes y cajones internos con desinfectante neutro',
        'Limpiar las gomas de sellado de las puertas y volver a conectar los aparatos'
      ]
    }
  },
  'task-eventual-4': {
    pt: {
      title: 'Higienização de luminárias e grelhas de ar condicionado em altura',
      description: 'Necessita escada metálica e uso de Equipamento de Proteção Individual (EPI).'
    },
    en: {
      title: 'Sanitization of high-altitude light fixtures and air conditioning vents',
      description: 'Requires a metal ladder and use of Personal Protective Equipment (PPE).'
    },
    es: {
      title: 'Higienización de luminarias y rejillas de aire acondicionado en altura',
      description: 'Requiere escalera metálica y uso de Equipo de Protección Individual (EPI).'
    }
  }
};

const PHRASE_MAP: Array<{ pt: string; en: string; es: string }> = [
  // Verbs & Actions
  { pt: 'Limpar e organizar', en: 'Clean and organize', es: 'Limpiar y organizar' },
  { pt: 'limpar e organizar', en: 'clean and organize', es: 'limpiar y organizar' },
  { pt: 'Limpar e higienizar', en: 'Clean and sanitize', es: 'Limpiar y desinfectar' },
  { pt: 'Limpar e desinfetar', en: 'Clean and disinfect', es: 'Limpiar y desinfectar' },
  { pt: 'Limpar', en: 'Clean', es: 'Limpiar' },
  { pt: 'limpar', en: 'clean', es: 'limpiar' },
  { pt: 'Higienizar', en: 'Sanitize', es: 'Higienizar' },
  { pt: 'higienizar', en: 'sanitize', es: 'higienizar' },
  { pt: 'Desinfetar', en: 'Disinfect', es: 'Desinfectar' },
  { pt: 'desinfetar', en: 'disinfect', es: 'desinfectar' },
  { pt: 'Aspirar', en: 'Vacuum', es: 'Aspirar' },
  { pt: 'aspirar', en: 'vacuum', es: 'aspirar' },
  { pt: 'Esvaziar', en: 'Empty', es: 'Vaciar' },
  { pt: 'esvaziar', en: 'empty', es: 'vaciar' },
  { pt: 'Repor', en: 'Replenish', es: 'Reponer' },
  { pt: 'repor', en: 'replenish', es: 'reponer' },
  { pt: 'Reabastecer', en: 'Refill', es: 'Reabastecer' },
  { pt: 'reabastecer', en: 'refill', es: 'reabastecer' },
  { pt: 'Passar pano', en: 'Mop with damp cloth', es: 'Trapear con paño húmedo' },
  { pt: 'passar pano', en: 'mop with damp cloth', es: 'trapear con paño húmedo' },
  { pt: 'Mopear', en: 'Mop', es: 'Trapear' },
  { pt: 'mopear', en: 'mop', es: 'trapear' },
  { pt: 'Lavar', en: 'Wash', es: 'Lavar' },
  { pt: 'lavar', en: 'wash', es: 'lavar' },
  { pt: 'Polir', en: 'Polish', es: 'Pulir' },
  { pt: 'polir', en: 'polish', es: 'pulir' },
  { pt: 'Organizar', en: 'Organize', es: 'Organizar' },
  { pt: 'organizar', en: 'organize', es: 'organizar' },
  { pt: 'Verificar', en: 'Check', es: 'Verificar' },
  { pt: 'verificar', en: 'check', es: 'verificar' },
  { pt: 'Checar', en: 'Check', es: 'Chequear' },
  { pt: 'checar', en: 'check', es: 'chequear' },
  { pt: 'Varrer', en: 'Sweep', es: 'Barrer' },
  { pt: 'varrer', en: 'sweep', es: 'barrer' },
  { pt: 'Secar', en: 'Dry', es: 'Secar' },
  { pt: 'secar', en: 'dry', es: 'secar' },
  { pt: 'Trocar', en: 'Replace', es: 'Cambiar' },
  { pt: 'trocar', en: 'replace', es: 'cambiar' },
  { pt: 'Substituir', en: 'Replace', es: 'Sustituir' },
  { pt: 'substituir', en: 'replace', es: 'sustituir' },
  { pt: 'Recolher', en: 'Collect', es: 'Recoger' },
  { pt: 'recolher', en: 'collect', es: 'recoger' },
  { pt: 'Retirar', en: 'Remove', es: 'Retirar' },
  { pt: 'retirar', en: 'remove', es: 'retirar' },
  { pt: 'Remover', en: 'Remove', es: 'Remover' },
  { pt: 'remover', en: 'remove', es: 'remover' },
  { pt: 'Descartar', en: 'Discard', es: 'Desechar' },
  { pt: 'descartar', en: 'discard', es: 'desechar' },
  { pt: 'Desligar', en: 'Unplug', es: 'Desconectar' },
  { pt: 'desligar', en: 'unplug', es: 'desconectar' },
  { pt: 'Inspecionar', en: 'Inspect', es: 'Inspeccionar' },
  { pt: 'inspecionar', en: 'inspect', es: 'inspeccionar' },
  { pt: 'Aplicar', en: 'Apply', es: 'Aplicar' },
  { pt: 'aplicar', en: 'apply', es: 'aplicar' },

  // Event Room & Area Phrases
  { pt: 'ÁREA 1 - Sala de Eventos', en: 'AREA 1 - Event Room', es: 'ÁREA 1 - Sala de Eventos' },
  { pt: 'Área 1 - Sala de Eventos', en: 'Area 1 - Event Room', es: 'Área 1 - Sala de Eventos' },
  { pt: 'ÁREA 1 Event Room', en: 'AREA 1 Event Room', es: 'ÁREA 1 Sala de Eventos' },
  { pt: 'Area 1 Event Room', en: 'Area 1 Event Room', es: 'Área 1 Sala de Eventos' },
  { pt: 'Sala de Eventos', en: 'Event Room', es: 'Sala de Eventos' },
  { pt: 'Salão de Eventos', en: 'Event Room', es: 'Salón de Eventos' },
  { pt: 'Event Room', en: 'Event Room', es: 'Sala de Eventos' },
  { pt: 'ÁREA 1', en: 'AREA 1', es: 'ÁREA 1' },
  { pt: 'Área 1', en: 'Area 1', es: 'Área 1' },

  // Area 2 & Trash Disposal Phrases
  { pt: 'ÁREA 2 - Descarte de Lixo', en: 'AREA 2 - Trash Disposal', es: 'ÁREA 2 - Eliminación de Basura' },
  { pt: 'Área 2 - Descarte de Lixo', en: 'Area 2 - Trash Disposal', es: 'Área 2 - Eliminación de Basura' },
  { pt: 'ÁREA 2 Descarte de Lixo', en: 'AREA 2 Trash Disposal', es: 'ÁREA 2 Eliminación de Basura' },
  { pt: 'Area 2 Trash Disposal', en: 'Area 2 Trash Disposal', es: 'Área 2 Eliminación de Basura' },
  { pt: 'ÁREA 2: Descarte de Lixo', en: 'AREA 2: Trash Disposal', es: 'ÁREA 2: Eliminación de Basura' },
  { pt: 'Área 2: Descarte de Lixo', en: 'Area 2: Trash Disposal', es: 'Área 2: Eliminación de Basura' },
  { pt: 'ÁREA 2: Remoção de Resíduos', en: 'AREA 2: Waste Removal', es: 'ÁREA 2: Eliminación de Residuos' },
  { pt: 'ÁREA 2: Eliminación de Residuos', en: 'AREA 2: Waste Removal', es: 'ÁREA 2: Eliminación de Residuos' },
  { pt: 'Descarte de Lixo', en: 'Trash Disposal', es: 'Eliminación de Basura' },
  { pt: 'descarte de lixo', en: 'trash disposal', es: 'eliminación de basura' },
  { pt: 'Remoção de Resíduos', en: 'Waste Removal', es: 'Eliminación de Residuos' },
  { pt: 'ÁREA 2', en: 'AREA 2', es: 'ÁREA 2' },
  { pt: 'Área 2', en: 'Area 2', es: 'Área 2' },

  // Area 3 & Trash Disposal Phrases
  { pt: 'ÁREA 3 - Descarte de Lixo', en: 'AREA 3 - Trash Disposal', es: 'ÁREA 3 - Eliminación de Basura' },
  { pt: 'Área 3 - Descarte de Lixo', en: 'Area 3 - Trash Disposal', es: 'Área 3 - Eliminación de Basura' },
  { pt: 'ÁREA 3 Descarte de Lixo', en: 'AREA 3 Trash Disposal', es: 'ÁREA 3 Eliminación de Basura' },
  { pt: 'Area 3 Trash Disposal', en: 'Area 3 Trash Disposal', es: 'Área 3 Eliminación de Basura' },
  { pt: 'ÁREA 3: Descarte de Lixo', en: 'AREA 3: Trash Disposal', es: 'ÁREA 3: Eliminación de Basura' },
  { pt: 'Área 3: Descarte de Lixo', en: 'Area 3: Trash Disposal', es: 'Área 3: Eliminación de Basura' },
  { pt: 'ÁREA 3: Remoção de Resíduos', en: 'AREA 3: Waste Removal', es: 'ÁREA 3: Eliminación de Residuos' },
  { pt: 'ÁREA 3: Eliminación de Residuos', en: 'AREA 3: Waste Removal', es: 'ÁREA 3: Eliminación de Residuos' },
  { pt: 'ÁREA 3', en: 'AREA 3', es: 'ÁREA 3' },
  { pt: 'Área 3', en: 'Area 3', es: 'Área 3' },

  // Area 4 & Casino Station & Escalators Phrases
  { pt: 'ÁREA 4 - Estação do Cassino', en: 'AREA 4 - Casino Station', es: 'ÁREA 4 - Estación del Casino' },
  { pt: 'Área 4 - Estação do Cassino', en: 'Area 4 - Casino Station', es: 'Área 4 - Estación del Casino' },
  { pt: 'ÁREA 4 Estação do Cassino', en: 'AREA 4 Casino Station', es: 'ÁREA 4 Estación del Casino' },
  { pt: 'Area 4 Casino Station', en: 'Area 4 Casino Station', es: 'Área 4 Estación del Casino' },
  { pt: 'ÁREA 4: Estação do Cassino', en: 'AREA 4: Casino Station', es: 'ÁREA 4: Estación del Casino' },
  { pt: 'Área 4: Estação do Cassino', en: 'Area 4: Casino Station', es: 'Área 4: Estación del Casino' },
  { pt: 'Estação do Cassino', en: 'Casino Station', es: 'Estación del Casino' },
  { pt: 'Posto do Cassino', en: 'Casino Station', es: 'Estación del Casino' },

  { pt: 'ÁREA 4 - Escadas Rolantes', en: 'AREA 4 - Escalators', es: 'ÁREA 4 - Escaleras Mecánicas' },
  { pt: 'Área 4 - Escadas Rolantes', en: 'Area 4 - Escalators', es: 'Área 4 - Escaleras Mecánicas' },
  { pt: 'ÁREA 4 Escadas Rolantes', en: 'AREA 4 Escalators', es: 'ÁREA 4 Escaleras Mecánicas' },
  { pt: 'Area 4 Escalators', en: 'Area 4 Escalators', es: 'Área 4 Escaleras Mecánicas' },
  { pt: 'ÁREA 4: Escadas Rolantes', en: 'AREA 4: Escalators', es: 'ÁREA 4: Escaleras Mecánicas' },
  { pt: 'Área 4: Escadas Rolantes', en: 'Area 4: Escalators', es: 'Área 4: Escaleras Mecánicas' },
  { pt: 'Escadas Rolantes', en: 'Escalators', es: 'Escaleras Mecánicas' },

  { pt: 'ÁREA 4', en: 'AREA 4', es: 'ÁREA 4' },
  { pt: 'Área 4', en: 'Area 4', es: 'Área 4' },

  // Area 5 Phrases & Routines
  { pt: 'ÁREA 5 - Área da Piscina', en: 'AREA 5 - Pool Area', es: 'ÁREA 5 - Área de la Piscina' },
  { pt: 'Área 5 - Área da Piscina', en: 'Area 5 - Pool Area', es: 'Área 5 - Área de la Piscina' },
  { pt: 'ÁREA 5 Área da Piscina', en: 'AREA 5 Pool Area', es: 'ÁREA 5 Área de la Piscina' },
  { pt: 'Area 5 Pool Area', en: 'Area 5 Pool Area', es: 'Área 5 - Área de la Piscina' },
  { pt: 'ÁREA 5: Área da Piscina', en: 'AREA 5: Pool Area', es: 'ÁREA 5: Área de la Piscina' },
  { pt: 'Área 5: Área da Piscina', en: 'Area 5: Pool Area', es: 'Área 5: Área de la Piscina' },
  { pt: 'Área da Piscina', en: 'Pool Area', es: 'Área de la Piscina' },

  { pt: 'ÁREA 5 - EDR: Sala de Descanso', en: 'AREA 5 - EDR: Break Room', es: 'ÁREA 5 - EDR: Sala de Descanso' },
  { pt: 'Área 5 - EDR: Sala de Descanso', en: 'Area 5 - EDR: Break Room', es: 'Área 5 - EDR: Sala de Descanso' },
  { pt: 'ÁREA 5 EDR: Break Room', en: 'AREA 5 EDR: Break Room', es: 'ÁREA 5 EDR: Sala de Descanso' },
  { pt: 'Area 5 EDR: Break Room', en: 'Area 5 EDR: Break Room', es: 'Área 5 EDR: Sala de Descanso' },
  { pt: 'ÁREA 5: EDR: Sala de Descanso', en: 'AREA 5: EDR: Break Room', es: 'ÁREA 5: EDR: Sala de Descanso' },
  { pt: 'Área 5: EDR: Sala de Descanso', en: 'Area 5: EDR: Break Room', es: 'Área 5: EDR: Sala de Descanso' },
  { pt: 'EDR: Sala de Descanso', en: 'EDR: Break Room', es: 'EDR: Sala de Descanso' },
  { pt: 'EDR: Break Room', en: 'EDR: Break Room', es: 'EDR: Sala de Descanso' },

  { pt: 'ÁREA 5 - Descarte de Lixo', en: 'AREA 5 - Trash Disposal', es: 'ÁREA 5 - Eliminación de Basura' },
  { pt: 'Área 5 - Descarte de Lixo', en: 'Area 5 - Trash Disposal', es: 'Área 5 - Eliminación de Basura' },
  { pt: 'ÁREA 5 Descarte de Lixo', en: 'AREA 5 Trash Disposal', es: 'ÁREA 5 Eliminación de Basura' },
  { pt: 'Area 5 Trash Disposal', en: 'Area 5 Trash Disposal', es: 'Área 5 Eliminación de Basura' },
  { pt: 'ÁREA 5: Descarte de Lixo', en: 'AREA 5: Trash Disposal', es: 'ÁREA 5: Eliminación de Basura' },
  { pt: 'Área 5: Descarte de Lixo', en: 'Area 5: Trash Disposal', es: 'Área 5: Eliminación de Basura' },

  { pt: 'ÁREA 5 - Lixo da Sala de Descanso', en: 'AREA 5 - Break Room trash', es: 'ÁREA 5 - Basura de la Sala de Descanso' },
  { pt: 'Área 5 - Lixo da Sala de Descanso', en: 'Area 5 - Break Room trash', es: 'Área 5 - Basura de la Sala de Descanso' },
  { pt: 'ÁREA 5 Break Room trash', en: 'AREA 5 Break Room trash', es: 'ÁREA 5 Basura de la Sala de Descanso' },
  { pt: 'Area 5 Break Room trash', en: 'Area 5 Break Room trash', es: 'Área 5 Basura de la Sala de Descanso' },
  { pt: 'ÁREA 5: Lixo da Sala de Descanso', en: 'AREA 5: Break Room trash', es: 'ÁREA 5: Basura de la Sala de Descanso' },
  { pt: 'Área 5: Lixo da Sala de Descanso', en: 'Area 5: Break Room trash', es: 'Área 5: Basura de la Sala de Descanso' },
  { pt: 'Lixo da Sala de Descanso', en: 'Break Room trash', es: 'Basura de la Sala de Descanso' },
  { pt: 'Break Room trash', en: 'Break Room trash', es: 'Basura de la Sala de Descanso' },

  { pt: 'ÁREA 5', en: 'AREA 5', es: 'ÁREA 5' },
  { pt: 'Área 5', en: 'Area 5', es: 'Área 5' },

  // Occasional / On-Demand Tasks & Phrases
  { pt: 'Lavação pressurizada da rampa externa de acesso de veículos', en: 'Pressurized washing of the external vehicle access ramp', es: 'Lavado a presión de la rampa externa de acceso de vehículos' },
  { pt: 'Lavação pressurizada da rampa externa de acesso de veículos.', en: 'Pressurized washing of the external vehicle access ramp.', es: 'Lavado a presión de la rampa externa de acceso de vehículos.' },
  { pt: 'Lavação pressurizada da rampa externa', en: 'Pressurized washing of the external ramp', es: 'Lavado a presión de la rampa externa' },
  { pt: 'Utilizar lavadora de alta pressão para remover lodo e marcas de pneu.', en: 'Use high-pressure washer to remove mud and tire marks.', es: 'Utilizar hidrolavadora para remover lodo y marcas de neumáticos.' },
  { pt: 'Utilizar lavadora de alta pressão para remover lodo e marcas de pneu', en: 'Use high-pressure washer to remove mud and tire marks', es: 'Utilizar hidrolavadora para remover lodo y marcas de neumáticos' },

  { pt: 'Polimento específico do balcão de mármore do Lobby Principal', en: 'Specific polishing of the Main Lobby marble counter', es: 'Pulido específico del mostrador de mármol del Lobby Principal' },
  { pt: 'Polimento específico do balcão de mármore do Lobby Principal.', en: 'Specific polishing of the Main Lobby marble counter.', es: 'Pulido específico del mostrador de mármol del Lobby Principal.' },
  { pt: 'Polimento específico do balcão de mármore', en: 'Specific polishing of the marble counter', es: 'Pulido específico del mostrador de mármol' },
  { pt: 'Aplicação de cera cristalizadora e politriz para reaver o brilho natural.', en: 'Application of crystallizing wax and polisher to restore natural shine.', es: 'Aplicación de cera cristalizadora y pulidora para recuperar el brillo natural.' },
  { pt: 'Aplicação de cera cristalizadora e politriz para reaver o brilho natural', en: 'Application of crystallizing wax and polisher to restore natural shine', es: 'Aplicación de cera cristalizadora y pulidora para recuperar el brillo natural' },

  { pt: 'Limpeza interna pesada de geladeiras e freezers do refeitório', en: 'Heavy-duty internal cleaning of cafeteria refrigerators and freezers', es: 'Limpieza interna profunda de refrigeradores y congeladores del comedor' },
  { pt: 'Limpeza interna pesada de geladeiras e freezers do refeitório.', en: 'Heavy-duty internal cleaning of cafeteria refrigerators and freezers.', es: 'Limpieza interna profunda de refrigeradores y congeladores del comedor.' },
  { pt: 'Limpeza interna pesada de geladeiras e freezers', en: 'Heavy-duty internal cleaning of refrigerators and freezers', es: 'Limpieza interna profunda de refrigeradores y congeladores' },
  { pt: 'Desligar equipamentos, retirar itens esquecidos e passar sanitizante neutro.', en: 'Turn off equipment, remove forgotten items, and wipe with neutral sanitizer.', es: 'Apagar equipos, retirar artículos olvidados y pasar desinfectante neutro.' },
  { pt: 'Desligar equipamentos, retirar itens esquecidos e passar sanitizante neutro', en: 'Turn off equipment, remove forgotten items, and wipe with neutral sanitizer', es: 'Apagar equipos, retirar artículos olvidados y pasar desinfectante neutro' },

  { pt: 'Higienização de luminárias e grelhas de ar condicionado em altura', en: 'Sanitization of high-altitude light fixtures and air conditioning vents', es: 'Higienización de luminarias y rejillas de aire acondicionado en altura' },
  { pt: 'Higienização de luminárias e grelhas de ar condicionado em altura.', en: 'Sanitization of high-altitude light fixtures and air conditioning vents.', es: 'Higienización de luminarias y rejillas de aire acondicionado en altura.' },
  { pt: 'Higienização de luminárias e grelhas de ar condicionado', en: 'Sanitization of light fixtures and air conditioning vents', es: 'Higienización de luminarias y rejillas de aire acondicionado' },
  { pt: 'Necessita escada metálica e uso de Equipamento de Proteção Individual (EPI).', en: 'Requires a metal ladder and use of Personal Protective Equipment (PPE).', es: 'Requiere escalera metálica y uso de Equipo de Protección Individual (EPI).' },
  { pt: 'Necessita escada metálica e uso de Equipamento de Proteção Individual (EPI)', en: 'Requires a metal ladder and use of Personal Protective Equipment (PPE)', es: 'Requiere escalera metálica y uso de Equipo de Protección Individual (EPI)' },

  { pt: 'Tarefas Eventuais / Sob Demanda', en: 'Occasional / On-Demand Tasks', es: 'Tareas Eventuales / Bajo Demanda' },
  { pt: 'Tarefas Eventuais', en: 'Occasional Tasks', es: 'Tareas Eventuales' },
  { pt: 'Tarefa Eventual Customizada', en: 'Custom Occasional Task', es: 'Tarea Eventual Personalizada' },
  { pt: 'Banco de Tarefas Eventuais', en: 'Occasional Task Bank', es: 'Banco de Tareas Eventuales' },
  { pt: 'Tarefa eventual agendada', en: 'Scheduled occasional task', es: 'Tarea eventual programada' },
  { pt: 'Organizar guarita de chaves desativadas a pedido da chefia', en: 'Organize deactivated keys booth upon management request', es: 'Organizar caseta de llaves desactivadas a pedido de la dirección' },
  { pt: 'Organizar guarita de chaves desativadas', en: 'Organize deactivated keys booth', es: 'Organizar caseta de llaves desactivadas' },
  { pt: 'Organizar o quadro de chaves antigas que estava bagunçado.', en: 'Organize the old key board that was messy.', es: 'Organizar el tablero de llaves antiguas que estaba desordenado.' },
  { pt: 'Organizar o quadro de chaves antigas que estava bagunçado', en: 'Organize the old key board that was messy', es: 'Organizar el tablero de llaves antiguas que estaba desordenado' },
  { pt: 'Organizar quadro de chaves antigas', en: 'Organize old key board', es: 'Organizar tablero de llaves antiguas' },
  { pt: 'Organizar o quadro de chaves antigas', en: 'Organize the old key board', es: 'Organizar el tablero de llaves antiguas' },
  { pt: 'guarita de chaves desativadas', en: 'deactivated keys booth', es: 'caseta de llaves desactivadas' },
  { pt: 'quadro de chaves antigas', en: 'old key board', es: 'tablero de llaves antiguas' },
  { pt: 'quadro de chaves', en: 'key board', es: 'tablero de llaves' },
  { pt: 'caixa de chaves', en: 'key box', es: 'caja de llaves' },
  { pt: 'chaves desativadas', en: 'deactivated keys', es: 'llaves desactivadas' },
  { pt: 'chaves antigas', en: 'old keys', es: 'llaves antiguas' },
  { pt: 'chaves', en: 'keys', es: 'llaves' },
  { pt: 'guarita', en: 'booth', es: 'caseta' },
  { pt: 'a pedido da chefia', en: 'upon management request', es: 'a pedido de la dirección' },
  { pt: 'chefia', en: 'management', es: 'dirección' },
  { pt: 'que estava bagunçado', en: 'that was messy', es: 'que estaba desordenado' },
  { pt: 'bagunçado', en: 'messy', es: 'desordenado' },
  { pt: 'caixa d\'água', en: 'water tank', es: 'tanque de agua' },
  { pt: 'limpeza de caixa d\'água', en: 'cleaning of water tank', es: 'limpieza de tanque de agua' },
  { pt: 'limpar caixa d\'água', en: 'clean water tank', es: 'limpiar tanque de agua' },
  { pt: 'extintores de incêndio', en: 'fire extinguishers', es: 'extintores de incendios' },
  { pt: 'inspeccionar extintores', en: 'inspect fire extinguishers', es: 'inspeccionar extintores' },
  { pt: 'filtros de ar condicionado', en: 'air conditioning filters', es: 'filtros de aire acondicionado' },
  { pt: 'limpar filtros', en: 'clean filters', es: 'limpiar filtros' },

  // Frequencies in Phrase Map
  { pt: 'Dia sim, dia não', en: 'Every other day', es: 'Un día sí, un día no' },
  { pt: 'Mínimo 2 vezes por turno', en: 'Minimum 2 times per shift', es: 'Mínimo 2 veces por turno' },
  { pt: 'Mínimo 3 vezes por turno', en: 'Minimum 3 times per shift', es: 'Mínimo 3 veces por turno' },
  { pt: 'Quarta a Domingo', en: 'Wednesday through Sunday', es: 'Miércoles a Domingo' },

  // Complete Bullet Sub-task Phrases
  { pt: 'Coletar e descartar o lixo', en: 'Collect and dispose of trash', es: 'Recolectar y desechar la basura' },
  { pt: 'Coletar e descartar o lixo.', en: 'Collect and dispose of trash.', es: 'Recolectar y desechar la basura.' },
  { pt: 'Coletar o lixo de todas as lixeiras do setor', en: 'Collect trash from all trash cans in the area', es: 'Recolectar la basura de todas las papeleras del sector' },
  { pt: 'Coletar o lixo de todas as lixeiras do setor.', en: 'Collect trash from all trash cans in the area.', es: 'Recolectar la basura de todas las papeleras del sector.' },
  { pt: 'Descartar resíduos nos contêineres apropriados', en: 'Dispose of waste in appropriate containers', es: 'Desechar residuos en los contenedores apropriados' },
  { pt: 'Descartar resíduos nos contêineres apropriados.', en: 'Dispose of waste in appropriate containers.', es: 'Desechar residuos en los contenedores apropriados.' },
  { pt: 'Higienizar e desinfetar as lixeiras', en: 'Sanitize and disinfect trash cans', es: 'Higienizar y desinfectar las papeleras' },
  { pt: 'Higienizar e desinfetar as lixeiras.', en: 'Sanitize and disinfect trash cans.', es: 'Higienizar y desinfectar las papeleras.' },
  { pt: 'Substituir por novos sacos de lixo', en: 'Replace with new trash bags', es: 'Reemplazar por nuevas bolsas de basura' },
  { pt: 'Substituir por novos sacos de lixo.', en: 'Replace with new trash bags.', es: 'Reemplazar por nuevas bolsas de basura.' },
  { pt: 'Transportar os sacos de lixo para a doca de resíduos', en: 'Transport trash bags to the waste dock', es: 'Transportar las bolsas de basura al muelle de residuos' },
  { pt: 'Transportar os sacos de lixo para a doca de resíduos.', en: 'Transport trash bags to the waste dock.', es: 'Transportar las bolsas de basura al muelle de residuos' },
  { pt: 'Limpar e organizar mesas e cadeiras', en: 'Clean and organize tables and chairs', es: 'Limpiar y organizar mesas y sillas' },
  { pt: 'Limpar e organizar mesas e cadeiras.', en: 'Clean and organize tables and chairs.', es: 'Limpiar y organizar mesas y sillas.' },
  { pt: 'Limpar mesas e cadeiras', en: 'Clean tables and chairs', es: 'Limpiar mesas y sillas' },
  { pt: 'Limpar mesas e cadeiras.', en: 'Clean tables and chairs.', es: 'Limpiar mesas y sillas.' },
  { pt: 'Aspirar o carpete e passar pano no piso', en: 'Vacuum carpet and mop floor', es: 'Aspirar la alfombra y trapear el suelo' },
  { pt: 'Aspirar carpete e mopear o piso', en: 'Vacuum carpet and mop floor', es: 'Aspirar alfombra y trapear el suelo' },
  { pt: 'Aspirar o carpete e passar pano no piso.', en: 'Vacuum carpet and mop floor.', es: 'Aspirar la alfombra y trapear el suelo.' },
  { pt: 'Aspirar carpete', en: 'Vacuum carpet', es: 'Aspirar alfombra' },
  { pt: 'Aspirar o carpete', en: 'Vacuum the carpet', es: 'Aspirar la alfombra' },
  { pt: 'Passar pano no piso', en: 'Mop floor', es: 'Trapear el suelo' },
  { pt: 'Mopear o piso', en: 'Mop floor', es: 'Trapear el piso' },
  { pt: 'Esvaziar lixeiras e trocar sacos de lixo', en: 'Empty trash cans and change trash bags', es: 'Vaciar papeleras y cambiar bolsas de basura' },
  { pt: 'Esvaziar lixeiras e trocar sacos de lixo.', en: 'Empty trash cans and change trash bags.', es: 'Vaciar papeleras y cambiar bolsas de basura.' },
  { pt: 'Esvaziar lixeiras e substituir sacos de lixo', en: 'Empty trash cans and replace trash bags', es: 'Vaciar papeleras y reemplazar bolsas de basura' },
  { pt: 'Esvaziar lixeiras', en: 'Empty trash cans', es: 'Vaciar papeleras' },
  { pt: 'Esvaziar lixeiras.', en: 'Empty trash cans.', es: 'Vaciar papeleras.' },
  { pt: 'Trocar sacos de lixo', en: 'Change trash bags', es: 'Cambiar bolsas de basura' },
  { pt: 'Substituir sacos de lixo', en: 'Replace trash bags', es: 'Reemplazar bolsas de basura' },
  { pt: 'Organizar layout do mobiliário e cadeiras', en: 'Arrange furniture and chair layout', es: 'Organizar la disposición del mobiliario y sillas' },
  { pt: 'Organizar layout do mobiliário e cadeiras.', en: 'Arrange furniture and chair layout.', es: 'Organizar la disposición del mobiliario y sillas.' },
  { pt: 'Organizar layout do mobiliário', en: 'Set up furniture layout', es: 'Organizar la disposición del mobiliario' },
  { pt: 'Organizar mobiliário', en: 'Arrange furniture', es: 'Organizar mobiliario' },
  { pt: 'Higienizar maçanetas, interruptores e superfícies', en: 'Sanitize doorknobs, switches, and surfaces', es: 'Desinfectar manijas, interruptores y superficies' },
  { pt: 'Higienizar maçanetas, interruptores e superfícies.', en: 'Sanitize doorknobs, switches, and surfaces.', es: 'Desinfectar manijas, interruptores y superficies.' },
  { pt: 'Higienizar maçanetas e interruptores', en: 'Sanitize doorknobs and light switches', es: 'Desinfectar manijas e interruptores' },
  { pt: 'Limpar quadro branco e tela de projeção', en: 'Clean whiteboard and projection screen', es: 'Limpiar pizarra y pantalla de proyección' },
  { pt: 'Limpar quadro branco e tela de projeção.', en: 'Clean whiteboard and projection screen.', es: 'Limpiar pizarra y pantalla de proyección.' },
  { pt: 'Higienizar pódio, palco e microfones', en: 'Sanitize podium, stage, and microphones', es: 'Desinfectar podio, escenario y micrófonos' },
  { pt: 'Higienizar pódio, palco e microfones.', en: 'Sanitize podium, stage, and microphones.', es: 'Desinfectar podio, escenario y micrófonos.' },
  { pt: 'Inspecionar ar condicionado e iluminação', en: 'Inspect air conditioning and lighting', es: 'Inspeccionar aire acondicionado e iluminación' },
  { pt: 'Inspecionar ar condicionado e iluminação.', en: 'Inspect air conditioning and lighting.', es: 'Inspeccionar aire acondicionado e iluminación.' },
  { pt: 'Reabastecer jarras de água, copos e guardanapos', en: 'Replenish water pitchers, cups, and napkins', es: 'Reabastecer jarras de agua, vasos y servilletas' },
  { pt: 'Reabastecer jarras de água, copos e guardanapos.', en: 'Replenish water pitchers, cups, and napkins.', es: 'Reabastecer jarras de agua, vasos y servilletas.' },
  { pt: 'Reabastecer jarras de água e copos', en: 'Replenish water pitchers and cups', es: 'Reabastecer jarras de agua y vasos' },
  { pt: 'Desligar os equipamentos da tomada com segurança', en: 'Safely unplug equipment from power outlet', es: 'Desconectar los equipos de la toma de corriente con seguridad' },
  { pt: 'Retirar todos os alimentos e descartar itens vencidos', en: 'Remove all food items and discard expired products', es: 'Retirar todos los alimentos y desechar productos vencidos' },
  { pt: 'Higienizar as prateleiras e gavetas internas com sanitizante neutro', en: 'Sanitize internal shelves and drawers with neutral cleaner', es: 'Higienizar los estantes y cajones internos con desinfectante neutro' },
  { pt: 'Limpar as borrachas de vedação das portas e religar os aparelhos', en: 'Clean door rubber gaskets and plug appliances back in', es: 'Limpiar las gomas de sellado de las puertas y volver a conectar los aparatos' },

  // Nouns & Key Terms
  { pt: 'vidros e espelhos', en: 'glass and mirrors', es: 'vidrios y espejos' },
  { pt: 'vidros e portas giratórias', en: 'glass and revolving doors', es: 'vidrios y puertas giratorias' },
  { pt: 'vidros', en: 'glass windows', es: 'vidrios' },
  { pt: 'espelhos', en: 'mirrors', es: 'espejos' },
  { pt: 'portas giratórias', en: 'revolving doors', es: 'puertas giratorias' },
  { pt: 'portas', en: 'doors', es: 'puertas' },
  { pt: 'janelas', en: 'windows', es: 'ventanas' },
  { pt: 'piso de granito', en: 'granite floor', es: 'piso de granito' },
  { pt: 'piso molhado', en: 'wet floor', es: 'piso mojado' },
  { pt: 'piso', en: 'floor', es: 'piso' },
  { pt: 'chão', en: 'floor', es: 'suelo' },
  { pt: 'tapetes e capachos', en: 'mats and rugs', es: 'alfombras y tapetes' },
  { pt: 'tapetes', en: 'rugs', es: 'alfombras' },
  { pt: 'capachos', en: 'mats', es: 'tapetes' },
  { pt: 'lixeiras e resíduos', en: 'trash cans and waste', es: 'papeleras y residuos' },
  { pt: 'lixeiras', en: 'trash cans', es: 'papeleras' },
  { pt: 'lixo', en: 'waste/trash', es: 'basura/residuos' },
  { pt: 'resíduos', en: 'waste', es: 'residuos' },
  { pt: 'sacos de lixo', en: 'trash bags', es: 'bolsas de basura' },
  { pt: 'sacolas plásticas', en: 'plastic bags', es: 'bolsas de plástico' },
  { pt: 'banheiros e sanitários', en: 'restrooms and toilets', es: 'baños y sanitarios' },
  { pt: 'banheiros', en: 'restrooms', es: 'baños' },
  { pt: 'sanitários', en: 'restrooms', es: 'sanitarios' },
  { pt: 'PNE', en: 'Accessible (PNE)', es: 'PNE / Accesible' },
  { pt: 'boxes', en: 'stalls', es: 'cubículos' },
  { pt: 'pias e torneiras', en: 'sinks and faucets', es: 'lavabos y grifos' },
  { pt: 'pias', en: 'sinks', es: 'lavabos' },
  { pt: 'torneiras', en: 'faucets', es: 'grifos' },
  { pt: 'sabonete líquido', en: 'liquid soap', es: 'jabón líquido' },
  { pt: 'sabonete', en: 'soap', es: 'jabón' },
  { pt: 'sabão', en: 'soap', es: 'jabón' },
  { pt: 'papel toalha', en: 'paper towels', es: 'toallas de papel' },
  { pt: 'papel higiênico', en: 'toilet paper', es: 'papel higiénico' },
  { pt: 'álcool em gel', en: 'hand sanitizer', es: 'alcohol en gel' },
  { pt: 'álcool gel', en: 'hand sanitizer', es: 'alcohol en gel' },
  { pt: 'desinfetante neutro', en: 'neutral disinfectant', es: 'desinfectante neutro' },
  { pt: 'desinfetante', en: 'disinfectant', es: 'desinfectante' },
  { pt: 'detergente neutro', en: 'neutral detergent', es: 'detergente neutro' },
  { pt: 'pano de microfibra', en: 'microfiber cloth', es: 'paño de microfibra' },
  { pt: 'esfregão', en: 'mop', es: 'trapeador' },
  { pt: 'mesas e cadeiras', en: 'tables and chairs', es: 'mesas y sillas' },
  { pt: 'mesas', en: 'tables', es: 'mesas' },
  { pt: 'cadeiras', en: 'chairs', es: 'sillas' },
  { pt: 'sofás', en: 'sofas', es: 'sofás' },
  { pt: 'bancadas', en: 'countertops', es: 'encimeras' },
  { pt: 'maçanetas e corrimãos', en: 'doorknobs and handrails', es: 'manijas y pasamanos' },
  { pt: 'maçanetas', en: 'doorknobs', es: 'manijas' },
  { pt: 'corrimãos', en: 'handrails', es: 'pasamanos' },
  { pt: 'elevadores', en: 'elevators', es: 'ascensores' },
  { pt: 'botões', en: 'buttons', es: 'botones' },
  { pt: 'recepção', en: 'reception', es: 'recepción' },
  { pt: 'lobby', en: 'lobby', es: 'lobby' },
  { pt: 'portaria', en: 'entrance/gate', es: 'portería/entrada' },
  { pt: 'corredores', en: 'hallways', es: 'pasillos' },
  { pt: 'refeitório', en: 'cafeteria', es: 'comedor' },
  { pt: 'copa', en: 'pantry/kitchenette', es: 'cocineta' },
  { pt: 'cozinha', en: 'kitchen', es: 'cocina' },
  { pt: 'escadas', en: 'stairs', es: 'escaleras' },
  { pt: 'área externa', en: 'outdoor area', es: 'área exterior' },
  { pt: 'sub-tarefa', en: 'sub-task', es: 'subtarea' },
  { pt: 'sub-tarefas', en: 'sub-tasks', es: 'subtareas' },
  { pt: 'Sub-tarefa', en: 'Sub-task', es: 'Subtarea' },
  { pt: 'Sub-tarefas', en: 'Sub-tasks', es: 'Subtareas' },
  { pt: 'Public Areas Supervisor', en: 'Public Areas Supervisor', es: 'Supervisor de Áreas Públicas' },
  { pt: 'Supervisor de Áreas Públicas', en: 'Public Areas Supervisor', es: 'Supervisor de Áreas Públicas' },

  // Key Terms
  { pt: 'carpete', en: 'carpet', es: 'alfombra' },
  { pt: 'quadro branco', en: 'whiteboard', es: 'pizarra' },
  { pt: 'tela de projeção', en: 'projection screen', es: 'pantalla de proyección' },
  { pt: 'pódio', en: 'podium', es: 'podio' },
  { pt: 'palco', en: 'stage', es: 'escenario' },
  { pt: 'microfones', en: 'microphones', es: 'micrófonos' },
  { pt: 'ar condicionado', en: 'air conditioning', es: 'aire acondicionado' },
  { pt: 'iluminação', en: 'lighting', es: 'iluminación' },
  { pt: 'jarras de água', en: 'water pitchers', es: 'jarras de agua' },
  { pt: 'copos', en: 'cups', es: 'vasos' },
  { pt: 'guardanapos', en: 'napkins', es: 'servilletas' },
  { pt: 'interruptores', en: 'switches', es: 'interruptores' },
  { pt: 'maçanetas', en: 'doorknobs', es: 'manijas' },
  { pt: 'superfícies', en: 'surfaces', es: 'superficies' },

  // Connectors & Grammar
  { pt: ' e ', en: ' and ', es: ' y ' },
  { pt: ' ou ', en: ' or ', es: ' o ' },
  { pt: ' com ', en: ' with ', es: ' con ' },
  { pt: ' sem ', en: ' without ', es: ' sin ' },
  { pt: ' para ', en: ' for ', es: ' para ' },
  { pt: ' de ', en: ' of ', es: ' de ' },
  { pt: ' em ', en: ' in ', es: ' en ' },
  { pt: ' no ', en: ' in the ', es: ' en el ' },
  { pt: ' na ', en: ' in the ', es: ' en la ' },
  { pt: ' do ', en: ' of the ', es: ' del ' },
  { pt: ' da ', en: ' of the ', es: ' de la ' },
  { pt: ' dos ', en: ' of the ', es: ' de los ' },
  { pt: ' das ', en: ' of the ', es: ' de las ' },
  { pt: ' todos ', en: ' all ', es: ' todos ' },
  { pt: ' todas ', en: ' all ', es: ' todas ' },
  { pt: ' cada ', en: ' each ', es: ' cada ' }
];

export const translateOperationalString = (text: string, lang: string): string => {
  if (!text) return '';
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? (lang as 'pt' | 'en' | 'es') : 'pt';
  const clean = text.trim();
  if (!clean) return '';

  // 0. Handle hyphenated parent-child titles using lastIndexOf to preserve multi-hyphen parent names (e.g. "Área 1 - Sala de Eventos")
  if (clean.includes(' - ')) {
    const lastDashIdx = clean.lastIndexOf(' - ');
    const parent = translateOperationalString(clean.substring(0, lastDashIdx), activeLang);
    const child = translateOperationalString(clean.substring(lastDashIdx + 3), activeLang);
    return `${parent} - ${child}`;
  }

  // 1. Direct match in TASK_TRANSLATIONS for titles or bullets
  for (const key of Object.keys(TASK_TRANSLATIONS)) {
    const entry = TASK_TRANSLATIONS[key];
    if (
      entry.pt.title.trim().toLowerCase() === clean.toLowerCase() ||
      entry.en.title.trim().toLowerCase() === clean.toLowerCase() ||
      entry.es.title.trim().toLowerCase() === clean.toLowerCase()
    ) {
      return entry[activeLang].title;
    }
    for (const l of ['pt', 'en', 'es'] as const) {
      const bulletList = entry[l]?.bullets;
      if (bulletList) {
        const idx = bulletList.findIndex(b => b.trim().toLowerCase() === clean.toLowerCase());
        if (idx !== -1 && entry[activeLang]?.bullets?.[idx]) {
          return entry[activeLang].bullets[idx];
        }
      }
    }
  }

  // 2. Direct match in PHRASE_MAP (ignoring trailing punctuation)
  const cleanNoPunct = clean.replace(/[.,!?;:]+$/, '').trim();
  const trailingPunct = clean.substring(cleanNoPunct.length);

  for (const item of PHRASE_MAP) {
    if (
      item.pt.trim().toLowerCase() === clean.toLowerCase() ||
      item.en.trim().toLowerCase() === clean.toLowerCase() ||
      item.es.trim().toLowerCase() === clean.toLowerCase()
    ) {
      return item[activeLang];
    }
    if (cleanNoPunct && (
      item.pt.trim().toLowerCase() === cleanNoPunct.toLowerCase() ||
      item.en.trim().toLowerCase() === cleanNoPunct.toLowerCase() ||
      item.es.trim().toLowerCase() === cleanNoPunct.toLowerCase()
    )) {
      return item[activeLang] + trailingPunct;
    }
  }

  // 3. Substring / pattern replacement across all languages
  let result = text;
  const sortedPhrases = [...PHRASE_MAP].sort((a, b) => {
    const maxA = Math.max(a.pt.length, a.en.length, a.es.length);
    const maxB = Math.max(b.pt.length, b.en.length, b.es.length);
    return maxB - maxA;
  });

  for (const item of sortedPhrases) {
    for (const sourceLang of ['pt', 'en', 'es'] as const) {
      if (sourceLang === activeLang) continue;
      const sourcePhrase = item[sourceLang];
      if (!sourcePhrase || sourcePhrase.length < 2) continue;

      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapeRegExp(sourcePhrase)}\\b`, 'gi');
      if (pattern.test(result)) {
        result = result.replace(pattern, item[activeLang]);
      }
    }
  }

  return getLocalizedEnvironmentName(result, activeLang);
};

export const getLocalizedTask = <T extends { 
  id: string; 
  title: string; 
  description?: string;
  bullets?: string[];
  translations?: {
    pt?: { title: string; description?: string; bullets?: string[] };
    en?: { title: string; description?: string; bullets?: string[] };
    es?: { title: string; description?: string; bullets?: string[] };
  };
}>(
  task: T,
  lang: string
): T => {
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? lang : 'pt';
  const hasNoDescription = !task.description || task.description.trim() === '';

  // 1. Look up static dictionary by task ID first
  let staticTranslations = TASK_TRANSLATIONS[task.id];

  // If bullet task ID like "task-eventual-3-bullet-0"
  if (!staticTranslations && task.id && task.id.includes('-bullet-')) {
    const parts = task.id.split('-bullet-');
    const parentId = parts[0];
    const bulletIdx = parseInt(parts[1], 10);
    const parentStaticTrans = TASK_TRANSLATIONS[parentId];
    if (parentStaticTrans) {
      const lastDashIdx = task.title.lastIndexOf(' - ');
      const bulletText = lastDashIdx !== -1 ? task.title.substring(lastDashIdx + 3) : task.title;
      const ptBullet = parentStaticTrans.pt.bullets?.[bulletIdx] || translateOperationalString(bulletText, 'pt');
      const enBullet = parentStaticTrans.en.bullets?.[bulletIdx] || translateOperationalString(bulletText, 'en');
      const esBullet = parentStaticTrans.es.bullets?.[bulletIdx] || translateOperationalString(bulletText, 'es');
      staticTranslations = {
        pt: {
          title: `${parentStaticTrans.pt.title} - ${ptBullet}`,
          description: parentStaticTrans.pt.description
        },
        en: {
          title: `${parentStaticTrans.en.title} - ${enBullet}`,
          description: parentStaticTrans.en.description
        },
        es: {
          title: `${parentStaticTrans.es.title} - ${esBullet}`,
          description: parentStaticTrans.es.description
        }
      };
    }
  }

  // If not found by ID, search by title in static dictionary (ignoring trailing punctuation & case)
  if (!staticTranslations) {
    const cleanTitle = task.title.trim().toLowerCase();
    const cleanTitleNoPunct = cleanTitle.replace(/[.,!?;:]+$/, '').trim();
    const foundKey = Object.keys(TASK_TRANSLATIONS).find(key => {
      const entry = TASK_TRANSLATIONS[key];
      const ptT = entry.pt.title.trim().toLowerCase().replace(/[.,!?;:]+$/, '').trim();
      const enT = entry.en.title.trim().toLowerCase().replace(/[.,!?;:]+$/, '').trim();
      const esT = entry.es.title.trim().toLowerCase().replace(/[.,!?;:]+$/, '').trim();
      return (
        ptT === cleanTitle || ptT === cleanTitleNoPunct ||
        enT === cleanTitle || enT === cleanTitleNoPunct ||
        esT === cleanTitle || esT === cleanTitleNoPunct
      );
    });
    if (foundKey) {
      staticTranslations = TASK_TRANSLATIONS[foundKey];
    }
  }

  // If static dictionary match exists, prefer it UNLESS the task has explicit, non-fallback custom user edits
  if (staticTranslations && staticTranslations[activeLang]) {
    const hasCustomUserEdit = !!task.translations &&
      !!task.translations[activeLang]?.title &&
      task.translations[activeLang]?.title.trim() !== staticTranslations.pt.title.trim() &&
      task.translations[activeLang]?.title.trim() !== staticTranslations.en.title.trim() &&
      task.translations[activeLang]?.title.trim() !== staticTranslations.es.title.trim();

    if (!hasCustomUserEdit) {
      const localized = staticTranslations[activeLang];
      return {
        ...task,
        title: localized.title,
        description: hasNoDescription ? undefined : (localized.description || task.description),
        bullets: localized.bullets || task.bullets?.map(b => translateOperationalString(b, activeLang))
      };
    }
  }

  // 2. Custom manually provided translations in task object
  if (task.translations && task.translations[activeLang]) {
    const localized = task.translations[activeLang];
    if (localized.title && localized.title.trim()) {
      const rawTitle = localized.title.trim();
      const translatedTitle = translateOperationalString(rawTitle, activeLang);
      const translatedDesc = (hasNoDescription || !localized.description)
        ? (task.description ? translateOperationalString(task.description, activeLang) : undefined)
        : translateOperationalString(localized.description.trim(), activeLang);
      const translatedBullets = localized.bullets && localized.bullets.length > 0
        ? localized.bullets.map(b => translateOperationalString(b, activeLang))
        : task.bullets?.map(b => translateOperationalString(b, activeLang));

      return {
        ...task,
        title: translatedTitle || rawTitle,
        description: translatedDesc,
        bullets: translatedBullets
      };
    }
  }

  // 3. Operational fallback translation
  return {
    ...task,
    title: translateOperationalString(task.title, activeLang),
    bullets: task.bullets?.map(b => translateOperationalString(b, activeLang)),
    description: hasNoDescription ? undefined : (task.description ? translateOperationalString(task.description, activeLang) : undefined)
  };
};

export interface GroupedChecklistSubtask {
  id: string;
  bulletText: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  rawTask: any;
}

export interface GroupedChecklistTask {
  parentId: string;
  parentTitle: string;
  parentDescription?: string;
  isCustomOccasional?: boolean;
  frequency?: string;
  isGroup: boolean;
  subtasks: GroupedChecklistSubtask[];
  singleTask?: any;
}

export const STATIC_TASK_FREQUENCIES: Record<string, string> = {
  'task-1': 'A cada 3 horas',
  'task-2': 'A cada 2 horas',
  'task-3': 'Duas vezes por turno',
  'task-4': 'Uma vez por turno',
  'task-5': 'De hora em hora',
  'task-6': 'A cada 2 horas',
  'task-7': 'Três vezes por turno',
  'task-8': 'Diário (Noite)',
  'task-9': 'Diário',
  'task-10': 'Duas vezes por turno',
  'task-11': 'Diário (Noite)',
  'task-12': 'Continuo nos picos',
  'task-13': 'A cada 3 horas',
  'task-eventual-1': 'Semanal / Sob Demanda',
  'task-eventual-2': 'Quinzenal',
  'task-eventual-3': 'Mensal',
  'task-eventual-4': 'Mensal',
};

export const extractAreaNumber = (name: string): number => {
  if (!name) return 999999;
  const areaMatch = name.match(/(?:AREA|ÁREA|BLOCO|PISO|ESTAÇÃO|POSTO|ANDAR|ZONE|ZONA)\s*(\d+)/i);
  if (areaMatch) {
    return parseInt(areaMatch[1], 10);
  }
  const digitsMatch = name.match(/(\d+)/);
  if (digitsMatch) {
    return parseInt(digitsMatch[1], 10);
  }
  return 999999;
};

export const compareEnvironmentsNumerically = (aName: string, bName: string): number => {
  const numA = extractAreaNumber(aName);
  const numB = extractAreaNumber(bName);
  if (numA !== numB) {
    return numA - numB;
  }
  return (aName || '').localeCompare(bName || '', undefined, { numeric: true, sensitivity: 'base' });
};

export const sortEnvironmentNameString = (envNameStr: string): string => {
  if (!envNameStr) return '';
  const parts = envNameStr.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length <= 1) return envNameStr;
  parts.sort(compareEnvironmentsNumerically);
  return parts.join(', ');
};

export const groupChecklistTasks = (tasks: any[], language: string, availableTemplates?: any[]): GroupedChecklistTask[] => {
  const activeLang = (language === 'es' || language === 'en' || language === 'pt') ? language : 'pt';
  const localizedTasks = tasks.map(t => getLocalizedTask(t, activeLang));
  const groupsMap = new Map<string, GroupedChecklistTask>();
  const orderedKeys: string[] = [];

  localizedTasks.forEach(task => {
    if (task.id && task.id.includes('-bullet-')) {
      const parts = task.id.split('-bullet-');
      const parentId = parts[0];
      const bulletIdx = parseInt(parts[1], 10);
      
      let parentTitle = '';
      let bulletText = '';

      // Direct static parent lookup if available
      const parentStaticTrans = TASK_TRANSLATIONS[parentId];
      if (parentStaticTrans && parentStaticTrans[activeLang]) {
        parentTitle = parentStaticTrans[activeLang].title;
        if (parentStaticTrans[activeLang].bullets?.[bulletIdx]) {
          bulletText = parentStaticTrans[activeLang].bullets[bulletIdx];
        }
      }

      if (!bulletText || !parentTitle) {
        const lastDashIdx = task.title.lastIndexOf(' - ');
        if (lastDashIdx !== -1) {
          if (!parentTitle) parentTitle = task.title.substring(0, lastDashIdx);
          if (!bulletText) bulletText = task.title.substring(lastDashIdx + 3);
        } else {
          if (!parentTitle) parentTitle = task.title;
          if (!bulletText) bulletText = task.title;
        }
      }

      parentTitle = translateOperationalString(parentTitle, activeLang);
      bulletText = translateOperationalString(bulletText, activeLang);

      const freq = task.frequency ||
        (availableTemplates && availableTemplates.find((tmpl: any) => tmpl.id === parentId)?.frequency) ||
        STATIC_TASK_FREQUENCIES[parentId] ||
        (task.isCustomOccasional ? 'Sob Demanda' : undefined);

      if (!groupsMap.has(parentId)) {
        groupsMap.set(parentId, {
          parentId,
          parentTitle,
          parentDescription: (parentStaticTrans && parentStaticTrans[activeLang]?.description) || task.description,
          isCustomOccasional: task.isCustomOccasional,
          frequency: freq,
          isGroup: true,
          subtasks: []
        });
        orderedKeys.push(parentId);
      } else {
        if (!groupsMap.get(parentId)!.frequency && freq) {
          groupsMap.get(parentId)!.frequency = freq;
        }
      }
      
      groupsMap.get(parentId)!.subtasks.push({
        id: task.id,
        bulletText,
        completed: task.completed,
        completedAt: task.completedAt,
        notes: task.notes,
        rawTask: task
      });
    } else {
      // Single task without bullet
      const freq = task.frequency ||
        (availableTemplates && availableTemplates.find((tmpl: any) => tmpl.id === task.id)?.frequency) ||
        STATIC_TASK_FREQUENCIES[task.id] ||
        (task.isCustomOccasional ? 'Sob Demanda' : undefined);

      groupsMap.set(task.id, {
        parentId: task.id,
        parentTitle: translateOperationalString(task.title, activeLang),
        parentDescription: task.description ? translateOperationalString(task.description, activeLang) : undefined,
        isCustomOccasional: task.isCustomOccasional,
        frequency: freq,
        isGroup: false,
        subtasks: [],
        singleTask: task
      });
      orderedKeys.push(task.id);
    }
  });

  const result = orderedKeys.map(key => groupsMap.get(key)!);
  result.sort((a, b) => compareEnvironmentsNumerically(a.parentTitle, b.parentTitle));
  return result;
};

export const ROLE_TRANSLATIONS: Record<string, Record<'pt' | 'en' | 'es', string>> = {
  'Auxiliar de Limpeza': {
    pt: 'Auxiliar de Limpeza',
    en: 'Cleaning Assistant',
    es: 'Auxiliar de Limpieza'
  },
  'Líder de Equipe': {
    pt: 'Líder de Equipe',
    en: 'Team Leader',
    es: 'Líder de Equipo'
  },
  'Encarregado de Setor': {
    pt: 'Encarregado de Setor',
    en: 'Sector Supervisor',
    es: 'Encargado de Sector'
  },
  'Auxiliar de Serviços Gerais': {
    pt: 'Auxiliar de Serviços Gerais',
    en: 'General Services Assistant',
    es: 'Auxiliar de Servicios Generales'
  },
  'Cleaning Assistant': {
    pt: 'Auxiliar de Limpeza',
    en: 'Cleaning Assistant',
    es: 'Auxiliar de Limpieza'
  },
  'Team Leader': {
    pt: 'Líder de Equipe',
    en: 'Team Leader',
    es: 'Líder de Equipo'
  },
  'Sector Supervisor': {
    pt: 'Encarregado de Setor',
    en: 'Sector Supervisor',
    es: 'Encargado de Sector'
  },
  'General Services Assistant': {
    pt: 'Auxiliar de Serviços Gerais',
    en: 'General Services Assistant',
    es: 'Auxiliar de Serviços Gerais'
  },
  'Auxiliar de Limpieza': {
    pt: 'Auxiliar de Limpeza',
    en: 'Cleaning Assistant',
    es: 'Auxiliar de Limpieza'
  },
  'Líder de Equipo': {
    pt: 'Líder de Equipe',
    en: 'Team Leader',
    es: 'Líder de Equipo'
  },
  'Encargado de Sector': {
    pt: 'Encarregado de Setor',
    en: 'Sector Supervisor',
    es: 'Encargado de Sector'
  },
  'Auxiliar de Servicios Generales': {
    pt: 'Auxiliar de Serviços Gerais',
    en: 'General Services Assistant',
    es: 'Auxiliar de Servicios Generales'
  }
};

export const SHIFT_TRANSLATIONS: Record<string, Record<'pt' | 'en' | 'es', string>> = {
  'Day Shift (7:00 AM - 3:00 PM)': {
    pt: 'Turno Dia (07:00 - 15:00)',
    en: 'Day Shift (7:00 AM - 3:00 PM)',
    es: 'Turno Día (07:00 - 15:00)'
  },
  'Turno Dia (07:00 - 15:00)': {
    pt: 'Turno Dia (07:00 - 15:00)',
    en: 'Day Shift (7:00 AM - 3:00 PM)',
    es: 'Turno Día (07:00 - 15:00)'
  },
  'Turno Día (07:00 - 15:00)': {
    pt: 'Turno Dia (07:00 - 15:00)',
    en: 'Day Shift (7:00 AM - 3:00 PM)',
    es: 'Turno Día (07:00 - 15:00)'
  },
  'Swing Shift (3:00 PM - 11:00 PM)': {
    pt: 'Turno Tarde (15:00 - 23:00)',
    en: 'Swing Shift (3:00 PM - 11:00 PM)',
    es: 'Turno Tarde (15:00 - 23:00)'
  },
  'Turno Tarde (15:00 - 23:00)': {
    pt: 'Turno Tarde (15:00 - 23:00)',
    en: 'Swing Shift (3:00 PM - 11:00 PM)',
    es: 'Turno Tarde (15:00 - 23:00)'
  },
  'Graveyard Shift (11:00 PM - 7:00 AM)': {
    pt: 'Turno Noite (23:00 - 07:00)',
    en: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    es: 'Turno Noche (23:00 - 07:00)'
  },
  'Turno Noite (23:00 - 07:00)': {
    pt: 'Turno Noite (23:00 - 07:00)',
    en: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    es: 'Turno Noche (23:00 - 07:00)'
  },
  'Turno Noche (23:00 - 07:00)': {
    pt: 'Turno Noite (23:00 - 07:00)',
    en: 'Graveyard Shift (11:00 PM - 7:00 AM)',
    es: 'Turno Noche (23:00 - 07:00)'
  }
};

export const TERM_TRANSLATIONS: Record<string, Record<'pt' | 'en' | 'es', string>> = {
  // Environments
  'Lobby Principal & Recepção': {
    pt: 'Lobby Principal & Recepção',
    en: 'Main Lobby & Reception',
    es: 'Lobby Principal y Recepción'
  },
  'Sanitários Sociais - Bloco A (Piso 1)': {
    pt: 'Sanitários Sociais - Bloco A (Piso 1)',
    en: 'Social Restrooms - Block A (Floor 1)',
    es: 'Baños Sociales - Bloque A (Piso 1)'
  },
  'Escritórios Administrativos - Bloco B': {
    pt: 'Escritórios Administrativos - Bloco B',
    en: 'Administrative Offices - Block B',
    es: 'Oficinas Administrativas - Bloque B'
  },
  'Refeitório Geral & Área de Convivência': {
    pt: 'Refeitório Geral & Área de Convivência',
    en: 'General Cafeteria & Lounge Area',
    es: 'Comedor General y Área de Convivencia'
  },
  'Garagem, Rampas & Docas': {
    pt: 'Garagem, Rampas & Docas',
    en: 'Garage, Ramps & Docks',
    es: 'Garaje, Rampas y Muelles'
  },
  
  // Sub-areas
  'Porta Giratória de Vidro': {
    pt: 'Porta Giratória de Vidro',
    en: 'Glass Revolving Door',
    es: 'Puerta Giratoria de Vidrio'
  },
  'Balcão de Atendimento': {
    pt: 'Balcão de Atendimento',
    en: 'Service Counter',
    es: 'Mostrador de Atención'
  },
  'Sofás e Poltronas de Espera': {
    pt: 'Sofás e Poltronas de Espera',
    en: 'Waiting Sofas and Armchairs',
    es: 'Sofás y Sillones de Espera'
  },
  'Catracas de Acesso': {
    pt: 'Catracas de Acesso',
    en: 'Access Turnstiles',
    es: 'Torniquetes de Acceso'
  },
  'Tapetes de Entrada': {
    pt: 'Tapetes de Entrada',
    en: 'Entrance Mats',
    es: 'Alfombras de Entrada'
  },
  'Sanitário Feminino': {
    pt: 'Sanitário Feminino',
    en: "Women's Restroom",
    es: 'Baño Femenino'
  },
  'Sanitário Masculino': {
    pt: 'Sanitário Masculino',
    en: "Men's Restroom",
    es: 'Baño Masculino'
  },
  'Sanitário PNE / Acessível': {
    pt: 'Sanitário PNE / Acessível',
    en: 'Accessible Restroom',
    es: 'Baño para Discapacitados / Accesible'
  },
  'Antecâmara com Espelhos': {
    pt: 'Antecâmara com Espelhos',
    en: 'Antechamber with Mirrors',
    es: 'Antecámara con Espejos'
  },
  'Dispensadores de Papel/Sabonete': {
    pt: 'Dispensadores de Papel/Sabonete',
    en: 'Paper/Soap Dispensers',
    es: 'Dispensadores de Papel/Jabón'
  },
  'Salas de Reunião (1 a 4)': {
    pt: 'Salas de Reunião (1 a 4)',
    en: 'Meeting Rooms (1 to 4)',
    es: 'Salas de Reuniones (1 a 4)'
  },
  'Estações de Trabalho Organizadoras': {
    pt: 'Estações de Trabalho Organizadoras',
    en: 'Organized Workstations',
    es: 'Estaciones de Trabajo Organizadoras'
  },
  'Corredor Administrativo': {
    pt: 'Corredor Administrativo',
    en: 'Administrative Corridor',
    es: 'Corredor Administrativo'
  },
  'Copa / Cafeteria': {
    pt: 'Copa / Cafeteria',
    en: 'Pantry / Coffee Break Area',
    es: 'Cocina / Cafetería'
  },
  'Salas de Diretoria': {
    pt: 'Salas de Diretoria',
    en: 'Boardrooms',
    es: 'Salas de Directiva'
  },
  'Balcões de Alimentação': {
    pt: 'Balcões de Alimentação',
    en: 'Food Counters',
    es: 'Mostradores de Alimentación'
  },
  'Mesas e Cadeiras de Refeição': {
    pt: 'Mesas e Cadeiras de Refeição',
    en: 'Dining Tables and Chairs',
    es: 'Mesas y Sillas de Comedor'
  },
  'Pias de Lavatório Interno': {
    pt: 'Pias de Lavatório Interno',
    en: 'Internal Hand-washing Sinks',
    es: 'Fregaderos de Lavabo Interno'
  },
  'Micro-ondas e Eletrodomésticos': {
    pt: 'Micro-ondas e Eletrodomésticos',
    en: 'Microwaves & Appliances',
    es: 'Microondas y Electrodomésticos'
  },
  'Área de Descarte de Lixo': {
    pt: 'Área de Descarte de Lixo',
    en: 'Waste Disposal Area',
    es: 'Área de Desecho de Basura'
  },
  'Rampa de Acesso Principal': {
    pt: 'Rampa de Acesso Principal',
    en: 'Main Access Ramp',
    es: 'Rampa de Acceso Principal'
  },
  'Doca de Carga e Descarga': {
    pt: 'Doca de Carga e Descarga',
    en: 'Loading and Unloading Dock',
    es: 'Muelle de Carga y Descarga'
  },
  'Hall de Elevadores (G1/G2)': {
    pt: 'Hall de Elevadores (G1/G2)',
    en: 'Elevator Lobby (G1/G2)',
    es: 'Hall de Ascensores (G1/G2)'
  },
  'Guarita dos Vigilantes': {
    pt: 'Guarita dos Vigilantes',
    en: 'Security Guardhouse',
    es: 'Caseta de Vigilantes'
  },
  'Depósito Central de Resíduos': {
    pt: 'Depósito Central de Resíduos',
    en: 'Central Waste Deposit',
    es: 'Depósito Central de Residuos'
  },

  // Manual User Directives and Specific Term Overrides
  'ÁREA 1: Remoção de Resíduos': {
    pt: 'ÁREA 1: Descarte de Lixo',
    en: 'AREA 1: Trash Disposal',
    es: 'ÁREA 1: Eliminación de Basura'
  },
  'ÁREA 1: Eliminación de Residuos': {
    pt: 'ÁREA 1: Descarte de Lixo',
    en: 'AREA 1: Trash Disposal',
    es: 'ÁREA 1: Eliminación de Basura'
  },
  'AREA 1: Trash Disposal': {
    pt: 'ÁREA 1: Descarte de Lixo',
    en: 'AREA 1: Trash Disposal',
    es: 'ÁREA 1: Eliminación de Basura'
  },
  'ÁREA 1: Descarte de Lixo': {
    pt: 'ÁREA 1: Descarte de Lixo',
    en: 'AREA 1: Trash Disposal',
    es: 'ÁREA 1: Eliminación de Basura'
  },
  'ÁREA 1: Eliminación de Basura': {
    pt: 'ÁREA 1: Descarte de Lixo',
    en: 'AREA 1: Trash Disposal',
    es: 'ÁREA 1: Eliminación de Basura'
  },

  'AREA 2: Trash Disposal': {
    pt: 'ÁREA 2: Descarte de Lixo',
    en: 'AREA 2: Trash Disposal',
    es: 'ÁREA 2: Eliminación de Basura'
  },
  'ÁREA 2: Trash Disposal': {
    pt: 'ÁREA 2: Descarte de Lixo',
    en: 'AREA 2: Trash Disposal',
    es: 'ÁREA 2: Eliminación de Basura'
  },
  'ÁREA 2: Remoção de Resíduos': {
    pt: 'ÁREA 2: Descarte de Lixo',
    en: 'AREA 2: Trash Disposal',
    es: 'ÁREA 2: Eliminación de Basura'
  },
  'ÁREA 2: Eliminación de Residuos': {
    pt: 'ÁREA 2: Descarte de Lixo',
    en: 'AREA 2: Trash Disposal',
    es: 'ÁREA 2: Eliminación de Basura'
  },
  'ÁREA 2: Descarte de Lixo': {
    pt: 'ÁREA 2: Descarte de Lixo',
    en: 'AREA 2: Trash Disposal',
    es: 'ÁREA 2: Eliminación de Basura'
  },
  'ÁREA 2: Eliminación de Basura': {
    pt: 'ÁREA 2: Descarte de Lixo',
    en: 'AREA 2: Trash Disposal',
    es: 'ÁREA 2: Eliminación de Basura'
  },

  'ÁREA 2: Posto do Cassino': {
    pt: 'ÁREA 2: Estação do Cassino',
    en: 'AREA 2: Casino Station',
    es: 'ÁREA 2: Estación del Casino'
  },
  'ÁREA 2: Estação do Cassino': {
    pt: 'ÁREA 2: Estação do Cassino',
    en: 'AREA 2: Casino Station',
    es: 'ÁREA 2: Estación del Casino'
  },
  'AREA 2: Casino Station': {
    pt: 'ÁREA 2: Estação do Cassino',
    en: 'AREA 2: Casino Station',
    es: 'ÁREA 2: Estación del Casino'
  },
  'ÁREA 2: Estación del Casino': {
    pt: 'ÁREA 2: Estação do Cassino',
    en: 'AREA 2: Casino Station',
    es: 'ÁREA 2: Estación del Casino'
  },

  'AREA 3: Trash Disposal': {
    pt: 'ÁREA 3: Descarte de Lixo',
    en: 'AREA 3: Trash Disposal',
    es: 'ÁREA 3: Eliminación de Basura'
  },
  'ÁREA 3: Trash Disposal': {
    pt: 'ÁREA 3: Descarte de Lixo',
    en: 'AREA 3: Trash Disposal',
    es: 'ÁREA 3: Eliminación de Basura'
  },
  'ÁREA 3: Remoção de Resíduos': {
    pt: 'ÁREA 3: Descarte de Lixo',
    en: 'AREA 3: Trash Disposal',
    es: 'ÁREA 3: Eliminación de Basura'
  },
  'ÁREA 3: Eliminación de Residuos': {
    pt: 'ÁREA 3: Descarte de Lixo',
    en: 'AREA 3: Trash Disposal',
    es: 'ÁREA 3: Eliminación de Basura'
  },

  "2nd Floor Women's Restroom": {
    pt: 'Sanitário Feminino - 2º Andar',
    en: "2nd Floor Women's Restroom",
    es: 'Baño Femenino del 2.º Piso'
  },
  'Sanitário Feminino - 2º Andar': {
    pt: 'Sanitário Feminino - 2º Andar',
    en: "2nd Floor Women's Restroom",
    es: 'Baño Femenino del 2.º Piso'
  },
  'Baño Femenino del 2.º Piso': {
    pt: 'Sanitário Feminino - 2º Andar',
    en: "2nd Floor Women's Restroom",
    es: 'Baño Femenino del 2.º Piso'
  },

  'AREA 4: Trash Disposal': {
    pt: 'ÁREA 4: Descarte de Lixo',
    en: 'AREA 4: Trash Disposal',
    es: 'ÁREA 4: Eliminación de Basura'
  },
  'ÁREA 4: Trash Disposal': {
    pt: 'ÁREA 4: Descarte de Lixo',
    en: 'AREA 4: Trash Disposal',
    es: 'ÁREA 4: Eliminación de Basura'
  },
  'ÁREA 4: Remoção de Resíduos': {
    pt: 'ÁREA 4: Descarte de Lixo',
    en: 'AREA 4: Trash Disposal',
    es: 'ÁREA 4: Eliminación de Basura'
  },
  'ÁREA 4: Eliminación de Residuos': {
    pt: 'ÁREA 4: Descarte de Lixo',
    en: 'AREA 4: Trash Disposal',
    es: 'ÁREA 4: Eliminación de Basura'
  },

  'AREA 4: Casino Station': {
    pt: 'ÁREA 4: Estação do Cassino',
    en: 'AREA 4: Casino Station',
    es: 'ÁREA 4: Estación del Casino'
  },
  'ÁREA 4: Posto do Cassino': {
    pt: 'ÁREA 4: Estação do Cassino',
    en: 'AREA 4: Casino Station',
    es: 'ÁREA 4: Estación del Casino'
  },
  'ÁREA 4: Estação do Cassino': {
    pt: 'ÁREA 4: Estação do Cassino',
    en: 'AREA 4: Casino Station',
    es: 'ÁREA 4: Estación del Casino'
  },
  'ÁREA 4: Estación del Casino': {
    pt: 'ÁREA 4: Estação do Cassino',
    en: 'AREA 4: Casino Station',
    es: 'ÁREA 4: Estación del Casino'
  },

  'AREA 4: Escalators': {
    pt: 'ÁREA 4: Escadas Rolantes',
    en: 'AREA 4: Escalators',
    es: 'ÁREA 4: Escaleras Mecánicas'
  },
  'ÁREA 4: Escadas Rolantes': {
    pt: 'ÁREA 4: Escadas Rolantes',
    en: 'AREA 4: Escalators',
    es: 'ÁREA 4: Escaleras Mecánicas'
  },
  'ÁREA 4: Escaleras Mecánicas': {
    pt: 'ÁREA 4: Escadas Rolantes',
    en: 'AREA 4: Escalators',
    es: 'ÁREA 4: Escaleras Mecánicas'
  },

  'AREA 5: Pool Area': {
    pt: 'ÁREA 5: Área da Piscina',
    en: 'AREA 5: Pool Area',
    es: 'ÁREA 5: Área de la Piscina'
  },
  'ÁREA 5: Área da Piscina': {
    pt: 'ÁREA 5: Área da Piscina',
    en: 'AREA 5: Pool Area',
    es: 'ÁREA 5: Área de la Piscina'
  },
  'ÁREA 5: Área de la Piscina': {
    pt: 'ÁREA 5: Área da Piscina',
    en: 'AREA 5: Pool Area',
    es: 'ÁREA 5: Área de la Piscina'
  },

  'AREA 5: EDR: Break Room': {
    pt: 'ÁREA 5: EDR: Sala de Descanso',
    en: 'AREA 5: EDR: Break Room',
    es: 'ÁREA 5: EDR: Sala de Descanso'
  },
  'ÁREA 5: EDR: Break Room': {
    pt: 'ÁREA 5: EDR: Sala de Descanso',
    en: 'AREA 5: EDR: Break Room',
    es: 'ÁREA 5: EDR: Sala de Descanso'
  },
  'ÁREA 5: EDR: Sala de Descanso': {
    pt: 'ÁREA 5: EDR: Sala de Descanso',
    en: 'AREA 5: EDR: Break Room',
    es: 'ÁREA 5: EDR: Sala de Descanso'
  },

  'AREA 5: Trash Disposal': {
    pt: 'ÁREA 5: Descarte de Lixo',
    en: 'AREA 5: Trash Disposal',
    es: 'ÁREA 5: Eliminación de Basura'
  },
  'ÁREA 5: Trash Disposal': {
    pt: 'ÁREA 5: Descarte de Lixo',
    en: 'AREA 5: Trash Disposal',
    es: 'ÁREA 5: Eliminación de Basura'
  },
  'ÁREA 5: Remoção de Resíduos': {
    pt: 'ÁREA 5: Descarte de Lixo',
    en: 'AREA 5: Trash Disposal',
    es: 'ÁREA 5: Eliminación de Basura'
  },
  'ÁREA 5: Eliminación de Residuos': {
    pt: 'ÁREA 5: Descarte de Lixo',
    en: 'AREA 5: Trash Disposal',
    es: 'ÁREA 5: Eliminación de Basura'
  },

  "Employee Women's Restroom": {
    pt: 'Sanitário Feminino dos Funcionários',
    en: "Employee Women's Restroom",
    es: 'Baño Femenino de Empleados'
  },
  'Sanitário Feminino dos Funcionários': {
    pt: 'Sanitário Feminino dos Funcionários',
    en: "Employee Women's Restroom",
    es: 'Baño Femenino de Empleados'
  },
  'Baño Femenino de Empleados': {
    pt: 'Sanitário Feminino dos Funcionários',
    en: "Employee Women's Restroom",
    es: 'Baño Femenino de Empleados'
  },

  "Employee Men's Restroom": {
    pt: 'Sanitário Masculino dos Funcionários',
    en: "Employee Men's Restroom",
    es: 'Baño Masculino de Empleados'
  },
  'Sanitário Masculino dos Funcionários': {
    pt: 'Sanitário Masculino dos Funcionários',
    en: "Employee Men's Restroom",
    es: 'Baño Masculino de Empleados'
  },
  'Baño Masculino de Empleados': {
    pt: 'Sanitário Masculino dos Funcionários',
    en: "Employee Men's Restroom",
    es: 'Baño Masculino de Empleados'
  },

  'AREA 5: Break Room trash': {
    pt: 'ÁREA 5: Lixo da Sala de Descanso',
    en: 'AREA 5: Break Room trash',
    es: 'ÁREA 5: Basura de la Sala de Descanso'
  },
  'ÁREA 5: Break Room trash': {
    pt: 'ÁREA 5: Lixo da Sala de Descanso',
    en: 'AREA 5: Break Room trash',
    es: 'ÁREA 5: Basura de la Sala de Descanso'
  },

  'GYM': {
    pt: 'Academia',
    en: 'GYM',
    es: 'Gimnasio'
  },
  'Gym': {
    pt: 'Academia',
    en: 'Gym',
    es: 'Gimnasio'
  },
  'Academia': {
    pt: 'Academia',
    en: 'Gym',
    es: 'Gimnasio'
  },
  'Gimnasio': {
    pt: 'Academia',
    en: 'Gym',
    es: 'Gimnasio'
  },

  'Executive Office': {
    pt: 'Escritório Executivo',
    en: 'Executive Office',
    es: 'Oficina Ejecutiva'
  },
  'Escritório Executivo': {
    pt: 'Escritório Executivo',
    en: 'Executive Office',
    es: 'Oficina Ejecutiva'
  },
  'Oficina Ejecutiva': {
    pt: 'Escritório Executivo',
    en: 'Executive Office',
    es: 'Oficina Ejecutiva'
  },

  'Seven Sins Lounge': {
    pt: 'Seven Sins Lounge',
    en: 'Seven Sins Lounge',
    es: 'Seven Sins Lounge'
  },
  'Nickle Deuce Bar': {
    pt: 'Seven Sins Lounge',
    en: 'Seven Sins Lounge',
    es: 'Seven Sins Lounge'
  },
  'Nickel Deuce Bar': {
    pt: 'Seven Sins Lounge',
    en: 'Seven Sins Lounge',
    es: 'Seven Sins Lounge'
  },
  'Nickle Deuce': {
    pt: 'Seven Sins Lounge',
    en: 'Seven Sins Lounge',
    es: 'Seven Sins Lounge'
  },
  'Nickel Deuce': {
    pt: 'Seven Sins Lounge',
    en: 'Seven Sins Lounge',
    es: 'Seven Sins Lounge'
  },
  'Seven Sins Lounge Bar': {
    pt: 'Seven Sins Lounge',
    en: 'Seven Sins Lounge',
    es: 'Seven Sins Lounge'
  },

  // Base raw terms
  'Posto do Cassino': {
    pt: 'Estação do Cassino',
    en: 'Casino Station',
    es: 'Estación del Casino'
  },
  'Estação do Cassino': {
    pt: 'Estação do Cassino',
    en: 'Casino Station',
    es: 'Estación del Casino'
  },
  'Casino Station': {
    pt: 'Estação do Cassino',
    en: 'Casino Station',
    es: 'Estación del Casino'
  },
  'Estación del Casino': {
    pt: 'Estação do Cassino',
    en: 'Casino Station',
    es: 'Estación del Casino'
  },

  'Remoção de Resíduos': {
    pt: 'Descarte de Lixo',
    en: 'Trash Disposal',
    es: 'Eliminación de Basura'
  },
  'Eliminación de Residuos': {
    pt: 'Descarte de Lixo',
    en: 'Trash Disposal',
    es: 'Eliminación de Basura'
  },
  'Trash Disposal': {
    pt: 'Descarte de Lixo',
    en: 'Trash Disposal',
    es: 'Eliminación de Basura'
  },
  'Descarte de Lixo': {
    pt: 'Descarte de Lixo',
    en: 'Trash Disposal',
    es: 'Eliminación de Basura'
  },
  'Eliminación de Basura': {
    pt: 'Descarte de Lixo',
    en: 'Trash Disposal',
    es: 'Eliminación de Basura'
  },

  'Escalators': {
    pt: 'Escadas Rolantes',
    en: 'Escalators',
    es: 'Escaleras Mecánicas'
  },
  'Escadas Rolantes': {
    pt: 'Escadas Rolantes',
    en: 'Escalators',
    es: 'Escaleras Mecánicas'
  },
  'Escaleras Mecánicas': {
    pt: 'Escadas Rolantes',
    en: 'Escalators',
    es: 'Escaleras Mecánicas'
  },

  'Pool Area': {
    pt: 'Área da Piscina',
    en: 'Pool Area',
    es: 'Área de la Piscina'
  },
  'Área da Piscina': {
    pt: 'Área da Piscina',
    en: 'Pool Area',
    es: 'Área de la Piscina'
  },
  'Área de la Piscina': {
    pt: 'Área da Piscina',
    en: 'Pool Area',
    es: 'Área de la Piscina'
  },

  'EDR: Break Room': {
    pt: 'EDR: Sala de Descanso',
    en: 'EDR: Break Room',
    es: 'EDR: Sala de Descanso'
  },
  'Break Room': {
    pt: 'Sala de Descanso',
    en: 'Break Room',
    es: 'Sala de Descanso'
  },
  'Sala de Descanso': {
    pt: 'Sala de Descanso',
    en: 'Break Room',
    es: 'Sala de Descanso'
  },

  'Break Room trash': {
    pt: 'Lixo da Sala de Descanso',
    en: 'Break Room trash',
    es: 'Basura de la Sala de Descanso'
  },
  'Lixo da Sala de Descanso': {
    pt: 'Lixo da Sala de Descanso',
    en: 'Break Room trash',
    es: 'Basura de la Sala de Descanso'
  },
  'Basura de la Sala de Descanso': {
    pt: 'Lixo da Sala de Descanso',
    en: 'Break Room trash',
    es: 'Basura de la Sala de Descanso'
  },

  // Event Room & Area 1 Terms
  'AREA 1 Event Room': {
    pt: 'ÁREA 1 - Sala de Eventos',
    en: 'AREA 1 Event Room',
    es: 'ÁREA 1 Sala de Eventos'
  },
  'Area 1 Event Room': {
    pt: 'Área 1 - Sala de Eventos',
    en: 'Area 1 Event Room',
    es: 'Área 1 - Sala de Eventos'
  },
  'AREA 1 - Event Room': {
    pt: 'ÁREA 1 - Sala de Eventos',
    en: 'AREA 1 - Event Room',
    es: 'ÁREA 1 - Sala de Eventos'
  },
  'Area 1 - Event Room': {
    pt: 'Área 1 - Sala de Eventos',
    en: 'Area 1 - Event Room',
    es: 'Área 1 - Sala de Eventos'
  },
  'Event Room': {
    pt: 'Sala de Eventos',
    en: 'Event Room',
    es: 'Sala de Eventos'
  },
  'Sala de Eventos': {
    pt: 'Sala de Eventos',
    en: 'Event Room',
    es: 'Sala de Eventos'
  },
  'Salão de Eventos': {
    pt: 'Salão de Eventos',
    en: 'Event Room',
    es: 'Salón de Eventos'
  },
  'AREA 1': {
    pt: 'ÁREA 1',
    en: 'AREA 1',
    es: 'ÁREA 1'
  },
  'Area 1': {
    pt: 'Área 1',
    en: 'Area 1',
    es: 'Área 1'
  },

  // Trash Disposal & Area 2 & Area 3 Terms
  'AREA 2 Trash Disposal': {
    pt: 'ÁREA 2 - Descarte de Lixo',
    en: 'AREA 2 Trash Disposal',
    es: 'ÁREA 2 Eliminación de Basura'
  },
  'Area 2 Trash Disposal': {
    pt: 'Área 2 - Descarte de Lixo',
    en: 'Area 2 Trash Disposal',
    es: 'Área 2 - Eliminación de Basura'
  },
  'AREA 2 - Trash Disposal': {
    pt: 'ÁREA 2 - Descarte de Lixo',
    en: 'AREA 2 - Trash Disposal',
    es: 'ÁREA 2 - Eliminación de Basura'
  },
  'Area 2 - Trash Disposal': {
    pt: 'Área 2 - Descarte de Lixo',
    en: 'Area 2 - Trash Disposal',
    es: 'Área 2 - Eliminación de Basura'
  },
  'AREA 2': {
    pt: 'ÁREA 2',
    en: 'AREA 2',
    es: 'ÁREA 2'
  },
  'Area 2': {
    pt: 'Área 2',
    en: 'Area 2',
    es: 'Área 2'
  },
  'AREA 3 Trash Disposal': {
    pt: 'ÁREA 3 - Descarte de Lixo',
    en: 'AREA 3 Trash Disposal',
    es: 'ÁREA 3 Eliminación de Basura'
  },
  'Area 3 Trash Disposal': {
    pt: 'Área 3 - Descarte de Lixo',
    en: 'Area 3 Trash Disposal',
    es: 'Área 3 - Eliminación de Basura'
  },
  'AREA 3 - Trash Disposal': {
    pt: 'ÁREA 3 - Descarte de Lixo',
    en: 'AREA 3 - Trash Disposal',
    es: 'ÁREA 3 - Eliminación de Basura'
  },
  'Area 3 - Trash Disposal': {
    pt: 'Área 3 - Descarte de Lixo',
    en: 'Area 3 - Trash Disposal',
    es: 'Área 3 - Eliminación de Basura'
  },
  'AREA 3': {
    pt: 'ÁREA 3',
    en: 'AREA 3',
    es: 'ÁREA 3'
  },
  'Area 3': {
    pt: 'Área 3',
    en: 'Area 3',
    es: 'Área 3'
  },
  'AREA 4 Casino Station': {
    pt: 'ÁREA 4 - Estação do Cassino',
    en: 'AREA 4 Casino Station',
    es: 'ÁREA 4 Estación del Casino'
  },
  'Area 4 Casino Station': {
    pt: 'Área 4 - Estação do Cassino',
    en: 'Area 4 Casino Station',
    es: 'Área 4 - Estación del Casino'
  },
  'AREA 4 - Casino Station': {
    pt: 'ÁREA 4 - Estação do Cassino',
    en: 'AREA 4 - Casino Station',
    es: 'ÁREA 4 - Estación del Casino'
  },
  'Area 4 - Casino Station': {
    pt: 'Área 4 - Estação do Cassino',
    en: 'Area 4 - Casino Station',
    es: 'Área 4 - Estación del Casino'
  },
  'AREA 4 Escalators': {
    pt: 'ÁREA 4 - Escadas Rolantes',
    en: 'AREA 4 Escalators',
    es: 'ÁREA 4 Escaleras Mecánicas'
  },
  'Area 4 Escalators': {
    pt: 'Área 4 - Escadas Rolantes',
    en: 'Area 4 Escalators',
    es: 'Área 4 - Escaleras Mecánicas'
  },
  'AREA 4 - Escalators': {
    pt: 'ÁREA 4 - Escadas Rolantes',
    en: 'AREA 4 - Escalators',
    es: 'ÁREA 4 - Escaleras Mecánicas'
  },
  'Area 4 - Escalators': {
    pt: 'Área 4 - Escadas Rolantes',
    en: 'Area 4 - Escalators',
    es: 'Área 4 - Escaleras Mecánicas'
  },
  'AREA 4': {
    pt: 'ÁREA 4',
    en: 'AREA 4',
    es: 'ÁREA 4'
  },
  'Area 4': {
    pt: 'Área 4',
    en: 'Area 4',
    es: 'Área 4'
  },
  'AREA 5 Pool Area': {
    pt: 'ÁREA 5 - Área da Piscina',
    en: 'AREA 5 Pool Area',
    es: 'ÁREA 5 Área de la Piscina'
  },
  'Area 5 Pool Area': {
    pt: 'Área 5 - Área da Piscina',
    en: 'Area 5 Pool Area',
    es: 'Área 5 - Área de la Piscina'
  },
  'AREA 5 - Pool Area': {
    pt: 'ÁREA 5 - Área da Piscina',
    en: 'AREA 5 - Pool Area',
    es: 'ÁREA 5 - Área de la Piscina'
  },
  'Area 5 - Pool Area': {
    pt: 'Área 5 - Área da Piscina',
    en: 'Area 5 - Pool Area',
    es: 'Área 5 - Área de la Piscina'
  },
  'AREA 5 EDR: Break Room': {
    pt: 'ÁREA 5 - EDR: Sala de Descanso',
    en: 'AREA 5 EDR: Break Room',
    es: 'ÁREA 5 EDR: Sala de Descanso'
  },
  'Area 5 EDR: Break Room': {
    pt: 'Área 5 - EDR: Sala de Descanso',
    en: 'Area 5 EDR: Break Room',
    es: 'Área 5 - EDR: Sala de Descanso'
  },
  'AREA 5 - EDR: Break Room': {
    pt: 'ÁREA 5 - EDR: Sala de Descanso',
    en: 'AREA 5 - EDR: Break Room',
    es: 'ÁREA 5 - EDR: Sala de Descanso'
  },
  'Area 5 - EDR: Break Room': {
    pt: 'Área 5 - EDR: Sala de Descanso',
    en: 'Area 5 - EDR: Break Room',
    es: 'Área 5 - EDR: Sala de Descanso'
  },
  'AREA 5 Trash Disposal': {
    pt: 'ÁREA 5 - Descarte de Lixo',
    en: 'AREA 5 Trash Disposal',
    es: 'ÁREA 5 Eliminación de Basura'
  },
  'Area 5 Trash Disposal': {
    pt: 'Área 5 - Descarte de Lixo',
    en: 'Area 5 Trash Disposal',
    es: 'Área 5 - Eliminación de Basura'
  },
  'AREA 5 - Trash Disposal': {
    pt: 'ÁREA 5 - Descarte de Lixo',
    en: 'AREA 5 - Trash Disposal',
    es: 'ÁREA 5 - Eliminación de Basura'
  },
  'Area 5 - Trash Disposal': {
    pt: 'Área 5 - Descarte de Lixo',
    en: 'Area 5 - Trash Disposal',
    es: 'Área 5 - Eliminación de Basura'
  },
  'AREA 5 Break Room trash': {
    pt: 'ÁREA 5 - Lixo da Sala de Descanso',
    en: 'AREA 5 Break Room trash',
    es: 'ÁREA 5 Basura de la Sala de Descanso'
  },
  'Area 5 Break Room trash': {
    pt: 'Área 5 - Lixo da Sala de Descanso',
    en: 'Area 5 Break Room trash',
    es: 'Área 5 - Basura de la Sala de Descanso'
  },
  'AREA 5 - Break Room trash': {
    pt: 'ÁREA 5 - Lixo da Sala de Descanso',
    en: 'AREA 5 - Break Room trash',
    es: 'ÁREA 5 - Basura de la Sala de Descanso'
  },
  'Area 5 - Break Room trash': {
    pt: 'Área 5 - Lixo da Sala de Descanso',
    en: 'Area 5 - Break Room trash',
    es: 'Área 5 - Basura de la Sala de Descanso'
  },
  'AREA 5': {
    pt: 'ÁREA 5',
    en: 'AREA 5',
    es: 'ÁREA 5'
  },
  'Area 5': {
    pt: 'Área 5',
    en: 'Area 5',
    es: 'Área 5'
  },

  // Occasional / On-Demand Tasks
  'Lavação pressurizada da rampa externa de acesso de veículos': {
    pt: 'Lavação pressurizada da rampa externa de acesso de veículos',
    en: 'Pressurized washing of the external vehicle access ramp',
    es: 'Lavado a presión de la rampa externa de acceso de vehículos'
  },
  'Pressurized washing of the external vehicle access ramp': {
    pt: 'Lavação pressurizada da rampa externa de acesso de veículos',
    en: 'Pressurized washing of the external vehicle access ramp',
    es: 'Lavado a presión de la rampa externa de acceso de vehículos'
  },
  'Lavado a presión de la rampa externa de acceso de vehículos': {
    pt: 'Lavação pressurizada da rampa externa de acesso de veículos',
    en: 'Pressurized washing of the external vehicle access ramp',
    es: 'Lavado a presión de la rampa externa de acceso de vehículos'
  },

  'Polimento específico do balcão de mármore do Lobby Principal': {
    pt: 'Polimento específico do balcão de mármore do Lobby Principal',
    en: 'Specific polishing of the Main Lobby marble counter',
    es: 'Pulido específico del mostrador de mármol del Lobby Principal'
  },
  'Specific polishing of the Main Lobby marble counter': {
    pt: 'Polimento específico do balcão de mármore do Lobby Principal',
    en: 'Specific polishing of the Main Lobby marble counter',
    es: 'Pulido específico del mostrador de mármol del Lobby Principal'
  },
  'Pulido específico del mostrador de mármol del Lobby Principal': {
    pt: 'Polimento específico do balcão de mármore do Lobby Principal',
    en: 'Specific polishing of the Main Lobby marble counter',
    es: 'Pulido específico del mostrador de mármol del Lobby Principal'
  },

  'Limpeza interna pesada de geladeiras e freezers do refeitório': {
    pt: 'Limpeza interna pesada de geladeiras e freezers do refeitório',
    en: 'Heavy-duty internal cleaning of cafeteria refrigerators and freezers',
    es: 'Limpieza interna profunda de refrigeradores y congeladores del comedor'
  },
  'Heavy-duty internal cleaning of cafeteria refrigerators and freezers': {
    pt: 'Limpeza interna pesada de geladeiras e freezers do refeitório',
    en: 'Heavy-duty internal cleaning of cafeteria refrigerators and freezers',
    es: 'Limpieza interna profunda de refrigeradores y congeladores del comedor'
  },
  'Limpieza interna profunda de refrigeradores y congeladores del comedor': {
    pt: 'Limpeza interna pesada de geladeiras e freezers do refeitório',
    en: 'Heavy-duty internal cleaning of cafeteria refrigerators and freezers',
    es: 'Limpieza interna profunda de refrigeradores y congeladores del comedor'
  },

  'Higienização de luminárias e grelhas de ar condicionado em altura': {
    pt: 'Higienização de luminárias e grelhas de ar condicionado em altura',
    en: 'Sanitization of high-altitude light fixtures and air conditioning vents',
    es: 'Higienización de luminarias y rejillas de aire acondicionado en altura'
  },
  'Sanitization of high-altitude light fixtures and air conditioning vents': {
    pt: 'Higienização de luminárias e grelhas de ar condicionado em altura',
    en: 'Sanitization of high-altitude light fixtures and air conditioning vents',
    es: 'Higienización de luminarias y rejillas de aire acondicionado en altura'
  },
  'Higienización de luminarias y rejillas de aire acondicionado en altura': {
    pt: 'Higienização de luminárias e grelhas de ar condicionado em altura',
    en: 'Sanitization of high-altitude light fixtures and air conditioning vents',
    es: 'Higienización de luminarias y rejillas de aire acondicionado en altura'
  },

  // Bullet Subtasks
  'Collect and dispose of trash': {
    pt: 'Coletar e descartar o lixo',
    en: 'Collect and dispose of trash',
    es: 'Recolectar y desechar la basura'
  },
  'Coletar e descartar o lixo': {
    pt: 'Coletar e descartar o lixo',
    en: 'Collect and dispose of trash',
    es: 'Recolectar y desechar la basura'
  },
  'Collect trash from all trash cans in the area': {
    pt: 'Coletar o lixo de todas as lixeiras do setor',
    en: 'Collect trash from all trash cans in the area',
    es: 'Recolectar la basura de todas las papeleras del sector'
  },
  'Coletar o lixo de todas as lixeiras do setor': {
    pt: 'Coletar o lixo de todas as lixeiras do setor',
    en: 'Collect trash from all trash cans in the area',
    es: 'Recolectar la basura de todas las papeleras del sector'
  },
  'Dispose of waste in appropriate containers': {
    pt: 'Descartar resíduos nos contêineres apropriados',
    en: 'Dispose of waste in appropriate containers',
    es: 'Desechar residuos en los contenedores apropriados'
  },
  'Descartar resíduos nos contêineres apropriados': {
    pt: 'Descartar resíduos nos contêineres apropriados',
    en: 'Dispose of waste in appropriate containers',
    es: 'Desechar residuos en los contenedores apropriados'
  },
  'Sanitize and disinfect trash cans': {
    pt: 'Higienizar e desinfetar as lixeiras',
    en: 'Sanitize and disinfect trash cans',
    es: 'Higienizar y desinfectar las papeleras'
  },
  'Higienizar e desinfetar as lixeiras': {
    pt: 'Higienizar e desinfetar as lixeiras',
    en: 'Sanitize and disinfect trash cans',
    es: 'Higienizar y desinfectar las papeleras'
  },
  'Replace with new trash bags': {
    pt: 'Substituir por novos sacos de lixo',
    en: 'Replace with new trash bags',
    es: 'Reemplazar por nuevas bolsas de basura'
  },
  'Substituir por novos sacos de lixo': {
    pt: 'Substituir por novos sacos de lixo',
    en: 'Replace with new trash bags',
    es: 'Reemplazar por novas bolsas de basura'
  },
  'Transport trash bags to the waste dock': {
    pt: 'Transportar os sacos de lixo para a doca de resíduos',
    en: 'Transport trash bags to the waste dock',
    es: 'Transportar las bolsas de basura al muelle de residuos'
  },
  'Transportar os sacos de lixo para a doca de resíduos': {
    pt: 'Transportar os sacos de lixo para a doca de resíduos',
    en: 'Transport trash bags to the waste dock',
    es: 'Transportar las bolsas de basura al muelle de residuos'
  },
  'Safely unplug equipment from power outlet': {
    pt: 'Desligar os equipamentos da tomada com segurança',
    en: 'Safely unplug equipment from power outlet',
    es: 'Desconectar los equipos de la toma de corriente con seguridad'
  },
  'Desligar os equipamentos da tomada com segurança': {
    pt: 'Desligar os equipamentos da tomada com segurança',
    en: 'Safely unplug equipment from power outlet',
    es: 'Desconectar los equipos de la toma de corriente con seguridad'
  },
  'Desconectar los equipos de la toma de corriente con seguridad': {
    pt: 'Desligar os equipamentos da tomada com segurança',
    en: 'Safely unplug equipment from power outlet',
    es: 'Desconectar los equipos de la toma de corriente con seguridad'
  },

  'Remove all food items and discard expired products': {
    pt: 'Retirar todos os alimentos e descartar itens vencidos',
    en: 'Remove all food items and discard expired products',
    es: 'Retirar todos los alimentos y desechar productos vencidos'
  },
  'Retirar todos os alimentos e descartar itens vencidos': {
    pt: 'Retirar todos os alimentos e descartar itens vencidos',
    en: 'Remove all food items and discard expired products',
    es: 'Retirar todos los alimentos y desechar productos vencidos'
  },
  'Retirar todos los alimentos y desechar productos vencidos': {
    pt: 'Retirar todos os alimentos e descartar itens vencidos',
    en: 'Remove all food items and discard expired products',
    es: 'Retirar todos los alimentos y desechar productos vencidos'
  },

  'Sanitize internal shelves and drawers with neutral cleaner': {
    pt: 'Higienizar as prateleiras e gavetas internas com sanitizante neutro',
    en: 'Sanitize internal shelves and drawers with neutral cleaner',
    es: 'Higienizar los estantes y cajones internos con desinfectante neutro'
  },
  'Higienizar as prateleiras e gavetas internas com sanitizante neutro': {
    pt: 'Higienizar as prateleiras e gavetas internas com sanitizante neutro',
    en: 'Sanitize internal shelves and drawers with neutral cleaner',
    es: 'Higienizar los estantes y cajones internos con desinfectante neutro'
  },
  'Higienizar los estantes y cajones internos con desinfectante neutro': {
    pt: 'Higienizar as prateleiras e gavetas internas com sanitizante neutro',
    en: 'Sanitize internal shelves and drawers with neutral cleaner',
    es: 'Higienizar los estantes y cajones internos con desinfectante neutro'
  },

  'Clean door rubber gaskets and plug appliances back in': {
    pt: 'Limpar as borrachas de vedação das portas e religar os aparelhos',
    en: 'Clean door rubber gaskets and plug appliances back in',
    es: 'Limpiar las gomas de sellado de las puertas y volver a conectar los aparatos'
  },
  'Limpar as borrachas de vedação das portas e religar os aparelhos': {
    pt: 'Limpar as borrachas de vedação das portas e religar os aparelhos',
    en: 'Clean door rubber gaskets and plug appliances back in',
    es: 'Limpiar las gomas de sellado de las puertas y volver a conectar los aparatos'
  },
  'Limpiar las gomas de sellado de las puertas y volver a conectar los aparatos': {
    pt: 'Limpar as borrachas de vedação das portas e religar os aparelhos',
    en: 'Clean door rubber gaskets and plug appliances back in',
    es: 'Limpiar las gomas de sellado de las puertas y volver a conectar los aparatos'
  }
};

export const getLocalizedEnvironmentName = (envName: string, lang: string): string => {
  if (!envName) return '';
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? (lang as 'pt' | 'en' | 'es') : 'pt';
  
  // Regex to match: Environment Name (Sub1, Sub2) or Environment Name (No subareas selected)
  const match = envName.match(/^([^(]+)(?:\(([^)]+)\))?$/);
  if (!match) {
    // If it's just a raw subarea term directly, check if it translates
    const cleanRaw = envName.trim();
    const foundKey = Object.keys(TERM_TRANSLATIONS).find(k => k.toLowerCase() === cleanRaw.toLowerCase());
    if (foundKey) {
      return TERM_TRANSLATIONS[foundKey][activeLang];
    }
    return envName;
  }

  const mainPart = match[1].trim();
  const subPart = match[2]?.trim();

  // Translate main part
  let localizedMain = mainPart;
  const foundMainKey = Object.keys(TERM_TRANSLATIONS).find(k => k.toLowerCase() === mainPart.toLowerCase());
  if (foundMainKey) {
    localizedMain = TERM_TRANSLATIONS[foundMainKey][activeLang];
  } else {
    // Try substring replace
    for (const key of Object.keys(TERM_TRANSLATIONS)) {
      if (mainPart.toLowerCase().includes(key.toLowerCase())) {
        localizedMain = mainPart.replace(new RegExp(key, 'gi'), TERM_TRANSLATIONS[key][activeLang]);
        break;
      }
    }
  }

  if (!subPart) {
    return localizedMain;
  }

  // Check if subpart is "No subareas selected"
  const cleanSub = subPart.toLowerCase();
  if (
    cleanSub === 'no subareas selected' ||
    cleanSub === 'ninguna subárea seleccionada' ||
    cleanSub === 'nenhuma sub-área selecionada'
  ) {
    const fallbackText = activeLang === 'en' 
      ? 'No subareas selected' 
      : activeLang === 'es' 
      ? 'Ninguna subárea seleccionada' 
      : 'Nenhuma sub-área selecionada';
    return `${localizedMain} (${fallbackText})`;
  }

  // Split sub-areas by comma and translate each
  const subs = subPart.split(',').map(s => s.trim());
  const localizedSubs = subs.map(sub => {
    const foundSubKey = Object.keys(TERM_TRANSLATIONS).find(k => k.toLowerCase() === sub.toLowerCase());
    if (foundSubKey) {
      return TERM_TRANSLATIONS[foundSubKey][activeLang];
    }
    return sub;
  });

  return `${localizedMain} (${localizedSubs.join(', ')})`;
};

export const getLocalizedRole = (role: string, lang: string): string => {
  if (!role) return '';
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? (lang as 'pt' | 'en' | 'es') : 'pt';
  const cleanRole = role.trim();
  const foundKey = Object.keys(ROLE_TRANSLATIONS).find(k => k.toLowerCase() === cleanRole.toLowerCase());
  if (foundKey) {
    return ROLE_TRANSLATIONS[foundKey][activeLang];
  }
  return role;
};

export const getLocalizedShift = (shift: string, lang: string): string => {
  if (!shift) return '';
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? (lang as 'pt' | 'en' | 'es') : 'pt';
  const cleanShift = shift.trim();
  const foundKey = Object.keys(SHIFT_TRANSLATIONS).find(k => k.toLowerCase() === cleanShift.toLowerCase());
  if (foundKey) {
    return SHIFT_TRANSLATIONS[foundKey][activeLang];
  }
  return shift;
};

export const getLocalizedCoverageTime = (time: string, lang: string): string => {
  if (!time) return '';
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? (lang as 'pt' | 'en' | 'es') : 'pt';
  
  // Remove parenthetical details, e.g., "11:00 - 11:30 (Cobrir Carlos)" -> "11:00 - 11:30"
  const cleanTimeOnly = time.replace(/\s*\([^)]*\)/g, '').trim();

  const clean = cleanTimeOnly.toLowerCase();
  if (!clean || clean === 'none' || clean === 'ninguno' || clean === 'nenhum' || clean === '-' || clean === 'n/a') {
    return activeLang === 'en' ? 'None' : activeLang === 'es' ? 'Ninguno' : 'Nenhum';
  }
  return cleanTimeOnly;
};

export const getLocalizedFrequency = (freq: string | undefined, lang: string): string => {
  if (!freq || typeof freq !== 'string') return '';
  const activeLang = (lang === 'es' || lang === 'en' || lang === 'pt') ? (lang as 'pt' | 'en' | 'es') : 'pt';
  
  const rawClean = freq.trim();
  if (!rawClean) return '';

  const normalizeFreq = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const clean = normalizeFreq(rawClean);

  const freqDictionary: Array<{ keys: string[]; pt: string; en: string; es: string }> = [
    {
      keys: [
        'every other day', 'dia sim dia nao', 'dia sim, dia nao', 'a cada dois dias', 
        'a cada 2 dias', 'un dia si un dia no', 'un dia si, un dia no', 'cada dos dias', 'cada 2 dias'
      ],
      pt: 'Dia sim, dia não', en: 'Every other day', es: 'Un día sí, un día no'
    },
    {
      keys: [
        '2 times minimum per shift', '2 times min per shift', 'minimum 2 times per shift',
        '2 vezes minimo por turno', 'minimo 2 vezes por turno', '2 veces minimo por turno', 'minimo 2 veces por turno'
      ],
      pt: 'Mínimo 2 vezes por turno', en: 'Minimum 2 times per shift', es: 'Mínimo 2 veces por turno'
    },
    {
      keys: [
        '3 times minimum per shift', '3 times min per shift', 'minimum 3 times per shift',
        '3 vezes minimo por turno', 'minimo 3 vezes por turno', '3 veces minimo por turno', 'minimo 3 veces por turno'
      ],
      pt: 'Mínimo 3 vezes por turno', en: 'Minimum 3 times per shift', es: 'Mínimo 3 veces por turno'
    },
    {
      keys: ['diario', 'diaria', 'daily', 'everyday', 'every day'],
      pt: 'Diário', en: 'Daily', es: 'Diario'
    },
    {
      keys: ['diario (noite)', 'diaria (noite)', 'daily (night)', 'diario (noche)', 'diario (noturno)'],
      pt: 'Diário (Noite)', en: 'Daily (Night)', es: 'Diario (Noche)'
    },
    {
      keys: ['diario (dia)', 'daily (day)', 'diario (dia)', 'diario (diurno)'],
      pt: 'Diário (Dia)', en: 'Daily (Day)', es: 'Diario (Día)'
    },
    {
      keys: ['semanal', 'weekly', 'every week'],
      pt: 'Semanal', en: 'Weekly', es: 'Semanal'
    },
    {
      keys: ['quinzenal', 'biweekly', 'fortnightly', 'quincenal'],
      pt: 'Quinzenal', en: 'Biweekly', es: 'Quincenal'
    },
    {
      keys: ['mensal', 'monthly', 'mensual', 'every month'],
      pt: 'Mensal', en: 'Monthly', es: 'Mensual'
    },
    {
      keys: ['semestral', 'half-yearly', 'biannual', 'semi-annual'],
      pt: 'Semestral', en: 'Half-yearly', es: 'Semestral'
    },
    {
      keys: ['anual', 'annual', 'yearly', 'every year'],
      pt: 'Anual', en: 'Annual', es: 'Anual'
    },
    {
      keys: ['continua', 'continuo', 'continuous'],
      pt: 'Contínua', en: 'Continuous', es: 'Continua'
    },
    {
      keys: ['continuo nos picos', 'continuous during peaks', 'continuous on peaks', 'continuo en picos', 'continuo en horas pico'],
      pt: 'Contínuo nos picos', en: 'Continuous during peaks', es: 'Continuo en picos'
    },
    {
      keys: ['de hora em hora', 'hourly', 'every hour', 'cada hora', 'a cada hora', 'de hora en hora', 'a cada 1 hora', 'a cada 1h', 'cada 1h', 'every 1h'],
      pt: 'De hora em hora', en: 'Hourly', es: 'Cada hora'
    },
    {
      keys: ['a cada 2 horas', 'every 2 hours', 'cada 2 horas', 'de 2 em 2 horas', 'a cada 2h', 'cada 2h', 'every 2h'],
      pt: 'A cada 2 horas', en: 'Every 2 hours', es: 'Cada 2 horas'
    },
    {
      keys: ['a cada 3 horas', 'every 3 hours', 'cada 3 horas', 'de 3 em 3 horas', 'a cada 3h', 'cada 3h', 'every 3h'],
      pt: 'A cada 3 horas', en: 'Every 3 hours', es: 'Cada 3 horas'
    },
    {
      keys: ['a cada 4 horas', 'every 4 hours', 'cada 4 horas', 'de 4 em 4 horas', 'a cada 4h', 'cada 4h', 'every 4h'],
      pt: 'A cada 4 horas', en: 'Every 4 hours', es: 'Cada 4 horas'
    },
    {
      keys: ['a cada 6 horas', 'every 6 hours', 'cada 6 horas', 'a cada 6h', 'cada 6h', 'every 6h'],
      pt: 'A cada 6 horas', en: 'Every 6 hours', es: 'Cada 6 horas'
    },
    {
      keys: ['a cada 8 horas', 'every 8 hours', 'cada 8 horas', 'a cada 8h', 'cada 8h', 'every 8h'],
      pt: 'A cada 8 horas', en: 'Every 8 hours', es: 'Cada 8 horas'
    },
    {
      keys: ['a cada 12 horas', 'every 12 hours', 'cada 12 horas', 'a cada 12h', 'cada 12h', 'every 12h'],
      pt: 'A cada 12 horas', en: 'Every 12 hours', es: 'Cada 12 horas'
    },
    {
      keys: ['uma vez por turno', 'once per shift', 'una vez por turno', '1x por turno', '1x per shift', '1 vez por turno'],
      pt: 'Uma vez por turno', en: 'Once per shift', es: 'Una vez por turno'
    },
    {
      keys: ['duas vezes por turno', 'twice per shift', 'dos veces por turno', '2x por turno', '2x per shift', '2 vezes por turno'],
      pt: 'Duas vezes por turno', en: 'Twice per shift', es: 'Dos veces por turno'
    },
    {
      keys: ['tres vezes por turno', 'three times per shift', 'tres veces por turno', '3x por turno', '3x per shift', '3 vezes por turno'],
      pt: 'Três vezes por turno', en: 'Three times per shift', es: 'Tres veces por turno'
    },
    {
      keys: ['quatro vezes por turno', 'four times per shift', 'cuatro veces por turno', '4x por turno', '4x per shift'],
      pt: 'Quatro vezes por turno', en: 'Four times per shift', es: 'Cuatro veces por turno'
    },
    {
      keys: ['uma vez por dia', 'uma vez ao dia', 'once daily', 'once a day', 'una vez al dia', 'una vez por dia', '1x por dia', '1x daily'],
      pt: 'Uma vez por dia', en: 'Once daily', es: 'Una vez al día'
    },
    {
      keys: ['duas vezes por dia', 'twice daily', 'twice a day', 'dos veces al dia', 'dos veces por dia', '2x por dia', '2x daily'],
      pt: 'Duas vezes por dia', en: 'Twice daily', es: 'Dos veces al día'
    },
    {
      keys: ['tres vezes por dia', 'three times daily', 'three times a day', 'tres veces al dia', 'tres veces por dia', '3x por dia', '3x daily'],
      pt: 'Três vezes por dia', en: 'Three times daily', es: 'Tres veces al día'
    },
    {
      keys: ['uma vez por semana', 'uma vez na semana', 'once a week', 'once per week', 'once weekly', 'una vez a la semana', 'una vez por semana', '1x por semana', '1x a week', '1x/semana', '1x per week', '1 time a week', '1 time per week', 'uma vez a semana'],
      pt: 'Uma vez por semana', en: 'Once a week', es: 'Una vez por semana'
    },
    {
      keys: ['duas vezes por semana', 'duas vezes na semana', 'twice a week', 'twice per week', 'twice weekly', 'dos veces a la semana', 'dos veces por semana', '2x por semana', '2x a week', '2x/semana', '2x per week', '2 times a week', '2 times per week'],
      pt: 'Duas vezes por semana', en: 'Twice a week', es: 'Dos veces por semana'
    },
    {
      keys: ['tres vezes por semana', 'três vezes por semana', 'tres vezes na semana', '3 times a week', 'three times a week', '3 times per week', 'three times per week', 'tres veces a la semana', 'tres veces por semana', '3x por semana', '3x a week', '3x/semana', '3x per week'],
      pt: 'Três vezes por semana', en: 'Three times a week', es: 'Tres veces por semana'
    },
    {
      keys: ['quatro vezes por semana', 'quatro vezes na semana', '4 times a week', 'four times a week', '4 times per week', 'four times per week', 'cuatro veces a la semana', 'cuatro veces por semana', '4x por semana', '4x a week', '4x/semana', '4x per week'],
      pt: 'Quatro vezes por semana', en: 'Four times a week', es: 'Cuatro veces por semana'
    },
    {
      keys: ['uma vez por mes', 'uma vez por mês', 'uma vez no mes', 'once a month', 'once per month', 'once monthly', 'una vez al mes', 'una vez por mes', '1x por mes', '1x por mês', '1x a month', '1x/mes', '1x per month', '1 time a month', '1 time per month'],
      pt: 'Uma vez por mês', en: 'Once a month', es: 'Una vez al mes'
    },
    {
      keys: [
        'sob demanda', 'sob comando', 'on-demand', 'on demand', 'ondemand', 'bajo demanda', 'bajo comando',
        'a demanda', 'segun demanda', 'segun la demanda', 'según demanda', 'under demand', 'upon request', 'on request',
        'as needed', 'conforme necessidade', 'sob necessidade', 'demanda'
      ],
      pt: 'Sob Demanda', en: 'On-demand', es: 'Bajo Demanda'
    },
    {
      keys: [
        'semanal / sob demanda', 'semanal / sob comando', 'weekly / on-demand', 'weekly / on demand', 'weekly / ondemand',
        'semanal / bajo demanda', 'semanal / bajo comando', 'semanal / a demanda', 'weekly / on request',
        'weekly / as needed', 'semanal / demanda'
      ],
      pt: 'Semanal / Sob Demanda', en: 'Weekly / On-demand', es: 'Semanal / Bajo Demanda'
    },
    {
      keys: [
        'quinzenal / sob demanda', 'biweekly / on-demand', 'biweekly / on demand', 'quincenal / bajo demanda',
        'fortnightly / on-demand', 'quinzenal / a demanda'
      ],
      pt: 'Quinzenal / Sob Demanda', en: 'Biweekly / On-demand', es: 'Quincenal / Bajo Demanda'
    },
    {
      keys: [
        'mensal / sob demanda', 'monthly / on-demand', 'monthly / on demand', 'mensual / bajo demanda',
        'mensal / a demanda'
      ],
      pt: 'Mensal / Sob Demanda', en: 'Monthly / On-demand', es: 'Mensual / Bajo Demanda'
    },
    {
      keys: ['eventual', 'occasional', 'eventuales', 'ocasional', 'ocasionales', 'eventual (manual)', 'occasional (special)', 'eventual (eventual)'],
      pt: 'Eventual', en: 'Occasional', es: 'Eventual'
    }
  ];

  // 1. Direct dictionary match
  const match = freqDictionary.find(item => item.keys.some(k => normalizeFreq(k) === clean));
  if (match) {
    return match[activeLang];
  }

  // 1.5 Compound frequency check (e.g. "Semanal / Sob Demanda", "Weekly / On-demand", etc.)
  if (clean.includes('/')) {
    const parts = clean.split('/');
    const translatedParts = parts.map(p => getLocalizedFrequency(p.trim(), activeLang));
    if (translatedParts.length > 0 && translatedParts.some(tp => tp !== '')) {
      return translatedParts.join(' / ');
    }
  }
  // 2. Dynamic regex matching: "N times minimum per shift" / "Minimum N times per shift" / "N vezes minimo por turno" / "Minimo N veces por turno"
  const minShiftMatch = clean.match(/^(?:minimo|minimum|min)?\s*(\d+)\s*(?:x|times|vezes|veces)?\s*(?:minimum|minimo|min)?\s*(?:per|por)\s*(?:shift|turno)$/i);
  if (minShiftMatch && (clean.includes('minimo') || clean.includes('minimum') || clean.includes('min'))) {
    const n = minShiftMatch[1];
    if (activeLang === 'en') return `Minimum ${n} times per shift`;
    if (activeLang === 'es') return `Mínimo ${n} veces por turno`;
    return `Mínimo ${n} vezes por turno`;
  }

  // 3. Dynamic regex matching: "N times per shift" / "N vezes por turno" / "N veces por turno"
  const shiftMatch = clean.match(/^(\d+)\s*(?:x|times|vezes|veces)?\s*(?:per|por)\s*(?:shift|turno)$/i);
  if (shiftMatch) {
    const n = shiftMatch[1];
    if (n === '1') {
      return activeLang === 'en' ? 'Once per shift' : activeLang === 'es' ? 'Una vez por turno' : 'Uma vez por turno';
    } else if (n === '2') {
      return activeLang === 'en' ? 'Twice per shift' : activeLang === 'es' ? 'Dos veces por turno' : 'Duas vezes por turno';
    } else if (n === '3') {
      return activeLang === 'en' ? 'Three times per shift' : activeLang === 'es' ? 'Tres veces por turno' : 'Três vezes por turno';
    } else {
      return activeLang === 'en' ? `${n} times per shift` : activeLang === 'es' ? `${n} veces por turno` : `${n} vezes por turno`;
    }
  }

  // 3b. Dynamic regex matching: "N times a week" / "N vezes por semana" / "N veces por semana"
  const weekMatch = clean.match(/^(\d+)\s*(?:x|times|vezes|veces)?\s*(?:a|per|por|na|a la)?\s*(?:week|semana)$/i);
  if (weekMatch) {
    const n = weekMatch[1];
    if (n === '1') {
      return activeLang === 'en' ? 'Once a week' : activeLang === 'es' ? 'Una vez por semana' : 'Uma vez por semana';
    } else if (n === '2') {
      return activeLang === 'en' ? 'Twice a week' : activeLang === 'es' ? 'Dos veces por semana' : 'Duas vezes por semana';
    } else if (n === '3') {
      return activeLang === 'en' ? 'Three times a week' : activeLang === 'es' ? 'Tres veces por semana' : 'Três vezes por semana';
    } else {
      return activeLang === 'en' ? `${n} times a week` : activeLang === 'es' ? `${n} veces por semana` : `${n} vezes por semana`;
    }
  }

  // 3c. Dynamic regex matching: "N times a month" / "N vezes por mês" / "N veces al mes"
  const monthMatch = clean.match(/^(\d+)\s*(?:x|times|vezes|veces)?\s*(?:a|per|por|no|al)?\s*(?:month|mes|mês)$/i);
  if (monthMatch) {
    const n = monthMatch[1];
    if (n === '1') {
      return activeLang === 'en' ? 'Once a month' : activeLang === 'es' ? 'Una vez al mes' : 'Uma vez por mês';
    } else if (n === '2') {
      return activeLang === 'en' ? 'Twice a month' : activeLang === 'es' ? 'Dos veces al mes' : 'Duas vezes por mês';
    } else if (n === '3') {
      return activeLang === 'en' ? 'Three times a month' : activeLang === 'es' ? 'Tres veces al mes' : 'Três vezes por mês';
    } else {
      return activeLang === 'en' ? `${n} times a month` : activeLang === 'es' ? `${n} veces al mes` : `${n} vezes por mês`;
    }
  }

  // 4. Dynamic regex matching: "Every N hours" / "A cada N horas" / "Cada N horas"
  const hoursMatch = clean.match(/^(?:a cada|every|cada|de)\s+(\d+)\s*(?:em\s+\d+\s*)?(?:horas|hours|h)$/i);
  if (hoursMatch) {
    const n = hoursMatch[1];
    if (activeLang === 'en') return `Every ${n} hours`;
    if (activeLang === 'es') return `Cada ${n} horas`;
    return `A cada ${n} horas`;
  }

  // 5. Dynamic regex matching: "Every N days" / "A cada N dias" / "Cada N días"
  const daysMatch = clean.match(/^(?:a cada|every|cada|de)\s+(\d+)\s*(?:dias|days|d)$/i);
  if (daysMatch) {
    const n = daysMatch[1];
    if (activeLang === 'en') return `Every ${n} days`;
    if (activeLang === 'es') return `Cada ${n} días`;
    return `A cada ${n} dias`;
  }

  // 6. Dynamic regex matching: "Every N minutes" / "A cada N minutos" / "Cada N minutos"
  const minsMatch = clean.match(/^(?:a cada|every|cada)\s+(\d+)\s*(?:minutos|minutes|min)$/i);
  if (minsMatch) {
    const n = minsMatch[1];
    if (activeLang === 'en') return `Every ${n} minutes`;
    if (activeLang === 'es') return `Cada ${n} minutos`;
    return `A cada ${n} minutos`;
  }

  // 7. Dynamic day mapping (e.g., "Wednesday through Sunday", "Quarta a Domingo", "Wednesday to Sunday")
  const dayLookup: Record<string, { pt: string; en: string; es: string }> = {
    'monday': { pt: 'Segunda', en: 'Monday', es: 'Lunes' },
    'mon': { pt: 'Segunda', en: 'Monday', es: 'Lunes' },
    'segunda': { pt: 'Segunda', en: 'Monday', es: 'Lunes' },
    'segunda-feira': { pt: 'Segunda', en: 'Monday', es: 'Lunes' },
    'lunes': { pt: 'Segunda', en: 'Monday', es: 'Lunes' },

    'tuesday': { pt: 'Terça', en: 'Tuesday', es: 'Martes' },
    'tue': { pt: 'Terça', en: 'Tuesday', es: 'Martes' },
    'tues': { pt: 'Terça', en: 'Tuesday', es: 'Martes' },
    'terca': { pt: 'Terça', en: 'Tuesday', es: 'Martes' },
    'terca-feira': { pt: 'Terça', en: 'Tuesday', es: 'Martes' },
    'martes': { pt: 'Terça', en: 'Tuesday', es: 'Martes' },

    'wednesday': { pt: 'Quarta', en: 'Wednesday', es: 'Miércoles' },
    'wed': { pt: 'Quarta', en: 'Wednesday', es: 'Miércoles' },
    'wednesdays': { pt: 'Quarta', en: 'Wednesday', es: 'Miércoles' },
    'quarta': { pt: 'Quarta', en: 'Wednesday', es: 'Miércoles' },
    'quarta-feira': { pt: 'Quarta', en: 'Wednesday', es: 'Miércoles' },
    'miercoles': { pt: 'Quarta', en: 'Wednesday', es: 'Miércoles' },

    'thursday': { pt: 'Quinta', en: 'Thursday', es: 'Jueves' },
    'thu': { pt: 'Quinta', en: 'Thursday', es: 'Jueves' },
    'thurs': { pt: 'Quinta', en: 'Thursday', es: 'Jueves' },
    'quinta': { pt: 'Quinta', en: 'Thursday', es: 'Jueves' },
    'quinta-feira': { pt: 'Quinta', en: 'Thursday', es: 'Jueves' },
    'jueves': { pt: 'Quinta', en: 'Thursday', es: 'Jueves' },

    'friday': { pt: 'Sexta', en: 'Friday', es: 'Viernes' },
    'fri': { pt: 'Sexta', en: 'Friday', es: 'Viernes' },
    'sexta': { pt: 'Sexta', en: 'Friday', es: 'Viernes' },
    'sexta-feira': { pt: 'Sexta', en: 'Friday', es: 'Viernes' },
    'viernes': { pt: 'Sexta', en: 'Friday', es: 'Viernes' },

    'saturday': { pt: 'Sábado', en: 'Saturday', es: 'Sábado' },
    'sat': { pt: 'Sábado', en: 'Saturday', es: 'Sábado' },
    'saturdays': { pt: 'Sábado', en: 'Saturday', es: 'Sábado' },
    'sabado': { pt: 'Sábado', en: 'Saturday', es: 'Sábado' },

    'sunday': { pt: 'Domingo', en: 'Sunday', es: 'Domingo' },
    'sun': { pt: 'Domingo', en: 'Sunday', es: 'Domingo' },
    'sundays': { pt: 'Domingo', en: 'Sunday', es: 'Domingo' },
    'domingo': { pt: 'Domingo', en: 'Sunday', es: 'Domingo' },
  };

  const dayRangeMatch = clean.match(/^(?:de\s+)?([a-z\-]+)\s+(?:through|thru|to|until|a|ate|hasta|-|–)\s+([a-z\-]+)$/i);
  if (dayRangeMatch) {
    const day1Key = dayRangeMatch[1].toLowerCase();
    const day2Key = dayRangeMatch[2].toLowerCase();
    const d1 = dayLookup[day1Key];
    const d2 = dayLookup[day2Key];
    if (d1 && d2) {
      if (activeLang === 'en') return `${d1.en} through ${d2.en}`;
      if (activeLang === 'es') return `${d1.es} a ${d2.es}`;
      return `${d1.pt} a ${d2.pt}`;
    }
  }

  // Single day check
  const singleDay = dayLookup[clean];
  if (singleDay) {
    return singleDay[activeLang];
  }

  // 8. Dynamic regex matching: "Daily at HH:MM" / "Diário às HH:MM" / "Diario a las HH:MM"
  const timeMatch = clean.match(/^(?:diario|diaria|daily)\s+(?:as|at|a las)\s+(.+)$/i);
  if (timeMatch) {
    const timeStr = timeMatch[1];
    if (activeLang === 'en') return `Daily at ${timeStr}`;
    if (activeLang === 'es') return `Diario a las ${timeStr}`;
    return `Diário às ${timeStr}`;
  }

  // 9. Compound frequency fallback (e.g. "Semanal / Sob Demanda", "Weekly / On-demand", etc.)
  if (rawClean.includes('/')) {
    const parts = rawClean.split('/');
    const translatedParts = parts.map(p => getLocalizedFrequency(p.trim(), activeLang));
    if (translatedParts.length > 0) {
      return translatedParts.join(' / ');
    }
  }

  return rawClean;
};
