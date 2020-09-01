'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique'
    })

  },

  down: (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        return queryInterface.removeConstraint('Users', {
      fields: ['email'],
      type: 'unique'
    })
  }
};

/**
 *     queryInterface.addConstraint(
      "Users",
      ["email"],
      {
        type: "unique",
        name: "emailUnique"
    })
    
    queryInterface.removeConstraint(
      'Users',
      'emailUnique'
    )
 */
