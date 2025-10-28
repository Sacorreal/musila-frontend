import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://musila-develop-flke3.ondigitalocean.app";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization") || "";

    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const queryParams = new URLSearchParams();
    if (page) queryParams.set("page", page);
    if (limit) queryParams.set("limit", limit);

    const queryString = queryParams.toString();
    const url = `${API_URL}/tracks/by-preferred-genres${queryString ? `?${queryString}` : ""}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const contentType = res.headers.get("content-type") || "application/json";
        const text = await res.text();

        return new NextResponse(text, {
            status: res.status,
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch {
        return NextResponse.json({ error: "Error al conectar con el servidor" }, { status: 500 });
    }
}
