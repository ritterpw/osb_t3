import { Contribution, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ContributionTab from "./ContributionTab";
import router from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { set } from "lodash";
import { trpc } from "@/utils/trpc";

type Props = {
  contributions: Contribution[];
  ideaID: string;
};

const ReviewContributions = ({ contributions, ideaID }: Props) => {
  const [reviewContributions, setReviewContributions] = useState(false);

  return (
    <>
      <div className="  rounded-b border-b md:border-x border-vercel-600 bg-vercel-1000 mx-auto shadow-lg  w-full md:w-[75%] xl:w-[50%]  animate-fade-in ease-in duration-200">
        {reviewContributions && (
          <ViewPendingContributions
            contributions={contributions}
            ideaID={ideaID}
          />
        )}

        <div className=" px-3 bg-vercel-1000 z-50 sticky top-0 py-2 text-lg lg:text-xl justify-between flex items-center text-left border-b border-vercel-600">
          <h1 className="font-bold pl-6">
            {contributions.length} Pending Contribution
            {contributions.length > 1 && "s"}
          </h1>
          <button
            onClick={() => {
              setReviewContributions(!reviewContributions);
            }}
            className=" px-4 py-1 mr-6 my-1  border border-vercel-600 bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
          >
            Review Contribution{contributions.length > 1 && "s"}
          </button>
        </div>

        {/* {contributions.map((c) => {
        return <ContributionTab c={c} user={contributionUser} key={c.id} />;
      })} */}
      </div>
    </>
  );
};

export default ReviewContributions;

const ViewPendingContributions = ({ contributions, ideaID }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : contributions.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < contributions.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="flex w-full items-center justify-between  bg-vercel-800 border-b md:border-x border-vercel-600 px-10 py-5">
      <button
        className="bg-emerald-700 text-vercel-300 p-2  border-2 border-vercel-900 rounded shadow-[rgba(17,17,17,1)_5px_5px_0px_0px] "
        onClick={handlePrev}
      >
        &lt; Prev
      </button>
      <div className="transition-transform duration-500 ease-in-out transform border rounded bg-vercel-1000 border-vercel-600 w-8/12 flex">
        {!contributions[currentIndex] ||
          (contributions[currentIndex] === undefined && (
            <div>
              <p>No More contributions</p>
            </div>
          ))}

        {contributions[currentIndex] && (
          <div className=" w-full">
            <ContributionTab c={contributions[currentIndex]} />
          </div>
        )}
      </div>
      <button
        className="bg-emerald-700 text-vercel-300 p-2  border-2 border-vercel-900 rounded shadow-[rgba(17,17,17,1)_5px_5px_0px_0px] "
        onClick={handleNext}
      >
        Next &gt;
      </button>
    </div>
  );
};
