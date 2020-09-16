import '@hapi/joi';

import CustomError from './errorhandler';

export default async (schema, toValidate, next) => {
  try {
    await schema.validateAsync(toValidate, { abortEarly: false });
    next();
  } catch (error) {
    next(CustomError.validationError(error));
  }
};
