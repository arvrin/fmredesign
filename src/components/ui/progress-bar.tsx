import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  gradient?: boolean;
  className?: string;
}

const heightMap = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  size = 'md',
  showLabel = false,
  gradient = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-fm-neutral-500">Progress</span>
          <span className="text-xs font-medium text-fm-neutral-700">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-fm-neutral-200 rounded-full', heightMap[size])}>
        <div
          className={cn(
            'rounded-full transition-all duration-300',
            heightMap[size],
            gradient
              ? 'bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600'
              : 'bg-fm-magenta-600'
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
