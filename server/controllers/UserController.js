import omit from 'lodash.omit';
import db from '../models';
import Helper from '../controllers/helpers/index';

const UserController = {
  /**
    * Create a new user
    * Route: POST: /user
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  create(request, response) {
    db.User
      .create(request.userInput)
      .then((user) => {
        const token = Helper.getToken(user);
        const filteredData = omit(user.dataValues, [
          'password',
        ]);
        response.status(200)
          .send({
            message: 'User was created Successfully',
            user: filteredData,
            token
          });
      })
      .catch((err) => {
        response.status(400).send({
          message: 'There was a problem creating this user', err
        });
      });
  },

  /**
    * user login
    * Route: POST: /user/login
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  login(request, response) {
    db.User
      .findOne({
        where: { email: request.body.email }
      })
      .then((user) => {
        if (user && user.validPassword(request.body.password)) {
          user.update({ active: true, })
            .then((result) => {
              const token = Helper.getToken(result);
              const filteredData = omit(result.dataValues, [ 'password' ]);
              response.status(200).send({
                message: 'Logged In Successfully',
                token,
                user: filteredData
              });
            });
        }
      }).catch(error =>
        response.status(400)
          .send(error));
  },

  /**
    * logout
    * Route: POST: /user/logout
    * @param {Object} req request object
    * @param {Object} res response object
    * @returns {void} no returns
    */
  logout (request, response) {
    const userId = request.decodedToken.userId;
    db.User.findById(userId)
      .then((user) => {
        user
          .update(
            {
              active: false,
            }).then(() => {
            response.status(200)
              .send({
                message: 'You have successfully logged out'
              });
          });
      })
      .catch(error =>
        response.status(400)
          .send(error));
  },

  /**
    * Get all users
    * Route: GET: /user
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  readAll(request, response) {
    db.User
      .findAndCountAll(request.userFilter)
      .then((users) => {
        if (users) {
          const condition = {
            count: users.count,
            limit: request.userFilter.limit,
            offset: request.userFilter.offset
          };
          delete users.count;
          const pagination = Helper.pagination(condition);
          response.status(200)
            .send({
              message: 'You have successfully retrived all users',
              users,
              pagination
            });
        }
      });
  },

  /**
    * Get user by id
    * Route: get: /user/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  readOne(request, response) {
    const UserId = request.params.id;
    if (isNaN(UserId)) {
      return response.status(400)
        .send({
          success: false,
          message: 'Invalid type of user id. use numbers only'
        });
    }
    db.User
      .findOne({
        where: { id: UserId }
      })
      .then((user) => {
        if (user) {
          const filteredData = omit(user.dataValues, [
            'password',
          ]);
          response.status(200)
            .send({
              user: filteredData
            });
        } else {
          response.status(404)
            .send(
              {
                message: `User with id:${ UserId } not found`
              });
        }
      })
      .catch((error) => {
        response.send(error);
      });
  },

  /**
    * Update user attribute
    * Route: PUT: /user/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  update(request, response) {
    request.userInstance
      .update(request.body)
      .then((user) => {
        const filteredData = omit(user.dataValues, [
          'password',
        ]);
        response.status(200)
          .send({
            user: filteredData,
            message: 'Profile Info Updated Successfully'
          });
      }).catch((error) => {
        response.status(403)
          .send({ error });
      });
  },

  /**
    * Delete a user by id
    * Route: DELETE: /user/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  delete(request, response) {
    request.userInstance.destroy(
      {
        where: {
          id: request.userInstance.id
        }
      }
    ).then(() => {
      response.status(200).send({
        message: 'User was deleted successfully'
      });
    });
  },

  /**
    * Get all document by a user
    * Route: GET: /user/:id/documents
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  findUserDocuments() {},

  /**
    * Search users
    * Route: GET: /search/user?query=
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Response} response object or void
    */
  search(request, response) {
    const userData = request.userFilter;
    let condition = {};
    let pagination;
    userData.attributes = Helper.getUserAttribute();
    db.User.findAndCountAll(userData)
      .then((users) => {
        condition = {
          count: users.count,
          limit: userData.limit,
          offset: userData.offset
        };
        delete users.count;
        pagination = Helper.pagination(condition);
        let message;
        users.rows.length === 0 ? message = 'User not Found'
          : message = 'Your search was successful';
        response.status(200).send({ users, message, pagination });
      });
  }

};
export default UserController;
