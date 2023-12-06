import { NestFactory } from '@nestjs/core';
import { gameModule} from './server/gameserver.module';

// creation de la fonction 
async function bootstrap() {
  const app = await NestFactory.create(gameModule);  // creation d'une application nest en utilisant nest factory : 
  
  await app.listen(1338); // node utilise plus souvent 3000
}

// lencement de la fonction bootstrap 
bootstrap();
