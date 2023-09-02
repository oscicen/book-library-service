const express = require('express');
const router = express.Router();
const books = require('../services/books');

/* GET books listing. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await books.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting books `, err.message);
    next(err);
  }
});

/* POST books */
router.post('/', async function(req, res, next) {
  try {
    res.json(await books.create(req.body));
  } catch (err) {
    console.error(`Error while posting books `, err.message);
    next(err);
  }
});

/* DELETE books */
router.delete('/', async function(req, res, next) {
  try {
    res.json(await books.remove(req.query.id));
  } catch (err) {
    console.error(`Error while deleting book`, err.message);
    next(err);
  }
});

module.exports = router;
