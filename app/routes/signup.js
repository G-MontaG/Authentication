"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: ''});
  });
  app.post('/signup/:type', (req, res) => {
    if (req.params.type === "local") {
      new Promise((resolve, reject) => {
        User.findOne({"email": req.body.email}, (err, user) => {
          if (err) {
            reject(console.error(err));
          }
          if (user) {
            reject(res.render('signup.ejs', {message: 'email not available'}));
          }
          else {
            let newUser = new User({
              name: req.body.name,
              email: req.body.email
            });
            newUser.setPassword(req.body.password);
            newUser.save((err, user) => {
              if (err) {
                console.error(err);
              }
              resolve(user);
            });
          }
        });
      }).then((user) => {
        let newToken = new Token();
        newToken.setToken(user._id);
        newToken.save((err, token) => {
          if (err) {
            console.error(err);
          }
          req.session.token = token.token;
          res.redirect('/profile');
        });
      });
    } else if (req.params.type === "google") {
      //User.findOne({ "email": req.body.email }, (err, user) => {
      //  if (err) {
      //    console.error(err);
      //  }
      //  if (user) {
      //    res.render('signup.ejs', { message: 'you already have account' });
      //  } else {
      //    newUser = new User({
      //      name: req.body.name,
      //      email: req.body.email,
      //      google: {
      //        id: req.body.id,
      //        token: req.body.token
      //      }
      //    });
      //    newUser.save((err, user) => {
      //      if (err) {
      //        console.error(err);
      //      }
      //      req.session.user = user;
      //      res.redirect('/profile');
      //    });
      //  }
      //});
    } else {

    }
  });
};