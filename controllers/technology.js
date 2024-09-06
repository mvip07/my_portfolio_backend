const Technology = require('../models/technology');

exports.createTechnology = async (req, res) => {
    const { title } = req.body;
    try {
        const newTechnology = new Technology({ title });
        await newTechnology.save();
        res.status(200).json({ message: "You have created a successful Technology" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getTechnology = async (req, res) => {
    try {
        const technologies = await Technology.find();
        res.json(technologies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateTechnology = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        await Technology.findByIdAndUpdate(
            id, { title, updatedAt: Date.now() }, { new: true }
        );
        res.status(201).json({ message: "You have updated a successful Technology" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteTechnology = async (req, res) => {
    const { id } = req.params;
    try {
        await Technology.findByIdAndDelete(id);
        res.status(200).json({ message: "You have deleted a successful Technology" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}