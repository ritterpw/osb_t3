import {
  PauseIcon,
  PlayIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Contribution, Idea, User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import MusicPlayer from "./MusicPlayer";
import { AudioContext } from "@/context/audioContext";
import { ideasWithLikes } from "types/ideasWithLikes";

interface IdeaScreenProps {
  idea: ideasWithLikes;
  contributions?: Contribution[];
  contributionUser: User;
  user: User;
}

function IdeaScreen({
  idea,
  contributions,
  contributionUser,
  user,
}: IdeaScreenProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col  overflow-y-clip  h-full w-screen bg-vercel-900 md:py-16 items-center">
      <div className="px-3 rounded-t border-b md:border border-vercel-600 bg-gradient-to-b from-vercel-900 via-vercel-900 to-vercel-1000 w-[100%]  shadow-lg md:w-[50%]  flex flex-col">
        <div className="  w-full px-6 pt-3 md:pt-6">
          <div className="  w-full flex flex-row justify-between">
            <div className="   text-xl lg:text-2xl  xl:text-3xl">
              {idea.title}
            </div>
            <div className=" my-auto grid grid-flow-col text-left space-x-2 ">
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
              <div className=" my-auto text-md xl:text-lg">
                {user?.producer_name != null ? user?.producer_name : user?.name}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6">
          <div className=" py-3 md:py-6">{idea.description}</div>
          <div
            className={`rounded border border-vercel-600 ${
              idea.userId === user.id ? "mb-6" : ""
            } `}
          >
            <MusicPlayer file={idea.file} idea={idea} />
          </div>

          {idea.userId !== user.id && (
            <div className="items-end text-right justify-end content-end ">
              <button
                onClick={() => {
                  router.push(`/ideas/${idea.id}/contributeToIdea`);
                }}
                className=" py-2 px-4  my-6 rounded border border-vercel-700 shadow-md shadow-vercel-900 transition-all duration-300 ease-in hover:rounded-xl hover:font-bold hover:bg-emerald-500 hover:text-vercel-1000"
              >
                contribute to idea
              </button>
            </div>
          )}
        </div>
      </div>

      {contributions && contributions.length > 0 && (
        <div className="rounded-b border-b md:border-x border-vercel-600 bg-vercel-1000 mx-auto shadow-lg  w-full md:w-[50%] overflow-y-scroll">
          <div className="bg-vercel-1000 sticky top-0 py-2 text-xl lg:text-2xl  text-left border-b border-vercel-600">
            <h1 className="font-bold pl-6">Pending Contributions</h1>
          </div>
          {contributions.map((c) => {
            return <ContributionTab c={c} user={contributionUser} key={c.id} />;
          })}
        </div>
      )}
    </div>
  );
}

const ContributionTab = ({ c, user }: { c: Contribution; user: User }) => {
  const { pauseAudio, playAudio } = useContext(AudioContext);

  const this_audio: HTMLAudioElement | null = new Audio(c.file);

  function handlePlay() {
    if (this_audio) {
      playAudio(this_audio);
    }
  }

  function handlePause() {
    pauseAudio();
  }

  return (
    <div
      key={c.id}
      className=" w-full last:border-b-0  p-5  border-b border-vercel-600 text-xl  text-vercel-400   "
    >
      <div className="flex flex-col  w-full">
        <div className="  w-full flex flex-row justify-between">
          <div className=" my-auto grid grid-flow-col text-left space-x-2 ">
            <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
              {user && user?.image != null && (
                <img
                  className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
                  referrerPolicy="no-referrer"
                  src={user?.image}
                />
              )}
              {!user?.image && <UserCircleIcon className=" p-6" />}
            </button>
            <div className=" my-auto text-md xl:text-lg">
              {user?.producer_name != null ? user?.producer_name : user?.name}
            </div>
          </div>
        </div>
        <div className="py-4">
          <h1>{c.description}</h1>
        </div>
        <div>
          <button
            onClick={() => {
              handlePlay();
            }}
            className="h-9 w-9 mr-6  border border-vercel-600  bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
          >
            <PlayIcon className=" h-6 w-6  m-auto " />
          </button>
          <button
            onClick={() => {
              handlePause();
            }}
            className="h-9 w-9 mr-2  border border-vercel-600 bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
          >
            <PauseIcon className=" ml-[1.5] h-6 w-6  m-auto " />
          </button>
        </div>
      </div>
    </div>
  );
};
export default IdeaScreen;
