import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toSeconds } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Timer } from "../timer";
import { PomodoroSettings } from "../pomodoro-settings";
import { useAudio } from "@/hooks/use-audio";
import { usePomodoroSettings } from "../hooks/use-pomodoro-settings";
import { alarmSounds, backgroundSounds } from "../sounds";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeOff } from "lucide-react";
import { ClientOnly } from "@tanstack/react-router";

enum PomodoroMode {
	Pomodoro = "pomodoro",
	ShortBreak = "short-break",
	LongBreak = "long-break",
}

export function PomodoroPicker() {
	const [value, onValueChange] = useState<PomodoroMode>(PomodoroMode.Pomodoro);
	const pomodoroSettings = usePomodoroSettings();
	const alarmAudioControl = useAudio(
		alarmSounds[pomodoroSettings.alarm].default,
		{ volumeControl: pomodoroSettings.alarmVolume },
	);
	const backgroundAudioControl = useAudio(
		backgroundSounds[pomodoroSettings.background].default,
		{ volumeControl: pomodoroSettings.backgroundVolume },
	);
	const hasFinished = useRef(false);
	const hasRestarted = useRef(false);

	async function onStart() {
		hasRestarted.current = true;
		hasFinished.current = false;
		backgroundAudioControl.stop();
		alarmAudioControl.stop();
		const play = async () => {
			if (hasFinished.current) {
				return;
			}
			await backgroundAudioControl.forcePlay();
			play();
		};

		play();
	}

	function onReset() {
		backgroundAudioControl.stop();
	}

	function onStop() {
		backgroundAudioControl.stop();
	}

	function onFinish() {
		hasRestarted.current = false;
		hasFinished.current = true;
		backgroundAudioControl.stop();
		const play = async (repeat: number) => {
			if (repeat === 0 || hasRestarted.current === true) {
				return;
			}
			await alarmAudioControl.forcePlay();
			play(repeat - 1);
		};

		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.ready.then((registration) => {
				registration.showNotification('Timer ended');
			});
		}

		play(pomodoroSettings.repeat);
	}

	useEffect(() => {
		if ("Notification" in window) {
			Notification.requestPermission();
		}
	}, []);

	return (
		<>
			<ClientOnly fallback={null}>
				<div className="absolute top-5 right-1/2 transform translate-x-1/2 flex gap-2">
					<MuteButton {...pomodoroSettings.globalVolume}>All</MuteButton>
					<MuteButton {...backgroundAudioControl.volumeControl}>
						Background
					</MuteButton>
					<MuteButton {...alarmAudioControl.volumeControl}>Alarm</MuteButton>
				</div>
			</ClientOnly>

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
							<TabsTrigger value={PomodoroMode.LongBreak}>
								Long Break
							</TabsTrigger>
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
								initialTime={toSeconds(pomodoroSettings.timings.work)}
								onStart={onStart}
								onStop={onStop}
								onFinish={onFinish}
								onReset={onReset}
							/>
						</TabsContent>
						<TabsContent value={PomodoroMode.ShortBreak}>
							<Timer
								initialTime={toSeconds(pomodoroSettings.timings.shortBreak)}
								onStart={onStart}
								onStop={onStop}
								onFinish={onFinish}
								onReset={onReset}
							/>
						</TabsContent>
						<TabsContent value={PomodoroMode.LongBreak}>
							<Timer
								initialTime={toSeconds(pomodoroSettings.timings.longBreak)}
								onStart={onStart}
								onStop={onStop}
								onFinish={onFinish}
								onReset={onReset}
							/>
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</>
	);
}

function MuteButton({
	isMuted,
	unmute,
	mute,
	children,
}: React.PropsWithChildren & {
	mute: () => void;
	unmute: () => void;
	isMuted: boolean;
}) {
	return (
		<Button
			variant={isMuted ? "destructive" : "secondary"}
			className={isMuted ? "" : "opacity-50 hover:opacity-100"}
			onClick={() => {
				if (isMuted) {
					unmute();
					return;
				}
				mute();
			}}
		>
			{isMuted ? <VolumeOff /> : <Volume2 />}
			{children}
		</Button>
	);
}
