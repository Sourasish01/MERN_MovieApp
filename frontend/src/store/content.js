import { create } from "zustand";

export const useContentStore = create((set) => ({ // useContentStore is a custom hook that returns the state and the setState function
	contentType: "movie",
	setContentType: (type) => set({ contentType: type }),
}));

/*import { create } from "zustand";

Imports the create function from the zustand library.
Zustand is a small, fast, and flexible state management library for React.
Defining useContentStore:

useContentStore is a custom hook that serves as the entry point for accessing and updating the state managed by Zustand.
create((set) => ({ ... })):

create is used to define the state store.
It takes a function as an argument that receives set (a function provided by Zustand to update the state).
The function returns an object defining the initial state and any updater functions.
State Properties:

contentType: "movie":
Defines a property contentType in the state with an initial value of "movie".

setContentType: (type) => set({ contentType: type }):
Defines a function setContentType that takes an argument type.
It calls the set function to update the state with a new value for contentType.
Usage:

The useContentStore hook can be used in React components to get or modify the contentType state. */