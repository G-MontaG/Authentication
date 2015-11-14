"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {
  
  app.use('/', (req, res, next) => {
    console.log();
    next();
  });

  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  require('./login')(app);

  require('./signup')(app);

  app.get('/profile', (req, res) => {
    console.log("session");
    console.log(req.session);
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
};