import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import router from "next/router";
import Login from "./login";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="header">
      <div className="  inline-flex  justify-center gap-1">
        <div className="flex-shrink-0 text-3xl font-bold text-center uppercase ml-4 relative mr-4 ">
          <h1>OSP</h1>
        </div>

        <form
          className="md:flex hidden  self-center items-center h-6   w-96 space-x-2 space rounded-md border
           border-gray-700 bg-gray-600   py-2"
        >
          <MagnifyingGlassIcon className=" ml-2 h-4 w-4 text-gray-400 " />
          <input
            className="flex-1 bg-transparent outline-none text-gray-400 placeholder:text-sm"
            type="text"
            placeholder="Search"
          />
          <button type="submit" hidden />
        </form>
      </div>

      <div className=" text-xl mx-4 flex items-center cursor-pointer  ">
        <h1
          className="header__link mx-4 hover:text-emerald-200 "
          onClick={() => {
            router.push("/");
          }}
        >
          Home
        </h1>
        <Login />
      </div>
    </div>
  );
}
