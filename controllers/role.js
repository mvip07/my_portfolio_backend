const Role = require("../models/role");
const Permission = require("../models/permission");
const { ObjectId } = require("mongoose").Types;

exports.createRole = async (req, res) => {
	const { name, permissions } = req.body;

	if (!name || !permissions) {
		return res.status(400).json({ message: "Role name and Permissions are required" });
	}

	try {
		const newRole = new Role({ name, permissions });

		await newRole.save();

		res.status(201).json({ message: "Role created successfully" });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Role name must be unique" });
		}
		res.status(500).json({ message: err.message });
	}
};

exports.getRoles = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const roles = await Role.find().skip(skip).limit(limit).populate("permissions");

		if (!roles.length > 0) {
			return res.status(404).json({ message: "Page not found" })
		}

		res.status(200).json({ roles });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getRoleById = async (req, res) => {
	const { roleId } = req.params;

	try {
		if (!ObjectId.isValid(roleId)) {
			return res.status(400).json({ message: "Invalid ObjectId" });
		}

		const role = await Role.findById(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		res.status(200).json({ role });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updateRole = async (req, res) => {
	const { roleId } = req.params;
	const { name, permissions } = req.body;

	try {
		if (!ObjectId.isValid(roleId)) {
			return res.status(400).json({ message: "Invalid ObjectId" });
		}

		const role = await Role.findById(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		role.name = name || role.name;
		role.permissions = permissions || role.permissions

		await role.save();

		res.status(200).json({ message: "Role updated successfully" });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Role name must be unique" });
		}
		res.status(500).json({ message: err.message });
	}
};

exports.deleteRole = async (req, res) => {
	const { roleId } = req.params;

	try {
		if (!ObjectId.isValid(roleId)) {
			return res.status(400).json({ message: "Invalid ObjectId" });
		}

		const role = await Role.findByIdAndDelete(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		res.status(200).json({ message: "Role deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.addPermissionToRole = async (req, res) => {
	const { roleId, permissionId } = req.params;

	try {
		if (!ObjectId.isValid(roleId) || !ObjectId.isValid(permissionId)) {
			return res.status(400).json({ message: "Invalid ObjectId" });
		}

		const role = await Role.findById(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		const permission = await Permission.findById(permissionId);

		if (!permission) {
			return res.status(404).json({ message: "Permission not found" });
		}

		if (role.permissions.includes(permission._id)) {
			return res.status(400).json({ message: "Permission has already been added" })
		}

		role.permissions.push(permission._id);

		await role.save();

		res.status(200).json({ message: "Permission added to role successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.updatePermissionInRole = async (req, res) => {
	const { roleId, permissionsId } = req.params;
	const { newPermissionId } = req.body;
	try {
		if (!newPermissionId) {
			return res.status(400).json({ message: "New Permission Id is required" });
		}

		if (!ObjectId.isValid(permissionsId) || !ObjectId.isValid(newPermissionId)) {
			return res.status(400).json({ message: "Invalid ObjectId" });
		}

		const role = await Role.findById(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		const newPermission = await Permission.findById({ _id: new ObjectId(newPermissionId) });

		if (!newPermission) {
			return res.status(404).json({ message: "New permission not found" });
		}

		const existingIndex = role.permissions.findIndex((id) => id.toString() === permissionsId);

		if (existingIndex === -1) {
			return res.status(400).json({ message: "Permission to be replaced does not exist in the role" });
		}

		const alreadyExists = role.permissions.some((id) => id.toString() === newPermissionId);

		if (alreadyExists) {
			return res.status(400).json({ message: "This permission has already been added to the role" });
		}

		role.permissions[existingIndex] = new ObjectId(newPermissionId);

		await role.save();

		res.status(200).json({ message: "Permission in the role has been updated successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deletePermissionFromRole = async (req, res) => {
	const { roleId, permissionId } = req.params;

	try {
		if (!ObjectId.isValid(roleId) || !ObjectId.isValid(permissionId)) {
			return res.status(400).json({ message: "Invalid ObjectId" });
		}

		const role = await Role.findById(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		const index = role.permissions.findIndex((id) => id.toString() === permissionId);

		if (index === -1) {
			return res.status(404).json({ message: "Permission not found in this role" });
		}

		role.permissions.splice(index, 1);

		await role.save();

		res.status(200).json({ message: "Permission deleted from role successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
