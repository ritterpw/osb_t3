import { trpc } from "../utils/trpc";
import { useSession, signIn } from "next-auth/react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  GlobeAmericasIcon,
  MusicalNoteIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { NextRouter, useRouter } from "next/router";
import Header from "@/components/header";
import Card from "@/components/card";
import { testimonials } from "@/utils/data/testimonioal-data";
import { ideasWithLikes } from "types/ideasWithLikes";
import { topUser } from "types/users_override";
import Testimonial from "@/components/testimonial";
import { useState } from "react";
import { User } from "@prisma/client";

interface HomePageProps {
  mostPopularIdeas: ideasWithLikes[];
  mostPopularUsers: topUser[];
}

export default function Home(): JSX.Element {
  const { data: mostPopularIdeas } = trpc.useQuery(
    ["idea.getMostPopularThisWeek"],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: mostPopularUsers } = trpc.useQuery(
    ["user.getMostPopularThisWeek"],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className=" h-screen w-screen flex flex-col ">
      <Header />
      {mostPopularIdeas && mostPopularUsers && (
        <MostPopular popIdeas={mostPopularIdeas} popUsers={mostPopularUsers} />
      )}
    </div>
  );
}

function MostPopular({
  popIdeas,
  popUsers,
}: {
  popIdeas: ideasWithLikes[];
  popUsers: {
    ideas: {
      id: string;
      likes: User[];
      title: string;
    }[];
    id: string;
    image: string | null;
    name: string | null;
    producer_name: string | null;
  }[];
}) {
  const router = useRouter();
  const [page, setPage] = useState(0);

  if (!testimonials.length) return null;

  const { data: session } = useSession();

  return (
    <div className="snap-y snap-mandatory overflow-x-clip overflow-y-scroll h-full">
      <div className=" snap-start  bg-piccy h-full bg-no-repeat bg-cover bg-left bg-fixed ">
        <div className=" h-full w-screen justify-center items-center sm:grid sm:grid-cols-[1.5fr_1fr]  ">
          <div className=" items-center  text-center justify-center place-items-center flex"></div>
          <div className="  rounded-l-3xl justify-center  mt-10 md:mt-52 sm:mr-10  md:px-10 px-0 ">
            <div className=" flex flex-col text-center sm:text-left animate-fade-in  ease">
              <p className=" text-5xl sm:text-7xl  ">Open Source</p>
              <p className=" text-5xl sm:text-7xl  ">Productions</p>
              <p className=" mt-6  text-base sm:text-xl  text-emerald-300">
                Collaborate with producers around the world
              </p>
              <p className=" text-sm sm:text-base text-gray-300">
                Start by downloading your favorite idea
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="snap-start min-h-screen bg-gray-900 ">
        <h1 className=" text-center pt-10 pb-6 text-4xl animate-fade-in ">
          Ideas Of The Week
        </h1>
        <div className=" mx-20 xl:mx-40  items-center justify-center">
          <div className="md:gap-8  md:grid md:grid-cols-[1fr_1fr]  xl:grid-cols-[1fr_1fr_1fr] m-auto items-center justify-center">
            {popIdeas.map((idea) => (
              <div className="first:pt-0 pt-8 md:pt-0 " key={idea.id}>
                <Card idea={idea} />
              </div>
            ))}
          </div>
        </div>
        <div className=" pb-6 md:pb-0  pt-10 mx-auto text-center ">
          <button
            onClick={() => ClickNewIdea(session, router)}
            className="py-3  px-10 text-2xl  bg-gray-800 hover:bg-emerald-500 hover:text-gray-900 hover:rounded-3xl shadow-md  ease-in duration-200 "
          >
            Add New Idea
          </button>
        </div>
        <div className="   hidden md:flex flex-col h-full  py-20  bg-gradient-to-b from-gray-900 via-gray-900 to-vercel-1000 ">
          <div className="  px-20 xl:px-40 lg:grid lg:grid-cols-2  mx-auto text-center gap-10  lg:gap-24 ">
            <div className=" flex flex-col  justify-center  bg-gray-800  mb-10 lg:p-0  w-full h-full rounded-lg shadow-lg text-left">
              <div className="p-10 grid grid-rows-[1.5fr_2fr] h-full">
                <div>
                  <MusicalNoteIcon className=" h-24 w-24  text-emerald-600" />
                </div>
                <div className="flex flex-col ">
                  <h1 className=" pt-6 text-3xl md:text-4xl xl:text-5xl text-gray-400  ">
                    Collaborate
                  </h1>
                  <h1 className=" hidden  md:flex pt-4 md:text-2xl text-base text-gray-500  ">
                    Experience music creation in a whole new way
                  </h1>
                </div>
              </div>
            </div>

            <div className=" flex flex-col  justify-center  bg-gray-800  mb-10 lg:p-0  w-full h-full rounded-lg shadow-lg text-left">
              <div className="p-10 grid grid-rows-[1.5fr_2fr] h-full">
                <div>
                  <GlobeAmericasIcon className=" h-24 w-24  text-emerald-600" />
                </div>
                <div className="flex flex-col ">
                  <h1 className=" pt-6 text-5xl xl:text-3xl text-gray-400  ">
                    Create with producers worldwide
                  </h1>
                  <h1 className=" hidden  xl:flex pt-4 text-base text-gray-500  ">
                    Looking for a way to collaborate with other musicians and
                    create something truly unique? Look no further than Open
                    Source Productions. Our platform connects you with other
                    musicians, providing the tools and support you need to bring
                    your ideas to life.
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* <div className=" px-10 pt-32   ">
              <h1 className="  text-4xl pb-10  ">Top Producers</h1>
              <div className="   grid grid-flow-row md:grid-cols-3 lg:grid-cols-6 gap-5  ">
                {popUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div> */}
          <div className="flex">
            <DividerStats />
          </div>
          <Testimonialsection />
        </div>
      </div>
    </div>
  );
}

/**
 * Testimonial Section
 *
 * shows 3 testimonials at a time
 */
function Testimonialsection() {
  return (
    <div className="  px-10 grid md:grid-cols-3   h-full pt-32 mx-auto text-center  gap-7 ">
      <div className="col-span-full pt-28 flex flex-row items-end justify-between">
        <h2 className=" text-2xl  md:text-4xl">{`See what other producers have to say`}</h2>

        {/* {testimonials.length >= 3 ? (
          <div className="col-span-2  flex   col-start-11 mb-16 items-end justify-end space-x-3">
            <ArrowLeftCircleIcon
              className=" h-10 hover:opacity-50 hover:text-emerald-600 cursor-pointer"
              direction="left"
            />
            <ArrowRightCircleIcon
              className=" h-10 hover:opacity-50 hover:text-emerald-600 cursor-pointer"
              direction="right"
            />
          </div>
        ) : null} */}
      </div>

      {Array.from({
        length: testimonials.length > 3 ? 3 : testimonials.length,
      }).map((_, index) => {
        const testimonialIndex = index % testimonials.length;
        const testimonial = testimonials[testimonialIndex];
        if (!testimonial) return null;

        return <Testimonial key={index} quote={""} name={""} image={""} />;
      })}
    </div>
  );
}

function UserCard({ user }: { user: topUser }) {
  return (
    <div className="rounded-lg shadow-md w-full bg-gray-900 grid grid-rows-[2fr_5fr] ">
      <div className="grid grid-flow-col  items-center justify-between drop-shadow-md">
        <h1 className=" pl-2 text-2xl  ">{user.producer_name ?? user.name}</h1>

        <div className="h-10 w-10 rounded-full ">
          {user ? (
            <img
              src={user.image!}
              referrerPolicy="no-referrer"
              className="rounded-full p-2"
            />
          ) : (
            <UserCircleIcon className=" text-emerald-600" />
          )}
        </div>
      </div>
      <div className=" bg-gray-800 p-2 ">
        {/* <h1 className=" text-lg text-gray-400">{user.bio}</h1> */}
        <h1 className=" text-md text-gray-400 ">
          some sort of bio where there is information and there are things said{" "}
        </h1>
      </div>
    </div>
  );
}

function DividerStats() {
  return (
    <div className="  h-44 w-full justify-center mt-32 border-y border-vercel-600 bg-gray-800  shadow-xl ">
      <div className=" m-auto grid h-full grid-cols-4 justify-center lg:w-[80%]  text-sm ">
        <div className=" my-auto grid h-[85%]  grid-rows-[4fr_1fr]  items-center justify-center border-r-2 border-vercel-600 text-center">
          <div className="m-auto flex h-full items-center justify-center  text-center text-5xl  font-bold text-vercel-300">
            <h1>100%</h1>
          </div>
          <h1 className="h-full text-vercel-500"> better than you</h1>
        </div>
        <div className=" my-auto grid h-[85%]  grid-rows-[4fr_1fr]  items-center justify-center border-r-2 border-vercel-600 text-center">
          <div className="m-auto flex h-full items-center justify-center  text-center text-5xl  font-bold text-vercel-300">
            <h1>69%</h1>
          </div>
          <h1 className="h-full text-vercel-500"> cooler</h1>
        </div>
        <div className=" my-auto grid h-[85%] grid-rows-[4fr_1fr]  items-center justify-center border-r-2 border-vercel-600 text-center">
          <div className="m-auto flex h-full items-center justify-center  text-center text-5xl  font-bold text-vercel-300">
            <GlobeAmericasIcon
              className="h-[80%]
        "
            />
          </div>
          <h1 className="h-full text-vercel-500"> global</h1>
        </div>
        <div className=" my-auto grid h-[85%] grid-rows-[4fr_1fr]  items-center justify-center text-center">
          <div className="m-auto flex h-full items-center justify-center  text-center text-5xl  font-bold text-vercel-300">
            <h1>100%</h1>
          </div>
          <h1 className="h-full text-vercel-500"> better than your company</h1>
        </div>
      </div>
    </div>
  );
}

function ClickNewIdea(session: Session | null, router: NextRouter): void {
  if (session) {
    router.push("/addidea");
  } else {
    signIn();
  }
}
