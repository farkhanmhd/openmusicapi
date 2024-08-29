import { Server, ServerRoute } from '@hapi/hapi';
import StorageService from 'src/services/S3/StorageService';
import AlbumsService from 'src/services/postgres/AlbumsService';
import UploadsValidator from 'src/validator/uploads';
import UploadsHandler from './handler';
import routes from './routes';

const uploads = {
  name: 'uploads',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      albumsService,
      validator,
    }: {
      service: StorageService;
      albumsService: AlbumsService;
      validator: typeof UploadsValidator;
    }
  ) => {
    const uploadsHandler = new UploadsHandler(
      service,
      albumsService,
      validator
    );
    server.route(routes(uploadsHandler) as ServerRoute[]);
  },
};

export default uploads;
