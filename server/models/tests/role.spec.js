// @flow
import models from '../../models';
import helper from '../../controllers/helpers/modelHelper';

const firstRole = helper.createAdminRole();
let role;
describe('The Role Model Test Suite', () => {
  describe('The Process of creation of a Role', () => {
    beforeAll((done) => {
      models.Role.create(firstRole)
        .then((createdRole) => {
          role = createdRole;
          done();
        });
    });

    afterEach(async () => await models.Role.destroy({ where: {} }));

    afterAll(async() => await models.Role.sequelize.sync({ force: true }));

    it('creates a role instance', () => {
      expect(role).toExist;
    });

    it('should allow a creator to define the title of role created', () => {
      expect(role.title).toEqual(firstRole.title);
    });

    it('saves role with valid attributes', () =>
      role.save()
        .then(newRole => expect(newRole.title).toEqual(role.title)));

    it('has at least "admin" roles', () =>
      models.Role.findAll()
        .then((roles) => {
          expect(roles [ 0 ].title).toEqual('admin');
        }));
  });

  describe('Role Model Validations Test Suite', () => {
    it('should ensure that a title is given before a role can be created',
      () => {
        models.Role.create()
          .catch((error) => {
            expect(/notNull Violation/.test(error.message)).toBeTruthy;
          });
      });
    it(`should ensure that it is impossible
      to create two roles with the same title`,
    () => {
      models.Role.create(firstRole)
        .then(() => {
          // attempt to create a second role with same title
          models.Role.create(firstRole)
            .catch((error) =>
              expect(/UniqueConstraintError/.test(error.name)).toBeTruthy);
        });
    });
  });
});
