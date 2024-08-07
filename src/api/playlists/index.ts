import { Server, ServerRoute } from '@hapi/hapi';
import PlaylistsServices from 'src/services/postgres/PlaylistsServices';
import PlaylistsValidator from 'src/validator/playlists';
import PlaylistsHandler from './handler';
import routes from './routes';

const playlists = {
  name: 'playlists',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: {
      service: PlaylistsServices;
      validator: typeof PlaylistsValidator;
    }
  ) => {
    const playlistsHandler = new PlaylistsHandler(service, validator);
    server.route(routes(playlistsHandler) as ServerRoute[]);
  },
};

export default playlists;
