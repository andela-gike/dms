import db from '../models';
import helper from './helpers/index';

const DocumentController = {
  /**
    * Create a new document
    * Route: POST: /documents/
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void|Object} response object or void
    */
  createNew(request, response) {
    db.Document.findOne({ where: { title: request.body.title } })
      .then((documentExists) => {
        if (documentExists) {
          return response.status(409).send({
            message: 'This document already exists'
          });
        }
      });
    db.Document
      .create(request.docInput)
      .then((document) => {
        response.status(201).send({
          message: 'Document created successfully',
          data: document
        });
      })
      .catch((err) => {
        response.status(400).send(err.errors);
      });
  },

  /**
   * read all documents
   * Route: GET: /documents
   * @param {Object} request request object
   * @param {Object} response response object
   *  @returns {void|Response} response object or void
   */
  readAll(request, response) {
    const userAttribute = {
      user: helper.getUserAttribute(),
    };
    let query;
    if (request.decodedToken.roleId === 1) {
      query = { where: {} };
    } else {
      query = {
        where: {
          access: 'public'
        }
      };
    }
    query.include = userAttribute.user;
    query.limit = request.query.limit || 10;
    query.offset = request.query.offset || 0;
    query.order = [ [ 'createdAt', 'DESC' ] ];
    db.User.findById(request.decodedToken.userId)
      .then((user) => {
        if (!user) {
          return response.status(404).send({
            success: false,
            message: 'User Not Found'
          });
        }
        db.Document
          .findAndCountAll(query)
          .then((documents) => {
            const condition = {
              count: documents.count,
              limit: query.limit,
              offset: query.offset
            };
            delete documents.count;
            const pagination = helper.pagination(condition);
            if (request.decodedToken.roleId === 1) {
              response.status(200)
                .send({
                  message: 'You have successfully retrieved all documents',
                  documents,
                  pagination
                });
            } else {
              response.status(200)
                .send({
                  message: 'You have successfully retrieved all public documents',
                  documents,
                  pagination
                });
            }
          })
          .catch(error => response.status(400).send({
            error,
            message: 'Error occurred while retrieving documents'
          }));
      });
  },

  /**
   * read a particular document
   * Route: GET: /documents/:id
   * @param {Object} request request object
   * @param {Object} response response object
   * @returns {void|Response} response object or void
   */
  readOne(request, response) {
    response.status(200)
      .send(
        {
          document: request.document
        });
  },

  /**
   * Update a particular document
   * Route: PUT: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Response|void} response object or void
   */
  update(request, response) {
    if (!request.body.title && !request.body.content) {
      return response.status(400).send({
        message: 'No update detected'
      });
    }
    request.doc
      .update(request.body)
      .then((data) => {
        response.status(200)
          .send(
            {
              document: data,
              message: 'Document updated successfully'
            }
          );
      });
  },

  /**
   * Delete a particular document
   * Route: DELETE: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Response|void} response object or void
   */
  delete(request, response) {
    request.Document
      .destroy(
        {
          where: {
            id: request.Document.id
          }
        })
      .then(() => response.status(200)
        .send(
          {
            success: true,
            message: 'Document was deleted successfully'
          }
        ));
  },

  /**
   * Search for documents by title
   * Route: GET: /search/documents?q={title}
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void} no returns
   */
  search() {}

};
export default DocumentController;
