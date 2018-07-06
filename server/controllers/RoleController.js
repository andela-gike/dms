import db from '../models';

const RoleController = {
  /**
    * Create a new role
    * Route: POST: /roles/
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  createNew(request, response) {
    let roleData = {};
    roleData = { title: request.body.title };
    if (!request.body.title) {
      return response.status(400).send({ message: 'Title cannot be blank' });
    }
    db.Role.findOne({
      where: { title: request.body.title }
    })
      .then((result) => {
        if (result) {
          return response.status(409).send({
            message: 'Role already exists'
          });
        }
        return db.Role
          .create(roleData)
          .then((role) => {
            response.status(201).send({
              message:
            'The role was successfully created',
              role
            });
          })
          .catch((err) => {
            response.status(400).send({ message:
            'There was a error creating this role',
            err });
          });
      });
  },

  /**
    * Get all roles
    * Route: GET: /roles/
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  readAll(request, response) {
    db.Role
      .findAll()
      .then((allRoles) => {
        response.status(200).send({ message:
          'This is a list of the available roles',
        data: allRoles });
      })
      .catch((err) => {
        response.status(404).send({ message:
          'A problem was encountered while getting roles', err });
      });
  },

  /**
    * Get role by id
    * Route: GET: /roles/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  readOne(request, response) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: 'Error occured while retrieving role'
      });
    }
    db.Role
      .findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(404).send({ message:
            `Role with the id: ${ request.params.id } does not exist` });
        }
        response.status(200).send({ message:
          'The Role you want has been found',
        data: role });
      });
  },

  /**
    * Update roles
    * Route: PUT: /roles/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  update(request, response) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: 'Error occured while updating role'
      });
    }
    const title = request.body.title;
    if (!title) {
      return response.status(404).send({ message:
        'You need to write the Title you want to update' });
    }
    db.Role
      .findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(404).send({
            message: 'Role Not Found',
          });
        }
        return role
          .update({
            title,
          })
          .then(() => response.status(200).send({
            role,
            message: 'Role updated successfully.'
          }))
          .catch(() => response.status(400).send({
            message: 'Role did not update successfully.'
          }));
      })
      .catch(() => response.status(400).send({
        message: 'Error occured while updating role'
      }));
  },

  /**
    * Delete a Role
    * Route: DELETE: /roles/:id
    * @param {Object} request request object
    * @param {Object} response response object
    * @returns {void} no returns
    */
  delete(request, response) {
    request.roleInstance.destroy()
      .then(() => {
        response.status(200)
          .send({
            message: 'This role has been deleted successfully'
          });
      });
  },

};
export default RoleController;
