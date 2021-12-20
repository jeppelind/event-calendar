import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {
  getUserByEmail, validatePassword,
} from './user';

passport.use(new LocalStrategy({
  usernameField: 'email',
},
async (username, password, done) => {
  try {
    const user = await getUserByEmail(username);
    if (!user) {
      return done(null, false, { message: 'Wrong username or password' });
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      return done(null, false, { message: 'Wrong username or password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

export default passport;
