import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { ISongPayload } from 'src/types';
import { mapSong } from '../../utils/index';
import NotFoundError from '../../exceptions/NotFoundError';

export default class SongsService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
  }: ISongPayload) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING song_id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].song_id;
  }

  async getSongs(title: string, performer: string) {
    const query = {
      text: 'SELECT * FROM songs WHERE title ILIKE $1 or performer ILIKE $2',
      values: [title, performer],
    };
    const songs = await this._pool.query(query);
    const results = songs.rows.map((song) => ({
      id: song.song_id,
      title: song.title,
      performer: song.performer,
    }));

    return results;
  }

  async getSongById(id: string) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    console.log(result.rows);
    if (!result.rows.length) {
      throw new NotFoundError('Song not found');
    }

    return result.rows.map(mapSong)[0];
  }

  async editSongById(
    id: string,
    { title, year, performer, genre, duration, albumId }: ISongPayload
  ) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE song_id = $7',
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update song. Song not found');
    }
  }

  async deleteSongById(id: string) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete song. Song not found');
    }
  }
}
