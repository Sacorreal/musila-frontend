"use client";

import { useState, useCallback } from "react";
import { Notification } from "../../domains/song/types";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      type: Notification["type"],
      title: string,
      message: string,
      duration: number = 5000
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, newNotification]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("success", title, message, duration);
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("error", title, message, duration);
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("info", title, message, duration);
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration?: number) => {
      addNotification("warning", title, message, duration);
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
