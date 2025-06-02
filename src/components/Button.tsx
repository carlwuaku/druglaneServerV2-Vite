import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

// Define button variants using class-variance-authority for better type safety
const buttonVariants = cva(
    // Base classes that apply to all buttons
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border shadow-sm hover:shadow-md active:scale-95",
    {
        variants: {
            variant: {
                blue: "bg-blue-500/90 border-blue-400 text-white hover:bg-blue-600 hover:border-blue-500 focus:ring-blue-500 hover:-translate-y-0.5 hover:shadow-blue-500/25",
                black: "bg-gray-800/90 border-gray-700 text-white hover:bg-gray-900 hover:border-gray-800 focus:ring-gray-600 hover:-translate-y-0.5 hover:shadow-gray-800/25",
                red: "bg-red-500/90 border-red-400 text-white hover:bg-red-600 hover:border-red-500 focus:ring-red-500 hover:-translate-y-0.5 hover:shadow-red-500/25",
                white: "bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 focus:ring-gray-300 hover:-translate-y-0.5 hover:shadow-gray-200/50 hover:text-gray-900"
            },
            size: {
                sm: "px-3 py-2 text-sm h-8",
                md: "px-4 py-2.5 text-sm h-10",
                lg: "px-6 py-3 text-base h-12",
                xl: "px-8 py-4 text-lg h-14"
            }
        },
        defaultVariants: {
            variant: "blue",
            size: "md"
        }
    }
);

// Button component props interface
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    loadingText?: string;
    asChild?: boolean;
}

// Utility function for combining classes (you'll need this in your utils)
// Add this to your src/lib/utils.ts file:
/*
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
*/

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            children,
            icon,
            iconPosition = 'left',
            loading = false,
            loadingText = 'Loading...',
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        const LoadingSpinner = () => (
            <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        );

        const buttonContent = loading ? (
            <>
                <LoadingSpinner />
                {loadingText}
            </>
        ) : (
            <>
                {icon && iconPosition === 'left' && (
                    <span className="transition-transform duration-200 group-hover:scale-110">
                        {icon}
                    </span>
                )}
                {children}
                {icon && iconPosition === 'right' && (
                    <span className="transition-transform duration-200 group-hover:scale-110">
                        {icon}
                    </span>
                )}
            </>
        );

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }), "group")}
                disabled={isDisabled}
                ref={ref}
                {...props}
            >
                {buttonContent}
            </button>
        );
    }
);

CustomButton.displayName = "Button";

export default CustomButton;