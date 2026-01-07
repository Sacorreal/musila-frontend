const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";

const log = (...args: unknown[]) => {
    if (DEBUG) console.log("RC:", ...args);
};

export interface LicenseType {
    value: string;
    label: string;
}

export interface UsageRequestPayload {
    message: string;
    licenseType: string;
    file?: File;
}

export async function getUsageLicenseTypes(token: string): Promise<LicenseType[]> {
    try {
        log("Fetching license types...");
        const response = await fetch("/api/licenses/usage-types", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch license types: ${response.statusText}`);
        }

        const data = await response.json();
        log("License types fetched:", data);
        return data.items || [];
    } catch (error) {
        log("Error fetching license types:", error);
        throw error;
    }
}

export async function postSongUsageRequest(songId: string, formData: FormData, token: string): Promise<{ success: boolean; message?: string }> {
    try {
        log(`Submitting usage request for song ${songId}...`);
        const response = await fetch(`/api/songs/${songId}/usage-requests`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to submit request: ${response.statusText}`);
        }

        const data = await response.json();
        log("Usage request submitted successfully:", data);
        return { success: true, message: data.message };
    } catch (error) {
        log("Error submitting usage request:", error);
        throw error;
    }
}
