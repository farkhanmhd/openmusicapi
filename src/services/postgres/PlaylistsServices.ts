import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import NotFoundError from '../../exceptions/NotFoundError';
import AuthorizationError from '../../exceptions/AuthorizationError';

export default class PlaylistsServices {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();

    this.addPlaylist = this.addPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.getSongsFromPlaylist = this.getSongsFromPlaylist.bind(this);
    this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this);
    this.verifyPlaylistOwner = this.verifyPlaylistOwner.bind(this);
    this.verifySongExist = this.verifySongExist.bind(this);
    this.addSongToPlaylistActivities =
      this.addSongToPlaylistActivities.bind(this);
    this.deleteSongFromPlaylistActivities =
      this.deleteSongFromPlaylistActivities.bind(this);
  }

  async addPlaylist({ name, owner }: { name: string; owner: string }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getPlaylists(owner: string) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
         FROM playlists
         FULL JOIN users ON playlists.owner = users.id
         WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(id: string) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete playlist. Playlist not found');
    }
  }

  async addSongToPlaylist(playlistId: string, songId: string) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
  }

  async getSongsFromPlaylist(playlistId: string) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username, songs.id as song_id, songs.title, songs.performer
        FROM playlist_songs
        FULL JOIN songs ON playlist_songs.song_id = songs.id
        FULL JOIN playlists ON playlist_songs.playlist_id = playlists.id
        FULL JOIN users ON playlists.owner = users.id
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to get songs. Playlist not found');
    }

    return result.rows;
  }

  async deleteSongFromPlaylist(songId: string) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song. Song not found');
    }
  }

  async verifyPlaylistOwner(id: string, owner: string) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError(
        'You are not allowed to access this resource'
      );
    }
  }

  async verifySongExist(id: string) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }
  }

  async addSongToPlaylistActivities(
    playlistId: string,
    songId: string,
    userId: string
  ) {
    const id = `psa-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: `INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, userId, 'add', time],
    };

    await this._pool.query(query);
  }

  async deleteSongFromPlaylistActivities(
    playlistId: string,
    songId: string,
    userId: string
  ) {
    const id = `psa-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: `INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, userId, 'delete', time],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivities(playlistId: string) {
    const query = {
      text: `SELECT psa.playlist_id, u.username, s.title, psa.action, psa.time
        FROM playlist_song_activities psa
        FULL JOIN playlists p ON psa.playlist_id = p.id
        FULL JOIN users u ON psa.user_id = u.id
        FULL JOIN songs s ON psa.song_id = s.id
        WHERE psa.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Failed to get playlist activities. Playlist not found'
      );
    }

    return result.rows;
  }
}
