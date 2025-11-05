import { useAudioContext } from "@/providers/audio";
import { RefObject, useEffect, useRef } from "react";
import { useAsyncFunction } from "./use-async-state";

function useEventListener<T extends HTMLElement>(
  el: RefObject<T | null | undefined>,
  ...args: Parameters<T["addEventListener"]>
) {
  useEffect(() => {
    // @ts-expect-error: Who knows why typescript is complaining, who cares
    el.current?.addEventListener(...args);
    return () => {
      // @ts-expect-error: Who knows why typescript is complaining, who cares
      el.current?.removeEventListener(...args);
    };
  }, [el.current]);
}

export function useAudio(url: string) {
  const { connectAudio, audioContext, audioElementsCache } = useAudioContext();
  const audio = useRef<HTMLAudioElement>(audioElementsCache.current.get(url));

  useEffect(() => {
    audio.current = audioElementsCache.current.get(url);
    if (!audio.current) {
      audio.current = new Audio(url);
      audioElementsCache.current.set(url, audio.current);
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
      return new Promise<void>((res) => {
        const listener = () => {
          res();
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
    forcePlay,
  };
}
