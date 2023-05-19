import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Login from "./login";

export default function Header() {
  const router = useRouter();

  const [searchString, setSearchString] = useState("");

  function onSubmitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchString) {
      router.push(`/search/${searchString}`);
    }
  }

  return (
    <div className="header justify-center items-center ">
      <div className=" w-full xl:w-4/5  justify-between flex py-2">
        <div className="  inline-flex  justify-center gap-1">
          <div
            onClick={() => router.push("/")}
            className="flex-shrink-0 text-4xl cursor-pointer font-bold text-center  uppercase ml-4 relative mr-4 "
          >
            <h1 className="">OSP</h1>
          </div>

          <form
            onSubmit={(e) => onSubmitSearch(e)}
            className="md:flex hidden  self-center items-center h-7  w-96 space-x-2 space rounded-md border
          border-gray-700 bg-gray-600   py-2"
          >
            <div>
              <MagnifyingGlassIcon className=" ml-2 h-5 w-5 text-gray-400 " />
            </div>
            <input
              className="flex-1 bg-transparent outline-none text-gray-400 placeholder:text-md"
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
          </form>
        </div>

        <div className=" text-xl mx-3 flex items-center cursor-pointer  ">
          <h1
            className="header__link mx-2 hover:text-emerald-200 "
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </h1>
          <h1
            className="header__link mx-3 hover:text-emerald-200 "
            onClick={() => {
              router.push("/genres");
            }}
          >
            Genres
          </h1>
          <h1
            className="header__link mx-3 hover:text-emerald-200 "
            onClick={() => {
              router.push("/tags");
            }}
          >
            Tags
          </h1>
          <Login />
        </div>
      </div>
    </div>
  );
}
