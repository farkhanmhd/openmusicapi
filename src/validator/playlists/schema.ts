import Joi from 'joi';

export const AddPlaylistSchema = Joi.object({
  name: Joi.string().required(),
});

export const PlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});
