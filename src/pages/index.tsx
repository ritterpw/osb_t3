import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Idea, ideasWithLikes } from "@prisma/client";
import { Session } from "next-auth";
import { NextRouter, useRouter } from "next/router";
import Header from "@/components/header";
import Card from "@/components/card";
import { isReadable } from "stream";
import { ideaRouter } from "@/server/router/idea";

export default function Home(): JSX.Element {
  let { data, isLoading, isSuccess } = trpc.useQuery(
    ["idea.getMostPopularThisWeek"],
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
          {data && <MostPopular data={data} />}
        </div>
      </div>
    </>
  );
}

function MostPopular({ data }: { data: ideasWithLikes[] }) {
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <div className="snap-y snap-mandatory overflow-x-clip overflow-y-scroll  h-screen w-screen flex flex-col ">
      <div className=" snap-start bg-piccy h-screen bg-no-repeat bg-cover bg-left bg-fixed ">
        <div className=" h-screen w-screen justify-center items-center lg:grid lg:grid-cols-[1.5fr_1fr]  ">
          <div className=" items-center  text-center justify-center place-items-center flex"></div>
          <div className="  rounded-l-3xl my-10  ">
            <div className=" flex flex-col text-center lg:text-left animate-fade-in">
              <p className="  text-7xl  ">Open Source</p>
              <p className="  text-7xl  ">Productions</p>
              <p className=" mt-6  text-xl  text-emerald-300">
                Collaborate with producers around the world
              </p>
              <p className=" text-gray-300">
                Start by downloading your favorite idea
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="snap-start overflow-scroll min-h-full ">
        <h1 className="  text-center py-6 text-4xl animate-fade-in ">
          Ideas Of The Week
        </h1>
        <div className=" mx-8  items-center justify-center ">
          <div className="gap-8 grid md:grid-cols-[1fr_1fr]  xl:grid-cols-[1fr_1fr_1fr] m-auto items-center justify-center">
            {data.map((idea) => (
              <div key={idea.id}>
                <Card
                  name={idea.title}
                  description={idea.description}
                  tag_one={idea.tag_one}
                  tag_two={idea.tag_two}
                  idea={idea.file}
                  userId={idea.userId}
                  likes={idea.likes}
                  id={idea.id}
                ></Card>
              </div>
            ))}
          </div>
        </div>

        <div className="  py-6 mx-auto text-center ">
          <button
            onClick={() => ClickNewIdea(session, router)}
            className="py-3  px-20 text-2xl bg-emerald-500 text-gray-900 rounded-3xl shadow-2xl"
          >
            Add New Idea
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailsButton() {
  return (
    <div>
      <InformationCircleIcon className="h-7 w-7 " />
    </div>
  );
}
function ClickNewIdea(session: Session | null, router: NextRouter): void {
  if (session) {
    console.log(session);
    router.push("/addidea");
  } else {
    signIn();
  }
}
