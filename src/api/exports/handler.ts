import { Request, ResponseToolkit } from '@hapi/hapi';
import ProducerService from 'src/services/rabbitmq/ProducerService';
import PlaylistsServices from 'src/services/postgres/PlaylistsServices';
import Exportsvalidator from 'src/validator/exports';
import NotFoundError from '../../exceptions/NotFoundError';

export default class ExportsHandler {
  private _service: typeof ProducerService;

  private _playlistsService: PlaylistsServices;

  private _validator: typeof Exportsvalidator;

  constructor(
    service: typeof ProducerService,
    playlistsService: PlaylistsServices,
    validator: typeof Exportsvalidator
  ) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportSongHandler = this.postExportSongHandler.bind(this);
  }

  async postExportSongHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateExportSongPayload(
      request.payload as { targetEmail: string }
    );

    const { id: credentialsId } = request.auth.credentials as { id: string };

    const { targetEmail } = request.payload as { targetEmail: string };

    const { playlistId } = request.params;

    if (!playlistId) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialsId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._service.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });

    response.code(201);
    return response;
  }
}
