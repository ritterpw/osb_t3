import { UserIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  function getUserProfile() {
    router.push(`/users/${session?.user.id}`);
  }

  if (session?.user.image) {
    return (
      <>
        <div className="items-center inline-flex ml-2">
          <div
            onClick={() => signOut()}
            className="  cursor-pointer  hover:text-emerald-200"
          >
            <p className="header__link hidden lg:inline-flex">Sign Out</p>
          </div>
          {session.user.image && (
            <img
              onClick={() => {
                getUserProfile();
              }}
              className=" w-6 h-6 rounded-full cursor-pointer hover:opacity-80 sm:ml-3 "
              referrerPolicy="no-referrer"
              src={session.user.image}
            />
          )}
          {!session.user.image && <UserIcon className="icon " />}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        onClick={() => signIn()}
        className="  cursor-pointer items-center inline-flex hover:text-emerald-200 ml-3"
      >
        <p className="header__link hidden lg:inline-flex">Sign In</p>
        <UserIcon className="icon " />
      </div>
    </>
  );
}
