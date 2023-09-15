const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getMovies,
  postMovies,
  deleteMovies,
} = require('../controllers/movie');

router.get('/movies', auth, getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    movieId: Joi.number().integer().min(1).required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required().min(2).max(250),
    image: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9@:%+-~#=]{2,256}\.[a-z]{2,6}\b([a-zA-Z0-9-.~:/?#[\]@!$&'()+,;=])*/),
    trailerLink: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9@:%+-~#=]{2,256}\.[a-z]{2,6}\b([a-zA-Z0-9-.~:/?#[\]@!$&'()+,;=])*/),
    thumbnail: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9@:%+-~#=]{2,256}\.[a-z]{2,6}\b([a-zA-Z0-9-.~:/?#[\]@!$&'()+,;=])*/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), auth, postMovies);
router.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), auth, deleteMovies);

module.exports = router;
