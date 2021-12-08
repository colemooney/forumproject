const express = require('express');
const router  = express.Router();

const Dream   = require("../models/Dream.js");
const User    = require("../models/User.js");

router.get('/dreams',(req, res, next)=>{
  Dream.find()
  .then((result)=>{
      
  res.render('dreams/dreams', {result})
  
    
  
  
  })
})
router.post('/dreams', (req, res, next)=>{
  let user = req.user._id
  let image = req.body.theImage
  let text = req.body.theText
  Dream.create({
    user: user,
    image: image,
    text: text
})
.then(()=>{

    res.redirect('/dreams/all')

})
.catch(error => {
  next(error);
  console.log(error);
})
})
router.get('/dreams/all', (req, res, next)=>{
  Dream.find().populate('user')
  .then((result)=>{


      data = {
        result: result
      }
      
      res.render('dreams/alldreams', data)
   
  })
  .catch((err)=>{
    next(err)
  })
  
})

module.exports = router;