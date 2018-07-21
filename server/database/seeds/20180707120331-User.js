import Faker from 'faker';
import Bcrypt from 'bcrypt';

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('User', [
    {
      id: 1,
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      userName: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: Bcrypt.hashSync('teller321', Bcrypt.genSaltSync(10)),
      roleId: 1,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      userName: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: Bcrypt.hashSync('miller321', Bcrypt.genSaltSync(10)),
      roleId: 2,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('User',
    null, {})
};
