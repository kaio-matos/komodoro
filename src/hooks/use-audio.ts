import { useEffect, useRef } from "react";
import { useAudioContext } from "@/providers/audio";
import { useAsyncFunction } from "./use-async-state";
import { AudioController, createAudioController } from "@/lib/audio-controller";

const noop = () => {};

export function useAudio(
  url: string,
  {
    volume = 1,
    onEnd = noop,
    onStart = noop,
  }: {
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {},
) {
  const { cache } = useAudioContext();
  const audio = useRef<AudioController>(cache.current.get(url));

  useEffect(() => {
    audio.current = cache.current.get(url);
    if (!audio.current) {
      audio.current = createAudioController(new Audio(url));
      cache.current.set(url, audio.current);
      setVolume(volume);
    }
  }, [url]);

  const tryingToPlay = useAsyncFunction({
    fn: async () => {
      if (audio.current?.ctx?.state === "suspended") {
        audio.current?.ctx.resume();
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
          audio.current?.track.mediaElement.removeEventListener(
            "ended",
            listener,
          );
        };
        audio.current?.track.mediaElement.addEventListener("ended", listener);
      });
    },
  });

  function pause() {
    audio.current?.pause();
  }

  function reset() {
    audio.current?.reset();
  }

  function stop() {
    audio.current?.stop();
  }

  function setVolume(volume: number) {
    audio.current?.setGain(volume);
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
