import {
  Home,
  User,
  LayoutDashboard,
  BookOpenCheck,
  PlusCircleIcon,
  AlignJustify,
  Video,
} from "lucide-react";
import { useState } from "react";

import { NavLink } from "react-router-dom";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-20">
      <button
        type="button"
        className="flex items-center justify-center flex-col p-2 mt-4 ms-3 text-lg rounded md:hidden bg-primary text-white"
        onClick={toggleSidebar}
      >
        <AlignJustify className="size-6" />
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`fixed top-[60px] left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 bg-formBackground text-white ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-8 overflow-y-auto">
          <ul className="space-y-2 font-medium my-2">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`
                }
              >
                <Home className="size-5" />
                <span className="ms-3">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`
                }
              >
                <LayoutDashboard className="size-5" />
                <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`
                }
              >
                <User className="size-5" />
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/courses"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`
                }
              >
                <BookOpenCheck className="size-5" />
                <span className="flex-1 ms-3 whitespace-nowrap">Courses</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/lessons"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`
                }
              >
                <Video className="size-5" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Course Lessons
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/instructor/addcourse"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md ${
                    isActive
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`
                }
              >
                <PlusCircleIcon className="size-5" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Add New Course
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
