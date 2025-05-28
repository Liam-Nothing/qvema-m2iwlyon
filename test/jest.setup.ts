import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

beforeAll(async () => {
  try {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Nettoyer la base de données avant les tests
    await prisma.$transaction([
      prisma.investment.deleteMany(),
      prisma.project.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Prisma:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (prisma) {
      // Nettoyer la base de données après les tests
      await prisma.$transaction([
        prisma.investment.deleteMany(),
        prisma.project.deleteMany(),
        prisma.user.deleteMany(),
      ]);
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Erreur lors de la fermeture de Prisma:', error);
    throw error;
  }
}); 