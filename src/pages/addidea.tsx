import Header from "@/components/header";
import React, { useState } from "react";
import axios from "axios";
import { trpc } from "@/utils/trpc";

const BUCKET_URL = "https://s3.us-east-1.amazonaws.com/newideas/";

export default function addidea() {
  return (
    <div className=" h-screen w-screen ">
      <Header />
      <AddIdeaForm />
    </div>
  );
}
type Idea = {
  title: string;
  description: string;
  tag_one: string;
  tag_two: string;
  file: string;
};

function AddIdeaForm(): JSX.Element {
  const [title, settitle] = useState<any>();
  const [description, setdescription] = useState<any>();
  const [tag_one, settag_one] = useState<any>();
  const [tag_two, settag_two] = useState<any>();
  const [file, setFile] = useState<any>();
  const postIdea = trpc.useMutation(["idea.addIdea"]);

  function handleFilePick(file: any | null): void {
    setFile(file);
  }

  async function uploadFile(id: string): Promise<string> {
    const { data } = await axios.post("/api/s3/uploadFile", {
      name: id + "-" + file.name,
      type: file.type,
    });

    const url = data.url;
    const newData = await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    return BUCKET_URL + id + "-" + file.name;
  }

  async function handleSubmitIdea(): Promise<void> {
    //get userID
    //need to check if this user already has an idea with this title
    const url = await uploadFile("cl7sirxdp00079ux7n7gnlbir");
    const posted = postIdea.mutate({
      user: "cl7sirxdp00079ux7n7gnlbir",
      title: title,
      description: description,
      tag_one: tag_one,
      tag_two: tag_two,
      file: url,
    });
    console.log(posted);
  }

  return (
    <div className="p-5">
      <div className="   bg-gray-800 rounded-3xl shadow-2xl bg-opacity-20 text-xl text-emerald-400">
        <div className=" px-6">
          <div className=" pt-5">
            <h1>Title</h1>
            <input
              onChange={(e) => {
                settitle(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-xl  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>
          <div className=" pt-5">
            <h1>Description</h1>
            <input
              onChange={(e) => {
                setdescription(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-xl  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>
          <div className=" pt-5">
            <h1>Tag 1</h1>
            <input
              onChange={(e) => {
                settag_one(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-xl  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
            />
          </div>

          <div className=" pt-5">
            <h1>Tag 2</h1>
            <input
              onChange={(e) => {
                settag_two(e.target.value);
              }}
              className=" w-full mt-1 h-8 px-2 bg-gray-700 rounded-xl  focus:bg-gray-600  focus:ring-emerald-300 focus:ring-2 focus:border-0 focus:outline-0"
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
          {/* {file && (
            <ReactAudioPlayer
              className=" w-full rounded-full shadow-md  text-emerald-900 "
              src={file}
              controls
            />
          )} */}

          <div className=" pb-6 mx-auto text-center ">
            <button
              onClick={() => handleSubmitIdea()}
              className="py-2 px-12 text-3xl bg-emerald-500 text-gray-900 rounded-3xl shadow-2xl"
            >
              Add New Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
