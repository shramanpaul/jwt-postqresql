const express = require('express');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const { Pool } = require('pg');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const pool = new Pool({
  user: 'paul',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: 5432,
});

pool.connect()
  .then(() => {
    app.listen(3000);
    console.log('Connected to the database and listening on port 3000');
  })
  .catch((err) => console.error('Error connecting to the database', err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
