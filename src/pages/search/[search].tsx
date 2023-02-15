import DisplaySearchs from "@/components/DisplaySearchs";
import Header from "@/components/header";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React from "react";

export default function Search() {
  const router = useRouter();
  const { search } = router.query;

  const { data } = trpc.useQuery(
    ["idea.search", { this_query: search as string }],
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
