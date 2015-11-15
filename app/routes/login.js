"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {
  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: ''});
  });
  app.post('/login/local', (req, res) => {
    new Promise((resolve, reject) => {
      User.findOne({"email": req.body.email}, (err, user) => {
        if (err) {
          reject(console.error(err));
        }
        if (!user) {
          reject(res.render('login.ejs', {message: 'email not found'}));
        }
        else {
          if (!user.isValidPassword(req.body.password)) {
            reject(res.render('login.ejs', {message: 'password not correct'}));
          } else {
            resolve(user);
          }
        }
      });
    }).then((user) => {
      Token.remove({'user_id': user._id}, (err, token) => {
        if (err) {
          console.error(err);
        }
      });
      return user;
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
    }).catch((err) => {
      console.error(err);
    });
  });
};