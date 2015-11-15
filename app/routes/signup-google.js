"use strict";

const User = require('../models/user');
const Token = require('../models/token');

const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  '605727486165-dqh31qvng1cisa3qetdafhrmasd4jtgn.apps.googleusercontent.com',
  '8z6Wsiqegf8OAK9ZZtYVFMjI',
  'https://localhost:8443/signup/google'
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

var url = oauth2Client.generateAuthUrl({
  scope: scopes
});

module.exports = (app) => {

  app.post('/signup/google', (req, res) => {
    res.redirect(url);
  });

  app.get('/signup/google?*', (req, res) => {
    new Promise((resolve, reject) => {
      oauth2Client.getToken(req.query.code, function(err, tokens) {
        if(err) { reject(console.error(err)); }
        console.log(tokens);
        resolve(tokens);
      });
    }).then((tokens) => {
      res.redirect('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + tokens.access_token);
    });
  });

  app.get('https://www.googleapis.com/oauth2/v2/userinfo*', (req, res, next) => {
    console.log('we hear');
  });

};