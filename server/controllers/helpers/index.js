import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../../config/config';
import db from '../../models';

const expires = moment().add(1, 'days').valueOf();
const Helpers = {
  /**
   * roleAccess - check the role of the user
   * @param  {object} document document data
   * @return {BOOLEAN} returns true
   */
  roleAccess(document, request) {
    return (document.access === 'role'
    && document.userRoleId === request.decodedToken.roleId);
  },

  /**
   * publicAccess - checks if a document has a public access
   * @param  {object} document the documents data
   * @return {BOOLEAN} returns true
   */
  publicAccess(document) {
    return document.access === 'public';
  },

  /**
   * isAdmin - checks if a user is an admin user
   * @param  {integer} roleId User's roleId
   * @return {boolean} either true or false
   */
  isAdmin(roleId) {
    return roleId === 1;
  },

  /**
   * isRegular - checks if a User is a regular user
   * @param  {integer} roleId User's roleId
   * @return {boolean} either true or false
   */
  isRegular(roleId) {
    return roleId === 2;
  },

  /**
   * Check for document's owner
   * @param {Object} doc object
   * @param {Object} currentUser  currentUser object
   * @returns {Boolean} true or false
   */
  isOwnerDoc(document, currentUser) {
    return document.userId === currentUser.userId;
  },

  /**
   * Get document's attributes'
   * @returns {Array} return user's attributes
   */
  getDocAttribute() {
    return [
      'id', 'title', 'content', 'access',
      'userId', 'createdAt', 'updatedAt'
    ];
  },

  /**
   * Get user's attributes'
   * @returns {Array} return user's attributes
   */
  getUserAttribute() {
    return [ {
      model: db.User,
      as: 'User',
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'createdAt',
      ]
    } ];
  },

  /**
   * Get token
   * @param {Object} user user's object
   * @returns {Boolean} true or false
   */
  getToken(user) {
    const payload = {
      userId: user.id,
      roleId: user.roleId
    };
    return jwt.sign(payload, config.jwtSecret, { expiresIn: expires });

  },

  /**
   * Pagination
   * @param {Object} condition pagination condition
   * @returns {Object} return an object
   */
  pagination(condition) {
    const next = Math.ceil(condition.count / condition.limit);
    const currentPage = Math.floor((condition.offset / condition.limit) + 1);
    const pageSize = condition.limit > condition.count
      ? condition.count : condition.limit;
    return {
      page_count: next,
      page: currentPage,
      page_size: Number(pageSize),
      total_count: condition.count
    };
  },

  getQuery(request, response){
    const query = {};
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;
    const order = request.query.order = [ [ 'createdAt', 'DESC' ] ];

    if (limit && (limit < 0 || !/^([1-9]\d*|0)$/.test(limit))) {
      return response.status(400)
        .json({
          message: 'Only positive number is allowed for limit value'
        });
    }
    if (offset < 0 || !/^([1-9]\d*|0)$/.test(offset)) {
      return response.status(400)
        .json({
          message: 'Only positive number is allowed for offset value'
        });
    }

    query.limit = limit;
    query.offset = offset;
    query.order = order;
    return query;
  },

  /**
   * isOwner - checks if a user owns an account
   * @param  {object} req request object
   * @return {boolean} either true or false
   */
  isOwner(request) {
    return String(request.decodedToken.userId) === String(request.params.id);
  },
};

export default Helpers;
