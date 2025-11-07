import { useEffect, useRef } from "react";
import { useAudioContext } from "@/providers/audio";
import { useAsyncFunction } from "./use-async-state";
import { AudioController, createAudioController } from "@/lib/audio-controller";
import { TUseVolumeReturn, useVolume } from "./use-volume";

const noop = () => {};

export function useAudio(
  url: string,
  {
    volumeControl: volumeControlReplacement,
    onEnd = noop,
    onStart = noop,
  }: {
    volumeControl?: TUseVolumeReturn;
    onStart?: () => void;
    onEnd?: () => void;
  } = {},
) {
  const { cache } = useAudioContext();
  const volumeControlFallback = useVolume(1);
  const audio = useRef<AudioController>(cache.current.get(url));

  const volumeControl = volumeControlReplacement ?? volumeControlFallback;

  useEffect(() => {
    audio.current = cache.current.get(url);
    if (!audio.current) {
      audio.current = createAudioController(new Audio(url));
      cache.current.set(url, audio.current);
    }
  }, [url]);

  useEffect(() => {
    if (!audio.current) return;
    audio.current.setGain(volumeControl.value);
  }, [volumeControl.value]);

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
    volumeControl,
  };
}

export type TUseAudioReturn = ReturnType<typeof useAudio>;
