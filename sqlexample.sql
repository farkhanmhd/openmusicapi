SELECT a.album_id, a.name, a.year, s.song_id, s.title, s.performer
FROM albums a
JOIN songs s ON a.album_id = s.album_id
WHERE a.album_id = $1