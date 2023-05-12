import { trpc } from "@/utils/trpc";
import { useSession, signIn } from "next-auth/react";
import {
  ArrowDownCircleIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import JsFileDownloader from "js-file-downloader";
import CardUserDisplay from "./CardUserDisplay";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { ideasWithLikes } from "types/ideasWithLikes";
import { AudioContext } from "@/context/audioContext";

export default function Card({ idea }: { idea: ideasWithLikes }) {
  const router = useRouter();
  const { data: session } = useSession();
  const likeIdea = trpc.useMutation(["idea.likeIdea"]);
  const unlikeIdea = trpc.useMutation(["idea.unlikeIdea"]);
  const [idealikes, setIdeaLikes] = useState(idea.likes);
  const { pauseAudio, playAudio } = useContext(AudioContext);

  let this_audio: HTMLAudioElement | null = new Audio(idea.file);

  /**
   * This function downloads a file with a specific file name based on the file type.
   */
  function handleDownload(): void {
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

  /**
   * The function checks if a certain ID has been seen in an array and returns a boolean value and the
   * index of the user who has seen it.
   * @param {string} id - The `id` parameter is a string that represents the ID of a user. The function
   * `checkSeen` checks if this user has seen an idea by iterating through the `idea.likes` array and
   * comparing the `id` of each element with the given `id`. If a match is found,
   * @returns An object with two properties: `seen` (a boolean indicating whether the `id` has been seen
   * in the `idea.likes` array) and `userIndex` (a number indicating the index of the user with the
   * matching `id` in the `idea.likes` array).
   */
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
   * This function handles liking and unliking an idea by adding or removing the user's ID from the list
   * of idea likes.
   * @returns a Promise that resolves to void.
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
    <div className="w-full  h-full flex flex-col  justify-center items-center  transition delay-100 hover:-translate-y-1 hover:opacity-90 overflow-hidden shadow-lg bg-gray-800  ">
      <div className=" px-4 pt-2 flex flex-col w-full justify-between h-40 ">
        <div className=" flex flex-col">
          <div className="flex flex-row justify-between w-full ">
            <div className="flex flex-row justify-between items-center  w-full">
              <div className="font-bold text-xl mt-1  mb-2">{idea.title}</div>
              <div className=" w-min h-min inline-flex">
                <CardUserDisplay userId={idea.userId} />
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm text-ellipsis">
            {idea.description}
          </p>
        </div>

        <div className="pt-2 pb-3 flex flex-row  w-full     ">
          <div
            onClick={() => handleClickedTag(idea.tag_one)}
            className="inline-flex bg-gray-600 cursor-pointer mr-2 hover:bg-gray-700 rounded-full px-3  py-1 text-sm font-semibold text-gray-200 shadow-md   transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            {idea.tag_one}
          </div>
          <span
            onClick={() => handleClickedTag(idea.tag_two)}
            className="  text-ellipsis  bg-gray-600 cursor-pointer hover:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 shadow-md   transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            {idea.tag_two}
          </span>
        </div>
      </div>
      <div className="w-full   max-h-14  px-4 py-2 bg-gray-700   flex    justify-between">
        <div className="inline-flex  flex-row">
          <button
            onClick={() => {
              if (this_audio) {
                playAudio(this_audio);
              }
            }}
            className="h-9 w-9 mr-2  bg-gray-800 text-emerald-500  shadow-md rounded-full items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            <PlayIcon className=" ml-2 h-6 w-6  m-auto " />
          </button>
          {/* This is definitely not centered correctly */}
          <button
            onClick={() => {
              pauseAudio();
            }}
            className="h-9 w-9  bg-gray-800 text-emerald-500  shadow-md rounded-full items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          >
            <PauseIcon className=" ml-[1.5] h-6 w-6  m-auto " />
          </button>
        </div>
        <div className="flex ml-6 gap-[0.5] place-self-center place-items-center  justify-center">
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
          <InformationCircleIcon
            onClick={(e) => {
              e.preventDefault();
              handleInfo(idea.id);
            }}
            className="mx-1 h-8 w-8 cursor-pointer hover:text-emerald-600 ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          />
          <ArrowDownCircleIcon
            onClick={() => handleDownload()}
            className="hidden sm:flex mx-1 h-8 w-8 cursor-pointer hover:text-emerald-600 ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
          />
        </div>
      </div>
    </div>
  );
}
