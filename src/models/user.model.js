const mongoose = require("mongoose");
const Counter = require("./counter.model");
const moment = require('moment-timezone');

const userSchema = mongoose.Schema(
  {
    idseq: { type: Number, unique: true },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    otp: { type: Number },
    is_verified: { type: Boolean, default: false },
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: { currentTime: () => moment().tz(process.env.TIMEZONE).toDate() } }
);

userSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.idseq) {
    // get the next id sequence value and assign it to the document's idseq field
    const nextId = await Counter.getNextSequence(doc.constructor.modelName);
    doc.idseq = nextId;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
