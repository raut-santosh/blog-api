const mongoose = require('mongoose');
const moment = require('moment-timezone');

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true },
  sequence: { type: Number, default: 0 }
},{timestamps: { currentTime: () => moment().tz(process.env.TIMEZONE).toDate() }});

counterSchema.statics.getNextSequence = async function(modelName) {
  const counter = await this.findOneAndUpdate(
    { model: modelName },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence;
};


module.exports = mongoose.model('Counter', counterSchema);

