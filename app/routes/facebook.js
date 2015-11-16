"use strict";

const User = require('../models/user');
const Token = require('../models/token');

const OAuth2 = require('oauth').OAuth2;

const fbAppID = '1389382208035989';
const fbAppSecret = '2011908d519767c74648a91b04d5fc41';

const oauth2 = new OAuth2(
  fbAppID,
  fbAppSecret,
  'https://www.facebook.com',
  '/oauth/access_token',
  '/oauth/access_token',
  null);

var url = oauth2.getAuthorizeUrl({
  client_id: fbAppID,
  client_secret: fbAppSecret
});

module.exports = (app) => {

  app.post('/:type/facebook', (req, res) => {
    console.log(url);
    res.redirect(url);
  });

  app.get('/:type/facebook?*', (req, res) => {
    console.log(req.body);
  });


  //oauth2.getOAuthAccessToken(
  //  qsObj.code,
  //  {'redirect_uri': 'http://localhost:8080/code/'},
  //  function (e, access_token, refresh_token, results){
  //    if (e) {
  //      console.log(e);
  //      res.end(e);
  //    } else if (results.error) {
  //      console.log(results);
  //      res.end(JSON.stringify(results));
  //    }
  //    else {
  //      console.log('Obtained access_token: ', access_token);
  //      res.end( access_token);
  //    }
  //  });


};