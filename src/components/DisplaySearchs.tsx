import React from "react";
import { ideasWithLikes } from "types/ideasWithLikes";
import Card from "./card";

export default function DisplaySearchs({
  data,
  title,
}: {
  data: ideasWithLikes[];
  title: string;
}) {
  return (
    <div className="min-h-[96%] max-h-screen w-screen pb-3  pt-3 m-auto ">
      <h1 className=" text-center my-5 text-4xl animate-fade-in  ">{title}</h1>
      <div className=" px-10 md:px-20 lg:px-60 animate-fade-in ">
        {data &&
          data.map((idea) => (
            <div key={idea.id} className=" p-6">
              <Card idea={idea}></Card>
            </div>
          ))}
        {data.length == 0 && (
          <h1 className="m-auto text-center text-2xl">No Results Found</h1>
        )}
      </div>
    </div>
  );
}
