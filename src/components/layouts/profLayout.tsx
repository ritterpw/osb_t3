import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  Bars3Icon,
  BellAlertIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  HomeIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import UserHeaderButton from "@/components/user/UserHeaderButton";
import MyProfileSideBar from "@/components/user/MyProfileSideBar";
import UserProfileSideBar from "@/components/user/UserProfileSideBar";
import { trpc } from "@/utils/trpc";

interface LayoutProps {
  pageTitle: string;
  children: ReactNode;
}

const DashboardLayout = (props: LayoutProps) => {
  const [hamburgerClicked, setHamburgerClicked] = useState(false);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-vercel-900 ">
      <DashboardHeader
        title={props.pageTitle}
        hamburgerClicked={hamburgerClicked}
        setHamburgerClicked={setHamburgerClicked}
      />
      <DashboardBody>{props.children}</DashboardBody>
    </div>
  );
};

export default DashboardLayout;

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
  const isMe: boolean = router.query.id === session?.user?.id;

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
                        {isMe && (
                          <Link href="/me">
                            <a className="text-vercel-300 text-2xl">My Ideas</a>
                          </Link>
                        )}
                        {!isMe && (
                          <Link href="/me">
                            <a className="text-vercel-300 text-2xl">
                              User Ideas
                            </a>
                          </Link>
                        )}
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
                          className="cursor-pointer"
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
            className=" button__icon flex"
            onClick={() => {
              router.push("/");
            }}
          >
            <HomeIcon className="h-6 w-6 object-center  " />
          </div>

          <div className="button__icon hidden lg:flex ">
            <ChatBubbleBottomCenterTextIcon className=" h-6 w-6 object-center  " />
          </div>

          <div className="button__icon flex">
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

  const { data } = trpc.useQuery(
    ["user.getUserById", { userId: router.query.id as string }],
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const isMe: boolean = router.query.id === session?.user?.id;

  return (
    <div className="hidden   sm:flex h-full w-72 flex-col items-center pt-2  ">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-vercel-300 ">
        {session?.user ? (
          <img
            className="  w-[18] rounded-full"
            src={data?.user?.image as string}
            alt={""}
            width={1000}
            height={1000}
          />
        ) : (
          <UserCircleIcon className="h-18 w-18 text-vercel-900" />
        )}
      </div>

      <h1 className=" pt-4 text-2xl font-bold text-vercel-400">
        {isMe && session?.user?.name}
        {!isMe && data?.user?.name}
      </h1>

      <div className="w-full pt-12">
        {isMe && <MyProfileSideBar />}
        {!isMe && <UserProfileSideBar />}
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
