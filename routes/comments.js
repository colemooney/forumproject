const express = require('express');
const router  = express.Router();

const Comments    = require("../models/Comments.js");
const Dream   = require("../models/Dream.js");
const User    = require("../models/User.js");

router.get('/timeline/:id/comments', (req, res, next)=>{

  let id = req.params.id // this is the comment id
  console.log(id)
  Dream.findById(id)
  .populate('user')
  .then((result)=>{
    console.log(result) // this is data on the dream, not the comment
      Comments.findById("5d8bd30aca41561c1bd5c2e7")
      .then((commentResult)=>{
        console.log(commentResult)
          data = {
            resulttwo: commentResult,
            result: result
          }
          console.log("This is the data")
          console.log("LKJLJLKJLJK")
          console.log(data)
          res.render('dreams/comments', data)
        // console.log('---------------xxx',data)
      })
    // console.log("---------------", result, req.params.id)
    
  })
  .catch((err)=>{
    next(err)
  })
})

router.post('/timeline/:id/comments', (req, res, next)=>{
  let user = req.user._id
  let dream = req.params.id
  let text = req.body.theComments
  console.log(req.params.id)
  Comments.create({
    user: user,
    Dream: dream,
    text: text
})
  .then(()=>{
    res.redirect(`/timeline/${req.params.id}/comments`)
  })
  .catch((err)=>{
    next(err)
  })
})

module.exports = router;