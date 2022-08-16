const express = require('express');
const {Note} = require('../models/Note');
const {User} = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {frontAuthMiddleware} = require('../middleware/frontAuthMiddleware');

const router = new express.Router();

router.get('/notes', frontAuthMiddleware, async (req, res) => {
  console.log(req.userProfile.userId);
  const notes = await Note.find({userId: req.userProfile.userId}).lean();

  res.render('notes', {
    title: 'Notes list',
    isIndex: true,
    notes,
  });
});

router.get('/create', frontAuthMiddleware, (req, res) => {
  res.render('create', {
    title: 'Create note',
    isCreate: true,
  });
});

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Login',
    isLogin: true,
  });
});

router.post('/create', frontAuthMiddleware, async (req, res) => {
  const note = new Note({
    text: req.body.text,
    userId: req.userProfile.userId,
  });

  await note.save();
  res.redirect('/notes');
});

router.post('/complete', frontAuthMiddleware, async (req, res) => {
  const note = await Note.findById(req.body.id);

  note.completed = !!req.body.completed;
  await note.save();
  res.redirect('/notes');
});

router.post('/delete', frontAuthMiddleware, async (req, res) => {
  await Note.findByIdAndDelete(req.body.id);
  res.redirect('/notes');
});

router.post('/', async (req, res, next) => {
  const {username, password} = req.body;
  const isUser = await User.findOne({username: username});

  if (!isUser) {
    const user = new User({
      username: username,
      password: await bcrypt.hash(password, 10),
    });
    const payload = {
      username: user.username,
      userId: user._id,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

    user.save().catch((err) => {
      next(err);
    });

    res.status(200).cookie('jwtToken', jwtToken, {
      httpOnly: true,
    }).redirect('/notes');
  } else if (await bcrypt.compare(String(password), String(isUser.password))) {
    const payload = {
      username: isUser.username,
      userId: isUser._id,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

    res.status(200).cookie('jwtToken', jwtToken, {
      httpOnly: true,
    }).redirect('/notes');
  } else {
    res.status(400).format({
      'text/html': function() {
        res.send('<h1>Wrong password, <a href="/">try again</a></h1>');
      },
    });
  }
});

router.post('/logout', async (req, res, next) => {
  res.clearCookie('jwtToken')
      .redirect('/');
});

module.exports = {
  renderRouter: router,
};
