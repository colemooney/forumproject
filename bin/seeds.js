const mongoose = require('mongoose');



mongoose
  .connect('mongodb://localhost/forumproject', {useNewUrlParser: true})
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

  
  const User = mongoose.model('User', {
    username: String,
    password: String,
    isAdmin: Boolean,
    image: String,
    email: String,
    realName: String,
    googleID: String
  });




  User.create({
    username: "admin", 
    password: "admin", 
    isAdmin: true, 
    image: "", 
    email: "deez@nutz.com",
    realName: "Jeff",
         })