import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";


export const protectRoute = async (req, res, next) => {//middleware to protect routes, checks if user is authenticated, if not, returns 401, if authenticated, adds user to req object, and calls next to continue to the next middleware or function
	try {
		const token = req.cookies["jwt-movieapp"];//get token from cookies

		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);//verify token

		if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password"); //get user from db

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		req.user = user;//add user to req object, oncessfully authenticated

		next(); //call next middleware or function
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};