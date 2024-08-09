import { Request, ResponseToolkit } from '@hapi/hapi';
import PlaylistsServices from 'src/services/postgres/PlaylistsServices';
import PlaylistsValidator from 'src/validator/playlists';

export default class PlaylistsHandler {
  private _service: PlaylistsServices;

  private _validator: typeof PlaylistsValidator;

  constructor(
    service: PlaylistsServices,
    validator: typeof PlaylistsValidator
  ) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    this.getPlaylistActivitiesHandler =
      this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request: Request, h: ResponseToolkit) {
    const { id: credentialsId } = request.auth.credentials as { id: string };
    this._validator.validateAddPlaylistPayload(
      request.payload as { name: string }
    );

    const { name } = request.payload as { name: string };
    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialsId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist has been added',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request: Request) {
    const { id: credentialsId } = request.auth.credentials as { id: string };
    const playlists = await this._service.getPlaylists(credentialsId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request: Request) {
    const { id } = request.params;
    const { id: credentialsId } = request.auth.credentials as { id: string };

    await this._service.verifyPlaylistOwner(id, credentialsId);
    await this._service.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist has been deleted',
    };
  }

  async postPlaylistSongHandler(request: Request, h: ResponseToolkit) {
    this._validator.validatePlaylistSongSchema(
      request.payload as { songId: string }
    );
    const { id } = request.params;
    const { songId } = request.payload as { songId: string };
    const { id: credentialsId } = request.auth.credentials as { id: string };

    await this._service.verifySongExist(songId);
    await this._service.verifyPlaylistAccess(id, credentialsId);
    await this._service.addSongToPlaylist(id, songId);
    await this._service.addSongToPlaylistActivities(id, songId, credentialsId);

    const response = h.response({
      status: 'success',
      message: 'Song has been added to playlist',
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request: Request) {
    const { id } = request.params;
    const { id: credentialsId } = request.auth.credentials as { id: string };
    await this._service.verifyPlaylistAccess(id, credentialsId);

    const result = await this._service.getSongsFromPlaylist(id);

    const playlist = {
      id: result[0].id,
      name: result[0].name,
      username: result[0].username,
      songs: result.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      })),
    };

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request: Request) {
    this._validator.validatePlaylistSongSchema(
      request.payload as { songId: string }
    );
    const { id } = request.params;
    const { songId } = request.payload as { songId: string };
    const { id: credentialsId } = request.auth.credentials as { id: string };

    await this._service.verifyPlaylistAccess(id, credentialsId);

    await this._service.deleteSongFromPlaylist(songId);
    await this._service.deleteSongFromPlaylistActivities(
      id,
      songId,
      credentialsId
    );

    return {
      status: 'success',
      message: 'Song has been deleted from playlist',
    };
  }

  async getPlaylistActivitiesHandler(request: Request) {
    const { id: credentialsId } = request.auth.credentials as { id: string };
    const { id } = request.params;
    await this._service.verifyPlaylistAccess(id, credentialsId);
    const result = await this._service.getPlaylistActivities(id);
    const activities = {
      playlistId: result[0].playlist_id,
      activities: result.map((activity) => ({
        username: activity.username,
        title: activity.title,
        action: activity.action,
        time: activity.time,
      })),
    };

    return {
      status: 'success',
      data: activities,
    };
  }
}
