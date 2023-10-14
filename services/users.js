const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./db');
const config = require('../config');

function validateCreate(user) {
  let messages = [];

  console.log(user);
  console.log('Config: ', config);

  if (!user) {
    messages.push('No object is provided');
  }

  if (!user.firstName || !user.lastName) {
    messages.push('First Name or Last Name is empty');
  }

  if (!user.email) {
    messages.push('Email is empty');
  }

  if (!user.password) {
    messages.push('Password is empty');
  }

  if (user.firstName && user.firstName.length > 255) {
    messages.push('First name cannot be longer than 255 characters');
  }

  if (user.lastName && user.lastName.length > 255) {
    messages.push('Last name cannot be longer than 255 characters');
  }

  if (user.email && user.email.length > 255) {
    messages.push('Email cannot be longer than 255 characters');
  }

  if (user.password && user.password.length > 255) {
    messages.push('Password cannot be longer than 255 characters');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function create(user){
  validateCreate(user);

  const oldUser = await db.query(
    'SELECT * FROM users WHERE user_email=$1;',
    [user.email]
  );

  if (oldUser.length) {
    let error = new Error('Email already exists. Please login');
    error.statusCode = 409;

    throw error;
  }

  const email = user.email.toLowerCase();
  const encryptedPassword = await bcrypt.hash(user.password, 10);
  const type = user?.type || 2;

  const result = await db.query(
    'INSERT INTO users(first_name, last_name, user_email, user_password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user.firstName, user.lastName, email, encryptedPassword, type]
  );

  if (result.length) {
    const token = jwt.sign(
      { email },
      config.jwtSecret,
      { expiresIn: '2h' }
    );

    user.token = token;
  }

  return { user };
}

module.exports = {
  create
}