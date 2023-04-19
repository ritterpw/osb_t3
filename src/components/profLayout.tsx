import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  BellAlertIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

const dashboardLayout = (props: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-vercel-900 ">
      <DashboardHeader title={props.pageTitle} />
      <DashboardBody children={props.children} />
    </div>
  );
};

export default dashboardLayout;

const DashboardHeader = ({ title }: any) => {
  const router = useRouter();
  return (
    <div className=" top-0 h-28 w-full  py-5 ">
      <div className="flex h-full  flex-row items-center justify-between ">
        <div className=" w-72  text-center ">
          <div className="m-auto flex h-full w-52 items-center justify-center   text-center">
            <h1 className=" text-3xl font-bold text-vercel-400">{title}</h1>
          </div>
        </div>

        <div className="hidden flex-row items-center  justify-between py-4  px-2 pr-10  md:flex md:gap-4 lg:gap-6">
          <div
            className=" dashboard__header__link flex"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <HomeIcon className="h-6 w-6 object-center  " />
          </div>

          <div className="dashboard__header__link hidden lg:flex ">
            <ChatBubbleBottomCenterTextIcon className=" h-6 w-6 object-center  " />
          </div>

          <div className="dashboard__header__link flex">
            <BellAlertIcon className="h-6 w-6 object-center  " />
          </div>

          <UserHeaderButton />
        </div>
      </div>
    </div>
  );
};

const SideColumn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="flex h-full w-72 flex-col items-center pt-2  ">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-vercel-300 ">
        {session?.user ? (
          <img
            className="  w-[18] rounded-full"
            src={session?.user?.image as string}
            alt={""}
            width={1000}
            height={1000}
          />
        ) : (
          <UserCircleIcon className="h-18 w-18 text-vercel-900" />
        )}
      </div>

      <h1 className=" pt-4 text-2xl font-bold text-vercel-400">
        {session?.user?.name}
      </h1>

      <div className="w-full pt-12">
        <div className=" ">
          <ul>
            <li
              className={` flex cursor-pointer items-center gap-2 py-3 text-vercel-400 hover:bg-vercel-700 ${
                router.pathname === "/dashboard"
                  ? "border-l-4 border-red-600"
                  : ""
              }`}
            >
              <HomeIcon className="ml-12 h-9 w-9  object-center" />
              <Link className=" pl-4 text-lg " href={"/dashboard"}>
                Home
              </Link>
            </li>

            <li
              className={` flex cursor-pointer items-center gap-2 py-3 text-vercel-400 hover:bg-vercel-700 ${
                router.pathname === "/settings"
                  ? "border-l-4 border-red-600"
                  : ""
              }`}
            >
              {" "}
              <Cog6ToothIcon className="ml-12 h-9 w-9 object-center " />
              <h1 className=" pl-4 text-lg ">Settings</h1>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const DashboardBody = ({ children }: any) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className=" flex h-full w-full  flex-row ">
      <div>
        <SideColumn />
      </div>
      <div className=" max-h-full w-full overflow-x-clip overflow-y-scroll pb-10 pr-10  ">
        {children}
      </div>
    </div>
  );
};

const UserHeaderButton = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="dashboard__header__link flex">
        <UserIcon
          onClick={() => setIsOpen(!isOpen)}
          className="  h-6 w-6  flex-col  object-center "
        />
      </div>
      {isOpen && (
        <div
          className=" absolute top-0 left-0 z-20 h-full w-[100vw] bg-opacity-75"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute right-0 mr-10  mt-20 w-56 origin-top-right rounded-md border border-vercel-400 bg-vercel-900 shadow-lg shadow-vercel-1000 ring-1 ring-black ring-opacity-5 transition duration-200 ease-in focus:outline-none">
            <div className="">
              {session?.user?.email && (
                <h1
                  className=" block rounded-t-md border-b  border-vercel-600 bg-vercel-1000 px-4 py-2  text-sm text-gray-400 "
                  role="menuitem"
                >
                  {session?.user.email}
                </h1>
              )}
              <a
                href="#"
                className="block  px-4 py-2 text-sm text-gray-400 hover:bg-vercel-1000 hover:text-gray-300"
                role="menuitem"
              >
                Settings
              </a>
              <div
                onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                className="block cursor-pointer rounded-b-md px-4 py-2 text-sm  text-gray-400 hover:bg-vercel-1000 hover:text-gray-300"
                role="menuitem"
              >
                Log out
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
