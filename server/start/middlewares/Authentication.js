import jwt from 'jsonwebtoken';
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
        const currentUser = request.decoded.user;
        const userRoleId = currentUser.roleId;
        if (document.userId !== currentUser.id && !helper.isAdmin(userRoleId)) {
          return response.status(500)
            .send(
              {
                message: 'You are not allowed to view this documents'
              }
            );
        }
        if (!helper.publicAccess(document) && !helper.roleAccess(document)) {
          return response.status(500)
            .send(
              {
                message: 'You are not allowed to view this documents'
              });
        }
        if (helper.roleAccess(document)
        && currentUser.roleId !== document.userRoleId) {
          return response.status(500)
            .send(
              {
                message: 'You are not allowed to view this document'
              }
            );
        }
        request.document = result;
        next();
      });
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
    db.User.findOne({ where: { email: request.body.email } })
      .then((user) => {
        if (user) {
          return response.status(409)
            .send({
              message: 'email already exists'
            });
        }
        db.User.findOne({ where: { username: request.body.userName } })
          .then((newUser) => {
            if (newUser) {
              return response.status(409)
                .send({
                  message: 'username already exists'
                });
            }
            userName = request.body.userName;
            firstName = request.body.firstName;
            lastName = request.body.lastName;
            email = request.body.email;
            password = request.body.password;
            const roleId = request.body.roleId || 2;
            request.userInput =
            { userName, firstName, lastName, roleId, email, password };
            next();
          });
      });
  },

  /**
   * Validate user's login datas
   * @param {Object} request req object
   * @param {Object} response response object
   * @param {Object} next Move to next controller handler
   * @returns {void|Object} response object or void
   * */
  validateLoginInput (request, response, next) {
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
   * checkAccess - checks if a user has the access to view a document
   * @param  {object} request  request object
   * @param  {type} response  response object
   * @param  {type} next callback function
   * @return {void} no return or void
   */
  checkDocumentViewAccess(request, response, next) {
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
                message: 'Document Not found'
              }
            );
        }
        const document = result.dataValues;
        const currentUser = request.decoded.user;
        const userRoleId = currentUser.roleId;

        if (document.userId !== currentUser.id && !helper.isAdmin(userRoleId)) {
          return response.status(500)
            .send(
              {
                message: 'You are not allowed to view this documents'
              }
            );
        }
        if (!helper.publicAccess(document) && !helper.roleAccess(document)) {
          return response.status(500)
            .send(
              {
                message: 'You are not allowed to view this documents'
              });
        }
        if (helper.roleAccess(document)
      && currentUser.roleId !== document.userRoleId) {
          return response.status(500)
            .send(
              {
                message: 'You are not allowed to view this document'
              }
            );
        }
        request.document = result;
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
                message: 'Document not found'
              }
            );
        }
        if (document.userId !== request.decoded.user.id) {
          return response.status(400)
            .send(
              {
                message: 'You don\'t have permissions to delete this document'
              });
        }
        request.Document = document;
        next();
      });
  }
};

export default Authentication;
