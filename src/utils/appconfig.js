import connectMongo from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';

import passportConfig from './passportconfig';
import routes from '../routes';
import CustomError from './errorhandler';

const configureApp = (app) => {
  const MongoStoreFactory = connectMongo(session);

  app.enable('trust proxy');
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      store: new MongoStoreFactory({
        mongooseConnection: mongoose.connection,
        collection: 'session-store'
      }),
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production'
      }
    })
  );
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  passportConfig(passport);

  app.use(routes);
  app.use(CustomError.notFoundErrorHandler());
  app.use(CustomError.errorHandler());
};

export default configureApp;
