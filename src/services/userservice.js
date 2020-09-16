import User from '../models/user';
import CustomError from '../utils/errorhandler';

/** class that handles users */
class UserService {
  /**
   * Gets a user by a jwt token
   * @param {string} token jwt token
   * @returns {object} user object
   */
  static async getUserByToken(token) {
    const user = await User.findByToken(token);
    if (!user) {
      CustomError.authorizationError({ message: 'unauthorized' });
    }
    return user.toJSON();
  }

  /**
   * Gets a single user
   * @param {object} param search param
   * @returns {object} user object
   */
  static async getSingleUser(param) {
    const user = await User.findOne(param);
    return user;
  }
}

export default UserService;
