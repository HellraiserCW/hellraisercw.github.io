const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../models/User');

const createProfile = async (req, res, next) => {
  const {username, password} = req.body;

  const user = new User({
    username: username,
    password: await bcrypt.hash(password, 10),
  });

  return user
      .save()
      .then(res.status(200).json({message: 'Success'}))
      .catch((err) => {
        next(err);
      });
};

const login = async (req, res) => {
  const user = await User.findOne({username: req.body.username});

  if (
    user &&
    await bcrypt.compare(String(req.body.password), String(user.password))
  ) {
    const payload = {
      username: user.username,
      userId: user._id,
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY);

    return res.status(200).json({message: 'Success', jwt_token: jwtToken});
  }

  return res.status(400).json({message: 'Not authorized'});
};

module.exports = {
  createProfile,
  login,
};
