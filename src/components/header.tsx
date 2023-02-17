import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Login from "./login";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const [searchString, setSearchString] = useState("");

  function onSubmitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchString) {
      router.push(`/search/${searchString}`);
    }
  }

  return (
    <div className="header">
      <div className="  inline-flex  justify-center gap-1">
        <div className="flex-shrink-0 text-3xl font-bold text-center shadow-md uppercase ml-4 relative mr-4 ">
          <h1>OSP</h1>
        </div>

        <form
          onSubmit={(e) => onSubmitSearch(e)}
          className="md:flex hidden  self-center items-center h-6   w-96 space-x-2 space rounded-md border
           border-gray-700 bg-gray-600   py-2"
        >
          <MagnifyingGlassIcon className=" ml-2 h-4 w-4 text-gray-400 " />
          <input
            className="flex-1 bg-transparent outline-none text-gray-400 placeholder:text-sm"
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
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
