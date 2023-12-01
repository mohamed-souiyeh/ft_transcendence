import { NestFactory } from '@nestjs/core';
import { gameModule} from './server/gameserver.module';

async function bootstrap() {
  const app = await NestFactory.create(gameModule);
  app.enableCors();
  await app.listen(1337);
}

bootstrap();
