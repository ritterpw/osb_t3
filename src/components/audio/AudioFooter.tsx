import React, { useContext } from "react";
import { AudioContext } from "@/context/audioContext"; // Update the path accordingly
import { PauseIcon, PlayIcon, StopIcon } from "@heroicons/react/24/outline";
import { playAudioInterface } from "@/pages/_app";
import DurationSlider from "./DurationSlider";
import router from "next/router";

const AudioFooter = () => {
  const { audio, audio_details, pauseAudio, playAudio } =
    useContext(AudioContext);

  if (!audio) {
    return null; // Render nothing if there is no audio playing
  }

  return (
    <div
      className="absolute bottom-0  right-0 bg-vercel-900 text-left py-2 px-4 rounded-lg rounded-br-none transition-all animate-fade-in duration-300  ease-in-out  flex flex-col "
      onClick={() => router.push(`/ideas/${audio_details?.ideaID}`)}
    >
      <div className="flex flex-row justify-between">
        <h1
          className="text-vercel-300 pr-10 text-lg"
          // onClick={() =>
          //   audio_details?.ideaID ??
          //   router.push(`/ideas/${audio_details?.ideaID}`)
          // }
        >
          {audio_details?.title ?? "contribution from: "}
        </h1>
        <h1 className="text-vercel-400 text-lg">
          {audio_details?.artist?.name ?? "NA "}
        </h1>
      </div>
      <div className="pt-5 inline-flex  flex-row">
        <div className="pr-8 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering the parent div's onClick

              const audio_data: playAudioInterface = {
                this_audio: audio,
                title: audio_details?.title,
                artist: audio_details?.artist,
              };
              playAudio(audio_data);
            }}
            className="h-9 w-9 mr-2  bg-gray-800 text-emerald-500  shadow-md rounded-md items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            <PlayIcon className=" ml-2 h-6 w-6  m-auto " />
          </button>
          {/* This is definitely not centered correctly */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering the parent div's onClick

              pauseAudio();
            }}
            className="h-9 w-9  bg-gray-800 text-emerald-500  shadow-md rounded-md items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            <StopIcon className=" ml-[1.5] h-6 w-6  m-auto " />
          </button>
          {/* <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering the parent div's onClick

              pauseAudio();
            }}
            className="h-9 w-9  bg-gray-800 text-emerald-500  shadow-md rounded-md items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            <PauseIcon className=" ml-[1.5] h-6 w-6  m-auto " />
          </button> */}
        </div>
        <DurationSlider audio={audio} />
      </div>
    </div>
  );
};

export default AudioFooter;
