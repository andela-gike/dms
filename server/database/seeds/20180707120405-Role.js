module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Role', [
    {
      title: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Role',
    null, {})
};
