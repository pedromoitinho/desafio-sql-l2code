import express, {Express, Request, Response} from "express";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

app.listen(port, ()=> {
	try{
		console.log(`Servidor rodando em http://localhost:${port}/`);
	}
	catch(err){
		console.error(err);
	};
});