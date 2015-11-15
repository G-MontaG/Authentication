"use strict";

const User = require('../models/user');
const Token = require('../models/token');

module.exports = (app) => {

  app.get('/', (req, res) => {
    if (!req.session.token) {
      res.render('index.ejs', {"session": false});
    } else {
      Token.findOne({"token": req.session.token}, (err, token) => {
        if (err) {
          console.error(err);
        }
        if (!token) {
          res.render('index.ejs', {"session": false});
        }
        else {
          if (!token.checkToken()) {
            res.render('index.ejs', {"session": false});
          } else {
            res.render('index.ejs', {"session": true});
          }
        }
      });
    }
  });

  require('./login')(app);

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: ''});
  });

  require('./signup-local')(app);

  require('./signup-google')(app);

  app.use('/profile', (req, res, next) => {
    if (!req.session.token) {
      return res.redirect('/');
    }
    return next();
  });

  require('./profile');

  app.get('/logout', (req, res) => {
    new Promise((resolve, reject) => {
      Token.remove({token: req.session.token}, (err, token) => {
        if (err) {
          reject(console.error(err));
        }
        resolve();
      });
    }).then(() => {
      req.session.destroy();
      res.redirect('/');
    });
  });

};