import React from 'react'
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import { useAuthStore } from "../../store/authUser";


const HomePage = () => {
  const { user } = useAuthStore(); //useAuthStore hook returns an object with the user object and methods to check if the user is

	return <>{user ? <HomeScreen /> : <AuthScreen />}</>; /*If user is true, render HomeScreen, else render AuthScreen*/
}

export default HomePage