"use client";

import React from "react";

export default function PublicarLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            {/* Main Content */}
            <main className="flex-1">{children}</main>
        </div>
    );
}

