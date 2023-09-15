const mongoose = require('mongoose');
const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const NotOwnerError = require('../errors/not-owner-err');

const getMovies = (req, res, next) => {
  Movie.find({ owner: { _id: req.user._id } })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

const postMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    movieId,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movies) => {
      res.status(201).send(movies);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const deleteMovies = (req, res, next) => {
  Movie.findById(req.params.id).orFail(new NotFoundError('Документ с указанным ID не найден.'))
    .then((movies) => {
      if (req.user._id === movies.owner._id.toString()) {
        Movie.findByIdAndRemove(req.params.id).orFail(new NotFoundError('Документ с указанным ID не найден. !!!!!!!!!'))
          .then((newMovies) => res.send(newMovies));
      } else {
        throw new NotOwnerError('Карточка не может быть удалена, т.к. вы не являетесь создателем карточки');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Передан некорректный ID.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  postMovies,
  deleteMovies,
};
