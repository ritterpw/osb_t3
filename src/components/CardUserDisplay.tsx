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

  return (
    <div
      onClick={() => {
        ClickHander();
      }}
    >
      {data && data.user?.image != null && (
        <img
          className=" h-10 w-10 m-auto rounded-full cursor-pointer   "
          src={data.user?.image}
        />
      )}
      {!data && <UserCircleIcon className=" p-6" />}
    </div>
  );
}

export default CardUserDisplay;
