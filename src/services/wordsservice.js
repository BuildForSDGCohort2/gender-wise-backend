/* eslint-disable implicit-arrow-linebreak */
import customError from '../utils/errorhandler';
import words from '../models/words';
import TweetingService from './tweetingservice';

const regexBuilder = (() => {
  let regex = '';
  const builder = () => {
    (async () => {
      try {
        const sensitive = await words.find({ status: 'approved' });
        let res = '';
        Array.prototype.forEach.call(sensitive, (word, i) => {
          res += `${i === 0 ? '(' : ''}\\b${word.word}\\b${
            i + 1 === sensitive.length ? ')' : '|'
          }`;
        });
        regex = res;
      } catch (error) {
        builder();
      }
    })();
    return regex;
  };
  builder();
  return builder;
})();

/** words service provider */
class WordsService {
  /**
   * Adds a new word/statement
   * @returns {object} word/statement object
   */
  static async createWord({ word, genderwise }) {
    if (await words.findOne({ word })) {
      throw customError.badRequestError({
        message: `There is already a gender wise replacement for ${word} thank you.`
      });
    }
    const newWord = words.create({
      word,
      genderwise
    });
    const message = `Please take a minute and tell us if you think ${newWord.genderwise} is a good non gender sensitive replacement for ${newWord.word}? \n\n Like if you agree or retweet if you don't and probably drop a comment to tell others why you don't agree.`;
    TweetingService.sendTweet(message, (tweetPostId) => {
      newWord.twitterPostId = tweetPostId;
      newWord.save().catch(() => {});
    });
    return word;
  }

  /**
   * Gets words/statements based on search query
   * @param {object} param search query
   * @returns {array} array of word objects that match search
   */
  static async getWords(param = {}, { limit = 100, page = 1 }) {
    const func1 = () =>
      words
        .find(param)
        .sort([['createdAt', -1]])
        .skip((page - 1) * limit)
        .limit(limit);
    const func2 = () => words.countDocuments(param);
    const [results, totalCount] = await Promise.all(
      [func1, func2].map((func) => func())
    );
    return {
      page,
      results,
      resultCount: results.length,
      totalCount
    };
  }

  /**
   * Return a word based on search param
   * @param {object} param search param to find word with
   * @returns {object} word object
   */
  static async getSingleWord(param) {
    const word = await words.findOne(param);
    if (!word) {
      throw customError.notFoundError({
        message: 'no result matches your search'
      });
    }
    return word;
  }

  /**
   * Upvotes or downvotes a word depending on choice
   * @param {object} param search query to find word with
   * @returns {object} word object
   */
  static async voteWord(param, { vote }) {
    let word = await words.findOne(param);
    if (!word) {
      throw customError.notFoundError({
        message: 'no result matches your search'
      });
    }
    if (vote) {
      word.upvotes += 1;
    } else {
      word.downvotes += 1;
    }
    word = await word.save();
    return word;
  }

  /**
   * Goes through pending words and changes their status
   * if they have votes and have been there for a while.
   * does this every 24 hours after first call
   * @returns {true} process started
   */
  static async voteCollationOfficer() {
    try {
      const days = new Date(
        Date.now() - 86400000 * process.env.NumberOfDaysBeforePollCollation
      );
      const candidates = await words.find({
        status: 'pending',
        $or: [{ upvotes: { $gt: 0 } }, { downvotes: { $gt: 0 } }],
        createdAt: { $lt: days }
      });
      candidates.forEach((candidate) => {
        const { upvotes, downvotes } = candidate;
        if (upvotes > downvotes) {
          candidate.status = 'approved';
        }
        if (upvotes < downvotes) {
          candidate.status = 'rejected';
        }
        candidate.save().catch((error) => {
          /**
           * Could not collate candidate's votes for some reason.
           * Well, we'll try again tomorrow
           */
          console.log('could not collate ', candidate, ' because ', error);
        });
      });
      regexBuilder();
    } catch (error) {
      //  Some error occurred and collation officer failed.
      console.log('collation error: ', error);
    }
    setTimeout(this.voteCollationOfficer, 86400000);
    return true;
  }

  /**
   * puts words/statements out for polling
   * on twitter and checks twitter for polls
   * @returns {boolean} process started
   */
  static async voteCoordinator() {
    try {
      const candidates = await words.find({
        $or: [{ twitterPostId: null }, { twitterPostId: '' }]
      });
      candidates.forEach((candidate) => {
        const message = `Please take a minute and tell us if you think ${candidate.genderwise} is a good non gender sensitive replacement for ${candidate.word}? \n\n Like if you agree or retweet if you don't and probably drop a comment to tell others why you don't agree.`;
        TweetingService.sendTweet(message, (tweetPostId) => {
          candidate.twitterPostId = tweetPostId;
          candidate.save().catch(() => {});
        });
      });
    } catch (error) {
      //  Some error occurred and collation officer failed.
      console.log('vote mobilisation error: ', error);
    }
    setTimeout(this.voteCoordinator, 86400000);
    return true;
  }

  /**
   * Retrieves tweets votes everyday
   * @returns {boolean} process started successfully
   */
  static async twitterVoteRetriever() {
    try {
      const days = new Date(
        Date.now() - 86400000 * process.env.NumberOfDaysBeforePollCollation
      );
      const candidates = await words.find({
        status: 'pending',
        $and: [
          { twitterPostId: { $ne: null } },
          { twitterPostId: { $ne: '' } }
        ],
        createdAt: { $gte: days }
      });
      candidates.forEach(async (candidate) => {
        try {
          const data = await TweetingService.retriveTweet(
            candidate.twitterPostId
          );
          candidate.upvotes += data.upvotes;
          candidate.downvotes += data.downvotes;
          await candidate.save().catch(() => {});
        } catch (error) {
          //  So many errors, but we really couldn't care any less
          console.log('error retrieving tweet for ', candidate);
        }
      });
    } catch (error) {
      //  Some error occurred with retrieval.
      console.log('tweet retrieval error: ', error);
    }
    setTimeout(this.twitterVoteRetriever, 86400000);
    return true;
  }

  /**
   * Returns string that can be used
   * to create regex for to match against
   * strings
   * @returns {string} regexable string
   */
  static getRegexString() {
    return regexBuilder();
  }
}

export default WordsService;
