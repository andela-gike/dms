import db from '../../models';
// import config from '../../config/config';

const Authentication = {
  /**
   * Check for admin permission
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next move to next controller handler
   * @returns {Object} Object
   */
  hasAdminPermission(request, response, next){
    db.Role
      .findById(request.decodedToken.roleId)
      .then((role) => {
        if (role.title === 'admin') {
          next();
        } else {
          return response.status(403)
            .send({ message: 'Permission denied, admin only' });
        }
      });

  }
};

export default Authentication;
