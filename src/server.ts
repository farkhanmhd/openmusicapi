import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import ClientError from './exceptions/ClientError';

import albums from './api/albums';
import AlbumValidator from './validator/albums';
import AlbumsService from './services/postgres/AlbumsService';

import songs from './api/songs';
import SongValidator from './validator/songs';
import SongsService from './services/postgres/SongsService';

import users from './api/users';
import UsersValidator from './validator/users';
import UsersService from './services/postgres/UsersService';

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext(
    'onPreResponse',
    (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { response } = request;

      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      }

      return h.continue;
    }
  );

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
