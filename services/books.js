const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const [{ count: numberOfRows }] = await db.query('SELECT COUNT(id) FROM books AS total');
  const rows = await db.query(
    'SELECT id, title, author FROM books OFFSET $1 LIMIT $2', 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  console.log(numberOfRows, config.listPerPage)
  const pagination = {
    current: page,
    numberPerPage: config.listPerPage,
    hasPrevious: +page > 1,
    previous: +page - 1,
    hasNext: +page < Math.ceil(numberOfRows / config.listPerPage),
    next: +page + 1,
    lastPage: Math.ceil(numberOfRows / config.listPerPage)
  };

  return {
    rows: data,
    pagination
  }
}

function validateRemove(id) {
  let messages = [];

  if (!id) {
    messages.push('No id is provided');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function getOne(id) {
  validateRemove(id);

  const data = await db.query(
    'SELECT id, title, author FROM books WHERE id=$1;',
    [id]
  );

  return { data };
}

async function remove(id) {
  validateRemove(id);

  const result = await db.query(
    'SELECT * FROM books WHERE id=$1;',
    [id]
  );

  await db.query(
    'DELETE FROM books WHERE id=$1;',
    [id]
  );

  let message = `There's no book with id: ${ id }`;

  if (result.length) {
    message = 'Book removed successfully';
  }

  return { message };
}

function validateCreate(book) {
  let messages = [];

  console.log(book);

  if (!book) {
    messages.push('No object is provided');
  }

  if (!book.title) {
    messages.push('Title is empty');
  }

  if (!book.author) {
    messages.push('Author is empty');
  }

  if (book.title && book.title.length > 255) {
    messages.push('Book title cannot be longer than 255 characters');
  }

  if (book.author && book.author.length > 255) {
    messages.push('Author name cannot be longer than 255 characters');
  }

  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function create(book){
  validateCreate(book);

  const result = await db.query(
    'INSERT INTO books(title, author) VALUES ($1, $2) RETURNING *',
    [book.title, book.author]
  );

  let message = 'Error in creating book';

  if (result.length) {
    message = 'Book created successfully';
  }

  return { message };
}

module.exports = {
  getMultiple,
  getOne,
  create,
  remove
}