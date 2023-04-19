import {
  ArrowDownCircleIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AudioContext } from "@/context/audioContext";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { ideasWithLikes } from "types/ideasWithLikes";
import JsFileDownloader from "js-file-downloader";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

function MusicPlayer({ file, idea }: { file: string; idea: ideasWithLikes }) {
  const { pauseAudio, playAudio } = useContext(AudioContext);
  const [progress, setProgress] = useState(0);
  const likeIdea = trpc.useMutation(["idea.likeIdea"]);
  const unlikeIdea = trpc.useMutation(["idea.unlikeIdea"]);
  const [idealikes, setIdeaLikes] = useState(idea.likes);
  const { data: session } = useSession();
  const router = useRouter();

  const this_audio: HTMLAudioElement | null = new Audio(file);

  function handlePlay() {
    if (this_audio) {
      playAudio(this_audio);
    }
  }

  function handlePause() {
    pauseAudio();
  }

  function handleDownload(): void {
    {
      let fileEnding = "";
      if (idea.file.endsWith(".wav")) {
        fileEnding = ".wav";
      } else if (idea.file.endsWith(".mp3")) {
        fileEnding = ".mp3";
      }

      new JsFileDownloader({
        url: idea.file,
        filename: idea.title + fileEnding,
      })
        .then(function (data) {
          console.log("downloaded");
        })
        .catch(function (error) {
          console.log("error: " + error);
        });
    }
  }

  function checkSeen(id: string): { seen: boolean; userIndex: number } {
    let hasSeen = false;
    let userIndex = -1;

    idea.likes.forEach((value, index) => {
      if (value.id === id) {
        hasSeen = true;
        userIndex = index;
      }
    });

    return {
      seen: hasSeen,
      userIndex: userIndex,
    };
  }

  function handleInfo(id: string) {
    if (session?.user) return router.push("/ideas/" + id);
    return signIn();
  }

  /**
   * Handles the like/unlike functionality
   *
   */
  async function handleLike(): Promise<void> {
    const newLikes: User[] = idealikes;

    if (!session) {
      return signIn();
    }

    const { userIndex, seen } = checkSeen(session.user.id);

    if (!seen) {
      const like = likeIdea.mutate({
        idea: idea.id,
        user: session?.user.id,
      });

      newLikes.push({
        id: session?.user.id,
        email: null,
        emailVerified: null,
        image: null,
        name: null,
        producer_name: null,
        role: "USER",
      });
      setIdeaLikes(newLikes);
      return;
    }

    const unlike = unlikeIdea.mutate({
      idea: idea.id,
      user: session?.user.id,
    });

    if (userIndex >= 0) newLikes.splice(userIndex, 1);

    setIdeaLikes(newLikes);
  }

  function handleClickedTag(tag: string): void {
    tag != null
      ? router.push("/tags/" + tag)
      : new Error("Error handling push to tag page - tag is null");
  }

  return (
    <div className="rounded-sm shadow-md items-center  m-auto">
      <div className="p-5">
        <div className="w-full bg-gray-800 h-5 mb-5 rounded-sm">
          <div
            className="h-5 rounded-sm"
            style={{
              width: `${progress}%`,
              backgroundColor: "rgb(16,185,129)",
            }}
          />
        </div>
        <div className="justify-between flex items-center ">
          <div>
            <button
              onClick={() => {
                handlePlay();
              }}
              className="h-7 w-7 md:h-9 md:w-9 mr-2 md:mr-6  border border-vercel-600  bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              <PlayIcon className=" h-6 w-6  m-auto " />
            </button>
            <button
              onClick={() => {
                handlePause();
              }}
              className="h-7 w-7 md:h-9 md:w-9 mr-1 md:mr-6  border border-vercel-600  bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              <PauseIcon className=" ml-[1.5] h-6 w-6  m-auto " />
            </button>
          </div>
          <div className="flex place-self-center place-items-center  justify-center">
            <div className="flex place-self-center place-items-center justify-center">
              <h1 className=" text-2xl -mr-1 mt-2 justify-center place-self-center place-items-center">
                {idealikes.length}
              </h1>
              <HandThumbUpIcon
                onClick={() => {
                  handleLike();
                }}
                className="mx-1 h-7 w-7 cursor-pointer ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
              />
            </div>

            <ArrowDownCircleIcon
              onClick={() => handleDownload()}
              className="mx-1 h-8 w-8 cursor-pointer hover:text-emerald-600 ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
