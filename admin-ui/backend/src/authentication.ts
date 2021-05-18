import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { getUserByEmail, getUserById, validatePassword, User } from './user';

passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  async (username, password, done) => {
    try {
      const user = await getUserByEmail(username);
      if (!user) {
        return done(null, false, { message: 'User not found.' });
      }
      const validPassword = await validatePassword(password, user.password);
      if (!validPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, (<User>user)._id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await getUserById(id);
  if (!user) {
    return done(null, false);
  }
  done(null, user);
});

const authenticateUserMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
  } else {
    next();
  }
}

export {
  passport,
  authenticateUserMiddleware,
}
