import Image from "next/image";

export async function getServerSideProps() {}

export default function MostPopular() {
  return (
    <>
      <div className=" bg-gray-800  rounded-b-xl  shadow-gray-800  drop-shadow-sm  h-96   ">
        <div className="grid lg:grid-cols-[1.6fr_1fr] ">
          <div className=" items-center  text-center justify-center place-items-center flex">
            <div className=" text-center">
              <p className="  text-7xl  ">Open Source</p>
              <p className="  text-7xl  ">Productions</p>
              <p className=" mt-4  text-xl  text-emerald-300">
                Collaborate with producers around the world
              </p>

              <p className=" text-gray-300">
                Start by downloading your favorite idea
              </p>
            </div>
          </div>
          <div className=" hidden lg:inline-flex  rounded-l-3xl my-10  ">
            <div className=" rounded-bl-3xl float-right">
              <img
                src="/home.jpg"
                className="rounded-l-2xl  shadow-gray-800 shadow-sm  sticky"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="lg:my-20  ">
        <h1 className=" text-center my-5 text-4xl"> Most Popular Ideas</h1>
        <div className=" mx-8 my-10 grid lg:grid-cols-3   gap-10 ">
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
    </>
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
    <div className=" max-w-sm  rounded-lg overflow-hidden shadow-lg bg-gray-700  ">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-200 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {tags.map((tag) => {
          return (
            <span className="inline-block bg-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2 shadow-md">
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
