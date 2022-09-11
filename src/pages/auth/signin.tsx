import {
  getProviders,
  signIn,
  getCsrfToken,
  useSession,
} from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";
import { CubeIcon, KeyIcon } from "@heroicons/react/24/outline";

const customStyles = {
  content: {
    width: "80%",
    maxHeight: "90%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    color: "rgba(20, 23, 29, 0.90)",
    backgroundColor: "rgba(227, 229, 232, 1)",
    borderRadius: "10px",
  },
};

const SignIn = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(providers);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);
  return (
    <>
      <section className=" w-screen h-screen bg-gray-700 items-center justify-center flex px-10">
        <div className="  w-8/12  bg-gray-800 rounded-xl ">
          <div className="  h-full justify-center items-center overflow-ag-overlay">
            <div className=" py-10  h-full justify-center items-center overflow-ag-overlay text-center">
              <h1 className="  text-3xl">Log In</h1>

              {providers
                ? Object.values(providers).map((provider, i) => {
                    if (provider.id !== "email") {
                      return (
                        <div
                          key={provider.id}
                          onClick={() => signIn(provider.id)}
                        >
                          <CubeIcon />
                          <h1 className=" pt-4 text-2xl   ">
                            Sign In With Google
                          </h1>
                        </div>
                      );
                    }
                  })
                : ""}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
