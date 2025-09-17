import { UseFormRegister, FieldError, FieldValues, Path } from "react-hook-form";

export const Textarea = <T extends FieldValues>({
    label,
    id,
    placeholder,
    register,
    error,
    rows = 4,
}: {
    label: string;
    id: Path<T>;
    placeholder: string;
    register: UseFormRegister<T>;
    error?: FieldError;
    rows?: number;
}) => {
    return (
        <div>
            <label htmlFor={id as string} className="block mb-2 text-sm font-medium text-text-main dark:text-gray-100">
                {label}
            </label>
            <textarea
                id={id as string}
                rows={rows}
                {...register(id)}
                placeholder={placeholder}
                className={`
          bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary
          block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none
          ${error ? "border-error" : "border-gray-300"}
        `}
            />
            {error && <p className="mt-2 text-[var(--color-error)] text-sm text-error">{error.message}</p>}
        </div>
    );
};

