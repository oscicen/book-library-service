const express = require('express');
const router = express.Router();
const favorites = require('../services/favorite-books');
const auth = require("../middleware/auth");

// GET favorite books listing
router.get('/', auth, async function(req, res, next) {
  try {
    res.json(await favorites.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting favorite books`, err.message);
    next(err);
  }
});

// POST favorite books
router.post('/', auth, async function(req, res, next) {
  try {
    res.json(await favorites.create(req.body));
  } catch (err) {
    console.error(`Error while posting favorite books`, err.message);
    next(err);
  }
});

// DELETE favorite books
router.delete('/', auth, async function(req, res, next) {
  try {
    res.json(await favorites.remove(req.query.id));
  } catch (err) {
    console.error(`Error while deleting favorite book`, err.message);
    next(err);
  }
});

module.exports = router;