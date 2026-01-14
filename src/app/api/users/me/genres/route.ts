import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://musila-develop-flke3.ondigitalocean.app";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization") || "";
    const url = `${API_URL}/users/me/genres`;

    try {
        const res = await fetch(url, {
            headers: {
                authorization: authHeader,
            },
            cache: "no-store",
        });

        const contentType = res.headers.get("content-type") || "application/json";
        const text = await res.text();

        return new NextResponse(text, {
            status: res.status,
            headers: {
                "content-type": contentType,
            },
        });
    } catch {
        return NextResponse.json({ error: "Error al conectar con el servidor" }, { status: 500 });
    }
}

