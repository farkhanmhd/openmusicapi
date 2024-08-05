const mapAlbum = ({
  id,
  name,
  year,
}: {
  id: string;
  name: string;
  year: number;
}) => ({
  id,
  name,
  year,
});

const mapSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}: {
  id: string;
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration: number;
  album_id: string;
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

export { mapAlbum, mapSong };
