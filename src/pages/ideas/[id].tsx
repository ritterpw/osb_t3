import React from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Header from "@/components/header";
import IdeaScreen from "@/components/IdeaScreen";

export default function Id(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  function is_id(): boolean {
    return id != null && id != undefined && typeof id === "string";
  }

  let searchString: string;

  if (typeof id === "string") {
    searchString = id;
  } else {
    searchString = "";
  }

  const { data, isLoading, isError } = trpc.useQuery(
    ["idea.getIdeaById", { id: searchString }],
    {
      enabled: is_id(),
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

  // if the logged in user has the same email as the user they are trying to get, then thay have access to this page
  if (!data) {
    return <div> no idea found</div>;
  }

  return (
    <div id="no-scroll1 ">
      <div className=" bg-vercel-1000 h-screen w-screen flex flex-col">
        <div
          className="border-b border-b-vercel-700 
        "
        >
          <Header />
        </div>
        {data && <IdeaScreen idea={data} />}
      </div>
    </div>
  );
}
