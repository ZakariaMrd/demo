import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const currentDate = new Date();

    const commonMetadata = {
      updatedBy: user?.preferred_username || 'unknown',
      updatedAt: currentDate,
    };

    switch (request.method) {
      case 'POST':
        request.body.metadata = {
          createdBy: user?.preferred_username || 'unknown',
          createdAt: currentDate,
          ...commonMetadata,
        };
        break;
      case 'PUT':
      case 'PATCH':
        request.body.metadata = {
          ...request.body.metadata,
          ...commonMetadata,
        };
        break;
    }

    return next.handle();
  }
}
