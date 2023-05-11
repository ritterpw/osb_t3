import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  Bars3Icon,
  BellAlertIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  Square3Stack3DIcon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";

interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

const dashboardLayout = (props: LayoutProps) => {
  const [hamburgerClicked, setHamburgerClicked] = useState(false);
  return (
    <div className="flex min-h-screen w-screen flex-col bg-vercel-900 ">
      <DashboardHeader
        title={props.pageTitle}
        hamburgerClicked={hamburgerClicked}
        setHamburgerClicked={setHamburgerClicked}
      />
      <DashboardBody children={props.children} />
    </div>
  );
};

export default dashboardLayout;

type props = {
  title: string;
  hamburgerClicked: boolean;
  setHamburgerClicked: (value: boolean) => void;
};

const DashboardHeader = ({
  title,
  hamburgerClicked,
  setHamburgerClicked,
}: props) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className=" sticky top-0 z-50 sm:h-28 w-full  bg-vercel-900  border-b border-vercel-400 sm:border-b-0 ">
      <div className="flex h-full  flex-row items-center justify-between  ">
        <div className=" w-full sm:w-72  text-center  ">
          <div className="m-auto flex h-full sm:w-52   sm:justify-center text-center">
            <h1 className="hidden sm:flex text-3xl font-bold text-vercel-400">
              {title}
            </h1>
            <div className=" w-full flex sm:hidden  ">
              {!hamburgerClicked && (
                <div className="px-5 flex w-full justify-between py-3">
                  <Bars3Icon
                    className="button__icon h-8 w-8"
                    onClick={() => {
                      setHamburgerClicked(!hamburgerClicked);
                    }}
                  />
                  <div className="text-center justify-center m-auto text-3xl">
                    OSP
                  </div>
                  <HomeIcon
                    className="button__icon h-8 w-8"
                    onClick={() => {
                      router.push("/");
                    }}
                  />
                </div>
              )}
              {hamburgerClicked && (
                <div
                  className={` px-5 sm:hidden flex flex-col w-full py-3 ease-in transition-all duration-300 ${
                    hamburgerClicked && `bg-emerald-800`
                  } `}
                >
                  <div className="flex w-full justify-between ">
                    <XMarkIcon
                      className={`button__icon h-8 w-8 ${
                        hamburgerClicked && `text-vercel-300`
                      }`}
                      onClick={() => {
                        setHamburgerClicked(!hamburgerClicked);
                      }}
                    />
                    <div
                      className={`text-center justify-center m-auto text-3xl ${
                        hamburgerClicked && `text-vercel-300`
                      }`}
                    >
                      OSP
                    </div>
                    <HomeIcon
                      className={`button__icon h-8 w-8 ${
                        hamburgerClicked && `text-vercel-300`
                      }`}
                      onClick={() => {
                        router.push("/");
                      }}
                    />
                  </div>
                  <div>
                    <ul className="flex flex-col gap-3 pt-3">
                      <li className="flex  items-center gap-2">
                        <AiOutlineProfile className="h-8 w-8 object-center  " />
                        <Link href="/me">
                          <a className="text-vercel-300 text-2xl">
                            My Profile{" "}
                          </a>
                        </Link>
                      </li>
                      <li className="flex  items-center gap-2">
                        <CheckBadgeIcon className="h-8 w-8 object-center  " />
                        <Link href="/me/contributions">
                          <a className="text-vercel-300 text-2xl">
                            My Contributions
                          </a>
                        </Link>
                      </li>

                      <li className="flex  items-center gap-2">
                        <AiOutlineLogout className="h-8 w-8 object-center  " />
                        <div
                          onClick={() => {
                            signOut();
                          }}
                        >
                          <a className="text-vercel-300 text-2xl">Log Out </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden flex-row items-center  justify-between py-4  px-2 pr-10  sm:flex sm:gap-4 lg:gap-6">
          <div
            className=" dashboard__header__link flex"
            onClick={() => {
              router.push("/");
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
    <div className="hidden   sm:flex h-full w-72 flex-col items-center pt-2  ">
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
                router.pathname === "/me" ? "border-l-4 border-emerald-600" : ""
              }`}
              onClick={() => router.push("/me")}
            >
              <HomeIcon className="ml-12 h-9 w-9  object-center" />
              <h1 className=" pl-4 text-lg ">My Profile</h1>
            </li>

            <li
              className={` flex cursor-pointer items-center gap-2 py-3 text-vercel-400 hover:bg-vercel-700 ${
                router.pathname === "/settings"
                  ? "border-l-4 border-emerald-600"
                  : ""
              }`}
              onClick={() => router.push("/settings")}
            >
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
  return (
    <div className=" flex h-full w-full  flex-row ">
      <div>
        <SideColumn />
      </div>
      <div className=" max-h-full w-full overflow-x-clip overflow-y-scroll pb-10  sm:pr-10  ">
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
