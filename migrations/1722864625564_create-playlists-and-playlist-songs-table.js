exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"("id")',
      onDelete: 'CASCADE',
    },
  });

  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"playlists"("id")',
      onDelete: 'CASCADE',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"songs"("id")',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
  pgm.dropTable('playlists');
};
