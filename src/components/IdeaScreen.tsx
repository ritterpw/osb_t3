import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Idea } from "@prisma/client";
import React from "react";
import MusicPlayer from "./MusicPlayer";

function IdeaScreen({ idea }: { idea: Idea }) {
  const { data, error, isLoading, isError } = trpc.useQuery([
    "user.getUserById",
    { userId: idea.userId },
  ]);

  if (isError) {
    return <p>Error... {error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-full w-screen   bg-gradient-to-b  from-vercel-1000 via-vercel-1000 to-vercel-900  p-10 items-center ">
      <div className="   bg-vercel-1000 rounded-sm border  border-vercel-700 shadow-xl shadow-vercel-900 w-[85%] p-2 m-auto  grid  grid-rows-[1fr_2.5fr]">
        <div className="">
          <div className="  h-full   px-6 py-1">
            <div className="  grid grid-flow-rows">
              <div className=" mr-auto  my-auto grid grid-flow-col text-left space-x-2 ">
                <div className="">
                  <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
                    {/* {data && data.user?.image != null && (
                      <img
                        className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
                        src={data.user?.image}
                      />
                    )}
                    {!data && <UserCircleIcon className=" p-6" />} */}
                    <UserCircleIcon className="" />
                  </button>
                </div>
                <div className=" my-auto text-md xl:text-lg">
                  {data?.user?.producer_name != null
                    ? data?.user?.producer_name
                    : data?.user?.name}
                </div>
              </div>
              <div className=" mr-auto pt-2  text-xl lg:text-2xl  xl:text-3xl">
                {idea.title}
              </div>
            </div>
          </div>
        </div>
        <div className="    px-6 ">
          <div>{idea.description}</div>
          <div className="  my-6  bg-vercel-1000 border border-vercel-800 shadow-md  shadow-vercel-900  ">
            <MusicPlayer file={idea.file} />
          </div>
          <div className=" items-end content-end text-right justify-end pb-4 ">
            <button
              className="mr-4   px-4 py-2  bg-vercel-900 border border-vercel-800 shadow-sm rounded shadow-vercel-1000 hover:bg-emerald-600 hover:text-vercel-900"
              onClick={() => {
                console.log("button");
              }}
            >
              Add Idea
            </button>
            <button
              className=" border px-4 py-2 rounded  bg-vercel-900   border-vercel-800 shadow-sm shadow-vercel-1000 hover:bg-emerald-600 hover:text-vercel-900"
              onClick={() => {
                console.log("button");
              }}
            >
              Something
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaScreen;
