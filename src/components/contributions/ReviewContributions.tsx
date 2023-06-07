import { Contribution, User } from "@prisma/client";
import React from "react";
import ContributionTab from "./ContributionTab";
import router from "next/router";

type Props = {
  contributions: Contribution[];
  contributionUser: User;
  ideaID: string;
};

const ReviewContributions = ({
  contributions,
  contributionUser,
  ideaID,
}: Props) => {
  return (
    <div className="  rounded-b border-b md:border-x border-vercel-600 bg-vercel-1000 mx-auto shadow-lg  w-full md:w-[50%] overflow-y-scroll">
      <div className=" px-3 bg-vercel-1000 z-50 sticky top-0 py-2 text-xl lg:text-2xl justify-between flex items-center text-left border-b border-vercel-600">
        <h1 className="font-bold pl-6">
          {contributions.length} Pending Contributions
        </h1>
        <button
          onClick={() => {
            router.push(`/ideas/${ideaID}/reviewContributions`);
          }}
          className=" px-4 py-1 mr-6 my-1  border border-vercel-600 bg-vercel-1000 text-emerald-500  shadow-md rounded items-center justify-center text-center hover:bg-emerald-500 hover:text-gray-800 transition-all ease-in duration-200"
        >
          Review Contributions
        </button>
      </div>

      {contributions.map((c) => {
        return <ContributionTab c={c} user={contributionUser} key={c.id} />;
      })}
    </div>
  );
};

export default ReviewContributions;
