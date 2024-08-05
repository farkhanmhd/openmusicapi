import { IUser } from 'src/types';
import InvariantError from '../../exceptions/InvariantError';
import UserPayloadSchema from './schema';

const UsersValidator = {
  validateUserPayload: (payload: IUser) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UsersValidator;
