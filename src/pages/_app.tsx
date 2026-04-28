// src/pages/_app.tsx
import { AudioContext, AudioDetails } from "@/context/audioContext";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { useContext, useEffect, useState } from "react";
import superjson from "superjson";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import AudioFooter from "@/components/audio/AudioFooter";

export interface playAudioInterface extends AudioDetails {
  this_audio: HTMLAudioElement;
}

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audio_details, setAudioDetails] = useState<AudioDetails | null>(null);

  const pauseAudio = () => {
    if (audio && !audio.paused) {
      audio.pause();
      setAudio(null);
      setAudioDetails(null);
    }
  };

  const playAudio = ({
    this_audio,
    artist,
    title,
    ideaID,
  }: playAudioInterface) => {
    if (audio !== this_audio) {
      pauseAudio();
    }

    this_audio.play();
    setAudio(this_audio);
    setAudioDetails({ artist, title, ideaID });

    return;
  };

  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      session={pageProps.session}
    >
      <AudioContext.Provider
        value={{
          audio,
          setAudio,
          audio_details,
          setAudioDetails,
          playAudio,
          pauseAudio,
        }}
      >
        <Component {...pageProps} />
        <AudioFooter />
      </AudioContext.Provider>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
