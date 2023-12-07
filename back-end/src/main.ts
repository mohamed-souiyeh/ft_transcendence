import { NestFactory } from '@nestjs/core';
// import { Module } from '@nestjs/common';
// import { Controller } from '@nestjs/common';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { serverModule } from './server/gameserver.module';
// import { join } from 'path';
import { AppModule } from './app.module';
import { httpsOptions } from './https.options';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.enableCors({
    origin: true,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    credentials: true,
  });
  
  app.use(cookieParser());
  
  await app.listen(1337);
}

config({
  encoding: 'latin1',
  debug: false,
  override: false,
}); 

// console.log(process.env);
bootstrap();