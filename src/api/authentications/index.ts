import { Server, ServerRoute } from '@hapi/hapi';
import TokenManager from 'src/tokenize/TokenManager';
import AuthenticationsService from 'src/services/postgres/AuthenticationsService';
import AuthenticationsValidator from 'src/validator/authentications';
import UsersService from 'src/services/postgres/UsersService';
import AuthenticationHandler from './handler';
import routes from './routes';

const authentications = {
  name: 'authentications',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      authenticationsService,
      usersService,
      tokenManager,
      validator,
    }: {
      authenticationsService: AuthenticationsService;
      usersService: UsersService;
      tokenManager: typeof TokenManager;
      validator: typeof AuthenticationsValidator;
    }
  ) => {
    const authenticationsHandler = new AuthenticationHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    );

    server.route(routes(authenticationsHandler) as ServerRoute[]);
  },
};

export default authentications;
