import express from "express";
import cookieParser from "cookie-parser"; //parse the cookie from the request
import { ENV_VARS } from "./config/envVars.js";
// auth
import { connectDB } from "./config/db.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "./utils/generateToken.js";
import { User } from "./models/user.model.js";
//middleware
import { protectRoute } from "./middleware/protectRoute.js";
//movie,tv show
import { fetchFromTMDB } from "./services/tmdb.service.js";



const PORT = ENV_VARS.PORT;

const app = express();

app.use(express.json());//will allow us to accept JSON data in the body ie..using req.body
app.use(cookieParser());//parse the cookie from the request

// Authentication routes
app.post("/api/v1/auth/signup", async (req, res) => {
	try {
		
		const { email, password, username } = req.body; //check if the email, password and username are present in the request body
		if (!email || !password || !username) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //check if the email is valid
		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, message: "Invalid email" });
		}

		if (password.length < 6) { //check if the password is at least 6 characters long
			return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
		}

		const existingUserByEmail = await User.findOne({ email: email }); //check if the email already exists in the database
		if (existingUserByEmail) {
			return res.status(400).json({ success: false, message: "Email already exists" });
		}

		const existingUserByUsername = await User.findOne({ username: username }); //check if the username already exists in the database
		if (existingUserByUsername) {
			return res.status(400).json({ success: false, message: "Username already exists" });
		}



		const salt = await bcryptjs.genSalt(10);//generate a salt for the password
		const hashedPassword = await bcryptjs.hash(password, salt);//hash the password using the salt



		const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"]; //array of profile pictures
		const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];//select a random profile picture

		const newUser = new User({ //create a new user profile, after validating the email, password and username from the request.body using above checks
			email: email,//assign the email, password, username and image to the newUser object
			password: hashedPassword,
			username: username,
			image: image,
		});

        generateTokenAndSetCookie(newUser._id, res);//generate a token using the userId and set it in a cookie, with this we can implement the logout functionality

		await newUser.save(); //save the new user profile to the database

		res.status(201).json({//send a response to the client that the user has been successfully created
			success: true,
			user: { //send the user object to the client , ie the frontend, where the user object is the user data returned from the server when the user signs up , and this data is used as response.data.user in the signup method(asynchronous function) in the useAuthStore hook in the frontend
				...newUser._doc,// send the user object to the client
				password: "", //do not send the password to the client
			},
		});

	} 
	catch (error) {//if there is an error in the above code, catch the error and send a response to the client that there was an internal server error
		console.log("Error in signup controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
});

app.post("/api/v1/auth/login", async (req, res) => {
	try {
		const { email, password } = req.body; //check if the email and password are present in the request body

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const user = await User.findOne({ email: email }); //check if the email exists in the database
		if (!user) {
			return res.status(404).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password); //compare the password from the request body with the password in the database using bcryptjs, which will return a boolean value

		if (!isPasswordCorrect) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(user._id, res); // if all the above checks pass, generate a token using the userId and set it in a cookie

		res.status(200).json({ //send a response to the client that the user has been successfully logged in
			success: true,
			user: { //send the user object to the client by deleting the password from the user object
				...user._doc,
				password: "",
			},
		});

	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
	
});



app.post("/api/v1/auth/logout", async (req, res) => { //just clear the cookie
	
	try {
		res.clearCookie("jwt-movieapp"); //clear the cookie
		res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
});

app.get("/api/v1/auth/authCheck", protectRoute, async (req, res) => { //check if the user is authenticated
	
	try {
		console.log("req.user:", req.user); // if the user is authenticated by the protectRoute middleware, the user object will be added to the req object, and we can access it using req.user as console.log("req.user:", req.user);
		res.status(200).json({ success: true, user: req.user }); 
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}

});




// bea107d21917ae8181c023a711544d07
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZWExMDdkMjE5MTdhZTgxODFjMDIzYTcxMTU0NGQwNyIsIm5iZiI6MTczMTk1ODk5MS4wMTQzOTg4LCJzdWIiOiI2NzNiOTZkZWE1ZmFkMWVlOTk5MDM4YTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.cT5aFKjg4ggCz0knvNg_W0DY6IhF5YvD0DoD_-MkDEs

// MOVIE ROUTES

app.get("/api/v1/movie/trending", protectRoute, async (req, res) => { //fetch the trending movies from the TMDB API
	try {
		const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US"); //fetch the trending movies array from the TMDB API
		const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)]; //select a random movie from the trending movies array

		res.json({ success: true, content: randomMovie }); //content is used instead of movie to make it more generic, ie..it can be a movie or a tv show
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

app.get("/api/v1/movie/:id/trailers", protectRoute, async (req, res) => {//fetch the trailers of a movie using the movie id
	const { id } = req.params;
	
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
		res.json({ success: true, trailers: data.results });
	} 
	catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}

}); 

app.get("/api/v1/movie/:id/details", protectRoute, async (req, res) => {
	
	const { id } = req.params;
	
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

app.get("/api/v1/movie/:id/similar", protectRoute, async (req, res) => {

	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

app.get("/api/v1/movie/:category", protectRoute, async (req, res) => {

	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

//TV SOWS ROUTES

app.get("/api/v1/tv/trending", protectRoute, async (req, res) => { //fetch the trending movies from the TMDB API
	try {
		const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US"); //fetch the trending movies array from the TMDB API
		const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)]; //select a random movie from the trending movies array

		res.json({ success: true, content: randomMovie }); //content is used instead of movie to make it more generic, ie..it can be a movie or a tv show
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

app.get("/api/v1/tv/:id/trailers", protectRoute, async (req, res) => {//fetch the trailers of a movie using the movie id
	const { id } = req.params;
	
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
		res.json({ success: true, trailers: data.results });
	} 
	catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}

}); 

app.get("/api/v1/tv/:id/details", protectRoute, async (req, res) => {
	
	const { id } = req.params;
	
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

app.get("/api/v1/tv/:id/similar", protectRoute, async (req, res) => {

	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, similar: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

app.get("/api/v1/tv/:category", protectRoute, async (req, res) => {

	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 



//SEARCH ROUTES


app.get("/api/v1/search/person/:query", protectRoute, async (req, res) => { //fetch the trending movies from the TMDB API
	const { query } = req.params;
	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) { //if there are no results, send a 404 status code, // results beacuse we are getting an array of results from the API, this is what api returns
			return res.status(404).send(null);
		}

		// we need to add it to the search history of the user

		await User.findByIdAndUpdate(req.user._id, { //update the user document in the database, by adding the search history to the user document
			$push: {
				searchHistory: {
					id: response.results[0].id, //add the id, image, title, searchType and createdAt to the searchHistory array for the user in the database
					image: response.results[0].profile_path,
					title: response.results[0].name,
					searchType: "person",
					createdAt: new Date(),
				},
			},
		});

		res.status(200).json({ success: true, content: response.results });
	}
	catch (error) {
		console.log("Error in searchPerson controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

app.get("/api/v1/search/movie/:query", protectRoute, async (req, res) => {//fetch the trailers of a movie using the movie id
	const { query } = req.params;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].title,
					searchType: "movie",
					createdAt: new Date(),
				},
			},
		});
		res.status(200).json({ success: true, content: response.results });
	} 
	catch (error) {
		console.log("Error in searchMovie controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}

}); 

app.get("/api/v1/search/tv/:query", protectRoute, async (req, res) => {
	
	const { query } = req.params;

	try {
		const response = await fetchFromTMDB(
			`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
		);

		if (response.results.length === 0) {
			return res.status(404).send(null);
		}

		await User.findByIdAndUpdate(req.user._id, {
			$push: {
				searchHistory: {
					id: response.results[0].id,
					image: response.results[0].poster_path,
					title: response.results[0].name,
					searchType: "tv",
					createdAt: new Date(),
				},
			},
		});
		res.json({ success: true, content: response.results });
	} 
	catch (error) {
		console.log("Error in searchTv controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

app.get("/api/v1/search/history", protectRoute, async (req, res) => { //fetch all the search history of the user from the database

	try {
		res.status(200).json({ success: true, content: req.user.searchHistory }); //send the search history of the user from the database to the client
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 

app.get("/api/v1/search/history/:id", protectRoute, async (req, res) => { // remove an item from all the search history of the user from the database, with specific id

	let { id } = req.params;

	id = parseInt(id); //convert the id to an integer

	try {
		await User.findByIdAndUpdate(req.user._id, { //update the user document in the database, by removing the item from the search history array for the user in the database
			$pull: {                                 //remove the item from the search history array for the user in the database
				searchHistory: { id: id },          //remove the item from the search history array for the user in the database
			},
		});

		res.status(200).json({ success: true, message: "Item removed from search history" });
	} catch (error) {
		console.log("Error in removeItemFromSearchHistory controller: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
	
}); 


app.listen(PORT, () => { 
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
	
});
