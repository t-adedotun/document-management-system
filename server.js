/* eslint-disable no-console */
import webpack from 'webpack';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import userRouter from './server/routes/UserRoutes';
import documentRouter from './server/routes/DocumentRoutes';
import searchRouter from './server/routes/SearchRoutes';
import roleRouter from './server/routes/RoleRoutes';
import config from './webpack.config';
import passport from './server/middlewares/Authentication';
import db from './server/models';

const compiler = webpack(config);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(WebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(WebpackHotMiddleware(compiler));

// remove trailing slash from url paths
app.use((req, res, next) => {
  if (req.path.length > 1 && /\/$/.test(req.path)) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

app.use('/api/users', userRouter);
app.use('/api/documents/', documentRouter);
app.use('/api/search', searchRouter);
app.use('/api/roles', roleRouter);

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
});

db.sequelize.sync().done(() => {
  app.listen(port, () => {
    console.log(`running server on port ${port}`);
  });
});

export default app;
