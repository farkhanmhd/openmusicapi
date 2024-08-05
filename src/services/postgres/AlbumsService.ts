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
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapAlbum);
  }

  async getAlbumById(id: string) {
    const query = {
      text: `SELECT albums.id, albums.name, albums.year, songs.id as song_id ,songs.title, songs.performer
        FROM albums
        FULL JOIN songs ON albums.id = songs.album_id
        WHERE albums.id = $1`,
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
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update album. Album not found');
    }
  }

  async deleteAlbumById(id: string) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to delete album. Album not found');
    }
  }
}
