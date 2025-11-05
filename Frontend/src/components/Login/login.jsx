
import loginbg from "../../public/loginbg-03.jpg"
import vite from "../../public/vite.svg"
 
import React from 'react'

const login = () => {
     return (
    <div className="min-h-screen flex flex-col md:flex-row dark:bg-gray-900 transition-colors duration-300">
      {/* Left Side Image Section */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginbg})` }}
      >
        {/* Optional overlay text */}
        <div className="flex items-center justify-center w-full bg-black/40">
          
        </div>
      </div>

      {/* Right Side Form Section */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-6 md:p-10">
        {/* Logo */}
        <img src={vite} alt="Logo" className="w-20 mb-6 dark:invert" />

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" id="welcomeback">
          Welcome Back
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          Enter your email or username and password to access your account
        </p>

        {/* Login Form */}
        <form className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email or Username
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
          >
            Sign In
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
           <span className="text-amber-50"> Sign in with Google</span>
          </button>

          <p className="text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default login

