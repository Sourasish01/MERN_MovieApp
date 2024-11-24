import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

// dont need to do this in axios.....
/*fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
*/

  
 

export const fetchFromTMDB = async (url) => { //fetch the data from the TMDB API, this is the function that will be called in the controller to fetch the data from the TMDB API, the benifit of this function is that we can reuse it in other parts of the application, ie..the headers object is set in this function and we can reuse it in other parts of the application
    const options = {
        //method: 'GET', //dont need to do this in axios....already set to GET in the axios.get(url, options) method
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY
        }
    };

    const response = await axios.get(url, options) //fetch the data from the TMDB API using the URL and the options using axios
    
    if(response.status !== 200){
        throw new Error("Failed to fetch data from TMDB" + response.statusText);

    }

    return response.data;

}