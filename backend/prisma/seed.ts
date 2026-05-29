import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.aula.deleteMany();
  await prisma.disponibilidade.deleteMany();
  await prisma.disciplina.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.curso.deleteMany();

  // Criar Cursos
  const cursoInfomatica = await prisma.curso.create({
    data: {
      nome: 'Informática',
    },
  });

  const cursoEngenharia = await prisma.curso.create({
    data: {
      nome: 'Engenharia de Software',
    },
  });

  // Criar Disciplinas
  const discProgramacao = await prisma.disciplina.create({
    data: {
      nome: 'Programação',
      cursoId: cursoInfomatica.id,
    },
  });

  const discBancoDados = await prisma.disciplina.create({
    data: {
      nome: 'Banco de Dados',
      cursoId: cursoInfomatica.id,
    },
  });

  const discArquitetura = await prisma.disciplina.create({
    data: {
      nome: 'Arquitetura de Software',
      cursoId: cursoEngenharia.id,
    },
  });

  // Criar Professores
  const profJoao = await prisma.professor.create({
    data: {
      nome: 'João Silva',
    },
  });

  const profMaria = await prisma.professor.create({
    data: {
      nome: 'Maria Santos',
    },
  });

  const profPedro = await prisma.professor.create({
    data: {
      nome: 'Pedro Oliveira',
    },
  });

  // Criar Disponibilidades
  const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];

  // João disponível seg, ter, qua
  for (const dia of ['SEGUNDA', 'TERCA', 'QUARTA']) {
    await prisma.disponibilidade.create({
      data: {
        diaSemana: dia as any,
        disponivel: true,
        professorId: profJoao.id,
      },
    });
  }

  // João indisponível qui, sex
  for (const dia of ['QUINTA', 'SEXTA']) {
    await prisma.disponibilidade.create({
      data: {
        diaSemana: dia as any,
        disponivel: false,
        professorId: profJoao.id,
      },
    });
  }

  // Maria disponível todos os dias
  for (const dia of diasSemana) {
    await prisma.disponibilidade.create({
      data: {
        diaSemana: dia as any,
        disponivel: true,
        professorId: profMaria.id,
      },
    });
  }

  // Pedro disponível ter, qua, qui
  for (const dia of ['TERCA', 'QUARTA', 'QUINTA']) {
    await prisma.disponibilidade.create({
      data: {
        diaSemana: dia as any,
        disponivel: true,
        professorId: profPedro.id,
      },
    });
  }

  // Pedro indisponível seg, sex
  for (const dia of ['SEGUNDA', 'SEXTA']) {
    await prisma.disponibilidade.create({
      data: {
        diaSemana: dia as any,
        disponivel: false,
        professorId: profPedro.id,
      },
    });
  }

  // Criar algumas Aulas de exemplo
  await prisma.aula.create({
    data: {
      diaSemana: 'SEGUNDA' as any,
      professorId: profJoao.id,
      disciplinaId: discProgramacao.id,
      cursoId: cursoInfomatica.id,
    },
  });

  await prisma.aula.create({
    data: {
      diaSemana: 'TERCA' as any,
      professorId: profMaria.id,
      disciplinaId: discBancoDados.id,
      cursoId: cursoInfomatica.id,
    },
  });

  await prisma.aula.create({
    data: {
      diaSemana: 'QUARTA' as any,
      professorId: profPedro.id,
      disciplinaId: discArquitetura.id,
      cursoId: cursoEngenharia.id,
    },
  });

  console.log('✅ Seed completado com sucesso!');
  console.log('');
  console.log('Dados criados:');
  console.log(`- ${(await prisma.curso.count())} Cursos`);
  console.log(`- ${(await prisma.disciplina.count())} Disciplinas`);
  console.log(`- ${(await prisma.professor.count())} Professores`);
  console.log(`- ${(await prisma.disponibilidade.count())} Disponibilidades`);
  console.log(`- ${(await prisma.aula.count())} Aulas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
