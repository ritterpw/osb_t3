import DisplaySearchs from "@/components/DisplaySearchs";
import Header from "@/components/header";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export default function me() {
  const { data: session } = useSession();

  function IsSessionEmail(): boolean | undefined {
    if (session?.user.email != undefined && session?.user.email != null) {
      return true;
    }
    return false;
  }

  const { data, error, isLoading, isError } = trpc.useQuery(
    ["user.getUserByEmail", { email: session?.user.email! }],
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
    <div id="no-scroll1 ">
      <div className=" h-screen w-screen flex flex-col">
        <Header />
        <div className="py-2 px-4">
          {data.user.producer_name != null
            ? data.user.producer_name
            : data.user.name}
        </div>
      </div>
    </div>
  );
}
