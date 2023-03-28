import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { toSafeInteger } from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const BUCKET_URL = "https://s3.us-east-1.amazonaws.com/newideas/";

export default function addidea() {
  return (
    <div className=" h-[96vh] w-screen bg-vercel-1000 ">
      <div
        className="border-b border-b-vercel-600 
        "
      >
        <Header />
      </div>{" "}
      <div className="h-full">
        <AddIdeaForm />
      </div>
    </div>
  );
}

function AddIdeaForm(): JSX.Element {
  const [title, settitle] = useState<any>();
  const [description, setdescription] = useState<any>();
  const [tag_one, settag_one] = useState<any>();
  const [tag_two, settag_two] = useState<any>();
  const [file, setFile] = useState<any>();
  const postIdea = trpc.useMutation(["idea.addIdea"]);
  const router = useRouter();

  const { data: session } = useSession();

  function handleFilePick(file: any | null): void {
    setFile(file);
  }

  async function getFileNameToUpload(id: string): Promise<string> {
    const { data } = await axios.post("/api/s3/uploadFile", {
      name: id + "-" + file.name,
      type: file.type,
    });

    const url = data.url;
    await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    return BUCKET_URL + id + "-" + file.name;
  }

  async function handleSubmitIdea(): Promise<void> {
    //get userID

    toast.loading("Uploading Idea...");
    //need to check if this user already has an idea with this title

    if (!session?.user.email) {
      console.log("not logged in");
      return signIn();
    }

    const url = await getFileNameToUpload(session.user.email);

    postIdea.mutate({
      user: session.user.id,
      title: title,
      description: description,
      tag_one: tag_one,
      tag_two: tag_two,
      file: url,
    });
  }

  useEffect(() => {
    if (postIdea.isSuccess) {
      toast.dismiss();
      toast.success("Idea Uploaded!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
    if (postIdea.isError) {
      toast.dismiss();
      toast.error("Error Uploading Idea: " + postIdea.error.message);
    }
  }, [postIdea.isSuccess, postIdea.isError]);

  return (
    <div className="p-5 pt-16 m-auto items-center bg-vercel-900 h-full ">
      <div className=" border w-[65%] m-auto   border-vercel-600 rounded-sm shadow-2xl bg-opacity-20 text-xl text-emerald-400">
        <Toaster position="top-center" />
        <div className=" px-6  ">
          <div className=" pt-5">
            <h1>Title</h1>
            <input
              onChange={(e) => {
                settitle(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>
          <div className=" pt-5">
            <h1>Description</h1>
            <input
              onChange={(e) => {
                setdescription(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>
          <div className=" pt-5">
            <h1>Tag 1</h1>
            <input
              onChange={(e) => {
                settag_one(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>

          <div className=" pt-5">
            <h1>Tag 2</h1>
            <input
              onChange={(e) => {
                settag_two(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>

          <div className=" py-5">
            <h1 className="pb-1">Add Audio File</h1>
            <input
              type="file"
              accept=".mp3, .wav"
              onChange={(e) => {
                if (e.target.files) {
                  handleFilePick(e.target.files[0]);
                }
              }}
              className=" text-base"
            />
            <br />
          </div>

          <div className=" pb-6 mx-auto text-center ">
            <button
              onClick={() => handleSubmitIdea()}
              className="py-3 px-6 text-xl bg-vercel-900 border border-vercel-600 hover:rounded-3xl ease-in duration-200 hover:bg-emerald-500  hover:text-gray-900 rounded-sm shadow-md shadow-vercel-1000"
            >
              Add New Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
