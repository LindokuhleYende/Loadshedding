const mongoose = require("mongoose");


const powerUpdateSchema = new mongoose.Schema({
    location: { type: String, required: true },
    stage: { type: Number, required: true },
    message: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PowerUpdate", powerUpdateSchema);