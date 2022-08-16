const express = require('express');

const router = new express.Router();
const {
  createProfile,
  login,
} = require('../services/authService');

router.post('/register', createProfile);

router.post('/login', login);

module.exports = {
  authRouter: router,
};
