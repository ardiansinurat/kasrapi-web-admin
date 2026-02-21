/**
 * Shared Utilities
 */

/**
 * Generate a unique ID (UUID) using native crypto if available, 
 * with a fallback to a random string.
 * Used for idempotency keys.
 */
export const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID() as string;
    }
    // Fallback: combination of timestamp and random base36 string
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Validates if a string is a valid image URL ending with common extensions.
 */
export const isValidImageUrl = (url: string) => {
    if (!url) return false;
    try {
        const parsedUrl = new URL(url);
        const pattern = /\.(jpg|jpeg|png|webp|avif|gif)$/i;
        return pattern.test(parsedUrl.pathname);
    } catch {
        return false;
    }
};
