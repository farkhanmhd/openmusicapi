import Joi from 'joi';

const ExportSongPayloadSchema = Joi.object({
  targetEmail: Joi.string()
    .email({ tlds: { allow: true } })
    .required(),
});

export default ExportSongPayloadSchema;
