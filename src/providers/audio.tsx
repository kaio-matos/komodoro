import { AudioController } from "@/lib/audio-controller";
import { Cache } from "@/lib/cache";
import { createContext, useContext, useEffect, useRef } from "react";

const AudioContext = createContext<ReturnType<typeof useAudioContext__> | null>(
  null,
);

function useAudioContext__() {
  const cache = useRef(
    new Cache<string, AudioController>(1000 * 60 * 60), // 1 hour
  );

  useEffect(() => {
    const interval = setInterval(() => {
      cache.current.clearExpired();
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  return {
    cache,
  };
}

export const AudioProvider: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <AudioContext.Provider
      value={useAudioContext__()}
      {...props}
    ></AudioContext.Provider>
  );
};

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
