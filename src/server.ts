import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import Jwt from '@hapi/jwt';
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

import authentications from './api/authentications';
import AuthenticationsService from './services/postgres/AuthenticationsService';
import AuthenticationsValidator from './validator/authentications';
import TokenManager from './tokenize/TokenManager';

import playlists from './api/playlists';
import PlaylistsServices from './services/postgres/PlaylistsServices';
import PlaylistsValidator from './validator/playlists';

import collaborations from './api/collaborations';
import CollaboratiionsService from './services/postgres/CollaborationsService';
import CollaborationsValidator from './validator/collaborations';

import exportsPlugin from './api/exports';
import ProducerService from './services/rabbitmq/ProducerService';
import Exportsvalidator from './validator/exports';

import uploads from './api/uploads';
import StorageService from './services/S3/StorageService';
import UploadsValidator from './validator/uploads';

dotenv.config();

const init = async () => {
  const collaborationsService = new CollaboratiionsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const playlistsService = new PlaylistsServices(collaborationsService);
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService();

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
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts: { decoded: { payload: { id: string } } }) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        service: ProducerService,
        playlistsService,
        validator: Exportsvalidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext(
    'onPreResponse',
    (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { response } = request;

      if (response instanceof Error) {
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });

          newResponse.code(response.statusCode);
          return newResponse;
        }

        if (!response.isServer) return h.continue;

        const newResponse = h.response({
          status: 'error',
          message: 'Terjadi kegagalan pada server kami',
        });

        newResponse.code(500);
        return newResponse;
      }
      return h.continue;
    }
  );

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
