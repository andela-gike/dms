// @flow
import model from '../../models';
import helper from '../../controllers/helpers/modelHelper';

describe('The User Model Test Suite', () => {
  const requiredParams = [ 'firstName', 'lastName',
    'userName', 'email',
    'password', 'roleId' ];
  const uniqueParams = [ 'userName', 'email' ];
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

    afterAll(async() => await model.User.sequelize.sync({ force: true }));

    afterEach(async () => await model.User.destroy({ where: {} }));

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
  });

  describe('The working of the Validation of the User model', () => {
    requiredParams.forEach((attr) => {
      it(`fails without ${ attr }`, () => {
        user[ attr ] = null;

        return user.save()
          .then(newUser => expect(newUser).toExist)
          .catch(err =>
            expect(/notNull/.test(err.message)).toBeTruthy);
      });
    });

    uniqueParams.forEach((attr) => {
      it(`requires ${ attr } field to be Unique`, () =>
        user.save()
          .then((newUser) => {
            fakeUser.roleId = newUser.roleId;
            return model.User.build(fakeUser).save();
          })
          .then(newUser2 => expect(newUser2).toExist)
          .catch(err =>
            expect(/UniqueConstraintError/.test(err.name)).toBeTruthy));
    });

    it('should require an authentic user email', () => {
      user.email = 'invalid email';
      user.save()
        .catch((error) => {
          expect(/isEmail failed/.test(error.message)).toBeTruthy;
          expect(/SequelizeValidationError/.test(error.name)).toBeTruthy;
        });
    });
  });

});
