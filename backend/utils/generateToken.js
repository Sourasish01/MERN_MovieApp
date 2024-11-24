import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => { //generate a token using the userId and set it in a cookie
	const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" }); //this is how we generate a token using the userId and the secret key , we use the userId to identify the user from the database, and the second argument is the secret key that we have set in the .env file, the expiresIn is the time for which the token will be valid

    res.cookie("jwt-movieapp", token, { //set the token in a cookie
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks, make it not be accessed by JS
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: ENV_VARS.NODE_ENV !== "development",
	});

    return token; //return the token
}