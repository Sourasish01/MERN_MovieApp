import React from "react";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WatchPage from "./pages/WatchPage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { Loader } from "lucide-react";

function App() {

  const { user, isCheckingAuth, authCheck } = useAuthStore(); //useAuthStore hook returns an object with the user object and methods to check if the user is authenticated
  console.log( ' auth user is ', user);

  useEffect(() => { //useEffect is udes to run once when the component mounts ie. when the app is loaded
		authCheck();
	}, [authCheck]);

  if (isCheckingAuth) { // this was introduced to fill the time gap between the time the app is loaded and the time the user object is set to null, so that during the time lag our webpage does not buffer between the AuthScreen and HomeScreen ..... so we show a loader
		return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
	}

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={"/"} />} /> {/* for a authenticated client, he must have performed either login or signup or have cookies in his browser  so the userobject will be present, so if user is not authenticated, render LoginPage, else redirect to HomePage*/}
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to={"/"} />} /> {/* when we logout,cookies are deleted and the user object is set to null, so if user is not authenticated, render SignUpPage, else redirect to HomePage*/}
        <Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={"/login"} />} />
      </Routes>
      <Footer /> {/*Footer component is rendered on every page , therefore put ouside Routes*/}

      <Toaster /> {/*Toaster component is rendered on every page , therefore put ouside Routes*/}
    </>
  );
}

export default App;
