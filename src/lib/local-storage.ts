export const LocalStorage = (() => {
	function getItem<T extends object>(key: string, fallback: T): T {
		try {
			const value = localStorage.getItem(key);
			if (!value) return fallback;
			return { ...fallback, ...JSON.parse(value) } as T;
		} catch {
			return fallback;
		}
	}

	function setItem(key: string, value: object) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	function removeItem(key: string) {
		localStorage.removeItem(key);
	}

	return {
		getItem,
		setItem,
		removeItem,
	};
})();
