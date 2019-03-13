'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  log: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;