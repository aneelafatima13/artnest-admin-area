import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
      <p>© {new Date().getFullYear()} ArtNest — All rights reserved 🎨</p>
    </footer>
  );
}

export default Footer;
