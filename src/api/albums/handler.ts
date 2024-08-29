import { Request, ResponseToolkit } from '@hapi/hapi';
import AlbumsService from 'src/services/postgres/AlbumsService';
import { IAlbumPayload } from 'src/types';
import AlbumValidator from 'src/validator/albums';

export default class AlbumsHandler {
  private _service;

  private _validator;

  constructor(service: AlbumsService, validator: typeof AlbumValidator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateAlbumPayload(request.payload as IAlbumPayload);
    const { name, year } = request.payload as IAlbumPayload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request: Request, h: ResponseToolkit) {
    const { id } = request.params;
    const fetchedAlbum = await this._service.getAlbumById(id);
    const album = {
      id: fetchedAlbum[0].id,
      name: fetchedAlbum[0].name,
      coverUrl: fetchedAlbum[0].cover,
      year: fetchedAlbum[0].year,
      songs: fetchedAlbum
        .filter((songs) => songs.song_id)
        .map((song) => ({
          id: song.song_id,
          title: song.title,
          performer: song.performer,
        })),
    };

    return h.response({
      status: 'success',
      data: { album },
    });
  }

  async putAlbumByIdHandler(request: Request) {
    this._validator.validateAlbumPayload(request.payload as IAlbumPayload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload as IAlbumPayload);

    return {
      status: 'success',
      message: 'Album has been updated',
    };
  }

  async deleteAlbumByIdHandler(request: Request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album has been deleted',
    };
  }

  async postAlbumLikeHandler(request: Request, h: ResponseToolkit) {
    const { id } = request.params;
    const { id: credentialsId } = request.auth.credentials as { id: string };

    await this._service.addAlbumLike(credentialsId, id);

    const response = h.response({
      status: 'success',
      message: 'Album has been liked',
    });

    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request: Request, h: ResponseToolkit) {
    const { id } = request.params;
    const { id: credentialsId } = request.auth.credentials as { id: string };

    await this._service.removeAlbumLike(credentialsId, id);

    const response = h.response({
      status: 'success',
      message: 'Album has been disliked',
    });

    return response;
  }

  async getAlbumLikesHandler(request: Request, h: ResponseToolkit) {
    const { id } = request.params;

    const likes = await this._service.getAlbumLikesCount(id);

    return h.response({
      status: 'success',
      data: { likes },
    });
  }
}
