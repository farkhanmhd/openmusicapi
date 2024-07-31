interface ISongPayload {
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration?: number;
  albumId?: string;
}

interface ISongAlbum {
  id: string;
  title: string;
  performer: string;
}

interface IAlbumPayload {
  name: string;
  year: number;
}

export { ISongPayload, ISongAlbum, IAlbumPayload };
