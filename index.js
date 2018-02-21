const express = require('express');
const next = require('next');
const _ = require('lodash');
const git = require('./src/git');
const path = require('path');
const logger = require('./src/logger');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const doPath = req => _.merge(req.params, { path: req.param(0).substr(1) });

  server.get('/repo/tree/:name/:ref*', (req, res) => {
    app.render(req, res, '/repo/tree', doPath(req));
  });

  server.use('/antd', express.static(path.join(__dirname, '/node_modules/antd/dist')));

  server.get('/api/v1/repo/tree/:name/:ref*', (req, res) => {
    const params = doPath(req);
    git.getLocalRepository(params.name)
      .then(repo => git.browse(repo, params.path))
      .then(data => res.json(data))
      .catch(e => logger.error(e));
  });

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    logger.info('> Ready on http://localhost:3000');
  });
});
