import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { Request, Response, Errback } from 'express';
import { v4 as uuid } from 'uuid';
import { UserDoc } from '../models';
import { router, Sentry } from '../index';
import pg from '../pg';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { TOKEN_SECRET = '' } = process.env;

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

const passwordStrategy = new LocalStrategy(
  async (user_name, password, done) => {
    let user;

    try {
      user = await pg
        .first('*')
        .from('users')
        .where({ user_name });
    } catch (error) {
      done(error);
    }

    if (!user) {
      done(null, false);
      return;
    }

    try {
      const verified = await bcrypt.compare(password, _.get(user, 'password'));

      if (verified) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  },
);

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: TOKEN_SECRET,
  },
  async (userPayload, done) => {
    try {
      const { id } = userPayload;

      if (!id) {
        done(null, false);
        return;
      }

      const user = await pg
        .first('*')
        .from('users')
        .where({ id });

      done(null, user);
    } catch (error) {
      done(error);
    }
  },
);

passport.use(passwordStrategy);
passport.use(jwtStrategy);

passport.serializeUser((user: UserDoc, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await pg
      .first('*')
      .from('users')
      .where({ id });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

function loginUser({
  err,
  user,
  req,
  res,
}: {
  err: Errback | null;
  user: UserDoc;
  req: Request;
  res: Response;
}) {
  if (err || !user) {
    res.status(400).send();
  } else {
    req.login(user, { session: false }, err => {
      if (err) {
        res.status(400).send();
      } else {
        const tokenPayload = _.pick(user, ['id']);
        const token = jwt.sign(tokenPayload, TOKEN_SECRET);

        res.cookie('token', token);
        res.redirect('/login?success=true');
      }
    });
  }
}

router.post('/login', (req, res) => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Errback, user: UserDoc) => loginUser({ err, user, req, res }),
  )(req, res);
});

router.post('/register', async (req, res) => {
  const { user_name, password, email } = req.body;

  const user = await pg
    .first('users.id')
    .from('users')
    .where({ user_name })
    .orWhere({ email });

  if (user) {
    res.status(400).send();
  } else {
    const id = uuid();

    try {
      const hash = await hashPassword(password);

      if (user_name.match(/[^a-z0-9]/gi)) {
        throw new Error('Invalid Username');
      }

      const users: UserDoc[] = await pg
        .insert({
          id,
          user_name,
          email,
          password: hash,
          created_at: new Date(),
        })
        .into('users')
        .returning('*');
      const user = _.first(users);

      if (user) {
        loginUser({ err: null, user, req, res });
      } else {
        throw new Error('User Creation Failed');
      }
    } catch (error) {
      res.status(400).send();
      Sentry.captureException({ username: user_name, email });
      throw error;
    }
  }
});

router.get('/logout', req => req.logout());

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
);
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login?failed=true' }),
  (req, res) => loginUser({ err: null, user: req.user, req, res }),
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?failed=true' }),
  (req, res) => loginUser({ err: null, user: req.user, req, res }),
);

router.get('/auth/me', async (req, res) => {
  const { cookies } = req;
  const { token } = cookies;

  try {
    if (!token) {
      throw new Error('No token found in cookies.');
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    const id = _.get(decoded, 'id');

    if (!id) {
      throw new Error('No ID found in token.');
    }

    const user = await pg
      .first('*')
      .from('users')
      .where({ id });
    const user_name = _.get(user, 'user_name');

    res.json({ token, id, user_name });
  } catch (error) {
    res.status(401).send();
    Sentry.captureException({ req });
    throw error;
  }
});
