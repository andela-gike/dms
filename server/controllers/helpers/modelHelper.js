// @flow
import faker from 'faker';

const Helper = {
  createAdmin: () => {
    const roleId = 1;
    const fakeAdminUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roleId
    };
    return fakeAdminUser;
  },

  createUser: () => {
    const roleId = 2;
    const fakeUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roleId
    };
    return fakeUser;
  },

  createAdminRole: () => {
    const testAdminRole = {
      title: 'admin',
    };
    return testAdminRole;
  },

  createRegularRole: () => {
    const sampleRole = {
      title: 'regular'
    };
    return sampleRole;
  },

  createDocument: () => {
    const fakeDocument = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      access: 'public'
    };
    return fakeDocument;
  },

  publicDocument: {
    title: faker.company.catchPhrase(),
    content: faker.lorem.paragraph()
  },

  createPrivateDocument: () => {
    const testDocument = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(),
      access: 'private',
    };
    return testDocument;
  },

  createRoleDocument: () => {
    const sampleDocument = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(),
      access: 'role',
    };
    return sampleDocument;
  },

  documentsBundle() {
    const documentProperties = [];
    for (let doc = 0; doc <= 15; doc += 1) {
      documentProperties.push({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraph(),
        userId: 1
      });
    }
    return documentProperties;
  },

  userArray() {
    const userAttributes = [];

    for (let user = 0; user <= 10; user += 1) {
      userAttributes.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        roleId: 2
      });
    }

    return userAttributes;
  },
};

export default Helper;
