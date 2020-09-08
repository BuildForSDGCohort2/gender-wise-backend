/** Class that creates and handles errors. */
class CustomError {
  /**
   * Returns a structured error object
   * @returns {object} error object.
   */
  static customError({
    status,
    message = null,
    name = null,
    userError = true
  }) {
    const error = new Error(message);
    error.name = name;
    error.status = status;
    error.userError = userError;
    return error;
  }

  /**
   * Returns a validation error object.
   * @returns {object} error object.
   */
  static validationError({ message, ...otherInfo }) {
    return this.customError({
      ...otherInfo,
      message,
      name: 'Validation Error',
      status: 422
    });
  }

  /**
   * Returns a authentication error object.
   * @returns {object} error object.
   */
  static authenticationError({ message, ...otherInfo }) {
    return this.customError({
      ...otherInfo,
      message,
      name: 'Authentication Error',
      status: 401
    });
  }

  /**
   * Returns a authorization error object.
   * @returns {object} error object.
   */
  static authorizationError({ message, ...otherInfo }) {
    return this.customError({
      ...otherInfo,
      message,
      name: 'Authorization Error',
      status: 403
    });
  }

  /**
   * Returns a notFound error object.
   * @returns {object} error object.
   */
  static notFoundError({ message, ...otherInfo }) {
    return this.customError({
      ...otherInfo,
      message,
      name: 'Not Found',
      status: 404
    });
  }

  /**
   * Returns a conflictError error object.
   * @returns {object} error object.
   */
  static conflictError({ message, ...otherInfo }) {
    return this.customError({
      ...otherInfo,
      message,
      name: 'Conflict Error',
      status: 409
    });
  }

  /**
   * Returns a badRequest error object.
   * @returns {object} error object.
   */
  static badRequestError({ message, ...otherInfo }) {
    return this.customError({
      ...otherInfo,
      message,
      name: 'Not Found Error',
      status: 400
    });
  }

  /**
   * Handles not found errors.
   * @returns {function}  middleware function.
   */
  static notFoundErrorHandler() {
    // eslint-disable-next-line no-unused-vars
    return (req, res, next) => {
      next(
        CustomError.notFoundError({
          message:
            "the resource you're looking for either does not exist or have been moved"
        })
      );
    };
  }

  /**
   * Handles all errors.
   * @returns {function}  middleware function.
   */
  static errorHandler() {
    // eslint-disable-next-line no-unused-vars
    return (error, req, res, next) => {
      if (error.kind === 'ObjectId') {
        error = CustomError.notFoundError(
          'could not find the resource you were looking for.'
        );
      }
      // Log error if application error
      if (typeof error !== 'object' || !error.userError) {
        (async () => {
          //  Log the error much later so we don't block anything
          setTimeout(console.log, 3000, {
            message: error.message,
            stack: error.stack,
            ...error
          });
        })();
        error = {};
        error.name = 'SERVER_ERROR';
        error.message = 'An unexpected error has occurred';
        error.status = 500;
      }

      res.status(error.status).json({
        status: error.status,
        message: error.message,
        error: error.name
      });
    };
  }
}

export default CustomError;
