import {
  BeakerIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div>
      <div className=" h-screen w-screen flex flex-col">
        <Header />
        <h1 className=" text-center my-5 text-2xl"> Most Popular Ideas</h1>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="flex-shrink-0 text-3xl font-bold text-center uppercase ml-4 relative mr-7 ">
        <h1>OSP</h1>
      </div>

      <form
        className="flex flex-1 items-center space-x-2 rounded-sm border
         border-gray-700 bg-gray-600 px-3 py-1"
      >
        <MagnifyingGlassIcon className=" h-5 w-5 text-gray-400 " />
        <input
          className="flex-1 bg-transparent outline-none text-gray-400"
          type="text"
          placeholder="Search"
        />
        <button type="submit" hidden />
      </form>

      <div className=" text-xl mx-4 flex items-center cursor-pointer ">
        <h1 className="header__link mx-7 ">Home</h1>
        <div
          onClick={() => {
            console.log("stuff");
          }}
          className="  cursor-pointer items-center inline-flex "
        >
          <p className="header__link hidden lg:inline-flex">Sign In</p>
          <UserIcon className="icon" />
        </div>
      </div>
    </div>
  );
}
