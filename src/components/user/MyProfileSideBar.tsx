import React from "react";
import { Cog6ToothIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const MyProfileSideBar = () => {
  const router = useRouter();
  return (
    <div>
      <ul>
        <li
          className={` flex cursor-pointer items-center gap-2 py-3 text-vercel-400 hover:bg-vercel-700 ${
            router.pathname === "/me" ? "border-l-4 border-emerald-600" : ""
          }`}
          onClick={() => router.push("/me")}
        >
          <HomeIcon className="ml-12 h-9 w-9  object-center" />
          <h1 className=" pl-4 text-lg ">My Profile</h1>
        </li>

        <li
          className={` flex cursor-pointer items-center gap-2 py-3 text-vercel-400 hover:bg-vercel-700 ${
            router.pathname === "/settings"
              ? "border-l-4 border-emerald-600"
              : ""
          }`}
          onClick={() => router.push("/settings")}
        >
          <Cog6ToothIcon className="ml-12 h-9 w-9 object-center " />
          <h1 className=" pl-4 text-lg ">Settings</h1>
        </li>
      </ul>
    </div>
  );
};

export default MyProfileSideBar;
