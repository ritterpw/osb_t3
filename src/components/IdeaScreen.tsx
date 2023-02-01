import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Idea } from "@prisma/client";
import React from "react";
import CardUserDisplay from "./CardUserDisplay";

function IdeaScreen({ idea }: { idea: Idea }) {
  const { data, error, isLoading, isError } = trpc.useQuery([
    "user.getUserById",
    { userId: idea.userId },
  ]);

  return (
    <div className="h-screen w-screen bg-gray-900   bg-gradient-to-b  from-transparent to-gray-800  p-10 items-center ">
      <div className=" bg-gray-900  rounded-xl h-[95%] w-[85%] m-auto  grid  grid-rows-[1.4fr_4fr_2fr]">
        <div className=" bg-gray-800 ">
          <div className=" rounded-b-[72px] bg-gray-900 h-full">
            <div className="   flex  pt-[82px] pl-20 absolute   ">
              <button className="  h-32 w-32 m-auto shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
                {data && data.user?.image != null && (
                  <img
                    className=" h-32 w-32 rounded-full cursor-pointer hover:opacity-80  "
                    src={data.user?.image}
                  />
                )}
                {!data && <UserCircleIcon className=" p-6" />}
              </button>
            </div>
          </div>
        </div>
        <div className=" bg-gray-800  p-20"></div>

        <div className=" bg-gradient-to-b from-gray-800 to-gray-700 p-20">
          hi
        </div>
      </div>
    </div>
  );
}

export default IdeaScreen;
