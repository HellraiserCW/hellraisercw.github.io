const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { User } = require('../models/User');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const renderLoginPage = (req, res) => {
  res.render('index.html');
};

const renderSignupPage = (req, res) => {
  res.render('register.html');
};

const renderResetPwdPage = (req, res) => {
  res.render('resetpwd.html');
};

const renderHomePage = (req, res) => {
  res.render('home.html');
};

const renderSettingsPage = (req, res) => {
  res.json({
    user: {
      _id: req.userProfile._id,
      role: req.userProfile.role,
      email: req.userProfile.email,
      created_date: req.userProfile.created_date,
    },
  });
};

const createProfile = async (req, res, next) => {
  const {
    nickname,
    email,
    password,
    role,
  } = req.body;
  const isUser = await User.findOne({ email });

  if (isUser) {
    res.status(400).json({ message: 'Email already in use' });
  } else {
    const user = new User({
      nickname,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    user.save()
      .catch((err) => {
        next(err);
      });

    const payload = {
      username: user.nickname,
      _id: user.id,
      role: user.role,
      email: user.email,
      created_date: user.created_date,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

    res.status(200).json({ message: 'Profile created succesfully', jwt_token: jwtToken });
  }
};

const loginProfile = async (req, res) => {
  const isUser = await User.findOne({ email: req.body.email });

  if (isUser && await bcrypt.compare(String(req.body.password), String(isUser.password))) {
    const payload = {
      username: isUser.nickname,
      _id: isUser.id,
      role: isUser.role,
      email: isUser.email,
      created_date: isUser.created_date,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

    res.status(200).json({ jwt_token: jwtToken });
  } else if (!isUser) {
    res.status(400).json({ message: 'Email is not registered' });
  } else {
    res.status(401).json({ message: 'Wrong password' });
  }
};

const restorePassword = async (req, res) => {
  const { email } = req.body;
  const isUser = await User.findOne({ email });
  if (!isUser) {
    res.status(400).json({ message: 'Email is not registered' });
  } else {
    const newPWD = Math.random().toString(36).slice(-8);
    const msg = {
      to: email,
      from: 'hellraisercw@gmail.com',
      subject: 'Cargo App password reset',
      text: `Your new password is: ${newPWD}`,
    };
    (async () => {
      try {
        await sgMail.send(msg);
      } catch (err) {
        console.error(err);

        if (err.response) {
          console.error(err.response.body);
        }
      }
    })();
    isUser.password = await bcrypt.hash(newPWD, 10);
    isUser.save();
    res.status(200).json({ message: 'New password was sent to your email address' });
  }
};

const renderUserLogout = async (req, res) => {
  res.clearCookie('jwt_token')
    .redirect('/');
};

const renderChangeUserPassword = async (req, res) => {
  const user = await User.findById(req.userProfile._id);
  const match = await bcrypt
    .compare(String(req.body.oldPassword), String(user.password));

  if (!match) {
    return res.status(400).json({ message: 'Wrong current password!' });
  }

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.save();

  return res.status(200).json({ message: 'Password changed successfully' });
};

const renderDeleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userProfile._id);

    return res.clearCookie('jwt_token')
      .redirect('/');
  } catch (err) {
    return console.error(err);
  }
};

module.exports = {
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
};
