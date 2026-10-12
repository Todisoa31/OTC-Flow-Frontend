export function encodeObject(obj: object): string {
    const jsonString = JSON.stringify(obj);
    return btoa(jsonString); // Encode the JSON string to Base64
}

export function decodeObject(encoded: string): object | null {
    try {
        const jsonString = atob(encoded); // Decode the Base64 string back to JSON
        return JSON.parse(jsonString); // Parse the JSON string back to an object
    } catch (error) {
        console.error("Failed to decode object:", error);
        return null;
    }
}