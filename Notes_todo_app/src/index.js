const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

const {authMiddleware} = require('./middleware/authMiddleware');
const {authRouter} = require('./routers/authRouter');
const {notesRouter} = require('./routers/notesRouter');
const {usersRouter} = require('./routers/usersRouter');
const {renderRouter} = require('./routers/renderRouter');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(morgan('tiny'));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use('/api/auth', authRouter);
app.use('/api/notes', authMiddleware, notesRouter);
app.use('/api/users/me', authMiddleware, usersRouter);
app.use('/', renderRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONN);
    app.listen(process.env.PORT);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send({message: 'Server error'});
}

app.use(errorHandler);
