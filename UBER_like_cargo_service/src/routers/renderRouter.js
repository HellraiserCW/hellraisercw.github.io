const express = require('express');
const { frontAuthMiddleware } = require('../middleware/authMiddleware');

const router = new express.Router();
const {
  renderLoginPage,
  renderSignupPage,
  renderResetPwdPage,
  renderHomePage,
  renderSettingsPage,
  createProfile,
  loginProfile,
  restorePassword,
  renderUserLogout,
  renderChangeUserPassword,
  renderDeleteUser,
} = require('../services/renderService');

router.get('/', renderLoginPage);
router.get('/home', frontAuthMiddleware, renderHomePage);
router.get('/register', renderSignupPage);
router.get('/resetpwd', renderResetPwdPage);
router.get('/api/users/me', frontAuthMiddleware, renderSettingsPage);
router.post('/api/auth/register', createProfile);
router.post('/api/auth/login', loginProfile);
router.post('/api/auth/forgot_password', restorePassword);
router.get('/logout', renderUserLogout);
router.patch('/api/users/me/password', frontAuthMiddleware, renderChangeUserPassword);
router.delete('/api/users/me', frontAuthMiddleware, renderDeleteUser);

module.exports = {
  renderRouter: router,
};
