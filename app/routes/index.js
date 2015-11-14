"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {

  app.get('/', (req, res) => {
    if (req.session.token === undefined) {
      res.render('index.ejs', { "session": false });
    }


    Token.findOne({"token": req.session.token}, (err, token) => {
      if (err) { console.error(err); }
      if (!token) { res.redirect('/'); }
      else {
        if (token.checkToken(req.session.token)) {
          User.findOne({"_id": token.getUserID()}, (err, user) => {
            if (err) { console.error(err); }
            if (!user) { res.redirect('/'); }
            else {
              res.render('profile.ejs', { user: user, token: token });
            }
          });
        } else {
          res.redirect('/');
        }
      }
    });
  });

  require('./login')(app);

  require('./signup')(app);

  app.get('/profile', (req, res) => {

  });
};