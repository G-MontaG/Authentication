"use strict";

const mongoose = require("mongoose");
const moment = require('moment');
const uuid = require('node-uuid');

let tokenSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
  token: {type: String, required: true},
  due_date: {type: Date, required: true}
});

tokenSchema.methods.setToken = function (user_id) {
  if (this.user_id !== user_id) {
    this.user_id = user_id;
  }
  this.token = uuid.v4();
  this.due_date = moment().add(7, 'd');
};

tokenSchema.methods.getToken = function () {
  return this.token;
};

tokenSchema.methods.getDueDate = function () {
  return this.due_date;
};

tokenSchema.methods.getUserID = function () {
  return this.user_id;
};

tokenSchema.methods.checkToken = function (token) {
  if (this.token === token && moment() <= this.due_date) {
    return true;
  } else if (this.token === token && moment() > this.due_date) {
    return false;
  } else {
    return false;
  }
};

module.exports = mongoose.model('Token', tokenSchema);