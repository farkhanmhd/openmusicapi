import { IAuthPayload } from 'src/types';
import {
  PostAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSChema,
} from './schema';
import InvariantError from '../../exceptions/InvariantError';

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload: IAuthPayload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload: { refreshToken: string }) => {
    const validationResult = putAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload: { refreshToken: string }) => {
    const validationResult =
      DeleteAuthenticationPayloadSChema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AuthenticationsValidator;
