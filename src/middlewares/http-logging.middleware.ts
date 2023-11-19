import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const logger = new Logger('HTTP_REQUEST');
      const { method, originalUrl, ip } = req;
      const userAgent = req.get('user-agent') || '';

      const startTime = Date.now();

      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      statusCode < 400
        ? logger.log(
            `${method} ${originalUrl} from ${ip} User-Agent: ${userAgent} Status: ${statusCode} Duration: ${duration}ms`,
          )
        : logger.error(
            `${method} ${originalUrl} from ${ip} User-Agent: ${userAgent} Status: ${statusCode} Duration: ${duration}ms`,
          );
    });

    next();
  }
}
