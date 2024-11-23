const fs = require('fs');
const SocialMedia = require("../models/socialMedia");
const uploadToFirebase = require('../utils/firebaseUpload');

exports.createSocialMedia = async (req, res) => {
    const { title, url } = req.body;
    let icon = '';

    try {
        if (req.file) {
            icon = await uploadToFirebase(req.file.buffer, `icons/${Date.now()}-${req.file.originalname}`, req.file.mimetype);
        }

        const newSocialMedia = new SocialMedia({ title, url, icon });
        await newSocialMedia.save();

        return res.status(201).json({ message: "Social media has been successfully created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSocialMedia = async (req, res) => {
    try {
        const socialMedia = await SocialMedia.find();
        res.status(200).json(socialMedia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSocialMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const socialMedia = await SocialMedia.findById(id);
        if (!socialMedia) {
            return res.status(404).json({ message: 'Social Media not found' });
        }
        res.status(200).json(socialMedia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSocialMedia = async (req, res) => {
    const { id } = req.params;
    const { title, url } = req.body;
    let icon = '';

    try {
        if (req.file) {
            icon = await uploadToFirebase(req.file.buffer, `icons/${Date.now()}-${req.file.originalname}`, req.file.mimetype);
        }

        const updatedSocialMedia = await SocialMedia.findByIdAndUpdate(
            id, { title, url, icon, updatedAt: Date.now() }, { new: true }
        );
        if (!updatedSocialMedia) {
            return res.status(404).json({ message: 'Social Media not found' });
        }

        return res.status(200).json({ message: "Social media has been successfully updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSocialMedia = await SocialMedia.findByIdAndDelete(id);
        if (!deletedSocialMedia) {
            return res.status(404).json({ message: 'Social Media not found' });
        }
        res.status(200).json({ message: 'Social Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};