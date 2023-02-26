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
    <div className="h-full w-screen    bg-gradient-to-b   from-vercel-1000 via-vercel-1000 to-vercel-900  p-10 items-center ">
      <div className=" p-3 rounded  border border-vercel-600   shadow-lg w-[85%] m-auto  grid  grid-rows-[1fr_2.5fr]">
        <div className="">
          <div className="   h-full   px-6 py-1">
            <div className="  grid grid-flow-rows">
              <div className=" mr-auto   my-auto grid grid-flow-col text-left space-x-2 ">
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
          <div className=" rounded border border-vercel-600  my-4   ">
            <MusicPlayer file={idea.file} />
          </div>
          <div className="items-end text-right justify-end content-end  ">
            <button className=" py-2 px-4 mr-4 rounded border border-vercel-800 shadow-md shadow-vercel-900 hover:bg-emerald-500 hover:text-vercel-800">
              contribute to idea
            </button>
            <button className=" py-2 px-4 rounded border border-vercel-800 shadow-md shadow-vercel-900 hover:bg-emerald-500 hover:text-vercel-800 ">
              add idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaScreen;
