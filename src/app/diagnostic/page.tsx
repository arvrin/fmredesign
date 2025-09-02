'use client';

import React from 'react';
import { Button } from '@/design-system/components/primitives/Button';

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-fm-neutral-100 p-8">
      <div className="fm-container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-display-xl font-bold text-fm-neutral-900 mb-4">
            Freaking Minds Design System Diagnostic
          </h1>
          <p className="text-lg text-fm-neutral-600">
            Testing custom Tailwind classes and design system components
          </p>
        </div>

        {/* Color Palette Testing */}
        <div className="mb-12">
          <h2 className="text-h2 font-bold text-fm-neutral-900 mb-6">Brand Colors</h2>
          
          {/* Magenta Colors */}
          <div className="mb-8">
            <h3 className="text-h3 font-semibold text-fm-neutral-800 mb-4">Magenta Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              <div className="bg-fm-magenta-50 p-4 rounded-md text-center border border-fm-neutral-300">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">50</p>
              </div>
              <div className="bg-fm-magenta-100 p-4 rounded-md text-center">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">100</p>
              </div>
              <div className="bg-fm-magenta-200 p-4 rounded-md text-center">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">200</p>
              </div>
              <div className="bg-fm-magenta-300 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">300</p>
              </div>
              <div className="bg-fm-magenta-400 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">400</p>
              </div>
              <div className="bg-fm-magenta-500 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">500</p>
              </div>
              <div className="bg-fm-magenta-600 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">600</p>
              </div>
              <div className="bg-fm-magenta-700 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">700</p>
              </div>
              <div className="bg-fm-magenta-800 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">800</p>
              </div>
              <div className="bg-fm-magenta-900 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">900</p>
              </div>
            </div>
          </div>

          {/* Orange Colors */}
          <div className="mb-8">
            <h3 className="text-h3 font-semibold text-fm-neutral-800 mb-4">Orange Accent</h3>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="bg-fm-orange-400 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">400</p>
              </div>
              <div className="bg-fm-orange-500 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">500</p>
              </div>
              <div className="bg-fm-orange-600 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">600</p>
              </div>
            </div>
          </div>

          {/* Neutral Colors */}
          <div className="mb-8">
            <h3 className="text-h3 font-semibold text-fm-neutral-800 mb-4">Neutral Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              <div className="bg-fm-neutral-50 p-4 rounded-md text-center border border-fm-neutral-300">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono text-fm-neutral-900">50</p>
              </div>
              <div className="bg-fm-neutral-100 p-4 rounded-md text-center border border-fm-neutral-300">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono text-fm-neutral-900">100</p>
              </div>
              <div className="bg-fm-neutral-200 p-4 rounded-md text-center">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono text-fm-neutral-900">200</p>
              </div>
              <div className="bg-fm-neutral-300 p-4 rounded-md text-center">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono text-fm-neutral-900">300</p>
              </div>
              <div className="bg-fm-neutral-400 p-4 rounded-md text-center">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono text-fm-neutral-900">400</p>
              </div>
              <div className="bg-fm-neutral-500 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">500</p>
              </div>
              <div className="bg-fm-neutral-600 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">600</p>
              </div>
              <div className="bg-fm-neutral-700 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">700</p>
              </div>
              <div className="bg-fm-neutral-800 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">800</p>
              </div>
              <div className="bg-fm-neutral-900 p-4 rounded-md text-center text-white">
                <div className="h-16 mb-2"></div>
                <p className="text-xs font-mono">900</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Testing */}
        <div className="mb-12">
          <h2 className="text-h2 font-bold text-fm-neutral-900 mb-6">Typography Scale</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-display-xl font-bold text-fm-magenta-700 mb-2">Display XL - 4rem</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">text-display-xl</p>
            </div>
            
            <div>
              <h3 className="text-display-lg font-bold text-fm-magenta-700 mb-2">Display LG - 3.5rem</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">text-display-lg</p>
            </div>
            
            <div>
              <h3 className="text-display-md font-bold text-fm-magenta-700 mb-2">Display MD - 3rem</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">text-display-md</p>
            </div>
            
            <div>
              <h1 className="text-h1 font-bold text-fm-neutral-900 mb-2">Heading 1 - 2.5rem</h1>
              <p className="text-sm text-fm-neutral-600 font-mono">text-h1</p>
            </div>
            
            <div>
              <h2 className="text-h2 font-bold text-fm-neutral-900 mb-2">Heading 2 - 2rem</h2>
              <p className="text-sm text-fm-neutral-600 font-mono">text-h2</p>
            </div>
            
            <div>
              <h3 className="text-h3 font-bold text-fm-neutral-900 mb-2">Heading 3 - 1.5rem</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">text-h3</p>
            </div>
            
            <div>
              <h4 className="text-h4 font-bold text-fm-neutral-900 mb-2">Heading 4 - 1.25rem</h4>
              <p className="text-sm text-fm-neutral-600 font-mono">text-h4</p>
            </div>
            
            <div>
              <h5 className="text-h5 font-bold text-fm-neutral-900 mb-2">Heading 5 - 1.125rem</h5>
              <p className="text-sm text-fm-neutral-600 font-mono">text-h5</p>
            </div>
            
            <div>
              <h6 className="text-h6 font-bold text-fm-neutral-900 mb-2">Heading 6 - 1rem</h6>
              <p className="text-sm text-fm-neutral-600 font-mono">text-h6</p>
            </div>
          </div>
        </div>

        {/* Button Components Testing */}
        <div className="mb-12">
          <h2 className="text-h2 font-bold text-fm-neutral-900 mb-6">Button Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-h4 font-semibold text-fm-neutral-800 mb-4">Primary Buttons</h3>
              <div className="space-y-3">
                <Button variant="primary" size="sm">Small Primary</Button>
                <Button variant="primary" size="md">Medium Primary</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-h4 font-semibold text-fm-neutral-800 mb-4">Secondary Buttons</h3>
              <div className="space-y-3">
                <Button variant="secondary" size="sm">Small Secondary</Button>
                <Button variant="secondary" size="md">Medium Secondary</Button>
                <Button variant="secondary" size="lg">Large Secondary</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-h4 font-semibold text-fm-neutral-800 mb-4">Accent Buttons</h3>
              <div className="space-y-3">
                <Button variant="accent" size="sm">Small Accent</Button>
                <Button variant="accent" size="md">Medium Accent</Button>
                <Button variant="accent" size="lg">Large Accent</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-h4 font-semibold text-fm-neutral-800 mb-4">Ghost Buttons</h3>
              <div className="space-y-3">
                <Button variant="ghost" size="sm">Small Ghost</Button>
                <Button variant="ghost" size="md">Medium Ghost</Button>
                <Button variant="ghost" size="lg">Large Ghost</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow and Effects Testing */}
        <div className="mb-12">
          <h2 className="text-h2 font-bold text-fm-neutral-900 mb-6">Shadows & Effects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-fm-neutral-50 p-6 rounded-lg shadow-fm-sm">
              <h3 className="text-h4 font-semibold text-fm-neutral-900 mb-2">Small Shadow</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">shadow-fm-sm</p>
            </div>
            
            <div className="bg-fm-neutral-50 p-6 rounded-lg shadow-fm-md">
              <h3 className="text-h4 font-semibold text-fm-neutral-900 mb-2">Medium Shadow</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">shadow-fm-md</p>
            </div>
            
            <div className="bg-fm-neutral-50 p-6 rounded-lg shadow-fm-lg">
              <h3 className="text-h4 font-semibold text-fm-neutral-900 mb-2">Large Shadow</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">shadow-fm-lg</p>
            </div>
            
            <div className="bg-fm-neutral-50 p-6 rounded-lg shadow-fm-xl">
              <h3 className="text-h4 font-semibold text-fm-neutral-900 mb-2">XL Shadow</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">shadow-fm-xl</p>
            </div>
          </div>
        </div>

        {/* Animation Testing */}
        <div className="mb-12">
          <h2 className="text-h2 font-bold text-fm-neutral-900 mb-6">Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-fm-magenta-50 p-6 rounded-lg border border-fm-magenta-200 animate-fade-in">
              <h3 className="text-h4 font-semibold text-fm-magenta-700 mb-2">Fade In</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">animate-fade-in</p>
            </div>
            
            <div className="bg-fm-magenta-50 p-6 rounded-lg border border-fm-magenta-200 animate-fade-in-up">
              <h3 className="text-h4 font-semibold text-fm-magenta-700 mb-2">Fade In Up</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">animate-fade-in-up</p>
            </div>
            
            <div className="bg-fm-magenta-50 p-6 rounded-lg border border-fm-magenta-200 animate-scale-in">
              <h3 className="text-h4 font-semibold text-fm-magenta-700 mb-2">Scale In</h3>
              <p className="text-sm text-fm-neutral-600 font-mono">animate-scale-in</p>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="text-center bg-fm-neutral-50 p-8 rounded-lg border border-fm-neutral-300">
          <h2 className="text-h2 font-bold text-fm-success mb-4">✅ Design System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-fm-success/10 text-fm-success border border-fm-success/20 rounded">
              Brand Colors: Working
            </div>
            <div className="p-3 bg-fm-success/10 text-fm-success border border-fm-success/20 rounded">
              Typography: Working
            </div>
            <div className="p-3 bg-fm-success/10 text-fm-success border border-fm-success/20 rounded">
              Components: Working
            </div>
            <div className="p-3 bg-fm-success/10 text-fm-success border border-fm-success/20 rounded">
              Animations: Working
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-fm-neutral-600 mb-4">
              If you can see all the colors, typography, and animations properly, 
              the Tailwind v4 configuration is working correctly!
            </p>
            <Button variant="primary" size="lg">
              🎉 Design System is Ready!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}