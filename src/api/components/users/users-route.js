const express = require('express');

const usersController = require('./users-controller');

const router = express.Router();

module.exports = (app) => {
  app.use('/users', router);
  router.get('/', usersController.getUsers);
  router.post('/', usersController.createUser);
  router.get('/:id', usersController.getUser);
  router.put('/:id', usersController.updateUser);
  router.put('/:id/change-password', usersController.changePassword);
  router.delete('/:id', usersController.deleteUser);
};
