import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Contribution, Idea, User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import MusicPlayer from "./MusicPlayer";
import { useSession } from "next-auth/react";

interface IdeaScreenProps {
  idea: Idea;
  contributions?: Contribution[];
  user: User;
}

function IdeaScreen({ idea, contributions, user }: IdeaScreenProps) {
  const router = useRouter();

  return (
    <div className="h-full w-screen    bg-vercel-900  pt-16 items-center ">
      <div className=" p-3 rounded-t  border border-vercel-600 bg-gradient-to-b from-vercel-900 via-vercel-900 to-vercel-1000   shadow-lg w-[65%] m-auto  grid  grid-rows-[1fr_2.5fr]">
        <div className="">
          <div className="   h-full   px-6 py-1">
            <div className="  grid grid-flow-rows">
              <div className=" mr-auto   my-auto grid grid-flow-col text-left space-x-2 ">
                <div className="">
                  <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
                    {user && user?.image != null && (
                      <img
                        className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
                        referrerPolicy="no-referrer"
                        src={user?.image}
                      />
                    )}
                    {!idea && <UserCircleIcon className=" p-6" />}
                  </button>
                </div>
                <div className=" my-auto text-md xl:text-lg">
                  {user?.producer_name != null
                    ? user?.producer_name
                    : user?.name}
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
            <button
              onClick={() => {
                router.push(`/ideas/${idea.id}/contributeToIdea`);
              }}
              className=" py-2 px-4 mr-4 rounded border border-vercel-700 shadow-md shadow-vercel-900 hover:bg-emerald-500 hover:text-vercel-800"
            >
              contribute to idea
            </button>
          </div>
        </div>
      </div>

      {contributions && contributions.length > 0 && (
        <div className="     rounded-b border-b border-x border-vercel-600 bg-vercel-1000 m-auto shadow-lg w-[65%] ">
          {contributions.map((c) => {
            console.log(c);

            return (
              <div
                key={c.id}
                className=" last:border-b-0  p-3  border-b border-vercel-600  text-vercel-500   "
              >
                {c.description}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default IdeaScreen;
