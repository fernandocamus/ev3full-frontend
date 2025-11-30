import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <span className="text-4xl">🦖</span>
      <div>
        <h1 className="text-2xl font-bold text-white m-0">Dinobox</h1>
        <p className="text-green-100 text-sm m-0">A un rawr de tu casa</p>
      </div>
    </Link>
  );
};

export default Logo;
