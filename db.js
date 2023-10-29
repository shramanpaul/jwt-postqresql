// db.js
const { Pool } = require('pg');
const pool = new Pool({
    user: 'paul',
    host: 'localhost',
    database: 'postgres',
    password: '12345',
    port: 5432,
  });

module.exports = pool;
