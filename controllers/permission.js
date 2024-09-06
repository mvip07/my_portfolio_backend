const { ObjectId } = require("mongodb");
const Permission = require("../models/permission");

exports.createPermission = async (req, res) => {
	const { name, path } = req.body; // Data to create a new permission

	if (!name || !path) {
		return res.status(400).json({ message: "Name and path are required" });
	}

	try {
		const newPermission = new Permission({ name, path });

		await newPermission.save();

		res.status(201).json({ message: "Permission created successfully" });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Permission name or path must be unique" }); // Handle unique constraint violation
		}
		res.status(500).json({ message: err.message });
	}
};

exports.getPermissions = async (req, res) => {
	try {
		// const page = parseInt(req.query.page) || 1;
		// const limit = parseInt(req.query.limit) || 5;
		// const skip = (page - 1) * limit;

		const permissions = await Permission.find()
		// .skip(skip).limit(limit);

		if (!permissions.length > 0) {
			return res.status(404).json({ message: "Page not found" })
		}

		res.status(200).json({ permissions });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getPermissionById = async (req, res) => {
	const { permissionId } = req.params;

	try {
		if (!ObjectId.isValid(permissionId)) {
			return res.status(400).json({ message: "Permission id is invalid" })
		}

		const permission = await Permission.findById(permissionId);

		if (!permission) {
			return res.status(404).json({ message: "Permission not found" });
		}

		res.status(200).json({ permission });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updatePermission = async (req, res) => {
	const { permissionId } = req.params;
	const { name, path } = req.body; // Data to update the permission

	try {
		// if (!name || !path) {
		// 	return res.status(400).json({ message: "Name or path are requried" })
		// }

		if (!ObjectId.isValid(permissionId)) {
			return res.status(400).json({ message: "Permission id is invalid" })
		}

		const permission = await Permission.findById(permissionId);

		if (!permission) {
			return res.status(404).json({ message: "Permission not found" });
		}

		permission.name = name || permission.name;
		permission.path = path || permission.path;

		await permission.save();

		return res.status(200).json({ message: "Permission updated successfully" });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Permission name or path must be unique" }); // Handle unique constraint violation
		}
		res.status(500).json({ message: err.message });
	}
};

exports.deletePermission = async (req, res) => {
	const { permissionId } = req.params;

	try {
		if (!ObjectId.isValid(permissionId)) {
			return res.status(400).json({ message: "Permission id is invalid" })
		}

		const permission = await Permission.findByIdAndDelete(permissionId);

		if (!permission) {
			return res.status(404).json({ message: "Permission not found" });
		}

		res.status(200).json({ message: "Permission deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};