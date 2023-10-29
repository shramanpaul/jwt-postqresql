const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const pool = new Pool({
    user: 'paul',
    host: 'localhost',
    database: 'postgres',
    password: '12345',
    port: 5432,
});

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'shraman secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'shraman secret', async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        const userId = decodedToken.id;
        try {
          const query = 'SELECT * FROM users WHERE id = $1';
          const { rows } = await pool.query(query, [userId]);
          const user = rows[0];
          res.locals.user = user;
          next();
        } catch (error) {
          console.error('Error retrieving user: ', error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
