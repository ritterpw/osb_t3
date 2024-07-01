import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Contribution, User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import MusicPlayer from "../MusicPlayer";
import { ideasWithLikes } from "types/ideasWithLikes";
import { useSession } from "next-auth/react";
import ReviewContributions from "../contributions/ReviewContributions";
import Image from "next/image";
import ContributeToIdea from "./ContributeToIdea";
import { CSSTransition } from "react-transition-group";
import toast, { Toaster } from "react-hot-toast";

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

  const [openReviewContributions, setOpenReviewContributions] =
    useState<boolean>(false);

  function clickContribute() {
    if (openReviewContributions) {
      toast.dismiss(); // Dismiss any existing toasts

      toast.error("Cannot Contribute While Reviewing Contributions");
      return;
    }

    setOpenContributionModal(!openContributionModal);
  }

  function clickReview() {
    if (openContributionModal) {
      toast.dismiss(); // Dismiss any existing toasts

      let t;
      t = toast.error("Cannot Review Contributions While Contributing");
      return;
    }

    setOpenReviewContributions(!openReviewContributions);
  }

  return (
    <div className="flex flex-col  overflow-y-clip  h-full w-screen bg-vercel-900 md:py-16 items-center">
      <Toaster />
      <div className="px-3 rounded-t border-b md:border border-vercel-600 bg-gradient-to-b from-vercel-900 via-vercel-900 to-vercel-1000 w-[100%]  shadow-lg md:w-[75%] xl:w-[50%]  flex flex-col animate-fade-in ease-in duration-200">
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
          <div className={`rounded border border-vercel-600 `}>
            <MusicPlayer file={idea.file} idea={idea} user={ideaUser} />
          </div>

          <div className="items-end text-right justify-end content-end ">
            <button
              onClick={() => {
                clickContribute();
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
        <div className="  rounded-b border-b md:border-x border-vercel-600 bg-vercel-1000 mx-auto shadow-lg  w-full md:w-[75%] xl:w-[50%]  animate-fade-in ease-in duration-200">
          {openReviewContributions && (
            <ReviewContributions
              contributions={contributions}
              ideaID={idea.id}
            />
          )}

          <div className=" px-3 bg-vercel-1000 z-50 sticky top-0 py-2 text-lg lg:text-xl justify-between flex items-center text-left border-b border-vercel-600">
            <h1 className="font-bold pl-6">
              {contributions.length} Pending Contribution
              {contributions.length > 1 && "s"}
            </h1>
            <button
              onClick={() => {
                clickReview();
              }}
              className=" px-4 py-1 mr-6 my-1  border border-vercel-600 bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              Review Contribution{contributions.length > 1 && "s"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeaScreen;
