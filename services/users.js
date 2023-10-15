const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./db');
const config = require('../config');

function validateCreate(user) {
  let messages = [];

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

  await db.query(
    'INSERT INTO users(first_name, last_name, user_email, user_password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user.firstName, user.lastName, email, encryptedPassword, type]
  );

  return { user };
}

async function login({ email, password }) {
  if (!email && !password) {
    let error = new Error('Email and Password are required.');
    error.statusCode = 401;

    throw error;
  }

  const [user] = await db.query(
    'SELECT * FROM users WHERE user_email=$1;',
    [email]
  );

  console.log(user);

  const matchedPasswords = await bcrypt.compare(password, user.user_password);

  console.log(matchedPasswords);

  if (!user.length && !matchedPasswords) {
    let error = new Error('Email or password are invalid.');
    error.statusCode = 401;

    throw error;
  }

  const token = jwt.sign(
    { email },
    config.jwtSecret,
    { expiresIn: '2h' }
  );


  return { token };
}

module.exports = {
  create,
  login,
};
