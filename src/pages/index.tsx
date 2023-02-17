import { trpc } from "../utils/trpc";
import { useSession, signIn } from "next-auth/react";
import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  GlobeAmericasIcon,
  InformationCircleIcon,
  MusicalNoteIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { NextRouter, useRouter } from "next/router";
import Header from "@/components/header";
import Card from "@/components/card";
import { testimonials } from "@/utils/data/testimonioal-data";

import { ideasWithLikes } from "types/prisma_override";
import Testimonial from "@/components/testimonial";
import Link from "next/link";
import { useState } from "react";

export default function Home(): JSX.Element {
  const { data, isLoading, isSuccess } = trpc.useQuery(
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
  const [page, setPage] = useState(0);
  if (!testimonials.length) return null;

  const { data: session } = useSession();

  return (
    <div className="snap-y snap-mandatory overflow-x-clip overflow-scroll min-h-full ">
      <div className=" snap-start  bg-piccy h-screen bg-no-repeat bg-cover bg-left bg-fixed ">
        <div className=" h-screen w-screen justify-center items-center lg:grid lg:grid-cols-[1.5fr_1fr]  ">
          <div className=" items-center  text-center justify-center place-items-center flex"></div>
          <div className="  rounded-l-3xl my-10  ">
            <div className=" flex flex-col text-center lg:text-left animate-fade-in  ease">
              <p className="  text-7xl  ">Open Source</p>
              <p className="  text-7xl  ">Productions</p>
              <p className=" mt-6  text-xl  text-emerald-300">
                Collaborate with producers around the world
              </p>
              <p className="  text-gray-300">
                Start by downloading your favorite idea
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="snap-start  ">
        <div className="min-h-screen">
          <h1 className=" text-center py-6 text-4xl animate-fade-in ">
            Ideas Of The Week
          </h1>
          <div className=" mx-12  items-center justify-center ">
            <div className="gap-8 grid md:grid-cols-[1fr_1fr]  xl:grid-cols-[1fr_1fr_1fr] m-auto items-center justify-center">
              {data.map((idea) => (
                <div key={idea.id}>
                  <Card idea={idea}></Card>
                </div>
              ))}
            </div>
          </div>
          <div className="  pt-10 mx-auto text-center ">
            <button
              onClick={() => ClickNewIdea(session, router)}
              className="py-3  px-20 text-2xl bg-emerald-500 text-gray-900 rounded-3xl shadow-2xl"
            >
              Add New Idea
            </button>
          </div>
          <div className="   pt-32  bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 pb-10">
            <div className="  p-32 md:grid md:grid-cols-2   h-fit py-6 mx-auto text-center      lg:gap-44 ">
              <div className=" flex flex-col   bg-gray-800 w-full h-[50vh] rounded-lg shadow-lg text-left">
                <div className="p-10 grid grid-rows-[1.5fr_2fr] h-full  ">
                  <div className="   ">
                    <MusicalNoteIcon className=" h-24 w-24  text-emerald-600" />
                  </div>
                  <div className="    ">
                    <h1 className=" text-3xl lg:text-6xl pb-6 text-gray-400 ">
                      Collaborate
                    </h1>
                    <h1 className=" text-lg lg:text-2xl  text-gray-500">
                      Experience music creation in a whole new way
                    </h1>
                  </div>
                </div>
              </div>
              <div className=" flex flex-col  justify-center  bg-gray-500 bg-opacity-5  w-full h-[50vh] rounded-lg shadow-lg text-left">
                <div className="p-10 grid grid-rows-[1.5fr_2fr] h-full">
                  <div>
                    <GlobeAmericasIcon className=" h-24 w-24  text-emerald-600" />
                  </div>
                  <div className="flex flex-col ">
                    <h1 className=" text-4xl text-gray-400  ">
                      Create with producers worldwide
                    </h1>
                    <h1 className=" text-base text-gray-500  ">
                      Looking for a way to collaborate with other musicians and
                      create something truly unique? Look no further than Open
                      Source Productions. Our platform connects you with other
                      musicians, providing the tools and support you need to
                      bring your ideas to life.
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            {/* implement a carousel of testimonials here */}
            <div className="  px-10 mb-20 grid grid-cols-3   h-fit py-6 mx-auto text-center  gap-7 ">
              <div className="col-span-full mt-28 flex   space-y-4 flex-row items-end justify-between lg:space-y-0">
                <div className="">
                  <h2 className=" text-2xl  md:text-4xl">{`See what other producers have to say`}</h2>
                </div>

                {testimonials.length >= 3 ? (
                  <div className="col-span-2  flex   col-start-11 mb-16 items-end justify-end space-x-3">
                    <ArrowLeftCircleIcon
                      className=" h-10 hover:opacity-50 hover:text-emerald-600 cursor-pointer"
                      direction="left"
                      onClick={() => setPage((p) => p - 1)}
                    />
                    <ArrowRightCircleIcon
                      className=" h-10 hover:opacity-50 hover:text-emerald-600 cursor-pointer"
                      direction="right"
                      onClick={() => setPage((p) => p + 1)}
                    />
                  </div>
                ) : null}
              </div>

              {Array.from({
                length: testimonials.length > 3 ? 3 : testimonials.length,
              }).map((_, index) => {
                const testimonialIndex =
                  (page * 3 + index) % testimonials.length;
                const testimonial = testimonials[testimonialIndex];
                if (!testimonial) return null;

                return <Testimonial quote={""} name={""} image={""} />;
              })}
            </div>
            <div></div>
          </div>
          <div className=" pt-8 bg-gray-800    pb-10">
            <div className=" ">
              <h1 className=" text-center text-4xl animate-fade-in ">
                Top Producers
              </h1>
              <div className="  p-32 md:grid md:grid-cols-3 sm:grid-cols-3 py-6 mx-auto text-center     lg:gap-44 ">
                <div className=" flex flex-col    w-full h-[50vh] rounded-lg shadow-lg text-left bg-gray-700 ">
                  <div className="p-10 grid grid-rows-[1.5fr_2fr] h-full  ">
                    <div className="   ">
                      <MusicalNoteIcon className=" h-24 w-24  text-emerald-600" />
                    </div>
                    <div className="    ">
                      <h1 className=" text-3xl lg:text-6xl pb-6 text-gray-400 ">
                        Collaborate
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function _detailsButton() {
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
