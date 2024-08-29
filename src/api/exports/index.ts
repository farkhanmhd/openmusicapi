import { Server, ServerRoute } from '@hapi/hapi';
import Exportsvalidator from 'src/validator/exports';
import ProducerService from 'src/services/rabbitmq/ProducerService';
import PlaylistsServices from 'src/services/postgres/PlaylistsServices';
import ExportsHandler from './handler';
import routes from './routes';

const exportsPlugin = {
  name: 'exportsplugin',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      playlistsService,
      validator,
    }: {
      service: typeof ProducerService;
      playlistsService: PlaylistsServices;
      validator: typeof Exportsvalidator;
    }
  ) => {
    const exportsHandler = new ExportsHandler(
      service,
      playlistsService,
      validator
    );
    server.route(routes(exportsHandler) as ServerRoute[]);
  },
};

export default exportsPlugin;
