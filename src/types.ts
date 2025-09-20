export interface OcupadoDoBanco {
  nome_predio: string;
  nome_sala: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  nome_materia: string;
}

export interface EntradaGrade {
  status: 'OCUPADO' | 'LIVRE';
  inicio: string;
  fim: string;
  materia?: string; 
}

export interface GradeFinal {
  [predio: string]: {
    [sala: string]: {
      [dia: string]: EntradaGrade[];
    };
  };
}