import {
  ArrowDownCircleIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
  MusicalNoteIcon,
  PauseIcon,
  PlayIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import ReactAudioPlayer from "react-audio-player";

export default function Card({
  name,
  description,
  tag_one,
  tag_two,
  likes,
  idea,
}: {
  name: string;
  description: string;
  tag_one: string;
  tag_two: string;
  likes: number;
  idea: string;
}) {
  const this_idea = new Audio(idea);

  return (
    <div className="w-full justify-center items-center m-auto  rounded-lg overflow-hidden shadow-lg bg-gray-800  ">
      <div className="flex justify-between">
        <div className="h-40 w-full grid grid-cols-1 grid-rows-[3fr_1fr] justify-end  ">
          <div className="px-6 py-4 ">
            <div className="font-bold text-xl mb-2">{name}</div>
            <p className="text-gray-200 text-base">{description}</p>
          </div>
          <div className=" px-5  ">
            <span className="inline-block bg-gray-600 cursor-pointer hover:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2 shadow-md">
              {tag_one}
            </span>
            <span className="inline-block bg-gray-600 cursor-pointer hover:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2 shadow-md">
              {tag_two}
            </span>
          </div>
        </div>
        <div className="  w-20 flex  justify-end   ">
          <button className="h-10 w-10 m-4  bg-emerald-600 rounded-full shadow-md  text-gray-900 items-center justify-center text-center">
            <UserCircleIcon className=" h-10 w-10 m-auto" />
          </button>
        </div>
      </div>
      <div className=" px-4 py-2 bg-gray-700 flex    justify-between">
        <div>
          <audio id="player" src={idea}></audio>
          <button
            onClick={() => {
              this_idea.play();
            }}
            className="h-11 w-11 mr-2  bg-gray-800 text-emerald-500  shadow-md rounded-full items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
          >
            <PlayIcon className=" ml-2 h-8 w-8  m-auto " />
          </button>
          {/* This is definitely not centered correctly */}
          <button
            onClick={() => {
              this_idea.pause();
            }}
            className="h-11 w-11 mr-2  bg-gray-800 text-emerald-500  shadow-md rounded-full items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
          >
            <PauseIcon className=" ml-2 h-8 w-8  m-auto " />
          </button>
        </div>
        <div className="flex ml-10 place-self-center place-items-center ">
          <h1 className="text-xl mt-1">{likes}</h1>
          <HandThumbUpIcon className="mx-1 h-6 w-6" />
          <InformationCircleIcon className="mx-1 h-8 w-8 cursor-pointerhover:text-emerald-600" />
          <ArrowDownCircleIcon className="mx-1 h-8 w-8 cursor-pointerhover:text-emerald-600" />
        </div>
      </div>
    </div>
  );
}
