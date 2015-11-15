"use strict";

const mongoose = require("mongoose");
const moment = require('moment');
const crypto = require("crypto");

let userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  salt: {type: String},
  passwordHash: {type: String},
  created: {
    type: Date,
    "default": moment()
  },
  photo: {
    type: String,
    "default": ""
  }
});

function hash(password, salt) {
  return crypto.createHmac('sha512', salt).update(password).digest('hex');
}

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(128).toString('base64');
  this.passwordHash = hash(password, this.salt);
};

userSchema.methods.isValidPassword = function (password) {
  return this.passwordHash === hash(password, this.salt);
};

userSchema.methods.isValidID = function (type, id) {
  return this[type] === id;
};

module.exports = mongoose.model('User', userSchema);