export const getItem = (key: string) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue != null) {
      return JSON.parse(storedValue); // Value is an object
    }
  } catch {
    // This catch block handles the known issues listed here: https://caniuse.com/#feat=namevalue-storage
    console.warn(
      'Could not access browser storage. Session will be lost when closing browser window',
    );
  }
  return null;
};

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
