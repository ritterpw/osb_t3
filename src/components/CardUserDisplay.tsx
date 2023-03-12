import { trpc } from "@/utils/trpc";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";

function CardUserDisplay({ userId }: { userId: string }) {
  const router = useRouter();

  function ClickHander() {
    router.push(`/users/${userId}`);
  }

  const { data } = trpc.useQuery(["user.getUserById", { userId: userId }], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const name = data?.user?.producer_name
    ? data.user.producer_name
    : data?.user?.name;

  return (
    <div
      className="inline-flex   items-center justify-center cursor-pointer ease-in duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-100"
      onClick={() => {
        ClickHander();
      }}
    >
      <h1 className="hidden lg:inline-flex whitespace-nowrap text-xl">
        {name}
      </h1>
      <div className="h-10 w-10 m-4  bg-emerald-600 rounded-full  shadow-md  text-gray-900 items-center justify-center text-center ">
        <div>
          {data && data.user?.image != null && (
            <img
              className=" h-10 w-10 m-auto rounded-full cursor-pointer"
              referrerPolicy="no-referrer"
              src={data.user?.image}
            />
          )}
          {!data && <UserCircleIcon className=" p-6" />}
        </div>
      </div>
    </div>
  );
}

export default CardUserDisplay;
