require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require("express-session");

const flash        = require("connect-flash");
const User         = require('./models/User');
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  const app_name = require('./package.json').name;
  const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
  
  const app = express();
  
  // Middleware Setup
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  app.use(require('node-sass-middleware')({
    src:  path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true
  }));
  
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
  
  
  
  app.use(session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  }));
  
  app.use(passport.initialize());
  
  app.use(passport.session());
  
  app.use(flash());
  
  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));





  app.use((req, res, next) => {
    res.locals.theUser = req.user;
    // with passport, its always called req.user by default
    res.locals.successMessage = req.flash('success')
    res.locals.errorMessage = req.flash('error');
    next();
  });
  
  
// default value for title local
app.locals.title = 'ForumHack';

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})



const index = require('./routes/index');
app.use('/', index);

const user = require('./routes/user');
app.use('/', user);

const timeline = require('./routes/timeline');
app.use('/', timeline);

const dream = require('./routes/dream');
app.use('/', dream);

const comments = require('./routes/comments');
app.use('/', comments);

module.exports = app;
