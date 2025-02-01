import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Auction System. All rights reserved.
        </p>
        <div className="mt-2">
          <p>For any queries, reach out at:</p>
          <p className="text-blue-300">himanshusyuni2601@gmail.com</p>
          <div className="mt-1">
            <a
              href="https://github.com/himanshusyuni"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-500"
            >
              GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
