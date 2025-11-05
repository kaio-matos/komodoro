import { Button } from "@/components/ui/button";
import { formatTime, toMiliseconds } from "@/lib/utils";
import { Pause, Play, TimerResetIcon } from "lucide-react";
import { useEffect, useState } from "react";
import pressAudioURL from "@/assets/audio/extra/autoradio_button_press.wav?url";
import { useAudio } from "@/hooks/use-audio";
import { usePreciseInterval } from "@/hooks/use-precise-interval";

export function Timer({
  initialTime = toMiliseconds(25),
  onFinish,
}: {
  initialTime?: number;
  onFinish?: () => void;
}) {
  const [time, setTime] = useState(initialTime);
  const pressAudio = useAudio(pressAudioURL);
  const timer = usePreciseInterval({
    callback() {
      setTime((time) => (time > 0 ? time - 1 : 0));
    },
    delay: 1000,
  });

  const hasStarted = time < initialTime;
  const hasFinished = time === 0;
  const isRunning = timer.isRunning;

  useEffect(() => {
    if (hasFinished) {
      onFinish?.();
      timer.stop();
    }
  }, [hasFinished]);

  function start() {
    timer.start();
    pressAudio.forcePlay();
  }

  function pause() {
    pressAudio.forcePlay();
    timer.stop();
  }

  function reset() {
    pause();
    setTime(initialTime);
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-5xl sm:text-8xl font-bold">{formatTime(time)}</h3>
      <div className="flex gap-2 mt-3">
        <Button
          className="flex-1"
          size="lg"
          onClick={() => start()}
          disabled={isRunning || hasFinished}
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
