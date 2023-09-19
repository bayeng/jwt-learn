const express = require('express');
const cors = require('cors');
const router = require('./components/router/index');
const auth = require('./components/middleware/auth');

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());
app.use(router);
app.use('/welcome', auth, (req, res) => {
  res.status(200).json('welcome to jungle');
});

module.exports = app;
