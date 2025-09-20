"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openapiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Desafio SQL L2Code API',
        version: '1.0.0',
        description: 'Documentação da API para geração da grade de aulas.'
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local' }
    ],
    paths: {
        '/grade': {
            get: {
                summary: 'Obter grade completa',
                description: 'Gera e retorna a grade completa de aulas por prédio, sala e dia da semana.',
                tags: ['grade'],
                responses: {
                    '200': {
                        description: 'Grade gerada com sucesso',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        result: { $ref: '#/components/schemas/GradeFinal' }
                                    },
                                    required: ['result']
                                },
                                examples: {
                                    exemplo: {
                                        summary: 'Resposta de exemplo',
                                        value: {
                                            result: {
                                                'Prédio A': {
                                                    'Sala 101': {
                                                        Segunda: [
                                                            { status: 'OCUPADO', inicio: '08:00', fim: '10:00', materia: 'Cálculo I' },
                                                            { status: 'LIVRE', inicio: '10:00', fim: '12:00' }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro no servidor ao gerar a grade',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string' }
                                    },
                                    required: ['error']
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            EntradaGrade: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['OCUPADO', 'LIVRE'] },
                    inicio: { type: 'string', description: 'Hora de início (HH:mm)' },
                    fim: { type: 'string', description: 'Hora de fim (HH:mm)' },
                    materia: { type: 'string', nullable: true }
                },
                required: ['status', 'inicio', 'fim']
            },
            DiaDaSemana: {
                type: 'string',
                description: 'Dia da semana em português',
                enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
            },
            GradePorDia: {
                type: 'object',
                additionalProperties: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/EntradaGrade' }
                },
                description: 'Mapa de dia da semana para lista de entradas da grade'
            },
            GradePorSala: {
                type: 'object',
                additionalProperties: { $ref: '#/components/schemas/GradePorDia' },
                description: 'Mapa de nome da sala para grade por dia'
            },
            GradeFinal: {
                type: 'object',
                additionalProperties: { $ref: '#/components/schemas/GradePorSala' },
                description: 'Estrutura final da grade: prédio -> sala -> dia -> lista de entradas'
            }
        }
    }
};
exports.default = openapiSpec;
