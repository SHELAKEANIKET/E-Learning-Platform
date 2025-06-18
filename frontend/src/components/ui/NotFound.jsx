import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mt-20 grid place-items-center gap-5">
      <p className="text-red-500 text-4xl font-semibold">Page Not Found</p>
      <Link to={"/"} className="text-white bg-primary py-1 px-2 rounded">Back to Home</Link>
    </div>
  );
}

export default NotFound;
