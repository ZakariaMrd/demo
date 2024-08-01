import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3100; // Use the PORT environment variable or default to 3000
  
  // Apply global configuration for validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      whitelist: true, // Strip away any properties that are not part of the DTO classes
      forbidNonWhitelisted: true, // Throw errors if any non-whitelisted properties are found
      transformOptions: {
        enableImplicitConversion: true, // Allows automatic type conversion (e.g., converting strings to numbers)
      },
    }),
  );

  await app.listen(port);
  console.log("App is on port :", port);
  
}
bootstrap();
