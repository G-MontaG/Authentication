"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {
  app.get('/login', (req, res) => {
    res.render('login.ejs', { message: ''});
  });
  app.post('/login/:type', (req, res) => {
    var newToken;
    if (req.params.type === "local") {
      User.findOne({ "email": req.body.email }, (err, user) => {
        if (err) { console.error(err); }
        if (!user) { res.render('login.ejs', { message: 'email not found'}); }
        else {
          if (!user.isValidPassword(req.body.password)) {
            res.render('login.ejs', { message: 'password not correct'});
          } else {
            Token.remove({ 'user_id': user._id}, (err, token) => {
              if (err) { console.error(err); }
            }).then(() => {
              newToken = new Token();
              newToken.setToken(user._id);
              newToken.save((err, token) => {
                if (err) { console.error(err); }
                req.session.token = token.token;
                res.redirect('/profile');
              });
            });
          }
        }
      });
    } else if (req.params.type === "google") {
      //User.findOne({ "email": req.body.email }, (err, user) => {
      //  if (err) {
      //    console.error(err);
      //  }
      //  if (!user) {
      //    res.render('login.ejs', { message: 'email not found'});
      //  } else {
      //    if (user.isValidToken('google', req.body.token)) {
      //      req.session.user = user;
      //      res.redirect('/profile');
      //    } else {
      //      res.render('login.ejs', { message: 'token not correct'});
      //    }
      //  }
      //});
    } else {

    }
  });
};