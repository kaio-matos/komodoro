import { useEffect, useMemo, useRef, useState } from "react";
import { alarmSounds, backgroundSounds } from "../sounds";
import { LocalStorage } from "@/lib/local-storage";
import { useAudioContext } from "@/providers/audio";

const alarms = Object.keys(alarmSounds);
const backgrounds = Object.keys(backgroundSounds);

export function usePomodoroSettings() {
  const { gainNode } = useAudioContext();
  const saved = useMemo(
    () =>
      LocalStorage.getItem("pomodoro-settings", {
        alarm: alarms[0],
        background: backgrounds[0],
        repeat: 2,
        globalVolume: gainNode.current?.gain.value ?? 0,
        backgroundVolume: 0.1,
      }),
    [],
  );

  const [alarm, setAlarm] = useState(saved.alarm);
  const [background, setBackground] = useState(saved.background);
  const [repeat, setRepeat] = useState(saved.repeat);
  const [globalVolume, setGlobalVolume] = useState(saved.globalVolume);
  const [backgroundVolume, setBackgrondVolume] = useState(
    saved.backgroundVolume,
  );

  useEffect(() => {
    LocalStorage.setItem("pomodoro-settings", {
      alarm,
      background,
      repeat,
      globalVolume,
      backgroundVolume,
    });
  }, [alarm, background, repeat, globalVolume, backgroundVolume]);

  useEffect(() => {
    if (!gainNode.current) return;
    gainNode.current.gain.value = globalVolume;
  }, [globalVolume]);

  return {
    alarm,
    setAlarm,
    background,
    setBackground,
    repeat,
    setRepeat,
    globalVolume,
    setGlobalVolume,
    backgroundVolume,
    setBackgrondVolume,
  };
}

export type TUsePomodoroSettingsReturn = ReturnType<typeof usePomodoroSettings>;
