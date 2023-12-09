import { NestFactory } from '@nestjs/core';
// import { Module } from '@nestjs/common';
// import { Controller } from '@nestjs/common';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { serverModule } from './server/gameserver.module';
// import { join } from 'path';
import { AppModule } from './app.module';
// import { httpsOptions } from './https.options';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';


const swaggerOptions: SwaggerDocumentOptions = {
  
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    credentials: true,
  });
  
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  

  //NOTE - swagger config
  const config = new DocumentBuilder()
    .setTitle('purple rain API')
    .setDescription('an API description')
    .setVersion('1.0')
    .addTag('purple')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(1337);
}

config({
  encoding: 'latin1',
  debug: false,
  override: false,
}); 

// console.log(process.env);
bootstrap();
