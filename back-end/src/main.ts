import { NestFactory } from '@nestjs/core';
// import { Module } from '@nestjs/common';
// import { Controller } from '@nestjs/common';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { serverModule } from './server/gameserver.module';
// import { join } from 'path';
import { AppModule } from './app.module';

// @Controller()
// export class gameController {}

// @Module({
//   imports: [
//     ServeStaticModule.forRoot({
//       rootPath: join(__dirname, '../../front-end/gamefrontend/build'),
//     }),
//     serverModule,
//   ],
//   // providers: [gameLogicServer]
//   // controllers: [gameController],
// })
// class gameModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(1337);
}

bootstrap();
