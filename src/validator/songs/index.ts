import InvariantError from 'src/exceptions/InvariantError';
import { ISongPayload } from 'src/types';
import SongPayloadSchema from './schema';

const SongValidator = {
  validateSongPayload: (payload: ISongPayload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongValidator;
