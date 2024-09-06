const fs = require('fs');
const About = require("../models/about");
const uploadToFirebase = require('../utils/firebaseUpload');

exports.createAbout = async (req, res) => {
    const { name, profession, description, email, phone } = req.body;
    let cvUrl = '';
    let imageUrl = '';

    try {
        if (req.files?.cv) {
            const cvFilePath = req.files.cv[0].path;
            cvUrl = await uploadToFirebase(cvFilePath, `cvs/${req.files.cv[0].filename}`, req.files.cv[0].mimetype);
            fs.unlinkSync(cvFilePath); // Delete file from local system
        }

        if (req.files?.image) {
            const imageFilePath = req.files.image[0].path;
            imageUrl = await uploadToFirebase(imageFilePath, `images/${req.files.image[0].filename}`, req.files.image[0].mimetype);
            fs.unlinkSync(imageFilePath); // Delete file from local system
        }

        let about = await About.findOne({});
        if (about) {
            // Update existing about data
            about.name = name || about.name;
            about.profession = profession || about.profession;
            about.description = description || about.description;
            about.contact.email = email || about.contact.email;
            about.contact.phone = phone || about.contact.phone;
            if (cvUrl) about.cv = cvUrl;
            if (imageUrl) about.image = imageUrl;

            await about.save();
        } else {
            // Create new about data
            about = new About({
                name,
                image: imageUrl,
                profession,
                description,
                contact: { email, phone },
                cv: cvUrl,
            });
            await about.save();
        }

        res.json({ message: 'About data created/updated successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};

exports.getAbout = async (req, res) => {
    try {
        const about = await About.findOne({});
        if (!about) {
            return res.status(404).json({ message: 'About data not found' });
        }
        res.json(about);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateAbout = async (req, res) => {
    const { name, profession, description, email, phone } = req.body;
    let cvUrl = '';
    let imageUrl = '';

    try {
        if (req.files?.cv) {
            const cvFilePath = req.files.cv[0].path;
            cvUrl = await uploadToFirebase(cvFilePath, `cvs/${req.files.cv[0].filename}`, req.files.cv[0].mimetype);
            fs.unlinkSync(cvFilePath); // Delete file from local system
        }

        if (req.files?.image) {
            const imageFilePath = req.files.image[0].path;
            imageUrl = await uploadToFirebase(imageFilePath, `images/${req.files.image[0].filename}`, req.files.image[0].mimetype);
            fs.unlinkSync(imageFilePath); // Delete file from local system
        }

        let about = await About.findOne({});

        if (!about) {
            return res.status(404).json({ message: 'About data not found' });
        }

        about.name = name || about.name;
        about.profession = profession || about.profession;
        about.description = description || about.description;
        about.contact.email = email || about.contact.email;
        about.contact.phone = phone || about.contact.phone;

        if (cvUrl) about.cv = cvUrl;
        if (imageUrl) about.image = imageUrl;

        await about.save();

        res.status(201).json({ message: 'About data updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteAbout = async (req, res) => {
    try {
        await About.deleteMany({});
        res.json({ message: 'About data deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}