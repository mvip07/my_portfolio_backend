const fs = require('fs');
const uploadToFirebase = require('../utils/firebaseUpload');
const { Service, ServiceItem } = require("../models/service");

exports.createService = async (req, res) => {
    const { title, description } = req.body;
    let icon = '';
    try {        
        if (req.file) {
            const imageFilePath = req.file.path;
            icon = await uploadToFirebase(imageFilePath, `images/${req.file?.filename}`, req.file?.mimetype);
            fs.unlinkSync(imageFilePath); // Delete file from local system
        }

        const service = new Service({ title, description, icon });
        await service.save();

        return res.json({ message: 'Service created successfully' });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: err.message });
    }
}

exports.getAllService = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getServiceById = async (req, res) => {
    const { id } = req.params;

    try {
        let service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service get successfully', service });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    let iconUrl = '';
    
    try {
        if (req.file) {
            const imageFilePath = req.file.path;
            iconUrl = await uploadToFirebase(imageFilePath, `images/${req.file?.filename}`, req.file?.mimetype);
            fs.unlinkSync(imageFilePath); // Delete file from local system
        }

        let service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
     
        service.title = title || service.title;
        service.description = description || service.description;
        if (iconUrl) service.icon = iconUrl;

        await service.save();
        return res.json({ message: 'Service updated successfully' });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: err.message });
    }
}

exports.deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        await Service.findByIdAndDelete(id);
        res.json({ message: 'Service deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createServiceItem = async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    try {
        let service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const serviceItem = new ServiceItem({ name, price });
        service.items.push(serviceItem);
        await service.save();

        res.status(201).json({ message: 'Service item added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateServiceItem = async (req, res) => {
    const { serviceId, itemId } = req.params;
    const { name, price } = req.body;

    try {
        let service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const item = service.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Service item not found' });
        }

        // Update fields
        item.name = name || item.name;
        item.price = price || item.price;

        await service.save();
        res.json({ message: 'Service item updated successfully', service });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteServiceItem = async (req, res) => {
    const { serviceId, itemId } = req.params;

    try {
        let service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        service.items = service.items.filter(item => item._id.toString() !== itemId);

        await service.save();

        res.json({ message: 'Service item deleted successfully', service });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}