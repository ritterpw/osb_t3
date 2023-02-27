import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

function MusicPlayer({ file }: { file: string }) {
  const this_idea = new Audio(file);

  const [progress, setProgress] = useState(0);

  if (this_idea == null || this_idea == undefined) {
    return <div>loading...</div>;
  }

  // this_idea.addEventListener("timeupdate", () => handleTimeUpdate());
  // this_idea.addEventListener("playing", () => {
  //   set_is_playing(true);
  // });
  // this_idea.addEventListener("pause", () => {
  //   set_is_playing(false);
  // });

  return (
    <div className="rounded-sm shadow-md items-center  m-auto">
      <div className="p-10">
        <div className="w-full bg-gray-800 h-5 mb-6 rounded-sm">
          <div
            className="h-5 rounded-sm"
            style={{
              width: `${progress}%`,
              backgroundColor: "rgb(16,185,129)",
            }}
          />
        </div>
        <button
          onClick={() => {
            this_idea.play();
          }}
          className="h-9 w-9 mr-6  border border-vercel-600  bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
        >
          <PlayIcon className=" h-6 w-6  m-auto " />
        </button>
        <button
          onClick={() => {
            this_idea.pause();
          }}
          className="h-9 w-9 mr-2  border border-vercel-600 bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
        >
          <PauseIcon className=" ml-[1.5] h-6 w-6  m-auto " />
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;
