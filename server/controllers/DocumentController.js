// @flow
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
      .create({})
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

  readAll() {

  },

  readOne() {},

  update() {},

  delete() {},

  search() {}

};
export default DocumentController;
