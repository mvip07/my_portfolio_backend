const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    const { title } = req.body;
    try {
        const newCategory = new Category({ title });
        await newCategory.save();
        res.status(200).json({ message: "You have created a successful Category" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        await Category.findByIdAndUpdate(
            id, { title, updatedAt: Date.now() }, { new: true }
        );
        res.status(201).json({ message: "You have updated a successful Category" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "You have deleted a successful Category" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}