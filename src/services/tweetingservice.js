/* eslint-disable implicit-arrow-linebreak */
import Twit from 'twit';
import dotenv from 'dotenv';

dotenv.config();

const Twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let lastTweet = Date.now();
const noop = () => {};
/** class that handles tweets */
class TweetingService {
  /**
   * sends out a tweet at logical intervals. You probably
   * shouldn't wait for this function because it might take
   * years before that tweet gets out. Just kidding, but it
   * might take hours that you don't want users waiting for
   * @param {string} message tweet message
   * @param {function} cb a function called with tweetId
   * @returns {true} your message is in process
   */
  static sendTweet(message, cb = noop) {
    // Send out tweets at 30 seconds intervals
    if ((Date.now() - lastTweet) / (1000 * 60) < 0.5) {
      setTimeout(this.sendTweet, 0.5 * 1000 * 60, message, cb);
      return true;
    }
    // Do some sending stuff here...
    Twitter.post('/statuses/update', { status: message }, (err, data) => {
      if (err) {
        console.log(err);
        // setTimeout(this.sendTweet, 0.5 * 1000 * 60, message, cb);
        return;
      }
      cb(data.id_str);
      lastTweet = Date.now();
    });
    return true;
  }

  /**
   * retrieves tweet stats
   * @param {string} tweetId the tweet id
   * @returns {object} tweet stat object
   */
  static retriveTweet(tweetId) {
    const operate = () =>
      new Promise((resolve, reject) => {
        Twitter.get(`statuses/show/${tweetId}`, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve({
            upvotes: data.favorite_count,
            downvotes: data.retweet_count
          });
        });
      });

    return operate();
  }
}

export default TweetingService;
