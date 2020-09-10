/* eslint-disable no-underscore-dangle */
import TwitterStrategy from 'passport-twitter';
import FacebookStrategy from 'passport-facebook';
import User from '../models/user';

const facebookCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const check = await User.findOne({ facebook: profile.id });
    if (check) {
      return done(null, check);
    }
    const user = await User.create({
      facebook: profile.id,
      email: profile._json.email,
      name:
        profile.name || `${profile.name.givenName} ${profile.name.familyName}`
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
};

const twitterCallback = async (token, tokenSecret, profile, done) => {
  try {
    const check = await User.findOne({ twitter: profile.id });
    if (check) {
      return done(null, check);
    }
    const user = await User.create({
      twitter: profile.id,
      email: `${profile.username}@twitter.com`,
      name: profile.displayName
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
};

const passportConfig = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    done(null, {});
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.HOST}/api/v1/auth/facebook-callback`,
        profileFields: ['name', 'email', 'number']
      },
      facebookCallback
    )
  );

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.HOST}/api/v1/auth/twitter-callback`
      },
      twitterCallback
    )
  );
};

export default passportConfig;
