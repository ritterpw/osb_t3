import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { trpc } from "@/utils/trpc";
import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Dropdown from "@/components/Dropdown";
import { GENRES } from "@/utils/genres";

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
  const [title, settitle] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [tag_one, settag_one] = useState<string>("");
  const [tag_two, settag_two] = useState<string>("");
  const [genre, setGenre] = useState<string>();

  const [file, setFile] = useState<File | null>(null);

  const postIdea = trpc.useMutation(["idea.addIdea"]);
  const router = useRouter();

  useEffect(() => {
    if (postIdea.isSuccess) {
      if (toast) toast.dismiss();
      toast.success("Idea Uploaded!");
      setTimeout(() => {
        router.push("/ideas/" + postIdea.data.id);
      }, 2000);
    }
    if (postIdea.isError) {
      toast.dismiss();
      toast.error("Error Uploading Idea: " + postIdea.error.message);
    }
  }, [postIdea.isSuccess, postIdea.isError]);

  const { data: session } = useSession();

  function handleFilePick(picked: File | null): void {
    setFile(picked);
  }

  async function getFileNameToUpload(id: string): Promise<string> {
    if (!file) throw new Error("No file selected");
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
    if (!title || !description || !tag_one || !tag_two || !genre || !file) {
      toast.error("Please fill out all fields");
      return;
    }

    if (tag_one === tag_two) {
      toast.error("Please enter unique tags");
      return;
    }

    toast.loading("Uploading Idea...");
    //need to check if this user already has an idea with this title

    if (!session?.user) {
      console.log("not logged in");
      return signIn();
    }

    const url = await getFileNameToUpload(session.user.id);

    postIdea.mutate({
      title: title,
      description: description,
      tag_one: tag_one as string,
      tag_two: tag_two as string,
      genre: genre as string,
      file: url,
    });
  }

  return (
    <div className="md:p-5 md:pt-16 m-auto items-center bg-vercel-900 h-full ">
      <div className=" md:border w-[100%] md:w-[65%] m-auto   md:border-vercel-600 md:rounded-sm md:shadow-2xl md:bg-opacity-20 text-xl text-emerald-400">
        <Toaster position="top-center" />
        <div className=" px-6  ">
          <div className=" pt-5">
            <h1>Title</h1>
            <input
              onChange={(e) => {
                settitle(e.target.value);
              }}
              className="shadow-md w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>
          <div className=" pt-5">
            <h1>Description</h1>
            <input
              onChange={(e) => {
                setdescription(e.target.value);
              }}
              className="shadow-md w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>
          <div className=" pt-5">
            <h1>Tag 1</h1>
            <input
              onChange={(e) => {
                settag_one(e.target.value);
              }}
              className="shadow-md w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>

          <div className=" pt-5">
            <h1>Tag 2</h1>
            <input
              onChange={(e) => {
                settag_two(e.target.value);
              }}
              className="shadow-md w-full mt-1 h-8 px-2 bg-gray-700 rounded-sm  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>

          <div className=" pt-5">
            <h1 className="pb-1">Genre</h1>
            <Dropdown
              list={GENRES as unknown as string[]}
              setItem={setGenre}
              title={
                genre != undefined ? genre.replace(/_/g, " ") : "Select Genre"
              }
            />
          </div>

          <div className=" py-5">
            <h1 className="pb-1">Select Idea</h1>
            <div className="relative z-0 inline-block w-full  ">
              <input
                type="file"
                accept=".mp3, .wav"
                onChange={(e) => {
                  handleFilePick(e.target.files?.[0] ?? null);
                }}
                className=" absolute opacity-0 w-full h-full cursor-pointer"
              />
              <div className="flex items-center justify-center w-full h-12 rounded-sm cursor-pointer  border border-vercel-600 bg-vercel-9000 text-emerald-400 shadow-md text-md hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200  ">
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
                <span className="">Choose a file</span>
              </div>
            </div>
          </div>

          <div className=" pb-8 mx-auto text-center ">
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
