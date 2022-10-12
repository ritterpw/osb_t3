import DisplaySearchs from "@/components/DisplaySearchs";
import Header from "@/components/header";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export default function me() {
  const { data: session } = useSession();
  const router = useRouter();
  let thisEmail: string;

  if (session?.user.email && typeof session?.user.email === "string") {
    thisEmail = session.user.email;
  } else {
    return <div> Must Login </div>;
  }

  const { data, refetch, isLoading } = trpc.useQuery(
    ["user.getUserByEmail", { email: thisEmail }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  // if the logged in user has the same email as the user they are trying to get, then thay have access to this page
  if (data?.user) {
    return (
      <div id="no-scroll1 ">
        <div className=" h-screen w-screen flex flex-col">
          <Header />
          {data.user.producer_name}
        </div>
      </div>
    );
  }

  return <div> no user found</div>;
}
