import {
  PauseIcon,
  PlayIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Contribution, User } from "@prisma/client";
import { useContext } from "react";
import { AudioContext } from "@/context/audioContext";
import Image from "next/image";

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
      className=" w-full last:border-b-0  py-5 px-8  border-b border-vercel-600 text-xl  text-vercel-400   "
    >
      <div className="flex flex-col  w-full">
        <div className="  w-full flex flex-row justify-between">
          <div className=" my-auto grid grid-flow-col text-left space-x-2 ">
            <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
              {user && user?.image != null && (
                <Image
                  className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
                  referrerPolicy="no-referrer"
                  height={1000}
                  width={1000}
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

export default ContributionTab;
