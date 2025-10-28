const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";

export const trackEvent = (name: string, payload?: Record<string, unknown>) => {
    if (DEBUG) {
        console.log(`[Analytics] ${name}`, payload || "");
    }
};
