import { IAlbumPayload } from 'src/types';
import AlbumPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const AlbumValidator = {
  validateAlbumPayload: (payload: IAlbumPayload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AlbumValidator;
