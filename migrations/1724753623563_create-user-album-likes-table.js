exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"("id")',
      onDelete: 'CASCADE',
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"albums"("id")',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'unique_user_album', {
    unique: ['user_id', 'album_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'unique_user_album');
  pgm.dropTable('user_album_likes');
};
