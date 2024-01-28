import React from "react";
import { getSession, GetSessionParams } from "next-auth/react";
import Header from "@/components/header";
import { User } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import router from "next/router";

type Props = { user: User };

export default function tags({ user }: Props) {
  const { data: tags } = trpc.useQuery(["idea.getMostPopularTags"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className=" h-full w-screen overflow-x-hidden flex flex-col ">
      <Header />
      <div className="min-h-[96%] max-h-screen w-screen pb-3  pt-3 m-auto ">
        <h1 className=" text-center my-5 text-4xl animate-fade-in">Tags</h1>
        <div className="px-20 grid   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tags?.map((tag) => {
            return (
              <div
                key={tag.tag}
                onClick={() => {
                  router.push(`/tags/${tag.tag}`);
                }}
                className="bg-gray-800 hover:shadow-none cursor-pointer transition-all ease-in duration-200 shadow-lg flex justify-between rounded-lg p-3 m-3 text-center text-white"
              >
                <div className="text-ellipsis">{tag.tag}</div>
                <div>{tag.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (req: GetSessionParams | undefined) => {
  const session = await getSession(req);

  return {
    props: {
      user: session?.user ?? null,
    },
  };
};
