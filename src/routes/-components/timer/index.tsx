import { Button } from "@/components/ui/button";
import { formatTime, toMiliseconds } from "@/lib/utils";
import { Pause, Play, TimerResetIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import pressAudioURL from "@/assets/audio/extra/autoradio_button_press.wav?url";
import { useAudio } from "@/hooks/use-audio";

export function Timer({
  initialTime = toMiliseconds(25),
  onFinish,
}: {
  initialTime?: number;
  onFinish?: () => void;
}) {
  const [time, setTime] = useState(initialTime);
  const [intervalId, setIntervalId] = useState<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const pressAudio = useAudio(pressAudioURL);

  const hasStarted = time < initialTime;
  const isRunning = intervalId !== undefined;

  function start() {
    if (intervalId) return;

    pressAudio.forcePlay();

    setIntervalId(
      setInterval(() => {
        setTime((time) => {
          const result = time > 0 ? time - 1 : 0;

          if (result === 0) {
            onFinish?.();
          }

          return result;
        });
      }, 1000),
    );
  }

  function pause() {
    pressAudio.forcePlay();
    clearInterval(intervalId);
    setIntervalId(undefined);
  }

  function reset() {
    pause();
    setTime(initialTime);
  }

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-8xl font-bold">{formatTime(time)}</h3>
      <div className="flex gap-2 mt-3">
        <Button
          className="flex-1"
          size="lg"
          onClick={() => start()}
          disabled={isRunning}
        >
          <Play />
          <span className="sr-only">Play</span>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => reset()}
          disabled={!hasStarted}
        >
          <TimerResetIcon />
          <span className="sr-only">Reset</span>
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={() => pause()}
          disabled={!isRunning}
        >
          <Pause />
          <span className="sr-only">Pause</span>
        </Button>
      </div>
    </div>
  );
}
