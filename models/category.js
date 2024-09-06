const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
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

CategorySchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
