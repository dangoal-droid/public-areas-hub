import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables. Dynamic translations will run on fallback simulation.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

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
  { pt: 'superfícies', en: 'superficies', es: 'superficies' },

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

function translateString(text: string, targetLang: 'en' | 'pt' | 'es'): string {
  if (!text) return '';
  const clean = text.trim();
  if (!clean) return '';

  if (clean.includes(' - ')) {
    const lastDashIdx = clean.lastIndexOf(' - ');
    const parent = translateString(clean.substring(0, lastDashIdx), targetLang);
    const child = translateString(clean.substring(lastDashIdx + 3), targetLang);
    return `${parent} - ${child}`;
  }

  const cleanNoPunct = clean.replace(/[.,!?;:]+$/, '').trim();
  const trailingPunct = clean.substring(cleanNoPunct.length);

  for (const item of PHRASE_MAP) {
    if (
      item.pt.trim().toLowerCase() === clean.toLowerCase() ||
      item.en.trim().toLowerCase() === clean.toLowerCase() ||
      item.es.trim().toLowerCase() === clean.toLowerCase()
    ) {
      return item[targetLang];
    }
    if (cleanNoPunct && (
      item.pt.trim().toLowerCase() === cleanNoPunct.toLowerCase() ||
      item.en.trim().toLowerCase() === cleanNoPunct.toLowerCase() ||
      item.es.trim().toLowerCase() === cleanNoPunct.toLowerCase()
    )) {
      return item[targetLang] + trailingPunct;
    }
  }

  let result = text;
  const sortedPhrases = [...PHRASE_MAP].sort((a, b) => {
    const maxA = Math.max(a.pt.length, a.en.length, a.es.length);
    const maxB = Math.max(b.pt.length, b.en.length, b.es.length);
    return maxB - maxA;
  });

  for (const item of sortedPhrases) {
    for (const sourceLang of ['pt', 'en', 'es'] as const) {
      if (sourceLang === targetLang) continue;
      const sourcePhrase = item[sourceLang];
      if (!sourcePhrase || sourcePhrase.length < 2) continue;

      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapeRegExp(sourcePhrase)}\\b`, 'gi');
      if (pattern.test(result)) {
        result = result.replace(pattern, item[targetLang]);
      }
    }
  }

  return result;
}

function fallbackTranslate(title: string, description: string, bullets: string[]) {
  return {
    pt: {
      title: translateString(title, 'pt'),
      description: translateString(description, 'pt'),
      bullets: bullets.map(b => translateString(b, 'pt'))
    },
    en: {
      title: translateString(title, 'en'),
      description: translateString(description, 'en'),
      bullets: bullets.map(b => translateString(b, 'en'))
    },
    es: {
      title: translateString(title, 'es'),
      description: translateString(description, 'es'),
      bullets: bullets.map(b => translateString(b, 'es'))
    }
  };
}

// Translate endpoint using Gemini
app.post('/api/translate', async (req, res) => {
  const { title, description, bullets } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required for translation.' });
  }

  const ai = getGeminiClient();
  
  // Truncate input to reasonable lengths to prevent excessively large prompts/responses and truncation errors
  const safeTitle = typeof title === 'string' ? title.slice(0, 300) : String(title);
  const safeDescription = typeof description === 'string' ? description.slice(0, 1000) : '';
  const bulletsList = Array.isArray(bullets) 
    ? bullets.map(b => typeof b === 'string' ? b.slice(0, 300) : String(b)).slice(0, 20) 
    : [];

  if (!ai) {
    return res.json({
      translations: fallbackTranslate(safeTitle, safeDescription, bulletsList)
    });
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Translation request timed out')), 12000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Translate this operational cleaning task template. Detect its language, then translate all fields into en (English), pt (Portuguese), and es (Spanish). Make sure the field values match the structural context:
Title to translate: "${safeTitle}"
Description to translate: "${safeDescription}"
Bullets to translate:
${bulletsList.map((b, i) => `${i + 1}. "${b}"`).join('\n')}`,
      config: {
        systemInstruction: "You are a professional facilities management translator. Translate the given task title, description, and list of bullets into English, Portuguese, and Spanish. Keep the terminology highly accurate for industrial/commercial cleaners and hotel porters. You MUST translate all bullets in the exact order provided into each language (en, pt, es). If bulletsList is empty, return an empty array [] for bullets. Return a JSON adhering strictly to the schema.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            en: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['title', 'bullets']
            },
            pt: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['title', 'bullets']
            },
            es: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['title', 'bullets']
            }
          },
          required: ['en', 'pt', 'es']
        }
      }
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const resultText = response.text;
    if (resultText) {
      let cleaned = resultText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/i, '').replace(/```$/, '').trim();
      }
      
      try {
        const parsed = JSON.parse(cleaned);
        // Ensure bullets arrays are present in output
        if (parsed.pt && !parsed.pt.bullets) parsed.pt.bullets = [...bulletsList];
        if (parsed.en && !parsed.en.bullets) parsed.en.bullets = bulletsList.map(b => translateString(b, 'en'));
        if (parsed.es && !parsed.es.bullets) parsed.es.bullets = bulletsList.map(b => translateString(b, 'es'));
        return res.json({ translations: parsed });
      } catch (parseErr) {
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonSub = cleaned.substring(firstBrace, lastBrace + 1);
          try {
            const parsedSub = JSON.parse(jsonSub);
            if (parsedSub.pt && !parsedSub.pt.bullets) parsedSub.pt.bullets = [...bulletsList];
            if (parsedSub.en && !parsedSub.en.bullets) parsedSub.en.bullets = bulletsList.map(b => translateString(b, 'en'));
            if (parsedSub.es && !parsedSub.es.bullets) parsedSub.es.bullets = bulletsList.map(b => translateString(b, 'es'));
            return res.json({ translations: parsedSub });
          } catch (innerErr) {
            console.warn('Failed parsing extracted JSON substring:', innerErr);
          }
        }
        throw parseErr;
      }
    } else {
      throw new Error('Empty response from Gemini');
    }
  } catch (error: any) {
    console.warn('Gemini translation warning (using fallback translation):', error?.message || error);
    return res.json({
      translations: fallbackTranslate(safeTitle, safeDescription, bulletsList)
    });
  }
});

// Setup Vite or static serving based on environment
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer();
