import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      email: 'admin@empresa.com',
      password: hashedPassword,
      name: 'Administrador Master',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário administrador criado:', admin.email);

  // Criar usuário visualizador
  const viewerPassword = await bcrypt.hash('viewer123', 10);

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@empresa.com' },
    update: {},
    create: {
      email: 'viewer@empresa.com',
      password: viewerPassword,
      name: 'Usuário Visualizador',
      role: 'VIEWER',
    },
  });

  console.log('✅ Usuário visualizador criado:', viewer.email);

  // Criar funcionários de exemplo
  const employees = [
    {
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      position: 'Desenvolvedor Senior',
      department: 'TI',
      salary: 8000,
      hireDate: new Date('2023-01-15'),
    },
    {
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      position: 'Gerente de Projetos',
      department: 'TI',
      salary: 12000,
      hireDate: new Date('2022-06-01'),
    },
    {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      position: 'Analista de Marketing',
      department: 'Marketing',
      salary: 6000,
      hireDate: new Date('2023-03-10'),
    },
    {
      name: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      position: 'Designer UX/UI',
      department: 'Design',
      salary: 7000,
      hireDate: new Date('2023-02-20'),
    },
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: {},
      create: employee,
    });
  }

  console.log(`✅ ${employees.length} funcionários criados`);
  console.log('\n📋 Credenciais de acesso:');
  console.log('Admin: admin@empresa.com / admin123');
  console.log('Viewer: viewer@empresa.com / viewer123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
