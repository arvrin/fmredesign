import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({
  size = 'md',
  message,
  fullscreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn(fullscreen ? 'min-h-screen' : 'min-h-[200px]', 'flex items-center justify-center', className)}>
      <div style={{ textAlign: 'center' }}>
        <div
          className={cn(
            'animate-spin rounded-full border-b-2 border-fm-magenta-600 mx-auto',
            sizeMap[size],
            message && 'mb-4'
          )}
        />
        {message && (
          <p className="text-fm-neutral-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  );

  return spinner;
}
