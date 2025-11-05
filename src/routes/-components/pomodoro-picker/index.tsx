import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toMiliseconds } from "@/lib/utils";
import { useState } from "react";
import { Timer } from "../timer";
import { PomodoroSettings } from "../pomodoro-settings";
import { alarmSounds } from "../sounds";
import { useAudio } from "@/hooks/use-audio";
import { ScrollArea } from "@/components/ui/scroll-area";

enum PomodoroMode {
  Pomodoro = "pomodoro",
  ShortBreak = "short-break",
  LongBreak = "long-break",
}

export function PomodoroPicker() {
  const [value, onValueChange] = useState<PomodoroMode>(PomodoroMode.Pomodoro);
  const [alarm, setAlarm] = useState<string>(
    Object.values(alarmSounds)[0].default,
  );
  const { forcePlay } = useAudio(alarm);

  function onFinish() {
    forcePlay();
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
          <PomodoroSettings alarmSound={alarm} onAlarmSoundSelect={setAlarm} />
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
            <Timer initialTime={toMiliseconds(25)} onFinish={onFinish} />
          </TabsContent>
          <TabsContent value={PomodoroMode.ShortBreak}>
            <Timer initialTime={toMiliseconds(5)} onFinish={onFinish} />
          </TabsContent>
          <TabsContent value={PomodoroMode.LongBreak}>
            <Timer initialTime={toMiliseconds(15)} onFinish={onFinish} />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
