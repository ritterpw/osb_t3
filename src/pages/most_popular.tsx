import {
  ArrowDownCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function MostPopular() {
  return (
    <div className="snap-y snap-mandatory overflow-x-clip overflow-y-scroll">
      {/* <div className=" h bg-gradient-to-b  from-gray-800 to-gray-900 rounded-b-xl  shadow-gray-800  drop-shadow-sm  h-96   "> */}
      <div className="  h-screen y-screen   ">
        <div className=" snap-start bg-piccy h-screen bg-no-repeat bg-cover bg-left bg-fixed ">
          <div className=" h-screen w-screen justify-center items-center lg:grid lg:grid-cols-[1.5fr_1fr]  ">
            <div className=" items-center  text-center justify-center place-items-center flex"></div>
            <div className="  rounded-l-3xl my-10  ">
              <div className=" flex flex-col text-center lg:text-left">
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
      </div>

      <div className="snap-start h-screen pb-10  pt-10 lg:pt-20 xl:pt-40  bg-gradient-to-b  from-black to-gray-900 ">
        <h1 className=" text-center my-5 text-4xl"> Ideas Of The Week</h1>

        <div className=" mx-8  items-center justify-center  ">
          <div className="gap-10 grid lg:grid-cols-[1fr_1fr_1fr]  m-auto items-center justify-center">
            <Card
              name={"some beat "}
              description={"this is some beat "}
              tags={["dark", "wow"]}
            />
            <Card
              name={"Other beat "}
              description={"this is some beat "}
              tags={["hey", "hi", "wow"]}
            />
            <Card
              name={"some beat "}
              description={"this is some beat "}
              tags={["hey", "hi", "wow"]}
            />
            <Card
              name={"some beat "}
              description={"this is some beat "}
              tags={["hey", "hi", "wow"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  name,
  description,
  tags,
}: {
  name: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="w-full  justify-center items-center m-auto  rounded-lg overflow-hidden shadow-lg bg-gray-800  ">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-200 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2  flex  justify-between">
        <div>
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-600 cursor-pointer hover:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2 shadow-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex">
          <InformationCircleIcon className=" mx-1 h-8 w-8 cursor-pointer hover:text-emerald-600  " />
          <ArrowDownCircleIcon className=" mx-1 h-8 w-8 cursor-pointer hover:text-emerald-600" />
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
