// to remove is not necessaire un the project

// prisma/seed.ts

import { PrismaClient } from '@prisma/client';


// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Création d'un utilisateur
  const user1 = await prisma.user.upsert({
    where: { username: 'Alice' },
    update: {},
    create: {
      passwordHash: 'password456',
      salt: '123',
      username: 'Alice',
      email: 'alice@example.com',
      // Ajoutez d'autres données d'utilisateur au besoin...
    },
  });

  // Création d'un autre utilisateur
  const user2 = await prisma.user.upsert({
    where: { username: 'bob' },
    update: {},
    create: {
      passwordHash: 'passwo56',
      salt: '123',
      score: 80,
      username: 'bob',
      email: 'bob@example.com',
      // Ajoutez d'autres données d'utilisateur au besoin...
    },
  });

  // Create a friendship between users
  await prisma.users_friends.upsert({
    where: {
      userId_friendId: {
        userId: user1.id,
        friendId: user2.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      friendId: user2.id,
      state: 'friends',
    },
  });

  // Création d'une conversation avec des messages
  const conversation = await prisma.conversation.upsert({
    where: { id: 1},
    update: {},
    create: {
      title: 'Discussion intéressante',
      participants: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
      messages: {
        create: [
          { content: 'Salut, comment ça va ?', senderId: user1.id },
          { content: 'Ça va bien, merci !', senderId: user2.id },
          // Ajoutez d'autres messages au besoin...
        ],
      },
    },
  });

  // Création d'un match entre les deux utilisateurs
  const match = await prisma.match.upsert({
    where: { id: 1 },
    update: {},
    create: {
      start_time: new Date(),
      end_time: new Date(),
      players: {
        create: [
          { playerId: user1.id, isWinner: true },
          { playerId: user2.id, isWinner: false },
        ],
      },
    },
  });

  // Ajoutez d'autres opérations d'upsert au besoin...

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// async function main() {
//   // Création d'un utilisateur
//   const user1 = await prisma.user.create({
//     data: {
//         passwordHash : await bcrypt.hash('password456', 10) , 
//         salt  : '123' , 
//       username: 'Alice',
//       email: 'alice@example.com',
//       // Ajoutez d'autres données d'utilisateur au besoin...
//     },
//   });

//   // Création d'un autre utilisateur
//   const user2 = await prisma.user.create({
//     data: {
//         passwordHash : await bcrypt.hash('passwo56', 10),
//         salt  : '123' ,
//         score : 80 ,
//       username: 'bob',
//       email: 'bob@example.com',
//       // Ajoutez d'autres données d'utilisateur au besoin...
//     },
//   });

//       // Create a friendship between users
//       await prisma.users_friends.create({
//         data: {
//           userId: user1.id,
//           friendId: user2.id,
//           state: 'friends',
//         },
//       });


//   // Création d'une conversation avec des messages
//   const conversation = await prisma.conversation.create({
//     data: {
//       title: 'Discussion intéressante',
//       participants: {
//         create: [
//           { userId: user1.id },
//           { userId: user2.id },
//         ],
//       },
//       messages: {
//         create: [
//           { content: 'Salut, comment ça va ?', senderId: user1.id },
//           { content: 'Ça va bien, merci !', senderId: user2.id},
//           // Ajoutez d'autres messages au besoin...
//         ],
//       },
//     },
//   });

//   // Création d'un match entre les deux utilisateurs
//   const match = await prisma.match.create({
//     data: {
//       start_time: new Date(),
//       end_time: new Date(),
//       players: {
//         create: [
//           { playerId: user1.id, isWinner: true },
//           { playerId: user2.id, isWinner: false },
//         ],
//       },
//     },
//   });

//   // Ajoutez d'autres opérations d'insertion au besoin...

//   console.log('Seed completed.');
// }

// main()
//   .catch((error) => {
//     throw error;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
