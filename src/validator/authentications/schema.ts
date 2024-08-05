import Joi from 'joi';

export const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const putAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const DeleteAuthenticationPayloadSChema = Joi.object({
  refreshToken: Joi.string().required(),
});
