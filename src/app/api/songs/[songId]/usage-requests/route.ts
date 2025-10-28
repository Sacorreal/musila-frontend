import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://musila-develop-flke3.ondigitalocean.app";

export async function POST(request: NextRequest, { params }: { params: Promise<{ songId: string }> }) {
    try {
        const { songId } = await params;
        const authHeader = request.headers.get("authorization");

        if (!authHeader) {
            return NextResponse.json({ error: "Authorization required" }, { status: 401 });
        }

        const formData = await request.formData();

        const response = await fetch(`${API_URL}/songs/${songId}/usage-requests`, {
            method: "POST",
            headers: {
                Authorization: authHeader,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json({ error: errorData.message || "Failed to submit usage request" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
    }
}

