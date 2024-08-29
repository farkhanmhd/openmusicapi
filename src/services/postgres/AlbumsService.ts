import { nanoid } from 'nanoid';
import { Pool } from 'pg';
import { IAlbumPayload } from 'src/types';
import CacheService from '../redis/CacheService';
import NotFoundError from '../../exceptions/NotFoundError';
import ClientError from '../../exceptions/ClientError';
import { mapAlbum } from '../../utils/index';

export default class AlbumsService {
  private _pool: Pool;

  private _cacheService: CacheService;

  constructor(cacheService: CacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;

    this.addAlbum = this.addAlbum.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
    this.getAlbumById = this.getAlbumById.bind(this);
    this.editAlbumById = this.editAlbumById.bind(this);
    this.deleteAlbumById = this.deleteAlbumById.bind(this);
    this.addAlbumLike = this.addAlbumLike.bind(this);
    this.removeAlbumLike = this.removeAlbumLike.bind(this);
    this.getAlbumLikesCount = this.getAlbumLikesCount.bind(this);
  }

  async addAlbum({ name, year }: IAlbumPayload) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, null],
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
      text: `SELECT albums.id, albums.name, albums.year, albums.cover ,songs.id as song_id ,songs.title, songs.performer
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

  async addAlbumLike(userId: string, albumId: string) {
    const id = `album-like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    try {
      const result = await this._pool.query(query);
      await this._cacheService.delete(`album-${albumId}-likes`);
      return result.rows[0].id;
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ClientError('You have already liked this album');
      } else if (err.code === '23503') {
        throw new NotFoundError('Album not found');
      } else {
        throw err;
      }
    }
  }

  async removeAlbumLike(userId: string, albumId: string) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    try {
      await this._pool.query(query);
      await this._cacheService.delete(`album-${albumId}-likes`);
    } catch (err: any) {
      if (err.code === '23503') {
        throw new NotFoundError('Album not found');
      } else {
        throw err;
      }
    }
  }

  async getAlbumLikesCount(albumId: string) {
    try {
      const result = await this._cacheService.get(`album-${albumId}-likes`);
      return { likes: Number(result), fromCache: true };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Album not found');
      }

      const { count } = result.rows[0];
      await this._cacheService.set(`album-${albumId}-likes`, count);
      return { likes: Number(count), fromCache: false };
    }
  }

  async addAlbumCover(albumId: string, cover: string) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2',
      values: [cover, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update album. Album not found');
    }
  }
}
