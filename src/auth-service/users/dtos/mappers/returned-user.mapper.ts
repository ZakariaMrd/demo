import { User } from '../../schemas/users.schema';
import { ReturnedUserDto } from '../returned-user.dto';

export class ReturnedUserMapper {
  static mapToReturnedUserDto = (user: User): ReturnedUserDto => {
    return {
        _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      keyCloakUserId:user.keyCloakUserId,
      active: user.active,
      metaData: user.metaData,
    };
  };
}
