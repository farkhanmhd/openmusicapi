import { Request, ResponseToolkit } from '@hapi/hapi';
import UploadsValidator from 'src/validator/uploads';
import StorageService from 'src/services/S3/StorageService';
import AlbumsService from 'src/services/postgres/AlbumsService';

export default class UploadsHandler {
  private _service: StorageService;

  private _albumsService: AlbumsService;

  private _validator: typeof UploadsValidator;

  constructor(
    service: StorageService,
    albumsService: AlbumsService,
    validator: typeof UploadsValidator
  ) {
    this._service = service;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler(request: Request, h: ResponseToolkit) {
    const { cover }: any = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const fileLocation = await this._service.writeFile(cover, cover.hapi);

    await this._albumsService.addAlbumCover(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}
