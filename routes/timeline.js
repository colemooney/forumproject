const express = require('express');
const router = express.Router();

const User           = require("../models/User.js");
const Dream   = require("../models/Dream.js");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport = require("passport");


router.get('/timeline', (req, res, next)=>{
  User.find()
  .then((result)=>{
    res.render('timeline/timeline', {result})
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/timeline/:id', (req, res, next)=>{
  console.log("PARAMS ------------",req.params.id)
  let id = req.params.id;
  User.findById(id)
  .then((result)=>{
      console.log("RESULT ----------------", result)
      Dream.find({user: req.params.id})
      .populate('user')
      .then((dreamresult)=>{
        console.log("DREAMRESULT --------------", dreamresult)
        data = {
          result: result,
          dreamresult: dreamresult
        }
        console.log("these are the results ----------- ", result);
        res.render(`timeline/outsideprofile`, data)
      })
      .catch((err)=>{
        next(err)
    })
    .catch((err)=>{
      next(err)
    })
  })
  })

router.post('/timeline/:id', (req, res, next)=>{
  let id = req.params.id;
  const theFollowers = req.user._id
  const theFollowing = req.params.id
 
  

  User.findByIdAndUpdate(req.params.id, {$push: {followers: theFollowers}})
  .then(()=>{
    User.findByIdAndUpdate(req.user._id, {$push: {following: theFollowing}})
    .then(()=>{

      res.redirect(`/timeline/${req.params.id}`)
    })
    .catch((err)=>{
      next(err)
    })
  })
  .catch((err)=>{
    next(err)
})
})

router.post('/timeline/delete-my-dream/:id', (req, res, next)=>{
  console.log('<><><><><><><><><><><><><llll',req.user)
  console.log('<><><><><><',req.params.id)
  Dream.findByIdAndRemove(req.params.id)
  .then((result)=>{
    // res.send(result)
      res.redirect('/profile')
  })
  .catch((err)=>{
      next(err)
  })

})


module.exports = router;
