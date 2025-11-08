import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAudio } from "@/hooks/use-audio";
import { Settings, Play } from "lucide-react";
import { alarmSounds, backgroundSounds } from "../sounds";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import type { TUsePomodoroSettingsReturn } from "../hooks/use-pomodoro-settings";
import { Input } from "@/components/ui/input";
import { toSeconds } from "@/lib/utils";
import { TUseVolumeReturn } from "@/hooks/use-volume";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function PomodoroSettings(props: TUsePomodoroSettingsReturn) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="flex items-center justify-center  gap-1 sm:absolute sm:top-4 sm:right-4"
					variant="ghost"
				>
					<span className="sm:sr-only">Settings</span>
					<Settings />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Change background sounds and the timings.
					</DialogDescription>

					<Content {...props} />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

enum SettingsTabs {
	Global = "global",
	Background = "background",
	Alarm = "alarm",
}

const Content: React.FC<TUsePomodoroSettingsReturn> = (props) => {
	const [value, onValueChange] = useState<SettingsTabs>(SettingsTabs.Global);

	return (
		<div className="flex flex-col gap-4 mt-4">
			<Tabs
				defaultValue={SettingsTabs.Global}
				value={value}
				onValueChange={(v) => onValueChange(v as SettingsTabs)}
			>
				<TabsList>
					<TabsTrigger value={SettingsTabs.Global}>Global</TabsTrigger>
					<TabsTrigger value={SettingsTabs.Background}>Background</TabsTrigger>
					<TabsTrigger value={SettingsTabs.Alarm}>Alarm</TabsTrigger>
				</TabsList>
				<TabsContent value={SettingsTabs.Global} className="grid gap-4 mt-4">
					<Label className="flex flex-col items-start gap-2">
						Volume
						<Slider
							defaultValue={[props.globalVolume.value]}
							max={1.3}
							min={0}
							step={0.01}
							onValueChange={(value) => {
								props.globalVolume.set(value[0]);
							}}
						/>
					</Label>

					<div className="flex gap-2 ">
						<Label className="flex flex-col items-start gap-2 flex-1">
							Pomodoro
							<Input
								type="number"
								value={props.timings.work}
								onChange={(e) => {
									const n = Number(e.target.value);
									if (n < Number(e.target.min)) return;
									props.setTimings((v) => ({ ...v, work: n }));
								}}
								max={100}
								min={1}
							/>
						</Label>
						<Label className="flex flex-col items-start gap-2 flex-1">
							Short Break
							<Input
								type="number"
								value={props.timings.shortBreak}
								onChange={(e) => {
									const n = Number(e.target.value);
									if (n < Number(e.target.min)) return;
									props.setTimings((v) => ({ ...v, shortBreak: n }));
								}}
								max={100}
								min={1}
							/>
						</Label>
						<Label className="flex flex-col items-start gap-2 flex-1">
							Long Break
							<Input
								type="number"
								value={props.timings.longBreak}
								onChange={(e) => {
									const n = Number(e.target.value);
									if (n < Number(e.target.min)) return;
									props.setTimings((v) => ({ ...v, longBreak: n }));
								}}
								max={100}
								min={1}
							/>
						</Label>
					</div>
				</TabsContent>
				<TabsContent
					value={SettingsTabs.Background}
					className="grid gap-4 mt-4"
				>
					<Label className="flex flex-col items-start gap-2">
						Volume
						<Slider
							defaultValue={[props.backgroundVolume.value]}
							max={1}
							min={0}
							step={0.01}
							onValueChange={(value) => {
								props.backgroundVolume.set(value[0]);
							}}
						/>
					</Label>

					<Label className="flex flex-col items-start gap-2 flex-1">
						Noise
						<Select
							defaultValue={props.background}
							onValueChange={(value) => {
								props.setBackground(value);
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Background noise" />
							</SelectTrigger>

							<SelectContent>
								{Object.entries(backgroundSounds).map(([key, value]) => {
									return (
										<SelectItem
											key={value.default}
											value={key}
											label={key
												.split("/")
												.pop()
												?.replace(/\.[^/.]+$/, "")}
										>
											<PlaySoundButton
												soundUrl={value.default}
												volumeControl={props.backgroundVolume}
												className="ml-auto"
												onPointerUp={(e) => e.stopPropagation()}
											/>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</Label>
				</TabsContent>

				<TabsContent value={SettingsTabs.Alarm} className="grid gap-4 mt-4">
					<Label className="flex flex-col items-start gap-2">
						Volume
						<Slider
							defaultValue={[props.alarmVolume.value]}
							max={1}
							min={0}
							step={0.01}
							onValueChange={(value) => {
								props.alarmVolume.set(value[0]);
							}}
						/>
					</Label>

					<div className=" flex gap-4">
						<Label className="flex flex-col items-start gap-2 flex-1">
							Sound
							<Select
								defaultValue={props.alarm}
								onValueChange={(value) => {
									props.setAlarm(value);
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Alarm Sound" />
								</SelectTrigger>

								<SelectContent>
									{Object.entries(alarmSounds).map(([key, value]) => {
										return (
											<SelectItem
												key={value.default}
												value={key}
												label={key
													.split("/")
													.pop()
													?.replace(/\.[^/.]+$/, "")}
											>
												<PlaySoundButton
													soundUrl={value.default}
													volumeControl={props.alarmVolume}
													className="ml-auto"
													onPointerUp={(e) => e.stopPropagation()}
												/>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</Label>

						<Label className="flex flex-col items-start gap-2 flex-1">
							Repeat alarm
							<Input
								type="number"
								value={props.repeat}
								onChange={(e) => {
									const n = Number(e.target.value);
									if (n < Number(e.target.min)) return;
									props.setRepeat(n);
								}}
								max={5}
								min={1}
							/>
						</Label>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

const PlaySoundButton: React.FC<
	React.ComponentProps<typeof Button> & {
		soundUrl: string;
		previewLength?: number;
		volumeControl?: TUseVolumeReturn;
	}
> = ({ soundUrl, volumeControl, previewLength = toSeconds(0.1), ...props }) => {
	const audioControl = useAudio(soundUrl, {
		volumeControl,
		onStart() {
			setTimeout(() => {
				audioControl.stop();
			}, previewLength * 1000);
		},
	});

	return (
		<Button
			onClick={() => {
				audioControl.forcePlay();
			}}
			variant="secondary"
			{...props}
		>
			{audioControl.tryingToPlay.isProcessing ? <Spinner /> : <Play />}
			<span className="sr-only">
				{audioControl.tryingToPlay.isProcessing ? "Loading" : "Preview"}
			</span>
		</Button>
	);
};
