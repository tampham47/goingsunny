import Express from 'express';
import path from 'path';
import compression from 'compression';
import clearRequireCacheOnChange from './lib/clearRequireCacheOnChange';
import passportFacebook from './middlewares/facebook';


let server = new Express();
let port = process.env.PORT || 3000;

server.use(compression());

if (process.env.NODE_ENV === 'production') {
  server.use(Express.static(path.join(__dirname, '..', 'dist/public')));
} else {
  server.use('/assets', Express.static(path.join(__dirname, '..', 'app/assets')))
  server.use(Express.static(path.join(__dirname, '..', 'dist')))

  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require(path.join(__dirname, '..', 'webpack.config'))
  const webpack = require('webpack')
  const compiler = webpack(webpackConfig)

  server.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
    stats: {
      colors: true,
      hash: true,
      timings: true,
      chunks: false
    }
  }))
  server.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr'
  }))

  clearRequireCacheOnChange({ rootDir: path.join(__dirname, '..') })
}

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// init passport by passing the instance of express
passportFacebook(server);

server.get('*', (req, res, next) => {
  require('./middlewares/universalRenderer').default(req, res, next);
});
server.use((err, req, res, next)=> {
  console.log(err.stack);
  // TODO report error here or do some further handlings
  res.status(500).send("something went wrong...");
});

console.log(`Server is listening to port: ${port}`);
server.listen(port);
