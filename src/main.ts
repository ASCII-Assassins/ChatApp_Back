import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        credentials: true,
      },
      allowEIO3: true,
      transport: ['websocket'],
    });

    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); 

  // Utiliser l'adaptateur personnalisé
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(3000);
  console.log('Application is running on:', await app.getUrl());
}
bootstrap();