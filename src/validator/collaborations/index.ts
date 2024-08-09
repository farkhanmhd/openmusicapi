import CollaborationsSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const CollaborationsValidator = {
  validateCollaborationPayload: (payload: {
    playlistId: string;
    userId: string;
  }) => {
    const validationResult = CollaborationsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default CollaborationsValidator;
