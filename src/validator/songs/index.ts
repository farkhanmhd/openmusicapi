import { ISongPayload } from 'src/types';
import SongPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const SongValidator = {
  validateSongPayload: (payload: ISongPayload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongValidator;
