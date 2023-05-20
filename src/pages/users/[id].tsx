import React from "react";
import { trpc } from "@/utils/trpc";
import ProfLayout from "@/components/layouts/ProfLayout";
import Card from "@/components/card";
import { getSession } from "next-auth/react";
import { User } from "@prisma/client";

function UserPage({
  id,
  user,
  isMe,
}: {
  id: string;
  user: User;
  isMe: boolean;
}) {
  const { data: user_data, isLoading } = trpc.useQuery(
    ["user.getUserAndIdeasById", { userId: id }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>...loading</div>;
  }

  if (!user_data) {
    return <div>...error</div>;
  }

  const ideas = user_data.user?.ideas;

  return (
    <ProfLayout pageTitle="Profile">
      <div className="  sm:h-[80vh] h-full flex  bg-vercel-900 sm:rounded-3xl sm:shadow-2xl sm:bg-gray-800 sm:bg-opacity-20  text-xl text-emerald-400">
        <div className="overflow-y-scroll h-full w-full flex flex-col ">
          <div className="pl-6 py-3 text-3xl border-b border-vercel-600 justify-center">
            {isMe && <div>My Ideas</div>}
            {!isMe && <div>Ideas</div>}
          </div>
          <div className=" px-5 sm:px-10 md:gap-10  lg:grid lg:grid-cols-2 xl:grid-cols-3  overflow-y-scroll">
            {!ideas ||
              (ideas && ideas.length == 0 && (
                <div className="text-xl pt-7">No Ideas</div>
              ))}
            {ideas &&
              ideas.length > 0 &&
              ideas.map((idea) => (
                <div key={idea.file} className=" pt-7 last:pb-7 lg:last:pb-0">
                  <Card idea={idea} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </ProfLayout>
  );
}
export default UserPage;

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  const id = ctx.params.id;

  return {
    props: {
      id: id,
      user: session?.user ?? null,
      isMe: session?.user?.id === id,
    },
  };
};
