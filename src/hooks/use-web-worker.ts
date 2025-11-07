import { useEffect, useRef } from "react";

export function useWorker(
	scriptCodeOrUrl: ConstructorParameters<typeof Worker>[0],
	{
		isScript,
		...options
	}: ConstructorParameters<typeof Worker>[1] & {
		isScript?: boolean;
	},
) {
	const worker = useRef<Worker | null>(null);

	useEffect(() => {
		if (isScript) {
			const blob = new Blob([scriptCodeOrUrl as string], {
				type: "text/javascript",
			});

			worker.current = new Worker(window.URL.createObjectURL(blob));
			return;
		}

		worker.current = new Worker(scriptCodeOrUrl, options);

		return () => {
			worker.current?.terminate();
		};
	}, []);

	return { worker };
}
