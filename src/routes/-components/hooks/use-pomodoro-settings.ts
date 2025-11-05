import { useState } from "react";
import { alarmSounds } from "../sounds";

export function usePomodoroSettings() {
  const [alarm, setAlarm] = useState<string>(
    Object.values(alarmSounds)[0].default,
  );
  const [repeat, setRepeat] = useState(2);

  return { alarm, setAlarm, repeat, setRepeat };
}

export type TUsePomodoroSettingsReturn = ReturnType<typeof usePomodoroSettings>;
