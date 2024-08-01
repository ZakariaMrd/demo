import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import {
  connect,
  Connection,
  connection as mongooseConnection,
} from 'mongoose';
import { ObjectId } from 'mongodb';
import * as pluralize from 'pluralize';

interface Reference {
  att: string;
  model: string;
  isRequire: boolean;
}

@Injectable()
export class IsValidReferenceGuardV2 implements CanActivate {
  private referencesV2: Reference[] = [
    { att: 'definition.provider.ref', model: 'Provider', isRequire: false },
    { att: 'refs', model: 'Servicegroup', isRequire: false },
  ];
  private connection: Connection;

  constructor() {
    this.ensureDatabaseConnection();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    try {
      await this.ensureDatabaseConnection();

      for (const ref of this.referencesV2) {
        const targetPath = ref.att.split('.');
        const targetId = targetPath.reduce((acc, key) => acc && acc[key], body);

        if (!targetId) {
          if (ref.isRequire) {
            throw new BadRequestException(
              `Target ID is missing for attribute: ${ref.att}.`,
            );
          } else {
            continue;
          }
        }

        if (Array.isArray(targetId)) {
          for (const id of targetId) {
            if (!ObjectId.isValid(id)) {
              throw new BadRequestException(
                `Target ID ${id} in array ${ref.att} is not a valid ObjectId.`,
              );
            }
            const exists = await this.isExistInDatabase(ref.model, id);
            if (!exists) {
              throw new BadRequestException(
                `Referenced ID ${id} in array for attribute ${ref.att} does not exist.`,
              );
            }
          }
        } else {
          if (!ObjectId.isValid(targetId)) {
            throw new BadRequestException(
              `Target ID ${targetId} is not a valid ObjectId.`,
            );
          }

          const exists = await this.isExistInDatabase(ref.model, targetId);

          if (!exists) {
            throw new BadRequestException(
              `Referenced ID for attribute ${ref.att} does not exist.`,
            );
          }
        }
      }

      return true;
    } catch (error) {
      throw new BadRequestException(
        `Error validating references: ${error.message}`,
      );
    }
  }

  private async ensureDatabaseConnection(): Promise<void> {
    try {
      if (!this.connection) {
        await connect(`mongodb://localhost:27017/api`);
        this.connection = mongooseConnection;
      }
    } catch (error) {
      throw new BadRequestException(
        'Error connecting to the database: ' + error.message,
      );
    }
  }

  private async isExistInDatabase(model: string, id: string): Promise<boolean> {
    const collectionName = pluralize(model.toLowerCase());
    try {
      const collection = this.connection.collection(collectionName);
      const count = await collection.countDocuments(
        { _id: new ObjectId(id) },
        { limit: 1 },
      );
      return count > 0;
    } catch (error) {
      throw new BadRequestException('Error checking reference existence.');
    }
  }
}

export function IsValidRefsV2(): MethodDecorator {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const guard = new IsValidReferenceGuardV2();
      const context = {
        switchToHttp: () => ({ getRequest: () => ({ body: args[0] }) }),
      };
      if (!(await guard.canActivate(context as any))) {
        throw new BadRequestException(
          'Validation failed due to invalid references.',
        );
      }
      return originalMethod.apply(this, args);
    };
  };
}
