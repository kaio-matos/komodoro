import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toMiliseconds } from "@/lib/utils";
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
  const { forcePlay } = useAudio(pomodoroSettings.alarm);

  function onFinish() {
    const play = async (repeat: number) => {
      if (repeat === 0) {
        return;
      }
      await forcePlay();
      play(repeat - 1);
    };

    play(pomodoroSettings.repeat + 1);
  }

  return (
    <Tabs
      defaultValue={PomodoroMode.Pomodoro}
      value={value}
      onValueChange={(v) => {
        onValueChange(v as PomodoroMode);
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
              initialTime={toMiliseconds(import.meta.env.DEV ? 1 : 25)}
              onFinish={onFinish}
            />
          </TabsContent>
          <TabsContent value={PomodoroMode.ShortBreak}>
            <Timer
              initialTime={toMiliseconds(import.meta.env.DEV ? 0.5 : 5)}
              onFinish={onFinish}
            />
          </TabsContent>
          <TabsContent value={PomodoroMode.LongBreak}>
            <Timer
              initialTime={toMiliseconds(import.meta.env.DEV ? 0.7 : 15)}
              onFinish={onFinish}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
