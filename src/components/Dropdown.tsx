import { Genre } from "@prisma/client";
import React, { useState } from "react";

type Props = {
  list: string[];
  setItem: (item: string) => void;
  title: string;
};
const Dropdown = ({ list, setItem, title }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-10 inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-sm border border-vercel-600 bg-vercel-9000 text-emerald-400 shadow-md px-4 py-1 text-md font-medium  hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200 "
          id="dropdown-menu-button"
          aria-expanded={isOpen ? "true" : "false"}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {title}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.95a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 13.086l4.293-4.293a1 1 0 011.414 1.414l-5 5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2  w-64 max-h-44 overflow-y-auto rounded-md shadow-lg bg-vercel-800 ring-1 ring-black ring-opacity-5">
          {list &&
            list.map((item) => {
              return (
                <a
                  href="#"
                  key={item}
                  className="block px-4 py-2 border-b border-vercel-900 last:border-b-0 text-md bg-vercel-800 ease-in duration-200 hover:bg-emerald-500  hover:text-gray-900 rounded-sm shadow-md shadow-vercel-1000"
                  onClick={() => {
                    toggleDropdown();

                    setItem(item);
                  }}
                >
                  {item.replace(/_/g, " ")}
                </a>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
