import InvariantError from '../../exceptions/InvariantError';
import ImageHeadersSchema from './schema';

const UploadsValidator = {
  validateImageHeaders: (headers: { 'content-type': string }) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UploadsValidator;
