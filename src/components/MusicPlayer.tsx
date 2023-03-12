import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AudioContext } from "@/context/audioContext";

function MusicPlayer({ file }: { file: string }) {
  const { pauseAudio, playAudio } = useContext(AudioContext);

  const [progress, setProgress] = useState(0);

  const this_audio: HTMLAudioElement | null = new Audio(file);

  function handlePlay() {
    if (this_audio) {
      playAudio(this_audio);
    }
  }

  function handlePause() {
    pauseAudio();
  }

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
  );
}

export default MusicPlayer;
