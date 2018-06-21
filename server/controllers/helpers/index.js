// import jwt from 'jsonwebtoken';
// import config from '../../config/config';

const Helpers = {
  /**
   * roleAccess - check the role of the user
   * @param  {object} document document data
   * @return {BOOLEAN} returns true
   */
  roleAccess(document) {
    return document.access === 'role';
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
   * Check for document's owner
   * @param {Object} doc object
   * @param {Object} req request object
   * @returns {Boolean} true or false
   */
  isOwnerDoc(doc, req) {
    return doc.ownerId === req.decodedToken.userId;
  },
};

export default Helpers;
