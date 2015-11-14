'use strict';

const config = require('../config');
const mongoose = require('mongoose');
const db = mongoose.connect(config.urlDB).connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Conntected To Mongo Database');
});