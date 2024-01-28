import React from "react";
import { getSession, GetSessionParams } from "next-auth/react";
import Header from "@/components/header";
import { User } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import router from "next/router";

type Props = { user: User };

export default function genres({ user }: Props) {
  const { data: genres } = trpc.useQuery(["idea.getMostPopularGenres"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className=" h-full w-screen overflow-x-hidden flex flex-col ">
      <Header />
      <div className="min-h-full max-h-screen w-screen  pb-3  pt-3 m-auto ">
        <h1 className=" text-center my-5 text-4xl animate-fade-in">Genres</h1>
        <div className="px-20 grid   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {genres?.map((genres) => {
            return (
              <div
                key={genres.genre}
                onClick={() => {
                  router.push(`/genres/${genres.genre}`);
                }}
                className="bg-gray-800 hover:shadow-none cursor-pointer transition-all ease-in duration-200 shadow-lg flex justify-between rounded-lg p-3 m-3 text-center text-white"
              >
                <div className="text-ellipsis">{genres.genre}</div>
                <div>{genres.count}</div>
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
