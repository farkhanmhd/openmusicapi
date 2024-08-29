import ExportSongPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const Exportsvalidator = {
  validateExportSongPayload: (payload: { targetEmail: string }) => {
    const validationResult = ExportSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default Exportsvalidator;
