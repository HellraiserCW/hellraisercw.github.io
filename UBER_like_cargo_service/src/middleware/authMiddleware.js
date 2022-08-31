const jwt = require('jsonwebtoken');

const frontAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.cookie || req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({
      message: 'Please, provide authorization header',
    });
  }
  const cookieList = {};
  let token = null;

  if (!req.headers.cookie) {
    [, token] = authorization.split(' ');
    if (!token) {
      return res.status(400).json({
        message: 'Please, include token to request',
      });
    }
  } else if (!req.headers.authorization) {
    authorization.split(';').forEach((cookie) => {
      // eslint-disable-next-line prefer-const
      let [name, ...rest] = cookie.split('=');
      name = name?.trim();
      if (!name) return;
      const value = rest.join('=').trim();
      if (!value) return;
      cookieList[name] = decodeURIComponent(value);
    });

    if (!cookieList.jwt_token) {
      return res.status(400).json({
        message: 'Please, include token to request',
      });
    }
    token = cookieList.jwt_token;
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_KEY);
    req.userProfile = tokenPayload;
    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  frontAuthMiddleware,
};
