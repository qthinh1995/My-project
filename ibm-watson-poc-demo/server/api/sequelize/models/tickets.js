"use strict";

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    title: DataTypes.STRING,
    key: DataTypes.STRING,
    type: DataTypes.STRING,
    priority: DataTypes.STRING,
    reporter: DataTypes.STRING,
    assignee: DataTypes.STRING,
    parentId: DataTypes.STRING,
    projectId: DataTypes.STRING,
    childrenId: DataTypes.STRING,
    printVersion: DataTypes.STRING,
    desc: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // todo
      }
    }
  });

  return Ticket;
};
