import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorLogger } from '../logger/error.logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly errorLogger = new ErrorLogger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    // Log détaillé de l'erreur
    this.errorLogger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack || 'No stack trace' : 'Unknown error',
      JSON.stringify(errorResponse),
    );

    response.status(status).send(errorResponse);
  }
} 