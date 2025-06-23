import { useApp } from "../../context/AppContextProvider";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const { signupUser } = useApp();
  const { name, email, password, role } = userData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signupUser(name, email, password, role);
      if (res?.status == 201) {
        navigate("/");
      }
      setUserData({ name: "", email: "", password: "", role: "" });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative">
      <div className="flex justify-center items-center h-screen md:mt-16 mx-4">
        <form
          onSubmit={handleSubmit}
          className="w-full p-8 sm:w-1/2 lg:w-1/3 bg-formBackground z-20"
        >
          <p className="text-xl text-center font-semibold text-white">
            Create Account
          </p>

          <div className="mt-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Name
            </label>
            <input
              className=" text-black focus:outline-none focus:shadow-outline border border-borderColor rounded py-2 px-2 block w-full appearance-none"
              name="name"
              value={userData.name}
              onChange={handleChange}
              type="text"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Email
            </label>
            <input
              className="text-black focus:outline-none focus:shadow-outline border border-borderColor rounded py-2 px-2 block w-full appearance-none"
              name="email"
              value={userData.email}
              onChange={handleChange}
              type="email"
              required
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
            </div>
            <div className="flex justify-center items-center bg-white rounded">
              <input
                className="text-black focus:outline-none focus:shadow-outline rounded py-2 px-2 block w-full appearance-none"
                name="password"
                value={userData.password}
                onChange={handleChange}
                type={passwordVisible ? "text" : "password"}
                required
              />
              <button type="button" className="px-1.5" onClick={togglePassword}>
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-white text-sm font-semibold mb-2">
                Role
              </label>
            </div>
            <select
              name="role"
              id="role"
              value={userData.role}
              onChange={handleChange}
              className="text-black focus:outline-none focus:shadow-outline border border-borderColor rounded py-2 px-2 block w-full appearance-none cursor-pointer"
            >
              <option value="">Select Your Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <div className="mt-8">
            <button
              disabled={isLoading}
              className="bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3 px-2 w-full rounded-md cursor-pointer flex justify-center items-center text-center"
            >
              {isLoading ? (
                <div className="border-formBackground h-5 w-5 animate-spin rounded-full border-[3px] border-t-cyan-600" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center text-white">
            <p>
              Already have an Account?{" "}
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <span className="absolute bg-cyan-600/40 w-60 md:w-80 h-60 md:h-80 rounded-full blur-3xl top-10 left-0 sm:top-20 sm:left-20 z-10"></span>
      <span className="absolute bg-blue-800/40 w-60 md:w-80 h-60 md:h-80 rounded-full blur-3xl bottom-10 -right-10 sm:bottom-20 sm:right-0 z-10"></span>
    </div>
  );
}

export default Signup;
