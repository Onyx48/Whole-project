import React from "react";

import searchIconPng from "./search.png";

function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 bg-white text-black h-16 flex items-center justify-between px-4 z-40">
      <div className="w-80 relative">
        <img
          src={searchIconPng}
          alt="Search Icon"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search..."
          className={
            "w-full pl-10 pr-4 py-2 rounded bg-white text-black border border-gray-300 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-black"
          }
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded hover:bg-gray-700">Button 1</button>
        <button className="p-2 rounded hover:bg-gray-700">Button 2</button>
        <button className="p-2 rounded hover:bg-gray-700">Button 3</button>
        <div className="h-8 border-[1px] border-gray-300"></div>
        <div className="flex items-center space-x-2 cursor-pointer"></div>

        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {/* <UserIcon /> */}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            Davis Bapista
          </span>
          <span className="text-xs text-orange-500 font-medium">
            Super Admin
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
