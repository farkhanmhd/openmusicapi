import { Server, ServerRoute } from '@hapi/hapi';
import AlbumsService from 'src/services/postgres/AlbumsService';
import AlbumValidator from 'src/validator/albums';
import AlbumsHandler from './handler';
import routes from './routes';

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: { service: AlbumsService; validator: typeof AlbumValidator }
  ) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    server.route(routes(albumsHandler) as ServerRoute[]);
  },
};

export default albums;
