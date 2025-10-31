import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, TimerResetIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

function toMiliseconds(minutes: number) {
	return minutes * 60;
}

function formatTime(seconds: number) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function App() {
	return (
		<ScrollArea className="h-screen w-screen">
			<div className="h-screen flex flex-col">
				<header>
					<h1>Komodoro</h1>
				</header>
				<div className="w-full flex flex-col my-auto items-center justify-center text-center">
					<PomodoroPicker />
				</div>
			</div>
			<p>
				The Pomodoro Technique is a time management method developed by
				Francesco Cirillo in the late 1980s. It uses a timer to break work into
				intervals, traditionally 25 minutes in length, separated by short
				5-minute breaks. After completing four intervals, take a longer break of
				15-30 minutes. This technique helps to improve focus, reduce fatigue,
				and enhance productivity.
			</p>
		</ScrollArea>
	);
}

enum PomodoroMode {
	Pomodoro = "pomodoro",
	ShortBreak = "short-break",
	LongBreak = "long-break",
}

function PomodoroPicker() {
	const [value, onValueChange] = useState<PomodoroMode>(PomodoroMode.Pomodoro);

	return (
		<Tabs
			defaultValue={PomodoroMode.Pomodoro}
			value={value}
			onValueChange={(v) => {
				onValueChange(v as PomodoroMode);
			}}
			className="w-[450px]"
		>
			<Card className="px-5 ">
				<CardHeader>
					<div>
						<TabsList className="mx-auto">
							<TabsTrigger value={PomodoroMode.Pomodoro}>Pomodoro</TabsTrigger>
							<TabsTrigger value={PomodoroMode.ShortBreak}>
								Short Break
							</TabsTrigger>
							<TabsTrigger value={PomodoroMode.LongBreak}>
								Long Break
							</TabsTrigger>
						</TabsList>
					</div>
					<CardTitle className="text-center mt-4 text-2xl">
						{
							{
								[PomodoroMode.Pomodoro]: "Focus Time",
								[PomodoroMode.ShortBreak]: "Short Break",
								[PomodoroMode.LongBreak]: "Long Break",
							}[value]
						}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<TabsContent value={PomodoroMode.Pomodoro}>
						<Timer initialTime={toMiliseconds(25)} />
					</TabsContent>
					<TabsContent value={PomodoroMode.ShortBreak}>
						<Timer initialTime={toMiliseconds(5)} />
					</TabsContent>
					<TabsContent value={PomodoroMode.LongBreak}>
						<Timer initialTime={toMiliseconds(15)} />
					</TabsContent>
				</CardContent>
			</Card>
		</Tabs>
	);
}

function Timer({ initialTime = toMiliseconds(25) }: { initialTime?: number }) {
	const [time, setTime] = useState(initialTime);
	const [intervalId, setIntervalId] = useState<
		ReturnType<typeof setInterval> | undefined
	>(undefined);

	const hasStarted = time < initialTime;
	const isRunning = intervalId !== undefined;

	function start() {
		if (intervalId) return;

		setIntervalId(
			setInterval(() => {
				setTime((time) => (time > 0 ? time - 1 : 0));
			}, 1000),
		);
	}

	function pause() {
		clearInterval(intervalId);
		setIntervalId(undefined);
	}

	function reset() {
		pause();
		setTime(initialTime);
	}

	useEffect(() => {
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="flex flex-col gap-6">
			<h3 className="text-8xl font-bold">{formatTime(time)}</h3>
			<div className="flex gap-2 mt-3">
				<Button
					className="flex-1"
					size="lg"
					onClick={() => start()}
					disabled={isRunning}
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
