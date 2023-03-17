import Header from "@/components/header";
import MusicPlayer from "@/components/MusicPlayer";
import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function ContributeToIdea() {
  const router = useRouter();
  const id = router.query.id;
  const [file, setFile] = useState<any>();

  function handleFilePick(file: any | null): void {
    setFile(file);
  }

  const { data, isLoading, isError } = trpc.useQuery(
    ["idea.getIdeaById", { id: id as string }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error</span>;
  }

  if (data) {
    return (
      <div className="h-screen w-screen bg-vercel-1000">
        <div className="border-b border-vercel-700">
          <Header />
        </div>
        <div className="flex flex-col pt-16  h-full items-center bg-vercel-900">
          <div className=" p-3 rounded  border border-vercel-600  bg-gradient-to-b from-vercel-900 via-vercel-900 to-vercel-950  shadow-lg w-[65%]   grid  grid-rows-[1fr_2.5fr]">
            <div className="">
              <div className="   h-full   px-6 py-1">
                <div className="  grid grid-flow-rows">
                  <div className=" mr-auto   my-auto grid grid-flow-col text-left space-x-2 ">
                    <div className="">
                      <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
                        {data && data.user?.image != null && (
                          <img
                            className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
                            referrerPolicy="no-referrer"
                            src={data.user?.image}
                          />
                        )}
                        {!data?.user.image && (
                          <UserCircleIcon className=" p-6" />
                        )}
                      </button>
                    </div>
                    <div className=" my-auto text-md xl:text-lg">
                      {data?.user?.producer_name != null
                        ? data?.user?.producer_name
                        : data?.user?.name}
                    </div>
                  </div>
                  <div className=" mr-auto pt-2  text-xl lg:text-2xl  xl:text-3xl">
                    {data?.title}
                  </div>
                </div>
              </div>
            </div>
            <div className="    px-6 ">
              <div>{data.description}</div>
              <div className=" rounded border border-vercel-600  my-4   ">
                <MusicPlayer file={data.file} />
              </div>
              <div className="items-end text-right justify-end content-end  "></div>
            </div>
          </div>
          <div className=" px-10  grid grid-rows-3 bg-gradient-to-b from-vercel-950 via-vercel-950 to-vercel-1000 w-[65%] border border-gray-600 animate-fade-in ease-in duration-200">
            <div
              className=" w-full  pt-5
            "
            >
              <div className=" text-vercel-400 text-xl  ">Description</div>
              <input
                type="text"
                placeholder="..."
                className=" text-vercel-300 w-full p-1 bg-transparent active:translate-y-1 border-b focus:border border-vercel-500  focus:outline-none
              "
              />
            </div>
            <div
              className=" w-full pt-5
            "
            >
              <div className=" text-vercel-400 text-xl   ">Choose Idea</div>
              <div className="h-10 pt-2 ">
                <div className=" h-full ">
                  <input
                    type="file"
                    style={{}}
                    accept=".mp3, .wav"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFilePick(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className=" w-full  text-end 
              "
            >
              <button className="pt-4 ">
                <div className=" text-vercel-300 border-vercel-500  text-xl border px-5 py-2 hover:bg-emerald-500 hover:rounded-3xl hover:text-gray-800 transition-all ease-in duration-200 ">
                  Submit
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContributeToIdea;
