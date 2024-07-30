import { ISong } from 'src/types';

const mapAlbum = ({
  album_id,
  name,
  year,
}: {
  album_id: string;
  name: string;
  year: number;
}) => ({
  id: album_id,
  name,
  year,
});

const mapSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}: ISong) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

export { mapAlbum, mapSong };
