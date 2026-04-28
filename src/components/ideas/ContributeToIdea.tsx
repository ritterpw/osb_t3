import Header from "@/components/header";
import MusicPlayer from "@/components/MusicPlayer";
import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import _ from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  setOpenContributionModal: (value: boolean) => void;
};

const ContributeToIdea = ({ setOpenContributionModal }: Props) => {
  const router = useRouter();
  const id = router.query.id;
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const { data: session } = useSession();
  const addContribution = trpc.useMutation(["contribution.contributeToIdea"]);

  const BUCKET_URL = "https://s3.us-east-1.amazonaws.com/newideas/";

  function handleFilePick(file: File | null): void {
    if (file) {
      setFile(file);
    }
  }

  useEffect(() => {
    if (addContribution.isLoading) {
      toast.loading("Uploading Contribution...");
    }
    if (addContribution.isSuccess) {
      if (toast) toast.dismiss();
      toast.success("Contribution Added Successfully!");
      setTimeout(() => {
        router.reload();
        setOpenContributionModal(false);
      }, 2000);
    }
  }, [addContribution.isSuccess, addContribution.isLoading]);

  async function getFileNameToUpload(id: string): Promise<string> {
    const { data } = await axios.post("/api/s3/uploadFile", {
      name: id + "-" + file?.name,
      type: file?.type,
    });

    const url = data.url;
    await axios.put(url, file, {
      headers: {
        "Content-type": file?.type as string,
        "Access-Control-Allow-Origin": "*",
      },
    });

    return BUCKET_URL + id + "-" + file?.name;
  }

  async function handleSubmit(): Promise<void> {
    if (!file) {
      toast.error("Please select a file to upload!");
      return;
    }

    toast.loading("Uploading Contribution...");

    const url = await getFileNameToUpload(session?.user.email as string);

    addContribution.mutate({
      ideaId: id as string,
      description: description,
      file: url,
    });
  }

  return (
    <div className=" px-10  grid grid-rows-3 bg-gradient-to-b from-vercel-950 via-vercel-950 to-vercel-1000 w-[100%] md:w-[75%] xl:w-[50%] border border-gray-600 ">
      <Toaster position="top-center" />
      <div className=" w-full  pt-5">
        <div className=" text-vercel-400 text-xl">Description</div>
        <input
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          type="text"
          placeholder="..."
          className=" text-vercel-300 w-full p-1 bg-transparent active:translate-y-1 border-b focus:border border-vercel-500  focus:outline-none
              "
        />
      </div>
      <div className=" w-full pt-3 ">
        <div className=" text-vercel-400 text-xl">Choose Idea</div>
        <div className="h-10 pt-2 ">
          <div className="relative z-0 inline-block w-full  ">
            <input
              type="file"
              accept=".mp3, .wav"
              onChange={(e) => {
                if (
                  e.target.files &&
                  e.target.files[0] &&
                  e.target.files[0] != undefined
                ) {
                  handleFilePick(e.target.files[0]);
                }
              }}
              className=" absolute opacity-0 w-full h-full cursor-pointer"
            />
            <div className="flex items-center justify-center w-full h-12 rounded-sm cursor-pointer  border border-vercel-600 bg-vercel-9000 text-emerald-400 shadow-md text-md hover:bg-emerald-500 focus:ring-emerald-400 hover:text-gray-800 transition-all ease-in duration-200  ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="">
                {file && file?.name ? file?.name : "Choose a file"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full text-end pt-6 pb-6">
        <button className="" onClick={() => handleSubmit()}>
          <div className=" text-vercel-300 border-vercel-500   text-xl border px-5 py-2 hover:bg-emerald-500 hover:rounded-3xl hover:text-gray-800 transition-all ease-in duration-200 ">
            Submit
          </div>
        </button>
      </div>
    </div>
  );
};

export default ContributeToIdea;
