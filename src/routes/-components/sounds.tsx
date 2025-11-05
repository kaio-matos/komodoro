type SoundImport = { default: string };

export const backgroundSounds = import.meta.glob<SoundImport>(
	"../../assets/audio/background/*",
	{
		eager: true,
		query: "?url",
	},
);
export const alarmSounds = import.meta.glob<SoundImport>(
	"../../assets/audio/alarm/*",
	{
		eager: true,
		query: "?url",
	},
);
