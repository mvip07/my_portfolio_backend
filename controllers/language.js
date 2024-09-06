const Language = require('../models/language');

exports.createLanguage = async (req, res) => {
    const { title, percentage } = req.body;
    try {
        const newLanguage = new Language({ title, percentage });
        await newLanguage.save();
        res.status(200).json({ message: "Language created successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.getLanguage = async (req, res) => {
    try {
        const languages = await Language.find();
        res.json(languages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateLanguage = async (req, res) => {
    const { id } = req.params;
    const { title, percentage } = req.body;
    try {
        await Language.findByIdAndUpdate(
            id,
            { title, percentage, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        return res.status(201).json({ message: "Language updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteLanguage = async (req, res) => {
    const { id } = req.params;
    try {
        await Language.findByIdAndDelete(id);
        return res.status(201).json({ message: "Language deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}