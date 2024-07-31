import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { IAlbumPayload } from 'src/types';
import NotFoundError from '../../exceptions/NotFoundError';
import { mapAlbum } from '../../utils/index';

export default class AlbumsService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }: IAlbumPayload) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING album_id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    return result.rows[0].album_id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapAlbum);
  }

  async getAlbumById(id: string) {
    const query = {
      text: 'SELECT a.album_id, a.name, a.year, s.song_id, s.title, s.performer FROM albums a JOIN songs s ON a.album_id = s.album_id WHERE a.album_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album not found');
    }

    return result.rows;
  }

  async editAlbumById(id: string, { name, year }: IAlbumPayload) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE album_id = $3',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update album. Album not found');
    }
  }

  async deleteAlbumById(id: string) {
    const query = {
      text: 'DELETE FROM albums WHERE album_id = $1 RETURNING album_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Album not found');
    }
  }
}
