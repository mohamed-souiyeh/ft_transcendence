import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const achievementsData = [
    { name: 'First step', description: 'Welcome to the game', image: 'image1.jpg' },
    { name: 'First Game pong', description: 'congratulation', image: 'image1.jpg' }];

    for (const achievement of achievementsData) {
      await prisma.achievement.upsert({
        where: { 
          name: achievement.name 
        },
        update: {},
        create: achievement,
      });
    }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  