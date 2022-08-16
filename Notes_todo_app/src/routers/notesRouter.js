const express = require('express');

const router = new express.Router();
const {
  addUserNotes,
  getUserNotes,
  getUserNoteById,
  updateUserNoteById,
  toggleCompletedForUserNoteById,
  deleteUserNoteById,
} = require('../services/notesService');

router.post('/', addUserNotes);

router.get('/', getUserNotes);

router.get('/:id', getUserNoteById);

router.put('/:id', updateUserNoteById);

router.patch('/:id', toggleCompletedForUserNoteById);

router.delete('/:id', deleteUserNoteById);

module.exports = {
  notesRouter: router,
};
