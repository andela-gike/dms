// @flow
import model from '../../models';
import helper from '../../controllers/helpers/modelHelper';

const fakeUser = helper.createUser();
const fakeDocument = helper.createDocument();

const requiredFields = [ 'title', 'content', 'access' ];

describe('The Document Model Test Suite', () => {
  let document;
  describe('How The Document Model Works', () => {
    let user;

    beforeAll((done) => {
      model.Role.create(helper.createAdminRole())
        .then((createdRole) => {
          fakeUser.roleId = createdRole.id;
          return model.User.create(fakeUser);
        })
        .then((createdUser) => {
          user = createdUser;
          fakeDocument.userId = user.id;
          done();
        });
    });

    beforeEach(() => {
      document = model.Document.build(fakeDocument);
    });

    afterEach(async () => await model.Document.destroy({ where: {} }));

    afterAll(async() => await model.Document.sequelize.sync({ force: true }));

    it('should be allow for the creation of a document', () => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument).toExist;
          expect(typeof createdDocument).toBeObject;
        });
    });

    it('should create a document that has both title and content', () => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument.title).toEqual(fakeDocument.title);
          expect(createdDocument.content).toEqual(fakeDocument.content);
        }).catch(err => expect(err).not.toExist);
    });

    it('should not the time the document was created', () => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument.createdAt).toExist;
        }).catch(err => expect(err).not.toExist);
    });

    it('should have the access privilege of a created document specified',
      () => {
        document.save()
          .then((createdDocument) => {
            expect(createdDocument.access).toEqual('public');
          }).catch(err => expect(err).not.toExist);
      });

    describe('Document Model Validations', () => {
      requiredFields.forEach((field) => {
        it(`requires a ${ field } field to create a document`, () => {
          document[ field ] = null;
          return document.save()
            .then(newDoc => expect(newDoc).not.toExist)
            .catch((error) => {
              expect(/notNull Violation/.test(error.message)).toBeTruthy;
            });
        });
      });

      it('fails for invalid access type', () => {
        document.access = 'invalid access';
        return document.save()
          .then(newDocument => expect(newDocument).not.toExist)
          .catch(err => expect(/isIn failed/.test(err.message)).toBeTruthy);
      });
    });
  });
});
