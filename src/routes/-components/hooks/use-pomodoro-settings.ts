import { useEffect, useMemo, useRef, useState } from "react";
import { alarmSounds } from "../sounds";
import { LocalStorage } from "@/lib/local-storage";
import { useAudioContext } from "@/providers/audio";

const alarms = Object.values(alarmSounds);

export function usePomodoroSettings() {
  const { gainNode } = useAudioContext();
  const saved = useMemo(
    () =>
      LocalStorage.getItem("pomodoro-settings", {
        alarm: alarms[0].default,
        repeat: 2,
        globalVolume: gainNode.current?.gain.value ?? 0,
      }),
    [],
  );

  const [alarm, setAlarm] = useState<string>(saved.alarm);
  const [repeat, setRepeat] = useState(saved.repeat);
  const [globalVolume, setGlobalVolume] = useState(saved.globalVolume);

  useEffect(() => {
    LocalStorage.setItem("pomodoro-settings", {
      alarm,
      repeat,
      globalVolume,
    });
  }, [alarm, repeat, globalVolume]);

  useEffect(() => {
    if (!gainNode.current) return;
    console.log(globalVolume);
    gainNode.current.gain.value = globalVolume;
  }, [globalVolume]);

  return { alarm, setAlarm, repeat, setRepeat, globalVolume, setGlobalVolume };
}

export type TUsePomodoroSettingsReturn = ReturnType<typeof usePomodoroSettings>;
