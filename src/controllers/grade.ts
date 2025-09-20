import express, { Request, Response } from 'express';
import { gerarGradeCompleta } from '../services/agendar';

const gradeRouter = express.Router();

gradeRouter.get('/', async (req: Request, res: Response) => {
   try {
   	const grade = await gerarGradeCompleta();
   	res.status(200).json({result: grade});
   } 
	catch (error) {
   	console.error('Erro ao gerar a grade:', error);
   	res.status(500).json({ error: 'Falha ao processar a solicitação.'});
   }
});

export default gradeRouter;