import express from 'express';
import path from 'path';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

const app = express();
const { NODE_ENV, SENTRY_DSN, SERVER_PORT = 8080 } = process.env;
const isProd = NODE_ENV === 'production';
const origin = isProd ? 'https://coverstory.page' : 'http://localhost';

if (isProd) {
  // Sentry.init({ dsn: SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());
}

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

export { app, router, origin, requireAuth, Sentry };

app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/', router);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

import './routes/auth';
import './routes/user';
import './routes/comment';
import './routes/question';
import './routes/vote'

if (isProd) {
  app.use(Sentry.Handlers.errorHandler());
}

app.listen(SERVER_PORT);
