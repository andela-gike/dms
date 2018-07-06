import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import db from '../../models';
import config from '../../config/config';
import helper from '../../controllers/helpers';

const Authentication = {

  /**
   * Verify user token
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Object} next move to next controller handler
   * @returns {void} no returns
   */
  verifyToken(request, response, next) {
    const token = request.body.token || request.query.token ||
      request.headers.authorization || request.headers[ 'x-access-token' ];
    if (!token) {
      return response.status(401).send({ message: 'No token was provided' });
    }
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return response.status(401).send({ message: 'Invalid Token' });
      }
      db.User.findById(decoded.userId)
        .then((user) => {
          if (!user) {
            return response.status(404)
              .send({
                message: 'Account not found, Sign Up or sign in to get access'
              });
          }
          if (!user.active) {
            return response.status(401)
              .send({
                message: 'Please sign in to access your account'
              });
          }
          request.decodedToken = decoded;
          request.decodedToken.roleId = user.roleId;
          next();
        });
    });
  },

  /**
   * Check for admin permission
   * @param {Object} request request object
   * @param {Object} response response object
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

  },

  /**
   * checkDocumentAccess - checks if a user has the access to view a document
   * @param  {object} request  request object
   * @param  {type} response  response object
   * @param  {type} next callback function
   * @return {void} no return or void
   */
  checkDocumentAccess(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: 'Error occurred while retrieving documents'
      });
    }
    db.Document.findById(request.params.id)
      .then((result) => {
        if (!result) {
          return response.status(404)
            .send(
              {
                message: `Document with ${ request.params.id } not found`
              }
            );
        }
        const document = result.dataValues;
        const currentUser = request.decodedToken;
        const userRoleId = currentUser.roleId;
        if (document.userId !== currentUser.userId && !helper.isAdmin(userRoleId)) {
          return response.status(401)
            .send(
              {
                message: 'You are not allowed to view this documents'
              }
            );
        }
        if (!helper.publicAccess(document) &&
            !helper.isOwnerDoc(document, currentUser) &&
            !helper.isAdmin(currentUser.roleId) &&
            !helper.roleAccess(document, currentUser)) {
          return response.status(401)
            .send(
              {
                message: 'You are not allowed to view this documents'
              });
        }
        request.document = result;
        next();
      });
  },

  /**
   * checkAdmin - checks if a user is an admin
   * @param  {object} request  request object
   * @param  {type} response  response object
   * @param  {function} next callback function
   * @return {void} no return or void
   */
  checkAdmin(request, response, next) {
    const currentUser = request.decodedToken;
    if (!helper.isAdmin(currentUser.roleId)) {
      return response.status(403)
        .send(
          {
            success: false,
            message: 'Access denied, only Admins are allowed'
          }
        );
    }
    next();
  },

  /**
   * Validate user's input
   * @param {Object} request req object
   * @param {Object} response response object
   * @param {Object} next Move to next controller handler
   * @returns {void|Object} response object or void
   * */
  validateUserInput (request, response, next) {
    if (request.body.roleId && request.body.roleId === 1) {
      return response.status(403)
        .send({
          message: 'Permission denied, You cannot sign up as an admin user'
        });
    }
    let firstName = /\w+/g.test(request.body.firstName);
    let lastName = /\w+/g.test(request.body.lastName);
    let userName = /\w+/g.test(request.body.userName);
    let email = /\S+@\S+\.\S+/.test(request.body.email);
    let password = /\w+/g.test(request.body.password);

    if (!firstName) {
      return response.status(400)
        .send({
          message: 'Enter a valid firstname'
        });
    }
    if (!lastName) {
      return response.status(400)
        .send({
          message: 'Enter a valid lastname'
        });
    }
    if (!userName) {
      return response.status(400)
        .send({
          message: 'Enter a valid username'
        });
    }
    if (!email) {
      return response.status(400)
        .send({
          message: 'Enter a valid email'
        });
    }
    if (!password) {
      return response.status(400)
        .send({
          message: 'Enter a valid password'
        });
    }
    if (request.body.password && request.body.password.length < 8) {
      return response.status(400)
        .send({
          message: 'Minimum of 8 characters is allowed for password'
        });
    }
    db.User.findOne({ where: {
      userName: request.body.userName,
      $or: {
        email: request.body.email
      }
    } })
      .then((user) => {
        if (user) {
          if (user.dataValues.username === request.body.userName) {
            return response.status(409)
              .send({
                message: 'username already exists'
              });
          }
          if (user.dataValues.email === request.body.email) {
            return response.status(409)
              .send({
                message: 'username already exists'
              });
          }
        } else {
          userName = request.body.userName;
          firstName = request.body.firstName;
          lastName = request.body.lastName;
          email = request.body.email;
          password = request.body.password;
          const roleId = request.body.roleId || 2;
          request.userInput =
          { userName, firstName, lastName, roleId, email, password };
          next();
        }
      });
  },

  /**
   * Validate user's login datas
   * @param {Object} request req object
   * @param {Object} response response object
   * @param {Object} next Move to next controller handler
   * @returns {void|Object} response object or void
   * */
  validateLoginData (request, response, next) {
    if (!request.body.password || !request.body.email) {
      return response.status(400)
        .send({
          message: 'Please provide your email and password to login'
        });
    }

    const email = /\S+@\S+\.\S+/.test(request.body.email);
    const password = /\w+/g.test(request.body.password);

    if (!email || !password) {
      return response.status(400)
        .send({
          message: 'Please enter a valid email and password'
        });
    }
    next();

  },

  /**
   * Validate documents input
   * @param {Object} request req object
   * @param {Object} response response object
   * @param {Object} next Move to next controller handler
   * @returns {void|Object} response object or void
   * */
  validateDocumentsInput(request, response, next) {
    const title = request.body.title;
    const content = request.body.content;

    if (!title) {
      return response.status(400)
        .send({
          message: 'The title of the document is empty'
        });
    }
    if (!content) {
      return response.status(400)
        .send({
          message: 'The content of the document is empty'
        });
    }

    if (request.body.access
      && ![ 'public', 'private', 'role' ].includes(request.body.access)) {
      return response.status(400)
        .send({
          message: 'Access type can only be public, private or role'
        });
    }
    request.docInput = {
      title: request.body.title,
      content: request.body.content,
      userId: request.decodedToken.userId,
      access: request.body.access,
      userRoleId: request.decodedToken.roleId
    };
    next();
  },

  /**
   * checkDocument - checks if a document belongs to the user
   * @param  {object} request  request object
   * @param  {object} response  response object
   * @param  {function} next callback function
   * @return {void} no return or void
   */
  checkDocument(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: 'Error occured while retrieving document'
      });
    }
    const access = [ 'public', 'private', 'role' ];
    db.Document.findById(request.params.id)
      .then((doc) => {
        if (!doc) {
          return response.status(404)
            .send({
              message: 'This document does not exist'
            });
        }
        if (!helper.isOwnerDoc(doc, request)
          && !helper.isAdmin(request.decodedToken.roleId)) {
          return response.status(401)
            .send({
              message: 'You are not permitted to modify this document'
            });
        }
        if (request.body.access && !access.includes(request.body.access)) {
          const message = `Document access level can only
          be set to public, private, or role`;
          return response.status(400)
            .send({
              message
            });
        }
        if (request.body.id) {
          return response.status(403)
            .send(
              {
                message: 'You are not allowed to edit the document id'
              }
            );
        }
        request.doc = doc;
        next();
      });
  },

  /**
   * deleteDocument - delete a document
   * @param  {object} request  request object
   * @param  {object} response  response object
   * @param  {type} next callback function
   * @return {void} no return or void
   */
  deleteDocumentAccess(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: 'Error occured while deleting document'
      });
    }
    db.Document.findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(400)
            .send(
              {
                message: 'Cannot delete a document that does not exist'
              }
            );
        }
        if (document.userId !== request.decodedToken.userId) {
          return response.status(400)
            .send(
              {
                message: 'You don\'t have permissions to delete this document'
              });
        }
        request.Document = document;
        next();
      });
  },

  /**
   * Check for role delete permission
   * @param {Object} request request object
   * @param {Object} response response object
   * @param {Object} next Move to next controller handler
   * @return {Object} response object
   */
  checkRolePermission(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: 'Error occured while retrieving role'
      });
    }
    db.Role.findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(404)
            .send({
              message: 'This role does not exist'
            });
        }
        if (helper.isAdmin(role.id) || helper.isRegular(role.id)) {
          return response.status(403)
            .send({
              message: 'You are not permitted to modify this role'
            });
        }
        request.roleInstance = role;
        next();
      });
  },

  /**
  * Validate user search
  * @param {Object} request req object
  * @param {Object} response response object
  * @param {Object} next Move to next controller handler
  * @returns {void|Object} response object or void
  *
  */
  validateUserSearch(request, response, next) {
    // if (!Object.keys(request.query).length || !request.query.q) {
    //   return response.status(400).send({ message: 'Input a valid search term' });
    // }
    const query = helper.getQuery(request, response);
    const terms = [];
    const userQuery = request.query.query;
    const searchArray =
      userQuery ? userQuery.toLowerCase().match(/\w+/g) : null;
    if (searchArray) {
      searchArray.forEach((word) => {
        terms.push(`%${ word }%`);
      });
    }
    if (`${ request.baseUrl }${ request.route.path }` === '/user/search') {
      if (!request.query.query) {
        return response.status(400)
          .send({
            message: 'Please enter a search query'
          });
      }
      query.where = {
        $or: [
          { userName: { $iLike: { $any: terms } } },
          { firstName: { $iLike: { $any: terms } } },
          { lastName: { $iLike: { $any: terms } } },
          { email: { $iLike: { $any: terms } } }
        ]
      };
    }

    if (`${ request.baseUrl }${ request.route.path }` === '/user') {
      query.where = helper.isAdmin(request.decodedToken.roleId)
        ? {}
        : { id: request.decodedToken.userId };
      query.attributes = [
        'id',
        'userName',
        'firstName',
        'lastName',
        'email',
        'roleId'
      ];
    }
    request.userFilter = query;
    next();
  },

  /**
  * Validate single user search
  * @param {Object} request req object
  * @param {Object} response response object
  * @param {Object} next Move to next controller handler
  * @returns {void|Object} response object or void
  *
  */
  validateSingleUserSearch(request, response, next) {
    if (!helper.isOwner(request) && request.decodedToken.roleId !== 1) {
      return response.status(403)
        .send({
          message: 'Unauthorized Access'
        });
    }
    next();
  },

  /**
   * validateUpdate - Validates a User's Profile Updates
   * @param  {object} request request object
   * @param  {object} response response object
   * @param  {function} next callback function
   * @return  {void} no return or void
   */
  validateUpdateUser(request, response, next) {
    const currentUser = request.decodedToken;
    const userId = request.params.id;
    if (isNaN(userId)) {
      return response.status(400)
        .send({
          message: 'An Error occured, please contact admin'
        });
    }
    if (!helper.isAdmin(currentUser.roleId) && userId === 1) {
      return response.status(403)
        .send({
          message: 'You don\'t have permissions to edit an admin details'
        });
    }
    if (!helper.isOwner(request) && currentUser.roleId !== 1) {
      return response.status(403)
        .send({
          message: 'Unauthorized Access'
        });
    }
    if (request.body.id) {
      return response.status(403)
        .send({
          message: 'You are not allowed to edit your id'
        });
    }
    if (request.body.roleId && request.body.roleId === '1') {
      if (!helper.isAdmin(currentUser.roleId)) {
        return response.status(403)
          .send({
            message: 'You are not allowed to set the roleId'
          });
      }
    }
    db.User.findById(request.params.id)
      .then((user) => {
        if (!user) {
          return response.status(404)
            .send({
              message: `User with id: ${ request.params.id } does not exist`
            });
        }
        request.userInstance = user;
        next();
      });
  },

  /**
   * Validate user to delete, make sure it not admin user
   * @param {Object} request req object
   * @param {Object} response response object
   * @param {Object} next Move to next controller handler
   * @returns {void|Object} response object or void
   *
   */
  validateDeleteUser(request, response, next) {
    const userId = request.params.id;
    const currentUserId = request.decodedToken.userId;
    if (isNaN(userId)) {
      return response.status(400)
        .send({
          message: 'An Error Occured while deleting user'
        });
    }
    db.User.findById(userId)
      .then((user) => {
        if (user) {
          if (helper.isAdmin(user.roleId) && user.id === 1) {
            return response.status(403)
              .send({
                message: 'You are not allowed to delete the default Admin'
              });
          }
          if (helper.isAdmin(user.roleId) && user.id === currentUserId) {
            return response.status(403)
              .send({
                success: false,
                message: 'You are not allowed to delete your own account'
              });
          }
          if (helper.isRegular(user.roleId) && user.id === 2) {
            return response.status(403)
              .send({ message: 'You can not delete the default regular user' });
          }
          request.userInstance = user;
          next();
        } else {
          return response.status(404)
            .send({
              success: false,
              message: `The user with ${ userId } does not exist`
            });
        }
      });
  },
};

export default Authentication;
