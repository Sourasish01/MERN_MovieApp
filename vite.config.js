import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": { // proxy requests to /api to the backend server
				target: "http://localhost:5000", 
			},
		},
	},
});