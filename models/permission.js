const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	path: {
		type: String,
		required: true,
		unique: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

permissionSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
