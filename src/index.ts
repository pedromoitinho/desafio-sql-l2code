import express, {Express, Request, Response} from "express";
import cors from "cors";
import { seedDatabase } from './database/db';
import gradeRouter from "./controllers/grade";
import * as swaggerUi from 'swagger-ui-express';
import openapiSpec from './docs/openapi';

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

const main  = async () => {
	await seedDatabase();
	app.use("/grade", gradeRouter);

	app.get('/openapi.json', (_req: Request, res: Response) => {
		res.json(openapiSpec);
	});

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

	app.listen(port, ()=> {
		try{
			console.log(`Servidor rodando em http://localhost:${port}/`);
		}
		catch(err){
			console.error(err);
		};
	});
};
main();
