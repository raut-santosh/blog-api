const mongoose = require("mongoose");
const Counter = require("./counter.model");
const moment = require("moment-timezone");

const fileSchema = mongoose.Schema({
    idseq: { type: Number, unique: true },
    name: { type: String },// required: true
    alias: { type: String },
    path: { type: String },
    type: { type: String },
    size: { type: Number }, //in bytes
    is_active: { type: Boolean, default: true },
}, { timestamps: { currentTime: () => moment().tz(process.env.TIMEZONE).toDate() } });

fileSchema.pre('save', async function (next) {
    const doc = this;
    if (!doc.idseq) {
        // get the next id sequence value and assign it to the document's idseq field
        const nextId = await Counter.getNextSequence(doc.constructor.modelName);
        doc.idseq = nextId;
    }
    next();
});

module.exports = mongoose.model("File", fileSchema);
