import Header from "@/components/header";
import MusicPlayer from "@/components/MusicPlayer";
import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function ContributeToIdea() {
  const router = useRouter();
  const id = router.query.id;

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
          <div className=" p-3 rounded  border border-vercel-600   shadow-lg w-[65%]   grid  grid-rows-[1fr_2.5fr]">
            <div className="">
              <div className="   h-full   px-6 py-1">
                <div className="  grid grid-flow-rows">
                  <div className=" mr-auto   my-auto grid grid-flow-col text-left space-x-2 ">
                    <div className="">
                      <button className="  h-8 w-8  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
                        {data && data.user?.image != null && (
                          <img
                            className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
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
              <div className="items-end text-right justify-end content-end  ">
                <button
                  onClick={() => {
                    router.push(`/ideas/${data?.id}/contributeToIdea`);
                  }}
                  className=" py-2 px-4 mr-4 rounded border border-vercel-700 shadow-md shadow-vercel-900 hover:bg-emerald-500 hover:text-vercel-800"
                >
                  contribute to idea
                </button>
                <button className=" py-2 px-4 rounded border border-vercel-700 shadow-md shadow-vercel-900 hover:bg-emerald-500 hover:text-vercel-800 ">
                  add idea
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContributeToIdea;
