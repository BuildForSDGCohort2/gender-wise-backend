import { Router } from 'express';
import passport from 'passport';

const router = Router();
const callback = (req, res) => {
  res.redirect(
    `${process.env.AUTH_CALLBACK_URL}?bearerToken=${req.user.generateToken()}`
  );
};

router.get('/failure', (req, res) => {
  res.redirect(`${process.env.AUTH_FAILURE_CALLBACK_URL}?denied=1`);
});

router.get('/twitter', passport.authenticate('twitter'));
router.get(
  '/twitter-callback',
  passport.authenticate('twitter', {
    failureRedirect: '/api/v1/auth/failure'
  }),
  callback
);

router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook-callback',
  passport.authenticate('facebook', {
    failureRedirect: '/api/v1/auth/failure'
  }),
  callback
);

export default router;
