"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {

  app.get('/', (req, res) => {
    if (!req.session.token) {
      res.render('index.ejs', { "session": false });
    } else {
      Token.findOne({"token": req.session.token}, (err, token) => {
        if (err) { console.error(err); }
        if (!token) { res.render('index.ejs', { "session": false }); }
        else {
          if (!token.checkToken()) {
            res.render('index.ejs', { "session": false });
          } else {
            res.render('index.ejs', { "session": true });
          }
        }
      });
    }
  });

  require('./login')(app);

  require('./signup')(app);

  app.use('/profile', (req, res, next) => {
    if (!req.session.token) { return res.redirect('/'); }
    return next();
  });

  app.get('/profile', (req, res) => {
    Token.findOne({"token": req.session.token}, (err, token) => {
      if (err) { console.error(err); }
      if (!token) { res.redirect('/login'); }
      else {
        if (!token.checkToken()) {
          res.redirect('/login');
        } else {
          return token;
        }
      }
    }).then((token) => {
      User.findOne({"_id": token.getUserID()}, (err, user) => {
        if (err) { console.error(err); }
        if (!user) { res.redirect('/login'); }
        else {
          res.render('profile.ejs', { user: user, token: token });
        }
      });
    });
  });

  app.get('/logout', (req, res) => {
    Token.remove({ token: req.session.token}, (err, token) => {
      if (err) { console.error(err); }
    }).then(() => {
      req.session.destroy();
      res.redirect('/');
    });
  });
};