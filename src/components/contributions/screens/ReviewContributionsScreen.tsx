import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Contribution, User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ideasWithLikes } from "types/ideasWithLikes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";
import ContributeToIdea from "@/components/ideas/ContributeToIdea";
import ReviewContributions from "../ReviewContributions";

interface IdeaScreenProps {
  idea: ideasWithLikes;
  contributions?: Contribution[];
  ideaUser: User;
}

function IdeaScreen({ idea, contributions, ideaUser }: IdeaScreenProps) {
  const router = useRouter();

  const { data: session } = useSession();

  const [openContributionModal, setOpenContributionModal] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col  overflow-y-clip  h-full w-screen bg-vercel-900 md:py-16 items-center">
      <div className="px-3 rounded-t border-b md:border border-vercel-600 bg-gradient-to-b from-vercel-900 via-vercel-900 to-vercel-1000 w-[100%]  shadow-lg md:w-[75%] xl:w-[50%]  flex flex-col">
        <div className="  w-full px-6 pt-3 md:pt-6">
          <div className="  w-full flex flex-row justify-between">
            <div className="   text-xl lg:text-2xl  xl:text-3xl">
              {idea.title}
            </div>
            <div className=" my-auto grid grid-flow-col text-left space-x-2 ">
              <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
                {ideaUser && ideaUser?.image != null && (
                  <Image
                    className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
                    referrerPolicy="no-referrer"
                    height={1000}
                    width={1000}
                    src={ideaUser?.image}
                  />
                )}
                {!idea && <UserCircleIcon className=" p-6" />}
              </button>
              <div className=" my-auto text-md xl:text-lg">
                {ideaUser?.producer_name != null
                  ? ideaUser?.producer_name
                  : ideaUser?.name}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6">
          <div className=" py-3 md:py-6">{idea.description}</div>
          <div
            className={`rounded border border-vercel-600  shadow-[rgba(102,102,102,1)_5px_5px_0px_0px] `}
          >
            <MusicPlayer file={idea.file} idea={idea} user={ideaUser} />
          </div>

          <div className="items-end text-right justify-end content-end ">
            <button
              onClick={() => {
                setOpenContributionModal(!openContributionModal);
              }}
              className=" py-2 px-4  my-6 rounded border border-vercel-700 shadow-md shadow-vercel-900 transition-all duration-300 ease-in hover:rounded-xl hover:font-bold hover:bg-emerald-500 hover:text-vercel-1000"
            >
              {idea.userId == session?.user.id
                ? "Contribute To Your Idea"
                : "Contribute To Idea"}
            </button>
          </div>
        </div>
      </div>
      {openContributionModal && (
        <ContributeToIdea setOpenContributionModal={setOpenContributionModal} />
      )}

      {contributions && contributions.length > 0 && (
        <ReviewContributions contributions={contributions} ideaID={idea.id} />
      )}
    </div>
  );
}

export default IdeaScreen;
