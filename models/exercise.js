'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;