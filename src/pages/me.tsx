import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import React from "react";
import Layout from "../components/profLayout";
import Card from "@/components/card";

export default function Me() {
  const { data: session } = useSession();

  function IsSessionEmail(): boolean | undefined {
    if (session?.user.email != undefined && session?.user.email != null) {
      return true;
    }
    return false;
  }

  if (!IsSessionEmail) {
    return <div>...login</div>;
  }
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
    isError: userIsError,
  } = trpc.useQuery(
    ["user.getUserByEmail", { email: session?.user.email as string }],
    { enabled: IsSessionEmail() }
  );
  const { data: ideas } = trpc.useQuery(
    ["idea.getIdeasByUser", { userId: user?.user?.id as string }],
    {
      enabled:
        user != undefined &&
        user != null &&
        user?.user != undefined &&
        user?.user != null,
    }
  );

  if (!session?.user.email || typeof session?.user.email !== "string") {
    return <div> Must Login </div>;
  }

  if (userLoading) {
    return <span>Loading...</span>;
  }

  if (userIsError) {
    return <span>Error: {userError.message}</span>;
  }

  // if the logged in user has the same email as the user they are trying to get, then thay have access to this page
  if (!user?.user) {
    return <div> no user found</div>;
  }

  return (
    <Layout pageTitle="My Profile">
      <div className=" sm:h-[80vh] h-full flex  bg-vercel-900 sm:rounded-3xl sm:shadow-2xl sm:bg-gray-800 sm:bg-opacity-20  text-xl text-emerald-400">
        <div className="overflow-y-scroll h-full w-full flex flex-col ">
          <div className="pl-6 py-3 text-3xl border-b border-vercel-600 justify-center">
            My Ideas
          </div>
          <div className="  px-5 sm:px-10 gap-10  md:grid sm:grid-cols-2 md:grid-cols-3  overflow-y-scroll">
            {!ideas ||
              (ideas && ideas.length == 0 && (
                <div className="text-xl pt-14">No Ideas</div>
              ))}
            {ideas &&
              ideas.length > 0 &&
              ideas.map((idea) => (
                <div
                  key={idea.file}
                  className=" pt-7 last:pb-7 sm:pt-14 sm:last:pb-14"
                >
                  <Card idea={idea} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
