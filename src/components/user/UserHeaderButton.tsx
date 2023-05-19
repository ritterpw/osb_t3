import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";

const UserHeaderButton = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="button__icon flex">
        <UserIcon
          onClick={() => setIsOpen(!isOpen)}
          className="  h-6 w-6  flex-col  object-center "
        />
      </div>
      {isOpen && (
        <div
          className=" absolute top-0 left-0 z-20 h-full w-[100vw] bg-opacity-75"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute right-0 mr-10  mt-20 w-56 origin-top-right rounded-md border border-vercel-400 bg-vercel-900 shadow-lg shadow-vercel-1000 ring-1 ring-black ring-opacity-5 transition duration-200 ease-in focus:outline-none">
            <div className="">
              {session?.user?.email && (
                <h1
                  className=" block rounded-t-md border-b  border-vercel-600 bg-vercel-1000 px-4 py-2  text-sm text-gray-400 "
                  role="menuitem"
                >
                  {session?.user.email}
                </h1>
              )}
              <a
                href="#"
                className="block  px-4 py-2 text-sm text-gray-400 hover:bg-vercel-1000 hover:text-gray-300"
                role="menuitem"
              >
                Settings
              </a>
              <div
                onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                className="block cursor-pointer rounded-b-md px-4 py-2 text-sm  text-gray-400 hover:bg-vercel-1000 hover:text-gray-300"
                role="menuitem"
              >
                Log out
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHeaderButton;
