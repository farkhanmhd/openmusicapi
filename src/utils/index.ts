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
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}: {
  song_id: string;
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration: number;
  album_id: string;
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

export { mapAlbum, mapSong };
