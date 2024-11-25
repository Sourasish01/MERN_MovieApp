// to store the currently authenticated user in the global state using Zustand. This will allow us to access the user object from any component in the application.
// ie. we can access the user object from any component in the application by importing the useAuthStore hook and calling the useAuthStore() function.
// The useAuthStore hook returns an object with the user object and methods to signup, login, logout, and check if the user is authenticated.
// The user object contains the currently authenticated user, which is set to null by default.
// the user object is the currently authenticated user, it is null if the user is not authenticated.
// the user object contains the user data returned from the server when the user logs in or signs up.


import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand"; //global state management library

export const useAuthStore = create((set) => ({ // returns an object with the user object and methods to signup, login, logout, and check if the user is authenticated
	user: null, // the user object is the currently authenticated user, it is null if the user is not authenticated
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			const response = await axios.post("/api/v1/auth/signup", credentials); // sends the user's data (email, username, password) to the server
			set({ user: response.data.user, isSigningUp: false }); // set the user object to the user data returned from the server when the user signs up
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Signup failed");
			set({ isSigningUp: false, user: null });
		}
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await axios.post("/api/v1/auth/login", credentials);
			set({ user: response.data.user, isLoggingIn: false });
		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.response.data.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await axios.post("/api/v1/auth/logout"); //we dont need to use hhhtp://localhost:5000/api/v1/auth/logout because we have already proxied the /api requests to the backend server in vite.config.js
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await axios.get("/api/v1/auth/authCheck"); // receives the response from the server using axios

			set({ user: response.data.user, isCheckingAuth: false }); // set the user object to the user data returned from the server when the user is authenticated
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			// toast.error(error.response.data.message || "An error occurred"); // we dont need to show a toast message here
		}
	},
}));