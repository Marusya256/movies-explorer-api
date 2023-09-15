require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new AuthError('Необходима авторизация'));
    } else {
      next(err);
    }
  }

  req.user = payload;

  return next();
};
