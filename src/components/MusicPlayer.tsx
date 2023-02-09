import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

function MusicPlayer({ file }: { file: string }) {
  const this_idea = new Audio(file);
  const [is_playing, set_is_playing] = useState(false);

  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = () => {
    setProgress((this_idea.currentTime / this_idea.duration) * 100);
  };

  if (this_idea == null || this_idea == undefined) {
    return <div>loading...</div>;
  }

  this_idea.addEventListener("timeupdate", () => handleTimeUpdate());
  this_idea.addEventListener("playing", () => {
    set_is_playing(true);
  });
  this_idea.addEventListener("pause", () => {
    set_is_playing(false);
  });

  return (
    <div className=" rounded-sm shadow-md items-center  m-auto   ">
      <div className=" p-10 ">
        <div className=" w-full bg-gray-800 h-5 mb-3 rounded-full">
          <div
            className=" h-5 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: "rgb(16,185,129)",
            }}
          />
        </div>
        <button
          onClick={() => {
            if (!is_playing) {
              this_idea.play();
            }
          }}
          className="h-9 w-9 mr-6  bg-gray-800 text-emerald-500  shadow-md rounded-full items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
        >
          <PlayIcon className=" ml-2 h-6 w-6  m-auto " />
        </button>
        <button
          onClick={() => {
            if (is_playing) {
              this_idea.pause();
            }
          }}
          className="h-9 w-9 mr-2  bg-gray-800 text-emerald-500  shadow-md rounded-full items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
        >
          <PauseIcon className=" ml-[1.5] h-6 w-6  m-auto " />
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;
