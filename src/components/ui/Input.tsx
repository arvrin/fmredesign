import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputType, setInputType] = React.useState(type);

    React.useEffect(() => {
      if (showPasswordToggle && type === 'password') {
        setInputType(showPassword ? 'text' : 'password');
      } else {
        setInputType(type);
      }
    }, [showPassword, type, showPasswordToggle]);

    const baseStyles = [
      'flex h-12 w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-base',
      'ring-offset-fm-neutral-50 placeholder:text-fm-neutral-500',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fm-magenta-700 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200',
    ];

    const errorStyles = error ? [
      'border-red-500 focus-visible:ring-red-500'
    ] : [
      'hover:border-fm-magenta-400'
    ];

    const inputClasses = cn(
      baseStyles,
      errorStyles,
      leftIcon && 'pl-10',
      (rightIcon || showPasswordToggle) && 'pr-10',
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-fm-neutral-900">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-500">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={inputClasses}
            ref={ref}
            {...props}
          />
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-500 hover:text-fm-neutral-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 6.25a.75.75 0 100-1.5.75.75 0 000 1.5z"/></svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-sm text-fm-neutral-600">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };