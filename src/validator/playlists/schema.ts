import Joi from 'joi';

export const AddPlaylistSchema = Joi.object({
  name: Joi.string().required(),
});

export const AddSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

export const DeletePlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});
