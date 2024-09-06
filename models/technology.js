const mongoose = require('mongoose');

const TechnologySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

TechnologySchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const Technology = mongoose.model('Technology', TechnologySchema);

module.exports = Technology;
