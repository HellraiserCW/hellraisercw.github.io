const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const app = express();

const { renderRouter } = require('./routers/renderRouter');
const { truckRouter } = require('./routers/truckRouter');
const { loadRouter } = require('./routers/loadRouter');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'html');
app.set('views', './src/views');
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(express.json());
app.use('/', renderRouter);
app.use('/', truckRouter);
app.use('/', loadRouter);

const start = () => {
  try {
    mongoose.connect(process.env.MONGO_DB_CONN);
    app.listen(process.env.PORT);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send({ message: 'Server error' });
}

app.use(errorHandler);
