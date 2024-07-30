interface ISong {
  id: string;
  title: string;
  year: number;
  genre: string;
  performer: string;
  duration?: number;
  albumId?: string;
}

interface ISongPayload {
  title: string;
  year: number;
  genre: string;
  performer: string;
  duration?: number;
  albumId?: string;
}

interface ISongAlbum {
  id: string;
  title: string;
  performer: string;
}

interface IAlbum {
  id: string;
  name: string;
  year: number;
  songs: ISongAlbum[];
}

interface IAlbumPayload {
  name: string;
  year: number;
}

export { ISong, ISongPayload, ISongAlbum, IAlbum, IAlbumPayload };
