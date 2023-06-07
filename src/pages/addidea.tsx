import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { trpc } from "@/utils/trpc";
import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Dropdown from "@/components/Dropdown";

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
  const [tag_one, settag_one] = useState<string>();
  const [tag_two, settag_two] = useState<string>();
  const [genre, setGenre] = useState<string>();

  const [file, setFile] = useState<any>();

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

    if (!session?.user) {
      console.log("not logged in");
      return signIn();
    }

    const url = await getFileNameToUpload(session.user.id);

    postIdea.mutate({
      user: session.user.id,
      title: title,
      description: description,
      tag_one: tag_one as string,
      tag_two: tag_two as string,
      genre: genre as string,
      file: url,
    });
  }

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

          <div className=" pt-5">
            <h1 className="pb-1">Genre</h1>
            <Dropdown
              list={genres}
              setItem={setGenre}
              title={genre ?? "Select Genre"}
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

const genres = [
  "Hip_hop",
  "Trap",
  "Rnb",
  "Pop",
  "Electronic",
  "Reggae",
  "Rock",
  "Underground",
  "Old_school",
  "West_coast",
  "Drill",
  "Reggaeton",
  "Soul",
  "Afro_beat",
  "New_soul",
  "East_coast",
  "Pop_hip_hop",
  "Alternative_rnb",
  "Club",
  "Dance_hall",
  "Alternative",
  "Pop_rap",
  "House",
  "Gangsta",
  "Pop_rnb",
  "Alternative_hip_hop",
  "World",
  "Indie_rock",
  "Hyperpop",
  "Orchestral",
  "Downtempo",
  "Pop_electronic",
  "Pop_rock",
  "Indie",
  "Neo_soul",
  "Ambient",
  "Break_beat",
  "Country",
  "Lofi",
  "Boom_Bap",
  "Grime",
  "Hip_Hop_Soul",
  "Latin",
  "Alternative_rock",
  "Funk",
  "Drum_and_bass",
  "Dance",
  "Beats",
  "Class_soul",
  "K_pop",
  "Underground_Hip_Hop",
  "Roots",
  "Uk_grime",
  "Afro_pop",
  "Techno",
  "Afro",
  "Two_step",
  "Chill",
  "Old_school_hip_hop",
  "Pop_country",
  "Synthwave",
  "Crunk",
  "Instrumental_Hip_Hop",
  "Rage_Beats",
  "Emo_Hip_Hop",
  "Dubstep",
  "Experimental_Hip_Hop",
  "Classical",
  "Freestyle_Rap",
  "Jazz",
  "Gangsta_Rap",
  "LoFi_Hip_Hop",
  "Folk",
  "Dub",
  "Contemporary_Rnb",
  "Country_rock",
  "California_Sound",
  "Cloud_Rap",
  "Jersey_Club",
  "Electro_pop",
  "Trance",
  "Gospel",
  "Industrial",
  "Jazz_Rap",
  "Hardcore_Hip_Hop",
  "Jazz_fusion",
  "Metal",
  "Edm",
  "Trip_hop",
  "Smooth_rnb",
  "Classical_rock",
  "Pop_80s",
  "Punk_rock",
  "Synth_Pop",
  "Classical_instruments",
  "Hardcore",
  "Latin_pop",
];
