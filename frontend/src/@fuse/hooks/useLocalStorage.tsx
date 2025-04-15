import { useState } from 'react';

function useLocalStorage<T>(key: string) {
	function getValue(): T | null {
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	const [storedValue, setStoredValue] = useState<T | null>(getValue());

	const setValue = (value: T) => {
		try {
			setStoredValue(value); // update state
			window.localStorage.setItem(key, JSON.stringify(value)); // update storage
		} catch (error) {
			console.error(error);
		}
	};

	const removeValue = () => {
		try {
			setStoredValue(null); // update state
			window.localStorage.removeItem(key); // remove from storage
		} catch (error) {
			console.error(error);
		}
	};

	return { value: storedValue, setValue, getValue, removeValue };
}

export default useLocalStorage;
