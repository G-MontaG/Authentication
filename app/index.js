"use strict";

module.exports = (app) => {
  require('./db');
  require('./routes')(app);
  console.log();
};