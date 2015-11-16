"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {

  app.get('/profile', (req, res) => {
    new Promise((resolve, reject) => {
      Token.findOne({token: req.session.token}, (err, token) => {
        if (err) {
          reject(console.error(err));
        }
        if (!token) {
          reject(res.redirect('/login'));
        }
        else {
          if (!token.checkToken()) {
            reject(res.redirect('/login'));
          } else {
            resolve(token);
          }
        }
      });
    }).then((token) => {
      User.findOne({_id: token.getUserID()}, (err, user) => {
        if (err) {
          console.error(err);
        }
        if (!user) {
          res.redirect('/login');
        }
        else {
          res.render('profile.ejs', {user: user, token: token});
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  });

};