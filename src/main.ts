import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { authDebugMiddleware, debugJwtToken } from './debug-auth';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting application...');
  
  try {
    logger.log('Connecting to database...');
    // Utiliser Express pour une meilleure compatibilité avec tous les middleware
    const app = await NestFactory.create(AppModule);
    logger.log('Database connection established!');

    // Configuration CORS
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Middleware de débogage d'authentification
    app.use(authDebugMiddleware);

    // Configuration des pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Configuration des intercepteurs
    app.useGlobalInterceptors(
      new TransformInterceptor(),
      new LoggingInterceptor(),
    );

    // Configuration des filtres d'exception
    app.useGlobalFilters(new HttpExceptionFilter());

    // Test manuel d'un token JWT
    logger.log('Testing JWT token verification...');
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJzdWIiOiIxMzE0NTI1Zi1mYjBjLTQzNTgtOTc4OS04ZmZiMGVkNzkxZTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDYwMDQwNzIsImV4cCI6MTc0NjAwNzY3Mn0.IZ_IrOtMncnYQATSvGNEuaQX_0fFLpNRDlXG_EwxQPk';
    debugJwtToken(testToken);

    // Configuration Swagger
    const config = new DocumentBuilder()
      .setTitle('API de mise en relation Entreprises & Investisseurs')
      .setDescription('API REST pour la mise en relation entre entrepreneurs et investisseurs')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Entrez votre token JWT sans le préfixe Bearer',
          in: 'header',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    
    // Options supplémentaires pour Swagger UI
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // Conserve l'autorisation entre les rechargements
        defaultModelsExpandDepth: 0, // Réduit l'encombrement
        docExpansion: 'list', // Affiche les endpoints sous forme de liste
        tagsSorter: 'alpha', // Trie les tags par ordre alphabétique
        operationsSorter: 'alpha', // Trie les opérations par ordre alphabétique
        tryItOutEnabled: true, // Active "Try it out" par défaut
        filter: true, // Permet la recherche
        withCredentials: true, // Important pour les cookies
      },
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application started successfully! Listening on port ${port}`);
    logger.log(`Database URL: ${process.env.DATABASE_URL?.substring(0, process.env.DATABASE_URL.indexOf('@') > 0 ? process.env.DATABASE_URL.indexOf('@') : 20)}...`);
    logger.log(`Swagger documentation available at: http://localhost:${port}/docs`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

void bootstrap();
