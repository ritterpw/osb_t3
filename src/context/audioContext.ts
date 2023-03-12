import React, { Dispatch, SetStateAction } from "react";

export interface AudioContextInterface {
  audio: HTMLAudioElement | null;
  setAudio: Dispatch<SetStateAction<HTMLAudioElement | null>>;
  playAudio: (audio: HTMLAudioElement) => void;
  pauseAudio: () => void;
}

export const AudioContext = React.createContext<AudioContextInterface>({
  audio: null,
  setAudio: () => {},
  playAudio: () => {},
  pauseAudio: () => {},
});
