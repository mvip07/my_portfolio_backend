const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    block: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

visitorSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;