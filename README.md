## Resposta do desáfio 1, para fazer uma consulta na suposta tabela (assumindo os dados propostos na tabela)
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
