import React from 'react'
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authUser";

const SignUpPage = () => {

    const { searchParams } = new URL(document.location);
	const emailValue = searchParams.get("email"); /* get the email value from the URL sent from the auth screen */

    const [email, setEmail] = useState(emailValue || ""); /* use as state to store the email value entered by the user, if the email value is not present in the URL, then the email state is set to an empty string */
	const [username, setUsername] = useState("");/* useStare for the email, username and password to store the values entered by the user */
	const [password, setPassword] = useState("");

    const { signup, isSigningUp } = useAuthStore(); /* use the signup method from the useAuthStore hook to sign up the user, and the isSigningUp state to check if the user is currently signing up */

    const handleSignUp = (e) => { /* function to handle the sign up form submission , so that the values entered by the user are stored in the state and not lost when the page is refreshed */
		e.preventDefault();
        signup({ email, username, password }); /* call the signup method from the useAuthStore hook to sign up the user with the email, username and password entered by the user */
		
	};


  return (
    <div className=' h-screen w-full hero-bg'>
        <header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
				<Link to={"/"}> {/*Link is a component that allows you to navigate to a different route, here the the homepage */}
					<img src='/netflix-logo.png' alt='logo' className='w-52' /> {/*The logo is displayed on the left side of the header */}
				</Link>
			</header>

            <div className='flex justify-center items-center mt-20 mx-3'>     {/* external most div to the sign up form */}
				<div className='w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md'> {/* internal div holding the hi and the sign up form */}
					<h1 className='text-center text-white text-2xl font-bold mb-4'>Sign Up</h1>

					<form className='space-y-4' onSubmit={handleSignUp}> {/* form to sign up with email, username and password, the onSubmit event handler is used to call the handleSignUp function when the form is submitted , so as to store the values entered by the user in the state */}
                    <div>
							<label htmlFor='email' className='text-sm font-medium text-gray-300 block'>
								Email
							</label>
							<input
								type='email'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='you@example.com'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)} /*onChange event handler is used to call the setEmail function when the value of the input field changes, so as to store the value entered by the user in the state */
							/>
						</div>

						<div>
							<label htmlFor='username' className='text-sm font-medium text-gray-300 block'>
								Username
							</label>
							<input
								type='text'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='johndoe'
								id='username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						<div>
							<label htmlFor='password' className='text-sm font-medium text-gray-300 block'>
								Password
							</label>
							<input
								type='password'
								className='w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring'
								placeholder='••••••••'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							className='w-full py-2 bg-red-600 text-white font-semibold rounded-md
							hover:bg-red-700
						'
							
						>
							Signup
						</button>

					</form>
                    <div className='text-center text-gray-400'>
						Already a member?{" "}
						<Link to={"/login"} className='text-red-500 hover:underline'>
							Sign in
						</Link>
					</div>

				</div>
			</div>

    </div>
  )
}

export default SignUpPage