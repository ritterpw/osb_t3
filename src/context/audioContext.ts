import { playAudioInterface } from "@/pages/_app";
import { User } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";

export type AudioDetails = {
  artist: User | undefined | null;
  title?: string;
  ideaID?: string;
};

export interface AudioContextInterface {
  audio: HTMLAudioElement | null;
  audio_details: AudioDetails | null;
  setAudio: Dispatch<SetStateAction<HTMLAudioElement | null>>;
  setAudioDetails: Dispatch<SetStateAction<AudioDetails | null>>;
  playAudio: (audio: playAudioInterface) => void;
  pauseAudio: () => void;
}

export const AudioContext = React.createContext<AudioContextInterface>({
  audio: null,
  audio_details: null,
  setAudioDetails: () => undefined,
  setAudio: () => undefined,
  playAudio: () => undefined,
  pauseAudio: () => undefined,
});
