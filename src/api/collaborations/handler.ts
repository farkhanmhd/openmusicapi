import { Request, ResponseToolkit } from '@hapi/hapi';
import CollaboratiionsService from 'src/services/postgres/CollaborationsService';
import PlaylistsServices from 'src/services/postgres/PlaylistsServices';
import CollaborationsValidator from 'src/validator/collaborations';

export default class CollaborationsHandler {
  private _collaborationsService: CollaboratiionsService;

  private _playlistsService: PlaylistsServices;

  private _validator: typeof CollaborationsValidator;

  constructor(
    collaborationsService: CollaboratiionsService,
    playlistsService: PlaylistsServices,
    validator: typeof CollaborationsValidator
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request: Request, h: ResponseToolkit) {
    this._validator.validateCollaborationPayload(
      request.payload as { playlistId: string; userId: string }
    );

    const { id: credentialsId } = request.auth.credentials as { id: string };

    const { playlistId, userId } = request.payload as {
      playlistId: string;
      userId: string;
    };

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialsId
    );
    await this._collaborationsService.verifyCollaboratorExist(userId);

    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Collaboration has been added',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request: Request) {
    this._validator.validateCollaborationPayload(
      request.payload as { playlistId: string; userId: string }
    );

    const { id: credentialsId } = request.auth.credentials as { id: string };
    const { playlistId, userId } = request.payload as {
      playlistId: string;
      userId: string;
    };

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialsId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaboration has been deleted',
    };
  }
}
