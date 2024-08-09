import { Server, ServerRoute } from '@hapi/hapi';
import CollaboratiionsService from 'src/services/postgres/CollaborationsService';
import PlaylistsServices from 'src/services/postgres/PlaylistsServices';
import CollaborationsValidator from 'src/validator/collaborations';
import routes from './routes';
import CollaborationsHandler from './handler';

const collaborations = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      collaborationsService,
      playlistsService,
      validator,
    }: {
      collaborationsService: CollaboratiionsService;
      playlistsService: PlaylistsServices;
      validator: typeof CollaborationsValidator;
    }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      validator
    );
    server.route(routes(collaborationsHandler) as ServerRoute[]);
  },
};

export default collaborations;
