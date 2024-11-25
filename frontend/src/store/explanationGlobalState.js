/*
The create function from zustand is used to create the store. A store is an object that contains the state and methods to manipulate it.


export const useAuthStore = create((set) => ({
  user: null,               // Represents the current logged-in user.
  isSigningUp: false,       // Indicates if a signup process is ongoing.
  isCheckingAuth: true,     // Tracks whether an authentication check is happening.
  isLoggingOut: false,      // Indicates if a logout is happening.
  isLoggingIn: false,       // Indicates if a login process is ongoing.

  signup: async (credentials) => { ... }, // Method to handle signup.
  login: async (credentials) => { ... },  // Method to handle login.
  logout: async () => { ... },            // Method to handle logout.
  authCheck: async () => { ... }          // Method to check user authentication.
}));

set is a function provided by Zustand to update the state.
Each key in the store represents a piece of state or a method.





1}const { signup, isSigningUp } = useAuthStore();



2)The signup form uses the signup method to send the user's data (email, username, password) to the server:

const handleSignUp = (e) => {
  e.preventDefault(); // Prevent page refresh on form submission.
  signup({ email, username, password }); // Call the signup method from the store.
}


3)State is updated by calling set inside the store methods. For example, in the signup method:


signup: async (credentials) => {
  set({ isSigningUp: true }); // Set `isSigningUp` to true to indicate a process has started.
  try {
    const response = await axios.post("/api/v1/auth/signup", credentials);
    set({ user: response.data.user, isSigningUp: false }); // Update the user object and reset `isSigningUp`.
    toast.success("Account created successfully");
  } catch (error) {
    set({ isSigningUp: false, user: null }); // Reset on error.
    toast.error(error.response.data.message || "Signup failed");
  }
}


4)Start the Signup Process

set({ isSigningUp: true });


What happens: The isSigningUp state is set to true. This indicates to the application (e.g., UI components) that the signup process is currently in progress.
Effect on UI: You could use this state to show a loading spinner or disable the signup button during the process.


5)Attempt to Sign Up

const response = await axios.post("/api/v1/auth/signup", credentials);


What happens:

An HTTP POST request is made to the /api/v1/auth/signup endpoint.
credentials contains the user's signup data (e.g., email, username, password).
The await keyword pauses the execution of this function until the request is resolved.




6)Possible Outcomes:

If the request is successful:
The server responds with a 200-series status and the created user data (likely as response.data.user).

a) On Successful Signup

set({ user: response.data.user, isSigningUp: false });
toast.success("Account created successfully");

State Update:
The user state is updated with the user data from the server (response.data.user).
isSigningUp is reset to false to indicate that the signup process is complete.

User Feedback:
A success toast message is displayed: "Account created successfully".

Effect on UI:
The form can now transition to another state (e.g., redirect the user to a dashboard or login page).


b) Handle Errors

catch (error) {
  set({ isSigningUp: false, user: null });
  toast.error(error.response.data.message || "Signup failed");
}

Error Handling:
If the API request fails (e.g., invalid data, user already exists), this block is executed.
set resets the isSigningUp state to false and ensures user is set to null.

User Feedback:
An error toast message is displayed. The message comes from the server response (error.response.data.message) or defaults to "Signup failed" if no specific message is provided.

Effect on UI:
The form remains on the signup page, allowing the user to correct their input and try again.


 */