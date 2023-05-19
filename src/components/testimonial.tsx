import { UserCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

const testimonial = ({
  quote,
  name,
  image,
}: {
  quote: string;
  name: string;
  image: string;
}) => {
  return (
    <div className=" grid grid-flow-row bg-gray-900  bg-opacity-20 md:h-96 rounded-lg shadow-lg text-left p-3">
      <div className=" text-gray-400  m-auto h-full  ">
        <div className=" justify-center">
          "I have been using Open Source Productions for the past few months and
          it has completely changed the way I collaborate with other musicians.
          The platform is incredibly easy to use, and the community of creators
          is supportive and welcoming."
        </div>
      </div>
      <div className="  h-full  m-auto flex text-left space-x-2 items-center gap-4 w-full ">
        <button className=" pb-4 h-16 w-16  shadow-md  bg-emerald-600 rounded-full text-gray-900 items-center justify-center text-center">
          {/* {data && data.user?.image != null && (
          <img
          className=" h-20 w-20 rounded-full cursor-pointer hover:opacity-80  "
          src={data.user?.image}
          />
          )}
            {!data && <UserCircleIcon className=" p-6" />} */}
          <UserCircleIcon className="" />
        </button>
        <div>
          <div className="text-lg xl:text-3xl">Paul Ritter</div>
          <div className="text-sm xl:text-md text-gray-600">Hip Hop</div>
        </div>
      </div>
    </div>
  );
};

export default testimonial;
