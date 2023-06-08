import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";

function CardUserDisplay({ user }: { user: User | undefined | null }) {
  const router = useRouter();

  function ClickHander() {
    user && router.push(`/users/${user.id}`);
  }

  const name = user?.producer_name ? user.producer_name : user?.name;

  return (
    <div
      className="inline-flex   items-center justify-center cursor-pointer ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
      onClick={() => {
        ClickHander();
      }}
    >
      <h1 className="hidden pr-2 lg:inline-flex whitespace-nowrap text-xl">
        {name}
      </h1>
      <div className="h-10 w-10   bg-emerald-600 rounded-full  shadow-md  text-gray-900 items-center justify-center text-center ">
        <div>
          {user?.image != null && (
            <img
              className=" h-10 w-10 m-auto rounded-full cursor-pointer"
              referrerPolicy="no-referrer"
              src={user?.image}
            />
          )}
          {!user && <UserCircleIcon className=" p-6" />}
        </div>
      </div>
    </div>
  );
}

export default CardUserDisplay;
