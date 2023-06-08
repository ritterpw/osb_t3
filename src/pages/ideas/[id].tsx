import React from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Header from "@/components/header";
import IdeaScreen from "@/components/ideas/IdeaScreen";
import { User } from "@prisma/client";
import { getSession, GetSessionParams } from "next-auth/react";

export default function Id({ user }: { user: User }): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, isError } = trpc.useQuery(
    ["idea.getIdeaById", { id: id as string }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error</span>;
  }

  // if the logged in user has the same email as the user they are trying to get, then thay have access to this page
  if (!data) {
    return <div> no idea found</div>;
  }

  const contributions = data.contributions;

  return (
    <div id="no-scroll1 ">
      <div className=" bg-vercel-1000 h-screen w-screen flex flex-col">
        <div className="border-b border-b-vercel-700 ">
          <Header />
        </div>
        <IdeaScreen
          idea={data}
          contributions={data.userId === user.id ? contributions : undefined}
          contributionUser={data.user}
          user={data.user}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = async (req: GetSessionParams | undefined) => {
  const session = await getSession(req);

  return {
    props: {
      user: session?.user,
    },
  };
};
