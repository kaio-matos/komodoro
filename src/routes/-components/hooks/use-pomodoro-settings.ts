import { useEffect, useRef, useState } from "react";
import { alarmSounds } from "../sounds";
import { LocalStorage } from "@/lib/local-storage";

const alarms = Object.values(alarmSounds);

export function usePomodoroSettings() {
  const saved = useRef(
    LocalStorage.getItem("pomodoro-settings", {
      alarm: alarms[0].default,
      repeat: 2,
    }),
  );

  const [alarm, setAlarm] = useState<string>(saved.current.alarm);
  const [repeat, setRepeat] = useState(2);

  useEffect(() => {
    LocalStorage.setItem("pomodoro-settings", {
      alarm,
      repeat,
    });
  }, [alarm, repeat]);

  return { alarm, setAlarm, repeat, setRepeat };
}

export type TUsePomodoroSettingsReturn = ReturnType<typeof usePomodoroSettings>;
