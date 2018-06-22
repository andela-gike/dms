import db from '../models';

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
      .create(request.document)
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

  },

  /**
   * read a particular document
   * Route: GET: /documents/:id
   * @param {Object} request request object
   * @param {Object} response response object
   * @returns {void|Response} response object or void
   */
  readOne() {},

  /**
   * Update a particular document
   * Route: PUT: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Response|void} response object or void
   */
  update() {},

  /**
   * Delete a particular document
   * Route: DELETE: /documents/:id
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {Response|void} response object or void
   */
  delete() {},

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
