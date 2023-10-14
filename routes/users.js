const express = require('express');
const router = express.Router();
const users = require('../services/users');

/* POST user */
router.post('/', async function(req, res, next) {
  try {
    res.json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while creating user `, err.message);
    next(err);
  }
});

module.exports = router;
