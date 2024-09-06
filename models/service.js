const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
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

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    items: [
        serviceItemSchema
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

serviceItemSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

serviceSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});


const Service = mongoose.model('Service', serviceSchema);
const ServiceItem = mongoose.model('ServiceItem', serviceItemSchema);

module.exports = { Service, ServiceItem };
