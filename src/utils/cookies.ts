export const setCookie = (name: string, value: string, days: number) => {
    if (typeof document !== "undefined") {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
};

export const getCookie = (name: string): string | null => {
    if (typeof document !== "undefined") {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return value;
            }
        }
    }
    return null;
};

export const removeCookie = (name: string) => {
    if (typeof document !== "undefined") {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
};