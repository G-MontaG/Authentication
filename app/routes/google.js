"use strict";

const https = require('https');
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
  'https://www.googleapis.com/auth/userinfo.email'
];

const url = oauth2Client.generateAuthUrl({
  scope: scopes
});

module.exports = (app) => {

  app.post('/:type/google', (req, res) => {
    res.redirect(url);
  });

  app.get('/:type/google?*', (req, res) => {
    new Promise((resolve, reject) => {
      oauth2Client.getToken(req.query.code, function(err, tokens) {
        if(err) { reject(console.error(err)); }
        resolve(tokens);
      });
    }).then((tokens) => {
      return new Promise((resolve, reject) => {
        https.get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + tokens.access_token, (res) => {
          res.on("data", function(body) {
            let sended = { tokens: tokens, body: JSON.parse(body.toString()) };
            resolve(sended);
          });
        }).on('error', (err) => {
          reject(console.error(err.message));
        });
      }).then((sended) => {
          return sended;
      });
    }).then((sended) => {
      new Promise((resolve, reject) => {
        User.findOne({email: sended.body.email}, (err, user) => {
          if (err) {
            reject(console.error(err));
          }
          if (user) {
            user.updateByGoogle(sended.body);
            resolve(user);
          }
          else {
            let newUser = new User({
              name: sended.body.name,
              email: sended.body.email,
              photo: sended.body.picture
            });
            newUser.save((err, user) => {
              if (err) {
                reject(console.error(err));
              }
              resolve(user);
            });
          }
        });
      }).then((user) => {
        Token.remove({user_id: user._id}, (err, token) => {
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
      });
    });
  });

};