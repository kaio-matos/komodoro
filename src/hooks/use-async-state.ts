import { useState } from "react";

export enum Status {
	Idle = "idle",
	Processing = "processing",
	Fulfilled = "fulfilled",
	Error = "error",
}

export function useAsyncFunction<T>({ fn }: { fn: () => Promise<T> }) {
	const [status, setStatus] = useState<Status>(Status.Idle);

	const isIdle = status === Status.Idle;
	const isProcessing = status === Status.Processing;
	const isFulfilled = status === Status.Fulfilled;
	const isError = status === Status.Error;

	async function execute() {
		setStatus(Status.Processing);
		try {
			await fn();
			setStatus(Status.Fulfilled);
		} catch {
			setStatus(Status.Error);
		}
	}

	return {
		status,
		execute,
		isIdle,
		isProcessing,
		isFulfilled,
		isError,
	};
}
