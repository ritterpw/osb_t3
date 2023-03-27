import DisplaySearchs from "@/components/DisplaySearchs";
import Header from "@/components/header";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function TagId() {
  const { id } = useRouter().query;

  const { data } = trpc.useQuery(
    ["idea.searchTag", { this_query: id as string }],
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className=" h-screen w-screen flex flex-col">
      <div
        className="border-b border-b-vercel-600 
        "
      >
        <Header />
      </div>{" "}
      {data && <DisplaySearchs data={data} />}
    </div>
  );
}
