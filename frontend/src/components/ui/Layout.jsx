import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col max-w-screen-xl mx-auto">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!path.startsWith("/instructor/") &&
        !path.startsWith("/login") &&
        !path.startsWith("/signup") && <Footer />}
    </div>
  );
}

export default Layout;
