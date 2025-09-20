"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHorariosOcupadosComPrisma = exports.seedDatabase = void 0;
const prisma_1 = require("../prisma");
const seedDatabase = async () => {
    console.log("Iniciando o seeding do banco de dados...");
    await prisma_1.prisma.classSchedule.deleteMany({});
    await prisma_1.prisma.class.deleteMany({});
    await prisma_1.prisma.professor.deleteMany({});
    await prisma_1.prisma.title.deleteMany({});
    await prisma_1.prisma.department.deleteMany({});
    await prisma_1.prisma.room.deleteMany({});
    await prisma_1.prisma.building.deleteMany({});
    await prisma_1.prisma.subject.deleteMany({});
    const building1 = await prisma_1.prisma.building.create({ data: { name: 'Prédio Principal' } });
    const room101 = await prisma_1.prisma.room.create({ data: { name: 'Sala 101', buildingId: building1.id } });
    const room102 = await prisma_1.prisma.room.create({ data: { name: 'Sala 102', buildingId: building1.id } });
    const titleMsc = await prisma_1.prisma.title.create({ data: { name: 'Mestre' } });
    const depCCOMP = await prisma_1.prisma.department.create({ data: { name: 'Ciência da Computação' } });
    const profGirafales = await prisma_1.prisma.professor.create({
        data: { name: 'Girafales', departmentId: depCCOMP.id, titleId: titleMsc.id },
    });
    const subjCalc = await prisma_1.prisma.subject.create({ data: { name: 'Cálculo com Geometria Analítica', code: 'MAT101' } });
    const subjPort = await prisma_1.prisma.subject.create({ data: { name: 'Comunicação e Expressão', code: 'LET101' } });
    const classCalc = await prisma_1.prisma.class.create({
        data: { year: 2025, semester: 1, subjectId: subjCalc.id, professorId: profGirafales.id },
    });
    const classPort = await prisma_1.prisma.class.create({
        data: { year: 2025, semester: 1, subjectId: subjPort.id, professorId: profGirafales.id },
    });
    await prisma_1.prisma.classSchedule.createMany({
        data: [
            { dayOfWeek: 'Segunda-feira', startTime: '08:00', endTime: '10:00', classId: classCalc.id, roomId: room101.id },
            { dayOfWeek: 'Segunda-feira', startTime: '10:00', endTime: '12:00', classId: classPort.id, roomId: room101.id },
            { dayOfWeek: 'Quarta-feira', startTime: '14:00', endTime: '16:00', classId: classCalc.id, roomId: room101.id },
            { dayOfWeek: 'Terça-feira', startTime: '09:00', endTime: '11:00', classId: classPort.id, roomId: room102.id },
        ]
    });
    console.log("Seeding completo.");
};
exports.seedDatabase = seedDatabase;
const getHorariosOcupadosComPrisma = async () => {
    const schedules = await prisma_1.prisma.classSchedule.findMany({
        orderBy: [
            { room: { building: { name: 'asc' } } },
            { room: { name: 'asc' } },
            { dayOfWeek: 'asc' },
            { startTime: 'asc' },
        ],
        include: {
            room: {
                include: {
                    building: true,
                },
            },
            class: {
                include: {
                    subject: true,
                },
            },
        },
    });
    return schedules.map(s => ({
        nome_predio: s.room.building.name,
        nome_sala: s.room.name,
        day_of_week: s.dayOfWeek,
        start_time: s.startTime,
        end_time: s.endTime,
        nome_materia: s.class.subject.name,
    }));
};
exports.getHorariosOcupadosComPrisma = getHorariosOcupadosComPrisma;
