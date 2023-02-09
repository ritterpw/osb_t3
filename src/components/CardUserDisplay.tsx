import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";

function CardUserDisplay({ userId }: { userId: string }) {
  const router = useRouter();

  function ClickHander() {
    router.push(`/users/${userId}`);
  }

  return (
    <div
      onClick={() => {
        ClickHander();
      }}
    >
      <UserCircleIcon className={`h-10 w-10 m-auto `} />
    </div>
  );
}

export default CardUserDisplay;
