'use client';

import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap,
  Target,
  Rocket,
  Star,
  Globe,
  Heart,
  Trophy,
  Lightbulb,
  Search,
  MessageSquare,
  PenTool,
  BarChart3,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';


const backgroundIcons = [
  // Top section coverage
  { Icon: Sparkles, position: 'top-[5%] left-[8%]', animation: 'bg-float-orbital-left', delay: '0s', size: 'w-8 h-8' },
  { Icon: TrendingUp, position: 'top-[15%] right-[12%]', animation: 'bg-float-orbital-right', delay: '2s', size: 'w-10 h-10' },
  { Icon: Users, position: 'top-[25%] left-[15%]', animation: 'bg-float-wave-horizontal', delay: '4s', size: 'w-6 h-6' },
  
  // Mid-upper section
  { Icon: Zap, position: 'top-[35%] right-[20%]', animation: 'bg-float-diagonal', delay: '1s', size: 'w-8 h-8' },
  { Icon: Target, position: 'top-[30%] left-[5%]', animation: 'bg-float-pulse-move', delay: '6s', size: 'w-7 h-7' },
  { Icon: Rocket, position: 'top-[40%] right-[8%]', animation: 'bg-float-wave-vertical', delay: '3s', size: 'w-9 h-9' },
  
  // Center section
  { Icon: Star, position: 'top-[45%] left-[25%]', animation: 'bg-float-orbital-left', delay: '5s', size: 'w-6 h-6' },
  { Icon: Globe, position: 'top-[55%] right-[25%]', animation: 'bg-float-wave-horizontal', delay: '7s', size: 'w-8 h-8' },
  { Icon: Heart, position: 'top-[50%] left-[12%]', animation: 'bg-float-diagonal', delay: '2.5s', size: 'w-7 h-7' },
  
  // Mid-lower section  
  { Icon: Trophy, position: 'top-[65%] right-[15%]', animation: 'bg-float-orbital-right', delay: '4.5s', size: 'w-8 h-8' },
  { Icon: Lightbulb, position: 'top-[60%] left-[8%]', animation: 'bg-float-pulse-move', delay: '1.5s', size: 'w-9 h-9' },
  { Icon: Search, position: 'top-[70%] right-[5%]', animation: 'bg-float-wave-vertical', delay: '6.5s', size: 'w-6 h-6' },
  
  // Lower section
  { Icon: MessageSquare, position: 'top-[75%] left-[20%]', animation: 'bg-float-orbital-left', delay: '3.5s', size: 'w-7 h-7' },
  { Icon: PenTool, position: 'top-[80%] right-[18%]', animation: 'bg-float-diagonal', delay: '5.5s', size: 'w-8 h-8' },
  { Icon: BarChart3, position: 'top-[85%] left-[10%]', animation: 'bg-float-wave-horizontal', delay: '0.5s', size: 'w-6 h-6' },
  
  // Bottom section
  { Icon: Smartphone, position: 'top-[90%] right-[12%]', animation: 'bg-float-pulse-move', delay: '7.5s', size: 'w-7 h-7' },
  { Icon: Sparkles, position: 'top-[95%] left-[15%]', animation: 'bg-float-orbital-right', delay: '2.8s', size: 'w-8 h-8' },
  
  // Additional sparse coverage for very long pages
  { Icon: Star, position: 'top-[100%] right-[8%]', animation: 'bg-float-wave-vertical', delay: '4.8s', size: 'w-6 h-6' },
  { Icon: Globe, position: 'top-[110%] left-[12%]', animation: 'bg-float-diagonal', delay: '6.8s', size: 'w-8 h-8' },
  { Icon: Zap, position: 'top-[120%] right-[20%]', animation: 'bg-float-orbital-left', delay: '1.8s', size: 'w-7 h-7' },
];

interface BackgroundAnimationsProps {
  className?: string;
}

export function BackgroundAnimations({ className }: BackgroundAnimationsProps) {
  return (
    <div className={cn(
      'fixed inset-0 w-full h-full pointer-events-none overflow-hidden',
      'z-[-1]', // Behind all content
      className
    )}>
      {/* Floating Icons - Global Coverage */}
      {backgroundIcons.map(({ Icon, position, animation, delay, size }, index) => (
        <div
          key={index}
          className={cn(
            'absolute text-fm-magenta-300 hidden lg:block',
            position,
            animation,
            size
          )}
          style={{ animationDelay: delay }}
        >
          <Icon className="w-full h-full opacity-20 drop-shadow-sm" />
        </div>
      ))}
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute inset-0 bg-gradient-radial from-fm-magenta-50/10 via-transparent to-transparent"
          style={{
            background: `radial-gradient(circle at 20% 30%, rgba(179,41,104,0.03) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(255,133,93,0.02) 0%, transparent 50%),
                        radial-gradient(circle at 40% 90%, rgba(179,41,104,0.02) 0%, transparent 40%)`
          }}
        />
      </div>
    </div>
  );
}