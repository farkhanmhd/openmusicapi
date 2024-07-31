import { Request, ResponseToolkit } from '@hapi/hapi';
import SongsService from 'src/services/postgres/SongsService';
import { ISongPayload } from 'src/types';
import SongValidator from 'src/validator/songs';

export default class SongsHandler {
  private _service;

  private _validator;

  constructor(service: SongsService, validator: typeof SongValidator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateSongPayload(request.payload as ISongPayload);
    const { title, year, genre, performer, duration, albumId } =
      request.payload as ISongPayload;
    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request: Request) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs(title, performer);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request: Request, h: ResponseToolkit) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return h.response({
      status: 'success',
      data: { song },
    });
  }

  async putSongByIdHandler(request: Request) {
    const { id } = request.params;
    this._validator.validateSongPayload(request.payload as ISongPayload);

    await this._service.editSongById(id, request.payload as ISongPayload);

    return {
      status: 'success',
      message: 'Song has been updated',
    };
  }

  async deleteSongByIdHandler(request: Request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song has been deleted',
    };
  }
}
