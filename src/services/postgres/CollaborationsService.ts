import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';

export default class CollaboratiionsService {
  private _pool: Pool;

  constructor() {
    this._pool = new Pool();

    this.addCollaboration = this.addCollaboration.bind(this);
    this.deleteCollaboration = this.deleteCollaboration.bind(this);
    this.verifyCollaborator = this.verifyCollaborator.bind(this);
    this.verifyCollaboratorExist = this.verifyCollaboratorExist.bind(this);
  }

  async addCollaboration(playlistId: string, userId: string) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add collaboration');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId: string, userId: string) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete collaboration');
    }
  }

  async verifyCollaborator(playlistId: string, userId: string) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to verify collaboration');
    }
  }

  async verifyCollaboratorExist(userId: string) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User not found');
    }
  }
}
