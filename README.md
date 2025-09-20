## Resposta do desafio 1, para fazer uma consulta na suposta tabela (assumindo os dados propostos na tabela)
```bash
SELECT
    p.name AS nome_do_professor,
    t.name AS titulo,
    SUM(
        (strftime('%s', cs.end_time) - strftime('%s', cs.start_time)) / 3600.0
    ) AS total_horas_comprometidas
FROM
    PROFESSOR p
JOIN
    TITLE t ON p.title_id = t.id
JOIN
    CLASS c ON p.id = c.professor_id
JOIN
    CLASS_SCHEDULE cs ON c.id = cs.class_id
GROUP BY
    p.id, p.name, t.name
ORDER BY
    total_horas_comprometidas DESC;
```


## Desafio 2

### Como rodar o projeto

- Pré-requisitos
    - Node.js 18+ (recomendado)
    - pnpm instalado globalmente

- Instalação
    - Instale as dependências:
        - pnpm install
- Rodando o servidor
	- Com Docker:
		  - docker compose up --build
    - Usando o script do projeto:
        - pnpm dev
    - Alternativa (caso seu ambiente não rode TypeScript com o script acima):
        - pnpm exec ts-node-dev --respawn src/index.ts

- Endpoints expostos (porta padrão 3000)
    - Aplicação: http://localhost:3000/
    - Swagger UI: http://localhost:3000/api-docs
    - OpenAPI (JSON): http://localhost:3000/openapi.json

Observação: ao iniciar, o projeto realiza um seeding no SQLite (arquivo em `prisma/banco.db`), limpando e populando dados de exemplo.

### Onde encontrar o API Docs (Swagger)

- Interface interativa: acesse `http://localhost:3000/api-docs` após subir o servidor.
- Documento bruto (OpenAPI 3.0.3): `http://localhost:3000/openapi.json`.
- A especificação está definida em `src/docs/openapi.ts`.

### Estrutura de pastas (resumo)

- `src/index.ts`: Inicialização do Express, aplicação de CORS/JSON, seeding do banco, montagem das rotas (`/grade`, `/openapi.json`, `/api-docs`).
- `src/controllers/grade.ts`: Router da rota de grade (GET `/`), retornando a estrutura final de grade.
- `src/services/agendar.ts`: Regra de negócio para gerar a grade completa a partir dos horários ocupados (preenche intervalos livres/ocupados por dia, sala e prédio).
- `src/database/db.ts`:
    - `seedDatabase()`: limpa e insere dados de exemplo nas tabelas.
    - `getHorariosOcupadosComPrisma()`: consulta os horários e carrega relações (prédio, sala, matéria) via Prisma.
- `src/docs/openapi.ts`: Especificação OpenAPI usada pelo Swagger UI.
- `src/types.ts`: Tipagens TypeScript para a estrutura da grade.
- `src/prisma.ts`: Instancia o `PrismaClient` gerado.
- `prisma/schema.prisma`: Modelos do banco e datasource (SQLite). As migrações ficam em `prisma/migrations/`.
- `src/generated/prisma/`: Cliente Prisma já gerado e versionado (importado por `src/prisma.ts`).

### Endpoint GET da grade (`/grade`)

- Método: GET
- URL: `http://localhost:3000/grade`
- Descrição: Gera e retorna a grade consolidada por prédio → sala → dia da semana, com blocos `OCUPADO` (aulas) e `LIVRE` (intervalos entre aulas) dentro do período letivo.
- Respostas:
    - 200 OK: `{ "result": GradeFinal }`
    - 500 Erro: `{ "error": string }`

Estrutura de `GradeFinal`:

```
{
    [nomePredio: string]: {
        [nomeSala: string]: {
            [diaDaSemana: string]: Array<{
                status: 'OCUPADO' | 'LIVRE';
                inicio: string; // HH:mm
                fim: string;    // HH:mm
                materia?: string; // somente quando OCUPADO
            }>
        }
    }
}
```

Dias da semana usados na resposta: `Segunda-feira`, `Terça-feira`, `Quarta-feira`, `Quinta-feira`, `Sexta-feira`.

Exemplo (resumo) de resposta 200:

```json
{
    "result": {
        "Prédio Principal": {
            "Sala 101": {
                "Segunda-feira": [
                    { "status": "OCUPADO", "inicio": "08:00", "fim": "10:00", "materia": "Cálculo com Geometria Analítica" },
                    { "status": "OCUPADO", "inicio": "10:00", "fim": "12:00", "materia": "Comunicação e Expressão" },
                    { "status": "LIVRE",   "inicio": "12:00", "fim": "22:00" }
                ],
                "Quarta-feira": [
                    { "status": "LIVRE",   "inicio": "08:00", "fim": "14:00" },
                    { "status": "OCUPADO", "inicio": "14:00", "fim": "16:00", "materia": "Cálculo com Geometria Analítica" },
                    { "status": "LIVRE",   "inicio": "16:00", "fim": "22:00" }
                ]
            },
            "Sala 102": {
                "Terça-feira": [
                    { "status": "LIVRE",   "inicio": "08:00", "fim": "09:00" },
                    { "status": "OCUPADO", "inicio": "09:00", "fim": "11:00", "materia": "Comunicação e Expressão" },
                    { "status": "LIVRE",   "inicio": "11:00", "fim": "22:00" }
                ]
            }
        }
    }
}
```

Esses dados de exemplo são compatíveis com o seeding aplicado em `seedDatabase()`.
