import { prisma } from "../prisma";

export const seedDatabase = async () => {
	 console.log("Iniciando o seeding do banco de dados...");

  await prisma.classSchedule.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.professor.deleteMany({});
  await prisma.title.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.building.deleteMany({});
  await prisma.subject.deleteMany({});
  
  const building1 = await prisma.building.create({ data: { name: 'Prédio Principal' } });
  
  const room101 = await prisma.room.create({ data: { name: 'Sala 101', buildingId: building1.id } });
  const room102 = await prisma.room.create({ data: { name: 'Sala 102', buildingId: building1.id } });

  const titleMsc = await prisma.title.create({ data: { name: 'Mestre' } });
  const depCCOMP = await prisma.department.create({ data: { name: 'Ciência da Computação' } });
  
  const profGirafales = await prisma.professor.create({
    data: { name: 'Girafales', departmentId: depCCOMP.id, titleId: titleMsc.id },
  });

  const subjCalc = await prisma.subject.create({ data: { name: 'Cálculo com Geometria Analítica', code: 'MAT101' } });
  const subjPort = await prisma.subject.create({ data: { name: 'Comunicação e Expressão', code: 'LET101' } });
  
  const classCalc = await prisma.class.create({
    data: { year: 2025, semester: 1, subjectId: subjCalc.id, professorId: profGirafales.id },
  });
  const classPort = await prisma.class.create({
    data: { year: 2025, semester: 1, subjectId: subjPort.id, professorId: profGirafales.id },
  });

  await prisma.classSchedule.createMany({
    data: [
      { dayOfWeek: 'Segunda-feira', startTime: '08:00', endTime: '10:00', classId: classCalc.id, roomId: room101.id },
      { dayOfWeek: 'Segunda-feira', startTime: '10:00', endTime: '12:00', classId: classPort.id, roomId: room101.id },
      { dayOfWeek: 'Quarta-feira', startTime: '14:00', endTime: '16:00', classId: classCalc.id, roomId: room101.id },
      { dayOfWeek: 'Terça-feira', startTime: '09:00', endTime: '11:00', classId: classPort.id, roomId: room102.id },
    ]
  });

  console.log("Seeding completo.");
};

export const getHorariosOcupadosComPrisma = async () => {
    const schedules = await prisma.classSchedule.findMany({
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
