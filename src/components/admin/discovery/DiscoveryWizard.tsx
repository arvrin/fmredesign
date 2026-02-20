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
import { adminToast } from '@/lib/admin/toast';
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
      adminToast.error('Failed to complete discovery');
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="secondary"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push('/admin/clients')}
                className="hidden sm:flex"
              >
                Exit Discovery
              </Button>
              <Button
                variant="secondary"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => router.push('/admin/clients')}
                className="sm:hidden"
              >
                Exit
              </Button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-fm-neutral-900 truncate">
                  Discovery: {session.companyFundamentals.companyName || 'New Client'}
                </h1>
                <p className="text-xs sm:text-sm text-fm-neutral-600">
                  Section {currentStep}/10: {DISCOVERY_SECTIONS[currentStep as keyof typeof DISCOVERY_SECTIONS]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {autoSaving && (
                <div className="flex items-center gap-2 text-sm text-fm-neutral-600">
                  <div className="animate-spin h-3 w-3 border border-fm-magenta-600 border-t-transparent rounded-full"></div>
                  <span className="hidden sm:inline">Auto-saving...</span>
                </div>
              )}

              {lastSaved && !autoSaving && (
                <p className="text-xs text-fm-neutral-500 hidden sm:block">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}

              <Button
                variant="secondary"
                icon={<FileText className="h-4 w-4" />}
                onClick={() => router.push(`/admin/discovery/${session.id}/report`)}
              >
                <span className="hidden sm:inline">Preview Report</span>
                <span className="sm:hidden">Report</span>
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

      {/* Mobile Step Indicator */}
      <div className="md:hidden bg-white border-b border-fm-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.entries(DISCOVERY_SECTIONS).map(([sectionNum, sectionName]) => {
            const num = parseInt(sectionNum);
            const isCompleted = session.completedSections.includes(num);
            const isCurrent = currentStep === num;
            return (
              <button
                key={sectionNum}
                onClick={() => setCurrentStep(num)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-fm-magenta-100 text-fm-magenta-800 border border-fm-magenta-200'
                    : isCompleted
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-fm-neutral-100 text-fm-neutral-600'
                }`}
              >
                {isCompleted ? <CheckCircle className="h-3 w-3" /> : null}
                {sectionNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Section Navigation Sidebar */}
        <div className="hidden md:block w-80 bg-white border-r border-fm-neutral-200 min-h-screen">
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
                variant="secondary"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
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