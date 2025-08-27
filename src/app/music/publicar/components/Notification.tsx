"use client";

import { useEffect, useState } from "react";
import { useNotification } from "../hooks/useNotification";
import { Notification as NotificationType } from "../types";

export function Notification() {
    const { notifications, removeNotification } = useNotification();

    const getNotificationStyles = (type: NotificationType["type"]) => {
        const baseStyles = "fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50 transition-all duration-300 border";

        switch (type) {
            case "success":
                return `${baseStyles} bg-accent text-white border-accent/20`;
            case "error":
                return `${baseStyles} bg-error text-white border-error/20`;
            case "warning":
                return `${baseStyles} bg-warning text-white border-warning/20`;
            case "info":
                return `${baseStyles} bg-primary text-white border-primary/20`;
            default:
                return `${baseStyles} bg-text-secondary text-white border-text-secondary/20`;
        }
    };

    const getIcon = (type: NotificationType["type"]) => {
        switch (type) {
            case "success":
                return "✓";
            case "error":
                return "✕";
            case "warning":
                return "⚠";
            case "info":
                return "ℹ";
            default:
                return "•";
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={getNotificationStyles(notification.type)}
                    style={{
                        animation: "slideIn 0.3s ease-out",
                    }}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                            <span className="text-lg font-bold">{getIcon(notification.type)}</span>
                            <div>
                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                <p className="text-sm opacity-90">{notification.message}</p>
                            </div>
                        </div>
                        <button onClick={() => removeNotification(notification.id)} className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity">
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
