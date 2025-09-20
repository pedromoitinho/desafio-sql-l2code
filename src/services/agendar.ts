import { getHorariosOcupadosComPrisma } from '../database/db';
import { GradeFinal } from '../types'; 

const DIA_LETIVO_INICIO = "08:00";
const DIA_LETIVO_FIM = "22:00";
const DIAS_DA_SEMANA = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];

export const gerarGradeCompleta = async (): Promise<GradeFinal> => {
  const horariosOcupados = await getHorariosOcupadosComPrisma();

  const gradeAgrupada = horariosOcupados.reduce((acc, horario) => {
    const { nome_predio, nome_sala, day_of_week } = horario;
    if (!acc[nome_predio]) acc[nome_predio] = {};
    if (!acc[nome_predio][nome_sala]) acc[nome_predio][nome_sala] = {};
    if (!acc[nome_predio][nome_sala][day_of_week]) acc[nome_predio][nome_sala][day_of_week] = [];
    
    acc[nome_predio][nome_sala][day_of_week].push(horario);
    return acc;
  }, {} as any);

  const gradeFinal: GradeFinal = {};

  for (const predio in gradeAgrupada) {
    gradeFinal[predio] = {};
    for (const sala in gradeAgrupada[predio]) {
      gradeFinal[predio][sala] = {};
      for (const dia of DIAS_DA_SEMANA) {
        gradeFinal[predio][sala][dia] = [];
        const horariosDoDia = gradeAgrupada[predio][sala][dia] || [];

        let ultimoHorarioFim = DIA_LETIVO_INICIO;

        for (const horario of horariosDoDia) {
          if (horario.start_time > ultimoHorarioFim) {
            gradeFinal[predio][sala][dia].push({ status: 'LIVRE', inicio: ultimoHorarioFim, fim: horario.start_time });
          }
          gradeFinal[predio][sala][dia].push({ status: 'OCUPADO', inicio: horario.start_time, fim: horario.end_time, materia: horario.nome_materia });
          ultimoHorarioFim = horario.end_time;
        }

        if (ultimoHorarioFim < DIA_LETIVO_FIM) {
          gradeFinal[predio][sala][dia].push({ status: 'LIVRE', inicio: ultimoHorarioFim, fim: DIA_LETIVO_FIM });
        }
      }
    }
  }

  return gradeFinal;
};