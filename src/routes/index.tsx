import { ScrollArea } from "@/components/ui/scroll-area";
import { createFileRoute } from "@tanstack/react-router";
import { PomodoroPicker } from "./-components/pomodoro-picker";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <ScrollArea className="h-screen w-screen">
      <div className="h-screen flex flex-col">
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
