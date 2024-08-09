import Joi from 'joi';

const CollaborationsSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

export default CollaborationsSchema;
