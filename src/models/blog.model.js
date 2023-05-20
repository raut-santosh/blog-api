const mongoose = require("mongoose");
const Counter = require("./counter.model");
const moment = require('moment-timezone');

const blogSchema = mongoose.Schema(
  {
    idseq: { type: Number, unique: true },
    title: {type: String},
    content: {type: String},
    files: [Object],
    likes: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [String],
    comments: [Object],
  },
  { timestamps: { currentTime: () => moment().tz(process.env.TIMEZONE).toDate() } }
);

blogSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    // get the next id sequence value and assign it to the document's idseq field
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
