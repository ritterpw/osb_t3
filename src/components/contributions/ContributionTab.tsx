import {
  CheckIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Contribution, User } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { AudioContext } from "@/context/audioContext";
import Image from "next/image";
import { playAudioInterface } from "@/pages/_app";
import { Toaster, toast } from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import router from "next/router";

const ContributionTab = ({ c }: { c: Contribution | undefined }) => {
  const { pauseAudio, playAudio } = useContext(AudioContext);
  const [user, setUser] = useState<User | null>(null);
  const approveContribution = trpc.useMutation([
    "contribution.approveContribution",
  ]);
  const rejectContribution = trpc.useMutation([
    "contribution.rejectContribution",
  ]);

  if (c == undefined) return null;

  const this_audio: HTMLAudioElement | null = new Audio(c.file);

  const { data: userData } = trpc.useQuery([
    "user.getUserById",
    { userId: c.userId },
  ]);

  useEffect(() => {
    if (userData) {
      setUser(userData.user);
    }
  }, [userData]);

  useEffect(() => {
    if (approveContribution.isLoading) {
      toast.loading("Approving...");
    }
    if (approveContribution.isSuccess) {
      if (toast) toast.dismiss();
      toast.success("Contribution Approved Successfully!");
      setTimeout(() => {
        router.reload();
      }, 2000);
    }
  }, [approveContribution.isSuccess, approveContribution.isLoading]);

  function handlePlay() {
    if (this_audio && user) {
      const audio_data: playAudioInterface = {
        this_audio: this_audio,
        artist: user,
      };
      playAudio(audio_data);
    }
  }

  function handlePause() {
    pauseAudio();
  }

  async function handleRejected() {
    try {
      if (!c) {
        throw new Error("Contribution not found");
      }
      await rejectContribution.mutateAsync({
        contributionId: c.id,
      });
      toast.success("Contribution rejected.");
    } catch (error) {
      toast.error("Failed to reject contribution.");
    }
  }

  async function handleApproved() {
    try {
      // Approve the current contribution
      if (!c) {
        throw new Error("Contribution not found");
      }

      await approveContribution.mutateAsync({
        contributionId: c.id,
      });

      toast.success("Contribution approved and others rejected.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve contribution.");
    }
  }

  return (
    <div
      key={c.id}
      className="  last:border-b-0  p-5  border-b border-vercel-600 text-xl  text-vercel-400   "
    >
      <div className="flex flex-col  w-full ">
        <div className="  w-full flex flex-row  ">
          <div className=" flex flex-row w-full justify-between text-left ">
            <div className=" my-auto text-md xl:text-lg">
              {user?.producer_name != null ? user?.producer_name : user?.name}
            </div>
            <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
              {user && user?.image != null && (
                <Image
                  className="h-20 w-20 rounded-full cursor-pointer hover:opacity-80"
                  referrerPolicy="no-referrer"
                  height={1000}
                  width={1000}
                  src={user?.image}
                />
              )}
              {!user?.image && <UserCircleIcon className=" p-6" />}
            </button>
          </div>
        </div>
        <div className="pb-6 pt-3 text-base">
          <h1>{c.description}</h1>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <button
              onClick={() => {
                handlePlay();
              }}
              className="h-9 w-9 mr-3  border border-vercel-600  bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              <PlayIcon className=" h-6 w-6  m-auto " />
            </button>
            <button
              onClick={() => {
                handlePause();
              }}
              className="h-9 w-9 mr-2  border border-vercel-600 bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              <StopIcon className=" ml-[1.5] h-6 w-6  m-auto " />
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                handleRejected();
              }}
              className="h-9 w-9 mr-3  border border-vercel-600  bg-vercel-800 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              <XMarkIcon className=" h-6 w-6  m-auto " />
            </button>
            <button
              onClick={() => {
                handleApproved();
              }}
              className="h-9 w-9 mr-2  border border-vercel-600 bg-vercel-800 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
            >
              <CheckIcon className=" ml-[1.5] h-6 w-6  m-auto " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionTab;
