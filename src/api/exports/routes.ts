import ExportsHandler from './handler';

const routes = (handler: ExportsHandler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportSongHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

export default routes;
