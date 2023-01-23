import DisplaySearchs from "@/components/DisplaySearchs";
import Header from "@/components/header";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React from "react";

export default function search() {
  const router = useRouter();
  const { search } = router.query;
  let searchString: string;

  if (typeof search === "string") {
    searchString = search;
  } else {
    searchString = "";
    router.push("");
  }

  const { data, refetch, isLoading } = trpc.useQuery(
    ["idea.search", { this_query: searchString }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <div id="no-scroll1 ">
        <div className=" h-screen w-screen flex flex-col">
          <Header />
          {data && <DisplaySearchs data={data} />}
        </div>
      </div>
    </>
  );
}
