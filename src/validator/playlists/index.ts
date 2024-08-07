import {
  AddPlaylistSchema,
  AddSongToPlaylistSchema,
  DeletePlaylistSongSchema,
} from './schema';
import InvariantError from '../../exceptions/InvariantError';

const PlaylistsValidator = {
  validateAddPlaylistPayload: (payload: { name: string }) => {
    const validationResult = AddPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAddSongToPlaylistPayload: (payload: { songId: string }) => {
    const validationResult = AddSongToPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeletePlaylistSongPayload: (payload: { songId: string }) => {
    const validationResult = DeletePlaylistSongSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PlaylistsValidator;
