const bcrypt = require('bcryptjs');

const {User} = require('../models/User');

const getProfileInfo = async (req, res) => {
  try {
    return User.findById(req.userProfile.userId)
        .then(
            res.status(200).json({
              user: {
                _id: req.userProfile.userId,
                username: req.userProfile.username,
                createdDate: new Date(req.userProfile.iat).toISOString(),
              },
            }),
        );
  } catch (err) {
    throw err;
  }
};

const changeProfilePassword = async (req, res) => {
  const user = await User.findById(req.userProfile.userId);
  const match = await bcrypt
      .compare(String(req.body.oldPassword), String(user.password));

  if (!match) {
    return res.status(400).json({
      message: 'Please enter correct current password',
    });
  }
  try {
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.save();

    return res.status(200).json({message: 'Success'});
  } catch (err) {
    throw err;
  }
};

const deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userProfile.userId);

    return res.status(200).json({message: 'Success'});
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getProfileInfo,
  changeProfilePassword,
  deleteProfile,
};
