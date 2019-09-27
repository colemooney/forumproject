const express = require('express');
const router  = express.Router();

const User           = require("../models/User.js");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport = require("passport");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;
