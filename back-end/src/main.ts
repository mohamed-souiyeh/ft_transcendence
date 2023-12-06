import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { Controller, Get} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import {serverModule} from './server/gameserver.module';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Controller()
export class gameController {
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../front-end/gamefrontend/build'),
    }),
    serverModule
  ]
  // providers: [gameLogicServer]
  // controllers: [gameController],
})
class gameModule {}

// creation de la fonction 
async function bootstrap() {
  const app = await NestFactory.create(gameModule);  // creation d'une application nest en utilisant nest factory : 
  
  
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  
  await app.listen(1338); // node utilise plus souvent 3000
}

// lencement de la fonction bootstrap 
bootstrap();
