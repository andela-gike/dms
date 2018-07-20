// @flow
import models from '../../models';
import helper from '../../controllers/helpers/modelHelper';

const firstRole = helper.createAdminRole();
let role;
describe('The Role Model Test Suite', () => {
  describe('The Process of creation of a Role', () => {
    beforeAll(() => {
      models.Role.create(firstRole)
        .then((createdRole) => {
          role = createdRole;
        });
    });

    afterAll(() => {
      models.Role.destroy({ where: {} });
    });

    it('should allow a creator to define the title of role created', () => {
      expect(role.title).toEqual(firstRole.title);
    });
  });
});