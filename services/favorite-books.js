const db = require('./db');

async function getMultiple() {
  const favorite_books = await db.query(
    'SELECT * FROM favorite_books', 
    [offset, config.listPerPage]
  );

  return {
    favorite_books
  }
}

async function create(favorite) {
  if (!favorite.bookId && !favorite.userId) {
    let error = new Error('Book or user id not provided.');
    error.statusCode = 400;

    throw error;
  }

  const favoriteBook = await db.query(
    'SELECT * FROM favorite_books WHERE user_id=$1 AND book_id=$2;',
    [favorite.userId, favorite.bookId]
  );

  if (favoriteBook.length) {
    let error = new Error('Book already added to favorites.');
    error.statusCode = 409;

    throw error;
  }

  const result = await db.query(
    'INSERT INTO favorite_books(user_id, book_id) VALUES ($1, $2) RETURNING *',
    [favorite.userId, favorite.bookId]
  );

  let message = 'Error in creating favorite book';

  if (result.length) {
    message = 'Favorite book created successfully';
  }

  return { message };
}

async function remove(id) {
  if (!id) {
    let error = new Error('Could not delete favorite book. No id provided.');
    error.statusCode = 400;

    throw error;
  }

  const result = await db.query(
    'SELECT * FROM favorite_books WHERE id=$1;',
    [id]
  );

  await db.query(
    'DELETE FROM favorite_books WHERE id=$1;',
    [id]
  );

  let message = `There's no favorite book with id: ${ id }`;

  if (result.length) {
    message = 'Favorite book removed successfully';
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  remove,
};
