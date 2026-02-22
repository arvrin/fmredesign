import { cn } from '@/lib/utils';

interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AvatarInitials({ name, size = 'md', className }: AvatarInitialsProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-fm-magenta-100 flex items-center justify-center text-fm-magenta-600 font-semibold shrink-0',
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
