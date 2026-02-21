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
