import UserService from '../services/userservice';
import Response from '../utils/response';

/** class that controls users */
class UserController {
  /**
   * Decodes a user and puts on request object
   * @returns {function} middleware function
   */
  static decodeUser() {
    return async (req, res, next) => {
      try {
        const user = await UserService.getUserByToken(req.header.authorization);
        req.user = user;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Returns logged in user's details
   * @returns {function} middleware function
   */
  static getUserDetail() {
    return async (req, res, next) => {
      try {
        Response.customResponse(res, 200, 'user detail', req.user);
      } catch (error) {
        next(error);
      }
    };
  }
}

export default UserController;
