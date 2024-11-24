import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	searchHistory: {
		type: Array,
		default: [],
	},
});

export const User = mongoose.model("User", userSchema);  // make a collection of "User" with the schema userSchema. "User" shall be first letter capitalized and singular, and mongoose will automatically make it plural and lowercase