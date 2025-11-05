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
import { alarmSounds } from "../sounds";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAudioContext } from "@/providers/audio";
import { Spinner } from "@/components/ui/spinner";
import type { TUsePomodoroSettingsReturn } from "../hooks/use-pomodoro-settings";
import { Input } from "@/components/ui/input";

export function PomodoroSettings({
  alarm,
  setAlarm,
  repeat,
  setRepeat,
}: TUsePomodoroSettingsReturn) {
  const { gainNode } = useAudioContext();

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

          <div className="mt-4 flex gap-4">
            <Label className="flex flex-col items-start gap-2 flex-1">
              Alarm Sound
              <Select
                defaultValue={alarm}
                onValueChange={(value) => {
                  setAlarm(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alarm Sound" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(alarmSounds).map((value) => {
                    return (
                      <SelectItem
                        key={value.default}
                        value={value.default}
                        label={value.default
                          .split("/")
                          .pop()
                          ?.replace(/\.[^/.]+$/, "")}
                      >
                        <PlaySoundButton
                          soundUrl={value.default}
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
                value={repeat}
                onChange={(e) => setRepeat(Number(e.target.value))}
                max={5}
                min={1}
              />
            </Label>
          </div>

          <Label className="mt-4 flex flex-col items-start gap-2">
            Volume
            <Slider
              defaultValue={[gainNode.current?.gain.value ?? 0]}
              max={1.3}
              min={0}
              step={0.01}
              onValueChange={(value) => {
                if (!gainNode.current) return;
                gainNode.current.gain.value = value[0];
              }}
            />
          </Label>

          {/* <Label className="mt-4 flex flex-col items-start gap-2"> */}
          {/*   Side */}
          {/*   <Slider */}
          {/*     defaultValue={[panner.current?.pan.value ?? 0]} */}
          {/*     max={1} */}
          {/*     min={-1} */}
          {/*     onValueCommit={(value) => { */}
          {/*       if (!panner.current) return; */}
          {/*       panner.current.pan.value = value[0]; */}
          {/*     }} */}
          {/*     step={0.01} */}
          {/*   /> */}
          {/* </Label> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

const PlaySoundButton: React.FC<
  React.ComponentProps<typeof Button> & { soundUrl: string }
> = ({ soundUrl, ...props }) => {
  const audioControl = useAudio(soundUrl);
  return (
    <Button
      onClick={() => {
        audioControl.forcePlay();
      }}
      variant="secondary"
      {...props}
    >
      {audioControl.tryingToPlay.isProcessing ? <Spinner /> : <Play />}
    </Button>
  );
};
