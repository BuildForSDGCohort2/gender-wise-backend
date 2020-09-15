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
    if ((Date.now() - lastTweet) / (1000 * 60) < 30) {
      setTimeout(this.sendTweet, 30 * 1000 * 60, message, cb);
      return true;
    }
    // Do some sending stuff here...
    const tweetId = '123abc';
    cb(tweetId);
    lastTweet = Date.now();
    return true;
  }

  /**
   * retrieves tweet stats
   * @param {string} tweetId the tweet id
   * @returns {object} tweet stat object
   */
  static retriveTweet(tweetId) {
    // Do some retrieving here
    const statObject = {
      tweetId
    };
    return statObject;
  }
}

export default TweetingService;
