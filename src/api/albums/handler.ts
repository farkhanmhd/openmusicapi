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
}
