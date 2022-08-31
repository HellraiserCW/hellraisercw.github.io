const express = require('express');
const { frontAuthMiddleware } = require('../middleware/authMiddleware');

const router = new express.Router();
const {
  createLoad,
  getUserLoads,
  getUserLoadById,
  updateLoad,
  deleteLoad,
  postLoad,
  shippingInfoLoad,
  getUserActiveLoad,
  iterateLoadState,
} = require('../services/loadService');

router.post('/api/loads', frontAuthMiddleware, createLoad);
router.get('/api/loads', frontAuthMiddleware, getUserLoads);
router.get('/api/loads/active', frontAuthMiddleware, getUserActiveLoad);
router.patch('/api/loads/active/state', frontAuthMiddleware, iterateLoadState);
router.get('/api/loads/:id', frontAuthMiddleware, getUserLoadById);
router.put('/api/loads/:id', frontAuthMiddleware, updateLoad);
router.delete('/api/loads/:id', frontAuthMiddleware, deleteLoad);
router.post('/api/loads/:id/post', frontAuthMiddleware, postLoad);
router.get('/api/loads/:id/shipping_info', frontAuthMiddleware, shippingInfoLoad);

module.exports = {
  loadRouter: router,
};
