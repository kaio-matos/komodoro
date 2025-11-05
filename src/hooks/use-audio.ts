import { useAudioContext } from "@/providers/audio";
import { useEffect, useRef } from "react";
import { useAsyncFunction } from "./use-async-state";

export function useAudio(url: string) {
  const { connectAudio, audioContext, audioElementsCache } = useAudioContext();
  const audio = useRef<HTMLAudioElement>(audioElementsCache.current.get(url));

  const play = useAsyncFunction({
    fn: async () => {
      if (audioContext.current?.state === "suspended") {
        audioContext.current.resume();
      }

      return audio.current?.play();
    },
  });

  useEffect(() => {
    audio.current = audioElementsCache.current.get(url);
    if (!audio.current) {
      audio.current = new Audio(url);
      audioElementsCache.current.set(url, audio.current);
      connectAudio(audio.current);
    }
  }, [url]);

  function pause() {
    return audio.current?.pause();
  }

  function reset() {
    if (audio.current) {
      audio.current.currentTime = 0;
    }
  }

  function forcePlay() {
    reset();
    play.execute();
  }
  return {
    audioRef: audio,

    play,
    pause,
    reset,
    forcePlay,
  };
}
