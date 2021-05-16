import bodyParser from 'body-parser';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { createMongoConnection } from './db-wrapper';
import { changeUserPassword, createNewUser, getUserByEmail, getUserById, getUserData, validatePassword, User } from './user';
// import passport from 'passport';
// import { Strategy as LocalStrategy} from 'passport-local';
import session from 'express-session';
import { passport, authenticateUserMiddleware } from './authentication';

// const authenticateUserMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   if (!req.isAuthenticated()) {
//     res.status(403).send();
//   } else {
//     next();
//   }
// }

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//   },
//   async (username, password, done) => {
//     try {
//       const user = await getUserByEmail(username);
//       if (!user) {
//         return done(null, false, { message: 'User not found.' });
//       }
//       const validPassword = await validatePassword(password, user.password);
//       if (!validPassword) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, (<User>user)._id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   const user = await getUserById(id);
//   if (!user) {
//     return done(null, false);
//   }
//   done(null, user);
// });

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', authenticateUserMiddleware, (req, res) => {
  res.send('test site');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/user/get'
}));

app.get('/user/get', authenticateUserMiddleware, (req, res) => {
  const userData = getUserData(req.user as User);
  res.send(userData);
})

app.post('/user/add', authenticateUserMiddleware, async (req, res) => {
  try {
    const newUserId = await createNewUser(req.body.email, req.body.password, req.body.role, req.body.name);
    res.send(newUserId);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/user/changePassword', authenticateUserMiddleware, async (req, res) => {
  try {
    const result = await changeUserPassword(req.body.id, req.body.password, req.body.newPassword);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/graphql', authenticateUserMiddleware, async (req, res) => {
  try {
    const { token } = req.user as User;
    const apiRes = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query: req.body.query }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!apiRes.ok) {
      throw Error(apiRes.statusText);
    }
    const json = await apiRes.json();
    res.send(json);
  } catch (err) {
    console.error(err)
    console.log(req.body.query)
    res.status(500).send(err);
  }
})

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(process.env.PORT, () => console.log(`Server runnning at http://localhost:${process.env.PORT}`));
}

export default app;
