import db from '../models';

const UserController = {
  /**
    * Create a new user
    * Route: POST: /users
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  create() { },

  /**
    * user login
    * Route: POST: /users/login
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  login() {},

  /**
    * logout
    * Route: POST: /users/logout
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {void} no returns
    */
  logout () {},

  /**
    * Get all users
    * Route: GET: /users
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  readAll() {

  },

  /**
    * Get user by id
    * Route: get: /users/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  readOne() {},

  /**
    * Update user attribute
    * Route: PUT: /users/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  update() {},

  /**
    * Delete a user by id
    * Route: DELETE: /users/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  delete() {},

  /**
    * Get all document by a user
    * Route: GET: /users/:id/documents
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  findUserDocuments() {},

  /**
    * Search users
    * Route: GET: /users/searchs?query=
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  search() {}

};
export default UserController;
