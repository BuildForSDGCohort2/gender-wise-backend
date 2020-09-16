import Joi from '@hapi/joi';

import Format from '.';
import validator from '../utils/validator';

/** class that handles word validation */
class WordValidation {
  /**
   * validates word creation
   * @returns {function} middleware function
   */
  static validateWords() {
    return (req, res, next) => {
      const schema = Joi.object().keys({
        word: Format.word.required(),
        genderwise: Format.word.required()
      });
      return validator(schema, req.body, next);
    };
  }

  /**
   * validates word voting
   * @returns {function} middleware function
   */
  static validatePoll() {
    return (req, res, next) => {
      const schema = Joi.object().keys({
        vote: Joi.boolean().required()
      });
      return validator(schema, req.body, next);
    };
  }
}

export default WordValidation;
