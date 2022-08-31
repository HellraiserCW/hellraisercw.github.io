const express = require('express');
const { frontAuthMiddleware } = require('../middleware/authMiddleware');

const router = new express.Router();
const {
  createTruck,
  getUserTrucks,
  getUserTruckById,
  assignTruck,
  updateTruck,
  deleteTruck,
} = require('../services/truckService');

router.post('/api/trucks', frontAuthMiddleware, createTruck);
router.get('/api/trucks', frontAuthMiddleware, getUserTrucks);
router.get('/api/trucks/:id', frontAuthMiddleware, getUserTruckById);
router.post('/api/trucks/:id/assign', frontAuthMiddleware, assignTruck);
router.put('/api/trucks/:id', frontAuthMiddleware, updateTruck);
router.delete('/api/trucks/:id', frontAuthMiddleware, deleteTruck);

module.exports = {
  truckRouter: router,
};
