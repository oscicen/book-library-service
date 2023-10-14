const env = process.env;

const config = {
  db: { /* do not put password or any sensitive info here, done only for demo */
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  jwtSecret: env.JWT_SECRET_KEY,
  listPerPage: env.LIST_PER_PAGE || 6,
};

module.exports = config;