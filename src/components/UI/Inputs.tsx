import { useState } from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

type LoginSchema = {
  email: string;
  password: string;
};

export const Input = ({
    label,
    id,
    type,
    placeholder,
    register,
    error,
  }: {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    register: UseFormRegister<LoginSchema>;
    error?: FieldError;
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div>
          <label htmlFor={id} className="block mb-2 text-sm font-medium text-text-main dark:text-gray-100">
            {label}
          </label>
          <div className="relative">
            <input
              type={inputType}
              id={id}
              {...register(id as 'email' | 'password')}
              placeholder={placeholder}
              className={`
                bg-secondary border text-text-main rounded-lg focus:ring-primary focus:border-primary
                block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                ${error ? 'border-error' : 'border-gray-300'}
              `}
            />
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-text-main dark:text-gray-400 "
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.8 1.8 0 0 1 1.76-1.12"></path>
                    <path d="M22 12s-3-7-10-7c-.89 0-1.73.16-2.5.49"></path>
                    <path d="M12 12a3 3 0 1 1-6 0"></path>
                    <path d="M2 2l20 20"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
          {error && (
            <p className="mt-2 text-sm text-error">{error.message}</p>
          )}
        </div>
      );
    };