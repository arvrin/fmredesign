/**
 * Discovery Wizard Component
 * Multi-step form for comprehensive client discovery
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoverySession, DISCOVERY_SECTIONS } from '@/lib/admin/discovery-types';
import { DiscoveryService } from '@/lib/admin/discovery-service';
import { Button } from '@/design-system/components/primitives/Button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  FileText, 
  CheckCircle, 
  Circle,
  AlertCircle
} from 'lucide-react';

// Section Components
import { CompanyFundamentalsForm } from './sections/CompanyFundamentalsForm';
import { ProjectOverviewForm } from './sections/ProjectOverviewForm';
import { TargetAudienceForm } from './sections/TargetAudienceForm';
import { CurrentStateForm } from './sections/CurrentStateForm';
import { GoalsKPIsForm } from './sections/GoalsKPIsForm';
import { CompetitionMarketForm } from './sections/CompetitionMarketForm';
import { BudgetResourcesForm } from './sections/BudgetResourcesForm';
import { TechnicalRequirementsForm } from './sections/TechnicalRequirementsForm';
import { ContentCreativeForm } from './sections/ContentCreativeForm';
import { NextStepsForm } from './sections/NextStepsForm';

interface DiscoveryWizardProps {
  session: DiscoverySession;
  onUpdate: (session: DiscoverySession) => void;
  onComplete: () => void;
}

export function DiscoveryWizard({ session, onUpdate, onComplete }: DiscoveryWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(session.currentSection);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (session && session.status !== 'completed') {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [session]);

  const handleAutoSave = async () => {
    if (autoSaving) return;
    
    setAutoSaving(true);
    try {
      await DiscoveryService.updateDiscoverySession(session.id, {
        currentSection: currentStep,
        updatedAt: new Date().toISOString()
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSectionUpdate = async (sectionData: Partial<DiscoverySession>) => {
    const updatedSession = { ...session, ...sectionData };
    
    try {
      await DiscoveryService.updateDiscoverySession(session.id, sectionData);
      onUpdate(updatedSession);
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleNextStep = async () => {
    if (currentStep < 10) {
      const nextStep = currentStep + 1;
      const updatedCompletedSections = [...session.completedSections];
      
      if (!updatedCompletedSections.includes(currentStep)) {
        updatedCompletedSections.push(currentStep);
      }

      await DiscoveryService.updateDiscoverySession(session.id, {
        currentSection: nextStep,
        completedSections: updatedCompletedSections,
        updatedAt: new Date().toISOString()
      });

      setCurrentStep(nextStep);
      onUpdate({ 
        ...session, 
        currentSection: nextStep, 
        completedSections: updatedCompletedSections 
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteDiscovery = async () => {
    setIsLoading(true);
    try {
      const completedSession = {
        ...session,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        completedSections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      };

      await DiscoveryService.updateDiscoverySession(session.id, completedSession);
      onUpdate(completedSession);
      onComplete();
    } catch (error) {
      console.error('Error completing discovery:', error);
      alert('Failed to complete discovery');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentSection = () => {
    const commonProps = {
      session,
      onUpdate: handleSectionUpdate
    };

    switch (currentStep) {
      case 1:
        return <CompanyFundamentalsForm {...commonProps} />;
      case 2:
        return <ProjectOverviewForm {...commonProps} />;
      case 3:
        return <TargetAudienceForm {...commonProps} />;
      case 4:
        return <CurrentStateForm {...commonProps} />;
      case 5:
        return <GoalsKPIsForm {...commonProps} />;
      case 6:
        return <CompetitionMarketForm {...commonProps} />;
      case 7:
        return <BudgetResourcesForm {...commonProps} />;
      case 8:
        return <TechnicalRequirementsForm {...commonProps} />;
      case 9:
        return <ContentCreativeForm {...commonProps} />;
      case 10:
        return <NextStepsForm {...commonProps} />;
      default:
        return null;
    }
  };

  const getCompletionProgress = () => {
    return (session.completedSections.length / 10) * 100;
  };

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Header with progress */}
      <div className="bg-white border-b border-fm-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push('/admin/clients')}
              >
                Exit Discovery
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-fm-neutral-900">
                  Discovery Session: {session.companyFundamentals.companyName || 'New Client'}
                </h1>
                <p className="text-sm text-fm-neutral-600">
                  Section {currentStep} of 10: {DISCOVERY_SECTIONS[currentStep as keyof typeof DISCOVERY_SECTIONS]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {autoSaving && (
                <div className="flex items-center gap-2 text-sm text-fm-neutral-600">
                  <div className="animate-spin h-3 w-3 border border-fm-magenta-600 border-t-transparent rounded-full"></div>
                  Auto-saving...
                </div>
              )}
              
              {lastSaved && !autoSaving && (
                <p className="text-xs text-fm-neutral-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
              
              <Button
                variant="outline"
                icon={<FileText className="h-4 w-4" />}
                onClick={() => router.push(`/admin/discovery/${session.id}/report`)}
              >
                Preview Report
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-fm-neutral-600">
                Progress: {session.completedSections.length}/10 sections completed
              </span>
              <span className="text-sm font-medium text-fm-magenta-600">
                {getCompletionProgress().toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-fm-neutral-200 rounded-full h-2">
              <div 
                className="bg-fm-magenta-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Section Navigation Sidebar */}
        <div className="w-80 bg-white border-r border-fm-neutral-200 min-h-screen">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-fm-neutral-900 mb-4">Discovery Sections</h3>
            <div className="space-y-2">
              {Object.entries(DISCOVERY_SECTIONS).map(([sectionNum, sectionName]) => {
                const sectionNumber = parseInt(sectionNum);
                const isCompleted = session.completedSections.includes(sectionNumber);
                const isCurrent = currentStep === sectionNumber;
                
                return (
                  <button
                    key={sectionNum}
                    onClick={() => setCurrentStep(sectionNumber)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      isCurrent 
                        ? 'bg-fm-magenta-50 border border-fm-magenta-200' 
                        : 'hover:bg-fm-neutral-50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : isCurrent ? (
                      <AlertCircle className="h-4 w-4 text-fm-magenta-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-fm-neutral-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className={`text-sm font-medium ${
                        isCurrent ? 'text-fm-magenta-900' : 'text-fm-neutral-900'
                      }`}>
                        {sectionNum}. {sectionName}
                      </div>
                      {isCompleted && (
                        <div className="text-xs text-green-600">Completed</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {renderCurrentSection()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-fm-neutral-200">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleAutoSave}
                  disabled={autoSaving}
                  icon={<Save className="h-4 w-4" />}
                >
                  Save Progress
                </Button>
                
                {currentStep === 10 ? (
                  <Button
                    onClick={handleCompleteDiscovery}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Completing...' : 'Complete Discovery'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextStep}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Next Section
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}