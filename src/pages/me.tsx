import DisplaySearchs from "@/components/DisplaySearchs";
import Header from "@/components/header";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import React from "react";
import Layout from "../components/profLayout";

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
  const { data, error, isLoading, isError } = trpc.useQuery(
    ["user.getUserByEmail", { email: session?.user.email as string }],
    { enabled: IsSessionEmail() }
  );

  if (!session?.user.email || typeof session?.user.email !== "string") {
    return <div> Must Login </div>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // if the logged in user has the same email as the user they are trying to get, then thay have access to this page
  if (!data?.user) {
    return <div> no user found</div>;
  }

  return (
    <Layout pageTitle="My Profile">
      <div className="">
        <div className=" min-h-[80vh]  bg-gray-800 rounded-3xl shadow-2xl bg-opacity-20 text-xl text-emerald-400">
          <div className="  grid grid-rows-[2fr_7fr_1fr] ">
            <div className="">
              <h1 className="text-3xl">
                <div className="py-2 px-4"></div>
                <div className="py-2 px-4">
                  {data.user.producer_name != null
                    ? data.user.producer_name
                    : data.user.name}
                </div>
              </h1>
            </div>
            <div className="">
              <h1 className="text-3xl">
                <div className="py-2 px-4"></div>
                <div className="py-2 px-4">
                  {data.user.producer_name != null
                    ? data.user.producer_name
                    : data.user.name}
                </div>
              </h1>
            </div>
            <div className=" min-h-full bg-gradient-to-b from-gray-800 via-gray-800 to-gray-700">
              <h1 className="text-3xl">
                <div className="py-2 px-4"></div>
                <div className="py-2 px-4">
                  {data.user.producer_name != null
                    ? data.user.producer_name
                    : data.user.name}
                </div>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
