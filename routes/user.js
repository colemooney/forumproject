const express = require('express');
const router = express.Router();

const Dream   = require("../models/Dream.js");
const User           = require("../models/User.js");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport = require("passport");

router.get('/signup', (req, res, next)=>{
  
  res.render('user/signup')
})

router.post("/signup", (req, res, next) => {
  
      let admin = false;
  
      if(req.user){
        if(req.user.isAdmin){
          admin = req.body.role? req.body.role: false
        }
      }

  const username = req.body.theUsername;
  const password = req.body.thePassword;

  console.log("this is the pw >>>>>>> ", password)
const salt  = bcrypt.genSaltSync(bcryptSalt);
const hash = bcrypt.hashSync(password, salt);

  User.create({
    username: username,
    password: hash,
    isAdmin: admin
})
.then(()=>{

    res.redirect('/login')

})
.catch(error => {
  next(error);
  console.log(error);
})
})

router.get("/login", (req, res, next) => {
  res.render("user/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
  
}));


router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect("/");
    
});

router.get('/profile', (req, res, next)=>{
  console.log('<><><><><><><', req.user)
  Dream.find({user: req.user._id}).populate('user')
  .then((result)=>{


      data = {
        result: result
      }
      
      res.render('user/profile', data)
   
  })
  .catch((err)=>{
    next(err)
  })
  
  
})

router.post('/account/delete-my-account', (req, res, next)=>{

  User.findByIdAndRemove(req.user._id)
  .then(()=>{
      res.redirect('/')
  })
  .catch((err)=>{
      next(err)
  })

})
router.get('/account/edit-my-account', (req, res, next)=>{
  User.findById(req.user._id)
  .then((result)=>{
    res.render('user/editprofile', {result})
  })
  .catch((err)=>{
    next(err)
  })
})
router.post('/account/edit-my-account', (req, res, next)=>{
  User.findByIdAndUpdate(req.user._id, {
    username: req.body.theUsername,
    password: req.body.thePassword,
    realName: req.body.fullName,
    email: req.body.theEmail,
    image: req.body.theImage
  }, {new: true})
  .then(()=>{
      res.redirect('/profile')
  })
  .catch((err)=>{
      next(err)
  })
})


router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

router.post('/follow', (req, res, next)=>{
  let user_id = req.user._id;
  let follow = req.body.follow_id;

  let bulk = Follow.collection.initializeUnorderedBulkOp();

  bulk.find({ 'user': SVGUnitTypes.ObjectId(user_id) }).upsert().updateOne({
    $addToSet: {
      following: SVGUnitTypes.ObjectId(follow)
    }
  });
  bulk.find({ 'user': SVGUnitTypes.ObjectId(follow) }).upsert().updateOne({
    $addToSet: {
      following: SVGUnitTypes.ObjectId(user_id)
    }
  });
  bulk.execute(function(err, doc) {
    if(err) {
      return res.json({
        'state': false,
        'msg': err
      })
    }
    res.json({
      'state': false,
      'msg': 'followed'
    })
  })

})

router.get("/profile/followers", (req, res, next) => {
  User.findById(req.user._id)
  .populate('followers')
  .then((result)=>{
    res.render('user/allfollowers', {result})
  }).catch((err)=>{
    next(err)
  })
});
router.get('/profile/editdream/:id', (req, res, next)=>{
  let id = req.params.id
  Dream.findById(id).populate('user')
  .then((result)=>{
    console.log("these are the results ----------- ", result);
    res.render('dreams/editdream', {result})
  })
  .catch((err)=>{
    next(err);
  })
})
router.post('/profile/editdream/:id', (req, res, next)=>{
  console.log("This is the req . body ...>>>>>>...>>>>..>>>> ", req.body)
  Dream.findByIdAndUpdate(req.params.id, {
    image: req.body.theImage,
    text: req.body.theText
  }, {new: true})
  .populate('user')
  .then(()=>{
    res.redirect('/profile')
  })
  .catch((err)=>{
    next(err);
  })
})


module.exports = router;
