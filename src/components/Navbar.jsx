import React from "react";

function Navbar() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">ArtNest 🖼️</h1>
      <nav className="space-x-6 text-gray-600">
        <a href="/">Home</a>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
}

export default Navbar;
