import { Server, ServerRoute } from '@hapi/hapi';
import UsersService from 'src/services/postgres/UsersService';
import UsersValidator from 'src/validator/users';
import UsersHandler from './handler';
import routes from './routes';

const users = {
  name: 'users',
  version: '1.0.0',
  register: async (
    server: Server,
    {
      service,
      validator,
    }: { service: UsersService; validator: typeof UsersValidator }
  ) => {
    const usersHandler = new UsersHandler(service, validator);
    server.route(routes(usersHandler) as ServerRoute[]);
  },
};

export default users;
