// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   // cette fonction sera executer apres que le module s'initialise :D on peux utiliser cette fonction pour  des taches initiales telle que l'initialisation 
// //   async onModuleInit() {
// //     await this.$connect();
// //   }
//  }



import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {}
