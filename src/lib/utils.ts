import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toSeconds(minutes: number) {
	return minutes * 60;
}

export function formatTime(seconds: number) {
	const secs = seconds % 60;
	const totalMinutes = Math.floor(seconds / 60);
	const mins = totalMinutes % 60;
	const totalHours = Math.floor(totalMinutes / 60);
	const hours = totalHours % 24;
	const days = Math.floor(totalHours / 24);

	const pad = (n: number) => n.toString().padStart(2, "0");

	if (days > 0) {
		// e.g. "2d 03:04:05"
		return `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
	}

	if (totalHours > 0) {
		// e.g. "03:04:05"
		return `${pad(totalHours)}:${pad(mins)}:${pad(secs)}`;
	}

	// fallback to "MM:SS"
	return `${pad(mins)}:${pad(secs)}`;
}
