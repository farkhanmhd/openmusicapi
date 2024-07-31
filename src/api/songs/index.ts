import { Server, ServerRoute } from '@hapi/hapi';
import SongsService from 'src/services/postgres/SongsService';
import SongValidator from 'src/validator/songs';
import SongsHandler from './handler';
import routes from './routes';

const songs = {
  name: 'songs',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: { service: SongsService; validator: typeof SongValidator }
  ) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler) as ServerRoute[]);
  },
};

export default songs;
