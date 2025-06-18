import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

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
    <nav className="py-4 px-4 fixed top-0 w-full shadow z-50 bg-transparent bg-opacity-5 backdrop-filter backdrop-blur-xl">
      <div className="px-4 flex items-center justify-between gap-4 w-full">
        {/* Logo */}
        <div className="text-lg md:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent leading-normal">
          <Link to="/">EduHub</Link>
        </div>
        <div>
          {authLoading == true ? (
            <div className="text-white"></div>
          ) : (
            <>
              {user == null && (
                <div className="flex items-center justify-end gap-4">
                  <Link
                    className="inline-flex items-center justify-center text-base font-medium px-4 py-2 text-white"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150"
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
                  className="text-white border-2 border-white rounded-full cursor-pointer"
                >
                  <User />
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
