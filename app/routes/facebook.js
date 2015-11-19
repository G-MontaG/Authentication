"use strict";

const https = require('https');
const qs = require("querystring");
const User = require('../models/user');
const Token = require('../models/token');

const OAuth2 = require('oauth').OAuth2;

const oauth2 = new OAuth2(
  '1389382208035989',
  '2011908d519767c74648a91b04d5fc41',
  'https://www.facebook.com',
  '/oauth/access_token',
  '/oauth/access_token',
  null);


module.exports = (app) => {

  app.post('/:type/facebook', (req, res) => {
    let url = oauth2.getAuthorizeUrl({
      grant_type: 'fb_exchange_token',
      client_id: '1389382208035989',
      client_secret: '2011908d519767c74648a91b04d5fc41',
      fb_exchange_token: 'short-lived-token',
      redirect_uri: 'https://localhost:8443/signup/facebook'
    });
    console.log(url);
    res.redirect(url);
  });

  app.get('/:type/facebook?*', (req, res) => {
    console.log(req.query.code);
    https.get("https://www.facebook.com/oauth/access_token?client_id=1389382208035989&redirect_uri" + qs.stringify('https://localhost:8443/signup/facebook') + "&client_secret=2011908d519767c74648a91b04d5fc41&code=" + req.query.code, (res) => {
      console.log(res.body);
    });
    new Promise((resolve, reject) => {
      //oauth2.getOAuthAccessToken(
      //  req.query.code,
      //  {
      //    grant_type: 'fb_exchange_token',
      //    fb_exchange_token: 'short-lived-token'
      //  },
      //  (err, access_token, refresh_token, results) => {
      //    console.log(results);
      //  }
      //);



      //oauth2.getOAuthAccessToken(
      //  req.query.code,
      //  {
      //    grant_type: 'fb_exchange_token',
      //    fb_exchange_token: 'short-lived-token'
      //  },
      //  (err, access_token, refresh_token, results) => {
      //    if (err) {
      //      console.error(err);
      //      res.end();
      //    } else if (results.error) {
      //      console.error(results);
      //      res.end();
      //    }
      //    else {
      //      console.log('Obtained access_token: ', access_token);
      //      res.end(access_token);
      //    }
      //  });




    }).then((url) => {

    });
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