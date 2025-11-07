import { useEffect, useMemo, useState } from "react";
import { alarmSounds, backgroundSounds } from "../sounds";
import { LocalStorage } from "@/lib/local-storage";
import { useAudioContext } from "@/providers/audio";
import { useVolume } from "@/hooks/use-volume";

const alarms = Object.keys(alarmSounds);
const backgrounds = Object.keys(backgroundSounds);

export function usePomodoroSettings() {
	const { cache } = useAudioContext();
	const saved = useMemo(
		() =>
			LocalStorage.getItem("pomodoro-settings", {
				alarm: alarms[0],
				background: backgrounds[0],
				repeat: 2,
				globalVolume: 1,
				backgroundVolume: 0.1,
				alarmVolume: 1,
			}),
		[],
	);

	const [alarm, setAlarm] = useState(saved.alarm);
	const [background, setBackground] = useState(saved.background);
	const [repeat, setRepeat] = useState(saved.repeat);
	const globalVolume = useVolume(saved.globalVolume);
	const backgroundVolume = useVolume(saved.backgroundVolume);
	const alarmVolume = useVolume(saved.alarmVolume);

	function syncVolume() {
		cache.current.map.forEach((context) => {
			context.cached.setGlobalGain(globalVolume.value);
		});
	}

	syncVolume();

	useEffect(() => {
		LocalStorage.setItem("pomodoro-settings", {
			alarm,
			background,
			repeat,
			globalVolume: globalVolume.value,
			backgroundVolume: backgroundVolume.value,
			alarmVolume: alarmVolume.value,
		});
	}, [
		alarm,
		background,
		repeat,
		globalVolume.value,
		backgroundVolume.value,
		alarmVolume.value,
	]);

	useEffect(() => {
		syncVolume();
	}, [globalVolume.value]);

	return {
		alarm,
		setAlarm,
		background,
		setBackground,
		repeat,
		setRepeat,
		globalVolume,
		backgroundVolume,
		alarmVolume,
	};
}

export type TUsePomodoroSettingsReturn = ReturnType<typeof usePomodoroSettings>;
