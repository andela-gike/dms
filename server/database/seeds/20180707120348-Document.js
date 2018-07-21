import Faker from 'faker';

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Document', [
    {
      userId: 2,
      title: Faker.company.catchPhrase(),
      content: Faker.lorem.paragraphs(),
      access: 'public',
      userRoleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Document',
    null, {})
};
