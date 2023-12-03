import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { ThrottlerExceptionFilter } from '../utils/filters/throttler-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// import helmet from 'helmet';
// import * as csurf from 'csurf';

async function bootstrap() {
  // Create a NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Set the global API prefix to 'api'
  app.setGlobalPrefix('api');

  // Enable API versioning using URI versioning type
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable Cross-Origin Resource Sharing (CORS) - Note: Be cautious with CORS, as it may pose security risks
  app.enableCors();

  // Apply global validation for incoming requests using ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only allow properties that are decorated with @ApiModelProperty()
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      validateCustomDecorators: true, // Enable custom validation decorators
    }),
  );

  // Apply a global exception filter to handle rate limiting/throttling exceptions
  app.useGlobalFilters(new ThrottlerExceptionFilter());

  // Configure API documentation using Swagger
  const config = new DocumentBuilder()
    .setTitle('Samyaza API') // Set the API title
    .setDescription('Movie App Samyaza') // Set the API description
    .setVersion('1.0') // Set the API version
    .addTag('movies api platform') // Add a tag to categorize API endpoints
    .build();

  // Generate API documentation
  const document = SwaggerModule.createDocument(app, config);

  // Set up the Swagger UI at the 'api' endpoint to serve API documentation
  SwaggerModule.setup('api', app, document);

  // Start the application and listen on the specified port defined in the environment variables
  await app.listen(process.env.PORT);
}
bootstrap();
