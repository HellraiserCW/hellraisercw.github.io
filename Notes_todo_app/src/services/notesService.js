const {Note} = require('../models/Note');

const addUserNotes = async (req, res) => {
  try {
    const note = new Note({
      text: req.body.text,
      userId: req.userProfile.userId,
      checked: false,
    });

    return await note
        .save()
        .then(res.status(200).json({message: 'Success'}));
  } catch (err) {
    throw err;
  }
};

const getUserNotes = async (req, res) => {
  try {
    return await Note.find({
      userId: req.userProfile.userId,
    }).then((result) => {
      res.status(200).json({
        offset: 0,
        limit: 0,
        count: result.length,
        notes: result,
      });
    });
  } catch (err) {
    throw err;
  }
};

const getUserNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);
  const userId = JSON.stringify(note.userId).slice(1, -1);

  if (userId !== req.userProfile.userId) {
    return res.status(400).json({message: 'Bad request'});
  }
  try {
    return await Note
        .findById(req.params.id)
        .then((note) => {
          res.status(200).json({
            note: note,
          });
        });
  } catch (err) {
    throw err;
  }
};

const updateUserNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);
  const userId = JSON.stringify(note.userId).slice(1, -1);

  if (userId !== req.userProfile.userId) {
    return res.status(400).json({message: 'Bad request'});
  }
  try {
    return await Note.findByIdAndUpdate(req.params.id, {$set: {
      text: req.body.text,
    }}, {new: true})
        .then(res.status(200).json({message: 'Success'}));
  } catch (err) {
    throw err;
  }
};

const toggleCompletedForUserNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);
  const userId = JSON.stringify(note.userId).slice(1, -1);

  if (userId !== req.userProfile.userId) {
    return res.status(400).json({message: 'Bad request'});
  }
  try {
    return await Note.findByIdAndUpdate(req.params.id, {$set: {
      completed: !note.completed,
    }}, {new: true})
        .then(res.status(200).json({message: 'Success'}));
  } catch (err) {
    throw err;
  }
};

const deleteUserNoteById = async (req, res) => {
  const note = await Note.findById(req.params.id);
  const userId = JSON.stringify(note.userId).slice(1, -1);

  if (userId !== req.userProfile.userId) {
    return res.status(400).json({message: 'Bad request'});
  }
  try {
    return await Note.findByIdAndDelete(req.params.id)
        .then(res.status(200).json({message: 'Success'}));
  } catch (err) {
    throw err;
  }
};

module.exports = {
  addUserNotes,
  getUserNotes,
  getUserNoteById,
  updateUserNoteById,
  toggleCompletedForUserNoteById,
  deleteUserNoteById,
};
