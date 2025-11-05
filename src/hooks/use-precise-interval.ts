import { useEffect, useState } from "react";
import { useWorker } from "./use-web-worker";

export function usePreciseInterval({
  callback,
  delay,
}: {
  callback: () => void;
  delay?: number;
}) {
  const { worker } = useWorker(
    `
        let interval;
        self.onmessage = (e) => {
            switch (e.data.message) {
                case "start":
                    interval = setInterval(function () {
                        self.postMessage({message:"tick"});
                    }, e.data.delay);
                    break;
                case "stop":
                    clearInterval(interval);
                    break;
            }
        }
    `,
    { isScript: true },
  );
  const [isRunning, setIsRunning] = useState(false);

  function start() {
    worker.current?.postMessage({ message: "start", delay });
    setIsRunning(true);
  }

  function stop() {
    worker.current?.postMessage({ message: "stop" });
    setIsRunning(false);
  }

  useEffect(() => {
    const fn = (e: WorkerEventMap["message"]) => {
      if (e.data.message === "tick") {
        callback();
      }
    };
    worker.current?.addEventListener("message", fn);
    return () => worker.current?.removeEventListener("message", fn);
  }, [worker.current, callback]);

  return {
    start,
    stop,
    isRunning,
  };
}
