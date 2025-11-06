import { useEffect, useRef } from "react";
import { useAudioContext } from "@/providers/audio";
import { useAsyncFunction } from "./use-async-state";

const noop = () => {};

export function useAudio(
  url: string,
  {
    volume = 1,
    onEnd = noop,
    onStart = noop,
  }: { volume?: number; onStart?: () => void; onEnd?: () => void } = {},
) {
  const { connectAudio, audioContext, audioElementsCache } = useAudioContext();
  const audio = useRef<HTMLAudioElement>(audioElementsCache.current.get(url));

  useEffect(() => {
    audio.current = audioElementsCache.current.get(url);
    if (!audio.current) {
      audio.current = new Audio(url);

      audioElementsCache.current.set(url, audio.current);
      setVolume(volume);
      connectAudio(audio.current);
    }
  }, [url]);

  const tryingToPlay = useAsyncFunction({
    fn: async () => {
      if (audioContext.current?.state === "suspended") {
        audioContext.current.resume();
      }

      return audio.current?.play();
    },
  });

  const play = useAsyncFunction({
    fn: async () => {
      await tryingToPlay.execute();
      onStart();
      return new Promise<void>((res) => {
        const listener = () => {
          res();
          onEnd();
          audio.current?.removeEventListener("ended", listener);
        };
        audio.current?.addEventListener("ended", listener);
      });
    },
  });

  function pause() {
    return audio.current?.pause();
  }

  function reset() {
    if (audio.current) {
      audio.current.currentTime = 0;
    }
  }

  function stop() {
    pause();
    reset();
  }

  function setVolume(volume: number) {
    if (!audio.current) return;
    audio.current.volume = volume;
  }

  async function forcePlay() {
    reset();
    await play.execute();
  }
  return {
    audioRef: audio,

    tryingToPlay,
    play,
    pause,
    reset,
    stop,
    forcePlay,
    setVolume,
  };
}
