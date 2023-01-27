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
import { AiFillGoogleCircle } from "react-icons/ai";
import Header from "@/components/header";

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

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <section className="h-screen items-center justify-center  flex px-10 pb-16">
        <div className="  p-20 bg-gray-800 rounded-xl hover:opacity-90 hover:cursor-pointer items-center justify-center  transition-all duration-500 ease-in-out  hover:text-emerald-400">
          {providers
            ? Object.values(providers).map((provider, i) => {
                if (provider.id !== "email") {
                  return (
                    <div
                      className=" justify-center items-center overflow-ag-overlay"
                      key={provider.id}
                      onClick={() => signIn(provider.id)}
                    >
                      <div className="  text-center ">
                        <h1 className="  text-3xl">Log In</h1>
                        <div>
                          <AiFillGoogleCircle className=" my-10 h-20 w-20 m-auto" />
                          <h1 className=" text-2xl ">Sign In With Google</h1>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            : ""}
        </div>
      </section>
    </div>
  );
};

export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
