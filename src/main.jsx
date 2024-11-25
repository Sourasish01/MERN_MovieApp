import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter> {/*BrowserRouter is a component that wraps the App component to provide routing capabilities */}
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
