import WordsService from '../services/wordsservice';
import Response from '../utils/response';

/** Words controller */
class WordsController {
  /**
   * creates a new word
   * @returns {function} middleware function
   */
  static createNewWord() {
    return async (req, res, next) => {
      try {
        const word = await WordsService.createWord(req.body);
        Response.customResponse(res, 200, 'new word', word);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * gets words/statements. returns only 100 results per request
   * @returns {function} middleware function
   */
  static getWords() {
    return async (req, res, next) => {
      try {
        const { page = 1 } = req.query;
        const data = await WordsService.getWords(
          {
            status: 'approved'
          },
          { page }
        );
        Response.customResponse(res, 200, 'words', data);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * gets words/statements up for poll. returns only 100 results per request
   * @returns {function} middleware function
   */
  static getPollWords() {
    return async (req, res, next) => {
      try {
        const { page = 1 } = req.query;
        const data = await WordsService.getWords(
          {
            status: 'pending'
          },
          { page }
        );
        Response.customResponse(res, 200, 'words', data);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * upvotes or downvotes a word
   * @returns {function} middleware function
   */
  static voteWords() {
    return async (req, res, next) => {
      try {
        const { wordId } = req.params;
        const word = await WordsService.voteWord({ _id: wordId }, req.body);
        Response.customResponse(res, 200, 'successfully voted', word);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Gets a single word
   * @returns {function} middleware function
   */
  static getSingleWord() {
    return async (req, res, next) => {
      try {
        const { wordId } = req.params;
        const word = await WordsService.getSingleWord({ _id: wordId });
        Response.customResponse(res, 200, 'word', word);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Gets a single word
   * @returns {function} middleware function
   */
  static getSingleWordByWord() {
    return async (req, res, next) => {
      try {
        const { word } = req.params;
        const result = await WordsService.getSingleWord({ word });
        Response.customResponse(res, 200, 'word', result);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Gets regexable string
   * @returns {function} middleware function
   */
  static getRegexString() {
    return async (req, res) => {
      Response.customResponse(
        res,
        200,
        'string',
        WordsService.getRegexString()
      );
    };
  }
}

export default WordsController;
