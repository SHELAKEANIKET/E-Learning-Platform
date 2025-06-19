import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import userProfile from "/assets/userProfile.jpg";

function Navbar() {
  const { user, logout, authLoading } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(!open);
  };
  return (
    <nav className="py-4 px-4 fixed top-0 left-0 w-full shadow z-50 bg-transparent bg-opacity-5 backdrop-filter backdrop-blur-xl">
      <div className="px-1 lg:px-4 flex items-center justify-between gap-4 w-full">
        {/* Logo */}
        <div className="text-lg md:text-lg lg:text-xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent leading-normal">
          <Link to="/">EduHub</Link>
        </div>
        <div>
          {authLoading == true ? (
            <div className="text-white"></div>
          ) : (
            <>
              {user == null && (
                <div className="flex items-center justify-end gap-3">
                  <Link
                    className="inline-flex items-center justify-center text-base font-medium px-4 py-2 text-white hover:bg-formBackground hover:rounded"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded bg-gradient-to-r from-gradient-start to-gradient-end px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150"
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}

          {user !== null && (
            <div className="relative text-left">
              <div className="flex justify-center items-center">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className="text-white border-2 rounded-full cursor-pointer"
                >
                  <img src={userProfile} className="w-7 h-7 lg:w-9 lg:h-9 rounded-full" alt="userProfile" />
                </button>
              </div>

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-5 w-28 bg-white shadow-lg z-10"
                >
                  {user?.role === "student" && (
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(!open)}
                      className="block px-4 py-2 text-black hover:bg-primary hover:text-white font-medium transition-all duration-200"
                    >
                      Profile
                    </Link>
                  )}
                  {user?.role === "instructor" && (
                    <Link
                      to="/instructor/dashboard"
                      onClick={() => setIsOpen(!open)}
                      className="block px-4 py-2 text-black hover:bg-primary hover:text-white font-medium transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-black hover:bg-primary hover:text-white font-medium transition-all duration-200"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
