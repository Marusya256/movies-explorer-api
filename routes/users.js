const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUser,
  updateUser,
  signOut,
} = require('../controllers/users');

router.get('/users/me', auth, getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
}), auth, updateUser);
router.post('/users/me/signout', auth, signOut);

module.exports = router;
