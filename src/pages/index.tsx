import { trpc } from "../utils/trpc";
import {
  BeakerIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import MostPopular from "./most_popular";
import path from "path";

export default function Home() {
  const { data, isLoading, isSuccess } = trpc.useQuery(["idea.getAll"]);

  if (isLoading) {
    return <div>is loading...</div>;
  }
  if (isSuccess) {
    console.log(data);
    return (
      <div id="no-scroll1 ">
        <div className=" h-screen w-screen flex flex-col">
          <Header />
          <MostPopular />
        </div>
      </div>
    );
  }
}

function Header() {
  return (
    <div className="header">
      <div className="  inline-flex  justify-center gap-1">
        <div className="flex-shrink-0 text-3xl font-bold text-center uppercase ml-4 relative mr-4 ">
          <h1>OSP</h1>
        </div>

        <form
          className="flex  self-center items-center h-6   w-96 space-x-2 space rounded-md border
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
        <h1 className="header__link mx-4 hover:text-emerald-200">Home</h1>
        <div
          onClick={() => {
            console.log("stuff");
          }}
          className="  cursor-pointer items-center inline-flex hover:text-emerald-200"
        >
          <p className="header__link hidden lg:inline-flex">Sign In</p>
          <UserIcon className="icon " />
        </div>
      </div>
    </div>
  );
}
