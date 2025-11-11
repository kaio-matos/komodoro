import { ClientOnly } from "@tanstack/react-router";
import { Pause, Play, TimerResetIcon } from "lucide-react";
import { useEffect, useState } from "react";
import pressAudioURL from "@/assets/audio/extra/autoradio_button_press.wav?url";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/use-audio";
import { usePreciseInterval } from "@/hooks/use-precise-interval";
import { formatTime, toSeconds } from "@/lib/utils";

export function Timer({
	initialTime = toSeconds(25),
	onStart,
	onFinish,
	onStop,
	onReset,
}: {
	initialTime?: number;
	onStart?: () => void;
	onStop?: () => void;
	onFinish?: () => void;
	onReset?: () => void;
}) {
	const [time, setTime] = useState(initialTime);
	const pressAudio = useAudio(pressAudioURL);
	const timer = usePreciseInterval({
		callback() {
			setTime((time) => (time > 0 ? time - 1 : 0));
		},
		delay: 1000,
	});

	const hasFinished = time === 0;
	const isRunning = timer.isRunning;

	useEffect(() => {
		if (isRunning) {
			return;
		}
		setTime(initialTime);
	}, [initialTime]);

	useEffect(() => {
		if (hasFinished) {
			onFinish?.();
			timer.stop();
		}
	}, [hasFinished]);

	function start() {
		timer.start();
		pressAudio.forcePlay();
		onStart?.();
	}

	function pause() {
		pressAudio.forcePlay();
		timer.stop();
		onStop?.();
	}

	function reset() {
		pressAudio.forcePlay();
		timer.stop();
		setTime(initialTime);
		onReset?.();
	}

	return (
		<div className="flex flex-col gap-6">
			<ClientOnly
				fallback={<h3 className="text-5xl sm:text-8xl font-bold">--:--</h3>}
			>
				<h3
					className="text-(length:--text-size) sm:text-(length:--md-text-size) font-bold"
					style={{
						["--md-text-size" as any]: `${(6 * 4) / formatTime(time).length}rem`,
						["--text-size" as any]: `${(5 * 4) / formatTime(time).length}rem`,
					}}
				>
					{formatTime(time)}
				</h3>
			</ClientOnly>
			<div className="flex gap-2 mt-3">
				<Button
					className="flex-1"
					size="lg"
					onClick={() => start()}
					disabled={isRunning || hasFinished}
				>
					<Play />
					<span className="sr-only">Play</span>
				</Button>
				<Button
					variant="ghost"
					size="lg"
					onClick={() => reset()}
					disabled={time === initialTime}
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
