import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS
  app.enableCors({
    origin: 'http://localhost:5173', // URL du frontend Vite
    credentials: true,
  });
  
  // Ajout d'un préfixe global pour l'API
  app.setGlobalPrefix('api');
  
  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();