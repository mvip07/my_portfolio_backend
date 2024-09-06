const mongoose = require("mongoose");
const Role = require("./role");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	roles: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role"
		}
	],
	password: {
		type: String,
		required: true,
	},
	block: {
		type: Boolean,
		default: false,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationCode: {
		type: String,
		required: false,
	},
	verificationExpiresAt: {
		type: Date,
		required: false,
	},
	resetToken: {
		type: String,
		default: null,
	},
	resetTokenExpiresAt: {
		type: Date,
		default: null,
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

userSchema.pre("save", async function (next) {
	if (this.isNew && this.roles.length === 0) {
		const defaultRole = await Role.findOne({ name: "User" });
		if (defaultRole) this.roles = defaultRole._id;
	}
	this.updatedAt = Date.now();
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
