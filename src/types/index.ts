export interface ISongPayload {
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration?: number;
  albumId?: string;
}

export interface ISongAlbum {
  id: string;
  title: string;
  performer: string;
}

export interface IAlbumPayload {
  name: string;
  year: number;
}

export interface IUser {
  username: string;
  password: string;
  fullname: string;
}

export interface IAuthPayload {
  username: string;
  password: string;
}
