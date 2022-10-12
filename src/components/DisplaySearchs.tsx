import { Idea } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";
import Card from "./card";

export default function DisplaySearchs({ data }: { data: Idea[] }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-[96%] max-h-screen w-screen pb-3  pt-3 m-auto ">
      <h1 className=" text-center my-5 text-4xl animate-fade-in  ">Search</h1>
      <div className=" px-10 md:px-20 lg:px-60 animate-fade-in ">
        {data &&
          data.map((idea) => (
            <div key={idea.id} className=" p-6">
              <Card
                name={idea.title}
                description={idea.description}
                tag_one={idea.tag_one}
                tag_two={idea.tag_two}
                likes={idea.likes}
                idea={idea.file}
                userId={idea.userId}
              ></Card>
            </div>
          ))}
        {data.length == 0 && (
          <h1 className="m-auto text-center text-2xl">No Results Found</h1>
        )}
      </div>
    </div>
  );
}
