import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription('The transactions API description')
    .setVersion('1.0')
    .addTag('transactions')
    .addServer('/api/v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for the transactions API
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
