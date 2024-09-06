const Permission = require("../models/permission");
const Role = require("../models/role");

exports.getListUserAndRoleAndPermission = async (req, res) => {
    try {
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;
        // const skip = (page - 1) * limit;

        // const roles = await Role.find().skip(skip).limit(limit).populate("permissions");
        const roles = await Role.find()
        const permissions = await Permission.find()

        if (!roles.length > 0 || !permissions.length > 0) {
            return res.status(404).json({ message: "Page not found" })
        }

        const updatedRole = roles.map(role => {
            const rolePermission = role.permissions.map(id =>
                permissions.find(permission => permission._id.equals(id))
            );

            return {
                ...role.toObject(),
                permissions: rolePermission,
            };
        });

        return res.status(200).json({
            roles: updatedRole,
            permissions: permissions,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}