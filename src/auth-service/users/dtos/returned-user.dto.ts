import { MetaData } from 'src/shared/entities/classes/meta-data.class';
export class ReturnedUserDto {
  _id: string;
  firstname: string;

  lastname: string;

  username: string;

  email: string;

  keyCloakUserId: string;

  active: boolean;
  
  metaData: MetaData;
}
