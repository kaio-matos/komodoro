import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toSeconds } from "@/lib/utils";
import { useState } from "react";
import { Timer } from "../timer";
import { PomodoroSettings } from "../pomodoro-settings";
import { useAudio } from "@/hooks/use-audio";
import { usePomodoroSettings } from "../hooks/use-pomodoro-settings";

enum PomodoroMode {
  Pomodoro = "pomodoro",
  ShortBreak = "short-break",
  LongBreak = "long-break",
}

export function PomodoroPicker() {
  const [value, onValueChange] = useState<PomodoroMode>(PomodoroMode.Pomodoro);
  const pomodoroSettings = usePomodoroSettings();
  const alarmAudioControl = useAudio(pomodoroSettings.alarm);
  const backgroundAudioControl = useAudio(pomodoroSettings.background, {
    volume: pomodoroSettings.backgroundVolume,
  });

  function onStart() {
    backgroundAudioControl.forcePlay();
  }

  function onReset() {
    backgroundAudioControl.stop();
  }

  function onStop() {
    backgroundAudioControl.stop();
  }

  function onFinish() {
    backgroundAudioControl.stop();
    const play = async (repeat: number) => {
      if (repeat === 0) {
        return;
      }
      await alarmAudioControl.forcePlay();
      play(repeat - 1);
    };

    play(pomodoroSettings.repeat);
  }

  return (
    <Tabs
      defaultValue={PomodoroMode.Pomodoro}
      value={value}
      onValueChange={(v) => {
        onValueChange(v as PomodoroMode);
        backgroundAudioControl.stop();
      }}
      className="sm:w-[450px] relative"
    >
      <Card className="px-5">
        <div className="flex flex-col gap-2">
          <PomodoroSettings {...pomodoroSettings} />
          <TabsList className="mx-auto w-full sm:w-auto">
            <TabsTrigger value={PomodoroMode.Pomodoro}>Pomodoro</TabsTrigger>
            <TabsTrigger value={PomodoroMode.ShortBreak}>
              Short Break
            </TabsTrigger>
            <TabsTrigger value={PomodoroMode.LongBreak}>Long Break</TabsTrigger>
          </TabsList>
          <CardTitle className="text-center mt-4 text-2xl">
            {
              {
                [PomodoroMode.Pomodoro]: "Focus Time",
                [PomodoroMode.ShortBreak]: "Short Break",
                [PomodoroMode.LongBreak]: "Long Break",
              }[value]
            }
          </CardTitle>
        </div>
        <CardContent>
          <TabsContent value={PomodoroMode.Pomodoro}>
            <Timer
              initialTime={toSeconds(import.meta.env.DEV ? 1 : 25)}
              onStart={onStart}
              onStop={onStop}
              onFinish={onFinish}
              onReset={onReset}
            />
          </TabsContent>
          <TabsContent value={PomodoroMode.ShortBreak}>
            <Timer
              initialTime={toSeconds(import.meta.env.DEV ? 0.5 : 5)}
              onStart={onStart}
              onStop={onStop}
              onFinish={onFinish}
              onReset={onReset}
            />
          </TabsContent>
          <TabsContent value={PomodoroMode.LongBreak}>
            <Timer
              initialTime={toSeconds(import.meta.env.DEV ? 0.7 : 15)}
              onStart={onStart}
              onStop={onStop}
              onFinish={onFinish}
              onReset={onReset}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
