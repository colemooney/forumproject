const express = require('express');
const router = express.Router();

const User           = require("../models/User.js");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport = require("passport");

router.get('/timeline', (req, res, next)=>{
  res.render('timeline/timeline')
})


module.exports = router;
