const express = require('express');

const router = new express.Router();
const {
  getProfileInfo,
  changeProfilePassword,
  deleteProfile,
} = require('../services/usersService');

router.get('/', getProfileInfo);

router.patch('/', changeProfilePassword);

router.delete('/', deleteProfile);

module.exports = {
  usersRouter: router,
};
