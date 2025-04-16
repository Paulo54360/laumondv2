import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Création de l'utilisateur Patrick Laumond
  const hashedPassword = await bcrypt.hash('Metaime2021', 10);
  const user = await prisma.user.upsert({
    where: { username: 'patrick.laumond' },
    update: {},
    create: {
      username: 'patrick.laumond',
      password: hashedPassword,
    },
  });

  console.log('Utilisateur créé:', user);

  // Création des catégories principales
  const categories = [
    {
      name: 'transcriptions',
      path: 'images/transcriptions',
    },
    {
      name: 'archetype',
      path: 'images/archetype',
    },
    {
      name: 'deploiement',
      path: 'images/deploiement',
    },
    {
      name: 'drawing',
      path: 'images/drawing',
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: { path: category.path },
      create: {
        name: category.name,
        path: category.path,
      },
    });
    console.log('Catégorie créée:', createdCategory);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 