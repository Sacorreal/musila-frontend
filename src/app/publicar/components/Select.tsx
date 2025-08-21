import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ children, className = "", ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={`${className} bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600`}
            {...props}
        >
            {children}
        </select>
    );
});

Select.displayName = "Select";
