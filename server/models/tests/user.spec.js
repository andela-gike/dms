// @flow
import model from '../../models';
import helper from '../../controllers/helpers/modelHelper';

describe('The User Model Test Suite', () => {
  // const requiredParams = [ 'firstName', 'lastName',
  //   'userName', 'email',
  //   'password', 'roleId' ];
  // const uniqueParams = [ 'userName', 'email' ];
  const fakeUser = helper.createUser();

  let user;
  describe('The Process of creation of a User', () => {
    beforeAll((done) => {
      model.Role.create({ title: 'regular', id: 2 })
        .then((createdRole) => {
          fakeUser.roleId = createdRole.id;
          return model.User.create(fakeUser);
        })
        .then((createdUser) => {
          user = createdUser;
          done();
        });
    });

    afterAll(() => model.User.sequelize.sync({ force: true }));

    afterEach(() => model.User.destroy({ where: {} }));

    it('should create a new user', () => {
      expect(user).toBeObject;
      expect(user).toExist;
    });

    it('should ensure that created user has firstName', () => {
      expect(user.firstName).toEqual(fakeUser.firstName);
    });

    it('should ensure that created user has lastName', () => {
      expect(user.lastName).toEqual(fakeUser.lastName);
    });

    it('should ensure that created user has userName', () => {
      expect(user.userName).toEqual(fakeUser.userName);
    });

    it('should ensure that created user has email', () => {
      expect(user.email).toEqual(fakeUser.email);
    });

    it('should ensure that user password is hashed', () => {
      expect(user.password).not.toEqual(fakeUser.password);
    });

    // it('should not create a user when email is invalid', () => { });

  });

});
