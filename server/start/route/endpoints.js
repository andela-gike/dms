// @flow
import Authentication from '../middlewares/Authentication';
import Document from '../../controllers/DocumentController';
import Role from '../../controllers/RoleController';
import User from '../../controllers/UserController';

export default (app) => {
  // Documents API Endpoints
  app.post('/document', Authentication.verifyToken,
    Authentication.validateDocumentsInput, Document.createNew);
  app.get('/document', Authentication.verifyToken, Document.readAll);
  app.get('/document/:id', Authentication.verifyToken,
    Authentication.checkDocumentAccess, Document.readOne);
  app.put('/document/:id', Authentication.verifyToken,
    Authentication.checkDocument, Document.update);
  app.delete('/document/:id', Authentication.verifyToken,
    Authentication.deleteDocumentAccess, Document.delete);
  app.get('/search/documents', Authentication.verifyToken, Document.search);

  // Roles API Endpoints
  app.post('/roles', Authentication.verifyToken,
    Authentication.checkAdmin, Role.createNew);
  app.get('/roles', Authentication.verifyToken,
    Authentication.hasAdminPermission, Role.readAll);
  app.get('/roles/:id', Authentication.verifyToken,
    Authentication.hasAdminPermission, Role.readOne);
  app.put('/roles/:id', Authentication.verifyToken,
    Authentication.hasAdminPermission,
    Authentication.checkRolePermission, Role.update);
  app.delete('/roles/:id', Authentication.verifyToken,
    Authentication.hasAdminPermission,
    Authentication.checkRolePermission, Role.delete);

  // Users API Endpoints
  app.post('/user', Authentication.validateUserInput, User.create);
  app.get('/user', Authentication.verifyToken,
    Authentication.validateUserSearch, User.readAll);
  app.get('/user/:id', Authentication.verifyToken,
    Authentication.validateSingleUserSearch, User.readOne);
  app.put('/user/:id', Authentication.verifyToken,
    Authentication.validateUpdateUser, User.update);
  app.delete('/user/:id', Authentication.verifyToken,
    Authentication.validateDeleteUser, User.delete);
  app.get('/user/:id/documents', Authentication.verifyToken);
  app.post('/user/login', Authentication.validateLoginData, User.login);
  app.post('/user/logout', Authentication.verifyToken, User.logout);
  app.get('/search/user', Authentication.verifyToken,
    Authentication.hasAdminPermission,
    Authentication.validateUserSearch, User.search);
};
