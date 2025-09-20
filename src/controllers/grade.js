"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agendar_1 = require("../services/agendar");
const gradeRouter = express_1.default.Router();
gradeRouter.get('/', async (req, res) => {
    try {
        const grade = await (0, agendar_1.gerarGradeCompleta)();
        res.status(200).json({ result: grade });
    }
    catch (error) {
        console.error('Erro ao gerar a grade:', error);
        res.status(500).json({ error: 'Falha ao processar a solicitação.' });
    }
});
exports.default = gradeRouter;
